import React, { useState, useEffect } from 'react';
import { 
  Edit3, Plus, X, Check, Trash2,
  Target, Car as CarIcon, Home, Building, GraduationCap, 
  Plane, Briefcase, ShoppingBag, Music, Dumbbell, Star, Trophy, Rocket
} from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import './GoalsPage.css';

const GOAL_LABELS = {
  car: 'New Car', home: 'New Home', retire: 'Retirement',
  edu: 'Education', travel: 'World Travel', other: 'Custom Goal',
};

const GOAL_ICONS = {
  car: 'car', home: 'home', retire: 'retire',
  edu: 'edu', travel: 'travel', other: 'target',
};

const TIMELINES = ['< 1 year', '1–3 years', '3–5 years', '5–10 years', '10+ years'];

function formatINR(num) {
  if (!num) return '₹0';
  const n = parseInt(num, 10);
  return '₹' + n.toLocaleString('en-IN');
}

const getGoalIcon = (val, size=24) => {
  switch(val) {
    case 'car': case '🚗': return <CarIcon size={size} />;
    case 'home': case '🏠': return <Home size={size} />;
    case 'retire': case '🏦': case 'building': return <Building size={size} />;
    case 'edu': case '🎓': return <GraduationCap size={size} />;
    case 'travel': case '✈️': return <Plane size={size} />;
    case 'briefcase': case '💼': return <Briefcase size={size} />;
    case 'shopping': case '🛍️': return <ShoppingBag size={size} />;
    case 'music': case '🎵': return <Music size={size} />;
    case 'dumbbell': case '💪': return <Dumbbell size={size} />;
    default: return <Target size={size} />;
  }
};

const getBadge = (i) => {
  if (i === 0) return { icon: <Trophy size={14} color="#f59e0b" />, title: 'Consistent Saver' };
  if (i === 1) return { icon: <Rocket size={14} color="#3b82f6" />, title: 'Goal Crusher' };
  return { icon: <Star size={14} color="#8b5cf6" />, title: 'Milestone Achiever' };
};

export default function GoalsPage() {
  const [userData, setUserData] = useState(null);
  const [goals, setGoals] = useState([]);
  const [goalFunds, setGoalFunds] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [form, setForm] = useState({ label: '', amount: '', timeline: '', icon: 'target' });

  useEffect(() => {
    const stored = localStorage.getItem('bachatai_user');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setUserData(parsed);
        // Build initial goals from questionnaire answers
        const allGoals = parsed.allGoals || (parsed.goal ? [{
          id: parsed.goal,
          customGoal: parsed.customGoal || '',
          goalAmount: parsed.goalAmount || '0',
          timeline: parsed.timeline || '',
        }] : []);
        // Load any extra goals saved separately
        const extraGoals = localStorage.getItem('bachatai_extra_goals');
        const extras = extraGoals ? JSON.parse(extraGoals) : [];
        // Combine
        const combined = [
          ...allGoals.map(g => ({
            label: g.id === 'other' ? (g.customGoal || 'Custom Goal') : (GOAL_LABELS[g.id] || 'Goal'),
            amount: g.goalAmount || '0',
            timeline: g.timeline || '',
            icon: GOAL_ICONS[g.id] || 'target',
            fromQuestionnaire: true,
          })),
          ...extras,
        ];
        setGoals(combined);
      } catch(e) {}
    }
    const storedFunds = localStorage.getItem('bachatai_goal_funds');
    if (storedFunds) {
      try {
        setGoalFunds(JSON.parse(storedFunds));
      } catch(e) {}
    }
  }, []);

  const saveExtras = (newGoals) => {
    // Only persist the manually added goals
    const extras = newGoals.filter(g => !g.fromQuestionnaire);
    localStorage.setItem('bachatai_extra_goals', JSON.stringify(extras));
  };

  const openAddModal = () => {
    setForm({ label: '', amount: '', timeline: '', icon: 'target' });
    setEditIndex(null);
    setShowModal(true);
  };

  const openEditModal = (i) => {
    const g = goals[i];
    setForm({ label: g.label, amount: g.amount, timeline: g.timeline, icon: g.icon });
    setEditIndex(i);
    setShowModal(true);
  };

  const handleSave = () => {
    if (!form.label || !form.amount) return;
    const updated = [...goals];
    const newGoal = { label: form.label, amount: form.amount, timeline: form.timeline, icon: form.icon };
    if (editIndex !== null) {
      updated[editIndex] = { ...updated[editIndex], ...newGoal };
    } else {
      updated.push({ ...newGoal, fromQuestionnaire: false });
    }
    setGoals(updated);
    saveExtras(updated);
    setShowModal(false);
  };

  const handleDelete = (i) => {
    const updated = goals.filter((_, idx) => idx !== i);
    setGoals(updated);
    saveExtras(updated);
  };

  const name = userData?.name?.split(' ')[0] || 'Guest';

  return (
    <DashboardLayout>
      <div className="gp-page">
        {/* HEADER */}
        <div className="gp-header gp-fade-in">
          <div>
            <h1 className="gp-title">Financial Goals Roadmap</h1>
            <p className="gp-subtitle">Hello, {name}! Track your journey to financial freedom.</p>
          </div>
          <button className="gp-add-btn" onClick={openAddModal}>
            <Plus size={16} /> New Goal
          </button>
        </div>

        {/* EMPTY STATE */}
        {goals.length === 0 && (
          <div className="gp-empty gp-fade-in">
            <div className="gp-empty-icon"><Target size={48} strokeWidth={1.5} color="#9ca3af" /></div>
            <h2>No goals yet</h2>
            <p>Start by adding your first financial goal.</p>
            <button className="gp-add-btn" onClick={openAddModal}>+ Add First Goal</button>
          </div>
        )}

        {/* GOALS GRID */}
        {goals.length > 0 && (
          <div className="gp-grid">
            {goals.map((g, i) => {
              const goalId = g.id || g.label || `extra-${i}`;
              const amt = parseInt(g.amount || '0', 10);
              const saved = goalFunds[goalId] || 0;
              const pct = amt > 0 ? Math.min(Math.round((saved / amt) * 100), 100) : 0;
              const badge = getBadge(i);
              return (
                <div key={i} className="gp-card gp-slide-up" style={{ animationDelay: `${i * 0.08}s` }}>
                  {/* BADGE */}
                  <div className="gp-goal-badge">
                    {badge.icon} {badge.title}
                  </div>

                  <div className="gp-goal-icon-large" style={{ color: '#7c3aed' }}>{getGoalIcon(g.icon, 32)}</div>

                  <div className="gp-goal-head">
                    <strong>{g.label}</strong>
                    <span className="gp-pct">{pct}%</span>
                  </div>

                  <div className="gp-bar">
                    <div className="gp-bar-fill" style={{ width: `${pct}%` }}></div>
                  </div>

                  <div className="gp-goal-meta">
                    <span>{formatINR(saved)} of {formatINR(amt)}</span>
                    {g.timeline && <span className="gp-timeline-tag">{g.timeline}</span>}
                  </div>

                  <div className="gp-goal-actions">
                    <button className="gp-edit" onClick={() => openEditModal(i)}>
                      <Edit3 size={14} /> Edit
                    </button>
                    {!g.fromQuestionnaire && (
                      <button className="gp-delete" onClick={() => handleDelete(i)}>
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}

            {/* ADD NEW CARD */}
            <div className="gp-add-card gp-slide-up" style={{ animationDelay: `${goals.length * 0.08}s` }} onClick={openAddModal}>
              <Plus size={28} />
              <span>Add New Goal</span>
            </div>
          </div>
        )}
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="gp-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="gp-modal" onClick={e => e.stopPropagation()}>
            <div className="gp-modal-header">
              <h3>{editIndex !== null ? 'Edit Goal' : 'Add New Goal'}</h3>
              <button onClick={() => setShowModal(false)}><X size={18} /></button>
            </div>
            <div className="gp-modal-body">
              <label>Goal Icon</label>
              <div className="gp-icon-picker">
                {['target','car','home','travel','edu','retire','briefcase','shopping','music','dumbbell'].map(ico => (
                  <button
                    key={ico}
                    className={`gp-icon-opt ${form.icon === ico ? 'selected' : ''}`}
                    onClick={() => setForm(f => ({...f, icon: ico}))}
                  >
                    {getGoalIcon(ico, 20)}
                  </button>
                ))}
              </div>
              <label>Goal Name</label>
              <input
                type="text"
                placeholder="e.g. New Car, Dream Home..."
                value={form.label}
                onChange={e => setForm(f => ({...f, label: e.target.value}))}
              />
              <label>Target Amount (₹)</label>
              <input
                type="number"
                min="0"
                placeholder="e.g. 500000"
                value={form.amount}
                onChange={e => setForm(f => ({...f, amount: e.target.value}))}
              />
              <label>Timeline</label>
              <div className="gp-timeline-pills">
                {TIMELINES.map(t => (
                  <button
                    key={t}
                    className={`gp-timeline-pill ${form.timeline === t ? 'selected' : ''}`}
                    onClick={() => setForm(f => ({...f, timeline: t}))}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div className="gp-modal-footer">
              <button className="gp-modal-cancel" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="gp-modal-save" onClick={handleSave} disabled={!form.label || !form.amount}>
                <Check size={16} /> {editIndex !== null ? 'Save Changes' : 'Add Goal'}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
