import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getChildSessions, getChildAnalytics } from '../services/children';

// ChildProgress page
// McCabe complexity: all functions ≤ 4
export default function ChildProgress() {
  const { childId } = useParams();
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);
  const [stats, setStats] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
  }, [childId]);

  // McCabe: 4
  async function loadData() {
    try {
      const [sessionsData, analyticsData] = await Promise.all([
        getChildSessions(childId, { limit: 20 }),
        getChildAnalytics(childId)
      ]);

      setSessions(sessionsData.sessions || []);
      setStats(sessionsData.stats || {});
      setAnalytics(analyticsData || {});
    } catch (err) {
      console.error('Failed to load child data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

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

  if (loading) {
    return <div style={styles.loading}>Loading child data...</div>;
  }

  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.error}>
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={() => navigate('/dashboard')} style={styles.backButton}>
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const child = analytics?.child || {};

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button onClick={() => navigate('/dashboard')} style={styles.backButton}>
          ← Back to Dashboard
        </button>
        <h1 style={styles.title}>
          {child.firstName}'s Progress {child.avatar || ''}
        </h1>
      </div>

      <div style={styles.content}>
        {/* Stats Overview */}
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={styles.statIcon}>📚</div>
            <div style={styles.statLabel}>Total Sessions</div>
            <div style={styles.statValue}>{stats?.totalSessions || 0}</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statIcon}>⏱️</div>
            <div style={styles.statLabel}>Total Time</div>
            <div style={styles.statValue}>{stats?.totalTimeMinutes || 0} min</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statIcon}>📈</div>
            <div style={styles.statLabel}>Avg Score</div>
            <div style={styles.statValue}>{stats?.averageScore || 0}</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statIcon}>🎯</div>
            <div style={styles.statLabel}>Avg Accuracy</div>
            <div style={styles.statValue}>{stats?.averageAccuracy || 0}%</div>
          </div>
        </div>

        {/* Favorite Activity */}
        {analytics?.favoriteActivity && (
          <div style={styles.infoCard}>
            <h3 style={styles.cardTitle}>Favorite Activity</h3>
            <p style={styles.favoriteText}>{analytics.favoriteActivity}</p>
          </div>
        )}

        {/* Session History */}
        <div style={styles.tableCard}>
          <h3 style={styles.cardTitle}>Recent Sessions</h3>

          {sessions.length === 0 ? (
            <p style={styles.emptyText}>No sessions recorded yet</p>
          ) : (
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
                    <tr key={session.sessionId} style={index % 2 === 0 ? styles.trEven : styles.trOdd}>
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
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '20px'
  },
  loading: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px',
    color: '#fff'
  },
  error: {
    maxWidth: '600px',
    margin: '100px auto',
    background: '#fff',
    borderRadius: '12px',
    padding: '40px',
    textAlign: 'center'
  },
  header: {
    maxWidth: '1200px',
    margin: '0 auto 40px',
    display: 'flex',
    alignItems: 'center',
    gap: '20px'
  },
  backButton: {
    padding: '12px 20px',
    background: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    color: '#667eea',
    cursor: 'pointer'
  },
  title: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#fff',
    margin: 0,
    flex: 1
  },
  content: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px'
  },
  statCard: {
    background: '#fff',
    borderRadius: '12px',
    padding: '24px',
    textAlign: 'center',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
  },
  statIcon: {
    fontSize: '32px',
    marginBottom: '8px'
  },
  statLabel: {
    fontSize: '14px',
    color: '#666',
    marginBottom: '8px'
  },
  statValue: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#667eea'
  },
  infoCard: {
    background: '#fff',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
  },
  cardTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#333',
    margin: '0 0 16px'
  },
  favoriteText: {
    fontSize: '18px',
    color: '#667eea',
    fontWeight: '600',
    margin: 0
  },
  tableCard: {
    background: '#fff',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
  },
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
  }
};
