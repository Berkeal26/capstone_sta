import React from 'react';

export default function MessageBubble({ role, content, timestamp }) {
  const isUser = role === 'user';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: isUser ? 'flex-end' : 'flex-start' }}>
      <div className={`bubble ${isUser ? 'bubble-user' : 'bubble-assistant'}`}>
        {content}
      </div>
      <div className="bubble-meta">{timestamp || ''}</div>
    </div>
  );
}


