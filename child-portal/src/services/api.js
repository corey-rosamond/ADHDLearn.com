const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000';

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

export async function getHighScores(gameName, limit = 10) {
  const url = API_BASE + '/api/sessions/high-scores?game=' + 
    encodeURIComponent(gameName) + '&limit=' + limit;
  
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('API error: ' + response.statusText);
  }

  return response.json();
}
