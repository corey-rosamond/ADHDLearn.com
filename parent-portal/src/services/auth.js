// API base URL from environment variable or default to localhost
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000';

// Register new family + parent
// McCabe complexity: 2
export async function register(data) {
  const response = await fetch(`${API_BASE}/api/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || 'Registration failed');
  }

  return result;
}

// Login parent with email/password
// McCabe complexity: 2
export async function loginParent(email, password) {
  const response = await fetch(`${API_BASE}/api/auth/login/parent`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || 'Login failed');
  }

  return result;
}

// Get current user info (protected route)
// McCabe complexity: 2
export async function getCurrentUser(token) {
  const response = await fetch(`${API_BASE}/api/auth/me`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || 'Failed to get user info');
  }

  return result;
}
