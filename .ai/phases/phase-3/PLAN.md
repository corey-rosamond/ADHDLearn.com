# Phase 3: Asset Loading Infrastructure

## Goal
Implement robust asset loading with visual progress feedback and verify loaded assets display correctly

## Context
Phase 3 establishes the asset loading system that will be used throughout the game. We need to:
1. Add test assets (image and audio) to the project
2. Implement PreloadScene with a progress bar
3. Load and display test assets to verify the system works
4. Provide visual feedback during loading

This phase proves our asset loading pipeline works before we add real game assets.

## Prerequisites
- Phase 1 completed (Phaser running)
- Phase 2 completed (Scene management working)

## Tasks

### 1. Add Test Assets
Create test assets in the appropriate folders:
```
/assets
├── /images
│   └── test-image.png (simple 200x200 colored square or circle)
└── /audio
    └── test-sound.mp3 (short beep or click sound)
```

**Options for Test Assets:**
- Create simple placeholder image (solid color, 200x200px)
- Use royalty-free test image
- Record/download short test audio clip
- Can use data URIs for testing if needed

### 2. Create PreloadScene Class
Create `/src/scenes/PreloadScene.js`:

```javascript
class PreloadScene extends Phaser.Scene {
    constructor() {
        super({ key: 'PreloadScene' });
    }

    preload() {
        // Create progress bar graphics
        this.createProgressBar();

        // Load test assets
        this.load.image('testImage', 'assets/images/test-image.png');
        this.load.audio('testSound', 'assets/audio/test-sound.mp3');

        // Progress event listeners
        this.load.on('progress', this.updateProgressBar, this);
        this.load.on('complete', this.loadComplete, this);
    }

    create() {
        // Transition to MainScene after brief delay
        this.time.delayedCall(500, () => {
            this.scene.start('MainScene');
        });
    }

    createProgressBar() {
        // Progress bar background
        const width = 400;
        const height = 30;
        const x = (this.cameras.main.width - width) / 2;
        const y = this.cameras.main.height / 2;

        // Graphics for progress bar
        this.progressBar = this.add.graphics();
        this.progressBox = this.add.graphics();

        // Draw progress box (border)
        this.progressBox.fillStyle(0x222222, 0.8);
        this.progressBox.fillRect(x, y, width, height);

        // Loading text
        this.loadingText = this.add.text(
            this.cameras.main.width / 2,
            y - 50,
            'Loading...',
            { fontSize: '24px', color: '#ffffff' }
        ).setOrigin(0.5);

        // Percentage text
        this.percentText = this.add.text(
            this.cameras.main.width / 2,
            y + 50,
            '0%',
            { fontSize: '18px', color: '#ffffff' }
        ).setOrigin(0.5);
    }

    updateProgressBar(value) {
        // Update progress bar fill
        const width = 400;
        const height = 30;
        const x = (this.cameras.main.width - width) / 2;
        const y = this.cameras.main.height / 2;

        this.progressBar.clear();
        this.progressBar.fillStyle(0x00ff00, 1);
        this.progressBar.fillRect(x, y, width * value, height);

        // Update percentage text
        this.percentText.setText(Math.floor(value * 100) + '%');
    }

    loadComplete() {
        this.loadingText.setText('Complete!');
        console.log('Assets loaded successfully');
    }
}
```

### 3. Update MainScene to Display Loaded Asset
Modify `/src/scenes/MainScene.js` to display the test image:

```javascript
class MainScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainScene' });
    }

    create() {
        // Display test image to verify it loaded
        const testImage = this.add.image(400, 300, 'testImage');
        testImage.setOrigin(0.5);

        // Add text label
        this.add.text(400, 500, 'Test Image Loaded Successfully!', {
            fontSize: '24px',
            color: '#ffffff'
        }).setOrigin(0.5);

        // Optional: Add click handler to play test sound
        testImage.setInteractive();
        testImage.on('pointerdown', () => {
            this.sound.play('testSound');
        });

        // Add instruction text
        this.add.text(400, 550, '(Click image to play test sound)', {
            fontSize: '16px',
            color: '#cccccc'
        }).setOrigin(0.5);
    }
}
```

### 4. Update Config to Use PreloadScene
Modify `/src/config.js` to start with PreloadScene:

```javascript
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game-container',
    backgroundColor: '#4488ff',
    scene: [PreloadScene, MainScene]
};

const game = new Phaser.Game(config);
```

### 5. Update index.html
Add PreloadScene script tag:

```html
<script src="https://cdn.jsdelivr.net/npm/phaser@3.80.1/dist/phaser.js"></script>
<script src="src/scenes/PreloadScene.js"></script>
<script src="src/scenes/MainScene.js"></script>
<script src="src/config.js"></script>
```

### 6. Test Asset Loading
- Open game in browser
- Verify progress bar appears and animates from 0% to 100%
- Verify "Loading..." text displays
- Verify MainScene displays test image
- Verify clicking image plays test sound
- Check console for any loading errors

## Implementation Details

### Phaser Asset Loading
Phaser's loader provides several key features:

```javascript
// Load different asset types
this.load.image('key', 'path/to/image.png');
this.load.audio('key', 'path/to/audio.mp3');
this.load.spritesheet('key', 'path/to/spritesheet.png', {
    frameWidth: 32,
    frameHeight: 32
});
this.load.json('key', 'path/to/data.json');

// Progress events
this.load.on('progress', (value) => {
    // value is 0.0 to 1.0
});

this.load.on('fileprogress', (file) => {
    // Individual file progress
});

this.load.on('complete', () => {
    // All assets loaded
});

this.load.on('loaderror', (file) => {
    // Handle loading error
});
```

### Progress Bar Best Practices
1. **Visual Feedback**: Always show percentage and bar fill
2. **Smooth Animation**: Phaser updates progress automatically
3. **Error Handling**: Listen for 'loaderror' events
4. **Minimum Time**: Show preloader long enough to be seen
5. **Clear State**: Clean up progress graphics after loading

### Asset Organization
```
/assets
├── /images       # PNG, JPG sprites and backgrounds
├── /audio        # MP3, WAV sound effects and music
└── /data         # JSON configuration files
```

## Acceptance Criteria
- [ ] Test image file exists in /assets/images
- [ ] Test audio file exists in /assets/audio
- [ ] PreloadScene.js created and properly structured
- [ ] Progress bar displays with background box
- [ ] Progress bar animates from 0% to 100%
- [ ] Percentage text updates during loading
- [ ] "Loading..." text displays
- [ ] "Complete!" displays when done
- [ ] MainScene displays loaded test image
- [ ] Clicking image plays test sound
- [ ] No console errors during loading
- [ ] No 404 errors for asset files
- [ ] Scene transition works smoothly
- [ ] Progress bar is centered on screen

## Testing Steps
1. Clear browser cache
2. Open index.html in browser
3. Observe PreloadScene:
   - Progress bar appears
   - Progress animates 0% to 100%
   - Loading text displays
4. Observe MainScene:
   - Test image displays centered
   - Success message shows
5. Click test image:
   - Audio plays successfully
6. Check browser console:
   - No errors
   - "Assets loaded successfully" message appears
7. Test with slow network (DevTools throttling):
   - Progress bar animates smoothly
   - Percentage updates correctly
8. Test missing asset scenario:
   - Temporarily rename asset file
   - Verify error handling
   - Restore asset file

## Estimated Time
1 hour

## Dependencies
- Phase 1: Project Bootstrap (completed)
- Phase 2: Scene Management (completed)

## Risks
- **Missing Assets**: Use proper error handling and console logging
- **Audio Codec Support**: MP3 is widely supported, use WAV as fallback
- **Loading Too Fast**: Add artificial delay if needed to verify progress bar
- **Path Issues**: Use relative paths, verify asset locations
- **CORS Issues**: Test with local server if loading from file:// protocol fails

## Notes
- Keep test assets small (image < 50KB, audio < 100KB)
- Progress bar should be visible even for fast loads
- This pattern will be reused for all future asset loading
- Consider adding error handling for production
- Progress bar can be styled to match game theme later

## Testing with Network Throttling
To properly see the progress bar:
1. Open Chrome DevTools (F12)
2. Go to Network tab
3. Set throttling to "Slow 3G"
4. Reload page
5. Progress bar should animate slowly enough to observe

## Future Enhancements (Not in Phase 3)
- Add loading animations
- Add asset loading error recovery
- Implement retry mechanism
- Add asset caching
- Create custom loading screen graphics
- Add progress bar styling to match game theme

## Completion Checklist
- [ ] All tasks completed
- [ ] All acceptance criteria met
- [ ] Test assets created and loaded
- [ ] Progress bar works correctly
- [ ] Loaded assets display in MainScene
- [ ] Audio playback works
- [ ] Tested with network throttling
- [ ] Tested error scenarios
- [ ] No console errors
- [ ] Ready to proceed to Phase 4
