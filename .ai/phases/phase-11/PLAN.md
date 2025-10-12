# Phase 11: Letter Pop - Score System

## Goal
Add score tracking and display to the Letter Pop game

## Context
This phase builds on the game logic from Phase 10 by adding visible score tracking. Players need to see:
1. How many letters they've found correctly
2. Total number of letters in the current session
3. Optional: Time elapsed (non-pressured display)

The score system should:
- Display clearly without obscuring gameplay
- Update immediately when player clicks correct bubble
- Be encouraging (show progress, not failures)
- Follow ADHD-friendly design (clear, simple, non-distracting)

## Prerequisites
- Phase 10 completed
- Correct click detection working
- incrementScore() hook exists in LetterPopScene
- Game loop functional with rounds

## Tasks

### 1. Create Score Display UI
- Add text element to LetterPopScene for score
- Position in top-left or top-center (non-intrusive)
- Use large, readable font (24-32px)
- Format: "Correct: 5 / 10" or "Score: 5"
- Ensure high contrast with background

### 2. Initialize Score Tracking
- Add score variable to scene (starts at 0)
- Add totalAttempts or totalRounds variable
- Initialize in create() method
- Reset when appropriate (game restart)

### 3. Implement Score Increment Logic
- Connect incrementScore() to correct click handler
- Increment score variable on each correct click
- Update display text immediately
- Optional: add celebratory animation to score text

### 4. Create Score Text Update Method
- Method to update score display text
- Format score consistently
- Called after each correct click
- Ensure no text overlap or visual glitches

### 5. Add Time Tracker (Optional, Non-Pressured)
- Display time elapsed in seconds or minutes
- Format: "Time: 1:23" (minutes:seconds)
- Update every second using Phaser timer
- Display should be informational only (no pressure)
- Position separately from score (e.g., top-right)

### 6. Test Score System
- Verify score starts at 0
- Test score increments on correct clicks
- Verify score does NOT change on incorrect clicks
- Test score display readability
- Ensure UI doesn't overlap with bubbles
- Test score display on different screen sizes

## Implementation Details

### Score Display Creation
```javascript
class LetterPopScene extends Phaser.Scene {
    constructor() {
        super({ key: 'LetterPopScene' });
        this.score = 0;
        this.totalCorrect = 0;
        this.scoreText = null;
        this.timeText = null;
        this.startTime = 0;
    }

    create() {
        // Create score display
        this.scoreText = this.add.text(20, 20, 'Correct: 0', {
            fontSize: '28px',
            fontFamily: 'Arial',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4,
            fontStyle: 'bold'
        });

        // Optional: Create time display
        this.timeText = this.add.text(this.cameras.main.width - 20, 20, 'Time: 0:00', {
            fontSize: '24px',
            fontFamily: 'Arial',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(1, 0); // Right-aligned

        // Start time tracking
        this.startTime = this.time.now;

        // Start time update timer
        this.time.addEvent({
            delay: 1000, // Update every second
            callback: this.updateTimeDisplay,
            callbackScope: this,
            loop: true
        });

        // Continue with game setup
        this.startRound();
    }

    updateTimeDisplay() {
        const elapsed = Math.floor((this.time.now - this.startTime) / 1000);
        const minutes = Math.floor(elapsed / 60);
        const seconds = elapsed % 60;
        const secondsStr = seconds < 10 ? `0${seconds}` : `${seconds}`;
        this.timeText.setText(`Time: ${minutes}:${secondsStr}`);
    }
}
```

### Score Increment
```javascript
incrementScore() {
    this.score++;
    this.totalCorrect++;
    this.updateScoreDisplay();

    // Optional: Animate score text (brief scale up)
    this.tweens.add({
        targets: this.scoreText,
        scaleX: 1.2,
        scaleY: 1.2,
        duration: 100,
        yoyo: true,
        ease: 'Power2'
    });
}

updateScoreDisplay() {
    this.scoreText.setText(`Correct: ${this.score}`);
}
```

### Alternative Format (With Total)
```javascript
class LetterPopScene extends Phaser.Scene {
    constructor() {
        super({ key: 'LetterPopScene' });
        this.correctCount = 0;
        this.totalLetters = 0; // Track total letters shown
        this.scoreText = null;
    }

    startRound() {
        // Spawn bubbles (e.g., 6-8 bubbles)
        const bubbleCount = 8;
        this.totalLetters += 1; // One target letter per round

        // ... spawn bubble logic
    }

    incrementScore() {
        this.correctCount++;
        this.updateScoreDisplay();
    }

    updateScoreDisplay() {
        this.scoreText.setText(`Correct: ${this.correctCount} / ${this.totalLetters}`);
    }
}
```

### Score Text Animation (Optional Enhancement)
```javascript
incrementScore() {
    this.score++;
    this.updateScoreDisplay();

    // Flash effect
    this.tweens.add({
        targets: this.scoreText,
        scaleX: 1.3,
        scaleY: 1.3,
        duration: 150,
        yoyo: true,
        ease: 'Back.easeOut'
    });

    // Color pulse (gold flash)
    const originalColor = this.scoreText.style.color;
    this.scoreText.setColor('#FFD700'); // Gold

    this.time.delayedCall(200, () => {
        this.scoreText.setColor(originalColor); // Back to white
    });
}
```

### Score Display Positioning

**Top-Left (Recommended)**
```javascript
this.scoreText = this.add.text(20, 20, 'Correct: 0', {
    fontSize: '28px',
    color: '#ffffff',
    stroke: '#000000',
    strokeThickness: 4
});
```

**Top-Center**
```javascript
const centerX = this.cameras.main.width / 2;
this.scoreText = this.add.text(centerX, 20, 'Correct: 0', {
    fontSize: '28px',
    color: '#ffffff',
    stroke: '#000000',
    strokeThickness: 4
}).setOrigin(0.5, 0); // Center-aligned
```

**UI Container (For Multiple Elements)**
```javascript
createUI() {
    // Score
    this.scoreText = this.add.text(20, 20, 'Correct: 0', {
        fontSize: '28px',
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 4
    });

    // Time (if included)
    this.timeText = this.add.text(
        this.cameras.main.width - 20,
        20,
        'Time: 0:00',
        {
            fontSize: '24px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4
        }
    ).setOrigin(1, 0);

    // Keep UI on top of game objects
    this.scoreText.setDepth(1000);
    this.timeText.setDepth(1000);
}
```

## Acceptance Criteria
- [ ] Score display appears on screen (top-left or top-center)
- [ ] Score starts at 0 when game begins
- [ ] Score increments by 1 on each correct click
- [ ] Score does NOT change on incorrect clicks
- [ ] Score text updates immediately (no delay)
- [ ] Text is large and readable (28px minimum)
- [ ] Text has high contrast (stroke or background)
- [ ] Score display doesn't overlap with bubbles
- [ ] Score display stays in fixed position (doesn't move)
- [ ] Optional: Time display shows elapsed time
- [ ] Optional: Time updates every second
- [ ] Optional: Time display is non-pressured (informational only)
- [ ] UI elements have high depth (always visible on top)

## Testing Steps
1. Start LetterPopScene
2. Verify score display shows "Correct: 0"
3. Click correct bubble
   - Score should increment to 1
   - Display should update immediately
   - Optional: Score text briefly animates
4. Click another correct bubble
   - Score increments to 2
5. Click incorrect bubble
   - Score stays at 2 (no change)
6. Continue playing, verify score increments only on correct clicks
7. Check score text readability
   - Clear against background
   - Not overlapping with game elements
8. If time display included:
   - Verify time starts at 0:00
   - Verify time updates every second
   - Verify format is correct (minutes:seconds)
9. Test on different screen sizes (responsive positioning)
10. Check browser console for errors

## Estimated Time
45 minutes

## Dependencies
- Phase 10 completed (incrementScore hook exists)
- Phaser text rendering system
- Phaser timer system (for time tracking)

## Risks
- **Text overlap with bubbles**: Position carefully, use setDepth()
- **Font readability**: Ensure stroke or background for contrast
- **Score update delay**: Use immediate text update, avoid async issues
- **Timer performance**: Updating every second should be lightweight
- **Screen size variations**: Test on small screens (score might be cut off)

## ADHD-Friendly Design Considerations
- **Clear visual hierarchy**: Score is visible but not distracting
- **Immediate feedback**: Score updates instantly on correct click
- **Positive framing**: Shows "Correct" count, not "Incorrect" count
- **No pressure**: Time is informational, not a countdown
- **Simple display**: One number, easy to understand at a glance
- **No clutter**: Minimal UI elements, maximum clarity
- **Encouraging**: Score going up feels rewarding
- **No penalties**: Incorrect clicks don't decrease score

## Notes
- Keep UI minimal - score and time only (no lives, no streaks yet)
- Score should feel rewarding, not stressful
- Time tracker is optional - include only if it adds value
- Consider removing time tracker if it adds pressure
- Score text animation is optional but adds nice polish
- Ensure score is always visible (high depth/z-index)
- Test readability on different background colors
- Consider adding a semi-transparent background panel if needed
- Future phases can add: high score, session stats, progress bar

## Completion Checklist
- [ ] Score variable initialized
- [ ] Score display text created
- [ ] Score positioned appropriately (non-intrusive)
- [ ] incrementScore() method implemented
- [ ] updateScoreDisplay() method implemented
- [ ] Score increments only on correct clicks
- [ ] Score text updates immediately
- [ ] Optional: Time tracking implemented
- [ ] Optional: Time display updates every second
- [ ] All acceptance criteria met
- [ ] Tested with multiple correct/incorrect clicks
- [ ] Text is readable and high contrast
- [ ] UI doesn't overlap with game elements
- [ ] No console errors
- [ ] Ready to proceed to Phase 12
