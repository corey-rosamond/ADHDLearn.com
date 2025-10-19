# Phase 2.7.7: Letter Pop Menu Screen - UML Architecture

## Overview

This document defines the architecture for the Letter Pop Menu Screen using Mermaid diagrams. It shows component relationships, data flow, and the overall system structure.

---

## Class Diagram

```mermaid
classDiagram
    class LetterPopMenuScreen {
        -Game game
        -OrthographicCamera camera
        -FitViewport viewport
        -SpriteBatch batch
        -GradientBackground background
        -TitleText titleText
        -BalloonIcon balloonIcon
        -FloatingDecorations decorations
        -Slider timeSlider
        -CaseSelector caseSelector
        -Button startButton
        -Button backButton
        -Preferences prefs
        -boolean transitioning
        -float fadeAlpha
        +show()
        +render(delta)
        +handleInput()
        +startGame()
        +navigateToMainMenu()
        +dispose()
    }

    class CaseSelector {
        -float x
        -float y
        -String selectedValue
        -List~CaseOption~ options
        -Map~String,Texture~ buttonTextures
        -List~Rectangle~ buttonRects
        -int hoveredIndex
        -float[] hoverScales
        -BitmapFont labelFont
        -BitmapFont optionLabelFont
        -BitmapFont optionDescFont
        +handleTouchDown(x, y) boolean
        +handleTouchUp(x, y)
        +handleHover(x, y)
        +update(delta)
        +draw(batch)
        +getValue() String
        +setValue(value)
        +dispose()
    }

    class CaseOption {
        +String value
        +String label
        +String description
    }

    class Slider {
        -float x
        -float y
        -String label
        -int minValue
        -int maxValue
        -int currentValue
        -Texture barBgTexture
        -Texture barFgTexture
        -float handleX
        -boolean isDragging
        +handleTouchDown(x, y) boolean
        +handleTouchDragged(x, y)
        +handleTouchUp(x, y)
        +update(delta)
        +draw(batch)
        +getValue() int
        +setValue(value)
    }

    class GradientBackground {
        -Texture texture
        +draw(batch)
        +dispose()
    }

    class TitleText {
        -String text
        -BitmapFont font
        -float animationProgress
        +update(delta)
        +draw(batch)
        +dispose()
    }

    class BalloonIcon {
        -float x
        -float y
        -float size
        -boolean animated
        -float bobOffset
        +update(delta)
        +draw(batch)
        +dispose()
    }

    class FloatingDecorations {
        -List~Decoration~ decorations
        +update(delta)
        +draw(batch)
        +dispose()
    }

    class Button {
        -float x
        -float y
        -Texture texture
        -String text
        -boolean pressed
        +handleTouchDown(x, y) boolean
        +handleTouchUp(x, y)
        +update(delta)
        +draw(batch)
        +dispose()
    }

    class MainMenuScreen {
        +show()
        +render(delta)
        +dispose()
    }

    LetterPopMenuScreen --> GradientBackground
    LetterPopMenuScreen --> TitleText
    LetterPopMenuScreen --> BalloonIcon
    LetterPopMenuScreen --> FloatingDecorations
    LetterPopMenuScreen --> Slider
    LetterPopMenuScreen --> CaseSelector
    LetterPopMenuScreen --> Button
    LetterPopMenuScreen --> MainMenuScreen
    CaseSelector --> CaseOption
    CaseSelector --> FontManager
    CaseSelector --> ThemeConfig
    CaseSelector --> AudioManager
```

---

## Component Relationship Diagram

```mermaid
graph TB
    subgraph "Letter Pop Menu Screen"
        LPM[LetterPopMenuScreen]

        subgraph "Visual Components"
            BG[GradientBackground<br/>Purple→Orange]
            TITLE[TitleText<br/>LETTER POP]
            BALLOON[BalloonIcon<br/>Animated]
            DECO[FloatingDecorations<br/>8 icons]
        end

        subgraph "Interactive Components"
            TIME[Slider<br/>Time: 5-15s]
            CASE[CaseSelector<br/>ABC/abc/Abc]
            START[Button<br/>START GAME]
            BACK[Button<br/>← BACK]
        end

        subgraph "Services"
            PREFS[Preferences<br/>Settings Storage]
            AUDIO[AudioManager<br/>Sound Effects]
            FONT[FontManager<br/>Text Rendering]
        end
    end

    subgraph "Navigation"
        MAIN[MainMenuScreen]
        GAME[LetterPopGameScreen<br/>Phase 2.7.8]
    end

    LPM --> BG
    LPM --> TITLE
    LPM --> BALLOON
    LPM --> DECO
    LPM --> TIME
    LPM --> CASE
    LPM --> START
    LPM --> BACK

    TIME --> PREFS
    CASE --> PREFS
    START --> AUDIO
    BACK --> AUDIO

    TITLE --> FONT
    TIME --> FONT
    CASE --> FONT

    BACK --> MAIN
    START -.-> GAME

    style LPM fill:#9C27B0,color:#fff
    style BG fill:#673AB7,color:#fff
    style TITLE fill:#673AB7,color:#fff
    style BALLOON fill:#673AB7,color:#fff
    style DECO fill:#673AB7,color:#fff
    style TIME fill:#4CAF50,color:#fff
    style CASE fill:#4CAF50,color:#fff
    style START fill:#FF9800,color:#fff
    style BACK fill:#4CAF50,color:#fff
    style PREFS fill:#2196F3,color:#fff
    style AUDIO fill:#2196F3,color:#fff
    style FONT fill:#2196F3,color:#fff
    style MAIN fill:#9C27B0,color:#fff
    style GAME fill:#9C27B0,color:#fff
```

---

## Data Flow Diagram

```mermaid
sequenceDiagram
    participant User
    participant LetterPopMenuScreen
    participant TimeSlider
    participant CaseSelector
    participant Preferences
    participant AudioManager
    participant MainMenuScreen
    participant LetterPopGameScreen

    Note over User,LetterPopMenuScreen: Screen Initialization
    User->>LetterPopMenuScreen: Navigate from Main Menu
    LetterPopMenuScreen->>Preferences: Load saved settings
    Preferences-->>LetterPopMenuScreen: timePerRound=10, letterCase=uppercase
    LetterPopMenuScreen->>TimeSlider: Create with value 10
    LetterPopMenuScreen->>CaseSelector: Create with value "uppercase"

    Note over User,LetterPopMenuScreen: Adjust Time Setting
    User->>TimeSlider: Drag handle to 12 seconds
    TimeSlider->>LetterPopMenuScreen: onValueChange(12)
    LetterPopMenuScreen->>Preferences: putInteger("timePerRound", 12)
    Preferences->>Preferences: flush()

    Note over User,LetterPopMenuScreen: Change Letter Case
    User->>CaseSelector: Click "abc" (lowercase)
    CaseSelector->>AudioManager: playCorrect()
    CaseSelector->>LetterPopMenuScreen: onValueChange("lowercase")
    LetterPopMenuScreen->>Preferences: putString("letterCase", "lowercase")
    Preferences->>Preferences: flush()

    Note over User,LetterPopMenuScreen: Start Game
    User->>LetterPopMenuScreen: Click "START GAME"
    LetterPopMenuScreen->>AudioManager: playCorrect()
    LetterPopMenuScreen->>Preferences: Read final settings
    LetterPopMenuScreen->>LetterPopGameScreen: Navigate (Phase 2.7.8)

    Note over User,LetterPopMenuScreen: Navigate Back
    User->>LetterPopMenuScreen: Click "← BACK"
    LetterPopMenuScreen->>AudioManager: playCorrect()
    LetterPopMenuScreen->>MainMenuScreen: Navigate with fade
```

---

## Screen Layout Diagram (2560x1600)

```mermaid
graph TB
    subgraph "Letter Pop Menu Screen Layout"
        subgraph "Top Section (80-95%)"
            BALLOON_ZONE["🎈 Balloon Icon<br/>@ 92% from bottom<br/>Animated bounce"]
            TITLE_ZONE["LETTER POP Title<br/>@ 80% from bottom<br/>Yellow text, purple border"]
        end

        subgraph "Settings Section (40-55%)"
            TIME_ZONE["Time Per Round: [5-15s]<br/>@ 55% from bottom<br/>Slider with yellow→orange gradient"]
            CASE_ZONE["Letter Case: [ABC] [abc] [Abc]<br/>@ 40% from bottom<br/>Radio buttons, green=selected"]
        end

        subgraph "Button Section (10-20%)"
            START_ZONE["START GAME Button<br/>@ 20% from bottom<br/>Orange, centered"]
            BACK_ZONE["← BACK Button<br/>@ 10% from bottom<br/>Green, centered"]
        end

        subgraph "Background"
            BG_ZONE["Purple→Orange Gradient<br/>Smooth vertical transition"]
            DECO_ZONE["8 Floating Decorations<br/>Bugs, flowers, food items"]
        end
    end

    style BALLOON_ZONE fill:#E91E63,color:#fff
    style TITLE_ZONE fill:#9C27B0,color:#fff
    style TIME_ZONE fill:#4CAF50,color:#fff
    style CASE_ZONE fill:#4CAF50,color:#fff
    style START_ZONE fill:#FF9800,color:#fff
    style BACK_ZONE fill:#4CAF50,color:#fff
    style BG_ZONE fill:#673AB7,color:#fff
    style DECO_ZONE fill:#FFC107,color:#000
```

---

## CaseSelector State Machine

```mermaid
stateDiagram-v2
    [*] --> Uppercase: Initial State

    Uppercase --> Lowercase: Click "abc"
    Uppercase --> Mixed: Click "Abc"

    Lowercase --> Uppercase: Click "ABC"
    Lowercase --> Mixed: Click "Abc"

    Mixed --> Uppercase: Click "ABC"
    Mixed --> Lowercase: Click "abc"

    Uppercase --> [*]: Save & Navigate
    Lowercase --> [*]: Save & Navigate
    Mixed --> [*]: Save & Navigate

    note right of Uppercase
        Background: Green
        Label: ABC
        Description: Uppercase
        Saved: "uppercase"
    end note

    note right of Lowercase
        Background: Green
        Label: abc
        Description: Lowercase
        Saved: "lowercase"
    end note

    note right of Mixed
        Background: Green
        Label: Abc
        Description: Mixed
        Saved: "mixed"
    end note
```

---

## Preferences Storage Schema

```mermaid
erDiagram
    PREFERENCES {
        int timePerRound "5-15 seconds, default 10"
        string letterCase "uppercase|lowercase|mixed, default uppercase"
    }

    LETTER_POP_MENU ||--|| PREFERENCES : reads_writes

    note "Preferences file: aurora-reading-letterpop"
    note "Storage: libGDX Preferences API"
    note "Location: Android SharedPreferences"
```

---

## Touch Input Flow

```mermaid
flowchart TD
    START[User Touch Event]
    UNPROJECT[Unproject to World Coords]

    CHECK_START{Touch in<br/>START button?}
    CHECK_BACK{Touch in<br/>BACK button?}
    CHECK_TIME{Touch in<br/>Time Slider?}
    CHECK_CASE{Touch in<br/>Case Selector?}

    START_ACTION[Play sound<br/>Navigate to Game]
    BACK_ACTION[Play sound<br/>Navigate to Main Menu]
    TIME_ACTION[Update slider<br/>Save to prefs]
    CASE_ACTION[Select option<br/>Play sound<br/>Save to prefs]

    NO_ACTION[No action]

    START --> UNPROJECT
    UNPROJECT --> CHECK_START

    CHECK_START -->|Yes| START_ACTION
    CHECK_START -->|No| CHECK_BACK

    CHECK_BACK -->|Yes| BACK_ACTION
    CHECK_BACK -->|No| CHECK_TIME

    CHECK_TIME -->|Yes| TIME_ACTION
    CHECK_TIME -->|No| CHECK_CASE

    CHECK_CASE -->|Yes| CASE_ACTION
    CHECK_CASE -->|No| NO_ACTION

    START_ACTION --> END[Touch Handled]
    BACK_ACTION --> END
    TIME_ACTION --> END
    CASE_ACTION --> END
    NO_ACTION --> END

    style START fill:#2196F3,color:#fff
    style START_ACTION fill:#FF9800,color:#fff
    style BACK_ACTION fill:#4CAF50,color:#fff
    style TIME_ACTION fill:#4CAF50,color:#fff
    style CASE_ACTION fill:#4CAF50,color:#fff
    style NO_ACTION fill:#9E9E9E,color:#fff
    style END fill:#2196F3,color:#fff
```

---

## Component Lifecycle

```mermaid
sequenceDiagram
    participant Game
    participant LetterPopMenuScreen
    participant Components
    participant Preferences

    Note over Game: User navigates to<br/>Letter Pop Menu

    Game->>LetterPopMenuScreen: show()

    LetterPopMenuScreen->>LetterPopMenuScreen: Create camera, viewport, batch
    LetterPopMenuScreen->>Preferences: Load settings
    LetterPopMenuScreen->>Components: Create all components
    Components-->>LetterPopMenuScreen: Components initialized

    loop Every Frame
        Game->>LetterPopMenuScreen: render(delta)
        LetterPopMenuScreen->>Components: update(delta)
        LetterPopMenuScreen->>LetterPopMenuScreen: handleInput()
        LetterPopMenuScreen->>Components: draw(batch)
    end

    Note over Game: User navigates away

    Game->>LetterPopMenuScreen: dispose()
    LetterPopMenuScreen->>Components: dispose()
    Components->>Components: Free textures, fonts
    LetterPopMenuScreen->>LetterPopMenuScreen: Free batch, camera
```

---

## Animation Timeline

```mermaid
gantt
    title Letter Pop Menu Screen Animations
    dateFormat X
    axisFormat %L ms

    section Screen Load
    Title Bounce In       :a1, 0, 600
    Balloon Pop In        :a2, 100, 500
    Decorations Fade In   :a3, 200, 400

    section Continuous
    Balloon Bob           :a4, 600, 3000
    Decorations Float     :a5, 600, 3000

    section Interactions
    Slider Drag           :a6, 1000, 500
    Case Hover            :a7, 1500, 150
    Button Press          :a8, 2000, 200

    section Navigation
    Fade Out              :a9, 2500, 300
```

---

## Memory Management

```mermaid
graph LR
    subgraph "Allocated on show()"
        BATCH[SpriteBatch]
        CAMERA[OrthographicCamera]
        VIEWPORT[FitViewport]
        PREFS[Preferences]
    end

    subgraph "Component Textures"
        BG_TEX[Background Gradient]
        TITLE_TEX[Title Font Texture]
        BALLOON_TEX[Balloon Shapes]
        SLIDER_TEX[Slider Bar Textures]
        CASE_TEX[Case Button Textures x3]
        BTN_TEX[Button Textures x2]
        DECO_TEX[Decoration Sprites]
    end

    subgraph "Disposed on dispose()"
        BATCH --> DISPOSE_BATCH[batch.dispose]
        BG_TEX --> DISPOSE_BG[background.dispose]
        TITLE_TEX --> DISPOSE_TITLE[titleText.dispose]
        BALLOON_TEX --> DISPOSE_BALLOON[balloonIcon.dispose]
        SLIDER_TEX --> DISPOSE_SLIDER[timeSlider.dispose]
        CASE_TEX --> DISPOSE_CASE[caseSelector.dispose]
        BTN_TEX --> DISPOSE_BTN[buttons.dispose]
        DECO_TEX --> DISPOSE_DECO[decorations.dispose]
    end

    style BATCH fill:#2196F3,color:#fff
    style CAMERA fill:#2196F3,color:#fff
    style VIEWPORT fill:#2196F3,color:#fff
    style BG_TEX fill:#FF9800,color:#fff
    style TITLE_TEX fill:#FF9800,color:#fff
    style BALLOON_TEX fill:#FF9800,color:#fff
    style SLIDER_TEX fill:#FF9800,color:#fff
    style CASE_TEX fill:#FF9800,color:#fff
    style BTN_TEX fill:#FF9800,color:#fff
    style DECO_TEX fill:#FF9800,color:#fff
    style DISPOSE_BATCH fill:#4CAF50,color:#fff
    style DISPOSE_BG fill:#4CAF50,color:#fff
    style DISPOSE_TITLE fill:#4CAF50,color:#fff
    style DISPOSE_BALLOON fill:#4CAF50,color:#fff
    style DISPOSE_SLIDER fill:#4CAF50,color:#fff
    style DISPOSE_CASE fill:#4CAF50,color:#fff
    style DISPOSE_BTN fill:#4CAF50,color:#fff
    style DISPOSE_DECO fill:#4CAF50,color:#fff
```

---

## Architecture Summary

### New Components
1. **CaseSelector** - Radio button-style selector for letter case
   - Three options: Uppercase, Lowercase, Mixed
   - Visual feedback (green = selected, purple = unselected)
   - Hover effects and animations
   - Persistence callback

### Reused Components
2. **Slider** - Time limit selector (from Phase 2.7.6)
3. **GradientBackground** - Purple→Orange (from Phase 2.7.4)
4. **TitleText** - Animated title (from Phase 2.7.4)
5. **BalloonIcon** - Animated balloon (from Phase 2.7.5)
6. **FloatingDecorations** - Visual polish (from Phase 2.7.6)
7. **Button** - Start and Back buttons (from Phase 2.7.4)

### Services
- **FontManager** - Font rendering
- **AudioManager** - Sound effects
- **Preferences** - Settings persistence
- **ResponsiveUtils** - Layout calculations
- **ThemeConfig** - Color palette

### Navigation
- **← BACK** → MainMenuScreen (Phase 2.7.5)
- **START GAME** → LetterPopGameScreen (Phase 2.7.8 - placeholder)

---

**Created:** 2025-10-19
**Status:** Ready for Implementation
