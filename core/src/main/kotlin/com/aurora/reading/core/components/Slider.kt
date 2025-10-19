package com.aurora.reading.core.components

import com.badlogic.gdx.Gdx
import com.badlogic.gdx.graphics.Color
import com.badlogic.gdx.graphics.Pixmap
import com.badlogic.gdx.graphics.Texture
import com.badlogic.gdx.graphics.g2d.BitmapFont
import com.badlogic.gdx.graphics.g2d.GlyphLayout
import com.badlogic.gdx.graphics.g2d.SpriteBatch
import com.badlogic.gdx.graphics.glutils.ShapeRenderer
import com.badlogic.gdx.math.MathUtils
import com.badlogic.gdx.math.Vector2
import com.aurora.reading.core.config.ThemeConfig
import com.aurora.reading.core.services.FontManager
import com.aurora.reading.core.utils.ResponsiveUtils

/**
 * Interactive slider component for volume and settings controls
 *
 * Features:
 * - Label text on left
 * - Value display on right (with suffix like "%")
 * - Draggable slider bar with handle
 * - Yellow→Orange gradient fill
 * - Dark purple background
 * - Hover effect on handle
 * - Real-time value callback
 */
class Slider(
    private val x: Float,
    private val y: Float,
    private val label: String,
    private val minValue: Int = 0,
    private val maxValue: Int = 100,
    initialValue: Int = 50,
    private val suffix: String = "%",
    barWidth: Float? = null,
    barHeight: Float? = null,
    private val onValueChange: ((Int) -> Unit)? = null
) {
    private val responsive = ResponsiveUtils()

    // Dimensions
    private val barWidth: Float = barWidth ?: responsive.scaleX(27f)  // 27% = ~690px
    private val barHeight: Float = barHeight ?: responsive.scaleY(1f)  // 1% = 16px

    // Fonts
    private val labelFont: BitmapFont = FontManager.getFont(responsive.getFontSize(32))
    private val valueFont: BitmapFont = FontManager.getFont(responsive.getFontSize(32))
    private val glyphLayout = GlyphLayout()

    // Current value
    private var currentValue: Int = initialValue.coerceIn(minValue, maxValue)

    // Positions
    private val barX: Float = x
    private val barY: Float = y + responsive.scaleY(3f)  // 3% = ~48px below label
    private val valueX: Float = responsive.getX(80f)

    // Handle
    private val handleRadius: Float = responsive.scaleX(0.8f)  // 0.8% = ~20px
    private var handleX: Float
    private val handleY: Float = barY + (this.barHeight / 2f)

    // Interaction state
    private var isDragging = false
    private var isHovering = false
    private var handleScale = 1f

    // Textures
    private lateinit var barBgTexture: Texture
    private lateinit var barFgTexture: Texture

    // Shape renderer for handle
    private val shapeRenderer = ShapeRenderer()

    init {
        // Calculate initial handle position
        val percentage = ((currentValue - minValue).toFloat() / (maxValue - minValue)) * 100f
        handleX = barX + (this.barWidth * percentage / 100f)

        // Create bar textures
        createBarTextures()
    }

    private fun createBarTextures() {
        // Background bar (dark purple rounded rectangle)
        val bgWidth = barWidth.toInt()
        val bgHeight = barHeight.toInt()
        val bgPixmap = Pixmap(bgWidth, bgHeight, Pixmap.Format.RGBA8888)
        // Use darker version of PURPLE for background
        val darkPurple = Color(0.3f, 0.15f, 0.45f, 1f)
        bgPixmap.setColor(darkPurple)
        bgPixmap.fill()
        barBgTexture = Texture(bgPixmap)
        bgPixmap.dispose()

        updateForegroundTexture()
    }

    private fun updateForegroundTexture() {
        // Dispose old texture if it exists
        if (::barFgTexture.isInitialized) {
            barFgTexture.dispose()
        }

        // Foreground bar (yellow→orange gradient)
        val percentage = ((currentValue - minValue).toFloat() / (maxValue - minValue)) * 100f
        val fgWidth = (barWidth * percentage / 100f).toInt().coerceAtLeast(1)
        val fgHeight = barHeight.toInt()

        val fgPixmap = Pixmap(fgWidth, fgHeight, Pixmap.Format.RGBA8888)

        // Create horizontal gradient from yellow to orange
        for (x in 0 until fgWidth) {
            val ratio = if (fgWidth > 1) x.toFloat() / (fgWidth - 1) else 0f
            val color = Color()
            color.set(ThemeConfig.Colors.STAR_YELLOW).lerp(ThemeConfig.Colors.ORANGE, ratio)
            fgPixmap.setColor(color)
            fgPixmap.drawLine(x, 0, x, fgHeight - 1)
        }

        barFgTexture = Texture(fgPixmap)
        fgPixmap.dispose()
    }

    fun handleTouchDown(touchX: Float, touchY: Float): Boolean {
        // Check if touch is on handle
        val distance = Vector2(touchX - handleX, touchY - handleY).len()
        if (distance <= handleRadius * handleScale * 1.5f) {
            isDragging = true
            return true
        }

        // Check if touch is on bar (snap to position)
        if (touchX >= barX && touchX <= barX + barWidth &&
            touchY >= barY - handleRadius && touchY <= barY + barHeight + handleRadius) {
            handleX = touchX.coerceIn(barX, barX + barWidth)
            updateValue()
            isDragging = true
            return true
        }

        return false
    }

    fun handleTouchDragged(touchX: Float, touchY: Float) {
        if (isDragging) {
            handleX = touchX.coerceIn(barX, barX + barWidth)
            updateValue()
        }
    }

    fun handleTouchUp(touchX: Float, touchY: Float) {
        // Support "tap-to-set" for instant touches (ADB, very fast taps)
        if (!isDragging) {
            // Check if touch is on bar and snap to position
            val inXRange = touchX >= barX && touchX <= barX + barWidth
            val inYRange = touchY >= barY - handleRadius && touchY <= barY + barHeight + handleRadius

            com.badlogic.gdx.Gdx.app.log("Slider", "Touch up at ($touchX, $touchY) - barX=$barX, barY=$barY, barWidth=$barWidth, barHeight=$barHeight, handleRadius=$handleRadius, inX=$inXRange, inY=$inYRange")

            if (inXRange && inYRange) {
                handleX = touchX.coerceIn(barX, barX + barWidth)
                updateValue()
                com.badlogic.gdx.Gdx.app.log("Slider", "Tap-to-set activated! New value=$currentValue")
            }
        }
        isDragging = false
    }

    // Overload for compatibility
    fun handleTouchUp() {
        isDragging = false
    }

    fun checkHover(touchX: Float, touchY: Float) {
        val distance = Vector2(touchX - handleX, touchY - handleY).len()
        isHovering = distance <= handleRadius * handleScale * 1.5f
    }

    private fun updateValue() {
        val percentage = ((handleX - barX) / barWidth) * 100f
        val newValue = MathUtils.round(minValue + ((maxValue - minValue) * percentage / 100f))

        if (newValue != currentValue) {
            currentValue = newValue
            updateForegroundTexture()
            onValueChange?.invoke(currentValue)
        }
    }

    fun update(delta: Float) {
        // Animate handle scale
        val targetScale = if (isHovering || isDragging) 1.2f else 1f
        val scaleSpeed = 5f
        handleScale = MathUtils.lerp(handleScale, targetScale, delta * scaleSpeed)
    }

    fun draw(batch: SpriteBatch) {
        // Draw label
        labelFont.color = ThemeConfig.Colors.TEXT_WHITE
        labelFont.draw(batch, "$label:", x, y)

        // Draw value (right-aligned)
        valueFont.color = ThemeConfig.Colors.STAR_YELLOW
        val valueText = "$currentValue$suffix"
        glyphLayout.setText(valueFont, valueText)
        valueFont.draw(batch, valueText, valueX - glyphLayout.width, y)

        // Draw slider bar background
        batch.draw(barBgTexture, barX, barY, barWidth, barHeight)

        // Draw slider bar foreground
        if (currentValue > minValue) {
            batch.draw(barFgTexture, barX, barY)
        }

        // Must end batch to use ShapeRenderer
        batch.end()

        // Draw handle using ShapeRenderer
        shapeRenderer.projectionMatrix = batch.projectionMatrix
        shapeRenderer.begin(ShapeRenderer.ShapeType.Filled)

        // White fill
        shapeRenderer.setColor(ThemeConfig.Colors.TEXT_WHITE)
        shapeRenderer.circle(handleX, handleY, handleRadius * handleScale)

        shapeRenderer.end()

        // Purple stroke
        shapeRenderer.begin(ShapeRenderer.ShapeType.Line)
        Gdx.gl.glLineWidth(responsive.scaleX(3f))
        shapeRenderer.setColor(ThemeConfig.Colors.PURPLE)
        shapeRenderer.circle(handleX, handleY, handleRadius * handleScale)
        shapeRenderer.end()

        // Restart batch for next components
        batch.begin()
    }

    fun getValue(): Int = currentValue

    fun setValue(value: Int) {
        currentValue = value.coerceIn(minValue, maxValue)
        val percentage = ((currentValue - minValue).toFloat() / (maxValue - minValue)) * 100f
        handleX = barX + (barWidth * percentage / 100f)
        updateForegroundTexture()
    }

    fun dispose() {
        barBgTexture.dispose()
        barFgTexture.dispose()
        shapeRenderer.dispose()
    }
}
