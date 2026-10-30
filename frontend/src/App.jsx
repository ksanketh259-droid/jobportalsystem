import React, { useState, useEffect, useCallback } from 'react';
import { 
  Search, MapPin, Filter, Briefcase, Sparkles, Building, Bookmark, 
  ArrowRight, CheckCircle, RefreshCw, X 
} from 'lucide-react';

import { api, getStoredUser, setStoredUser, setAuthToken } from './api';
import Navbar from './components/Navbar';
import JobCard from './components/JobCard';
import JobDetailsModal from './components/JobDetailsModal';
import ApplicationModal from './components/ApplicationModal';
import ApplicationsView from './components/ApplicationsView';
import EmployerDashboard from './components/EmployerDashboard';
import AdminDashboard from './components/AdminDashboard';
import PostJobModal from './components/PostJobModal';
import ProfileModal from './components/ProfileModal';
import AuthModal from './components/AuthModal';
import Toast from './components/Toast';

export default function App() {
  const [user, setUser] = useState(getStoredUser());
  const [activeTab, setActiveTab] = useState('jobs'); // 'jobs' | 'applications' | 'saved' | 'employer' | 'admin'

  // Jobs state
  const [jobs, setJobs] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(false);

  // Search & Filter state
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedJobType, setSelectedJobType] = useState('ALL');
  const [selectedExpLevel, setSelectedExpLevel] = useState('ALL');

  // Applications state
  const [myApplications, setMyApplications] = useState([]);
  const [loadingApplications, setLoadingApplications] = useState(false);

  // Modals
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isPostJobOpen, setIsPostJobOpen] = useState(false);
  const [jobToEdit, setJobToEdit] = useState(null);
  const [selectedJobDetails, setSelectedJobDetails] = useState(null);
  const [jobDetailsInfo, setJobDetailsInfo] = useState(null);
  const [jobToApply, setJobToApply] = useState(null);

  // Notifications
  const [toasts, setToasts] = useState([]);

  const addToast = (type, message) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Fetch jobs
  const fetchJobs = useCallback(async () => {
    setLoadingJobs(true);
    try {
      const data = await api.getJobs({
        keyword,
        location,
        category: selectedCategory,
        jobType: selectedJobType,
        experienceLevel: selectedExpLevel
      });
      setJobs(data);
    } catch (err) {
      addToast('error', err.message || 'Failed to fetch job listings');
    } finally {
      setLoadingJobs(false);
    }
  }, [keyword, location, selectedCategory, selectedJobType, selectedExpLevel]);

  // Fetch saved jobs for current user
  const fetchSavedJobs = useCallback(async () => {
    if (!user || user.role !== 'JOB_SEEKER') return;
    try {
      const data = await api.getSavedJobs();
      setSavedJobs(data);
    } catch (err) {
      console.error(err);
    }
  }, [user]);

  // Fetch applications for candidate
  const fetchMyApplications = useCallback(async () => {
    if (!user) return;
    setLoadingApplications(true);
    try {
      const data = await api.getMyApplications();
      setMyApplications(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingApplications(false);
    }
  }, [user]);

  // Fetch categories
  useEffect(() => {
    api.getCategories()
      .then((cats) => setCategories(cats || []))
      .catch((err) => console.error(err));
  }, []);

  // Initial load & search triggers
  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  useEffect(() => {
    if (user) {
      fetchSavedJobs();
      if (activeTab === 'applications') {
        fetchMyApplications();
      }
    }
  }, [user, activeTab, fetchSavedJobs, fetchMyApplications]);

  // Auth Handlers
  const handleLogin = async (credentials) => {
    const res = await api.login(credentials);
    setAuthToken(res.token);
    setStoredUser(res.user);
    setUser(res.user);
    addToast('success', `Welcome back, ${res.user.fullName}!`);
  };

  const handleRegister = async (userData) => {
    const res = await api.register(userData);
    setAuthToken(res.token);
    setStoredUser(res.user);
    setUser(res.user);
    addToast('success', `Account created successfully! Welcome, ${res.user.fullName}.`);
  };

  const handleQuickLogin = async (email, password) => {
    try {
      const res = await api.login({ email, password });
      setAuthToken(res.token);
      setStoredUser(res.user);
      setUser(res.user);
      addToast('success', `Switched active user to: ${res.user.fullName} (${res.user.role})`);
      if (res.user.role === 'EMPLOYER') {
        setActiveTab('employer');
      } else if (res.user.role === 'ADMIN') {
        setActiveTab('admin');
      } else {
        setActiveTab('jobs');
      }
    } catch (err) {
      addToast('error', err.message || 'Login failed');
    }
  };

  const handleLogout = () => {
    setAuthToken(null);
    setStoredUser(null);
    setUser(null);
    setActiveTab('jobs');
    addToast('info', 'You have been signed out.');
  };

  const handleProfileUpdated = (updatedUser) => {
    setStoredUser(updatedUser);
    setUser(updatedUser);
    addToast('success', 'Profile updated successfully!');
  };

  // Job Details
  const handleViewJobDetails = async (job) => {
    setSelectedJobDetails(job);
    try {
      const details = await api.getJob(job.id);
      setJobDetailsInfo(details);
    } catch (err) {
      setJobDetailsInfo({ hasApplied: false, isSaved: false });
    }
  };

  // Bookmark Toggle
  const handleToggleSaveJob = async (jobId) => {
    if (!user) {
      setIsAuthOpen(true);
      return;
    }
    try {
      const res = await api.toggleSaveJob(jobId);
      addToast('success', res.message);
      fetchSavedJobs();
      if (jobDetailsInfo) {
        setJobDetailsInfo((prev) => ({ ...prev, isSaved: res.saved }));
      }
    } catch (err) {
      addToast('error', err.message);
    }
  };

  // Apply Click
  const handleApplyNow = (job) => {
    if (!user) {
      setIsAuthOpen(true);
      return;
    }
    setSelectedJobDetails(null);
    setJobToApply(job);
  };

  const handleApplicationSuccess = (msg) => {
    addToast('success', msg);
    fetchMyApplications();
  };

  const isJobSaved = (jobId) => {
    return savedJobs.some((j) => j.id === jobId);
  };

  return (
    <div className="app-container">
      <div className="bg-mesh" />

      {/* Global Navbar */}
      <Navbar
        user={user}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAuth={() => setIsAuthOpen(true)}
        onLogout={handleLogout}
        onQuickLogin={handleQuickLogin}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenPostJob={() => {
          setJobToEdit(null);
          setIsPostJobOpen(true);
        }}
      />

      {/* Main Content Area */}
      <main style={{ flex: 1, paddingBottom: 60 }}>
        {/* TAB: FIND JOBS */}
        {activeTab === 'jobs' && (
          <div>
            {/* Hero Section */}
            <div style={{
              padding: '60px 24px 40px',
              maxWidth: 1200,
              margin: '0 auto',
              textAlign: 'center'
            }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '6px 14px',
                borderRadius: 9999,
                backgroundColor: 'rgba(99, 102, 241, 0.12)',
                border: '1px solid rgba(99, 102, 241, 0.25)',
                color: '#a5b4fc',
                fontSize: '0.8rem',
                fontWeight: 600,
                marginBottom: 20
              }}>
                <Sparkles size={14} color="var(--accent-cyan)" />
                Over 1,000+ Verified Enterprise & Startup Opportunities
              </div>

              <h1 style={{
                fontSize: 'clamp(2.2rem, 5vw, 3.4rem)',
                fontWeight: 800,
                letterSpacing: '-0.03em',
                lineHeight: 1.15,
                marginBottom: 16
              }}>
                Find Your Next Career{' '}
                <span style={{
                  background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
                  Breakthrough
                </span>
              </h1>

              <p style={{
                fontSize: '1.05rem',
                color: 'var(--text-secondary)',
                maxWidth: 620,
                margin: '0 auto 36px',
                lineHeight: 1.6
              }}>
                Connect with visionary engineering teams, high-growth startups, and industry leaders hiring top technical talent.
              </p>

              {/* Search Bar Container */}
              <div style={{
                backgroundColor: 'rgba(20, 30, 51, 0.95)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: 'var(--radius-xl)',
                padding: '10px 14px',
                boxShadow: 'var(--shadow-lg)',
                maxWidth: 960,
                margin: '0 auto 20px',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                flexWrap: 'wrap'
              }}>
                {/* Keyword input */}
                <div style={{ flex: '1 1 240px', display: 'flex', alignItems: 'center', gap: 10, padding: '6px 10px' }}>
                  <Search size={18} color="var(--primary)" />
                  <input
                    type="text"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    placeholder="Role title, keywords, or company..."
                    className="input"
                    style={{ border: 'none', background: 'transparent', padding: '6px 0', fontSize: '0.95rem' }}
                  />
                </div>

                <div style={{ width: 1, height: 32, backgroundColor: 'var(--border-color)', display: 'none' }} />

                {/* Location input */}
                <div style={{ flex: '1 1 200px', display: 'flex', alignItems: 'center', gap: 10, padding: '6px 10px' }}>
                  <MapPin size={18} color="var(--accent-cyan)" />
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="City, country, or 'Remote'..."
                    className="input"
                    style={{ border: 'none', background: 'transparent', padding: '6px 0', fontSize: '0.95rem' }}
                  />
                </div>

                {/* Search Button */}
                <button
                  onClick={fetchJobs}
                  className="btn btn-primary"
                  style={{ borderRadius: 'var(--radius-lg)', padding: '12px 24px' }}
                >
                  <Search size={16} />
                  Search Jobs
                </button>
              </div>

              {/* Filter Pills */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                flexWrap: 'wrap',
                maxWidth: 960,
                margin: '0 auto'
              }}>
                {['All', 'Engineering', 'Data & AI', 'Design', 'DevOps', 'Product'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`btn btn-sm ${selectedCategory === cat ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ borderRadius: 9999, padding: '6px 14px', fontSize: '0.8rem' }}
                  >
                    {cat}
                  </button>
                ))}

                <select
                  value={selectedJobType}
                  onChange={(e) => setSelectedJobType(e.target.value)}
                  className="select"
                  style={{ width: 'auto', padding: '5px 12px', fontSize: '0.8rem', borderRadius: 9999 }}
                >
                  <option value="ALL">All Types</option>
                  <option value="FULL_TIME">Full Time</option>
                  <option value="REMOTE">Remote</option>
                  <option value="INTERNSHIP">Internship</option>
                  <option value="CONTRACT">Contract</option>
                </select>

                <select
                  value={selectedExpLevel}
                  onChange={(e) => setSelectedExpLevel(e.target.value)}
                  className="select"
                  style={{ width: 'auto', padding: '5px 12px', fontSize: '0.8rem', borderRadius: 9999 }}
                >
                  <option value="ALL">All Levels</option>
                  <option value="ENTRY_LEVEL">Entry Level</option>
                  <option value="MID_LEVEL">Mid Level</option>
                  <option value="SENIOR">Senior</option>
                  <option value="LEAD">Lead</option>
                </select>

                {(keyword || location || selectedCategory !== 'All' || selectedJobType !== 'ALL' || selectedExpLevel !== 'ALL') && (
                  <button
                    onClick={() => {
                      setKeyword('');
                      setLocation('');
                      setSelectedCategory('All');
                      setSelectedJobType('ALL');
                      setSelectedExpLevel('ALL');
                    }}
                    className="btn btn-sm btn-outline"
                    style={{ borderRadius: 9999, padding: '5px 10px', fontSize: '0.75rem', color: 'var(--accent-rose)' }}
                  >
                    <X size={12} /> Clear Filters
                  </button>
                )}
              </div>
            </div>

            {/* Results Grid */}
            <div style={{ maxWidth: 1240, margin: '0 auto', padding: '0 24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <div style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
                  Showing <strong style={{ color: 'var(--text-primary)' }}>{jobs.length}</strong> available positions
                </div>

                <button
                  onClick={fetchJobs}
                  className="btn btn-sm btn-outline"
                  style={{ border: 'none' }}
                >
                  <RefreshCw size={14} className={loadingJobs ? 'spin' : ''} />
                  Refresh
                </button>
              </div>

              {loadingJobs ? (
                <div style={{ textAlign: 'center', padding: '80px 20px', color: 'var(--text-muted)' }}>
                  Loading job listings...
                </div>
              ) : jobs.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: '60px 20px', maxWidth: 540, margin: '40px auto' }}>
                  <Briefcase size={40} color="var(--text-muted)" style={{ margin: '0 auto 16px' }} />
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 8 }}>No Matching Jobs Found</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: 20 }}>
                    Try tweaking your search keywords or clearing filter parameters.
                  </p>
                  <button
                    onClick={() => {
                      setKeyword('');
                      setLocation('');
                      setSelectedCategory('All');
                      setSelectedJobType('ALL');
                      setSelectedExpLevel('ALL');
                    }}
                    className="btn btn-secondary btn-sm"
                  >
                    Reset All Filters
                  </button>
                </div>
              ) : (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
                  gap: 20
                }}>
                  {jobs.map((job) => (
                    <JobCard
                      key={job.id}
                      job={job}
                      isSaved={isJobSaved(job.id)}
                      onToggleSave={handleToggleSaveJob}
                      onViewDetails={handleViewJobDetails}
                      onApplyNow={handleApplyNow}
                      user={user}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB: CANDIDATE MY APPLICATIONS */}
        {activeTab === 'applications' && (
          <ApplicationsView
            applications={myApplications}
            loading={loadingApplications}
            onViewJobDetails={handleViewJobDetails}
          />
        )}

        {/* TAB: CANDIDATE SAVED JOBS */}
        {activeTab === 'saved' && (
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '30px 20px' }}>
            <div style={{ marginBottom: 24 }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Saved Jobs</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                Your bookmarked positions ready for review and application.
              </p>
            </div>

            {savedJobs.length === 0 ? (
              <div className="card" style={{ textAlign: 'center', padding: '60px 20px', maxWidth: 500, margin: '40px auto' }}>
                <Bookmark size={40} color="var(--text-muted)" style={{ margin: '0 auto 16px' }} />
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 8 }}>No Saved Jobs</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: 16 }}>
                  Click the bookmark icon on any job card to save it here for later.
                </p>
                <button onClick={() => setActiveTab('jobs')} className="btn btn-primary btn-sm">
                  Browse Jobs
                </button>
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
                gap: 20
              }}>
                {savedJobs.map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    isSaved={true}
                    onToggleSave={handleToggleSaveJob}
                    onViewDetails={handleViewJobDetails}
                    onApplyNow={handleApplyNow}
                    user={user}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB: RECRUITER / EMPLOYER PORTAL */}
        {activeTab === 'employer' && (
          <EmployerDashboard
            onOpenPostJob={() => {
              setJobToEdit(null);
              setIsPostJobOpen(true);
            }}
            onEditJob={(job) => {
              setJobToEdit(job);
              setIsPostJobOpen(true);
            }}
            onNotify={addToast}
          />
        )}

        {/* TAB: ADMIN DASHBOARD */}
        {activeTab === 'admin' && (
          <AdminDashboard onNotify={addToast} />
        )}
      </main>

      {/* Modals */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLogin={handleLogin}
        onRegister={handleRegister}
      />

      <JobDetailsModal
        job={selectedJobDetails}
        detailsInfo={jobDetailsInfo}
        onClose={() => {
          setSelectedJobDetails(null);
          setJobDetailsInfo(null);
        }}
        onApply={handleApplyNow}
        onToggleSave={handleToggleSaveJob}
        user={user}
      />

      <ApplicationModal
        job={jobToApply}
        user={user}
        isOpen={!!jobToApply}
        onClose={() => setJobToApply(null)}
        onSuccess={handleApplicationSuccess}
      />

      <PostJobModal
        isOpen={isPostJobOpen}
        onClose={() => {
          setIsPostJobOpen(false);
          setJobToEdit(null);
        }}
        onJobSaved={(msg) => {
          addToast('success', msg);
          fetchJobs();
        }}
        jobToEdit={jobToEdit}
        user={user}
      />

      <ProfileModal
        user={user}
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        onProfileUpdated={handleProfileUpdated}
      />

      {/* Toast Notification Container */}
      <Toast toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}
