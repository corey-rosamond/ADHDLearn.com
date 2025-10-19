package com.aurora.reading.core.components

import com.badlogic.gdx.graphics.Color
import com.badlogic.gdx.graphics.g2d.SpriteBatch
import com.badlogic.gdx.graphics.glutils.ShapeRenderer
import com.badlogic.gdx.utils.Disposable
import com.aurora.reading.core.utils.ResponsiveUtils
import kotlin.math.cos
import kotlin.math.sin
import kotlin.math.PI

/**
 * Star Rating Component
 *
 * Displays 1-3 stars based on game performance.
 *
 * Features:
 * - Filled stars for earned rating
 * - Empty stars for unearned rating
 * - Star animation (scale in with bounce)
 * - Gold color for filled stars
 * - Gray color for empty stars
 *
 * Responsibilities:
 * - Render star shapes using ShapeRenderer
 * - Animate stars appearing one by one
 * - Position stars horizontally
 */
class StarRating(
    private val x: Float,
    private val y: Float,
    private val starSize: Float,
    private val spacing: Float,
    private val maxStars: Int = 3
) : Disposable {

    private val responsive = ResponsiveUtils()

    // Current rating (1-3)
    private var rating = 0

    // Animation state
    private var animationTime = 0f
    private val STAR_ANIMATION_DELAY = 0.2f // 200ms between each star
    private val STAR_ANIMATION_DURATION = 0.3f // 300ms per star

    // Colors
    private val GOLD_COLOR = Color(1f, 0.84f, 0f, 1f) // Gold (#FFD700)
    private val GRAY_COLOR = Color(0.5f, 0.5f, 0.5f, 0.3f) // Light gray

    /**
     * Set the star rating (1-3)
     */
    fun setRating(stars: Int) {
        rating = stars.coerceIn(1, maxStars)
        animationTime = 0f
    }

    /**
     * Update animation
     */
    fun update(delta: Float) {
        animationTime += delta
    }

    /**
     * Render stars
     */
    fun render(batch: SpriteBatch, shapeRenderer: ShapeRenderer) {
        batch.end()

        shapeRenderer.begin(ShapeRenderer.ShapeType.Filled)

        // Calculate total width of all stars
        val totalWidth = (maxStars * starSize) + ((maxStars - 1) * spacing)
        val startX = x - totalWidth / 2

        for (i in 0 until maxStars) {
            val starX = startX + (i * (starSize + spacing)) + starSize / 2
            val starY = y

            // Determine if this star should be filled
            val isFilled = i < rating

            // Calculate animation scale
            val starIndex = i
            val starAppearTime = starIndex * STAR_ANIMATION_DELAY
            val timeSinceAppear = (animationTime - starAppearTime).coerceAtLeast(0f)
            val animationProgress = (timeSinceAppear / STAR_ANIMATION_DURATION).coerceIn(0f, 1f)

            // Bounce easing
            val scale = if (animationProgress < 1f) {
                val t = animationProgress
                // Bounce: overshoot then settle
                if (t < 0.5f) {
                    2f * t * t // Ease in
                } else {
                    1f + (1f - t) * 0.2f // Overshoot slightly
                }
            } else {
                1f
            }

            // Set color
            shapeRenderer.color = if (isFilled) GOLD_COLOR else GRAY_COLOR

            // Draw 5-pointed star
            drawStar(shapeRenderer, starX, starY, starSize * scale)
        }

        shapeRenderer.end()

        batch.begin()
    }

    /**
     * Draw a 5-pointed star shape
     */
    private fun drawStar(
        shapeRenderer: ShapeRenderer,
        centerX: Float,
        centerY: Float,
        size: Float
    ) {
        val outerRadius = size / 2
        val innerRadius = outerRadius * 0.4f
        val points = 5
        val vertices = FloatArray(points * 4) // 2 vertices per point (outer + inner) * 2 coords

        // Generate star vertices
        for (i in 0 until points * 2) {
            val angle = (i * PI / points).toFloat() - PI.toFloat() / 2 // Start at top
            val radius = if (i % 2 == 0) outerRadius else innerRadius

            val index = i * 2
            vertices[index] = centerX + cos(angle) * radius
            vertices[index + 1] = centerY + sin(angle) * radius
        }

        // Draw star as triangle fan from center
        for (i in 0 until points * 2) {
            val nextIndex = (i + 1) % (points * 2)

            shapeRenderer.triangle(
                centerX, centerY,
                vertices[i * 2], vertices[i * 2 + 1],
                vertices[nextIndex * 2], vertices[nextIndex * 2 + 1]
            )
        }
    }

    /**
     * Cleanup resources
     */
    override fun dispose() {
        // No resources to cleanup
    }
}
