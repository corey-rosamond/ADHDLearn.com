package com.aurora.reading.bubblepop

import com.badlogic.gdx.Gdx
import com.badlogic.gdx.Screen
import com.badlogic.gdx.graphics.Color
import com.badlogic.gdx.graphics.OrthographicCamera
import com.badlogic.gdx.graphics.g2d.BitmapFont
import com.badlogic.gdx.graphics.g2d.SpriteBatch
import com.badlogic.gdx.utils.viewport.FitViewport

class BubblePopGame : Screen {

    private val camera: OrthographicCamera
    private val viewport: FitViewport
    private val batch: SpriteBatch
    private val font: BitmapFont

    init {
        // Target resolution: Samsung Galaxy Tab S7 FE (2560x1600 landscape)
        camera = OrthographicCamera()
        viewport = FitViewport(2560f, 1600f, camera)
        batch = SpriteBatch()
        font = BitmapFont().apply {
            data.setScale(3f)
            color = Color.WHITE
        }

        Gdx.app.log("BubblePopGame", "Bubble Pop initialized!")
    }

    override fun show() {
        Gdx.app.log("BubblePopGame", "Screen shown")
    }

    override fun render(delta: Float) {
        camera.update()
        batch.projectionMatrix = camera.combined

        batch.begin()
        font.draw(batch, "Aurora's Reading Adventure", 100f, viewport.worldHeight - 100f)
        font.draw(batch, "Bubble Pop - Letter Game", 100f, viewport.worldHeight - 200f)
        font.draw(batch, "Kotlin + libGDX Ready!", 100f, viewport.worldHeight - 300f)
        font.draw(batch, "FPS: ${Gdx.graphics.framesPerSecond}", 100f, 100f)
        batch.end()
    }

    override fun resize(width: Int, height: Int) {
        viewport.update(width, height, true)
    }

    override fun pause() {}

    override fun resume() {}

    override fun hide() {}

    override fun dispose() {
        batch.dispose()
        font.dispose()
    }
}
