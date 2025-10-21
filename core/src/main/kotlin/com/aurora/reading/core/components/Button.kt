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
 * Can display an optional icon above the text.
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
    private val iconTexture: Texture? = null,
    private val iconSize: Float = 0f,
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
     *
     * Note: Supports "quick taps" where touch down might be missed (instant ADB touches, very fast taps).
     * Any touch up within bounds will trigger onClick, regardless of whether we saw the touch down.
     */
    fun handleTouchUp(touchX: Float, touchY: Float): Boolean {
        if (!enabled) return false

        val wasPressed = isPressed
        isPressed = false

        com.badlogic.gdx.Gdx.app.log("Button", "handleTouchUp at ($touchX, $touchY), bounds=(${bounds.x}, ${bounds.y}, ${bounds.width}, ${bounds.height}), contains=${bounds.contains(touchX, touchY)}")

        // Trigger onClick for any touch release within bounds, even if we missed the touch down
        if (bounds.contains(touchX, touchY)) {
            targetScale = if (isHovered) 1.1f else 1f
            com.badlogic.gdx.Gdx.app.log("Button", "onClick triggered!")
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
        val scaledDimensions = calculateScaledDimensions()
        updateBoundsForHitTesting(scaledDimensions)

        val alpha = if (enabled) 1f else 0.5f

        drawButtonTexture(batch, scaledDimensions, alpha)
        drawIcon(batch, scaledDimensions, alpha)
        drawText(batch, scaledDimensions)
    }

    /**
     * Calculate scaled dimensions
     */
    private fun calculateScaledDimensions(): ScaledDimensions {
        val scaledWidth = width * currentScale
        val scaledHeight = height * currentScale
        val scaledX = x + (width - scaledWidth) / 2f
        val scaledY = y + (height - scaledHeight) / 2f
        return ScaledDimensions(scaledX, scaledY, scaledWidth, scaledHeight)
    }

    /**
     * Update bounds for hit testing
     */
    private fun updateBoundsForHitTesting(dims: ScaledDimensions) {
        bounds.set(dims.x, dims.y, dims.width, dims.height)
    }

    /**
     * Draw button texture
     */
    private fun drawButtonTexture(batch: SpriteBatch, dims: ScaledDimensions, alpha: Float) {
        val prevColor = batch.color.cpy()
        batch.setColor(1f, 1f, 1f, alpha)
        batch.draw(texture, dims.x, dims.y, dims.width, dims.height)
        batch.color = prevColor
    }

    /**
     * Draw button icon if present
     */
    private fun drawIcon(batch: SpriteBatch, dims: ScaledDimensions, alpha: Float) {
        if (iconTexture == null || iconSize <= 0f) return

        val scaledIconSize = iconSize * currentScale
        val iconX = dims.x + dims.width / 2f - scaledIconSize / 2f
        val iconY = dims.y + dims.height / 2f + scaledIconSize / 6f

        val prevColor = batch.color.cpy()
        batch.setColor(1f, 1f, 1f, alpha)
        batch.draw(iconTexture, iconX, iconY, scaledIconSize, scaledIconSize)
        batch.color = prevColor
    }

    /**
     * Draw button text if present
     */
    private fun drawText(batch: SpriteBatch, dims: ScaledDimensions) {
        if (text.isEmpty()) return

        val scaledTextX = dims.x + dims.width / 2f - (glyphLayout.width * currentScale) / 2f
        val scaledTextY = if (iconTexture != null && iconSize > 0f) {
            dims.y + dims.height / 2f - (glyphLayout.height * currentScale) * 0.5f
        } else {
            dims.y + dims.height / 2f + (glyphLayout.height * currentScale) / 2f
        }

        val prevFontColor = font.color.cpy()
        val prevScaleX = font.data.scaleX
        val prevScaleY = font.data.scaleY

        font.color = if (enabled) textColor else Color(textColor.r, textColor.g, textColor.b, 0.5f)
        font.data.setScale(currentScale)
        font.draw(batch, text, scaledTextX, scaledTextY)

        font.data.setScale(prevScaleX, prevScaleY)
        font.color = prevFontColor
    }

    /**
     * Helper class for scaled dimensions
     */
    private data class ScaledDimensions(
        val x: Float,
        val y: Float,
        val width: Float,
        val height: Float
    )

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
