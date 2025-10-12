# Phase 7: Letter Pop - Single Static Bubble - UML

## Class Diagram

```mermaid
classDiagram
    class Bubble {
        -Scene scene
        -String letter
        -Number radius
        -Graphics bubbleGraphics
        -Text letterText
        -Number x
        -Number y
        +constructor(scene, x, y, letter)
        +createBubble()
        +createLetter()
        +pop()
        +destroy()
    }

    class LetterPopScene {
        -Graphics background
        -Text titleText
        -Text subtitleText
        -Rectangle backButton
        -Bubble bubble
        +constructor()
        +preload()
        +create()
        +createBackground()
        +createTitle()
        +createBackButton()
        +createBubble()
    }

    class PhaserContainer {
        <<Phaser.GameObjects.Container>>
        +scene
        +x
        +y
        +add(child)
        +remove(child)
        +setPosition(x, y)
        +destroy()
    }

    class PhaserScene {
        <<Phaser.Scene>>
        +add
        +make
        +textures
        +cameras
    }

    class Graphics {
        <<Phaser.GameObjects.Graphics>>
        +fillStyle(color, alpha)
        +fillCircle(x, y, radius)
        +lineStyle(width, color, alpha)
        +strokeCircle(x, y, radius)
    }

    class Text {
        <<Phaser.GameObjects.Text>>
        +text
        +style
        +setOrigin(x, y)
    }

    PhaserContainer <|-- Bubble
    PhaserScene <|-- LetterPopScene
    LetterPopScene --> Bubble : creates and contains
    Bubble --> Graphics : uses
    Bubble --> Text : uses
    Bubble --> PhaserScene : belongs to
```

## Sequence Diagram: Bubble Creation

```mermaid
sequenceDiagram
    actor Dev as Developer
    participant Scene as LetterPopScene
    participant BubbleClass as Bubble Class
    participant Container as Phaser.Container
    participant Graphics as Graphics Object
    participant Text as Text Object
    participant Display as Screen

    Dev->>Scene: create() called
    Scene->>Scene: createBackground()
    Scene->>Scene: createTitle()
    Scene->>Scene: createBackButton()
    Scene->>Scene: createBubble()

    Scene->>BubbleClass: new Bubble(this, 400, 300, 'A')
    BubbleClass->>Container: super(scene, x, y)
    Container-->>BubbleClass: Container initialized

    BubbleClass->>BubbleClass: Store properties (letter, radius)
    BubbleClass->>BubbleClass: createBubble()

    BubbleClass->>Graphics: create graphics object
    Graphics->>Graphics: Draw shadow circle
    Graphics->>Graphics: Draw main circle with gradient layers
    Graphics->>Graphics: Draw highlight circle
    Graphics->>Graphics: Draw border stroke
    Graphics-->>BubbleClass: Bubble graphics complete

    BubbleClass->>Container: add(graphics)
    BubbleClass->>BubbleClass: createLetter()

    BubbleClass->>Text: create text object with 'A'
    Text->>Text: Apply style (56px, bold, dark)
    Text->>Text: setOrigin(0.5, 0.5)
    Text-->>BubbleClass: Letter text complete

    BubbleClass->>Container: add(letterText)
    BubbleClass->>Scene: scene.add.existing(this)
    Scene-->>Display: Render bubble with letter

    Display-->>Dev: Bubble visible on screen
```

## Sequence Diagram: Gradient Rendering

```mermaid
sequenceDiagram
    participant Bubble as Bubble.createBubble()
    participant Graphics as Graphics Object
    participant Renderer as Phaser Renderer

    Bubble->>Graphics: Create graphics object

    Note over Bubble,Graphics: Layer 1: Shadow
    Bubble->>Graphics: fillStyle(0xcccccc, 0.3)
    Bubble->>Graphics: fillCircle(0, 0, radius+5)
    Graphics-->>Renderer: Draw shadow layer

    Note over Bubble,Graphics: Layer 2: Outer gradient
    Bubble->>Graphics: fillStyle(0xffffff, 0.9)
    Bubble->>Graphics: fillCircle(0, 0, radius)
    Graphics-->>Renderer: Draw outer layer

    Note over Bubble,Graphics: Layer 3: Middle gradient
    Bubble->>Graphics: fillStyle(0xe0e0ff, 0.8)
    Bubble->>Graphics: fillCircle(0, 0, radius-10)
    Graphics-->>Renderer: Draw middle layer

    Note over Bubble,Graphics: Layer 4: Inner gradient
    Bubble->>Graphics: fillStyle(0xc0c0ff, 0.7)
    Bubble->>Graphics: fillCircle(0, 0, radius-20)
    Graphics-->>Renderer: Draw inner layer

    Note over Bubble,Graphics: Layer 5: Highlight
    Bubble->>Graphics: fillStyle(0xffffff, 0.6)
    Bubble->>Graphics: fillCircle(-15, -15, 20)
    Graphics-->>Renderer: Draw highlight

    Note over Bubble,Graphics: Layer 6: Border
    Bubble->>Graphics: lineStyle(3, 0xaaaaff, 0.8)
    Bubble->>Graphics: strokeCircle(0, 0, radius)
    Graphics-->>Renderer: Draw border

    Renderer-->>Bubble: Gradient bubble complete
```

## State Diagram: Bubble Lifecycle

```mermaid
stateDiagram-v2
    [*] --> Created: new Bubble()
    Created --> InitializingContainer: super() called
    InitializingContainer --> StoringProperties: Store letter, radius
    StoringProperties --> CreatingGraphics: createBubble()

    CreatingGraphics --> DrawingShadow: Layer 1
    DrawingShadow --> DrawingGradient: Layers 2-4
    DrawingGradient --> DrawingHighlight: Layer 5
    DrawingHighlight --> DrawingBorder: Layer 6
    DrawingBorder --> GraphicsComplete: Graphics added to container

    GraphicsComplete --> CreatingText: createLetter()
    CreatingText --> StylingText: Apply font, size, color
    StylingText --> CenteringText: setOrigin(0.5)
    CenteringText --> TextComplete: Text added to container

    TextComplete --> AddingToScene: scene.add.existing()
    AddingToScene --> Active: Bubble visible on screen

    Active --> [*]: destroy() called
```

## Component Hierarchy

```mermaid
graph TB
    Scene[LetterPopScene]
    Scene --> BG[Background Graphics]
    Scene --> Title[Title Text]
    Scene --> Subtitle[Subtitle Text]
    Scene --> BackBtn[Back Button]
    Scene --> BubbleContainer[Bubble Container 400, 300]

    BubbleContainer --> BubbleGraphics[Bubble Graphics Object]
    BubbleContainer --> LetterText[Letter Text Object]

    BubbleGraphics --> Layer1[Shadow Layer<br/>radius+5, light gray, 30% alpha]
    BubbleGraphics --> Layer2[Outer Gradient<br/>radius, white, 90% alpha]
    BubbleGraphics --> Layer3[Middle Gradient<br/>radius-10, light purple, 80% alpha]
    BubbleGraphics --> Layer4[Inner Gradient<br/>radius-20, purple, 70% alpha]
    BubbleGraphics --> Layer5[Highlight<br/>offset -15,-15, white, 60% alpha]
    BubbleGraphics --> Layer6[Border<br/>3px stroke, purple, 80% alpha]

    LetterText --> TextStyle[Font: 56px Arial Bold<br/>Color: #333333<br/>Origin: 0.5, 0.5]

    style Scene fill:#E6E6FA
    style BubbleContainer fill:#FFB6C1
    style BubbleGraphics fill:#98FB98
    style LetterText fill:#FFD700
```

## Object Composition Diagram

```mermaid
graph LR
    Bubble[Bubble Instance] --> Container[Phaser Container]
    Container --> Position["Position (400, 300)"]

    Bubble --> Graphics[Graphics Object]
    Graphics --> Shadow[Shadow Circle]
    Graphics --> GradientLayers[Gradient Circles x3]
    Graphics --> Highlight[Highlight Circle]
    Graphics --> Border[Border Stroke]

    Bubble --> Text[Text Object]
    Text --> Letter["Letter 'A'"]
    Text --> Style[Font Style]
    Text --> Origin[Center Origin]

    Container --> Scene[LetterPopScene]
    Scene --> DisplayList[Scene Display List]
    DisplayList --> Renderer[Render to Canvas]
```

## Activity Diagram: Bubble Creation Flow

```mermaid
flowchart TD
    Start([createBubble called]) --> NewInstance[new Bubble this, 400, 300, A]
    NewInstance --> Constructor[Bubble constructor]

    Constructor --> StoreScene[Store scene reference]
    StoreScene --> StoreLetter[Store letter = A]
    StoreLetter --> StoreRadius[Store radius = 70]
    StoreRadius --> CallSuper[Call super scene, x, y]
    CallSuper --> ContainerInit[Container initialized]

    ContainerInit --> CreateGraphics{createBubble}
    CreateGraphics --> InitGraphics[graphics = scene.add.graphics]

    InitGraphics --> DrawShadow[Draw shadow circle]
    DrawShadow --> DrawOuter[Draw outer gradient circle]
    DrawOuter --> DrawMiddle[Draw middle gradient circle]
    DrawMiddle --> DrawInner[Draw inner gradient circle]
    DrawInner --> DrawHighlight[Draw highlight circle]
    DrawHighlight --> DrawBorder[Draw border stroke]
    DrawBorder --> AddGraphics[add graphics to container]

    AddGraphics --> CreateLetter{createLetter}
    CreateLetter --> InitText[letterText = scene.add.text]
    InitText --> SetContent[Set text content to A]
    SetContent --> SetStyle[Apply font style]
    SetStyle --> SetOrigin[setOrigin 0.5, 0.5]
    SetOrigin --> AddText[add text to container]

    AddText --> AddToScene[scene.add.existing this]
    AddToScene --> Complete([Bubble visible])

    style Start fill:#90EE90
    style CreateGraphics fill:#87CEEB
    style CreateLetter fill:#FFD700
    style Complete fill:#98FB98
```

## Data Flow Diagram

```mermaid
flowchart LR
    Input[Input: scene, x=400, y=300, letter=A]
    Input --> Constructor[Bubble Constructor]

    Constructor --> Props[Store Properties]
    Props --> Radius[radius: 70]
    Props --> Letter[letter: A]
    Props --> Position[x: 400, y: 300]

    Position --> Graphics[Graphics Pipeline]
    Graphics --> Layers[Draw 6 Layers]
    Layers --> Shadow[Shadow: gray, r+5]
    Layers --> Grad1[Outer: white, r]
    Layers --> Grad2[Middle: light purple, r-10]
    Layers --> Grad3[Inner: purple, r-20]
    Layers --> High[Highlight: white, offset]
    Layers --> Border[Border: purple, 3px]

    Shadow --> Composite1[Composite Graphics]
    Grad1 --> Composite1
    Grad2 --> Composite1
    Grad3 --> Composite1
    High --> Composite1
    Border --> Composite1

    Letter --> TextPipe[Text Pipeline]
    TextPipe --> TextCreate[Create Text Object]
    TextCreate --> TextStyle[Apply Style: 56px bold]
    TextStyle --> TextCenter[Center: origin 0.5]

    Composite1 --> Container[Add to Container]
    TextCenter --> Container

    Container --> Scene[Add to Scene]
    Scene --> Display[Render to Screen]
```

## Scene Layout Diagram

```mermaid
graph TB
    Canvas["Canvas (800x600)"]

    Canvas --> BackButton["Back Button<br/>(100, 50)"]
    Canvas --> Title["Title: Letter Pop!<br/>(400, 80)"]
    Canvas --> Subtitle["Subtitle<br/>(400, 140)"]
    Canvas --> BubblePos["Bubble Position<br/>(400, 300)"]

    BubblePos --> BubbleVisual["┌─────────┐<br/>│         │<br/>│    A    │<br/>│         │<br/>└─────────┘<br/>Radius: 70px"]

    BackButton --> TopLeft["Top-Left Corner<br/>Navigation"]
    Title --> TopCenter["Top-Center<br/>Game Identity"]
    Subtitle --> BelowTitle["Below Title<br/>Instructions"]
    BubblePos --> Center["Center of Screen<br/>Visual Focus"]

    style Canvas fill:#F0F0F0
    style BackButton fill:#ff6b6b
    style Title fill:#ffffff
    style BubbleVisual fill:#e6e6ff
    style BubblePos fill:#87CEEB
```

## Gradient Rendering Algorithm

```mermaid
flowchart TD
    Start([Start Gradient]) --> CreateGraphics[Create Graphics Object]
    CreateGraphics --> DefineRadius[radius = 70]

    DefineRadius --> Layer1{Draw Layer 1}
    Layer1 --> Shadow["fillStyle(gray, 0.3)<br/>fillCircle(0, 0, 75)"]
    Shadow --> Layer2{Draw Layer 2}

    Layer2 --> Outer["fillStyle(white, 0.9)<br/>fillCircle(0, 0, 70)"]
    Outer --> Layer3{Draw Layer 3}

    Layer3 --> Middle["fillStyle(light purple, 0.8)<br/>fillCircle(0, 0, 60)"]
    Middle --> Layer4{Draw Layer 4}

    Layer4 --> Inner["fillStyle(purple, 0.7)<br/>fillCircle(0, 0, 50)"]
    Inner --> Layer5{Draw Layer 5}

    Layer5 --> Highlight["fillStyle(white, 0.6)<br/>fillCircle(-15, -15, 20)"]
    Highlight --> Layer6{Draw Layer 6}

    Layer6 --> Border["lineStyle(3, purple, 0.8)<br/>strokeCircle(0, 0, 70)"]
    Border --> Complete([Gradient Complete])

    style Start fill:#90EE90
    style Layer1 fill:#FFE4B5
    style Layer2 fill:#FFE4B5
    style Layer3 fill:#FFE4B5
    style Layer4 fill:#FFE4B5
    style Layer5 fill:#FFE4B5
    style Layer6 fill:#FFE4B5
    style Complete fill:#98FB98
```

## Text Centering Mechanism

```mermaid
flowchart TD
    Start([Create Letter Text]) --> CreateText[scene.add.text 0, 0, A]
    CreateText --> DefaultOrigin["Default Origin<br/>Top-Left (0, 0)"]

    DefaultOrigin --> Problem["Text offset from bubble center<br/>❌ Not aligned"]
    Problem --> Solution[Call setOrigin 0.5, 0.5]

    Solution --> NewOrigin["New Origin<br/>Center (0.5, 0.5)"]
    NewOrigin --> Calculate["Calculate text bounds<br/>width, height"]
    Calculate --> AdjustX["Adjust X: -width/2"]
    AdjustX --> AdjustY["Adjust Y: -height/2"]
    AdjustY --> Centered["Text centered at position<br/>✓ Perfect alignment"]

    Centered --> Complete([Letter Centered])

    style Problem fill:#ffcccc
    style Solution fill:#90EE90
    style Centered fill:#98FB98
    style Complete fill:#FFD700
```

## Notes

### Architecture Decisions

**Bubble as Container**
- Extends Phaser.GameObjects.Container for composability
- Contains both graphics (bubble shape) and text (letter)
- Easy to move, scale, or animate as a single unit
- Can add more children in future (animations, effects)

**Graphics-Based Rendering**
- Uses Graphics object for maximum flexibility
- Gradient achieved by layering circles with decreasing alpha
- Could alternatively use canvas texture for smoother gradients
- Current approach is simpler and more maintainable

**Letter as Text Object**
- Standard Phaser text object
- Easy to change letter dynamically
- setOrigin(0.5) ensures perfect centering
- Could be replaced with bitmap font for performance if needed

**Gradient Technique**
- Multiple overlapping circles create gradient effect
- Each layer has slightly different color and alpha
- Simulates 3D spherical shading
- Highlight circle creates glossy appearance

### Why This Design?

**Container Pattern**
- Bubble is self-contained unit
- Can be instantiated multiple times easily
- All components move together
- Clean separation of concerns

**Gradient Layers**
- Simple to implement
- Good visual result
- Performant (drawn once, not animated)
- Easy to adjust colors/radius

**Static for Now**
- No animation in this phase (intentional)
- Establishes visual foundation
- Future phases will add:
  - Floating animation
  - Click interaction
  - Pop effects
  - Sound

**Reusability**
- Bubble class accepts any letter as parameter
- Can easily create bubbles for any letter A-Z
- Future phases will use this for multiple bubbles
- Same class can be used for different game modes

### Component Relationships

1. **Bubble owns its visual elements**
   - Graphics for bubble shape
   - Text for letter display
   - Both are children of Container

2. **LetterPopScene owns Bubble instance**
   - Scene creates bubble
   - Scene positions bubble
   - Scene can later add more bubbles

3. **Bubble is independent**
   - Doesn't depend on specific scene
   - Can be added to any scene
   - Self-contained creation logic

4. **Layering creates depth**
   - Multiple circles with alpha blending
   - Inner circles darker (depth perception)
   - Highlight creates 3D effect
   - Border provides definition

### Visual Hierarchy

**In the scene:**
1. Background (blue gradient)
2. Title text (top)
3. Bubble (center) ← Visual focus
4. Letter (in bubble) ← Learning target
5. Back button (top-left)

**In the bubble:**
1. Shadow (outermost, subtle)
2. Main gradient (bulk of bubble)
3. Highlight (top-left, glossy effect)
4. Border (defines edge)
5. Letter (centermost, highest contrast)

### Performance Considerations

**Efficient Rendering**
- Graphics drawn once in create()
- No per-frame updates (static)
- Lightweight objects (one container, one graphics, one text)
- Scales well to multiple bubbles

**Memory Usage**
- One graphics object per bubble (reasonable)
- No dynamic textures created
- Text object reuses font cache
- Clean destroy() for cleanup

### Future Extensions

**This foundation supports:**
- **Phase 8+**: Floating animation (tween bubble.y)
- **Phase 9+**: Click interaction (setInteractive on container)
- **Phase 10+**: Pop animation (scale down, fade out)
- **Phase 11+**: Multiple bubbles (array of Bubble instances)
- **Phase 12+**: Random letters (pass different letter parameter)
- **Phase 13+**: Difficulty levels (different speeds, sizes)

**The Bubble class is designed to be:**
- Simple (minimal complexity for Phase 7)
- Extensible (easy to add features)
- Reusable (works with any letter)
- Maintainable (clear, well-organized code)

This phase establishes the core game object that all future gameplay will build upon.
