import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { loginChild } from '../services/api';
import NumberPad from '../components/NumberPad';
import './PinEntry.css';

/**
 * PinEntry Page
 *
 * Child enters their 4-digit PIN to log in
 * Features: PIN dots, auto-submit, gentle error feedback
 *
 * McCabe complexity: 5
 */
function PinEntry() {
  const location = useLocation();
  const navigate = useNavigate();
  const child = location.state?.child;

  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);

  // Redirect if no child data
  if (!child) {
    navigate('/');
    return null;
  }

  // Handle digit entry
  // McCabe complexity: 2
  const handleDigit = async (digit) => {
    if (pin.length >= 4) return;

    const newPin = pin + digit;
    setPin(newPin);
    setError('');

    // Auto-submit when 4 digits entered
    if (newPin.length === 4) {
      await submitPin(newPin);
    }
  };

  // Handle clear PIN
  // McCabe complexity: 1
  const handleClear = () => {
    setPin('');
    setError('');
  };

  // Handle back to child selector
  // McCabe complexity: 1
  const handleBack = () => {
    navigate('/');
  };

  // Submit PIN to backend
  // McCabe complexity: 3
  const submitPin = async (pinCode) => {
    setLoading(true);

    try {
      const data = await loginChild(child.userId, pinCode);

      if (data.success) {
        // Store token in localStorage
        localStorage.setItem('childToken', data.token);
        localStorage.setItem('childData', JSON.stringify(data.child));

        // Navigate to dashboard
        navigate('/dashboard');
      } else {
        // Show error with shake animation
        setError('Oops! That\'s not the right PIN. Try again! 🤔');
        setPin('');
        setShake(true);
        setTimeout(() => setShake(false), 500);
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Connection error. Please try again.');
      setPin('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pin-entry">
      <div className="pin-entry-header">
        <h1>Hi {child.firstName}! {child.avatarUrl || '👋'}</h1>
        <p>Enter your secret PIN</p>
      </div>

      {/* PIN Dots */}
      <div className={`pin-dots ${shake ? 'shake' : ''} ${error ? 'error' : ''}`}>
        {[0, 1, 2, 3].map((index) => (
          <div
            key={index}
            className={`pin-dot ${index < pin.length ? 'filled' : ''}`}
          />
        ))}
      </div>

      {/* Error Message */}
      {error && (
        <div className="pin-error">
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="pin-loading">
          <div className="spinner"></div>
          <p>Checking PIN...</p>
        </div>
      )}

      {/* Number Pad */}
      {!loading && (
        <NumberPad
          onDigit={handleDigit}
          onClear={handleClear}
          onBack={handleBack}
        />
      )}
    </div>
  );
}

export default PinEntry;
