/**
 * AudioManager
 *
 * Singleton service for managing all game audio (sounds and voices).
 *
 * Responsibilities:
 * - Play sound effects with volume control from settings
 * - Play voice clips with interruption (only one voice at a time)
 * - Integrate with localStorage volume settings (masterVolume, musicVolume, sfxVolume)
 * - Handle missing audio files gracefully
 * - Provide consistent audio behavior across all scenes
 * - Update volumes dynamically when settings change
 *
 * Volume Structure:
 * - Master Volume: Global multiplier (0-100)
 * - Music Volume: Background music (0-100)
 * - SFX Volume: Sound effects and voices (0-100)
 * - Final Volume = (Master / 100) * (Type / 100)
 *
 * Dependencies:
 * - Phaser.Scene (for sound system access)
 * - localStorage (for persistent volume settings)
 */
class AudioManager {
    constructor() {
        // Singleton pattern - return existing instance if it exists
        if (AudioManager.instance) {
            return AudioManager.instance;
        }

        this.scene = null;
        this.sounds = new Map();
        this.voices = new Map();
        this.currentVoice = null;

        // Load volume settings from localStorage
        this.loadSettings();

        // Listen for storage events to update settings in real-time
        window.addEventListener('storage', () => {
            this.loadSettings();
        });

        AudioManager.instance = this;
    }

    /**
     * Get the singleton instance of AudioManager
     * @returns {AudioManager} The singleton instance
     */
    static getInstance() {
        if (!AudioManager.instance) {
            AudioManager.instance = new AudioManager();
        }
        return AudioManager.instance;
    }

    /**
     * Load volume settings from localStorage
     * Sets defaults if not found: master=100, music=100, sfx=100
     */
    loadSettings() {
        this.masterVolume = parseInt(localStorage.getItem('masterVolume') || '100') / 100;
        this.musicVolume = parseInt(localStorage.getItem('musicVolume') || '100') / 100;
        this.sfxVolume = parseInt(localStorage.getItem('sfxVolume') || '100') / 100;
    }

    /**
     * Calculate final volume by combining master and type-specific volume
     * @param {string} type - Either 'music' or 'sfx'
     * @param {number} customVolume - Optional custom volume override (0.0-1.0)
     * @returns {number} Final volume (0.0-1.0)
     */
    calculateVolume(type, customVolume = null) {
        if (customVolume !== null) {
            return this.masterVolume * customVolume;
        }

        const typeVolume = type === 'music' ? this.musicVolume : this.sfxVolume;
        return this.masterVolume * typeVolume;
    }

    /**
     * Initialize AudioManager with a Phaser scene reference
     * Call this in each scene's create() method
     * @param {Phaser.Scene} scene - The current Phaser scene
     */
    init(scene) {
        this.scene = scene;
    }

    /**
     * Play a sound effect
     * Prevents overlap of the same sound key by stopping previous instance
     * @param {string} key - The audio key from Phaser's cache
     * @param {Object} config - Optional configuration {volume, loop}
     * @returns {Phaser.Sound.BaseSound|null} The sound object or null if error
     */
    playSound(key, config = {}) {
        if (!this.scene) {
            console.error('[AudioManager] Cannot play sound - not initialized with scene');
            return null;
        }

        // Check if sound exists in cache
        if (!this.scene.cache.audio.exists(key)) {
            console.warn(`[AudioManager] Sound key "${key}" not found in cache`);
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

            // Calculate final volume
            const volume = this.calculateVolume('sfx', config.volume);

            const sound = this.scene.sound.add(key, {
                volume: volume,
                loop: config.loop || false
            });

            sound.play();
            this.sounds.set(key, sound);

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

    /**
     * Play a voice clip (letter pronunciations, instructions, etc.)
     * Stops any currently playing voice to ensure only one voice plays at a time
     * @param {string} key - The audio key from Phaser's cache
     * @param {Object} config - Optional configuration {volume}
     * @returns {Phaser.Sound.BaseSound|null} The voice object or null if error
     */
    playVoice(key, config = {}) {
        if (!this.scene) {
            console.error('[AudioManager] Cannot play voice - not initialized with scene');
            return null;
        }

        // Check if voice exists in cache
        if (!this.scene.cache.audio.exists(key)) {
            console.warn(`[AudioManager] Voice key "${key}" not found in cache`);
            return null;
        }

        try {
            // Stop current voice clip to prevent overlap
            if (this.currentVoice && this.currentVoice.isPlaying) {
                this.currentVoice.stop();
            }

            // Calculate final volume
            const volume = this.calculateVolume('sfx', config.volume);

            const voice = this.scene.sound.add(key, {
                volume: volume,
                loop: false
            });

            voice.play();
            this.currentVoice = voice;
            this.voices.set(key, voice);

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

    /**
     * Play background music
     * Stops any currently playing music before starting new track
     * @param {string} key - The audio key from Phaser's cache
     * @param {Object} config - Optional configuration {volume, loop}
     * @returns {Phaser.Sound.BaseSound|null} The music object or null if error
     */
    playMusic(key, config = {}) {
        if (!this.scene) {
            console.error('[AudioManager] Cannot play music - not initialized with scene');
            return null;
        }

        // Check if music exists in cache
        if (!this.scene.cache.audio.exists(key)) {
            console.warn(`[AudioManager] Music key "${key}" not found in cache`);
            return null;
        }

        try {
            // Stop all currently playing music
            this.sounds.forEach((sound, soundKey) => {
                if (soundKey.startsWith('music_') && sound.isPlaying) {
                    sound.stop();
                }
            });

            // Calculate final volume
            const volume = this.calculateVolume('music', config.volume);

            const music = this.scene.sound.add(key, {
                volume: volume,
                loop: config.loop !== undefined ? config.loop : true
            });

            music.play();
            this.sounds.set(key, music);

            // Clean up when music completes
            music.once('complete', () => {
                this.sounds.delete(key);
            });

            return music;
        } catch (error) {
            console.error(`[AudioManager] Error playing music ${key}:`, error);
            return null;
        }
    }

    /**
     * Stop all currently playing audio (sounds, voices, and music)
     */
    stopAll() {
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

    /**
     * Pause all currently playing audio
     */
    pauseAll() {
        this.sounds.forEach(sound => {
            if (sound.isPlaying) {
                sound.pause();
            }
        });

        this.voices.forEach(voice => {
            if (voice.isPlaying) {
                voice.pause();
            }
        });
    }

    /**
     * Resume all paused audio
     */
    resumeAll() {
        this.sounds.forEach(sound => {
            if (sound.isPaused) {
                sound.resume();
            }
        });

        this.voices.forEach(voice => {
            if (voice.isPaused) {
                voice.resume();
            }
        });
    }

    /**
     * Update volumes for all currently playing audio
     * Call this after settings change to apply new volumes immediately
     */
    updateVolumes() {
        this.loadSettings();

        // Update all active sounds
        this.sounds.forEach((sound, key) => {
            const type = key.startsWith('music_') ? 'music' : 'sfx';
            sound.setVolume(this.calculateVolume(type));
        });

        // Update all active voices
        this.voices.forEach(voice => {
            voice.setVolume(this.calculateVolume('sfx'));
        });
    }
}
