# Phase 4: AudioManager Service - UML

## AudioManager Class Diagram

```mermaid
classDiagram
    class AudioManager {
        -static AudioManager instance
        -Phaser.Scene scene
        -Map~String, Sound~ sounds
        -Map~String, Sound~ voices
        -Sound currentVoice
        -Number soundVolume
        -Number voiceVolume

        +static getInstance() AudioManager
        +init(scene) void
        +playSound(key, config) Sound
        +playVoice(key, config) Sound
        +stopAll() void
        +setVolume(type, volume) void
    }

    class MainMenu {
        +preload() void
        +create() void
    }

    class PhaserSound {
        +play() void
        +stop() void
        +isPlaying Boolean
        +volume Number
    }

    AudioManager --> PhaserSound : manages
    MainMenu --> AudioManager : uses
    AudioManager --> "1" Phaser.Scene : references

    note for AudioManager "Singleton Pattern\nOnly one instance exists"
```

## Singleton Pattern Illustration

```mermaid
classDiagram
    class AudioManager {
        <<singleton>>
        -static instance
        -constructor()
        +static getInstance()
    }

    class MainMenu {
        +create()
    }

    class GameScene {
        +create()
    }

    class LetterGame {
        +create()
    }

    MainMenu ..> AudioManager : getInstance()
    GameScene ..> AudioManager : getInstance()
    LetterGame ..> AudioManager : getInstance()

    note for AudioManager "All scenes share\nthe same instance"
```

## Service Initialization Sequence

```mermaid
sequenceDiagram
    actor Dev as Developer
    participant Browser
    participant Phaser
    participant MainMenu as MainMenu Scene
    participant AM as AudioManager
    participant Sound as Phaser Sound

    Dev->>Browser: Open game
    Browser->>Phaser: Initialize
    Phaser->>MainMenu: create()

    MainMenu->>AM: getInstance()
    AM-->>MainMenu: Returns singleton instance

    MainMenu->>AM: init(this)
    AM->>AM: Store scene reference
    AM-->>MainMenu: Initialized

    Note over AM: AudioManager ready for use

    MainMenu->>MainMenu: Create test button
    MainMenu->>MainMenu: Add click handler
```

## Audio Playback Sequence (Sound Effect)

```mermaid
sequenceDiagram
    actor User
    participant Button as Test Button
    participant MainMenu as MainMenu Scene
    participant AM as AudioManager
    participant Sound as Phaser Sound
    participant Console

    User->>Button: Click
    Button->>MainMenu: pointerdown event
    MainMenu->>Console: Log "Test button clicked"
    MainMenu->>AM: playSound('test-click')

    AM->>AM: Check if initialized
    AM->>AM: Check if sound already playing

    alt Sound already playing
        AM->>Sound: stop()
        Note over AM: Prevents overlap
    end

    AM->>Sound: add('test-click', config)
    Sound-->>AM: sound object
    AM->>Sound: play()
    AM->>Console: Log "Playing sound: test-click"
    AM->>AM: Store in sounds Map

    Sound->>Sound: Play audio
    Sound-->>User: Audio output

    Note over Sound: When complete...
    Sound->>AM: 'complete' event
    AM->>AM: Delete from sounds Map
```

## Audio Playback Sequence (Voice Clip)

```mermaid
sequenceDiagram
    actor User
    participant Scene
    participant AM as AudioManager
    participant CurrentVoice as Current Voice
    participant NewVoice as New Voice
    participant Console

    User->>Scene: Trigger voice clip
    Scene->>AM: playVoice('letter-a')

    AM->>AM: Check if initialized

    alt Current voice is playing
        AM->>CurrentVoice: stop()
        AM->>Console: Log "Stopping previous voice"
        Note over AM: Only one voice at a time
    end

    AM->>NewVoice: add('letter-a', config)
    NewVoice-->>AM: voice object
    AM->>NewVoice: play()
    AM->>Console: Log "Playing voice: letter-a"
    AM->>AM: Set as currentVoice
    AM->>AM: Store in voices Map

    NewVoice->>NewVoice: Play audio
    NewVoice-->>User: Audio output

    Note over NewVoice: When complete...
    NewVoice->>AM: 'complete' event
    AM->>AM: Delete from voices Map
    AM->>AM: Clear currentVoice
```

## Volume Control Flow

```mermaid
flowchart TD
    Start([setVolume called]) --> CheckType{Check type}

    CheckType -->|type === 'sound'| ClampSound[Clamp volume 0-1]
    CheckType -->|type === 'voice'| ClampVoice[Clamp volume 0-1]
    CheckType -->|invalid type| End([End - No change])

    ClampSound --> SetSound[Set soundVolume]
    ClampVoice --> SetVoice[Set voiceVolume]

    SetSound --> LogSound[Log to console]
    SetVoice --> LogVoice[Log to console]

    LogSound --> ApplyFuture[Future sounds use new volume]
    LogVoice --> ApplyFuture

    ApplyFuture --> End
```

## Overlap Prevention Flow

```mermaid
flowchart TD
    Start([playSound called]) --> Init{AudioManager\ninitialized?}

    Init -->|No| Warn[Console warning]
    Init -->|Yes| CheckExisting{Sound key\nalready playing?}

    Warn --> ReturnNull[Return null]

    CheckExisting -->|Yes| StopExisting[Stop existing sound]
    CheckExisting -->|No| CreateSound[Create new sound]

    StopExisting --> CreateSound
    CreateSound --> PlaySound[Play sound]
    PlaySound --> StoreMap[Store in sounds Map]
    StoreMap --> LogConsole[Log to console]
    LogConsole --> SetupCleanup[Setup 'complete' handler]
    SetupCleanup --> ReturnSound[Return sound object]

    ReturnNull --> End([End])
    ReturnSound --> End
```

## stopAll() Flow

```mermaid
flowchart TD
    Start([stopAll called]) --> LogStart[Log "Stopping all audio"]

    LogStart --> IterateSounds[Iterate sounds Map]
    IterateSounds --> CheckPlaying{Is sound\nplaying?}

    CheckPlaying -->|Yes| StopSound[Stop sound]
    CheckPlaying -->|No| NextSound[Next sound]

    StopSound --> NextSound
    NextSound --> MoreSounds{More sounds?}

    MoreSounds -->|Yes| CheckPlaying
    MoreSounds -->|No| ClearSounds[Clear sounds Map]

    ClearSounds --> IterateVoices[Iterate voices Map]
    IterateVoices --> CheckVoicePlaying{Is voice\nplaying?}

    CheckVoicePlaying -->|Yes| StopVoice[Stop voice]
    CheckVoicePlaying -->|No| NextVoice[Next voice]

    StopVoice --> NextVoice
    NextVoice --> MoreVoices{More voices?}

    MoreVoices -->|Yes| CheckVoicePlaying
    MoreVoices -->|No| ClearVoices[Clear voices Map]

    ClearVoices --> ClearCurrent[Set currentVoice = null]
    ClearCurrent --> End([End])
```

## Component Integration Diagram

```mermaid
graph TB
    Game[Phaser Game Instance]

    MainMenu[MainMenu Scene]
    LetterGame[LetterGame Scene]
    OtherScenes[Other Scenes...]

    AM[AudioManager Singleton]

    Assets[Audio Assets]
    ClickSound[click.mp3]
    LetterA[letter-a.mp3]
    Success[success.mp3]

    PhaserSound[Phaser Sound System]
    Browser[Browser Audio API]

    Game --> MainMenu
    Game --> LetterGame
    Game --> OtherScenes

    MainMenu --> AM
    LetterGame --> AM
    OtherScenes --> AM

    AM --> PhaserSound
    PhaserSound --> Browser

    Assets --> ClickSound
    Assets --> LetterA
    Assets --> Success

    MainMenu -.loads.-> ClickSound
    LetterGame -.loads.-> LetterA
    LetterGame -.loads.-> Success

    style AM fill:#90EE90
    style Assets fill:#FFE4B5
```

## State Diagram - AudioManager Lifecycle

```mermaid
stateDiagram-v2
    [*] --> Created: getInstance()

    Created --> Initialized: init(scene)
    Initialized --> Ready: Scene reference stored

    Ready --> PlayingSound: playSound()
    Ready --> PlayingVoice: playVoice()
    Ready --> Ready: setVolume()

    PlayingSound --> Ready: Sound completes
    PlayingSound --> Stopping: stopAll()

    PlayingVoice --> Ready: Voice completes
    PlayingVoice --> Stopping: stopAll()
    PlayingVoice --> PlayingVoice: playVoice() interrupts

    Stopping --> Ready: All stopped

    Ready --> SceneChange: Scene changes
    SceneChange --> Initialized: init(newScene)

    note right of Created
        Singleton ensures
        only one instance
    end note

    note right of PlayingVoice
        Only one voice
        plays at a time
    end note

    note right of PlayingSound
        Multiple sounds can
        play simultaneously
        (but not same key)
    end note
```

## Error Handling Flow

```mermaid
flowchart TD
    Start([Audio method called]) --> CheckInit{AudioManager\ninitialized?}

    CheckInit -->|No| WarnNotInit[Console warning:<br/>"Cannot play - not initialized"]
    CheckInit -->|Yes| TryPlay[Try to play audio]

    WarnNotInit --> ReturnNull1[Return null]

    TryPlay --> Success{Success?}

    Success -->|Yes| ReturnSound[Return sound object]
    Success -->|No| CatchError[Catch error]

    CatchError --> LogError[Console error:<br/>"Error playing sound"]
    LogError --> ReturnNull2[Return null]

    ReturnNull1 --> End([End])
    ReturnNull2 --> End
    ReturnSound --> End

    style WarnNotInit fill:#FFA500
    style LogError fill:#FF6B6B
    style ReturnSound fill:#90EE90
```

## Memory Management

```mermaid
flowchart TD
    Start([Sound plays]) --> Playing[Sound is playing]

    Playing --> StoreMap[Store in Map<br/>sounds.set(key, sound)]
    StoreMap --> SetupHandler[Setup 'complete' handler]

    SetupHandler --> WaitComplete[Wait for completion]

    WaitComplete --> Complete{Sound completes}

    Complete -->|complete event| RemoveMap[sounds.delete(key)]
    Complete -->|manual stop| RemoveMap

    RemoveMap --> GarbageCollect[JavaScript GC<br/>cleans up sound object]

    GarbageCollect --> End([End - Memory freed])

    style RemoveMap fill:#90EE90
    style GarbageCollect fill:#87CEEB
```

## Notes

### Why Singleton Pattern?

**Single Source of Truth**
- One AudioManager across all scenes
- Consistent volume settings
- Centralized audio state management
- No duplicate audio managers

**Memory Efficient**
- Single instance instead of multiple
- Shared sound caching
- Better resource management

**State Persistence**
- Volume settings persist across scene changes
- Audio state tracked globally
- Easy to implement pause/resume

### Why Separate Sound and Voice?

**Different Behavior**
- Sounds: Multiple can overlap (unless same key)
- Voices: Only one at a time (instructions should be clear)

**Different Volume Controls**
- Users may want different volumes
- Voice clips need to be clear
- Sound effects can be quieter

**ADHD-Friendly Design**
- Voice instructions shouldn't be interrupted
- Sound effects shouldn't overwhelm
- Clear audio feedback for actions

### Design Decisions

**Map vs Array for Storage**
- Fast lookup by key
- Easy to check if sound exists
- Efficient cleanup

**Console Logging**
- Helps with debugging
- Shows audio events clearly
- Can be disabled in production

**Overlap Prevention**
- Same sound key: Stop previous (no echo)
- Voice clips: Only one at a time (clarity)
- Different sounds: Can overlap (richer feedback)

**Volume Clamping**
- Always 0-1 range
- Prevents audio distortion
- Consistent behavior

### What This Phase Enables

1. **Centralized Control**: All audio through one service
2. **Consistent Behavior**: Same patterns across all scenes
3. **Easy Testing**: Console logs show what's happening
4. **Scalability**: Easy to add more audio features later
5. **Maintainability**: One place to fix audio issues

This architecture supports the game's growth while keeping audio management simple and reliable.
