# Phase 42: Session Timer & Breaks

## Goal
Implement healthy play session management with gentle timers and break reminders to support ADHD-friendly gaming habits

## Context
Children with ADHD benefit from structured play sessions with regular breaks. This phase creates:
1. 10-minute session timer (default, parent-configurable)
2. Gentle "Take a break!" reminder system
3. Smooth end-of-session transition (no harsh interruptions)
4. Option to continue playing or stop
5. Visual and audio cues that feel supportive, not restrictive
6. Integration with GameSessionScene from Phase 41

## Prerequisites
- Phase 1-41 completed
- GameSessionScene implemented and functional
- Audio system for gentle notification sounds
- UI components for timer display
- Parent settings configuration system

## Tasks

### 1. Create SessionTimerManager Class
- Create src/managers/SessionTimerManager.js
- Implement configurable timer duration (default 10 minutes)
- Track elapsed time during gameplay
- Emit events at key milestones (8 min warning, 10 min limit)
- Support pause/resume functionality
- Persist timer state across scene transitions

### 2. Build Unobtrusive Timer Display
- Create subtle timer UI in corner of screen
- Show elapsed time or remaining time (configurable)
- Use gentle colors (not alarming red)
- Make display small enough to not distract
- Add fade-in/fade-out animations
- Hide completely during critical game moments (optional)

### 3. Implement Break Reminder System
- Create gentle "Time for a break!" notification
- Trigger at configurable interval (default 10 minutes)
- Use soft, friendly visuals (not harsh popup)
- Play gentle notification sound (not jarring alarm)
- Show Aurora character with encouraging message
- Provide two clear options: "Keep Playing" or "Take a Break"

### 4. Design Break Screen
- Create BreakReminderScene or overlay
- Show Aurora character with friendly animation
- Display message: "You've been playing for 10 minutes!"
- Include gentle suggestions: "Time to stretch, get water, or rest your eyes"
- Two buttons: "Keep Playing" (5 more minutes) and "All Done" (end session)
- Track total play time even if user continues

### 5. Implement Continue/Stop Logic
- "Keep Playing" extends timer by 5 minutes
- "Keep Playing" can be used multiple times
- Track total continuous play time
- After 30+ minutes, increase reminder frequency
- "All Done" saves session and returns to main menu or results
- Save all progress before exiting

### 6. Create Parent Configuration
- Add timer settings to parent dashboard/config
- Configurable duration (5, 10, 15, 20, 30 minutes, or disabled)
- Configurable extension time (5, 10, 15 minutes)
- Configurable reminder style (gentle, standard, disabled)
- Option to enforce break (no "Keep Playing" option)
- Settings persist in localStorage or config file

## Implementation Details

### SessionTimerManager Structure
```javascript
class SessionTimerManager {
    constructor(scene, config = {}) {
        this.scene = scene;
        this.config = {
            duration: config.duration || 600000,        // 10 minutes default
            warningTime: config.warningTime || 480000,  // 8 minute warning
            extensionTime: config.extensionTime || 300000, // 5 minute extension
            showTimer: config.showTimer !== false,      // Show by default
            enforceBreak: config.enforceBreak || false, // Don't force by default
            enabled: config.enabled !== false           // Enabled by default
        };

        this.startTime = null;
        this.elapsedTime = 0;
        this.isPaused = false;
        this.timerText = null;
        this.hasShownWarning = false;
        this.extensionsUsed = 0;

        if (this.config.enabled) {
            this.start();
        }
    }

    start() {
        this.startTime = Date.now() - this.elapsedTime;
        this.isPaused = false;

        if (this.config.showTimer) {
            this.createTimerDisplay();
        }

        // Check timer every second
        this.timerEvent = this.scene.time.addEvent({
            delay: 1000,
            callback: this.update,
            callbackScope: this,
            loop: true
        });
    }

    update() {
        if (this.isPaused) return;

        this.elapsedTime = Date.now() - this.startTime;

        // Update display
        if (this.timerText) {
            this.updateTimerDisplay();
        }

        // Check for warning
        if (!this.hasShownWarning &&
            this.elapsedTime >= this.config.warningTime) {
            this.showWarning();
            this.hasShownWarning = true;
        }

        // Check for break reminder
        if (this.elapsedTime >= this.config.duration) {
            this.showBreakReminder();
        }
    }

    createTimerDisplay() {
        // Create subtle timer in top-left corner
        this.timerText = this.scene.add.text(16, 16, '', {
            fontSize: '18px',
            fontFamily: 'Arial',
            color: '#888888',
            backgroundColor: '#00000040',
            padding: { x: 8, y: 4 }
        });
        this.timerText.setDepth(1000);
        this.timerText.setScrollFactor(0); // Fixed position
        this.timerText.setAlpha(0);

        // Fade in gently
        this.scene.tweens.add({
            targets: this.timerText,
            alpha: 0.6,
            duration: 1000,
            ease: 'Power2'
        });
    }

    updateTimerDisplay() {
        const minutes = Math.floor(this.elapsedTime / 60000);
        const seconds = Math.floor((this.elapsedTime % 60000) / 1000);
        const timeString = `${minutes}:${seconds.toString().padStart(2, '0')}`;

        this.timerText.setText(timeString);

        // Change color as time passes (subtle)
        if (this.elapsedTime >= this.config.warningTime) {
            this.timerText.setColor('#CC8800'); // Gentle orange
        }
    }

    showWarning() {
        // Gentle 2-minute warning
        const warningText = this.scene.add.text(
            this.scene.cameras.main.centerX,
            50,
            '2 minutes until break time!',
            {
                fontSize: '24px',
                fontFamily: 'Arial',
                color: '#FFD700',
                backgroundColor: '#00000080',
                padding: { x: 16, y: 8 }
            }
        ).setOrigin(0.5);
        warningText.setDepth(1000);
        warningText.setScrollFactor(0);

        // Play gentle sound
        this.scene.sound.play('gentleNotification');

        // Fade out after 3 seconds
        this.scene.time.delayedCall(3000, () => {
            this.scene.tweens.add({
                targets: warningText,
                alpha: 0,
                duration: 1000,
                onComplete: () => warningText.destroy()
            });
        });
    }

    showBreakReminder() {
        // Pause timer
        this.pause();

        // Show break reminder screen
        this.scene.scene.pause();
        this.scene.scene.launch('BreakReminderScene', {
            elapsedTime: this.elapsedTime,
            extensionsUsed: this.extensionsUsed,
            canExtend: !this.config.enforceBreak,
            timerManager: this
        });
    }

    extend() {
        // Add extension time
        this.config.duration += this.config.extensionTime;
        this.extensionsUsed++;
        this.hasShownWarning = false; // Reset warning for new period
        this.resume();
    }

    pause() {
        this.isPaused = true;
    }

    resume() {
        this.startTime = Date.now() - this.elapsedTime;
        this.isPaused = false;
    }

    stop() {
        if (this.timerEvent) {
            this.timerEvent.remove();
        }
        if (this.timerText) {
            this.timerText.destroy();
        }
    }

    getTotalPlayTime() {
        return this.elapsedTime;
    }

    getFormattedTime() {
        const minutes = Math.floor(this.elapsedTime / 60000);
        const seconds = Math.floor((this.elapsedTime % 60000) / 1000);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
}
```

### BreakReminderScene Structure
```javascript
class BreakReminderScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BreakReminderScene' });
    }

    init(data) {
        this.elapsedTime = data.elapsedTime;
        this.extensionsUsed = data.extensionsUsed;
        this.canExtend = data.canExtend;
        this.timerManager = data.timerManager;
    }

    create() {
        // Semi-transparent overlay
        const overlay = this.add.rectangle(
            400, 300, 800, 600, 0x000000, 0.85
        );

        // Aurora character or friendly icon
        const aurora = this.add.sprite(400, 180, 'aurora_wave');
        aurora.play('wave');

        // Friendly message
        const minutes = Math.floor(this.elapsedTime / 60000);
        const message = this.add.text(400, 280,
            `You've been playing for ${minutes} minutes!`,
            {
                fontSize: '32px',
                fontFamily: 'Arial',
                color: '#FFD700',
                align: 'center'
            }
        ).setOrigin(0.5);

        // Gentle suggestions
        const suggestions = this.add.text(400, 340,
            "Time to stretch, get some water,\nor rest your eyes for a moment!",
            {
                fontSize: '20px',
                fontFamily: 'Arial',
                color: '#FFFFFF',
                align: 'center'
            }
        ).setOrigin(0.5);

        // Play gentle notification sound
        this.sound.play('breakReminder');

        // Create buttons
        this.createButtons();
    }

    createButtons() {
        const buttonY = 460;

        if (this.canExtend) {
            // "Keep Playing" button (left side)
            const keepPlayingBg = this.add.rectangle(
                280, buttonY, 200, 60, 0x4CAF50
            );
            keepPlayingBg.setStrokeStyle(3, 0xFFFFFF);

            const keepPlayingText = this.add.text(
                280, buttonY, 'Keep Playing', {
                    fontSize: '24px',
                    color: '#FFFFFF'
                }
            ).setOrigin(0.5);

            keepPlayingBg.setInteractive({ useHandCursor: true });
            this.setupButtonInteraction(
                keepPlayingBg,
                keepPlayingText,
                () => this.handleKeepPlaying()
            );

            // Show extension info
            const extensionInfo = this.add.text(
                280, buttonY + 50,
                '(5 more minutes)',
                {
                    fontSize: '14px',
                    color: '#CCCCCC'
                }
            ).setOrigin(0.5);
        }

        // "All Done" button (right side or center if no keep playing)
        const allDoneX = this.canExtend ? 520 : 400;
        const allDoneBg = this.add.rectangle(
            allDoneX, buttonY, 200, 60, 0xFF9800
        );
        allDoneBg.setStrokeStyle(3, 0xFFFFFF);

        const allDoneText = this.add.text(
            allDoneX, buttonY, 'All Done', {
                fontSize: '24px',
                color: '#FFFFFF'
            }
        ).setOrigin(0.5);

        allDoneBg.setInteractive({ useHandCursor: true });
        this.setupButtonInteraction(
            allDoneBg,
            allDoneText,
            () => this.handleAllDone()
        );
    }

    setupButtonInteraction(bg, text, onClick) {
        // Hover effect
        bg.on('pointerover', () => {
            this.tweens.add({
                targets: [bg, text],
                scaleX: 1.05,
                scaleY: 1.05,
                duration: 150
            });
        });

        bg.on('pointerout', () => {
            this.tweens.add({
                targets: [bg, text],
                scaleX: 1.0,
                scaleY: 1.0,
                duration: 150
            });
        });

        // Click handler
        bg.on('pointerdown', () => {
            this.sound.play('buttonClick');
            onClick();
        });
    }

    handleKeepPlaying() {
        // Extend timer
        this.timerManager.extend();

        // Close break screen and resume game
        this.scene.stop();
        this.scene.resume(this.scene.get('GameSessionScene').scene.key);
    }

    handleAllDone() {
        // Stop timer
        this.timerManager.stop();

        // Close break screen
        this.scene.stop();

        // End session and show results
        const gameScene = this.scene.get('GameSessionScene');
        if (gameScene && gameScene.endSession) {
            gameScene.endSession();
        } else {
            // Fallback: return to main menu
            this.scene.start('MainMenuScene');
        }
    }
}
```

### Integration with GameSessionScene
```javascript
// In GameSessionScene.create()
create() {
    // Initialize session timer
    const timerConfig = this.registry.get('timerConfig') || {};
    this.sessionTimer = new SessionTimerManager(this, timerConfig);

    // Rest of session setup...
    this.generateGameSequence();
    this.startNextGame();
}

// In GameSessionScene.shutdown()
shutdown() {
    // Clean up timer
    if (this.sessionTimer) {
        this.sessionTimer.stop();
    }
}
```

### Parent Configuration Object
```javascript
const parentTimerConfig = {
    enabled: true,              // Enable/disable timer
    duration: 600000,           // 10 minutes (in ms)
    warningTime: 480000,        // 8 minutes warning (in ms)
    extensionTime: 300000,      // 5 minute extensions (in ms)
    maxExtensions: 3,           // Max 3 extensions (30 min total)
    enforceBreak: false,        // Allow "Keep Playing" option
    showTimer: true,            // Display elapsed time
    timerPosition: 'top-left',  // Where to show timer
    reminderStyle: 'gentle'     // gentle, standard, minimal
};

// Save to localStorage
localStorage.setItem('timerConfig', JSON.stringify(parentTimerConfig));

// Or in config file
export const TIMER_CONFIG = parentTimerConfig;
```

### Timer Display Options

**Option 1: Elapsed Time**
```javascript
// Shows: "5:23" (5 minutes 23 seconds)
updateTimerDisplay() {
    const minutes = Math.floor(this.elapsedTime / 60000);
    const seconds = Math.floor((this.elapsedTime % 60000) / 1000);
    this.timerText.setText(`${minutes}:${seconds.toString().padStart(2, '0')}`);
}
```

**Option 2: Remaining Time**
```javascript
// Shows: "-4:37" (4 minutes 37 seconds remaining)
updateTimerDisplay() {
    const remaining = this.config.duration - this.elapsedTime;
    const minutes = Math.floor(remaining / 60000);
    const seconds = Math.floor((remaining % 60000) / 1000);
    this.timerText.setText(`-${minutes}:${seconds.toString().padStart(2, '0')}`);
}
```

**Option 3: Minimal Display**
```javascript
// Shows: "●" (green) → "●" (yellow) → "●" (orange)
// Just a colored dot that changes color
updateTimerDisplay() {
    const progress = this.elapsedTime / this.config.duration;
    let color = '#4CAF50'; // Green
    if (progress > 0.8) color = '#FF9800'; // Orange
    else if (progress > 0.6) color = '#FFD700'; // Yellow

    this.timerText.setColor(color);
    this.timerText.setText('●');
}
```

## Acceptance Criteria
- [ ] SessionTimerManager tracks elapsed time accurately
- [ ] Timer display appears in corner (subtle, not distracting)
- [ ] 2-minute warning appears at 8 minutes
- [ ] Break reminder appears at 10 minutes
- [ ] Break reminder is gentle and non-alarming
- [ ] "Keep Playing" button extends timer by 5 minutes
- [ ] "All Done" button ends session gracefully
- [ ] Timer persists across scene transitions
- [ ] Timer pauses during break reminder screen
- [ ] Multiple extensions are supported
- [ ] Parent configuration settings work correctly
- [ ] Aurora is not frustrated by interruption
- [ ] Timer can be disabled via parent settings

## Testing Steps
1. Start game session and verify timer appears
2. Play for 8 minutes and verify warning appears
3. Continue playing to 10 minutes
4. Verify break reminder appears with Aurora character
5. Test "Keep Playing" button:
   - Verify timer extends by 5 minutes
   - Continue playing and verify second reminder at 15 minutes
6. Test "All Done" button:
   - Verify session ends gracefully
   - Verify progress is saved
   - Verify results screen or main menu appears
7. Test with timer disabled in settings
8. Test with enforceBreak enabled (no "Keep Playing")
9. Verify timer persists across game transitions
10. Check console for errors

## Estimated Time
1 hour

## Dependencies
- Phase 41 (GameSessionScene) completed
- Audio assets for gentle notifications
- Aurora character sprite (for break screen)
- Parent settings/config system
- localStorage or config persistence

## Risks
- **Timer feels restrictive**: Make it gentle, optional, and extensible
- **Break reminder is jarring**: Use soft visuals, gentle audio, friendly messaging
- **Aurora frustrated by interruption**: Allow "Keep Playing" and make it feel supportive
- **Timer inaccurate**: Use Phaser's time system, test thoroughly
- **Parent settings too complex**: Provide good defaults, make configuration optional

## ADHD-Friendly Design Considerations
- **Gentle notifications**: No harsh alarms or red warnings
- **Predictable timing**: Aurora knows a reminder is coming
- **Autonomy**: "Keep Playing" option gives control
- **Visual cues**: Timer provides time awareness without stress
- **Break suggestions**: Positive framing ("stretch, water, rest")
- **Friendly character**: Aurora on break screen feels supportive
- **No guilt**: Language is encouraging, not scolding
- **Flexible**: Multiple extensions support hyperfocus moments
- **Optional**: Parents can disable if it's not helpful

## Notes
- 10 minutes is optimal for Aurora's focus span
- 5-minute extensions allow hyperfocus continuation
- Gentle reminders better than forced breaks
- Timer should feel supportive, not restrictive
- Visual design critical: soft colors, friendly messaging
- Audio must be gentle (not alarm-like)
- Integration with Phase 41 session system crucial
- Parents can customize based on child's needs

## Health & Wellness Benefits
- Prevents eye strain from extended screen time
- Encourages movement and stretching
- Supports healthy gaming habits
- Promotes time awareness
- Reduces parent-child conflicts about "when to stop"
- Teaches self-regulation skills
- Provides structure without being rigid

## Parent Dashboard Integration
```javascript
// Future enhancement: Visual configuration in parent dashboard
const timerSettings = {
    sessionLength: {
        label: "Session Length",
        options: ["5 min", "10 min", "15 min", "20 min", "30 min", "Disabled"],
        default: "10 min"
    },
    extensionLength: {
        label: "Extension Time",
        options: ["5 min", "10 min", "15 min"],
        default: "5 min"
    },
    enforceBreaks: {
        label: "Require Breaks",
        options: ["Allow 'Keep Playing'", "Require Break"],
        default: "Allow 'Keep Playing'"
    },
    showTimer: {
        label: "Show Timer",
        options: ["Visible", "Hidden"],
        default: "Visible"
    }
};
```

## Completion Checklist
- [ ] SessionTimerManager.js created in src/managers/
- [ ] BreakReminderScene.js created in src/scenes/
- [ ] Timer display implemented and styled
- [ ] Warning system working (2-minute warning)
- [ ] Break reminder screen designed and functional
- [ ] "Keep Playing" and "All Done" buttons working
- [ ] Timer extension logic implemented
- [ ] Parent configuration system integrated
- [ ] Integration with GameSessionScene successful
- [ ] All acceptance criteria met
- [ ] Tested with Aurora (not frustrating)
- [ ] Gentle audio notifications added
- [ ] Documentation updated
- [ ] No console errors
- [ ] Ready for real-world use
