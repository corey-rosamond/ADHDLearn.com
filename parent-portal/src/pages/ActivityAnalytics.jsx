import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getChildSessions, getChildAnalytics } from '../services/children';
import StatsCard from '../components/StatsCard';
import SessionTable from '../components/SessionTable';
import SessionDetailsModal from '../components/SessionDetailsModal';

// ActivityAnalytics page - game-specific analytics
// McCabe complexity: 4
export default function ActivityAnalytics() {
  const { childId, activityName } = useParams();
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);
  const [stats, setStats] = useState(null);
  const [child, setChild] = useState(null);
  const [selectedSession, setSelectedSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
  }, [childId, activityName]);

  // McCabe: 4
  async function loadData() {
    try {
      const decodedActivity = decodeURIComponent(activityName);

      const sessionsData = await getChildSessions(childId, {
        game: decodedActivity,
        limit: 100
      });

      setSessions(sessionsData.sessions || []);
      setStats(sessionsData.stats || {});
      setChild(sessionsData.child || {});
    } catch (err) {
      console.error('Failed to load activity data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // McCabe: 1
  const handleSessionClick = (session) => {
    setSelectedSession(session);
  };

  // McCabe: 1
  const handleCloseModal = () => {
    setSelectedSession(null);
  };

  if (loading) {
    return <div style={styles.loading}>Loading activity data...</div>;
  }

  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.error}>
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={() => navigate(`/children/${childId}/progress`)} style={styles.backButton}>
            Back to Progress
          </button>
        </div>
      </div>
    );
  }

  const activityDisplayName = decodeURIComponent(activityName);
  const avgSessionLength = stats.totalSessions > 0
    ? Math.round(stats.totalTimeMinutes * 60 / stats.totalSessions)
    : 0;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button onClick={() => navigate(`/children/${childId}/progress`)} style={styles.backButton}>
          ← Back
        </button>
        <h1 style={styles.title}>
          {activityDisplayName} Analytics 📚
        </h1>
      </div>

      <div style={styles.content}>
        {/* Summary Stats */}
        <div style={styles.statsGrid}>
          <StatsCard icon="📚" label="Total Sessions" value={stats.totalSessions || 0} />
          <StatsCard icon="⏱️" label="Total Time" value={`${stats.totalTimeMinutes || 0} min`} />
          <StatsCard icon="⏳" label="Avg Session Length" value={`${avgSessionLength}s`} />
          <StatsCard icon="📈" label="Average Score" value={stats.averageScore || 0} />
          <StatsCard icon="🎯" label="Average Accuracy" value={`${stats.averageAccuracy || 0}%`} />
          <StatsCard icon="⭐" label="Best Score" value={stats.bestScore || 0} />
        </div>

        {/* Session History */}
        <div style={styles.tableCard}>
          <h3 style={styles.cardTitle}>Session History</h3>
          <SessionTable sessions={sessions} onSessionClick={handleSessionClick} />
        </div>
      </div>

      {selectedSession && (
        <SessionDetailsModal session={selectedSession} onClose={handleCloseModal} />
      )}
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
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '16px'
  },
  tableCard: {
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
  }
};
