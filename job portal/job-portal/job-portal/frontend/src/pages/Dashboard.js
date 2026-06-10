import React, { useEffect, useState } from 'react';
import { useAuth } from '../AuthContext';
import { getMyApplications, getMyJobs, getJobApplications, updateApplicationStatus } from '../services/api';

const Dashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState([]);
  const [selectedJobApps, setSelectedJobApps] = useState(null);
  const [selectedJobId, setSelectedJobId] = useState(null);

  useEffect(() => {
    if (user.role === 'JOB_SEEKER') {
      getMyApplications().then(r => setData(r.data)).catch(console.error);
    } else {
      getMyJobs().then(r => setData(r.data)).catch(console.error);
    }
  }, [user.role]);

  const viewApplications = async (jobId) => {
    setSelectedJobId(jobId);
    const res = await getJobApplications(jobId);
    setSelectedJobApps(res.data);
  };

  const handleStatusUpdate = async (appId, status) => {
    await updateApplicationStatus(appId, status);
    viewApplications(selectedJobId);
  };

  const statusColor = (status) => {
    const map = { APPLIED: '#1565c0', UNDER_REVIEW: '#f57c00', SHORTLISTED: '#7b1fa2', REJECTED: '#c62828', HIRED: '#2e7d32' };
    return map[status] || '#555';
  };

  return (
    <div style={styles.container}>
      <h2>Dashboard — {user.role === 'JOB_SEEKER' ? 'My Applications' : 'My Job Postings'}</h2>

      {user.role === 'JOB_SEEKER' && (
        <div style={styles.list}>
          {data.length === 0 ? <p>You haven't applied to any jobs yet.</p> : data.map(app => (
            <div key={app.id} style={styles.card}>
              <h4 style={{ margin: 0 }}>{app.jobTitle}</h4>
              <p style={styles.company}>{app.company}</p>
              <span style={{ ...styles.badge, background: statusColor(app.status) }}>{app.status}</span>
              <p style={styles.date}>Applied: {new Date(app.appliedAt).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      )}

      {(user.role === 'RECRUITER' || user.role === 'ADMIN') && (
        <div>
          <div style={styles.list}>
            {data.length === 0 ? <p>No jobs posted yet.</p> : data.map(job => (
              <div key={job.id} style={styles.card}>
                <h4 style={{ margin: 0 }}>{job.title}</h4>
                <p style={styles.company}>{job.company} — {job.location}</p>
                <p style={{ margin: '4px 0', fontSize: '0.85rem' }}>
                  {job.applicationCount} applicant(s) &nbsp;|&nbsp;
                  <span style={{ color: job.status === 'ACTIVE' ? '#2e7d32' : '#c62828' }}>{job.status}</span>
                </p>
                <button style={styles.viewBtn} onClick={() => viewApplications(job.id)}>
                  View Applications
                </button>
              </div>
            ))}
          </div>

          {selectedJobApps && (
            <div style={styles.appsSection}>
              <h3>Applications ({selectedJobApps.length})</h3>
              {selectedJobApps.length === 0 ? <p>No applications yet.</p> : selectedJobApps.map(app => (
                <div key={app.id} style={styles.appCard}>
                  <p style={{ margin: 0, fontWeight: 600 }}>{app.applicantName} — {app.applicantEmail}</p>
                  {app.coverLetter && <p style={styles.coverLetter}>{app.coverLetter}</p>}
                  <span style={{ ...styles.badge, background: statusColor(app.status) }}>{app.status}</span>
                  <div style={styles.actions}>
                    {['UNDER_REVIEW', 'SHORTLISTED', 'REJECTED', 'HIRED'].map(s => (
                      <button key={s} style={styles.actionBtn} onClick={() => handleStatusUpdate(app.id, s)}>
                        {s.replace('_', ' ')}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: { padding: '24px', maxWidth: '900px', margin: '0 auto' },
  list: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px', marginBottom: '32px' },
  card: { background: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #e0e0e0', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' },
  company: { color: '#555', margin: '4px 0 8px', fontWeight: '600' },
  badge: { display: 'inline-block', color: '#fff', padding: '3px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600 },
  date: { fontSize: '0.8rem', color: '#999', margin: '8px 0 0' },
  viewBtn: { marginTop: '10px', padding: '6px 14px', background: '#1565c0', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem' },
  appsSection: { background: '#f5f5f5', padding: '20px', borderRadius: '8px' },
  appCard: { background: '#fff', padding: '16px', borderRadius: '8px', marginBottom: '12px', border: '1px solid #e0e0e0' },
  coverLetter: { fontSize: '0.85rem', color: '#555', fontStyle: 'italic', margin: '8px 0' },
  actions: { marginTop: '10px', display: 'flex', gap: '8px', flexWrap: 'wrap' },
  actionBtn: { padding: '4px 12px', background: '#37474f', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' },
};

export default Dashboard;
