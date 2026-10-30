import React, { useState, useEffect } from 'react';
import { Shield, Users, Briefcase, FileText, CheckCircle, Trash2, PieChart, RefreshCw } from 'lucide-react';
import { api } from '../api';

export default function AdminDashboard({ onNotify }) {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [statsData, usersData] = await Promise.all([
        api.getAdminStats(),
        api.getAdminUsers()
      ]);
      setStats(statsData);
      setUsers(usersData);
    } catch (err) {
      onNotify('error', err.message || 'Failed to fetch admin metrics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const handleChangeRole = async (userId, newRole) => {
    try {
      const updated = await api.changeUserRole(userId, newRole);
      setUsers(users.map((u) => (u.id === userId ? { ...u, role: updated.role } : u)));
      onNotify('success', `User role updated to ${newRole}`);
    } catch (err) {
      onNotify('error', err.message);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await api.deleteUser(userId);
      setUsers(users.filter((u) => u.id !== userId));
      onNotify('success', 'User removed from platform');
    } catch (err) {
      onNotify('error', err.message);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: 60, color: 'var(--text-muted)' }}>
        Loading platform administration analytics...
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '30px 20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ padding: 6, backgroundColor: 'rgba(244, 63, 94, 0.15)', borderRadius: 8 }}>
              <Shield size={20} color="var(--accent-rose)" />
            </div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Platform Administration</h2>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: 4 }}>
            System-wide analytics, job metrics, and account access management.
          </p>
        </div>

        <button onClick={loadAdminData} className="btn btn-secondary btn-sm">
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {/* KPI Stats Grid */}
      {stats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 28 }}>
          <div className="card" style={{ padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total Jobs</span>
              <Briefcase size={16} color="var(--primary)" />
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: 8 }}>
              {stats.totalJobs}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--accent-emerald)', marginTop: 4 }}>
              {stats.openJobs} currently open
            </div>
          </div>

          <div className="card" style={{ padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total Applications</span>
              <FileText size={16} color="var(--accent-cyan)" />
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: 8 }}>
              {stats.totalApplications}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>
              Submitted across all jobs
            </div>
          </div>

          <div className="card" style={{ padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Job Seekers</span>
              <Users size={16} color="var(--accent-purple)" />
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: 8 }}>
              {stats.totalJobSeekers}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>
              Active candidate profiles
            </div>
          </div>

          <div className="card" style={{ padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Employers</span>
              <Users size={16} color="var(--accent-amber)" />
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: 8 }}>
              {stats.totalEmployers}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>
              Verified company accounts
            </div>
          </div>
        </div>
      )}

      {/* Analytics Breakdown */}
      {stats && stats.jobsByCategory && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20, marginBottom: 30 }}>
          <div className="card" style={{ padding: 20 }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: 16 }}>Jobs by Category</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {Object.entries(stats.jobsByCategory).map(([cat, count]) => {
                const pct = stats.totalJobs ? Math.round((count / stats.totalJobs) * 100) : 0;
                return (
                  <div key={cat}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.825rem', marginBottom: 4 }}>
                      <span>{cat}</span>
                      <strong style={{ color: 'var(--text-primary)' }}>{count} ({pct}%)</strong>
                    </div>
                    <div style={{ height: 6, backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${pct}%`, backgroundColor: 'var(--primary)', borderRadius: 3 }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="card" style={{ padding: 20 }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: 16 }}>Application Status Distribution</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {Object.entries(stats.applicationsByStatus || {}).map(([status, count]) => {
                const pct = stats.totalApplications ? Math.round((count / stats.totalApplications) * 100) : 0;
                return (
                  <div key={status}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.825rem', marginBottom: 4 }}>
                      <span style={{ textTransform: 'capitalize' }}>{status.toLowerCase().replace('_', ' ')}</span>
                      <strong style={{ color: 'var(--text-primary)' }}>{count} ({pct}%)</strong>
                    </div>
                    <div style={{ height: 6, backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${pct}%`, backgroundColor: 'var(--accent-cyan)', borderRadius: 3 }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* User Management Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '18px 24px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Platform Users</h3>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{users.length} Registered Accounts</span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: 'rgba(255,255,255,0.02)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '14px 20px', fontWeight: 600 }}>User</th>
                <th style={{ padding: '14px 20px', fontWeight: 600 }}>Email</th>
                <th style={{ padding: '14px 20px', fontWeight: 600 }}>Role</th>
                <th style={{ padding: '14px 20px', fontWeight: 600 }}>Company / Title</th>
                <th style={{ padding: '14px 20px', fontWeight: 600, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '14px 20px' }}>
                    <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{u.fullName}</div>
                  </td>
                  <td style={{ padding: '14px 20px', color: 'var(--text-secondary)' }}>
                    {u.email}
                  </td>
                  <td style={{ padding: '14px 20px' }}>
                    <select
                      value={u.role}
                      onChange={(e) => handleChangeRole(u.id, e.target.value)}
                      className="select"
                      style={{ width: 'auto', padding: '4px 8px', fontSize: '0.8rem' }}
                    >
                      <option value="JOB_SEEKER">Job Seeker</option>
                      <option value="EMPLOYER">Employer</option>
                      <option value="ADMIN">Admin</option>
                    </select>
                  </td>
                  <td style={{ padding: '14px 20px', color: 'var(--text-muted)', fontSize: '0.825rem' }}>
                    {u.companyName || u.title || '—'}
                  </td>
                  <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                    <button
                      onClick={() => handleDeleteUser(u.id)}
                      className="btn btn-sm btn-danger"
                      title="Delete user"
                    >
                      <Trash2 size={13} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
