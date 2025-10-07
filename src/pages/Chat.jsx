import React, { useMemo, useRef, useState, useEffect } from 'react';
import MessageBubble from '../components/MessageBubble';
import ChatInput from '../components/ChatInput';

async function sendToApi(messages) {
  const base = process.env.REACT_APP_API_BASE ?? '';
  const res = await fetch(`${base}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages }),
  });
  if (!res.ok) throw new Error('API error');
  return res.json();
}

export default function Chat() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hi! I'm your AI travel assistant. I'm here to help you plan the perfect trip. Where would you like to go?", timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState(null);
  const scrollRef = useRef(null);

  const quickReplies = ['Plan a trip to Paris', 'Budget accommodations', 'Check weather'];

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
      const data = await sendToApi(payload);
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
              <div className="chat-header-icon">
                <img src={process.env.PUBLIC_URL + '/sta_tpt_logo.png'} alt="logo" width={48} height={48} />
              </div>
              <div>
                <h1 className="chat-title">Smart Travel Assistant</h1>
                <p className="chat-status">Online • Ready to help plan your trip</p>
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