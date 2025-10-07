# Vercel Deployment Setup

## Prerequisites
1. Install Vercel CLI: `npm install -g vercel`
2. Create a `.env` file in the backend directory with your OpenAI API key:
   ```
   OPENAI_API_KEY=your_actual_api_key_here
   ```

## Local Testing
1. Navigate to backend directory: `cd backend`
2. Run locally: `vercel dev --listen 3001`
3. Test endpoints:
   - Health: http://localhost:3001/api/health
   - Root: http://localhost:3001/

## Deployment Steps
1. Login to Vercel: `vercel login`
2. Deploy: `vercel --prod`
3. Set environment variables in Vercel dashboard
4. Get production URL and update frontend

## Environment Variables to Set in Vercel
- `OPENAI_API_KEY`: Your OpenAI API key
