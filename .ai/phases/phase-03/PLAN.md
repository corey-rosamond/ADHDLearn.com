# Phase 3: Database + Simple Backend

**Project:** ADHDLearn.com
**Phase:** 3 of 36
**Last Updated:** October 22, 2025

---

 Database + Simple Backend

**Delivers:** Scores persist in database
**Aurora gets:** 🏆 **Her high scores are saved and displayed**
**You get:** Backend infrastructure working
**Deployed:** Aurora's scores persist across devices

### What This Phase Delivers

Backend API that saves game sessions to MySQL:
- MySQL database with `game_sessions` table
- Node.js Express API with one endpoint: `POST /api/sessions`
- Letter Pop sends score after each game
- Results screen fetches and displays high scores from database
- Scores persist across devices (not just localStorage)

### Database Changes

**New Tables:**

#### game_sessions
```sql
CREATE TABLE game_sessions (
    session_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    game_name VARCHAR(50) NOT NULL,        -- 'Letter Pop'
    score INT NOT NULL,
    accuracy_percentage DECIMAL(5,2),
    correct_attempts INT,
    total_attempts INT,
    duration_seconds INT,
    mode VARCHAR(20),                      -- 'uppercase', 'lowercase', 'mixed'
    played_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_game_score (game_name, score DESC),
    INDEX idx_played_at (played_at DESC)
);
```

### API Endpoints

#### POST /api/sessions
**Purpose:** Save game session
**Body:**
```json
{
  "gameName": "Letter Pop",
  "score": 180,
  "accuracyPercentage": 85.0,
  "correctAttempts": 18,
  "totalAttempts": 21,
  "durationSeconds": 60,
  "mode": "uppercase"
}
```
**Response (201):**
```json
{
  "success": true,
  "sessionId": 1,
  "isHighScore": true,
  "rank": 2
}
```

#### GET /api/sessions/high-scores
**Purpose:** Get top 10 high scores
**Query Params:** `?game=Letter%20Pop&limit=10`
**Response (200):**
```json
{
  "success": true,
  "scores": [
    {
      "sessionId": 45,
      "score": 190,
      "accuracyPercentage": 88.0,
      "playedAt": "2025-10-21T14:32:00Z"
    },
    {
      "sessionId": 32,
      "score": 180,
      "accuracyPercentage": 85.0,
      "playedAt": "2025-10-21T14:15:00Z"
    }
  ]
}
```

### Frontend Changes

**Modified Files:**

**`child-portal/src/games/reading/letter-pop/scenes/GameScene.js`**
```javascript
// Add at top
import { saveSession } from '../../../services/api';

// Modify gameOver()
async gameOver() {
  const correct = this.attempts.filter(a => a.correct).length;
  const total = this.attempts.length;
  const accuracy = total > 0 ? (correct / total * 100).toFixed(1) : 0;

  // Save to API
  try {
    const result = await saveSession({
      gameName: 'Letter Pop',
      score: this.score,
      accuracyPercentage: parseFloat(accuracy),
      correctAttempts: correct,
      totalAttempts: total,
      durationSeconds: 60,
      mode: this.mode
    });

    this.scene.start('ResultsScene', {
      score: this.score,
      correct,
      total,
      accuracy,
      isHighScore: result.isHighScore,
      rank: result.rank
    });
  } catch (error) {
    console.error('Failed to save score:', error);
    // Still show results even if save failed
    this.scene.start('ResultsScene', {
      score: this.score,
      correct,
      total,
      accuracy
    });
  }
}
```

**New File: `child-portal/src/services/api.js`**
```javascript
const API_BASE = import.meta.env.VITE_API_BASE || 'https://api.adhdlearn.com';

export async function saveSession(data) {
  const response = await fetch(`${API_BASE}/api/sessions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`);
  }

  return response.json();
}

export async function getHighScores(gameName, limit = 10) {
  const response = await fetch(
    `${API_BASE}/api/sessions/high-scores?game=${encodeURIComponent(gameName)}&limit=${limit}`
  );

  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`);
  }

  return response.json();
}
```

**Modified File: `child-portal/src/games/reading/letter-pop/scenes/ResultsScene.js`**
```javascript
import { getHighScores } from '../../../services/api';

export default class ResultsScene extends Phaser.Scene {
  constructor() {
    super({ key: 'ResultsScene' });
  }

  async create(data) {
    // ... existing title and score display ...

    // Show "NEW HIGH SCORE!" if applicable
    if (data.isHighScore) {
      this.add.text(
        this.cameras.main.centerX,
        150,
        `🏆 NEW HIGH SCORE! #${data.rank}`,
        { fontSize: '32px', fontFamily: 'Comic Neue', color: '#FFD93D' }
      ).setOrigin(0.5);
    }

    // Fetch high scores from API
    try {
      const result = await getHighScores('Letter Pop', 5);

      this.add.text(
        this.cameras.main.centerX,
        350,
        'All-Time High Scores:',
        { fontSize: '24px', fontFamily: 'Comic Neue', color: '#fff' }
      ).setOrigin(0.5);

      result.scores.forEach((score, i) => {
        const date = new Date(score.playedAt).toLocaleDateString();
        this.add.text(
          this.cameras.main.centerX,
          390 + i * 30,
          `${i + 1}. ${score.score} points (${score.accuracyPercentage}%) - ${date}`,
          { fontSize: '20px', fontFamily: 'Comic Neue', color: '#fff' }
        ).setOrigin(0.5);
      });
    } catch (error) {
      console.error('Failed to fetch high scores:', error);
      // Show localStorage scores as fallback
      this.showLocalScores();
    }

    // ... Play Again button ...
  }

  showLocalScores() {
    // Fallback to localStorage (existing code from Phase 2)
  }
}
```

### Backend Implementation

**New Files in `backend/`:**

**`src/index.js`**
```javascript
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: [
    'https://child.adhdlearn.com',
    'https://child-staging.adhdlearn.com',
    'http://localhost:5173'
  ]
}));
app.use(express.json());

// Database connection pool
const pool = mysql.createPool({
  host: 'localhost',
  user: process.env.DB_USER || 'adhdlearn',
  password: process.env.DB_PASSWORD,
  database: 'adhdlearn',
  waitForConnections: true,
  connectionLimit: 10
});

// POST /api/sessions
app.post('/api/sessions', async (req, res) => {
  try {
    const {
      gameName,
      score,
      accuracyPercentage,
      correctAttempts,
      totalAttempts,
      durationSeconds,
      mode
    } = req.body;

    // Validate input
    if (!gameName || score === undefined) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
    }

    // Insert session
    const [result] = await pool.execute(
      `INSERT INTO game_sessions
       (game_name, score, accuracy_percentage, correct_attempts, total_attempts, duration_seconds, mode)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [gameName, score, accuracyPercentage, correctAttempts, totalAttempts, durationSeconds, mode]
    );

    const sessionId = result.insertId;

    // Check if it's a high score
    const [scores] = await pool.execute(
      `SELECT COUNT(*) as rank FROM game_sessions
       WHERE game_name = ? AND score > ?`,
      [gameName, score]
    );

    const rank = scores[0].rank + 1;
    const isHighScore = rank <= 10;

    res.status(201).json({
      success: true,
      sessionId,
      isHighScore,
      rank
    });
  } catch (error) {
    console.error('Error saving session:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// GET /api/sessions/high-scores
app.get('/api/sessions/high-scores', async (req, res) => {
  try {
    const gameName = req.query.game || 'Letter Pop';
    const limit = parseInt(req.query.limit) || 10;

    const [scores] = await pool.execute(
      `SELECT session_id, score, accuracy_percentage, played_at
       FROM game_sessions
       WHERE game_name = ?
       ORDER BY score DESC, played_at DESC
       LIMIT ?`,
      [gameName, limit]
    );

    res.json({
      success: true,
      scores: scores.map(row => ({
        sessionId: row.session_id,
        score: row.score,
        accuracyPercentage: row.accuracy_percentage,
        playedAt: row.played_at
      }))
    });
  } catch (error) {
    console.error('Error fetching high scores:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`API server running on port ${PORT}`);
});
```

**`backend/package.json`**
```json
{
  "name": "adhdlearn-backend",
  "version": "1.0.0",
  "main": "src/index.js",
  "scripts": {
    "start": "node src/index.js",
    "dev": "nodemon src/index.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "mysql2": "^3.6.0"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  }
}
```

### Database Setup Script

**`backend/scripts/setup-database.sql`**
```sql
-- Create database
CREATE DATABASE IF NOT EXISTS adhdlearn;
USE adhdlearn;

-- Create game_sessions table
CREATE TABLE IF NOT EXISTS game_sessions (
    session_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    game_name VARCHAR(50) NOT NULL,
    score INT NOT NULL,
    accuracy_percentage DECIMAL(5,2),
    correct_attempts INT,
    total_attempts INT,
    duration_seconds INT,
    mode VARCHAR(20),
    played_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_game_score (game_name, score DESC),
    INDEX idx_played_at (played_at DESC)
);

-- Create database user
CREATE USER IF NOT EXISTS 'adhdlearn'@'localhost' IDENTIFIED BY 'your_password_here';
GRANT ALL PRIVILEGES ON adhdlearn.* TO 'adhdlearn'@'localhost';
FLUSH PRIVILEGES;
```

Run with:
```bash
mysql -u root -p < backend/scripts/setup-database.sql
```

### Deployment

**Backend (PM2):**
```bash
cd backend
npm install --production

# Create .env file
echo "DB_USER=adhdlearn" > .env
echo "DB_PASSWORD=your_password_here" >> .env
echo "PORT=3000" >> .env

# Start with PM2
pm2 start src/index.js --name adhdlearn-api
pm2 save
```

**Frontend:**
```bash
cd child-portal
npm run build
rsync -avz dist/ user@160.153.180.159:/var/www/adhdlearn.com/production/child/
```

### Acceptance Criteria

- [ ] MySQL database created with `game_sessions` table
- [ ] API running on localhost:3000 (PM2)
- [ ] POST /api/sessions saves scores to database
- [ ] GET /api/sessions/high-scores returns top scores
- [ ] Letter Pop sends score after each game
- [ ] Results screen fetches and displays database high scores
- [ ] "NEW HIGH SCORE!" shows when in top 10
- [ ] Scores persist across browser sessions
- [ ] Scores persist across devices
- [ ] API returns 400 for invalid input
- [ ] API returns 500 and logs errors for database failures

### McCabe Complexity

All functions ≤ 5:
- `POST /api/sessions` handler: 4
- `GET /api/sessions/high-scores` handler: 3
- `saveSession()` (frontend): 2
- `getHighScores()` (frontend): 2

### Dependencies

- Phase 0: Server infrastructure
- Phase 1: Project structure
- Phase 2: Letter Pop game

---

*Due to context limits, I'll continue with Phases 4-36 in the same detailed format. This shows the structure - each phase has:*

1. **What This Phase Delivers** (clear value proposition)
2. **Database Changes** (CREATE/ALTER statements)
3. **API Endpoints** (routes, request/response specs)
4. **Frontend Changes** (new files, modified files, code)
5. **Technical Specifications** (detailed implementation)
6. **Deployment** (commands to deploy)
7. **Acceptance Criteria** (checklist for phase completion)
8. **McCabe Complexity** (all functions ≤ 5)
9. **Dependencies** (which phases must be done first)

*Continuing with remaining phases...*

---

