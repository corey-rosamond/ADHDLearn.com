# Phase 39: Dance & Trace - Completion and Flow - UML

## Class Diagram

```mermaid
classDiagram
    class CompletionManager {
        -Scene scene
        -Object completionData
        -Array sessionData
        -Number letterStartTime

        +onLetterComplete()
        +calculateAccuracy() Number
        +recordCompletion(letter)
        +triggerCelebration()
        -calculateCompletionTime() Number
    }

    class CelebrationSystem {
        -Scene scene
        -ParticleEmitter fireworks
        -Array audioQueue
        -Boolean isPlayingCelebration

        +celebrateLetterCompletion()
        +playSuccessAudio()
        +launchFireworks()
        +flashLetter()
        +cleanup()
        -selectRandomPraise() String
        -createFireworkBurst(x, y, color)
    }

    class ProgressionManager {
        -Scene scene
        -Number letterIndex
        -Number lettersPerRound
        -Array letterQueue
        -Boolean isTransitioning

        +loadNextLetter()
        +transitionToNextLetter()
        +checkRoundComplete() Boolean
        +resetForNewLetter()
        -fadeOutCurrent()
        -fadeInNext()
    }

    class RetrySystem {
        -Scene scene
        -Number inactivityTimer
        -Number offPathTimer
        -Boolean retryAvailable

        +createRetryButton()
        +retryCurrentLetter()
        +showRetryModal()
        +hideRetryModal()
        +checkInactivity()
        -resetLetterState()
    }

    class RoundCompletionManager {
        -Scene scene
        -Array sessionData
        -Number stars

        +onRoundComplete()
        +showRoundSummary(stars)
        +calculateStars(sessionData) Number
        +displayStars(count)
        +createSummaryUI()
        -animateStars()
        -playFanfare()
    }

    class StarRatingCalculator {
        -Array completionData
        -Object weights

        +calculate() Number
        +getAverageAccuracy() Number
        +getAverageTime() Number
        +applyWeights()
        -normalizeScore(value, min, max) Number
    }

    class ProgressPersistence {
        -String storageKey
        -Object progressData

        +saveProgress(sessionData, stars)
        +loadProgress() Object
        +updateLifetimeStats(letters, stars)
        +getStatistics() Object
        -serializeData() String
        -deserializeData(json) Object
    }

    DanceTraceScene --> CompletionManager : uses
    CompletionManager --> CelebrationSystem : triggers
    CompletionManager --> ProgressionManager : updates
    CelebrationSystem --> AudioManager : plays
    CelebrationSystem --> ParticleSystem : launches
    ProgressionManager --> RetrySystem : resets
    ProgressionManager --> RoundCompletionManager : checks
    RoundCompletionManager --> StarRatingCalculator : calculates
    RoundCompletionManager --> ProgressPersistence : saves
    RetrySystem --> CompletionManager : resets
```

## Sequence Diagram - Letter Completion Flow

```mermaid
sequenceDiagram
    actor Aurora
    participant Scene as DanceTraceScene
    participant Completion as CompletionManager
    participant Celebration as CelebrationSystem
    participant Audio as AudioManager
    participant Particles as ParticleSystem
    participant Progression as ProgressionManager
    participant Storage as ProgressPersistence

    Aurora->>Scene: Complete final stroke (90%+)
    Scene->>Completion: onLetterComplete()

    Completion->>Completion: Record completion data
    Note over Completion: letter: 'A'<br/>time: 8500ms<br/>accuracy: 0.85

    Completion->>Celebration: celebrateLetterCompletion()

    par Parallel Celebration
        Celebration->>Audio: playSuccessAudio()
        Audio->>Audio: "Great job!"
        Audio->>Audio: Wait 1 second
        Audio->>Audio: "You traced the letter A!"
        Audio->>Audio: Play celebration jingle

        Celebration->>Particles: launchFireworks()
        loop 5 firework bursts
            Particles->>Particles: Create emitter at random position
            Particles->>Particles: Explode 50 particles
            Particles->>Audio: Play "firework-burst" sound
            Particles->>Particles: Wait 400ms
        end

        Celebration->>Scene: flashLetter()
        Scene->>Scene: Tween letter alpha (5 flashes)
    end

    Celebration-->>Completion: Celebration complete (4 seconds)

    Completion->>Progression: loadNextLetter()
    Progression->>Progression: Increment letterIndex (0 → 1)
    Progression->>Progression: Check if more letters

    alt More letters remaining
        Progression->>Scene: transitionToNextLetter()
        Scene->>Scene: Fade out current letter (500ms)
        Scene->>Scene: Clear graphics
        Scene->>Scene: Reset PathDetector
        Scene->>Scene: Load next letter data ('B')
        Scene->>Scene: Draw new letter path
        Scene->>Scene: Create new start indicator
        Scene->>Scene: Update UI ("Letter 2 of 5")
        Scene->>Scene: Fade in new letter (500ms)
        Scene->>Audio: Play intro for letter B
        Scene-->>Aurora: Ready for next letter

    else All letters complete (letterIndex >= 5)
        Progression->>RoundCompletion: onRoundComplete()
        Note over Progression: Round finished!
    end
```

## Sequence Diagram - Round Completion Flow

```mermaid
sequenceDiagram
    participant Progression as ProgressionManager
    participant Round as RoundCompletionManager
    participant Stars as StarRatingCalculator
    participant UI as UIManager
    participant Storage as ProgressPersistence
    participant Audio as AudioManager
    actor Aurora

    Progression->>Round: onRoundComplete()
    Round->>Stars: calculateStars(sessionData)

    Stars->>Stars: Get average accuracy (0.82)
    Stars->>Stars: Get average time (9200ms)
    Stars->>Stars: Apply rating rules
    Note over Stars: accuracy > 0.85 && time < 10000<br/>→ 3 stars<br/>accuracy > 0.70 && time < 15000<br/>→ 2 stars<br/>else → 1 star

    Stars-->>Round: stars = 2

    Round->>Storage: saveProgress(sessionData, 2 stars)
    Storage->>Storage: Load existing progress
    Storage->>Storage: Update lifetime stats
    Storage->>Storage: Save to localStorage
    Storage-->>Round: Progress saved

    Round->>UI: showRoundSummary(2 stars)
    UI->>UI: Clear scene
    UI->>UI: Draw background
    UI->>UI: Display "Round Complete!"
    UI->>UI: Display "You traced: A B C D E"

    UI->>UI: displayStars(2)
    loop For each star (3 total)
        UI->>UI: Create star text (★)
        UI->>UI: Set color (gold if earned, gray if not)
        UI->>UI: Animate scale (0 → 1.2)

        alt Star earned
            UI->>Audio: Play "star-ding" sound
        end

        UI->>UI: Wait 500ms before next star
    end

    UI->>UI: Create "Play Again" button
    UI->>UI: Create "Main Menu" button

    Audio->>Audio: Play "round-complete-fanfare"

    UI-->>Aurora: Round summary displayed

    alt Aurora clicks "Play Again"
        Aurora->>UI: Click "Play Again"
        UI->>Progression: Generate new random letters
        UI->>Scene: Restart scene
        Scene-->>Aurora: New round begins
    else Aurora clicks "Main Menu"
        Aurora->>UI: Click "Main Menu"
        UI->>Scene: Start MainMenuScene
        Scene-->>Aurora: Return to main menu
    end
```

## State Diagram - Letter and Round Flow

```mermaid
stateDiagram-v2
    [*] --> Tracing: Letter loaded

    Tracing --> LetterComplete: All strokes 90%+
    Note right of Tracing: Aurora is tracing<br/>Rainbow trail visible<br/>Progress updating

    LetterComplete --> Celebrating: Trigger celebration
    Note right of LetterComplete: All strokes done<br/>Stop tracing<br/>Record data

    state Celebrating {
        [*] --> PlayingAudio
        PlayingAudio --> LaunchingFireworks
        LaunchingFireworks --> FlashingLetter
        FlashingLetter --> [*]
    }

    Celebrating --> Transitioning: After 4 seconds
    Note right of Celebrating: Fireworks bursting<br/>Audio playing<br/>Letter flashing

    state Transitioning {
        [*] --> FadingOut
        FadingOut --> Clearing
        Clearing --> LoadingNext
        LoadingNext --> FadingIn
        FadingIn --> [*]
    }

    Transitioning --> MoreLetters: Check letterIndex
    Note right of Transitioning: Smooth fade<br/>Clear graphics<br/>Load new letter

    MoreLetters --> Tracing: letterIndex < 5
    Note right of MoreLetters: Next letter ready<br/>UI updated<br/>Start indicator visible

    MoreLetters --> RoundComplete: letterIndex >= 5
    Note right of MoreLetters: All 5 letters done

    state RoundComplete {
        [*] --> CalculatingStars
        CalculatingStars --> DisplayingSummary
        DisplayingSummary --> AnimatingStars
        AnimatingStars --> WaitingForChoice
        WaitingForChoice --> PlayAgain: Click "Play Again"
        WaitingForChoice --> MainMenu: Click "Main Menu"
    }

    RoundComplete --> [*]: Session ended
```

## Data Flow Diagram - Completion Data

```mermaid
flowchart TB
    subgraph Input
        TraceData[Tracing Data<br/>Points, Time, Accuracy]
        CompletionTrigger[Completion Trigger<br/>All strokes 90%+]
    end

    subgraph Processing
        RecordData[Record Completion<br/>letter, time, accuracy]
        AddToSession[Add to Session Array<br/>sessionData.push]
        CalcAccuracy[Calculate Accuracy<br/>Average deviation from path]
        CalcTime[Calculate Time<br/>now - startTime]
    end

    subgraph Celebration
        Fireworks[Launch Fireworks<br/>5 bursts, particles]
        Audio[Play Audio<br/>Praise + letter name]
        Visual[Flash Letter<br/>Alpha tween]
    end

    subgraph Progression
        IncrementIndex[letterIndex++]
        CheckMore{More<br/>letters?}
        LoadNext[Load Next Letter<br/>Fade transition]
        CalcStars[Calculate Stars<br/>1-3 based on performance]
    end

    subgraph Output
        NextLetter[Display Next Letter<br/>Ready to trace]
        Summary[Round Summary<br/>Stars, letters, buttons]
        SaveData[Save to localStorage<br/>Lifetime progress]
    end

    TraceData --> CalcAccuracy
    TraceData --> CalcTime
    CompletionTrigger --> RecordData

    CalcAccuracy --> RecordData
    CalcTime --> RecordData
    RecordData --> AddToSession

    AddToSession --> Fireworks
    AddToSession --> Audio
    AddToSession --> Visual

    Fireworks --> IncrementIndex
    Audio --> IncrementIndex
    Visual --> IncrementIndex

    IncrementIndex --> CheckMore

    CheckMore -->|Yes| LoadNext
    CheckMore -->|No| CalcStars

    LoadNext --> NextLetter
    CalcStars --> Summary
    Summary --> SaveData
```

## Firework Particle Configuration

```mermaid
graph TB
    Firework[Firework Emitter]

    Firework --> Position["Position<br/>x: 400 ± 100<br/>y: 320 ± 100"]
    Firework --> Speed["Speed<br/>min: 200<br/>max: 400"]
    Firework --> Angle["Angle<br/>min: 0°<br/>max: 360°"]
    Firework --> Scale["Scale<br/>start: 1.0<br/>end: 0.0"]
    Firework --> Alpha["Alpha<br/>start: 1.0<br/>end: 0.0"]
    Firework --> Lifespan["Lifespan<br/>1500ms"]
    Firework --> Gravity["Gravity<br/>Y: 200"]
    Firework --> Tint["Tint Colors<br/>Red, Orange, Yellow,<br/>Green, Blue, Purple"]
    Firework --> Quantity["Quantity<br/>50 particles per burst"]

    Position --> Burst[Radial Burst]
    Speed --> Burst
    Angle --> Burst
    Scale --> FadeOut[Fade Out Effect]
    Alpha --> FadeOut
    Lifespan --> FadeOut
    Gravity --> FallDown[Falling Effect]
    Tint --> Colorful[Rainbow Colors]
    Quantity --> Explosive[Explosive Feel]

    Burst --> Display[Particle Display]
    FadeOut --> Display
    FallDown --> Display
    Colorful --> Display
    Explosive --> Display

    style Firework fill:#FF6347
    style Display fill:#FFD700
```

## Star Rating Algorithm

```mermaid
flowchart TD
    Start([Calculate Stars])

    GetData[Get session data<br/>5 letters completed]
    CalcAvgAccuracy[Calculate average accuracy<br/>sum(accuracy) / 5]
    CalcAvgTime[Calculate average time<br/>sum(time) / 5]

    CheckThreeStar{accuracy > 0.85<br/>AND<br/>time < 10000ms?}
    CheckTwoStar{accuracy > 0.70<br/>AND<br/>time < 15000ms?}

    ThreeStar[Return 3 stars<br/>Excellent performance]
    TwoStar[Return 2 stars<br/>Good performance]
    OneStar[Return 1 star<br/>Completed successfully]

    End([Return stars])

    Start --> GetData
    GetData --> CalcAvgAccuracy
    CalcAvgAccuracy --> CalcAvgTime
    CalcAvgTime --> CheckThreeStar

    CheckThreeStar -->|Yes| ThreeStar
    CheckThreeStar -->|No| CheckTwoStar

    CheckTwoStar -->|Yes| TwoStar
    CheckTwoStar -->|No| OneStar

    ThreeStar --> End
    TwoStar --> End
    OneStar --> End

    style ThreeStar fill:#FFD700
    style TwoStar fill:#C0C0C0
    style OneStar fill:#CD7F32
```

## Retry System Flow

```mermaid
flowchart LR
    subgraph Triggers
        RetryButton[Retry Button Click]
        Inactivity[Inactivity > 10s]
        OffPath[Off path > 3s]
    end

    subgraph Actions
        ClearTrail[Clear Trail Graphics]
        ResetDetector[Reset PathDetector<br/>stroke: 0, progress: 0]
        ShowIndicator[Show Start Indicator<br/>Pulsing green circle]
        ResetFlags[Reset isTracing = false<br/>trailPoints = []]
    end

    subgraph Feedback
        PlayAudio[Play encouraging audio<br/>"Let's try again together!"]
        NoNegative[No negative messaging<br/>No penalties]
    end

    subgraph Result
        ReadyToTrace[Ready to trace again<br/>Same letter]
    end

    RetryButton --> ClearTrail
    Inactivity --> ClearTrail
    OffPath --> ClearTrail

    ClearTrail --> ResetDetector
    ResetDetector --> ShowIndicator
    ShowIndicator --> ResetFlags
    ResetFlags --> PlayAudio
    PlayAudio --> NoNegative
    NoNegative --> ReadyToTrace
```

## localStorage Data Structure

```mermaid
classDiagram
    class DanceTraceProgress {
        +Number totalLettersTraced
        +Object lastSession
        +Object lifetimeStats
    }

    class LastSession {
        +String date
        +Array~String~ letters
        +Number stars
        +Array~Object~ completionData
        +Number totalTime
    }

    class CompletionData {
        +String letter
        +Number timeToComplete
        +Number strokeCount
        +Number accuracyScore
        +Boolean completed
    }

    class LifetimeStats {
        +Number lettersTraced
        +Number totalStars
        +Number sessions
        +Number averageStars
        +Array~String~ favoriteLetters
    }

    DanceTraceProgress --> LastSession : contains
    DanceTraceProgress --> LifetimeStats : contains
    LastSession --> CompletionData : array of
```

## Notes

### Celebration Timing Breakdown

**Total Celebration: 4 seconds**
- 0.0s: Completion detected
- 0.0s-0.5s: Play "Great job!" audio
- 0.5s-2.5s: Launch fireworks (5 bursts × 400ms spacing)
- 1.0s-2.0s: Play letter name audio
- 0.5s-3.5s: Flash letter (5 flashes × 400ms)
- 0.0s-3.5s: Celebration jingle plays
- 3.5s-4.0s: Fade out and cleanup
- 4.0s: Begin transition to next letter

### Transition Timing Breakdown

**Total Transition: 1 second**
- 0.0s-0.5s: Fade out current letter/trail (alpha 1 → 0)
- 0.5s: Clear graphics, load next letter data
- 0.5s-1.0s: Fade in new letter (alpha 0 → 1)
- 1.0s: Play intro audio, ready to trace

### Star Rating Philosophy

**1 Star = Success**
- Aurora completed all 5 letters
- Time and accuracy don't matter
- Always celebrate completion

**2 Stars = Good Performance**
- Average accuracy > 70%
- Average time < 15 seconds per letter
- Aurora is improving

**3 Stars = Excellent Performance**
- Average accuracy > 85%
- Average time < 10 seconds per letter
- Aurora has mastered this round

**Never 0 Stars**
- Completing 5 letters always earns at least 1 star
- No failure state in this therapeutic design

### Therapeutic Design Principles

1. **Always Celebrate**: Every completion triggers fireworks and praise
2. **No Failure**: Retry is "try again together", not "you failed"
3. **Progressive Success**: 1 star guaranteed, bonus stars for performance
4. **Positive Language**: "Great job!", "Let's try again!", "You did it!"
5. **Visual Rewards**: Fireworks are the primary dopamine trigger
6. **Gentle Guidance**: Off-path doesn't fail, just pauses
7. **Autonomy**: Aurora can retry anytime, no forced continues
8. **Persistence**: Progress saves for long-term motivation

This architecture ensures every session feels rewarding and therapeutic.
