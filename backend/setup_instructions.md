# Backend Setup Instructions

## Required Setup Steps

1. **Create a `.env` file in the backend directory** with your OpenAI API key:
   ```
   OPENAI_API_KEY=your-actual-openai-api-key-here
   ```

2. **Install dependencies**:
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

3. **Run the backend server**:
   ```bash
   uvicorn main:app --host 0.0.0.0 --port 8000 --reload
   ```

## Getting an OpenAI API Key

1. Go to https://platform.openai.com/
2. Sign up or log in to your account
3. Navigate to the API section
4. Create a new API key
5. Copy the key and paste it in your `.env` file

## Testing the Backend

Once running, you can test the health endpoint:
```bash
curl http://localhost:8000/api/health
```

This should return: `{"ok": true}`

## Common Issues

- **"OPENAI_API_KEY missing"**: Make sure you created the `.env` file with your actual API key
- **Connection errors**: Ensure your OpenAI API key is valid and has credits
- **CORS errors**: The backend is configured to allow requests from localhost:3000 and your Firebase hosting URL
