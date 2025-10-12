# Phase 1: Project Bootstrap - BDD Scenarios

## Feature: Project Setup

```gherkin
Feature: Project Bootstrap
  As a developer
  I want to set up the basic project structure
  So that I can start building Aurora's game

Background:
  Given I am in the project root directory
  And I have a web browser installed
```

## Scenario: Create Project Structure

```gherkin
Scenario: Set up folder structure
  When I create the project folders
  Then the following directories should exist:
    | Directory      |
    | /assets        |
    | /assets/audio  |
    | /assets/images |
    | /assets/data   |
    | /src           |
    | /src/scenes    |
  And the root should contain "index.html"
  And the src folder should contain "config.js"
```

## Scenario: Create HTML File

```gherkin
Scenario: Create index.html with Phaser CDN
  Given I have created the project structure
  When I create index.html
  Then it should have DOCTYPE html5
  And it should have a title "Aurora's Letter Adventure"
  And it should link to Phaser 3 CDN
  And it should link to "src/config.js"
  And it should have a div with id "game-container"
  And it should have CSS to center the game
```

## Scenario: Create Config File

```gherkin
Scenario: Create Phaser configuration
  Given I have created index.html
  When I create src/config.js
  Then it should define a config object with:
    | Property         | Value              |
    | type             | Phaser.AUTO        |
    | width            | 800                |
    | height           | 600                |
    | parent           | "game-container"   |
    | backgroundColor  | "#4488ff"          |
  And it should have a scene with a create function
  And it should instantiate new Phaser.Game(config)
```

## Scenario: Display Welcome Text

```gherkin
Scenario: Render text on canvas
  Given the config file is complete
  And the scene create function is defined
  When the scene is created
  Then a text object should be added
  And the text should say "Aurora's Letter Adventure"
  And the text should be positioned at (400, 300)
  And the text should have fontSize "32px"
  And the text should have color "#ffffff"
  And the text should be centered (origin 0.5, 0.5)
```

## Scenario: Launch Game in Browser

```gherkin
Scenario: Open game in browser successfully
  Given all files are created
  When I open index.html in Chrome
  Then the page should load without errors
  And the Phaser canvas should be visible
  And the canvas should be 800x600 pixels
  And the background should be blue (#4488ff)
  And the text "Aurora's Letter Adventure" should be visible
  And the text should be centered on the canvas
  And the text should be white
  And the browser console should show no errors
```

## Scenario: Verify No Console Errors

```gherkin
Scenario: Check browser console
  Given the game is loaded in the browser
  When I open the browser developer console (F12)
  Then there should be no error messages
  And there should be no warning messages
  And Phaser initialization messages may be present
```

## Scenario: Test in Multiple Browsers

```gherkin
Scenario Outline: Cross-browser compatibility
  Given all files are created
  When I open index.html in <browser>
  Then the game should load successfully
  And the canvas should render correctly
  And the text should be visible
  And there should be no console errors

  Examples:
    | browser          |
    | Chrome           |
    | Firefox          |
    | Edge             |
```

## Scenario: Verify Canvas Dimensions

```gherkin
Scenario: Check canvas size
  Given the game is loaded
  When I inspect the canvas element
  Then the canvas width should be 800 pixels
  And the canvas height should be 600 pixels
  And the canvas should be inside "#game-container"
```

## Scenario: Verify CSS Styling

```gherkin
Scenario: Check page styling
  Given the game is loaded
  When I inspect the page layout
  Then the body should have centered flex layout
  And the background should be dark (#2d2d2d)
  And the game container should have a box shadow
  And the game should be centered on the page
```

## Scenario: CDN Fallback Test

```gherkin
Scenario: Handle CDN failure gracefully
  Given index.html is created
  And the Phaser CDN is unavailable
  When I open index.html
  Then the browser should show a CDN error in console
  And the page should not crash
  And I should be able to switch to local Phaser file
```

## Scenario: Verify File Paths

```gherkin
Scenario: Check all file references
  Given all files are created
  When I review the HTML file
  Then the Phaser script should point to CDN
  And the config script should point to "src/config.js"
  And all paths should be relative
  And no paths should give 404 errors
```

## Acceptance Criteria

### Must Have
- [ ] All folders created correctly
- [ ] index.html exists and is valid HTML5
- [ ] src/config.js exists and creates Phaser game
- [ ] Game loads in browser without errors
- [ ] Canvas displays with blue background
- [ ] White text displays centered
- [ ] Text reads "Aurora's Letter Adventure"
- [ ] No console errors

### Visual Verification
- [ ] Canvas is 800x600 pixels
- [ ] Background is blue (#4488ff)
- [ ] Text is white (#ffffff)
- [ ] Text is 32px font size
- [ ] Text is perfectly centered
- [ ] Page has dark background (#2d2d2d)
- [ ] Canvas has subtle shadow

### Technical Verification
- [ ] Phaser loads from CDN
- [ ] JavaScript executes without errors
- [ ] Config object is properly formatted
- [ ] Scene create function runs
- [ ] Text object is added to scene
- [ ] Game instance is created

### Browser Compatibility
- [ ] Works in Chrome (primary)
- [ ] Works in Firefox (secondary)
- [ ] Works in Edge (optional for phase 1)

## Edge Cases to Test

```gherkin
Scenario: Missing CDN Connection
  Given I have no internet connection
  When I open the game
  Then the CDN fails to load
  And I see an error in console
  And I can document this for future offline handling

Scenario: Invalid Config
  Given config.js has a syntax error
  When I open the game
  Then the console shows the error
  And I can fix it based on error message

Scenario: Wrong Parent ID
  Given the config parent is "wrong-id"
  When I open the game
  Then Phaser cannot find the container
  And the console shows a clear error
  And I can correct the parent ID
```

## Manual Testing Checklist

### Setup
1. [ ] Create all folders
2. [ ] Create index.html
3. [ ] Create src/config.js
4. [ ] Verify all files saved

### Testing
5. [ ] Open index.html in Chrome
6. [ ] Verify canvas displays
7. [ ] Verify text displays
8. [ ] Open DevTools (F12)
9. [ ] Check console for errors
10. [ ] Check Elements tab for canvas
11. [ ] Verify canvas dimensions
12. [ ] Take screenshot

### Validation
13. [ ] Text is centered
14. [ ] Colors are correct
15. [ ] No errors in console
16. [ ] Test in Firefox
17. [ ] Document any issues

## Success Criteria

**This phase is complete when:**
1. All files and folders exist
2. Game loads in browser
3. Canvas renders with blue background
4. Text displays centered and white
5. Zero console errors
6. Tested in 2+ browsers
7. Screenshot taken for documentation
8. Ready to proceed to Phase 2

## Notes

**Keep It Simple**
- This phase is just proving Phaser works
- No game logic yet
- No assets yet
- No scenes yet
- Just: HTML → Phaser → Canvas → Text

**What We're Testing**
- Development environment works
- Phaser integration works
- Browser compatibility
- File structure is correct

**What We're NOT Testing**
- Game features (none exist yet)
- Asset loading (no assets yet)
- Complex scenes (not implemented)
- User interaction (not added yet)

This is the foundation. It must be rock solid before we build on it.
