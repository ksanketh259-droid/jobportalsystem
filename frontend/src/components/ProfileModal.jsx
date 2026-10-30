import React, { useState } from 'react';
import { X, User, Save, Upload, CheckCircle } from 'lucide-react';
import { api } from '../api';

export default function ProfileModal({ user, isOpen, onClose, onProfileUpdated }) {
  if (!isOpen || !user) return null;

  const [fullName, setFullName] = useState(user.fullName || '');
  const [phone, setPhone] = useState(user.phone || '');
  const [title, setTitle] = useState(user.title || '');
  const [bio, setBio] = useState(user.bio || '');
  const [skills, setSkills] = useState(user.skills || '');
  const [experienceYears, setExperienceYears] = useState(user.experienceYears || '');
  const [education, setEducation] = useState(user.education || '');
  const [companyName, setCompanyName] = useState(user.companyName || '');
  const [companyWebsite, setCompanyWebsite] = useState(user.companyWebsite || '');
  const [companyDescription, setCompanyDescription] = useState(user.companyDescription || '');
  const [resumeFileName, setResumeFileName] = useState(user.resumeFileName || '');
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
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
    setLoading(true);
    setError('');

    const payload = {
      fullName,
      phone,
      title,
      bio,
      skills,
      experienceYears: experienceYears ? parseInt(experienceYears, 10) : null,
      education,
      resumeFileName,
      companyName,
      companyWebsite,
      companyDescription
    };

    try {
      const updatedUser = await api.updateProfile(payload);
      onProfileUpdated(updatedUser);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-content-lg" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <User size={22} color="var(--primary)" />
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800 }}>Profile Settings</h3>
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
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div className="form-group">
              <label className="label">Full Name</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="input"
              />
            </div>

            <div className="form-group">
              <label className="label">Contact Phone</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="input"
              />
            </div>
          </div>

          {user.role === 'JOB_SEEKER' && (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div className="form-group">
                  <label className="label">Professional Headline / Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Senior Java Full Stack Developer"
                    className="input"
                  />
                </div>

                <div className="form-group">
                  <label className="label">Years of Experience</label>
                  <input
                    type="number"
                    value={experienceYears}
                    onChange={(e) => setExperienceYears(e.target.value)}
                    placeholder="5"
                    className="input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="label">Skills (Comma-separated)</label>
                <input
                  type="text"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  placeholder="e.g. Java, Spring Boot, React, SQL, Docker, AWS"
                  className="input"
                />
              </div>

              <div className="form-group">
                <label className="label">Education</label>
                <input
                  type="text"
                  value={education}
                  onChange={(e) => setEducation(e.target.value)}
                  placeholder="e.g. B.S. in Computer Science"
                  className="input"
                />
              </div>

              <div className="form-group">
                <label className="label">Short Professional Bio</label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Summarize your background, interests, and strengths..."
                  className="textarea"
                />
              </div>

              {/* Resume Upload */}
              <div className="form-group">
                <label className="label">Default Resume Document</label>
                <div style={{
                  border: '2px dashed var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  padding: 16,
                  textAlign: 'center',
                  backgroundColor: 'rgba(255, 255, 255, 0.02)',
                  position: 'relative'
                }}>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileUpload}
                    style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', width: '100%', height: '100%' }}
                  />
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                    <Upload size={20} color="var(--primary)" />
                    <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                      {uploading ? 'Uploading...' : (resumeFileName ? 'Active Resume: ' + resumeFileName : 'Upload a default resume (PDF/DOC)')}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {user.role === 'EMPLOYER' && (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div className="form-group">
                  <label className="label">Company Name</label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="input"
                  />
                </div>

                <div className="form-group">
                  <label className="label">Company Website</label>
                  <input
                    type="url"
                    value={companyWebsite}
                    onChange={(e) => setCompanyWebsite(e.target.value)}
                    placeholder="https://example.com"
                    className="input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="label">Company Description</label>
                <textarea
                  rows={4}
                  value={companyDescription}
                  onChange={(e) => setCompanyDescription(e.target.value)}
                  placeholder="Describe your company mission, culture, and products..."
                  className="textarea"
                />
              </div>
            </>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 24 }}>
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn btn-primary">
              <Save size={16} />
              {loading ? 'Saving...' : 'Update Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
