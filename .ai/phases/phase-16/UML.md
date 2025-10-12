# Phase 16: Encouragement Audio System - UML

## System Architecture Diagram

```mermaid
graph TB
    LetterPop[LetterPopScene]
    EncQueue[EncouragementQueue]
    AudioSystem[Phaser Audio System]
    AudioFiles[10 Encouragement Files]
    Preload[PreloadScene]

    Preload -->|Loads| AudioFiles
    AudioFiles -->|Available to| AudioSystem
    LetterPop --> EncQueue
    EncQueue -->|Plays via| AudioSystem
    LetterPop -->|Triggers| EncQueue

    style LetterPop fill:#90EE90
    style EncQueue fill:#FFB6C1
    style AudioFiles fill:#87CEEB
```

## Encouragement Audio Sequence Diagram

```mermaid
sequenceDiagram
    actor Player
    participant Scene as LetterPopScene
    participant Queue as EncouragementQueue
    participant Audio as Audio System
    participant Particles as Particle Effects

    Player->>Scene: Click correct bubble
    Scene->>Scene: onCorrectAnswer()

    par Immediate Visual Feedback
        Scene->>Particles: Trigger burst at bubble position
        Particles->>Particles: Animate particles (1500ms)
    end

    Scene->>Audio: Play 'correctSound'
    Note over Audio: 200-300ms duration

    Scene->>Scene: Wait 400ms delay
    Note over Scene: Delay allows correct<br/>sound to be heard

    Scene->>Queue: Call playNext()
    Queue->>Queue: Get next encouragement key
    Queue->>Queue: Update lastPlayed
    Queue->>Queue: Remove from queue
    Queue->>Audio: Play encouragement audio
    Note over Audio: e.g., "Great job!"<br/>1-2 seconds

    Audio->>Audio: Encouragement plays
    Note over Audio: Player hears praise

    par Concurrent Actions
        Scene->>Scene: Bubble tween (300ms)
        Scene->>Scene: Advance to next letter (1000ms delay)
    end

    Scene->>Scene: Display next letter
    Note over Particles: Particles continue<br/>fading independently
```

## EncouragementQueue Class Diagram

```mermaid
classDiagram
    class EncouragementQueue {
        -Scene scene
        -Number totalEncouragements
        -Array~String~ queue
        -String lastPlayed
        -Array~String~ playHistory
        +constructor(scene)
        +refillQueue()
        +getNext() String
        +playNext() String
        +getPlayHistory() Array
        +checkForImmediateRepetition()
    }

    class LetterPopScene {
        -EncouragementQueue encouragementQueue
        -ParticleEmitter particleEmitter
        -Number currentLetterIndex
        +create()
        +onCorrectAnswer(bubble)
        +playCorrectAudioSequence()
        +advanceToNextLetter()
    }

    class PhaserAudioSystem {
        <<Phaser Built-in>>
        +play(key, config) Sound
        +get(key) Sound
    }

    LetterPopScene --> EncouragementQueue : manages
    EncouragementQueue --> PhaserAudioSystem : uses
```

## Queue Refill Algorithm Flow

```mermaid
flowchart TD
    Start([Queue Empty or<br/>Constructor Called]) --> CreateArray[Create array of all<br/>encouragement keys 1-10]

    CreateArray --> Shuffle[Shuffle array using<br/>Phaser.Utils.Array.Shuffle]

    Shuffle --> CheckLast{lastPlayed<br/>exists?}

    CheckLast -->|No| Assign[queue = shuffled array]
    CheckLast -->|Yes| CheckFirst{queue first ==<br/>lastPlayed?}

    CheckFirst -->|No| Assign
    CheckFirst -->|Yes| Swap[Swap first and last<br/>elements in queue]

    Swap --> Assign
    Assign --> Ready([Queue Ready])

    style Start fill:#90EE90
    style Shuffle fill:#FFB6C1
    style Swap fill:#FFA500
    style Ready fill:#87CEEB
```

## Get Next Encouragement Flow

```mermaid
flowchart TD
    Start([getNext Called]) --> CheckEmpty{queue.length<br/>== 0?}

    CheckEmpty -->|Yes| Refill[Call refillQueue]
    CheckEmpty -->|No| Pop[Pop first item<br/>from queue]

    Refill --> Pop
    Pop --> Store[lastPlayed = item]
    Store --> AddHistory[Add to playHistory]

    AddHistory --> TrimHistory{playHistory.length<br/>> 20?}
    TrimHistory -->|Yes| Trim[Remove oldest entry]
    TrimHistory -->|No| Return[Return item key]

    Trim --> Return
    Return --> End([Encouragement Key])

    style Start fill:#90EE90
    style Refill fill:#FFB6C1
    style Return fill:#87CEEB
```

## Audio Timing Coordination Diagram

```mermaid
gantt
    title Audio Playback Timeline
    dateFormat X
    axisFormat %L ms

    section Immediate
    Correct Sound Plays       :0, 300ms

    section Delayed
    Delay Period              :300, 400ms
    Encouragement Plays       :400, 1800ms

    section Visual
    Particle Burst            :0, 1500ms
    Bubble Tween              :0, 300ms
    Next Letter Delay         :800, 1800ms
    Next Letter Displays      :1800, 1800ms
```

## Audio Loading Sequence Diagram

```mermaid
sequenceDiagram
    participant Boot as BootScene
    participant Preload as PreloadScene
    participant Loader as Asset Loader
    participant Cache as Audio Cache
    participant Scene as LetterPopScene

    Boot->>Preload: Start PreloadScene
    Preload->>Preload: preload() called

    loop For each encouragement (1 to 10)
        Preload->>Loader: load.audio('encouragement-N', path)
        Loader->>Loader: Fetch audio file
        Loader->>Loader: Decode audio data
        Loader->>Cache: Store audio in cache
    end

    Loader->>Preload: Loading complete
    Preload->>Preload: create() called
    Preload->>Scene: Start LetterPopScene

    Scene->>Scene: create() called
    Scene->>Scene: new EncouragementQueue(this)
    Note over Scene: Queue ready to play<br/>from audio cache
```

## Queue State Machine

```mermaid
stateDiagram-v2
    [*] --> Initializing: Create EncouragementQueue

    Initializing --> Filled: refillQueue() called
    Filled --> Ready: Queue has 10 items

    Ready --> Selecting: playNext() called
    Selecting --> CheckingEmpty: Check queue length

    CheckingEmpty --> Refilling: length == 0
    CheckingEmpty --> Popping: length > 0

    Refilling --> Filled: New shuffled queue created
    Filled --> Popping: Continue

    Popping --> Playing: Remove first item, update lastPlayed
    Playing --> AudioPlaying: scene.sound.play(key)

    AudioPlaying --> Ready: Audio complete, queue has items
    AudioPlaying --> Refilling: Audio complete, queue empty

    note right of Refilling
        Shuffle algorithm ensures
        lastPlayed is not first
        in new queue
    end note

    note right of Playing
        Add to playHistory
        for debugging
    end note
```

## Audio Event Timing Flow (Advanced)

```mermaid
sequenceDiagram
    participant Scene as LetterPopScene
    participant CorrectSnd as Correct Sound
    participant LetterSnd as Letter Audio
    participant EncSnd as Encouragement

    Scene->>CorrectSnd: Play 'correctSound'
    activate CorrectSnd

    CorrectSnd->>CorrectSnd: Playing...
    Note over CorrectSnd: ~300ms

    CorrectSnd->>Scene: 'complete' event
    deactivate CorrectSnd

    alt Letter Audio Exists
        Scene->>LetterSnd: Play letter audio (e.g., 'A.mp3')
        activate LetterSnd

        LetterSnd->>LetterSnd: Playing...
        Note over LetterSnd: ~500-1000ms

        LetterSnd->>Scene: 'complete' event
        deactivate LetterSnd

        Scene->>EncSnd: Play encouragement
        activate EncSnd
    else No Letter Audio
        Scene->>EncSnd: Play encouragement directly
        activate EncSnd
    end

    EncSnd->>EncSnd: Playing...
    Note over EncSnd: ~1000-2000ms

    EncSnd->>Scene: 'complete' event
    deactivate EncSnd
```

## Simple Timing Flow (Delay-Based)

```mermaid
flowchart LR
    Click[Correct Click] --> Immediate[Immediate Actions]

    Immediate --> CorrectSnd[Play Correct Sound]
    Immediate --> Particles[Trigger Particles]
    Immediate --> Tween[Bubble Tween]

    CorrectSnd --> Wait[Wait 400ms]
    Wait --> PlayEnc[Play Encouragement]

    Particles --> Continue[Continue Animating]
    Tween --> Destroy[Destroy Bubble 300ms]

    Destroy --> NextDelay[Wait 700ms more]
    NextDelay --> NextLetter[Display Next Letter]

    PlayEnc --> Done[Encouragement Completes]
    Continue --> Done

    style Click fill:#90EE90
    style Immediate fill:#FFB6C1
    style PlayEnc fill:#87CEEB
```

## Variety Distribution Diagram

```mermaid
graph TB
    subgraph "Round 1 (Queue 1)"
        Q1["Queue: [7,2,9,1,5,3,8,4,6,10]<br/>Shuffled order"]
        Play1["Answer 1: Play 7<br/>Queue: [2,9,1,5,3,8,4,6,10]"]
        Play2["Answer 2: Play 2<br/>Queue: [9,1,5,3,8,4,6,10]"]
        Play3["Answer 3-10: Play remaining<br/>Queue becomes empty"]

        Q1 --> Play1
        Play1 --> Play2
        Play2 --> Play3
    end

    subgraph "Round 2 (Queue 2)"
        Refill["Queue Empty: Refill<br/>New shuffle: [4,1,8,10,2,6,3,9,5,7]"]
        Check["Check: first != lastPlayed?<br/>4 != 10? Yes, OK"]
        Play4["Answer 1: Play 4<br/>Continue..."]

        Play3 --> Refill
        Refill --> Check
        Check --> Play4
    end

    style Q1 fill:#90EE90
    style Refill fill:#FFB6C1
    style Check fill:#FFA500
```

## Anti-Repetition Logic

```mermaid
flowchart TD
    Start([refillQueue Called]) --> Shuffle[Shuffle all 10<br/>encouragements]

    Shuffle --> HasLast{lastPlayed<br/>exists?}

    HasLast -->|No First Time| Done[Queue Ready]
    HasLast -->|Yes| CheckMatch{queue first ==<br/>lastPlayed?}

    CheckMatch -->|No Different| Done
    CheckMatch -->|Yes Same| SwapFirst[first = queue.pop]

    SwapFirst --> SwapLast[queue.unshift last item]
    SwapLast --> PushFirst[queue.push first item]
    PushFirst --> Done

    Done --> Example["Example:<br/>lastPlayed: 7<br/>queue was: [7,2,3...]<br/>queue now: [2,3,...,7]"]

    style Start fill:#90EE90
    style CheckMatch fill:#FFB6C1
    style Done fill:#87CEEB
    style Example fill:#FFF8DC
```

## Play History Tracking

```mermaid
graph LR
    subgraph "Play History Array max 20"
        H1[Index 0:<br/>encouragement-5]
        H2[Index 1:<br/>encouragement-2]
        H3[Index 2:<br/>encouragement-8]
        Dots[...]
        H19[Index 19:<br/>encouragement-3]
    end

    NewPlay[New Play:<br/>encouragement-7] --> AddEnd[Add to end]
    AddEnd --> CheckSize{Size > 20?}
    CheckSize -->|Yes| RemoveFirst[Remove index 0]
    CheckSize -->|No| Keep[Keep all]

    RemoveFirst --> Shifted["Array shifts:<br/>Old index 1 → 0<br/>New play at index 19"]
    Keep --> Added["New play added<br/>at next index"]

    style NewPlay fill:#90EE90
    style AddEnd fill:#FFB6C1
```

## Integration with Particle Effects

```mermaid
graph TB
    CorrectClick[Correct Bubble Clicked] --> Split[Split into Parallel Paths]

    Split --> Visual[Visual Path]
    Split --> Audio[Audio Path]

    Visual --> Particles[Trigger Particle Burst]
    Visual --> BubbleTween[Tween Bubble Scale/Alpha]

    Audio --> CorrectSound[Play Correct Sound 0ms]
    Audio --> EncDelay[Delay 400ms]
    EncDelay --> EncPlay[Play Encouragement]

    Particles --> ParticleContinue[Particles animate<br/>for 1500ms]
    BubbleTween --> BubbleDestroy[Bubble destroyed<br/>at 300ms]

    BubbleDestroy --> NextDelay[Delay 700ms more]
    NextDelay --> NextLetter[Display Next Letter<br/>at 1000ms total]

    ParticleContinue --> StillAnimating[Particles still going<br/>non-blocking]
    EncPlay --> EncComplete[Encouragement completes<br/>~1500ms]

    NextLetter --> GameContinues[Game Continues]
    StillAnimating --> GameContinues
    EncComplete --> GameContinues

    style CorrectClick fill:#90EE90
    style Visual fill:#FFB6C1
    style Audio fill:#87CEEB
```

## Volume and Audio Mixing

```mermaid
graph TB
    subgraph "Audio Channels"
        SFX[SFX Channel]
        Voice[Voice Channel]
    end

    CorrectSnd[Correct Sound<br/>Volume: 0.7] --> SFX
    EncAudio[Encouragement<br/>Volume: 1.0] --> Voice
    ParticleWhoosh[Particle Whoosh optional<br/>Volume: 0.5] --> SFX

    SFX --> Mixer[Audio Mixer]
    Voice --> Mixer

    Mixer --> Output[Speaker Output]

    Note1[Note: Encouragement at<br/>full volume for clarity]
    Note2[Note: SFX quieter to<br/>not overpower voice]

    style EncAudio fill:#FFD700
    style Mixer fill:#87CEEB
```

## Testing Flow Diagram

```mermaid
flowchart TD
    Start([Start Testing]) --> LoadGame[Load Game]
    LoadGame --> CheckConsole{Console Errors?}

    CheckConsole -->|Yes| FixLoading[Fix audio loading issues]
    CheckConsole -->|No| PlayRound[Play Round 1]

    FixLoading --> LoadGame

    PlayRound --> Track1[Track encouragements<br/>played in Round 1]
    Track1 --> Verify1{All different in<br/>same round?}

    Verify1 -->|No| DebugQueue[Debug queue logic]
    Verify1 -->|Yes| PlayRound2[Play Round 2]

    DebugQueue --> FixQueue[Fix repetition issues]
    FixQueue --> PlayRound

    PlayRound2 --> Track2[Track encouragements<br/>in Round 2]
    Track2 --> Verify2{Variety maintained?}

    Verify2 -->|No| DebugQueue
    Verify2 -->|Yes| TestTiming[Test Audio Timing]

    TestTiming --> VerifyTiming{Timing feels<br/>natural?}

    VerifyTiming -->|No| AdjustDelay[Adjust delay values]
    VerifyTiming -->|Yes| TestRapid[Test Rapid Answers]

    AdjustDelay --> TestTiming

    TestRapid --> VerifyRapid{All audio plays<br/>correctly?}

    VerifyRapid -->|No| FixOverlap[Fix audio overlap]
    VerifyRapid -->|Yes| Success[Testing Complete]

    FixOverlap --> TestRapid

    style Start fill:#90EE90
    style Success fill:#87CEEB
    style DebugQueue fill:#FF6B6B
```

## Data Structure Visualization

```mermaid
classDiagram
    class EncouragementQueue {
        scene: LetterPopScene
        totalEncouragements: 10
        queue: Array
        lastPlayed: String
        playHistory: Array
    }

    class QueueExample {
        <<State Example>>
        queue: ["enc-3", "enc-7", "enc-1", "enc-9", "enc-5"]
        lastPlayed: "enc-2"
        playHistory: ["enc-8", "enc-4", "enc-2"]
    }

    class AfterPlayNext {
        <<State After playNext>>
        queue: ["enc-7", "enc-1", "enc-9", "enc-5"]
        lastPlayed: "enc-3"
        playHistory: ["enc-8", "enc-4", "enc-2", "enc-3"]
    }

    QueueExample --|> AfterPlayNext : playNext() called
```

## Notes

### Why This Architecture?

**Queue System Benefits**
- Ensures all 10 encouragements are used before repeating
- Shuffle provides randomness within fairness
- Anti-repetition logic prevents back-to-back same encouragement
- Simple and predictable behavior

**Delayed Encouragement**
- 400ms delay allows correct sound to be heard first
- Prevents audio soup (too many sounds at once)
- Creates natural, non-rushed feeling
- Player can process each audio element

**Play History Tracking**
- Useful for debugging and testing
- Can verify variety over many plays
- Helps detect repetition bugs
- Limited to 20 entries to prevent memory bloat

**Parallel Visual/Audio**
- Particles trigger immediately (visual priority)
- Audio follows natural sequence
- Particle animation doesn't wait for audio
- Creates rich, multi-sensory experience

### Performance Considerations

**Memory Management**
- All 10 audio files loaded once at startup
- Cached in Phaser audio system
- Queue only stores keys (strings), not audio data
- Minimal memory overhead for queue system

**Audio Decoding**
- Audio pre-decoded during loading screen
- No runtime decoding lag
- Playback is instant when triggered
- Important for responsive feedback

### Design Decisions

**Fixed Delay vs Event Listeners**
- Simple 400ms delay is reliable and predictable
- Event listeners more complex but more accurate
- For this use case, delay is sufficient
- Can switch to events if letter audio added later

**Queue Size = Total Encouragements**
- Each round could use all 10 encouragements
- Ensures maximum variety within round
- Refills automatically for next round
- Fair distribution of all phrases

**No Negative Encouragement**
- Incorrect answers get no verbal feedback
- Positive reinforcement only
- Builds confidence, doesn't punish
- ADHD-friendly approach

### What This Phase Achieves

1. **Verbal Positive Reinforcement**: Aurora hears praise on every correct answer
2. **Variety**: 10 different phrases prevent habituation
3. **Natural Timing**: Audio flows smoothly without overlap
4. **Emotional Support**: Creates encouraging, safe environment
5. **Engagement**: Varied audio maintains interest over time
6. **Confidence Building**: Consistent praise builds self-esteem
7. **ADHD Optimization**: Frequent, varied rewards maintain dopamine
8. **Personalization Ready**: System supports custom user audio

This phase transforms the game from purely visual feedback into a warm, emotionally supportive experience that makes Aurora feel celebrated and encouraged throughout her learning journey.
