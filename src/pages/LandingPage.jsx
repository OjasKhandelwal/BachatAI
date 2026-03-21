import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Activity, BarChart } from 'lucide-react';
import './LandingPage.css';

const LandingPage = () => {
  return (
    <div className="landing-container">
      {/* Navbar */}
      <nav className="navbar">
        <div className="nav-links">
          <a href="#start">Start</a>
          <a href="#features">Features</a>
          <a href="#resources">Resources</a>
        </div>
        <div className="logo">
          <svg width="24" height="24" viewBox="0 0 48 46" fill="none" className="logo-icon" xmlns="http://www.w3.org/2000/svg">
            <path d="M25.946 44.938c-.664.845-2.021.375-2.021-.698V33.937a2.26 2.26 0 0 0-2.262-2.262H10.287c-.92 0-1.456-1.04-.92-1.788l7.48-10.471c1.07-1.497 0-3.578-1.842-3.578H1.237c-.92 0-1.456-1.04-.92-1.788L10.013.474c.214-.297.556-.474.92-.474h28.894c.92 0 1.456 1.04.92 1.788l-7.48 10.471c-1.07 1.498 0 3.579 1.842 3.579h11.377c.943 0 1.473 1.088.89 1.83L25.947 44.94z" fill="white" />
          </svg>
          BachatAI
        </div>
        <div className="nav-actions">
          <Link to="/login" className="btn-login">Log In</Link>
          <Link to="/questionnaire" className="btn-primary">Open Account</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="hero">
        <div className="hero-content">
          <h1>
            Unlock the Future of<br />
            Personal Finance with<br />
            <span className="text-gradient">BachatAI</span>
          </h1>
          <p>
            Experience smart, secure, and convenient financial planning with BachatAI.
            Manage your savings, investments, and future anywhere with real-time AI-driven insights.
          </p>
          <Link to="/questionnaire" className="btn-gradient">Start Your Journey</Link>
        </div>
        <div className="hero-visual">
          {/* Card 1 - Teal/Cyan gradient */}
          <div className="credit-card c1">
            <div className="cc-top">
              <img src="/favicon.svg" alt="logo" className="cc-logo" />
              <div className="cc-nfc">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                  <path d="M4.5 6.5C6.5 4 9.1 2.5 12 2.5C14.9 2.5 17.5 4 19.5 6.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" opacity="0.4" />
                  <path d="M7 10C8.5 8 10.2 7 12 7C13.8 7 15.5 8 17 10" stroke="white" strokeWidth="1.8" strokeLinecap="round" opacity="0.65" />
                  <path d="M9.5 13.5C10.5 12 11.2 11.5 12 11.5C12.8 11.5 13.5 12 14.5 13.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
                  <circle cx="12" cy="16" r="1.2" fill="white" />
                </svg>
              </div>
            </div>
            <div className="cc-bottom">
              <div className="cc-num">1234  5678  9000  0000</div>
              <div className="cc-details">
                <span className="cc-name">FOYSAL KHAN</span>
                <span className="cc-expiry">05/28</span>
              </div>
            </div>
          </div>

          {/* Card 2 - Pink/Purple gradient */}
          <div className="credit-card c2">
            <div className="cc-top">
              <img src="/favicon.svg" alt="logo" className="cc-logo" />
              <div className="cc-nfc">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                  <path d="M4.5 6.5C6.5 4 9.1 2.5 12 2.5C14.9 2.5 17.5 4 19.5 6.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" opacity="0.4" />
                  <path d="M7 10C8.5 8 10.2 7 12 7C13.8 7 15.5 8 17 10" stroke="white" strokeWidth="1.8" strokeLinecap="round" opacity="0.65" />
                  <path d="M9.5 13.5C10.5 12 11.2 11.5 12 11.5C12.8 11.5 13.5 12 14.5 13.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
                  <circle cx="12" cy="16" r="1.2" fill="white" />
                </svg>
              </div>
            </div>
            <div className="cc-bottom">
              <div className="cc-num">1234  5678  9000  0000</div>
              <div className="cc-details">
                <span className="cc-name">RONI HASAN</span>
                <span className="cc-expiry">03/27</span>
              </div>
            </div>
          </div>

          {/* Card 3 - Blue/Purple gradient with Mastercard */}
          <div className="credit-card c3">
            <div className="cc-top">
              <img src="/favicon.svg" alt="logo" className="cc-logo" />
              <div className="cc-nfc">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                  <path d="M4.5 6.5C6.5 4 9.1 2.5 12 2.5C14.9 2.5 17.5 4 19.5 6.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" opacity="0.4" />
                  <path d="M7 10C8.5 8 10.2 7 12 7C13.8 7 15.5 8 17 10" stroke="white" strokeWidth="1.8" strokeLinecap="round" opacity="0.65" />
                  <path d="M9.5 13.5C10.5 12 11.2 11.5 12 11.5C12.8 11.5 13.5 12 14.5 13.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
                  <circle cx="12" cy="16" r="1.2" fill="white" />
                </svg>
              </div>
            </div>
            <div className="cc-bottom">
              <div className="cc-num">1234  5678  9000  0000</div>
              <div className="cc-details">
                <span className="cc-name">HAMID OHMY</span>
                <span className="cc-expiry">09/26</span>
                <div className="mastercard">
                  <div className="mc-circle mc-red"></div>
                  <div className="mc-circle mc-orange"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="section-badge">Highlights</div>
        <h2>Enhancing Your Financial Experience</h2>
        <div className="stats-grid">
          <div className="stat-card">
            <h3>200K+</h3>
            <p>Active Users</p>
          </div>
          <div className="stat-card">
            <h3>98%</h3>
            <p>Savings Goals Met</p>
          </div>
          <div className="stat-card">
            <h3>50%</h3>
            <p>Better Returns</p>
          </div>
          <div className="stat-card">
            <h3>10M+</h3>
            <p>Investments Managed</p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="feature-header">
          <div>
            <span className="feature-subtitle">Efficiency at its best</span>
            <h2>Smart Savings & Investment</h2>
          </div>

        </div>

        <div className="cards-row">
          <div className="feature-card">
            <div className="icon-wrapper"><Activity size={20} /></div>
            <h3>Goal-Based Planning</h3>
            <div className="chart-placeholder">
              <div className="bar" style={{ height: '30%' }}></div>
              <div className="bar" style={{ height: '50%' }}></div>
              <div className="bar" style={{ height: '80%' }}></div>
              <div className="bar" style={{ height: '40%' }}></div>
              <div className="bar" style={{ height: '100%' }}></div>
              <div className="bar" style={{ height: '60%' }}></div>
            </div>
            <p className="card-footer">Analytics: UK Pound Sterling</p>
          </div>

          <div className="feature-card">
            <div className="icon-wrapper"><BarChart size={20} /></div>
            <h3>Smart Budgeting</h3>
            <div className="progress-item">
              <div className="progress-label"><span>Progress</span><span>38%</span></div>
              <div className="progress-bar"><div className="fill" style={{ width: '38%', background: '#60a5fa' }}></div></div>
            </div>
            <div className="progress-item">
              <div className="progress-label"><span>Market Savings</span><span>22%</span></div>
              <div className="progress-bar"><div className="fill" style={{ width: '22%', background: '#34d399' }}></div></div>
            </div>
            <div className="progress-item">
              <div className="progress-label"><span>Investing</span><span>40%</span></div>
              <div className="progress-bar"><div className="fill" style={{ width: '40%', background: '#a78bfa' }}></div></div>
            </div>
          </div>

          <div className="feature-card">
            <div className="icon-wrapper"><ShieldCheck size={20} /></div>
            <h3>Integrated Accounts</h3>
            <ul className="module-list">
              <li>
                <div className="li-info"><strong>Shopping</strong><span>Transaction</span></div>
                <span className="li-score negative">-$523.00</span>
              </li>
              <li>
                <div className="li-info"><strong>Restaurants</strong><span>Transaction</span></div>
                <span className="li-score negative">-$825.00</span>
              </li>
              <li>
                <div className="li-info"><strong>Travel</strong><span>Transaction</span></div>
                <span className="li-score positive">+$523.00</span>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
