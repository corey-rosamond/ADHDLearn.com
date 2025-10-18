# Phase 2.7.5: Main Menu Screen - UML Architecture

## Overview

This document provides architectural diagrams for the Main Menu screen implementation using libGDX Screen architecture with reusable UI components from Phase 2.7.4.

---

## 1. Class Diagram

### Main Menu Screen and Components

```mermaid
classDiagram
    class Screen {
        <<interface>>
        +show() void
        +render(delta: Float) void
        +resize(width: Int, height: Int) void
        +hide() void
        +pause() void
        +resume() void
        +dispose() void
    }

    class MainMenuScreen {
        -game: ReadingGame
        -camera: OrthographicCamera
        -viewport: FitViewport
        -stage: Stage
        -responsive: ResponsiveUtils
        -audioManager: AudioManager
        -background: GradientBackground
        -title: TitleText
        -stars: FloatingStars
        -settingsButton: Button
        -letterPopTile: GameTile
        +show() void
        +render(delta: Float) void
        +resize(width: Int, height: Int) void
        +hide() void
        +dispose() void
        -createBackground() void
        -createTitle() void
        -createFloatingStars() void
        -createSettingsButton() void
        -createGameTiles() void
        -navigateToSettings() void
        -navigateToLetterPop() void
        -playWelcomeMessage() void
    }

    class GameTile {
        -responsive: ResponsiveUtils
        -title: String
        -icon: String
        -description: String
        -onClick: Function
        -tileSize: Float
        -background: Image
        -iconLabel: Label
        -titleLabel: Label
        -shapeRenderer: ShapeRenderer
        +GameTile(responsive, title, icon, description, onClick)
        -createBackground() void
        -createIcon() void
        -createTitle() void
        -setupInteraction() void
        -addFloatAnimation() void
        +dispose() void
    }

    class GradientBackground {
        -responsive: ResponsiveUtils
        -colors: Array~Color~
        -texture: Texture
        -image: Image
        +GradientBackground(responsive, ...colors)
        -createGradientTexture() Texture
        +act(delta: Float) void
        +dispose() void
    }

    class Button {
        -responsive: ResponsiveUtils
        -text: String
        -onClick: Function
        -background: Image
        -label: Label
        -isEnabled: Boolean
        +Button(responsive, text, x, y, width, height, colors, onClick)
        -setupInteraction() void
        +addBounceAnimation(offset, duration) void
        +enable() void
        +disable() void
        +dispose() void
    }

    class TitleText {
        -responsive: ResponsiveUtils
        -lines: List~String~
        -labels: List~Label~
        -colors: Array~Color~
        +TitleText(responsive, lines, startY, lineSpacing)
        -createTextWithStroke() void
        -addBounceAnimation() void
        +skipAnimation() void
        +resetAnimation() void
        +dispose() void
    }

    class FloatingStars {
        -responsive: ResponsiveUtils
        -stars: List~Star~
        -starTextures: Array~Texture~
        -STAR_COUNT: Int = 30
        +FloatingStars(responsive)
        -createStarTexture(color) Texture
        -spawnStars() void
        +act(delta: Float) void
        +dispose() void
    }

    class ResponsiveUtils {
        -viewport: Viewport
        -baseWidth: Float = 1920f
        -baseHeight: Float = 1200f
        +centerX: Float
        +centerY: Float
        +getX(percentage: Float) Float
        +getY(percentage: Float) Float
        +scaleX(value: Float) Float
        +scaleY(value: Float) Float
        +getFontSize(baseSize: Float) Int
    }

    class AudioManager {
        <<singleton>>
        -instance: AudioManager
        -voiceVolume: Float
        -soundVolume: Float
        -musicVolume: Float
        +getInstance() AudioManager
        +playVoice(key: String) void
        +playSound(key: String) void
        +playMusic(key: String) void
        +stopAll() void
    }

    class ThemeConfig {
        <<object>>
        +PURPLE_MAGIC: Color
        +BUBBLE_PINK: Color
        +ORANGE_POP: Color
        +SUNSHINE_YELLOW: Color
        +PURE_WHITE: Color
        +getFont(size: Int) BitmapFont
        +Animations: Object
    }

    class ReadingGame {
        +setScreen(screen: Screen) void
    }

    Screen <|.. MainMenuScreen
    MainMenuScreen --> ReadingGame : uses
    MainMenuScreen --> GradientBackground : contains
    MainMenuScreen --> TitleText : contains
    MainMenuScreen --> FloatingStars : contains
    MainMenuScreen --> Button : contains
    MainMenuScreen --> GameTile : contains
    MainMenuScreen --> ResponsiveUtils : uses
    MainMenuScreen --> AudioManager : uses
    MainMenuScreen --> ThemeConfig : uses
    GameTile --> ResponsiveUtils : uses
    GameTile --> ThemeConfig : uses
    GradientBackground --> ResponsiveUtils : uses
    GradientBackground --> ThemeConfig : uses
    Button --> ResponsiveUtils : uses
    Button --> ThemeConfig : uses
    TitleText --> ResponsiveUtils : uses
    TitleText --> ThemeConfig : uses
    FloatingStars --> ResponsiveUtils : uses
    FloatingStars --> ThemeConfig : uses
```

---

## 2. Sequence Diagram: Screen Initialization

### Main Menu Show Flow

```mermaid
sequenceDiagram
    participant App as ReadingGame
    participant MM as MainMenuScreen
    participant BG as GradientBackground
    participant Title as TitleText
    participant Stars as FloatingStars
    participant Btn as Button
    participant Tile as GameTile
    participant Audio as AudioManager
    participant Stage as Stage

    App->>MM: setScreen(MainMenuScreen)
    activate MM

    MM->>MM: show()
    MM->>Stage: set as input processor

    MM->>BG: new GradientBackground(responsive, PURPLE, PINK)
    activate BG
    BG->>BG: createGradientTexture()
    BG-->>MM: background instance
    deactivate BG
    MM->>Stage: addActor(background)

    MM->>Title: new TitleText(responsive, ["AURORA'S", "READING", "ADVENTURE"])
    activate Title
    Title->>Title: createTextWithStroke()
    Title->>Title: addBounceAnimation()
    Title-->>MM: title instance
    deactivate Title
    MM->>Stage: addActor(title)

    MM->>Stars: new FloatingStars(responsive)
    activate Stars
    Stars->>Stars: spawnStars()
    Stars-->>MM: stars instance
    deactivate Stars
    MM->>Stage: addActor(stars)

    MM->>Btn: new Button(responsive, "⚙️", x, y, onClick)
    activate Btn
    Btn->>Btn: setupInteraction()
    Btn->>Btn: addBounceAnimation()
    Btn-->>MM: settingsButton instance
    deactivate Btn
    MM->>Stage: addActor(settingsButton)

    MM->>Tile: new GameTile(responsive, "Letter Pop", "🎈", onClick)
    activate Tile
    Tile->>Tile: createBackground()
    Tile->>Tile: createIcon()
    Tile->>Tile: createTitle()
    Tile->>Tile: setupInteraction()
    Tile->>Tile: addFloatAnimation()
    Tile-->>MM: letterPopTile instance
    deactivate Tile
    MM->>Stage: addActor(letterPopTile)

    MM->>Audio: getInstance()
    Audio-->>MM: audioManager instance
    MM->>Audio: playVoice("welcome")

    deactivate MM
```

---

## 3. Sequence Diagram: Navigation Flow

### Settings Button Click

```mermaid
sequenceDiagram
    participant User
    participant Btn as Button
    participant MM as MainMenuScreen
    participant Stage as Stage
    participant App as ReadingGame
    participant Settings as SettingsScreen

    User->>Btn: touch down
    Btn->>Btn: scale to 0.9x (click animation)
    Btn->>MM: onClick callback
    activate MM

    MM->>Stage: addAction(fadeOut 0.3s)
    Stage->>Stage: animate alpha 1.0 → 0.0

    Note over Stage: Wait 300ms for fade

    Stage->>MM: fade complete callback
    MM->>MM: dispose()
    MM->>App: setScreen(SettingsScreen)
    deactivate MM

    activate Settings
    App->>Settings: show()
    Settings->>Settings: create UI
    deactivate Settings
```

### Game Tile Click

```mermaid
sequenceDiagram
    participant User
    participant Tile as GameTile
    participant MM as MainMenuScreen
    participant Stage as Stage
    participant App as ReadingGame
    participant Menu as LetterPopMenuScreen

    User->>Tile: touch down
    Tile->>Tile: scale to 0.95x (click animation)
    Tile->>Tile: scale back to 1.0x
    Tile->>MM: onClick callback
    activate MM

    MM->>Stage: addAction(fadeOut 0.3s)
    Stage->>Stage: animate alpha 1.0 → 0.0

    Note over Stage: Wait 300ms for fade

    Stage->>MM: fade complete callback
    MM->>MM: dispose()
    MM->>App: setScreen(LetterPopMenuScreen)
    deactivate MM

    activate Menu
    App->>Menu: show()
    Menu->>Menu: create UI
    deactivate Menu
```

---

## 4. Component Hierarchy Diagram

### UI Layout Structure

```mermaid
graph TD
    A[MainMenuScreen] --> B[Stage]
    B --> C[GradientBackground]
    B --> D[FloatingStars]
    B --> E[TitleText]
    B --> F[Button: Settings]
    B --> G[GameTile: Letter Pop]

    C --> C1[Texture: Gradient Purple→Pink]
    C --> C2[Image]

    D --> D1[30 Star Actors]
    D1 --> D2[Random positions]
    D1 --> D3[Float animations]
    D1 --> D4[Alpha pulsing]

    E --> E1[Label: AURORA'S]
    E --> E2[Label: READING]
    E --> E3[Label: ADVENTURE]
    E1 --> E4[Bounce-in animation]
    E2 --> E4
    E3 --> E4

    F --> F1[Image: Background]
    F --> F2[Label: ⚙️]
    F --> F3[Bounce animation]
    F --> F4[Click listener]

    G --> G1[Image: boxBg.png]
    G --> G2[Label: 🎈 icon]
    G --> G3[Label: Letter Pop title]
    G --> G4[Float animation]
    G --> G5[Click listener]

    style A fill:#e1bee7,stroke:#8e24aa
    style B fill:#c5cae9,stroke:#5c6bc0
    style C fill:#b2dfdb,stroke:#00897b
    style D fill:#ffccbc,stroke:#ff5722
    style E fill:#fff9c4,stroke:#fbc02d
    style F fill:#ffccbc,stroke:#ff6f00
    style G fill:#c5e1a5,stroke:#558b2f
```

---

## 5. State Diagram: MainMenuScreen Lifecycle

```mermaid
stateDiagram-v2
    [*] --> Creating: ReadingGame.setScreen()

    Creating --> Showing: show() called
    Showing --> Active: All components created

    Active --> Rendering: render() loop
    Rendering --> Active: delta update

    Active --> Paused: pause() or hide()
    Paused --> Active: resume()

    Active --> Transitioning: Navigation triggered
    Transitioning --> Disposing: Fade complete
    Disposing --> [*]: dispose() complete

    note right of Creating
        Constructor initializes
        camera, viewport, stage
    end note

    note right of Showing
        - Create background
        - Create title
        - Create stars
        - Create buttons
        - Play welcome audio
    end note

    note right of Active
        All interactive elements
        respond to touch input
    end note

    note right of Rendering
        60 FPS render loop
        - Update animations
        - Draw stage
    end note

    note right of Transitioning
        Fade out animation
        playing (300ms)
    end note
```

---

## 6. Data Flow Diagram: Touch Input Processing

```mermaid
flowchart TD
    A[User Touch] --> B{Hit Test}
    B -->|Settings Button| C[Button.onClick]
    B -->|Game Tile| D[GameTile.onClick]
    B -->|Background| E[No Action]

    C --> F[Play click animation]
    F --> G[MainMenuScreen.navigateToSettings]
    G --> H[Stage.fadeOut]
    H --> I[ReadingGame.setScreen: SettingsScreen]
    I --> J[MainMenuScreen.dispose]

    D --> K[Play click animation]
    K --> L[MainMenuScreen.navigateToLetterPop]
    L --> M[Stage.fadeOut]
    M --> N[ReadingGame.setScreen: LetterPopMenuScreen]
    N --> O[MainMenuScreen.dispose]

    style A fill:#bbdefb,stroke:#1976d2
    style C fill:#c8e6c9,stroke:#388e3c
    style D fill:#c8e6c9,stroke:#388e3c
    style E fill:#ffccbc,stroke:#e64a19
    style J fill:#f8bbd0,stroke:#c2185b
    style O fill:#f8bbd0,stroke:#c2185b
```

---

## 7. Memory Management Diagram

### Resource Lifecycle

```mermaid
graph LR
    A[MainMenuScreen.show] --> B[Create Resources]
    B --> C[GradientBackground creates Texture]
    B --> D[FloatingStars creates 2 Textures]
    B --> E[Stage manages Actors]

    F[MainMenuScreen.dispose] --> G[Dispose Components]
    G --> H[GradientBackground.dispose]
    G --> I[FloatingStars.dispose]
    G --> J[Stage.dispose]

    H --> K[Texture.dispose]
    I --> L[Texture.dispose x2]
    J --> M[All Actors removed]

    style A fill:#c8e6c9,stroke:#388e3c
    style F fill:#ffcdd2,stroke:#d32f2f
    style K fill:#ffcdd2,stroke:#d32f2f
    style L fill:#ffcdd2,stroke:#d32f2f
    style M fill:#ffcdd2,stroke:#d32f2f
```

---

## 8. Component Interaction Diagram

### Responsive Positioning

```mermaid
graph TD
    A[MainMenuScreen] --> B[ResponsiveUtils]
    B --> C[Viewport: 1920x1200 base]

    D[TitleText] --> B
    E[Button] --> B
    F[GameTile] --> B

    B --> G[getX: Convert % to screen X]
    B --> H[getY: Convert % to screen Y]
    B --> I[scaleX/Y: Scale values proportionally]
    B --> J[getFontSize: Calculate responsive font]

    G --> K[TitleText positioned at centerX]
    H --> L[TitleText positioned at 18% from top]
    I --> M[Button size: scaled 100x100]
    J --> N[Title font: scaled 96px]

    style B fill:#e1bee7,stroke:#8e24aa
    style C fill:#c5cae9,stroke:#5c6bc0
```

---

## Key Architectural Patterns

### 1. **Screen Pattern** (libGDX)
- MainMenuScreen implements `Screen` interface
- Manages lifecycle: show → render loop → dispose
- Handles resize events for responsive layout

### 2. **Composition over Inheritance**
- MainMenuScreen composes components (background, title, stars)
- Each component is independent and reusable
- No deep inheritance hierarchies

### 3. **Dependency Injection**
- ResponsiveUtils injected into all components
- AudioManager singleton accessed explicitly
- ThemeConfig provides shared constants

### 4. **Observer Pattern** (libGDX Actions)
- Buttons use click listeners (callbacks)
- Animations use action sequences with completion callbacks
- Decouples UI events from business logic

### 5. **Singleton Pattern**
- AudioManager: One instance manages all audio
- ThemeConfig: Shared configuration object

### 6. **Object Pooling** (Future optimization)
- FloatingStars could pool star actors
- Particles could reuse textures
- Current implementation prioritizes clarity

---

## Performance Characteristics

| Component | Memory | GPU Calls | Complexity |
|-----------|--------|-----------|------------|
| GradientBackground | ~256KB texture | 1 draw call | O(1) |
| FloatingStars | ~512KB (2 textures) | 30 draw calls | O(n) |
| TitleText | Minimal (BitmapFont) | 3 draw calls | O(1) |
| Button | Minimal | 2 draw calls | O(1) |
| GameTile | Minimal | 3 draw calls | O(1) |
| **Total** | **~768KB** | **~40 draw calls** | **60 FPS target** |

**Expected FPS:** 60 (locked)
**Touch Latency:** <20ms
**Memory Footprint:** <1MB for screen

---

## Testing Considerations

### Unit Testing Targets
- Component positioning (ResponsiveUtils calculations)
- Animation timing (bounce, fade durations)
- Memory cleanup (dispose methods)

### Integration Testing Targets
- Touch input routing (buttons and tiles clickable)
- Screen transitions (fade animations complete)
- Audio playback (welcome message plays)

### Visual Testing Targets
- Layout at 2560x1600 (Tab S7 FE)
- Component scaling (responsive sizing)
- Animation smoothness (60 FPS)

---

**Status:** Ready for Implementation
**Dependencies:** Phase 2.7.4 components ✅
**Created:** October 16, 2025
