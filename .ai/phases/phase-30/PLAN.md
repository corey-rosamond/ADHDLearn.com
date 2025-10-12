# Phase 30: Letter Builder - Draggable Pieces

## Goal
Implement draggable letter stroke pieces that children can manipulate to build letters, including drag physics, visual feedback, and trail effects

## Context
Phase 30 is the core interaction layer of Letter Builder. After Phase 29 established the scene and UI, this phase creates the actual puzzle pieces - the strokes that compose each letter. Children will drag these 2-4 pieces from the pieces area to build the target letter.

**Key Educational Goals:**
- **Letter decomposition**: Understanding that letters are made of component strokes
- **Fine motor skills**: Precise dragging and positioning
- **Spatial reasoning**: How pieces fit together
- **Hand-eye coordination**: Targeting and placement

**ADHD-Friendly Design:**
- Large, easy-to-grab pieces (80-120px minimum)
- Immediate drag response (< 50ms latency)
- Visual trail effect provides satisfying feedback
- Pieces can't be lost (always retrievable)
- No time pressure (work at own pace)

This phase focuses on the drag mechanics and piece generation. Phase 31 will add snapping/completion logic.

## Prerequisites
- Phase 29 completed (LetterBuilderScene setup)
- Letter outline displays correctly
- ContentProvider has letter data
- Pieces area designated at bottom of screen
- Scene state management initialized

## Tasks

### 1. Create LetterPiece.js Class
- Create new class: `LetterPiece` extending Phaser.GameObjects.Container
- Store piece data: id, strokePath, originalPosition, snapZone
- Create visual representation (stroke rendering)
- Add interactive capabilities (drag, drop)
- Implement getters/setters for piece state
- Add method to reset piece position
- Add method to lock piece (when placed correctly)

### 2. Design Letter Stroke Decomposition Data
- Define stroke decomposition for all 26 letters
- Each letter has 2-4 strokes (pieces)
- Store stroke data as paths or shape descriptors
- Example: "A" = [left diagonal, right diagonal, horizontal bar]
- Example: "E" = [vertical line, top horizontal, middle horizontal, bottom horizontal]
- Store data in ContentProvider or separate LetterStrokeData.js
- Include stroke width, color, start/end points
- Consider difficulty: simpler letters (L, T) vs complex letters (M, W)

### 3. Generate Letter Pieces from Stroke Data
- Implement `generateLetterPieces()` method in LetterBuilderScene
- Read stroke data for current letter
- Create LetterPiece instance for each stroke
- Render each piece visually (Graphics API or sprites)
- Position pieces in pieces area (bottom of screen)
- Distribute pieces evenly (spacing between pieces)
- Add slight randomization to positions for variety
- Store piece references in `this.letterPieces` array

### 4. Implement Drag and Drop Mechanics
- Enable interactive input on each piece
- Use Phaser input.setDraggable(true)
- Implement drag start handler (pointerdown)
- Implement drag move handler (pointermove)
- Implement drag end handler (pointerup)
- Bring dragged piece to front (z-index)
- Track drag state for each piece
- Handle multi-touch (one piece at a time)

### 5. Add Drag Start Feedback
- Scale up piece on drag start (1.0 to 1.1)
- Play subtle sound effect (optional: "pick up" sound)
- Brighten piece color (highlight effect)
- Add glow or outline to piece
- Cursor changes to grabbing hand
- Piece lifts visually (shadow or depth effect)
- Animate transition smoothly (< 200ms)

### 6. Implement Drag Trail Effect
- Create particle emitter or trail graphics for each piece
- Trail follows piece as it's dragged
- Use subtle color (white or piece color with low alpha)
- Trail fades over 300-500ms
- Trail particles are small (4-8px)
- Emission rate: 50-100 particles per second
- Trail should feel smooth and satisfying
- Optimize for performance (limit max particles)

### 7. Add Drag End Feedback
- Animate piece return to original position if not snapped (Phase 31)
- Play subtle sound effect ("release" or "place")
- Reset scale to 1.0
- Remove highlight/glow effect
- Transition smoothly (200-300ms)
- Stop trail effect immediately
- Cursor returns to normal

### 8. Implement Piece Collision Bounds
- Define draggable area (entire screen or constrained)
- Keep pieces within canvas bounds (can't drag off screen)
- Clamp piece position: 0 < x < 800, 0 < y < 600
- Handle edge cases (piece partially off screen)
- Smooth clamping (no jarring stops)

### 9. Handle Piece Stacking and Overlaps
- When pieces overlap, ensure active piece is on top
- Use Phaser depth property to manage z-order
- Increment depth on drag start
- Don't let pieces get lost behind other elements
- Handle case where multiple pieces are at same position

### 10. Optimize Performance
- Limit active trails (max 1 trail at a time)
- Use object pooling for trail particles
- Avoid creating/destroying objects during drag
- Cache piece graphics (render once, reuse)
- Test on lower-end devices (maintain 60fps)
- Profile drag performance with browser tools

### 11. Add Visual Polish to Pieces
- Each piece has consistent styling
- Stroke width: 8-12px (thick, easy to see)
- Stroke color: dark (black or dark brown)
- Fill color: semi-transparent (50% alpha)
- Add subtle shadow for depth
- Rounded line caps for friendly appearance
- Ensure pieces are visually distinct from outline

### 12. Test with Various Letters
- Test with simple letters: I, L, T (2-3 pieces)
- Test with medium letters: A, H, E (3 pieces)
- Test with complex letters: M, W, K (4 pieces)
- Verify all pieces generate correctly
- Verify pieces are appropriately sized
- Verify pieces don't overlap in starting positions
- Test piece distribution in pieces area

## Implementation Details

### LetterPiece Class Structure
```javascript
class LetterPiece extends Phaser.GameObjects.Container {
    constructor(scene, x, y, strokeData) {
        super(scene, x, y);

        this.scene = scene;
        this.strokeData = strokeData;
        this.originalX = x;
        this.originalY = y;
        this.isDragging = false;
        this.isSnapped = false;
        this.snapZone = null;
        this.trail = null;

        // Create visual representation
        this.createGraphics();

        // Enable dragging
        this.setSize(strokeData.width, strokeData.height);
        this.setInteractive({ draggable: true, useHandCursor: true });

        // Add to scene
        scene.add.existing(this);

        // Set up drag handlers
        this.setupDragHandlers();
    }

    createGraphics() {
        const graphics = this.scene.add.graphics();

        // Draw stroke based on strokeData
        graphics.lineStyle(10, 0x000000, 1);
        graphics.lineCap = 'round';

        // Example: draw line from start to end point
        if (this.strokeData.type === 'line') {
            graphics.beginPath();
            graphics.moveTo(this.strokeData.startX, this.strokeData.startY);
            graphics.lineTo(this.strokeData.endX, this.strokeData.endY);
            graphics.strokePath();
        }

        // Add fill for easier grabbing
        graphics.fillStyle(0x8B4513, 0.3);
        graphics.fillRect(
            this.strokeData.startX - 5,
            this.strokeData.startY - 5,
            this.strokeData.endX - this.strokeData.startX + 10,
            this.strokeData.endY - this.strokeData.startY + 10
        );

        this.add(graphics);
    }

    setupDragHandlers() {
        this.on('dragstart', (pointer) => {
            this.onDragStart(pointer);
        });

        this.on('drag', (pointer, dragX, dragY) => {
            this.onDrag(pointer, dragX, dragY);
        });

        this.on('dragend', (pointer) => {
            this.onDragEnd(pointer);
        });
    }

    onDragStart(pointer) {
        this.isDragging = true;

        // Bring to front
        this.scene.children.bringToTop(this);

        // Scale up
        this.scene.tweens.add({
            targets: this,
            scale: 1.1,
            duration: 150,
            ease: 'Power2'
        });

        // Add glow effect
        this.list[0].lineStyle(10, 0xFFD700, 1); // Gold outline

        // Create trail
        this.createTrail();

        // Play sound
        this.scene.sound.play('pickupSound', { volume: 0.3 });
    }

    onDrag(pointer, dragX, dragY) {
        // Clamp to screen bounds
        const clampedX = Phaser.Math.Clamp(dragX, 50, 750);
        const clampedY = Phaser.Math.Clamp(dragY, 100, 550);

        this.x = clampedX;
        this.y = clampedY;

        // Update trail
        if (this.trail) {
            this.trail.setPosition(this.x, this.y);
        }
    }

    onDragEnd(pointer) {
        this.isDragging = false;

        // Check if snapped (Phase 31 logic)
        // For now, return to original position
        if (!this.isSnapped) {
            this.returnToStart();
        }

        // Remove trail
        this.destroyTrail();

        // Reset scale
        this.scene.tweens.add({
            targets: this,
            scale: 1.0,
            duration: 200,
            ease: 'Power2'
        });

        // Reset stroke style
        this.list[0].lineStyle(10, 0x000000, 1);

        // Play sound
        this.scene.sound.play('releaseSound', { volume: 0.3 });
    }

    createTrail() {
        this.trail = this.scene.add.particles(this.x, this.y, 'particle', {
            speed: { min: 10, max: 50 },
            angle: { min: 0, max: 360 },
            scale: { start: 0.6, end: 0 },
            alpha: { start: 0.8, end: 0 },
            tint: 0xFFFFFF,
            lifespan: 400,
            frequency: 20,
            blendMode: 'ADD'
        });
    }

    destroyTrail() {
        if (this.trail) {
            this.trail.stop();
            this.scene.time.delayedCall(500, () => {
                this.trail.destroy();
                this.trail = null;
            });
        }
    }

    returnToStart() {
        this.scene.tweens.add({
            targets: this,
            x: this.originalX,
            y: this.originalY,
            duration: 300,
            ease: 'Back.easeOut'
        });
    }

    snapToZone(zone) {
        this.isSnapped = true;
        this.snapZone = zone;
        this.disableInteractive();

        // Snap animation (Phase 31)
    }

    reset() {
        this.isSnapped = false;
        this.snapZone = null;
        this.setInteractive({ draggable: true, useHandCursor: true });
        this.returnToStart();
    }
}
```

### Letter Stroke Data Structure
```javascript
// LetterStrokeData.js
const LETTER_STROKES = {
    'A': [
        {
            id: 'A_left',
            type: 'line',
            startX: -40,
            startY: 40,
            endX: 0,
            endY: -40,
            width: 50,
            height: 80
        },
        {
            id: 'A_right',
            type: 'line',
            startX: 0,
            startY: -40,
            endX: 40,
            endY: 40,
            width: 50,
            height: 80
        },
        {
            id: 'A_bar',
            type: 'line',
            startX: -20,
            startY: 0,
            endX: 20,
            endY: 0,
            width: 40,
            height: 10
        }
    ],
    'B': [
        {
            id: 'B_vertical',
            type: 'line',
            startX: -30,
            startY: -40,
            endX: -30,
            endY: 40,
            width: 10,
            height: 80
        },
        {
            id: 'B_top',
            type: 'arc',
            startX: -30,
            startY: -40,
            endX: 20,
            endY: 0,
            radius: 30,
            width: 50,
            height: 40
        },
        {
            id: 'B_bottom',
            type: 'arc',
            startX: -30,
            startY: 0,
            endX: 20,
            endY: 40,
            radius: 30,
            width: 50,
            height: 40
        }
    ],
    'I': [
        {
            id: 'I_top',
            type: 'line',
            startX: -20,
            startY: -40,
            endX: 20,
            endY: -40,
            width: 40,
            height: 10
        },
        {
            id: 'I_vertical',
            type: 'line',
            startX: 0,
            startY: -40,
            endX: 0,
            endY: 40,
            width: 10,
            height: 80
        },
        {
            id: 'I_bottom',
            type: 'line',
            startX: -20,
            startY: 40,
            endX: 20,
            endY: 40,
            width: 40,
            height: 10
        }
    ],
    'L': [
        {
            id: 'L_vertical',
            type: 'line',
            startX: -20,
            startY: -40,
            endX: -20,
            endY: 40,
            width: 10,
            height: 80
        },
        {
            id: 'L_bottom',
            type: 'line',
            startX: -20,
            startY: 40,
            endX: 30,
            endY: 40,
            width: 50,
            height: 10
        }
    ]
    // ... Continue for all 26 letters
};

// Helper function to get strokes for a letter
function getStrokesForLetter(letter) {
    return LETTER_STROKES[letter.toUpperCase()] || [];
}
```

### Generating Pieces in LetterBuilderScene
```javascript
class LetterBuilderScene extends Phaser.Scene {
    generateLetterPieces() {
        // Clear existing pieces
        this.letterPieces.forEach(piece => piece.destroy());
        this.letterPieces = [];

        // Get stroke data for current letter
        const strokes = getStrokesForLetter(this.currentLetter.letter);

        // Calculate positions in pieces area
        const numPieces = strokes.length;
        const spacing = 150;
        const startX = 400 - ((numPieces - 1) * spacing / 2);
        const y = 510; // Pieces area center

        // Create each piece
        strokes.forEach((strokeData, index) => {
            const x = startX + (index * spacing);
            const piece = new LetterPiece(this, x, y, strokeData);
            this.letterPieces.push(piece);

            // Spawn animation
            piece.setAlpha(0);
            piece.setScale(0);
            this.tweens.add({
                targets: piece,
                alpha: 1,
                scale: 1,
                duration: 400,
                delay: index * 100, // Stagger
                ease: 'Back.easeOut'
            });
        });

        // Enable dragging after spawn animation
        this.time.delayedCall(400 + (numPieces * 100), () => {
            this.input.setDraggable(this.letterPieces);
        });
    }

    loadNextLetter() {
        // ... existing code ...

        // Generate pieces for this letter
        this.generateLetterPieces();
    }
}
```

### Drag Trail Implementation (Alternative Approach)
```javascript
// Simple trail using Graphics (more performant than particles)
class LetterPiece extends Phaser.GameObjects.Container {
    createTrail() {
        this.trailPoints = [];
        this.trailGraphics = this.scene.add.graphics();
        this.scene.add.existing(this.trailGraphics);
    }

    updateTrail() {
        if (!this.isDragging) return;

        // Add current position to trail
        this.trailPoints.push({ x: this.x, y: this.y, alpha: 1.0 });

        // Limit trail length
        if (this.trailPoints.length > 20) {
            this.trailPoints.shift();
        }

        // Clear and redraw trail
        this.trailGraphics.clear();

        for (let i = 0; i < this.trailPoints.length - 1; i++) {
            const point = this.trailPoints[i];
            const nextPoint = this.trailPoints[i + 1];

            // Fade trail over distance
            const alpha = (i / this.trailPoints.length) * 0.5;
            const thickness = (i / this.trailPoints.length) * 8;

            this.trailGraphics.lineStyle(thickness, 0xFFFFFF, alpha);
            this.trailGraphics.lineBetween(point.x, point.y, nextPoint.x, nextPoint.y);
        }
    }

    onDrag(pointer, dragX, dragY) {
        // ... existing drag code ...

        this.updateTrail();
    }

    destroyTrail() {
        this.trailPoints = [];
        if (this.trailGraphics) {
            this.trailGraphics.clear();
            this.trailGraphics.destroy();
            this.trailGraphics = null;
        }
    }
}
```

## Acceptance Criteria
- [ ] LetterPiece.js class created and functional
- [ ] LetterPiece extends Phaser.GameObjects.Container
- [ ] Letter stroke decomposition data defined for all 26 letters
- [ ] Stroke data includes 2-4 pieces per letter
- [ ] generateLetterPieces() method creates pieces from data
- [ ] Pieces display visually in pieces area (bottom of screen)
- [ ] Pieces are evenly distributed with adequate spacing
- [ ] Each piece is interactive and draggable
- [ ] Drag start: piece scales up, changes color, creates trail
- [ ] Drag move: piece follows pointer smoothly
- [ ] Drag move: piece clamped to screen bounds
- [ ] Drag move: trail effect follows piece
- [ ] Trail is visible and aesthetically pleasing
- [ ] Trail fades over time (300-500ms)
- [ ] Drag end: piece returns to start position (Phase 31 will add snapping)
- [ ] Drag end: trail stops and clears
- [ ] Drag end: piece scale returns to 1.0
- [ ] Pieces can be dragged multiple times
- [ ] Dragging one piece doesn't affect others
- [ ] Dragged piece is always on top (z-index)
- [ ] Pieces don't overlap in starting positions
- [ ] All animations are smooth (60fps maintained)
- [ ] Drag feels responsive (< 50ms latency)
- [ ] Tested with multiple letters (simple and complex)
- [ ] No console errors during drag operations

## Testing Steps
1. Load LetterBuilderScene
2. Verify 2-4 pieces display at bottom of screen
3. Check pieces are evenly spaced
4. Check each piece is visually distinct
5. Test drag interaction:
   - Hover over piece: cursor changes to pointer
   - Click and hold: piece scales up, brightens
   - Drag: piece follows pointer smoothly
   - Drag: trail effect appears behind piece
   - Drag: piece stays within screen bounds
   - Release: piece returns to start position
   - Release: trail disappears
   - Release: piece returns to normal scale
6. Test multiple pieces:
   - Drag piece 1, release
   - Drag piece 2, release
   - Drag piece 1 again
   - Verify each works independently
7. Test edge cases:
   - Drag piece to edge of screen (should clamp)
   - Drag piece very fast (trail should keep up)
   - Rapidly click and release (should handle gracefully)
8. Test different letters:
   - Navigate to new letter (manually or through console)
   - Verify correct number of pieces generate
   - Verify pieces match letter structure
9. Performance testing:
   - Open browser performance monitor
   - Drag pieces continuously for 30 seconds
   - Verify framerate stays at 60fps
   - Check memory usage (should be stable)
10. Check console for any errors or warnings

## Estimated Time
1.5 hours
- LetterPiece class: 30 minutes
- Stroke data definition: 20 minutes
- Piece generation: 15 minutes
- Drag mechanics: 20 minutes
- Trail effect: 15 minutes
- Testing and refinement: 10 minutes

## Dependencies
- Phase 29 completed
- LetterBuilderScene functional
- ContentProvider with letter data
- Phaser input system
- Phaser tweens system
- Phaser particles or graphics API

## Risks
- **Stroke data complexity**: Defining 26 letters with accurate strokes is time-consuming
  - Mitigation: Start with 5-10 simple letters, expand gradually
- **Performance**: Trails might impact framerate
  - Mitigation: Use graphics API instead of particles, limit trail length
- **Drag responsiveness**: Lag could frustrate users
  - Mitigation: Optimize drag update loop, test on target hardware
- **Piece size**: Pieces too small or too large
  - Mitigation: Test with target user (Aurora), adjust sizes
- **Visual clarity**: Pieces might be hard to distinguish from outline
  - Mitigation: Use different colors, thickness, opacity
- **Touch vs mouse**: Drag might work differently on touch devices
  - Mitigation: Test on mobile, use Phaser's unified input system

## ADHD-Friendly Design Considerations
- **Large pieces**: Minimum 80x120px, easy to grab
- **Immediate feedback**: Drag response < 50ms
- **Visual trail**: Satisfying feedback, keeps attention
- **No time limit**: Work at own pace, no pressure
- **Clear return**: Pieces always return to start (never lost)
- **One piece at a time**: Can't drag multiple simultaneously
- **Forgiving bounds**: Pieces clamp smoothly, no jarring stops
- **Repetition allowed**: Can drag pieces as many times as needed

## Notes
- **Keep strokes simple**: Children should recognize piece shapes
- **Visual consistency**: All pieces use same stroke width, style
- **Test with Aurora**: Her feedback on piece size and drag feel is crucial
- **Performance first**: Smooth dragging is more important than fancy effects
- **Stroke data accuracy**: Letters should be recognizable when complete
- **Consider difficulty**: Start with simple letters (I, L, T), progress to complex (M, W)
- **Asset vs code**: Could use sprite assets instead of Graphics API if needed
- **Phase 31 prep**: Design pieces with snap zones in mind (center points, bounds)

## Completion Checklist
- [ ] LetterPiece.js class created and tested
- [ ] Stroke decomposition data defined (at least 10 letters)
- [ ] Piece generation method implemented
- [ ] Drag and drop mechanics functional
- [ ] Trail effect implemented and polished
- [ ] Drag feedback (scale, color) working
- [ ] Pieces clamp to screen bounds
- [ ] Pieces return to start on release
- [ ] Z-index management working (dragged piece on top)
- [ ] Tested with multiple letters
- [ ] Performance verified (60fps)
- [ ] No console errors
- [ ] All acceptance criteria met
- [ ] Code is clean and commented
- [ ] Ready to proceed to Phase 31 (snapping logic)
