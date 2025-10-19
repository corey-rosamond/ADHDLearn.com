package com.aurora.reading.bubblepop

import com.badlogic.gdx.Gdx
import com.badlogic.gdx.Screen
import com.badlogic.gdx.graphics.Color
import com.badlogic.gdx.graphics.GL20
import com.badlogic.gdx.graphics.OrthographicCamera
import com.badlogic.gdx.graphics.g2d.SpriteBatch
import com.badlogic.gdx.utils.viewport.FitViewport
import com.aurora.reading.core.assets.Assets
import com.aurora.reading.core.components.Button
import com.aurora.reading.core.components.FloatingStars
import com.aurora.reading.core.components.GradientBackground
import com.aurora.reading.core.components.TitleText
import com.aurora.reading.core.config.ThemeConfig
import com.aurora.reading.core.services.AudioManager
import com.aurora.reading.core.utils.ResponsiveUtils

class BubblePopGame : Screen {

    private lateinit var camera: OrthographicCamera
    private lateinit var viewport: FitViewport
    private lateinit var batch: SpriteBatch
    private val r: ResponsiveUtils = ResponsiveUtils()

    // Components
    private lateinit var background: GradientBackground
    private lateinit var stars: FloatingStars
    private lateinit var titleLine1: TitleText
    private lateinit var titleLine2: TitleText
    private lateinit var titleLine3: TitleText
    private lateinit var settingsButton: Button
    private lateinit var debugButton: Button
    private lateinit var gameTile: Button

    private var audioPlayed = false

    override fun show() {
        Gdx.app.log("BubblePopGame", "Screen shown - creating Main Menu (matching web version)")

        // Initialize graphics objects (must be done after OpenGL context is ready)
        camera = OrthographicCamera()
        viewport = FitViewport(ResponsiveUtils.WORLD_WIDTH, ResponsiveUtils.WORLD_HEIGHT, camera)
        batch = SpriteBatch()

        // Create gradient background: Orange Pop → Bubble Pink → Purple Magic
        background = GradientBackground(
            ResponsiveUtils.WORLD_WIDTH,
            ResponsiveUtils.WORLD_HEIGHT,
            arrayOf(
                Color(1.0f, 0.42f, 0.42f, 1f),   // #FF6B6B Orange Pop
                Color(1.0f, 0.25f, 0.51f, 1f),   // #FF4081 Bubble Pink
                Color(0.61f, 0.15f, 0.69f, 1f)   // #9C27B0 Purple Magic
            )
        )

        // Create floating stars decoration (15 stars - MUCH LARGER than before)
        stars = FloatingStars(
            ResponsiveUtils.WORLD_WIDTH,
            ResponsiveUtils.WORLD_HEIGHT,
            starCount = 15,
            useEmoji = false,  // Emoji doesn't render properly in libGDX
            largeStars = true,  // Use LARGE procedural stars instead
            starSize = r.scaleX(3f)  // 3% of screen width = ~75px at 2560px
        )

        // Create 3-line title matching web version
        // Using MUCH LARGER font size to match web - 96px scaled for 1600px height
        val titleFontSize = r.getFontSize(96)

        // Line 1: "AURORA'S" at 18% from top = 82% from bottom (libGDX inverted Y)
        titleLine1 = TitleText(
            text = "AURORA'S",
            x = r.centerX,
            y = r.getY(82f),
            fontSize = titleFontSize,
            textColor = Color(1.0f, 0.92f, 0.23f, 1f),  // #FFEB3B Yellow
            borderColor = Color(0.61f, 0.15f, 0.69f, 1f), // #9C27B0 Purple inner
            borderWidth = r.scaleX(0.31f),
            bounceIn = true,
            // outerStrokeColor = Color.WHITE,  // White outer stroke
            // outerStrokeWidth = r.scaleX(0.5f)
        )

        // Line 2: "READING" at 28% from top = 72% from bottom
        titleLine2 = TitleText(
            text = "READING",
            x = r.centerX,
            y = r.getY(72f),
            fontSize = titleFontSize,
            textColor = Color(1.0f, 0.92f, 0.23f, 1f),  // #FFEB3B Yellow
            borderColor = Color(0.61f, 0.15f, 0.69f, 1f), // #9C27B0 Purple inner
            borderWidth = r.scaleX(0.31f),
            bounceIn = true,
            // outerStrokeColor = Color.WHITE,  // White outer stroke
            // outerStrokeWidth = r.scaleX(0.5f)
        )

        // Line 3: "ADVENTURE" at 38% from top = 62% from bottom
        titleLine3 = TitleText(
            text = "ADVENTURE",
            x = r.centerX,
            y = r.getY(62f),
            fontSize = titleFontSize,
            textColor = Color(1.0f, 0.92f, 0.23f, 1f),  // #FFEB3B Yellow
            borderColor = Color(0.61f, 0.15f, 0.69f, 1f), // #9C27B0 Purple inner
            borderWidth = r.scaleX(0.31f),
            bounceIn = true,
            // outerStrokeColor = Color.WHITE,  // White outer stroke
            // outerStrokeWidth = r.scaleX(0.5f)
        )

        // Settings button - top-right corner (92% X, 8% from top = 92% from bottom)
        val settingsSize = r.scaleX(5f)  // Larger - 128px at 2560px for better touch
        settingsButton = Button(
            x = r.getX(92f) - settingsSize / 2f,
            y = r.getY(92f) - settingsSize / 2f,
            width = settingsSize,
            height = settingsSize,
            texturePath = Assets.UI.BTN_SETTING,
            text = "",
            onClick = {
                Gdx.app.log("BubblePopGame", "Settings clicked!")
                AudioManager.playCorrect()
            }
        )

        // Debug button - HIDDEN (make very small and transparent to match web)
        val debugSize = r.scaleX(0.1f)  // Tiny, effectively hidden
        debugButton = Button(
            x = r.getX(8f) - debugSize / 2f,
            y = r.getY(92f) - debugSize / 2f,
            width = debugSize,
            height = debugSize,
            texturePath = Assets.UI.BTN_BROWN,
            text = "",
            fontSize = 1,
            onClick = {
                Gdx.app.log("BubblePopGame", "Debug button clicked!")
                AudioManager.playBubblePop()
            }
        )

        // Game tile - center (50% X, 60% from top = 40% from bottom)
        // Using Box_Bg for the frame like the web version
        val tileSize = r.scaleX(15f)  // 384px at 2560px
        gameTile = Button(
            x = r.centerX - tileSize / 2f,
            y = r.getY(40f) - tileSize / 2f,
            width = tileSize,
            height = tileSize,
            texturePath = Assets.UI.BOX_BG,
            text = "🎈\n\nLetter Pop",  // Emoji with spacing, then text
            fontSize = r.getFontSize(32),
            textColor = Color(1.0f, 0.65f, 0.0f, 1f),  // Orange color for text
            onClick = {
                Gdx.app.log("BubblePopGame", "Letter Pop tile clicked!")
                AudioManager.playBubblePop()
            }
        )

        Gdx.app.log("BubblePopGame", "Main Menu created successfully!")
    }

    override fun render(delta: Float) {
        // Clear screen
        Gdx.gl.glClearColor(0f, 0f, 0f, 1f)
        Gdx.gl.glClear(GL20.GL_COLOR_BUFFER_BIT)

        camera.update()
        batch.projectionMatrix = camera.combined

        // Update components
        stars.update(delta)
        titleLine1.update(delta)
        titleLine2.update(delta)
        titleLine3.update(delta)
        settingsButton.update(delta)
        debugButton.update(delta)
        gameTile.update(delta)

        // Handle input
        if (Gdx.input.isTouched) {
            val touchX = Gdx.input.x.toFloat()
            val touchY = Gdx.input.y.toFloat()

            // Convert screen coordinates to world coordinates
            val worldCoords = viewport.unproject(com.badlogic.gdx.math.Vector2(touchX, touchY))

            // Check button clicks
            if (Gdx.input.justTouched()) {
                settingsButton.handleTouchDown(worldCoords.x, worldCoords.y)
                debugButton.handleTouchDown(worldCoords.x, worldCoords.y)
                gameTile.handleTouchDown(worldCoords.x, worldCoords.y)
            }
        } else {
            // Touch released
            if (settingsButton.getBounds().contains(0f, 0f) || debugButton.getBounds().contains(0f, 0f) || gameTile.getBounds().contains(0f, 0f)) {
                val worldCoords = viewport.unproject(com.badlogic.gdx.math.Vector2(Gdx.input.x.toFloat(), Gdx.input.y.toFloat()))
                settingsButton.handleTouchUp(worldCoords.x, worldCoords.y)
                debugButton.handleTouchUp(worldCoords.x, worldCoords.y)
                gameTile.handleTouchUp(worldCoords.x, worldCoords.y)
            }
        }

        // Draw everything
        batch.begin()

        // Draw background gradient
        background.draw(batch)

        // Draw floating stars
        stars.draw(batch)

        // Draw 3-line title
        titleLine1.draw(batch)
        titleLine2.draw(batch)
        titleLine3.draw(batch)

        // Draw buttons
        settingsButton.draw(batch)
        debugButton.draw(batch)
        gameTile.draw(batch)

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
        background.dispose()
        stars.dispose()
        titleLine1.dispose()
        titleLine2.dispose()
        titleLine3.dispose()
        settingsButton.dispose()
        debugButton.dispose()
        gameTile.dispose()
    }
}
