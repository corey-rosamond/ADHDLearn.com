# Phase 5: Main Menu UI - UML

## Class Diagram

```mermaid
classDiagram
    class MainMenuScene {
        -Graphics gradientBg
        -Text titleText
        -Rectangle buttonBg
        -Text buttonText
        -Sound buttonClickSound
        +constructor()
        +preload()
        +create()
        +createGradientBackground()
        +createStartButton()
        +handleButtonHover()
        +handleButtonOut()
        +handleButtonClick()
    }

    class LetterPopScene {
        -Text placeholderText
        -Text backButton
        +constructor()
        +create()
    }

    class PhaserScene {
        <<Phaser.Scene>>
        +add
        +load
        +sound
        +tweens
        +scene
        +cameras
    }

    class Button {
        -Rectangle background
        -Text label
        -Boolean isHovered
        -Number defaultScale
        -Number hoverScale
        +setInteractive()
        +on(event, callback)
    }

    class AudioManager {
        <<Phaser.Sound>>
        +play(key)
        +stop(key)
    }

    PhaserScene <|-- MainMenuScene
    PhaserScene <|-- LetterPopScene
    MainMenuScene --> Button : creates
    MainMenuScene --> AudioManager : uses
    MainMenuScene ..> LetterPopScene : transitions to
```

## Sequence Diagram: User Interaction Flow

```mermaid
sequenceDiagram
    actor User
    participant Game as Phaser Game
    participant MainMenu as MainMenuScene
    participant Button as START Button
    participant Audio as AudioManager
    participant Tweens as Tween System
    participant LetterPop as LetterPopScene

    User->>Game: Open game
    Game->>MainMenu: Create scene
    MainMenu->>MainMenu: createGradientBackground()
    MainMenu->>MainMenu: createStartButton()
    MainMenu-->>User: Display menu with button

    User->>Button: Hover over button
    Button->>MainMenu: pointerover event
    MainMenu->>Tweens: Scale up button (1.0 → 1.1)
    Tweens-->>Button: Animate
    Button-->>User: Visual feedback (larger)

    User->>Button: Move away
    Button->>MainMenu: pointerout event
    MainMenu->>Tweens: Scale down button (1.1 → 1.0)
    Tweens-->>Button: Animate
    Button-->>User: Visual feedback (normal)

    User->>Button: Click button
    Button->>MainMenu: pointerdown event
    MainMenu->>Audio: play('buttonClick')
    Audio-->>User: Play sound
    MainMenu->>Tweens: Scale down (1.0 → 0.95)
    Tweens->>Tweens: Yoyo back (0.95 → 1.0)
    Tweens->>MainMenu: onComplete callback
    MainMenu->>Game: scene.start('LetterPopScene')
    Game->>LetterPop: Create scene
    LetterPop-->>User: Display game placeholder
```

## State Diagram: Button States

```mermaid
stateDiagram-v2
    [*] --> Idle: Button Created
    Idle --> Hovered: Mouse Enter
    Hovered --> Idle: Mouse Leave
    Hovered --> Pressed: Mouse Down
    Pressed --> Animating: Play Sound & Animation
    Animating --> Transitioning: Animation Complete
    Transitioning --> [*]: Scene Changed
```

## Scene Transition Diagram

```mermaid
graph TB
    Start([Game Start]) --> MainMenu[MainMenuScene]
    MainMenu --> |User clicks START| Transition{Transition}
    Transition --> |Play Sound| Sound[Audio Feedback]
    Transition --> |Animate| Anim[Button Animation]
    Sound --> LetterPop[LetterPopScene]
    Anim --> LetterPop
    LetterPop --> |Back Button| MainMenu

    style MainMenu fill:#90EE90
    style LetterPop fill:#FFB6C1
    style Transition fill:#FFD700
```

## UI Component Hierarchy

```mermaid
graph TB
    MainMenu[MainMenuScene]
    MainMenu --> BG[Gradient Background]
    MainMenu --> Title[Title Text]
    MainMenu --> ButtonContainer[Button Container]

    ButtonContainer --> ButtonBG[Button Background Rectangle]
    ButtonContainer --> ButtonText[Button Text START]
    ButtonContainer --> Interactive[Interactive Area]

    Interactive --> Events[Event Handlers]
    Events --> HoverIn[pointerover]
    Events --> HoverOut[pointerout]
    Events --> Click[pointerdown]

    HoverIn --> ScaleUp[Scale Tween 1.0→1.1]
    HoverOut --> ScaleDown[Scale Tween 1.1→1.0]
    Click --> ClickSeq[Click Sequence]

    ClickSeq --> PlaySound[Play buttonClick]
    ClickSeq --> PressAnim[Press Animation 1.0→0.95→1.0]
    ClickSeq --> SceneChange[Start LetterPopScene]

    style MainMenu fill:#E6E6FA
    style ButtonContainer fill:#98FB98
    style Events fill:#FFE4B5
    style ClickSeq fill:#FFA07A
```

## Activity Diagram: Button Click Flow

```mermaid
flowchart TD
    Start([User Clicks Button]) --> CheckSound{Sound Loaded?}
    CheckSound -->|Yes| PlaySound[Play Click Sound]
    CheckSound -->|No| SkipSound[Skip Sound]
    PlaySound --> StartAnim
    SkipSound --> StartAnim

    StartAnim[Start Scale Down Animation] --> Wait[Wait 100ms]
    Wait --> Yoyo[Scale Back Up Yoyo]
    Yoyo --> Complete{Animation Complete?}
    Complete -->|Yes| Transition[scene.start LetterPopScene]
    Complete -->|No| Wait
    Transition --> End([Scene Changes])

    style Start fill:#90EE90
    style PlaySound fill:#87CEEB
    style Transition fill:#FFB6C1
    style End fill:#DDA0DD
```

## Component Interaction Diagram

```mermaid
graph LR
    User[User Input] --> |Hover| Button[START Button]
    User --> |Click| Button

    Button --> |pointerover| TweenMgr[Tween Manager]
    Button --> |pointerout| TweenMgr
    Button --> |pointerdown| Handler[Click Handler]

    TweenMgr --> |Scale Animation| Visual[Visual Feedback]
    Handler --> AudioMgr[Audio Manager]
    Handler --> TweenMgr
    Handler --> SceneMgr[Scene Manager]

    AudioMgr --> |Play Sound| Speaker[Audio Output]
    SceneMgr --> |Transition| LetterPop[LetterPopScene]

    Visual --> |Update| Screen[Display]
    LetterPop --> |Render| Screen
```

## Data Flow Diagram

```mermaid
flowchart LR
    A[MainMenuScene.create] --> B[Create Graphics]
    B --> C[Draw Gradient Background]
    C --> D[Create Title Text]
    D --> E[Create Button Elements]

    E --> F[Rectangle Background]
    E --> G[Text Label]

    F --> H[Set Interactive]
    G --> H

    H --> I[Register Event Handlers]
    I --> J[pointerover handler]
    I --> K[pointerout handler]
    I --> L[pointerdown handler]

    L --> M[Audio System]
    L --> N[Tween System]
    L --> O[Scene Manager]

    M --> P[Sound Output]
    N --> Q[Visual Animation]
    O --> R[LetterPopScene]
```

## Gradient Creation Algorithm

```mermaid
flowchart TD
    Start([Start Gradient]) --> Init[Initialize Graphics Object]
    Init --> SetColors[Define Color Array]
    SetColors --> GetHeight[Get Canvas Height]
    GetHeight --> Loop{For each pixel row}

    Loop -->|i < height| CalcProgress[Calculate Progress = i/height]
    CalcProgress --> Interpolate[Interpolate Between Colors]
    Interpolate --> SetStyle[Set Fill Style]
    SetStyle --> DrawLine[Fill Rectangle 1px high]
    DrawLine --> Increment[i++]
    Increment --> Loop

    Loop -->|i >= height| Complete([Gradient Complete])

    style Start fill:#90EE90
    style Loop fill:#FFE4B5
    style Complete fill:#98FB98
```

## Scene Management State

```mermaid
stateDiagram-v2
    [*] --> Init: Game Loads
    Init --> MainMenuActive: Create MainMenuScene

    MainMenuActive --> ButtonIdle: Button Ready
    ButtonIdle --> ButtonHover: Mouse Over
    ButtonHover --> ButtonIdle: Mouse Out
    ButtonHover --> ButtonPressed: Click

    ButtonPressed --> PlayingSound: Audio Trigger
    PlayingSound --> Animating: Visual Feedback
    Animating --> SceneTransition: Animation Done

    SceneTransition --> MainMenuInactive: Stop MainMenu
    MainMenuInactive --> LetterPopActive: Start LetterPop

    LetterPopActive --> [*]: Scene Running
```

## Notes

### Architecture Decisions

**Scene Structure**
- MainMenuScene extends Phaser.Scene directly
- Keeps all UI creation in create() method
- Helper methods for organization (createGradientBackground, createStartButton)
- Single responsibility: display menu and handle START interaction

**Button Implementation**
- Composite of Rectangle (background) and Text (label)
- Both elements animated together for unified effect
- Interactive area set on Rectangle, not Text (larger hit area)
- Event handlers directly on button object (no separate Button class needed for Phase 5)

**Animation Strategy**
- Phaser tweens for all animations (smooth, performant)
- Hover: 200ms scale to 1.1
- Press: 100ms scale to 0.95, yoyo back
- onComplete callback ensures scene transition happens after animation

**Audio Integration**
- Sound loaded in preload()
- Played on button press (not hover - less overwhelming)
- Graceful degradation if sound not available

### Why This Design?

**Simplicity**
- No custom Button class yet (overkill for one button)
- Direct event handlers (clear cause and effect)
- Inline animations (easy to tweak)

**Performance**
- Gradient drawn once in create()
- Tweens managed by Phaser (optimized)
- Minimal objects in scene graph

**Extensibility**
- Easy to add more buttons later
- Can extract Button class in future phases
- Scene transition pattern reusable

**ADHD-Friendly**
- Immediate visual feedback (hover)
- Audio confirmation (click)
- Smooth animations (not jarring)
- Clear visual hierarchy (button stands out)

### Component Relationships

1. **MainMenuScene owns all components**
   - Creates gradient background
   - Creates title text
   - Creates button elements
   - Manages event handlers

2. **Button is composite of two game objects**
   - Rectangle provides visual background and interactive area
   - Text provides label
   - Both animated together via tween targets array

3. **Event handlers coordinate systems**
   - Hover handlers → Tween system (visual)
   - Click handler → Audio system (sound)
   - Click handler → Tween system (animation)
   - Click handler → Scene system (transition)

4. **Scene transition is one-way**
   - MainMenu → LetterPop
   - LetterPop has back button for testing
   - Later phases will handle proper game flow

This architecture is intentionally simple for Phase 5, but structured to allow easy refactoring as the game grows in complexity.
