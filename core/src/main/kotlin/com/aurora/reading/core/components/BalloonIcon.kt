package com.aurora.reading.core.components

import com.badlogic.gdx.graphics.Color
import com.badlogic.gdx.graphics.Pixmap
import com.badlogic.gdx.graphics.Texture
import com.badlogic.gdx.graphics.g2d.SpriteBatch
import com.badlogic.gdx.utils.Disposable
import kotlin.math.pow
import kotlin.math.sqrt

/**
 * Procedural balloon icon component
 *
 * Creates a colorful balloon with shine highlight and string, similar to 🎈 emoji.
 * Uses Pixmap for procedural generation, matching the approach used for stars.
 */
class BalloonIcon(
    private var x: Float,
    private var y: Float,
    private val size: Float,
    private val balloonColor: Color = Color(1.0f, 0.25f, 0.51f, 1f),  // Bubble Pink
    private val shineIntensity: Float = 0.4f
) : Disposable {

    private val texture: Texture = createBalloonTexture()

    /**
     * Create procedural balloon texture using Pixmap
     */
    private fun createBalloonTexture(): Texture {
        val pixmapSize = size.toInt()
        val pixmap = Pixmap(pixmapSize, pixmapSize, Pixmap.Format.RGBA8888)

        val centerX = pixmapSize / 2f
        val centerY = pixmapSize / 2.2f  // Slightly higher for balloon shape
        val radiusX = pixmapSize / 2.5f
        val radiusY = pixmapSize / 2.2f  // Taller oval

        // Draw balloon body (filled oval)
        for (py in 0 until pixmapSize) {
            for (px in 0 until pixmapSize) {
                val dx = (px - centerX) / radiusX
                val dy = (py - centerY) / radiusY
                val distance = sqrt(dx * dx + dy * dy)

                if (distance <= 1.0f) {
                    // Inside balloon - apply color with smooth edge
                    val edge = 1.0f - distance
                    val alpha = edge.coerceIn(0f, 1f)

                    // Main balloon color
                    pixmap.setColor(
                        balloonColor.r,
                        balloonColor.g,
                        balloonColor.b,
                        balloonColor.a * alpha
                    )
                    pixmap.drawPixel(px, py)
                }
            }
        }

        // Add shine highlight (white ellipse in top-left)
        val shineX = centerX - radiusX * 0.3f
        val shineY = centerY - radiusY * 0.3f
        val shineRadiusX = radiusX * 0.35f
        val shineRadiusY = radiusY * 0.25f

        for (py in 0 until pixmapSize) {
            for (px in 0 until pixmapSize) {
                val dx = (px - shineX) / shineRadiusX
                val dy = (py - shineY) / shineRadiusY
                val distance = sqrt(dx * dx + dy * dy)

                if (distance <= 1.0f) {
                    val edge = 1.0f - distance
                    val alpha = (edge * shineIntensity).coerceIn(0f, 1f)

                    // White shine
                    val existing = Color()
                    val color = pixmap.getPixel(px, py)
                    Color.rgba8888ToColor(existing, color)

                    // Blend white shine with existing color
                    val blendedR = existing.r + (1f - existing.r) * alpha
                    val blendedG = existing.g + (1f - existing.g) * alpha
                    val blendedB = existing.b + (1f - existing.b) * alpha

                    pixmap.setColor(blendedR, blendedG, blendedB, existing.a)
                    pixmap.drawPixel(px, py)
                }
            }
        }

        // Draw balloon string (small line at bottom)
        val stringStartX = centerX.toInt()
        val stringStartY = (centerY + radiusY * 0.9f).toInt()
        val stringLength = (pixmapSize * 0.2f).toInt()

        pixmap.setColor(
            balloonColor.r * 0.7f,
            balloonColor.g * 0.7f,
            balloonColor.b * 0.7f,
            0.8f
        )

        // Draw curved string
        for (i in 0 until stringLength) {
            val progress = i / stringLength.toFloat()
            val sy = stringStartY + i
            val sx = (stringStartX + kotlin.math.sin(progress * 2f) * 2f).toInt()

            if (sx in 0 until pixmapSize && sy in 0 until pixmapSize) {
                pixmap.drawPixel(sx, sy)
                // Make string slightly thicker
                if (sx + 1 < pixmapSize) pixmap.drawPixel(sx + 1, sy)
            }
        }

        // Draw knot at bottom of string
        val knotX = stringStartX
        val knotY = stringStartY + stringLength
        val knotRadius = 2

        pixmap.setColor(balloonColor.r * 0.6f, balloonColor.g * 0.6f, balloonColor.b * 0.6f, 0.9f)
        pixmap.fillCircle(knotX, knotY, knotRadius)

        val texture = Texture(pixmap)
        pixmap.dispose()
        return texture
    }

    /**
     * Draw the balloon icon
     */
    fun draw(batch: SpriteBatch) {
        batch.draw(texture, x, y, size, size)
    }

    /**
     * Draw the balloon icon with rotation
     */
    fun draw(batch: SpriteBatch, rotation: Float) {
        val originX = size / 2f
        val originY = size / 2f

        batch.draw(
            texture,
            x,
            y,
            originX,
            originY,
            size,
            size,
            1f,
            1f,
            rotation,
            0,
            0,
            texture.width,
            texture.height,
            false,
            false
        )
    }

    /**
     * Set balloon position
     */
    fun setPosition(newX: Float, newY: Float) {
        x = newX
        y = newY
    }

    /**
     * Get balloon texture (for use in other components)
     */
    fun getTexture(): Texture = texture

    override fun dispose() {
        texture.dispose()
    }
}
