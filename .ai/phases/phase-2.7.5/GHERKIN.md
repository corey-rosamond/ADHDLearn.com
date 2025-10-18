# Phase 2.7.5: Main Menu Screen - BDD Acceptance Criteria

## Overview

This document defines the behavior-driven development (BDD) acceptance criteria for the Main Menu screen using Gherkin syntax. All scenarios must pass before Phase 2.7.5 is considered complete.

---

## Feature: Main Menu Screen Display

```gherkin
Feature: Main Menu Screen Display
  As Aurora
  I want to see a colorful, engaging main menu
  So that I can choose which game to play

  Background:
    Given the app has finished loading
    And all assets are ready
    And the Main Menu screen is active

  Scenario: Initial screen rendering
    When the Main Menu screen loads
    Then I should see a gradient background from purple to pink
    And I should see the title "ADVENTURE" in colorful letters
    And I should see floating stars moving across the screen
    And I should see a settings button in the top-right corner
    And I should see a "Letter Pop" game tile in the center
    And the screen should fill the entire display

  Scenario: Gradient background renders correctly
    When the Main Menu screen loads
    Then the background should be a smooth gradient
    And the gradient should transition from purple at top to pink at bottom
    And there should be no visible banding or artifacts
    And the gradient should cover the entire screen

  Scenario: Title text displays correctly
    When the Main Menu screen loads
    Then I should see the word "ADVENTURE" in large text
    And the text should be centered horizontally
    And the text should be positioned near the top of the screen
    And the text should have colorful rainbow colors
    And the text should have a stroke outline for readability

  Scenario: Settings button is visible
    When the Main Menu screen loads
    Then I should see a gear emoji button in the top-right
    And the button should be clearly visible against the background
    And the button should have a rounded orange background
    And the button should be large enough to tap easily (100x100 minimum)

  Scenario: Game tile displays correctly
    When the Main Menu screen loads
    Then I should see a game tile labeled "Letter Pop"
    And the tile should show a balloon emoji icon
    And the tile should be centered on the screen
    And the tile should be 300x300 in size
    And the tile should have a dark rounded background
    And the text should be yellow and readable
```

---

## Feature: Animations and Visual Effects

```gherkin
Feature: Animations and Visual Effects
  As Aurora
  I want to see smooth, engaging animations
  So that the game feels alive and responsive

  Background:
    Given the Main Menu screen is active
    And animations are enabled

  Scenario: Floating stars animation
    When I watch the screen for 5 seconds
    Then I should see stars floating across the screen
    And stars should move smoothly at different speeds
    And some stars should be yellow and some should be pink
    And stars should fade in and out (alpha pulsing)
    And stars should rotate slowly as they move
    And stars should wrap around when they reach screen edges
    And there should be approximately 30 stars visible

  Scenario: Settings button bounce animation
    When the Main Menu screen loads
    Then the settings button should gently bounce
    And the bounce should be vertical (up and down)
    And the bounce should repeat continuously
    And the bounce animation should be smooth and subtle
    And the bounce cycle should take approximately 1.2 seconds

  Scenario: Game tile float animation
    When the Main Menu screen loads
    Then the "Letter Pop" tile should float gently
    And the float should be vertical (up and down)
    And the float should repeat continuously
    And the float animation should be smooth
    And the float cycle should take approximately 3 seconds
    And the movement should be subtle (not distracting)

  Scenario: Title appears with bounce-in animation
    When the Main Menu screen loads
    Then the title letters should animate in
    And the animation should use an elastic/bounce effect
    And the animation should complete within 1 second
    And the letters should overshoot and settle into place
    And the final position should be stable (no jitter)

  Scenario: Screen transition fade-out
    When I tap the Settings button
    Then the entire screen should fade out smoothly
    And the fade should take 0.3 seconds
    And the fade should be uniform (no flickering)
    And all elements should fade together
```

---

## Feature: Touch Interactions

```gherkin
Feature: Touch Interactions
  As Aurora
  I want buttons and tiles to respond to my touches
  So that I can navigate the app easily

  Background:
    Given the Main Menu screen is active
    And touch input is enabled

  Scenario: Settings button hover effect
    When I touch and hold the settings button (without releasing)
    Then the button should scale up to 1.15x its original size
    And the scale animation should be smooth (0.2 seconds)
    And the button should remain interactive
    When I move my finger away from the button
    Then the button should scale back to 1.0x
    And the scale-down animation should be smooth

  Scenario: Settings button click
    When I tap the settings button
    Then the button should scale down briefly to 0.9x
    And the button should scale back to 1.0x
    And the screen should begin fading out
    And after 0.3 seconds the Settings screen should appear

  Scenario: Game tile hover effect
    When I touch and hold the Letter Pop tile (without releasing)
    Then the tile should scale up to 1.1x its original size
    And the scale animation should be smooth (0.2 seconds)
    When I move my finger away from the tile
    Then the tile should scale back to 1.0x

  Scenario: Game tile click
    When I tap the Letter Pop tile
    Then the tile should scale down to 0.95x
    And the tile should scale back to 1.0x
    And the screen should begin fading out
    And after 0.3 seconds the Letter Pop Menu screen should appear

  Scenario: Background tap does nothing
    When I tap the gradient background (not on any button)
    Then nothing should happen
    And no buttons should react
    And no navigation should occur

  Scenario: Multiple rapid taps (debouncing)
    When I tap the Settings button 5 times rapidly
    Then only the first tap should be processed
    And the Settings screen should appear only once
    And subsequent taps should be ignored during transition

  Scenario: Touch target size verification
    Given I am a 5-year-old with small fingers
    When I try to tap the Settings button
    Then the button should be at least 100x100 pixels
    And the touch area should match the visual size
    And I should be able to tap it accurately every time
```

---

## Feature: Navigation and Screen Transitions

```gherkin
Feature: Navigation and Screen Transitions
  As Aurora
  I want to navigate smoothly between screens
  So that the app feels polished and professional

  Background:
    Given the Main Menu screen is active

  Scenario: Navigate to Settings screen
    When I tap the Settings button
    Then the Main Menu screen should fade out over 0.3 seconds
    And the Settings screen should load
    And the Settings screen should appear
    And the Main Menu screen should be disposed properly
    And memory should be released

  Scenario: Navigate to Letter Pop Menu screen
    When I tap the Letter Pop tile
    Then the Main Menu screen should fade out over 0.3 seconds
    And the Letter Pop Menu screen should load
    And the Letter Pop Menu screen should appear
    And the Main Menu screen should be disposed properly

  Scenario: Return from Settings screen
    Given I navigated to the Settings screen
    When I tap the Back button on the Settings screen
    Then the Settings screen should fade out
    And the Main Menu screen should reload
    And all animations should start fresh
    And the welcome audio should play again

  Scenario: Screen disposal cleanup
    When the Main Menu screen transitions away
    Then all textures should be disposed
    And all actors should be removed from the stage
    And the stage itself should be disposed
    And no memory leaks should occur
    And the GradientBackground texture should be released
    And the FloatingStars textures should be released
```

---

## Feature: Audio Playback

```gherkin
Feature: Audio Playback
  As Aurora
  I want to hear welcome messages and sound effects
  So that the game is engaging and instructive

  Background:
    Given the app volume is set to 80%
    And voice volume is set to 100%
    And the Main Menu screen loads

  Scenario: Welcome message plays on screen load
    When the Main Menu screen appears
    Then the "welcome" voice message should play immediately
    And the audio should be clear and audible
    And the volume should respect the app's volume settings
    And only one voice should play at a time

  Scenario: Audio respects volume settings
    Given master volume is set to 50%
    And voice volume is set to 80%
    When the welcome message plays
    Then the final volume should be 40% (0.5 × 0.8)
    And the audio should be audible but not too loud

  Scenario: No audio on repeated screen shows
    Given I left the Main Menu and returned
    When the Main Menu screen appears again
    Then the welcome message should play again
    And the audio should not overlap with itself

  Scenario: Audio stops when navigating away
    Given the welcome message is playing
    When I tap the Settings button before audio finishes
    Then the welcome message should continue playing
    And the transition should not interrupt the audio
```

---

## Feature: Responsive Layout

```gherkin
Feature: Responsive Layout
  As Aurora using a Samsung Galaxy Tab S7 FE
  I want the UI to adapt to my screen size
  So that everything is properly sized and positioned

  Background:
    Given the device screen is 2560x1600 (tablet)
    And the game uses a 1920x1200 base viewport

  Scenario: Elements scale proportionally
    When the Main Menu screen loads on a 2560x1600 screen
    Then all elements should scale proportionally
    And the title should remain centered
    And the Settings button should stay in the top-right
    And the Letter Pop tile should stay centered
    And no elements should overlap

  Scenario: Title positioning
    When the Main Menu screen loads
    Then the title should be centered horizontally
    And the title should be 18% from the top of the screen
    And the title should be fully visible
    And the title should not overlap with the Settings button

  Scenario: Settings button positioning
    When the Main Menu screen loads
    Then the Settings button should be 92% from the left edge
    And the Settings button should be 8% from the top edge
    And the button should be fully visible on screen
    And the button should not be cut off by screen edges

  Scenario: Game tile positioning
    When the Main Menu screen loads
    Then the Letter Pop tile should be centered horizontally
    And the tile should be 60% from the top of the screen
    And the tile should be fully visible
    And the tile should have space above and below for float animation

  Scenario: Floating stars stay on screen
    When stars float across the screen
    Then stars should always remain within screen bounds
    And stars should wrap around when reaching edges
    And no stars should disappear unexpectedly
    And stars should be evenly distributed across the screen

  Scenario: Portrait vs Landscape (future)
    # Current version only supports landscape
    Given the device is in landscape orientation
    When the Main Menu screen loads
    Then the layout should be optimized for landscape
    And the title should be readable
    And touch targets should remain appropriately sized
```

---

## Feature: Performance and Stability

```gherkin
Feature: Performance and Stability
  As Aurora
  I want the app to run smoothly without lag or crashes
  So that I can play without frustration

  Background:
    Given the Main Menu screen is active

  Scenario: Frame rate maintains 60 FPS
    When I watch the Main Menu for 30 seconds
    Then the frame rate should stay at 60 FPS
    And animations should remain smooth
    And there should be no visible stuttering
    And touch input should remain responsive

  Scenario: Memory usage is stable
    When the Main Menu screen is active for 5 minutes
    Then memory usage should remain constant
    And there should be no memory leaks
    And garbage collection should not cause frame drops

  Scenario: No console errors
    When the Main Menu screen loads
    Then there should be no errors in the log
    And there should be no warnings about missing assets
    And all components should initialize successfully

  Scenario: Rapid screen transitions don't cause issues
    When I tap Letter Pop tile then immediately tap Back
    And I repeat this 10 times quickly
    Then the app should not crash
    And transitions should remain smooth
    And memory should be properly managed

  Scenario: Cold start performance
    Given the app is closed
    When I launch the app for the first time
    Then the Loading screen should appear first
    And all assets should load successfully
    And the Main Menu should appear within 3 seconds
    And all animations should start immediately
```

---

## Feature: Error Handling

```gherkin
Feature: Error Handling
  As a developer
  I want graceful error handling
  So that missing assets don't crash the app

  Scenario: Missing welcome audio
    Given the "welcome.ogg" audio file is missing
    When the Main Menu screen loads
    Then the screen should still render correctly
    And a warning should be logged to console
    And the app should not crash
    And all other functionality should work

  Scenario: Missing gradient texture creation fails
    Given texture creation fails for some reason
    When the Main Menu screen loads
    Then a fallback background should be used
    Or an error should be logged and handled gracefully
    And the app should not crash

  Scenario: Font loading failure
    Given the Fredoka font fails to load
    When the Main Menu screen loads
    Then a default font should be used as fallback
    And the title text should still be visible
    And the app should not crash
```

---

## Manual Testing Checklist

### Visual Verification
- [ ] Gradient background displays smoothly (no banding)
- [ ] Title "ADVENTURE" is visible and colorful
- [ ] Floating stars are visible and animated
- [ ] Settings button shows gear emoji clearly
- [ ] Letter Pop tile displays balloon emoji and text
- [ ] All colors match ThemeConfig (purple, pink, orange, yellow)
- [ ] No visual glitches or artifacts
- [ ] Layout looks good on Tab S7 FE (2560x1600)

### Animation Verification
- [ ] Stars float smoothly across screen
- [ ] Stars fade in/out (alpha pulsing)
- [ ] Stars rotate as they move
- [ ] Settings button bounces continuously
- [ ] Letter Pop tile floats up and down
- [ ] Title letters animate in with bounce
- [ ] Screen fade-out is smooth (0.3s)
- [ ] All animations maintain 60 FPS

### Interaction Verification
- [ ] Settings button responds to hover (scales to 1.15x)
- [ ] Settings button responds to click (scales to 0.9x)
- [ ] Settings button navigates to Settings screen
- [ ] Letter Pop tile responds to hover (scales to 1.1x)
- [ ] Letter Pop tile responds to click (scales to 0.95x)
- [ ] Letter Pop tile navigates to Letter Pop Menu
- [ ] Background taps do nothing
- [ ] Multiple rapid taps are debounced correctly
- [ ] Touch targets are large enough for 5-year-old

### Audio Verification
- [ ] Welcome message plays on screen load
- [ ] Audio respects volume settings
- [ ] Audio is clear and audible
- [ ] No audio errors in console

### Navigation Verification
- [ ] Settings button transitions to Settings screen
- [ ] Letter Pop tile transitions to Letter Pop Menu
- [ ] Fade-out animation plays before transition
- [ ] Old screen disposes properly after transition
- [ ] Back button returns to Main Menu correctly

### Performance Verification
- [ ] 60 FPS maintained consistently
- [ ] No frame drops during animations
- [ ] Touch input remains responsive
- [ ] Memory usage is stable (no leaks)
- [ ] No console errors or warnings
- [ ] Cold start completes in <3 seconds

### Responsive Layout Verification
- [ ] Title centered horizontally
- [ ] Title positioned 18% from top
- [ ] Settings button in top-right corner (92% left, 8% top)
- [ ] Letter Pop tile centered (60% from top)
- [ ] Stars stay within screen bounds
- [ ] No elements overlap
- [ ] No elements cut off by screen edges

### Error Handling Verification
- [ ] App doesn't crash with missing welcome audio
- [ ] App doesn't crash with texture creation failure
- [ ] App doesn't crash with font loading failure
- [ ] Warnings are logged appropriately
- [ ] Fallbacks work correctly

---

## Acceptance Criteria Summary

**Phase 2.7.5 is COMPLETE when:**

1. ✅ All Gherkin scenarios pass
2. ✅ Manual testing checklist 100% complete
3. ✅ 60 FPS maintained on target device
4. ✅ No console errors or warnings
5. ✅ Memory management verified (no leaks)
6. ✅ All animations smooth and polished
7. ✅ Touch interactions responsive (<20ms latency)
8. ✅ Layout correct on 2560x1600 display
9. ✅ Screen transitions work perfectly
10. ✅ Audio plays correctly at proper volume

---

## Test Execution Notes

**Tester:** [Name]
**Date:** [Date]
**Device:** Samsung Galaxy Tab S7 FE (2560x1600)
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

**Created:** October 16, 2025
**Status:** Ready for Implementation Testing
