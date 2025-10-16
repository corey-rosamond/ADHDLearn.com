package com.aurora.reading.core.components

import com.badlogic.gdx.graphics.Color
import com.badlogic.gdx.graphics.g2d.BitmapFont
import com.badlogic.gdx.graphics.g2d.GlyphLayout
import com.badlogic.gdx.graphics.g2d.SpriteBatch
import com.badlogic.gdx.math.Interpolation
import com.badlogic.gdx.utils.Disposable
import com.aurora.reading.core.config.ThemeConfig

/**
 * Animated title text component with stroke effect and bounce-in animation
 */
class TitleText(
    private val text: String,
    private var x: Float,
    private var y: Float,
    private val fontSize: Int = ThemeConfig.Fonts.TITLE_SIZE,
    private val textColor: Color = ThemeConfig.Colors.TEXT_WHITE,
    private val strokeColor: Color = ThemeConfig.Colors.TEXT_STROKE,
    private val strokeWidth: Float = 4f,
    private val bounceIn: Boolean = true,
    private val outerStrokeColor: Color? = null,
    private val outerStrokeWidth: Float = 8f
) : Disposable {

    private val font: BitmapFont
    private val glyphLayout = GlyphLayout()

    // Animation state
    private var currentScale = if (bounceIn) 0f else 1f
    private var animationTime = 0f
    private val bounceDuration = ThemeConfig.Animations.TITLE_BOUNCE
    private var animationComplete = !bounceIn

    init {
        font = BitmapFont().apply {
            data.setScale(fontSize / 40f)
            color = textColor
        }

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
     * Draw the title text with stroke effect
     */
    fun draw(batch: SpriteBatch) {
        val centerX = x - (glyphLayout.width * currentScale) / 2f
        val centerY = y + (glyphLayout.height * currentScale) / 2f

        val prevColor = font.color.cpy()
        font.data.setScale((fontSize / 40f) * currentScale)

        // Draw outer stroke (white) if specified
        if (outerStrokeColor != null) {
            font.color = outerStrokeColor
            val outerOffsets = listOf(-outerStrokeWidth, 0f, outerStrokeWidth)
            for (offsetX in outerOffsets) {
                for (offsetY in outerOffsets) {
                    if (offsetX != 0f || offsetY != 0f) {
                        font.draw(batch, text, centerX + offsetX, centerY + offsetY)
                    }
                }
            }
        }

        // Draw inner stroke (purple)
        font.color = strokeColor
        val offsets = listOf(-strokeWidth, 0f, strokeWidth)
        for (offsetX in offsets) {
            for (offsetY in offsets) {
                if (offsetX != 0f || offsetY != 0f) {
                    font.draw(batch, text, centerX + offsetX, centerY + offsetY)
                }
            }
        }

        // Draw main text
        font.color = textColor
        font.draw(batch, text, centerX, centerY)

        // Restore font settings
        font.color = prevColor
        font.data.setScale(fontSize / 40f)
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
        font.dispose()
    }
}
