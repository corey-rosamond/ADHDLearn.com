# Development Guardrails

## Purpose
This document defines code quality standards, best practices, and common pitfalls to avoid when developing Aurora's Reading Adventure. These guardrails ensure the codebase remains clean, maintainable, and aligned with the project's ADHD-friendly educational goals.

---

## 📝 Note on Code Examples

**Current Technology:** Kotlin + libGDX (native Android)
**Archived Version:** Phaser.js (web) - located in `archive/phaser-web/`

Many code examples in this document use JavaScript/Phaser syntax from the original web version. **The principles apply to both versions**, but the specific API calls differ:

- **Phaser examples** → Illustrate the principle
- **Kotlin/libGDX** → Apply the same principle with libGDX API

**General principles** (SOLID, ADHD-friendly design, testing methodology) are **technology-agnostic** and apply fully to the current Kotlin implementation.

**For Kotlin/libGDX-specific patterns:**
- See `core/src/main/kotlin/` for reference implementations
- See Phase 2.7.x documentation for current architecture
- Follow libGDX patterns, not Phaser patterns

---

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

## GUI Visual Testing Protocol

### Purpose
When testing the look and feel of GUI elements, scenes, or layouts, we use a **screenshot-based personality review process** to ensure the interface is engaging, accessible, and Aurora-friendly. This prevents developer bias and ensures diverse perspectives are considered.

### Workflow

#### Step 1: Capture Screenshot
1. Launch the application in the emulator
2. Manually navigate to the scene/screen being tested
3. Interact with elements as needed to show the state
4. Take a screenshot using adb:
   ```bash
   /home/corey/android-sdk/platform-tools/adb shell screencap -p /sdcard/screenshot.png
   /home/corey/android-sdk/platform-tools/adb pull /sdcard/screenshot.png test/screenshots/[descriptive-name].png
   ```
5. Screenshots MUST be saved in `test/screenshots/` directory (NOT the root)
6. Use descriptive filenames: `main-menu-v1.png`, `bubble-pop-iteration-3.png`, etc.

#### Step 2: Create 5 Diverse Personalities
Create 5 distinct reviewers with different perspectives. **Avoid simple true/false personalities.**

**Required Mix:**
- At least 2 children (ages 4-7, different backgrounds/preferences)
- At least 1 UI/UX designer (professional perspective)
- At least 1 player/tester (gameplay focus)
- At least 1 parent/educator (learning/safety focus)

**✅ GOOD Examples:**
```
1. Sophie, Age 5 - Loves pink and purple, gets distracted easily, prefers big colorful buttons
2. Marcus, Age 6 - Colorblind (red-green), loves animals, gets frustrated with small text
3. Jessica Chen, UI Designer - 8 years experience in children's apps, accessibility advocate
4. Tom, Casual Gamer - Plays mobile games with his kids, values simplicity and clear feedback
5. Dr. Maria Santos, Elementary Teacher - 15 years teaching, specializes in ADHD learning strategies
```

**❌ BAD Examples:**
```
1. Person who likes it
2. Person who doesn't like it
3. Designer
4. Player
5. Parent
```

**Why bad?** Too generic, no depth, no specific perspectives, essentially just "yes/no" responses.

#### Step 3: Show Screenshot to Each Personality Individually

**CRITICAL RULE:** You MUST actually read the screenshot file using the Read tool and show it to each personality individually. **NEVER generate fake responses without actually viewing the screenshot.**

**✅ CORRECT Process:**
```markdown
Let me show the screenshot to each personality:

**Personality 1: Sophie (Age 5)**
[Uses Read tool to view test/screenshots/main-menu-v1.png]

After viewing the screenshot, Sophie says:
"I like the purple! But the buttons are kinda small. Can they be bigger?
And I can't read that word (she points to 'Settings').
The stars are pretty but they're moving too slow, I want them to zoom!"
```

**❌ WRONG Process:**
```markdown
Personality 1 (Sophie): "The colors are nice but buttons could be bigger."
Personality 2 (Marcus): "I like it, looks good."
...
[Generated without actually reading the screenshot]
```

**Why wrong?** You haven't actually looked at the screenshot, so the feedback is fabricated and useless.

#### Step 4: Collect Detailed Feedback

For each personality, document:
- **What they noticed first** (captures attention hierarchy)
- **What they liked** (preserve these elements)
- **What confused them** (UX issues)
- **What they would change** (improvement suggestions)
- **Specific quotes** (authentic perspective)

#### Step 5: Synthesize and Prioritize

After collecting all 5 perspectives:
1. Identify **consensus issues** (3+ personalities agree)
2. Flag **accessibility concerns** (especially from child perspectives)
3. Note **professional insights** (from designer/educator)
4. Determine **must-fix** vs **nice-to-have**

#### Step 6: Iterate

Make changes based on feedback, take a new screenshot, and repeat the process. Continue until:
- All consensus issues are resolved
- Accessibility concerns are addressed
- At least 4 out of 5 personalities are satisfied
- No critical UX problems remain

### Example Session

```markdown
## Testing Main Menu - Iteration 1

**Screenshot:** test/screenshots/main-menu-v1.png

### Personality Reviews

**1. Sophie (Age 5) - Loves pink/purple, easily distracted**
[Read tool shows screenshot]

"Ooh pretty! I like the purple and the clouds! The stars are cute but kinda boring.
The big button says 'START' - I know that word! But what's that other button?
[Points to Settings] I can't read that. Can we have a picture on it?
The title is really big but I don't know what 'Adventure' means."

**First noticed:** Purple background and clouds
**Liked:** Colors, clouds, START button clarity
**Confused by:** Settings button (text-only), word "Adventure"
**Would change:** Add icons to buttons, simpler title

**2. Marcus (Age 6) - Colorblind (red-green), loves animals**
[Read tool shows screenshot]

"The button is hard to see. It's orange but it doesn't pop out enough from the background.
I wish there was a picture of an animal or something. The words are okay but kinda small.
Can the clouds be animal shapes? That would be cool!"

**First noticed:** Orange button blending with background
**Liked:** Simple layout, not too cluttered
**Confused by:** Low contrast between button and background
**Would change:** Higher contrast, animal-themed elements, bigger text

**3. Jessica Chen (UI Designer) - 8 years children's apps**
[Read tool shows screenshot]

"Good color choices overall. Issues:
1) Contrast ratio on the orange button fails WCAG AA (especially for colorblind users)
2) Text hierarchy is unclear - title and button are competing for attention
3) Missing visual affordances - buttons don't look tappable enough
4) No clear call-to-action flow - where should eyes go first?
5) Settings button needs an icon, not just text

Positives: Clean layout, decorative elements don't interfere with UX, good use of negative space."

**First noticed:** Button contrast issue
**Liked:** Clean layout, decorative elements placement
**Concerns:** Accessibility (contrast, visual affordances), information hierarchy
**Would change:** Increase button contrast, add subtle shadows/borders to buttons, strengthen visual hierarchy

**4. Tom (Casual Gamer, parent perspective)**
[Read tool shows screenshot]

"It's pretty but when I show this to my kid, will they know what to do?
The START button is obvious, that's good. But everything else just looks like decoration.
If there's a Settings button, I can barely tell it's clickable.
Needs to be clearer what you can tap. Also, as a parent, I'd want to see some indication
this is educational - maybe a subtitle like 'Learn Letters!' or something?"

**First noticed:** START button
**Liked:** Clear primary action, visually appealing
**Confused by:** Unclear affordances, missing educational context
**Would change:** Make interactive elements obviously tappable, add educational subtitle

**5. Dr. Maria Santos (Elementary Teacher, ADHD specialist)**
[Read tool shows screenshot]

"From an educational standpoint: Good use of high-contrast colors for ADHD attention.
The animated clouds might be distracting - test if they pull focus from the main action.
The title is too long and complex - 'Aurora's Reading Adventure' has too many syllables
for early readers. Consider 'Aurora's Letters' or similar.
Settings should be de-emphasized (not at same visual weight as primary action).
Missing progress indicators - kids with ADHD need to know 'how much' remains."

**First noticed:** Title length and complexity
**Liked:** High-contrast colors, uncluttered design
**Concerns:** Title complexity, cloud animation as distraction, missing progress cues
**Would change:** Simplify title, reduce cloud animation speed, add progress indicators

### Consensus Issues (Must Fix):
1. **Button contrast** - 3 people mentioned (Marcus, Jessica, Tom)
2. **Settings button clarity** - 4 people mentioned (Sophie, Marcus, Jessica, Tom)
3. **Title complexity** - 2 people mentioned (Sophie, Maria)

### Changes for Iteration 2:
1. Increase button border/shadow for better contrast and affordance
2. Add icon to Settings button (gear icon)
3. Simplify title to "Aurora's Letters"
4. Slow down cloud animation slightly

[Screenshot taken after changes: test/screenshots/main-menu-v2.png]
[Repeat personality review process...]
```

### Screenshot Organization

```
test/screenshots/
├── main-menu/
│   ├── v1-initial.png
│   ├── v2-contrast-fix.png
│   ├── v3-final.png
│   └── feedback-notes.md
├── bubble-pop/
│   ├── v1-layout.png
│   ├── v2-sizing.png
│   └── feedback-notes.md
└── settings/
    ├── v1-initial.png
    └── feedback-notes.md
```

### When to Use This Protocol

**Required for:**
- New scenes or major scene redesigns
- Button layout changes
- Color scheme changes
- Font/text changes affecting readability
- Any change affecting "look and feel"

**Not required for:**
- Bug fixes that don't change visuals
- Logic/code refactoring
- Performance optimizations
- Audio changes

### Red Flags

If during review you notice:
- All 5 personalities giving similar generic feedback → You're not creating diverse enough personas
- Feedback seems fabricated → You didn't actually view the screenshot
- No actionable items → Personas aren't specific enough
- Quick consensus after one iteration → Personas aren't challenging enough

**This is a real design review process. Treat it seriously.**

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

Authored-By: Corey Rosamond <rosamond.corey@gmail.com>"
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
