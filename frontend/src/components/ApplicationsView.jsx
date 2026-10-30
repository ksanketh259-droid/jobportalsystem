import React from 'react';
import { Calendar, Clock, Building, MapPin, CheckCircle, AlertCircle, MessageSquare, Briefcase } from 'lucide-react';

export default function ApplicationsView({ applications, loading, onViewJobDetails }) {
  const getStatusBadge = (status) => {
    switch (status) {
      case 'APPLIED':
        return <span className="badge badge-blue">Applied</span>;
      case 'UNDER_REVIEW':
        return <span className="badge badge-amber">Under Review</span>;
      case 'SHORTLISTED':
        return <span className="badge badge-purple">Shortlisted</span>;
      case 'INTERVIEW_SCHEDULED':
        return <span className="badge badge-emerald">Interview Scheduled</span>;
      case 'ACCEPTED':
        return <span className="badge badge-emerald">Offer Accepted</span>;
      case 'REJECTED':
        return <span className="badge badge-rose">Not Selected</span>;
      default:
        return <span className="badge badge-gray">{status}</span>;
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatDateTime = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
        Loading your applications...
      </div>
    );
  }

  if (!applications || applications.length === 0) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '60px 20px', maxWidth: 600, margin: '40px auto' }}>
        <Briefcase size={42} color="var(--text-muted)" style={{ margin: '0 auto 16px' }} />
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 8 }}>No Applications Yet</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: 20 }}>
          Explore open positions and apply to your favorite jobs to track your progress here.
        </p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: '30px 20px' }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>My Job Applications</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
          Track the status of your applications and interview schedules in real time.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {applications.map((app) => (
          <div key={app.id} className="card" style={{ padding: 22 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
              <div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Building size={14} />
                  {app.job?.company}
                </div>
                <h3
                  onClick={() => app.job && onViewJobDetails(app.job)}
                  style={{
                    fontSize: '1.15rem',
                    fontWeight: 700,
                    marginTop: 3,
                    cursor: 'pointer',
                    color: 'var(--text-primary)'
                  }}
                >
                  {app.job?.title}
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 6, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <MapPin size={13} color="var(--accent-cyan)" />
                    {app.job?.location}
                  </span>
                  <span>•</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Clock size={13} />
                    Applied: {formatDate(app.appliedAt)}
                  </span>
                </div>
              </div>

              <div>
                {getStatusBadge(app.status)}
              </div>
            </div>

            {/* Interview Notification Banner */}
            {app.interviewDate && (
              <div style={{
                marginTop: 14,
                padding: '10px 14px',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.25)',
                borderRadius: 'var(--radius-sm)',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                color: '#6ee7b7',
                fontSize: '0.85rem'
              }}>
                <Calendar size={16} />
                <strong>Interview Scheduled:</strong> {formatDateTime(app.interviewDate)}
              </div>
            )}

            {/* Recruiter Notes / Feedback */}
            {app.employerNotes && (
              <div style={{
                marginTop: 12,
                padding: '10px 14px',
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.825rem',
                color: 'var(--text-secondary)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'var(--text-muted)', fontWeight: 600, marginBottom: 4 }}>
                  <MessageSquare size={13} />
                  Recruiter Feedback:
                </div>
                <div>{app.employerNotes}</div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
