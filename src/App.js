import React, { useState, useEffect } from 'react';
import JobTracker from './JobTracker';
import JobScraper from './JobScraper';
import SearchConfig from './SearchConfig';
import { Briefcase, Search, LogOut, Lock, Settings } from 'lucide-react';

export default function App() {
  const [currentPage, setCurrentPage] = useState('tracker');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginAttempt, setLoginAttempt] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const isAuthenticated = sessionStorage.getItem('jobTrackerAuth');
    if (isAuthenticated) {
      setIsLoggedIn(true);
    }
  }, []);

  const CORRECT_PASSWORD = 'GarryMcDarby2024';

  const handleLogin = () => {
    if (loginAttempt === CORRECT_PASSWORD) {
      setIsLoggedIn(true);
      sessionStorage.setItem('jobTrackerAuth', 'true');
      setLoginAttempt('');
      setError('');
    } else {
      setError('Incorrect password. Try again.');
      setLoginAttempt('');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    sessionStorage.removeItem('jobTrackerAuth');
    setLoginAttempt('');
    setError('');
    setCurrentPage('tracker');
  };

  if (!isLoggedIn) {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom right, rgb(240, 249, 255), rgb(224, 231, 255))', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)', padding: '48px', maxWidth: '400px', width: '100%', textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
            <Lock size={48} style={{ color: '#4f46e5' }} />
          </div>
          
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#1f2937', marginBottom: '8px' }}>Seasonal Job Tracker</h1>
          <p style={{ color: '#6b7280', marginBottom: '32px' }}>Secure Login Required</p>

          <div style={{ marginBottom: '24px' }}>
            <input
              type="password"
              placeholder="Enter password"
              value={loginAttempt}
              onChange={(e) => setLoginAttempt(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
              style={{
                width: '100%',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                padding: '12px',
                fontSize: '16px',
                fontFamily: 'inherit',
                marginBottom: '12px',
              }}
            />
            {error && (
              <p style={{ color: '#dc2626', fontSize: '14px', margin: '8px 0 0 0' }}>{error}</p>
            )}
          </div>

          <button
            onClick={handleLogin}
            style={{
              width: '100%',
              background: '#4f46e5',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '500',
              marginBottom: '16px',
            }}
          >
            Login
          </button>

          <p style={{ color: '#9ca3af', fontSize: '14px' }}>
            Password: Change this to something secure in the code
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom right, rgb(240, 249, 255), rgb(224, 231, 255))' }}>
      <div style={{ background: 'white', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '70px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>Seasonal Job Tool</h1>
          
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <button
              onClick={() => setCurrentPage('tracker')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 20px',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: '500',
                background: currentPage === 'tracker' ? '#4f46e5' : '#e5e7eb',
                color: currentPage === 'tracker' ? 'white' : '#374151',
                transition: 'all 0.3s ease',
                whiteSpace: 'nowrap',
              }}
            >
              <Briefcase size={20} />
              Tracker
            </button>
            
            <button
              onClick={() => setCurrentPage('scraper')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 20px',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: '500',
                background: currentPage === 'scraper' ? '#4f46e5' : '#e5e7eb',
                color: currentPage === 'scraper' ? 'white' : '#374151',
                transition: 'all 0.3s ease',
                whiteSpace: 'nowrap',
              }}
            >
              <Search size={20} />
              Job Finder
            </button>

            <button
              onClick={() => setCurrentPage('config')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 20px',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: '500',
                background: currentPage === 'config' ? '#4f46e5' : '#e5e7eb',
                color: currentPage === 'config' ? 'white' : '#374151',
                transition: 'all 0.3s ease',
                whiteSpace: 'nowrap',
              }}
            >
              <Settings size={20} />
              Settings
            </button>

            <button
              onClick={handleLogout}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 20px',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: '500',
                background: '#ef4444',
                color: 'white',
                whiteSpace: 'nowrap',
              }}
            >
              <LogOut size={20} />
              Logout
            </button>
          </div>
        </div>
      </div>

      <div>
        {currentPage === 'tracker' && <JobTracker />}
        {currentPage === 'scraper' && <JobScraper />}
        {currentPage === 'config' && <SearchConfig />}
      </div>
    </div>
  );
}