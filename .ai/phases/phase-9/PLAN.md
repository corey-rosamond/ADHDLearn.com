# Phase 9: Letter Pop - Multiple Bubbles

## Goal
Spawn multiple bubbles with different letters simultaneously

## Context
Phase 8 established the interaction pattern for a single bubble. Now we expand to multiple bubbles:
- Create 3 bubbles with letters A, B, and C
- Each bubble spawns at a random horizontal position
- All bubbles float upward independently
- Each bubble is independently clickable
- Each plays its own letter's audio when popped
- Bubbles don't overlap or collide

This phase tests that our bubble system scales to multiple instances and prepares for future phases with more complex spawning logic.

## Prerequisites
- Phase 8 completed (single bubble with click interaction)
- Letter audio files for A, B, C available:
  - `/assets/audio/letters/A.mp3`
  - `/assets/audio/letters/B.mp3`
  - `/assets/audio/letters/C.mp3`

## Tasks

### 1. Create Bubble Array
Store multiple bubble instances for tracking.

```javascript
// In GameScene class
create() {
    this.bubbles = [];
}
```

### 2. Preload Multiple Letter Sounds
Load audio for letters A, B, and C.

```javascript
preload() {
    this.load.audio('pop', 'assets/audio/pop.mp3');
    this.load.audio('letter-a', 'assets/audio/letters/A.mp3');
    this.load.audio('letter-b', 'assets/audio/letters/B.mp3');
    this.load.audio('letter-c', 'assets/audio/letters/C.mp3');
}
```

### 3. Create Random Position Generator
Ensure bubbles don't overlap by spacing them out.

```javascript
getRandomX(minDistance = 150) {
    // Random X between 100 and 700 (staying on screen)
    return Phaser.Math.Between(100, 700);
}
```

### 4. Spawn Multiple Bubbles
Create 3 bubbles with different letters at different positions.

```javascript
create() {
    this.bubbles = [];

    // Spawn positions
    const positions = [
        { x: 200, y: 500 },
        { x: 400, y: 500 },
        { x: 600, y: 500 }
    ];

    const letters = ['A', 'B', 'C'];

    // Create bubbles
    letters.forEach((letter, index) => {
        const bubble = new LetterBubble(
            this,
            positions[index].x,
            positions[index].y,
            letter
        );
        this.bubbles.push(bubble);
    });
}
```

### 5. Update LetterBubble to Use Dynamic Audio
Modify bubble class to play the correct letter sound based on its letter property.

```javascript
// In LetterBubble.onPop()
onPop() {
    this.bubble.disableInteractive();

    this.scene.sound.play('pop');

    // Dynamic letter sound based on this.letter
    const letterKey = `letter-${this.letter.toLowerCase()}`;
    this.scene.time.delayedCall(100, () => {
        this.scene.sound.play(letterKey);
    });

    // ... rest of animation code
}
```

### 6. Handle Individual Bubble Destruction
Ensure each bubble can be destroyed independently without affecting others.

```javascript
// In LetterBubble.destroy()
destroy() {
    // Remove from scene's bubble array
    const index = this.scene.bubbles.indexOf(this);
    if (index > -1) {
        this.scene.bubbles.splice(index, 1);
    }

    // Destroy game objects
    this.bubble.destroy();
    this.letterText.destroy();
}
```

### 7. Implement Improved Random Positioning
Add logic to prevent bubbles from spawning too close together.

```javascript
generateSpawnPositions(count, minDistance = 150) {
    const positions = [];
    const minX = 100;
    const maxX = 700;
    const y = 500;

    for (let i = 0; i < count; i++) {
        let attempts = 0;
        let validPosition = false;
        let x;

        while (!validPosition && attempts < 50) {
            x = Phaser.Math.Between(minX, maxX);
            validPosition = true;

            // Check distance from existing positions
            for (let pos of positions) {
                if (Math.abs(pos.x - x) < minDistance) {
                    validPosition = false;
                    break;
                }
            }
            attempts++;
        }

        positions.push({ x, y });
    }

    return positions;
}
```

### 8. Test All Bubbles Independently
- Verify all 3 bubbles appear on screen
- Click each bubble individually
- Verify correct letter audio plays for each
- Verify other bubbles continue floating
- Verify no overlap or collision issues

## Implementation Details

### Complete GameScene with Multiple Bubbles

```javascript
class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    preload() {
        // Load audio
        this.load.audio('pop', 'assets/audio/pop.mp3');
        this.load.audio('letter-a', 'assets/audio/letters/A.mp3');
        this.load.audio('letter-b', 'assets/audio/letters/B.mp3');
        this.load.audio('letter-c', 'assets/audio/letters/C.mp3');
    }

    create() {
        this.bubbles = [];

        // Generate random positions
        const positions = this.generateSpawnPositions(3, 150);
        const letters = ['A', 'B', 'C'];

        // Create bubbles
        letters.forEach((letter, index) => {
            const bubble = new LetterBubble(
                this,
                positions[index].x,
                positions[index].y,
                letter
            );
            this.bubbles.push(bubble);
        });
    }

    generateSpawnPositions(count, minDistance = 150) {
        const positions = [];
        const minX = 100;
        const maxX = 700;
        const y = 500;

        for (let i = 0; i < count; i++) {
            let attempts = 0;
            let validPosition = false;
            let x;

            while (!validPosition && attempts < 50) {
                x = Phaser.Math.Between(minX, maxX);
                validPosition = true;

                for (let pos of positions) {
                    if (Math.abs(pos.x - x) < minDistance) {
                        validPosition = false;
                        break;
                    }
                }
                attempts++;
            }

            positions.push({ x, y });
        }

        return positions;
    }
}
```

### Updated LetterBubble Class

```javascript
class LetterBubble {
    constructor(scene, x, y, letter) {
        this.scene = scene;
        this.letter = letter;
        this.isPopped = false;

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

        // Float animation
        scene.tweens.add({
            targets: [this.bubble, this.letterText],
            y: '-=400',
            duration: 5000,
            ease: 'Linear'
        });
    }

    onPop() {
        if (this.isPopped) return;
        this.isPopped = true;

        // Prevent multiple clicks
        this.bubble.disableInteractive();

        // Play sounds with dynamic letter key
        this.scene.sound.play('pop');
        const letterKey = `letter-${this.letter.toLowerCase()}`;
        this.scene.time.delayedCall(100, () => {
            this.scene.sound.play(letterKey);
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
        // Remove from scene's bubble array
        const index = this.scene.bubbles.indexOf(this);
        if (index > -1) {
            this.scene.bubbles.splice(index, 1);
        }

        // Destroy game objects
        if (this.bubble) this.bubble.destroy();
        if (this.letterText) this.letterText.destroy();
    }
}
```

## Acceptance Criteria
- [ ] 3 bubbles spawn simultaneously
- [ ] Bubbles show letters A, B, and C
- [ ] Each bubble spawns at a different X position
- [ ] Bubbles maintain minimum 150px spacing
- [ ] All bubbles float upward independently
- [ ] Each bubble is independently clickable
- [ ] Clicking bubble A plays "A" audio
- [ ] Clicking bubble B plays "B" audio
- [ ] Clicking bubble C plays "C" audio
- [ ] Popping one bubble doesn't affect others
- [ ] All bubbles can be popped in any order
- [ ] Bubbles don't visually overlap
- [ ] No console errors with multiple instances

## Testing Steps
1. Open game in browser
2. Verify 3 bubbles appear at bottom of screen
3. Verify bubbles show letters A, B, C
4. Verify bubbles are spaced apart (not overlapping)
5. Watch all 3 bubbles float upward
6. Click bubble A
   - Verify "A" audio plays
   - Verify bubble A disappears
   - Verify bubbles B and C continue floating
7. Click bubble B
   - Verify "B" audio plays
   - Verify bubble B disappears
   - Verify bubble C continues floating
8. Click bubble C
   - Verify "C" audio plays
   - Verify bubble C disappears
9. Check console for errors
10. Test different clicking orders (B, A, C or C, B, A)

## Estimated Time
1 hour

## Dependencies
- Phase 8 (single bubble interaction)
- Letter audio files for A, B, C

## Risks
- **Bubbles overlap**: Use spacing algorithm to prevent
- **Wrong audio plays**: Ensure letter keys match audio file names
- **Memory leaks**: Properly remove bubbles from array on destroy
- **Performance issues**: Monitor frame rate with 3 instances (should be fine)

## Notes
- Keep spawn positions deterministic for testing (can randomize later)
- 150px minimum spacing prevents visual overlap
- Each bubble is completely independent (no shared state)
- Array tracking allows for future features (counting remaining bubbles)
- This pattern will scale to 10+ bubbles in later phases

## Completion Checklist
- [ ] All tasks completed
- [ ] All acceptance criteria met
- [ ] Tested clicking bubbles in different orders
- [ ] Verified each letter plays correct audio
- [ ] Verified no overlap issues
- [ ] No console errors
- [ ] Code is clean and organized
- [ ] Ready to proceed to Phase 10
