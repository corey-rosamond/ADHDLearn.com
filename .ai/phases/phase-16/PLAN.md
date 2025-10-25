# Phase 16: Chore System - Child Side

**Project:** ADHDLearn.com
**Phase:** 16 of 36
**Last Updated:** October 22, 2025

---

 Chore System - Child Side

**Delivers:** Aurora can see and complete chores
**Aurora gets:** 📋 **Chore List - Complete chores, earn points**
**You get:** Notifications when Aurora completes chores
**Deployed:** Full chore system working end-to-end

---

### What This Phase Delivers

Chore UI for children:
- Chore list in child portal
- View assigned chores
- Mark chore as complete
- Optional photo proof upload
- See points earned per chore
- Chores appear on child dashboard

---

### Database Changes

**No new tables** - Uses `chores` table from Phase 14.

---

### API Endpoints

**Uses existing endpoints from Phase 14:**
- GET /api/chores?assignedTo={userId}&status=pending
- PATCH /api/chores/:id/complete

**New endpoint for photo upload:**

#### POST /api/chores/upload-photo
**Purpose:** Upload photo proof (optional S3 integration)
**Headers:** `Authorization: Bearer {token}`
**Body:** `multipart/form-data` with photo file
**Response (200):**
```json
{
  "success": true,
  "photoUrl": "https://s3.amazonaws.com/adhdlearn/chores/photo_123.jpg"
}
```

---

### Frontend Changes

**New Files in `child-portal/src/pages/`:**
```
pages/
├── ChoresList.jsx           (Chore list page)
└── ChoreCard.jsx            (Individual chore card)
```

**Add route in `child-portal/src/App.jsx`:**
```javascript
import ChoresList from './pages/ChoresList';

<Route path="/chores" element={<ChoresList />} />
```

**Update dashboard in `child-portal/src/pages/ChildDashboard.jsx`:**
```javascript
// Add chores widget to dashboard
<div className="chores-widget">
  <h3>My Chores 📋</h3>
  <p>{pendingChoresCount} chores to do</p>
  <Link to="/chores">View All</Link>
</div>
```

---

### Technical Specifications

**ChoresList.jsx:**
```javascript
import React, { useState, useEffect } from 'react';
import api from '../services/api';
import ChoreCard from './ChoreCard';
import './ChoresList.css';

export default function ChoresList() {
  const [chores, setChores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChores();
  }, []);

  async function fetchChores() {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const response = await api.get(`/api/chores?assignedTo=${user.userId}&status=pending`);
      setChores(response.chores);
    } catch (error) {
      console.error('Failed to fetch chores:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleComplete(choreId, photoUrl) {
    try {
      await api.patch(`/api/chores/${choreId}/complete`, { photoUrl });
      fetchChores(); // Refresh list
    } catch (error) {
      console.error('Failed to complete chore:', error);
    }
  }

  if (loading) return <div className="loading">Loading chores...</div>;

  return (
    <div className="chores-list-page">
      <h1>My Chores 📋</h1>
      
      {chores.length === 0 ? (
        <div className="empty-state">
          <p>No chores right now!</p>
          <p>Go play some games! 🎮</p>
        </div>
      ) : (
        <div className="chores-grid">
          {chores.map(chore => (
            <ChoreCard
              key={chore.choreId}
              chore={chore}
              onComplete={handleComplete}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// McCabe complexity: 2 (within limit)
```

**ChoreCard.jsx (Child Portal):**
```javascript
import React, { useState } from 'react';
import './ChoreCard.css';

export default function ChoreCard({ chore, onComplete }) {
  const [showCamera, setShowCamera] = useState(false);
  const [photoUrl, setPhotoUrl] = useState('');

  function handleMarkComplete() {
    if (confirm(`Mark "${chore.title}" as complete?`)) {
      onComplete(chore.choreId, photoUrl);
    }
  }

  return (
    <div className="chore-card child">
      <div className="chore-header">
        <h3>{chore.title}</h3>
        <span className="points">+{chore.pointsValue} pts</span>
      </div>
      
      {chore.description && (
        <p className="description">{chore.description}</p>
      )}
      
      {chore.dueDate && (
        <p className="due-date">Due: {new Date(chore.dueDate).toLocaleDateString()}</p>
      )}
      
      <div className="actions">
        <button onClick={() => setShowCamera(!showCamera)} className="photo-btn">
          📷 Add Photo
        </button>
        <button onClick={handleMarkComplete} className="complete-btn">
          ✅ Mark Complete
        </button>
      </div>
      
      {photoUrl && (
        <img src={photoUrl} alt="Proof" className="proof-preview" />
      )}
    </div>
  );
}

// McCabe complexity: 2 (within limit)
```

---

### Acceptance Criteria

- [ ] Chores page accessible from child dashboard
- [ ] Child sees only chores assigned to them
- [ ] Only pending chores display
- [ ] Chore card shows title, description, points, due date
- [ ] Child can mark chore as complete
- [ ] Optional photo upload works
- [ ] Completed chore disappears from list
- [ ] Dashboard widget shows pending chores count
- [ ] Empty state displays when no chores exist
- [ ] Points display prominently on each chore
- [ ] UI is touch-friendly for children

---

### McCabe Complexity

All functions ≤ 5:
- ChoresList component: 2
- ChoreCard component: 2
- `handleComplete()`: 1
- `handleMarkComplete()`: 1

---

### Dependencies

- Phase 7: Child Login (requires child authentication)
- Phase 14: Chore System - Backend (requires chore API)
- Phase 15: Chore System - Parent Side (parents must create chores first)


---

