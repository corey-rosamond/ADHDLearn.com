# Phase 38: Dance & Trace - Path Detection - BDD Scenarios

## Feature: Path Detection and Tracing

```gherkin
Feature: Forgiving Path Detection with Rainbow Trail
  As Aurora (a player with ADHD and motor skill challenges)
  I want smooth, forgiving letter tracing with beautiful visual feedback
  So that I feel successful and engaged while learning letter shapes

Background:
  Given Phase 37 is complete (scene setup, letter paths)
  And the DanceTraceScene is loaded with letter 'A'
  And the starting indicator is pulsing at the correct position
  And the PathDetector system is initialized with 50px hitbox
```

## Scenario: Start Tracing from Correct Position

```gherkin
Scenario: Player touches starting indicator
  Given the scene is ready for tracing
  And the starting indicator is visible at position (350, 450)
  When I touch down at position (355, 448)
  Then the PathDetector should detect I am on path
  And the distance to path should be less than 10 pixels
  And tracing should start
  And the starting indicator should hide
  And the "trace-start" audio should play
  And the isTracing flag should be true
  And no error should appear in console

Scenario: Player touches away from starting indicator
  Given the scene is ready for tracing
  And the starting indicator is at position (350, 450)
  When I touch down at position (500, 300)
  Then the PathDetector should detect I am off path
  And the distance should be greater than 50 pixels
  And tracing should NOT start
  And the starting indicator should remain visible
  And a "start-here" hint audio should play
  And the isTracing flag should remain false
```

## Scenario: Path Detection with Forgiving Hitbox

```gherkin
Scenario: Trace exactly on path
  Given tracing has started
  And I am at position (350, 450) on the path
  When I move to position (360, 430)
  And the distance to nearest path point is 2 pixels
  Then the PathDetector should return onPath = true
  And the nearestPoint should be within 5 pixels
  And the strokeProgress should increase
  And a rainbow trail should render

Scenario: Trace slightly off path (within forgiveness zone)
  Given tracing has started
  And I am at position (360, 430) on the path
  When I move to position (390, 420)
  And the distance to nearest path point is 45 pixels
  And 45 pixels is less than hitbox radius (50px)
  Then the PathDetector should return onPath = true
  And the nearestPoint should be identified
  And the strokeProgress should still increase
  And the rainbow trail should continue rendering
  And no penalty should occur

Scenario: Trace far off path (beyond forgiveness zone)
  Given tracing has started
  And I am at position (360, 430) on the path
  When I move to position (500, 300)
  And the distance to nearest path point is 150 pixels
  And 150 pixels is greater than hitbox radius (50px)
  Then the PathDetector should return onPath = false
  And the strokeProgress should NOT increase
  And the trail should fade to gray or pause
  And a gentle redirect hint may play
```

## Scenario: Dynamic Hitbox at Stroke Start/End

```gherkin
Scenario: Larger hitbox at stroke beginning
  Given the current stroke is stroke 0 (first stroke)
  And the strokeProgress is 0.0 (at start)
  When calculating the dynamic hitbox
  Then the hitbox radius should be 50 × 1.5 = 75 pixels
  And the effective hitbox should be larger than normal
  And tracing should be easier to start

Scenario: Larger hitbox at stroke ending
  Given the strokeProgress is 0.85 (near end of stroke)
  When calculating the dynamic hitbox
  Then the hitbox radius should be 50 × 1.5 = 75 pixels
  And completing the stroke should be easier

Scenario: Standard hitbox in middle of stroke
  Given the strokeProgress is 0.5 (middle of stroke)
  When calculating the dynamic hitbox
  Then the hitbox radius should be 50 pixels (1.0× base)
  And the standard forgiveness applies
```

## Scenario: Rainbow Trail Rendering

```gherkin
Scenario: Render rainbow trail as tracing progresses
  Given tracing has started
  And I have traced 10 points along the path
  When the trail is rendered
  Then 10 line segments should be drawn
  And each segment should connect consecutive points
  And colors should transition through the rainbow spectrum
  And the trail width should be 14 pixels
  And the trail alpha should be 0.9

Scenario: Calculate rainbow colors based on progress
  Given the strokeProgress is at various stages
  When calculating trail colors
  Then the following colors should be used:
    | Progress | Hue  | Expected Color |
    | 0.0      | 0°   | Red            |
    | 0.17     | 61°  | Orange         |
    | 0.33     | 119° | Yellow         |
    | 0.5      | 180° | Green          |
    | 0.67     | 241° | Blue           |
    | 0.83     | 299° | Indigo/Purple  |
    | 1.0      | 360° | Red (cycle)    |
  And colors should transition smoothly between stages
  And no sudden color jumps should occur

Scenario: Trail renders behind finger/cursor
  Given I am tracing the letter
  And my finger/cursor is at position (370, 420)
  When the trail renders
  Then the trail should appear behind my finger
  And the most recent trail point should be at or near (370, 420)
  And the trail should follow my exact path
  And the trail should be clearly visible
```

## Scenario: Directional Path Enforcement

```gherkin
Scenario: Trace in correct direction (forward)
  Given I am at position (350, 450) moving to (360, 430)
  And the expected direction is "up-right" (positive X, negative Y)
  When checking direction
  Then calculate expectedDir = {x: 0.447, y: -0.894} (normalized)
  And calculate actualDir = {x: 0.447, y: -0.894} (same)
  And calculate dot product = 1.0 (perfect match)
  And the direction check should return true
  And progress should update normally

Scenario: Trace at slight angle (within tolerance)
  Given I am moving slightly off the expected direction
  And the expected direction is "up-right"
  And I am moving "up" (30-degree deviation)
  When checking direction
  Then the dot product should be approximately 0.87
  And 0.87 is greater than threshold 0.5
  And the direction check should return true
  And progress should update (forgiving)

Scenario: Trace backwards (opposite direction)
  Given I am at position (360, 430)
  And I move back to position (350, 450)
  And the expected direction is "up-right"
  And I am moving "down-left" (opposite)
  When checking direction
  Then calculate dot product ≈ -0.9 (opposite)
  And -0.9 is less than threshold 0.5
  And the direction check should return false
  And progress should NOT update
  And a gentle redirect sound may play
  And no harsh penalty should occur

Scenario: Trace perpendicular to path (edge case)
  Given the expected direction is "up-right"
  And I move perpendicular (to the right)
  When checking direction
  Then the dot product should be approximately 0.0
  And 0.0 is less than threshold 0.5
  And the direction check should return false
  And progress should NOT update
```

## Scenario: Stroke Progress Tracking

```gherkin
Scenario: Update stroke progress as tracing
  Given the current stroke has 20 points
  And I am at point index 5
  When calculating strokeProgress
  Then progress should be 5 / 19 = 0.263 (26.3%)
  And strokeProgress should be updated to 0.263
  And the progress should be reflected in rainbow color
  And the progress should be monotonically increasing

Scenario: Progress only increases (not decreases)
  Given the strokeProgress is currently 0.5 (50%)
  When I trace back to a point at progress 0.3
  Then the strokeProgress should remain 0.5
  And the progress should NOT decrease
  And backwards movement should be ignored
  And this prevents accidental regression

Scenario: Complete stroke at 90% threshold
  Given I am tracing stroke 0
  And the strokeProgress reaches 0.89
  Then the stroke should NOT be complete yet
  When the strokeProgress reaches 0.90
  Then the completeStroke() method should be called
  And currentStroke should increment to 1
  And strokeProgress should reset to 0.0
  And a stroke completion chime should play
  And sparkle effects should appear
  And the next stroke should become active
```

## Scenario: Multi-Stroke Letter Handling

```gherkin
Scenario: Complete first stroke and move to second
  Given I am tracing letter 'A' with 3 strokes
  And I complete stroke 0 (left diagonal)
  When the stroke completion is detected
  Then currentStroke should change from 0 to 1
  And strokeProgress should reset to 0.0
  And the PathDetector should now check stroke 1 points
  And the starting point of stroke 1 should be highlighted
  And I can lift my finger between strokes
  And no penalty for lifting between strokes

Scenario: Complete all strokes (letter completion)
  Given I am on the last stroke (stroke 2 of 3)
  And I reach strokeProgress 0.92
  When completeStroke() is called
  Then currentStroke should increment to 3
  And the method should return true (letter complete)
  And the onLetterComplete() callback should fire
  And Phase 39 celebration should begin
  And tracing should stop
```

## Scenario: Off-Path Forgiveness and Snap-to-Path

```gherkin
Scenario: Brief off-path excursion (forgiveness)
  Given I am tracing on the path
  When I move 55 pixels off path (slightly beyond hitbox)
  And the distance is less than 70 pixels (snap threshold)
  Then the system should snap my position to nearestPoint
  And the trail should add the snapped point
  And progress should continue
  And no visual or audio penalty
  And Aurora feels supported, not punished

Scenario: Far off-path (redirect guidance)
  Given I am tracing on the path
  When I move 120 pixels off path
  And the distance is greater than 70 pixels
  Then the PathDetector should return onPath = false
  And progress should pause
  And the trail should fade to gray
  And an optional arrow should point back to path
  And a gentle "follow the dots" audio hint may play
  And no harsh feedback or failure state

Scenario: Return to path after off-path
  Given I went off path (distance > 70px)
  And progress is paused at strokeProgress 0.4
  When I move back within 60 pixels of the path
  Then the PathDetector should return onPath = true
  And progress should resume from 0.4
  And the rainbow trail should resume
  And the experience should feel seamless
```

## Scenario: Continuous Audio and Haptic Feedback

```gherkin
Scenario: Play whoosh sound periodically while tracing
  Given I am tracing along the path
  And I have added 5 new trail points
  When the 5th point is added
  Then a "trace-whoosh" sound should play
  And the volume should be 0.3 (subtle)
  And the sound should be brief (200ms)
  When I add 5 more points (total 10)
  Then another whoosh sound should play
  And the feedback should feel continuous but not overwhelming

Scenario: Throttle whoosh sounds to prevent audio spam
  Given whoosh sounds are triggered every 5 points
  And each whoosh is 200ms long
  When I trace very quickly (30 points in 1 second)
  Then only 6 whoosh sounds should play
  And sounds should not overlap excessively
  And audio should enhance, not annoy

Scenario: Trigger haptic feedback on mobile
  Given I am playing on a mobile device with haptic support
  When I trace along the path
  Then a subtle vibration should occur every 10 points
  And the vibration duration should be 20ms
  And the vibration intensity should be light
  And this should provide tactile feedback
  And enhance the therapeutic experience

Scenario: Play chime on stroke completion
  Given I complete a stroke (reach 90%+ progress)
  When the completeStroke() method triggers
  Then a "stroke-complete-chime" sound should play
  And the volume should be 0.7 (clear but not loud)
  And sparkle particle effects should appear
  And Aurora should feel accomplished
```

## Scenario: Input Handling (Mouse and Touch)

```gherkin
Scenario: Handle mouse input on desktop
  Given I am playing on a desktop with a mouse
  When I press the mouse button down on the start indicator
  Then a pointerdown event should fire
  And tracing should start
  When I move the mouse while holding the button
  Then pointermove events should fire
  And the trail should render
  When I release the mouse button
  Then a pointerup event should fire
  And tracing should pause

Scenario: Handle touch input on mobile/tablet
  Given I am playing on a touch device
  When I touch down on the start indicator
  Then a pointerdown event should fire
  And tracing should start
  When I drag my finger along the path
  Then pointermove events should fire
  And the trail should render
  When I lift my finger
  Then a pointerup event should fire
  And tracing should pause

Scenario: Prevent page scrolling during touch tracing
  Given I am tracing on a mobile device
  When I drag my finger across the canvas
  Then the page should NOT scroll
  And all touch events should be captured by the game
  And preventDefault() should be called on touch events
  And the tracing experience should be uninterrupted

Scenario: Handle multi-touch (use only first touch)
  Given I am playing on a touch device
  When I touch the screen with two fingers simultaneously
  Then only the first touch should be tracked
  And the second touch should be ignored
  And tracing should use only the first pointer
  And no confusion or errors should occur
```

## Scenario: Input Smoothing for Jittery Input

```gherkin
Scenario: Smooth jittery mouse/finger input
  Given I am tracing with slightly shaky hand movements
  And raw input positions are:
    | Frame | Raw X | Raw Y |
    | 1     | 350   | 450   |
    | 2     | 355   | 445   |
    | 3     | 352   | 442   | (jitter)
    | 4     | 358   | 438   |
    | 5     | 360   | 435   |
  When input smoothing is applied (rolling average over 3 frames)
  Then the smoothed positions should be:
    | Frame | Smooth X | Smooth Y |
    | 1     | 350      | 450      |
    | 2     | 352.5    | 447.5    |
    | 3     | 352.3    | 445.7    |
    | 4     | 355.0    | 441.7    |
    | 5     | 356.7    | 438.3    |
  And the trail should appear smoother
  And jitter should be reduced
  And the experience should feel polished
```

## Acceptance Criteria

### Must Have - Path Detection
- [ ] PathDetector class created and functional
- [ ] Path detection works with 50-pixel hitbox
- [ ] Distance to nearest path point calculated correctly
- [ ] onPath detection accurate
- [ ] Works for all strokes of all letters

### Must Have - Forgiving Hitbox
- [ ] Dynamic hitbox: 80px at start/end, 40px in middle
- [ ] Snap-to-path assistance within 70 pixels
- [ ] Forgiving tolerance (allow slight deviations)
- [ ] No harsh penalties for brief off-path excursions
- [ ] System feels supportive, not punishing

### Must Have - Rainbow Trail
- [ ] Trail renders as colored line segments
- [ ] Colors transition through rainbow (ROY G BIV)
- [ ] Color calculation based on strokeProgress
- [ ] Trail width: 12-16 pixels
- [ ] Trail alpha: 0.9
- [ ] Trail follows finger/mouse path
- [ ] Trail is visually satisfying

### Must Have - Direction Enforcement
- [ ] Direction check prevents backwards tracing
- [ ] Dot product calculation correct
- [ ] 45-degree tolerance (dot product > 0.5)
- [ ] Backwards movement ignored (no progress update)
- [ ] Gentle redirect (no harsh penalties)

### Must Have - Progress Tracking
- [ ] strokeProgress calculated correctly (0.0-1.0)
- [ ] Progress increases monotonically (never decreases)
- [ ] Stroke completion at 90% threshold
- [ ] currentStroke increments on completion
- [ ] Multi-stroke letters handled correctly
- [ ] Letter completion detected (all strokes done)

### Must Have - Feedback
- [ ] Whoosh sound plays periodically
- [ ] Chime sound on stroke completion
- [ ] Sparkle effects on stroke completion
- [ ] Haptic feedback on mobile (if supported)
- [ ] No audio spam (throttled feedback)

### Must Have - Input Handling
- [ ] Mouse input works (down, move, up)
- [ ] Touch input works (down, move, up)
- [ ] Page scrolling prevented on mobile
- [ ] Multi-touch handled (use first pointer only)
- [ ] Input smoothing reduces jitter

### Visual Quality
- [ ] Rainbow trail is beautiful and satisfying
- [ ] Colors transition smoothly (no jumps)
- [ ] Trail width is appropriate (not too thin/thick)
- [ ] Trail follows path accurately
- [ ] Off-path trail fades gracefully

### Performance
- [ ] Maintains 60 FPS during tracing
- [ ] No lag or stuttering
- [ ] Trail renders efficiently
- [ ] Path detection is fast (< 1ms per frame)
- [ ] Memory usage stable (no leaks)

## Edge Cases to Test

```gherkin
Scenario: Rapid back-and-forth movement
  Given I am tracing along the path
  When I rapidly move back and forth over the same section
  Then progress should only increase on forward movement
  And backwards movement should be ignored
  And the system should not crash
  And the trail should render all movements

Scenario: Teleport detection (large jump)
  Given I am tracing at position (360, 430)
  When my pointer jumps to (600, 200) in one frame
  And the distance is > 200 pixels
  Then this should be detected as a teleport
  And tracing should pause or reset
  And the trail should not draw a long line across the screen
  And this prevents accidental huge jumps

Scenario: Lift finger and resume (multi-stroke)
  Given I complete stroke 0 of letter 'A'
  When I lift my finger
  And wait 2 seconds
  And touch down on stroke 1 starting point
  Then tracing should resume on stroke 1
  And no penalty for the pause
  And the trail should continue on stroke 1

Scenario: Complex letter with 4 strokes (M or W)
  Given I am tracing letter 'M' with 4 strokes
  When I complete each stroke sequentially
  Then all 4 strokes should be tracked correctly
  And progress should advance through all strokes
  And the letter should complete after stroke 4
  And no errors should occur

Scenario: Very slow tracing
  Given I trace very slowly (1 point per second)
  When tracing along the path
  Then the trail should still render correctly
  And progress should update normally
  And no timeout or errors should occur
  And the experience should remain smooth

Scenario: Very fast tracing
  Given I trace very quickly (50 points per second)
  When tracing along the path
  Then the trail should still render all points
  And progress should update correctly
  And audio feedback should be throttled
  And the system should not lag or crash
```

## Manual Testing Checklist

### Setup
1. [ ] Load Dance & Trace scene with letter 'A'
2. [ ] Verify starting indicator is visible
3. [ ] Open browser console
4. [ ] Prepare to test tracing

### Basic Tracing
5. [ ] Touch starting indicator - tracing starts
6. [ ] Trace along left diagonal
7. [ ] Verify rainbow trail appears
8. [ ] Verify colors transition (red→orange→yellow→green)
9. [ ] Verify trail is smooth and satisfying
10. [ ] Complete first stroke (reach top)
11. [ ] Hear chime sound
12. [ ] See sparkle effects

### Hitbox Testing
13. [ ] Trace exactly on path - works perfectly
14. [ ] Trace 20px off path - still works (forgiving)
15. [ ] Trace 50px off path - still works (barely)
16. [ ] Trace 80px off path - trail pauses
17. [ ] Return to path - trail resumes
18. [ ] Verify snap-to-path at 65 pixels

### Direction Testing
19. [ ] Trace forward - progress updates
20. [ ] Try tracing backwards - progress stops
21. [ ] Trace at 30-degree angle - still works
22. [ ] Verify gentle redirect (no harsh penalty)

### Multi-Stroke Testing
23. [ ] Complete stroke 1 (left diagonal)
24. [ ] Lift finger
25. [ ] Start stroke 2 (right diagonal)
26. [ ] Complete stroke 2
27. [ ] Complete stroke 3 (horizontal bar)
28. [ ] Verify letter completion

### Audio Feedback
29. [ ] Listen for whoosh sounds while tracing
30. [ ] Verify sounds are subtle and periodic
31. [ ] Hear chime on stroke completion
32. [ ] Verify audio is not overwhelming

### Different Letters
33. [ ] Test simple letter (O - 1 stroke)
34. [ ] Test medium letter (B - 3 strokes)
35. [ ] Test complex letter (M - 4 strokes)
36. [ ] Verify all work correctly

### Input Types
37. [ ] Test with mouse (desktop)
38. [ ] Test with trackpad
39. [ ] Test with touch (tablet/phone)
40. [ ] Test with stylus (if available)

### Edge Cases
41. [ ] Rapid back-and-forth - handled
42. [ ] Very slow tracing - works
43. [ ] Very fast tracing - works
44. [ ] Lift and resume - works
45. [ ] Check console - no errors

### Performance
46. [ ] Monitor FPS (should be 60)
47. [ ] Check for lag or stuttering
48. [ ] Verify smooth animations
49. [ ] Test on slower device

### Visual Quality
50. [ ] Trail is beautiful and satisfying
51. [ ] Colors are vibrant
52. [ ] Trail width is appropriate
53. [ ] Overall polish feels premium

## Success Criteria

**This phase is complete when:**
1. Path detection works accurately with forgiving hitbox
2. Rainbow trail renders beautifully as Aurora traces
3. Directional enforcement prevents backwards tracing
4. Stroke progress tracks correctly
5. Multi-stroke letters work perfectly
6. Audio/haptic feedback is satisfying
7. Input handling works on mouse and touch
8. Snap-to-path assistance is helpful
9. No harsh penalties (therapeutic design)
10. System feels smooth, polished, and therapeutic
11. All acceptance criteria met
12. Zero errors in normal operation
13. Ready for Phase 39 (completion and celebration)

This phase transforms Phase 37's static paths into an interactive, therapeutic tracing experience.
