# Phase 34: Memory Match - Card Flip Mechanic

## Goal
Implement smooth 3D card flip animations and reveal letter/image content when cards are clicked.

## Context
This phase transforms the static card grid from Phase 33 into an interactive memory game with satisfying flip animations. When players click cards:
1. Cards flip with a smooth 3D rotation effect
2. The letter or image is revealed on the face
3. Only 2 cards can be flipped at once (game rule)
4. Visual and audio feedback enhance the experience

The flip animation is critical for game feel and player engagement. A smooth, satisfying flip makes the game more enjoyable and rewarding for ADHD learners who respond well to immediate visual feedback.

## Prerequisites
- Phase 33 completed (MemoryMatchScene with card grid)
- Card sprites created and positioned
- Card data structure with letters assigned
- Click handlers in place (placeholder from Phase 33)
- AudioManager available for sound effects

## Tasks

### 1. Create Card Class
**File**: `src/objects/Card.js`

Create a reusable Card class:
- Extends Phaser.GameObjects.Container
- Contains both back and front sprites
- Manages flip state (faceUp/faceDown)
- Provides flip animation method
- Handles visual updates
- Stores card data (letter, matched status)

**Class Structure**:
```javascript
export default class Card extends Phaser.GameObjects.Container {
    constructor(scene, x, y, cardData, index) {
        super(scene, x, y);

        this.scene = scene;
        this.cardData = cardData;
        this.index = index;
        this.flipped = false;
        this.matched = false;

        this.createCardSprites();
        this.setupInteraction();

        scene.add.existing(this);
    }

    createCardSprites() {
        // Back sprite
        // Front sprite with letter/image
    }

    flip(faceUp, duration = 300) {
        // 3D rotation flip animation
    }

    setMatched() {
        // Mark as matched, disable interaction
    }
}
```

### 2. Implement 3D Flip Animation
**Animation Effect**: Simulated 3D card flip using scaleX

**Technique**: Two-phase animation
1. **Phase 1**: Scale X from 1 to 0 (card shrinks horizontally)
   - Duration: 150ms
   - Easing: Sine.easeIn
   - At midpoint (scaleX = 0), card is edge-on
2. **Phase 2**: Scale X from 0 to 1 (card expands with new face)
   - Duration: 150ms
   - Easing: Sine.easeOut
   - Swap sprites at transition point

**Implementation**:
```javascript
flip(faceUp, duration = 300) {
    if (this.isFlipping) return; // Prevent double-flip
    this.isFlipping = true;

    const halfDuration = duration / 2;

    // Phase 1: Shrink to center (hide current face)
    this.scene.tweens.add({
        targets: this,
        scaleX: 0,
        duration: halfDuration,
        ease: 'Sine.easeIn',
        onComplete: () => {
            // Swap visibility at midpoint
            this.backSprite.setVisible(!faceUp);
            this.frontSprite.setVisible(faceUp);

            // Phase 2: Expand from center (show new face)
            this.scene.tweens.add({
                targets: this,
                scaleX: 1,
                duration: halfDuration,
                ease: 'Sine.easeOut',
                onComplete: () => {
                    this.flipped = faceUp;
                    this.isFlipping = false;
                    this.emit('flipComplete', this);
                }
            });
        }
    });

    // Play flip sound
    this.scene.sound.play('card-flip');
}
```

**Why This Technique?**
- Simulates 3D rotation without 3D rendering
- Smooth and performant
- Works on all devices
- Looks professional and satisfying
- Simple to implement in Phaser 2D

### 3. Create Card Front Design
**Visual Elements**:
- Same rounded rectangle as back (100x140)
- White or light background (#ffffff or #ecf0f1)
- Border matching card back style
- Large letter in center (bold, 64px)
- Optional: Small image/icon related to letter
- Clear and readable design

**Letter Display**:
```javascript
createFrontSprite() {
    // Background
    const frontGraphics = this.scene.add.graphics();
    frontGraphics.fillStyle(0xffffff, 1);
    frontGraphics.fillRoundedRect(-50, -70, 100, 140, 10);
    frontGraphics.lineStyle(4, 0x2980b9, 1);
    frontGraphics.strokeRoundedRect(-50, -70, 100, 140, 10);

    // Generate texture
    frontGraphics.generateTexture('card-front-bg', 100, 140);
    frontGraphics.destroy();

    // Create front sprite
    this.frontSprite = this.scene.add.sprite(0, 0, 'card-front-bg');
    this.frontSprite.setVisible(false); // Start hidden

    // Add letter text
    this.letterText = this.scene.add.text(0, 0, this.cardData.letter, {
        fontSize: '64px',
        fontFamily: 'Arial, sans-serif',
        color: '#2c3e50',
        fontStyle: 'bold'
    }).setOrigin(0.5);
    this.letterText.setVisible(false); // Start hidden

    this.add([this.frontSprite, this.letterText]);
}
```

### 4. Enforce Two-Card Selection Limit
**Game Rule**: Only 2 cards can be face-up at once

**Implementation**:
- Track flipped cards in array: `this.flippedCards = []`
- When card clicked:
  - Check if 2 cards already flipped
  - If yes, ignore click (or flash feedback)
  - If no, allow flip
- After 2 cards flipped:
  - Disable further clicks (`this.canFlip = false`)
  - Wait for match logic (Phase 35)
- After match check:
  - Re-enable clicks or flip cards back

**Click Handler Update**:
```javascript
onCardClick(card) {
    // Validation
    if (!this.canFlip) return;
    if (card.flipped) return;
    if (card.matched) return;
    if (this.flippedCards.length >= 2) return;

    // Flip card
    card.flip(true);

    // Track flipped card
    this.flippedCards.push(card);

    // Check if 2 cards flipped
    if (this.flippedCards.length === 2) {
        this.canFlip = false; // Disable further clicks
        // Phase 35 will add match logic here
        console.log('Two cards flipped - match check coming in Phase 35');

        // Placeholder: Auto-flip back after 1 second
        this.time.delayedCall(1000, () => {
            this.flippedCards[0].flip(false);
            this.flippedCards[1].flip(false);
            this.flippedCards = [];
            this.canFlip = true;
        });
    }
}
```

### 5. Add Sound Effects
**Sounds Needed**:
- **card-flip.mp3**: Quick swoosh sound when card flips
- **card-select.mp3**: Subtle click when card is clicked

**Integration**:
- Play flip sound at start of flip animation
- Sound should be short (100-200ms)
- Volume should be moderate (not jarring)
- Use AudioManager from Phase 16

**Preload**:
```javascript
preload() {
    this.load.audio('card-flip', 'assets/audio/card-flip.mp3');
    this.load.audio('card-select', 'assets/audio/card-select.mp3');
}
```

**Play**:
```javascript
// In flip() method
this.scene.sound.play('card-flip', { volume: 0.4 });

// In click handler
this.scene.sound.play('card-select', { volume: 0.3 });
```

### 6. Update Scene to Use Card Class
**Refactor**: Replace simple sprites with Card objects

**Changes in MemoryMatchScene**:
```javascript
createCardGrid() {
    const config = this.gridConfig;
    const totalWidth = (config.cols * config.cardWidth) +
                      ((config.cols - 1) * config.paddingX);
    const startX = (800 - totalWidth) / 2 + (config.cardWidth / 2);
    const startY = 150;

    let cardIndex = 0;
    for (let row = 0; row < config.rows; row++) {
        for (let col = 0; col < config.cols; col++) {
            const x = startX + col * (config.cardWidth + config.paddingX);
            const y = startY + row * (config.cardHeight + config.paddingY);

            // Create Card instance (not simple sprite)
            const card = new Card(
                this,
                x,
                y,
                this.cardData[cardIndex],
                cardIndex
            );

            // Set up click handler
            card.on('pointerdown', () => {
                this.onCardClick(card);
            });

            this.cards.push(card);
            cardIndex++;
        }
    }
}
```

### 7. Add Visual Feedback During Flip
**Enhancements**:
- Slight shadow or glow during flip
- Particle sparkle when card fully flips
- Subtle bounce effect after flip completes

**Bounce Effect**:
```javascript
// After flip completes
this.scene.tweens.add({
    targets: this,
    scaleY: 1.1,
    duration: 100,
    yoyo: true,
    ease: 'Sine.easeInOut'
});
```

**Sparkle Particles**:
```javascript
// In flip onComplete
if (faceUp) {
    this.scene.triggerSparkle(this.x, this.y);
}

// In scene
triggerSparkle(x, y) {
    if (this.particleEmitter) {
        this.particleEmitter.setPosition(x, y);
        this.particleEmitter.explode(5); // Small burst
    }
}
```

## Implementation Details

### Card.js Full Implementation
```javascript
// src/objects/Card.js

export default class Card extends Phaser.GameObjects.Container {
    constructor(scene, x, y, cardData, index) {
        super(scene, x, y);

        this.scene = scene;
        this.cardData = cardData; // { letter, type, id }
        this.index = index;
        this.flipped = false;
        this.matched = false;
        this.isFlipping = false;

        this.createCardSprites();
        this.setupInteraction();

        scene.add.existing(this);
        this.setSize(100, 140);
        this.setDepth(10);
    }

    createCardSprites() {
        // Create back sprite
        this.backSprite = this.scene.add.sprite(0, 0, 'card-back');
        this.backSprite.setOrigin(0.5);

        // Create front background
        this.createFrontBackground();

        // Create front sprite
        this.frontSprite = this.scene.add.sprite(0, 0, 'card-front-bg');
        this.frontSprite.setOrigin(0.5);
        this.frontSprite.setVisible(false);

        // Create letter text
        this.letterText = this.scene.add.text(0, 0, this.cardData.letter.toUpperCase(), {
            fontSize: '64px',
            fontFamily: 'Arial, sans-serif',
            color: '#2c3e50',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        this.letterText.setVisible(false);

        // Add to container
        this.add([this.backSprite, this.frontSprite, this.letterText]);
    }

    createFrontBackground() {
        // Only create texture once (check if exists)
        if (this.scene.textures.exists('card-front-bg')) {
            return;
        }

        const graphics = this.scene.add.graphics();

        // White background
        graphics.fillStyle(0xffffff, 1);
        graphics.fillRoundedRect(0, 0, 100, 140, 10);

        // Blue border
        graphics.lineStyle(4, 0x2980b9, 1);
        graphics.strokeRoundedRect(0, 0, 100, 140, 10);

        // Generate texture
        graphics.generateTexture('card-front-bg', 100, 140);
        graphics.destroy();
    }

    setupInteraction() {
        this.setInteractive(
            new Phaser.Geom.Rectangle(-50, -70, 100, 140),
            Phaser.Geom.Rectangle.Contains
        );

        this.input.cursor = 'pointer';

        // Hover effects
        this.on('pointerover', () => {
            if (!this.flipped && !this.matched && !this.isFlipping) {
                this.scene.tweens.add({
                    targets: this,
                    scale: 1.05,
                    duration: 100,
                    ease: 'Sine.easeOut'
                });
            }
        });

        this.on('pointerout', () => {
            if (!this.matched) {
                this.scene.tweens.add({
                    targets: this,
                    scale: 1.0,
                    duration: 100,
                    ease: 'Sine.easeIn'
                });
            }
        });
    }

    flip(faceUp, duration = 300) {
        if (this.isFlipping) return;
        if (this.matched) return;

        this.isFlipping = true;
        const halfDuration = duration / 2;

        // Play flip sound
        this.scene.sound.play('card-flip', { volume: 0.4 });

        // Phase 1: Shrink to center
        this.scene.tweens.add({
            targets: this,
            scaleX: 0,
            duration: halfDuration,
            ease: 'Sine.easeIn',
            onComplete: () => {
                // Swap faces at midpoint
                this.backSprite.setVisible(!faceUp);
                this.frontSprite.setVisible(faceUp);
                this.letterText.setVisible(faceUp);

                // Phase 2: Expand from center
                this.scene.tweens.add({
                    targets: this,
                    scaleX: 1,
                    duration: halfDuration,
                    ease: 'Sine.easeOut',
                    onComplete: () => {
                        this.flipped = faceUp;
                        this.isFlipping = false;

                        // Subtle bounce
                        if (faceUp) {
                            this.scene.tweens.add({
                                targets: this,
                                scaleY: 1.05,
                                duration: 100,
                                yoyo: true,
                                ease: 'Sine.easeInOut'
                            });
                        }

                        this.emit('flipComplete', this);
                    }
                });
            }
        });
    }

    setMatched() {
        this.matched = true;
        this.disableInteractive();

        // Visual feedback (subtle fade or glow)
        this.scene.tweens.add({
            targets: this,
            alpha: 0.7,
            duration: 300,
            ease: 'Sine.easeOut'
        });
    }

    reset() {
        this.flipped = false;
        this.matched = false;
        this.isFlipping = false;
        this.setInteractive();
        this.setAlpha(1);
        this.setScale(1);
        this.backSprite.setVisible(true);
        this.frontSprite.setVisible(false);
        this.letterText.setVisible(false);
    }
}
```

### Updated MemoryMatchScene Integration
```javascript
// In MemoryMatchScene.js

import Card from '../objects/Card.js';

// ... existing code ...

createCardGrid() {
    const config = this.gridConfig;
    const totalWidth = (config.cols * config.cardWidth) +
                      ((config.cols - 1) * config.paddingX);
    const startX = (800 - totalWidth) / 2 + (config.cardWidth / 2);
    const startY = 150;

    this.flippedCards = [];

    let cardIndex = 0;
    for (let row = 0; row < config.rows; row++) {
        for (let col = 0; col < config.cols; col++) {
            const x = startX + col * (config.cardWidth + config.paddingX);
            const y = startY + row * (config.cardHeight + config.paddingY);

            const card = new Card(this, x, y, this.cardData[cardIndex], cardIndex);

            card.on('pointerdown', () => {
                this.onCardClick(card);
            });

            this.cards.push(card);
            cardIndex++;
        }
    }

    console.log('[MemoryMatchScene] Created', this.cards.length, 'Card objects');
}

onCardClick(card) {
    // Validation
    if (!this.canFlip) {
        console.log('[MemoryMatchScene] Cannot flip - waiting for match check');
        return;
    }

    if (card.flipped) {
        console.log('[MemoryMatchScene] Card already flipped');
        return;
    }

    if (card.matched) {
        console.log('[MemoryMatchScene] Card already matched');
        return;
    }

    if (this.flippedCards.length >= 2) {
        console.log('[MemoryMatchScene] Two cards already flipped');
        return;
    }

    // Play select sound
    this.sound.play('card-select', { volume: 0.3 });

    // Flip card face up
    card.flip(true);

    // Track flipped card
    this.flippedCards.push(card);

    console.log('[MemoryMatchScene] Flipped card:', card.index, card.cardData.letter);
    console.log('[MemoryMatchScene] Flipped cards count:', this.flippedCards.length);

    // Check if 2 cards are flipped
    if (this.flippedCards.length === 2) {
        this.canFlip = false;
        console.log('[MemoryMatchScene] Two cards flipped - checking match (Phase 35)');

        // Placeholder: Auto-flip back after 1 second
        // Phase 35 will replace this with actual match logic
        this.time.delayedCall(1000, () => {
            console.log('[MemoryMatchScene] Flipping cards back (placeholder)');
            this.flippedCards[0].flip(false);
            this.flippedCards[1].flip(false);
            this.flippedCards = [];
            this.canFlip = true;
        });
    }
}
```

## Acceptance Criteria
- [ ] Card.js class created in src/objects/
- [ ] Card extends Phaser.GameObjects.Container
- [ ] Card contains back and front sprites
- [ ] Card stores letter data and state
- [ ] flip() method implemented with 3D effect
- [ ] Flip animation uses scaleX for rotation
- [ ] Animation is two-phase (shrink then expand)
- [ ] Duration is 300ms total (150ms each phase)
- [ ] Sprites swap visibility at midpoint
- [ ] Card front shows white background
- [ ] Letter displays in center (64px, bold)
- [ ] Letter is uppercase and readable
- [ ] Hover effect works (scale 1.05)
- [ ] Hover disabled during flip
- [ ] Hover disabled on matched cards
- [ ] Click triggers flip animation
- [ ] Flip sound plays on animation start
- [ ] Select sound plays on click
- [ ] Only 2 cards can be flipped at once
- [ ] Third card click is ignored
- [ ] flippedCards array tracks selections
- [ ] canFlip flag prevents rapid clicking
- [ ] After 2 cards flipped, input disabled
- [ ] Placeholder: Cards flip back after 1 second
- [ ] Cards return to face-down state
- [ ] flippedCards array clears after flip back
- [ ] canFlip re-enabled after flip back
- [ ] Subtle bounce effect on flip complete
- [ ] MemoryMatchScene uses Card class
- [ ] All 12 cards are Card instances
- [ ] Scene properly tracks card states
- [ ] No console errors during flips
- [ ] Smooth 60fps during animations

## Testing Steps
1. Start MemoryMatchScene
   - Verify 12 cards display face-down
2. Click first card
   - Verify flip animation plays
   - Verify card shrinks then expands
   - Verify letter appears on white background
   - Verify flip sound plays
   - Verify select sound plays
3. Observe flip animation
   - Time animation (should be ~300ms)
   - Verify smooth motion
   - Verify no stuttering
4. Test hover during flip
   - Hover over flipping card
   - Verify no scale effect during flip
5. Click second card
   - Verify flip animation plays
   - Verify letter appears
   - Verify sound plays
6. After 2 cards flipped
   - Try clicking third card
   - Verify click is ignored
   - Verify no flip occurs
7. Wait 1 second (placeholder delay)
   - Verify both cards flip back
   - Verify cards return face-down
   - Verify smooth flip-back animation
8. After flip-back
   - Try clicking card again
   - Verify click works (input re-enabled)
9. Test rapid clicking
   - Click card multiple times quickly
   - Verify only flips once
   - Verify isFlipping prevents double-flip
10. Test all card pairs
    - Flip each card at least once
    - Verify all letters display correctly
    - Verify all cards flip smoothly
11. Test edge cases
    - Click same card twice
    - Click matched card (none yet, but test in Phase 35)
    - Rapid mouse movement during flips
12. Performance check
    - Verify 60fps maintained
    - Check for memory leaks
    - Test on slower device if possible

## Estimated Time
1.5 hours

## Dependencies
- Phase 33 (MemoryMatchScene with card grid)
- Phaser tweens system
- Phaser containers
- AudioManager (Phase 16)
- Sound files: card-flip.mp3, card-select.mp3

## Risks
- **Animation performance**: Multiple simultaneous flips might lag
  - Mitigation: Only allow 2 flips at once, optimize tweens
- **Flip timing feels wrong**: Too fast or too slow
  - Mitigation: Test different durations, 300ms is standard
- **Letter visibility during flip**: Letter visible during rotation
  - Mitigation: Swap sprites at scaleX = 0 (midpoint)
- **Sound overlapping**: Multiple flip sounds at once
  - Mitigation: Keep sounds short, limit simultaneous flips to 2
- **Click spamming**: Players rapidly click causing issues
  - Mitigation: isFlipping flag, canFlip flag, validation checks
- **Container depth issues**: Cards overlap incorrectly
  - Mitigation: Set proper depth values, test z-ordering

## ADHD-Friendly Design Considerations
- **Immediate feedback**: Flip starts instantly on click
- **Satisfying animation**: Smooth 3D effect is rewarding
- **Audio feedback**: Sounds reinforce actions
- **Clear visuals**: Letter is large and easy to read
- **Two-card limit**: Prevents overwhelming choices
- **Not too fast**: 300ms animation is comfortable to watch
- **Not too slow**: Animation doesn't drag or bore
- **Subtle effects**: Bounce and sparkle add polish without distraction
- **Clear states**: Easy to see flipped vs face-down cards

## Notes
- 3D flip effect uses 2D scaleX (pseudo-3D)
- True 3D rotation would require WebGL or complex shaders
- This technique is standard in card games
- 300ms flip duration is industry standard
- Two-card limit is core memory game mechanic
- Phase 35 will add actual match detection
- Phase 36 will enhance with more polish and content
- Consider adding "flip all" cheat code for testing

## Completion Checklist
- [ ] Card.js class created and fully implemented
- [ ] Flip animation working smoothly
- [ ] 3D rotation effect looks professional
- [ ] Letter reveals correctly on card face
- [ ] Sound effects integrated and playing
- [ ] Two-card selection limit enforced
- [ ] Hover effects working correctly
- [ ] Validation prevents invalid flips
- [ ] Placeholder flip-back after 1 second
- [ ] MemoryMatchScene uses Card objects
- [ ] All acceptance criteria met
- [ ] Tested all cards and animations
- [ ] No console errors or warnings
- [ ] Smooth 60fps performance
- [ ] Ready to proceed to Phase 35

## What's Next (Phase 35)
- Implement match detection logic
- Compare two flipped cards
- Keep matched cards revealed
- Flip unmatched cards back
- Track match count
- Detect round completion (all 6 pairs matched)
