import React from 'react';
import './HomePage.css';

function HomePage({ onGetStarted }) {
  return (
    <div className="homepage">
      <nav className="navbar">
        <div className="nav-brand">
          <span className="nav-logo">🎓</span>
          <span className="nav-title">Workshop Hub</span>
        </div>
        <button className="nav-login-btn" onClick={onGetStarted}>
          Get Started
        </button>
      </nav>

      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">Manage Your Workshops Effortlessly</h1>
          <p className="hero-subtitle">
            The complete platform to organize, manage, and track your workshop events. 
            Simple, powerful, and designed for success.
          </p>
          <div className="hero-buttons">
            <button className="btn-primary" onClick={onGetStarted}>
              Get Started Free
            </button>
            <button className="btn-secondary">
              Learn More
            </button>
          </div>
        </div>
        <div className="hero-image">
          <div className="hero-card">
            <div className="card-icon">🎪</div>
            <h3>Workshop Management</h3>
            <p>Create and manage workshops with ease</p>
          </div>
          <div className="hero-card">
            <div className="card-icon">📅</div>
            <h3>Easy Booking</h3>
            <p>Simple booking system for attendees</p>
          </div>
          <div className="hero-card">
            <div className="card-icon">💬</div>
            <h3>AI Assistant</h3>
            <p>Get help anytime with our chatbot</p>
          </div>
        </div>
      </section>

      <section className="features">
        <h2 className="section-title">Why Choose Workshop Hub?</h2>
        <div className="features-grid">
          <div className="feature-item">
            <div className="feature-icon">⚡</div>
            <h3>Fast & Easy</h3>
            <p>Set up your workshops in minutes</p>
          </div>
          <div className="feature-item">
            <div className="feature-icon">🔒</div>
            <h3>Secure</h3>
            <p>Your data is safe with us</p>
          </div>
          <div className="feature-item">
            <div className="feature-icon">📊</div>
            <h3>Analytics</h3>
            <p>Track your workshop performance</p>
          </div>
          <div className="feature-item">
            <div className="feature-icon">💳</div>
            <h3>Payment Integration</h3>
            <p>Accept payments seamlessly</p>
          </div>
        </div>
      </section>

      <footer className="homepage-footer">
        <p>© 2024 Workshop Hub. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default HomePage;
