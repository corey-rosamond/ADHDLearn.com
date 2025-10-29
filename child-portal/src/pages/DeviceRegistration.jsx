import { useState } from 'react';
import PropTypes from 'prop-types';
import './DeviceRegistration.css';

/**
 * DeviceRegistration Page
 *
 * Parent login form to register device to a family
 * One-time setup for single-family tablets
 *
 * McCabe complexity: 4
 */
function DeviceRegistration({ onRegistered }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Handle parent login and device registration
  // McCabe complexity: 4
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const apiBase = import.meta.env.VITE_API_BASE || 'https://api.adhdlearn.com';
      const response = await fetch(apiBase + '/api/auth/login/parent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (data.success && data.user && data.user.familyId) {
        // Register device to this family
        localStorage.setItem('familyId', data.user.familyId);
        onRegistered();
      } else {
        setError('Invalid email or password. Please try again.');
      }
    } catch (err) {
      console.error('Parent login error:', err);
      setError('Connection error. Please check your internet and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="device-registration">
      <div className="registration-container">
        <h1>🎮 Welcome to ADHDLearn!</h1>
        <p className="subtitle">Register this device to get started</p>

        <div className="registration-card">
          <h2>Parents: Please log in</h2>
          <p>Enter your parent account credentials to set up this device for your family.</p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                autoComplete="email"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                autoComplete="current-password"
                disabled={loading}
              />
            </div>

            {error && (
              <div className="error-message">
                ⚠️ {error}
              </div>
            )}

            <button
              type="submit"
              className="register-button"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Register This Device'}
            </button>
          </form>

          <div className="help-text">
            <p>Don't have an account?</p>
            <p>Visit <strong>parent-staging.adhdlearn.com</strong> to sign up</p>
          </div>
        </div>
      </div>
    </div>
  );
}

DeviceRegistration.propTypes = {
  onRegistered: PropTypes.func.isRequired,
};

export default DeviceRegistration;
