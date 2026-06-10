import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getJobById, applyToJob } from '../services/api';
import { useAuth } from '../AuthContext';

const JobDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [job, setJob] = useState(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    getJobById(id).then(res => setJob(res.data)).catch(console.error);
  }, [id]);

  const handleApply = async () => {
    try {
      await applyToJob(id, { coverLetter });
      setMessage('Application submitted successfully!');
    } catch (err) {
      setMessage(err.response?.data?.error || 'Failed to apply');
    }
  };

  if (!job) return <p style={{ padding: '24px' }}>Loading...</p>;

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>{job.title}</h2>
        <p style={styles.company}>{job.company}</p>
        <div style={styles.metaRow}>
          <span>📍 {job.location}</span>
          <span>💼 {job.jobType?.replace('_', ' ')}</span>
          {job.salary && <span>💰 {job.salary}</span>}
          <span>👥 {job.applicationCount} applicants</span>
        </div>
        <div style={styles.section}>
          <h4>Job Description</h4>
          <p>{job.description}</p>
        </div>
        {job.requirements && (
          <div style={styles.section}>
            <h4>Requirements</h4>
            <p>{job.requirements}</p>
          </div>
        )}
        <p style={styles.postedBy}>Posted by: {job.recruiterName}</p>

        {user?.role === 'JOB_SEEKER' && (
          <div style={styles.applySection}>
            <h4>Apply for this Job</h4>
            <textarea
              style={styles.textarea}
              placeholder="Write a cover letter (optional)..."
              value={coverLetter}
              onChange={e => setCoverLetter(e.target.value)}
              rows={5}
            />
            <button onClick={handleApply} style={styles.btn}>Apply Now</button>
            {message && <p style={message.includes('success') ? styles.success : styles.error}>{message}</p>}
          </div>
        )}

        {!user && (
          <p style={styles.loginMsg}>Please <a href="/login">login</a> as a Job Seeker to apply.</p>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: { padding: '24px', maxWidth: '800px', margin: '0 auto' },
  card: { background: '#fff', padding: '28px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' },
  title: { fontSize: '1.6rem', color: '#1a237e', margin: '0 0 8px' },
  company: { fontSize: '1.1rem', color: '#555', fontWeight: '600', margin: '0 0 12px' },
  metaRow: { display: 'flex', flexWrap: 'wrap', gap: '16px', fontSize: '0.9rem', color: '#555', marginBottom: '20px' },
  section: { marginBottom: '20px', lineHeight: 1.7 },
  postedBy: { fontSize: '0.85rem', color: '#999', marginBottom: '20px' },
  applySection: { borderTop: '1px solid #eee', paddingTop: '20px' },
  textarea: { width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '0.95rem', resize: 'vertical', boxSizing: 'border-box' },
  btn: { marginTop: '12px', padding: '12px 24px', background: '#2e7d32', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '1rem' },
  success: { color: '#2e7d32', marginTop: '8px' },
  error: { color: '#c62828', marginTop: '8px' },
  loginMsg: { marginTop: '16px', color: '#555' },
};

export default JobDetail;
