import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ChildDashboard.css';

/**
 * ChildDashboard Page
 *
 * Main dashboard for child after successful login
 * Shows: Welcome message, games available (Letter Pop for now)
 *
 * McCabe complexity: 3
 */
function ChildDashboard() {
  const [child, setChild] = useState(null);
  const navigate = useNavigate();

  // Load child data from localStorage
  // McCabe complexity: 2
  useEffect(() => {
    const token = localStorage.getItem('childToken');
    const childData = localStorage.getItem('childData');

    if (!token || !childData) {
      // Not logged in, redirect to login
      navigate('/');
      return;
    }

    try {
      setChild(JSON.parse(childData));
    } catch (err) {
      console.error('Error parsing child data:', err);
      navigate('/');
    }
  }, [navigate]);

  // Handle logout
  // McCabe complexity: 1
  const handleLogout = () => {
    localStorage.removeItem('childToken');
    localStorage.removeItem('childData');
    navigate('/');
  };

  // Handle game launch
  // McCabe complexity: 1
  const handlePlayGame = () => {
    // Navigate to Letter Pop game
    navigate('/letter-pop');
  };

  // Handle settings
  // McCabe complexity: 1
  const handleSettings = () => {
    navigate('/settings');
  };

  if (!child) {
    return (
      <div className="child-dashboard loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="child-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div className="welcome-section">
          <div className="child-avatar-large">
            {child.avatar || '👤'}
          </div>
          <h1>Welcome back, {child.firstName}! 🌈</h1>
          <p>Ready to learn and play?</p>
        </div>

        <div className="header-buttons">
          <button className="settings-button" onClick={handleSettings}>
            ⚙️ Settings
          </button>
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      {/* Games Grid */}
      <div className="games-section">
        <h2>Your Games</h2>

        <div className="games-grid">
          {/* Letter Pop Game */}
          <button className="game-card" onClick={handlePlayGame}>
            <div className="game-icon">🔤</div>
            <div className="game-title">Letter Pop</div>
            <div className="game-description">Pop the right letters!</div>
            <div className="play-button">▶ Play Now</div>
          </button>

          {/* More games coming soon */}
          <div className="game-card disabled">
            <div className="game-icon">🔢</div>
            <div className="game-title">Number Fun</div>
            <div className="game-description">Coming Soon!</div>
          </div>

          <div className="game-card disabled">
            <div className="game-icon">📝</div>
            <div className="game-title">Word Builder</div>
            <div className="game-description">Coming Soon!</div>
          </div>
        </div>
      </div>

      {/* Stats Section (placeholder for future) */}
      <div className="stats-section">
        <h2>Your Progress</h2>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-value">🌟</div>
            <div className="stat-label">Keep Playing!</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChildDashboard;
