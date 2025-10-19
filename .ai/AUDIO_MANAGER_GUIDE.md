# AudioManager Integration Guide

---
## ⚠️ DEPRECATED - PHASER VERSION ONLY

**This guide applies to the archived Phaser.js web version located in `archive/phaser-web/`.**

**Current Project:** The active project is now **Kotlin + libGDX** (native Android).

**For current audio implementation:**
- See `core/src/main/kotlin/com/aurora/reading/core/services/AudioManager.kt`
- Uses libGDX audio system (Sound and Music classes)
- Different API and patterns than Phaser version
- Singleton pattern with libGDX asset manager integration

**This file is kept for reference only.** The Phaser patterns described here do not apply to the Kotlin/libGDX version.

---

## Overview

The `AudioManager` is a singleton service that provides centralized audio management for the entire game. It integrates seamlessly with the game's volume settings stored in localStorage.

## Architecture

### Single Responsibility
- **One Class, One Purpose**: AudioManager handles all audio playback and volume control
- **Separation of Concerns**: Scenes don't need to manage volume calculations
- **DRY Principle**: Volume logic exists in one place, not duplicated across scenes

### Singleton Pattern
```javascript
// Always returns the same instance
const audioManager = AudioManager.getInstance();
```

## Volume System

### Three-Tier Volume Control
1. **Master Volume** (0-100): Global multiplier affecting all audio
2. **Music Volume** (0-100): Background music tracks
3. **SFX Volume** (0-100): Sound effects and voice instructions

### Volume Calculation
```
Final Volume = (Master Volume / 100) × (Type Volume / 100)

Example:
- Master: 80%
- SFX: 50%
- Final: 0.8 × 0.5 = 0.4 (40%)
```

## Usage

### 1. Initialize in Scene

Call `init()` in your scene's `create()` method:

```javascript
create() {
    // Initialize AudioManager with scene reference
    const audioManager = AudioManager.getInstance();
    audioManager.init(this);

    // Rest of your scene setup...
}
```

### 2. Play Sound Effects

```javascript
// Basic sound effect
audioManager.playSound('bubblePop');

// With custom volume (0.0-1.0)
audioManager.playSound('success', { volume: 0.8 });

// Looping sound
audioManager.playSound('ambience', { loop: true });
```

### 3. Play Voice Instructions

```javascript
// Voice clips (only one plays at a time)
audioManager.playVoice('find_letter_A');

// Custom volume
audioManager.playVoice('welcome', { volume: 0.9 });
```

### 4. Play Background Music

```javascript
// Music (loops by default)
audioManager.playMusic('music_menu');

// Non-looping music
audioManager.playMusic('music_victory', { loop: false });

// Custom volume
audioManager.playMusic('music_gameplay', { volume: 0.6 });
```

### 5. Pause/Resume Audio

```javascript
// Pause all audio (for window blur, tab switch)
audioManager.pauseAll();

// Resume all audio
audioManager.resumeAll();
```

### 6. Stop All Audio

```javascript
// Stop everything (scene transitions, cleanup)
audioManager.stopAll();
```

## Real-World Examples

### Example 1: Letter Pop Scene

```javascript
class LetterPopScene extends Phaser.Scene {
    create() {
        // Initialize AudioManager
        this.audioManager = AudioManager.getInstance();
        this.audioManager.init(this);

        // Play background music
        this.audioManager.playMusic('music_gameplay');

        // Play voice instruction
        this.audioManager.playVoice('find_letter_B');
    }

    handleBubbleClick(bubble) {
        // Play sound effect
        this.audioManager.playSound('bubblePop');
    }

    handleCorrectAnswer() {
        // Play success sound
        this.audioManager.playSound('correctAnswer');
    }
}
```

### Example 2: Visibility Handling

```javascript
setupVisibilityHandling() {
    const audioManager = AudioManager.getInstance();

    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            audioManager.pauseAll();
        } else {
            audioManager.resumeAll();
        }
    });
}
```

### Example 3: Settings Scene Integration

```javascript
applyVolumeSettings() {
    // Settings are already saved to localStorage by sliders
    // Just tell AudioManager to reload and apply them
    const audioManager = AudioManager.getInstance();
    audioManager.updateVolumes();
}
```

## Migration Strategy

### Gradual Migration (Recommended)
Since the game currently uses Phaser's `this.sound.play()` directly, migrate scenes gradually:

1. **New Features**: Always use AudioManager
2. **Bug Fixes**: Convert to AudioManager when fixing audio-related issues
3. **Refactoring**: Convert entire scenes during scheduled refactoring

### Quick Reference: Old vs New

```javascript
// OLD WAY (Phaser direct)
this.sound.play('bubblePop', { volume: 0.6 });

// NEW WAY (AudioManager)
audioManager.playSound('bubblePop', { volume: 0.6 });

// OLD WAY (Manual volume calculation)
const masterVol = parseInt(localStorage.getItem('masterVolume') || '100') / 100;
const sfxVol = parseInt(localStorage.getItem('sfxVolume') || '100') / 100;
this.sound.play('pop', { volume: masterVol * sfxVol });

// NEW WAY (Automatic volume handling)
audioManager.playSound('pop');
```

## Benefits

### For Developers
- ✅ **No volume math** - AudioManager handles calculations
- ✅ **Consistent behavior** - Same audio logic everywhere
- ✅ **Easy testing** - Single point to mock/test
- ✅ **Clean code** - No duplicated volume logic

### For Users (Aurora)
- ✅ **Settings work everywhere** - Volume changes apply to all audio
- ✅ **Real-time updates** - Changes take effect immediately
- ✅ **Persistent settings** - Volumes remembered between sessions
- ✅ **Predictable behavior** - All audio respects volume settings

## Advanced Features

### Custom Audio Categories

Want to add a new category? Just extend `calculateVolume()`:

```javascript
calculateVolume(type, customVolume = null) {
    if (customVolume !== null) {
        return this.masterVolume * customVolume;
    }

    let typeVolume;
    switch(type) {
        case 'music': typeVolume = this.musicVolume; break;
        case 'sfx': typeVolume = this.sfxVolume; break;
        case 'voice': typeVolume = this.voiceVolume; break; // New category
        default: typeVolume = this.sfxVolume;
    }

    return this.masterVolume * typeVolume;
}
```

### Debugging

AudioManager only logs errors and warnings (not verbose logs):

```javascript
console.error('[AudioManager] Cannot play sound - not initialized')
console.warn('[AudioManager] Sound key "invalid" not found in cache')
```

## Testing Checklist

When testing AudioManager integration:

- [ ] Audio plays at correct volume
- [ ] Settings screen sliders update volume in real-time
- [ ] Volume persists after page reload
- [ ] Master volume affects all audio types
- [ ] Music and SFX volumes work independently
- [ ] Pause/resume works correctly
- [ ] No audio overlap for same sound key
- [ ] Only one voice plays at a time
- [ ] Error handling for missing audio files

## Common Pitfalls

### ❌ Forgetting to Initialize
```javascript
// BAD - AudioManager not initialized
audioManager.playSound('pop'); // Scene is null!

// GOOD
audioManager.init(this);
audioManager.playSound('pop');
```

### ❌ Using Phaser Volume with AudioManager
```javascript
// BAD - Conflicts with AudioManager
this.sound.volume = 0.5;
audioManager.playSound('pop');

// GOOD - Let AudioManager handle volume
audioManager.playSound('pop');
```

### ❌ Not Calling updateVolumes() After Settings Change
```javascript
// BAD - Old volumes still applied
localStorage.setItem('masterVolume', '50');

// GOOD
localStorage.setItem('masterVolume', '50');
audioManager.updateVolumes();
```

## Maintenance

### Adding New Audio Files

1. Add to PreloadScene.js
2. Use AudioManager to play
3. No additional volume code needed!

```javascript
// PreloadScene.js
this.load.audio('newSound', 'assets/audio/newSound.mp3');

// YourScene.js
audioManager.playSound('newSound');
```

---

**Built with Aurora in mind** 💜
_Clean. Maintainable. Expandable._
