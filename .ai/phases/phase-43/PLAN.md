# Phase 43: Parent Dashboard

## Goal
Create a comprehensive parent dashboard with progress visibility, session history, and data visualizations

## Context
This phase builds the parent dashboard interface for Aurora's Letter Adventure. The dashboard needs to:
1. Display clear, actionable progress metrics
2. Visualize learning data with charts and graphs
3. Show historical session information
4. Provide data export/import capabilities
5. Maintain child-safe access (password protection optional)
6. Present data in an easy-to-understand format for busy parents

## Prerequisites
- Phase 1-42 completed
- ProgressTracker system implemented and tracking data
- LocalStorage or data persistence layer working
- All mini-games recording progress metrics
- Chart.js library or equivalent available

## Tasks

### 1. Create DashboardScene Structure
- Create `src/scenes/DashboardScene.js`
- Set up scene with professional, clean UI layout
- Create navigation back to main menu
- Implement scrollable content area for long data lists
- Add refresh button to reload latest data

### 2. Display Letters Mastered Section
- Query ProgressTracker for letter completion data
- Display all 26 letters (A-Z) with visual indicators
- Show mastery level per letter (e.g., "Mastered", "Learning", "Not Started")
- Use color coding: Green = Mastered, Yellow = In Progress, Gray = Not Started
- Display percentage of alphabet mastered (e.g., "18/26 letters = 69%")
- Sort alphabetically with option to sort by mastery date

### 3. Display Sight Words Learned Section
- Query ProgressTracker for sight word completion data
- Display list of mastered sight words
- Show total count (e.g., "42/100 sight words learned")
- Group by difficulty level or category if applicable
- Show recent words learned (last 5-10)
- Display percentage of total sight words mastered

### 4. Implement Session History
- Display table/list of past play sessions
- Columns: Date, Duration, Score/Stars, Letters Practiced, Words Practiced
- Show most recent 10-20 sessions by default
- Add "Show More" button to load older sessions
- Format dates as human-readable (e.g., "Today", "Yesterday", "Mar 15")
- Calculate total playtime across all sessions
- Show average session duration

### 5. Create Data Visualizations
- **Progress Over Time Chart**:
  - Line graph showing cumulative letters/words learned
  - X-axis: Date, Y-axis: Count of mastered items
  - Use Chart.js or Phaser graphics for rendering

- **Activity Heatmap** (optional):
  - Calendar view showing days played
  - Color intensity = amount of time played that day

- **Skill Breakdown Pie Chart**:
  - Percentage of time spent in each mini-game
  - Color-coded sections for each game type

- **Performance Trend Chart**:
  - Line graph showing average scores over time
  - Helps identify improvement or areas needing support

### 6. Implement Export/Import Feature
- **Export Functionality**:
  - Create "Export Progress" button
  - Generate JSON file with all progress data
  - Include metadata: export date, game version, child name (optional)
  - Trigger browser download of backup file
  - Filename format: `aurora-backup-YYYY-MM-DD.json`

- **Import Functionality**:
  - Create "Import Progress" button
  - Open file picker to select backup JSON file
  - Validate JSON structure before importing
  - Confirm with user before overwriting existing data
  - Show success/error message after import
  - Merge strategy: overwrite vs. merge option

### 7. Add Summary Statistics
- Total time played (hours and minutes)
- Total sessions completed
- Current streak (consecutive days played)
- Longest streak achieved
- Average score across all games
- Most practiced letter/word
- Last played date and time

### 8. Implement Responsive Layout
- Dashboard should work on tablet/desktop sizes
- Use grid or flexbox layout for sections
- Ensure charts scale appropriately
- Handle long lists with scrolling
- Consider print-friendly stylesheet for progress reports

## Implementation Details

### DashboardScene.js Structure
```javascript
class DashboardScene extends Phaser.Scene {
    constructor() {
        super({ key: 'DashboardScene' });
        this.progressTracker = null;
        this.sessionHistory = [];
        this.letterData = [];
        this.sightWordData = [];
    }

    create() {
        // Initialize progress tracker
        this.progressTracker = new ProgressTracker(this);

        // Create background
        this.add.rectangle(400, 300, 800, 600, 0xf0f4f8);

        // Header
        this.createHeader();

        // Load data
        this.loadProgressData();

        // Create sections
        this.createSummarySection();
        this.createLettersSection();
        this.createSightWordsSection();
        this.createSessionHistorySection();
        this.createChartsSection();
        this.createExportImportButtons();

        // Navigation
        this.createBackButton();
    }

    loadProgressData() {
        // Load from localStorage or ProgressTracker
        this.letterData = this.progressTracker.getLetterProgress();
        this.sightWordData = this.progressTracker.getSightWordProgress();
        this.sessionHistory = this.progressTracker.getSessionHistory();
    }

    createHeader() {
        // Title
        this.add.text(400, 30, 'Parent Dashboard', {
            fontSize: '36px',
            fontFamily: 'Arial',
            color: '#2c3e50',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Subtitle
        this.add.text(400, 65, "Aurora's Learning Progress", {
            fontSize: '18px',
            fontFamily: 'Arial',
            color: '#7f8c8d'
        }).setOrigin(0.5);
    }

    createSummarySection() {
        const startY = 100;

        // Summary container
        const summaryBg = this.add.rectangle(400, startY + 40, 760, 100, 0xffffff);
        summaryBg.setStrokeStyle(2, 0xe0e0e0);

        // Calculate stats
        const totalLetters = this.letterData.filter(l => l.mastered).length;
        const totalWords = this.sightWordData.filter(w => w.learned).length;
        const totalSessions = this.sessionHistory.length;
        const totalTime = this.calculateTotalTime();

        // Display stats in columns
        this.createStatBox(200, startY + 40, 'Letters Mastered', `${totalLetters}/26`);
        this.createStatBox(400, startY + 40, 'Sight Words', `${totalWords}/100`);
        this.createStatBox(600, startY + 40, 'Total Sessions', totalSessions);
        this.createStatBox(750, startY + 40, 'Time Played', totalTime);
    }

    createStatBox(x, y, label, value) {
        this.add.text(x, y - 15, label, {
            fontSize: '14px',
            color: '#7f8c8d',
            fontFamily: 'Arial'
        }).setOrigin(0.5);

        this.add.text(x, y + 10, value.toString(), {
            fontSize: '24px',
            color: '#2c3e50',
            fontFamily: 'Arial',
            fontStyle: 'bold'
        }).setOrigin(0.5);
    }

    createLettersSection() {
        const startY = 220;

        // Section title
        this.add.text(50, startY, 'Letters Progress', {
            fontSize: '20px',
            fontFamily: 'Arial',
            color: '#2c3e50',
            fontStyle: 'bold'
        });

        // Letter grid (A-Z)
        const lettersPerRow = 13;
        const letterSize = 50;
        const spacing = 5;

        for (let i = 0; i < 26; i++) {
            const letter = String.fromCharCode(65 + i);
            const row = Math.floor(i / lettersPerRow);
            const col = i % lettersPerRow;
            const x = 50 + col * (letterSize + spacing);
            const y = startY + 40 + row * (letterSize + spacing);

            const letterProgress = this.letterData.find(l => l.letter === letter);
            const mastered = letterProgress?.mastered || false;
            const color = mastered ? 0x4CAF50 : 0xe0e0e0;

            // Letter box
            const box = this.add.rectangle(x, y, letterSize, letterSize, color);
            box.setStrokeStyle(2, 0xffffff);

            // Letter text
            this.add.text(x, y, letter, {
                fontSize: '24px',
                fontFamily: 'Arial',
                color: '#ffffff',
                fontStyle: 'bold'
            }).setOrigin(0.5);
        }
    }

    createSightWordsSection() {
        const startY = 360;

        // Section title
        this.add.text(50, startY, 'Sight Words Learned', {
            fontSize: '20px',
            fontFamily: 'Arial',
            color: '#2c3e50',
            fontStyle: 'bold'
        });

        // Recent words list
        const recentWords = this.sightWordData
            .filter(w => w.learned)
            .slice(-10);

        const wordsText = recentWords.length > 0
            ? recentWords.map(w => w.word).join(', ')
            : 'No words learned yet';

        this.add.text(50, startY + 35, `Recent: ${wordsText}`, {
            fontSize: '14px',
            fontFamily: 'Arial',
            color: '#34495e',
            wordWrap: { width: 700 }
        });
    }

    createSessionHistorySection() {
        const startY = 430;

        // Section title
        this.add.text(50, startY, 'Recent Sessions', {
            fontSize: '20px',
            fontFamily: 'Arial',
            color: '#2c3e50',
            fontStyle: 'bold'
        });

        // Table header
        this.add.text(50, startY + 35, 'Date', {
            fontSize: '14px',
            fontFamily: 'Arial',
            color: '#7f8c8d',
            fontStyle: 'bold'
        });
        this.add.text(200, startY + 35, 'Duration', {
            fontSize: '14px',
            fontFamily: 'Arial',
            color: '#7f8c8d',
            fontStyle: 'bold'
        });
        this.add.text(320, startY + 35, 'Score', {
            fontSize: '14px',
            fontFamily: 'Arial',
            color: '#7f8c8d',
            fontStyle: 'bold'
        });

        // Recent sessions (last 5)
        const recentSessions = this.sessionHistory.slice(-5).reverse();

        recentSessions.forEach((session, index) => {
            const y = startY + 60 + index * 25;

            this.add.text(50, y, this.formatDate(session.date), {
                fontSize: '13px',
                fontFamily: 'Arial',
                color: '#34495e'
            });

            this.add.text(200, y, this.formatDuration(session.duration), {
                fontSize: '13px',
                fontFamily: 'Arial',
                color: '#34495e'
            });

            this.add.text(320, y, `${session.score} stars`, {
                fontSize: '13px',
                fontFamily: 'Arial',
                color: '#34495e'
            });
        });
    }

    createChartsSection() {
        // This would integrate Chart.js or use Phaser graphics
        // Example: Progress over time line chart
        // Position at bottom or in separate scrollable area
    }

    createExportImportButtons() {
        // Export button
        const exportBtn = this.add.text(600, 550, 'Export Progress', {
            fontSize: '16px',
            backgroundColor: '#3498db',
            padding: { x: 15, y: 8 },
            color: '#ffffff',
            fontFamily: 'Arial'
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        exportBtn.on('pointerdown', () => {
            this.exportProgress();
        });

        // Import button
        const importBtn = this.add.text(730, 550, 'Import Progress', {
            fontSize: '16px',
            backgroundColor: '#2ecc71',
            padding: { x: 15, y: 8 },
            color: '#ffffff',
            fontFamily: 'Arial'
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        importBtn.on('pointerdown', () => {
            this.importProgress();
        });
    }

    exportProgress() {
        const exportData = {
            version: '1.0',
            exportDate: new Date().toISOString(),
            letters: this.letterData,
            sightWords: this.sightWordData,
            sessions: this.sessionHistory,
            settings: this.progressTracker.getSettings()
        };

        const dataStr = JSON.stringify(exportData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });

        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `aurora-backup-${this.formatDateForFilename(new Date())}.json`;
        link.click();

        URL.revokeObjectURL(url);

        // Show success message
        this.showMessage('Progress exported successfully!');
    }

    importProgress() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'application/json';

        input.onchange = (event) => {
            const file = event.target.files[0];
            const reader = new FileReader();

            reader.onload = (e) => {
                try {
                    const importData = JSON.parse(e.target.result);

                    // Validate structure
                    if (!importData.letters || !importData.sightWords) {
                        throw new Error('Invalid backup file format');
                    }

                    // Confirm before overwriting
                    if (confirm('This will replace your current progress. Continue?')) {
                        this.progressTracker.importData(importData);
                        this.loadProgressData(); // Reload display
                        this.showMessage('Progress imported successfully!');
                        this.scene.restart(); // Refresh dashboard
                    }
                } catch (error) {
                    this.showMessage('Error: Invalid backup file', true);
                    console.error('Import error:', error);
                }
            };

            reader.readAsText(file);
        };

        input.click();
    }

    createBackButton() {
        const backBtn = this.add.text(70, 550, '← Back to Menu', {
            fontSize: '16px',
            backgroundColor: '#95a5a6',
            padding: { x: 15, y: 8 },
            color: '#ffffff',
            fontFamily: 'Arial'
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        backBtn.on('pointerdown', () => {
            this.scene.start('MainMenuScene');
        });
    }

    // Helper methods
    formatDate(timestamp) {
        const date = new Date(timestamp);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (date.toDateString() === today.toDateString()) {
            return 'Today';
        } else if (date.toDateString() === yesterday.toDateString()) {
            return 'Yesterday';
        } else {
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        }
    }

    formatDuration(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}m ${secs}s`;
    }

    formatDateForFilename(date) {
        return date.toISOString().split('T')[0];
    }

    calculateTotalTime() {
        const totalSeconds = this.sessionHistory.reduce((sum, session) => sum + session.duration, 0);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);

        if (hours > 0) {
            return `${hours}h ${minutes}m`;
        } else {
            return `${minutes}m`;
        }
    }

    showMessage(text, isError = false) {
        const message = this.add.text(400, 300, text, {
            fontSize: '18px',
            backgroundColor: isError ? '#e74c3c' : '#2ecc71',
            padding: { x: 20, y: 10 },
            color: '#ffffff',
            fontFamily: 'Arial'
        }).setOrigin(0.5).setDepth(1000);

        this.time.delayedCall(3000, () => {
            message.destroy();
        });
    }
}
```

### Chart.js Integration Example
```javascript
// In index.html, add:
// <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>

// In DashboardScene:
createProgressChart() {
    // Create canvas element
    const canvas = document.createElement('canvas');
    canvas.id = 'progressChart';
    canvas.width = 600;
    canvas.height = 300;
    document.body.appendChild(canvas);

    // Create chart
    const ctx = canvas.getContext('2d');
    const chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: this.getDateLabels(),
            datasets: [{
                label: 'Letters Mastered',
                data: this.getLetterProgressData(),
                borderColor: '#3498db',
                backgroundColor: 'rgba(52, 152, 219, 0.1)',
                tension: 0.3
            }, {
                label: 'Sight Words Learned',
                data: this.getSightWordProgressData(),
                borderColor: '#2ecc71',
                backgroundColor: 'rgba(46, 204, 113, 0.1)',
                tension: 0.3
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Learning Progress Over Time'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Items Mastered'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Date'
                    }
                }
            }
        }
    });

    // Position canvas over Phaser canvas or in DOM element
}
```

## Acceptance Criteria
- [ ] DashboardScene loads without errors
- [ ] Letters mastered section displays all 26 letters with correct status
- [ ] Sight words learned section shows count and recent words
- [ ] Session history displays last 10+ sessions with date, duration, score
- [ ] Summary statistics are accurate and clearly displayed
- [ ] At least one chart/visualization is implemented (progress over time)
- [ ] Export button generates valid JSON backup file
- [ ] Import button successfully restores progress from backup
- [ ] Import validates file format and shows error for invalid files
- [ ] Back button returns to main menu
- [ ] All data refreshes when scene is restarted
- [ ] UI is clean, professional, and easy to read
- [ ] No console errors or warnings
- [ ] Dashboard works on tablet and desktop screen sizes

## Testing Steps
1. Open game and navigate to Dashboard (add button to main menu)
2. Verify all sections render correctly
3. Check letters section shows mastered letters in green
4. Verify sight words count matches actual progress
5. Check session history shows recent sessions
6. Verify summary statistics are accurate
7. Click Export Progress button
   - Verify JSON file downloads
   - Open file and verify structure is valid
8. Click Import Progress button
   - Select previously exported file
   - Verify confirmation dialog appears
   - Confirm import and verify data loads correctly
9. Test with invalid JSON file
   - Verify error message displays
10. Click Back to Menu button and verify navigation works
11. Play a session, return to dashboard, verify new data appears
12. Test on different screen sizes (if applicable)

## Estimated Time
3 hours

## Dependencies
- ProgressTracker class with data access methods
- LocalStorage or persistent data layer
- Chart.js library (optional, can use Phaser graphics)
- All mini-games tracking progress correctly
- MainMenuScene updated with Dashboard button

## Risks
- **Large data sets**: May need pagination or virtual scrolling for many sessions
- **Chart rendering**: Chart.js vs Phaser graphics - ensure compatibility
- **File export/import security**: Validate JSON thoroughly to prevent injection
- **Browser compatibility**: File download/upload may vary by browser
- **Data migration**: Future version changes may require schema updates

## ADHD-Friendly Design Considerations
- **Clear sections**: Visual separation between data types
- **Color coding**: Instant understanding of mastery levels
- **Summary first**: Key metrics at top, details below
- **Progressive disclosure**: Show recent items, hide older data unless requested
- **Visual feedback**: Immediate confirmation of export/import actions
- **Simple navigation**: Clear back button, no complex menu structures

## Notes
- Dashboard is for parents, not children - can use more text and complexity
- Consider password protection in future phase to prevent accidental data changes
- Export format should be human-readable for manual editing if needed
- Keep performance in mind - dashboard should load quickly even with lots of data
- Consider adding print stylesheet for progress reports
- Future enhancement: Email progress reports, share on social media

## Completion Checklist
- [ ] DashboardScene.js created and integrated
- [ ] All data sections implemented and displaying correctly
- [ ] Charts/visualizations rendering properly
- [ ] Export functionality working and generating valid JSON
- [ ] Import functionality working with validation
- [ ] Back navigation working
- [ ] All acceptance criteria met
- [ ] Tested with various data states (empty, partial, full)
- [ ] Tested export/import round-trip
- [ ] No console errors
- [ ] Ready to proceed to Phase 44

## Future Enhancements (Post-MVP)
- Multiple child profiles support
- Detailed analytics (time of day patterns, difficulty curves)
- Goal setting and achievement tracking
- Comparison to age-group averages (anonymized data)
- Export to PDF for sharing with teachers
- Integration with educational standards/curriculum frameworks
