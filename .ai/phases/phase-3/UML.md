# Phase 3: Asset Loading Infrastructure - UML

## Asset Loading Sequence Diagram

```mermaid
sequenceDiagram
    actor Dev as Developer
    participant Browser
    participant Game as Phaser Game
    participant Preload as PreloadScene
    participant Loader as Asset Loader
    participant Graphics as Progress Bar
    participant Main as MainScene

    Dev->>Browser: Open index.html
    Browser->>Game: Initialize Phaser
    Game->>Preload: Start PreloadScene

    Preload->>Graphics: createProgressBar()
    Graphics-->>Preload: Progress UI created

    Preload->>Loader: load.image('testImage')
    Preload->>Loader: load.audio('testSound')
    Preload->>Loader: Start loading

    loop For each asset
        Loader->>Browser: Request asset file
        Browser-->>Loader: Asset data
        Loader->>Preload: progress event (0.0 to 1.0)
        Preload->>Graphics: updateProgressBar(value)
        Graphics-->>Dev: Visual feedback
    end

    Loader->>Preload: complete event
    Preload->>Preload: loadComplete()
    Preload->>Graphics: Update "Complete!"

    Preload->>Main: scene.start('MainScene')
    Main->>Loader: Get 'testImage' from cache
    Main->>Loader: Get 'testSound' from cache
    Main->>Browser: Display loaded image
    Browser-->>Dev: Show MainScene
```

## PreloadScene Class Diagram

```mermaid
classDiagram
    class PreloadScene {
        +String key "PreloadScene"
        +Graphics progressBar
        +Graphics progressBox
        +Text loadingText
        +Text percentText
        +constructor()
        +preload()
        +create()
        +createProgressBar()
        +updateProgressBar(value)
        +loadComplete()
    }

    class PhaserScene {
        <<Phaser.Scene>>
        +LoaderPlugin load
        +TimePlugin time
        +ScenePlugin scene
        +add
        +cameras
    }

    class LoaderPlugin {
        +image(key, path)
        +audio(key, path)
        +on(event, callback)
        +start()
    }

    class Graphics {
        +fillStyle(color, alpha)
        +fillRect(x, y, w, h)
        +clear()
    }

    class Text {
        +setText(string)
        +setOrigin(x, y)
    }

    PreloadScene --|> PhaserScene : extends
    PreloadScene --> LoaderPlugin : uses
    PreloadScene --> Graphics : creates
    PreloadScene --> Text : creates
```

## MainScene Class Diagram (Updated)

```mermaid
classDiagram
    class MainScene {
        +String key "MainScene"
        +constructor()
        +create()
        +displayLoadedAsset()
        +setupAudioTest()
    }

    class PhaserScene {
        <<Phaser.Scene>>
        +GameObjectFactory add
        +SoundManager sound
    }

    class Image {
        +setOrigin(x, y)
        +setInteractive()
        +on(event, callback)
    }

    class Sound {
        +play()
        +stop()
        +pause()
    }

    MainScene --|> PhaserScene : extends
    MainScene --> Image : creates
    MainScene --> Sound : uses
```

## Asset Loading State Machine

```mermaid
stateDiagram-v2
    [*] --> Initializing: Game starts
    Initializing --> PreloadStart: PreloadScene created
    PreloadStart --> CreatingProgressBar: preload() called
    CreatingProgressBar --> LoadingAssets: Progress UI ready

    LoadingAssets --> UpdateProgress: Asset loading (0-99%)
    UpdateProgress --> UpdateProgress: More assets
    UpdateProgress --> LoadComplete: All assets loaded (100%)

    LoadComplete --> DelayTransition: Brief pause
    DelayTransition --> TransitionToMain: scene.start()
    TransitionToMain --> DisplayAssets: MainScene.create()
    DisplayAssets --> Ready: Assets visible
    Ready --> [*]: Phase complete
```

## Progress Bar Component Structure

```mermaid
graph TB
    Scene[PreloadScene]
    Scene --> Container[Progress Container]

    Container --> LoadText[Loading Text<br/>'Loading...']
    Container --> ProgressBox[Progress Box<br/>Dark background<br/>400x30px]
    Container --> ProgressBar[Progress Bar<br/>Green fill<br/>0-400px width]
    Container --> PercentText[Percent Text<br/>'0%' to '100%']

    style LoadText fill:#ffffff,color:#000
    style ProgressBox fill:#222222,color:#fff
    style ProgressBar fill:#00ff00,color:#000
    style PercentText fill:#ffffff,color:#000
```

## Asset Loading Flow Diagram

```mermaid
graph LR
    Start[Start PreloadScene] --> Create[createProgressBar]
    Create --> Register[Register asset paths]

    Register --> LoadImg[load.image]
    Register --> LoadAudio[load.audio]

    LoadImg --> Queue[Loader Queue]
    LoadAudio --> Queue

    Queue --> Process{Loading}

    Process -->|Each file| Progress[progress event]
    Progress --> Update[updateProgressBar]
    Update --> Display[Update UI]
    Display --> Process

    Process -->|All done| Complete[complete event]
    Complete --> LoadDone[loadComplete]
    LoadDone --> Transition[scene.start MainScene]

    Transition --> ShowAsset[Display test image]
    ShowAsset --> Interactive[Setup click handler]
    Interactive --> End[Ready]
```

## File Structure Diagram (Updated)

```mermaid
graph TB
    Root["/Alphabet & Sight Words Game"]
    Root --> Index["index.html<br/>(Updated)"]
    Root --> Assets["/assets"]
    Root --> Src["/src"]

    Assets --> Audio["/audio"]
    Assets --> Images["/images"]
    Assets --> Data["/data"]

    Audio --> TestSound["test-sound.mp3<br/>(NEW)"]
    Images --> TestImage["test-image.png<br/>(NEW)"]

    Src --> Config["config.js<br/>(Updated)"]
    Src --> Scenes["/scenes"]

    Scenes --> PreloadScene["PreloadScene.js<br/>(NEW)"]
    Scenes --> MainScene["MainScene.js<br/>(Updated)"]

    style TestSound fill:#90EE90
    style TestImage fill:#90EE90
    style PreloadScene fill:#90EE90
    style Config fill:#FFD700
    style MainScene fill:#FFD700
    style Index fill:#FFD700
```

## Progress Bar Visualization

```mermaid
graph TB
    subgraph "Progress Bar States"
        State0["0%: Empty<br/>████████████████<br/>Gray box only"]
        State25["25%: Loading<br/>████░░░░░░░░░░░░<br/>Green fills 1/4"]
        State50["50%: Loading<br/>████████░░░░░░░░<br/>Green fills 1/2"]
        State75["75%: Loading<br/>████████████░░░░<br/>Green fills 3/4"]
        State100["100%: Complete<br/>████████████████<br/>Full green"]
    end

    State0 --> State25 --> State50 --> State75 --> State100

    style State0 fill:#444444
    style State25 fill:#446644
    style State50 fill:#448844
    style State75 fill:#44aa44
    style State100 fill:#00ff00
```

## Scene Transition Diagram

```mermaid
sequenceDiagram
    participant Game
    participant Preload as PreloadScene
    participant Cache as Asset Cache
    participant Main as MainScene

    Game->>Preload: Initialize
    activate Preload

    Preload->>Preload: preload()
    Note over Preload: Load assets to cache

    Preload->>Cache: Store 'testImage'
    Preload->>Cache: Store 'testSound'

    Preload->>Preload: create()
    Preload->>Main: scene.start('MainScene')
    deactivate Preload

    activate Main
    Main->>Cache: Get 'testImage'
    Cache-->>Main: Image data
    Main->>Cache: Get 'testSound'
    Cache-->>Main: Audio data

    Main->>Main: create()
    Note over Main: Display assets
    deactivate Main
```

## Asset Cache Structure

```mermaid
graph TB
    Cache[Asset Cache<br/>Phaser TextureManager & AudioCache]

    Cache --> ImageCache[Image Cache]
    Cache --> AudioCache[Audio Cache]

    ImageCache --> TestImg["Key: 'testImage'<br/>Value: Texture data"]
    AudioCache --> TestAudio["Key: 'testSound'<br/>Value: Audio buffer"]

    MainScene[MainScene] -.->|Retrieves by key| ImageCache
    MainScene -.->|Retrieves by key| AudioCache

    style Cache fill:#4488ff
    style ImageCache fill:#88aaff
    style AudioCache fill:#88aaff
    style TestImg fill:#aaccff
    style TestAudio fill:#aaccff
```

## Component Interaction Diagram

```mermaid
graph LR
    A[Browser] --> B[Phaser Game]
    B --> C[PreloadScene]

    C --> D[Asset Loader]
    C --> E[Progress Graphics]

    D --> F[Image Loader]
    D --> G[Audio Loader]

    F --> H[HTTP Request]
    G --> H

    H --> I[Asset Files]

    D --> J[Asset Cache]

    K[MainScene] --> J
    K --> L[Display Image]
    K --> M[Play Audio]

    style C fill:#90EE90
    style K fill:#90EE90
    style D fill:#FFD700
    style J fill:#4488ff
```

## Error Handling Flow

```mermaid
graph TB
    Start[Start Loading] --> Load{Load Asset}

    Load -->|Success| Cache[Add to cache]
    Load -->|Error| ErrorEvent[loaderror event]

    Cache --> CheckMore{More assets?}
    CheckMore -->|Yes| Load
    CheckMore -->|No| Complete[complete event]

    ErrorEvent --> Log[Console.error]
    Log --> LogDetails[Log file path & error]
    LogDetails --> Continue{Continue?}

    Continue -->|Yes| CheckMore
    Continue -->|No| FailedLoad[Incomplete load]

    Complete --> Transition[Transition to MainScene]
    FailedLoad --> Fallback[Show error message]

    style ErrorEvent fill:#ff6666
    style FailedLoad fill:#ff6666
    style Complete fill:#66ff66
```

## Notes

### Why This Architecture?

**Dedicated PreloadScene**
- Separates loading logic from game logic
- Provides visual feedback during loading
- Allows for loading screen customization
- Standard pattern in Phaser games

**Progress Bar Implementation**
- Uses Phaser Graphics objects for flexibility
- Updates in real-time with loader events
- Simple and performant
- Easy to customize appearance

**Asset Cache**
- Phaser automatically caches loaded assets
- Assets accessible by key in any scene
- No need to reload between scenes
- Efficient memory management

### Phaser Loader Events

The loader fires these events in order:
1. **start**: Loading begins
2. **progress**: Overall progress (0.0 to 1.0)
3. **fileprogress**: Individual file progress
4. **load**: Individual file loaded successfully
5. **loaderror**: Individual file failed to load
6. **complete**: All files loaded

### Progress Bar Positioning

Centering calculations:
- **X position**: `(canvasWidth - barWidth) / 2`
- **Y position**: `canvasHeight / 2`
- **Text origin**: `(0.5, 0.5)` for center alignment

### Scene Lifecycle

```
PreloadScene.init()
    ↓
PreloadScene.preload() ← Assets loaded here
    ↓
PreloadScene.create()
    ↓
scene.start('MainScene')
    ↓
MainScene.init()
    ↓
MainScene.preload() ← Usually empty
    ↓
MainScene.create() ← Use cached assets here
```

### What This Phase Proves

1. **Asset Loading Works**: Files load from disk/server
2. **Progress Tracking Works**: Visual feedback is accurate
3. **Asset Cache Works**: Loaded assets accessible in other scenes
4. **Scene Transitions Work**: Smooth handoff between scenes
5. **Audio System Works**: Sound playback functional
6. **Interactive Elements Work**: Click handlers functional

This establishes the pattern for all future asset loading in the game.

## Performance Considerations

- **Small Test Assets**: Keep under 100KB for fast testing
- **Progress Events**: Fire frequently, keep handlers lightweight
- **Graphics Objects**: Reuse instead of creating new ones
- **Scene Cleanup**: Phaser automatically cleans up scene objects
- **Cache Management**: Assets stay in cache until manually cleared

## Future Optimizations (Not in Phase 3)

- Asset pack JSON files for organized loading
- Loading screen animations
- Asset compression
- Sprite atlases for multiple images
- Audio sprites for multiple sounds
- Lazy loading for large assets
- Asset preloading strategies
