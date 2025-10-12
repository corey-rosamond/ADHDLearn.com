# Phase 20: Settings Scene

## Goal
Create a configurable settings system that allows players to customize audio levels, difficulty, and reset progress

## Context
Players and parents need control over game settings to personalize the experience. This phase creates a dedicated settings scene with:
1. Volume controls for music and sound effects
2. Voice volume control for audio instructions
3. Difficulty level selection
4. Progress reset functionality
5. Persistent storage using localStorage
6. Settings that take effect immediately without restart

## Prerequisites
- Phases 1-19 completed
- Audio system functional with separate channels
- Progress tracking system in place
- Main menu scene exists with settings button
- localStorage available in browser

## Tasks

### 1. Create Settings Scene File
- Create src/scenes/SettingsScene.js
- Extend Phaser.Scene with key 'SettingsScene'
- Set up scene background (consistent with game theme)
- Add "Settings" title text
- Include back button to return to main menu

### 2. Implement Volume Controls
- **Music Volume Slider**
  - Phaser slider or HTML5 range input
  - Range: 0-100%
  - Shows current value (e.g., "Music: 75%")
  - Updates music volume in real-time
- **Sound Effects Volume Slider**
  - Separate control for game sound effects
  - Range: 0-100%
  - Updates SFX volume immediately
- **Voice Volume Slider**
  - Controls audio instruction volume
  - Range: 0-100%
  - Test button to hear sample voice clip

### 3. Create Difficulty Selection
- **Difficulty Dropdown or Buttons**
  - Easy: Fewer letters, more time, larger targets
  - Medium: Standard game settings (default)
  - Hard: All letters, faster pace, smaller targets
- Visual indicator showing current difficulty
- Description text explaining each difficulty level
- Changes persist between sessions

### 4. Add Reset Progress Button
- **"Reset Progress" Button**
  - Large, clear button with warning color (red/orange)
  - Shows confirmation modal: "Are you sure?"
  - Confirmation has "Yes, Reset" and "Cancel" buttons
  - On confirm: Clear all localStorage progress data
  - Show success message: "Progress has been reset"
  - Return to main menu automatically

### 5. Implement Settings Storage
- **SettingsManager Class or Module**
  - Save settings to localStorage on change
  - Load settings on game start
  - Default settings if none exist
  - Data structure:
    ```javascript
    {
      musicVolume: 75,
      sfxVolume: 80,
      voiceVolume: 90,
      difficulty: 'medium'
    }
    ```
- Settings persist between sessions
- Settings survive page reload

### 6. Apply Settings System-Wide
- **AudioManager Integration**
  - Music volume affects background music globally
  - SFX volume affects all sound effects
  - Voice volume affects instruction audio
- **Difficulty Integration**
  - Pass difficulty setting to game scenes
  - Adjust game parameters based on difficulty
  - Easy/Medium/Hard affect gameplay appropriately

### 7. Add UI Polish
- Smooth slider interactions (Phaser tweens)
- Visual feedback on button clicks
- Consistent styling with game theme
- Clear labels and value displays
- Responsive layout (prepared for Phase 21)

## Implementation Details

### SettingsScene.js Structure
```javascript
class SettingsScene extends Phaser.Scene {
    constructor() {
        super({ key: 'SettingsScene' });
        this.settings = null;
    }

    preload() {
        // Load UI elements if needed
        // Sliders can be created with Phaser graphics or rexUI plugin
    }

    create() {
        // Load current settings
        this.settings = this.loadSettings();

        // Create background
        this.add.rectangle(400, 300, 800, 600, 0x2a2a2a);

        // Title
        this.add.text(400, 50, 'Settings', {
            fontSize: '48px',
            color: '#ffffff',
            fontFamily: 'Arial'
        }).setOrigin(0.5);

        // Music Volume
        this.createVolumeSlider(400, 150, 'Music', 'musicVolume');

        // SFX Volume
        this.createVolumeSlider(400, 230, 'Sound Effects', 'sfxVolume');

        // Voice Volume
        this.createVolumeSlider(400, 310, 'Voice', 'voiceVolume');

        // Difficulty Selection
        this.createDifficultySelector(400, 410);

        // Reset Progress Button
        this.createResetButton(400, 510);

        // Back Button
        this.createBackButton(400, 570);
    }

    createVolumeSlider(x, y, label, settingKey) {
        // Label
        this.add.text(x - 200, y, label, {
            fontSize: '24px',
            color: '#ffffff'
        });

        // Slider (simplified - use rexUI plugin for production)
        const sliderBg = this.add.rectangle(x + 50, y, 300, 10, 0x666666);
        const sliderFill = this.add.rectangle(x + 50 - 150, y, 0, 10, 0x44ff44)
            .setOrigin(0, 0.5);

        // Value text
        const valueText = this.add.text(x + 220, y, `${this.settings[settingKey]}%`, {
            fontSize: '20px',
            color: '#ffffff'
        }).setOrigin(0, 0.5);

        // Interactive slider logic
        sliderBg.setInteractive({ useHandCursor: true })
            .on('pointerdown', (pointer) => {
                this.updateSlider(pointer, sliderBg, sliderFill, valueText, settingKey);
            })
            .on('pointermove', (pointer) => {
                if (pointer.isDown) {
                    this.updateSlider(pointer, sliderBg, sliderFill, valueText, settingKey);
                }
            });

        // Initialize slider position
        sliderFill.width = (this.settings[settingKey] / 100) * 300;
    }

    updateSlider(pointer, bg, fill, text, settingKey) {
        const localX = pointer.x - (bg.x - 150);
        const clampedX = Phaser.Math.Clamp(localX, 0, 300);
        const percentage = Math.round((clampedX / 300) * 100);

        fill.width = clampedX;
        text.setText(`${percentage}%`);

        this.settings[settingKey] = percentage;
        this.saveSettings();
        this.applyVolumeChange(settingKey, percentage);
    }

    applyVolumeChange(key, value) {
        const volume = value / 100;
        if (key === 'musicVolume') {
            this.sound.setVolume(volume); // Adjust as needed for music channel
        } else if (key === 'sfxVolume') {
            // Apply to SFX channel
        } else if (key === 'voiceVolume') {
            // Apply to voice channel
        }
    }

    createDifficultySelector(x, y) {
        this.add.text(x, y - 30, 'Difficulty', {
            fontSize: '24px',
            color: '#ffffff'
        }).setOrigin(0.5);

        const difficulties = ['easy', 'medium', 'hard'];
        const labels = ['Easy', 'Medium', 'Hard'];
        const spacing = 120;

        difficulties.forEach((diff, index) => {
            const buttonX = x - spacing + (index * spacing);
            const isSelected = this.settings.difficulty === diff;

            const button = this.add.rectangle(buttonX, y + 20, 100, 40,
                isSelected ? 0x44ff44 : 0x666666)
                .setInteractive({ useHandCursor: true });

            this.add.text(buttonX, y + 20, labels[index], {
                fontSize: '18px',
                color: '#ffffff'
            }).setOrigin(0.5);

            button.on('pointerdown', () => {
                this.settings.difficulty = diff;
                this.saveSettings();
                this.scene.restart(); // Refresh UI
            });
        });
    }

    createResetButton(x, y) {
        const button = this.add.rectangle(x, y, 200, 50, 0xff4444)
            .setInteractive({ useHandCursor: true });

        this.add.text(x, y, 'Reset Progress', {
            fontSize: '20px',
            color: '#ffffff'
        }).setOrigin(0.5);

        button.on('pointerdown', () => {
            this.showResetConfirmation();
        });
    }

    showResetConfirmation() {
        // Create modal overlay
        const overlay = this.add.rectangle(400, 300, 800, 600, 0x000000, 0.7);
        const modal = this.add.rectangle(400, 300, 400, 200, 0x333333);

        const text = this.add.text(400, 270, 'Reset all progress?\nThis cannot be undone.', {
            fontSize: '20px',
            color: '#ffffff',
            align: 'center'
        }).setOrigin(0.5);

        // Yes button
        const yesButton = this.add.rectangle(340, 340, 120, 40, 0xff4444)
            .setInteractive({ useHandCursor: true });
        this.add.text(340, 340, 'Yes, Reset', {
            fontSize: '16px',
            color: '#ffffff'
        }).setOrigin(0.5);

        yesButton.on('pointerdown', () => {
            this.resetProgress();
            overlay.destroy();
            modal.destroy();
            text.destroy();
            yesButton.destroy();
            this.scene.start('MainMenuScene');
        });

        // Cancel button
        const cancelButton = this.add.rectangle(460, 340, 120, 40, 0x666666)
            .setInteractive({ useHandCursor: true });
        this.add.text(460, 340, 'Cancel', {
            fontSize: '16px',
            color: '#ffffff'
        }).setOrigin(0.5);

        cancelButton.on('pointerdown', () => {
            overlay.destroy();
            modal.destroy();
            text.destroy();
            yesButton.destroy();
            cancelButton.destroy();
        });
    }

    createBackButton(x, y) {
        const button = this.add.rectangle(x, y, 150, 40, 0x4488ff)
            .setInteractive({ useHandCursor: true });

        this.add.text(x, y, 'Back', {
            fontSize: '20px',
            color: '#ffffff'
        }).setOrigin(0.5);

        button.on('pointerdown', () => {
            this.scene.start('MainMenuScene');
        });
    }

    loadSettings() {
        const defaultSettings = {
            musicVolume: 75,
            sfxVolume: 80,
            voiceVolume: 90,
            difficulty: 'medium'
        };

        const saved = localStorage.getItem('auroraSettings');
        return saved ? JSON.parse(saved) : defaultSettings;
    }

    saveSettings() {
        localStorage.setItem('auroraSettings', JSON.stringify(this.settings));
    }

    resetProgress() {
        // Clear all progress data
        localStorage.removeItem('auroraProgress');
        localStorage.removeItem('auroraScores');
        // Keep settings intact
        console.log('Progress reset complete');
    }
}
```

### localStorage Data Structure
```javascript
// Settings (persistent)
localStorage.setItem('auroraSettings', JSON.stringify({
    musicVolume: 75,
    sfxVolume: 80,
    voiceVolume: 90,
    difficulty: 'medium'
}));

// Progress (resettable)
localStorage.setItem('auroraProgress', JSON.stringify({
    lettersCompleted: ['A', 'B', 'C'],
    wordsCompleted: ['cat', 'dog'],
    totalStars: 45
}));
```

### Integration with Game Config
```javascript
// In config.js or main game file
const settings = JSON.parse(localStorage.getItem('auroraSettings')) || {
    musicVolume: 75,
    sfxVolume: 80,
    voiceVolume: 90,
    difficulty: 'medium'
};

// Apply to Phaser config or audio manager
game.sound.setVolume(settings.musicVolume / 100);

// Pass to scenes
this.scene.start('LetterPopScene', { difficulty: settings.difficulty });
```

## Acceptance Criteria
- [ ] SettingsScene.js file created and registered
- [ ] Music volume slider functional (0-100%)
- [ ] SFX volume slider functional (0-100%)
- [ ] Voice volume slider functional (0-100%)
- [ ] Volume changes apply immediately
- [ ] Difficulty selector displays Easy/Medium/Hard
- [ ] Selected difficulty is highlighted visually
- [ ] Reset Progress button shows confirmation modal
- [ ] Confirmation modal has Yes and Cancel buttons
- [ ] Resetting progress clears localStorage data
- [ ] Settings persist after page reload
- [ ] Settings load correctly on game start
- [ ] Back button returns to main menu
- [ ] All UI elements are clearly labeled
- [ ] Volume percentages display correctly
- [ ] No console errors during interaction
- [ ] Touch/mouse input both work

## Testing Steps
1. Navigate to Settings from main menu
2. Test Music Volume Slider:
   - Drag slider left (volume decreases)
   - Drag slider right (volume increases)
   - Verify percentage updates in real-time
   - Verify music volume changes immediately
3. Test SFX Volume Slider:
   - Adjust slider
   - Trigger sound effect (click button)
   - Verify volume change
4. Test Voice Volume Slider:
   - Adjust slider
   - Play voice sample or return to game
   - Verify instruction volume changes
5. Test Difficulty Selection:
   - Click Easy (button highlights)
   - Click Medium (button highlights)
   - Click Hard (button highlights)
   - Verify only one is selected at a time
6. Test Settings Persistence:
   - Change all settings
   - Reload page
   - Return to settings
   - Verify all settings retained
7. Test Reset Progress:
   - Click "Reset Progress"
   - Verify confirmation modal appears
   - Click "Cancel" - nothing happens
   - Click "Reset Progress" again
   - Click "Yes, Reset"
   - Verify progress data cleared
   - Verify settings data NOT cleared
   - Check localStorage in browser DevTools
8. Test Back Button:
   - Click Back
   - Returns to main menu
9. Check browser console for errors
10. Test on touch device

## Estimated Time
2 hours

## Dependencies
- Phaser 3 UI system (graphics, text, rectangles)
- Optional: rexUI plugin for advanced sliders/UI
- localStorage API
- Audio system with separate volume channels

## Risks
- **Slider Implementation**: Phaser doesn't have native sliders - need custom or plugin
- **localStorage Support**: Older browsers or private mode may block localStorage
- **Audio Channel Separation**: Need separate volume controls for music/SFX/voice
- **Confirmation Modal**: Must prevent accidental progress resets
- **Cross-Scene Settings**: Settings must propagate to all game scenes

## Notes
- Use simple rectangles and text for sliders (no images required)
- Consider using rexUI plugin for polished sliders and dropdowns
- localStorage is synchronous and limited to ~5-10MB (sufficient for settings)
- Settings should have sensible defaults (75-90% volume, medium difficulty)
- Reset progress should NOT reset settings (preserve user preferences)
- Volume changes should apply immediately (no "Apply" button needed)
- Difficulty should affect existing game parameters (Phase 21 may adjust)
- Test localStorage availability with try-catch for privacy mode
- Consider adding "Test Volume" buttons to preview audio levels
- Settings scene should match visual theme of main menu

## Completion Checklist
- [ ] SettingsScene.js created
- [ ] Three volume sliders implemented
- [ ] Difficulty selector implemented
- [ ] Reset progress with confirmation
- [ ] localStorage save/load working
- [ ] Settings persist after reload
- [ ] Volume changes apply immediately
- [ ] All acceptance criteria met
- [ ] Tested all interactions
- [ ] Tested settings persistence
- [ ] Tested reset functionality
- [ ] No console errors
- [ ] Touch input tested
- [ ] Back button works
- [ ] Ready to proceed to Phase 21
