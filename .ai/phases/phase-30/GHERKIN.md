# Phase 30: Letter Builder - Draggable Pieces - BDD Scenarios

## Feature: Draggable Letter Pieces

```gherkin
Feature: Draggable Letter Pieces
  As Aurora (age 4-6)
  I want to drag letter stroke pieces to build letters
  So that I can learn letter formation through hands-on interaction

Background:
  Given LetterBuilderScene is loaded
  And a target letter outline is displayed
  And the pieces area is designated at the bottom of the screen
```

## Scenario: Create LetterPiece Class

```gherkin
Scenario: LetterPiece.js file exists and is properly structured
  When I check the project structure
  Then "LetterPiece.js" should exist in the scenes or classes directory
  And LetterPiece should extend Phaser.GameObjects.Container
  And LetterPiece should have the following properties:
    | Property      | Type    | Purpose                |
    | strokeData    | Object  | Stroke visual data     |
    | originalX     | Number  | Starting X position    |
    | originalY     | Number  | Starting Y position    |
    | isDragging    | Boolean | Current drag state     |
    | isSnapped     | Boolean | Snapped to zone        |
    | trail         | Object  | Trail effect reference |
  And LetterPiece should have the following methods:
    | Method            | Purpose                     |
    | createGraphics    | Render stroke visually      |
    | setupDragHandlers | Configure drag events       |
    | onDragStart       | Handle drag start           |
    | onDrag            | Handle drag movement        |
    | onDragEnd         | Handle drag release         |
    | createTrail       | Initialize trail effect     |
    | destroyTrail      | Cleanup trail              |
    | returnToStart     | Animate to original position|
```

## Scenario: Define Letter Stroke Data

```gherkin
Scenario: Stroke decomposition data exists for all letters
  Given I check the stroke data structure
  Then letter stroke data should be defined for all 26 letters
  And each letter should have 2-4 strokes
  And each stroke should have the following properties:
    | Property | Type   | Purpose                  |
    | id       | String | Unique identifier        |
    | type     | String | Stroke type (line/arc)   |
    | startX   | Number | Starting X coordinate    |
    | startY   | Number | Starting Y coordinate    |
    | endX     | Number | Ending X coordinate      |
    | endY     | Number | Ending Y coordinate      |
    | width    | Number | Stroke width             |
    | height   | Number | Stroke height            |

  Examples:
    | Letter | Strokes | Description              |
    | A      | 3       | Left, right, bar         |
    | B      | 3       | Vertical, top, bottom    |
    | I      | 3       | Top, vertical, bottom    |
    | L      | 2       | Vertical, bottom         |
    | M      | 4       | Left, right, left, right |
```

## Scenario: Generate Pieces from Stroke Data

```gherkin
Scenario: Pieces are created when letter loads
  Given the current letter is "A"
  And "A" has 3 strokes defined in the stroke data
  When generateLetterPieces() is called
  Then 3 LetterPiece instances should be created
  And each piece should be positioned in the pieces area
  And pieces should be evenly spaced (150px apart)
  And pieces should be centered around x=400
  And piece positions should be:
    | Piece | X   | Y   |
    | 1     | 250 | 510 |
    | 2     | 400 | 510 |
    | 3     | 550 | 510 |
  And each piece should be added to the letterPieces array
```

## Scenario: Pieces Spawn with Animation

```gherkin
Scenario: Pieces appear with polished fade-in animation
  Given generateLetterPieces() has been called
  And 3 pieces are being created
  When the pieces are added to the scene
  Then each piece should start with alpha=0 and scale=0
  And pieces should animate to alpha=1 and scale=1
  And the animation should take 400ms per piece
  And pieces should be staggered by 100ms each
  And animation easing should be "Back.easeOut"
  And the total spawn sequence should be:
    | Piece | Start Time | End Time | Effect        |
    | 1     | 0ms        | 400ms    | Fade + Scale  |
    | 2     | 100ms      | 500ms    | Fade + Scale  |
    | 3     | 200ms      | 600ms    | Fade + Scale  |
  And pieces should become interactive after all animations complete
```

## Scenario: Piece Visual Rendering

```gherkin
Scenario: Each piece displays correct stroke visually
  Given a LetterPiece is created with stroke data
  When createGraphics() is called
  Then a Graphics object should be created
  And the stroke should be drawn based on stroke type
  And for type "line":
    - A line should be drawn from (startX, startY) to (endX, endY)
    - Line thickness should be 10px
    - Line color should be black (0x000000)
    - Line cap should be 'round'
  And a semi-transparent fill should be added for easier grabbing
  And the fill should be brown (0x8B4513) with 30% alpha
  And the graphics should be added to the container
```

## Scenario: Enable Drag Interaction

```gherkin
Scenario: Pieces are interactive and draggable
  Given a LetterPiece has been created and added to the scene
  When the piece spawn animation completes
  Then the piece should be set as interactive
  And the piece should be set as draggable
  And the cursor should change to a pointer when hovering
  And the piece should listen for the following events:
    | Event     | Handler      |
    | dragstart | onDragStart  |
    | drag      | onDrag       |
    | dragend   | onDragEnd    |
```

## Scenario: Drag Start Feedback

```gherkin
Scenario: Piece provides immediate visual feedback when grabbed
  Given a piece is interactive and idle
  When I press down on the piece (pointerdown)
  Then onDragStart should be called
  And the piece should be brought to the front (z-index)
  And the piece should scale to 1.1 over 150ms
  And the piece scale animation should use "Power2" easing
  And the stroke color should change to gold (0xFFD700)
  And a trail effect should be created
  And a "pickupSound" should play at 30% volume
  And the isDragging flag should be set to true
```

## Scenario: Drag Movement

```gherkin
Scenario: Piece follows pointer smoothly during drag
  Given a piece is being dragged (isDragging = true)
  When I move the pointer to position (300, 200)
  Then onDrag should be called with (pointer, 300, 200)
  And the piece position should update to (300, 200)
  And the position should be clamped to bounds:
    | Axis | Minimum | Maximum |
    | X    | 50      | 750     |
    | Y    | 100     | 550     |
  And the trail should update with the new position
  And the piece should move smoothly with no lag (<50ms)
```

## Scenario: Drag Position Clamping

```gherkin
Scenario: Piece stays within screen bounds during drag
  Given a piece is being dragged
  When I try to drag the piece to x=-10 (off-screen left)
  Then the piece x should be clamped to 50

  When I try to drag the piece to x=900 (off-screen right)
  Then the piece x should be clamped to 750

  When I try to drag the piece to y=50 (off-screen top)
  Then the piece y should be clamped to 100

  When I try to drag the piece to y=650 (off-screen bottom)
  Then the piece y should be clamped to 550

  And the clamping should be smooth (no jarring stops)
```

## Scenario: Trail Effect During Drag

```gherkin
Scenario: Visual trail follows piece while dragging
  Given a piece drag has started
  And createTrail() has been called
  When the piece is moved during drag
  Then a trail effect should be visible behind the piece
  And the trail should consist of white particles (0xFFFFFF)
  And particles should have:
    | Property | Value             |
    | lifespan | 400ms             |
    | alpha    | 0.8 → 0 (fade)    |
    | scale    | 0.6 → 0 (shrink)  |
    | speed    | 10-50 pixels/sec  |
  And new trail particles should emit continuously
  And the trail should update with the piece position
  And the trail should create a smooth, satisfying visual effect
```

## Scenario: Drag End - Return to Start

```gherkin
Scenario: Piece returns to starting position when released (Phase 30 behavior)
  Given a piece is being dragged
  And the piece is not over a valid snap zone (Phase 31 feature)
  When I release the pointer (pointerup)
  Then onDragEnd should be called
  And the piece should check if isSnapped
  And isSnapped should be false (Phase 30 - no snapping yet)
  And the piece should animate back to originalX, originalY
  And the return animation should take 300ms
  And the return animation should use "Back.easeOut" easing
  And the trail effect should be destroyed
  And the piece should scale back to 1.0 over 200ms
  And the stroke color should reset to black (0x000000)
  And a "releaseSound" should play at 30% volume
  And isDragging should be set to false
```

## Scenario: Multiple Piece Interaction

```gherkin
Scenario: Drag multiple pieces independently
  Given there are 3 pieces in the pieces area
  When I drag piece 1 and release it
  Then piece 1 should return to its original position

  When I drag piece 2 and release it
  Then piece 2 should return to its original position
  And piece 1 should remain at its position

  When I drag piece 3 and release it
  Then piece 3 should return to its original position
  And pieces 1 and 2 should remain at their positions

  And each piece should work independently
  And dragging one piece should not affect others
```

## Scenario: Piece Z-Index Management

```gherkin
Scenario: Dragged piece is always on top
  Given there are 3 pieces potentially overlapping
  And piece 1 is on the bottom layer
  And piece 2 is in the middle layer
  And piece 3 is on the top layer
  When I start dragging piece 1
  Then piece 1 should be brought to the front
  And piece 1 should be above pieces 2 and 3

  When I release piece 1 and drag piece 2
  Then piece 2 should be brought to the front
  And piece 2 should be above pieces 1 and 3

  And the active piece should always be fully visible
  And no piece should be obscured while dragging
```

## Scenario: Test with Different Letters

```gherkin
Scenario Outline: Pieces generate correctly for various letters
  Given the current letter is <letter>
  When generateLetterPieces() is called
  Then <piece_count> pieces should be created
  And pieces should be distributed evenly
  And each piece should match the stroke data for <letter>
  And all pieces should be interactive

  Examples:
    | letter | piece_count | complexity |
    | I      | 3           | Simple     |
    | L      | 2           | Simple     |
    | T      | 2           | Simple     |
    | A      | 3           | Medium     |
    | H      | 3           | Medium     |
    | E      | 4           | Medium     |
    | M      | 4           | Complex    |
    | W      | 4           | Complex    |
```

## Scenario: Performance During Drag

```gherkin
Scenario: Drag maintains 60fps performance
  Given a piece is interactive
  When I drag the piece continuously for 10 seconds
  Then the framerate should remain at 60fps
  And the drag should feel smooth with no stuttering
  And the trail effect should not cause performance degradation
  And memory usage should remain stable
  And there should be no memory leaks

  When I check the browser performance monitor
  Then CPU usage should be reasonable (<50%)
  And GPU usage should be reasonable (<70%)
```

## Scenario: Trail Cleanup

```gherkin
Scenario: Trail is properly cleaned up after drag
  Given a piece has been dragged
  And a trail effect was created
  When the drag ends and the piece is released
  Then destroyTrail() should be called
  And the trail should stop emitting particles
  And existing trail particles should complete their lifespan
  And after 500ms, the trail object should be destroyed
  And the trail reference should be set to null
  And there should be no orphaned trail particles
  And memory should be freed
```

## Edge Cases

```gherkin
Scenario: Rapid drag and release
  Given a piece is interactive
  When I rapidly click and release the piece 5 times in 1 second
  Then each drag start and end should be handled correctly
  And animations should not stack or conflict
  And the piece should always return to the correct position
  And there should be no visual glitches
  And no console errors should occur

Scenario: Drag piece during spawn animation
  Given pieces are spawning with fade-in animation
  And a piece is at 50% of its spawn animation
  When I try to interact with the piece
  Then the piece should not be interactive yet (disabled during spawn)
  And the click should be ignored
  And the spawn animation should complete normally

  When the spawn animation completes
  Then the piece should become interactive

Scenario: Drag piece off-screen boundaries
  Given a piece is being dragged
  When I drag the piece far to the left (x = -500)
  Then the piece should clamp to x = 50

  When I drag the piece far to the right (x = 1500)
  Then the piece should clamp to x = 750

  And the piece should remain visible and accessible
  And the piece should not get lost or stuck

Scenario: Multiple rapid trail creations
  Given a piece is interactive
  When I start dragging the piece
  And I immediately release and start dragging again
  And I repeat this 10 times rapidly
  Then only one trail should be active at a time
  And old trails should be properly cleaned up
  And there should be no trail stacking or memory leaks
  And performance should remain at 60fps

Scenario: Missing stroke data
  Given the current letter is "X"
  And "X" has no stroke data defined (edge case)
  When generateLetterPieces() is called
  Then the function should handle the error gracefully
  And either fallback pieces should be created
  Or a helpful error message should be logged
  And the game should not crash
  And the scene should remain functional
```

## Acceptance Criteria

### Must Have
- [ ] LetterPiece.js class exists and extends Phaser.GameObjects.Container
- [ ] Letter stroke data defined for at least 10 letters
- [ ] Stroke data includes 2-4 pieces per letter
- [ ] generateLetterPieces() creates pieces from stroke data
- [ ] Pieces display visually in pieces area
- [ ] Pieces are evenly spaced (150px apart)
- [ ] Pieces spawn with fade/scale animation (400ms)
- [ ] Each piece is interactive and draggable after spawn
- [ ] Drag start: piece scales to 1.1
- [ ] Drag start: stroke color changes to gold
- [ ] Drag start: trail effect is created
- [ ] Drag start: "pickupSound" plays
- [ ] Drag start: piece brought to front (z-index)
- [ ] Drag move: piece follows pointer smoothly
- [ ] Drag move: piece position clamped to bounds (50-750x, 100-550y)
- [ ] Drag move: trail updates with piece position
- [ ] Drag move: no lag (<50ms response)
- [ ] Drag end: piece returns to original position (Phase 30 only)
- [ ] Drag end: trail is destroyed and cleaned up
- [ ] Drag end: piece scales back to 1.0
- [ ] Drag end: stroke color resets to black
- [ ] Drag end: "releaseSound" plays
- [ ] Multiple pieces can be dragged independently
- [ ] Dragged piece is always on top (z-index management)
- [ ] Trail is visually appealing and satisfying
- [ ] Performance maintained at 60fps during drag
- [ ] No memory leaks (trail cleanup works)
- [ ] Tested with multiple letters (simple, medium, complex)
- [ ] No console errors during any drag operation

### Visual Verification
- [ ] Pieces are clearly visible and distinct from outline
- [ ] Piece strokes are thick (10px) and easy to see
- [ ] Pieces have semi-transparent fill (easier to grab)
- [ ] Trail effect is smooth and aesthetically pleasing
- [ ] Trail fades naturally (not abrupt)
- [ ] Drag feedback is immediate and satisfying
- [ ] Scale animations are smooth
- [ ] Color changes (gold highlight) are visible
- [ ] Pieces return smoothly to start position
- [ ] No visual glitches or artifacts

### Interaction Verification
- [ ] Cursor changes to pointer on piece hover
- [ ] Piece responds immediately to pointer down (<50ms)
- [ ] Piece follows pointer smoothly during drag
- [ ] Piece stays within screen bounds (clamped)
- [ ] Piece returns to start when released
- [ ] Trail appears when dragging starts
- [ ] Trail follows piece during drag
- [ ] Trail disappears when drag ends
- [ ] Sound effects play at appropriate times
- [ ] Multiple pieces can be manipulated without conflicts

### Technical Verification
- [ ] LetterPiece class properly extends Container
- [ ] All instance variables initialize correctly
- [ ] Stroke data structure is valid and complete
- [ ] Piece generation algorithm works for 2-4 pieces
- [ ] Drag handlers are properly attached
- [ ] Trail creation/destruction is clean (no leaks)
- [ ] Position clamping math is correct
- [ ] Z-index management works reliably
- [ ] Animations use Phaser tweens (optimized)
- [ ] Performance profiling shows 60fps maintained

## Manual Testing Checklist

### Setup
1. [ ] Load LetterBuilderScene in browser
2. [ ] Verify target letter outline displays
3. [ ] Verify pieces area is at bottom of screen
4. [ ] Count number of pieces displayed

### Visual Testing
5. [ ] Check pieces are evenly spaced
6. [ ] Check each piece is visually distinct
7. [ ] Check piece strokes are thick and visible
8. [ ] Check pieces have semi-transparent fill
9. [ ] Watch spawn animation (fade + scale)
10. [ ] Verify staggered timing (100ms between pieces)

### Drag Interaction Testing
11. [ ] Hover over piece 1, verify pointer cursor
12. [ ] Click and hold piece 1
13. [ ] Verify piece scales up
14. [ ] Verify stroke color changes to gold
15. [ ] Verify trail appears
16. [ ] Drag piece around screen
17. [ ] Verify piece follows pointer smoothly
18. [ ] Verify trail follows piece
19. [ ] Drag piece to edges of screen
20. [ ] Verify piece clamps to bounds
21. [ ] Release piece
22. [ ] Verify piece returns to start position
23. [ ] Verify trail disappears
24. [ ] Verify piece scale returns to 1.0
25. [ ] Verify stroke color returns to black

### Multiple Piece Testing
26. [ ] Drag piece 1, then piece 2, then piece 3
27. [ ] Verify each works independently
28. [ ] Drag piece 1 over piece 2
29. [ ] Verify dragged piece is on top
30. [ ] Release piece 1, drag piece 2
31. [ ] Verify piece 2 now on top

### Performance Testing
32. [ ] Open browser performance monitor (F12)
33. [ ] Drag a piece continuously for 10 seconds
34. [ ] Check framerate (should be 60fps)
35. [ ] Check CPU usage (should be reasonable)
36. [ ] Check memory usage (should be stable)
37. [ ] Check for any stuttering or lag

### Audio Testing
38. [ ] Drag a piece, listen for pickup sound
39. [ ] Release piece, listen for release sound
40. [ ] Verify sounds are balanced (30% volume)
41. [ ] Verify sounds don't clip or distort

### Edge Case Testing
42. [ ] Rapidly click and release a piece 5 times
43. [ ] Verify no glitches or errors
44. [ ] Try to drag piece during spawn animation
45. [ ] Verify interaction is disabled until spawn complete
46. [ ] Drag piece far off-screen
47. [ ] Verify piece clamps correctly
48. [ ] Check console for any errors (should be none)

### Different Letter Testing
49. [ ] Navigate to a different letter
50. [ ] Verify correct number of pieces generate
51. [ ] Test with simple letter (I, L, T)
52. [ ] Test with medium letter (A, H, E)
53. [ ] Test with complex letter (M, W) if implemented
54. [ ] Verify all pieces work correctly for each letter

## Success Criteria

**This phase is complete when:**
1. LetterPiece class is fully implemented and functional
2. Letter stroke data defined for at least 10 letters (ideally all 26)
3. Pieces generate correctly from stroke data
4. Pieces display visually in pieces area with proper spacing
5. Pieces spawn with polished fade/scale animation
6. Each piece is interactive and draggable
7. Drag start provides immediate visual feedback (scale, color, trail)
8. Drag move is smooth and responsive (<50ms latency)
9. Drag position is clamped to screen bounds
10. Trail effect is implemented and visually satisfying
11. Drag end returns piece to original position (Phase 30 behavior)
12. Trail cleanup is complete (no memory leaks)
13. Multiple pieces work independently
14. Z-index management keeps dragged piece on top
15. Performance maintained at 60fps during all drag operations
16. Audio feedback works (pickup and release sounds)
17. Tested with multiple letters of varying complexity
18. All edge cases handled gracefully
19. No console errors or warnings
20. All acceptance criteria met
21. Code is clean, commented, and documented
22. Ready to proceed to Phase 31 (snapping and completion logic)

## Notes

**Testing Priority:**
- Drag responsiveness is critical (<50ms)
- Visual feedback must be immediate and satisfying
- Performance must stay at 60fps (smooth gameplay essential)
- Aurora's experience is the ultimate test

**Common Issues to Watch For:**
- Trail particles not cleaning up (memory leak)
- Drag lag on lower-end devices
- Pieces getting stuck off-screen
- Z-index conflicts (pieces obscured)
- Animation timing conflicts (overlapping tweens)
- Sound effects too loud or not playing
- Stroke data missing or incorrect
- Position clamping too restrictive or permissive

**ADHD-Friendly Verification:**
- Pieces are large enough to grab easily (80-120px)
- Feedback is immediate (< 50ms from action)
- Trail provides satisfying visual reward
- No pieces can be permanently lost (always return)
- One piece at a time (clear focus)
- No time pressure (work at own pace)

This phase creates the core interaction that makes Letter Builder engaging and educational. A responsive, satisfying drag experience is essential for Aurora's enjoyment and learning.
