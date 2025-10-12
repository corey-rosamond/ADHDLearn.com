# Phase 29: Letter Builder - Scene Setup

## Goal
Create the foundational scene structure and UI for the Letter Builder mini-game, including unique visual design, target letter outline display, and navigation controls

## Context
This is the first phase of the **Letter Builder mini-game** (Phases 29-32), the third complete mini-game in Aurora's Letter Adventure. Letter Builder teaches letter formation through interactive puzzle mechanics - children assemble letters from 2-4 component pieces (strokes), learning proper letter structure kinesthetically.

Letter Builder differs from Letter Pop and Word Catch:
- **Letter Pop**: Recognition (identify letters)
- **Word Catch**: Reading (recognize sight words)
- **Letter Builder**: Formation (construct letters from parts)

This game targets:
- Fine motor skill development (dragging, precision placement)
- Spatial reasoning (how parts combine to form wholes)
- Letter structure understanding (which strokes make each letter)
- ADHD-friendly interaction (hands-on, tactile learning)

Phase 29 establishes the visual identity, UI framework, and navigation. Subsequent phases add draggable pieces (30), snapping logic (31), and polish (32).

## Prerequisites
- Phase 1-28 completed
- Two mini-games complete (Letter Pop, Word Catch)
- ContentProvider working with letter data
- Scene management architecture established
- Audio system functional
- MainMenuScene supports multiple game options

## Tasks

### 1. Create LetterBuilderScene.js
- Create new scene class: `LetterBuilderScene`
- Register scene in game config
- Implement scene lifecycle methods (preload, create, update)
- Set scene key: `'LetterBuilderScene'`
- Add scene to build pipeline/index
- Verify scene loads without errors

### 2. Design Unique Background
- Create distinctive background different from Letter Pop and Word Catch
- Consider construction/building theme (toolbox, workshop, craft table)
- Use warm colors (yellows, oranges, browns for woodworking theme)
- Ensure sufficient contrast for letter outlines and pieces
- Add background elements that suggest "building" (grid lines, ruler marks)
- Keep background visually interesting but not distracting
- Implement as gradient or simple graphics (no heavy assets)

### 3. Display Target Letter Outline
- Get current letter from ContentProvider
- Display large letter outline in center/upper area
- Use stroke-only rendering (outline, not filled)
- Outline should be 200-300px tall (prominent)
- Use thick stroke (8-10px) for high visibility
- Outline color: light gray or dashed line (indicates "to be filled")
- Position outline where completed letter will appear
- Add letter identification text above outline (e.g., "Build the letter A")
- Ensure outline is centered and well-positioned

### 4. Create Letter Pieces Area
- Designate bottom 1/3 of screen as "pieces area"
- Add visual separator (horizontal line or color change)
- This area will hold draggable letter pieces (implemented in Phase 30)
- Add placeholder text: "Drag pieces here to build the letter"
- Ensure adequate spacing for 2-4 pieces
- Consider piece arrangement (side-by-side, slight overlap)

### 5. Implement UI Header
- Add header bar at top of screen
- Display game title: "Letter Builder"
- Add progress indicator (e.g., "Letter 1 of 5")
- Show current score or stars earned
- Use consistent font and styling with other mini-games
- Ensure header doesn't obscure letter outline

### 6. Add Back to Menu Button
- Create "Back" or "Menu" button in top-left corner
- Use house icon or "←" arrow
- Make button large enough for easy clicking (ADHD-friendly: 60x60px minimum)
- Implement hover effect (scale up)
- Implement click handler to return to MainMenuScene
- Add confirmation dialog (optional for Phase 29, required for Phase 32)
- Play button click sound
- Ensure smooth scene transition

### 7. Add Scene Entry Animation
- Implement fade-in effect when scene loads
- Animate letter outline appearance (scale from 0 to 1)
- Stagger UI element appearances for polished feel
- Total entry animation: 500-800ms
- Ensure animations don't delay interaction (can be interrupted)

### 8. Implement Basic Scene State Management
- Create state variables: currentLetter, piecesPlaced, roundProgress
- Initialize game state in create() method
- Set up letter progression system (5 letters per round)
- Prepare for piece tracking (will be implemented in Phase 30-31)
- Store references to key UI elements for later updates

## Implementation Details

### LetterBuilderScene Structure
```javascript
class LetterBuilderScene extends Phaser.Scene {
    constructor() {
        super({ key: 'LetterBuilderScene' });
        this.currentLetter = null;
        this.currentLetterIndex = 0;
        this.totalLetters = 5;
        this.score = 0;
        this.letterPieces = [];
        this.letterOutline = null;
    }

    preload() {
        // Load any necessary assets
        // Particle textures, button icons, etc.
    }

    create() {
        // Create background
        this.createBackground();

        // Create UI header
        this.createHeader();

        // Create back button
        this.createBackButton();

        // Load first letter
        this.loadNextLetter();

        // Create pieces area
        this.createPiecesArea();

        // Entry animation
        this.playEntryAnimation();
    }

    createBackground() {
        // Warm gradient background (construction theme)
        const graphics = this.add.graphics();

        // Gradient from warm yellow to soft orange
        const colorTop = Phaser.Display.Color.ValueToColor(0xFFE5B4);
        const colorBottom = Phaser.Display.Color.ValueToColor(0xFFD4A3);

        for (let i = 0; i < 600; i++) {
            const color = Phaser.Display.Color.Interpolate.ColorWithColor(
                colorTop,
                colorBottom,
                600,
                i
            );
            graphics.fillStyle(Phaser.Display.Color.GetColor(color.r, color.g, color.b));
            graphics.fillRect(0, i, 800, 1);
        }

        // Add subtle grid lines (construction theme)
        graphics.lineStyle(1, 0xDDDDDD, 0.3);
        for (let x = 0; x < 800; x += 50) {
            graphics.lineBetween(x, 0, x, 600);
        }
        for (let y = 0; y < 600; y += 50) {
            graphics.lineBetween(0, y, 800, y);
        }
    }

    createHeader() {
        // Header background
        const headerBg = this.add.rectangle(400, 30, 800, 60, 0x8B4513, 0.3);

        // Title
        this.add.text(400, 30, 'Letter Builder', {
            fontSize: '32px',
            fontFamily: 'Arial, sans-serif',
            color: '#ffffff',
            stroke: '#8B4513',
            strokeThickness: 4,
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Progress indicator
        this.progressText = this.add.text(700, 30, '1/5', {
            fontSize: '24px',
            fontFamily: 'Arial, sans-serif',
            color: '#ffffff',
            stroke: '#8B4513',
            strokeThickness: 3
        }).setOrigin(0.5);
    }

    createBackButton() {
        // Back button (house icon or arrow)
        const backButton = this.add.rectangle(50, 30, 60, 60, 0x8B4513);
        backButton.setStrokeStyle(3, 0xFFFFFF);

        const backIcon = this.add.text(50, 30, '←', {
            fontSize: '36px',
            color: '#ffffff'
        }).setOrigin(0.5);

        // Make interactive
        backButton.setInteractive({ useHandCursor: true });

        // Hover effect
        backButton.on('pointerover', () => {
            this.tweens.add({
                targets: [backButton, backIcon],
                scale: 1.1,
                duration: 200,
                ease: 'Power2'
            });
        });

        backButton.on('pointerout', () => {
            this.tweens.add({
                targets: [backButton, backIcon],
                scale: 1.0,
                duration: 200,
                ease: 'Power2'
            });
        });

        // Click handler
        backButton.on('pointerdown', () => {
            this.sound.play('buttonClick', { volume: 0.5 });
            this.tweens.add({
                targets: [backButton, backIcon],
                scale: 0.9,
                duration: 100,
                yoyo: true,
                onComplete: () => {
                    this.scene.start('MainMenuScene');
                }
            });
        });
    }

    loadNextLetter() {
        // Get letter from ContentProvider
        const letterData = window.contentProvider.getRandomLetter();
        this.currentLetter = letterData;
        this.currentLetterIndex++;

        // Update progress
        this.progressText.setText(`${this.currentLetterIndex}/${this.totalLetters}`);

        // Create letter outline
        this.createLetterOutline();

        // Add instruction text
        this.createInstructionText();
    }

    createLetterOutline() {
        // Instruction text
        this.add.text(400, 100, `Build the letter ${this.currentLetter.letter}`, {
            fontSize: '28px',
            fontFamily: 'Arial, sans-serif',
            color: '#8B4513',
            stroke: '#ffffff',
            strokeThickness: 3,
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Large letter outline (will be filled by pieces)
        this.letterOutline = this.add.text(400, 250, this.currentLetter.letter, {
            fontSize: '200px',
            fontFamily: 'Arial, sans-serif',
            color: 'transparent',
            stroke: '#CCCCCC',
            strokeThickness: 10
        }).setOrigin(0.5);

        // Set initial scale to 0 for animation
        this.letterOutline.setScale(0);
    }

    createPiecesArea() {
        // Separator line
        const separator = this.add.rectangle(400, 420, 800, 4, 0x8B4513, 0.5);

        // Pieces area background (slightly different shade)
        const piecesAreaBg = this.add.rectangle(400, 510, 800, 180, 0xFFE5B4, 0.3);

        // Placeholder text (will be replaced with actual pieces in Phase 30)
        this.add.text(400, 510, 'Drag pieces to build the letter', {
            fontSize: '20px',
            fontFamily: 'Arial, sans-serif',
            color: '#8B4513',
            alpha: 0.6
        }).setOrigin(0.5);
    }

    createInstructionText() {
        // Additional instruction text in pieces area
        this.instructionText = this.add.text(400, 460, 'Pieces will appear here', {
            fontSize: '18px',
            fontFamily: 'Arial, sans-serif',
            color: '#8B4513',
            alpha: 0.5,
            align: 'center'
        }).setOrigin(0.5);
    }

    playEntryAnimation() {
        // Fade in scene
        this.cameras.main.fadeIn(300, 255, 229, 180);

        // Animate letter outline
        this.tweens.add({
            targets: this.letterOutline,
            scale: 1,
            duration: 500,
            ease: 'Back.easeOut',
            delay: 300
        });
    }

    update() {
        // Game loop (will be used in later phases)
    }
}
```

### Background Theme Options
```javascript
// Option 1: Warm woodworking theme
const colors = {
    top: 0xFFE5B4,    // Light peach
    bottom: 0xFFD4A3  // Soft orange
};

// Option 2: Craft table theme
const colors = {
    top: 0xE6F3FF,    // Light blue (paper)
    bottom: 0xD4E9FF  // Soft blue
};

// Option 3: Chalkboard theme
const colors = {
    top: 0x2C5F2D,    // Dark green
    bottom: 0x1F4620  // Darker green
};

// Recommendation: Use warm woodworking theme (Option 1)
// - Distinctive from Letter Pop (blue sky) and Word Catch (gradient)
// - Warm colors are inviting and comfortable
// - Suggests construction/building metaphor
```

### Letter Outline Rendering Considerations
```javascript
// Approach 1: Text with stroke, no fill (simple, current approach)
const outline = this.add.text(x, y, letter, {
    fontSize: '200px',
    color: 'transparent',  // No fill
    stroke: '#CCCCCC',     // Gray outline
    strokeThickness: 10
});

// Approach 2: Graphics API (more control, more complex)
// Draw letter path with stroke only
// Requires letter path data (Bezier curves)
// More complex but allows for custom styling

// Approach 3: SVG sprite (most flexible)
// Use SVG letter outlines as sprites
// Can have dashed lines, custom styling
// Requires asset generation

// Recommendation: Start with Approach 1 (text stroke)
// - Simple and fast to implement
// - Good browser compatibility
// - Can enhance in Phase 32 if needed
```

## Acceptance Criteria
- [ ] LetterBuilderScene.js file created and registered
- [ ] Scene loads without errors when started
- [ ] Unique background displays (warm colors, construction theme)
- [ ] Background is visually distinct from Letter Pop and Word Catch
- [ ] Current target letter outline displays prominently (200-300px)
- [ ] Letter outline is stroke-only (not filled)
- [ ] Instruction text displays: "Build the letter X"
- [ ] Progress indicator shows current letter (e.g., "1/5")
- [ ] Pieces area is designated at bottom of screen
- [ ] Visual separator between outline area and pieces area
- [ ] Back button displays in top-left corner
- [ ] Back button has hover effect (scale up)
- [ ] Back button returns to MainMenuScene when clicked
- [ ] Back button plays click sound
- [ ] Scene transition is smooth (no errors)
- [ ] Entry animation plays (fade-in, outline scale-in)
- [ ] Scene state initializes correctly (currentLetter, progress, etc.)
- [ ] No console errors or warnings

## Testing Steps
1. Launch game and navigate to Letter Builder from menu
2. Verify LetterBuilderScene loads successfully
3. Check background appearance:
   - Warm colors displayed
   - Gradient is smooth
   - Grid lines or theme elements visible
   - Distinct from other mini-games
4. Check letter outline:
   - Large and prominent (200-300px)
   - Stroke-only (not filled)
   - Centered properly
   - Gray or light color
5. Check UI elements:
   - Title "Letter Builder" at top
   - Progress indicator (e.g., "1/5") visible
   - Instruction text: "Build the letter X"
   - Pieces area designated
6. Test back button:
   - Hover: button scales up
   - Click: button scales down, sound plays
   - Scene transitions to MainMenuScene
   - No errors in console
7. Check entry animation:
   - Scene fades in smoothly
   - Letter outline scales from 0 to 1
   - Animation timing feels polished (500-800ms total)
8. Verify state initialization:
   - Current letter loads from ContentProvider
   - Progress starts at 1/5
   - No undefined variables in console
9. Test multiple letters:
   - Manually trigger loadNextLetter() in console
   - Verify progress updates (2/5, 3/5, etc.)
   - Verify different letters display correctly
10. Check browser console for any errors or warnings

## Estimated Time
1 hour

## Dependencies
- Phaser 3 game engine
- ContentProvider with letter data
- MainMenuScene functional
- Scene management system established
- Audio system (for button clicks)
- Button click sound asset

## Risks
- **Letter outline rendering**: Some fonts might not stroke properly
  - Mitigation: Test multiple fonts, use web-safe font (Arial, sans-serif)
- **Background performance**: Complex gradients might impact framerate
  - Mitigation: Pre-render to texture, use simple gradient
- **ContentProvider integration**: Letter data might be missing
  - Mitigation: Add fallback letter data, handle missing letters gracefully
- **Scene transition**: Might not work if MainMenuScene isn't updated
  - Mitigation: Update menu to include Letter Builder button
- **Color accessibility**: Some users might need higher contrast
  - Mitigation: Test contrast ratios, add settings option later

## ADHD-Friendly Design Considerations
- **Large interactive elements**: Back button is 60x60px, easy to hit
- **Clear visual hierarchy**: Title, instruction, outline, pieces area all distinct
- **Immediate feedback**: Hover effects happen instantly (<200ms)
- **Simple layout**: No clutter, clear purpose for each screen area
- **Warm colors**: Inviting and calming, not overstimulating
- **Visual structure**: Grid lines provide subtle structure without being rigid
- **Progress visibility**: Always know "where am I" (1/5, 2/5, etc.)
- **Single task focus**: One letter at a time, clear objective

## Notes
- **Keep it simple**: Phase 29 is just setup, don't over-engineer
- **Visual identity**: Background theme should feel like "building/construction"
- **Outline clarity**: Must be obvious this is a "template" to be filled
- **Pieces area**: Reserve space now, implement pieces in Phase 30
- **State management**: Set up architecture for piece tracking (Phase 30-31)
- **Animation polish**: Entry animation sets professional tone
- **Test early**: Verify scene loads and displays before moving to Phase 30
- **Asset preparation**: If using custom assets (icons, textures), prepare now

## Completion Checklist
- [ ] LetterBuilderScene.js created and functional
- [ ] Scene registered in game configuration
- [ ] Unique background implemented and displays correctly
- [ ] Letter outline displays prominently
- [ ] UI header with title and progress created
- [ ] Back button implemented with full functionality
- [ ] Pieces area designated at bottom of screen
- [ ] Entry animation implemented and polished
- [ ] Scene state management initialized
- [ ] All acceptance criteria met
- [ ] Tested in browser (no errors)
- [ ] Back button navigation verified
- [ ] Ready to proceed to Phase 30 (draggable pieces)
