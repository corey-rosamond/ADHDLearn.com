# Phase 43: Parent Dashboard - UML

## Class Diagram

```mermaid
classDiagram
    class DashboardScene {
        -ProgressTracker progressTracker
        -Array sessionHistory
        -Array letterData
        -Array sightWordData
        +constructor()
        +create()
        +loadProgressData()
        +createHeader()
        +createSummarySection()
        +createStatBox(x, y, label, value)
        +createLettersSection()
        +createSightWordsSection()
        +createSessionHistorySection()
        +createChartsSection()
        +createExportImportButtons()
        +exportProgress()
        +importProgress()
        +createBackButton()
        +formatDate(timestamp)
        +formatDuration(seconds)
        +formatDateForFilename(date)
        +calculateTotalTime()
        +showMessage(text, isError)
    }

    class ProgressTracker {
        +getLetterProgress()
        +getSightWordProgress()
        +getSessionHistory()
        +getSettings()
        +importData(data)
        +exportData()
    }

    class ExportData {
        +String version
        +String exportDate
        +Array letters
        +Array sightWords
        +Array sessions
        +Object settings
    }

    class LetterProgress {
        +String letter
        +Boolean mastered
        +Date masteryDate
        +Number attemptCount
        +Number successRate
    }

    class SightWordProgress {
        +String word
        +Boolean learned
        +Date learnedDate
        +Number attemptCount
        +Number successRate
    }

    class SessionData {
        +Date date
        +Number duration
        +Number score
        +Array lettersPracticed
        +Array wordsPracticed
        +String gameMode
    }

    class ChartManager {
        +createProgressChart(data)
        +createActivityHeatmap(sessions)
        +createSkillBreakdownChart(data)
        +createPerformanceTrendChart(sessions)
        +updateChart(chartId, newData)
        +destroyChart(chartId)
    }

    DashboardScene --> ProgressTracker : uses
    DashboardScene --> ExportData : creates
    DashboardScene --> ChartManager : uses
    ProgressTracker --> LetterProgress : manages
    ProgressTracker --> SightWordProgress : manages
    ProgressTracker --> SessionData : stores
    ExportData --> LetterProgress : contains
    ExportData --> SightWordProgress : contains
    ExportData --> SessionData : contains
```

## Sequence Diagram - Dashboard Load

```mermaid
sequenceDiagram
    actor Parent
    participant Menu as MainMenuScene
    participant Dashboard as DashboardScene
    participant Tracker as ProgressTracker
    participant Storage as LocalStorage
    participant UI as UI Components

    Parent->>Menu: Click "View Progress"
    Menu->>Dashboard: scene.start('DashboardScene')

    Dashboard->>Dashboard: create()
    Dashboard->>Tracker: new ProgressTracker()
    Tracker->>Storage: Load saved data
    Storage-->>Tracker: Return data

    Dashboard->>Tracker: getLetterProgress()
    Tracker-->>Dashboard: letterData[]

    Dashboard->>Tracker: getSightWordProgress()
    Tracker-->>Dashboard: sightWordData[]

    Dashboard->>Tracker: getSessionHistory()
    Tracker-->>Dashboard: sessionHistory[]

    Dashboard->>UI: createHeader()
    Dashboard->>UI: createSummarySection()
    Dashboard->>UI: createLettersSection()
    Dashboard->>UI: createSightWordsSection()
    Dashboard->>UI: createSessionHistorySection()
    Dashboard->>UI: createChartsSection()

    UI-->>Parent: Display dashboard
```

## Sequence Diagram - Export Progress

```mermaid
sequenceDiagram
    actor Parent
    participant Dashboard as DashboardScene
    participant Tracker as ProgressTracker
    participant Browser as Browser
    participant FileSystem as File System

    Parent->>Dashboard: Click "Export Progress"
    Dashboard->>Tracker: Collect all data

    Tracker-->>Dashboard: letterData, sightWordData, sessions

    Dashboard->>Dashboard: Create ExportData object
    Dashboard->>Dashboard: JSON.stringify(exportData)

    Dashboard->>Browser: Create Blob with JSON
    Browser->>Browser: Create download URL

    Dashboard->>Browser: Trigger download
    Browser->>FileSystem: Save aurora-backup-YYYY-MM-DD.json

    FileSystem-->>Parent: File downloaded

    Dashboard->>Dashboard: showMessage("Export successful")
    Dashboard-->>Parent: Show success message
```

## Sequence Diagram - Import Progress

```mermaid
sequenceDiagram
    actor Parent
    participant Dashboard as DashboardScene
    participant Browser as Browser
    participant FileSystem as File System
    participant Tracker as ProgressTracker
    participant Storage as LocalStorage

    Parent->>Dashboard: Click "Import Progress"
    Dashboard->>Browser: Open file picker

    Browser->>FileSystem: Request file selection
    Parent->>Browser: Select backup JSON file
    FileSystem-->>Browser: Return file

    Browser->>Dashboard: File selected event
    Dashboard->>Dashboard: Read file as text

    Dashboard->>Dashboard: JSON.parse(fileContent)

    alt Valid JSON format
        Dashboard->>Dashboard: Validate data structure
        Dashboard->>Parent: Show confirmation dialog
        Parent->>Dashboard: Confirm import

        Dashboard->>Tracker: importData(parsedData)
        Tracker->>Storage: Save to localStorage
        Storage-->>Tracker: Success

        Dashboard->>Dashboard: loadProgressData()
        Dashboard->>Dashboard: scene.restart()
        Dashboard->>Dashboard: showMessage("Import successful")
    else Invalid JSON or structure
        Dashboard->>Dashboard: showMessage("Error: Invalid file", true)
        Dashboard-->>Parent: Display error message
    end
```

## Component Diagram

```mermaid
graph TB
    Dashboard[DashboardScene]

    subgraph "Data Layer"
        Tracker[ProgressTracker]
        Storage[LocalStorage]
    end

    subgraph "UI Sections"
        Header[Header Section]
        Summary[Summary Stats]
        Letters[Letters Grid]
        Words[Sight Words List]
        History[Session History]
        Charts[Charts/Visualizations]
        Controls[Export/Import/Back]
    end

    subgraph "Chart Library"
        ChartJS[Chart.js]
        PhaserGfx[Phaser Graphics]
    end

    subgraph "Browser APIs"
        FileAPI[File API]
        BlobAPI[Blob API]
        DOMAPI[DOM API]
    end

    Dashboard --> Tracker
    Tracker --> Storage

    Dashboard --> Header
    Dashboard --> Summary
    Dashboard --> Letters
    Dashboard --> Words
    Dashboard --> History
    Dashboard --> Charts
    Dashboard --> Controls

    Charts --> ChartJS
    Charts --> PhaserGfx

    Controls --> FileAPI
    Controls --> BlobAPI
    Controls --> DOMAPI
```

## State Diagram - Dashboard Lifecycle

```mermaid
stateDiagram-v2
    [*] --> Loading: Scene Started
    Loading --> LoadingData: Initialize ProgressTracker
    LoadingData --> RenderingUI: Data Loaded
    RenderingUI --> DisplayingDashboard: All UI Created

    DisplayingDashboard --> Exporting: Click Export
    Exporting --> DisplayingDashboard: Export Complete

    DisplayingDashboard --> Importing: Click Import
    Importing --> ValidatingFile: File Selected
    ValidatingFile --> ConfirmingImport: Valid File
    ValidatingFile --> DisplayingError: Invalid File
    DisplayingError --> DisplayingDashboard: Error Shown
    ConfirmingImport --> ImportingData: User Confirms
    ConfirmingImport --> DisplayingDashboard: User Cancels
    ImportingData --> Reloading: Data Imported
    Reloading --> DisplayingDashboard: Scene Restarted

    DisplayingDashboard --> [*]: Back to Menu
```

## Activity Diagram - View Dashboard

```mermaid
flowchart TD
    Start([Parent Opens Dashboard]) --> Init[Initialize DashboardScene]
    Init --> LoadTracker[Create ProgressTracker]
    LoadTracker --> LoadData[Load Progress Data]

    LoadData --> CheckData{Data Exists?}
    CheckData -->|Yes| RenderFull[Render Full Dashboard]
    CheckData -->|No| RenderEmpty[Render Empty State]

    RenderFull --> DisplaySummary[Display Summary Stats]
    DisplaySummary --> DisplayLetters[Display Letter Grid]
    DisplayLetters --> DisplayWords[Display Sight Words]
    DisplayWords --> DisplayHistory[Display Session History]
    DisplayHistory --> DisplayCharts[Render Charts]
    DisplayCharts --> DisplayControls[Add Export/Import Buttons]

    RenderEmpty --> ShowMessage[Show "No Progress Yet"]
    ShowMessage --> DisplayControls

    DisplayControls --> WaitInput{Wait for User Action}

    WaitInput -->|Export| ExportFlow[Run Export Process]
    WaitInput -->|Import| ImportFlow[Run Import Process]
    WaitInput -->|Back| ReturnMenu[Return to Main Menu]
    WaitInput -->|Wait| WaitInput

    ExportFlow --> WaitInput
    ImportFlow --> ReloadData[Reload Dashboard Data]
    ReloadData --> WaitInput

    ReturnMenu --> End([Exit Dashboard])
```

## Data Model Diagram

```mermaid
erDiagram
    DASHBOARD ||--o{ LETTER_PROGRESS : displays
    DASHBOARD ||--o{ SIGHT_WORD_PROGRESS : displays
    DASHBOARD ||--o{ SESSION_HISTORY : displays
    DASHBOARD ||--|| SUMMARY_STATS : calculates

    LETTER_PROGRESS {
        string letter
        boolean mastered
        date masteryDate
        int attemptCount
        float successRate
    }

    SIGHT_WORD_PROGRESS {
        string word
        boolean learned
        date learnedDate
        int attemptCount
        float successRate
    }

    SESSION_HISTORY {
        date timestamp
        int duration
        int score
        array lettersPracticed
        array wordsPracticed
        string gameMode
    }

    SUMMARY_STATS {
        int totalLettersMastered
        int totalWordsLearned
        int totalSessions
        int totalTimePlayed
        int currentStreak
        int longestStreak
        float averageScore
    }

    EXPORT_DATA ||--o{ LETTER_PROGRESS : includes
    EXPORT_DATA ||--o{ SIGHT_WORD_PROGRESS : includes
    EXPORT_DATA ||--o{ SESSION_HISTORY : includes
    EXPORT_DATA ||--|| METADATA : contains

    EXPORT_DATA {
        string version
        date exportDate
    }

    METADATA {
        string gameVersion
        string childName
        date lastPlayed
    }
```

## UI Layout Diagram

```mermaid
graph TB
    subgraph "DashboardScene (800x600)"
        subgraph "Header (800x80)"
            Title["Parent Dashboard<br/>Aurora's Learning Progress"]
        end

        subgraph "Summary Section (760x100)"
            Stat1["Letters<br/>18/26"]
            Stat2["Sight Words<br/>42/100"]
            Stat3["Sessions<br/>15"]
            Stat4["Time<br/>2h 30m"]
        end

        subgraph "Letters Section (760x140)"
            LetterGrid["A B C D E F G H I J K L M<br/>N O P Q R S T U V W X Y Z<br/>(Color coded: Green=Mastered, Gray=Not Started)"]
        end

        subgraph "Sight Words Section (760x60)"
            WordsList["Recent words: the, and, is, to, of, a, in, that, it, was"]
        end

        subgraph "Session History (760x120)"
            SessionTable["Date | Duration | Score<br/>Today | 12m 30s | 5 stars<br/>Yesterday | 15m 10s | 4 stars<br/>Mar 15 | 10m 45s | 5 stars"]
        end

        subgraph "Controls (760x50)"
            BackBtn["Back to Menu"]
            ExportBtn["Export Progress"]
            ImportBtn["Import Progress"]
        end
    end

    Title --> Stat1
    Stat1 --> LetterGrid
    LetterGrid --> WordsList
    WordsList --> SessionTable
    SessionTable --> BackBtn
```

## Chart Types Diagram

```mermaid
graph LR
    Charts[Chart Visualizations]

    Charts --> LineChart[Line Chart:<br/>Progress Over Time]
    Charts --> PieChart[Pie Chart:<br/>Game Time Distribution]
    Charts --> BarChart[Bar Chart:<br/>Letters by Mastery Date]
    Charts --> Heatmap[Heatmap:<br/>Activity Calendar]

    LineChart --> LineData[X: Date<br/>Y: Count<br/>Series: Letters, Words]
    PieChart --> PieData[Segments: Game Modes<br/>Values: Time Spent]
    BarChart --> BarData[X: Letter<br/>Y: Days to Master]
    Heatmap --> HeatData[Grid: Calendar Days<br/>Color: Play Time]
```

## Notes

### Architecture Decisions

**Data Source**
- All data comes from ProgressTracker singleton
- ProgressTracker abstracts LocalStorage implementation
- Allows future migration to other storage (IndexedDB, server sync)

**Chart Rendering Options**
1. **Chart.js (Recommended)**:
   - Professional, feature-rich charting library
   - Easy to integrate with canvas overlay
   - Large file size (~200KB) but worth it for MVP

2. **Phaser Graphics**:
   - Lighter weight, no external dependency
   - More work to implement custom charts
   - Better for simple visualizations

**Export/Import Format**
- JSON for human readability and debugging
- Include version number for future schema migrations
- Metadata helps identify backup source and date

**UI Layout**
- Fixed 800x600 for MVP (matches game resolution)
- Sections stack vertically with clear visual separation
- Scrolling can be added post-MVP if needed

### Performance Considerations

**Large Data Sets**
- Limit session history display to recent 10-20 entries
- Use "Load More" button for older sessions
- Consider pagination if history exceeds 100 sessions

**Chart Rendering**
- Initialize charts only when visible
- Cache chart instances to avoid recreating
- Destroy charts when leaving scene to free memory

**File Operations**
- Validate JSON structure before processing
- Limit import file size (e.g., max 5MB)
- Show loading indicator for large imports

### Security Considerations

**Import Validation**
- Check JSON structure matches expected schema
- Sanitize any user-generated content (child names, notes)
- Prevent code injection through malformed JSON

**Data Privacy**
- No automatic cloud sync (parent controlled only)
- Export files stored locally, not transmitted
- Consider encrypting sensitive data in future versions

This dashboard provides parents with comprehensive visibility into their child's learning progress while maintaining simplicity and performance.
