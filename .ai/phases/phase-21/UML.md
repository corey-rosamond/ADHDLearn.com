# Phase 21: Responsive Design - UML

## Class Diagram

```mermaid
classDiagram
    class ResponsiveGameConfig {
        +Object scaleConfig
        +Number baseWidth 800
        +Number baseHeight 600
        +String scaleMode "FIT"
        +String autoCenter "CENTER_BOTH"
        +Object minDimensions
        +Object maxDimensions
        +initializeScale()
        +getScaleConfig() Object
    }

    class DeviceDetector {
        <<Utility>>
        +isMobile() Boolean
        +isTablet() Boolean
        +isPhone() Boolean
        +isLandscape() Boolean
        +isPortrait() Boolean
        +getScreenSize() Object
        +getDeviceType() String
        +getTouchTargetSize() Number
        +supportsTouch() Boolean
    }

    class ResponsiveScene {
        <<Abstract>>
        -Number screenWidth
        -Number screenHeight
        -Boolean isMobile
        -String orientation
        +create()
        +handleResize(width, height)
        +handleOrientationChange(orientation)
        +repositionElements()
        +adjustForMobile()
        +adjustForDesktop()
        +getResponsiveScale() Number
    }

    class ResponsiveButton {
        -Scene scene
        -Number x
        -Number y
        -String text
        -Function callback
        -Boolean isMobile
        -Rectangle background
        -Text textObject
        -Number width
        -Number height
        +constructor(scene, x, y, text, callback)
        +create()
        +getSize() Object
        +setInteractive()
        +destroy()
    }

    class TouchInputManager {
        -Scene scene
        -Number maxPointers 3
        -Boolean touchEnabled
        -Array~Pointer~ activePointers
        +initialize(scene)
        +enableTouch()
        +disableDefaultBehaviors()
        +handleTap(pointer)
        +handleDrag(pointer)
        +handleSwipe(pointer)
        +preventZoom()
        +preventScroll()
    }

    class ScaleManager {
        <<Phaser.Scale>>
        -String scaleMode
        -Number width
        -Number height
        -Object displaySize
        -Object gameSize
        +on(event, callback)
        +resize(width, height)
        +setGameSize(width, height)
        +refresh()
    }

    class OrientationHandler {
        -Scene scene
        -String currentOrientation
        -Boolean allowRotation
        +initialize(scene)
        +detectOrientation() String
        +onOrientationChange(callback)
        +lockOrientation(orientation)
        +adjustLayout(orientation)
        +notifyScenes(orientation)
    }

    class ResponsiveUI {
        -Scene scene
        -Object elements
        -Boolean isMobile
        -Number scale
        +constructor(scene)
        +createButton(x, y, text, callback)
        +createSlider(x, y, label, key)
        +createText(x, y, content, style)
        +scaleElement(element, factor)
        +repositionElement(element, x, y)
        +adjustFontSize(text) Number
        +getTouchTargetSize() Number
    }

    class ResponsiveLetterPopScene {
        -Number bubbleSize
        -Number bubbleSpacing
        -Array~Bubble~ bubbles
        +create()
        +createBubbles()
        +adjustBubbleSizeForDevice()
        +handleResize(width, height)
    }

    class ResponsiveSettingsScene {
        -Number sliderWidth
        -Number sliderHeight
        -Number buttonHeight
        +create()
        +createResponsiveSliders()
        +createResponsiveDifficulty()
        +adjustForMobile()
    }

    class ResponsiveMainMenu {
        -Array~Button~ menuButtons
        -Number buttonSpacing
        +create()
        +createMenuButtons()
        +positionButtonsForOrientation()
        +handleResize(width, height)
    }

    class ViewportManager {
        <<Static>>
        +setupViewportMeta()
        +disableZoom()
        +disableScroll()
        +enableFullscreen()
        +preventPullToRefresh()
        +getViewportSize() Object
    }

    ResponsiveGameConfig --> ScaleManager : configures
    ResponsiveScene --> DeviceDetector : uses
    ResponsiveScene --> TouchInputManager : uses
    ResponsiveScene --> OrientationHandler : uses
    ResponsiveScene --> ResponsiveUI : uses
    ResponsiveScene --> ScaleManager : listens to

    ResponsiveButton --> DeviceDetector : uses
    ResponsiveUI --> ResponsiveButton : creates

    ResponsiveLetterPopScene --|> ResponsiveScene : extends
    ResponsiveSettingsScene --|> ResponsiveScene : extends
    ResponsiveMainMenu --|> ResponsiveScene : extends

    TouchInputManager --> ViewportManager : uses
    OrientationHandler --> ScaleManager : uses
```

## Sequence Diagram: Game Load on Mobile

```mermaid
sequenceDiagram
    actor User
    participant Browser
    participant Viewport as ViewportManager
    participant Config as ResponsiveGameConfig
    participant Phaser as Phaser.Game
    participant Scale as ScaleManager
    participant Detector as DeviceDetector
    participant Scene as ResponsiveScene

    User->>Browser: Open game URL on tablet
    Browser->>Viewport: Load index.html
    Viewport->>Viewport: setupViewportMeta()
    Viewport->>Viewport: disableZoom()
    Viewport->>Viewport: disableScroll()

    Browser->>Config: Load game config
    Config->>Detector: Detect device type
    Detector-->>Config: isTablet = true

    Config->>Config: initializeScale()
    Config->>Config: Set scale mode = FIT
    Config->>Config: Set autoCenter = CENTER_BOTH

    Config->>Phaser: new Phaser.Game(config)
    Phaser->>Scale: Initialize ScaleManager
    Scale->>Scale: Calculate display size
    Scale->>Scale: Scale canvas to fit 768x1024

    Phaser->>Scene: Start MainMenuScene
    Scene->>Detector: Check device type
    Detector-->>Scene: isMobile = true

    Scene->>Scene: adjustForMobile()
    Scene->>Scene: Increase button sizes
    Scene->>Scene: Adjust font sizes
    Scene->>Scene: Enable touch input

    Scene-->>User: Display responsive UI
```

## Sequence Diagram: Orientation Change

```mermaid
sequenceDiagram
    actor User
    participant Device
    participant Browser
    participant Scale as ScaleManager
    participant Handler as OrientationHandler
    participant Scene as ResponsiveScene
    participant UI as ResponsiveUI

    User->>Device: Rotate tablet (portrait → landscape)
    Device->>Browser: Fire orientationchange event
    Browser->>Scale: Trigger resize event

    Scale->>Scale: Detect new dimensions (1024x768)
    Scale->>Scale: Recalculate scale factor
    Scale->>Handler: on('orientationchange', 'landscape')

    Handler->>Handler: detectOrientation()
    Handler->>Handler: currentOrientation = 'landscape'
    Handler->>Scene: handleOrientationChange('landscape')

    Scene->>Scene: adjustForLandscape()
    Scene->>UI: repositionElements()

    UI->>UI: Reposition title
    UI->>UI: Reposition buttons
    UI->>UI: Adjust layout for landscape

    Scene->>Scale: resize(1024, 768)
    Scale->>Scale: Refresh canvas

    Scale-->>User: Display reoriented UI
```

## Sequence Diagram: Touch Input on Bubble

```mermaid
sequenceDiagram
    actor User
    participant Screen as Touch Screen
    participant Input as TouchInputManager
    participant Phaser as Phaser.Input
    participant Bubble as Bubble Object
    participant Scene as LetterPopScene

    User->>Screen: Tap bubble with finger
    Screen->>Input: Touch event
    Input->>Input: Convert touch to pointer
    Input->>Phaser: pointerdown event

    Phaser->>Phaser: Check interactive objects
    Phaser->>Bubble: Is pointer over bubble?
    Bubble-->>Phaser: Yes (hit test passed)

    Phaser->>Bubble: Trigger pointerdown event
    Bubble->>Scene: handleBubbleClick(bubble, letter)

    Scene->>Scene: Compare letter to target
    Scene->>Scene: Execute correct/incorrect logic

    alt Correct Click
        Scene->>Scene: Celebration animation
        Scene-->>User: Visual + audio feedback
    else Incorrect Click
        Scene->>Scene: Wobble animation
        Scene-->>User: Gentle feedback
    end
```

## State Diagram: Responsive Layout States

```mermaid
stateDiagram-v2
    [*] --> Initializing: Game loads

    Initializing --> DetectingDevice: Check user agent
    DetectingDevice --> DesktopMode: Desktop detected
    DetectingDevice --> TabletMode: Tablet detected
    DetectingDevice --> PhoneMode: Phone detected

    DesktopMode --> Portrait: Narrow window
    DesktopMode --> Landscape: Wide window

    TabletMode --> Portrait: 768x1024
    TabletMode --> Landscape: 1024x768

    PhoneMode --> Portrait: 375x667
    PhoneMode --> LandscapePhone: 667x375

    Portrait --> Landscape: Rotate device
    Landscape --> Portrait: Rotate device

    Portrait --> Resizing: Window resize
    Landscape --> Resizing: Window resize

    Resizing --> Portrait: New dimensions
    Resizing --> Landscape: New dimensions

    Portrait --> [*]: Game exit
    Landscape --> [*]: Game exit

    note right of DesktopMode
        Standard mouse input
        800x600 base size
    end note

    note right of TabletMode
        Touch input enabled
        Larger touch targets
    end note

    note right of PhoneMode
        Touch input required
        Largest touch targets
        Simplified UI
    end note
```

## Activity Diagram: Responsive Scene Creation

```mermaid
flowchart TD
    Start([Scene Create]) --> DetectDevice[Detect device type]

    DetectDevice --> CheckType{Device type?}

    CheckType -->|Desktop| DesktopConfig[Load desktop config]
    CheckType -->|Tablet| TabletConfig[Load tablet config]
    CheckType -->|Phone| PhoneConfig[Load phone config]

    DesktopConfig --> SetSizes1[Button: 50px, Bubble: 40px, Font: 24px]
    TabletConfig --> SetSizes2[Button: 60px, Bubble: 50px, Font: 26px]
    PhoneConfig --> SetSizes3[Button: 70px, Bubble: 60px, Font: 28px]

    SetSizes1 --> EnableInput1[Enable mouse input]
    SetSizes2 --> EnableInput2[Enable touch + mouse]
    SetSizes3 --> EnableInput2

    EnableInput1 --> CheckOrientation{Check orientation}
    EnableInput2 --> CheckOrientation

    CheckOrientation -->|Portrait| LayoutPortrait[Use portrait layout]
    CheckOrientation -->|Landscape| LayoutLandscape[Use landscape layout]

    LayoutPortrait --> CreateUI[Create UI elements]
    LayoutLandscape --> CreateUI

    CreateUI --> PositionElements[Position elements for device/orientation]
    PositionElements --> SetupListeners[Setup resize/orientation listeners]

    SetupListeners --> ApplyScale[Apply scale factor]
    ApplyScale --> Complete[Scene ready]

    Complete --> WaitEvent[Wait for events]

    WaitEvent --> EventType{Event type?}

    EventType -->|Resize| HandleResize[Handle resize]
    EventType -->|Orientation| HandleOrientation[Handle orientation change]
    EventType -->|Input| HandleInput[Handle touch/mouse input]

    HandleResize --> Reposition[Reposition elements]
    HandleOrientation --> Reposition
    Reposition --> WaitEvent

    HandleInput --> ProcessInput[Process input]
    ProcessInput --> WaitEvent

    style DetectDevice fill:#87CEEB
    style SetSizes1 fill:#FFD700
    style SetSizes2 fill:#FFD700
    style SetSizes3 fill:#FFD700
    style EnableInput2 fill:#90EE90
```

## Component Diagram: Responsive System Architecture

```mermaid
graph TB
    subgraph Browser Layer
        Viewport[Viewport Meta Tag]
        TouchEvents[Touch Events API]
        OrientationAPI[Orientation API]
        WindowResize[Window Resize Events]
    end

    subgraph Detection Layer
        DeviceDetector[Device Detector]
        OrientationDetector[Orientation Detector]
        ScreenSizeDetector[Screen Size Detector]
    end

    subgraph Configuration Layer
        ScaleConfig[Scale Configuration]
        InputConfig[Input Configuration]
        UIConfig[UI Size Configuration]
    end

    subgraph Phaser Layer
        PhaserGame[Phaser.Game]
        ScaleManager[Phaser.Scale Manager]
        InputManager[Phaser.Input Manager]
    end

    subgraph Scene Layer
        ResponsiveScene[Responsive Scene Base]
        MenuScene[Main Menu Scene]
        GameScene[Letter Pop Scene]
        SettingsScene[Settings Scene]
    end

    subgraph UI Components
        ResponsiveButton[Responsive Button]
        ResponsiveSlider[Responsive Slider]
        ResponsiveBubble[Responsive Bubble]
        ResponsiveText[Responsive Text]
    end

    Viewport --> DeviceDetector
    TouchEvents --> InputConfig
    OrientationAPI --> OrientationDetector
    WindowResize --> ScaleManager

    DeviceDetector --> ScaleConfig
    DeviceDetector --> UIConfig
    OrientationDetector --> ScaleConfig
    ScreenSizeDetector --> ScaleConfig

    ScaleConfig --> PhaserGame
    InputConfig --> PhaserGame
    UIConfig --> ResponsiveScene

    PhaserGame --> ScaleManager
    PhaserGame --> InputManager

    ScaleManager --> ResponsiveScene
    InputManager --> ResponsiveScene

    ResponsiveScene --> MenuScene
    ResponsiveScene --> GameScene
    ResponsiveScene --> SettingsScene

    MenuScene --> ResponsiveButton
    GameScene --> ResponsiveBubble
    SettingsScene --> ResponsiveSlider
    ResponsiveScene --> ResponsiveText

    style DeviceDetector fill:#FFD700
    style ScaleManager fill:#87CEEB
    style ResponsiveScene fill:#90EE90
```

## Data Flow Diagram: Screen Size Adaptation

```mermaid
flowchart LR
    A[Device Screen] --> B[Browser Window]
    B --> C[Detect Dimensions]
    C --> D{Screen Size}

    D -->|375x667| E[Phone Portrait]
    D -->|667x375| F[Phone Landscape]
    D -->|768x1024| G[Tablet Portrait]
    D -->|1024x768| H[Tablet Landscape]
    D -->|800x600+| I[Desktop]

    E --> J[Phone Config]
    F --> J
    G --> K[Tablet Config]
    H --> K
    I --> L[Desktop Config]

    J --> M{UI Scaling}
    K --> M
    L --> M

    M --> N[Button Size]
    M --> O[Bubble Size]
    M --> P[Font Size]
    M --> Q[Touch Target Size]

    N --> R[Apply to Scene]
    O --> R
    P --> R
    Q --> R

    R --> S[Phaser Scale Manager]
    S --> T[Scale Canvas]
    T --> U[Center Canvas]
    U --> V[Render Game]

    V --> W[Display to User]

    style C fill:#87CEEB
    style M fill:#FFD700
    style S fill:#90EE90
```

## Touch Target Size Matrix

```mermaid
graph TB
    subgraph Device Types
        Desktop[Desktop: Mouse]
        Tablet[Tablet: Touch]
        Phone[Phone: Touch]
    end

    subgraph Target Sizes
        Desktop --> Size1[Button: 50px]
        Desktop --> Size2[Bubble: 40px]
        Desktop --> Size3[Slider: 10px height]

        Tablet --> Size4[Button: 60px]
        Tablet --> Size5[Bubble: 50px]
        Tablet --> Size6[Slider: 15px height]

        Phone --> Size7[Button: 70px]
        Phone --> Size8[Bubble: 60px]
        Phone --> Size9[Slider: 20px height]
    end

    subgraph Guidelines
        Size7 --> Apple[Apple HIG: 44x44px min]
        Size7 --> Android[Android: 48dp min]
        Size7 --> Recommended[Recommended: 60-70px]
    end

    style Desktop fill:#87CEEB
    style Tablet fill:#90EE90
    style Phone fill:#FFD700
    style Recommended fill:#FF6B6B
```

## Scale Manager Configuration Diagram

```mermaid
graph TB
    Config[Game Config] --> ScaleMode{Scale Mode}

    ScaleMode -->|FIT| Fit[Scale to fit, maintain aspect ratio]
    ScaleMode -->|RESIZE| Resize[Resize game to match window]
    ScaleMode -->|NONE| None[No scaling]

    Fit --> AutoCenter{Auto Center}
    Resize --> AutoCenter
    None --> AutoCenter

    AutoCenter -->|CENTER_BOTH| CenterBoth[Center horizontally & vertically]
    AutoCenter -->|CENTER_HORIZONTALLY| CenterH[Center horizontally only]
    AutoCenter -->|CENTER_VERTICALLY| CenterV[Center vertically only]

    CenterBoth --> Dimensions[Set Dimensions]
    CenterH --> Dimensions
    CenterV --> Dimensions

    Dimensions --> BaseSize[Base: 800x600]
    Dimensions --> MinSize[Min: 375x300]
    Dimensions --> MaxSize[Max: 1920x1080]

    BaseSize --> Result[Scaled Canvas]
    MinSize --> Result
    MaxSize --> Result

    Result --> Letterbox{Needs letterbox?}
    Letterbox -->|Yes| AddBars[Add black bars]
    Letterbox -->|No| Display[Display full]

    AddBars --> Display
    Display --> Final[Rendered Game]

    style Fit fill:#90EE90
    style CenterBoth fill:#FFD700
    style Result fill:#87CEEB
```

## Responsive Button Size Calculation

```mermaid
flowchart TD
    Start[Create Button] --> Detect[Detect Device]

    Detect --> Type{Device Type}

    Type -->|Desktop| Base1[Base Size: 150x50]
    Type -->|Tablet| Base2[Base Size: 180x60]
    Type -->|Phone| Base3[Base Size: 200x70]

    Base1 --> CheckText1{Text Length}
    Base2 --> CheckText2{Text Length}
    Base3 --> CheckText3{Text Length}

    CheckText1 -->|Short| Size1[Width: 150px]
    CheckText1 -->|Long| Size2[Width: 200px]
    CheckText2 -->|Short| Size3[Width: 180px]
    CheckText2 -->|Long| Size4[Width: 230px]
    CheckText3 -->|Short| Size5[Width: 200px]
    CheckText3 -->|Long| Size6[Width: 250px]

    Size1 --> MinCheck{Meets min size?}
    Size2 --> MinCheck
    Size3 --> MinCheck
    Size4 --> MinCheck
    Size5 --> MinCheck
    Size6 --> MinCheck

    MinCheck -->|Yes| CreateButton[Create Button]
    MinCheck -->|No| IncreaseSize[Increase to min size]
    IncreaseSize --> CreateButton

    CreateButton --> AddPadding[Add touch padding]
    AddPadding --> MakeInteractive[Set interactive]
    MakeInteractive --> Final[Button Ready]

    style Detect fill:#87CEEB
    style MinCheck fill:#FFD700
    style Final fill:#90EE90
```

## Orientation Change Flow

```mermaid
stateDiagram-v2
    [*] --> LoadingGame: Game starts

    LoadingGame --> DetectInitialOrientation: Check orientation

    DetectInitialOrientation --> PortraitMode: Portrait detected
    DetectInitialOrientation --> LandscapeMode: Landscape detected

    PortraitMode --> WaitingPortrait: Render portrait UI
    LandscapeMode --> WaitingLandscape: Render landscape UI

    WaitingPortrait --> DetectChange: User rotates device
    WaitingLandscape --> DetectChange: User rotates device

    DetectChange --> Transitioning: Orientation changing

    Transitioning --> PauseGame: Pause gameplay (optional)
    PauseGame --> RecalculateDimensions: Get new width/height
    RecalculateDimensions --> UpdateScale: Update ScaleManager

    UpdateScale --> RepositionUI: Reposition all UI elements
    RepositionUI --> CheckNewOrientation: Determine new orientation

    CheckNewOrientation -->|Portrait| PortraitMode: Apply portrait layout
    CheckNewOrientation -->|Landscape| LandscapeMode: Apply landscape layout

    PortraitMode --> ResumeGame: Resume gameplay
    LandscapeMode --> ResumeGame: Resume gameplay

    ResumeGame --> WaitingPortrait: If portrait
    ResumeGame --> WaitingLandscape: If landscape

    WaitingPortrait --> [*]: Game exit
    WaitingLandscape --> [*]: Game exit

    note right of Transitioning
        Smooth transition
        No jarring jumps
        Maintain game state
    end note

    note right of RepositionUI
        Reposition buttons
        Resize touch targets
        Adjust text size
        Recenter elements
    end note
```

## Notes

### Architecture Decisions

**Scale Mode Choice: FIT**
- FIT mode scales canvas to fit viewport while maintaining aspect ratio
- Prevents stretching (keeps game looking correct)
- Adds letterboxing if needed (black bars top/bottom or sides)
- Alternative RESIZE mode changes game dimensions (requires more work)

**Touch Target Sizing**
- Desktop: 40-50px (mouse is precise)
- Tablet: 50-60px (finger is less precise)
- Phone: 60-70px (smallest screen, needs largest targets)
- Based on Apple HIG (44x44px) and Android guidelines (48dp)

**Device Detection Strategy**
- Use user agent string for initial detection
- Use screen dimensions as secondary check
- Assume touch support if mobile/tablet detected
- Phaser handles most touch/mouse unification

**Orientation Handling**
- Support both portrait and landscape on tablets (common use case)
- Consider portrait-only on phones (most natural for this game)
- Pause game during orientation change (optional, prevents confusion)
- Reposition UI elements smoothly after rotation

### Why This Design?

**Phaser Scale Manager**
- Built-in solution (no custom scaling code needed)
- Handles resize events automatically
- Provides orientation change detection
- Manages aspect ratio preservation

**Responsive Base Class**
- All scenes extend ResponsiveScene
- Shared device detection logic
- Consistent resize handling
- DRY principle (don't repeat yourself)

**Touch Input Unification**
- Phaser treats touch and mouse as "pointers"
- Use pointerdown/pointermove for both
- No separate touch vs mouse handlers needed
- Simplifies code significantly

**Viewport Meta Configuration**
- Disables zoom (prevents double-tap zoom conflicts)
- Disables scroll (prevents pull-to-refresh interference)
- Sets initial scale to 1.0 (no default zoom)
- Critical for smooth touch experience

### Component Relationships

1. **ResponsiveGameConfig configures ScaleManager**
   - Sets scale mode (FIT)
   - Sets auto-center (CENTER_BOTH)
   - Defines min/max dimensions
   - ScaleManager handles the rest

2. **DeviceDetector informs UI creation**
   - Scenes check device type at create()
   - UI components adjust size based on device
   - Touch targets increase for mobile
   - Font sizes adjust for readability

3. **OrientationHandler coordinates layout changes**
   - Listens to ScaleManager orientation events
   - Notifies scenes of orientation changes
   - Scenes adjust layouts accordingly
   - Smooth transitions between orientations

4. **TouchInputManager unifies input**
   - Prevents default browser behaviors (zoom, scroll)
   - Configures multi-touch support (3 pointers)
   - Handles tap, drag, swipe gestures
   - Works identically on desktop (mouse) and mobile (touch)

5. **ResponsiveUI creates adaptive components**
   - Buttons scale based on device type
   - Sliders adjust width/height for touch
   - Text sizes calculated for readability
   - All components are touch-friendly

### Performance Considerations

**Canvas Scaling**
- FIT mode scales canvas via CSS (GPU-accelerated)
- No performance penalty for scaling
- Maintains 60fps on modern devices
- May drop to 30fps on older devices (acceptable)

**Resize Event Handling**
- Resize events can fire frequently during rotation
- Debounce if needed (only process last event)
- Phaser's built-in handling is efficient
- No manual throttling needed in most cases

**Touch Input Processing**
- Touch events have similar cost to mouse events
- Phaser's pointer system is optimized
- Multi-touch adds minimal overhead
- No performance concern for this game

**Memory Management**
- Orientation changes don't recreate scenes (just reposition)
- UI elements reuse existing objects
- No memory leaks from resize handlers
- Proper cleanup when scenes destroy

This design provides a robust responsive system that adapts Aurora's Letter Adventure to any device size while maintaining consistent gameplay and performance. The use of Phaser's built-in Scale Manager minimizes custom code while providing professional-grade responsiveness.
