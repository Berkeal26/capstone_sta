// Test script for deployment verification
const https = require('https');

// Configuration - Update these URLs after deployment
const BACKEND_URL = 'https://your-backend-url.vercel.app';
const FRONTEND_URL = 'https://your-frontend-url.vercel.app';

async function testBackend() {
  console.log('🧪 Testing Backend...');
  
  try {
    // Test health endpoint
    const healthResponse = await fetch(`${BACKEND_URL}/api/health`);
    const healthData = await healthResponse.json();
    console.log('✅ Health check:', healthData);
    
    // Test root endpoint
    const rootResponse = await fetch(BACKEND_URL);
    const rootData = await rootResponse.json();
    console.log('✅ Root endpoint:', rootData);
    
    // Test chat endpoint
    const chatResponse = await fetch(`${BACKEND_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [{ role: 'user', content: 'Hello, test message' }]
      })
    });
    
    if (chatResponse.ok) {
      const chatData = await chatResponse.json();
      console.log('✅ Chat endpoint working:', chatData.reply ? 'Response received' : 'No response');
    } else {
      console.log('❌ Chat endpoint failed:', chatResponse.status, chatResponse.statusText);
    }
    
  } catch (error) {
    console.log('❌ Backend test failed:', error.message);
  }
}

async function testFrontend() {
  console.log('🧪 Testing Frontend...');
  
  try {
    const response = await fetch(FRONTEND_URL);
    if (response.ok) {
      console.log('✅ Frontend is accessible');
    } else {
      console.log('❌ Frontend test failed:', response.status);
    }
  } catch (error) {
    console.log('❌ Frontend test failed:', error.message);
  }
}

async function runTests() {
  console.log('🚀 Starting deployment tests...');
  console.log('Backend URL:', BACKEND_URL);
  console.log('Frontend URL:', FRONTEND_URL);
  console.log('');
  
  await testBackend();
  console.log('');
  await testFrontend();
  
  console.log('');
  console.log('🎉 Testing completed!');
  console.log('📖 Check the results above and fix any issues before going live.');
}

// Run tests
runTests();
