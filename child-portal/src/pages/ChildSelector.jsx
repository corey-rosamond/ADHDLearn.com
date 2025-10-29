import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getChildren } from '../services/api';
import DeviceRegistration from './DeviceRegistration';
import './ChildSelector.css';

/**
 * ChildSelector Page
 *
 * Shows all children in the family with their avatars
 * Child clicks their avatar to proceed to PIN entry
 * Device registration: Stores familyId in localStorage for single-family tablets
 *
 * McCabe complexity: 5
 */
function ChildSelector() {
  const [children, setChildren] = useState([]);
  const [familyName, setFamilyName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Get or set familyId (device registration)
  // McCabe complexity: 3
  const getFamilyId = () => {
    // Check localStorage first
    let familyId = localStorage.getItem('familyId');

    if (!familyId) {
      // Check URL parameter for initial setup (?family=1)
      const params = new URLSearchParams(window.location.search);
      familyId = params.get('family');

      if (familyId) {
        // Register this device to the family
        localStorage.setItem('familyId', familyId);
      }
    }

    return familyId;
  };

  // Fetch children from API
  // McCabe complexity: 3
  useEffect(() => {
    async function fetchChildren() {
      try {
        const familyId = getFamilyId();

        if (!familyId) {
          setError('Device not registered. Please ask a parent to set up this device.');
          setLoading(false);
          return;
        }

        const data = await getChildren(familyId);

        if (data.success) {
          setChildren(data.children);
          // Extract family name from API response
          if (data.familyName) {
            setFamilyName(data.familyName);
          }
        } else {
          setError('Could not load children');
        }
      } catch (err) {
        console.error('Error fetching children:', err);
        setError('Connection error');
      } finally {
        setLoading(false);
      }
    }

    fetchChildren();
  }, []);

  // Handle child selection
  // McCabe complexity: 1
  const handleChildClick = (child) => {
    // Navigate to PIN entry with child info
    navigate('/pin-entry', { state: { child } });
  };

  // Handle device unregistration (forget this device)
  // McCabe complexity: 1
  const handleForgetDevice = () => {
    if (confirm('Are you sure you want to forget this device? You will need to set it up again.')) {
      localStorage.removeItem('familyId');
      window.location.reload();
    }
  };

  // Handle successful device registration
  // McCabe complexity: 1
  const handleDeviceRegistered = () => {
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="child-selector loading">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (error && !getFamilyId()) {
    // Device not registered - show registration page
    return <DeviceRegistration onRegistered={handleDeviceRegistered} />;
  }

  if (error) {
    return (
      <div className="child-selector error">
        <p>❌ {error}</p>
        <button onClick={() => window.location.reload()}>Try Again</button>
      </div>
    );
  }

  return (
    <div className="child-selector">
      <div className="child-selector-header">
        <h1>Who wants to play today? 🌈</h1>
        <p>Tap your avatar to get started!</p>
        {familyName && (
          <p className="family-name">
            {familyName} Family
          </p>
        )}
      </div>

      <div className="child-grid">
        {children.map((child) => (
          <button
            key={child.userId}
            className="child-card"
            onClick={() => handleChildClick(child)}
            aria-label={`Login as ${child.firstName}`}
          >
            <div className="child-avatar">
              {child.avatarUrl || '👤'}
            </div>
            <div className="child-name">{child.firstName}</div>
          </button>
        ))}
      </div>

      {children.length === 0 && (
        <div className="no-children">
          <p>No children found. Please ask a parent to add you!</p>
        </div>
      )}

      {getFamilyId() && (
        <button className="forget-device-button" onClick={handleForgetDevice}>
          Forget this device
        </button>
      )}
    </div>
  );
}

export default ChildSelector;
