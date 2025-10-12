# Phase 11: Letter Pop - Score System - UML

## Class Diagram

```mermaid
classDiagram
    class LetterPopScene {
        -Number score
        -Number totalCorrect
        -Number totalLetters
        -Text scoreText
        -Text timeText
        -Number startTime
        +constructor()
        +create()
        +createUI()
        +incrementScore()
        +updateScoreDisplay()
        +updateTimeDisplay()
        +resetScore()
    }

    class ScoreDisplay {
        -Text textObject
        -Number currentScore
        -String format
        -Number x
        -Number y
        +setText(score)
        +animate()
        +setPosition(x, y)
    }

    class TimeTracker {
        -Number startTime
        -Number elapsed
        -Text displayText
        -TimerEvent updateTimer
        +start()
        +update()
        +format() String
        +reset()
    }

    class UIManager {
        -ScoreDisplay scoreDisplay
        -TimeTracker timeTracker
        -Number uiDepth
        +createScoreUI()
        +createTimeUI()
        +updateScore(value)
        +updateTime()
    }

    class TextStyle {
        <<Config>>
        +String fontSize
        +String fontFamily
        +String color
        +String stroke
        +Number strokeThickness
        +String fontStyle
    }

    LetterPopScene --> ScoreDisplay : creates
    LetterPopScene --> TimeTracker : creates
    LetterPopScene --> UIManager : uses
    ScoreDisplay --> TextStyle : uses
    TimeTracker --> TextStyle : uses
    UIManager --> ScoreDisplay : manages
    UIManager --> TimeTracker : manages
```

## Sequence Diagram: Score Increment Flow

```mermaid
sequenceDiagram
    actor Player
    participant Bubble
    participant Scene as LetterPopScene
    participant ScoreManager
    participant ScoreText
    participant Tweens

    Player->>Bubble: Click correct bubble
    Bubble->>Scene: handleCorrectClick()

    Scene->>Scene: Celebrate (particles, sound)
    Scene->>ScoreManager: incrementScore()

    ScoreManager->>ScoreManager: score++
    Note over ScoreManager: score: 4 → 5

    ScoreManager->>ScoreText: updateScoreDisplay()
    ScoreText->>ScoreText: setText("Correct: 5")
    ScoreText-->>Player: Display updated score

    ScoreManager->>Tweens: Animate score text
    Tweens->>ScoreText: Scale up to 1.2x
    Tweens->>ScoreText: Yoyo back to 1.0x
    ScoreText-->>Player: Visual feedback (pulse)
```

## Sequence Diagram: Scene Initialization with UI

```mermaid
sequenceDiagram
    participant Game as Phaser Game
    participant Scene as LetterPopScene
    participant UI as UIManager
    participant Score as ScoreDisplay
    participant Time as TimeTracker

    Game->>Scene: Start scene
    Scene->>Scene: create()

    Scene->>UI: createUI()

    UI->>Score: Create score text
    Score->>Score: Initialize at position (20, 20)
    Score->>Score: Set text: "Correct: 0"
    Score->>Score: Set style (28px, white, stroke)
    Score->>Score: setDepth(1000)
    Score-->>UI: Score display ready

    UI->>Time: Create time text
    Time->>Time: Initialize at position (760, 20)
    Time->>Time: Set text: "Time: 0:00"
    Time->>Time: Set style (24px, white, stroke)
    Time->>Time: setDepth(1000)
    Time-->>UI: Time display ready

    UI->>Scene: Start timer event
    Scene->>Scene: time.addEvent(update every 1000ms)
    Scene->>Scene: Store startTime

    UI-->>Scene: UI creation complete
    Scene->>Scene: startRound()
```

## State Diagram: Score System States

```mermaid
stateDiagram-v2
    [*] --> Initialized: Scene created

    Initialized --> DisplayingScore: UI created
    DisplayingScore --> WaitingForClick: Score = 0

    WaitingForClick --> CheckingClick: Player clicks

    CheckingClick --> CorrectClick: Letter matches
    CheckingClick --> IncorrectClick: Letter doesn't match

    CorrectClick --> IncrementingScore: score++
    IncrementingScore --> UpdatingDisplay: Update text
    UpdatingDisplay --> AnimatingScore: Pulse animation
    AnimatingScore --> DisplayingScore: Animation complete
    DisplayingScore --> WaitingForClick: Ready for next

    IncorrectClick --> DisplayingScore: Score unchanged
    DisplayingScore --> WaitingForClick: Continue

    note right of IncrementingScore
        Score only increases
        on correct clicks
    end note

    note right of IncorrectClick
        Score stays same
        Non-punitive
    end note
```

## Activity Diagram: Score Update Logic

```mermaid
flowchart TD
    Start([Player Clicks Bubble]) --> CheckCorrect{Correct Letter?}

    CheckCorrect -->|No| NoChange[Score unchanged]
    NoChange --> End

    CheckCorrect -->|Yes| Increment[score++]
    Increment --> UpdateText[scoreText.setText Correct: X]
    UpdateText --> CheckAnimation{Animate enabled?}

    CheckAnimation -->|No| End
    CheckAnimation -->|Yes| CreateTween[Create scale tween]

    CreateTween --> ScaleUp[Scale to 1.2x]
    ScaleUp --> Wait[Wait 100ms]
    Wait --> ScaleDown[Yoyo back to 1.0x]
    ScaleDown --> OptionalColor{Color flash enabled?}

    OptionalColor -->|No| End
    OptionalColor -->|Yes| FlashGold[Change to gold #FFD700]
    FlashGold --> Delay[Delay 200ms]
    Delay --> RestoreColor[Restore to white]
    RestoreColor --> End

    End([Score Update Complete])

    style Start fill:#90EE90
    style Increment fill:#FFD700
    style NoChange fill:#FFB6C1
    style End fill:#DDA0DD
```

## Activity Diagram: Time Tracking

```mermaid
flowchart TD
    Start([Scene Created]) --> StoreStartTime[Store this.time.now]
    StoreStartTime --> CreateTimer[Create timer event]
    CreateTimer --> SetDelay[delay: 1000ms loop: true]
    SetDelay --> TimerRunning[Timer active]

    TimerRunning --> Trigger{Every 1 second}
    Trigger --> CalcElapsed[elapsed = now - startTime]
    CalcElapsed --> ConvertToSeconds[elapsed / 1000]
    ConvertToSeconds --> CalcMinutes[minutes = elapsed / 60]
    CalcMinutes --> CalcSeconds[seconds = elapsed % 60]
    CalcSeconds --> FormatSeconds{seconds < 10?}

    FormatSeconds -->|Yes| Pad[secondsStr = 0 + seconds]
    FormatSeconds -->|No| NoPad[secondsStr = seconds]

    Pad --> FormatTime[Format: minutes:secondsStr]
    NoPad --> FormatTime

    FormatTime --> UpdateText[timeText.setText Time: X:XX]
    UpdateText --> TimerRunning

    style Start fill:#90EE90
    style TimerRunning fill:#87CEEB
    style UpdateText fill:#98FB98
```

## Component Hierarchy Diagram

```mermaid
graph TB
    Scene[LetterPopScene]

    Scene --> GameElements[Game Elements]
    Scene --> UILayer[UI Layer depth: 1000]

    GameElements --> Background[Background]
    GameElements --> Bubbles[Bubble Containers]
    GameElements --> Particles[Particle Effects]

    UILayer --> ScoreUI[Score Display]
    UILayer --> TimeUI[Time Display]

    ScoreUI --> ScoreText[Text: Correct: X]
    ScoreUI --> ScoreStyle[Style: 28px white stroke]
    ScoreUI --> ScorePos[Position: 20, 20]

    TimeUI --> TimeText[Text: Time: X:XX]
    TimeUI --> TimeStyle[Style: 24px white stroke]
    TimeUI --> TimePos[Position: 760, 20 right-aligned]

    style UILayer fill:#FFD700
    style ScoreUI fill:#90EE90
    style TimeUI fill:#87CEEB
    style GameElements fill:#FFB6C1
```

## Data Flow: Score Tracking

```mermaid
flowchart LR
    A[Scene Initialized] --> B[score = 0]
    B --> C[Create scoreText]
    C --> D[Display: Correct: 0]

    D --> E[Player Plays]

    E --> F{Click Event}
    F -->|Correct| G[handleCorrectClick]
    F -->|Incorrect| H[handleIncorrectClick]

    G --> I[incrementScore]
    I --> J[score++]
    J --> K[updateScoreDisplay]
    K --> L[scoreText.setText]
    L --> M[Display: Correct: X]
    M --> N[Optional: Animate]
    N --> E

    H --> E

    style B fill:#FFD700
    style J fill:#90EE90
    style M fill:#87CEEB
    style H fill:#FFB6C1
```

## UI Layout Diagram

```mermaid
graph TB
    subgraph "Game Canvas 800x600"
        ScoreTopLeft["Score Display
        Position: 20, 20
        Anchor: Top-Left
        Text: Correct: X"]

        TimeTopRight["Time Display
        Position: 760, 20
        Anchor: Top-Right
        Text: Time: X:XX"]

        GameArea["Game Play Area
        Bubbles spawn here
        Center region
        300x300 approx"]
    end

    style ScoreTopLeft fill:#90EE90
    style TimeTopRight fill:#87CEEB
    style GameArea fill:#FFB6C1
```

## Score Text Animation Sequence

```mermaid
sequenceDiagram
    participant Score as Score Value
    participant Display as Score Text
    participant Tween as Tween System

    Score->>Score: Increment (4 → 5)
    Score->>Display: updateScoreDisplay()
    Display->>Display: setText("Correct: 5")

    Display->>Tween: Create scale tween
    Note over Tween: Target: Display, Duration: 100ms

    Tween->>Display: scaleX = 1.2, scaleY = 1.2
    Note over Display: Text grows

    Tween->>Tween: Wait 100ms
    Tween->>Display: yoyo back to 1.0
    Note over Display: Text returns to normal

    Tween-->>Score: Animation complete
```

## Time Display Update Flow

```mermaid
graph LR
    Timer[Timer Event 1000ms] --> Callback[updateTimeDisplay]
    Callback --> GetNow[this.time.now]
    GetNow --> Subtract[now - startTime]
    Subtract --> ToSeconds[/ 1000]
    ToSeconds --> Minutes[Math.floor elapsed / 60]
    ToSeconds --> Seconds[elapsed % 60]
    Minutes --> Format[minutes:seconds]
    Seconds --> Format
    Format --> SetText[timeText.setText]
    SetText --> Display[Display: Time: X:XX]
    Display --> Timer

    style Timer fill:#87CEEB
    style Format fill:#90EE90
    style Display fill:#98FB98
```

## Score vs Time Comparison

```mermaid
graph TB
    subgraph Score System
        S1[Triggered by correct clicks]
        S2[Increments by 1]
        S3[Updates immediately]
        S4[Optional animation]
        S5[Always increases never decreases]
    end

    subgraph Time System
        T1[Triggered by timer every 1s]
        T2[Increments continuously]
        T3[Updates every second]
        T4[No animation]
        T5[Always increases never stops]
    end

    Score[Score Display] --> S1
    Time[Time Display] --> T1

    style Score fill:#FFD700
    style Time fill:#87CEEB
```

## Text Style Configuration

```mermaid
classDiagram
    class ScoreTextStyle {
        +String fontSize: "28px"
        +String fontFamily: "Arial"
        +String color: "#ffffff"
        +String stroke: "#000000"
        +Number strokeThickness: 4
        +String fontStyle: "bold"
    }

    class TimeTextStyle {
        +String fontSize: "24px"
        +String fontFamily: "Arial"
        +String color: "#ffffff"
        +String stroke: "#000000"
        +Number strokeThickness: 4
        +String fontStyle: "normal"
    }

    class TextPositioning {
        +Number scoreX: 20
        +Number scoreY: 20
        +Number scoreOrigin: 0, 0
        +Number timeX: 760
        +Number timeY: 20
        +Number timeOrigin: 1, 0
        +Number depth: 1000
    }

    ScoreTextStyle --> TextPositioning
    TimeTextStyle --> TextPositioning
```

## Score Animation State Machine

```mermaid
stateDiagram-v2
    [*] --> Idle: Default state

    Idle --> Incrementing: Correct click
    Incrementing --> TextUpdated: Update display
    TextUpdated --> Animating: Start tween

    Animating --> ScalingUp: Scale 1.0 → 1.2
    ScalingUp --> Holding: Hold at 1.2x for 100ms
    Holding --> ScalingDown: Yoyo back
    ScalingDown --> Idle: Return to 1.0x

    TextUpdated --> Idle: No animation

    note right of Idle
        Scale: 1.0
        Color: White
    end note

    note right of ScalingUp
        Scale: 1.2
        Duration: 100ms
    end note
```

## Notes

### Architecture Decisions

**Score Tracking**
- Single `score` variable tracks correct clicks
- Stored as scene property (persistent during scene)
- Initialized to 0 in constructor
- Only increments, never decrements (encouraging)

**UI Positioning**
- Score: Top-left (20, 20) - standard game UI position
- Time: Top-right (760, 20) - secondary information
- Both use high depth (1000) to stay above game elements
- Fixed positions (don't move with camera if added later)

**Text Styling**
- White text with black stroke (readable on any background)
- Large font size (28px score, 24px time)
- Bold for score (primary), normal for time (secondary)
- High stroke thickness (4px) ensures readability

**Time Tracking**
- Optional feature (can be excluded if adds pressure)
- Updates every 1000ms (1 second)
- Format: "M:SS" (minutes:seconds with leading zero)
- Uses Phaser timer event (efficient, no manual update loop)

**Animation**
- Score text pulses on increment (optional polish)
- Quick animation (100ms up, 100ms down = 200ms total)
- Non-blocking (doesn't interfere with gameplay)
- Can be disabled if distracting

### Why This Design?

**Simplicity**
- Minimal UI (just score and time)
- Clear labels ("Correct:", "Time:")
- Easy to read at a glance
- No clutter or complexity

**Performance**
- Text objects are lightweight
- Updates only when needed (score) or every second (time)
- No constant redraws
- High depth prevents z-fighting

**ADHD-Friendly**
- Score is visible but not distracting
- Positive framing (shows success, not failures)
- Time is informational, not pressured (no countdown)
- Immediate feedback (score updates instantly)
- Clear visual hierarchy (score more prominent than time)

**Extensibility**
- Easy to add: high score, session stats, progress bar
- Can add backgrounds or panels if needed
- Can animate score text differently
- Can change format (e.g., "5 / 10" to show total)

### Component Relationships

1. **LetterPopScene owns UI elements**
   - Creates score and time text objects
   - Manages score variable
   - Updates displays

2. **Score system is reactive**
   - Triggered by correct clicks
   - No polling or continuous checks
   - Updates only when needed

3. **Time system is active**
   - Timer event runs continuously
   - Updates every second
   - Independent of gameplay

4. **UI layer is separate**
   - High depth (1000) above game objects
   - Fixed positions (not relative to game elements)
   - Always visible

5. **Text styling is consistent**
   - Both use white + black stroke
   - Both use Arial font
   - Both use similar sizing
   - Visual consistency across UI

### Future Enhancements

**Possible additions (later phases):**
- High score tracking (save to localStorage)
- Session statistics (accuracy percentage)
- Progress bar (visual score representation)
- Combo counter (consecutive correct clicks)
- Achievement notifications
- Animated score particle effects
- Background panels for UI elements
- Responsive positioning for different screen sizes

This phase keeps the UI minimal and focused on essential feedback: how many correct, and how long playing. Everything else is secondary and can be added later without disrupting this foundation.
