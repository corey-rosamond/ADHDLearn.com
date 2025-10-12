# Phase 25: Word Catch - Collision Detection - BDD Scenarios

## Feature: Collision Detection and Catch Feedback

```gherkin
Feature: Word Catch Collision Detection
  As Aurora (the player)
  I want to catch falling words with my character
  So that I can learn sight words through interactive gameplay

Background:
  Given the Word Catch scene is loaded
  And the character is on screen at position (400, 500)
  And words are spawning and falling
  And the collision system is active
```

## Scenario: Basic Word Catch

```gherkin
Scenario: Successfully catch a falling word
  Given a word "cat" is falling at position (400, 300)
  And the character is at position (400, 500)
  When the word touches the character
  Then the word should be marked as caught
  And a particle effect should appear at the catch position
  And the word audio "cat" should play
  And the word should fade out and disappear
  And the caught word should be added to the tracking array
  And the console should log "Caught: cat"

Scenario: Word passes by without collision
  Given a word "dog" is falling at position (200, 300)
  And the character is at position (600, 500)
  When the word reaches position (200, 600)
  Then the word should pass by the character
  And no collision should be detected
  And no particle effect should appear
  And no audio should play
  And the word should continue falling
  And the word should be removed when off-screen

Scenario: Character moves to catch word
  Given a word "run" is falling at position (300, 200)
  And the character is at position (500, 500)
  When the player moves the character to position (300, 500)
  And the word reaches the character
  Then collision should be detected
  And the catch sequence should trigger
  And all feedback systems should activate
```

## Scenario: Collision Detection Accuracy

```gherkin
Scenario: Catch word with center of character
  Given a word "jump" is falling at position (400, 300)
  And the character center is at position (400, 500)
  When the word overlaps the character center
  Then collision should be detected immediately
  And catch should be processed successfully

Scenario: Catch word with left edge of character
  Given a word "play" is falling at position (355, 300)
  And the character left edge is at position (350, 500)
  When the word overlaps the character's left edge
  Then collision should be detected
  And catch should be processed successfully
  And feedback should appear at word position

Scenario: Catch word with right edge of character
  Given a word "stop" is falling at position (445, 300)
  And the character right edge is at position (450, 500)
  When the word overlaps the character's right edge
  Then collision should be detected
  And catch should be processed successfully

Scenario: Word just misses character
  Given a word "miss" is falling at position (500, 300)
  And the character right edge is at position (450, 500)
  When the word passes at position (500, 500)
  Then no collision should be detected
  And the word should continue falling
  And no catch feedback should appear
```

## Scenario: Particle Effects

```gherkin
Scenario: Particle effect on catch
  Given a word "star" is caught at position (350, 450)
  When the catch is processed
  Then a particle emitter should spawn at (350, 450)
  And 12 particles should explode outward
  And particles should be gold/yellow colored
  And particles should spread 360 degrees
  And particles should have gravity effect
  And particles should fade out over 400ms
  And particles should be cleaned up after 500ms

Scenario: Particle effect during rapid catches
  Given 3 words are caught in 2 seconds
  When each word is caught
  Then each should have its own particle effect
  And particle effects should not interfere with each other
  And all particles should render smoothly
  And frame rate should remain at 60fps

Scenario: Particle effect visual quality
  Given a word is caught
  When particles spawn
  Then particles should start at scale 0.8
  And should scale down to 0
  And should start at alpha 1.0
  And should fade to alpha 0
  And should use additive blend mode for glow effect
  And should be visually appealing and rewarding
```

## Scenario: Audio Feedback

```gherkin
Scenario: Word audio plays on catch
  Given a word "hello" with loaded audio is caught
  When the catch is processed
  Then the word audio "hello" should play
  And audio should start within 50ms
  And audio volume should be 0.8
  And audio should be clear and pleasant

Scenario: Missing audio handled gracefully
  Given a word "test" without audio is caught
  When the catch is processed
  Then the game should not crash
  And a warning should log to console
  And visual feedback should still appear
  And the game should continue normally

Scenario: Multiple catches with audio
  Given 3 words are caught rapidly
  When each word audio tries to play
  Then all audio should play
  And audio should not clip harshly
  And audio should mix reasonably
  And no audio stuttering should occur

Scenario: Audio timing is immediate
  Given a word is caught
  When the collision is detected
  Then audio should start within 50ms
  And should feel immediate and responsive
  And should clearly correlate with catch action
```

## Scenario: Word Removal

```gherkin
Scenario: Caught word animates out
  Given a word is caught at position (300, 400)
  When the catch is processed
  Then the word should scale from 1.0 to 1.3
  And the word should fade from alpha 1.0 to 0
  And the animation should take 200ms
  And the word should use Power2 easing
  And the word sprite should be destroyed after animation

Scenario: Word disabled immediately on catch
  Given a word is caught
  When the collision is detected
  Then the word should be marked inactive immediately
  And the word physics should be disabled
  And the word should not trigger collision again
  And the word should not respond to further input

Scenario: Word text removed with sprite
  Given a word with text label is caught
  When the word is destroyed
  Then both the word sprite should be destroyed
  And the text label should be destroyed
  And no orphaned text should remain on screen
  And no memory leaks should occur
```

## Scenario: Catch Tracking

```gherkin
Scenario: Caught word added to tracking array
  Given the caughtWords array is empty
  When a word "tree" is caught
  Then the caughtWords array should have 1 entry
  And the entry should contain word: "tree"
  And the entry should contain a timestamp
  And the entry should contain wasTarget: false
  And the entry should contain position {x, y}
  And the console should log the catch

Scenario: Multiple catches tracked
  Given 0 words have been caught
  When I catch "dog"
  And I catch "cat"
  And I catch "run"
  Then the caughtWords array should have 3 entries
  And currentRoundCatches should equal 3
  And all catches should be logged in order

Scenario: Catch data includes all fields
  Given a word "jump" is caught at position (350, 450)
  When the catch is tracked
  Then the catch data should include:
    | Field      | Value       |
    | word       | "jump"      |
    | timestamp  | current time|
    | wasTarget  | false       |
    | position.x | 350         |
    | position.y | 450         |
    | round      | 1           |
```

## Scenario: Multiple Catches

```gherkin
Scenario: Catch multiple words in succession
  Given 5 words are falling
  When I catch all 5 words rapidly
  Then each word should be caught successfully
  And each should have visual feedback
  And each should have audio feedback
  And all 5 should be tracked
  And no catches should be missed
  And frame rate should stay at 60fps

Scenario: Two overlapping words
  Given two words are overlapping at position (400, 300)
  And both touch the character simultaneously
  When collision is detected
  Then only one word should be caught
  And the caught word should be the first detected
  And the second word should continue falling
  And can be caught separately afterward

Scenario: Prevent double-catching same word
  Given a word "test" is caught
  And the word is animating out
  When the character touches the word again during animation
  Then no second catch should be registered
  And no duplicate particle effect should appear
  And no duplicate audio should play
  And the word should only appear once in tracking array
```

## Scenario: Edge Cases

```gherkin
Scenario: Catch word at bottom of screen
  Given a word is falling at position (400, 580)
  And the character is at position (400, 590)
  When the word touches the character near screen bottom
  Then collision should still be detected
  And catch should process normally
  And all feedback should appear
  And word should be removed before going off-screen

Scenario: Catch word at screen edge
  Given a word is falling at position (50, 300)
  And the character is at position (50, 500)
  When the word reaches the character at screen left edge
  Then collision should be detected
  And catch should process correctly
  And particles should render on-screen
  And audio should play normally

Scenario: Character moving during catch
  Given a word is falling at position (400, 300)
  And the character is moving from (350, 500) to (450, 500)
  When the word intersects the moving character
  Then collision should be detected mid-movement
  And catch should process successfully
  And feedback should appear at collision point

Scenario: Rapid left-right movement
  Given words are falling
  And the player rapidly moves character left and right
  When words are caught during rapid movement
  Then all catches should be detected
  And all feedback should appear correctly
  And no visual glitches should occur
  And no collision bugs should appear
```

## Scenario: Performance

```gherkin
Scenario: Performance with multiple words
  Given 5 words are on screen simultaneously
  When all words are falling
  And I catch all 5 rapidly
  Then frame rate should remain at 60fps
  And no frame drops should occur
  And all animations should be smooth
  And all particles should render correctly

Scenario: Memory management
  Given 20 words have been caught and removed
  When I check memory usage
  Then memory should not continuously increase
  And all destroyed words should be garbage collected
  And all particle emitters should be cleaned up
  And no memory leaks should exist

Scenario: Performance during extended play
  Given the game has been running for 5 minutes
  And 50+ words have been caught
  When I continue playing
  Then performance should be stable
  And frame rate should remain 60fps
  And no performance degradation should occur
  And memory usage should be stable

Scenario: Particle optimization
  Given particles are spawning on catches
  When 3 words are caught simultaneously
  Then all particle effects should render
  And frame rate should not drop below 55fps
  And particles should be optimized
  And particle count should be limited if needed
```

## Scenario: Collision System Reliability

```gherkin
Scenario: Consistent collision detection
  Given I play 10 rounds of Word Catch
  When I catch 100+ words total
  Then every valid collision should be detected
  And no false positives should occur (catching without touching)
  And no false negatives should occur (touching without catching)
  And collision should feel reliable and consistent

Scenario: Collision during spawn animation
  Given a word is spawning with scale animation
  When the character touches the word during spawn
  Then collision may or may not trigger (depending on implementation)
  And if triggered, should process normally
  And should not cause errors or glitches

Scenario: Collision hitbox is ADHD-friendly
  Given the character visual size is 80x100 pixels
  When testing collision boundaries
  Then the collision hitbox should be slightly larger (100x110)
  And should provide 10px padding around visual
  And should make catching easier and more satisfying
  And Aurora should be able to catch words comfortably
```

## Acceptance Criteria

### Must Have - Collision Detection
- [ ] Phaser overlap detection implemented correctly
- [ ] Collision detected when character touches word
- [ ] Collision hitbox slightly larger than visual (ADHD-friendly)
- [ ] Collision works at center, left edge, right edge of character
- [ ] Collision works at screen edges
- [ ] Collision works during character movement
- [ ] No false positives (catch without touching)
- [ ] No false negatives (touch without catching)

### Must Have - Visual Feedback
- [ ] Particle effect spawns at catch position
- [ ] 12 particles explode 360 degrees
- [ ] Particles are gold/yellow themed
- [ ] Particles have gravity and fade out
- [ ] Particle animation lasts 400ms
- [ ] Particles cleaned up after 500ms
- [ ] Particle effects are visually satisfying
- [ ] No particle rendering glitches

### Must Have - Audio Feedback
- [ ] Word audio plays when caught
- [ ] Audio starts within 50ms of catch
- [ ] Audio volume is appropriate (0.8)
- [ ] Missing audio handled gracefully (no crash)
- [ ] Multiple catches don't cause audio clipping
- [ ] Audio timing feels immediate and responsive

### Must Have - Word Removal
- [ ] Caught word marked inactive immediately
- [ ] Word physics disabled on catch
- [ ] Word animates out (scale up, fade)
- [ ] Animation takes 200ms with Power2 easing
- [ ] Word sprite destroyed after animation
- [ ] Word text destroyed with sprite
- [ ] No orphaned objects remain
- [ ] No memory leaks from word removal

### Must Have - Catch Tracking
- [ ] Caught words added to caughtWords array
- [ ] Each catch includes: word, timestamp, wasTarget, position, round
- [ ] currentRoundCatches increments on each catch
- [ ] Console logs each catch for debugging
- [ ] Catch history accessible for Phase 26

### Must Have - Edge Cases
- [ ] Double-catching prevented (same word caught once only)
- [ ] Two overlapping words handled (catch first only)
- [ ] Catch at bottom of screen works
- [ ] Catch at screen edges works
- [ ] Catch during rapid movement works
- [ ] Catch during spawn animation handled
- [ ] Words that fall off-screen cleaned up

### Must Have - Performance
- [ ] 60fps maintained with 5+ words on screen
- [ ] No frame drops during catches
- [ ] Smooth particle animations
- [ ] Memory stable over extended play
- [ ] No memory leaks detected
- [ ] All cleanup timers working correctly

## Edge Cases to Test

```gherkin
Scenario: Stress test - rapid consecutive catches
  Given 10 words spawn rapidly
  When I catch all 10 in under 5 seconds
  Then all catches should register
  And all feedback should appear
  And no catches should be missed
  And performance should remain stable
  And no visual or audio glitches

Scenario: Stress test - simultaneous catches
  Given 3 words are overlapping at same position
  When all 3 touch character simultaneously
  Then at least one should be caught
  And feedback should appear correctly
  And no crashes or errors should occur
  And remaining words should be catchable

Scenario: Collision at exact moment of scene transition
  Given a word is about to be caught
  When scene transition starts during collision
  Then should handle gracefully (either catch or cancel)
  And should not cause errors
  And should not leave orphaned objects

Scenario: Catch word with zero velocity (stationary)
  Given a word spawns but velocity is 0
  And the word is stationary on screen
  When character touches the stationary word
  Then collision should still be detected
  And catch should process normally
```

## Manual Testing Checklist

### Setup
1. [ ] Launch Word Catch scene
2. [ ] Verify character appears on screen
3. [ ] Verify words begin spawning
4. [ ] Open browser dev tools console
5. [ ] Check no errors on load

### Basic Collision Testing
6. [ ] Catch word with character center - verify works
7. [ ] Catch word with left edge - verify works
8. [ ] Catch word with right edge - verify works
9. [ ] Let word fall past character - verify no catch
10. [ ] Verify particle effect appears on catch
11. [ ] Verify word audio plays on catch
12. [ ] Verify word disappears after catch
13. [ ] Check console shows "Caught: [word]"

### Feedback Testing
14. [ ] Verify particles are gold/yellow
15. [ ] Count particles (should be ~12)
16. [ ] Verify particles fall with gravity
17. [ ] Verify particles fade out
18. [ ] Check audio timing (immediate, < 50ms)
19. [ ] Check audio volume (comfortable level)
20. [ ] Verify word scales up while fading

### Multiple Catch Testing
21. [ ] Catch 5 words rapidly (within 10 seconds)
22. [ ] Verify all 5 caught successfully
23. [ ] Check all particles rendered correctly
24. [ ] Check all audio played
25. [ ] Verify no double-catches occurred
26. [ ] Check FPS counter (should be 60fps)

### Edge Case Testing
27. [ ] Catch word at very bottom of screen
28. [ ] Catch word at left screen edge
29. [ ] Catch word at right screen edge
30. [ ] Try to catch word twice (should fail second time)
31. [ ] Catch word while moving left rapidly
32. [ ] Catch word while moving right rapidly
33. [ ] Catch two overlapping words

### Performance Testing
34. [ ] Monitor FPS with 5+ words on screen
35. [ ] Catch 10 words rapidly, check performance
36. [ ] Play for 3 minutes, check memory stable
37. [ ] Verify no performance degradation over time
38. [ ] Check particle cleanup (no lingering emitters)

### Tracking Testing
39. [ ] Catch 3 words
40. [ ] Check console - should log all 3 catches
41. [ ] Verify caughtWords array has 3 entries
42. [ ] Verify each entry has all required fields
43. [ ] Check timestamps are accurate

### Final Verification
44. [ ] No console errors throughout testing
45. [ ] All visual feedback clear and satisfying
46. [ ] All audio feedback appropriate
47. [ ] Collision feels reliable and responsive
48. [ ] Overall gameplay feels smooth
49. [ ] Ready for Phase 26 target word logic

## Success Criteria

**This phase is complete when:**

### Technical Excellence
1. Collision detection is 100% reliable
2. Visual feedback appears on every catch
3. Audio feedback plays on every catch (when available)
4. Caught words are properly tracked
5. Word removal is clean (no memory leaks)
6. Performance is stable at 60fps
7. All edge cases handled gracefully
8. No console errors or warnings

### User Experience
9. Collision feels responsive and immediate
10. Feedback is clear and satisfying
11. Hitbox is ADHD-friendly (easy to catch)
12. Particle effects are rewarding
13. Audio timing feels instant
14. Word removal animation is smooth
15. No frustration from missed collisions
16. Aurora enjoys catching words

### Code Quality
17. Code is well-organized and commented
18. No memory leaks
19. Proper cleanup of all objects
20. Efficient collision detection
21. Ready for Phase 26 integration
22. All acceptance criteria met

## Notes

**ADHD-Friendly Design Principles**
- Slightly generous hitboxes make success more likely
- Immediate feedback (< 50ms) maintains cause-effect clarity
- Particle effects are brief and rewarding, not distracting
- Audio is encouraging and clear
- No punishment for missing words (Phase 26)

**Performance is Critical**
- 60fps target ensures smooth gameplay
- Particle optimization prevents slowdown
- Proper cleanup prevents memory leaks
- Efficient collision detection is essential
- Target age requires smooth experience

**Foundation for Phase 26**
- Catch tracking includes wasTarget field (ready to use)
- Audio system can play different sounds (correct vs. incorrect)
- Particle system can have different effects (celebration vs. neutral)
- All data captured for round completion logic
- System designed to extend easily

**Testing with Target User**
- Test collision feel with Aurora
- Verify hitbox size is appropriate
- Confirm feedback is satisfying
- Check audio volume is comfortable
- Validate overall enjoyment
