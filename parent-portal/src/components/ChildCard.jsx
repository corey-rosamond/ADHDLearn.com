import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EditChildModal from './EditChildModal';
import DeleteConfirmationModal from './DeleteConfirmationModal';

// ChildCard component
// McCabe complexity: 3
export default function ChildCard({ child, onUpdate, onShowToast }) {
  const navigate = useNavigate();
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const handleViewProgress = () => {
    navigate(`/children/${child.userId}/progress`);
  };

  const handleEdit = () => {
    setShowEdit(true);
  };

  const handleDelete = () => {
    setShowDelete(true);
  };

  const handleUpdateSuccess = async (childName) => {
    setShowEdit(false);
    // Show toast before update to avoid timing issues
    if (onShowToast) onShowToast(`${childName}'s profile updated successfully!`);
    // Small delay to ensure toast is set before update
    await new Promise(resolve => setTimeout(resolve, 50));
    if (onUpdate) await onUpdate();
  };

  const handleDeleteSuccess = async (childName) => {
    setShowDelete(false);
    // Show toast before update to avoid timing issues
    if (onShowToast) onShowToast(`${childName} removed from family successfully!`);
    // Small delay to ensure toast is set before update
    await new Promise(resolve => setTimeout(resolve, 50));
    if (onUpdate) await onUpdate();
  };

  // Calculate age from birth date
  const age = child.birthDate
    ? Math.floor((Date.now() - new Date(child.birthDate)) / (365.25 * 24 * 60 * 60 * 1000))
    : null;

  // Format last active time
  const formatLastActive = (dateString) => {
    if (!dateString) return 'Never';

    const now = new Date();
    const lastActive = new Date(dateString);
    const diffMs = now - lastActive;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} min${diffMins !== 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    return lastActive.toLocaleDateString();
  };

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <div style={styles.avatar}>
          {child.avatarUrl || child.firstName?.[0] || '👤'}
        </div>
        <div style={styles.info}>
          <h3 style={styles.name}>{child.firstName} {child.lastName}</h3>
          {age && <p style={styles.age}>Age: {age} years old</p>}
          <p style={styles.lastActive}>Last active: {formatLastActive(child.lastActive)}</p>
        </div>
      </div>

      <div style={styles.stats}>
        <div style={styles.statItem}>
          <span style={styles.statLabel}>Points</span>
          <span style={styles.statValue}>{child.totalPoints || 0}</span>
        </div>
        <div style={styles.statItem}>
          <span style={styles.statLabel}>Streak</span>
          <span style={styles.statValue}>{child.currentStreak || 0} days</span>
        </div>
      </div>

      <div style={styles.buttonGroup}>
        <button onClick={handleViewProgress} style={styles.button}>
          View Progress
        </button>
        <button onClick={handleEdit} style={styles.editButton}>
          Edit
        </button>
        <button onClick={handleDelete} style={styles.deleteButton}>
          Delete
        </button>
      </div>

      {showEdit && (
        <EditChildModal
          child={child}
          onClose={() => setShowEdit(false)}
          onSuccess={handleUpdateSuccess}
        />
      )}

      {showDelete && (
        <DeleteConfirmationModal
          child={child}
          onClose={() => setShowDelete(false)}
          onSuccess={handleDeleteSuccess}
        />
      )}
    </div>
  );
}

const styles = {
  card: {
    background: '#ffffff',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px'
  },
  avatar: {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#fff'
  },
  info: {
    flex: 1
  },
  name: {
    margin: 0,
    fontSize: '20px',
    fontWeight: '600',
    color: '#333'
  },
  age: {
    margin: '4px 0 0',
    fontSize: '14px',
    color: '#666'
  },
  lastActive: {
    margin: '4px 0 0',
    fontSize: '12px',
    color: '#999'
  },
  stats: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px'
  },
  statItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  },
  statLabel: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#999',
    textTransform: 'uppercase'
  },
  statValue: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#667eea'
  },
  buttonGroup: {
    display: 'flex',
    gap: '8px'
  },
  button: {
    flex: 1,
    padding: '12px',
    background: '#667eea',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  editButton: {
    padding: '12px 16px',
    background: '#f5f5f5',
    color: '#666',
    border: '1px solid #ddd',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  deleteButton: {
    padding: '12px 16px',
    background: '#ffe6e6',
    color: '#d32f2f',
    border: '1px solid #ffcccc',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s'
  }
};
