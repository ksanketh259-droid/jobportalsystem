import React, { useState } from 'react';
import { X, LogIn, UserPlus, Lock, Mail, User, Building, Briefcase } from 'lucide-react';

export default function AuthModal({ isOpen, onClose, onLogin, onRegister }) {
  const [isLoginTab, setIsLoginTab] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Login form
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form
  const [regFullName, setRegFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState('JOB_SEEKER');
  const [regCompanyName, setRegCompanyName] = useState('');
  const [regTitle, setRegTitle] = useState('');

  if (!isOpen) return null;

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await onLogin({ email: loginEmail, password: loginPassword });
      onClose();
    } catch (err) {
      setError(err.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await onRegister({
        fullName: regFullName,
        email: regEmail,
        password: regPassword,
        role: regRole,
        companyName: regRole === 'EMPLOYER' ? regCompanyName : null,
        title: regRole === 'JOB_SEEKER' ? regTitle : null
      });
      onClose();
    } catch (err) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (email, pwd) => {
    setLoginEmail(email);
    setLoginPassword(pwd);
    setIsLoginTab(true);
    setError('');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={() => { setIsLoginTab(true); setError(''); }}
              className={`btn btn-sm ${isLoginTab ? 'btn-primary' : 'btn-secondary'}`}
            >
              <LogIn size={15} />
              Sign In
            </button>
            <button
              onClick={() => { setIsLoginTab(false); setError(''); }}
              className={`btn btn-sm ${!isLoginTab ? 'btn-primary' : 'btn-secondary'}`}
            >
              <UserPlus size={15} />
              Create Account
            </button>
          </div>
          <button
            onClick={onClose}
            className="btn btn-icon btn-outline"
            style={{ border: 'none', color: 'var(--text-muted)' }}
          >
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

        {isLoginTab ? (
          <div>
            <form onSubmit={handleLoginSubmit}>
              <div className="form-group">
                <label className="label">Email Address</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} style={{ position: 'absolute', left: 12, top: 13, color: 'var(--text-muted)' }} />
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="input"
                    style={{ paddingLeft: 38 }}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="label">Password</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} style={{ position: 'absolute', left: 12, top: 13, color: 'var(--text-muted)' }} />
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="input"
                    style={{ paddingLeft: 38 }}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary w-full"
                style={{ marginTop: 8 }}
              >
                {loading ? 'Authenticating...' : 'Sign In to Account'}
              </button>
            </form>

            {/* Demo Accounts Quick-Select */}
            <div style={{ marginTop: 24, paddingTop: 18, borderTop: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 10, textAlign: 'center' }}>
                Instant Demo Access (Click to autofill credentials)
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                <button
                  type="button"
                  onClick={() => fillDemo('seeker@example.com', 'password123')}
                  className="btn btn-secondary btn-sm"
                  style={{ flexDirection: 'column', padding: '8px 4px', fontSize: '0.75rem' }}
                >
                  <User size={16} color="var(--primary)" />
                  Candidate
                </button>
                <button
                  type="button"
                  onClick={() => fillDemo('recruiter@techcorp.com', 'password123')}
                  className="btn btn-secondary btn-sm"
                  style={{ flexDirection: 'column', padding: '8px 4px', fontSize: '0.75rem' }}
                >
                  <Building size={16} color="var(--accent-purple)" />
                  Recruiter
                </button>
                <button
                  type="button"
                  onClick={() => fillDemo('admin@jobportal.com', 'admin123')}
                  className="btn btn-secondary btn-sm"
                  style={{ flexDirection: 'column', padding: '8px 4px', fontSize: '0.75rem' }}
                >
                  <Briefcase size={16} color="var(--accent-rose)" />
                  Admin
                </button>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleRegisterSubmit}>
            <div className="form-group">
              <label className="label">I want to join as</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div
                  onClick={() => setRegRole('JOB_SEEKER')}
                  style={{
                    padding: '12px 14px',
                    borderRadius: 'var(--radius-md)',
                    border: `1.5px solid ${regRole === 'JOB_SEEKER' ? 'var(--primary)' : 'var(--border-color)'}`,
                    backgroundColor: regRole === 'JOB_SEEKER' ? 'rgba(99, 102, 241, 0.1)' : 'rgba(255,255,255,0.02)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10
                  }}
                >
                  <User size={18} color={regRole === 'JOB_SEEKER' ? 'var(--primary)' : 'var(--text-muted)'} />
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>Job Seeker</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Find & apply for jobs</div>
                  </div>
                </div>

                <div
                  onClick={() => setRegRole('EMPLOYER')}
                  style={{
                    padding: '12px 14px',
                    borderRadius: 'var(--radius-md)',
                    border: `1.5px solid ${regRole === 'EMPLOYER' ? 'var(--accent-purple)' : 'var(--border-color)'}`,
                    backgroundColor: regRole === 'EMPLOYER' ? 'rgba(139, 92, 246, 0.1)' : 'rgba(255,255,255,0.02)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10
                  }}
                >
                  <Building size={18} color={regRole === 'EMPLOYER' ? 'var(--accent-purple)' : 'var(--text-muted)'} />
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>Employer</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Post jobs & hire talent</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="form-group">
              <label className="label">Full Name</label>
              <input
                type="text"
                required
                value={regFullName}
                onChange={(e) => setRegFullName(e.target.value)}
                placeholder="e.g. John Doe"
                className="input"
              />
            </div>

            <div className="form-group">
              <label className="label">Email Address</label>
              <input
                type="email"
                required
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                placeholder="name@company.com"
                className="input"
              />
            </div>

            <div className="form-group">
              <label className="label">Password (Min. 6 chars)</label>
              <input
                type="password"
                required
                minLength={6}
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                placeholder="••••••••"
                className="input"
              />
            </div>

            {regRole === 'EMPLOYER' ? (
              <div className="form-group">
                <label className="label">Company Name</label>
                <input
                  type="text"
                  required
                  value={regCompanyName}
                  onChange={(e) => setRegCompanyName(e.target.value)}
                  placeholder="e.g. Acme Innovations"
                  className="input"
                />
              </div>
            ) : (
              <div className="form-group">
                <label className="label">Professional Title (Optional)</label>
                <input
                  type="text"
                  value={regTitle}
                  onChange={(e) => setRegTitle(e.target.value)}
                  placeholder="e.g. Full Stack Developer"
                  className="input"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full"
              style={{ marginTop: 8 }}
            >
              {loading ? 'Creating Account...' : 'Complete Registration'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
