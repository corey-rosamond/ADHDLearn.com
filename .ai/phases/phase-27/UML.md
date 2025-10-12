# Phase 27: Sight Word Content - UML

## Data Structure Diagram

```mermaid
classDiagram
    class SightWordsJSON {
        +String version
        +String source
        +String lastUpdated
        +Array~SightWord~ words
    }

    class SightWord {
        +Number id
        +String text
        +Number difficulty
        +String category
        +String audioFile
    }

    SightWordsJSON "1" --> "40" SightWord : contains
```

## File Structure Diagram

```mermaid
graph TB
    Root["/Alphabet & Sight Words Game"]
    Root --> Assets["/assets"]

    Assets --> Data["/data"]
    Assets --> Audio["/audio"]

    Data --> SightWordsJSON["sight-words.json"]

    Audio --> SightWordsFolder["/sight-words"]

    SightWordsFolder --> Audio1["word-a.mp3"]
    SightWordsFolder --> Audio2["word-and.mp3"]
    SightWordsFolder --> Audio3["word-away.mp3"]
    SightWordsFolder --> AudioEtc["... (37 more files)"]
    SightWordsFolder --> Audio40["word-you.mp3"]

    style SightWordsJSON fill:#90EE90
    style Audio1 fill:#87CEEB
    style Audio2 fill:#87CEEB
    style Audio3 fill:#87CEEB
    style Audio40 fill:#87CEEB
```

## ContentProvider Class Diagram

```mermaid
classDiagram
    class ContentProvider {
        -Phaser.Scene scene
        -Object sightWordsData
        -Array~Number~ usedWords

        +constructor(scene)
        +async loadSightWords()
        +getRandomSightWord() SightWord
        +getSightWords(count) Array~SightWord~
        +getSightWordsByDifficulty(difficulty) Array~SightWord~
        +getFallbackWords() Object
        -resetUsedWords()
    }

    class SightWord {
        +Number id
        +String text
        +Number difficulty
        +String category
        +String audioFile
    }

    class WordCatchScene {
        +ContentProvider contentProvider
        +create()
        +spawnWord()
        +catchWord(word)
    }

    ContentProvider --> SightWord : returns
    WordCatchScene --> ContentProvider : uses
    ContentProvider --> WordCatchScene : depends on
```

## Sequence Diagram: Loading Sight Words

```mermaid
sequenceDiagram
    actor Dev as Developer
    participant Preload as PreloadScene
    participant Cache as Phaser Cache
    participant JSON as sight-words.json
    participant Audio as Audio Files
    participant CP as ContentProvider

    Dev->>Preload: Launch game
    Preload->>JSON: Load JSON file
    JSON-->>Cache: Return word data

    loop For each word
        Preload->>Audio: Load audio file
        Audio-->>Cache: Return audio data
    end

    Preload->>CP: Initialize ContentProvider
    CP->>Cache: Request sight words JSON
    Cache-->>CP: Return parsed data

    CP->>CP: Parse and store words
    CP->>CP: Initialize usedWords array

    CP-->>Preload: Ready
    Preload-->>Dev: Game ready
```

## Sequence Diagram: Getting Random Sight Word

```mermaid
sequenceDiagram
    participant WC as WordCatchScene
    participant CP as ContentProvider
    participant Data as sightWordsData
    participant Used as usedWords Array

    WC->>CP: getRandomSightWord()
    CP->>Data: Get all words
    CP->>Used: Get recently used word IDs

    CP->>CP: Filter available words<br/>(not in usedWords)

    alt No available words
        CP->>Used: Clear array (reset)
        CP->>CP: Recurse: getRandomSightWord()
    end

    CP->>CP: Select random from available
    CP->>CP: Get word object
    CP->>Used: Add word.id to usedWords

    alt usedWords.length > 10
        CP->>Used: Remove oldest entry
    end

    CP-->>WC: Return SightWord object

    WC->>WC: Create falling word sprite
    WC->>WC: Attach word data
```

## Sequence Diagram: Word Catch with Audio

```mermaid
sequenceDiagram
    actor Player as Aurora
    participant Sprite as Word Sprite
    participant WC as WordCatchScene
    participant Audio as Audio System
    participant CP as ContentProvider

    Player->>Sprite: Click/Tap word
    Sprite->>WC: Trigger catch event

    WC->>Sprite: Get wordData
    Sprite-->>WC: Return SightWord object

    WC->>Audio: Play audio key<br/>"sightword_{id}"
    Audio->>Audio: Lookup audio file

    alt Audio file exists
        Audio-->>Player: Play pronunciation
    else Audio missing
        Audio->>WC: Error callback
        WC->>WC: Log warning
        WC->>WC: Continue without audio
    end

    WC->>WC: Show visual feedback
    WC->>WC: Update score
    WC->>Sprite: Destroy sprite

    WC->>CP: Get next word
    CP-->>WC: Return new SightWord
    WC->>WC: Spawn next word
```

## State Diagram: Sight Word Loading

```mermaid
stateDiagram-v2
    [*] --> Uninitialized

    Uninitialized --> LoadingJSON: loadSightWords() called

    LoadingJSON --> ParsingData: JSON loaded successfully
    LoadingJSON --> LoadingFailed: Fetch error

    LoadingFailed --> UsingFallback: Load fallback data
    UsingFallback --> Ready: Fallback loaded

    ParsingData --> ValidatingData: Parse complete

    ValidatingData --> Ready: Data valid
    ValidatingData --> LoadingFailed: Invalid structure

    Ready --> ServingWords: getRandomSightWord() called
    ServingWords --> Ready: Word returned

    Ready --> [*]: Game end
```

## Component Diagram: Sight Word System

```mermaid
graph TB
    subgraph "Data Layer"
        JSON[sight-words.json]
        AudioFiles[Audio Files<br/>40 MP3s]
    end

    subgraph "Loading Layer"
        PreloadScene[PreloadScene]
        PhaserCache[Phaser Cache]
    end

    subgraph "Logic Layer"
        CP[ContentProvider]
        UsedTracker[Used Words Tracker]
    end

    subgraph "Game Layer"
        WordCatch[WordCatchScene]
        Sprites[Word Sprites]
        AudioSystem[Audio System]
    end

    JSON --> PreloadScene
    AudioFiles --> PreloadScene
    PreloadScene --> PhaserCache

    PhaserCache --> CP
    CP --> UsedTracker

    CP --> WordCatch
    WordCatch --> Sprites
    WordCatch --> AudioSystem

    PhaserCache --> AudioSystem
```

## Activity Diagram: Word Selection Algorithm

```mermaid
flowchart TD
    Start([getRandomSightWord called]) --> CheckLoaded{Data loaded?}

    CheckLoaded -->|No| ReturnNull[Return null]
    CheckLoaded -->|Yes| GetAvailable[Get words not in<br/>usedWords array]

    GetAvailable --> CheckAvailable{Available<br/>words exist?}

    CheckAvailable -->|No| ClearUsed[Clear usedWords array]
    ClearUsed --> Recurse[Call getRandomSightWord<br/>recursively]
    Recurse --> End1([Return word])

    CheckAvailable -->|Yes| SelectRandom[Select random word<br/>from available]

    SelectRandom --> AddToUsed[Add word.id to<br/>usedWords array]

    AddToUsed --> CheckLimit{usedWords.length<br/>> 10?}

    CheckLimit -->|Yes| RemoveOldest[Remove oldest<br/>entry from array]
    CheckLimit -->|No| ReturnWord[Return selected word]

    RemoveOldest --> ReturnWord
    ReturnWord --> End2([Return word])

    ReturnNull --> End3([Return null])
```

## Class Interaction: Word Spawn Flow

```mermaid
graph LR
    Timer[Phaser Timer] -->|Every 2s| WordCatch[WordCatchScene]

    WordCatch -->|getRandomSightWord| CP[ContentProvider]

    CP -->|Filter & Select| WordData[(Word Data)]

    CP -->|Return SightWord| WordCatch

    WordCatch -->|Create Sprite| Factory[Sprite Factory]

    Factory -->|new Sprite| Sprite[Word Sprite Object]

    Sprite -->|Store reference| WordData

    WordCatch -->|Add to scene| Scene[Active Scene]
```

## Data Flow Diagram

```mermaid
graph TB
    subgraph "Initialization"
        A1[Game Boot] --> A2[PreloadScene.preload]
        A2 --> A3[Load sight-words.json]
        A2 --> A4[Load 40 audio files]
        A3 --> A5[Store in cache]
        A4 --> A5
    end

    subgraph "Runtime"
        B1[ContentProvider.init] --> B2[Read from cache]
        B2 --> B3[Parse JSON]
        B3 --> B4[Store in sightWordsData]
        B4 --> B5[Initialize usedWords array]
    end

    subgraph "Word Request"
        C1[WordCatchScene] --> C2[Request word]
        C2 --> C3[ContentProvider logic]
        C3 --> C4[Filter unused words]
        C4 --> C5[Random selection]
        C5 --> C6[Track usage]
        C6 --> C7[Return word object]
    end

    subgraph "Display & Audio"
        D1[Receive word object] --> D2[Create sprite with text]
        D1 --> D3[Get audio key]
        D2 --> D4[Display on screen]
        D3 --> D5[Play pronunciation]
    end

    A5 --> B1
    B5 --> C1
    C7 --> D1
```

## JSON Schema Diagram

```mermaid
graph TB
    Root[sight-words.json<br/>Object] --> Version[version: String<br/>"1.0.0"]
    Root --> Source[source: String<br/>"Dolch Pre-Primer List"]
    Root --> Updated[lastUpdated: String<br/>"2025-10-12"]
    Root --> Words[words: Array]

    Words --> W1[Word Object 1]
    Words --> W2[Word Object 2]
    Words --> W3[...]
    Words --> W40[Word Object 40]

    W1 --> ID1[id: Number]
    W1 --> Text1[text: String]
    W1 --> Diff1[difficulty: Number]
    W1 --> Cat1[category: String]
    W1 --> Audio1[audioFile: String]

    style Root fill:#FFE4B5
    style Words fill:#98FB98
    style W1 fill:#87CEEB
    style W2 fill:#87CEEB
    style W40 fill:#87CEEB
```

## Memory Management Diagram

```mermaid
graph TB
    subgraph "Persistent Memory"
        Cache[Phaser Cache<br/>JSON + Audio]
        CPData[ContentProvider<br/>sightWordsData]
    end

    subgraph "Temporary Memory"
        UsedArray[usedWords Array<br/>Max 10 items]
        ActiveSprites[Active Word Sprites<br/>~5-8 concurrent]
    end

    subgraph "Lifecycle"
        Create[Scene Create] --> LoadCache[Load from cache]
        LoadCache --> StoreCPData[Store in CP]

        SpawnWord[Spawn Word] --> AddUsed[Add to usedWords]
        AddUsed --> CheckSize{Size > 10?}
        CheckSize -->|Yes| Shift[Remove oldest]
        CheckSize -->|No| Keep[Keep all]

        CatchWord[Catch Word] --> DestroySprite[Destroy sprite]
        DestroySprite --> FreeMemory[Free sprite memory]
    end

    Cache -.->|Read only| LoadCache
    CPData -.->|Read only| SpawnWord
```

## Error Handling Flow

```mermaid
flowchart TD
    Start([Load Sight Words]) --> TryLoad{Try load JSON}

    TryLoad -->|Success| ValidateJSON{Valid structure?}
    TryLoad -->|Fail| ErrorLog1[Log error to console]

    ValidateJSON -->|Yes| CheckWords{40 words present?}
    ValidateJSON -->|No| ErrorLog2[Log validation error]

    CheckWords -->|Yes| Success[Store data successfully]
    CheckWords -->|No| ErrorLog3[Log word count error]

    ErrorLog1 --> Fallback[Load fallback words]
    ErrorLog2 --> Fallback
    ErrorLog3 --> Fallback

    Fallback --> Limited[5 basic words available]
    Limited --> LogWarning[Warn: Limited words]

    Success --> Ready([Ready to serve words])
    LogWarning --> Ready

    Ready --> GameContinues[Game continues<br/>with available words]
```

## Notes

### Architecture Decisions

**Why ContentProvider Pattern?**
- Centralizes all content logic
- Makes testing easier (mock data)
- Allows future expansion (multiple word lists)
- Separates data from presentation
- Enables caching and optimization

**Why Track Last 10 Used Words?**
- Prevents immediate repetition (boring)
- Allows eventual repetition (necessary for learning)
- Balance between variety and practice
- Small memory footprint (10 IDs)
- Automatic rotation (no manual management)

**Why Fallback Words?**
- Game doesn't break if JSON fails
- Development continues without all assets
- Graceful degradation (5 words better than crash)
- User still gets experience (with warning)

**Why Separate Audio Files?**
- Smaller individual file sizes
- Load on-demand (performance)
- Easy to replace/update individual words
- Can add new words without regenerating all
- Browser caching works better

### Data Design Rationale

**Difficulty Levels (1-3):**
- 1: Very common, simple words (a, I, the)
- 2: Common, slightly longer (and, see, run)
- 3: Less common, more complex (away, help, where)
- Allows progressive difficulty in future phases

**Categories:**
- Not strictly necessary for Phase 27
- Useful for future themed games
- Helps with language learning
- Enables filtering/searching
- Educational value for parents

### Performance Considerations

**Preloading Strategy:**
- Load JSON at boot (small file, ~5KB)
- Load audio on-demand or preload selectively
- Consider loading first 10 words immediately
- Lazy-load remaining 30 words
- Balance startup time vs runtime performance

**Memory Usage:**
- JSON data: ~5KB (negligible)
- 40 audio files: ~1-2MB total (manageable)
- UsedWords array: 10 integers (bytes)
- Active sprites: 5-8 concurrent (minimal)
- Total memory footprint: < 5MB (excellent)

This architecture is designed to be simple, maintainable, and extensible for future phases.
