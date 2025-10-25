# Phase 2: Letter Pop Standalone Deployment

**Project:** ADHDLearn.com
**Phase:** 2 of 36
**Last Updated:** October 22, 2025

---

 Letter Pop Standalone Deployment

**Delivers:** Aurora can play Letter Pop from her tablet
**Aurora gets:** 🎮 **Can play Letter Pop from anywhere**
**You get:** See Aurora using the site
**Deployed:** child.adhdlearn.com has working Letter Pop

### What This Phase Delivers

Letter Pop game deployed and playable:
- Standalone Phaser 3 game (no login required)
- Saves high scores to localStorage
- Works on Aurora's tablet (Android Chrome)
- Full game mechanics: bubble popping, letter recognition, scoring
- Results screen with stats

### Database Changes

None (localStorage only in this phase)

### API Endpoints

None (backend integration happens in Phase 3)

### Frontend Changes

**New Files in `child-portal/`:**
```
src/
├── games/
│   └── reading/
│       └── letter-pop/
│           ├── scenes/
│           │   ├── MenuScene.js
│           │   ├── GameScene.js
│           │   └── ResultsScene.js
│           ├── config.js
│           └── index.js
├── App.jsx
├── main.jsx
└── index.html
```

### Technical Specifications

#### Phaser Game Configuration

**`letter-pop/config.js`**
```javascript
export default {
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: -50 },  // Bubbles float upward
      debug: false
    }
  },
  scene: [MenuScene, GameScene, ResultsScene]
};
```

#### MenuScene (Difficulty Selection)

**`scenes/MenuScene.js`**
```javascript
export default class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MenuScene' });
  }

  create() {
    // Title
    this.add.text(
      this.cameras.main.centerX,
      100,
      'LETTER POP',
      { fontSize: '64px', fontFamily: 'Comic Neue', color: '#fff' }
    ).setOrigin(0.5);

    // Difficulty buttons
    this.createButton(200, 'UPPERCASE', 'uppercase');
    this.createButton(300, 'lowercase', 'lowercase');
    this.createButton(400, 'Mixed', 'mixed');
  }

  createButton(y, text, mode) {
    const btn = this.add.rectangle(
      this.cameras.main.centerX,
      y,
      300,
      80,
      0x6FCF97
    ).setInteractive();

    this.add.text(
      this.cameras.main.centerX,
      y,
      text,
      { fontSize: '32px', fontFamily: 'Comic Neue', color: '#fff' }
    ).setOrigin(0.5);

    btn.on('pointerdown', () => {
      this.scene.start('GameScene', { mode });
    });
  }
}
```

#### GameScene (Main Gameplay)

**`scenes/GameScene.js`**
```javascript
export default class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
  }

  create(data) {
    this.mode = data.mode || 'uppercase';
    this.score = 0;
    this.attempts = [];
    this.targetLetter = this.getRandomLetter();

    // Display target letter
    this.targetText = this.add.text(
      this.cameras.main.centerX,
      80,
      `Find: ${this.targetLetter}`,
      { fontSize: '48px', fontFamily: 'Comic Neue', color: '#fff' }
    ).setOrigin(0.5);

    // Score display
    this.scoreText = this.add.text(
      20,
      20,
      `Score: ${this.score}`,
      { fontSize: '24px', fontFamily: 'Comic Neue', color: '#fff' }
    );

    // Spawn bubbles
    this.spawnBubbles();

    // Timer (60 seconds)
    this.timeLeft = 60;
    this.timerText = this.add.text(
      this.cameras.main.width - 20,
      20,
      `Time: ${this.timeLeft}`,
      { fontSize: '24px', fontFamily: 'Comic Neue', color: '#fff' }
    ).setOrigin(1, 0);

    this.time.addEvent({
      delay: 1000,
      callback: this.updateTimer,
      callbackScope: this,
      loop: true
    });
  }

  spawnBubbles() {
    // Create 8 bubbles with random letters
    for (let i = 0; i < 8; i++) {
      const x = Phaser.Math.Between(100, this.cameras.main.width - 100);
      const y = Phaser.Math.Between(200, this.cameras.main.height - 100);
      const letter = i === 0 ? this.targetLetter : this.getRandomLetter();

      this.createBubble(x, y, letter);
    }
  }

  createBubble(x, y, letter) {
    const bubble = this.add.circle(x, y, 50, 0xFF6B6B, 0.8);
    const text = this.add.text(x, y, letter, {
      fontSize: '48px',
      fontFamily: 'Comic Neue',
      color: '#fff'
    }).setOrigin(0.5);

    bubble.setInteractive();
    bubble.setData('letter', letter);

    // Physics
    this.physics.add.existing(bubble);
    bubble.body.setVelocity(
      Phaser.Math.Between(-50, 50),
      Phaser.Math.Between(-100, -50)
    );

    // Click handler
    bubble.on('pointerdown', () => {
      this.handleBubbleClick(letter);
      bubble.destroy();
      text.destroy();
    });
  }

  handleBubbleClick(clickedLetter) {
    const isCorrect = clickedLetter === this.targetLetter;

    this.attempts.push({
      target: this.targetLetter,
      clicked: clickedLetter,
      correct: isCorrect,
      timestamp: Date.now()
    });

    if (isCorrect) {
      this.score += 10;
      this.scoreText.setText(`Score: ${this.score}`);
      this.sound.play('correct');  // Positive feedback
      this.targetLetter = this.getRandomLetter();
      this.targetText.setText(`Find: ${this.targetLetter}`);
    } else {
      this.sound.play('incorrect');  // Gentle feedback
    }

    // Spawn new bubble
    this.createBubble(
      Phaser.Math.Between(100, this.cameras.main.width - 100),
      this.cameras.main.height + 50,
      this.getRandomLetter()
    );
  }

  updateTimer() {
    this.timeLeft--;
    this.timerText.setText(`Time: ${this.timeLeft}`);

    if (this.timeLeft <= 0) {
      this.gameOver();
    }
  }

  gameOver() {
    const correct = this.attempts.filter(a => a.correct).length;
    const total = this.attempts.length;
    const accuracy = total > 0 ? (correct / total * 100).toFixed(1) : 0;

    // Save to localStorage
    const highScores = JSON.parse(localStorage.getItem('letterPopScores') || '[]');
    highScores.push({
      score: this.score,
      accuracy,
      date: new Date().toISOString()
    });
    highScores.sort((a, b) => b.score - a.score);
    localStorage.setItem('letterPopScores', JSON.stringify(highScores.slice(0, 10)));

    // Go to results
    this.scene.start('ResultsScene', {
      score: this.score,
      correct,
      total,
      accuracy
    });
  }

  getRandomLetter() {
    const letters = this.mode === 'uppercase'
      ? 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
      : this.mode === 'lowercase'
      ? 'abcdefghijklmnopqrstuvwxyz'
      : 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    return letters[Phaser.Math.Between(0, letters.length - 1)];
  }
}
```

#### ResultsScene

**`scenes/ResultsScene.js`**
```javascript
export default class ResultsScene extends Phaser.Scene {
  constructor() {
    super({ key: 'ResultsScene' });
  }

  create(data) {
    // Title
    this.add.text(
      this.cameras.main.centerX,
      100,
      'Great Job!',
      { fontSize: '48px', fontFamily: 'Comic Neue', color: '#fff' }
    ).setOrigin(0.5);

    // Score
    this.add.text(
      this.cameras.main.centerX,
      200,
      `Score: ${data.score}`,
      { fontSize: '36px', fontFamily: 'Comic Neue', color: '#6FCF97' }
    ).setOrigin(0.5);

    // Accuracy
    this.add.text(
      this.cameras.main.centerX,
      260,
      `Accuracy: ${data.accuracy}% (${data.correct}/${data.total})`,
      { fontSize: '28px', fontFamily: 'Comic Neue', color: '#fff' }
    ).setOrigin(0.5);

    // High scores
    const highScores = JSON.parse(localStorage.getItem('letterPopScores') || '[]');
    this.add.text(
      this.cameras.main.centerX,
      350,
      'High Scores:',
      { fontSize: '24px', fontFamily: 'Comic Neue', color: '#fff' }
    ).setOrigin(0.5);

    highScores.slice(0, 5).forEach((score, i) => {
      this.add.text(
        this.cameras.main.centerX,
        390 + i * 30,
        `${i + 1}. ${score.score} points (${score.accuracy}%)`,
        { fontSize: '20px', fontFamily: 'Comic Neue', color: '#fff' }
      ).setOrigin(0.5);
    });

    // Play Again button
    const btn = this.add.rectangle(
      this.cameras.main.centerX,
      this.cameras.main.height - 100,
      200,
      60,
      0x6FCF97
    ).setInteractive();

    this.add.text(
      this.cameras.main.centerX,
      this.cameras.main.height - 100,
      'PLAY AGAIN',
      { fontSize: '24px', fontFamily: 'Comic Neue', color: '#fff' }
    ).setOrigin(0.5);

    btn.on('pointerdown', () => {
      this.scene.start('MenuScene');
    });
  }
}
```

#### React App Entry Point

**`src/App.jsx`**
```javascript
import { useEffect } from 'react';
import Phaser from 'phaser';
import gameConfig from './games/reading/letter-pop/config';

export default function App() {
  useEffect(() => {
    const game = new Phaser.Game(gameConfig);

    return () => {
      game.destroy(true);
    };
  }, []);

  return <div id="phaser-game" />;
}
```

### Deployment

```bash
cd child-portal
npm run build
rsync -avz dist/ user@160.153.180.159:/var/www/adhdlearn.com/production/child/
```

### Acceptance Criteria

- [ ] Letter Pop loads at https://child.adhdlearn.com
- [ ] Game runs smoothly on Aurora's tablet (60 FPS)
- [ ] Bubbles float upward and respond to taps
- [ ] Correct letter taps award points and play positive sound
- [ ] Incorrect taps play gentle feedback sound (no harsh "WRONG")
- [ ] Timer counts down from 60 seconds
- [ ] Results screen shows score, accuracy, and high scores
- [ ] High scores persist in localStorage
- [ ] "Play Again" returns to menu
- [ ] No crashes or console errors

### McCabe Complexity

All functions ≤ 5:
- `MenuScene.create()`: 2
- `GameScene.create()`: 4
- `GameScene.handleBubbleClick()`: 3
- `GameScene.updateTimer()`: 2
- `ResultsScene.create()`: 3

### Dependencies

- Phase 0: Server infrastructure
- Phase 1: Project structure

---

