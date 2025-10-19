package com.aurora.reading.core.components

import com.badlogic.gdx.Gdx
import com.badlogic.gdx.graphics.Color
import com.badlogic.gdx.graphics.Pixmap
import com.badlogic.gdx.graphics.Texture
import com.badlogic.gdx.graphics.g2d.BitmapFont
import com.badlogic.gdx.graphics.g2d.GlyphLayout
import com.badlogic.gdx.graphics.g2d.SpriteBatch
import com.badlogic.gdx.math.Rectangle
import com.aurora.reading.core.config.ThemeConfig
import com.aurora.reading.core.services.AudioManager
import com.aurora.reading.core.services.FontManager
import com.aurora.reading.core.utils.ResponsiveUtils

/**
 * Case Selector Component
 *
 * Radio button-style selector for letter case (Uppercase/Lowercase/Mixed)
 *
 * Features:
 * - Three mutually exclusive options
 * - Visual selection indicator (green for selected, purple for unselected)
 * - Label and description text for each option
 * - Hover effects on options
 * - Real-time selection callback
 */
class CaseSelector(
    private val x: Float,
    private val y: Float,
    initialValue: String = "uppercase",
    private val onValueChange: ((String) -> Unit)? = null
) {
    private val responsive = ResponsiveUtils()

    // Fonts
    private val labelFont: BitmapFont = FontManager.getFont(responsive.getFontSize(28))
    private val optionLabelFont: BitmapFont = FontManager.getFont(responsive.getFontSize(32))
    private val optionDescFont: BitmapFont = FontManager.getFont(responsive.getFontSize(18))
    private val glyphLayout = GlyphLayout()

    // Options
    data class CaseOption(
        val value: String,
        val label: String,
        val description: String
    )

    private val options = listOf(
        CaseOption("uppercase", "ABC", "Uppercase"),
        CaseOption("lowercase", "abc", "Lowercase"),
        CaseOption("mixed", "Abc", "Mixed")
    )

    // Current selection
    private var selectedValue: String = initialValue

    // Button dimensions
    private val buttonWidth = responsive.scaleX(8f)  // 8% = ~205px
    private val buttonHeight = responsive.scaleY(4.4f)  // 4.4% = ~70px
    private val buttonSpacing = responsive.scaleX(0.8f)  // 0.8% = ~20px
    private val labelY = y

    // Button textures
    private val buttonTextures = mutableMapOf<String, Texture>()
    private val buttonRects = mutableListOf<Rectangle>()

    // Interaction state
    private var hoveredIndex: Int = -1
    private val hoverScales = FloatArray(3) { 1f }

    init {
        createButtonTextures()
        createButtonRects()
    }

    private fun createButtonTextures() {
        options.forEach { option ->
            val isSelected = option.value == selectedValue
            buttonTextures[option.value] = createButtonTexture(isSelected)
        }
    }

    private fun createButtonTexture(isSelected: Boolean): Texture {
        val width = buttonWidth.toInt()
        val height = buttonHeight.toInt()
        val pixmap = Pixmap(width, height, Pixmap.Format.RGBA8888)

        // Fill with color (green if selected, dark purple if not)
        val bgColor = if (isSelected) ThemeConfig.Colors.BUTTON_GREEN else Color(0.35f, 0.18f, 0.35f, 1f)
        pixmap.setColor(bgColor)
        pixmap.fill()

        val texture = Texture(pixmap)
        pixmap.dispose()
        return texture
    }

    private fun createButtonRects() {
        val startX = x
        val btnY = y + responsive.scaleY(3f)  // 3% below label

        options.forEachIndexed { index, _ ->
            val btnX = startX + (index * (buttonWidth + buttonSpacing))
            buttonRects.add(Rectangle(btnX, btnY, buttonWidth, buttonHeight))
        }
    }

    fun handleTouchDown(touchX: Float, touchY: Float): Boolean {
        buttonRects.forEachIndexed { index, rect ->
            if (rect.contains(touchX, touchY)) {
                selectOption(index)
                AudioManager.playCorrect()
                return true
            }
        }
        return false
    }

    fun handleTouchUp(touchX: Float, touchY: Float) {
        // No action needed for touch up
    }

    fun handleHover(touchX: Float, touchY: Float) {
        var foundHover = false
        buttonRects.forEachIndexed { index, rect ->
            if (rect.contains(touchX, touchY)) {
                hoveredIndex = index
                foundHover = true
            }
        }
        if (!foundHover) {
            hoveredIndex = -1
        }
    }

    private fun selectOption(index: Int) {
        val option = options[index]
        if (selectedValue != option.value) {
            selectedValue = option.value

            // Recreate button textures
            buttonTextures.values.forEach { it.dispose() }
            buttonTextures.clear()
            createButtonTextures()

            // Callback
            onValueChange?.invoke(selectedValue)
        }
    }

    fun update(delta: Float) {
        // Animate hover scales
        hoverScales.forEachIndexed { index, currentScale ->
            val targetScale = if (index == hoveredIndex) 1.1f else 1f
            val scaleSpeed = 8f
            hoverScales[index] = currentScale + ((targetScale - currentScale) * delta * scaleSpeed)
        }
    }

    fun draw(batch: SpriteBatch) {
        // Draw label
        labelFont.color = ThemeConfig.Colors.TEXT_WHITE
        labelFont.draw(batch, "Letter Case:", x, labelY)

        // Draw buttons
        buttonRects.forEachIndexed { index, rect ->
            val option = options[index]
            val texture = buttonTextures[option.value]!!

            // Draw button background
            batch.draw(texture, rect.x, rect.y, buttonWidth, buttonHeight)

            // Draw option label (e.g., "ABC")
            val scale = hoverScales[index]
            optionLabelFont.color = ThemeConfig.Colors.STAR_YELLOW
            glyphLayout.setText(optionLabelFont, option.label)
            val labelX = rect.x + (buttonWidth / 2f) - (glyphLayout.width * scale / 2f)
            val labelY = rect.y + (buttonHeight * 0.65f)
            optionLabelFont.data.setScale(scale)
            optionLabelFont.draw(batch, option.label, labelX, labelY)
            optionLabelFont.data.setScale(1f)

            // Draw option description (e.g., "Uppercase")
            optionDescFont.color = ThemeConfig.Colors.TEXT_WHITE
            glyphLayout.setText(optionDescFont, option.description)
            val descX = rect.x + (buttonWidth / 2f) - (glyphLayout.width * scale / 2f)
            val descY = rect.y + (buttonHeight * 0.35f)
            optionDescFont.data.setScale(scale)
            optionDescFont.draw(batch, option.description, descX, descY)
            optionDescFont.data.setScale(1f)
        }
    }

    fun getValue(): String = selectedValue

    fun setValue(value: String) {
        if (options.any { it.value == value }) {
            selectedValue = value
            // Recreate button textures
            buttonTextures.values.forEach { it.dispose() }
            buttonTextures.clear()
            createButtonTextures()
        }
    }

    fun dispose() {
        buttonTextures.values.forEach { it.dispose() }
        buttonTextures.clear()
    }
}
