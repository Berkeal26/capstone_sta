# 🧠 Smart Travel Assistant (GW Business Analytics Capstone - Group 5)

An **AI-powered travel planning assistant** that helps users plan trips seamlessly through natural conversation.  
Built as part of the **GW Business Analytics Capstone (Fall 2025)** by **Group 5**, this MVP demonstrates how conversational AI can simplify travel research and decision-making.

---

## 🚀 Project Overview

Modern travelers juggle multiple platforms for flights, hotels, weather, and activities.  
**Smart Travel Assistant** unifies these into one intelligent chatbot that delivers:
- Smart flight & hotel comparisons  
- Personalized destination insights  
- Weather and activity suggestions  
- Budget and preference optimization  

This MVP integrates **React**, **Firebase**, and **OpenAI GPT** to simulate real-world travel assistance.

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-------------|
| **Frontend** | React (Create React App) |
| **Hosting** | Firebase Hosting |
| **Backend API** | FastAPI (Python) |
| **AI Engine** | OpenAI GPT-3.5 Turbo (via backend) |
| **Design Workflow** | Figma → Locofy AI → React |
| **APIs** | Mock APIs (Flights, Hotels, Weather) |

---

## 💡 MVP Features

✅ Professional chat UI  
✅ OpenAI GPT-powered assistant (server-side)  
---

## 🔧 Local Development

Frontend (CRA):

1. Install deps: `npm install`
2. Create `.env.development` at project root:
   - `REACT_APP_API_BASE=http://localhost:8000`
3. Start React: `npm start`

Backend (FastAPI):

1. Ensure `backend/.env` exists with:
   - `OPENAI_API_KEY=sk-...`
2. Install deps:
   - `cd backend && pip install -r requirements.txt`
3. Run API: `uvicorn main:app --reload --port 8000`

---

## 🌐 Production Notes

- Firebase Hosting serves the React build. See `firebase.json`.
- We will later add a Hosting rewrite to a Cloud Run URL for `/api/**`.
- The OpenAI key is only read on the server from `backend/.env`. It is never exposed to the browser.

## Local Dev

1) Backend (FastAPI)
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

Test the API:
```bash
curl http://localhost:8000/api/health
curl -X POST http://localhost:8000/api/chat -H "Content-Type: application/json" -d '{"messages":[{"role":"user","content":"Say hi in 5 words"}]}'
```

2) Frontend (CRA)
```bash
npm install
npm start
```

3) Chat flow
Open http://localhost:3000 → Home → Start Planning → send a message.
You should receive a GPT-3.5-Turbo reply via the backend.

✅ Dynamic conversation flow  
✅ Structured response cards for travel info  
✅ Basic analytics and trip summaries  