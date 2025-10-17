import React, { useState } from 'react';
import JobTracker from './JobTracker';
import JobScraper from './JobScraper';
import { Briefcase, Search } from 'lucide-react';

export default function App() {
  const [currentPage, setCurrentPage] = useState('tracker'); // 'tracker' or 'scraper'

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom right, rgb(240, 249, 255), rgb(224, 231, 255))' }}>
      {/* Navigation Bar */}
      <div style={{ background: 'white', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '70px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>Seasonal Job Tool</h1>
          
          <div style={{ display: 'flex', gap: '12px' }}>
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
              }}
            >
              <Briefcase size={20} />
              Application Tracker
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
              }}
            >
              <Search size={20} />
              Job Finder
            </button>
          </div>
        </div>
      </div>

      {/* Page Content */}
      <div>
        {currentPage === 'tracker' && <JobTracker />}
        {currentPage === 'scraper' && <JobScraper />}
      </div>
    </div>
  );
}