const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000';

// Phase 7: Save game session with userId
// McCabe complexity: 2
export async function saveSession(data) {
  const response = await fetch(API_BASE + '/api/sessions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    throw new Error('API error: ' + response.statusText);
  }

  return response.json();
}

// Phase 7: Save letter attempts for confusion matrix analysis
// McCabe complexity: 2
export async function saveLetterAttempts(sessionId, attempts) {
  const response = await fetch(API_BASE + '/api/sessions/' + sessionId + '/attempts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ attempts })
  });

  if (!response.ok) {
    throw new Error('API error: ' + response.statusText);
  }

  return response.json();
}

export async function getHighScores(gameName, limit = 10) {
  const url = API_BASE + '/api/sessions/high-scores?game=' +
    encodeURIComponent(gameName) + '&limit=' + limit;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('API error: ' + response.statusText);
  }

  return response.json();
}

// Phase 7: Child Login
// McCabe complexity: 2
export async function getChildren(familyId) {
  const response = await fetch(API_BASE + '/api/families/' + familyId + '/children');

  if (!response.ok) {
    throw new Error('API error: ' + response.statusText);
  }

  return response.json();
}

// Phase 7: Child Login
// McCabe complexity: 2
export async function loginChild(userId, pinCode) {
  const response = await fetch(API_BASE + '/api/auth/login/child', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ userId, pinCode })
  });

  if (!response.ok) {
    throw new Error('API error: ' + response.statusText);
  }

  return response.json();
}
