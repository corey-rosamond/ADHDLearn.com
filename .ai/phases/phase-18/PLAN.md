# Phase 18: Confusion Matrix (Letter Pop)

**Project:** ADHDLearn.com
**Phase:** 18 of 36
**Last Updated:** October 22, 2025

---

 Confusion Matrix (Letter Pop)

**Delivers:** See which letters Aurora confuses
**Aurora gets:** Nothing new
**You get:** 📈 **Confusion matrix showing letter mix-ups (b vs d, p vs q)**
**Deployed:** Parent dashboard shows confusion analysis

---

### What This Phase Delivers

Letter confusion tracking for Letter Pop game:
- Track which letter was shown vs which was clicked
- Display confusion pairs (e.g., b↔d, p↔q)
- Show most confused letters
- Heatmap visualization
- Helps identify learning opportunities

---

### Database Changes

**New Table:** `letter_pop_attempts`
```sql
CREATE TABLE letter_pop_attempts (
    attempt_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    session_id BIGINT NOT NULL,
    user_id INT NOT NULL,
    
    target_letter CHAR(1) NOT NULL,
    clicked_letter CHAR(1) NOT NULL,
    is_correct BOOLEAN NOT NULL,
    
    reaction_time_ms INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (session_id) REFERENCES game_sessions(session_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    
    INDEX idx_user_letters (user_id, target_letter, clicked_letter),
    INDEX idx_session (session_id),
    INDEX idx_created (created_at)
);
```

---

### API Endpoints

#### POST /api/letter-pop/record-attempt
**Purpose:** Record individual letter attempt
**Headers:** `Authorization: Bearer {token}`
**Body:**
```json
{
  "sessionId": 42,
  "targetLetter": "b",
  "clickedLetter": "d",
  "isCorrect": false,
  "reactionTimeMs": 1250
}
```
**Response (201):**
```json
{
  "success": true,
  "attemptId": 1234
}
```

#### GET /api/analytics/confusion-matrix?childId={id}
**Purpose:** Get confusion matrix data
**Headers:** `Authorization: Bearer {token}`
**Response (200):**
```json
{
  "success": true,
  "confusionPairs": [
    { "target": "b", "clicked": "d", "count": 8 },
    { "target": "d", "clicked": "b", "count": 5 },
    { "target": "p", "clicked": "q", "count": 3 },
    { "target": "m", "clicked": "n", "count": 2 }
  ],
  "mostConfusedLetters": ["b", "d", "p", "q"],
  "totalAttempts": 450,
  "totalCorrect": 398,
  "totalIncorrect": 52
}
```

---

### Frontend Changes

**Update `child-portal/src/games/letter-pop/GameScene.js`:**
```javascript
// Add attempt recording when letter is clicked
async recordAttempt(targetLetter, clickedLetter, isCorrect, reactionTime) {
  try {
    await api.post('/api/letter-pop/record-attempt', {
      sessionId: this.sessionId,
      targetLetter,
      clickedLetter,
      isCorrect,
      reactionTimeMs: reactionTime
    });
  } catch (error) {
    console.error('Failed to record attempt:', error);
  }
}
```

**New file in `parent-portal/src/components/`:**
```
components/
└── ConfusionMatrix.jsx      (Heatmap visualization)
```

**ConfusionMatrix.jsx:**
```javascript
import React, { useState, useEffect } from 'react';
import api from '../services/api';
import './ConfusionMatrix.css';

export default function ConfusionMatrix({ childId }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchConfusionData();
  }, [childId]);

  async function fetchConfusionData() {
    try {
      const response = await api.get(`/api/analytics/confusion-matrix?childId=${childId}`);
      setData(response);
    } catch (error) {
      console.error('Failed to fetch confusion matrix:', error);
    }
  }

  if (!data) return <div>Loading...</div>;

  return (
    <div className="confusion-matrix">
      <h3>Letter Confusion Analysis</h3>
      
      <div className="confusion-pairs">
        <h4>Most Common Confusions:</h4>
        {data.confusionPairs.slice(0, 5).map(pair => (
          <div key={`${pair.target}-${pair.clicked}`} className="confusion-pair">
            <span className="letters">{pair.target} ↔ {pair.clicked}</span>
            <span className="count">{pair.count} times</span>
          </div>
        ))}
      </div>

      <div className="stats">
        <p>Total Attempts: {data.totalAttempts}</p>
        <p>Accuracy: {((data.totalCorrect / data.totalAttempts) * 100).toFixed(1)}%</p>
      </div>
    </div>
  );
}

// McCabe complexity: 2 (within limit)
```

---

### Acceptance Criteria

- [ ] letter_pop_attempts table created
- [ ] Letter Pop game records each attempt
- [ ] API endpoint saves attempt data
- [ ] Confusion matrix displays in parent dashboard
- [ ] Most confused letter pairs highlighted
- [ ] Heatmap visualization works
- [ ] Accuracy percentage displayed
- [ ] Data helps identify learning opportunities

---

### Dependencies

- Phase 2: Letter Pop game (must exist to track)
- Phase 5: Parent Dashboard (displays confusion matrix)

---

