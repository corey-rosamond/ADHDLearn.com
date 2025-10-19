# Phase 2.7.7: Letter Pop Menu Screen - Implementation Plan

## Overview

Complete the Letter Pop Menu screen implementation by replacing the stub created in Phase 2.7.5 with a fully functional game configuration interface. This screen allows users to select game settings before starting the Letter Pop game.

**Phaser Reference:** `archive/phaser-web/src/scenes/LetterPopMenuScene.js`

## Objectives

1. Create CaseSelector component for letter case selection
2. Replace LetterPopMenuScreen stub with full implementation
3. Add time limit slider (5-15 seconds)
4. Add letter case selector (Uppercase/Lowercase/Mixed)
5. Add animated balloon icon at top
6. Implement Start Game button
7. Implement Back button to return to Main Menu
8. Persist settings using libGDX Preferences
9. Add floating decorations for visual polish
10. Implement responsive layout for 2560x1600

## Components to Reuse

✅ **Already Built:**
- `GradientBackground` - Purple → Orange gradient (Phase 2.7.4)
- `TitleText` - "LETTER POP" title (Phase 2.7.4)
- `Button` - Start and back buttons (Phase 2.7.4)
- `Slider` - Time limit slider (Phase 2.7.6)
- `FloatingDecorations` - Fun floating icons (Phase 2.7.6)
- `BalloonIcon` - Animated balloon (Phase 2.7.5)
- `ResponsiveUtils` - Responsive positioning
- `ThemeConfig` - Color palette and constants
- `FontManager` - FreeType font generation
- `AudioManager` - Sound playback

## Implementation Tasks

### Task 1: Create CaseSelector Component

**File:** `core/src/main/kotlin/com/aurora/reading/core/components/CaseSelector.kt`

```kotlin
package com.aurora.reading.core.components

import com.badlogic.gdx.Gdx
import com.badlogic.gdx.graphics.Color
import com.badlogic.gdx.graphics.Pixmap
import com.badlogic.gdx.graphics.Texture
import com.badlogic.gdx.graphics.g2d.BitmapFont
import com.badlogic.gdx.graphics.g2d.GlyphLayout
import com.badlogic.gdx.graphics.g2d.SpriteBatch
import com.badlogic.gdx.math.Rectangle
import com.aurora.reading.core.config.ThemeConfig
import com.aurora.reading.core.services.FontManager
import com.aurora.reading.core.utils.ResponsiveUtils

/**
 * Case Selector Component
 *
 * Radio button-style selector for letter case (Uppercase/Lowercase/Mixed)
 *
 * Features:
 * - Three mutually exclusive options
 * - Visual selection indicator (green for selected, purple for unselected)
 * - Label and description text for each option
 * - Hover effects on options
 * - Real-time selection callback
 */
class CaseSelector(
    private val x: Float,
    private val y: Float,
    initialValue: String = "uppercase",
    private val onValueChange: ((String) -> Unit)? = null
) {
    private val responsive = ResponsiveUtils()

    // Fonts
    private val labelFont: BitmapFont = FontManager.getFont(responsive.getFontSize(28))
    private val optionLabelFont: BitmapFont = FontManager.getFont(responsive.getFontSize(32))
    private val optionDescFont: BitmapFont = FontManager.getFont(responsive.getFontSize(18))
    private val glyphLayout = GlyphLayout()

    // Options
    data class CaseOption(
        val value: String,
        val label: String,
        val description: String
    )

    private val options = listOf(
        CaseOption("uppercase", "ABC", "Uppercase"),
        CaseOption("lowercase", "abc", "Lowercase"),
        CaseOption("mixed", "Abc", "Mixed")
    )

    // Current selection
    private var selectedValue: String = initialValue

    // Button dimensions
    private val buttonWidth = responsive.scaleX(8f)  // 8% = ~205px
    private val buttonHeight = responsive.scaleY(4.4f)  // 4.4% = ~70px
    private val buttonSpacing = responsive.scaleX(0.8f)  // 0.8% = ~20px
    private val labelY = y

    // Button textures
    private val buttonTextures = mutableMapOf<String, Texture>()
    private val buttonRects = mutableListOf<Rectangle>()

    // Interaction state
    private var hoveredIndex: Int = -1
    private val hoverScales = FloatArray(3) { 1f }

    init {
        createButtonTextures()
        createButtonRects()
    }

    private fun createButtonTextures() {
        options.forEach { option ->
            val isSelected = option.value == selectedValue
            buttonTextures[option.value] = createButtonTexture(isSelected)
        }
    }

    private fun createButtonTexture(isSelected: Boolean): Texture {
        val width = buttonWidth.toInt()
        val height = buttonHeight.toInt()
        val pixmap = Pixmap(width, height, Pixmap.Format.RGBA8888)

        // Fill with color (green if selected, dark purple if not)
        val bgColor = if (isSelected) ThemeConfig.Colors.GREEN else Color(0.35f, 0.18f, 0.35f, 1f)
        pixmap.setColor(bgColor)
        pixmap.fill()

        val texture = Texture(pixmap)
        pixmap.dispose()
        return texture
    }

    private fun createButtonRects() {
        val startX = x
        val btnY = y + responsive.scaleY(3f)  // 3% below label

        options.forEachIndexed { index, _ ->
            val btnX = startX + (index * (buttonWidth + buttonSpacing))
            buttonRects.add(Rectangle(btnX, btnY, buttonWidth, buttonHeight))
        }
    }

    fun handleTouchDown(touchX: Float, touchY: Float): Boolean {
        buttonRects.forEachIndexed { index, rect ->
            if (rect.contains(touchX, touchY)) {
                selectOption(index)
                AudioManager.playCorrect()
                return true
            }
        }
        return false
    }

    fun handleTouchUp(touchX: Float, touchY: Float) {
        // No action needed for touch up
    }

    fun handleHover(touchX: Float, touchY: Float) {
        var foundHover = false
        buttonRects.forEachIndexed { index, rect ->
            if (rect.contains(touchX, touchY)) {
                hoveredIndex = index
                foundHover = true
            }
        }
        if (!foundHover) {
            hoveredIndex = -1
        }
    }

    private fun selectOption(index: Int) {
        val option = options[index]
        if (selectedValue != option.value) {
            selectedValue = option.value

            // Recreate button textures
            buttonTextures.values.forEach { it.dispose() }
            buttonTextures.clear()
            createButtonTextures()

            // Callback
            onValueChange?.invoke(selectedValue)
        }
    }

    fun update(delta: Float) {
        // Animate hover scales
        hoverScales.forEachIndexed { index, currentScale ->
            val targetScale = if (index == hoveredIndex) 1.1f else 1f
            val scaleSpeed = 8f
            hoverScales[index] = currentScale + ((targetScale - currentScale) * delta * scaleSpeed)
        }
    }

    fun draw(batch: SpriteBatch) {
        // Draw label
        labelFont.color = ThemeConfig.Colors.TEXT_WHITE
        labelFont.draw(batch, "Letter Case:", x, labelY)

        // Draw buttons
        buttonRects.forEachIndexed { index, rect ->
            val option = options[index]
            val texture = buttonTextures[option.value]!!

            // Draw button background
            batch.draw(texture, rect.x, rect.y, buttonWidth, buttonHeight)

            // Draw option label (e.g., "ABC")
            val scale = hoverScales[index]
            optionLabelFont.color = ThemeConfig.Colors.STAR_YELLOW
            glyphLayout.setText(optionLabelFont, option.label)
            val labelX = rect.x + (buttonWidth / 2f) - (glyphLayout.width * scale / 2f)
            val labelY = rect.y + (buttonHeight * 0.65f)
            optionLabelFont.data.setScale(scale)
            optionLabelFont.draw(batch, option.label, labelX, labelY)
            optionLabelFont.data.setScale(1f)

            // Draw option description (e.g., "Uppercase")
            optionDescFont.color = ThemeConfig.Colors.TEXT_WHITE
            glyphLayout.setText(optionDescFont, option.description)
            val descX = rect.x + (buttonWidth / 2f) - (glyphLayout.width * scale / 2f)
            val descY = rect.y + (buttonHeight * 0.35f)
            optionDescFont.data.setScale(scale)
            optionDescFont.draw(batch, option.description, descX, descY)
            optionDescFont.data.setScale(1f)
        }
    }

    fun getValue(): String = selectedValue

    fun setValue(value: String) {
        if (options.any { it.value == value }) {
            selectedValue = value
            // Recreate button textures
            buttonTextures.values.forEach { it.dispose() }
            buttonTextures.clear()
            createButtonTextures()
        }
    }

    fun dispose() {
        buttonTextures.values.forEach { it.dispose() }
        buttonTextures.clear()
    }
}
```

**Acceptance Criteria:**
- [ ] CaseSelector renders three options (Uppercase/Lowercase/Mixed)
- [ ] Selected option shows green background
- [ ] Unselected options show dark purple background
- [ ] Options have labels (ABC/abc/Abc) and descriptions
- [ ] Clicking option selects it and deselects others
- [ ] Hover effect scales text to 1.1x
- [ ] onValueChange callback fires correctly
- [ ] All textures dispose properly

---

### Task 2: Implement Full LetterPopMenuScreen

**File:** `core/src/main/kotlin/com/aurora/reading/core/screens/LetterPopMenuScreen.kt` (replace stub)

```kotlin
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
            color = ThemeConfig.Colors.PINK,
            animated = true
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
            texturePath = Assets.UI.BTN_ORANGE,
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
        balloonIcon.update(delta)
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
```

**Acceptance Criteria:**
- [ ] Letter Pop Menu screen renders with all components
- [ ] Time slider displays and works (5-15 seconds)
- [ ] Case selector displays three options
- [ ] Balloon icon animates at top
- [ ] Start Game button visible and clickable
- [ ] Back button navigates to Main Menu
- [ ] Settings persist between app sessions
- [ ] Floating decorations animate smoothly
- [ ] 60 FPS maintained

---

## Testing Checklist

### Visual Tests
- [ ] Gradient background (purple → orange) fills screen
- [ ] Title "LETTER POP" displays at top
- [ ] Balloon icon animates above title
- [ ] Time slider renders with label and value
- [ ] Case selector shows three options (ABC/abc/Abc)
- [ ] Start Game button visible
- [ ] Back button visible at bottom
- [ ] Floating decorations animate

### Interaction Tests
- [ ] Time slider can be dragged (5-15 seconds)
- [ ] Clicking slider bar snaps handle
- [ ] Case options can be clicked
- [ ] Selected case option shows green background
- [ ] Unselected options show purple background
- [ ] Only one case option selected at a time
- [ ] Hover effects work on options
- [ ] Start Game button responds to tap
- [ ] Back button navigates to Main Menu

### Persistence Tests
- [ ] Default values work (10s, uppercase)
- [ ] Time setting saves when changed
- [ ] Case setting saves when changed
- [ ] Settings load correctly on next launch
- [ ] Settings persist after app closure

### Navigation Tests
- [ ] Back button returns to Main Menu with fade
- [ ] Start Game button triggers (placeholder for now)
- [ ] Screen transitions are smooth (0.3s)
- [ ] Screen disposes properly after navigation

### Performance Tests
- [ ] Maintains 60 FPS with all animations
- [ ] Smooth dragging with no lag
- [ ] Smooth transitions to/from Main Menu
- [ ] No memory leaks on dispose

---

## Dependencies

**Phase 2.7.4 Components (Required):**
- ✅ GradientBackground
- ✅ TitleText
- ✅ Button
- ✅ ResponsiveUtils
- ✅ ThemeConfig
- ✅ FontManager

**Phase 2.7.5 Components (Required):**
- ✅ MainMenuScreen (for back navigation)
- ✅ BalloonIcon

**Phase 2.7.6 Components (Required):**
- ✅ Slider (time limit slider)
- ✅ FloatingDecorations

**New Components (To Build):**
- CaseSelector (Task 1)

**Assets Required:**
- ✅ Fredoka font (already loaded)
- ✅ Decoration images (already loaded)
- ✅ Button textures (already loaded)

---

## Estimated Time

| Task | Time | Priority |
|------|------|----------|
| Task 1: CaseSelector component | 2 hours | High |
| Task 2: LetterPopMenuScreen implementation | 1.5 hours | High |
| Testing and polish | 1 hour | Medium |
| **Total** | **4.5 hours** | - |

---

## Success Criteria

**Phase 2.7.7 is complete when:**

1. ✅ CaseSelector component fully functional
2. ✅ LetterPopMenuScreen renders with all components
3. ✅ Time slider working (5-15 seconds)
4. ✅ Case selector working (Uppercase/Lowercase/Mixed)
5. ✅ Settings persist using Preferences
6. ✅ Start Game button ready (placeholder navigation)
7. ✅ Back button navigates to Main Menu
8. ✅ All animations smooth at 60 FPS
9. ✅ All BDD scenarios pass (see GHERKIN.md)
10. ✅ Visual testing protocol complete
11. ✅ No memory leaks

---

## Next Steps

After Phase 2.7.7:
- **Phase 2.7.8:** Letter Pop Game Screen (bubble physics, letter recognition, scoring)
- **Phase 2.7.9:** Results Screen (score display, replay/menu options)

---

**Status:** READY TO IMPLEMENT
**Created:** 2025-10-19
**Dependencies:** Phase 2.7.6 ✅
**Estimated Completion:** 4.5 hours
