# Phase 10: Sight Words Game

**Project:** ADHDLearn.com
**Phase:** 10 of 36
**Last Updated:** October 22, 2025

---

 Sight Words Game

**Delivers:** Aurora has a 3rd game (flash cards for common words)
**Aurora gets:** 🎯 **NEW GAME - Sight Words flash cards**
**You get:** See Aurora's sight word progress and accuracy
**Deployed:** 3 working games in Reading category

---

### What This Phase Delivers

Sight Words flash card game using Dolch word list:
- 20 words per session (adaptive difficulty)
- Each word shows with audio pronunciation
- 3 image choices (1 correct, 2 distractors)
- Sentence context for each word
- Scoring: 10 points per correct answer
- Spaced repetition algorithm (harder words appear more often)
- Tracks word mastery per child
- Appears in Reading category (3rd game)

---

### Database Changes

**New Table:** `sight_word_mastery`
```sql
CREATE TABLE sight_word_mastery (
    mastery_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    word VARCHAR(50) NOT NULL,
    correct_count INT DEFAULT 0,
    incorrect_count INT DEFAULT 0,
    last_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    mastery_level ENUM('learning', 'practicing', 'mastered') DEFAULT 'learning',
    
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    UNIQUE KEY uk_user_word (user_id, word),
    INDEX idx_user_mastery (user_id, mastery_level),
    INDEX idx_last_seen (last_seen)
);
```

**Game sessions** continue to use existing `game_sessions` table with `game_name = 'Sight Words'`.

---

### API Endpoints

#### POST /api/sessions (existing endpoint, new game type)
**Purpose:** Save Sight Words game session
**Body:**
```json
{
  "gameName": "Sight Words",
  "score": 180,
  "accuracyPercentage": 90.0,
  "correctAttempts": 18,
  "totalAttempts": 20,
  "durationSeconds": 320,
  "mode": "Pre-Primer"
}
```
**Response (201):**
```json
{
  "success": true,
  "sessionId": 56,
  "isHighScore": false,
  "rank": 5
}
```

#### POST /api/sight-words/record
**Purpose:** Record individual word attempt (for spaced repetition)
**Headers:** `Authorization: Bearer {token}`
**Body:**
```json
{
  "word": "THE",
  "correct": true
}
```
**Response (200):**
```json
{
  "success": true,
  "mastery": {
    "word": "THE",
    "correctCount": 15,
    "incorrectCount": 2,
    "masteryLevel": "mastered"
  }
}
```

#### GET /api/sight-words/next-words?count=20
**Purpose:** Get next words for session (adaptive difficulty)
**Headers:** `Authorization: Bearer {token}`
**Response (200):**
```json
{
  "success": true,
  "words": [
    {
      "word": "BECAUSE",
      "level": "Second Grade",
      "correctCount": 3,
      "incorrectCount": 7,
      "masteryLevel": "learning"
    },
    {
      "word": "THE",
      "level": "Pre-Primer",
      "correctCount": 15,
      "incorrectCount": 2,
      "masteryLevel": "mastered"
    }
  ]
}
```

**Algorithm:**
- 60% words from 'learning' level (low success rate)
- 30% words from 'practicing' level (medium success rate)
- 10% words from 'mastered' level (high success rate, for review)

#### GET /api/sight-words/progress
**Purpose:** Get child's overall sight word progress
**Headers:** `Authorization: Bearer {token}`
**Response (200):**
```json
{
  "success": true,
  "totalWords": 220,
  "learning": 45,
  "practicing": 80,
  "mastered": 95,
  "recentWords": [
    { "word": "BECAUSE", "masteryLevel": "learning", "lastSeen": "2025-10-22T10:30:00Z" }
  ]
}
```

---

### Frontend Changes

**New Files in `child-portal/src/games/sight-words/`:**
```
sight-words/
├── SightWordsGame.js        (Main Phaser scene)
├── scenes/
│   ├── GameScene.js         (Flash card gameplay)
│   ├── ResultsScene.js      (Shows score and progress)
│   └── ProgressScene.js     (Shows mastered words)
├── assets/
│   ├── images/
│   │   └── sentences/       (Context images for each word)
│   │       ├── the.png      (Sentence: "THE cat sat")
│   │       ├── and.png      (Sentence: "cat AND dog")
│   │       └── ... (220 images)
│   ├── audio/
│   │   └── words/
│   │       ├── the.mp3
│   │       ├── and.mp3
│   │       └── ... (220 audio files)
│   └── fonts/
│       └── FredokaOne.ttf
└── data/
    └── dolchWords.js        (Dolch sight word list with levels)
```

**Update `child-portal/src/pages/ReadingCategory.jsx`:**
```javascript
const activities = [
  {
    id: 1,
    name: 'Letter Pop',
    icon: '🎈',
    description: 'Pop the correct letters!',
    difficulty: '⭐',
    path: '/activities/letter-pop',
    available: true
  },
  {
    id: 2,
    name: 'Word Builder',
    icon: '🏗️',
    description: 'Build words from letters!',
    difficulty: '⭐⭐',
    path: '/activities/word-builder',
    available: true
  },
  {
    id: 3,
    name: 'Sight Words',
    icon: '👀',
    description: 'Learn common words!',
    difficulty: '⭐⭐⭐',
    path: '/activities/sight-words',
    available: true
  }
];
```

**Add route in `child-portal/src/App.jsx`:**
```javascript
import SightWordsGame from './games/sight-words/SightWordsGame';

<Route path="/activities/sight-words" element={<SightWordsGame />} />
```

---

### Technical Specifications

**GameScene.js - Main Gameplay Logic:**
```javascript
import Phaser from 'phaser';
import api from '../../services/api';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
    this.score = 0;
    this.currentWordIndex = 0;
    this.totalWords = 20;
    this.correctAttempts = 0;
    this.startTime = null;
    this.sessionWords = [];
  }

  async create() {
    this.startTime = Date.now();
    
    // Fetch adaptive word list from API
    this.sessionWords = await this.fetchNextWords(this.totalWords);
    
    // Display UI
    this.createUI();
    
    // Load first word
    this.loadWord(this.sessionWords[this.currentWordIndex]);
  }

  async fetchNextWords(count) {
    try {
      const response = await api.get(`/api/sight-words/next-words?count=${count}`);
      return response.words;
    } catch (error) {
      console.error('Failed to fetch words:', error);
      // Fallback to random Pre-Primer words
      return this.getFallbackWords(count);
    }
  }

  loadWord(wordData) {
    const { word, level } = wordData;
    
    // Clear previous elements
    this.clearWordElements();
    
    // Display word in large text
    this.wordText = this.add.text(640, 150, word, {
      fontFamily: 'Fredoka One',
      fontSize: '72px',
      color: '#2D3436',
      stroke: '#FFFFFF',
      strokeThickness: 4
    }).setOrigin(0.5);
    
    // Play pronunciation
    this.sound.play(`word_${word.toLowerCase()}`);
    
    // Create answer choices
    this.createAnswerChoices(word);
    
    // Update progress text
    this.progressText.setText(`Word ${this.currentWordIndex + 1} of ${this.totalWords}`);
  }

  createAnswerChoices(word) {
    // Get correct image and 2 distractors
    const correctImage = this.getContextImage(word);
    const distractors = this.getDistractorImages(word, 2);
    
    const choices = [
      { image: correctImage, correct: true },
      { image: distractors[0], correct: false },
      { image: distractors[1], correct: false }
    ];
    
    // Shuffle choices
    Phaser.Utils.Array.Shuffle(choices);
    
    // Display choices
    const startX = 300;
    const spacing = 300;
    
    choices.forEach((choice, index) => {
      const x = startX + (index * spacing);
      const y = 450;
      
      this.createChoiceButton(choice, x, y);
    });
  }

  createChoiceButton(choice, x, y) {
    const container = this.add.container(x, y);
    
    // Choice background
    const bg = this.add.rectangle(0, 0, 250, 200, 0xFFFFFF)
      .setStrokeStyle(4, 0xDFE6E9)
      .setInteractive({ useHandCursor: true });
    
    // Choice image
    const image = this.add.image(0, 0, choice.image)
      .setDisplaySize(230, 180);
    
    container.add([bg, image]);
    container.setData('correct', choice.correct);
    
    // Click handler
    bg.on('pointerdown', () => {
      this.handleChoice(choice.correct, container);
    });
    
    this.choiceButtons.push(container);
  }

  async handleChoice(correct, selectedButton) {
    // Disable all buttons
    this.disableChoices();
    
    if (correct) {
      // Correct answer
      this.showCorrectFeedback(selectedButton);
      this.score += 10;
      this.correctAttempts++;
      this.scoreText.setText(`Score: ${this.score}`);
      
      // Record success
      const word = this.sessionWords[this.currentWordIndex].word;
      await this.recordWordAttempt(word, true);
      
      // Move to next word after delay
      this.time.delayedCall(1000, () => this.nextWord());
    } else {
      // Wrong answer
      this.showIncorrectFeedback(selectedButton);
      
      // Record failure
      const word = this.sessionWords[this.currentWordIndex].word;
      await this.recordWordAttempt(word, false);
      
      // Move to next word after showing correct answer
      this.time.delayedCall(2000, () => this.nextWord());
    }
  }

  async recordWordAttempt(word, correct) {
    try {
      await api.post('/api/sight-words/record', { word, correct });
    } catch (error) {
      console.error('Failed to record word attempt:', error);
    }
  }

  nextWord() {
    this.currentWordIndex++;
    
    if (this.currentWordIndex < this.totalWords) {
      this.loadWord(this.sessionWords[this.currentWordIndex]);
    } else {
      this.endGame();
    }
  }

  endGame() {
    const durationSeconds = Math.floor((Date.now() - this.startTime) / 1000);
    const accuracy = (this.correctAttempts / this.totalWords) * 100;
    
    const gameData = {
      gameName: 'Sight Words',
      score: this.score,
      accuracyPercentage: accuracy,
      correctAttempts: this.correctAttempts,
      totalAttempts: this.totalWords,
      durationSeconds,
      mode: 'Adaptive'
    };
    
    this.scene.start('ResultsScene', gameData);
  }
}

// McCabe complexity: 4 (within limit)
```

**Backend: `backend/src/controllers/sightWordsController.js`:**
```javascript
const pool = require('../db/pool');

async function recordWordAttempt(req, res) {
  const { word, correct } = req.body;
  const userId = req.user.userId; // From auth middleware
  
  if (!word || typeof correct !== 'boolean') {
    return res.status(400).json({
      success: false,
      error: 'Missing required fields'
    });
  }
  
  try {
    // Insert or update mastery record
    await pool.execute(`
      INSERT INTO sight_word_mastery (user_id, word, correct_count, incorrect_count)
      VALUES (?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        correct_count = correct_count + ?,
        incorrect_count = incorrect_count + ?,
        last_seen = CURRENT_TIMESTAMP
    `, [
      userId,
      word.toUpperCase(),
      correct ? 1 : 0,
      correct ? 0 : 1,
      correct ? 1 : 0,
      correct ? 0 : 1
    ]);
    
    // Update mastery level based on success rate
    await pool.execute(`
      UPDATE sight_word_mastery
      SET mastery_level = CASE
        WHEN correct_count / (correct_count + incorrect_count) >= 0.8 THEN 'mastered'
        WHEN correct_count / (correct_count + incorrect_count) >= 0.5 THEN 'practicing'
        ELSE 'learning'
      END
      WHERE user_id = ? AND word = ?
    `, [userId, word.toUpperCase()]);
    
    // Fetch updated mastery
    const [rows] = await pool.execute(
      'SELECT * FROM sight_word_mastery WHERE user_id = ? AND word = ?',
      [userId, word.toUpperCase()]
    );
    
    res.json({
      success: true,
      mastery: rows[0]
    });
  } catch (error) {
    console.error('Record word attempt error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
}

// McCabe complexity: 3 (within limit)

async function getNextWords(req, res) {
  const userId = req.user.userId;
  const count = parseInt(req.query.count) || 20;
  
  try {
    // Get word distribution: 60% learning, 30% practicing, 10% mastered
    const learningCount = Math.floor(count * 0.6);
    const practicingCount = Math.floor(count * 0.3);
    const masteredCount = count - learningCount - practicingCount;
    
    const words = [];
    
    // Fetch learning words
    const [learning] = await pool.execute(`
      SELECT word, mastery_level, correct_count, incorrect_count
      FROM sight_word_mastery
      WHERE user_id = ? AND mastery_level = 'learning'
      ORDER BY last_seen ASC
      LIMIT ?
    `, [userId, learningCount]);
    words.push(...learning);
    
    // Fetch practicing words
    const [practicing] = await pool.execute(`
      SELECT word, mastery_level, correct_count, incorrect_count
      FROM sight_word_mastery
      WHERE user_id = ? AND mastery_level = 'practicing'
      ORDER BY last_seen ASC
      LIMIT ?
    `, [userId, practicingCount]);
    words.push(...practicing);
    
    // Fetch mastered words
    const [mastered] = await pool.execute(`
      SELECT word, mastery_level, correct_count, incorrect_count
      FROM sight_word_mastery
      WHERE user_id = ? AND mastery_level = 'mastered'
      ORDER BY RAND()
      LIMIT ?
    `, [userId, masteredCount]);
    words.push(...mastered);
    
    // Shuffle final list
    const shuffled = words.sort(() => Math.random() - 0.5);
    
    res.json({
      success: true,
      words: shuffled
    });
  } catch (error) {
    console.error('Get next words error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
}

// McCabe complexity: 2 (within limit)

module.exports = {
  recordWordAttempt,
  getNextWords
};
```

---

### Acceptance Criteria

- [ ] Sight Words appears in Reading category (3rd game)
- [ ] Game loads with adaptive word list from API
- [ ] Word displays in large text with audio pronunciation
- [ ] 3 answer choices display (1 correct, 2 distractors)
- [ ] Correct choice shows green checkmark and celebration
- [ ] Incorrect choice shows red X and highlights correct answer
- [ ] Score increases by 10 points per correct answer
- [ ] No penalty for incorrect answers
- [ ] Word attempts recorded via POST /api/sight-words/record
- [ ] Spaced repetition algorithm prioritizes struggling words
- [ ] Mastery level updates automatically (learning → practicing → mastered)
- [ ] All 20 words load sequentially
- [ ] Results screen shows score and progress
- [ ] Session saves to game_sessions table
- [ ] Parent can see sight word progress in dashboard
- [ ] Dolch word list used (220 words total)
- [ ] Game works on touch devices

---

### McCabe Complexity

All functions ≤ 5:
- `loadWord()`: 3
- `handleChoice()`: 4
- `recordWordAttempt()` (backend): 3
- `getNextWords()` (backend): 2
- `nextWord()`: 2

---

### Dependencies

- Phase 3: Database and API (uses game_sessions table)
- Phase 7: Child Login (requires child authentication)
- Phase 8: Child Dashboard (Sight Words appears in Reading category)
- Phase 9: Word Builder (continues pattern of adding games to Reading)


---

