from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
import os
from openai import OpenAI
from datetime import datetime
import pytz

# Load environment variables
BASE_DIR = os.path.dirname(__file__)
ENV_PATH = os.path.join(BASE_DIR, ".env")
# Load local .env if present (local dev); in production, platform env vars should be used.
if os.path.exists(ENV_PATH):
    load_dotenv(dotenv_path=ENV_PATH)

api_key = os.getenv("OPENAI_API_KEY")
if not api_key:
    raise RuntimeError("OPENAI_API_KEY missing in environment variables")

print(f"OpenAI API key loaded: {api_key[:10]}..." if api_key else "No API key found")
client = OpenAI(api_key=api_key)

app = FastAPI(
    title="Smart Travel Assistant API",
    description="AI-powered travel planning API",
    version="1.0.0"
)

# CORS configuration for production
origins = [
    "http://localhost:3000",
    "https://smart-travel-assistant-946f9.web.app",
    "https://smart-travel-assistant-946f9.firebaseapp.com",
    # Allow Vercel frontend domains
    "https://*.vercel.app",
    # Allow any localhost for development
    "http://localhost:*",
    "https://localhost:*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    # Allow Vercel domains
    allow_origin_regex=r"https://.*\.vercel\.app",
)


class UserLocation(BaseModel):
    city: str = None
    region: str = None
    country: str = None
    lat: float = None
    lon: float = None

class Context(BaseModel):
    now_iso: str
    user_tz: str
    user_locale: str
    user_location: UserLocation

class ChatRequest(BaseModel):
    messages: list  # list of {role, content}
    context: Context = None


@app.get("/")
def root():
    return {
        "message": "Smart Travel Assistant API",
        "version": "1.0.0",
        "status": "running",
        "endpoints": {
            "health": "/api/health",
            "chat": "/api/chat"
        }
    }

@app.get("/api/health")
def health():
    return {"ok": True, "status": "healthy"}


def format_local_time(now_iso, user_tz):
    """Format the current time in the user's timezone"""
    try:
        dt = datetime.fromisoformat(now_iso.replace('Z', '+00:00'))
        user_tz_obj = pytz.timezone(user_tz)
        local_dt = dt.astimezone(user_tz_obj)
        return local_dt.strftime("%a, %d %b %Y • %I:%M %p (%Z)")
    except:
        return now_iso

def get_location_string(user_location):
    """Get a readable location string from user_location"""
    parts = []
    if user_location.city:
        parts.append(user_location.city)
    if user_location.country:
        parts.append(user_location.country)
    return ", ".join(parts) if parts else "Unknown location"

def create_system_prompt(context):
    """Create the Miles travel assistant system prompt with context"""
    local_time = format_local_time(context.now_iso, context.user_tz)
    location = get_location_string(context.user_location)
    
    system_prompt = f"""You are "Miles," a travel-planning assistant embedded in a web app. You must produce clean, skimmable answers and use the runtime context the app sends.

Runtime context (always provided by the app):
- now_iso: {context.now_iso}
- user_tz: {context.user_tz}
- user_locale: {context.user_locale}
- user_location: {location}
  - city: {context.user_location.city or 'null'}
  - region: {context.user_location.region or 'null'}
  - country: {context.user_location.country or 'null'}
  - lat: {context.user_location.lat or 'null'}
  - lon: {context.user_location.lon or 'null'}

Rules:
- Treat now_iso as the source of truth for "today," "tomorrow," etc. Render local time in user_tz.
- If any user_location field is missing, infer only from provided fields. If city and country are both null, ask one concise follow-up: "Which city are you in?"
- Never claim real-time booking. Provide guidance, options, and links if available.
- Default answer length ≈ 140–180 words unless the user asks for more detail.

Style standard (strict):
- Start with the answer in one tight sentence.
- Use # and ## headers, short bullets, and compact tables. No walls of text.
- Prefer numbered steps for itineraries. One line per stop. Include travel time hints only if helpful.
- Dates: render like "Tue, 14 Oct 2025 • 4:40 PM ({context.user_tz})".
- Currency and units: respect user_locale.
- If you need info, ask at most one question at the end.

Current local time: {local_time}
User location: {location}

Output patterns:
A) Greeting / First turn
# Ready to plan
- Local time: {local_time}
- Location: {location}

What's your destination, dates, budget, and must-haves?

B) Quick fact (e.g., "What's today's date?")
# Today
- {local_time}

C) 3–5 item option set (flights, hotels, activities with mock data or summaries)
# Top options for {{city,date-range}}
| Option | Why it fits | Est. price | Notes |
|---|---|---|---|
| 1. {{name}} | {{reason}} | {{price}}/night | {{1 short note}} |
| 2. ... | ... | ... | ... |

Next: Want me to refine by budget, neighborhood, or rating?

D) Day plan (clean itinerary)
# {{City}} {{N}}-day plan
## Day 1 (Mon)
- Morning: {{activity}} (≈ {{mins}})
- Lunch: {{place}} ({{cuisine}})
- Afternoon: {{activity}}
- Evening: {{activity}} | {{dinner}}

## Day 2
- ...

E) Clarification needed
# I need one detail
- Which city are you in, and what dates?

F) Safety or limitation
# Heads up
I can't book or hold prices. I can compare and draft the plan.

Behavior logic:
- Read context, compute local_time = now_iso → user_tz.
- If the user asks for date or time, return pattern B only.
- If the user gives a destination and dates, return pattern D; otherwise pattern A.
- For list requests, use pattern C with 3–5 rows. Keep reasons short.
- End with exactly one next-step question when appropriate.

Example rendering (with context):
Input: "What's today's date?"
Output:
# Today
- {local_time}"""
    
    return system_prompt

@app.post("/api/chat")
def chat(req: ChatRequest):
    try:
        # Validate that we have messages
        if not req.messages or len(req.messages) == 0:
            raise HTTPException(status_code=400, detail="No messages provided")
        
        # Make sure the last message is from the user
        if req.messages[-1]["role"] != "user":
            raise HTTPException(status_code=400, detail="Last message must be from user")
        
        # Create system prompt with context
        system_prompt = create_system_prompt(req.context) if req.context else "You are Miles, a helpful travel assistant."
        
        # Prepare messages with system prompt
        messages = [{"role": "system", "content": system_prompt}] + req.messages
        
        resp = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=messages,
            temperature=0.7,
            max_tokens=1000
        )
        
        if not resp.choices or len(resp.choices) == 0:
            raise HTTPException(status_code=500, detail="No response from OpenAI")
            
        reply = resp.choices[0].message.content
        if not reply:
            raise HTTPException(status_code=500, detail="Empty response from OpenAI")
            
        return {"reply": reply}
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error in chat endpoint: {str(e)}")  # Log the error for debugging
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

# Vercel handles port configuration automatically

# For Vercel deployment, we need to export the app
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)


