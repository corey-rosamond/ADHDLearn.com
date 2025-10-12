# Phase 13: Content System - Letter Data - UML

## Class Diagram

```mermaid
classDiagram
    class ContentProvider {
        -static instance : ContentProvider
        -letters : Array~LetterData~
        -loaded : Boolean
        -lastLetterIndex : Number
        -constructor()
        +static getInstance() ContentProvider
        +setData(data) void
        +getRandomLetter() LetterData
        +getLetterById(id) LetterData
        +getAllLetters() Array~LetterData~
        +getLettersByCategory(category) Array~LetterData~
        +isLoaded() Boolean
        +getVowelCount() Number
        +getConsonantCount() Number
    }

    class LetterData {
        +String id
        +String letter
        +String name
        +String audioPath
        +String category
        +Number order
    }

    class LetterPopScene {
        -ContentProvider contentProvider
        -Array letters
        +preload()
        +create()
        +spawnLetter()
        +popLetter(bubble, text)
    }

    class PhaserScene {
        <<Phaser.Scene>>
        +load
        +cache
        +add
    }

    class JSONFile {
        <<Data>>
        +Array letters
    }

    ContentProvider "1" --> "*" LetterData : manages
    LetterPopScene --> "1" ContentProvider : uses
    LetterPopScene --|> PhaserScene : extends
    JSONFile ..> ContentProvider : loaded by
    LetterData --o JSONFile : contained in

    note for ContentProvider "Singleton Pattern:\nOnly one instance exists"
    note for LetterData "Immutable data structure\nfrom JSON file"
```

## Sequence Diagram: Content Loading Flow

```mermaid
sequenceDiagram
    actor Dev as Developer
    participant Game as Phaser Game
    participant Scene as LetterPopScene
    participant Loader as Phaser Loader
    participant Cache as Phaser Cache
    participant CP as ContentProvider
    participant JSON as letters.json

    Dev->>Game: Start game
    Game->>Scene: Create LetterPopScene
    Scene->>Scene: preload()
    Scene->>Loader: load.json('letterData', path)
    Loader->>JSON: Fetch file
    JSON-->>Loader: Return JSON data
    Loader->>Cache: Store in cache
    Loader-->>Scene: Load complete

    Scene->>Scene: create()
    Scene->>CP: getInstance()
    CP-->>Scene: Return singleton instance
    Scene->>Cache: get('letterData')
    Cache-->>Scene: Return parsed JSON
    Scene->>CP: setData(jsonData)
    CP->>CP: Validate data
    CP->>CP: Store letters array
    CP->>CP: Set loaded = true
    CP-->>Scene: Data loaded

    Scene->>CP: isLoaded()
    CP-->>Scene: true
    Scene->>CP: getAllLetters().length
    CP-->>Scene: 26
    Scene->>Scene: Begin gameplay
```

## Sequence Diagram: Random Letter Selection

```mermaid
sequenceDiagram
    participant Scene as LetterPopScene
    participant CP as ContentProvider
    participant RNG as Math.random()
    participant Bubble as Letter Bubble

    Scene->>Scene: spawnLetter()
    Scene->>CP: getRandomLetter()

    CP->>CP: Check if loaded
    CP->>RNG: Generate random index
    RNG-->>CP: randomIndex

    CP->>CP: Check if same as lastLetterIndex
    alt Same as last letter
        CP->>RNG: Generate new random index
        RNG-->>CP: newRandomIndex
    end

    CP->>CP: Update lastLetterIndex
    CP->>CP: Get letter at index
    CP-->>Scene: Return LetterData object

    Scene->>Scene: Calculate position (x, y)
    Scene->>Bubble: Create circle with color
    Scene->>Bubble: Add text (letterData.letter)
    Scene->>Bubble: Store letterData reference
    Scene->>Bubble: Make interactive
    Scene->>Bubble: Add click handler
    Scene-->>Scene: Letter spawned
```

## State Diagram: ContentProvider States

```mermaid
stateDiagram-v2
    [*] --> Uninitialized: new ContentProvider()
    Uninitialized --> Loading: Scene calls setData()
    Loading --> ValidationCheck: Parse JSON data

    ValidationCheck --> Loaded: Valid data
    ValidationCheck --> Error: Invalid data

    Loaded --> Ready: loaded = true
    Error --> Ready: Use fallback data

    Ready --> Serving: getRandomLetter() called
    Serving --> Ready: Return letter data

    Ready --> Query: getLetterById() called
    Query --> Ready: Return specific letter

    Ready --> Filter: getLettersByCategory() called
    Filter --> Ready: Return filtered array

    Ready --> [*]: Game ends

    note right of Loaded
        Letters array populated
        26 letters available
    end note

    note right of Serving
        Prevents consecutive
        duplicate letters
    end note
```

## Component Interaction Diagram

```mermaid
graph TB
    JSON[letters.json File] --> |Loaded by| Loader[Phaser Loader]
    Loader --> |Stores in| Cache[Phaser Cache]
    Cache --> |Retrieved by| Scene[LetterPopScene]
    Scene --> |Passes data to| CP[ContentProvider]

    CP --> |Provides data to| Scene
    Scene --> |Creates| Bubble[Letter Bubble]
    Scene --> |Creates| Text[Letter Text]

    Bubble --> |Contains| LetterData[Letter Data Object]
    Text --> |Displays| LetterData

    CP --> |Manages| LetterArray[Letters Array]
    LetterArray --> |Contains 26| LetterData

    style JSON fill:#FFE4B5
    style CP fill:#90EE90
    style LetterArray fill:#87CEEB
    style LetterData fill:#FFB6C1
```

## Data Structure Diagram

```mermaid
graph LR
    Root[letters.json] --> Array[letters: Array]
    Array --> L1[Letter Object 1]
    Array --> L2[Letter Object 2]
    Array --> L3[Letter Object 3]
    Array --> Dots[...]
    Array --> L26[Letter Object 26]

    L1 --> ID1[id: A]
    L1 --> LET1[letter: A]
    L1 --> NAME1[name: Letter A]
    L1 --> AUDIO1[audioPath: .../letter-a.mp3]
    L1 --> CAT1[category: vowel]
    L1 --> ORD1[order: 1]

    L26 --> ID26[id: Z]
    L26 --> LET26[letter: Z]
    L26 --> NAME26[name: Letter Z]
    L26 --> AUDIO26[audioPath: .../letter-z.mp3]
    L26 --> CAT26[category: consonant]
    L26 --> ORD26[order: 26]

    style Root fill:#FFD700
    style Array fill:#90EE90
    style L1 fill:#87CEEB
    style L26 fill:#87CEEB
```

## Activity Diagram: Letter Data Loading

```mermaid
flowchart TD
    Start([Game Starts]) --> PreloadPhase[LetterPopScene.preload]
    PreloadPhase --> LoadJSON[Load letters.json]
    LoadJSON --> CreatePhase[LetterPopScene.create]

    CreatePhase --> GetInstance[Get ContentProvider Instance]
    GetInstance --> CheckInstance{Instance Exists?}

    CheckInstance -->|No| CreateInstance[Create New Instance]
    CheckInstance -->|Yes| ReturnInstance[Return Existing Instance]
    CreateInstance --> ReturnInstance

    ReturnInstance --> GetCachedData[Get JSON from Cache]
    GetCachedData --> SetData[Call setData with JSON]

    SetData --> ValidateData{Data Valid?}
    ValidateData -->|Yes| ParseLetters[Parse letters array]
    ValidateData -->|No| LogError[Log Error]

    ParseLetters --> StoreData[Store in letters array]
    StoreData --> SetLoaded[Set loaded = true]
    SetLoaded --> LogSuccess[Log Success Message]

    LogSuccess --> Ready([ContentProvider Ready])
    LogError --> UseFallback[Use Fallback Data]
    UseFallback --> Ready

    style Start fill:#90EE90
    style Ready fill:#90EE90
    style ValidateData fill:#FFE4B5
    style LogError fill:#FFB6C1
```

## Activity Diagram: Get Random Letter Logic

```mermaid
flowchart TD
    Start([getRandomLetter Called]) --> CheckLoaded{Is Loaded?}

    CheckLoaded -->|No| ReturnFallback[Return Fallback Letter A]
    CheckLoaded -->|Yes| CheckEmpty{Letters Array Empty?}

    CheckEmpty -->|Yes| ReturnFallback
    CheckEmpty -->|No| GenerateRandom[Generate Random Index]

    GenerateRandom --> CheckSame{Same as Last Index?}
    CheckSame -->|Yes & length > 1| GenerateRandom
    CheckSame -->|No| UpdateLast[Update lastLetterIndex]

    UpdateLast --> GetLetter[Get Letter at Index]
    GetLetter --> ReturnLetter[Return Letter Object]

    ReturnFallback --> End([Return to Caller])
    ReturnLetter --> End

    style Start fill:#90EE90
    style End fill:#90EE90
    style CheckSame fill:#FFE4B5
    style ReturnFallback fill:#FFB6C1
```

## Deployment Diagram

```mermaid
graph TB
    subgraph "File System"
        IndexHTML[index.html]
        ConfigJS[src/config.js]
        CPService[src/services/ContentProvider.js]
        LetterScene[src/scenes/LetterPopScene.js]
        LettersJSON[assets/data/letters.json]
    end

    subgraph "Browser Runtime"
        PhaserEngine[Phaser Engine]
        GameInstance[Game Instance]
        SceneManager[Scene Manager]
        LoaderSystem[Loader System]
        CacheSystem[Cache System]
        CPInstance[ContentProvider Singleton]
    end

    IndexHTML --> PhaserEngine
    IndexHTML --> ConfigJS
    ConfigJS --> GameInstance
    GameInstance --> SceneManager

    SceneManager --> LetterScene
    LetterScene --> CPService
    LetterScene --> LoaderSystem

    LoaderSystem --> LettersJSON
    LoaderSystem --> CacheSystem
    CacheSystem --> LetterScene

    LetterScene --> CPInstance
    CPService --> CPInstance

    style LettersJSON fill:#FFE4B5
    style CPService fill:#90EE90
    style CPInstance fill:#87CEEB
```

## Object Relationship Diagram

```mermaid
graph LR
    Scene[LetterPopScene Instance] --> |holds reference to| CP[ContentProvider Singleton]

    CP --> |manages| LettersArray[letters: Array]
    LettersArray --> |contains| LD1[LetterData A]
    LettersArray --> |contains| LD2[LetterData B]
    LettersArray --> |contains| LD3[LetterData ...]
    LettersArray --> |contains| LD26[LetterData Z]

    Scene --> |creates| Bubble1[Bubble 1]
    Scene --> |creates| Bubble2[Bubble 2]
    Scene --> |creates| Bubble3[Bubble 3]

    Bubble1 --> |references| LD5[LetterData E]
    Bubble2 --> |references| LD12[LetterData L]
    Bubble3 --> |references| LD18[LetterData R]

    LD1 -.-> |source data| JSONFile[letters.json]
    LD2 -.-> JSONFile
    LD26 -.-> JSONFile

    style CP fill:#90EE90
    style LettersArray fill:#87CEEB
    style JSONFile fill:#FFE4B5
```

## Memory Structure Diagram

```mermaid
graph TB
    subgraph "Heap Memory"
        CP[ContentProvider Instance]
        CP --> LA[letters Array]

        LA --> L1[Object: Letter A]
        LA --> L2[Object: Letter B]
        LA --> Dots[...]
        LA --> L26[Object: Letter Z]

        Scene[LetterPopScene] --> CPRef[Reference to ContentProvider]
        CPRef -.-> CP

        Scene --> B1[Bubble Object]
        B1 --> B1Data[letterData Reference]
        B1Data -.-> L1

        Scene --> B2[Bubble Object]
        B2 --> B2Data[letterData Reference]
        B2Data -.-> L5[Object: Letter E]
        LA --> L5
    end

    subgraph "Static Memory"
        CPStatic[ContentProvider.instance]
        CPStatic -.-> CP
    end

    style CP fill:#90EE90
    style LA fill:#87CEEB
    style CPStatic fill:#FFD700
```

## Singleton Pattern Implementation

```mermaid
classDiagram
    class ContentProvider {
        -static instance : ContentProvider
        -constructor()
        +static getInstance() ContentProvider
    }

    note for ContentProvider "Singleton Pattern:
    1. Private static instance
    2. Private constructor
    3. Public getInstance()
    4. Returns same instance
    Only ONE ContentProvider
    exists in entire application"

    Client1 --> ContentProvider : getInstance()
    Client2 --> ContentProvider : getInstance()
    Client3 --> ContentProvider : getInstance()

    class Client1 {
        LetterPopScene
    }
    class Client2 {
        MainMenuScene
    }
    class Client3 {
        Future Scene
    }

    note for Client1 "All clients receive
    the SAME instance"
```

## Data Flow Diagram: Complete Flow

```mermaid
flowchart LR
    JSON[letters.json] --> |HTTP Request| Browser[Browser]
    Browser --> |Parse JSON| Loader[Phaser Loader]
    Loader --> |Store| Cache[Cache System]

    Cache --> |Retrieve| Scene[LetterPopScene]
    Scene --> |Initialize| CP[ContentProvider]
    CP --> |Store| Memory[Memory: letters array]

    Scene --> |Request| CP
    CP --> |Select Random| Memory
    Memory --> |Return Data| CP
    CP --> |Return Object| Scene

    Scene --> |Create Visual| Bubble[Letter Bubble]
    Scene --> |Create Text| Text[Letter Text]

    Bubble --> |Display| Screen[Game Screen]
    Text --> |Display| Screen

    style JSON fill:#FFE4B5
    style CP fill:#90EE90
    style Memory fill:#87CEEB
    style Screen fill:#98FB98
```

## Notes

### Architecture Decisions

**Singleton Pattern for ContentProvider**
- Only one instance needed across entire game
- Ensures all scenes use same letter data
- Prevents duplicate loading of JSON
- Centralized data management
- Easy to access from any scene

**JSON for Data Storage**
- Human-readable and editable
- Standard format, widely supported
- Easy to validate (JSON Schema)
- Version control friendly
- Can be edited without code changes

**Separation of Concerns**
- ContentProvider handles data management only
- Scenes handle game logic and display
- JSON file contains pure data, no logic
- Clear responsibility boundaries

**Immutable Data Pattern**
- Letter data doesn't change after loading
- Return copies to prevent external modification
- Safe to share references across objects
- Predictable behavior

### Performance Considerations

**One-Time Loading**
- JSON loaded once in preload()
- Cached by Phaser for fast retrieval
- ContentProvider stores parsed data
- No repeated file I/O

**Memory Efficiency**
- 26 letter objects = minimal memory
- Bubble objects only reference letter data (no duplication)
- Singleton prevents multiple ContentProvider instances
- Garbage collection friendly

**Random Selection Algorithm**
- O(1) random access to array
- Simple duplicate prevention (lastLetterIndex)
- No complex shuffling algorithms needed
- Fair distribution over time

### Extensibility

**Easy to Extend**
- Add new properties to letter objects (e.g., difficulty, color)
- Add new methods to ContentProvider (e.g., getLettersByDifficulty)
- Support multiple JSON files (letters-lowercase.json)
- Add caching/persistence layer

**Future Enhancements**
- Weighted random selection (vowels appear more often)
- Sequential learning mode (A, B, C order)
- Adaptive difficulty (track which letters player knows)
- Multiple languages (letters-es.json, letters-fr.json)

### Why This Design?

**Simplicity**
- Single source of truth (letters.json)
- Clear data flow: JSON → Cache → ContentProvider → Scene
- Minimal dependencies
- Easy to understand and maintain

**Testability**
- ContentProvider can be tested independently
- Mock JSON data easily
- Test methods in isolation
- Verify singleton behavior

**Maintainability**
- Content changes don't require code changes
- Clear separation of data and logic
- Well-documented methods
- Consistent API

**ADHD-Friendly Development**
- One place to look for letter data
- Predictable behavior
- Clear method names
- No hidden complexity

This architecture provides a solid foundation for content management that will scale as the game grows in complexity.
