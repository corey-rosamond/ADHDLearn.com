# Phase 33: Memory Match - Scene Setup - BDD Scenarios

## Feature: Memory Match Scene Setup

```gherkin
Feature: Memory Match Scene Initialization
  As a player
  I want to see a grid of face-down cards
  So that I can play a memory matching game

Background:
  Given the game is running
  And the MainMenu scene is active
  And MemoryMatchScene.js exists in src/scenes/
```

## Scenario: Create Memory Match Scene

```gherkin
Scenario: Initialize MemoryMatchScene
  When the MemoryMatchScene is created
  Then it should have key "MemoryMatchScene"
  And it should extend Phaser.Scene
  And it should have init() method
  And it should have preload() method
  And it should have create() method
  And it should initialize with empty cards array
  And it should initialize with empty cardData array
  And it should set matchCount to 0
  And it should set totalPairs to 6
  And it should set canFlip to true
```

## Scenario: Launch Memory Match Scene

```gherkin
Scenario: Navigate to Memory Match from MainMenu
  Given I am on the MainMenu scene
  When I select "Memory Match" game mode
  Then the scene should transition to MemoryMatchScene
  And the MemoryMatchScene init() should be called
  And the scene should load without errors
  And the browser console should show no errors
```

## Scenario: Create Background

```gherkin
Scenario: Display Memory Match background
  Given the MemoryMatchScene is active
  When the create() method runs
  Then the background color should be set to "#9b59b6" (purple)
  And a decorative border rectangle should be added
  And the border should be 760x560 pixels
  And the border should be centered at (400, 300)
  And the border should have a stroke color of "#8e44ad"
  And the border should have a stroke width of 6 pixels
  And the background should be visually distinct from other scenes
```

## Scenario: Create Header Text

```gherkin
Scenario: Display scene title and instructions
  Given the MemoryMatchScene is active
  When the createHeader() method is called
  Then a title text "Memory Match" should appear
  And the title should be positioned at (400, 40)
  And the title should be centered (origin 0.5)
  And the title should have fontSize "48px"
  And the title should be bold
  And the title should be white color
  And a subtitle "Find matching pairs!" should appear
  And the subtitle should be positioned at (400, 90)
  And the subtitle should have fontSize "24px"
  And the subtitle should be italic
  And the subtitle should have color "#ecf0f1"
```

## Scenario: Generate Card Back Texture

```gherkin
Scenario: Create card back graphic
  Given the MemoryMatchScene is active
  When createCardBackGraphic() is called
  Then a Phaser Graphics object should be created
  And it should draw a rounded rectangle at (0, 0)
  And the rectangle should be 100x140 pixels
  And the rectangle should have corner radius of 10 pixels
  And the rectangle should be filled with color 0x3498db (blue)
  And the rectangle should have a stroke of width 4
  And the stroke should have color 0x2980b9 (dark blue)
  And a decorative star should be drawn at (50, 70)
  And a texture named "card-back" should be generated
  And the texture should be 100x140 pixels
  And the graphics object should be destroyed after texture generation
```

## Scenario: Initialize Card Data

```gherkin
Scenario: Select and shuffle letters for cards
  Given the MemoryMatchScene is active
  When initializeCards() is called
  Then 6 random letters should be selected from A-Z
  And each letter should be used twice (creating pairs)
  And a total of 12 card data objects should be created
  And each card data should have a "letter" property
  And each card data should have a "type" property set to "letter"
  And each card data should have a unique "id" property
  And the cardData array should be shuffled randomly
  And the cardData array length should be 12
  And the console should log the selected letters

Examples:
  | Selected Letters    | Card Pairs                           |
  | A, B, C, D, E, F    | A, A, B, B, C, C, D, D, E, E, F, F  |
  | M, T, R, S, K, L    | M, M, T, T, R, R, S, S, K, K, L, L  |
```

## Scenario: Calculate Grid Layout

```gherkin
Scenario: Determine card positions in grid
  Given the grid configuration is 3 rows and 4 columns
  And the card width is 100 pixels
  And the card height is 140 pixels
  And the padding X is 20 pixels
  And the padding Y is 20 pixels
  When the grid layout is calculated
  Then the total width should be 460 pixels
    # (4 * 100) + (3 * 20) = 460
  And the total height should be 500 pixels
    # (3 * 140) + (2 * 20) = 500
  And the starting X position should be 220
    # (800 - 460) / 2 + 50 = 220
  And the starting Y position should be 150
  And the grid should be centered horizontally

Examples:
  | Row | Col | Expected X | Expected Y |
  | 0   | 0   | 220        | 150        |
  | 0   | 1   | 340        | 150        |
  | 0   | 2   | 460        | 150        |
  | 0   | 3   | 580        | 150        |
  | 1   | 0   | 220        | 310        |
  | 1   | 1   | 340        | 310        |
  | 2   | 3   | 580        | 470        |
```

## Scenario: Create Card Grid

```gherkin
Scenario: Generate 12 card sprites in grid formation
  Given the MemoryMatchScene is active
  And the card back texture is generated
  And the card data is initialized
  When createCardGrid() is called
  Then exactly 12 card sprites should be created
  And each card should use the "card-back" texture
  And cards should be positioned according to grid layout
  And card 0 should be at position (220, 150)
  And card 11 should be at position (580, 470)
  And all cards should be stored in the cards array
  And the cards array length should be 12
  And the console should log "Created 12 cards"
```

## Scenario: Create Individual Card

```gherkin
Scenario: Create a single card sprite with interaction
  Given a card position (x, y) is provided
  And a card index is provided
  When createCard(x, y, index) is called
  Then a sprite should be created at (x, y)
  And the sprite should use the "card-back" texture
  And the sprite should be interactive
  And the sprite should use hand cursor on hover
  And the sprite should store data "index" = index
  And the sprite should store data "flipped" = false
  And the sprite should store data "matched" = false
  And the sprite should have depth of 10
  And the sprite should have hover event handlers
  And the sprite should have click event handler
  And the sprite should be returned
```

## Scenario: Card Hover Effect

```gherkin
Scenario: Card scales on mouse hover
  Given a card sprite exists
  And the card is not flipped
  And the card is not matched
  When the mouse hovers over the card
  Then the card scale should increase to 1.05
  And the visual change should be immediate
  When the mouse moves away from the card
  Then the card scale should return to 1.0
```

## Scenario: Card Hover Effect - Flipped Card

```gherkin
Scenario: Flipped cards do not scale on hover
  Given a card sprite exists
  And the card data "flipped" is true
  When the mouse hovers over the card
  Then the card scale should remain 1.0
  And no hover effect should occur
```

## Scenario: Card Click Handler (Placeholder)

```gherkin
Scenario: Card click logs to console (Phase 33)
  Given a card sprite exists at index 5
  And the card data contains letter "T"
  And canFlip is true
  And the card is not flipped
  And the card is not matched
  When the card is clicked
  Then onCardClick(5) should be called
  And a console message should appear
  And the message should include "Card 5 clicked"
  And the message should include the letter "T"
  And the message should say "Flip animation coming in Phase 34"
  And no actual flip should occur (Phase 33 placeholder)
```

## Scenario: Ignore Click on Flipped Card

```gherkin
Scenario: Cannot click already flipped card
  Given a card sprite exists
  And the card data "flipped" is true
  When the card is clicked
  Then the onCardClick() should return early
  And no console log should appear
  And no action should be taken
```

## Scenario: Ignore Click on Matched Card

```gherkin
Scenario: Cannot click already matched card
  Given a card sprite exists
  And the card data "matched" is true
  When the card is clicked
  Then the onCardClick() should return early
  And no console log should appear
  And no action should be taken
```

## Scenario: Ignore Click When canFlip is False

```gherkin
Scenario: Cannot click cards when input is disabled
  Given a card sprite exists
  And the card is not flipped
  And the card is not matched
  But canFlip is set to false
  When the card is clicked
  Then the onCardClick() should return early
  And no console log should appear
  And no action should be taken
```

## Scenario: Create UI Elements

```gherkin
Scenario: Display matches counter and back button
  Given the MemoryMatchScene is active
  When createUIElements() is called
  Then a matches counter text should be created
  And the counter should display "Matches: 0/6"
  And the counter should be positioned at (60, 90)
  And the counter should be left-aligned (origin 0, 0.5)
  And the counter should have fontSize "24px"
  And the counter should be white and bold
  And a back button should be created
  And the back button should display "Back"
  And the back button should be positioned at (740, 90)
  And the back button should be right-aligned (origin 1, 0.5)
  And the back button should have red background (#e74c3c)
  And the back button should be interactive
  And both elements should have depth of 100
```

## Scenario: Back Button Hover Effect

```gherkin
Scenario: Back button scales on hover
  Given the back button exists
  When the mouse hovers over the back button
  Then the button scale should increase to 1.1
  When the mouse moves away
  Then the button scale should return to 1.0
```

## Scenario: Back Button Click

```gherkin
Scenario: Back button returns to MainMenu
  Given the MemoryMatchScene is active
  And the back button is visible
  When the back button is clicked
  Then a console message should say "Back button clicked"
  And the scene should transition to "MainMenu"
  And the MemoryMatchScene should be stopped
```

## Scenario: Update Matches Display

```gherkin
Scenario: Matches counter updates correctly
  Given the matches counter exists
  And matchCount is 0
  And totalPairs is 6
  When updateMatchesDisplay() is called
  Then the counter text should be "Matches: 0/6"

  Given matchCount is updated to 3
  When updateMatchesDisplay() is called
  Then the counter text should be "Matches: 3/6"

  Given matchCount is updated to 6
  When updateMatchesDisplay() is called
  Then the counter text should be "Matches: 6/6"
```

## Scenario: Scene Lifecycle

```gherkin
Scenario: Enter and exit scene multiple times
  Given I am on the MainMenu
  When I navigate to MemoryMatchScene
  Then the scene should initialize correctly
  And 12 cards should be displayed
  When I click the back button
  And I return to MemoryMatchScene
  Then the scene should initialize again
  And a new set of shuffled cards should appear
  And the match count should reset to 0
  And no memory leaks should occur
```

## Scenario: Visual Verification

```gherkin
Scenario: Verify complete scene appearance
  Given the MemoryMatchScene is active
  Then I should see:
    | Element              | Property           | Value                |
    | Background           | Color              | Purple (#9b59b6)     |
    | Title                | Text               | "Memory Match"       |
    | Title                | Position           | Top center           |
    | Subtitle             | Text               | "Find matching pairs!"|
    | Matches Counter      | Text               | "Matches: 0/6"       |
    | Matches Counter      | Position           | Top left             |
    | Back Button          | Text               | "Back"               |
    | Back Button          | Position           | Top right            |
    | Back Button          | Color              | Red (#e74c3c)        |
    | Cards                | Count              | 12                   |
    | Cards                | Arrangement        | 3 rows x 4 columns   |
    | Cards                | Appearance         | Blue backs, rounded  |
    | Cards                | Spacing            | Even, centered       |
  And all text should be readable
  And the layout should not be cluttered
  And the overall appearance should be calming
```

## Scenario: Performance Check

```gherkin
Scenario: Scene renders smoothly
  Given the MemoryMatchScene is active
  When the scene is fully loaded
  Then the frame rate should be 60 fps
  And there should be no lag or stuttering
  And hovering over cards should be responsive
  And clicking should register immediately
  And no memory leaks should occur
```

## Scenario: Error Handling

```gherkin
Scenario: Scene loads without errors
  Given the game is running
  When MemoryMatchScene is started
  Then no JavaScript errors should appear in console
  And no Phaser warnings should appear
  And no missing texture errors should occur
  And the card-back texture should be generated successfully
```

## Acceptance Criteria

### Scene Structure
- [ ] MemoryMatchScene.js exists in src/scenes/
- [ ] Scene extends Phaser.Scene
- [ ] Scene has key "MemoryMatchScene"
- [ ] init(), preload(), create() methods exist
- [ ] Scene is registered in game configuration

### Visual Elements
- [ ] Purple background (#9b59b6) displays
- [ ] Decorative border appears
- [ ] Title "Memory Match" centered at top
- [ ] Subtitle "Find matching pairs!" appears
- [ ] Matches counter shows "Matches: 0/6"
- [ ] Back button appears in top right

### Card Back Generation
- [ ] Card back texture is created programmatically
- [ ] Texture is 100x140 pixels
- [ ] Rounded corners (10px radius) visible
- [ ] Blue fill color (#3498db) applied
- [ ] Dark blue border (#2980b9, 4px) visible
- [ ] Decorative star icon appears
- [ ] Texture named "card-back" is available

### Card Data
- [ ] 6 random letters selected from A-Z
- [ ] Each letter appears twice (pairs)
- [ ] Total of 12 card data objects created
- [ ] Card data is shuffled randomly
- [ ] Each card has letter, type, and id properties
- [ ] Selected letters logged to console

### Grid Layout
- [ ] Grid configuration is 3 rows x 4 columns
- [ ] Card dimensions are 100x140 pixels
- [ ] Padding is 20px horizontal and vertical
- [ ] Grid is centered on screen
- [ ] Starting Y position is 150 (below header)
- [ ] All positions calculated correctly

### Card Sprites
- [ ] Exactly 12 card sprites created
- [ ] All cards use "card-back" texture
- [ ] Cards positioned according to grid layout
- [ ] All cards stored in cards array
- [ ] Cards have depth of 10
- [ ] Cards are interactive

### Card Interaction
- [ ] Cards have hand cursor on hover
- [ ] Hover scales card to 1.05
- [ ] Mouse out returns scale to 1.0
- [ ] Flipped cards do not scale on hover
- [ ] Matched cards do not scale on hover
- [ ] Click handler attached to each card
- [ ] Click logs to console (placeholder)

### Card Data Storage
- [ ] Cards store index data
- [ ] Cards store flipped status (false initially)
- [ ] Cards store matched status (false initially)
- [ ] Data can be retrieved via getData()

### Click Handling
- [ ] onCardClick(index) method exists
- [ ] Method checks canFlip flag
- [ ] Method checks if card is flipped
- [ ] Method checks if card is matched
- [ ] Valid clicks log to console
- [ ] Invalid clicks are ignored
- [ ] Console message includes card index
- [ ] Console message includes letter
- [ ] Console message mentions Phase 34

### UI Functionality
- [ ] Matches counter displays correctly
- [ ] Counter positioned at (60, 90)
- [ ] Counter is white, bold, 24px
- [ ] Back button displays "Back"
- [ ] Back button positioned at (740, 90)
- [ ] Back button has red background
- [ ] Back button scales on hover (1.1)
- [ ] Back button click returns to MainMenu
- [ ] Back button click logged to console

### Scene Lifecycle
- [ ] Scene can be entered from MainMenu
- [ ] Scene initializes correctly
- [ ] Scene can be exited via back button
- [ ] Scene can be re-entered
- [ ] New shuffled cards on each entry
- [ ] Match count resets on re-entry
- [ ] No memory leaks occur

### Visual Quality
- [ ] Background color is calming purple
- [ ] Colors are appropriate for ADHD audience
- [ ] Text is readable and properly sized
- [ ] Layout is organized and not cluttered
- [ ] Grid is evenly spaced
- [ ] Cards are clearly distinguishable
- [ ] Overall aesthetic is pleasant

### Performance
- [ ] Scene loads without errors
- [ ] 60 fps maintained
- [ ] Hover effects are responsive
- [ ] Click detection is immediate
- [ ] No lag with 12 sprites
- [ ] No console errors or warnings
- [ ] Scene cleanup works properly

## Edge Cases to Test

```gherkin
Scenario: Rapid Card Clicking
  Given multiple cards are displayed
  When I rapidly click multiple cards in sequence
  Then each click should be logged
  And no errors should occur
  And hover effects should still work

Scenario: Click During Scene Transition
  Given the MemoryMatchScene is active
  When I click a card
  And immediately click the back button
  Then the scene should transition smoothly
  And no errors should occur

Scenario: Very Fast Mouse Movement
  Given cards are displayed
  When I move the mouse rapidly across all cards
  Then hover effects should trigger correctly
  And no performance issues should occur
  And scales should reset properly

Scenario: Re-enter Scene Immediately
  Given I am in MemoryMatchScene
  When I exit to MainMenu
  And immediately return to MemoryMatchScene
  Then a new shuffled deck should appear
  And the scene should work correctly
  And no stale data from previous session
```

## Manual Testing Checklist

### Setup
1. [ ] Ensure MemoryMatchScene.js is in src/scenes/
2. [ ] Ensure scene is registered in game config
3. [ ] Start game and navigate to MainMenu

### Visual Testing
4. [ ] Enter MemoryMatchScene
5. [ ] Verify purple background
6. [ ] Verify title "Memory Match" at top
7. [ ] Verify subtitle appears
8. [ ] Count cards - should be exactly 12
9. [ ] Verify grid is 3x4 (or 4x3)
10. [ ] Verify cards are evenly spaced
11. [ ] Verify cards are centered
12. [ ] Verify all cards show blue back
13. [ ] Verify rounded corners visible
14. [ ] Verify star icon on card backs

### Interaction Testing
15. [ ] Hover over each card
16. [ ] Verify scale effect (1.05)
17. [ ] Verify cursor changes to pointer
18. [ ] Click each card
19. [ ] Verify console logs appear
20. [ ] Verify log shows correct index
21. [ ] Verify log shows correct letter
22. [ ] Verify log mentions Phase 34

### UI Testing
23. [ ] Verify matches counter shows "Matches: 0/6"
24. [ ] Verify counter is in top left
25. [ ] Verify back button shows "Back"
26. [ ] Verify button is in top right
27. [ ] Hover over back button
28. [ ] Verify scale effect
29. [ ] Click back button
30. [ ] Verify returns to MainMenu

### Lifecycle Testing
31. [ ] Re-enter MemoryMatchScene
32. [ ] Verify cards are reshuffled
33. [ ] Verify match count reset
34. [ ] Exit and enter 3 times
35. [ ] Verify no errors accumulate
36. [ ] Check browser memory (no leaks)

### Console Testing
37. [ ] Open browser console (F12)
38. [ ] Look for initialization messages
39. [ ] Look for "Selected letters" log
40. [ ] Look for "Created 12 cards" log
41. [ ] Verify no error messages
42. [ ] Verify no warnings
43. [ ] Click cards and verify logs

## Success Criteria

**This phase is complete when:**
1. MemoryMatchScene loads without errors
2. Purple background displays
3. Header text visible and centered
4. Exactly 12 cards in 3x4 grid
5. Grid is centered and evenly spaced
6. Card backs are blue with rounded corners
7. Hover effects work on all cards
8. Click logs to console (placeholder)
9. Matches counter displays correctly
10. Back button returns to MainMenu
11. Scene can be entered/exited repeatedly
12. No console errors or performance issues
13. All acceptance criteria met
14. Ready for Phase 34 (flip animations)

## Notes

**Phase 33 Scope**
- Focus: Visual setup and layout only
- No flip animations yet (Phase 34)
- No matching logic yet (Phase 35)
- Just proving cards can be positioned and clicked

**Testing Approach**
- Manual visual verification is primary
- Console logs prove interaction works
- Performance monitoring for 12 sprites
- Lifecycle testing for memory leaks

**ADHD Considerations**
- Calm purple color aids focus
- Clear, organized grid layout
- Immediate hover feedback
- Simple, uncluttered design
- Easy to understand at a glance
