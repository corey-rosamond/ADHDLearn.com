# Phase 14: Audio Content - Letter Recordings - UML

## Class Diagram

```mermaid
classDiagram
    class LetterPopScene {
        -ContentProvider contentProvider
        -Array missingAudio
        -Object letterAudioConfig
        +preload()
        +create()
        +spawnLetter()
        +playLetterAudio(letterData)
        +popLetter(bubble, text)
        +setupGame()
    }

    class PhaserScene {
        <<Phaser.Scene>>
        +load
        +sound
        +cache
        +add
        +tweens
    }

    class PhaserLoader {
        <<Phaser.Loader>>
        +json(key, path)
        +audio(key, path)
        +setPath(path)
        +on(event, callback)
    }

    class PhaserSound {
        <<Phaser.Sound>>
        +play(key, config)
        +get(key)
        +volume
    }

    class ContentProvider {
        -letters Array
        +getInstance() ContentProvider
        +getRandomLetter() LetterData
        +getAllAudioPaths() Array
    }

    class LetterData {
        +String id
        +String letter
        +String name
        +String audioPath
        +String category
        +Number order
    }

    class AudioFile {
        <<MP3 Resource>>
        +String filename
        +String path
        +Number size
        +Number duration
    }

    LetterPopScene --|> PhaserScene : extends
    LetterPopScene --> PhaserLoader : uses
    LetterPopScene --> PhaserSound : uses
    LetterPopScene --> ContentProvider : uses
    ContentProvider --> LetterData : provides
    LetterData --> AudioFile : references
    PhaserLoader ..> AudioFile : loads
    PhaserSound ..> AudioFile : plays

    note for AudioFile "User generates using
    ElevenLabs TTS
    26 MP3 files (A-Z)"

    note for LetterPopScene "Loads audio in preload
    Plays audio on click
    Handles errors gracefully"
```

## Sequence Diagram: Audio Loading Flow

```mermaid
sequenceDiagram
    actor User as User
    participant EL as ElevenLabs
    participant FS as File System
    participant Game as Phaser Game
    participant Scene as LetterPopScene
    participant Loader as Phaser Loader
    participant Sound as Sound Manager

    User->>EL: Generate "The letter A" audio
    EL-->>User: Return letter-a.mp3
    User->>User: Repeat for B-Z (26 files)
    User->>FS: Place files in /assets/audio/letters/

    Game->>Scene: Create LetterPopScene
    Scene->>Scene: preload()
    Scene->>Loader: load.json('letterData', ...)
    Scene->>Loader: load.setPath('assets/audio/letters/')

    loop For each letter A-Z
        Scene->>Loader: load.audio('letter-X', 'letter-x.mp3')
        Loader->>FS: Fetch audio file
        alt File exists
            FS-->>Loader: Return MP3 data
            Loader->>Sound: Register audio
        else File missing
            FS-->>Loader: 404 Error
            Loader->>Scene: Trigger 'loaderror' event
            Scene->>Scene: Add to missingAudio array
        end
    end

    Loader-->>Scene: Loading complete
    Scene->>Scene: create()
    Scene->>Scene: Check missingAudio
    alt All audio loaded
        Scene->>Scene: Log success
    else Some audio missing
        Scene->>Scene: Log warnings
    end
    Scene->>Scene: Begin gameplay
```

## Sequence Diagram: Audio Playback Flow

```mermaid
sequenceDiagram
    actor Player
    participant Bubble as Letter Bubble
    participant Scene as LetterPopScene
    participant CP as ContentProvider
    participant Sound as Sound Manager
    participant Audio as Audio File
    participant Speaker as Device Audio

    Scene->>CP: getRandomLetter()
    CP-->>Scene: Return LetterData (includes audioPath)
    Scene->>Bubble: Create bubble with letter
    Scene->>Bubble: Store letterData

    Player->>Bubble: Click letter
    Bubble->>Scene: Trigger 'pointerdown' event

    Scene->>Scene: playLetterAudio(letterData)
    Scene->>Scene: Get audioKey from letterData.id
    Scene->>Sound: get(audioKey)

    alt Audio exists
        Sound-->>Scene: Audio object found
        Scene->>Sound: play(audioKey, config)
        Sound->>Audio: Decode MP3 data
        Audio->>Speaker: Play audio
        Speaker-->>Player: Hear "The letter X"
    else Audio missing
        Sound-->>Scene: null (not found)
        Scene->>Scene: Log warning
        Scene->>Scene: Continue without audio
    end

    Scene->>Scene: popLetter(bubble, text)
    Scene->>Bubble: Animate pop effect
    Scene->>Bubble: Destroy bubble
```

## State Diagram: Audio System States

```mermaid
stateDiagram-v2
    [*] --> NotLoaded: Scene Created

    NotLoaded --> Loading: preload() called
    Loading --> LoadingAudio: Load letter JSON
    LoadingAudio --> CheckingFiles: Load 26 MP3 files

    CheckingFiles --> FileCheck: For each file
    FileCheck --> FileExists: File found
    FileCheck --> FileMissing: 404 Error

    FileExists --> LoadingAudio: Next file
    FileMissing --> TrackError: Add to missingAudio
    TrackError --> LoadingAudio: Next file

    LoadingAudio --> ValidationPhase: All files processed

    ValidationPhase --> AllLoaded: 0 missing files
    ValidationPhase --> PartiallyLoaded: Some missing files

    AllLoaded --> Ready: Audio system ready
    PartiallyLoaded --> Ready: Partial audio available

    Ready --> Playing: User clicks letter
    Playing --> PlayingAudio: Audio exists
    Playing --> SkipAudio: Audio missing

    PlayingAudio --> Decoding: Decode MP3
    Decoding --> OutputAudio: Send to speakers
    OutputAudio --> Ready: Audio complete

    SkipAudio --> Ready: Log warning

    Ready --> [*]: Scene ends

    note right of AllLoaded
        All 26 audio files
        loaded successfully
    end note

    note right of PartiallyLoaded
        Game playable but
        some letters silent
    end note
```

## Activity Diagram: Audio File Generation (User Task)

```mermaid
flowchart TD
    Start([User Starts Task]) --> OpenEL[Open ElevenLabs]
    OpenEL --> Login[Login/Signup]
    Login --> ChooseVoice[Choose Voice - Bella/Rachel]

    ChooseVoice --> SetSettings[Configure Settings]
    SetSettings --> |Stability: 50-60%| Settings1
    SetSettings --> |Clarity: 70-80%| Settings2
    SetSettings --> |Model: Multilingual v2| Settings3

    Settings1 --> LetterA[Enter Text: The letter A]
    Settings2 --> LetterA
    Settings3 --> LetterA

    LetterA --> Generate[Click Generate]
    Generate --> Download[Download MP3]

    Download --> CheckDone{All 26 Letters Done?}
    CheckDone -->|No| NextLetter[Next Letter B-Z]
    NextLetter --> Generate
    CheckDone -->|Yes| RenameFiles[Rename Files]

    RenameFiles --> Lowercase[Use lowercase letter-a.mp3]
    Lowercase --> Hyphens[Use hyphens not spaces]
    Hyphens --> AllRenamed{All Renamed?}

    AllRenamed -->|No| RenameFiles
    AllRenamed -->|Yes| CopyFiles[Copy to /assets/audio/letters/]

    CopyFiles --> VerifyCount{Count = 26 Files?}
    VerifyCount -->|No| FindMissing[Find Missing Letters]
    FindMissing --> Generate
    VerifyCount -->|Yes| PlayTest[Test Each File]

    PlayTest --> QualityOK{Quality Good?}
    QualityOK -->|No| Regenerate[Regenerate Poor Files]
    Regenerate --> Generate
    QualityOK -->|Yes| Complete([Task Complete])

    style Start fill:#90EE90
    style Complete fill:#90EE90
    style CheckDone fill:#FFE4B5
    style QualityOK fill:#FFE4B5
```

## Activity Diagram: Audio Loading Process

```mermaid
flowchart TD
    Start([preload Called]) --> SetupError[Register loaderror handler]
    SetupError --> LoadJSON[Load letters.json]
    LoadJSON --> SetPath[Set load path to audio/letters/]

    SetPath --> InitLoop[Initialize letter loop]
    InitLoop --> LoopStart{For i = 0 to 25}

    LoopStart -->|More letters| CalcLetter[Calculate letter A-Z]
    CalcLetter --> BuildKey[Create key: letter-X]
    BuildKey --> BuildPath[Create path: letter-x.mp3]
    BuildPath --> LoadAudio[load.audio key, path]

    LoadAudio --> FileCheck{File Exists?}
    FileCheck -->|Yes| RegisterAudio[Register in Sound Manager]
    FileCheck -->|No| TriggerError[Trigger loaderror event]

    RegisterAudio --> Increment[i++]
    TriggerError --> LogError[Add to missingAudio array]
    LogError --> Increment

    Increment --> LoopStart
    LoopStart -->|Done| ResetPath[Reset load path]

    ResetPath --> CreateComplete[create Called]
    CreateComplete --> CheckMissing{missingAudio.length > 0?}

    CheckMissing -->|Yes| LogWarning[Log missing audio warning]
    CheckMissing -->|No| LogSuccess[Log All audio loaded]

    LogWarning --> InitGame[Initialize game]
    LogSuccess --> InitGame
    InitGame --> End([Audio System Ready])

    style Start fill:#90EE90
    style End fill:#90EE90
    style FileCheck fill:#FFE4B5
    style CheckMissing fill:#FFE4B5
```

## Component Interaction Diagram

```mermaid
graph TB
    subgraph "User Workflow"
        User[User] --> EL[ElevenLabs]
        EL --> Files[26 MP3 Files]
        Files --> Folder[/assets/audio/letters/]
    end

    subgraph "Game Loading"
        Scene[LetterPopScene] --> Loader[Phaser Loader]
        Loader --> Folder
        Folder --> AudioCache[Audio Cache]
        AudioCache --> SoundMgr[Sound Manager]
    end

    subgraph "Gameplay"
        Player[Player] --> Bubble[Letter Bubble]
        Bubble --> Scene
        Scene --> CP[ContentProvider]
        CP --> LetterData[Letter Data]
        LetterData --> Scene
        Scene --> SoundMgr
        SoundMgr --> Speakers[Device Speakers]
        Speakers --> PlayerEars[Player Ears]
    end

    style User fill:#FFE4B5
    style Files fill:#90EE90
    style Folder fill:#87CEEB
    style SoundMgr fill:#FFB6C1
    style Speakers fill:#98FB98
```

## Data Flow Diagram: Complete Audio Pipeline

```mermaid
flowchart LR
    EL[ElevenLabs TTS] --> |Generate| MP3[MP3 Files]
    MP3 --> |User places| FS[File System]
    FS --> |HTTP Request| Browser[Browser]

    Browser --> |Loads| Loader[Phaser Loader]
    Loader --> |Stores| Cache[Audio Cache]

    Cache --> |Provides to| Scene[LetterPopScene]
    Scene --> |Gets letter data| CP[ContentProvider]
    CP --> |Returns| LetterData[Letter Data Object]

    LetterData --> |Contains audioPath| Scene
    Scene --> |Plays via| SoundMgr[Sound Manager]
    SoundMgr --> |Retrieves| Cache
    Cache --> |Returns| AudioBuffer[Audio Buffer]

    AudioBuffer --> |Decodes| Decoder[MP3 Decoder]
    Decoder --> |Sends to| AudioCtx[Web Audio Context]
    AudioCtx --> |Outputs| Speakers[Speakers]
    Speakers --> |Sound waves| User[User Hears Audio]

    style EL fill:#FFE4B5
    style MP3 fill:#90EE90
    style Cache fill:#87CEEB
    style Speakers fill:#98FB98
```

## File Structure Diagram

```mermaid
graph TB
    Root[Project Root] --> Assets[/assets]
    Assets --> Audio[/audio]
    Audio --> Letters[/letters]

    Letters --> A[letter-a.mp3]
    Letters --> B[letter-b.mp3]
    Letters --> C[letter-c.mp3]
    Letters --> Dots[...]
    Letters --> Z[letter-z.mp3]

    Root --> Src[/src]
    Src --> Services[/services]
    Services --> CP[ContentProvider.js]

    Src --> Scenes[/scenes]
    Scenes --> LPS[LetterPopScene.js]

    LPS -.loads.-> A
    LPS -.loads.-> B
    LPS -.loads.-> C
    LPS -.loads.-> Z

    LPS -.uses.-> CP

    Assets --> Data[/data]
    Data --> JSON[letters.json]
    CP -.reads.-> JSON

    JSON -.references.-> A
    JSON -.references.-> B
    JSON -.references.-> Z

    style Letters fill:#87CEEB
    style A fill:#90EE90
    style B fill:#90EE90
    style Z fill:#90EE90
    style LPS fill:#FFB6C1
    style CP fill:#FFE4B5
```

## Audio Loading Timeline Diagram

```mermaid
gantt
    title Audio Loading Timeline
    dateFormat X
    axisFormat %Ls

    section Preload Phase
    Load JSON :a1, 0, 100ms
    Setup Audio Loader :a2, after a1, 50ms
    Load letter-a.mp3 :a3, after a2, 80ms
    Load letter-b.mp3 :a4, after a2, 85ms
    Load letter-c.mp3 :a5, after a2, 78ms
    Load remaining 23 letters :a6, after a2, 90ms

    section Create Phase
    Initialize ContentProvider :b1, after a6, 10ms
    Verify Audio Loading :b2, after b1, 5ms
    Setup Game :b3, after b2, 50ms

    section Ready State
    Game Ready :c1, after b3, 0ms
```

## Error Handling Flow Diagram

```mermaid
flowchart TD
    LoadAudio[Load Audio File] --> FileRequest{HTTP Request}

    FileRequest -->|200 OK| FileReceived[File Received]
    FileRequest -->|404| FileMissing[File Not Found]
    FileRequest -->|Network Error| NetworkFail[Network Error]

    FileReceived --> ValidateMP3{Valid MP3?}
    ValidateMP3 -->|Yes| RegisterAudio[Register in Sound Manager]
    ValidateMP3 -->|No| CorruptFile[Corrupt File Error]

    RegisterAudio --> Success([Audio Ready])

    FileMissing --> LogError[Log Error to Console]
    NetworkFail --> LogError
    CorruptFile --> LogError

    LogError --> AddToMissing[Add to missingAudio array]
    AddToMissing --> Continue[Continue Loading Other Files]
    Continue --> CheckNext{More Files?}

    CheckNext -->|Yes| LoadAudio
    CheckNext -->|No| AllProcessed[All Files Processed]

    AllProcessed --> GameReady([Game Ready with Available Audio])

    style Success fill:#90EE90
    style GameReady fill:#FFD700
    style LogError fill:#FFB6C1
```

## Memory Structure Diagram

```mermaid
graph TB
    subgraph "Browser Memory"
        subgraph "Audio Cache"
            A1[letter-a.mp3 Buffer]
            A2[letter-b.mp3 Buffer]
            A3[letter-c.mp3 Buffer]
            ADots[...]
            A26[letter-z.mp3 Buffer]
        end

        subgraph "Scene Memory"
            Scene[LetterPopScene Instance]
            Config[letterAudioConfig Object]
            Missing[missingAudio Array]
        end

        subgraph "Sound Manager"
            SM[Sound Manager Instance]
            Playing[Currently Playing Sounds]
        end

        Scene --> SM
        Scene --> Config
        Scene --> Missing

        SM --> A1
        SM --> A2
        SM --> A26

        Playing -.reference.-> A1
        Playing -.reference.-> A2
    end

    subgraph "File System"
        Files[26 MP3 Files on Disk]
    end

    Files -.loaded into.-> A1
    Files -.loaded into.-> A2
    Files -.loaded into.-> A26

    style Scene fill:#FFB6C1
    style SM fill:#90EE90
    style Files fill:#87CEEB
```

## Audio Playback State Machine

```mermaid
stateDiagram-v2
    [*] --> Idle: Audio System Ready

    Idle --> Requested: Click Letter
    Requested --> CheckExists: Check if audio loaded

    CheckExists --> Exists: Audio found
    CheckExists --> Missing: Audio not found

    Exists --> Queueing: Add to play queue
    Queueing --> Decoding: Decode MP3 buffer
    Decoding --> Playing: Send to audio context
    Playing --> OutputActive: Audio playing
    OutputActive --> Completed: Playback finished

    Missing --> LogWarn: Log warning
    LogWarn --> Continue: Skip audio

    Completed --> Idle: Ready for next
    Continue --> Idle: Ready for next

    note right of Exists
        Audio buffer
        found in cache
    end note

    note right of Missing
        Graceful degradation
        Game continues
    end note
```

## Notes

### Architecture Decisions

**MP3 Format Choice**
- Universal browser support
- Good compression (small file sizes)
- ElevenLabs native output format
- Easy for users to generate and test

**Lazy Loading vs Preload All**
- We preload all 26 files
- Total size ~500KB-1MB (reasonable)
- Prevents delays during gameplay
- Better user experience (instant audio)

**Error Handling Strategy**
- Track missing files but don't block game
- Log warnings for debugging
- Game playable without audio
- Visual feedback always works

**Singleton ContentProvider**
- Centralized letter data including audio paths
- Easy to extend with audio methods
- Consistent data access across scenes

### Performance Considerations

**Memory Usage**
- 26 MP3 files × ~30KB average = ~780KB
- Decoded in memory when played
- Browser handles audio buffer management
- Minimal impact on game performance

**Loading Time**
- Preload during scene load (~1-2 seconds)
- Acceptable for game startup
- Could show loading screen if needed
- Cache helps on scene reloads

**Playback Performance**
- Phaser sound system is optimized
- Minimal CPU usage during playback
- Web Audio API handles decoding
- No impact on frame rate

### Browser Compatibility

**Audio Support**
- MP3 supported in all modern browsers
- Chrome: Excellent
- Firefox: Excellent
- Safari: Excellent
- Edge: Excellent

**Mobile Considerations**
- iOS requires user interaction before audio
- Click event satisfies this requirement
- Android has no restrictions
- Test on actual devices

### User Experience Design

**Why This Approach Works**
- User generates audio = full control over voice/quality
- Clear naming convention prevents errors
- Graceful degradation ensures game always playable
- Audio enhances but doesn't block learning

**ADHD-Friendly Audio Design**
- Immediate audio feedback on click
- Clear, distinct letter sounds
- Consistent volume across letters
- No overwhelming background music
- Audio can be muted if overstimulating

### Extensibility

**Future Enhancements**
- Add letter sounds (phonics: /a/, /b/, /c/)
- Add sound effects (pop, success, failure)
- Add background music toggle
- Add volume slider control
- Support multiple languages
- Add audio progress bar
- Cache audio locally for offline play

### Why ElevenLabs?

**Benefits:**
- High-quality TTS
- Natural-sounding voices
- Consistent audio quality
- Easy to use
- Free tier available
- Fast generation
- Child-friendly voices

**Alternatives Considered:**
- Browser TTS API (inconsistent quality)
- Pre-recorded voice actor (expensive)
- Google TTS (less natural)
- Amazon Polly (more complex setup)

This architecture provides high-quality audio integration while maintaining simplicity and graceful error handling.
