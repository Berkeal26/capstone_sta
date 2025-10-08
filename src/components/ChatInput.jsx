import React, { useState } from 'react';

export default function ChatInput({ onSend, disabled }) {
  const [value, setValue] = useState('');

  const handleSend = () => {
    const trimmed = value.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setValue('');
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="chat-input-dock container">
      <div className="card" style={{ padding: 8, display: 'flex', gap: 8 }}>
        <textarea
          rows={1}
          placeholder="Ask for a 3-day itinerary in Tokyo..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={onKeyDown}
          style={{
            flex: 1,
            resize: 'none',
            border: 'none',
            outline: 'none',
            padding: 10,
            background: 'var(--input-background)',
            borderRadius: 8,
            fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif',
            fontSize: 'var(--text-base)',
          }}
          disabled={disabled}
        />
        <button className="btn btn-primary" onClick={handleSend} disabled={disabled}>Send</button>
      </div>
    </div>
  );
}


