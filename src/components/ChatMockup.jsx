import React from 'react';

export default function ChatMockup() {
  return (
    <div className="mockup">
      <div className="mockup-header">
        <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img 
            src={process.env.PUBLIC_URL + '/Miles_logo.png'} 
            alt="Miles" 
            style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#ffffff', padding: '2px' }}
          />
          <div style={{ color: '#ffffff' }}>
            <div style={{ fontWeight: 600, fontSize: '14px' }}>Miles</div>
            <div style={{ fontSize: '12px', opacity: 0.9, display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#00ff00', display: 'inline-block' }}></span>
              Online
            </div>
          </div>
        </div>
      </div>
      <div className="mockup-body">
        <div className="mockup-row">
          <div className="mockup-avatar" />
          <div className="mockup-bubble">Hi! I'm Miles, your AI travel assistant. Where would you like to go?</div>
        </div>
        <div className="mockup-row right">
          <div className="mockup-bubble user">I'm planning a trip to Tokyo next month</div>
        </div>
        <div className="mockup-row">
          <div className="mockup-avatar" />
          <div className="mockup-bubble">Great choice! I can help you find flights, hotels, and create a personalized itinerary. What's your budget?</div>
        </div>
        <div className="mockup-input">Type your message...</div>
      </div>
    </div>
  );
}