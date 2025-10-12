# Phase 4: AudioManager Service

## Goal
Create a centralized AudioManager singleton service to manage all sound effects and voice clips with consistent volume control and overlap prevention.

## Context
This phase establishes the audio infrastructure for Aurora's Letter Adventure. We need a reliable, centralized audio system that:
1. Manages sound effects (clicks, success, error sounds)
2. Manages voice clips (letter pronunciation, instructions)
3. Prevents audio overlap issues
4. Provides consistent volume control
5. Handles missing audio files gracefully
6. Works for children with ADHD (clear, non-overwhelming audio)

## Prerequisites
- Phase 1 complete (Phaser 3 running)
- Phase 2 complete (Scene management)
- Phase 3 complete (MainMenu scene exists)

## Tasks

### 1. Create AudioManager Service
**File**: `src/services/AudioManager.js`

Create a singleton service with:
- `getInstance()` - Get singleton instance
- `init(scene)` - Initialize with Phaser scene reference
- `playSound(key, config)` - Play sound effects
- `playVoice(key, config)` - Play voice clips
- `stopAll()` - Stop all playing audio
- `setVolume(type, volume)` - Set volume for sound/voice separately
- Audio caching system
- Overlap prevention logic

### 2. Update MainMenu Scene
**File**: `src/scenes/MainMenu.js`

- Import AudioManager
- Initialize AudioManager in create()
- Add test button to MainMenu
- Wire button to test sound
- Add console logging for audio events

### 3. Add Test Sound Asset
**Directory**: `assets/audio/`

- Add a simple test sound file (click.mp3 or similar)
- Update preload in MainMenu to load test sound
- Document audio file requirements (format, size, duration)

### 4. Test Audio System
- Click button triggers test sound
- Sound plays at consistent volume
- No overlap when clicked rapidly
- Console logs show playback events
- Missing files handled gracefully

## Implementation Details

### AudioManager Singleton Pattern

```javascript
// src/services/AudioManager.js

class AudioManager {
    constructor() {
        if (AudioManager.instance) {
            return AudioManager.instance;
        }

        this.scene = null;
        this.sounds = new Map();
        this.voices = new Map();
        this.currentVoice = null;
        this.soundVolume = 0.7;
        this.voiceVolume = 1.0;

        AudioManager.instance = this;
    }

    static getInstance() {
        if (!AudioManager.instance) {
            AudioManager.instance = new AudioManager();
        }
        return AudioManager.instance;
    }

    init(scene) {
        this.scene = scene;
        console.log('[AudioManager] Initialized with scene:', scene.scene.key);
    }

    playSound(key, config = {}) {
        if (!this.scene) {
            console.warn('[AudioManager] Cannot play sound - not initialized');
            return null;
        }

        try {
            // Stop existing sound with same key to prevent overlap
            if (this.sounds.has(key)) {
                const existingSound = this.sounds.get(key);
                if (existingSound.isPlaying) {
                    existingSound.stop();
                }
            }

            const sound = this.scene.sound.add(key, {
                volume: config.volume || this.soundVolume,
                loop: config.loop || false
            });

            sound.play();
            this.sounds.set(key, sound);

            console.log(`[AudioManager] Playing sound: ${key}`);

            // Clean up when sound completes
            sound.once('complete', () => {
                this.sounds.delete(key);
            });

            return sound;
        } catch (error) {
            console.error(`[AudioManager] Error playing sound ${key}:`, error);
            return null;
        }
    }

    playVoice(key, config = {}) {
        if (!this.scene) {
            console.warn('[AudioManager] Cannot play voice - not initialized');
            return null;
        }

        try {
            // Stop current voice clip to prevent overlap
            if (this.currentVoice && this.currentVoice.isPlaying) {
                this.currentVoice.stop();
            }

            const voice = this.scene.sound.add(key, {
                volume: config.volume || this.voiceVolume,
                loop: false
            });

            voice.play();
            this.currentVoice = voice;
            this.voices.set(key, voice);

            console.log(`[AudioManager] Playing voice: ${key}`);

            // Clean up when voice completes
            voice.once('complete', () => {
                this.voices.delete(key);
                if (this.currentVoice === voice) {
                    this.currentVoice = null;
                }
            });

            return voice;
        } catch (error) {
            console.error(`[AudioManager] Error playing voice ${key}:`, error);
            return null;
        }
    }

    stopAll() {
        console.log('[AudioManager] Stopping all audio');

        // Stop all sounds
        this.sounds.forEach(sound => {
            if (sound.isPlaying) {
                sound.stop();
            }
        });
        this.sounds.clear();

        // Stop all voices
        this.voices.forEach(voice => {
            if (voice.isPlaying) {
                voice.stop();
            }
        });
        this.voices.clear();
        this.currentVoice = null;
    }

    setVolume(type, volume) {
        const clampedVolume = Math.max(0, Math.min(1, volume));

        if (type === 'sound') {
            this.soundVolume = clampedVolume;
            console.log(`[AudioManager] Sound volume set to: ${clampedVolume}`);
        } else if (type === 'voice') {
            this.voiceVolume = clampedVolume;
            console.log(`[AudioManager] Voice volume set to: ${clampedVolume}`);
        }
    }
}

// Export singleton instance
export default AudioManager.getInstance();
```

### MainMenu Integration Example

```javascript
// src/scenes/MainMenu.js
import AudioManager from '../services/AudioManager.js';

export default class MainMenu extends Phaser.Scene {
    constructor() {
        super({ key: 'MainMenu' });
    }

    preload() {
        // Load test sound
        this.load.audio('test-click', 'assets/audio/click.mp3');
    }

    create() {
        // Initialize AudioManager
        AudioManager.init(this);

        // Create test button
        const testButton = this.add.text(400, 300, 'Test Sound', {
            fontSize: '32px',
            color: '#ffffff',
            backgroundColor: '#4488ff',
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5).setInteractive();

        // Test sound on click
        testButton.on('pointerdown', () => {
            console.log('[MainMenu] Test button clicked');
            AudioManager.playSound('test-click');
        });

        // Visual feedback
        testButton.on('pointerover', () => {
            testButton.setStyle({ backgroundColor: '#6699ff' });
        });

        testButton.on('pointerout', () => {
            testButton.setStyle({ backgroundColor: '#4488ff' });
        });
    }
}
```

## Acceptance Criteria
- [ ] AudioManager.js created in src/services/
- [ ] AudioManager uses singleton pattern correctly
- [ ] playSound() method works and prevents overlap
- [ ] playVoice() method works and stops previous voice
- [ ] setVolume() method works for both sound and voice
- [ ] stopAll() method stops all audio
- [ ] AudioManager integrated in MainMenu scene
- [ ] Test sound file added to assets/audio/
- [ ] Click button triggers test sound
- [ ] Volume is consistent across plays
- [ ] No overlap when clicked rapidly
- [ ] Console logs show audio events clearly
- [ ] Missing audio files are handled gracefully (no crash)
- [ ] Code is well-documented with comments

## Testing Steps
1. Open game in browser
2. Open browser console (F12)
3. Click test button once - verify sound plays
4. Check console for "[AudioManager] Playing sound" message
5. Click test button rapidly - verify no overlap
6. Test with non-existent sound key - verify graceful error
7. Verify volume is consistent
8. Take screenshot showing console logs
9. Document any issues

## Estimated Time
1.5 hours

## Dependencies
- Phase 3 (MainMenu scene)
- Test audio file (click.mp3 or similar)

## Risks
- **Audio file format compatibility**: Use MP3 and OGG for browser support
- **Mobile browser audio restrictions**: May need user interaction first
- **Volume control complexity**: Keep it simple for now, enhance later
- **Memory leaks from audio**: Proper cleanup in complete handlers

## Notes
- Keep audio files small (<100KB for effects, <500KB for voices)
- Use 22kHz sample rate for smaller files
- Mono audio is fine for most effects
- Voice clips should be clear and child-friendly
- Consider ADHD-friendly audio (not too loud, clear, no startling sounds)
- Singleton pattern ensures one audio manager across all scenes

## Audio File Guidelines
### Sound Effects
- Format: MP3 (primary), OGG (fallback)
- Duration: 0.1s - 1s
- Sample Rate: 22050 Hz
- Channels: Mono
- Bitrate: 128 kbps or lower
- Max Size: 100 KB

### Voice Clips
- Format: MP3 (primary), OGG (fallback)
- Duration: 1s - 5s
- Sample Rate: 44100 Hz
- Channels: Mono
- Bitrate: 128 kbps
- Max Size: 500 KB
- Clear pronunciation for children

## Completion Checklist
- [ ] All tasks completed
- [ ] All acceptance criteria met
- [ ] Tested in at least 2 browsers
- [ ] Console logs verified
- [ ] No audio overlap issues
- [ ] Graceful error handling verified
- [ ] Code is commented
- [ ] Ready to proceed to Phase 5

## Future Enhancements (Not in this phase)
- Audio sprite support for efficiency
- Music track management
- Audio ducking (lower music when voice plays)
- Preload progress for large audio files
- User preference persistence (save volume settings)
- Mute button functionality
