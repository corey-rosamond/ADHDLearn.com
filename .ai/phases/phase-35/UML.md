# Phase 35: Memory Match - Matching Logic - UML

## Match Detection Flow

```mermaid
flowchart TD
    A[Two cards flipped] --> B{Wait 300ms}
    B --> C[checkForMatch called]
    C --> D{Compare letters}

    D -->|Match| E[handleMatch]
    D -->|Mismatch| F[handleMismatch]

    E --> E1[Wait 300ms]
    E1 --> E2[card1.setMatched]
    E1 --> E3[card2.setMatched]
    E2 --> E4[Add to matchedCards]
    E3 --> E4
    E4 --> E5[Increment matchCount]
    E5 --> E6[Update counter display]
    E6 --> E7[Play success sound]
    E7 --> E8[Trigger particles]
    E8 --> E9[Clear flippedCards]
    E9 --> E10{matchCount >= 6?}

    E10 -->|Yes| G[handleRoundComplete]
    E10 -->|No| H[Set canFlip = true]

    F --> F1[Play mismatch sound]
    F1 --> F2[Wait 1000ms]
    F2 --> F3[card1.flip false]
    F2 --> F4[card2.flip false]
    F3 --> F5[Clear flippedCards]
    F4 --> F5
    F5 --> F6[Wait 300ms]
    F6 --> H

    G --> G1[Set canFlip = false]
    G1 --> G2[Play victory sound]
    G2 --> G3[Trigger celebration]
    G3 --> G4[Show message]
    G4 --> G5[Show replay buttons]

    H --> Z[Ready for next flip]
    G5 --> Z2[Wait for user action]

    style E fill:#ccffcc
    style F fill:#ffcccc
    style G fill:#ffd700
```

## State Machine: Match Logic

```mermaid
stateDiagram-v2
    [*] --> WaitingForFlips: Scene ready

    WaitingForFlips --> FirstCardFlipped: Click card 1
    FirstCardFlipped --> BothFlipped: Click card 2

    BothFlipped --> CheckingMatch: Wait 300ms

    CheckingMatch --> Match: Letters equal
    CheckingMatch --> Mismatch: Letters different

    Match --> CelebratingMatch: Mark matched
    CelebratingMatch --> CheckingWin: Update counter

    Mismatch --> WaitingToFlipBack: Play sound
    WaitingToFlipBack --> FlippingBack: Wait 1000ms
    FlippingBack --> WaitingForFlips: Cards face-down

    CheckingWin --> GameComplete: 6 pairs matched
    CheckingWin --> WaitingForFlips: More pairs to find

    GameComplete --> VictoryCelebration: Trigger effects
    VictoryCelebration --> ShowingResults: Display message
    ShowingResults --> AwaitingReplay: Show buttons

    AwaitingReplay --> [*]: Exit scene

    note right of Match
        - Keep cards revealed
        - Fade to 70% opacity
        - Particle effects
        - Success sound
    end note

    note right of Mismatch
        - 1 second delay
        - Flip both back
        - Gentle sound
        - Re-enable input
    end note

    note right of GameComplete
        - All 6 pairs found
        - Victory celebration
        - Completion message
        - Replay options
    end note
```

## Sequence Diagram: Match Flow

```mermaid
sequenceDiagram
    actor Player
    participant Scene as MemoryMatchScene
    participant Card1 as Card 1
    participant Card2 as Card 2
    participant Audio
    participant Particles

    Player->>Scene: Flip card 1
    Scene->>Card1: flip(true)
    Card1-->>Scene: flipComplete
    Note over Scene: flippedCards = [card1]

    Player->>Scene: Flip card 2
    Scene->>Card2: flip(true)
    Card2-->>Scene: flipComplete
    Note over Scene: flippedCards = [card1, card2]

    Scene->>Scene: Wait 300ms
    Scene->>Scene: checkForMatch()

    alt Match Found
        Scene->>Scene: handleMatch()
        Scene->>Scene: Wait 300ms
        Scene->>Card1: setMatched()
        Scene->>Card2: setMatched()
        Card1-->>Card1: Fade to alpha 0.7
        Card2-->>Card2: Fade to alpha 0.7

        Scene->>Scene: matchCount++
        Scene->>Scene: updateMatchesDisplay()
        Scene->>Audio: play('match-success')
        Scene->>Particles: triggerMatchCelebration(x1, y1)
        Scene->>Particles: triggerMatchCelebration(x2, y2)

        Scene->>Scene: Clear flippedCards

        alt All pairs matched
            Scene->>Scene: handleRoundComplete()
            Scene->>Audio: play('round-complete')
            Scene->>Particles: triggerVictoryCelebration()
            Scene->>Scene: showCompletionMessage()
            Scene->>Scene: showReplayOptions()
        else More pairs to find
            Scene->>Scene: canFlip = true
        end

    else Mismatch
        Scene->>Scene: handleMismatch()
        Scene->>Audio: play('card-mismatch')
        Scene->>Scene: Wait 1000ms
        Scene->>Card1: flip(false)
        Scene->>Card2: flip(false)
        Card1-->>Scene: Cards flipping back
        Card2-->>Scene: Cards flipping back
        Scene->>Scene: Clear flippedCards
        Scene->>Scene: Wait 300ms
        Scene->>Scene: canFlip = true
    end

    Scene-->>Player: Ready for next action
```

## Class Diagram: Match Logic Components

```mermaid
classDiagram
    class MemoryMatchScene {
        -cards Array~Card~
        -flippedCards Array~Card~
        -matchedCards Array~Card~
        -matchCount Number
        -totalPairs Number
        -canFlip Boolean
        +checkForMatch()
        +handleMatch()
        +handleMismatch()
        +handleRoundComplete()
        +triggerMatchCelebration(x, y)
        +triggerVictoryCelebration()
        +showCompletionMessage()
        +showReplayOptions()
        +updateMatchesDisplay()
    }

    class Card {
        +cardData Object
        +matched Boolean
        +flipped Boolean
        +setMatched()
        +flip(faceUp)
    }

    class MatchLogic {
        <<interface>>
        +compareCards(card1, card2) Boolean
        +processMatch(card1, card2)
        +processMismatch(card1, card2)
    }

    class CelebrationSystem {
        +triggerParticles(x, y, intensity)
        +playSound(soundKey, volume)
        +animateText(message)
        +pulseCards(cards)
    }

    MemoryMatchScene --> Card : manages
    MemoryMatchScene ..> MatchLogic : implements
    MemoryMatchScene --> CelebrationSystem : uses
```

## Timing Diagram: Match vs Mismatch

```mermaid
gantt
    title Match Detection Timing
    dateFormat SSS
    axisFormat %L ms

    section Match Flow
    Card 2 flip complete :milestone, 000, 0ms
    Wait to check :a1, 000, 300ms
    Check match :milestone, 300, 0ms
    Wait before marking :a2, 300, 300ms
    Mark as matched :milestone, 600, 0ms
    Play success sound :a3, 600, 500ms
    Trigger particles :a4, 600, 600ms
    Update counter :a5, 600, 200ms
    Re-enable input :milestone, 800, 0ms

    section Mismatch Flow
    Card 2 flip complete :milestone, 000, 0ms
    Wait to check :b1, 000, 300ms
    Check match :milestone, 300, 0ms
    Play mismatch sound :b2, 300, 200ms
    Wait for memorization :b3, 300, 1000ms
    Flip back animation :b4, 1300, 300ms
    Re-enable input :milestone, 1600, 0ms
```

## Data Flow: Round Completion

```mermaid
flowchart LR
    A[Match Found] --> B[matchCount++]
    B --> C{matchCount >= 6?}

    C -->|No| D[Continue Playing]
    C -->|Yes| E[Round Complete]

    E --> F[Disable Input<br/>canFlip = false]
    F --> G[Play Victory Sound]
    G --> H[Trigger Confetti]
    H --> I[Pulse All Cards]
    I --> J[Show Message<br/>'Great job!']
    J --> K[Wait 2 seconds]
    K --> L[Show Buttons]

    L --> M[Play Again Button]
    L --> N[Main Menu Button]

    M --> O[scene.restart]
    N --> P[scene.start MainMenu]

    D --> Q[canFlip = true]
    Q --> R[Wait for Next Flip]
```

## Component Interaction: Celebration System

```mermaid
graph TB
    Match[Match Detected] --> Celebrate[Celebration System]

    Celebrate --> Audio[Audio Feedback]
    Celebrate --> Visual[Visual Effects]
    Celebrate --> UI[UI Updates]

    Audio --> SuccessSound[Success Sound<br/>Volume: 0.5]

    Visual --> Particles[Particle Bursts]
    Visual --> Stars[Star Animations]
    Visual --> CardFade[Card Fade to 0.7]

    Particles --> P1[Position: card1 x,y]
    Particles --> P2[Position: card2 x,y]

    UI --> Counter[Counter Update<br/>'Matches: X/6']
    UI --> CounterAnim[Counter Scale Pulse]

    Complete[Round Complete] --> Victory[Victory Celebration]

    Victory --> BigAudio[Victory Sound<br/>Volume: 0.6]
    Victory --> Confetti[Confetti Bursts]
    Victory --> Message[Completion Message]
    Victory --> Buttons[Replay Buttons]

    Confetti --> C1[Burst 1: 0ms]
    Confetti --> C2[Burst 2: 200ms]
    Confetti --> C3[Burst 3: 400ms]
    Confetti --> C4[Burst 4: 600ms]
    Confetti --> C5[Burst 5: 800ms]
```

## Memory State Tracking

```mermaid
graph LR
    subgraph "Before Match"
        A[flippedCards: 2]
        B[matchedCards: 0]
        C[matchCount: 0]
    end

    subgraph "After First Match"
        D[flippedCards: 0]
        E[matchedCards: 2]
        F[matchCount: 1]
    end

    subgraph "After Three Matches"
        G[flippedCards: 0]
        H[matchedCards: 6]
        I[matchCount: 3]
    end

    subgraph "Round Complete"
        J[flippedCards: 0]
        K[matchedCards: 12]
        L[matchCount: 6]
    end

    A --> D
    B --> E
    C --> F

    D --> G
    E --> H
    F --> I

    G --> J
    H --> K
    I --> L

    L --> M[Victory!]
```

## Decision Tree: Post-Match Actions

```mermaid
graph TD
    A[Match Detected] --> B{Is this match #6?}

    B -->|Yes| C[Round Complete Path]
    B -->|No| D[Continue Playing Path]

    C --> C1[Disable Input]
    C1 --> C2[Play Victory Sound]
    C2 --> C3[Trigger Confetti]
    C3 --> C4[Pulse All Cards]
    C4 --> C5[Show Completion Message]
    C5 --> C6[Wait 2 Seconds]
    C6 --> C7[Show Replay Options]
    C7 --> C8{Player Choice}

    C8 -->|Play Again| C9[Restart Scene]
    C8 -->|Main Menu| C10[Exit to Menu]

    D --> D1[Keep Input Disabled]
    D1 --> D2[Play Success Sound]
    D2 --> D3[Trigger Particles]
    D3 --> D4[Update Counter]
    D4 --> D5[Re-enable Input]
    D5 --> D6[Wait for Next Flip]

    style C fill:#ffd700
    style D fill:#90ee90
```

## Notes

### Match Detection Algorithm

**Simple Comparison**:
```javascript
const isMatch = card1.cardData.letter === card2.cardData.letter;
```

**Why This Works**:
- Each pair has identical letter values
- JavaScript string equality is reliable
- Case doesn't matter (both uppercase)
- Direct comparison is fast (O(1))

### Timing Strategy

**Match Delay: 300ms**
- Brief pause to let player see both cards
- Not so long that it feels laggy
- Allows visual confirmation before marking

**Mismatch Delay: 1000ms**
- Critical for memory game strategy
- Players need time to memorize positions
- Too short: no time to learn
- Too long: frustrating wait
- 1 second is well-tested standard

**Re-enable Delay: 300ms**
- Wait for flip-back animation to complete
- Prevents clicking during animation
- Smooth transition back to playable state

### Celebration Intensity

**Single Match**:
- Moderate celebration
- Focus on cards that matched
- Don't overwhelm or distract
- Success sound + small particles

**Round Complete**:
- Big celebration
- Multiple confetti bursts
- Victory sound
- Completion message
- Pulse all cards
- Player should feel accomplished

### State Management

**Critical States**:
- `flippedCards`: Which cards currently face-up
- `matchedCards`: Which cards already matched
- `matchCount`: How many pairs found
- `canFlip`: Whether input is enabled

**State Transitions**:
1. Start: Empty arrays, count = 0, can flip
2. One flip: 1 card in flippedCards
3. Two flips: 2 cards, input disabled
4. Match: Cards moved to matchedCards, count++, clear flipped, enable input
5. Mismatch: Clear flipped after delay, enable input
6. Complete: count = 6, disable input, show UI

### Design Decisions

**Why 300ms before check?**
- Ensures second flip animation completes
- Player sees both cards clearly
- Creates satisfying rhythm

**Why 1000ms mismatch delay?**
- Standard for memory games
- Proven effective for learning
- ADHD-friendly (not too long)
- Time to process and remember

**Why immediate match feedback?**
- Rewards player instantly
- Maintains engagement
- Feels responsive and fair

**Why pulse animation on complete?**
- Draws attention to success
- Creates sense of accomplishment
- Shows all cards "celebrating"
- Visual reward for completion

### What This Phase Proves

1. **Match Detection**: Algorithm correctly identifies matches
2. **State Management**: Game tracks progress accurately
3. **Timing**: Delays feel appropriate and fair
4. **Celebration**: Feedback is rewarding and motivating
5. **Round Completion**: Win condition properly detected
6. **Replay Flow**: Player can easily play again

This completes the core game loop. Phase 36 will add polish, content variety, and difficulty options.
