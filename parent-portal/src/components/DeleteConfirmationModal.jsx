import React, { useState } from 'react';
import { deleteChild } from '../services/children';

// DeleteConfirmationModal - confirms child deletion
// McCabe complexity: 3
export default function DeleteConfirmationModal({ child, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Handle delete confirmation
  // McCabe complexity: 2
  async function handleDelete() {
    setLoading(true);
    setError('');

    try {
      await deleteChild(child.userId);
      onSuccess(child.firstName);
      // onClose is handled by parent's onSuccess callback
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
          <h2 style={styles.title}>⚠️ Delete {child.firstName}?</h2>
          <button onClick={onClose} style={styles.closeButton}>×</button>
        </div>

        <div style={styles.content}>
          <p style={styles.message}>
            Are you sure you want to remove <strong>{child.firstName}</strong> from your family?
          </p>
          <p style={styles.submessage}>
            Their progress and data will be archived but not permanently deleted.
          </p>

          {error && (
            <div style={styles.errorMessage}>{error}</div>
          )}
        </div>

        <div style={styles.footer}>
          <button
            onClick={onClose}
            style={styles.cancelButton}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            style={styles.deleteButton}
            disabled={loading}
          >
            {loading ? 'Deleting...' : 'Yes, Delete'}
          </button>
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
    maxWidth: '500px',
    width: '90%',
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
    color: '#d32f2f'
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
  message: {
    fontSize: '16px',
    color: '#333',
    marginBottom: '12px',
    lineHeight: '1.5'
  },
  submessage: {
    fontSize: '14px',
    color: '#666',
    margin: 0,
    lineHeight: '1.5'
  },
  errorMessage: {
    padding: '12px',
    background: '#ffe6e6',
    border: '1px solid #ff4444',
    borderRadius: '8px',
    color: '#ff4444',
    fontSize: '14px',
    marginTop: '16px'
  },
  footer: {
    padding: '24px',
    borderTop: '1px solid #eee',
    display: 'flex',
    gap: '12px',
    justifyContent: 'flex-end'
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
  deleteButton: {
    padding: '12px 24px',
    background: '#d32f2f',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer'
  }
};
