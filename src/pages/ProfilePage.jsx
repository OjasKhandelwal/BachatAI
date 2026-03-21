import React from 'react';
import { Link } from 'react-router-dom';
import { BrainCircuit, BookOpen, Target, ShieldCheck, Activity } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import './ProfilePage.css';

const data = [
  { name: 'Week 1', score: 65, target: 70 },
  { name: 'Week 2', score: 68, target: 75 },
  { name: 'Week 3', score: 72, target: 80 },
  { name: 'Week 4', score: 79, target: 85 },
  { name: 'Week 5', score: 85, target: 90 },
];

const ProfilePage = () => {
  return (
    <div className="profile-container">
      {/* Header */}
      <header className="profile-header">
        <Link to="/" className="profile-logo">
          <div className="logo-icon-dark"></div>
          <strong>BachatAI</strong>
        </Link>
        <div className="profile-title">
          <h1>User Profiling Form</h1>
          <div className="breadcrumbs">
            <span className="active">1. Profile</span> &gt; <span>2. Math Level</span> &gt; <span>3. Goals</span> &gt; <span>4. Summary</span>
          </div>
        </div>
        <div className="spacer"></div>
      </header>

      {/* Main Content */}
      <div className="profile-content">
        {/* Left Form */}
        <div className="form-section">
          <h2>Let's get to know you.</h2>
          
          <div className="form-group">
            <label>Full Name</label>
            <input type="text" placeholder="e.g., Alex Chen" defaultValue="Alex Chen" />
          </div>
          
          <div className="form-group">
            <label>Age</label>
            <input type="text" placeholder="e.g., 18" defaultValue="18" />
          </div>
          
          <div className="form-group">
            <label>Current Math Level</label>
            <input type="text" placeholder="e.g., High School Senior" defaultValue="High School Senior" />
          </div>

          <h3 className="section-title">Areas of Focus</h3>
          
          <div className="focus-list">
            <div className="focus-item">
              <div className="focus-icon"><BrainCircuit size={20} color="#4b5563"/></div>
              <div className="focus-input-group">
                <label>Algebra & Equations</label>
                <input type="text" placeholder="Current score" defaultValue="B+" />
              </div>
            </div>
            
            <div className="focus-item">
              <div className="focus-icon"><BookOpen size={20} color="#4b5563"/></div>
              <div className="focus-input-group">
                <label>Geometry</label>
                <input type="text" placeholder="Current score" defaultValue="A-" />
              </div>
            </div>
            
            <div className="focus-item">
              <div className="focus-icon"><Activity size={20} color="#4b5563"/></div>
              <div className="focus-input-group">
                <label>Calculus</label>
                <input type="text" placeholder="Current score" defaultValue="C" />
              </div>
            </div>
          </div>

          <h3 className="section-title">Future Goal</h3>
          
          <div className="form-group">
            <label>What are you preparing for?</label>
            <input type="text" placeholder="e.g., College Entrance Exam" defaultValue="College Entrance Exam" />
          </div>
          
          <div className="form-group">
            <label>Target Math Percentile</label>
            <input type="text" placeholder="e.g., 95th Percentile" defaultValue="95th Percentile" />
          </div>
          
          <div className="ai-calculating">
            <div className="ai-icon"><BrainCircuit size={24} color="#fff" /></div>
            <span>BachatAI is calculating your customized learning path...</span>
          </div>

          <button className="btn-next">Next</button>
        </div>

        {/* Right Snapshot */}
        <div className="snapshot-section">
          <div className="snapshot-card">
            <h3>Your Math Snapshot</h3>
            
            <div className="snapshot-data">
              <div className="data-row">
                <span>Name:</span>
                <strong>Alex Chen</strong>
              </div>
              <div className="data-row">
                <span>Current Level:</span>
                <strong>High School Sr.</strong>
              </div>
              <div className="data-row">
                <span>Study Hours/Week:</span>
                <strong>12 hrs</strong>
              </div>
              <div className="data-row highlight">
                <span>Predicted Score jump:</span>
                <strong className="positive-text">+15%</strong>
              </div>
            </div>

            <div className="snapshot-goal">
              <div className="goal-header">
                <span>College Entrance Exam (95th Pct)</span>
              </div>
              <div className="goal-bar">
                <div className="goal-fill" style={{width: '65%'}}></div>
              </div>
            </div>

            <div className="chart-container">
              <div className="chart-legend">
                <span className="legend-item"><span className="dot blue"></span> Current</span>
                <span className="legend-item"><span className="dot purple"></span> Target Path</span>
              </div>
              <ResponsiveContainer width="100%" height={150}>
                <LineChart data={data} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis dataKey="name" tick={{fontSize: 10, fill: '#6b7280'}} axisLine={false} tickLine={false} />
                  <YAxis tick={{fontSize: 10, fill: '#6b7280'}} axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Line type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={2} dot={{r: 3}} activeDot={{r: 5}} />
                  <Line type="monotone" dataKey="target" stroke="#8b5cf6" strokeWidth={2} dot={{r: 3}} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
