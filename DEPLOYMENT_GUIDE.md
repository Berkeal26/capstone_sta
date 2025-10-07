# Smart Travel Assistant - Vercel Deployment Guide

## Overview
This guide will help you deploy your Smart Travel Assistant application using Vercel for both frontend and backend.

## Prerequisites
- Node.js and npm installed
- Vercel CLI installed (`npm install -g vercel`)
- OpenAI API key
- GitHub repository with your code

## Step 1: Backend Deployment to Vercel

### 1.1 Login to Vercel
```bash
cd backend
vercel login
```
Follow the browser authentication process.

### 1.2 Deploy Backend
```bash
vercel --prod
```
This will:
- Create a new Vercel project
- Deploy your FastAPI backend
- Provide you with a production URL (e.g., `https://your-backend-name.vercel.app`)

### 1.3 Set Environment Variables
In the Vercel dashboard:
1. Go to your project settings
2. Navigate to "Environment Variables"
3. Add: `OPENAI_API_KEY` = your_actual_openai_api_key

### 1.4 Test Backend
Visit your backend URL:
- Health check: `https://your-backend-url.vercel.app/api/health`
- API info: `https://your-backend-url.vercel.app/`

## Step 2: Frontend Configuration

### 2.1 Update Environment Variables
Create a `.env.local` file in the root directory:
```
REACT_APP_API_BASE=https://your-backend-url.vercel.app
```

### 2.2 Deploy Frontend to Vercel (Option A)
```bash
# From project root
vercel --prod
```

### 2.3 Update Firebase Hosting (Option B - Recommended)
Since you already have Firebase working:
1. Update your Firebase project with the new backend URL
2. Redeploy to Firebase: `firebase deploy`

## Step 3: Testing

### 3.1 Test Backend Endpoints
```bash
# Health check
curl https://your-backend-url.vercel.app/api/health

# Test chat endpoint
curl -X POST https://your-backend-url.vercel.app/api/chat \
  -H "Content-Type: application/json" \
  -d '{"messages": [{"role": "user", "content": "Hello"}]}'
```

### 3.2 Test Frontend
1. Open your deployed frontend
2. Navigate to the chat page
3. Send a test message
4. Verify the response comes from your Vercel backend

## Step 4: Production URLs

After deployment, you'll have:
- **Backend**: `https://your-backend-name.vercel.app`
- **Frontend**: `https://your-frontend-name.vercel.app` (or your Firebase URL)

## Troubleshooting

### Common Issues:
1. **CORS Errors**: Make sure your backend CORS settings include your frontend domain
2. **Environment Variables**: Ensure `OPENAI_API_KEY` is set in Vercel
3. **API Calls Failing**: Check that `REACT_APP_API_BASE` is set correctly

### Debug Steps:
1. Check Vercel function logs in the dashboard
2. Test backend endpoints directly
3. Verify environment variables are set
4. Check browser network tab for API calls

## Cost Analysis
- **Vercel Free Tier**: 100GB bandwidth, 100GB-hours function execution
- **Firebase Hosting**: Free
- **Total Cost**: $0/month

## Next Steps
1. Set up custom domain (optional)
2. Configure monitoring and analytics
3. Set up automatic deployments from GitHub
