# Phase 25: Word Catch - Collision Detection - UML

## Collision Detection System Architecture

```mermaid
graph TB
    WordCatchScene[WordCatchScene]

    WordCatchScene --> CollisionSystem[Collision Detection System]
    WordCatchScene --> ParticleSystem[Particle System]
    WordCatchScene --> AudioSystem[Audio System]
    WordCatchScene --> TrackingSystem[Catch Tracking System]

    CollisionSystem --> CharacterHitbox[Character Hitbox]
    CollisionSystem --> WordHitbox[Word Hitbox]
    CollisionSystem --> OverlapDetection[Phaser Overlap Detection]

    ParticleSystem --> CatchParticles[Catch Particle Emitter]
    ParticleSystem --> ParticleCleanup[Particle Cleanup Manager]

    AudioSystem --> WordAudio[Word Audio Player]
    AudioSystem --> AudioQueue[Audio Queue Manager]

    TrackingSystem --> CatchLogger[Catch Event Logger]
    TrackingSystem --> CatchHistory[Catch History Array]

    style WordCatchScene fill:#90EE90
    style CollisionSystem fill:#FFD700
    style ParticleSystem fill:#FF69B4
    style AudioSystem fill:#87CEEB
    style TrackingSystem fill:#DDA0DD
```

## Class Diagram

```mermaid
classDiagram
    class WordCatchScene {
        +character: Phaser.Sprite
        +wordsGroup: Phaser.Group
        +caughtWords: Array
        +currentRoundCatches: number
        +particleEmitters: Map
        +create()
        +update()
        +spawnWord(wordData)
        +handleWordCatch(character, word)
        +createCatchParticles(x, y)
        +playWordAudio(wordData)
        +trackCaughtWord(wordData, wasTarget)
        +removeCaughtWord(word)
    }

    class CollisionHandler {
        +scene: Phaser.Scene
        +character: Phaser.Sprite
        +wordsGroup: Phaser.Group
        +setupCollision()
        +checkCollision(character, word)
        +onCollisionDetected(character, word)
        +isValidCollision(word)
        +getCollisionPoint(character, word)
    }

    class ParticleEffectManager {
        +scene: Phaser.Scene
        +activeEmitters: Array
        +particleConfig: Object
        +createCatchEffect(x, y, color)
        +explodeParticles(emitter)
        +cleanupEmitter(emitter)
        +optimizeForPerformance()
    }

    class CatchAudioPlayer {
        +scene: Phaser.Scene
        +audioQueue: Array
        +maxSimultaneous: number
        +playWordAudio(audioKey, volume)
        +queueAudio(audioKey)
        +handleMissingAudio(wordData)
        +stopAllAudio()
    }

    class CatchTracker {
        +caughtWords: Array
        +currentRound: number
        +catchCount: number
        +trackCatch(wordData, wasTarget)
        +getCaughtWords()
        +getCatchCount()
        +clearHistory()
        +getLastCatch()
    }

    class WordSprite {
        +wordData: Object
        +textRef: Phaser.Text
        +isCaught: boolean
        +velocityY: number
        +create(x, y, data)
        +updatePosition()
        +markAsCaught()
        +animateOut()
        +cleanup()
    }

    WordCatchScene --> CollisionHandler
    WordCatchScene --> ParticleEffectManager
    WordCatchScene --> CatchAudioPlayer
    WordCatchScene --> CatchTracker
    WordCatchScene --> WordSprite
```

## Collision Detection Sequence Diagram

```mermaid
sequenceDiagram
    actor Player as Player
    participant Char as Character Sprite
    participant Word as Word Sprite
    participant Physics as Phaser Physics
    participant Scene as WordCatchScene
    participant Collision as CollisionHandler
    participant Particles as ParticleManager
    participant Audio as AudioPlayer
    participant Tracker as CatchTracker

    Player->>Char: Move under falling word
    Word->>Word: Fall downward (velocity)
    Physics->>Physics: Check overlap in update loop
    Physics->>Collision: Overlap detected!
    Collision->>Collision: Validate collision (word.active)

    alt Valid Collision
        Collision->>Scene: handleWordCatch(character, word)
        Scene->>Word: Mark as caught (setActive false)
        Scene->>Particles: createCatchParticles(x, y)
        Particles->>Particles: Spawn particle emitter
        Particles->>Particles: Explode particles
        Scene->>Audio: playWordAudio(wordData)
        Audio->>Audio: Check audio exists
        Audio->>Player: Play word pronunciation
        Scene->>Tracker: trackCaughtWord(wordData)
        Tracker->>Tracker: Add to caughtWords array
        Tracker->>Tracker: Increment catchCount
        Scene->>Word: removeCaughtWord(word)
        Word->>Word: Animate scale up + fade
        Word->>Word: Destroy sprite and text
        Particles->>Particles: Auto-cleanup after 500ms
    else Invalid Collision (already caught)
        Collision->>Scene: Ignore collision
    end
```

## Collision Detection Flow Diagram

```mermaid
graph TD
    Start[Game Update Loop] --> CheckOverlap{Physics.overlap<br/>detected?}
    CheckOverlap -->|No| Continue[Continue update loop]
    CheckOverlap -->|Yes| ValidateWord{Word still<br/>active?}

    ValidateWord -->|No| Continue
    ValidateWord -->|Yes| DisableWord[Disable word physics]

    DisableWord --> SpawnParticles[Create particle effect]
    SpawnParticles --> PlayAudio[Play word audio]
    PlayAudio --> TrackCatch[Add to caught words array]
    TrackCatch --> AnimateOut[Animate word out]
    AnimateOut --> CleanupWord[Destroy word sprite]
    CleanupWord --> CleanupParticles[Schedule particle cleanup]
    CleanupParticles --> Continue

    style Start fill:#90EE90
    style CheckOverlap fill:#FFD700
    style ValidateWord fill:#FFD700
    style SpawnParticles fill:#FF69B4
    style PlayAudio fill:#87CEEB
    style TrackCatch fill:#DDA0DD
```

## Particle System State Diagram

```mermaid
stateDiagram-v2
    [*] --> Ready: Particle system initialized
    Ready --> Spawning: Word caught
    Spawning --> Active: Emitter created
    Active --> Exploding: explode() called
    Exploding --> Animating: Particles moving
    Animating --> Fading: Lifespan < 200ms
    Fading --> Cleanup: Lifespan expired
    Cleanup --> Destroyed: emitter.destroy()
    Destroyed --> [*]

    note right of Exploding
        12 particles spawn
        360-degree spread
        Gold/yellow colors
    end note

    note right of Animating
        Particles fall with gravity
        Scale: 0.8 -> 0
        Alpha: 1 -> 0
    end note
```

## Collision Hitbox Diagram

```mermaid
graph TB
    subgraph Character Hitbox
        CharVisual[Character Visual<br/>Width: 80px<br/>Height: 100px]
        CharHitbox[Collision Hitbox<br/>Width: 100px<br/>Height: 110px<br/>10px padding]
    end

    subgraph Word Hitbox
        WordVisual[Word Visual<br/>Width: varies<br/>Height: 50px]
        WordHitbox[Collision Hitbox<br/>Width: visual + 20px<br/>Height: 60px<br/>10px padding]
    end

    CharHitbox -.Overlap Check.-> WordHitbox

    note1[ADHD-Friendly:<br/>Slightly generous hitboxes<br/>make catching easier<br/>and more satisfying]

    style CharHitbox fill:#87CEEB
    style WordHitbox fill:#FFD700
    style note1 fill:#FFE4B5
```

## Audio System Flow

```mermaid
graph LR
    CatchEvent[Word Caught] --> CheckAudio{Audio file<br/>exists?}
    CheckAudio -->|Yes| PlayAudio[Play word audio]
    CheckAudio -->|No| LogWarning[Log warning to console]

    PlayAudio --> CheckQueue{Other audio<br/>playing?}
    CheckQueue -->|No| PlayImmediate[Play immediately]
    CheckQueue -->|Yes| MixAudio[Mix with existing<br/>lower volume]

    PlayImmediate --> AudioComplete[Audio finishes]
    MixAudio --> AudioComplete
    LogWarning --> Continue[Continue without audio]
    AudioComplete --> Continue

    style CatchEvent fill:#90EE90
    style PlayAudio fill:#87CEEB
    style LogWarning fill:#FFA500
```

## Catch Tracking Data Structure

```mermaid
graph TB
    subgraph CatchTracker
        CaughtWordsArray[caughtWords: Array]

        subgraph Catch Object
            word[word: string]
            timestamp[timestamp: number]
            wasTarget[wasTarget: boolean]
            position[position: {x, y}]
            round[round: number]
        end

        CaughtWordsArray --> Catch1[Catch 1]
        CaughtWordsArray --> Catch2[Catch 2]
        CaughtWordsArray --> Catch3[Catch 3]
        CaughtWordsArray --> CatchN[Catch N]

        Catch1 --> word
        Catch1 --> timestamp
        Catch1 --> wasTarget
        Catch1 --> position
        Catch1 --> round
    end

    style CaughtWordsArray fill:#DDA0DD
    style word fill:#FFE4B5
    style timestamp fill:#FFE4B5
    style wasTarget fill:#FFE4B5
    style position fill:#FFE4B5
    style round fill:#FFE4B5
```

## Word Removal Animation Timeline

```mermaid
gantt
    title Word Catch Animation Timeline
    dateFormat X
    axisFormat %L ms

    section Collision
    Overlap detected: milestone, 0, 0
    Word marked inactive: milestone, 0, 0

    section Visual
    Particle spawn: 0, 50
    Particle animation: 50, 450
    Word scale up: 0, 200
    Word fade out: 0, 200

    section Audio
    Audio trigger: 0, 50
    Audio playback: 50, 600

    section Cleanup
    Word destroyed: 200, 200
    Particles destroyed: 500, 500
```

## Performance Optimization Flow

```mermaid
graph TD
    Monitor[Monitor FPS] --> CheckFPS{FPS < 55?}
    CheckFPS -->|No| Monitor
    CheckFPS -->|Yes| ReduceParticles[Reduce particle count]

    ReduceParticles --> CheckAgain{FPS improved?}
    CheckAgain -->|Yes| Monitor
    CheckAgain -->|No| LimitWords[Limit max words on screen]

    LimitWords --> CheckAgain2{FPS improved?}
    CheckAgain2 -->|Yes| Monitor
    CheckAgain2 -->|No| DisableParticles[Disable particles temporarily]

    DisableParticles --> Alert[Log performance warning]
    Alert --> Monitor

    style Monitor fill:#90EE90
    style CheckFPS fill:#FFD700
    style Alert fill:#FFA500
```

## Component Integration Diagram

```mermaid
graph TB
    subgraph Phase 25 New Systems
        CollisionDet[Collision Detection]
        ParticleEff[Particle Effects]
        CatchAudio[Catch Audio]
        CatchTrack[Catch Tracking]
    end

    subgraph Phase 24 Existing
        WordSpawn[Word Spawning<br/>Phase 24]
        CharMove[Character Movement<br/>Phase 24]
        WordFall[Word Fall Physics<br/>Phase 24]
    end

    CollisionDet --> CharMove
    CollisionDet --> WordFall
    ParticleEff --> CollisionDet
    CatchAudio --> CollisionDet
    CatchTrack --> CollisionDet
    WordSpawn -.provides data.-> CollisionDet

    style CollisionDet fill:#FFD700
    style ParticleEff fill:#FF69B4
    style CatchAudio fill:#87CEEB
    style CatchTrack fill:#DDA0DD
```

## Edge Case Handling Flow

```mermaid
graph TD
    Collision[Collision Detected] --> Case1{Word already<br/>caught?}
    Case1 -->|Yes| Ignore1[Ignore collision]
    Case1 -->|No| Case2{Multiple words<br/>overlapping?}

    Case2 -->|Yes| CatchFirst[Catch only first word]
    Case2 -->|No| Case3{Word off<br/>screen?}

    Case3 -->|Yes| Ignore2[Ignore collision]
    Case3 -->|No| Case4{Character at<br/>screen edge?}

    Case4 -->|Yes| ValidEdge[Validate edge collision]
    Case4 -->|No| ValidCatch[Process valid catch]

    ValidEdge --> ValidCatch
    CatchFirst --> ValidCatch
    ValidCatch --> Success[Execute catch handler]

    Ignore1 --> End[Continue game loop]
    Ignore2 --> End
    Success --> End

    style ValidCatch fill:#90EE90
    style Ignore1 fill:#FFA500
    style Ignore2 fill:#FFA500
```

## Notes

### Why This Architecture?

**Phaser Physics Integration**
- Uses Phaser's built-in overlap detection for reliability
- Physics groups for efficient collision checking
- Leverages Phaser's optimization for multiple objects
- Handles edge cases automatically (world bounds, etc.)

**ADHD-Friendly Collision**
- Slightly generous hitboxes make catching easier
- Immediate visual feedback (particles spawn instantly)
- Immediate audio feedback (< 50ms delay)
- Clear cause-and-effect relationship
- Satisfying reward for successful catch

**Particle System Design**
- Brief duration (400ms) prevents visual clutter
- Gold/yellow theme is positive and rewarding
- Gravity makes particles feel natural
- Additive blend mode creates satisfying glow
- Automatic cleanup prevents memory leaks

**Audio Timing**
- Plays immediately on catch for clear feedback
- Handles missing audio gracefully (no crash)
- Volume appropriate for target age
- Can mix multiple catches if rapid
- Uses Phaser's audio system for consistency

**Catch Tracking**
- Foundation for Phase 26 target word logic
- Tracks all necessary data for scoring
- Timestamp enables analytics and debugging
- Position data for future features (heat maps)
- Round tracking for progress analysis

**Performance Considerations**
- Physics groups optimize collision checks
- Particle pooling considered for future
- Immediate word disable prevents double-catch
- Efficient cleanup prevents memory leaks
- 60fps maintained with multiple simultaneous catches

### What This Phase Proves

1. **Reliable Collision**: Detection works consistently
2. **Satisfying Feedback**: Visual and audio reward
3. **Clean Implementation**: No memory leaks or bugs
4. **Good Performance**: 60fps with multiple catches
5. **Foundation Ready**: Prepared for Phase 26 logic

### Integration with Phase 26

This collision system is designed to support Phase 26's target word logic:
- `wasTarget` parameter in tracking ready to use
- Separate feedback possible (correct vs. incorrect catch)
- Audio system ready to play different sounds
- Particle system can have different colors/effects
- All catch data tracked for round completion logic
