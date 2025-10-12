# Phase 39: Dance & Trace - Completion and Flow - BDD Scenarios

## Feature: Letter Completion Celebration

```gherkin
Feature: Letter Completion and Round Flow
  As Aurora
  I want joyful celebrations when I complete letters
  So that I feel proud and motivated to continue learning

Background:
  Given Phase 37 and 38 are complete
  And I am tracing letter 'A' in Dance & Trace
  And I have completed 2 of 3 strokes
```

## Scenario: Complete Letter Successfully

```gherkin
Scenario: Player completes all strokes of letter A
  Given I am tracing the final stroke (stroke 2 of 3)
  When I reach 90% progress on the final stroke
  Then the letter should be marked as complete
  And tracing should stop (isTracing = false)
  And the completion data should be recorded:
    | Property        | Value        |
    | letter          | 'A'          |
    | strokeCount     | 3            |
    | completed       | true         |
  And the celebration should trigger immediately
  And no further input should be accepted during celebration
```

## Scenario: Firework Celebration

```gherkin
Scenario: Launch fireworks on letter completion
  Given the letter 'A' is complete
  When the celebration begins
  Then 5 firework bursts should launch
  And each burst should occur 400ms apart
  And each burst should contain 50 particles
  And particles should explode radially (0-360 degrees)
  And particles should use rainbow colors:
    | Color   | Hex      |
    | Red     | 0xFF0000 |
    | Orange  | 0xFFAA00 |
    | Yellow  | 0xFFFF00 |
    | Green   | 0x00FF00 |
    | Blue    | 0x0088FF |
    | Purple  | 0xFF00FF |
  And particles should fade out over 1500ms
  And particles should fall with gravity (200)
  And a "firework-burst" sound should play with each burst
  And the fireworks should last approximately 2.5 seconds total

Scenario: Firework positions
  Given fireworks are launching
  When each burst is created
  Then the burst position should be near letter center (400, 320)
  And the X position should vary by ±100 pixels
  And the Y position should vary by ±100 pixels
  And bursts should not overlap exactly
  And the pattern should feel dynamic and exciting
```

## Scenario: Success Audio Feedback

```gherkin
Scenario: Play success audio on completion
  Given the letter is complete
  When the celebration begins
  Then a random praise audio should play immediately:
    | Audio File     | Message        |
    | great-job      | "Great job!"   |
    | excellent      | "Excellent!"   |
    | you-did-it     | "You did it!"  |
    | amazing        | "Amazing!"     |
    | wonderful      | "Wonderful!"   |
    | fantastic      | "Fantastic!"   |
  And the praise should be enthusiastic and warm
  And 1 second after praise
  Then the letter name audio should play
  And it should say "You traced the letter A!"
  And simultaneously
  Then a celebration jingle should play at 50% volume
  And the jingle should last 3-5 seconds
  And all audio should overlap pleasantly (not clash)
```

## Scenario: Visual Letter Flash

```gherkin
Scenario: Flash completed letter during celebration
  Given the letter is complete
  When the celebration begins
  Then the trail graphics should flash
  And the alpha should tween from 1.0 to 0.3 and back
  And each flash should take 200ms
  And the flash should repeat 5 times
  And the effect should be celebratory, not disorienting
  And the flashing should stop after 1 second total
```

## Scenario: Calculate Accuracy Score

```gherkin
Scenario: Calculate how accurately Aurora traced
  Given Aurora traced letter 'A' with 100 trail points
  And the average distance from path was 15 pixels
  When calculating the accuracy score
  Then the accuracy formula should be: 1.0 - (avgDistance / 50)
  And the calculation should be: 1.0 - (15 / 50) = 0.70
  And the accuracy score should be 0.70 (70%)
  And the score should be rounded to 2 decimals
  And the score should be between 0.0 and 1.0

Scenario: Perfect accuracy
  Given Aurora traced perfectly on the path
  And the average distance was 2 pixels
  When calculating accuracy
  Then the score should be 1.0 - (2 / 50) = 0.96 (96%)
  And this should be recorded as excellent accuracy

Scenario: Poor but completed accuracy
  Given Aurora traced far from path but still completed
  And the average distance was 45 pixels
  When calculating accuracy
  Then the score should be 1.0 - (45 / 50) = 0.10 (10%)
  And this should still be recorded as a completion
  And Aurora should still receive celebration
```

## Scenario: Record Completion Data

```gherkin
Scenario: Record letter completion statistics
  Given letter 'A' is complete
  And tracing took 8500 milliseconds
  And the accuracy score is 0.85
  When recording completion data
  Then the following should be saved:
    ```javascript
    {
      letter: 'A',
      timeToComplete: 8500,
      strokeCount: 3,
      accuracyScore: 0.85,
      completed: true,
      timestamp: <current timestamp>
    }
    ```
  And this data should be added to sessionData array
  And sessionData should contain all completed letters in the round
```

## Scenario: Transition to Next Letter

```gherkin
Scenario: Load letter B after completing letter A
  Given letter 'A' celebration is complete (after 4 seconds)
  And letterIndex is 0
  And letterQueue is ['A', 'B', 'C', 'D', 'E']
  When the transition begins
  Then letterIndex should increment to 1
  And currentLetter should change from 'A' to 'B'
  And the transition should proceed as follows:
    | Time  | Action                          |
    | 0.0s  | Start fade out (alpha 1.0 → 0.0)|
    | 0.5s  | Clear all graphics              |
    | 0.5s  | Reset PathDetector              |
    | 0.5s  | Load letter 'B' data            |
    | 0.5s  | Draw letter 'B' dotted path     |
    | 0.5s  | Create new start indicator      |
    | 0.5s  | Update UI ("Letter 2 of 5")     |
    | 0.5s  | Start fade in (alpha 0.0 → 1.0) |
    | 1.0s  | Fade in complete                |
    | 1.0s  | Play intro audio for letter B   |
  And the entire transition should take 1 second
  And the transition should feel smooth and magical

Scenario: Update progress indicator during transition
  Given I completed letter 'A'
  And I'm transitioning to letter 'B'
  When the UI updates
  Then the progress text should change from "Letter 1 of 5"
  To "Letter 2 of 5"
  And the current letter name should change from "Letter A"
  To "Letter B"
  And both updates should happen during the transition
```

## Scenario: Retry Functionality

```gherkin
Scenario: Player clicks retry button
  Given I am tracing letter 'A'
  And I have traced 40% of the first stroke
  And a retry button is visible in the top-right corner
  When I click the "Retry" button
  Then the trail graphics should be cleared
  And the PathDetector should reset (stroke: 0, progress: 0.0)
  And the starting indicator should reappear
  And isTracing should be set to false
  And trailPoints array should be cleared
  And encouraging audio should play: "Let's try again together!"
  And no negative messaging should appear
  And I should be able to start tracing again
  And the same letter 'A' should remain (no skip to next)

Scenario: Automatic retry suggestion after inactivity
  Given I am tracing letter 'A'
  And I have not made progress for 10 seconds
  When the inactivity timeout triggers
  Then a retry modal should appear
  And the modal should say "Would you like to try again?"
  And the modal should have two buttons:
    | Button         | Action                  |
    | "Yes, Retry"   | Reset and retry letter  |
    | "Keep Trying"  | Close modal, continue   |
  And the modal should not be intrusive
  And the modal should be gentle and supportive

Scenario: Retry after being off path too long
  Given I am tracing letter 'A'
  And I move off the path (distance > 70 pixels)
  And I stay off the path for 3 seconds
  When the off-path timeout triggers
  Then a gentle retry prompt may appear
  Or the retry button should pulse to draw attention
  And no harsh "failure" message should appear
  And Aurora can choose to retry or keep trying
```

## Scenario: Round Completion

```gherkin
Scenario: Complete all 5 letters in round
  Given I have completed letters A, B, C, D
  And I am completing letter E (letter 5 of 5)
  When I finish letter E's final stroke
  Then letterIndex should increment to 5
  And the system should detect 5 >= lettersPerRound (5)
  And the round complete flag should trigger
  And instead of loading next letter
  Then the round completion sequence should begin
  And the celebration should last 4 seconds
  And after celebration
  Then the round summary screen should display
```

## Scenario: Calculate Star Rating

```gherkin
Scenario: Calculate 3-star performance
  Given I completed 5 letters with the following data:
    | Letter | Time (ms) | Accuracy |
    | A      | 8000      | 0.90     |
    | B      | 9000      | 0.88     |
    | C      | 7500      | 0.92     |
    | D      | 9500      | 0.86     |
    | E      | 8200      | 0.89     |
  When calculating stars
  Then average accuracy = (0.90 + 0.88 + 0.92 + 0.86 + 0.89) / 5 = 0.87
  And average time = (8000 + 9000 + 7500 + 9500 + 8200) / 5 = 8440ms
  And 0.87 > 0.85 (accuracy threshold for 3 stars)
  And 8440 < 10000 (time threshold for 3 stars)
  Then the star rating should be 3 stars
  And this should be displayed as "★★★"

Scenario: Calculate 2-star performance
  Given average accuracy is 0.75
  And average time is 12000ms
  When calculating stars
  Then 0.75 > 0.70 (accuracy threshold for 2 stars)
  And 12000 < 15000 (time threshold for 2 stars)
  Then the star rating should be 2 stars

Scenario: Calculate 1-star completion (always)
  Given average accuracy is 0.50
  And average time is 20000ms
  When calculating stars
  Then the thresholds for 2 and 3 stars are not met
  But the letters were completed
  Then the star rating should be 1 star
  And Aurora should still be celebrated
  And 1 star is guaranteed for any completion
```

## Scenario: Display Round Summary

```gherkin
Scenario: Show round complete summary screen
  Given the round is complete
  And the star rating is 2 stars
  When showing the summary screen
  Then the scene should clear all previous objects
  And a dark background should appear (0x2a2a2a)
  And the following should display:
    | Element              | Position | Content                 |
    | Title                | (400, 100) | "Round Complete!"     |
    | Subtitle             | (400, 180) | "You traced:"         |
    | Letters completed    | (400, 230) | "A  B  C  D  E"       |
    | Star display         | (400, 320) | ★★☆ (2 earned, 1 gray)|
    | Play Again button    | (400, 450) | "Play Again"          |
    | Main Menu button     | (400, 530) | "Main Menu"           |
  And the "round-complete-fanfare" audio should play
  And the display should be colorful and celebratory

Scenario: Animate stars on summary screen
  Given the summary screen is showing
  And the star rating is 2 stars
  When the stars are displayed
  Then 3 star positions should be created (left, center, right)
  And each star should start at scale 0
  And the stars should animate in sequence:
    | Star | Delay | Color  | Animation          |
    | 1    | 0ms   | Gold   | Scale 0 → 1.2      |
    | 2    | 500ms | Gold   | Scale 0 → 1.2      |
    | 3    | 1000ms| Gray   | Scale 0 → 1.2      |
  And when each earned star appears
  Then a "star-ding" sound should play
  And the animation should use "Back.easeOut" easing
  And the effect should feel satisfying and celebratory
```

## Scenario: Play Again Button

```gherkin
Scenario: Player clicks Play Again
  Given the round summary screen is displayed
  And the "Play Again" button is visible
  When I click "Play Again"
  Then a new set of 5 random letters should be generated
  And letterIndex should reset to 0
  And sessionData should be cleared
  And the scene should restart from the beginning
  And the first letter should load
  And I should be ready to trace letter 1 of 5
  And the experience should feel like a fresh new round
```

## Scenario: Main Menu Button

```gherkin
Scenario: Player returns to main menu
  Given the round summary screen is displayed
  And the "Main Menu" button is visible
  When I click "Main Menu"
  Then the DanceTraceScene should stop
  And the MainMenuScene should start
  And I should see the main menu
  And my progress should be saved (not lost)
  And I can return to Dance & Trace later
```

## Scenario: Save Progress to localStorage

```gherkin
Scenario: Persist round progress
  Given the round is complete with 2 stars
  And I completed letters A, B, C, D, E
  When saving progress
  Then the following should be stored in localStorage:
    ```javascript
    {
      totalLettersTraced: 5 (or += 5 if existing),
      lastSession: {
        date: "2025-10-12T14:23:45.123Z",
        letters: ['A', 'B', 'C', 'D', 'E'],
        stars: 2,
        completionData: [ /* 5 completion objects */ ]
      },
      lifetimeStats: {
        lettersTraced: 5 (or += 5),
        totalStars: 2 (or += 2),
        sessions: 1 (or += 1)
      }
    }
    ```
  And the data should persist after page reload
  And the data should be retrievable for statistics later

Scenario: Update lifetime statistics
  Given I previously completed 3 rounds
  And my lifetime stats show 15 letters traced
  When I complete a new round with 5 letters
  Then lifetimeStats.lettersTraced should increase to 20
  And lifetimeStats.sessions should increase by 1
  And lifetimeStats.totalStars should increase by new stars earned
  And all previous data should be preserved
```

## Acceptance Criteria

### Must Have - Completion
- [ ] Letter completion detected at 90%+ on final stroke
- [ ] Tracing stops when letter completes
- [ ] Completion data recorded accurately
- [ ] Celebration triggers immediately

### Must Have - Celebration
- [ ] Fireworks launch (5 bursts, 50 particles each)
- [ ] Firework particles are colorful (rainbow colors)
- [ ] Particles fade out over 1.5 seconds
- [ ] Particles fall with gravity
- [ ] Firework sounds play with each burst
- [ ] Success audio plays ("Great job!", etc.)
- [ ] Letter name audio plays 1 second after
- [ ] Celebration jingle plays simultaneously
- [ ] Letter flashes during celebration
- [ ] Total celebration lasts ~4 seconds

### Must Have - Progression
- [ ] Next letter loads after celebration
- [ ] Smooth fade transition (out 500ms, in 500ms)
- [ ] Graphics cleared between letters
- [ ] PathDetector resets for new letter
- [ ] UI updates ("Letter 2 of 5")
- [ ] New starting indicator appears
- [ ] Intro audio plays for new letter

### Must Have - Retry
- [ ] Retry button visible and functional
- [ ] Retry clears trail and resets state
- [ ] Retry plays encouraging audio
- [ ] No negative messaging on retry
- [ ] Same letter remains (no skip)

### Must Have - Round Completion
- [ ] Round complete detected after 5 letters
- [ ] Star rating calculated (1-3 stars)
- [ ] Round summary displays
- [ ] Stars animate in with sounds
- [ ] Letters displayed (A B C D E)
- [ ] "Play Again" button generates new letters
- [ ] "Main Menu" button returns to menu
- [ ] Round completion fanfare plays

### Must Have - Persistence
- [ ] Progress saved to localStorage
- [ ] Session data recorded
- [ ] Lifetime stats updated
- [ ] Data persists after reload

### Visual Quality
- [ ] Fireworks are beautiful and exciting
- [ ] Transitions are smooth and magical
- [ ] Star animations are satisfying
- [ ] Summary screen is colorful and celebratory
- [ ] No visual glitches during transitions

### Audio Quality
- [ ] All audio files play correctly
- [ ] No audio overlap issues
- [ ] Volume levels appropriate
- [ ] Encouragement feels warm and genuine

## Edge Cases

```gherkin
Scenario: Very fast completion (< 5 seconds per letter)
  Given Aurora traces each letter in under 5 seconds
  When calculating stars
  Then she should still be eligible for 3 stars
  And the fast time should be celebrated
  And no penalty for being too fast

Scenario: Very slow completion (> 30 seconds per letter)
  Given Aurora takes 35 seconds to complete a letter
  When the letter completes
  Then she should still receive full celebration
  And she should still earn at least 1 star
  And no penalty for taking time

Scenario: Retry multiple times
  Given Aurora retries letter 'A' three times
  When she finally completes it
  Then she should receive full celebration
  And the retry count should not affect stars negatively
  And no judgment for multiple attempts

Scenario: localStorage unavailable (private browsing)
  Given localStorage is blocked
  When trying to save progress
  Then the game should handle the error gracefully
  And the game should continue working
  And a warning should log to console
  And the session should still complete normally
```

## Success Criteria

**This phase is complete when:**
1. Letter completions trigger joyful firework celebrations
2. Audio feedback is encouraging and appropriate
3. Smooth transitions between letters (4 seconds total)
4. Retry functionality works without judgment
5. Round completion after 5 letters
6. Star rating system implemented (1-3 stars, always at least 1)
7. Round summary screen displays beautifully
8. Play Again and Main Menu buttons functional
9. Progress saves to localStorage
10. All acceptance criteria met
11. Zero errors during normal gameplay
12. Experience feels therapeutic, rewarding, and seamless
13. Ready for Phase 40 (final polish)

This phase makes Dance & Trace feel like a complete, rewarding mini-game.
