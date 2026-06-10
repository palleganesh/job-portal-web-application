import axios from 'axios';

const API = axios.create({ baseURL: '/api' });

// Attach token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auth
export const register = (data) => API.post('/auth/register', data);
export const login = (data) => API.post('/auth/login', data);

// Jobs
export const getJobs = (keyword) => API.get('/jobs/search', { params: { keyword } });
export const getJobById = (id) => API.get(`/jobs/${id}`);
export const createJob = (data) => API.post('/jobs', data);
export const updateJob = (id, data) => API.put(`/jobs/${id}`, data);
export const deleteJob = (id) => API.delete(`/jobs/${id}`);
export const getMyJobs = () => API.get('/jobs/my-jobs');

// Applications
export const applyToJob = (jobId, data) => API.post(`/applications/apply/${jobId}`, data);
export const getMyApplications = () => API.get('/applications/my-applications');
export const getJobApplications = (jobId) => API.get(`/applications/job/${jobId}`);
export const updateApplicationStatus = (appId, status) =>
  API.put(`/applications/${appId}/status`, { status });
