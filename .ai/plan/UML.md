# Aurora's Letter Adventure - UML Documentation

## Overview

This document provides architectural diagrams using Mermaid syntax. These diagrams show the structure, relationships, and flows of the game system.

---

## System Architecture

### High-Level Component Diagram

```mermaid
graph TB
    subgraph "Browser Environment"
        HTML[index.html]
        Phaser[Phaser 3 Framework]
    end

    subgraph "Game Core"
        Config[Game Config]
        SceneManager[Scene Manager]
    end

    subgraph "Global Services"
        AudioMgr[Audio Manager]
        ProgressMgr[Progress Manager]
        ContentProv[Content Provider]
    end

    subgraph "Scenes"
        Boot[Boot Scene]
        Preload[Preload Scene]
        MainMenu[Main Menu Scene]
        Settings[Settings Scene]
        LetterPop[Letter Pop Scene]
        WordCatch[Word Catch Scene]
        LetterBuilder[Letter Builder Scene]
        MemoryMatch[Memory Match Scene]
        DanceTrace[Dance & Trace Scene]
        Results[Results Scene]
        Dashboard[Dashboard Scene]
    end

    subgraph "Game Objects"
        Bubble[Bubble Class]
        FallingWord[Falling Word Class]
        Card[Card Class]
    end

    subgraph "Persistence"
        LocalStorage[(LocalStorage)]
    end

    subgraph "Assets"
        Audio[Audio Files]
        Images[Image Files]
        Data[JSON Data]
    end

    HTML --> Phaser
    Phaser --> Config
    Config --> SceneManager
    SceneManager --> Boot
    Boot --> Preload
    Preload --> MainMenu
    MainMenu --> Settings
    MainMenu --> LetterPop
    MainMenu --> WordCatch
    MainMenu --> LetterBuilder
    MainMenu --> MemoryMatch
    MainMenu --> DanceTrace
    MainMenu --> Dashboard
    LetterPop --> Results
    WordCatch --> Results
    Results --> MainMenu

    Boot -.initializes.-> AudioMgr
    Boot -.initializes.-> ProgressMgr
    Boot -.initializes.-> ContentProv

    Preload -.loads.-> Audio
    Preload -.loads.-> Images
    Preload -.loads.-> Data

    LetterPop -.creates.-> Bubble
    WordCatch -.creates.-> FallingWord
    MemoryMatch -.creates.-> Card

    AudioMgr -.uses.-> Audio
    ContentProv -.uses.-> Data
    ProgressMgr -.saves/loads.-> LocalStorage

    Settings -.configures.-> AudioMgr
    Settings -.configures.-> ProgressMgr
```

---

## Scene State Machine

### Game Flow Diagram

```mermaid
stateDiagram-v2
    [*] --> Boot
    Boot --> Preload: Initialize Services
    Preload --> MainMenu: Assets Loaded

    MainMenu --> Settings: Settings Button
    Settings --> MainMenu: Back Button

    MainMenu --> LetterPop: Start Game
    MainMenu --> WordCatch: Start Game
    MainMenu --> LetterBuilder: Start Game
    MainMenu --> MemoryMatch: Start Game
    MainMenu --> DanceTrace: Start Game

    MainMenu --> Dashboard: Progress Button
    Dashboard --> MainMenu: Back Button

    LetterPop --> Results: Round Complete
    WordCatch --> Results: Round Complete
    LetterBuilder --> Results: Round Complete
    MemoryMatch --> Results: Round Complete
    DanceTrace --> Results: Round Complete

    Results --> MainMenu: Main Menu Button
    Results --> LetterPop: Play Again
    Results --> WordCatch: Play Again
    Results --> LetterBuilder: Play Again
    Results --> MemoryMatch: Play Again
    Results --> DanceTrace: Play Again

    state LetterPop {
        [*] --> Setup
        Setup --> Playing: Start
        Playing --> Evaluating: Answer Given
        Evaluating --> Playing: Next Question
        Evaluating --> Complete: All Questions Done
        Complete --> [*]
    }
```

---

## Core Class Diagrams

### Global Services

```mermaid
classDiagram
    class AudioManager {
        -Phaser.Scene scene
        -Object soundEffects
        -Object voiceClips
        -Object music
        -float sfxVolume
        -float voiceVolume
        -float musicVolume
        +init(scene)
        +playSound(key)
        +playVoice(key)
        +playMusic(key, loop)
        +stopMusic()
        +setSfxVolume(volume)
        +setVoiceVolume(volume)
        +setMusicVolume(volume)
        +stopAll()
    }

    class ProgressManager {
        -Object letterProgress
        -Object wordProgress
        -Array sessionHistory
        -Date lastPlayed
        +init()
        +loadProgress()
        +saveProgress()
        +recordLetterAttempt(letter, correct)
        +recordWordAttempt(word, correct)
        +getLetterMastery(letter)
        +getWordMastery(word)
        +getMasteredLetters()
        +getMasteredWords()
        +getSuggestedDifficulty()
        +addSessionRecord(data)
        +getSessionHistory()
        +reset()
    }

    class ContentProvider {
        -Array letters
        -Array sightWords
        -Object config
        +init()
        +loadLetters()
        +loadSightWords()
        +getRandomLetters(count, difficulty)
        +getRandomSightWords(count, difficulty)
        +getLetterData(letter)
        +getWordData(word)
        +filterByProgress(items, progress)
    }

    AudioManager --> "uses" Phaser
    ProgressManager --> "saves to" LocalStorage
    ContentProvider --> "loads from" JSON
```

### Scene Base Classes

```mermaid
classDiagram
    class PhaserScene {
        <<Phaser.Scene>>
        +init(data)
        +preload()
        +create()
        +update(time, delta)
    }

    class BaseScene {
        <<abstract>>
        #AudioManager audioMgr
        #ProgressManager progressMgr
        #ContentProvider contentProv
        +init(data)
        +create()
        #createBackground()
        #createUI()
        #setupServices()
    }

    class MiniGameScene {
        <<abstract>>
        #int score
        #int questionsAsked
        #int questionsCorrect
        #float startTime
        #Object currentQuestion
        #Array gameObjects
        +init(data)
        +create()
        +update(time, delta)
        #startRound()
        #nextQuestion()
        #handleCorrect()
        #handleIncorrect()
        #endRound()
        #getResults()
        #createScoreUI()
        #updateScore()
        #cleanup()
    }

    PhaserScene <|-- BaseScene
    BaseScene <|-- MiniGameScene
    BaseScene <|-- MainMenuScene
    BaseScene <|-- SettingsScene
    BaseScene <|-- ResultsScene
    BaseScene <|-- DashboardScene

    MiniGameScene <|-- LetterPopScene
    MiniGameScene <|-- WordCatchScene
    MiniGameScene <|-- LetterBuilderScene
    MiniGameScene <|-- MemoryMatchScene
    MiniGameScene <|-- DanceTraceScene
```

### Mini-Game Specific Classes

```mermaid
classDiagram
    class LetterPopScene {
        -Array bubbles
        -String targetLetter
        -int maxBubbles
        +create()
        +update(time, delta)
        -spawnBubble(letter, x, y)
        -handleBubbleClick(bubble)
        -updateBubbles(delta)
        -checkAnswer(letter)
    }

    class Bubble {
        -Phaser.GameObjects.Container container
        -Phaser.GameObjects.Graphics graphics
        -Phaser.GameObjects.Text text
        -String letter
        -float velocityY
        -boolean isTarget
        +constructor(scene, x, y, letter, isTarget)
        +update(delta)
        +pop()
        +wobble()
        +destroy()
        #createVisuals()
        #setupInteraction()
    }

    class WordCatchScene {
        -Phaser.GameObjects.Container player
        -Array fallingWords
        -String targetWord
        -float spawnTimer
        +create()
        +update(time, delta)
        -createPlayer()
        -movePlayer(direction)
        -spawnWord(word, x)
        -checkCollisions()
        -handleCatch(word)
    }

    class FallingWord {
        -Phaser.GameObjects.Container container
        -Phaser.GameObjects.Text text
        -String word
        -float velocityY
        -boolean isTarget
        +constructor(scene, x, y, word, isTarget)
        +update(delta)
        +catch()
        +miss()
        +destroy()
        #createVisuals()
    }

    LetterPopScene --> "creates many" Bubble
    WordCatchScene --> "creates many" FallingWord

    Bubble --> "extends" PhaserContainer
    FallingWord --> "extends" PhaserContainer
```

---

## Sequence Diagrams

### Game Launch Sequence

```mermaid
sequenceDiagram
    actor User
    participant Browser
    participant Phaser
    participant Boot
    participant AudioMgr
    participant ProgressMgr
    participant ContentProv
    participant Preload
    participant MainMenu

    User->>Browser: Open index.html
    Browser->>Phaser: Initialize Game
    Phaser->>Boot: Start BootScene

    Boot->>AudioMgr: Initialize
    AudioMgr-->>Boot: Ready

    Boot->>ProgressMgr: Initialize
    ProgressMgr->>Browser: Load from LocalStorage
    Browser-->>ProgressMgr: Progress Data
    ProgressMgr-->>Boot: Ready

    Boot->>ContentProv: Initialize
    ContentProv-->>Boot: Ready

    Boot->>Preload: Transition

    Preload->>Browser: Load Assets
    Browser-->>Preload: Assets Loaded

    Preload->>MainMenu: Transition
    MainMenu->>User: Display Menu
```

### Letter Pop Gameplay Sequence

```mermaid
sequenceDiagram
    actor Aurora
    participant Scene as LetterPopScene
    participant ContentProv
    participant AudioMgr
    participant Bubble
    participant ProgressMgr
    participant Results

    Aurora->>Scene: Click START
    Scene->>Scene: init()
    Scene->>ContentProv: getRandomLetters(10)
    ContentProv-->>Scene: Letter Array

    Scene->>Scene: startRound()
    Scene->>Scene: nextQuestion()

    Scene->>AudioMgr: playVoice("find_the_letter")
    Scene->>AudioMgr: playVoice(targetLetter)

    loop For each bubble
        Scene->>Bubble: new Bubble(letter)
        Bubble-->>Scene: Bubble Instance
    end

    Aurora->>Bubble: Click Bubble
    Bubble->>Scene: handleClick()

    alt Correct Answer
        Scene->>AudioMgr: playSound("correct")
        Scene->>AudioMgr: playVoice("great_job")
        Scene->>Scene: createParticles()
        Scene->>Bubble: pop()
        Scene->>ProgressMgr: recordLetterAttempt(letter, true)
        Scene->>Scene: updateScore()
        Scene->>Scene: nextQuestion()
    else Wrong Answer
        Scene->>AudioMgr: playSound("try_again")
        Scene->>Bubble: wobble()
        Scene->>ProgressMgr: recordLetterAttempt(letter, false)
    end

    Scene->>Scene: Check if round complete

    alt Round Complete
        Scene->>ProgressMgr: saveProgress()
        Scene->>Results: transition(results)
        Results->>Aurora: Show Results
    end
```

### Progress Saving Sequence

```mermaid
sequenceDiagram
    participant Scene
    participant ProgressMgr
    participant LocalStorage

    Scene->>ProgressMgr: recordLetterAttempt("A", true)
    ProgressMgr->>ProgressMgr: Update letterProgress

    Scene->>ProgressMgr: saveProgress()

    ProgressMgr->>ProgressMgr: Serialize data to JSON
    ProgressMgr->>LocalStorage: setItem("auroraProgress", json)
    LocalStorage-->>ProgressMgr: Success

    ProgressMgr->>ProgressMgr: Update lastPlayed timestamp
    ProgressMgr->>LocalStorage: setItem("auroraLastPlayed", timestamp)
    LocalStorage-->>ProgressMgr: Success

    ProgressMgr-->>Scene: Progress Saved
```

### Audio Playback Sequence

```mermaid
sequenceDiagram
    participant Scene
    participant AudioMgr
    participant Phaser

    Scene->>AudioMgr: playVoice("letter_a")

    AudioMgr->>AudioMgr: Check if sound exists

    alt Sound Exists
        AudioMgr->>AudioMgr: Stop any playing voice
        AudioMgr->>Phaser: Play sound with volume
        Phaser-->>AudioMgr: Sound playing
        AudioMgr->>AudioMgr: Log playback
        AudioMgr-->>Scene: Success
    else Sound Missing
        AudioMgr->>AudioMgr: Log error
        AudioMgr-->>Scene: Failure (graceful)
    end
```

---

## Data Models

### Progress Data Structure

```mermaid
classDiagram
    class ProgressData {
        +Object letterProgress
        +Object wordProgress
        +Array sessionHistory
        +String lastPlayed
        +int totalPlayTime
    }

    class LetterProgress {
        +String letter
        +int attempts
        +int correct
        +float accuracy
        +Date lastSeen
        +boolean mastered
    }

    class WordProgress {
        +String word
        +int attempts
        +int correct
        +float accuracy
        +Date lastSeen
        +boolean mastered
    }

    class SessionRecord {
        +Date timestamp
        +int duration
        +Array gamesPlayed
        +int totalScore
        +int questionsAsked
        +int questionsCorrect
        +float accuracy
    }

    ProgressData "1" *-- "26" LetterProgress
    ProgressData "1" *-- "40+" WordProgress
    ProgressData "1" *-- "many" SessionRecord
```

### Content Data Structure

```mermaid
classDiagram
    class LetterData {
        +String letter
        +String uppercase
        +String lowercase
        +String sound
        +Object audioFiles
        +int difficulty
        +String category
    }

    class AudioFiles {
        +String name
        +String sound
    }

    class SightWordData {
        +String word
        +int difficulty
        +String category
        +String audioFile
        +int frequency
    }

    LetterData "1" *-- "1" AudioFiles
```

---

## Event Flow

### Game Event System

```mermaid
graph LR
    subgraph "Event Sources"
        UserInput[User Input]
        GameLogic[Game Logic]
        Timer[Timers]
    end

    subgraph "Events"
        CorrectAnswer[CORRECT_ANSWER]
        IncorrectAnswer[INCORRECT_ANSWER]
        RoundComplete[ROUND_COMPLETE]
        Milestone[MILESTONE]
    end

    subgraph "Event Handlers"
        Audio[Audio Feedback]
        Visual[Visual Feedback]
        Progress[Progress Update]
        UI[UI Update]
    end

    UserInput --> CorrectAnswer
    UserInput --> IncorrectAnswer
    GameLogic --> RoundComplete
    GameLogic --> Milestone
    Timer --> RoundComplete

    CorrectAnswer --> Audio
    CorrectAnswer --> Visual
    CorrectAnswer --> Progress
    CorrectAnswer --> UI

    IncorrectAnswer --> Audio
    IncorrectAnswer --> Visual
    IncorrectAnswer --> Progress

    RoundComplete --> Audio
    RoundComplete --> Visual
    RoundComplete --> Progress
    RoundComplete --> UI

    Milestone --> Audio
    Milestone --> Visual
    Milestone --> UI
```

---

## Deployment Architecture

```mermaid
graph TB
    subgraph "Development"
        Source[Source Files]
        Assets[Asset Files]
    end

    subgraph "Static File Structure"
        Index[index.html]
        SrcDir[/src]
        AssetsDir[/assets]
        ConfigFile[config.js]
    end

    subgraph "Browser Runtime"
        HTML5[HTML5 Canvas]
        WebAudio[Web Audio API]
        Storage[LocalStorage]
    end

    subgraph "Asset CDN/Local"
        PhaserCDN[Phaser 3 Library]
        AudioFiles[Audio Files]
        ImageFiles[Image Files]
        DataFiles[Data Files]
    end

    Source --> Index
    Source --> SrcDir
    Assets --> AssetsDir

    Index --> HTML5
    SrcDir --> HTML5

    PhaserCDN --> HTML5
    AudioFiles --> WebAudio
    ImageFiles --> HTML5
    DataFiles --> HTML5

    HTML5 --> Storage
```

---

## Design Patterns Used

### Pattern Overview

```mermaid
mindmap
    root((Design Patterns))
        Singleton
            AudioManager
            ProgressManager
            ContentProvider
        State
            Scene System
            Game States
        Observer
            Event System
            Feedback Triggers
        Factory
            Bubble Creation
            Word Creation
        Template Method
            MiniGameScene Base
            Scene Lifecycle
        Strategy
            Difficulty Levels
            Content Selection
        Facade
            Phaser API Wrapper
            Service Managers
```

---

## Notes

### Why These Patterns?

**Singleton (Services)**
- One instance of each manager needed globally
- Prevents multiple audio managers conflicting
- Centralized progress tracking

**State Pattern (Scenes)**
- Phaser provides this out of the box
- Each scene is a distinct state
- Clean transitions between states

**Observer (Events)**
- Decouples game logic from feedback
- Multiple systems react to same event
- Easy to add new feedback types

**Template Method (Base Classes)**
- Common mini-game flow defined once
- Each game implements specific mechanics
- Reduces code duplication

**Composition Over Inheritance**
- Game objects use components
- Flexible assembly of features
- Easy to modify behavior

### Keeping It Simple

These diagrams show the full architecture, but remember:
- Not all systems exist from day one
- Build incrementally per phase plan
- Don't over-engineer early phases
- Refactor as patterns emerge naturally

Start simple. Add complexity only when needed.

Aurora's game comes first. Architecture supports that goal, not the other way around.
