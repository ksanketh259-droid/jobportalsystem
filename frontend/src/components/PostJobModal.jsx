import React, { useState, useEffect } from 'react';
import { X, Briefcase, Plus, Save } from 'lucide-react';
import { api } from '../api';

export default function PostJobModal({ isOpen, onClose, onJobSaved, jobToEdit, user }) {
  if (!isOpen) return null;

  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [category, setCategory] = useState('Engineering');
  const [jobType, setJobType] = useState('FULL_TIME');
  const [experienceLevel, setExperienceLevel] = useState('MID_LEVEL');
  const [location, setLocation] = useState('Remote');
  const [salaryMin, setSalaryMin] = useState(100000);
  const [salaryMax, setSalaryMax] = useState(140000);
  const [currency, setCurrency] = useState('$');
  const [description, setDescription] = useState('');
  const [requirements, setRequirements] = useState('');
  const [responsibilities, setResponsibilities] = useState('');
  const [benefits, setBenefits] = useState('');
  const [status, setStatus] = useState('OPEN');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (jobToEdit) {
      setTitle(jobToEdit.title || '');
      setCompany(jobToEdit.company || user?.companyName || '');
      setCategory(jobToEdit.category || 'Engineering');
      setJobType(jobToEdit.jobType || 'FULL_TIME');
      setExperienceLevel(jobToEdit.experienceLevel || 'MID_LEVEL');
      setLocation(jobToEdit.location || '');
      setSalaryMin(jobToEdit.salaryMin || '');
      setSalaryMax(jobToEdit.salaryMax || '');
      setCurrency(jobToEdit.currency || '$');
      setDescription(jobToEdit.description || '');
      setRequirements(jobToEdit.requirements || '');
      setResponsibilities(jobToEdit.responsibilities || '');
      setBenefits(jobToEdit.benefits || '');
      setStatus(jobToEdit.status || 'OPEN');
    } else {
      setTitle('');
      setCompany(user?.companyName || user?.fullName || 'Acme Corp');
      setCategory('Engineering');
      setJobType('FULL_TIME');
      setExperienceLevel('MID_LEVEL');
      setLocation('Remote');
      setSalaryMin(100000);
      setSalaryMax(140000);
      setCurrency('$');
      setDescription('We are looking for an exceptional professional to join our fast-paced product engineering team.');
      setRequirements('• 3+ years relevant industry experience\n• Strong problem solving and collaboration skills\n• Solid grasp of modern software development life cycle');
      setResponsibilities('• Build, test, and ship high impact product features\n• Work collaboratively with cross-functional partners in product and design\n• Participate in code reviews and architecture discussions');
      setBenefits('• Flexible work schedule and remote-first culture\n• Competitive salary and equity packages\n• Full health and wellness coverage');
      setStatus('OPEN');
    }
  }, [jobToEdit, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const payload = {
      title,
      company,
      category,
      jobType,
      experienceLevel,
      location,
      salaryMin: salaryMin ? parseFloat(salaryMin) : null,
      salaryMax: salaryMax ? parseFloat(salaryMax) : null,
      currency,
      description,
      requirements,
      responsibilities,
      benefits,
      status
    };

    try {
      if (jobToEdit) {
        await api.updateJob(jobToEdit.id, payload);
        onJobSaved('Job listing updated successfully!');
      } else {
        await api.createJob(payload);
        onJobSaved('Job listing published successfully!');
      }
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to save job listing.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-content-lg" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Briefcase size={22} color="var(--primary)" />
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800 }}>
              {jobToEdit ? 'Edit Job Listing' : 'Post a New Job Opportunity'}
            </h3>
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
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14 }}>
            <div className="form-group">
              <label className="label">Job Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Senior Backend Engineer"
                className="input"
              />
            </div>

            <div className="form-group">
              <label className="label">Company Name *</label>
              <input
                type="text"
                required
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g. TechCorp"
                className="input"
              />
            </div>

            <div className="form-group">
              <label className="label">Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="select"
              >
                <option value="Engineering">Engineering</option>
                <option value="Data & AI">Data & AI</option>
                <option value="Design">Design</option>
                <option value="DevOps">DevOps</option>
                <option value="Product">Product</option>
                <option value="Marketing">Marketing</option>
                <option value="Sales">Sales</option>
              </select>
            </div>

            <div className="form-group">
              <label className="label">Job Type *</label>
              <select
                value={jobType}
                onChange={(e) => setJobType(e.target.value)}
                className="select"
              >
                <option value="FULL_TIME">Full Time</option>
                <option value="PART_TIME">Part Time</option>
                <option value="REMOTE">Remote</option>
                <option value="CONTRACT">Contract</option>
                <option value="INTERNSHIP">Internship</option>
              </select>
            </div>

            <div className="form-group">
              <label className="label">Experience Level *</label>
              <select
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value)}
                className="select"
              >
                <option value="ENTRY_LEVEL">Entry Level</option>
                <option value="MID_LEVEL">Mid Level</option>
                <option value="SENIOR">Senior</option>
                <option value="LEAD">Lead</option>
                <option value="EXECUTIVE">Executive</option>
              </select>
            </div>

            <div className="form-group">
              <label className="label">Location *</label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. San Francisco, CA or Remote"
                className="input"
              />
            </div>

            <div className="form-group">
              <label className="label">Min Salary / Year</label>
              <input
                type="number"
                value={salaryMin}
                onChange={(e) => setSalaryMin(e.target.value)}
                placeholder="90000"
                className="input"
              />
            </div>

            <div className="form-group">
              <label className="label">Max Salary / Year</label>
              <input
                type="number"
                value={salaryMax}
                onChange={(e) => setSalaryMax(e.target.value)}
                placeholder="140000"
                className="input"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="label">Role Description *</label>
            <textarea
              rows={3}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="textarea"
            />
          </div>

          <div className="form-group">
            <label className="label">Responsibilities</label>
            <textarea
              rows={3}
              value={responsibilities}
              onChange={(e) => setResponsibilities(e.target.value)}
              className="textarea"
            />
          </div>

          <div className="form-group">
            <label className="label">Qualifications & Requirements</label>
            <textarea
              rows={3}
              value={requirements}
              onChange={(e) => setRequirements(e.target.value)}
              className="textarea"
            />
          </div>

          <div className="form-group">
            <label className="label">Perks & Benefits</label>
            <textarea
              rows={2}
              value={benefits}
              onChange={(e) => setBenefits(e.target.value)}
              className="textarea"
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 20 }}>
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn btn-primary">
              <Save size={16} />
              {loading ? 'Saving...' : (jobToEdit ? 'Save Changes' : 'Publish Job')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
