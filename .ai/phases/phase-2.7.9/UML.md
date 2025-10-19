# Phase 2.7.9: Results Screen - UML DIAGRAMS

**Phase:** 2.7.9
**Feature:** Results Screen Architecture
**Status:** Planning
**Diagrams:** 12 Mermaid diagrams

---

## Table of Contents

1. [Class Diagram](#1-class-diagram)
2. [Component Hierarchy](#2-component-hierarchy)
3. [GameResult Data Model](#3-gameresult-data-model)
4. [Star Rating Component](#4-star-rating-component)
5. [Results Screen Composition](#5-results-screen-composition)
6. [Sequence Diagram: Game Completion](#6-sequence-diagram-game-completion)
7. [Sequence Diagram: Play Again](#7-sequence-diagram-play-again)
8. [State Diagram: Screen Lifecycle](#8-state-diagram-screen-lifecycle)
9. [Data Flow Diagram](#9-data-flow-diagram)
10. [Star Calculation Logic](#10-star-calculation-logic)
11. [Layout Positioning](#11-layout-positioning)
12. [Navigation Flow](#12-navigation-flow)

---

## 1. Class Diagram

```mermaid
classDiagram
    class GameResult {
        +Int score
        +Int totalQuestions
        +Float timeLimit
        +Float totalTimeElapsed
        +String letterCase
        +getAccuracy() Float
        +getStarRating() Int
        +getCelebrationMessage() String
        +getAverageTimePerQuestion() Float
    }

    class ResultsScreen {
        -Game game
        -GameResult gameResult
        -SpriteBatch batch
        -ShapeRenderer shapeRenderer
        -GradientBackground background
        -TitleText titleText
        -FloatingStars floatingStars
        -BalloonIcon balloonIcon
        -StarRating starRating
        -Button playAgainButton
        -Button mainMenuButton
        -BitmapFont scoreFont
        -BitmapFont labelFont
        -BitmapFont statFont
        -Float fadeAlpha
        -Boolean transitioning
        +show()
        +render(delta)
        +dispose()
        -updateFade(delta)
        -applyFadeOverlay()
        -handleInput()
        -playAgain()
        -navigateToMainMenu()
        -startFadeOut(screen)
    }

    class StarRating {
        -Float x
        -Float y
        -Float starSize
        -Float spacing
        -Int maxStars
        -Int rating
        -Float animationTime
        +setRating(stars)
        +update(delta)
        +render(batch, shapeRenderer)
        +dispose()
        -drawStar(shapeRenderer, x, y, size)
    }

    class LetterPopScreen {
        -Int score
        -Float timeLimit
        -String letterCase
        -Float totalTimeElapsed
        +update(delta)
        +advanceToNextLetter()
        -showResults()
    }

    class MainMenuScreen {
        +show()
        +render(delta)
    }

    class LetterPopMenuScreen {
        +show()
        +render(delta)
    }

    %% Relationships
    ResultsScreen --> GameResult : receives
    ResultsScreen --> StarRating : contains
    ResultsScreen --> GradientBackground : contains
    ResultsScreen --> TitleText : contains
    ResultsScreen --> FloatingStars : contains
    ResultsScreen --> BalloonIcon : contains
    ResultsScreen --> Button : contains
    ResultsScreen --> FontManager : uses
    ResultsScreen --> AudioManager : uses
    ResultsScreen --> ResponsiveUtils : uses
    ResultsScreen --> MainMenuScreen : navigates to
    ResultsScreen --> LetterPopMenuScreen : navigates to
    LetterPopScreen --> ResultsScreen : navigates to
    LetterPopScreen --> GameResult : creates
    StarRating --> ShapeRenderer : uses
    GameResult --> StarRating : provides rating data
```

---

## 2. Component Hierarchy

```mermaid
graph TD
    A[ResultsScreen] --> B[GradientBackground]
    A --> C[FloatingStars]
    A --> D[BalloonIcon]
    A --> E[TitleText]
    A --> F[StarRating]
    A --> G[Score Display]
    A --> H[Statistics Display]
    A --> I[Play Again Button]
    A --> J[Main Menu Button]

    B --> B1[Purple-Pink Gradient]
    C --> C1[20 Animated Stars]
    D --> D1[Bouncing Balloon]
    E --> E1[Celebration Message]
    F --> F1[1-3 Gold Stars]
    G --> G1[X/10 Score Text]
    H --> H1[Accuracy %]
    H --> H2[Time Taken]
    I --> I1[Navigate to Letter Pop Menu]
    J --> J1[Navigate to Main Menu]

    style A fill:#9b59b6,color:#fff
    style F fill:#f1c40f,color:#000
    style G fill:#e74c3c,color:#fff
    style H fill:#3498db,color:#fff
```

---

## 3. GameResult Data Model

```mermaid
classDiagram
    class GameResult {
        <<Data Class>>
        +score: Int
        +totalQuestions: Int
        +timeLimit: Float
        +totalTimeElapsed: Float
        +letterCase: String
        +getAccuracy() Float
        +getStarRating() Int
        +getCelebrationMessage() String
        +getAverageTimePerQuestion() Float
    }

    class Calculations {
        <<Helpers>>
    }

    GameResult --> Calculations : uses

    note for GameResult "Immutable data class\nPassed from LetterPopScreen\nto ResultsScreen"

    note for Calculations "Accuracy = (score / total) * 100\nStars = 3 if ≥80%, 2 if ≥50%, else 1\nMessage = based on star rating\nAvg Time = total / questions"
```

---

## 4. Star Rating Component

```mermaid
classDiagram
    class StarRating {
        -ResponsiveUtils responsive
        -Float x
        -Float y
        -Float starSize
        -Float spacing
        -Int maxStars
        -Int rating
        -Float animationTime
        -Float STAR_ANIMATION_DELAY
        -Float STAR_ANIMATION_DURATION
        -Color GOLD_COLOR
        -Color GRAY_COLOR
        +setRating(stars: Int)
        +update(delta: Float)
        +render(batch: SpriteBatch, shapeRenderer: ShapeRenderer)
        +dispose()
        -drawStar(shapeRenderer, centerX, centerY, size)
    }

    class StarGeometry {
        <<Helper>>
        +outerRadius: Float
        +innerRadius: Float
        +points: Int = 5
        +vertices: FloatArray
    }

    StarRating --> StarGeometry : uses for rendering

    note for StarRating "Animation:\n- 200ms delay between stars\n- 300ms bounce per star\n- Filled stars = gold\n- Empty stars = gray"

    note for StarGeometry "5-pointed star\nOuter radius = size / 2\nInner radius = outer * 0.4\nDrawn as triangle fan"
```

---

## 5. Results Screen Composition

```mermaid
graph LR
    A[ResultsScreen] --> B[Visual Components]
    A --> C[Interactive Components]
    A --> D[Data Display]
    A --> E[Transition System]

    B --> B1[GradientBackground]
    B --> B2[FloatingStars]
    B --> B3[BalloonIcon]
    B --> B4[TitleText]

    C --> C1[Play Again Button]
    C --> C2[Main Menu Button]

    D --> D1[StarRating]
    D --> D2[Score: X/10]
    D --> D3[Accuracy: X%]
    D --> D4[Time: Xs]

    E --> E1[Fade In: 500ms]
    E --> E2[Fade Out: 500ms]
    E --> E3[Black Overlay]

    style A fill:#9b59b6,color:#fff
    style B fill:#3498db,color:#fff
    style C fill:#2ecc71,color:#fff
    style D fill:#f1c40f,color:#000
    style E fill:#e74c3c,color:#fff
```

---

## 6. Sequence Diagram: Game Completion

```mermaid
sequenceDiagram
    participant LP as LetterPopScreen
    participant GR as GameResult
    participant RS as ResultsScreen
    participant SR as StarRating
    participant AM as AudioManager
    participant Game as Game

    LP->>LP: User answers 10th question
    LP->>LP: totalTimeElapsed tracked
    LP->>GR: Create GameResult(score, time, settings)
    GR->>GR: Calculate accuracy
    GR->>GR: Calculate star rating
    LP->>RS: Navigate to ResultsScreen(game, gameResult)
    RS->>RS: show() called
    RS->>GR: getStarRating()
    GR-->>RS: Return 1-3 stars
    RS->>SR: setRating(stars)
    SR->>SR: Start animation
    RS->>GR: getCelebrationMessage()
    GR-->>RS: Return "EXCELLENT!" / "GOOD JOB!" / "KEEP TRYING!"
    RS->>RS: Fade in (500ms)

    loop Every frame
        RS->>RS: render(delta)
        RS->>SR: update(delta)
        SR->>SR: Animate stars
        RS->>RS: Check fadeAlpha > 0.5
        RS->>AM: playCorrect() (once)
    end

    RS->>Game: Screen displayed
```

---

## 7. Sequence Diagram: Play Again

```mermaid
sequenceDiagram
    participant User
    participant RS as ResultsScreen
    participant AM as AudioManager
    participant LP as LetterPopMenuScreen
    participant Game as Game

    User->>RS: Tap "Play Again" button
    RS->>RS: Check if transitioning
    RS->>AM: playCorrect()
    RS->>RS: startFadeOut(LetterPopMenuScreen)
    RS->>RS: Set transitioning = true

    loop Fade Out (500ms)
        RS->>RS: updateFade(delta)
        RS->>RS: fadeAlpha decreases
        RS->>RS: applyFadeOverlay()
    end

    RS->>LP: Create LetterPopMenuScreen(game)
    RS->>Game: Set screen = LetterPopMenuScreen
    LP->>LP: show() called
    LP->>LP: Load previous settings from Preferences
    LP->>User: Display Letter Pop Menu
```

---

## 8. State Diagram: Screen Lifecycle

```mermaid
stateDiagram-v2
    [*] --> Created: ResultsScreen(game, gameResult)
    Created --> Showing: show() called
    Showing --> FadingIn: fadeIn = true
    FadingIn --> Active: fadeAlpha = 1.0
    Active --> WaitingForInput: Ready for interaction

    WaitingForInput --> PlayAgainPressed: User taps Play Again
    WaitingForInput --> MainMenuPressed: User taps Main Menu

    PlayAgainPressed --> FadingOut: startFadeOut(LetterPopMenu)
    MainMenuPressed --> FadingOut: startFadeOut(MainMenu)

    FadingOut --> Transitioning: fadeAlpha = 0.0
    Transitioning --> Hiding: Navigate to next screen
    Hiding --> Disposed: dispose() called
    Disposed --> [*]

    note right of FadingIn
        500ms fade in
        Stars animate in
        Celebration sound plays
    end note

    note right of WaitingForInput
        60 FPS rendering
        Stars continue animating
        Buttons respond to hover
    end note

    note right of FadingOut
        500ms fade out
        transitioning = true
        Input blocked
    end note
```

---

## 9. Data Flow Diagram

```mermaid
graph TD
    A[LetterPopScreen: Game Ends] --> B[Collect Game Data]
    B --> C{Create GameResult}
    C --> D[score: Int]
    C --> E[totalQuestions: Int]
    C --> F[timeLimit: Float]
    C --> G[totalTimeElapsed: Float]
    C --> H[letterCase: String]

    D --> I[GameResult Instance]
    E --> I
    F --> I
    G --> I
    H --> I

    I --> J[getAccuracy]
    J --> K[Accuracy %]

    I --> L[getStarRating]
    L --> M[Star Count: 1-3]

    I --> N[getCelebrationMessage]
    N --> O[Celebration Text]

    K --> P[ResultsScreen Display]
    M --> P
    O --> P
    I --> P

    P --> Q[User Interaction]
    Q --> R{Button Pressed?}
    R -->|Play Again| S[Navigate to LetterPopMenuScreen]
    R -->|Main Menu| T[Navigate to MainMenuScreen]

    style C fill:#9b59b6,color:#fff
    style I fill:#3498db,color:#fff
    style P fill:#2ecc71,color:#fff
```

---

## 10. Star Calculation Logic

```mermaid
flowchart TD
    A[Start: GameResult created] --> B[Calculate Accuracy]
    B --> C[accuracy = score / totalQuestions * 100]
    C --> D{accuracy >= 80%?}

    D -->|Yes| E[stars = 3]
    E --> F[message = EXCELLENT!]
    F --> G[color = Gold]

    D -->|No| H{accuracy >= 50%?}
    H -->|Yes| I[stars = 2]
    I --> J[message = GOOD JOB!]
    J --> K[color = Gold]

    H -->|No| L[stars = 1]
    L --> M[message = KEEP TRYING!]
    M --> N[color = Gold]

    G --> O[Return star rating]
    K --> O
    N --> O

    O --> P[StarRating.setRating stars]
    P --> Q[Animate stars appearing]
    Q --> R{Star index delay}
    R --> S[Star 1: 0ms]
    R --> T[Star 2: 200ms]
    R --> U[Star 3: 400ms]

    S --> V[Bounce animation 300ms]
    T --> V
    U --> V

    V --> W[Display final stars]

    style E fill:#2ecc71,color:#fff
    style I fill:#f39c12,color:#fff
    style L fill:#e67e22,color:#fff
    style W fill:#f1c40f,color:#000
```

---

## 11. Layout Positioning

```mermaid
graph TB
    subgraph "2560x1600 Screen (Landscape)"
        A[0%, 100%] -.-> B[100%, 100%]
        A -.-> C[0%, 0%]
        C -.-> D[100%, 0%]
        B -.-> D

        E["TitleText (Celebration)<br/>50%, 85%<br/>Font: 5% width"] --> E
        F["BalloonIcon<br/>50%, 75%<br/>Size: 6% width"] --> F
        G["StarRating<br/>50%, 65%<br/>Stars: 5% width each<br/>Spacing: 2% width"] --> G
        H["Score Display<br/>50%, 52%<br/>Font: 8% width"] --> H
        I["Accuracy Label<br/>30%, 42%<br/>Font: 2.5% width"] --> I
        J["Accuracy Value<br/>30%, 37%<br/>Font: 3% width"] --> J
        K["Time Label<br/>70%, 42%<br/>Font: 2.5% width"] --> K
        L["Time Value<br/>70%, 37%<br/>Font: 3% width"] --> L
        M["Play Again Button<br/>35%, 15%<br/>20% width, 10% height"] --> M
        N["Main Menu Button<br/>65%, 15%<br/>20% width, 10% height"] --> N
    end

    style E fill:#9b59b6,color:#fff
    style F fill:#e74c3c,color:#fff
    style G fill:#f1c40f,color:#000
    style H fill:#e74c3c,color:#fff
    style I fill:#3498db,color:#fff
    style J fill:#3498db,color:#fff
    style K fill:#3498db,color:#fff
    style L fill:#3498db,color:#fff
    style M fill:#2ecc71,color:#fff
    style N fill:#2ecc71,color:#fff
```

---

## 12. Navigation Flow

```mermaid
stateDiagram-v2
    [*] --> MainMenu
    MainMenu --> LetterPopMenu: Tap Letter Pop tile
    LetterPopMenu --> LetterPopGame: Tap Start Game
    LetterPopGame --> Results: Game complete (10 letters)
    Results --> LetterPopMenu: Tap Play Again
    Results --> MainMenu: Tap Main Menu
    LetterPopMenu --> MainMenu: Tap Home button

    note right of Results
        NEW SCREEN (Phase 2.7.9)
        Displays:
        - Score (X/10)
        - Stars (1-3)
        - Accuracy %
        - Time taken
        Navigation:
        - Play Again → Letter Pop Menu
        - Main Menu → Main Menu
    end note

    note right of LetterPopGame
        Phase 2.7.8
        Tracks:
        - score
        - totalTimeElapsed
        - timeLimit
        - letterCase
        Creates GameResult
        on completion
    end note
```

---

## Component Dependencies

### ResultsScreen Dependencies
```mermaid
graph LR
    RS[ResultsScreen] --> GR[GameResult]
    RS --> SR[StarRating]
    RS --> GB[GradientBackground]
    RS --> TT[TitleText]
    RS --> FS[FloatingStars]
    RS --> BI[BalloonIcon]
    RS --> BTN[Button x2]
    RS --> FM[FontManager]
    RS --> AM[AudioManager]
    RS --> RU[ResponsiveUtils]
    RS --> TC[ThemeConfig]

    style RS fill:#9b59b6,color:#fff
    style GR fill:#3498db,color:#fff
    style SR fill:#f1c40f,color:#000
```

### StarRating Dependencies
```mermaid
graph LR
    SR[StarRating] --> SHR[ShapeRenderer]
    SR --> RU[ResponsiveUtils]
    SR --> MATH[Math: sin, cos, PI]
    SR --> COLOR[Color]

    style SR fill:#f1c40f,color:#000
    style SHR fill:#e74c3c,color:#fff
```

---

## Animation Timeline

```mermaid
gantt
    title Results Screen Animation Timeline
    dateFormat X
    axisFormat %Ls

    section Fade In
    Fade In (500ms)           :0, 500

    section Star Animations
    Star 1 appears (300ms)    :0, 300
    Star 2 appears (300ms)    :200, 500
    Star 3 appears (300ms)    :400, 700

    section Audio
    Celebration sound plays   :250, 300

    section User Input
    Buttons active            :500, 3000
    User taps button          :2000, 2050

    section Fade Out
    Fade Out (500ms)          :2050, 2550

    section Navigation
    Next screen loads         :2550, 2600
```

---

## Memory Management

```mermaid
graph TD
    A[ResultsScreen Created] --> B[Allocate Resources]
    B --> C[SpriteBatch]
    B --> D[ShapeRenderer]
    B --> E[GradientBackground]
    B --> F[TitleText]
    B --> G[FloatingStars]
    B --> H[BalloonIcon]
    B --> I[StarRating]
    B --> J[Buttons x2]
    B --> K[Fonts from FontManager]

    L[ResultsScreen.dispose] --> M[Dispose SpriteBatch]
    L --> N[Dispose ShapeRenderer]
    L --> O[Dispose GradientBackground]
    L --> P[Dispose TitleText]
    L --> Q[Dispose FloatingStars]
    L --> R[Dispose BalloonIcon]
    L --> S[Dispose StarRating]
    L --> T[Dispose Buttons]
    L --> U[Fonts managed by FontManager]

    style A fill:#2ecc71,color:#fff
    style L fill:#e74c3c,color:#fff
    style U fill:#f39c12,color:#fff
```

**Note:** Fonts are obtained from FontManager and should NOT be disposed individually. FontManager handles font lifecycle.

---

## Performance Considerations

### Target Performance Metrics
- **FPS:** Locked 60 FPS
- **Fade Duration:** 500ms (30 frames)
- **Star Animation:** 300ms per star (18 frames)
- **Memory:** < 5MB for screen
- **Touch Latency:** < 50ms response

### Optimization Strategies
1. **Object Pooling:** Not needed (static screen, no dynamic spawning)
2. **Batch Rendering:** All sprites drawn in single batch
3. **ShapeRenderer:** Used only for stars (minimal draw calls)
4. **Font Caching:** FontManager caches all fonts
5. **No Physics:** Static layout (no Box2D overhead)

---

**UML Created:** October 19, 2025
**Phase:** 2.7.9
**Diagrams:** 12 comprehensive architecture diagrams
**Next Step:** Create GHERKIN.md with BDD test scenarios
