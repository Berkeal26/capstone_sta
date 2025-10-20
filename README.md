# Smart Travel Assistant v2.0.0

AI-powered travel planning assistant with interactive flight dashboard, price analysis, and intelligent chat interface.

## 🚀 **ONE-COMMAND START**

```bash
cd /Users/edwinordonez/Capstone/capstone_sta
./start.sh
```

**Open:** http://localhost:3000

## 🎯 **What You Get**

- 🤖 **AI Chat Interface** - Intelligent travel planning
- 🗺️ **Flight Tracker Dashboard** - Ask about flights to see:
  - **Animated Flight Map** - Moving airplane with real-time progress
  - **Professional Price Charts** - Interactive line charts using Recharts
  - **Smart Flights Table** - Clean table with "Best Deal" badges
  - **Split-view Layout** - Chat interface + dashboard side-by-side
  - **Wayfinder Design System** - Complete brand color integration

## 🧪 **Test It Now**

In the chat, try:
- "Find flights to Paris"
- "Show me ticket prices"
- "Compare flight prices from NYC to LA"
- "Search for flights to Tokyo"

## 📋 **Prerequisites**
- Node.js 18+ (use `nvm use 18` if needed)
- Python 3.11+
- Modern web browser

## 🔧 **Alternative Start Methods**

### Method 1: Quick Start (Recommended)
```bash
./start.sh
```

### Method 2: Development Mode
```bash
npm install
npm start
```

### Method 3: Build & Serve
```bash
npm run build
cd build && python3 -m http.server 3000
```

## ✨ Features

### v2.0.0 New Features
- 🎯 **Flight Tracker Dashboard**: Complete interactive flight search experience
- 🗺️ **Animated Flight Map**: Moving airplane with real-time progress indicator
- 📊 **Professional Price Charts**: Recharts integration with smooth visualizations
- 📋 **Smart Flights Table**: Clean table design with "Best Deal" badges
- 🎨 **Wayfinder Design System**: Complete brand color integration (`#004C8C`, `#00ADEF`, `#EAF9FF`)
- 🤖 **AI Chat Interface**: Intelligent travel planning assistant
- 📱 **Responsive Design**: Works on all devices
- 🔄 **Dynamic Updates**: Charts and tables update based on chat queries

### Core Features
- AI-powered travel recommendations
- Real-time flight data integration
- Location detection and personalization
- Multi-destination trip planning
- Price comparison and optimization
- Weather and safety information

## 🏗️ Project Structure

```
src/
├── components/
│   ├── dashboard/           # Flight Tracker Dashboard components
│   │   ├── FlightDashboard.jsx    # Main dashboard with split-view
│   │   ├── FlightMap.jsx          # Animated flight map with moving airplane
│   │   ├── PriceChart.jsx         # Professional Recharts integration
│   │   └── FlightsTable.jsx       # Smart table with badges
│   ├── ui/                  # Reusable UI components
│   │   ├── card.jsx              # Card, CardHeader, CardContent, etc.
│   │   ├── badge.jsx             # Badge component with variants
│   │   ├── table.jsx             # Table components
│   │   └── scroll-area.jsx       # ScrollArea component
│   ├── ChatInput.jsx
│   ├── ChatMockup.jsx
│   └── MessageBubble.jsx
├── pages/
│   ├── Home.jsx            # Landing page
│   └── Chat.jsx            # Chat interface with dashboard integration
├── styles/
│   ├── globals.css         # Wayfinder design system colors
│   └── site.css            # Custom CSS with utility classes
└── App.js                  # Main app with dashboard routing
```

## 🔧 Backend

The backend is deployed and running at:
```
https://capstone-79wenhjg2-berkes-projects-f48a9605.vercel.app
```

## 🧪 Testing

1. **Home Page**: Modern landing page with feature overview
2. **Chat Interface**: Click "Start Planning" to access AI chat
3. **Dashboard**: Ask about flights to see the interactive dashboard:
   - "Find flights to Paris"
   - "Compare flight prices from NYC to LA"
   - "Search for flights to Tokyo"

## 📦 Build

```bash
npm run build
```

The build output will be in the `build/` directory.

## 🚀 Deployment

The app is ready for deployment to any static hosting service:
- Vercel
- Netlify
- GitHub Pages
- Firebase Hosting

## 🎯 Version History

### v2.0.0 (Current)
- Added interactive flight dashboard
- Implemented price trend visualization
- Created flight map animations
- Enhanced chat interface with split-view
- Improved UI/UX design
- Added responsive layout

### v1.0.0
- Basic chat interface
- AI travel recommendations
- Backend API integration

---

**Built with React, Tailwind CSS, and modern web technologies.**