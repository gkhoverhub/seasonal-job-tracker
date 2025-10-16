import React, { useState } from 'react';
import { Plus, Trash2, CheckCircle, Circle, ExternalLink, Search } from 'lucide-react';
import './App.css';

export default function JobTracker() {
  const [applications, setApplications] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [company, setCompany] = useState('');
  const [jobUrl, setJobUrl] = useState('');
  const [applicationType, setApplicationType] = useState('online');
  const [status, setStatus] = useState('applied');
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
    setStatus('applied');
    setNotes('');
    setShowForm(false);
  };

  const deleteApplication = (id) => {
    setApplications(applications.filter(app => app.id !== id));
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
    applied: applications.filter(a => a.status === 'applied').length,
    interview: applications.filter(a => a.status === 'interview').length,
    rejected: applications.filter(a => a.status === 'rejected').length,
    offered: applications.filter(a => a.status === 'offered').length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Seasonal Job Tracker</h1>
          <p className="text-gray-600">Find and track seasonal positions in your area</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-lg p-4 shadow">
            <div className="text-2xl font-bold text-gray-800">{stats.total}</div>
            <div className="text-sm text-gray-600">Total Applications</div>
          </div>
          <div className="bg-blue-100 rounded-lg p-4 shadow">
            <div className="text-2xl font-bold text-blue-600">{stats.applied}</div>
            <div className="text-sm text-blue-700">Applied</div>
          </div>
          <div className="bg-yellow-100 rounded-lg p-4 shadow">
            <div className="text-2xl font-bold text-yellow-600">{stats.interview}</div>
            <div className="text-sm text-yellow-700">Interviews</div>
          </div>
          <div className="bg-red-100 rounded-lg p-4 shadow">
            <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
            <div className="text-sm text-red-700">Rejected</div>
          </div>
          <div className="bg-green-100 rounded-lg p-4 shadow">
            <div className="text-2xl font-bold text-green-600">{stats.offered}</div>
            <div className="text-sm text-green-700">Offered</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          {!showForm ? (
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition"
            >
              <Plus size={20} />
              Add New Application
            </button>
          ) : (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">New Application</h2>
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <input
                  type="text"
                  placeholder="Job Title"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <input
                  type="text"
                  placeholder="Company Name"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <input
                  type="url"
                  placeholder="Job URL (optional)"
                  value={jobUrl}
                  onChange={(e) => setJobUrl(e.target.value)}
                  className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 md:col-span-2"
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <select
                  value={applicationType}
                  onChange={(e) => setApplicationType(e.target.value)}
                  className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="online">Online Application</option>
                  <option value="inperson">In Person</option>
                  <option value="email">Email</option>
                  <option value="phone">Phone Call</option>
                </select>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="applied">Applied</option>
                  <option value="interview">Interview Scheduled</option>
                  <option value="rejected">Rejected</option>
                  <option value="offered">Offered</option>
                </select>
              </div>
              <textarea
                placeholder="Notes (optional)"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-4"
                rows="3"
              />
              <div className="flex gap-3">
                <button
                  onClick={addApplication}
                  className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
                >
                  Save Application
                </button>
                <button
                  onClick={resetForm}
                  className="bg-gray-400 text-white px-6 py-3 rounded-lg hover:bg-gray-500 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="mb-6 flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by job title or company..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 pl-10 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Statuses</option>
            <option value="applied">Applied</option>
            <option value="interview">Interviews</option>
            <option value="rejected">Rejected</option>
            <option value="offered">Offered</option>
          </select>
        </div>

        <div className="space-y-4">
          {filteredApps.length === 0 ? (
            <div className="bg-white rounded-lg p-8 text-center text-gray-500">
              <p>No applications yet. Start by adding your first application!</p>
            </div>
          ) : (
            filteredApps.map(app => (
              <div key={app.id} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-xl font-bold text-gray-800">{app.jobTitle}</h3>
                      <span className="text-sm bg-gray-200 text-gray-700 px-3 py-1 rounded-full">
                        {app.applicationType}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-2">{app.company}</p>
                    <p className="text-sm text-gray-500">Applied: {app.dateApplied}</p>
                  </div>
                  <button
                    onClick={() => deleteApplication(app.id)}
                    className="text-red-500 hover:text-red-700 transition"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>

                {app.notes && (
                  <p className="text-gray-700 mb-3 italic">"{app.notes}"</p>
                )}

                {app.jobUrl && (
                  
                    href={app.jobUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 mb-3 text-sm"
                  >
                    View Job Posting <ExternalLink size={14} />
                  </a>
                )}

                <div className="flex gap-2 flex-wrap">
                  {['applied', 'interview', 'rejected', 'offered'].map(s => (
                    <button
                      key={s}
                      onClick={() => updateStatus(app.id, s)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                        app.status === s
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {app.status === s ? <CheckCircle size={16} /> : <Circle size={16} />}
                      {s.charAt(0).toUpperCase() + s.slice(1)}
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