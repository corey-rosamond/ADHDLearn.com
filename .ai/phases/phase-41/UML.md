# Phase 41: Game Session Orchestrator - UML

## Class Diagram

```mermaid
classDiagram
    class GameSessionScene {
        -Object sessionConfig
        -Number currentGameIndex
        -Number gamesCompleted
        -Array sessionGames
        -Object sessionResults
        -Number sessionStartTime
        -Array availableGames
        +constructor()
        +init(data)
        +create()
        +generateGameSequence()
        +selectGamesWithVariety(games, count)
        +startNextGame()
        +showTransitionScreen(nextGame, callback)
        +handleGameComplete(result)
        +endSession()
        +calculateSessionAccuracy()
        +weightedRandom(items, weights)
    }

    class SessionConfig {
        +Number gamesPerSession
        +Boolean allowRepeats
        +Boolean difficultyProgression
        +Number transitionDuration
        +Boolean showProgress
        +String encouragementFrequency
        +Object parentControl
    }

    class SessionResults {
        +Array scores
        +Number totalScore
        +Array itemsPracticed
        +Number timeSpent
        +Number accuracy
        +Number gamesCompleted
        +String sessionDate
        +String childName
    }

    class GameResult {
        +String game
        +Number score
        +Number correct
        +Number attempts
        +Array itemsPracticed
        +Number duration
    }

    class MiniGameScene {
        <<abstract>>
        +String key
        +Object config
        +EventEmitter events
        +init(sessionData)
        +create()
        +completeGame(result)
        +emitGameComplete()
    }

    class LetterPopScene {
        +String key "LetterPopScene"
        +play()
        +completeGame()
    }

    class MemoryMatchScene {
        +String key "MemoryMatchScene"
        +play()
        +completeGame()
    }

    class TraceLetterScene {
        +String key "TraceLetterScene"
        +play()
        +completeGame()
    }

    class TransitionScreen {
        -Rectangle overlay
        -Text progressText
        -Text gameNameText
        -Text encouragementText
        +show(gameNumber, totalGames, nextGame)
        +hide()
    }

    class GameSelector {
        -Array availableGames
        -Object playHistory
        -Object gameDifficulty
        +selectWithVariety(count)
        +selectWeighted(count)
        +selectProgressive(count)
        +preventImmediateRepeat(games, last)
    }

    class PhaserScene {
        <<Phaser.Scene>>
        +add
        +scene
        +sound
        +time
        +registry
        +events
    }

    PhaserScene <|-- GameSessionScene
    PhaserScene <|-- MiniGameScene
    MiniGameScene <|-- LetterPopScene
    MiniGameScene <|-- MemoryMatchScene
    MiniGameScene <|-- TraceLetterScene

    GameSessionScene --> SessionConfig : uses
    GameSessionScene --> SessionResults : manages
    GameSessionScene --> TransitionScreen : creates
    GameSessionScene --> GameSelector : uses
    GameSessionScene ..> MiniGameScene : orchestrates
    SessionResults --> GameResult : contains
    GameResult --> MiniGameScene : produced by
```

## Sequence Diagram: Session Flow

```mermaid
sequenceDiagram
    actor User as Aurora
    participant Menu as Main Menu
    participant Session as GameSessionScene
    participant Selector as GameSelector
    participant Transition as TransitionScreen
    participant Game1 as LetterPopScene
    participant Game2 as MemoryMatchScene
    participant Game3 as TraceLetterScene
    participant Results as ResultsScene

    User->>Menu: Click "Start Session"
    Menu->>Session: Start GameSessionScene
    Session->>Session: init() - Initialize state

    Session->>Session: create()
    Session->>Selector: generateGameSequence()
    Selector->>Selector: selectGamesWithVariety(3)
    Selector-->>Session: [Game1, Game2, Game3]

    Session->>Transition: showTransitionScreen(Game1)
    Transition-->>User: "Game 1 of 3: Letter Pop!"
    Note over Transition: 3 second delay

    Session->>Game1: scene.start(LetterPopScene)
    Game1->>Game1: Play game
    User->>Game1: Complete game
    Game1->>Session: emit('gameComplete', result1)

    Session->>Session: handleGameComplete(result1)
    Session->>Session: Store score, update index

    Session->>Transition: showTransitionScreen(Game2)
    Transition-->>User: "Game 2 of 3: Memory Match!"

    Session->>Game2: scene.start(MemoryMatchScene)
    Game2->>Game2: Play game
    User->>Game2: Complete game
    Game2->>Session: emit('gameComplete', result2)

    Session->>Session: handleGameComplete(result2)

    Session->>Transition: showTransitionScreen(Game3)
    Transition-->>User: "Game 3 of 3: Trace Letters!"

    Session->>Game3: scene.start(TraceLetterScene)
    Game3->>Game3: Play game
    User->>Game3: Complete game
    Game3->>Session: emit('gameComplete', result3)

    Session->>Session: handleGameComplete(result3)
    Session->>Session: endSession()
    Session->>Session: calculateSessionAccuracy()

    Session->>Results: scene.start(ResultsScene, data)
    Results-->>User: Display session summary
```

## State Diagram: Session States

```mermaid
stateDiagram-v2
    [*] --> Initializing: Start Session

    Initializing --> GeneratingSequence: Init Complete
    GeneratingSequence --> ReadyToStart: Sequence Generated

    ReadyToStart --> ShowingTransition: Start Next Game
    ShowingTransition --> RunningGame: Transition Complete

    RunningGame --> GameInProgress: Game Started
    GameInProgress --> GameComplete: User Completes Game

    GameComplete --> ProcessingResults: Store Results
    ProcessingResults --> CheckProgress: Results Stored

    CheckProgress --> ShowingTransition: More Games Remaining
    CheckProgress --> CalculatingSession: All Games Complete

    CalculatingSession --> DisplayingResults: Calculations Done
    DisplayingResults --> [*]: Session End

    note right of GameInProgress
        Game 1, 2, or 3
        playing independently
    end note

    note right of ShowingTransition
        3-5 second transition
        with progress indicator
    end note
```

## Activity Diagram: Game Selection Algorithm

```mermaid
flowchart TD
    Start([Start Game Selection]) --> LoadAvailable[Load Available Games List]
    LoadAvailable --> CheckConfig{Check Config}

    CheckConfig -->|Fixed Sequence| UseFixed[Use Parent-Defined Sequence]
    CheckConfig -->|Auto Select| AutoSelect[Auto Selection Mode]

    UseFixed --> ValidateFixed{Valid Sequence?}
    ValidateFixed -->|Yes| ReturnSequence[Return Fixed Sequence]
    ValidateFixed -->|No| FallbackAuto[Fallback to Auto]

    FallbackAuto --> AutoSelect
    AutoSelect --> CheckMode{Selection Mode}

    CheckMode -->|Random| RandomSelect[Random Selection]
    CheckMode -->|Weighted| WeightedSelect[Weighted by Play History]
    CheckMode -->|Progressive| ProgressiveSelect[Difficulty Progression]

    RandomSelect --> InitLoop[Initialize Loop: i=0]
    WeightedSelect --> InitLoop
    ProgressiveSelect --> InitLoop

    InitLoop --> LoopCheck{i < gamesPerSession?}
    LoopCheck -->|No| Validate[Validate Sequence]
    LoopCheck -->|Yes| FilterLast[Filter Last Selected Game]

    FilterLast --> SelectGame[Select Random from Filtered]
    SelectGame --> AddToSequence[Add to Sequence]
    AddToSequence --> Increment[i++]
    Increment --> LoopCheck

    Validate --> CheckDuplicates{Immediate Repeats?}
    CheckDuplicates -->|Yes| Reshuffle[Reshuffle Problem Games]
    CheckDuplicates -->|No| CheckVariety{Good Variety?}

    Reshuffle --> CheckVariety
    CheckVariety -->|Yes| ReturnSequence
    CheckVariety -->|No| AddVariety[Substitute for Variety]
    AddVariety --> ReturnSequence

    ReturnSequence --> End([Sequence Ready])

    style Start fill:#90EE90
    style End fill:#90EE90
    style RandomSelect fill:#FFE4B5
    style WeightedSelect fill:#FFE4B5
    style ProgressiveSelect fill:#FFE4B5
```

## Component Diagram

```mermaid
graph TB
    Session[GameSessionScene]

    subgraph Core Components
        Config[Session Config]
        State[Session State Manager]
        Results[Results Aggregator]
    end

    subgraph Selection System
        Selector[Game Selector]
        Randomizer[Random Engine]
        History[Play History Tracker]
        Difficulty[Difficulty Manager]
    end

    subgraph Transition System
        Transition[Transition Screen]
        Progress[Progress Indicator]
        Encourage[Encouragement System]
    end

    subgraph Mini-Games
        Game1[LetterPopScene]
        Game2[MemoryMatchScene]
        Game3[TraceLetterScene]
        Game4[SightWordScene]
        Game5[PhonicsScene]
    end

    subgraph External Systems
        Audio[Audio Manager]
        Registry[Game Registry]
        SceneMgr[Scene Manager]
    end

    Session --> Config
    Session --> State
    Session --> Results

    Session --> Selector
    Selector --> Randomizer
    Selector --> History
    Selector --> Difficulty

    Session --> Transition
    Transition --> Progress
    Transition --> Encourage

    Session -.->|Launches| Game1
    Session -.->|Launches| Game2
    Session -.->|Launches| Game3
    Session -.->|Launches| Game4
    Session -.->|Launches| Game5

    Session --> Audio
    Session --> Registry
    Session --> SceneMgr

    Game1 -.->|Results| Results
    Game2 -.->|Results| Results
    Game3 -.->|Results| Results
    Game4 -.->|Results| Results
    Game5 -.->|Results| Results

    style Session fill:#FFB6C1
    style Selector fill:#87CEEB
    style Transition fill:#DDA0DD
```

## Data Flow Diagram

```mermaid
flowchart LR
    Start[Session Start] --> Init[Initialize State]
    Init --> LoadGames[Load Available Games]
    LoadGames --> SelectSeq[Select Game Sequence]

    SelectSeq --> Queue[Game Queue]
    Queue --> Trans1[Transition 1]

    Trans1 --> Game1[Play Game 1]
    Game1 --> Result1[Game 1 Result]
    Result1 --> Agg1[Aggregate Results]

    Agg1 --> Trans2[Transition 2]
    Trans2 --> Game2[Play Game 2]
    Game2 --> Result2[Game 2 Result]
    Result2 --> Agg2[Aggregate Results]

    Agg2 --> Trans3[Transition 3]
    Trans3 --> Game3[Play Game 3]
    Game3 --> Result3[Game 3 Result]
    Result3 --> Agg3[Aggregate Results]

    Agg3 --> Calc[Calculate Totals]
    Calc --> Summary[Session Summary]
    Summary --> Display[Display Results]

    style Start fill:#90EE90
    style Result1 fill:#87CEEB
    style Result2 fill:#87CEEB
    style Result3 fill:#87CEEB
    style Summary fill:#FFD700
    style Display fill:#FF69B4
```

## Sequence Diagram: Transition Screen

```mermaid
sequenceDiagram
    participant Session as GameSessionScene
    participant Screen as TransitionScreen
    participant Audio as Audio Manager
    participant Timer as Time Manager
    participant Game as Next Game

    Session->>Screen: showTransitionScreen(nextGame, callback)
    Screen->>Screen: Create overlay (fade in)
    Screen->>Screen: Create progress text "Game 2 of 3"
    Screen->>Screen: Create game name text
    Screen->>Screen: Create encouragement text

    Screen->>Audio: play('transition')
    Audio-->>Screen: Sound playing

    Screen->>Timer: delayedCall(3000ms)
    Note over Screen,Timer: 3 second display time

    Timer-->>Screen: Timer complete
    Screen->>Screen: Destroy UI elements
    Screen->>Session: Execute callback()
    Session->>Game: scene.start(nextGame, data)
```

## State Diagram: Mini-Game Lifecycle in Session

```mermaid
stateDiagram-v2
    [*] --> Queued: Added to Session
    Queued --> Preparing: Session Reaches Game

    Preparing --> ShowingTransition: Display Transition
    ShowingTransition --> Loading: Load Game Assets

    Loading --> Initializing: Assets Ready
    Initializing --> Running: init(sessionData)

    Running --> Playing: User Interacting
    Playing --> Completing: Game Win/Loss Condition

    Completing --> EmittingResult: Prepare Result Object
    EmittingResult --> ReturningControl: emit('gameComplete')

    ReturningControl --> Unloaded: Session Takes Control
    Unloaded --> [*]: Game Scene Stopped

    note right of Running
        Game includes:
        - sessionMode: true
        - gameNumber: 2
        - totalGames: 3
        - returnScene: 'GameSessionScene'
    end note
```

## Object Diagram: Session Runtime State

```mermaid
graph TB
    subgraph GameSessionScene Instance
        sessionConfig["sessionConfig: {
            gamesPerSession: 3,
            allowRepeats: false,
            transitionDuration: 3000
        }"]

        sessionState["Session State: {
            currentGameIndex: 1,
            gamesCompleted: 1,
            sessionStartTime: 1697140800000
        }"]

        gameQueue["sessionGames: [
            'LetterPopScene',
            'MemoryMatchScene',
            'TraceLetterScene'
        ]"]

        results["sessionResults: {
            scores: [
                {game: 'LetterPopScene', score: 150}
            ],
            totalScore: 150,
            itemsPracticed: ['A', 'B', 'C']
        }"]
    end

    sessionConfig -.-> sessionState
    sessionState -.-> gameQueue
    gameQueue -.-> results
```

## Component Interaction Diagram

```mermaid
graph LR
    User[User Input] --> |Complete Game| GameScene[Current Game Scene]
    GameScene --> |emit result| Session[GameSessionScene]

    Session --> |Store| ResultsStore[Results Storage]
    Session --> |Check| Progress[Progress Checker]

    Progress --> |More Games?| Decision{Decision}
    Decision -->|Yes| Transition[Show Transition]
    Decision -->|No| EndSession[End Session]

    Transition --> |After Delay| SceneManager[Scene Manager]
    SceneManager --> |Launch| NextGame[Next Game Scene]

    NextGame --> |Complete| GameScene

    EndSession --> |Calculate| Calculator[Accuracy Calculator]
    Calculator --> |Display| ResultsScreen[Results Screen]

    style User fill:#90EE90
    style Session fill:#FFB6C1
    style Decision fill:#FFD700
    style ResultsScreen fill:#87CEEB
```

## Architecture Pattern: Session Orchestration

```mermaid
graph TB
    subgraph Orchestrator Layer
        SessionScene[GameSessionScene<br/>Session Orchestrator]
    end

    subgraph Game Layer
        Game1[LetterPopScene]
        Game2[MemoryMatchScene]
        Game3[TraceLetterScene]
        Game4[SightWordScene]
        Game5[PhonicsScene]
    end

    subgraph Support Layer
        Selector[Game Selector]
        Transition[Transition Manager]
        Results[Results Aggregator]
        Config[Configuration]
    end

    subgraph Storage Layer
        Registry[Game Registry]
        History[Play History]
        Prefs[User Preferences]
    end

    SessionScene --> Selector
    SessionScene --> Transition
    SessionScene --> Results
    SessionScene --> Config

    Selector --> Registry
    Selector --> History
    Config --> Prefs

    SessionScene -.->|Orchestrates| Game1
    SessionScene -.->|Orchestrates| Game2
    SessionScene -.->|Orchestrates| Game3
    SessionScene -.->|Orchestrates| Game4
    SessionScene -.->|Orchestrates| Game5

    Game1 -.->|Reports To| Results
    Game2 -.->|Reports To| Results
    Game3 -.->|Reports To| Results
    Game4 -.->|Reports To| Results
    Game5 -.->|Reports To| Results

    style SessionScene fill:#FF6B6B
    style Selector fill:#4ECDC4
    style Transition fill:#95E1D3
    style Results fill:#FFE66D
```

## Notes

### Architecture Decisions

**Orchestrator Pattern**
- GameSessionScene acts as conductor, not participant
- Mini-games remain independent, unaware of orchestration
- Session passes context data to games via init()
- Games emit completion events back to session
- Loose coupling allows games to work standalone or in session

**Game Selection Strategy**
- Multiple algorithms supported (random, weighted, progressive)
- No-repeat filter prevents immediate repetition
- Weighted selection favors less-played games over time
- Progressive mode increases difficulty through session
- Parent override allows custom sequences

**State Management**
- Session state isolated within GameSessionScene
- Results aggregate incrementally (no post-processing)
- Timing tracked from session start
- Clean separation between session state and game state

**Transition System**
- 3-second transitions maintain momentum without rushing
- Progress indicators provide orientation ("Game 2 of 3")
- Encouragement messages boost motivation
- Countdown prevents Aurora from feeling rushed
- Auto-advance (no button) keeps flow smooth

### Why This Design?

**Separation of Concerns**
- Games don't know about sessions
- Session doesn't know game internals
- Transition logic isolated in dedicated methods
- Results aggregation separate from game logic

**Flexibility**
- Easy to add new mini-games (just add to list)
- Selection algorithm can be swapped
- Transition duration configurable
- Session length adjustable (1-5 games)

**ADHD Optimization**
- Variety prevents boredom (3 different games)
- Progress indicators reduce anxiety ("2 of 3 done!")
- Encouragement maintains motivation
- Predictable structure (always 3 games) reduces cognitive load
- Smooth transitions maintain engagement

**Scalability**
- Supports any number of mini-games
- Works with 1-5+ games per session
- Results structure extensible
- Easy to add session types (themed, skill-focused, etc.)

### Data Flow Principles

1. **Top-Down Control**: Session controls game launching
2. **Bottom-Up Reporting**: Games report results up to session
3. **Centralized Aggregation**: Session owns aggregate data
4. **Encapsulated State**: Each game manages own state
5. **Event-Driven Completion**: Games emit events, don't call session directly

This architecture ensures smooth session flow while maintaining game independence and flexibility for future enhancements.
