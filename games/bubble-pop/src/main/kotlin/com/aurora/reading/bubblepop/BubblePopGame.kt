package com.aurora.reading.bubblepop

import com.badlogic.gdx.Gdx
import com.badlogic.gdx.Screen
import com.badlogic.gdx.graphics.Color
import com.badlogic.gdx.graphics.OrthographicCamera
import com.badlogic.gdx.graphics.Texture
import com.badlogic.gdx.graphics.g2d.BitmapFont
import com.badlogic.gdx.graphics.g2d.SpriteBatch
import com.badlogic.gdx.utils.viewport.FitViewport
import com.aurora.reading.core.assets.Assets

class BubblePopGame : Screen {

    private val camera: OrthographicCamera
    private val viewport: FitViewport
    private val batch: SpriteBatch
    private val font: BitmapFont

    // Test assets
    private lateinit var backgroundTexture: Texture
    private lateinit var icon: Texture

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
        Gdx.app.log("BubblePopGame", "Screen shown - loading assets")

        // Load test assets
        backgroundTexture = Assets.getTexture(Assets.Images.GAME_BACKGROUND)
        icon = Assets.getTexture(Assets.Images.ICON_512)

        Gdx.app.log("BubblePopGame", "Assets loaded successfully!")
    }

    override fun render(delta: Float) {
        camera.update()
        batch.projectionMatrix = camera.combined

        batch.begin()

        // Draw background
        batch.draw(backgroundTexture, 0f, 0f, viewport.worldWidth, viewport.worldHeight)

        // Draw icon
        batch.draw(icon, 100f, viewport.worldHeight - 612f, 512f, 512f)

        // Draw text
        font.draw(batch, "Aurora's Reading Adventure", 700f, viewport.worldHeight - 100f)
        font.draw(batch, "Bubble Pop - Kotlin + libGDX", 700f, viewport.worldHeight - 200f)
        font.draw(batch, "Assets Loaded Successfully!", 700f, viewport.worldHeight - 300f)
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
