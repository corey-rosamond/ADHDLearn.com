# Phase 33: Memory Match - Scene Setup - UML

## Class Diagram

```mermaid
classDiagram
    class MemoryMatchScene {
        -gridConfig Object
        -cards Array
        -cardData Array
        -flippedCards Array
        -matchedCards Array
        -matchCount Number
        -totalPairs Number
        -canFlip Boolean
        -titleText Text
        -instructionText Text
        -matchesText Text
        -backButton Text
        +constructor()
        +init(data)
        +preload()
        +create()
        +createBackground()
        +createHeader()
        +createCardBackGraphic()
        +initializeCards()
        +createCardGrid()
        +createCard(x, y, index) Sprite
        +onCardClick(index)
        +createUIElements()
        +updateMatchesDisplay()
    }

    class GridConfig {
        +rows Number
        +cols Number
        +cardWidth Number
        +cardHeight Number
        +paddingX Number
        +paddingY Number
    }

    class CardData {
        +letter String
        +type String
        +id String
    }

    class CardSprite {
        +x Number
        +y Number
        +texture String
        +index Number
        +flipped Boolean
        +matched Boolean
    }

    MemoryMatchScene --> GridConfig : uses
    MemoryMatchScene --> CardData : contains
    MemoryMatchScene --> CardSprite : creates
    CardSprite --> CardData : references
```

## Scene Flow Diagram

```mermaid
sequenceDiagram
    actor Player
    participant Menu as MainMenu
    participant Scene as MemoryMatchScene
    participant Phaser as Phaser Engine

    Player->>Menu: Select Memory Match
    Menu->>Scene: scene.start('MemoryMatchScene')
    Scene->>Scene: init()
    Note over Scene: Initialize grid config,<br/>game state variables

    Scene->>Scene: preload()
    Note over Scene: Load any required assets<br/>(minimal for Phase 33)

    Scene->>Scene: create()
    Scene->>Scene: createBackground()
    Scene->>Phaser: setBackgroundColor('#9b59b6')
    Scene->>Phaser: add.rectangle() for border

    Scene->>Scene: createHeader()
    Scene->>Phaser: add.text('Memory Match')
    Scene->>Phaser: add.text('Find matching pairs!')

    Scene->>Scene: createCardBackGraphic()
    Scene->>Phaser: add.graphics()
    Scene->>Phaser: fillRoundedRect()
    Scene->>Phaser: generateTexture('card-back')

    Scene->>Scene: initializeCards()
    Note over Scene: Select 6 random letters,<br/>create pairs, shuffle

    Scene->>Scene: createCardGrid()
    loop For each card position
        Scene->>Scene: createCard(x, y, index)
        Scene->>Phaser: add.sprite(x, y, 'card-back')
        Scene->>Phaser: setInteractive()
        Phaser-->>Scene: Card sprite
    end

    Scene->>Scene: createUIElements()
    Scene->>Phaser: add.text('Matches: 0/6')
    Scene->>Phaser: add.text('Back')

    Scene-->>Player: Display grid of 12 cards

    Player->>Scene: Click card
    Scene->>Scene: onCardClick(index)
    Note over Scene: Log to console<br/>(animation in Phase 34)
    Scene-->>Player: Visual feedback

    Player->>Scene: Click Back button
    Scene->>Menu: scene.start('MainMenu')
```

## Grid Layout Algorithm

```mermaid
graph TD
    A[Start: Create Grid] --> B[Define Grid Config]
    B --> C[rows: 3, cols: 4]
    B --> D[cardWidth: 100, cardHeight: 140]
    B --> E[paddingX: 20, paddingY: 20]

    C --> F[Calculate Total Dimensions]
    D --> F
    E --> F

    F --> G[totalWidth = cols * cardWidth +<br/>cols-1 * paddingX]
    F --> H[totalHeight = rows * cardHeight +<br/>rows-1 * paddingY]

    G --> I[Calculate Start Position]
    H --> I

    I --> J[startX = 800 - totalWidth / 2 +<br/>cardWidth / 2]
    I --> K[startY = 150<br/>leave space for header]

    J --> L[Loop Through Rows]
    K --> L

    L --> M{For each row}
    M -->|row 0-2| N[Loop Through Cols]
    N --> O{For each col}
    O -->|col 0-3| P[Calculate Position]

    P --> Q[x = startX + col *<br/>cardWidth + paddingX]
    P --> R[y = startY + row *<br/>cardHeight + paddingY]

    Q --> S[Create Card at x, y]
    R --> S

    S --> T[Store in cards array]
    T --> O

    O -->|col 4| M
    M -->|row 3| U[Grid Complete:<br/>12 cards created]
```

## Card Data Structure

```mermaid
graph LR
    A[Alphabet A-Z] --> B[Shuffle]
    B --> C[Select First 6 Letters]
    C --> D[Example: A, M, T, R, S, K]

    D --> E[Create Pairs]
    E --> F[A, A, M, M, T, T, R, R, S, S, K, K]

    F --> G[Shuffle Pairs]
    G --> H[Random Order:<br/>T, A, R, M, A, T,<br/>K, S, M, R, K, S]

    H --> I[Assign to Grid Positions]
    I --> J[cardData Array]

    J --> K[Index 0: T]
    J --> L[Index 1: A]
    J --> M[Index 2: R]
    J --> N[... 12 total]
```

## State Diagram

```mermaid
stateDiagram-v2
    [*] --> Initializing: scene.start()

    Initializing --> LoadingAssets: init() complete
    LoadingAssets --> CreatingBackground: preload() complete

    CreatingBackground --> CreatingHeader: Background rendered
    CreatingHeader --> GeneratingCardBack: Header text added

    GeneratingCardBack --> InitializingData: Texture created
    InitializingData --> CreatingGrid: Letters selected & shuffled

    CreatingGrid --> Ready: All 12 cards created

    Ready --> WaitingForInput: Scene complete

    WaitingForInput --> CardHovered: Mouse over card
    CardHovered --> WaitingForInput: Mouse out

    WaitingForInput --> CardClicked: Click card
    CardClicked --> WaitingForInput: Log event (Phase 33)

    WaitingForInput --> ExitingScene: Click Back button
    ExitingScene --> [*]: Return to MainMenu

    note right of CardClicked
        Phase 33: Just logs event
        Phase 34: Will trigger flip
    end note
```

## Component Diagram

```mermaid
graph TB
    Scene[MemoryMatchScene]

    Scene --> BG[Background Components]
    Scene --> Header[Header Components]
    Scene --> Grid[Grid Components]
    Scene --> UI[UI Components]

    BG --> BGColor[Background Color<br/>#9b59b6]
    BG --> Border[Decorative Border<br/>Rectangle]

    Header --> Title[Title Text<br/>'Memory Match']
    Header --> Subtitle[Instruction Text<br/>'Find matching pairs!']

    Grid --> CardTexture[Card Back Texture<br/>Generated from Graphics]
    Grid --> CardArray[12 Card Sprites]

    CardArray --> Card1[Card 0 - Position 0,0]
    CardArray --> Card2[Card 1 - Position 0,1]
    CardArray --> Card3[Card 2 - Position 0,2]
    CardArray --> CardN[... Card 11 - Position 2,3]

    UI --> Counter[Matches Counter<br/>'Matches: 0/6']
    UI --> BackBtn[Back Button<br/>Return to Menu]

    CardTexture --> Graphics[Phaser Graphics API]
    Graphics --> Fill[Blue Fill #3498db]
    Graphics --> Stroke[Border #2980b9]
    Graphics --> Icon[Star Decoration]
```

## Layout Diagram

```mermaid
graph TB
    subgraph "Screen 800x600"
        subgraph "Header Zone y:0-120"
            Title["'Memory Match'<br/>y:40 centered"]
            Subtitle["'Find matching pairs!'<br/>y:90 centered"]
        end

        subgraph "UI Bar y:70-110"
            Counter["'Matches: 0/6'<br/>x:60 left"]
            BackBtn["'Back' button<br/>x:740 right"]
        end

        subgraph "Grid Zone y:150-550"
            subgraph "Row 0 y:150"
                C00["Card 0<br/>100x140"]
                C01["Card 1"]
                C02["Card 2"]
                C03["Card 3"]
            end

            subgraph "Row 1 y:310"
                C10["Card 4"]
                C11["Card 5"]
                C12["Card 6"]
                C13["Card 7"]
            end

            subgraph "Row 2 y:470"
                C20["Card 8"]
                C21["Card 9"]
                C22["Card 10"]
                C23["Card 11"]
            end
        end
    end

    style Title fill:#fff,stroke:#333,stroke-width:2px
    style Counter fill:#9b59b6,stroke:#333,stroke-width:2px
    style BackBtn fill:#e74c3c,stroke:#333,stroke-width:2px
    style C00 fill:#3498db,stroke:#2980b9,stroke-width:4px
    style C01 fill:#3498db,stroke:#2980b9,stroke-width:4px
```

## Data Flow: Card Click Event

```mermaid
sequenceDiagram
    participant Player
    participant Card as Card Sprite
    participant Scene as MemoryMatchScene
    participant Console

    Player->>Card: Hover over card
    Card->>Card: Check flipped status
    Card->>Card: Check matched status
    alt Not flipped AND not matched
        Card->>Card: setScale(1.05)
        Card-->>Player: Visual feedback
    end

    Player->>Card: Move away
    Card->>Card: setScale(1.0)

    Player->>Card: Click card
    Card->>Scene: on('pointerdown')
    Scene->>Scene: onCardClick(index)

    Scene->>Card: getData('flipped')
    Scene->>Card: getData('matched')
    Scene->>Scene: Check canFlip flag

    alt Card can be clicked
        Scene->>Console: Log click event
        Console-->>Scene: Event logged
        Note over Scene: Phase 33: Placeholder<br/>Phase 34: Will trigger flip
    else Card cannot be clicked
        Scene->>Scene: Ignore click
    end
```

## Memory Structure

```mermaid
graph LR
    subgraph "MemoryMatchScene Instance"
        A[cards Array<br/>12 Sprite references]
        B[cardData Array<br/>12 CardData objects]
        C[flippedCards Array<br/>Currently empty]
        D[matchedCards Array<br/>Currently empty]
    end

    subgraph "Card Data"
        E[Index 0: T, letter, T-1]
        F[Index 1: A, letter, A-1]
        G[Index 2: R, letter, R-1]
        H[...]
        I[Index 11: S, letter, S-2]
    end

    A --> J[Card Sprite 0]
    A --> K[Card Sprite 1]
    A --> L[...]

    B --> E
    B --> F
    B --> G
    B --> H
    B --> I

    J --> M[Data: index=0, flipped=false]
    K --> N[Data: index=1, flipped=false]
```

## Notes

### Why This Architecture?

**Grid-Based Layout**
- Mathematical positioning ensures perfect alignment
- Easy to modify grid size (3x4, 4x4, 5x4, etc.)
- Scalable for different difficulty levels
- Centered layout adapts to screen size

**Generated Card Back Texture**
- Single texture for all card backs (memory efficient)
- Programmatically generated (no asset file needed)
- Easy to modify design programmatically
- Consistent appearance across all cards

**Array-Based Card Storage**
- Simple indexing for card access
- Efficient for small number of cards (12)
- Direct mapping to grid positions
- Easy to iterate for updates

**Placeholder Interaction**
- Phase 33 establishes click handlers
- Console logging proves interaction works
- Phase 34 will replace placeholder with animation
- Separation of concerns (layout vs. interaction)

### Design Decisions

**Grid Size: 3x4 (12 cards)**
- 6 pairs is appropriate for young children
- Not overwhelming for ADHD learners
- Fits well in 800x600 canvas
- Standard memory game size

**Purple Color Scheme**
- Distinct from other mini-games (blue, green, etc.)
- Calming and focused aesthetic
- Good contrast for readability
- Gender-neutral color

**Card Dimensions: 100x140**
- Large enough to see clearly
- Appropriate aspect ratio (portrait)
- Room for letter or image on face
- Fits 12 cards with spacing

**Rounded Corners**
- Friendly, approachable design
- Safer visual feel for children
- Modern aesthetic
- Easier to identify as interactive elements

### What This Phase Proves

1. **Scene Setup**: MemoryMatchScene loads correctly
2. **Layout Algorithm**: Grid calculation is accurate
3. **Visual Design**: Card backs are appealing and clear
4. **Interaction Ready**: Click handlers in place for Phase 34
5. **UI Integration**: Scene works within game flow
6. **Performance**: 12 sprites render smoothly

This phase establishes the visual foundation. Phase 34 will add the interactive flip mechanics and card content display.
