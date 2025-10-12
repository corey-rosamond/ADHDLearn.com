# Phase 12: Letter Pop - Complete Round Flow - BDD Scenarios

## Feature: Complete Round Flow

```gherkin
Feature: Letter Pop Complete Round Flow
  As Aurora (a 5-year-old with ADHD)
  I want to play a complete round of Letter Pop with 10 letters
  So that I can see my score and play again immediately

Background:
  Given the game is loaded
  And all audio assets are loaded
  And LetterPopScene is available
  And ResultsScene is available
```

## Scenario: Start New Round

```gherkin
Scenario: Initialize a new round of Letter Pop
  Given I am in the LetterPopScene
  When the round starts
  Then a sequence of 10 random letters should be generated
  And the current letter index should be 0
  And the correct answers count should be 0
  And the round start time should be recorded
  And the first letter should be displayed
  And the progress indicator should show "Letter 1 of 10"
```

## Scenario: Display Letter Sequence

```gherkin
Scenario: Show letters one at a time with progress indicator
  Given a round is in progress
  And I am on letter number <current>
  When the letter is displayed
  Then I should see a large letter on screen
  And I should see "Letter <current> of 10" at the top
  And the letter should be clearly visible
  And the progress should be accurate

  Examples:
    | current |
    | 1       |
    | 3       |
    | 7       |
    | 10      |
```

## Scenario: Advance on Correct Answer

```gherkin
Scenario: Move to next letter after correct answer
  Given I am on letter 3 of 10
  And the current letter is "M"
  When I click the correct answer for "M"
  Then the correct sound should play
  And the correct answers count should increase by 1
  And the current letter index should increase by 1
  And after 500 milliseconds
  Then the next letter should be displayed
  And the progress should show "Letter 4 of 10"
```

## Scenario: Stay on Letter After Incorrect Answer

```gherkin
Scenario: Remain on current letter when answer is wrong
  Given I am on letter 5 of 10
  And the current letter is "R"
  When I click an incorrect answer
  Then the incorrect sound should play
  And visual feedback should indicate wrong answer
  And the current letter index should remain at 4
  And the correct answers count should not increase
  And I should still see letter "R"
  And the progress should still show "Letter 5 of 10"
```

## Scenario: Complete Round After 10 Correct Answers

```gherkin
Scenario: End round and transition to results
  Given I am on letter 10 of 10
  And I have answered 9 letters correctly so far
  When I click the correct answer for letter 10
  Then the correct sound should play
  And the correct answers count should increase to 10
  And the round end time should be recorded
  And the total time should be calculated
  And after 1 second delay
  Then the game should transition to ResultsScene
  And the score and time data should be passed
```

## Scenario: Display Results Screen

```gherkin
Scenario: Show complete round results
  Given I just completed a round
  And my score was <score> out of 10
  And my time was <time> seconds
  When ResultsScene loads
  Then I should see "Round Complete!" as the title
  And I should see "Score: <score> out of 10"
  And I should see "Time: <time> seconds"
  And I should see a performance message
  And I should see a "Play Again" button

  Examples:
    | score | time |
    | 10    | 45   |
    | 8     | 52   |
    | 6     | 68   |
    | 4     | 80   |
```

## Scenario: Display Performance Messages

```gherkin
Scenario: Show encouraging message based on score
  Given I completed a round with <score> out of 10
  When the results are displayed
  Then I should see the message "<message>"

  Examples:
    | score | message                  |
    | 10    | Perfect! Amazing work!   |
    | 9     | Great job!               |
    | 8     | Great job!               |
    | 7     | Good effort!             |
    | 6     | Good effort!             |
    | 5     | Keep practicing!         |
    | 4     | Keep practicing!         |
```

## Scenario: Perfect Score Celebration

```gherkin
Scenario: Display special celebration for perfect round
  Given I completed a round with 10 out of 10 correct
  When the results screen appears
  Then I should see star particle effects
  And the stars should animate outward
  And the stars should fade out
  And the celebration should last approximately 2 seconds
  And the celebration should not block the "Play Again" button
```

## Scenario: Play Again Button Interaction

```gherkin
Scenario: Use Play Again button to start new round
  Given I am viewing the results screen
  And the "Play Again" button is visible
  When I hover over the "Play Again" button
  Then the cursor should change to a pointer
  And the button should scale up to 1.1x size
  And the animation should take 200 milliseconds
  When I move the cursor away
  Then the button should scale back to 1.0x size
  And the animation should take 200 milliseconds
```

## Scenario: Click Play Again Button

```gherkin
Scenario: Restart game from results screen
  Given I am viewing the results screen
  When I click the "Play Again" button
  Then the button click sound should play
  And the button should scale down to 0.95x
  And then scale back up to 1.1x (yoyo effect)
  And after the animation completes
  Then the game should transition to LetterPopScene
  And a new round should start
  And the round state should be completely reset
```

## Scenario: Multiple Rounds in Sequence

```gherkin
Scenario: Play multiple rounds continuously
  Given I have completed a round
  When I click "Play Again"
  And I complete another round
  And I click "Play Again" again
  Then I should be able to play indefinitely
  And each round should have a fresh letter sequence
  And the score should reset to 0 for each round
  And the timer should reset for each round
  And no memory leaks should occur
```

## Scenario: Round Progress Tracking

```gherkin
Scenario Outline: Track progress through complete round
  Given I start a new round
  When I answer <correct_count> letters correctly
  Then I should have answered <correct_count> letters
  And I should be on letter <next_letter> of 10
  And my current score should be <correct_count>

  Examples:
    | correct_count | next_letter |
    | 1             | 2           |
    | 3             | 4           |
    | 5             | 6           |
    | 9             | 10          |
    | 10            | complete    |
```

## Scenario: Time Calculation Accuracy

```gherkin
Scenario: Accurately measure round duration
  Given I start a new round
  And the start time is recorded as T1
  When I answer all 10 letters correctly
  And the end time is recorded as T2
  Then the duration should be calculated as (T2 - T1)
  And the duration should be converted to seconds
  And the result should be rounded to whole seconds
  And the time should be displayed in ResultsScene
  And the time should be reasonable (between 10 and 300 seconds)
```

## Scenario: Handle Rapid Clicking

```gherkin
Scenario: Prevent issues with rapid button clicks
  Given I am on a letter in the round
  When I click the correct answer rapidly multiple times
  Then only the first click should be registered
  And I should advance only once to the next letter
  And the score should increase by exactly 1
  And subsequent clicks should be ignored during transition
```

## Scenario: Letter Sequence Randomness

```gherkin
Scenario: Generate random letter sequences
  Given I start round 1
  And the letter sequence is stored
  When I complete round 1 and start round 2
  Then round 2 should have a different letter sequence
  And the letters should be randomly selected
  And letters can potentially repeat within a round
  And all letters should be from A-Z
```

## Scenario: Results Data Integrity

```gherkin
Scenario: Correctly pass data between scenes
  Given I complete a round
  And my score is 7 out of 10
  And my time is 58 seconds
  When the transition to ResultsScene occurs
  Then ResultsScene should receive score: 7
  And ResultsScene should receive totalLetters: 10
  And ResultsScene should receive timeSeconds: 58
  And all data should be preserved during transition
  And the data should display correctly on screen
```

## Scenario: Object Cleanup

```gherkin
Scenario: Properly destroy and recreate game objects
  Given I am on letter 3 of 10
  And a letter is displayed on screen
  When I answer correctly and advance to letter 4
  Then the previous letter text should be destroyed
  And the previous progress text should be destroyed
  And new letter text should be created
  And new progress text should be created
  And no duplicate objects should exist
  And memory should not leak over multiple rounds
```

## Scenario: Round State Reset

```gherkin
Scenario: Reset all state variables for new round
  Given I completed a previous round
  And the state has score: 8, index: 10
  When I click "Play Again"
  And a new round starts
  Then currentLetterIndex should reset to 0
  And correctAnswers should reset to 0
  And roundInProgress should be set to true
  And a new roundStartTime should be recorded
  And a new letter sequence should be generated
  And no state should carry over from previous round
```

## Acceptance Criteria

### Round Flow
- [ ] New round generates 10 random letters
- [ ] Letters display sequentially, one at a time
- [ ] Progress indicator shows current position (X of 10)
- [ ] Correct answers advance to next letter
- [ ] Incorrect answers keep player on same letter
- [ ] Round ends after 10th correct answer
- [ ] Transition to results happens automatically

### Results Display
- [ ] Score displays as "X out of 10"
- [ ] Time displays in seconds
- [ ] Performance message matches score percentage
- [ ] "Play Again" button is visible and centered
- [ ] Perfect score triggers star celebration
- [ ] All text is readable and properly positioned

### Button Interactions
- [ ] "Play Again" button shows hover effect
- [ ] Cursor changes to pointer on hover
- [ ] Button scales up (1.1x) on hover
- [ ] Button scales down (0.95x) on click
- [ ] Click sound plays on button press
- [ ] Button returns to LetterPopScene

### Data Management
- [ ] Score tracked accurately throughout round
- [ ] Time calculated correctly (end - start)
- [ ] Data passed successfully to ResultsScene
- [ ] ResultsScene receives all required data
- [ ] Data displays match actual performance

### State Management
- [ ] Round state initializes correctly
- [ ] State updates on each correct answer
- [ ] State resets completely for new round
- [ ] No state pollution between rounds
- [ ] Memory management prevents leaks

### Technical Requirements
- [ ] No console errors during gameplay
- [ ] No console errors during scene transitions
- [ ] Objects destroyed properly to prevent leaks
- [ ] Animations smooth and performant
- [ ] Multiple rounds work without issues

## Edge Cases to Test

```gherkin
Scenario: All Answers Incorrect (Stay on Letters)
  Given I am on letter 1 of 10
  When I answer incorrectly 5 times
  Then I should still be on letter 1 of 10
  And my score should still be 0
  And the round should not end
  And I can eventually answer correctly to advance

Scenario: Perfect Round (All Correct First Try)
  Given I start a new round
  When I answer all 10 letters correctly on first try
  Then my score should be 10 out of 10
  And the celebration should appear
  And the performance message should be "Perfect! Amazing work!"

Scenario: Minimum Score Round
  Given I answer many letters incorrectly before getting them right
  When I eventually complete all 10 letters
  Then the round should still end normally
  And my score should be 10 out of 10
  And my time should be higher than average

Scenario: Fast Completion
  Given I am very quick at answering
  When I complete a round in under 15 seconds
  Then the time should display accurately (e.g., "12 seconds")
  And the round should complete normally

Scenario: Slow Completion
  Given I take a long time between letters
  When I complete a round in over 2 minutes
  Then the time should display accurately (e.g., "145 seconds")
  And the round should complete normally

Scenario: Scene Transition During Transition
  Given I am transitioning from LetterPopScene to ResultsScene
  When the transition is in progress
  Then no additional clicks should interrupt
  And the transition should complete normally
  And data should not be corrupted

Scenario: Rapid Play Again Clicks
  Given I am on the ResultsScene
  When I rapidly click "Play Again" multiple times
  Then only one scene transition should occur
  And the game should not crash or duplicate scenes
  And the new round should start normally
```

## Manual Testing Checklist

### Initial Setup
1. [ ] Open game in browser
2. [ ] Navigate to LetterPopScene
3. [ ] Verify console shows no errors
4. [ ] Verify first letter displays

### Round Progression
5. [ ] Answer first letter correctly
6. [ ] Verify correct sound plays
7. [ ] Verify advances to letter 2
8. [ ] Answer a letter incorrectly
9. [ ] Verify incorrect sound plays
10. [ ] Verify stays on same letter
11. [ ] Answer correctly to advance
12. [ ] Continue through letters 3-9
13. [ ] Verify progress indicator updates each time

### Round Completion
14. [ ] Answer letter 10 correctly
15. [ ] Verify round ends
16. [ ] Wait for transition (1 second)
17. [ ] Verify ResultsScene appears

### Results Screen
18. [ ] Check score displays correctly
19. [ ] Count your correct answers manually
20. [ ] Verify score matches reality
21. [ ] Check time is reasonable
22. [ ] Verify performance message matches score
23. [ ] Check "Play Again" button visible

### Button Interactions
24. [ ] Hover over button
25. [ ] Verify cursor changes
26. [ ] Verify button scales up
27. [ ] Move cursor away
28. [ ] Verify button scales back
29. [ ] Click button
30. [ ] Verify click sound
31. [ ] Verify returns to LetterPopScene

### New Round
32. [ ] Verify new letter sequence
33. [ ] Compare to previous sequence
34. [ ] Verify progress shows "Letter 1 of 10"
35. [ ] Verify score reset to 0
36. [ ] Play complete round again

### Perfect Score Test
37. [ ] Play a round answering all correctly on first try
38. [ ] Verify score is 10/10
39. [ ] Verify celebration stars appear
40. [ ] Verify "Perfect! Amazing work!" message

### Stress Test
41. [ ] Play 5 rounds in a row
42. [ ] Verify no slowdown
43. [ ] Verify no memory issues
44. [ ] Check browser console for errors
45. [ ] Verify each round works correctly

### Edge Cases
46. [ ] Answer letter incorrectly 10 times before correct
47. [ ] Verify game doesn't break
48. [ ] Complete round very quickly (speedrun)
49. [ ] Complete round very slowly (take your time)
50. [ ] Verify all timing scenarios work

## Performance Testing

```gherkin
Scenario: Memory Leak Prevention
  Given I play 10 rounds consecutively
  When I check browser memory usage
  Then memory should not continuously increase
  And game objects should be properly destroyed
  And performance should remain consistent

Scenario: Animation Performance
  Given I am on the ResultsScene
  When the celebration animation plays
  Then the framerate should remain smooth (>30fps)
  And the animation should not block other interactions
  And the button should remain clickable during animation

Scenario: Scene Transition Performance
  Given I click "Play Again"
  When the scene transition occurs
  Then the transition should complete in under 500ms
  And there should be no visible lag or freezing
  And the new scene should render immediately
```

## Accessibility Testing

```gherkin
Scenario: Visual Clarity
  Given I am playing a round
  Then all text should be clearly readable
  And the progress indicator should be obvious
  And the current letter should be prominent
  And colors should have sufficient contrast

Scenario: Touch Device Support
  Given I am using a tablet or mobile device
  When I tap letters to answer
  And I tap the "Play Again" button
  Then all interactions should work with touch
  And hover effects should not break touch interactions
  And buttons should be large enough for touch targets

Scenario: Audio Feedback Reliability
  Given the game is running
  When I answer letters correctly or incorrectly
  Then audio feedback should play consistently
  And if audio fails, visual feedback should still work
  And the game should not crash due to audio issues
```

## Success Criteria

**This phase is complete when:**
1. Complete round of 10 letters can be played start to finish
2. Score tracked accurately (correct answers out of 10)
3. Time tracked and displayed in seconds
4. ResultsScene displays all required information
5. Performance message matches score
6. "Play Again" button works and restarts game
7. Multiple rounds can be played consecutively
8. Perfect scores trigger celebration effect
9. All interactions have proper feedback
10. No console errors during any gameplay
11. Memory management prevents leaks
12. State resets properly between rounds
13. ADHD-friendly design maintained throughout
14. Tested thoroughly with all scenarios
15. Ready to add difficulty levels in Phase 13

## Notes

**Focus on Complete Loop**
- This phase is about end-to-end gameplay
- Every part must work together seamlessly
- State management is critical for replay
- Data integrity between scenes is essential

**Testing Priority**
- Play multiple rounds back-to-back
- Test both perfect and imperfect scores
- Verify time calculation accuracy
- Ensure no memory leaks
- Confirm state resets properly

**ADHD Design Validation**
- Clear progress indicators reduce anxiety
- Immediate replay maintains engagement
- No penalties for wrong answers
- Encouraging messages build confidence
- Fixed round length is manageable
- Visual and audio feedback on every action

**What Makes This Phase Critical**
- First fully playable, replayable game loop
- Foundation for difficulty levels (Phase 13+)
- Template for other mini-games
- Proof of complete gameplay concept
- Establishes quality bar for future phases
