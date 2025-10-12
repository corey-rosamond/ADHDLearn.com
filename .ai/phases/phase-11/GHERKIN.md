# Phase 11: Letter Pop - Score System - BDD Scenarios

## Feature: Score Display Creation

```gherkin
Feature: Score Display UI
  As a player
  I want to see my score on screen
  So that I know how many letters I've found correctly

Background:
  Given the LetterPopScene is loaded
  And the scene create method is running
```

## Scenario: Create Score Display

```gherkin
Scenario: Initialize score display at scene start
  When the scene is created
  Then a score text object should be created
  And the text should display "Correct: 0"
  And the text should be positioned at (20, 20)
  And the text should use 28px font size
  And the text should be white color (#ffffff)
  And the text should have black stroke (#000000)
  And the stroke thickness should be 4 pixels
  And the font should be bold
  And the text depth should be 1000 (on top)
```

## Scenario: Score Text Styling

```gherkin
Scenario: Style score text for readability
  Given the score display is created
  Then the font family should be "Arial"
  And the font size should be 28px or larger
  And the text color should be white
  And the text should have a dark stroke for contrast
  And the text should be readable against any background
```

## Scenario: Score Text Positioning

```gherkin
Scenario: Position score in top-left corner
  Given the score display is created
  When the game canvas is 800x600
  Then the score should be at x: 20, y: 20
  And the score should use origin (0, 0) - top-left anchor
  And the score should be visible without obscuring gameplay
  And the score should not overlap with bubbles
```

## Feature: Score Tracking

```gherkin
Feature: Score Variable Management
  As the game system
  I want to track the score accurately
  So that the display always shows the correct value

Background:
  Given the LetterPopScene is initialized
  And the score variable starts at 0
```

## Scenario: Initialize Score

```gherkin
Scenario: Set score to zero at start
  When the scene constructor runs
  Then the score property should be initialized
  And the score should equal 0
  And the score should be a Number type
```

## Scenario: Score Variable Persistence

```gherkin
Scenario: Score persists during scene lifecycle
  Given the score is initialized to 0
  When the scene is created
  And gameplay begins
  Then the score variable should persist
  And the score should be accessible to all scene methods
```

## Feature: Score Increment

```gherkin
Feature: Score Increment Logic
  As a player
  I want my score to increase when I click correct bubbles
  So that I can track my progress

Background:
  Given the score starts at 0
  And the score display shows "Correct: 0"
  And bubbles are displayed on screen
```

## Scenario: Increment Score on Correct Click

```gherkin
Scenario: Score increases on correct bubble click
  Given the target letter is "B"
  And the player clicks the "B" bubble (correct)
  When the handleCorrectClick method is called
  Then the incrementScore method should be called
  And the score should increase from 0 to 1
  And the updateScoreDisplay method should be called
  And the display should update to "Correct: 1"
```

## Scenario: Score Does Not Change on Incorrect Click

```gherkin
Scenario: Score remains unchanged on incorrect click
  Given the score is currently 3
  And the target letter is "B"
  And the player clicks the "X" bubble (incorrect)
  When the handleIncorrectClick method is called
  Then the incrementScore method should NOT be called
  And the score should remain at 3
  And the display should still show "Correct: 3"
```

## Scenario: Multiple Score Increments

```gherkin
Scenario: Score increments multiple times correctly
  Given the score starts at 0
  When the player clicks a correct bubble
  And the score increments to 1
  And the player clicks another correct bubble
  And the score increments to 2
  And the player clicks another correct bubble
  Then the score should equal 3
  And the display should show "Correct: 3"
```

## Scenario: Score Increments Mixed with Incorrect Clicks

```gherkin
Scenario: Only correct clicks increment score
  Given the score starts at 0
  When the player clicks a correct bubble (score: 1)
  And the player clicks an incorrect bubble (score: 1)
  And the player clicks another incorrect bubble (score: 1)
  And the player clicks a correct bubble (score: 2)
  Then the final score should be 2
  And incorrect clicks should not affect the score
```

## Feature: Score Display Update

```gherkin
Feature: Score Display Updates
  As a player
  I want the score display to update immediately
  So that I always see my current progress

Background:
  Given the score display exists
  And the updateScoreDisplay method is implemented
```

## Scenario: Update Score Text

```gherkin
Scenario: Display updates when score changes
  Given the score is currently 5
  When the updateScoreDisplay method is called
  Then the scoreText.setText method should be called
  And the text should be set to "Correct: 5"
  And the display should update immediately (no delay)
```

## Scenario: Score Format Consistency

```gherkin
Scenario: Score display uses consistent format
  Given the score can be any value
  When the display is updated
  Then the format should always be "Correct: {number}"
  And the format should be consistent across all updates
  And the number should be the current score value

  Examples:
    | Score | Display Text  |
    | 0     | Correct: 0    |
    | 1     | Correct: 1    |
    | 5     | Correct: 5    |
    | 10    | Correct: 10   |
    | 99    | Correct: 99   |
```

## Scenario: Immediate Display Update

```gherkin
Scenario: Score display updates instantly
  Given the player clicks a correct bubble
  When the score increments from 3 to 4
  Then the display should update within 16ms (1 frame)
  And the player should see "Correct: 4" immediately
  And there should be no visible delay
```

## Feature: Score Animation (Optional)

```gherkin
Feature: Score Text Animation
  As a player
  I want visual feedback when my score increases
  So that the score change is noticeable

Background:
  Given score animation is enabled
  And the score display exists
```

## Scenario: Animate Score Text on Increment

```gherkin
Scenario: Score text pulses when increased
  Given the score is 4
  When the player clicks a correct bubble
  And the score increments to 5
  Then a scale tween should be created
  And the tween should target the scoreText
  And the scoreText should scale to 1.2x (20% larger)
  And the scale duration should be 100 milliseconds
  And the tween should yoyo back to 1.0x
  And the total animation should take 200 milliseconds
```

## Scenario: Animation Easing

```gherkin
Scenario: Score animation uses smooth easing
  Given a score increment animation is playing
  When the tween executes
  Then the easing should be "Power2" or "Back.easeOut"
  And the animation should feel smooth and natural
  And the animation should not be jarring
```

## Scenario: Animation Does Not Block Gameplay

```gherkin
Scenario: Score animation is non-blocking
  Given the score animation is playing
  When the animation is running
  Then the player should still be able to click bubbles
  And gameplay should not be interrupted
  And the animation should not cause lag
```

## Feature: Time Display (Optional)

```gherkin
Feature: Time Tracking Display
  As a player
  I want to see how long I've been playing
  So that I can track my session time

Background:
  Given time tracking is enabled
  And the LetterPopScene is created
```

## Scenario: Create Time Display

```gherkin
Scenario: Initialize time display at scene start
  When the scene is created
  Then a time text object should be created
  And the text should display "Time: 0:00"
  And the text should be positioned at (760, 20)
  And the text should use origin (1, 0) - right-aligned
  And the text should use 24px font size
  And the text should be white with black stroke
  And the text depth should be 1000
```

## Scenario: Record Start Time

```gherkin
Scenario: Store start time when scene begins
  When the scene create method runs
  Then the startTime should be set to this.time.now
  And the startTime should be stored as a Number
  And the startTime should represent current milliseconds
```

## Scenario: Create Timer Event

```gherkin
Scenario: Set up timer to update every second
  Given the scene is created
  When the time tracking is initialized
  Then a timer event should be created
  And the timer delay should be 1000 milliseconds
  And the timer should loop continuously
  And the timer callback should be updateTimeDisplay
  And the callback scope should be the scene
```

## Feature: Time Display Updates

```gherkin
Feature: Time Display Updates
  As a player
  I want the time display to update every second
  So that I can see elapsed time accurately

Background:
  Given the time display exists
  And the timer event is running
  And the startTime is recorded
```

## Scenario: Calculate Elapsed Time

```gherkin
Scenario: Compute elapsed time in seconds
  Given the startTime is 1000 milliseconds
  And the current time is 6000 milliseconds
  When the updateTimeDisplay method is called
  Then elapsed milliseconds should be 5000
  And elapsed seconds should be 5 (5000 / 1000)
```

## Scenario: Format Time as Minutes and Seconds

```gherkin
Scenario: Display time in M:SS format
  Given the elapsed time is 125 seconds
  When the time is formatted
  Then minutes should be 2 (125 / 60 = 2)
  And seconds should be 5 (125 % 60 = 5)
  And the display should show "Time: 2:05"
```

## Scenario: Pad Seconds with Leading Zero

```gherkin
Scenario: Format seconds with leading zero when needed
  Given the elapsed time is various values
  When the time is formatted
  Then seconds under 10 should have leading zero

  Examples:
    | Elapsed (s) | Minutes | Seconds | Display     |
    | 5           | 0       | 05      | Time: 0:05  |
    | 65          | 1       | 05      | Time: 1:05  |
    | 70          | 1       | 10      | Time: 1:10  |
    | 125         | 2       | 05      | Time: 2:05  |
```

## Scenario: Update Time Display Every Second

```gherkin
Scenario: Time display increments every second
  Given the game starts at time 0:00
  When 1 second passes
  Then the display should show "Time: 0:01"
  When another second passes
  Then the display should show "Time: 0:02"
  When 8 more seconds pass
  Then the display should show "Time: 0:10"
```

## Scenario: Time Continues During Gameplay

```gherkin
Scenario: Time tracks independently of score
  Given the game is running
  When the player is playing
  Then the time should continue incrementing
  And time should not stop when bubbles are clicked
  And time should not reset between rounds
  And time should only stop when scene ends
```

## Feature: UI Layout and Positioning

```gherkin
Feature: UI Element Layout
  As a developer
  I want UI elements positioned correctly
  So that they don't interfere with gameplay

Background:
  Given the game canvas is 800x600
  And UI elements are created
```

## Scenario: Score Position Does Not Overlap Game

```gherkin
Scenario: Score display positioned in safe zone
  Given the score is at (20, 20)
  When bubbles are spawned in the play area
  Then bubbles should not spawn near the score
  And the score should remain fully visible
  And the score should not overlap with any bubbles
```

## Scenario: Time Position Does Not Overlap Game

```gherkin
Scenario: Time display positioned in safe zone
  Given the time is at (760, 20) right-aligned
  When bubbles are spawned in the play area
  Then bubbles should not spawn near the time display
  And the time should remain fully visible
  And the time should not overlap with any bubbles
```

## Scenario: UI Elements Stay On Top

```gherkin
Scenario: UI has higher depth than game elements
  Given UI elements have depth 1000
  And game elements (bubbles, particles) have default depth
  When elements are rendered
  Then UI elements should always appear on top
  And UI should never be hidden behind game objects
```

## Feature: Score System Integration

```gherkin
Feature: Integration with Phase 10
  As the game system
  I want score tracking integrated with click handlers
  So that the game tracks progress correctly

Background:
  Given Phase 10 game logic is implemented
  And click handlers exist
```

## Scenario: Correct Click Triggers Score Increment

```gherkin
Scenario: Score increments after correct click celebration
  Given the target letter is "B"
  And the score is 5
  When the player clicks the "B" bubble
  Then the handleCorrectClick method executes
  And the celebration plays (sound, particles)
  And the bubble is destroyed
  And the incrementScore method is called
  And the score increases to 6
  And the display updates to "Correct: 6"
```

## Scenario: Score Increment is Part of Correct Click Flow

```gherkin
Scenario: Score increment integrated into game loop
  Given the game is running
  When a correct click occurs
  Then the following should happen in order:
    | Step | Action                          |
    | 1    | Detect correct click            |
    | 2    | Play success sound              |
    | 3    | Create celebration particles    |
    | 4    | Animate bubble destruction      |
    | 5    | Increment score                 |
    | 6    | Update score display            |
    | 7    | Check round completion          |
```

## Feature: ADHD-Friendly Score Design

```gherkin
Feature: ADHD-Friendly Score Display
  As a player with ADHD
  I want the score display to be clear and encouraging
  So that I stay motivated without feeling overwhelmed

Background:
  Given the game is designed for ADHD-friendly play
```

## Scenario: Score is Visible But Not Distracting

```gherkin
Scenario: Score provides information without drawing excessive attention
  Given the score display exists
  When the game is being played
  Then the score should be visible in peripheral vision
  And the score should not be animated constantly
  And the score should not use flashing or blinking effects
  And the score should update only when changed
```

## Scenario: Positive Framing (Correct, Not Incorrect)

```gherkin
Scenario: Score shows success, not failures
  Given the score display uses "Correct: X" format
  When the player sees the score
  Then it should show how many they got right
  And it should NOT show how many they got wrong
  And the display should feel encouraging
  And the player should focus on success
```

## Scenario: No Negative Feedback in Score

```gherkin
Scenario: Score never decreases
  Given the score starts at 0
  When the player clicks incorrect bubbles
  Then the score should not decrease
  And the score should only go up (never down)
  And incorrect clicks should not be punished with score loss
```

## Scenario: Immediate Visual Confirmation

```gherkin
Scenario: Score updates instantly provide feedback
  Given the player clicks a correct bubble
  When the score increments
  Then the display should update immediately
  And the player should see the change within 1 frame
  And the animation (if enabled) should be quick (200ms)
  And the player should feel instant gratification
```

## Scenario: Time is Informational, Not Pressured

```gherkin
Scenario: Time display does not create stress
  Given the time display exists
  When the time is shown
  Then it should be smaller than the score (24px vs 28px)
  And it should be positioned less prominently (right side)
  And it should not flash or pulse
  And it should not count down (no deadline)
  And it should feel informational, not pressured
```

## Acceptance Criteria

### Score Display
- [ ] Score text object created at scene start
- [ ] Score positioned at (20, 20) top-left
- [ ] Score uses 28px bold white text
- [ ] Score has black stroke (4px thickness)
- [ ] Score depth is 1000 (on top of game)
- [ ] Score format is "Correct: {number}"

### Score Tracking
- [ ] Score variable initialized to 0
- [ ] Score variable persists during scene
- [ ] Score increments only on correct clicks
- [ ] Score does NOT change on incorrect clicks
- [ ] Score never decreases (only increases)

### Score Display Updates
- [ ] Display updates immediately on score change
- [ ] updateScoreDisplay method called after increment
- [ ] Text updates within 1 frame (<16ms)
- [ ] Format is consistent for all score values

### Score Animation (Optional)
- [ ] Score text scales up to 1.2x on increment
- [ ] Scale animation duration is 100ms
- [ ] Animation yoyos back to 1.0x
- [ ] Total animation time is 200ms
- [ ] Animation does not block gameplay
- [ ] Animation feels smooth (60fps)

### Time Display (Optional)
- [ ] Time text object created at scene start
- [ ] Time positioned at (760, 20) top-right
- [ ] Time uses 24px white text with black stroke
- [ ] Time format is "Time: M:SS"
- [ ] Time updates every 1 second
- [ ] Seconds use leading zero when < 10

### Time Tracking (Optional)
- [ ] startTime recorded when scene created
- [ ] Timer event created with 1000ms delay
- [ ] Timer loops continuously
- [ ] updateTimeDisplay called every second
- [ ] Elapsed time calculated correctly
- [ ] Time formatted correctly (M:SS)

### UI Layout
- [ ] Score does not overlap with bubbles
- [ ] Time does not overlap with bubbles
- [ ] UI elements stay on top (depth 1000)
- [ ] UI is readable on all backgrounds
- [ ] UI elements maintain fixed positions

### Integration
- [ ] incrementScore called in handleCorrectClick
- [ ] Score updates immediately after celebration
- [ ] Score system integrated into game loop
- [ ] No console errors

### ADHD-Friendly
- [ ] Score display is clear but not distracting
- [ ] Score shows success (Correct), not failures
- [ ] Score never decreases (positive reinforcement)
- [ ] Score updates instantly (immediate feedback)
- [ ] Time is informational, not pressured (if included)

## Edge Cases to Test

```gherkin
Scenario: Score Display with Large Numbers
  Given the player has clicked 99 correct bubbles
  When the score reaches 99
  Then the display should show "Correct: 99"
  And the text should still fit in the display area
  And the text should remain readable

Scenario: Score Display with Very Large Numbers
  Given the player has been playing for a long time
  When the score reaches 999 or higher
  Then the display should still render correctly
  And the text may extend beyond normal bounds
  And the text should still be readable

Scenario: Time Display Over One Hour
  Given the player has been playing for 65 minutes
  When the elapsed time is 3900 seconds
  Then the time should display "65:00"
  And the format should still be M:SS (not H:MM:SS)

Scenario: Rapid Score Increments
  Given the player clicks multiple correct bubbles quickly
  When score increments rapidly (5 clicks in 1 second)
  Then each increment should be registered
  And the display should update for each increment
  And animations should not stack or glitch

Scenario: Score Increment During Animation
  Given the score is animating (pulsing)
  When another correct click occurs
  Then the new increment should be registered
  And the animation should restart or continue smoothly
  And no visual glitches should occur

Scenario: Scene Restart
  Given the score is 20
  And the time is 5:30
  When the scene restarts
  Then the score should reset to 0
  And the time should reset to 0:00
  And both displays should update correctly

Scenario: Missing Font
  Given the Arial font is not available
  When the text objects are created
  Then the browser should use a fallback font
  And the text should still be readable
  And no errors should occur

Scenario: Very Small Screen
  Given the game is on a screen smaller than 800x600
  When UI elements are positioned
  Then the score should still be visible
  And the time should still be visible
  And text may need to adjust size or position

Scenario: Score Animation Disabled
  Given score animation is disabled (animation: false)
  When the score increments
  Then the display should update
  And no animation should play
  And the text should remain at normal scale
```

## Manual Testing Checklist

### Setup Phase
1. [ ] Game loads without errors
2. [ ] LetterPopScene starts correctly
3. [ ] Score display appears at (20, 20)
4. [ ] Score shows "Correct: 0"
5. [ ] Time display appears at (760, 20) (if enabled)
6. [ ] Time shows "Time: 0:00" (if enabled)

### Score Increment Testing
7. [ ] Click correct bubble - score increases
8. [ ] Score updates to "Correct: 1"
9. [ ] Score updates immediately (no delay)
10. [ ] Click another correct - score becomes 2
11. [ ] Click incorrect bubble - score stays at 2
12. [ ] Continue clicking - only correct increments score

### Score Animation Testing (if enabled)
13. [ ] Click correct bubble
14. [ ] Score text pulses (grows and shrinks)
15. [ ] Animation is smooth and quick (~200ms)
16. [ ] Animation does not interfere with gameplay
17. [ ] Multiple rapid clicks animate correctly

### Score Display Testing
18. [ ] Score text is readable
19. [ ] Score has good contrast with background
20. [ ] Score does not overlap with bubbles
21. [ ] Score stays in fixed position
22. [ ] Score format is consistent

### Time Tracking Testing (if enabled)
23. [ ] Time starts at 0:00
24. [ ] After 1 second, time shows 0:01
25. [ ] After 10 seconds, time shows 0:10
26. [ ] After 65 seconds, time shows 1:05
27. [ ] Time continues during gameplay
28. [ ] Time format is always M:SS

### UI Layout Testing
29. [ ] Score is in top-left corner
30. [ ] Time is in top-right corner (if enabled)
31. [ ] Both are above game elements (not hidden)
32. [ ] Neither overlaps with bubbles
33. [ ] UI is readable on all backgrounds

### Integration Testing
34. [ ] Score increments integrate with Phase 10 logic
35. [ ] Correct clicks trigger score update
36. [ ] Incorrect clicks do not affect score
37. [ ] Score updates after celebration completes
38. [ ] Game flow feels natural

### ADHD-Friendly Validation
39. [ ] Score display is clear but not distracting
40. [ ] Score shows progress (encouraging)
41. [ ] No negative feedback in score
42. [ ] Updates are immediate (instant feedback)
43. [ ] Time is informational (not stressful)

### Device Testing
44. [ ] Test on desktop (mouse)
45. [ ] Test on tablet (touch)
46. [ ] Test on mobile (small screen)
47. [ ] Test in Chrome
48. [ ] Test in Firefox

### Edge Case Testing
49. [ ] Score reaches double digits (10+)
50. [ ] Score reaches triple digits (100+) if possible
51. [ ] Time exceeds 1 minute (1:00+)
52. [ ] Rapid score increments (5+ in quick succession)
53. [ ] Check console for errors (should be zero)

## Success Criteria

**This phase is complete when:**

### Functional Completeness
1. Score display created and positioned correctly
2. Score variable tracks correct clicks accurately
3. Score increments only on correct clicks (not incorrect)
4. Score display updates immediately
5. Optional: Time display created and tracks elapsed time
6. Optional: Time updates every second

### Visual Quality
7. Score text is large and readable (28px)
8. Score has high contrast (white with stroke)
9. Score positioned in top-left (20, 20)
10. Time positioned in top-right (760, 20) if enabled
11. UI elements stay on top of game (depth 1000)
12. UI does not overlap with gameplay

### Integration
13. Score system integrates with Phase 10 logic
14. incrementScore called after correct clicks
15. Score updates after celebration completes
16. Game loop flows naturally with score tracking

### Performance
17. Score updates feel instant (<16ms)
18. Animation runs smoothly if enabled (60fps)
19. Time updates do not cause lag
20. No console errors

### ADHD-Friendly Validation
21. Score display is clear and encouraging
22. Score shows success (not failures)
23. Score never decreases (positive only)
24. Time is informational (not pressured) if shown
25. Feedback is immediate and obvious

### Testing Completeness
26. Tested score increments (multiple times)
27. Tested incorrect clicks don't change score
28. Tested score display readability
29. Tested UI positioning (no overlaps)
30. Tested on multiple devices/browsers

### Documentation
31. Screenshots of UI layout
32. Score values documented
33. Any issues or quirks noted

### Ready for Phase 12
34. Score system fully functional
35. Code is clean and organized
36. No known bugs
37. Ready for next game features

## Notes

**Score System Philosophy**
- Score is about encouragement, not judgment
- Only tracks success (correct clicks), not failures
- Immediate feedback reinforces positive behavior
- Simple display avoids cognitive overload

**What We're Testing**
- Score tracking accuracy
- Display updates and timing
- UI positioning and readability
- Integration with game logic
- ADHD-friendly design principles

**What We're NOT Testing Yet**
- High score persistence (localStorage)
- Session statistics (accuracy %)
- Progress bars or visual representations
- Achievements or milestones
- Difficulty progression

**Time Display Considerations**
- Time is optional - can be excluded if it adds pressure
- If included, should be secondary to score (smaller, right-aligned)
- No countdown or time limits (informational only)
- Player should never feel rushed

**Critical Success Factors**
1. **Accuracy**: Score must increment correctly every time
2. **Immediacy**: Updates must feel instant
3. **Clarity**: Display must be readable at a glance
4. **Encouragement**: Score should feel rewarding, not stressful
5. **Integration**: Must work seamlessly with Phase 10 logic

This phase adds essential feedback that helps players feel progress and accomplishment. The score is a core part of the positive reinforcement loop that keeps ADHD players engaged.
