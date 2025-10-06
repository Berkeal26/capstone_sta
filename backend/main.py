from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
from openai import OpenAI

BASE_DIR = os.path.dirname(__file__)
ENV_PATH = os.path.join(BASE_DIR, ".env")
# Load local .env if present (local dev); in production, platform env vars should be used.
if os.path.exists(ENV_PATH):
    load_dotenv(dotenv_path=ENV_PATH)

api_key = os.getenv("OPENAI_API_KEY")
if not api_key:
    raise RuntimeError("OPENAI_API_KEY missing in backend/.env")

client = OpenAI(api_key=api_key)

app = FastAPI()
origins = [
    "http://localhost:3000",
    "https://smart-travel-assistant-946f9.web.app"
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    # Allow future Render apps like https://*.onrender.com
    allow_origin_regex=r"https://.*\\.onrender\\.com",
)


class ChatRequest(BaseModel):
    messages: list  # list of {role, content}


@app.get("/api/health")
def health():
    return {"ok": True}


@app.post("/api/chat")
def chat(req: ChatRequest):
    try:
        resp = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=req.messages,
            temperature=0.7,
        )
        reply = resp.choices[0].message.content
        return {"reply": reply}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Platforms like Render provide PORT; documented here for reference.
PORT = int(os.getenv("PORT", "8000"))


