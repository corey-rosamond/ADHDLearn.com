package com.aurora.reading.core.screens

import com.badlogic.gdx.Game
import com.badlogic.gdx.Gdx
import com.badlogic.gdx.Preferences
import com.badlogic.gdx.Screen
import com.badlogic.gdx.graphics.GL20
import com.badlogic.gdx.graphics.OrthographicCamera
import com.badlogic.gdx.graphics.g2d.SpriteBatch
import com.badlogic.gdx.math.Vector2
import com.badlogic.gdx.utils.viewport.FitViewport
import com.aurora.reading.core.assets.Assets
import com.aurora.reading.core.components.*
import com.aurora.reading.core.config.ThemeConfig
import com.aurora.reading.core.services.AudioManager
import com.aurora.reading.core.utils.ResponsiveUtils

/**
 * Letter Pop Menu Screen
 *
 * Allows users to configure game settings:
 * - Time limit (5-15 seconds)
 * - Letter case (Uppercase/Lowercase/Mixed)
 *
 * Settings are persisted using libGDX Preferences.
 */
class LetterPopMenuScreen(private val game: Game) : Screen {

    private lateinit var camera: OrthographicCamera
    private lateinit var viewport: FitViewport
    private lateinit var batch: SpriteBatch
    private val responsive = ResponsiveUtils()

    private lateinit var background: GradientBackground
    private lateinit var titleText: TitleText
    private lateinit var balloonIcon: BalloonIcon
    private lateinit var decorations: FloatingDecorations

    private lateinit var timeSlider: Slider
    private lateinit var caseSelector: CaseSelector
    private lateinit var startButton: Button
    private lateinit var backButton: Button

    private lateinit var prefs: Preferences

    // Screen transition
    private var transitioning = false
    private var fadeOut = false
    private var fadeAlpha = 1f
    private var fadeTime = 0f
    private val fadeDuration = 0.3f
    private var nextScreen: Screen? = null

    override fun show() {
        Gdx.app.log("LetterPopMenuScreen", "Letter Pop Menu loaded")

        camera = OrthographicCamera()
        viewport = FitViewport(ResponsiveUtils.WORLD_WIDTH, ResponsiveUtils.WORLD_HEIGHT, camera)
        batch = SpriteBatch()

        // Load preferences
        prefs = Gdx.app.getPreferences("aurora-reading-letterpop")

        createBackground()
        createTitle()
        createDecorations()
        createBalloonIcon()
        createGameSettings()
        createButtons()
    }

    private fun createBackground() {
        background = GradientBackground(
            ResponsiveUtils.WORLD_WIDTH,
            ResponsiveUtils.WORLD_HEIGHT,
            arrayOf(ThemeConfig.Colors.PURPLE, ThemeConfig.Colors.ORANGE)
        )
    }

    private fun createTitle() {
        titleText = TitleText(
            text = "LETTER POP",
            x = responsive.centerX,
            y = responsive.getY(80f),  // 80% from bottom = near top
            fontSize = responsive.getFontSize(56),
            textColor = ThemeConfig.Colors.STAR_YELLOW,
            borderColor = ThemeConfig.Colors.PURPLE,
            borderWidth = responsive.scaleX(0.31f),
            bounceIn = true
        )
    }

    private fun createBalloonIcon() {
        balloonIcon = BalloonIcon(
            x = responsive.centerX,
            y = responsive.getY(92f),  // Above title
            size = responsive.scaleX(2.5f),
            balloonColor = ThemeConfig.Colors.PINK
        )
    }

    private fun createDecorations() {
        decorations = FloatingDecorations(
            ResponsiveUtils.WORLD_WIDTH,
            ResponsiveUtils.WORLD_HEIGHT,
            decorationCount = 8
        )
    }

    private fun createGameSettings() {
        // Load saved settings or use defaults
        val timePerRound = prefs.getInteger("timePerRound", 10)
        val letterCase = prefs.getString("letterCase", "uppercase")

        Gdx.app.log("LetterPopMenuScreen", "Loaded settings: time=$timePerRound, case=$letterCase")

        // Time limit slider
        timeSlider = Slider(
            x = responsive.getX(20f),
            y = responsive.getY(55f),  // 55% from bottom
            label = "Time Per Round",
            minValue = 5,
            maxValue = 15,
            initialValue = timePerRound,
            suffix = "s",
            onValueChange = { value ->
                prefs.putInteger("timePerRound", value)
                prefs.flush()
                Gdx.app.log("LetterPopMenuScreen", "Time per round set to: ${value}s")
            }
        )

        // Case selector
        caseSelector = CaseSelector(
            x = responsive.getX(20f),
            y = responsive.getY(40f),  // 40% from bottom
            initialValue = letterCase,
            onValueChange = { value ->
                prefs.putString("letterCase", value)
                prefs.flush()
                Gdx.app.log("LetterPopMenuScreen", "Letter case set to: $value")
            }
        )
    }

    private fun createButtons() {
        val buttonWidth = responsive.scaleX(10f)  // 10% = ~256px
        val buttonHeight = responsive.scaleY(5f)  // 5% = 80px

        // Start Game button
        startButton = Button(
            x = responsive.centerX - (buttonWidth / 2f),
            y = responsive.getY(20f),  // 20% from bottom
            width = buttonWidth,
            height = buttonHeight,
            texturePath = Assets.UI.BTN_BROWN,
            text = "START GAME",
            textColor = ThemeConfig.Colors.TEXT_WHITE,
            onClick = { startGame() }
        )

        // Back button
        backButton = Button(
            x = responsive.centerX - (buttonWidth / 2f),
            y = responsive.getY(10f),  // 10% from bottom
            width = buttonWidth,
            height = buttonHeight,
            texturePath = Assets.UI.BTN_GREEN,
            text = "← BACK",
            textColor = ThemeConfig.Colors.TEXT_WHITE,
            onClick = { navigateToMainMenu() }
        )
    }

    private fun startGame() {
        if (transitioning) return
        Gdx.app.log("LetterPopMenuScreen", "Starting Letter Pop game...")
        AudioManager.playCorrect()

        // TODO: Phase 2.7.8 - Navigate to actual game screen
        // For now, just show a log message
        Gdx.app.log("LetterPopMenuScreen", "Game start - Time: ${timeSlider.getValue()}s, Case: ${caseSelector.getValue()}")

        // Placeholder: Navigate back to main menu for now
        navigateToMainMenu()
    }

    private fun navigateToMainMenu() {
        if (transitioning) return
        Gdx.app.log("LetterPopMenuScreen", "Navigating back to Main Menu")
        AudioManager.playCorrect()
        startFadeOut(MainMenuScreen(game))
    }

    private fun startFadeOut(screen: Screen) {
        transitioning = true
        fadeOut = true
        fadeTime = 0f
        nextScreen = screen
    }

    private fun updateFadeOut(delta: Float) {
        if (!fadeOut) return

        fadeTime += delta
        fadeAlpha = 1f - (fadeTime / fadeDuration).coerceIn(0f, 1f)

        if (fadeTime >= fadeDuration) {
            nextScreen?.let {
                game.screen = it
                // Don't call dispose() here - libGDX will handle cleanup
            }
        }
    }

    override fun render(delta: Float) {
        Gdx.gl.glClearColor(0f, 0f, 0f, 1f)
        Gdx.gl.glClear(GL20.GL_COLOR_BUFFER_BIT)

        camera.update()
        batch.projectionMatrix = camera.combined

        // Update animations
        titleText.update(delta)
        decorations.update(delta)
        timeSlider.update(delta)
        caseSelector.update(delta)
        startButton.update(delta)
        backButton.update(delta)
        updateFadeOut(delta)

        // Handle input
        handleInput()

        // Draw
        batch.begin()
        batch.setColor(1f, 1f, 1f, fadeAlpha)

        background.draw(batch)
        decorations.draw(batch)
        balloonIcon.draw(batch)
        titleText.draw(batch)
        timeSlider.draw(batch)
        caseSelector.draw(batch)
        startButton.draw(batch)
        backButton.draw(batch)

        batch.setColor(1f, 1f, 1f, 1f)
        batch.end()
    }

    private fun handleInput() {
        if (transitioning) return

        if (Gdx.input.isTouched) {
            val touchPos = Vector2(Gdx.input.x.toFloat(), Gdx.input.y.toFloat())
            val worldPos = viewport.unproject(touchPos)

            if (Gdx.input.justTouched()) {
                // Touch down
                startButton.handleTouchDown(worldPos.x, worldPos.y)
                backButton.handleTouchDown(worldPos.x, worldPos.y)
                timeSlider.handleTouchDown(worldPos.x, worldPos.y)
                caseSelector.handleTouchDown(worldPos.x, worldPos.y)
            } else {
                // Dragging
                timeSlider.handleTouchDragged(worldPos.x, worldPos.y)
            }

            // Check hover
            timeSlider.checkHover(worldPos.x, worldPos.y)
            caseSelector.handleHover(worldPos.x, worldPos.y)
        } else {
            // Touch up
            val touchPos = Vector2(Gdx.input.x.toFloat(), Gdx.input.y.toFloat())
            val worldPos = viewport.unproject(touchPos)
            startButton.handleTouchUp(worldPos.x, worldPos.y)
            backButton.handleTouchUp(worldPos.x, worldPos.y)
            timeSlider.handleTouchUp(worldPos.x, worldPos.y)
            caseSelector.handleTouchUp(worldPos.x, worldPos.y)
        }
    }

    override fun resize(width: Int, height: Int) {
        viewport.update(width, height, true)
    }

    override fun pause() {}
    override fun resume() {}
    override fun hide() {}

    override fun dispose() {
        batch.dispose()
        background.dispose()
        titleText.dispose()
        balloonIcon.dispose()
        decorations.dispose()
        timeSlider.dispose()
        caseSelector.dispose()
        startButton.dispose()
        backButton.dispose()
    }
}
