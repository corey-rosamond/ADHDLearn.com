# Phase 2.6: BDD Test Scenarios (Gherkin)

## Overview

These Gherkin scenarios define the acceptance criteria for Phase 2.6. **Critical Requirement:** All existing behavior must remain identical after refactoring. These tests prove that the component refactoring changes only internal code structure, not user-visible behavior.

---

## Feature: Component Infrastructure

### Scenario: ThemeConfig provides consistent values
```gherkin
Feature: ThemeConfig centralized styling
  As a developer
  I want consistent theme values across all components
  So that styling changes require only one file edit

  Scenario: ThemeConfig exposes color constants
    Given ThemeConfig is loaded
    When I access ThemeConfig.COLORS.orangePop
    Then it should return 0xFF6B6B
    And ThemeConfig.COLORS.text.primary should return '#FFEB3B'
    And ThemeConfig.COLORS.stroke.primary should return '#9C27B0'

  Scenario: ThemeConfig exposes font constants
    Given ThemeConfig is loaded
    When I access ThemeConfig.FONTS.primary
    Then it should return 'Fredoka One, Arial'

  Scenario: ThemeConfig exposes animation constants
    Given ThemeConfig is loaded
    When I access ThemeConfig.ANIMATIONS.durations.normal
    Then it should return 200
    And ThemeConfig.ANIMATIONS.easing.bounceIn should return 'Back.easeOut'

  Scenario: ThemeConfig exposes gradient configuration
    Given ThemeConfig is loaded
    When I access ThemeConfig.GRADIENT.top
    Then it should return 0xFF6B6B
    And ThemeConfig.GRADIENT.middle should return 0xFF4081
    And ThemeConfig.GRADIENT.bottom should return 0x9C27B0
```

---

## Feature: BackgroundComponent

### Scenario: Background gradient identical to original
```gherkin
Feature: BackgroundComponent creates gradients
  As a scene
  I want to create gradient backgrounds easily
  So that I don't duplicate background code

  Background:
    Given a Phaser scene is created
    And the scene has ResponsiveUtils initialized

  Scenario: Create gradient background
    When I call BackgroundComponent.createGradient(scene)
    Then a gradient texture should be created
    And it should be cached with key 'defaultGradient'
    And the gradient should have Orange Pop at top
    And the gradient should have Bubble Pink in middle
    And the gradient should have Purple Magic at bottom
    And the image should be positioned at (0, 0)
    And the image origin should be (0, 0)

  Scenario: Gradient uses texture caching
    Given BackgroundComponent.createGradient(scene, 'test') was called once
    When I call BackgroundComponent.createGradient(scene, 'test') again
    Then the cached texture should be reused
    And no new texture should be generated

  Scenario: Custom gradient keys work
    When I call BackgroundComponent.createGradient(scene, 'customKey')
    Then the texture should be cached with key 'customKey'
    And subsequent calls should use the cached texture

  Scenario: Visual comparison with original
    Given the original gradient from MainMenuScene
    And the new BackgroundComponent gradient
    When I compare pixels at 10 different Y positions
    Then all pixel colors should match exactly
```

---

## Feature: TitleComponent

### Scenario: Single-line title matches original styling
```gherkin
Feature: TitleComponent creates styled titles
  As a scene
  I want to create consistent titles with animations
  So that all scenes have identical title styling

  Background:
    Given a Phaser scene is created
    And the scene has ResponsiveUtils initialized

  Scenario: Create default single-line title
    When I call TitleComponent.create(scene, {text: 'SETTINGS'})
    Then a text object should be created
    And the text should be 'SETTINGS'
    And the fontSize should be 64 (scaled)
    And the fontFamily should be 'Fredoka One, Arial'
    And the color should be '#FFEB3B' (Sunshine Yellow)
    And the stroke should be '#9C27B0' (Purple Magic)
    And the strokeThickness should be 8 (scaled)
    And the origin should be (0.5, 0.5)
    And the position should be at center X, 15% Y

  Scenario: Title bounce-in animation timing
    When I call TitleComponent.create(scene, {text: 'TEST', animate: true})
    Then the text should start at scale 0
    And a tween should animate scale from 0 to 1
    And the animation duration should be 600ms
    And the easing should be 'Back.easeOut'

  Scenario: Title pulse animation after bounce
    Given a title was created with animate: true and pulseOnComplete: true
    When the bounce-in animation completes
    Then a pulse animation should start
    And it should scale between 1.0 and 1.05
    And the duration should be 1000ms
    And the easing should be 'Sine.easeInOut'
    And it should repeat infinitely with yoyo

  Scenario: Multi-line title matches main menu
    When I call TitleComponent.createMultiLine(scene, ["AURORA'S", "READING", "ADVENTURE"])
    Then 3 text objects should be created
    And each line should have staggered animation
    And the first line delay should be 0ms
    And the second line delay should be 200ms
    And the third line delay should be 400ms
    And all lines should pulse after bounce-in

  Scenario: Title without animation
    When I call TitleComponent.create(scene, {text: 'TEST', animate: false})
    Then the text should be created at scale 1
    And no tweens should be created

  Scenario: Visual comparison with original
    Given an original title from SettingsScene
    And a new TitleComponent title with same config
    When I compare the text objects
    Then font size should match exactly
    Then color should match exactly
    Then stroke should match exactly
    Then position should match exactly
```

---

## Feature: ButtonComponent

### Scenario: Button styling matches original
```gherkin
Feature: ButtonComponent creates interactive buttons
  As a scene
  I want to create consistent buttons with interactions
  So that all buttons behave identically

  Background:
    Given a Phaser scene is created
    And the scene has ResponsiveUtils initialized

  Scenario: Create blue button
    When I call ButtonComponent.create with style 'blue'
    Then a button sprite should be created with texture 'btnBlue'
    And button text should use color '#ffffff'
    And button text should use stroke '#1976D2'
    And the button should be interactive
    And the cursor should be 'pointer'

  Scenario: Create green button
    When I call ButtonComponent.create with style 'green'
    Then a button sprite should be created with texture 'btnGreen'
    And button text should use color '#ffffff'
    And button text should use stroke '#2C5F2D'

  Scenario: Button hover effect timing
    Given a button was created with hoverEffect: true
    When the pointer moves over the button
    Then the button scale should tween to 1.1x
    And the animation duration should be 200ms
    And the easing should be 'Back.easeOut'
    And the text should also scale to 1.1x

  Scenario: Button hover out effect timing
    Given a button is being hovered
    When the pointer moves out
    Then the button scale should tween back to 1.0x
    And the animation duration should be 200ms
    And the easing should be 'Back.easeIn'

  Scenario: Button click animation
    Given a button was created with onClick callback
    When the user clicks the button
    Then the texture should change to pressed variant
    And the button should scale to 0.95x
    And the animation should be 100ms
    And the animation should yoyo (return to 1.0x)
    And when complete, texture should restore to normal
    And the onClick callback should be triggered

  Scenario: Button idle bounce animation
    Given a button was created with idleBounce: true
    Then the button should tween Y position up by 8 pixels
    And the animation should be 1000ms
    And it should yoyo infinitely
    And the easing should be 'Sine.easeInOut'

  Scenario: Back button convenience method
    When I call ButtonComponent.createBackButton(scene)
    Then a blue button should be created
    And the text should be 'BACK'
    And clicking it should navigate to 'MainMenu'
    And idle bounce should be enabled

  Scenario: Back button with custom target
    When I call ButtonComponent.createBackButton(scene, {targetScene: 'LetterPopMenu'})
    Then clicking the button should navigate to 'LetterPopMenu'

  Scenario: Visual comparison with original
    Given an original back button from SettingsScene
    And a new ButtonComponent back button
    When I compare both buttons at rest
    Then size should match exactly
    Then position should match exactly
    Then text styling should match exactly
    When I hover both buttons
    Then the scale animation should match exactly
    When I click both buttons
    Then the press animation should match exactly
```

---

## Feature: DecorationsComponent

### Scenario: Floating stars match original
```gherkin
Feature: DecorationsComponent creates decorative elements
  As a scene
  I want to add floating stars easily
  So that all scenes have consistent decorations

  Background:
    Given a Phaser scene is created
    And the scene has ResponsiveUtils initialized

  Scenario: Create default floating stars
    When I call DecorationsComponent.createFloatingStars(scene)
    Then 10 star text objects should be created
    And stars should use emoji ['⭐', '✨', '💫']
    And each star should have random emoji from the array
    And stars should be positioned across the screen
    And stars should have alpha 0.8

  Scenario: Star float animation timing
    Given floating stars were created
    When I inspect star[0] tweens
    Then it should have a float animation on Y axis
    And it should move 25 pixels (scaled)
    And the duration should be 2500ms
    And it should yoyo infinitely
    And the easing should be 'Sine.easeInOut'

  Scenario: Star rotation animation timing
    Given floating stars were created
    When I inspect star[0] tweens
    Then it should have a rotation animation
    And even-indexed stars should rotate 360 degrees
    And odd-indexed stars should rotate -360 degrees
    And the duration should be 3000ms
    And it should repeat infinitely
    And the easing should be 'Linear'

  Scenario: Star staggered delays
    Given floating stars were created
    Then star[0] should have delay 0ms
    And star[1] should have delay 100ms
    And star[2] should have delay 200ms
    And delays should increment by 100ms

  Scenario: Twinkling stars variant
    When I call DecorationsComponent.createTwinklingStars(scene)
    Then all float and rotation animations should be present
    And each star should also have alpha tween
    And alpha should tween between 0.8 and 0.3
    And the twinkle should yoyo infinitely

  Scenario: Custom star configuration
    When I call DecorationsComponent.createFloatingStars(scene, {count: 15, baseFontSize: 40})
    Then 15 stars should be created
    And the base font size should be 40 (scaled)

  Scenario: Visual comparison with original
    Given original floating stars from MainMenuScene
    And new DecorationsComponent stars
    When I compare star positions and animations
    Then positions should match exactly
    Then animation timings should match exactly
    Then emoji should match exactly
```

---

## Feature: SliderComponent

### Scenario: Slider matches original functionality
```gherkin
Feature: SliderComponent creates interactive sliders
  As a scene
  I want to create volume sliders easily
  So that settings are consistent

  Background:
    Given a Phaser scene is created
    And the scene has ResponsiveUtils initialized

  Scenario: Create volume slider
    When I call SliderComponent.create with label 'Master Volume'
    And initialValue is 75
    And suffix is '%'
    Then a label text should display 'Master Volume:'
    And a value text should display '75%'
    And a background bar should be drawn
    And a foreground bar should be drawn at 75% width
    And a draggable handle should be positioned at 75%

  Scenario: Slider styling matches original
    Given a slider was created
    Then the label color should be '#ffffff'
    And the label stroke should be '#9C27B0'
    And the value color should be '#FFEB3B'
    And the bar background color should be 0x5A2E5A
    And the bar foreground should use gradient (0xFFEB3B to 0xFF9800)
    And the handle should be white circle
    And the handle stroke should be purple

  Scenario: Slider drag updates value
    Given a slider was created with min 0, max 100, initial 50
    When the user drags the handle to 75% position
    Then the value text should update to '75%'
    And the foreground bar should update to 75% width
    And the onValueChange callback should be called with 75

  Scenario: Slider constrained to bounds
    Given a slider was created
    When the user drags beyond the bar's right edge
    Then the handle should be clamped to the maximum position
    And the value should be the maximum value
    When the user drags beyond the bar's left edge
    Then the handle should be clamped to the minimum position
    And the value should be the minimum value

  Scenario: Slider handle hover effect
    Given a slider was created
    When the pointer moves over the handle
    Then the handle should scale to 1.2x
    And the animation duration should be 150ms
    When the pointer moves out
    Then the handle should scale back to 1.0x

  Scenario: Slider with custom range
    When I call SliderComponent.create with minValue 5, maxValue 15, initialValue 10
    Then dragging to 0% should give value 5
    And dragging to 50% should give value 10
    And dragging to 100% should give value 15

  Scenario: getValue() method accuracy
    Given a slider with range 0-100 at position 75%
    When I call slider.getValue()
    Then it should return 75

  Scenario: Visual comparison with original
    Given an original volume slider from SettingsScene
    And a new SliderComponent slider
    When I compare both sliders
    Then styling should match exactly
    When I drag both sliders
    Then behavior should be identical
```

---

## Feature: VisibilityHandlerMixin

### Scenario: Tab visibility handling
```gherkin
Feature: VisibilityHandlerMixin manages focus events
  As a scene
  I want audio to pause when tab is hidden
  So that sounds don't play in background tabs

  Background:
    Given a Phaser scene is created
    And AudioManager is initialized
    And the scene is active

  Scenario: Setup creates event handlers
    When I call VisibilityHandlerMixin.setup(scene, 'MainMenu')
    Then scene.visibilityChangeHandler should be defined
    And scene.blurHandler should be defined
    And scene.focusHandler should be defined
    And event listeners should be registered

  Scenario: Tab becomes hidden
    Given VisibilityHandlerMixin was setup
    When document.hidden becomes true
    And visibilitychange event fires
    Then AudioManager.pauseAll() should be called
    And the scene should be paused

  Scenario: Tab becomes visible
    Given the scene is paused
    And document.hidden becomes false
    When visibilitychange event fires
    Then the scene should resume
    And AudioManager.resumeAll() should be called

  Scenario: Window loses focus (blur)
    Given VisibilityHandlerMixin was setup
    When window blur event fires
    Then AudioManager.pauseAll() should be called
    And the scene should be paused

  Scenario: Window gains focus
    Given the scene is paused
    When window focus event fires
    Then the scene should resume
    And AudioManager.resumeAll() should be called

  Scenario: Cleanup removes handlers
    Given VisibilityHandlerMixin was setup
    When I call VisibilityHandlerMixin.cleanup(scene)
    Then all event listeners should be removed
    And scene.visibilityChangeHandler should be cleaned up
    And scene.blurHandler should be cleaned up
    And scene.focusHandler should be cleaned up

  Scenario: No memory leaks
    Given VisibilityHandlerMixin was setup
    When the scene shuts down without calling cleanup
    Then event listeners should still be attached
    Given cleanup is called in shutdown
    Then no memory leaks should occur
```

---

## Feature: SettingsScene Migration

### Scenario: Migrated SettingsScene is identical to original
```gherkin
Feature: SettingsScene uses components
  As Aurora's dad
  I want the Settings scene to work identically after refactoring
  So that Aurora's experience is unchanged

  Background:
    Given the original SettingsScene (before refactoring)
    And the migrated SettingsScene (after refactoring)

  Scenario: Settings scene loads correctly
    When I navigate to Settings scene
    Then the scene should load without errors
    And no console warnings should appear

  Scenario: Background is identical
    When I compare both backgrounds
    Then the gradient colors should match exactly
    And the gradient should fill the entire screen

  Scenario: Title is identical
    When I compare both titles
    Then position should match exactly
    Then text content should match exactly
    Then font size should match exactly
    Then color and stroke should match exactly
    Then animation timing should match exactly

  Scenario: Volume sliders are identical
    When I compare the three volume sliders
    Then positions should match exactly
    Then styling should match exactly
    Then drag behavior should be identical
    Then value updates should work identically
    And localStorage saves should work identically

  Scenario: Back button is identical
    When I compare both back buttons
    Then position should match exactly
    Then styling should match exactly
    Then hover effect should match exactly
    Then click animation should match exactly
    Then navigation behavior should be identical

  Scenario: Floating stars are identical
    When I compare floating stars decorations
    Then positions should match exactly
    Then animation timings should match exactly
    Then emoji should match exactly

  Scenario: Visibility handling works
    Given I'm on Settings scene
    When I switch to another tab
    Then audio should pause
    And the scene should pause
    When I switch back to the tab
    Then audio should resume
    And the scene should resume

  Scenario: Settings scene performance
    Given I'm on Settings scene
    Then frame rate should be 60 FPS
    And memory usage should not increase vs original
    And CPU usage should not increase vs original

  Scenario: Code reduction verification
    When I count lines in SettingsScene.js
    Then the new version should have ~70% fewer lines
    And functionality should be 100% identical
```

---

## Feature: MainMenuScene Migration

### Scenario: Migrated MainMenuScene is identical to original
```gherkin
Feature: MainMenuScene uses components
  As Aurora's dad
  I want the Main Menu to work identically after refactoring
  So that Aurora sees no difference

  Background:
    Given the original MainMenuScene
    And the migrated MainMenuScene

  Scenario: Main menu loads correctly
    When the game starts
    Then MainMenu should load without errors
    And welcome voice should play

  Scenario: Multi-line title is identical
    When I compare the 3-line title
    Then all 3 lines should be positioned identically
    And the staggered animation should match exactly
    And the pulse animation should match exactly

  Scenario: Game tile is identical
    When I compare the Letter Pop game tile
    Then position should match exactly
    Then size should match exactly
    Then icon and text should match exactly
    Then hover effect should match exactly
    Then float animation should match exactly

  Scenario: Settings button is identical
    When I compare settings buttons
    Then position should match exactly (top-right)
    Then size should match exactly
    Then hover and click should match exactly

  Scenario: Debug button is identical
    When I compare debug buttons
    Then position should match exactly (top-left)
    Then appearance should match exactly
    Then click behavior should match exactly

  Scenario: Navigation works identically
    Given I'm on Main Menu
    When I click Letter Pop tile
    Then it should navigate to LetterPopMenu
    When I click Settings button
    Then it should navigate to Settings
    When I click Debug button
    Then it should navigate to LetterTest
```

---

## Feature: Comprehensive Integration Testing

### Scenario: All scenes work together
```gherkin
Feature: Complete game flow works identically
  As Aurora
  I want to play the game exactly as before
  So that my experience is unchanged

  Scenario: Complete Letter Pop game flow
    Given the game is loaded
    When I click Letter Pop on main menu
    Then I should see the Letter Pop menu
    When I adjust the time slider
    Then the value should update and save
    When I click START
    Then the game should load
    When I play through a round
    Then I should see the Results screen
    When I click PLAY AGAIN
    Then I should start a new round
    And everything should work identically to before refactoring

  Scenario: Settings persist across scenes
    Given I'm on Settings scene
    When I change Master Volume to 50%
    And I navigate to Main Menu
    And I navigate back to Settings
    Then Master Volume should still be 50%

  Scenario: Audio pause/resume across scenes
    Given I'm on Main Menu
    When I switch tabs away
    Then audio should pause
    When I navigate to Settings (in another tab)
    Then audio should remain paused
    When I switch back to the game tab
    Then audio should resume

  Scenario: Performance across all scenes
    Given I navigate through all scenes:
      | Scene |
      | MainMenu |
      | Settings |
      | LetterPopMenu |
      | LetterPop |
      | Results |
      | LetterTest |
    Then all scenes should maintain 60 FPS
    And memory should not leak
    And no console errors should occur

  Scenario: Zero visual regressions
    Given screenshots of all scenes before refactoring
    And screenshots of all scenes after refactoring
    When I compare screenshots pixel-by-pixel
    Then they should be identical (within 1% tolerance for anti-aliasing)
```

---

## Acceptance Criteria Summary

### Must Pass Before Phase Complete

**Component Functionality:**
- [ ] All component scenarios pass
- [ ] ThemeConfig provides consistent values
- [ ] BackgroundComponent creates identical gradients
- [ ] TitleComponent matches original styling and animations
- [ ] ButtonComponent matches original interactions
- [ ] DecorationsComponent matches original decorations
- [ ] SliderComponent matches original behavior
- [ ] VisibilityHandlerMixin manages focus correctly

**Scene Migration:**
- [ ] SettingsScene scenarios all pass
- [ ] MainMenuScene scenarios all pass
- [ ] LetterPopMenuScene works identically
- [ ] LetterTestScene works identically
- [ ] ResultsScene works identically

**Integration:**
- [ ] Complete game flow works identically
- [ ] Navigation between scenes works
- [ ] Settings persist correctly
- [ ] Audio pause/resume works
- [ ] No console errors or warnings

**Performance:**
- [ ] 60 FPS maintained in all scenes
- [ ] Memory usage not increased
- [ ] No memory leaks
- [ ] Texture caching working

**Code Quality:**
- [ ] 40-50% line reduction achieved
- [ ] Zero code duplication
- [ ] All components documented
- [ ] Git history clean with atomic commits

**Visual Verification:**
- [ ] Screenshots match pixel-perfect (within 1% tolerance)
- [ ] All animations identical timing
- [ ] All colors identical
- [ ] All positions identical

---

## Testing Methodology

### Manual Testing Checklist

For each migrated scene:
1. Load scene and verify no console errors
2. Compare visual appearance with screenshots
3. Test all interactive elements
4. Verify all animations (timing, easing, repetition)
5. Test navigation to/from other scenes
6. Verify audio pause/resume
7. Check localStorage persistence
8. Measure frame rate (should be 60 FPS)

### Automated Testing (Future)

These Gherkin scenarios can be automated with:
- Cypress for E2E testing
- Jest for component unit testing
- Percy for visual regression testing

### Rollback Criteria

If any scenario fails and cannot be fixed within 30 minutes:
1. Revert the affected commit
2. Document the issue
3. Fix in isolated branch
4. Re-test before re-merging

---

**Remember:** Aurora deserves software that works perfectly. Zero compromises on behavior. Every scenario must pass before phase completion.
