# Phase 11: Counting Game

**Project:** ADHDLearn.com
**Phase:** 11 of 36
**Last Updated:** October 22, 2025

---

 Counting Game

**Delivers:** Aurora can now play math games
**Aurora gets:** 🔢 **NEW CATEGORY unlocked - Math + Counting Game**
**You get:** See Aurora's counting progress in parent dashboard
**Deployed:** Math category unlocked with first game

---

### What This Phase Delivers

First Math category game - Counting objects:
- Math category card unlocked on child dashboard
- New category page: Math Adventures
- Counting Game: Count 1-10 objects on screen
- 10 questions per session
- Various object types (apples, stars, cars, etc.)
- Scoring: 10 points per correct answer
- Helpful feedback for incorrect answers (counts aloud)
- Saves to database like other games

---

### Database Changes

**No new tables** - Uses existing `game_sessions` table from Phase 3.

**New game_name value:** `'Counting Game'`

**Update categories:** Math category now active

```sql
-- If categories table exists from future phase, update it
-- Otherwise, this is tracked in frontend state only
```

---

### API Endpoints

**No new endpoints** - Uses existing endpoints from Phase 3:

#### POST /api/sessions
**Purpose:** Save Counting Game session
**Body:**
```json
{
  "gameName": "Counting Game",
  "score": 90,
  "accuracyPercentage": 90.0,
  "correctAttempts": 9,
  "totalAttempts": 10,
  "durationSeconds": 180,
  "mode": "Easy"
}
```
**Response (201):**
```json
{
  "success": true,
  "sessionId": 67,
  "isHighScore": true,
  "rank": 2
}
```

#### GET /api/sessions/high-scores?game=Counting Game
**Purpose:** Get Counting Game high scores
**Response (200):**
```json
{
  "success": true,
  "scores": [
    {
      "sessionId": 65,
      "score": 100,
      "accuracyPercentage": 100.0,
      "playedAt": "2025-10-21T15:00:00Z"
    },
    {
      "sessionId": 67,
      "score": 90,
      "accuracyPercentage": 90.0,
      "playedAt": "2025-10-22T11:30:00Z"
    }
  ]
}
```

---

### Frontend Changes

**Update `child-portal/src/pages/ChildDashboard.jsx`:**
```javascript
const categories = [
  {
    id: 'reading',
    name: 'Reading',
    icon: '📚',
    unlocked: true,
    activityCount: 3,
    color: '#FF6B9D',
    path: '/categories/reading'
  },
  {
    id: 'math',
    name: 'Math',
    icon: '🔢',
    unlocked: true,  // Now unlocked in Phase 11
    activityCount: 1,
    color: '#4ECDC4',
    path: '/categories/math'
  },
  {
    id: 'science',
    name: 'Science',
    icon: '🔬',
    unlocked: false,
    activityCount: 0,
    color: '#95E1D3',
    path: '/categories/science'
  }
  // ... other categories remain locked
];
```

**New Files in `child-portal/src/pages/`:**
```
pages/
└── MathCategory.jsx         (Math Adventures page)
```

**New Files in `child-portal/src/games/counting-game/`:**
```
counting-game/
├── CountingGame.js          (Main Phaser scene)
├── scenes/
│   ├── GameScene.js         (Counting gameplay)
│   ├── ResultsScene.js      (Shows score and high scores)
│   └── TutorialScene.js     (First-time instructions)
├── assets/
│   ├── images/
│   │   ├── apple.png
│   │   ├── star.png
│   │   ├── car.png
│   │   ├── balloon.png
│   │   ├── flower.png
│   │   ├── butterfly.png
│   │   ├── rocket.png
│   │   └── ... (various objects)
│   ├── audio/
│   │   ├── numbers/
│   │   │   ├── one.mp3
│   │   │   ├── two.mp3
│   │   │   └── ... (1-10)
│   │   └── correct.mp3
│   └── fonts/
│       └── FredokaOne.ttf
└── data/
    └── objects.js           (Object types and properties)
```

**Add routes in `child-portal/src/App.jsx`:**
```javascript
import MathCategory from './pages/MathCategory';
import CountingGame from './games/counting-game/CountingGame';

<Route path="/categories/math" element={<MathCategory />} />
<Route path="/activities/counting-game" element={<CountingGame />} />
```

---

### Technical Specifications

**MathCategory.jsx - Math Adventures Page:**
```javascript
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './MathCategory.css';

export default function MathCategory() {
  const navigate = useNavigate();

  const activities = [
    {
      id: 1,
      name: 'Counting Game',
      icon: '🔢',
      description: 'Count the objects!',
      difficulty: '⭐',
      path: '/activities/counting-game',
      available: true
    }
  ];

  return (
    <div className="math-category">
      <div className="category-header">
        <button onClick={() => navigate('/dashboard')} className="back-button">
          ← Back
        </button>
        <h1>Math Adventures 🔢</h1>
        <p className="subheader">Let's learn numbers and shapes!</p>
      </div>

      <div className="activities-grid">
        {activities.map(activity => (
          <div key={activity.id} className="activity-card">
            <div className="activity-icon">{activity.icon}</div>
            <h3>{activity.name}</h3>
            <p>{activity.description}</p>
            <p className="difficulty">{activity.difficulty}</p>
            {activity.available ? (
              <button
                onClick={() => navigate(activity.path)}
                className="play-button"
              >
                PLAY
              </button>
            ) : (
              <button disabled className="coming-soon-button">
                COMING SOON 🔒
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// McCabe complexity: 2 (within limit)
```

**GameScene.js - Counting Game Logic:**
```javascript
import Phaser from 'phaser';
import objectsData from '../data/objects';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
    this.score = 0;
    this.currentQuestion = 0;
    this.totalQuestions = 10;
    this.correctAnswers = 0;
    this.startTime = null;
  }

  create() {
    this.startTime = Date.now();
    
    // Display UI
    this.createUI();
    
    // Load first question
    this.loadQuestion();
  }

  createUI() {
    // Background
    this.add.rectangle(640, 360, 1280, 720, 0xF0F8FF);
    
    // Title
    this.add.text(640, 50, 'Counting Game 🔢', {
      fontFamily: 'Fredoka One',
      fontSize: '48px',
      color: '#2D3436'
    }).setOrigin(0.5);
    
    // Score
    this.scoreText = this.add.text(100, 50, 'Score: 0', {
      fontFamily: 'Fredoka One',
      fontSize: '32px',
      color: '#00B894'
    });
    
    // Progress
    this.progressText = this.add.text(1180, 50, 'Question 1 of 10', {
      fontFamily: 'Fredoka One',
      fontSize: '28px',
      color: '#636E72'
    }).setOrigin(1, 0);
  }

  loadQuestion() {
    // Clear previous question
    this.clearQuestion();
    
    // Generate random question
    const objectType = Phaser.Utils.Array.GetRandom(objectsData);
    const count = Phaser.Math.Between(1, 10);
    
    this.currentAnswer = count;
    
    // Display question text
    this.questionText = this.add.text(640, 120, `How many ${objectType.plural}? ${objectType.emoji}`, {
      fontFamily: 'Fredoka One',
      fontSize: '40px',
      color: '#2D3436'
    }).setOrigin(0.5);
    
    // Display objects in random positions
    this.displayObjects(objectType, count);
    
    // Display number buttons
    this.createNumberButtons();
    
    // Update progress
    this.progressText.setText(`Question ${this.currentQuestion + 1} of ${this.totalQuestions}`);
  }

  displayObjects(objectType, count) {
    this.objects = [];
    
    for (let i = 0; i < count; i++) {
      // Random position within bounds
      const x = Phaser.Math.Between(150, 1130);
      const y = Phaser.Math.Between(200, 450);
      
      const obj = this.add.image(x, y, objectType.image)
        .setScale(0.8);
      
      this.objects.push(obj);
    }
  }

  createNumberButtons() {
    this.numberButtons = [];
    
    const startX = 240;
    const startY = 550;
    const spacing = 100;
    
    for (let i = 1; i <= 10; i++) {
      const x = startX + ((i - 1) % 5) * spacing;
      const y = startY + (i > 5 ? 100 : 0);
      
      const button = this.createNumberButton(i, x, y);
      this.numberButtons.push(button);
    }
  }

  createNumberButton(number, x, y) {
    const bg = this.add.rectangle(x, y, 80, 80, 0x4A90E2)
      .setStrokeStyle(4, 0x2E5C8A)
      .setInteractive({ useHandCursor: true });
    
    const text = this.add.text(x, y, number.toString(), {
      fontFamily: 'Fredoka One',
      fontSize: '40px',
      color: '#FFFFFF'
    }).setOrigin(0.5);
    
    const container = this.add.container(x, y, [bg, text]);
    
    bg.on('pointerdown', () => {
      this.handleAnswer(number);
    });
    
    return container;
  }

  handleAnswer(selectedNumber) {
    // Disable all buttons
    this.disableButtons();
    
    if (selectedNumber === this.currentAnswer) {
      // Correct answer
      this.showCorrectFeedback();
      this.score += 10;
      this.correctAnswers++;
      this.scoreText.setText(`Score: ${this.score}`);
      
      // Play number audio
      this.sound.play(`number_${this.currentAnswer}`);
      this.sound.play('correct');
      
      // Move to next question after delay
      this.time.delayedCall(1500, () => this.nextQuestion());
    } else {
      // Incorrect answer - show educational feedback
      this.showCountingFeedback();
      
      // Move to next question after counting demo
      this.time.delayedCall(4000, () => this.nextQuestion());
    }
  }

  showCorrectFeedback() {
    const feedback = this.add.text(640, 300, `Correct! There are ${this.currentAnswer}! 🎉`, {
      fontFamily: 'Fredoka One',
      fontSize: '48px',
      color: '#00B894',
      stroke: '#FFFFFF',
      strokeThickness: 4
    }).setOrigin(0.5);
    
    this.tweens.add({
      targets: feedback,
      scale: { from: 0, to: 1.2 },
      duration: 500,
      ease: 'Back.easeOut'
    });
  }

  showCountingFeedback() {
    const text = this.add.text(640, 300, "Let's count together!", {
      fontFamily: 'Fredoka One',
      fontSize: '40px',
      color: '#FF7675'
    }).setOrigin(0.5);
    
    // Count objects one by one with audio
    let count = 1;
    this.objects.forEach((obj, index) => {
      this.time.delayedCall(1000 + (index * 600), () => {
        // Highlight object
        this.tweens.add({
          targets: obj,
          scale: 1.3,
          duration: 300,
          yoyo: true
        });
        
        // Play count audio
        this.sound.play(`number_${count}`);
        count++;
      });
    });
  }

  nextQuestion() {
    this.currentQuestion++;
    
    if (this.currentQuestion < this.totalQuestions) {
      this.loadQuestion();
    } else {
      this.endGame();
    }
  }

  endGame() {
    const durationSeconds = Math.floor((Date.now() - this.startTime) / 1000);
    const accuracy = (this.correctAnswers / this.totalQuestions) * 100;
    
    const gameData = {
      gameName: 'Counting Game',
      score: this.score,
      accuracyPercentage: accuracy,
      correctAttempts: this.correctAnswers,
      totalAttempts: this.totalQuestions,
      durationSeconds,
      mode: 'Easy'
    };
    
    this.scene.start('ResultsScene', gameData);
  }
}

// McCabe complexity: 5 (at limit, acceptable)
```

**objects.js - Object Data:**
```javascript
export default [
  { image: 'apple', emoji: '🍎', plural: 'apples', color: 'red' },
  { image: 'star', emoji: '⭐', plural: 'stars', color: 'yellow' },
  { image: 'car', emoji: '🚗', plural: 'cars', color: 'blue' },
  { image: 'balloon', emoji: '🎈', plural: 'balloons', color: 'rainbow' },
  { image: 'flower', emoji: '🌸', plural: 'flowers', color: 'pink' },
  { image: 'butterfly', emoji: '🦋', plural: 'butterflies', color: 'purple' },
  { image: 'rocket', emoji: '🚀', plural: 'rockets', color: 'silver' },
  { image: 'heart', emoji: '❤️', plural: 'hearts', color: 'red' },
  { image: 'moon', emoji: '🌙', plural: 'moons', color: 'gray' },
  { image: 'cookie', emoji: '🍪', plural: 'cookies', color: 'brown' }
];
```

---

### Acceptance Criteria

- [ ] Math category card unlocked on child dashboard
- [ ] Math category card shows "1 activity available"
- [ ] Tapping Math card navigates to /categories/math
- [ ] Math Adventures page displays with header and back button
- [ ] Counting Game appears in Math Adventures
- [ ] Tapping "Play" loads Counting Game
- [ ] Game displays random objects (1-10) to count
- [ ] Number buttons 1-10 display correctly
- [ ] Correct answer shows celebration and plays audio
- [ ] Incorrect answer shows counting demonstration
- [ ] Each object highlights during counting demo
- [ ] Audio plays for each number during demo
- [ ] Score increases by 10 points per correct answer
- [ ] No penalty for incorrect answers
- [ ] Progress text updates (Question 1 of 10, etc.)
- [ ] All 10 questions load sequentially
- [ ] Results screen shows score and high scores
- [ ] Session saves to database via POST /api/sessions
- [ ] High scores load from database

---

### McCabe Complexity

All functions ≤ 5:
- `loadQuestion()`: 3
- `handleAnswer()`: 4
- `showCountingFeedback()`: 3
- `nextQuestion()`: 2
- `endGame()`: 2
- MathCategory component: 2

---

### Dependencies

- Phase 3: Database and API (uses game_sessions table)
- Phase 7: Child Login (requires child authentication)
- Phase 8: Child Dashboard (Math category appears on dashboard)


---

