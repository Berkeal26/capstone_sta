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
  return res.json(); // { reply }
}

export default function Chat() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hi! I can help plan your next trip. Where to?' }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async (text) => {
    const userMsg = { role: 'user', content: text };
    setMessages((prev) => [...prev, userMsg]);
    setError(null);
    setIsTyping(true);
    try {
      const payload = [...messages, userMsg];
      const data = await sendToApi(payload);
      const reply = data.reply || '';
      setMessages((prev) => [...prev, { role: 'assistant', content: reply }] );
    } catch (e) {
      setError('Something went wrong. Please try again.');
      setMessages((prev) => [...prev, { role: 'assistant', content: 'Sorry, there was an error reaching the server.' }] );
    } finally {
      setIsTyping(false);
    }
  };

  const rendered = useMemo(() => messages.map((m, idx) => (
    <MessageBubble key={idx} role={m.role} content={m.content} />
  )), [messages]);

  return (
    <div className="chat-page">
      <div className="chat-messages" ref={scrollRef}>
        <div className="container">
          {rendered}
          {isTyping && (
            <div className="typing" style={{ marginTop: 8 }}>
              <span className="dot" />
              <span className="dot" />
              <span className="dot" />
            </div>
          )}
          {error && (
            <div className="card" style={{ padding: 12, marginTop: 8 }}>
              <div className="muted">{error}</div>
            </div>
          )}
        </div>
      </div>
      <ChatInput onSend={handleSend} disabled={isTyping} />
    </div>
  );
}


