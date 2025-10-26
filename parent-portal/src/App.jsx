import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/DashboardNew';
import ChildProgress from './pages/ChildProgress';
import ActivityAnalytics from './pages/ActivityAnalytics';

// Protected route component
// McCabe complexity: 2
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div style={styles.loading}>Loading...</div>;
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

// Main App component
// McCabe complexity: 1
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/children/:childId/progress"
            element={
              <ProtectedRoute>
                <ChildProgress />
              </ProtectedRoute>
            }
          />
          <Route
            path="/children/:childId/activities/:activityName"
            element={
              <ProtectedRoute>
                <ActivityAnalytics />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

const styles = {
  loading: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    fontSize: '20px',
    color: '#667eea'
  }
};

export default App;
