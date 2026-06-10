import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const Navbar = () => {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate('/');
  };

  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.brand}>JobPortal</Link>
      <div style={styles.links}>
        <Link to="/" style={styles.link}>Jobs</Link>
        {user ? (
          <>
            <Link to="/dashboard" style={styles.link}>Dashboard</Link>
            {(user.role === 'RECRUITER' || user.role === 'ADMIN') && (
              <Link to="/post-job" style={styles.link}>Post Job</Link>
            )}
            <span style={styles.userInfo}>Hi, {user.name}</span>
            <button onClick={handleLogout} style={styles.btn}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" style={styles.link}>Login</Link>
            <Link to="/register" style={styles.link}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

const styles = {
  nav: { display: 'flex', alignItems: 'center', justifyContent: 'space-between',
         padding: '12px 24px', background: '#1a1a2e', color: '#fff' },
  brand: { fontSize: '1.4rem', fontWeight: 'bold', color: '#4fc3f7', textDecoration: 'none' },
  links: { display: 'flex', alignItems: 'center', gap: '16px' },
  link: { color: '#fff', textDecoration: 'none', fontSize: '0.95rem' },
  userInfo: { color: '#90caf9', fontSize: '0.9rem' },
  btn: { background: '#ef5350', color: '#fff', border: 'none',
         padding: '6px 14px', borderRadius: '4px', cursor: 'pointer' },
};

export default Navbar;
