import React from 'react';

// SessionDetailsModal - shows detailed info for a single session
// McCabe complexity: 3
export default function SessionDetailsModal({ session, onClose }) {
  if (!session) return null;

  // McCabe: 2
  function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  }

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <h2 style={styles.title}>Session Details</h2>
          <button onClick={onClose} style={styles.closeButton}>×</button>
        </div>

        <div style={styles.content}>
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Session Information</h3>
            <div style={styles.info}>
              <div style={styles.infoRow}>
                <span style={styles.label}>Session ID:</span>
                <span style={styles.value}>{session.sessionId}</span>
              </div>
              <div style={styles.infoRow}>
                <span style={styles.label}>Date & Time:</span>
                <span style={styles.value}>{formatDate(session.playedAt)}</span>
              </div>
              <div style={styles.infoRow}>
                <span style={styles.label}>Game:</span>
                <span style={styles.value}>{session.gameName}</span>
              </div>
            </div>
          </div>

          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Performance</h3>
            <div style={styles.statsGrid}>
              <div style={styles.statBox}>
                <div style={styles.statLabel}>Score</div>
                <div style={styles.statValue}>{session.score}</div>
              </div>
              <div style={styles.statBox}>
                <div style={styles.statLabel}>Accuracy</div>
                <div style={styles.statValue}>{session.accuracyPercentage}%</div>
              </div>
              <div style={styles.statBox}>
                <div style={styles.statLabel}>Correct</div>
                <div style={styles.statValue}>{session.correctAttempts || 'N/A'}</div>
              </div>
              <div style={styles.statBox}>
                <div style={styles.statLabel}>Total</div>
                <div style={styles.statValue}>{session.totalAttempts || 'N/A'}</div>
              </div>
            </div>
          </div>

          {session.mode && (
            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>Settings</h3>
              <div style={styles.info}>
                <div style={styles.infoRow}>
                  <span style={styles.label}>Mode:</span>
                  <span style={styles.value}>{session.mode}</span>
                </div>
                <div style={styles.infoRow}>
                  <span style={styles.label}>Duration:</span>
                  <span style={styles.value}>{session.durationSeconds} seconds</span>
                </div>
              </div>
            </div>
          )}

          <div style={styles.footer}>
            <button onClick={onClose} style={styles.button}>Close</button>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000
  },
  modal: {
    background: '#fff',
    borderRadius: '12px',
    maxWidth: '600px',
    width: '90%',
    maxHeight: '90vh',
    overflow: 'auto',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)'
  },
  header: {
    padding: '24px',
    borderBottom: '1px solid #eee',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  title: {
    margin: 0,
    fontSize: '24px',
    fontWeight: '600',
    color: '#333'
  },
  closeButton: {
    background: 'none',
    border: 'none',
    fontSize: '32px',
    color: '#999',
    cursor: 'pointer',
    padding: 0,
    width: '32px',
    height: '32px',
    lineHeight: '32px'
  },
  content: {
    padding: '24px'
  },
  section: {
    marginBottom: '24px'
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#333',
    marginBottom: '16px'
  },
  info: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  infoRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '8px',
    background: '#f9f9f9',
    borderRadius: '6px'
  },
  label: {
    fontSize: '14px',
    color: '#666',
    fontWeight: '600'
  },
  value: {
    fontSize: '14px',
    color: '#333'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '16px'
  },
  statBox: {
    padding: '16px',
    background: '#f9f9f9',
    borderRadius: '8px',
    textAlign: 'center'
  },
  statLabel: {
    fontSize: '12px',
    color: '#666',
    marginBottom: '8px'
  },
  statValue: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#667eea'
  },
  footer: {
    paddingTop: '16px',
    borderTop: '1px solid #eee',
    display: 'flex',
    justifyContent: 'flex-end'
  },
  button: {
    padding: '12px 24px',
    background: '#667eea',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer'
  }
};
