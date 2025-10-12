# Phase 23: Word Catch - Scene Setup

## Goal
Create the foundation for the second mini-game: Word Catch, where Aurora catches falling words with a basket

## Context
This is the beginning of MILESTONE 2: Word Catch Mini-Game. After completing Letter Pop, we're introducing a new game mechanic that focuses on sight word recognition. Word Catch will have a different visual style from Letter Pop to provide variety and maintain engagement. The player controls a basket/net at the bottom of the screen that moves left and right to catch falling words. This phase establishes the scene structure, player controls, and basic movement mechanics.

## Prerequisites
- Phase 1-22 completed
- Letter Pop game fully polished and functional
- Main menu system in place
- Understanding of Phaser physics and input systems

## Tasks

### 1. Create WordCatchScene.js
- Create new file: src/scenes/WordCatchScene.js
- Extend Phaser.Scene
- Implement init(), preload(), create(), and update() methods
- Set scene key: 'WordCatchScene'
- Initialize game state variables (score, lives, level)
- Add scene to game configuration

### 2. Design Unique Background
- Create background different from Letter Pop's bubble theme
- Consider themes: garden, playground, outdoor setting
- Use complementary colors (avoid blue bubble theme)
- Add sky gradient or solid color background
- Add decorative elements (clouds, trees, grass)
- Ensure background doesn't distract from gameplay
- Keep it child-friendly and cheerful

### 3. Create Player Character (Basket/Net)
- Design or create basket sprite/shape
- Basket should be 80-100 pixels wide
- Position basket at bottom of screen (y = 550)
- Center basket horizontally initially (x = 400)
- Add visual indicator (basket opening faces up)
- Consider using Graphics or Sprite
- Add subtle idle animation (gentle wobble/bounce)

### 4. Implement Left/Right Movement - Keyboard
- Add cursor key input handling
- Left arrow moves basket left
- Right arrow moves basket right
- Set movement speed (200-300 pixels/second)
- Keep basket within screen boundaries (padding: 50px)
- Smooth movement (no sudden jumps)
- Add acceleration/deceleration for polish

### 5. Implement Left/Right Movement - Touch
- Add pointer/touch input handling
- Touch left side of screen moves basket left
- Touch right side of screen moves basket right
- Alternative: drag basket with touch
- Divide screen vertically: left 40% = left, right 40% = right, middle 20% = neutral
- Ensure responsive touch on mobile devices
- Add visual feedback for touch zones (optional)

### 6. Integrate Scene with Menu
- Add "Word Catch" button to main menu
- Wire button to launch WordCatchScene
- Ensure scene transition is smooth
- Add back button to return to menu
- Test scene loading and unloading
- Verify no memory leaks on scene change

### 7. Add Basic UI Elements
- Score display (top left)
- Lives/health display (top right)
- Level indicator (top center)
- Pause button
- Back to menu button
- Use consistent font and styling with rest of game

## Implementation Details

### WordCatchScene Structure
```javascript
class WordCatchScene extends Phaser.Scene {
    constructor() {
        super({ key: 'WordCatchScene' });
    }

    init() {
        // Initialize variables
        this.score = 0;
        this.lives = 3;
        this.level = 1;
        this.gameOver = false;
    }

    preload() {
        // Load assets (basket sprite, background elements)
        // Will be minimal for this phase
    }

    create() {
        // Create background
        this.createBackground();

        // Create player basket
        this.createBasket();

        // Setup input controls
        this.setupKeyboardControls();
        this.setupTouchControls();

        // Create UI
        this.createUI();
    }

    update(time, delta) {
        // Handle continuous movement
        this.updateBasketMovement(delta);

        // Keep basket in bounds
        this.constrainBasket();
    }
}
```

### Basket Creation
```javascript
createBasket() {
    // Option 1: Graphics-based basket
    const basket = this.add.graphics();
    basket.fillStyle(0x8B4513, 1); // Brown
    basket.fillRect(-40, 0, 80, 20);
    basket.fillStyle(0xD2691E, 1); // Light brown
    basket.fillRect(-35, 5, 70, 10);

    // Convert to container for easier positioning
    this.basket = this.add.container(400, 550);
    this.basket.add(basket);

    // Add physics (if needed)
    this.physics.add.existing(this.basket);
    this.basket.body.setCollideWorldBounds(true);

    // Add idle animation
    this.tweens.add({
        targets: this.basket,
        y: 545,
        duration: 1000,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
    });
}
```

### Keyboard Controls
```javascript
setupKeyboardControls() {
    this.cursors = this.input.keyboard.createCursorKeys();
    this.basketSpeed = 250; // pixels per second
}

updateBasketMovement(delta) {
    if (this.gameOver) return;

    const speed = this.basketSpeed * (delta / 1000);

    if (this.cursors.left.isDown) {
        this.basket.x -= speed;
    } else if (this.cursors.right.isDown) {
        this.basket.x += speed;
    }

    // Handle touch movement
    if (this.touchMovement) {
        if (this.touchMovement === 'left') {
            this.basket.x -= speed;
        } else if (this.touchMovement === 'right') {
            this.basket.x += speed;
        }
    }
}

constrainBasket() {
    const padding = 50;
    this.basket.x = Phaser.Math.Clamp(
        this.basket.x,
        padding,
        this.cameras.main.width - padding
    );
}
```

### Touch Controls
```javascript
setupTouchControls() {
    this.touchMovement = null;

    this.input.on('pointerdown', (pointer) => {
        if (this.gameOver) return;

        const screenWidth = this.cameras.main.width;
        const leftZone = screenWidth * 0.4;
        const rightZone = screenWidth * 0.6;

        if (pointer.x < leftZone) {
            this.touchMovement = 'left';
        } else if (pointer.x > rightZone) {
            this.touchMovement = 'right';
        }
    });

    this.input.on('pointerup', () => {
        this.touchMovement = null;
    });
}
```

### Background Creation
```javascript
createBackground() {
    // Sky gradient
    const gradient = this.add.graphics();
    gradient.fillGradientStyle(0x87CEEB, 0x87CEEB, 0xE0F6FF, 0xE0F6FF, 1);
    gradient.fillRect(0, 0, 800, 600);

    // Ground
    const ground = this.add.graphics();
    ground.fillStyle(0x90EE90, 1); // Light green
    ground.fillRect(0, 560, 800, 40);

    // Decorative clouds
    this.add.circle(150, 100, 30, 0xFFFFFF, 0.8);
    this.add.circle(180, 110, 40, 0xFFFFFF, 0.8);
    this.add.circle(650, 80, 35, 0xFFFFFF, 0.8);
    this.add.circle(680, 90, 30, 0xFFFFFF, 0.8);
}
```

## Acceptance Criteria
- [ ] WordCatchScene.js created and properly structured
- [ ] Scene loads from main menu without errors
- [ ] Background is visually distinct from Letter Pop
- [ ] Background uses different color scheme (no blue bubbles)
- [ ] Player basket/net renders at bottom of screen
- [ ] Basket is appropriately sized (visible but not oversized)
- [ ] Left arrow key moves basket left smoothly
- [ ] Right arrow key moves basket right smoothly
- [ ] Basket stays within screen boundaries (doesn't go off-screen)
- [ ] Touch left side of screen moves basket left
- [ ] Touch right side of screen moves basket right
- [ ] Touch controls work on mobile devices
- [ ] Controls are responsive (no lag)
- [ ] Movement feels smooth (no jitter)
- [ ] Can return to main menu from scene
- [ ] Basic UI elements display (score, lives)
- [ ] No console errors
- [ ] Scene transitions are smooth

## Testing Steps

### Scene Setup Testing
1. Launch game
2. Navigate to main menu
3. Click "Word Catch" button
4. Verify scene loads successfully
5. Check background renders properly
6. Verify basket appears at bottom center
7. Check console for errors

### Keyboard Controls Testing
1. Press left arrow key
2. Verify basket moves left smoothly
3. Hold left arrow and verify continuous movement
4. Release and verify basket stops
5. Press right arrow key
6. Verify basket moves right smoothly
7. Test rapid left-right alternation
8. Move basket to left edge - verify it stops at boundary
9. Move basket to right edge - verify it stops at boundary

### Touch Controls Testing
1. Tap left side of screen
2. Verify basket moves left
3. Hold touch and verify continuous movement
4. Release and verify basket stops
5. Tap right side of screen
6. Verify basket moves right
7. Test on mobile device or touch screen
8. Verify responsive on different screen sizes
9. Test edge boundaries with touch controls

### Visual Testing
1. Verify background is distinct from Letter Pop
2. Check color scheme is pleasant and different
3. Verify basket is clearly visible
4. Check basket size is appropriate
5. Verify UI elements are readable
6. Test at different window sizes
7. Verify no visual glitches during movement

### Integration Testing
1. Start from main menu
2. Enter Word Catch scene
3. Test controls
4. Return to main menu
5. Re-enter Word Catch scene
6. Verify scene resets properly
7. Check for memory leaks (repeat 10+ times)

## Estimated Time
1.5 hours

## Dependencies
- Phase 1-22 completed
- Main menu system functional
- Phaser 3 scene management understanding
- Input system (keyboard and touch) knowledge

## Risks
- **Touch controls may feel unresponsive**: Different devices have varying touch sensitivity
  - Mitigation: Test on multiple devices, adjust movement speed as needed
- **Basket movement may feel too fast or too slow**: Speed needs to match game difficulty
  - Mitigation: Make speed easily adjustable, test with user
- **Background may be too busy**: Distracting from gameplay
  - Mitigation: Keep background simple, use muted colors
- **Scene transitions may lag**: Loading assets can cause delays
  - Mitigation: Preload assets in boot scene, use loading indicators
- **Input conflicts**: Keyboard and touch may interfere with each other
  - Mitigation: Proper event handling, test both input methods simultaneously

## Notes
- **Keep it simple**: This phase is foundation only, no falling words yet
- **Different aesthetic**: Word Catch should feel like a different game from Letter Pop
- **Control feel is critical**: Movement must feel responsive and smooth
- **Test on target device**: If game is for tablet, test on tablet
- **Consider accessibility**: Controls should work for young children
- **Future-proof**: Structure code to easily add falling word mechanics in Phase 24
- **No gameplay yet**: This phase is just movement and setup
- **Polish later**: Focus on functionality first, polish in later phases

## Completion Checklist
- [ ] WordCatchScene.js created in src/scenes/
- [ ] Scene added to game configuration
- [ ] Background created and distinct from Letter Pop
- [ ] Basket/net sprite created and positioned
- [ ] Keyboard controls implemented (left/right arrows)
- [ ] Touch controls implemented (left/right zones)
- [ ] Basket constrained to screen boundaries
- [ ] Movement is smooth and responsive
- [ ] Basic UI elements added (score, lives)
- [ ] Menu integration completed
- [ ] Back button functional
- [ ] All acceptance criteria met
- [ ] All testing steps completed
- [ ] No console errors
- [ ] Controls tested on keyboard and touch device
- [ ] Aurora tested controls and found them responsive
- [ ] Ready to proceed to Phase 24
