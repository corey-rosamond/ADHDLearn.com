# Phase 2.7.5: Main Menu Screen - Implementation Plan

## Overview

Port the Main Menu scene from Phaser to Kotlin/libGDX, creating a polished entry point for Aurora's Reading Adventure. This screen serves as the game's home, featuring a vibrant design with animated elements and intuitive navigation to game modes.

**Phaser Reference:** `archive/phaser-web/src/scenes/MainMenuScene.js`

## Objectives

1. Create MainMenuScreen with libGDX Screen interface
2. Reuse existing components (GradientBackground, TitleText, FloatingStars, Button)
3. Implement multi-line animated title with rainbow colors
4. Add Settings button with bounce animation
5. Create game selection tile for Letter Pop
6. Integrate AudioManager for welcome message
7. Handle touch input for all interactive elements
8. Implement screen transitions

## Components to Reuse

✅ **Already Built (Phase 2.7.4):**
- `GradientBackground` - Purple → Pink gradient
- `TitleText` - Multi-line title with effects
- `FloatingStars` - Decorative star animations
- `Button` - Interactive button with animations
- `ResponsiveUtils` - Responsive positioning
- `ThemeConfig` - Color palette and constants
- `AudioManager` - Sound and voice playback

## Implementation Tasks

### Task 1: Create MainMenuScreen Class

**File:** `core/src/main/kotlin/com/aurora/reading/core/screens/MainMenuScreen.kt`

```kotlin
package com.aurora.reading.core.screens

import com.aurora.reading.core.ReadingGame
import com.aurora.reading.core.components.*
import com.aurora.reading.core.utils.ResponsiveUtils
import com.aurora.reading.core.config.ThemeConfig
import com.aurora.reading.core.services.AudioManager
import com.badlogic.gdx.Screen
import com.badlogic.gdx.graphics.OrthographicCamera
import com.badlogic.gdx.scenes.scene2d.Stage
import com.badlogic.gdx.scenes.scene2d.ui.Table
import com.badlogic.gdx.utils.viewport.FitViewport
import com.badlogic.gdx.Gdx
import com.badlogic.gdx.utils.Disposable

class MainMenuScreen(private val game: ReadingGame) : Screen, Disposable {
    private val camera = OrthographicCamera()
    private val viewport = FitViewport(1920f, 1200f, camera)
    private val stage = Stage(viewport)
    private val responsive = ResponsiveUtils(viewport)
    private val audioManager = AudioManager.getInstance()

    // Components
    private lateinit var background: GradientBackground
    private lateinit var title: TitleText
    private lateinit var stars: FloatingStars
    private lateinit var settingsButton: Button
    private lateinit var letterPopTile: GameTile

    override fun show() {
        Gdx.input.inputProcessor = stage
        createBackground()
        createTitle()
        createFloatingStars()
        createSettingsButton()
        createGameTiles()
        playWelcomeMessage()
    }

    private fun createBackground() {
        background = GradientBackground(
            responsive,
            ThemeConfig.PURPLE_MAGIC,
            ThemeConfig.BUBBLE_PINK
        )
        stage.addActor(background)
    }

    private fun createTitle() {
        title = TitleText(
            responsive,
            listOf("AURORA'S", "READING", "ADVENTURE"),
            startY = responsive.getY(18f),
            lineSpacing = responsive.scaleY(100f)
        )
        stage.addActor(title)
    }

    private fun createFloatingStars() {
        stars = FloatingStars(responsive)
        stage.addActor(stars)
    }

    private fun createSettingsButton() {
        // Implementation in Task 2
    }

    private fun createGameTiles() {
        // Implementation in Task 3
    }

    private fun playWelcomeMessage() {
        audioManager.playVoice("welcome")
    }

    override fun render(delta: Float) {
        background.act(delta)
        stars.act(delta)
        stage.act(delta)
        stage.draw()
    }

    override fun resize(width: Int, height: Int) {
        viewport.update(width, height, true)
    }

    override fun hide() {
        // Pause animations
    }

    override fun pause() {}
    override fun resume() {}

    override fun dispose() {
        background.dispose()
        stars.dispose()
        stage.dispose()
    }
}
```

**Acceptance Criteria:**
- [ ] Screen renders with gradient background
- [ ] Title displays with 3 lines
- [ ] Stars animate in background
- [ ] Welcome message plays on show()
- [ ] Screen responds to resize events

---

### Task 2: Create Settings Button with Animation

```kotlin
private fun createSettingsButton() {
    settingsButton = Button(
        responsive,
        text = "⚙️", // Gear emoji
        x = responsive.getX(92f),
        y = responsive.getY(8f),
        width = responsive.scaleX(100f),
        height = responsive.scaleY(100f),
        backgroundColor = ThemeConfig.ORANGE_POP,
        textColor = ThemeConfig.PURE_WHITE,
        onClick = { navigateToSettings() }
    )

    // Add idle bounce animation
    settingsButton.addBounceAnimation(
        yOffset = responsive.scaleY(-8f),
        duration = 1.2f
    )

    stage.addActor(settingsButton)
}

private fun navigateToSettings() {
    // Transition to Settings screen
    game.setScreen(SettingsScreen(game))
}
```

**Acceptance Criteria:**
- [ ] Button positioned in top-right corner
- [ ] Gear emoji centered in button
- [ ] Idle bounce animation plays continuously
- [ ] Hover effect scales button to 1.15x
- [ ] Click navigates to Settings screen

---

### Task 3: Create Game Tile Component

**File:** `core/src/main/kotlin/com/aurora/reading/core/components/GameTile.kt`

```kotlin
package com.aurora.reading.core.components

import com.aurora.reading.core.utils.ResponsiveUtils
import com.aurora.reading.core.config.ThemeConfig
import com.badlogic.gdx.scenes.scene2d.Group
import com.badlogic.gdx.scenes.scene2d.ui.Image
import com.badlogic.gdx.scenes.scene2d.ui.Label
import com.badlogic.gdx.scenes.scene2d.InputEvent
import com.badlogic.gdx.scenes.scene2d.utils.ClickListener
import com.badlogic.gdx.graphics.g2d.Batch
import com.badlogic.gdx.graphics.glutils.ShapeRenderer
import com.badlogic.gdx.math.Interpolation
import com.badlogic.gdx.scenes.scene2d.actions.Actions
import com.badlogic.gdx.utils.Disposable

class GameTile(
    private val responsive: ResponsiveUtils,
    private val title: String,
    private val icon: String,
    private val description: String,
    private val onClick: () -> Unit
) : Group(), Disposable {

    private val tileSize = responsive.scaleX(300f)
    private val shapeRenderer = ShapeRenderer()

    private lateinit var background: Image
    private lateinit var iconLabel: Label
    private lateinit var titleLabel: Label

    init {
        setSize(tileSize, tileSize)
        createBackground()
        createIcon()
        createTitle()
        setupInteraction()
        addFloatAnimation()
    }

    private fun createBackground() {
        // Create rounded rectangle background
        background = Image() // Use boxBg texture
        background.setSize(tileSize, tileSize)
        background.setPosition(0f, 0f)
        addActor(background)
    }

    private fun createIcon() {
        val labelStyle = Label.LabelStyle()
        labelStyle.font = ThemeConfig.getFont(responsive.getFontSize(64f))
        labelStyle.fontColor = ThemeConfig.PURE_WHITE

        iconLabel = Label(icon, labelStyle)
        iconLabel.setPosition(
            tileSize / 2f - iconLabel.width / 2f,
            tileSize / 2f - responsive.scaleY(20f)
        )
        addActor(iconLabel)
    }

    private fun createTitle() {
        val labelStyle = Label.LabelStyle()
        labelStyle.font = ThemeConfig.getFont(responsive.getFontSize(36f))
        labelStyle.fontColor = ThemeConfig.SUNSHINE_YELLOW

        titleLabel = Label(title, labelStyle)
        titleLabel.setPosition(
            tileSize / 2f - titleLabel.width / 2f,
            tileSize / 2f + responsive.scaleY(45f)
        )
        addActor(titleLabel)
    }

    private fun setupInteraction() {
        background.addListener(object : ClickListener() {
            override fun enter(event: InputEvent?, x: Float, y: Float, pointer: Int, fromActor: com.badlogic.gdx.scenes.scene2d.Actor?) {
                // Hover: scale to 1.1x
                addAction(
                    Actions.scaleTo(1.1f, 1.1f, 0.2f, Interpolation.swingOut)
                )
            }

            override fun exit(event: InputEvent?, x: Float, y: Float, pointer: Int, toActor: com.badlogic.gdx.scenes.scene2d.Actor?) {
                // Un-hover: scale back to 1.0x
                addAction(
                    Actions.scaleTo(1.0f, 1.0f, 0.2f, Interpolation.swingIn)
                )
            }

            override fun clicked(event: InputEvent?, x: Float, y: Float) {
                // Click: scale down and trigger onClick
                addAction(
                    Actions.sequence(
                        Actions.scaleTo(0.95f, 0.95f, 0.1f),
                        Actions.scaleTo(1.0f, 1.0f, 0.1f),
                        Actions.run { onClick() }
                    )
                )
            }
        })
    }

    private fun addFloatAnimation() {
        val floatOffset = responsive.scaleY(-10f)
        addAction(
            Actions.forever(
                Actions.sequence(
                    Actions.moveBy(0f, floatOffset, 1.5f, Interpolation.sine),
                    Actions.moveBy(0f, -floatOffset, 1.5f, Interpolation.sine)
                )
            )
        )
    }

    override fun dispose() {
        shapeRenderer.dispose()
    }
}
```

**Usage in MainMenuScreen:**
```kotlin
private fun createGameTiles() {
    letterPopTile = GameTile(
        responsive,
        title = "Letter Pop",
        icon = "🎈",
        description = "Pop bubbles and learn letters!",
        onClick = { navigateToLetterPop() }
    )

    letterPopTile.setPosition(
        responsive.centerX - letterPopTile.width / 2f,
        responsive.getY(60f)
    )

    stage.addActor(letterPopTile)
}

private fun navigateToLetterPop() {
    game.setScreen(LetterPopMenuScreen(game))
}
```

**Acceptance Criteria:**
- [ ] Tile renders as 300x300 square
- [ ] Icon emoji displays centered
- [ ] Title displays below icon in yellow
- [ ] Idle float animation plays
- [ ] Hover scales to 1.1x
- [ ] Click scales to 0.95x then navigates

---

### Task 4: Add Screen Transitions

```kotlin
private fun navigateToSettings() {
    // Fade out current screen
    stage.addAction(
        Actions.sequence(
            Actions.fadeOut(0.3f),
            Actions.run {
                game.setScreen(SettingsScreen(game))
                dispose()
            }
        )
    )
}

private fun navigateToLetterPop() {
    stage.addAction(
        Actions.sequence(
            Actions.fadeOut(0.3f),
            Actions.run {
                game.setScreen(LetterPopMenuScreen(game))
                dispose()
            }
        )
    )
}
```

**Acceptance Criteria:**
- [ ] Screen fades out over 0.3 seconds
- [ ] New screen loads after fade completes
- [ ] Old screen disposes properly
- [ ] No memory leaks

---

### Task 5: Integrate with ReadingGame

**File:** `core/src/main/kotlin/com/aurora/reading/core/ReadingGame.kt`

Update create() method:
```kotlin
override fun create() {
    // Show loading screen first
    setScreen(LoadingScreen(this))
}

// In LoadingScreen, after assets load:
fun onLoadingComplete() {
    game.setScreen(MainMenuScreen(game))
}
```

**Acceptance Criteria:**
- [ ] LoadingScreen shows first
- [ ] MainMenuScreen loads after assets ready
- [ ] No crashes on screen transitions

---

## Testing Checklist

### Visual Tests
- [ ] Gradient background fills entire screen
- [ ] Title displays "AURORA'S / READING / ADVENTURE" in 3 lines
- [ ] Stars float in background (8-12 stars visible)
- [ ] Settings button in top-right with gear emoji
- [ ] Letter Pop tile in center with balloon emoji

### Animation Tests
- [ ] Settings button bounces continuously
- [ ] Game tile floats up and down
- [ ] Stars twinkle and move
- [ ] Title letters have rainbow colors

### Interaction Tests
- [ ] Settings button hover scales to 1.15x
- [ ] Settings button click navigates to Settings screen
- [ ] Game tile hover scales to 1.1x
- [ ] Game tile click navigates to Letter Pop menu
- [ ] All touch targets are responsive

### Audio Tests
- [ ] Welcome message plays on screen show
- [ ] Audio respects volume settings from AudioManager
- [ ] No audio errors in console

### Performance Tests
- [ ] Maintains 60 FPS with all animations
- [ ] Smooth transitions between screens
- [ ] No memory leaks on dispose

---

## Dependencies

**Phase 2.7.4 Components (Required):**
- ✅ GradientBackground
- ✅ TitleText
- ✅ FloatingStars
- ✅ Button
- ✅ ResponsiveUtils
- ✅ ThemeConfig
- ✅ AudioManager

**New Components (To Build):**
- GameTile (Task 3)
- MainMenuScreen (Task 1)

**Assets Required:**
- ✅ boxBg.png (game tile background)
- ✅ btnSetting.png (settings button icon - or use emoji)
- ✅ welcome.ogg (welcome voice message)

---

## Estimated Time

| Task | Time | Priority |
|------|------|----------|
| Task 1: MainMenuScreen setup | 30 min | High |
| Task 2: Settings button | 20 min | High |
| Task 3: GameTile component | 45 min | High |
| Task 4: Screen transitions | 15 min | Medium |
| Task 5: Integration | 10 min | High |
| **Total** | **2 hours** | - |

---

## Success Criteria

**Phase 2.7.5 is complete when:**

1. ✅ MainMenuScreen renders with all components
2. ✅ Title displays in 3 colorful lines
3. ✅ Floating stars animate in background
4. ✅ Settings button navigates to Settings screen
5. ✅ Letter Pop tile navigates to Letter Pop menu
6. ✅ All animations play at 60 FPS
7. ✅ Welcome message plays on screen load
8. ✅ Screen transitions are smooth
9. ✅ All BDD scenarios pass (see GHERKIN.md)
10. ✅ Visual testing protocol complete (see GUARDRAILS.md)

---

## Next Steps

After Phase 2.7.5:
- **Phase 2.7.6:** Settings Screen (volume sliders, back button)
- **Phase 2.7.7:** Letter Pop Menu Screen (time slider, case selector)
- **Phase 2.7.8:** Letter Pop Game Screen (bubbles, physics, scoring)

---

**Status:** READY TO IMPLEMENT
**Created:** 2025-10-16
**Dependencies:** Phase 2.7.4 ✅
**Estimated Completion:** 2 hours
