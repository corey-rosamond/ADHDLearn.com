# Phase 36: Memory Match - Polish - UML

## Enhanced Card Architecture

```mermaid
classDiagram
    class EnhancedCard {
        -scene Scene
        -cardData Object
        -shadow Ellipse
        -backSprite Sprite
        -frontSprite Sprite
        -objectImage Image
        -letterText Text
        -objectNameText Text
        -glowEffect Circle
        +constructor(scene, x, y, cardData, index)
        +createCardSprites()
        +createShadow()
        +setupInteraction()
        +enhancedHover()
        +enhancedFlip()
        +addGlowEffect()
        +playLetterSound()
        +setMatched()
    }

    class CardData {
        +letter String
        +name String
        +image String
        +color String
    }

    class LETTER_OBJECT_PAIRS {
        <<static>>
        +A {name, image, color}
        +B {name, image, color}
        +...
        +Z {name, image, color}
    }

    EnhancedCard --> CardData : contains
    EnhancedCard ..> LETTER_OBJECT_PAIRS : uses
```

## Difficulty System Architecture

```mermaid
graph TB
    subgraph "Difficulty Configuration"
        A[Difficulty Level Selected]
        A --> B{Which Level?}

        B --> C[Easy Mode]
        B --> D[Medium Mode]
        B --> E[Hard Mode]

        C --> C1[Grid: 3x4 12 cards]
        C --> C2[Delay: 1500ms]
        C --> C3[Letters: A-F]
        C --> C4[Preview: Yes]

        D --> D1[Grid: 3x4 12 cards]
        D --> D2[Delay: 1000ms]
        D --> D3[Letters: A-L]
        D --> D4[Preview: No]

        E --> E1[Grid: 4x4 16 cards]
        E --> E2[Delay: 800ms]
        E --> E3[Letters: A-Z]
        E --> E4[Preview: No]
    end

    subgraph "Scene Configuration"
        C1 --> F[Apply Grid Config]
        C2 --> G[Set Mismatch Delay]
        C3 --> H[Select Letter Pool]
        C4 --> I[Enable/Disable Preview]
    end

    F --> J[Create Scene]
    G --> J
    H --> J
    I --> J
```

## Letter-Object Content System

```mermaid
graph LR
    A[Letter Selected: 'A'] --> B[Lookup LETTER_OBJECT_PAIRS]
    B --> C[Get Object Data]

    C --> D[name: 'Apple']
    C --> E[image: 'apple.png']
    C --> F[color: '#ff4444']

    D --> G[Display on Card]
    E --> G
    F --> G

    G --> H[Card Face Shows:]
    H --> I[Image: apple.png top]
    H --> J[Letter: 'A' center]
    H --> K[Name: 'Apple' bottom]
```

## Enhanced Animation Flow

```mermaid
sequenceDiagram
    actor Player
    participant Card
    participant Tweens
    participant Audio
    participant Particles

    Player->>Card: Hover over card
    Card->>Tweens: Scale to 1.1, rotate 5°
    Card->>Card: Create glow circle
    Card->>Tweens: Glow expands and fades
    Card-->>Player: Visual feedback

    Player->>Card: Click card
    Card->>Audio: Play random flip sound
    Card->>Tweens: Lift card (y - 10)
    Card->>Tweens: Shrink scaleX to 0

    Note over Card: At midpoint (scaleX=0)
    Card->>Card: Swap back/front visibility
    Card->>Card: Show image, letter, name

    Card->>Tweens: Expand scaleX to 1
    Card->>Tweens: Lower card (y + 10)
    Card->>Tweens: Bounce scaleY 1.05
    Card->>Audio: Say letter name
    Card->>Particles: Small sparkle burst
    Card-->>Player: Letter revealed
```

## Background Music System

```mermaid
stateDiagram-v2
    [*] --> Loading: Scene starts

    Loading --> FadingIn: Music loaded
    FadingIn --> Playing: Volume 0 → 0.3 (2s)

    Playing --> Playing: Loop seamlessly
    Playing --> FadingOut: Scene exit

    FadingOut --> Stopped: Volume 0.3 → 0 (1s)
    Stopped --> [*]

    note right of Playing
        Volume: 0.3
        Loop: true
        Track: memory-match-bg.mp3
    end note

    note right of FadingOut
        Prevents abrupt cutoff
        Smooth transition
    end note
```

## Difficulty Selection UI

```mermaid
graph TB
    Start[Player enters scene] --> Show[Show Difficulty Selection]

    Show --> Easy[Easy Button]
    Show --> Medium[Medium Button]
    Show --> Hard[Hard Button]

    Easy --> EasyConfig[Config: 6 pairs, 1500ms, A-F, preview]
    Medium --> MediumConfig[Config: 6 pairs, 1000ms, A-L]
    Hard --> HardConfig[Config: 8 pairs, 800ms, A-Z]

    EasyConfig --> Launch[Launch MemoryMatchScene]
    MediumConfig --> Launch
    HardConfig --> Launch

    Launch --> Apply[Apply Difficulty Settings]
    Apply --> Play[Start Game]

    style Easy fill:#27ae60
    style Medium fill:#f39c12
    style Hard fill:#e74c3c
```

## Card Component Structure (Enhanced)

```mermaid
graph TB
    Container[Card Container] --> Shadow[Shadow Layer<br/>depth: -2]
    Container --> Back[Back Sprite<br/>card-back texture]
    Container --> Front[Front Sprite<br/>card-front-bg texture]
    Container --> Image[Object Image<br/>e.g., apple.png]
    Container --> Letter[Letter Text<br/>48px bold]
    Container --> Name[Object Name<br/>14px italic]

    Shadow --> S1[Ellipse 110x30]
    Shadow --> S2[Black, 30% opacity]
    Shadow --> S3[Y offset: +5]

    Image --> I1[Position: y -25]
    Image --> I2[Scale: 0.5]
    Image --> I3[From LETTER_OBJECT_PAIRS]

    Letter --> L1[Position: y +35]
    Letter --> L2[Uppercase]
    Letter --> L3[Color: #2c3e50]

    Name --> N1[Position: y +60]
    Name --> N2[From cardData.name]
    Name --> N3[Color: #7f8c8d]
```

## Performance Optimization Strategy

```mermaid
graph LR
    subgraph "Asset Loading"
        A[Texture Atlas] --> B[cards.png + cards.json]
        A --> C[objects.png + objects.json]
    end

    subgraph "Object Pooling"
        D[Particle Emitter] --> E[Reuse for all bursts]
        F[Glow Effects] --> G[Create/destroy on demand]
    end

    subgraph "Tween Management"
        H[Active Tweens] --> I[Kill on scene shutdown]
        J[Animation Complete] --> K[Clean up sprites]
    end

    subgraph "Audio"
        L[Sound Manager] --> M[Limit simultaneous sounds]
        N[Music] --> O[Single looping track]
    end

    B --> P[Efficient Rendering]
    C --> P
    E --> P
    G --> P
    I --> P
    K --> P
    M --> P
    O --> P

    P --> Q[Maintain 60 FPS]
```

## Enhanced Match Effect

```mermaid
sequenceDiagram
    participant Scene
    participant Card1
    participant Card2
    participant Effects

    Scene->>Scene: Match detected
    Scene->>Effects: Create match trail
    Effects->>Effects: Draw golden line (x1,y1)→(x2,y2)
    Effects->>Effects: Fade out over 800ms

    Scene->>Card1: Pop animation
    Scene->>Card2: Pop animation

    Card1->>Card1: Scale 1.0 → 1.3 → 1.0
    Card2->>Card2: Scale 1.0 → 1.3 → 1.0

    Note over Card1,Card2: Elastic.easeOut<br/>Duration: 400ms

    Scene->>Effects: Particles at card1 position
    Scene->>Effects: Particles at card2 position

    Effects->>Card1: Star burst (15 particles)
    Effects->>Card2: Star burst (15 particles)

    Scene->>Audio: Success sound + chime
```

## Scene Transition Animation

```mermaid
gantt
    title Scene Entry Animation Timeline
    dateFormat SSS
    axisFormat %L ms

    section Camera
    Fade in camera :a1, 000, 500ms

    section Cards
    Card 0 fly in :b1, 000, 600ms
    Card 1 fly in :b2, 050, 600ms
    Card 2 fly in :b3, 100, 600ms
    Card 3 fly in :b4, 150, 600ms
    Card 4 fly in :b5, 200, 600ms
    Card 5 fly in :b6, 250, 600ms
    Card 11 fly in :b12, 550, 600ms

    section Music
    Start music :c1, 000, 0ms
    Fade in volume :c2, 000, 2000ms

    section UI
    UI elements fade in :d1, 800, 400ms
```

## Accessibility Features

```mermaid
graph TB
    A[Player Settings] --> B{Choose Options}

    B --> C[High Contrast Mode]
    B --> D[Reduced Motion]
    B --> E[Keyboard Controls]
    B --> F[Audio Descriptions]

    C --> C1[Stronger colors]
    C --> C2[Bold outlines]
    C --> C3[Black/white cards]

    D --> D1[Shorter animations]
    D --> D2[No elastic/bounce]
    D --> D3[Simple fades only]

    E --> E1[TAB to cycle cards]
    E --> E2[SPACE to flip]
    E --> E3[Visual focus ring]

    F --> F1[Letter names spoken]
    F --> F2[Match/mismatch audio cues]
    F --> F3[Progress announcements]

    C1 --> G[Enhanced Accessibility]
    C2 --> G
    C3 --> G
    D1 --> G
    D2 --> G
    D3 --> G
    E1 --> G
    E2 --> G
    E3 --> G
    F1 --> G
    F2 --> G
    F3 --> G

    G --> H[Inclusive Experience]
```

## Audio System Architecture

```mermaid
graph LR
    subgraph "Background Music"
        BG[memory-match-bg.mp3] --> BGLoop[Loop: true<br/>Volume: 0.3]
    end

    subgraph "Flip Sounds"
        F1[card-flip-1.mp3] --> Random
        F2[card-flip-2.mp3] --> Random
        F3[card-flip-3.mp3] --> Random
        Random[Random Selection] --> Play1[Play on flip]
    end

    subgraph "Letter Pronunciation"
        L1[letter-a.mp3] --> LetterPool
        L2[letter-b.mp3] --> LetterPool
        L3[...] --> LetterPool
        L26[letter-z.mp3] --> LetterPool
        LetterPool --> Play2[Play on reveal]
    end

    subgraph "Feedback Sounds"
        Match[match-success.mp3] --> Play3[Volume: 0.5]
        Mismatch[card-mismatch.mp3] --> Play4[Volume: 0.3]
        Complete[round-complete.mp3] --> Play5[Volume: 0.6]
    end

    BGLoop --> Mix[Audio Mix]
    Play1 --> Mix
    Play2 --> Mix
    Play3 --> Mix
    Play4 --> Mix
    Play5 --> Mix

    Mix --> Output[Audio Output]
```

## Data Flow: Difficulty to Game Config

```mermaid
flowchart TD
    A[User selects difficulty] --> B{Difficulty?}

    B -->|Easy| C[Easy Config Object]
    B -->|Medium| D[Medium Config Object]
    B -->|Hard| E[Hard Config Object]

    C --> C1[rows: 3, cols: 4]
    C --> C2[totalPairs: 6]
    C --> C3[mismatchDelay: 1500]
    C --> C4[letterPool: 'ABCDEF']
    C --> C5[showPreview: true]

    D --> D1[rows: 3, cols: 4]
    D --> D2[totalPairs: 6]
    D --> D3[mismatchDelay: 1000]
    D --> D4[letterPool: 'ABCDEFGHIJKL']
    D --> D5[showPreview: false]

    E --> E1[rows: 4, cols: 4]
    E --> E2[totalPairs: 8]
    E --> E3[mismatchDelay: 800]
    E --> E4[letterPool: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ']
    E --> E5[showPreview: false]

    C1 --> F[Apply to gridConfig]
    C2 --> G[Set totalPairs]
    C3 --> H[Set mismatchDelay]
    C4 --> I[Filter letter selection]
    C5 --> J[Enable preview feature]

    D1 --> F
    D2 --> G
    D3 --> H
    D4 --> I
    D5 --> J

    E1 --> F
    E2 --> G
    E3 --> H
    E4 --> I
    E5 --> J

    F --> K[Create Card Grid]
    G --> K
    H --> L[Use in handleMismatch]
    I --> M[Select random letters]
    J --> N[Show/skip preview]

    K --> O[Game Ready]
    L --> O
    M --> O
    N --> O
```

## Preview Mode (Easy Difficulty)

```mermaid
sequenceDiagram
    participant Scene
    participant Cards
    participant Timer
    participant Player

    Scene->>Scene: Check if showPreview
    alt Preview enabled (Easy mode)
        Scene->>Cards: Flip all face-up (200ms)
        Cards-->>Scene: All revealed
        Scene->>Timer: Wait 3000ms
        Note over Scene,Player: Player sees all cards<br/>Time to memorize

        Timer-->>Scene: 3 seconds elapsed
        Scene->>Cards: Flip all face-down (200ms)
        Cards-->>Scene: All hidden

        Scene->>Timer: Wait 500ms
        Timer-->>Scene: Ready
        Scene->>Scene: canFlip = true
        Scene-->>Player: Game starts
    else No preview (Medium/Hard)
        Scene->>Scene: canFlip = true
        Scene-->>Player: Game starts immediately
    end
```

## Notes

### Why Enhanced Animations?

**User Experience Benefits**:
- Hover effects provide immediate feedback
- Glow creates magical, engaging feel
- Rotation adds depth and life
- Professional polish increases enjoyment

**Implementation**:
- Tweens are lightweight
- Effects are subtle, not distracting
- ADHD-friendly: engaging without overwhelming

### Letter-Object Associations

**Educational Value**:
- Visual connection strengthens memory
- Phonetic association (A = Apple)
- Multi-sensory learning (see image, hear name)
- Builds vocabulary alongside letter recognition

**Content Design**:
- Common, recognizable objects
- Clear, colorful images
- Age-appropriate choices
- Culturally relevant

### Difficulty Rationale

**Easy Mode**:
- Fewer unique letters (less cognitive load)
- Longer delay (more processing time)
- Preview mode (reduces anxiety)
- Perfect for beginners or ADHD players

**Medium Mode**:
- Standard memory game experience
- Balanced challenge
- Default for most players

**Hard Mode**:
- More cards (increased working memory demand)
- Faster pace (less time per decision)
- Full alphabet (maximum variety)
- For experienced players

### Audio Design Philosophy

**Background Music**:
- 60-90 BPM (calm, focused pace)
- No lyrics (no distraction)
- Loops seamlessly (no jarring transitions)
- Low volume (ambient, not dominant)

**Sound Effects**:
- Flip sounds: Quick, satisfying
- Match success: Positive, rewarding
- Mismatch: Gentle, neutral (not punishing)
- Letter names: Clear pronunciation
- Volume hierarchy: Feedback > Effects > Music

### Performance Considerations

**Texture Atlases**:
- Combine 26+ images into single texture
- Reduces draw calls
- Faster loading
- Better GPU utilization

**Object Pooling**:
- Particle emitters created once
- Reused for all effects
- No create/destroy overhead

**Tween Management**:
- Kill all on scene shutdown
- Prevents memory leaks
- Clean state transitions

### Accessibility Impact

**High Contrast**:
- Helps dyslexic players
- Reduces eye strain
- Clearer visual hierarchy

**Reduced Motion**:
- Prevents motion sensitivity issues
- Faster for some ADHD players
- Accessibility standard

**Keyboard Controls**:
- Mouse-free operation
- Focus management
- Tab navigation

### What This Phase Achieves

1. **Professional Quality**: Game feels polished and complete
2. **Educational Value**: Letter-object associations aid learning
3. **Accessibility**: Multiple difficulty and accessibility options
4. **Engagement**: Enhanced effects maintain interest
5. **Performance**: Optimized for smooth experience
6. **Replayability**: Difficulty variations extend gameplay

This phase transforms a functional prototype into a production-ready game worthy of Aurora's Letter Adventure.
