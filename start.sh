#!/bin/bash

# Smart Travel Assistant v2.0.0 - Flight Tracker Dashboard

echo "🚀 Starting Smart Travel Assistant v2.0.0 with Flight Tracker Dashboard..."

# Check if build exists
if [ ! -d "build" ]; then
    echo "📦 Building project with Wayfinder design system..."
    npm run build
fi

# Start the server
echo "🌐 Starting local server on http://localhost:3000"
echo "🎯 Flight Tracker Dashboard features:"
echo "   ✈️  Animated flight map with moving airplane"
echo "   📊 Professional price charts using Recharts"
echo "   📋 Smart flights table with 'Best Deal' badges"
echo "   🎨 Complete Wayfinder design system integration"
echo ""
echo "💡 Try asking: 'Find flights to Paris' to see the dashboard!"
echo "Press Ctrl+C to stop the server"
echo ""

cd build && python3 -m http.server 3000
