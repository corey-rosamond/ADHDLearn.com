# Phase 2.7.7: Letter Pop Menu Screen - BDD Acceptance Criteria

## Overview

This document defines the behavior-driven development (BDD) acceptance criteria for the Letter Pop Menu Screen using Gherkin syntax. All scenarios must pass before Phase 2.7.7 is considered complete.

---

## Feature: Letter Pop Menu Screen Display

```gherkin
Feature: Letter Pop Menu Screen Display
  As Aurora
  I want to see a clear game configuration interface
  So that I can customize my Letter Pop game settings

  Background:
    Given the app has finished loading
    And I am on the Main Menu screen
    When I tap the Letter Pop tile
    And the screen fade transition completes
    Then the Letter Pop Menu screen should be active

  Scenario: Initial screen rendering
    When the Letter Pop Menu screen loads
    Then I should see a gradient background from purple to orange
    And I should see an animated balloon icon near the top
    And I should see the title "LETTER POP" below the balloon
    And I should see a "Time Per Round" slider
    And I should see a "Letter Case" selector with three options
    And I should see a "START GAME" button
    And I should see a "← BACK" button at the bottom
    And I should see floating decorations moving across the screen
    And the screen should fill the entire display

  Scenario: Gradient background renders correctly
    When the Letter Pop Menu screen loads
    Then the background should be a smooth gradient
    And the gradient should transition from purple at top to orange at bottom
    And there should be no visible banding or artifacts
    And the gradient should cover the entire screen

  Scenario: Title and balloon display correctly
    When the Letter Pop Menu screen loads
    Then I should see an animated balloon icon
    And the balloon should bounce gently up and down
    And I should see the word "LETTER POP" in large text
    And the text should be centered horizontally
    And the text should be positioned below the balloon
    And the text should be yellow with a purple border
    And the text should bounce in with an animation

  Scenario: Game settings display correctly
    When the Letter Pop Menu screen loads
    Then I should see a time slider with label "Time Per Round:"
    And the slider should show a value between 5 and 15 seconds
    And I should see a case selector with label "Letter Case:"
    And I should see three case options: "ABC", "abc", and "Abc"
    And one case option should be highlighted as selected
```

---

## Feature: Time Limit Slider

```gherkin
Feature: Time Limit Slider
  As Aurora
  I want to adjust the time limit for each round
  So that I can make the game easier or harder

  Background:
    Given the Letter Pop Menu screen is active
    And the time slider is visible

  Scenario: Default time value
    When the Letter Pop Menu screen loads for the first time
    Then the time slider should be at 10 seconds
    And the value display should show "10s"

  Scenario: Drag time slider
    Given the time is currently set to 10 seconds
    When I touch and drag the time slider handle to 8 seconds
    Then the handle should move smoothly to the new position
    And the gradient fill should update to show 60% filled
    And the value display should show "8s"
    And the new time should save to storage
    And the new time should apply immediately

  Scenario: Minimum time limit
    Given the time is currently set to 10 seconds
    When I drag the time slider all the way to the left
    Then the value should show "5s"
    And the gradient fill should be at minimum (0%)
    And I should not be able to drag it further left

  Scenario: Maximum time limit
    Given the time is currently set to 10 seconds
    When I drag the time slider all the way to the right
    Then the value should show "15s"
    And the gradient fill should be at maximum (100%)
    And I should not be able to drag it further right

  Scenario: Click on slider bar
    Given the time is currently set to 10 seconds
    When I tap the slider bar at the 80% position
    Then the handle should jump to 13 seconds
    And the gradient fill should update to 80%
    And the value display should show "13s"

  Scenario: Time slider persistence
    Given I have set the time to 12 seconds
    When I navigate back to Main Menu
    And I return to the Letter Pop Menu
    Then the time slider should show 12 seconds
    And the setting should be preserved
```

---

## Feature: Letter Case Selector

```gherkin
Feature: Letter Case Selector
  As Aurora
  I want to choose which letter case to practice
  So that I can learn uppercase, lowercase, or both

  Background:
    Given the Letter Pop Menu screen is active
    And the case selector is visible

  Scenario: Default case selection
    When the Letter Pop Menu screen loads for the first time
    Then the "ABC" (Uppercase) option should be selected
    And it should have a green background
    And the other options should have purple backgrounds

  Scenario: Select lowercase option
    Given "ABC" (Uppercase) is currently selected
    When I tap the "abc" (Lowercase) option
    Then the "abc" option should be selected
    And it should change to a green background
    And the "ABC" option should change to purple background
    And the "Abc" option should remain purple
    And a correct sound should play
    And the selection should save to storage

  Scenario: Select mixed case option
    Given "ABC" (Uppercase) is currently selected
    When I tap the "Abc" (Mixed) option
    Then the "Abc" option should be selected
    And it should change to a green background
    And the "ABC" option should change to purple background
    And the "abc" option should remain purple
    And a correct sound should play
    And the selection should save to storage

  Scenario: Only one option selected at a time
    Given any case option is selected
    When I click a different option
    Then only the clicked option should be selected
    And all other options should be deselected
    And only one option should have a green background

  Scenario: Hover effect on options
    When I move my finger over a case option (without pressing)
    Then the option's text should scale up to 1.1x
    And the scaling animation should be smooth
    When I move my finger away from the option
    Then the option's text should scale back to 1.0x

  Scenario: Case selector persistence
    Given I have selected "abc" (Lowercase)
    When I navigate back to Main Menu
    And I return to the Letter Pop Menu
    Then the "abc" option should still be selected
    And it should have a green background
```

---

## Feature: Settings Persistence

```gherkin
Feature: Settings Persistence
  As Aurora
  I want my game settings to be remembered
  So that I don't have to adjust them every time

  Background:
    Given the app is freshly installed
    Or the settings have been cleared

  Scenario: First launch with default settings
    When the Letter Pop Menu screen loads for the first time
    Then the time should be 10 seconds
    And the case should be "Uppercase"

  Scenario: Save all settings
    Given the Letter Pop Menu screen is active
    When I set time to 7 seconds
    And I select "abc" (Lowercase)
    Then the settings should save automatically
    And the preferences file should update

  Scenario: Load saved settings on next launch
    Given I previously set time to 7 seconds
    And I previously selected "abc" (Lowercase)
    When I close and reopen the app
    And I navigate to the Letter Pop Menu
    Then the time slider should show 7 seconds
    And the "abc" option should be selected

  Scenario: Settings persist after app closure
    Given I have adjusted all settings
    When I close the app completely
    And I wait 5 minutes
    And I relaunch the app
    And I navigate to the Letter Pop Menu
    Then all settings should show my previous values

  Scenario: Multiple setting changes in one session
    When I set time to 5 seconds
    And I set time to 10 seconds
    And I set time to 12 seconds
    Then only the final value (12 seconds) should be saved
    And the saved value should be 12 seconds
```

---

## Feature: Start Game Button

```gherkin
Feature: Start Game Button
  As Aurora
  I want to start the Letter Pop game with my chosen settings
  So that I can begin playing

  Background:
    Given the Letter Pop Menu screen is active

  Scenario: Start button is visible and accessible
    When the Letter Pop Menu screen loads
    Then I should see a "START GAME" button
    And the button should be centered horizontally
    And the button should be at 20% from the bottom
    And the button should be large enough to tap easily (256×80 minimum)
    And the button should have an orange background
    And the button should show "START GAME" text in white

  Scenario: Start button hover effect
    When I touch and hold the start button (without releasing)
    Then the button should scale up to 1.1x
    And the scale animation should be smooth (0.2 seconds)
    When I move my finger away from the button
    Then the button should scale back to 1.0x

  Scenario: Start button click (Phase 2.7.8 placeholder)
    Given I have configured my settings
    When I tap the start button
    Then a correct sound should play
    And the game should prepare to start
    And my settings should be passed to the game
    # Note: Actual game navigation in Phase 2.7.8
```

---

## Feature: Back Button Navigation

```gherkin
Feature: Back Button Navigation
  As Aurora
  I want to return to the Main Menu easily
  So that I can navigate to other parts of the app

  Background:
    Given the Letter Pop Menu screen is active

  Scenario: Back button is visible and accessible
    When the Letter Pop Menu screen loads
    Then I should see a "← BACK" button
    And the button should be centered horizontally
    And the button should be at 10% from the bottom
    And the button should be large enough to tap easily (256×80 minimum)
    And the button should have a green background
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
    And the Letter Pop Menu screen should be disposed properly

  Scenario: Settings saved before navigation
    Given I have changed the time to 9 seconds
    And I have selected "Abc" (Mixed)
    When I tap the back button
    And the Main Menu loads
    And I return to the Letter Pop Menu
    Then the time should still be 9 seconds
    And the "Abc" option should still be selected

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
  So that the menu screen feels polished and fun

  Background:
    Given the Letter Pop Menu screen is active

  Scenario: Title appears with bounce-in animation
    When the Letter Pop Menu screen loads
    Then the title should animate in
    And the animation should use an elastic/bounce effect
    And the animation should complete within 0.6 seconds
    And the title should settle into its final position

  Scenario: Balloon icon animates
    When the Letter Pop Menu screen loads
    Then the balloon icon should pop in with a bounce
    And the balloon should bob up and down continuously
    And the bobbing should be smooth and gentle
    And the animation should repeat indefinitely

  Scenario: Floating decorations animate
    When I watch the screen for 5 seconds
    Then I should see decorations floating across the screen
    And decorations should move smoothly at different speeds
    And decorations should rotate slowly as they move
    And decorations should fade in and out (alpha pulsing)
    And decorations should wrap around when they reach screen edges
    And there should be approximately 8 decorations visible

  Scenario: Time slider smooth movement
    When I drag the time slider handle
    Then the handle should follow my finger smoothly
    And there should be no lag or stuttering
    And the movement should feel responsive
    And the gradient fill should update in real-time

  Scenario: Case selector text scaling
    When I hover over a case option
    Then the text should smoothly scale up to 1.1x
    And the animation should complete within 0.15 seconds
    When I move away from the option
    Then the text should smoothly scale back to 1.0x

  Scenario: Screen transition fade-out
    When I tap the back button
    Then the entire screen should fade out uniformly
    And the fade should take 0.3 seconds
    And the fade should be smooth with no flickering
    And all elements should fade together

  Scenario: Performance under load
    When all animations are active simultaneously
    And decorations are animating
    And the balloon is bobbing
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
    When the Letter Pop Menu screen loads on a 2560×1600 screen
    Then all elements should scale proportionally
    And the title should remain centered
    And the balloon should be positioned correctly
    And the settings should be properly positioned
    And the buttons should stay centered at bottom
    And no elements should overlap

  Scenario: Balloon and title positioning
    When the Letter Pop Menu screen loads
    Then the balloon should be at 92% from bottom (~1472px)
    And the title should be at 80% from bottom (~1280px)
    And both should be centered horizontally at 1280px
    And they should not overlap

  Scenario: Settings positioning
    When the Letter Pop Menu screen loads
    Then the time slider should be at 55% from bottom (~880px)
    And the case selector should be at 40% from bottom (~640px)
    And both should be 20% from the left edge (~512px)
    And there should be adequate spacing between them

  Scenario: Button positioning
    When the Letter Pop Menu screen loads
    Then the start button should be centered at 1280px horizontally
    And the start button should be at 20% from bottom (~320px)
    And the back button should be centered at 1280px horizontally
    And the back button should be at 10% from bottom (~160px)
    And both buttons should be fully visible on screen

  Scenario: Touch targets are appropriately sized
    Given I am a 5-year-old with small fingers
    When I try to tap the start button
    Then it should be at least 256×80px
    And I should be able to tap it accurately every time
    When I try to tap a case option
    Then it should be at least 205×70px
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
    When the Letter Pop Menu screen loads
    Then it should create a new preferences file
    And it should use default values (10s, uppercase)
    And the screen should render normally
    And the app should not crash

  Scenario: Corrupted preference value
    Given the saved time value is "invalid"
    When the Letter Pop Menu screen loads
    Then it should use the default value (10)
    And the screen should render normally
    And a warning should be logged to console
    And the app should not crash

  Scenario: Out-of-range time value
    Given the saved time is 25 seconds
    When the Letter Pop Menu screen loads
    Then it should clamp the value to 15
    And the slider should show 15 seconds

  Scenario: Invalid case value
    Given the saved case is "diagonal"
    When the Letter Pop Menu screen loads
    Then it should use the default value ("uppercase")
    And the "ABC" option should be selected

  Scenario: Rapid screen transitions
    When I tap the back button
    And I immediately tap the time slider (before fade completes)
    Then the slider should not respond
    And only the transition should proceed
    And the app should not crash

  Scenario: Memory cleanup on dispose
    When I navigate away from the Letter Pop Menu
    Then all textures should be disposed
    And all components should be disposed
    And no memory leaks should occur
```

---

## Manual Testing Checklist

### Visual Verification
- [ ] Gradient background displays smoothly (purple → orange)
- [ ] Balloon icon displays and animates
- [ ] Title "LETTER POP" is visible and styled correctly
- [ ] Time slider renders with proper layout
- [ ] Case selector shows three options clearly
- [ ] Case selector highlights selected option
- [ ] Start button shows "START GAME" text
- [ ] Back button shows "← BACK" text
- [ ] Floating decorations are visible
- [ ] Layout is correct on 2560×1600 display
- [ ] No visual glitches or artifacts

### Interaction Verification
- [ ] Time slider can be dragged
- [ ] Clicking slider bar snaps handle
- [ ] Time slider handle scales on hover
- [ ] Case options can be clicked
- [ ] Only one case option selected at a time
- [ ] Case options show hover effect
- [ ] Start button responds to tap
- [ ] Start button scales on hover
- [ ] Back button responds to tap
- [ ] Back button scales on hover
- [ ] All touch targets are easy to hit

### Settings Verification
- [ ] Default values are 10s and uppercase
- [ ] Time changes save immediately
- [ ] Case changes save immediately
- [ ] Settings load correctly on next launch
- [ ] Settings persist after app closure
- [ ] Multiple changes save final value only
- [ ] Preferences file updates correctly

### Navigation Verification
- [ ] Back button returns to Main Menu
- [ ] Fade-out animation plays (0.3s)
- [ ] Main Menu loads correctly after back
- [ ] Letter Pop Menu screen disposes properly
- [ ] Settings persist after navigation away
- [ ] Rapid taps are debounced correctly

### Animation Verification
- [ ] Title bounces in on load
- [ ] Balloon pops in and bobs continuously
- [ ] Decorations float smoothly
- [ ] Slider handle moves smoothly during drag
- [ ] Case text scales smoothly on hover
- [ ] Button hover animations are smooth
- [ ] Screen fade-out is smooth
- [ ] All animations maintain 60 FPS

### Performance Verification
- [ ] 60 FPS maintained consistently
- [ ] No frame drops during interactions
- [ ] No lag when adjusting settings
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

**Phase 2.7.7 is COMPLETE when:**

1. ✅ All Gherkin scenarios pass
2. ✅ Manual testing checklist 100% complete
3. ✅ 60 FPS maintained on target device
4. ✅ No console errors or warnings
5. ✅ Memory management verified (no leaks)
6. ✅ All animations smooth and polished
7. ✅ Touch interactions responsive (<20ms latency)
8. ✅ Layout correct on 2560×1600 display
9. ✅ Settings persistence working correctly
10. ✅ CaseSelector component fully functional

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

**Created:** October 19, 2025
**Status:** Ready for Implementation Testing
