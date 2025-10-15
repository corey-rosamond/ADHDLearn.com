package com.aurora.reading.core.config

import com.badlogic.gdx.graphics.Color

/**
 * Centralized theme configuration matching Phaser design
 */
object ThemeConfig {

    /**
     * Color palette for the application
     */
    object Colors {
        // Gradient backgrounds
        val PURPLE = Color(0.4f, 0.2f, 0.6f, 1f)          // #6633cc
        val PINK = Color(0.9f, 0.4f, 0.7f, 1f)            // #e566b3
        val ORANGE = Color(1.0f, 0.5f, 0.2f, 1f)          // #ff8033
        val SKY_BLUE = Color(0.53f, 0.81f, 0.92f, 1f)     // #87ceeb
        val TURQUOISE = Color(0.25f, 0.88f, 0.82f, 1f)    // #40e0d0

        // Button colors
        val BUTTON_BLUE = Color(0.2f, 0.6f, 1.0f, 1f)     // #3399ff
        val BUTTON_GREEN = Color(0.2f, 0.8f, 0.4f, 1f)    // #33cc66
        val BUTTON_RED = Color(1.0f, 0.3f, 0.3f, 1f)      // #ff4d4d

        // Text colors
        val TEXT_WHITE = Color.WHITE
        val TEXT_DARK = Color(0.2f, 0.2f, 0.3f, 1f)       // #333344
        val TEXT_STROKE = Color(0.3f, 0.2f, 0.4f, 1f)     // #4d3366

        // Particle colors
        val STAR_YELLOW = Color(1.0f, 0.95f, 0.4f, 1f)    // #fff266
        val STAR_PINK = Color(1.0f, 0.7f, 0.9f, 1f)       // #ffb3e6
    }

    /**
     * Font configuration
     */
    object Fonts {
        const val TITLE_SIZE = 72
        const val SUBTITLE_SIZE = 48
        const val BUTTON_SIZE = 36
        const val BODY_SIZE = 32
        const val SMALL_SIZE = 24

        const val FAMILY = "Arial"  // Default font
    }

    /**
     * Animation durations (in seconds)
     */
    object Animations {
        const val BUTTON_HOVER = 0.2f
        const val BUTTON_CLICK = 0.15f
        const val TITLE_BOUNCE = 0.5f
        const val BUBBLE_POP = 0.3f
        const val FADE_IN = 0.3f
        const val FADE_OUT = 0.3f
        const val PULSE = 0.3f
    }

    /**
     * Spacing and layout
     */
    object Layout {
        const val PADDING_SMALL = 20f
        const val PADDING_MEDIUM = 40f
        const val PADDING_LARGE = 60f

        const val BUTTON_SPACING = 30f
        const val TITLE_SPACING = 100f
    }

    /**
     * Audio settings
     */
    object Audio {
        const val DEFAULT_MUSIC_VOLUME = 0.7f
        const val DEFAULT_SFX_VOLUME = 1.0f
        const val DEFAULT_VOICE_VOLUME = 1.0f
    }

    /**
     * Gradient presets for backgrounds
     */
    object Gradients {
        val MAIN_MENU = arrayOf(
            Colors.PURPLE,
            Colors.PINK,
            Colors.ORANGE
        )

        val LETTER_POP_MENU = arrayOf(
            Colors.SKY_BLUE,
            Colors.TURQUOISE
        )

        val SETTINGS = arrayOf(
            Colors.PURPLE,
            Color(0.5f, 0.3f, 0.7f, 1f)  // Darker purple
        )

        val RESULTS = arrayOf(
            Colors.PINK,
            Colors.ORANGE
        )
    }
}
