# Phase 12: Letter Pop - Complete Round Flow - UML

## System Architecture Diagram

```mermaid
graph TB
    LetterPop[LetterPopScene]
    Results[ResultsScene]
    Audio[Audio Manager]
    Timer[Time Tracker]
    State[Round State]

    LetterPop --> State
    LetterPop --> Timer
    LetterPop --> Audio
    LetterPop -->|Pass Data| Results
    Results -->|Restart| LetterPop
    Results --> Audio

    style LetterPop fill:#90EE90
    style Results fill:#FFB6C1
    style State fill:#87CEEB
```

## Complete Game Loop Sequence Diagram

```mermaid
sequenceDiagram
    actor Player
    participant LetterPop as LetterPopScene
    participant State as Round State
    participant Timer as Time Tracker
    participant Audio as Audio System
    participant Results as ResultsScene

    Player->>LetterPop: Start Round
    LetterPop->>State: Initialize (index=0, score=0)
    LetterPop->>Timer: Start (record timestamp)
    LetterPop->>State: Generate 10 random letters
    LetterPop->>LetterPop: Display Letter 1/10

    loop For each letter (10 times)
        Player->>LetterPop: Click answer
        alt Answer Correct
            LetterPop->>Audio: Play correct sound
            LetterPop->>State: Increment score
            LetterPop->>State: Increment index
            alt Not Final Letter (index < 9)
                LetterPop->>LetterPop: Display next letter
            else Final Letter (index === 9)
                LetterPop->>Timer: Stop (calculate duration)
                LetterPop->>LetterPop: End round
            end
        else Answer Incorrect
            LetterPop->>Audio: Play incorrect sound
            LetterPop->>LetterPop: Show feedback
            LetterPop->>LetterPop: Stay on same letter
        end
    end

    LetterPop->>Results: Transition with data (score, time)
    Results->>Results: Display score
    Results->>Results: Display time
    Results->>Results: Show performance message
    Results->>Results: Show Play Again button

    Player->>Results: Click Play Again
    Results->>Audio: Play button click
    Results->>LetterPop: Start new round
    LetterPop->>State: Reset state
```

## Round State Management Class Diagram

```mermaid
classDiagram
    class LetterPopScene {
        -Array roundLetters
        -Number currentLetterIndex
        -Number correctAnswers
        -Number roundStartTime
        -Boolean roundInProgress
        -Text letterText
        -Text progressText
        +create()
        +startRound()
        +generateLetterSequence() Array
        +displayCurrentLetter()
        +updateProgressDisplay()
        +onCorrectAnswer()
        +onIncorrectAnswer()
        +showIncorrectFeedback()
        +endRound()
    }

    class ResultsScene {
        -Number score
        -Number totalLetters
        -Number timeSeconds
        -Rectangle buttonBg
        -Text buttonText
        +init(data)
        +create()
        +displayPerformanceMessage()
        +createPlayAgainButton()
        +showCelebration()
    }

    class RoundState {
        <<Data Object>>
        +Array letters
        +Number currentIndex
        +Number correctCount
        +Number startTime
        +Boolean isActive
    }

    class ResultsData {
        <<Data Object>>
        +Number score
        +Number totalLetters
        +Number timeSeconds
    }

    LetterPopScene --> RoundState : manages
    LetterPopScene --> ResultsData : creates
    ResultsScene --> ResultsData : receives
    ResultsScene --> LetterPopScene : restarts
```

## Game Loop State Diagram

```mermaid
stateDiagram-v2
    [*] --> RoundStart: Enter LetterPopScene

    RoundStart --> InitializeState: startRound()
    InitializeState --> GenerateLetters: Create letter array
    GenerateLetters --> DisplayLetter: Show first letter

    DisplayLetter --> WaitingForAnswer: Letter visible

    WaitingForAnswer --> CheckAnswer: Player clicks

    CheckAnswer --> CorrectAnswer: Answer correct
    CheckAnswer --> IncorrectAnswer: Answer incorrect

    CorrectAnswer --> PlayCorrectSound: Audio feedback
    PlayCorrectSound --> UpdateScore: Increment score
    UpdateScore --> CheckProgress: Check letter index

    CheckProgress --> DisplayNextLetter: index < 9
    CheckProgress --> RoundComplete: index === 9

    DisplayNextLetter --> DisplayLetter: Show next letter

    IncorrectAnswer --> PlayIncorrectSound: Audio feedback
    PlayIncorrectSound --> ShowFeedback: Visual feedback
    ShowFeedback --> WaitingForAnswer: Stay on same letter

    RoundComplete --> CalculateTime: Compute duration
    CalculateTime --> TransitionToResults: Pass data

    TransitionToResults --> ShowResults: ResultsScene loads
    ShowResults --> DisplayScore: Show X/10
    DisplayScore --> DisplayTime: Show seconds
    DisplayTime --> DisplayMessage: Show performance
    DisplayMessage --> ShowButton: Show Play Again

    ShowButton --> WaitingForReplay: Button ready

    WaitingForReplay --> PlayAgainClicked: Player clicks button
    PlayAgainClicked --> RoundStart: Restart scene

    ShowResults --> [*]: Exit game
```

## Letter Sequence Flow Diagram

```mermaid
flowchart TD
    Start([Start Round]) --> Init[Initialize State:<br/>index=0, score=0]
    Init --> GenLetters[Generate 10<br/>Random Letters]
    GenLetters --> StartTimer[Record Start Time]
    StartTimer --> ShowLetter1[Display Letter 1/10]

    ShowLetter1 --> WaitAnswer1{Wait for<br/>Answer}
    WaitAnswer1 -->|Correct| Next1[index++, score++]
    WaitAnswer1 -->|Incorrect| Stay1[Stay on Letter 1]
    Stay1 --> WaitAnswer1
    Next1 --> ShowLetter2[Display Letter 2/10]

    ShowLetter2 --> WaitAnswer2{Wait for<br/>Answer}
    WaitAnswer2 -->|Correct| Next2[index++, score++]
    WaitAnswer2 -->|Incorrect| Stay2[Stay on Letter 2]
    Stay2 --> WaitAnswer2
    Next2 --> DotDot[...]

    DotDot --> ShowLetter10[Display Letter 10/10]
    ShowLetter10 --> WaitAnswer10{Wait for<br/>Answer}
    WaitAnswer10 -->|Correct| Final[index++, score++]
    WaitAnswer10 -->|Incorrect| Stay10[Stay on Letter 10]
    Stay10 --> WaitAnswer10

    Final --> CheckComplete{index >= 10?}
    CheckComplete -->|Yes| EndRound[End Round]
    EndRound --> CalcTime[Calculate Total Time]
    CalcTime --> ShowResults[Transition to<br/>ResultsScene]
    ShowResults --> End([Results Display])

    style ShowLetter1 fill:#90EE90
    style ShowLetter2 fill:#90EE90
    style ShowLetter10 fill:#90EE90
    style ShowResults fill:#FFB6C1
```

## Data Flow Between Scenes

```mermaid
graph LR
    LP[LetterPopScene] -->|score: 8| RD[ResultsData Object]
    LP -->|totalLetters: 10| RD
    LP -->|timeSeconds: 45| RD

    RD -->|scene.start data| RS[ResultsScene]

    RS -->|init receives data| Display[Display Components]
    Display --> Score[Score: 8/10]
    Display --> Time[Time: 45 sec]
    Display --> Msg[Performance Message]

    RS -->|Play Again click| LP2[LetterPopScene Restart]

    style RD fill:#87CEEB
    style LP fill:#90EE90
    style LP2 fill:#90EE90
    style RS fill:#FFB6C1
```

## Results Scene Component Diagram

```mermaid
graph TB
    Results[ResultsScene]

    Results --> Title[Title Text:<br/>'Round Complete!']
    Results --> Score[Score Display:<br/>'X out of 10']
    Results --> Time[Time Display:<br/>'XX seconds']
    Results --> Message[Performance Message]
    Results --> Button[Play Again Button]
    Results --> Celebration[Celebration Effect<br/>if perfect]

    Button --> ButtonBg[Rectangle Background]
    Button --> ButtonText[Text: 'Play Again']
    Button --> Hover[Hover Animation]
    Button --> Click[Click Handler]

    Click --> Sound[Play Click Sound]
    Click --> Restart[scene.start LetterPopScene]

    style Results fill:#FFB6C1
    style Button fill:#90EE90
    style Celebration fill:#FFD700
```

## Round Progress Component Diagram

```mermaid
graph TB
    LPS[LetterPopScene Display]

    LPS --> Progress[Progress Text:<br/>'Letter X of 10']
    LPS --> Letter[Current Letter<br/>Large Display]
    LPS --> AnswerButtons[Answer Options<br/>if applicable]

    Progress --> Update1[Update on correct<br/>answer]
    Letter --> Update2[Change on correct<br/>answer]

    Update1 --> Check{Index >= 9?}
    Update2 --> Check

    Check -->|No| NextLetter[Display Next Letter]
    Check -->|Yes| EndRound[End Round Flow]

    EndRound --> PrepData[Prepare Results Data]
    PrepData --> Transition[scene.start ResultsScene]

    style LPS fill:#90EE90
    style EndRound fill:#FF6B6B
    style Transition fill:#FFB6C1
```

## Time Tracking Sequence

```mermaid
sequenceDiagram
    participant Round as Round Logic
    participant Timer as Time Tracker
    participant Results as ResultsScene

    Round->>Timer: startRound() called
    Timer->>Timer: roundStartTime = Date.now()
    Note over Timer: Timestamp: 1699876543210

    Note over Round: Player answers<br/>letters 1-10...

    Round->>Timer: endRound() called
    Timer->>Timer: roundEndTime = Date.now()
    Note over Timer: Timestamp: 1699876588210

    Timer->>Timer: Calculate duration
    Note over Timer: duration = end - start<br/>= 45000 ms

    Timer->>Timer: Convert to seconds
    Note over Timer: timeSeconds = 45000 / 1000<br/>= 45 seconds

    Timer->>Results: Pass timeSeconds (45)
    Results->>Results: Display "Time: 45 seconds"
```

## Performance Message Logic

```mermaid
flowchart TD
    Start([Receive Score Data]) --> Calc[Calculate Percentage:<br/>score / totalLetters * 100]
    Calc --> Check{Check Percentage}

    Check -->|100%| Perfect[Message:<br/>'Perfect! Amazing work!']
    Check -->|>= 80%| Great[Message:<br/>'Great job!']
    Check -->|>= 60%| Good[Message:<br/>'Good effort!']
    Check -->|< 60%| Practice[Message:<br/>'Keep practicing!']

    Perfect --> Display[Display Message]
    Great --> Display
    Good --> Display
    Practice --> Display

    Display --> Celeb{Score === 100%?}
    Celeb -->|Yes| ShowStars[Show Star Celebration]
    Celeb -->|No| SkipCeleb[No celebration]

    ShowStars --> End([Results Complete])
    SkipCeleb --> End

    style Perfect fill:#FFD700
    style Great fill:#90EE90
    style Good fill:#87CEEB
    style Practice fill:#FFB6C1
```

## Memory Management Diagram

```mermaid
graph TB
    StartRound[Start Round] --> DestroyPrev[Destroy Previous<br/>Letter Display]
    DestroyPrev --> DestroyProgress[Destroy Previous<br/>Progress Display]
    DestroyProgress --> CreateNew[Create New Display<br/>Objects]

    CreateNew --> Advance[Advance to Next Letter]
    Advance --> DestroyPrev

    Advance --> CheckEnd{Round<br/>Complete?}
    CheckEnd -->|Yes| Cleanup[Clean Up All<br/>Game Objects]
    CheckEnd -->|No| DestroyPrev

    Cleanup --> Transition[Transition to<br/>ResultsScene]

    Transition --> NewScene[ResultsScene<br/>Creates Own Objects]

    style DestroyPrev fill:#FF6B6B
    style DestroyProgress fill:#FF6B6B
    style Cleanup fill:#FF6B6B
    style CreateNew fill:#90EE90
    style NewScene fill:#90EE90
```

## Button Interaction State Machine

```mermaid
stateDiagram-v2
    [*] --> Idle: Button created

    Idle --> Hover: Pointer over
    Hover --> Idle: Pointer out
    Hover --> Pressed: Pointer down

    Pressed --> ScaleDown: Tween start
    ScaleDown --> ScaleUp: Tween yoyo
    ScaleUp --> Transitioning: Tween complete

    Transitioning --> PlaySound: Play button click
    PlaySound --> ChangeScene: scene.start called
    ChangeScene --> [*]: LetterPopScene loads

    note right of Hover
        Scale: 1.0 → 1.1
        Duration: 200ms
    end note

    note right of Pressed
        Scale: 1.1 → 0.95 → 1.1
        Duration: 100ms
    end note
```

## Scene Configuration Diagram

```mermaid
graph LR
    Config[Game Config] --> Scenes[Scene Array]

    Scenes --> Boot[BootScene]
    Scenes --> Preload[PreloadScene]
    Scenes --> Menu[MainMenuScene]
    Scenes --> LetterPop[LetterPopScene]
    Scenes --> Results[ResultsScene]

    LetterPop -.->|Transitions to| Results
    Results -.->|Transitions to| LetterPop
    Menu -.->|Starts| LetterPop

    style LetterPop fill:#90EE90
    style Results fill:#FFB6C1
    style Config fill:#87CEEB
```

## Notes

### Why This Architecture?

**Round State Isolation**
- All round state contained in LetterPopScene
- Easy to reset for new rounds
- No global state pollution
- Clear state lifecycle

**Data Passing via Phaser Scene System**
- Use built-in scene.start(key, data) mechanism
- ResultsScene receives via init(data)
- Type-safe and predictable
- No external state management needed

**Time Tracking with Date.now()**
- Simple and reliable
- No complex game time calculations
- Sufficient accuracy for this use case
- Easy to understand and debug

**Progress Indicator Benefits**
- Shows player exactly where they are
- Reduces uncertainty and anxiety
- Creates clear goals (finish 10 letters)
- ADHD-friendly with concrete progress

### Performance Considerations

**Object Destruction**
- Destroy previous letter/progress text before creating new
- Prevents memory leaks
- Keeps object count manageable
- Important for multiple rounds

**Delayed Transitions**
- Brief delays between letter changes (500ms)
- Allows player to process feedback
- Prevents overwhelming speed
- Creates rhythm in gameplay

**Tween Animations**
- Use tweens for smooth animations
- Duration 100-200ms for responsiveness
- Hardware accelerated by Phaser
- No performance impact

### Design Decisions

**Fixed Round Length (10 letters)**
- Not too short (feels incomplete)
- Not too long (maintains engagement)
- Easy to track progress
- Good for ADHD attention span

**No Wrong Answer Penalty**
- Incorrect answers don't end round
- Player can retry same letter
- Reduces frustration
- Encourages learning over perfection

**Immediate Replay**
- One click to play again
- No menu navigation required
- Maintains momentum and engagement
- Perfect for "just one more round" feeling

**Performance Messages**
- Always encouraging, never negative
- Even lowest tier says "Keep practicing!"
- Celebrates effort, not just perfection
- Builds confidence

### What This Phase Achieves

1. **Complete Game Loop**: Full start-to-finish experience
2. **Score Tracking**: Quantifiable performance metrics
3. **Time Tracking**: Additional replay motivation
4. **Results Feedback**: Clear performance summary
5. **Replay System**: Immediate re-engagement
6. **Progress Visibility**: "Letter X of 10" reduces uncertainty
7. **Celebration**: Special recognition for perfect rounds
8. **Foundation for Expansion**: Easy to add difficulty levels later

This phase transforms Letter Pop from a prototype into a complete, replayable game.
