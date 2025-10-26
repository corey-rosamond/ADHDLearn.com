import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getChildren } from '../services/children';
import ChildCard from '../components/ChildCard';
import AddChildModal from '../components/AddChildModal';
import Toast from '../components/Toast';

// Dashboard page with children list
// McCabe complexity: 4
export default function DashboardNew() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddChild, setShowAddChild] = useState(false);
  const [toast, setToast] = useState(null);
  const [pendingToast, setPendingToast] = useState(null);

  useEffect(() => {
    loadChildren();
  }, []);

  // Show pending toast after children load
  useEffect(() => {
    if (pendingToast && !loading) {
      setToast(pendingToast);
      setPendingToast(null);
    }
  }, [children, loading, pendingToast]);

  // McCabe: 3
  async function loadChildren() {
    if (!user?.familyId) {
      setLoading(false);
      return;
    }

    try {
      const data = await getChildren(user.familyId);
      setChildren(data.children || []);
    } catch (err) {
      console.error('Failed to load children:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // McCabe: 1
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // McCabe: 1
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  if (loading) {
    return <div style={styles.loading}>Loading...</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>ADHDLearn Parent Dashboard</h1>
        <button onClick={handleLogout} style={styles.logoutButton}>
          Log Out
        </button>
      </div>

      <div style={styles.content}>
        {toast && (
          <div
            data-testid="success-toast"
            style={{
              background: '#10b981',
              color: 'white',
              padding: '16px',
              borderRadius: '8px',
              marginBottom: '20px',
              textAlign: 'center',
              fontSize: '18px',
              fontWeight: '600'
            }}>
            {toast.message}
          </div>
        )}

        <div style={styles.welcomeCard}>
          <h2 style={styles.welcomeTitle}>
            Welcome back, {user?.firstName}! 👋
          </h2>
          <p style={styles.welcomeText}>
            Track your {children.length > 0 ? 'children\'s' : 'family\'s'} learning progress
          </p>
        </div>

        {error && (
          <div style={styles.errorCard}>
            <p>Error loading children: {error}</p>
          </div>
        )}

        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>Your Children</h2>
            <button
              onClick={() => setShowAddChild(true)}
              style={styles.addButton}
            >
              + Add Child
            </button>
          </div>

          {children.length === 0 ? (
            <div style={styles.emptyState}>
              <p style={styles.emptyText}>No children added yet</p>
              <p style={styles.emptyHint}>
                Click "Add Child" to get started
              </p>
            </div>
          ) : (
            <div style={styles.childrenGrid}>
              {children.map(child => (
                <ChildCard
                  key={child.userId}
                  child={child}
                  onUpdate={loadChildren}
                  onShowToast={showToast}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {showAddChild && (
        <AddChildModal
          familyId={user?.familyId}
          onClose={() => setShowAddChild(false)}
          onSuccess={async (childName) => {
            setShowAddChild(false);
            setPendingToast({ message: `${childName} added successfully!`, type: 'success' });
            await loadChildren();
          }}
        />
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
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    maxWidth: '1200px',
    margin: '0 auto 40px',
    padding: '20px',
    background: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
  },
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#333',
    margin: 0
  },
  logoutButton: {
    padding: '10px 20px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#667eea',
    background: '#ffffff',
    border: '2px solid #667eea',
    borderRadius: '8px',
    cursor: 'pointer'
  },
  content: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px'
  },
  welcomeCard: {
    background: '#ffffff',
    borderRadius: '12px',
    padding: '40px',
    textAlign: 'center',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
  },
  welcomeTitle: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#667eea',
    margin: '0 0 12px'
  },
  welcomeText: {
    fontSize: '18px',
    color: '#666',
    margin: 0
  },
  errorCard: {
    background: '#fee',
    color: '#c33',
    padding: '16px',
    borderRadius: '8px',
    textAlign: 'center'
  },
  section: {
    background: '#ffffff',
    borderRadius: '12px',
    padding: '32px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px'
  },
  sectionTitle: {
    fontSize: '24px',
    fontWeight: '600',
    color: '#333',
    margin: 0
  },
  addButton: {
    padding: '12px 24px',
    fontSize: '16px',
    fontWeight: '600',
    color: '#fff',
    background: '#667eea',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer'
  },
  childrenGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px'
  },
  emptyState: {
    textAlign: 'center',
    padding: '60px 20px'
  },
  emptyText: {
    fontSize: '20px',
    color: '#666',
    margin: '0 0 8px'
  },
  emptyHint: {
    fontSize: '14px',
    color: '#999',
    margin: 0
  }
};
