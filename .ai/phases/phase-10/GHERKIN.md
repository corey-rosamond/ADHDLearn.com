# Phase 10: Letter Pop - Target Letter Game Logic - BDD Scenarios

## Feature: Target Letter Selection

```gherkin
Feature: Target Letter Selection
  As the game system
  I want to randomly select a target letter
  So that players have a clear goal for each round

Background:
  Given the LetterPopScene is loaded
  And the alphabet array contains all 26 letters
```

## Scenario: Random Target Letter Selection

```gherkin
Scenario: Select random target letter at round start
  When a new round starts
  Then a random letter should be selected from A-Z
  And the letter should be stored in targetLetter property
  And the selection should be truly random
  And all 26 letters should have equal probability
```

## Scenario: Target Letter Storage

```gherkin
Scenario: Store target letter for comparison
  Given a round has started
  When the target letter "B" is selected
  Then the targetLetter property should equal "B"
  And the property should be accessible to all methods
  And the property should persist for the entire round
```

## Feature: Audio Instructions

```gherkin
Feature: Audio Instruction System
  As a player
  I want to hear which letter to find
  So that I know what to click

Background:
  Given audio files for all 26 letters are loaded
  And the audio format is "find_letter_{X}.mp3"
```

## Scenario: Play Target Letter Audio

```gherkin
Scenario: Audio instruction plays at round start
  Given the target letter is "B"
  When the round starts
  Then the audio file "find_letter_B.mp3" should play
  And the audio should say "Find the letter B!"
  And the audio should be clear and encouraging
  And the audio volume should be appropriate
```

## Scenario: Audio Timing

```gherkin
Scenario: Audio plays before bubbles appear
  Given a new round is starting
  When the audio instruction begins
  Then the audio should start playing
  And the audio should not overlap with previous sounds
  And bubbles should appear after audio starts
  And players should hear the instruction clearly
```

## Scenario: Audio for Different Letters

```gherkin
Scenario Outline: Audio instruction for each letter
  Given the target letter is <letter>
  When the round starts
  Then the audio file "find_letter_<letter>.mp3" should play
  And the instruction should be clear

  Examples:
    | letter |
    | A      |
    | B      |
    | M      |
    | Z      |
```

## Feature: Correct Click Detection

```gherkin
Feature: Correct Bubble Click
  As a player
  I want to be celebrated when I click the right letter
  So that I feel encouraged and rewarded

Background:
  Given the target letter is "B"
  And bubbles are displayed on screen
  And one bubble contains the letter "B"
```

## Scenario: Detect Correct Click

```gherkin
Scenario: Click the correct bubble
  Given the player sees the letter "B" bubble
  When the player clicks the "B" bubble
  Then the handleBubbleClick method should be called
  And the clicked letter "B" should be compared to target "B"
  And the comparison should return true (match)
  And the handleCorrectClick method should be triggered
```

## Scenario: Correct Click Celebration

```gherkin
Scenario: Celebrate correct click with effects
  Given the player clicked the correct bubble "B"
  When the correct click is detected
  Then a success sound should play
  And celebration particles should be created
  And the bubble should scale up to 1.5x
  And the bubble should fade out (alpha: 1.0 → 0.0)
  And the animation should last 300 milliseconds
  And the bubble should be destroyed after animation
```

## Scenario: Celebration Particles

```gherkin
Scenario: Create star burst particle effect
  Given the correct bubble is at position (400, 300)
  When the celebration effect is created
  Then 8 particles should be created
  And particles should be positioned at the bubble center
  And particles should have colors: gold, pink, cyan, green
  And particles should animate outward in 8 directions
  And particles should move 100 pixels from center
  And particles should fade out (alpha: 1.0 → 0.0)
  And particles should be destroyed after 400ms
```

## Scenario: Bubble Removal

```gherkin
Scenario: Remove correct bubble from screen
  Given the player clicked the correct bubble
  When the celebration animation completes
  Then the bubble container should be destroyed
  And the bubble should no longer be visible
  And the bubble should no longer be clickable
  And memory should be freed (no leak)
```

## Feature: Incorrect Click Detection

```gherkin
Feature: Incorrect Bubble Click (Non-Punitive)
  As a player
  I want gentle feedback when I click the wrong letter
  So that I can try again without frustration

Background:
  Given the target letter is "B"
  And bubbles are displayed including "A", "C", "X"
  And the player clicks a bubble with letter "X"
```

## Scenario: Detect Incorrect Click

```gherkin
Scenario: Click an incorrect bubble
  Given the player sees the letter "X" bubble
  When the player clicks the "X" bubble
  Then the handleBubbleClick method should be called
  And the clicked letter "X" should be compared to target "B"
  And the comparison should return false (no match)
  And the handleIncorrectClick method should be triggered
```

## Scenario: Wobble Animation (Non-Punitive)

```gherkin
Scenario: Gentle wobble for incorrect click
  Given the player clicked an incorrect bubble
  When the incorrect click is detected
  Then a wobble animation should be created
  And the bubble should move left 10 pixels
  And the bubble should yoyo back to original position
  And the wobble should repeat 2 times (3 shakes total)
  And the total animation should last 150 milliseconds
  And the animation should use Power1 easing
```

## Scenario: Bubble Remains After Incorrect Click

```gherkin
Scenario: Incorrect bubble stays on screen
  Given the player clicked an incorrect bubble
  When the wobble animation completes
  Then the bubble should return to its original position
  And the bubble should remain visible
  And the bubble should remain clickable
  And the player can click it again if desired
```

## Scenario: No Negative Feedback

```gherkin
Scenario: Non-punitive feedback for wrong click
  Given the player clicked an incorrect bubble
  When the incorrect click is processed
  Then no negative sound should play (or very gentle)
  And no "WRONG" text should appear
  And no red visual indicators should appear
  And the score should not decrease
  And the bubble should not be removed
  And the game should remain encouraging
```

## Feature: Click Handler Logic

```gherkin
Feature: Bubble Click Handler
  As the game system
  I want to handle all bubble clicks consistently
  So that feedback is clear and reliable

Background:
  Given the LetterPopScene is active
  And the target letter is selected
  And bubbles are displayed
```

## Scenario: Click Handler Invocation

```gherkin
Scenario: Handle bubble click event
  Given a bubble with letter "B" is displayed
  And the bubble is interactive
  When the player clicks the bubble
  Then a pointerdown event should be triggered
  And the handleBubbleClick method should be called
  And the method should receive the bubble container
  And the method should receive the clicked letter "B"
```

## Scenario: Letter Comparison Logic

```gherkin
Scenario: Compare clicked letter to target
  Given the target letter is "B"
  And the player clicked a bubble
  When the handleBubbleClick method executes
  Then it should extract the clicked letter
  And it should compare clicked letter to targetLetter
  And it should branch to correct or incorrect path
  And only one path should execute
```

## Scenario: Multiple Click Handling

```gherkin
Scenario: Handle multiple sequential clicks
  Given the target letter is "B"
  When the player clicks bubble "A" (incorrect)
  And the player clicks bubble "C" (incorrect)
  And the player clicks bubble "B" (correct)
  Then each click should be processed independently
  And the first two should wobble
  And the third should celebrate
  And the sequence should feel natural
```

## Feature: Round Completion

```gherkin
Feature: Round Completion Check
  As the game system
  I want to detect when a round is complete
  So that I can start a new round

Background:
  Given a round is active
  And the target letter is "B"
```

## Scenario: Check Round Completion After Correct Click

```gherkin
Scenario: Detect round completion
  Given the player clicked the correct bubble
  When the bubble is destroyed
  Then the checkRoundComplete method should be called
  And it should check if any more target bubbles exist
  And it should determine if a new round should start
```

## Feature: Audio Preloading

```gherkin
Feature: Audio Asset Loading
  As the game system
  I want to preload all audio files
  So that playback is instant during gameplay

Background:
  Given the LetterPopScene preload method is running
```

## Scenario: Load All Letter Audio Files

```gherkin
Scenario: Preload target letter audio
  When the preload method executes
  Then it should load audio for all 26 letters
  And each file should be named "find_letter_{X}.mp3"
  And each file should have key "find_letter_{X}"
  And files should be loaded from "assets/audio/"
```

## Scenario: Load Feedback Sounds

```gherkin
Scenario: Preload success and try-again sounds
  When the preload method executes
  Then it should load "success.mp3" with key "success"
  And it should load "try_again.mp3" with key "tryAgain"
  And both files should be ready for instant playback
```

## Scenario: Handle Missing Audio Files

```gherkin
Scenario: Gracefully handle missing audio
  Given an audio file is missing or fails to load
  When the game attempts to play that audio
  Then no error should be thrown
  And the game should continue normally
  And visual feedback should still work
  And the player should not experience a crash
```

## Feature: Visual Feedback Timing

```gherkin
Feature: Animation Timing and Smoothness
  As a player
  I want smooth and responsive animations
  So that the game feels polished

Background:
  Given animations are created using Phaser tweens
```

## Scenario: Correct Click Animation Duration

```gherkin
Scenario: Celebration animation timing
  Given the player clicked the correct bubble
  When the celebration animation starts
  Then the bubble scale should animate for 300ms
  And the bubble fade should animate for 300ms
  And both animations should run simultaneously
  And the particle animations should last 400ms
  And all animations should feel smooth (60fps)
```

## Scenario: Incorrect Click Animation Duration

```gherkin
Scenario: Wobble animation timing
  Given the player clicked an incorrect bubble
  When the wobble animation starts
  Then each wobble cycle should take 50ms
  And the animation should repeat 2 times
  And the total duration should be 150ms
  And the animation should feel quick and gentle
```

## Scenario: Animation Smoothness

```gherkin
Scenario: Ensure smooth 60fps animations
  Given any animation is playing
  When the animation is running
  Then the frame rate should stay at 60fps
  And there should be no jank or stuttering
  And the easing should feel natural
  And the animation should not block user input
```

## Feature: ADHD-Friendly Design

```gherkin
Feature: ADHD-Friendly Game Mechanics
  As a player with ADHD
  I want encouraging and non-frustrating gameplay
  So that I stay engaged and motivated

Background:
  Given the game is designed for ADHD-friendly play
```

## Scenario: Immediate Feedback

```gherkin
Scenario: Instant feedback on all interactions
  Given the player clicks any bubble
  When the click registers
  Then visual feedback should appear within 50ms
  And audio feedback should play within 50ms
  And the player should never wonder if click registered
```

## Scenario: Non-Punitive Incorrect Clicks

```gherkin
Scenario: Gentle response to mistakes
  Given the player clicks an incorrect bubble
  When the game processes the click
  Then the feedback should be gentle (wobble only)
  And no negative sounds should play
  And no "wrong" messages should appear
  And the bubble should stay available
  And the player can try again immediately
```

## Scenario: Positive Reinforcement

```gherkin
Scenario: Celebrate success enthusiastically
  Given the player clicks the correct bubble
  When the game processes the click
  Then celebration effects should be clear and joyful
  And success sound should be encouraging
  And visual effects should be colorful and fun
  And the player should feel rewarded
```

## Scenario: No Time Pressure

```gherkin
Scenario: Allow unlimited time per round
  Given a round is active
  When the player is thinking
  Then no timer should be counting down
  And no visual time pressure should exist
  And the player can take as long as needed
  And no penalty for slow responses
```

## Scenario: Clear Instructions

```gherkin
Scenario: Explicit audio instructions
  Given a round starts
  When the target letter is selected
  Then clear audio should play: "Find the letter B!"
  And the instruction should be explicit (not ambiguous)
  And the player should know exactly what to do
```

## Acceptance Criteria

### Target Letter System
- [ ] Target letter is randomly selected from A-Z
- [ ] All 26 letters have equal selection probability
- [ ] Target letter is stored as scene property
- [ ] Target letter persists for entire round

### Audio System
- [ ] Audio instruction plays at round start
- [ ] Audio clearly states "Find the letter [X]!"
- [ ] Audio volume is appropriate (not too loud/soft)
- [ ] Audio doesn't overlap with other sounds
- [ ] All 26 letter audio files load correctly
- [ ] Success sound plays on correct click
- [ ] No negative sounds on incorrect clicks

### Correct Click Logic
- [ ] Correct bubble click detected accurately
- [ ] Success sound plays immediately
- [ ] Celebration particles created (8 particles)
- [ ] Particles animate outward radially
- [ ] Bubble scales up to 1.5x
- [ ] Bubble fades out completely
- [ ] Bubble is destroyed after animation (300ms)
- [ ] Score increments (Phase 11)
- [ ] Round completion check runs

### Incorrect Click Logic
- [ ] Incorrect bubble click detected accurately
- [ ] Wobble animation plays (gentle shake)
- [ ] Wobble moves bubble 10px left, yoyos back
- [ ] Wobble repeats 2 times (3 shakes total)
- [ ] Total wobble duration is ~150ms
- [ ] Bubble returns to original position
- [ ] Bubble remains visible after wobble
- [ ] Bubble remains clickable after wobble
- [ ] No negative audio plays
- [ ] No "wrong" visual indicators

### Feedback Timing
- [ ] Click response feels instant (<50ms)
- [ ] Correct animation completes in 300ms
- [ ] Incorrect animation completes in 150ms
- [ ] Particle animations complete in 400ms
- [ ] All animations run at 60fps (smooth)

### ADHD-Friendly Requirements
- [ ] Feedback is immediate for all clicks
- [ ] Incorrect clicks are non-punitive (gentle)
- [ ] Correct clicks are celebrated enthusiastically
- [ ] No time pressure or countdown timers
- [ ] Instructions are clear and explicit
- [ ] Player can retry incorrect bubbles unlimited times
- [ ] Visual feedback is clear without audio
- [ ] Audio enhances but isn't required

### Technical Requirements
- [ ] No console errors during gameplay
- [ ] Memory is freed (bubbles destroyed properly)
- [ ] Click handlers don't conflict
- [ ] Animations don't stack or glitch
- [ ] Touch events work (mobile devices)
- [ ] Game handles missing audio gracefully

## Edge Cases to Test

```gherkin
Scenario: Click During Animation
  Given a bubble is currently animating (wobbling)
  When the player clicks the same bubble again
  Then the click should be ignored or queued
  And animations should not stack or conflict

Scenario: Rapid Correct Clicks
  Given multiple correct bubbles on screen
  When the player clicks them rapidly
  Then each click should be processed
  And celebrations should not overlap awkwardly
  And audio should not become overwhelming

Scenario: Click Outside Bubbles
  Given bubbles are displayed
  When the player clicks empty space
  Then nothing should happen
  And no errors should occur
  And bubbles should remain interactive

Scenario: Target Letter Not in Bubbles
  Given the target letter is "B"
  But no bubble contains "B" (error condition)
  When the player clicks any bubble
  Then all clicks should wobble (incorrect)
  And the player should not be stuck
  And an error should be logged for debugging

Scenario: Audio Playback Blocked
  Given the browser blocks audio autoplay
  When the player clicks the correct bubble
  Then visual feedback should still work
  And the game should not throw errors
  And gameplay should continue normally

Scenario: Slow Device Performance
  Given the game is running on a slow device
  When animations play
  Then animations should complete (may skip frames)
  And the game should remain playable
  And no infinite loops or crashes

Scenario: Touch vs Mouse
  Given the game is on a touch device
  When the player taps a bubble
  Then the tap should register as a click
  And feedback should be identical to mouse click
  And no hover effects should interfere

Scenario: Destroyed Bubble Click
  Given a bubble is being destroyed (correct click)
  When the player clicks it again during animation
  Then the second click should be ignored
  And no errors should occur
  And the destruction should complete normally
```

## Manual Testing Checklist

### Setup Phase
1. [ ] Game loads without errors
2. [ ] LetterPopScene starts correctly
3. [ ] Audio files are loaded (check Network tab)
4. [ ] Bubbles are displayed

### Target Letter Testing
5. [ ] Round starts automatically
6. [ ] Audio instruction plays ("Find the letter [X]!")
7. [ ] Audio is clear and audible
8. [ ] Target letter is one of the bubbles

### Correct Click Testing
9. [ ] Click the correct bubble
10. [ ] Success sound plays
11. [ ] Celebration particles appear (8 stars)
12. [ ] Particles animate outward
13. [ ] Bubble scales up
14. [ ] Bubble fades out
15. [ ] Bubble is removed from screen
16. [ ] Score increments (Phase 11)

### Incorrect Click Testing
17. [ ] Click an incorrect bubble
18. [ ] Bubble wobbles gently (3 shakes)
19. [ ] No negative sound plays
20. [ ] Bubble stays on screen
21. [ ] Bubble is still clickable
22. [ ] Click it again - wobbles again

### Multiple Click Testing
23. [ ] Click wrong bubble (wobbles)
24. [ ] Click another wrong bubble (wobbles)
25. [ ] Click correct bubble (celebrates)
26. [ ] Sequence feels natural

### Animation Testing
27. [ ] All animations are smooth (no jank)
28. [ ] Wobble animation takes ~150ms
29. [ ] Celebration animation takes ~300ms
30. [ ] Particles disappear after 400ms
31. [ ] No animation glitches or overlaps

### Audio Testing
32. [ ] Target letter audio plays at start
33. [ ] Success audio plays on correct click
34. [ ] No audio overlaps awkwardly
35. [ ] Mute browser - game still works visually

### ADHD-Friendly Validation
36. [ ] Feedback feels instant (<50ms)
37. [ ] Incorrect clicks feel gentle (not punishing)
38. [ ] Correct clicks feel celebratory
39. [ ] No time pressure or urgency
40. [ ] Instructions are clear

### Device Testing
41. [ ] Test on desktop (mouse)
42. [ ] Test on tablet (touch)
43. [ ] Test on mobile (small screen, touch)
44. [ ] Test in Chrome
45. [ ] Test in Firefox

### Edge Case Testing
46. [ ] Click bubble during wobble
47. [ ] Rapid click multiple bubbles
48. [ ] Click empty space (nothing happens)
49. [ ] Mute audio (visual feedback works)
50. [ ] Check console for errors (should be zero)

## Success Criteria

**This phase is complete when:**

### Functional Completeness
1. Target letter is randomly selected each round
2. Audio instruction plays clearly at round start
3. Correct bubble clicks trigger celebration
4. Celebration includes: sound, particles, scale, fade
5. Correct bubbles are removed from screen
6. Incorrect bubble clicks trigger gentle wobble
7. Incorrect bubbles stay on screen
8. Score increments on correct clicks (Phase 11 integration)

### Quality Metrics
9. Zero console errors during normal gameplay
10. All animations run smoothly at 60fps
11. Click feedback feels instant (<50ms perceived delay)
12. Audio timing feels natural (no awkward overlaps)
13. Touch devices work identically to mouse

### ADHD-Friendly Validation
14. Incorrect clicks are non-punitive (gentle wobble only)
15. Correct clicks are enthusiastically celebrated
16. Instructions are clear and explicit
17. No time pressure or countdown
18. Player can retry unlimited times
19. Feedback is immediate and obvious

### Testing Completeness
20. Tested with all 26 letters (sample at minimum)
21. Tested correct and incorrect click paths
22. Tested multiple clicks per round
23. Tested audio on/off scenarios
24. Tested on mouse and touch devices
25. Tested in multiple browsers

### Documentation
26. Screenshots of celebration effect
27. Video of click interactions (optional)
28. Audio files documented
29. Any issues or quirks noted

### Ready for Phase 11
30. Score increment hook is in place
31. Code is clean and organized
32. No known bugs
33. Ready to add score UI (Phase 11)

## Notes

**Core Gameplay Loop**
- This phase defines the fundamental interaction loop
- Player hears instruction → clicks bubbles → gets feedback
- Loop must feel satisfying and encouraging
- Non-punitive design is critical for ADHD engagement

**What We're Testing**
- Target letter selection and audio
- Correct/incorrect detection
- Visual feedback (particles, animations)
- Audio feedback (success sound)
- Bubble lifecycle (create → click → remove/wobble)
- ADHD-friendly design principles

**What We're NOT Testing Yet**
- Score display UI (Phase 11)
- Time tracking (Phase 11)
- Multiple rounds or progression
- Difficulty levels
- Performance metrics

**Critical Success Factors**
1. **Immediate feedback**: Player must never wonder if click registered
2. **Non-punitive errors**: Wrong clicks should not feel like failure
3. **Celebratory success**: Right clicks should feel rewarding
4. **Clear instructions**: Player always knows what to do
5. **Smooth performance**: 60fps, no lag, no glitches

This phase establishes the emotional tone of the entire game. Get the feedback loop right, and players will stay engaged. Make it frustrating or confusing, and players will disengage. The ADHD-friendly design is not optional - it's fundamental to the game's success.
