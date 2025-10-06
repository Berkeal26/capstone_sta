import React from 'react';

export default function ChatMockup() {
  return (
    <div className="mockup">
      <div className="mockup-header" />
      <div className="mockup-body">
        <div className="mockup-row">
          <div className="mockup-avatar" />
          <div className="mockup-bubble">Hi! I'm your AI travel assistant. Where would you like to go?</div>
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


