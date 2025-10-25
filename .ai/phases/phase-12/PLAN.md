# Phase 12: Shapes Recognition Game

**Project:** ADHDLearn.com
**Phase:** 12 of 36
**Last Updated:** October 22, 2025

---

 Shapes Recognition Game

**Delivers:** 2nd Math game
**Aurora gets:** 🎮 **NEW GAME - Shapes Recognition**
**You get:** See Aurora's shapes progress in parent dashboard
**Deployed:** 5 total games (3 Reading + 2 Math)

---

### What This Phase Delivers

Shapes Recognition game in Math category:
- Identify basic 2D shapes (circle, square, triangle, rectangle, star, heart, hexagon, oval)
- 10 questions per session
- Multiple choice format (4 shape options)
- Visual + audio (shape name pronunciation)
- Scoring: 10 points per correct answer
- Colorful animations and feedback
- Saves to database like other games
- Appears in Math category alongside Counting Game

---

### Database Changes

**No new tables** - Uses existing `game_sessions` table from Phase 3.

**New game_name value:** `'Shapes Recognition'`

Example record:
```sql
INSERT INTO game_sessions (game_name, score, accuracy_percentage, correct_attempts, total_attempts, duration_seconds, mode)
VALUES ('Shapes Recognition', 100, 100.0, 10, 10, 195, 'Easy');
```

---

### API Endpoints

**No new endpoints** - Uses existing endpoints from Phase 3:

#### POST /api/sessions
**Purpose:** Save Shapes Recognition game session
**Body:**
```json
{
  "gameName": "Shapes Recognition",
  "score": 100,
  "accuracyPercentage": 100.0,
  "correctAttempts": 10,
  "totalAttempts": 10,
  "durationSeconds": 195,
  "mode": "Easy"
}
```
**Response (201):**
```json
{
  "success": true,
  "sessionId": 78,
  "isHighScore": true,
  "rank": 1
}
```

#### GET /api/sessions/high-scores?game=Shapes Recognition
**Purpose:** Get Shapes Recognition high scores
**Response (200):**
```json
{
  "success": true,
  "scores": [
    {
      "sessionId": 78,
      "score": 100,
      "accuracyPercentage": 100.0,
      "playedAt": "2025-10-22T12:00:00Z"
    }
  ]
}
```

---

### Frontend Changes

**Update `child-portal/src/pages/MathCategory.jsx`:**
```javascript
const activities = [
  {
    id: 1,
    name: 'Counting Game',
    icon: '🔢',
    description: 'Count the objects!',
    difficulty: '⭐',
    path: '/activities/counting-game',
    available: true
  },
  {
    id: 2,
    name: 'Shapes',
    icon: '🔷',
    description: 'Learn shapes!',
    difficulty: '⭐⭐',
    path: '/activities/shapes',
    available: true
  }
];
```

**New Files in `child-portal/src/games/shapes/`:**
```
shapes/
├── ShapesGame.js            (Main Phaser scene)
├── scenes/
│   ├── GameScene.js         (Shapes recognition gameplay)
│   ├── ResultsScene.js      (Shows score and high scores)
│   └── TutorialScene.js     (First-time instructions)
├── assets/
│   ├── images/
│   │   ├── circle.png
│   │   ├── square.png
│   │   ├── triangle.png
│   │   ├── rectangle.png
│   │   ├── star.png
│   │   ├── heart.png
│   │   ├── hexagon.png
│   │   └── oval.png
│   ├── audio/
│   │   ├── circle.mp3
│   │   ├── square.mp3
│   │   ├── triangle.mp3
│   │   └── ... (8 shape audio files)
│   └── fonts/
│       └── FredokaOne.ttf
└── data/
    └── shapes.js            (Shape definitions)
```

**Add route in `child-portal/src/App.jsx`:**
```javascript
import ShapesGame from './games/shapes/ShapesGame';

<Route path="/activities/shapes" element={<ShapesGame />} />
```

**Update dashboard count in `child-portal/src/pages/ChildDashboard.jsx`:**
```javascript
{
  id: 'math',
  name: 'Math',
  icon: '🔢',
  unlocked: true,
  activityCount: 2,  // Updated from 1 to 2
  color: '#4ECDC4',
  path: '/categories/math'
}
```

---

### Technical Specifications

**GameScene.js - Shapes Recognition Logic:**
```javascript
import Phaser from 'phaser';
import shapesData from '../data/shapes';

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
    // Background gradient
    this.add.rectangle(640, 360, 1280, 720, 0xE8F4F8);
    
    // Title
    this.add.text(640, 50, 'Shapes 🔷', {
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
    
    // Select random shape as target
    const targetShape = Phaser.Utils.Array.GetRandom(shapesData);
    this.currentAnswer = targetShape.name;
    
    // Display question text
    this.questionText = this.add.text(640, 120, `Find the ${targetShape.name}!`, {
      fontFamily: 'Fredoka One',
      fontSize: '40px',
      color: '#2D3436'
    }).setOrigin(0.5);
    
    // Play audio
    this.sound.play(`shape_${targetShape.name.toLowerCase()}`);
    
    // Display target shape (large, centered)
    this.targetShapeImage = this.add.image(640, 280, targetShape.image)
      .setScale(1.5)
      .setTint(targetShape.color);
    
    // Create answer choices (4 shapes)
    this.createAnswerChoices(targetShape);
    
    // Update progress
    this.progressText.setText(`Question ${this.currentQuestion + 1} of ${this.totalQuestions}`);
  }

  createAnswerChoices(targetShape) {
    // Get target + 3 distractors
    const distractors = shapesData
      .filter(s => s.name !== targetShape.name)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    
    const choices = [targetShape, ...distractors];
    Phaser.Utils.Array.Shuffle(choices);
    
    // Display choices in 2x2 grid
    const positions = [
      { x: 420, y: 520 },
      { x: 860, y: 520 },
      { x: 420, y: 620 },
      { x: 860, y: 620 }
    ];
    
    this.choiceButtons = [];
    
    choices.forEach((shape, index) => {
      const pos = positions[index];
      const button = this.createChoiceButton(shape, pos.x, pos.y);
      this.choiceButtons.push(button);
    });
  }

  createChoiceButton(shape, x, y) {
    const bg = this.add.rectangle(x, y, 180, 80, 0xFFFFFF)
      .setStrokeStyle(4, 0xDFE6E9)
      .setInteractive({ useHandCursor: true });
    
    const icon = this.add.image(x - 50, y, shape.image)
      .setScale(0.4)
      .setTint(shape.color);
    
    const text = this.add.text(x + 20, y, shape.name, {
      fontFamily: 'Fredoka One',
      fontSize: '24px',
      color: '#2D3436'
    }).setOrigin(0, 0.5);
    
    const container = this.add.container(x, y, [bg, icon, text]);
    container.setData('shapeName', shape.name);
    
    bg.on('pointerdown', () => {
      this.handleAnswer(shape.name, container);
    });
    
    bg.on('pointerover', () => {
      bg.setFillStyle(0xE8F4F8);
    });
    
    bg.on('pointerout', () => {
      bg.setFillStyle(0xFFFFFF);
    });
    
    return container;
  }

  handleAnswer(selectedShape, selectedButton) {
    // Disable all buttons
    this.disableButtons();
    
    if (selectedShape === this.currentAnswer) {
      // Correct answer
      this.showCorrectFeedback(selectedButton);
      this.score += 10;
      this.correctAnswers++;
      this.scoreText.setText(`Score: ${this.score}`);
      
      // Play shape audio again
      this.sound.play(`shape_${this.currentAnswer.toLowerCase()}`);
      this.sound.play('correct');
      
      // Move to next question after delay
      this.time.delayedCall(1500, () => this.nextQuestion());
    } else {
      // Incorrect answer
      this.showIncorrectFeedback(selectedButton);
      
      // Move to next question after delay
      this.time.delayedCall(2000, () => this.nextQuestion());
    }
  }

  showCorrectFeedback(button) {
    const feedback = this.add.text(640, 450, '✅ Correct!', {
      fontFamily: 'Fredoka One',
      fontSize: '48px',
      color: '#00B894',
      stroke: '#FFFFFF',
      strokeThickness: 4
    }).setOrigin(0.5);
    
    // Bounce animation
    this.tweens.add({
      targets: feedback,
      scale: { from: 0, to: 1.2 },
      duration: 500,
      ease: 'Back.easeOut'
    });
    
    // Celebrate target shape
    this.tweens.add({
      targets: this.targetShapeImage,
      angle: 360,
      scale: 2.0,
      duration: 1000,
      ease: 'Bounce.easeOut'
    });
  }

  showIncorrectFeedback(button) {
    const feedback = this.add.text(640, 450, `That's a ${this.currentAnswer}! Try again!`, {
      fontFamily: 'Fredoka One',
      fontSize: '36px',
      color: '#FF7675'
    }).setOrigin(0.5);
    
    // Shake animation
    this.cameras.main.shake(200, 0.005);
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
      gameName: 'Shapes Recognition',
      score: this.score,
      accuracyPercentage: accuracy,
      correctAttempts: this.correctAnswers,
      totalAttempts: this.totalQuestions,
      durationSeconds,
      mode: 'Easy'
    };
    
    this.scene.start('ResultsScene', gameData);
  }

  clearQuestion() {
    if (this.questionText) this.questionText.destroy();
    if (this.targetShapeImage) this.targetShapeImage.destroy();
    if (this.choiceButtons) {
      this.choiceButtons.forEach(btn => btn.destroy());
    }
  }

  disableButtons() {
    this.choiceButtons.forEach(btn => {
      btn.list[0].disableInteractive();
    });
  }
}

// McCabe complexity: 5 (at limit, acceptable)
```

**shapes.js - Shape Definitions:**
```javascript
export default [
  { name: 'Circle', image: 'circle', color: 0xFF6B9D },
  { name: 'Square', image: 'square', color: 0x4ECDC4 },
  { name: 'Triangle', image: 'triangle', color: 0xFFD93D },
  { name: 'Rectangle', image: 'rectangle', color: 0x95E1D3 },
  { name: 'Star', image: 'star', color: 0xFECE63 },
  { name: 'Heart', image: 'heart', color: 0xFF6B9D },
  { name: 'Hexagon', image: 'hexagon', color: 0x6C5CE7 },
  { name: 'Oval', image: 'oval', color: 0xA29BFE }
];
```

---

### Acceptance Criteria

- [ ] Shapes game appears in Math Adventures page
- [ ] Math category shows "2 activities available" on dashboard
- [ ] Game loads with first shape question
- [ ] Target shape displays large and centered
- [ ] Audio pronunciation plays automatically
- [ ] 4 answer choices display in grid (1 correct, 3 wrong)
- [ ] Hover effect works on choice buttons
- [ ] Correct answer shows celebration animation
- [ ] Target shape rotates and grows on correct answer
- [ ] Incorrect answer shows friendly feedback
- [ ] Score increases by 10 points per correct answer
- [ ] Progress text updates (Question 1 of 10, etc.)
- [ ] All 10 questions load sequentially
- [ ] 8 different shapes appear throughout session
- [ ] Results screen shows score and high scores
- [ ] Session saves to database via POST /api/sessions
- [ ] High scores load from database
- [ ] Game works on touch devices

---

### McCabe Complexity

All functions ≤ 5:
- `loadQuestion()`: 3
- `createAnswerChoices()`: 3
- `handleAnswer()`: 4
- `showCorrectFeedback()`: 2
- `nextQuestion()`: 2
- `endGame()`: 2

---

### Dependencies

- Phase 3: Database and API (uses game_sessions table)
- Phase 7: Child Login (requires child authentication)
- Phase 11: Counting Game (Shapes appears alongside in Math category)


---

