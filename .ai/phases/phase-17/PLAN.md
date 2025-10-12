# Phase 17: ProgressManager Service

## Goal
Create a robust progress tracking service that monitors Aurora's learning journey, calculates letter mastery, and persists data across sessions using LocalStorage

## Context
This is a critical service that forms the foundation of Aurora's personalized learning experience. The ProgressManager needs to:
1. Track which letters Aurora has seen and practiced
2. Calculate success rates and mastery levels for each letter
3. Record session history and learning patterns
4. Persist all data to LocalStorage automatically
5. Load progress seamlessly on game start
6. Provide clear console logging for monitoring progress

This service will later be used for adaptive difficulty, progress reports, and parental insights.

## Prerequisites
- Phase 1-16 completed
- Basic game loop and letter presentation working
- LocalStorage available in browser environment
- Console logging utilities set up

## Tasks

### 1. Create ProgressManager Service Class
**File**: `src/services/ProgressManager.js`

Create a singleton service class that manages all progress tracking:
- Initialize with default data structure
- Provide public methods for recording attempts
- Calculate letter-specific statistics
- Manage session data
- Handle save/load operations

### 2. Design Data Structure Schema
Define comprehensive data structure for tracking:
- **Letter Progress**: Per-letter statistics (attempts, successes, failures, mastery level)
- **Session History**: Time-stamped session records with performance metrics
- **Global Statistics**: Total letters learned, overall accuracy, total play time
- **Metadata**: Last played date, version number, user preferences

### 3. Implement Letter Tracking Methods
Create methods to record learning events:
- `recordLetterAttempt(letter, success)` - Log each letter interaction
- `getLetterStats(letter)` - Retrieve statistics for specific letter
- `getAllLetterStats()` - Get complete letter progress map
- `getLettersNeedingPractice()` - Identify struggling letters
- `getMasteredLetters()` - Get list of mastered letters

### 4. Implement Mastery Calculation Algorithm
Define mastery levels based on accuracy thresholds:
- **Not Started** (0 attempts): No data yet
- **Learning** (< 60% accuracy): Needs more practice
- **Practicing** (60-79% accuracy): Making progress
- **Proficient** (80-89% accuracy): Good understanding
- **Mastered** (90%+ accuracy with 10+ attempts): Letter mastered

Include recency weighting to prioritize recent performance.

### 5. Implement Session Tracking
Track each play session:
- Session start/end timestamps
- Letters practiced in session
- Session accuracy rate
- Duration of play
- New letters introduced
- Progress made (letters moved to higher mastery levels)

### 6. Implement LocalStorage Integration
Create save/load methods with error handling:
- `saveProgress()` - Serialize and save to LocalStorage
- `loadProgress()` - Load and deserialize from LocalStorage
- `clearProgress()` - Reset all data (with confirmation)
- Auto-save after each round completion
- Graceful fallback if LocalStorage unavailable

### 7. Add Data Validation and Migration
Ensure data integrity:
- Validate loaded data structure
- Handle corrupted or missing data gracefully
- Support versioning for future schema changes
- Migrate old data formats to new versions
- Set defaults for missing fields

### 8. Create Console Logging Interface
Provide developer-friendly console commands:
- `ProgressManager.viewProgress()` - Pretty-print all progress
- `ProgressManager.viewLetterProgress(letter)` - Detailed letter stats
- `ProgressManager.viewSessions()` - Session history
- `ProgressManager.exportData()` - Export as JSON for backup
- `ProgressManager.importData(json)` - Import from backup

## Implementation Details

### Data Structure Schema

```javascript
const DEFAULT_PROGRESS_DATA = {
    version: "1.0.0",
    metadata: {
        firstPlayed: null,        // ISO timestamp
        lastPlayed: null,         // ISO timestamp
        totalPlayTime: 0,         // milliseconds
        gamesCompleted: 0
    },
    letters: {
        // Each letter (A-Z, lowercase)
        "a": {
            attempts: 0,
            successes: 0,
            failures: 0,
            accuracy: 0,            // percentage
            masteryLevel: "not_started",
            firstSeen: null,        // ISO timestamp
            lastSeen: null,         // ISO timestamp
            recentAttempts: []      // Last 10 attempts [true, false, ...]
        }
        // ... repeated for all 26 letters
    },
    sessions: [
        {
            id: "session_1697123456789",
            startTime: "2024-10-12T10:30:00.000Z",
            endTime: "2024-10-12T10:45:00.000Z",
            duration: 900000,       // milliseconds
            lettersPracticed: ["a", "b", "c"],
            totalAttempts: 20,
            totalSuccesses: 16,
            accuracy: 80,           // percentage
            newLettersIntroduced: ["c"],
            masteryChanges: [
                { letter: "a", from: "learning", to: "practicing" }
            ]
        }
    ],
    globalStats: {
        totalAttempts: 0,
        totalSuccesses: 0,
        overallAccuracy: 0,
        lettersIntroduced: 0,
        lettersMastered: 0,
        currentStreak: 0,         // consecutive correct
        bestStreak: 0
    }
};
```

### ProgressManager Class Structure

```javascript
class ProgressManager {
    constructor() {
        if (ProgressManager.instance) {
            return ProgressManager.instance;
        }

        this.data = null;
        this.currentSession = null;
        this.hasUnsavedChanges = false;

        ProgressManager.instance = this;
    }

    // ===== INITIALIZATION =====
    initialize() {
        console.log("[ProgressManager] Initializing...");
        this.loadProgress();
        this.startNewSession();
    }

    // ===== LETTER TRACKING =====
    recordLetterAttempt(letter, success) {
        letter = letter.toLowerCase();

        if (!this.data.letters[letter]) {
            this.initializeLetter(letter);
        }

        const letterData = this.data.letters[letter];
        const now = new Date().toISOString();

        // Update letter stats
        letterData.attempts++;
        if (success) {
            letterData.successes++;
            this.data.globalStats.currentStreak++;
            if (this.data.globalStats.currentStreak > this.data.globalStats.bestStreak) {
                this.data.globalStats.bestStreak = this.data.globalStats.currentStreak;
            }
        } else {
            letterData.failures++;
            this.data.globalStats.currentStreak = 0;
        }

        // Update accuracy
        letterData.accuracy = (letterData.successes / letterData.attempts * 100).toFixed(2);

        // Update recent attempts (keep last 10)
        letterData.recentAttempts.push(success);
        if (letterData.recentAttempts.length > 10) {
            letterData.recentAttempts.shift();
        }

        // Update timestamps
        if (!letterData.firstSeen) {
            letterData.firstSeen = now;
            this.data.globalStats.lettersIntroduced++;
        }
        letterData.lastSeen = now;

        // Recalculate mastery level
        const oldMastery = letterData.masteryLevel;
        letterData.masteryLevel = this.calculateMasteryLevel(letterData);

        // Track mastery changes
        if (oldMastery !== letterData.masteryLevel) {
            this.currentSession.masteryChanges.push({
                letter: letter,
                from: oldMastery,
                to: letterData.masteryLevel
            });

            if (letterData.masteryLevel === "mastered") {
                this.data.globalStats.lettersMastered++;
            }
        }

        // Update global stats
        this.data.globalStats.totalAttempts++;
        if (success) {
            this.data.globalStats.totalSuccesses++;
        }
        this.data.globalStats.overallAccuracy =
            (this.data.globalStats.totalSuccesses / this.data.globalStats.totalAttempts * 100).toFixed(2);

        // Update current session
        this.currentSession.totalAttempts++;
        if (success) {
            this.currentSession.totalSuccesses++;
        }
        this.currentSession.accuracy =
            (this.currentSession.totalSuccesses / this.currentSession.totalAttempts * 100).toFixed(2);

        if (!this.currentSession.lettersPracticed.includes(letter)) {
            this.currentSession.lettersPracticed.push(letter);
        }

        this.hasUnsavedChanges = true;

        console.log(`[ProgressManager] Letter '${letter}': ${success ? 'SUCCESS' : 'FAIL'} | Accuracy: ${letterData.accuracy}% | Mastery: ${letterData.masteryLevel}`);
    }

    // ===== MASTERY CALCULATION =====
    calculateMasteryLevel(letterData) {
        const { attempts, accuracy, recentAttempts } = letterData;

        // Not started
        if (attempts === 0) {
            return "not_started";
        }

        // Need minimum attempts for higher mastery levels
        if (attempts < 5) {
            return "learning";
        }

        // Calculate recent accuracy (last 10 attempts)
        let recentAccuracy = accuracy;
        if (recentAttempts.length >= 5) {
            const recentSuccesses = recentAttempts.filter(a => a === true).length;
            recentAccuracy = (recentSuccesses / recentAttempts.length * 100);
        }

        // Weight recent performance more heavily (70% recent, 30% overall)
        const weightedAccuracy = (recentAccuracy * 0.7) + (accuracy * 0.3);

        // Mastery thresholds
        if (weightedAccuracy >= 90 && attempts >= 10) {
            return "mastered";
        } else if (weightedAccuracy >= 80) {
            return "proficient";
        } else if (weightedAccuracy >= 60) {
            return "practicing";
        } else {
            return "learning";
        }
    }

    // ===== SESSION MANAGEMENT =====
    startNewSession() {
        this.currentSession = {
            id: `session_${Date.now()}`,
            startTime: new Date().toISOString(),
            endTime: null,
            duration: 0,
            lettersPracticed: [],
            totalAttempts: 0,
            totalSuccesses: 0,
            accuracy: 0,
            newLettersIntroduced: [],
            masteryChanges: []
        };

        console.log(`[ProgressManager] New session started: ${this.currentSession.id}`);
    }

    endCurrentSession() {
        if (!this.currentSession) return;

        const now = new Date().toISOString();
        this.currentSession.endTime = now;
        this.currentSession.duration =
            new Date(now).getTime() - new Date(this.currentSession.startTime).getTime();

        this.data.sessions.push(this.currentSession);
        this.data.metadata.lastPlayed = now;
        this.data.metadata.totalPlayTime += this.currentSession.duration;
        this.data.metadata.gamesCompleted++;

        console.log(`[ProgressManager] Session ended: ${this.currentSession.id} | Duration: ${Math.round(this.currentSession.duration / 1000)}s`);

        this.saveProgress();
        this.currentSession = null;
    }

    // ===== LOCALSTORAGE OPERATIONS =====
    saveProgress() {
        try {
            const jsonData = JSON.stringify(this.data);
            localStorage.setItem('aurora_letter_progress', jsonData);
            this.hasUnsavedChanges = false;
            console.log("[ProgressManager] Progress saved to LocalStorage");
            return true;
        } catch (error) {
            console.error("[ProgressManager] Failed to save progress:", error);
            // LocalStorage might be full or unavailable
            return false;
        }
    }

    loadProgress() {
        try {
            const jsonData = localStorage.getItem('aurora_letter_progress');

            if (jsonData) {
                this.data = JSON.parse(jsonData);
                console.log("[ProgressManager] Progress loaded from LocalStorage");

                // Validate and migrate if needed
                this.validateAndMigrateData();
            } else {
                console.log("[ProgressManager] No saved progress found, initializing new data");
                this.data = this.createDefaultData();
            }

            return true;
        } catch (error) {
            console.error("[ProgressManager] Failed to load progress:", error);
            console.log("[ProgressManager] Initializing with default data");
            this.data = this.createDefaultData();
            return false;
        }
    }

    clearProgress() {
        console.warn("[ProgressManager] Clearing all progress data!");
        localStorage.removeItem('aurora_letter_progress');
        this.data = this.createDefaultData();
        this.currentSession = null;
        this.hasUnsavedChanges = false;
        console.log("[ProgressManager] Progress cleared");
    }

    // ===== DATA UTILITIES =====
    createDefaultData() {
        const data = {
            version: "1.0.0",
            metadata: {
                firstPlayed: new Date().toISOString(),
                lastPlayed: null,
                totalPlayTime: 0,
                gamesCompleted: 0
            },
            letters: {},
            sessions: [],
            globalStats: {
                totalAttempts: 0,
                totalSuccesses: 0,
                overallAccuracy: 0,
                lettersIntroduced: 0,
                lettersMastered: 0,
                currentStreak: 0,
                bestStreak: 0
            }
        };

        // Initialize all 26 letters
        const alphabet = 'abcdefghijklmnopqrstuvwxyz';
        for (let letter of alphabet) {
            data.letters[letter] = this.createDefaultLetterData();
        }

        return data;
    }

    createDefaultLetterData() {
        return {
            attempts: 0,
            successes: 0,
            failures: 0,
            accuracy: 0,
            masteryLevel: "not_started",
            firstSeen: null,
            lastSeen: null,
            recentAttempts: []
        };
    }

    initializeLetter(letter) {
        if (!this.data.letters[letter]) {
            this.data.letters[letter] = this.createDefaultLetterData();
        }
    }

    validateAndMigrateData() {
        // Ensure all required fields exist
        if (!this.data.version) this.data.version = "1.0.0";
        if (!this.data.metadata) this.data.metadata = {
            firstPlayed: new Date().toISOString(),
            lastPlayed: null,
            totalPlayTime: 0,
            gamesCompleted: 0
        };
        if (!this.data.letters) this.data.letters = {};
        if (!this.data.sessions) this.data.sessions = [];
        if (!this.data.globalStats) this.data.globalStats = {
            totalAttempts: 0,
            totalSuccesses: 0,
            overallAccuracy: 0,
            lettersIntroduced: 0,
            lettersMastered: 0,
            currentStreak: 0,
            bestStreak: 0
        };

        // Ensure all letters exist
        const alphabet = 'abcdefghijklmnopqrstuvwxyz';
        for (let letter of alphabet) {
            if (!this.data.letters[letter]) {
                this.data.letters[letter] = this.createDefaultLetterData();
            }
        }

        console.log("[ProgressManager] Data validated and migrated if needed");
    }

    // ===== QUERY METHODS =====
    getLetterStats(letter) {
        return this.data.letters[letter.toLowerCase()];
    }

    getAllLetterStats() {
        return this.data.letters;
    }

    getLettersNeedingPractice() {
        return Object.keys(this.data.letters).filter(letter => {
            const stats = this.data.letters[letter];
            return stats.masteryLevel === "learning" || stats.masteryLevel === "practicing";
        });
    }

    getMasteredLetters() {
        return Object.keys(this.data.letters).filter(letter => {
            return this.data.letters[letter].masteryLevel === "mastered";
        });
    }

    getGlobalStats() {
        return this.data.globalStats;
    }

    // ===== CONSOLE INTERFACE =====
    viewProgress() {
        console.group("=== AURORA'S PROGRESS ===");
        console.log("Overall Accuracy:", this.data.globalStats.overallAccuracy + "%");
        console.log("Total Attempts:", this.data.globalStats.totalAttempts);
        console.log("Letters Introduced:", this.data.globalStats.lettersIntroduced);
        console.log("Letters Mastered:", this.data.globalStats.lettersMastered);
        console.log("Best Streak:", this.data.globalStats.bestStreak);
        console.log("\nMastery Breakdown:");

        const masteryGroups = {
            mastered: [],
            proficient: [],
            practicing: [],
            learning: [],
            not_started: []
        };

        Object.keys(this.data.letters).forEach(letter => {
            const stats = this.data.letters[letter];
            masteryGroups[stats.masteryLevel].push(letter.toUpperCase());
        });

        console.log("✅ Mastered:", masteryGroups.mastered.join(", ") || "None yet");
        console.log("⭐ Proficient:", masteryGroups.proficient.join(", ") || "None yet");
        console.log("📚 Practicing:", masteryGroups.practicing.join(", ") || "None yet");
        console.log("🌱 Learning:", masteryGroups.learning.join(", ") || "None yet");
        console.log("⚪ Not Started:", masteryGroups.not_started.join(", "));
        console.groupEnd();
    }

    viewLetterProgress(letter) {
        const stats = this.data.letters[letter.toLowerCase()];
        console.group(`=== LETTER '${letter.toUpperCase()}' PROGRESS ===`);
        console.log("Mastery Level:", stats.masteryLevel);
        console.log("Attempts:", stats.attempts);
        console.log("Successes:", stats.successes);
        console.log("Failures:", stats.failures);
        console.log("Accuracy:", stats.accuracy + "%");
        console.log("Recent Attempts:", stats.recentAttempts.map(s => s ? "✓" : "✗").join(" "));
        console.log("First Seen:", stats.firstSeen || "Never");
        console.log("Last Seen:", stats.lastSeen || "Never");
        console.groupEnd();
    }

    viewSessions() {
        console.group("=== SESSION HISTORY ===");
        console.log(`Total Sessions: ${this.data.sessions.length}`);
        console.log(`Total Play Time: ${Math.round(this.data.metadata.totalPlayTime / 60000)} minutes\n`);

        this.data.sessions.slice(-5).forEach((session, index) => {
            console.log(`Session ${index + 1}:`);
            console.log(`  Time: ${new Date(session.startTime).toLocaleString()}`);
            console.log(`  Duration: ${Math.round(session.duration / 1000)}s`);
            console.log(`  Letters: ${session.lettersPracticed.join(", ")}`);
            console.log(`  Accuracy: ${session.accuracy}%`);
            console.log("");
        });
        console.groupEnd();
    }

    exportData() {
        const json = JSON.stringify(this.data, null, 2);
        console.log("=== EXPORTED PROGRESS DATA ===");
        console.log(json);
        console.log("\n💡 Tip: Copy this JSON to save as backup");
        return json;
    }

    importData(jsonString) {
        try {
            const importedData = JSON.parse(jsonString);
            this.data = importedData;
            this.validateAndMigrateData();
            this.saveProgress();
            console.log("[ProgressManager] Data imported successfully");
            return true;
        } catch (error) {
            console.error("[ProgressManager] Failed to import data:", error);
            return false;
        }
    }
}

// Create singleton instance
const progressManager = new ProgressManager();

// Make available in console for debugging
if (typeof window !== 'undefined') {
    window.ProgressManager = progressManager;
}
```

### Integration with Game Loop

```javascript
// In your game scene (e.g., LetterPopScene)

class LetterPopScene extends Phaser.Scene {
    create() {
        // Initialize ProgressManager
        progressManager.initialize();

        // ... rest of scene setup
    }

    handleLetterClick(letter, isCorrect) {
        // Record the attempt
        progressManager.recordLetterAttempt(letter, isCorrect);

        // Visual feedback...
        // Audio feedback...
    }

    onRoundComplete() {
        // Auto-save progress
        progressManager.saveProgress();

        // Could show progress stats here
        const stats = progressManager.getGlobalStats();
        console.log(`Round complete! Accuracy: ${stats.overallAccuracy}%`);
    }

    shutdown() {
        // End session when leaving game
        progressManager.endCurrentSession();
    }
}
```

### Usage in Game Config

```javascript
// In src/config.js or main.js

// Initialize ProgressManager on game start
const game = new Phaser.Game(config);

// Set up auto-save every 30 seconds
setInterval(() => {
    if (progressManager.hasUnsavedChanges) {
        progressManager.saveProgress();
    }
}, 30000);

// Save on page unload
window.addEventListener('beforeunload', () => {
    progressManager.endCurrentSession();
});
```

## Acceptance Criteria
- [ ] ProgressManager.js file created in src/services/
- [ ] Singleton pattern implemented correctly
- [ ] All 26 letters initialized in data structure
- [ ] recordLetterAttempt() records data accurately
- [ ] Mastery levels calculated correctly based on thresholds
- [ ] LocalStorage save/load works without errors
- [ ] Progress persists after browser refresh
- [ ] Session data tracks start/end times and duration
- [ ] Global statistics calculate correctly
- [ ] Console interface methods work (viewProgress, etc.)
- [ ] Data validation handles corrupted data gracefully
- [ ] Auto-save triggers after each round
- [ ] Recent attempts array limited to last 10
- [ ] Accuracy calculations round to 2 decimal places
- [ ] Streak tracking works (current and best)
- [ ] Mastery changes logged in session data

## Testing Steps

### Initial Setup Test
1. Open browser console
2. Type `ProgressManager.viewProgress()`
3. Verify clean initial state (all letters "not_started")
4. Check LocalStorage (Application tab) - should have data

### Recording Attempts Test
5. Play a round of the game
6. Verify console logs show letter attempts
7. Type `ProgressManager.viewProgress()`
8. Verify letters practiced show updated stats
9. Check mastery levels change appropriately

### Persistence Test
10. Record several letter attempts
11. Refresh the browser
12. Type `ProgressManager.viewProgress()`
13. Verify all progress persists

### Mastery Calculation Test
14. Manually test mastery thresholds:
    - Record 5 successes on letter 'A'
    - Verify mastery level is "practicing" or "proficient"
    - Record 5 more successes (10 total, 100% accuracy)
    - Verify mastery level is "mastered"

### Session Tracking Test
15. Complete a full game session
16. Type `ProgressManager.viewSessions()`
17. Verify session recorded with correct data
18. Check duration, letters practiced, accuracy

### Data Export/Import Test
19. Type `ProgressManager.exportData()`
20. Copy the JSON output
21. Type `ProgressManager.clearProgress()`
22. Verify progress cleared
23. Type `ProgressManager.importData(copiedJSON)`
24. Verify progress restored

### Error Handling Test
25. Manually corrupt LocalStorage data
26. Refresh browser
27. Verify ProgressManager initializes with defaults
28. No console errors

### Console Interface Test
29. Test each console method:
    - `ProgressManager.viewProgress()`
    - `ProgressManager.viewLetterProgress('a')`
    - `ProgressManager.viewSessions()`
    - `ProgressManager.exportData()`
30. Verify all display correctly

## Estimated Time
2 hours
- 30 min: Class structure and data schema
- 30 min: Letter tracking and mastery calculation
- 30 min: LocalStorage integration
- 30 min: Testing and console interface

## Dependencies
- Browser with LocalStorage support
- Console access for debugging
- Game scene integration (LetterPopScene or similar)

## Risks
- **LocalStorage quota exceeded**: Implement data cleanup for very old sessions
- **Data corruption**: Validate on load, reset if invalid
- **Browser privacy mode**: LocalStorage may not persist, handle gracefully
- **Performance**: Keep session array limited to last 50 sessions max
- **Time zones**: Use ISO timestamps consistently

## Notes
- This is foundational for future features (adaptive difficulty, progress reports)
- Keep console logging verbose for Phase 17 - helps with debugging
- Consider adding data export feature for parents/educators later
- Session history could grow large - implement cleanup strategy in Phase 18+
- Mastery algorithm may need tuning based on Aurora's usage patterns
- Recent attempts weighting (70/30) is configurable for fine-tuning

## Completion Checklist
- [ ] ProgressManager.js created and documented
- [ ] All public methods implemented
- [ ] Data structure schema complete
- [ ] LocalStorage save/load working
- [ ] Mastery calculation algorithm verified
- [ ] Session tracking functional
- [ ] Console interface complete
- [ ] All acceptance criteria met
- [ ] Tested in Chrome and Firefox
- [ ] No console errors
- [ ] Progress persists across sessions
- [ ] Ready to integrate with game scenes
- [ ] Ready to proceed to Phase 18
