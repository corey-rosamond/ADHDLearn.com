# Phase 34: Memory Match - Card Flip Mechanic - UML

## Class Diagram

```mermaid
classDiagram
    class Card {
        -scene Scene
        -cardData Object
        -index Number
        -flipped Boolean
        -matched Boolean
        -isFlipping Boolean
        -backSprite Sprite
        -frontSprite Sprite
        -letterText Text
        +constructor(scene, x, y, cardData, index)
        +createCardSprites()
        +createFrontBackground()
        +setupInteraction()
        +flip(faceUp, duration) void
        +setMatched() void
        +reset() void
    }

    class MemoryMatchScene {
        -cards Array~Card~
        -cardData Array
        -flippedCards Array~Card~
        -canFlip Boolean
        -gridConfig Object
        +createCardGrid()
        +onCardClick(card)
        +checkMatch()
        +resetFlippedCards()
    }

    class PhaserContainer {
        <<interface>>
        +add(child)
        +setInteractive()
        +setSize(w, h)
        +setDepth(d)
    }

    class CardData {
        +letter String
        +type String
        +id String
    }

    Card --|> PhaserContainer : extends
    MemoryMatchScene --> Card : creates 12
    Card --> CardData : contains
    Card ..> AudioManager : uses
    Card ..> TweenManager : uses
```

## Flip Animation Sequence

```mermaid
sequenceDiagram
    actor Player
    participant Scene as MemoryMatchScene
    participant Card as Card Object
    participant Tween as Phaser Tweens
    participant Audio as AudioManager

    Player->>Scene: Click card
    Scene->>Card: Validate click
    Card->>Card: Check isFlipping
    Card->>Card: Check matched

    alt Valid click
        Scene->>Audio: play('card-select')
        Scene->>Card: flip(true, 300)

        Card->>Card: Set isFlipping = true
        Card->>Audio: play('card-flip')

        Card->>Tween: Shrink phase (scaleX: 1 → 0)
        Note over Card,Tween: Duration: 150ms<br/>Easing: Sine.easeIn

        Tween-->>Card: Phase 1 complete (scaleX = 0)

        Card->>Card: Swap sprites
        Card->>Card: backSprite.visible = false
        Card->>Card: frontSprite.visible = true
        Card->>Card: letterText.visible = true

        Card->>Tween: Expand phase (scaleX: 0 → 1)
        Note over Card,Tween: Duration: 150ms<br/>Easing: Sine.easeOut

        Tween-->>Card: Phase 2 complete (scaleX = 1)

        Card->>Card: Set flipped = true
        Card->>Card: Set isFlipping = false

        Card->>Tween: Bounce effect (scaleY: 1 → 1.05 → 1)
        Note over Card,Tween: Duration: 100ms<br/>Yoyo: true

        Card->>Scene: emit('flipComplete', this)

        Scene->>Scene: Add to flippedCards[]
        Scene->>Scene: Check flippedCards.length

        alt Two cards flipped
            Scene->>Scene: Set canFlip = false
            Note over Scene: Phase 35 will add<br/>match logic here

            Scene->>Scene: Wait 1 second (placeholder)
            Scene->>Card: flip(false, 300)
            Note over Scene,Card: Both cards flip back<br/>Same animation, reversed
        end
    else Invalid click
        Scene->>Scene: Ignore click
        Note over Scene: Log to console
    end
```

## Flip Animation State Machine

```mermaid
stateDiagram-v2
    [*] --> FaceDown: Initial state

    FaceDown --> Flipping_ShrinkPhase: flip(true) called
    Flipping_ShrinkPhase --> Flipping_Midpoint: scaleX reaches 0
    Flipping_Midpoint --> Flipping_ExpandPhase: Sprites swapped
    Flipping_ExpandPhase --> Bouncing: scaleX reaches 1
    Bouncing --> FaceUp: Bounce complete

    FaceUp --> Flipping_ShrinkBack: flip(false) called
    Flipping_ShrinkBack --> Flipping_MidpointBack: scaleX reaches 0
    Flipping_MidpointBack --> Flipping_ExpandBack: Sprites swapped
    Flipping_ExpandBack --> FaceDown: scaleX reaches 1

    FaceUp --> Matched: setMatched() called
    Matched --> [*]: Game complete

    note right of Flipping_ShrinkPhase
        isFlipping = true
        Duration: 150ms
        Easing: Sine.easeIn
    end note

    note right of Flipping_Midpoint
        Swap visibility:
        - Back hidden
        - Front shown
        - Letter shown
    end note

    note right of Flipping_ExpandPhase
        isFlipping still true
        Duration: 150ms
        Easing: Sine.easeOut
    end note

    note right of FaceUp
        isFlipping = false
        flipped = true
        Ready for match check
    end note
```

## Card Component Structure

```mermaid
graph TB
    subgraph "Card Container"
        Container[Phaser.GameObjects.Container<br/>x, y, depth: 10]

        Container --> BackSprite[Back Sprite<br/>texture: 'card-back'<br/>visible: true initially]
        Container --> FrontSprite[Front Sprite<br/>texture: 'card-front-bg'<br/>visible: false initially]
        Container --> LetterText[Letter Text<br/>fontSize: 64px<br/>visible: false initially]

        BackSprite --> BackTexture[Card Back Texture<br/>Blue, rounded, star icon]
        FrontSprite --> FrontTexture[Card Front Texture<br/>White, rounded, border]
        LetterText --> LetterData[Letter from CardData<br/>Uppercase, bold]
    end

    subgraph "Card State"
        State[Card State Variables]
        State --> Flipped[flipped: boolean]
        State --> Matched[matched: boolean]
        State --> IsFlipping[isFlipping: boolean]
        State --> Index[index: number]
        State --> Data[cardData: object]
    end

    subgraph "Card Interaction"
        Interaction[Interactive Area<br/>100x140 rectangle]
        Interaction --> Hover[Hover: scale 1.05]
        Interaction --> Click[Click: flip()]
    end

    Container --> State
    Container --> Interaction
```

## Two-Card Selection Logic

```mermaid
flowchart TD
    A[Player clicks card] --> B{canFlip?}
    B -->|No| Z1[Ignore click]
    B -->|Yes| C{Card flipped?}

    C -->|Yes| Z2[Ignore click]
    C -->|No| D{Card matched?}

    D -->|Yes| Z3[Ignore click]
    D -->|No| E{2 cards flipped?}

    E -->|Yes| Z4[Ignore click]
    E -->|No| F[Play select sound]

    F --> G[Flip card face up]
    G --> H[Add to flippedCards[]]
    H --> I{flippedCards.length === 2?}

    I -->|No| J[Wait for next click]
    I -->|Yes| K[Set canFlip = false]

    K --> L[Phase 35: Check match]
    L --> M{Match?}

    M -->|Phase 35| N[Keep cards revealed]
    M -->|Phase 35| O[Flip cards back]

    N --> P[Increment match count]
    O --> Q[Wait 1 second]

    P --> R[Set canFlip = true]
    Q --> S[Flip both cards back]
    S --> T[Clear flippedCards[]]
    T --> R

    Z1 --> End[End]
    Z2 --> End
    Z3 --> End
    Z4 --> End
    J --> End
    R --> End

    style K fill:#ffcccc
    style L fill:#ffffcc
    style M fill:#ffffcc
    style N fill:#ccffcc
    style O fill:#ffcccc
```

## Flip Animation Timing Diagram

```mermaid
gantt
    title Card Flip Animation Timeline (300ms total)
    dateFormat SSS
    axisFormat %L ms

    section Phase 1: Shrink
    scaleX 1.0 → 0.0 (Sine.easeIn) :a1, 000, 150ms
    Sprite visible: Back :a2, 000, 75ms

    section Midpoint
    Swap sprites :milestone, 150, 0ms

    section Phase 2: Expand
    scaleX 0.0 → 1.0 (Sine.easeOut) :b1, 150, 150ms
    Sprite visible: Front :b2, 150, 150ms

    section Bounce
    scaleY 1.0 → 1.05 → 1.0 :c1, 300, 100ms

    section Complete
    Emit flipComplete :milestone, 400, 0ms
```

## Card Memory Layout

```mermaid
graph LR
    subgraph "MemoryMatchScene.cards Array"
        A[Card 0<br/>Letter: T]
        B[Card 1<br/>Letter: A]
        C[Card 2<br/>Letter: R]
        D[Card 3<br/>Letter: M]
        E[...]
        F[Card 11<br/>Letter: S]
    end

    subgraph "flippedCards Array (max 2)"
        G[Empty initially]
        H[Card after 1st flip]
        I[Card after 2nd flip]
    end

    A -.->|Click 1| H
    B -.->|Click 2| I

    subgraph "After 2 flipped"
        J[canFlip = false]
        K[Disable input]
        L[Check match Phase 35]
        M[Reset or keep]
    end

    I --> J
    J --> K
    K --> L
    L --> M
    M -.->|Reset| G
```

## Data Flow: Card Click to Flip

```mermaid
sequenceDiagram
    participant P as Player
    participant C as Card Container
    participant S as MemoryMatchScene
    participant T as Tween System
    participant A as Audio System

    P->>C: pointerdown event
    C->>S: emit 'pointerdown'
    S->>S: onCardClick(card)

    Note over S: Validation checks
    S->>C: getData('flipped')
    S->>C: getData('matched')
    S->>S: Check canFlip
    S->>S: Check flippedCards.length

    alt All valid
        S->>A: play('card-select')
        S->>C: flip(true, 300)

        C->>C: Check isFlipping
        C->>C: Set isFlipping = true
        C->>A: play('card-flip')

        C->>T: Create tween (scaleX → 0)
        T->>T: Animate 150ms
        T-->>C: onComplete callback

        C->>C: Hide backSprite
        C->>C: Show frontSprite
        C->>C: Show letterText

        C->>T: Create tween (scaleX → 1)
        T->>T: Animate 150ms
        T-->>C: onComplete callback

        C->>C: Set flipped = true
        C->>C: Set isFlipping = false
        C->>T: Create bounce tween

        C->>S: emit('flipComplete')
        S->>S: Push card to flippedCards
        S->>S: Check if 2 cards flipped

        alt 2 cards flipped
            S->>S: Set canFlip = false
            Note over S: Phase 35: Match logic<br/>Phase 34: Placeholder delay
        end
    else Invalid
        S->>S: Log and return
    end
```

## Class Interaction Diagram

```mermaid
graph TB
    Scene[MemoryMatchScene]
    CardClass[Card Class]
    Phaser[Phaser Engine]

    Scene -->|creates 12| CardClass
    Scene -->|calls flip| CardClass
    Scene -->|tracks in arrays| CardClass

    CardClass -->|extends| Container[Container]
    CardClass -->|uses| Tweens[Tween System]
    CardClass -->|uses| Audio[Audio System]
    CardClass -->|uses| Graphics[Graphics API]

    Container -->|provided by| Phaser
    Tweens -->|provided by| Phaser
    Audio -->|provided by| Phaser
    Graphics -->|provided by| Phaser

    CardClass -->|emits| Events[flipComplete event]
    Scene -->|listens to| Events

    Scene -->|manages| State[Game State]
    State -->|contains| FlippedCards[flippedCards array]
    State -->|contains| CanFlip[canFlip flag]
    State -->|contains| MatchCount[matchCount]
```

## Flip Animation Visual States

```mermaid
graph LR
    A[scaleX: 1.0<br/>Back visible] -->|75ms| B[scaleX: 0.5<br/>Shrinking]
    B -->|75ms| C[scaleX: 0.0<br/>Edge-on view]
    C -->|Instant| D[scaleX: 0.0<br/>Front visible]
    D -->|75ms| E[scaleX: 0.5<br/>Expanding]
    E -->|75ms| F[scaleX: 1.0<br/>Front visible]
    F -->|50ms| G[scaleY: 1.05<br/>Bounce up]
    G -->|50ms| H[scaleY: 1.0<br/>Settle]

    style A fill:#3498db
    style C fill:#95a5a6
    style D fill:#95a5a6
    style F fill:#ffffff
    style H fill:#ffffff
```

## Notes

### Why Container-Based Card?

**Benefits of Container Approach**:
- Groups sprites together as single unit
- Easier to transform (scale, rotate, move)
- Children inherit container transforms
- Clean encapsulation of card logic
- Reusable across different scenes
- Simplifies state management

**Alternative Approaches**:
- Individual sprites: Harder to manage transformations
- Single sprite with texture swap: Less flexible for complex designs
- DOM elements: Poor performance, not game-like

### 3D Flip Animation Technique

**How It Works**:
1. Shrink card horizontally (scaleX: 1 → 0)
2. At midpoint (scaleX = 0), card is edge-on (invisible)
3. Swap sprite visibility (back → front)
4. Expand card horizontally (scaleX: 0 → 1)
5. Front now visible, appears as smooth flip

**Why This Works**:
- Human eye perceives horizontal shrink as rotation
- Midpoint swap is hidden when card is edge-on
- Sine easing makes motion natural
- Total 300ms feels smooth and satisfying
- Works on all devices without 3D rendering

**Math Behind It**:
```
Phase 1: 0ms   → 150ms (scaleX: 1.0 → 0.0, Sine.easeIn)
Midpoint: 150ms (scaleX: 0.0, swap sprites)
Phase 2: 150ms → 300ms (scaleX: 0.0 → 1.0, Sine.easeOut)
```

### Two-Card Selection System

**Game Rule**: Memory match requires comparing 2 cards

**Implementation Strategy**:
1. Allow any card to be clicked (if valid)
2. Track in `flippedCards` array
3. When array length = 2, disable further input
4. Process match check (Phase 35)
5. Either keep cards revealed or flip back
6. Clear array and re-enable input

**Why Array-Based**:
- Simple to track which cards are flipped
- Easy to access both cards for comparison
- Natural JavaScript pattern
- O(1) access time

### Timing Considerations for ADHD

**Animation Duration: 300ms**
- Fast enough to feel responsive
- Slow enough to see what's happening
- Prevents confusion from instant changes
- Industry standard for card flips

**Delay Before Flip-Back: 1000ms (Phase 35)**
- Gives player time to memorize cards
- Not so long that they get impatient
- Allows visual processing
- Can be adjusted based on difficulty

**Sound Feedback**:
- Immediate (0ms delay)
- Reinforces action instantly
- Helps maintain attention
- Short duration prevents overlap

### Design Decisions

**Why Containers Over Sprites**:
- Easier to add more card elements later
- Cleaner code organization
- Better encapsulation
- Standard game development pattern

**Why Two-Phase Tween**:
- Single scaleX tween can't swap sprites mid-animation
- Two phases allow midpoint sprite swap
- Separate easing for each phase feels natural
- Gives precise control over timing

**Why 64px Letter Size**:
- Large enough to read from distance
- Fills card space appropriately
- Good for young children and ADHD focus
- Scales well on different displays

**Why Bounce Effect**:
- Adds satisfying "weight" to card
- Provides feedback that flip completed
- Makes interaction feel polished
- Subtle enough not to distract

### What This Phase Proves

1. **Card Class Works**: Reusable, self-contained card objects
2. **Flip Animation**: Smooth 3D effect without 3D rendering
3. **Input Control**: Two-card limit enforced correctly
4. **State Management**: Tracks flipped/matched states
5. **Integration**: Card class works within scene architecture
6. **Performance**: Animations are smooth at 60fps

This establishes the core interaction mechanic. Phase 35 will add the match logic that makes it a true memory game.
