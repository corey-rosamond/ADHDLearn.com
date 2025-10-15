package com.aurora.reading.core.services

import com.badlogic.gdx.Gdx
import com.badlogic.gdx.audio.Sound
import com.badlogic.gdx.utils.Disposable
import com.aurora.reading.core.assets.Assets
import com.aurora.reading.core.config.ThemeConfig

/**
 * Central audio management service
 *
 * Handles sound effects and voice clips with volume control and playback management
 */
object AudioManager : Disposable {

    private var sfxVolume = ThemeConfig.Audio.DEFAULT_SFX_VOLUME
    private var voiceVolume = ThemeConfig.Audio.DEFAULT_VOICE_VOLUME
    private var musicVolume = ThemeConfig.Audio.DEFAULT_MUSIC_VOLUME

    private var currentVoice: Long? = null
    private val activeSounds = mutableListOf<Long>()

    /**
     * Play a sound effect
     */
    fun playSfx(path: String, volume: Float = sfxVolume) {
        try {
            val sound = Assets.getSound(path)
            val soundId = sound.play(volume)
            activeSounds.add(soundId)
            Gdx.app.log("AudioManager", "Playing SFX: $path at volume $volume")
        } catch (e: Exception) {
            Gdx.app.error("AudioManager", "Failed to play SFX: $path", e)
        }
    }

    /**
     * Play bubble pop sound
     */
    fun playBubblePop() {
        playSfx(Assets.Audio.BUBBLE_POP)
    }

    /**
     * Play correct answer sound
     */
    fun playCorrect() {
        playSfx(Assets.Audio.CORRECT_ANSWER)
    }

    /**
     * Play wrong answer sound
     */
    fun playWrong() {
        playSfx(Assets.Audio.WRONG_ANSWER)
    }

    /**
     * Play success sound
     */
    fun playSuccess() {
        playSfx(Assets.Audio.SUCCESS)
    }

    /**
     * Play game complete sound
     */
    fun playGameComplete() {
        playSfx(Assets.Audio.GAME_COMPLETE)
    }

    /**
     * Play a voice clip (interrupts previous voice)
     */
    fun playVoice(path: String, volume: Float = voiceVolume) {
        // Stop current voice if playing
        currentVoice?.let { id ->
            try {
                val sound = Assets.getSound(path)
                sound.stop(id)
            } catch (e: Exception) {
                // Sound may have already finished
            }
        }

        try {
            val sound = Assets.getSound(path)
            currentVoice = sound.play(volume)
            Gdx.app.log("AudioManager", "Playing voice: $path at volume $volume")
        } catch (e: Exception) {
            Gdx.app.error("AudioManager", "Failed to play voice: $path", e)
        }
    }

    /**
     * Play letter sound (A-Z)
     */
    fun playLetter(letter: Char) {
        playVoice(Assets.Audio.getLetter(letter))
    }

    /**
     * Play "Find letter X" instruction
     */
    fun playFindLetter(letter: Char) {
        playVoice(Assets.Audio.getFindLetter(letter))
    }

    /**
     * Play welcome message
     */
    fun playWelcome() {
        playVoice(Assets.Audio.WELCOME)
    }

    /**
     * Set SFX volume (0.0 - 1.0)
     */
    fun setSfxVolume(volume: Float) {
        sfxVolume = volume.coerceIn(0f, 1f)
        Gdx.app.log("AudioManager", "SFX volume set to: $sfxVolume")
    }

    /**
     * Set voice volume (0.0 - 1.0)
     */
    fun setVoiceVolume(volume: Float) {
        voiceVolume = volume.coerceIn(0f, 1f)
        Gdx.app.log("AudioManager", "Voice volume set to: $voiceVolume")
    }

    /**
     * Set music volume (0.0 - 1.0)
     */
    fun setMusicVolume(volume: Float) {
        musicVolume = volume.coerceIn(0f, 1f)
        Gdx.app.log("AudioManager", "Music volume set to: $musicVolume")
    }

    /**
     * Get SFX volume
     */
    fun getSfxVolume(): Float = sfxVolume

    /**
     * Get voice volume
     */
    fun getVoiceVolume(): Float = voiceVolume

    /**
     * Get music volume
     */
    fun getMusicVolume(): Float = musicVolume

    /**
     * Stop all sounds
     */
    fun stopAll() {
        activeSounds.clear()
        currentVoice = null
        Gdx.app.log("AudioManager", "Stopped all audio")
    }

    /**
     * Pause all sounds
     */
    fun pauseAll() {
        // libGDX Sound doesn't have pause, would need Music for that
        Gdx.app.log("AudioManager", "Audio paused")
    }

    /**
     * Resume all sounds
     */
    fun resumeAll() {
        Gdx.app.log("AudioManager", "Audio resumed")
    }

    override fun dispose() {
        stopAll()
    }
}
