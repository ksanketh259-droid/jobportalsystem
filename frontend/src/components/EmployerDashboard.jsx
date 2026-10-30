import React, { useState, useEffect } from 'react';
import { PlusCircle, Users, CheckCircle, Clock, Trash2, Edit3, Eye, FileText, Calendar, Download, AlertCircle } from 'lucide-react';
import { api } from '../api';

export default function EmployerDashboard({
  onOpenPostJob,
  onEditJob,
  onNotify
}) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loadingApps, setLoadingApps] = useState(false);
  const [editingNotesId, setEditingNotesId] = useState(null);
  const [notesText, setNotesText] = useState('');
  const [interviewDate, setInterviewDate] = useState('');

  const loadEmployerData = async () => {
    setLoading(true);
    try {
      const data = await api.getMyJobs();
      setJobs(data);
    } catch (err) {
      onNotify('error', err.message || 'Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEmployerData();
  }, []);

  const handleToggleStatus = async (job) => {
    const nextStatus = job.status === 'OPEN' ? 'CLOSED' : 'OPEN';
    try {
      await api.updateJobStatus(job.id, nextStatus);
      setJobs(jobs.map((j) => (j.id === job.id ? { ...j, status: nextStatus } : j)));
      onNotify('success', `Job listing is now ${nextStatus.toLowerCase()}`);
    } catch (err) {
      onNotify('error', err.message);
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job listing?')) return;
    try {
      await api.deleteJob(jobId);
      setJobs(jobs.filter((j) => j.id !== jobId));
      if (selectedJob && selectedJob.id === jobId) {
        setSelectedJob(null);
      }
      onNotify('success', 'Job listing deleted');
    } catch (err) {
      onNotify('error', err.message);
    }
  };

  const handleOpenApplicants = async (job) => {
    setSelectedJob(job);
    setLoadingApps(true);
    try {
      const apps = await api.getJobApplications(job.id);
      setApplications(apps);
    } catch (err) {
      onNotify('error', err.message || 'Failed to load applications');
    } finally {
      setLoadingApps(false);
    }
  };

  const handleStatusChange = async (appId, newStatus) => {
    try {
      const updated = await api.updateApplicationStatus(appId, { status: newStatus });
      setApplications(applications.map((a) => (a.id === appId ? { ...a, status: updated.status } : a)));
      onNotify('success', `Candidate status updated to ${newStatus}`);
    } catch (err) {
      onNotify('error', err.message);
    }
  };

  const handleSaveNotesAndInterview = async (appId) => {
    try {
      const payload = {
        status: applications.find((a) => a.id === appId)?.status || 'UNDER_REVIEW',
        employerNotes: notesText,
        interviewDate: interviewDate ? new Date(interviewDate).toISOString() : null
      };
      const updated = await api.updateApplicationStatus(appId, payload);
      setApplications(applications.map((a) => (a.id === appId ? updated : a)));
      setEditingNotesId(null);
      onNotify('success', 'Recruiter notes and schedule saved');
    } catch (err) {
      onNotify('error', err.message);
    }
  };

  const activeCount = jobs.filter((j) => j.status === 'OPEN').length;

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '30px 20px' }}>
      {/* Top Banner & Stats */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Recruiter Dashboard</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Manage active job listings, track candidate pipelines, and schedule interviews.
          </p>
        </div>

        <button onClick={onOpenPostJob} className="btn btn-primary">
          <PlusCircle size={17} />
          Create New Job Listing
        </button>
      </div>

      {/* Metrics Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 28 }}>
        <div className="card" style={{ padding: '20px 24px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total Posted Jobs</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: 4, color: 'var(--text-primary)' }}>
            {jobs.length}
          </div>
        </div>

        <div className="card" style={{ padding: '20px 24px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Active Listings</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: 4, color: 'var(--accent-emerald)' }}>
            {activeCount}
          </div>
        </div>

        <div className="card" style={{ padding: '20px 24px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Closed / Archived</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: 4, color: 'var(--text-muted)' }}>
            {jobs.length - activeCount}
          </div>
        </div>
      </div>

      {/* Jobs Table / List */}
      <div className="card" style={{ marginBottom: 30, overflow: 'hidden', padding: 0 }}>
        <div style={{ padding: '18px 24px', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Your Job Listings</h3>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Showing {jobs.length} positions</span>
        </div>

        {loading ? (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>Loading posted jobs...</div>
        ) : jobs.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>
            You haven't posted any jobs yet. Click "Create New Job Listing" to publish one!
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: 'rgba(255,255,255,0.02)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '14px 20px', fontWeight: 600 }}>Job Title & Category</th>
                  <th style={{ padding: '14px 20px', fontWeight: 600 }}>Location & Type</th>
                  <th style={{ padding: '14px 20px', fontWeight: 600 }}>Status</th>
                  <th style={{ padding: '14px 20px', fontWeight: 600 }}>Date Posted</th>
                  <th style={{ padding: '14px 20px', fontWeight: 600, textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => (
                  <tr key={job.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '16px 20px' }}>
                      <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{job.title}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 2 }}>{job.category}</div>
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <div>{job.location}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 2 }}>
                        {job.jobType ? job.jobType.replace('_', ' ') : 'Full Time'}
                      </div>
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <button
                        onClick={() => handleToggleStatus(job)}
                        className={`badge ${job.status === 'OPEN' ? 'badge-emerald' : 'badge-gray'}`}
                        style={{ cursor: 'pointer', border: 'none' }}
                        title="Click to toggle status"
                      >
                        {job.status}
                      </button>
                    </td>
                    <td style={{ padding: '16px 20px', color: 'var(--text-muted)' }}>
                      {job.createdAt ? new Date(job.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                        <button
                          onClick={() => handleOpenApplicants(job)}
                          className="btn btn-sm btn-primary"
                          title="View applicants"
                        >
                          <Users size={14} />
                          Applicants
                        </button>
                        <button
                          onClick={() => onEditJob(job)}
                          className="btn btn-sm btn-secondary"
                          title="Edit job"
                        >
                          <Edit3 size={14} />
                        </button>
                        <button
                          onClick={() => handleDeleteJob(job.id)}
                          className="btn btn-sm btn-danger"
                          title="Delete job"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Selected Job Applicants Section */}
      {selectedJob && (
        <div className="card" style={{ padding: 24, border: '1px solid rgba(99, 102, 241, 0.3)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)', fontWeight: 600, textTransform: 'uppercase' }}>
                Candidate Pipeline
              </div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800 }}>
                Applicants for "{selectedJob.title}"
              </h3>
            </div>
            <button onClick={() => setSelectedJob(null)} className="btn btn-sm btn-outline">
              Close View
            </button>
          </div>

          {loadingApps ? (
            <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>
              Loading candidate applications...
            </div>
          ) : applications.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>
              No applications received yet for this listing.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {applications.map((app) => (
                <div key={app.id} style={{
                  padding: 18,
                  backgroundColor: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
                    <div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>
                        {app.applicant?.fullName || 'Candidate'}
                      </div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: 2 }}>
                        {app.applicant?.title || 'Job Seeker'} • {app.applicantEmail || app.applicant?.email} • {app.applicantPhone || 'No phone'}
                      </div>
                      {app.applicant?.skills && (
                        <div style={{ marginTop: 6, fontSize: '0.78rem', color: 'var(--accent-cyan)' }}>
                          Skills: {app.applicant.skills}
                        </div>
                      )}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <select
                        value={app.status}
                        onChange={(e) => handleStatusChange(app.id, e.target.value)}
                        className="select"
                        style={{ width: 'auto', padding: '6px 12px', fontSize: '0.85rem' }}
                      >
                        <option value="APPLIED">Applied</option>
                        <option value="UNDER_REVIEW">Under Review</option>
                        <option value="SHORTLISTED">Shortlisted</option>
                        <option value="INTERVIEW_SCHEDULED">Interview Scheduled</option>
                        <option value="ACCEPTED">Offer Accepted</option>
                        <option value="REJECTED">Rejected</option>
                      </select>

                      {app.resumeFileName && (
                        <a
                          href={`/api/files/${app.resumeFileName}`}
                          target="_blank"
                          rel="noreferrer"
                          className="btn btn-sm btn-secondary"
                          style={{ textDecoration: 'none' }}
                        >
                          <Download size={14} /> Resume
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Cover Letter */}
                  {app.coverLetter && (
                    <div style={{
                      marginTop: 12,
                      padding: 12,
                      backgroundColor: 'rgba(15, 23, 42, 0.6)',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.825rem',
                      color: 'var(--text-secondary)',
                      lineHeight: 1.5,
                      whiteSpace: 'pre-line'
                    }}>
                      <strong>Cover Letter:</strong><br />
                      {app.coverLetter}
                    </div>
                  )}

                  {/* Notes & Interview Schedule Section */}
                  <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {editingNotesId === app.id ? (
                      <div style={{
                        padding: 12,
                        backgroundColor: 'rgba(255, 255, 255, 0.03)',
                        borderRadius: 'var(--radius-sm)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 10
                      }}>
                        <div>
                          <label className="label">Recruiter Internal Feedback / Notes</label>
                          <textarea
                            rows={2}
                            value={notesText}
                            onChange={(e) => setNotesText(e.target.value)}
                            placeholder="Add evaluation feedback, score, or next steps..."
                            className="textarea"
                          />
                        </div>

                        <div>
                          <label className="label">Schedule Interview Date & Time</label>
                          <input
                            type="datetime-local"
                            value={interviewDate}
                            onChange={(e) => setInterviewDate(e.target.value)}
                            className="input"
                            style={{ width: 'auto' }}
                          />
                        </div>

                        <div style={{ display: 'flex', gap: 8 }}>
                          <button
                            onClick={() => handleSaveNotesAndInterview(app.id)}
                            className="btn btn-sm btn-primary"
                          >
                            Save Details
                          </button>
                          <button
                            onClick={() => setEditingNotesId(null)}
                            className="btn btn-sm btn-secondary"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        <div>
                          {app.employerNotes && (
                            <span style={{ marginRight: 12 }}>
                              <strong style={{ color: 'var(--text-secondary)' }}>Note:</strong> {app.employerNotes}
                            </span>
                          )}
                          {app.interviewDate && (
                            <span style={{ color: 'var(--accent-emerald)' }}>
                              <Calendar size={13} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />
                              Interview: {new Date(app.interviewDate).toLocaleString()}
                            </span>
                          )}
                        </div>
                        <button
                          onClick={() => {
                            setEditingNotesId(app.id);
                            setNotesText(app.employerNotes || '');
                            setInterviewDate(app.interviewDate ? app.interviewDate.substring(0, 16) : '');
                          }}
                          className="btn btn-sm btn-outline"
                          style={{ fontSize: '0.75rem', padding: '4px 8px' }}
                        >
                          {app.employerNotes || app.interviewDate ? 'Edit Notes / Schedule' : '+ Add Note & Schedule'}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
