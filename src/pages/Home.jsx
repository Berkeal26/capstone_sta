import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div>
      <section className="hero">
        <div className="container">
          <div className="card" style={{ padding: 24 }}>
            <h1 className="hero-title">Plan smarter trips with your AI travel copilot</h1>
            <p className="hero-subtitle">Discover, refine, and book the perfect itinerary in minutes.</p>
            <button className="btn btn-primary" onClick={() => navigate('/chat')}>Start Planning</button>
            <div className="metrics">
              <div className="card metric">
                <h3>10k+</h3>
                <p>Plans generated</p>
              </div>
              <div className="card metric">
                <h3>4.9/5</h3>
                <p>User satisfaction</p>
              </div>
              <div className="card metric">
                <h3>120+ cities</h3>
                <p>Across the globe</p>
              </div>
            </div>
          </div>
          <div className="features">
            <div className="card feature-card">
              <h4 className="feature-title">Personalized itineraries</h4>
              <p className="feature-desc">Tailored plans that match your vibe, budget, and time.</p>
            </div>
            <div className="card feature-card">
              <h4 className="feature-title">Live chat planning</h4>
              <p className="feature-desc">Iterate with your copilot and watch your trip come to life.</p>
            </div>
            <div className="card feature-card">
              <h4 className="feature-title">Share & collaborate</h4>
              <p className="feature-desc">Invite friends to edit and react to ideas instantly.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}


