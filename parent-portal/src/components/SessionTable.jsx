import React from 'react';

// SessionTable component - displays session history
// McCabe complexity: 3
export default function SessionTable({ sessions, onSessionClick }) {
  // McCabe: 2
  function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  }

  // McCabe: 2
  function formatDuration(seconds) {
    if (!seconds) return '0s';
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return minutes > 0 ? `${minutes}m ${secs}s` : `${secs}s`;
  }

  if (!sessions || sessions.length === 0) {
    return <p style={styles.emptyText}>No sessions recorded yet</p>;
  }

  return (
    <div style={styles.tableWrapper}>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Date</th>
            <th style={styles.th}>Game</th>
            <th style={styles.th}>Score</th>
            <th style={styles.th}>Accuracy</th>
            <th style={styles.th}>Duration</th>
          </tr>
        </thead>
        <tbody>
          {sessions.map((session, index) => (
            <tr
              key={session.sessionId}
              style={{
                ...(index % 2 === 0 ? styles.trEven : styles.trOdd),
                ...(onSessionClick ? styles.clickable : {})
              }}
              onClick={() => onSessionClick && onSessionClick(session)}
            >
              <td style={styles.td}>{formatDate(session.playedAt)}</td>
              <td style={styles.td}>{session.gameName}</td>
              <td style={styles.td}>{session.score}</td>
              <td style={styles.td}>{session.accuracyPercentage}%</td>
              <td style={styles.td}>{formatDuration(session.durationSeconds)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const styles = {
  emptyText: {
    textAlign: 'center',
    color: '#999',
    padding: '40px',
    margin: 0
  },
  tableWrapper: {
    overflowX: 'auto'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse'
  },
  th: {
    padding: '12px',
    textAlign: 'left',
    borderBottom: '2px solid #eee',
    fontSize: '14px',
    fontWeight: '600',
    color: '#666'
  },
  td: {
    padding: '12px',
    fontSize: '14px',
    color: '#333'
  },
  trEven: {
    background: '#f9f9f9'
  },
  trOdd: {
    background: '#fff'
  },
  clickable: {
    cursor: 'pointer',
    transition: 'background 0.2s',
    ':hover': {
      background: '#e8f4ff'
    }
  }
};
