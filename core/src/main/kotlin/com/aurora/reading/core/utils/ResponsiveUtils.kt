package com.aurora.reading.core.utils

import com.badlogic.gdx.graphics.Color

/**
 * Responsive utility for Samsung Galaxy Tab S7 FE (2560x1600 landscape)
 *
 * Provides percentage-based positioning and scaling to match Phaser implementation
 */
class ResponsiveUtils(
    private val worldWidth: Float = 2560f,
    private val worldHeight: Float = 1600f
) {

    val centerX: Float = worldWidth / 2f
    val centerY: Float = worldHeight / 2f

    /**
     * Get X coordinate from percentage (0-100)
     */
    fun getX(percent: Float): Float {
        return worldWidth * (percent / 100f)
    }

    /**
     * Get Y coordinate from percentage (0-100)
     */
    fun getY(percent: Float): Float {
        return worldHeight * (percent / 100f)
    }

    /**
     * Scale X dimension by percentage of world width
     */
    fun scaleX(percent: Float): Float {
        return worldWidth * (percent / 100f)
    }

    /**
     * Scale Y dimension by percentage of world height
     */
    fun scaleY(percent: Float): Float {
        return worldHeight * (percent / 100f)
    }

    /**
     * Get font size scaled for resolution
     */
    fun getFontSize(baseSize: Int): Int {
        // Scale based on world height (1600px)
        return (baseSize * (worldHeight / 1000f)).toInt()
    }

    /**
     * Create gradient color array for backgrounds
     */
    fun createGradientColors(vararg hexColors: String): Array<Color> {
        return hexColors.map { hexToColor(it) }.toTypedArray()
    }

    /**
     * Convert hex color string to libGDX Color
     */
    fun hexToColor(hex: String): Color {
        val cleanHex = hex.removePrefix("#")
        val r = cleanHex.substring(0, 2).toInt(16) / 255f
        val g = cleanHex.substring(2, 4).toInt(16) / 255f
        val b = cleanHex.substring(4, 6).toInt(16) / 255f
        return Color(r, g, b, 1f)
    }

    companion object {
        /**
         * Standard tablet resolution
         */
        const val WORLD_WIDTH = 2560f
        const val WORLD_HEIGHT = 1600f
    }
}
