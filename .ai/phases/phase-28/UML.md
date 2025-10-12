# Phase 28: Word Catch Polish - UML

## Scene Architecture Diagram

```mermaid
classDiagram
    class WordCatchScene {
        -ContentProvider contentProvider
        -Phaser.Sound bgMusic
        -Phaser.Sprite basket
        -Phaser.GameObjects.Text[] activeWords
        -Number score
        -Phaser.Time.TimerEvent spawnTimer

        +create()
        +update()
        +spawnWord()
        +catchWord(wordText)
        +wordMissed(wordText)
        +createCatchParticles(x, y)
        +createCharacter()
        +animateCatch()
        +animateMiss()
        +addScore(points)
    }

    class ParticleSystem {
        +createBurstParticles(x, y)
        +createStarParticles(x, y)
        +destroy()
    }

    class AudioManager {
        -Phaser.Sound bgMusic
        -Number originalVolume
        +playWithDucking(key)
        +duckMusic()
        +restoreMusic()
        +fadeInMusic()
        +fadeOutMusic()
    }

    class CharacterAnimator {
        -Phaser.Sprite sprite
        +playIdleAnimation()
        +playCatchAnimation()
        +playMissAnimation()
    }

    class WordSpawner {
        +spawnWithAnimation(wordData)
        +createFallTween(wordText)
        +createSwayTween(wordText)
        +createRotationTween(wordText)
    }

    WordCatchScene --> ParticleSystem : uses
    WordCatchScene --> AudioManager : uses
    WordCatchScene --> CharacterAnimator : uses
    WordCatchScene --> WordSpawner : uses
```

## Component Interaction Diagram

```mermaid
graph TB
    subgraph "Input Layer"
        Player[Player Input<br/>Click/Tap]
    end

    subgraph "Game Layer"
        WordCatch[WordCatchScene]
        Words[Falling Words]
        Character[Basket/Character]
    end

    subgraph "Effect Systems"
        Particles[Particle System]
        Audio[Audio Manager]
        Animations[Animation Controller]
    end

    subgraph "Content Layer"
        CP[ContentProvider]
        SightWords[Sight Words Data]
    end

    Player -->|Click Word| Words
    Words -->|Catch Event| WordCatch

    WordCatch -->|Get Word| CP
    CP -->|Return Data| SightWords
    SightWords -->|Word Object| WordCatch

    WordCatch -->|Spawn Particles| Particles
    WordCatch -->|Play Audio| Audio
    WordCatch -->|Animate| Character
    WordCatch -->|Trigger Tweens| Animations

    Particles -->|Visual Feedback| Player
    Audio -->|Sound Feedback| Player
    Character -->|Visual Feedback| Player
```

## Sequence Diagram: Word Catch with Full Polish

```mermaid
sequenceDiagram
    actor Aurora
    participant Word as Word Sprite
    participant Scene as WordCatchScene
    participant Char as Character/Basket
    participant Audio as AudioManager
    participant Part as ParticleSystem

    Aurora->>Word: Click/Tap word

    Word->>Scene: Trigger catch event

    Scene->>Char: animateCatch()
    activate Char
    Char->>Char: Jump animation
    Char-->>Scene: Animation started
    deactivate Char

    Scene->>Part: createCatchParticles(x, y)
    activate Part
    Part->>Part: Spawn burst particles
    Part->>Part: Spawn star particles
    Part-->>Aurora: Visual explosion
    deactivate Part

    Scene->>Audio: playWithDucking(wordAudio)
    activate Audio
    Audio->>Audio: Duck background music
    Audio->>Audio: Play word pronunciation
    Audio->>Audio: Play catch sound
    Audio-->>Aurora: Audio feedback

    Audio->>Audio: Wait for audio complete
    Audio->>Audio: Restore music volume
    deactivate Audio

    Scene->>Scene: addScore(10)
    Scene->>Scene: Update score display

    Scene->>Word: destroy()
    Word-->>Scene: Destroyed

    Scene->>CP: getRandomSightWord()
    CP-->>Scene: Next word data

    Scene->>Scene: spawnWord(nextWord)
```

## State Diagram: Word Lifecycle

```mermaid
stateDiagram-v2
    [*] --> Spawning

    Spawning --> FadeIn: Spawn animation starts
    FadeIn --> Falling: Fully visible

    Falling --> Swaying: Horizontal motion
    Falling --> Rotating: Subtle rotation

    Swaying --> Falling: Continuous
    Rotating --> Falling: Continuous

    Falling --> Caught: Player clicks
    Falling --> Missed: Reaches bottom

    Caught --> ParticleEffect: Trigger particles
    Caught --> PlayAudio: Trigger sounds
    Caught --> AnimateCharacter: Character reacts

    ParticleEffect --> Destroyed
    PlayAudio --> Destroyed
    AnimateCharacter --> Destroyed

    Missed --> MissAnimation: Character reacts
    MissAnimation --> Destroyed

    Destroyed --> [*]
```

## Particle System Architecture

```mermaid
graph TB
    Catch[Word Caught] --> CreateSystem[Create Particle System]

    CreateSystem --> BurstEmitter[Burst Particle Emitter]
    CreateSystem --> StarEmitter[Star Particle Emitter]

    BurstEmitter --> BurstConfig{Configure Burst}
    BurstConfig --> Speed[Speed: 150-400]
    BurstConfig --> Angle[Angle: 0-360]
    BurstConfig --> Colors[Tint: Gold, White, Orange, Pink]
    BurstConfig --> Gravity[Gravity: 300]
    BurstConfig --> Count[Quantity: 20]

    StarEmitter --> StarConfig{Configure Stars}
    StarConfig --> StarSpeed[Speed: 100-200]
    StarConfig --> StarAngle[Angle: 0-360]
    StarConfig --> StarGrav[Gravity: 100]
    StarConfig --> StarCount[Quantity: 10]

    BurstConfig --> Explode1[Explode Effect]
    StarConfig --> Explode2[Explode Effect]

    Explode1 --> Render[Render to Screen]
    Explode2 --> Render

    Render --> Fade[Fade out over 1 second]
    Fade --> Cleanup[Destroy emitters]
    Cleanup --> End([Complete])
```

## Audio System Flow Diagram

```mermaid
flowchart TD
    Start([Word Caught]) --> CheckMusic{Background<br/>music playing?}

    CheckMusic -->|Yes| StoreCurrent[Store current volume]
    CheckMusic -->|No| PlayWord[Play word audio directly]

    StoreCurrent --> DuckMusic[Tween music volume<br/>to 10% over 100ms]

    DuckMusic --> PlayWord[Play word pronunciation]
    PlayWord --> PlayCatch[Play catch sound effect]

    PlayCatch --> WaitComplete{Word audio<br/>complete?}

    WaitComplete -->|No| Wait[Continue waiting]
    Wait --> WaitComplete

    WaitComplete -->|Yes| RestoreMusic[Tween music volume<br/>to 25% over 300ms]

    RestoreMusic --> End([Audio complete])
```

## Character Animation State Machine

```mermaid
stateDiagram-v2
    [*] --> Idle

    Idle --> IdleBob: Gentle bob animation
    IdleBob --> Idle: Loop forever

    Idle --> Catching: Word caught
    Catching --> JumpUp: Scale and jump
    JumpUp --> JumpDown: Yoyo tween
    JumpDown --> Idle: Return to idle

    Idle --> Missing: Word missed
    Missing --> ShakeLeft: Shake animation
    ShakeLeft --> ShakeRight: Repeat 3x
    ShakeRight --> Idle: Return to center

    Idle --> [*]: Scene end
```

## Word Spawn Animation Flow

```mermaid
graph LR
    Create[Create Word Sprite] --> SetInitial[Set initial state:<br/>alpha=0, scale=0]

    SetInitial --> FadeIn[Fade In Tween:<br/>alpha 0→1, 300ms]
    SetInitial --> ScaleIn[Scale In Tween:<br/>scale 0→1, 300ms]

    FadeIn --> Visible[Word Fully Visible]
    ScaleIn --> Visible

    Visible --> Fall[Fall Tween:<br/>y to bottom, 4-6s]
    Visible --> Sway[Sway Tween:<br/>x ± 30px, 1-2s loop]
    Visible --> Rotate[Rotate Tween:<br/>angle ± 10°, 1.5-2.5s loop]

    Fall --> Bottom{Reached<br/>bottom?}
    Bottom -->|Yes| Miss[Word Missed]
    Bottom -->|No| Continue[Continue falling]
```

## Memory Management Diagram

```mermaid
graph TB
    subgraph "Persistent Objects"
        Scene[WordCatchScene]
        CP[ContentProvider]
        BGMusic[Background Music]
        Character[Character Sprite]
    end

    subgraph "Temporary Objects (Per Word)"
        WordSprite[Word Text Sprite]
        Tweens[Animation Tweens]
        Particles[Particle Emitters]
        AudioRef[Audio Reference]
    end

    subgraph "Cleanup Process"
        Catch[Word Caught/Missed]
        DestroyWord[wordText.destroy]
        KillTweens[Stop all tweens]
        DestroyParticles[Destroy emitters after delay]
        ReleaseAudio[Audio auto-releases]
    end

    Scene -.->|Creates| WordSprite
    Scene -.->|Creates| Tweens
    Scene -.->|Creates| Particles

    Catch --> DestroyWord
    Catch --> KillTweens
    Catch --> DestroyParticles

    DestroyWord --> GC[Garbage Collection]
    KillTweens --> GC
    DestroyParticles --> GC
    ReleaseAudio --> GC
```

## Asset Loading Structure

```mermaid
graph TB
    Preload[PreloadScene] --> JSONLoad[Load sight-words.json]
    Preload --> AudioLoad[Load Audio Assets]
    Preload --> ImageLoad[Load Image Assets]

    AudioLoad --> WordAudio[40 Sight Word MP3s]
    AudioLoad --> MusicLoad[Background Music]
    AudioLoad --> SFXLoad[Sound Effects]

    MusicLoad --> BGMusic[wordCatchMusic.mp3]
    SFXLoad --> CatchSFX[catchSound.mp3]
    SFXLoad --> MissSFX[missSound.mp3]

    ImageLoad --> CharImage[Basket/Character sprite]
    ImageLoad --> PartImage[Particle textures]
    ImageLoad --> BG[Background image]

    JSONLoad --> Cache[Phaser Cache]
    WordAudio --> Cache
    BGMusic --> Cache
    CatchSFX --> Cache
    MissSFX --> Cache
    CharImage --> Cache
    PartImage --> Cache
    BG --> Cache

    Cache --> Ready[Ready to Start Game]
```

## Visual Layer Architecture

```mermaid
graph TB
    subgraph "Background Layer (z: 0)"
        BG[Background Image/Color]
        Clouds[Decorative Elements]
    end

    subgraph "Game Layer (z: 10)"
        Words[Falling Words]
        Particles[Particle Effects]
    end

    subgraph "Character Layer (z: 20)"
        Character[Basket/Character Sprite]
    end

    subgraph "UI Layer (z: 30)"
        Score[Score Display]
        Controls[Pause Button]
    end

    BG --> Render[Render Pipeline]
    Clouds --> Render
    Words --> Render
    Particles --> Render
    Character --> Render
    Score --> Render
    Controls --> Render

    Render --> Screen[Display on Screen]
```

## Polish Systems Integration

```mermaid
classDiagram
    class PolishManager {
        -ParticleSystem particles
        -AudioManager audio
        -AnimationController animations
        +initializeSystems()
        +handleCatchEvent(wordData, x, y)
        +handleMissEvent(x, y)
        +cleanup()
    }

    class ParticleSystem {
        +createCatchEffect(x, y)
        +createMissEffect(x, y)
        +createTrailEffect(wordSprite)
    }

    class AudioManager {
        +setupMusic()
        +handleWordCatch(wordData)
        +handleWordMiss()
        +cleanup()
    }

    class AnimationController {
        +setupCharacterAnimations()
        +playIdleLoop()
        +playCatchReaction()
        +playMissReaction()
    }

    PolishManager --> ParticleSystem
    PolishManager --> AudioManager
    PolishManager --> AnimationController

    WordCatchScene --> PolishManager : uses
```

## Performance Optimization Flow

```mermaid
flowchart TD
    Start([Game Running]) --> Monitor{Monitor FPS}

    Monitor -->|FPS >= 55| Good[Performance Good]
    Monitor -->|FPS < 55| Check[Check Systems]

    Good --> Continue[Continue Monitoring]
    Continue --> Monitor

    Check --> Particles{Too many<br/>particles?}
    Particles -->|Yes| ReduceP[Reduce particle count]
    Particles -->|No| CheckTweens{Too many<br/>tweens?}

    CheckTweens -->|Yes| OptimizeTweens[Reuse tweens,<br/>kill unused]
    CheckTweens -->|No| CheckAudio{Audio<br/>issues?}

    CheckAudio -->|Yes| OptimizeAudio[Limit concurrent sounds]
    CheckAudio -->|No| CheckWords{Too many<br/>active words?}

    CheckWords -->|Yes| CapWords[Cap max words<br/>on screen]
    CheckWords -->|No| ProfileMore[Profile further]

    ReduceP --> Test[Test Performance]
    OptimizeTweens --> Test
    OptimizeAudio --> Test
    CapWords --> Test

    Test --> Monitor
```

## Event Flow Diagram: Complete Word Catch Cycle

```mermaid
sequenceDiagram
    participant Timer as Spawn Timer
    participant Scene as WordCatchScene
    participant CP as ContentProvider
    participant Spawner as WordSpawner
    participant Word as Word Sprite
    participant Player as Aurora

    Timer->>Scene: Timer event (every 2s)
    Scene->>CP: getRandomSightWord()
    CP-->>Scene: Return word data

    Scene->>Spawner: spawnWithAnimation(wordData)
    Spawner->>Word: Create sprite
    Spawner->>Word: Apply spawn animation
    Spawner->>Word: Apply fall tween
    Spawner->>Word: Apply sway tween
    Spawner->>Word: Apply rotation tween

    Word-->>Player: Word visible, falling

    Player->>Word: Click/Tap

    Word->>Scene: pointerdown event

    Scene->>Scene: catchWord(wordText)

    par Parallel Effects
        Scene->>Particles: Create effects
        Scene->>Audio: Play sounds (ducked)
        Scene->>Character: Animate catch
    end

    Scene->>Word: destroy()
    Scene->>Scene: Update score

    Scene->>Timer: Continue (next word)
```

## Notes

### Architecture Decisions

**Why Separate Systems for Polish?**
- **Modularity**: Each polish system (particles, audio, animations) is independent
- **Testability**: Can test each system in isolation
- **Maintainability**: Easy to enhance or replace individual systems
- **Reusability**: Systems can be used in other games (Letter Pop, future games)
- **Performance**: Can optimize or disable systems independently

**Why Animation Controller Pattern?**
- Centralizes all character animation logic
- Makes it easy to add new animations
- Prevents animation conflicts
- Enables animation queuing if needed
- Simplifies testing (mock the controller)

**Why Audio Manager with Ducking?**
- Background music shouldn't overpower educational content
- Professional audio mixing improves experience
- Prevents harsh audio overlaps
- Makes audio feel cohesive and polished
- Easier to adjust volumes globally

**Why Particle System Wrapper?**
- Phaser particle API is powerful but verbose
- Wrapper provides simple, consistent interface
- Easy to create multiple particle effects
- Simplifies cleanup and memory management
- Can easily adjust effects in one place

### Performance Considerations

**Particle Optimization:**
- Limit concurrent particle emitters (destroy after use)
- Use reasonable particle counts (20-30, not 100+)
- Keep particle lifespan short (< 1 second)
- Use simple particle textures (small images)
- Avoid large particle images
- Use `blendMode: 'ADD'` sparingly (more expensive)

**Tween Optimization:**
- Reuse tweens when possible
- Kill tweens when objects destroyed
- Don't create hundreds of simultaneous tweens
- Use `ease: 'Linear'` for simple movements (faster)
- Avoid complex easing functions on many objects

**Audio Optimization:**
- Limit concurrent audio streams (2-3 max)
- Use compressed audio (MP3 128kbps)
- Preload critical audio (music, common SFX)
- Consider audio sprites for many short sounds
- Don't overlap identical sounds rapidly

**Memory Management:**
- Destroy word sprites immediately after catch/miss
- Destroy particle emitters after effect completes
- Stop all tweens on destroyed objects
- Don't keep references to destroyed objects
- Use object pooling for repeated objects (future optimization)

### Visual Design Philosophy

**Cohesion with Letter Pop:**
- Similar color palette (blues, purples, pastels)
- Same font family for text
- Similar particle effects (maintain consistency)
- Same UI style (buttons, score display)
- Matching background style (solid color or simple pattern)
- Consistent animation timing (similar ease functions)

**Child-Friendly Design:**
- High contrast text (easy to read)
- Large, clear fonts
- Bright, appealing colors
- Smooth, non-jarring animations
- Encouraging feedback (no harsh "wrong" indicators)
- Celebratory effects (stars, sparkles, positive sounds)

**Accessibility:**
- ADHD-friendly: calming music, not overstimulating
- Visual clarity: uncluttered screen, clear focus
- Audio clarity: word pronunciation is always clear
- Forgiving gameplay: 70-80% success rate target
- Positive reinforcement: celebrate catches, gentle on misses

This architecture balances polish, performance, and user experience to create a production-quality game.
