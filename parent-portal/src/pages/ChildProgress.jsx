import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getChildSessions, getChildAnalytics } from '../services/children';
import StatsCard from '../components/StatsCard';
import SessionTable from '../components/SessionTable';
import SessionDetailsModal from '../components/SessionDetailsModal';

// ChildProgress page (refactored with components)
// McCabe complexity: all functions ≤ 4
export default function ChildProgress() {
  const { childId } = useParams();
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);
  const [stats, setStats] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [selectedSession, setSelectedSession] = useState(null);
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

  // McCabe: 1
  const handleSessionClick = (session) => {
    setSelectedSession(session);
  };

  // McCabe: 1
  const handleCloseModal = () => {
    setSelectedSession(null);
  };

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
          <StatsCard icon="📚" label="Total Sessions" value={stats?.totalSessions || 0} />
          <StatsCard icon="⏱️" label="Total Time" value={`${stats?.totalTimeMinutes || 0} min`} />
          <StatsCard icon="📈" label="Avg Score" value={stats?.averageScore || 0} />
          <StatsCard icon="🎯" label="Avg Accuracy" value={`${stats?.averageAccuracy || 0}%`} />
        </div>

        {/* Favorite Activity & Streaks */}
        {(analytics?.favoriteActivity || analytics?.currentStreak > 0) && (
          <div style={styles.infoCard}>
            <h3 style={styles.cardTitle}>Quick Stats</h3>
            <div style={styles.infoGrid}>
              {analytics?.favoriteActivity && (
                <div>
                  <span style={styles.infoLabel}>Favorite Activity:</span>
                  <span style={styles.favoriteText}> {analytics.favoriteActivity}</span>
                </div>
              )}
              {analytics?.currentStreak > 0 && (
                <div>
                  <span style={styles.infoLabel}>Current Streak:</span>
                  <span style={styles.favoriteText}> {analytics.currentStreak} days 🔥</span>
                </div>
              )}
              {analytics?.longestStreak > 0 && (
                <div>
                  <span style={styles.infoLabel}>Longest Streak:</span>
                  <span style={styles.favoriteText}> {analytics.longestStreak} days ⭐</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Confusion Pairs */}
        {analytics?.confusionPairs && analytics.confusionPairs.length > 0 && (
          <div style={styles.infoCard}>
            <h3 style={styles.cardTitle}>Most Common Mistakes</h3>
            <div style={styles.confusionList}>
              {analytics.confusionPairs.map((pair, index) => (
                <div key={index} style={styles.confusionItem}>
                  <span style={styles.confusionLetters}>{pair.letter1} ↔ {pair.letter2}</span>
                  <span style={styles.confusionCount}>{pair.count} times ({pair.percentage}%)</span>
                </div>
              ))}
            </div>
            {analytics.confusionPairs[0] && (
              <p style={styles.insight}>
                💡 Insight: {child.firstName} frequently confuses {analytics.confusionPairs[0].letter1} and {analytics.confusionPairs[0].letter2} ({analytics.confusionPairs[0].count} times).
                This is common in early readers. Consider focused practice on these letters.
              </p>
            )}
          </div>
        )}

        {/* Session History */}
        <div style={styles.tableCard}>
          <h3 style={styles.cardTitle}>Recent Sessions</h3>
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
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px'
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
  infoGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  infoLabel: {
    fontSize: '14px',
    color: '#666',
    fontWeight: '600'
  },
  favoriteText: {
    fontSize: '16px',
    color: '#667eea',
    fontWeight: '600'
  },
  confusionList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginBottom: '16px'
  },
  confusionItem: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '12px',
    background: '#f9f9f9',
    borderRadius: '8px'
  },
  confusionLetters: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#333'
  },
  confusionCount: {
    fontSize: '14px',
    color: '#666'
  },
  insight: {
    padding: '16px',
    background: '#fff4e1',
    borderLeft: '4px solid #ffa500',
    borderRadius: '8px',
    fontSize: '14px',
    color: '#666',
    lineHeight: '1.6',
    margin: 0
  },
  tableCard: {
    background: '#fff',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
  }
};
