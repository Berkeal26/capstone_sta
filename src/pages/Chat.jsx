import React, { useMemo, useRef, useState, useEffect } from 'react';
import MessageBubble from '../components/MessageBubble';
import ChatInput from '../components/ChatInput';
import { FlightDashboard } from '../components/dashboard/FlightDashboard';

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

async function sendToApi(messages, context, sessionId) {
  const base = process.env.REACT_APP_API_BASE ?? 'https://capstone-oj8xlxyhj-berkes-projects-f48a9605.vercel.app';
  console.log('API Base URL:', base);
  console.log('Making request to:', `${base}/api/chat`);
  
  const res = await fetch(`${base}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages, context, session_id: sessionId }),
  });
  if (!res.ok) throw new Error('API error');
  return res.json();
}

export default function Chat({ onShowDashboard, showDashboard, dashboardData, onHideDashboard }) {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState(null);
  const [context, setContext] = useState(null);
  const [, setIsLoadingContext] = useState(true);
  const [sessionId, setSessionId] = useState(null);
  const scrollRef = useRef(null);

  const quickReplies = ['Plan a trip to Paris', 'Budget accommodations', 'Check weather'];

  // Initialize context and welcome message
  useEffect(() => {
    const initializeChat = async () => {
      try {
        const locationContext = await getLocationContext();
        setContext(locationContext);
        
        // Generate session ID for cache continuity
        const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        setSessionId(newSessionId);
        
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

  // Check if message contains flight/price related keywords
  const shouldShowDashboard = (message) => {
    const priceKeywords = [
      'price', 'prices', 'cost', 'costs', 'expensive', 'cheap', 'cheapest', 'budget', 
      'affordable', 'fare', 'fares', 'flight', 'flights', 'airline', 'airlines', 
      'ticket', 'tickets', 'book', 'booking', 'search flights', 'find flights', 
      'compare', 'comparison', 'options', 'available', 'schedule', 'departure', 
      'arrival', 'route', 'destination', 'travel', 'trip'
    ];
    const lowerMessage = message.toLowerCase();
    const shouldShow = priceKeywords.some(keyword => lowerMessage.includes(keyword));
    console.log('shouldShowDashboard check:', { message, shouldShow, matchedKeywords: priceKeywords.filter(k => lowerMessage.includes(k)) });
    return shouldShow;
  };

  const handleSend = async (text) => {
    const userMsg = { role: 'user', content: text, timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) };
    setMessages((prev) => [...prev, userMsg]);
    setError(null);
    setIsTyping(true);
        try {
          const payload = [...messages, userMsg];
          console.log('Sending to API:', { payload, context, sessionId });
          const data = await sendToApi(payload, context, sessionId);
          console.log('API Response:', data);
          const reply = data.reply || '';
          setMessages((prev) => [...prev, { role: 'assistant', content: reply, timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) }]);
          
          // Check if we should show dashboard
          if (shouldShowDashboard(text) && onShowDashboard) {
            console.log('Triggering dashboard for text:', text);
            console.log('onShowDashboard function:', onShowDashboard);
            
            // Force dashboard to show immediately
            onShowDashboard({
              route: {
                departure: 'New York',
                destination: 'Los Angeles', 
                departureCode: 'NYC',
                destinationCode: 'LAX',
                date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
              },
              flights: [],
              priceData: [],
              hasRealData: false
            });
            
            // Extract route information from the message if possible
            let routeInfo = {
              departure: 'New York',
              destination: 'Los Angeles',
              departureCode: 'NYC',
              destinationCode: 'LAX',
              date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
            };

            // Try to extract route from various patterns
            const patterns = [
              /(?:from|to|between)\s+([A-Za-z\s]+?)\s+(?:to|and)\s+([A-Za-z\s]+)/i,
              /(?:flights?|tickets?)\s+(?:to|from)\s+([A-Za-z\s]+)/i,
              /([A-Za-z\s]+)\s+(?:to|→|->)\s+([A-Za-z\s]+)/i,
              /(?:search|find|book)\s+(?:flights?|tickets?)\s+(?:to|for)\s+([A-Za-z\s]+)/i
            ];

            for (const pattern of patterns) {
              const match = text.match(pattern);
              if (match) {
                if (match[2]) {
                  // Two cities found
                  routeInfo.departure = match[1].trim();
                  routeInfo.destination = match[2].trim();
                } else if (match[1]) {
                  // One city found, assume it's destination
                  routeInfo.destination = match[1].trim();
                }
                
                // Generate airport codes
                routeInfo.departureCode = routeInfo.departure.substring(0, 3).toUpperCase();
                routeInfo.destinationCode = routeInfo.destination.substring(0, 3).toUpperCase();
                break;
              }
            }

            // Create dynamic price data based on the query
            const basePrice = Math.floor(Math.random() * 200) + 300; // Random base price
            const dynamicPriceData = Array.from({ length: 7 }, (_, i) => ({
              date: new Date(Date.now() + i * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
              price: basePrice + Math.floor(Math.random() * 100) - 50,
              optimal: basePrice - 20
            }));

            // Create dynamic flights data
            const airlines = ['Delta Airlines', 'United Airlines', 'American Airlines', 'Southwest Airlines', 'JetBlue Airways', 'Spirit Airlines'];
            const dynamicFlightsData = airlines.slice(0, 4).map((airline, index) => ({
              id: (index + 1).toString(),
              airline: airline,
              flightNumber: `${airline.split(' ')[0].substring(0, 2).toUpperCase()} ${Math.floor(Math.random() * 9000) + 1000}`,
              departure: `${6 + index * 2}:${index % 2 === 0 ? '00' : '30'} AM`,
              arrival: `${9 + index * 2}:${index % 2 === 0 ? '30' : '00'} AM`,
              duration: `${3 + Math.floor(Math.random() * 2)}h ${Math.floor(Math.random() * 60)}m`,
              price: basePrice + Math.floor(Math.random() * 100) - 50,
              isOptimal: index === 0,
              stops: Math.floor(Math.random() * 2)
            }));

            // Update dashboard with new data
            setTimeout(() => {
              onShowDashboard({
                route: routeInfo,
                flights: dynamicFlightsData,
                priceData: dynamicPriceData,
                hasRealData: false // Using dynamic mock data
              });
            }, 100);
          }
        } catch (e) {
          console.error('API Error:', e);
          setError('Something went wrong. Please try again.');
          setMessages((prev) => [...prev, { role: 'assistant', content: 'Sorry, there was an error reaching the server.', timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) }]);
        } finally {
          setIsTyping(false);
        }
  };

  const rendered = useMemo(() => messages.map((m, idx) => (
    <MessageBubble key={idx} role={m.role} content={m.content} timestamp={m.timestamp} />
  )), [messages]);

  // If dashboard should be shown, render split view
  if (showDashboard) {
    console.log('Rendering split view with dashboard data:', dashboardData);
    console.log('showDashboard state:', showDashboard);
    return (
      <div style={{ 
        height: '100vh', 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr', 
        gap: '16px',
        padding: '16px',
        background: '#ffffff'
      }}>
        {/* Left: Chat Interface */}
        <div style={{ 
          height: '100%', 
          display: 'flex', 
          flexDirection: 'column',
          background: '#ffffff',
          borderRadius: '12px',
          border: '1px solid rgba(2, 6, 23, 0.06)',
          boxShadow: '0 1px 2px rgba(2, 6, 23, 0.06), 0 4px 12px rgba(2, 6, 23, 0.04)'
        }}>
          {/* Chat Header */}
          <div style={{ 
            padding: '16px 20px', 
            borderBottom: '1px solid rgba(2, 6, 23, 0.06)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '32px', height: '32px', background: '#E6F7FF', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img src={process.env.PUBLIC_URL + '/Miles_logo.png'} alt="Miles" style={{ width: '24px', height: '24px' }} />
              </div>
              <div>
                <h2 style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: '#004C8C' }}>Miles</h2>
                <p style={{ margin: 0, fontSize: '12px', color: 'rgba(2, 6, 23, 0.6)' }}>Travel Assistant</p>
              </div>
            </div>
            <button 
              onClick={onHideDashboard}
              style={{
                background: 'none',
                border: 'none',
                color: 'rgba(2, 6, 23, 0.6)',
                cursor: 'pointer',
                padding: '4px',
                borderRadius: '4px'
              }}
              title="Close Dashboard"
            >
              ✕
            </button>
          </div>
          
          {/* Chat Messages */}
          <div style={{ flex: 1, overflow: 'auto', padding: '16px' }} ref={scrollRef}>
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
          </div>
          
          {/* Chat Input */}
          <div style={{ padding: '16px', borderTop: '1px solid rgba(2, 6, 23, 0.06)' }}>
            <ChatInput onSend={handleSend} disabled={isTyping} />
          </div>
        </div>
        
        {/* Right: Flight Dashboard */}
        <div style={{ height: '100%' }}>
          <FlightDashboard searchData={dashboardData} />
        </div>
      </div>
    );
  }

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