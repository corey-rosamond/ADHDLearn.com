# Phase 2.7.6: Settings Screen - BDD Acceptance Criteria

## Overview

This document defines the behavior-driven development (BDD) acceptance criteria for the Settings screen using Gherkin syntax. All scenarios must pass before Phase 2.7.6 is considered complete.

---

## Feature: Settings Screen Display

```gherkin
Feature: Settings Screen Display
  As Aurora
  I want to see a clear settings interface
  So that I can easily adjust audio levels

  Background:
    Given the app has finished loading
    And I am on the Main Menu screen
    When I tap the Settings button
    And the screen fade transition completes
    Then the Settings screen should be active

  Scenario: Initial screen rendering
    When the Settings screen loads
    Then I should see a gradient background from purple to pink
    And I should see the title "SETTINGS" near the top
    And I should see a "Master Volume" slider
    And I should see a "Voice Volume" slider
    And I should see a "Sound Volume" slider
    And I should see a "BACK" button at the bottom
    And I should see floating decorations moving across the screen
    And the screen should fill the entire display

  Scenario: Gradient background renders correctly
    When the Settings screen loads
    Then the background should be a smooth gradient
    And the gradient should transition from purple at top to pink at bottom
    And there should be no visible banding or artifacts
    And the gradient should cover the entire screen

  Scenario: Title text displays correctly
    When the Settings screen loads
    Then I should see the word "SETTINGS" in large text
    And the text should be centered horizontally
    And the text should be positioned 15% from the top
    And the text should be yellow with a purple border
    And the text should bounce in with an animation

  Scenario: Volume sliders display correctly
    When the Settings screen loads
    Then I should see three volume sliders
    And each slider should have a label on the left
    And each slider should show a percentage value on the right
    And each slider should have a dark purple bar background
    And each slider should have a yellow-to-orange gradient fill
    And each slider should have a white circular handle
    And the handles should have purple stroke outlines
```

---

## Feature: Volume Slider Interaction

```gherkin
Feature: Volume Slider Interaction
  As Aurora
  I want to drag sliders to adjust volume
  So that I can set audio to comfortable levels

  Background:
    Given the Settings screen is active
    And all sliders are visible

  Scenario: Master Volume slider drag
    Given the Master Volume is at 100%
    When I touch and drag the Master Volume handle to 50%
    Then the handle should move smoothly to the new position
    And the gradient fill should update to show 50% filled
    And the value display should show "50%"
    And the new volume should save to storage
    And the new volume should apply immediately

  Scenario: Voice Volume slider drag
    Given the Voice Volume is at 100%
    When I touch and drag the Voice Volume handle to 75%
    Then the handle should move smoothly to the new position
    And the gradient fill should update to show 75% filled
    And the value display should show "75%"
    And the new volume should save to storage
    And the new volume should apply immediately

  Scenario: Sound Volume slider drag
    Given the Sound Volume is at 100%
    When I touch and drag the Sound Volume handle to 25%
    Then the handle should move smoothly to the new position
    And the gradient fill should update to show 25% filled
    And the value display should show "25%"
    And the new volume should save to storage
    And the new volume should apply immediately

  Scenario: Click on slider bar to jump to position
    Given the Master Volume is at 50%
    When I tap the slider bar at the 80% position
    Then the handle should jump immediately to 80%
    And the gradient fill should update to show 80% filled
    And the value display should show "80%"
    And the new volume should save to storage

  Scenario: Slider handle hover effect
    When I move my finger over a slider handle (without pressing)
    Then the handle should scale up to 1.2x its original size
    And the scaling animation should be smooth
    When I move my finger away from the handle
    Then the handle should scale back to 1.0x

  Scenario: Drag slider to minimum (0%)
    Given the Master Volume is at 50%
    When I drag the Master Volume handle all the way to the left
    Then the value should show "0%"
    And the gradient fill should be completely empty
    And all sounds should be muted

  Scenario: Drag slider to maximum (100%)
    Given the Master Volume is at 50%
    When I drag the Master Volume handle all the way to the right
    Then the value should show "100%"
    And the gradient fill should completely fill the bar
    And sounds should play at full volume

  Scenario: Rapid slider movements
    When I quickly drag a slider back and forth 10 times
    Then the value display should update smoothly
    And the gradient fill should update smoothly
    And there should be no lag or stuttering
    And the frame rate should remain at 60 FPS
```

---

## Feature: Volume Settings Persistence

```gherkin
Feature: Volume Settings Persistence
  As Aurora
  I want my volume settings to be remembered
  So that I don't have to adjust them every time

  Background:
    Given the app is freshly installed
    Or the settings have been cleared

  Scenario: First launch with default volumes
    When the Settings screen loads for the first time
    Then all sliders should be at 100%
    And the Master Volume should be 100%
    And the Voice Volume should be 100%
    And the Sound Volume should be 100%

  Scenario: Save volume settings
    Given the Settings screen is active
    When I set Master Volume to 80%
    And I set Voice Volume to 60%
    And I set Sound Volume to 90%
    Then the settings should save automatically
    And the preferences file should update

  Scenario: Load saved settings on next launch
    Given I previously set Master Volume to 80%
    And I previously set Voice Volume to 60%
    And I previously set Sound Volume to 90%
    When I close and reopen the app
    And I navigate to the Settings screen
    Then the Master Volume should be 80%
    And the Voice Volume should be 60%
    And the Sound Volume should be 90%

  Scenario: Settings persist after app closure
    Given I have adjusted all volume sliders
    When I close the app completely
    And I wait 5 minutes
    And I relaunch the app
    And I navigate to Settings
    Then all sliders should show my previous values
    And the audio should play at the saved volumes

  Scenario: Multiple setting changes in one session
    When I set Master Volume to 50%
    And I set Master Volume to 75%
    And I set Master Volume to 60%
    Then only the final value (60%) should be saved
    And the saved value should be 60%
```

---

## Feature: Audio Volume Application

```gherkin
Feature: Audio Volume Application
  As Aurora
  I want volume changes to apply immediately
  So that I can hear the effect of my adjustments

  Background:
    Given the Settings screen is active
    And audio playback is enabled

  Scenario: Master Volume affects all sounds
    Given Master Volume is at 100%
    And Voice Volume is at 100%
    And Sound Volume is at 100%
    When I set Master Volume to 50%
    Then voice playback should be at 50% volume (0.5 × 1.0)
    And sound effects should be at 50% volume (0.5 × 1.0)

  Scenario: Voice Volume affects only voices
    Given Master Volume is at 100%
    And Voice Volume is at 100%
    When I set Voice Volume to 30%
    Then voice playback should be at 30% volume (1.0 × 0.3)
    And sound effects should remain at 100% volume

  Scenario: Sound Volume affects only SFX
    Given Master Volume is at 100%
    And Sound Volume is at 100%
    When I set Sound Volume to 70%
    Then sound effects should be at 70% volume (1.0 × 0.7)
    And voice playback should remain at 100% volume

  Scenario: Combined volume calculation
    Given Master Volume is at 80%
    And Voice Volume is at 50%
    When Aurora speaks
    Then the actual voice volume should be 40% (0.8 × 0.5)

  Scenario: Muted master volume silences everything
    Given Master Volume is at 50%
    And Voice Volume is at 100%
    And Sound Volume is at 100%
    When I set Master Volume to 0%
    Then all sounds should be completely silent
    And voices should not be audible
    And sound effects should not be audible

  Scenario: Volume changes apply in real-time
    When I drag the Master Volume slider from 100% to 0%
    Then the volume should decrease smoothly during the drag
    And I should hear the gradual volume change
    And there should be no delay between slider and audio
```

---

## Feature: Back Button Navigation

```gherkin
Feature: Back Button Navigation
  As Aurora
  I want to return to the Main Menu easily
  So that I can continue using the app

  Background:
    Given the Settings screen is active

  Scenario: Back button is visible and accessible
    When the Settings screen loads
    Then I should see a "BACK" button
    And the button should be centered horizontally
    And the button should be 85% from the top of the screen
    And the button should be large enough to tap easily (200×80 minimum)
    And the button should have an orange background
    And the button should show "← BACK" text in white

  Scenario: Back button hover effect
    When I touch and hold the back button (without releasing)
    Then the button should scale up to 1.1x
    And the scale animation should be smooth (0.2 seconds)
    When I move my finger away from the button
    Then the button should scale back to 1.0x

  Scenario: Back button click navigation
    When I tap the back button
    Then a correct sound should play
    And the screen should begin fading out
    And after 0.3 seconds the Main Menu should appear
    And the Settings screen should be disposed properly

  Scenario: Settings saved before navigation
    Given I have changed the Master Volume to 65%
    And I have changed the Voice Volume to 85%
    When I tap the back button
    And the Main Menu loads
    And I return to Settings
    Then the Master Volume should still be 65%
    And the Voice Volume should still be 85%

  Scenario: Multiple rapid back button taps (debouncing)
    When I tap the back button 5 times rapidly
    Then only the first tap should be processed
    And the Main Menu should appear only once
    And subsequent taps should be ignored during transition
```

---

## Feature: Animations and Visual Effects

```gherkin
Feature: Animations and Visual Effects
  As Aurora
  I want smooth, engaging animations
  So that the settings screen feels polished

  Background:
    Given the Settings screen is active

  Scenario: Title appears with bounce-in animation
    When the Settings screen loads
    Then the title should animate in
    And the animation should use an elastic/bounce effect
    And the animation should complete within 1 second
    And the title should settle into its final position

  Scenario: Floating decorations animate
    When I watch the screen for 5 seconds
    Then I should see decorations floating across the screen
    And decorations should move smoothly at different speeds
    And decorations should rotate slowly as they move
    And decorations should fade in and out (alpha pulsing)
    And decorations should wrap around when they reach screen edges
    And there should be approximately 8 decorations visible

  Scenario: Slider handle smooth movement
    When I drag a slider handle
    Then the handle should follow my finger smoothly
    And there should be no lag or stuttering
    And the movement should feel responsive
    And the gradient fill should update in real-time

  Scenario: Screen transition fade-out
    When I tap the back button
    Then the entire screen should fade out uniformly
    And the fade should take 0.3 seconds
    And the fade should be smooth with no flickering
    And all elements should fade together

  Scenario: Performance under load
    When all three sliders are being dragged simultaneously
    And decorations are animating
    And the title animation is playing
    Then the frame rate should remain at 60 FPS
    And there should be no visible lag
    And animations should remain smooth
```

---

## Feature: Responsive Layout

```gherkin
Feature: Responsive Layout
  As Aurora using a Samsung Galaxy Tab S7 FE
  I want the UI to adapt properly to my screen
  So that everything is sized and positioned correctly

  Background:
    Given the device screen is 2560×1600 (tablet)
    And the game uses a 2560×1600 viewport

  Scenario: Elements scale proportionally
    When the Settings screen loads on a 2560×1600 screen
    Then all elements should scale proportionally
    And the title should remain centered
    And the sliders should be properly positioned
    And the back button should stay centered at bottom
    And no elements should overlap

  Scenario: Title positioning
    When the Settings screen loads
    Then the title should be centered horizontally at 1280px
    And the title should be 15% from the top (240px)
    And the title should be fully visible
    And the title should not overlap with sliders

  Scenario: Slider positioning
    When the Settings screen loads
    Then the first slider should be at 35% from top (560px)
    And the second slider should be 120px below the first
    And the third slider should be 120px below the second
    And all sliders should be 20% from the left edge (512px)
    And all sliders should fit within screen bounds

  Scenario: Back button positioning
    When the Settings screen loads
    Then the back button should be centered horizontally at 1280px
    And the back button should be 85% from top (1360px)
    And the button should be fully visible on screen
    And the button should not overlap with sliders

  Scenario: Slider bar dimensions
    When the Settings screen loads
    Then each slider bar should be 700px wide (scaled)
    And each slider bar should be 15px tall (scaled)
    And the bars should be clearly visible
    And the handles should be properly sized (40px diameter)

  Scenario: Touch targets are appropriately sized
    Given I am a 5-year-old with small fingers
    When I try to tap a slider handle
    Then the handle should be at least 40px in diameter
    And I should be able to tap it accurately every time
    When I try to tap the back button
    Then it should be at least 200×80px
    And I should be able to tap it accurately
```

---

## Feature: Error Handling and Edge Cases

```gherkin
Feature: Error Handling and Edge Cases
  As a developer
  I want graceful error handling
  So that unexpected situations don't crash the app

  Scenario: Missing preferences file
    Given the preferences file does not exist
    When the Settings screen loads
    Then it should create a new preferences file
    And it should use default values (100% for all)
    And the screen should render normally
    And the app should not crash

  Scenario: Corrupted preference value
    Given the saved Master Volume is "invalid"
    When the Settings screen loads
    Then it should use the default value (100)
    And the screen should render normally
    And a warning should be logged to console
    And the app should not crash

  Scenario: Out-of-range preference value
    Given the saved Master Volume is 150
    When the Settings screen loads
    Then it should clamp the value to 100
    And the slider should show 100%
    And the audio should play at 100% volume

  Scenario: Negative preference value
    Given the saved Master Volume is -50
    When the Settings screen loads
    Then it should clamp the value to 0
    And the slider should show 0%
    And the audio should be muted

  Scenario: Rapid screen transitions
    When I tap the back button
    And I immediately tap a slider (before fade completes)
    Then the slider should not respond
    And only the transition should proceed
    And the app should not crash

  Scenario: Memory cleanup on dispose
    When I navigate away from Settings
    Then all textures should be disposed
    And all sliders should be disposed
    And all components should be disposed
    And no memory leaks should occur
```

---

## Manual Testing Checklist

### Visual Verification
- [ ] Gradient background displays smoothly (purple → pink)
- [ ] Title "SETTINGS" is visible and styled correctly
- [ ] Three sliders render with proper layout
- [ ] Slider labels are clear and readable
- [ ] Value displays show percentages correctly
- [ ] Slider bars have yellow→orange gradients
- [ ] Handles are white circles with purple strokes
- [ ] Back button shows "← BACK" text
- [ ] Floating decorations are visible
- [ ] Layout is correct on 2560×1600 display
- [ ] No visual glitches or artifacts

### Interaction Verification
- [ ] Master Volume slider can be dragged
- [ ] Voice Volume slider can be dragged
- [ ] Sound Volume slider can be dragged
- [ ] Clicking bar jumps handle to position
- [ ] Handles scale on hover (1.2x)
- [ ] Value displays update in real-time
- [ ] Back button responds to tap
- [ ] Back button scales on hover (1.1x)
- [ ] All touch targets are easy to hit

### Audio Verification
- [ ] Master Volume affects all sounds
- [ ] Voice Volume affects only voices
- [ ] Sound Volume affects only SFX
- [ ] Volume changes apply immediately
- [ ] Combined volumes calculate correctly
- [ ] Muting (0%) silences audio completely
- [ ] 100% plays at full volume

### Persistence Verification
- [ ] Default values are 100% on first launch
- [ ] Settings save when sliders change
- [ ] Settings load correctly on next launch
- [ ] Settings persist after app closure
- [ ] Multiple changes save final value only
- [ ] Preferences file updates correctly

### Navigation Verification
- [ ] Back button returns to Main Menu
- [ ] Fade-out animation plays (0.3s)
- [ ] Main Menu loads correctly after back
- [ ] Settings screen disposes properly
- [ ] Settings persist after navigation away
- [ ] Rapid taps are debounced correctly

### Animation Verification
- [ ] Title bounces in on load
- [ ] Decorations float smoothly
- [ ] Slider handles move smoothly during drag
- [ ] Handle scale animations are smooth
- [ ] Button hover animations are smooth
- [ ] Screen fade-out is smooth
- [ ] All animations maintain 60 FPS

### Performance Verification
- [ ] 60 FPS maintained consistently
- [ ] No frame drops during slider drag
- [ ] No lag when changing volumes
- [ ] Touch input remains responsive
- [ ] Memory usage is stable (no leaks)
- [ ] No console errors or warnings

### Error Handling Verification
- [ ] Missing preferences handled gracefully
- [ ] Corrupted values handled gracefully
- [ ] Out-of-range values clamped correctly
- [ ] App doesn't crash with invalid data
- [ ] Warnings logged appropriately

---

## Acceptance Criteria Summary

**Phase 2.7.6 is COMPLETE when:**

1. ✅ All Gherkin scenarios pass
2. ✅ Manual testing checklist 100% complete
3. ✅ 60 FPS maintained on target device
4. ✅ No console errors or warnings
5. ✅ Memory management verified (no leaks)
6. ✅ All animations smooth and polished
7. ✅ Touch interactions responsive (<20ms latency)
8. ✅ Layout correct on 2560×1600 display
9. ✅ Settings persistence working correctly
10. ✅ Audio volume changes apply in real-time

---

## Test Execution Notes

**Tester:** [Name]
**Date:** [Date]
**Device:** Samsung Galaxy Tab S7 FE (2560×1600)
**Build:** [APK version]

**Results:**
- Scenarios Passed: __ / __
- Manual Checklist: __ / __ items completed
- Critical Issues Found: __
- Non-Critical Issues Found: __

**Status:** [ ] PASS / [ ] FAIL

**Notes:**
[Any additional observations or issues discovered during testing]

---

**Created:** October 18, 2025
**Status:** Ready for Implementation Testing
