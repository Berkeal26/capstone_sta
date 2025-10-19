from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from dotenv import load_dotenv
import os
from openai import OpenAI
from datetime import datetime
import pytz
import logging
import uuid
import asyncio

# Import our services
from services.amadeus_service import AmadeusService
from services.intent_detector import IntentDetector
from services.cache_manager import CacheManager

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

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

# Initialize services
amadeus_service = AmadeusService()
intent_detector = IntentDetector()
cache_manager = CacheManager()

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
    city: Optional[str] = None
    region: Optional[str] = None
    country: Optional[str] = None
    lat: Optional[float] = None
    lon: Optional[float] = None

class Context(BaseModel):
    now_iso: str
    user_tz: str
    user_locale: str
    user_location: UserLocation

class ChatRequest(BaseModel):
    messages: list  # list of {role, content}
    context: Context = None
    session_id: str = None


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

@app.get("/api/test")
def test():
    return {"message": "Backend is working", "timestamp": datetime.now().isoformat()}

@app.post("/api/test-context")
async def test_context(ctx: Context):
    """Diagnostic endpoint to verify context parsing and processing"""
    local_time = format_local_time(ctx.now_iso, ctx.user_tz)
    loc_str = get_location_string(ctx.user_location)
    
    # Log the received context for debugging
    logger.info(
        "Received context: time=%s tz=%s city=%s country=%s lat=%s lon=%s",
        ctx.now_iso, ctx.user_tz,
        ctx.user_location.city, ctx.user_location.country,
        ctx.user_location.lat, ctx.user_location.lon,
    )
    
    return {
        "ok": True,
        "received": {
            "now_iso": ctx.now_iso,
            "user_tz": ctx.user_tz,
            "local_time": local_time,
            "location": loc_str,
            "lat": ctx.user_location.lat,
            "lon": ctx.user_location.lon,
            "city": ctx.user_location.city,
            "region": ctx.user_location.region,
            "country": ctx.user_location.country,
            "user_locale": ctx.user_locale
        }
    }


def format_local_time(now_iso, user_tz):
    """Format the current time in the user's timezone with UTC offset"""
    try:
        dt = datetime.fromisoformat(now_iso.replace('Z', '+00:00'))
        user_tz_obj = pytz.timezone(user_tz)
        local_dt = dt.astimezone(user_tz_obj)
        
        # Calculate UTC offset
        utc_offset = local_dt.strftime('%z')
        if utc_offset:
            # Format as UTC±HH:MM
            utc_offset_formatted = f"UTC{utc_offset[:3]}:{utc_offset[3:]}"
        else:
            utc_offset_formatted = "UTC+00:00"
        
        # Use ASCII bullet and include UTC offset
        return local_dt.strftime("%a, %d %b %Y - %I:%M %p").lstrip("0") + f" ({user_tz}, {utc_offset_formatted})"
    except Exception as e:
        logger.error(f"Error formatting local time: {e}")
        return now_iso

def get_location_string(user_location):
    """Get a readable location string from user_location"""
    parts = []
    if user_location.city:
        parts.append(user_location.city)
    if user_location.country:
        parts.append(user_location.country)
    return ", ".join(parts) if parts else "Unknown location"

def create_system_prompt(context, amadeus_data=None):
    """Create the Miles travel assistant system prompt with context and real-time data"""
    local_time = format_local_time(context.now_iso, context.user_tz)
    location = get_location_string(context.user_location)
    
    # Log sanitized context for debugging
    logger.info(
        "Creating system prompt - sanitized context: time=%s tz=%s city=%s country=%s lat=%s lon=%s",
        context.now_iso, context.user_tz,
        context.user_location.city, context.user_location.country,
        context.user_location.lat, context.user_location.lon,
    )
    
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
- Treat now_iso as the source of truth for "today," "tomorrow," etc. Use the formatted local time provided.
- If any user_location field is missing, infer only from provided fields. If city and country are both null, ask one concise follow-up: "Which city are you in?"
- Never claim real-time booking. Provide guidance, options, and links if available.
- ALWAYS provide immediate, actionable results. Do NOT ask for more details unless absolutely necessary.
- If you have real-time data, use it immediately. If you don't have specific data, provide general guidance with the information available.
- Default answer length ≈ 140–180 words unless the user asks for more detail.

VISUAL COMPONENTS:
- For multi-day itineraries, use ```itinerary``` code blocks with JSON data
- For location recommendations, use ```location``` code blocks with JSON data
- Always include visual elements for better user experience
- NEVER use specific days of the week (Mon, Tue, Wed, etc.) unless actual dates are provided by the user
- Use "Day 1", "Day 2", "Day 3" format instead of "Day 1 (Mon)"

Style standard (strict):
- Start with the answer in one tight sentence.
- Use # and ## headers, short bullets, and compact tables. No walls of text.
- Prefer numbered steps for itineraries. One line per stop. Include travel time hints only if helpful.
- Dates: ALWAYS use the exact formatted time provided: "{local_time}"
- Currency and units: respect user_locale.
- If you need info, ask at most one question at the end.

Current local time: {local_time}
User location: {location}

Output patterns:
A) Greeting / First turn
# Ready to plan
- Local time: {local_time}
- Location: {location}

I'm here to help you plan your perfect trip! Just let me know:
- Where would you like to go?
- When are you planning to travel?
- What's your budget?
- Any specific interests or must-see attractions?

I'll wait for your request before creating any itineraries.

B) Quick fact (e.g., "What's today's date?")
# Today
- {local_time}

C) 3–5 item option set (flights, hotels, activities with real data)
# Top options for {{city,date-range}}
| Option | Why it fits | Est. price | Notes |
|---|---|---|---|
| 1. {{name}} | {{reason}} | {{price}}/night | {{1 short note}} |
| 2. ... | ... | ... | ... |

Next: Want me to refine by budget, neighborhood, or rating?

D) Day plan (clean itinerary) - USE VISUAL COMPONENTS
# {{City}} {{N}}-day plan

For multi-day itineraries, ALWAYS include this visual component:

```itinerary
{{
  "days": [
    {{
      "day": 1,
      "time": "Day 1",
      "weather": "Sunny, 22°C",
      "activities": [
        {{
          "title": "Morning: Visit {{landmark}}",
          "description": "Explore the historic district and take photos",
          "duration": "2-3 hours"
        }},
        {{
          "title": "Lunch: {{restaurant}}",
          "description": "Traditional {{cuisine}} cuisine",
          "duration": "1 hour"
        }},
        {{
          "title": "Afternoon: {{activity}}",
          "description": "Cultural experience",
          "duration": "3 hours"
        }}
      ]
    }},
    {{
      "day": 2,
      "time": "Day 2", 
      "weather": "Partly cloudy, 20°C",
      "activities": [
        {{
          "title": "Morning: {{activity}}",
          "description": "Outdoor adventure",
          "duration": "4 hours"
        }}
      ]
    }}
  ]
}}
```

## Day 1
- Morning: {{activity}} (≈ {{mins}})
- Lunch: {{place}} ({{cuisine}})
- Afternoon: {{activity}}
- Evening: {{activity}} | {{dinner}}

## Day 2
- ...

E) Flight search results (with real data)
# Flights from {{origin}} to {{destination}}
## Best Options
| Airline | Price | Duration | Stops | Departure |
|---|---|---|---|---|
| {{airline}} | {{price}} | {{duration}} | {{stops}} | {{time}} |

F) Hotel search results (with real data) - USE VISUAL COMPONENTS
# Hotels in {{city}}

For location recommendations, ALWAYS include this visual component:

```location
[
  {{
    "name": "{{Hotel Name}}",
    "description": "Luxury hotel in {{area}} with {{amenities}}",
    "image": true,
    "rating": "4.8/5",
    "price": "${{price}}/night"
  }},
  {{
    "name": "{{Hotel Name 2}}",
    "description": "Boutique hotel near {{landmark}}",
    "image": true,
    "rating": "4.6/5", 
    "price": "${{price}}/night"
  }}
]
```

## Top Recommendations
| Hotel | Price/night | Rating | Location |
|---|---|---|---|
| {{name}} | {{price}} | {{stars}} | {{area}} |

G) Safety or limitation
# Heads up
I can't book or hold prices. I can compare and draft the plan.

Behavior logic:
- ALWAYS use the exact formatted local time provided: "{local_time}"
- If the user asks for date or time, return pattern B only.
- WAIT for explicit requests before generating itineraries. Do NOT proactively plan trips.
- Only create itineraries when the user specifically asks for them (e.g., "Plan a trip", "Create an itinerary", "Give me a 3-day plan").
- If the user gives a destination and dates, return pattern D with VISUAL COMPONENTS; otherwise pattern A.
- For flight requests, use pattern E with real flight data if available.
- For hotel requests, use pattern F with VISUAL COMPONENTS and real hotel data if available.
- For list requests, use pattern C with 3–5 rows. Keep reasons short.
- ALWAYS provide immediate results. Do NOT ask for more details unless absolutely necessary.
- If you have real-time data, use it immediately in your response.
- ALWAYS include visual components (```itinerary``` or ```location```) for multi-day plans and location recommendations.
- NEVER use specific days of the week (Mon, Tue, Wed) in itineraries unless the user provides specific dates.
- Use "Day 1", "Day 2", "Day 3" format for generic itineraries.
- NEVER start planning trips unless explicitly requested.

Example rendering (with context):
Input: "What's today's date?"
Output:
# Today
- {local_time}"""
    
    # Add real-time data if available
    if amadeus_data and not amadeus_data.get('error'):
        data_section = "\n\n🚨 CRITICAL: REAL-TIME TRAVEL DATA PROVIDED 🚨\n"
        data_section += "YOU MUST USE THIS REAL-TIME DATA IN YOUR RESPONSE. DO NOT PROVIDE GENERIC ADVICE.\n"
        data_section += "PRIORITIZE THIS DATA OVER ANY GENERAL KNOWLEDGE.\n\n"
        
        if 'flights' in amadeus_data:
            data_section += f"FLIGHTS ({amadeus_data.get('count', 0)} found):\n"
            for i, flight in enumerate(amadeus_data['flights'][:3], 1):
                price = flight.get('price', 'N/A')
                currency = flight.get('currency', 'USD')
                data_section += f"{i}. Price: {price} {currency}\n"
                
        elif 'hotels' in amadeus_data:
            data_section += f"HOTELS ({amadeus_data.get('count', 0)} found):\n"
            for i, hotel in enumerate(amadeus_data['hotels'][:3], 1):
                name = hotel.get('name', 'N/A')
                price = hotel.get('price', 'N/A')
                currency = hotel.get('currency', 'USD')
                data_section += f"{i}. {name} - {price} {currency}\n"
                
        elif 'activities' in amadeus_data:
            data_section += f"ACTIVITIES ({amadeus_data.get('count', 0)} found):\n"
            for i, activity in enumerate(amadeus_data['activities'][:3], 1):
                name = activity.get('name', 'N/A')
                price = activity.get('price', 'N/A')
                data_section += f"{i}. {name} - {price}\n"
                
        elif 'destinations' in amadeus_data:
            data_section += f"FLIGHT DESTINATIONS ({amadeus_data.get('count', 0)} found):\n"
            for i, dest in enumerate(amadeus_data['destinations'][:3], 1):
                destination = dest.get('destination', 'N/A')
                price = dest.get('price', 'N/A')
                data_section += f"{i}. {destination} - {price}\n"
        
        data_section += f"\nData fetched at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n"
        system_prompt += data_section
    elif amadeus_data and amadeus_data.get('error'):
        # Handle API errors
        error_msg = amadeus_data.get('error', 'Unknown error')
        system_prompt += f"\n\n⚠️ API Error: {error_msg}\n"
        system_prompt += "Please try rephrasing your request with specific dates and locations, or try a different search.\n"
    
    return system_prompt

@app.post("/api/chat")
async def chat(req: ChatRequest):
    try:
        # Validate that we have messages
        if not req.messages or len(req.messages) == 0:
            raise HTTPException(status_code=400, detail="No messages provided")
        
        # Make sure the last message is from the user
        if req.messages[-1]["role"] != "user":
            raise HTTPException(status_code=400, detail="Last message must be from user")
        
        # Generate session ID if not provided
        session_id = req.session_id or str(uuid.uuid4())
        
        # Get the user's latest message
        user_message = req.messages[-1]["content"]
        
        # Detect intent from user message
        logger.info(f"Analyzing message for session {session_id}: {user_message[:100]}...")
        intent = await intent_detector.analyze_message(user_message, req.messages[:-1])
        
        # Debug logging for intent detection
        logger.info(f"Intent detection result: type={intent['type']}, confidence={intent['confidence']}, has_required_params={intent['has_required_params']}")
        logger.info(f"Extracted parameters: {intent['params']}")
        
        amadeus_data = None
        
        # If travel intent detected and has required parameters, fetch data
        if intent["type"] != "general" and intent["has_required_params"] and intent["confidence"] > 0.5:
            logger.info(f"Detected {intent['type']} intent with confidence {intent['confidence']}")
            
            # Check cache first
            cache_key_params = intent["params"].copy()
            cache_key_params["type"] = intent["type"]
            
            cached_data = cache_manager.get(session_id, intent["type"], cache_key_params)
            
            if cached_data:
                logger.info("Using cached data")
                amadeus_data = cached_data
            else:
                logger.info("Fetching fresh data from Amadeus API")
                try:
                    # Call appropriate Amadeus API based on intent
                    if intent["type"] == "flight_search":
                        # If origin/destination are not IATA codes, try to get them via location search
                        origin = intent["params"]["origin"]
                        destination = intent["params"]["destination"]
                        
                        # Check if we need to convert city names to IATA codes
                        if not self._is_iata_code(origin):
                            logger.info(f"Converting origin '{origin}' to IATA code")
                            location_result = await amadeus_service.get_airport_city_search(origin)
                            if location_result and not location_result.get('error'):
                                # Use the first result's IATA code
                                origin = location_result[0].get('iataCode', origin)
                                logger.info(f"Converted origin to IATA code: {origin}")
                        
                        if not self._is_iata_code(destination):
                            logger.info(f"Converting destination '{destination}' to IATA code")
                            location_result = await amadeus_service.get_airport_city_search(destination)
                            if location_result and not location_result.get('error'):
                                # Use the first result's IATA code
                                destination = location_result[0].get('iataCode', destination)
                                logger.info(f"Converted destination to IATA code: {destination}")
                        
                        amadeus_data = await amadeus_service.search_flights(
                            origin=origin,
                            destination=destination,
                            departure_date=intent["params"]["departure_date"],
                            return_date=intent["params"].get("return_date"),
                            adults=intent["params"].get("adults", 1),
                            max_price=intent["params"].get("max_price")
                        )
                    elif intent["type"] == "hotel_search":
                        amadeus_data = await amadeus_service.search_hotels(
                            city_code=intent["params"]["destination"],
                            check_in=intent["params"]["check_in"],
                            check_out=intent["params"]["check_out"],
                            adults=intent["params"].get("adults", 1),
                            radius=intent["params"].get("radius", 50),
                            price_range=intent["params"].get("price_range")
                        )
                    elif intent["type"] == "activity_search":
                        if "latitude" in intent["params"] and "longitude" in intent["params"]:
                            amadeus_data = await amadeus_service.search_activities(
                                latitude=float(intent["params"]["latitude"]),
                                longitude=float(intent["params"]["longitude"]),
                                radius=intent["params"].get("radius", 20)
                            )
                        else:
                            # For city-based activity search, we'd need to get coordinates first
                            logger.warning("Activity search requires coordinates")
                            amadeus_data = {"error": "Activity search requires location coordinates"}
                    elif intent["type"] == "flight_inspiration":
                        amadeus_data = await amadeus_service.get_flight_inspiration(
                            origin=intent["params"]["origin"],
                            max_price=intent["params"].get("max_price"),
                            departure_date=intent["params"].get("departure_date")
                        )
                    elif intent["type"] == "location_search":
                        amadeus_data = await amadeus_service.get_airport_city_search(
                            keyword=intent["params"]["keyword"]
                        )
                    
                    # Cache the response
                    if amadeus_data and not amadeus_data.get('error'):
                        cache_manager.set(session_id, intent["type"], cache_key_params, amadeus_data)
                        logger.info(f"Cached {intent['type']} data for session {session_id}")
                        
                except Exception as e:
                    logger.error(f"Amadeus API call failed: {e}")
                    amadeus_data = {"error": f"API call failed: {str(e)}"}
                    
        # Add fallback for when no data is fetched but intent was detected
        elif intent["type"] != "general" and intent["confidence"] > 0.5:
            logger.warning(f"Intent detected but no API call made: {intent}")
            amadeus_data = {"error": "Unable to fetch real-time data. Please try rephrasing your request with specific dates and locations."}
        
        # Create system prompt with context and real-time data
        system_prompt = create_system_prompt(req.context, amadeus_data) if req.context else "You are Miles, a helpful travel assistant."
        
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
            
        return {
            "reply": reply,
            "session_id": session_id,
            "intent_detected": intent["type"],
            "data_fetched": amadeus_data is not None and not amadeus_data.get('error')
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in chat endpoint: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

def _is_iata_code(code: str) -> bool:
    """Check if a string is likely an IATA code (3 letters)"""
    if not code:
        return False
    return len(code) == 3 and code.isalpha() and code.isupper()

# Vercel handles port configuration automatically

# For Vercel deployment, we need to export the app
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)


