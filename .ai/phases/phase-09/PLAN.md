# Phase 9: Word Builder Game

**Project:** ADHDLearn.com
**Phase:** 9 of 36
**Last Updated:** October 22, 2025

---

 Word Builder Game

**Delivers:** Aurora has a 2nd game to play
**Aurora gets:** 🎮 **NEW GAME - Word Builder**
**You get:** See Aurora's Word Builder scores in parent dashboard
**Deployed:** 2 working games for Aurora

---

### What This Phase Delivers

Word Builder game in the Reading category:
- Drag-and-drop spelling game with 10 words per session
- Image + audio pronunciation for each word
- Letter tiles to drag into empty slots
- Immediate feedback (correct/incorrect with animations)
- Scoring: 20 points per word, bonus for no mistakes
- Game saves to database like Letter Pop
- Appears in Reading category alongside Letter Pop

---

### Database Changes

**No new tables** - Uses existing `game_sessions` table from Phase 3.

**New game_name value:** `'Word Builder'`

Example record:
```sql
INSERT INTO game_sessions (game_name, score, accuracy_percentage, correct_attempts, total_attempts, duration_seconds, mode)
VALUES ('Word Builder', 180, 90.0, 9, 10, 245, 'Easy');
```

---

### API Endpoints

**No new endpoints** - Uses existing endpoints from Phase 3:

#### POST /api/sessions
**Purpose:** Save Word Builder game session
**Body:**
```json
{
  "gameName": "Word Builder",
  "score": 180,
  "accuracyPercentage": 90.0,
  "correctAttempts": 9,
  "totalAttempts": 10,
  "durationSeconds": 245,
  "mode": "Easy"
}
```
**Response (201):**
```json
{
  "success": true,
  "sessionId": 42,
  "isHighScore": true,
  "rank": 3
}
```

#### GET /api/sessions/high-scores?game=Word Builder
**Purpose:** Get Word Builder high scores
**Response (200):**
```json
{
  "success": true,
  "scores": [
    {
      "sessionId": 38,
      "score": 200,
      "accuracyPercentage": 100.0,
      "playedAt": "2025-10-21T14:30:00Z"
    },
    {
      "sessionId": 42,
      "score": 180,
      "accuracyPercentage": 90.0,
      "playedAt": "2025-10-22T10:15:00Z"
    }
  ]
}
```

---

### Frontend Changes

**New Files in `child-portal/src/games/word-builder/`:**
```
word-builder/
├── WordBuilderGame.js       (Main Phaser scene)
├── scenes/
│   ├── GameScene.js         (Word building gameplay)
│   ├── ResultsScene.js      (Shows score and high scores)
│   └── TutorialScene.js     (First-time instructions)
├── assets/
│   ├── images/
│   │   ├── cat.png          (Word images for 3-letter words)
│   │   ├── dog.png
│   │   ├── sun.png
│   │   └── ... (30 images total)
│   ├── audio/
│   │   ├── words/
│   │   │   ├── cat.mp3      (Word pronunciations)
│   │   │   ├── dog.mp3
│   │   │   └── ... (30 audio files)
│   │   └── letters/
│   │       ├── a.mp3        (Letter sounds)
│   │       ├── b.mp3
│   │       └── ... (26 letter sounds)
│   └── fonts/
│       └── FredokaOne.ttf
└── data/
    └── wordList.js          (Word bank with images and difficulty)
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
  }
];
```

**Add route in `child-portal/src/App.jsx`:**
```javascript
import WordBuilderGame from './games/word-builder/WordBuilderGame';

<Route path="/activities/word-builder" element={<WordBuilderGame />} />
```

---

### Technical Specifications

**GameScene.js - Main Gameplay Logic:**
```javascript
import Phaser from 'phaser';
import wordList from '../data/wordList';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
    this.score = 0;
    this.currentWordIndex = 0;
    this.wordsCompleted = 0;
    this.totalWords = 10;
    this.startTime = null;
    this.sessionWords = [];
  }

  create() {
    this.startTime = Date.now();
    
    // Select 10 random words for this session
    this.sessionWords = this.getRandomWords(this.totalWords);
    
    // Display UI
    this.createUI();
    
    // Load first word
    this.loadWord(this.sessionWords[this.currentWordIndex]);
  }

  getRandomWords(count) {
    // Filter words by difficulty (Easy: 3-letter words)
    const easyWords = wordList.filter(w => w.difficulty === 'Easy');
    
    // Shuffle and take 'count' words
    const shuffled = Phaser.Utils.Array.Shuffle([...easyWords]);
    return shuffled.slice(0, count);
  }

  loadWord(wordData) {
    const { word, image, audio } = wordData;
    
    // Clear previous word elements
    this.clearWordElements();
    
    // Display image
    this.wordImage = this.add.image(640, 200, image)
      .setScale(0.5);
    
    // Play pronunciation
    this.sound.play(audio);
    
    // Create letter tiles
    this.createLetterTiles(word);
    
    // Create empty slots
    this.createWordSlots(word.length);
    
    // Update progress text
    this.progressText.setText(`Word ${this.currentWordIndex + 1} of ${this.totalWords}`);
  }

  createLetterTiles(word) {
    // Get correct letters + 2 decoy letters
    const correctLetters = word.toUpperCase().split('');
    const decoyLetters = this.getDecoyLetters(correctLetters, 2);
    const allLetters = [...correctLetters, ...decoyLetters];
    
    // Shuffle tiles
    const shuffled = Phaser.Utils.Array.Shuffle(allLetters);
    
    this.letterTiles = [];
    const startX = 400;
    const spacing = 100;
    
    shuffled.forEach((letter, index) => {
      const x = startX + (index * spacing);
      const y = 500;
      
      const tile = this.createDraggableTile(letter, x, y);
      this.letterTiles.push(tile);
    });
  }

  createDraggableTile(letter, x, y) {
    // Create tile background
    const tile = this.add.rectangle(x, y, 80, 80, 0x4A90E2)
      .setStrokeStyle(4, 0x2E5C8A)
      .setInteractive({ draggable: true });
    
    // Create letter text
    const text = this.add.text(x, y, letter, {
      fontFamily: 'Fredoka One',
      fontSize: '48px',
      color: '#FFFFFF'
    }).setOrigin(0.5);
    
    // Container for tile + text
    const container = this.add.container(x, y, [tile, text]);
    container.setData('letter', letter);
    container.setData('originalX', x);
    container.setData('originalY', y);
    container.setSize(80, 80);
    container.setInteractive({ draggable: true });
    
    // Drag events
    this.setupDragEvents(container);
    
    return container;
  }

  setupDragEvents(tile) {
    tile.on('dragstart', () => {
      tile.setScale(1.2);
      tile.setDepth(100);
    });
    
    tile.on('drag', (pointer, dragX, dragY) => {
      tile.x = dragX;
      tile.y = dragY;
      
      // Check for slot overlap
      this.checkSlotHighlight(tile);
    });
    
    tile.on('dragend', () => {
      tile.setScale(1.0);
      tile.setDepth(1);
      
      // Check if dropped on valid slot
      const slot = this.getOverlappingSlot(tile);
      
      if (slot && !slot.getData('filled')) {
        this.placeTileInSlot(tile, slot);
      } else {
        // Return to original position
        this.tweens.add({
          targets: tile,
          x: tile.getData('originalX'),
          y: tile.getData('originalY'),
          duration: 200,
          ease: 'Back.easeOut'
        });
      }
    });
  }

  placeTileInSlot(tile, slot) {
    const letter = tile.getData('letter');
    const expectedLetter = slot.getData('expectedLetter');
    
    if (letter === expectedLetter) {
      // Correct letter
      this.sound.play(`letter_${letter.toLowerCase()}`);
      
      // Snap tile to slot
      tile.x = slot.x;
      tile.y = slot.y;
      tile.removeInteractive();
      
      slot.setData('filled', true);
      slot.setData('tile', tile);
      
      // Check if word is complete
      this.checkWordComplete();
    } else {
      // Wrong letter
      this.cameras.main.shake(200, 0.005);
      this.sound.play('wrong');
      
      // Return tile to original position
      this.tweens.add({
        targets: tile,
        x: tile.getData('originalX'),
        y: tile.getData('originalY'),
        duration: 200,
        ease: 'Back.easeOut'
      });
    }
  }

  checkWordComplete() {
    const allFilled = this.wordSlots.every(slot => slot.getData('filled'));
    
    if (allFilled) {
      // Word completed successfully
      this.score += 20;
      this.scoreText.setText(`Score: ${this.score}`);
      
      // Play word pronunciation
      const wordData = this.sessionWords[this.currentWordIndex];
      this.sound.play(wordData.audio);
      
      // Celebration animation
      this.showCelebration();
      
      // Move to next word after delay
      this.time.delayedCall(2000, () => {
        this.wordsCompleted++;
        this.currentWordIndex++;
        
        if (this.currentWordIndex < this.totalWords) {
          this.loadWord(this.sessionWords[this.currentWordIndex]);
        } else {
          this.endGame();
        }
      });
    }
  }

  endGame() {
    const durationSeconds = Math.floor((Date.now() - this.startTime) / 1000);
    const accuracy = (this.wordsCompleted / this.totalWords) * 100;
    
    const gameData = {
      gameName: 'Word Builder',
      score: this.score,
      accuracyPercentage: accuracy,
      correctAttempts: this.wordsCompleted,
      totalAttempts: this.totalWords,
      durationSeconds,
      mode: 'Easy'
    };
    
    this.scene.start('ResultsScene', gameData);
  }
}

// McCabe complexity: 4 (within limit)
```

**wordList.js - Word Bank:**
```javascript
export default [
  { word: 'cat', image: 'cat', audio: 'cat', difficulty: 'Easy' },
  { word: 'dog', image: 'dog', audio: 'dog', difficulty: 'Easy' },
  { word: 'sun', image: 'sun', audio: 'sun', difficulty: 'Easy' },
  { word: 'bat', image: 'bat', audio: 'bat', difficulty: 'Easy' },
  { word: 'hat', image: 'hat', audio: 'hat', difficulty: 'Easy' },
  { word: 'pen', image: 'pen', audio: 'pen', difficulty: 'Easy' },
  { word: 'cup', image: 'cup', audio: 'cup', difficulty: 'Easy' },
  { word: 'bed', image: 'bed', audio: 'bed', difficulty: 'Easy' },
  { word: 'pig', image: 'pig', audio: 'pig', difficulty: 'Easy' },
  { word: 'fox', image: 'fox', audio: 'fox', difficulty: 'Easy' },
  { word: 'bus', image: 'bus', audio: 'bus', difficulty: 'Easy' },
  { word: 'box', image: 'box', audio: 'box', difficulty: 'Easy' },
  { word: 'ant', image: 'ant', audio: 'ant', difficulty: 'Easy' },
  { word: 'egg', image: 'egg', audio: 'egg', difficulty: 'Easy' },
  { word: 'fan', image: 'fan', audio: 'fan', difficulty: 'Easy' },
  { word: 'jet', image: 'jet', audio: 'jet', difficulty: 'Easy' },
  { word: 'net', image: 'net', audio: 'net', difficulty: 'Easy' },
  { word: 'rug', image: 'rug', audio: 'rug', difficulty: 'Easy' },
  { word: 'top', image: 'top', audio: 'top', difficulty: 'Easy' },
  { word: 'van', image: 'van', audio: 'van', difficulty: 'Easy' },
  { word: 'web', image: 'web', audio: 'web', difficulty: 'Easy' },
  { word: 'zip', image: 'zip', audio: 'zip', difficulty: 'Easy' },
  { word: 'jam', image: 'jam', audio: 'jam', difficulty: 'Easy' },
  { word: 'leg', image: 'leg', audio: 'leg', difficulty: 'Easy' },
  { word: 'map', image: 'map', audio: 'map', difficulty: 'Easy' },
  { word: 'pot', image: 'pot', audio: 'pot', difficulty: 'Easy' },
  { word: 'rat', image: 'rat', audio: 'rat', difficulty: 'Easy' },
  { word: 'red', image: 'red', audio: 'red', difficulty: 'Easy' },
  { word: 'run', image: 'run', audio: 'run', difficulty: 'Easy' },
  { word: 'sit', image: 'sit', audio: 'sit', difficulty: 'Easy' }
];
```

---

### Acceptance Criteria

- [ ] Word Builder appears in Reading category alongside Letter Pop
- [ ] Game loads with first word challenge (image + audio)
- [ ] Audio pronunciation plays automatically for each word
- [ ] Letter tiles display correctly (correct letters + 2 decoys)
- [ ] Drag-and-drop mechanics work smoothly
- [ ] Correct letter placement snaps into slot
- [ ] Incorrect letter placement shakes slot and returns tile
- [ ] Letter sound plays when placed correctly
- [ ] Full word pronunciation plays when word completed
- [ ] Celebration animation shows after each word
- [ ] Score increases by 20 points per word
- [ ] Progress text updates (Word 1 of 10, etc.)
- [ ] All 10 words load sequentially
- [ ] Game ends after 10th word completion
- [ ] Results screen shows score and high scores
- [ ] Session saves to database via POST /api/sessions
- [ ] High scores load from database
- [ ] Game works on touch devices (mobile-friendly)

---

### McCabe Complexity

All functions ≤ 5:
- `loadWord()`: 3
- `placeTileInSlot()`: 4
- `checkWordComplete()`: 3
- `setupDragEvents()`: 2
- `endGame()`: 2

---

### Dependencies

- Phase 3: Database and API (uses game_sessions table and POST/GET endpoints)
- Phase 7: Child Login (requires child authentication to save scores)
- Phase 8: Child Dashboard (Word Builder appears in Reading category)


---

