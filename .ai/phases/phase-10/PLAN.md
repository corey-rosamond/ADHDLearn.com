# Phase 10: Letter Pop - Target Letter Game Logic

## Goal
Implement correct/incorrect feedback logic for the Letter Pop bubble-popping game

## Context
This phase builds the core game mechanics for Aurora's Letter Pop game. The game needs to:
1. Choose a target letter for each round
2. Provide audio instructions ("Find the letter B!")
3. Distinguish between correct and incorrect bubble clicks
4. Give positive feedback for correct clicks (celebration)
5. Give non-punitive feedback for incorrect clicks (gentle wobble)
6. Maintain ADHD-friendly design with encouraging, non-frustrating interactions

## Prerequisites
- Phase 1-9 completed
- LetterPopScene exists with basic bubble spawning
- Audio system functional
- Bubble click detection working
- Audio files for letter names and success sounds ready

## Tasks

### 1. Implement Target Letter Selection
- Create method to randomly select a target letter (A-Z)
- Store target letter in scene state
- Reset target letter at start of each round
- Ensure letter selection is truly random

### 2. Create Audio Instruction System
- Load audio files for "Find the letter [A-Z]!" prompts
- Play target letter audio at round start
- Format: "Find the letter B!" (clear, encouraging tone)
- Queue audio properly (don't overlap with other sounds)

### 3. Implement Correct Click Logic
- Add click handler to detect which letter was clicked
- Compare clicked letter to target letter
- If match: trigger celebration sequence
- Celebration includes: bubble pop, success sound, visual sparkles/stars
- Remove correct bubble from screen
- Increment score (tracked in Phase 11)

### 4. Implement Incorrect Click Logic
- Detect when incorrect bubble is clicked
- If no match: trigger gentle wobble animation
- Wobble: small shake side-to-side (2-3 times)
- Play gentle "try again" sound (optional, non-negative)
- Keep bubble on screen (non-punitive)
- Allow player to try again immediately

### 5. Add Visual Feedback System
- Create celebration particle effect for correct clicks
- Add sparkle animation or star burst
- Implement wobble tween for incorrect clicks
- Ensure animations are smooth and quick (<500ms)
- Visual feedback should be clear but not overwhelming

### 6. Test Game Flow
- Verify target letter audio plays at round start
- Test correct bubble click → celebration → bubble removed
- Test incorrect bubble click → wobble → bubble remains
- Confirm multiple incorrect attempts allowed
- Ensure audio timing feels natural

## Implementation Details

### Target Letter Selection
```javascript
class LetterPopScene extends Phaser.Scene {
    constructor() {
        super({ key: 'LetterPopScene' });
        this.targetLetter = null;
        this.letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    }

    selectTargetLetter() {
        const randomIndex = Phaser.Math.Between(0, this.letters.length - 1);
        this.targetLetter = this.letters[randomIndex];
        console.log('Target letter:', this.targetLetter);
        return this.targetLetter;
    }

    startRound() {
        // Select target letter
        this.selectTargetLetter();

        // Play audio instruction
        this.playTargetLetterAudio();

        // Spawn bubbles (existing logic from Phase 9)
        this.spawnBubbles();
    }

    playTargetLetterAudio() {
        // Play audio: "Find the letter B!"
        const audioKey = `find_letter_${this.targetLetter}`;
        this.sound.play(audioKey);
    }
}
```

### Bubble Click Handler
```javascript
createBubble(x, y, letter) {
    // Create bubble visual (existing code)
    const bubble = this.add.circle(x, y, 40, 0x4488ff);
    const letterText = this.add.text(x, y, letter, {
        fontSize: '32px',
        color: '#ffffff'
    }).setOrigin(0.5);

    // Group bubble and text
    const bubbleContainer = this.add.container(x, y, [bubble, letterText]);

    // Store letter data
    bubbleContainer.setData('letter', letter);

    // Make interactive
    bubble.setInteractive({ useHandCursor: true });

    // Add click handler
    bubble.on('pointerdown', () => {
        this.handleBubbleClick(bubbleContainer, letter);
    });

    return bubbleContainer;
}

handleBubbleClick(bubbleContainer, clickedLetter) {
    if (clickedLetter === this.targetLetter) {
        // CORRECT!
        this.handleCorrectClick(bubbleContainer);
    } else {
        // INCORRECT - but non-punitive
        this.handleIncorrectClick(bubbleContainer);
    }
}
```

### Correct Click Celebration
```javascript
handleCorrectClick(bubbleContainer) {
    // Play success sound
    this.sound.play('success');

    // Create celebration particles
    this.createCelebrationEffect(bubbleContainer.x, bubbleContainer.y);

    // Pop animation (scale up then fade out)
    this.tweens.add({
        targets: bubbleContainer,
        scaleX: 1.5,
        scaleY: 1.5,
        alpha: 0,
        duration: 300,
        ease: 'Power2',
        onComplete: () => {
            bubbleContainer.destroy();
        }
    });

    // Increment score (Phase 11)
    this.incrementScore();

    // Check if round complete
    this.checkRoundComplete();
}

createCelebrationEffect(x, y) {
    // Simple star burst effect
    const colors = [0xFFD700, 0xFF69B4, 0x00CED1, 0x90EE90];

    for (let i = 0; i < 8; i++) {
        const angle = (Math.PI * 2 * i) / 8;
        const star = this.add.circle(x, y, 5, colors[i % colors.length]);

        const targetX = x + Math.cos(angle) * 100;
        const targetY = y + Math.sin(angle) * 100;

        this.tweens.add({
            targets: star,
            x: targetX,
            y: targetY,
            alpha: 0,
            duration: 400,
            ease: 'Power2',
            onComplete: () => star.destroy()
        });
    }
}
```

### Incorrect Click Wobble (Non-Punitive)
```javascript
handleIncorrectClick(bubbleContainer) {
    // Optional: play gentle "try again" sound
    // this.sound.play('tryAgain'); // Keep it subtle or skip

    // Wobble animation - gentle side-to-side
    this.tweens.add({
        targets: bubbleContainer,
        x: bubbleContainer.x - 10,
        duration: 50,
        yoyo: true,
        repeat: 2,
        ease: 'Power1'
    });

    // Bubble stays on screen - player can try again
    // No negative feedback, no score penalty
}
```

### Audio Preloading
```javascript
preload() {
    // Load target letter audio
    for (let letter of 'ABCDEFGHIJKLMNOPQRSTUVWXYZ') {
        this.load.audio(`find_letter_${letter}`,
            `assets/audio/find_letter_${letter}.mp3`);
    }

    // Load feedback sounds
    this.load.audio('success', 'assets/audio/success.mp3');
    this.load.audio('tryAgain', 'assets/audio/try_again.mp3'); // Optional
}
```

## Acceptance Criteria
- [ ] Target letter is randomly selected at round start
- [ ] Audio instruction plays clearly ("Find the letter B!")
- [ ] Clicking correct bubble triggers celebration effect
- [ ] Celebration includes: visual effect, sound, bubble removal
- [ ] Clicking incorrect bubble triggers gentle wobble
- [ ] Wobble animation is smooth and brief (3 shakes)
- [ ] Incorrect bubble stays on screen after wobble
- [ ] Player can click again immediately after incorrect click
- [ ] No negative audio for incorrect clicks
- [ ] Visual feedback is clear and encouraging
- [ ] Game flow feels natural and non-frustrating
- [ ] All audio plays at appropriate volume

## Testing Steps
1. Start LetterPopScene
2. Verify target letter audio plays ("Find the letter X!")
3. Click the correct bubble:
   - Hear success sound
   - See celebration particles
   - Bubble disappears
4. Click an incorrect bubble:
   - Bubble wobbles gently
   - Bubble stays on screen
   - No negative sound (or very gentle)
5. Click incorrect bubble multiple times:
   - Each click wobbles the bubble
   - No accumulating frustration
   - Player can keep trying
6. Test with different target letters (A-Z)
7. Verify audio doesn't overlap awkwardly
8. Check browser console for errors
9. Test on touch device
10. Verify game feels encouraging, not punishing

## Estimated Time
1.5 hours

## Dependencies
- Phaser 3 tweens system
- Audio assets for all 26 letter instructions
- Success sound effect
- Bubble click detection from Phase 9

## Risks
- **Audio file naming**: Ensure consistent naming convention (find_letter_A.mp3)
- **Audio timing**: Target audio might overlap with previous sounds
- **Touch device responsiveness**: Ensure wobble doesn't interfere with second taps
- **Performance**: Particle effects must be lightweight (8-10 particles max)

## ADHD-Friendly Design Considerations
- **Non-punitive failure**: Wrong clicks just wobble, don't remove bubbles
- **Immediate feedback**: Both correct and incorrect clicks respond instantly
- **Positive reinforcement**: Success is celebrated, failure is gentle
- **No time pressure**: Player can take as long as needed
- **Clear audio cues**: Explicit instruction ("Find the letter B!")
- **Visual clarity**: Celebration effects are obvious but not overwhelming
- **No accumulating errors**: Each click is independent, no strike system
- **Encouraging tone**: All feedback is supportive, never negative

## Notes
- Keep wobble animation subtle (10px movement, 150ms total)
- Celebration particles should disappear quickly (400ms)
- Success sound should be cheerful but not overwhelming
- Avoid "wrong" or "error" sounds - use silence or gentle "hmm" if needed
- Target letter audio is crucial - must be clear and encouraging
- Consider Aurora's voice for audio instructions if available
- Test with actual ADHD individuals if possible
- This phase sets the tone for the entire game - make it encouraging!

## Completion Checklist
- [ ] Target letter selection implemented
- [ ] Audio instruction system working
- [ ] Correct click logic complete with celebration
- [ ] Incorrect click logic complete with wobble
- [ ] Visual feedback effects created
- [ ] All acceptance criteria met
- [ ] Tested with multiple letters
- [ ] Tested correct and incorrect clicks
- [ ] Audio timing feels natural
- [ ] No console errors
- [ ] Touch device tested
- [ ] Game feels encouraging and non-frustrating
- [ ] Ready to proceed to Phase 11 (scoring)
