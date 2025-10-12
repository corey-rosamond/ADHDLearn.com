# Phase 2: Basic Scene System - UML

## Scene State Diagram

```mermaid
stateDiagram-v2
    [*] --> Boot: Game Starts
    Boot --> Preload: After 1 second
    Preload --> MainMenu: After 2 seconds
    MainMenu --> [*]: Game Ready

    state Boot {
        [*] --> DisplayInitializing
        DisplayInitializing --> LogConsole
        LogConsole --> WaitOneSecond
        WaitOneSecond --> [*]
    }

    state Preload {
        [*] --> DisplayLoading
        DisplayLoading --> LogConsole
        LogConsole --> WaitTwoSeconds
        WaitTwoSeconds --> [*]
        note right of WaitTwoSeconds: Future: Load assets here
    }

    state MainMenu {
        [*] --> DisplayTitle
        DisplayTitle --> DisplayInstruction
        DisplayInstruction --> LogConsole
        LogConsole --> WaitForInput
        note right of WaitForInput: Phase 3: Add click handler
    }
```

## Class Diagram

```mermaid
classDiagram
    class PhaserScene {
        <<Phaser Framework>>
        +constructor(config)
        +init(data)
        +preload()
        +create()
        +update(time, delta)
        +scene SceneManager
        +add GameObjectFactory
        +time TimeManager
    }

    class BootScene {
        -key: "Boot"
        +constructor()
        +create()
    }

    class PreloadScene {
        -key: "Preload"
        +constructor()
        +create()
    }

    class MainMenuScene {
        -key: "MainMenu"
        +constructor()
        +create()
    }

    class GameConfig {
        +type: AUTO
        +width: 800
        +height: 600
        +parent: "game-container"
        +backgroundColor: "#4488ff"
        +scene: Array~Scene~
    }

    class PhaserGame {
        +constructor(config)
        +scene: SceneManager
        +canvas: HTMLCanvasElement
    }

    PhaserScene <|-- BootScene: extends
    PhaserScene <|-- PreloadScene: extends
    PhaserScene <|-- MainMenuScene: extends

    GameConfig --> BootScene: contains
    GameConfig --> PreloadScene: contains
    GameConfig --> MainMenuScene: contains

    PhaserGame --> GameConfig: uses
    PhaserGame --> BootScene: manages
    PhaserGame --> PreloadScene: manages
    PhaserGame --> MainMenuScene: manages
```

## Sequence Diagram: Scene Transitions

```mermaid
sequenceDiagram
    actor User
    participant Browser
    participant HTML
    participant Phaser as Phaser Engine
    participant Boot as BootScene
    participant Preload as PreloadScene
    participant MainMenu as MainMenuScene

    User->>Browser: Open index.html
    Browser->>HTML: Load HTML
    HTML->>Phaser: Load Phaser library
    HTML->>Browser: Load scene scripts
    HTML->>Phaser: Execute config.js

    Phaser->>Phaser: new Phaser.Game(config)
    Phaser->>Boot: Start first scene in array

    activate Boot
    Boot->>Boot: constructor()
    Boot->>Boot: create()
    Boot->>Browser: console.log("BootScene started")
    Boot->>Browser: Display "Initializing..."
    Boot->>Boot: this.time.delayedCall(1000, ...)

    Note over Boot: Wait 1 second...

    Boot->>Phaser: this.scene.start('Preload')
    deactivate Boot

    Phaser->>Preload: Start PreloadScene
    activate Preload
    Preload->>Preload: constructor()
    Preload->>Preload: create()
    Preload->>Browser: console.log("PreloadScene started")
    Preload->>Browser: Display "Loading..."
    Preload->>Preload: this.time.delayedCall(2000, ...)

    Note over Preload: Wait 2 seconds...

    Preload->>Phaser: this.scene.start('MainMenu')
    deactivate Preload

    Phaser->>MainMenu: Start MainMenuScene
    activate MainMenu
    MainMenu->>MainMenu: constructor()
    MainMenu->>MainMenu: create()
    MainMenu->>Browser: console.log("MainMenuScene started")
    MainMenu->>Browser: Display title
    MainMenu->>Browser: Display "Press to Start"

    Note over MainMenu: Scene remains active<br/>Waiting for user input<br/>(Phase 3)

    MainMenu-->>User: Show main menu
    deactivate MainMenu
```

## Component Interaction Diagram

```mermaid
graph TB
    subgraph "Browser Environment"
        HTML[index.html]
        Canvas[HTML5 Canvas]
    end

    subgraph "Phaser Framework"
        Game[Phaser.Game Instance]
        SceneMgr[Scene Manager]
        TimeMgr[Time Manager]
        GOFactory[Game Object Factory]
    end

    subgraph "Game Scenes"
        Boot[BootScene]
        Preload[PreloadScene]
        MainMenu[MainMenuScene]
    end

    HTML --> Game
    Game --> Canvas
    Game --> SceneMgr

    SceneMgr --> Boot
    SceneMgr --> Preload
    SceneMgr --> MainMenu

    Boot --> TimeMgr
    Boot --> GOFactory
    Boot --> SceneMgr

    Preload --> TimeMgr
    Preload --> GOFactory
    Preload --> SceneMgr

    MainMenu --> GOFactory

    GOFactory --> Canvas
```

## File Structure Diagram

```mermaid
graph TB
    Root["/Alphabet & Sight Words Game"]
    Root --> Index["index.html ⚡"]
    Root --> Assets["/assets"]
    Root --> Src["/src"]

    Assets --> Audio["/audio (empty)"]
    Assets --> Images["/images (empty)"]
    Assets --> Data["/data (empty)"]

    Src --> Config["config.js ⚡"]
    Src --> Scenes["/scenes ⚡"]

    Scenes --> Boot["BootScene.js ⭐ NEW"]
    Scenes --> Preload["PreloadScene.js ⭐ NEW"]
    Scenes --> MainMenu["MainMenuScene.js ⭐ NEW"]

    style Index fill:#90EE90
    style Config fill:#FFD700
    style Boot fill:#87CEEB
    style Preload fill:#87CEEB
    style MainMenu fill:#87CEEB

    Legend[/"⚡ Modified | ⭐ New"/]
    style Legend fill:#F0F0F0
```

## Scene Lifecycle Flowchart

```mermaid
flowchart TD
    Start([Phaser.Game Created]) --> CheckScenes{Scenes in config?}
    CheckScenes -->|Yes| LoadFirst[Load First Scene]
    CheckScenes -->|No| Error[Error: No Scenes]

    LoadFirst --> ConstructorBoot[Call constructor]
    ConstructorBoot --> InitBoot[Call init]
    InitBoot --> PreloadBoot{Has preload method?}
    PreloadBoot -->|Yes| RunPreload[Run preload]
    PreloadBoot -->|No| SkipPreload[Skip preload]
    RunPreload --> CreateBoot[Call create]
    SkipPreload --> CreateBoot

    CreateBoot --> DisplayInit[Display 'Initializing...']
    DisplayInit --> LogBoot[Console: BootScene started]
    LogBoot --> Timer1[Set 1-second timer]
    Timer1 --> Wait1[Wait...]
    Wait1 --> TransitionPreload[this.scene.start 'Preload']

    TransitionPreload --> StopBoot[Stop BootScene]
    StopBoot --> StartPreload[Start PreloadScene]

    StartPreload --> CreatePreload[Call create]
    CreatePreload --> DisplayLoad[Display 'Loading...']
    DisplayLoad --> LogPreload[Console: PreloadScene started]
    LogPreload --> Timer2[Set 2-second timer]
    Timer2 --> Wait2[Wait...]
    Wait2 --> TransitionMenu[this.scene.start 'MainMenu']

    TransitionMenu --> StopPreload[Stop PreloadScene]
    StopPreload --> StartMenu[Start MainMenuScene]

    StartMenu --> CreateMenu[Call create]
    CreateMenu --> DisplayTitle[Display Title]
    DisplayTitle --> DisplayInst[Display Instructions]
    DisplayInst --> LogMenu[Console: MainMenuScene started]
    LogMenu --> ActiveMenu[Scene Active]
    ActiveMenu --> WaitInput[Wait for Input Phase 3]
```

## Text Display Layout (MainMenuScene)

```mermaid
graph TD
    subgraph Canvas["Canvas 800x600"]
        subgraph Title["Title Text"]
            T1["Aurora's Letter Adventure"]
            T2["Position: 400, 200"]
            T3["Font: 40px bold yellow"]
        end

        subgraph Center["Center Area"]
            C1["Empty Space"]
            C2["For future content"]
        end

        subgraph Instruction["Instruction Text"]
            I1["Press to Start"]
            I2["Position: 400, 400"]
            I3["Font: 24px white"]
        end
    end

    Title --> Center
    Center --> Instruction
```

## Scene Manager State Machine

```mermaid
stateDiagram-v2
    [*] --> Idle: Scene Manager Created

    Idle --> Starting: scene.start called
    Starting --> Running: Scene created
    Running --> Stopping: Another scene.start called
    Stopping --> Idle: Scene destroyed

    Running --> Paused: scene.pause called
    Paused --> Running: scene.resume called
    Paused --> Stopping: scene.stop called

    note right of Starting: Calls constructor, init, preload, create
    note right of Running: Scene update loop active
    note right of Stopping: Cleanup and destroy scene
```

## Notes

### Architecture Decisions

**Why Three Scenes?**
- **BootScene**: Initialize game state, systems, configuration
- **PreloadScene**: Load all assets (future phases)
- **MainMenuScene**: User entry point, game start

This is standard Phaser architecture for production games.

**Why Extend Phaser.Scene?**
- Access to all Phaser scene methods
- Automatic lifecycle management
- Clean, object-oriented structure
- Easy to test and maintain

**Why Scene Keys?**
- Unique identifiers for each scene
- Used in scene.start() transitions
- Must be consistent across all references

### Scene Transition Methods

**this.scene.start('key')**
- Stops current scene
- Starts target scene
- Current scene is destroyed

**this.scene.launch('key')** (not used yet)
- Starts scene alongside current scene
- Both scenes run simultaneously
- Useful for UI overlays (future phases)

**this.scene.switch('key')** (not used yet)
- Pauses current scene
- Starts target scene
- Can return to paused scene

For Phase 2, we only use `scene.start()`.

### Timer vs setTimeout

We use `this.time.delayedCall()` instead of JavaScript's `setTimeout()` because:
1. Managed by Phaser's time system
2. Automatically cleaned up when scene stops
3. Pauses when scene pauses
4. More reliable for game timing

### What This Phase Establishes

1. **Scene Architecture**: Pattern for all future scenes
2. **Scene Transitions**: How scenes communicate and transfer control
3. **Scene Lifecycle**: Understanding of create, update, destroy
4. **Text Display**: How to render text in scenes
5. **Console Logging**: Debugging approach for scene flow

This architecture will scale to all 44 phases of the project.

### Future Enhancements (Not Phase 2)

- Asset loading in PreloadScene
- Progress bar during loading
- Click/touch input in MainMenu
- Scene data passing
- Scene transitions with effects
- Multiple simultaneous scenes
- Scene sleep/wake management
