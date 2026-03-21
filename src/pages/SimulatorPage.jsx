import React, { useState, useEffect, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import DashboardLayout from '../components/DashboardLayout';
import './SimulatorPage.css';

function formatINR(num) {
  if (isNaN(num)) return '₹0';
  return '₹' + Math.round(num).toLocaleString('en-IN');
}

export default function SimulatorPage() {
  const [userData, setUserData] = useState(null);
  
  // State for Simulator Assumptions
  const [income, setIncome] = useState(100000);
  const [expenses, setExpenses] = useState(35000);
  const [annualReturn, setAnnualReturn] = useState(12);
  const [timeHorizon, setTimeHorizon] = useState(10);
  const [customSavings, setCustomSavings] = useState('');

  // Load defaults from user profile
  useEffect(() => {
    const stored = localStorage.getItem('bachatai_user');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setUserData(parsed);
        if (parsed.salary) setIncome(parseInt(parsed.salary, 10));
        if (parsed.fixed || parsed.variable) {
          setExpenses(parseInt(parsed.fixed || 0, 10) + parseInt(parsed.variable || 0, 10));
        }
      } catch (e) {}
    }
  }, []);

  // Calculate actual savings per month
  const baseSavings = Math.max(0, income - expenses);
  const actualSavings = customSavings !== '' ? parseInt(customSavings, 10) : baseSavings;

  // Run Simulation Calculations
  const { chartData, tableData, summary } = useMemo(() => {
    const cd = [];
    const td = [];
    let totSaved = 0;
    let currentInvest = 0;
    const monthlyRate = (annualReturn / 100) / 12;

    for (let y = 1; y <= timeHorizon; y++) {
      const yearlyContrib = actualSavings * 12;
      totSaved += yearlyContrib;
      
      // Compound monthly for the year
      for (let m = 0; m < 12; m++) {
        currentInvest = (currentInvest + actualSavings) * (1 + monthlyRate);
      }
      
      const roundedSaved = Math.round(totSaved);
      const roundedInvest = Math.round(currentInvest);
      
      cd.push({
        year: y,
        justSaved: roundedSaved,
        withInvestment: roundedInvest,
      });

      td.push({
        year: y,
        saved: roundedSaved,
        withInvestment: roundedInvest,
        gains: roundedInvest - roundedSaved,
      });
    }

    return {
      chartData: cd,
      tableData: td,
      summary: {
        totalSaved: totSaved,
        withInvestment: currentInvest,
        gains: currentInvest - totSaved,
      }
    };
  }, [actualSavings, annualReturn, timeHorizon]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="sim-tooltip">
          <div className="sim-tooltip-title">Year {label}</div>
          <div className="sim-tooltip-row saved">Just Saved: {formatINR(payload[1]?.value || 0)}</div>
          <div className="sim-tooltip-row invest">With Investment: {formatINR(payload[0]?.value || 0)}</div>
        </div>
      );
    }
    return null;
  };

  return (
    <DashboardLayout>
      <div className="sim-page">
        <div className="sim-header sp-fade-in">
          <h1 className="sim-title">Financial Simulator</h1>
          <p className="sim-subtitle">Model your wealth growth over time with different assumptions</p>
        </div>

        <div className="sim-container sp-slide-up">
          {/* ASSUMPTIONS SIDEBAR */}
          <div className="sim-sidebar">
            <h3>Assumptions</h3>

            <div className="sim-input-group">
              <div className="sim-ig-top">
                <label>MONTHLY INCOME</label>
                <div className="sim-ig-input-wrap">
                  <span>₹</span>
                  <input type="number" className="sim-ig-num" value={income} onChange={e => setIncome(Number(e.target.value))} />
                </div>
              </div>
              <input 
                type="range" min="10000" max="1000000" step="5000"
                value={income} onChange={e => setIncome(Number(e.target.value))}
              />
            </div>

            <div className="sim-input-group">
              <div className="sim-ig-top">
                <label>MONTHLY EXPENSES</label>
                <div className="sim-ig-input-wrap">
                  <span>₹</span>
                  <input type="number" className="sim-ig-num" value={expenses} onChange={e => setExpenses(Number(e.target.value))} />
                </div>
              </div>
              <input 
                type="range" min="0" max="1000000" step="5000"
                value={expenses} onChange={e => setExpenses(Number(e.target.value))}
              />
            </div>

            <div className="sim-input-group">
              <div className="sim-ig-top">
                <label>EXPECTED ANNUAL RETURN</label>
                <div className="sim-ig-input-wrap">
                  <input type="number" className="sim-ig-num text-right" value={annualReturn} onChange={e => setAnnualReturn(Number(e.target.value))} />
                  <span className="suffix">%</span>
                </div>
              </div>
              <input 
                type="range" min="1" max="30" step="0.5"
                value={annualReturn} onChange={e => setAnnualReturn(Number(e.target.value))}
              />
            </div>

            <div className="sim-input-group">
              <div className="sim-ig-top">
                <label>TIME HORIZON</label>
                <div className="sim-ig-input-wrap">
                  <input type="number" className="sim-ig-num text-right" value={timeHorizon} onChange={e => setTimeHorizon(Number(e.target.value))} />
                  <span className="suffix">years</span>
                </div>
              </div>
              <input 
                type="range" min="1" max="40" step="1"
                value={timeHorizon} onChange={e => setTimeHorizon(Number(e.target.value))}
              />
            </div>

            <div className="sim-input-group sim-custom-box">
              <label>CUSTOM MONTHLY SAVINGS (OPTIONAL)</label>
              <input 
                type="number" 
                placeholder="Overrides Income - Expenses" 
                value={customSavings}
                onChange={e => setCustomSavings(e.target.value)}
              />
            </div>

            <div className="sim-summary">
              <label>MONTHLY SAVINGS</label>
              <div className="sim-summary-val">{formatINR(actualSavings)}</div>
              <button className="sim-btn-run" onClick={() => {
                // Currently auto-updating using useMemo, but we can animate/refresh here
                const el = document.querySelector('.sim-main');
                if (el) {
                  el.style.animation = 'none';
                  void el.offsetWidth; // trigger reflow
                  el.style.animation = null;
                }
              }}>Run Simulation</button>
            </div>
          </div>

          {/* MAIN RESULTS AREA */}
          <div className="sim-main">
            
            {/* STATS ROW */}
            <div className="sim-stats-row">
              <div className="sim-stat-box">
                <label>TOTAL SAVED</label>
                <div className="sim-stat-value text-gray">{formatINR(summary.totalSaved)}</div>
              </div>
              <div className="sim-stat-box">
                <label>WITH INVESTMENT</label>
                <div className="sim-stat-value text-purple">{formatINR(summary.withInvestment)}</div>
              </div>
              <div className="sim-stat-box">
                <label>INVESTMENT GAINS</label>
                <div className="sim-stat-value text-cyan">{formatINR(summary.gains)}</div>
              </div>
            </div>

            {/* CHART */}
            <div className="sim-chart-card">
              <h3>Wealth Projection</h3>
              <div className="sim-chart-wrapper">
                <ResponsiveContainer width="100%" height={280}>
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorInvest" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.25}/>
                        <stop offset="95%" stopColor="#7c3aed" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorSaved" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#059669" stopOpacity={0.15}/>
                        <stop offset="95%" stopColor="#059669" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f5" />
                    <XAxis 
                      dataKey="year" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#9ca3af', fontSize: 12 }} 
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#9ca3af', fontSize: 11 }} 
                      tickFormatter={val => {
                        if (val >= 100000) return '₹' + (val / 100000).toFixed(0) + 'L';
                        return '₹' + val;
                      }}
                      width={60}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="withInvestment" stroke="#7c3aed" strokeWidth={3} fillOpacity={1} fill="url(#colorInvest)" activeDot={{ r: 6, fill: '#7c3aed' }} />
                    <Area type="monotone" dataKey="justSaved" stroke="#10b981" strokeWidth={2} strokeDasharray="5 5" fillOpacity={1} fill="url(#colorSaved)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="sim-chart-legend">
                <span><span className="sim-legend-line green dashed"></span> Just Saved</span>
                <span><span className="sim-legend-line purple solid"></span> With Investment</span>
              </div>
            </div>

            {/* TABLE */}
            <div className="sim-table-card">
              <h3>Year by Year</h3>
              <div className="sim-table-wrapper">
                <table className="sim-table">
                  <thead>
                    <tr>
                      <th>YEAR</th>
                      <th>SAVED</th>
                      <th>WITH INVESTMENT</th>
                      <th>GAINS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tableData.map(row => (
                      <tr key={row.year}>
                        <td>{row.year}</td>
                        <td className="text-gray">{formatINR(row.saved)}</td>
                        <td className="text-purple">{formatINR(row.withInvestment)}</td>
                        <td className="text-cyan">{formatINR(row.gains)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
