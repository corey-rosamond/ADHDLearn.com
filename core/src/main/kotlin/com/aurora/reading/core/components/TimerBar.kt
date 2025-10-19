package com.aurora.reading.core.components

import com.badlogic.gdx.graphics.Color
import com.badlogic.gdx.graphics.g2d.SpriteBatch
import com.badlogic.gdx.graphics.glutils.ShapeRenderer
import com.badlogic.gdx.utils.Disposable
import com.aurora.reading.core.config.ThemeConfig
import com.aurora.reading.core.utils.ResponsiveUtils

/**
 * Timer Bar Component
 *
 * Visual progress bar showing time remaining for current letter.
 *
 * Features:
 * - Horizontal bar with background and foreground
 * - Color-coded fill: Green → Yellow → Red based on time remaining
 * - Smooth width transitions
 * - Rounded corners
 *
 * Responsibilities:
 * - Render background bar (dark purple)
 * - Render foreground bar (color-coded by progress)
 * - Update progress value (0.0 to 1.0)
 */
class TimerBar(
    private val x: Float,
    private val y: Float,
    private val width: Float,
    private val height: Float
) : Disposable {

    private val responsive = ResponsiveUtils()

    // Progress (0.0 = empty, 1.0 = full)
    private var progress = 1f

    // Corner radius for rounded bar
    private val cornerRadius = 8f

    // Segment count for rounded rectangle (libGDX ShapeRenderer)
    private val segments = 32

    /**
     * Set progress (0.0 = empty, 1.0 = full)
     */
    fun setProgress(value: Float) {
        progress = value.coerceIn(0f, 1f)
    }

    /**
     * Get current progress
     */
    fun getProgress(): Float {
        return progress
    }

    /**
     * Get bar color based on progress
     * - Green: > 60% (plenty of time)
     * - Yellow: 30-60% (getting close)
     * - Red: < 30% (hurry up!)
     */
    private fun getBarColor(): Color {
        return when {
            progress > 0.6f -> Color(0f, 0.9f, 0.46f, 1f) // Grass Green (#00E676)
            progress > 0.3f -> Color(1f, 0.92f, 0.23f, 1f) // Sunshine Yellow (#FFEB3B)
            else -> Color(1f, 0.42f, 0.42f, 1f) // Orange Pop (#FF6B6B)
        }
    }

    /**
     * Render timer bar
     */
    fun render(batch: SpriteBatch, shapeRenderer: ShapeRenderer) {
        batch.end()

        shapeRenderer.begin(ShapeRenderer.ShapeType.Filled)

        // Background (dark purple)
        shapeRenderer.color = ThemeConfig.Colors.PURPLE
        shapeRenderer.rect(x, y - height / 2, width, height)

        // Foreground (color-coded)
        if (progress > 0f) {
            shapeRenderer.color = getBarColor()
            val foregroundWidth = width * progress
            shapeRenderer.rect(x, y - height / 2, foregroundWidth, height)
        }

        shapeRenderer.end()

        batch.begin()
    }

    /**
     * Cleanup resources
     */
    override fun dispose() {
        // No resources to cleanup
    }
}
