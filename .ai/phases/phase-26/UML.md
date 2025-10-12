# Phase 26: Word Catch - Target Word Logic - UML

## Target Word System Architecture

```mermaid
graph TB
    WordCatchScene[WordCatchScene]

    WordCatchScene --> TargetSystem[Target Word System]
    WordCatchScene --> ValidationSystem[Validation System]
    WordCatchScene --> FeedbackSystem[Feedback System]
    WordCatchScene --> RoundSystem[Round Management System]

    TargetSystem --> TargetSelector[Target Word Selector]
    TargetSystem --> CalloutPlayer[Audio Callout Player]
    TargetSystem --> TargetDisplay[Target Display UI]

    ValidationSystem --> CatchValidator[Catch Validator]
    ValidationSystem --> WordComparator[Word Comparator]

    FeedbackSystem --> CorrectFeedback[Correct Catch Feedback]
    FeedbackSystem --> IncorrectFeedback[Incorrect Catch Feedback]
    FeedbackSystem --> CelebrationEffects[Celebration Effects]
    FeedbackSystem --> GentleOops[Gentle Oops Feedback]

    RoundSystem --> ProgressTracker[Progress Tracker]
    RoundSystem --> RoundCompletion[Round Completion Handler]
    RoundSystem --> RoundTransition[Round Transition Manager]

    style WordCatchScene fill:#90EE90
    style TargetSystem fill:#FFD700
    style ValidationSystem fill:#FF69B4
    style FeedbackSystem fill:#87CEEB
    style RoundSystem fill:#DDA0DD
```

## Class Diagram

```mermaid
classDiagram
    class WordCatchScene {
        +currentTarget: Object
        +lastTargetId: string
        +targetPool: Array
        +currentRound: number
        +correctCatches: number
        +incorrectCatches: number
        +wordsPerRound: number
        +targetDisplay: TargetDisplayUI
        +progressDisplay: ProgressUI
        +create()
        +startNewRound()
        +selectAndAnnounceNextTarget()
        +handleWordCatch(character, word)
    }

    class TargetWordSelector {
        +lastTargetId: string
        +targetHistory: Array
        +selectTargetWord()
        +avoidRecentTargets(word)
        +getRandomTargetFromPool()
        +ensureVariety()
    }

    class AudioCalloutManager {
        +scene: Phaser.Scene
        +currentCallout: Phaser.Sound
        +announceTargetWord(targetWord)
        +playCallout(audioKey)
        +waitForCalloutComplete(callback)
        +handleMissingAudio()
    }

    class WordPoolGenerator {
        +targetWord: Object
        +poolSize: number
        +targetRatio: number
        +generateWordPool(target, size)
        +selectDistractors(count, exclude)
        +shufflePool(pool)
        +ensureTargetFrequency()
    }

    class CatchValidator {
        +currentTarget: Object
        +validateCatch(caughtWord)
        +compareWords(word1, word2)
        +isCorrectCatch(word)
        +logValidation(result)
    }

    class CorrectCatchHandler {
        +scene: Phaser.Scene
        +celebrateCorrectCatch(word)
        +createCelebrationParticles(x, y)
        +playCelebrationAudio()
        +showEncouragementText(x, y)
        +incrementScore()
        +updateProgress()
        +checkRoundComplete()
    }

    class IncorrectCatchHandler {
        +scene: Phaser.Scene
        +handleIncorrectCatch(word)
        +createNeutralParticles(x, y)
        +playGentleOops()
        +showTryAgainText(x, y)
        +trackIncorrectCatch()
        +maintainTargetWord()
    }

    class RoundProgressTracker {
        +correctCatches: number
        +wordsPerRound: number
        +progressDisplay: UI
        +incrementProgress()
        +updateDisplay()
        +isRoundComplete()
        +resetProgress()
    }

    class RoundCompletionHandler {
        +scene: Phaser.Scene
        +currentRound: number
        +maxRounds: number
        +completeRound()
        +playRoundCelebration()
        +showRoundSummary()
        +transitionToNextRound()
        +endGame()
    }

    class TargetDisplayUI {
        +targetPanel: Phaser.Rectangle
        +targetLabel: Phaser.Text
        +targetText: Phaser.Text
        +create()
        +updateTarget(word)
        +animatePulse()
        +show()
        +hide()
    }

    WordCatchScene --> TargetWordSelector
    WordCatchScene --> AudioCalloutManager
    WordCatchScene --> WordPoolGenerator
    WordCatchScene --> CatchValidator
    WordCatchScene --> CorrectCatchHandler
    WordCatchScene --> IncorrectCatchHandler
    WordCatchScene --> RoundProgressTracker
    WordCatchScene --> RoundCompletionHandler
    WordCatchScene --> TargetDisplayUI
```

## Target Word Selection Sequence Diagram

```mermaid
sequenceDiagram
    participant Scene as WordCatchScene
    participant Selector as TargetWordSelector
    participant Content as ContentProvider
    participant Callout as AudioCalloutManager
    participant Display as TargetDisplayUI
    participant Pool as WordPoolGenerator
    participant Spawner as WordSpawner

    Scene->>Selector: selectTargetWord()
    Selector->>Content: getRandomWord()
    Content-->>Selector: Return word
    Selector->>Selector: Check not same as last
    Selector-->>Scene: Return target word

    Scene->>Display: updateTarget(targetWord)
    Display->>Display: Set text to target word
    Display->>Display: Animate pulse

    Scene->>Callout: announceTargetWord(targetWord)
    Callout->>Callout: Play "Catch the word [target]!"
    Callout->>Scene: Wait for audio complete

    Scene->>Pool: generateWordPool(target, 20)
    Pool->>Content: Get distractor words
    Pool->>Pool: Mix target + distractors (35% target)
    Pool->>Pool: Shuffle pool
    Pool-->>Scene: Return word pool

    Scene->>Spawner: startSpawningWords(pool)
    Spawner->>Spawner: Begin spawning from pool
```

## Catch Validation Flow Diagram

```mermaid
graph TD
    CatchEvent[Word Caught] --> Validate{Is word<br/>the target?}

    Validate -->|Yes - Correct| CorrectPath[Correct Catch Path]
    Validate -->|No - Incorrect| IncorrectPath[Incorrect Catch Path]

    CorrectPath --> CelebParticles[Celebration particles<br/>bright, many]
    CelebParticles --> CheerAudio[Play cheer sound<br/>enthusiastic]
    CheerAudio --> GreatJob[Show 'Great job!' text<br/>green color]
    GreatJob --> IncrementScore[Add 10 points to score]
    IncrementScore --> UpdateProgress[Update progress<br/>X / 10]
    UpdateProgress --> CheckComplete{10 catches<br/>reached?}

    CheckComplete -->|Yes| RoundComplete[Complete round]
    CheckComplete -->|No| NextTarget[Select next target]

    IncorrectPath --> NeutralParticles[Neutral particles<br/>subtle, few]
    NeutralParticles --> OopsAudio[Play gentle 'oops'<br/>friendly, quiet]
    OopsAudio --> TryAgain[Show 'Try again!' text<br/>orange color]
    TryAgain --> NoScorePenalty[No score change]
    NoScorePenalty --> KeepTarget[Keep same target word]
    KeepTarget --> Continue[Continue gameplay]

    NextTarget --> Continue
    RoundComplete --> Celebration[Big celebration]

    style CorrectPath fill:#90EE90
    style IncorrectPath fill:#FFE4B5
    style RoundComplete fill:#FFD700
```

## Feedback System State Diagram

```mermaid
stateDiagram-v2
    [*] --> WaitingForCatch: Target word active
    WaitingForCatch --> Validating: Word caught
    Validating --> CorrectCatch: Word == Target
    Validating --> IncorrectCatch: Word != Target

    state CorrectCatch {
        [*] --> PlayCelebration
        PlayCelebration --> ShowParticles
        ShowParticles --> PlayAudio
        PlayAudio --> UpdateScore
        UpdateScore --> UpdateProgress
        UpdateProgress --> [*]
    }

    state IncorrectCatch {
        [*] --> PlayGentle
        PlayGentle --> ShowNeutral
        ShowNeutral --> PlayOops
        PlayOops --> NoScorePenalty
        NoScorePenalty --> [*]
    }

    CorrectCatch --> CheckRoundComplete
    IncorrectCatch --> WaitingForCatch

    CheckRoundComplete --> RoundComplete: 10 correct
    CheckRoundComplete --> NextTarget: < 10 correct

    NextTarget --> WaitingForCatch
    RoundComplete --> [*]

    note right of CorrectCatch
        Enthusiastic, rewarding
        Bright particles
        Cheer sounds
    end note

    note right of IncorrectCatch
        Gentle, non-punitive
        No harsh feedback
        Keep same target
    end note
```

## Word Pool Generation Diagram

```mermaid
graph LR
    Start[Generate Word Pool] --> SelectTarget[Target word: 'cat']
    SelectTarget --> CalcTarget[Calculate target count<br/>20 × 0.35 = 7]

    CalcTarget --> AddTarget[Add 'cat' × 7 times]
    AddTarget --> CalcDist[Calculate distractor count<br/>20 - 7 = 13]

    CalcDist --> SelectDist[Select 13 random distractors]
    SelectDist --> Pool[Pool: 7×'cat', 13 others]

    Pool --> Shuffle[Shuffle pool randomly]
    Shuffle --> Ready[Pool ready for spawning]

    style SelectTarget fill:#FFD700
    style Pool fill:#87CEEB
    style Ready fill:#90EE90
```

## UI Layout Diagram

```mermaid
graph TB
    subgraph Screen Top
        TargetDisplay[Target Display<br/>Position: 400, 50<br/>Size: 300×80<br/>Shows: 'Catch: cat']
        ProgressDisplay[Progress Display<br/>Position: 700, 50<br/>Shows: '5 / 10']
    end

    subgraph Gameplay Area
        Character[Character<br/>Position: 400, 500]
        Word1[Falling Word 'cat']
        Word2[Falling Word 'dog']
        Word3[Falling Word 'run']
    end

    subgraph Feedback Area
        Particles[Particle Effects<br/>at catch position]
        FeedbackText['Great job!'<br/>or 'Try again!']
    end

    TargetDisplay -.visible during gameplay.-> Character
    ProgressDisplay -.updates on correct catch.-> Character
    Word1 -.falls toward.-> Character
    Word2 -.falls toward.-> Character
    Word3 -.falls toward.-> Character
    Particles -.spawns at.-> Word1
    FeedbackText -.shows near.-> Word1

    style TargetDisplay fill:#FFD700
    style ProgressDisplay fill:#DDA0DD
    style Character fill:#87CEEB
    style Particles fill:#FF69B4
```

## Round Management Flow

```mermaid
graph TD
    StartGame[Start Game] --> InitRound[Round 1 - Initialize]
    InitRound --> SelectTarget[Select first target]
    SelectTarget --> Announce[Announce target]
    Announce --> Spawn[Spawn words]

    Spawn --> Gameplay[Gameplay Loop]
    Gameplay --> CatchWord[Word Caught]
    CatchWord --> Validate{Correct?}

    Validate -->|Yes| Increment[Increment progress]
    Validate -->|No| Continue[Continue same target]

    Increment --> CheckCount{Progress<br/>= 10?}
    CheckCount -->|No| Gameplay
    CheckCount -->|Yes| RoundEnd[Round Complete!]

    RoundEnd --> Celebrate[Celebration animation]
    Celebrate --> CheckRounds{More<br/>rounds?}

    CheckRounds -->|Yes| NextRound[Start Round 2/3]
    CheckRounds -->|No| EndGame[Game Complete!]

    NextRound --> SelectTarget
    Continue --> Gameplay

    style InitRound fill:#90EE90
    style RoundEnd fill:#FFD700
    style EndGame fill:#FF69B4
```

## Correct vs. Incorrect Feedback Comparison

```mermaid
graph TB
    subgraph Correct Catch Feedback
        CP[Celebration Particles<br/>12-20 particles<br/>Gold/Yellow/Green<br/>Large, bright]
        CA[Cheer Audio<br/>Enthusiastic<br/>Volume: 0.8<br/>Happy sounds]
        CT[Success Text<br/>'Great job!'<br/>Green color<br/>Large font]
        CS[Score +10<br/>Progress +1<br/>New target selected]
    end

    subgraph Incorrect Catch Feedback
        NP[Neutral Particles<br/>6-8 particles<br/>Orange/Gray<br/>Small, subtle]
        GA[Gentle Audio<br/>'Oops'<br/>Volume: 0.6<br/>Friendly, brief]
        TT[Try Again Text<br/>'Try again!'<br/>Orange color<br/>Medium font]
        NS[No score change<br/>No progress change<br/>Same target kept]
    end

    style CP fill:#90EE90
    style CA fill:#90EE90
    style CT fill:#90EE90
    style CS fill:#90EE90

    style NP fill:#FFE4B5
    style GA fill:#FFE4B5
    style TT fill:#FFE4B5
    style NS fill:#FFE4B5
```

## ADHD-Friendly Feedback Timeline

```mermaid
gantt
    title Feedback Timeline Comparison
    dateFormat X
    axisFormat %L ms

    section Correct Catch
    Collision detected: milestone, 0, 0
    Celebration particles: 0, 600
    Cheer audio plays: 0, 800
    'Great job!' text: 0, 1000
    Score updates: 100, 100
    Progress updates: 100, 100
    New target delay: 1500, 1500

    section Incorrect Catch
    Collision detected: milestone, 0, 0
    Neutral particles: 0, 400
    Gentle 'oops': 0, 600
    'Try again!' text: 0, 800
    Keep same target: 0, 0
    Continue immediately: 800, 800
```

## Target Word Callout Sequence

```mermaid
sequenceDiagram
    actor Aurora as Aurora
    participant Scene as WordCatchScene
    participant Audio as AudioManager
    participant Display as TargetDisplay
    participant Spawner as WordSpawner

    Scene->>Scene: Select target: 'cat'
    Scene->>Display: Show target word
    Display->>Aurora: Visual: 'Catch: cat'

    Scene->>Audio: Play callout audio
    Audio->>Aurora: Audio: "Catch the word cat!"

    Audio->>Scene: Audio complete event
    Scene->>Scene: Wait 500ms pause
    Scene->>Spawner: Start spawning words

    Spawner->>Aurora: Words begin falling
    Aurora->>Scene: Move character to catch
```

## Round Progress Tracking

```mermaid
graph LR
    subgraph Progress Tracking
        Start[Round Start<br/>Progress: 0/10]
        Catch1[Catch 1<br/>Progress: 1/10]
        Catch2[Catch 2<br/>Progress: 2/10]
        CatchN[Catch N<br/>Progress: N/10]
        Catch10[Catch 10<br/>Progress: 10/10]
        Complete[Round Complete!]

        Start --> Catch1
        Catch1 --> Catch2
        Catch2 --> CatchN
        CatchN --> Catch10
        Catch10 --> Complete
    end

    IncorrectCatch[Incorrect Catch<br/>No progress change]
    IncorrectCatch -.Does not increment.-> CatchN

    style Start fill:#FFE4B5
    style Complete fill:#90EE90
    style IncorrectCatch fill:#FFA500
```

## Edge Case Handling

```mermaid
graph TD
    Edge[Edge Case Detected] --> Case1{Only 1 word<br/>in database?}
    Case1 -->|Yes| UseOne[Use that word as target]
    Case1 -->|No| Case2{Missing callout<br/>audio?}

    Case2 -->|Yes| Visual[Show visual target only]
    Case2 -->|No| Case3{Rapid correct<br/>catches?}

    Case3 -->|Yes| Queue[Queue target changes]
    Case3 -->|No| Case4{Round complete<br/>audio playing?}

    Case4 -->|Yes| FinishAudio[Let audio complete]
    Case4 -->|No| Case5{10th catch while<br/>multiple words?}

    Case5 -->|Yes| StopSpawn[Stop spawning immediately]
    Case5 -->|No| Normal[Normal handling]

    UseOne --> Continue[Continue game]
    Visual --> Continue
    Queue --> Continue
    FinishAudio --> Continue
    StopSpawn --> Continue
    Normal --> Continue

    style Edge fill:#FFA500
    style Continue fill:#90EE90
```

## Integration with Phase 25 Collision System

```mermaid
graph TB
    subgraph Phase 25 Collision
        Collision[Collision Detection]
        Particles[Basic Particles]
        Audio[Word Audio]
        Tracking[Catch Tracking]
    end

    subgraph Phase 26 Target Logic
        Validation[Validation System]
        CorrectFeedback[Correct Feedback]
        IncorrectFeedback[Incorrect Feedback]
        RoundMgmt[Round Management]
    end

    Collision --> Validation
    Validation --> CorrectFeedback
    Validation --> IncorrectFeedback
    CorrectFeedback --> Particles
    IncorrectFeedback --> Particles
    CorrectFeedback --> Audio
    IncorrectFeedback --> Audio
    Validation --> Tracking
    CorrectFeedback --> RoundMgmt

    style Collision fill:#87CEEB
    style Validation fill:#FFD700
    style CorrectFeedback fill:#90EE90
    style IncorrectFeedback fill:#FFE4B5
```

## Notes

### Why This Architecture?

**Target Word System**
- Random selection with variety ensures engagement
- Callout audio provides clear instruction
- Visual display reduces memory load (ADHD-friendly)
- Word pool ensures balanced target frequency

**Validation System**
- Simple boolean validation (correct vs. incorrect)
- Immediate feedback maintains cause-effect clarity
- Separate handling for correct/incorrect enables different feedback
- Logging for debugging and analytics

**ADHD-Friendly Feedback**
- Correct catch is celebrated enthusiastically (dopamine reward)
- Incorrect catch is gentle and non-punitive (reduces anxiety)
- No harsh sounds or red X marks (avoids triggering)
- Orange neutral color instead of punishing red
- Game flow continues uninterrupted on incorrect catch

**Round Management**
- 10 words per round is achievable goal
- Progress tracking provides motivation
- Round completion is celebration moment
- Multiple rounds extend engagement
- Clear end point prevents endless play

**UI Design**
- Target always visible (reduces memory load)
- Progress always visible (motivates completion)
- Clear visual hierarchy (important info at top)
- Non-intrusive positioning (doesn't block gameplay)

### What This Phase Proves

1. **Educational Gameplay**: Word recognition mechanic works
2. **ADHD-Friendly Design**: Feedback is appropriate for target age
3. **Motivation System**: Progress and celebration maintain engagement
4. **Game Logic**: Validation, rounds, completion all correct
5. **Foundation Complete**: Word Catch core gameplay ready

### Comparison to Letter Pop

**Similarities:**
- Target selection (target letter vs. target word)
- Correct/incorrect validation
- Celebration on success
- Round-based progression

**Differences:**
- Word Catch: catch falling objects vs. click bubbles
- Word Catch: character movement vs. pointer input
- Word Catch: sight words vs. single letters
- Word Catch: more forgiving (generous hitbox)
- Word Catch: gentler feedback (ADHD-optimized)

### ADHD Design Principles Applied

1. **Clear Goals**: Target word always visible
2. **Immediate Feedback**: < 50ms validation and response
3. **Positive Reinforcement**: Celebrate success enthusiastically
4. **Non-Punitive**: Gentle handling of mistakes
5. **Progress Visible**: Always know how close to completion
6. **Achievable Chunks**: 10 words is manageable goal
7. **Celebration Moments**: Round completion provides dopamine
8. **No Time Pressure**: Player controls pacing
