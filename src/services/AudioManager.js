/**
 * AudioManager
 *
 * Singleton service for managing all game audio (sounds and voices).
 *
 * Responsibilities:
 * - Play sound effects with overlap prevention
 * - Play voice clips with interruption (only one voice at a time)
 * - Manage separate volume controls for sounds and voices
 * - Handle missing audio files gracefully
 * - Provide consistent audio behavior across all scenes
 *
 * Dependencies:
 * - Phaser.Scene (for sound system access)
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
        this.soundVolume = 0.7;
        this.voiceVolume = 1.0;

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
     * Initialize AudioManager with a Phaser scene reference
     * @param {Phaser.Scene} scene - The current Phaser scene
     */
    init(scene) {
        this.scene = scene;
        console.log('[AudioManager] Initialized with scene:', scene.scene.key);
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
            console.warn('[AudioManager] Cannot play sound - not initialized');
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

            const sound = this.scene.sound.add(key, {
                volume: config.volume !== undefined ? config.volume : this.soundVolume,
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

    /**
     * Play a voice clip
     * Stops any currently playing voice to ensure only one voice plays at a time
     * @param {string} key - The audio key from Phaser's cache
     * @param {Object} config - Optional configuration {volume}
     * @returns {Phaser.Sound.BaseSound|null} The voice object or null if error
     */
    playVoice(key, config = {}) {
        if (!this.scene) {
            console.warn('[AudioManager] Cannot play voice - not initialized');
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

            const voice = this.scene.sound.add(key, {
                volume: config.volume !== undefined ? config.volume : this.voiceVolume,
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

    /**
     * Stop all currently playing audio (sounds and voices)
     */
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

    /**
     * Set volume for sounds or voices
     * @param {string} type - Either 'sound' or 'voice'
     * @param {number} volume - Volume level between 0.0 and 1.0
     */
    setVolume(type, volume) {
        const clampedVolume = Math.max(0, Math.min(1, volume));

        if (type === 'sound') {
            this.soundVolume = clampedVolume;
            console.log(`[AudioManager] Sound volume set to: ${clampedVolume}`);
        } else if (type === 'voice') {
            this.voiceVolume = clampedVolume;
            console.log(`[AudioManager] Voice volume set to: ${clampedVolume}`);
        } else {
            console.warn(`[AudioManager] Invalid volume type: ${type}. Use 'sound' or 'voice'.`);
        }
    }
}
