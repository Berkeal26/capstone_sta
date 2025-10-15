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
| **Travel APIs** | Amadeus (Flights, Hotels, Activities) |
| **Design Workflow** | Figma → Locofy AI → React |
| **Caching** | In-memory session cache |

---

## 💡 MVP Features

✅ Professional chat UI  
✅ OpenAI GPT-powered assistant (server-side)  
✅ Real-time Amadeus API integration (flights, hotels, activities)  
✅ Intelligent intent detection  
✅ Session-based caching  
✅ Multi-turn conversation with context  
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
   - `AMADEUS_API_KEY=vQCIIzbiTzIv7NtAStYuOGWCR6rbg3kx`
   - `AMADEUS_API_SECRET=your_amadeus_secret_here`
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

---

## Render deployment

- Build command:
  - `pip install -r requirements.txt`
- Start command:
  - `uvicorn main:app --host 0.0.0.0 --port $PORT`
- Environment variables:
  - `OPENAI_API_KEY` (required)

Notes:
- Free tier instances may spin down; first request after idle can be slow.
- Ensure CORS allows `https://smart-travel-assistant-946f9.web.app` and `https://*.onrender.com`.
- Frontend production environment file (untracked) should set:
  - `.env.production` → `REACT_APP_API_BASE=https://RENDER_SERVICE_NAME.onrender.com`

✅ Dynamic conversation flow  
✅ Structured response cards for travel info  
✅ Basic analytics and trip summaries  

## 🚀 Amadeus API Integration

The chatbot now integrates with Amadeus travel APIs to provide real-time data:

### Features
- **Flight Search**: Find flights with real-time pricing and availability
- **Hotel Search**: Discover accommodations with current rates
- **Activity Search**: Get recommendations for things to do
- **Flight Inspiration**: Discover destinations within budget
- **Location Search**: Find airport and city codes

### Setup
1. Get Amadeus API credentials from [developers.amadeus.com](https://developers.amadeus.com)
2. Add credentials to `backend/.env`:
   ```
   AMADEUS_API_KEY=your_api_key
   AMADEUS_API_SECRET=your_api_secret
   ```
3. Test connection: `python test_amadeus_api.py`
4. Run full integration test: `python backend/test_amadeus_integration.py`

### API Quotas (Free Tier)
- Flight Offers: 2,000/month
- Flight Inspiration: 3,000/month  
- Hotel Search: 2,400/month
- Activities: 400/month
- Location Search: 7,000/month

**Total**: ~15,000 requests/month

For detailed integration documentation, see [backend/AMADEUS_INTEGRATION.md](backend/AMADEUS_INTEGRATION.md)  