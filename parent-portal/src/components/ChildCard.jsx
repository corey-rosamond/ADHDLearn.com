import React from 'react';
import { useNavigate } from 'react-router-dom';

// ChildCard component
// McCabe complexity: 2
export default function ChildCard({ child }) {
  const navigate = useNavigate();

  const handleViewProgress = () => {
    navigate(`/children/${child.userId}/progress`);
  };

  // Calculate age from birth date
  const age = child.birthDate
    ? Math.floor((Date.now() - new Date(child.birthDate)) / (365.25 * 24 * 60 * 60 * 1000))
    : null;

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <div style={styles.avatar}>
          {child.avatarUrl || child.firstName?.[0] || '👤'}
        </div>
        <div style={styles.info}>
          <h3 style={styles.name}>{child.firstName} {child.lastName}</h3>
          {age && <p style={styles.age}>Age: {age} years old</p>}
        </div>
      </div>

      <div style={styles.stats}>
        <div style={styles.statItem}>
          <span style={styles.statLabel}>Points</span>
          <span style={styles.statValue}>{child.totalPoints || 0}</span>
        </div>
        <div style={styles.statItem}>
          <span style={styles.statLabel}>Streak</span>
          <span style={styles.statValue}>{child.currentStreak || 0} days</span>
        </div>
      </div>

      <button onClick={handleViewProgress} style={styles.button}>
        View Progress
      </button>
    </div>
  );
}

const styles = {
  card: {
    background: '#ffffff',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px'
  },
  avatar: {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#fff'
  },
  info: {
    flex: 1
  },
  name: {
    margin: 0,
    fontSize: '20px',
    fontWeight: '600',
    color: '#333'
  },
  age: {
    margin: '4px 0 0',
    fontSize: '14px',
    color: '#666'
  },
  stats: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px'
  },
  statItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  },
  statLabel: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#999',
    textTransform: 'uppercase'
  },
  statValue: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#667eea'
  },
  button: {
    padding: '12px',
    background: '#667eea',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s'
  }
};
