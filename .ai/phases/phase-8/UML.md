# Phase 8: Letter Pop - Bubble Interaction - UML

## Class Diagram

```mermaid
classDiagram
    class GameScene {
        +Phaser.Sound.BaseSound popSound
        +Phaser.Sound.BaseSound letterASound
        +LetterBubble bubble
        +preload()
        +create()
    }

    class LetterBubble {
        +Phaser.GameObjects.Arc bubble
        +Phaser.GameObjects.Text letterText
        +Phaser.Scene scene
        +String letter
        +Boolean isPopped
        +constructor(scene, x, y, letter)
        +onPop()
        +destroy()
    }

    class PhaserInput {
        <<interface>>
        +setInteractive()
        +on(event, callback)
        +disableInteractive()
    }

    class PhaserTweens {
        <<interface>>
        +add(config)
    }

    class PhaserSound {
        <<interface>>
        +play(key)
    }

    GameScene --> LetterBubble : creates
    LetterBubble --> PhaserInput : uses
    LetterBubble --> PhaserTweens : uses
    LetterBubble --> PhaserSound : uses
```

## Sequence Diagram: Bubble Pop Interaction

```mermaid
sequenceDiagram
    actor Player
    participant Input as Phaser Input
    participant Bubble as LetterBubble
    participant Sound as Sound Manager
    participant Tweens as Tween Manager
    participant Scene as GameScene

    Player->>Input: Click/Tap bubble
    Input->>Bubble: pointerdown event
    Bubble->>Bubble: disableInteractive()

    Bubble->>Sound: play('pop')
    Sound-->>Player: Pop sound effect

    Bubble->>Scene: time.delayedCall(100ms)
    Scene->>Sound: play('letter-a')
    Sound-->>Player: "A" audio

    Bubble->>Tweens: add(scale + fade config)

    loop Animation (300ms)
        Tweens->>Bubble: Update scale to 1.5x
        Tweens->>Bubble: Update alpha to 0
        Bubble-->>Player: Visual feedback
    end

    Tweens->>Bubble: onComplete callback
    Bubble->>Bubble: destroy()
    Bubble->>Scene: Remove from scene
```

## State Diagram: Bubble Lifecycle

```mermaid
stateDiagram-v2
    [*] --> Floating: Bubble created
    Floating --> WaitingForInput: Interactive enabled
    WaitingForInput --> Popping: Player clicks

    state Popping {
        [*] --> DisableInput
        DisableInput --> PlayPopSound
        PlayPopSound --> StartAnimation
        StartAnimation --> PlayLetterSound
        PlayLetterSound --> AnimationComplete
        AnimationComplete --> [*]
    }

    Popping --> Destroyed: Animation complete
    Destroyed --> [*]
```

## Component Diagram

```mermaid
graph TB
    Player[Player Input] --> InputSystem[Phaser Input System]

    InputSystem --> Bubble[LetterBubble Instance]

    Bubble --> SoundMgr[Sound Manager]
    Bubble --> TweenMgr[Tween Manager]

    SoundMgr --> PopAudio[pop.mp3]
    SoundMgr --> LetterAudio[letter-a.mp3]

    TweenMgr --> BubbleSprite[Circle Sprite]
    TweenMgr --> LetterText[Text Object]

    BubbleSprite --> Canvas[Canvas Renderer]
    LetterText --> Canvas

    style Bubble fill:#90EE90
    style SoundMgr fill:#FFD700
    style TweenMgr fill:#87CEEB
```

## Activity Diagram: Pop Animation Flow

```mermaid
flowchart TD
    Start([Bubble Clicked]) --> Disable[Disable Interactive]
    Disable --> PopSound[Play 'pop' sound]
    PopSound --> StartTween[Start scale/fade tween]
    StartTween --> Delay[Wait 100ms]
    Delay --> LetterSound[Play 'letter-a' sound]

    LetterSound --> AnimLoop{Animation Running?}
    AnimLoop -->|Yes| UpdateScale[Update scale to 1.5x]
    UpdateScale --> UpdateAlpha[Update alpha to 0]
    UpdateAlpha --> AnimLoop

    AnimLoop -->|No| Complete[Tween onComplete]
    Complete --> DestroySprite[Destroy bubble sprite]
    DestroySprite --> DestroyText[Destroy letter text]
    DestroyText --> End([Bubble Removed])

    style Start fill:#90EE90
    style End fill:#FFB6C1
    style PopSound fill:#FFD700
    style LetterSound fill:#FFD700
```

## Object Diagram: Runtime Instance

```mermaid
graph LR
    subgraph Scene Instance
        GS[GameScene]
        SM[SoundManager]
        TM[TweenManager]
        TIM[TimeManager]
    end

    subgraph Bubble Instance
        LB[LetterBubble]
        BS[bubble: Circle]
        LT[letterText: Text]
    end

    subgraph Audio Assets
        PA[popSound: BaseSound]
        LA[letterASound: BaseSound]
    end

    GS --> LB
    LB --> BS
    LB --> LT

    LB -.-> SM
    LB -.-> TM
    LB -.-> TIM

    SM --> PA
    SM --> LA

    TM -.animate.-> BS
    TM -.animate.-> LT
```

## Event Flow Diagram

```mermaid
sequenceDiagram
    participant B as Bubble Sprite
    participant H as Event Handler
    participant S as Sound System
    participant T as Tween System
    participant M as Memory Manager

    Note over B: Idle state, floating upward

    B->>H: pointerdown event fires
    H->>B: disableInteractive()

    par Sound Effects
        H->>S: play('pop')
        Note over S: Pop sound plays<br/>immediately
        H->>S: delayedCall(100ms)
        S->>S: play('letter-a')
        Note over S: Letter audio plays<br/>after delay
    and Animation
        H->>T: tweens.add({scale, alpha})
        Note over T: Tween starts<br/>300ms duration
        loop Every frame
            T->>B: Update transform
        end
        T->>H: onComplete callback
    end

    H->>M: bubble.destroy()
    H->>M: letterText.destroy()
    M->>M: Cleanup references
    Note over B: Object removed from scene
```

## Timing Diagram

```mermaid
gantt
    title Bubble Pop Event Timeline
    dateFormat X
    axisFormat %L ms

    section User
    Click bubble :milestone, m1, 0, 0

    section Audio
    Pop sound plays :a1, 0, 50
    100ms delay :milestone, 100, 0
    Letter sound plays :a2, 100, 250

    section Animation
    Scale 1.0 to 1.5 :t1, 0, 300
    Alpha 1.0 to 0.0 :t2, 0, 300

    section Cleanup
    Destroy objects :milestone, m2, 300, 0
```

## Notes

### Why This Architecture?

**Event-Driven Design**
- Bubble responds to pointer events asynchronously
- Decoupled from game loop timing
- Easy to extend with additional effects

**Sound Sequencing**
- Pop sound provides immediate tactile feedback
- Letter sound follows to reinforce learning
- 100ms delay prevents audio overlap

**Animation Coordination**
- Tween handles smooth interpolation automatically
- onComplete callback ensures proper cleanup
- All animations run on game object references

**Resource Management**
- disableInteractive() prevents double-clicks
- destroy() properly removes objects from memory
- No memory leaks from abandoned tweens

### Phaser-Specific Patterns

**Interactive Game Objects**
```javascript
// Enable pointer events on any display object
sprite.setInteractive();

// Listen for pointer events
sprite.on('pointerdown', callback);
sprite.on('pointerover', callback);
sprite.on('pointerout', callback);

// Disable when done
sprite.disableInteractive();
```

**Tween System**
```javascript
// Phaser tweens handle smooth animation
this.tweens.add({
    targets: [object1, object2],  // Can animate multiple objects
    scaleX: 1.5,                  // Target property
    scaleY: 1.5,
    alpha: 0,
    duration: 300,                // Milliseconds
    ease: 'Power2',               // Easing function
    onComplete: callback          // Cleanup callback
});
```

**Sound Management**
```javascript
// Preload in scene
this.load.audio('key', 'path/to/audio.mp3');

// Play from anywhere in scene
this.sound.play('key');

// With options
this.sound.play('key', {
    volume: 0.5,
    loop: false
});
```

**Delayed Execution**
```javascript
// Execute callback after delay (milliseconds)
this.time.delayedCall(100, () => {
    // Code runs after 100ms
});
```

### What This Phase Proves

1. **User Input Works**: Pointer events are properly configured
2. **Audio System Works**: Sounds load and play correctly
3. **Animation System Works**: Tweens run smoothly
4. **Timing Works**: Delayed callbacks execute properly
5. **Memory Management Works**: Objects are properly destroyed
6. **Visual Feedback Works**: Player sees immediate response

This establishes the core interaction pattern for the entire game.
