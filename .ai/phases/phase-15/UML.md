# Phase 15: Particle Effects - Celebration - UML

## System Architecture Diagram

```mermaid
graph TB
    LetterPop[LetterPopScene]
    ParticleSystem[Particle System]
    Emitters[Particle Emitters]
    Textures[Particle Textures]
    Bubbles[Bubble Click Handler]

    LetterPop --> Bubbles
    LetterPop --> ParticleSystem
    ParticleSystem --> Emitters
    Emitters --> Textures
    Bubbles -->|Trigger| Emitters

    style LetterPop fill:#90EE90
    style ParticleSystem fill:#FFB6C1
    style Emitters fill:#87CEEB
```

## Particle Celebration Sequence Diagram

```mermaid
sequenceDiagram
    actor Player
    participant Scene as LetterPopScene
    participant Bubble as Bubble Object
    participant Emitter as Particle Emitter
    participant Audio as Audio System
    participant Particles as Particle Pool

    Player->>Bubble: Click correct bubble
    Bubble->>Scene: Notify correct answer
    Scene->>Emitter: Get bubble position (x, y)
    Scene->>Emitter: setPosition(x, y)
    Scene->>Emitter: explode()

    Emitter->>Particles: Request 20 particles
    Particles->>Emitter: Provide particle objects
    Emitter->>Emitter: Calculate velocities
    Emitter->>Emitter: Assign colors randomly
    Emitter->>Emitter: Set lifespan (1500ms)

    par Particle Animation
        Emitter->>Particles: Emit particles outward
        Particles->>Particles: Move with velocity
        Particles->>Particles: Apply gravity
        Particles->>Particles: Rotate
        Particles->>Particles: Scale down
        Particles->>Particles: Fade alpha
        Note over Particles: 1500ms animation
        Particles->>Particles: Destroy when dead
    and Audio Feedback
        Scene->>Audio: Play correct sound
    and Visual Feedback
        Scene->>Bubble: Tween scale + fade
        Bubble->>Bubble: Destroy after 300ms
    end

    Scene->>Scene: Advance to next letter
```

## Particle Emitter Class Diagram

```mermaid
classDiagram
    class LetterPopScene {
        -ParticleEmitter particleEmitter
        -ParticleEmitter starEmitter
        -Number currentLetterIndex
        +create()
        +createParticleEmitter()
        +onCorrectAnswer(bubble)
        +triggerCelebration(x, y)
        +advanceToNextLetter()
        +shutdown()
    }

    class ParticleEmitter {
        -Number x
        -Number y
        -Array~Number~ tintColors
        -Number speed
        -Number angle
        -Number lifespan
        -Number quantity
        -Number gravityY
        -String blendMode
        -Number depth
        +setPosition(x, y)
        +explode(count)
        +getAliveParticleCount() Number
        +killAll()
        +stop()
    }

    class Particle {
        -Number x
        -Number y
        -Number velocityX
        -Number velocityY
        -Number scaleX
        -Number scaleY
        -Number alpha
        -Number rotation
        -Number lifespan
        -Number age
        +update(delta)
        +kill()
    }

    class ParticleTexture {
        <<Generated>>
        +String key
        +Number width
        +Number height
        +Graphics source
        +generateTexture(key, w, h)
    }

    LetterPopScene --> ParticleEmitter : manages
    ParticleEmitter --> Particle : emits
    ParticleEmitter --> ParticleTexture : uses
```

## Particle Burst Flow Diagram

```mermaid
flowchart TD
    Start([Correct Bubble Clicked]) --> GetPos[Get Bubble<br/>Position x, y]
    GetPos --> SetPos[Set Emitter<br/>Position to x, y]
    SetPos --> Trigger[Call explode on<br/>Emitters]

    Trigger --> Circle[Circle Emitter:<br/>Emit 20 particles]
    Trigger --> Star[Star Emitter:<br/>Emit 10 particles]

    Circle --> CreateCircle[Create Circle<br/>Particles]
    Star --> CreateStar[Create Star<br/>Particles]

    CreateCircle --> AssignProps1[Assign Properties:<br/>Speed, Angle, Color]
    CreateStar --> AssignProps2[Assign Properties:<br/>Speed, Angle, Color]

    AssignProps1 --> Animate1[Animate Particles]
    AssignProps2 --> Animate2[Animate Particles]

    Animate1 --> Update[Update Loop]
    Animate2 --> Update

    Update --> Move[Move by Velocity]
    Move --> ApplyGravity[Apply Gravity<br/>velocityY += gravity]
    ApplyGravity --> Rotate[Rotate Particle]
    Rotate --> Scale[Scale Down]
    Scale --> Fade[Fade Alpha]
    Fade --> CheckLife{Age >= Lifespan?}

    CheckLife -->|No| Update
    CheckLife -->|Yes| Kill[Kill Particle]
    Kill --> Return[Return to Pool]
    Return --> End([Particle Complete])

    style Start fill:#90EE90
    style Trigger fill:#FFB6C1
    style Update fill:#87CEEB
```

## Particle Texture Generation Diagram

```mermaid
graph TB
    Boot[BootScene] --> GenCircle[Generate Circle Texture]
    Boot --> GenStar[Generate Star Texture]
    Boot --> GenSquare[Generate Square Texture]

    GenCircle --> CircleGraphics[Create Graphics Object]
    CircleGraphics --> CircleDraw[fillCircle 8, 8, 8]
    CircleDraw --> CircleTex[generateTexture<br/>'particle-circle' 16x16]

    GenStar --> StarGraphics[Create Graphics Object]
    StarGraphics --> StarDraw[Draw 5-Point Star]
    StarDraw --> StarTex[generateTexture<br/>'particle-star' 16x16]

    GenSquare --> SquareGraphics[Create Graphics Object]
    SquareGraphics --> SquareDraw[fillRect 4, 4, 8, 8]
    SquareDraw --> SquareTex[generateTexture<br/>'particle-square' 16x16]

    CircleTex --> Cleanup1[Destroy Graphics]
    StarTex --> Cleanup2[Destroy Graphics]
    SquareTex --> Cleanup3[Destroy Graphics]

    Cleanup1 --> Ready[Textures Ready]
    Cleanup2 --> Ready
    Cleanup3 --> Ready

    Ready --> NextScene[Start PreloadScene]

    style Boot fill:#90EE90
    style Ready fill:#FFD700
```

## Particle Configuration State Diagram

```mermaid
stateDiagram-v2
    [*] --> Initialized: createParticleEmitter()

    Initialized --> Ready: Emitter configured
    Ready --> Positioned: setPosition(x, y)
    Positioned --> Emitting: explode() called

    Emitting --> CreatingParticles: Request particles from pool
    CreatingParticles --> AssigningProperties: Set speed, angle, color
    AssigningProperties --> ActiveAnimation: Start particle update loop

    ActiveAnimation --> MovingParticles: Apply velocity
    MovingParticles --> ApplyingGravity: velocityY += gravityY
    ApplyingGravity --> Rotating: rotation += rotateSpeed
    Rotating --> Scaling: scale *= scaleRate
    Scaling --> Fading: alpha -= fadeRate

    Fading --> CheckLifespan: age += delta

    CheckLifespan --> ActiveAnimation: age < lifespan
    CheckLifespan --> Dead: age >= lifespan

    Dead --> ReturnToPool: kill()
    ReturnToPool --> Ready: Particle recycled

    Ready --> [*]: shutdown()

    note right of Emitting
        Quantity: 20 (circles)
        Quantity: 10 (stars)
    end note

    note right of ActiveAnimation
        Duration: 1500-1800ms
        60 updates per second
    end note
```

## Particle Property Timeline

```mermaid
gantt
    title Particle Life Cycle (1500ms)
    dateFormat X
    axisFormat %L ms

    section Emission
    Particle Created           :0, 0ms
    Velocity Assigned         :0, 0ms
    Color Assigned           :0, 0ms

    section Movement
    Outward Movement         :0, 1500ms
    Gravity Applied          :0, 1500ms
    Rotation Active          :0, 1500ms

    section Visual
    Scale 1.0 → 0.2         :0, 1500ms
    Alpha 1.0 → 0.0         :0, 1500ms

    section Cleanup
    Particle Killed          :1500, 1500ms
    Return to Pool          :1500, 1500ms
```

## Layering Depth Diagram

```mermaid
graph TB
    subgraph "Depth 0-10: Background"
        BG[Background Color<br/>depth: 0]
        BGSprite[Background Sprite<br/>depth: 10]
    end

    subgraph "Depth 50: Game Objects"
        Bubbles[Letter Bubbles<br/>depth: 50]
    end

    subgraph "Depth 100: Effects"
        CircleP[Circle Particles<br/>depth: 100]
        StarP[Star Particles<br/>depth: 100]
    end

    subgraph "Depth 200: UI"
        Progress[Progress Text<br/>depth: 200]
        Letter[Letter Display<br/>depth: 200]
    end

    BG -.-> BGSprite
    BGSprite -.-> Bubbles
    Bubbles -.-> CircleP
    CircleP -.-> StarP
    StarP -.-> Progress
    Progress -.-> Letter

    style CircleP fill:#FFB6C1
    style StarP fill:#FFB6C1
```

## Particle Color Distribution

```mermaid
pie title Particle Color Distribution
    "Red" : 1
    "Yellow" : 1
    "Green" : 1
    "Cyan" : 1
    "Blue" : 1
    "Magenta" : 1
    "Orange" : 1
    "Pink" : 1
```

## Performance Optimization Flow

```mermaid
flowchart TD
    Start([Scene Create]) --> PreAlloc[Pre-allocate Particle Pool<br/>reserve 50 particles]
    PreAlloc --> SetLimit[Set Max Particles: 100]
    SetLimit --> ConfigBlend[Configure Blend Mode: ADD]

    ConfigBlend --> Ready[Ready for Bursts]

    Ready --> Burst[Correct Answer<br/>Trigger Burst]
    Burst --> Check{Active Particles<br/>> 100?}

    Check -->|No| Emit[Emit New Particles]
    Check -->|Yes| Wait[Wait for Particles<br/>to Die]

    Emit --> Update[Update Particles<br/>60 FPS]
    Update --> Recycle[Dead Particles<br/>Return to Pool]

    Recycle --> Ready
    Wait --> Ready

    Ready --> Monitor{Performance<br/>Monitor}
    Monitor -->|FPS < 50| Warn[Console Warning]
    Monitor -->|FPS >= 50| Continue[Continue]

    Warn --> Reduce[Reduce Particle Count]
    Reduce --> Continue

    Continue --> Ready

    style PreAlloc fill:#90EE90
    style Recycle fill:#87CEEB
    style Warn fill:#FF6B6B
```

## Particle Emitter Configuration Object

```mermaid
classDiagram
    class EmitterConfig {
        +Object speed
        +Object angle
        +Object scale
        +Object alpha
        +Number lifespan
        +Number gravityY
        +Number quantity
        +Object rotate
        +Array~Number~ tint
        +String blendMode
        +Boolean emitting
    }

    class SpeedConfig {
        +Number min
        +Number max
    }

    class AngleConfig {
        +Number min
        +Number max
    }

    class ScaleConfig {
        +Number start
        +Number end
    }

    class AlphaConfig {
        +Number start
        +Number end
    }

    EmitterConfig --> SpeedConfig
    EmitterConfig --> AngleConfig
    EmitterConfig --> ScaleConfig
    EmitterConfig --> AlphaConfig
```

## Particle Burst Timing Coordination

```mermaid
sequenceDiagram
    participant Click as Bubble Click
    participant Visual as Visual Feedback
    participant Particles as Particle Burst
    participant Audio as Audio Feedback
    participant Next as Next Letter

    Note over Click: T = 0ms

    Click->>Visual: Start bubble tween
    Click->>Particles: Trigger explosion
    Click->>Audio: Play correct sound

    par All Start Simultaneously
        Visual->>Visual: Scale + fade (300ms)
        Particles->>Particles: Burst animation (1500ms)
        Audio->>Audio: Play sound (duration varies)
    end

    Visual->>Next: Bubble destroyed (300ms)
    Note over Next: T = 300ms

    Next->>Next: Delay 500ms
    Note over Next: T = 800ms

    Next->>Next: Display next letter
    Note over Next: T = 800ms

    Note over Particles: Particles still animating
    Note over Particles: Complete at T = 1500ms

    Note right of Particles: Non-blocking design:<br/>Particles continue while<br/>gameplay proceeds
```

## Memory Management Diagram

```mermaid
graph TB
    Create[Scene Create] --> AllocPool[Allocate Particle Pool<br/>50 particles]

    AllocPool --> PoolReady[Pool Ready]

    PoolReady --> Burst1[Burst Event 1]
    Burst1 --> Use1[Use 20 particles]
    Use1 --> Active1[20 Active Particles]

    Active1 --> Die1[Particles Die<br/>after 1500ms]
    Die1 --> Return1[Return to Pool<br/>20 back in pool]

    Return1 --> PoolReady

    PoolReady --> Burst2[Burst Event 2]
    Burst2 --> Use2[Use 20 particles<br/>from pool]

    Use2 --> Active2[20 Active Particles]
    Active2 --> Die2[Particles Die]
    Die2 --> Return2[Return to Pool]

    Return2 --> PoolReady

    PoolReady --> Shutdown[Scene Shutdown]
    Shutdown --> KillAll[killAll]
    KillAll --> StopEmitters[stop emitters]
    StopEmitters --> Cleanup[Clean Memory]

    style AllocPool fill:#90EE90
    style Return1 fill:#87CEEB
    style Return2 fill:#87CEEB
    style Cleanup fill:#FFD700
```

## Particle Physics Calculation

```mermaid
flowchart LR
    Init[Initialize Particle] --> SetVel[Set Initial Velocity<br/>speed: 200-400<br/>angle: 0-360°]

    SetVel --> Frame[Frame Update]

    Frame --> CalcVelX[velocityX =<br/>speed * cos angle]
    Frame --> CalcVelY[velocityY =<br/>speed * sin angle]

    CalcVelX --> MoveX[x += velocityX * delta]
    CalcVelY --> MoveY[y += velocityY * delta]

    MoveY --> AddGravity[velocityY += gravityY * delta<br/>gravityY = 300]

    MoveX --> UpdatePos[Update Position]
    AddGravity --> UpdatePos

    UpdatePos --> UpdateRot[rotation += rotSpeed * delta]
    UpdateRot --> UpdateScale[scale = lerp start→end<br/>based on age]
    UpdateScale --> UpdateAlpha[alpha = lerp 1→0<br/>based on age]

    UpdateAlpha --> NextFrame{Still Alive?}
    NextFrame -->|Yes| Frame
    NextFrame -->|No| Kill[Kill Particle]
```

## Notes

### Why This Architecture?

**Object Pooling**
- Pre-allocate particles for performance
- Reuse particle objects instead of creating/destroying
- Reduces garbage collection overhead
- Critical for smooth 60fps animation

**Explode Mode**
- Perfect for burst effects on click
- All particles emitted simultaneously
- Creates satisfying "pop" feeling
- Non-continuous emission saves performance

**Multiple Emitters**
- Circle + star emitters add variety
- Different shapes prevent visual monotony
- Can be triggered simultaneously
- Each configured independently

**Blend Mode ADD**
- Creates glowing particle effect
- Particles brighten when overlapping
- More visually appealing than normal blend
- Slightly more performant than other special blends

### Performance Considerations

**Particle Limits**
- Max 50-100 active particles prevents lag
- Reserve pool pre-allocated (no runtime allocation)
- Each burst: 20 circles + 10 stars = 30 particles
- Can handle 3-4 simultaneous bursts safely

**Texture Size**
- 16x16 pixels is optimal
- Small enough for performance
- Large enough for visibility
- Generated at runtime (no file loading)

**Update Frequency**
- Particles update at game framerate (60fps)
- Physics calculated each frame
- Lifespan 1500ms = ~90 updates per particle
- Efficient calculations (no complex physics)

### Design Decisions

**Gravity Effect**
- Makes particles fall naturally
- More satisfying than linear outward movement
- Adds organic feel to animation
- GravityY: 300 is balanced (not too fast)

**Fade Out**
- Alpha 1.0 → 0.0 over lifespan
- Smooth disappearance (not abrupt)
- Particles shrink and fade simultaneously
- Creates polished, professional look

**Color Variety**
- 8 different colors
- Randomly assigned to each particle
- Creates rainbow confetti effect
- Visually exciting for children

**Non-Blocking Animation**
- Particles continue after bubble destroyed
- Game progresses to next letter while particles animate
- Doesn't delay gameplay
- Perfect for maintaining flow

### What This Phase Achieves

1. **Visual Reward**: Immediate, exciting feedback for correct answers
2. **Celebration Feeling**: Confetti-like burst creates joy
3. **Maintained Flow**: Non-blocking design keeps game moving
4. **Performance**: Optimized particle system runs smoothly
5. **Variety**: Multiple shapes and colors prevent repetition
6. **Polish**: Professional particle effects elevate game quality
7. **ADHD-Friendly**: Short, exciting, non-distracting celebration
8. **Foundation**: Particle system can be reused for other effects

This phase transforms correct answers from simple audio feedback into a multi-sensory celebration that reinforces learning through visual excitement.
