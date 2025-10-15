package com.aurora.reading.core.screens

import com.badlogic.gdx.Game
import com.badlogic.gdx.Gdx
import com.badlogic.gdx.Screen
import com.badlogic.gdx.graphics.Color
import com.badlogic.gdx.graphics.GL20
import com.badlogic.gdx.graphics.g2d.BitmapFont
import com.badlogic.gdx.graphics.g2d.SpriteBatch
import com.badlogic.gdx.graphics.glutils.ShapeRenderer
import com.aurora.reading.core.assets.Assets

/**
 * Loading screen that displays asset loading progress
 */
class LoadingScreen(
    private val game: Game,
    private val nextScreen: Screen
) : Screen {

    private val batch = SpriteBatch()
    private val shapeRenderer = ShapeRenderer()
    private val font = BitmapFont().apply {
        data.setScale(2.5f)
        color = Color.WHITE
    }

    private var assetsLoaded = false

    init {
        // Start loading assets
        Assets.loadAll()
        Gdx.app.log("LoadingScreen", "Asset loading started")
    }

    override fun show() {}

    override fun render(delta: Float) {
        // Clear screen with purple background
        Gdx.gl.glClearColor(0.4f, 0.2f, 0.6f, 1f)
        Gdx.gl.glClear(GL20.GL_COLOR_BUFFER_BIT)

        // Update asset loading
        val finished = Assets.update()
        val progress = Assets.getProgress()

        // Draw loading bar
        val barWidth = 800f
        val barHeight = 50f
        val barX = (Gdx.graphics.width - barWidth) / 2
        val barY = Gdx.graphics.height / 2f

        shapeRenderer.begin(ShapeRenderer.ShapeType.Filled)

        // Background bar (dark purple)
        shapeRenderer.color = Color(0.2f, 0.1f, 0.3f, 1f)
        shapeRenderer.rect(barX, barY, barWidth, barHeight)

        // Progress bar (bright purple)
        shapeRenderer.color = Color(0.7f, 0.3f, 0.9f, 1f)
        shapeRenderer.rect(barX, barY, barWidth * progress, barHeight)

        shapeRenderer.end()

        // Draw text
        batch.begin()
        val loadingText = if (finished) "Loading Complete!" else "Loading Assets..."
        val percentText = "${(progress * 100).toInt()}%"

        font.draw(batch, loadingText, barX, barY + barHeight + 80f)
        font.draw(batch, percentText, barX + barWidth / 2 - 40f, barY + barHeight / 2 + 10f)
        batch.end()

        // Switch to next screen when done
        if (finished && !assetsLoaded) {
            assetsLoaded = true
            Gdx.app.log("LoadingScreen", "All assets loaded! Switching to game...")
            Gdx.app.postRunnable {
                game.screen = nextScreen
                dispose()
            }
        }
    }

    override fun resize(width: Int, height: Int) {}
    override fun pause() {}
    override fun resume() {}
    override fun hide() {}

    override fun dispose() {
        batch.dispose()
        shapeRenderer.dispose()
        font.dispose()
    }
}
