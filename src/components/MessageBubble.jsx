import React from 'react';

export default function MessageBubble({ role, content, timestamp }) {
  const isUser = role === 'user';
  
  return (
    <div className={`message-row ${isUser ? 'message-row-user' : ''}`}>
      {!isUser && (
        <div className="avatar avatar-assistant">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="8" fill="#00ADEF"/>
          </svg>
        </div>
      )}
      <div className={`bubble ${isUser ? 'bubble-user' : 'bubble-assistant'}`}>
        {content}
        {timestamp && <div className="bubble-meta">{timestamp}</div>}
      </div>
    </div>
  );
}