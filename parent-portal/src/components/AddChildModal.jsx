import React, { useState } from 'react';
import PinInput from './PinInput';
import AvatarPicker from './AvatarPicker';
import { addChild } from '../services/children';

// AddChildModal - modal for adding a new child
// McCabe complexity: 5
export default function AddChildModal({ familyId, onClose, onSuccess }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [avatar, setAvatar] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Validate PIN inputs
  // McCabe complexity: 4
  function validatePin() {
    if (!pinCode || pinCode.length !== 4) {
      return 'PIN must be exactly 4 digits';
    }

    if (!/^\d{4}$/.test(pinCode)) {
      return 'PIN must be numeric';
    }

    if (pinCode === '0000' || pinCode === '1111') {
      return 'PIN is too simple. Choose a different PIN for security.';
    }

    if (pinCode !== confirmPin) {
      return 'PINs do not match';
    }

    return null;
  }

  // Handle form submission
  // McCabe complexity: 4
  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    // Validate required fields
    if (!firstName || !birthDate || !avatar) {
      setError('Please fill in all required fields');
      return;
    }

    // Validate PIN
    const pinError = validatePin();
    if (pinError) {
      setError(pinError);
      return;
    }

    setLoading(true);

    try {
      const result = await addChild(familyId, {
        firstName,
        lastName: lastName || null,
        birthDate,
        avatar,
        pinCode
      });

      onSuccess(result.child);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <h2 style={styles.title}>Add a Child</h2>
          <button onClick={onClose} style={styles.closeButton}>×</button>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>
              First Name <span style={styles.required}>*</span>
            </label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Aurora"
              style={styles.input}
              required
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Last Name (optional)</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="(optional)"
              style={styles.input}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>
              Birth Date <span style={styles.required}>*</span>
            </label>
            <input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>
              Avatar <span style={styles.required}>*</span>
            </label>
            <AvatarPicker value={avatar} onChange={setAvatar} />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>
              PIN Code <span style={styles.required}>*</span>
            </label>
            <PinInput
              value={pinCode}
              onChange={setPinCode}
              error={error && error.includes('PIN') && !error.includes('match') ? error : ''}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>
              Confirm PIN <span style={styles.required}>*</span>
            </label>
            <PinInput
              value={confirmPin}
              onChange={setConfirmPin}
              error={error && error.includes('match') ? error : ''}
            />
          </div>

          {error && !error.includes('PIN') && (
            <div style={styles.errorMessage}>{error}</div>
          )}

          <div style={styles.footer}>
            <button
              type="button"
              onClick={onClose}
              style={styles.cancelButton}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={styles.submitButton}
              disabled={loading || !firstName || !birthDate || !avatar || pinCode.length !== 4 || confirmPin.length !== 4}
            >
              {loading ? 'Adding...' : 'Add Child'}
            </button>
          </div>
        </form>
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
  form: {
    padding: '24px'
  },
  field: {
    marginBottom: '24px'
  },
  label: {
    display: 'block',
    fontSize: '14px',
    fontWeight: '600',
    color: '#333',
    marginBottom: '8px'
  },
  required: {
    color: '#ff4444'
  },
  input: {
    width: '100%',
    padding: '12px',
    fontSize: '16px',
    border: '2px solid #ddd',
    borderRadius: '8px',
    outline: 'none',
    boxSizing: 'border-box'
  },
  errorMessage: {
    padding: '12px',
    background: '#ffe6e6',
    border: '1px solid #ff4444',
    borderRadius: '8px',
    color: '#ff4444',
    fontSize: '14px',
    marginBottom: '16px'
  },
  footer: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'flex-end',
    paddingTop: '16px',
    borderTop: '1px solid #eee'
  },
  cancelButton: {
    padding: '12px 24px',
    background: '#f5f5f5',
    color: '#666',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer'
  },
  submitButton: {
    padding: '12px 24px',
    background: '#667eea',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    opacity: 1
  }
};
