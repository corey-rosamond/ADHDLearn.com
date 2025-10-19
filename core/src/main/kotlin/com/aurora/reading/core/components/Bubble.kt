package com.aurora.reading.core.components

import com.badlogic.gdx.graphics.Color
import com.badlogic.gdx.graphics.g2d.BitmapFont
import com.badlogic.gdx.graphics.g2d.GlyphLayout
import com.badlogic.gdx.graphics.g2d.SpriteBatch
import com.badlogic.gdx.graphics.glutils.ShapeRenderer
import com.badlogic.gdx.math.Circle
import com.badlogic.gdx.math.Vector2
import com.badlogic.gdx.utils.Disposable
import com.aurora.reading.core.config.ThemeConfig
import com.aurora.reading.core.services.FontManager
import com.aurora.reading.core.utils.ResponsiveUtils

/**
 * Bubble Component
 *
 * Represents a floating bubble containing a letter in the Letter Pop game.
 *
 * Features:
 * - Circular shape with gradient fill (purple → pink)
 * - Letter text centered in bubble
 * - Physics-based movement (position + velocity)
 * - Collision detection via Circle bounds
 * - Smoosh animation on collision
 * - Click detection
 * - Pop animation
 *
 * Responsibilities:
 * - Render bubble circle with letter
 * - Update position based on velocity
 * - Provide collision bounds
 * - Handle smoosh and pop animations
 */
class Bubble(
    val letter: String,
    initialX: Float,
    initialY: Float,
    val radius: Float
) : Disposable {

    private val responsive = ResponsiveUtils()

    // Position and velocity
    val position = Vector2(initialX, initialY)
    val velocity = Vector2(0f, 0f)

    // Collision bounds
    val bounds = Circle(initialX, initialY, radius)

    // Visual state
    var scale = 1f
    var isSmooshing = false
    var isDestroyed = false
    private var isPopping = false

    // Fonts
    private val letterFont: BitmapFont = FontManager.getFont(
        size = (radius * 1.2f).toInt(),
        color = Color.WHITE,
        borderWidth = responsive.scaleX(0.3f).coerceAtLeast(2f),
        borderColor = ThemeConfig.Colors.PURPLE
    )

    private val glyphLayout = GlyphLayout()

    // Animation state
    private var scaleX = 1f
    private var scaleY = 1f
    private var smooshTime = 0f
    private val SMOOSH_DURATION = 0.12f // 120ms

    // Pop animation state
    private var popTime = 0f
    private val POP_DURATION = 0.3f // 300ms
    private var popAlpha = 1f
    private var popOnComplete: (() -> Unit)? = null

    /**
     * Set velocity for physics movement
     */
    fun setVelocity(vx: Float, vy: Float) {
        velocity.set(vx, vy)
    }

    /**
     * Update bubble position and animation
     */
    fun update(delta: Float) {
        if (isDestroyed) return

        // Update position based on velocity
        position.add(velocity.x * delta, velocity.y * delta)

        // Update collision bounds
        bounds.setPosition(position.x, position.y)

        // Update pop animation
        if (isPopping) {
            popTime += delta

            if (popTime < POP_DURATION) {
                // Expand and fade out
                val progress = popTime / POP_DURATION
                scaleX = 1f + progress * 0.5f // Scale up to 1.5x
                scaleY = 1f + progress * 0.5f
                popAlpha = 1f - progress // Fade out
            } else {
                // Animation complete
                isDestroyed = true
                popOnComplete?.invoke()
            }
            return // Don't update smoosh when popping
        }

        // Update smoosh animation
        if (isSmooshing) {
            smooshTime += delta

            if (smooshTime < SMOOSH_DURATION) {
                // Squish phase (compress horizontally, expand vertically)
                val progress = smooshTime / SMOOSH_DURATION
                scaleX = 0.8f + (0.2f * progress)
                scaleY = 1.2f - (0.2f * progress)
            } else if (smooshTime < SMOOSH_DURATION * 2) {
                // Return phase
                val progress = (smooshTime - SMOOSH_DURATION) / SMOOSH_DURATION
                scaleX = 1f
                scaleY = 1f

                if (progress >= 1f) {
                    isSmooshing = false
                    smooshTime = 0f
                }
            }
        } else {
            scaleX = scale
            scaleY = scale
        }
    }

    /**
     * Trigger smoosh animation
     */
    fun smoosh() {
        if (!isSmooshing && !isPopping) {
            isSmooshing = true
            smooshTime = 0f
        }
    }

    /**
     * Reverse velocity on wall bounce
     */
    fun bounceX() {
        velocity.x = -velocity.x
    }

    fun bounceY() {
        velocity.y = -velocity.y
    }

    /**
     * Render bubble
     */
    fun render(batch: SpriteBatch, shapeRenderer: ShapeRenderer) {
        if (isDestroyed) return

        batch.end()

        // Draw bubble circle with gradient effect
        shapeRenderer.begin(ShapeRenderer.ShapeType.Filled)

        // Outer circle (purple with pop alpha)
        val baseColor = ThemeConfig.Colors.PURPLE
        shapeRenderer.color = Color(baseColor.r, baseColor.g, baseColor.b, popAlpha)
        shapeRenderer.circle(position.x, position.y, radius * scaleX)

        // Inner circle (pink gradient effect)
        shapeRenderer.color = Color(0.9f, 0.5f, 0.8f, 0.5f * popAlpha)
        shapeRenderer.circle(position.x, position.y - radius * 0.2f, radius * 0.7f * scaleX)

        shapeRenderer.end()

        batch.begin()

        // Draw letter centered in bubble
        glyphLayout.setText(letterFont, letter)

        // Apply pop alpha to font
        val originalColor = letterFont.color
        letterFont.setColor(originalColor.r, originalColor.g, originalColor.b, popAlpha)

        letterFont.draw(
            batch,
            letter,
            position.x - glyphLayout.width / 2,
            position.y + glyphLayout.height / 2
        )

        // Restore original color
        letterFont.color = originalColor
    }

    /**
     * Check if point is inside bubble
     */
    fun contains(x: Float, y: Float): Boolean {
        return bounds.contains(x, y)
    }

    /**
     * Pop animation and destroy
     */
    fun pop(onComplete: () -> Unit) {
        if (!isPopping) {
            isPopping = true
            popTime = 0f
            popOnComplete = onComplete
        }
    }

    /**
     * Cleanup resources
     */
    override fun dispose() {
        // Fonts are managed by FontManager, no cleanup needed
    }
}
