# Phase 8: Child Dashboard with Categories

**Project:** ADHDLearn.com
**Phase:** 8 of 36
**Last Updated:** October 22, 2025

---

 Child Dashboard with Categories

**Delivers:** Aurora sees learning categories (most locked)
**Aurora gets:** 🎨 **Prettier dashboard, can see what's coming**
**You get:** Nothing new
**Deployed:** Better UX for Aurora

### What This Phase Delivers

Colorful child dashboard with learning categories:
- 6 category cards: Reading, Math, Science, Cooking, Shopping, 3D Printing
- Only Reading unlocked initially (others show "Coming Soon 🔒")
- Display Aurora's points and streak
- Recent activity list (last 3 sessions)
- Achievements preview
- Avatar and logout in top-right corner

### Database Changes

None

### API Endpoints

#### GET /api/children/:childId/dashboard
**Purpose:** Get dashboard data for child
**Headers:** `Authorization: Bearer {token}`
**Response (200):**
```json
{
  "success": true,
  "child": {
    "userId": 2,
    "firstName": "Aurora",
    "avatar": "🌈",
    "totalPoints": 450,
    "currentStreak": 5,
    "longestStreak": 7
  },
  "categories": [
    {
      "categoryId": "reading",
      "name": "Reading",
      "icon": "📚",
      "unlocked": true,
      "activityCount": 3
    },
    {
      "categoryId": "math",
      "name": "Math",
      "icon": "🔢",
      "unlocked": false,
      "activityCount": 0
    }
  ],
  "recentActivity": [
    {
      "activityName": "Letter Pop",
      "score": 140,
      "playedAt": "2025-10-21T10:30:00Z"
    }
  ],
  "achievements": [
    {
      "achievementId": 1,
      "name": "5-Day Streak",
      "icon": "🌟",
      "unlocked": true
    }
  ]
}
```

### Frontend Changes

**New Files in `child-portal/`:**
```
src/
├── pages/
│   └── ChildDashboard.jsx
├── components/
│   ├── CategoryCard.jsx
│   ├── RecentActivity.jsx
│   ├── AchievementsBadge.jsx
│   └── StatsDisplay.jsx
└── styles/
    └── child-dashboard.css
```

**`pages/ChildDashboard.jsx`:**
```javascript
import { useEffect, useState } from 'react';
import { getDashboard } from '../services/api';
import CategoryCard from '../components/CategoryCard';
import RecentActivity from '../components/RecentActivity';

export default function ChildDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      const data = await getDashboard();
      setDashboard(data);
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="child-dashboard">
      <header>
        <h1>Hi {dashboard.child.firstName}! 🌈 Ready to learn?</h1>
        <div className="stats">
          <span className="points">⭐ {dashboard.child.totalPoints} points</span>
          <span className="streak">🔥 {dashboard.child.currentStreak} days in a row!</span>
        </div>
      </header>

      <div className="categories-grid">
        {dashboard.categories.map(category => (
          <CategoryCard key={category.categoryId} category={category} />
        ))}
      </div>

      <RecentActivity sessions={dashboard.recentActivity} />
    </div>
  );
}
```

**`components/CategoryCard.jsx`:**
```javascript
export default function CategoryCard({ category }) {
  const handleClick = () => {
    if (category.unlocked) {
      navigate(`/categories/${category.categoryId}`);
    } else {
      showComingSoonModal();
    }
  };

  return (
    <div 
      className={`category-card ${category.unlocked ? 'unlocked' : 'locked'}`}
      onClick={handleClick}
    >
      <div className="icon">{category.icon}</div>
      <h2>{category.name}</h2>
      {category.unlocked ? (
        <span className="badge available">{category.activityCount} activities</span>
      ) : (
        <span className="badge locked">Coming Soon 🔒</span>
      )}
    </div>
  );
}
```

### Technical Specifications

**CSS for Child Dashboard:**
```css
.child-dashboard {
  background: linear-gradient(135deg, #FFD93D, #FF6B6B);
  min-height: 100vh;
  padding: 24px;
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
  margin: 32px 0;
}

.category-card {
  background: white;
  border-radius: 24px;
  padding: 32px;
  text-align: center;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  min-height: 300px;
}

.category-card.unlocked:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 24px rgba(0,0,0,0.2);
}

.category-card.locked {
  opacity: 0.6;
  filter: grayscale(70%);
  cursor: not-allowed;
}

.category-card .icon {
  font-size: 128px;
  margin-bottom: 16px;
}

.category-card h2 {
  font-size: 32px;
  font-family: 'Fredoka One', cursive;
  color: #2D3436;
}

.badge {
  display: inline-block;
  padding: 8px 16px;
  border-radius: 16px;
  font-size: 16px;
  font-weight: bold;
}

.badge.available {
  background: #6FCF97;
  color: white;
}

.badge.locked {
  background: #9B9B9B;
  color: white;
}
```

### Acceptance Criteria

- [ ] Dashboard loads in under 2 seconds
- [ ] 6 category cards displayed in responsive grid
- [ ] Only Reading unlocked, others show "Coming Soon"
- [ ] Category cards minimum 300x300px
- [ ] Points and streak displayed prominently
- [ ] Recent activity shows last 3 sessions
- [ ] Achievements preview shown (2-3 badges)
- [ ] Avatar in top-right corner
- [ ] Logout button accessible
- [ ] Locked categories show modal when clicked
- [ ] Smooth animations on hover/interactions
- [ ] Responsive layout (portrait/landscape)
- [ ] Touch targets minimum 60px
- [ ] High contrast colors for readability
- [ ] No ads or external links

### McCabe Complexity

All functions ≤ 5:
- `ChildDashboard.loadDashboard()`: 2
- `CategoryCard.handleClick()`: 2
- `GET /api/children/:childId/dashboard` handler: 3

### Dependencies

- Phase 7: Child login with PIN
- Phase 3: game_sessions table for recent activity

---

---

