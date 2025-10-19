# Phase 2.7.6: Settings Screen - Architecture & UML

## Overview

This document defines the architecture for the Settings Screen implementation, including the new Slider component and its integration with existing systems.

---

## Component Hierarchy

```mermaid
graph TD
    A[SettingsScreen] -->|contains| B[GradientBackground]
    A -->|contains| C[TitleText]
    A -->|contains| D[FloatingDecorations]
    A -->|contains| E[Slider x3]
    A -->|contains| F[Button - Back]
    A -->|uses| G[AudioManager]
    A -->|uses| H[Preferences]
    A -->|uses| I[ResponsiveUtils]

    E -->|updates| G
    E -->|saves to| H

    style A fill:#9b59b6
    style E fill:#3498db
    style G fill:#e74c3c
    style H fill:#f39c12
```

---

## Class Diagram: Slider Component

```mermaid
classDiagram
    class Slider {
        -x: Float
        -y: Float
        -label: String
        -minValue: Int
        -maxValue: Int
        -currentValue: Int
        -suffix: String
        -barWidth: Float
        -barHeight: Float
        -handleX: Float
        -handleY: Float
        -isDragging: Boolean
        -isHovering: Boolean
        -handleScale: Float
        -barBgTexture: Texture
        -barFgTexture: Texture
        -onValueChange: (Int) -> Unit

        +Slider(x, y, label, minValue, maxValue, initialValue, suffix, onValueChange)
        +handleTouchDown(touchX, touchY): Boolean
        +handleTouchDragged(touchX, touchY): Void
        +handleTouchUp(): Void
        +handleHover(touchX, touchY): Void
        +update(delta): Void
        +draw(batch): Void
        +getValue(): Int
        +setValue(value): Void
        +dispose(): Void
        -createBarTextures(): Void
        -updateForegroundTexture(): Void
        -updateValue(): Void
        -drawHandle(batch): Void
    }

    class ResponsiveUtils {
        +scaleX(value): Float
        +scaleY(value): Float
        +getX(percentage): Float
        +getY(percentage): Float
        +getFontSize(size): Int
    }

    class ThemeConfig {
        +Colors: Colors
        +Fonts: Fonts
    }

    class FontManager {
        +getFont(size): BitmapFont
    }

    Slider --> ResponsiveUtils: uses
    Slider --> ThemeConfig: uses colors
    Slider --> FontManager: uses fonts
```

---

## Class Diagram: SettingsScreen

```mermaid
classDiagram
    class SettingsScreen {
        -game: Game
        -camera: OrthographicCamera
        -viewport: FitViewport
        -batch: SpriteBatch
        -responsive: ResponsiveUtils
        -background: GradientBackground
        -titleText: TitleText
        -decorations: FloatingDecorations
        -masterSlider: Slider
        -voiceSlider: Slider
        -soundSlider: Slider
        -backButton: Button
        -prefs: Preferences
        -transitioning: Boolean
        -fadeOut: Boolean
        -fadeAlpha: Float
        -fadeTime: Float
        -nextScreen: Screen

        +show(): Void
        +render(delta): Void
        +resize(width, height): Void
        +pause(): Void
        +resume(): Void
        +hide(): Void
        +dispose(): Void
        -createBackground(): Void
        -createTitle(): Void
        -createDecorations(): Void
        -createSliders(): Void
        -createBackButton(): Void
        -applyVolumeSettings(): Void
        -navigateToMainMenu(): Void
        -startFadeOut(screen): Void
        -updateFadeOut(delta): Void
        -handleInput(): Void
    }

    class Screen {
        <<interface>>
        +show(): Void
        +render(delta): Void
        +resize(width, height): Void
        +pause(): Void
        +resume(): Void
        +hide(): Void
        +dispose(): Void
    }

    class GradientBackground {
        +draw(batch): Void
        +dispose(): Void
    }

    class TitleText {
        +update(delta): Void
        +draw(batch): Void
        +dispose(): Void
    }

    class FloatingDecorations {
        +update(delta): Void
        +draw(batch): Void
        +dispose(): Void
    }

    class Button {
        +handleTouchDown(x, y): Boolean
        +handleTouchUp(): Void
        +update(delta): Void
        +draw(batch): Void
        +dispose(): Void
    }

    class AudioManager {
        <<singleton>>
        +setMasterVolume(volume): Void
        +setVoiceVolume(volume): Void
        +setSoundVolume(volume): Void
        +playCorrect(): Void
    }

    class Preferences {
        <<libGDX>>
        +getInteger(key, default): Int
        +putInteger(key, value): Void
        +flush(): Void
    }

    SettingsScreen ..|> Screen
    SettingsScreen --> GradientBackground
    SettingsScreen --> TitleText
    SettingsScreen --> FloatingDecorations
    SettingsScreen --> Slider
    SettingsScreen --> Button
    SettingsScreen --> AudioManager
    SettingsScreen --> Preferences
```

---

## Sequence Diagram: Volume Slider Interaction

```mermaid
sequenceDiagram
    participant User
    participant SettingsScreen
    participant Slider
    participant Preferences
    participant AudioManager

    User->>Slider: drag handle
    Slider->>Slider: updateValue()
    Slider->>Slider: updateForegroundTexture()
    Slider->>SettingsScreen: onValueChange(75)
    SettingsScreen->>Preferences: putInteger("masterVolume", 75)
    SettingsScreen->>Preferences: flush()
    SettingsScreen->>SettingsScreen: applyVolumeSettings()
    SettingsScreen->>Preferences: getInteger("masterVolume")
    Preferences-->>SettingsScreen: 75
    SettingsScreen->>AudioManager: setMasterVolume(0.75)
    AudioManager->>AudioManager: masterVolume = 0.75
    Note over User,AudioManager: Volume applied immediately
```

---

## Sequence Diagram: Settings Screen Load

```mermaid
sequenceDiagram
    participant MainMenu
    participant Game
    participant SettingsScreen
    participant Preferences
    participant AudioManager
    participant Components

    MainMenu->>Game: setScreen(SettingsScreen)
    Game->>SettingsScreen: show()
    SettingsScreen->>Preferences: getPreferences("aurora-reading-settings")
    Preferences-->>SettingsScreen: prefs instance
    SettingsScreen->>Components: createBackground()
    SettingsScreen->>Components: createTitle()
    SettingsScreen->>Components: createDecorations()
    SettingsScreen->>SettingsScreen: createSliders()
    SettingsScreen->>Preferences: getInteger("masterVolume", 100)
    Preferences-->>SettingsScreen: 100
    SettingsScreen->>Preferences: getInteger("voiceVolume", 100)
    Preferences-->>SettingsScreen: 100
    SettingsScreen->>Preferences: getInteger("soundVolume", 100)
    Preferences-->>SettingsScreen: 100
    SettingsScreen->>Components: create Slider x3
    SettingsScreen->>SettingsScreen: applyVolumeSettings()
    SettingsScreen->>AudioManager: setMasterVolume(1.0)
    SettingsScreen->>AudioManager: setVoiceVolume(1.0)
    SettingsScreen->>AudioManager: setSoundVolume(1.0)
    SettingsScreen->>Components: createBackButton()
    Note over SettingsScreen: Settings loaded with saved values
```

---

## Sequence Diagram: Back Button Navigation

```mermaid
sequenceDiagram
    participant User
    participant SettingsScreen
    participant Button
    participant AudioManager
    participant Game
    participant MainMenu

    User->>Button: tap back button
    Button->>SettingsScreen: onClick()
    SettingsScreen->>SettingsScreen: navigateToMainMenu()
    SettingsScreen->>AudioManager: playCorrect()
    AudioManager->>AudioManager: play sound at current volume
    SettingsScreen->>SettingsScreen: startFadeOut(MainMenuScreen)
    SettingsScreen->>SettingsScreen: transitioning = true

    loop every frame for 0.3s
        SettingsScreen->>SettingsScreen: updateFadeOut(delta)
        SettingsScreen->>SettingsScreen: fadeAlpha -= delta/0.3
    end

    SettingsScreen->>Game: setScreen(MainMenuScreen)
    Game->>MainMenu: show()
    SettingsScreen->>SettingsScreen: dispose()
    Note over User,MainMenu: Smooth fade to Main Menu
```

---

## State Diagram: Slider Interaction

```mermaid
stateDiagram-v2
    [*] --> Idle
    Idle --> Hovering: mouse over handle
    Hovering --> Idle: mouse out
    Hovering --> Dragging: mouse down
    Idle --> Dragging: click on bar
    Dragging --> Idle: mouse up

    state Idle {
        [*] --> Normal
        Normal: handleScale = 1.0
    }

    state Hovering {
        [*] --> Scaled
        Scaled: handleScale = 1.2
    }

    state Dragging {
        [*] --> Active
        Active: update handleX
        Active: update value
        Active: update texture
        Active: call onValueChange
    }
```

---

## Component Integration Flow

```mermaid
flowchart TD
    A[User Opens App] --> B[Load Preferences]
    B --> C{Settings Exist?}
    C -->|Yes| D[Load Saved Values]
    C -->|No| E[Use Defaults 100%]
    D --> F[Create Sliders with Values]
    E --> F
    F --> G[Apply to AudioManager]
    G --> H[Render Settings Screen]

    H --> I{User Interaction}
    I -->|Drag Slider| J[Update Value]
    J --> K[Save to Preferences]
    K --> L[Update AudioManager]
    L --> M[Play Test Sound]
    M --> H

    I -->|Click Back| N[Fade Out]
    N --> O[Navigate to Main Menu]
    O --> P[Dispose Screen]
    P --> Q[Return to Main Menu]
```

---

## Data Flow: Volume Settings

```mermaid
flowchart LR
    A[User Drags Slider] --> B[Slider.handleTouchDragged]
    B --> C[Slider.updateValue]
    C --> D[onValueChange callback]
    D --> E[SettingsScreen saves]
    E --> F[Preferences.putInteger]
    F --> G[Preferences.flush]

    D --> H[SettingsScreen.applyVolumeSettings]
    H --> I[Preferences.getInteger x3]
    I --> J[AudioManager.setMasterVolume]
    I --> K[AudioManager.setVoiceVolume]
    I --> L[AudioManager.setSoundVolume]

    J --> M[Audio Plays at New Volume]
    K --> M
    L --> M

    style A fill:#3498db
    style F fill:#f39c12
    style M fill:#2ecc71
```

---

## Memory Management

```mermaid
flowchart TD
    A[SettingsScreen.show] --> B[Allocate Resources]
    B --> C[Create Textures]
    B --> D[Create Fonts]
    B --> E[Create Components]

    C --> F[Slider barBgTexture]
    C --> G[Slider barFgTexture]
    C --> H[Handle texture per frame]

    D --> I[Label Font]
    D --> J[Value Font]

    E --> K[Background]
    E --> L[Title]
    E --> M[Decorations]
    E --> N[Button]

    O[SettingsScreen.dispose] --> P[Dispose All]
    P --> Q[batch.dispose]
    P --> R[background.dispose]
    P --> S[titleText.dispose]
    P --> T[decorations.dispose]
    P --> U[masterSlider.dispose]
    P --> V[voiceSlider.dispose]
    P --> W[soundSlider.dispose]
    P --> X[backButton.dispose]

    U --> Y[Dispose Textures]
    V --> Y
    W --> Y

    style A fill:#2ecc71
    style O fill:#e74c3c
    style Y fill:#95a5a6
```

---

## Performance Considerations

### Slider Optimization

1. **Texture Caching**
   - Bar background texture created once
   - Foreground texture regenerated only on value change
   - Handle texture created per frame (TODO: optimize with cached texture atlas)

2. **Update Strategy**
   - Only update when value changes
   - Use delta time for smooth scale animations
   - Batch all drawing in single pass

3. **Input Handling**
   - Early return if not dragging/hovering
   - Coerce values to valid ranges
   - Use viewport unprojection once per frame

### Memory Profile

| Component | Texture Count | Est. Size | Disposable |
|-----------|---------------|-----------|------------|
| Slider (x3) | 6 static + 3 dynamic | ~50KB | ✅ Yes |
| Background | 1 | ~25KB | ✅ Yes |
| Title | 1 | ~15KB | ✅ Yes |
| Decorations | 8 | ~80KB | ✅ Yes |
| Button | 1 | ~10KB | ✅ Yes |
| **Total** | **~19 textures** | **~180KB** | **All** |

---

## Architecture Principles

1. **Component Reusability**
   - Slider component can be used in other screens
   - Settings persistence pattern can be reused
   - Fade transition system is screen-agnostic

2. **Separation of Concerns**
   - Slider handles UI rendering and interaction
   - SettingsScreen handles persistence and navigation
   - AudioManager handles audio playback
   - Preferences handles data storage

3. **Single Responsibility**
   - Each component has one clear purpose
   - Slider: interactive value selection
   - SettingsScreen: coordinate components and settings
   - AudioManager: audio playback control

4. **Dependency Injection**
   - Game instance passed to screen
   - Callbacks used for value changes
   - No static dependencies (except AudioManager singleton)

---

## File Structure

```
core/src/main/kotlin/com/aurora/reading/core/
├── components/
│   ├── Button.kt              # ✅ Reused from 2.7.4
│   ├── FloatingDecorations.kt # ✅ Reused from 2.7.5
│   ├── GradientBackground.kt  # ✅ Reused from 2.7.4
│   ├── Slider.kt              # 🆕 New in 2.7.6
│   └── TitleText.kt           # ✅ Reused from 2.7.4
├── screens/
│   ├── MainMenuScreen.kt      # ✅ From 2.7.5
│   └── SettingsScreen.kt      # 🔄 Replace stub
├── services/
│   ├── AudioManager.kt        # 🔄 Add volume methods
│   └── FontManager.kt         # ✅ Reused from 2.7.4
├── config/
│   └── ThemeConfig.kt         # ✅ Reused
└── utils/
    └── ResponsiveUtils.kt     # ✅ Reused
```

---

**Created:** October 18, 2025
**Status:** Architecture Defined
**Dependencies:** Phase 2.7.5 ✅
