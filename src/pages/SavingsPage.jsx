import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, ResponsiveContainer, Cell } from 'recharts';
import { useNavigate } from 'react-router-dom';
import { Plus, Target, Check, X, Wallet, TrendingUp } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import './SavingsPage.css';

const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN'];

const GOAL_LABELS = {
  car: 'New Car', home: 'New Home', retire: 'Retirement',
  edu: 'Education', travel: 'World Travel', other: 'Custom Goal',
};

function formatINR(num) {
  if (!num) return '₹0';
  return '₹' + parseInt(num, 10).toLocaleString('en-IN');
}

export default function SavingsPage() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [goals, setGoals] = useState([]);
  const [goalFunds, setGoalFunds] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [fundForm, setFundForm] = useState({ goalIdx: '', amount: '' });

  useEffect(() => {
    const stored = localStorage.getItem('bachatai_user');
    let parsedUser = null;
    if (stored) {
      try {
        parsedUser = JSON.parse(stored);
        setUserData(parsedUser);
      } catch(e) {}
    }

    const allGoals = parsedUser?.allGoals || (parsedUser?.goal ? [{
      id: parsedUser.goal, customGoal: parsedUser.customGoal || '',
      goalAmount: parsedUser.goalAmount || '0', timeline: parsedUser.timeline || '',
    }] : []);
    
    const extraGoalsStr = localStorage.getItem('bachatai_extra_goals');
    const extras = extraGoalsStr ? JSON.parse(extraGoalsStr) : [];
    
    const combined = [
      ...allGoals.map(g => ({
        label: g.id === 'other' ? (g.customGoal || 'Custom Goal') : (GOAL_LABELS[g.id] || 'Goal'),
        amount: g.goalAmount || '0',
        id: g.id || g.customGoal || 'q-goal'
      })),
      ...extras.map((g, i) => ({ ...g, id: `extra-${i}` })),
    ];
    setGoals(combined);

    const savedFunds = localStorage.getItem('bachatai_goal_funds');
    if (savedFunds) {
      try { setGoalFunds(JSON.parse(savedFunds)); } catch(e) {}
    }
  }, []);

  const salary = parseInt(userData?.salary || '0', 10);
  const fixed = parseInt(userData?.fixed || '0', 10);
  const variable = parseInt(userData?.variable || '0', 10);
  const monthlySavings = Math.max(salary - fixed - variable, 0);

  const chartData = MONTHS.map((m) => ({
    name: m,
    val: monthlySavings,
  }));

  const handleAddFunds = () => {
    if (fundForm.goalIdx === '' || !fundForm.amount) return;
    const g = goals[fundForm.goalIdx];
    if (!g) return;

    const amt = parseInt(fundForm.amount, 10);
    const updatedFunds = { ...goalFunds };
    updatedFunds[g.id] = (updatedFunds[g.id] || 0) + amt;
    
    setGoalFunds(updatedFunds);
    localStorage.setItem('bachatai_goal_funds', JSON.stringify(updatedFunds));
    setShowModal(false);
    setFundForm({ goalIdx: '', amount: '' });
  };

  return (
    <DashboardLayout>
      <div className="sp-page">
        <div className="sp-header sp-fade-in">
          <div>
            <h1 className="sp-title">Savings Management</h1>
            <p className="sp-subtitle">Track, allocate, and grow your wealth efficiently.</p>
          </div>
        </div>

        <div className="sp-top-row sp-slide-up">
          <div className="sp-card sp-goals-card">
            <h3>Active Savings Goals</h3>

            {goals.length === 0 ? (
              <div className="sp-empty">
                <Target size={40} color="#9ca3af" strokeWidth={1} style={{ marginBottom: '0.5rem' }} />
                <p>No active goals yet.</p>
              </div>
            ) : (
              <div className="sp-goals-list">
                {goals.map((g, i) => {
                  const target = parseInt(g.amount || '0', 10);
                  const saved = goalFunds[g.id] || 0;
                  const pct = target > 0 ? Math.min(Math.round((saved / target) * 100), 100) : 0;
                  
                  return (
                    <div className="sp-goal-progress-item" key={i}>
                      <div className="sp-goal-head">
                        <strong>{g.label}</strong>
                        <span className="sp-pct">{pct}%</span>
                      </div>
                      <div className="sp-bar">
                        <div className="sp-bar-fill" style={{ width: `${pct}%` }}></div>
                      </div>
                      <span className="sp-saved">{formatINR(saved)} of {formatINR(target)} saved</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="sp-card sp-actions-card">
            <h3>Quick Actions</h3>
            <p className="sp-actions-desc">Allocate funds or create new milestones for your future.</p>
            <div className="sp-action-buttons">
              <button className="sp-btn-primary" onClick={() => setShowModal(true)}>
                <Wallet size={16} /> Add Funds to Goal
              </button>
              <button className="sp-btn-outline" onClick={() => navigate('/goals')}>
                <Target size={16} /> Create New Goal
              </button>
            </div>
            
            <div className="sp-monthly-stat">
              <div className="sp-stat-icon"><TrendingUp size={24} color="#7c3aed" /></div>
              <div className="sp-stat-info">
                <span>EST. MONTHLY SAVINGS</span>
                <strong>{formatINR(monthlySavings)}</strong>
              </div>
            </div>
          </div>
        </div>

        <div className="sp-card sp-chart-card sp-slide-up" style={{ animationDelay: '0.1s' }}>
          <h3>Monthly Contribution History</h3>
          <p>Monthly Contribution (Last 6 Months)</p>
          <div className="sp-chart-area">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={chartData} barGap={8} margin={{ top: 20 }}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                <Bar dataKey="val" radius={[8, 8, 8, 8]} barSize={40}>
                  {chartData.map((_, i) => (
                    <Cell key={i} fill={`url(#barGrad-${i})`} />
                  ))}
                </Bar>
                <defs>
                  {chartData.map((_, i) => (
                    <linearGradient key={i} id={`barGrad-${i}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={`hsl(${265 + i * 4}, 75%, ${55 + i * 3}%)`} />
                      <stop offset="100%" stopColor={`hsl(${270 + i * 4}, 60%, ${70 + i * 2}%)`} />
                    </linearGradient>
                  ))}
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ADD FUNDS MODAL */}
      {showModal && (
        <div className="sp-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="sp-modal" onClick={e => e.stopPropagation()}>
            <div className="sp-modal-header">
              <h3>Add Funds</h3>
              <button onClick={() => setShowModal(false)}><X size={18} /></button>
            </div>
            <div className="sp-modal-body">
              {goals.length === 0 ? (
                <p style={{ fontSize: '0.9rem', color: '#6b7280' }}>Please create a goal first before adding funds.</p>
              ) : (
                <>
                  <label>Select Goal</label>
                  <select 
                    value={fundForm.goalIdx} 
                    onChange={e => setFundForm(f => ({ ...f, goalIdx: e.target.value }))}
                  >
                    <option value="">-- Choose a Goal --</option>
                    {goals.map((g, i) => (
                      <option value={i} key={i}>{g.label} (Target: {formatINR(g.amount)})</option>
                    ))}
                  </select>

                  <label>Amount to Add (₹)</label>
                  <input
                    type="number"
                    min="1"
                    placeholder="e.g. 5000"
                    value={fundForm.amount}
                    onChange={e => setFundForm(f => ({ ...f, amount: e.target.value }))}
                  />
                </>
              )}
            </div>
            <div className="sp-modal-footer">
              <button className="sp-btn-outline-cancel" onClick={() => setShowModal(false)}>Cancel</button>
              <button 
                className="sp-btn-primary" 
                onClick={handleAddFunds} 
                disabled={goals.length === 0 || fundForm.goalIdx === '' || !fundForm.amount}
              >
                <Check size={16} /> Add to Savings
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
