package com.aurora.reading.core.services

import com.badlogic.gdx.Gdx
import com.badlogic.gdx.graphics.Color
import com.badlogic.gdx.graphics.g2d.BitmapFont
import com.badlogic.gdx.graphics.g2d.freetype.FreeTypeFontGenerator
import com.badlogic.gdx.graphics.g2d.freetype.FreeTypeFontGenerator.FreeTypeFontParameter

/**
 * Font Manager
 *
 * Generates crisp, anti-aliased fonts using FreeType.
 * Replaces the bitmap font scaling hack with proper font rendering.
 *
 * Responsibilities:
 * - Generate fonts at exact sizes (no scaling)
 * - Support native stroke/border rendering
 * - Cache generated fonts for reuse
 * - Proper resource disposal
 */
object FontManager {

    private const val DEFAULT_FONT_PATH = "fonts/Roboto-Bold.ttf"
    private val fontCache = mutableMapOf<String, BitmapFont>()
    private var generator: FreeTypeFontGenerator? = null

    /**
     * Initialize font manager with font file
     */
    fun init(fontPath: String = DEFAULT_FONT_PATH) {
        if (generator != null) {
            Gdx.app.log("FontManager", "Already initialized")
            return
        }

        try {
            generator = FreeTypeFontGenerator(Gdx.files.internal(fontPath))
            Gdx.app.log("FontManager", "Initialized with font: $fontPath")
        } catch (e: Exception) {
            Gdx.app.error("FontManager", "Failed to load font: $fontPath", e)
            throw RuntimeException("Font initialization failed", e)
        }
    }

    /**
     * Generate a font with specific parameters
     *
     * @param size Font size in pixels
     * @param color Text color
     * @param borderWidth Border width (0 for no border)
     * @param borderColor Border color
     * @param shadowOffsetX Shadow X offset
     * @param shadowOffsetY Shadow Y offset
     * @param shadowColor Shadow color
     * @return Generated BitmapFont (cached for reuse)
     */
    fun getFont(
        size: Int,
        color: Color = Color.WHITE,
        borderWidth: Float = 0f,
        borderColor: Color = Color.BLACK,
        shadowOffsetX: Int = 0,
        shadowOffsetY: Int = 0,
        shadowColor: Color = Color(0f, 0f, 0f, 0f)
    ): BitmapFont {
        requireNotNull(generator) { "FontManager not initialized. Call init() first." }

        // Create cache key based on parameters
        val cacheKey = "size:$size|color:${color}|border:$borderWidth|${borderColor}|shadow:$shadowOffsetX,$shadowOffsetY"

        // Return cached font if exists
        fontCache[cacheKey]?.let { return it }

        // Generate new font
        val parameter = FreeTypeFontParameter().apply {
            this.size = size
            this.color = color
            this.borderWidth = borderWidth
            this.borderColor = borderColor
            this.borderStraight = true
            this.shadowOffsetX = shadowOffsetX
            this.shadowOffsetY = shadowOffsetY
            this.shadowColor = shadowColor
            this.minFilter = com.badlogic.gdx.graphics.Texture.TextureFilter.Linear
            this.magFilter = com.badlogic.gdx.graphics.Texture.TextureFilter.Linear
            this.characters = FreeTypeFontGenerator.DEFAULT_CHARS + "🎈⚙️"  // Add emoji support
        }

        val font = generator!!.generateFont(parameter)
        fontCache[cacheKey] = font

        Gdx.app.log("FontManager", "Generated font: size=$size, border=$borderWidth")
        return font
    }

    /**
     * Get a simple font with just size and color
     */
    fun getFont(size: Int, color: Color): BitmapFont {
        return getFont(
            size = size,
            color = color,
            borderWidth = 0f
        )
    }

    /**
     * Get a font with border/stroke
     */
    fun getFontWithBorder(
        size: Int,
        color: Color,
        borderWidth: Float,
        borderColor: Color
    ): BitmapFont {
        return getFont(
            size = size,
            color = color,
            borderWidth = borderWidth,
            borderColor = borderColor
        )
    }

    /**
     * Clear all cached fonts (call before disposal)
     */
    fun clearCache() {
        fontCache.values.forEach { it.dispose() }
        fontCache.clear()
        Gdx.app.log("FontManager", "Font cache cleared")
    }

    /**
     * Dispose of all resources
     */
    fun dispose() {
        clearCache()
        generator?.dispose()
        generator = null
        Gdx.app.log("FontManager", "Disposed")
    }
}
