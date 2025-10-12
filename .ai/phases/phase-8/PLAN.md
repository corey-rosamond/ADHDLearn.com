# Phase 8: Letter Pop - Bubble Interaction

## Goal
Make bubbles clickable with audio and visual feedback

## Context
This phase adds interactivity to the bubbles created in Phase 7. When a player clicks or taps a bubble, it should:
1. Play a satisfying "pop" sound effect
2. Play the letter's phonetic audio ("A")
3. Animate (scale up and fade out)
4. Remove itself from the scene

This is the core gameplay mechanic that teaches letter recognition through audio-visual reinforcement.

## Prerequisites
- Phase 7 completed (single bubble spawning and floating)
- Pop sound effect available in `/assets/audio/pop.mp3`
- Letter audio files available in `/assets/audio/letters/A.mp3`

## Tasks

### 1. Enable Interactive Mode on Bubble
Make the bubble sprite interactive so it can receive pointer events.

```javascript
// In LetterBubble class or bubble creation code
this.bubble.setInteractive();
```

### 2. Add Click/Tap Event Handler
Set up pointer event listener to detect clicks/taps on the bubble.

```javascript
// Add to bubble sprite
this.bubble.on('pointerdown', () => {
    this.onBubblePopped();
});
```

### 3. Load Audio Assets
Preload the required audio files in the scene's preload function.

```javascript
// In scene preload()
preload() {
    this.load.audio('pop', 'assets/audio/pop.mp3');
    this.load.audio('letter-a', 'assets/audio/letters/A.mp3');
}
```

### 4. Play Sound Effects
Create audio playback when bubble is clicked.

```javascript
onBubblePopped() {
    // Play pop sound immediately
    this.sound.play('pop');

    // Play letter sound after short delay
    this.time.delayedCall(100, () => {
        this.sound.play('letter-a');
    });
}
```

### 5. Create Pop Animation
Add visual feedback using Phaser tweens for scale and alpha.

```javascript
onBubblePopped() {
    // Disable further interaction
    this.bubble.disableInteractive();

    // Play sounds (from step 4)
    this.sound.play('pop');
    this.time.delayedCall(100, () => {
        this.sound.play('letter-a');
    });

    // Scale up and fade out animation
    this.tweens.add({
        targets: this.bubble,
        scaleX: 1.5,
        scaleY: 1.5,
        alpha: 0,
        duration: 300,
        ease: 'Power2',
        onComplete: () => {
            this.bubble.destroy();
        }
    });
}
```

### 6. Destroy Bubble After Animation
Ensure the bubble game object is properly cleaned up.

```javascript
// In tween onComplete callback
onComplete: () => {
    this.bubble.destroy();
}
```

### 7. Test All Effects Together
- Click bubble and verify pop sound plays
- Verify letter audio plays shortly after
- Verify bubble scales up smoothly
- Verify bubble fades out completely
- Verify bubble is removed from scene
- Verify no errors in console

## Implementation Details

### Complete LetterBubble Class Example

```javascript
class LetterBubble {
    constructor(scene, x, y, letter) {
        this.scene = scene;
        this.letter = letter;

        // Create bubble sprite
        this.bubble = scene.add.circle(x, y, 50, 0x88ccff);
        this.bubble.setStrokeStyle(4, 0x4488ff);

        // Add letter text
        this.letterText = scene.add.text(x, y, letter, {
            fontSize: '48px',
            color: '#ffffff',
            fontFamily: 'Arial Black'
        }).setOrigin(0.5);

        // Make interactive
        this.bubble.setInteractive();
        this.bubble.on('pointerdown', () => this.onPop());

        // Float animation (from Phase 7)
        scene.tweens.add({
            targets: [this.bubble, this.letterText],
            y: '-=400',
            duration: 5000,
            ease: 'Linear'
        });
    }

    onPop() {
        // Prevent multiple clicks
        this.bubble.disableInteractive();

        // Play sounds
        this.scene.sound.play('pop');
        this.scene.time.delayedCall(100, () => {
            this.scene.sound.play(`letter-${this.letter.toLowerCase()}`);
        });

        // Pop animation
        this.scene.tweens.add({
            targets: [this.bubble, this.letterText],
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

    destroy() {
        this.bubble.destroy();
        this.letterText.destroy();
    }
}
```

### Scene Implementation Example

```javascript
class GameScene extends Phaser.Scene {
    preload() {
        // Load audio
        this.load.audio('pop', 'assets/audio/pop.mp3');
        this.load.audio('letter-a', 'assets/audio/letters/A.mp3');
    }

    create() {
        // Create single bubble for testing
        this.bubble = new LetterBubble(this, 400, 500, 'A');
    }
}
```

## Acceptance Criteria
- [ ] Bubble has interactive cursor on hover
- [ ] Click/tap triggers pop sound immediately
- [ ] Letter "A" audio plays shortly after pop
- [ ] Bubble scales up to 1.5x size smoothly
- [ ] Bubble fades to alpha 0 over 300ms
- [ ] Animation uses Power2 easing for polish
- [ ] Bubble is destroyed after animation completes
- [ ] Multiple clicks don't cause issues (disabled after first)
- [ ] No console errors during or after interaction
- [ ] Audio plays correctly on desktop and mobile

## Testing Steps
1. Open game in browser
2. Wait for bubble to appear
3. Hover over bubble (cursor should change)
4. Click bubble
5. Verify pop sound plays immediately
6. Verify letter audio plays ~100ms later
7. Watch bubble scale up and fade out
8. Verify bubble disappears completely
9. Check console for errors
10. Test on mobile device (tap interaction)

## Estimated Time
1 hour

## Dependencies
- Phase 7 (bubble spawning and floating)
- Pop sound effect file
- Letter A audio file

## Risks
- **Audio not playing**: Check file paths and formats (MP3 widely supported)
- **Animation choppy**: May need to adjust easing or duration
- **Touch not working**: Ensure setInteractive() is called properly
- **Multiple clicks**: Use disableInteractive() to prevent

## Notes
- Keep animation duration short (300ms) for snappy feedback
- Pop sound should be satisfying and not too loud
- Letter audio should be clear and child-friendly
- Consider adding particle effects in future phase
- This pattern will be reused for all letter bubbles

## Completion Checklist
- [ ] All tasks completed
- [ ] All acceptance criteria met
- [ ] Tested on desktop browser
- [ ] Tested on mobile device
- [ ] Audio works correctly
- [ ] Animation is smooth
- [ ] No console errors
- [ ] Code is clean and commented
- [ ] Ready to proceed to Phase 9
