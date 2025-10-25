# Phase 9: Architecture Diagrams

**Project:** ADHDLearn.com
**Phase:** 9 of 36
**Last Updated:** October 22, 2025

---


## Overview
**Delivers:** Word Builder drag-and-drop spelling game

## Component Architecture

```mermaid
graph TB
    subgraph "Word Builder Game"
        GameScene9[GameScene.js<br/>Word building logic]
        ResultsScene9[ResultsScene.js<br/>Score display]
        WordList[wordList.js<br/>Word bank]
    end
    
    subgraph "Assets"
        WordImages[Word Images<br/>cat.png, dog.png, etc.]
        WordAudio[Word Audio<br/>cat.mp3, dog.mp3, etc.]
        LetterAudio[Letter Audio<br/>a.mp3, b.mp3, etc.]
    end
    
    GameScene9 --> WordList
    GameScene9 --> WordImages
    GameScene9 --> WordAudio
    GameScene9 --> LetterAudio
    GameScene9 --> ResultsScene9
    
    style GameScene9 fill:#FFD93D
    style WordList fill:#95E1D3
```

## Gameplay Flow

```mermaid
sequenceDiagram
    participant Child as Aurora
    participant Game as Word Builder
    participant API as Backend API
    
    Child->>Game: Start game
    Game->>Game: Load 10 random words
    Game->>Game: Display first word image
    Game->>Child: Play word audio ("CAT")
    
    Child->>Game: Drag [C] to slot 1
    Game->>Child: Play letter sound ("C")
    Child->>Game: Drag [A] to slot 2
    Game->>Child: Play letter sound ("A")
    Child->>Game: Drag [T] to slot 3
    
    Game->>Game: Word complete!
    Game->>Child: Play word audio ("CAT")
    Game->>Child: Celebration animation
    Game->>Child: +20 points
    
    Game->>Game: Next word...
    
    Game->>API: POST /api/sessions (final score)
    API->>Game: Session saved
```

---

