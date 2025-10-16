package com.aurora.reading.core.components

import com.badlogic.gdx.graphics.Color
import com.badlogic.gdx.graphics.Pixmap
import com.badlogic.gdx.graphics.Texture
import com.badlogic.gdx.graphics.g2d.SpriteBatch
import com.badlogic.gdx.utils.Disposable

/**
 * Gradient background component
 * Creates vertical gradient textures for scene backgrounds
 */
class GradientBackground(
    private val width: Float,
    private val height: Float,
    private val colors: Array<Color>
) : Disposable {

    private val texture: Texture

    init {
        texture = createGradientTexture()
    }

    /**
     * Create a gradient texture from the color array
     */
    private fun createGradientTexture(): Texture {
        val pixmapHeight = 256
        val pixmap = Pixmap(1, pixmapHeight, Pixmap.Format.RGBA8888)

        for (y in 0 until pixmapHeight) {
            val progress = y.toFloat() / pixmapHeight

            // Interpolate between colors
            val color = interpolateColors(progress)
            pixmap.setColor(color)
            pixmap.drawPixel(0, pixmapHeight - y - 1)
        }

        val tex = Texture(pixmap)
        pixmap.dispose()
        return tex
    }

    /**
     * Interpolate between multiple colors based on progress (0.0 to 1.0)
     */
    private fun interpolateColors(progress: Float): Color {
        if (colors.size == 1) return colors[0]

        val segments = colors.size - 1
        val segment = (progress * segments).toInt().coerceIn(0, segments - 1)
        val localProgress = (progress * segments) - segment

        val color1 = colors[segment]
        val color2 = colors[(segment + 1).coerceAtMost(colors.size - 1)]

        return Color(
            color1.r + (color2.r - color1.r) * localProgress,
            color1.g + (color2.g - color1.g) * localProgress,
            color1.b + (color2.b - color1.b) * localProgress,
            1f
        )
    }

    /**
     * Draw the gradient background
     */
    fun draw(batch: SpriteBatch, x: Float = 0f, y: Float = 0f) {
        batch.draw(texture, x, y, width, height)
    }

    override fun dispose() {
        texture.dispose()
    }
}
