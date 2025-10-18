import React, { useState, useEffect } from 'react';
import { Save, RotateCcw, Plus, Trash2 } from 'lucide-react';
import AccessLog from './AccessLog';
import { AVAILABLE_SEARCH_SOURCES, DEFAULT_SEARCH_SOURCES } from './config';

export default function SearchConfig() {
  const [config, setConfig] = useState(() => {
    const saved = localStorage.getItem('jobSearchConfig');
    return saved ? JSON.parse(saved) : getDefaultConfig();
  });

  const [newCompany, setNewCompany] = useState('');
  const [newKeyword, setNewKeyword] = useState('');

  function getDefaultConfig() {
    return {
      location: 'Redding, CA',
      radius: 15,
      jobTypes: ['Seasonal', 'Temporary', 'Part-time'],
      keywords: ['seasonal', 'temporary', 'part-time', 'retail', 'warehouse', 'holiday'],
      excludeKeywords: ['hospitality', 'restaurant', 'hotel', 'food service'],
      companies: ['Amazon', 'Costco', "Lowe's", 'Home Depot', 'Dicks Sporting Goods'],
      searchSources: DEFAULT_SEARCH_SOURCES,
    };
  }

  const saveConfig = () => {
    localStorage.setItem('jobSearchConfig', JSON.stringify(config));
    alert('Search configuration saved!');
  };

  const resetConfig = () => {
    const defaultConfig = getDefaultConfig();
    setConfig(defaultConfig);
    localStorage.setItem('jobSearchConfig', JSON.stringify(defaultConfig));
    alert('Configuration reset to defaults!');
  };

  const addCompany = () => {
    if (newCompany.trim() && !config.companies.includes(newCompany.trim())) {
      setConfig(prev => ({
        ...prev,
        companies: [...prev.companies, newCompany.trim()]
      }));
      setNewCompany('');
    }
  };

  const removeCompany = (company) => {
    setConfig(prev => ({
      ...prev,
      companies: prev.companies.filter(c => c !== company)
    }));
  };

  const addKeyword = () => {
    if (newKeyword.trim() && !config.keywords.includes(newKeyword.trim())) {
      setConfig(prev => ({
        ...prev,
        keywords: [...prev.keywords, newKeyword.trim()]
      }));
      setNewKeyword('');
    }
  };

  const removeKeyword = (keyword) => {
    setConfig(prev => ({
      ...prev,
      keywords: prev.keywords.filter(k => k !== keyword)
    }));
  };

  const toggleJobType = (type) => {
    setConfig(prev => ({
      ...prev,
      jobTypes: prev.jobTypes.includes(type)
        ? prev.jobTypes.filter(t => t !== type)
        : [...prev.jobTypes, type]
    }));
  };

  const toggleSource = (source) => {
    setConfig(prev => ({
      ...prev,
      searchSources: prev.searchSources.includes(source)
        ? prev.searchSources.filter(s => s !== source)
        : [...prev.searchSources, source]
    }));
  };

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '36px', fontWeight: 'bold', color: '#1f2937', marginBottom: '8px' }}>Search Configuration</h1>
          <p style={{ color: '#4b5563' }}>Customize your job search parameters</p>
        </div>

        {/* Location Section */}
        <div style={{ background: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)', padding: '24px', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937', marginBottom: '16px' }}>Location</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>City, State</label>
              <input
                type="text"
                value={config.location}
                onChange={(e) => setConfig(prev => ({ ...prev, location: e.target.value }))}
                placeholder="e.g., Redding, CA"
                style={{ width: '100%', border: '1px solid #d1d5db', borderRadius: '8px', padding: '10px', fontSize: '16px', fontFamily: 'inherit' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>Search Radius (miles)</label>
              <input
                type="number"
                value={config.radius}
                onChange={(e) => setConfig(prev => ({ ...prev, radius: parseInt(e.target.value) }))}
                min="1"
                max="100"
                style={{ width: '100%', border: '1px solid #d1d5db', borderRadius: '8px', padding: '10px', fontSize: '16px', fontFamily: 'inherit' }}
              />
            </div>
          </div>
        </div>

        {/* Job Types Section */}
        <div style={{ background: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)', padding: '24px', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937', marginBottom: '16px' }}>Job Types to Include</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
            {['Seasonal', 'Temporary', 'Part-time', 'Full-time', 'Contract'].map(type => (
              <label key={type} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', border: '1px solid #d1d5db', borderRadius: '8px', cursor: 'pointer', background: config.jobTypes.includes(type) ? '#dbeafe' : 'white' }}>
                <input
                  type="checkbox"
                  checked={config.jobTypes.includes(type)}
                  onChange={() => toggleJobType(type)}
                  style={{ cursor: 'pointer' }}
                />
                <span style={{ fontWeight: '500', color: '#374151' }}>{type}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Search Keywords Section */}
        <div style={{ background: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)', padding: '24px', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937', marginBottom: '16px' }}>Keywords to Search For</h2>
          <div style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
              <input
                type="text"
                value={newKeyword}
                onChange={(e) => setNewKeyword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addKeyword()}
                placeholder="Add a keyword (e.g., 'warehouse')"
                style={{ flex: 1, border: '1px solid #d1d5db', borderRadius: '8px', padding: '10px', fontSize: '14px', fontFamily: 'inherit' }}
              />
              <button
                onClick={addKeyword}
                style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#4f46e5', color: 'white', padding: '10px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: '500' }}
              >
                <Plus size={18} />
                Add
              </button>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {config.keywords.map(keyword => (
                <div key={keyword} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#dbeafe', color: '#0369a1', padding: '6px 12px', borderRadius: '20px', fontSize: '14px' }}>
                  <span>{keyword}</span>
                  <button
                    onClick={() => removeKeyword(keyword)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#0369a1', padding: 0 }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Companies Section */}
        <div style={{ background: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)', padding: '24px', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937', marginBottom: '16px' }}>Companies to Search</h2>
          <div style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
              <input
                type="text"
                value={newCompany}
                onChange={(e) => setNewCompany(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addCompany()}
                placeholder="Add a company (e.g., 'Target')"
                style={{ flex: 1, border: '1px solid #d1d5db', borderRadius: '8px', padding: '10px', fontSize: '14px', fontFamily: 'inherit' }}
              />
              <button
                onClick={addCompany}
                style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#4f46e5', color: 'white', padding: '10px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: '500' }}
              >
                <Plus size={18} />
                Add
              </button>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {config.companies.map(company => (
                <div key={company} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#fef3c7', color: '#92400e', padding: '6px 12px', borderRadius: '20px', fontSize: '14px' }}>
                  <span>{company}</span>
                  <button
                    onClick={() => removeCompany(company)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#92400e', padding: 0 }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Search Sources Section */}
        <div style={{ background: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)', padding: '24px', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937', marginBottom: '16px' }}>Search Sources</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
            {AVAILABLE_SEARCH_SOURCES.map(source => (
              <label key={source} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', border: '1px solid #d1d5db', borderRadius: '8px', cursor: 'pointer', background: config.searchSources.includes(source) ? '#dcfce7' : 'white' }}>
                <input
                  type="checkbox"
                  checked={config.searchSources.includes(source)}
                  onChange={() => toggleSource(source)}
                  style={{ cursor: 'pointer' }}
                />
                <span style={{ fontWeight: '500', color: '#374151' }}>{source}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'space-between', marginBottom: '32px' }}>
          <button
            onClick={resetConfig}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#9ca3af', color: 'white', padding: '12px 24px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '16px', fontWeight: '500' }}
          >
            <RotateCcw size={20} />
            Reset to Defaults
          </button>
          <button
            onClick={saveConfig}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#16a34a', color: 'white', padding: '12px 24px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '16px', fontWeight: '500' }}
          >
            <Save size={20} />
            Save Configuration
          </button>
        </div>

        {/* Access Log Section */}
        <div style={{ background: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)', padding: '24px' }}>
          <AccessLog />
        </div>
      </div>
    </div>
  );
}