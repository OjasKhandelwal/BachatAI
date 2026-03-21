import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './PageTransition.css';

const PageTransition = ({ children }) => {
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setLoading(true);
    setProgress(0);

    // Fast progress to 80%, then wait, then complete
    const t1 = setTimeout(() => setProgress(40), 60);
    const t2 = setTimeout(() => setProgress(75), 150);
    const t3 = setTimeout(() => setProgress(95), 280);
    const t4 = setTimeout(() => {
      setProgress(100);
    }, 380);
    const t5 = setTimeout(() => {
      setLoading(false);
      setProgress(0);
    }, 550);

    return () => [t1, t2, t3, t4, t5].forEach(clearTimeout);
  }, [location.pathname]);

  return (
    <>
      {loading && (
        <div className="page-loader-bar">
          <div
            className="page-loader-fill"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
      <div className={`page-content ${loading ? 'page-fade-in' : ''}`}>
        {children}
      </div>
    </>
  );
};

export default PageTransition;
