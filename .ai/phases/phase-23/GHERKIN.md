# Phase 23: Word Catch - Scene Setup - BDD Scenarios

## Feature: Word Catch Scene Creation

```gherkin
Feature: Word Catch Scene Setup
  As a developer
  I want to create the Word Catch game scene with player controls
  So that Aurora can move a basket left and right to prepare for catching words

Background:
  Given Phase 1-22 is completed
  And the main menu is functional
  And Letter Pop game is fully working
```

## Scenario: Create WordCatchScene File

```gherkin
Scenario: Set up WordCatchScene.js file structure
  Given I am in the project src/scenes directory
  When I create WordCatchScene.js
  Then the file should extend Phaser.Scene
  And it should have a constructor setting key to "WordCatchScene"
  And it should have init() method
  And it should have preload() method
  And it should have create() method
  And it should have update(time, delta) method
  And the scene should be added to game config
```

## Scenario: Initialize Scene Variables

```gherkin
Scenario: Initialize game state in init() method
  Given WordCatchScene is created
  When the init() method is called
  Then score should be set to 0
  And lives should be set to 3
  And level should be set to 1
  And gameOver should be set to false
  And all variables should be properly scoped to this
```

## Scenario: Create Unique Background

```gherkin
Scenario: Design background different from Letter Pop
  Given WordCatchScene create() is called
  When createBackground() method runs
  Then a sky gradient should be rendered
  And the sky should NOT be bubble-theme blue
  And the sky colors should be sky blue to light blue (#87CEEB to #E0F6FF)
  And ground should be rendered at bottom (y=560, height=40)
  And ground should be green (#90EE90)
  And decorative clouds should be added
  And clouds should be white with 0.8 alpha
  And background should not distract from gameplay
```

## Scenario: Create Player Basket

```gherkin
Scenario: Create basket sprite at bottom of screen
  Given WordCatchScene create() is called
  When createBasket() method runs
  Then a basket graphic should be created
  And the basket should be 80 pixels wide
  And the basket should be 20 pixels tall
  And the basket should be brown color (#8B4513)
  And the basket should be positioned at x=400 (center)
  And the basket should be positioned at y=550 (near bottom)
  And the basket should be a Container object
  And the basket should be added to scene
```

## Scenario: Add Basket Idle Animation

```gherkin
Scenario: Basket has subtle idle animation
  Given the basket is created
  When the game is running in idle state
  Then the basket should have a gentle bounce animation
  And the bounce should move between y=545 and y=550
  And the animation should take 1000ms per cycle
  And the animation should yoyo (bounce up and down)
  And the animation should repeat infinitely
  And the ease should be "Sine.easeInOut" for smoothness
```

## Scenario: Setup Keyboard Controls

```gherkin
Scenario: Configure arrow key controls
  Given WordCatchScene create() is called
  When setupKeyboardControls() method runs
  Then cursor keys should be created via input.keyboard.createCursorKeys()
  And basketSpeed should be set to 250 pixels/second
  And left arrow key should be registered
  And right arrow key should be registered
  And keyboard controls should be ready for update loop
```

## Scenario: Move Basket Left with Keyboard

```gherkin
Scenario: Player presses left arrow key
  Given the game is running
  And the basket is at x=400
  When the player presses the left arrow key
  And update() method is called with delta=16
  Then updateBasketMovement() should be called
  And the basket x position should decrease
  And the basket should move at 250 pixels/second
  And the movement should be smooth (delta-based)
  And the basket should continue moving while key is held
```

## Scenario: Move Basket Right with Keyboard

```gherkin
Scenario: Player presses right arrow key
  Given the game is running
  And the basket is at x=400
  When the player presses the right arrow key
  And update() method is called with delta=16
  Then updateBasketMovement() should be called
  And the basket x position should increase
  And the basket should move at 250 pixels/second
  And the movement should be smooth (delta-based)
  And the basket should continue moving while key is held
```

## Scenario: Basket Stays Within Left Boundary

```gherkin
Scenario: Prevent basket from going off left edge
  Given the game is running
  And the basket is at x=60
  When the player presses left arrow key
  And update() calls constrainBasket()
  Then the basket x should be clamped to minimum of 50
  And the basket should not move further left
  And no errors should occur
  And the basket should remain visible
```

## Scenario: Basket Stays Within Right Boundary

```gherkin
Scenario: Prevent basket from going off right edge
  Given the game is running
  And the basket is at x=740
  When the player presses right arrow key
  And update() calls constrainBasket()
  Then the basket x should be clamped to maximum of 750
  And the basket should not move further right
  And no errors should occur
  And the basket should remain visible
```

## Scenario: Setup Touch Controls

```gherkin
Scenario: Configure touch/pointer input
  Given WordCatchScene create() is called
  When setupTouchControls() method runs
  Then touchMovement variable should be initialized to null
  And pointerdown event listener should be registered
  And pointerup event listener should be registered
  And screen should be divided into touch zones
  And left zone should be 0-320px (40% of 800px)
  And right zone should be 480-800px (40% of 800px)
  And middle zone should be 320-480px (20% of 800px)
```

## Scenario: Touch Left Zone Moves Basket Left

```gherkin
Scenario: Player touches left side of screen
  Given the game is running
  And touch controls are active
  When the player touches screen at x=200
  And the pointerdown event fires
  Then touchMovement should be set to "left"
  And in update loop, basket should move left
  And basket should move at 250 pixels/second
  And basket should continue moving while touch is held
```

## Scenario: Touch Right Zone Moves Basket Right

```gherkin
Scenario: Player touches right side of screen
  Given the game is running
  And touch controls are active
  When the player touches screen at x=600
  And the pointerdown event fires
  Then touchMovement should be set to "right"
  And in update loop, basket should move right
  And basket should move at 250 pixels/second
  And basket should continue moving while touch is held
```

## Scenario: Touch Middle Zone Does Nothing

```gherkin
Scenario: Player touches middle of screen
  Given the game is running
  And touch controls are active
  When the player touches screen at x=400
  And the pointerdown event fires
  Then touchMovement should remain null
  And basket should not move
  And no errors should occur
```

## Scenario: Release Touch Stops Movement

```gherkin
Scenario: Player lifts finger from screen
  Given the game is running
  And touchMovement is set to "left" or "right"
  When the player lifts their finger
  And the pointerup event fires
  Then touchMovement should be set to null
  And basket should stop moving
  And basket should remain at current position
```

## Scenario: Create UI Elements

```gherkin
Scenario: Display score, lives, and level
  Given WordCatchScene create() is called
  When createUI() method runs
  Then a score text should be created at top left
  And score text should display "Score: 0"
  And a lives text should be created at top right
  And lives text should display "Lives: 3"
  And a level text should be created at top center
  And level text should display "Level: 1"
  And all text should use consistent font
  And all text should be readable against background
```

## Scenario: Add Back Button

```gherkin
Scenario: Create button to return to menu
  Given WordCatchScene create() is called
  When createUI() method runs
  Then a back button should be created
  And the button should be visible
  And the button should be clickable
  And clicking should call returnToMenu() method
  And the button should be positioned clearly (top left or bottom left)
```

## Scenario: Return to Main Menu

```gherkin
Scenario: Player clicks back button
  Given the game is running
  When the player clicks the back button
  Then returnToMenu() method should be called
  And scene should stop gracefully
  And MainMenu scene should start
  And event listeners should be cleaned up
  And no memory leaks should occur
```

## Scenario: Launch Scene from Menu

```gherkin
Scenario: Player selects Word Catch from menu
  Given the player is on the main menu
  And a "Word Catch" button exists
  When the player clicks "Word Catch" button
  Then WordCatchScene should start
  And scene transition should be smooth
  And init() should be called
  And preload() should be called
  And create() should be called
  And the game should be ready to play
  And no errors should appear in console
```

## Scenario: Scene Loads Without Errors

```gherkin
Scenario: Word Catch scene initializes properly
  Given all files are created correctly
  When the scene is started
  Then no errors should appear in console
  And no warnings should appear in console
  And background should render correctly
  And basket should render correctly
  And UI should render correctly
  And controls should be responsive
```

## Scenario: Smooth Movement Performance

```gherkin
Scenario: Basket movement is smooth and responsive
  Given the game is running at 60fps
  When the player uses controls to move basket
  Then movement should be smooth (no jitter)
  And movement should be responsive (< 50ms input lag)
  And frame rate should remain at 60fps
  And no visual stuttering should occur
  And delta-based movement should compensate for frame variations
```

## Scenario: Keyboard and Touch Don't Conflict

```gherkin
Scenario: Both input methods work independently
  Given the game is running
  When the player uses keyboard controls
  And then switches to touch controls
  Then both should work without conflicts
  And input should switch seamlessly
  And basket should respond to whichever input is active
  And no errors should occur from input switching
```

## Scenario: Game State Persists During Play

```gherkin
Scenario: Variables remain consistent during gameplay
  Given the game is running
  When the player moves the basket around
  Then score should remain 0 (no words yet)
  And lives should remain 3
  And level should remain 1
  And gameOver should remain false
  And no variables should unexpectedly change
```

## Scenario: Scene Cleanup on Exit

```gherkin
Scenario: Resources are cleaned up when leaving scene
  Given WordCatchScene is running
  When the player returns to menu
  Then scene shutdown should be called
  And event listeners should be removed
  And tweens should be stopped
  And graphics should be destroyed
  And memory should be freed
  And no memory leaks should occur
```

## Scenario: Multiple Scene Loads

```gherkin
Scenario: Scene can be loaded, exited, and reloaded
  Given the game is at main menu
  When the player enters Word Catch scene
  And then returns to menu
  And then enters Word Catch scene again
  Then the scene should initialize fresh
  And score should reset to 0
  And lives should reset to 3
  And basket should be at starting position (x=400)
  And no errors should occur
  And no duplicate objects should exist
```

## Acceptance Criteria - Visual Verification

```gherkin
Scenario: Visual elements are correct
  Given WordCatchScene is loaded
  Then I should see:
    | Element               | Requirement                          |
    | Background            | Sky gradient, not bubble blue        |
    | Ground                | Green bar at bottom                  |
    | Clouds                | White clouds in sky (decorative)     |
    | Basket                | Brown basket at bottom center        |
    | Score Text            | "Score: 0" at top left               |
    | Lives Text            | "Lives: 3" at top right              |
    | Level Text            | "Level: 1" at top center             |
    | Back Button           | Visible and clickable                |
```

## Acceptance Criteria - Functional Verification

```gherkin
Scenario: Controls work as expected
  Given WordCatchScene is loaded
  Then I should be able to:
    | Action                    | Expected Result                      |
    | Press left arrow          | Basket moves left                    |
    | Press right arrow         | Basket moves right                   |
    | Hold left arrow           | Basket moves continuously left       |
    | Hold right arrow          | Basket moves continuously right      |
    | Move to left edge         | Basket stops at boundary             |
    | Move to right edge        | Basket stops at boundary             |
    | Touch left side           | Basket moves left                    |
    | Touch right side          | Basket moves right                   |
    | Touch middle              | Basket doesn't move                  |
    | Release touch             | Basket stops moving                  |
    | Click back button         | Return to main menu                  |
```

## Acceptance Criteria - Performance

```gherkin
Scenario: Performance meets requirements
  Given WordCatchScene is running
  Then the following should be true:
    | Metric                    | Requirement                          |
    | Frame rate                | Consistent 60fps                     |
    | Input lag                 | < 50ms response time                 |
    | Movement smoothness       | No jitter or stuttering              |
    | Memory usage              | Stable, no leaks                     |
    | CPU usage                 | Minimal (< 30% on target device)     |
    | Console errors            | Zero errors                          |
    | Console warnings          | Zero warnings                        |
```

## Edge Cases to Test

```gherkin
Scenario: Rapid Input Changes
  Given the game is running
  When the player rapidly alternates left and right inputs
  Then the basket should respond to each input
  And no errors should occur
  And movement should remain smooth

Scenario: Simultaneous Keyboard and Touch
  Given the game is running
  When the player uses keyboard and touch at the same time
  Then the most recent input should take precedence
  And no conflicts should occur
  And basket should move correctly

Scenario: Hold Both Arrow Keys
  Given the game is running
  When the player holds both left and right arrow keys
  Then the basket should not move (or follow key priority)
  And no errors should occur
  And movement should resume when one key is released

Scenario: Touch Outside Game Canvas
  Given the game is running
  When the player touches outside the game area
  Then no movement should occur
  And no errors should occur

Scenario: Basket at Boundary with Continued Input
  Given the basket is at left boundary (x=50)
  When the player continues pressing left arrow
  Then the basket should stay at x=50
  And no errors should occur
  And no visual glitches should appear

Scenario: Scene Transition During Movement
  Given the basket is moving
  When the player clicks back to menu
  Then movement should stop immediately
  And transition should be smooth
  And no errors should occur
```

## Manual Testing Checklist

### Setup Phase
1. [ ] Create WordCatchScene.js in src/scenes/
2. [ ] Add scene to game configuration
3. [ ] Verify file has no syntax errors
4. [ ] Verify scene loads without console errors

### Visual Testing
5. [ ] Load scene and verify background renders
6. [ ] Verify background is NOT bubble blue
7. [ ] Verify sky gradient is correct colors
8. [ ] Verify ground is green and at bottom
9. [ ] Verify clouds are visible and white
10. [ ] Verify basket renders at bottom center
11. [ ] Verify basket is brown color
12. [ ] Verify basket size is appropriate (80x20)
13. [ ] Verify UI text displays correctly
14. [ ] Verify back button is visible

### Keyboard Control Testing
15. [ ] Press left arrow - basket moves left
16. [ ] Press right arrow - basket moves right
17. [ ] Hold left arrow - continuous movement
18. [ ] Hold right arrow - continuous movement
19. [ ] Release key - movement stops
20. [ ] Move to left edge - basket stops at boundary
21. [ ] Move to right edge - basket stops at boundary
22. [ ] Test rapid key alternation

### Touch Control Testing
23. [ ] Touch left side - basket moves left
24. [ ] Touch right side - basket moves right
25. [ ] Touch middle - no movement
26. [ ] Hold touch - continuous movement
27. [ ] Release touch - movement stops
28. [ ] Test on actual touch device (if available)
29. [ ] Test touch boundaries work correctly

### Performance Testing
30. [ ] Check frame rate (F12 Performance tab)
31. [ ] Verify consistent 60fps
32. [ ] Test for 2-3 minutes continuously
33. [ ] Check for memory leaks (Memory tab)
34. [ ] Verify no performance degradation over time

### Integration Testing
35. [ ] Start from main menu
36. [ ] Click "Word Catch" button
37. [ ] Verify scene loads smoothly
38. [ ] Click back button
39. [ ] Verify return to menu works
40. [ ] Re-enter scene and verify reset
41. [ ] Repeat 5+ times to check for issues

### Edge Case Testing
42. [ ] Rapid left-right input switching
43. [ ] Hold both arrow keys simultaneously
44. [ ] Touch outside canvas area
45. [ ] Basket at edge with continued input
46. [ ] Exit scene during movement
47. [ ] Switch between keyboard and touch input

### Final Verification
48. [ ] Zero console errors
49. [ ] Zero console warnings
50. [ ] Movement feels smooth and responsive
51. [ ] All UI elements readable
52. [ ] Scene transitions are clean
53. [ ] Ready for Phase 24 (falling words)

## Success Criteria

**This phase is complete when:**
1. WordCatchScene.js exists and is properly structured
2. Scene loads from main menu without errors
3. Background is visually distinct from Letter Pop (no bubble theme)
4. Basket renders at bottom center of screen
5. Left/right arrow keys move basket smoothly
6. Touch left/right zones move basket smoothly
7. Basket stays within screen boundaries
8. Controls are responsive (< 50ms lag)
9. UI elements display correctly (score, lives, level)
10. Back button returns to main menu
11. Scene can be loaded, exited, and reloaded without issues
12. Zero console errors or warnings
13. Maintains 60fps during gameplay
14. Aurora can successfully control the basket
15. Ready for Phase 24 implementation

## Notes

**Testing Focus**
- Control responsiveness is critical for this phase
- Movement must feel smooth and natural
- Aurora is young, so controls must be simple and reliable
- Test on actual target device if possible

**What We're Testing**
- Scene structure and lifecycle
- Input handling (keyboard and touch)
- Movement physics and boundaries
- Visual rendering and styling
- Performance and stability

**What We're NOT Testing**
- Falling words (Phase 24)
- Collision detection (Phase 24)
- Scoring mechanics (Phase 24)
- Word recognition (Phase 24)
- Sound effects (later phases)

This phase is purely about establishing the foundation: scene, controls, and player movement. Everything else comes later.
