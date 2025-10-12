# Phase 5: Main Menu UI

## Goal
Create an interactive start screen with colorful gradient background and START button that transitions to the LetterPopScene

## Context
This phase builds the main menu interface for Aurora's Letter Adventure. The menu needs to be:
1. Visually engaging with colorful gradients
2. Interactive with clear button feedback
3. ADHD-friendly with obvious visual cues
4. Accessible with audio feedback
5. Smooth transition to gameplay

## Prerequisites
- Phase 1-4 completed
- MainMenuScene class structure exists
- Audio assets for button clicks ready (or placeholder)
- LetterPopScene placeholder created

## Tasks

### 1. Create Gradient Background
- Add colorful gradient background to MainMenuScene
- Use multiple vibrant colors appealing to children
- Consider diagonal or radial gradient for visual interest
- Ensure sufficient contrast for text/buttons

### 2. Create START Button
- Create interactive button graphic or text-based button
- Position button prominently in center/lower-center of screen
- Set clear visual styling (border, background, text)
- Make button large enough for easy clicking (ADHD-friendly)

### 3. Implement Hover Animation
- Add pointer cursor change on hover
- Scale up button on hover (grow effect)
- Use Phaser tweens for smooth animation
- Typical scale: 1.0 → 1.1 (10% larger)
- Animation duration: 200-300ms

### 4. Implement Click Handler
- Add click/tap event listener to button
- Play click sound effect on button press
- Trigger scene transition to LetterPopScene
- Optional: button press animation (scale down briefly)

### 5. Create LetterPopScene Placeholder
- Create basic LetterPopScene class if not exists
- Add simple text indicating "Game will be here"
- Ensure scene can be transitioned to from MainMenu

## Implementation Details

### MainMenuScene Structure
```javascript
class MainMenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainMenuScene' });
    }

    preload() {
        // Load button click sound
        this.load.audio('buttonClick', 'assets/audio/button-click.mp3');
    }

    create() {
        // Create gradient background
        this.createGradientBackground();

        // Add game title
        this.add.text(400, 150, "Aurora's Letter Adventure", {
            fontSize: '48px',
            fontFamily: 'Arial',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 6
        }).setOrigin(0.5);

        // Create START button
        this.createStartButton();
    }

    createGradientBackground() {
        // Option 1: Using Graphics object
        const graphics = this.add.graphics();

        // Create gradient colors (example: purple to pink to orange)
        const colors = [0x6B46C1, 0xEC4899, 0xF97316];
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
    }

    createStartButton() {
        // Create button background
        const buttonBg = this.add.rectangle(400, 400, 200, 80, 0x4CAF50);
        buttonBg.setStrokeStyle(4, 0xffffff);

        // Create button text
        const buttonText = this.add.text(400, 400, 'START', {
            fontSize: '36px',
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
            // Play sound
            this.sound.play('buttonClick');

            // Scale down animation
            this.tweens.add({
                targets: [buttonBg, buttonText],
                scaleX: 0.95,
                scaleY: 0.95,
                duration: 100,
                yoyo: true,
                onComplete: () => {
                    // Transition to game scene
                    this.scene.start('LetterPopScene');
                }
            });
        });
    }
}
```

### Button Creation with Phaser (Alternative Simple Approach)
```javascript
// Simple text-based button
const startButton = this.add.text(400, 400, 'START', {
    fontSize: '48px',
    backgroundColor: '#4CAF50',
    padding: { x: 40, y: 20 },
    color: '#ffffff'
}).setOrigin(0.5).setInteractive({ useHandCursor: true });

// Hover animation
startButton.on('pointerover', () => {
    this.tweens.add({
        targets: startButton,
        scale: 1.1,
        duration: 200
    });
});

startButton.on('pointerout', () => {
    this.tweens.add({
        targets: startButton,
        scale: 1.0,
        duration: 200
    });
});

// Click handler
startButton.on('pointerdown', () => {
    this.sound.play('buttonClick');
    this.scene.start('LetterPopScene');
});
```

### LetterPopScene Placeholder
```javascript
class LetterPopScene extends Phaser.Scene {
    constructor() {
        super({ key: 'LetterPopScene' });
    }

    create() {
        // Simple placeholder
        this.add.text(400, 300, 'Letter Pop Game\nComing Soon!', {
            fontSize: '36px',
            color: '#ffffff',
            align: 'center'
        }).setOrigin(0.5);

        // Back button for testing
        const backButton = this.add.text(400, 500, 'Back to Menu', {
            fontSize: '24px',
            backgroundColor: '#666666',
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        backButton.on('pointerdown', () => {
            this.scene.start('MainMenuScene');
        });
    }
}
```

## Acceptance Criteria
- [ ] MainMenuScene displays colorful gradient background
- [ ] Game title "Aurora's Letter Adventure" is visible and centered
- [ ] START button is prominently displayed
- [ ] Button shows visual feedback on hover (scales up)
- [ ] Button shows visual feedback on click (scales down)
- [ ] Cursor changes to pointer/hand on button hover
- [ ] Button click plays sound effect
- [ ] Button click transitions to LetterPopScene
- [ ] LetterPopScene placeholder displays correctly
- [ ] Scene transition is smooth (no errors)
- [ ] All interactions feel responsive (<300ms feedback)

## Testing Steps
1. Open game in browser
2. Verify MainMenuScene loads with gradient background
3. Verify title text is visible and styled correctly
4. Hover over START button
   - Cursor should change to pointer
   - Button should scale up smoothly
5. Move cursor away from button
   - Button should scale back to normal
6. Click START button
   - Sound should play
   - Button should briefly scale down
   - Scene should transition to LetterPopScene
7. Verify LetterPopScene displays placeholder content
8. Test back button returns to MainMenu
9. Check browser console for errors
10. Test on mobile device (touch events)

## Estimated Time
1 hour

## Dependencies
- Phaser 3 game instance configured
- MainMenuScene registered in game config
- Audio asset for button click (or use placeholder)
- LetterPopScene registered in game config

## Risks
- **Audio not loading**: Use try-catch around sound.play(), continue without sound
- **Tween performance**: Keep animations simple, 200-300ms max
- **Touch events**: Ensure button works with both click and touch
- **Scene transition delay**: Pre-load LetterPopScene assets to avoid lag

## ADHD-Friendly Design Considerations
- **Large buttons**: Easy to click, no precision required
- **Immediate feedback**: Hover/click effects happen instantly
- **High contrast**: Button stands out from background
- **Audio feedback**: Confirms action was registered
- **Simple choices**: Only one button, no decision paralysis
- **Visual interest**: Gradient keeps attention without being distracting

## Notes
- Keep gradient colors vibrant but not overwhelming
- Button should be obvious and inviting
- Animation timing crucial for feeling responsive
- This sets the tone for the entire game experience
- If audio fails, visual feedback still indicates interaction
- Consider adding subtle background music later (not in this phase)

## Completion Checklist
- [ ] Gradient background implemented
- [ ] START button created and styled
- [ ] Hover animation working smoothly
- [ ] Click sound playing (or gracefully handling absence)
- [ ] Scene transition to LetterPopScene working
- [ ] LetterPopScene placeholder created
- [ ] All acceptance criteria met
- [ ] Tested with mouse/trackpad
- [ ] Tested with touch events (mobile)
- [ ] No console errors
- [ ] Ready to proceed to Phase 6
