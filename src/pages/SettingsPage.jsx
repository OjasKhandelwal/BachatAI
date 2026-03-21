import React, { useState, useEffect } from 'react';
import { User, Shield, Bell, Link2, Palette, ChevronRight } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import './SettingsPage.css';

const SECTIONS = [
  { id: 'profile',     icon: User,    label: 'Profile Management' },
  { id: 'security',    icon: Shield,  label: 'Security Settings' },
  { id: 'notify',      icon: Bell,    label: 'Notification Preferences' },
  { id: 'linked',      icon: Link2,   label: 'Linked Accounts' },
  { id: 'theme',       icon: Palette, label: 'Theme Selection' },
];

export default function SettingsPage() {
  const [userData, setUserData] = useState({ name: 'Guest', email: 'guest@example.com' });
  const [activeSection, setActiveSection] = useState('profile');
  const [form, setForm] = useState({ name: '', email: '' });
  const [twoFactor, setTwoFactor] = useState(false);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [pushNotifs, setPushNotifs] = useState(true);
  const [theme, setTheme] = useState('purple');

  useEffect(() => {
    const stored = localStorage.getItem('bachatai_user');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const n = parsed.name || 'Guest';
        const e = n.split(' ')[0].toLowerCase() + '@example.com';
        setUserData({ name: n, email: e });
        setForm({ name: n, email: e });
      } catch(e) {}
    }
  }, []);

  const saveChanges = () => {
    const stored = localStorage.getItem('bachatai_user');
    if (stored) {
      const parsed = JSON.parse(stored);
      parsed.name = form.name;
      localStorage.setItem('bachatai_user', JSON.stringify(parsed));
      setUserData({ name: form.name, email: form.email });
    }
  };

  return (
    <DashboardLayout>
      <div className="st-page">
        <h1 className="st-title">User Account Settings</h1>

        <div className="st-layout">
          {/* LEFT NAV */}
          <div className="st-nav">
            {SECTIONS.map(({ id, icon: Icon, label }) => (
              <button
                key={id}
                className={`st-nav-item ${activeSection === id ? 'active' : ''}`}
                onClick={() => setActiveSection(id)}
              >
                <Icon size={18} /> {label}
              </button>
            ))}
          </div>

          {/* RIGHT CONTENT */}
          <div className="st-content">
            {/* PROFILE */}
            {activeSection === 'profile' && (
              <div className="st-card">
                <h3>Profile Management</h3>
                <div className="st-profile-row">
                  <div className="st-avatar-area">
                    <div className="st-avatar-placeholder">
                      {form.name.charAt(0).toUpperCase() || 'G'}
                    </div>
                    <button className="st-edit-btn">Edit</button>
                  </div>
                  <div className="st-form">
                    <label>Full Name</label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={e => setForm(f => ({...f, name: e.target.value}))}
                    />
                    <label>Email Address</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={e => setForm(f => ({...f, email: e.target.value}))}
                    />
                    <button className="st-save-btn" onClick={saveChanges}>Save Changes</button>
                  </div>
                </div>
              </div>
            )}

            {/* SECURITY */}
            {activeSection === 'security' && (
              <div className="st-card">
                <h3>Security Settings</h3>
                <div className="st-row-between">
                  <span>Change Password</span>
                  <button className="st-arrow"><ChevronRight size={18} /></button>
                </div>
                <div className="st-row-between">
                  <span>Two-Factor Authentication</span>
                  <button className={`st-toggle ${twoFactor ? 'on' : ''}`} onClick={() => setTwoFactor(!twoFactor)}>
                    <div className="st-toggle-knob"></div>
                  </button>
                </div>
              </div>
            )}

            {/* NOTIFICATIONS */}
            {activeSection === 'notify' && (
              <div className="st-card">
                <h3>Notification Preferences</h3>
                <div className="st-row-between">
                  <span>Email Alerts</span>
                  <button className={`st-toggle ${emailAlerts ? 'on' : ''}`} onClick={() => setEmailAlerts(!emailAlerts)}>
                    <div className="st-toggle-knob"></div>
                  </button>
                </div>
                <div className="st-row-between">
                  <span>Push Notifications</span>
                  <button className={`st-toggle ${pushNotifs ? 'on' : ''}`} onClick={() => setPushNotifs(!pushNotifs)}>
                    <div className="st-toggle-knob"></div>
                  </button>
                </div>
              </div>
            )}

            {/* LINKED ACCOUNTS */}
            {activeSection === 'linked' && (
              <div className="st-card">
                <h3>Linked Accounts</h3>
                <div className="st-linked-item">
                  <div className="st-linked-icon chase"><Link2 size={16} /></div>
                  <div className="st-linked-info">
                    <strong>Chase Bank</strong>
                    <span>₹24,000 of ₹3,000 saved</span>
                  </div>
                  <button className="st-add-account">+ Add Account</button>
                </div>
                <div className="st-linked-item">
                  <div className="st-linked-icon wells"><Link2 size={16} /></div>
                  <div className="st-linked-info">
                    <strong>Wells Fargo</strong>
                    <span>₹9,000 of ₹20,000 saved</span>
                  </div>
                  <button className="st-arrow"><ChevronRight size={18} /></button>
                </div>
              </div>
            )}

            {/* THEME */}
            {activeSection === 'theme' && (
              <div className="st-card">
                <h3>Theme Selection</h3>
                <div className="st-theme-options">
                  {['light', 'dark', 'purple'].map(t => (
                    <label key={t} className="st-radio-label">
                      <input
                        type="radio"
                        name="theme"
                        checked={theme === t}
                        onChange={() => setTheme(t)}
                      />
                      <span>{t === 'purple' ? 'Purple/Blue (Active)' : t.charAt(0).toUpperCase() + t.slice(1)}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
