package com.aurora.reading.core.components

import com.badlogic.gdx.graphics.Color
import com.badlogic.gdx.graphics.Pixmap
import com.badlogic.gdx.graphics.Texture
import com.badlogic.gdx.graphics.g2d.SpriteBatch
import com.badlogic.gdx.math.MathUtils
import com.badlogic.gdx.utils.Disposable
import com.aurora.reading.core.config.ThemeConfig
import kotlin.math.cos
import kotlin.math.sin

/**
 * Floating star decoration component
 * Creates animated stars that gently float across the screen
 */
class FloatingStars(
    private val worldWidth: Float,
    private val worldHeight: Float,
    private val starCount: Int = 20,
    private val useEmoji: Boolean = false,
    private val emojiSize: Int = 32,
    private val largeStars: Boolean = false,
    private val starSize: Float = 32f
) : Disposable {

    private data class Star(
        var x: Float,
        var y: Float,
        var vx: Float,
        var vy: Float,
        var rotation: Float,
        var rotationSpeed: Float,
        var scale: Float,
        var alpha: Float,
        val color: Color,
        val texture: Texture?,
        val emoji: String?
    )

    private val stars = mutableListOf<Star>()
    private val yellowStarTexture: Texture?
    private val pinkStarTexture: Texture?
    private val emojiFont: com.badlogic.gdx.graphics.g2d.BitmapFont?

    init {
        if (useEmoji) {
            // Use emoji stars
            yellowStarTexture = null
            pinkStarTexture = null
            emojiFont = com.badlogic.gdx.graphics.g2d.BitmapFont().apply {
                data.setScale(emojiSize / 40f)
            }
        } else {
            // Create procedural star textures
            yellowStarTexture = createStarTexture(ThemeConfig.Colors.STAR_YELLOW)
            pinkStarTexture = createStarTexture(ThemeConfig.Colors.STAR_PINK)
            emojiFont = null
        }

        // Initialize stars
        for (i in 0 until starCount) {
            createStar()
        }
    }

    /**
     * Create a procedural star texture
     */
    private fun createStarTexture(color: Color): Texture {
        val size = if (largeStars) starSize.toInt() else 32
        val pixmap = Pixmap(size, size, Pixmap.Format.RGBA8888)

        val centerX = size / 2f
        val centerY = size / 2f
        val outerRadius = size / 2f - 2f
        val innerRadius = outerRadius * 0.4f

        // Draw 5-pointed star
        pixmap.setColor(color)

        val points = 5
        val angleStep = (2f * Math.PI / points).toFloat()

        for (i in 0 until points) {
            val angle1 = i * angleStep - Math.PI.toFloat() / 2f
            val angle2 = (i + 0.5f) * angleStep - Math.PI.toFloat() / 2f
            val angle3 = (i + 1f) * angleStep - Math.PI.toFloat() / 2f

            // Outer point
            val x1 = centerX + cos(angle1) * outerRadius
            val y1 = centerY + sin(angle1) * outerRadius

            // Inner point
            val x2 = centerX + cos(angle2) * innerRadius
            val y2 = centerY + sin(angle2) * innerRadius

            // Next outer point
            val x3 = centerX + cos(angle3) * outerRadius
            val y3 = centerY + sin(angle3) * outerRadius

            // Draw triangle from center to create star
            fillTriangle(pixmap, centerX, centerY, x1, y1, x2, y2)
            fillTriangle(pixmap, centerX, centerY, x2, y2, x3, y3)
        }

        val texture = Texture(pixmap)
        pixmap.dispose()
        return texture
    }

    /**
     * Fill a triangle on the pixmap (simple scanline algorithm)
     */
    private fun fillTriangle(pixmap: Pixmap, x1: Float, y1: Float, x2: Float, y2: Float, x3: Float, y3: Float) {
        // Simple point-based filling for small stars
        val minX = minOf(x1, x2, x3).toInt().coerceAtLeast(0)
        val maxX = maxOf(x1, x2, x3).toInt().coerceAtMost(pixmap.width - 1)
        val minY = minOf(y1, y2, y3).toInt().coerceAtLeast(0)
        val maxY = maxOf(y1, y2, y3).toInt().coerceAtMost(pixmap.height - 1)

        for (y in minY..maxY) {
            for (x in minX..maxX) {
                if (isPointInTriangle(x.toFloat(), y.toFloat(), x1, y1, x2, y2, x3, y3)) {
                    pixmap.drawPixel(x, y)
                }
            }
        }
    }

    /**
     * Check if point is inside triangle using barycentric coordinates
     */
    private fun isPointInTriangle(px: Float, py: Float, x1: Float, y1: Float, x2: Float, y2: Float, x3: Float, y3: Float): Boolean {
        val denominator = ((y2 - y3) * (x1 - x3) + (x3 - x2) * (y1 - y3))
        if (denominator == 0f) return false

        val a = ((y2 - y3) * (px - x3) + (x3 - x2) * (py - y3)) / denominator
        val b = ((y3 - y1) * (px - x3) + (x1 - x3) * (py - y3)) / denominator
        val c = 1f - a - b

        return a >= 0f && b >= 0f && c >= 0f
    }

    /**
     * Create a new star with random properties
     */
    private fun createStar() {
        val emoji = if (useEmoji) {
            val emojis = listOf("⭐", "✨", "💫", "🌟")
            emojis[MathUtils.random(0, emojis.size - 1)]
        } else null

        val texture = if (!useEmoji) {
            if (MathUtils.randomBoolean()) yellowStarTexture else pinkStarTexture
        } else null

        val color = when {
            useEmoji -> Color.YELLOW
            texture == yellowStarTexture -> ThemeConfig.Colors.STAR_YELLOW
            else -> ThemeConfig.Colors.STAR_PINK
        }

        val star = Star(
            x = MathUtils.random(0f, worldWidth),
            y = MathUtils.random(0f, worldHeight),
            vx = MathUtils.random(-20f, 20f),
            vy = MathUtils.random(-20f, 20f),
            rotation = MathUtils.random(0f, 360f),
            rotationSpeed = MathUtils.random(-30f, 30f),
            scale = MathUtils.random(0.8f, 1.2f),
            alpha = MathUtils.random(0.6f, 1.0f),
            color = color,
            texture = texture,
            emoji = emoji
        )

        stars.add(star)
    }

    /**
     * Update star positions and animations
     */
    fun update(delta: Float) {
        for (star in stars) {
            updateStarPosition(star, delta)
            updateStarVisuals(star, delta)
        }
    }

    /**
     * Update star position and wrap around edges
     */
    private fun updateStarPosition(star: Star, delta: Float) {
        star.x += star.vx * delta
        star.y += star.vy * delta

        if (star.x < -50f) star.x = worldWidth + 50f
        if (star.x > worldWidth + 50f) star.x = -50f
        if (star.y < -50f) star.y = worldHeight + 50f
        if (star.y > worldHeight + 50f) star.y = -50f
    }

    /**
     * Update star rotation and alpha
     */
    private fun updateStarVisuals(star: Star, delta: Float) {
        star.rotation += star.rotationSpeed * delta
        star.alpha += MathUtils.random(-0.1f, 0.1f) * delta
        star.alpha = star.alpha.coerceIn(0.3f, 0.8f)
    }

    /**
     * Draw all stars
     */
    fun draw(batch: SpriteBatch) {
        for (star in stars) {
            when {
                useEmoji && star.emoji != null && emojiFont != null -> drawEmojiStar(batch, star)
                star.texture != null -> drawTextureStar(batch, star)
            }
        }
    }

    /**
     * Draw emoji-based star
     */
    private fun drawEmojiStar(batch: SpriteBatch, star: Star) {
        emojiFont ?: return

        val prevFontColor = emojiFont.color.cpy()
        emojiFont.color = Color(star.color.r, star.color.g, star.color.b, star.alpha)
        emojiFont.data.setScale((emojiSize / 40f) * star.scale)
        emojiFont.draw(batch, star.emoji, star.x, star.y)
        emojiFont.color = prevFontColor
        emojiFont.data.setScale(emojiSize / 40f)
    }

    /**
     * Draw texture-based star
     */
    private fun drawTextureStar(batch: SpriteBatch, star: Star) {
        val texture = star.texture ?: return

        val baseSize = if (largeStars) starSize else 32f
        val size = baseSize * star.scale
        val originX = size / 2f
        val originY = size / 2f

        val prevColor = batch.color.cpy()
        batch.setColor(1f, 1f, 1f, star.alpha)

        batch.draw(
            texture,
            star.x - originX,
            star.y - originY,
            originX,
            originY,
            size,
            size,
            1f,
            1f,
            star.rotation,
            0,
            0,
            texture.width,
            texture.height,
            false,
            false
        )

        batch.color = prevColor
    }

    override fun dispose() {
        yellowStarTexture?.dispose()
        pinkStarTexture?.dispose()
        emojiFont?.dispose()
    }
}
