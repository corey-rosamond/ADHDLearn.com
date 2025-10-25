# Phase 13: Simple Addition Game

**Project:** ADHDLearn.com
**Phase:** 13 of 36
**Last Updated:** October 22, 2025

---

 Simple Addition Game

**Delivers:** 3rd Math game (addition practice)
**Aurora gets:** 🎮 **NEW GAME - Addition (1-10)**
**You get:** See Aurora's math skills developing in parent dashboard
**Deployed:** 6 total games (3 Reading + 3 Math)

---

### What This Phase Delivers

Simple Addition game in Math category:
- Addition problems with numbers 1-10
- Visual representation (count objects for each number)
- 10 questions per session
- Multiple choice format (4 answer options)
- Equation display: "3 + 5 = ?"
- Colorful animations and feedback
- Scoring: 10 points per correct answer
- Saves to database like other games
- Appears in Math category (3rd game)

---

### Database Changes

**No new tables** - Uses existing `game_sessions` table from Phase 3.

**New game_name value:** `'Addition Game'`

Example record:
```sql
INSERT INTO game_sessions (game_name, score, accuracy_percentage, correct_attempts, total_attempts, duration_seconds, mode)
VALUES ('Addition Game', 90, 90.0, 9, 10, 210, 'Easy');
```

---

### API Endpoints

**No new endpoints** - Uses existing endpoints from Phase 3:

#### POST /api/sessions
**Purpose:** Save Addition Game session
**Body:**
```json
{
  "gameName": "Addition Game",
  "score": 90,
  "accuracyPercentage": 90.0,
  "correctAttempts": 9,
  "totalAttempts": 10,
  "durationSeconds": 210,
  "mode": "Easy"
}
```
**Response (201):**
```json
{
  "success": true,
  "sessionId": 89,
  "isHighScore": false,
  "rank": 3
}
```

#### GET /api/sessions/high-scores?game=Addition Game
**Purpose:** Get Addition Game high scores
**Response (200):**
```json
{
  "success": true,
  "scores": [
    {
      "sessionId": 85,
      "score": 100,
      "accuracyPercentage": 100.0,
      "playedAt": "2025-10-21T16:00:00Z"
    },
    {
      "sessionId": 89,
      "score": 90,
      "accuracyPercentage": 90.0,
      "playedAt": "2025-10-22T13:00:00Z"
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
  },
  {
    id: 3,
    name: 'Addition',
    icon: '➕',
    description: 'Add numbers together!',
    difficulty: '⭐⭐⭐',
    path: '/activities/addition',
    available: true
  }
];
```

**New Files in `child-portal/src/games/addition/`:**
```
addition/
├── AdditionGame.js          (Main Phaser scene)
├── scenes/
│   ├── GameScene.js         (Addition gameplay)
│   ├── ResultsScene.js      (Shows score and high scores)
│   └── TutorialScene.js     (First-time instructions)
├── assets/
│   ├── images/
│   │   ├── apple.png        (For visual counting)
│   │   ├── star.png
│   │   └── ... (reuse from counting game)
│   ├── audio/
│   │   ├── numbers/
│   │   │   ├── one.mp3
│   │   │   └── ... (0-20)
│   │   └── plus.mp3         (Says "plus")
│   └── fonts/
│       └── FredokaOne.ttf
└── utils/
    └── problemGenerator.js  (Generates addition problems)
```

**Add route in `child-portal/src/App.jsx`:**
```javascript
import AdditionGame from './games/addition/AdditionGame';

<Route path="/activities/addition" element={<AdditionGame />} />
```

**Update dashboard count in `child-portal/src/pages/ChildDashboard.jsx`:**
```javascript
{
  id: 'math',
  name: 'Math',
  icon: '🔢',
  unlocked: true,
  activityCount: 3,  // Updated from 2 to 3
  color: '#4ECDC4',
  path: '/categories/math'
}
```

---

### Technical Specifications

**GameScene.js - Addition Game Logic:**
```javascript
import Phaser from 'phaser';
import { generateProblem } from '../utils/problemGenerator';

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
    this.add.rectangle(640, 360, 1280, 720, 0xFFF8E1);
    
    // Title
    this.add.text(640, 50, 'Addition ➕', {
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
    
    // Generate random addition problem (1-10)
    const problem = generateProblem(1, 10);
    this.currentAnswer = problem.answer;
    
    // Display equation
    this.displayEquation(problem);
    
    // Display visual representation
    this.displayVisuals(problem.num1, problem.num2);
    
    // Create answer choices
    this.createAnswerChoices(problem.answer);
    
    // Play audio: "3 plus 5 equals?"
    this.playProblemAudio(problem);
    
    // Update progress
    this.progressText.setText(`Question ${this.currentQuestion + 1} of ${this.totalQuestions}`);
  }

  displayEquation(problem) {
    this.equationText = this.add.text(640, 150, `${problem.num1} + ${problem.num2} = ?`, {
      fontFamily: 'Fredoka One',
      fontSize: '72px',
      color: '#2D3436',
      stroke: '#FFFFFF',
      strokeThickness: 4
    }).setOrigin(0.5);
  }

  displayVisuals(num1, num2) {
    // Display num1 apples on left
    const leftGroup = this.createObjectGroup(num1, 300, 300, 0xFF6B9D);
    
    // Display plus sign
    this.add.text(640, 300, '+', {
      fontFamily: 'Fredoka One',
      fontSize: '64px',
      color: '#2D3436'
    }).setOrigin(0.5);
    
    // Display num2 apples on right
    const rightGroup = this.createObjectGroup(num2, 980, 300, 0x4ECDC4);
  }

  createObjectGroup(count, centerX, centerY, color) {
    const objects = [];
    const radius = 40;
    const maxPerRow = 5;
    
    for (let i = 0; i < count; i++) {
      const row = Math.floor(i / maxPerRow);
      const col = i % maxPerRow;
      const x = centerX - (maxPerRow - 1) * 25 + col * 50;
      const y = centerY + row * 50;
      
      const obj = this.add.circle(x, y, radius, color)
        .setStroke(0xFFFFFF, 3);
      
      objects.push(obj);
    }
    
    return objects;
  }

  createAnswerChoices(correctAnswer) {
    // Generate 4 choices: correct + 3 plausible wrong answers
    const choices = [correctAnswer];
    
    // Add wrong answers (±1, ±2 from correct)
    const possibleWrong = [
      correctAnswer - 2,
      correctAnswer - 1,
      correctAnswer + 1,
      correctAnswer + 2
    ].filter(n => n > 0 && n <= 20 && n !== correctAnswer);
    
    // Pick 3 random wrong answers
    const wrongChoices = Phaser.Utils.Array.Shuffle(possibleWrong).slice(0, 3);
    choices.push(...wrongChoices);
    
    // Shuffle all choices
    Phaser.Utils.Array.Shuffle(choices);
    
    // Display choices in row
    const startX = 420;
    const spacing = 150;
    
    this.choiceButtons = [];
    
    choices.forEach((num, index) => {
      const x = startX + (index * spacing);
      const y = 550;
      const button = this.createChoiceButton(num, x, y);
      this.choiceButtons.push(button);
    });
  }

  createChoiceButton(number, x, y) {
    const bg = this.add.rectangle(x, y, 120, 100, 0xFFFFFF)
      .setStrokeStyle(6, 0x4ECDC4)
      .setInteractive({ useHandCursor: true });
    
    const text = this.add.text(x, y, number.toString(), {
      fontFamily: 'Fredoka One',
      fontSize: '56px',
      color: '#2D3436'
    }).setOrigin(0.5);
    
    const container = this.add.container(x, y, [bg, text]);
    
    bg.on('pointerdown', () => {
      this.handleAnswer(number, container);
    });
    
    bg.on('pointerover', () => {
      bg.setFillStyle(0xE8F4F8);
      bg.setScale(1.1);
    });
    
    bg.on('pointerout', () => {
      bg.setFillStyle(0xFFFFFF);
      bg.setScale(1.0);
    });
    
    return container;
  }

  handleAnswer(selectedNumber, selectedButton) {
    // Disable all buttons
    this.disableButtons();
    
    if (selectedNumber === this.currentAnswer) {
      // Correct answer
      this.showCorrectFeedback();
      this.score += 10;
      this.correctAnswers++;
      this.scoreText.setText(`Score: ${this.score}`);
      
      // Play answer audio
      this.sound.play(`number_${this.currentAnswer}`);
      this.sound.play('correct');
      
      // Move to next question after delay
      this.time.delayedCall(1500, () => this.nextQuestion());
    } else {
      // Incorrect answer
      this.showIncorrectFeedback(selectedNumber);
      
      // Move to next question after delay
      this.time.delayedCall(2500, () => this.nextQuestion());
    }
  }

  showCorrectFeedback() {
    const feedback = this.add.text(640, 450, '🎉 Correct!', {
      fontFamily: 'Fredoka One',
      fontSize: '56px',
      color: '#00B894',
      stroke: '#FFFFFF',
      strokeThickness: 6
    }).setOrigin(0.5);
    
    // Confetti animation
    this.tweens.add({
      targets: feedback,
      scale: { from: 0, to: 1.3 },
      duration: 500,
      ease: 'Back.easeOut'
    });
  }

  showIncorrectFeedback(selectedNumber) {
    const feedback = this.add.text(640, 450, `Not quite! The answer is ${this.currentAnswer}`, {
      fontFamily: 'Fredoka One',
      fontSize: '40px',
      color: '#FF7675'
    }).setOrigin(0.5);
    
    // Shake
    this.cameras.main.shake(300, 0.005);
    
    // Play correct answer audio after brief pause
    this.time.delayedCall(1000, () => {
      this.sound.play(`number_${this.currentAnswer}`);
    });
  }

  playProblemAudio(problem) {
    // Play: "3" ... "plus" ... "5" ... "equals?"
    this.sound.play(`number_${problem.num1}`);
    this.time.delayedCall(800, () => this.sound.play('plus'));
    this.time.delayedCall(1600, () => this.sound.play(`number_${problem.num2}`));
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
      gameName: 'Addition Game',
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
    if (this.equationText) this.equationText.destroy();
    if (this.choiceButtons) {
      this.choiceButtons.forEach(btn => btn.destroy());
    }
    // Clear visual objects (handled by scene cleanup)
  }

  disableButtons() {
    this.choiceButtons.forEach(btn => {
      btn.list[0].disableInteractive();
    });
  }
}

// McCabe complexity: 5 (at limit, acceptable)
```

**problemGenerator.js - Problem Generation Utility:**
```javascript
export function generateProblem(min, max) {
  // Generate two numbers within range
  const num1 = Phaser.Math.Between(min, max);
  const num2 = Phaser.Math.Between(min, max);
  
  // Ensure answer doesn't exceed 20 (age-appropriate)
  const maxNum2 = Math.min(max, 20 - num1);
  const adjustedNum2 = Math.min(num2, maxNum2);
  
  return {
    num1,
    num2: adjustedNum2,
    answer: num1 + adjustedNum2
  };
}

// McCabe complexity: 2 (within limit)
```

---

### Acceptance Criteria

- [ ] Addition game appears in Math Adventures page
- [ ] Math category shows "3 activities available" on dashboard
- [ ] Game loads with first addition problem
- [ ] Equation displays clearly (e.g., "3 + 5 = ?")
- [ ] Visual objects display for both addends
- [ ] Audio plays problem aloud ("3 plus 5 equals?")
- [ ] 4 answer choices display
- [ ] Hover effect works on answer buttons
- [ ] Correct answer shows celebration animation
- [ ] Incorrect answer shows correct answer with explanation
- [ ] Audio plays correct answer after mistake
- [ ] Score increases by 10 points per correct answer
- [ ] Progress text updates (Question 1 of 10, etc.)
- [ ] All 10 questions load sequentially
- [ ] Problems use numbers 1-10
- [ ] Answers never exceed 20
- [ ] Results screen shows score and high scores
- [ ] Session saves to database via POST /api/sessions
- [ ] High scores load from database

---

### McCabe Complexity

All functions ≤ 5:
- `loadQuestion()`: 3
- `createAnswerChoices()`: 3
- `handleAnswer()`: 4
- `showIncorrectFeedback()`: 2
- `playProblemAudio()`: 1
- `generateProblem()`: 2

---

### Dependencies

- Phase 3: Database and API (uses game_sessions table)
- Phase 7: Child Login (requires child authentication)
- Phase 11: Counting Game (Addition builds on counting skills)
- Phase 12: Shapes Recognition (Addition appears alongside in Math category)


---

