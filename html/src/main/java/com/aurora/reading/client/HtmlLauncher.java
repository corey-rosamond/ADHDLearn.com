package com.aurora.reading.client;

import com.badlogic.gdx.ApplicationListener;
import com.badlogic.gdx.Game;
import com.badlogic.gdx.backends.gwt.GwtApplication;
import com.badlogic.gdx.backends.gwt.GwtApplicationConfiguration;
import com.aurora.reading.core.ReadingGame;
import com.aurora.reading.core.screens.LoadingScreen;
import com.aurora.reading.core.screens.MainMenuScreen;

/**
 * HTML5/GWT launcher for Aurora's Reading Adventure
 *
 * Compiles the Kotlin game to JavaScript for web deployment
 */
public class HtmlLauncher extends GwtApplication {

    @Override
    public GwtApplicationConfiguration getConfig() {
        // Target resolution: 2560x1600 scaled down for web performance
        // Using half resolution to maintain 16:10 aspect ratio
        int width = 1280;  // Half of 2560
        int height = 800;  // Half of 1600

        GwtApplicationConfiguration cfg = new GwtApplicationConfiguration(width, height);
        cfg.disableAudio = false;
        return cfg;
    }

    @Override
    public ApplicationListener createApplicationListener() {
        // ReadingGame will initialize with LoadingScreen in its create() method
        return new ReadingGame();
    }
}
