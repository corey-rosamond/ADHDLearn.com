package com.aurora.reading.core

import com.badlogic.gdx.Game
import com.badlogic.gdx.Gdx
import com.badlogic.gdx.graphics.GL20
import com.aurora.reading.core.assets.Assets
import com.aurora.reading.core.screens.LoadingScreen
import com.aurora.reading.core.screens.MainMenuScreen
import com.aurora.reading.core.services.FontManager

class ReadingGame : Game() {

    override fun create() {
        Gdx.app.log("ReadingGame", "Game created!")

        // Initialize FontManager for crisp text rendering
        FontManager.init()

        // Start with loading screen, which will transition to Main Menu
        setScreen(LoadingScreen(this, MainMenuScreen(this)))
    }

    override fun render() {
        Gdx.gl.glClearColor(0.15f, 0.15f, 0.2f, 1f)
        Gdx.gl.glClear(GL20.GL_COLOR_BUFFER_BIT)
        super.render()
    }

    override fun dispose() {
        FontManager.dispose()
        Assets.dispose()
        super.dispose()
    }
}
