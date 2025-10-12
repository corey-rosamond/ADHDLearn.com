# Phase 7: Letter Pop - Single Static Bubble - BDD Scenarios

## Feature: Bubble Class Creation

```gherkin
Feature: Bubble Game Object Class
  As a developer
  I want to create a reusable Bubble class
  So that I can display letters in bubbles throughout the game

Background:
  Given the game project structure exists
  And LetterPopScene is working from Phase 6
```

## Scenario: Create Bubble.js File

```gherkin
Scenario: Set up Bubble class file
  Given I am implementing Phase 7
  When I create the Bubble class file
  Then it should be located at "src/gameobjects/Bubble.js"
  And it should export a Bubble class
  And the class should extend Phaser.GameObjects.Container
```

## Scenario: Bubble Constructor

```gherkin
Scenario: Initialize Bubble instance
  Given the Bubble class exists
  When I create a new Bubble instance
  Then the constructor should accept scene parameter
  And the constructor should accept x parameter
  And the constructor should accept y parameter
  And the constructor should accept letter parameter
  And it should call super(scene, x, y)
  And it should store the letter property
  And it should store the radius property
  And it should call createBubble method
  And it should call createLetter method
  And it should add itself to the scene
```

## Scenario: Bubble Class Methods

```gherkin
Scenario: Bubble class has required methods
  Given the Bubble class is defined
  Then it should have a constructor method
  And it should have a createBubble method
  And it should have a createLetter method
  And it should have a pop method (placeholder for future)
  And all methods should be properly documented
```

## Feature: Bubble Visual Creation

```gherkin
Feature: Bubble Graphics Rendering
  As a player
  I want to see an attractive bubble
  So that the game is visually engaging
```

## Scenario: Create Bubble Graphics

```gherkin
Scenario: Render bubble shape with gradient
  Given a Bubble instance is being created
  When the createBubble method is called
  Then a Graphics object should be created
  And the graphics should be added to the container
  And the bubble should be rendered as a circle
  And the bubble radius should be approximately 70 pixels
```

## Scenario: Gradient Effect Layers

```gherkin
Scenario: Draw gradient using multiple layers
  Given the createBubble method is executing
  When drawing the bubble gradient
  Then layer 1 should draw a shadow circle (gray, alpha 0.3, radius+5)
  And layer 2 should draw outer gradient (white, alpha 0.9, radius)
  And layer 3 should draw middle gradient (light purple, alpha 0.8, radius-10)
  And layer 4 should draw inner gradient (purple, alpha 0.7, radius-20)
  And layer 5 should draw highlight (white, alpha 0.6, offset -15,-15, radius 20)
  And layer 6 should draw border (3px stroke, purple, alpha 0.8)
  And the layers should blend to create smooth gradient
```

## Scenario: Bubble Shadow

```gherkin
Scenario: Draw shadow for depth effect
  Given the bubble is being rendered
  When the shadow layer is drawn
  Then it should be filled with gray color (0xcccccc)
  And the alpha should be 0.3 (subtle)
  And the radius should be 5 pixels larger than main bubble
  And it should be drawn at position (0, 0) relative to container
```

## Scenario: Bubble Gradient Fill

```gherkin
Scenario: Create spherical gradient effect
  Given the bubble shape is being drawn
  When the gradient layers are rendered
  Then the outermost layer should be lightest (white)
  And the middle layers should progressively darken (light purple to purple)
  And each layer should have decreasing radius
  And the alpha values should create smooth blending
  And the result should appear spherical and three-dimensional
```

## Scenario: Bubble Highlight

```gherkin
Scenario: Add glossy highlight effect
  Given the bubble gradient is drawn
  When the highlight is added
  Then it should be a white circle
  And it should have alpha 0.6 (semi-transparent)
  And it should be positioned at offset (-15, -15) from center
  And it should have radius of 20 pixels
  And it should create a shiny, glossy appearance
  And it should simulate light reflection
```

## Scenario: Bubble Border

```gherkin
Scenario: Add border for definition
  Given the bubble is drawn
  When the border is added
  Then it should use lineStyle with width 3
  And the color should be purple-ish (0xaaaaff)
  And the alpha should be 0.8
  And it should stroke a circle at the bubble radius
  And it should make the bubble edge clearly defined
```

## Feature: Letter Display

```gherkin
Feature: Letter Text Rendering
  As a player
  I want to see a letter clearly in the bubble
  So that I can learn and identify letters
```

## Scenario: Create Letter Text

```gherkin
Scenario: Display letter in bubble
  Given a Bubble instance is being created with letter "A"
  When the createLetter method is called
  Then a Text object should be created
  And the text content should be "A"
  And the text should be added to the container
```

## Scenario: Letter Styling

```gherkin
Scenario: Apply appropriate text styling
  Given the letter text is being created
  When the text style is applied
  Then the font size should be 56px
  And the font family should be Arial (or similar sans-serif)
  And the color should be dark (0x333333 or similar)
  And the font style should be bold
  And the text should be clearly readable
```

## Scenario: Letter Centering

```gherkin
Scenario: Center letter perfectly in bubble
  Given the letter text is created
  When the text origin is set
  Then setOrigin should be called with (0.5, 0.5)
  And the text should be positioned at (0, 0) relative to container
  And the text should appear perfectly centered in the bubble
  And the text should be horizontally centered
  And the text should be vertically centered
```

## Scenario: Letter Readability

```gherkin
Scenario: Ensure letter is readable
  Given the bubble and letter are rendered
  When I examine the visual result
  Then the letter should have high contrast against bubble gradient
  And the letter should be large enough to read easily
  And the letter should not be obscured by bubble effects
  And the letter should be the clear focal point
```

## Feature: Bubble in Scene

```gherkin
Feature: Display Bubble in LetterPopScene
  As a player
  I want to see the bubble in the game scene
  So that I can interact with it (in future phases)
```

## Scenario: Import Bubble Class

```gherkin
Scenario: Import Bubble in LetterPopScene
  Given the Bubble class is created
  When I update LetterPopScene.js
  Then I should import Bubble from '../gameobjects/Bubble.js'
  And the import should be at the top of the file
  And the class should be available in the scene
```

## Scenario: Create Bubble in Scene

```gherkin
Scenario: Instantiate bubble during scene creation
  Given LetterPopScene is being created
  When the create method runs
  Then createBubble method should be called
  And a new Bubble instance should be created
  And the bubble should be passed: this (scene) as first parameter
  And the bubble should be passed: 400 as x parameter
  And the bubble should be passed: 300 as y parameter
  And the bubble should be passed: 'A' as letter parameter
```

## Scenario: Position Bubble in Center

```gherkin
Scenario: Bubble appears in center of screen
  Given the bubble is created at position (400, 300)
  When the scene is rendered
  Then the bubble should appear in the center of the canvas
  And the canvas width is 800, so 400 is horizontal center
  And the canvas height is 600, so 300 is vertical center
  And the bubble should not overlap the title at top
  And the bubble should not overlap the back button at top-left
```

## Scenario: Store Bubble Reference

```gherkin
Scenario: Scene maintains reference to bubble
  Given the bubble is created in createBubble method
  When the bubble instance is created
  Then it should be stored in this.bubble property
  And the reference should be available to other scene methods
  And the bubble can be accessed later for animation or interaction
```

## Feature: Visual Quality

```gherkin
Feature: Bubble Visual Quality
  As a player
  I want the bubble to look professional and appealing
  So that the game feels polished
```

## Scenario: Gradient Smoothness

```gherkin
Scenario: Gradient appears smooth
  Given the bubble is rendered with multiple layers
  When I examine the gradient
  Then the color transition should appear smooth
  And there should be no visible banding
  And the layers should blend naturally
  And the gradient should simulate spherical shading
```

## Scenario: Color Contrast

```gherkin
Scenario: Bubble contrasts with background
  Given the scene has a blue gradient background
  And the bubble has a white-to-purple gradient
  When both are rendered
  Then the bubble should stand out clearly from background
  And the bubble should be easily distinguishable
  And the colors should be harmonious but distinct
```

## Scenario: Overall Appearance

```gherkin
Scenario: Bubble has appealing appearance
  Given the bubble is fully rendered
  When I view the final result
  Then the bubble should look glossy and three-dimensional
  And the highlight should make it appear shiny
  And the border should provide clear definition
  And the overall effect should be child-friendly and inviting
  And the bubble should resemble a soap bubble or balloon
```

## Scenario: Letter Visibility

```gherkin
Scenario: Letter is clearly visible
  Given the bubble and letter are both rendered
  When I examine the complete bubble
  Then the letter "A" should be immediately visible
  And the letter should be the most prominent element in the bubble
  And the dark letter color should contrast sharply with light bubble
  And the letter should be easily identifiable
```

## Feature: Code Quality

```gherkin
Feature: Clean Code Implementation
  As a developer
  I want well-organized, maintainable code
  So that future phases are easier to implement
```

## Scenario: Class Structure

```gherkin
Scenario: Bubble class is well-organized
  Given the Bubble class code
  Then the constructor should be first
  And createBubble method should be second
  And createLetter method should be third
  And helper methods should follow
  And the code should be logically organized
```

## Scenario: Code Comments

```gherkin
Scenario: Code is well-documented
  Given the Bubble class implementation
  Then the class should have a header comment
  And each method should have a comment explaining its purpose
  And complex logic should have inline comments
  And parameter purposes should be documented
```

## Scenario: Reusability

```gherkin
Scenario: Bubble class is reusable
  Given the Bubble class design
  When I want to create multiple bubbles
  Then I should be able to instantiate with different letters
  And I should be able to position at different coordinates
  And the class should work in any Phaser scene
  And no hardcoded dependencies on specific scenes
```

## Scenario: Extensibility

```gherkin
Scenario: Bubble class supports future features
  Given the Bubble class structure
  Then it should be easy to add animation methods
  And it should be easy to add interaction methods
  And it should be easy to add sound effects
  And the pop method placeholder should be ready for implementation
```

## Acceptance Criteria

### File Structure
- [ ] Bubble.js exists at src/gameobjects/Bubble.js
- [ ] File exports Bubble class as default
- [ ] Class properly extends Phaser.GameObjects.Container
- [ ] All imports and exports are correct

### Bubble Constructor
- [ ] Accepts scene, x, y, letter parameters
- [ ] Calls super(scene, x, y)
- [ ] Stores letter and radius properties
- [ ] Calls createBubble and createLetter methods
- [ ] Adds itself to scene with scene.add.existing(this)

### Bubble Graphics
- [ ] Creates Graphics object
- [ ] Draws shadow layer (gray, alpha 0.3, radius+5)
- [ ] Draws outer gradient layer (white, alpha 0.9, radius)
- [ ] Draws middle gradient layer (light purple, alpha 0.8, radius-10)
- [ ] Draws inner gradient layer (purple, alpha 0.7, radius-20)
- [ ] Draws highlight (white, alpha 0.6, offset -15,-15, radius 20)
- [ ] Draws border (3px stroke, purple, alpha 0.8)
- [ ] Graphics added to container

### Letter Display
- [ ] Creates Text object with letter "A"
- [ ] Font size is 56px
- [ ] Font is bold
- [ ] Color is dark (#333333 or similar)
- [ ] Text origin set to (0.5, 0.5)
- [ ] Letter appears centered in bubble
- [ ] Text added to container

### Scene Integration
- [ ] Bubble imported in LetterPopScene
- [ ] createBubble method added to LetterPopScene
- [ ] Bubble instantiated with (this, 400, 300, 'A')
- [ ] Bubble stored in this.bubble property
- [ ] Bubble appears in center of scene

### Visual Quality
- [ ] Bubble gradient appears smooth
- [ ] Highlight creates glossy effect
- [ ] Border provides clear definition
- [ ] Letter is clearly readable
- [ ] Bubble contrasts with background
- [ ] Overall appearance is professional and appealing

### Positioning
- [ ] Bubble positioned at (400, 300)
- [ ] Bubble is centered horizontally
- [ ] Bubble is centered vertically
- [ ] Bubble doesn't overlap title
- [ ] Bubble doesn't overlap back button
- [ ] Bubble is fully visible within canvas

### Code Quality
- [ ] Code is well-organized
- [ ] Methods are properly commented
- [ ] Class is reusable with different parameters
- [ ] No hardcoded dependencies
- [ ] Code follows established patterns

### Error Handling
- [ ] No console errors when bubble is created
- [ ] No visual glitches
- [ ] Bubble renders consistently across browsers

## Edge Cases to Test

```gherkin
Scenario: Create Bubble with Different Letter
  Given the Bubble class is implemented
  When I create a bubble with letter "B"
  Then the bubble should display "B" instead of "A"
  And all other functionality should work the same

Scenario: Create Bubble at Different Position
  Given the Bubble class is implemented
  When I create a bubble at position (200, 400)
  Then the bubble should appear at that position
  And it should render correctly

Scenario: Create Multiple Bubbles
  Given the Bubble class is implemented
  When I create multiple Bubble instances in the scene
  Then each should render independently
  And they should not interfere with each other
  And each should display its own letter

Scenario: Bubble Near Edge of Canvas
  Given a bubble is created near the canvas edge
  When the bubble is positioned at (50, 50)
  Then the bubble should still render completely
  And no part of the bubble should be cut off
  And the graphics should render correctly

Scenario: Very Long Letter String
  Given the Bubble is created with text "ABC"
  When the text is rendered
  Then the text should still fit in the bubble
  Or overflow gracefully if too long
  And the bubble should handle it without errors

Scenario: Special Characters
  Given the Bubble is created with letter "!"
  When the bubble is rendered
  Then the special character should display correctly
  And no errors should occur

Scenario: Empty String
  Given the Bubble is created with empty string ""
  When the bubble is rendered
  Then the bubble should display without a letter
  And no errors should occur

Scenario: Destroy Bubble
  Given a bubble exists in the scene
  When bubble.destroy() is called
  Then the bubble should be removed from scene
  And all graphics should be cleaned up
  And no memory leaks should occur

Scenario: Browser Zoom
  Given the bubble is displayed
  When the user zooms in or out in browser
  Then the bubble should scale appropriately
  And the gradient should remain smooth
  And the letter should remain centered

Scenario: Small Radius
  Given a bubble is created with radius 30
  When the bubble is rendered
  Then the gradient layers should adjust accordingly
  And the letter should still be visible
  And the bubble should render correctly

Scenario: Large Radius
  Given a bubble is created with radius 150
  When the bubble is rendered
  Then the gradient should scale appropriately
  And the letter should still be centered
  And performance should remain good
```

## Manual Testing Checklist

### Setup Phase
1. [ ] Create Bubble.js file in correct location
2. [ ] Implement Bubble class with all methods
3. [ ] Import Bubble in LetterPopScene
4. [ ] Add createBubble method to scene

### Visual Testing
5. [ ] Load LetterPopScene
6. [ ] Verify bubble appears in center
7. [ ] Verify bubble is circular
8. [ ] Verify gradient looks smooth
9. [ ] Verify highlight is visible (top-left)
10. [ ] Verify border is visible
11. [ ] Verify letter "A" is visible
12. [ ] Verify letter is centered
13. [ ] Verify letter is readable

### Color and Contrast
14. [ ] Bubble stands out from blue background
15. [ ] Letter contrasts with bubble
16. [ ] Colors are child-friendly
17. [ ] Gradient creates depth perception
18. [ ] Highlight creates glossy effect

### Positioning
19. [ ] Bubble is horizontally centered (400)
20. [ ] Bubble is vertically centered (300)
21. [ ] Bubble doesn't overlap title
22. [ ] Bubble doesn't overlap back button
23. [ ] Bubble is fully visible

### Code Quality
24. [ ] Review Bubble class code
25. [ ] Check for proper comments
26. [ ] Verify class structure
27. [ ] Confirm methods are organized
28. [ ] Check for code smells

### Browser Testing
29. [ ] Test in Chrome
30. [ ] Test in Firefox
31. [ ] Test in Safari (if available)
32. [ ] Test in Edge
33. [ ] Verify consistent rendering

### Console Testing
34. [ ] Open browser console
35. [ ] Load scene
36. [ ] Verify no errors
37. [ ] Verify no warnings
38. [ ] Check for performance issues

### Reusability Testing
39. [ ] Try creating bubble with letter "B"
40. [ ] Try creating bubble at different position
41. [ ] Try creating multiple bubbles (optional for Phase 7)
42. [ ] Verify class works as expected

### Performance Testing
43. [ ] Check FPS (should be 60)
44. [ ] Monitor memory usage
45. [ ] Verify scene loads quickly
46. [ ] No lag when creating bubble

### Documentation
47. [ ] Take screenshot of bubble
48. [ ] Document any issues found
49. [ ] Note visual quality
50. [ ] Confirm ready for Phase 8

## Success Criteria

**This phase is complete when:**

### Functional Completeness
1. Bubble.js file exists and is properly structured
2. Bubble class extends Phaser.GameObjects.Container
3. Bubble creates gradient graphics
4. Bubble displays letter in center
5. Bubble appears in LetterPopScene at (400, 300)

### Visual Quality
6. Bubble has smooth gradient (white to purple)
7. Bubble has glossy highlight effect
8. Bubble has visible border
9. Letter "A" is clearly visible and centered
10. Overall appearance is professional and appealing
11. Bubble contrasts well with background

### Technical Quality
12. Zero console errors
13. Code is clean and well-commented
14. Class is reusable with different parameters
15. Graphics render efficiently
16. No memory leaks

### Testing Completeness
17. Tested in multiple browsers
18. Visual quality verified
19. Positioning verified
20. All acceptance criteria met
21. Edge cases considered

### Code Quality
22. Well-organized class structure
23. Proper use of Container pattern
24. Methods are focused and clear
25. Comments explain intent
26. Follows Phaser best practices

### Ready for Next Phase
27. Bubble class ready for animation (Phase 8+)
28. Class supports adding interactivity
29. Structure supports multiple bubbles
30. Foundation solid for game logic

## Notes

**What We're Testing**
- Custom game object creation (Container)
- Graphics rendering (circles, gradients)
- Text rendering and centering
- Component composition (graphics + text)
- Scene integration
- Visual quality and appeal

**What We're NOT Testing Yet**
- Animation (Phase 8+)
- Interactivity/clicking (Phase 9+)
- Sound effects (Phase 10+)
- Multiple bubbles (Phase 11+)
- Random letters (Phase 12+)
- Game logic (future phases)

**Critical Success Factors**
- Bubble looks professional and appealing
- Letter is perfectly centered
- Gradient creates 3D effect
- Code is reusable and extensible
- Zero errors or glitches

**Why This Phase Matters**
- Establishes the core game object
- Creates visual foundation for gameplay
- Demonstrates custom game object creation
- Sets quality bar for future assets
- First step toward interactive gameplay

This phase is about getting the visual foundation right. Once the static bubble looks good, we can add animation and interaction in subsequent phases.
