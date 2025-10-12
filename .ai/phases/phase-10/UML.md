# Phase 10: Letter Pop - Target Letter Game Logic - UML

## Class Diagram

```mermaid
classDiagram
    class LetterPopScene {
        -String targetLetter
        -Array~String~ letters
        -Array~Container~ bubbles
        -Number score
        -Boolean roundActive
        +constructor()
        +preload()
        +create()
        +selectTargetLetter() String
        +playTargetLetterAudio()
        +startRound()
        +createBubble(x, y, letter) Container
        +handleBubbleClick(container, letter)
        +handleCorrectClick(container)
        +handleIncorrectClick(container)
        +createCelebrationEffect(x, y)
        +checkRoundComplete()
        +incrementScore()
    }

    class BubbleContainer {
        -Circle background
        -Text letterText
        -String letter
        -Number x
        -Number y
        +setData(key, value)
        +getData(key)
        +destroy()
    }

    class AudioManager {
        <<Phaser.Sound>>
        +play(key)
        +stop(key)
        +playTargetLetterAudio(letter)
    }

    class TweenSystem {
        <<Phaser.Tweens>>
        +add(config)
        +createCelebrationTween(target)
        +createWobbleTween(target)
    }

    class ParticleEffect {
        -Array~Circle~ particles
        -Number x
        -Number y
        -Array~Color~ colors
        +create()
        +animate()
        +destroy()
    }

    class ClickHandler {
        +onBubbleClick(letter)
        +compareWithTarget(clicked, target) Boolean
        +triggerFeedback(isCorrect)
    }

    LetterPopScene --> BubbleContainer : creates
    LetterPopScene --> AudioManager : uses
    LetterPopScene --> TweenSystem : uses
    LetterPopScene --> ParticleEffect : creates
    LetterPopScene --> ClickHandler : uses
    BubbleContainer --> ClickHandler : triggers
```

## Sequence Diagram: Round Start Flow

```mermaid
sequenceDiagram
    actor Player
    participant Scene as LetterPopScene
    participant Audio as AudioManager
    participant Bubbles as Bubble System

    Player->>Scene: Start round
    Scene->>Scene: selectTargetLetter()
    Scene->>Scene: targetLetter = "B"

    Scene->>Audio: playTargetLetterAudio("B")
    Audio->>Audio: Load "Find the letter B!"
    Audio-->>Player: Play audio instruction

    Scene->>Bubbles: spawnBubbles()
    Bubbles->>Scene: Create 6-8 bubbles
    Note over Bubbles: Include target letter "B"
    Bubbles-->>Player: Display bubbles on screen

    Scene-->>Player: Wait for interaction
```

## Sequence Diagram: Correct Click Flow

```mermaid
sequenceDiagram
    actor Player
    participant Bubble as Bubble (B)
    participant Handler as Click Handler
    participant Scene as LetterPopScene
    participant Audio as AudioManager
    participant Particles as ParticleEffect
    participant Tweens as Tween System

    Player->>Bubble: Click bubble "B"
    Bubble->>Handler: pointerdown event
    Handler->>Scene: handleBubbleClick(container, "B")

    Scene->>Scene: Check: "B" == targetLetter?
    Note over Scene: Match found!

    Scene->>Handler: handleCorrectClick(container)

    par Parallel Actions
        Handler->>Audio: play("success")
        Audio-->>Player: Success sound
    and
        Handler->>Particles: createCelebrationEffect(x, y)
        Particles->>Particles: Create 8 star particles
        Particles->>Tweens: Animate particles outward
        Tweens-->>Player: Visual celebration
    and
        Handler->>Tweens: Scale up & fade bubble
        Tweens->>Tweens: scaleX/Y: 1.0 → 1.5
        Tweens->>Tweens: alpha: 1.0 → 0.0
        Tweens->>Bubble: destroy()
    end

    Handler->>Scene: incrementScore()
    Scene->>Scene: checkRoundComplete()
```

## Sequence Diagram: Incorrect Click Flow

```mermaid
sequenceDiagram
    actor Player
    participant Bubble as Bubble (X)
    participant Handler as Click Handler
    participant Scene as LetterPopScene
    participant Tweens as Tween System

    Player->>Bubble: Click bubble "X"
    Note over Player,Scene: Target letter is "B"

    Bubble->>Handler: pointerdown event
    Handler->>Scene: handleBubbleClick(container, "X")

    Scene->>Scene: Check: "X" == targetLetter?
    Note over Scene: No match

    Scene->>Handler: handleIncorrectClick(container)

    Handler->>Tweens: Create wobble animation
    Tweens->>Tweens: x: x-10, yoyo, repeat:2

    Tweens-->>Bubble: Wobble animation
    Note over Bubble: Shakes 3 times (150ms)

    Tweens->>Bubble: Return to original position
    Note over Bubble: Bubble stays on screen

    Bubble-->>Player: Ready for next click
    Note over Player: Non-punitive - try again!
```

## State Diagram: Bubble States

```mermaid
stateDiagram-v2
    [*] --> Created: Bubble spawned

    Created --> Idle: Displayed on screen
    Idle --> Hovered: Mouse over
    Hovered --> Idle: Mouse out

    Idle --> Clicked: Player clicks

    Clicked --> CheckingMatch: Compare with target

    CheckingMatch --> Correct: Letter matches
    CheckingMatch --> Incorrect: Letter doesn't match

    Correct --> Celebrating: Play success
    Celebrating --> Animating: Scale & fade
    Animating --> Destroyed: Remove from scene
    Destroyed --> [*]

    Incorrect --> Wobbling: Gentle shake
    Wobbling --> Idle: Animation complete
    Note right of Idle: Bubble remains\navailable
```

## Activity Diagram: Click Handler Logic

```mermaid
flowchart TD
    Start([Player Clicks Bubble]) --> GetLetter[Get clicked letter]
    GetLetter --> GetTarget[Get target letter]
    GetTarget --> Compare{Clicked == Target?}

    Compare -->|Yes - CORRECT| PlaySuccess[Play success sound]
    PlaySuccess --> CreateParticles[Create celebration particles]
    CreateParticles --> AnimateParticles[Animate particles outward]
    AnimateParticles --> ScaleBubble[Scale bubble up]
    ScaleBubble --> FadeBubble[Fade bubble out]
    FadeBubble --> DestroyBubble[Destroy bubble]
    DestroyBubble --> IncrementScore[Increment score]
    IncrementScore --> CheckComplete{Round complete?}
    CheckComplete -->|Yes| EndRound[End round]
    CheckComplete -->|No| WaitMore[Wait for more clicks]

    Compare -->|No - INCORRECT| WobbleStart[Start wobble tween]
    WobbleStart --> MoveLeft[Move left 10px]
    MoveLeft --> MoveRight[Move right 10px yoyo]
    MoveRight --> RepeatWobble{Repeat < 2?}
    RepeatWobble -->|Yes| MoveLeft
    RepeatWobble -->|No| ResetPosition[Return to original position]
    ResetPosition --> StayOnScreen[Bubble stays on screen]
    StayOnScreen --> WaitMore

    WaitMore --> End([Ready for next click])
    EndRound --> End

    style Start fill:#90EE90
    style PlaySuccess fill:#FFD700
    style WobbleStart fill:#FFB6C1
    style IncrementScore fill:#87CEEB
    style StayOnScreen fill:#98FB98
    style End fill:#DDA0DD
```

## Component Interaction Diagram

```mermaid
graph TB
    Player[Player Input] --> BubbleClick[Bubble Click Event]

    BubbleClick --> ClickHandler[Click Handler]
    ClickHandler --> LetterCompare[Letter Comparison]

    LetterCompare --> CorrectPath[Correct Path]
    LetterCompare --> IncorrectPath[Incorrect Path]

    CorrectPath --> AudioSuccess[Audio: Success]
    CorrectPath --> VisualCelebration[Visual: Celebration]
    CorrectPath --> BubbleRemoval[Remove Bubble]
    CorrectPath --> ScoreUpdate[Update Score]

    IncorrectPath --> VisualWobble[Visual: Wobble]
    IncorrectPath --> BubbleRetain[Keep Bubble]

    AudioSuccess --> Speaker[Audio Output]
    VisualCelebration --> ParticleSystem[Particle System]
    VisualWobble --> TweenSystem[Tween System]

    ParticleSystem --> Screen[Display]
    TweenSystem --> Screen
    BubbleRemoval --> Screen
    BubbleRetain --> Screen

    style CorrectPath fill:#90EE90
    style IncorrectPath fill:#FFB6C1
    style ScoreUpdate fill:#FFD700
    style BubbleRetain fill:#98FB98
```

## Data Flow: Target Letter System

```mermaid
flowchart LR
    A[Round Start] --> B[Generate Random Index]
    B --> C[Select Letter from Array]
    C --> D[Store as targetLetter]
    D --> E[Format Audio Key]
    E --> F["Load find_letter_{X}.mp3"]
    F --> G[Play Audio Instruction]

    G --> H[Display to Player]

    H --> I[Player Clicks Bubble]
    I --> J[Extract Clicked Letter]
    J --> K{Compare Letters}

    K -->|Match| L[Execute Correct Logic]
    K -->|No Match| M[Execute Incorrect Logic]

    L --> N[Remove Bubble]
    M --> O[Retain Bubble]

    N --> P{More Bubbles?}
    P -->|Yes| H
    P -->|No| Q[Round Complete]

    O --> H

    style D fill:#FFD700
    style K fill:#FFB6C1
    style L fill:#90EE90
    style M fill:#FFA07A
```

## Celebration Effect Diagram

```mermaid
graph TB
    Trigger[Correct Click] --> Center[Bubble Center X,Y]
    Center --> CreateParticles[Create 8 Particles]

    CreateParticles --> P0[Particle 0° - Gold]
    CreateParticles --> P1[Particle 45° - Pink]
    CreateParticles --> P2[Particle 90° - Cyan]
    CreateParticles --> P3[Particle 135° - Green]
    CreateParticles --> P4[Particle 180° - Gold]
    CreateParticles --> P5[Particle 225° - Pink]
    CreateParticles --> P6[Particle 270° - Cyan]
    CreateParticles --> P7[Particle 315° - Green]

    P0 --> Animate0[Move outward 100px]
    P1 --> Animate1[Move outward 100px]
    P2 --> Animate2[Move outward 100px]
    P3 --> Animate3[Move outward 100px]
    P4 --> Animate4[Move outward 100px]
    P5 --> Animate5[Move outward 100px]
    P6 --> Animate6[Move outward 100px]
    P7 --> Animate7[Move outward 100px]

    Animate0 --> Fade[Fade alpha: 1→0]
    Animate1 --> Fade
    Animate2 --> Fade
    Animate3 --> Fade
    Animate4 --> Fade
    Animate5 --> Fade
    Animate6 --> Fade
    Animate7 --> Fade

    Fade --> Destroy[Destroy particles after 400ms]

    style Trigger fill:#FFD700
    style CreateParticles fill:#90EE90
    style Fade fill:#FFB6C1
```

## Wobble Animation Timing

```mermaid
gantt
    title Wobble Animation Timeline (150ms total)
    dateFormat X
    axisFormat %L ms

    section Wobble
    Move Left (-10px)    :0, 50
    Return Right (yoyo)  :50, 50
    Move Left (-10px)    :50, 50
    Return Right (yoyo)  :100, 50
    Move Left (-10px)    :100, 50
    Final Return         :150, 50
```

## Audio System Architecture

```mermaid
graph TB
    Start[Round Start] --> SelectLetter[Select Target Letter]
    SelectLetter --> GenerateKey["Generate audio key: find_letter_{X}"]
    GenerateKey --> CheckLoaded{Audio loaded?}

    CheckLoaded -->|Yes| PlayAudio[Play audio instruction]
    CheckLoaded -->|No| LoadAudio[Load audio file]
    LoadAudio --> PlayAudio

    PlayAudio --> WaitForPlayer[Display bubbles]

    WaitForPlayer --> PlayerClick[Player clicks]

    PlayerClick --> CheckCorrect{Correct?}

    CheckCorrect -->|Yes| PlaySuccess[Play success.mp3]
    CheckCorrect -->|No| SilentOrGentle[Silent or gentle try_again.mp3]

    PlaySuccess --> Continue[Continue game]
    SilentOrGentle --> Continue

    style SelectLetter fill:#FFD700
    style PlayAudio fill:#87CEEB
    style PlaySuccess fill:#90EE90
    style SilentOrGentle fill:#FFB6C1
```

## Notes

### Architecture Decisions

**Target Letter System**
- Randomly selected from full alphabet (A-Z)
- Stored as scene property (accessible to all methods)
- Selected at round start, before bubbles spawn
- Audio instruction plays immediately after selection

**Click Feedback Separation**
- Correct and incorrect paths are completely separate
- Correct: Celebration → Removal → Score update
- Incorrect: Wobble → Retain → Allow retry
- No shared feedback logic (clear separation of concerns)

**Animation Strategy**
- Correct: Multiple simultaneous animations (particles + bubble)
- Incorrect: Single wobble animation (simple, quick)
- All animations use Phaser tweens (consistent, performant)
- Total feedback time: Correct ~300ms, Incorrect ~150ms

**Non-Punitive Design**
- Incorrect bubbles stay on screen (no removal)
- No negative audio (silence or gentle "hmm")
- No visual "wrong" indicators (just wobble)
- Player can retry immediately (no cooldown)
- No limit on incorrect attempts

### Why This Design?

**ADHD-Friendly Justification**
1. **Immediate feedback**: Both paths respond in <50ms
2. **Clear distinction**: Success is celebratory, failure is gentle
3. **No punishment**: Wrong clicks don't remove options
4. **Visual clarity**: Particles clearly indicate success
5. **Audio support**: Explicit instruction at round start
6. **No time pressure**: Player can take as long as needed

**Performance Considerations**
- Particle count limited to 8 (lightweight)
- Particles destroyed after animation (no memory leak)
- Wobble uses simple x-axis translation (GPU-friendly)
- Audio preloaded (no loading delays during gameplay)

**Extensibility**
- Easy to add more letters or custom letter sets
- Celebration effect can be enhanced later
- Wobble parameters easily adjustable
- Score system integrated but modular (Phase 11)

### Component Relationships

1. **LetterPopScene is the coordinator**
   - Selects target letter
   - Creates bubbles with letters
   - Handles all click events
   - Manages feedback systems

2. **BubbleContainer is data + visual**
   - Stores letter as data property
   - Provides click target
   - Responds to tween animations
   - Self-destructs on correct click

3. **Audio system is fire-and-forget**
   - Scene triggers audio.play()
   - Audio manager handles playback
   - No callbacks needed (visual feedback is primary)

4. **Particle effects are transient**
   - Created on correct click
   - Animate outward radially
   - Self-destruct after animation
   - No persistent state

5. **Tweens manage all animations**
   - Celebration: scale + fade
   - Wobble: translate x
   - Particles: translate + fade
   - All coordinated by Phaser tween manager

This design prioritizes encouraging, non-frustrating gameplay while maintaining clear feedback and smooth performance.
