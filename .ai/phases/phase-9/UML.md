# Phase 9: Letter Pop - Multiple Bubbles - UML

## Class Diagram

```mermaid
classDiagram
    class GameScene {
        +Array~LetterBubble~ bubbles
        +preload()
        +create()
        +generateSpawnPositions(count, minDistance)
    }

    class LetterBubble {
        +Phaser.GameObjects.Arc bubble
        +Phaser.GameObjects.Text letterText
        +Phaser.Scene scene
        +String letter
        +Boolean isPopped
        +constructor(scene, x, y, letter)
        +onPop()
        +destroy()
    }

    class AudioManager {
        <<Phaser System>>
        +load(key, path)
        +play(key)
    }

    class TweenManager {
        <<Phaser System>>
        +add(config)
    }

    GameScene "1" --> "*" LetterBubble : creates and manages
    LetterBubble --> AudioManager : uses
    LetterBubble --> TweenManager : uses

    note for GameScene "Manages collection\nof bubble instances"
    note for LetterBubble "Each instance is\nindependent"
```

## Object Diagram: Multiple Bubble Instances

```mermaid
graph TB
    subgraph Scene
        GS[GameScene]
        BArray[bubbles: Array]
    end

    subgraph Bubble A
        LBA[LetterBubble A]
        BSA[bubble sprite]
        LTA[text: 'A']
    end

    subgraph Bubble B
        LBB[LetterBubble B]
        BSB[bubble sprite]
        LTB[text: 'B']
    end

    subgraph Bubble C
        LBC[LetterBubble C]
        BSC[bubble sprite]
        LTC[text: 'C']
    end

    GS --> BArray
    BArray --> LBA
    BArray --> LBB
    BArray --> LBC

    LBA --> BSA
    LBA --> LTA
    LBB --> BSB
    LBB --> LTB
    LBC --> BSC
    LBC --> LTC

    style LBA fill:#FFB6C1
    style LBB fill:#87CEEB
    style LBC fill:#90EE90
```

## Sequence Diagram: Multiple Bubble Creation

```mermaid
sequenceDiagram
    participant Scene as GameScene
    participant PosGen as Position Generator
    participant BubbleA as LetterBubble(A)
    participant BubbleB as LetterBubble(B)
    participant BubbleC as LetterBubble(C)
    participant Tweens as Tween Manager

    Scene->>Scene: create()
    Scene->>Scene: bubbles = []

    Scene->>PosGen: generateSpawnPositions(3, 150)
    PosGen->>PosGen: Calculate position 1 (x: 200)
    PosGen->>PosGen: Calculate position 2 (x: 400, min 150px away)
    PosGen->>PosGen: Calculate position 3 (x: 600, min 150px away)
    PosGen-->>Scene: [{x:200, y:500}, {x:400, y:500}, {x:600, y:500}]

    Scene->>BubbleA: new LetterBubble(scene, 200, 500, 'A')
    BubbleA->>BubbleA: Create sprite and text
    BubbleA->>BubbleA: setInteractive()
    BubbleA->>Tweens: Start float animation
    Scene->>Scene: bubbles.push(BubbleA)

    Scene->>BubbleB: new LetterBubble(scene, 400, 500, 'B')
    BubbleB->>BubbleB: Create sprite and text
    BubbleB->>BubbleB: setInteractive()
    BubbleB->>Tweens: Start float animation
    Scene->>Scene: bubbles.push(BubbleB)

    Scene->>BubbleC: new LetterBubble(scene, 600, 500, 'C')
    BubbleC->>BubbleC: Create sprite and text
    BubbleC->>BubbleC: setInteractive()
    BubbleC->>Tweens: Start float animation
    Scene->>Scene: bubbles.push(BubbleC)

    Note over Scene: 3 independent bubbles<br/>all floating upward
```

## Sequence Diagram: Independent Bubble Popping

```mermaid
sequenceDiagram
    participant Player
    participant BubbleA as Bubble A
    participant BubbleB as Bubble B
    participant BubbleC as Bubble C
    participant Sound as Sound Manager

    Note over BubbleA,BubbleC: All 3 bubbles floating independently

    Player->>BubbleB: Click bubble B
    BubbleB->>BubbleB: disableInteractive()
    BubbleB->>Sound: play('pop')
    BubbleB->>Sound: delayedCall -> play('letter-b')
    BubbleB->>BubbleB: Start pop animation

    Note over BubbleA: Bubble A continues<br/>floating unaffected
    Note over BubbleC: Bubble C continues<br/>floating unaffected

    BubbleB->>BubbleB: Animation complete
    BubbleB->>BubbleB: destroy()

    Note over BubbleA,BubbleC: Bubbles A and C still active

    Player->>BubbleA: Click bubble A
    BubbleA->>Sound: play('pop')
    BubbleA->>Sound: delayedCall -> play('letter-a')
    BubbleA->>BubbleA: Pop animation and destroy

    Note over BubbleC: Bubble C still floating
```

## Activity Diagram: Spawn Position Generation

```mermaid
flowchart TD
    Start([Generate Positions]) --> Init[count = 3, minDist = 150]
    Init --> InitArray[positions = empty array]
    InitArray --> Loop{For each bubble}

    Loop -->|i < count| InitAttempts[attempts = 0]
    InitAttempts --> GenRandom[Generate random X<br/>between 100-700]
    GenRandom --> CheckValid{Valid position?}

    CheckValid -->|Check distance| DistLoop{Check all<br/>existing positions}
    DistLoop -->|For each pos| CalcDist[Calculate distance]
    CalcDist --> Compare{Distance >= 150px?}

    Compare -->|No| TryAgain{attempts < 50?}
    TryAgain -->|Yes| GenRandom
    TryAgain -->|No| UseAnyway[Use position anyway]
    UseAnyway --> AddPos

    Compare -->|Yes| CheckNext{More positions<br/>to check?}
    CheckNext -->|Yes| DistLoop
    CheckNext -->|No| AddPos[Add position to array]

    AddPos --> Loop
    Loop -->|Done| Return([Return positions array])

    style Start fill:#90EE90
    style Return fill:#FFB6C1
    style Compare fill:#FFD700
```

## State Diagram: Multiple Bubble Lifecycle

```mermaid
stateDiagram-v2
    [*] --> Spawning: Scene create()

    state Spawning {
        [*] --> GeneratePositions
        GeneratePositions --> CreateBubbleA
        CreateBubbleA --> CreateBubbleB
        CreateBubbleB --> CreateBubbleC
        CreateBubbleC --> [*]
    }

    Spawning --> AllFloating: All bubbles created

    state AllFloating {
        state BubbleA {
            [*] --> FloatingA
            FloatingA --> PoppedA: Player clicks A
            PoppedA --> DestroyedA
            DestroyedA --> [*]
        }

        state BubbleB {
            [*] --> FloatingB
            FloatingB --> PoppedB: Player clicks B
            PoppedB --> DestroyedB
            DestroyedB --> [*]
        }

        state BubbleC {
            [*] --> FloatingC
            FloatingC --> PoppedC: Player clicks C
            PoppedC --> DestroyedC
            DestroyedC --> [*]
        }
    }

    AllFloating --> [*]: All bubbles destroyed

    note right of AllFloating: Each bubble operates<br/>independently
```

## Component Diagram: Multi-Bubble Architecture

```mermaid
graph TB
    Scene[GameScene]

    subgraph Bubble Management
        Array[Bubbles Array]
        PosGen[Position Generator]
    end

    subgraph Bubble A Instance
        BA_Sprite[Circle Sprite A]
        BA_Text[Text: 'A']
        BA_Input[Input Handler A]
    end

    subgraph Bubble B Instance
        BB_Sprite[Circle Sprite B]
        BB_Text[Text: 'B']
        BB_Input[Input Handler B]
    end

    subgraph Bubble C Instance
        BC_Sprite[Circle Sprite C]
        BC_Text[Text: 'C']
        BC_Input[Input Handler C]
    end

    subgraph Phaser Systems
        Input[Input System]
        Audio[Sound Manager]
        Tweens[Tween Manager]
    end

    Scene --> PosGen
    Scene --> Array

    Array --> BA_Sprite
    Array --> BB_Sprite
    Array --> BC_Sprite

    BA_Input --> Input
    BB_Input --> Input
    BC_Input --> Input

    BA_Sprite --> Audio
    BB_Sprite --> Audio
    BC_Sprite --> Audio

    BA_Sprite --> Tweens
    BB_Sprite --> Tweens
    BC_Sprite --> Tweens

    style Scene fill:#FFD700
    style Array fill:#87CEEB
```

## Data Flow Diagram: Audio Routing

```mermaid
flowchart LR
    subgraph Assets
        AudioA[letter-a.mp3]
        AudioB[letter-b.mp3]
        AudioC[letter-c.mp3]
        PopSnd[pop.mp3]
    end

    subgraph Scene
        Loader[Asset Loader]
        SoundMgr[Sound Manager]
    end

    subgraph Bubbles
        BubA[Bubble A<br/>letter: 'A']
        BubB[Bubble B<br/>letter: 'B']
        BubC[Bubble C<br/>letter: 'C']
    end

    AudioA --> Loader
    AudioB --> Loader
    AudioC --> Loader
    PopSnd --> Loader

    Loader --> SoundMgr

    BubA -->|"play('letter-a')"| SoundMgr
    BubB -->|"play('letter-b')"| SoundMgr
    BubC -->|"play('letter-c')"| SoundMgr

    BubA -->|"play('pop')"| SoundMgr
    BubB -->|"play('pop')"| SoundMgr
    BubC -->|"play('pop')"| SoundMgr

    style SoundMgr fill:#90EE90
```

## Timing Diagram: Simultaneous Floating

```mermaid
gantt
    title Multiple Bubble Timeline
    dateFormat X
    axisFormat %L ms

    section Bubble A
    Spawn A :milestone, ma1, 0, 0
    Float upward :a1, 0, 5000
    Player clicks :milestone, ma2, 2000, 0
    Pop animation :a2, 2000, 2300
    Destroyed :milestone, ma3, 2300, 0

    section Bubble B
    Spawn B :milestone, mb1, 0, 0
    Float upward :b1, 0, 5000
    Player clicks :milestone, mb2, 3500, 0
    Pop animation :b2, 3500, 3800
    Destroyed :milestone, mb3, 3800, 0

    section Bubble C
    Spawn C :milestone, mc1, 0, 0
    Float upward :c1, 0, 5000
    Player clicks :milestone, mc2, 4200, 0
    Pop animation :c2, 4200, 4500
    Destroyed :milestone, mc3, 4500, 0
```

## Collision Avoidance Algorithm

```mermaid
flowchart TD
    Start([Need new position]) --> Generate[Generate random X]
    Generate --> SetValid[validPosition = true]
    SetValid --> Loop{For each<br/>existing position}

    Loop -->|More positions| CalcDist[Calculate abs(newX - existingX)]
    CalcDist --> CheckDist{Distance < 150?}

    CheckDist -->|Yes: Too close| Invalid[validPosition = false]
    Invalid --> Break[Break loop]
    Break --> IsValid{validPosition?}

    CheckDist -->|No: Good spacing| Loop
    Loop -->|No more positions| IsValid

    IsValid -->|false| Attempts{attempts < 50?}
    Attempts -->|Yes| Increment[attempts++]
    Increment --> Generate

    Attempts -->|No| Fallback[Use position anyway<br/>to prevent infinite loop]
    Fallback --> Return

    IsValid -->|true| Return([Return valid position])

    style Start fill:#90EE90
    style Return fill:#FFB6C1
    style CheckDist fill:#FFD700
```

## Memory Management Diagram

```mermaid
sequenceDiagram
    participant Scene
    participant Array as bubbles[]
    participant Bubble
    participant Sprite
    participant Text

    Note over Scene,Text: Creation Phase
    Scene->>Bubble: new LetterBubble()
    Bubble->>Sprite: create sprite
    Bubble->>Text: create text
    Scene->>Array: push(bubble)

    Note over Scene,Text: Active Phase
    Note over Bubble: Bubble floating and interactive

    Note over Scene,Text: Destruction Phase
    Bubble->>Sprite: destroy()
    Sprite->>Sprite: Remove from renderer
    Sprite->>Sprite: Free GPU memory

    Bubble->>Text: destroy()
    Text->>Text: Remove from renderer
    Text->>Text: Free GPU memory

    Bubble->>Array: Find index
    Bubble->>Array: splice(index, 1)
    Array->>Array: Remove reference

    Note over Bubble: Object eligible for GC
```

## Notes

### Why This Architecture?

**Array-Based Management**
- Centralized tracking of all active bubbles
- Easy iteration for future features (e.g., "pop all", "count remaining")
- Simple cleanup when removing individual bubbles

**Independent Instances**
- Each bubble is self-contained
- No shared state between bubbles
- One bubble popping doesn't affect others
- Easier to debug and test

**Position Generation Algorithm**
- Prevents overlapping bubbles
- Maintains minimum spacing
- Fallback after 50 attempts prevents infinite loops
- Simple distance calculation (1D, X-axis only)

**Dynamic Audio Routing**
- Letter key generated from bubble's letter property
- Pattern: `letter-${this.letter.toLowerCase()}`
- Scales to any number of letters without code changes
- Example: Letter "A" → audio key "letter-a"

### Phaser-Specific Patterns

**Managing Multiple Game Objects**
```javascript
// Store in array for easy tracking
this.bubbles = [];

// Create multiple instances
letters.forEach((letter, i) => {
    const bubble = new LetterBubble(this, x, y, letter);
    this.bubbles.push(bubble);
});

// Clean up on destroy
const index = this.bubbles.indexOf(this);
if (index > -1) {
    this.bubbles.splice(index, 1);
}
```

**Dynamic Audio Keys**
```javascript
// Preload with consistent naming
this.load.audio('letter-a', 'path/to/A.mp3');
this.load.audio('letter-b', 'path/to/B.mp3');
this.load.audio('letter-c', 'path/to/C.mp3');

// Play dynamically based on data
const key = `letter-${letter.toLowerCase()}`;
this.sound.play(key);
```

**Random Number Generation**
```javascript
// Phaser's built-in random utilities
const x = Phaser.Math.Between(100, 700);
const y = Phaser.Math.Between(0, 600);

// FloatBetween for decimals
const speed = Phaser.Math.FloatBetween(1.0, 2.5);
```

### Scaling Considerations

**From 3 to Many Bubbles**
- Current: 3 bubbles, fixed spacing
- Future: 10+ bubbles, dynamic spacing
- Algorithm already handles variable count
- May need to adjust minDistance parameter

**Performance with Multiple Instances**
- 3 bubbles: No performance concerns
- 10 bubbles: Should be fine (simple graphics)
- 50+ bubbles: May need object pooling
- Each bubble has its own tweens and listeners

**Memory Management**
- Properly destroy sprites and text objects
- Remove from tracking array
- Stop any running tweens
- Phaser handles garbage collection

### What This Phase Proves

1. **Instance Management**: Multiple objects can coexist
2. **Independent Behavior**: Each bubble operates separately
3. **Dynamic Audio**: Audio keys are generated programmatically
4. **Collision Avoidance**: Simple spacing algorithm works
5. **Cleanup**: Memory is properly freed when bubbles pop
6. **Scalability**: Pattern supports future expansion

This proves our bubble system can handle multiple concurrent instances, which is essential for making the game fun and challenging.
