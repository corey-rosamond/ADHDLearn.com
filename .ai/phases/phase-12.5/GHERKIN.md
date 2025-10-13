# Phase 12.5: Responsive Design, Visual Overhaul & PWA - BDD Scenarios

## Feature: Responsive Canvas Scaling

```gherkin
Feature: Game scales to Samsung Galaxy Tab S7 FE
  As Aurora
  I want the game to fill my tablet screen perfectly
  So that I can see everything clearly and play comfortably

Background:
  Given the game is configured with base resolution 1920x1200
  And the scale mode is set to FIT
  And the Tab S7 FE screen is 2560x1600 pixels
```

## Scenario: Canvas Scales to Tab S7 FE

```gherkin
Scenario: Game renders at correct size on tablet
  When I open the game on Samsung Galaxy Tab S7 FE
  Then the canvas should scale to fit the screen
  And the aspect ratio should be maintained (16:10)
  And the game should be centered horizontally
  And the game should be centered vertically
  And there should be no distortion or stretching
  And all elements should be proportionally scaled
```

## Scenario: Touch Targets Are Large Enough

```gherkin
Scenario: Buttons and bubbles are easy to tap
  Given I am playing on a touchscreen tablet
  When I try to tap interactive elements
  Then bubbles should be at least 140px diameter (scaled)
  And the START button should be at least 400x150px (scaled)
  And the back button should be at least 150x80px (scaled)
  And all buttons should respond to first tap
  And there should be no missed taps due to small targets
```

## Feature: Non-Overlapping UI Layout

```gherkin
Feature: UI elements don't overlap
  As Aurora
  I want to see all UI elements clearly
  So that nothing is hidden or confusing

Background:
  Given the game is running in LetterPopScene
  And all UI elements are created
```

## Scenario: Score and Back Button Don't Overlap

```gherkin
Scenario: Score and back button have separate positions
  Given the score display is at position (60, 40)
  And the back button is at position (60, 120)
  When both elements are rendered
  Then the score should be fully visible
  And the back button should be fully visible
  And there should be no visual overlap
  And there should be at least 40px vertical spacing between them
```

## Scenario: All HUD Elements Are Visible

```gherkin
Scenario: Top row UI elements don't overlap
  Given the score is at left (60, 40)
  And the progress indicator is at center (960, 40)
  And the time display is at right (1860, 40)
  When all three elements are rendered
  Then all three should be fully visible
  And no element should overlap another
  And all text should be readable
  And each element should be aligned correctly
```

## Scenario: Bubbles Stay in Play Area

```gherkin
Scenario: Bubbles don't spawn under UI elements
  Given the play area is defined as X: 300-1620, Y: 500-900
  And UI elements occupy Y: 0-300 (top) and Y: 1060-1200 (bottom)
  When bubbles are spawned
  Then all bubbles should be within the play area bounds
  And no bubble should be obscured by score display
  And no bubble should be obscured by back button
  And no bubble should be obscured by title
  And no bubble should touch screen edges (60px margin)
```

## Feature: Bright Colorful Visual Design

```gherkin
Feature: Game uses Aurora's Rainbow color palette
  As Aurora
  I want the game to be colorful and fun
  So that I enjoy playing and stay engaged

Background:
  Given the color palette is defined
  And the palette includes 6 bright colors
```

## Scenario: Backgrounds Use Vibrant Gradients

```gherkin
Scenario: MainMenuScene has colorful gradient
  Given I am in the MainMenuScene
  When the scene creates the background
  Then it should use a multi-color gradient
  And the gradient should include Sky Blue (#00BCD4)
  And the gradient should include Purple Magic (#9C27B0)
  And the gradient should include Bubble Pink (#FF4081)
  And the colors should transition smoothly
  And the gradient should fill the entire canvas
```

## Scenario: Bubbles Use Random Bright Colors

```gherkin
Scenario: Each bubble gets a random color
  Given I am in the LetterPopScene
  When 3 bubbles are created
  Then each bubble should have a color from the palette
  And colors should be randomly selected
  And colors can repeat (RNG allows duplicates)
  And all 6 colors should be possible:
    | Color |
    | Sky Blue (#00BCD4) |
    | Sunshine Yellow (#FFEB3B) |
    | Bubble Pink (#FF4081) |
    | Grass Green (#00E676) |
    | Orange Pop (#FF6B6B) |
    | Purple Magic (#9C27B0) |
```

## Scenario: Bubbles Have Cartoony Glossy Look

```gherkin
Scenario: Bubbles are visually appealing
  Given a bubble is created
  When the bubble graphics are rendered
  Then it should have a shadow for depth
  And it should have a main colored circle
  And it should have a white glossy highlight
  And it should have a white border (4px)
  And the highlight should be positioned top-left
  And the overall look should be cartoony and fun
```

## Feature: Fredoka One Font Integration

```gherkin
Feature: Game uses kid-friendly font
  As Aurora
  I want text to be fun and easy to read
  So that I can understand the game better

Background:
  Given Fredoka One font is loaded from Google Fonts
  And all scenes use the font
```

## Scenario: Font Loads Successfully

```gherkin
Scenario: Fredoka One is available for all text
  Given the PreloadScene is loading
  When the font CSS is added to document head
  And document.fonts.ready promise resolves
  Then Fredoka One should be loaded
  And all text objects should use Fredoka One
  And the fallback should be Comic Sans MS, cursive
  And text should display correctly
```

## Scenario: Font Sizes Are Scaled Responsively

```gherkin
Scenario: Text scales with screen resolution
  Given the base font size is 48px at 1920x1200
  When the game scales to 2560x1600
  Then the font size should scale proportionally
  And all text should remain readable
  And no text should be too small
  And no text should overflow containers
```

## Feature: Decorative Elements

```gherkin
Feature: Clouds and visual enhancements
  As Aurora
  I want fun decorations in the background
  So that the game feels magical and engaging

Background:
  Given the MainMenuScene is loaded
```

## Scenario: Clouds Are Added to Background

```gherkin
Scenario: Floating clouds create atmosphere
  Given the background gradient is created
  When decorative clouds are added
  Then at least 3 clouds should be visible
  And clouds should be white with alpha transparency
  And each cloud should be made of 3 overlapping circles
  And clouds should have gentle floating animation
  And clouds should move up and down slowly (3 second duration)
  And animation should repeat infinitely
```

## Scenario: Clouds Don't Obscure Gameplay

```gherkin
Scenario: Decorations stay in background
  Given clouds are animated in the background
  When bubbles and UI elements are rendered
  Then clouds should have z-index of 0 (background)
  And game elements should have z-index 100+
  And clouds should never cover bubbles
  And clouds should never cover buttons
  And clouds should never cover text
```

## Feature: Button Styling Consistency

```gherkin
Feature: All buttons have consistent style
  As Aurora
  I want buttons to look the same everywhere
  So that I know what to click

Background:
  Given buttons are created in multiple scenes
```

## Scenario: START Button Has Cartoony Style

```gherkin
Scenario: Main menu START button is appealing
  Given I am in the MainMenuScene
  When the START button is created
  Then it should have a bright color (Orange Pop #FF6B6B)
  And it should have rounded corners (20px radius)
  And it should have a white border (6px thickness)
  And the text should use Fredoka One font
  And the text should be white (#FFFFFF)
  And the text should have a black stroke (6px)
  And the button size should be 500x200px (at base resolution)
```

## Scenario: All Buttons Have Hover Animation

```gherkin
Scenario: Buttons respond to hover
  Given any button is rendered
  When I hover my cursor over the button
  Then it should scale up to 1.1x size
  And the animation duration should be 200ms
  And the easing should be smooth (Back.easeOut)
  When I move cursor away
  Then it should scale back to 1.0x
  And the animation should take 200ms
  And the easing should be Power2
```

## Scenario: All Buttons Have Click Animation

```gherkin
Scenario: Buttons provide tactile feedback
  Given any button is rendered
  When I click the button
  Then it should scale down to 0.95x
  And it should yoyo back to original size
  And the animation should take 100ms total
  And a sound should play (if available)
  And the callback function should execute after animation
```

## Feature: Progressive Web App Installation

```gherkin
Feature: Game can be installed as PWA
  As Aurora's parent
  I want to install the game to the home screen
  So that Aurora can launch it like a native app

Background:
  Given the game is hosted on GitHub Pages
  And manifest.json exists
  And service-worker.js exists
```

## Scenario: PWA Manifest Is Valid

```gherkin
Scenario: Manifest provides correct app metadata
  Given manifest.json is in the root directory
  When the browser reads the manifest
  Then the app name should be "Aurora's Letter Adventure"
  And the short name should be "Letter Pop"
  And the display mode should be "fullscreen"
  And the orientation should be "landscape"
  And the background color should be "#00BCD4"
  And the theme color should be "#00BCD4"
  And there should be a 192x192 icon
  And there should be a 512x512 icon
```

## Scenario: Service Worker Registers

```gherkin
Scenario: Service worker caches game files
  Given the game loads for the first time
  When the service worker registers
  Then it should cache index.html
  And it should cache all scene files
  And it should cache config.js
  And it should cache ResponsiveUtils.js
  And the service worker should activate
  And console should log successful registration
```

## Scenario: Game Works Offline

```gherkin
Scenario: Cached game loads without internet
  Given the game has been loaded once
  And all files are cached by service worker
  When I disable internet connection
  And I launch the game from home screen
  Then the game should load successfully
  And all scenes should work correctly
  And audio files should load (if previously cached)
  And no network errors should occur
```

## Scenario: Install Prompt Appears

```gherkin
Scenario: Browser offers to install PWA
  Given I open the game URL in Chrome/Samsung Internet
  And the manifest is valid
  And the service worker is registered
  When the PWA criteria are met
  Then the browser should show "Add to Home Screen" option
  And I should be able to install the app
  And an icon should be added to the home screen
```

## Scenario: Installed App Launches Fullscreen

```gherkin
Scenario: PWA opens without browser UI
  Given the game is installed on home screen
  When I tap the app icon
  Then the game should launch in fullscreen mode
  And no browser address bar should be visible
  And no browser menu should be visible
  And the status bar should match theme color (#00BCD4)
  And the app should feel like a native app
```

## Scenario: Auto-Update After Code Changes

```gherkin
Scenario: Service worker detects and applies updates
  Given the game is installed and cached
  And I push new code to GitHub
  And GitHub Pages deploys the update
  When Aurora launches the app
  Then the service worker should check for updates
  And it should download new files
  And it should update the cache
  When Aurora closes and reopens the app
  Then the new version should load
  And changes should be visible
```

## Feature: GitHub Pages Deployment

```gherkin
Feature: Game is hosted on GitHub Pages
  As a developer
  I want automatic deployment
  So that updates go live instantly

Background:
  Given the repository is configured for GitHub Pages
```

## Scenario: GitHub Pages Deploys Automatically

```gherkin
Scenario: Push to main triggers deployment
  Given I have made changes to the game
  When I run git push
  Then GitHub should receive the commit
  And GitHub Pages should rebuild the site
  And the deployment should complete within 1 minute
  And the game should be accessible at the GitHub Pages URL
  And all assets should load correctly via HTTPS
```

## Scenario: .nojekyll Prevents Processing

```gherkin
Scenario: .nojekyll file preserves file structure
  Given .nojekyll file is in root directory
  When GitHub Pages deploys
  Then it should not process files with Jekyll
  And all file paths should work correctly
  And underscored files should not be ignored
  And the /src directory should be accessible
```

## Feature: ResponsiveUtils Implementation

```gherkin
Feature: Responsive positioning utility
  As a developer
  I want a utility class for responsive layout
  So that all elements scale correctly

Background:
  Given ResponsiveUtils is available
  And a scene is initialized
```

## Scenario: ResponsiveUtils Calculates Positions

```gherkin
Scenario: Percentage-based positioning works
  Given the screen is 1920x1200
  And ResponsiveUtils is instantiated
  When I call getX(50)
  Then it should return 960 (center X)
  When I call getY(50)
  Then it should return 600 (center Y)
  When I call getX(10)
  Then it should return 192 (10% from left)
```

## Scenario: ResponsiveUtils Scales Values

```gherkin
Scenario: Values scale proportionally
  Given the base screen is 1920x1200
  And ResponsiveUtils is instantiated
  When I call scaleX(100) at base resolution
  Then it should return 100
  When the screen is 2560x1600
  And I call scaleX(100)
  Then it should return 133 (100 * 2560/1920)
```

## Scenario: ResponsiveUtils Scales Fonts

```gherkin
Scenario: Font sizes scale with screen height
  Given the base font size is 48px
  And the screen height is 1200px
  When I call getFontSize(48)
  Then it should return 48
  When the screen height is 1600px
  And I call getFontSize(48)
  Then it should return 64 (48 * 1600/1200)
```

## Acceptance Criteria Summary

### Responsive Design ✅
- [ ] Canvas scales to 2560x1600 (Tab S7 FE)
- [ ] Aspect ratio maintained (16:10)
- [ ] Game centers automatically
- [ ] No stretching or distortion
- [ ] Touch targets large enough (min 140px bubbles)
- [ ] ResponsiveUtils class implemented
- [ ] All hardcoded positions removed
- [ ] All scenes use responsive positioning

### Non-Overlapping Layout ✅
- [ ] Score at (60, 40)
- [ ] Back button at (60, 120) - BELOW score
- [ ] Progress at center (960, 40)
- [ ] Time at right (1860, 40)
- [ ] Minimum 40px spacing between elements
- [ ] Bubbles spawn only in play area (350-1050 Y)
- [ ] 60px margins from all screen edges
- [ ] No overlapping in any scene

### Bright Color Palette ✅
- [ ] Sky Blue (#00BCD4) implemented
- [ ] Sunshine Yellow (#FFEB3B) implemented
- [ ] Bubble Pink (#FF4081) implemented
- [ ] Grass Green (#00E676) implemented
- [ ] Orange Pop (#FF6B6B) implemented
- [ ] Purple Magic (#9C27B0) implemented
- [ ] Gradients use multiple colors
- [ ] Bubbles use random bright colors
- [ ] High contrast maintained

### Fredoka One Font ✅
- [ ] Font loaded from Google Fonts
- [ ] Applied to all text
- [ ] Fallback chain configured
- [ ] Scales responsively
- [ ] Readable at all sizes

### Decorative Elements ✅
- [ ] Clouds added to backgrounds
- [ ] Clouds animate (floating)
- [ ] Clouds stay in background (z-index 0)
- [ ] Don't obscure gameplay

### Button Styling ✅
- [ ] Rounded corners (20px)
- [ ] White borders (6px)
- [ ] Bright fill colors
- [ ] Hover animations (scale 1.1x)
- [ ] Click animations (scale 0.95x)
- [ ] Consistent across all scenes

### PWA Functionality ✅
- [ ] manifest.json valid
- [ ] service-worker.js caches files
- [ ] Installable on Android
- [ ] Works offline
- [ ] Fullscreen mode active
- [ ] Icons display correctly
- [ ] Landscape orientation enforced
- [ ] Auto-updates work

### GitHub Pages ✅
- [ ] Repository configured
- [ ] .nojekyll file present
- [ ] Auto-deploy on push
- [ ] HTTPS enabled
- [ ] All assets load correctly

### Tab S7 FE Testing ✅
- [ ] Installs successfully
- [ ] Fullscreen works
- [ ] Touch responsive
- [ ] Text readable
- [ ] Colors vibrant
- [ ] 60fps performance
- [ ] Audio works
- [ ] Complete game loop functions

## Edge Cases to Test

```gherkin
Scenario: Small Screen Still Playable
  Given the screen is 800x500 (minimum)
  When the game scales down
  Then all elements should still be visible
  And touch targets should still be large enough
  And text should still be readable

Scenario: Very Large Screen (Desktop Monitor)
  Given the screen is 3840x2160 (4K)
  When the game scales up
  Then it should scale to max size (2560x1600)
  And it should center with letterboxing
  And quality should remain high

Scenario: Portrait Orientation (If Rotated)
  Given the tablet is rotated to portrait
  When the orientation changes
  Then the game should prefer landscape
  And it should display a "rotate device" message
  Or it should adapt layout for portrait

Scenario: Slow Network Connection
  Given the internet connection is slow (3G)
  When I first load the game
  Then it should show loading progress
  And it should cache files as they load
  And subsequent loads should be fast

Scenario: Service Worker Update During Play
  Given I am playing the game
  And an update is deployed
  When the service worker downloads new files
  Then the current game should not be interrupted
  And the update should apply on next launch

Scenario: Multiple Tabs Open
  Given I have the game open in two tabs
  When the service worker updates
  Then both tabs should receive the update
  And there should be no conflicts

Scenario: Font Fails to Load
  Given Google Fonts is unreachable
  When the game tries to load Fredoka One
  Then it should fall back to Comic Sans MS
  And the game should still be playable
  And text should still be readable

Scenario: Manifest Icons Missing
  Given the icon files don't exist
  When I try to install the PWA
  Then it should use fallback icons (from browser)
  And installation should still work
  And the app should still be functional
```

## Manual Testing Checklist

### Visual Inspection
1. [ ] All colors match Aurora's Rainbow palette
2. [ ] Gradients are smooth and vibrant
3. [ ] Fonts are Fredoka One (or Comic Sans fallback)
4. [ ] Bubbles are colorful and glossy
5. [ ] Buttons have rounded corners and white borders
6. [ ] Clouds float gently in background
7. [ ] No overlapping UI elements
8. [ ] All text is readable

### Responsive Testing
9. [ ] Open in Chrome DevTools
10. [ ] Test at 1920x1200 (base)
11. [ ] Test at 2560x1600 (Tab S7 FE)
12. [ ] Test at 1024x768 (small tablet)
13. [ ] Verify proportional scaling
14. [ ] Check touch target sizes
15. [ ] Verify no layout breaks

### PWA Testing
16. [ ] Open DevTools → Application
17. [ ] Verify manifest loads
18. [ ] Verify service worker registers
19. [ ] Test offline mode (DevTools → Network → Offline)
20. [ ] Check cache storage
21. [ ] Install to home screen
22. [ ] Launch from home screen
23. [ ] Verify fullscreen mode
24. [ ] Test auto-update (push new code, reopen app)

### Tab S7 FE Testing
25. [ ] Connect tablet to computer
26. [ ] Open GitHub Pages URL in Samsung Internet
27. [ ] Tap "Add to Home Screen"
28. [ ] Verify icon appears
29. [ ] Launch app
30. [ ] Verify fullscreen
31. [ ] Test touch interactions
32. [ ] Play complete round
33. [ ] Check performance (should be smooth)
34. [ ] Test audio
35. [ ] Close and reopen (test caching)

### Gameplay Testing
36. [ ] Play 5 complete rounds
37. [ ] Verify no overlapping issues
38. [ ] Check all bubbles are tappable
39. [ ] Verify score displays correctly
40. [ ] Verify time displays correctly
41. [ ] Test back button (shouldn't overlap score)
42. [ ] Test Play Again button
43. [ ] Verify colors are engaging

## Success Criteria

**This phase is complete when:**

1. Game scales perfectly to Tab S7 FE (2560x1600)
2. All UI elements positioned without overlapping
3. Bright colorful palette applied throughout
4. Fredoka One font loaded and used
5. Decorative clouds animate in background
6. All buttons styled consistently
7. PWA manifest valid and installable
8. Service worker caches game for offline use
9. Game deployed to GitHub Pages
10. Auto-updates work correctly
11. Tested successfully on Tab S7 FE
12. All acceptance criteria met
13. No console errors
14. 60fps performance maintained
15. Ready for Phase 13

This phase transforms the game from a basic prototype into a polished, professional PWA optimized for Aurora's tablet!
