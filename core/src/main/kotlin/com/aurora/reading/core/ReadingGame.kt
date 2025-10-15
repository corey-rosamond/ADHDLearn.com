package com.aurora.reading.core

import com.badlogic.gdx.Game
import com.badlogic.gdx.Gdx
import com.badlogic.gdx.Screen
import com.badlogic.gdx.graphics.GL20
import com.aurora.reading.core.assets.Assets
import com.aurora.reading.core.screens.LoadingScreen

class ReadingGame(private val gameScreen: Screen) : Game() {

    override fun create() {
        Gdx.app.log("ReadingGame", "Game created!")

        // Start with loading screen
        setScreen(LoadingScreen(this, gameScreen))
    }

    override fun render() {
        Gdx.gl.glClearColor(0.15f, 0.15f, 0.2f, 1f)
        Gdx.gl.glClear(GL20.GL_COLOR_BUFFER_BIT)
        super.render()
    }

    override fun dispose() {
        Assets.dispose()
        super.dispose()
    }
}
