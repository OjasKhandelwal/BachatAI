import React, { useState, useEffect } from 'react';
import {
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Area, AreaChart
} from 'recharts';
import {
  Utensils, Lightbulb, TrendingUp, PiggyBank,
  Search, Zap
} from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import './InsightsPage.css';

const MONTHS_LONG = ['JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC', 'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN'];

function formatINR(num) {
  if (!num || isNaN(num)) return '₹0';
  const n = Math.round(num);
  if (n >= 100000) return '₹' + (n / 100000).toFixed(1) + 'L';
  if (n >= 1000) return '₹' + (n / 1000).toFixed(0) + 'K';
  return '₹' + n.toLocaleString('en-IN');
}

const INSIGHT_CARDS = [
  {
    tag: 'Spending Habits',
    icon: <Utensils size={28} />,
    title: 'Dining Out High',
    desc: 'You spend 20% more on dining out than similar profiles.',
    metricLabel: '/ mo.',
    color: '#a78bfa',
  },
  {
    tag: 'Saving Opportunities',
    icon: <Lightbulb size={28} />,
    title: 'Potential Savings',
    desc: 'Reduce subscriptions and optimize utilities.',
    metricLabel: '/ mo.',
    color: '#818cf8',
  },
  {
    tag: 'Future Net Worth (Predicted)',
    icon: <TrendingUp size={28} />,
    title: 'Projected Growth',
    desc: 'Based on current trends, by 2030.',
    metricLabel: '',
    color: '#c084fc',
  },
  {
    tag: 'Fixed Cost Optimization',
    icon: <PiggyBank size={28} />,
    title: 'Smart Savings',
    desc: 'Switching internet provider could save ₹600/mo.',
    metricLabel: '/ yr',
    color: '#7c3aed',
  },
];

const SUGGESTION_CARDS = [
  {
    title: 'Subscription Audit',
    desc: 'Identify unused subscriptions. You have 3 recurring services unused for 3+ months.',
    cta: 'Review Services',
    icon: <Search size={24} />,
  },
  {
    title: 'Utility Rate Comparison',
    desc: 'AI found better rates for your electricity and internet.',
    cta: 'Compare Rates',
    icon: <Zap size={24} />,
  },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="ip-tooltip">
        <div className="ip-tooltip-label">{label}</div>
        {payload.map((p, i) => (
          <div key={i} className="ip-tooltip-row" style={{ color: p.color }}>
            {p.name}: {formatINR(p.value)}
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function InsightsPage() {
  const [userData, setUserData] = useState(null);
  const [reviewed, setReviewed] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem('bachatai_user');
    if (stored) { try { setUserData(JSON.parse(stored)); } catch(e) {} }
  }, []);

  const name = userData?.name?.split(' ')[0] || 'Guest';
  const salary = parseInt(userData?.salary || '60000', 10);
  const fixed = parseInt(userData?.fixed || '20000', 10);
  const variable = parseInt(userData?.variable || '15000', 10);
  const totalExpenses = fixed + variable;
  const monthlySavings = Math.max(salary - totalExpenses, 0);

  // Predictive net worth (12 months) + realistic spending trend
  let currentNetWorth = 0;
  const chartData = MONTHS_LONG.map((m) => {
    currentNetWorth = (currentNetWorth + monthlySavings) * 1.005; // 6% annual compounding
    return {
      name: m,
      netWorth: Math.round(currentNetWorth),
      spending: totalExpenses,
    };
  });

  const diningExtra = Math.round(variable * 0.15); // Est. 15% of variable costs
  const potentialSavings = Math.round((fixed + variable) * 0.08); // Est. 8% optimization
  const projectedNetWorth = Math.round(currentNetWorth * Math.pow(1.005, 120)); // Compounding 10 years
  const fixedSavings = Math.round(fixed * 0.05 * 12); // Save 5% on fixed / yr
  
  const score = Math.min(100, Math.round((monthlySavings / salary) * 200 + 40)) || 50;

  const INSIGHT_CARDS = [
    {
      tag: 'Spending Habits',
      icon: <Utensils size={28} />,
      title: 'Variable Cost Ratio',
      desc: `You spend roughly ${formatINR(diningExtra)} on dining and leisure.`,
      metricLabel: '/ mo.',
      color: '#a78bfa',
    },
    {
      tag: 'Saving Opportunities',
      icon: <Lightbulb size={28} />,
      title: 'Potential Savings',
      desc: 'Optimizing subscriptions could save you up to 8% overall.',
      metricLabel: '/ mo.',
      color: '#818cf8',
    },
    {
      tag: 'Future Net Worth',
      icon: <TrendingUp size={28} />,
      title: '10-Year Growth',
      desc: 'Compounded closely at 6% annual return rate for 10 years.',
      metricLabel: '',
      color: '#c084fc',
    },
    {
      tag: 'Fixed Cost Optimization',
      icon: <PiggyBank size={28} />,
      title: 'Smart Savings',
      desc: `Switching providers could reduce fixed overhead by 5%.`,
      metricLabel: '/ yr',
      color: '#7c3aed',
    },
  ];

  const insightMetrics = [
    formatINR(diningExtra),
    formatINR(potentialSavings),
    formatINR(projectedNetWorth),
    formatINR(fixedSavings),
  ];

  const handleReview = (idx) => {
    setReviewed(prev => prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]);
  };

  return (
    <DashboardLayout>
      <div className="ip-page">
        {/* HEADER */}
        <div className="ip-header ip-fade-in">
          <h1>Deep AI Financial Insights</h1>
          <p>Deep dive into spending habits and saving opportunities for <strong>{name}</strong>.</p>
        </div>

        {/* INSIGHT CARDS */}
        <div className="ip-insight-grid">
          {INSIGHT_CARDS.map((card, i) => (
            <div
              key={i}
              className="ip-insight-card ip-slide-up"
              style={{ animationDelay: `${i * 0.08}s`, '--accent': card.color }}
            >
              <div className="ip-insight-tag">{card.tag}</div>
              <div className="ip-insight-icon">{card.icon}</div>
              <div className="ip-insight-title">{card.title}</div>
              <div className="ip-insight-desc">{card.desc}</div>
              <div className="ip-insight-metric">
                <span className="ip-metric-val">{insightMetrics[i]}</span>
                <span className="ip-metric-unit">{card.metricLabel}</span>
              </div>
            </div>
          ))}
        </div>

        {/* PREDICTIVE CHART */}
        <div className="ip-chart-card ip-fade-in" style={{ animationDelay: '0.35s' }}>
          <div className="ip-chart-title">
            Predictive Net Worth Analysis & Spending Trends (Next 12 Months)
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={chartData} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="netWorthGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a78bfa" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#a78bfa" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="spendingGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11 }}
                tickFormatter={v => formatINR(v)}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="netWorth"
                name="Net Worth"
                stroke="#a78bfa"
                strokeWidth={2.5}
                fill="url(#netWorthGrad)"
                dot={{ fill: '#a78bfa', r: 4, strokeWidth: 0 }}
                activeDot={{ r: 6, fill: '#c084fc' }}
              />
              <Area
                type="monotone"
                dataKey="spending"
                name="Spending"
                stroke="#38bdf8"
                strokeWidth={2}
                strokeDasharray="6 4"
                fill="url(#spendingGrad)"
                dot={{ fill: '#38bdf8', r: 3, strokeWidth: 0 }}
                activeDot={{ r: 5, fill: '#38bdf8' }}
              />
            </AreaChart>
          </ResponsiveContainer>
          <div className="ip-chart-legend">
            <span className="ip-legend-dot purple"></span> Net Worth
            <span className="ip-legend-dot cyan"></span> — — Spending
          </div>
        </div>

        {/* SUGGESTIONS */}
        <div className="ip-suggestions ip-fade-in" style={{ animationDelay: '0.5s' }}>
          <h2>AI-Driven Suggestions for Optimizing Fixed Costs</h2>
          <div className="ip-suggestion-grid">
            {SUGGESTION_CARDS.map((s, i) => (
              <div key={i} className="ip-suggestion-card ip-slide-up" style={{ animationDelay: `${0.55 + i * 0.1}s` }}>
                <div className="ip-sug-icon">{s.icon}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
                <button
                  className={`ip-sug-btn ${reviewed.includes(i) ? 'reviewed' : ''}`}
                  onClick={() => handleReview(i)}
                >
                  {reviewed.includes(i) ? '✓ Done' : s.cta}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* AI SCORE */}
        <div className="ip-score-card ip-fade-in" style={{ animationDelay: '0.65s' }}>
          <div className="ip-score-left">
            <h3>Your Financial Health Score</h3>
            <p>Based on savings rate, spending habits, and goal progress.</p>
          </div>
          <div className="ip-score-ring">
            <svg viewBox="0 0 80 80" width="80" height="80">
              <circle cx="40" cy="40" r="32" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
              <circle
                cx="40" cy="40" r="32" fill="none"
                stroke="url(#scoreGrad)" strokeWidth="8"
                strokeDasharray={`${2 * Math.PI * 32 * 0.72} ${2 * Math.PI * 32}`}
                strokeDashoffset={2 * Math.PI * 32 * 0.25}
                transform="rotate(-90 40 40)"
                strokeLinecap="round"
              />
              <defs>
                <linearGradient id="scoreGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#a78bfa" />
                  <stop offset="100%" stopColor="#38bdf8" />
                </linearGradient>
              </defs>
            </svg>
            <div className="ip-score-number">{score}</div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
