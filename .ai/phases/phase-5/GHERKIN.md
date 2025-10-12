# Phase 5: Main Menu UI - BDD Scenarios

## Feature: Main Menu Display

```gherkin
Feature: Main Menu Interface
  As a player
  I want to see an attractive main menu
  So that I can start playing Aurora's Letter Adventure

Background:
  Given the game has loaded successfully
  And MainMenuScene is registered in the game config
  And the scene is set to start with MainMenuScene
```

## Scenario: Display Main Menu

```gherkin
Scenario: Main menu loads on game start
  When the game starts
  Then MainMenuScene should be created
  And the gradient background should be visible
  And the background should have multiple colors
  And the title "Aurora's Letter Adventure" should be displayed
  And the title should be centered horizontally at y=150
  And the START button should be visible
  And the button should be positioned at (400, 400)
```

## Scenario: Gradient Background

```gherkin
Scenario: Create colorful gradient background
  Given MainMenuScene is being created
  When the createGradientBackground method is called
  Then a Graphics object should be created
  And the gradient should span from top to bottom
  And the gradient should use vibrant colors
  And the gradient should cover the entire canvas
  And the gradient should be visually appealing to children
```

## Scenario: Title Display

```gherkin
Scenario: Display game title
  Given MainMenuScene is created
  When the title text is added
  Then it should display "Aurora's Letter Adventure"
  And the font size should be 48px
  And the text color should be white (#ffffff)
  And the text should have a black stroke for contrast
  And the stroke thickness should be 6 pixels
  And the text should be centered on the screen
  And the text should be readable against the background
```

## Scenario: START Button Creation

```gherkin
Scenario: Create interactive START button
  Given MainMenuScene is created
  When the createStartButton method is called
  Then a button background rectangle should be created
  And the rectangle should be 200 pixels wide
  And the rectangle should be 80 pixels tall
  And the rectangle should have a green background (#4CAF50)
  And the rectangle should have a white stroke/border
  And the button text "START" should be created
  And the text should be centered on the button
  And the text should be 36px bold white font
  And the button should be set as interactive
  And the cursor should change to pointer on hover
```

## Feature: Button Hover Effects

```gherkin
Feature: Button Hover Animation
  As a player
  I want visual feedback when hovering over buttons
  So that I know the button is interactive
```

## Scenario: Mouse Hover Over Button

```gherkin
Scenario: Button scales up on hover
  Given the START button is displayed
  And the button is at default scale (1.0)
  When the user moves the mouse over the button
  Then a pointerover event should be triggered
  And a scale tween should be created
  And the tween should target both button background and text
  And the scale should animate to 1.1 on both X and Y axis
  And the animation duration should be 200 milliseconds
  And the animation easing should be "Power2"
  And the button should appear larger
  And the cursor should change to a pointer/hand
```

## Scenario: Mouse Leaves Button

```gherkin
Scenario: Button scales back to normal when hover ends
  Given the START button is hovered
  And the button is scaled to 1.1
  When the user moves the mouse away from the button
  Then a pointerout event should be triggered
  And a scale tween should be created
  And the tween should target both button background and text
  And the scale should animate back to 1.0 on both X and Y axis
  And the animation duration should be 200 milliseconds
  And the animation easing should be "Power2"
  And the button should return to normal size
  And the cursor should change back to default
```

## Scenario: Multiple Hover Interactions

```gherkin
Scenario: Button responds to repeated hovering
  Given the START button is displayed
  When the user hovers over the button
  And the user moves away
  And the user hovers over the button again
  And the user moves away again
  Then each hover should trigger the scale up animation
  And each mouse out should trigger the scale down animation
  And the animations should be smooth each time
  And there should be no animation glitches or conflicts
```

## Feature: Button Click Interaction

```gherkin
Feature: Button Click and Scene Transition
  As a player
  I want to click the START button
  So that I can begin playing the game
```

## Scenario: Click START Button

```gherkin
Scenario: User clicks the START button
  Given the START button is displayed
  And the button is interactive
  When the user clicks the button
  Then a pointerdown event should be triggered
  And the click handler function should execute
  And a button press animation should start
  And the button should scale down to 0.95
  And the animation should yoyo back to 1.0
  And the total animation duration should be 200ms (100ms each way)
```

## Scenario: Button Click Animation Sequence

```gherkin
Scenario: Complete button click animation sequence
  Given the user has clicked the START button
  When the click animation begins
  Then the button should scale down to 0.95
  And the animation should wait 100 milliseconds
  And the button should scale back up to 1.0 (yoyo)
  And the animation should complete
  And the onComplete callback should be triggered
  And the visual feedback should feel responsive
```

## Feature: Audio Feedback

```gherkin
Feature: Button Click Sound
  As a player
  I want to hear a sound when clicking buttons
  So that I have audio confirmation of my action
```

## Scenario: Load Button Click Sound

```gherkin
Scenario: Preload button click audio
  Given MainMenuScene is being initialized
  When the preload method is called
  Then the audio file "button-click.mp3" should be loaded
  And the audio should be registered with key "buttonClick"
  And the audio should be ready to play
```

## Scenario: Play Sound on Button Click

```gherkin
Scenario: Button click triggers sound effect
  Given the button click sound is loaded
  And the START button is displayed
  When the user clicks the START button
  Then the sound.play method should be called with key "buttonClick"
  And the click sound should play immediately
  And the sound should not block other interactions
```

## Scenario: Handle Missing Audio Gracefully

```gherkin
Scenario: Button works even if audio fails to load
  Given the button click sound failed to load
  And the START button is displayed
  When the user clicks the START button
  Then the click animation should still play
  And the scene transition should still occur
  And no error should be thrown
  And the game should continue functioning normally
```

## Feature: Scene Transition

```gherkin
Feature: Transition to Game Scene
  As a player
  I want to transition to the game
  So that I can start playing after clicking START
```

## Scenario: Transition to LetterPopScene

```gherkin
Scenario: START button transitions to game scene
  Given the START button is clicked
  And the button animation is complete
  When the onComplete callback is triggered
  Then the scene.start method should be called
  And the method should receive "LetterPopScene" as parameter
  And the current MainMenuScene should stop
  And the LetterPopScene should start
  And the LetterPopScene should be created
  And the LetterPopScene create method should be called
```

## Scenario: LetterPopScene Placeholder Display

```gherkin
Scenario: LetterPopScene shows placeholder content
  Given the scene transition is complete
  When LetterPopScene is created
  Then placeholder text should be displayed
  And the text should indicate "Letter Pop Game Coming Soon"
  And the text should be centered on screen
  And a back button should be visible for testing
  And the back button should say "Back to Menu"
```

## Scenario: Return to Main Menu from Placeholder

```gherkin
Scenario: Back button returns to main menu
  Given LetterPopScene is displayed
  And the back button is visible
  When the user clicks the back button
  Then the scene should transition back to MainMenuScene
  And the main menu should be displayed again
  And all main menu elements should be visible
  And the START button should be interactive again
```

## Scenario: Scene Transition is Smooth

```gherkin
Scenario: No errors during scene transition
  Given the START button is clicked
  When the scene transitions from MainMenu to LetterPop
  Then no JavaScript errors should occur
  And the browser console should be error-free
  And the transition should feel instantaneous (<100ms perceived)
  And there should be no visual glitches
  And there should be no audio interruptions
```

## Feature: ADHD-Friendly Design

```gherkin
Feature: ADHD-Friendly Interface Elements
  As a player with ADHD
  I want clear visual feedback and simple choices
  So that I can easily navigate the game
```

## Scenario: Button is Large and Easy to Click

```gherkin
Scenario: START button is appropriately sized
  Given the main menu is displayed
  Then the START button should be at least 200x80 pixels
  And the button should be easy to click without precision
  And the button should have adequate padding
  And the hit area should match the visual size
```

## Scenario: Immediate Visual Feedback

```gherkin
Scenario: Button provides instant feedback
  Given the START button is displayed
  When the user hovers over the button
  Then the hover effect should start within 16ms (1 frame)
  And the animation should be smooth at 60fps
  And the feedback should feel instantaneous
```

## Scenario: High Contrast Elements

```gherkin
Scenario: Button stands out from background
  Given the main menu is displayed
  Then the START button should have high contrast
  And the button should be easily distinguishable
  And the text should be clearly readable
  And color-blind users should be able to see the button
```

## Scenario: Single Clear Action

```gherkin
Scenario: Main menu presents one primary action
  Given the main menu is displayed
  Then only one interactive button should be visible (START)
  And the button should be the obvious next action
  And there should be no decision paralysis
  And the player should know exactly what to do
```

## Acceptance Criteria

### Visual Requirements
- [ ] Gradient background displays with vibrant colors
- [ ] Title "Aurora's Letter Adventure" is visible and styled
- [ ] START button is prominently displayed
- [ ] Button has clear visual boundaries (stroke/border)
- [ ] Button is large enough (min 200x80px)
- [ ] All text is readable with good contrast

### Interaction Requirements
- [ ] Button is interactive (setInteractive called)
- [ ] Cursor changes to pointer on button hover
- [ ] Button scales up on hover (1.0 → 1.1)
- [ ] Button scales back on mouse out (1.1 → 1.0)
- [ ] Hover animations are smooth (200ms duration)
- [ ] Button scales down briefly on click (press effect)
- [ ] Click animation uses yoyo for bounce-back effect

### Audio Requirements
- [ ] Button click sound loads in preload
- [ ] Sound plays when button is clicked
- [ ] Sound playback doesn't block other actions
- [ ] Game handles missing audio gracefully (no errors)

### Scene Transition Requirements
- [ ] Clicking START transitions to LetterPopScene
- [ ] Scene transition happens after click animation
- [ ] LetterPopScene displays placeholder content
- [ ] No errors occur during transition
- [ ] Console remains error-free

### Performance Requirements
- [ ] Hover feedback feels instant (<50ms perceived delay)
- [ ] Click feedback feels responsive (<100ms perceived delay)
- [ ] Scene transition feels smooth (<200ms)
- [ ] No frame drops during animations
- [ ] Memory usage remains stable

### Accessibility Requirements
- [ ] Button works with mouse clicks
- [ ] Button works with touch events (mobile)
- [ ] Button works with keyboard (Enter/Space if focused)
- [ ] Visual feedback is clear without audio
- [ ] Audio feedback is helpful but not required

## Edge Cases to Test

```gherkin
Scenario: Rapid Button Hovering
  Given the START button is displayed
  When the user rapidly hovers on and off the button
  Then each hover should trigger appropriate animation
  And animations should not conflict or stack
  And the button should remain functional

Scenario: Click During Hover Animation
  Given the button is currently animating (hover)
  When the user clicks before hover animation completes
  Then the click should still register
  And the click animation should play
  And the scene transition should occur normally

Scenario: Multiple Rapid Clicks
  Given the START button is displayed
  When the user clicks the button multiple times rapidly
  Then only the first click should register
  And subsequent clicks should be ignored during transition
  And the scene should only transition once

Scenario: Audio Permission Blocked
  Given the browser blocks audio autoplay
  When the user clicks the START button
  Then the click animation should still play
  And the scene transition should still occur
  And no audio error should appear in console

Scenario: Scene Not Registered
  Given LetterPopScene is not registered in config
  When the user clicks START
  Then an error should appear in console
  And the game should handle the error gracefully
  And the main menu should remain functional

Scenario: Slow Network - Audio Loading
  Given the button click audio is still loading
  When the user clicks the START button
  Then the button animation should play
  And the scene transition should occur
  And the sound should be skipped (not wait for loading)

Scenario: Touch Device Interaction
  Given the game is running on a touch device
  When the user taps the START button
  Then the button should respond to touch
  And the hover animation should be skipped
  And the click animation should play
  And the scene transition should occur

Scenario: Very Small Screen
  Given the game is running on a small screen (<400px)
  When the main menu is displayed
  Then the button should still be visible
  And the button should still be clickable
  And the layout should not break
```

## Manual Testing Checklist

### Setup Phase
1. [ ] Game loads without errors
2. [ ] MainMenuScene is the starting scene
3. [ ] All assets are available or gracefully handled

### Visual Testing
4. [ ] Gradient background renders correctly
5. [ ] Colors are vibrant and appealing
6. [ ] Title text is visible and centered
7. [ ] Title has readable contrast
8. [ ] START button is visible and styled
9. [ ] Button stands out from background

### Hover Testing
10. [ ] Move mouse over button - cursor changes
11. [ ] Button scales up smoothly
12. [ ] Move mouse away - button scales back
13. [ ] Repeat hover multiple times - no issues
14. [ ] Hover animation feels smooth (no jank)

### Click Testing
15. [ ] Click button - sound plays
16. [ ] Click button - button scales down briefly
17. [ ] Click button - scene transitions
18. [ ] Verify LetterPopScene displays
19. [ ] Back button returns to main menu

### Audio Testing
20. [ ] Click sound is audible
21. [ ] Sound doesn't overlap itself
22. [ ] If audio missing, no errors occur
23. [ ] Mute browser - game still works

### Performance Testing
24. [ ] Open performance monitor
25. [ ] Check FPS stays at 60
26. [ ] Check memory doesn't leak
27. [ ] Hover multiple times - performance stable
28. [ ] Click button - transition is fast

### Device Testing
29. [ ] Test on desktop (mouse)
30. [ ] Test on tablet (touch)
31. [ ] Test on mobile (touch, small screen)
32. [ ] Test in Chrome
33. [ ] Test in Firefox
34. [ ] Test in Safari (if available)

### Console Testing
35. [ ] Open browser console
36. [ ] Load game - no errors
37. [ ] Hover button - no warnings
38. [ ] Click button - no errors
39. [ ] Scene transition - no errors

### Edge Case Testing
40. [ ] Rapid hover on/off
41. [ ] Click during animation
42. [ ] Multiple rapid clicks
43. [ ] Click immediately after load
44. [ ] Return from LetterPop and click again

## Success Criteria

**This phase is complete when:**

### Functional Completeness
1. Main menu displays with gradient background
2. Title and START button are visible
3. Button responds to hover with scale animation
4. Button responds to click with sound and animation
5. Button click transitions to LetterPopScene
6. LetterPopScene placeholder displays correctly

### Quality Metrics
7. Zero console errors during normal operation
8. All animations are smooth (60fps)
9. User interactions feel responsive (<100ms feedback)
10. Audio plays when available, degrades gracefully when not

### Testing Completeness
11. Tested with mouse input
12. Tested with touch input
13. Tested in at least 2 browsers
14. All acceptance criteria checked off
15. All edge cases pass

### Documentation
16. Screenshots taken of main menu
17. Video recorded of interaction flow (optional)
18. Any issues documented
19. Performance metrics noted

### Ready for Next Phase
20. Code is clean and organized
21. No known bugs
22. Scene transition pattern established
23. Ready to build LetterPopScene in Phase 6

## Notes

**Keep Testing Simple**
- This phase focuses on one interaction: clicking START
- Most complex part is coordinating animation + audio + transition
- Edge cases matter: audio loading, rapid clicks, touch devices

**What We're Testing**
- UI component creation
- Event handling (hover, click)
- Animation smoothness
- Audio integration
- Scene management
- Cross-device compatibility

**What We're NOT Testing Yet**
- Complex game logic (none exists)
- Multiple buttons/menus (only one button)
- Persistent state (not needed yet)
- Score/progress (not implemented)

**ADHD-Friendly Validation**
- Button must feel immediately responsive
- Visual feedback must be obvious
- Only one clear action available
- No overwhelming choices or animations
- High contrast and clear visuals

This is the first interactive phase. Getting the button interaction right sets the pattern for all future UI elements.
