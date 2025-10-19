# Phase 2.7.9: Results Screen Implementation - PLAN

**Phase:** 2.7.9
**Feature:** Results Screen
**Status:** Planning
**Estimated Time:** 3-4 hours
**Technology:** Kotlin + libGDX (native Android)

---

## Overview

Implement the Results Screen to display game performance after completing a Letter Pop round. This screen celebrates the player's achievements with visual feedback, star ratings, and statistics.

**Key Features:**
- Final score display (X/10 correct answers)
- Star rating system (1-3 stars based on performance)
- Accuracy percentage calculation
- Time taken display
- Celebration animations and visual feedback
- "Play Again" button to restart Letter Pop with same settings
- "Main Menu" button to return to main menu
- ADHD-friendly design (positive reinforcement, clear feedback)

**Design Philosophy:**
- **Positive Reinforcement:** Every completion is celebrated (even 0/10 gets 1 star for effort)
- **Clear Feedback:** Large, readable statistics with visual hierarchy
- **Non-Punitive:** Focus on what was achieved, not what was missed
- **Immediate Gratification:** Stars appear with animation, celebration sounds play
- **Progress Visibility:** Clear display of score, accuracy, and time

---

## Prerequisites

### Completed Phases
- ✅ Phase 2.7.4: UI components (GradientBackground, Button, TitleText, FloatingStars)
- ✅ Phase 2.7.5: Main Menu screen navigation
- ✅ Phase 2.7.6: Settings screen (FontManager, Preferences)
- ✅ Phase 2.7.7: Letter Pop Menu screen
- ✅ Phase 2.7.8: Letter Pop Game (scoring system, timer)

### Required Knowledge
- libGDX Screen lifecycle
- Fade transitions between screens
- FontManager for text rendering
- ResponsiveUtils for layout
- ThemeConfig for colors
- AudioManager for sound effects
- Preferences for settings persistence

### Required Components (Already Implemented)
- `GradientBackground` - Purple → Pink gradient
- `Button` - Interactive button with hover/tap effects
- `TitleText` - Large title with outline
- `FloatingStars` - Animated decorative stars
- `BalloonIcon` - Celebratory balloon decoration
- `FontManager` - Font rendering service
- `AudioManager` - Sound playback service
- `ResponsiveUtils` - Percentage-based positioning

---

## Architecture

### Screen Hierarchy
```
ResultsScreen (implements Screen)
├── GradientBackground (purple → pink)
├── TitleText (celebration message)
├── FloatingStars (decorative background)
├── BalloonIcon (celebration decoration)
├── StarRating (custom component - NEW)
├── ScoreDisplay (custom component - NEW)
├── StatisticsDisplay (custom component - NEW)
├── Button (Play Again)
└── Button (Main Menu)
```

### New Components
1. **StarRating** - Displays 1-3 stars based on performance
2. **ScoreDisplay** - Shows "X/10" score with large font
3. **StatisticsDisplay** - Shows accuracy % and time taken

### Data Flow
```
LetterPopScreen (game ends)
    ↓ (passes GameResult)
ResultsScreen (receive results)
    ↓ (calculate star rating)
    ↓ (render UI)
    ↓ (user taps "Play Again")
LetterPopScreen (restart with same settings)
    OR
    ↓ (user taps "Main Menu")
MainMenuScreen (return home)
```

### GameResult Data Class
```kotlin
data class GameResult(
    val score: Int,              // Correct answers (0-10)
    val totalQuestions: Int,     // Always 10 for Letter Pop
    val timeLimit: Float,        // Time limit per letter (from settings)
    val totalTimeElapsed: Float, // Total time taken for all 10 letters
    val letterCase: String       // "uppercase", "lowercase", or "mixed"
)
```

---

## Star Rating System

### Star Calculation Logic
```kotlin
fun calculateStars(score: Int, totalQuestions: Int): Int {
    val percentage = (score.toFloat() / totalQuestions.toFloat()) * 100f

    return when {
        percentage >= 80f -> 3  // 8-10 correct: 3 stars (Excellent!)
        percentage >= 50f -> 2  // 5-7 correct: 2 stars (Good job!)
        else -> 1               // 0-4 correct: 1 star (Keep trying!)
    }
}
```

### Star Rating Tiers
| Score | Stars | Percentage | Message |
|-------|-------|------------|---------|
| 8-10  | ⭐⭐⭐ | 80-100%    | "Excellent!" |
| 5-7   | ⭐⭐   | 50-79%     | "Good Job!" |
| 0-4   | ⭐     | 0-49%      | "Keep Trying!" |

**Design Note:** Even 0/10 gets 1 star to maintain positive reinforcement (ADHD-friendly).

---

## Tasks

### Task 1: Create GameResult Data Class
**File:** `core/src/main/kotlin/com/aurora/reading/core/models/GameResult.kt`

**Implementation:**
```kotlin
package com.aurora.reading.core.models

/**
 * Game Result Data Class
 *
 * Represents the results of a completed Letter Pop game round.
 *
 * Used to pass performance data from LetterPopScreen to ResultsScreen.
 */
data class GameResult(
    /**
     * Number of correct answers (0-10)
     */
    val score: Int,

    /**
     * Total number of questions in the round (always 10 for Letter Pop)
     */
    val totalQuestions: Int = 10,

    /**
     * Time limit per letter in seconds (from settings)
     */
    val timeLimit: Float,

    /**
     * Total time elapsed for all questions in seconds
     */
    val totalTimeElapsed: Float,

    /**
     * Letter case mode: "uppercase", "lowercase", or "mixed"
     */
    val letterCase: String
) {
    /**
     * Calculate accuracy percentage (0-100)
     */
    fun getAccuracy(): Float {
        return (score.toFloat() / totalQuestions.toFloat()) * 100f
    }

    /**
     * Calculate star rating (1-3 stars)
     * - 8-10 correct: 3 stars (80-100%)
     * - 5-7 correct: 2 stars (50-79%)
     * - 0-4 correct: 1 star (0-49%)
     */
    fun getStarRating(): Int {
        val percentage = getAccuracy()

        return when {
            percentage >= 80f -> 3
            percentage >= 50f -> 2
            else -> 1
        }
    }

    /**
     * Get celebration message based on performance
     */
    fun getCelebrationMessage(): String {
        return when (getStarRating()) {
            3 -> "EXCELLENT!"
            2 -> "GOOD JOB!"
            else -> "KEEP TRYING!"
        }
    }

    /**
     * Get average time per question
     */
    fun getAverageTimePerQuestion(): Float {
        return totalTimeElapsed / totalQuestions.toFloat()
    }
}
```

**Acceptance Criteria:**
- ✅ Data class with all required fields
- ✅ getAccuracy() returns percentage (0-100)
- ✅ getStarRating() returns 1-3 stars
- ✅ getCelebrationMessage() returns appropriate message
- ✅ getAverageTimePerQuestion() calculates average time

---

### Task 2: Create StarRating Component
**File:** `core/src/main/kotlin/com/aurora/reading/core/components/StarRating.kt`

**Implementation:**
```kotlin
package com.aurora.reading.core.components

import com.badlogic.gdx.graphics.Color
import com.badlogic.gdx.graphics.g2d.SpriteBatch
import com.badlogic.gdx.graphics.glutils.ShapeRenderer
import com.badlogic.gdx.math.Vector2
import com.badlogic.gdx.utils.Disposable
import com.aurora.reading.core.utils.ResponsiveUtils
import kotlin.math.cos
import kotlin.math.sin
import kotlin.math.PI

/**
 * Star Rating Component
 *
 * Displays 1-3 stars based on game performance.
 *
 * Features:
 * - Filled stars for earned rating
 * - Empty stars for unearned rating
 * - Star animation (scale in with bounce)
 * - Gold color for filled stars
 * - Gray color for empty stars
 *
 * Responsibilities:
 * - Render star shapes using ShapeRenderer
 * - Animate stars appearing one by one
 * - Position stars horizontally
 */
class StarRating(
    private val x: Float,
    private val y: Float,
    private val starSize: Float,
    private val spacing: Float,
    private val maxStars: Int = 3
) : Disposable {

    private val responsive = ResponsiveUtils()

    // Current rating (1-3)
    private var rating = 0

    // Animation state
    private var animationTime = 0f
    private val STAR_ANIMATION_DELAY = 0.2f // 200ms between each star
    private val STAR_ANIMATION_DURATION = 0.3f // 300ms per star

    // Colors
    private val GOLD_COLOR = Color(1f, 0.84f, 0f, 1f) // Gold (#FFD700)
    private val GRAY_COLOR = Color(0.5f, 0.5f, 0.5f, 0.3f) // Light gray

    /**
     * Set the star rating (1-3)
     */
    fun setRating(stars: Int) {
        rating = stars.coerceIn(1, maxStars)
        animationTime = 0f
    }

    /**
     * Update animation
     */
    fun update(delta: Float) {
        animationTime += delta
    }

    /**
     * Render stars
     */
    fun render(batch: SpriteBatch, shapeRenderer: ShapeRenderer) {
        batch.end()

        shapeRenderer.begin(ShapeRenderer.ShapeType.Filled)

        // Calculate total width of all stars
        val totalWidth = (maxStars * starSize) + ((maxStars - 1) * spacing)
        val startX = x - totalWidth / 2

        for (i in 0 until maxStars) {
            val starX = startX + (i * (starSize + spacing)) + starSize / 2
            val starY = y

            // Determine if this star should be filled
            val isFilled = i < rating

            // Calculate animation scale
            val starIndex = i
            val starAppearTime = starIndex * STAR_ANIMATION_DELAY
            val timeSinceAppear = (animationTime - starAppearTime).coerceAtLeast(0f)
            val animationProgress = (timeSinceAppear / STAR_ANIMATION_DURATION).coerceIn(0f, 1f)

            // Bounce easing
            val scale = if (animationProgress < 1f) {
                val t = animationProgress
                // Bounce: overshoot then settle
                if (t < 0.5f) {
                    2f * t * t // Ease in
                } else {
                    1f + (1f - t) * 0.2f // Overshoot slightly
                }
            } else {
                1f
            }

            // Set color
            shapeRenderer.color = if (isFilled) GOLD_COLOR else GRAY_COLOR

            // Draw 5-pointed star
            drawStar(shapeRenderer, starX, starY, starSize * scale)
        }

        shapeRenderer.end()

        batch.begin()
    }

    /**
     * Draw a 5-pointed star shape
     */
    private fun drawStar(
        shapeRenderer: ShapeRenderer,
        centerX: Float,
        centerY: Float,
        size: Float
    ) {
        val outerRadius = size / 2
        val innerRadius = outerRadius * 0.4f
        val points = 5
        val vertices = FloatArray(points * 4) // 2 vertices per point (outer + inner) * 2 coords

        // Generate star vertices
        for (i in 0 until points * 2) {
            val angle = (i * PI / points).toFloat() - PI.toFloat() / 2 // Start at top
            val radius = if (i % 2 == 0) outerRadius else innerRadius

            val index = i * 2
            vertices[index] = centerX + cos(angle) * radius
            vertices[index + 1] = centerY + sin(angle) * radius
        }

        // Draw star as triangle fan from center
        for (i in 0 until points * 2) {
            val nextIndex = (i + 1) % (points * 2)

            shapeRenderer.triangle(
                centerX, centerY,
                vertices[i * 2], vertices[i * 2 + 1],
                vertices[nextIndex * 2], vertices[nextIndex * 2 + 1]
            )
        }
    }

    /**
     * Cleanup resources
     */
    override fun dispose() {
        // No resources to cleanup
    }
}
```

**Acceptance Criteria:**
- ✅ Renders 1-3 stars based on rating
- ✅ Gold color for filled stars
- ✅ Gray color for empty stars
- ✅ Star animation with bounce effect
- ✅ 200ms delay between each star appearing
- ✅ Horizontally centered layout

---

### Task 3: Create ResultsScreen
**File:** `core/src/main/kotlin/com/aurora/reading/core/screens/ResultsScreen.kt`

**Implementation:**
```kotlin
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
import com.badlogic.gdx.utils.Disposable
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
            count = 20,
            worldWidth = worldWidth,
            worldHeight = worldHeight
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
            fontSize = responsive.scaleX(2f).toInt()
        )

        mainMenuButton = Button(
            text = "MAIN MENU",
            x = responsive.scaleX(65f),
            y = responsive.scaleY(15f),
            width = responsive.scaleX(20f),
            height = responsive.scaleY(10f),
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
        balloonIcon.update(delta)
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
```

**Acceptance Criteria:**
- ✅ Displays game results (score, accuracy, time)
- ✅ Shows 1-3 star rating with animation
- ✅ Displays celebration message based on performance
- ✅ Play Again button navigates to Letter Pop Menu
- ✅ Main Menu button navigates to Main Menu
- ✅ Fade in/out transitions
- ✅ Celebration sound plays once
- ✅ Positive reinforcement (ADHD-friendly)
- ✅ Responsive layout (2560x1600)

---

### Task 4: Update LetterPopScreen to Navigate to Results
**File:** `core/src/main/kotlin/com/aurora/reading/core/screens/LetterPopScreen.kt`

**Changes Required:**
1. Track total time elapsed for all questions
2. Create GameResult when game ends
3. Navigate to ResultsScreen

**Implementation:**
```kotlin
// Add to class properties
private var totalTimeElapsed = 0f

// In update() method, track time
totalTimeElapsed += delta

// In advanceToNextLetter() when currentLetterIndex >= letters.size
private fun advanceToNextLetter() {
    if (currentLetterIndex >= letters.size) {
        // Game complete - navigate to results
        showResults()
        return
    }
    // ... rest of existing code
}

// Add new method
private fun showResults() {
    Gdx.app.log("LetterPopScreen", "Game complete - showing results")

    // Create game result
    val result = GameResult(
        score = score,
        totalQuestions = 10,
        timeLimit = timeLimit,
        totalTimeElapsed = totalTimeElapsed,
        letterCase = letterCase
    )

    // Navigate to results screen
    startFadeOut(ResultsScreen(game, result))
}
```

**Acceptance Criteria:**
- ✅ Tracks total time elapsed during game
- ✅ Creates GameResult with all required data
- ✅ Navigates to ResultsScreen when game ends
- ✅ Fade transition to results screen

---

## Component Reuse

### From Phase 2.7.4
- ✅ `GradientBackground` - Purple → Pink gradient
- ✅ `Button` - Play Again and Main Menu buttons
- ✅ `TitleText` - Celebration message
- ✅ `FloatingStars` - Decorative background animation
- ✅ `BalloonIcon` - Celebration decoration

### From Phase 2.7.6
- ✅ `FontManager` - Crisp text rendering for score/stats
- ✅ `Preferences` - Not needed for Results (no settings)

### From Phase 2.7.8
- ✅ `GameResult` data (score, time, settings)

---

## Visual Layout (2560x1600)

```
┌────────────────────────────────────────────────────────────┐
│  [Floating Stars Background]                               │
│                                                            │
│                    [Balloon Icon]                          │
│                     EXCELLENT!                             │  ← 85%
│                                                            │
│                                                            │
│                  ⭐ ⭐ ⭐                                    │  ← 65%
│                                                            │
│                      9/10                                  │  ← 52%
│                                                            │
│                                                            │
│        Accuracy            Time                            │  ← 42%
│          90%              12.5s                            │  ← 37%
│                                                            │
│                                                            │
│                                                            │
│   [PLAY AGAIN]        [MAIN MENU]                          │  ← 15%
│                                                            │
└────────────────────────────────────────────────────────────┘
```

**Percentage-based positioning:**
- Title: 85% height (celebration message)
- Balloon: 75% height
- Stars: 65% height
- Score: 52% height (large X/10 text)
- Stats labels: 42% height
- Stats values: 37% height
- Buttons: 15% height

---

## ADHD-Friendly Design Checklist

### ✅ Positive Reinforcement
- Every completion gets at least 1 star (no zero stars)
- Celebration message focuses on achievement ("EXCELLENT!", "GOOD JOB!", "KEEP TRYING!")
- Visual celebration (stars, balloons, floating decorations)
- Celebration sound plays

### ✅ Immediate Feedback
- Results appear immediately after game ends
- Stars animate in with bounce effect
- Clear, large score display
- Visual hierarchy (most important info is largest)

### ✅ Non-Punitive
- No negative messages or red warnings
- Focus on what was achieved, not what was missed
- "Keep Trying!" instead of "Failed" or "Poor"
- 1 star for effort, even with 0 correct

### ✅ Progress Visibility
- Clear score (X/10)
- Accuracy percentage
- Time taken
- Star rating at a glance

### ✅ Clear Navigation
- Two clear action buttons
- Play Again to retry immediately
- Main Menu to return home
- No confusing options

---

## Testing Checklist

### Manual Testing
- [ ] Results screen displays after completing Letter Pop game
- [ ] Score displays correctly (0-10)
- [ ] Star rating calculated correctly:
  - [ ] 8-10 correct → 3 stars
  - [ ] 5-7 correct → 2 stars
  - [ ] 0-4 correct → 1 star
- [ ] Accuracy percentage calculated correctly
- [ ] Time displays total elapsed time
- [ ] Celebration message matches star rating
- [ ] Stars animate in with bounce effect
- [ ] Celebration sound plays once
- [ ] Play Again button navigates to Letter Pop Menu
- [ ] Main Menu button navigates to Main Menu
- [ ] Fade transitions work smoothly
- [ ] Responsive layout looks correct on 2560x1600
- [ ] Floating stars animate in background
- [ ] Balloon icon animates correctly
- [ ] All fonts render crisply

### Edge Cases
- [ ] 0/10 score displays 1 star with "KEEP TRYING!"
- [ ] 10/10 score displays 3 stars with "EXCELLENT!"
- [ ] Very fast completion (< 5 seconds total)
- [ ] Very slow completion (> 60 seconds total)
- [ ] Rapid button tapping doesn't break navigation

### Performance
- [ ] 60 FPS maintained during rendering
- [ ] No memory leaks (dispose() called)
- [ ] Smooth star animations
- [ ] No frame drops during fade transitions

---

## Acceptance Criteria

### Documentation
- ✅ PLAN.md created with 4 tasks
- ✅ UML.md created with architecture diagrams
- ✅ GHERKIN.md created with BDD scenarios

### Implementation
- [ ] GameResult data class created
- [ ] StarRating component created
- [ ] ResultsScreen created
- [ ] LetterPopScreen updated to navigate to results
- [ ] All components properly disposed

### Testing
- [ ] Build succeeds without errors
- [ ] Manual testing complete on emulator
- [ ] All BDD scenarios pass
- [ ] Screenshots captured for verification

### Code Quality
- [ ] Follows GUARDRAILS.md standards
- [ ] Single Responsibility Principle followed
- [ ] Proper error handling
- [ ] No hardcoded values (uses ResponsiveUtils)
- [ ] Comments explain complex logic
- [ ] Kotlin conventions followed

---

## Estimated Time Breakdown

| Task | Estimated Time |
|------|----------------|
| Task 1: GameResult data class | 30 minutes |
| Task 2: StarRating component | 1 hour |
| Task 3: ResultsScreen | 1.5 hours |
| Task 4: Update LetterPopScreen | 30 minutes |
| Testing and debugging | 30 minutes |
| **Total** | **3.5-4 hours** |

---

## Dependencies

### Internal Dependencies
- `ResponsiveUtils` - Layout positioning
- `ThemeConfig` - Color palette
- `FontManager` - Text rendering
- `AudioManager` - Sound effects
- `GradientBackground` - Background gradient
- `Button` - Interactive buttons
- `TitleText` - Title text
- `FloatingStars` - Background decoration
- `BalloonIcon` - Celebration decoration

### External Dependencies (libGDX)
- `Screen` - Screen lifecycle
- `SpriteBatch` - Rendering
- `ShapeRenderer` - Star shapes
- `BitmapFont` - Text rendering
- `Interpolation` - Fade transitions
- `Color` - Color management
- `Math` - Star calculations (sin, cos, PI)

---

## Known Limitations

### Current Implementation
1. **Star Rating is Simple** - Only 3 tiers (could be more granular)
2. **No Animation Variety** - Same celebration for all scores (could vary by performance)
3. **No High Score Tracking** - Not persisted (could add Preferences)
4. **No Social Sharing** - Can't share results (could add screenshot/share)
5. **No Replay Review** - Can't see which letters were correct/incorrect

### Future Enhancements (Out of Scope for 2.7.9)
- [ ] Phase 2.7.10: High score tracking with Preferences
- [ ] Phase 2.7.11: Review screen showing correct/incorrect letters
- [ ] Phase 2.7.12: Multiple celebration animations based on performance
- [ ] Phase 2.7.13: Achievement badges
- [ ] Phase 2.7.14: Progress tracking over time

---

## References

### Phaser Version (Reference Only)
- `archive/phaser-web/src/scenes/ResultsScene.js` - Original implementation

### Phase Documentation
- Phase 2.7.4: UI components
- Phase 2.7.5: Main Menu navigation
- Phase 2.7.6: Settings screen
- Phase 2.7.7: Letter Pop Menu
- Phase 2.7.8: Letter Pop Game

### libGDX Documentation
- Screen interface: https://libgdx.com/wiki/app/the-application-framework#screen
- ShapeRenderer: https://libgdx.com/wiki/graphics/opengl-utils/shape-renderer
- Interpolation: https://libgdx.com/wiki/math-utils/interpolation

---

**Plan Created:** October 19, 2025
**Phase:** 2.7.9
**Status:** Ready for UML and Gherkin documentation
**Next Step:** Create UML.md with architecture diagrams
