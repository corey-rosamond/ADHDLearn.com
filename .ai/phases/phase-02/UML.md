# Phase 2: Letter Pop Standalone - Architecture Diagrams

**Project:** ADHDLearn.com
**Phase:** 2 of 36
**Last Updated:** October 22, 2025

---

## Overview

**Delivers:** Aurora can play Letter Pop from her tablet
**Architecture Changes:** Phaser 3 game deployed, no backend integration yet

---

## Phase 2 Architecture

```mermaid
graph TB
    subgraph "Phase 2 - Standalone Game"
        ChildWeb[Child Portal<br/>child.adhdlearn.com<br/>Letter Pop Game<br/>No auth, localStorage only]
    end

    ChildWeb -->|Stores scores| LocalStorage[(Browser localStorage<br/>Session data<br/>High scores)]

    style ChildWeb fill:#ffe1f5
    style LocalStorage fill:#f0f0f0
```

---

## Phaser Game Architecture

```mermaid
graph TB
    subgraph "Phaser 3 Game"
        Main[Main.js<br/>Entry point]
        Main --> Config[Game Config<br/>Canvas size, physics]

        Config --> Scenes{Scene Manager}

        Scenes --> Menu[MenuScene<br/>Difficulty selection]
        Scenes --> Gameplay[GameScene<br/>Main game logic]
        Scenes --> Results[ResultsScene<br/>Score display]

        Gameplay --> Physics[Arcade Physics<br/>Bubble movement]
        Gameplay --> Audio[Audio Manager<br/>Letter sounds, SFX]
        Gameplay --> Particles[Particle System<br/>Pop effects]

        Gameplay --> GameObjects{Game Objects}
        GameObjects --> Bubbles[Letter Bubbles<br/>Physics bodies]
        GameObjects --> Target[Target Letter Display]
        GameObjects --> UI[UI Elements<br/>Score, timer]
    end

    subgraph "Data Storage"
        LocalStorageData[(localStorage:<br/>- High scores<br/>- Session history)]
    end

    Results --> LocalStorageData

    style Gameplay fill:#e1f5ff
    style LocalStorageData fill:#f0f0f0
```

---

## Game Scene Flow

```mermaid
stateDiagram-v2
    [*] --> MenuScene: Game starts
    MenuScene --> MenuScene: User selects difficulty
    MenuScene --> GameScene: Click "Start Game"

    state GameScene {
        [*] --> SpawnBubbles: Initialize
        SpawnBubbles --> WaitingInput: Display target letter

        WaitingInput --> CheckInput: User taps bubble
        CheckInput --> Correct: Letter matches
        CheckInput --> Incorrect: Letter doesn't match

        Correct --> PopAnimation: +10 points
        PopAnimation --> NextLetter: New target
        NextLetter --> SpawnBubbles

        Incorrect --> ShakeAnimation: Visual feedback
        ShakeAnimation --> WaitingInput

        WaitingInput --> TimeUp: Timer reaches 0
        TimeUp --> EndGame: Calculate score
    }

    GameScene --> ResultsScene: Save to localStorage
    ResultsScene --> [*]: Exit
    ResultsScene --> MenuScene: Play again
```

---

## Database Changes

None (localStorage only)

---

## API Endpoints

None (standalone game)
