# Phase 23: Word Catch - Scene Setup - UML

## Class Diagram

```mermaid
classDiagram
    class WordCatchScene {
        -score: Number
        -lives: Number
        -level: Number
        -gameOver: Boolean
        -basket: Container
        -basketSpeed: Number
        -cursors: CursorKeys
        -touchMovement: String
        -scoreText: Text
        -livesText: Text
        -levelText: Text
        +init()
        +preload()
        +create()
        +update(time, delta)
        +createBackground()
        +createBasket()
        +setupKeyboardControls()
        +setupTouchControls()
        +updateBasketMovement(delta)
        +constrainBasket()
        +createUI()
        +returnToMenu()
    }

    class Phaser.Scene {
        <<framework>>
    }

    class Basket {
        +x: Number
        +y: Number
        +width: Number
        +height: Number
        +graphics: Graphics
        +container: Container
        +body: Body
        +move(direction)
        +clampPosition()
        +playIdleAnimation()
    }

    class InputController {
        +keyboardActive: Boolean
        +touchActive: Boolean
        +leftZone: Number
        +rightZone: Number
        +handleKeyboard(cursors)
        +handleTouch(pointer)
        +getMovementDirection()
        +reset()
    }

    class Background {
        +sky: Graphics
        +ground: Graphics
        +clouds: Array~Circle~
        +decorations: Array~GameObject~
        +render()
        +addCloud(x, y)
        +addDecoration(type, x, y)
    }

    WordCatchScene --|> Phaser.Scene
    WordCatchScene --> Basket : contains
    WordCatchScene --> InputController : uses
    WordCatchScene --> Background : creates
```

## Scene Lifecycle Sequence

```mermaid
sequenceDiagram
    actor Player
    participant Menu as MainMenu
    participant Scene as WordCatchScene
    participant Phaser as Phaser.Scene
    participant Input as Input System
    participant Graphics as Graphics Engine

    Player->>Menu: Click "Word Catch"
    Menu->>Scene: scene.start('WordCatchScene')

    Scene->>Phaser: init()
    Phaser->>Scene: Initialize variables
    Note over Scene: score=0, lives=3, level=1

    Scene->>Phaser: preload()
    Phaser->>Scene: Load assets
    Note over Scene: (Minimal assets for Phase 23)

    Scene->>Phaser: create()
    Scene->>Graphics: createBackground()
    Graphics-->>Scene: Background rendered

    Scene->>Graphics: createBasket()
    Graphics-->>Scene: Basket positioned

    Scene->>Input: setupKeyboardControls()
    Input-->>Scene: Cursor keys ready

    Scene->>Input: setupTouchControls()
    Input-->>Scene: Touch handlers registered

    Scene->>Graphics: createUI()
    Graphics-->>Scene: UI elements displayed

    loop Game Loop
        Phaser->>Scene: update(time, delta)
        Scene->>Scene: updateBasketMovement(delta)
        Scene->>Scene: constrainBasket()
        Scene->>Graphics: Render frame
    end

    Player->>Scene: Press Back Button
    Scene->>Menu: scene.start('MainMenu')
```

## Input Flow Diagram

```mermaid
flowchart TD
    Start([Game Update Loop]) --> CheckInput{Input Active?}

    CheckInput -->|Keyboard| CheckLeft{Left Arrow?}
    CheckInput -->|Touch| CheckTouchZone{Touch Zone?}
    CheckInput -->|None| End([Continue Loop])

    CheckLeft -->|Yes| MoveLeft[basket.x -= speed]
    CheckLeft -->|No| CheckRight{Right Arrow?}

    CheckRight -->|Yes| MoveRight[basket.x += speed]
    CheckRight -->|No| End

    CheckTouchZone -->|Left 40%| MoveLeft
    CheckTouchZone -->|Right 40%| MoveRight
    CheckTouchZone -->|Middle 20%| End

    MoveLeft --> Clamp[Clamp Position]
    MoveRight --> Clamp

    Clamp --> CheckBounds{Within Bounds?}
    CheckBounds -->|Yes| Update[Update Basket Position]
    CheckBounds -->|No| ClampEdge[Clamp to Edge]

    ClampEdge --> Update
    Update --> End
```

## State Diagram

```mermaid
stateDiagram-v2
    [*] --> Initializing: Scene Start

    Initializing --> Loading: init() complete
    Loading --> Creating: preload() complete
    Creating --> Ready: create() complete

    Ready --> Playing: Game Loop Active

    state Playing {
        [*] --> Idle
        Idle --> MovingLeft: Left Input
        Idle --> MovingRight: Right Input
        MovingLeft --> Idle: Input Released
        MovingRight --> Idle: Input Released
        MovingLeft --> MovingLeft: Continuous Input
        MovingRight --> MovingRight: Continuous Input
    }

    Playing --> Paused: Pause Button
    Paused --> Playing: Resume
    Playing --> Exiting: Back to Menu
    Paused --> Exiting: Back to Menu

    Exiting --> [*]: Scene Shutdown
```

## Component Structure

```mermaid
graph TB
    Scene[WordCatchScene]

    Scene --> BG[Background Layer]
    Scene --> Game[Game Layer]
    Scene --> UI[UI Layer]
    Scene --> Input[Input System]

    BG --> Sky[Sky Gradient]
    BG --> Ground[Ground Graphics]
    BG --> Clouds[Cloud Sprites]
    BG --> Decor[Decorative Elements]

    Game --> Basket[Player Basket]
    Game --> Physics[Physics Bodies]

    Basket --> Graphics[Basket Graphics]
    Basket --> Container[Container Object]
    Basket --> Anim[Idle Animation]

    UI --> Score[Score Text]
    UI --> Lives[Lives Display]
    UI --> Level[Level Text]
    UI --> Buttons[Control Buttons]

    Buttons --> Pause[Pause Button]
    Buttons --> Back[Back Button]

    Input --> Keyboard[Keyboard Handler]
    Input --> Touch[Touch Handler]

    Keyboard --> Left[Left Arrow]
    Keyboard --> Right[Right Arrow]

    Touch --> LeftZone[Left Touch Zone]
    Touch --> RightZone[Right Touch Zone]
```

## Basket Movement Physics

```mermaid
flowchart LR
    Input[Input Detected] --> CalcSpeed[Calculate Speed = basketSpeed * delta/1000]
    CalcSpeed --> ApplyMovement{Direction?}

    ApplyMovement -->|Left| SubtractX[x -= speed]
    ApplyMovement -->|Right| AddX[x += speed]

    SubtractX --> CheckMin{x < minX?}
    AddX --> CheckMax{x > maxX?}

    CheckMin -->|Yes| ClampMin[x = minX]
    CheckMin -->|No| UpdatePos[Update Position]

    CheckMax -->|Yes| ClampMax[x = maxX]
    CheckMax -->|No| UpdatePos

    ClampMin --> UpdatePos
    ClampMax --> UpdatePos

    UpdatePos --> Render[Render Frame]
```

## Touch Zone Layout

```mermaid
graph LR
    Screen[Screen Width: 800px]

    Screen --> LeftZone[Left Zone<br/>0-320px<br/>40% width<br/>Move Left]
    Screen --> MiddleZone[Neutral Zone<br/>320-480px<br/>20% width<br/>No Movement]
    Screen --> RightZone[Right Zone<br/>480-800px<br/>40% width<br/>Move Right]

    style LeftZone fill:#ffcccc
    style MiddleZone fill:#ffffcc
    style RightZone fill:#ccffcc
```

## Scene Management Flow

```mermaid
sequenceDiagram
    participant Boot
    participant Menu as MainMenu
    participant WC as WordCatchScene
    participant Phaser

    Boot->>Menu: Start Game
    Note over Menu: Display menu options

    Menu->>WC: scene.start('WordCatchScene')
    WC->>Phaser: Initialize scene

    Phaser->>WC: init()
    Phaser->>WC: preload()
    Phaser->>WC: create()

    Note over WC: Scene active<br/>Game loop running

    WC->>Menu: Player clicks Back
    Menu->>Phaser: scene.stop('WordCatchScene')
    Phaser->>WC: shutdown()

    Note over WC: Cleanup resources<br/>Remove event listeners
```

## File Structure

```mermaid
graph TB
    Root["/src/scenes"]

    Root --> WC["WordCatchScene.js"]
    Root --> Config["../config.js"]

    WC --> Constructor["constructor()"]
    WC --> Init["init()"]
    WC --> Preload["preload()"]
    WC --> Create["create()"]
    WC --> Update["update()"]

    Create --> CBG["createBackground()"]
    Create --> CB["createBasket()"]
    Create --> SKC["setupKeyboardControls()"]
    Create --> STC["setupTouchControls()"]
    Create --> CUI["createUI()"]

    Update --> UBM["updateBasketMovement()"]
    Update --> CNB["constrainBasket()"]

    style WC fill:#90EE90
    style Create fill:#FFE4B5
    style Update fill:#E0FFFF
```

## Basket Graphics Structure

```mermaid
classDiagram
    class Container {
        +x: 400
        +y: 550
        +width: 80
        +height: 20
        +children: Array
    }

    class Graphics {
        +fillStyle()
        +fillRect()
        +strokeStyle()
        +strokeRect()
    }

    class Tween {
        +targets: Container
        +y: 545
        +duration: 1000
        +yoyo: true
        +repeat: -1
        +ease: "Sine.easeInOut"
    }

    class Physics.Body {
        +collideWorldBounds: true
        +velocity: Vector2
        +enable: true
    }

    Container --> Graphics : contains
    Container --> Tween : animated by
    Container --> Physics.Body : has
```

## Notes

### Architecture Decisions

**Container vs Sprite for Basket**
- Using Container allows flexibility for complex basket graphics
- Can easily add multiple Graphics objects for basket detail
- Can swap to Sprite later if artist provides basket image
- Container makes positioning and animation simpler

**Input Handling Approach**
- Separate keyboard and touch handlers for clarity
- Both update same basket position
- No conflict because only one input type active at a time
- Touch zones (40%-20%-40%) provide clear input regions

**Scene Structure**
- Follows Phaser lifecycle: init → preload → create → update
- Clear separation of concerns (background, basket, input, UI)
- Easy to extend in Phase 24 with falling word mechanics
- Modular methods make testing and debugging easier

**Movement Physics**
- Delta-based movement ensures consistent speed across frame rates
- Clamping keeps basket on screen (padding: 50px)
- No acceleration in Phase 23 (can add polish later)
- Speed value (250px/s) is easily tunable

### Why This Structure?

**Preparation for Phase 24**
- Scene structure designed to easily add FallingWord objects
- Physics system ready for collision detection
- Update loop ready for word spawning logic
- Basket positioned and ready to "catch" words

**Child-Friendly Design**
- Large touch zones (40% of screen) easy for small fingers
- Responsive movement (no lag)
- Clear visual feedback (basket moves smoothly)
- Simple controls (just left and right)

**Performance Considerations**
- Minimal graphics in Phase 23 (just background and basket)
- No particle systems yet
- No complex physics yet
- Ensures 60fps baseline before adding words

This architecture provides a solid foundation for Word Catch gameplay while keeping Phase 23 scope focused on movement and controls.
