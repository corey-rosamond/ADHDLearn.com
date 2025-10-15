package com.aurora.reading

import android.os.Bundle
import com.badlogic.gdx.backends.android.AndroidApplication
import com.badlogic.gdx.backends.android.AndroidApplicationConfiguration
import com.aurora.reading.core.ReadingGame
import com.aurora.reading.bubblepop.BubblePopGame

class AndroidLauncher : AndroidApplication() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        val config = AndroidApplicationConfiguration().apply {
            useImmersiveMode = true
            useAccelerometer = false
            useCompass = false
        }
        // Start with Bubble Pop game
        val game = ReadingGame(BubblePopGame())
        initialize(game, config)
    }
}
