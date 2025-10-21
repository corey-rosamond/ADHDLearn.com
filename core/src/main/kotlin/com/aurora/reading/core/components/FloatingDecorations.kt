package com.aurora.reading.core.components

import com.badlogic.gdx.graphics.Texture
import com.badlogic.gdx.graphics.g2d.SpriteBatch
import com.badlogic.gdx.utils.Disposable
import com.aurora.reading.core.assets.Assets
import kotlin.random.Random

/**
 * Floating decorations component
 *
 * Displays fun floating icons (ice cream, donuts, cupcakes, etc.)
 * scattered across the screen with gentle animations.
 */
class FloatingDecorations(
    private val worldWidth: Float,
    private val worldHeight: Float,
    private val decorationCount: Int = 15,
    private val size: Float = 80f
) : Disposable {

    private data class Decoration(
        var x: Float,
        var y: Float,
        val velocityX: Float,
        val velocityY: Float,
        val rotationSpeed: Float,
        var rotation: Float,
        val texture: Texture,
        val scale: Float,
        var alpha: Float,
        val alphaSpeed: Float
    )

    private val decorations = mutableListOf<Decoration>()
    private val decorationTextures = mutableListOf<Texture>()

    init {
        loadTextures()
        createDecorations()
    }

    /**
     * Load all decoration textures
     */
    private fun loadTextures() {
        decorationTextures.add(Assets.getTexture(Assets.Images.ICECREAM))
        decorationTextures.add(Assets.getTexture(Assets.Images.DONUT))
        decorationTextures.add(Assets.getTexture(Assets.Images.CUPCAKE))
        decorationTextures.add(Assets.getTexture(Assets.Images.FLOWER))
        decorationTextures.add(Assets.getTexture(Assets.Images.CROWN))
    }

    /**
     * Create decorations at random positions with random velocities
     */
    private fun createDecorations() {
        for (i in 0 until decorationCount) {
            val texture = decorationTextures.random()

            decorations.add(
                Decoration(
                    x = Random.nextFloat() * worldWidth,
                    y = Random.nextFloat() * worldHeight,
                    velocityX = Random.nextFloat() * 30f - 15f,  // -15 to +15 pixels per second
                    velocityY = Random.nextFloat() * 30f - 15f,
                    rotationSpeed = Random.nextFloat() * 20f - 10f,  // Slow rotation
                    rotation = Random.nextFloat() * 360f,
                    texture = texture,
                    scale = 0.6f + Random.nextFloat() * 0.6f,  // 0.6x to 1.2x scale
                    alpha = 0.4f + Random.nextFloat() * 0.4f,  // 0.4 to 0.8 alpha for subtle effect
                    alphaSpeed = 0.3f + Random.nextFloat() * 0.4f  // Gentle pulsing
                )
            )
        }
    }

    /**
     * Update all decorations
     */
    fun update(delta: Float) {
        for (decoration in decorations) {
            updatePosition(decoration, delta)
            updateRotation(decoration, delta)
            updateAlpha(decoration, delta)
            wrapAroundEdges(decoration)
        }
    }

    /**
     * Update decoration position
     */
    private fun updatePosition(decoration: Decoration, delta: Float) {
        decoration.x += decoration.velocityX * delta
        decoration.y += decoration.velocityY * delta
    }

    /**
     * Update decoration rotation
     */
    private fun updateRotation(decoration: Decoration, delta: Float) {
        decoration.rotation += decoration.rotationSpeed * delta
    }

    /**
     * Update decoration alpha pulsing
     */
    private fun updateAlpha(decoration: Decoration, delta: Float) {
        decoration.alpha += decoration.alphaSpeed * delta * 0.5f
        decoration.alpha = decoration.alpha.coerceIn(0.4f, 0.8f)
    }

    /**
     * Wrap decoration around screen edges
     */
    private fun wrapAroundEdges(decoration: Decoration) {
        if (decoration.x < -size) {
            decoration.x = worldWidth + size
        } else if (decoration.x > worldWidth + size) {
            decoration.x = -size
        }

        if (decoration.y < -size) {
            decoration.y = worldHeight + size
        } else if (decoration.y > worldHeight + size) {
            decoration.y = -size
        }
    }

    /**
     * Draw all decorations
     */
    fun draw(batch: SpriteBatch) {
        val prevColor = batch.color.cpy()

        for (decoration in decorations) {
            batch.setColor(1f, 1f, 1f, decoration.alpha)

            val scaledSize = size * decoration.scale
            val originX = scaledSize / 2f
            val originY = scaledSize / 2f

            batch.draw(
                decoration.texture,
                decoration.x - originX,
                decoration.y - originY,
                originX,
                originY,
                scaledSize,
                scaledSize,
                1f,
                1f,
                decoration.rotation,
                0,
                0,
                decoration.texture.width,
                decoration.texture.height,
                false,
                false
            )
        }

        batch.color = prevColor
    }

    override fun dispose() {
        // Textures are managed by Assets, don't dispose here
    }
}
