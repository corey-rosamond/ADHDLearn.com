# Phase 2: Basic Scene System

## Goal
Implement proper Phaser scene structure with scene transitions: Boot → Preload → MainMenu

## Context
Phase 1 proved Phaser works with an inline scene. Now we need to:
1. Create separate scene classes following Phaser best practices
2. Implement automatic scene transitions
3. Set up the foundation for asset loading
4. Create a simple main menu as the destination

This establishes the architectural pattern for all future scenes.

## Prerequisites
- Phase 1 completed successfully
- Phaser 3 loading from CDN
- Game instance rendering to canvas

## Tasks

### 1. Create BootScene.js
- Create `/src/scenes/BootScene.js`
- Extend `Phaser.Scene` class
- Add constructor with scene key 'Boot'
- Implement `create()` method
- Log "BootScene started" to console
- Transition to PreloadScene after 1 second

### 2. Create PreloadScene.js
- Create `/src/scenes/PreloadScene.js`
- Extend `Phaser.Scene` class
- Add constructor with scene key 'Preload'
- Implement `create()` method
- Add loading text display
- Log "PreloadScene started" to console
- Transition to MainMenuScene after 2 seconds

### 3. Create MainMenuScene.js
- Create `/src/scenes/MainMenuScene.js`
- Extend `Phaser.Scene` class
- Add constructor with scene key 'MainMenu'
- Implement `create()` method
- Display "Aurora's Letter Adventure" title
- Display "Press to Start" instruction text
- Log "MainMenuScene started" to console

### 4. Update config.js
- Import all three scene classes
- Remove inline scene definition
- Add scenes array with [BootScene, PreloadScene, MainMenuScene]
- Keep other config settings unchanged

### 5. Update index.html
- Add script tags for all three scenes
- Load scenes before config.js
- Maintain proper loading order

## Implementation Details

### BootScene.js Structure
```javascript
class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'Boot' });
    }

    create() {
        console.log('BootScene started');

        // Display boot message
        this.add.text(400, 300, 'Initializing...', {
            fontSize: '24px',
            color: '#ffffff'
        }).setOrigin(0.5);

        // Transition to Preload after 1 second
        this.time.delayedCall(1000, () => {
            this.scene.start('Preload');
        });
    }
}
```

### PreloadScene.js Structure
```javascript
class PreloadScene extends Phaser.Scene {
    constructor() {
        super({ key: 'Preload' });
    }

    create() {
        console.log('PreloadScene started');

        // Display loading message
        this.add.text(400, 300, 'Loading...', {
            fontSize: '32px',
            color: '#ffffff'
        }).setOrigin(0.5);

        // In future phases, assets will be loaded here
        // For now, just transition to MainMenu
        this.time.delayedCall(2000, () => {
            this.scene.start('MainMenu');
        });
    }
}
```

### MainMenuScene.js Structure
```javascript
class MainMenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainMenu' });
    }

    create() {
        console.log('MainMenuScene started');

        // Title
        this.add.text(400, 200, "Aurora's Letter Adventure", {
            fontSize: '40px',
            color: '#ffff00',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Instruction text
        this.add.text(400, 400, 'Press to Start', {
            fontSize: '24px',
            color: '#ffffff'
        }).setOrigin(0.5);

        // Note: Click handling will be added in Phase 3
    }
}
```

### Updated config.js
```javascript
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game-container',
    backgroundColor: '#4488ff',
    scene: [BootScene, PreloadScene, MainMenuScene]
};

const game = new Phaser.Game(config);
```

### Updated index.html (script section)
```html
<!-- Phaser library -->
<script src="https://cdn.jsdelivr.net/npm/phaser@3.80.1/dist/phaser.js"></script>

<!-- Game scenes (load before config) -->
<script src="src/scenes/BootScene.js"></script>
<script src="src/scenes/PreloadScene.js"></script>
<script src="src/scenes/MainMenuScene.js"></script>

<!-- Game configuration (load last) -->
<script src="src/config.js"></script>
```

## Acceptance Criteria
- [ ] BootScene.js created in `/src/scenes/` folder
- [ ] PreloadScene.js created in `/src/scenes/` folder
- [ ] MainMenuScene.js created in `/src/scenes/` folder
- [ ] config.js updated to use scene classes
- [ ] index.html updated to load all scenes
- [ ] Game launches with BootScene first
- [ ] BootScene displays "Initializing..." text
- [ ] BootScene transitions to PreloadScene after 1 second
- [ ] PreloadScene displays "Loading..." text
- [ ] PreloadScene transitions to MainMenuScene after 2 seconds
- [ ] MainMenuScene displays "Aurora's Letter Adventure" title
- [ ] MainMenuScene displays "Press to Start" instruction
- [ ] Console logs confirm each scene starts
- [ ] No JavaScript errors in console
- [ ] All transitions are automatic

## Testing Steps
1. Open browser console (F12) before loading game
2. Open/refresh index.html
3. Verify console shows "BootScene started"
4. Verify "Initializing..." appears on screen
5. Wait 1 second
6. Verify console shows "PreloadScene started"
7. Verify "Loading..." appears on screen
8. Wait 2 seconds
9. Verify console shows "MainMenuScene started"
10. Verify title and instruction text appear
11. Check console for any errors
12. Test in Chrome and Firefox

## Estimated Time
1 hour

## Dependencies
- Phase 1 completed

## Risks
- **Scene registration order**: Scenes must be loaded before config.js
- **Scene key typos**: Scene keys must match exactly in transitions
- **Class syntax errors**: ES6 class syntax must be correct
- **Timing issues**: DelayedCall might not work as expected

## Notes
- This establishes the scene pattern for the entire game
- All future scenes will follow this structure
- Boot scene is where we'll initialize game data later
- Preload scene will handle all asset loading in future phases
- MainMenu will become interactive in Phase 3
- Scene transitions are automatic for now (no user input)

## Scene Lifecycle
Understanding the Phaser scene lifecycle:
1. **init()**: Receive data from previous scene
2. **preload()**: Load assets (we'll use in future phases)
3. **create()**: Set up game objects (we're using this)
4. **update()**: Game loop (not needed yet)

For Phase 2, we only implement `create()`.

## Completion Checklist
- [ ] All scene files created
- [ ] All scenes extend Phaser.Scene correctly
- [ ] Scene keys are unique and consistent
- [ ] Transitions work smoothly
- [ ] Console logs appear in order
- [ ] Text displays correctly in each scene
- [ ] No console errors
- [ ] Tested in 2+ browsers
- [ ] Ready to proceed to Phase 3

## What's Next (Phase 3)
- Add click/touch input to MainMenu
- Transition from MainMenu to GameScene
- Begin implementing actual gameplay
