# Phase 29: Letter Builder - Scene Setup - BDD Scenarios

## Feature: Letter Builder Scene Setup

```gherkin
Feature: Letter Builder Scene Setup
  As a developer
  I want to create the Letter Builder scene with proper UI and navigation
  So that Aurora has a solid foundation for the letter-building mini-game

Background:
  Given the game is loaded in the browser
  And MainMenuScene is functional
  And ContentProvider has letter data available
```

## Scenario: Create and Register LetterBuilderScene

```gherkin
Scenario: LetterBuilderScene file exists and is registered
  When I check the project structure
  Then "LetterBuilderScene.js" should exist in the scenes directory
  And LetterBuilderScene should be registered in the game configuration
  And the scene key should be "LetterBuilderScene"
  And the scene should extend Phaser.Scene
```

## Scenario: Scene Loads Successfully

```gherkin
Scenario: Navigate to Letter Builder from main menu
  Given I am on the MainMenuScene
  When I click the "Letter Builder" button
  Then the scene should transition smoothly
  And LetterBuilderScene should load
  And there should be no console errors
  And the scene should be fully interactive
```

## Scenario: Unique Background Displays

```gherkin
Scenario: Letter Builder has distinctive visual theme
  Given LetterBuilderScene is loaded
  Then the background should display warm colors
  And the background should have a gradient effect
  And the background should have subtle grid lines
  And the background should be visually distinct from:
    | Game         | Background Style        |
    | Letter Pop   | Blue sky with clouds    |
    | Word Catch   | Purple-pink gradient    |
  And the background should suggest a construction/building theme
```

## Scenario: Target Letter Outline Displays

```gherkin
Scenario: Display letter outline for current letter
  Given LetterBuilderScene is loaded
  And ContentProvider returns letter "A"
  Then a large letter outline should display at position (400, 250)
  And the letter should be 200-300px in height
  And the letter should have a stroke only (not filled)
  And the stroke color should be light gray (#CCCCCC)
  And the stroke thickness should be 10px
  And the letter should be centered horizontally
  And the letter "A" should be clearly visible
```

## Scenario: Letter Outline Animation

```gherkin
Scenario: Letter outline animates on scene entry
  Given LetterBuilderScene is starting
  When the create() method completes
  Then the letter outline should start at scale 0
  And the outline should animate to scale 1
  And the animation duration should be 500ms
  And the animation easing should be "Back.easeOut"
  And the animation should start 300ms after scene starts
```

## Scenario: Display UI Header

```gherkin
Scenario: Header bar displays game information
  Given LetterBuilderScene is loaded
  Then a header bar should display at the top
  And the header should have a semi-transparent brown background (0x8B4513)
  And the title "Letter Builder" should display at (400, 30)
  And the title font size should be 32px
  And the title should be white with brown stroke
  And the title should be centered
```

## Scenario: Display Progress Indicator

```gherkin
Scenario: Show current letter progress
  Given LetterBuilderScene is loaded
  And this is the first letter in the round
  Then the progress text should display "1/5"
  And the progress should be positioned at (700, 30)
  And the progress font size should be 24px
  And the progress should be white with brown stroke

  When I complete the first letter and move to the second
  Then the progress text should update to "2/5"

  When I reach the fifth letter
  Then the progress text should display "5/5"
```

## Scenario: Display Instruction Text

```gherkin
Scenario: Show clear instructions for current letter
  Given LetterBuilderScene is loaded
  And the current letter is "A"
  Then instruction text should display "Build the letter A"
  And the instruction should be positioned at (400, 100)
  And the instruction font size should be 28px
  And the instruction should be brown with white stroke
  And the instruction should be centered

  When the letter changes to "B"
  Then the instruction should update to "Build the letter B"
```

## Scenario: Create Pieces Area

```gherkin
Scenario: Designate area for draggable letter pieces
  Given LetterBuilderScene is loaded
  Then a horizontal separator line should display at y=420
  And the separator should be 800px wide
  And the separator should be brown (0x8B4513)
  And a pieces area background should display at (400, 510)
  And the pieces area should be 800x180 pixels
  And the pieces area should have a semi-transparent background
  And placeholder text should read "Drag pieces to build the letter"
  And the placeholder should be centered at (400, 510)
```

## Scenario: Create Back Button

```gherkin
Scenario: Back button displays and is interactive
  Given LetterBuilderScene is loaded
  Then a back button should display at position (50, 30)
  And the button should be 60x60 pixels
  And the button should have a brown background (0x8B4513)
  And the button should have a white border (3px)
  And the button should display a "←" icon
  And the icon should be 36px white text
  And the icon should be centered in the button
  And the button should be interactive with hand cursor
```

## Scenario: Back Button Hover Effect

```gherkin
Scenario: Back button provides hover feedback
  Given LetterBuilderScene is loaded
  And the back button is visible
  When I move my cursor over the back button
  Then the cursor should change to a pointer/hand
  And the button should scale to 1.1 (10% larger)
  And the scale animation should take 200ms
  And the animation should use "Power2" easing
  And the icon should also scale with the button

  When I move my cursor away from the button
  Then the button should scale back to 1.0
  And the scale animation should take 200ms
```

## Scenario: Back Button Click Handler

```gherkin
Scenario: Back button returns to main menu
  Given LetterBuilderScene is loaded
  And the back button is visible
  When I click the back button
  Then a button click sound should play
  And the button should scale down to 0.9
  And the button should scale back up to 1.0 (yoyo effect)
  And the scale animation should take 100ms
  And after the animation completes
  Then the scene should transition to MainMenuScene
  And there should be no console errors
```

## Scenario: Entry Animation Sequence

```gherkin
Scenario: Scene plays polished entry animation
  Given LetterBuilderScene is starting
  When the scene loads
  Then the camera should fade in over 300ms
  And the fade should use color RGB(255, 229, 180)
  And after 300ms, the letter outline should begin animating
  And the outline should scale from 0 to 1 over 500ms
  And the outline should use "Back.easeOut" easing
  And the total animation duration should be 800ms
  And the user should be able to interact after 800ms
```

## Scenario: Initialize Scene State

```gherkin
Scenario: Scene state variables are properly initialized
  Given LetterBuilderScene is being created
  When the constructor runs
  Then currentLetter should be null
  And currentLetterIndex should be 0
  And totalLetters should be 5
  And score should be 0
  And letterPieces should be an empty array
  And letterOutline should be null

  When create() method runs
  And loadNextLetter() is called
  Then currentLetter should contain letter data from ContentProvider
  And currentLetterIndex should be 1
  And letterOutline should reference the outline text object
```

## Scenario: Load Letter from ContentProvider

```gherkin
Scenario: Fetch random letter for building exercise
  Given LetterBuilderScene is starting
  And ContentProvider has 26 letters available
  When loadNextLetter() is called
  Then ContentProvider.getRandomLetter() should be invoked
  And the returned letter data should have:
    | Property      | Type   |
    | letter        | String |
    | id            | Number |
    | name          | String |
    | phonicsSound  | String |
  And currentLetter should store this letter data
  And the letter outline should display the letter character
```

## Scenario: Handle Multiple Letters

```gherkin
Scenario: Progress through multiple letters in a round
  Given LetterBuilderScene is loaded
  And I am on letter 1 of 5
  When I complete the letter (simulation)
  And loadNextLetter() is called
  Then currentLetterIndex should increment to 2
  And progressText should update to "2/5"
  And the new letter outline should display
  And the instruction text should update

  When I complete 4 more letters
  Then currentLetterIndex should be 5
  And progressText should show "5/5"
  And the round should be complete
```

## Scenario: Visual Contrast and Accessibility

```gherkin
Scenario: UI elements have sufficient contrast
  Given LetterBuilderScene is loaded
  Then the letter outline (gray) should be visible against the warm background
  And the instruction text (brown) should be readable against the background
  And the header text (white) should be visible against the brown header
  And the back button (brown) should be visible against the background
  And all text should have stroke outlines for enhanced readability
  And the contrast ratio should meet WCAG AA standards (4.5:1 minimum)
```

## Scenario: Responsive Layout

```gherkin
Scenario: UI elements are positioned correctly
  Given LetterBuilderScene is loaded
  And the game canvas is 800x600 pixels
  Then the header should span the full width (800px)
  And the header should be 60px tall
  And the letter outline should be in the upper-middle area (y=250)
  And the pieces area should occupy the bottom 1/3 of screen (y=420-600)
  And all elements should be centered horizontally
  And no elements should overlap inappropriately
  And the layout should feel balanced and spacious
```

## Edge Cases

```gherkin
Scenario: Handle missing letter data
  Given LetterBuilderScene is starting
  And ContentProvider.getRandomLetter() returns null
  When loadNextLetter() is called
  Then the scene should handle the error gracefully
  And a fallback letter should be used (e.g., "A")
  Or an error message should display
  And the game should not crash
  And an error should be logged to the console

Scenario: Handle rapid back button clicks
  Given LetterBuilderScene is loaded
  When I rapidly click the back button 5 times
  Then only one scene transition should occur
  And the transition animation should not stack or glitch
  And no console errors should occur
  And the MainMenuScene should load correctly

Scenario: Handle scene interruption during animation
  Given LetterBuilderScene is playing entry animation
  And the animation is 400ms in progress
  When I click the back button immediately
  Then the scene should stop the animation
  And the scene should transition to MainMenuScene
  And there should be no orphaned tweens or leaks
  And no console errors should occur
```

## Acceptance Criteria

### Must Have
- [ ] LetterBuilderScene.js file exists and is properly structured
- [ ] Scene is registered in game configuration
- [ ] Scene loads without errors when navigated to
- [ ] Unique warm-colored gradient background displays
- [ ] Background has subtle grid lines (construction theme)
- [ ] Background is visually distinct from Letter Pop and Word Catch
- [ ] Target letter outline displays prominently (200-300px)
- [ ] Letter outline is stroke-only, not filled
- [ ] Outline color is light gray (#CCCCCC)
- [ ] Header displays "Letter Builder" title
- [ ] Progress indicator shows "X/5" format
- [ ] Instruction text shows "Build the letter X"
- [ ] Pieces area is designated at bottom of screen
- [ ] Horizontal separator line visible at y=420
- [ ] Back button displays at top-left (50, 30)
- [ ] Back button is 60x60 pixels (ADHD-friendly size)
- [ ] Back button has hover effect (scale to 1.1)
- [ ] Back button has click effect (scale to 0.9, yoyo)
- [ ] Back button plays click sound
- [ ] Back button returns to MainMenuScene
- [ ] Entry animation plays (camera fade + outline scale)
- [ ] Entry animation duration is 800ms total
- [ ] Scene state initializes correctly (all variables)
- [ ] Letter data loads from ContentProvider
- [ ] No console errors or warnings

### Visual Verification
- [ ] Background has warm colors (yellows, oranges, browns)
- [ ] Background gradient is smooth
- [ ] Grid lines are subtle (not distracting)
- [ ] Letter outline is clearly visible
- [ ] Letter outline stroke is thick (10px)
- [ ] All text is readable with good contrast
- [ ] UI layout feels balanced and spacious
- [ ] No elements overlap inappropriately
- [ ] Header bar is visually distinct
- [ ] Pieces area is clearly separated from outline area

### Interaction Verification
- [ ] Back button cursor changes to pointer on hover
- [ ] Back button scales smoothly on hover
- [ ] Back button returns to normal size when hover ends
- [ ] Back button click triggers sound
- [ ] Back button click triggers scale animation
- [ ] Scene transition to menu is smooth
- [ ] Entry animation plays automatically on load
- [ ] Letter outline animates from scale 0 to 1
- [ ] All animations are smooth (60fps)

### Technical Verification
- [ ] Scene extends Phaser.Scene correctly
- [ ] Scene key is "LetterBuilderScene"
- [ ] All instance variables initialize in constructor
- [ ] preload() method exists (even if empty)
- [ ] create() method builds all UI elements
- [ ] update() method exists for future use
- [ ] ContentProvider integration works
- [ ] Letter data is valid and complete
- [ ] State management is functional
- [ ] Progress tracking works (1/5, 2/5, etc.)

## Manual Testing Checklist

### Setup
1. [ ] Ensure game loads in browser
2. [ ] Navigate to MainMenuScene
3. [ ] Verify Letter Builder button exists
4. [ ] Click Letter Builder button

### Visual Testing
5. [ ] Verify LetterBuilderScene loads
6. [ ] Check background is warm-colored
7. [ ] Check background has grid lines
8. [ ] Check background is distinct from other games
9. [ ] Verify letter outline displays
10. [ ] Check outline is large (200-300px)
11. [ ] Check outline is stroke-only
12. [ ] Verify header displays correctly
13. [ ] Check title "Letter Builder" is visible
14. [ ] Check progress "1/5" displays
15. [ ] Verify instruction text displays
16. [ ] Check pieces area is designated
17. [ ] Check separator line is visible
18. [ ] Verify back button displays at top-left

### Interaction Testing
19. [ ] Hover over back button
20. [ ] Verify cursor changes to pointer
21. [ ] Verify button scales up
22. [ ] Move cursor away, verify button scales down
23. [ ] Click back button
24. [ ] Verify click sound plays
25. [ ] Verify button press animation
26. [ ] Verify scene transitions to menu
27. [ ] Return to Letter Builder
28. [ ] Verify entry animation plays
29. [ ] Check camera fade-in effect
30. [ ] Check outline scale-in effect

### State Testing
31. [ ] Open browser console (F12)
32. [ ] Check for console errors (should be none)
33. [ ] Type: `game.scene.getScene('LetterBuilderScene')`
34. [ ] Verify scene object exists
35. [ ] Type: `game.scene.getScene('LetterBuilderScene').currentLetter`
36. [ ] Verify letter data is present
37. [ ] Type: `game.scene.getScene('LetterBuilderScene').currentLetterIndex`
38. [ ] Verify index is 1
39. [ ] Type: `game.scene.getScene('LetterBuilderScene').totalLetters`
40. [ ] Verify total is 5

### Edge Case Testing
41. [ ] Rapidly click back button multiple times
42. [ ] Verify only one transition occurs
43. [ ] Return to Letter Builder
44. [ ] Click back button during entry animation
45. [ ] Verify scene transitions cleanly
46. [ ] Check console for errors
47. [ ] Test on different browser (Chrome, Firefox)
48. [ ] Test on mobile device (if available)
49. [ ] Check touch events work (back button)
50. [ ] Verify all tests pass

## Success Criteria

**This phase is complete when:**
1. LetterBuilderScene.js file exists and is properly registered
2. Scene loads without errors when navigated to
3. Background displays with unique warm color theme
4. Background has subtle grid lines suggesting construction theme
5. Target letter outline displays prominently (200-300px, stroke-only)
6. Header displays title "Letter Builder" and progress "1/5"
7. Instruction text displays "Build the letter X"
8. Pieces area is clearly designated at bottom
9. Back button displays at top-left (60x60px)
10. Back button has hover effect (scale to 1.1)
11. Back button has click effect (press animation)
12. Back button plays click sound
13. Back button returns to MainMenuScene smoothly
14. Entry animation plays (fade + scale, 800ms total)
15. Scene state initializes correctly (all variables)
16. Letter data loads from ContentProvider
17. Progress tracking works (updates on letter change)
18. No console errors or warnings
19. Tested in 2+ browsers
20. All acceptance criteria met
21. All edge cases handled
22. Ready to proceed to Phase 30 (draggable pieces)

## Notes

**Testing Philosophy**
- Test early and often
- Verify both visual and functional aspects
- Check console regularly for errors
- Test edge cases thoroughly
- Ensure smooth animations (60fps)
- Validate state management
- Confirm data integration (ContentProvider)

**Common Issues to Watch For**
- Letter outline not rendering (font stroke issues)
- Background gradient performance (too many draw calls)
- Animation timing conflicts (overlapping tweens)
- Scene transition errors (scene not registered)
- ContentProvider integration issues (missing data)
- Back button not clickable (z-index issues)
- Progress text not updating (state not updating)

**ADHD-Friendly Verification**
- All interactive elements are large (60x60px minimum)
- Hover feedback is immediate (<200ms)
- Click feedback is clear and satisfying
- Layout is simple and uncluttered
- Visual hierarchy is obvious
- Single task focus (one letter at a time)
- Progress is always visible (no confusion about "where am I")

This phase sets the foundation for Phases 30-32. A solid setup ensures smooth implementation of draggable pieces, snapping logic, and polish.
