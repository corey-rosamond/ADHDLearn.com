// Children API service
// McCabe complexity: all functions ≤ 3

const API_BASE_URL = import.meta.env.VITE_API_BASE ? `${import.meta.env.VITE_API_BASE}/api` : 'http://localhost:3000/api';

/**
 * Get all children in a family
 * @param {number} familyId - Family ID
 * @returns {Promise<{children: Array}>}
 */
export async function getChildren(familyId) {
  const token = localStorage.getItem('token');

  const response = await fetch(`${API_BASE_URL}/families/${familyId}/children`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error('Failed to fetch children');
  }

  return await response.json();
}

/**
 * Get sessions for a specific child
 * @param {number} childId - Child user ID
 * @param {Object} options - Query options
 * @returns {Promise<{sessions: Array, stats: Object}>}
 */
export async function getChildSessions(childId, options = {}) {
  const token = localStorage.getItem('token');

  const params = new URLSearchParams();
  if (options.game) params.append('game', options.game);
  if (options.limit) params.append('limit', options.limit);
  if (options.offset) params.append('offset', options.offset);

  const response = await fetch(
    `${API_BASE_URL}/children/${childId}/sessions?${params}`,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch sessions');
  }

  return await response.json();
}

/**
 * Get analytics for a specific child
 * @param {number} childId - Child user ID
 * @returns {Promise<{child: Object, confusionPairs: Array, favoriteActivity: string}>}
 */
export async function getChildAnalytics(childId) {
  const token = localStorage.getItem('token');

  const response = await fetch(`${API_BASE_URL}/children/${childId}/analytics`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error('Failed to fetch analytics');
  }

  return await response.json();
}

/**
 * Add a new child to the family
 * @param {number} familyId - Family ID
 * @param {Object} childData - Child information
 * @returns {Promise<{success: boolean, child: Object}>}
 */
export async function addChild(familyId, childData) {
  const token = localStorage.getItem('token');

  const response = await fetch(`${API_BASE_URL}/families/${familyId}/children`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(childData)
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || 'Failed to add child');
  }

  return result;
}

/**
 * Update child information
 * @param {number} childId - Child user ID
 * @param {Object} childData - Updated child information
 * @returns {Promise<{success: boolean}>}
 */
export async function updateChild(childId, childData) {
  const token = localStorage.getItem('token');

  const response = await fetch(`${API_BASE_URL}/children/${childId}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(childData)
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || 'Failed to update child');
  }

  return result;
}

/**
 * Delete (soft delete) a child
 * @param {number} childId - Child user ID
 * @returns {Promise<{success: boolean}>}
 */
export async function deleteChild(childId) {
  const token = localStorage.getItem('token');

  const response = await fetch(`${API_BASE_URL}/children/${childId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || 'Failed to delete child');
  }

  return result;
}
