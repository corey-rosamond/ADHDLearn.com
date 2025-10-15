package com.aurora.reading.core

import com.badlogic.gdx.Game
import com.badlogic.gdx.Gdx
import com.badlogic.gdx.Screen
import com.badlogic.gdx.graphics.GL20

class ReadingGame(private val initialScreen: Screen) : Game() {

    override fun create() {
        Gdx.app.log("ReadingGame", "Game created!")
        setScreen(initialScreen)
    }

    override fun render() {
        Gdx.gl.glClearColor(0.15f, 0.15f, 0.2f, 1f)
        Gdx.gl.glClear(GL20.GL_COLOR_BUFFER_BIT)
        super.render()
    }

    override fun dispose() {
        super.dispose()
    }
}
