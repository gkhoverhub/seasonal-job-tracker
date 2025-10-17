import React, { useState } from 'react';
import { Search, Send, AlertCircle, CheckCircle, ExternalLink, Loader } from 'lucide-react';

export default function JobScraper() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [applicationStatus, setApplicationStatus] = useState({});

  const userProfile = {
    fullName: process.env.REACT_APP_USER_NAME || 'User',
    phone: process.env.REACT_APP_USER_PHONE || '',
    email: process.env.REACT_APP_USER_EMAIL || '',
    experience: process.env.REACT_APP_USER_EXPERIENCE || '',
    skills: process.env.REACT_APP_USER_SKILLS || '',
    availability: process.env.REACT_APP_USER_AVAILABILITY || '',
    motivation: process.env.REACT_APP_USER_MOTIVATION || '',
    certifications: process.env.REACT_APP_USER_CERTIFICATIONS || '',
  };

  const searchJobs = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/scrapeJobs');
      const data = await response.json();

      if (data.success) {
        setJobs(data.jobs);
      } else {
        setError('Failed to fetch jobs. Please try again.');
      }
    } catch (err) {
      setError(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const getMissingFields = () => {
    const missing = [];
    if (!userProfile.fullName || userProfile.fullName === 'User') missing.push('Full Name');
    if (!userProfile.email) missing.push('Email');
    if (!userProfile.phone) missing.push('Phone');
    return missing;
  };

  const handleApplyJob = (job) => {
    const missing = getMissingFields();
    if (missing.length > 0) {
      alert(`Missing required fields:\n\n${missing.join('\n')}\n\nPlease set environment variables in Vercel.`);
      return;
    }

    const newApplication = {
      id: Date.now(),
      jobTitle: job.title,
      company: job.company,
      jobUrl: job.url,
      applicationType: 'online',
      status: 'applied',
      notes: `Found on ${job.source} - ${job.type}`,
      dateApplied: new Date().toLocaleDateString(),
    };

    const existingApps = JSON.parse(localStorage.getItem('jobApplications')) || [];
    existingApps.push(newApplication);
    localStorage.setItem('jobApplications', JSON.stringify(existingApps));

    setApplicationStatus(prev => ({
      ...prev,
      [job.id]: 'submitted'
    }));

    window.open(job.url, '_blank');

    setTimeout(() => {
      alert(`✓ Added to Application Tracker!\n\nJob opening in new tab. Fill out their application form.\n\nWe've logged it as "Applied" in your tracker.`);
    }, 500);
  };

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '36px', fontWeight: 'bold', color: '#1f2937', marginBottom: '8px' }}>Job Finder & Auto-Apply</h1>
          <p style={{ color: '#4b5563' }}>Find seasonal jobs and automatically apply with your profile</p>
        </div>

        <div style={{ background: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)', padding: '20px', marginBottom: '24px', border: '2px solid #dbeafe' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1f2937', marginBottom: '12px' }}>Your Profile</h2>
          {userProfile.fullName === 'User' ? (
            <div style={{ color: '#dc2626', display: 'flex', gap: '8px', alignItems: 'center' }}>
              <AlertCircle size={20} />
              <span>Environment variables not set. Please configure in Vercel Settings.</span>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '12px' }}>
              <div><strong>Name:</strong> {userProfile.fullName}</div>
              <div><strong>Email:</strong> {userProfile.email}</div>
              <div><strong>Phone:</strong> {userProfile.phone}</div>
              <div><strong>Experience:</strong> {userProfile.experience}</div>
            </div>
          )}
        </div>

        {error && (
          <div style={{ background: '#fee2e2', border: '1px solid #fecaca', borderRadius: '8px', padding: '16px', marginBottom: '24px', display: 'flex', gap: '12px', alignItems: 'center' }}>
            <AlertCircle size={24} style={{ color: '#dc2626', flexShrink: 0 }} />
            <p style={{ color: '#7f1d1d', margin: 0 }}>{error}</p>
          </div>
        )}

        <div style={{ marginBottom: '32px' }}>
          <button
            onClick={searchJobs}
            disabled={loading}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: loading ? '#9ca3af' : '#4f46e5',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '8px',
              border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '16px',
              fontWeight: '500',
            }}
          >
            {loading ? <Loader size={20} /> : <Search size={20} />}
            {loading ? 'Searching...' : 'Search for Seasonal Jobs'}
          </button>
        </div>

        {jobs.length > 0 && (
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937', marginBottom: '16px' }}>
              Found {jobs.length} Jobs
            </h2>
            <div style={{ display: 'grid', gap: '16px' }}>
              {jobs.map(job => {
                const missing = getMissingFields();
                const isApplied = applicationStatus[job.id] === 'submitted';

                return (
                  <div
                    key={job.id}
                    style={{
                      background: 'white',
                      borderRadius: '8px',
                      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                      padding: '20px',
                      border: isApplied ? '2px solid #16a34a' : '1px solid #e5e7eb',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                      <div style={{ flex: 1 }}>
                        <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937', marginBottom: '4px' }}>
                          {job.title}
                        </h3>
                        <p style={{ color: '#4b5563', marginBottom: '4px' }}>
                          <strong>{job.company}</strong> • {job.location}
                        </p>
                        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '8px' }}>
                          <span style={{ background: '#dbeafe', color: '#0369a1', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: '500' }}>
                            {job.type}
                          </span>
                          <span style={{ background: '#fef3c7', color: '#92400e', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: '500' }}>
                            {job.salary}
                          </span>
                          <span style={{ background: '#e5e7eb', color: '#374151', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: '500' }}>
                            {job.source}
                          </span>
                        </div>
                        <p style={{ color: '#6b7280', fontSize: '14px' }}>{job.description}</p>
                      </div>
                      {isApplied && (
                        <div style={{ marginLeft: '16px', display: 'flex', alignItems: 'center', gap: '8px', color: '#16a34a' }}>
                          <CheckCircle size={24} />
                          <span style={{ fontWeight: 'bold' }}>Applied</span>
                        </div>
                      )}
                    </div>

                    {missing.length > 0 && (
                      <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '6px', padding: '12px', marginBottom: '12px', display: 'flex', gap: '8px' }}>
                        <AlertCircle size={20} style={{ color: '#dc2626', flexShrink: 0 }} />
                        <div>
                          <strong style={{ color: '#dc2626' }}>Missing Information:</strong>
                          <p style={{ color: '#7f1d1d', fontSize: '14px', margin: '4px 0 0 0' }}>{missing.join(', ')}</p>
                        </div>
                      </div>
                    )}

                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'space-between' }}>
                      <a
                        href={job.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          color: '#4f46e5',
                          textDecoration: 'none',
                          fontSize: '14px',
                          fontWeight: '500',
                        }}
                      >
                        View Job <ExternalLink size={16} />
                      </a>
                      <button
                        onClick={() => handleApplyJob(job)}
                        disabled={isApplied || missing.length > 0}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          background: isApplied ? '#16a34a' : missing.length > 0 ? '#d1d5db' : '#4f46e5',
                          color: 'white',
                          padding: '8px 16px',
                          borderRadius: '6px',
                          border: 'none',
                          cursor: isApplied || missing.length > 0 ? 'not-allowed' : 'pointer',
                          fontSize: '14px',
                          fontWeight: '500',
                        }}
                      >
                        <Send size={16} />
                        {isApplied ? 'Applied' : 'Auto-Apply'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {!loading && jobs.length === 0 && (
          <div style={{ background: 'white', borderRadius: '8px', padding: '48px', textAlign: 'center', color: '#9ca3af' }}>
            <Search size={48} style={{ margin: '0 auto 16px', opacity: 0.5 }} />
            <p style={{ fontSize: '18px' }}>Click "Search for Seasonal Jobs" to find opportunities</p>
          </div>
        )}
      </div>
    </div>
  );
}