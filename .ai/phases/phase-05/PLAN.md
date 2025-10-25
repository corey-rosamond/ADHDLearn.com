# Phase 5: Parent Dashboard - View Aurora's Scores

**Project:** ADHDLearn.com
**Phase:** 5 of 36
**Last Updated:** October 22, 2025

---

 Parent Dashboard - View Aurora's Scores

**Delivers:** You see Aurora's Letter Pop scores
**Aurora gets:** Nothing new
**You get:** 📊 **See Aurora's scores and play history**
**Deployed:** You can track Aurora's progress

### What This Phase Delivers

Parent dashboard displaying child activity:
- List of children in family (Aurora)
- Click child to view their progress
- Detailed session history for each game
- Statistics: total time, average score, accuracy
- Confusion matrix showing which letters Aurora mixes up

### Database Changes

**Modified Tables:**

#### game_sessions (add user_id link)
```sql
ALTER TABLE game_sessions
ADD COLUMN user_id INT AFTER session_id,
ADD FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
ADD INDEX idx_user_game (user_id, game_name, played_at DESC);
```

### API Endpoints

#### GET /api/children/:childId/sessions
**Purpose:** Get all game sessions for a child
**Headers:** `Authorization: Bearer {token}`
**Query Params:** `?game=Letter%20Pop&limit=20`
**Response (200):**
```json
{
  "success": true,
  "child": {
    "userId": 2,
    "firstName": "Aurora",
    "avatar": "🌈"
  },
  "sessions": [
    {
      "sessionId": 45,
      "gameName": "Letter Pop",
      "score": 180,
      "accuracyPercentage": 90.0,
      "durationSeconds": 60,
      "playedAt": "2025-10-21T10:30:00Z"
    }
  ],
  "stats": {
    "totalSessions": 5,
    "totalTimeMinutes": 42,
    "averageScore": 152,
    "averageAccuracy": 76.0,
    "bestScore": 180
  }
}
```

#### GET /api/children/:childId/analytics
**Purpose:** Get learning analytics for a child
**Response (200):**
```json
{
  "success": true,
  "confusionPairs": [
    {
      "letter1": "B",
      "letter2": "D",
      "count": 7,
      "percentage": 41
    }
  ],
  "favoriteActivity": "Letter Pop",
  "currentStreak": 2,
  "longestStreak": 5
}
```

### Frontend Changes

**New Files in `parent-portal/`:**
```
src/
├── pages/
│   ├── Dashboard.jsx
│   ├── ChildProgress.jsx
│   └── ActivityAnalytics.jsx
├── components/
│   ├── ChildCard.jsx
│   ├── SessionTable.jsx
│   └── StatsCard.jsx
└── services/
    └── children.js
```

**`pages/Dashboard.jsx`:**
```javascript
import { useEffect, useState } from 'react';
import { getChildren } from '../services/children';
import ChildCard from '../components/ChildCard';

export default function Dashboard() {
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadChildren();
  }, []);

  async function loadChildren() {
    try {
      const data = await getChildren();
      setChildren(data.children);
    } catch (error) {
      console.error('Failed to load children:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div>Loading...</div>;

  if (children.length === 0) {
    return (
      <div className="empty-state">
        <h1>Welcome!</h1>
        <p>Add your first child to start tracking their learning journey!</p>
        <button onClick={() => navigate('/add-child')}>+ Add Child</button>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <h1>Your Children</h1>
      <div className="children-grid">
        {children.map(child => (
          <ChildCard key={child.userId} child={child} />
        ))}
      </div>
    </div>
  );
}
```

### Acceptance Criteria

- [ ] Dashboard shows all children in family
- [ ] Each child card shows: name, avatar, age, last active, basic stats
- [ ] Click child card → view detailed progress page
- [ ] Progress page shows session history table
- [ ] Session table shows: date, score, accuracy, duration
- [ ] Click session row → view session details modal
- [ ] Analytics page shows confusion pairs
- [ ] All API calls require valid JWT token
- [ ] Loading states while fetching data
- [ ] Error handling for API failures
- [ ] Responsive design (desktop/tablet/mobile)

### McCabe Complexity

All functions ≤ 5:
- `Dashboard.loadChildren()`: 2
- `GET /api/children/:childId/sessions` handler: 4
- `ChildCard` component render: 3

### Dependencies

- Phase 3: Database with game_sessions table
- Phase 4: Parent authentication

---

