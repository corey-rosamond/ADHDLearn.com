# Phase 15: Particle Effects - Celebration - BDD Scenarios

## Feature: Particle Effects for Correct Answers

```gherkin
Feature: Particle Celebration Effects
  As Aurora (a 5-year-old with ADHD)
  I want to see exciting particle effects when I click the correct bubble
  So that I get immediate visual reward and feel celebrated for my success

Background:
  Given the game is loaded
  And particle textures are generated
  And particle emitters are configured
  And LetterPopScene is active
  And a letter is displayed with bubbles
```

## Scenario: Particle Burst on Correct Answer

```gherkin
Scenario: Trigger particle celebration when correct bubble clicked
  Given I am on letter "A" with bubbles
  And the correct bubble is at position (300, 400)
  When I click the correct bubble
  Then particle emitters should be positioned at (300, 400)
  And circle emitter should explode with 20 particles
  And star emitter should explode with 10 particles
  And particles should burst outward in all directions
  And the correct sound should play simultaneously
  And the bubble should fade and scale out
```

## Scenario: Particle Visual Properties

```gherkin
Scenario: Particles have correct visual appearance
  Given a particle burst has been triggered
  When I observe the particles
  Then particles should have multiple colors
  And colors should include red, yellow, green, blue, magenta, orange, and pink
  And particles should include both circles and stars
  And circle particles should be round
  And star particles should be 5-pointed stars
  And all particles should be clearly visible
  And particles should have a glowing appearance
```

## Scenario: Particle Animation Lifecycle

```gherkin
Scenario: Particles animate through complete lifecycle
  Given a particle burst has been triggered at position (400, 300)
  When I watch a single particle
  Then the particle should start at position (400, 300)
  And the particle should move outward at speed 200-400 px/s
  And the particle should have a random angle 0-360 degrees
  And the particle should rotate while moving
  And the particle should fall downward due to gravity
  And the particle should shrink from scale 1.0 to scale 0.2
  And the particle should fade from alpha 1.0 to alpha 0.0
  And the particle should exist for approximately 1500-1800 milliseconds
  And the particle should disappear completely after its lifespan
```

## Scenario: Particle Physics Behavior

```gherkin
Scenario: Particles behave with realistic physics
  Given a particle burst has been triggered
  When particles are emitted
  Then each particle should have initial velocity based on angle
  And particles should spread in a full 360-degree circle
  And particles should apply gravity of 300 px/s²
  And particles should accelerate downward over time
  And particles should follow curved trajectories (parabolic)
  And faster particles should travel further
  And all particles should eventually fall off screen or fade out
```

## Scenario: Multiple Particle Colors

```gherkin
Scenario Outline: Particles display varied colors
  Given a particle burst has been triggered
  When I observe particle colors
  Then I should see particles with tint color <color_hex>
  And the color should be vibrant and clear
  And particles of different colors should appear in same burst

  Examples:
    | color_hex | color_name |
    | 0xFF0000  | Red        |
    | 0xFFFF00  | Yellow     |
    | 0x00FF00  | Green      |
    | 0x00FFFF  | Cyan       |
    | 0x0000FF  | Blue       |
    | 0xFF00FF  | Magenta    |
    | 0xFFA500  | Orange     |
    | 0xFF1493  | Pink       |
```

## Scenario: Particle Layering and Depth

```gherkin
Scenario: Particles appear in correct visual layer
  Given the game scene has multiple visual layers
  And background is at depth 0-10
  And bubbles are at depth 50
  And UI elements are at depth 200
  When particle effects are triggered
  Then particles should be at depth 100
  And particles should appear above the bubbles
  And particles should appear below the progress text
  And particles should appear below the letter display
  And particles should not obstruct UI readability
```

## Scenario: Particle Performance with Single Burst

```gherkin
Scenario: Single particle burst maintains performance
  Given the game is running at 60 FPS
  When I trigger a particle burst of 30 particles
  Then the frame rate should remain at 55-60 FPS
  And the animation should be smooth
  And there should be no visible lag or stuttering
  And gameplay should continue without delay
```

## Scenario: Multiple Rapid Particle Bursts

```gherkin
Scenario: Handle rapid successive particle bursts
  Given I am playing Letter Pop
  When I answer 3 letters correctly in quick succession
  Then I should see 3 separate particle bursts
  And each burst should have 30 particles (90 total active)
  And the frame rate should remain above 50 FPS
  And all particle animations should play smoothly
  And particles should not accumulate excessively
  And dead particles should be recycled to the pool
```

## Scenario: Particle Memory Management

```gherkin
Scenario: Particles use object pooling efficiently
  Given the particle system is initialized
  When particle emitters are created
  Then a pool of 50 particles should be pre-allocated
  And the maximum active particles should be limited to 100
  When a burst is triggered
  Then particles should be drawn from the pool
  When particles die
  Then particles should return to the pool for reuse
  And no new particle objects should be created at runtime
  And memory usage should remain stable
```

## Scenario: Particle Burst Position Accuracy

```gherkin
Scenario: Particles burst from correct bubble position
  Given I have bubbles at different positions
  And bubble A is at position (200, 350)
  And bubble B is at position (400, 250)
  And bubble C is at position (600, 350)
  When I click bubble B (the correct one at 400, 250)
  Then particles should burst from position (400, 250)
  And particles should radiate from that exact center point
  And particles should not burst from other bubble positions
```

## Scenario: Particle Timing Coordination

```gherkin
Scenario: Particles coordinate with other feedback
  Given I click the correct bubble at time T=0
  When the correct answer is registered
  Then at T=0ms particles should start bursting
  And at T=0ms correct sound should play
  And at T=0ms bubble should start scaling/fading
  And at T=300ms bubble should be destroyed
  And at T=500ms delay before next letter should start
  And at T=800ms next letter should appear
  And at T=1500ms particles should be completing/fading
  And particles should not block next letter display
```

## Scenario: Particle Effect Satisfies Player

```gherkin
Scenario: Particle effect creates satisfying celebration
  Given Aurora clicks a correct bubble
  When the particle burst occurs
  Then the effect should be visually exciting
  And the effect should feel rewarding
  And the effect should be colorful and dynamic
  And the effect should match the celebratory feeling
  And the effect should not be too subtle
  And the effect should not be overwhelming or distracting
  And the duration should feel just right (not too long)
```

## Scenario: No Particles on Incorrect Answer

```gherkin
Scenario: Particles only appear for correct answers
  Given I am on a letter with bubbles
  When I click an incorrect bubble
  Then no particle burst should occur
  And no circle particles should appear
  And no star particles should appear
  And only the incorrect sound should play
  And only incorrect visual feedback should show
  And the celebration is reserved for correct answers
```

## Scenario: Particle Textures Generated Correctly

```gherkin
Scenario: Particle textures created at boot
  Given the BootScene is running
  When particle textures are generated
  Then texture 'particle-circle' should be created
  And 'particle-circle' should be 16x16 pixels
  And 'particle-circle' should contain a white circle
  And texture 'particle-star' should be created
  And 'particle-star' should be 16x16 pixels
  And 'particle-star' should contain a 5-pointed star
  And texture 'particle-square' should be created
  And 'particle-square' should be 16x16 pixels
  And all textures should be available for emitters
```

## Scenario: Particle Rotation Animation

```gherkin
Scenario: Particles rotate while animating
  Given a particle burst is active
  When I observe individual particles
  Then each particle should have a rotation value
  And rotation should change over time
  And rotation should be between 0-720 degrees range
  And particles should appear to spin as they move
  And rotation should add visual interest to animation
```

## Scenario: Particle Gravity Effect

```gherkin
Scenario: Particles fall naturally with gravity
  Given a particle is emitted horizontally to the right
  And initial velocity is (300, 0) px/s
  When gravity of 300 px/s² is applied
  Then the particle should start moving straight right
  And the particle should gradually curve downward
  And the vertical velocity should increase over time
  And after 1 second, vertical velocity should be approximately 300 px/s
  And the particle path should form a parabolic arc
  And the motion should look natural and satisfying
```

## Scenario: Particle Scale Animation

```gherkin
Scenario: Particles shrink over their lifetime
  Given a particle is emitted with initial scale 1.0
  And the particle lifespan is 1500ms
  When I observe the particle at different times
  Then at T=0ms, scale should be 1.0
  And at T=750ms, scale should be approximately 0.6
  And at T=1500ms, scale should be 0.2
  And the scale should decrease smoothly over time
  And the shrinking should be linear or eased
```

## Scenario: Particle Alpha Fade

```gherkin
Scenario: Particles fade out smoothly
  Given a particle is emitted with initial alpha 1.0
  And the particle lifespan is 1500ms
  When I observe the particle transparency
  Then at T=0ms, alpha should be 1.0 (fully opaque)
  And at T=750ms, alpha should be approximately 0.5
  And at T=1500ms, alpha should be 0.0 (fully transparent)
  And the fade should be smooth and continuous
  And there should be no abrupt disappearance
```

## Scenario: Particle Blend Mode Effect

```gherkin
Scenario: Particles use ADD blend mode for glow
  Given particles are configured with blend mode 'ADD'
  When particles overlap each other
  Then the overlapping areas should be brighter
  And particles should have a glowing appearance
  And the effect should look more vibrant than normal blend
  And the blend mode should enhance visual appeal
```

## Scenario: Particle Cleanup on Scene Shutdown

```gherkin
Scenario: Particles cleaned up when scene ends
  Given LetterPopScene is active with particle emitters
  And particles are currently animating
  When the scene transitions to ResultsScene
  And the shutdown() method is called
  Then all particle emitters should stop
  And all active particles should be killed
  And particle memory should be released
  And no particles should appear in the next scene
  And no memory leaks should occur
```

## Scenario: Particle Count Accuracy

```gherkin
Scenario: Correct number of particles emitted
  Given particle emitters are configured
  And circle emitter has quantity: 20
  And star emitter has quantity: 10
  When I trigger a particle burst
  Then exactly 20 circle particles should be emitted
  And exactly 10 star particles should be emitted
  And the total count should be 30 particles
  And I can verify count by observing emitter.getAliveParticleCount()
```

## Scenario: Particle Speed Variation

```gherkin
Scenario: Particles have varied speeds for dynamic effect
  Given a particle burst is triggered
  When particles are emitted
  Then each particle should have a speed between 200-400 px/s
  And speeds should be randomly distributed in this range
  And some particles should travel further than others
  And some particles should move slower than others
  And the variation should create a more organic effect
```

## Scenario: Complete Round with Particle Effects

```gherkin
Scenario: Particles enhance complete gameplay experience
  Given I start a new round of Letter Pop
  When I answer all 10 letters correctly
  Then I should see 10 particle bursts (one per correct answer)
  And each burst should be satisfying and exciting
  And the effects should maintain my engagement
  And the effects should not cause performance issues
  And the effects should not distract from learning
  And I should feel celebrated for each correct answer
  And the game should feel more polished and fun
```

## Acceptance Criteria

### Particle Creation
- [ ] Circle particle texture generated (16x16)
- [ ] Star particle texture generated (16x16)
- [ ] Square particle texture generated (16x16)
- [ ] Textures created in BootScene
- [ ] Textures available to emitters

### Particle Emitter Configuration
- [ ] Circle emitter created with correct config
- [ ] Star emitter created with correct config
- [ ] Emitters positioned at bubble center on burst
- [ ] Emitters set to explode mode (not continuous)
- [ ] Emitters have correct depth (100)

### Particle Properties
- [ ] Particles emit with speed 200-400 px/s
- [ ] Particles emit in all directions (360°)
- [ ] Particles have 8 different colors
- [ ] Particles scale from 1.0 to 0.2
- [ ] Particles fade from alpha 1.0 to 0.0
- [ ] Particles lifespan is 1500-1800ms
- [ ] Particles rotate while animating
- [ ] Particles fall with gravity (300 px/s²)

### Particle Triggering
- [ ] Particles burst on correct bubble click
- [ ] Burst positioned at bubble center
- [ ] Circle emitter emits 20 particles
- [ ] Star emitter emits 10 particles
- [ ] No particles on incorrect answer
- [ ] Timing coordinates with audio/visual feedback

### Visual Quality
- [ ] Particles are colorful and vibrant
- [ ] Particles have glowing appearance (ADD blend)
- [ ] Particles rotate smoothly
- [ ] Particles shrink smoothly
- [ ] Particles fade smoothly
- [ ] Particle paths are curved (gravity effect)
- [ ] Overall effect is satisfying and exciting

### Layering
- [ ] Particles appear above bubbles (depth 50)
- [ ] Particles appear below UI text (depth 200)
- [ ] Particles don't obstruct letter display
- [ ] Particles don't obstruct progress indicator
- [ ] Layering is correct throughout animation

### Performance
- [ ] Frame rate remains 55-60 FPS during single burst
- [ ] Frame rate remains >50 FPS during rapid bursts
- [ ] Particle pool pre-allocated (50 particles)
- [ ] Max active particles limited (100)
- [ ] Dead particles return to pool
- [ ] No memory leaks over multiple rounds
- [ ] Performance smooth on target devices

### Cleanup
- [ ] Particles killed on scene shutdown
- [ ] Emitters stopped on scene shutdown
- [ ] No particles persist to next scene
- [ ] Memory released properly

## Edge Cases to Test

```gherkin
Scenario: Maximum Particle Stress Test
  Given I answer 5 letters correctly very rapidly
  When all 5 particle bursts are active simultaneously
  Then total active particles should be approximately 150
  And the system should handle the load without crashing
  And older particles should die as new ones are created
  And frame rate should remain acceptable (>45 FPS)
  And the particle pool should manage the load

Scenario: Particle Burst at Screen Edge
  Given a bubble is positioned at screen edge (750, 50)
  When I click the correct bubble
  Then particles should burst from that position
  And some particles may travel off-screen
  And this should not cause errors or glitches
  And particles should still be cleaned up properly

Scenario: Very Fast Round Completion
  Given I answer all 10 letters in under 15 seconds
  When particle bursts are triggered rapidly
  Then all 10 bursts should display correctly
  And particles from different bursts should overlap
  And the overlapping should look good (ADD blend)
  And performance should remain smooth
  And no bursts should be skipped

Scenario: Particle Effect on First Letter
  Given I just started a new round
  And this is the very first letter
  When I click the correct bubble
  Then particles should burst normally
  And there should be no initialization issues
  And the effect should be identical to later bursts

Scenario: Particle Effect on Last Letter
  Given I am on letter 10 of 10
  When I click the correct bubble
  Then particles should burst normally
  And particles should continue animating
  And the scene should transition to results after delay
  And particles should be cleaned up during transition
  And no particles should appear on results screen

Scenario: Rapid Scene Transition During Particles
  Given particles are actively animating
  When the scene is forced to transition immediately
  And shutdown() is called
  Then all particles should be killed immediately
  And no errors should occur
  And the new scene should load cleanly
```

## Manual Testing Checklist

### Visual Verification
1. [ ] Click correct bubble
2. [ ] Observe particle burst
3. [ ] Count approximate particles (should be ~30)
4. [ ] Verify colors are varied and vibrant
5. [ ] Verify both circles and stars appear
6. [ ] Watch particles fall with gravity
7. [ ] Watch particles rotate/spin
8. [ ] Watch particles shrink
9. [ ] Watch particles fade out
10. [ ] Verify particles disappear after ~1.5-2 seconds

### Positioning Test
11. [ ] Click bubble in top-left
12. [ ] Verify particles burst from that position
13. [ ] Click bubble in bottom-right
14. [ ] Verify particles burst from that position
15. [ ] Click bubble in center
16. [ ] Verify particles burst from center

### Layering Test
17. [ ] Verify particles appear above bubbles
18. [ ] Verify particles don't cover letter text
19. [ ] Verify particles don't cover progress text
20. [ ] Verify UI remains readable during effect

### Performance Test
21. [ ] Answer 3 letters quickly in a row
22. [ ] Observe frame rate (should stay smooth)
23. [ ] Answer all 10 letters in a round
24. [ ] Verify no slowdown by letter 10
25. [ ] Play 3 complete rounds back-to-back
26. [ ] Verify no performance degradation

### Integration Test
27. [ ] Verify particle burst coordinates with correct sound
28. [ ] Verify particle burst coordinates with bubble fade
29. [ ] Verify next letter appears while particles animate
30. [ ] Verify particles don't block next letter interaction

### Edge Cases
31. [ ] Click correct bubble at screen edge
32. [ ] Answer 5 letters very rapidly
33. [ ] Verify system handles rapid bursts
34. [ ] Transition to results while particles active
35. [ ] Verify clean transition with no errors

### Negative Test
36. [ ] Click incorrect bubble
37. [ ] Verify NO particles appear
38. [ ] Verify only incorrect feedback shows

## Performance Benchmarks

```gherkin
Scenario: Performance Metrics
  Given the game is running on target device
  When particle effects are active
  Then frame rate should meet these benchmarks:
    | Scenario                  | Min FPS | Target FPS |
    | No particles              | 60      | 60         |
    | Single burst (30 particles)| 55      | 60         |
    | Double burst (60 particles)| 50      | 55         |
    | Triple burst (90 particles)| 45      | 50         |
    | Max particles (100)        | 40      | 45         |
  And memory usage should remain under 100MB
  And garbage collection should be minimal
```

## Accessibility Considerations

```gherkin
Scenario: Visual Clarity
  Given a player may have visual sensitivities
  When particle effects play
  Then particles should be bright but not strobing
  And particles should not flash rapidly
  And the effect should not cause eye strain
  And colorblind players should still see varied particles
  And the effect duration should be short (1.5-2s)

Scenario: Performance on Lower-End Devices
  Given the game runs on various devices
  When particle effects play on a slower device
  Then the game should detect performance issues
  And consider reducing particle count if FPS drops
  And the game should remain playable
  And visual quality may degrade gracefully
```

## Success Criteria

**This phase is complete when:**
1. Particle textures generated successfully
2. Particle emitters configured and working
3. Particles burst on every correct answer
4. 30 particles emit per burst (20 circles, 10 stars)
5. Particles have 8 varied colors
6. Particles radiate outward 360°
7. Particles fall with gravity effect
8. Particles rotate while moving
9. Particles shrink smoothly
10. Particles fade out smoothly
11. Particles positioned at bubble center
12. Particles appear above bubbles, below UI
13. Frame rate remains smooth (>50 FPS)
14. No memory leaks over multiple rounds
15. Particles cleaned up on scene transition
16. Effect is satisfying and celebratory
17. Effect doesn't obstruct gameplay
18. Tested thoroughly across devices
19. ADHD-friendly: exciting but not distracting
20. Ready to proceed to Phase 16 (audio encouragement)

## Notes

**Focus on Celebration**
- Particles are a reward, not just decoration
- The burst should feel satisfying and joyful
- Timing is critical: instant burst on click
- Colors should be vibrant and exciting
- Motion should be dynamic and organic

**Performance is Critical**
- Must maintain smooth 60fps
- Object pooling is essential
- Pre-allocation prevents runtime lag
- Limits prevent runaway particle creation
- Test on lowest-spec target device

**ADHD Design Validation**
- Short duration (1.5-2s) prevents distraction
- Immediate trigger provides instant feedback
- Non-blocking allows quick progression
- Visual variety maintains interest
- Exciting enough to feel rewarding
- Not overwhelming or overstimulating

**Integration Points**
- Coordinates with audio feedback
- Coordinates with bubble fade animation
- Coordinates with next letter timing
- Independent animation (doesn't block gameplay)
- Proper cleanup between scenes
