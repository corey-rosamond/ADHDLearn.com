package com.aurora.reading.core.components

import com.badlogic.gdx.graphics.Color
import com.badlogic.gdx.graphics.Texture
import com.badlogic.gdx.graphics.g2d.BitmapFont
import com.badlogic.gdx.graphics.g2d.GlyphLayout
import com.badlogic.gdx.graphics.g2d.SpriteBatch
import com.badlogic.gdx.math.Rectangle
import com.badlogic.gdx.utils.Disposable
import com.aurora.reading.core.assets.Assets
import com.aurora.reading.core.config.ThemeConfig
import com.aurora.reading.core.services.FontManager
import kotlin.math.abs

/**
 * Interactive button component with crisp text rendering
 *
 * Uses FreeTypeFontGenerator for sharp, clear button labels.
 * Supports hover and click animations.
 */
class Button(
    private var x: Float,
    private var y: Float,
    private var width: Float,
    private var height: Float,
    private val texturePath: String,
    private val text: String = "",
    private val fontSize: Int = ThemeConfig.Fonts.BUTTON_SIZE,
    private val textColor: Color = ThemeConfig.Colors.TEXT_WHITE,
    private val onClick: () -> Unit = {}
) : Disposable {

    private val texture: Texture = Assets.getTexture(texturePath)
    private val font: BitmapFont
    private val glyphLayout = GlyphLayout()

    // Animation state
    private var targetScale = 1f
    private var currentScale = 1f
    private var isHovered = false
    private var isPressed = false
    private var enabled = true

    // Animation speeds
    private val hoverDuration = ThemeConfig.Animations.BUTTON_HOVER
    private val clickDuration = ThemeConfig.Animations.BUTTON_CLICK

    // Bounds for hit testing
    private val bounds = Rectangle(x, y, width, height)

    init {
        // Generate crisp font at exact size
        font = FontManager.getFont(fontSize, textColor)

        if (text.isNotEmpty()) {
            glyphLayout.setText(font, text)
        }
    }

    /**
     * Update button animation state
     */
    fun update(delta: Float) {
        // Smooth scale interpolation
        if (abs(currentScale - targetScale) > 0.001f) {
            val speed = if (isPressed) 1f / clickDuration else 1f / hoverDuration
            val diff = targetScale - currentScale
            currentScale += diff * speed * delta

            // Clamp to target when very close
            if (abs(currentScale - targetScale) < 0.001f) {
                currentScale = targetScale
            }
        }
    }

    /**
     * Handle touch down event
     */
    fun handleTouchDown(touchX: Float, touchY: Float): Boolean {
        if (!enabled) return false

        if (bounds.contains(touchX, touchY)) {
            isPressed = true
            targetScale = 0.9f
            return true
        }
        return false
    }

    /**
     * Handle touch up event
     */
    fun handleTouchUp(touchX: Float, touchY: Float): Boolean {
        if (!enabled) return false

        val wasPressed = isPressed
        isPressed = false

        if (wasPressed && bounds.contains(touchX, touchY)) {
            targetScale = if (isHovered) 1.1f else 1f
            onClick()
            return true
        }

        targetScale = if (isHovered) 1.1f else 1f
        return false
    }

    /**
     * Handle touch moved event (for hover effect on tablets)
     */
    fun handleTouchMoved(touchX: Float, touchY: Float) {
        if (!enabled) return

        val wasHovered = isHovered
        isHovered = bounds.contains(touchX, touchY)

        if (isHovered != wasHovered && !isPressed) {
            targetScale = if (isHovered) 1.1f else 1f
        }
    }

    /**
     * Reset hover state (call when touch is lifted globally)
     */
    fun resetHover() {
        if (!isPressed) {
            isHovered = false
            targetScale = 1f
        }
    }

    /**
     * Draw the button
     */
    fun draw(batch: SpriteBatch) {
        // Calculate scaled dimensions
        val scaledWidth = width * currentScale
        val scaledHeight = height * currentScale
        val scaledX = x + (width - scaledWidth) / 2f
        val scaledY = y + (height - scaledHeight) / 2f

        // Update bounds for hit testing
        bounds.set(scaledX, scaledY, scaledWidth, scaledHeight)

        // Draw button texture
        val alpha = if (enabled) 1f else 0.5f
        val prevColor = batch.color.cpy()
        batch.setColor(1f, 1f, 1f, alpha)
        batch.draw(texture, scaledX, scaledY, scaledWidth, scaledHeight)
        batch.color = prevColor

        // Draw text if present
        if (text.isNotEmpty()) {
            val textX = x + width / 2f - glyphLayout.width / 2f
            val textY = y + height / 2f + glyphLayout.height / 2f

            val prevFontColor = font.color.cpy()
            font.color = if (enabled) textColor else Color(textColor.r, textColor.g, textColor.b, 0.5f)
            font.draw(batch, text, textX, textY)
            font.color = prevFontColor
        }
    }

    /**
     * Set button position
     */
    fun setPosition(newX: Float, newY: Float) {
        x = newX
        y = newY
        bounds.set(x, y, width, height)
    }

    /**
     * Set button size
     */
    fun setSize(newWidth: Float, newHeight: Float) {
        width = newWidth
        height = newHeight
        bounds.set(x, y, width, height)
    }

    /**
     * Enable or disable the button
     */
    fun setEnabled(value: Boolean) {
        enabled = value
        if (!enabled) {
            isHovered = false
            isPressed = false
            targetScale = 1f
        }
    }

    /**
     * Check if button is enabled
     */
    fun isEnabled(): Boolean = enabled

    /**
     * Get button bounds
     */
    fun getBounds(): Rectangle = bounds

    override fun dispose() {
        // Font is managed by FontManager, don't dispose here
    }
}
