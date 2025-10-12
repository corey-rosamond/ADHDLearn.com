# Phase 6: Letter Pop - Scene Setup

## Goal
Create the basic visual structure for the Letter Pop game scene with colorful background and navigation

## Context
This phase establishes the foundation for the Letter Pop mini-game. We need to:
1. Create a new scene that players can access from the main menu
2. Design an engaging, colorful environment appropriate for children
3. Provide clear navigation back to the main menu
4. Set up the visual foundation for bubble gameplay (Phase 7+)

## Prerequisites
- Phase 1-5 completed
- MainMenuScene transitions to LetterPopScene
- Basic Phaser scene structure understood
- Game config includes LetterPopScene registration

## Tasks

### 1. Create LetterPopScene.js
- Create new file: `src/scenes/LetterPopScene.js`
- Extend Phaser.Scene class
- Set scene key to 'LetterPopScene'
- Implement constructor, preload, and create methods
- Register scene in main game config

### 2. Add Colorful Background
- Create vibrant, child-friendly background
- Use gradient or solid bright colors
- Different from MainMenuScene (visual variety)
- Consider: blue sky, rainbow gradient, or playful pattern
- Ensure good contrast for white bubbles (coming in Phase 7)

### 3. Display "Letter Pop!" Title
- Add game title text at top of screen
- Position: centered, y=80-100
- Font size: 48-64px (large and readable)
- Color: white with stroke for visibility
- Style: playful, bold, inviting
- Consider adding subtle animation (optional for this phase)

### 4. Add "Back to Menu" Button
- Create button in top-left or bottom-center
- Similar style to MainMenuScene START button
- Clear label: "Back to Menu" or "< Menu"
- Interactive with hover effects
- Click returns to MainMenuScene
- Consistent button styling across game

## Implementation Details

### LetterPopScene Structure
```javascript
class LetterPopScene extends Phaser.Scene {
    constructor() {
        super({ key: 'LetterPopScene' });
    }

    preload() {
        // Load any assets needed (button sounds, etc.)
        // Can reuse assets from MainMenuScene
        if (!this.sound.get('buttonClick')) {
            this.load.audio('buttonClick', 'assets/audio/button-click.mp3');
        }
    }

    create() {
        // Create colorful background
        this.createBackground();

        // Add game title
        this.createTitle();

        // Create back button
        this.createBackButton();

        // Placeholder for future game elements
        // (Bubbles will be added in Phase 7)
    }

    createBackground() {
        // Option 1: Gradient background
        const graphics = this.add.graphics();

        // Sky blue to light cyan gradient
        const colors = [0x87CEEB, 0x00CED1]; // Sky blue to turquoise
        const height = this.cameras.main.height;

        for (let i = 0; i < height; i++) {
            const progress = i / height;
            const color = Phaser.Display.Color.Interpolate.ColorWithColor(
                Phaser.Display.Color.ValueToColor(colors[0]),
                Phaser.Display.Color.ValueToColor(colors[1]),
                100,
                progress * 100
            );
            graphics.fillStyle(Phaser.Display.Color.GetColor(color.r, color.g, color.b));
            graphics.fillRect(0, i, this.cameras.main.width, 1);
        }

        // Option 2: Simple solid color
        // this.cameras.main.setBackgroundColor('#87CEEB');
    }

    createTitle() {
        // Main game title
        this.add.text(400, 80, 'Letter Pop!', {
            fontSize: '64px',
            fontFamily: 'Arial',
            color: '#ffffff',
            fontStyle: 'bold',
            stroke: '#0066cc',
            strokeThickness: 8
        }).setOrigin(0.5);

        // Optional subtitle
        this.add.text(400, 140, 'Pop the bubbles to learn letters!', {
            fontSize: '24px',
            fontFamily: 'Arial',
            color: '#ffffff',
            stroke: '#0066cc',
            strokeThickness: 4
        }).setOrigin(0.5);
    }

    createBackButton() {
        // Create button background
        const buttonBg = this.add.rectangle(100, 50, 150, 60, 0xff6b6b);
        buttonBg.setStrokeStyle(3, 0xffffff);

        // Create button text
        const buttonText = this.add.text(100, 50, '< Menu', {
            fontSize: '24px',
            fontFamily: 'Arial',
            color: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Make interactive
        buttonBg.setInteractive({ useHandCursor: true });

        // Hover effects
        buttonBg.on('pointerover', () => {
            this.tweens.add({
                targets: [buttonBg, buttonText],
                scaleX: 1.1,
                scaleY: 1.1,
                duration: 200,
                ease: 'Power2'
            });
        });

        buttonBg.on('pointerout', () => {
            this.tweens.add({
                targets: [buttonBg, buttonText],
                scaleX: 1.0,
                scaleY: 1.0,
                duration: 200,
                ease: 'Power2'
            });
        });

        // Click handler
        buttonBg.on('pointerdown', () => {
            // Play sound if available
            if (this.sound.get('buttonClick')) {
                this.sound.play('buttonClick');
            }

            // Scale down animation
            this.tweens.add({
                targets: [buttonBg, buttonText],
                scaleX: 0.95,
                scaleY: 0.95,
                duration: 100,
                yoyo: true,
                onComplete: () => {
                    // Return to main menu
                    this.scene.start('MainMenuScene');
                }
            });
        });
    }
}
```

### Alternative Back Button (Bottom Center)
```javascript
createBackButton() {
    // Position at bottom center for easier access
    const x = 400;
    const y = 550;

    const buttonBg = this.add.rectangle(x, y, 200, 60, 0xff6b6b);
    buttonBg.setStrokeStyle(3, 0xffffff);

    const buttonText = this.add.text(x, y, 'Back to Menu', {
        fontSize: '24px',
        fontFamily: 'Arial',
        color: '#ffffff',
        fontStyle: 'bold'
    }).setOrigin(0.5);

    // ... rest of button implementation same as above
}
```

### Registering Scene in config.js
```javascript
// In config.js, update scene array
import MainMenuScene from './scenes/MainMenuScene.js';
import LetterPopScene from './scenes/LetterPopScene.js';

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game-container',
    scene: [MainMenuScene, LetterPopScene], // Scene order
    // ... other config options
};
```

## Acceptance Criteria
- [ ] LetterPopScene.js file created in src/scenes/
- [ ] Scene transitions successfully from MainMenuScene
- [ ] Colorful background displays (different from main menu)
- [ ] "Letter Pop!" title is visible and centered at top
- [ ] Title has appropriate styling (large, bold, stroked)
- [ ] Back button displays in consistent location
- [ ] Back button has hover effect (scale up)
- [ ] Back button has click effect (scale down)
- [ ] Back button plays sound on click (if available)
- [ ] Back button returns to MainMenuScene successfully
- [ ] Scene has clear visual hierarchy (title, button, space for game)
- [ ] No console errors during scene creation or transitions

## Testing Steps
1. Start game and click START button from main menu
2. Verify LetterPopScene loads without errors
3. Verify colorful background displays
4. Verify "Letter Pop!" title is visible and well-styled
5. Hover over Back button
   - Cursor should change to pointer
   - Button should scale up smoothly
6. Move cursor away from button
   - Button should scale back to normal
7. Click Back button
   - Sound should play (if available)
   - Button should briefly scale down
   - Scene should transition back to MainMenuScene
8. Return to LetterPopScene and repeat
9. Check browser console for any errors
10. Verify transitions are smooth and responsive

## Estimated Time
45 minutes

## Dependencies
- Phaser 3 game instance configured
- MainMenuScene START button triggers transition
- Scene registration in game config
- Optional: button click audio asset

## Risks
- **Color choices**: Ensure background doesn't clash with future bubble colors
- **Button placement**: Top-left might be hard to reach on mobile - consider bottom-center
- **Scene transitions**: Ensure clean teardown of MainMenuScene
- **Consistency**: Button styles should match across scenes

## Design Considerations

### Color Palette
- **Background**: Sky blue to cyan gradient (represents sky/atmosphere where bubbles float)
- **Title**: White with blue stroke (high contrast, readable)
- **Button**: Red/coral color (contrasts with blue, stands out)
- **Future bubbles**: Will use rainbow colors, need to contrast with blue background

### Layout
```
┌─────────────────────────────────┐
│  [< Menu]                       │ ← Top-left back button
│                                 │
│         Letter Pop!             │ ← Title (y=80)
│   Pop the bubbles to learn!    │ ← Subtitle (y=140)
│                                 │
│                                 │
│     [Game area for bubbles]     │ ← Center area for gameplay
│                                 │
│                                 │
│                                 │
│                                 │
└─────────────────────────────────┘
```

### ADHD-Friendly Elements
- **Clear title**: Player knows what game they're playing
- **Easy exit**: Back button is obvious and accessible
- **Visual simplicity**: Clean layout, not overwhelming
- **Bright colors**: Engaging but not chaotic
- **Immediate feedback**: Button hover/click animations

## Notes
- This phase is visual setup only - no game logic yet
- Keep it simple and clean
- Focus on creating a welcoming, playful environment
- Background should complement future bubble colors (Phase 7+)
- Button patterns established here will be reused in other scenes
- Consider mobile users: buttons should be easy to tap
- Scene should load quickly (minimal assets)

## Completion Checklist
- [ ] LetterPopScene.js created
- [ ] Scene class properly structured
- [ ] Background implemented and colorful
- [ ] Title text added and styled
- [ ] Back button created with full interaction
- [ ] Scene registered in game config
- [ ] All acceptance criteria met
- [ ] Tested scene transitions (to and from MainMenu)
- [ ] No console errors
- [ ] Code is clean and commented
- [ ] Ready to proceed to Phase 7 (add bubble)
