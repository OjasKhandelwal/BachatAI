import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Wallet, Target, Sparkles,
  Settings, Search, Bell, HelpCircle, Plus, Send,
  MessageCircle, X, LogOut, Calculator
} from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import './DashboardLayout.css';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || 'dummy_key');

const NAV_ITEMS = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard',   path: '/dashboard' },
  { id: 'savings',   icon: Wallet,          label: 'Savings',      path: '/savings' },
  { id: 'goals',     icon: Target,          label: 'Goals',        path: '/goals' },
  { id: 'insights',  icon: Sparkles,        label: 'AI Insights',  path: '/insights' },
  { id: 'simulator', icon: Calculator,      label: 'Simulator',    path: '/simulator' },
  { id: 'settings',  icon: Settings,        label: 'Settings',     path: '/settings' },
];

// BachatAI bolt logo inline SVG
const BachatLogo = () => (
  <svg width="22" height="22" viewBox="0 0 48 46" fill="none">
    <path d="M25.946 44.938c-.664.845-2.021.375-2.021-.698V33.937a2.26 2.26 0 0 0-2.262-2.262H10.287c-.92 0-1.456-1.04-.92-1.788l7.48-10.471c1.07-1.497 0-3.578-1.842-3.578H1.237c-.92 0-1.456-1.04-.92-1.788L10.013.474c.214-.297.556-.474.92-.474h28.894c.92 0 1.456 1.04.92 1.788l-7.48 10.471c-1.07 1.498 0 3.579 1.842 3.579h11.377c.943 0 1.473 1.088.89 1.83L25.947 44.94z" fill="#a78bfa"/>
  </svg>
);

export default function DashboardLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMsg, setChatMsg] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [userData, setUserData] = useState({ name: 'Guest' });
  const [notifOpen, setNotifOpen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('bachatai_user');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setUserData(parsed);
      } catch (e) { /* ignore */ }
    }
  }, []);

  const firstName = userData.name ? userData.name.split(' ')[0] : 'Guest';

  // Initialize AI messages
  useEffect(() => {
    setChatMessages([
      { from: 'ai', type: 'purple', text: `Hi, ${firstName}! I've noticed your costs. Transfer ₹500 to Yield Savings.` },
      { from: 'ai', type: 'white', text: `Hello, ${firstName}. Increase your savings contribution by 1% now. Cancel unused streaming subscriptions.` },
    ]);
  }, [firstName]);

  const handleSendChat = async () => {
    if (!chatMsg.trim()) return;
    setChatMessages(prev => [...prev, { from: 'user', text: chatMsg }]);
    const userQ = chatMsg;
    setChatMsg('');

    if (!import.meta.env.VITE_GEMINI_API_KEY) {
      setTimeout(() => {
        setChatMessages(prev => [...prev, {
          from: 'ai', type: 'white',
          text: 'Looks like your Gemini API key is missing. Please add VITE_GEMINI_API_KEY to your .env file and restart the server.'
        }]);
      }, 500);
      return;
    }

    try {
      setChatMessages(prev => [...prev, { from: 'ai', type: 'white', text: 'Thinking...', id: 'typing' }]);
      
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
      const context = `You are a concise, helpful AI Financial Advisor in the app 'BachatAI'. 
        The user's name is ${firstName}.
        Their active goal is: ${userData?.goal || 'Financial wellness'}.
        Their goal amount target is: ${userData?.goalAmount || 'N/A'}. 
        Keep your response very brief (2-3 sentences maximum) and focused on their specific question.`;

      const result = await model.generateContent(`${context}\n\nUser Question: ${userQ}`);
      const text = result.response.text();

      setChatMessages(prev => [...prev.filter(m => m.id !== 'typing'), { from: 'ai', type: 'white', text: text }]);
    } catch (error) {
      console.error('Gemini error:', error);
      setChatMessages(prev => [...prev.filter(m => m.id !== 'typing'), {
        from: 'ai', type: 'white',
        text: 'Sorry, I encountered an error connecting to Gemini. Please make sure your API key is valid.'
      }]);
    }
  };

  const handleChatKeyDown = (e) => {
    if (e.key === 'Enter') handleSendChat();
  };

  const handleLogout = () => {
    localStorage.removeItem('bachatai_user');
    navigate('/');
  };

  return (
    <div className="dl-wrapper">
      {/* ── SIDEBAR ── */}
      <aside className="dl-sidebar">
        <div className="dl-sidebar-top">
          <div className="dl-brand" onClick={() => navigate('/dashboard')} style={{ cursor: 'pointer' }}>
            <BachatLogo />
            <h2>BachatAI</h2>
          </div>

          <nav className="dl-nav">
            {NAV_ITEMS.map(({ id, icon: Icon, label, path }) => {
              const active = location.pathname === path;
              return (
                <button
                  key={id}
                  className={`dl-nav-item ${active ? 'active' : ''}`}
                  onClick={() => navigate(path)}
                >
                  <Icon size={18} />
                  <span>{label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="dl-sidebar-bottom">
          <button className="dl-new-goal-btn" onClick={() => navigate('/goals')}>
            <Plus size={16} /> New Goal
          </button>
          <div className="dl-workspace">
            <div className="dl-ws-avatar-placeholder">
              {firstName.charAt(0).toUpperCase()}
            </div>
            <div className="dl-ws-info">
              <strong>{firstName}'s Workspace</strong>
              <span>PremiumPlan</span>
            </div>
            <button className="dl-logout-btn" onClick={handleLogout} title="Logout">
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <div className="dl-main">
        {/* TOPBAR */}
        <header className="dl-topbar">
          <div className="dl-search">
            <Search size={16} color="#9ca3af" />
            <input type="text" placeholder="Search insights..." />
          </div>
          <div className="dl-topbar-right">
            <div className="dl-notif-wrapper">
              <button className="dl-icon-btn" onClick={() => setNotifOpen(!notifOpen)}>
                <Bell size={18} />
                <span className="dl-notif-dot"></span>
              </button>
              {notifOpen && (
                <div className="dl-notif-dropdown">
                  <div className="dl-notif-header">Notifications</div>
                  <div className="dl-notif-item">💡 Your savings rate increased by 5% this month.</div>
                  <div className="dl-notif-item">⚠️ Rent payment due in 4 days.</div>
                  <div className="dl-notif-item">🎯 You're 80% to your Emergency Fund goal!</div>
                </div>
              )}
            </div>
            <button className="dl-icon-btn" onClick={() => navigate('/settings')}>
              <HelpCircle size={18} />
            </button>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <div className="dl-content">
          {children}
        </div>

        {/* ── ASK AI ADVISOR CTA ── */}
        <div className="dl-ai-cta">
          <span>Want more insights?</span>
          <button onClick={() => setChatOpen(true)}>Ask AI Advisor</button>
        </div>
      </div>

      {/* ── AI CHAT WIDGET ── */}
      {chatOpen && (
        <div className="dl-chat-widget">
          <div className="dl-chat-header">
            <div className="dl-chat-brand">
              <div className="dl-chat-icon"><Sparkles size={14} /></div>
              <span>AI Financial Assistant</span>
            </div>
            <button className="dl-chat-close" onClick={() => setChatOpen(false)}>
              <X size={16} />
            </button>
          </div>
          <div className="dl-chat-messages">
            {chatMessages.map((msg, i) => (
              <div key={i} className={`dl-chat-bubble ${msg.from === 'user' ? 'user-bubble' : `ai-bubble ${msg.type === 'purple' ? 'purple-bubble' : 'white-bubble'}`}`}>
                {msg.text}
              </div>
            ))}
          </div>
          <div className="dl-chat-input-area">
            <input
              type="text"
              placeholder="Type your message..."
              value={chatMsg}
              onChange={e => setChatMsg(e.target.value)}
              onKeyDown={handleChatKeyDown}
            />
            <button className="dl-send-btn" onClick={handleSendChat}><Send size={16} /></button>
          </div>
        </div>
      )}

      {/* FLOATING CHAT TOGGLE */}
      {!chatOpen && (
        <button className="dl-chat-fab" onClick={() => setChatOpen(true)}>
          <MessageCircle size={22} />
        </button>
      )}
    </div>
  );
}
