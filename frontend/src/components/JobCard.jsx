import React from 'react';
import { MapPin, DollarSign, Bookmark, Briefcase, Calendar, ChevronRight } from 'lucide-react';

export default function JobCard({ job, isSaved, onToggleSave, onViewDetails, onApplyNow, user }) {
  const getJobTypeBadge = (type) => {
    switch (type) {
      case 'REMOTE':
        return <span className="badge badge-emerald">Remote</span>;
      case 'FULL_TIME':
        return <span className="badge badge-blue">Full-time</span>;
      case 'PART_TIME':
        return <span className="badge badge-amber">Part-time</span>;
      case 'CONTRACT':
        return <span className="badge badge-purple">Contract</span>;
      case 'INTERNSHIP':
        return <span className="badge badge-purple">Internship</span>;
      default:
        return <span className="badge badge-gray">{type}</span>;
    }
  };

  const formatSalary = (min, max, cur = '$') => {
    if (!min && !max) return 'Competitive Salary';
    const fmt = (num) => (num >= 1000 ? `${Math.round(num / 1000)}k` : num);
    if (min && max) return `${cur}${fmt(min)} - ${cur}${fmt(max)} / yr`;
    if (min) return `From ${cur}${fmt(min)} / yr`;
    return `Up to ${cur}${fmt(max)} / yr`;
  };

  return (
    <div className="card card-hover" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 14 }}>
        <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
          <div style={{
            width: 48,
            height: 48,
            borderRadius: 12,
            backgroundColor: 'rgba(99, 102, 241, 0.15)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.2rem',
            fontWeight: 800,
            color: 'var(--primary)',
            flexShrink: 0
          }}>
            {job.company ? job.company.charAt(0).toUpperCase() : 'C'}
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
              {job.company}
            </div>
            <h3
              onClick={() => onViewDetails(job)}
              style={{
                fontSize: '1.1rem',
                fontWeight: 700,
                color: 'var(--text-primary)',
                cursor: 'pointer',
                lineHeight: 1.3,
                marginTop: 2
              }}
            >
              {job.title}
            </h3>
          </div>
        </div>

        {/* Bookmark button */}
        {user && user.role === 'JOB_SEEKER' && (
          <button
            onClick={() => onToggleSave(job.id)}
            className="btn btn-icon btn-secondary"
            style={{
              color: isSaved ? 'var(--accent-rose)' : 'var(--text-muted)',
              border: isSaved ? '1px solid rgba(244, 63, 94, 0.4)' : '1px solid var(--border-color)',
              backgroundColor: isSaved ? 'rgba(244, 63, 94, 0.1)' : 'transparent',
              borderRadius: 10
            }}
            title={isSaved ? 'Remove from saved jobs' : 'Save job'}
          >
            <Bookmark size={18} fill={isSaved ? 'currentColor' : 'none'} />
          </button>
        )}
      </div>

      {/* Meta Pills */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 14 }}>
        {getJobTypeBadge(job.jobType)}
        <span className="badge badge-gray">{job.experienceLevel ? job.experienceLevel.replace('_', ' ') : 'All Levels'}</span>
        <span className="badge badge-purple">{job.category}</span>
      </div>

      {/* Description Snippet */}
      <p style={{
        fontSize: '0.875rem',
        color: 'var(--text-secondary)',
        lineHeight: 1.5,
        marginBottom: 16,
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
        flex: 1
      }}>
        {job.description}
      </p>

      {/* Footer Info & Actions */}
      <div style={{
        borderTop: '1px solid var(--border-color)',
        paddingTop: 14,
        marginTop: 'auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '0.85rem'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'var(--text-muted)', fontSize: '0.8rem' }}>
            <MapPin size={14} color="var(--accent-cyan)" />
            <span>{job.location}</span>
          </div>
          <div style={{ fontWeight: 700, color: '#38bdf8', fontSize: '0.9rem' }}>
            {formatSalary(job.salaryMin, job.salaryMax, job.currency)}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={() => onViewDetails(job)}
            className="btn btn-sm btn-outline"
          >
            Details
          </button>
          <button
            onClick={() => onApplyNow(job)}
            className="btn btn-sm btn-primary"
          >
            Apply
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
