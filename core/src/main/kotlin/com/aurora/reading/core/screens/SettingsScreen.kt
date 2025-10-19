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
            y = responsive.getY(85f),  // 85% from bottom = near top
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
            decorationCount = 8
        )
    }

    private fun createSliders() {
        // Position sliders in middle section (between title at 85% and button at 10%)
        val spacing = responsive.scaleY(13f)  // 13% spacing = ~208px

        // Load saved settings or use defaults
        val masterVolume = prefs.getInteger("masterVolume", 100)
        val voiceVolume = prefs.getInteger("voiceVolume", 100)
        val soundVolume = prefs.getInteger("soundVolume", 100)

        Gdx.app.log("SettingsScreen", "Creating sliders with spacing=$spacing")

        // Master Volume Slider (top-most)
        masterSlider = Slider(
            x = responsive.getX(20f),
            y = responsive.getY(61f),  // 61% from bottom
            label = "Master Volume",
            initialValue = masterVolume,
            suffix = "%",
            onValueChange = { value ->
                prefs.putInteger("masterVolume", value)
                prefs.flush()
                applyVolumeSettings()
            }
        )
        Gdx.app.log("SettingsScreen", "Master slider created at y=${responsive.getY(61f)}")

        // Sound Volume Slider (middle)
        soundSlider = Slider(
            x = responsive.getX(20f),
            y = responsive.getY(48f),  // 48% from bottom
            label = "Sound Volume",
            initialValue = soundVolume,
            suffix = "%",
            onValueChange = { value ->
                prefs.putInteger("soundVolume", value)
                prefs.flush()
                applyVolumeSettings()
            }
        )
        Gdx.app.log("SettingsScreen", "Sound slider created at y=${responsive.getY(48f)}")

        // Voice Volume Slider (bottom-most)
        voiceSlider = Slider(
            x = responsive.getX(20f),
            y = responsive.getY(35f),  // 35% from bottom
            label = "Voice Volume",
            initialValue = voiceVolume,
            suffix = "%",
            onValueChange = { value ->
                prefs.putInteger("voiceVolume", value)
                prefs.flush()
                applyVolumeSettings()
            }
        )
        Gdx.app.log("SettingsScreen", "Voice slider created at y=${responsive.getY(35f)}")

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
        val buttonWidth = responsive.scaleX(8f)  // 8% of width = ~205px
        val buttonHeight = responsive.scaleY(5f)  // 5% of height = 80px
        backButton = Button(
            x = responsive.centerX - (buttonWidth / 2f),
            y = responsive.getY(15f),  // 15% from bottom - at bottom but clear of nav bar
            width = buttonWidth,
            height = buttonHeight,
            texturePath = Assets.UI.BTN_GREEN,
            text = "← BACK",
            textColor = ThemeConfig.Colors.TEXT_WHITE,
            onClick = { navigateToMainMenu() }
        )
        Gdx.app.log("SettingsScreen", "Back button created at y=${responsive.getY(15f)}, size=${buttonWidth}x${buttonHeight}")
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
                // Don't call dispose() here - libGDX will handle cleanup
                // Calling dispose while rendering causes native crashes
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

            Gdx.app.log("SettingsScreen", "Touch detected - screen: (${touchPos.x}, ${touchPos.y}) -> world: (${worldPos.x}, ${worldPos.y})")

            if (Gdx.input.justTouched()) {
                // Touch down
                Gdx.app.log("SettingsScreen", "justTouched - calling handleTouchDown")
                val backResult = backButton.handleTouchDown(worldPos.x, worldPos.y)
                val masterResult = masterSlider.handleTouchDown(worldPos.x, worldPos.y)
                val voiceResult = voiceSlider.handleTouchDown(worldPos.x, worldPos.y)
                val soundResult = soundSlider.handleTouchDown(worldPos.x, worldPos.y)
                Gdx.app.log("SettingsScreen", "Touch results - back:$backResult, master:$masterResult, voice:$voiceResult, sound:$soundResult")
            } else {
                // Dragging
                Gdx.app.log("SettingsScreen", "Dragging")
                masterSlider.handleTouchDragged(worldPos.x, worldPos.y)
                voiceSlider.handleTouchDragged(worldPos.x, worldPos.y)
                soundSlider.handleTouchDragged(worldPos.x, worldPos.y)
            }

            // Check hover
            masterSlider.checkHover(worldPos.x, worldPos.y)
            voiceSlider.checkHover(worldPos.x, worldPos.y)
            soundSlider.checkHover(worldPos.x, worldPos.y)
        } else {
            // Touch up - pass coordinates to all components for tap-to-set support
            val touchPos = Vector2(Gdx.input.x.toFloat(), Gdx.input.y.toFloat())
            val worldPos = viewport.unproject(touchPos)
            Gdx.app.log("SettingsScreen", "Touch up at world: (${worldPos.x}, ${worldPos.y})")
            backButton.handleTouchUp(worldPos.x, worldPos.y)
            masterSlider.handleTouchUp(worldPos.x, worldPos.y)
            voiceSlider.handleTouchUp(worldPos.x, worldPos.y)
            soundSlider.handleTouchUp(worldPos.x, worldPos.y)
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
