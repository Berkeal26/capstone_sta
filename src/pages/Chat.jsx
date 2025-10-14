import React, { useMemo, useRef, useState, useEffect } from 'react';
import MessageBubble from '../components/MessageBubble';
import ChatInput from '../components/ChatInput';

// Location detection utility
async function getLocationContext() {
  const now = new Date();
  const now_iso = now.toISOString();
  
  // Get timezone
  const user_tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  
  // Get locale
  const user_locale = navigator.language || 'en-US';
  
  // Try to get location from browser
  let user_location = {
    city: null,
    region: null,
    country: null,
    lat: null,
    lon: null
  };
  
  try {
    if (navigator.geolocation) {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          timeout: 5000,
          enableHighAccuracy: false
        });
      });
      
      user_location.lat = position.coords.latitude;
      user_location.lon = position.coords.longitude;
      
      // Try to reverse geocode to get city/country
      try {
        const response = await fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${user_location.lat}&longitude=${user_location.lon}&localityLanguage=${user_locale}`
        );
        if (response.ok) {
          const data = await response.json();
          user_location.city = data.city || data.locality;
          user_location.region = data.principalSubdivision;
          
          // Clean up country name to remove "(the)" and other formatting issues
          let countryName = data.countryName;
          if (countryName) {
            // Remove "(the)" from country names
            countryName = countryName.replace(/\s*\(the\)\s*$/i, '');
            // Handle common country name variations
            if (countryName.toLowerCase().includes('united states')) {
              countryName = 'United States';
            } else if (countryName.toLowerCase().includes('united kingdom')) {
              countryName = 'United Kingdom';
            }
          }
          user_location.country = countryName;
        }
      } catch (e) {
        console.log('Reverse geocoding failed:', e);
      }
    }
  } catch (e) {
    console.log('Location detection failed:', e);
  }
  
  return {
    now_iso,
    user_tz,
    user_locale,
    user_location
  };
}

async function sendToApi(messages, context) {
  const base = process.env.REACT_APP_API_BASE ?? '';
  const res = await fetch(`${base}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages, context }),
  });
  if (!res.ok) throw new Error('API error');
  return res.json();
}

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState(null);
  const [context, setContext] = useState(null);
  const [isLoadingContext, setIsLoadingContext] = useState(true);
  const scrollRef = useRef(null);

  const quickReplies = ['Plan a trip to Paris', 'Budget accommodations', 'Check weather'];

  // Initialize context and welcome message
  useEffect(() => {
    const initializeChat = async () => {
      try {
        const locationContext = await getLocationContext();
        setContext(locationContext);
        
        // Create welcome message with location context
        let welcomeMessage = "Hi! I'm Miles, your AI travel assistant. I'm here to help you plan the perfect trip.";
        
        if (locationContext.user_location.city && locationContext.user_location.country) {
          welcomeMessage += ` I can see you're in ${locationContext.user_location.city}, ${locationContext.user_location.country}.`;
        } else if (locationContext.user_location.country) {
          welcomeMessage += ` I can see you're in ${locationContext.user_location.country}.`;
        }
        
        welcomeMessage += " Where would you like to go?";
        
        setMessages([{
          role: 'assistant',
          content: welcomeMessage,
          timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
        }]);
      } catch (e) {
        console.error('Failed to initialize context:', e);
        setMessages([{
          role: 'assistant',
          content: "Hi! I'm Miles, your AI travel assistant. I'm here to help you plan the perfect trip. Where would you like to go?",
          timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
        }]);
      } finally {
        setIsLoadingContext(false);
      }
    };
    
    initializeChat();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async (text) => {
    const userMsg = { role: 'user', content: text, timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) };
    setMessages((prev) => [...prev, userMsg]);
    setError(null);
    setIsTyping(true);
    try {
      const payload = [...messages, userMsg];
      const data = await sendToApi(payload, context);
      const reply = data.reply || '';
      setMessages((prev) => [...prev, { role: 'assistant', content: reply, timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) }]);
    } catch (e) {
      setError('Something went wrong. Please try again.');
      setMessages((prev) => [...prev, { role: 'assistant', content: 'Sorry, there was an error reaching the server.', timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) }]);
    } finally {
      setIsTyping(false);
    }
  };

  const rendered = useMemo(() => messages.map((m, idx) => (
    <MessageBubble key={idx} role={m.role} content={m.content} timestamp={m.timestamp} />
  )), [messages]);

  return (
    <div className="chat-page">
      <header className="chat-header">
        <div className="container">
          <div className="chat-header-content">
            <button className="back-button" onClick={() => window.location.href = '/'}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Back to Home
            </button>
            <div className="chat-header-info">
              <div className="chat-header-icon" style={{ width: '48px', height: '48px', padding: '6px', background: '#E6F7FF', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img src={process.env.PUBLIC_URL + '/Miles_logo.png'} alt="Miles" style={{ width: '36px', height: '36px' }} />
              </div>
              <div>
                <h1 className="chat-title">Miles</h1>
                <p className="chat-status" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#00ff00', display: 'inline-block' }}></span>
                  Online • Ready to help plan your trip
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="chat-messages" ref={scrollRef}>
        <div className="container">
          {rendered}
          {isTyping && (
            <div className="message-row">
              <div className="avatar avatar-assistant">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="8" fill="#00ADEF"/>
                </svg>
              </div>
              <div className="typing">
                <span className="dot" />
                <span className="dot" />
                <span className="dot" />
              </div>
            </div>
          )}
          {error && (
            <div className="card" style={{ padding: 12, marginTop: 8 }}>
              <div className="muted">{error}</div>
            </div>
          )}
        </div>
      </div>

      <div className="chat-input-dock">
        <div className="container">
          {messages.length === 1 && (
            <div className="quick-replies">
              {quickReplies.map((text, idx) => (
                <button key={idx} className="quick-reply-btn" onClick={() => handleSend(text)}>
                  {text}
                </button>
              ))}
            </div>
          )}
          <ChatInput onSend={handleSend} disabled={isTyping} />
        </div>
      </div>
    </div>
  );
}