# Phase 8: Letter Pop - Bubble Interaction - BDD Scenarios

## Feature: Interactive Bubbles

```gherkin
Feature: Bubble Click Interaction
  As a player
  I want to click/tap bubbles to pop them
  So that I can learn letters through audio-visual feedback

Background:
  Given the game is running
  And Phase 7 is complete
  And a letter bubble "A" is floating on screen
```

## Scenario: Enable Bubble Interaction

```gherkin
Scenario: Make bubble interactive
  Given a bubble sprite exists at position (400, 500)
  When I call setInteractive() on the bubble
  Then the bubble should respond to pointer events
  And the cursor should change on hover
  And the bubble should be clickable
  And the bubble should be tappable on mobile
```

## Scenario: Attach Click Event Handler

```gherkin
Scenario: Add pointerdown listener
  Given the bubble is interactive
  When I attach a 'pointerdown' event listener
  Then the listener should fire when bubble is clicked
  And the listener should fire when bubble is tapped
  And the onPop() method should be called
```

## Scenario: Load Audio Assets

```gherkin
Scenario: Preload required sounds
  Given I am in the scene's preload function
  When I load audio assets
  Then 'pop' sound should load from "assets/audio/pop.mp3"
  And 'letter-a' sound should load from "assets/audio/letters/A.mp3"
  And both sounds should be ready before create()
  And no loading errors should occur
```

## Scenario: Play Pop Sound on Click

```gherkin
Scenario: Immediate pop sound feedback
  Given the bubble is interactive
  And audio assets are loaded
  When the player clicks the bubble
  Then the 'pop' sound should play immediately
  And the sound should be audible
  And the sound should play at normal volume
  And the sound should complete without errors
```

## Scenario: Play Letter Sound After Delay

```gherkin
Scenario: Letter audio reinforcement
  Given the player has clicked the bubble
  And the pop sound has started playing
  When 100 milliseconds have elapsed
  Then the 'letter-a' sound should play
  And the letter audio should be clear
  And the letter audio should say "A"
  And the audio should help teach letter recognition
```

## Scenario: Scale Up Animation

```gherkin
Scenario: Bubble grows on pop
  Given the player has clicked the bubble
  When the pop animation starts
  Then the bubble should scale from 1.0 to 1.5
  And scaleX should increase smoothly
  And scaleY should increase smoothly
  And the animation should take 300 milliseconds
  And the scaling should use Power2 easing
```

## Scenario: Fade Out Animation

```gherkin
Scenario: Bubble fades away
  Given the player has clicked the bubble
  When the pop animation starts
  Then the bubble alpha should decrease from 1.0 to 0.0
  And the fade should be smooth
  And the fade should take 300 milliseconds
  And the fade should use Power2 easing
  And the fade should run simultaneously with scaling
```

## Scenario: Animate Both Bubble and Text

```gherkin
Scenario: Coordinate multiple game objects
  Given the bubble has a sprite and text child
  When the pop animation starts
  Then both the bubble sprite should animate
  And the letter text should animate
  And both should scale to 1.5x
  And both should fade to alpha 0
  And both should stay synchronized
```

## Scenario: Prevent Multiple Clicks

```gherkin
Scenario: Disable interaction after first click
  Given the player has clicked the bubble once
  When the pop animation is running
  Then the bubble should call disableInteractive()
  And subsequent clicks should have no effect
  And the animation should complete uninterrupted
  And no duplicate sounds should play
```

## Scenario: Destroy Bubble After Animation

```gherkin
Scenario: Clean up after pop animation
  Given the pop animation has started
  When the tween duration completes (300ms)
  Then the onComplete callback should fire
  And the bubble sprite should be destroyed
  And the letter text should be destroyed
  And the objects should be removed from the scene
  And memory should be freed
```

## Scenario: Complete Pop Sequence

```gherkin
Scenario: Full bubble pop interaction
  Given a bubble "A" is floating at (400, 500)
  And the bubble is interactive
  And audio is loaded
  When the player clicks the bubble at time T
  Then at T+0ms the bubble becomes non-interactive
  And at T+0ms the 'pop' sound plays
  And at T+0ms the scale/fade animation starts
  And at T+100ms the 'letter-a' sound plays
  And at T+300ms the animation completes
  And at T+300ms the bubble is destroyed
  And the sequence feels smooth and satisfying
```

## Scenario: Visual Feedback Quality

```gherkin
Scenario: Pop animation is polished
  Given the player clicks the bubble
  When the animation plays
  Then the scaling should be smooth (not jumpy)
  And the fading should be smooth (not flickering)
  And the easing should feel natural
  And the 300ms duration should feel snappy
  And the visual feedback should be satisfying
```

## Scenario: Audio Quality

```gherkin
Scenario: Sound effects are clear
  Given the player pops a bubble
  When the sounds play
  Then the pop sound should be satisfying
  And the pop volume should not be too loud
  And the letter audio should be clear
  And the letter audio should be child-friendly
  And both sounds should play without clipping
  And the 100ms delay should prevent overlap
```

## Scenario: Mobile Touch Support

```gherkin
Scenario: Tap interaction on mobile
  Given the game is running on a mobile device
  And a bubble is on screen
  When the player taps the bubble with their finger
  Then the bubble should respond immediately
  And the same pop sequence should occur
  And touch should work as well as mouse click
  And there should be no delay or lag
```

## Scenario: Error Handling - Missing Audio

```gherkin
Scenario: Handle missing audio files gracefully
  Given the pop sound file is missing
  When the player clicks a bubble
  Then the animation should still run
  And the console should log an error
  And the game should not crash
  And the bubble should still be destroyed
```

## Scenario: Error Handling - Rapid Clicks

```gherkin
Scenario: Handle multiple rapid clicks
  Given a bubble is on screen
  When the player clicks the bubble 5 times rapidly
  Then only the first click should register
  And the bubble should become non-interactive
  And only one pop animation should play
  And only one set of sounds should play
  And no errors should occur
```

## Scenario: Browser Compatibility

```gherkin
Scenario Outline: Cross-browser audio support
  Given the game is running in <browser>
  When the player clicks a bubble
  Then the pop sound should play correctly
  And the letter sound should play correctly
  And the animation should run smoothly
  And no console errors should occur

  Examples:
    | browser          |
    | Chrome           |
    | Firefox          |
    | Safari           |
    | Edge             |
```

## Acceptance Criteria

### Must Have
- [ ] Bubble is interactive (setInteractive called)
- [ ] Click/tap triggers onPop() method
- [ ] Pop sound plays immediately on click
- [ ] Letter "A" audio plays 100ms after click
- [ ] Bubble scales from 1.0 to 1.5 over 300ms
- [ ] Bubble fades from alpha 1.0 to 0.0 over 300ms
- [ ] Both bubble and text animate together
- [ ] Power2 easing is applied
- [ ] disableInteractive() prevents multiple clicks
- [ ] destroy() removes bubble after animation
- [ ] No console errors

### Audio Requirements
- [ ] Pop sound is satisfying and clear
- [ ] Letter audio is clear and educational
- [ ] 100ms delay prevents audio overlap
- [ ] Sounds play at appropriate volume
- [ ] Audio works on desktop and mobile

### Animation Requirements
- [ ] Scaling is smooth (no jumps)
- [ ] Fading is smooth (no flicker)
- [ ] 300ms duration feels snappy
- [ ] Easing feels natural (Power2)
- [ ] Both objects stay synchronized

### Interaction Requirements
- [ ] Hover shows cursor change (desktop)
- [ ] Click registers immediately
- [ ] Tap registers immediately (mobile)
- [ ] Second click has no effect
- [ ] No input lag

### Cleanup Requirements
- [ ] Bubble sprite is destroyed
- [ ] Letter text is destroyed
- [ ] No memory leaks
- [ ] No orphaned tweens
- [ ] Scene state is clean

## Edge Cases to Test

```gherkin
Scenario: Click During Float Animation
  Given a bubble is floating upward
  And the float animation is running
  When the player clicks the bubble
  Then both animations should run
  And the pop animation should take precedence
  And the bubble should still be destroyed

Scenario: Audio Disabled in Browser
  Given the browser has audio disabled
  When the player clicks a bubble
  Then the animation should still work
  And the bubble should still be destroyed
  And no errors should occur

Scenario: Click at Edge of Bubble
  Given a bubble is on screen
  When the player clicks at the very edge of the bubble
  Then the click should still register
  And the pop sequence should trigger

Scenario: Bubble Destroyed While Sound Playing
  Given the player clicked a bubble
  And the letter audio is playing
  When the bubble is destroyed at 300ms
  Then the audio should continue playing
  And the audio should not be cut off

Scenario: Multiple Bubbles, Single Click
  Given multiple bubbles are on screen
  When the player clicks bubble A
  Then only bubble A should pop
  And other bubbles should remain unaffected
  And only bubble A's letter should play
```

## Manual Testing Checklist

### Setup
1. [ ] Phase 7 completed (bubble spawns and floats)
2. [ ] Pop sound file exists and works
3. [ ] Letter A audio file exists and works
4. [ ] Game loads without errors

### Interaction Testing
5. [ ] Hover over bubble (cursor changes)
6. [ ] Click bubble
7. [ ] Verify immediate pop sound
8. [ ] Verify letter audio after ~100ms
9. [ ] Watch animation complete
10. [ ] Verify bubble disappears
11. [ ] Try clicking same spot again (nothing happens)

### Animation Testing
12. [ ] Bubble scales up smoothly
13. [ ] Bubble fades out smoothly
14. [ ] Letter text stays centered during scale
15. [ ] Animation takes about 300ms
16. [ ] Easing looks natural

### Audio Testing
17. [ ] Pop sound is clear
18. [ ] Pop sound not too loud
19. [ ] Letter audio is clear
20. [ ] Letter audio says "A" correctly
21. [ ] No audio clipping or distortion

### Mobile Testing
22. [ ] Test on mobile device
23. [ ] Tap bubble with finger
24. [ ] Verify all effects work
25. [ ] Verify touch is responsive

### Error Testing
26. [ ] Try rapid clicking
27. [ ] Check console for errors
28. [ ] Verify no memory leaks
29. [ ] Test with audio muted

## Success Criteria

**This phase is complete when:**
1. Bubble is interactive and responds to clicks/taps
2. Pop sound plays immediately on click
3. Letter audio plays 100ms after click
4. Bubble scales to 1.5x and fades to 0 over 300ms
5. Animation is smooth with Power2 easing
6. Both bubble and text animate together
7. Multiple clicks are prevented (disabled after first)
8. Bubble is properly destroyed after animation
9. No console errors occur
10. Works on both desktop and mobile
11. All manual tests pass
12. Ready to proceed to Phase 9

## Notes

**What We're Testing**
- Phaser input system (setInteractive, pointerdown)
- Phaser sound system (load, play, delayed play)
- Phaser tween system (scale, alpha, easing)
- Phaser timing system (delayedCall)
- Phaser memory management (destroy)

**What Makes a Good Pop**
- Immediate visual response (no lag)
- Satisfying sound effect (not annoying)
- Smooth animation (no jank)
- Clear audio reinforcement (educational)
- Proper cleanup (no artifacts)

**Learning Goals for Player**
- Cause and effect (click → pop)
- Letter recognition (audio says "A")
- Positive reinforcement (satisfying feedback)
- Motor skills (clicking/tapping accuracy)

**Technical Validation**
- Events work correctly
- Tweens interpolate smoothly
- Sounds play in sequence
- Objects are properly destroyed
- No performance issues

This is the core mechanic. It must feel great to pop bubbles!
