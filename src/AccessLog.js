import React, { useState, useEffect } from 'react';
import { Trash2, RefreshCw } from 'lucide-react';

export default function AccessLog() {
  const [logs, setLogs] = useState(() => {
    const saved = localStorage.getItem('accessLogs');
    return saved ? JSON.parse(saved) : [];
  });

  const [userLocation, setUserLocation] = useState('Fetching...');

  useEffect(() => {
    // Get user's approximate location from their IP
    const getLocation = async () => {
      try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        setUserLocation(`${data.city}, ${data.region}, ${data.country_name}`);
      } catch (err) {
        setUserLocation('Location unavailable');
      }
    };
    getLocation();
  }, []);

  const logAccess = () => {
    const newLog = {
      id: Date.now(),
      timestamp: new Date().toLocaleString(),
      location: userLocation,
      userAgent: navigator.userAgent.substring(0, 50),
    };

    const updatedLogs = [newLog, ...logs].slice(0, 100); // Keep last 100 logs
    setLogs(updatedLogs);
    localStorage.setItem('accessLogs', JSON.stringify(updatedLogs));
  };

  const clearLogs = () => {
    if (window.confirm('Are you sure you want to clear all access logs? This cannot be undone.')) {
      setLogs([]);
      localStorage.removeItem('accessLogs');
    }
  };

  useEffect(() => {
    // Log access when component mounts
    logAccess();
  }, []);

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

      <button
        onClick={clearLogs}
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
    </div>
  );
}