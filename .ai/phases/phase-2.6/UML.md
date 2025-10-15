# Phase 2.6: UML Diagrams

## Component Architecture Overview

This document provides visual representations of the refactored component architecture using Mermaid diagrams.

---

## 1. Component Class Diagram

Shows the structure of all new components and their relationships.

```mermaid
classDiagram
    class ThemeConfig {
        <<static>>
        +COLORS: object
        +FONTS: object
        +ANIMATIONS: object
        +GRADIENT: object
    }

    class BackgroundComponent {
        <<static>>
        +createGradient(scene, gradientKey) Image
        +clearCache(scene, gradientKey) void
    }

    class TitleComponent {
        <<static>>
        +THEMES: object
        +create(scene, config) Text
        +createMultiLine(scene, lines, config) Text[]
        -animateBounceIn(scene, text, pulseOnComplete) void
    }

    class ButtonComponent {
        <<static>>
        +STYLES: object
        +create(scene, config) object
        +createBackButton(scene, config) object
        -addIdleBounce(scene, targets, originalY) void
        -addHoverEffect(scene, button, text, scale) void
        -addClickHandler(scene, button, text, style, scale, onClick) void
    }

    class DecorationsComponent {
        <<static>>
        +createFloatingStars(scene, config) Text[]
        +createTwinklingStars(scene, config) Text[]
    }

    class SliderComponent {
        <<static>>
        +create(scene, config) object
    }

    class VisibilityHandlerMixin {
        <<static>>
        +setup(scene, sceneKey) void
        +cleanup(scene) void
    }

    %% Dependencies
    BackgroundComponent ..> ThemeConfig : uses
    TitleComponent ..> ThemeConfig : uses
    ButtonComponent ..> ThemeConfig : uses
    DecorationsComponent ..> ThemeConfig : uses
    SliderComponent ..> ThemeConfig : uses
```

---

## 2. Scene Architecture - Before vs After

### Before Refactoring

```mermaid
graph TD
    MainMenuScene[MainMenuScene<br/>~650 lines]
    SettingsScene[SettingsScene<br/>~350 lines]
    LetterPopMenuScene[LetterPopMenuScene<br/>~565 lines]
    ResultsScene[ResultsScene<br/>~400 lines]
    LetterTestScene[LetterTestScene<br/>~235 lines]

    MainMenuScene --> |"Duplicates 200+ lines"|Background1[Background Code]
    MainMenuScene --> |"Duplicates 100+ lines"|Title1[Title Code]
    MainMenuScene --> |"Duplicates 80+ lines"|Button1[Button Code]
    MainMenuScene --> |"Duplicates 40+ lines"|Stars1[Stars Code]

    SettingsScene --> |"Duplicates 200+ lines"|Background2[Background Code]
    SettingsScene --> |"Duplicates 100+ lines"|Title2[Title Code]
    SettingsScene --> |"Duplicates 140+ lines"|Slider1[Slider Code]
    SettingsScene --> |"Duplicates 40+ lines"|Stars2[Stars Code]

    LetterPopMenuScene --> |"Duplicates 200+ lines"|Background3[Background Code]
    LetterPopMenuScene --> |"Duplicates 100+ lines"|Title3[Title Code]
    LetterPopMenuScene --> |"Duplicates 140+ lines"|Slider2[Slider Code]

    ResultsScene --> |"Duplicates 200+ lines"|Background4[Background Code]
    ResultsScene --> |"Duplicates 40+ lines"|Stars3[Stars Code]

    LetterTestScene --> |"Duplicates 200+ lines"|Background5[Background Code]

    style Background1 fill:#ff6b6b
    style Background2 fill:#ff6b6b
    style Background3 fill:#ff6b6b
    style Background4 fill:#ff6b6b
    style Background5 fill:#ff6b6b
    style Title1 fill:#ff4081
    style Title2 fill:#ff4081
    style Title3 fill:#ff4081
    style Stars1 fill:#00e676
    style Stars2 fill:#00e676
    style Stars3 fill:#00e676
```

### After Refactoring

```mermaid
graph TD
    MainMenuScene[MainMenuScene<br/>~350 lines<br/>-46% reduction]
    SettingsScene[SettingsScene<br/>~100 lines<br/>-71% reduction]
    LetterPopMenuScene[LetterPopMenuScene<br/>~300 lines<br/>-47% reduction]
    ResultsScene[ResultsScene<br/>~250 lines<br/>-38% reduction]
    LetterTestScene[LetterTestScene<br/>~150 lines<br/>-36% reduction]

    %% All scenes use components
    MainMenuScene --> BackgroundComponent
    MainMenuScene --> TitleComponent
    MainMenuScene --> ButtonComponent
    MainMenuScene --> DecorationsComponent
    MainMenuScene --> VisibilityHandlerMixin

    SettingsScene --> BackgroundComponent
    SettingsScene --> TitleComponent
    SettingsScene --> ButtonComponent
    SettingsScene --> SliderComponent
    SettingsScene --> DecorationsComponent
    SettingsScene --> VisibilityHandlerMixin

    LetterPopMenuScene --> BackgroundComponent
    LetterPopMenuScene --> TitleComponent
    LetterPopMenuScene --> ButtonComponent
    LetterPopMenuScene --> SliderComponent
    LetterPopMenuScene --> DecorationsComponent

    ResultsScene --> BackgroundComponent
    ResultsScene --> TitleComponent
    ResultsScene --> ButtonComponent
    ResultsScene --> DecorationsComponent
    ResultsScene --> VisibilityHandlerMixin

    LetterTestScene --> BackgroundComponent
    LetterTestScene --> TitleComponent
    LetterTestScene --> ButtonComponent

    %% Components layer
    BackgroundComponent[BackgroundComponent<br/>Single Source]
    TitleComponent[TitleComponent<br/>Single Source]
    ButtonComponent[ButtonComponent<br/>Single Source]
    DecorationsComponent[DecorationsComponent<br/>Single Source]
    SliderComponent[SliderComponent<br/>Single Source]
    VisibilityHandlerMixin[VisibilityHandlerMixin<br/>Single Source]

    %% All components use theme
    BackgroundComponent --> ThemeConfig
    TitleComponent --> ThemeConfig
    ButtonComponent --> ThemeConfig
    DecorationsComponent --> ThemeConfig
    SliderComponent --> ThemeConfig

    style BackgroundComponent fill:#4caf50
    style TitleComponent fill:#4caf50
    style ButtonComponent fill:#4caf50
    style DecorationsComponent fill:#4caf50
    style SliderComponent fill:#4caf50
    style VisibilityHandlerMixin fill:#4caf50
    style ThemeConfig fill:#2196f3
```

---

## 3. Component Interaction - Settings Scene Example

Shows how SettingsScene interacts with components after refactoring.

```mermaid
sequenceDiagram
    participant User
    participant SettingsScene
    participant BackgroundComp as BackgroundComponent
    participant TitleComp as TitleComponent
    participant SliderComp as SliderComponent
    participant ButtonComp as ButtonComponent
    participant DecoComp as DecorationsComponent
    participant VisibilityMixin as VisibilityHandlerMixin
    participant ThemeConfig

    User->>SettingsScene: Navigate to Settings

    SettingsScene->>BackgroundComp: createGradient(this, 'settingsBg')
    BackgroundComp->>ThemeConfig: Get GRADIENT colors
    BackgroundComp-->>SettingsScene: Return background image

    SettingsScene->>TitleComp: create(this, {text: 'SETTINGS'})
    TitleComp->>ThemeConfig: Get FONTS, COLORS
    TitleComp-->>SettingsScene: Return animated title

    SettingsScene->>SliderComp: create(this, {label: 'Master Volume', ...})
    SliderComp->>ThemeConfig: Get COLORS, ANIMATIONS
    SliderComp-->>SettingsScene: Return slider components

    SettingsScene->>SliderComp: create(this, {label: 'Music Volume', ...})
    SliderComp-->>SettingsScene: Return slider components

    SettingsScene->>SliderComp: create(this, {label: 'Sound Effects', ...})
    SliderComp-->>SettingsScene: Return slider components

    SettingsScene->>ButtonComp: createBackButton(this)
    ButtonComp->>ThemeConfig: Get STYLES, ANIMATIONS
    ButtonComp-->>SettingsScene: Return button & text

    SettingsScene->>DecoComp: createFloatingStars(this)
    DecoComp->>ThemeConfig: Get ANIMATIONS
    DecoComp-->>SettingsScene: Return star array

    SettingsScene->>VisibilityMixin: setup(this, 'Settings')
    VisibilityMixin-->>SettingsScene: Event handlers registered

    Note over SettingsScene: Scene ready in ~100 lines<br/>vs ~350 lines before

    User->>SettingsScene: Drag volume slider
    SettingsScene->>SliderComp: onValueChange callback
    SliderComp->>SettingsScene: New volume value
    SettingsScene->>SettingsScene: Update AudioManager

    User->>SettingsScene: Click Back
    SettingsScene->>ButtonComp: onClick callback
    ButtonComp->>SettingsScene: Navigate to MainMenu
    SettingsScene->>VisibilityMixin: cleanup(this)
    VisibilityMixin-->>SettingsScene: Event handlers removed
```

---

## 4. Data Flow - Slider Component

Shows how the SliderComponent manages state and callbacks.

```mermaid
flowchart TD
    Start([User Drags Slider]) --> Drag[Drag Event Triggered]
    Drag --> Clamp[Clamp Position to Bar Bounds]
    Clamp --> Calc[Calculate Percentage]
    Calc --> Value[Convert to Value: min to max]
    Value --> UpdateGraphics[Update Foreground Graphics]
    UpdateGraphics --> UpdateText[Update Value Text]
    UpdateText --> Callback{onValueChange<br/>provided?}
    Callback -->|Yes| TriggerCallback[Call onValueChange callback]
    Callback -->|No| End([Done])
    TriggerCallback --> Scene[Scene receives new value]
    Scene --> LocalStorage[Save to localStorage]
    Scene --> AudioManager[Update AudioManager]
    Scene --> End
```

---

## 5. Button Component State Machine

Shows button interaction states.

```mermaid
stateDiagram-v2
    [*] --> Idle: Button Created
    Idle --> Hovering: Pointer Over
    Hovering --> Idle: Pointer Out
    Hovering --> Pressed: Pointer Down
    Pressed --> Animating: Scale Down Animation
    Animating --> Completing: Yoyo Animation
    Completing --> Callback: Animation Complete
    Callback --> SceneChange: onClick() called
    SceneChange --> [*]

    Idle: Scale = 1.0
    Hovering: Scale = 1.1
    Pressed: Texture = Pressed
    Animating: Scale = 0.95
    Completing: Texture = Normal<br/>Scale = 1.0
```

---

## 6. File Structure Diagram

Shows the new component-based file organization.

```mermaid
graph TD
    Root[/Alphabet & Sight Words Game/]

    Root --> Src[/src/]
    Root --> AI[/.ai/]
    Root --> Index[index.html]

    Src --> Config[/config/]
    Src --> Mixins[/mixins/]
    Src --> Components[/components/]
    Src --> Scenes[/scenes/]
    Src --> Utils[/utils/]
    Src --> Services[/services/]

    Config --> ThemeConfigFile[ThemeConfig.js]

    Mixins --> VisibilityFile[VisibilityHandlerMixin.js]

    Components --> BackgroundFile[BackgroundComponent.js]
    Components --> TitleFile[TitleComponent.js]
    Components --> ButtonFile[ButtonComponent.js]
    Components --> DecorationsFile[DecorationsComponent.js]
    Components --> SliderFile[SliderComponent.js]

    Scenes --> MainMenuSceneFile[MainMenuScene.js]
    Scenes --> SettingsSceneFile[SettingsScene.js]
    Scenes --> LetterPopMenuFile[LetterPopMenuScene.js]
    Scenes --> ResultsSceneFile[ResultsScene.js]
    Scenes --> LetterTestSceneFile[LetterTestScene.js]
    Scenes --> OtherScenes[...]

    Utils --> ResponsiveFile[ResponsiveUtils.js]

    Services --> AudioFile[AudioManager.js]

    AI --> Phases[/phases/]
    Phases --> Phase26[/phase-2.6/]
    Phase26 --> PlanMD[PLAN.md]
    Phase26 --> UMLMD[UML.md]
    Phase26 --> GherkinMD[GHERKIN.md]

    style Config fill:#2196f3
    style Mixins fill:#2196f3
    style Components fill:#4caf50
    style Scenes fill:#ff9800
```

---

## 7. Migration Path Diagram

Shows the step-by-step migration process.

```mermaid
flowchart LR
    Start([Start Phase 2.6]) --> Infrastructure[Create Infrastructure<br/>Directories & Files]
    Infrastructure --> ThemeConf[Implement ThemeConfig]
    ThemeConf --> Components[Implement Components<br/>One at a time]

    Components --> Background[BackgroundComponent]
    Background --> Title[TitleComponent]
    Title --> Button[ButtonComponent]
    Button --> Decorations[DecorationsComponent]
    Decorations --> Visibility[VisibilityHandlerMixin]
    Visibility --> Slider[SliderComponent]

    Slider --> UpdateHTML[Update index.html<br/>Add script tags]

    UpdateHTML --> MigrateScenes[Migrate Scenes<br/>One at a time]

    MigrateScenes --> Settings[SettingsScene]
    Settings --> TestSettings{All tests pass?}
    TestSettings -->|No| FixSettings[Debug & Fix]
    FixSettings --> TestSettings
    TestSettings -->|Yes| CommitSettings[Git Commit]

    CommitSettings --> MainMenu[MainMenuScene]
    MainMenu --> TestMainMenu{All tests pass?}
    TestMainMenu -->|No| FixMainMenu[Debug & Fix]
    FixMainMenu --> TestMainMenu
    TestMainMenu -->|Yes| CommitMainMenu[Git Commit]

    CommitMainMenu --> LetterPopMenu[LetterPopMenuScene]
    LetterPopMenu --> TestLPMenu{All tests pass?}
    TestLPMenu -->|No| FixLPMenu[Debug & Fix]
    FixLPMenu --> TestLPMenu
    TestLPMenu -->|Yes| CommitLPMenu[Git Commit]

    CommitLPMenu --> LetterTest[LetterTestScene]
    LetterTest --> TestLT{All tests pass?}
    TestLT -->|No| FixLT[Debug & Fix]
    FixLT --> TestLT
    TestLT -->|Yes| CommitLT[Git Commit]

    CommitLT --> Results[ResultsScene]
    Results --> TestResults{All tests pass?}
    TestResults -->|No| FixResults[Debug & Fix]
    FixResults --> TestResults
    TestResults -->|Yes| CommitResults[Git Commit]

    CommitResults --> FinalTest[Comprehensive Testing]
    FinalTest --> AllPass{All scenes work?}
    AllPass -->|No| Debug[Debug Issues]
    Debug --> FinalTest
    AllPass -->|Yes| Complete([Phase 2.6 Complete])

    style Start fill:#4caf50
    style Complete fill:#4caf50
    style Components fill:#2196f3
    style MigrateScenes fill:#ff9800
```

---

## 8. Component Dependency Graph

Shows which components depend on others.

```mermaid
graph BT
    %% Base Layer
    ThemeConfig[ThemeConfig<br/>No Dependencies]

    %% Component Layer
    Background[BackgroundComponent]
    Title[TitleComponent]
    Button[ButtonComponent]
    Decorations[DecorationsComponent]
    Slider[SliderComponent]
    Visibility[VisibilityHandlerMixin]

    %% Dependencies
    Background --> ThemeConfig
    Title --> ThemeConfig
    Button --> ThemeConfig
    Decorations --> ThemeConfig
    Slider --> ThemeConfig
    Visibility -.-> ThemeConfig

    %% Scene Layer
    MainMenu[MainMenuScene]
    Settings[SettingsScene]
    LetterPopMenu[LetterPopMenuScene]
    LetterTest[LetterTestScene]
    Results[ResultsScene]

    MainMenu --> Background
    MainMenu --> Title
    MainMenu --> Button
    MainMenu --> Decorations
    MainMenu --> Visibility

    Settings --> Background
    Settings --> Title
    Settings --> Button
    Settings --> Slider
    Settings --> Decorations
    Settings --> Visibility

    LetterPopMenu --> Background
    LetterPopMenu --> Title
    LetterPopMenu --> Button
    LetterPopMenu --> Slider
    LetterPopMenu --> Decorations

    LetterTest --> Background
    LetterTest --> Title
    LetterTest --> Button

    Results --> Background
    Results --> Title
    Results --> Button
    Results --> Decorations
    Results --> Visibility

    style ThemeConfig fill:#2196f3
    style Background fill:#4caf50
    style Title fill:#4caf50
    style Button fill:#4caf50
    style Decorations fill:#4caf50
    style Slider fill:#4caf50
    style Visibility fill:#4caf50
```

---

## 9. Performance Impact Diagram

Shows how texture caching improves performance.

```mermaid
flowchart TD
    subgraph Before["Before: No Caching"]
        Scene1[Scene 1 Loads] --> Create1[Create Gradient<br/>200+ operations]
        Scene2[Scene 2 Loads] --> Create2[Create Gradient<br/>200+ operations]
        Scene3[Scene 3 Loads] --> Create3[Create Gradient<br/>200+ operations]
        Scene4[Scene 4 Loads] --> Create4[Create Gradient<br/>200+ operations]
        Scene5[Scene 5 Loads] --> Create5[Create Gradient<br/>200+ operations]

        Create1 --> Memory1[1000+ operations total]
    end

    subgraph After["After: With Caching"]
        SceneA1[Scene 1 Loads] --> CreateA1[Create & Cache Gradient<br/>200 operations]
        SceneA2[Scene 2 Loads] --> CheckA2{Texture Exists?}
        CheckA2 -->|Yes| ReuseA2[Reuse Cached Texture<br/>1 operation]
        SceneA3[Scene 3 Loads] --> CheckA3{Texture Exists?}
        CheckA3 -->|Yes| ReuseA3[Reuse Cached Texture<br/>1 operation]
        SceneA4[Scene 4 Loads] --> CheckA4{Texture Exists?}
        CheckA4 -->|Yes| ReuseA4[Reuse Cached Texture<br/>1 operation]
        SceneA5[Scene 5 Loads] --> CheckA5{Texture Exists?}
        CheckA5 -->|Yes| ReuseA5[Reuse Cached Texture<br/>1 operation]

        CreateA1 --> MemoryA1[204 operations total<br/>80% reduction]
    end

    style Memory1 fill:#ff6b6b
    style MemoryA1 fill:#4caf50
```

---

## Summary

These diagrams illustrate:

1. **Component Structure** - Clean, static component classes
2. **Before/After** - Dramatic reduction in duplication
3. **Scene Interaction** - How components work together
4. **Data Flow** - State management in components
5. **State Machines** - Interaction patterns
6. **File Organization** - Clear component-based structure
7. **Migration Path** - Step-by-step process with safety checkpoints
8. **Dependencies** - Clear dependency hierarchy
9. **Performance** - Texture caching benefits

**Key Architectural Principles:**
- Single Responsibility (each component does one thing)
- Don't Repeat Yourself (zero duplication)
- Separation of Concerns (components vs scenes)
- Dependency Injection (ThemeConfig at bottom)
- Open/Closed Principle (extend without modifying)

This architecture enables rapid development of future games while maintaining Aurora's existing perfect experience.
