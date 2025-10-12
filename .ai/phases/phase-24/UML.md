# Phase 24: Word Catch - Falling Words - UML

## Class Diagram

```mermaid
classDiagram
    class FallingWord {
        -scene: Scene
        -word: String
        -fallSpeed: Number
        -isCaught: Boolean
        -isMissed: Boolean
        -background: Graphics
        -textObj: Text
        +constructor(scene, x, y, word)
        +fall(delta)
        +hasReachedBottom(threshold)
        +getWord()
        +getPosition()
        +markAsCaught()
        +markAsMissed()
        +destroy()
    }

    class Phaser.GameObjects.Container {
        <<framework>>
        +x: Number
        +y: Number
        +add(child)
    }

    class WordCatchScene {
        -activeWords: Array~FallingWord~
        -maxActiveWords: Number
        -sightWords: Array~String~
        -lastSpawnedWord: String
        -spawnTimer: TimerEvent
        -spawnInterval: Number
        +create()
        +update(time, delta)
        +spawnWord()
        +updateFallingWords(delta)
        +handleWordMissed(word, index)
        +getRandomWord()
        +cleanupWords()
    }

    class WordManager {
        -sightWordsLevel1: Array~String~
        -sightWordsLevel2: Array~String~
        -currentLevel: Number
        +getSightWords(level)
        +getRandomWord(excludeWord)
        +getWordList()
        +setLevel(level)
    }

    class TimerEvent {
        <<framework>>
        +delay: Number
        +callback: Function
        +loop: Boolean
        +paused: Boolean
    }

    FallingWord --|> Phaser.GameObjects.Container
    WordCatchScene --> FallingWord : creates/manages
    WordCatchScene --> WordManager : uses
    WordCatchScene --> TimerEvent : uses
```

## Falling Word Lifecycle Sequence

```mermaid
sequenceDiagram
    participant Scene as WordCatchScene
    participant Timer as SpawnTimer
    participant Word as FallingWord
    participant Graphics as Phaser Graphics

    Timer->>Scene: Timer callback fires
    Scene->>Scene: Check activeWords.length < maxActiveWords

    alt Can spawn
        Scene->>Scene: getRandomWord()
        Scene->>Word: new FallingWord(scene, x, -50, word)

        Word->>Graphics: Create background graphics
        Graphics-->>Word: Background rendered

        Word->>Graphics: Create text object
        Graphics-->>Word: Text rendered

        Word->>Scene: Add to scene
        Scene->>Scene: activeWords.push(word)

        loop Every frame
            Scene->>Word: fall(delta)
            Word->>Word: y += (fallSpeed * delta / 1000)

            Scene->>Word: hasReachedBottom()

            alt Reached bottom
                Scene->>Scene: handleWordMissed(word, index)
                Scene->>Scene: activeWords.splice(index, 1)
                Scene->>Word: destroy()
                Word->>Graphics: Destroy background and text
                Word->>Word: super.destroy()
            end
        end
    else At max capacity
        Scene->>Scene: Skip spawn
    end
```

## Word Spawning Flow

```mermaid
flowchart TD
    Start([Timer Fires]) --> CheckMax{activeWords < maxActiveWords?}

    CheckMax -->|No| End([Skip Spawn])
    CheckMax -->|Yes| GetWord[Get random word from list]

    GetWord --> CheckDupe{Same as lastSpawnedWord?}
    CheckDupe -->|Yes| GetWord
    CheckDupe -->|No| SetLast[Set lastSpawnedWord]

    SetLast --> CalcX[Calculate random x: 100-700]
    CalcX --> CreateWord[Create new FallingWord]

    CreateWord --> AddToScene[Add to scene display]
    AddToScene --> AddToArray[Push to activeWords array]

    AddToArray --> End
```

## Update Loop Diagram

```mermaid
flowchart LR
    Update([update called]) --> UpdateBasket[Update basket movement]
    UpdateBasket --> UpdateWords[updateFallingWords delta]

    UpdateWords --> Loop{For each word}

    Loop --> Fall[word.fall delta]
    Fall --> CheckBottom{hasReachedBottom?}

    CheckBottom -->|No| Next[Next word]
    CheckBottom -->|Yes| Remove[Remove from array]

    Remove --> Destroy[word.destroy]
    Destroy --> Next

    Next --> Loop
    Loop -->|Done| Render[Render frame]
```

## FallingWord Internal Structure

```mermaid
classDiagram
    class Container {
        +x: Number
        +y: Number
        +children: Array
    }

    class Graphics {
        +fillStyle()
        +fillRoundedRect()
        +lineStyle()
        +strokeRoundedRect()
    }

    class Text {
        +text: String
        +style: Object
        +setOrigin()
    }

    Container --> Graphics : contains background
    Container --> Text : contains text

    class FallingWord {
        background: Graphics
        textObj: Text
        fallSpeed: 60
    }

    FallingWord --|> Container
    FallingWord --> Graphics
    FallingWord --> Text
```

## State Diagram: FallingWord States

```mermaid
stateDiagram-v2
    [*] --> Spawning: new FallingWord()

    Spawning --> Falling: Added to scene

    state Falling {
        [*] --> Active
        Active --> Active: fall(delta)
    }

    Falling --> Missed: Reached bottom
    Falling --> Caught: Collides with basket (Phase 25)

    Missed --> Destroyed: destroy() called
    Caught --> Destroyed: destroy() called

    Destroyed --> [*]
```

## Word Spawn Timing Diagram

```mermaid
gantt
    title Word Spawning Timeline
    dateFormat X
    axisFormat %S

    section Spawn Events
    First word spawns immediately    :milestone, 0, 0
    Second word spawns              :milestone, 2500, 2500
    Third word spawns               :milestone, 5000, 5000
    Max capacity reached (3 words)  :crit, 5000, 7500
    First word reaches bottom       :milestone, 7500, 7500
    Fourth word can now spawn       :milestone, 7500, 7500
    Fifth word spawns               :milestone, 10000, 10000
```

## Word Despawn and Cleanup Flow

```mermaid
sequenceDiagram
    participant Scene
    participant Word as FallingWord
    participant Array as activeWords[]
    participant Memory

    Scene->>Word: hasReachedBottom()
    Word-->>Scene: true

    Scene->>Array: splice(index, 1)
    Array-->>Scene: Word removed

    Scene->>Word: destroy()

    Word->>Word: textObj.destroy()
    Note over Word: Remove text from scene

    Word->>Word: background.destroy()
    Note over Word: Remove graphics from scene

    Word->>Word: super.destroy()
    Note over Word: Remove container from scene

    Word->>Memory: Object freed
    Note over Memory: Garbage collection
```

## Component Structure

```mermaid
graph TB
    Scene[WordCatchScene]

    Scene --> WordSystem[Word System]
    Scene --> SpawnSystem[Spawn System]
    Scene --> UpdateSystem[Update System]

    WordSystem --> ActiveWords[activeWords Array]
    WordSystem --> WordLimit[maxActiveWords: 3]
    WordSystem --> WordList[sightWords Array]

    SpawnSystem --> Timer[SpawnTimer]
    SpawnSystem --> Selection[Word Selection]
    SpawnSystem --> Position[Position Calculation]

    Timer --> Delay[delay: 2500ms]
    Timer --> Loop[loop: true]

    Selection --> Random[Random from list]
    Selection --> NoDupe[Avoid last word]

    Position --> RandomX[x: 100-700]
    Position --> TopY[y: -50]

    UpdateSystem --> FallLogic[Fall Physics]
    UpdateSystem --> BottomCheck[Bottom Detection]
    UpdateSystem --> Cleanup[Word Cleanup]

    FallLogic --> Delta[Delta-based movement]
    FallLogic --> Speed[fallSpeed: 60px/s]

    BottomCheck --> Threshold[y > 560]
    Cleanup --> Remove[Remove from array]
    Cleanup --> Destroy[Destroy object]
```

## Physics Calculation Diagram

```mermaid
flowchart TD
    Start([fall delta called]) --> GetSpeed[fallSpeed = 60 px/s]
    GetSpeed --> GetDelta[delta = ms since last frame]

    GetDelta --> Calc[distance = fallSpeed × delta / 1000]
    Calc --> Example[Example: 60 × 16 / 1000 = 0.96 px]

    Example --> Update[y += distance]
    Update --> Result[New y position]

    Result --> Smooth[Smooth at any frame rate]
```

## Sight Word Data Structure

```mermaid
classDiagram
    class SightWords {
        <<data>>
    }

    class Level1 {
        words: ["I", "a", "am", "an", "and", "at", ...]
        difficulty: 1
        count: 24
    }

    class Level2 {
        words: ["are", "be", "but", "for", "get", ...]
        difficulty: 2
        count: 27
    }

    class WordSelector {
        +currentLevel: Number
        +usedWords: Array
        +getRandomWord()
        +avoidRepeat(lastWord)
        +filterByLevel(level)
    }

    SightWords --> Level1
    SightWords --> Level2
    WordSelector --> SightWords : selects from
```

## Memory Management Flow

```mermaid
flowchart TD
    Create([Create FallingWord]) --> Alloc1[Allocate Container]
    Alloc1 --> Alloc2[Allocate Graphics]
    Alloc2 --> Alloc3[Allocate Text]
    Alloc3 --> AddScene[Add to scene]
    AddScene --> AddArray[Add to activeWords]

    AddArray --> GameLoop[Game loop running]
    GameLoop --> ReachBottom{Reached bottom?}

    ReachBottom -->|No| GameLoop
    ReachBottom -->|Yes| RemoveArray[Remove from activeWords]

    RemoveArray --> DestroyText[textObj.destroy]
    DestroyText --> DestroyGraphics[background.destroy]
    DestroyGraphics --> DestroyContainer[super.destroy]

    DestroyContainer --> RemoveScene[Remove from scene]
    RemoveScene --> GC[Garbage collection]
    GC --> Free[Memory freed]
```

## Spawn Position Calculation

```mermaid
graph LR
    Start[Calculate spawn position] --> XMin[minX = 100]
    Start --> XMax[maxX = 700]
    Start --> YStart[y = -50]

    XMin --> Range[Range: 600 pixels]
    XMax --> Range

    Range --> Random[Phaser.Math.Between 100, 700]
    Random --> XPos[x = random value]

    YStart --> YPos[y = -50 above screen]

    XPos --> Position[x, y]
    YPos --> Position

    Position --> Spawn[Create word at position]
```

## Word Array Management

```mermaid
stateDiagram-v2
    [*] --> Empty: Scene created

    Empty --> One: First word spawns
    One --> Two: Second word spawns
    Two --> Three: Third word spawns

    Three --> AtMax: Max capacity (3)
    Note left of AtMax: No more spawns until word removed

    AtMax --> Two: Word reaches bottom
    Two --> One: Another word reaches bottom
    One --> Empty: Last word reaches bottom

    Two --> Three: New word spawns
    Three --> AtMax: New word spawns
    One --> Two: New word spawns
    Empty --> One: New word spawns
```

## Integration with WordCatchScene

```mermaid
sequenceDiagram
    participant Scene as WordCatchScene
    participant Create as create()
    participant Update as update()
    participant Spawn as spawnWord()
    participant Word as FallingWord

    Scene->>Create: Initialize scene
    Create->>Create: activeWords = []
    Create->>Create: maxActiveWords = 3
    Create->>Create: Load sight words list

    Create->>Scene: Setup spawn timer
    Scene->>Spawn: First word (delayed 500ms)
    Spawn->>Word: new FallingWord(...)
    Word-->>Spawn: Word created
    Spawn->>Create: activeWords.push(word)

    loop Every 2.5 seconds
        Scene->>Spawn: Timer callback
        Spawn->>Word: new FallingWord(...)
        Spawn->>Create: activeWords.push(word)
    end

    loop Every frame
        Scene->>Update: update(time, delta)
        Update->>Update: updateFallingWords(delta)
        Update->>Word: word.fall(delta)
        Word-->>Update: Position updated
    end
```

## Notes

### Architecture Decisions

**FallingWord as Container vs Sprite**
- Container chosen for flexibility
- Can contain multiple children (background graphics + text)
- Easy to manipulate as single unit
- Can add more visual elements later without refactoring
- Could switch to Sprite if using image assets

**Delta-Based Movement**
- `distance = fallSpeed * delta / 1000`
- Ensures consistent speed regardless of frame rate
- Critical for smooth animation on different devices
- Matches basket movement approach from Phase 23

**Max Active Words Limit**
- Prevents overwhelming player (especially important for ADHD)
- Prevents performance issues
- Forces manageable gameplay pace
- Can be adjusted based on difficulty level later

**Array Management**
- Iterate backwards when removing items (`for i = length-1 to 0`)
- Prevents index shifting issues during removal
- Common pattern for managing dynamic game object lists
- Ensures all words are checked each frame

**Spawn Positioning**
- Random x (100-700) keeps words away from edges
- Prevents words from spawning too close to boundaries
- Ensures words are always within catchable range
- y = -50 ensures smooth entry from top

**Word Selection Logic**
- Avoid consecutive duplicates for variety
- Random selection keeps gameplay interesting
- Can be extended to track recently used words
- Prepares for difficulty progression in later phases

### Performance Considerations

**Object Creation and Destruction**
- FallingWord objects created and destroyed frequently
- Must ensure proper cleanup to avoid memory leaks
- Graphics and Text objects must be explicitly destroyed
- Container.destroy() handles cleanup properly

**Update Loop Efficiency**
- Only update words that exist in array
- Remove words immediately when they reach bottom
- No unnecessary computations on destroyed words
- Maintain 60fps with 3 simultaneous words

**Rendering Optimization**
- Simple graphics (rounded rectangle + text)
- No complex shaders or effects yet
- Static background graphics (not redrawn each frame)
- Text rendering handled by Phaser efficiently

### Design Patterns Used

**Factory Pattern**: `spawnWord()` creates FallingWord instances
**Object Pool Pattern**: Could be added later for performance
**Observer Pattern**: Timer triggers spawn callbacks
**Component Pattern**: FallingWord encapsulates all word behavior

### Extensibility

This architecture prepares for Phase 25:
- Collision detection can be added to update loop
- `markAsCaught()` method ready for catching logic
- Word state tracking (isCaught, isMissed) prepared
- Scene has reference to all active words for collision checks

The structure also supports future enhancements:
- Variable fall speeds based on difficulty
- Different word types (color coding)
- Power-ups or special words
- Multiple lanes or spawn patterns
- Scoring based on word difficulty
