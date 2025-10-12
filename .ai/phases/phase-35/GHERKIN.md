# Phase 35: Memory Match - Matching Logic - BDD Scenarios

## Feature: Match Detection

```gherkin
Feature: Card Match Detection
  As the game
  I want to detect when two flipped cards match
  So that I can keep matched cards revealed or flip mismatches back

Background:
  Given MemoryMatchScene is active
  And 12 cards are displayed with letter pairs
  And the card flip mechanic from Phase 34 is working
```

## Scenario: Check for Match

```gherkin
Scenario: Compare two flipped cards
  Given two cards are face-up
  And flippedCards array contains [card1, card2]
  And card1 has letter "A"
  And card2 has letter "A"
  When checkForMatch() is called
  Then card1.cardData.letter should be compared to card2.cardData.letter
  And the result should be true (match)
  And the console should log "Match check: MATCH"
```

## Scenario: Detect Matching Cards

```gherkin
Scenario: Two cards with same letter match
  Given card 1 displays letter "T"
  And card 2 displays letter "T"
  When checkForMatch() compares the letters
  Then isMatch should be true
  And handleMatch() should be called
```

## Scenario: Detect Non-Matching Cards

```gherkin
Scenario: Two cards with different letters don't match
  Given card 1 displays letter "T"
  And card 2 displays letter "A"
  When checkForMatch() compares the letters
  Then isMatch should be false
  And handleMismatch() should be called
```

## Feature: Handle Matches

```gherkin
Feature: Process Matching Cards
  As the game
  I want to keep matching cards revealed
  So that players can see their progress

Background:
  Given two flipped cards match
```

## Scenario: Mark Cards as Matched

```gherkin
Scenario: Matching cards stay revealed
  Given card1 has letter "M"
  And card2 has letter "M"
  And both cards are face-up
  When handleMatch() is called
  Then there should be a 300ms delay
  And card1.setMatched() should be called
  And card2.setMatched() should be called
  And card1.matched should be true
  And card2.matched should be true
  And card1 should fade to alpha 0.7
  And card2 should fade to alpha 0.7
  And both cards should be disabled (non-interactive)
```

## Scenario: Track Matched Cards

```gherkin
Scenario: Add matched cards to tracking array
  Given two cards match
  When handleMatch() processes them
  Then both cards should be added to matchedCards array
  And matchedCards.length should increase by 2
  And the cards should remain in matchedCards permanently
```

## Scenario: Increment Match Counter

```gherkin
Scenario: Match count increases when pair found
  Given matchCount is 0
  And totalPairs is 6
  When a matching pair is found
  Then matchCount should increment to 1
  And updateMatchesDisplay() should be called
  And the display should show "Matches: 1/6"
```

## Scenario: Play Success Sound

```gherkin
Scenario: Audio feedback for match
  Given two cards match
  When handleMatch() is called
  Then 'match-success' sound should play
  And the volume should be 0.5
  And the sound should play after 300ms delay
```

## Scenario: Trigger Match Celebration

```gherkin
Scenario: Visual celebration for match
  Given card1 is at position (220, 150)
  And card2 is at position (340, 150)
  When handleMatch() is called
  Then triggerMatchCelebration(220, 150) should be called
  And triggerMatchCelebration(340, 150) should be called
  And a star animation should appear at each position
  And particle effects should burst at each position
  And the celebration duration should be approximately 600ms
```

## Scenario: Clear Flipped Cards After Match

```gherkin
Scenario: Reset flipped cards array
  Given flippedCards contains 2 cards
  When handleMatch() completes
  Then flippedCards array should be cleared
  And flippedCards.length should be 0
  And the cards should remain in matchedCards instead
```

## Scenario: Re-enable Input After Match

```gherkin
Scenario: Player can flip more cards
  Given a match was just processed
  And the round is not complete
  When handleMatch() finishes
  Then canFlip should be set to true
  And the player should be able to click more cards
```

## Feature: Handle Mismatches

```gherkin
Feature: Process Non-Matching Cards
  As the game
  I want to flip mismatched cards back
  So that players can try again

Background:
  Given two flipped cards do not match
```

## Scenario: Play Mismatch Sound

```gherkin
Scenario: Gentle audio feedback for mismatch
  Given card1 has letter "A"
  And card2 has letter "B"
  When handleMismatch() is called
  Then 'card-mismatch' sound should play
  And the volume should be 0.3 (lower than success)
  And the sound should be gentle, not harsh
  And the sound should play immediately
```

## Scenario: Delay Before Flipping Back

```gherkin
Scenario: Give player time to memorize
  Given two cards do not match
  When handleMismatch() is called
  Then the game should wait 1000ms
  And the cards should remain face-up during the wait
  And canFlip should remain false during the wait
  And the player should not be able to flip other cards
```

## Scenario: Flip Mismatched Cards Back

```gherkin
Scenario: Return cards to face-down state
  Given 1000ms have elapsed after mismatch
  And card1 is face-up
  And card2 is face-up
  When the delay completes
  Then card1.flip(false) should be called
  And card2.flip(false) should be called
  And both cards should animate back to face-down
  And the flip animation should take 300ms each
```

## Scenario: Clear Flipped Cards After Mismatch

```gherkin
Scenario: Reset for next attempt
  Given two cards flipped back after mismatch
  When the flip-back animation completes
  Then flippedCards array should be cleared
  And flippedCards.length should be 0
```

## Scenario: Re-enable Input After Mismatch

```gherkin
Scenario: Player can try again
  Given cards have flipped back after mismatch
  When 300ms have elapsed (flip animation time)
  Then canFlip should be set to true
  And the player should be able to click cards again
```

## Scenario: Mismatch Timing

```gherkin
Scenario: Total mismatch flow takes appropriate time
  Given two cards mismatch at time T
  Then at time T+0ms mismatch sound plays
  And at time T+1000ms cards start flipping back
  And at time T+1300ms cards are face-down
  And at time T+1300ms input is re-enabled
  And total delay is approximately 1.3 seconds
```

## Feature: Match Progress Tracking

```gherkin
Feature: Track Game Progress
  As the game
  I want to track how many pairs have been found
  So that I can determine when the round is complete

Background:
  Given MemoryMatchScene is active
  And totalPairs is 6
```

## Scenario: Initial State

```gherkin
Scenario: Game starts with zero matches
  Given the scene has just loaded
  Then matchCount should be 0
  And matchedCards array should be empty
  And the display should show "Matches: 0/6"
```

## Scenario: Update Display After Each Match

```gherkin
Scenario Outline: Counter updates correctly
  Given matchCount is <before>
  When a new match is found
  Then matchCount should be <after>
  And the display should show "Matches: <after>/6"
  And the counter text should animate (scale pulse)

  Examples:
    | before | after |
    | 0      | 1     |
    | 1      | 2     |
    | 2      | 3     |
    | 3      | 4     |
    | 4      | 5     |
    | 5      | 6     |
```

## Scenario: Counter Animation

```gherkin
Scenario: Visual feedback for counter update
  Given matchCount increases
  When updateMatchesDisplay() is called
  Then the counter text should be updated
  And a scale tween should animate the text
  And the text should scale from 1.2 to 1.0
  And the animation duration should be 200ms
  And the easing should be 'Back.easeOut'
```

## Feature: Round Completion

```gherkin
Feature: Detect and Celebrate Game Completion
  As the game
  I want to detect when all pairs are matched
  So that I can congratulate the player

Background:
  Given MemoryMatchScene is active
  And 5 pairs have already been matched
  And matchCount is 5
```

## Scenario: Detect Round Complete

```gherkin
Scenario: Sixth pair triggers completion
  Given matchCount is 5
  When the sixth pair is matched
  Then matchCount should become 6
  And matchCount >= totalPairs should be true
  And handleRoundComplete() should be called
```

## Scenario: Disable Input on Completion

```gherkin
Scenario: No more flips after completion
  Given all 6 pairs are matched
  When handleRoundComplete() is called
  Then canFlip should be set to false
  And no cards should be clickable
  And the game should enter completion state
```

## Scenario: Play Victory Sound

```gherkin
Scenario: Audio celebration for completion
  When handleRoundComplete() is called
  Then 'round-complete' sound should play
  And the volume should be 0.6
  And the sound should be celebratory and positive
```

## Scenario: Trigger Victory Celebration

```gherkin
Scenario: Large visual celebration
  Given the round is complete
  When triggerVictoryCelebration() is called
  Then 5 confetti bursts should occur
  And bursts should be staggered by 200ms
  And confetti should appear at random X positions (200-600)
  And confetti should come from top of screen (y: 0)
  And each burst should have 30 particles
```

## Scenario: Pulse All Matched Cards

```gherkin
Scenario: All cards celebrate together
  Given all 12 cards are matched
  When triggerVictoryCelebration() is called
  Then all cards should pulse
  And card scale should tween to 1.1
  And card alpha should tween to 1.0 (from 0.7)
  And the tween duration should be 500ms
  And the tween should yoyo
  And the tween should repeat 2 times
```

## Scenario: Show Completion Message

```gherkin
Scenario: Display encouraging message
  Given the round is complete
  When showCompletionMessage() is called
  Then a random message should be selected from:
    | Message                              |
    | "Amazing! You found them all!"       |
    | "Great memory! All matched!"         |
    | "Fantastic! You're a memory master!" |
    | "Wonderful! Perfect matches!"        |
  And the message should be displayed at (400, 250)
  And the message should be centered (origin 0.5)
  And the message fontSize should be "48px"
  And the message color should be gold (#FFD700)
  And the message should have dark stroke (#2c3e50, 6px)
  And the message should fade in from alpha 0 to 1
  And the message should scale from 0.5 to 1.2
  And the fade duration should be 600ms
```

## Scenario: Pulse Completion Message

```gherkin
Scenario: Message pulsates to draw attention
  Given the completion message is displayed
  When the fade-in completes
  Then a pulse animation should start
  And the scale should tween from 1.2 to 1.3
  And the duration should be 800ms
  And the tween should yoyo
  And the tween should repeat infinitely (-1)
  And the easing should be 'Sine.easeInOut'
```

## Feature: Replay Options

```gherkin
Feature: Allow Player to Replay or Exit
  As a player
  I want options after completing the round
  So that I can play again or return to menu

Background:
  Given the round is complete
  And the victory celebration has played
  And the completion message is displayed
```

## Scenario: Show Replay Buttons

```gherkin
Scenario: Display action buttons
  Given 2 seconds have elapsed after completion
  When showReplayOptions() is called
  Then a "Play Again" button should appear
  And a "Main Menu" button should appear
  And both buttons should fade in
  And both buttons should animate upward
```

## Scenario: Play Again Button

```gherkin
Scenario: Restart the game
  Given the "Play Again" button is displayed
  And the button text is "Play Again"
  And the button is at position (400, 380)
  And the button has green background (#27ae60)
  And the button fontSize is "36px"
  When the player hovers over the button
  Then the button should scale to 1.1
  When the player clicks the button
  Then 'click-sound' should play
  And the camera should fade out (300ms)
  And the scene should restart
  And a new shuffled deck should appear
  And the match counter should reset to 0/6
```

## Scenario: Main Menu Button

```gherkin
Scenario: Return to main menu
  Given the "Main Menu" button is displayed
  And the button text is "Main Menu"
  And the button is at position (400, 450)
  And the button has red background (#e74c3c)
  And the button fontSize is "28px"
  When the player hovers over the button
  Then the button should scale to 1.1
  When the player clicks the button
  Then 'click-sound' should play
  And the camera should fade out (300ms)
  And the scene should transition to MainMenu
```

## Scenario: Button Animations

```gherkin
Scenario: Buttons animate in smoothly
  Given showReplayOptions() is called
  When "Play Again" button is created
  Then it should start at alpha 0
  And it should tween to alpha 1
  And it should move from y:400 to y:380
  And the duration should be 400ms
  And the easing should be 'Back.easeOut'
  When "Main Menu" button is created
  Then it should start at alpha 0
  And it should tween to alpha 1 with 100ms delay
  And it should move from y:460 to y:450
  And the duration should be 400ms
```

## Acceptance Criteria

### Match Detection
- [ ] checkForMatch() method exists
- [ ] Compares cardData.letter of both cards
- [ ] Returns true for matching letters
- [ ] Returns false for different letters
- [ ] Calls handleMatch() for matches
- [ ] Calls handleMismatch() for mismatches
- [ ] Logs comparison results to console

### Match Handling
- [ ] handleMatch() waits 300ms before processing
- [ ] Both cards marked as matched
- [ ] Both cards fade to alpha 0.7
- [ ] Cards added to matchedCards array
- [ ] matchCount increments
- [ ] Counter display updates
- [ ] Success sound plays (volume 0.5)
- [ ] Particles trigger at both card positions
- [ ] flippedCards array cleared
- [ ] canFlip re-enabled if more pairs remain
- [ ] Round completion checked

### Mismatch Handling
- [ ] handleMismatch() plays gentle sound
- [ ] Mismatch sound volume is 0.3
- [ ] 1000ms delay before flip-back
- [ ] Both cards flip face-down
- [ ] Flip animation is smooth
- [ ] flippedCards array cleared
- [ ] 300ms delay after flip-back
- [ ] canFlip re-enabled
- [ ] Player can continue playing

### Progress Tracking
- [ ] matchCount starts at 0
- [ ] matchCount increments on each match
- [ ] Display shows "Matches: X/6"
- [ ] Counter animates on update
- [ ] Scale pulse from 1.2 to 1.0
- [ ] Animation duration 200ms
- [ ] Easing is 'Back.easeOut'

### Round Completion
- [ ] Detected when matchCount >= 6
- [ ] handleRoundComplete() called
- [ ] canFlip set to false
- [ ] Victory sound plays (volume 0.6)
- [ ] Victory celebration triggers
- [ ] 5 confetti bursts
- [ ] Bursts staggered by 200ms
- [ ] All matched cards pulse
- [ ] Completion message displays
- [ ] Message is random from pool
- [ ] Message fades in and scales
- [ ] Message pulses infinitely

### Replay Options
- [ ] Buttons appear after 2 seconds
- [ ] "Play Again" button functional
- [ ] "Main Menu" button functional
- [ ] Buttons hover at scale 1.1
- [ ] Buttons animate in smoothly
- [ ] Play Again restarts scene
- [ ] Main Menu transitions correctly
- [ ] Click sound plays on button press
- [ ] Camera fades before transition

### Visual Quality
- [ ] Match celebrations are satisfying
- [ ] Mismatch feedback is gentle
- [ ] Victory celebration is impressive
- [ ] All animations are smooth
- [ ] No visual glitches
- [ ] Text is readable and styled well
- [ ] Colors are appropriate and pleasant

### Performance
- [ ] 60fps maintained throughout
- [ ] No lag during celebrations
- [ ] Particles don't cause slowdown
- [ ] Memory is managed properly
- [ ] No console errors or warnings

## Edge Cases to Test

```gherkin
Scenario: First Two Flips are a Match
  Given no cards have been flipped yet
  When the player flips two matching cards
  Then the match should be detected correctly
  And the match counter should show "Matches: 1/6"
  And the player can continue

Scenario: All Cards Match on First Tries
  Given the player has perfect memory
  When all 6 pairs are found without mistakes
  Then matchCount should reach 6
  And round complete should trigger
  And the victory celebration should play

Scenario: Many Mismatches Before Match
  Given the player flips 10 pairs of mismatches
  When finally a match is found
  Then the match should be detected correctly
  And the celebration should play normally
  And the game should continue

Scenario: Last Pair Completion
  Given 5 pairs are already matched
  And matchCount is 5
  When the final pair is matched
  Then matchCount should become 6
  And the round complete should trigger immediately
  And the victory sequence should play

Scenario: Rapid Button Clicking After Complete
  Given the round is complete
  And buttons are displayed
  When the player rapidly clicks multiple buttons
  Then only the first click should register
  And only one transition should occur
  And no errors should occur

Scenario: Scene Restart Clears State
  Given a round is complete
  When the player clicks "Play Again"
  Then matchCount should reset to 0
  And matchedCards should be empty
  And flippedCards should be empty
  And all cards should be face-down
  And a new shuffled deck should appear
```

## Manual Testing Checklist

### Match Testing
1. [ ] Start MemoryMatchScene
2. [ ] Flip two matching cards
3. [ ] Verify match detected
4. [ ] Verify success sound plays
5. [ ] Verify particles appear
6. [ ] Verify cards stay revealed
7. [ ] Verify cards fade to 70%
8. [ ] Verify counter updates
9. [ ] Verify can flip more cards

### Mismatch Testing
10. [ ] Flip two non-matching cards
11. [ ] Verify mismatch sound plays
12. [ ] Verify 1-second delay
13. [ ] Verify cards flip back
14. [ ] Verify can flip again

### Progress Testing
15. [ ] Find multiple pairs in sequence
16. [ ] Verify counter updates each time
17. [ ] Verify counter animates
18. [ ] Verify progress tracked correctly

### Completion Testing
19. [ ] Find all 6 pairs
20. [ ] Verify victory celebration
21. [ ] Verify confetti bursts
22. [ ] Verify cards pulse
23. [ ] Verify message appears
24. [ ] Verify message pulses
25. [ ] Wait 2 seconds
26. [ ] Verify buttons appear

### Replay Testing
27. [ ] Hover over "Play Again"
28. [ ] Verify scale effect
29. [ ] Click "Play Again"
30. [ ] Verify scene restarts
31. [ ] Verify new shuffled cards
32. [ ] Complete round again
33. [ ] Click "Main Menu"
34. [ ] Verify returns to menu

### Timing Verification
35. [ ] Time match delay (should be 300ms)
36. [ ] Time mismatch delay (should be 1000ms)
37. [ ] Time flip-back (should be 300ms)
38. [ ] Verify timing feels comfortable

## Success Criteria

**This phase is complete when:**
1. Match detection works accurately
2. Matches keep cards revealed
3. Mismatches flip cards back
4. 1-second mismatch delay feels right
5. Progress tracked correctly
6. Round completion detected
7. Victory celebration is impressive
8. Replay options work correctly
9. All acceptance criteria met
10. No console errors
11. 60fps performance
12. Ready for Phase 36 (polish)

## Notes

**Phase 35 Scope**
- Core game logic complete
- Full memory game playable
- Match and mismatch paths working
- Round completion and replay functional

**ADHD Considerations**
- 1-second delay perfect for memorization
- Immediate match feedback
- Clear progress tracking
- Rewarding celebrations
- Easy replay option

**Testing Priority**
- Match detection accuracy
- Timing feels appropriate
- Celebrations are satisfying
- State management is solid
- Replay flow is smooth
