# Phase 2.7.6: Settings Screen - Implementation Plan

## Overview

Complete the Settings screen implementation by replacing the stub created in Phase 2.7.5 with a fully functional settings interface. This screen allows users to adjust Master, Voice, and Sound volumes with visual sliders and persists settings between sessions.

**Phaser Reference:** `archive/phaser-web/src/scenes/SettingsScene.js`

## Objectives

1. Create Slider component for volume controls
2. Replace SettingsScreen stub with full implementation
3. Add three volume sliders (Master, Voice, Sound)
4. Implement back button to return to Main Menu
5. Integrate with AudioManager for real-time volume changes
6. Persist settings using libGDX Preferences
7. Add floating decorations for visual polish
8. Implement responsive layout for 2560x1600

## Components to Reuse

✅ **Already Built:**
- `GradientBackground` - Purple → Pink gradient (Phase 2.7.4)
- `TitleText` - "SETTINGS" title (Phase 2.7.4)
- `Button` - Back button component (Phase 2.7.4)
- `FloatingDecorations` - Fun floating icons (Phase 2.7.5)
- `ResponsiveUtils` - Responsive positioning
- `ThemeConfig` - Color palette and constants
- `AudioManager` - Sound and voice playback manager

## Implementation Tasks

### Task 1: Create Slider Component

**File:** `core/src/main/kotlin/com/aurora/reading/core/components/Slider.kt`

```kotlin
package com.aurora.reading.core.components

import com.badlogic.gdx.Gdx
import com.badlogic.gdx.graphics.Color
import com.badlogic.gdx.graphics.Pixmap
import com.badlogic.gdx.graphics.Texture
import com.badlogic.gdx.graphics.g2d.BitmapFont
import com.badlogic.gdx.graphics.g2d.SpriteBatch
import com.badlogic.gdx.graphics.glutils.ShapeRenderer
import com.badlogic.gdx.math.MathUtils
import com.badlogic.gdx.math.Vector2
import com.aurora.reading.core.config.ThemeConfig
import com.aurora.reading.core.services.FontManager
import com.aurora.reading.core.utils.ResponsiveUtils

/**
 * Interactive slider component for volume and settings controls
 *
 * Features:
 * - Label text on left
 * - Value display on right (with suffix like "%")
 * - Draggable slider bar with handle
 * - Yellow→Orange gradient fill
 * - Dark purple background
 * - Hover effect on handle
 * - Real-time value callback
 */
class Slider(
    private val x: Float,
    private val y: Float,
    private val label: String,
    private val minValue: Int = 0,
    private val maxValue: Int = 100,
    initialValue: Int = 50,
    private val suffix: String = "%",
    private val barWidth: Float = ResponsiveUtils().scaleX(700f),
    private val barHeight: Float = ResponsiveUtils().scaleY(15f),
    private val onValueChange: ((Int) -> Unit)? = null
) {
    private val responsive = ResponsiveUtils()

    // Fonts
    private val labelFont: BitmapFont = FontManager.getFont(responsive.getFontSize(32))
    private val valueFont: BitmapFont = FontManager.getFont(responsive.getFontSize(32))

    // Current value
    private var currentValue: Int = initialValue

    // Positions
    private val barX: Float = x
    private val barY: Float = y + responsive.scaleY(50f)
    private val valueX: Float = responsive.getX(80f)

    // Handle
    private val handleRadius: Float = responsive.scaleX(20f)
    private var handleX: Float
    private var handleY: Float = barY + (barHeight / 2f)

    // Interaction state
    private var isDragging = false
    private var isHovering = false
    private var handleScale = 1f

    // Textures
    private lateinit var barBgTexture: Texture
    private lateinit var barFgTexture: Texture

    init {
        // Calculate initial handle position
        val percentage = ((initialValue - minValue).toFloat() / (maxValue - minValue)) * 100f
        handleX = barX + (barWidth * percentage / 100f)

        // Create bar textures
        createBarTextures()
    }

    private fun createBarTextures() {
        // Background bar (dark purple)
        val bgPixmap = Pixmap(barWidth.toInt(), barHeight.toInt(), Pixmap.Format.RGBA8888)
        bgPixmap.setColor(ThemeConfig.Colors.DARK_PURPLE)
        bgPixmap.fill()
        barBgTexture = Texture(bgPixmap)
        bgPixmap.dispose()

        updateForegroundTexture()
    }

    private fun updateForegroundTexture() {
        // Dispose old texture if it exists
        if (::barFgTexture.isInitialized) {
            barFgTexture.dispose()
        }

        // Foreground bar (yellow→orange gradient)
        val percentage = ((currentValue - minValue).toFloat() / (maxValue - minValue)) * 100f
        val fgWidth = (barWidth * percentage / 100f).toInt().coerceAtLeast(1)

        val fgPixmap = Pixmap(fgWidth, barHeight.toInt(), Pixmap.Format.RGBA8888)

        // Create horizontal gradient from yellow to orange
        for (x in 0 until fgWidth) {
            val ratio = x.toFloat() / fgWidth
            val color = Color()
            color.set(ThemeConfig.Colors.STAR_YELLOW).lerp(ThemeConfig.Colors.ORANGE, ratio)
            fgPixmap.setColor(color)
            fgPixmap.drawLine(x, 0, x, barHeight.toInt() - 1)
        }

        barFgTexture = Texture(fgPixmap)
        fgPixmap.dispose()
    }

    fun handleTouchDown(touchX: Float, touchY: Float): Boolean {
        // Check if touch is on handle
        val distance = Vector2(touchX - handleX, touchY - handleY).len()
        if (distance <= handleRadius * handleScale) {
            isDragging = true
            return true
        }

        // Check if touch is on bar (snap to position)
        if (touchX >= barX && touchX <= barX + barWidth &&
            touchY >= barY - handleRadius && touchY <= barY + barHeight + handleRadius) {
            handleX = touchX.coerceIn(barX, barX + barWidth)
            updateValue()
            isDragging = true
            return true
        }

        return false
    }

    fun handleTouchDragged(touchX: Float, touchY: Float) {
        if (isDragging) {
            handleX = touchX.coerceIn(barX, barX + barWidth)
            updateValue()
        }
    }

    fun handleTouchUp() {
        isDragging = false
    }

    fun handleHover(touchX: Float, touchY: Float) {
        val distance = Vector2(touchX - handleX, touchY - handleY).len()
        val wasHovering = isHovering
        isHovering = distance <= handleRadius * handleScale

        // Trigger scale animation if hover state changed
        if (isHovering && !wasHovering) {
            // Start scaling up
        } else if (!isHovering && wasHovering) {
            // Start scaling down
        }
    }

    private fun updateValue() {
        val percentage = ((handleX - barX) / barWidth) * 100f
        val newValue = MathUtils.round(minValue + ((maxValue - minValue) * percentage / 100f))

        if (newValue != currentValue) {
            currentValue = newValue
            updateForegroundTexture()
            onValueChange?.invoke(currentValue)
        }
    }

    fun update(delta: Float) {
        // Animate handle scale
        val targetScale = if (isHovering || isDragging) 1.2f else 1f
        val scaleSpeed = 5f
        handleScale = MathUtils.lerp(handleScale, targetScale, delta * scaleSpeed)
    }

    fun draw(batch: SpriteBatch) {
        // Draw label
        labelFont.color = ThemeConfig.Colors.WHITE
        labelFont.draw(batch, "$label:", x, y)

        // Draw value
        valueFont.color = ThemeConfig.Colors.STAR_YELLOW
        val valueText = "$currentValue$suffix"
        val valueLayout = com.badlogic.gdx.graphics.g2d.GlyphLayout(valueFont, valueText)
        valueFont.draw(batch, valueText, valueX - valueLayout.width, y)

        // Draw slider bar background
        batch.draw(barBgTexture, barX, barY, barWidth, barHeight)

        // Draw slider bar foreground
        batch.draw(barFgTexture, barX, barY)

        // Draw handle (white circle with purple stroke)
        // Note: Handle drawing requires ShapeRenderer or circle texture
        // For now, we'll draw it as a filled circle texture
        drawHandle(batch)
    }

    private fun drawHandle(batch: SpriteBatch) {
        // Create a temporary circle texture for the handle
        val radius = (handleRadius * handleScale).toInt()
        val size = radius * 2

        val pixmap = Pixmap(size, size, Pixmap.Format.RGBA8888)

        // Draw white fill
        pixmap.setColor(ThemeConfig.Colors.WHITE)
        pixmap.fillCircle(radius, radius, radius)

        // Draw purple stroke (draw multiple circles with decreasing radius)
        val strokeWidth = responsive.scaleX(3f).toInt()
        pixmap.setColor(ThemeConfig.Colors.PURPLE)
        for (i in 0 until strokeWidth) {
            pixmap.drawCircle(radius, radius, radius - i)
        }

        val handleTexture = Texture(pixmap)
        pixmap.dispose()

        batch.draw(handleTexture,
            handleX - radius,
            handleY - radius,
            size.toFloat(),
            size.toFloat())

        handleTexture.dispose()
    }

    fun getValue(): Int = currentValue

    fun setValue(value: Int) {
        currentValue = value.coerceIn(minValue, maxValue)
        val percentage = ((currentValue - minValue).toFloat() / (maxValue - minValue)) * 100f
        handleX = barX + (barWidth * percentage / 100f)
        updateForegroundTexture()
    }

    fun dispose() {
        barBgTexture.dispose()
        barFgTexture.dispose()
    }
}
```

**Acceptance Criteria:**
- [ ] Slider renders with label, value, bar, and handle
- [ ] Handle can be dragged to change value
- [ ] Clicking bar snaps handle to that position
- [ ] Handle scales to 1.2x on hover
- [ ] Value display updates in real-time
- [ ] onValueChange callback fires correctly
- [ ] Gradient fills from yellow to orange
- [ ] All textures dispose properly

---

### Task 2: Implement Full SettingsScreen

**File:** `core/src/main/kotlin/com/aurora/reading/core/screens/SettingsScreen.kt` (replace stub)

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
import com.aurora.reading.core.components.*
import com.aurora.reading.core.config.ThemeConfig
import com.aurora.reading.core.services.AudioManager
import com.aurora.reading.core.utils.ResponsiveUtils

/**
 * Settings Screen
 *
 * Allows users to adjust:
 * - Master Volume (affects all sounds)
 * - Voice Volume (narration and voices)
 * - Sound Volume (SFX and game sounds)
 *
 * Settings are persisted using libGDX Preferences.
 */
class SettingsScreen(private val game: Game) : Screen {

    private lateinit var camera: OrthographicCamera
    private lateinit var viewport: FitViewport
    private lateinit var batch: SpriteBatch
    private val responsive = ResponsiveUtils()

    private lateinit var background: GradientBackground
    private lateinit var titleText: TitleText
    private lateinit var decorations: FloatingDecorations

    private lateinit var masterSlider: Slider
    private lateinit var voiceSlider: Slider
    private lateinit var soundSlider: Slider
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
        Gdx.app.log("SettingsScreen", "Settings screen loaded")

        camera = OrthographicCamera()
        viewport = FitViewport(ResponsiveUtils.WORLD_WIDTH, ResponsiveUtils.WORLD_HEIGHT, camera)
        batch = SpriteBatch()

        // Load preferences
        prefs = Gdx.app.getPreferences("aurora-reading-settings")

        createBackground()
        createTitle()
        createDecorations()
        createSliders()
        createBackButton()
    }

    private fun createBackground() {
        background = GradientBackground(
            ResponsiveUtils.WORLD_WIDTH,
            ResponsiveUtils.WORLD_HEIGHT,
            arrayOf(ThemeConfig.Colors.PURPLE, ThemeConfig.Colors.PINK)
        )
    }

    private fun createTitle() {
        titleText = TitleText(
            text = "SETTINGS",
            x = responsive.centerX,
            y = responsive.getY(15f),
            fontSize = responsive.getFontSize(72),
            textColor = ThemeConfig.Colors.STAR_YELLOW,
            borderColor = ThemeConfig.Colors.PURPLE,
            borderWidth = responsive.scaleX(0.31f),
            bounceIn = true
        )
    }

    private fun createDecorations() {
        decorations = FloatingDecorations(
            ResponsiveUtils.WORLD_WIDTH,
            ResponsiveUtils.WORLD_HEIGHT,
            count = 8
        )
    }

    private fun createSliders() {
        val startY = responsive.getY(35f)
        val spacing = responsive.scaleY(120f)

        // Load saved settings or use defaults
        val masterVolume = prefs.getInteger("masterVolume", 100)
        val voiceVolume = prefs.getInteger("voiceVolume", 100)
        val soundVolume = prefs.getInteger("soundVolume", 100)

        // Master Volume Slider
        masterSlider = Slider(
            x = responsive.getX(20f),
            y = startY,
            label = "Master Volume",
            initialValue = masterVolume,
            suffix = "%",
            onValueChange = { value ->
                prefs.putInteger("masterVolume", value)
                prefs.flush()
                applyVolumeSettings()
            }
        )

        // Voice Volume Slider
        voiceSlider = Slider(
            x = responsive.getX(20f),
            y = startY + spacing,
            label = "Voice Volume",
            initialValue = voiceVolume,
            suffix = "%",
            onValueChange = { value ->
                prefs.putInteger("voiceVolume", value)
                prefs.flush()
                applyVolumeSettings()
            }
        )

        // Sound Volume Slider
        soundSlider = Slider(
            x = responsive.getX(20f),
            y = startY + (spacing * 2),
            label = "Sound Volume",
            initialValue = soundVolume,
            suffix = "%",
            onValueChange = { value ->
                prefs.putInteger("soundVolume", value)
                prefs.flush()
                applyVolumeSettings()
            }
        )

        // Apply initial volume settings
        applyVolumeSettings()
    }

    private fun applyVolumeSettings() {
        val masterVolume = prefs.getInteger("masterVolume", 100) / 100f
        val voiceVolume = prefs.getInteger("voiceVolume", 100) / 100f
        val soundVolume = prefs.getInteger("soundVolume", 100) / 100f

        // Apply to AudioManager
        AudioManager.setMasterVolume(masterVolume)
        AudioManager.setVoiceVolume(voiceVolume)
        AudioManager.setSoundVolume(soundVolume)
    }

    private fun createBackButton() {
        backButton = Button(
            text = "← BACK",
            x = responsive.centerX,
            y = responsive.getY(85f),
            width = responsive.scaleX(200f),
            height = responsive.scaleY(80f),
            backgroundColor = ThemeConfig.Colors.ORANGE,
            textColor = ThemeConfig.Colors.WHITE,
            onClick = { navigateToMainMenu() }
        )
    }

    private fun navigateToMainMenu() {
        if (transitioning) return
        Gdx.app.log("SettingsScreen", "Navigating back to Main Menu")
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
                dispose()
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
        masterSlider.update(delta)
        voiceSlider.update(delta)
        soundSlider.update(delta)
        backButton.update(delta)
        updateFadeOut(delta)

        // Handle input
        handleInput()

        // Draw
        batch.begin()
        batch.setColor(1f, 1f, 1f, fadeAlpha)

        background.draw(batch)
        decorations.draw(batch)
        titleText.draw(batch)
        masterSlider.draw(batch)
        voiceSlider.draw(batch)
        soundSlider.draw(batch)
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
                backButton.handleTouchDown(worldPos.x, worldPos.y)
                masterSlider.handleTouchDown(worldPos.x, worldPos.y)
                voiceSlider.handleTouchDown(worldPos.x, worldPos.y)
                soundSlider.handleTouchDown(worldPos.x, worldPos.y)
            } else {
                // Dragging
                masterSlider.handleTouchDragged(worldPos.x, worldPos.y)
                voiceSlider.handleTouchDragged(worldPos.x, worldPos.y)
                soundSlider.handleTouchDragged(worldPos.x, worldPos.y)
            }
        } else {
            // Touch up
            backButton.handleTouchUp()
            masterSlider.handleTouchUp()
            voiceSlider.handleTouchUp()
            soundSlider.handleTouchUp()
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
        decorations.dispose()
        masterSlider.dispose()
        voiceSlider.dispose()
        soundSlider.dispose()
        backButton.dispose()
    }
}
```

**Acceptance Criteria:**
- [ ] Settings screen renders with all components
- [ ] Three volume sliders display correctly
- [ ] Sliders can be dragged to adjust values
- [ ] Volume changes apply immediately to AudioManager
- [ ] Settings persist between app sessions
- [ ] Back button navigates to Main Menu with fade
- [ ] Floating decorations animate smoothly
- [ ] 60 FPS maintained

---

### Task 3: Add AudioManager Volume Methods

**File:** `core/src/main/kotlin/com/aurora/reading/core/services/AudioManager.kt`

Add volume control methods:

```kotlin
// Add to AudioManager companion object

private var masterVolume = 1f
private var voiceVolume = 1f
private var soundVolume = 1f

fun setMasterVolume(volume: Float) {
    masterVolume = volume.coerceIn(0f, 1f)
}

fun setVoiceVolume(volume: Float) {
    voiceVolume = volume.coerceIn(0f, 1f)
}

fun setSoundVolume(volume: Float) {
    soundVolume = volume.coerceIn(0f, 1f)
}

// Update playVoice to use volumes
fun playVoice(name: String) {
    val sound = voiceCache[name] ?: return
    sound.play(masterVolume * voiceVolume)
}

// Update playSound to use volumes
fun playCorrect() {
    correctSound?.play(masterVolume * soundVolume)
}

fun playIncorrect() {
    incorrectSound?.play(masterVolume * soundVolume)
}
```

**Acceptance Criteria:**
- [ ] Volume methods added to AudioManager
- [ ] Master volume affects all sounds
- [ ] Voice volume affects voice playback
- [ ] Sound volume affects SFX playback
- [ ] Volume values clamped to 0-1 range

---

## Testing Checklist

### Visual Tests
- [ ] Gradient background (purple → pink) fills screen
- [ ] Title "SETTINGS" displays at top
- [ ] Three sliders render with labels and values
- [ ] Slider bars show yellow→orange gradient
- [ ] Handles are white circles with purple stroke
- [ ] Back button visible at bottom
- [ ] Floating decorations animate

### Interaction Tests
- [ ] Master slider can be dragged left/right
- [ ] Voice slider can be dragged left/right
- [ ] Sound slider can be dragged left/right
- [ ] Clicking bar snaps handle to position
- [ ] Handles scale on hover
- [ ] Value text updates in real-time
- [ ] Back button navigates to Main Menu

### Persistence Tests
- [ ] Volume settings save when changed
- [ ] Settings persist after closing app
- [ ] Settings load correctly on next launch
- [ ] Default values (100%) work for new installs

### Audio Tests
- [ ] Master volume affects all sounds
- [ ] Voice volume only affects voices
- [ ] Sound volume only affects SFX
- [ ] Volume changes apply immediately
- [ ] Muted (0%) silences sounds completely

### Performance Tests
- [ ] Maintains 60 FPS with all sliders active
- [ ] Smooth dragging with no lag
- [ ] Smooth transitions to/from Main Menu
- [ ] No memory leaks on dispose

---

## Dependencies

**Phase 2.7.4 Components (Required):**
- ✅ GradientBackground
- ✅ TitleText
- ✅ Button
- ✅ FloatingDecorations
- ✅ ResponsiveUtils
- ✅ ThemeConfig
- ✅ FontManager

**Phase 2.7.5 Components (Required):**
- ✅ MainMenuScreen (for back navigation)

**New Components (To Build):**
- Slider (Task 1)

**Assets Required:**
- ✅ Fredoka font (already loaded)
- ✅ Decoration images (already loaded)

---

## Estimated Time

| Task | Time | Priority |
|------|------|----------|
| Task 1: Slider component | 2 hours | High |
| Task 2: SettingsScreen implementation | 1 hour | High |
| Task 3: AudioManager updates | 30 min | High |
| Testing and polish | 1 hour | Medium |
| **Total** | **4.5 hours** | - |

---

## Success Criteria

**Phase 2.7.6 is complete when:**

1. ✅ Slider component fully functional
2. ✅ SettingsScreen renders with all components
3. ✅ Three volume sliders working (Master, Voice, Sound)
4. ✅ Settings persist using Preferences
5. ✅ AudioManager respects volume settings
6. ✅ Back button navigates to Main Menu
7. ✅ All animations smooth at 60 FPS
8. ✅ All BDD scenarios pass (see GHERKIN.md)
9. ✅ Visual testing protocol complete
10. ✅ No memory leaks

---

## Next Steps

After Phase 2.7.6:
- **Phase 2.7.7:** Letter Pop Menu Screen (time slider, case selector)
- **Phase 2.7.8:** Letter Pop Game Screen (bubbles, physics, scoring)

---

**Status:** READY TO IMPLEMENT
**Created:** 2025-10-18
**Dependencies:** Phase 2.7.5 ✅
**Estimated Completion:** 4.5 hours
