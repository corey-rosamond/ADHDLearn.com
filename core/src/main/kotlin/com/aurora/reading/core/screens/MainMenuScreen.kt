package com.aurora.reading.core.screens

import com.badlogic.gdx.Game
import com.badlogic.gdx.Gdx
import com.badlogic.gdx.Screen
import com.badlogic.gdx.graphics.Color
import com.badlogic.gdx.graphics.GL20
import com.badlogic.gdx.graphics.OrthographicCamera
import com.badlogic.gdx.graphics.Texture
import com.badlogic.gdx.graphics.g2d.SpriteBatch
import com.badlogic.gdx.math.Vector2
import com.badlogic.gdx.utils.viewport.FitViewport
import com.aurora.reading.core.assets.Assets
import com.aurora.reading.core.components.Button
import com.aurora.reading.core.components.FloatingStars
import com.aurora.reading.core.components.FloatingDecorations
import com.aurora.reading.core.components.GradientBackground
import com.aurora.reading.core.components.TitleText
import com.aurora.reading.core.config.ThemeConfig
import com.aurora.reading.core.services.AudioManager
import com.aurora.reading.core.utils.ResponsiveUtils

/**
 * Main Menu Screen
 *
 * Entry point for Aurora's Reading Adventure after loading completes.
 * Displays animated title, floating stars, and game selection tiles.
 *
 * Responsibilities:
 * - Display colorful gradient background
 * - Show animated multi-line title
 * - Display floating star decorations
 * - Provide Settings navigation
 * - Provide game mode selection (Letter Pop)
 * - Play welcome audio message
 * - Handle touch input for navigation
 */
class MainMenuScreen(private val game: Game) : Screen {

    // Graphics
    private lateinit var camera: OrthographicCamera
    private lateinit var viewport: FitViewport
    private lateinit var batch: SpriteBatch
    private val responsive = ResponsiveUtils()

    // Components
    private lateinit var background: GradientBackground
    private lateinit var stars: FloatingStars
    private lateinit var decorations: FloatingDecorations
    private lateinit var titleLine1: TitleText
    private lateinit var titleLine2: TitleText
    private lateinit var titleLine3: TitleText
    private lateinit var settingsButton: Button
    private lateinit var debugIconTexture: Texture
    private var debugIconX = 0f
    private var debugIconY = 0f
    private var debugIconSize = 0f
    private lateinit var letterPopTile: Button

    // Title decorations (hearts)
    private lateinit var heartTexture: Texture
    private lateinit var heartGemTexture: Texture
    private val titleHearts = mutableListOf<TitleHeart>()

    private data class TitleHeart(
        val x: Float,
        val y: Float,
        val size: Float,
        val texture: Texture,
        var time: Float = 0f,
        val speed: Float = 1f
    )

    // Button decorations
    private lateinit var crownTexture: Texture
    private val buttonDecorations = mutableListOf<ButtonDecoration>()

    private data class ButtonDecoration(
        val offsetX: Float,  // Offset from button center
        val offsetY: Float,
        val size: Float,
        val texture: Texture,
        var time: Float = 0f,
        val speed: Float = 1f,
        val orbitRadius: Float = 0f,
        val orbitSpeed: Float = 0f
    )

    // State
    private var audioPlayed = false
    private var transitioning = false
    private var fadeOut = false
    private var fadeAlpha = 1f
    private var fadeTime = 0f
    private val fadeDuration = 0.3f
    private var nextScreen: Screen? = null

    // Animation state
    private var settingsButtonBounceTime = 0f
    private val settingsButtonBounceDuration = 1.2f
    private val settingsButtonBounceOffset = responsive.scaleY(0.67f)  // 0.67% of screen height (~8px)

    private var gameTileFloatTime = 0f
    private val gameTileFloatDuration = 3.0f
    private val gameTileFloatOffset = responsive.scaleY(0.83f)  // 0.83% of screen height (~10px)

    override fun show() {
        Gdx.app.log("MainMenuScreen", "Initializing Main Menu")

        // Initialize graphics (must be done after OpenGL context is ready)
        camera = OrthographicCamera()
        viewport = FitViewport(ResponsiveUtils.WORLD_WIDTH, ResponsiveUtils.WORLD_HEIGHT, camera)
        batch = SpriteBatch()

        createBackground()
        createFloatingStars()
        createFloatingDecorations()
        createTitle()
        createTitleDecorations()
        createSettingsButton()
        createDebugButton()
        createGameTiles()

        Gdx.app.log("MainMenuScreen", "Main Menu initialized successfully")
    }

    /**
     * Create gradient background (Purple → Pink → Orange)
     */
    private fun createBackground() {
        background = GradientBackground(
            ResponsiveUtils.WORLD_WIDTH,
            ResponsiveUtils.WORLD_HEIGHT,
            ThemeConfig.Gradients.MAIN_MENU
        )
    }

    /**
     * Create floating stars decoration
     */
    private fun createFloatingStars() {
        stars = FloatingStars(
            ResponsiveUtils.WORLD_WIDTH,
            ResponsiveUtils.WORLD_HEIGHT,
            starCount = 20,  // Reduced from 30 to make room for other decorations
            useEmoji = false,
            largeStars = true,
            starSize = responsive.scaleX(2.5f)  // 2.5% of screen width
        )
    }

    /**
     * Create floating fun decorations (ice cream, donuts, cupcakes, etc.)
     * Reduced count from 10 to 6 to address ADHD overstimulation concerns
     */
    private fun createFloatingDecorations() {
        decorations = FloatingDecorations(
            ResponsiveUtils.WORLD_WIDTH,
            ResponsiveUtils.WORLD_HEIGHT,
            decorationCount = 6,  // Reduced from 10
            size = responsive.scaleX(4f)  // 4% of screen width (~102px at 2560px)
        )
    }

    /**
     * Create decorative hearts around the title (removed for better accessibility)
     * Hearts with red/pink colors failed colorblind contrast testing
     */
    private fun createTitleDecorations() {
        // Removed heart decorations - caused accessibility issues
        // May add yellow/white stars or other high-contrast decorations in future
    }

    /**
     * Create 3-line animated title (now with crisp FreeType rendering!)
     */
    private fun createTitle() {
        val titleFontSize = responsive.getFontSize(96)
        val borderWidth = responsive.scaleX(0.31f)

        // Line 1: "AURORA'S" at 18% from top = 82% from bottom (libGDX inverted Y)
        titleLine1 = TitleText(
            text = "AURORA'S",
            x = responsive.centerX,
            y = responsive.getY(82f),
            fontSize = titleFontSize,
            textColor = ThemeConfig.Colors.STAR_YELLOW,
            borderColor = ThemeConfig.Colors.PURPLE,
            borderWidth = borderWidth,
            bounceIn = true
        )

        // Line 2: "READING" at 28% from top = 72% from bottom
        titleLine2 = TitleText(
            text = "READING",
            x = responsive.centerX,
            y = responsive.getY(72f),
            fontSize = titleFontSize,
            textColor = ThemeConfig.Colors.STAR_YELLOW,
            borderColor = ThemeConfig.Colors.PURPLE,
            borderWidth = borderWidth,
            bounceIn = true
        )

        // Line 3: "ADVENTURE" at 38% from top = 62% from bottom
        titleLine3 = TitleText(
            text = "ADVENTURE",
            x = responsive.centerX,
            y = responsive.getY(62f),
            fontSize = titleFontSize,
            textColor = ThemeConfig.Colors.STAR_YELLOW,
            borderColor = ThemeConfig.Colors.PURPLE,
            borderWidth = borderWidth,
            bounceIn = true
        )
    }

    /**
     * Create Settings button in top-right corner
     */
    private fun createSettingsButton() {
        val size = responsive.scaleX(5f)  // 5% of screen width (~128px at 2560px)

        // Initial position (will be animated with bounce)
        settingsButton = Button(
            x = responsive.getX(92f) - size / 2f,
            y = responsive.getY(92f) - size / 2f,
            width = size,
            height = size,
            texturePath = Assets.UI.BTN_SETTING,
            text = "",
            onClick = { navigateToSettings() }
        )
    }

    /**
     * Create debug icon (small, top-left corner, just magnifying glass - no button background)
     */
    private fun createDebugButton() {
        debugIconSize = responsive.scaleX(4f)  // 4% of screen width
        debugIconX = responsive.getX(5f) - debugIconSize / 2f
        debugIconY = responsive.getY(92f) - debugIconSize / 2f
        debugIconTexture = Assets.getTexture(Assets.Images.ICON_HINTS)
    }

    /**
     * Update settings button bounce animation
     */
    private fun updateSettingsButtonBounce(delta: Float) {
        settingsButtonBounceTime += delta

        // Calculate bounce offset using sine wave
        val progress = (settingsButtonBounceTime % settingsButtonBounceDuration) / settingsButtonBounceDuration
        val bounceY = kotlin.math.sin(progress * Math.PI.toFloat() * 2) * settingsButtonBounceOffset

        // Update button position with bounce offset
        val size = responsive.scaleX(5f)
        val baseY = responsive.getY(92f) - size / 2f
        settingsButton.setPosition(
            responsive.getX(92f) - size / 2f,
            baseY + bounceY
        )
    }

    /**
     * Update game tile float animation (slower, more gentle than bounce)
     */
    private fun updateGameTileFloat(delta: Float) {
        gameTileFloatTime += delta

        // Calculate float offset using sine wave (slower cycle for gentle floating)
        val progress = (gameTileFloatTime % gameTileFloatDuration) / gameTileFloatDuration
        val floatY = kotlin.math.sin(progress * Math.PI.toFloat() * 2) * gameTileFloatOffset

        // Update tile position with float offset
        val tileSize = responsive.scaleX(15f)
        val baseY = responsive.getY(40f) - tileSize / 2f
        letterPopTile.setPosition(
            responsive.centerX - tileSize / 2f,
            baseY + floatY
        )
    }

    /**
     * Create game selection tiles
     */
    private fun createGameTiles() {
        val tileSize = responsive.scaleX(15f)  // 15% of screen width (~384px at 2560px)

        // Use ice cream cone icon for Letter Pop
        val iconSize = responsive.scaleX(6f)  // 6% of screen width (~150px at 2560px)
        val iceCreamTexture = Assets.getTexture(Assets.Images.ICECREAM)

        // Letter Pop game tile - centered at 60% from top = 40% from bottom
        letterPopTile = Button(
            x = responsive.centerX - tileSize / 2f,
            y = responsive.getY(40f) - tileSize / 2f,
            width = tileSize,
            height = tileSize,
            texturePath = Assets.UI.BOX_BG,
            text = "Letter Pop",
            fontSize = responsive.getFontSize(36),  // Slightly larger text
            textColor = Color.WHITE,  // Changed from ORANGE to WHITE for better contrast
            iconTexture = iceCreamTexture,
            iconSize = iconSize,
            onClick = { navigateToLetterPop() }
        )

        // Add decorative crowns around Letter Pop button
        // Reduced from 4 to 2 crowns to address ADHD overstimulation
        // Slowed animation speeds by 50% for calmer effect
        crownTexture = Assets.getTexture(Assets.Images.CROWN)
        val crownSize = responsive.scaleX(2.5f)  // 2.5% of screen width (~64px at 2560px)

        // Top-left crown (slower animations)
        buttonDecorations.add(ButtonDecoration(
            offsetX = -tileSize * 0.45f,
            offsetY = tileSize * 0.42f,
            size = crownSize,
            texture = crownTexture,
            speed = 0.4f,  // Reduced from 0.8f
            orbitRadius = responsive.scaleX(0.6f),  // Smaller orbit
            orbitSpeed = 0.25f  // Reduced from 0.5f
        ))

        // Bottom-right crown (slower animations)
        buttonDecorations.add(ButtonDecoration(
            offsetX = tileSize * 0.42f,
            offsetY = -tileSize * 0.45f,
            size = crownSize * 0.85f,
            texture = crownTexture,
            speed = 0.45f,  // Reduced from 0.9f
            orbitRadius = responsive.scaleX(0.5f),  // Smaller orbit
            orbitSpeed = -0.28f  // Reduced from -0.55f
        ))
    }

    /**
     * Navigate to Settings screen
     */
    private fun navigateToSettings() {
        if (transitioning) return

        Gdx.app.log("MainMenuScreen", "Navigating to Settings")
        AudioManager.playCorrect()

        startFadeOut(com.aurora.reading.core.screens.SettingsScreen(game))
    }

    /**
     * Navigate to Letter Pop menu
     */
    private fun navigateToLetterPop() {
        if (transitioning) return

        Gdx.app.log("MainMenuScreen", "Navigating to Letter Pop")
        AudioManager.playBubblePop()

        startFadeOut(com.aurora.reading.core.screens.LetterPopMenuScreen(game))
    }

    /**
     * Start fade-out transition to new screen
     */
    private fun startFadeOut(screen: Screen) {
        transitioning = true
        fadeOut = true
        fadeTime = 0f
        nextScreen = screen
    }

    /**
     * Update fade-out animation
     */
    private fun updateFadeOut(delta: Float) {
        if (!fadeOut) return

        fadeTime += delta
        fadeAlpha = 1f - (fadeTime / fadeDuration).coerceIn(0f, 1f)

        if (fadeTime >= fadeDuration) {
            // Fade complete - switch to next screen
            nextScreen?.let {
                game.screen = it
                dispose()
            }
        }
    }

    /**
     * Play welcome audio message once
     */
    private fun playWelcomeMessage() {
        if (!audioPlayed && Gdx.graphics.framesPerSecond > 30) {
            audioPlayed = true
            Gdx.app.postRunnable {
                AudioManager.playWelcome()
            }
        }
    }

    override fun render(delta: Float) {
        // Clear screen
        Gdx.gl.glClearColor(0f, 0f, 0f, 1f)
        Gdx.gl.glClear(GL20.GL_COLOR_BUFFER_BIT)

        camera.update()
        batch.projectionMatrix = camera.combined

        // Update fade-out animation if active
        updateFadeOut(delta)

        // Update components
        updateComponents(delta)

        // Handle input
        handleInput()

        // Draw everything
        drawComponents()

        // Play welcome audio (once, after first few frames render)
        playWelcomeMessage()
    }

    /**
     * Update all component animations
     */
    private fun updateComponents(delta: Float) {
        stars.update(delta)
        decorations.update(delta)
        titleLine1.update(delta)
        titleLine2.update(delta)
        titleLine3.update(delta)
        settingsButton.update(delta)
        letterPopTile.update(delta)

        // Update button decorations (orbiting crowns)
        for (decoration in buttonDecorations) {
            decoration.time += delta * decoration.speed
        }

        // Update idle animations
        updateSettingsButtonBounce(delta)
        updateGameTileFloat(delta)
    }

    /**
     * Handle touch input for buttons and debug icon
     */
    private fun handleInput() {
        if (transitioning) return

        if (Gdx.input.isTouched) {
            val touchPos = Vector2(Gdx.input.x.toFloat(), Gdx.input.y.toFloat())
            val worldPos = viewport.unproject(touchPos)

            if (Gdx.input.justTouched()) {
                // Touch down - check which button was pressed
                settingsButton.handleTouchDown(worldPos.x, worldPos.y)
                letterPopTile.handleTouchDown(worldPos.x, worldPos.y)

                // Check debug icon click
                if (worldPos.x >= debugIconX && worldPos.x <= debugIconX + debugIconSize &&
                    worldPos.y >= debugIconY && worldPos.y <= debugIconY + debugIconSize) {
                    Gdx.app.log("MainMenuScreen", "Debug icon (magnifying glass) clicked!")
                    AudioManager.playBubblePop()
                }
            }
        } else {
            // Touch released - complete the click if button was pressed
            val touchPos = Vector2(Gdx.input.x.toFloat(), Gdx.input.y.toFloat())
            val worldPos = viewport.unproject(touchPos)

            settingsButton.handleTouchUp(worldPos.x, worldPos.y)
            letterPopTile.handleTouchUp(worldPos.x, worldPos.y)
        }
    }

    /**
     * Draw all visual components
     */
    private fun drawComponents() {
        batch.begin()

        // Apply fade-out alpha if transitioning
        if (fadeOut) {
            batch.setColor(1f, 1f, 1f, fadeAlpha)
        }

        // Draw in correct z-order (back to front)
        background.draw(batch)
        stars.draw(batch)
        decorations.draw(batch)

        // Draw title
        titleLine1.draw(batch)
        titleLine2.draw(batch)
        titleLine3.draw(batch)

        // Draw interactive elements
        settingsButton.draw(batch)
        letterPopTile.draw(batch)

        // Draw button decorations (orbiting crowns around Letter Pop button)
        val buttonCenterX = responsive.centerX
        val buttonCenterY = responsive.getY(40f)

        for (decoration in buttonDecorations) {
            // Calculate orbital motion
            val orbitX = kotlin.math.cos(decoration.time * decoration.orbitSpeed) * decoration.orbitRadius
            val orbitY = kotlin.math.sin(decoration.time * decoration.orbitSpeed) * decoration.orbitRadius

            // Calculate position relative to button center
            val x = buttonCenterX + decoration.offsetX + orbitX
            val y = buttonCenterY + decoration.offsetY + orbitY

            // Calculate pulsing scale (0.95 to 1.05)
            val pulse = 1f + kotlin.math.sin(decoration.time * 3f) * 0.05f
            val scaledSize = decoration.size * pulse

            // Calculate rotation for spinning effect (reduced speed for ADHD concerns)
            val rotation = decoration.time * 15f  // Slower rotation (was 30f)

            val prevColor = batch.color.cpy()
            batch.setColor(1f, 1f, 1f, 0.9f)

            // Draw with rotation
            batch.draw(
                decoration.texture,
                x - scaledSize / 2f,
                y - scaledSize / 2f,
                scaledSize / 2f,  // origin X
                scaledSize / 2f,  // origin Y
                scaledSize,
                scaledSize,
                1f,  // scale X
                1f,  // scale Y
                rotation,
                0,  // source X
                0,  // source Y
                decoration.texture.width,
                decoration.texture.height,
                false,
                false
            )
            batch.color = prevColor
        }

        // Draw debug icon (just the icon, no button background)
        batch.draw(debugIconTexture, debugIconX, debugIconY, debugIconSize, debugIconSize)

        // Reset color
        if (fadeOut) {
            batch.setColor(1f, 1f, 1f, 1f)
        }

        batch.end()
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

    override fun hide() {
        // Screen is being hidden
    }

    override fun dispose() {
        Gdx.app.log("MainMenuScreen", "Disposing resources")

        batch.dispose()
        background.dispose()
        stars.dispose()
        decorations.dispose()
        titleLine1.dispose()
        titleLine2.dispose()
        titleLine3.dispose()
        settingsButton.dispose()
        letterPopTile.dispose()
        // debugIconTexture is managed by Assets, don't dispose here
    }
}
