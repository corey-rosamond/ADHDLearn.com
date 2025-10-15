package com.aurora.reading.bubblepop

import com.badlogic.gdx.Gdx
import com.badlogic.gdx.Screen
import com.badlogic.gdx.graphics.GL20
import com.badlogic.gdx.graphics.OrthographicCamera
import com.badlogic.gdx.graphics.Texture
import com.badlogic.gdx.graphics.g2d.BitmapFont
import com.badlogic.gdx.graphics.g2d.SpriteBatch
import com.badlogic.gdx.graphics.glutils.ShapeRenderer
import com.badlogic.gdx.utils.viewport.FitViewport
import com.aurora.reading.core.assets.Assets
import com.aurora.reading.core.config.ThemeConfig
import com.aurora.reading.core.services.AudioManager
import com.aurora.reading.core.utils.ResponsiveUtils

class BubblePopGame : Screen {

    private val camera: OrthographicCamera
    private val viewport: FitViewport
    private val batch: SpriteBatch
    private val shapeRenderer: ShapeRenderer
    private val font: BitmapFont
    private val r: ResponsiveUtils

    // Test assets
    private lateinit var backgroundTexture: Texture
    private lateinit var icon: Texture
    private lateinit var buttonTexture: Texture

    private var audioPlayed = false

    init {
        // Target resolution: Samsung Galaxy Tab S7 FE (2560x1600 landscape)
        camera = OrthographicCamera()
        viewport = FitViewport(ResponsiveUtils.WORLD_WIDTH, ResponsiveUtils.WORLD_HEIGHT, camera)
        batch = SpriteBatch()
        shapeRenderer = ShapeRenderer()
        r = ResponsiveUtils()

        font = BitmapFont().apply {
            data.setScale(r.getFontSize(32) / 40f)
            color = ThemeConfig.Colors.TEXT_WHITE
        }

        Gdx.app.log("BubblePopGame", "Bubble Pop initialized with responsive utils!")
    }

    override fun show() {
        Gdx.app.log("BubblePopGame", "Screen shown - loading assets")

        // Load test assets
        backgroundTexture = Assets.getTexture(Assets.Images.GAME_BACKGROUND)
        icon = Assets.getTexture(Assets.Images.ICON_512)
        buttonTexture = Assets.getTexture(Assets.UI.BTN_BLUE)

        Gdx.app.log("BubblePopGame", "Assets loaded successfully!")
    }

    override fun render(delta: Float) {
        // Clear with purple background
        Gdx.gl.glClearColor(
            ThemeConfig.Colors.PURPLE.r,
            ThemeConfig.Colors.PURPLE.g,
            ThemeConfig.Colors.PURPLE.b,
            1f
        )
        Gdx.gl.glClear(GL20.GL_COLOR_BUFFER_BIT)

        camera.update()
        batch.projectionMatrix = camera.combined
        shapeRenderer.projectionMatrix = camera.combined

        // Draw gradient boxes to show theme colors
        shapeRenderer.begin(ShapeRenderer.ShapeType.Filled)

        // Main menu gradient preview
        shapeRenderer.color = ThemeConfig.Colors.PURPLE
        shapeRenderer.rect(r.getX(5f), r.getY(60f), r.scaleX(20f), r.scaleY(30f))

        shapeRenderer.color = ThemeConfig.Colors.PINK
        shapeRenderer.rect(r.getX(27f), r.getY(60f), r.scaleX(20f), r.scaleY(30f))

        shapeRenderer.color = ThemeConfig.Colors.ORANGE
        shapeRenderer.rect(r.getX(49f), r.getY(60f), r.scaleX(20f), r.scaleY(30f))

        // Letter pop gradient preview
        shapeRenderer.color = ThemeConfig.Colors.SKY_BLUE
        shapeRenderer.rect(r.getX(5f), r.getY(20f), r.scaleX(20f), r.scaleY(30f))

        shapeRenderer.color = ThemeConfig.Colors.TURQUOISE
        shapeRenderer.rect(r.getX(27f), r.getY(20f), r.scaleX(20f), r.scaleY(30f))

        shapeRenderer.end()

        batch.begin()

        // Draw background (scaled)
        batch.draw(backgroundTexture, r.getX(72f), r.getY(20f), r.scaleX(25f), r.scaleY(40f))

        // Draw icon (using responsive positioning)
        val iconSize = r.scaleY(20f)
        batch.draw(icon, r.getX(75f), r.getY(65f), iconSize, iconSize)

        // Draw button example
        val btnWidth = r.scaleX(15f)
        val btnHeight = r.scaleY(8f)
        batch.draw(buttonTexture, r.centerX - btnWidth / 2, r.getY(5f), btnWidth, btnHeight)

        // Draw text using responsive font sizing
        font.draw(batch, "Aurora's Reading Adventure", r.getX(5f), r.getY(95f))
        font.draw(batch, "Phase 2.7.3: Core Architecture Complete!", r.getX(5f), r.getY(90f))
        font.draw(batch, "", r.getX(5f), r.getY(85f))
        font.draw(batch, "Responsive Utils: \u2713", r.getX(5f), r.getY(80f))
        font.draw(batch, "Theme Config: \u2713", r.getX(5f), r.getY(75f))
        font.draw(batch, "Audio Manager: \u2713", r.getX(5f), r.getY(70f))
        font.draw(batch, "", r.getX(5f), r.getY(65f))
        font.draw(batch, "Color previews (left): Main Menu & Letter Pop gradients", r.getX(5f), r.getY(55f))
        font.draw(batch, "", r.getX(5f), r.getY(50f))
        font.draw(batch, "FPS: ${Gdx.graphics.framesPerSecond}", r.getX(5f), r.getY(10f))

        batch.end()

        // Play welcome audio once
        if (!audioPlayed && Gdx.graphics.framesPerSecond > 30) {
            audioPlayed = true
            Gdx.app.postRunnable {
                AudioManager.playWelcome()
            }
        }
    }

    override fun resize(width: Int, height: Int) {
        viewport.update(width, height, true)
    }

    override fun pause() {
        AudioManager.pauseAll()
    }

    override fun resume() {
        AudioManager.resumeAll()
    }

    override fun hide() {}

    override fun dispose() {
        batch.dispose()
        shapeRenderer.dispose()
        font.dispose()
    }
}
