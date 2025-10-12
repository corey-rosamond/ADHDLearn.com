# Phase 37: Dance & Trace - Scene Setup - BDD Scenarios

## Feature: Dance & Trace Scene Initialization

```gherkin
Feature: Dance & Trace Scene Setup
  As Aurora (a player with ADHD)
  I want a calming, clear tracing environment
  So that I can focus on learning letter shapes without distraction

Background:
  Given the main menu is loaded
  And the audio system is functional
  And the player has selected "Dance & Trace"
```

## Scenario: Launch Dance & Trace Scene

```gherkin
Scenario: Player launches Dance & Trace from main menu
  Given I am on the main menu
  When I click the "Dance & Trace" button
  Then the DanceTraceScene should load
  And the scene background should display a gradient
  And the gradient should transition from purple at top to pink at bottom
  And the scene should contain twinkling stars
  And the scene title "Dance & Trace" should display at the top
  And no loading errors should appear in console
```

## Scenario: Create Gradient Background

```gherkin
Scenario: Render calming gradient background
  Given the DanceTraceScene is loading
  When the create() method executes
  Then a gradient should fill the entire canvas (800x600)
  And the top color should be light purple-blue (#8B9FD8)
  And the bottom color should be warm pink (#FFB6C1)
  And the gradient should be smooth with no banding
  And the gradient should not animate or flash
```

## Scenario: Animate Background Stars

```gherkin
Scenario: Create subtle twinkling stars
  Given the background gradient is rendered
  When the star creation loop executes
  Then exactly 20 stars should be created
  And each star should be a small circle (2-4 pixels radius)
  And stars should be randomly positioned across the canvas
  And stars should be white (#FFFFFF)
  And each star should have a twinkling animation
  And twinkling should vary between alpha 0.3 and 0.9
  And each star should have a different animation delay (0-2000ms)
  And the animation should loop infinitely
  And the effect should be subtle and not distracting
```

## Scenario: Display Title and UI Elements

```gherkin
Scenario: Create UI components
  Given the background is rendered
  When the createUI() method executes
  Then the title "Dance & Trace" should display at position (400, 30)
  And the title should be 36px font size
  And the title should be white with a dark stroke
  And the title should be centered horizontally
  And the progress indicator should display "Letter 1 of 5"
  And the progress text should be at position (400, 70)
  And the current letter name should display as "Letter A"
  And the letter name should be 48px font size
  And the letter name should be at position (400, 120)
  And an exit button should appear in the top-left corner
  And the exit button should display "Exit" text
```

## Scenario: Create Exit Button

```gherkin
Scenario: Exit button functionality
  Given the UI is created
  And the exit button is visible at (50, 30)
  When I click the exit button
  Then the scene should stop
  And the MainMenuScene should start
  And no data should be lost
  And no errors should appear in console
```

## Scenario: Load Letter Stroke Data

```gherkin
Scenario: Load letter path definitions
  Given the scene is in preload() phase
  When the scene loads assets
  Then the letterStrokes.json file should load
  And the JSON should contain definitions for all 26 letters
  And each letter should have the following structure:
    | Property    | Type   | Required |
    | strokes     | Array  | Yes      |
    | startPoint  | Object | Yes      |
    | scale       | Number | No       |
  And each stroke should contain:
    | Property  | Type   | Required |
    | points    | Array  | Yes      |
    | direction | String | Yes      |
  And each point should have x and y coordinates
  And the data should parse without errors
```

## Scenario: Initialize Letter Queue

```gherkin
Scenario: Set up 5-letter round
  Given the scene receives init data
  When init() method executes with data.letters = ['A', 'B', 'C', 'D', 'E']
  Then the letterQueue should be ['A', 'B', 'C', 'D', 'E']
  And letterIndex should be 0
  And lettersPerRound should be 5
  And currentLetter should be 'A'

Scenario: Generate random letters if none provided
  Given the scene receives init data with no letters
  When init() method executes with empty data
  Then the letterQueue should contain 5 random letters
  And all letters should be uppercase A-Z
  And letterIndex should be 0
  And lettersPerRound should be 5
```

## Scenario: Render Dotted Letter Path

```gherkin
Scenario: Draw letter A dotted path
  Given the letter data for 'A' is loaded
  And the letter has 3 strokes
  When drawLetterPath() executes
  Then the path should render using Phaser.Graphics
  And each stroke should be rendered as a dotted line
  And dots should be evenly spaced (18 pixels apart)
  And each dot should be 6 pixels in radius
  And dots should be light gray (#CCCCCC)
  And dots should have alpha 0.7
  And the path should be centered on the canvas
  And the path should be clearly visible
  And the path should match the letter A shape

Scenario: Calculate dotted path for stroke
  Given a stroke with points [{x: 0, y: 100}, {x: 50, y: 0}]
  And dot spacing is 18 pixels
  When the path renderer calculates dots
  Then the distance should be sqrt(50² + 100²) = 111.8 pixels
  And the number of dots should be floor(111.8 / 18) = 6 dots
  And dots should be interpolated along the line:
    | Dot | t    | X    | Y    |
    | 0   | 0.0  | 0    | 100  |
    | 1   | 0.17 | 8.5  | 83   |
    | 2   | 0.33 | 16.5 | 67   |
    | 3   | 0.5  | 25   | 50   |
    | 4   | 0.67 | 33.5 | 33   |
    | 5   | 0.83 | 41.5 | 17   |
    | 6   | 1.0  | 50   | 0    |
  And each dot should be drawn at the calculated position
```

## Scenario: Create Starting Point Indicator

```gherkin
Scenario: Display pulsing start circle
  Given the letter path is rendered
  And the letter data has startPoint {x: -50, y: 130}
  When createStartIndicator() executes
  Then a green circle should appear at the start point
  And the circle radius should be 35 pixels
  And the circle color should be bright green (#44FF44)
  And the circle alpha should be 0.8
  And a white stroke should outline the circle (4px width)
  And the circle should be positioned at the first point of the first stroke
  And the position should be adjusted for canvas centering

Scenario: Animate pulsing indicator
  Given the start indicator is created
  When the pulse animation starts
  Then the circle should scale from 1.0 to 1.3 and back
  And the circle alpha should fade from 0.8 to 0.5 and back
  And the animation duration should be 1000ms
  And the animation should yoyo (reverse)
  And the animation should repeat infinitely (-1)
  And the animation should be smooth (no jerking)
```

## Scenario: Play Intro Audio

```gherkin
Scenario: Play letter introduction audio
  Given the scene is fully created
  And audio files are loaded
  When playIntroAudio() executes
  Then the intro audio "trace-intro" should play
  And the audio should say "Let's trace the letter A!"
  And after 1500ms delay
  Then the letter name audio should play
  And the audio should say the letter name (e.g., "A")
  And the volume should respect settings
  And the audio should not overlap awkwardly
```

## Scenario: Center Letter on Canvas

```gherkin
Scenario: Calculate letter centering
  Given the canvas is 800x600 pixels
  And the letter path uses relative coordinates
  When the path is rendered
  Then the base X position should be 400 (center)
  And the base Y position should be 320 (slightly below center)
  And all letter coordinates should offset from this base
  And the letter should appear centered visually
  And large letters (W, M) should not extend off canvas
  And small letters (I, l) should remain centered

Scenario: Handle different letter sizes
  Given different letters have different widths
  When rendering letter 'W' (wide)
  Then the letter should scale to fit canvas
  And the letter should remain centered
  When rendering letter 'I' (narrow)
  Then the letter should not appear tiny
  And the letter should remain centered
```

## Scenario: Update Progress Indicator

```gherkin
Scenario: Display current letter progress
  Given 5 letters are in the queue
  And the current letterIndex is 0
  When the UI is created
  Then the progress text should read "Letter 1 of 5"

Scenario: Progress updates for second letter
  Given the first letter is complete (Phase 39)
  And letterIndex is now 1
  When the scene is recreated for next letter
  Then the progress text should read "Letter 2 of 5"
```

## Scenario: Handle Multiple Letter Strokes

```gherkin
Scenario: Render letter with multiple strokes
  Given letter 'A' has 3 strokes
  When drawLetterPath() executes
  Then all 3 strokes should render as dotted paths
  And each stroke should be independently drawn
  And strokes should not connect incorrectly
  And all strokes should be visible simultaneously

Scenario: Render letter with single stroke
  Given letter 'O' has 1 circular stroke
  When drawLetterPath() executes
  Then the single stroke should render as a dotted circle
  And the path should form a closed loop
  And the starting point should be clearly marked
```

## Scenario: Setup Input System (Preparation for Phase 38)

```gherkin
Scenario: Initialize input listeners
  Given the scene is fully created
  When setupInput() executes
  Then pointer down events should be captured
  And pointer move events should be captured
  And touch events should be captured (mobile)
  And mouse events should be captured (desktop)
  And the starting indicator should be interactive
  And no actual tracing detection occurs yet (Phase 38)
```

## Scenario: Scene Lifecycle

```gherkin
Scenario: Complete scene initialization sequence
  Given the player launches Dance & Trace
  When the scene lifecycle executes
  Then the following should occur in order:
    | Step | Method       | Duration | Description                    |
    | 1    | init()       | < 10ms   | Initialize variables           |
    | 2    | preload()    | 200ms    | Load JSON and audio            |
    | 3    | create()     | 500ms    | Build entire scene             |
    | 4    | background   | 100ms    | Render gradient and stars      |
    | 5    | UI           | 200ms    | Create text and buttons        |
    | 6    | path         | 500ms    | Render dotted letter path      |
    | 7    | indicator    | 100ms    | Create pulsing circle          |
    | 8    | audio        | 1500ms   | Play intro and letter name     |
    | 9    | ready        | -        | Scene ready for tracing        |
  And the total time should be under 2 seconds
  And no errors should occur
```

## Scenario: Verify Letter Stroke Data Structure

```gherkin
Scenario: Validate letter A data structure
  Given the letterStrokes.json file is loaded
  When I inspect the data for letter 'A'
  Then the structure should be:
    ```json
    {
      "strokes": [
        {
          "points": [
            {"x": -50, "y": 130},
            {"x": 0, "y": -70}
          ],
          "direction": "up-right"
        },
        {
          "points": [
            {"x": 0, "y": -70},
            {"x": 50, "y": 130}
          ],
          "direction": "down-right"
        },
        {
          "points": [
            {"x": -25, "y": 30},
            {"x": 25, "y": 30}
          ],
          "direction": "right"
        }
      ],
      "startPoint": {"x": -50, "y": 130}
    }
    ```
  And all properties should be present
  And all coordinates should be numbers
  And the startPoint should match the first point of first stroke
```

## Scenario: Test with Different Letters

```gherkin
Scenario Outline: Render different letters
  Given the scene is initialized with letter <letter>
  When the scene creates
  Then the letter name should display "Letter <letter>"
  And the letter path should match the <letter> shape
  And the starting indicator should be at the correct position
  And the audio should say "Let's trace the letter <letter>!"
  And no rendering errors should occur

  Examples:
    | letter | strokes | complexity |
    | A      | 3       | Medium     |
    | B      | 3       | High       |
    | C      | 1       | Low        |
    | I      | 1       | Very Low   |
    | M      | 4       | Very High  |
    | O      | 1       | Low        |
    | W      | 4       | Very High  |
    | Z      | 1       | Low        |
```

## Acceptance Criteria

### Must Have
- [ ] DanceTraceScene loads without errors
- [ ] Background gradient displays (purple to pink)
- [ ] 20 twinkling stars animate subtly
- [ ] Title "Dance & Trace" displays at top
- [ ] Progress shows "Letter X of 5"
- [ ] Current letter name displays prominently
- [ ] Exit button returns to main menu
- [ ] Letter stroke data loads for all 26 letters
- [ ] Dotted path renders correctly
- [ ] Dots are evenly spaced and visible
- [ ] Starting indicator pulses at correct position
- [ ] Intro audio plays
- [ ] Letter name audio plays
- [ ] Letter is centered on canvas
- [ ] Letter is large and clear (250-350px tall)

### Visual Quality
- [ ] Background gradient is smooth
- [ ] Stars twinkle gently (not distracting)
- [ ] Path dots are clearly visible
- [ ] Starting indicator is obvious (green, pulsing)
- [ ] UI text is readable (white with stroke)
- [ ] Letter path matches correct letter shape
- [ ] No visual glitches or overlaps
- [ ] Colors are calming and ADHD-friendly

### Technical Quality
- [ ] Scene transitions smoothly from menu
- [ ] No console errors during initialization
- [ ] JSON data parses correctly
- [ ] Audio files load without errors
- [ ] Graphics render efficiently
- [ ] Animations run smoothly (60 FPS)
- [ ] Memory usage is reasonable
- [ ] Input system is prepared (no crashes)

### Accessibility
- [ ] High contrast between path and background
- [ ] Starting indicator is immediately obvious
- [ ] Audio instructions are clear
- [ ] Exit button is always visible
- [ ] Touch targets are large enough (40+ pixels)
- [ ] Works on both mouse and touch devices
- [ ] No flashing or rapid animations
- [ ] Calming color scheme (not overstimulating)

## Edge Cases to Test

```gherkin
Scenario: Handle missing letter data
  Given letterStrokes.json is loaded
  And letter 'A' data is missing
  When the scene tries to load letter 'A'
  Then an error should log to console
  And a fallback letter should display
  Or a clear error message should show
  And the game should not crash

Scenario: Handle malformed stroke data
  Given letter 'A' data has invalid points
  When the path renderer tries to draw
  Then invalid points should be skipped
  And a warning should log to console
  And the scene should render what it can
  And the game should not crash

Scenario: Handle audio loading failure
  Given the intro audio file is missing
  When playIntroAudio() executes
  Then the scene should continue without audio
  And a warning should log to console
  And visual indicators should still work
  And the game should remain playable

Scenario: Handle empty letter queue
  Given init() receives empty letter data
  When the scene initializes
  Then a default letter queue should be generated
  And the queue should contain 5 random letters
  And the scene should load normally

Scenario: Handle very complex letters
  Given letter 'M' has 4 strokes with many points
  When the path is rendered
  Then all dots should render efficiently
  And the frame rate should remain above 30 FPS
  And the path should be complete
  And no dots should be missing

Scenario: Handle rapid scene exit
  Given the scene is still loading
  When the user clicks exit button immediately
  Then the scene should stop cleanly
  And loading should be cancelled
  And no orphaned resources should remain
  And the main menu should load normally
```

## Manual Testing Checklist

### Setup
1. [ ] Open game in browser
2. [ ] Navigate to main menu
3. [ ] Open browser console (F12)
4. [ ] Verify no existing errors

### Basic Functionality
5. [ ] Click "Dance & Trace" button
6. [ ] Verify scene loads within 2 seconds
7. [ ] Check background gradient (purple to pink)
8. [ ] Count stars (should be ~20)
9. [ ] Watch stars twinkle (should be subtle)
10. [ ] Read title "Dance & Trace"
11. [ ] Check progress "Letter 1 of 5"
12. [ ] Check letter name "Letter A"
13. [ ] Verify exit button visible

### Letter Path
14. [ ] Locate letter A dotted path
15. [ ] Verify path matches letter A shape
16. [ ] Count dots (should be many, evenly spaced)
17. [ ] Check dot visibility (light gray, clear)
18. [ ] Verify letter is centered
19. [ ] Measure letter height (should be 250-350px)

### Starting Indicator
20. [ ] Locate green pulsing circle
21. [ ] Verify it's at the start of left diagonal
22. [ ] Watch animation (should pulse smoothly)
23. [ ] Check size (should be ~35px diameter)
24. [ ] Verify high contrast against background

### Audio
25. [ ] Listen for intro audio "Let's trace..."
26. [ ] Wait for letter name "A"
27. [ ] Verify audio is clear
28. [ ] Check volume (not too loud)
29. [ ] Verify no audio overlap

### Interactions
30. [ ] Click exit button
31. [ ] Verify return to main menu
32. [ ] Launch Dance & Trace again
33. [ ] Verify scene rebuilds correctly

### Multiple Letters
34. [ ] Manually modify code to load letter 'B'
35. [ ] Verify letter B path renders correctly
36. [ ] Check starting indicator position
37. [ ] Test letters: C, M, W, Z
38. [ ] Verify all letters center correctly

### Console
39. [ ] Check console for errors (should be none)
40. [ ] Check console for warnings (note any)
41. [ ] Verify JSON loaded successfully
42. [ ] Verify audio loaded successfully

### Performance
43. [ ] Check FPS (should be 60)
44. [ ] Watch animations (should be smooth)
45. [ ] Monitor memory usage (should be stable)
46. [ ] Test on slower device if possible

### Mobile (If Available)
47. [ ] Test on tablet or phone
48. [ ] Verify touch targets are large enough
49. [ ] Check text readability on small screen
50. [ ] Verify animations remain smooth

## Success Criteria

**This phase is complete when:**
1. DanceTraceScene loads and displays correctly
2. Background gradient and stars render beautifully
3. All UI elements are clear and functional
4. Letter path renders as dotted line matching letter shape
5. Starting indicator pulses at correct position
6. Audio plays intro and letter name
7. Letter data structure exists for all 26 letters
8. Scene transitions smoothly to/from main menu
9. Zero console errors during normal operation
10. Tested on both desktop and mobile (if available)
11. All acceptance criteria met
12. Code is clean, documented, and ready for Phase 38

## Notes

**ADHD-Friendly Design Principles**
- Calming background colors (not bright or flashing)
- Clear, obvious starting point (pulsing green circle)
- Minimal distractions (subtle stars only)
- High contrast (white text, gray path on gradient)
- Clear exit option (always visible)
- Positive language ("Letter 1 of 5" not "4 remaining")
- Audio guidance (verbal instructions)
- Large touch targets (35+ pixel indicator)

**What We're Testing**
- Scene initialization and lifecycle
- Background rendering (gradient, stars)
- UI element display (title, progress, exit)
- Letter path rendering (dotted lines)
- Starting indicator animation (pulsing)
- Audio playback (intro, letter name)
- Data structure (letter strokes JSON)
- Scene transitions (menu to game)

**What We're NOT Testing**
- Tracing detection (Phase 38)
- Path following (Phase 38)
- Trail effects (Phase 38)
- Completion detection (Phase 39)
- Celebrations (Phase 39)
- Letter progression (Phase 39)
- Polish and haptics (Phase 40)

This phase builds the foundation. Phase 38 adds the interactive tracing magic.
