import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getJobs } from '../services/api';

const Home = () => {
  const [jobs, setJobs] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchJobs = async (kw = '') => {
    setLoading(true);
    try {
      const res = await getJobs(kw);
      setJobs(res.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => { fetchJobs(); }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchJobs(keyword);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Find Your Dream Job</h2>
      <form onSubmit={handleSearch} style={styles.searchBar}>
        <input
          type="text"
          placeholder="Search by title, company, or keyword..."
          value={keyword}
          onChange={e => setKeyword(e.target.value)}
          style={styles.input}
        />
        <button type="submit" style={styles.btn}>Search</button>
      </form>

      {loading ? <p>Loading jobs...</p> : (
        <div style={styles.grid}>
          {jobs.length === 0 ? <p>No jobs found.</p> : jobs.map(job => (
            <div key={job.id} style={styles.card}>
              <h3 style={styles.title}>{job.title}</h3>
              <p style={styles.company}>{job.company}</p>
              <p style={styles.meta}>📍 {job.location} &nbsp;|&nbsp; 💼 {job.jobType?.replace('_', ' ')}</p>
              {job.salary && <p style={styles.salary}>💰 {job.salary}</p>}
              <p style={styles.apps}>{job.applicationCount} applicant(s)</p>
              <Link to={`/jobs/${job.id}`} style={styles.viewBtn}>View Details →</Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: { padding: '24px' },
  heading: { fontSize: '1.8rem', marginBottom: '16px' },
  searchBar: { display: 'flex', gap: '8px', marginBottom: '24px' },
  input: { flex: 1, padding: '10px 14px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '1rem' },
  btn: { padding: '10px 20px', background: '#1565c0', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' },
  card: { background: '#fff', border: '1px solid #e0e0e0', borderRadius: '8px', padding: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.06)' },
  title: { margin: '0 0 6px', fontSize: '1.1rem', color: '#1a237e' },
  company: { margin: '0 0 8px', color: '#555', fontWeight: '600' },
  meta: { fontSize: '0.85rem', color: '#666', margin: '0 0 6px' },
  salary: { fontSize: '0.85rem', color: '#2e7d32', margin: '0 0 6px' },
  apps: { fontSize: '0.8rem', color: '#999', margin: '0 0 12px' },
  viewBtn: { display: 'inline-block', color: '#1565c0', fontWeight: '600', textDecoration: 'none', fontSize: '0.9rem' },
};

export default Home;
