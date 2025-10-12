# Phase 12: Letter Pop - Complete Round Flow

## Goal
Implement full start-to-finish gameplay loop: show 10 letters in sequence, end round after 10 correct answers, display results screen, enable immediate replay

## Context
This phase completes the basic Letter Pop mini-game by:
1. Implementing round-based gameplay (10 letters per round)
2. Tracking score and time throughout the round
3. Creating a results screen showing performance metrics
4. Adding "Play Again" functionality for immediate replay
5. Establishing the complete game loop for Letter Pop

This transforms Letter Pop from individual letter interactions into a complete, replayable game experience.

## Prerequisites
- Phase 11 completed (letter interaction with correct/incorrect feedback)
- LetterPopScene exists with working letter display
- Audio feedback for correct/incorrect answers implemented
- Basic score tracking capability exists

## Tasks

### 1. Implement Round State Management
- Add round state variables to LetterPopScene
- Track current letter index (0-9)
- Track total correct answers in round
- Track round start time
- Track round completion status
- Initialize round state in create() or startRound() method

### 2. Create Letter Sequence Flow
- Generate array of 10 random letters for each round
- Display letters sequentially (one at a time)
- Advance to next letter after correct answer
- Maintain letter index throughout round
- Handle final letter (index 9) specially

### 3. Implement Round End Detection
- Check if all 10 letters have been answered correctly
- Calculate final score (correct answers out of 10)
- Calculate total time taken (end time - start time)
- Trigger transition to results screen
- Clean up current game objects

### 4. Create ResultsScene
- Create new scene class `/src/scenes/ResultsScene.js`
- Display "Round Complete!" message
- Show score: "X out of 10 correct"
- Show time taken: "Time: XX seconds"
- Add visual celebration for perfect scores (10/10)
- Calculate and display performance rating (optional)

### 5. Add Play Again Button
- Create interactive "Play Again" button in ResultsScene
- Position button prominently (center-bottom)
- Add hover animation (scale effect)
- Add click sound effect
- Transition back to LetterPopScene on click
- Reset round state when restarting

### 6. Implement Data Passing Between Scenes
- Pass score data from LetterPopScene to ResultsScene
- Pass time data from LetterPopScene to ResultsScene
- Use Phaser scene.start(key, data) method
- Receive data in ResultsScene init() method

## Implementation Details

### LetterPopScene Round State
```javascript
class LetterPopScene extends Phaser.Scene {
    constructor() {
        super({ key: 'LetterPopScene' });
    }

    create() {
        this.startRound();
    }

    startRound() {
        // Initialize round state
        this.roundLetters = this.generateLetterSequence();
        this.currentLetterIndex = 0;
        this.correctAnswers = 0;
        this.roundStartTime = Date.now();
        this.roundInProgress = true;

        // Display first letter
        this.displayCurrentLetter();
    }

    generateLetterSequence() {
        // Generate 10 random letters
        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
        const letters = [];
        for (let i = 0; i < 10; i++) {
            const randomLetter = Phaser.Utils.Array.GetRandom(alphabet);
            letters.push(randomLetter);
        }
        return letters;
    }

    displayCurrentLetter() {
        const currentLetter = this.roundLetters[this.currentLetterIndex];

        // Clear previous letter display
        if (this.letterText) {
            this.letterText.destroy();
        }

        // Display current letter
        this.letterText = this.add.text(400, 250, currentLetter, {
            fontSize: '120px',
            fontFamily: 'Arial',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 8
        }).setOrigin(0.5);

        // Display progress counter
        this.updateProgressDisplay();
    }

    updateProgressDisplay() {
        if (this.progressText) {
            this.progressText.destroy();
        }

        this.progressText = this.add.text(400, 100,
            `Letter ${this.currentLetterIndex + 1} of 10`, {
            fontSize: '24px',
            color: '#ffffff'
        }).setOrigin(0.5);
    }

    onCorrectAnswer() {
        this.correctAnswers++;

        // Play correct sound
        this.sound.play('correctSound');

        // Check if round is complete
        if (this.currentLetterIndex >= 9) {
            this.endRound();
        } else {
            // Advance to next letter
            this.currentLetterIndex++;
            this.time.delayedCall(500, () => {
                this.displayCurrentLetter();
            });
        }
    }

    onIncorrectAnswer() {
        // Play incorrect sound
        this.sound.play('incorrectSound');

        // Show feedback but stay on same letter
        // (Player must answer correctly to advance)
        this.showIncorrectFeedback();
    }

    endRound() {
        this.roundInProgress = false;

        // Calculate round time
        const roundEndTime = Date.now();
        const totalTimeSeconds = Math.round((roundEndTime - this.roundStartTime) / 1000);

        // Prepare data for results scene
        const resultsData = {
            score: this.correctAnswers,
            totalLetters: 10,
            timeSeconds: totalTimeSeconds
        };

        // Transition to results screen
        this.time.delayedCall(1000, () => {
            this.scene.start('ResultsScene', resultsData);
        });
    }
}
```

### ResultsScene Structure
```javascript
class ResultsScene extends Phaser.Scene {
    constructor() {
        super({ key: 'ResultsScene' });
    }

    init(data) {
        // Receive data from LetterPopScene
        this.score = data.score || 0;
        this.totalLetters = data.totalLetters || 10;
        this.timeSeconds = data.timeSeconds || 0;
    }

    create() {
        // Background
        this.cameras.main.setBackgroundColor('#4488ff');

        // Title
        this.add.text(400, 100, 'Round Complete!', {
            fontSize: '48px',
            fontFamily: 'Arial',
            color: '#ffff00',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 6
        }).setOrigin(0.5);

        // Score display
        this.add.text(400, 220, `Score: ${this.score} out of ${this.totalLetters}`, {
            fontSize: '36px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5);

        // Time display
        this.add.text(400, 290, `Time: ${this.timeSeconds} seconds`, {
            fontSize: '32px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5);

        // Performance message
        this.displayPerformanceMessage();

        // Play Again button
        this.createPlayAgainButton();

        // Celebration for perfect score
        if (this.score === this.totalLetters) {
            this.showCelebration();
        }
    }

    displayPerformanceMessage() {
        let message = '';
        const percentage = (this.score / this.totalLetters) * 100;

        if (percentage === 100) {
            message = 'Perfect! Amazing work!';
        } else if (percentage >= 80) {
            message = 'Great job!';
        } else if (percentage >= 60) {
            message = 'Good effort!';
        } else {
            message = 'Keep practicing!';
        }

        this.add.text(400, 360, message, {
            fontSize: '28px',
            color: '#ffff00',
            fontStyle: 'italic'
        }).setOrigin(0.5);
    }

    createPlayAgainButton() {
        // Button background
        const buttonBg = this.add.rectangle(400, 480, 240, 80, 0x4CAF50);
        buttonBg.setStrokeStyle(4, 0xffffff);

        // Button text
        const buttonText = this.add.text(400, 480, 'Play Again', {
            fontSize: '32px',
            fontFamily: 'Arial',
            color: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Make interactive
        buttonBg.setInteractive({ useHandCursor: true });

        // Hover effects
        buttonBg.on('pointerover', () => {
            this.tweens.add({
                targets: [buttonBg, buttonText],
                scaleX: 1.1,
                scaleY: 1.1,
                duration: 200,
                ease: 'Power2'
            });
        });

        buttonBg.on('pointerout', () => {
            this.tweens.add({
                targets: [buttonBg, buttonText],
                scaleX: 1.0,
                scaleY: 1.0,
                duration: 200,
                ease: 'Power2'
            });
        });

        // Click handler
        buttonBg.on('pointerdown', () => {
            this.sound.play('buttonClick');

            this.tweens.add({
                targets: [buttonBg, buttonText],
                scaleX: 0.95,
                scaleY: 0.95,
                duration: 100,
                yoyo: true,
                onComplete: () => {
                    this.scene.start('LetterPopScene');
                }
            });
        });
    }

    showCelebration() {
        // Add star particles or simple text celebration
        const stars = [];
        for (let i = 0; i < 20; i++) {
            const x = Phaser.Math.Between(200, 600);
            const y = Phaser.Math.Between(50, 150);
            const star = this.add.text(x, y, '⭐', { fontSize: '24px' });
            stars.push(star);

            this.tweens.add({
                targets: star,
                y: y + Phaser.Math.Between(50, 150),
                alpha: 0,
                duration: 2000,
                ease: 'Power2'
            });
        }
    }
}
```

### Updated config.js
```javascript
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game-container',
    backgroundColor: '#4488ff',
    scene: [
        BootScene,
        PreloadScene,
        MainMenuScene,
        LetterPopScene,
        ResultsScene  // Add ResultsScene to scene array
    ]
};

const game = new Phaser.Game(config);
```

### Updated index.html
```html
<!-- Add ResultsScene script -->
<script src="src/scenes/ResultsScene.js"></script>
```

## Acceptance Criteria
- [ ] Round starts with 10 randomly selected letters
- [ ] Letters display sequentially, one at a time
- [ ] Progress indicator shows "Letter X of 10"
- [ ] Correct answer advances to next letter
- [ ] Incorrect answer keeps player on same letter
- [ ] Round ends after 10th correct answer
- [ ] ResultsScene displays with score (X/10)
- [ ] ResultsScene displays time taken in seconds
- [ ] Performance message appears based on score
- [ ] "Play Again" button is visible and interactive
- [ ] Button has hover animation (scale effect)
- [ ] Button click returns to LetterPopScene
- [ ] New round starts with fresh letter sequence
- [ ] Perfect score (10/10) triggers celebration effect
- [ ] No errors in browser console
- [ ] Complete game loop works smoothly

## Testing Steps
1. Load game and navigate to LetterPopScene
2. Verify first letter displays with "Letter 1 of 10"
3. Answer first letter correctly
   - Verify correct sound plays
   - Verify advances to "Letter 2 of 10"
4. Intentionally answer a letter incorrectly
   - Verify incorrect sound plays
   - Verify stays on same letter
5. Answer correctly to advance
6. Continue through all 10 letters
7. Verify ResultsScene appears after 10th correct answer
8. Check score displays correctly (count your correct answers)
9. Check time is reasonable (should be displayed in seconds)
10. Check performance message matches your score
11. Hover over "Play Again" button
    - Verify cursor changes to pointer
    - Verify button scales up
12. Click "Play Again"
    - Verify button click sound plays
    - Verify returns to LetterPopScene
13. Verify new round has different letter sequence
14. Play perfect round (10/10) and check for celebration effect
15. Test multiple rounds in sequence

## Estimated Time
1.5 hours

## Dependencies
- LetterPopScene with letter display functionality
- Audio assets for correct/incorrect sounds
- Audio asset for button click
- Phaser tween system for animations

## Risks
- **Letter repetition**: May get same letter multiple times in sequence
  - Mitigation: Consider ensuring variety in letter selection
- **Time calculation accuracy**: Date.now() vs game time
  - Mitigation: Use Date.now() for simplicity in Phase 12
- **State reset issues**: Round state not resetting properly
  - Mitigation: Clear all state variables in startRound()
- **Data passing failure**: Results data not received
  - Mitigation: Use default values in init(data) method
- **Memory leaks**: Not destroying game objects properly
  - Mitigation: Destroy previous objects before creating new ones

## ADHD-Friendly Design Considerations
- **Clear progress**: "Letter X of 10" shows exactly where they are
- **Immediate feedback**: Each answer gets instant audio/visual response
- **Fixed endpoint**: 10 letters is manageable, not overwhelming
- **Celebration**: Perfect score gets special recognition
- **Easy replay**: One-click to start new round, no navigation
- **Visual variety**: Different letters keep engagement high
- **Time tracking**: Shows accomplishment without pressure
- **No penalties**: Incorrect answers don't end round, just require retry

## Notes
- 10 letters per round is a good starter length (not too short, not too long)
- Time tracking adds replay value without adding pressure
- Results screen provides sense of closure and accomplishment
- Immediate replay option maintains engagement momentum
- Performance messages are encouraging, never negative
- Consider adding difficulty levels in future phases (Phase 13+)
- Consider tracking high scores/best times in future phases
- Letter sequence generation could be enhanced to ensure variety

## State Management Flow
```
Start Round → Initialize State → Generate 10 Letters
    ↓
Display Letter 1 → Wait for Answer
    ↓
Correct? → Yes → Increment Index → Next Letter (repeat)
    ↓
    No → Show Feedback → Stay on Same Letter
    ↓
Index === 9 && Correct? → Yes → End Round
    ↓
Calculate Score & Time → Transition to Results
    ↓
Show Results → Play Again Button
    ↓
Click Play Again → Start Round (loop)
```

## Completion Checklist
- [ ] Round state management implemented
- [ ] Letter sequence generation working
- [ ] Progress indicator displays correctly
- [ ] Round end detection triggers properly
- [ ] ResultsScene created and styled
- [ ] Score and time display accurately
- [ ] Performance message logic implemented
- [ ] Play Again button created with animations
- [ ] Scene transitions work smoothly
- [ ] Data passing between scenes works
- [ ] Perfect score celebration implemented
- [ ] All acceptance criteria met
- [ ] Tested complete game loop multiple times
- [ ] No console errors
- [ ] Ready to proceed to Phase 13

## What's Next (Phase 13)
- Add difficulty levels (easy/medium/hard)
- Implement persistent high score tracking
- Add additional game modes
- Enhance visual effects and animations
