import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createJob } from '../services/api';

const PostJob = () => {
  const [form, setForm] = useState({
    title: '', company: '', location: '', jobType: 'FULL_TIME',
    description: '', requirements: '', salary: '', status: 'ACTIVE'
  });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createJob(form);
      setMessage('Job posted successfully!');
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err) {
      setMessage(err.response?.data?.error || 'Failed to post job');
    }
  };

  const field = (key, placeholder, type = 'text') => (
    <input style={styles.input} type={type} placeholder={placeholder}
      value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} required={['title','company','location','description'].includes(key)} />
  );

  return (
    <div style={styles.wrapper}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2>Post a New Job</h2>
        {message && <p style={message.includes('success') ? styles.success : styles.error}>{message}</p>}
        {field('title', 'Job Title')}
        {field('company', 'Company Name')}
        {field('location', 'Location')}
        <select style={styles.input} value={form.jobType} onChange={e => setForm({ ...form, jobType: e.target.value })}>
          <option value="FULL_TIME">Full Time</option>
          <option value="PART_TIME">Part Time</option>
          <option value="INTERNSHIP">Internship</option>
          <option value="CONTRACT">Contract</option>
          <option value="REMOTE">Remote</option>
        </select>
        <textarea style={styles.textarea} placeholder="Job Description *" rows={5}
          value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required />
        <textarea style={styles.textarea} placeholder="Requirements (optional)" rows={3}
          value={form.requirements} onChange={e => setForm({ ...form, requirements: e.target.value })} />
        {field('salary', 'Salary Range (e.g. ₹3-5 LPA)')}
        <button type="submit" style={styles.btn}>Post Job</button>
      </form>
    </div>
  );
};

const styles = {
  wrapper: { display: 'flex', justifyContent: 'center', padding: '40px 16px' },
  form: { background: '#fff', padding: '32px', borderRadius: '8px', boxShadow: '0 2px 12px rgba(0,0,0,0.1)', width: '100%', maxWidth: '560px', display: 'flex', flexDirection: 'column', gap: '12px' },
  input: { padding: '10px 14px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '1rem' },
  textarea: { padding: '10px 14px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '1rem', resize: 'vertical' },
  btn: { padding: '12px', background: '#2e7d32', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '1rem' },
  success: { color: '#2e7d32', background: '#e8f5e9', padding: '8px', borderRadius: '4px' },
  error: { color: '#c62828', background: '#ffebee', padding: '8px', borderRadius: '4px' },
};

export default PostJob;
