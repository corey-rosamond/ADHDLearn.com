# Phase 38: Dance & Trace - Path Detection - UML

## Class Diagram

```mermaid
classDiagram
    class PathDetector {
        -Scene scene
        -Object letterData
        -Number hitboxRadius
        -Number currentStroke
        -Number strokeProgress
        -Boolean isOnPath
        -Object lastValidPoint
        -Array trailPoints
        -Number consecutiveOffPathFrames

        +checkPath(x, y) PathCheckResult
        +updateProgress(pathCheck) Boolean
        +completeStroke() Boolean
        +checkDirection(prevX, prevY, currX, currY) Boolean
        +reset()
        +getProgressPercentage() Number
        +getCurrentStroke() Number
        -calculateDynamicHitbox(pointIndex) Number
        -interpolatePathPoint(progress) Point
    }

    class PathCheckResult {
        +Boolean onPath
        +Object nearestPoint
        +Number distance
        +Number hitboxUsed
    }

    class TrailRenderer {
        -Graphics graphics
        -Array trailPoints
        -Number maxTrailPoints
        -Number trailWidth
        -Number trailAlpha

        +addPoint(x, y, progress)
        +render()
        +clear()
        +fadeOut()
        -getRainbowColor(progress) Number
        -interpolateColor(progress) Number
    }

    class DirectionChecker {
        -Object letterData
        -Number currentStroke
        -Number toleranceAngle

        +isMovingForward(prevX, prevY, currX, currY) Boolean
        +calculateExpectedDirection(progress) Vector
        +calculateActualDirection(prevX, prevY, currX, currY) Vector
        +dotProduct(v1, v2) Number
        -normalizeVector(vector) Vector
    }

    class InputHandler {
        -Scene scene
        -Boolean isTracing
        -Object previousPointer
        -Number lastUpdateTime
        -Array pointerHistory

        +setupListeners()
        +handlePointerDown(pointer)
        +handlePointerMove(pointer)
        +handlePointerUp()
        +smoothPointer(pointer) Object
        -preventPageScroll()
        -isValidStartPoint(x, y) Boolean
    }

    class FeedbackSystem {
        -Scene scene
        -AudioManager audio
        -Number lastFeedbackTime
        -Boolean isPlayingContinuous

        +onTraceStart()
        +onTraceProgress(progress)
        +onStrokeComplete()
        +onOffPath()
        +onWrongDirection()
        +playWhooshSound()
        +triggerHaptic()
        -throttleFeedback(minInterval) Boolean
    }

    class ProgressTracker {
        -Number currentStroke
        -Number strokeProgress
        -Number totalProgress
        -Array strokesCompleted
        -Array pointsTraced
        -Number startTime

        +updateStrokeProgress(progress)
        +completeStroke()
        +getTotalProgress() Number
        +getElapsedTime() Number
        +reset()
        +getStatistics() Object
    }

    DanceTraceScene --> PathDetector : uses
    DanceTraceScene --> TrailRenderer : uses
    DanceTraceScene --> InputHandler : uses
    DanceTraceScene --> FeedbackSystem : uses

    PathDetector --> PathCheckResult : returns
    PathDetector --> DirectionChecker : uses
    PathDetector --> ProgressTracker : updates

    TrailRenderer --> PathDetector : reads progress

    InputHandler --> PathDetector : queries
    InputHandler --> FeedbackSystem : triggers

    FeedbackSystem --> ProgressTracker : reads
```

## Sequence Diagram - Tracing Interaction

```mermaid
sequenceDiagram
    actor Aurora
    participant Input as InputHandler
    participant Detector as PathDetector
    participant Direction as DirectionChecker
    participant Trail as TrailRenderer
    participant Feedback as FeedbackSystem
    participant Progress as ProgressTracker
    participant Scene as DanceTraceScene

    Aurora->>Input: Touch start indicator
    Input->>Detector: checkPath(x, y)
    Detector-->>Input: {onPath: true, distance: 5}

    Input->>Scene: startTracing()
    Scene->>Feedback: onTraceStart()
    Feedback->>Feedback: Play "trace-start" sound
    Feedback->>Feedback: Hide start indicator
    Scene->>Progress: reset()

    loop While tracing
        Aurora->>Input: Move finger along path
        Input->>Input: smoothPointer(pointer)
        Input->>Detector: checkPath(x, y)
        Detector-->>Input: {onPath: true, nearestPoint: {...}}

        Input->>Direction: isMovingForward(prev, curr)
        Direction->>Direction: Calculate expected direction
        Direction->>Direction: Calculate actual direction
        Direction->>Direction: Compare dot product
        Direction-->>Input: true (correct direction)

        alt On path and correct direction
            Input->>Detector: updateProgress(pathCheck)
            Detector->>Progress: updateStrokeProgress(0.25)
            Detector-->>Input: false (not complete yet)

            Input->>Trail: addPoint(x, y, progress)
            Trail->>Trail: Calculate rainbow color
            Trail->>Scene: render()
            Scene->>Scene: Draw colored line segment

            Input->>Feedback: onTraceProgress(0.25)
            Feedback->>Feedback: Play whoosh sound (throttled)
            Feedback->>Feedback: Trigger haptic pulse
        else Off path
            Input->>Feedback: onOffPath()
            Feedback->>Feedback: Fade trail to gray

            alt Within snap distance (< 70px)
                Input->>Trail: addPoint(nearestPoint)
                Note over Input: Snap to path (assist)
            else Too far off path
                Input->>Input: Pause trail rendering
                Note over Input: Wait for return to path
            end
        else Wrong direction
            Input->>Feedback: onWrongDirection()
            Feedback->>Feedback: Play gentle redirect sound
            Input->>Input: Don't update progress
        end
    end

    Aurora->>Input: Reach 90% of stroke
    Input->>Detector: updateProgress(pathCheck)
    Detector->>Progress: completeStroke()
    Detector->>Detector: currentStroke++
    Detector->>Detector: strokeProgress = 0
    Detector-->>Input: false (more strokes)

    Input->>Scene: onStrokeComplete()
    Scene->>Feedback: onStrokeComplete()
    Feedback->>Feedback: Play chime sound
    Feedback->>Feedback: Show sparkle effect
    Scene->>Scene: Highlight next stroke start

    Aurora->>Input: Complete all strokes (reach 90% of last)
    Input->>Detector: updateProgress(pathCheck)
    Detector->>Progress: completeStroke()
    Detector-->>Input: true (letter complete!)

    Input->>Scene: onLetterComplete()
    Scene->>Scene: Phase 39: Celebration
```

## State Diagram - Tracing States

```mermaid
stateDiagram-v2
    [*] --> Idle: Scene created

    Idle --> WaitingForStart: Letter displayed
    Note right of Idle: Start indicator pulsing<br/>Path visible<br/>Trail empty

    WaitingForStart --> Tracing: Touch on start point
    Note right of WaitingForStart: Pointer within 60px<br/>of green circle

    WaitingForStart --> WaitingForStart: Touch elsewhere
    Note right of WaitingForStart: Play "start here" hint

    state Tracing {
        [*] --> OnPath

        OnPath --> OnPath: Correct direction
        Note right of OnPath: Render rainbow trail<br/>Update progress<br/>Play whoosh sound

        OnPath --> SlightlyOff: Distance 50-70px
        Note right of SlightlyOff: Snap to path<br/>Continue tracing<br/>No penalty

        OnPath --> OffPath: Distance > 70px
        Note right of OffPath: Fade trail to gray<br/>Pause progress<br/>Play redirect hint

        SlightlyOff --> OnPath: Return to path
        OffPath --> OnPath: Return within 60px

        OnPath --> WrongDirection: Moving backwards
        Note right of WrongDirection: Dot product < 0.5<br/>Don't update progress<br/>Gentle audio cue

        WrongDirection --> OnPath: Correct direction
    }

    Tracing --> StrokeComplete: Reach 90% of stroke
    Note right of Tracing: Play chime<br/>Show sparkles<br/>Move to next stroke

    StrokeComplete --> Tracing: More strokes
    StrokeComplete --> LetterComplete: Last stroke done

    Tracing --> Paused: Lift finger
    Paused --> Tracing: Touch again on path
    Paused --> WaitingForStart: Too far off path

    LetterComplete --> [*]: Phase 39 celebration
    Note right of LetterComplete: Fireworks<br/>Audio praise<br/>Next letter
```

## Data Flow Diagram

```mermaid
flowchart TB
    subgraph Input
        Touch[Touch/Mouse Input]
        PointerPos[Pointer Position<br/>x, y]
    end

    subgraph Detection
        PathCheck[Check Path<br/>Distance to nearest point]
        DirectionCheck[Check Direction<br/>Dot product]
        HitboxCalc[Dynamic Hitbox<br/>40-80 pixels]
    end

    subgraph Processing
        OnPathDecision{On Path?}
        DirectionDecision{Correct<br/>Direction?}
        ProgressUpdate[Update Progress<br/>strokeProgress += delta]
        StrokeCheck{Stroke<br/>Complete?}
    end

    subgraph Rendering
        TrailColor[Calculate Color<br/>HSV based on progress]
        DrawTrail[Draw Line Segment<br/>Rainbow trail]
        UpdateGraphics[Update Graphics Object]
    end

    subgraph Feedback
        AudioWhoosh[Play Whoosh<br/>Continuous]
        AudioChime[Play Chime<br/>Stroke complete]
        Haptic[Vibrate<br/>Mobile only]
        Visual[Sparkles<br/>Stroke complete]
    end

    subgraph Output
        Display[Canvas Display<br/>Rainbow trail visible]
        ProgressData[Progress Data<br/>stroke, total %]
        CompletionEvent[Completion Event<br/>To Phase 39]
    end

    Touch --> PointerPos
    PointerPos --> PathCheck
    PointerPos --> DirectionCheck
    PathCheck --> HitboxCalc
    HitboxCalc --> OnPathDecision

    OnPathDecision -->|Yes| DirectionDecision
    OnPathDecision -->|No| Feedback

    DirectionDecision -->|Yes| ProgressUpdate
    DirectionDecision -->|No| Feedback

    ProgressUpdate --> StrokeCheck
    StrokeCheck -->|Yes| AudioChime
    StrokeCheck -->|Yes| Visual
    StrokeCheck -->|No| TrailColor

    TrailColor --> DrawTrail
    DrawTrail --> UpdateGraphics
    UpdateGraphics --> Display

    ProgressUpdate --> AudioWhoosh
    ProgressUpdate --> Haptic
    AudioWhoosh --> Display
    Haptic --> Display

    StrokeCheck -->|All Done| CompletionEvent

    ProgressUpdate --> ProgressData
```

## Path Detection Algorithm Flowchart

```mermaid
flowchart TD
    Start([Pointer Move Event])

    GetPointer[Get current pointer<br/>position x, y]
    GetStroke[Get current stroke<br/>from letterData]

    LoopPoints{Check all<br/>points in stroke}
    CalcDist[Calculate distance to point<br/>d = sqrt(dx² + dy²)]
    UpdateMin{d < minDist?}
    SaveMin[Save as nearest point<br/>minDist = d]
    NextPoint[Next point]

    CalcHitbox[Calculate dynamic hitbox<br/>Start/end: 80px<br/>Middle: 40px]
    CheckHitbox{minDist <<br/>hitbox?}

    OnPath[On Path!<br/>isOnPath = true]
    OffPath[Off Path<br/>isOnPath = false]

    CheckDirection[Check movement direction<br/>dotProduct(expected, actual)]
    DirectionOK{dotProduct<br/>> 0.5?}

    UpdateProgress[Update strokeProgress<br/>Calculate % along stroke]
    CheckComplete{progress<br/>>= 0.9?}

    CompleteStroke[Complete stroke<br/>currentStroke++<br/>strokeProgress = 0]
    CheckLetter{More<br/>strokes?}

    LetterDone[Letter Complete!<br/>Return true]
    ContinueTracing[Continue tracing<br/>Return false]

    RenderTrail[Add point to trail<br/>Render rainbow segment]
    PlayFeedback[Play audio feedback<br/>Trigger haptic]

    SnapToPath[Within 70px?<br/>Snap to nearest point]
    GentleHint[Play redirect hint<br/>Fade trail to gray]

    End([Return result])

    Start --> GetPointer
    GetPointer --> GetStroke
    GetStroke --> LoopPoints

    LoopPoints -->|Yes| CalcDist
    CalcDist --> UpdateMin
    UpdateMin -->|Yes| SaveMin
    UpdateMin -->|No| NextPoint
    SaveMin --> NextPoint
    NextPoint --> LoopPoints

    LoopPoints -->|No| CalcHitbox
    CalcHitbox --> CheckHitbox

    CheckHitbox -->|Yes| OnPath
    CheckHitbox -->|No| OffPath

    OnPath --> CheckDirection
    CheckDirection --> DirectionOK

    DirectionOK -->|Yes| UpdateProgress
    DirectionOK -->|No| GentleHint

    UpdateProgress --> CheckComplete
    CheckComplete -->|Yes| CompleteStroke
    CheckComplete -->|No| RenderTrail

    CompleteStroke --> CheckLetter
    CheckLetter -->|Yes| ContinueTracing
    CheckLetter -->|No| LetterDone

    RenderTrail --> PlayFeedback
    PlayFeedback --> ContinueTracing

    OffPath --> SnapToPath
    SnapToPath -->|Yes| UpdateProgress
    SnapToPath -->|No| GentleHint

    GentleHint --> ContinueTracing
    LetterDone --> End
    ContinueTracing --> End
```

## Rainbow Color Generation

```mermaid
graph LR
    Progress[Progress: 0.0 - 1.0]

    Progress --> Hue[Hue = progress × 360°]

    Hue --> H0["0° → Red"]
    Hue --> H60["60° → Orange"]
    Hue --> H120["120° → Yellow"]
    Hue --> H180["180° → Green"]
    Hue --> H240["240° → Blue"]
    Hue --> H300["300° → Indigo/Purple"]
    Hue --> H360["360° → Red (cycle)"]

    H0 --> HSV["HSV(hue/360, 1.0, 1.0)"]
    H60 --> HSV
    H120 --> HSV
    H180 --> HSV
    H240 --> HSV
    H300 --> HSV
    H360 --> HSV

    HSV --> RGB[Phaser.Display.Color<br/>.HSVToRGB]
    RGB --> Color[Hex Color Value<br/>0xRRGGBB]
    Color --> Trail[Trail Segment Color]

    style Progress fill:#87CEEB
    style Hue fill:#98FB98
    style RGB fill:#FFD700
    style Color fill:#FFA07A
    style Trail fill:#FF69B4
```

## Hitbox Visualization

```mermaid
graph TB
    subgraph "Letter A - Stroke 1 (Left Diagonal)"
        Start[Start Point<br/>Hitbox: 80px<br/>radius]
        Middle1[Point 2<br/>Hitbox: 40px]
        Middle2[Point 3<br/>Hitbox: 40px]
        End1[End Point<br/>Hitbox: 80px]

        Start -.->|Very Forgiving| Middle1
        Middle1 -.->|Standard| Middle2
        Middle2 -.->|Very Forgiving| End1
    end

    subgraph "Dynamic Hitbox Rules"
        Rule1["Start of stroke: 1.5× base hitbox"]
        Rule2["End of stroke: 1.5× base hitbox"]
        Rule3["Middle of stroke: 1.0× base hitbox"]
        Rule4["Complex letters (M, W): 0.8× base hitbox"]
        Rule5["Simple letters (I, O): 1.2× base hitbox"]
    end

    subgraph "Base Hitbox"
        Base["Base hitbox = 50 pixels"]
    end

    Base --> Rule1
    Base --> Rule2
    Base --> Rule3
    Base --> Rule4
    Base --> Rule5
```

## Notes

### Algorithmic Complexity

**Path Detection: O(n)**
- n = number of points in current stroke
- Must check distance to each point
- Optimization: Binary search for progress-based lookup
- Typical: 10-30 points per stroke = fast

**Direction Check: O(1)**
- Simple vector math
- 2 subtractions, 2 multiplications, 1 addition
- Negligible performance impact

**Trail Rendering: O(m)**
- m = number of trail points (limit to 200)
- Draw each line segment
- Clear and redraw each frame
- Optimization: Only draw visible portions

### ADHD-Friendly Algorithms

**Forgiveness Layers**
1. **Generous Hitbox**: 50-80 pixel radius (vs. 10-20 typical)
2. **Snap-to-Path**: Auto-correct within 70 pixels
3. **Direction Tolerance**: 45-degree deviation allowed
4. **Progress Patience**: Must stay off-path > 500ms to lose progress
5. **No Penalties**: Never go backwards in progress

**Positive Feedback Loops**
- Every 5 points traced → whoosh sound
- Every 25% progress → brighter colors
- Stroke completion → chime + sparkles
- No negative audio cues
- Visual feedback only (gentle redirect)

### Performance Optimizations

1. **Limit Trail Points**: Keep last 200 points only
2. **Throttle Audio**: Whoosh sound max every 100ms
3. **Frame Rate**: Target 60 FPS (16ms per frame)
4. **Graphics Reuse**: Don't create new Graphics each frame
5. **Distance Caching**: Cache nearest point for 3 frames
6. **Input Smoothing**: Rolling average over 5 frames

This architecture ensures smooth, therapeutic tracing with rich visual feedback.
