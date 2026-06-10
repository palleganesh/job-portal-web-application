import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../services/api';
import { useAuth } from '../AuthContext';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await login(form);
      const { token, ...user } = res.data;
      loginUser(user, token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div style={styles.wrapper}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2>Login</h2>
        {error && <p style={styles.error}>{error}</p>}
        <input style={styles.input} type="email" placeholder="Email"
          value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
        <input style={styles.input} type="password" placeholder="Password"
          value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
        <button style={styles.btn} type="submit">Login</button>
        <p style={{ textAlign: 'center' }}>No account? <Link to="/register">Register</Link></p>
      </form>
    </div>
  );
};

const styles = {
  wrapper: { display: 'flex', justifyContent: 'center', padding: '40px 16px' },
  form: { background: '#fff', padding: '32px', borderRadius: '8px', boxShadow: '0 2px 12px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '12px' },
  input: { padding: '10px 14px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '1rem' },
  btn: { padding: '12px', background: '#1565c0', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '1rem' },
  error: { color: '#c62828', background: '#ffebee', padding: '8px', borderRadius: '4px', fontSize: '0.9rem' },
};

export default Login;
