import React from 'react';
import { Briefcase, Bookmark, FileText, LayoutDashboard, Shield, User, LogOut, LogIn, PlusCircle } from 'lucide-react';

export default function Navbar({
  user,
  activeTab,
  setActiveTab,
  onOpenAuth,
  onLogout,
  onQuickLogin,
  onOpenProfile,
  onOpenPostJob
}) {
  return (
    <header style={{
      borderBottom: '1px solid var(--border-color)',
      backgroundColor: 'rgba(10, 15, 29, 0.85)',
      backdropFilter: 'blur(12px)',
      position: 'sticky',
      top: 0,
      zIndex: 50
    }}>
      <div style={{
        maxWidth: 1280,
        margin: '0 auto',
        padding: '0 24px',
        height: 72,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {/* Brand */}
        <div
          onClick={() => setActiveTab('jobs')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            cursor: 'pointer',
            userSelect: 'none'
          }}
        >
          <div style={{
            width: 42,
            height: 42,
            borderRadius: 12,
            background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(99, 102, 241, 0.35)'
          }}>
            <Briefcase size={22} color="#ffffff" />
          </div>
          <div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em', background: 'linear-gradient(to right, #ffffff, #cbd5e1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              WorkSphere
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--accent-cyan)', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              Career Hub
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <button
            onClick={() => setActiveTab('jobs')}
            className={`btn ${activeTab === 'jobs' ? 'btn-primary' : 'btn-outline'}`}
            style={{ borderRadius: 9999, padding: '8px 16px', fontSize: '0.85rem' }}
          >
            <Briefcase size={16} />
            Find Jobs
          </button>

          {user && (user.role === 'JOB_SEEKER' || user.role === 'ADMIN') && (
            <button
              onClick={() => setActiveTab('applications')}
              className={`btn ${activeTab === 'applications' ? 'btn-primary' : 'btn-outline'}`}
              style={{ borderRadius: 9999, padding: '8px 16px', fontSize: '0.85rem' }}
            >
              <FileText size={16} />
              My Applications
            </button>
          )}

          {user && user.role === 'JOB_SEEKER' && (
            <button
              onClick={() => setActiveTab('saved')}
              className={`btn ${activeTab === 'saved' ? 'btn-primary' : 'btn-outline'}`}
              style={{ borderRadius: 9999, padding: '8px 16px', fontSize: '0.85rem' }}
            >
              <Bookmark size={16} />
              Saved Jobs
            </button>
          )}

          {user && (user.role === 'EMPLOYER' || user.role === 'ADMIN') && (
            <button
              onClick={() => setActiveTab('employer')}
              className={`btn ${activeTab === 'employer' ? 'btn-primary' : 'btn-outline'}`}
              style={{ borderRadius: 9999, padding: '8px 16px', fontSize: '0.85rem' }}
            >
              <LayoutDashboard size={16} />
              Recruiter Hub
            </button>
          )}

          {user && user.role === 'ADMIN' && (
            <button
              onClick={() => setActiveTab('admin')}
              className={`btn ${activeTab === 'admin' ? 'btn-primary' : 'btn-outline'}`}
              style={{ borderRadius: 9999, padding: '8px 16px', fontSize: '0.85rem' }}
            >
              <Shield size={16} />
              Admin Portal
            </button>
          )}
        </nav>

        {/* Actions / User */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* Post Job Button (if employer or admin) */}
          {user && (user.role === 'EMPLOYER' || user.role === 'ADMIN') && (
            <button
              onClick={onOpenPostJob}
              className="btn btn-secondary"
              style={{ borderColor: 'rgba(99, 102, 241, 0.4)', color: '#a5b4fc', fontSize: '0.85rem' }}
            >
              <PlusCircle size={16} />
              Post Job
            </button>
          )}

          {/* Quick Demo Switcher Menu for effortless evaluation */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.04)',
            borderRadius: 8,
            padding: '4px',
            border: '1px solid var(--border-color)',
            fontSize: '0.75rem'
          }}>
            <span style={{ color: 'var(--text-muted)', padding: '0 6px', fontWeight: 600 }}>Demo:</span>
            <button
              onClick={() => onQuickLogin('seeker@example.com', 'password123')}
              className="btn btn-sm btn-outline"
              title="Switch to Candidate (Alex Morgan)"
              style={{ padding: '3px 8px', fontSize: '0.72rem', border: 'none' }}
            >
              Candidate
            </button>
            <button
              onClick={() => onQuickLogin('recruiter@techcorp.com', 'password123')}
              className="btn btn-sm btn-outline"
              title="Switch to Recruiter (TechCorp Global)"
              style={{ padding: '3px 8px', fontSize: '0.72rem', border: 'none' }}
            >
              Recruiter
            </button>
            <button
              onClick={() => onQuickLogin('admin@jobportal.com', 'admin123')}
              className="btn btn-sm btn-outline"
              title="Switch to Administrator"
              style={{ padding: '3px 8px', fontSize: '0.72rem', border: 'none' }}
            >
              Admin
            </button>
          </div>

          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div
                onClick={onOpenProfile}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '6px 12px',
                  borderRadius: 10,
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--border-color)',
                  cursor: 'pointer'
                }}
                title="Click to view/edit profile"
              >
                <div style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  backgroundColor: user.role === 'ADMIN' ? '#f43f5e' : (user.role === 'EMPLOYER' ? '#8b5cf6' : '#6366f1'),
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '0.85rem'
                }}>
                  {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
                </div>
                <div style={{ textAlign: 'left', lineHeight: 1.2 }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {user.fullName.split(' ')[0]}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                    {user.role === 'JOB_SEEKER' ? 'Candidate' : (user.role === 'EMPLOYER' ? 'Recruiter' : 'Admin')}
                  </div>
                </div>
              </div>

              <button
                onClick={onLogout}
                className="btn btn-icon btn-outline"
                title="Sign out"
                style={{ color: 'var(--text-muted)' }}
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="btn btn-primary"
              style={{ fontSize: '0.85rem' }}
            >
              <LogIn size={16} />
              Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
