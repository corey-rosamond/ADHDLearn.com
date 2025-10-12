# Phase 38: Dance & Trace - Path Detection

## Goal
Implement smooth, forgiving finger/mouse tracking along letter paths with satisfying rainbow trail effects and ADHD-friendly hitbox tolerances for therapeutic tracing

## Context
This is the heart of the Dance & Trace mini-game. Aurora needs to trace letters with her finger or mouse, following the dotted paths from Phase 37. The system must:
1. Detect when finger/mouse is on the path (forgiving hitbox)
2. Track movement along the path (follow stroke order)
3. Render beautiful rainbow trail as Aurora traces
4. Enforce directional path following (prevent backwards tracing)
5. Provide continuous positive feedback (colors, sounds)
6. Be therapeutic and success-oriented (not frustrating)

This phase prioritizes motor skill support over strict accuracy. Aurora should feel successful and engaged, not stressed about precision.

## Prerequisites
- Phase 37 completed (scene setup, letter paths, starting indicator)
- Letter stroke data structure implemented
- Input system initialized
- Phaser Graphics for trail rendering
- Audio system for feedback sounds

## Tasks

### 1. Implement Path Detection System
- **PathDetector Class** (src/utils/PathDetector.js):
  - Track current position on path
  - Calculate distance from pointer to nearest path point
  - Determine if pointer is within hitbox
  - Track which stroke is active
  - Track progress along each stroke
  - Detect stroke completion

### 2. Create Forgiving Hitbox System
- **ADHD-Friendly Tolerances**:
  - Hitbox radius: 40-60 pixels (very forgiving)
  - Larger hitbox at stroke beginnings/ends (80 pixels)
  - Smaller hitbox in middle of long strokes (30 pixels)
  - Dynamic hitbox based on letter complexity
  - Easy letters (I, O): 60 pixel hitbox
  - Complex letters (M, W): 40 pixel hitbox
- **Adaptive Assistance**:
  - If Aurora leaves path briefly (< 500ms), don't penalize
  - "Snap to path" when close (within 70 pixels)
  - Auto-connect small gaps in tracing
  - Forgive direction errors briefly

### 3. Implement Directional Path Enforcement
- **Stroke Direction Tracking**:
  - Calculate intended direction for each stroke
  - Compare pointer movement to expected direction
  - Allow 45-degree deviation (very forgiving)
  - Detect backwards tracing
  - Gently guide forward (don't allow reverse)
- **Direction Vectors**:
  ```javascript
  // Calculate expected direction
  const expectedDir = {
    x: nextPoint.x - currentPoint.x,
    y: nextPoint.y - currentPoint.y
  };
  // Normalize
  const magnitude = Math.sqrt(expectedDir.x ** 2 + expectedDir.y ** 2);
  expectedDir.x /= magnitude;
  expectedDir.y /= magnitude;

  // Compare with actual movement
  const actualDir = {
    x: currentPointer.x - previousPointer.x,
    y: currentPointer.y - previousPointer.y
  };
  // Calculate dot product (-1 to 1)
  const dotProduct = expectedDir.x * actualDir.x + expectedDir.y * actualDir.y;
  // If dotProduct < 0, user is going backwards
  ```

### 4. Render Rainbow Trail Effect
- **Trail Graphics**:
  - Use Phaser.Graphics for trail rendering
  - Draw colored line segments as Aurora traces
  - Rainbow color progression (ROY G BIV)
  - Smooth color transitions
  - Trail width: 12-16 pixels (thick and satisfying)
  - Trail alpha: 0.9 (slightly transparent)
- **Color Algorithm**:
  ```javascript
  // Map progress (0-1) to HSV color
  const hue = (progress * 360) % 360; // 0-360 degrees
  const color = Phaser.Display.Color.HSVToRGB(hue / 360, 1.0, 1.0);
  ```
- **Trail Segments**:
  - Store trail points as array
  - Draw line segments between consecutive points
  - Interpolate colors smoothly
  - Clear trail on stroke completion (or keep for visual feedback)

### 5. Implement Stroke Progress Tracking
- **Progress Data Structure**:
  ```javascript
  this.traceProgress = {
    currentStroke: 0,          // Which stroke (0-3)
    strokeProgress: 0.0,       // Progress along stroke (0.0-1.0)
    totalProgress: 0.0,        // Overall letter progress (0.0-1.0)
    pointsTraced: [],          // Array of traced points
    strokesCompleted: [],      // Boolean array [true, false, false]
    isTracing: false,          // Currently tracing
    lastValidPoint: null,      // Last valid path point
    consecutiveOffPath: 0      // Frames off path (for forgiveness)
  };
  ```
- **Progress Calculation**:
  - Track how far along current stroke
  - Calculate overall letter completion percentage
  - Update progress bar (if shown)
  - Trigger stroke completion events

### 6. Add Audio and Visual Feedback
- **Continuous Feedback**:
  - Play soft "whoosh" sound as tracing progresses
  - Sparkle particles along trail
  - Slight haptic vibration on mobile (if available)
  - Color intensity increases as stroke progresses
- **Milestone Feedback**:
  - Chime sound when stroke completes (50% through letter)
  - Brighter sparkles at stroke completion
  - Encouraging audio: "Great tracing!"
- **Off-Path Feedback**:
  - Trail fades to gray if off path
  - Gentle audio cue: "Follow the dots"
  - Visual arrow pointing back to path
  - No harsh penalties (therapeutic focus)

### 7. Handle Multi-Stroke Letters
- **Stroke Transitions**:
  - Detect when current stroke completes
  - Move to next stroke automatically
  - Highlight next stroke's starting point
  - Play transition sound
  - Allow user to lift finger between strokes
- **Stroke Order Enforcement** (Optional):
  - Force correct stroke order (stroke 1 → 2 → 3)
  - Or allow any stroke order (more forgiving)
  - Configuration option for strictness level

### 8. Implement Input Handling
- **Mouse Input**:
  - pointerdown: Start tracing
  - pointermove: Continue tracing
  - pointerup: Pause/stop tracing
- **Touch Input**:
  - Identical to mouse but optimized for touch
  - Prevent page scrolling during tracing
  - Handle multi-touch (use first pointer only)
- **Input Smoothing**:
  - Sample pointer position every frame
  - Smooth jittery input (rolling average)
  - Prevent large jumps (teleportation detection)

## Implementation Details

### PathDetector.js Class
```javascript
class PathDetector {
    constructor(scene, letterData, hitboxRadius = 50) {
        this.scene = scene;
        this.letterData = letterData;
        this.hitboxRadius = hitboxRadius;
        this.currentStroke = 0;
        this.strokeProgress = 0.0;
        this.isOnPath = false;
        this.lastValidPoint = null;
        this.trailPoints = [];
    }

    /**
     * Check if pointer is on the path
     * @param {number} pointerX - Current pointer X position
     * @param {number} pointerY - Current pointer Y position
     * @returns {Object} - {onPath: boolean, nearestPoint: {x, y}, distance: number}
     */
    checkPath(pointerX, pointerY) {
        const stroke = this.letterData.strokes[this.currentStroke];
        if (!stroke) return { onPath: false, nearestPoint: null, distance: Infinity };

        let nearestPoint = null;
        let minDistance = Infinity;

        // Check all points in current stroke
        for (let i = 0; i < stroke.points.length; i++) {
            const point = stroke.points[i];
            const adjustedX = 400 + point.x - 400; // Adjust for canvas centering
            const adjustedY = 320 + point.y - 320;

            const distance = Phaser.Math.Distance.Between(
                pointerX, pointerY,
                adjustedX, adjustedY
            );

            if (distance < minDistance) {
                minDistance = distance;
                nearestPoint = { x: adjustedX, y: adjustedY, originalIndex: i };
            }
        }

        // Check if within hitbox
        const onPath = minDistance <= this.hitboxRadius;

        // Dynamic hitbox: larger at stroke start/end
        let effectiveHitbox = this.hitboxRadius;
        if (nearestPoint && nearestPoint.originalIndex === 0) {
            effectiveHitbox = this.hitboxRadius * 1.5; // 50% larger at start
        }

        return {
            onPath: minDistance <= effectiveHitbox,
            nearestPoint,
            distance: minDistance
        };
    }

    /**
     * Update tracing progress
     * @param {Object} pathCheck - Result from checkPath()
     * @returns {boolean} - True if stroke/letter completed
     */
    updateProgress(pathCheck) {
        if (!pathCheck.onPath) {
            this.isOnPath = false;
            return false;
        }

        this.isOnPath = true;
        this.lastValidPoint = pathCheck.nearestPoint;

        // Calculate stroke progress
        const stroke = this.letterData.strokes[this.currentStroke];
        const pointIndex = pathCheck.nearestPoint.originalIndex;
        const progress = pointIndex / (stroke.points.length - 1);

        // Only update if moving forward
        if (progress >= this.strokeProgress) {
            this.strokeProgress = progress;

            // Check if stroke completed (reached 90%+)
            if (this.strokeProgress >= 0.9) {
                return this.completeStroke();
            }
        }

        return false;
    }

    /**
     * Complete current stroke and move to next
     * @returns {boolean} - True if entire letter completed
     */
    completeStroke() {
        this.currentStroke++;
        this.strokeProgress = 0.0;

        // Check if all strokes completed
        if (this.currentStroke >= this.letterData.strokes.length) {
            return true; // Letter complete!
        }

        return false; // More strokes remaining
    }

    /**
     * Check direction of movement (prevent backwards tracing)
     * @param {number} prevX - Previous pointer X
     * @param {number} prevY - Previous pointer Y
     * @param {number} currX - Current pointer X
     * @param {number} currY - Current pointer Y
     * @returns {boolean} - True if moving in correct direction
     */
    checkDirection(prevX, prevY, currX, currY) {
        const stroke = this.letterData.strokes[this.currentStroke];
        if (!stroke || stroke.points.length < 2) return true;

        // Get current and next point on path
        const currentIndex = Math.floor(this.strokeProgress * (stroke.points.length - 1));
        const nextIndex = Math.min(currentIndex + 1, stroke.points.length - 1);

        const p1 = stroke.points[currentIndex];
        const p2 = stroke.points[nextIndex];

        // Expected direction
        const expectedDx = p2.x - p1.x;
        const expectedDy = p2.y - p1.y;
        const expectedMag = Math.sqrt(expectedDx ** 2 + expectedDy ** 2);

        if (expectedMag === 0) return true;

        const expectedDir = {
            x: expectedDx / expectedMag,
            y: expectedDy / expectedMag
        };

        // Actual movement direction
        const actualDx = currX - prevX;
        const actualDy = currY - prevY;
        const actualMag = Math.sqrt(actualDx ** 2 + actualDy ** 2);

        if (actualMag === 0) return true;

        const actualDir = {
            x: actualDx / actualMag,
            y: actualDy / actualMag
        };

        // Dot product: 1 = same direction, -1 = opposite
        const dotProduct = expectedDir.x * actualDir.x + expectedDir.y * actualDir.y;

        // Allow 45-degree deviation (dot product > 0.7)
        return dotProduct > 0.5; // Very forgiving
    }

    reset() {
        this.currentStroke = 0;
        this.strokeProgress = 0.0;
        this.isOnPath = false;
        this.lastValidPoint = null;
        this.trailPoints = [];
    }
}
```

### DanceTraceScene.js - Input and Tracing Logic
```javascript
class DanceTraceScene extends Phaser.Scene {
    // ... (existing code from Phase 37)

    setupInput() {
        this.isTracing = false;
        this.previousPointer = null;
        this.trailPoints = [];

        // Initialize PathDetector
        this.pathDetector = new PathDetector(this, this.letterData, 50);

        // Create trail graphics
        this.trailGraphics = this.add.graphics();

        // Pointer down - start tracing
        this.input.on('pointerdown', (pointer) => {
            // Check if starting at correct point
            const pathCheck = this.pathDetector.checkPath(pointer.x, pointer.y);

            if (pathCheck.onPath && this.pathDetector.currentStroke === 0) {
                this.startTracing(pointer);
            } else {
                // Give feedback: "Start at the green circle"
                this.sound.play('hint-start-here');
            }
        });

        // Pointer move - continue tracing
        this.input.on('pointermove', (pointer) => {
            if (this.isTracing && pointer.isDown) {
                this.continueTracing(pointer);
            }
        });

        // Pointer up - pause tracing
        this.input.on('pointerup', () => {
            this.pauseTracing();
        });
    }

    startTracing(pointer) {
        this.isTracing = true;
        this.previousPointer = { x: pointer.x, y: pointer.y };
        this.trailPoints = [];

        // Hide start indicator
        if (this.startIndicator) {
            this.startIndicator.setVisible(false);
        }

        // Play start sound
        this.sound.play('trace-start');

        console.log('Tracing started!');
    }

    continueTracing(pointer) {
        if (!this.previousPointer) return;

        // Check if on path
        const pathCheck = this.pathDetector.checkPath(pointer.x, pointer.y);

        // Check direction (prevent backwards)
        const correctDirection = this.pathDetector.checkDirection(
            this.previousPointer.x,
            this.previousPointer.y,
            pointer.x,
            pointer.y
        );

        if (pathCheck.onPath && correctDirection) {
            // Valid tracing - add to trail
            this.trailPoints.push({
                x: pointer.x,
                y: pointer.y,
                progress: this.pathDetector.strokeProgress
            });

            // Update progress
            const letterComplete = this.pathDetector.updateProgress(pathCheck);

            // Render trail
            this.renderTrail();

            // Check completion
            if (letterComplete) {
                this.onLetterComplete();
            }

            // Continuous feedback
            if (this.trailPoints.length % 5 === 0) {
                this.sound.play('trace-whoosh', { volume: 0.3 });
            }
        } else {
            // Off path or wrong direction
            this.handleOffPath(pathCheck, correctDirection);
        }

        // Update previous pointer
        this.previousPointer = { x: pointer.x, y: pointer.y };
    }

    pauseTracing() {
        this.isTracing = false;
        console.log('Tracing paused');
    }

    renderTrail() {
        this.trailGraphics.clear();

        if (this.trailPoints.length < 2) return;

        // Draw trail with rainbow colors
        for (let i = 1; i < this.trailPoints.length; i++) {
            const p1 = this.trailPoints[i - 1];
            const p2 = this.trailPoints[i];

            // Calculate color based on progress
            const progress = p2.progress;
            const hue = (progress * 360) % 360;
            const color = Phaser.Display.Color.HSVToRGB(hue / 360, 1.0, 1.0);

            this.trailGraphics.lineStyle(14, color.color, 0.9);
            this.trailGraphics.lineBetween(p1.x, p1.y, p2.x, p2.y);
        }
    }

    handleOffPath(pathCheck, correctDirection) {
        // Give gentle feedback
        if (!correctDirection) {
            // Wrong direction
            console.log('Wrong direction - gently guide forward');
            // Could add visual arrow here
        } else {
            // Off path
            console.log('Off path - distance:', pathCheck.distance);
            // If close, snap to path
            if (pathCheck.distance < 70) {
                // Auto-assist: continue as if on path
                this.trailPoints.push({
                    x: pathCheck.nearestPoint.x,
                    y: pathCheck.nearestPoint.y,
                    progress: this.pathDetector.strokeProgress
                });
            }
        }
    }

    onLetterComplete() {
        this.isTracing = false;
        console.log('Letter completed!');

        // Phase 39 will handle celebration
        // For now, just log
        this.sound.play('letter-complete-chime');
    }
}
```

### Rainbow Trail Color Algorithm
```javascript
/**
 * Generate rainbow color based on progress
 * @param {number} progress - Value from 0.0 to 1.0
 * @returns {number} - Hex color value
 */
function getRainbowColor(progress) {
    // Map progress to hue (0-360 degrees)
    const hue = (progress * 360) % 360;

    // Convert HSV to RGB (Saturation=1.0, Value=1.0)
    const rgb = Phaser.Display.Color.HSVToRGB(hue / 360, 1.0, 1.0);

    return rgb.color;
}

/**
 * Example color progression:
 * progress: 0.0  → Red      (0°)
 * progress: 0.17 → Orange   (60°)
 * progress: 0.33 → Yellow   (120°)
 * progress: 0.5  → Green    (180°)
 * progress: 0.67 → Blue     (240°)
 * progress: 0.83 → Indigo   (300°)
 * progress: 1.0  → Violet   (360° → 0°)
 */
```

## Acceptance Criteria
- [ ] PathDetector class created and functional
- [ ] Forgiving hitbox system implemented (40-60 pixel radius)
- [ ] Path detection works for all strokes
- [ ] Tracing starts only from starting point (green circle)
- [ ] Rainbow trail renders as Aurora traces
- [ ] Trail colors transition smoothly (ROY G BIV)
- [ ] Trail width is satisfying (12-16 pixels)
- [ ] Directional enforcement prevents backwards tracing
- [ ] Direction check allows 45-degree deviation
- [ ] Off-path forgiveness (< 500ms grace period)
- [ ] Snap-to-path assistance (within 70 pixels)
- [ ] Stroke progress tracked accurately
- [ ] Stroke completion detected (90% threshold)
- [ ] Multi-stroke letters handled correctly
- [ ] Audio feedback on trace start
- [ ] Continuous whoosh sound as tracing progresses
- [ ] Chime sound on stroke completion
- [ ] No harsh penalties for errors
- [ ] Input smoothing prevents jittery trails
- [ ] Works on both mouse and touch devices
- [ ] No console errors during tracing

## Testing Steps
1. Launch Dance & Trace (letter A)
2. Verify starting indicator is visible
3. **Test Starting Point**:
   - Try clicking away from green circle - nothing happens
   - Try clicking on green circle - tracing starts
   - Verify start indicator disappears
   - Hear trace-start sound
4. **Test Path Following**:
   - Trace along left diagonal of A
   - Verify rainbow trail appears behind finger/mouse
   - Verify trail follows exact path
   - Check trail width (should be thick)
5. **Test Rainbow Colors**:
   - Watch colors transition as tracing progresses
   - Verify smooth color changes (no sudden jumps)
   - Check color order: Red → Orange → Yellow → Green → Blue → Purple
6. **Test Hitbox Forgiveness**:
   - Trace slightly off path (within 50 pixels)
   - Verify trail still renders (forgiving)
   - Trace far off path (> 60 pixels)
   - Verify trail pauses or fades
7. **Test Direction Enforcement**:
   - Try tracing backwards
   - Verify system prevents backwards progress
   - Try tracing at 30-degree angle
   - Verify system allows slight deviation
8. **Test Stroke Completion**:
   - Complete first stroke (left diagonal)
   - Verify stroke completes at ~90%
   - Verify next stroke becomes active
   - Hear chime sound
9. **Test Multi-Stroke**:
   - Complete all 3 strokes of letter A
   - Verify transitions between strokes
   - Verify letter completion detected
10. **Test Off-Path Behavior**:
    - Move off path briefly
    - Verify forgiveness (don't lose progress)
    - Move back to path
    - Verify tracing continues smoothly
11. **Test Snap-to-Path**:
    - Trace close but not on path (60 pixels away)
    - Verify system snaps to nearest path point
12. **Test Different Letters**:
    - Test simple letter (O - single stroke)
    - Test complex letter (M - 4 strokes)
    - Verify hitbox adjusts appropriately
13. **Test Touch vs. Mouse**:
    - Test on desktop with mouse
    - Test on tablet/phone with finger
    - Verify both work identically
14. Console check - verify no errors

## Estimated Time
1.5 hours

## Dependencies
- Phase 37 (scene setup, letter paths)
- Phaser Input System (mouse, touch)
- Phaser Graphics (trail rendering)
- Phaser Display.Color (HSV to RGB conversion)
- PathDetector utility class
- Audio files (trace-start, trace-whoosh, stroke-complete)

## Risks
- **Path Detection Complexity**: Complex letters may have edge cases
- **Performance**: Rendering trail every frame may impact FPS
- **Direction Calculation**: Vector math may be tricky for curved paths
- **Touch Sensitivity**: May need calibration for different devices
- **Forgiveness Balance**: Too forgiving = no challenge; too strict = frustrating
- **Multi-Touch**: Must handle only first touch on mobile

## Notes
- **Therapeutic Design**: Prioritize success over accuracy
- **ADHD Support**: Forgiving hitbox, snap-to-path, no penalties
- **Positive Feedback**: Continuous audio/visual encouragement
- **Motor Skills**: Wide hitbox accommodates fine motor challenges
- **Visual Satisfaction**: Rainbow trail is the primary reward
- **No Failure State**: Aurora can retry infinitely without punishment
- **Stroke Order**: Consider allowing any order for maximum flexibility
- **Audio Balance**: Continuous sounds should be subtle, not overwhelming
- **Trail Persistence**: Consider keeping trail visible as accomplishment record
- **Performance**: May need to limit trail points (keep last 200)
- **Mobile Optimization**: Prevent page scroll during tracing
- **Accessibility**: Consider color-blind modes for rainbow trail
- Test with actual child to calibrate forgiveness levels

## Completion Checklist
- [ ] PathDetector.js class created and tested
- [ ] Forgiving hitbox system implemented
- [ ] Directional enforcement working
- [ ] Rainbow trail rendering beautifully
- [ ] Stroke progress tracking accurate
- [ ] Multi-stroke support functional
- [ ] Audio feedback implemented
- [ ] Off-path forgiveness working
- [ ] Snap-to-path assistance working
- [ ] Input handling for mouse and touch
- [ ] All acceptance criteria met
- [ ] Tested with multiple letters
- [ ] Tested on touch device
- [ ] No console errors
- [ ] Performance is smooth (60 FPS)
- [ ] Ready for Phase 39 (completion and flow)
