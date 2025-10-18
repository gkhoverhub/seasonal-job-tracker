import React, { useState, useEffect } from 'react';
import { Plus, Trash2, CheckCircle, Circle, ExternalLink, Search } from 'lucide-react';

export default function JobTracker() {
  const [applications, setApplications] = useState(() => {
    // Load from localStorage on first render
    const saved = localStorage.getItem('jobApplications');
    return saved ? JSON.parse(saved) : [];
  });

  // Save to localStorage whenever applications change
  useEffect(() => {
    localStorage.setItem('jobApplications', JSON.stringify(applications));
  }, [applications]);
  const [searchQuery, setSearchQuery] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [company, setCompany] = useState('');
  const [jobUrl, setJobUrl] = useState('');
  const [applicationType, setApplicationType] = useState('online');
  const [status, setStatus] = useState('ready');
  const [notes, setNotes] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');

  const addApplication = () => {
    if (!jobTitle || !company) {
      alert('Please fill in job title and company');
      return;
    }

    const newApp = {
      id: Date.now(),
      jobTitle,
      company,
      jobUrl,
      applicationType,
      status,
      notes,
      dateApplied: new Date().toLocaleDateString(),
    };

    setApplications([newApp, ...applications]);
    resetForm();
  };

  const resetForm = () => {
    setJobTitle('');
    setCompany('');
    setJobUrl('');
    setApplicationType('online');
    setStatus('ready');
    setNotes('');
    setShowForm(false);
  };

  const deleteApplication = (id) => {
    const updatedApps = applications.filter(app => app.id !== id);
    setApplications(updatedApps);
    localStorage.setItem('jobApplications', JSON.stringify(updatedApps));
  };

  const updateStatus = (id, newStatus) => {
    setApplications(applications.map(app =>
      app.id === id ? { ...app, status: newStatus } : app
    ));
  };

  const filteredApps = applications.filter(app => {
    const matchesStatus = filterStatus === 'all' || app.status === filterStatus;
    const matchesSearch = searchQuery === '' ||
      app.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.company.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const stats = {
    total: applications.length,
    ready: applications.filter(a => a.status === 'ready').length,
    applied: applications.filter(a => a.status === 'applied').length,
    interview: applications.filter(a => a.status === 'interview').length,
    rejected: applications.filter(a => a.status === 'rejected').length,
    offered: applications.filter(a => a.status === 'offered').length,
  };

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '36px', fontWeight: 'bold', color: '#1f2937', marginBottom: '8px' }}>Application Tracker</h1>
          <p style={{ color: '#4b5563' }}>Track and manage all your job applications</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' }}>
          <StatCard label="Total Applications" value={stats.total} bgColor="#ffffff" />
          <StatCard label="Ready to Apply" value={stats.ready} bgColor="#fef3c7" />
          <StatCard label="Applied" value={stats.applied} bgColor="#dbeafe" />
          <StatCard label="Interviews" value={stats.interview} bgColor="#ffe4e6" />
          <StatCard label="Rejected" value={stats.rejected} bgColor="#fee2e2" />
          <StatCard label="Offered" value={stats.offered} bgColor="#dcfce7" />
        </div>

        <div style={{ background: 'white', borderRadius: '8px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', padding: '24px', marginBottom: '32px' }}>
          {!showForm ? (
            <button
              onClick={() => setShowForm(true)}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#4f46e5', color: 'white', padding: '12px 24px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '16px', fontWeight: '500' }}
            >
              <Plus size={20} />
              Add New Application
            </button>
          ) : (
            <div>
              <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937', marginBottom: '16px' }}>New Application</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px', marginBottom: '16px' }}>
                <input type="text" placeholder="Job Title" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} style={{ border: '1px solid #d1d5db', borderRadius: '8px', padding: '12px', fontSize: '16px', fontFamily: 'inherit' }} />
                <input type="text" placeholder="Company Name" value={company} onChange={(e) => setCompany(e.target.value)} style={{ border: '1px solid #d1d5db', borderRadius: '8px', padding: '12px', fontSize: '16px', fontFamily: 'inherit' }} />
              </div>
              <input type="url" placeholder="Job URL (optional)" value={jobUrl} onChange={(e) => setJobUrl(e.target.value)} style={{ width: '100%', border: '1px solid #d1d5db', borderRadius: '8px', padding: '12px', fontSize: '16px', fontFamily: 'inherit', marginBottom: '16px' }} />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>Application Type</label>
                  <select value={applicationType} onChange={(e) => setApplicationType(e.target.value)} style={{ width: '100%', border: '1px solid #d1d5db', borderRadius: '8px', padding: '12px', fontSize: '16px', fontFamily: 'inherit' }}>
                    <option value="online">Online Application</option>
                    <option value="inperson">In Person</option>
                    <option value="email">Email</option>
                    <option value="phone">Phone Call</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>Status</label>
                  <select value={status} onChange={(e) => setStatus(e.target.value)} style={{ width: '100%', border: '1px solid #d1d5db', borderRadius: '8px', padding: '12px', fontSize: '16px', fontFamily: 'inherit' }}>
                    <option value="ready">Ready to Apply</option>
                    <option value="applied">Applied</option>
                    <option value="interview">Interview Scheduled</option>
                    <option value="rejected">Rejected</option>
                    <option value="offered">Offered</option>
                  </select>
                </div>
              </div>
              <textarea placeholder="Notes (optional)" value={notes} onChange={(e) => setNotes(e.target.value)} rows="3" style={{ width: '100%', border: '1px solid #d1d5db', borderRadius: '8px', padding: '12px', fontSize: '16px', fontFamily: 'inherit', marginBottom: '16px' }} />
              <div style={{ display: 'flex', gap: '12px' }}>
                <button onClick={addApplication} style={{ background: '#16a34a', color: 'white', padding: '12px 24px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '16px', fontWeight: '500' }}>Save Application</button>
                <button onClick={resetForm} style={{ background: '#9ca3af', color: 'white', padding: '12px 24px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '16px', fontWeight: '500' }}>Cancel</button>
              </div>
            </div>
          )}
        </div>

        <div style={{ marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search style={{ position: 'absolute', left: '12px', top: '12px', color: '#9ca3af' }} size={20} />
            <input type="text" placeholder="Search by job title or company..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{ width: '100%', border: '1px solid #d1d5db', borderRadius: '8px', padding: '12px 12px 12px 40px', fontSize: '16px', fontFamily: 'inherit' }} />
          </div>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} style={{ border: '1px solid #d1d5db', borderRadius: '8px', padding: '12px', fontSize: '16px', fontFamily: 'inherit' }}>
            <option value="all">All Statuses</option>
            <option value="applied">Applied</option>
            <option value="interview">Interviews</option>
            <option value="rejected">Rejected</option>
            <option value="offered">Offered</option>
          </select>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filteredApps.length === 0 ? (
            <div style={{ background: 'white', borderRadius: '8px', padding: '32px', textAlign: 'center', color: '#9ca3af' }}>
              <p>No applications yet. Start by adding your first application!</p>
            </div>
          ) : (
            filteredApps.map(app => (
              <div key={app.id} style={{ background: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)', padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                      <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937' }}>{app.jobTitle}</h3>
                      <span style={{ fontSize: '14px', background: '#e5e7eb', color: '#374151', padding: '4px 12px', borderRadius: '9999px' }}>{app.applicationType}</span>
                    </div>
                    <p style={{ color: '#4b5563', marginBottom: '8px' }}>{app.company}</p>
                    <p style={{ fontSize: '14px', color: '#6b7280' }}>Applied: {app.dateApplied}</p>
                  </div>
                  <button onClick={() => deleteApplication(app.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }}>
                    <Trash2 size={20} />
                  </button>
                </div>

                {app.notes && (
                  <p style={{ color: '#374151', marginBottom: '12px', fontStyle: 'italic' }}>"{app.notes}"</p>
                )}

                {app.jobUrl && (
                  <a href={app.jobUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#4f46e5', textDecoration: 'none', marginBottom: '12px', fontSize: '14px' }}>
                    View Job Posting <ExternalLink size={14} />
                  </a>
                )}

                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {['ready', 'applied', 'interview', 'rejected', 'offered'].map(s => (
                    <button
                      key={s}
                      onClick={() => updateStatus(app.id, s)}
                      style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', background: app.status === s ? '#4f46e5' : '#e5e7eb', color: app.status === s ? 'white' : '#374151', fontSize: '14px', fontWeight: '500' }}
                    >
                      {app.status === s ? <CheckCircle size={16} /> : <Circle size={16} />}
                      {s === 'ready' ? 'Ready' : s.charAt(0).toUpperCase() + s.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, bgColor }) {
  return (
    <div style={{ background: bgColor, borderRadius: '8px', padding: '16px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
      <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937' }}>{value}</div>
      <div style={{ fontSize: '14px', color: '#6b7280' }}>{label}</div>
    </div>
  );
}