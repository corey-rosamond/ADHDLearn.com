# Phase 40: Dance & Trace - Polish - UML

## Class Diagram

```mermaid
classDiagram
    class EnhancedTrailRenderer {
        -Graphics trailGraphics
        -Graphics glowGraphics
        -ParticleEmitter sparkles
        -Array trailPoints
        -Number maxTrailPoints
        -Object fadeConfig

        +addPoint(x, y, progress)
        +render()
        +emitSparkle(x, y)
        +clear()
        -fadeInSegment(point)
        -renderGlow()
        -renderTrail()
    }

    class MusicManager {
        -Sound bgMusic
        -Boolean isMusicPlaying
        -Number defaultVolume
        -Number duckedVolume
        -Scene scene

        +startMusic()
        +stopMusic()
        +duckVolume()
        +restoreVolume()
        +pauseForCelebration()
        +resumeAfterCelebration()
        -fadeIn(duration)
        -fadeOut(duration)
    }

    class HapticManager {
        -Boolean isSupported
        -Boolean isEnabled
        -Object patterns

        +vibrate(pattern)
        +traceStart()
        +traceProgress()
        +strokeComplete()
        +letterComplete()
        +starEarn()
        -checkSupport()
    }

    class LetterDataManager {
        -Object letterStrokes
        -Array validatedLetters
        -Object letterMetadata

        +loadAllLetters()
        +getLetterData(letter) Object
        +validateLetter(letter) Boolean
        +getCategoryLetters(category) Array
        +getLetterStats(letter) Object
        -normalizeCoordinates(data)
        -calculateBounds(strokes)
    }

    class AnimationPolish {
        -Scene scene
        -Object tweenConfig
        -Array activeTweens

        +animateStartIndicator(indicator)
        +animateLetterPathFadeIn(graphics, strokes)
        +animateCompletionFlash(targets)
        +animateButtonHover(button)
        +animateStarEarn(star)
        -createSmoothTween(config)
        -cleanupTweens()
    }

    class PerformanceOptimizer {
        -Number targetFPS
        -Number currentFPS
        -Boolean lowPowerMode
        -Object metrics

        +monitorFPS()
        +optimizeGraphics()
        +limitParticles(count)
        +cleanupMemory()
        +detectLowPerformance()
        -adjustQuality()
        -logMetrics()
    }

    class AccessibilityManager {
        -String colorblindMode
        -Boolean highContrast
        -Number dotSize
        -Boolean showGuidelines
        -Object preferences

        +applyColorblindMode(mode)
        +toggleHighContrast()
        +adjustDotSize(size)
        +showHandwritingLines()
        +savePreferences()
        +loadPreferences()
    }

    class TutorialManager {
        -Boolean hasSeenTutorial
        -Scene scene
        -Container tutorialOverlay

        +checkFirstTime() Boolean
        +showTutorial()
        +dismissTutorial()
        +showExampleAnimation()
        +markAsCompleted()
        -createOverlay()
    }

    DanceTraceScene --> EnhancedTrailRenderer : uses
    DanceTraceScene --> MusicManager : uses
    DanceTraceScene --> HapticManager : uses
    DanceTraceScene --> LetterDataManager : loads from
    DanceTraceScene --> AnimationPolish : applies
    DanceTraceScene --> PerformanceOptimizer : monitors
    DanceTraceScene --> AccessibilityManager : configures
    DanceTraceScene --> TutorialManager : shows

    EnhancedTrailRenderer --> ParticleSystem : emits sparkles
    MusicManager --> AudioManager : controls
    AnimationPolish --> TweenSystem : creates
    PerformanceOptimizer --> FrameRateMonitor : checks
```

## Sequence Diagram - Enhanced Trail Rendering

```mermaid
sequenceDiagram
    participant Input
    participant Trail as EnhancedTrailRenderer
    participant Glow as GlowGraphics
    participant Main as TrailGraphics
    participant Sparkles as ParticleEmitter

    Input->>Trail: addPoint(x, y, progress)
    Trail->>Trail: Add to trailPoints array
    Trail->>Trail: Limit to 300 points

    alt Every 10th point
        Trail->>Sparkles: emitSparkle(x, y)
        Sparkles->>Sparkles: Create emitter at position
        Sparkles->>Sparkles: Explode 2 white particles
        Note over Sparkles: Sparkles drift upward<br/>Fade out over 500ms
    end

    Trail->>Trail: render()

    Trail->>Glow: clear()
    Glow->>Glow: Clear previous frame

    loop For each trail segment
        Trail->>Trail: Get consecutive points p1, p2
        Trail->>Trail: Calculate rainbow color from progress
        Trail->>Glow: lineStyle(22, color, 0.3)
        Trail->>Glow: lineBetween(p1, p2)
        Note over Glow: Glow layer: 22px width<br/>30% opacity
    end

    Trail->>Main: clear()
    Main->>Main: Clear previous frame

    loop For each trail segment
        Trail->>Trail: Get consecutive points p1, p2
        Trail->>Trail: Fade in alpha (0.5 → 0.9)
        Trail->>Trail: Calculate rainbow color
        Trail->>Main: lineStyle(14, color, alpha)
        Trail->>Main: lineBetween(p1, p2)
        Note over Main: Main trail: 14px width<br/>Fading alpha for smoothness
    end

    Trail-->>Input: Rendering complete
```

## Sequence Diagram - Music Management

```mermaid
sequenceDiagram
    participant Scene as DanceTraceScene
    participant Music as MusicManager
    participant Audio as Phaser.Sound
    participant Tweens as Phaser.Tweens

    Scene->>Music: startMusic()
    Music->>Audio: add('dance-trace-music', loop: true)
    Music->>Audio: play() with volume 0

    Music->>Tweens: Fade in volume 0 → 0.5 over 2s
    Tweens-->>Audio: volume increasing...
    Note over Audio: Music fades in smoothly

    Scene->>Music: duckVolume() (voice instruction)
    Music->>Tweens: Fade volume 0.5 → 0.15 over 500ms
    Note over Audio: Music quieter during speech

    Scene->>Music: restoreVolume() (instruction complete)
    Music->>Tweens: Fade volume 0.15 → 0.5 over 500ms
    Note over Audio: Music returns to normal

    Scene->>Music: pauseForCelebration()
    Music->>Tweens: Fade volume 0.5 → 0 over 1s
    Music->>Audio: pause()
    Note over Audio: Music pauses for fireworks

    Scene->>Music: resumeAfterCelebration()
    Music->>Audio: resume()
    Music->>Tweens: Fade volume 0 → 0.5 over 1s
    Note over Audio: Music resumes smoothly

    Scene->>Music: stopMusic() (exit scene)
    Music->>Tweens: Fade volume 0.5 → 0 over 2s
    Tweens-->>Audio: volume decreasing...
    Music->>Audio: stop()
    Note over Audio: Music stops gracefully
```

## State Diagram - Performance Optimization

```mermaid
stateDiagram-v2
    [*] --> Monitoring: Scene starts

    Monitoring --> Normal: FPS >= 55
    Note right of Monitoring: Track FPS<br/>Check memory<br/>Count particles

    state Normal {
        [*] --> FullQuality
        FullQuality: All effects enabled
        FullQuality: Glow + Sparkles
        FullQuality: 300 trail points
        FullQuality: 50 particles max
    }

    Normal --> Detecting: FPS drops below 55
    Note right of Normal: Optimal performance<br/>All effects running

    Detecting --> OptimizedMode: FPS < 45 for 3 seconds
    Note right of Detecting: Performance degrading<br/>User may notice lag

    state OptimizedMode {
        [*] --> ReducedEffects
        ReducedEffects: Disable glow layer
        ReducedEffects: Reduce sparkles (50%)
        ReducedEffects: 200 trail points
        ReducedEffects: 30 particles max
    }

    OptimizedMode --> Monitoring: FPS recovers to 55+
    Note right of OptimizedMode: Performance improved<br/>Some effects disabled

    OptimizedMode --> LowPowerMode: FPS < 30 for 5 seconds
    Note right of OptimizedMode: Severe performance issues<br/>More aggressive optimization

    state LowPowerMode {
        [*] --> MinimalEffects
        MinimalEffects: Disable all particles
        MinimalEffects: Simple trail only
        MinimalEffects: 100 trail points
        MinimalEffects: Reduce animations
    }

    LowPowerMode --> OptimizedMode: FPS recovers to 45+
    Note right of LowPowerMode: Minimal but functional<br/>Prioritize gameplay
```

## Data Flow Diagram - Letter Data Loading

```mermaid
flowchart TB
    subgraph Source
        JSON[letterStrokes.json<br/>26 letters A-Z]
    end

    subgraph Loading
        Preload[Scene preload<br/>Load JSON file]
        Parse[Parse JSON<br/>into Object]
        Validate[Validate each letter<br/>Check structure]
    end

    subgraph Processing
        Normalize[Normalize coordinates<br/>Center at 0,0]
        CalcBounds[Calculate bounds<br/>Width & height]
        Categorize[Categorize letters<br/>Simple/Medium/Complex]
        AddMetadata[Add metadata<br/>Difficulty, tips]
    end

    subgraph Storage
        Cache[Phaser Cache<br/>JSON data]
        Manager[LetterDataManager<br/>Runtime access]
    end

    subgraph Usage
        GetLetter[Get letter 'A'<br/>when needed]
        RenderPath[Render dotted path<br/>based on strokes]
        DetectPath[PathDetector<br/>uses stroke points]
    end

    JSON --> Preload
    Preload --> Parse
    Parse --> Validate

    Validate --> Normalize
    Normalize --> CalcBounds
    CalcBounds --> Categorize
    Categorize --> AddMetadata

    AddMetadata --> Cache
    AddMetadata --> Manager

    Manager --> GetLetter
    GetLetter --> RenderPath
    GetLetter --> DetectPath
```

## Animation Timeline - Letter Path Fade In

```mermaid
gantt
    title Letter Path Fade-In Animation (Letter A - 60 dots total)
    dateFormat X
    axisFormat %Lms

    section Stroke 1 (20 dots)
    Dot 1  :0ms, 20ms
    Dot 2  :20ms, 20ms
    Dot 3  :40ms, 20ms
    Dots 4-20 :60ms, 340ms

    section Stroke 2 (20 dots)
    Dot 21 :400ms, 20ms
    Dot 22 :420ms, 20ms
    Dots 23-40 :440ms, 360ms

    section Stroke 3 (20 dots)
    Dot 41 :800ms, 20ms
    Dot 42 :820ms, 20ms
    Dots 43-60 :840ms, 360ms

    section Complete
    All visible :1200ms, 100ms
```

## Haptic Pattern Visualization

```mermaid
gantt
    title Haptic Feedback Patterns
    dateFormat X
    axisFormat %Lms

    section Trace Start
    Pulse :0ms, 20ms

    section Trace Progress
    Pulse :0ms, 15ms

    section Stroke Complete
    Pulse :0ms, 30ms

    section Letter Complete
    Pulse 1 :0ms, 50ms
    Wait    :50ms, 100ms
    Pulse 2 :150ms, 50ms
    Wait    :200ms, 100ms
    Pulse 3 :300ms, 50ms

    section Star Earn
    Pulse 1 :0ms, 20ms
    Wait    :20ms, 100ms
    Pulse 2 :120ms, 20ms
    Wait    :140ms, 100ms
    Pulse 3 :240ms, 20ms
```

## Performance Metrics Dashboard

```mermaid
graph TB
    subgraph Monitoring
        FPS[Frame Rate<br/>Target: 60 FPS<br/>Warning: < 55<br/>Critical: < 30]
        Memory[Memory Usage<br/>Trail points: 300 max<br/>Particles: 50 max<br/>Textures: Monitor]
        Draw[Draw Calls<br/>Graphics clears<br/>Particle renders<br/>Minimize calls]
    end

    subgraph Thresholds
        Green[Green Zone<br/>FPS >= 55<br/>Memory < 100MB<br/>All effects on]
        Yellow[Yellow Zone<br/>FPS 45-55<br/>Memory 100-150MB<br/>Reduce effects]
        Red[Red Zone<br/>FPS < 45<br/>Memory > 150MB<br/>Minimal mode]
    end

    subgraph Actions
        Monitor[Continue monitoring]
        Optimize[Disable glow<br/>Reduce sparkles<br/>Limit trail points]
        Minimal[Disable particles<br/>Simple trail<br/>Reduce animations]
    end

    FPS --> Green
    Memory --> Green
    Draw --> Green

    FPS --> Yellow
    Memory --> Yellow
    Draw --> Yellow

    FPS --> Red
    Memory --> Red
    Draw --> Red

    Green --> Monitor
    Yellow --> Optimize
    Red --> Minimal
```

## Letter Data Structure Complete

```mermaid
classDiagram
    class LetterStrokesData {
        +Object A-Z
    }

    class LetterData {
        +Array strokes
        +Object startPoint
        +Number scale
        +String category
        +Number difficulty
        +String tips
        +Object bounds
    }

    class Stroke {
        +Array points
        +String direction
        +Number order
        +String type
    }

    class Point {
        +Number x
        +Number y
    }

    class Metadata {
        +String category
        +Number difficulty
        +String description
        +Array commonMistakes
    }

    LetterStrokesData --> LetterData : contains 26
    LetterData --> Stroke : 1-4 strokes
    LetterData --> Metadata : includes
    Stroke --> Point : array of points
```

## Accessibility Color Palettes

```mermaid
graph LR
    subgraph Normal
        N1[Red → Orange → Yellow<br/>→ Green → Blue → Purple]
    end

    subgraph Deuteranopia
        D1[Blue → Purple → Pink<br/>→ Yellow → Orange → Brown]
    end

    subgraph Protanopia
        P1[Blue → Cyan → Yellow<br/>→ Orange → Brown → Dark]
    end

    subgraph Tritanopia
        T1[Red → Pink → Cyan<br/>→ Green → Teal → Blue]
    end

    subgraph High Contrast
        H1[White → Light Gray → Gray<br/>→ Dark Gray → Black]
    end

    Normal -.->|Convert| Deuteranopia
    Normal -.->|Convert| Protanopia
    Normal -.->|Convert| Tritanopia
    Normal -.->|Simplify| High Contrast
```

## Notes

### Enhanced Trail Layering

**3-Layer System:**
1. **Glow Layer (Bottom)**: 22px width, 30% opacity, creates soft aura
2. **Main Trail (Middle)**: 14px width, 90% opacity, vivid colors
3. **Sparkles (Top)**: Small particles, 100% opacity, magic dust effect

**Why 3 Layers?**
- Depth and dimension
- Professional polish
- Satisfying visual feedback
- Maintains clarity (not overwhelming)

### Music Selection Criteria

**Therapeutic Requirements:**
- 90-110 BPM (calming but not sleepy)
- No sudden changes (smooth dynamics)
- No vocals (avoid distraction)
- Loopable (seamless restart)
- Positive emotional tone
- Focus-enhancing (not background noise)

**Instrumentation:**
- Piano: Gentle, familiar, calming
- Kalimba: Magical, whimsical, light
- Strings: Warm, supportive, gentle
- Nature sounds: Water, birds, wind (subtle undertone)

**Avoid:**
- Heavy bass (overwhelming)
- Percussion (distracting)
- Dissonance (creates tension)
- Silence (too stark)

### Haptic Design Philosophy

**Subtlety is Key:**
- Short pulses (15-50ms)
- Gentle intensity
- Meaningful patterns
- Not constant (would annoy)
- Celebrate milestones

**Pattern Design:**
- Single pulse = Progress
- Double pulse = Minor milestone
- Triple pulse = Major celebration
- Rhythm = Joy (letter complete pattern)

### Performance Optimization Strategy

**Graceful Degradation:**
1. **Full Quality** (60 FPS): All effects enabled
2. **Optimized** (45-55 FPS): Disable glow, reduce sparkles
3. **Low Power** (30-45 FPS): Trail only, no particles
4. **Emergency** (< 30 FPS): Minimal rendering, notify user

**Never Sacrifice:**
- Core gameplay (tracing detection)
- Main trail (primary feedback)
- Audio (essential for instructions)
- Progress tracking

**Can Sacrifice:**
- Glow effect
- Sparkle particles
- Background animations
- Complex tweens

This architecture ensures Dance & Trace feels premium while maintaining broad device compatibility and ADHD-friendly therapeutic design.
