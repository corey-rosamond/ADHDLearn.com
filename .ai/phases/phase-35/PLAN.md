# Phase 35: Memory Match - Matching Logic

## Goal
Implement the core memory game logic that detects matches, keeps matched cards revealed, and determines round completion.

## Context
This phase transforms the card flipping mechanics from Phase 34 into a complete memory matching game. When players flip two cards:
1. The game compares the letters on both cards
2. If they match: cards stay revealed with celebration
3. If they don't match: cards flip back after a delay
4. The match counter updates
5. When all 6 pairs are found, the round completes

The matching logic must feel fair and responsive, with timing carefully tuned for ADHD learners. The 1-second mismatch delay gives players time to memorize card positions without feeling punishing or slow.

## Prerequisites
- Phase 33 completed (MemoryMatchScene with grid)
- Phase 34 completed (Card class with flip animation)
- Cards can flip and reveal letters
- Two-card selection limit working
- Phase 15 completed (particle effects for celebrations)
- AudioManager available for sound effects

## Tasks

### 1. Implement Match Detection
**Logic**: Compare two flipped cards

**Implementation**:
```javascript
checkForMatch() {
    if (this.flippedCards.length !== 2) {
        return; // Need exactly 2 cards
    }

    const card1 = this.flippedCards[0];
    const card2 = this.flippedCards[1];

    // Compare letters
    const isMatch = card1.cardData.letter === card2.cardData.letter;

    console.log('[MemoryMatchScene] Checking match:', {
        card1: card1.cardData.letter,
        card2: card2.cardData.letter,
        match: isMatch
    });

    if (isMatch) {
        this.handleMatch();
    } else {
        this.handleMismatch();
    }
}
```

**When to Check**:
- After second card flip completes
- Use card's `flipComplete` event
- Or delay by 300ms after second flip starts

### 2. Handle Matching Cards
**On Match**: Keep cards revealed and celebrate

**Implementation**:
```javascript
handleMatch() {
    console.log('[MemoryMatchScene] Match found!');

    const card1 = this.flippedCards[0];
    const card2 = this.flippedCards[1];

    // Short delay for player to see match (300ms)
    this.time.delayedCall(300, () => {
        // Mark cards as matched
        card1.setMatched();
        card2.setMatched();

        // Add to matched cards tracking
        this.matchedCards.push(card1, card2);

        // Increment match count
        this.matchCount++;
        this.updateMatchesDisplay();

        // Play success sound
        this.sound.play('match-success', { volume: 0.5 });

        // Particle celebration at each card
        this.triggerMatchCelebration(card1.x, card1.y);
        this.triggerMatchCelebration(card2.x, card2.y);

        // Clear flipped cards array
        this.flippedCards = [];

        // Check if round is complete
        if (this.matchCount >= this.totalPairs) {
            this.handleRoundComplete();
        } else {
            // Re-enable input for next pair
            this.canFlip = true;
        }
    });
}
```

**Visual Feedback**:
- Cards fade to 70% opacity (already in setMatched())
- Particle burst at each card position
- Match counter updates
- Success sound plays

### 3. Handle Mismatched Cards
**On Mismatch**: Flip cards back after delay

**Timing Consideration**: 1-second delay for ADHD learners
- Gives time to memorize positions
- Not so long it feels punishing
- Allows visual processing

**Implementation**:
```javascript
handleMismatch() {
    console.log('[MemoryMatchScene] No match');

    // Play mismatch sound (gentle, not negative)
    this.sound.play('card-mismatch', { volume: 0.3 });

    // Longer delay to allow memorization (1000ms)
    this.time.delayedCall(1000, () => {
        console.log('[MemoryMatchScene] Flipping mismatched cards back');

        const card1 = this.flippedCards[0];
        const card2 = this.flippedCards[1];

        // Flip both cards back
        card1.flip(false);
        card2.flip(false);

        // Clear flipped cards array
        this.flippedCards = [];

        // Re-enable input (add small delay for flip animation)
        this.time.delayedCall(300, () => {
            this.canFlip = true;
        });
    });
}
```

**Sound Design**:
- Mismatch sound should be neutral, not negative
- Avoid "wrong" or "error" sounds
- Use gentle "whoosh" or soft tone
- Volume lower than success sound

### 4. Track Match Progress
**Counter Updates**: Visual feedback of progress

**Display**:
- Current format: "Matches: 0/6"
- Update after each match
- Examples: "Matches: 1/6", "Matches: 2/6", ..., "Matches: 6/6"

**Implementation**:
```javascript
updateMatchesDisplay() {
    this.matchesText.setText(`Matches: ${this.matchCount}/${this.totalPairs}`);

    // Optional: Animate counter update
    this.tweens.add({
        targets: this.matchesText,
        scale: { from: 1.2, to: 1.0 },
        duration: 200,
        ease: 'Back.easeOut'
    });
}
```

### 5. Detect Round Completion
**Win Condition**: All 6 pairs matched

**Detection**:
```javascript
handleRoundComplete() {
    console.log('[MemoryMatchScene] Round complete! All pairs matched!');

    // Disable all input
    this.canFlip = false;

    // Play victory music/sound
    this.sound.play('round-complete', { volume: 0.6 });

    // Large particle celebration
    this.triggerVictoryCelebration();

    // Show completion message
    this.showCompletionMessage();

    // Transition to results or replay after delay
    this.time.delayedCall(3000, () => {
        this.transitionToResults();
    });
}
```

**Victory Celebration**:
- Large confetti burst from top
- All matched cards pulse/glow
- Victory sound effect
- "Great job!" or "All matched!" text
- Smooth transition to next screen

### 6. Add Celebration Particles
**On Match**: Small burst at each card

**Implementation**:
```javascript
triggerMatchCelebration(x, y) {
    // Particle emitter (if exists from Phase 15)
    if (this.particleEmitter) {
        this.particleEmitter.setPosition(x, y);
        this.particleEmitter.explode(15, {
            speed: { min: 100, max: 200 },
            scale: { start: 0.5, end: 0 },
            lifespan: 600
        });
    }

    // Alternative: Simple sprite animation
    const star = this.add.star(x, y, 5, 10, 20, 0xFFD700);
    this.tweens.add({
        targets: star,
        scale: { from: 0, to: 1.5 },
        alpha: { from: 1, to: 0 },
        duration: 600,
        ease: 'Cubic.easeOut',
        onComplete: () => star.destroy()
    });
}
```

**On Round Complete**: Large celebration

```javascript
triggerVictoryCelebration() {
    // Large confetti burst
    if (this.particleEmitter) {
        // Multiple bursts
        for (let i = 0; i < 5; i++) {
            this.time.delayedCall(i * 200, () => {
                const x = 200 + Math.random() * 400;
                this.particleEmitter.setPosition(x, 0);
                this.particleEmitter.explode(30);
            });
        }
    }

    // Pulse all matched cards
    this.cards.forEach(card => {
        if (card.matched) {
            this.tweens.add({
                targets: card,
                scale: { from: 1, to: 1.1 },
                alpha: { from: 0.7, to: 1 },
                duration: 500,
                yoyo: true,
                repeat: 2
            });
        }
    });
}
```

### 7. Create Completion Message
**Display**: Encouraging message on round complete

**Implementation**:
```javascript
showCompletionMessage() {
    const messages = [
        "Amazing! You found them all!",
        "Great memory! All matched!",
        "Fantastic! You're a memory master!",
        "Wonderful! Perfect matches!"
    ];

    const message = Phaser.Utils.Array.GetRandom(messages);

    this.completionText = this.add.text(400, 300, message, {
        fontSize: '48px',
        fontFamily: 'Arial, sans-serif',
        color: '#FFD700',
        fontStyle: 'bold',
        stroke: '#2c3e50',
        strokeThickness: 6,
        align: 'center'
    }).setOrigin(0.5).setAlpha(0).setDepth(200);

    // Animate in
    this.tweens.add({
        targets: this.completionText,
        alpha: 1,
        scale: { from: 0.5, to: 1.2 },
        duration: 600,
        ease: 'Back.easeOut'
    });

    // Pulse animation
    this.tweens.add({
        targets: this.completionText,
        scale: { from: 1.2, to: 1.3 },
        duration: 800,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
    });
}
```

### 8. Transition to Results or Replay
**Options After Completion**:

**Option A**: Replay immediately (with "Play Again" button)
```javascript
showReplayOptions() {
    // "Play Again" button
    const playAgainBtn = this.add.text(400, 500, 'Play Again', {
        fontSize: '36px',
        fontFamily: 'Arial, sans-serif',
        color: '#ffffff',
        backgroundColor: '#27ae60',
        padding: { x: 40, y: 20 },
        fontStyle: 'bold'
    }).setOrigin(0.5).setInteractive({ useHandCursor: true }).setDepth(200);

    playAgainBtn.on('pointerdown', () => {
        this.sound.play('click-sound');
        this.scene.restart(); // Restart MemoryMatchScene
    });

    // "Main Menu" button
    const menuBtn = this.add.text(400, 560, 'Main Menu', {
        fontSize: '28px',
        fontFamily: 'Arial, sans-serif',
        color: '#ffffff',
        backgroundColor: '#e74c3c',
        padding: { x: 30, y: 15 },
        fontStyle: 'bold'
    }).setOrigin(0.5).setInteractive({ useHandCursor: true }).setDepth(200);

    menuBtn.on('pointerdown', () => {
        this.sound.play('click-sound');
        this.scene.start('MainMenu');
    });
}
```

**Option B**: Transition to ResultsScene (if exists)
```javascript
transitionToResults() {
    // Calculate stats
    const stats = {
        matchCount: this.matchCount,
        totalPairs: this.totalPairs,
        timeElapsed: this.timeElapsed, // If tracking time
        performance: 'excellent' // Based on time/moves
    };

    // Fade out and transition
    this.cameras.main.fade(500, 0, 0, 0);
    this.time.delayedCall(500, () => {
        this.scene.start('ResultsScene', stats);
    });
}
```

### 9. Add Optional Timer (Phase 35.5)
**Enhancement**: Track how long round takes

**Implementation**:
```javascript
// In init()
this.startTime = 0;
this.timeElapsed = 0;

// In create()
this.startTime = this.time.now;

// Create timer display
this.timerText = this.add.text(400, 90, 'Time: 0s', {
    fontSize: '24px',
    fontFamily: 'Arial, sans-serif',
    color: '#ffffff',
    fontStyle: 'bold'
}).setOrigin(0.5).setDepth(100);

// In update()
update() {
    if (this.canFlip || this.flippedCards.length > 0) {
        this.timeElapsed = Math.floor((this.time.now - this.startTime) / 1000);
        this.timerText.setText(`Time: ${this.timeElapsed}s`);
    }
}
```

**Note**: Timer is optional and can be added/removed based on testing with Aurora.

## Implementation Details

### Updated MemoryMatchScene with Match Logic

```javascript
// src/scenes/MemoryMatchScene.js

export default class MemoryMatchScene extends Phaser.Scene {
    // ... existing code ...

    create() {
        // ... existing setup ...

        // Listen for card flip complete events
        this.events.on('card-flip-complete', this.onCardFlipComplete, this);
    }

    onCardFlipComplete(card) {
        // Check if two cards are now face-up
        if (this.flippedCards.length === 2) {
            // Both cards flipped, check for match
            this.time.delayedCall(300, () => {
                this.checkForMatch();
            });
        }
    }

    checkForMatch() {
        if (this.flippedCards.length !== 2) return;

        const card1 = this.flippedCards[0];
        const card2 = this.flippedCards[1];

        const letter1 = card1.cardData.letter;
        const letter2 = card2.cardData.letter;

        const isMatch = letter1 === letter2;

        console.log('[MemoryMatchScene] Match check:', {
            card1: { index: card1.index, letter: letter1 },
            card2: { index: card2.index, letter: letter2 },
            result: isMatch ? 'MATCH' : 'MISMATCH'
        });

        if (isMatch) {
            this.handleMatch();
        } else {
            this.handleMismatch();
        }
    }

    handleMatch() {
        console.log('[MemoryMatchScene] Match found!');

        const card1 = this.flippedCards[0];
        const card2 = this.flippedCards[1];

        // Short delay to let player see the match
        this.time.delayedCall(300, () => {
            // Mark as matched
            card1.setMatched();
            card2.setMatched();

            // Track matched cards
            this.matchedCards.push(card1, card2);

            // Update counter
            this.matchCount++;
            this.updateMatchesDisplay();

            // Audio feedback
            this.sound.play('match-success', { volume: 0.5 });

            // Visual celebration
            this.triggerMatchCelebration(card1.x, card1.y);
            this.triggerMatchCelebration(card2.x, card2.y);

            // Clear flipped cards
            this.flippedCards = [];

            // Check win condition
            if (this.matchCount >= this.totalPairs) {
                this.handleRoundComplete();
            } else {
                this.canFlip = true;
            }
        });
    }

    handleMismatch() {
        console.log('[MemoryMatchScene] No match - flipping back');

        // Gentle audio feedback
        this.sound.play('card-mismatch', { volume: 0.3 });

        // 1 second delay for memorization (ADHD-friendly)
        this.time.delayedCall(1000, () => {
            const card1 = this.flippedCards[0];
            const card2 = this.flippedCards[1];

            // Flip both back
            card1.flip(false);
            card2.flip(false);

            // Clear and re-enable input
            this.flippedCards = [];

            this.time.delayedCall(300, () => {
                this.canFlip = true;
            });
        });
    }

    handleRoundComplete() {
        console.log('[MemoryMatchScene] Round complete!');

        this.canFlip = false;

        // Victory audio
        this.sound.play('round-complete', { volume: 0.6 });

        // Large celebration
        this.triggerVictoryCelebration();

        // Show message
        this.showCompletionMessage();

        // Show replay options
        this.time.delayedCall(2000, () => {
            this.showReplayOptions();
        });
    }

    triggerMatchCelebration(x, y) {
        // Star burst animation
        const star = this.add.star(x, y, 5, 10, 20, 0xFFD700);
        star.setDepth(150);

        this.tweens.add({
            targets: star,
            scale: { from: 0, to: 1.5 },
            alpha: { from: 1, to: 0 },
            duration: 600,
            ease: 'Cubic.easeOut',
            onComplete: () => star.destroy()
        });

        // Optional: Particle emitter
        if (this.particleEmitter) {
            this.particleEmitter.setPosition(x, y);
            this.particleEmitter.explode(15);
        }
    }

    triggerVictoryCelebration() {
        // Confetti from top
        for (let i = 0; i < 5; i++) {
            this.time.delayedCall(i * 200, () => {
                const x = 200 + Math.random() * 400;
                if (this.particleEmitter) {
                    this.particleEmitter.setPosition(x, 0);
                    this.particleEmitter.explode(30);
                }
            });
        }

        // Pulse matched cards
        this.cards.forEach(card => {
            if (card.matched) {
                this.tweens.add({
                    targets: card,
                    scale: 1.1,
                    alpha: 1,
                    duration: 500,
                    yoyo: true,
                    repeat: 2
                });
            }
        });
    }

    showCompletionMessage() {
        const messages = [
            "Amazing! You found them all!",
            "Great memory! All matched!",
            "Fantastic! You're a memory master!",
            "Wonderful! Perfect matches!"
        ];

        const message = Phaser.Utils.Array.GetRandom(messages);

        this.completionText = this.add.text(400, 250, message, {
            fontSize: '48px',
            fontFamily: 'Arial, sans-serif',
            color: '#FFD700',
            fontStyle: 'bold',
            stroke: '#2c3e50',
            strokeThickness: 6,
            align: 'center',
            wordWrap: { width: 700 }
        }).setOrigin(0.5).setAlpha(0).setDepth(200);

        this.tweens.add({
            targets: this.completionText,
            alpha: 1,
            scale: { from: 0.5, to: 1.2 },
            duration: 600,
            ease: 'Back.easeOut'
        });

        this.tweens.add({
            targets: this.completionText,
            scale: { from: 1.2, to: 1.3 },
            duration: 800,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }

    showReplayOptions() {
        // Play Again button
        const playAgainBtn = this.add.text(400, 400, 'Play Again', {
            fontSize: '36px',
            fontFamily: 'Arial, sans-serif',
            color: '#ffffff',
            backgroundColor: '#27ae60',
            padding: { x: 40, y: 20 },
            fontStyle: 'bold'
        }).setOrigin(0.5).setInteractive({ useHandCursor: true }).setDepth(200).setAlpha(0);

        this.tweens.add({
            targets: playAgainBtn,
            alpha: 1,
            y: 380,
            duration: 400,
            ease: 'Back.easeOut'
        });

        playAgainBtn.on('pointerover', () => playAgainBtn.setScale(1.1));
        playAgainBtn.on('pointerout', () => playAgainBtn.setScale(1.0));
        playAgainBtn.on('pointerdown', () => {
            this.sound.play('click-sound');
            this.cameras.main.fade(300, 0, 0, 0);
            this.time.delayedCall(300, () => this.scene.restart());
        });

        // Main Menu button
        const menuBtn = this.add.text(400, 460, 'Main Menu', {
            fontSize: '28px',
            fontFamily: 'Arial, sans-serif',
            color: '#ffffff',
            backgroundColor: '#e74c3c',
            padding: { x: 30, y: 15 },
            fontStyle: 'bold'
        }).setOrigin(0.5).setInteractive({ useHandCursor: true }).setDepth(200).setAlpha(0);

        this.tweens.add({
            targets: menuBtn,
            alpha: 1,
            y: 450,
            duration: 400,
            delay: 100,
            ease: 'Back.easeOut'
        });

        menuBtn.on('pointerover', () => menuBtn.setScale(1.1));
        menuBtn.on('pointerout', () => menuBtn.setScale(1.0));
        menuBtn.on('pointerdown', () => {
            this.sound.play('click-sound');
            this.cameras.main.fade(300, 0, 0, 0);
            this.time.delayedCall(300, () => this.scene.start('MainMenu'));
        });
    }

    updateMatchesDisplay() {
        this.matchesText.setText(`Matches: ${this.matchCount}/${this.totalPairs}`);

        // Animate update
        this.tweens.add({
            targets: this.matchesText,
            scale: { from: 1.2, to: 1.0 },
            duration: 200,
            ease: 'Back.easeOut'
        });
    }
}
```

## Acceptance Criteria
- [ ] checkForMatch() method implemented
- [ ] Compares letters of two flipped cards
- [ ] Correctly identifies matches
- [ ] Correctly identifies mismatches
- [ ] handleMatch() keeps cards revealed
- [ ] Matched cards marked with setMatched()
- [ ] Matched cards fade to alpha 0.7
- [ ] Match counter increments on match
- [ ] Match counter updates display
- [ ] Match success sound plays
- [ ] Particle celebration on match
- [ ] handleMismatch() flips cards back
- [ ] Mismatch delay is 1000ms
- [ ] Mismatch sound plays (gentle)
- [ ] flippedCards array clears correctly
- [ ] canFlip re-enables after match/mismatch
- [ ] Round complete detected (6 pairs matched)
- [ ] Victory celebration triggers
- [ ] Completion message displays
- [ ] Replay and Main Menu buttons appear
- [ ] Buttons are functional
- [ ] Scene restart works correctly
- [ ] All matched cards tracked
- [ ] No errors in console
- [ ] Smooth 60fps performance

## Testing Steps
1. Start MemoryMatchScene
2. Flip two matching cards (same letter)
   - Verify cards stay revealed
   - Verify both fade to 70% opacity
   - Verify match sound plays
   - Verify particle celebrations
   - Verify counter updates (0/6 → 1/6)
   - Verify can flip more cards
3. Flip two non-matching cards
   - Verify mismatch sound plays
   - Wait 1 second
   - Verify both cards flip back
   - Verify can flip cards again
4. Find all 6 pairs
   - Verify counter updates through 6/6
   - Verify victory celebration
   - Verify completion message appears
   - Verify "Play Again" button appears
   - Verify "Main Menu" button appears
5. Click "Play Again"
   - Verify scene restarts
   - Verify new shuffled cards
   - Verify counter resets to 0/6
6. Complete round again and click "Main Menu"
   - Verify returns to MainMenu
7. Test timing
   - Measure mismatch delay (should be 1000ms)
   - Verify timing feels comfortable
8. Test edge cases
   - Match on first two flips
   - Alternate matches and mismatches
   - Find all but one pair, then find last
9. Performance check
   - Verify 60fps throughout
   - No lag during celebrations

## Estimated Time
1.5 hours

## Dependencies
- Phase 34 (Card flip mechanics)
- Particle effects (Phase 15, optional)
- AudioManager (Phase 16)
- Sound files: match-success.mp3, card-mismatch.mp3, round-complete.mp3

## Risks
- **Timing feels wrong**: 1-second delay too long/short
  - Mitigation: Make delay configurable, test with Aurora
- **Match detection bugs**: False positives/negatives
  - Mitigation: Thorough testing, console logging
- **State management errors**: Cards stuck in wrong state
  - Mitigation: Clear state transitions, validation
- **Celebration too distracting**: Particles obscure gameplay
  - Mitigation: Limit particle count, test visual clarity

## ADHD-Friendly Design Considerations
- **1-second mismatch delay**: Perfect for memorization without frustration
- **Immediate match feedback**: Cards stay revealed instantly
- **Clear progress tracking**: Counter always visible
- **Positive reinforcement**: Success sound and particles
- **Gentle mismatch feedback**: No harsh "wrong" sounds
- **Victory celebration**: Rewarding completion experience
- **Clear next steps**: Replay buttons guide next action

## Notes
- Match logic is core game mechanic
- Timing is critical for player experience
- Test extensively with target audience
- Consider difficulty variations (Phase 36)
- Timer is optional feature
- Celebration particles enhance but aren't required

## Completion Checklist
- [ ] Match detection fully implemented
- [ ] Match handling works correctly
- [ ] Mismatch handling works correctly
- [ ] Round completion detection working
- [ ] Victory celebration implemented
- [ ] Replay options functional
- [ ] All acceptance criteria met
- [ ] Timing feels appropriate
- [ ] No console errors
- [ ] Ready for Phase 36 (polish)

## What's Next (Phase 36)
- Enhanced animations and effects
- Letter-object image pairs
- Varied difficulty levels
- Background music
- Additional polish and refinement
