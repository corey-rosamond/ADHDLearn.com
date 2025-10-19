# Phase 2.7.8: Letter Pop Game - Implementation Plan

## Overview

Implement the core Letter Pop mini-game where Aurora clicks floating bubbles containing letters to match the target letter. This is the main educational gameplay screen with physics-based bubble movement, scoring, timer, and round progression.

**Phaser Reference:** `archive/phaser-web/src/scenes/LetterPopScene.js`

## Objectives

1. Create Bubble component with physics-based movement
2. Implement LetterPopScreen game logic
3. Add floating bubble spawning with collision detection
4. Implement target letter matching system
5. Add timer countdown with visual progress bar
6. Implement score tracking and display
7. Add round progression (10 letters per round)
8. Implement correct/incorrect answer feedback (non-punitive)
9. Add home button navigation
10. Implement game completion handling
11. Apply game settings from Phase 2.7.7 (time limit, letter case)

## Components to Reuse

✅ **Already Built:**
- `GradientBackground` - Purple → Pink gradient (Phase 2.7.4)
- `TitleText` - "LETTER POP" title (Phase 2.7.4)
- `Button` - Home button (Phase 2.7.4)
- `BalloonIcon` - Animated balloon (Phase 2.7.5)
- `ResponsiveUtils` - Responsive positioning
- `ThemeConfig` - Color palette and constants
- `FontManager` - FreeType font generation
- `AudioManager` - Sound and voice playback

## Game Mechanics

### Round Structure
- Each round consists of 10 letters
- Letters are randomly selected from the alphabet
- Timer resets for each letter
- Score accumulates across the round
- Progress displayed as "ROUND X" (1-10)

### Bubble Behavior
- 6 bubbles spawn at random positions
- One bubble contains the target letter
- Other bubbles contain random different letters
- Bubbles bounce off walls and each other (physics)
- Bubbles have "smoosh" visual effect on collision
- Bubbles float continuously with physics velocity

### Matching Logic
- Player clicks a bubble
- If letter matches target → Correct answer flow
- If letter doesn't match → Gentle incorrect feedback (non-punitive)
- New set of bubbles spawns after correct answer
- Progress advances to next letter

### Timer System
- Each letter has a time limit (from settings, 5-15 seconds)
- Visual progress bar shows time remaining
- Color-coded: Green (>6s), Yellow (3-6s), Red (<3s)
- If time runs out → Skip to next letter (non-punitive)

### Scoring
- +1 point for each correct answer
- No point deduction for incorrect answers
- Max score: 10 (if all letters answered correctly)

## Implementation Tasks

### Task 1: Create Bubble Component

**File:** `core/src/main/kotlin/com/aurora/reading/core/components/Bubble.kt`

```kotlin
package com.aurora.reading.core.components

import com.badlogic.gdx.graphics.Color
import com.badlogic.gdx.graphics.g2d.BitmapFont
import com.badlogic.gdx.graphics.g2d.SpriteBatch
import com.badlogic.gdx.graphics.glutils.ShapeRenderer
import com.badlogic.gdx.math.Circle
import com.badlogic.gdx.math.Vector2
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
 * - Physics-based movement (handled by screen)
 * - Collision detection via Circle bounds
 * - Smoosh animation on collision
 * - Click detection
 * - Scale animation on hover
 */
class Bubble(
    val letter: String,
    initialX: Float,
    initialY: Float,
    private val radius: Float
) {
    private val responsive = ResponsiveUtils()

    // Position and velocity
    var position = Vector2(initialX, initialY)
    var velocity = Vector2(0f, 0f)

    // Collision bounds
    val bounds = Circle(initialX, initialY, radius)

    // Visual state
    var scale = 1f
    var isSmooshing = false
    var isDestroyed = false

    // Fonts
    private val letterFont: BitmapFont = FontManager.getFont(
        size = (radius * 1.2f).toInt(),
        color = Color.WHITE,
        borderWidth = responsive.scaleX(2f).toInt(),
        borderColor = ThemeConfig.Colors.BUTTON_PURPLE
    )

    // Animation state
    private var scaleX = 1f
    private var scaleY = 1f
    private var smooshTime = 0f
    private val SMOOSH_DURATION = 0.12f // 120ms

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

        // Update smoosh animation
        if (isSmooshing) {
            smooshTime += delta

            if (smooshTime < SMOOSH_DURATION) {
                // Squish phase
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
        if (!isSmooshing) {
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

        // Outer circle (purple)
        shapeRenderer.color = ThemeConfig.Colors.BUTTON_PURPLE
        shapeRenderer.circle(position.x, position.y, radius * scaleX)

        // Inner circle (pink gradient effect)
        shapeRenderer.color = Color(0.9f, 0.5f, 0.8f, 0.5f)
        shapeRenderer.circle(position.x, position.y - radius * 0.2f, radius * 0.7f * scaleX)

        shapeRenderer.end()

        batch.begin()

        // Draw letter centered in bubble
        val layout = com.badlogic.gdx.graphics.g2d.GlyphLayout()
        layout.setText(letterFont, letter)

        letterFont.draw(
            batch,
            letter,
            position.x - layout.width / 2,
            position.y + layout.height / 2
        )
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
        // TODO: Implement pop animation with tweening
        isDestroyed = true
        onComplete()
    }

    /**
     * Cleanup resources
     */
    fun dispose() {
        // Fonts are managed by FontManager, no cleanup needed
    }
}
```

### Task 2: Create TimerBar Component

**File:** `core/src/main/kotlin/com/aurora/reading/core/components/TimerBar.kt`

```kotlin
package com.aurora.reading.core.components

import com.badlogic.gdx.graphics.Color
import com.badlogic.gdx.graphics.g2d.SpriteBatch
import com.badlogic.gdx.graphics.glutils.ShapeRenderer
import com.aurora.reading.core.config.ThemeConfig
import com.aurora.reading.core.utils.ResponsiveUtils

/**
 * Timer Bar Component
 *
 * Visual progress bar showing time remaining for current letter.
 *
 * Features:
 * - Horizontal bar with background and foreground
 * - Color-coded fill: Green → Yellow → Red
 * - Smooth width transitions
 * - Clock icon on left
 */
class TimerBar(
    private val x: Float,
    private val y: Float,
    private val width: Float,
    private val height: Float
) {
    private val responsive = ResponsiveUtils()

    // Progress (0.0 to 1.0)
    private var progress = 1f

    // Corner radius for rounded bar
    private val cornerRadius = 8f

    /**
     * Set progress (0.0 = empty, 1.0 = full)
     */
    fun setProgress(value: Float) {
        progress = value.coerceIn(0f, 1f)
    }

    /**
     * Get color based on progress
     */
    private fun getBarColor(): Color {
        return when {
            progress > 0.6f -> Color(0f, 0.9f, 0.46f, 1f) // Green
            progress > 0.3f -> Color(1f, 0.92f, 0.23f, 1f) // Yellow
            else -> Color(1f, 0.42f, 0.42f, 1f) // Red
        }
    }

    /**
     * Render timer bar
     */
    fun render(batch: SpriteBatch, shapeRenderer: ShapeRenderer) {
        batch.end()

        shapeRenderer.begin(ShapeRenderer.ShapeType.Filled)

        // Background (dark purple)
        shapeRenderer.color = ThemeConfig.Colors.MENU_PURPLE
        shapeRenderer.rect(x, y - height / 2, width, height, cornerRadius, 32)

        // Foreground (color-coded)
        if (progress > 0f) {
            shapeRenderer.color = getBarColor()
            shapeRenderer.rect(x, y - height / 2, width * progress, height, cornerRadius, 32)
        }

        shapeRenderer.end()

        batch.begin()
    }

    /**
     * Cleanup resources
     */
    fun dispose() {
        // No resources to cleanup
    }
}
```

### Task 3: Update LetterPopScreen Implementation

**File:** `core/src/main/kotlin/com/aurora/reading/core/screens/LetterPopScreen.kt`

**Replace the stub with full implementation:**

```kotlin
package com.aurora.reading.core.screens

import com.aurora.reading.core.ReadingGame
import com.aurora.reading.core.assets.Assets
import com.aurora.reading.core.components.*
import com.aurora.reading.core.config.ThemeConfig
import com.aurora.reading.core.services.AudioManager
import com.aurora.reading.core.services.FontManager
import com.aurora.reading.core.utils.ResponsiveUtils
import com.badlogic.gdx.Gdx
import com.badlogic.gdx.Preferences
import com.badlogic.gdx.Screen
import com.badlogic.gdx.graphics.Color
import com.badlogic.gdx.graphics.GL20
import com.badlogic.gdx.graphics.g2d.BitmapFont
import com.badlogic.gdx.graphics.glutils.ShapeRenderer
import com.badlogic.gdx.math.MathUtils
import com.badlogic.gdx.math.Vector2
import kotlin.math.abs

/**
 * Letter Pop Game Screen
 *
 * Main game screen where player clicks bubbles to match target letters.
 *
 * Features:
 * - 6 floating bubbles with physics
 * - Target letter display
 * - Timer countdown with visual bar
 * - Score tracking
 * - Round progression (10 letters)
 * - Correct/incorrect answer feedback
 * - Home button navigation
 * - Settings integration (time limit, letter case)
 */
class LetterPopScreen(private val game: ReadingGame) : Screen {

    private val responsive = ResponsiveUtils()
    private val shapeRenderer = ShapeRenderer()
    private val audioManager = AudioManager.getInstance()

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
    private val targetLetterFont: BitmapFont = FontManager.getFont(
        size = responsive.getFontSize(64),
        borderWidth = responsive.scaleX(3f).toInt(),
        borderColor = ThemeConfig.Colors.BUTTON_PURPLE
    )

    // Animation state
    private var isFadingOut = false
    private var fadeAlpha = 1f
    private var titleAlpha = 1f
    private var titleFadeDelay = 1f

    // World bounds for bubble physics
    private val worldBounds = responsive.getWorldBounds()
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
    }

    /**
     * Create UI components
     */
    private fun createComponents() {
        // Gradient background (purple → pink)
        background = GradientBackground(
            topColor = ThemeConfig.Colors.MENU_PURPLE,
            bottomColor = ThemeConfig.Colors.MAIN_PINK
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
            balloonColor = ThemeConfig.Colors.MAIN_PINK
        )

        // Home button (top right)
        homeButton = Button(
            text = "",
            x = responsive.scaleX(95f),
            y = responsive.scaleY(94f),
            width = responsive.scaleX(4f),
            height = responsive.scaleY(6f),
            fontSize = responsive.getFontSize(20),
            backgroundColor = ThemeConfig.Colors.BUTTON_GREEN,
            textColor = Color.WHITE,
            borderColor = Color.WHITE,
            onClick = { navigateToMainMenu() }
        )
        // TODO: Add home icon to button

        // Timer bar at top (below header area)
        timerBar = TimerBar(
            x = responsive.scaleX(10f),
            y = headerHeight,
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
        val alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")
            .filter { it.isNotEmpty() }

        repeat(10) {
            val randomLetter = alphabet.random()
            roundLetters.add(applyLetterCase(randomLetter))
        }

        currentLetterIndex = 0
        score = 0

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

        // Reset timer
        timeRemaining = timePerLetter.toFloat()
        timerBar.setProgress(1f)

        // Play target letter audio
        playTargetLetterAudio()

        // Spawn bubbles
        spawnBubbles()

        // Fade out title after first letter
        if (currentLetterIndex == 0 && titleFadeDelay > 0) {
            titleFadeDelay = 1f
        }
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
        val audioKey = "letter-${targetLetter.lowercase()}"
        audioManager.playVoice(audioKey)
    }

    /**
     * Spawn 6 bubbles with random letters (one matches target)
     */
    private fun spawnBubbles() {
        // Clear existing bubbles
        bubbles.forEach { it.dispose() }
        bubbles.clear()

        // Generate letters (one target + 5 random)
        val alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")
            .filter { it.isNotEmpty() }
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
        val maxAttempts = 100

        val playAreaLeft = bubbleRadius
        val playAreaRight = worldBounds.x - bubbleRadius
        val playAreaTop = worldBounds.y - bubbleRadius
        val playAreaBottom = headerHeight + bubbleRadius

        repeat(count) {
            var attempts = 0
            var validPosition: Vector2? = null

            while (attempts < maxAttempts) {
                val testPos = Vector2(
                    MathUtils.random(playAreaLeft, playAreaRight),
                    MathUtils.random(playAreaBottom, playAreaTop)
                )

                // Check if position is far enough from existing positions
                val tooClose = positions.any { existing ->
                    testPos.dst(existing) < minSpacing
                }

                if (!tooClose) {
                    validPosition = testPos
                    break
                }

                attempts++
            }

            // Use valid position or fallback to grid position
            positions.add(validPosition ?: Vector2(
                playAreaLeft + (playAreaRight - playAreaLeft) * (it % 3) / 2f,
                playAreaBottom + (playAreaTop - playAreaBottom) * (it / 3) / 1f
            ))
        }

        return positions
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
        // Play correct sound
        audioManager.playSfx("correctAnswer", volume = 0.6f)

        // Increment score
        score++

        // Pop bubble with animation
        bubble.pop {
            // Move to next letter
            currentLetterIndex++
            nextLetter()
        }
    }

    /**
     * Handle incorrect answer (non-punitive)
     */
    private fun handleIncorrectAnswer(bubble: Bubble) {
        // Gentle wobble animation
        // Play gentle "try again" sound
        audioManager.playSfx("tryAgain", volume = 0.3f)

        // Bubble stays - no punishment
    }

    /**
     * Handle timer expiration
     */
    private fun handleTimeExpired() {
        // Non-punitive - just move to next letter
        currentLetterIndex++
        nextLetter()
    }

    /**
     * Handle round completion
     */
    private fun handleRoundComplete() {
        // Play success sound
        audioManager.playSfx("success", volume = 0.8f)

        // Show results screen (TODO: Phase 2.7.9)
        // For now, return to main menu
        navigateToMainMenu()
    }

    /**
     * Navigate to main menu
     */
    private fun navigateToMainMenu() {
        if (isFadingOut) return

        isFadingOut = true
        audioManager.playSfx("click")
    }

    /**
     * Update bubble physics
     */
    private fun updateBubbles(delta: Float) {
        bubbles.forEach { bubble ->
            bubble.update(delta)

            // Wall collision detection
            val pos = bubble.position
            val radius = bubbleRadius

            // Left/Right walls
            if (pos.x - radius < 0 || pos.x + radius > worldBounds.x) {
                bubble.bounceX()
                bubble.smoosh()
                pos.x = pos.x.coerceIn(radius, worldBounds.x - radius)
            }

            // Top/Bottom walls
            if (pos.y + radius > worldBounds.y || pos.y - radius < headerHeight) {
                bubble.bounceY()
                bubble.smoosh()
                pos.y = pos.y.coerceIn(headerHeight + radius, worldBounds.y - radius)
            }
        }

        // Bubble-to-bubble collision
        for (i in bubbles.indices) {
            for (j in i + 1 until bubbles.size) {
                val bubbleA = bubbles[i]
                val bubbleB = bubbles[j]

                if (bubbleA.bounds.overlaps(bubbleB.bounds)) {
                    // Simple elastic collision
                    resolveCollision(bubbleA, bubbleB)
                    bubbleA.smoosh()
                    bubbleB.smoosh()
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
        val distance = kotlin.math.sqrt(dx * dx + dy * dy)

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
        // Screen shown
    }

    override fun render(delta: Float) {
        // Update timer
        if (!isFadingOut && titleFadeDelay <= 0) {
            timeRemaining -= delta

            if (timeRemaining <= 0) {
                handleTimeExpired()
                return
            }

            timerBar.setProgress(timeRemaining / timePerLetter.toFloat())
        }

        // Update title fade
        if (titleFadeDelay > 0) {
            titleFadeDelay -= delta
            if (titleFadeDelay <= 0) {
                // Start fading out title
            }
        }

        if (titleFadeDelay <= 0 && titleAlpha > 0) {
            titleAlpha -= delta * 1.25f // 0.8s fade
            if (titleAlpha < 0) titleAlpha = 0f
        }

        // Update bubbles
        updateBubbles(delta)

        // Update fade out
        if (isFadingOut) {
            fadeAlpha -= delta * 3.33f // 0.3s fade
            if (fadeAlpha <= 0) {
                game.setScreen(game.mainMenuScreen)
                return
            }
        }

        // Handle touch input
        if (Gdx.input.justTouched()) {
            val touchX = Gdx.input.x.toFloat()
            val touchY = worldBounds.y - Gdx.input.y.toFloat() // Flip Y

            // Check bubble clicks
            bubbles.forEach { bubble ->
                if (bubble.contains(touchX, touchY)) {
                    handleBubbleClick(bubble)
                    return@forEach
                }
            }

            // Check home button
            homeButton.handleTouch(touchX, touchY)
        }

        // Render
        Gdx.gl.glClearColor(0f, 0f, 0f, 1f)
        Gdx.gl.glClear(GL20.GL_COLOR_BUFFER_BIT)

        game.batch.begin()

        // Background
        background.render(game.batch, shapeRenderer, 0f)

        // Title (fading out)
        if (titleAlpha > 0) {
            balloonIcon.render(game.batch, delta)
            titleText.render(game.batch, delta)
        }

        // Score display (top center)
        val scoreLabelLayout = com.badlogic.gdx.graphics.g2d.GlyphLayout()
        scoreLabelLayout.setText(scoreLabelFont, "SCORE")
        scoreLabelFont.draw(
            game.batch,
            "SCORE",
            responsive.centerX - scoreLabelLayout.width / 2,
            responsive.scaleY(94f)
        )

        val scoreLayout = com.badlogic.gdx.graphics.g2d.GlyphLayout()
        scoreLayout.setText(scoreValueFont, score.toString())
        scoreValueFont.draw(
            game.batch,
            score.toString(),
            responsive.centerX - scoreLayout.width / 2,
            responsive.scaleY(88f)
        )

        // Round progress (top left)
        val roundText = "ROUND ${currentLetterIndex + 1}"
        roundFont.draw(
            game.batch,
            roundText,
            responsive.scaleX(5f),
            responsive.scaleY(94f)
        )

        game.batch.end()

        // Timer bar
        timerBar.render(game.batch, shapeRenderer)

        game.batch.begin()

        // Bubbles
        bubbles.forEach { bubble ->
            bubble.render(game.batch, shapeRenderer)
        }

        // Home button
        homeButton.render(game.batch, delta)

        // Fade out overlay
        if (fadeAlpha < 1f) {
            shapeRenderer.begin(ShapeRenderer.ShapeType.Filled)
            shapeRenderer.color = Color(0f, 0f, 0f, 1f - fadeAlpha)
            shapeRenderer.rect(0f, 0f, worldBounds.x, worldBounds.y)
            shapeRenderer.end()
        }

        game.batch.end()
    }

    override fun resize(width: Int, height: Int) {}
    override fun pause() {}
    override fun resume() {}
    override fun hide() {}

    override fun dispose() {
        bubbles.forEach { it.dispose() }
        shapeRenderer.dispose()
    }
}
```

## Acceptance Criteria

### Visual Requirements
- ✅ Purple → Pink gradient background renders
- ✅ Title "LETTER POP" displays at top with balloon icon
- ✅ Score displays in center-top area
- ✅ Round progress displays in top-left ("ROUND 1" - "ROUND 10")
- ✅ Timer bar displays below header with color coding
- ✅ Home button displays in top-right
- ✅ 6 bubbles render with letters inside
- ✅ Target letter is visibly present in one bubble

### Gameplay Requirements
- ✅ Clicking correct bubble advances to next letter
- ✅ Clicking incorrect bubble shows gentle feedback (no penalty)
- ✅ Score increments on correct answer
- ✅ Round progresses through 10 letters
- ✅ Timer counts down for each letter
- ✅ Timer bar color changes (green → yellow → red)
- ✅ Time expiration advances to next letter (non-punitive)
- ✅ Game settings applied (time limit, letter case)

### Physics Requirements
- ✅ Bubbles float with velocity
- ✅ Bubbles bounce off walls
- ✅ Bubbles bounce off each other
- ✅ Smoosh animation plays on collision
- ✅ Bubbles stay within play area bounds

### Audio Requirements
- ✅ Target letter voice plays at start of each letter
- ✅ Correct answer sound plays on match
- ✅ Gentle "try again" sound on incorrect click
- ✅ Success sound plays on round completion
- ✅ Click sound plays on home button

### Navigation Requirements
- ✅ Home button returns to Main Menu
- ✅ Fade-out transition on navigation (0.3s)
- ✅ Round completion navigates to results (or Main Menu for now)

### Performance Requirements
- ✅ 60 FPS maintained during gameplay
- ✅ Smooth bubble physics
- ✅ Responsive touch input
- ✅ No memory leaks

## Testing Checklist

### Manual Testing Steps

1. **Load Game**
   - [ ] Navigate from Main Menu → Letter Pop Menu → Start Game
   - [ ] Title and balloon icon display
   - [ ] Title fades out after 1 second
   - [ ] Background gradient renders correctly

2. **First Letter Test**
   - [ ] Target letter voice plays
   - [ ] 6 bubbles spawn
   - [ ] One bubble contains target letter
   - [ ] Bubbles float and bounce
   - [ ] Timer bar at 100%
   - [ ] Score shows "0"
   - [ ] Round shows "ROUND 1"

3. **Correct Answer Test**
   - [ ] Click bubble with target letter
   - [ ] Correct sound plays
   - [ ] Score increments to 1
   - [ ] New bubbles spawn
   - [ ] Round advances to "ROUND 2"
   - [ ] Timer resets to 100%
   - [ ] New target letter voice plays

4. **Incorrect Answer Test**
   - [ ] Click bubble with wrong letter
   - [ ] Gentle sound plays
   - [ ] No score change
   - [ ] Bubble remains (non-punitive)
   - [ ] Can try again

5. **Timer Test**
   - [ ] Timer bar decreases over time
   - [ ] Color changes: Green → Yellow → Red
   - [ ] Time expiration advances to next letter
   - [ ] No score penalty

6. **Physics Test**
   - [ ] Bubbles bounce off left wall
   - [ ] Bubbles bounce off right wall
   - [ ] Bubbles bounce off top
   - [ ] Bubbles bounce off bottom (header area)
   - [ ] Bubbles bounce off each other
   - [ ] Smoosh animation plays on collision

7. **Round Completion Test**
   - [ ] Complete all 10 letters
   - [ ] Success sound plays
   - [ ] Navigation to results (or Main Menu)

8. **Settings Integration Test**
   - [ ] Change time limit in Letter Pop Menu
   - [ ] Verify time limit applied in game
   - [ ] Change letter case to lowercase
   - [ ] Verify lowercase letters in game
   - [ ] Change to mixed case
   - [ ] Verify mixed case letters

9. **Home Button Test**
   - [ ] Click home button
   - [ ] Click sound plays
   - [ ] Fade-out transition
   - [ ] Return to Main Menu

10. **Performance Test**
    - [ ] Check FPS with `adb logcat`
    - [ ] Verify 60 FPS maintained
    - [ ] No lag during bubble physics
    - [ ] Smooth animations

## Time Estimate

**Total: 6-8 hours**

- Task 1: Bubble Component (1.5 hours)
- Task 2: TimerBar Component (0.5 hours)
- Task 3: LetterPopScreen Implementation (4-5 hours)
  - Game state management (1 hour)
  - Bubble spawning and physics (1.5 hours)
  - Click handling and feedback (1 hour)
  - UI integration (0.5 hours)
  - Polish and refinement (1 hour)
- Testing and refinement (1-1.5 hours)

## Dependencies

- Phase 2.7.4: UI components (GradientBackground, Button, TitleText)
- Phase 2.7.5: BalloonIcon component
- Phase 2.7.6: FontManager service
- Phase 2.7.7: Game settings (time limit, letter case)

## Notes

- This is the core educational gameplay
- ADHD-friendly: immediate feedback, non-punitive, progress visibility
- Physics adds engaging visual element
- Settings from Phase 2.7.7 applied for personalization
- Results screen (Phase 2.7.9) will show detailed performance

---

**Status:** Ready to implement
**Next Phase:** Phase 2.7.9 - Results Screen
