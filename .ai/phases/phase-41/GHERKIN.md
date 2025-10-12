# Phase 41: Game Session Orchestrator - BDD Scenarios

## Feature: Game Session Orchestration

```gherkin
Feature: Game Session Orchestrator
  As Aurora playing the letter game
  I want to play a sequence of different mini-games
  So that I stay engaged through variety and maintain focus

Background:
  Given the game is loaded
  And multiple mini-game scenes are available
  And GameSessionScene is registered
```

## Scenario: Start New Game Session

```gherkin
Scenario: Initialize a game session with 3 games
  Given I am on the main menu
  When I click "Start Session"
  Then the GameSessionScene should start
  And the session state should initialize with:
    | Property          | Value |
    | currentGameIndex  | 0     |
    | gamesCompleted    | 0     |
    | sessionStartTime  | current timestamp |
  And a sequence of 3 games should be generated
  And the first transition screen should appear
```

## Scenario: Generate Game Sequence with Variety

```gherkin
Scenario: Create varied game sequence with no immediate repeats
  Given GameSessionScene is initializing
  And 5 different mini-games are available:
    | Game Type          |
    | LetterPopScene     |
    | MemoryMatchScene   |
    | TraceLetterScene   |
    | SightWordScene     |
    | PhonicsScene       |
  When the game sequence is generated for 3 games
  Then 3 games should be selected
  And no game should appear twice in a row
  And the sequence should contain variety
  And each game should be from the available list
```

## Scenario: Display Transition Screen Before First Game

```gherkin
Scenario: Show transition with progress indicator
  Given a game session has started
  And the first game is "LetterPopScene"
  When the transition screen is displayed
  Then I should see "Game 1 of 3"
  And I should see "Get Ready for:"
  And I should see "Letter Pop!" or the game name
  And I should see an encouraging message like:
    | Message                |
    | You're doing great!    |
    | Let's keep going!      |
    | Aurora's having fun!   |
  And a transition sound should play
  And the screen should display for 3 seconds
  And the overlay should fade in smoothly
```

## Scenario: Launch First Game

```gherkin
Scenario: Start first mini-game with session context
  Given the transition screen has completed
  And the first game is "LetterPopScene"
  When the game launches
  Then LetterPopScene should start
  And it should receive session data:
    | Property     | Value                |
    | sessionMode  | true                 |
    | gameNumber   | 1                    |
    | totalGames   | 3                    |
    | returnScene  | 'GameSessionScene'   |
  And the game should be playable
  And the session should listen for 'gameComplete' event
```

## Scenario: Complete First Game and Transition

```gherkin
Scenario: Handle game completion and show next transition
  Given I am playing the first game
  And the first game is "LetterPopScene"
  When I complete the game
  And the game emits 'gameComplete' with result:
    | Property        | Value           |
    | game            | LetterPopScene  |
    | score           | 150             |
    | correct         | 10              |
    | attempts        | 12              |
    | itemsPracticed  | ['A', 'B', 'C'] |
  Then the session should store the result
  And sessionResults.scores should contain the result
  And sessionResults.totalScore should be 150
  And sessionResults.itemsPracticed should include ['A', 'B', 'C']
  And gamesCompleted should be 1
  And currentGameIndex should be 1
  And the second transition screen should appear
```

## Scenario: Progress Through Multiple Games

```gherkin
Scenario: Complete 3-game sequence
  Given I am in a game session
  And the session has 3 games queued
  When I complete game 1
  Then I should see "Game 2 of 3" transition
  When I complete game 2
  Then I should see "Game 3 of 3" transition
  When I complete game 3
  Then the session should end
  And I should not see "Game 4 of 3"
  And the results screen should appear
```

## Scenario: Aggregate Scores Across Games

```gherkin
Scenario: Calculate total session score from multiple games
  Given I have completed 3 games with scores:
    | Game              | Score |
    | LetterPopScene    | 150   |
    | MemoryMatchScene  | 200   |
    | TraceLetterScene  | 180   |
  When the session ends
  Then the total score should be 530
  And sessionResults.scores should contain 3 entries
  And each score entry should have:
    | Field    |
    | game     |
    | score    |
    | correct  |
    | attempts |
```

## Scenario: Track Items Practiced Across Session

```gherkin
Scenario: Collect all letters and words practiced
  Given I complete game 1 practicing ['A', 'B', 'C']
  And I complete game 2 practicing ['the', 'cat']
  And I complete game 3 practicing ['D', 'E']
  When the session ends
  Then sessionResults.itemsPracticed should contain:
    | Item |
    | A    |
    | B    |
    | C    |
    | the  |
    | cat  |
    | D    |
    | E    |
  And the list should include all items from all games
```

## Scenario: Calculate Session Accuracy

```gherkin
Scenario: Compute aggregate accuracy percentage
  Given I completed 3 games with results:
    | Game  | Correct | Attempts |
    | Game1 | 10      | 12       |
    | Game2 | 8       | 8        |
    | Game3 | 5       | 6        |
  When the session accuracy is calculated
  Then total correct should be 23
  And total attempts should be 26
  And accuracy should be 88%
  And sessionResults.accuracy should be 88
```

## Scenario: Measure Session Duration

```gherkin
Scenario: Track total time spent in session
  Given a session starts at timestamp 1697140800000
  And game 1 takes 3 minutes
  And game 2 takes 4 minutes
  And game 3 takes 2 minutes
  And transitions take 9 seconds total
  When the session ends at timestamp 1697141349000
  Then sessionResults.timeSpent should be 549000 (9 min 9 sec)
  And the duration should include game time and transitions
```

## Scenario: Display Encouraging Messages

```gherkin
Scenario Outline: Show varied encouragement between games
  Given I have completed a game
  When the transition screen appears
  Then I should see one of these messages:
    | Encouragement          |
    | You're doing great!    |
    | Let's keep going!      |
    | Aurora's having fun!   |
    | Keep up the good work! |
    | You've got this!       |
  And the message should be positive and supportive
  And the message should change between transitions

  Examples:
    | Transition | Possible Message       |
    | 1 to 2     | You're doing great!    |
    | 2 to 3     | Keep up the good work! |
```

## Scenario: Prevent Immediate Game Repetition

```gherkin
Scenario: Ensure consecutive games are different
  Given a session is generating a game sequence
  And the previous game selected was "LetterPopScene"
  When selecting the next game
  Then "LetterPopScene" should be filtered out
  And a different game should be selected
  And the selected game should be from:
    | Available Games    |
    | MemoryMatchScene   |
    | TraceLetterScene   |
    | SightWordScene     |
    | PhonicsScene       |
```

## Scenario: Handle Session Completion

```gherkin
Scenario: End session and display results
  Given I have completed all 3 games in the session
  And the session has aggregated results
  When the last game completes
  Then endSession() should be called
  And calculateSessionAccuracy() should run
  And the results should be finalized
  And the SessionResultsScene should start
  And the results data should be passed to the results scene
  And I should see my total score and performance
```

## Scenario: Session Flow Continuity

```gherkin
Scenario: Verify smooth flow without interruptions
  Given a session is in progress
  When I complete each game
  Then there should be no errors in the console
  And transitions should appear immediately after completion
  And next games should launch smoothly
  And there should be no freezing or lag
  And audio should play at transitions
  And the progress indicator should always be accurate
```

## Scenario: Game Receives Correct Session Context

```gherkin
Scenario: Pass session metadata to each game
  Given the session is starting game 2 of 3
  And the game is "MemoryMatchScene"
  When the game launches
  Then the game should receive init data:
    ```javascript
    {
      sessionMode: true,
      gameNumber: 2,
      totalGames: 3,
      returnScene: 'GameSessionScene'
    }
    ```
  And the game can use this data to show progress
  And the game knows to emit 'gameComplete' when done
```

## Scenario: Random Selection Algorithm

```gherkin
Scenario: Use random selection with no-repeat filter
  Given the session uses random selection mode
  And 5 games are available
  When generating a sequence of 3 games
  Then each game should be randomly selected
  And the last selected game should be excluded from next selection
  And the sequence should vary across different sessions
  And all games should have equal probability (except filtered)
```

## Scenario: Weighted Selection Algorithm

```gherkin
Scenario: Favor less-played games in selection
  Given the session uses weighted selection mode
  And play history shows:
    | Game              | Times Played |
    | LetterPopScene    | 5            |
    | MemoryMatchScene  | 2            |
    | TraceLetterScene  | 3            |
  When generating a sequence
  Then MemoryMatchScene should have higher selection weight
  And LetterPopScene should have lower selection weight
  And less-played games should appear more frequently
```

## Scenario: Difficulty Progression Algorithm

```gherkin
Scenario: Increase difficulty through session
  Given the session uses progressive selection mode
  And games have difficulty ratings:
    | Game              | Difficulty |
    | LetterPopScene    | 1 (Easy)   |
    | SightWordScene    | 2 (Medium) |
    | TraceLetterScene  | 3 (Hard)   |
  When generating a 3-game sequence
  Then game 1 should be easier (difficulty 1-2)
  And game 2 should be medium (difficulty 2)
  And game 3 should be harder (difficulty 2-3)
  And difficulty should trend upward
```

## Scenario: Session State Persistence

```gherkin
Scenario: Maintain session state through game transitions
  Given a session is at game 2 of 3
  And the session state is:
    | Property         | Value |
    | currentGameIndex | 1     |
    | gamesCompleted   | 1     |
    | totalScore       | 150   |
  When I complete game 2
  Then the session state should update to:
    | Property         | Value |
    | currentGameIndex | 2     |
    | gamesCompleted   | 2     |
    | totalScore       | 350   |
  And the state should persist correctly
```

## Scenario: Transition Screen Timing

```gherkin
Scenario: Display transition for appropriate duration
  Given a transition screen is shown
  When I start a timer
  Then the transition should display for 3000ms (3 seconds)
  And the transition should auto-advance (no button click required)
  And the next game should start automatically after 3 seconds
  And the timing should feel neither rushed nor slow
```

## Scenario: Audio Feedback During Transitions

```gherkin
Scenario: Play transition sound effects
  Given a transition screen is appearing
  When the transition animation starts
  Then a 'transition' sound should play
  And the sound should be gentle and non-alarming
  And if the sound fails to load, the transition should continue silently
  And there should be no errors in the console
```

## Scenario: Multiple Session Types

```gherkin
Scenario Outline: Support different session lengths
  Given the session is configured for <games> games
  When the session starts
  Then <games> games should be queued
  And the progress indicator should show "Game X of <games>"
  And the session should complete after <games> games

  Examples:
    | games |
    | 1     |
    | 3     |
    | 5     |
```

## Scenario: Parent Configuration Override

```gherkin
Scenario: Use parent-defined game sequence
  Given a parent has configured a fixed sequence:
    | Sequence Position | Game Type          |
    | 1                 | LetterPopScene     |
    | 2                 | MemoryMatchScene   |
    | 3                 | LetterPopScene     |
  And parentControl.fixedSequence is set
  When the session starts
  Then the exact sequence should be used
  And no random selection should occur
  And the games should play in the specified order
```

## Scenario: Session Results Data Structure

```gherkin
Scenario: Generate complete session results
  Given a session has completed
  When the results are compiled
  Then the sessionResults object should contain:
    | Field            | Type         | Example                    |
    | scores           | Array        | [{game: 'LetterPop'...}]   |
    | totalScore       | Number       | 530                        |
    | itemsPracticed   | Array        | ['A', 'B', 'the', 'cat']   |
    | timeSpent        | Number       | 600000                     |
    | accuracy         | Number       | 85                         |
    | gamesCompleted   | Number       | 3                          |
    | sessionDate      | String       | '2025-10-12T19:30:00Z'     |
    | childName        | String       | 'Aurora'                   |
  And all fields should have valid data
```

## Scenario: Integration with Mini-Games

```gherkin
Scenario: Mini-game emits completion event
  Given I am playing LetterPopScene in session mode
  When I complete the game
  Then the game should call:
    ```javascript
    this.events.emit('gameComplete', {
      game: 'LetterPopScene',
      score: 150,
      correct: 10,
      attempts: 12,
      itemsPracticed: ['A', 'B', 'C'],
      duration: 180000
    });
    ```
  And the GameSessionScene should receive the event
  And the handler handleGameComplete() should execute
```

## Scenario: Error Handling

```gherkin
Scenario: Handle missing game scene gracefully
  Given the session queue includes "InvalidGameScene"
  When attempting to start the invalid game
  Then an error should be logged to console
  And the session should skip to the next game
  Or display an error message to the user
  And the session should not crash
```

## Scenario: Verify No Console Errors

```gherkin
Scenario: Session runs without errors
  Given a complete session with 3 games
  When I play through the entire session
  And I check the browser console
  Then there should be no error messages
  And there should be no warning messages
  And all transitions should complete successfully
  And all games should load correctly
```

## Acceptance Criteria Checklist

### Core Functionality
- [ ] GameSessionScene starts correctly from main menu
- [ ] Game sequence of 3 games is generated
- [ ] Games are selected with variety (no immediate repeats)
- [ ] Transition screens appear between games
- [ ] Each transition displays for 3 seconds
- [ ] Progress indicator shows "Game X of Y"
- [ ] Encouraging messages appear on transitions
- [ ] All 3 games in sequence complete successfully

### Results Aggregation
- [ ] Scores from all games are collected
- [ ] Total score is calculated correctly
- [ ] Items practiced list aggregates from all games
- [ ] Session duration is tracked accurately
- [ ] Accuracy percentage is calculated correctly
- [ ] Results data structure is complete

### User Experience
- [ ] Transitions are smooth with no jarring effects
- [ ] Audio plays at transitions
- [ ] Progress indicators reduce anxiety
- [ ] Encouraging messages maintain motivation
- [ ] Session flow feels natural and engaging
- [ ] No confusion about current progress

### Technical Quality
- [ ] No console errors during session
- [ ] No freezing or performance issues
- [ ] Scene transitions work smoothly
- [ ] Event emitters and listeners work correctly
- [ ] Session state persists through transitions
- [ ] Results screen displays correctly at end

## Edge Cases to Test

```gherkin
Scenario: Session with Single Game
  Given session is configured for 1 game
  When I complete the game
  Then the session should end immediately
  And results screen should appear
  And progress should show "Game 1 of 1"

Scenario: All Games Are Same Type
  Given only one game type is available
  When generating a 3-game sequence
  Then the same game should appear 3 times
  And no-repeat filter should be bypassed
  And the session should still work

Scenario: Rapid Game Completion
  Given I complete games very quickly (< 30 seconds each)
  When transitions appear
  Then transitions should still display for 3 seconds
  And the session should not skip transitions
  And I should have time to see progress

Scenario: Very Long Game Duration
  Given a single game takes 10+ minutes
  When the game completes
  Then the transition should still work normally
  And session timing should be accurate
  And no timeout errors should occur

Scenario: Missing Items Practiced Data
  Given a game completes without itemsPracticed field
  When results are aggregated
  Then the session should not crash
  And itemsPracticed should default to empty array
  And other results should aggregate normally
```

## Manual Testing Checklist

### Setup
1. [ ] Verify all mini-game scenes are implemented
2. [ ] Verify GameSessionScene is registered in config
3. [ ] Verify transition audio assets are loaded
4. [ ] Verify SessionResultsScene exists

### Testing Flow
5. [ ] Start session from main menu
6. [ ] Verify first transition screen appears
7. [ ] Play through first game
8. [ ] Verify second transition appears with correct progress
9. [ ] Play through second game
10. [ ] Verify third transition appears
11. [ ] Play through third game
12. [ ] Verify session ends and results appear

### Validation
13. [ ] Check that 3 different games were played
14. [ ] Verify total score is sum of all game scores
15. [ ] Verify items practiced includes all letters/words
16. [ ] Check console for any errors
17. [ ] Verify smooth transitions with no lag
18. [ ] Test multiple sessions to verify variety

### Experience
19. [ ] Ask: Does progress indicator reduce anxiety?
20. [ ] Ask: Are encouraging messages motivating?
21. [ ] Ask: Does 3-second transition feel right?
22. [ ] Ask: Does variety maintain engagement?
23. [ ] Ask: Is the session length appropriate?

## Success Criteria

**This phase is complete when:**
1. GameSessionScene successfully orchestrates 3-game sequences
2. Game selection provides variety (no immediate repeats)
3. Transition screens display smoothly between games
4. Progress indicators show accurate game count
5. Encouraging messages appear and motivate
6. Session results aggregate correctly across all games
7. Total score, accuracy, and items practiced are accurate
8. Session flows smoothly from start to results with no errors
9. Multiple sessions show good variety in game selection
10. Aurora remains engaged through the 3-game sequence
11. Zero console errors during session execution
12. Ready to integrate with Phase 42 (Session Timer)

## Notes

**Focus on Engagement**
- Variety is the primary goal (prevents boredom)
- Progress indicators provide structure and reduce anxiety
- Encouragement maintains motivation
- Smooth transitions keep momentum

**Keep It Simple**
- 3 games per session is optimal for Aurora's attention span
- Auto-advancing transitions (no button clicks) maintain flow
- Clear progress ("Game 2 of 3") provides orientation
- Aggregate results show overall accomplishment

**ADHD Considerations**
- Predictable structure (always 3 games)
- Variety maintains interest
- Progress tracking reduces "how much longer?" anxiety
- Encouragement boosts confidence
- No surprises or unexpected changes

This phase establishes the foundation for structured, engaging play sessions that work perfectly with Phase 42's session timer and break reminders.
