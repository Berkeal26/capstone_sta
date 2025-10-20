# Smart Travel Assistant v2.0.0 - Quick Start Guide

## 🚀 **One-Command Setup**

```bash
cd /Users/edwinordonez/Capstone/capstone_sta
./start.sh
```

**That's it!** Open http://localhost:3000 in your browser.

## 🎯 **What You Get**

- ✅ **AI Chat Interface** - Intelligent travel planning
- ✅ **Flight Tracker Dashboard** - Ask about flights to see:
  - 🗺️ **Animated Flight Map** - Moving airplane with real-time progress
  - 📊 **Professional Price Charts** - Interactive Recharts visualizations
  - 📋 **Smart Flights Table** - Clean table with "Best Deal" badges
  - 🎨 **Wayfinder Design System** - Complete brand color integration
  - 🔄 **Split-view Layout** - Chat + dashboard side-by-side

## 🧪 **Test Commands**

In the chat, try these to see the dashboard:
- "Find flights to Paris"
- "Show me ticket prices"
- "Compare flight prices from NYC to LA"
- "Search for flights to Tokyo"
- "Book a flight to Barcelona"
- "Flights to London"
- "Ticket prices to Miami"

**The Flight Tracker Dashboard will appear in a split-view with:**
- ✈️ **Animated Flight Map** - Moving airplane with real-time progress indicator
- 📊 **Professional Price Charts** - Interactive line charts using Recharts
- 📋 **Smart Flights Table** - Clean table with "Best Deal" and "Non-stop" badges
- 🎨 **Wayfinder Colors** - Complete brand integration (`#004C8C`, `#00ADEF`, `#EAF9FF`)
- 🔄 **Dynamic Updates** - Charts and tables update based on your queries

## 🔧 **Troubleshooting**

### If Dashboard Doesn't Appear
1. Make sure you're using keywords like "flight", "price", "ticket"
2. Check browser console for errors
3. Restart: `./start.sh`

### If Server Won't Start
```bash
pkill -f "python3 -m http.server"
./start.sh
```

## 📁 **Project Structure**
```
capstone_sta/
├── src/                    # Source code
├── build/                  # Built app (auto-generated)
├── start.sh               # Quick start script
├── README.md              # Full documentation
└── package.json           # Dependencies
```

## 🌐 **Backend**
Already deployed at: `https://capstone-79wenhjg2-berkes-projects-f48a9605.vercel.app`

---
**Last Updated:** October 20, 2025
