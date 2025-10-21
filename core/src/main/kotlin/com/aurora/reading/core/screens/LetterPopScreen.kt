package com.aurora.reading.core.screens

import com.aurora.reading.core.assets.Assets
import com.aurora.reading.core.components.*
import com.aurora.reading.core.config.ThemeConfig
import com.aurora.reading.core.models.GameResult
import com.aurora.reading.core.services.AudioManager
import com.aurora.reading.core.services.FontManager
import com.aurora.reading.core.utils.ResponsiveUtils
import com.badlogic.gdx.Game
import com.badlogic.gdx.Gdx
import com.badlogic.gdx.Preferences
import com.badlogic.gdx.Screen
import com.badlogic.gdx.graphics.Color
import com.badlogic.gdx.graphics.GL20
import com.badlogic.gdx.graphics.g2d.BitmapFont
import com.badlogic.gdx.graphics.g2d.GlyphLayout
import com.badlogic.gdx.graphics.g2d.SpriteBatch
import com.badlogic.gdx.graphics.glutils.ShapeRenderer
import com.badlogic.gdx.math.MathUtils
import com.badlogic.gdx.math.Vector2
import kotlin.math.sqrt

/**
 * Letter Pop Game Screen
 *
 * Main game screen where player clicks floating bubbles to match target letters.
 *
 * Features:
 * - 6 floating bubbles with physics
 * - Target letter display
 * - Timer countdown with visual bar
 * - Score tracking
 * - Round progression (10 letters)
 * - Correct/incorrect answer feedback (non-punitive)
 * - Home button navigation
 * - Settings integration (time limit, letter case)
 *
 * Responsibilities:
 * - Manage game state (rounds, score, timer)
 * - Spawn and update bubbles with physics
 * - Handle bubble clicks and feedback
 * - Render all game UI elements
 * - Apply settings from LetterPopMenuScreen
 */
class LetterPopScreen(private val game: Game) : Screen {

    private val responsive = ResponsiveUtils()
    private val shapeRenderer = ShapeRenderer()
    private val batch = SpriteBatch()

    // Preferences
    private val prefs: Preferences = Gdx.app.getPreferences("aurora-reading")

    // Game settings (from Phase 2.7.7)
    private var timePerLetter = 10 // seconds (5-15 from settings)
    private var letterCase = "uppercase" // uppercase, lowercase, mixed

    // Round state
    private val roundLetters = mutableListOf<String>()
    private var currentLetterIndex = 0
    private var targetLetter = ""

    // Score
    private var score = 0

    // Timer
    private var timeRemaining = 10f
    private var totalTimeElapsed = 0f // Track total time for results screen (Phase 2.7.9)

    // Bubbles
    private val bubbles = mutableListOf<Bubble>()
    private val BUBBLE_COUNT = 6
    private val bubbleRadius = responsive.scaleX(5f) // 5% of screen width

    // UI Components
    private lateinit var background: GradientBackground
    private lateinit var titleText: TitleText
    private lateinit var homeButton: Button
    private lateinit var timerBar: TimerBar
    private lateinit var balloonIcon: BalloonIcon

    // Fonts
    private val scoreLabelFont: BitmapFont = FontManager.getFont(responsive.getFontSize(24))
    private val scoreValueFont: BitmapFont = FontManager.getFont(responsive.getFontSize(52))
    private val roundFont: BitmapFont = FontManager.getFont(responsive.getFontSize(24))

    private val glyphLayout = GlyphLayout()

    // Animation state
    private var isFadingOut = false
    private var fadeAlpha = 1f
    private var titleAlpha = 1f
    private var titleFadeDelay = 1f

    // World bounds for bubble physics
    private val worldWidth = ResponsiveUtils.WORLD_WIDTH
    private val worldHeight = ResponsiveUtils.WORLD_HEIGHT
    private val headerHeight = responsive.scaleY(12f) // Reserve 12% for header

    init {
        loadSettings()
        createComponents()
        startRound()
    }

    /**
     * Load game settings from preferences
     */
    private fun loadSettings() {
        timePerLetter = prefs.getInteger("letterPop_timePerRound", 10)
        letterCase = prefs.getString("letterPop_letterCase", "uppercase")
        timeRemaining = timePerLetter.toFloat()

        Gdx.app.log("LetterPopScreen", "Settings loaded: time=$timePerLetter, case=$letterCase")
    }

    /**
     * Create UI components
     */
    private fun createComponents() {
        // Gradient background (purple → pink)
        background = GradientBackground(
            width = worldWidth,
            height = worldHeight,
            colors = arrayOf(ThemeConfig.Colors.PURPLE, ThemeConfig.Colors.PINK)
        )

        // Title at top
        titleText = TitleText(
            text = "LETTER POP",
            x = responsive.centerX,
            y = responsive.scaleY(90f),
            fontSize = responsive.getFontSize(48)
        )

        // Balloon icon at top
        balloonIcon = BalloonIcon(
            x = responsive.centerX,
            y = responsive.scaleY(85f),
            size = responsive.scaleX(8f),
            balloonColor = ThemeConfig.Colors.PINK
        )

        // Home button (top right)
        homeButton = Button(
            x = responsive.scaleX(92f),
            y = responsive.scaleY(94f),
            width = responsive.scaleX(5f),
            height = responsive.scaleY(7f),
            texturePath = Assets.UI.BTN_HOME,
            text = "",
            fontSize = responsive.getFontSize(20),
            onClick = { navigateToMainMenu() }
        )

        // Timer bar at top (below header area)
        timerBar = TimerBar(
            x = responsive.scaleX(10f),
            y = responsive.scaleY(10f),
            width = responsive.scaleX(80f),
            height = responsive.scaleY(1.5f)
        )
    }

    /**
     * Start a new round (10 letters)
     */
    private fun startRound() {
        // Generate 10 random letters
        roundLetters.clear()
        val alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".toCharArray().map { it.toString() }

        repeat(10) {
            val randomLetter = alphabet.random()
            roundLetters.add(applyLetterCase(randomLetter))
        }

        currentLetterIndex = 0
        score = 0

        Gdx.app.log("LetterPopScreen", "Round started with letters: $roundLetters")

        // Start first letter
        nextLetter()
    }

    /**
     * Advance to next letter
     */
    private fun nextLetter() {
        if (currentLetterIndex >= roundLetters.size) {
            // Round complete!
            handleRoundComplete()
            return
        }

        // Set target letter
        targetLetter = roundLetters[currentLetterIndex]

        Gdx.app.log("LetterPopScreen", "Next letter: $targetLetter (${currentLetterIndex + 1}/10)")

        // Reset timer
        timeRemaining = timePerLetter.toFloat()
        timerBar.setProgress(1f)

        // Play target letter audio
        playTargetLetterAudio()

        // Spawn bubbles
        spawnBubbles()
    }

    /**
     * Apply letter case setting
     */
    private fun applyLetterCase(letter: String): String {
        return when (letterCase) {
            "uppercase" -> letter.uppercase()
            "lowercase" -> letter.lowercase()
            "mixed" -> if (MathUtils.randomBoolean()) letter.uppercase() else letter.lowercase()
            else -> letter.uppercase()
        }
    }

    /**
     * Play target letter audio
     */
    private fun playTargetLetterAudio() {
        // Audio files are named "find_letter_X.mp3" (uppercase)
        val audioKey = "find_letter_${targetLetter.uppercase()}"
        AudioManager.playVoice(audioKey)
    }

    /**
     * Spawn 6 bubbles with random letters (one matches target)
     */
    private fun spawnBubbles() {
        // Clear existing bubbles
        bubbles.forEach { it.dispose() }
        bubbles.clear()

        // Generate letters (one target + 5 random)
        val alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".toCharArray().map { it.toString() }
        val letters = mutableListOf(targetLetter)

        while (letters.size < BUBBLE_COUNT) {
            val randomLetter = applyLetterCase(alphabet.random())
            // Avoid duplicates (case-insensitive)
            if (!letters.any { it.equals(randomLetter, ignoreCase = true) }) {
                letters.add(randomLetter)
            }
        }

        // Shuffle so target isn't always first
        letters.shuffle()

        Gdx.app.log("LetterPopScreen", "Spawning bubbles with letters: $letters")

        // Generate spawn positions with minimum spacing
        val positions = generateSpawnPositions(BUBBLE_COUNT, bubbleRadius * 2.5f)

        // Create bubbles
        letters.forEachIndexed { index, letter ->
            val bubble = Bubble(
                letter = letter,
                initialX = positions[index].x,
                initialY = positions[index].y,
                radius = bubbleRadius
            )

            // Set random velocity
            bubble.setVelocity(
                MathUtils.random(-120f, 120f),
                MathUtils.random(-120f, 120f)
            )

            bubbles.add(bubble)
        }
    }

    /**
     * Generate spawn positions with minimum spacing
     */
    private fun generateSpawnPositions(count: Int, minSpacing: Float): List<Vector2> {
        val positions = mutableListOf<Vector2>()

        val playAreaLeft = bubbleRadius
        val playAreaRight = worldWidth - bubbleRadius
        val playAreaTop = worldHeight - headerHeight - bubbleRadius
        val playAreaBottom = headerHeight + bubbleRadius

        repeat(count) { index ->
            val validPosition = findValidSpawnPosition(
                positions,
                minSpacing,
                playAreaLeft,
                playAreaRight,
                playAreaBottom,
                playAreaTop
            )

            positions.add(validPosition ?: getFallbackGridPosition(
                index,
                playAreaLeft,
                playAreaRight,
                playAreaBottom,
                playAreaTop
            ))
        }

        return positions
    }

    /**
     * Try to find a valid spawn position that doesn't overlap existing positions
     */
    private fun findValidSpawnPosition(
        existingPositions: List<Vector2>,
        minSpacing: Float,
        left: Float,
        right: Float,
        bottom: Float,
        top: Float
    ): Vector2? {
        val maxAttempts = 100
        repeat(maxAttempts) {
            val testPos = Vector2(
                MathUtils.random(left, right),
                MathUtils.random(bottom, top)
            )

            val tooClose = existingPositions.any { existing ->
                testPos.dst(existing) < minSpacing
            }

            if (!tooClose) return testPos
        }
        return null
    }

    /**
     * Get fallback grid position when random placement fails
     */
    private fun getFallbackGridPosition(
        index: Int,
        left: Float,
        right: Float,
        bottom: Float,
        top: Float
    ): Vector2 {
        return Vector2(
            left + (right - left) * (index % 3) / 2f,
            bottom + (top - bottom) * (index / 3) / 1f
        )
    }

    /**
     * Handle bubble click
     */
    private fun handleBubbleClick(bubble: Bubble) {
        if (bubble.letter.equals(targetLetter, ignoreCase = true)) {
            handleCorrectAnswer(bubble)
        } else {
            handleIncorrectAnswer(bubble)
        }
    }

    /**
     * Handle correct answer
     */
    private fun handleCorrectAnswer(bubble: Bubble) {
        Gdx.app.log("LetterPopScreen", "Correct answer! Letter: ${bubble.letter}")

        // Play correct sound
        AudioManager.playCorrect()

        // Increment score
        score++

        // Pop bubble with animation
        bubble.pop {
            // Move to next letter after pop animation
            currentLetterIndex++
            nextLetter()
        }
    }

    /**
     * Handle incorrect answer (non-punitive)
     */
    private fun handleIncorrectAnswer(bubble: Bubble) {
        Gdx.app.log("LetterPopScreen", "Incorrect answer. Letter: ${bubble.letter}, Target: $targetLetter")

        // Gentle wobble - just trigger smoosh for now
        bubble.smoosh()

        // Play gentle "try again" sound
        AudioManager.playWrong()

        // Bubble stays - no punishment
    }

    /**
     * Handle timer expiration
     */
    private fun handleTimeExpired() {
        Gdx.app.log("LetterPopScreen", "Time expired for letter: $targetLetter")

        // Non-punitive - just move to next letter
        currentLetterIndex++
        nextLetter()
    }

    /**
     * Handle round completion
     */
    private fun handleRoundComplete() {
        Gdx.app.log("LetterPopScreen", "Round complete! Final score: $score/10")
        Gdx.app.log("LetterPopScreen", "Total time elapsed: ${String.format("%.1f", totalTimeElapsed)}s")

        // Play success sound
        AudioManager.playSuccess()

        // Create game result (Phase 2.7.9)
        val result = GameResult(
            score = score,
            totalQuestions = 10,
            timeLimit = timePerLetter.toFloat(),
            totalTimeElapsed = totalTimeElapsed,
            letterCase = letterCase
        )

        // Navigate to results screen (Phase 2.7.9)
        Gdx.app.log("LetterPopScreen", "Navigating to ResultsScreen")
        game.screen = ResultsScreen(game, result)
    }

    /**
     * Navigate to main menu
     */
    private fun navigateToMainMenu() {
        if (isFadingOut) return

        Gdx.app.log("LetterPopScreen", "Navigating to main menu")
        isFadingOut = true
        AudioManager.playSfx(Assets.Audio.POP) // Play pop sound for button click
    }

    /**
     * Update bubble physics
     */
    private fun updateBubbles(delta: Float) {
        // Create a snapshot to avoid ConcurrentModificationException
        val bubblesSnapshot = bubbles.toList()

        // Update each bubble and check wall collisions
        bubblesSnapshot.forEach { bubble ->
            bubble.update(delta)
            checkBubbleWallCollisions(bubble)
        }

        // Check bubble-to-bubble collisions
        checkBubbleBubbleCollisions(bubblesSnapshot)
    }

    /**
     * Check and handle wall collisions for a single bubble
     */
    private fun checkBubbleWallCollisions(bubble: Bubble) {
        val pos = bubble.position
        val radius = bubbleRadius

        // Left/Right walls
        if (pos.x - radius < 0) {
            bubble.bounceX()
            bubble.smoosh()
            pos.x = radius
            AudioManager.playBubblePop()
        } else if (pos.x + radius > worldWidth) {
            bubble.bounceX()
            bubble.smoosh()
            pos.x = worldWidth - radius
            AudioManager.playBubblePop()
        }

        // Top/Bottom walls
        if (pos.y + radius > worldHeight) {
            bubble.bounceY()
            bubble.smoosh()
            pos.y = worldHeight - radius
            AudioManager.playBubblePop()
        } else if (pos.y - radius < headerHeight) {
            bubble.bounceY()
            bubble.smoosh()
            pos.y = headerHeight + radius
            AudioManager.playBubblePop()
        }
    }

    /**
     * Check and handle bubble-to-bubble collisions
     */
    private fun checkBubbleBubbleCollisions(bubblesSnapshot: List<Bubble>) {
        for (i in bubblesSnapshot.indices) {
            for (j in i + 1 until bubblesSnapshot.size) {
                val bubbleA = bubblesSnapshot[i]
                val bubbleB = bubblesSnapshot[j]

                if (bubbleA.bounds.overlaps(bubbleB.bounds)) {
                    resolveCollision(bubbleA, bubbleB)
                    bubbleA.smoosh()
                    bubbleB.smoosh()
                    AudioManager.playBubblePop()
                }
            }
        }
    }

    /**
     * Resolve bubble collision with physics
     */
    private fun resolveCollision(a: Bubble, b: Bubble) {
        val dx = b.position.x - a.position.x
        val dy = b.position.y - a.position.y
        val distance = sqrt(dx * dx + dy * dy)

        if (distance == 0f) return

        // Normalize collision vector
        val nx = dx / distance
        val ny = dy / distance

        // Relative velocity
        val dvx = b.velocity.x - a.velocity.x
        val dvy = b.velocity.y - a.velocity.y

        // Relative velocity in collision normal direction
        val dvn = dvx * nx + dvy * ny

        // Do not resolve if velocities are separating
        if (dvn >= 0) return

        // Bounce (elastic collision)
        val bounce = -dvn
        a.velocity.x -= bounce * nx
        a.velocity.y -= bounce * ny
        b.velocity.x += bounce * nx
        b.velocity.y += bounce * ny

        // Separate bubbles to prevent overlap
        val overlap = (bubbleRadius * 2 - distance) / 2
        a.position.x -= overlap * nx
        a.position.y -= overlap * ny
        b.position.x += overlap * nx
        b.position.y += overlap * ny
    }

    override fun show() {
        Gdx.app.log("LetterPopScreen", "Screen shown")
    }

    /**
     * Update game timer and total elapsed time
     * @return true if time expired, false otherwise
     */
    private fun updateTimer(delta: Float): Boolean {
        if (isFadingOut || titleFadeDelay > 0) return false

        timeRemaining -= delta
        totalTimeElapsed += delta

        if (timeRemaining <= 0) {
            handleTimeExpired()
            return true
        }

        timerBar.setProgress(timeRemaining / timePerLetter.toFloat())
        return false
    }

    /**
     * Update title fade animation
     */
    private fun updateTitleFade(delta: Float) {
        if (titleFadeDelay > 0) {
            titleFadeDelay -= delta
        }

        if (titleFadeDelay <= 0 && titleAlpha > 0) {
            titleAlpha -= delta * 1.25f // 0.8s fade
            if (titleAlpha < 0) titleAlpha = 0f
        }
    }

    /**
     * Update fade out animation
     * @return true if navigation complete, false otherwise
     */
    private fun updateFadeOut(delta: Float): Boolean {
        if (!isFadingOut) return false

        fadeAlpha -= delta * 3.33f // 0.3s fade
        if (fadeAlpha <= 0) {
            game.screen = MainMenuScreen(game)
            return true
        }
        return false
    }

    /**
     * Handle touch input for buttons and bubbles
     */
    private fun handleTouchInput() {
        if (!Gdx.input.justTouched() || isFadingOut) return

        // Convert screen pixels to world coordinates
        val screenX = Gdx.input.x.toFloat()
        val screenY = (Gdx.graphics.height - Gdx.input.y).toFloat() // Flip Y

        val touchX = (screenX / Gdx.graphics.width) * worldWidth
        val touchY = (screenY / Gdx.graphics.height) * worldHeight

        // Check home button first
        if (isHomeButtonTouched(touchX, touchY)) {
            navigateToMainMenu()
            return
        }

        // Check bubble clicks
        checkBubbleClicks(touchX, touchY)
    }

    /**
     * Check if home button was touched
     */
    private fun isHomeButtonTouched(touchX: Float, touchY: Float): Boolean {
        val btnX = responsive.scaleX(92f)
        val btnY = responsive.scaleY(94f)
        val btnW = responsive.scaleX(5f)
        val btnH = responsive.scaleY(7f)
        val buttonBounds = com.badlogic.gdx.math.Rectangle(
            btnX - btnW / 2,
            btnY - btnH / 2,
            btnW,
            btnH
        )
        return buttonBounds.contains(touchX, touchY)
    }

    /**
     * Check if any bubble was clicked
     */
    private fun checkBubbleClicks(touchX: Float, touchY: Float) {
        for (bubble in bubbles) {
            if (!bubble.isDestroyed && bubble.contains(touchX, touchY)) {
                handleBubbleClick(bubble)
                break
            }
        }
    }

    /**
     * Render all UI elements
     */
    private fun renderUI() {
        Gdx.gl.glClearColor(0f, 0f, 0f, 1f)
        Gdx.gl.glClear(GL20.GL_COLOR_BUFFER_BIT)

        batch.begin()

        // Background
        background.draw(batch)

        // Title (fading out)
        if (titleAlpha > 0) {
            balloonIcon.draw(batch)
            titleText.draw(batch)
        }

        // Score display (top center)
        renderScore()

        // Round progress (top left)
        renderRoundProgress()

        batch.end()

        // Timer bar
        timerBar.render(batch, shapeRenderer)

        // Bubbles
        renderBubbles()

        // Fade out overlay
        renderFadeOverlay()
    }

    /**
     * Render score display
     */
    private fun renderScore() {
        glyphLayout.setText(scoreLabelFont, "SCORE")
        scoreLabelFont.draw(
            batch,
            "SCORE",
            responsive.centerX - glyphLayout.width / 2,
            responsive.scaleY(95f)
        )

        glyphLayout.setText(scoreValueFont, score.toString())
        scoreValueFont.draw(
            batch,
            score.toString(),
            responsive.centerX - glyphLayout.width / 2,
            responsive.scaleY(88f)
        )
    }

    /**
     * Render round progress indicator
     */
    private fun renderRoundProgress() {
        val roundText = "ROUND ${currentLetterIndex + 1}"
        glyphLayout.setText(roundFont, roundText)
        roundFont.draw(
            batch,
            roundText,
            responsive.scaleX(5f),
            responsive.scaleY(95f)
        )
    }

    /**
     * Render all bubbles and home button
     */
    private fun renderBubbles() {
        batch.begin()
        bubbles.forEach { bubble ->
            bubble.render(batch, shapeRenderer)
        }
        homeButton.draw(batch)
        batch.end()
    }

    /**
     * Render fade out overlay
     */
    private fun renderFadeOverlay() {
        if (fadeAlpha < 1f) {
            shapeRenderer.begin(ShapeRenderer.ShapeType.Filled)
            shapeRenderer.color = Color(0f, 0f, 0f, 1f - fadeAlpha)
            shapeRenderer.rect(0f, 0f, worldWidth, worldHeight)
            shapeRenderer.end()
        }
    }

    override fun render(delta: Float) {
        // Update timer (returns true if expired)
        if (updateTimer(delta)) return

        // Update animations
        updateTitleFade(delta)
        updateBubbles(delta)
        homeButton.update(delta)

        // Update fade out (returns true if navigation complete)
        if (updateFadeOut(delta)) return

        // Handle touch input
        handleTouchInput()

        // Render all UI
        renderUI()
    }

    override fun resize(width: Int, height: Int) {}
    override fun pause() {}
    override fun resume() {}
    override fun hide() {}

    override fun dispose() {
        bubbles.forEach { it.dispose() }
        batch.dispose()
        shapeRenderer.dispose()
        background.dispose()
        homeButton.dispose()
        timerBar.dispose()
        balloonIcon.dispose()
        Gdx.app.log("LetterPopScreen", "Screen disposed")
    }
}
