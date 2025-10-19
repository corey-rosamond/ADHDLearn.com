package com.aurora.reading.core.components

import com.badlogic.gdx.graphics.Color
import com.badlogic.gdx.graphics.g2d.BitmapFont
import com.badlogic.gdx.graphics.g2d.GlyphLayout
import com.badlogic.gdx.graphics.g2d.SpriteBatch
import com.badlogic.gdx.math.Interpolation
import com.badlogic.gdx.utils.Disposable
import com.aurora.reading.core.config.ThemeConfig
import com.aurora.reading.core.services.FontManager

/**
 * Animated title text component with crisp rendering
 *
 * Uses FreeTypeFontGenerator for sharp, clear text rendering.
 * Replaces the old bitmap font scaling hack with proper font generation.
 *
 * Features:
 * - Native border/stroke rendering (1 draw call, not 9)
 * - Crisp anti-aliased text at any size
 * - Bounce-in animation
 * - Perfect clarity for 5-year-old readers
 */
class TitleText(
    private val text: String,
    private var x: Float,
    private var y: Float,
    private val fontSize: Int = ThemeConfig.Fonts.TITLE_SIZE,
    private val textColor: Color = ThemeConfig.Colors.TEXT_WHITE,
    private val borderColor: Color = ThemeConfig.Colors.TEXT_STROKE,
    private val borderWidth: Float = 4f,
    private val bounceIn: Boolean = true
) : Disposable {

    private val font: BitmapFont
    private val glyphLayout = GlyphLayout()

    // Animation state
    private var currentScale = if (bounceIn) 0f else 1f
    private var animationTime = 0f
    private val bounceDuration = ThemeConfig.Animations.TITLE_BOUNCE
    private var animationComplete = !bounceIn

    init {
        // Generate crisp font with native border support
        font = FontManager.getFontWithBorder(
            size = fontSize,
            color = textColor,
            borderWidth = borderWidth,
            borderColor = borderColor
        )

        glyphLayout.setText(font, text)
    }

    /**
     * Update animation state
     */
    fun update(delta: Float) {
        if (animationComplete) return

        animationTime += delta

        if (animationTime >= bounceDuration) {
            currentScale = 1f
            animationComplete = true
        } else {
            // Elastic bounce-in interpolation
            val progress = animationTime / bounceDuration
            currentScale = Interpolation.swingOut.apply(progress)
        }
    }

    /**
     * Draw the title text (single draw call!)
     */
    fun draw(batch: SpriteBatch) {
        // Calculate centered position
        val centerX = x - (glyphLayout.width * currentScale) / 2f
        val centerY = y + (glyphLayout.height * currentScale) / 2f

        // Apply scale if animating
        if (currentScale != 1f) {
            font.data.setScale(currentScale)
        }

        // Draw text (single draw call with native border)
        font.draw(batch, text, centerX, centerY)

        // Reset scale
        if (currentScale != 1f) {
            font.data.setScale(1f)
        }
    }

    /**
     * Set text position
     */
    fun setPosition(newX: Float, newY: Float) {
        x = newX
        y = newY
    }

    /**
     * Get text width
     */
    fun getWidth(): Float = glyphLayout.width

    /**
     * Get text height
     */
    fun getHeight(): Float = glyphLayout.height

    /**
     * Reset animation to play again
     */
    fun resetAnimation() {
        currentScale = 0f
        animationTime = 0f
        animationComplete = false
    }

    /**
     * Skip animation and show immediately
     */
    fun skipAnimation() {
        currentScale = 1f
        animationTime = bounceDuration
        animationComplete = true
    }

    /**
     * Check if animation is complete
     */
    fun isAnimationComplete(): Boolean = animationComplete

    override fun dispose() {
        // Font is managed by FontManager, don't dispose here
    }
}
