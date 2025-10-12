# Phase 9: Letter Pop - Multiple Bubbles - BDD Scenarios

## Feature: Multiple Bubbles

```gherkin
Feature: Multiple Independent Bubbles
  As a player
  I want to see multiple bubbles with different letters
  So that I can learn multiple letters at once

Background:
  Given the game is running
  And Phase 8 is complete
  And audio files for letters A, B, C are loaded
```

## Scenario: Create Bubble Array

```gherkin
Scenario: Initialize bubble tracking array
  Given the GameScene is being created
  When the create() method runs
  Then a bubbles array should be initialized
  And the array should be empty initially
  And the array should be ready to store bubble instances
```

## Scenario: Preload Multiple Letter Sounds

```gherkin
Scenario: Load all required audio assets
  Given I am in the scene's preload function
  When I load audio for multiple letters
  Then 'letter-a' should load from "assets/audio/letters/A.mp3"
  And 'letter-b' should load from "assets/audio/letters/B.mp3"
  And 'letter-c' should load from "assets/audio/letters/C.mp3"
  And 'pop' sound should load from "assets/audio/pop.mp3"
  And all sounds should be ready before create()
  And no loading errors should occur
```

## Scenario: Generate Spawn Positions

```gherkin
Scenario: Calculate non-overlapping positions
  Given I need to spawn 3 bubbles
  And the minimum distance is 150 pixels
  When I call generateSpawnPositions(3, 150)
  Then I should get 3 position objects
  And each position should have x and y properties
  And all X values should be between 100 and 700
  And all Y values should be 500 (bottom of screen)
  And each X position should be at least 150px from others
  And no two positions should overlap
```

## Scenario: Spawn Three Bubbles

```gherkin
Scenario: Create multiple bubble instances
  Given spawn positions are [200, 400, 600]
  And letters are ['A', 'B', 'C']
  When I create the bubbles in the scene
  Then bubble 1 should be at position (200, 500) with letter 'A'
  And bubble 2 should be at position (400, 500) with letter 'B'
  And bubble 3 should be at position (600, 500) with letter 'C'
  And all 3 bubbles should be added to the bubbles array
  And the bubbles array length should be 3
```

## Scenario: All Bubbles Visible

```gherkin
Scenario: Display multiple bubbles simultaneously
  Given 3 bubbles have been spawned
  When the scene renders
  Then bubble A should be visible at its position
  And bubble B should be visible at its position
  And bubble C should be visible at its position
  And all bubbles should display their letters clearly
  And no bubbles should visually overlap
  And all bubbles should be on screen (not cut off)
```

## Scenario: All Bubbles Float Independently

```gherkin
Scenario: Each bubble animates independently
  Given 3 bubbles are on screen
  When the float animations start
  Then bubble A should move upward
  And bubble B should move upward
  And bubble C should move upward
  And all should move at the same speed
  And all should maintain their horizontal spacing
  And no bubble should affect another's movement
```

## Scenario: Dynamic Audio Key Generation

```gherkin
Scenario: Generate correct audio key for each letter
  Given a LetterBubble with letter property "A"
  When the bubble generates its audio key
  Then the key should be "letter-a"

  Given a LetterBubble with letter property "B"
  When the bubble generates its audio key
  Then the key should be "letter-b"

  Given a LetterBubble with letter property "C"
  When the bubble generates its audio key
  Then the key should be "letter-c"
```

## Scenario: Click Bubble A

```gherkin
Scenario: Pop bubble A independently
  Given 3 bubbles are floating
  And bubble A is at position (200, 500)
  When the player clicks bubble A
  Then bubble A should become non-interactive
  And the pop sound should play
  And the letter-a audio should play after 100ms
  And bubble A should start its pop animation
  And bubble A should be destroyed after 300ms
  And bubbles B and C should remain unaffected
  And bubbles B and C should continue floating
```

## Scenario: Click Bubble B

```gherkin
Scenario: Pop bubble B independently
  Given 3 bubbles are floating
  And bubble B is at position (400, 500)
  When the player clicks bubble B
  Then bubble B should become non-interactive
  And the pop sound should play
  And the letter-b audio should play after 100ms
  And bubble B should start its pop animation
  And bubble B should be destroyed after 300ms
  And bubbles A and C should remain unaffected
  And bubbles A and C should continue floating
```

## Scenario: Click Bubble C

```gherkin
Scenario: Pop bubble C independently
  Given 3 bubbles are floating
  And bubble C is at position (600, 500)
  When the player clicks bubble C
  Then bubble C should become non-interactive
  And the pop sound should play
  And the letter-c audio should play after 100ms
  And bubble C should start its pop animation
  And bubble C should be destroyed after 300ms
  And bubbles A and B should remain unaffected
  And bubbles A and B should continue floating
```

## Scenario: Pop All Bubbles in Order

```gherkin
Scenario: Click bubbles A, B, C sequentially
  Given 3 bubbles are on screen
  When the player clicks bubble A at T+0ms
  Then bubble A pops and plays "A" audio
  And bubble A is destroyed at T+300ms

  When the player clicks bubble B at T+500ms
  Then bubble B pops and plays "B" audio
  And bubble B is destroyed at T+800ms
  And bubble C is still floating

  When the player clicks bubble C at T+1000ms
  Then bubble C pops and plays "C" audio
  And bubble C is destroyed at T+1300ms
  And no bubbles remain on screen
  And the bubbles array is empty
```

## Scenario: Pop Bubbles in Different Order

```gherkin
Scenario Outline: Click bubbles in various orders
  Given 3 bubbles labeled A, B, C are on screen
  When the player clicks bubbles in order <order>
  Then each bubble should pop when clicked
  And each bubble should play its own letter audio
  And the remaining bubbles should be unaffected
  And all bubbles should eventually be destroyed

  Examples:
    | order     |
    | A, B, C   |
    | C, B, A   |
    | B, A, C   |
    | A, C, B   |
    | B, C, A   |
    | C, A, B   |
```

## Scenario: Individual Bubble Destruction

```gherkin
Scenario: Remove bubble from tracking array
  Given the bubbles array contains [BubbleA, BubbleB, BubbleC]
  When bubble B is destroyed
  Then bubble B should find its index in the array
  And bubble B should remove itself using splice()
  And the bubbles array should contain [BubbleA, BubbleC]
  And the array length should be 2
  And bubble B's sprite should be destroyed
  And bubble B's text should be destroyed
```

## Scenario: Prevent Position Overlap

```gherkin
Scenario: Enforce minimum spacing
  Given I am generating spawn positions
  And the minimum distance is 150 pixels
  When I generate a random X position of 300
  And an existing position is already at X 320
  Then the distance is 20 pixels (< 150)
  And the position should be rejected
  And a new random X should be generated
  And the process should repeat until valid spacing found
```

## Scenario: Fallback After Max Attempts

```gherkin
Scenario: Prevent infinite loop in position generation
  Given I am trying to find a valid position
  And all nearby positions are occupied
  When I have tried 50 times without success
  Then the algorithm should use the last position anyway
  And the function should not loop infinitely
  And a position should be returned
  And the game should not freeze
```

## Scenario: Verify No Overlap Issues

```gherkin
Scenario: Visual spacing verification
  Given 3 bubbles have been spawned
  When I measure the distance between bubbles
  Then bubble A and bubble B should be at least 150px apart
  And bubble B and bubble C should be at least 150px apart
  And bubble A and bubble C should be at least 300px apart
  And no bubble graphics should visually touch
  And no letters should overlap
```

## Scenario: Each Bubble Has Independent State

```gherkin
Scenario: Verify bubble isolation
  Given 3 bubbles are on screen
  When I check bubble A's properties
  Then bubble A should have letter "A"
  And bubble A should have its own sprite reference
  And bubble A should have its own text reference
  And bubble A's isPopped should be false

  When I pop bubble A
  Then bubble A's isPopped should become true
  And bubble B's isPopped should still be false
  And bubble C's isPopped should still be false
  And bubbles B and C should be unaffected
```

## Scenario: Correct Audio Routing

```gherkin
Scenario: Each bubble plays correct sound
  Given bubble A has letter property "A"
  And bubble B has letter property "B"
  And bubble C has letter property "C"
  And all letter audios are loaded

  When bubble A is clicked
  Then the sound system should play('letter-a')
  And the player should hear the letter "A" sound

  When bubble B is clicked
  Then the sound system should play('letter-b')
  And the player should hear the letter "B" sound

  When bubble C is clicked
  Then the sound system should play('letter-c')
  And the player should hear the letter "C" sound
```

## Scenario: Memory Cleanup

```gherkin
Scenario: Proper resource cleanup
  Given 3 bubbles are on screen
  When bubble B is destroyed
  Then bubble B's sprite.destroy() should be called
  And bubble B's letterText.destroy() should be called
  And bubble B should be removed from bubbles array
  And bubble B's memory should be freed
  And no memory leaks should occur
  And no references to bubble B should remain
```

## Acceptance Criteria

### Must Have
- [ ] 3 bubbles spawn simultaneously
- [ ] Bubbles display letters A, B, C
- [ ] Each bubble at different X position
- [ ] Minimum 150px spacing between bubbles
- [ ] All bubbles float upward independently
- [ ] Each bubble independently clickable
- [ ] Clicking A plays "A" audio
- [ ] Clicking B plays "B" audio
- [ ] Clicking C plays "C" audio
- [ ] Popping one bubble doesn't affect others
- [ ] Bubbles can be popped in any order
- [ ] All audio files load correctly
- [ ] No console errors

### Positioning Requirements
- [ ] X positions between 100-700 pixels
- [ ] Y position starts at 500 pixels (bottom)
- [ ] No bubbles overlap visually
- [ ] Spacing algorithm works correctly
- [ ] Fallback prevents infinite loops
- [ ] All bubbles visible on screen

### Independence Requirements
- [ ] Each bubble has own sprite
- [ ] Each bubble has own text
- [ ] Each bubble has own click handler
- [ ] Each bubble has own animation
- [ ] Each bubble has own audio
- [ ] Popping one doesn't affect others

### Array Management
- [ ] Bubbles array initialized
- [ ] All bubbles added to array on create
- [ ] Bubbles removed from array on destroy
- [ ] Array length updates correctly
- [ ] No null/undefined entries

### Audio Requirements
- [ ] Dynamic audio key generation works
- [ ] Each letter plays correct audio
- [ ] Audio naming convention: "letter-{lowercase}"
- [ ] Pop sound plays for all bubbles
- [ ] No audio conflicts or overlap

## Edge Cases to Test

```gherkin
Scenario: Click Multiple Bubbles Rapidly
  Given 3 bubbles are on screen
  When the player clicks all 3 bubbles within 100ms
  Then all 3 should start popping
  And all 3 should play their own letter audio
  And animations should not interfere
  And all 3 should be destroyed properly

Scenario: Bubble Leaves Screen Before Clicked
  Given a bubble is floating upward
  When the bubble reaches Y position -100 (off screen)
  And the bubble has not been clicked
  Then the bubble should continue existing
  And the bubble should still be in the array
  # Note: Future phase will handle off-screen cleanup

Scenario: Click During Animation
  Given bubble A is being popped
  And bubble A's animation is running
  When the player clicks bubble B
  Then bubble B should pop normally
  And both animations should run simultaneously
  And no conflicts should occur

Scenario: Generate Positions With Low Spacing
  Given minimum distance is 50 pixels
  And screen width is 600 pixels
  When I generate positions for 10 bubbles
  Then all positions should be found
  And no infinite loop should occur
  And spacing should be maintained

Scenario: Destroy Bubble Not In Array
  Given a bubble instance exists
  But the bubble is not in the bubbles array
  When the bubble is destroyed
  Then indexOf() should return -1
  And splice() should not be called
  And no error should occur
  And the bubble should still be destroyed

Scenario: Audio File Missing
  Given letter-b audio file is missing
  When bubble B is clicked
  Then the pop sound should play
  And an error should be logged for missing letter-b
  And the animation should still run
  And the bubble should still be destroyed
```

## Manual Testing Checklist

### Setup
1. [ ] Phase 8 completed successfully
2. [ ] Audio files for A, B, C exist
3. [ ] Pop sound file exists
4. [ ] Game loads without errors

### Visual Testing
5. [ ] Open game in browser
6. [ ] Verify 3 bubbles appear
7. [ ] Verify letters A, B, C are visible
8. [ ] Verify bubbles are spaced apart
9. [ ] Verify no overlap
10. [ ] Verify all on screen

### Float Animation
11. [ ] Watch all 3 bubbles float upward
12. [ ] Verify they move at same speed
13. [ ] Verify they maintain spacing
14. [ ] Verify movement is smooth

### Interaction Testing - Order 1 (A, B, C)
15. [ ] Click bubble A
16. [ ] Verify "A" audio plays
17. [ ] Verify bubble A disappears
18. [ ] Verify B and C unaffected
19. [ ] Click bubble B
20. [ ] Verify "B" audio plays
21. [ ] Verify bubble B disappears
22. [ ] Verify C unaffected
23. [ ] Click bubble C
24. [ ] Verify "C" audio plays
25. [ ] Verify bubble C disappears
26. [ ] Verify all bubbles gone

### Interaction Testing - Order 2 (C, A, B)
27. [ ] Refresh game
28. [ ] Click bubble C first
29. [ ] Verify correct audio and behavior
30. [ ] Click bubble A second
31. [ ] Verify correct audio and behavior
32. [ ] Click bubble B last
33. [ ] Verify correct audio and behavior

### Rapid Clicking
34. [ ] Refresh game
35. [ ] Click all 3 bubbles rapidly
36. [ ] Verify all pop correctly
37. [ ] Verify all audio plays
38. [ ] Verify no errors

### Error Checking
39. [ ] Open browser console (F12)
40. [ ] Verify no JavaScript errors
41. [ ] Verify no audio loading errors
42. [ ] Verify no Phaser warnings

### Performance
43. [ ] Check frame rate (should be 60fps)
44. [ ] Verify smooth animations
45. [ ] Verify no lag or stutter

## Success Criteria

**This phase is complete when:**
1. 3 bubbles spawn at different X positions
2. Letters A, B, C are clearly displayed
3. Minimum 150px spacing is maintained
4. All bubbles float upward independently
5. Each bubble is independently clickable
6. Clicking A plays "A" audio correctly
7. Clicking B plays "B" audio correctly
8. Clicking C plays "C" audio correctly
9. Popping one bubble doesn't affect others
10. Bubbles can be popped in any order
11. All bubbles properly destroyed after popping
12. Bubbles removed from tracking array
13. No visual overlaps or collisions
14. No console errors
15. All manual tests pass
16. Ready to proceed to Phase 10

## Notes

**What We're Testing**
- Multiple instance management
- Independent bubble behavior
- Dynamic audio key generation
- Position generation algorithm
- Array-based tracking
- Memory cleanup with multiple objects

**What Makes Good Multi-Bubble Gameplay**
- Clear visual separation (no confusion)
- Independent behavior (intuitive)
- Correct audio per bubble (educational)
- Smooth simultaneous animations (polished)
- Proper cleanup (no artifacts)

**Learning Goals for Player**
- Recognize different letters visually
- Associate letter shapes with sounds
- Practice selective attention (choosing which to pop)
- Develop hand-eye coordination (clicking moving targets)
- Build confidence with multiple choices

**Technical Validation**
- Array management works correctly
- Position algorithm prevents overlap
- Dynamic audio routing works
- Multiple animations don't conflict
- Memory is properly freed

**Scaling Path Forward**
- Phase 9: 3 bubbles with A, B, C
- Future: 5 bubbles with A-E
- Future: 10 bubbles with random letters
- Future: Dynamic difficulty (more bubbles as skill improves)

This phase proves our bubble system scales beyond a single instance and establishes the foundation for more complex spawning patterns.
