import React, { useState, useEffect } from 'react';
import { Trash2, RefreshCw, AlertCircle } from 'lucide-react';
import { CLEAR_LOGS_PASSWORD } from './config';

export default function AccessLog() {
  const [logs, setLogs] = useState(() => {
    const saved = localStorage.getItem('accessLogs');
    return saved ? JSON.parse(saved) : [];
  });

  const [userLocation, setUserLocation] = useState('Fetching...');
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [clearCode, setClearCode] = useState('');

  useEffect(() => {
    // Get user's approximate location from their IP
    const getLocation = async () => {
      try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        const location = `${data.city}, ${data.region}, ${data.country_name}`;
        setUserLocation(location);
        
        // Also add to current session if this is first load
        if (logs.length === 0 || logs[0].location === 'Fetching...') {
          logAccessWithLocation(location);
        }
      } catch (err) {
        setUserLocation('Location unavailable');
        logAccessWithLocation('Location unavailable');
      }
    };
    getLocation();
  }, []);

  const logAccessWithLocation = (location) => {
    const newLog = {
      id: Date.now(),
      timestamp: new Date().toLocaleString(),
      location: location,
      userAgent: navigator.userAgent.substring(0, 50),
    };

    const existingLogs = JSON.parse(localStorage.getItem('accessLogs')) || [];
    const updatedLogs = [newLog, ...existingLogs].slice(0, 100);
    setLogs(updatedLogs);
    localStorage.setItem('accessLogs', JSON.stringify(updatedLogs));
  };

  const handleClearAttempt = () => {
    if (clearCode === CLEAR_LOGS_PASSWORD) {
      setLogs([]);
      localStorage.removeItem('accessLogs');
      setShowClearConfirm(false);
      setClearCode('');
      alert('Access logs cleared successfully.');
    } else {
      alert('Incorrect password. Logs not cleared.');
      setClearCode('');
    }
  };

  return (
    <div>
      <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937', marginBottom: '16px' }}>Access Log</h2>
      
      <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px', padding: '16px', marginBottom: '24px' }}>
        <p style={{ color: '#1e40af', fontSize: '14px', margin: 0 }}>
          <strong>Current Location:</strong> {userLocation}
        </p>
        <p style={{ color: '#1e40af', fontSize: '14px', margin: '8px 0 0 0' }}>
          Total logins: <strong>{logs.length}</strong>
        </p>
      </div>

      {logs.length === 0 ? (
        <p style={{ color: '#6b7280', textAlign: 'center', padding: '32px' }}>No access logs yet</p>
      ) : (
        <div style={{ overflowX: 'auto', marginBottom: '16px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white', borderRadius: '8px', overflow: 'hidden' }}>
            <thead>
              <tr style={{ background: '#f3f4f6', borderBottom: '1px solid #e5e7eb' }}>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#374151', fontSize: '14px' }}>Date & Time</th>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#374151', fontSize: '14px' }}>Location</th>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#374151', fontSize: '14px' }}>Device</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log, index) => (
                <tr key={log.id} style={{ borderBottom: index < logs.length - 1 ? '1px solid #e5e7eb' : 'none' }}>
                  <td style={{ padding: '12px', fontSize: '14px', color: '#1f2937' }}>{log.timestamp}</td>
                  <td style={{ padding: '12px', fontSize: '14px', color: '#1f2937' }}>{log.location}</td>
                  <td style={{ padding: '12px', fontSize: '12px', color: '#6b7280' }}>{log.userAgent}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!showClearConfirm ? (
        <button
          onClick={() => setShowClearConfirm(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: '#ef4444',
            color: 'white',
            padding: '10px 16px',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500',
          }}
        >
          <Trash2 size={18} />
          Clear All Logs
        </button>
      ) : (
        <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '16px' }}>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', marginBottom: '16px' }}>
            <AlertCircle size={20} style={{ color: '#dc2626', flexShrink: 0, marginTop: '2px' }} />
            <div>
              <p style={{ color: '#991b1b', fontWeight: 'bold', margin: '0 0 8px 0' }}>Confirm Log Deletion</p>
              <p style={{ color: '#7f1d1d', fontSize: '14px', margin: 0 }}>
                Enter the password to clear all access logs. This action cannot be undone.
              </p>
              <p style={{ color: '#7f1d1d', fontSize: '12px', margin: '8px 0 0 0', fontStyle: 'italic' }}>
                Password is in src/config.js (CLEAR_LOGS_PASSWORD)
              </p>
            </div>
          </div>

          <input
            type="text"
            placeholder="Enter confirmation code"
            value={clearCode}
            onChange={(e) => setClearCode(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleClearAttempt()}
            style={{
              width: '100%',
              border: '1px solid #fecaca',
              borderRadius: '8px',
              padding: '10px',
              fontSize: '14px',
              fontFamily: 'inherit',
              marginBottom: '12px',
            }}
          />

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={handleClearAttempt}
              style={{
                background: '#dc2626',
                color: 'white',
                padding: '8px 16px',
                borderRadius: '6px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
              }}
            >
              Confirm Delete
            </button>
            <button
              onClick={() => {
                setShowClearConfirm(false);
                setClearCode('');
              }}
              style={{
                background: '#9ca3af',
                color: 'white',
                padding: '8px 16px',
                borderRadius: '6px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}