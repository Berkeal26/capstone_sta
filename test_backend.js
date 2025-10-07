// Test script for the deployed backend
const https = require('https');

const backendUrl = 'https://capstone-rdtp3b14i-berkes-projects-f48a9605.vercel.app';

async function testBackend() {
  console.log('🧪 Testing deployed backend...');
  console.log('Backend URL:', backendUrl);
  
  try {
    // Test health endpoint
    console.log('\n1. Testing health endpoint...');
    const healthResponse = await fetch(`${backendUrl}/api/health`);
    const healthData = await healthResponse.json();
    console.log('✅ Health check result:', healthData);
    
    // Test root endpoint
    console.log('\n2. Testing root endpoint...');
    const rootResponse = await fetch(backendUrl);
    const rootData = await rootResponse.json();
    console.log('✅ Root endpoint result:', rootData);
    
    // Test chat endpoint
    console.log('\n3. Testing chat endpoint...');
    const chatResponse = await fetch(`${backendUrl}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [{ role: 'user', content: 'Hello, this is a test message' }]
      })
    });
    
    if (chatResponse.ok) {
      const chatData = await chatResponse.json();
      console.log('✅ Chat endpoint working!');
      console.log('Response:', chatData.reply ? 'Response received' : 'No response');
    } else {
      console.log('❌ Chat endpoint failed:', chatResponse.status, chatResponse.statusText);
      const errorText = await chatResponse.text();
      console.log('Error details:', errorText);
    }
    
  } catch (error) {
    console.log('❌ Test failed:', error.message);
  }
}

testBackend();
