import React, { useState, useEffect } from 'react';
import {
  Home, Zap, Car as CarIcon, Plus, X, Check,
  Smartphone, Droplets, Tv, Dumbbell, Package,
  Coins, Landmark, Target, PieChart
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell, Tooltip } from 'recharts';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import './DashboardPage.css';

const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN'];

function formatINR(num) {
  if (!num) return '₹0';
  const n = parseInt(num, 10);
  if (isNaN(n) || n === 0) return '₹0';
  return '₹' + n.toLocaleString('en-IN');
}

const EXPENSE_CATEGORIES = [
  { iconName: 'home', label: 'Rent / Mortgage' },
  { iconName: 'zap', label: 'Electricity Bill' },
  { iconName: 'car', label: 'Auto Insurance' },
  { iconName: 'phone', label: 'Phone Bill' },
  { iconName: 'droplets', label: 'Water Bill' },
  { iconName: 'tv', label: 'Streaming Services' },
  { iconName: 'gym', label: 'Gym Membership' },
  { iconName: 'other', label: 'Other' },
];

const getExpenseIcon = (label, size=16) => {
  if (label.includes('Rent')) return <Home size={size} />;
  if (label.includes('Electricity')) return <Zap size={size} />;
  if (label.includes('Auto')) return <CarIcon size={size} />;
  if (label.includes('Phone')) return <Smartphone size={size} />;
  if (label.includes('Water')) return <Droplets size={size} />;
  if (label.includes('Streaming')) return <Tv size={size} />;
  if (label.includes('Gym')) return <Dumbbell size={size} />;
  return <Package size={size} />;
};

const GOAL_LABELS = {
  car: 'New Car', home: 'New Home', retire: 'Retirement',
  edu: 'Education', travel: 'World Travel', other: '',
};

export default function DashboardPage() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);

  /* ── ADD EXPENSE MODAL ── */
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [newExpense, setNewExpense] = useState({ category: '', amount: '', dueIn: '' });
  const [expenses, setExpenses] = useState([]);
  const [paidExpenses, setPaidExpenses] = useState([]);
  const [goalFunds, setGoalFunds] = useState({});

  /* ── LOAD USER DATA ── */
  useEffect(() => {
    const stored = localStorage.getItem('bachatai_user');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setUserData(parsed);
        // Load saved expenses
        const savedExpenses = localStorage.getItem('bachatai_expenses');
        if (savedExpenses) setExpenses(JSON.parse(savedExpenses));
      } catch(e) {}
    }
    const storedFunds = localStorage.getItem('bachatai_goal_funds');
    if (storedFunds) {
      try {
        setGoalFunds(JSON.parse(storedFunds));
      } catch(e) {}
    }
  }, []);

  const name = userData?.name?.split(' ')[0] || 'Guest';
  const salary = parseInt(userData?.salary || '0', 10);
  const fixed = parseInt(userData?.fixed || '0', 10);
  const variable = parseInt(userData?.variable || '0', 10);
  const totalExpenses = fixed + variable;
  const monthlySavings = Math.max(salary - totalExpenses, 0);
  const totalSavings = monthlySavings * 6;

  const chartData = MONTHS.map((m) => ({
    name: m,
    savings: monthlySavings,
    expenses: totalExpenses,
  }));

  /* ── USER GOALS (from questionnaire) ── */
  const allGoals = userData?.allGoals || (userData?.goal ? [{
    id: userData.goal,
    customGoal: userData.customGoal || '',
    goalAmount: userData.goalAmount || '0',
    timeline: userData.timeline || '',
  }] : []);

  const getGoalLabel = (g) => {
    if (g.id === 'other') return g.customGoal || 'Custom Goal';
    return GOAL_LABELS[g.id] || 'Goal';
  };

  /* ── ADD EXPENSE ── */
  const handleAddExpense = () => {
    if (!newExpense.category || !newExpense.amount) return;
    const cat = EXPENSE_CATEGORIES.find(c => c.label === newExpense.category);
    const expense = {
      id: Date.now(),
      label: newExpense.category,
      sub: newExpense.dueIn ? `Due in ${newExpense.dueIn} days` : 'Upcoming',
      amount: newExpense.amount,
    };
    const updated = [...expenses, expense];
    setExpenses(updated);
    localStorage.setItem('bachatai_expenses', JSON.stringify(updated));
    setNewExpense({ category: '', amount: '', dueIn: '' });
    setShowExpenseModal(false);
  };

  const handleMarkPaid = (id) => {
    setPaidExpenses(prev => [...prev, id]);
    setTimeout(() => {
      const updated = expenses.filter(e => e.id !== id);
      setExpenses(updated);
      localStorage.setItem('bachatai_expenses', JSON.stringify(updated));
      setPaidExpenses(prev => prev.filter(p => p !== id));
    }, 600);
  };

  return (
    <DashboardLayout>
      <div className="dp-page">
        {/* GREETING */}
        <div className="dp-greeting dp-fade-in">
          <h1>Hello, {name}! Your financial snapshot.</h1>
          <p>AI-generated recommendations for your goals.</p>
        </div>

        {/* STAT CARDS */}
        <div className="dp-stat-row">
          {[
            { label: 'MONTHLY SALARY', value: formatINR(salary), icon: <Coins size={22} />, cls: 'purple-1' },
            { label: 'TOTAL SAVINGS (6M)', value: formatINR(totalSavings), icon: <Landmark size={22} />, cls: 'purple-2' },
            { label: 'ACTIVE GOALS', value: String(allGoals.length || 0), icon: <Target size={22} />, cls: 'purple-3' },
            { label: 'MONTHLY EXPENSES', value: formatINR(totalExpenses), icon: <PieChart size={22} />, cls: 'purple-4' },
          ].map(({ label, value, icon, cls }, i) => (
            <div key={i} className={`dp-stat-card ${cls} dp-slide-up`} style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="dp-stat-icon">{icon}</div>
              <span className="dp-stat-label">{label}</span>
              <strong className="dp-stat-val">{value}</strong>
            </div>
          ))}
        </div>

        {/* CHART */}
        <div className="dp-row-chart dp-fade-in" style={{ animationDelay: '0.3s' }}>
          <div className="dp-card dp-chart-card">
            <div className="dp-chart-header">
              <div>
                <h3>AI Financial Analysis</h3>
                <p>Savings vs. Expenses (Last 6 Months)</p>
              </div>
              <div className="dp-chart-legend">
                <span className="dot-purple"></span> SAVINGS
                <span className="dot-blue"></span> EXPENSES
              </div>
            </div>
            <div className="dp-chart-area">
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={chartData} barGap={4}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f5" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 11 }} />
                  <Tooltip
                    formatter={(value) => formatINR(value)}
                    contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                  />
                  <Bar dataKey="savings" radius={[6, 6, 0, 0]} barSize={28}>
                    {chartData.map((_, i) => (
                      <Cell key={i} fill={`hsl(${260 + i * 5}, 70%, ${55 + i * 3}%)`} />
                    ))}
                  </Bar>
                  <Bar dataKey="expenses" radius={[6, 6, 0, 0]} barSize={28}>
                    {chartData.map((_, i) => (
                      <Cell key={i} fill={`hsl(${270 + i * 3}, 55%, ${72 + i * 2}%)`} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* BOTTOM ROW */}
        <div className="dp-row-bottom dp-fade-in" style={{ animationDelay: '0.4s' }}>
          {/* SAVINGS GOALS - only from questionnaire */}
          <div className="dp-card dp-goals-card">
            <h3>Your Goals</h3>
            {allGoals.length === 0 ? (
              <div className="dp-empty-goals">
                <p>No goals set yet.</p>
                <button className="dp-add-goal-link" onClick={() => navigate('/goals')}>+ Add your first goal</button>
              </div>
            ) : (
              allGoals.map((g, i) => {
                const goalId = g.id || g.customGoal || 'q-goal';
                const amt = parseInt(g.goalAmount || '0', 10);
                const saved = goalFunds[goalId] || 0;
                const pct = amt > 0 ? Math.min(Math.round((saved / amt) * 100), 100) : 0;
                return (
                  <div className="dp-goal-item" key={i}>
                    <div className="dp-goal-top">
                      <strong>{getGoalLabel(g)}</strong>
                      <span className="dp-goal-pct">{pct}%</span>
                    </div>
                    <div className="dp-progress-track">
                      <div
                        className={`dp-progress-fill ${i % 3 === 0 ? 'purple' : i % 3 === 1 ? 'blue' : 'light'}`}
                        style={{ width: `${Math.min(pct, 100)}%` }}
                      ></div>
                    </div>
                    <span className="dp-goal-sub">
                      {formatINR(saved)} of {formatINR(amt)} saved
                      {g.timeline ? ` · ${g.timeline}` : ''}
                    </span>
                  </div>
                );
              })
            )}
            <button className="dp-view-all" style={{ marginTop: '1rem' }} onClick={() => navigate('/goals')}>
              Manage Goals →
            </button>
          </div>

          {/* UPCOMING EXPENSES */}
          <div className="dp-card dp-expenses-card">
            <h3>Upcoming Expenses</h3>
            <div className="dp-expenses-list">
              {expenses.length === 0 ? (
                <div className="dp-empty-goals">
                  <p>No expenses tracked yet.</p>
                </div>
              ) : (
                expenses.map((exp) => (
                  <div
                    key={exp.id}
                    className={`dp-expense-item ${paidExpenses.includes(exp.id) ? 'dp-expense-paid' : ''}`}
                  >
                    <div className="dp-expense-icon">{getExpenseIcon(exp.label, 18)}</div>
                    <div className="dp-expense-info">
                      <strong>{exp.label}</strong>
                      <span>{exp.sub}</span>
                    </div>
                    <span className="dp-expense-amt">{formatINR(exp.amount)}</span>
                    <button
                      className="dp-add-now-btn"
                      onClick={() => handleMarkPaid(exp.id)}
                    >
                      <Check size={12} /> Paid
                    </button>
                  </div>
                ))
              )}
            </div>
            <div className="dp-expense-actions">
              <button className="dp-view-all" onClick={() => navigate('/savings')}>View Savings</button>
              <button className="dp-add-expense-btn" onClick={() => setShowExpenseModal(true)}>
                <Plus size={14} /> Add Expense
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ADD EXPENSE MODAL */}
      {showExpenseModal && (
        <div className="dp-modal-overlay" onClick={() => setShowExpenseModal(false)}>
          <div className="dp-modal" onClick={e => e.stopPropagation()}>
            <div className="dp-modal-header">
              <h3>Add Upcoming Expense</h3>
              <button onClick={() => setShowExpenseModal(false)}><X size={18} /></button>
            </div>
            <div className="dp-modal-body">
              <label>Category</label>
              <select value={newExpense.category} onChange={e => setNewExpense(v => ({...v, category: e.target.value}))}>
                <option value="">Select category...</option>
                {EXPENSE_CATEGORIES.map(c => (
                  <option key={c.label} value={c.label}>{c.label}</option>
                ))}
              </select>

              <label>Amount (₹)</label>
              <input
                type="number"
                min="0"
                placeholder="e.g. 15000"
                value={newExpense.amount}
                onChange={e => setNewExpense(v => ({...v, amount: e.target.value}))}
              />

              <label>Due in (days)</label>
              <input
                type="number"
                min="1"
                placeholder="e.g. 5"
                value={newExpense.dueIn}
                onChange={e => setNewExpense(v => ({...v, dueIn: e.target.value}))}
              />
            </div>
            <div className="dp-modal-footer">
              <button className="dp-modal-cancel" onClick={() => setShowExpenseModal(false)}>Cancel</button>
              <button className="dp-modal-save" onClick={handleAddExpense} disabled={!newExpense.category || !newExpense.amount}>
                Add Expense
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
