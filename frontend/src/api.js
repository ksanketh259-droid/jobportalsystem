const API_BASE = '/api';

export const getAuthToken = () => localStorage.getItem('token');
export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('token', token);
  } else {
    localStorage.removeItem('token');
  }
};

export const getStoredUser = () => {
  try {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
};

export const setStoredUser = (user) => {
  if (user) {
    localStorage.setItem('user', JSON.stringify(user));
  } else {
    localStorage.removeItem('user');
  }
};

async function request(endpoint, options = {}) {
  const headers = { ...options.headers };
  const token = getAuthToken();

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    // If unauthorized, clear stale credentials if token was invalid
    // setAuthToken(null);
    // setStoredUser(null);
  }

  let data;
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    data = await response.json();
  } else {
    data = await response.text();
  }

  if (!response.ok) {
    const errorMessage = (data && data.message) ? data.message : (typeof data === 'string' ? data : 'An error occurred');
    throw new Error(errorMessage);
  }

  return data;
}

export const api = {
  // Auth
  login: (credentials) => request('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  register: (userData) => request('/auth/register', { method: 'POST', body: JSON.stringify(userData) }),
  getMe: () => request('/auth/me'),
  updateProfile: (profileData) => request('/auth/profile', { method: 'PUT', body: JSON.stringify(profileData) }),

  // Jobs
  getJobs: (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.keyword) params.append('keyword', filters.keyword);
    if (filters.location) params.append('location', filters.location);
    if (filters.category && filters.category !== 'All') params.append('category', filters.category);
    if (filters.jobType && filters.jobType !== 'ALL') params.append('jobType', filters.jobType);
    if (filters.experienceLevel && filters.experienceLevel !== 'ALL') params.append('experienceLevel', filters.experienceLevel);
    if (filters.minSalary) params.append('minSalary', filters.minSalary);

    const qs = params.toString();
    return request(`/jobs${qs ? `?${qs}` : ''}`);
  },
  getCategories: () => request('/jobs/categories'),
  getJob: (id) => request(`/jobs/${id}`),
  createJob: (jobData) => request('/jobs', { method: 'POST', body: JSON.stringify(jobData) }),
  updateJob: (id, jobData) => request(`/jobs/${id}`, { method: 'PUT', body: JSON.stringify(jobData) }),
  deleteJob: (id) => request(`/jobs/${id}`, { method: 'DELETE' }),
  updateJobStatus: (id, status) => request(`/jobs/${id}/status?status=${status}`, { method: 'PATCH' }),
  getMyJobs: () => request('/jobs/my-jobs'),
  toggleSaveJob: (id) => request(`/jobs/${id}/save`, { method: 'POST' }),
  getSavedJobs: () => request('/jobs/saved'),

  // Applications
  apply: (applicationData) => request('/applications/apply', { method: 'POST', body: JSON.stringify(applicationData) }),
  getMyApplications: () => request('/applications/my-applications'),
  getJobApplications: (jobId) => request(`/applications/job/${jobId}`),
  getEmployerApplications: () => request('/applications/employer-all'),
  updateApplicationStatus: (id, updateData) => request(`/applications/${id}/status`, { method: 'PATCH', body: JSON.stringify(updateData) }),

  // Admin
  getAdminStats: () => request('/admin/stats'),
  getAdminUsers: () => request('/admin/users'),
  deleteUser: (id) => request(`/admin/users/${id}`, { method: 'DELETE' }),
  changeUserRole: (id, role) => request(`/admin/users/${id}/role?role=${role}`, { method: 'PATCH' }),

  // Files
  uploadFile: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return request('/files/upload', {
      method: 'POST',
      body: formData,
    });
  },
};
