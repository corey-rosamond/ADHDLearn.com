# Phase 17: Progress Charts

**Project:** ADHDLearn.com
**Phase:** 17 of 36
**Last Updated:** October 22, 2025

---

 Progress Charts

**Delivers:** Visual progress tracking for parents
**Aurora gets:** Nothing new
**You get:** 📊 **Beautiful charts showing Aurora's progress over time**
**Deployed:** Parent dashboard has charts

---

### What This Phase Delivers

Chart.js integration in parent dashboard:
- Line chart: Progress over time (daily scores)
- Pie chart: Activity breakdown (time per category)
- Bar chart: Games played (frequency)
- Accuracy trend chart (improving or struggling)
- Filter by date range (7 days, 30 days, all time)

---

### Database Changes

**No new tables** - Uses existing `game_sessions` table.

---

### API Endpoints

#### GET /api/analytics/progress?childId={id}&range={days}
**Purpose:** Get progress data for charts
**Headers:** `Authorization: Bearer {token}`
**Query Parameters:**
- `childId`: Child user_id
- `range`: Number of days (7, 30, 90, or 'all')
**Response (200):**
```json
{
  "success": true,
  "data": {
    "dailyScores": [
      { "date": "2025-10-16", "totalScore": 120, "sessionsPlayed": 3 },
      { "date": "2025-10-17", "totalScore": 150, "sessionsPlayed": 4 },
      { "date": "2025-10-22", "totalScore": 180, "sessionsPlayed": 5 }
    ],
    "categoryBreakdown": [
      { "category": "Reading", "timeSpent": 1200, "sessionsPlayed": 12 },
      { "category": "Math", "timeSpent": 800, "sessionsPlayed": 8 }
    ],
    "gamesPlayed": [
      { "game": "Letter Pop", "count": 5 },
      { "game": "Word Builder", "count": 4 },
      { "game": "Sight Words", "count": 3 },
      { "game": "Counting Game", "count": 4 },
      { "game": "Shapes", "count": 2 },
      { "game": "Addition Game", "count": 2 }
    ],
    "accuracyTrend": [
      { "date": "2025-10-16", "avgAccuracy": 75.5 },
      { "date": "2025-10-17", "avgAccuracy": 82.3 },
      { "date": "2025-10-22", "avgAccuracy": 88.1 }
    ]
  }
}
```

---

### Frontend Changes

**New dependency:** Chart.js
```bash
npm install chart.js react-chartjs-2
```

**Update `parent-portal/src/pages/Dashboard.jsx`:**
```javascript
import React, { useState, useEffect } from 'react';
import { Line, Pie, Bar } from 'react-chartjs-2';
import api from '../services/api';

export default function Dashboard() {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [range, setRange] = useState(30); // Default 30 days
  const [selectedChild, setSelectedChild] = useState(null);

  useEffect(() => {
    if (selectedChild) {
      fetchAnalytics(selectedChild.userId, range);
    }
  }, [selectedChild, range]);

  async function fetchAnalytics(childId, days) {
    try {
      const response = await api.get(`/api/analytics/progress?childId=${childId}&range=${days}`);
      setAnalyticsData(response.data);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    }
  }

  // Line chart: Daily scores
  const dailyScoresData = {
    labels: analyticsData?.dailyScores.map(d => d.date) || [],
    datasets: [{
      label: 'Total Score',
      data: analyticsData?.dailyScores.map(d => d.totalScore) || [],
      borderColor: '#4ECDC4',
      backgroundColor: 'rgba(78, 205, 196, 0.2)',
      tension: 0.3
    }]
  };

  // Pie chart: Category breakdown
  const categoryData = {
    labels: analyticsData?.categoryBreakdown.map(c => c.category) || [],
    datasets: [{
      data: analyticsData?.categoryBreakdown.map(c => c.timeSpent) || [],
      backgroundColor: ['#FF6B9D', '#4ECDC4', '#95E1D3', '#FFD93D', '#6C5CE7']
    }]
  };

  return (
    <div className="dashboard-with-charts">
      <div className="filters">
        <button onClick={() => setRange(7)}>Last 7 Days</button>
        <button onClick={() => setRange(30)}>Last 30 Days</button>
        <button onClick={() => setRange('all')}>All Time</button>
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <h3>Daily Progress</h3>
          <Line data={dailyScoresData} options={{ responsive: true }} />
        </div>

        <div className="chart-card">
          <h3>Time by Category</h3>
          <Pie data={categoryData} options={{ responsive: true }} />
        </div>
      </div>
    </div>
  );
}

// McCabe complexity: 2 (within limit)
```

---

### Acceptance Criteria

- [ ] Chart.js integrated in parent portal
- [ ] Line chart displays daily progress
- [ ] Pie chart shows category breakdown
- [ ] Bar chart shows games played frequency
- [ ] Accuracy trend chart shows improvement
- [ ] Filter buttons work (7, 30, 90 days, all time)
- [ ] Charts update when filter changes
- [ ] Charts are responsive (mobile-friendly)
- [ ] Empty state when no data exists
- [ ] Charts use consistent color scheme

---

### Dependencies

- Phase 4: Parent Registration + Login
- Phase 5: Parent Dashboard (base dashboard exists)
- Phase 3: Database (uses game_sessions data)

---

