# Phase 40: Dance & Trace - Polish - BDD Scenarios

## Feature: Premium Visual and Audio Polish

```gherkin
Feature: Production-Quality Dance & Trace Experience
  As Aurora
  I want a beautiful, smooth, and therapeutic tracing experience
  So that I feel engaged, calm, and proud while learning letters

Background:
  Given Phases 37-39 are complete and functional
  And I am in the Dance & Trace scene
  And all basic features are working
```

## Scenario: Enhanced Trail with Glow Effect

```gherkin
Scenario: Render glowing trail as I trace
  Given I am tracing letter 'A'
  When I move my finger along the path
  Then two graphics layers should render:
    | Layer | Width | Opacity | Order   |
    | Glow  | 22px  | 0.3     | Bottom  |
    | Trail | 14px  | 0.9     | Top     |
  And the glow should be the same rainbow color as the trail
  And the glow should create a soft aura around the trail
  And the effect should look professional and magical
  And the trail should stand out clearly on the background

Scenario: Trail segments fade in smoothly
  Given I start tracing
  When a new trail segment is added
  Then the segment should start at alpha 0.5
  And it should fade to alpha 0.9 over 200ms
  And the fade should use a smooth easing function
  And the effect should look like smooth drawing
  And no harsh sudden appearances should occur
```

## Scenario: Sparkle Particles Along Trail

```gherkin
Scenario: Emit sparkles as tracing progresses
  Given I am tracing along the path
  When I add 10 trail points
  Then 2 sparkle particles should emit at the current position
  And sparkles should be small white circles (4-6 pixels)
  And sparkles should drift upward (anti-gravity: -50)
  And sparkles should fade out over 500ms
  And sparkles should have 100% initial alpha
  And sparkles should use 'ADD' blend mode for glow
  And the effect should look like magic dust
  When I continue tracing 10 more points
  Then 2 more sparkles should emit
  And sparkles should accumulate along the trail
  And the total active sparkles should be limited to 50

Scenario: Sparkles enhance visual feedback
  Given sparkles are emitting as I trace
  When I view the overall effect
  Then the combination should feel:
    | Quality      | Assessment              |
    | Magical      | Yes, whimsical sparkles |
    | Professional | Yes, polished effect    |
    | Distracting  | No, subtle and gentle   |
    | Therapeutic  | Yes, calming and pretty |
  And Aurora should feel proud of creating the sparkling trail
```

## Scenario: Smooth Starting Indicator Animation

```gherkin
Scenario: Enhanced pulsing animation
  Given the starting indicator is visible
  When the animation plays
  Then the circle should pulse in scale from 1.0 to 1.3
  And the pulse should use Sine.easeInOut easing
  And the duration should be 1000ms per cycle
  And the alpha should fade from 0.8 to 0.5
  And the circle should rotate ±5 degrees gently
  And the color should shift slightly (green to light green)
  And the combined effect should feel inviting and dynamic
  And the animation should loop infinitely until touched
```

## Scenario: Letter Path Fades In Sequentially

```gherkin
Scenario: Dots fade in one by one when letter loads
  Given letter 'A' is being loaded
  And letter A has 60 dotted path points
  When the path is rendered
  Then dots should fade in sequentially:
    | Time   | Dots Visible |
    | 0ms    | 0            |
    | 100ms  | 5            |
    | 500ms  | 25           |
    | 1000ms | 50           |
    | 1200ms | 60 (all)     |
  And each dot should start at alpha 0
  And each dot should fade to alpha 0.7 over 100ms
  And there should be 20ms delay between dots
  And the effect should look like the letter is drawing itself
  And the total animation should take ~1 second
```

## Scenario: Background Music Management

```gherkin
Scenario: Music starts when scene loads
  Given I just entered Dance & Trace scene
  When the scene create() method completes
  Then background music should start playing
  And the music should loop seamlessly
  And the music should start at volume 0
  And the music should fade in to volume 0.5 over 2 seconds
  And the fade should use Sine.easeIn easing
  And the music should be calming and instrumental
  And the music should be 90-110 BPM (relaxing tempo)
  And the music should have no lyrics (avoid distraction)

Scenario: Music ducks during voice instructions
  Given background music is playing at volume 0.5
  When a voice instruction plays ("Let's trace the letter A!")
  Then the music volume should duck to 0.15 over 500ms
  And the music should continue playing (not pause)
  When the voice instruction finishes
  Then the music volume should restore to 0.5 over 500ms
  And the transition should be smooth and unnoticeable

Scenario: Music pauses during celebrations
  Given I complete a letter
  When the fireworks celebration begins
  Then the music should fade out to volume 0 over 1 second
  And the music should pause (not stop)
  And the fireworks and celebration sounds should be clear
  When the celebration ends (after 4 seconds)
  Then the music should resume playing
  And the music should fade in to volume 0.5 over 1 second
  And the music should resume from where it paused (not restart)

Scenario: Music fades out when exiting scene
  Given I click the exit button
  When transitioning to main menu
  Then the music should fade out to volume 0 over 2 seconds
  And the music should stop after fade completes
  And the fade should use Sine.easeOut easing
  And no abrupt silence should occur
```

## Scenario: Complete Letter Formation Data

```gherkin
Scenario: All 26 letters have stroke data
  Given the letterStrokes.json file is loaded
  When I inspect the data
  Then the following letters should all be present:
    | Letters                     |
    | A B C D E F G H I J K L M   |
    | N O P Q R S T U V W X Y Z   |
  And each letter should have complete stroke information:
    | Property    | Required |
    | strokes     | Yes      |
    | startPoint  | Yes      |
    | scale       | Optional |
    | category    | Yes      |
    | difficulty  | Yes      |

Scenario: Letter categories are accurate
  Given all 26 letters are loaded
  When I categorize them
  Then the following should be true:
    | Category | Count | Examples        |
    | Simple   | 9     | C, I, J, L, O, S, U, V, Z |
    | Medium   | 10    | A, D, F, G, P, T, X, Y    |
    | Complex  | 7     | B, E, H, K, M, N, R, W    |
  And each letter should trace correctly
  And stroke order should be pedagogically sound
  And proportions should be visually balanced

Scenario: Test all letters for traceability
  Given I test each letter A-Z individually
  When tracing each letter
  Then all letters should:
    | Quality           | Expected |
    | Traceable         | Yes      |
    | Hitbox coverage   | Complete |
    | Starting point    | Obvious  |
    | Proportions       | Balanced |
    | Stroke order      | Correct  |
  And no letter should be impossible or frustrating to trace
```

## Scenario: Haptic Feedback on Mobile

```gherkin
Scenario: Haptic support detection
  Given I am playing on a mobile device
  When the HapticManager initializes
  Then it should check if navigator.vibrate exists
  And if supported, isSupported should be true
  And if not supported, isSupported should be false
  And haptic methods should safely do nothing if not supported

Scenario: Trace start haptic
  Given haptic feedback is supported and enabled
  When I touch the starting indicator
  And tracing begins
  Then a 20ms vibration pulse should trigger
  And the pulse should be light and subtle
  And the pulse should confirm tracing started

Scenario: Trace progress haptic
  Given I am tracing along the path
  When I add 10 trail points
  Then a 15ms vibration pulse should trigger
  And this should repeat every 10 points
  And the pulses should provide continuous tactile feedback
  And the pulses should not be overwhelming or annoying

Scenario: Stroke complete haptic
  Given I reach 90% of a stroke
  When the stroke completes
  Then a 30ms vibration pulse should trigger
  And the pulse should be medium strength
  And the pulse should celebrate the stroke completion

Scenario: Letter complete haptic pattern
  Given I complete all strokes of a letter
  When the letter completion triggers
  Then a celebratory vibration pattern should play:
    | Pulse | Duration | Delay After |
    | 1     | 50ms     | 100ms       |
    | 2     | 50ms     | 100ms       |
    | 3     | 50ms     | 0ms         |
  And the pattern should feel joyful and rhythmic
  And the total pattern should last 350ms

Scenario: Star earn haptic pattern
  Given a star animates in on the round summary
  When the star appears with the "ding" sound
  Then a vibration pattern should play:
    | Pulse | Duration | Delay After |
    | 1     | 20ms     | 100ms       |
    | 2     | 20ms     | 100ms       |
    | 3     | 20ms     | 0ms         |
  And this should happen for each earned star
  And the pattern should match the audio rhythm

Scenario: Respect haptic settings
  Given the user has disabled haptic feedback in settings
  When any haptic event triggers
  Then no vibration should occur
  And the game should function normally
  And no errors should log
```

## Scenario: Performance Optimization

```gherkin
Scenario: Limit trail points for memory efficiency
  Given I am tracing a very long path
  When the trail exceeds 300 points
  Then the oldest points should be removed
  And only the most recent 300 points should remain
  And the trail should still look continuous
  And memory usage should remain stable

Scenario: Limit active particles
  Given sparkles are emitting as I trace
  When the active particle count exceeds 50
  Then the oldest particles should be removed
  And only 50 particles should be active at once
  And the visual effect should remain satisfying
  And performance should remain at 60 FPS

Scenario: Monitor frame rate
  Given the scene is running
  When the PerformanceOptimizer monitors FPS
  Then if FPS >= 55
  Then all effects should remain enabled (full quality)
  And if FPS drops to 45-55 for 3 seconds
  Then the glow layer should be disabled
  And sparkle rate should be reduced by 50%
  And trail points should be limited to 200
  And if FPS drops below 30 for 5 seconds
  Then all particles should be disabled
  And only the simple trail should render
  And trail points should be limited to 100
  And the game should remain playable

Scenario: Performance recovers gracefully
  Given the system entered low power mode due to poor FPS
  When the FPS recovers to 55+
  Then effects should gradually re-enable:
    | FPS   | Action                  |
    | 45+   | Re-enable glow          |
    | 50+   | Re-enable sparkles 50%  |
    | 55+   | Re-enable all effects   |
  And the transition should be smooth
  And the user should not notice jarring changes
```

## Scenario: Accessibility Features

```gherkin
Scenario: Colorblind mode option
  Given I have deuteranopia (red-green colorblindness)
  When I enable colorblind mode in settings
  Then the rainbow trail colors should change to:
    | Standard | Colorblind Palette  |
    | Red      | Blue                |
    | Orange   | Purple              |
    | Yellow   | Yellow (unchanged)  |
    | Green    | Cyan                |
    | Blue     | Dark Blue           |
    | Purple   | Pink                |
  And all colors should be distinguishable
  And the trail should remain beautiful

Scenario: High contrast mode
  Given I have visual impairment
  When I enable high contrast mode
  Then the trail should use grayscale:
    | Progress | Color      |
    | 0.0      | White      |
    | 0.25     | Light Gray |
    | 0.5      | Medium Gray|
    | 0.75     | Dark Gray  |
    | 1.0      | Black      |
  And the contrast should be strong
  And the path dots should be 10 pixels (larger)
  And the trail should be 18 pixels wide (thicker)

Scenario: Increase dot size
  Given I find the default dots (6px) hard to see
  When I increase the dot size to 10 pixels in settings
  Then all letter path dots should render at 10 pixels
  And the path should be clearer and easier to follow
  And the setting should persist across sessions

Scenario: Show handwriting guidelines
  Given I want help with letter proportions
  When I enable "Show Guidelines" in settings
  Then horizontal guideline lines should appear:
    | Line        | Position | Style   |
    | Top line    | y: 250   | Dashed  |
    | Middle line | y: 320   | Solid   |
    | Bottom line | y: 390   | Dashed  |
  And the lines should be subtle (gray, 30% opacity)
  And the lines should help with letter height consistency
```

## Scenario: Loading Screen

```gherkin
Scenario: Show loading screen while assets load
  Given I am loading Dance & Trace scene
  When the preload() phase is active
  Then a loading screen should display
  And the screen should show:
    | Element         | Content              |
    | Title           | "Loading..."         |
    | Progress bar    | 0-100% fill          |
    | Animated dots   | "..." pulsing        |
  And the progress bar should update as assets load
  When all assets are loaded
  Then the loading screen should fade out over 500ms
  And the main scene should fade in over 500ms
  And the transition should be smooth
```

## Scenario: First-Time Tutorial

```gherkin
Scenario: Detect first-time player
  Given I have never played Dance & Trace before
  When the scene loads for the first time
  Then localStorage should be checked for 'danceTraceTutorialSeen'
  And if the flag is not present
  Then the tutorial should be shown

Scenario: Display tutorial overlay
  Given this is my first time playing
  When the tutorial displays
  Then a semi-transparent overlay should cover the scene
  And a tutorial box should appear in the center
  And the box should contain:
    | Element          | Content                          |
    | Title            | "How to Play"                    |
    | Instruction 1    | "Follow the dotted path"         |
    | Instruction 2    | "Start at the green circle"      |
    | Instruction 3    | "Trace the letter with your finger" |
    | Example animation| Animated tracing demonstration  |
    | Button           | "Got it!"                        |
  And the tutorial should be friendly and clear

Scenario: Dismiss tutorial
  Given the tutorial is showing
  When I click "Got it!"
  Then the tutorial overlay should fade out
  And the main scene should become interactive
  And localStorage should be set: 'danceTraceTutorialSeen' = true
  And the tutorial should never show again
  And the game should begin normally
```

## Scenario: Congratulations Screen (First Round)

```gherkin
Scenario: Special celebration for first-ever completion
  Given I have completed my first-ever Dance & Trace round
  And localStorage does not have 'danceTraceFirstRoundComplete'
  When the round summary displays
  Then instead of the normal summary
  Then a special congratulations screen should show:
    | Element           | Content                            |
    | Title             | "Amazing! You did it!"             |
    | Subtitle          | "You traced your first 5 letters!" |
    | Large celebration | Extra fireworks animation          |
    | Badge             | "Dance & Trace Champion" badge     |
    | Encouragement     | "You're learning so fast!"         |
    | Continue button   | "Keep Playing!"                    |
  And special celebratory music should play
  And the screen should feel extra special

Scenario: Mark first round complete
  Given the first-round congratulations screen is showing
  When I click "Keep Playing!"
  Then localStorage should be set: 'danceTraceFirstRoundComplete' = true
  And the special screen should never show again
  And future completions should show the normal summary
  And my progress should be saved
```

## Scenario: Enhanced Button Interactions

```gherkin
Scenario: Button hover state
  Given I am using a mouse (desktop)
  When I hover over a button (Play Again, Main Menu, etc.)
  Then the button should:
    | Property   | Change          |
    | Scale      | Increase to 1.05|
    | Brightness | Increase 20%    |
    | Cursor     | Change to pointer|
  And the animation should use Back.easeOut easing
  And the transition should take 200ms
  When I move the mouse away
  Then the button should return to normal
  And the transition should be smooth

Scenario: Button press state
  Given I click a button
  When the mouse/touch is down
  Then the button should scale to 0.95
  And the brightness should decrease 10%
  When I release
  Then the button should return to normal
  And the button action should trigger
```

## Scenario: Error Handling

```gherkin
Scenario: Handle missing audio file gracefully
  Given the 'great-job' audio file is missing
  When the letter completion tries to play it
  Then the system should catch the error
  And log a warning to console: "Audio file missing: great-job"
  And the celebration should continue without the audio
  And the game should not crash
  And the user should not see an error message

Scenario: Handle missing letter data
  Given letter 'Q' data is missing from letterStrokes.json
  When the system tries to load letter 'Q'
  Then the system should log an error
  And a fallback letter 'O' should be used instead
  And a warning should display: "Some letters unavailable"
  And the game should continue functioning

Scenario: Handle localStorage failure
  Given localStorage is blocked (private browsing mode)
  When trying to save progress
  Then the system should catch the error
  And log a warning: "Cannot save progress (storage unavailable)"
  And the game should continue without saving
  And the user should be notified: "Progress not saved this session"
```

## Acceptance Criteria

### Must Have - Visual Polish
- [ ] Trail has glow effect (2 layers)
- [ ] Sparkles emit along trail (2 per 10 points)
- [ ] Trail segments fade in smoothly
- [ ] Starting indicator pulses smoothly with rotation
- [ ] Letter path dots fade in sequentially
- [ ] All animations use smooth easing
- [ ] Buttons have hover and press states

### Must Have - Audio
- [ ] Background music plays and loops
- [ ] Music fades in/out smoothly (2 seconds)
- [ ] Music ducks during voice instructions
- [ ] Music pauses during celebrations
- [ ] Music resumes after celebrations
- [ ] Volume respects settings

### Must Have - Letter Data
- [ ] All 26 letters A-Z have complete data
- [ ] All letters traceable and validated
- [ ] Stroke order is pedagogically correct
- [ ] Proportions are visually balanced
- [ ] Categories assigned correctly

### Must Have - Haptics
- [ ] Haptic support detected correctly
- [ ] Trace start pulse (20ms)
- [ ] Trace progress pulse (15ms, every 10 points)
- [ ] Stroke complete pulse (30ms)
- [ ] Letter complete pattern (3 pulses)
- [ ] Star earn pattern (3 pulses)
- [ ] Respects user settings

### Must Have - Performance
- [ ] Maintains 60 FPS during normal operation
- [ ] Trail limited to 300 points
- [ ] Particles limited to 50 active
- [ ] FPS monitoring active
- [ ] Graceful degradation on low FPS
- [ ] Memory usage stable

### Must Have - Accessibility
- [ ] Colorblind mode available
- [ ] High contrast mode available
- [ ] Dot size adjustable
- [ ] Guidelines option available
- [ ] All settings persist

### Must Have - UX Polish
- [ ] Loading screen during asset load
- [ ] First-time tutorial shown once
- [ ] Congratulations screen on first completion
- [ ] Error handling graceful
- [ ] No crashes on edge cases

### Visual Quality
- [ ] Premium feel throughout
- [ ] Smooth 60 FPS animations
- [ ] Beautiful rainbow trail with glow
- [ ] Satisfying sparkle effects
- [ ] Professional polish

### Audio Quality
- [ ] Calming background music
- [ ] Appropriate volume levels
- [ ] Smooth transitions
- [ ] No audio clipping

## Success Criteria

**This phase is complete when:**
1. Trail rendering is beautiful (glow + sparkles)
2. All animations are silky smooth
3. Background music enhances the experience
4. All 26 letters are complete and validated
5. Haptic feedback works on mobile
6. Performance is rock-solid (60 FPS)
7. Accessibility options are available
8. Loading, tutorial, and congratulations screens implemented
9. Error handling is robust
10. The overall experience feels premium and therapeutic
11. Zero crashes or visual glitches
12. Aurora (or test users) report it feels special
13. Dance & Trace is PRODUCTION READY!

This phase transforms Dance & Trace from functional to extraordinary - a truly therapeutic, engaging learning experience.
