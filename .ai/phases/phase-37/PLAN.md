# Phase 37: Dance & Trace - Scene Setup

## Goal
Create the foundation for a therapeutic letter-tracing mini-game with a visually engaging canvas, dotted letter paths, and clear starting indicators designed to be ADHD-friendly and motor-skill supportive

## Context
Dance & Trace is Aurora's calming, focused activity where she traces letters with her finger or mouse, following colorful paths. This phase establishes:
1. A dedicated DanceTraceScene with unique visual identity
2. Large, clear letter displays with dotted tracing paths
3. Pulsing start-point indicators for clear guidance
4. Letter stroke order data structure
5. Canvas setup for smooth path rendering

This mini-game is designed to be therapeutic, building fine motor skills while providing satisfying visual feedback. The forgiving hitbox system (implemented in Phase 38) ensures Aurora experiences success, not frustration.

## Prerequisites
- Phases 1-36 completed
- Main menu can launch mini-games
- Audio system functional
- Basic letter data structure exists
- Phaser graphics system working

## Tasks

### 1. Create DanceTraceScene.js File
- Create src/scenes/DanceTraceScene.js
- Extend Phaser.Scene with key 'DanceTraceScene'
- Initialize scene data structure:
  ```javascript
  {
    currentLetter: 'A',
    letterIndex: 0,
    lettersPerRound: 5,
    letterQueue: ['A', 'B', 'C', 'D', 'E'],
    traceComplete: false,
    startTime: 0
  }
  ```
- Set up coordinate system (centered letter at 400, 300)
- Configure scene background and exit handler

### 2. Design Unique Background
- **Background Theme**: Soft gradient with gentle stars/sparkles
  - Top: Light purple/blue (#8B9FD8)
  - Bottom: Warm pink/peach (#FFB6C1)
  - Animated twinkling stars (small, subtle)
- **Optional**: Animated cloud particles drifting slowly
- **Border**: Rounded frame around tracing area
- **Color Palette**: Calming, non-distracting, high contrast with letter
- **Accessibility**: Ensure letter path stands out clearly
- Background should feel magical but not overwhelming

### 3. Create Letter Path Data Structure
- **Letter Stroke Data** (src/data/letterStrokes.js):
  ```javascript
  const letterStrokes = {
    A: {
      strokes: [
        { // Stroke 1: Left diagonal
          points: [{x: 350, y: 450}, {x: 400, y: 250}],
          direction: 'up-right'
        },
        { // Stroke 2: Right diagonal
          points: [{x: 400, y: 250}, {x: 450, y: 450}],
          direction: 'down-right'
        },
        { // Stroke 3: Horizontal bar
          points: [{x: 375, y: 350}, {x: 425, y: 350}],
          direction: 'right'
        }
      ],
      startPoint: {x: 350, y: 450},
      scale: 1.0
    },
    B: { /* ... */ },
    // ... all 26 letters
  };
  ```
- **Stroke Properties**:
  - `points`: Array of {x, y} coordinates defining the path
  - `direction`: Hint for directional enforcement (Phase 38)
  - `startPoint`: Where to begin tracing (pulsing circle)
  - `scale`: Scaling factor for letter size adjustment

### 4. Render Dotted Letter Path
- **Path Rendering Function**:
  - Use Phaser.Graphics to draw dotted lines
  - Dot size: 8-12 pixels (large enough for finger/mouse)
  - Dot spacing: 15-20 pixels (clear visual guide)
  - Dot color: Light gray (#CCCCCC) or soft blue
  - Semi-transparent: alpha 0.6-0.8
- **Multi-Stroke Support**:
  - Each letter can have 1-4 strokes
  - Render all strokes initially
  - Visually distinguish completed vs. incomplete strokes (Phase 38)
- **Dynamic Letter Sizing**:
  - Large letters: 250-350 pixels tall
  - Centered on canvas
  - Adjust based on letter complexity (W is wider than I)

### 5. Create Starting Point Indicator
- **Pulsing Circle Animation**:
  - Position: First point of first stroke
  - Visual: Bright green circle with white border
  - Size: 30-40 pixel diameter
  - Animation: Scale tween (1.0 to 1.3 and back)
  - Duration: 1 second per pulse cycle
  - Loop: Infinite until tracing starts
- **Accessibility Features**:
  - High contrast (green on light background)
  - Optional arrow pointing to start (for clarity)
  - Audio cue: "Start here!" voice instruction
  - Haptic pulse on mobile (if available)

### 6. Add UI Elements
- **Top Bar**:
  - "Dance & Trace" title
  - Progress indicator: "Letter 2 of 5"
  - Star count display
- **Exit Button**:
  - Top-left corner
  - "X" or "Back" button
  - Returns to main menu
- **Letter Display**:
  - Large letter name at top: "Letter A"
  - Font: 48px, bold, white with shadow

### 7. Implement Letter Loading System
- **preload() Method**:
  - Load letter stroke data
  - Load audio files (letter names, instructions)
  - Load background graphics/particles
- **create() Method**:
  - Load current letter from queue
  - Render background
  - Draw dotted path
  - Create starting indicator
  - Play intro audio: "Let's trace the letter A!"

## Implementation Details

### DanceTraceScene.js Structure
```javascript
class DanceTraceScene extends Phaser.Scene {
    constructor() {
        super({ key: 'DanceTraceScene' });
        this.currentLetter = null;
        this.letterData = null;
        this.letterIndex = 0;
        this.lettersPerRound = 5;
        this.letterQueue = [];
        this.pathGraphics = null;
        this.startIndicator = null;
        this.trailGraphics = null; // For Phase 38
    }

    init(data) {
        // Receive letter queue or generate random queue
        this.letterQueue = data.letters || this.generateRandomLetters(5);
        this.letterIndex = 0;
    }

    preload() {
        // Load letter stroke data
        this.load.json('letterStrokes', 'assets/data/letterStrokes.json');

        // Load audio
        this.load.audio('trace-intro', 'assets/audio/trace-intro.mp3');
        this.load.audio('letter-a-name', 'assets/audio/letters/a.mp3');
        // ... other letters
    }

    create() {
        // Create background
        this.createBackground();

        // Load letter data
        this.currentLetter = this.letterQueue[this.letterIndex];
        this.letterData = this.cache.json.get('letterStrokes')[this.currentLetter];

        // UI elements
        this.createUI();

        // Draw letter path
        this.drawLetterPath();

        // Create start indicator
        this.createStartIndicator();

        // Play intro audio
        this.playIntroAudio();

        // Set up input (Phase 38)
        this.setupInput();
    }

    createBackground() {
        // Gradient background
        const gradient = this.add.graphics();
        gradient.fillGradientStyle(0x8B9FD8, 0x8B9FD8, 0xFFB6C1, 0xFFB6C1, 1);
        gradient.fillRect(0, 0, 800, 600);

        // Add subtle stars
        for (let i = 0; i < 20; i++) {
            const star = this.add.circle(
                Phaser.Math.Between(50, 750),
                Phaser.Math.Between(50, 550),
                Phaser.Math.Between(2, 4),
                0xFFFFFF,
                0.6
            );

            // Twinkling animation
            this.tweens.add({
                targets: star,
                alpha: { from: 0.3, to: 0.9 },
                duration: Phaser.Math.Between(1000, 3000),
                yoyo: true,
                repeat: -1,
                delay: Phaser.Math.Between(0, 2000)
            });
        }
    }

    createUI() {
        // Title
        this.add.text(400, 30, 'Dance & Trace', {
            fontSize: '36px',
            color: '#FFFFFF',
            fontFamily: 'Arial',
            stroke: '#333333',
            strokeThickness: 4
        }).setOrigin(0.5);

        // Progress indicator
        this.progressText = this.add.text(400, 70,
            `Letter ${this.letterIndex + 1} of ${this.lettersPerRound}`,
            {
                fontSize: '24px',
                color: '#FFFFFF',
                fontFamily: 'Arial'
            }
        ).setOrigin(0.5);

        // Current letter name
        this.add.text(400, 120, `Letter ${this.currentLetter}`, {
            fontSize: '48px',
            color: '#FFFFFF',
            fontFamily: 'Arial',
            stroke: '#333333',
            strokeThickness: 6
        }).setOrigin(0.5);

        // Exit button
        const exitButton = this.add.rectangle(50, 30, 80, 40, 0xFF4444)
            .setInteractive({ useHandCursor: true });
        this.add.text(50, 30, 'Exit', {
            fontSize: '20px',
            color: '#FFFFFF'
        }).setOrigin(0.5);

        exitButton.on('pointerdown', () => {
            this.scene.start('MainMenuScene');
        });
    }

    drawLetterPath() {
        this.pathGraphics = this.add.graphics();

        const strokes = this.letterData.strokes;
        const baseX = 400; // Center X
        const baseY = 320; // Center Y (slightly lower than middle)

        strokes.forEach((stroke, strokeIndex) => {
            const points = stroke.points;

            // Draw dotted line along stroke
            for (let i = 0; i < points.length - 1; i++) {
                const p1 = points[i];
                const p2 = points[i + 1];

                // Calculate distance between points
                const dx = p2.x - p1.x;
                const dy = p2.y - p1.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const dotSpacing = 18;
                const numDots = Math.floor(distance / dotSpacing);

                // Draw dots along the path
                for (let j = 0; j <= numDots; j++) {
                    const t = j / numDots;
                    const x = baseX + p1.x + dx * t - 400; // Adjust for centering
                    const y = baseY + p1.y + dy * t - 320;

                    this.pathGraphics.fillStyle(0xCCCCCC, 0.7);
                    this.pathGraphics.fillCircle(x, y, 6);
                }
            }
        });
    }

    createStartIndicator() {
        const firstStroke = this.letterData.strokes[0];
        const startPoint = firstStroke.points[0];

        // Adjust for centering
        const x = 400 + startPoint.x - 400;
        const y = 320 + startPoint.y - 320;

        // Create pulsing circle
        this.startIndicator = this.add.circle(x, y, 35, 0x44FF44, 0.8);
        this.add.circle(x, y, 35, 0xFFFFFF, 0).setStrokeStyle(4, 0xFFFFFF);

        // Pulsing animation
        this.tweens.add({
            targets: this.startIndicator,
            scale: { from: 1.0, to: 1.3 },
            alpha: { from: 0.8, to: 0.5 },
            duration: 1000,
            yoyo: true,
            repeat: -1
        });
    }

    playIntroAudio() {
        // Play: "Let's trace the letter A!"
        this.sound.play('trace-intro');

        // Then play letter name
        this.time.delayedCall(1500, () => {
            this.sound.play(`letter-${this.currentLetter.toLowerCase()}-name`);
        });
    }

    setupInput() {
        // Phase 38 will implement tracing detection
        // For now, just prepare input system
        this.input.on('pointerdown', (pointer) => {
            console.log('Tracing started at:', pointer.x, pointer.y);
        });
    }

    generateRandomLetters(count) {
        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
        const selected = [];
        for (let i = 0; i < count; i++) {
            const randomIndex = Phaser.Math.Between(0, letters.length - 1);
            selected.push(letters[randomIndex]);
        }
        return selected;
    }

    update() {
        // Animation updates handled by tweens
    }
}
```

### Letter Stroke Data Format (letterStrokes.json)
```json
{
  "A": {
    "strokes": [
      {
        "points": [
          {"x": -50, "y": 130},
          {"x": 0, "y": -70}
        ],
        "direction": "up-right"
      },
      {
        "points": [
          {"x": 0, "y": -70},
          {"x": 50, "y": 130}
        ],
        "direction": "down-right"
      },
      {
        "points": [
          {"x": -25, "y": 30},
          {"x": 25, "y": 30}
        ],
        "direction": "right"
      }
    ],
    "startPoint": {"x": -50, "y": 130}
  },
  "B": {
    "strokes": [
      {
        "points": [
          {"x": -40, "y": -70},
          {"x": -40, "y": 130}
        ],
        "direction": "down"
      },
      {
        "points": [
          {"x": -40, "y": -70},
          {"x": 20, "y": -70},
          {"x": 40, "y": -50},
          {"x": 40, "y": -10},
          {"x": 20, "y": 10},
          {"x": -40, "y": 10}
        ],
        "direction": "right-curve"
      },
      {
        "points": [
          {"x": -40, "y": 10},
          {"x": 30, "y": 10},
          {"x": 50, "y": 30},
          {"x": 50, "y": 110},
          {"x": 30, "y": 130},
          {"x": -40, "y": 130}
        ],
        "direction": "right-curve"
      }
    ],
    "startPoint": {"x": -40, "y": -70}
  }
}
```

## Acceptance Criteria
- [ ] DanceTraceScene.js file created and registered with Phaser
- [ ] Scene displays unique gradient background (purple to pink)
- [ ] Subtle twinkling stars animate in background
- [ ] "Dance & Trace" title displays at top
- [ ] Progress indicator shows "Letter X of 5"
- [ ] Current letter name displays prominently
- [ ] Exit button returns to main menu
- [ ] Letter stroke data structure defined for all 26 letters
- [ ] Dotted path renders correctly for current letter
- [ ] Dots are clear, evenly spaced, and visible
- [ ] Starting point indicator (green circle) displays at correct position
- [ ] Starting indicator pulses smoothly (1 second cycle)
- [ ] Letter is large (250-350px tall) and centered
- [ ] Intro audio plays: "Let's trace the letter [X]!"
- [ ] Letter name audio plays after intro
- [ ] No console errors on scene load
- [ ] Letter queue system works (5 letters per round)
- [ ] Scene transitions smoothly from main menu

## Testing Steps
1. Launch Dance & Trace from main menu
2. Verify background gradient renders correctly
3. Verify stars twinkle gently
4. Check UI elements:
   - Title displays
   - Progress shows "Letter 1 of 5"
   - Current letter name correct
   - Exit button functional
5. Verify letter path:
   - Dotted path visible and clear
   - Dots evenly spaced
   - Path matches letter shape
6. Check starting indicator:
   - Green circle at correct position
   - Pulses smoothly
   - High contrast against background
7. Test audio:
   - Intro voice plays
   - Letter name plays after intro
   - Volume appropriate
8. Test multiple letters:
   - Complete letter A (manually advance for now)
   - Verify letter B loads correctly
   - Check all 5 letters in queue
9. Test exit button - returns to menu
10. Open console - verify no errors

## Estimated Time
1 hour

## Dependencies
- Phaser 3 Graphics API (for dotted paths)
- Phaser Tweens (for pulsing animation)
- Audio system (letter names, instructions)
- Letter stroke data (JSON file)

## Risks
- **Path Rendering Complexity**: Complex letters (M, W) require careful point placement
- **Coordinate Centering**: Letter paths must center correctly on all letters
- **Mobile Performance**: Many animated stars may impact performance
- **Stroke Data Creation**: Manually defining 26 letters is time-consuming
- **Audio Timing**: Intro and letter name must not overlap awkwardly

## Notes
- Keep background animations subtle - focus is on letter tracing
- Large touch targets are essential for motor skill support
- Dotted path should be forgiving - Phase 38 implements wide hitbox
- Letter stroke data is reusable for handwriting analysis later
- Consider using Bezier curves for smoother letter paths
- Starting indicator must be immediately obvious to Aurora
- Background colors should be calming, not stimulating
- Test with actual finger on touchscreen, not just mouse
- Letter sizing should be consistent across all letters
- Consider adding optional guidelines (like handwriting paper lines)

## Completion Checklist
- [ ] DanceTraceScene.js created and functional
- [ ] Background renders with gradient and stars
- [ ] All UI elements display correctly
- [ ] Letter stroke data defined for all 26 letters
- [ ] Dotted path renders accurately
- [ ] Starting indicator pulses at correct position
- [ ] Audio plays correctly (intro and letter name)
- [ ] Letter queue system works
- [ ] Exit button functional
- [ ] All acceptance criteria met
- [ ] Tested with multiple letters
- [ ] No console errors
- [ ] Tested on touch device
- [ ] Ready for Phase 38 (path detection)
