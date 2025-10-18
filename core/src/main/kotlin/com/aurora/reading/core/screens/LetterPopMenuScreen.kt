package com.aurora.reading.core.screens

import com.badlogic.gdx.Game
import com.badlogic.gdx.Gdx
import com.badlogic.gdx.Screen
import com.badlogic.gdx.graphics.Color
import com.badlogic.gdx.graphics.GL20
import com.badlogic.gdx.graphics.OrthographicCamera
import com.badlogic.gdx.graphics.g2d.SpriteBatch
import com.badlogic.gdx.utils.viewport.FitViewport
import com.aurora.reading.core.components.GradientBackground
import com.aurora.reading.core.components.TitleText
import com.aurora.reading.core.config.ThemeConfig
import com.aurora.reading.core.utils.ResponsiveUtils

/**
 * Letter Pop Menu Screen (Stub)
 *
 * Placeholder screen for Phase 2.7.5 navigation testing.
 * Full implementation in Phase 2.7.7.
 */
class LetterPopMenuScreen(private val game: Game) : Screen {

    private lateinit var camera: OrthographicCamera
    private lateinit var viewport: FitViewport
    private lateinit var batch: SpriteBatch
    private val responsive = ResponsiveUtils()

    private lateinit var background: GradientBackground
    private lateinit var titleText: TitleText

    override fun show() {
        Gdx.app.log("LetterPopMenuScreen", "Letter Pop menu stub loaded")

        camera = OrthographicCamera()
        viewport = FitViewport(ResponsiveUtils.WORLD_WIDTH, ResponsiveUtils.WORLD_HEIGHT, camera)
        batch = SpriteBatch()

        // Simple gradient background
        background = GradientBackground(
            ResponsiveUtils.WORLD_WIDTH,
            ResponsiveUtils.WORLD_HEIGHT,
            arrayOf(ThemeConfig.Colors.PURPLE, ThemeConfig.Colors.ORANGE)
        )

        // Title
        titleText = TitleText(
            text = "LETTER POP",
            x = responsive.centerX,
            y = responsive.getY(50f),
            fontSize = responsive.getFontSize(72),
            textColor = ThemeConfig.Colors.STAR_YELLOW,
            borderColor = ThemeConfig.Colors.PURPLE,
            borderWidth = responsive.scaleX(0.31f),
            bounceIn = true
        )

        Gdx.app.log("LetterPopMenuScreen", "TODO: Implement time slider and case selector (Phase 2.7.7)")
    }

    override fun render(delta: Float) {
        Gdx.gl.glClearColor(0f, 0f, 0f, 1f)
        Gdx.gl.glClear(GL20.GL_COLOR_BUFFER_BIT)

        camera.update()
        batch.projectionMatrix = camera.combined

        titleText.update(delta)

        batch.begin()
        background.draw(batch)
        titleText.draw(batch)
        batch.end()
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
    }
}
