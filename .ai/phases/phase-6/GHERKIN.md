# Phase 6: Letter Pop - Scene Setup - BDD Scenarios

## Feature: Letter Pop Scene Display

```gherkin
Feature: Letter Pop Scene Setup
  As a player
  I want to see the Letter Pop game scene
  So that I can prepare to play the bubble popping game

Background:
  Given the game has loaded successfully
  And MainMenuScene has a working START button
  And LetterPopScene is registered in the game config
```

## Scenario: Scene Creation

```gherkin
Scenario: Create LetterPopScene file structure
  Given I am setting up the game
  When I create the LetterPopScene.js file
  Then it should be located at "src/scenes/LetterPopScene.js"
  And it should extend Phaser.Scene
  And it should have constructor method
  And it should have preload method
  And it should have create method
  And it should have scene key "LetterPopScene"
```

## Scenario: Scene Registration

```gherkin
Scenario: Register LetterPopScene in game config
  Given LetterPopScene class exists
  When I update the game config
  Then LetterPopScene should be in the scene array
  And it should be listed after MainMenuScene
  And the game should recognize "LetterPopScene" as valid key
```

## Scenario: Scene Transition from Main Menu

```gherkin
Scenario: Transition from MainMenuScene to LetterPopScene
  Given the game is running
  And MainMenuScene is currently active
  When the user clicks the START button
  Then MainMenuScene should stop
  And LetterPopScene should start
  And LetterPopScene create method should be called
  And the scene should display without errors
```

## Feature: Colorful Background

```gherkin
Feature: Background Display
  As a player
  I want to see a colorful, engaging background
  So that the game feels fun and inviting
```

## Scenario: Create Gradient Background

```gherkin
Scenario: Display gradient background
  Given LetterPopScene is being created
  When the createBackground method is called
  Then a Graphics object should be created
  And the gradient should use sky blue (#87CEEB) at top
  And the gradient should use turquoise (#00CED1) at bottom
  And the gradient should span the full height
  And the gradient should span the full width
  And the gradient should be smooth (no visible bands)
```

## Scenario: Background Color Choice

```gherkin
Scenario: Background provides good contrast
  Given the background gradient is displayed
  When I examine the colors
  Then the colors should be bright and child-friendly
  And the colors should be different from MainMenuScene
  And the colors should provide contrast for white text
  And the colors should provide contrast for future bubbles
  And the overall effect should be sky-like or playful
```

## Feature: Title Display

```gherkin
Feature: Game Title Display
  As a player
  I want to see the game title clearly
  So that I know what game mode I'm in
```

## Scenario: Display Main Title

```gherkin
Scenario: Show "Letter Pop!" title
  Given LetterPopScene is created
  When the createTitle method is called
  Then the main title should display "Letter Pop!"
  And the title should be positioned at (400, 80)
  And the title should be centered horizontally
  And the font size should be 64px
  And the font should be bold
  And the text color should be white (#ffffff)
  And the text should have a blue stroke (#0066cc)
  And the stroke thickness should be 8 pixels
  And the title should be clearly readable
```

## Scenario: Display Subtitle

```gherkin
Scenario: Show instructional subtitle
  Given the main title is displayed
  When the subtitle is added
  Then it should say "Pop the bubbles to learn letters!"
  And it should be positioned at (400, 140)
  And it should be centered horizontally
  And the font size should be 24px
  And the text color should be white
  And the text should have a blue stroke
  And the stroke thickness should be 4 pixels
  And it should be readable but less prominent than main title
```

## Feature: Back Button

```gherkin
Feature: Back to Menu Navigation
  As a player
  I want a back button
  So that I can return to the main menu
```

## Scenario: Create Back Button

```gherkin
Scenario: Display back button in scene
  Given LetterPopScene is created
  When the createBackButton method is called
  Then a button background rectangle should be created
  And the rectangle should be positioned at (100, 50)
  And the rectangle should be 150 pixels wide
  And the rectangle should be 60 pixels tall
  And the background color should be red/coral (#ff6b6b)
  And the rectangle should have a white stroke
  And the stroke width should be 3 pixels
```

## Scenario: Back Button Label

```gherkin
Scenario: Add text label to back button
  Given the back button background is created
  When the button text is added
  Then the text should say "< Menu"
  And the text should be positioned at (100, 50)
  And the text should be centered on the button
  And the font size should be 24px
  And the text should be bold
  And the text color should be white
```

## Scenario: Back Button Interactivity

```gherkin
Scenario: Make back button interactive
  Given the back button is created
  When setInteractive is called on the button
  Then the button should respond to mouse events
  And the cursor should change to pointer on hover
  And the button should be clickable
  And the button should respond to touch events
```

## Feature: Back Button Hover Effects

```gherkin
Feature: Back Button Hover Animation
  As a player
  I want visual feedback when hovering over the back button
  So that I know it's interactive
```

## Scenario: Hover Over Back Button

```gherkin
Scenario: Back button scales up on hover
  Given the back button is displayed
  And the button is at default scale (1.0)
  When the user moves mouse over the button
  Then a pointerover event should be triggered
  And a scale tween should be created
  And the tween should target both button background and text
  And the scale should animate to 1.1
  And the animation duration should be 200 milliseconds
  And the animation easing should be "Power2"
  And the button should appear larger
```

## Scenario: Mouse Leaves Back Button

```gherkin
Scenario: Back button returns to normal size
  Given the back button is hovered
  And the button is scaled to 1.1
  When the user moves mouse away from button
  Then a pointerout event should be triggered
  And a scale tween should be created
  And the scale should animate back to 1.0
  And the animation duration should be 200 milliseconds
  And the button should return to normal size
```

## Feature: Back Button Click

```gherkin
Feature: Back Button Click Interaction
  As a player
  I want to click the back button
  So that I can return to the main menu
```

## Scenario: Click Back Button

```gherkin
Scenario: User clicks back button
  Given the back button is displayed
  And the button is interactive
  When the user clicks the button
  Then a pointerdown event should be triggered
  And the click handler should execute
  And a button press animation should start
  And the button should scale down to 0.95
  And the animation should yoyo back to 1.0
```

## Scenario: Play Sound on Back Button Click

```gherkin
Scenario: Back button click plays sound
  Given the button click sound is loaded
  And the back button is displayed
  When the user clicks the back button
  Then the sound.play method should be called
  And the sound should play with key "buttonClick"
  And the sound should not block the transition
```

## Scenario: Handle Missing Audio Gracefully

```gherkin
Scenario: Back button works without audio
  Given the button click sound is not available
  When the user clicks the back button
  Then the button should check if sound exists
  And if sound doesn't exist, skip playing it
  And the animation should still play
  And the scene transition should still occur
  And no error should be thrown
```

## Feature: Scene Transition Back to Menu

```gherkin
Feature: Return to Main Menu
  As a player
  I want to return to the main menu
  So that I can choose a different activity
```

## Scenario: Transition to MainMenuScene

```gherkin
Scenario: Back button returns to main menu
  Given the back button is clicked
  And the button animation is complete
  When the onComplete callback is triggered
  Then scene.start should be called with "MainMenuScene"
  And LetterPopScene should stop
  And MainMenuScene should start
  And the main menu should be displayed
  And the START button should be interactive again
```

## Scenario: No Errors During Transition

```gherkin
Scenario: Smooth transition without errors
  Given the back button is clicked
  When the scene transitions from LetterPop to MainMenu
  Then no JavaScript errors should occur
  And the browser console should be error-free
  And the transition should feel instant (<100ms)
  And there should be no visual glitches
```

## Scenario: Bidirectional Navigation

```gherkin
Scenario: Navigate back and forth between scenes
  Given the game is running
  When the user clicks START from main menu
  Then LetterPopScene should display
  When the user clicks back button
  Then MainMenuScene should display
  When the user clicks START again
  Then LetterPopScene should display again
  And all elements should work correctly each time
  And no memory leaks should occur
```

## Feature: Visual Hierarchy

```gherkin
Feature: Clear Visual Layout
  As a player
  I want a clear, organized layout
  So that I can easily understand the scene
```

## Scenario: Element Positioning

```gherkin
Scenario: All elements are positioned correctly
  Given LetterPopScene is displayed
  Then the back button should be in the top-left corner
  And the main title should be at the top-center
  And the subtitle should be below the title
  And the center of the screen should be empty
  And the empty space should be available for future game elements
```

## Scenario: Visual Hierarchy

```gherkin
Scenario: Elements have clear hierarchy
  Given LetterPopScene is displayed
  When I examine the visual layout
  Then the title should be the most prominent element
  And the subtitle should be secondary
  And the back button should be clearly visible but not distracting
  And the layout should guide the eye naturally
  And the design should feel balanced
```

## Feature: ADHD-Friendly Design

```gherkin
Feature: ADHD-Friendly Scene Design
  As a player with ADHD
  I want a clear, simple scene
  So that I can focus without being overwhelmed
```

## Scenario: Simple Layout

```gherkin
Scenario: Scene has minimal complexity
  Given LetterPopScene is displayed
  Then the scene should have only 3 main elements
  And the elements should be: title, subtitle, back button
  And there should be no unnecessary decorations
  And the colors should be pleasant but not overwhelming
  And the layout should not feel cluttered
```

## Scenario: Clear Navigation

```gherkin
Scenario: Back button is easy to find
  Given LetterPopScene is displayed
  Then the back button should be in a consistent location
  And the button should be large enough to click easily
  And the button label should be clear
  And the button should provide immediate hover feedback
```

## Scenario: Bright and Engaging

```gherkin
Scenario: Scene is visually engaging
  Given LetterPopScene is displayed
  Then the colors should be bright and cheerful
  And the background should be interesting but not distracting
  And the title should be playful and inviting
  And the overall design should feel fun
```

## Acceptance Criteria

### File Structure
- [ ] LetterPopScene.js exists at src/scenes/LetterPopScene.js
- [ ] Scene extends Phaser.Scene properly
- [ ] Scene has constructor, preload, and create methods
- [ ] Scene is registered in game config

### Scene Transitions
- [ ] START button in MainMenuScene transitions to LetterPopScene
- [ ] Back button in LetterPopScene returns to MainMenuScene
- [ ] Transitions are smooth and error-free
- [ ] Scenes can be navigated multiple times without issues

### Background
- [ ] Gradient background displays correctly
- [ ] Colors are bright and child-friendly
- [ ] Gradient spans full canvas
- [ ] Background is visually distinct from MainMenuScene

### Title Display
- [ ] Main title "Letter Pop!" is visible
- [ ] Title is 64px bold white text
- [ ] Title has blue stroke for contrast
- [ ] Title is centered at top of scene
- [ ] Subtitle is visible and readable
- [ ] Subtitle is appropriately smaller than main title

### Back Button
- [ ] Back button displays in top-left corner
- [ ] Button has colored background and white stroke
- [ ] Button label "< Menu" is visible
- [ ] Button is interactive (setInteractive called)
- [ ] Cursor changes to pointer on hover

### Back Button Animation
- [ ] Button scales up on hover (1.0 → 1.1)
- [ ] Button scales down when mouse leaves (1.1 → 1.0)
- [ ] Hover animations are smooth (200ms)
- [ ] Button scales down on click (press effect)
- [ ] Click animation uses yoyo

### Audio Integration
- [ ] Button click sound loads (if available)
- [ ] Sound plays on button click
- [ ] Missing audio is handled gracefully (no errors)

### Console and Errors
- [ ] No console errors when scene loads
- [ ] No console errors during transitions
- [ ] No console errors during button interactions
- [ ] No memory leaks after multiple transitions

### Layout and Design
- [ ] Elements are positioned correctly
- [ ] Visual hierarchy is clear
- [ ] Center space is empty for future gameplay
- [ ] Design is ADHD-friendly (simple, clear, engaging)

## Edge Cases to Test

```gherkin
Scenario: Rapid Scene Transitions
  Given the game is running
  When the user rapidly clicks START and back button
  Then each transition should complete properly
  And no errors should occur
  And the scenes should not conflict

Scenario: Click Back Button During Load
  Given LetterPopScene is loading
  When the user clicks back button immediately
  Then the button should either:
    - Not be interactive yet (safe)
    - Or transition correctly if interactive
  And no errors should occur

Scenario: Audio Not Available
  Given the audio file is missing or blocked
  When LetterPopScene is created
  Then the scene should load successfully
  And no audio errors should appear
  And the back button should still work

Scenario: Very Small Screen
  Given the game is running on a small screen (<400px)
  When LetterPopScene is displayed
  Then all elements should be visible
  And the back button should be accessible
  And text should be readable

Scenario: Touch Device
  Given the game is running on a touch device
  When the user taps the back button
  Then the button should respond to touch
  And the transition should work correctly

Scenario: Scene Doesn't Exist
  Given LetterPopScene tries to transition to MainMenuScene
  And MainMenuScene is not registered (hypothetical)
  When the transition is triggered
  Then an error should be logged
  And the game should handle it gracefully

Scenario: Multiple Background Renders
  Given LetterPopScene is created
  When createBackground is called
  Then the background should render once
  And no duplicate backgrounds should be created
  And memory should be managed properly
```

## Manual Testing Checklist

### Setup
1. [ ] LetterPopScene.js file created
2. [ ] Scene registered in config
3. [ ] Game loads without errors

### Navigation Testing
4. [ ] Click START from main menu
5. [ ] Verify LetterPopScene loads
6. [ ] Click back button
7. [ ] Verify MainMenuScene loads
8. [ ] Repeat navigation 5 times
9. [ ] Check for errors or issues

### Visual Testing
10. [ ] Background gradient displays correctly
11. [ ] Colors are bright and appealing
12. [ ] Title "Letter Pop!" is visible
13. [ ] Title has proper styling and contrast
14. [ ] Subtitle is visible and readable
15. [ ] Back button is visible in top-left

### Interaction Testing
16. [ ] Hover over back button
17. [ ] Verify cursor changes to pointer
18. [ ] Verify button scales up
19. [ ] Move mouse away
20. [ ] Verify button scales back down
21. [ ] Click back button
22. [ ] Verify sound plays (if available)
23. [ ] Verify button scales down briefly
24. [ ] Verify transition to main menu

### Performance Testing
25. [ ] Open performance monitor
26. [ ] Load scene 10 times
27. [ ] Check memory usage is stable
28. [ ] Verify 60 FPS maintained
29. [ ] Check for memory leaks

### Device Testing
30. [ ] Test on desktop with mouse
31. [ ] Test on tablet with touch
32. [ ] Test on mobile phone
33. [ ] Test in Chrome
34. [ ] Test in Firefox
35. [ ] Test in Safari (if available)

### Console Testing
36. [ ] Open browser console
37. [ ] Load LetterPopScene
38. [ ] Verify no errors
39. [ ] Hover and click button
40. [ ] Verify no warnings
41. [ ] Transition back to menu
42. [ ] Verify no errors

### Edge Case Testing
43. [ ] Rapid scene transitions
44. [ ] Click button during animations
45. [ ] Test with audio disabled
46. [ ] Test on very small screen
47. [ ] Test with touch events

## Success Criteria

**This phase is complete when:**

### Functional Completeness
1. LetterPopScene file exists and is properly structured
2. Scene displays colorful gradient background
3. Title and subtitle are visible and styled
4. Back button is displayed and functional
5. Back button returns to MainMenuScene
6. Transitions work smoothly in both directions

### Visual Quality
7. Background is colorful and child-friendly
8. Title has high contrast and readability
9. Layout is clean and organized
10. Elements are positioned correctly
11. Visual hierarchy is clear

### Interaction Quality
12. Back button provides immediate hover feedback
13. Button animations are smooth
14. Click sound plays when available
15. All interactions feel responsive

### Technical Quality
16. Zero console errors during normal operation
17. Code is clean and well-organized
18. Scene follows established patterns
19. Audio failures handled gracefully
20. Memory usage is stable

### Testing Completeness
21. Tested with mouse and touch
22. Tested in multiple browsers
23. Tested scene transitions multiple times
24. All edge cases verified
25. All acceptance criteria met

### Documentation
26. Code has clear comments
27. Any issues documented
28. Screenshots taken (optional)

### Ready for Next Phase
29. Scene structure ready for gameplay elements
30. Center area available for bubbles (Phase 7)
31. Pattern established for future scenes
32. No known bugs or issues

## Notes

**What We're Testing**
- Scene creation and registration
- Scene transitions (bidirectional)
- Background rendering
- UI element creation and positioning
- Button interactions
- Audio integration
- Error handling

**What We're NOT Testing Yet**
- Bubble objects (Phase 7)
- Letter display (Phase 7)
- Game logic (future phases)
- Score tracking (future phases)
- Multiple bubbles (future phases)

**Critical Success Factors**
- Clean scene transitions
- Consistent button behavior
- Colorful, engaging visuals
- ADHD-friendly design
- Zero errors in console

This phase establishes the foundation for the Letter Pop game. Everything added in future phases will build on this structure.
