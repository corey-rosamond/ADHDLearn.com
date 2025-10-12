# Phase 29: Letter Builder - Scene Setup - UML

## Class Diagram

```mermaid
classDiagram
    class LetterBuilderScene {
        -currentLetter: Object
        -currentLetterIndex: Number
        -totalLetters: Number
        -score: Number
        -letterPieces: Array
        -letterOutline: Text
        -progressText: Text
        -instructionText: Text
        +constructor()
        +preload()
        +create()
        +update()
        +createBackground()
        +createHeader()
        +createBackButton()
        +loadNextLetter()
        +createLetterOutline()
        +createPiecesArea()
        +createInstructionText()
        +playEntryAnimation()
    }

    class PhaserScene {
        <<framework>>
        +add: GameObjectFactory
        +tweens: TweenManager
        +sound: SoundManager
        +cameras: CameraManager
        +scene: SceneManager
    }

    class ContentProvider {
        <<global>>
        +getRandomLetter() Object
        +getLetterById(id) Object
        +getLetterStrokeParts(letter) Array
    }

    class MainMenuScene {
        +create()
        +addLetterBuilderButton()
    }

    LetterBuilderScene --|> PhaserScene : extends
    LetterBuilderScene ..> ContentProvider : uses
    LetterBuilderScene ..> MainMenuScene : transitions to
```

## Sequence Diagram - Scene Initialization

```mermaid
sequenceDiagram
    actor User
    participant Menu as MainMenuScene
    participant LB as LetterBuilderScene
    participant Phaser as Phaser Engine
    participant CP as ContentProvider
    participant Audio as AudioManager

    User->>Menu: Click "Letter Builder"
    Menu->>Phaser: scene.start('LetterBuilderScene')
    Phaser->>LB: preload()
    LB->>Phaser: Load assets (if any)
    Phaser->>LB: create()

    LB->>LB: createBackground()
    Note over LB: Render gradient + grid

    LB->>LB: createHeader()
    Note over LB: Title + Progress UI

    LB->>LB: createBackButton()
    Note over LB: Interactive back button

    LB->>CP: getRandomLetter()
    CP-->>LB: letterData {letter, id, ...}

    LB->>LB: loadNextLetter()
    LB->>LB: createLetterOutline()
    Note over LB: Outline of target letter

    LB->>LB: createPiecesArea()
    Note over LB: Designate bottom area

    LB->>LB: playEntryAnimation()
    Note over LB: Fade-in + scale animations

    LB-->>User: Scene ready and displayed
```

## Sequence Diagram - Back Button Interaction

```mermaid
sequenceDiagram
    actor User
    participant Button as Back Button
    participant LB as LetterBuilderScene
    participant Audio as AudioManager
    participant Tween as TweenManager
    participant Scene as SceneManager
    participant Menu as MainMenuScene

    User->>Button: Hover over
    Button->>LB: pointerover event
    LB->>Tween: Scale button to 1.1
    Tween-->>Button: Animated scale up

    User->>Button: Click
    Button->>LB: pointerdown event
    LB->>Audio: play('buttonClick')
    Audio-->>User: Click sound

    LB->>Tween: Scale to 0.9, yoyo
    Tween-->>Button: Press animation

    LB->>Scene: scene.start('MainMenuScene')
    Scene->>Menu: Initialize menu
    Menu-->>User: Display main menu
```

## Component Diagram

```mermaid
graph TB
    LBS[LetterBuilderScene]

    subgraph Visual Components
        BG[Background Graphics]
        Header[Header UI]
        Outline[Letter Outline]
        Separator[Area Separator]
        PiecesArea[Pieces Area]
    end

    subgraph Interactive Components
        BackBtn[Back Button]
        HoverEffect[Hover Animation]
        ClickEffect[Click Animation]
    end

    subgraph Data Components
        State[Scene State]
        CP[ContentProvider]
        LetterData[Letter Data]
    end

    subgraph Animation Components
        EntryAnim[Entry Animation]
        ScaleAnim[Scale Animation]
        FadeAnim[Fade Animation]
    end

    LBS --> BG
    LBS --> Header
    LBS --> Outline
    LBS --> Separator
    LBS --> PiecesArea
    LBS --> BackBtn
    LBS --> State
    LBS --> EntryAnim

    BackBtn --> HoverEffect
    BackBtn --> ClickEffect

    State --> CP
    CP --> LetterData
    LetterData --> Outline

    EntryAnim --> ScaleAnim
    EntryAnim --> FadeAnim

    ScaleAnim --> Outline
    FadeAnim --> LBS
```

## State Diagram - Scene Lifecycle

```mermaid
stateDiagram-v2
    [*] --> Preload: Scene Started
    Preload --> Create: Assets Loaded
    Create --> BuildingUI: create() called

    BuildingUI --> Background: createBackground()
    Background --> Header: createHeader()
    Header --> BackButton: createBackButton()
    BackButton --> LoadingLetter: loadNextLetter()

    LoadingLetter --> FetchData: Query ContentProvider
    FetchData --> RenderOutline: createLetterOutline()
    RenderOutline --> PiecesArea: createPiecesArea()
    PiecesArea --> Animating: playEntryAnimation()

    Animating --> Ready: Animations Complete
    Ready --> Ready: update() loop

    Ready --> BackClicked: Back Button Clicked
    BackClicked --> Transitioning: scene.start('MainMenu')
    Transitioning --> [*]: Scene Stopped

    Ready --> NextLetter: loadNextLetter() (Phase 31)
    NextLetter --> LoadingLetter
```

## Object Structure Diagram - Scene State

```mermaid
graph TD
    SceneState[Scene State Object]

    SceneState --> CurrentLetter[currentLetter: Object]
    SceneState --> LetterIndex[currentLetterIndex: Number]
    SceneState --> TotalLetters[totalLetters: 5]
    SceneState --> Score[score: Number]
    SceneState --> Pieces[letterPieces: Array]
    SceneState --> OutlineRef[letterOutline: Text]
    SceneState --> ProgressRef[progressText: Text]
    SceneState --> InstructionRef[instructionText: Text]

    CurrentLetter --> LetterChar[letter: 'A']
    CurrentLetter --> LetterID[id: 1]
    CurrentLetter --> LetterName[name: 'Letter A']
    CurrentLetter --> PhonicsSound[phonicsSound: 'assets/...']

    Pieces --> Piece1[Piece 1: null - Phase 30]
    Pieces --> Piece2[Piece 2: null - Phase 30]
    Pieces --> PieceN[Piece N: null - Phase 30]

    style Piece1 fill:#ddd
    style Piece2 fill:#ddd
    style PieceN fill:#ddd
```

## UI Layout Diagram

```mermaid
graph TB
    Screen[Game Screen 800x600]

    subgraph Top Area - 0 to 60px
        Header[Header Bar - Background 0x8B4513]
        BackBtn[Back Button - 50,30 - 60x60]
        Title[Title: 'Letter Builder' - 400,30]
        Progress[Progress: '1/5' - 700,30]
    end

    subgraph Middle Area - 60 to 420px
        Instruction[Instruction: 'Build the letter A' - 400,100]
        LetterOutline[Letter Outline - 400,250 - 200px font]
    end

    subgraph Bottom Area - 420 to 600px
        Separator[Horizontal Line - 400,420]
        PiecesLabel[Label: 'Drag pieces...' - 400,460]
        PiecesZone[Pieces Area - 400,510 - 800x180]
    end

    Screen --> Header
    Header --> BackBtn
    Header --> Title
    Header --> Progress

    Screen --> Instruction
    Screen --> LetterOutline

    Screen --> Separator
    Screen --> PiecesLabel
    Screen --> PiecesZone

    style Screen fill:#FFE5B4
    style Header fill:#8B4513,opacity:0.3
    style PiecesZone fill:#FFE5B4,opacity:0.3
    style LetterOutline stroke:#CCCCCC,stroke-width:10
```

## Animation Timeline Diagram

```mermaid
gantt
    title Entry Animation Sequence (800ms total)
    dateFormat X
    axisFormat %L ms

    section Scene
    Camera Fade-In: 0, 300

    section Letter Outline
    Scale from 0 to 1: 300, 500

    section Ready State
    User Interaction Enabled: 800, 900
```

## Data Flow Diagram

```mermaid
graph LR
    User[User Action]
    Menu[MainMenuScene]
    LB[LetterBuilderScene]
    CP[ContentProvider]
    State[Scene State]
    UI[UI Components]

    User -->|Click Letter Builder| Menu
    Menu -->|scene.start| LB
    LB -->|getRandomLetter| CP
    CP -->|letterData| LB
    LB -->|Update| State
    State -->|Render| UI
    UI -->|Display| User

    User -->|Click Back| LB
    LB -->|scene.start| Menu
    Menu -->|Display| User
```

## Background Rendering Strategy

```mermaid
graph TD
    CreateBG[createBackground Method]

    CreateBG --> Graphics[Create Graphics Object]
    Graphics --> GradientLoop[Loop: 600 iterations]

    GradientLoop --> ColorCalc[Calculate interpolated color]
    ColorCalc --> DrawLine[Draw 1px horizontal line]
    DrawLine --> NextY{y < 600?}
    NextY -->|Yes| GradientLoop
    NextY -->|No| GridLines[Draw Grid Lines]

    GridLines --> VerticalLoop[Loop: Vertical lines every 50px]
    VerticalLoop --> HorizontalLoop[Loop: Horizontal lines every 50px]
    HorizontalLoop --> Complete[Background Complete]

    style CreateBG fill:#90EE90
    style Complete fill:#90EE90
```

## Component Interaction Matrix

```mermaid
graph TB
    subgraph Scene Methods
        M1[createBackground]
        M2[createHeader]
        M3[createBackButton]
        M4[loadNextLetter]
        M5[createLetterOutline]
        M6[createPiecesArea]
        M7[playEntryAnimation]
    end

    subgraph External Dependencies
        E1[Phaser.Graphics]
        E2[Phaser.Text]
        E3[Phaser.Tweens]
        E4[ContentProvider]
        E5[AudioManager]
        E6[SceneManager]
    end

    M1 --> E1
    M2 --> E2
    M3 --> E2
    M3 --> E3
    M3 --> E5
    M3 --> E6
    M4 --> E4
    M5 --> E2
    M6 --> E2
    M7 --> E3
```

## Notes

### Architecture Decisions

**1. Scene State Management**
- All game state stored as instance variables
- Enables easy access across methods
- Prepares for Phase 30-31 piece tracking
- No external state management needed (simple game)

**2. Background Rendering Approach**
- Graphics API for gradient (programmatic, no assets)
- Grid lines add theme without heavy assets
- Can be optimized by rendering to texture if needed
- Warm colors distinctive from other mini-games

**3. Letter Outline Rendering**
- Text object with stroke, no fill
- Simple and browser-compatible
- Can be enhanced in Phase 32 if needed (dashed outline, SVG)
- Large size (200px) ensures visibility

**4. Component Modularity**
- Each UI element created in separate method
- Easy to modify individual components
- Clear separation of concerns
- Facilitates testing and debugging

**5. Animation Strategy**
- Entry animation for polish (fade + scale)
- Tweens are efficient (no custom frame logic)
- Animations don't block interaction (can be interrupted)
- Total timing <1 second (feels snappy)

### Why This Structure?

**Scene Lifecycle**
- `preload()`: Load assets (minimal in Phase 29)
- `create()`: Build UI, initialize state
- `update()`: Game loop (mostly idle in Phase 29, active in Phase 30-31)

**Method Organization**
- `create*()` methods: Build visual components
- `load*()` methods: Manage data/state
- `play*()` methods: Trigger animations

**State Preparation**
- `letterPieces` array ready for Phase 30
- Progress tracking ready for Phase 31
- Score tracking ready for Phase 32

This architecture provides a solid foundation for Phases 30-32 while keeping Phase 29 simple and testable.
