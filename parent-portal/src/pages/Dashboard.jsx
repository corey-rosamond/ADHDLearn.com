import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Dashboard page component
// McCabe complexity: 1
export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="dashboard-page" style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>ADHDLearn Parent Dashboard</h1>
        <button onClick={handleLogout} style={styles.logoutButton}>
          Log Out
        </button>
      </div>

      <div style={styles.content}>
        <div style={styles.welcomeCard}>
          <h2 style={styles.welcomeTitle}>
            Welcome back, {user?.firstName}!
          </h2>
          <p style={styles.welcomeText}>
            You're logged in to your {user?.familyId ? 'family' : ''} account.
          </p>
        </div>

        <div style={styles.infoCard}>
          <h3 style={styles.cardTitle}>Account Information</h3>
          <div style={styles.infoGrid}>
            <div style={styles.infoItem}>
              <span style={styles.infoLabel}>Name:</span>
              <span style={styles.infoValue}>{user?.firstName}</span>
            </div>
            <div style={styles.infoItem}>
              <span style={styles.infoLabel}>Email:</span>
              <span style={styles.infoValue}>{user?.email}</span>
            </div>
            <div style={styles.infoItem}>
              <span style={styles.infoLabel}>Role:</span>
              <span style={styles.infoValue}>{user?.role}</span>
            </div>
            <div style={styles.infoItem}>
              <span style={styles.infoLabel}>Family ID:</span>
              <span style={styles.infoValue}>{user?.familyId}</span>
            </div>
          </div>
        </div>

        <div style={styles.placeholderCard}>
          <h3 style={styles.cardTitle}>Coming Soon</h3>
          <p style={styles.placeholderText}>
            ✨ Child management<br/>
            ✨ Game progress tracking<br/>
            ✨ Learning analytics<br/>
            ✨ Reward system<br/>
          </p>
          <p style={styles.phaseNote}>
            Phase 4 Complete: Authentication Working! 🎉<br/>
            Next features coming in Phase 5-36
          </p>
        </div>
      </div>
    </div>
  );
}

// Inline styles
const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '20px'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    maxWidth: '1200px',
    margin: '0 auto 40px',
    padding: '20px',
    background: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
  },
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#333',
    margin: 0
  },
  logoutButton: {
    padding: '10px 20px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#667eea',
    background: '#ffffff',
    border: '2px solid #667eea',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  content: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'grid',
    gap: '20px'
  },
  welcomeCard: {
    background: '#ffffff',
    borderRadius: '12px',
    padding: '40px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    textAlign: 'center'
  },
  welcomeTitle: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#667eea',
    marginBottom: '12px'
  },
  welcomeText: {
    fontSize: '18px',
    color: '#666'
  },
  infoCard: {
    background: '#ffffff',
    borderRadius: '12px',
    padding: '32px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
  },
  cardTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '20px'
  },
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '16px'
  },
  infoItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  },
  infoLabel: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#999',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  infoValue: {
    fontSize: '16px',
    color: '#333',
    fontWeight: '500'
  },
  placeholderCard: {
    background: '#ffffff',
    borderRadius: '12px',
    padding: '32px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    textAlign: 'center'
  },
  placeholderText: {
    fontSize: '16px',
    color: '#666',
    lineHeight: '2',
    marginBottom: '20px'
  },
  phaseNote: {
    fontSize: '14px',
    color: '#999',
    fontStyle: 'italic',
    lineHeight: '1.6'
  }
};
