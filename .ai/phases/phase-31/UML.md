# Phase 31: Letter Builder - Snap and Complete Logic - UML

## Class Diagram

```mermaid
classDiagram
    class LetterBuilderScene {
        -snapZones: Array
        -currentLetterIndex: Number
        -totalLetters: Number
        -score: Number
        +checkSnapZones(piece) SnapZone
        +snapPieceToZone(piece, zone)
        +checkLetterComplete() Boolean
        +celebrateCompletion()
        +loadNextLetter()
        +showRoundComplete()
        +createSnapParticles(x, y)
        +createCelebrationParticles(x, y)
    }

    class SnapZone {
        +id: String
        +pieceId: String
        +x: Number
        +y: Number
        +radius: Number
        +occupied: Boolean
    }

    class LetterPiece {
        -isSnapped: Boolean
        -snapZone: SnapZone
        +snapToZone(zone)
    }

    LetterBuilderScene --> SnapZone : manages
    LetterBuilderScene --> LetterPiece : checks
    LetterPiece --> SnapZone : references when snapped
```

## Sequence Diagram - Snap and Complete

```mermaid
sequenceDiagram
    actor User
    participant Piece as LetterPiece
    participant Scene as LetterBuilderScene
    participant Zone as SnapZone
    participant Audio as AudioManager

    User->>Piece: Drag near snap zone
    User->>Piece: Release (dragend)
    Piece->>Scene: onDragEnd()
    Scene->>Scene: checkSnapZones(piece)

    alt Within snap threshold
        Scene-->>Piece: Returns closest zone
        Scene->>Zone: Mark as occupied
        Scene->>Scene: snapPieceToZone(piece, zone)
        Scene->>Audio: play('snapSound')
        Scene->>Piece: Animate to zone.x, zone.y
        Piece->>Piece: snapToZone(zone)
        Piece->>Piece: Disable interaction
        Scene->>Scene: checkLetterComplete()

        alt All pieces snapped
            Scene->>Scene: celebrateCompletion()
            Scene->>Audio: play('successSound')
            Scene->>Scene: createCelebrationParticles()
            Scene->>Scene: Wait 2.5 seconds
            Scene->>Scene: loadNextLetter()
        end
    else Not within threshold
        Piece->>Piece: returnToStart()
    end
```

## State Diagram - Game Progression

```mermaid
stateDiagram-v2
    [*] --> LetterLoaded: Load Letter 1

    LetterLoaded --> DraggingPiece: User drags piece
    DraggingPiece --> CheckingSnap: User releases piece

    CheckingSnap --> PieceSnapped: Within snap zone
    CheckingSnap --> PieceReturned: Outside snap zone

    PieceReturned --> DraggingPiece: Drag again
    PieceSnapped --> CheckComplete: Piece locked

    CheckComplete --> WaitingMore: Not all pieces snapped
    WaitingMore --> DraggingPiece: Drag next piece

    CheckComplete --> Celebrating: All pieces snapped
    Celebrating --> NextLetter: After 2.5s

    NextLetter --> LetterLoaded: Load next letter
    NextLetter --> RoundComplete: 5 letters done

    RoundComplete --> [*]: Back to menu
    RoundComplete --> LetterLoaded: Play again
```

## Component Interaction - Snap Detection

```mermaid
graph TB
    DragEnd[Piece Released]

    DragEnd --> CheckZones[checkSnapZones]
    CheckZones --> Loop[Loop through zones]

    Loop --> Filter1{Zone occupied?}
    Filter1 -->|Yes| Skip[Skip zone]
    Filter1 -->|No| Filter2{Correct piece?}

    Filter2 -->|No| Skip
    Filter2 -->|Yes| CalcDist[Calculate distance]

    CalcDist --> CheckThresh{Distance < radius?}
    CheckThresh -->|No| Skip
    CheckThresh -->|Yes| UpdateMin[Update min distance]

    Skip --> NextZone{More zones?}
    UpdateMin --> NextZone
    NextZone -->|Yes| Loop
    NextZone -->|No| Return[Return closest zone]
```

## Data Flow - Completion and Progression

```mermaid
graph LR
    Snap[Piece Snapped]
    Snap --> Check[checkLetterComplete]
    Check --> AllSnapped{All snapped?}

    AllSnapped -->|No| Wait[Wait for more pieces]
    AllSnapped -->|Yes| Celebrate[celebrateCompletion]

    Celebrate --> Sound[Play success sound]
    Celebrate --> Particles[Show particles]
    Celebrate --> Score[Update score +50]

    Sound --> Delay[Wait 2.5s]
    Particles --> Delay
    Score --> Delay

    Delay --> CheckCount{Letter 5?}
    CheckCount -->|No| NextLetter[loadNextLetter]
    CheckCount -->|Yes| RoundDone[showRoundComplete]

    NextLetter --> Clear[Clear pieces]
    NextLetter --> Generate[Generate new pieces]
    NextLetter --> Update[Update progress]
```

## Notes

**Snap Detection Algorithm:**
1. Get all snap zones for current letter
2. Filter zones: not occupied, correct piece ID
3. Calculate distance from piece to each zone
4. Find zone with minimum distance < threshold
5. Return closest zone or null

**Completion Check:**
- Simple: `letterPieces.every(p => p.isSnapped)`
- Called after each snap
- Triggers celebration if all true

**Progression Logic:**
- Track currentLetterIndex (1-5)
- After celebration, increment and load next
- At 5, show round complete screen
- Reset index if play again
