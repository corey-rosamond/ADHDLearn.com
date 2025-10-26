import React from 'react';

// StatsCard component - displays a single stat metric
// McCabe complexity: 1
export default function StatsCard({ icon, label, value }) {
  return (
    <div style={styles.card}>
      <div style={styles.icon}>{icon}</div>
      <div style={styles.label}>{label}</div>
      <div style={styles.value}>{value}</div>
    </div>
  );
}

const styles = {
  card: {
    background: '#fff',
    borderRadius: '12px',
    padding: '24px',
    textAlign: 'center',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
  },
  icon: {
    fontSize: '32px',
    marginBottom: '8px'
  },
  label: {
    fontSize: '14px',
    color: '#666',
    marginBottom: '8px'
  },
  value: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#667eea'
  }
};
