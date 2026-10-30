import React, { useState } from 'react';
import { X, Upload, FileText, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { api } from '../api';

export default function ApplicationModal({ job, user, isOpen, onClose, onSuccess }) {
  if (!isOpen || !job) return null;

  const [phone, setPhone] = useState(user?.phone || '');
  const [email, setEmail] = useState(user?.email || '');
  const [coverLetter, setCoverLetter] = useState(
    `Dear Hiring Team at ${job.company},\n\nI am excited to submit my application for the ${job.title} position. My background and experience align closely with the qualifications you are looking for.\n\nThank you for reviewing my profile!`
  );
  const [resumeFileName, setResumeFileName] = useState(user?.resumeFileName || '');
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setError('');
    try {
      const res = await api.uploadFile(file);
      setResumeFileName(res.fileName);
    } catch (err) {
      setError(err.message || 'Failed to upload resume file.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await api.apply({
        jobId: job.id,
        applicantEmail: email,
        applicantPhone: phone,
        coverLetter: coverLetter,
        resumeFileName: resumeFileName
      });
      onSuccess(`Successfully applied for "${job.title}"!`);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to submit application.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Apply for Role</h3>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              {job.title} at <strong style={{ color: 'var(--text-primary)' }}>{job.company}</strong>
            </div>
          </div>
          <button onClick={onClose} className="btn btn-icon btn-outline" style={{ border: 'none' }}>
            <X size={20} />
          </button>
        </div>

        {error && (
          <div style={{
            padding: '10px 14px',
            backgroundColor: 'rgba(244, 63, 94, 0.12)',
            border: '1px solid rgba(244, 63, 94, 0.3)',
            borderRadius: 'var(--radius-md)',
            color: '#fda4af',
            fontSize: '0.85rem',
            marginBottom: 16
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="label">Contact Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input"
            />
          </div>

          <div className="form-group">
            <label className="label">Phone Number</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1 (555) 000-0000"
              className="input"
            />
          </div>

          {/* Resume Upload */}
          <div className="form-group">
            <label className="label">Resume / CV (PDF, DOCX)</label>
            <div style={{
              border: '2px dashed var(--border-color)',
              borderRadius: 'var(--radius-md)',
              padding: '16px',
              textAlign: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.02)',
              position: 'relative'
            }}>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileUpload}
                style={{
                  position: 'absolute',
                  inset: 0,
                  opacity: 0,
                  cursor: 'pointer',
                  width: '100%',
                  height: '100%'
                }}
              />
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <Upload size={24} color="var(--primary)" />
                <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                  {uploading ? 'Uploading resume...' : (resumeFileName ? 'File Attached: ' + resumeFileName : 'Click to select or drop resume')}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Max size: 10MB
                </div>
              </div>
            </div>
            {resumeFileName && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6, fontSize: '0.8rem', color: 'var(--accent-emerald)' }}>
                <CheckCircle size={14} /> Resume attached successfully
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="label">Cover Letter / Note to Recruiter</label>
            <textarea
              rows={4}
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              className="textarea"
              placeholder="Highlight relevant achievements, projects, or notice period..."
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 20 }}>
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={submitting || uploading} className="btn btn-primary">
              <Send size={15} />
              {submitting ? 'Submitting...' : 'Submit Application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
