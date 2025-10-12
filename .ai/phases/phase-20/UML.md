# Phase 20: Settings Scene - UML

## Class Diagram

```mermaid
classDiagram
    class SettingsScene {
        -Object settings
        -Array~VolumeSlider~ sliders
        -DifficultySelector difficultyUI
        -ConfirmationModal resetModal
        +constructor()
        +preload()
        +create()
        +createVolumeSlider(x, y, label, key)
        +updateSlider(pointer, bg, fill, text, key)
        +applyVolumeChange(key, value)
        +createDifficultySelector(x, y)
        +createResetButton(x, y)
        +showResetConfirmation()
        +createBackButton(x, y)
        +loadSettings() Object
        +saveSettings()
        +resetProgress()
    }

    class SettingsManager {
        <<Static>>
        +Object defaultSettings
        +loadSettings() Object
        +saveSettings(settings)
        +resetProgress()
        +getVolume(type) Number
        +setVolume(type, value)
        +getDifficulty() String
        +setDifficulty(level)
    }

    class VolumeSlider {
        -Number x
        -Number y
        -String label
        -String settingKey
        -Rectangle background
        -Rectangle fill
        -Text valueText
        -Number currentValue
        +constructor(scene, x, y, label, key)
        +create()
        +updateValue(percentage)
        +getValue() Number
        +setInteractive()
        +destroy()
    }

    class DifficultySelector {
        -Array~String~ levels
        -String currentLevel
        -Array~Button~ buttons
        -Number x
        -Number y
        +constructor(scene, x, y)
        +create()
        +selectDifficulty(level)
        +highlightButton(level)
        +getCurrentDifficulty() String
    }

    class ConfirmationModal {
        -Scene scene
        -String message
        -Function onConfirm
        -Function onCancel
        -Rectangle overlay
        -Rectangle modal
        -Text messageText
        -Button confirmButton
        -Button cancelButton
        +constructor(scene, message, onConfirm, onCancel)
        +show()
        +hide()
        +destroy()
    }

    class AudioManager {
        -Number musicVolume
        -Number sfxVolume
        -Number voiceVolume
        -Sound musicChannel
        -Sound sfxChannel
        -Sound voiceChannel
        +setMusicVolume(volume)
        +setSFXVolume(volume)
        +setVoiceVolume(volume)
        +getMusicVolume() Number
        +getSFXVolume() Number
        +getVoiceVolume() Number
        +applySettings(settings)
    }

    class LocalStorageManager {
        <<Static>>
        +String SETTINGS_KEY "auroraSettings"
        +String PROGRESS_KEY "auroraProgress"
        +String SCORES_KEY "auroraScores"
        +saveItem(key, data)
        +loadItem(key) Object
        +removeItem(key)
        +clearProgress()
        +isAvailable() Boolean
    }

    class GameConfig {
        -Object settings
        -String difficulty
        +initialize()
        +applySettings(settings)
        +getDifficultyParams() Object
        +getEasyParams() Object
        +getMediumParams() Object
        +getHardParams() Object
    }

    SettingsScene --> SettingsManager : uses
    SettingsScene --> VolumeSlider : creates 3
    SettingsScene --> DifficultySelector : creates
    SettingsScene --> ConfirmationModal : creates
    SettingsScene --> AudioManager : updates
    SettingsManager --> LocalStorageManager : uses
    AudioManager --> SettingsManager : reads from
    GameConfig --> SettingsManager : reads from
```

## Sequence Diagram: Settings Scene Load

```mermaid
sequenceDiagram
    actor Player
    participant Menu as MainMenuScene
    participant Settings as SettingsScene
    participant Manager as SettingsManager
    participant Storage as LocalStorage
    participant Audio as AudioManager

    Player->>Menu: Click Settings button
    Menu->>Settings: scene.start('SettingsScene')

    Settings->>Settings: create()
    Settings->>Manager: loadSettings()
    Manager->>Storage: getItem('auroraSettings')

    alt Settings exist
        Storage-->>Manager: Return settings JSON
        Manager-->>Settings: Return settings object
    else No settings
        Manager->>Manager: Use defaultSettings
        Manager-->>Settings: Return default object
    end

    Settings->>Settings: Create UI background
    Settings->>Settings: createVolumeSlider('Music')
    Settings->>Settings: createVolumeSlider('SFX')
    Settings->>Settings: createVolumeSlider('Voice')
    Settings->>Settings: createDifficultySelector()
    Settings->>Settings: createResetButton()
    Settings->>Settings: createBackButton()

    Settings->>Audio: Apply current volumes
    Audio->>Audio: Set channel volumes

    Settings-->>Player: Display settings UI
```

## Sequence Diagram: Adjust Volume Slider

```mermaid
sequenceDiagram
    actor Player
    participant Slider as VolumeSlider
    participant Scene as SettingsScene
    participant Manager as SettingsManager
    participant Storage as LocalStorage
    participant Audio as AudioManager

    Player->>Slider: Drag slider handle
    Slider->>Slider: pointerdown event

    loop While dragging
        Player->>Slider: pointermove
        Slider->>Slider: Calculate position
        Slider->>Slider: Clamp to 0-300px
        Slider->>Slider: Convert to percentage
        Slider->>Slider: Update fill width
        Slider->>Slider: Update value text
        Slider->>Scene: updateSlider(percentage)
        Scene->>Manager: settings[key] = percentage
        Scene->>Scene: saveSettings()
        Scene->>Storage: setItem('auroraSettings', JSON)
        Scene->>Audio: applyVolumeChange(key, value)
        Audio->>Audio: Set channel volume
        Audio-->>Player: Volume change (immediate)
    end

    Player->>Slider: Release (pointerup)
    Slider-->>Player: Final volume applied
```

## Sequence Diagram: Reset Progress

```mermaid
sequenceDiagram
    actor Player
    participant Scene as SettingsScene
    participant Modal as ConfirmationModal
    participant Manager as SettingsManager
    participant Storage as LocalStorage
    participant Menu as MainMenuScene

    Player->>Scene: Click "Reset Progress"
    Scene->>Modal: showResetConfirmation()

    Modal->>Modal: Create overlay (darken screen)
    Modal->>Modal: Create modal box
    Modal->>Modal: Add message text
    Modal->>Modal: Create Yes button
    Modal->>Modal: Create Cancel button

    Modal-->>Player: Display confirmation

    alt Player clicks Cancel
        Player->>Modal: Click Cancel
        Modal->>Modal: destroy() all elements
        Modal-->>Player: Return to settings
    else Player clicks Yes
        Player->>Modal: Click "Yes, Reset"
        Modal->>Manager: resetProgress()
        Manager->>Storage: removeItem('auroraProgress')
        Manager->>Storage: removeItem('auroraScores')
        Note over Manager,Storage: Settings NOT removed
        Storage-->>Manager: Progress cleared
        Manager-->>Modal: Complete
        Modal->>Modal: destroy() all elements
        Modal->>Scene: scene.start('MainMenuScene')
        Scene->>Menu: Navigate to menu
        Menu-->>Player: Show main menu
    end
```

## Sequence Diagram: Change Difficulty

```mermaid
sequenceDiagram
    actor Player
    participant Button as DifficultyButton
    participant Selector as DifficultySelector
    participant Scene as SettingsScene
    participant Manager as SettingsManager
    participant Storage as LocalStorage

    Player->>Button: Click "Hard"
    Button->>Selector: selectDifficulty('hard')

    Selector->>Selector: Unhighlight all buttons
    Selector->>Selector: Highlight 'hard' button

    Selector->>Scene: difficulty changed
    Scene->>Manager: settings.difficulty = 'hard'
    Scene->>Manager: saveSettings()
    Manager->>Storage: setItem('auroraSettings', JSON)
    Storage-->>Manager: Saved
    Manager-->>Scene: Complete

    Scene->>Scene: scene.restart()
    Scene->>Scene: Refresh UI with new selection

    Scene-->>Player: Display updated UI
```

## State Diagram: Settings UI States

```mermaid
stateDiagram-v2
    [*] --> Loading: Open Settings

    Loading --> DisplayingSettings: Settings loaded

    DisplayingSettings --> AdjustingSlider: Drag slider
    DisplayingSettings --> SelectingDifficulty: Click difficulty
    DisplayingSettings --> ConfirmingReset: Click Reset Progress
    DisplayingSettings --> NavigatingBack: Click Back

    AdjustingSlider --> SavingSettings: Release slider
    SavingSettings --> ApplyingVolume: Save to localStorage
    ApplyingVolume --> DisplayingSettings: Volume applied

    SelectingDifficulty --> SavingSettings: Difficulty selected
    SavingSettings --> RefreshingUI: Save to localStorage
    RefreshingUI --> DisplayingSettings: UI refreshed

    ConfirmingReset --> DisplayingSettings: Cancel
    ConfirmingReset --> ResettingProgress: Confirm
    ResettingProgress --> ClearingData: Remove localStorage items
    ClearingData --> ExitingToMenu: Progress cleared
    ExitingToMenu --> [*]

    NavigatingBack --> ExitingToMenu: Return to menu
    ExitingToMenu --> [*]

    note right of SavingSettings
        All changes save
        immediately to
        localStorage
    end note

    note right of ResettingProgress
        Only progress cleared,
        settings preserved
    end note
```

## Activity Diagram: Settings Flow

```mermaid
flowchart TD
    Start([Player Opens Settings]) --> LoadSettings[Load settings from localStorage]

    LoadSettings --> CheckExists{Settings exist?}
    CheckExists -->|Yes| UseExisting[Use saved settings]
    CheckExists -->|No| UseDefaults[Use default settings]

    UseExisting --> CreateUI[Create Settings UI]
    UseDefaults --> CreateUI

    CreateUI --> DisplaySliders[Display 3 volume sliders]
    DisplaySliders --> DisplayDifficulty[Display difficulty selector]
    DisplayDifficulty --> DisplayReset[Display reset button]
    DisplayReset --> DisplayBack[Display back button]

    DisplayBack --> WaitInput[Wait for player input]

    WaitInput --> InputType{Input type?}

    InputType -->|Drag slider| UpdateSlider[Update slider position]
    UpdateSlider --> CalcPercent[Calculate percentage]
    CalcPercent --> UpdateDisplay[Update value text]
    UpdateDisplay --> SaveSetting[Save to localStorage]
    SaveSetting --> ApplyVolume[Apply volume immediately]
    ApplyVolume --> WaitInput

    InputType -->|Click difficulty| HighlightButton[Highlight selected button]
    HighlightButton --> SaveDifficulty[Save difficulty to localStorage]
    SaveDifficulty --> RefreshUI[Refresh UI]
    RefreshUI --> WaitInput

    InputType -->|Click Reset| ShowModal[Show confirmation modal]
    ShowModal --> ModalChoice{User choice?}
    ModalChoice -->|Cancel| CloseModal[Close modal]
    CloseModal --> WaitInput
    ModalChoice -->|Confirm| ClearProgress[Clear progress from localStorage]
    ClearProgress --> KeepSettings[Preserve settings data]
    KeepSettings --> ExitToMenu[Exit to main menu]
    ExitToMenu --> End([Settings Complete])

    InputType -->|Click Back| ExitToMenu

    style LoadSettings fill:#87CEEB
    style SaveSetting fill:#FFD700
    style ApplyVolume fill:#90EE90
    style ClearProgress fill:#FF6B6B
    style KeepSettings fill:#98FB98
```

## Component Diagram: Settings System

```mermaid
graph TB
    subgraph Settings Scene
        UI[Settings UI Layer]
        Sliders[Volume Sliders x3]
        Difficulty[Difficulty Selector]
        Reset[Reset Button]
        Back[Back Button]
    end

    subgraph Data Layer
        Manager[Settings Manager]
        LocalStore[localStorage API]
    end

    subgraph Game Integration
        AudioSys[Audio System]
        GameScenes[Game Scenes]
        Config[Game Config]
    end

    UI --> Sliders
    UI --> Difficulty
    UI --> Reset
    UI --> Back

    Sliders --> Manager
    Difficulty --> Manager
    Reset --> Manager
    Back --> MainMenu[Main Menu Scene]

    Manager --> LocalStore
    Manager --> AudioSys
    Manager --> Config

    AudioSys --> MusicChannel[Music Channel]
    AudioSys --> SFXChannel[SFX Channel]
    AudioSys --> VoiceChannel[Voice Channel]

    Config --> GameScenes
    GameScenes --> LetterPop[Letter Pop Scene]
    GameScenes --> WordMatch[Word Match Scene]
    GameScenes --> OtherScenes[Other Game Scenes]

    style Manager fill:#FFD700
    style LocalStore fill:#87CEEB
    style AudioSys fill:#90EE90
```

## Data Flow Diagram: Settings Persistence

```mermaid
flowchart LR
    A[Player Adjusts Setting] --> B[Update UI]
    B --> C[Update settings object]
    C --> D[Convert to JSON]
    D --> E[Save to localStorage]

    E --> F[localStorage.setItem]

    F --> G{Save successful?}
    G -->|Yes| H[Setting persisted]
    G -->|No| I[Use session-only]

    H --> J[Page Reload]
    J --> K[Load from localStorage]
    K --> L[Parse JSON]
    L --> M[Apply settings]

    M --> N[Set audio volumes]
    M --> O[Configure difficulty]
    M --> P[Update UI to match]

    N --> Q[Game runs with settings]
    O --> Q
    P --> Q

    I --> R[Warning: Not persisted]
    R --> S[Settings lost on reload]

    style E fill:#FFD700
    style F fill:#87CEEB
    style H fill:#90EE90
    style S fill:#FF6B6B
```

## localStorage Schema

```mermaid
erDiagram
    SETTINGS {
        number musicVolume "0-100"
        number sfxVolume "0-100"
        number voiceVolume "0-100"
        string difficulty "easy|medium|hard"
    }

    PROGRESS {
        array lettersCompleted "Array of completed letters"
        array wordsCompleted "Array of completed words"
        number totalStars "Total stars earned"
        object levelProgress "Per-level progress"
    }

    SCORES {
        array recentScores "Last 10 game scores"
        number highScore "All-time high"
        object letterScores "Best score per letter"
    }

    SETTINGS ||--o{ GAME_SESSIONS : applies_to
    PROGRESS ||--o{ GAME_SESSIONS : tracks
    SCORES ||--o{ GAME_SESSIONS : records
```

## Volume Slider Component Detail

```mermaid
flowchart TB
    SliderComp[Volume Slider Component]

    SliderComp --> Label[Label Text: 'Music']
    SliderComp --> Background[Background Rectangle: 300x10px]
    SliderComp --> Fill[Fill Rectangle: 0-300px width]
    SliderComp --> Value[Value Text: '75%']

    Background --> Interactive[Interactive Area]
    Interactive --> PointerDown[pointerdown event]
    Interactive --> PointerMove[pointermove event]

    PointerDown --> GetPosition[Get pointer X position]
    PointerMove --> GetPosition

    GetPosition --> LocalPos[Convert to local coords]
    LocalPos --> Clamp[Clamp to 0-300px]
    Clamp --> Percentage[Calculate percentage]
    Percentage --> UpdateFill[Update fill width]
    Percentage --> UpdateText[Update value text]
    Percentage --> SaveValue[Save to settings]
    Percentage --> ApplyAudio[Apply to audio channel]

    UpdateFill --> Render[Render updated slider]
    UpdateText --> Render

    style Background fill:#666666
    style Fill fill:#44ff44
    style SaveValue fill:#FFD700
    style ApplyAudio fill:#90EE90
```

## Confirmation Modal Structure

```mermaid
graph TB
    Modal[Confirmation Modal]

    Modal --> Overlay[Overlay: 800x600, alpha 0.7]
    Modal --> Box[Modal Box: 400x200]

    Box --> Message[Message Text: 'Reset all progress?<br>This cannot be undone.']
    Box --> YesButton[Yes Button: 'Yes, Reset']
    Box --> CancelButton[Cancel Button: 'Cancel']

    YesButton --> YesAction{Click Yes}
    CancelButton --> CancelAction{Click Cancel}

    YesAction --> ClearData[Clear progress data]
    YesAction --> DestroyModal[Destroy modal]
    YesAction --> Navigate[Navigate to menu]

    CancelAction --> DestroyModal

    style YesButton fill:#ff4444
    style CancelButton fill:#666666
    style ClearData fill:#FF6B6B
```

## Notes

### Architecture Decisions

**Settings Manager Pattern**
- Centralized settings management (single source of truth)
- Encapsulates localStorage interactions
- Provides clean API for scenes to get/set settings
- Handles defaults gracefully

**Immediate Application**
- Settings apply as soon as changed (no "Apply" button)
- Provides instant feedback (player hears volume change)
- Saves to localStorage on every change (prevents loss)
- No unsaved state confusion

**Separation of Concerns**
- Settings Scene handles UI only
- SettingsManager handles data/persistence
- AudioManager handles volume application
- GameConfig handles difficulty parameters

**localStorage Strategy**
- Settings key: 'auroraSettings' (preserved always)
- Progress key: 'auroraProgress' (can be reset)
- Scores key: 'auroraScores' (can be reset)
- Clear separation allows selective reset

### Why This Design?

**Slider Component**
- Custom implementation using Phaser rectangles (no plugin dependency)
- Drag interaction feels natural (like native sliders)
- Real-time visual feedback (fill width + percentage)
- Immediate audio feedback (player hears volume change)

**Confirmation Modal**
- Prevents accidental progress deletion
- Modal overlay darkens background (clear focus)
- Two-step process (click button → confirm) reduces errors
- Explicit "Yes, Reset" text (no ambiguous "OK")

**Difficulty Selector**
- Three clear levels (Easy/Medium/Hard) - no overwhelming options
- Visual highlighting shows current selection
- One-click to change (no complex dropdowns)
- Descriptions can be added later if needed

**Reset Progress Separation**
- Progress reset does NOT reset settings (preserves user preferences)
- Settings survive reset (volume, difficulty remain)
- Parent can reset child's progress without reconfiguring

### Component Relationships

1. **SettingsScene is the controller**
   - Creates all UI components
   - Handles user interactions
   - Coordinates with SettingsManager
   - Navigates to other scenes

2. **SettingsManager is the model**
   - Stores settings data
   - Handles localStorage operations
   - Provides default values
   - Validates settings on load

3. **VolumeSliders are independent**
   - Each slider manages its own state
   - Reports changes to parent scene
   - Self-contained UI logic
   - Three instances (music, SFX, voice)

4. **AudioManager is the consumer**
   - Reads settings on game start
   - Applies volume to appropriate channels
   - Updates immediately on setting change
   - No settings logic (just applies values)

5. **localStorage is the persistence layer**
   - Browser-native storage (no server needed)
   - Synchronous API (simple to use)
   - Survives page reload/close
   - Limited to ~5-10MB (more than enough)

### Performance Considerations

**Real-Time Slider Updates**
- Updates fire on pointermove (can be frequent)
- Throttling not needed (Phaser handles efficiently)
- localStorage writes are fast (<1ms)
- Audio volume changes are instant (no performance hit)

**UI Refresh Strategy**
- Scene restart for difficulty change (ensures consistent UI)
- Slider updates without restart (smoother interaction)
- Modal overlays use alpha blend (GPU-accelerated)

**Memory Management**
- Modals destroyed after use (no lingering references)
- Sliders reuse rectangles (no recreation on drag)
- Settings object is lightweight (4 properties)

This design prioritizes immediate feedback, data persistence, and user-friendly interactions while maintaining clean separation of concerns and efficient performance.
