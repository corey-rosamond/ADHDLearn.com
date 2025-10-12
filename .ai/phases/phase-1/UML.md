# Phase 1: Project Bootstrap - UML

## File Structure Diagram

```mermaid
graph TB
    Root["/Alphabet & Sight Words Game"]
    Root --> Index["index.html"]
    Root --> Assets["/assets"]
    Root --> Src["/src"]

    Assets --> Audio["/audio (empty)"]
    Assets --> Images["/images (empty)"]
    Assets --> Data["/data (empty)"]

    Src --> Config["config.js"]
    Src --> Scenes["/scenes (empty)"]

    style Index fill:#90EE90
    style Config fill:#90EE90
```

## Sequence Diagram

```mermaid
sequenceDiagram
    actor Dev as Developer
    participant Browser
    participant HTML as index.html
    participant CDN as Phaser CDN
    participant Config as config.js
    participant Phaser as Phaser Engine

    Dev->>Browser: Open index.html
    Browser->>HTML: Load HTML
    HTML->>Browser: Request Phaser from CDN
    Browser->>CDN: GET phaser.js
    CDN-->>Browser: phaser.js (library code)

    HTML->>Browser: Request config.js
    Browser->>Config: Load config.js
    Config->>Phaser: new Phaser.Game(config)

    Phaser->>Phaser: Initialize engine
    Phaser->>Phaser: Create canvas (800x600)
    Phaser->>Phaser: Set background (#4488ff)
    Phaser->>Phaser: Call scene.create()
    Phaser->>Phaser: Add text to canvas

    Phaser-->>Browser: Render canvas
    Browser-->>Dev: Display game
```

## Configuration Object Structure

```mermaid
classDiagram
    class PhaserConfig {
        +String type AUTO
        +Number width 800
        +Number height 600
        +String parent "game-container"
        +String backgroundColor "#4488ff"
        +Object scene
    }

    class Scene {
        +Function create()
    }

    PhaserConfig --> Scene : contains
```

## Component Diagram

```mermaid
graph LR
    HTML[index.html] --> CDN[Phaser CDN]
    HTML --> Config[config.js]

    Config --> PhaserEngine[Phaser.Game Instance]
    CDN --> PhaserEngine

    PhaserEngine --> Canvas[HTML5 Canvas]
    PhaserEngine --> TextObject[Text Game Object]

    Canvas --> DOM[Browser DOM]
    TextObject --> Canvas
```

## State Diagram (Simple)

```mermaid
stateDiagram-v2
    [*] --> Loading: Open HTML
    Loading --> InitializingPhaser: Scripts Loaded
    InitializingPhaser --> CreatingCanvas: Engine Ready
    CreatingCanvas --> RenderingScene: Canvas Created
    RenderingScene --> DisplayingText: Scene Created
    DisplayingText --> [*]: Text Rendered
```

## Notes

### Why This Architecture?

**Single Config File Approach**
- Phase 1 doesn't need separate scenes yet
- Inline scene definition proves Phaser works
- Will refactor to proper scene classes in Phase 2

**CDN vs Local**
- CDN is faster for development
- No build step required
- Can switch to local copy later if needed

**Minimal Dependencies**
- Just HTML + Phaser + 1 JS file
- Easy to debug
- Fast to test

### What This Phase Proves

1. **Browser Compatibility**: Phaser runs in target browser
2. **CDN Access**: Can load external libraries
3. **Canvas Rendering**: Graphics system works
4. **JavaScript Execution**: No syntax/runtime errors
5. **Development Environment**: File structure is correct

This is intentionally simple. Complexity comes later, incrementally.
