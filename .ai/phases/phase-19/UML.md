# Phase 19: Difficulty Levels - UML

## Difficulty System Class Diagram

```mermaid
classDiagram
    class DifficultyConfig {
        <<static>>
        +Object easy
        +Object medium
        +Object hard
        +getDifficultyConfig(key) Object
        +getAllDifficulties() Array
    }

    class EasyConfig {
        +key: "easy"
        +name: "Easy"
        +bubbleCount: 3
        +letterCase: "uppercase"
        +letterPool: "common"
        +similarLetters: false
        +commonLetters: Array
        +bubbleSize: 100
        +color: "#27ae60"
    }

    class MediumConfig {
        +key: "medium"
        +name: "Medium"
        +bubbleCount: 4
        +letterCase: "mixed"
        +letterPool: "all"
        +similarLetters: false
        +allLetters: Array
        +bubbleSize: 90
        +color: "#f39c12"
    }

    class HardConfig {
        +key: "hard"
        +name: "Hard"
        +bubbleCount: 5
        +letterCase: "mixed"
        +letterPool: "similar"
        +similarLetters: true
        +similarLetterPairs: Object
        +bubbleSize: 85
        +color: "#e74c3c"
    }

    class LetterPoolManager {
        -Array commonLetters
        -Array allLetters
        -Object similarPairs

        +getLetterPool(difficulty) Array
        +getRandomLetter(difficulty) string
        +getLetterInCase(letter, caseType) string
        +generateDistractors(target, difficulty, count) Array
        +formatLetterForDisplay(letter, caseType) string
        +getAudioText(letter, caseType) string
    }

    class LetterPopScene {
        -string difficulty
        -Object difficultyConfig
        -string targetLetter
        -number score
        -Group bubbleGroup

        +init(data) void
        +create() void
        +displayCurrentLetter() void
        +createBubbles() void
        +calculateBubblePositions(count) Array
        +createBubble(x, y, letter, config) Container
        +onBubbleClick(bubble) void
        +endRound() void
    }

    class MainMenu {
        -string selectedDifficulty
        -Container[] difficultyButtons

        +create() void
        +createDifficultySelection() void
        +selectDifficulty(key) void
        +createPlayButton() void
    }

    class ProgressManager {
        +getRecommendedDifficulty() string
        +getRecentAccuracy(roundCount) number
        +getMasteredLetterCount() number
        +getLongestStreak() number
        +getRoundHistory(count) Array
    }

    class ResultsScene {
        +init(data) void
        -string difficulty
    }

    DifficultyConfig --> EasyConfig
    DifficultyConfig --> MediumConfig
    DifficultyConfig --> HardConfig

    LetterPoolManager --> DifficultyConfig : uses
    LetterPopScene --> DifficultyConfig : uses
    LetterPopScene --> LetterPoolManager : uses
    MainMenu --> DifficultyConfig : uses
    MainMenu --> ProgressManager : queries
    MainMenu --> LetterPopScene : starts with difficulty
    LetterPopScene --> ResultsScene : passes difficulty
    ResultsScene --> LetterPopScene : replay with difficulty

    note for DifficultyConfig "Central configuration\nfor all difficulty settings"
    note for LetterPoolManager "Manages letter selection\nand distractor generation"
```

## Difficulty Recommendation Flow

```mermaid
flowchart TD
    Start([Game Starts]) --> LoadProgress[Load ProgressManager]
    LoadProgress --> CalcMetrics[Calculate Performance Metrics]

    CalcMetrics --> GetAccuracy[Get Recent Accuracy<br/>Last 5 rounds]
    CalcMetrics --> GetMastery[Get Mastered Letter Count]
    CalcMetrics --> GetStreak[Get Longest Streak]

    GetAccuracy --> CheckHard{Accuracy >= 85%<br/>AND<br/>Mastered >= 15<br/>AND<br/>Streak >= 5?}

    CheckHard -->|Yes| RecommendHard[Recommend: HARD]
    CheckHard -->|No| CheckEasy{Accuracy < 60%<br/>OR<br/>Mastered < 8?}

    CheckEasy -->|Yes| RecommendEasy[Recommend: EASY]
    CheckEasy -->|No| RecommendMedium[Recommend: MEDIUM]

    RecommendHard --> Display[Display in Main Menu]
    RecommendMedium --> Display
    RecommendEasy --> Display

    Display --> PlayerChoice{Player makes choice}

    PlayerChoice -->|Accepts recommendation| UseRecommended[Use Recommended]
    PlayerChoice -->|Selects different| UseSelected[Use Selected]

    UseRecommended --> StartGame[Start Game with Difficulty]
    UseSelected --> StartGame

    StartGame --> End([LetterPopScene Starts])

    style RecommendHard fill:#e74c3c
    style RecommendMedium fill:#f39c12
    style RecommendEasy fill:#27ae60
```

## Letter Pool Selection Flow

```mermaid
flowchart TD
    Start([Select Target Letter]) --> GetDiff[Get Difficulty Config]

    GetDiff --> CheckPool{Letter Pool Type?}

    CheckPool -->|"common"| CommonPool[Use Common Letters<br/>A-M only<br/>13 letters]
    CheckPool -->|"all"| AllPool[Use All Letters<br/>A-Z<br/>26 letters]
    CheckPool -->|"similar"| SimilarPool[Use All Letters<br/>with Similar Pairs]

    CommonPool --> PickRandom[Pick Random from Pool]
    AllPool --> PickRandom
    SimilarPool --> PickRandom

    PickRandom --> Target[Target Letter Selected]

    Target --> GenDistractors[Generate Distractors]

    GenDistractors --> CheckSimilar{Similar Letters<br/>Enabled?}

    CheckSimilar -->|Yes HARD| UseSimilar[Use Similar Letter Pairs<br/>b/d/p/q, m/n/w, etc.]
    CheckSimilar -->|No EASY/MEDIUM| UseRandom[Use Random Distinct Letters]

    UseSimilar --> FillDistractors[Fill Distractor Array]
    UseRandom --> FillDistractors

    FillDistractors --> ApplyCase[Apply Letter Case]

    ApplyCase --> CheckCase{Case Type?}

    CheckCase -->|"uppercase"| Upper[Display: A]
    CheckCase -->|"lowercase"| Lower[Display: a]
    CheckCase -->|"mixed"| Mixed[Display: Aa]

    Upper --> CreateBubbles[Create Bubbles]
    Lower --> CreateBubbles
    Mixed --> CreateBubbles

    CreateBubbles --> End([Bubbles Displayed])

    style UseSimilar fill:#e74c3c
    style UseRandom fill:#27ae60
    style Mixed fill:#f39c12
```

## Distractor Generation Algorithm

```mermaid
flowchart TD
    Start([generateDistractors]) --> Input[Input: target, difficulty, count]

    Input --> GetConfig[Get Difficulty Config]
    GetConfig --> CheckMode{Similar Letters<br/>Enabled?}

    CheckMode -->|Yes HARD| GetSimilar[Get Similar Letter Pairs<br/>for Target]
    CheckMode -->|No EASY/MEDIUM| InitEmpty[Initialize Empty Array]

    GetSimilar --> HasSimilar{Target has<br/>similar pairs?}

    HasSimilar -->|Yes| AddSimilar[Add Similar Letters<br/>to Distractors]
    HasSimilar -->|No| InitEmpty

    AddSimilar --> CheckCount1{Enough<br/>distractors?}
    InitEmpty --> CheckCount1

    CheckCount1 -->|No| AddRandom[Add Random Letter from Pool]
    CheckCount1 -->|Yes| Final[Return Distractor Array]

    AddRandom --> ValidCheck{Valid?<br/>Not target<br/>Not duplicate}

    ValidCheck -->|Yes| AddToArray[Add to Array]
    ValidCheck -->|No| AddRandom

    AddToArray --> CheckCount2{Array full?}

    CheckCount2 -->|No| AddRandom
    CheckCount2 -->|Yes| Final

    Final --> End([Return Distractors])

    Note1[Example HARD mode:<br/>Target: 'b'<br/>Similar: d, p, q<br/>Distractors: d, p, q, m<br/>4 total for 5 bubbles]

    Note2[Example EASY mode:<br/>Target: 'A'<br/>Random: B, C, D<br/>Distractors: B, C<br/>2 total for 3 bubbles]

    End -.-> Note1
    End -.-> Note2

    style AddSimilar fill:#e74c3c
    style AddRandom fill:#3498db
```

## Bubble Positioning Algorithm

```mermaid
flowchart TD
    Start([calculateBubblePositions]) --> Input[Input: bubble count]

    Input --> CheckCount{Bubble Count?}

    CheckCount -->|3| Triangle[Triangle Formation]
    CheckCount -->|4| Square[Square Formation]
    CheckCount -->|5| Pentagon[Pentagon Formation]

    Triangle --> Pos3_1[Position 1: Center Top]
    Pos3_1 --> Pos3_2[Position 2: Bottom Left]
    Pos3_2 --> Pos3_3[Position 3: Bottom Right]
    Pos3_3 --> Return3[Return 3 Positions]

    Square --> Pos4_1[Position 1: Top Left]
    Pos4_1 --> Pos4_2[Position 2: Top Right]
    Pos4_2 --> Pos4_3[Position 3: Bottom Left]
    Pos4_3 --> Pos4_4[Position 4: Bottom Right]
    Pos4_4 --> Return4[Return 4 Positions]

    Pentagon --> Pos5_1[Position 1: Top Center]
    Pos5_1 --> Pos5_2[Position 2: Left]
    Pos5_2 --> Pos5_3[Position 3: Right]
    Pos5_3 --> Pos5_4[Position 4: Bottom Left]
    Pos5_4 --> Pos5_5[Position 5: Bottom Right]
    Pos5_5 --> Return5[Return 5 Positions]

    Return3 --> Shuffle[Shuffle Letter Array]
    Return4 --> Shuffle
    Return5 --> Shuffle

    Shuffle --> Assign[Assign Letters to Positions]
    Assign --> End([Create Bubbles])

    style Triangle fill:#27ae60
    style Square fill:#f39c12
    style Pentagon fill:#e74c3c
```

## Difficulty Selection Sequence

```mermaid
sequenceDiagram
    actor Player
    participant MM as MainMenu
    participant PM as ProgressManager
    participant DC as DifficultyConfig
    participant LPS as LetterPopScene

    Player->>MM: Open Main Menu
    MM->>PM: getRecommendedDifficulty()

    PM->>PM: Calculate recent accuracy
    PM->>PM: Count mastered letters
    PM->>PM: Get longest streak
    PM->>PM: Apply recommendation algorithm
    PM-->>MM: Return recommended difficulty

    MM->>DC: Get difficulty configs
    DC-->>MM: Return all configs (easy, medium, hard)

    MM->>MM: Create difficulty selection UI
    MM->>MM: Highlight recommended difficulty

    MM-->>Player: Display difficulty options

    Player->>MM: Click difficulty button (e.g., "Hard")
    MM->>MM: Update selection highlight
    MM->>MM: Store selectedDifficulty = "hard"

    Player->>MM: Click "Play Game" button
    MM->>DC: getDifficultyConfig("hard")
    DC-->>MM: Return hard config object

    MM->>LPS: scene.start('LetterPopScene', {difficulty: "hard"})

    LPS->>LPS: init(data)
    LPS->>DC: getDifficultyConfig(data.difficulty)
    DC-->>LPS: Return hard config
    LPS->>LPS: Store difficultyConfig

    LPS->>LPS: create()
    LPS->>LPS: displayCurrentLetter()

    Note over LPS: Uses hard mode settings:<br/>5 bubbles, mixed case,<br/>similar letters
```

## Game Flow with Difficulty

```mermaid
flowchart TD
    Start([Game Start]) --> MainMenu[Main Menu Scene]

    MainMenu --> SelectDiff[Player Selects Difficulty]

    SelectDiff --> Easy[Easy: 3 bubbles,<br/>uppercase, common]
    SelectDiff --> Medium[Medium: 4 bubbles,<br/>mixed case, all letters]
    SelectDiff --> Hard[Hard: 5 bubbles,<br/>mixed case, similar pairs]

    Easy --> PlayEasy[Play LetterPopScene<br/>with Easy Config]
    Medium --> PlayMedium[Play LetterPopScene<br/>with Medium Config]
    Hard --> PlayHard[Play LetterPopScene<br/>with Hard Config]

    PlayEasy --> Round[Complete 10-letter Round]
    PlayMedium --> Round
    PlayHard --> Round

    Round --> Results[ResultsScene<br/>with Difficulty Info]

    Results --> Choice{Player Choice}

    Choice -->|Main Menu| BackMenu[Return to Main Menu<br/>Can change difficulty]
    Choice -->|Play Again| SameDiff[Start New Round<br/>Same Difficulty]

    BackMenu --> MainMenu
    SameDiff --> PlayEasy
    SameDiff --> PlayMedium
    SameDiff --> PlayHard

    style Easy fill:#27ae60
    style Medium fill:#f39c12
    style Hard fill:#e74c3c
```

## Similar Letter Pairs Mapping

```mermaid
graph TB
    subgraph "Circular Shapes"
        b <--> d
        b <--> p
        b <--> q
        d <--> p
        d <--> q
        p <--> q
    end

    subgraph "Vertical Strokes"
        m <--> n
        m <--> w
        n <--> w
        i <--> j
        i <--> l
        j <--> l
    end

    subgraph "Similar Curves"
        u <--> v
        u <--> n
        v <--> w
        c <--> e
        c <--> o
        e <--> a
    end

    style b fill:#e74c3c
    style d fill:#e74c3c
    style p fill:#e74c3c
    style q fill:#e74c3c
    style m fill:#f39c12
    style n fill:#f39c12
    style w fill:#f39c12
    style u fill:#3498db
    style v fill:#3498db
```

## Difficulty Configuration State

```mermaid
stateDiagram-v2
    [*] --> LoadingConfig: Game Starts

    LoadingConfig --> ConfigLoaded: DifficultyConfig imported

    ConfigLoaded --> SelectingDifficulty: Player at Main Menu

    SelectingDifficulty --> EasySelected: Player selects Easy
    SelectingDifficulty --> MediumSelected: Player selects Medium
    SelectingDifficulty --> HardSelected: Player selects Hard

    EasySelected --> PlayingEasy: Start LetterPopScene
    MediumSelected --> PlayingMedium: Start LetterPopScene
    HardSelected --> PlayingHard: Start LetterPopScene

    PlayingEasy --> RoundComplete: 10 letters completed
    PlayingMedium --> RoundComplete
    PlayingHard --> RoundComplete

    RoundComplete --> ViewingResults: ResultsScene

    ViewingResults --> SelectingDifficulty: Main Menu button
    ViewingResults --> PlayingEasy: Play Again (Easy)
    ViewingResults --> PlayingMedium: Play Again (Medium)
    ViewingResults --> PlayingHard: Play Again (Hard)

    note right of EasySelected
        3 bubbles
        Uppercase only
        Common letters A-M
    end note

    note right of MediumSelected
        4 bubbles
        Mixed case (Aa)
        All 26 letters
    end note

    note right of HardSelected
        5 bubbles
        Mixed case (Aa)
        Similar letter pairs
    end note
```

## Letter Case Display Diagram

```mermaid
flowchart LR
    subgraph Easy Mode
        E_Target[Target: A]
        E_Display[Display: A]
        E_Audio[Audio: Find the letter A]
        E_Target --> E_Display --> E_Audio
    end

    subgraph Medium Mode
        M_Target[Target: A]
        M_Display[Display: Aa]
        M_Audio[Audio: Find the letter A<br/>uppercase A and lowercase a]
        M_Target --> M_Display --> M_Audio
    end

    subgraph Hard Mode
        H_Target[Target: b]
        H_Display[Display: Bb]
        H_Distractors[Distractors: Dd, Pp, Qq, Mm]
        H_Audio[Audio: Find the letter B<br/>uppercase B and lowercase b]
        H_Target --> H_Display --> H_Audio
        H_Target --> H_Distractors
    end

    style E_Display fill:#27ae60
    style M_Display fill:#f39c12
    style H_Display fill:#e74c3c
    style H_Distractors fill:#e74c3c
```

## Bubble Layout Visualizations

```mermaid
graph TD
    subgraph "Easy: 3 Bubbles (Triangle)"
        E_Center[Bubble 1<br/>Top Center]
        E_Left[Bubble 2<br/>Bottom Left]
        E_Right[Bubble 3<br/>Bottom Right]

        E_Center -.spacing: 150px.-> E_Left
        E_Center -.spacing: 150px.-> E_Right
    end

    subgraph "Medium: 4 Bubbles (Square)"
        M_TL[Bubble 1<br/>Top Left]
        M_TR[Bubble 2<br/>Top Right]
        M_BL[Bubble 3<br/>Bottom Left]
        M_BR[Bubble 4<br/>Bottom Right]

        M_TL -.spacing: 130px.-> M_TR
        M_TL -.spacing: 130px.-> M_BL
        M_TR -.spacing: 130px.-> M_BR
        M_BL -.spacing: 130px.-> M_BR
    end

    subgraph "Hard: 5 Bubbles (Pentagon)"
        H_Top[Bubble 1<br/>Top Center]
        H_Left[Bubble 2<br/>Middle Left]
        H_Right[Bubble 3<br/>Middle Right]
        H_BL[Bubble 4<br/>Bottom Left]
        H_BR[Bubble 5<br/>Bottom Right]

        H_Top -.spacing: 110px.-> H_Left
        H_Top -.spacing: 110px.-> H_Right
        H_Left -.spacing: 110px.-> H_BL
        H_Right -.spacing: 110px.-> H_BR
    end

    style E_Center fill:#27ae60
    style E_Left fill:#27ae60
    style E_Right fill:#27ae60

    style M_TL fill:#f39c12
    style M_TR fill:#f39c12
    style M_BL fill:#f39c12
    style M_BR fill:#f39c12

    style H_Top fill:#e74c3c
    style H_Left fill:#e74c3c
    style H_Right fill:#e74c3c
    style H_BL fill:#e74c3c
    style H_BR fill:#e74c3c
```

## Performance Metrics Flow

```mermaid
flowchart TD
    Start([Track Performance]) --> PlayRound[Player completes round]

    PlayRound --> Record[Record to ProgressManager]

    Record --> Correct[Correct answers: X/10]
    Record --> Mastered[Letters mastered: +N]
    Record --> Streak[Current streak: Y]
    Record --> Time[Time taken: Z seconds]

    Correct --> CalcAccuracy[Calculate accuracy %]
    Mastered --> CountTotal[Count total mastered]
    Streak --> CheckStreak[Track longest streak]

    CalcAccuracy --> Store[Store in round history]
    CountTotal --> Store
    CheckStreak --> Store

    Store --> NextRound{Another<br/>round?}

    NextRound -->|Yes| PlayRound

    NextRound -->|No| Analyze[Analyze performance data]

    Analyze --> GetRecent[Get recent 5 rounds accuracy]
    Analyze --> GetMastered[Get mastered letter count]
    Analyze --> GetStreak[Get longest streak]

    GetRecent --> Recommend[Calculate recommended difficulty]
    GetMastered --> Recommend
    GetStreak --> Recommend

    Recommend --> Display[Display recommendation in menu]

    Display --> End([Player chooses difficulty])

    style Record fill:#3498db
    style Recommend fill:#9b59b6
    style Display fill:#2ecc71
```

## Data Flow Diagram

```mermaid
flowchart LR
    subgraph Configuration
        DC[DifficultyConfig]
        Easy[Easy Config]
        Medium[Medium Config]
        Hard[Hard Config]
    end

    subgraph Management
        LPM[LetterPoolManager]
        PM[ProgressManager]
    end

    subgraph Scenes
        MM[MainMenu]
        LPS[LetterPopScene]
        RS[ResultsScene]
    end

    DC --> Easy
    DC --> Medium
    DC --> Hard

    Easy --> LPM
    Medium --> LPM
    Hard --> LPM

    PM --> MM
    MM --> LPS
    LPS --> LPM
    LPM --> LPS
    LPS --> RS
    RS --> MM
    RS --> LPS

    DC --> MM
    DC --> LPS

    style DC fill:#9b59b6
    style LPM fill:#3498db
    style PM fill:#2ecc71
    style MM fill:#f39c12
    style LPS fill:#e74c3c
    style RS fill:#95a5a6
```

## Notes

### Design Decisions

**Three Difficulty Levels**
- Easy: Builds confidence with simple challenges
- Medium: Standard gameplay for most players
- Hard: Advanced challenge for mastery

**Progressive Challenge**
- Bubble count increases (3 → 4 → 5)
- Letter pool expands (common → all → similar)
- Case complexity increases (uppercase → mixed → mixed)
- Visual difficulty increases (distinct → varied → similar)

**Recommendation Algorithm**
- Multiple factors: accuracy, mastery, streaks
- Conservative thresholds (won't recommend too hard too soon)
- Player choice always respected (can override)
- Updates based on ongoing performance

**Similar Letter Pairs (Hard Mode)**
- b/d/p/q: Classic confusion for young readers
- m/n/w: Similar stroke patterns
- u/v: Similar curve shapes
- Developmentally appropriate challenge
- Helps develop visual discrimination skills

**Mixed Case Display**
- Shows both uppercase and lowercase together
- Essential for reading readiness
- Format: "Aa" (side-by-side)
- Audio clarifies both forms
- Teaches letter recognition in both cases

**Bubble Positioning**
- Spacing adjusts with count (more bubbles = tighter)
- Geometric patterns (triangle, square, pentagon)
- All bubbles visible and accessible
- No overlap or off-screen placement
- Maintains visual clarity

### ADHD-Friendly Considerations

**Appropriate Challenge**
- Not too easy (prevents boredom)
- Not too hard (prevents frustration)
- Player can adjust to their comfort level
- Success always achievable

**Clear Progression**
- Visual difference between difficulties (color, icons)
- Can see growth as they advance
- Moving up feels like an achievement
- Moving down is presented positively

**Player Agency**
- Recommendation is optional
- Can choose any difficulty
- Can change at any time
- No judgment for choosing easier

**Immediate Feedback**
- Difficulty change takes effect right away
- No waiting or unlocking required
- Can experiment freely

### What This Phase Enables

1. **Personalized Challenge**: Each player finds their optimal difficulty
2. **Natural Progression**: Can advance as skills improve
3. **Sustained Engagement**: Appropriate challenge prevents boredom
4. **Skill Development**: Hard mode builds advanced visual discrimination
5. **Reading Readiness**: Mixed case prepares for actual reading
6. **Confidence Building**: Success at appropriate level builds self-efficacy

This difficulty system ensures every child can enjoy the game at their own pace while being gently challenged to grow.
