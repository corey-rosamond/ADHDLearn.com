# Phase 6: Letter Pop - Scene Setup - UML

## Class Diagram

```mermaid
classDiagram
    class LetterPopScene {
        -Graphics background
        -Text titleText
        -Text subtitleText
        -Rectangle backButtonBg
        -Text backButtonText
        -Sound buttonClickSound
        +constructor()
        +preload()
        +create()
        +createBackground()
        +createTitle()
        +createBackButton()
        +handleBackButtonHover()
        +handleBackButtonOut()
        +handleBackButtonClick()
    }

    class MainMenuScene {
        +constructor()
        +create()
        +createStartButton()
    }

    class PhaserScene {
        <<Phaser.Scene>>
        +add
        +load
        +sound
        +tweens
        +scene
        +cameras
    }

    class BackButton {
        -Rectangle background
        -Text label
        -Boolean isHovered
        -Number defaultScale
        -Number hoverScale
        +setInteractive()
        +on(event, callback)
    }

    PhaserScene <|-- LetterPopScene
    PhaserScene <|-- MainMenuScene
    LetterPopScene --> BackButton : creates
    LetterPopScene ..> MainMenuScene : transitions to
    MainMenuScene ..> LetterPopScene : transitions to
```

## Sequence Diagram: Scene Flow

```mermaid
sequenceDiagram
    actor User
    participant MainMenu as MainMenuScene
    participant Game as Phaser Game
    participant LetterPop as LetterPopScene
    participant Graphics as Graphics System
    participant Button as Back Button

    User->>MainMenu: Click START button
    MainMenu->>Game: scene.start('LetterPopScene')
    Game->>LetterPop: Create scene

    LetterPop->>LetterPop: preload()
    LetterPop->>LetterPop: create()

    LetterPop->>Graphics: createBackground()
    Graphics-->>LetterPop: Gradient background

    LetterPop->>LetterPop: createTitle()
    LetterPop-->>User: Display "Letter Pop!" title

    LetterPop->>Button: createBackButton()
    Button-->>User: Display back button

    User->>Button: Click back button
    Button->>LetterPop: pointerdown event
    LetterPop->>Game: scene.start('MainMenuScene')
    Game->>MainMenu: Create scene
    MainMenu-->>User: Display main menu
```

## Sequence Diagram: Back Button Interaction

```mermaid
sequenceDiagram
    actor User
    participant Button as Back Button
    participant Scene as LetterPopScene
    participant Audio as AudioManager
    participant Tweens as Tween System
    participant Game as Scene Manager

    User->>Button: Hover over button
    Button->>Scene: pointerover event
    Scene->>Tweens: Scale up (1.0 → 1.1)
    Tweens-->>Button: Animate
    Button-->>User: Visual feedback

    User->>Button: Move away
    Button->>Scene: pointerout event
    Scene->>Tweens: Scale down (1.1 → 1.0)
    Tweens-->>Button: Animate

    User->>Button: Click button
    Button->>Scene: pointerdown event
    Scene->>Audio: play('buttonClick')
    Audio-->>User: Play sound
    Scene->>Tweens: Scale down (1.0 → 0.95 → 1.0)
    Tweens->>Scene: onComplete callback
    Scene->>Game: scene.start('MainMenuScene')
    Game-->>User: Return to main menu
```

## State Diagram: Scene States

```mermaid
stateDiagram-v2
    [*] --> Inactive: Scene Registered
    Inactive --> Loading: scene.start() called
    Loading --> Preloading: preload() runs
    Preloading --> Creating: create() runs
    Creating --> BuildingBackground: createBackground()
    BuildingBackground --> AddingTitle: createTitle()
    AddingTitle --> AddingButton: createBackButton()
    AddingButton --> Active: Scene Ready

    Active --> ButtonIdle: Waiting for input
    ButtonIdle --> ButtonHovered: Mouse over
    ButtonHovered --> ButtonIdle: Mouse out
    ButtonHovered --> ButtonPressed: Click
    ButtonPressed --> Transitioning: Animation complete
    Transitioning --> Inactive: Return to MainMenu
```

## Scene Transition Diagram

```mermaid
graph TB
    MainMenu[MainMenuScene<br/>Active] --> |User clicks START| TransitionOut1{Transition}
    TransitionOut1 --> StopMain[Stop MainMenuScene]
    StopMain --> StartLetter[Start LetterPopScene]
    StartLetter --> LetterActive[LetterPopScene<br/>Active]

    LetterActive --> |User clicks Back| TransitionOut2{Transition}
    TransitionOut2 --> StopLetter[Stop LetterPopScene]
    StopLetter --> StartMain[Start MainMenuScene]
    StartMain --> MainMenu

    style MainMenu fill:#90EE90
    style LetterActive fill:#87CEEB
    style TransitionOut1 fill:#FFD700
    style TransitionOut2 fill:#FFD700
```

## UI Component Hierarchy

```mermaid
graph TB
    LetterPop[LetterPopScene]
    LetterPop --> BG[Background Layer]
    LetterPop --> UI[UI Layer]

    BG --> Gradient[Gradient Graphics]
    Gradient --> Color1[Sky Blue #87CEEB]
    Gradient --> Color2[Turquoise #00CED1]

    UI --> Title[Title Text]
    UI --> Subtitle[Subtitle Text]
    UI --> ButtonGroup[Back Button Group]

    Title --> TitleStyle[Font: 64px Bold<br/>Color: White<br/>Stroke: Blue]
    Subtitle --> SubStyle[Font: 24px<br/>Color: White<br/>Stroke: Blue]

    ButtonGroup --> BtnBG[Button Background<br/>Rectangle]
    ButtonGroup --> BtnText[Button Text<br/>"< Menu"]
    ButtonGroup --> BtnInteractive[Interactive Area]

    BtnInteractive --> Events[Event Handlers]
    Events --> Hover[pointerover/out]
    Events --> Click[pointerdown]

    Hover --> ScaleTween[Scale Animation]
    Click --> ClickSequence[Click Sequence]

    ClickSequence --> PlaySound[Play Sound]
    ClickSequence --> PressAnim[Press Animation]
    ClickSequence --> SceneChange[Start MainMenuScene]

    style LetterPop fill:#E6E6FA
    style BG fill:#87CEEB
    style UI fill:#98FB98
    style ButtonGroup fill:#FFB6C1
```

## Activity Diagram: Scene Creation

```mermaid
flowchart TD
    Start([scene.start called]) --> Preload{preload}
    Preload -->|Check| HasSound{Sound loaded?}
    HasSound -->|No| LoadSound[Load buttonClick]
    HasSound -->|Yes| SkipLoad[Skip loading]
    LoadSound --> Create
    SkipLoad --> Create

    Create[create method] --> BG[createBackground]
    BG --> DrawGradient[Draw gradient lines]
    DrawGradient --> Complete1{Complete?}
    Complete1 -->|Yes| Title[createTitle]
    Complete1 -->|No| DrawGradient

    Title --> AddMainTitle[Add 'Letter Pop!' text]
    AddMainTitle --> AddSubtitle[Add subtitle text]
    AddSubtitle --> Button[createBackButton]

    Button --> CreateRect[Create button rectangle]
    CreateRect --> CreateText[Create button text]
    CreateText --> SetInteractive[Set interactive]
    SetInteractive --> RegisterEvents[Register event handlers]
    RegisterEvents --> SceneReady([Scene Active])

    style Start fill:#90EE90
    style SceneReady fill:#FFD700
```

## Component Interaction Diagram

```mermaid
graph LR
    User[User Input] --> |Hover| Button[Back Button]
    User --> |Click| Button

    Button --> |pointerover| Handler1[Hover Handler]
    Button --> |pointerout| Handler2[Out Handler]
    Button --> |pointerdown| Handler3[Click Handler]

    Handler1 --> TweenMgr[Tween Manager]
    Handler2 --> TweenMgr
    Handler3 --> AudioMgr[Audio Manager]
    Handler3 --> TweenMgr
    Handler3 --> SceneMgr[Scene Manager]

    TweenMgr --> |Scale Animation| Visual[Visual Feedback]
    AudioMgr --> |Play Sound| Audio[Audio Output]
    SceneMgr --> |Transition| MainMenu[MainMenuScene]

    Visual --> Screen[Display]
    MainMenu --> Screen
```

## Data Flow Diagram

```mermaid
flowchart LR
    A[LetterPopScene.create] --> B[Initialize Graphics]
    B --> C[Define Color Array]
    C --> D[Get Canvas Dimensions]

    D --> E[Loop Through Pixels]
    E --> F[Calculate Color Interpolation]
    F --> G[Draw Gradient Line]
    G --> H{More Lines?}
    H -->|Yes| E
    H -->|No| I[Background Complete]

    I --> J[Create Title Text]
    J --> K[Apply Text Styling]
    K --> L[Position Title]

    L --> M[Create Button Rectangle]
    M --> N[Create Button Text]
    N --> O[Set Interactive Zone]
    O --> P[Register Event Listeners]

    P --> Q[Scene Ready for Input]
```

## Layout Diagram

```mermaid
graph TD
    Canvas[Canvas 800x600]

    Canvas --> BackBtn["Back Button<br/>(100, 50)<br/>150x60"]
    Canvas --> Title["Letter Pop!<br/>(400, 80)<br/>Centered"]
    Canvas --> Subtitle["Subtitle<br/>(400, 140)<br/>Centered"]
    Canvas --> GameArea["Game Area<br/>(center)<br/>For future bubbles"]

    BackBtn --> BtnPos["Top-Left Position<br/>Easy to find<br/>Consistent placement"]
    Title --> TitlePos["Top-Center<br/>First thing seen<br/>Clear hierarchy"]
    GameArea --> GamePos["Center 200-500<br/>Plenty of space<br/>Visual focus"]

    style Canvas fill:#F0F0F0
    style BackBtn fill:#ff6b6b
    style Title fill:#ffffff,stroke:#0066cc
    style GameArea fill:#87CEEB
```

## Background Creation Algorithm

```mermaid
flowchart TD
    Start([Start createBackground]) --> Init[Create Graphics Object]
    Init --> DefineColors["Define Color Array<br/>[Sky Blue, Turquoise]"]
    DefineColors --> GetHeight[Get Canvas Height]
    GetHeight --> InitLoop[i = 0]

    InitLoop --> Loop{i < height?}
    Loop -->|Yes| CalcProgress["progress = i / height"]
    CalcProgress --> Interpolate["Interpolate between<br/>color[0] and color[1]"]
    Interpolate --> Convert[Convert to RGB]
    Convert --> SetFill[Set fillStyle to color]
    SetFill --> DrawRect["fillRect(0, i, width, 1)"]
    DrawRect --> Increment[i++]
    Increment --> Loop

    Loop -->|No| Complete([Gradient Complete])

    style Start fill:#90EE90
    style Loop fill:#FFE4B5
    style Complete fill:#98FB98
```

## Scene Lifecycle State Machine

```mermaid
stateDiagram-v2
    [*] --> Registered: Scene added to config
    Registered --> Pending: Waiting to start
    Pending --> Preload: scene.start() called

    Preload --> Loading: Load assets
    Loading --> Create: Assets ready

    Create --> RenderBackground: createBackground()
    RenderBackground --> RenderTitle: createTitle()
    RenderTitle --> RenderButton: createBackButton()
    RenderButton --> Active: Scene running

    Active --> UserInput: Waiting
    UserInput --> ButtonHover: Mouse over back button
    ButtonHover --> UserInput: Mouse out
    ButtonHover --> ButtonClick: Click

    ButtonClick --> PlayingAudio: Sound feedback
    PlayingAudio --> Animating: Visual feedback
    Animating --> Transitioning: Animation complete

    Transitioning --> Shutdown: Stop scene
    Shutdown --> Pending: Return to MainMenu
```

## Notes

### Architecture Decisions

**Scene Structure**
- LetterPopScene is self-contained and independent
- Extends Phaser.Scene for full framework access
- Helper methods organize code clearly
- Similar structure to MainMenuScene for consistency

**Background Strategy**
- Gradient drawn once during create()
- Uses Graphics object for pixel-by-pixel control
- Colors chosen for contrast with future white bubbles
- Gradient gives depth and visual interest without distracting

**Button Implementation**
- Reuses pattern from MainMenuScene
- Composite of Rectangle + Text
- Could be extracted to reusable Button class in future
- For now, simple and direct implementation

**Layout Design**
- Back button in top-left (web convention, easy to find)
- Title at top-center (clear visual hierarchy)
- Large empty center space for future gameplay
- Consistent with ADHD-friendly design principles

### Why This Design?

**Simplicity**
- Minimal components in this phase
- Focus on visual setup, not game logic
- Easy to understand and extend

**Performance**
- Gradient drawn once, not animated
- Few objects in scene graph
- Lightweight and fast to render

**Consistency**
- Button behavior matches MainMenuScene
- Color scheme distinct but harmonious
- Navigation pattern is predictable

**Extensibility**
- Center area ready for bubbles in Phase 7
- Scene structure supports adding game objects
- Button pattern can be reused for future UI

### Component Relationships

1. **LetterPopScene owns all UI components**
   - Creates and manages background
   - Creates and positions title
   - Creates and wires up back button

2. **Background is static**
   - Created once in create()
   - No updates needed
   - Provides colorful backdrop

3. **Back button mirrors START button**
   - Same interaction pattern
   - Same animation behavior
   - Consistent user experience

4. **Scene transitions are bidirectional**
   - MainMenu → LetterPop → MainMenu
   - Clean scene start/stop
   - No state leakage between scenes

### Future Considerations

**Phase 7 will add:**
- Bubble game object class
- Single static bubble display
- Letter rendering in bubble
- Foundation for bubble gameplay

**This phase provides:**
- Visual environment for bubbles
- Navigation framework
- Consistent UI patterns
- Clean scene structure to build upon

The architecture is intentionally simple but well-structured to support incremental complexity in future phases.
