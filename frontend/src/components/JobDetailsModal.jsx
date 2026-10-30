import React from 'react';
import { X, MapPin, Building, DollarSign, Calendar, Clock, Bookmark, CheckCircle, ExternalLink, Send } from 'lucide-react';

export default function JobDetailsModal({
  job,
  detailsInfo, // contains hasApplied, isSaved
  onClose,
  onApply,
  onToggleSave,
  user
}) {
  if (!job) return null;

  const hasApplied = detailsInfo?.hasApplied;
  const isSaved = detailsInfo?.isSaved;

  const formatSalary = (min, max, cur = '$') => {
    if (!min && !max) return 'Competitive Compensation';
    const fmt = (num) => (num >= 1000 ? `${Math.round(num / 1000)}k` : num);
    if (min && max) return `${cur}${fmt(min)} - ${cur}${fmt(max)} / year`;
    if (min) return `From ${cur}${fmt(min)} / year`;
    return `Up to ${cur}${fmt(max)} / year`;
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-content-lg" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, marginBottom: 20 }}>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <div style={{
              width: 58,
              height: 58,
              borderRadius: 14,
              backgroundColor: 'rgba(99, 102, 241, 0.18)',
              border: '1px solid rgba(99, 102, 241, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem',
              fontWeight: 800,
              color: 'var(--primary)',
              flexShrink: 0
            }}>
              {job.company ? job.company.charAt(0).toUpperCase() : 'C'}
            </div>
            <div>
              <div style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                {job.company}
              </div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: 2 }}>
                {job.title}
              </h2>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            {user && user.role === 'JOB_SEEKER' && (
              <button
                onClick={() => onToggleSave(job.id)}
                className="btn btn-secondary"
                style={{
                  color: isSaved ? 'var(--accent-rose)' : 'var(--text-muted)',
                  border: isSaved ? '1px solid rgba(244, 63, 94, 0.4)' : '1px solid var(--border-color)',
                  backgroundColor: isSaved ? 'rgba(244, 63, 94, 0.1)' : 'transparent'
                }}
              >
                <Bookmark size={16} fill={isSaved ? 'currentColor' : 'none'} />
                {isSaved ? 'Saved' : 'Save'}
              </button>
            )}

            <button
              onClick={onClose}
              className="btn btn-icon btn-outline"
              style={{ border: 'none', color: 'var(--text-muted)' }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Quick Highlights Bar */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: 12,
          padding: '16px',
          backgroundColor: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-md)',
          marginBottom: 24
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <MapPin size={18} color="var(--accent-cyan)" />
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Location</div>
              <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>{job.location}</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <DollarSign size={18} color="var(--accent-emerald)" />
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Salary</div>
              <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#38bdf8' }}>
                {formatSalary(job.salaryMin, job.salaryMax, job.currency)}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Clock size={18} color="var(--accent-purple)" />
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Job Type</div>
              <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>
                {job.jobType ? job.jobType.replace('_', ' ') : 'Full Time'}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Building size={18} color="var(--primary)" />
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Category / Level</div>
              <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>
                {job.category} • {job.experienceLevel ? job.experienceLevel.replace('_', ' ') : 'Experienced'}
              </div>
            </div>
          </div>
        </div>

        {/* Action Button Banner */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, padding: '14px 18px', backgroundColor: 'rgba(99, 102, 241, 0.08)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
          <div>
            <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>
              Interested in this position?
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Direct application submitted to {job.company}'s recruitment team.
            </div>
          </div>

          {hasApplied ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--accent-emerald)', fontWeight: 600, fontSize: '0.9rem' }}>
              <CheckCircle size={18} />
              Applied Already
            </div>
          ) : (
            <button
              onClick={() => onApply(job)}
              className="btn btn-primary"
            >
              <Send size={16} />
              Apply Now
            </button>
          )}
        </div>

        {/* Job Content Sections */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Description */}
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>
              Job Overview
            </h4>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, whiteSpace: 'pre-line' }}>
              {job.description}
            </div>
          </div>

          {/* Responsibilities */}
          {job.responsibilities && (
            <div>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>
                Key Responsibilities
              </h4>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, whiteSpace: 'pre-line' }}>
                {job.responsibilities}
              </div>
            </div>
          )}

          {/* Requirements */}
          {job.requirements && (
            <div>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>
                Candidate Qualifications & Skills
              </h4>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, whiteSpace: 'pre-line' }}>
                {job.requirements}
              </div>
            </div>
          )}

          {/* Benefits */}
          {job.benefits && (
            <div>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>
                Perks & Benefits
              </h4>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, whiteSpace: 'pre-line' }}>
                {job.benefits}
              </div>
            </div>
          )}

          {/* Employer Information */}
          {job.employer && (
            <div style={{
              marginTop: 12,
              padding: '16px',
              backgroundColor: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)'
            }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>
                About {job.company}
              </div>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                {job.employer.companyDescription || 'Leading technology and industry company hiring top talent.'}
              </p>
              {job.employer.companyWebsite && (
                <a
                  href={job.employer.companyWebsite}
                  target="_blank"
                  rel="noreferrer"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: '0.8rem', color: 'var(--accent-cyan)', marginTop: 8, textDecoration: 'none' }}
                >
                  Visit Company Website <ExternalLink size={13} />
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
