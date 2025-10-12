# Phase 26: Word Catch - Target Word Logic - BDD Scenarios

## Feature: Target Word Recognition Gameplay

```gherkin
Feature: Word Catch Target Word System
  As Aurora (the player)
  I want to catch specific sight words called out by the game
  So that I can learn to recognize sight words through gameplay

Background:
  Given the Word Catch scene is loaded
  And the collision system is working from Phase 25
  And sight words are loaded from JSON
  And the character is on screen
  And the target word system is initialized
```

## Scenario: Target Word Selection and Announcement

```gherkin
Scenario: Game selects and announces first target word
  Given a new round starts
  When the target word is selected
  Then a random sight word should be chosen as target
  And the target should not be same as previous target
  And the target display should show the word
  And the callout audio should play "Catch the word [target]!"
  And the callout audio should complete before words spawn
  And a 500ms pause should occur after callout
  And words should begin spawning after pause

Scenario: Target word changes after successful catch
  Given the current target is "cat"
  And I catch "cat" successfully
  When the celebration completes
  Then a new target word should be selected
  And the new target should be different from "cat"
  And the new target should be announced
  And the target display should update
  And new words should spawn with the new target

Scenario: Target display is always visible
  Given a target word is selected
  When I am playing the game
  Then the target display should be visible at top of screen
  And should show "Catch: [target word]"
  And should be positioned at (400, 50)
  And should have clear, large text
  And should not obscure falling words
  And should remain visible throughout gameplay
```

## Scenario: Word Pool Generation

```gherkin
Scenario: Word pool contains mix of target and distractors
  Given the target word is "run"
  When a word pool is generated with size 20
  Then the pool should contain ~7 instances of "run" (35%)
  And the pool should contain ~13 distractor words (65%)
  And all words should be valid sight words
  And the pool should be shuffled randomly
  And target words should be distributed throughout pool

Scenario: Distractor words are different from target
  Given the target word is "dog"
  When distractor words are selected
  Then no distractor should be "dog"
  And all distractors should be sight words
  And distractors should be from the word database
  And distractors should be appropriate difficulty

Scenario: Pool ensures target appears regularly
  Given the target word is "jump"
  When 20 words spawn from the pool
  Then "jump" should appear approximately 7 times
  And "jump" appearances should be distributed evenly
  And player should have regular opportunities to catch target
```

## Scenario: Catch Validation

```gherkin
Scenario: Correct word caught - validation passes
  Given the target word is "cat"
  When I catch a word "cat"
  Then validation should return true
  And the catch should be marked as correct
  And the console should log "Catch validation: cat vs cat = true"

Scenario: Incorrect word caught - validation fails
  Given the target word is "cat"
  When I catch a word "dog"
  Then validation should return false
  And the catch should be marked as incorrect
  And the console should log "Catch validation: dog vs cat = false"

Scenario: Case-insensitive validation
  Given the target word is "cat"
  When I catch a word with any casing
  Then validation should be case-insensitive
  And "cat", "Cat", "CAT" should all be treated as same word

Scenario: Validation with null target
  Given no target word is set
  When I catch a word
  Then validation should handle gracefully
  And should log warning "No target word set"
  And should return false
  And game should not crash
```

## Scenario: Correct Catch Celebration

```gherkin
Scenario: Enthusiastic celebration for correct catch
  Given the target word is "run"
  When I catch "run"
  Then celebration particles should spawn (12-20 particles)
  And particles should be bright gold/yellow/green
  And particles should be larger and more numerous than basic catch
  And a celebration sound should play (cheer, success)
  And celebration audio volume should be 0.8
  And encouragement text should appear: "Great job!"
  And text should be green color
  And text should appear at catch position
  And text should fade out after 1 second

Scenario: Score increases on correct catch
  Given my score is 50 points
  And the target word is "cat"
  When I catch "cat"
  Then my score should increase by 10 points
  And my new score should be 60 points
  And the score display should update
  And the update should animate (scale pulse)

Scenario: Progress increments on correct catch
  Given my progress is "3 / 10"
  And the target word is "dog"
  When I catch "dog"
  Then my progress should increase to "4 / 10"
  And the progress display should update
  And the progress text should animate (pulse)
  And the animation should be satisfying and motivating

Scenario: Multiple correct catches in succession
  Given the target word changes after each catch
  When I catch 5 correct words in a row
  Then each catch should have full celebration
  And each catch should increment score by 10
  And each catch should increment progress
  And celebrations should not interfere with each other
  And new targets should be selected after each catch
```

## Scenario: Incorrect Catch - Gentle Feedback

```gherkin
Scenario: Gentle oops for incorrect catch
  Given the target word is "cat"
  When I catch "dog" (incorrect)
  Then neutral particles should spawn (6-8 particles)
  And particles should be orange/gray colored
  And particles should be subtle and small
  And a gentle "oops" sound should play
  And "oops" audio should be friendly, not harsh
  And "oops" volume should be 0.6 (quieter than celebration)
  And feedback text should appear: "Try again!"
  And text should be orange color (not red)
  And text should fade out after 800ms

Scenario: No score penalty for incorrect catch
  Given my score is 50 points
  And the target word is "run"
  When I catch "jump" (incorrect)
  Then my score should remain 50 points
  And no score penalty should be applied
  And the game should feel non-punitive
  And no harsh feedback should appear

Scenario: Progress does not change on incorrect catch
  Given my progress is "5 / 10"
  And the target word is "play"
  When I catch "stop" (incorrect)
  Then my progress should remain "5 / 10"
  And the progress display should not change
  And I should keep trying for the same target

Scenario: Target word stays same after incorrect catch
  Given the target word is "cat"
  When I catch "dog" (incorrect)
  Then the target word should remain "cat"
  And the target display should not change
  And I should have another chance to catch "cat"
  And the game should not interrupt flow

Scenario: No harsh visual feedback on incorrect catch
  Given I catch an incorrect word
  Then no red X mark should appear
  And no harsh visual punishment should show
  And no screen shake or negative animation
  And feedback should be neutral and gentle
  And feedback should encourage trying again
```

## Scenario: ADHD-Friendly Feedback Validation

```gherkin
Scenario: Incorrect catch feedback is gentle and encouraging
  Given Aurora catches an incorrect word
  When feedback is provided
  Then the audio should be gentle "oops" or "try again"
  And the audio should NOT be a harsh buzzer
  And the audio should NOT be loud or startling
  And the visual should be orange/neutral (NOT red)
  And the text should be encouraging "Try again!"
  And the text should NOT be punishing "Wrong!" or "No!"
  And the gameplay should continue immediately
  And Aurora should feel encouraged to keep trying

Scenario: Correct catch feedback is enthusiastic and rewarding
  Given Aurora catches the correct word
  When feedback is provided
  Then the audio should be enthusiastic cheer
  And the particles should be bright and exciting
  And the text should be celebratory "Great job!"
  And the text should be green (positive)
  And the feedback should feel rewarding
  And Aurora should feel proud of success

Scenario: Feedback timing maintains engagement
  Given Aurora is playing the game
  When catching words (correct or incorrect)
  Then all feedback should be immediate (< 50ms)
  And feedback should clearly connect to action
  And correct feedback should be more exciting than incorrect
  And incorrect feedback should not interrupt flow
  And the pacing should maintain motivation
```

## Scenario: Round Progress Tracking

```gherkin
Scenario: Progress display shows current status
  Given a round starts
  Then the progress display should show "0 / 10"
  And should be positioned at (700, 50)
  And should be visible throughout round
  And should update on each correct catch

Scenario: Progress increments correctly
  Given I start with "0 / 10"
  When I catch 1 correct word
  Then progress should show "1 / 10"
  When I catch another correct word
  Then progress should show "2 / 10"
  When I catch an incorrect word
  Then progress should remain "2 / 10"
  When I catch 3 more correct words
  Then progress should show "5 / 10"

Scenario: Progress display animates on update
  Given my progress is "4 / 10"
  When I catch a correct word
  Then the progress text should pulse/scale
  And should scale from 1.0 to 1.3 and back
  And animation should take 150ms
  And should use Back.easeOut easing
  And animation should feel satisfying

Scenario: Progress resets on new round
  Given I completed round 1 with "10 / 10"
  When round 2 starts
  Then progress should reset to "0 / 10"
  And should start counting again
  And should track new round's progress
```

## Scenario: Round Completion

```gherkin
Scenario: Round completes after 10 correct catches
  Given I have caught 9 correct words
  And my progress is "9 / 10"
  When I catch the 10th correct word
  Then the round should complete
  And word spawning should stop
  And all remaining words should be cleared
  And a big celebration animation should play
  And round complete audio should play
  And a round summary should appear (optional)

Scenario: Round completion celebration
  Given I catch the 10th correct word
  When the round completes
  Then a large celebration animation should play
  And celebration should be bigger than single catch
  And success audio should play
  And text should show "Round Complete!"
  And celebration should last 2-3 seconds
  And should feel like major achievement

Scenario: Transition to next round
  Given round 1 is complete
  When celebration finishes (after 3 seconds)
  Then round 2 should start
  And progress should reset to "0 / 10"
  And a new target word should be selected
  And target should be announced
  And words should begin spawning
  And round counter should show "Round 2"

Scenario: Game completes after all rounds
  Given I am on round 3 of 3
  And I catch the 10th correct word of round 3
  When the round completes
  Then the game should end
  And a game complete screen should appear
  And final celebration should play
  And summary statistics should show (optional)
  And option to play again should be available
```

## Scenario: Multiple Rounds

```gherkin
Scenario: Game supports multiple rounds
  Given the game is configured for 3 rounds
  When I start playing
  Then I should play round 1 (10 words)
  And complete round 1
  Then I should play round 2 (10 words)
  And complete round 2
  Then I should play round 3 (10 words)
  And complete round 3
  Then the game should end

Scenario: Round counter displayed
  Given I am playing the game
  Then a round indicator should show current round
  And should show "Round 1", "Round 2", or "Round 3"
  And should be visible during gameplay
  And should update when round changes

Scenario: Each round has independent progress
  Given I am on round 2
  When I catch 7 correct words
  Then my progress should show "7 / 10" for round 2
  And should not include round 1's catches
  And each round should track separately
  And each round should complete at 10 correct catches
```

## Scenario: Edge Cases

```gherkin
Scenario: Handle only one word in database
  Given only one sight word exists in database
  When target word is selected
  Then that word should be used as target
  And distractors cannot be selected
  And game should handle gracefully
  And should not crash or error

Scenario: Missing callout audio file
  Given the target word "test" has no callout audio
  When the target is announced
  Then the visual display should show target
  And no audio should play (handled gracefully)
  And a warning should log to console
  And the game should continue with visual-only
  And words should spawn after normal delay

Scenario: Rapid correct catches
  Given 3 words spawn simultaneously
  And all 3 are the target word
  When I catch all 3 in under 1 second
  Then all 3 should be validated as correct
  And all 3 should trigger celebrations
  And progress should increment by 3
  And new targets should queue properly
  And no errors should occur

Scenario: Catch 10th word while other words falling
  Given my progress is "9 / 10"
  And 5 words are currently falling
  When I catch the 10th correct word
  Then the round should complete immediately
  And all falling words should be removed
  And no more words should spawn
  And celebration should play
  And transition to next round should occur

Scenario: Incorrect catch does not affect gameplay flow
  Given the target word is "run"
  And I catch "jump" (incorrect)
  When the gentle feedback finishes
  Then the game should continue immediately
  And words should continue falling normally
  And target should remain "run"
  And I should be able to catch again instantly
  And no delay or interruption should occur
```

## Scenario: UI Integration

```gherkin
Scenario: Target display positioned correctly
  Given the game is running
  Then the target display should be at top center
  And should be positioned at (400, 50)
  And should be 300px wide, 80px tall
  And should have blue background with white border
  And should show "Catch:" label above target word
  And should not block falling words

Scenario: Progress display positioned correctly
  Given the game is running
  Then the progress display should be at top right
  And should be positioned at (700, 50)
  And should show "X / 10" format
  And should have clear, bold font
  And should be visible at all times
  And should not block gameplay

Scenario: Feedback text appears at catch location
  Given I catch a word at position (350, 450)
  When feedback is triggered
  Then the feedback text should appear at (350, 450)
  And should be clearly visible
  And should not be obscured by other elements
  And should fade out smoothly
  And should be cleaned up properly
```

## Acceptance Criteria

### Must Have - Target Word System
- [ ] Target word selected randomly from word database
- [ ] Target word not repeated consecutively
- [ ] Target word callout plays: "Catch the word [target]!"
- [ ] Callout audio is clear and child-friendly
- [ ] Visual display shows current target word
- [ ] Target display positioned at top center (400, 50)
- [ ] Target display always visible during gameplay
- [ ] Words spawn after callout completes + 500ms pause

### Must Have - Word Pool Generation
- [ ] Word pool contains ~35% target words
- [ ] Word pool contains ~65% distractor words
- [ ] Distractor words are different from target
- [ ] Word pool is shuffled randomly
- [ ] Pool size is configurable (default: 20 words)
- [ ] Target words distributed evenly in pool

### Must Have - Validation
- [ ] Caught word validated against current target
- [ ] Validation is case-insensitive
- [ ] Validation returns boolean (correct/incorrect)
- [ ] Validation logged to console for debugging
- [ ] Null/undefined target handled gracefully

### Must Have - Correct Catch Feedback
- [ ] Celebration particles spawn (12-20 particles)
- [ ] Particles are bright gold/yellow/green
- [ ] Celebration audio plays (cheer sound)
- [ ] Audio volume is 0.8
- [ ] Encouragement text shows: "Great job!"
- [ ] Text is green colored
- [ ] Score increases by 10 points
- [ ] Progress increments (X / 10)
- [ ] Progress display updates and animates
- [ ] New target selected after delay

### Must Have - Incorrect Catch Feedback (ADHD-Friendly)
- [ ] Neutral particles spawn (6-8 particles)
- [ ] Particles are orange/gray (not red)
- [ ] Gentle "oops" audio plays (friendly voice)
- [ ] Audio volume is 0.6 (quieter than celebration)
- [ ] Feedback text shows: "Try again!"
- [ ] Text is orange colored (NOT red)
- [ ] NO harsh buzzer or error sounds
- [ ] NO red X marks or negative visuals
- [ ] NO score penalty
- [ ] NO progress penalty
- [ ] Target word stays the same
- [ ] Gameplay continues immediately
- [ ] Feedback is encouraging, not punishing

### Must Have - Round Management
- [ ] Round requires 10 correct catches to complete
- [ ] Progress tracked: "X / 10" displayed
- [ ] Progress display positioned at (700, 50)
- [ ] Progress updates on each correct catch
- [ ] Progress does NOT update on incorrect catch
- [ ] Round completes at 10 correct catches
- [ ] Round completion stops word spawning
- [ ] Round completion clears remaining words
- [ ] Big celebration on round complete
- [ ] Round complete audio plays
- [ ] Progress resets to "0 / 10" for next round
- [ ] Supports multiple rounds (default: 3 rounds)
- [ ] Game ends after all rounds complete

### Must Have - Edge Cases
- [ ] Single word in database handled
- [ ] Missing callout audio handled gracefully
- [ ] Rapid catches handled correctly
- [ ] 10th catch while words falling handled
- [ ] Incorrect catch doesn't interrupt flow
- [ ] All edge cases tested

### Must Have - Performance and Quality
- [ ] All game logic is correct (no bugs)
- [ ] 60fps maintained throughout
- [ ] No memory leaks
- [ ] All audio timing correct
- [ ] All animations smooth
- [ ] Console logs for debugging
- [ ] Ready for Phase 27 polish

## Manual Testing Checklist

### Setup
1. [ ] Launch Word Catch scene
2. [ ] Verify target system initializes
3. [ ] Open browser dev tools console
4. [ ] Check no errors on load

### Target Selection
5. [ ] Observe first target word selected
6. [ ] Verify callout audio plays
7. [ ] Verify callout says correct word
8. [ ] Verify target display shows word
9. [ ] Verify words spawn after callout

### Word Pool
10. [ ] Observe ~35% of words are target word
11. [ ] Verify distractor words are different
12. [ ] Verify target appears regularly

### Correct Catch
13. [ ] Catch target word
14. [ ] Verify celebration particles (bright, many)
15. [ ] Verify cheer audio plays
16. [ ] Verify "Great job!" text appears (green)
17. [ ] Verify score increases by 10
18. [ ] Verify progress increments (1/10, 2/10, etc.)
19. [ ] Verify new target selected after delay
20. [ ] Catch 5 correct words in a row - verify all work

### Incorrect Catch
21. [ ] Catch non-target word
22. [ ] Verify neutral particles (subtle, orange)
23. [ ] Verify gentle "oops" audio (NOT harsh)
24. [ ] Verify "Try again!" text appears (orange, NOT red)
25. [ ] Verify NO score penalty
26. [ ] Verify progress does NOT change
27. [ ] Verify target word stays the same
28. [ ] Verify gameplay continues immediately
29. [ ] Verify feedback feels gentle and encouraging

### ADHD-Friendly Validation
30. [ ] Confirm NO harsh buzzer sounds
31. [ ] Confirm NO red X marks
32. [ ] Confirm NO punishing feedback
33. [ ] Confirm feedback is encouraging
34. [ ] Test with Aurora - get feedback on feel

### Round Progress
35. [ ] Verify progress starts at "0 / 10"
36. [ ] Catch 3 correct words - verify "3 / 10"
37. [ ] Catch 1 incorrect word - verify still "3 / 10"
38. [ ] Verify progress display animates on update

### Round Completion
39. [ ] Catch 10 correct words
40. [ ] Verify round complete celebration
41. [ ] Verify round complete audio
42. [ ] Verify words stop spawning
43. [ ] Verify screen clears
44. [ ] Verify next round starts after delay
45. [ ] Verify progress resets to "0 / 10"

### Multiple Rounds
46. [ ] Complete round 1 (10 words)
47. [ ] Verify round 2 starts
48. [ ] Complete round 2 (10 words)
49. [ ] Verify round 3 starts
50. [ ] Complete round 3 (10 words)
51. [ ] Verify game ends

### Edge Cases
52. [ ] Test with missing callout audio
53. [ ] Catch 3 words rapidly - verify all work
54. [ ] Catch 10th word with others falling
55. [ ] Verify all handled gracefully

### Final Verification
56. [ ] No console errors throughout testing
57. [ ] All feedback appropriate and satisfying
58. [ ] Game logic is correct (no bugs)
59. [ ] ADHD-friendly feedback validated
60. [ ] Ready for Phase 27

## Success Criteria

**This phase is complete when:**

### Technical Excellence
1. Target word system works correctly
2. Validation logic is accurate
3. Word pool generation is balanced
4. All feedback systems work correctly
5. Round management is bug-free
6. Progress tracking is accurate
7. Multiple rounds work correctly
8. All edge cases handled gracefully
9. 60fps maintained throughout
10. No console errors

### ADHD-Friendly Design
11. Incorrect feedback is gentle and non-punitive
12. No harsh sounds or visuals
13. Feedback is encouraging, not punishing
14. Orange (neutral) used instead of red (negative)
15. No score penalties for mistakes
16. Gameplay flow not interrupted by mistakes
17. Celebrations are enthusiastic and rewarding
18. Target always visible (reduces memory load)
19. Progress always visible (motivates completion)
20. Aurora enjoys the gameplay and feedback

### Educational Effectiveness
21. Target word clearly communicated
22. Audio callout helps learning
23. Visual display reinforces word recognition
24. Correct feedback reinforces learning
25. Incorrect feedback redirects gently
26. 10-word rounds are achievable goals
27. Multiple rounds provide practice
28. Game encourages word recognition skills

### User Experience
29. Game is fun and engaging
30. Feedback feels satisfying
31. Progress is motivating
32. Round completion feels like achievement
33. Difficulty is appropriate for target age
34. Aurora wants to play again
35. Aurora learns sight words while playing
36. Parents approve of feedback approach

## Notes

**ADHD-Friendly Design is Critical**
- Target age (Aurora) requires careful feedback design
- Harsh negative feedback can trigger frustration
- Rejection sensitivity is common in ADHD
- Gentle redirection maintains motivation
- Celebration moments provide dopamine rewards
- Non-punitive approach keeps engagement high

**Educational Design Principles**
- Audio callout provides multi-sensory learning
- Visual display reinforces word recognition
- Immediate feedback strengthens learning
- Repetition through gameplay aids retention
- Positive reinforcement encourages practice
- Achievable goals (10 words) build confidence

**Comparison to Letter Pop**
- Similar target selection mechanism
- Adapted for sight words (more complex)
- More forgiving gameplay (generous hitbox)
- Gentler feedback (ADHD-optimized)
- Character movement vs. clicking
- Falling words vs. rising bubbles

**Testing with Target User**
- Aurora's feedback is critical
- Test incorrect catch feedback extensively
- Verify feedback feels encouraging, not punishing
- Confirm difficulty is appropriate
- Validate 10-word rounds are right length
- Ensure Aurora enjoys and learns

**Phase 26 Completes Core Gameplay**
- Word Catch is now fully playable
- Educational mechanic is implemented
- ADHD-friendly design is validated
- Ready for Phase 27 polish and refinement
- Foundation for future enhancements
