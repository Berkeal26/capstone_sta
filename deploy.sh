#!/bin/bash

# Smart Travel Assistant Deployment Script

echo "🚀 Starting Smart Travel Assistant Deployment..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

echo "📦 Deploying Backend to Vercel..."
cd backend
vercel --prod

echo "✅ Backend deployed! Please note the URL and set it as REACT_APP_API_BASE"
echo "🔧 Don't forget to set OPENAI_API_KEY in Vercel dashboard"

cd ..

echo "🌐 Frontend deployment options:"
echo "1. Deploy to Vercel: vercel --prod"
echo "2. Deploy to Firebase: firebase deploy"
echo "3. Update .env.local with your backend URL"

echo "🎉 Deployment process completed!"
echo "📖 See DEPLOYMENT_GUIDE.md for detailed instructions"
