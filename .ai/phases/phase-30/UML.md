# Phase 30: Letter Builder - Draggable Pieces - UML

## Class Diagram

```mermaid
classDiagram
    class LetterPiece {
        -strokeData: Object
        -originalX: Number
        -originalY: Number
        -isDragging: Boolean
        -isSnapped: Boolean
        -snapZone: Object
        -trail: ParticleEmitter
        -graphics: Graphics
        +constructor(scene, x, y, strokeData)
        +createGraphics()
        +setupDragHandlers()
        +onDragStart(pointer)
        +onDrag(pointer, dragX, dragY)
        +onDragEnd(pointer)
        +createTrail()
        +updateTrail()
        +destroyTrail()
        +returnToStart()
        +snapToZone(zone)
        +reset()
    }

    class LetterBuilderScene {
        -letterPieces: Array~LetterPiece~
        +generateLetterPieces()
        +clearLetterPieces()
        +getPieceById(id) LetterPiece
    }

    class StrokeData {
        <<data>>
        +id: String
        +type: String
        +startX: Number
        +startY: Number
        +endX: Number
        +endY: Number
        +width: Number
        +height: Number
    }

    class LetterStrokeData {
        <<static>>
        +LETTER_STROKES: Object
        +getStrokesForLetter(letter) Array~StrokeData~
    }

    class PhaserContainer {
        <<framework>>
        +x: Number
        +y: Number
        +add(child)
        +setInteractive(config)
        +on(event, callback)
    }

    LetterPiece --|> PhaserContainer : extends
    LetterPiece --> StrokeData : uses
    LetterBuilderScene --> LetterPiece : creates/manages
    LetterBuilderScene ..> LetterStrokeData : queries
    LetterStrokeData --> StrokeData : provides
```

## Sequence Diagram - Piece Generation

```mermaid
sequenceDiagram
    participant LB as LetterBuilderScene
    participant LSD as LetterStrokeData
    participant LP as LetterPiece
    participant Phaser as Phaser Engine

    LB->>LB: loadNextLetter()
    Note over LB: Current letter = "A"

    LB->>LB: generateLetterPieces()
    LB->>LSD: getStrokesForLetter("A")
    LSD-->>LB: [leftStroke, rightStroke, barStroke]

    loop For each stroke
        LB->>LP: new LetterPiece(x, y, strokeData)
        LP->>LP: createGraphics()
        Note over LP: Render stroke visually

        LP->>LP: setupDragHandlers()
        LP->>Phaser: setInteractive({draggable: true})

        LP->>Phaser: Add to scene
        LB->>LB: letterPieces.push(piece)

        LB->>Phaser: Animate piece spawn
        Note over Phaser: Fade in + scale in
    end

    LB-->>User: Pieces ready to drag
```

## Sequence Diagram - Drag Interaction

```mermaid
sequenceDiagram
    actor User
    participant Piece as LetterPiece
    participant Scene as LetterBuilderScene
    participant Input as Phaser Input
    participant Tween as Phaser Tweens
    participant Audio as AudioManager

    User->>Piece: Pointer down (grab)
    Piece->>Input: dragstart event
    Input->>Piece: onDragStart(pointer)

    Piece->>Tween: Scale to 1.1
    Piece->>Piece: createTrail()
    Piece->>Audio: play('pickupSound')
    Piece->>Scene: bringToTop(piece)

    loop While dragging
        User->>Piece: Move pointer
        Input->>Piece: drag event
        Piece->>Piece: onDrag(pointer, x, y)
        Note over Piece: Clamp position to bounds
        Piece->>Piece: updateTrail()
    end

    User->>Piece: Pointer up (release)
    Piece->>Input: dragend event
    Input->>Piece: onDragEnd(pointer)

    Piece->>Piece: Check if snapped
    alt Not snapped (Phase 30)
        Piece->>Tween: Animate to originalX, originalY
    else Snapped (Phase 31)
        Piece->>Piece: snapToZone(zone)
    end

    Piece->>Piece: destroyTrail()
    Piece->>Tween: Scale to 1.0
    Piece->>Audio: play('releaseSound')
```

## Component Diagram - Piece Structure

```mermaid
graph TB
    subgraph LetterPiece Container
        Graphics[Graphics Object]
        HitArea[Interactive Hit Area]
        Shadow[Shadow Effect - optional]
    end

    subgraph Piece State
        Position[x, y coordinates]
        OriginalPos[originalX, originalY]
        DragState[isDragging flag]
        SnapState[isSnapped flag]
        StrokeRef[strokeData reference]
    end

    subgraph Visual Effects
        Trail[Trail Effect]
        ScaleTween[Scale Animation]
        ColorTween[Color Highlight]
    end

    subgraph Input Handlers
        DragStart[dragstart handler]
        Drag[drag handler]
        DragEnd[dragend handler]
    end

    LetterPiece --> Graphics
    LetterPiece --> HitArea
    LetterPiece --> Position
    LetterPiece --> OriginalPos
    LetterPiece --> DragState
    LetterPiece --> StrokeRef
    LetterPiece --> Trail
    LetterPiece --> DragStart
    LetterPiece --> Drag
    LetterPiece --> DragEnd

    DragStart --> ScaleTween
    DragStart --> ColorTween
    DragStart --> Trail
    Drag --> Trail
    DragEnd --> ScaleTween
```

## State Diagram - Piece Lifecycle

```mermaid
stateDiagram-v2
    [*] --> Created: new LetterPiece()
    Created --> Spawning: Spawn animation
    Spawning --> Idle: Animation complete

    Idle --> DragStart: pointerdown
    DragStart --> Dragging: Scale up, create trail
    Dragging --> Dragging: pointermove (update position)
    Dragging --> DragEnd: pointerup

    DragEnd --> CheckSnap: Check snap zones (Phase 31)
    CheckSnap --> Returning: Not snapped
    CheckSnap --> Snapped: In snap zone

    Returning --> Idle: Return to original position
    Snapped --> Locked: Disable interaction

    Idle --> Reset: reset() called
    Locked --> Reset: reset() called
    Reset --> Idle: Enable interaction

    Locked --> Destroyed: Letter complete
    Idle --> Destroyed: Scene cleanup
    Destroyed --> [*]
```

## Data Structure Diagram - Stroke Data

```mermaid
graph TD
    LetterStrokeData[LETTER_STROKES Object]

    LetterStrokeData --> LetterA["'A': Array of 3 strokes"]
    LetterStrokeData --> LetterB["'B': Array of 3 strokes"]
    LetterStrokeData --> LetterI["'I': Array of 3 strokes"]
    LetterStrokeData --> LetterL["'L': Array of 2 strokes"]
    LetterStrokeData --> MoreLetters["... 22 more letters"]

    LetterA --> A1[Stroke 1: left diagonal]
    LetterA --> A2[Stroke 2: right diagonal]
    LetterA --> A3[Stroke 3: horizontal bar]

    A1 --> A1Data[id: 'A_left'<br/>type: 'line'<br/>startX: -40<br/>startY: 40<br/>endX: 0<br/>endY: -40<br/>width: 50<br/>height: 80]

    LetterL --> L1[Stroke 1: vertical line]
    LetterL --> L2[Stroke 2: bottom horizontal]

    L1 --> L1Data[id: 'L_vertical'<br/>type: 'line'<br/>startX: -20<br/>startY: -40<br/>endX: -20<br/>endY: 40<br/>width: 10<br/>height: 80]
```

## UI Layout Diagram - Pieces Area

```mermaid
graph TB
    Screen[Game Screen 800x600]

    subgraph Pieces Area - 420 to 600px
        direction LR
        Piece1[Piece 1<br/>x: 250, y: 510]
        Piece2[Piece 2<br/>x: 400, y: 510]
        Piece3[Piece 3<br/>x: 550, y: 510]
        Piece4[Piece 4 - optional<br/>x: 700, y: 510]
    end

    subgraph Piece Spacing
        Spacing1[150px between pieces]
        Spacing2[Centered around x=400]
    end

    Screen --> Piece1
    Screen --> Piece2
    Screen --> Piece3
    Screen --> Piece4

    style Piece1 fill:#8B4513,opacity:0.5
    style Piece2 fill:#8B4513,opacity:0.5
    style Piece3 fill:#8B4513,opacity:0.5
    style Piece4 fill:#8B4513,opacity:0.5
```

## Animation Timeline - Piece Spawn

```mermaid
gantt
    title Piece Spawn Animation Sequence
    dateFormat X
    axisFormat %L ms

    section Piece 1
    Fade + Scale: 0, 400

    section Piece 2
    Fade + Scale: 100, 500

    section Piece 3
    Fade + Scale: 200, 600

    section Piece 4
    Fade + Scale: 300, 700

    section Enable Drag
    Make Interactive: 700, 710
```

## Drag Performance Flow

```mermaid
graph LR
    PointerMove[Pointer Move Event]

    PointerMove --> InputSystem[Phaser Input System]
    InputSystem --> DragEvent[Emit 'drag' event]
    DragEvent --> OnDrag[piece.onDrag]

    OnDrag --> ClampPos[Clamp position]
    ClampPos --> UpdateXY[Update piece.x, piece.y]
    UpdateXY --> UpdateTrail[Update trail effect]

    UpdateTrail --> RenderLoop[Phaser Render Loop]
    RenderLoop --> Display[Display to user]

    style PointerMove fill:#90EE90
    style Display fill:#90EE90
```

## Trail Effect Strategies

```mermaid
graph TB
    TrailImplementation[Trail Implementation Options]

    TrailImplementation --> Option1[Particle Emitter]
    TrailImplementation --> Option2[Graphics Trail]
    TrailImplementation --> Option3[Sprite Trail]

    Option1 --> Particles[Phaser Particles<br/>+ Visually impressive<br/>+ Easy to configure<br/>- Can impact performance<br/>- More memory usage]

    Option2 --> Graphics[Graphics API<br/>+ Best performance<br/>+ Low memory<br/>- More code<br/>- Less impressive]

    Option3 --> Sprites[Sprite chain<br/>+ Good visuals<br/>+ Moderate performance<br/>- Complex to manage<br/>- Requires sprite assets]

    style Option2 fill:#90EE90
    Note1[Recommendation: Graphics<br/>for best performance]
    Option2 -.-> Note1
```

## Piece Bounds Clamping

```mermaid
graph TD
    DragEvent[Drag Event: dragX, dragY]

    DragEvent --> CheckX{dragX < 50?}
    CheckX -->|Yes| ClampMinX[x = 50]
    CheckX -->|No| CheckMaxX{dragX > 750?}
    CheckMaxX -->|Yes| ClampMaxX[x = 750]
    CheckMaxX -->|No| UseX[x = dragX]

    ClampMinX --> CheckY
    ClampMaxX --> CheckY
    UseX --> CheckY

    CheckY{dragY < 100?}
    CheckY -->|Yes| ClampMinY[y = 100]
    CheckY -->|No| CheckMaxY{dragY > 550?}
    CheckMaxY -->|Yes| ClampMaxY[y = 550]
    CheckMaxY -->|No| UseY[y = dragY]

    ClampMinY --> SetPosition
    ClampMaxY --> SetPosition
    UseY --> SetPosition

    SetPosition[piece.x = x<br/>piece.y = y]
```

## Object Pooling Strategy (Optional Optimization)

```mermaid
graph TB
    TrailPool[Trail Particle Pool]

    TrailPool --> Active[Active Trails<br/>Currently in use]
    TrailPool --> Inactive[Inactive Trails<br/>Awaiting reuse]

    DragStart[Drag Start Event]
    DragEnd[Drag End Event]

    DragStart --> GetTrail[Get from pool]
    GetTrail --> Inactive
    Inactive --> Active
    Active --> Display[Display trail]

    DragEnd --> ReturnTrail[Return to pool]
    Display --> ReturnTrail
    ReturnTrail --> Inactive

    style TrailPool fill:#87CEEB
    style Active fill:#90EE90
    style Inactive fill:#FFD700
```

## Notes

### Architecture Decisions

**1. LetterPiece as Container**
- Extends Phaser.GameObjects.Container
- Allows grouping graphics, hit areas, effects
- Easy position/rotation/scale management
- Natural parent for child elements

**2. Stroke Data as Static Object**
- All 26 letters defined in one place
- Easy to modify and test
- Can be loaded from JSON if needed
- Separation of data from logic

**3. Drag Implementation**
- Uses Phaser's built-in drag system
- Reliable and performant
- Automatic pointer tracking
- Multi-touch support

**4. Trail Effect Strategy**
- Graphics API recommended for performance
- Particle emitter as alternative for visual impact
- Trail length limited (max 20 points)
- Auto-cleanup to prevent memory leaks

**5. Bounds Clamping**
- Keeps pieces visible and accessible
- Smooth clamping (no jarring stops)
- Margin from edges (50px) for comfort
- Prevents pieces getting lost

### Performance Considerations

**Optimization Priorities:**
1. **Drag responsiveness**: < 50ms latency critical
2. **Trail rendering**: Use efficient Graphics API
3. **Object creation**: Minimize during drag (no new objects)
4. **Z-index management**: Only update when needed
5. **Animation timing**: Use Phaser tweens (optimized)

**Memory Management:**
- Destroy trails when piece released
- Clear piece references when letter complete
- Pool trail objects if needed
- Avoid circular references

**Frame Rate Targets:**
- Idle: 60fps (easy to maintain)
- Dragging 1 piece: 60fps (must maintain)
- Dragging with trail: 60fps (requires optimization)
- Multiple pieces (sequential): 60fps (should maintain)

### Stroke Data Design Guidelines

**Simple Letters (2-3 strokes):**
- I, L, T, V, X
- Good for beginners
- Clear piece separation
- Easy to assemble

**Medium Letters (3 strokes):**
- A, H, E, F, K, N, Y, Z
- Moderate difficulty
- Some piece overlap
- Requires spatial reasoning

**Complex Letters (4+ strokes):**
- M, W, B
- Advanced difficulty
- Multiple overlapping pieces
- Requires planning

**Stroke Type Considerations:**
- **line**: Straight line (most common)
- **arc**: Curved stroke (B, D, O, P, etc.)
- **diagonal**: Angled line (A, K, M, N, etc.)
- **curve**: Complex curve (S, etc.)

This architecture provides a solid foundation for intuitive, responsive drag-and-drop interaction while maintaining high performance for ADHD-friendly smooth gameplay.
