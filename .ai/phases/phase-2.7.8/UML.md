# Phase 2.7.8: Letter Pop Game - UML Architecture

## Overview

This document contains Mermaid diagrams showing the architecture, data flow, and interactions for the Letter Pop game implementation.

---

## 1. Class Diagram

```mermaid
classDiagram
    class LetterPopScreen {
        -ReadingGame game
        -ResponsiveUtils responsive
        -ShapeRenderer shapeRenderer
        -AudioManager audioManager
        -Preferences prefs
        -int timePerLetter
        -String letterCase
        -List~String~ roundLetters
        -int currentLetterIndex
        -String targetLetter
        -int score
        -float timeRemaining
        -List~Bubble~ bubbles
        -GradientBackground background
        -TitleText titleText
        -Button homeButton
        -TimerBar timerBar
        -BalloonIcon balloonIcon
        -boolean isFadingOut
        -float fadeAlpha
        +show()
        +render(delta)
        +dispose()
        -loadSettings()
        -createComponents()
        -startRound()
        -nextLetter()
        -applyLetterCase(letter)
        -playTargetLetterAudio()
        -spawnBubbles()
        -handleBubbleClick(bubble)
        -handleCorrectAnswer(bubble)
        -handleIncorrectAnswer(bubble)
        -handleTimeExpired()
        -handleRoundComplete()
        -navigateToMainMenu()
        -updateBubbles(delta)
        -resolveCollision(bubbleA, bubbleB)
    }

    class Bubble {
        +String letter
        +Vector2 position
        +Vector2 velocity
        +Circle bounds
        +float scale
        +boolean isSmooshing
        +boolean isDestroyed
        -float radius
        -BitmapFont letterFont
        -float scaleX
        -float scaleY
        -float smooshTime
        +setVelocity(vx, vy)
        +update(delta)
        +smoosh()
        +bounceX()
        +bounceY()
        +render(batch, shapeRenderer)
        +contains(x, y)
        +pop(onComplete)
        +dispose()
    }

    class TimerBar {
        -float x
        -float y
        -float width
        -float height
        -float progress
        -float cornerRadius
        +setProgress(value)
        +render(batch, shapeRenderer)
        +dispose()
        -getBarColor()
    }

    class GradientBackground {
        +render(batch, shapeRenderer, delta)
    }

    class TitleText {
        +render(batch, delta)
    }

    class Button {
        +handleTouch(x, y)
        +render(batch, delta)
    }

    class BalloonIcon {
        +render(batch, delta)
    }

    class AudioManager {
        +playSfx(key, volume)
        +playVoice(key)
    }

    class FontManager {
        +getFont(size, color, borderWidth, borderColor)
    }

    class ResponsiveUtils {
        +scaleX(percent)
        +scaleY(percent)
        +getFontSize(size)
        +getWorldBounds()
    }

    class Preferences {
        +getInteger(key, default)
        +getString(key, default)
    }

    LetterPopScreen --> Bubble : manages
    LetterPopScreen --> TimerBar : uses
    LetterPopScreen --> GradientBackground : uses
    LetterPopScreen --> TitleText : uses
    LetterPopScreen --> Button : uses
    LetterPopScreen --> BalloonIcon : uses
    LetterPopScreen --> AudioManager : uses
    LetterPopScreen --> FontManager : uses
    LetterPopScreen --> ResponsiveUtils : uses
    LetterPopScreen --> Preferences : reads settings
    Bubble --> FontManager : uses
    Bubble --> ResponsiveUtils : uses
    TimerBar --> ResponsiveUtils : uses
```

---

## 2. Game Initialization Sequence

```mermaid
sequenceDiagram
    participant User
    participant MainMenu
    participant LetterPopMenu
    participant LetterPopScreen
    participant Prefs as Preferences
    participant Audio as AudioManager

    User->>MainMenu: Click "Letter Pop"
    MainMenu->>LetterPopMenu: Navigate
    User->>LetterPopMenu: Click "START GAME"
    LetterPopMenu->>LetterPopScreen: Create screen
    LetterPopScreen->>Prefs: Load game settings
    Prefs-->>LetterPopScreen: timePerLetter, letterCase
    LetterPopScreen->>LetterPopScreen: createComponents()
    Note over LetterPopScreen: Create background, UI, timer
    LetterPopScreen->>LetterPopScreen: startRound()
    LetterPopScreen->>LetterPopScreen: Generate 10 random letters
    LetterPopScreen->>LetterPopScreen: nextLetter()
    LetterPopScreen->>Audio: playVoice(target letter)
    LetterPopScreen->>LetterPopScreen: spawnBubbles()
    Note over LetterPopScreen: Create 6 bubbles with physics
    LetterPopScreen->>User: Render game screen
```

---

## 3. Bubble Click Handling - Correct Answer

```mermaid
sequenceDiagram
    participant User
    participant Screen as LetterPopScreen
    participant Bubble
    participant Audio as AudioManager

    User->>Screen: Touch bubble
    Screen->>Bubble: contains(touchX, touchY)?
    Bubble-->>Screen: true
    Screen->>Screen: handleBubbleClick(bubble)
    Screen->>Screen: Check if letter matches
    alt Letter matches target
        Screen->>Screen: handleCorrectAnswer(bubble)
        Screen->>Audio: playSfx("correctAnswer")
        Screen->>Screen: Increment score
        Screen->>Bubble: pop(onComplete)
        Note over Bubble: Pop animation plays
        Bubble-->>Screen: Animation complete
        Screen->>Screen: currentLetterIndex++
        Screen->>Screen: nextLetter()
        Screen->>Screen: spawnBubbles()
        Note over Screen: New bubbles for next letter
    end
```

---

## 4. Bubble Click Handling - Incorrect Answer

```mermaid
sequenceDiagram
    participant User
    participant Screen as LetterPopScreen
    participant Bubble
    participant Audio as AudioManager

    User->>Screen: Touch bubble
    Screen->>Bubble: contains(touchX, touchY)?
    Bubble-->>Screen: true
    Screen->>Screen: handleBubbleClick(bubble)
    Screen->>Screen: Check if letter matches
    alt Letter does NOT match target
        Screen->>Screen: handleIncorrectAnswer(bubble)
        Screen->>Audio: playSfx("tryAgain", volume: 0.3)
        Note over Screen: Gentle feedback sound
        Screen->>Bubble: Apply wobble animation
        Note over Bubble: Bubble stays (non-punitive)
        Note over Screen: No score penalty
        Note over Screen: User can try again
    end
```

---

## 5. Timer Countdown and Expiration

```mermaid
sequenceDiagram
    participant Timer as TimerBar
    participant Screen as LetterPopScreen
    participant Audio as AudioManager

    loop Every frame (delta)
        Screen->>Screen: Update timeRemaining -= delta
        Screen->>Timer: setProgress(timeRemaining / timePerLetter)
        Timer->>Timer: Update visual color
        Note over Timer: Green → Yellow → Red

        alt timeRemaining <= 0
            Screen->>Screen: handleTimeExpired()
            Note over Screen: Non-punitive timeout
            Screen->>Screen: currentLetterIndex++
            Screen->>Screen: nextLetter()
            Screen->>Audio: playVoice(new target letter)
            Screen->>Screen: spawnBubbles()
            Note over Screen: New bubbles for next letter
        end
    end
```

---

## 6. Bubble Physics Update

```mermaid
sequenceDiagram
    participant Screen as LetterPopScreen
    participant BubbleA as Bubble A
    participant BubbleB as Bubble B

    loop Every frame (delta)
        Screen->>BubbleA: update(delta)
        BubbleA->>BubbleA: position += velocity * delta
        BubbleA->>BubbleA: Update bounds

        Screen->>Screen: Check wall collisions
        alt Bubble hits left/right wall
            Screen->>BubbleA: bounceX()
            BubbleA->>BubbleA: velocity.x = -velocity.x
            Screen->>BubbleA: smoosh()
        end

        alt Bubble hits top/bottom wall
            Screen->>BubbleA: bounceY()
            BubbleA->>BubbleA: velocity.y = -velocity.y
            Screen->>BubbleA: smoosh()
        end

        Screen->>Screen: Check bubble-bubble collisions
        alt BubbleA overlaps BubbleB
            Screen->>Screen: resolveCollision(A, B)
            Note over Screen: Elastic collision physics
            Screen->>BubbleA: Update velocity
            Screen->>BubbleB: Update velocity
            Screen->>BubbleA: smoosh()
            Screen->>BubbleB: smoosh()
        end
    end
```

---

## 7. Round Completion

```mermaid
sequenceDiagram
    participant User
    participant Screen as LetterPopScreen
    participant Audio as AudioManager
    participant MainMenu

    Screen->>Screen: nextLetter()
    Screen->>Screen: Check currentLetterIndex >= 10

    alt Round complete (all 10 letters)
        Screen->>Screen: handleRoundComplete()
        Screen->>Audio: playSfx("success")
        Note over Screen: Show final score: X / 10

        alt Results screen exists
            Screen->>ResultsScreen: Navigate with score data
        else Results screen TODO
            Screen->>Screen: navigateToMainMenu()
            Screen->>Screen: isFadingOut = true
            Note over Screen: Fade-out animation (0.3s)
            Screen->>MainMenu: Navigate
        end
    end
```

---

## 8. State Machine

```mermaid
stateDiagram-v2
    [*] --> Initializing
    Initializing --> TitleShowing : Load settings, create components
    TitleShowing --> Playing : Title fades (1s delay)

    state Playing {
        [*] --> WaitingForInput
        WaitingForInput --> CheckingAnswer : Bubble clicked
        CheckingAnswer --> Correct : Letter matches
        CheckingAnswer --> Incorrect : Letter doesn't match

        Correct --> NextLetter : Increment score, pop bubble
        Incorrect --> WaitingForInput : Gentle feedback, no penalty

        WaitingForInput --> TimeExpired : Timer reaches 0
        TimeExpired --> NextLetter : No penalty

        NextLetter --> SpawningBubbles : currentLetterIndex++
        SpawningBubbles --> WaitingForInput : New bubbles created

        SpawningBubbles --> RoundComplete : currentLetterIndex >= 10
    }

    Playing --> FadingOut : Home button clicked
    Playing --> RoundComplete : All 10 letters complete

    RoundComplete --> Results : Show final score
    Results --> FadingOut : User clicks continue

    FadingOut --> [*] : Return to Main Menu
```

---

## 9. Component Interaction Diagram

```mermaid
graph TD
    A[LetterPopScreen] --> B[GradientBackground]
    A --> C[TitleText]
    A --> D[BalloonIcon]
    A --> E[TimerBar]
    A --> F[Button - Home]
    A --> G[Bubble 1]
    A --> H[Bubble 2]
    A --> I[Bubble 3]
    A --> J[Bubble 4]
    A --> K[Bubble 5]
    A --> L[Bubble 6]

    A --> M[AudioManager]
    A --> N[FontManager]
    A --> O[ResponsiveUtils]
    A --> P[Preferences]

    G --> N
    H --> N
    I --> N
    J --> N
    K --> N
    L --> N

    E --> O
    G --> O

    style A fill:#9C27B0,color:#fff
    style M fill:#FF6B6B,color:#fff
    style N fill:#4CAF50,color:#fff
    style O fill:#2196F3,color:#fff
    style P fill:#FF9800,color:#fff
```

---

## 10. Data Flow - Settings Application

```mermaid
flowchart LR
    A[LetterPopMenuScreen] -->|Save settings| B[Preferences]
    B -->|Store| C{Settings}
    C --> D[timePerLetter: 5-15s]
    C --> E[letterCase: uppercase/lowercase/mixed]

    F[LetterPopScreen] -->|Load settings| B
    B -->|Retrieve| F

    F -->|Apply| G[Timer Duration]
    F -->|Apply| H[Letter Generation]

    H -->|Generate letters| I[roundLetters array]
    I -->|Apply case| J[applyLetterCase]
    J --> K{letterCase}
    K -->|uppercase| L[A, B, C...]
    K -->|lowercase| M[a, b, c...]
    K -->|mixed| N[A, b, C, d...]

    style B fill:#FF9800,color:#fff
    style F fill:#9C27B0,color:#fff
    style I fill:#4CAF50,color:#fff
```

---

## 11. Physics Collision Resolution

```mermaid
flowchart TD
    A[Detect Bubble Overlap] --> B{Distance < 2*radius?}
    B -->|No| C[Continue]
    B -->|Yes| D[Calculate Collision Normal]

    D --> E[Calculate Relative Velocity]
    E --> F{Velocities Separating?}
    F -->|Yes| C
    F -->|No| G[Calculate Bounce Impulse]

    G --> H[Update Bubble A Velocity]
    G --> I[Update Bubble B Velocity]

    H --> J[Separate Overlapping Bubbles]
    I --> J

    J --> K[Play Smoosh Animation]
    K --> L[Play Collision Sound]
    L --> C

    style A fill:#2196F3,color:#fff
    style G fill:#FF6B6B,color:#fff
    style K fill:#9C27B0,color:#fff
```

---

## 12. Memory Management

```mermaid
flowchart TD
    A[LetterPopScreen.show] --> B[Create Components]
    B --> C[Allocate Bubble Array]
    B --> D[Create UI Elements]
    B --> E[Create ShapeRenderer]

    F[LetterPopScreen.render] --> G{New letter?}
    G -->|Yes| H[Clear Old Bubbles]
    H --> I[Call dispose on each Bubble]
    I --> J[Clear bubbles array]
    J --> K[Create New Bubbles]
    K --> L[Add to bubbles array]

    M[LetterPopScreen.dispose] --> N[Dispose All Bubbles]
    N --> O[Dispose ShapeRenderer]
    O --> P[Cleanup Complete]

    style H fill:#FF6B6B,color:#fff
    style I fill:#FF6B6B,color:#fff
    style N fill:#FF6B6B,color:#fff
    style O fill:#FF6B6B,color:#fff
```

---

## 13. Touch Input Flow

```mermaid
flowchart TD
    A[User Touches Screen] --> B[Get Touch Coordinates]
    B --> C[Flip Y Coordinate]
    C --> D{Home Button?}
    D -->|Yes| E[navigateToMainMenu]
    D -->|No| F[Check Each Bubble]

    F --> G{Bubble Contains Touch?}
    G -->|No| H[Next Bubble]
    G -->|Yes| I[handleBubbleClick]

    I --> J{Letter Matches Target?}
    J -->|Yes| K[handleCorrectAnswer]
    J -->|No| L[handleIncorrectAnswer]

    K --> M[Play Success Sound]
    K --> N[Increment Score]
    K --> O[Pop Bubble Animation]
    K --> P[Next Letter]

    L --> Q[Play Try Again Sound]
    L --> R[Wobble Animation]
    L --> S[Bubble Stays]

    E --> T[Fade Out Animation]
    T --> U[Return to Main Menu]

    style K fill:#4CAF50,color:#fff
    style L fill:#FF9800,color:#fff
    style U fill:#2196F3,color:#fff
```

---

## 14. Animation Timeline

```mermaid
gantt
    title Letter Pop Game Animation Timeline
    dateFormat X
    axisFormat %s

    section Screen Entry
    Fade In                    :0, 300ms
    Title Bounce In           :0, 500ms
    Balloon Float             :0, 800ms

    section First Letter
    Title Visible             :1000, 800ms
    Title Fade Out            :1800, 800ms
    Voice Plays               :1000, 2000ms
    Bubbles Spawn             :1000, 300ms

    section Gameplay Loop
    Bubbles Float             :1000, 10000ms
    Timer Countdown           :1000, 10000ms
    Smoosh Animation          :3000, 120ms
    Bubble Pop (correct)      :5000, 300ms
    Next Letter Spawns        :5300, 300ms

    section Screen Exit
    Fade Out                  :done, 300ms
```

---

## 15. Architecture Layers

```mermaid
graph TB
    subgraph Presentation Layer
        A[LetterPopScreen]
    end

    subgraph Component Layer
        B[Bubble]
        C[TimerBar]
        D[GradientBackground]
        E[TitleText]
        F[Button]
        G[BalloonIcon]
    end

    subgraph Service Layer
        H[AudioManager]
        I[FontManager]
    end

    subgraph Utility Layer
        J[ResponsiveUtils]
    end

    subgraph Data Layer
        K[Preferences]
    end

    subgraph Framework Layer
        L[libGDX Screen]
        M[libGDX Graphics]
        N[libGDX Audio]
    end

    A --> B
    A --> C
    A --> D
    A --> E
    A --> F
    A --> G

    A --> H
    A --> I
    A --> J
    A --> K

    B --> I
    B --> J
    C --> J

    H --> N
    I --> M

    A --> L
    B --> M
    C --> M

    style A fill:#9C27B0,color:#fff
    style H fill:#FF6B6B,color:#fff
    style I fill:#4CAF50,color:#fff
    style J fill:#2196F3,color:#fff
    style K fill:#FF9800,color:#fff
```

---

## Notes

### Design Decisions

1. **Physics-Based Movement**
   - Bubbles use velocity vectors for realistic floating
   - Elastic collisions for bouncing behavior
   - Smoosh animations add visual feedback

2. **Non-Punitive Feedback**
   - Incorrect answers play gentle sound
   - No score deduction
   - Bubble remains for retry
   - Timer expiration advances without penalty

3. **Settings Integration**
   - Preferences loaded on screen creation
   - Time limit applied to timer
   - Letter case applied to all generated letters

4. **Memory Management**
   - Bubbles disposed when letters change
   - ShapeRenderer reused across frames
   - Fonts cached by FontManager

5. **Touch Input**
   - Touch coordinates flipped for libGDX
   - Bubble contains() uses Circle collision
   - Home button checked before bubbles

### Performance Considerations

1. **Object Pooling**
   - Consider pooling Bubble objects for future optimization
   - ShapeRenderer shared across components

2. **Collision Detection**
   - O(n²) bubble collision check acceptable for 6 bubbles
   - Spatial partitioning not needed for small count

3. **Rendering**
   - Batch.begin/end minimized
   - ShapeRenderer used for circles (better than textures)

4. **Audio**
   - AudioManager handles volume and playback
   - Sounds preloaded in LoadingScreen

---

**Created:** Phase 2.7.8 Planning
**Technology:** Kotlin + libGDX
**Target:** Samsung Galaxy Tab S7 FE (2560x1600)
