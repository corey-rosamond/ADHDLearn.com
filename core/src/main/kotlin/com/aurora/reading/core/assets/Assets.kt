package com.aurora.reading.core.assets

import com.badlogic.gdx.assets.AssetManager
import com.badlogic.gdx.audio.Sound
import com.badlogic.gdx.graphics.Texture
import com.badlogic.gdx.graphics.g2d.BitmapFont
import com.badlogic.gdx.graphics.g2d.freetype.FreeTypeFontGenerator

/**
 * Central asset management for Aurora's Reading Adventure
 */
object Assets {
    private val manager = AssetManager()

    // Asset paths
    object Images {
        const val GAME_BACKGROUND = "images/game-background.png"
        const val ICON_192 = "images/icon-192.png"
        const val ICON_512 = "images/icon-512.png"

        // Fun decorative assets from Game Assets library
        const val BUG_MONSTER = "images/onet26-bug.png"  // Purple 3-eyed monster
        const val BUG_ALT = "images/onet08-bug-alt.png"  // Orange excited blob
        const val ICECREAM = "images/onet17-icecream.png"
        const val DONUT = "images/onet18-donut.png"
        const val CUPCAKE = "images/onet19-cupcake.png"
        const val FLOWER = "images/onet27-flower.png"
        const val CROWN = "images/icon-crown.png"
        const val ICON_HINTS = "images/icon-hints.png"  // Magnifying glass (debug/inspection)
        const val HEART_RED = "images/heart-red.png"  // Red glossy heart decoration
        const val HEART_GEM = "images/heart-gem.png"  // Pink gem heart decoration
    }

    object UI {
        const val BTN_BLUE = "ui/Btn_Blue.png"
        const val BTN_BLUE_PRESSED = "ui/Btn_Blue_Pressed.png"
        const val BTN_GREEN = "ui/Btn_Green.png"
        const val BTN_GEEN_PRESSED = "ui/Btn_Geen_Pressed.png"
        const val BTN_BROWN = "ui/Btn_Brown.png"
        const val BTN_SETTING = "ui/Btn_Setting.png"
        const val BTN_SETTING_PRESSED = "ui/Btn_Setting_Pressed.png"
        const val BTN_HOME = "ui/Btn_Home.png"
        const val BTN_PAUSE = "ui/Btn_Pause.png"
        const val BOX_BG = "ui/Box_Bg.png"
    }

    object Audio {
        const val BUBBLE_POP = "audio/bubble-pop.mp3"
        const val POP = "audio/pop.mp3"
        const val CORRECT_ANSWER = "audio/correct-answer.mp3"
        const val WRONG_ANSWER = "audio/wrong-answer.mp3"
        const val SUCCESS = "audio/success.mp3"
        const val GAME_COMPLETE = "audio/game-complete.mp3"
        const val WELCOME = "audio/welcome.mp3"

        fun getLetter(letter: Char): String {
            return "audio/letters/${letter.uppercaseChar()}.mp3"
        }

        fun getFindLetter(letter: Char): String {
            return "audio/find_letter_${letter.uppercaseChar()}.mp3"
        }
    }

    /**
     * Queue all assets for loading
     */
    fun loadAll() {
        // Load images
        manager.load(Images.GAME_BACKGROUND, Texture::class.java)
        manager.load(Images.ICON_192, Texture::class.java)
        manager.load(Images.ICON_512, Texture::class.java)

        // Load decorative assets
        manager.load(Images.BUG_MONSTER, Texture::class.java)
        manager.load(Images.BUG_ALT, Texture::class.java)
        manager.load(Images.ICECREAM, Texture::class.java)
        manager.load(Images.DONUT, Texture::class.java)
        manager.load(Images.CUPCAKE, Texture::class.java)
        manager.load(Images.FLOWER, Texture::class.java)
        manager.load(Images.CROWN, Texture::class.java)
        manager.load(Images.ICON_HINTS, Texture::class.java)
        manager.load(Images.HEART_RED, Texture::class.java)
        manager.load(Images.HEART_GEM, Texture::class.java)

        // Load UI elements
        manager.load(UI.BTN_BLUE, Texture::class.java)
        manager.load(UI.BTN_BLUE_PRESSED, Texture::class.java)
        manager.load(UI.BTN_GREEN, Texture::class.java)
        manager.load(UI.BTN_GEEN_PRESSED, Texture::class.java)
        manager.load(UI.BTN_BROWN, Texture::class.java)
        manager.load(UI.BTN_SETTING, Texture::class.java)
        manager.load(UI.BTN_SETTING_PRESSED, Texture::class.java)
        manager.load(UI.BTN_HOME, Texture::class.java)
        manager.load(UI.BTN_PAUSE, Texture::class.java)
        manager.load(UI.BOX_BG, Texture::class.java)

        // Load audio
        manager.load(Audio.BUBBLE_POP, Sound::class.java)
        manager.load(Audio.POP, Sound::class.java)
        manager.load(Audio.CORRECT_ANSWER, Sound::class.java)
        manager.load(Audio.WRONG_ANSWER, Sound::class.java)
        manager.load(Audio.SUCCESS, Sound::class.java)
        manager.load(Audio.GAME_COMPLETE, Sound::class.java)
        manager.load(Audio.WELCOME, Sound::class.java)

        // Load letter audio (A-Z)
        for (letter in 'A'..'Z') {
            manager.load(Audio.getLetter(letter), Sound::class.java)
            manager.load(Audio.getFindLetter(letter), Sound::class.java)
        }
    }

    /**
     * Update asset loading. Returns true when complete.
     */
    fun update(): Boolean {
        return manager.update()
    }

    /**
     * Get loading progress (0.0 to 1.0)
     */
    fun getProgress(): Float {
        return manager.progress
    }

    /**
     * Get a texture asset
     */
    fun getTexture(path: String): Texture {
        return manager.get(path, Texture::class.java)
    }

    /**
     * Get a sound asset
     */
    fun getSound(path: String): Sound {
        return manager.get(path, Sound::class.java)
    }

    /**
     * Dispose of all assets
     */
    fun dispose() {
        manager.dispose()
    }
}
