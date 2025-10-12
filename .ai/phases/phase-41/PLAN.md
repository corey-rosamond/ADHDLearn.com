# Phase 41: Game Session Orchestrator

## Goal
Create a session orchestrator that rotates between mini-games to maintain engagement and variety throughout play sessions

## Context
Aurora needs variety to stay engaged. This phase creates the GameSessionScene that:
1. Manages sequences of 3 mini-games per session
2. Smoothly transitions between different game types
3. Tracks overall session progress and aggregate scores
4. Maintains engagement through variety and pacing
5. Provides ADHD-friendly structure with clear progression

## Prerequisites
- Phase 1-40 completed
- Multiple mini-game scenes implemented (LetterPopScene, MemoryMatchScene, TraceLetterScene, etc.)
- Progress tracking system in place
- Scene transition system working
- Audio feedback system functional

## Tasks

### 1. Create GameSessionScene.js
- Create src/scenes/GameSessionScene.js
- Extend Phaser.Scene with session orchestration logic
- Initialize session state tracking
- Set up mini-game queue management
- Configure session parameters (number of games, duration, difficulty)

### 2. Implement Mini-Game Rotation Algorithm
- Create game selection algorithm (random, weighted, or sequential)
- Ensure variety: no immediate repeats of same game type
- Consider difficulty progression within session
- Implement game queue with look-ahead to prevent repetition
- Support parent-configurable game preferences

### 3. Build Session State Manager
- Track current game index in session
- Monitor games completed count
- Store aggregate scores across all games
- Calculate session-wide performance metrics
- Maintain engagement tracking (time per game, attempts, etc.)

### 4. Implement Game Transitions
- Create smooth fade transitions between games
- Display "Get Ready!" or "Next Game!" transition screens
- Show progress indicator (Game 1 of 3, Game 2 of 3, etc.)
- Include encouraging messages between games
- Implement 3-5 second preparation time between games

### 5. Create Session Results Aggregation
- Collect scores from each completed game
- Calculate total session score
- Track letters/words practiced in session
- Generate session summary data structure
- Prepare data for results screen display

### 6. Build Session Flow Controller
- Start session with welcome/intro
- Loop through game sequence
- Handle game completion callbacks
- Manage transitions between games
- End session with results summary

## Implementation Details

### GameSessionScene Structure
```javascript
class GameSessionScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameSessionScene' });
        this.sessionConfig = {
            gamesPerSession: 3,
            allowRepeats: false,
            difficultyProgression: true,
            transitionDuration: 3000
        };
    }

    init(data) {
        // Initialize session state
        this.currentGameIndex = 0;
        this.gamesCompleted = 0;
        this.sessionGames = [];
        this.sessionResults = {
            scores: [],
            totalScore: 0,
            itemsPracticed: [],
            timeSpent: 0,
            accuracy: 0
        };
        this.sessionStartTime = Date.now();
    }

    create() {
        // Set up session UI
        this.createSessionUI();

        // Generate game sequence
        this.generateGameSequence();

        // Start first game
        this.startNextGame();
    }

    generateGameSequence() {
        // Available mini-game types
        const availableGames = [
            'LetterPopScene',
            'MemoryMatchScene',
            'TraceLetterScene',
            'SightWordScene',
            'PhonicsScene'
        ];

        // Generate sequence with variety
        this.sessionGames = this.selectGamesWithVariety(
            availableGames,
            this.sessionConfig.gamesPerSession
        );
    }

    selectGamesWithVariety(games, count) {
        // Smart selection algorithm
        const selected = [];
        const available = [...games];

        for (let i = 0; i < count; i++) {
            // Remove last selected to prevent immediate repeats
            const filtered = i === 0 ? available :
                available.filter(g => g !== selected[i - 1]);

            // Random selection from filtered list
            const randomIndex = Phaser.Math.Between(0, filtered.length - 1);
            selected.push(filtered[randomIndex]);
        }

        return selected;
    }

    startNextGame() {
        if (this.currentGameIndex >= this.sessionGames.length) {
            // Session complete
            this.endSession();
            return;
        }

        const nextGame = this.sessionGames[this.currentGameIndex];

        // Show transition screen
        this.showTransitionScreen(nextGame, () => {
            // Launch the game
            this.scene.start(nextGame, {
                sessionMode: true,
                gameNumber: this.currentGameIndex + 1,
                totalGames: this.sessionGames.length,
                returnScene: 'GameSessionScene'
            });

            // Listen for game completion
            this.scene.get(nextGame).events.once('gameComplete',
                (result) => this.handleGameComplete(result));
        });
    }

    showTransitionScreen(nextGame, callback) {
        // Create transition overlay
        const overlay = this.add.rectangle(
            400, 300, 800, 600, 0x000000, 0.8
        );

        // Show progress
        const progressText = this.add.text(400, 200,
            `Game ${this.currentGameIndex + 1} of ${this.sessionGames.length}`,
            {
                fontSize: '32px',
                fontFamily: 'Arial',
                color: '#ffffff'
            }
        ).setOrigin(0.5);

        // Show next game name
        const gameNames = {
            'LetterPopScene': 'Letter Pop',
            'MemoryMatchScene': 'Memory Match',
            'TraceLetterScene': 'Trace Letters',
            'SightWordScene': 'Sight Words',
            'PhonicsScene': 'Phonics Fun'
        };

        const gameText = this.add.text(400, 300,
            `Get Ready for:\n${gameNames[nextGame] || 'Next Game'}!`,
            {
                fontSize: '48px',
                fontFamily: 'Arial',
                color: '#FFD700',
                align: 'center'
            }
        ).setOrigin(0.5);

        // Encouraging message
        const encouragements = [
            "You're doing great!",
            "Let's keep going!",
            "Aurora's having fun!",
            "Keep up the good work!",
            "You've got this!"
        ];
        const encouragement = Phaser.Utils.Array.GetRandom(encouragements);

        const encourageText = this.add.text(400, 400,
            encouragement,
            {
                fontSize: '24px',
                fontFamily: 'Arial',
                color: '#90EE90',
                align: 'center'
            }
        ).setOrigin(0.5);

        // Play transition sound
        this.sound.play('transition');

        // Auto-advance after delay
        this.time.delayedCall(this.sessionConfig.transitionDuration, () => {
            overlay.destroy();
            progressText.destroy();
            gameText.destroy();
            encourageText.destroy();
            callback();
        });
    }

    handleGameComplete(result) {
        // Store game results
        this.sessionResults.scores.push(result.score);
        this.sessionResults.totalScore += result.score;

        if (result.itemsPracticed) {
            this.sessionResults.itemsPracticed.push(...result.itemsPracticed);
        }

        // Update progress
        this.gamesCompleted++;
        this.currentGameIndex++;

        // Continue session
        this.startNextGame();
    }

    endSession() {
        // Calculate final metrics
        this.sessionResults.timeSpent =
            Date.now() - this.sessionStartTime;
        this.sessionResults.accuracy =
            this.calculateSessionAccuracy();

        // Transition to results screen
        this.scene.start('SessionResultsScene', {
            results: this.sessionResults,
            gamesPlayed: this.sessionGames
        });
    }

    calculateSessionAccuracy() {
        // Calculate aggregate accuracy from all games
        const totalAttempts = this.sessionResults.scores.reduce(
            (sum, score) => sum + (score.attempts || 0), 0
        );
        const totalCorrect = this.sessionResults.scores.reduce(
            (sum, score) => sum + (score.correct || 0), 0
        );

        return totalAttempts > 0 ?
            Math.round((totalCorrect / totalAttempts) * 100) : 0;
    }
}
```

### Game Selection Algorithm Options

**Option 1: Random with No-Repeat Filter**
```javascript
selectGamesWithVariety(games, count) {
    const selected = [];
    let lastGame = null;

    for (let i = 0; i < count; i++) {
        const available = games.filter(g => g !== lastGame);
        const game = Phaser.Utils.Array.GetRandom(available);
        selected.push(game);
        lastGame = game;
    }

    return selected;
}
```

**Option 2: Weighted Selection (Favor Less-Played Games)**
```javascript
selectGamesWithVariety(games, count) {
    // Track game play frequency
    const playCount = this.registry.get('gamePlayCount') || {};

    const selected = [];
    for (let i = 0; i < count; i++) {
        // Calculate weights (less played = higher weight)
        const weights = games.map(game => {
            const played = playCount[game] || 0;
            return Math.max(1, 10 - played);
        });

        // Weighted random selection
        const game = this.weightedRandom(games, weights);
        selected.push(game);

        // Update play count
        playCount[game] = (playCount[game] || 0) + 1;
    }

    this.registry.set('gamePlayCount', playCount);
    return selected;
}

weightedRandom(items, weights) {
    const totalWeight = weights.reduce((sum, w) => sum + w, 0);
    let random = Math.random() * totalWeight;

    for (let i = 0; i < items.length; i++) {
        random -= weights[i];
        if (random <= 0) return items[i];
    }

    return items[items.length - 1];
}
```

**Option 3: Difficulty Progression**
```javascript
selectGamesWithVariety(games, count) {
    // Define difficulty levels
    const gameDifficulty = {
        'LetterPopScene': 1,      // Easy
        'SightWordScene': 2,       // Medium
        'MemoryMatchScene': 2,     // Medium
        'TraceLetterScene': 3,     // Hard
        'PhonicsScene': 3          // Hard
    };

    // Start easy, increase difficulty
    const selected = [];
    const sortedGames = games.sort((a, b) =>
        gameDifficulty[a] - gameDifficulty[b]
    );

    // Select with increasing difficulty
    for (let i = 0; i < count; i++) {
        const targetDifficulty = Math.ceil((i + 1) / count * 3);
        const suitable = sortedGames.filter(g =>
            gameDifficulty[g] <= targetDifficulty
        );
        const game = Phaser.Utils.Array.GetRandom(suitable);
        selected.push(game);
    }

    return selected;
}
```

### Session Configuration Object
```javascript
const defaultSessionConfig = {
    gamesPerSession: 3,           // Number of games in sequence
    allowRepeats: false,           // Can same game appear twice?
    difficultyProgression: true,   // Increase difficulty?
    transitionDuration: 3000,      // ms between games
    showProgress: true,            // Show "Game X of Y"?
    encouragementFrequency: 'always', // always, sometimes, never
    parentControl: {
        selectableGames: null,     // null = all, or array of allowed games
        fixedSequence: null        // null = auto, or specific sequence
    }
};
```

### Session Results Data Structure
```javascript
const sessionResults = {
    scores: [
        { game: 'LetterPopScene', score: 150, correct: 10, attempts: 12 },
        { game: 'MemoryMatchScene', score: 200, correct: 8, attempts: 8 },
        { game: 'TraceLetterScene', score: 180, correct: 5, attempts: 6 }
    ],
    totalScore: 530,
    itemsPracticed: ['A', 'B', 'C', 'the', 'cat', 'dog'],
    timeSpent: 600000,  // 10 minutes
    accuracy: 85,        // percentage
    gamesCompleted: 3,
    sessionDate: '2025-10-12T19:30:00Z',
    childName: 'Aurora'
};
```

## Acceptance Criteria
- [ ] GameSessionScene successfully manages sequence of 3 mini-games
- [ ] Game selection algorithm ensures variety (no immediate repeats)
- [ ] Transition screens display between games (3-5 seconds)
- [ ] Progress indicator shows current game number (e.g., "Game 2 of 3")
- [ ] Encouraging messages appear during transitions
- [ ] Session results aggregate correctly across all games
- [ ] Total score calculation is accurate
- [ ] Items practiced list includes all letters/words from session
- [ ] Session flows smoothly without errors or freezing
- [ ] Each game receives correct session context data
- [ ] Session completion triggers results screen
- [ ] Variety maintains Aurora's engagement throughout session

## Testing Steps
1. Start GameSessionScene from main menu
2. Verify first game loads after transition screen
3. Complete first game and verify:
   - Transition screen appears
   - Progress shows "Game 2 of 3"
   - Encouraging message displays
   - Next game is different from first
4. Complete second game and verify same transitions
5. Complete third game and verify:
   - Session ends (no fourth game)
   - Results screen appears
   - All scores aggregated correctly
6. Test multiple sessions to verify variety algorithm:
   - Games vary across sessions
   - No immediate repeats within session
   - All game types appear over time
7. Test with different session lengths (1 game, 3 games, 5 games)
8. Verify session state persists correctly
9. Test interruption handling (what if user quits mid-session?)
10. Check browser console for errors

## Estimated Time
2 hours

## Dependencies
- Multiple mini-game scenes implemented (LetterPopScene, MemoryMatchScene, etc.)
- Scene transition system functional
- Progress tracking system in place
- Audio assets for transitions
- SessionResultsScene created for displaying results

## Risks
- **Game selection becoming predictable**: Use good randomization with no-repeat logic
- **Transition timing too fast/slow**: Make configurable, test with Aurora
- **Session state loss on interruption**: Implement save/resume if needed in future
- **Performance issues with multiple scene loads**: Pre-load scenes to reduce lag
- **Engagement dropping mid-session**: Use encouraging messages and progress indicators

## ADHD-Friendly Design Considerations
- **Variety is key**: 3 different games prevent boredom and maintain engagement
- **Clear progress indicators**: Aurora knows how much is left ("Game 2 of 3")
- **Short transitions**: 3-5 seconds keeps momentum without rushing
- **Encouraging feedback**: Positive messages between games boost motivation
- **Sense of accomplishment**: Completing a sequence feels rewarding
- **Predictable structure**: Knowing there are 3 games helps with expectations
- **No surprises**: Transition screens prepare for next activity
- **Autonomy**: Aurora completes games at her own pace within session

## Notes
- Session length of 3 games works well with 10-minute timer (Phase 42)
- Each game averages 3-4 minutes, leaving time for transitions
- Variety algorithm is critical for replayability
- Consider saving favorite games in future phase
- Parent configuration can customize game selection
- Session results feed into long-term progress tracking
- This phase sets up framework for Phase 42 timer integration

## Parent Configuration Options
```javascript
// Future enhancement: Parent dashboard settings
const parentSettings = {
    sessionLength: 3,                    // 1-5 games
    enabledGames: ['all'],               // or specific game list
    difficultyLevel: 'auto',             // auto, easy, medium, hard
    sessionFrequency: 'daily',           // daily, custom
    breakReminders: true,                // Enable Phase 42 timers
    reportingDetail: 'summary'           // summary, detailed
};
```

## Completion Checklist
- [ ] GameSessionScene.js created in src/scenes/
- [ ] Game rotation algorithm implemented
- [ ] Transition screens working smoothly
- [ ] Session state tracking functional
- [ ] Results aggregation calculating correctly
- [ ] All acceptance criteria met
- [ ] Tested with multiple game sequences
- [ ] Variety algorithm produces diverse sessions
- [ ] No console errors during session flow
- [ ] Integration with existing mini-games successful
- [ ] Documentation updated
- [ ] Ready to proceed to Phase 42 (Session Timer)
