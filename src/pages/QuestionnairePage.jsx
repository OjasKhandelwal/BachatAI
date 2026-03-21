import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Car, Home, TrendingUp, GraduationCap, Globe, MoreHorizontal, ArrowRight, ArrowLeft, X, Lock, User, Plus, Trash2 } from 'lucide-react';
import './QuestionnairePage.css';
import { numberToWords } from '../utils/numberToWords';

const TOTAL_STEPS = 6;

const GOALS = [
  { id: 'car',       icon: Car,          label: 'Buying a Car',   desc: 'Saving for a premium vehicle or your first everyday ride.' },
  { id: 'home',      icon: Home,         label: 'New Home',       desc: 'Planning for a down payment or property investment.' },
  { id: 'retire',    icon: TrendingUp,   label: 'Retirement',     desc: 'Building a long-term nest egg for a secure future.' },
  { id: 'edu',       icon: GraduationCap,label: 'Education',      desc: 'Funding higher education for yourself or your children.' },
  { id: 'travel',    icon: Globe,        label: 'World Travel',   desc: 'Creating a dedicated fund for future global adventures.' },
  { id: 'other',     icon: MoreHorizontal,label:'Something Else', desc: "A custom goal not listed above. We'll define it next." },
];

const TIMELINES = ['Less than 1 year', '1–3 years', '3–5 years', '5–10 years', '10+ years'];

export default function QuestionnairePage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState({
    name: '', age: '', salary: '', fixed: '', variable: '', savings: '',
    goals: [{ id: '', customGoal: '', goalAmount: '', timeline: '' }],
  });
  const [activeGoalIndex, setActiveGoalIndex] = useState(0);
  const inputRef = useRef(null);

  const pct = Math.round((step / TOTAL_STEPS) * 100);

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, [step]);

  // Press Enter to advance (not on step 5)
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Enter' && step !== 5) advance();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [step, answers]);

  const set = (key, val) => setAnswers(a => ({ ...a, [key]: val }));

  const setGoalField = (index, field, value) => {
    setAnswers(a => {
      const goals = [...a.goals];
      goals[index] = { ...goals[index], [field]: value };
      return { ...a, goals };
    });
  };

  const addGoal = () => {
    setAnswers(a => ({
      ...a,
      goals: [...a.goals, { id: '', customGoal: '', goalAmount: '', timeline: '' }]
    }));
    setActiveGoalIndex(answers.goals.length);
  };

  const removeGoal = (index) => {
    if (answers.goals.length <= 1) return;
    setAnswers(a => ({
      ...a,
      goals: a.goals.filter((_, i) => i !== index)
    }));
    if (activeGoalIndex >= answers.goals.length - 1) {
      setActiveGoalIndex(Math.max(0, answers.goals.length - 2));
    }
  };

  const currentGoal = answers.goals[activeGoalIndex] || answers.goals[0];

  const canAdvance = () => {
    if (step === 1) return answers.name.trim().length > 0;
    if (step === 2) return answers.salary.trim().length > 0;
    if (step === 3) return answers.fixed.trim().length > 0;
    if (step === 4) return answers.variable.trim().length > 0;
    if (step === 5) {
      return answers.goals.every(g =>
        g.id !== '' && (g.id !== 'other' || g.customGoal.trim().length > 0)
      );
    }
    if (step === 6) {
      return answers.goals.every(g =>
        g.goalAmount.trim().length > 0 && g.timeline !== ''
      );
    }
    return true;
  };

  const skipStep4 = () => {
    set('variable', '0');
    if (step < TOTAL_STEPS) setStep(s => s + 1);
  };

  const advance = () => {
    if (!canAdvance()) return;
    if (step < TOTAL_STEPS) {
      setStep(s => s + 1);
    } else {
      // Save to localStorage — flatten first goal for backward compat
      const primary = answers.goals[0];
      const saveData = {
        name: answers.name,
        age: answers.age,
        salary: answers.salary,
        fixed: answers.fixed,
        variable: answers.variable,
        savings: answers.savings,
        goal: primary.id,
        customGoal: primary.customGoal,
        goalAmount: primary.goalAmount,
        timeline: primary.timeline,
        allGoals: answers.goals,
      };
      localStorage.setItem('bachatai_user', JSON.stringify(saveData));
      navigate('/login');
    }
  };

  const back = () => {
    if (step > 1) setStep(s => s - 1);
    else navigate('/');
  };

  const stepLabel = `STEP ${String(step).padStart(2, '0')} OF ${String(TOTAL_STEPS).padStart(2, '0')}`;

  return (
    <div className="q-page">
      {/* Top bar */}
      <header className="q-header">
        <div className="q-logo">
          <svg width="20" height="20" viewBox="0 0 48 46" fill="none">
            <path d="M25.946 44.938c-.664.845-2.021.375-2.021-.698V33.937a2.26 2.26 0 0 0-2.262-2.262H10.287c-.92 0-1.456-1.04-.92-1.788l7.48-10.471c1.07-1.497 0-3.578-1.842-3.578H1.237c-.92 0-1.456-1.04-.92-1.788L10.013.474c.214-.297.556-.474.92-.474h28.894c.92 0 1.456 1.04.92 1.788l-7.48 10.471c-1.07 1.498 0 3.579 1.842 3.579h11.377c.943 0 1.473 1.088.89 1.83L25.947 44.94z" fill="#a78bfa"/>
          </svg>
          <span>BachatAI</span>
        </div>
        <button className="q-exit" onClick={() => navigate('/')}>
          <X size={16}/> EXIT SURVEY
        </button>
      </header>

      {/* Progress */}
      <div className="q-progress-area">
        <div className="q-step-label">
          <span>{stepLabel}</span>
          <span>{pct}% Complete</span>
        </div>
        <div className="q-progress-track">
          <div className="q-progress-fill" style={{ width: `${pct}%` }} />
        </div>
      </div>

      {/* Card */}
      <main className="q-main">
        <div className="q-card">

          {/* STEP 1 — Name */}
          {step === 1 && (
            <div className="q-step">
              <h1>What is your <span className="accent">name?</span></h1>
              <p className="q-sub">We'll use this to personalize your wealth intelligence dashboard.</p>
              <input
                ref={inputRef}
                className="q-input q-input-underline"
                type="text"
                placeholder="Type your full name here..."
                value={answers.name}
                onChange={e => set('name', e.target.value)}
              />
            </div>
          )}

          {/* STEP 2 — Monthly salary */}
          {step === 2 && (
            <div className="q-step">
              <div className="q-category">FINANCIAL PROFILE</div>
              <h1>What is your current <span className="accent">monthly salary?</span></h1>
              <p className="q-sub">This helps us calculate your optimal savings rate.</p>
              <div className="q-money-input">
                <span className="q-currency">₹</span>
                <input
                  ref={inputRef}
                  type="number"
                  min="0"
                  step="1000"
                  placeholder="0.00"
                  value={answers.salary}
                  onChange={e => set('salary', e.target.value)}
                />
              </div>
              {answers.salary && <div className="q-words-hint">{numberToWords(answers.salary)}</div>}
            </div>
          )}

          {/* STEP 3 — Fixed expenses */}
          {step === 3 && (
            <div className="q-step">
              <div className="q-category">FINANCIAL PROFILE</div>
              <h1>What are your <span className="accent">fixed monthly</span> expenses?</h1>
              <p className="q-sub">Rent, subscriptions, loan EMIs — things you pay every month without fail.</p>
              <div className="q-money-input">
                <span className="q-currency">₹</span>
                <input
                  ref={inputRef}
                  type="number"
                  min="0"
                  step="1000"
                  placeholder="0.00"
                  value={answers.fixed}
                  onChange={e => set('fixed', e.target.value)}
                />
              </div>
              {answers.fixed && <div className="q-words-hint">{numberToWords(answers.fixed)}</div>}
            </div>
          )}

          {/* STEP 4 — Variable expenses */}
          {step === 4 && (
            <div className="q-step">
              <div className="q-category">FINANCIAL PROFILE</div>
              <h1>What are your <span className="accent">variable monthly</span> expenses?</h1>
              <p className="q-sub">Dining, shopping, entertainment — things that change month to month.</p>
              <div className="q-money-input">
                <span className="q-currency">₹</span>
                <input
                  ref={inputRef}
                  type="number"
                  min="0"
                  step="1000"
                  placeholder="0.00"
                  value={answers.variable}
                  onChange={e => set('variable', e.target.value)}
                />
              </div>
              {answers.variable && answers.variable !== '0' && <div className="q-words-hint">{numberToWords(answers.variable)}</div>}
            </div>
          )}

          {/* STEP 5 — Financial goals (multi-goal) */}
          {step === 5 && (
            <div className="q-step q-step-wide">
              <div className="q-category">FINANCIAL INTENT</div>
              <h1>What are your future <span className="accent">financial goals?</span></h1>
              <p className="q-sub">Select goals for your portfolio. You can add multiple goals.</p>

              {/* Goal tabs */}
              <div className="q-goal-tabs">
                {answers.goals.map((g, i) => (
                  <button
                    key={i}
                    className={`q-goal-tab ${activeGoalIndex === i ? 'active' : ''}`}
                    onClick={() => setActiveGoalIndex(i)}
                  >
                    Goal {i + 1}
                    {answers.goals.length > 1 && (
                      <span
                        className="q-goal-tab-remove"
                        onClick={(e) => { e.stopPropagation(); removeGoal(i); }}
                      >
                        <Trash2 size={12} />
                      </span>
                    )}
                  </button>
                ))}
                <button className="q-goal-tab q-add-goal-tab" onClick={addGoal}>
                  <Plus size={14} /> Add Goal
                </button>
              </div>

              <div className="q-goal-grid">
                {GOALS.map(({ id, icon: Icon, label, desc }) => (
                  <button
                    key={id}
                    className={`q-goal-card ${currentGoal.id === id ? 'selected' : ''}`}
                    onClick={() => setGoalField(activeGoalIndex, 'id', id)}
                  >
                    {currentGoal.id === id && (
                      <div className="q-check"><ArrowRight size={14}/></div>
                    )}
                    <div className="q-goal-icon"><Icon size={22}/></div>
                    <div className="q-goal-label">{label}</div>
                    <div className="q-goal-desc">{desc}</div>
                  </button>
                ))}
              </div>
              {currentGoal.id === 'other' && (
                <div style={{ marginTop: '2rem', animation: 'fadeIn 0.3s ease' }}>
                  <label className="q-label">SPECIFY YOUR GOAL</label>
                  <input
                    className="q-input q-input-underline"
                    type="text"
                    placeholder="E.g., Start a business..."
                    value={currentGoal.customGoal}
                    onChange={e => setGoalField(activeGoalIndex, 'customGoal', e.target.value)}
                  />
                </div>
              )}
            </div>
          )}

          {/* STEP 6 — Goal amounts + timelines (multi-goal) */}
          {step === 6 && (
            <div className="q-step">
              <div className="q-category">GOAL DETAILS</div>
              <h1>How much do you want to <span className="accent">save?</span></h1>
              <p className="q-sub">Set target amounts and timelines for each goal.</p>

              {answers.goals.map((g, i) => {
                const goalName = g.id === 'other' ? (g.customGoal || 'Custom Goal') :
                  GOALS.find(gl => gl.id === g.id)?.label || `Goal ${i + 1}`;
                return (
                  <div className="q-multi-goal-block" key={i}>
                    <div className="q-multi-goal-label">{goalName}</div>
                    <div className="q-money-input" style={{ marginBottom: '0.5rem' }}>
                      <span className="q-currency">₹</span>
                      <input
                        ref={i === 0 ? inputRef : undefined}
                        type="number"
                        min="0"
                        step="1000"
                        placeholder="0.00"
                        value={g.goalAmount}
                        onChange={e => setGoalField(i, 'goalAmount', e.target.value)}
                      />
                    </div>
                    {g.goalAmount && <div className="q-words-hint" style={{ marginBottom: '0.8rem' }}>{numberToWords(g.goalAmount)}</div>}
                    <label className="q-label">GOAL TIMELINE</label>
                    <div className="q-timeline-row">
                      {TIMELINES.map(t => (
                        <button
                          key={t}
                          className={`q-timeline-btn ${g.timeline === t ? 'selected' : ''}`}
                          onClick={() => setGoalField(i, 'timeline', t)}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Nav buttons */}
          <div className="q-nav">
            <button className="q-back" onClick={back}>
              <ArrowLeft size={16}/> {step === 5 ? 'PREVIOUS QUESTION' : step === 1 ? 'GO BACK' : 'BACK'}
            </button>
            {step === 4 && (
              <button className="q-skip-btn" onClick={skipStep4}>
                Skip for now
              </button>
            )}
            <button
              className={`q-continue ${canAdvance() ? 'active' : ''}`}
              onClick={advance}
              disabled={!canAdvance()}
            >
              {step === TOTAL_STEPS ? 'FINISH' : step === 5 ? 'Continue' : 'CONTINUE'}
              <ArrowRight size={16}/>
            </button>
          </div>
        </div>

        {/* Footer hints */}
        {step === 1 && (
          <div className="q-hint">
            <kbd>ENTER ↵</kbd> TO PROCEED TO THE NEXT STEP
          </div>
        )}
        {(step === 2 || step === 3 || step === 4 || step === 6) && (
          <div className="q-hint">
            <Lock size={12}/> YOUR DATA IS ENCRYPTED AND PRIVATE
          </div>
        )}
      </main>

      <footer className="q-footer">BachatAI • SECURE WEALTH INTELLIGENCE</footer>
    </div>
  );
}
