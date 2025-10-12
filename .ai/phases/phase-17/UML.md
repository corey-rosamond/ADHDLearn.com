# Phase 17: ProgressManager Service - UML

## Class Diagram

```mermaid
classDiagram
    class ProgressManager {
        -static instance: ProgressManager
        -data: ProgressData
        -currentSession: Session
        -hasUnsavedChanges: boolean

        +constructor()
        +initialize() void
        +recordLetterAttempt(letter, success) void
        +calculateMasteryLevel(letterData) string
        +startNewSession() void
        +endCurrentSession() void
        +saveProgress() boolean
        +loadProgress() boolean
        +clearProgress() void
        +getLetterStats(letter) LetterStats
        +getAllLetterStats() Object
        +getLettersNeedingPractice() Array
        +getMasteredLetters() Array
        +getGlobalStats() GlobalStats
        +viewProgress() void
        +viewLetterProgress(letter) void
        +viewSessions() void
        +exportData() string
        +importData(json) boolean
        -createDefaultData() ProgressData
        -createDefaultLetterData() LetterStats
        -initializeLetter(letter) void
        -validateAndMigrateData() void
    }

    class ProgressData {
        +version: string
        +metadata: Metadata
        +letters: Map~string, LetterStats~
        +sessions: Array~Session~
        +globalStats: GlobalStats
    }

    class Metadata {
        +firstPlayed: string
        +lastPlayed: string
        +totalPlayTime: number
        +gamesCompleted: number
    }

    class LetterStats {
        +attempts: number
        +successes: number
        +failures: number
        +accuracy: number
        +masteryLevel: string
        +firstSeen: string
        +lastSeen: string
        +recentAttempts: Array~boolean~
    }

    class Session {
        +id: string
        +startTime: string
        +endTime: string
        +duration: number
        +lettersPracticed: Array~string~
        +totalAttempts: number
        +totalSuccesses: number
        +accuracy: number
        +newLettersIntroduced: Array~string~
        +masteryChanges: Array~MasteryChange~
    }

    class MasteryChange {
        +letter: string
        +from: string
        +to: string
    }

    class GlobalStats {
        +totalAttempts: number
        +totalSuccesses: number
        +overallAccuracy: number
        +lettersIntroduced: number
        +lettersMastered: number
        +currentStreak: number
        +bestStreak: number
    }

    class LocalStorage {
        <<interface>>
        +setItem(key, value) void
        +getItem(key) string
        +removeItem(key) void
    }

    ProgressManager --> ProgressData : manages
    ProgressManager --> Session : tracks current
    ProgressManager --> LocalStorage : persists to
    ProgressData --> Metadata : contains
    ProgressData --> LetterStats : contains 26
    ProgressData --> Session : contains multiple
    ProgressData --> GlobalStats : contains
    Session --> MasteryChange : contains multiple
```

## Data Structure Diagram

```mermaid
graph TB
    PD[ProgressData]

    PD --> Version["version: '1.0.0'"]
    PD --> Meta[Metadata]
    PD --> Letters[Letters Map]
    PD --> Sessions[Sessions Array]
    PD --> Global[GlobalStats]

    Meta --> FirstPlayed["firstPlayed: ISO timestamp"]
    Meta --> LastPlayed["lastPlayed: ISO timestamp"]
    Meta --> TotalTime["totalPlayTime: milliseconds"]
    Meta --> GamesComp["gamesCompleted: number"]

    Letters --> LetterA["'a': LetterStats"]
    Letters --> LetterB["'b': LetterStats"]
    Letters --> LetterZ["'z': LetterStats"]

    LetterA --> Attempts["attempts: 15"]
    LetterA --> Successes["successes: 12"]
    LetterA --> Failures["failures: 3"]
    LetterA --> Accuracy["accuracy: 80.00"]
    LetterA --> Mastery["masteryLevel: 'proficient'"]
    LetterA --> FirstSeen["firstSeen: ISO timestamp"]
    LetterA --> LastSeen["lastSeen: ISO timestamp"]
    LetterA --> Recent["recentAttempts: [T,T,F,T,T,T,T,F,T,T]"]

    Sessions --> Sess1[Session 1]
    Sessions --> Sess2[Session 2]
    Sessions --> SessN[Session N]

    Sess1 --> SessID["id: 'session_1697123456789'"]
    Sess1 --> Start["startTime: ISO timestamp"]
    Sess1 --> End["endTime: ISO timestamp"]
    Sess1 --> Duration["duration: 900000ms"]
    Sess1 --> Practiced["lettersPracticed: ['a','b','c']"]
    Sess1 --> SessAttempts["totalAttempts: 20"]
    Sess1 --> SessSuccess["totalSuccesses: 16"]
    Sess1 --> SessAcc["accuracy: 80"]
    Sess1 --> NewLetters["newLettersIntroduced: ['c']"]
    Sess1 --> Changes["masteryChanges: [...]"]

    Global --> TotalAtt["totalAttempts: 150"]
    Global --> TotalSucc["totalSuccesses: 120"]
    Global --> OverallAcc["overallAccuracy: 80.00"]
    Global --> LettersIntro["lettersIntroduced: 12"]
    Global --> LettersMast["lettersMastered: 3"]
    Global --> CurrStreak["currentStreak: 5"]
    Global --> BestStreak["bestStreak: 15"]

    style PD fill:#4A90E2
    style Letters fill:#7ED321
    style Global fill:#F5A623
    style Sessions fill:#BD10E0
    style Meta fill:#50E3C2
```

## Sequence Diagram: Recording Letter Attempt

```mermaid
sequenceDiagram
    actor Player as Aurora
    participant Game as Game Scene
    participant PM as ProgressManager
    participant LS as LocalStorage

    Player->>Game: Clicks letter 'A'
    Game->>Game: Verify if correct
    Game->>PM: recordLetterAttempt('a', true)

    PM->>PM: Get/create letter data
    PM->>PM: Update attempts++
    PM->>PM: Update successes++
    PM->>PM: Update recentAttempts array
    PM->>PM: Calculate new accuracy
    PM->>PM: Calculate mastery level

    alt Mastery level changed
        PM->>PM: Record mastery change
        PM->>PM: Log to console
    end

    PM->>PM: Update global stats
    PM->>PM: Update current session
    PM->>PM: Set hasUnsavedChanges = true

    PM->>PM: Console log attempt
    PM-->>Game: Return

    Game->>Game: Visual feedback to player
    Game->>Game: Audio feedback

    Note over PM: Changes not yet saved

    Game->>PM: onRoundComplete()
    PM->>PM: saveProgress()
    PM->>LS: setItem('aurora_letter_progress', JSON)
    LS-->>PM: Success
    PM->>PM: Set hasUnsavedChanges = false
    PM->>PM: Console log "Progress saved"
    PM-->>Game: Return true
```

## Sequence Diagram: Game Initialization

```mermaid
sequenceDiagram
    participant Browser
    participant Game as Phaser Game
    participant Scene as Game Scene
    participant PM as ProgressManager
    participant LS as LocalStorage

    Browser->>Game: Load page
    Game->>Scene: Create scene
    Scene->>PM: initialize()

    PM->>PM: loadProgress()
    PM->>LS: getItem('aurora_letter_progress')

    alt Progress exists
        LS-->>PM: Return JSON string
        PM->>PM: JSON.parse(data)
        PM->>PM: validateAndMigrateData()
        PM->>PM: Console log "Progress loaded"
    else No progress found
        LS-->>PM: Return null
        PM->>PM: createDefaultData()
        PM->>PM: Initialize 26 letters
        PM->>PM: Console log "New data created"
    end

    PM->>PM: startNewSession()
    PM->>PM: Create session object
    PM->>PM: Set startTime
    PM->>PM: Console log "Session started"

    PM-->>Scene: Initialization complete
    Scene->>Scene: Begin gameplay
```

## Sequence Diagram: Session Lifecycle

```mermaid
sequenceDiagram
    participant Scene as Game Scene
    participant PM as ProgressManager
    participant LS as LocalStorage

    Scene->>PM: initialize()
    PM->>PM: loadProgress()
    PM->>PM: startNewSession()
    Note over PM: Session tracking begins

    loop Each round
        Scene->>PM: recordLetterAttempt(letter, success)
        PM->>PM: Update session stats
        Scene->>PM: saveProgress()
        PM->>LS: Persist data
    end

    Scene->>Scene: Player exits game
    Scene->>PM: endCurrentSession()

    PM->>PM: Set session.endTime
    PM->>PM: Calculate session.duration
    PM->>PM: Add session to sessions array
    PM->>PM: Update metadata.lastPlayed
    PM->>PM: Update metadata.totalPlayTime
    PM->>PM: Console log session summary

    PM->>PM: saveProgress()
    PM->>LS: setItem() - Final save
    LS-->>PM: Success

    PM->>PM: Set currentSession = null
    PM-->>Scene: Session ended
```

## State Diagram: Mastery Level Progression

```mermaid
stateDiagram-v2
    [*] --> NotStarted: Letter exists in data

    NotStarted --> Learning: First attempt recorded

    Learning --> Practicing: Accuracy >= 60%<br/>AND attempts >= 5
    Learning --> Learning: Accuracy < 60%

    Practicing --> Proficient: Weighted accuracy >= 80%<br/>AND attempts >= 5
    Practicing --> Learning: Weighted accuracy drops < 60%
    Practicing --> Practicing: 60% <= accuracy < 80%

    Proficient --> Mastered: Weighted accuracy >= 90%<br/>AND attempts >= 10
    Proficient --> Practicing: Weighted accuracy drops < 80%
    Proficient --> Proficient: 80% <= accuracy < 90%

    Mastered --> Proficient: Weighted accuracy drops < 90%<br/>(rare, due to recent weighting)
    Mastered --> Mastered: Maintains >= 90% accuracy

    note right of NotStarted
        0 attempts
    end note

    note right of Learning
        < 60% weighted accuracy
        OR < 5 attempts
    end note

    note right of Practicing
        60-79% weighted accuracy
        >= 5 attempts
    end note

    note right of Proficient
        80-89% weighted accuracy
        >= 5 attempts
    end note

    note right of Mastered
        >= 90% weighted accuracy
        >= 10 attempts
    end note
```

## Activity Diagram: saveProgress() Flow

```mermaid
flowchart TD
    Start([saveProgress called]) --> Try{Try block}

    Try --> Serialize[Serialize data to JSON string]
    Serialize --> SetItem[LocalStorage.setItem<br/>'aurora_letter_progress', JSON]

    SetItem --> CheckSuccess{Success?}

    CheckSuccess -->|Yes| ClearFlag[Set hasUnsavedChanges = false]
    ClearFlag --> LogSuccess[Console log: Progress saved]
    LogSuccess --> ReturnTrue[Return true]
    ReturnTrue --> End([End])

    CheckSuccess -->|No| Catch
    Try -->|Exception| Catch{Catch block}

    Catch --> LogError[Console error: Failed to save]
    LogError --> CheckReason{Reason?}

    CheckReason -->|Quota exceeded| LogQuota[Log: LocalStorage full]
    CheckReason -->|Privacy mode| LogPrivacy[Log: Private browsing]
    CheckReason -->|Other| LogOther[Log: Unknown error]

    LogQuota --> ReturnFalse[Return false]
    LogPrivacy --> ReturnFalse
    LogOther --> ReturnFalse
    ReturnFalse --> End

    style Start fill:#90EE90
    style End fill:#FFB6C1
    style CheckSuccess fill:#FFD700
    style Catch fill:#FFA07A
```

## Activity Diagram: calculateMasteryLevel() Algorithm

```mermaid
flowchart TD
    Start([calculateMasteryLevel called]) --> CheckAttempts{attempts == 0?}

    CheckAttempts -->|Yes| ReturnNotStarted[Return 'not_started']
    ReturnNotStarted --> End([End])

    CheckAttempts -->|No| CheckMinAttempts{attempts < 5?}
    CheckMinAttempts -->|Yes| ReturnLearning[Return 'learning']
    ReturnLearning --> End

    CheckMinAttempts -->|No| CalcRecent[Calculate recent accuracy<br/>from last 10 attempts]

    CalcRecent --> CheckRecentData{recentAttempts.length >= 5?}

    CheckRecentData -->|Yes| UseRecent[recentAccuracy =<br/>recentSuccesses / recentAttempts.length]
    CheckRecentData -->|No| UseOverall[recentAccuracy = accuracy]

    UseRecent --> CalcWeighted
    UseOverall --> CalcWeighted[weightedAccuracy =<br/>recentAccuracy * 0.7 +<br/>accuracy * 0.3]

    CalcWeighted --> Check90{weightedAccuracy >= 90<br/>AND attempts >= 10?}

    Check90 -->|Yes| ReturnMastered[Return 'mastered']
    ReturnMastered --> End

    Check90 -->|No| Check80{weightedAccuracy >= 80?}

    Check80 -->|Yes| ReturnProficient[Return 'proficient']
    ReturnProficient --> End

    Check80 -->|No| Check60{weightedAccuracy >= 60?}

    Check60 -->|Yes| ReturnPracticing[Return 'practicing']
    ReturnPracticing --> End

    Check60 -->|No| ReturnLearning2[Return 'learning']
    ReturnLearning2 --> End

    style Start fill:#90EE90
    style End fill:#FFB6C1
    style CalcWeighted fill:#87CEEB
    style Check90 fill:#FFD700
    style Check80 fill:#FFD700
    style Check60 fill:#FFD700
```

## Component Diagram

```mermaid
graph TB
    subgraph "Browser Environment"
        subgraph "Phaser Game"
            GameConfig[Game Config]
            MainMenu[MainMenuScene]
            GameScene[LetterPopScene]
        end

        subgraph "Services Layer"
            PM[ProgressManager]
        end

        subgraph "Browser APIs"
            LS[LocalStorage API]
            Console[Console API]
        end

        subgraph "Global Window"
            WindowPM[window.ProgressManager]
        end
    end

    GameConfig --> PM
    GameScene --> PM
    MainMenu --> PM
    PM --> LS
    PM --> Console
    PM -.exposes.-> WindowPM

    PM -->|Auto-save every 30s| LS
    GameScene -->|Record attempts| PM
    GameScene -->|Save on round end| PM
    WindowPM -->|Developer access| Console

    style PM fill:#4A90E2
    style LS fill:#7ED321
    style Console fill:#F5A623
    style WindowPM fill:#BD10E0
```

## Deployment Diagram

```mermaid
graph LR
    subgraph "Client Browser"
        subgraph "Memory"
            PMInstance[ProgressManager<br/>Instance]
            CurrentSession[Current Session<br/>Object]
            ProgressData[Progress Data<br/>Object]
        end

        subgraph "LocalStorage"
            LSData[aurora_letter_progress<br/>JSON string]
        end

        subgraph "JavaScript Runtime"
            GameLoop[Game Loop]
            AutoSave[Auto-save Interval<br/>30 seconds]
            UnloadHandler[beforeunload<br/>Event Handler]
        end
    end

    PMInstance --> ProgressData
    PMInstance --> CurrentSession
    PMInstance -->|saveProgress| LSData
    LSData -->|loadProgress| PMInstance

    GameLoop --> PMInstance
    AutoSave --> PMInstance
    UnloadHandler --> PMInstance

    style PMInstance fill:#4A90E2
    style LSData fill:#7ED321
    style ProgressData fill:#F5A623
    style CurrentSession fill:#BD10E0
```

## Entity Relationship Diagram

```mermaid
erDiagram
    PROGRESS_DATA ||--|| METADATA : contains
    PROGRESS_DATA ||--|{ LETTER_STATS : "has 26"
    PROGRESS_DATA ||--|{ SESSION : "has many"
    PROGRESS_DATA ||--|| GLOBAL_STATS : contains
    SESSION ||--|{ MASTERY_CHANGE : "may have"

    PROGRESS_DATA {
        string version
    }

    METADATA {
        datetime firstPlayed
        datetime lastPlayed
        int totalPlayTime
        int gamesCompleted
    }

    LETTER_STATS {
        string letter PK
        int attempts
        int successes
        int failures
        float accuracy
        string masteryLevel
        datetime firstSeen
        datetime lastSeen
        array recentAttempts
    }

    SESSION {
        string id PK
        datetime startTime
        datetime endTime
        int duration
        array lettersPracticed
        int totalAttempts
        int totalSuccesses
        float accuracy
        array newLettersIntroduced
    }

    MASTERY_CHANGE {
        string letter FK
        string fromLevel
        string toLevel
    }

    GLOBAL_STATS {
        int totalAttempts
        int totalSuccesses
        float overallAccuracy
        int lettersIntroduced
        int lettersMastered
        int currentStreak
        int bestStreak
    }
```

## Notes

### Architectural Decisions

**Singleton Pattern**
- Ensures only one ProgressManager exists globally
- Prevents data inconsistency from multiple instances
- Provides easy access via `window.ProgressManager`
- Thread-safe in single-threaded JavaScript environment

**Data Structure Design**
- Flat letter map for O(1) lookup by letter
- Session array for chronological history
- Recent attempts array capped at 10 for memory efficiency
- ISO timestamps for timezone-independent date handling

**Mastery Calculation Weighting**
- 70% recent performance, 30% overall performance
- Prevents "stuck" mastery levels from early struggles
- Encourages continued practice
- Recent attempts (last 10) given priority

**LocalStorage Strategy**
- Auto-save every 30 seconds to prevent data loss
- Manual save after each round for immediate persistence
- Save on page unload to capture session end
- Graceful degradation if LocalStorage unavailable

**Performance Considerations**
- Session history limited to prevent unbounded growth
- JSON serialization only on save (not on every mutation)
- Lazy loading - only load when game starts
- Console methods separate from core logic

### Scalability Notes

**Current Limitations:**
- 26 letters (English alphabet only)
- Session array grows indefinitely (consider cleanup)
- LocalStorage ~5-10MB limit (thousands of sessions)

**Future Enhancements:**
- Add session cleanup (keep last 100 sessions)
- Support multiple users/profiles
- Add data compression for large histories
- Implement cloud sync option
- Add analytics/insights methods
- Support multilingual alphabets

### Why This Architecture?

1. **Separation of Concerns**: Progress tracking isolated from game logic
2. **Testability**: Singleton can be mocked/reset for tests
3. **Developer Experience**: Console interface for debugging
4. **Data Integrity**: Validation and migration support
5. **Performance**: Efficient lookups, minimal serialization
6. **Reliability**: Auto-save, error handling, data recovery
7. **Extensibility**: Easy to add new metrics or features

This design balances simplicity for Phase 17 while laying groundwork for future educational analytics and adaptive learning features.
