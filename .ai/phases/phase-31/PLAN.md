# Phase 31: Letter Builder - Snap and Complete Logic

## Goal
Implement magnetic snap zones for letter pieces, detect letter completion, trigger celebration, and progress through 5-letter rounds

## Context
Phase 31 transforms Letter Builder from a drag toy into a complete educational game. After Phase 30 enabled dragging pieces, this phase adds the game mechanics: pieces snap into correct positions, completion is detected, celebrations reward success, and the game progresses through multiple letters.

**Core Mechanics:**
- **Snap zones**: Invisible target areas where pieces snap when close enough
- **Magnetic effect**: Pieces "pull" toward correct position within threshold
- **Completion detection**: Game knows when all pieces are correctly placed
- **Celebration**: Visual and audio reward for completing a letter
- **Progression**: Automatically load next letter, track progress (1/5, 2/5, etc.)

This phase completes the core gameplay loop, making Letter Builder a functional educational mini-game.

## Prerequisites
- Phase 29-30 completed
- LetterBuilderScene setup functional
- LetterPiece class with dragging working
- Letter pieces return to start when released
- Stroke data defined for multiple letters

## Tasks

### 1. Define Snap Zone Data Structure
- Create snap zone data for each letter stroke
- Snap zone position matches where piece belongs in final letter
- Snap zone size slightly larger than piece (forgiveness area)
- Store snap zones with stroke data or generate from outline
- Example: Letter "A" has 3 snap zones (left diagonal, right diagonal, bar)
- Include snap threshold (distance for magnetic pull)

### 2. Create Snap Zone Visual Indicators (Optional)
- Display subtle snap zone outlines or highlights
- Zones should be visible but not distracting
- Use dashed lines or faint color (30% alpha)
- Show zones only when piece is dragged nearby (proximity highlight)
- Or hide zones entirely for cleaner look (invisible snapping)

### 3. Implement Snap Zone Detection
- Add method `checkSnapZones(piece)` to LetterBuilderScene
- Called during drag and on drag end
- Calculate distance from piece center to each snap zone center
- If distance < snapThreshold (e.g., 50-80px), trigger snap
- Return closest valid snap zone
- Prevent multiple pieces snapping to same zone

### 4. Implement Magnetic Snap Animation
- When piece is within snap threshold, trigger snap
- Animate piece to exact snap zone position
- Use smooth easing (Back.easeOut or Elastic.easeOut)
- Duration: 300-400ms for satisfying "click" feel
- Disable piece dragging once snapped
- Play satisfying snap sound effect
- Add visual feedback (glow, particles, scale pulse)

### 5. Lock Snapped Pieces
- Once piece snaps, set `piece.isSnapped = true`
- Disable interactive input on snapped piece
- Prevent piece from being dragged again
- Optionally change piece appearance (full opacity, different color)
- Store snap zone reference in piece
- Update scene state (track which pieces are snapped)

### 6. Implement Completion Detection
- Add method `checkLetterComplete()` to LetterBuilderScene
- Called after each piece snap
- Check if all pieces are snapped (`letterPieces.every(p => p.isSnapped)`)
- If complete, trigger celebration sequence
- Disable interaction during celebration
- Prepare to load next letter

### 7. Create Celebration Sequence
- Play celebration sound effect (cheerful chime, success jingle)
- Play congratulatory audio: "Great job! You built the letter A!"
- Particle explosion from letter center (stars, confetti)
- Flash or pulse the completed letter
- Show "Success!" or star graphic
- Display score/reward (+50 points, +1 star)
- Duration: 2-3 seconds total
- Automatically transition to next letter

### 8. Implement Letter Progression
- Track currentLetterIndex (1/5, 2/5, etc.)
- After celebration, call `loadNextLetter()`
- Clear previous pieces and snap zones
- Generate new letter outline and pieces
- Update progress indicator
- Reset scene state for new letter
- After 5 letters, show round complete screen

### 9. Handle Round Completion
- After 5th letter completed, show "Round Complete!" screen
- Display total score, stars earned, letters completed
- Play extended celebration (longer music, more particles)
- Show "Play Again" and "Back to Menu" buttons
- Option to replay same letters or generate new round
- Track and display best score (optional)

### 10. Add Visual Feedback for Proximity
- When piece is near (but not in) snap zone, show feedback
- Snap zone highlights or glows
- Piece might pulse or vibrate slightly
- Help user understand "you're close!"
- ADHD-friendly: clear indication of correct placement
- Not too distracting (subtle effect)

### 11. Implement Snap Forgiveness
- Snap threshold generous (50-80px radius)
- Pieces snap to nearest zone if within threshold
- If piece over multiple zones, choose closest
- Don't require pixel-perfect placement
- ADHD-friendly: success-oriented design
- Balance challenge and accessibility

### 12. Test with All Letters
- Verify snap zones correctly positioned for each letter
- Test simple letters (I, L, T)
- Test medium letters (A, H, E)
- Test complex letters (M, W)
- Ensure completion detection works for all
- Verify celebration triggers correctly
- Test full 5-letter round progression

## Implementation Details

### Snap Zone Data Structure
```javascript
// Add to LETTER_STROKES data or generate dynamically
const LETTER_SNAP_ZONES = {
    'A': [
        {
            id: 'A_left_zone',
            pieceId: 'A_left',
            x: 360,  // Position in final letter (relative to outline)
            y: 250,
            radius: 60,  // Snap threshold
            occupied: false
        },
        {
            id: 'A_right_zone',
            pieceId: 'A_right',
            x: 440,
            y: 250,
            radius: 60,
            occupied: false
        },
        {
            id: 'A_bar_zone',
            pieceId: 'A_bar',
            x: 400,
            y: 250,
            radius: 60,
            occupied: false
        }
    ]
    // ... other letters
};
```

### Snap Detection Logic
```javascript
class LetterBuilderScene extends Phaser.Scene {
    checkSnapZones(piece) {
        let closestZone = null;
        let minDistance = Infinity;

        // Get snap zones for current letter
        const zones = LETTER_SNAP_ZONES[this.currentLetter.letter];

        zones.forEach(zone => {
            // Skip if zone already occupied
            if (zone.occupied) return;

            // Only check zone for this specific piece
            if (zone.pieceId !== piece.strokeData.id) return;

            // Calculate distance
            const distance = Phaser.Math.Distance.Between(
                piece.x,
                piece.y,
                zone.x,
                zone.y
            );

            // Within threshold and closest so far?
            if (distance < zone.radius && distance < minDistance) {
                closestZone = zone;
                minDistance = distance;
            }
        });

        return closestZone;
    }

    snapPieceToZone(piece, zone) {
        // Mark zone as occupied
        zone.occupied = true;

        // Animate piece to zone center
        this.tweens.add({
            targets: piece,
            x: zone.x,
            y: zone.y,
            scale: 1.0,
            duration: 350,
            ease: 'Back.easeOut',
            onComplete: () => {
                // Lock piece
                piece.snapToZone(zone);

                // Visual feedback
                this.createSnapParticles(zone.x, zone.y);

                // Check if letter complete
                this.checkLetterComplete();
            }
        });

        // Play snap sound
        this.sound.play('snapSound', { volume: 0.5 });

        // Visual pulse
        this.tweens.add({
            targets: piece,
            scale: 1.15,
            duration: 100,
            yoyo: true,
            ease: 'Power2'
        });
    }
}
```

### Update LetterPiece onDragEnd
```javascript
class LetterPiece extends Phaser.GameObjects.Container {
    onDragEnd(pointer) {
        this.isDragging = false;

        // Check if near a snap zone (Phase 31)
        const snapZone = this.scene.checkSnapZones(this);

        if (snapZone) {
            // Snap to zone
            this.scene.snapPieceToZone(this, snapZone);
        } else {
            // Return to start (Phase 30 behavior)
            this.returnToStart();
        }

        // Remove trail
        this.destroyTrail();

        // Reset appearance (if not snapped)
        if (!snapZone) {
            this.scene.tweens.add({
                targets: this,
                scale: 1.0,
                duration: 200,
                ease: 'Power2'
            });

            this.list[0].lineStyle(10, 0x000000, 1);
            this.scene.sound.play('releaseSound', { volume: 0.3 });
        }
    }

    snapToZone(zone) {
        this.isSnapped = true;
        this.snapZone = zone;
        this.disableInteractive();

        // Change appearance to show locked state
        this.list[0].lineStyle(10, 0x000000, 1);  // Solid black
        this.setAlpha(1.0);  // Full opacity
    }
}
```

### Completion Detection and Celebration
```javascript
class LetterBuilderScene extends Phaser.Scene {
    checkLetterComplete() {
        // Check if all pieces are snapped
        const allSnapped = this.letterPieces.every(piece => piece.isSnapped);

        if (allSnapped) {
            this.celebrateCompletion();
        }
    }

    celebrateCompletion() {
        // Disable further interaction
        this.input.enabled = false;

        // Play success sound
        this.sound.play('successSound', { volume: 0.6 });

        // Play congratulatory audio
        const audioKey = `congrats_${this.currentLetter.letter}`;
        this.sound.play(audioKey);

        // Particle explosion
        this.createCelebrationParticles(400, 250);

        // Flash completed letter
        this.tweens.add({
            targets: this.letterOutline,
            alpha: 0.5,
            duration: 200,
            yoyo: true,
            repeat: 3
        });

        // Show success graphic
        const successText = this.add.text(400, 450, '★ Success! ★', {
            fontSize: '48px',
            fontFamily: 'Arial, sans-serif',
            color: '#FFD700',
            stroke: '#000000',
            strokeThickness: 6
        }).setOrigin(0.5);

        successText.setScale(0);
        this.tweens.add({
            targets: successText,
            scale: 1.2,
            duration: 400,
            ease: 'Back.easeOut'
        });

        // Update score
        this.score += 50;

        // Wait, then load next letter
        this.time.delayedCall(2500, () => {
            successText.destroy();
            this.loadNextLetter();
        });
    }

    createCelebrationParticles(x, y) {
        const particles = this.add.particles(x, y, 'particle', {
            speed: { min: 200, max: 500 },
            angle: { min: 0, max: 360 },
            scale: { start: 1.0, end: 0 },
            alpha: { start: 1, end: 0 },
            tint: [0xFFD700, 0xFFFFFF, 0xFFA500, 0xFF69B4],
            lifespan: 1500,
            gravityY: 400,
            quantity: 40,
            blendMode: 'ADD'
        });

        particles.explode();

        this.time.delayedCall(2000, () => {
            particles.destroy();
        });
    }
}
```

### Load Next Letter with State Reset
```javascript
class LetterBuilderScene extends Phaser.Scene {
    loadNextLetter() {
        // Check if round complete (5 letters)
        if (this.currentLetterIndex >= this.totalLetters) {
            this.showRoundComplete();
            return;
        }

        // Re-enable input
        this.input.enabled = true;

        // Clear previous pieces
        this.letterPieces.forEach(piece => piece.destroy());
        this.letterPieces = [];

        // Get new letter
        const letterData = window.contentProvider.getRandomLetter();
        this.currentLetter = letterData;
        this.currentLetterIndex++;

        // Update progress
        this.progressText.setText(`${this.currentLetterIndex}/${this.totalLetters}`);

        // Update instruction
        this.instructionText.setText(`Build the letter ${this.currentLetter.letter}`);

        // Update outline
        this.letterOutline.setText(this.currentLetter.letter);

        // Animate outline
        this.letterOutline.setScale(0);
        this.tweens.add({
            targets: this.letterOutline,
            scale: 1,
            duration: 500,
            ease: 'Back.easeOut',
            delay: 300
        });

        // Generate new pieces
        this.time.delayedCall(400, () => {
            this.generateLetterPieces();
        });

        // Reset snap zones
        const zones = LETTER_SNAP_ZONES[this.currentLetter.letter];
        zones.forEach(zone => zone.occupied = false);
    }

    showRoundComplete() {
        // Clear pieces
        this.letterPieces.forEach(piece => piece.destroy());
        this.letterPieces = [];

        // Show completion screen
        const completeText = this.add.text(400, 200, 'Round Complete!', {
            fontSize: '64px',
            fontFamily: 'Arial, sans-serif',
            color: '#FFD700',
            stroke: '#000000',
            strokeThickness: 8,
            fontStyle: 'bold'
        }).setOrigin(0.5);

        const scoreText = this.add.text(400, 300, `Score: ${this.score}`, {
            fontSize: '48px',
            fontFamily: 'Arial, sans-serif',
            color: '#ffffff',
            stroke: '#8B4513',
            strokeThickness: 4
        }).setOrigin(0.5);

        // Play Again button
        const playButton = this.add.rectangle(400, 420, 200, 60, 0x4CAF50);
        playButton.setStrokeStyle(4, 0xFFFFFF);
        const playText = this.add.text(400, 420, 'Play Again', {
            fontSize: '28px',
            color: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        playButton.setInteractive({ useHandCursor: true });
        playButton.on('pointerdown', () => {
            this.scene.restart();
        });

        // Back to Menu button
        const menuButton = this.add.rectangle(400, 500, 200, 60, 0x8B4513);
        menuButton.setStrokeStyle(4, 0xFFFFFF);
        const menuText = this.add.text(400, 500, 'Back to Menu', {
            fontSize: '28px',
            color: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        menuButton.setInteractive({ useHandCursor: true });
        menuButton.on('pointerdown', () => {
            this.scene.start('MainMenuScene');
        });
    }
}
```

## Acceptance Criteria
- [ ] Snap zones defined for all letters with stroke data
- [ ] Snap detection works (pieces snap when within threshold)
- [ ] Snap threshold is generous (50-80px radius)
- [ ] Magnetic snap animation is smooth (300-400ms)
- [ ] Snap animation uses satisfying easing (Back.easeOut)
- [ ] Snap sound effect plays when piece snaps
- [ ] Visual feedback on snap (particles, pulse, glow)
- [ ] Snapped pieces are locked (can't drag again)
- [ ] Snapped pieces visually indicate locked state
- [ ] Only correct piece can snap to each zone
- [ ] Multiple pieces can't snap to same zone
- [ ] Completion detected when all pieces snapped
- [ ] Celebration sequence triggers on completion
- [ ] Celebration includes sound, particles, text
- [ ] Celebration lasts 2-3 seconds
- [ ] Score updates on completion (+50 points)
- [ ] Next letter loads automatically after celebration
- [ ] Progress indicator updates (1/5, 2/5, etc.)
- [ ] Round completes after 5 letters
- [ ] Round complete screen displays with score
- [ ] "Play Again" button restarts game
- [ ] "Back to Menu" button returns to menu
- [ ] Snap zones reset between letters
- [ ] Tested with 5-letter round successfully
- [ ] No console errors during any phase of gameplay

## Testing Steps
1. Load Letter Builder and start first letter
2. Drag piece close to correct snap zone (within 80px)
3. Verify snap detection triggers
4. Verify piece animates to snap position smoothly
5. Verify snap sound plays
6. Verify piece is locked (can't drag again)
7. Snap remaining pieces for letter
8. Verify completion detection triggers
9. Verify celebration sequence plays
10. Verify next letter loads automatically
11. Complete all 5 letters
12. Verify round complete screen appears
13. Test "Play Again" button
14. Test "Back to Menu" button

## Estimated Time
1.5 hours

## Dependencies
- Phase 29-30 completed
- Stroke data with snap zone information
- Audio assets (snap, success, congratulations)
- Particle textures

## Risks
- **Snap threshold tuning**: Too loose or tight
  - Mitigation: Test with Aurora, adjust based on feedback
- **Performance**: Snap detection every frame might lag
  - Mitigation: Only check on dragend, not during drag
- **Zone overlap**: Multiple zones too close together
  - Mitigation: Design clear separation in stroke data

## Notes
- Snap detection only on dragend (not continuous) for performance
- Generous snap threshold for ADHD-friendly success
- Celebration should feel rewarding, not rushed
- 5 letters per round is good pacing (not too long)

## Completion Checklist
- [ ] Snap zones implemented for all letters
- [ ] Snap detection and animation working
- [ ] Pieces lock when snapped
- [ ] Completion detection triggers celebration
- [ ] Celebration sequence polished
- [ ] Letter progression works (5 letters)
- [ ] Round complete screen implemented
- [ ] All acceptance criteria met
- [ ] Tested full 5-letter round
- [ ] No console errors
- [ ] Ready for Phase 32 (polish)
