package com.aurora.reading.core.screens

import com.badlogic.gdx.Game
import com.badlogic.gdx.Gdx
import com.badlogic.gdx.Screen
import com.badlogic.gdx.graphics.Color
import com.badlogic.gdx.graphics.GL20
import com.badlogic.gdx.graphics.g2d.BitmapFont
import com.badlogic.gdx.graphics.g2d.GlyphLayout
import com.badlogic.gdx.graphics.g2d.SpriteBatch
import com.badlogic.gdx.graphics.glutils.ShapeRenderer
import com.badlogic.gdx.math.Interpolation
import com.badlogic.gdx.math.Rectangle
import com.aurora.reading.core.components.*
import com.aurora.reading.core.config.ThemeConfig
import com.aurora.reading.core.models.GameResult
import com.aurora.reading.core.services.AudioManager
import com.aurora.reading.core.services.FontManager
import com.aurora.reading.core.utils.ResponsiveUtils

/**
 * Results Screen
 *
 * Displays game performance after completing a Letter Pop round.
 *
 * Features:
 * - Final score display (X/10)
 * - Star rating (1-3 stars)
 * - Accuracy percentage
 * - Time taken display
 * - Celebration message
 * - "Play Again" button
 * - "Main Menu" button
 * - Fade in/out transitions
 *
 * Responsibilities:
 * - Display game results
 * - Calculate and show star rating
 * - Handle navigation (play again, main menu)
 * - Provide positive reinforcement (ADHD-friendly)
 */
class ResultsScreen(
    private val game: Game,
    private val gameResult: GameResult
) : Screen {

    private val responsive = ResponsiveUtils()
    private val worldWidth = ResponsiveUtils.WORLD_WIDTH
    private val worldHeight = ResponsiveUtils.WORLD_HEIGHT

    // Graphics
    private val batch = SpriteBatch()
    private val shapeRenderer = ShapeRenderer()

    // Components
    private lateinit var background: GradientBackground
    private lateinit var titleText: TitleText
    private lateinit var floatingStars: FloatingStars
    private lateinit var balloonIcon: BalloonIcon
    private lateinit var starRating: StarRating
    private lateinit var playAgainButton: Button
    private lateinit var mainMenuButton: Button

    // Fonts
    private lateinit var scoreFont: BitmapFont
    private lateinit var labelFont: BitmapFont
    private lateinit var statFont: BitmapFont

    private val glyphLayout = GlyphLayout()

    // Fade transition
    private var fadeAlpha = 0f
    private var fadeIn = true
    private val FADE_DURATION = 0.5f // 500ms
    private var fadeTime = 0f

    // Transition state
    private var transitioning = false
    private var fadeOut = false
    private var nextScreen: Screen? = null

    // Celebration sound played flag
    private var celebrationPlayed = false

    override fun show() {
        Gdx.app.log("ResultsScreen", "Showing results screen")
        Gdx.app.log("ResultsScreen", "Score: ${gameResult.score}/${gameResult.totalQuestions}")
        Gdx.app.log("ResultsScreen", "Accuracy: ${String.format("%.1f", gameResult.getAccuracy())}%")
        Gdx.app.log("ResultsScreen", "Stars: ${gameResult.getStarRating()}")
        Gdx.app.log("ResultsScreen", "Time: ${String.format("%.1f", gameResult.totalTimeElapsed)}s")

        // Background
        background = GradientBackground(
            width = worldWidth,
            height = worldHeight,
            colors = arrayOf(ThemeConfig.Colors.PURPLE, ThemeConfig.Colors.PINK)
        )

        // Title (celebration message)
        val celebrationMessage = gameResult.getCelebrationMessage()
        titleText = TitleText(
            text = celebrationMessage,
            x = responsive.scaleX(50f),
            y = responsive.scaleY(85f),
            fontSize = responsive.scaleX(5f).toInt()
        )

        // Floating stars decoration
        floatingStars = FloatingStars(
            worldWidth = worldWidth,
            worldHeight = worldHeight,
            starCount = 20
        )

        // Balloon icon decoration
        balloonIcon = BalloonIcon(
            x = responsive.scaleX(50f),
            y = responsive.scaleY(75f),
            size = responsive.scaleX(6f)
        )

        // Star rating
        starRating = StarRating(
            x = responsive.scaleX(50f),
            y = responsive.scaleY(65f),
            starSize = responsive.scaleX(5f),
            spacing = responsive.scaleX(2f),
            maxStars = 3
        )
        starRating.setRating(gameResult.getStarRating())

        // Buttons
        playAgainButton = Button(
            text = "PLAY AGAIN",
            x = responsive.scaleX(35f),
            y = responsive.scaleY(15f),
            width = responsive.scaleX(20f),
            height = responsive.scaleY(10f),
            texturePath = "images/button.png",
            fontSize = responsive.scaleX(2f).toInt()
        )

        mainMenuButton = Button(
            text = "MAIN MENU",
            x = responsive.scaleX(65f),
            y = responsive.scaleY(15f),
            width = responsive.scaleX(20f),
            height = responsive.scaleY(10f),
            texturePath = "images/button.png",
            fontSize = responsive.scaleX(2f).toInt()
        )

        // Fonts
        scoreFont = FontManager.getFont(
            size = responsive.scaleX(8f).toInt(),
            color = Color.WHITE,
            borderWidth = responsive.scaleX(0.4f).coerceAtLeast(2f),
            borderColor = ThemeConfig.Colors.PURPLE
        )

        labelFont = FontManager.getFont(
            size = responsive.scaleX(2.5f).toInt(),
            color = Color.WHITE,
            borderWidth = responsive.scaleX(0.2f).coerceAtLeast(1f),
            borderColor = ThemeConfig.Colors.PURPLE
        )

        statFont = FontManager.getFont(
            size = responsive.scaleX(3f).toInt(),
            color = Color.WHITE,
            borderWidth = responsive.scaleX(0.2f).coerceAtLeast(1f),
            borderColor = ThemeConfig.Colors.PURPLE
        )
    }

    override fun render(delta: Float) {
        // Clear screen
        Gdx.gl.glClearColor(0f, 0f, 0f, 1f)
        Gdx.gl.glClear(GL20.GL_COLOR_BUFFER_BIT)

        // Update fade transition
        updateFade(delta)

        // Update components
        floatingStars.update(delta)
        starRating.update(delta)
        playAgainButton.update(delta)
        mainMenuButton.update(delta)

        // Play celebration sound once (when stars are visible)
        if (!celebrationPlayed && fadeAlpha > 0.5f) {
            when (gameResult.getStarRating()) {
                3 -> AudioManager.playCorrect() // Excellent sound
                2 -> AudioManager.playCorrect() // Good sound
                else -> AudioManager.playCorrect() // Encouragement sound
            }
            celebrationPlayed = true
        }

        // Render
        batch.begin()

        background.draw(batch)
        floatingStars.draw(batch)
        balloonIcon.draw(batch)
        titleText.draw(batch)
        starRating.render(batch, shapeRenderer)

        // Score display (X/10)
        val scoreText = "${gameResult.score}/${gameResult.totalQuestions}"
        glyphLayout.setText(scoreFont, scoreText)
        scoreFont.draw(
            batch,
            scoreText,
            responsive.scaleX(50f) - glyphLayout.width / 2,
            responsive.scaleY(52f)
        )

        // Accuracy label
        val accuracyLabel = "Accuracy"
        glyphLayout.setText(labelFont, accuracyLabel)
        labelFont.draw(
            batch,
            accuracyLabel,
            responsive.scaleX(30f) - glyphLayout.width / 2,
            responsive.scaleY(42f)
        )

        // Accuracy percentage
        val accuracyText = String.format("%.0f%%", gameResult.getAccuracy())
        glyphLayout.setText(statFont, accuracyText)
        statFont.draw(
            batch,
            accuracyText,
            responsive.scaleX(30f) - glyphLayout.width / 2,
            responsive.scaleY(37f)
        )

        // Time label
        val timeLabel = "Time"
        glyphLayout.setText(labelFont, timeLabel)
        labelFont.draw(
            batch,
            timeLabel,
            responsive.scaleX(70f) - glyphLayout.width / 2,
            responsive.scaleY(42f)
        )

        // Time taken
        val timeText = String.format("%.1fs", gameResult.totalTimeElapsed)
        glyphLayout.setText(statFont, timeText)
        statFont.draw(
            batch,
            timeText,
            responsive.scaleX(70f) - glyphLayout.width / 2,
            responsive.scaleY(37f)
        )

        playAgainButton.draw(batch)
        mainMenuButton.draw(batch)

        batch.end()

        // Apply fade overlay
        applyFadeOverlay()

        // Handle input
        if (!transitioning) {
            handleInput()
        }
    }

    /**
     * Update fade transition
     */
    private fun updateFade(delta: Float) {
        if (fadeIn) {
            fadeTime += delta
            fadeAlpha = Interpolation.fade.apply(fadeTime / FADE_DURATION).coerceIn(0f, 1f)

            if (fadeTime >= FADE_DURATION) {
                fadeIn = false
                fadeAlpha = 1f
            }
        }

        if (fadeOut) {
            fadeTime += delta
            fadeAlpha = 1f - Interpolation.fade.apply(fadeTime / FADE_DURATION).coerceIn(0f, 1f)

            if (fadeTime >= FADE_DURATION) {
                fadeOut = false
                fadeAlpha = 0f

                // Transition to next screen
                nextScreen?.let {
                    game.screen = it
                }
            }
        }
    }

    /**
     * Apply fade overlay
     */
    private fun applyFadeOverlay() {
        if (fadeAlpha < 1f) {
            batch.begin()
            batch.end()

            shapeRenderer.begin(ShapeRenderer.ShapeType.Filled)
            shapeRenderer.color = Color(0f, 0f, 0f, 1f - fadeAlpha)
            shapeRenderer.rect(0f, 0f, worldWidth, worldHeight)
            shapeRenderer.end()
        }
    }

    /**
     * Start fade out transition
     */
    private fun startFadeOut(screen: Screen) {
        if (transitioning) return

        transitioning = true
        fadeOut = true
        fadeTime = 0f
        nextScreen = screen
    }

    /**
     * Handle user input
     */
    private fun handleInput() {
        if (!Gdx.input.justTouched()) return

        val touchX = Gdx.input.x.toFloat()
        val touchY = (Gdx.graphics.height - Gdx.input.y).toFloat()

        // Convert screen coordinates to world coordinates
        val worldX = (touchX / Gdx.graphics.width) * worldWidth
        val worldY = (touchY / Gdx.graphics.height) * worldHeight

        // Check Play Again button
        val playX = responsive.scaleX(35f)
        val playY = responsive.scaleY(15f)
        val playW = responsive.scaleX(20f)
        val playH = responsive.scaleY(10f)
        val playBounds = Rectangle(
            playX - playW / 2,
            playY - playH / 2,
            playW,
            playH
        )

        if (playBounds.contains(worldX, worldY)) {
            playAgain()
            return
        }

        // Check Main Menu button
        val menuX = responsive.scaleX(65f)
        val menuY = responsive.scaleY(15f)
        val menuW = responsive.scaleX(20f)
        val menuH = responsive.scaleY(10f)
        val menuBounds = Rectangle(
            menuX - menuW / 2,
            menuY - menuH / 2,
            menuW,
            menuH
        )

        if (menuBounds.contains(worldX, worldY)) {
            navigateToMainMenu()
            return
        }
    }

    /**
     * Play again - restart Letter Pop with same settings
     */
    private fun playAgain() {
        if (transitioning) return

        Gdx.app.log("ResultsScreen", "Play Again tapped")
        AudioManager.playCorrect()

        // Navigate back to Letter Pop Menu screen
        // (User can adjust settings and start again)
        startFadeOut(LetterPopMenuScreen(game))
    }

    /**
     * Navigate to Main Menu
     */
    private fun navigateToMainMenu() {
        if (transitioning) return

        Gdx.app.log("ResultsScreen", "Main Menu tapped")
        AudioManager.playCorrect()

        startFadeOut(MainMenuScreen(game))
    }

    override fun resize(width: Int, height: Int) {
        // Handle screen resize if needed
    }

    override fun pause() {}

    override fun resume() {}

    override fun hide() {}

    override fun dispose() {
        batch.dispose()
        shapeRenderer.dispose()
        background.dispose()
        titleText.dispose()
        floatingStars.dispose()
        balloonIcon.dispose()
        starRating.dispose()
        playAgainButton.dispose()
        mainMenuButton.dispose()
        // Fonts managed by FontManager
    }
}
