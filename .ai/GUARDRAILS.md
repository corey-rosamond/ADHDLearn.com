# Development Guardrails

## Purpose
This document defines code quality standards, best practices, and common pitfalls to avoid when developing Aurora's Letter Adventure. These guardrails ensure the codebase remains clean, maintainable, and aligned with the project's ADHD-friendly educational goals.

---

## Core Principles

### 1. Single Responsibility Principle
Each class, function, and module should do ONE thing well.

**✅ GOOD:**
```javascript
class Bubble {
    constructor(scene, x, y, letter) {
        this.scene = scene;
        this.container = scene.add.container(x, y);
        this.letter = letter;
        this.createVisuals();
    }

    createVisuals() {
        // Only handles visual creation
        this.graphics = this.scene.add.graphics();
        this.graphics.fillStyle(0x4488ff, 1);
        this.graphics.fillCircle(0, 0, 40);
    }

    pop() {
        // Only handles pop behavior
        this.scene.tweens.add({
            targets: this.container,
            scaleX: 1.5,
            scaleY: 1.5,
            alpha: 0,
            duration: 300,
            onComplete: () => this.destroy()
        });
    }
}
```

**❌ BAD:**
```javascript
class Bubble {
    constructor(scene, x, y, letter) {
        // Too many responsibilities in constructor
        this.scene = scene;
        this.container = scene.add.container(x, y);
        this.letter = letter;

        // Creating visuals
        this.graphics = scene.add.graphics();
        this.graphics.fillStyle(0x4488ff, 1);
        this.graphics.fillCircle(0, 0, 40);

        // Setting up audio
        this.popSound = scene.sound.add('pop');

        // Setting up click handler
        this.container.setInteractive();
        this.container.on('pointerdown', () => {
            this.popSound.play();
            // Game logic mixed in
            scene.score += 10;
            scene.updateScoreDisplay();
            this.destroy();
        });
    }
}
```

### 2. Dependency Injection
Pass dependencies explicitly rather than accessing globals.

**✅ GOOD:**
```javascript
class LetterPopScene extends Phaser.Scene {
    constructor() {
        super('LetterPopScene');
    }

    create() {
        // Inject dependencies
        this.audioManager = this.registry.get('audioManager');
        this.progressManager = this.registry.get('progressManager');

        this.createBubble('A');
    }

    createBubble(letter) {
        const bubble = new Bubble(this, 400, 300, letter, this.audioManager);
        return bubble;
    }
}

class Bubble {
    constructor(scene, x, y, letter, audioManager) {
        this.scene = scene;
        this.audioManager = audioManager; // Injected
        this.letter = letter;
    }

    pop() {
        this.audioManager.playSound('pop'); // Uses injected dependency
    }
}
```

**❌ BAD:**
```javascript
// Global variable - hard to test, creates tight coupling
let globalAudioManager;

class Bubble {
    constructor(scene, x, y, letter) {
        this.scene = scene;
        this.letter = letter;
    }

    pop() {
        globalAudioManager.playSound('pop'); // Accessing global
    }
}
```

### 3. Avoid Magic Numbers
Use named constants for clarity.

**✅ GOOD:**
```javascript
class LetterPopScene extends Phaser.Scene {
    constructor() {
        super('LetterPopScene');

        // Constants at the top, clearly named
        this.BUBBLE_RADIUS = 40;
        this.BUBBLE_SPAWN_INTERVAL = 2000;
        this.MAX_BUBBLES = 5;
        this.BUBBLE_FLOAT_SPEED = 50;
        this.CORRECT_SCORE = 10;
    }

    spawnBubble() {
        const bubble = new Bubble(this, x, y, letter, this.BUBBLE_RADIUS);
        bubble.setVelocityY(-this.BUBBLE_FLOAT_SPEED);
    }

    handleCorrectAnswer() {
        this.score += this.CORRECT_SCORE;
    }
}
```

**❌ BAD:**
```javascript
class LetterPopScene extends Phaser.Scene {
    spawnBubble() {
        const bubble = new Bubble(this, x, y, letter, 40); // What is 40?
        bubble.setVelocityY(-50); // What is 50?
    }

    handleCorrectAnswer() {
        this.score += 10; // What does 10 represent?
    }
}
```

### 4. Proper Error Handling
Always handle potential failures gracefully.

**✅ GOOD:**
```javascript
class AudioManager {
    playVoice(key) {
        // Validate input
        if (!key) {
            console.warn('AudioManager.playVoice: No key provided');
            return;
        }

        // Check if sound exists
        if (!this.scene.cache.audio.exists(key)) {
            console.warn(`AudioManager.playVoice: Audio key "${key}" not found`);
            return; // Graceful degradation
        }

        // Stop any playing voice
        if (this.currentVoice && this.currentVoice.isPlaying) {
            this.currentVoice.stop();
        }

        // Play with error handling
        try {
            this.currentVoice = this.scene.sound.add(key);
            this.currentVoice.play({ volume: this.voiceVolume });
        } catch (error) {
            console.error(`AudioManager.playVoice: Error playing "${key}"`, error);
        }
    }
}
```

**❌ BAD:**
```javascript
class AudioManager {
    playVoice(key) {
        // No validation, will crash if key is undefined
        // No check if audio exists, will crash if missing
        // No try-catch, will crash on playback error
        this.currentVoice = this.scene.sound.add(key);
        this.currentVoice.play();
    }
}
```

### 5. Clean Scene Lifecycle
Properly manage create, update, and shutdown.

**✅ GOOD:**
```javascript
class LetterPopScene extends Phaser.Scene {
    create() {
        // Initialize state
        this.bubbles = [];
        this.score = 0;

        // Create visuals
        this.createBackground();
        this.createUI();

        // Start game logic
        this.startRound();
    }

    update(time, delta) {
        // Update only what changes each frame
        this.bubbles.forEach(bubble => bubble.update(delta));
    }

    shutdown() {
        // Clean up to prevent memory leaks
        this.bubbles.forEach(bubble => bubble.destroy());
        this.bubbles = [];

        // Remove event listeners
        this.input.off('pointerdown');

        // Stop timers
        if (this.spawnTimer) {
            this.spawnTimer.remove();
        }
    }
}
```

**❌ BAD:**
```javascript
class LetterPopScene extends Phaser.Scene {
    create() {
        // Everything jammed in create
        this.bubbles = [];
        this.score = 0;
        this.bg = this.add.rectangle(400, 300, 800, 600, 0x4488ff);
        this.scoreText = this.add.text(10, 10, 'Score: 0');

        // Game logic mixed with initialization
        this.spawnBubble();
        this.spawnBubble();
        this.spawnBubble();

        // No organization
    }

    update(time, delta) {
        // Doing too much in update
        this.bubbles.forEach(bubble => {
            bubble.y -= 1;
            if (bubble.y < 0) {
                bubble.destroy();
                this.bubbles.splice(this.bubbles.indexOf(bubble), 1);
                this.spawnBubble();
            }
        });

        // Checking for game end in update (should be event-driven)
        if (this.score >= 100) {
            this.scene.start('ResultsScene');
        }
    }

    // No shutdown method - memory leaks!
}
```

---

## Phaser 3 Best Practices

### Use Containers for Complex Game Objects
**✅ GOOD:**
```javascript
class Bubble extends Phaser.GameObjects.Container {
    constructor(scene, x, y, letter) {
        super(scene, x, y);
        scene.add.existing(this);

        // All child objects positioned relative to container
        this.graphics = scene.add.graphics();
        this.graphics.fillStyle(0x4488ff, 1);
        this.graphics.fillCircle(0, 0, 40);
        this.add(this.graphics);

        this.text = scene.add.text(0, 0, letter, {
            fontSize: '32px',
            color: '#ffffff'
        }).setOrigin(0.5);
        this.add(this.text);

        // Container handles all transformations
        this.setSize(80, 80);
        this.setInteractive();
    }
}
```

### Preload All Assets
**✅ GOOD:**
```javascript
class PreloadScene extends Phaser.Scene {
    preload() {
        // Show progress
        this.createProgressBar();

        // Load all assets before gameplay
        this.load.audio('pop', 'assets/audio/pop.mp3');
        this.load.audio('letter-a', 'assets/audio/letters/letter-a.mp3');
        this.load.image('bubble', 'assets/images/bubble.png');

        // Track progress
        this.load.on('progress', (value) => {
            this.progressBar.clear();
            this.progressBar.fillStyle(0x00ff00, 1);
            this.progressBar.fillRect(250, 280, 300 * value, 40);
        });
    }

    create() {
        // All assets loaded, proceed to game
        this.scene.start('MainMenuScene');
    }
}
```

**❌ BAD:**
```javascript
class LetterPopScene extends Phaser.Scene {
    create() {
        // Loading during gameplay - causes stutter and lag
        this.load.audio('pop', 'assets/audio/pop.mp3');
        this.load.start();

        this.load.on('complete', () => {
            this.createGame(); // Delayed start
        });
    }
}
```

### Use Tweens for Smooth Animations
**✅ GOOD:**
```javascript
popBubble() {
    // Smooth, controlled animation
    this.scene.tweens.add({
        targets: this.container,
        scaleX: 1.5,
        scaleY: 1.5,
        alpha: 0,
        duration: 300,
        ease: 'Power2',
        onComplete: () => {
            this.destroy();
        }
    });
}
```

**❌ BAD:**
```javascript
popBubble() {
    // Manual animation in update - janky and inefficient
    this.isPopping = true;
}

update(delta) {
    if (this.isPopping) {
        this.scaleX += 0.01;
        this.scaleY += 0.01;
        this.alpha -= 0.01;

        if (this.alpha <= 0) {
            this.destroy();
        }
    }
}
```

---

## ADHD-Friendly Design Patterns

### Immediate Feedback (< 50ms)
**✅ GOOD:**
```javascript
handleBubbleClick(bubble) {
    // Immediate visual feedback
    this.tweens.add({
        targets: bubble,
        scaleX: 1.1,
        scaleY: 1.1,
        duration: 50, // Very fast initial response
        yoyo: true
    });

    // Immediate audio feedback
    this.audioManager.playSound('click'); // < 10ms

    // Then process logic
    this.checkAnswer(bubble.letter);
}
```

**❌ BAD:**
```javascript
handleBubbleClick(bubble) {
    // Check answer first (could take 50-100ms)
    const isCorrect = this.checkAnswer(bubble.letter);

    // Feedback delayed until after logic
    if (isCorrect) {
        this.tweens.add({
            targets: bubble,
            scaleX: 1.5,
            duration: 300
        });
    }
}
```

### Non-Punitive Feedback
**✅ GOOD:**
```javascript
handleIncorrectAnswer(bubble) {
    // Gentle wobble - not harsh
    this.tweens.add({
        targets: bubble,
        x: bubble.x - 10,
        duration: 50,
        yoyo: true,
        repeat: 2
    });

    // Gentle sound - quiet and friendly
    this.audioManager.playSound('try-again', { volume: 0.3 });

    // Encouraging text - positive framing
    this.showMessage('Try again!', 0xFFAA00); // Orange, not red

    // Bubble stays - no punishment
}
```

**❌ BAD:**
```javascript
handleIncorrectAnswer(bubble) {
    // Harsh visual - red X mark
    this.add.text(bubble.x, bubble.y, 'X', {
        fontSize: '64px',
        color: '#ff0000'
    });

    // Harsh sound - loud buzzer
    this.audioManager.playSound('wrong', { volume: 1.0 });

    // Negative text
    this.showMessage('WRONG!', 0xff0000);

    // Removes bubble - punitive
    bubble.destroy();

    // Deducts points - discouraging
    this.score -= 5;
}
```

### Progress Visibility
**✅ GOOD:**
```javascript
class LetterPopScene extends Phaser.Scene {
    create() {
        // Always show progress
        this.progressText = this.add.text(400, 30, '', {
            fontSize: '24px',
            color: '#ffffff'
        }).setOrigin(0.5);

        this.updateProgress();
    }

    updateProgress() {
        // Clear, simple progress
        this.progressText.setText(`Letter ${this.currentIndex + 1} of ${this.totalLetters}`);
    }

    nextLetter() {
        this.currentIndex++;
        this.updateProgress(); // Update immediately

        // Celebrate milestones
        if (this.currentIndex === Math.floor(this.totalLetters / 2)) {
            this.showMessage('Halfway there!');
        }
    }
}
```

**❌ BAD:**
```javascript
class LetterPopScene extends Phaser.Scene {
    create() {
        // No progress indicator
        // Aurora doesn't know how much longer
    }

    nextLetter() {
        this.currentIndex++;
        // No feedback on progress
    }
}
```

---

## Performance Guidelines

### Object Pooling for Frequently Created Objects
**✅ GOOD:**
```javascript
class ParticlePool {
    constructor(scene, size = 50) {
        this.scene = scene;
        this.pool = [];

        // Pre-create particles
        for (let i = 0; i < size; i++) {
            const particle = scene.add.circle(0, 0, 5, 0xffffff);
            particle.setActive(false);
            particle.setVisible(false);
            this.pool.push(particle);
        }
    }

    spawn(x, y, color) {
        // Reuse inactive particle
        const particle = this.pool.find(p => !p.active);

        if (particle) {
            particle.setPosition(x, y);
            particle.setFillStyle(color);
            particle.setActive(true);
            particle.setVisible(true);
            return particle;
        }

        return null; // Pool exhausted
    }

    despawn(particle) {
        particle.setActive(false);
        particle.setVisible(false);
    }
}
```

**❌ BAD:**
```javascript
spawnParticles(x, y) {
    // Creates 20 new objects every time - garbage collection nightmare
    for (let i = 0; i < 20; i++) {
        const particle = this.add.circle(x, y, 5, 0xffffff);

        this.tweens.add({
            targets: particle,
            y: y - 100,
            alpha: 0,
            duration: 1000,
            onComplete: () => {
                particle.destroy(); // 20 destroys per burst
            }
        });
    }
}
```

### Limit Active Objects
**✅ GOOD:**
```javascript
class LetterPopScene extends Phaser.Scene {
    create() {
        this.MAX_BUBBLES = 5;
        this.bubbles = [];
    }

    spawnBubble() {
        // Limit active bubbles
        if (this.bubbles.length >= this.MAX_BUBBLES) {
            return; // Don't spawn more
        }

        const bubble = new Bubble(this, x, y, letter);
        this.bubbles.push(bubble);
    }
}
```

### Use Texture Atlases for Multiple Images
**✅ GOOD:**
```javascript
// In PreloadScene
this.load.atlas('game-sprites',
    'assets/atlases/game-sprites.png',
    'assets/atlases/game-sprites.json'
);

// In game
this.add.image(x, y, 'game-sprites', 'bubble');
this.add.image(x, y, 'game-sprites', 'star');
```

**❌ BAD:**
```javascript
// Loading many individual images - slow
this.load.image('bubble', 'assets/images/bubble.png');
this.load.image('star', 'assets/images/star.png');
this.load.image('confetti', 'assets/images/confetti.png');
// ... 50 more images
```

---

## Testing Requirements

### Every Feature Needs BDD Scenarios
**✅ GOOD:**
```gherkin
Feature: Bubble Pop Mechanic
  As Aurora
  I want to pop bubbles
  So that I can learn letters

Scenario: Click correct bubble
  Given I am playing Letter Pop
  And the target letter is "B"
  And I see bubbles with letters A, B, C
  When I click the bubble with "B"
  Then I should hear a "pop" sound
  And I should see particle effects
  And the bubble should disappear
  And my score should increase by 1
```

### Manual Testing Checklist for Each Phase
Each phase must have a manual testing checklist in GHERKIN.md that can be followed step-by-step.

---

## Common Pitfalls to Avoid

### 1. Forgetting to Clean Up Event Listeners
```javascript
// Always remove listeners in shutdown
shutdown() {
    this.input.off('pointerdown', this.handleClick);
    this.time.removeAllEvents();
    this.tweens.killAll();
}
```

### 2. Hardcoding Scene Keys
```javascript
// ✅ GOOD: Constants file
export const SCENES = {
    BOOT: 'BootScene',
    PRELOAD: 'PreloadScene',
    MAIN_MENU: 'MainMenuScene',
    LETTER_POP: 'LetterPopScene'
};

// ❌ BAD: Magic strings everywhere
this.scene.start('LetterPopScene'); // Typo = crash
```

### 3. Not Using Scene Data for Passing Information
```javascript
// ✅ GOOD
this.scene.start('ResultsScene', {
    score: this.score,
    correctAnswers: this.correctAnswers,
    totalQuestions: this.totalQuestions
});

// ❌ BAD: Using globals
window.gameScore = this.score;
this.scene.start('ResultsScene');
```

### 4. Mixing Game Logic in UI Code
```javascript
// ✅ GOOD: Separation
class ScoreDisplay {
    constructor(scene, x, y) {
        this.scene = scene;
        this.text = scene.add.text(x, y, 'Score: 0');
    }

    updateScore(newScore) {
        // Only handles display
        this.text.setText(`Score: ${newScore}`);
    }
}

// Game logic in scene
handleCorrectAnswer() {
    this.score += 10; // Game logic
    this.scoreDisplay.updateScore(this.score); // Update UI
}
```

### 5. Not Handling Delta Time in Update
```javascript
// ✅ GOOD: Delta-based movement
update(time, delta) {
    this.bubbles.forEach(bubble => {
        bubble.y -= this.FLOAT_SPEED * (delta / 1000); // Consistent regardless of FPS
    });
}

// ❌ BAD: Frame-based movement
update(time, delta) {
    this.bubbles.forEach(bubble => {
        bubble.y -= 2; // Slower on 30fps, faster on 120fps
    });
}
```

---

## Documentation Standards

### Every Class Needs a Header Comment
```javascript
/**
 * Bubble
 *
 * Represents a floating bubble containing a letter in the Letter Pop mini-game.
 * Bubbles float upward and can be clicked to check if they match the target letter.
 *
 * Responsibilities:
 * - Visual rendering (gradient circle with letter)
 * - Float animation
 * - Click detection
 * - Pop animation on correct/incorrect click
 *
 * Dependencies:
 * - AudioManager (for pop sound)
 * - Scene (for tweens and rendering)
 */
class Bubble extends Phaser.GameObjects.Container {
    // ...
}
```

### Complex Functions Need Inline Comments
```javascript
/**
 * Spawns a new bubble at a random position
 * Ensures bubbles don't overlap with existing bubbles
 */
spawnBubble(letter) {
    let attempts = 0;
    let position;

    // Try up to 10 times to find non-overlapping position
    do {
        position = this.generateRandomPosition();
        attempts++;
    } while (this.overlapsExisting(position) && attempts < 10);

    // Fallback to forced spawn if couldn't find clear spot
    if (attempts >= 10) {
        console.warn('Could not find clear bubble position, spawning anyway');
    }

    const bubble = new Bubble(this, position.x, position.y, letter);
    this.bubbles.push(bubble);
}
```

---

## Git Commit Standards

### Commit After Each Phase Completion
```bash
git add .
git commit -m "Complete Phase X: [Phase Name]

- Implemented [feature 1]
- Implemented [feature 2]
- All acceptance criteria met
- Manual testing completed
- Ready for Phase X+1

🤖 Generated with Claude Code"
git push
```

### Update README.md After Each Phase
Keep README.md current with what's implemented.

---

## Summary

These guardrails ensure:
- **Clean, maintainable code** following SOLID principles
- **Proper Phaser 3 usage** with best practices
- **ADHD-friendly design** with immediate, non-punitive feedback
- **Performance optimization** through pooling and limits
- **Comprehensive testing** with BDD scenarios
- **Clear documentation** so future developers (or future you) understand the code

**Remember:** The goal isn't perfection. The goal is building a game that helps Aurora learn while maintaining a codebase we can confidently modify and expand.

If something isn't in the guardrails and you're unsure, ask yourself:
1. Is it simple and clear?
2. Would I understand this code in 6 months?
3. Does it help Aurora learn?
4. Can it be easily tested?

If yes to all four, you're probably on the right track.
