# Phase 2: Basic Scene System - BDD Scenarios

## Feature: Scene Structure

```gherkin
Feature: Scene System Implementation
  As a developer
  I want to implement proper Phaser scene structure
  So that the game has a solid architectural foundation

Background:
  Given Phase 1 is complete
  And Phaser 3 is loaded from CDN
  And the game canvas is rendering
```

## Scenario: Create BootScene

```gherkin
Scenario: Create BootScene class file
  Given I am in the project root directory
  When I create "src/scenes/BootScene.js"
  Then the file should contain a class named "BootScene"
  And the class should extend "Phaser.Scene"
  And the constructor should set the scene key to "Boot"
  And the class should have a create method
  And the create method should log to console
  And the create method should display text
  And the create method should set a delayed transition
```

## Scenario: Create PreloadScene

```gherkin
Scenario: Create PreloadScene class file
  Given I am in the project root directory
  When I create "src/scenes/PreloadScene.js"
  Then the file should contain a class named "PreloadScene"
  And the class should extend "Phaser.Scene"
  And the constructor should set the scene key to "Preload"
  And the class should have a create method
  And the create method should log to console
  And the create method should display loading text
  And the create method should set a delayed transition
```

## Scenario: Create MainMenuScene

```gherkin
Scenario: Create MainMenuScene class file
  Given I am in the project root directory
  When I create "src/scenes/MainMenuScene.js"
  Then the file should contain a class named "MainMenuScene"
  And the class should extend "Phaser.Scene"
  And the constructor should set the scene key to "MainMenu"
  And the class should have a create method
  And the create method should log to console
  And the create method should display title text
  And the create method should display instruction text
```

## Feature: Scene Configuration

```gherkin
Feature: Update Game Configuration
  As a developer
  I want to register all scenes in the config
  So that Phaser can manage scene transitions
```

## Scenario: Update config.js

```gherkin
Scenario: Modify game configuration to use scene classes
  Given all three scene files are created
  And config.js exists from Phase 1
  When I update config.js
  Then the inline scene definition should be removed
  And the scene property should be an array
  And the array should contain BootScene
  And the array should contain PreloadScene
  And the array should contain MainMenuScene
  And the array should be in the correct order: [Boot, Preload, MainMenu]
  And all other config properties should remain unchanged
```

## Scenario: Update index.html

```gherkin
Scenario: Add scene script tags to HTML
  Given all three scene files are created
  And index.html exists from Phase 1
  When I update index.html
  Then it should load BootScene.js before config.js
  And it should load PreloadScene.js before config.js
  And it should load MainMenuScene.js before config.js
  And the script load order should be:
    | Order | Script                       |
    | 1     | Phaser CDN                   |
    | 2     | src/scenes/BootScene.js      |
    | 3     | src/scenes/PreloadScene.js   |
    | 4     | src/scenes/MainMenuScene.js  |
    | 5     | src/config.js                |
```

## Feature: Scene Transitions

```gherkin
Feature: Automatic Scene Transitions
  As a player
  I want scenes to transition automatically
  So that the game flows smoothly
```

## Scenario: Boot to Preload Transition

```gherkin
Scenario: BootScene transitions to PreloadScene
  Given the game is loaded in the browser
  And BootScene is active
  When BootScene's create method executes
  Then "Initializing..." text should be displayed
  And the console should log "BootScene started"
  And a 1-second timer should be set
  When 1 second has passed
  Then this.scene.start should be called with 'Preload'
  And BootScene should stop
  And PreloadScene should start
```

## Scenario: Preload to MainMenu Transition

```gherkin
Scenario: PreloadScene transitions to MainMenuScene
  Given PreloadScene is active
  When PreloadScene's create method executes
  Then "Loading..." text should be displayed
  And the console should log "PreloadScene started"
  And a 2-second timer should be set
  When 2 seconds have passed
  Then this.scene.start should be called with 'MainMenu'
  And PreloadScene should stop
  And MainMenuScene should start
```

## Scenario: Complete Scene Flow

```gherkin
Scenario: Full scene transition sequence
  Given I open the game in a browser
  And the browser console is open (F12)
  When the game starts
  Then BootScene should be the first scene
  And I should see "Initializing..." on screen
  And console should show "BootScene started"
  When I wait 1 second
  Then PreloadScene should be active
  And I should see "Loading..." on screen
  And console should show "PreloadScene started"
  When I wait 2 more seconds
  Then MainMenuScene should be active
  And I should see "Aurora's Letter Adventure" on screen
  And I should see "Press to Start" on screen
  And console should show "MainMenuScene started"
  And the scene transitions should be complete
```

## Feature: Console Logging

```gherkin
Feature: Console Logging for Debugging
  As a developer
  I want console logs for each scene
  So that I can verify scene transitions work correctly
```

## Scenario: BootScene Console Log

```gherkin
Scenario: Verify BootScene logging
  Given the game is loaded
  And the browser console is visible
  When BootScene's create method runs
  Then the console should display "BootScene started"
  And the log should appear before PreloadScene logs
  And the log should be the first scene-related message
```

## Scenario: PreloadScene Console Log

```gherkin
Scenario: Verify PreloadScene logging
  Given BootScene has completed
  And PreloadScene is starting
  When PreloadScene's create method runs
  Then the console should display "PreloadScene started"
  And the log should appear after BootScene log
  And the log should appear before MainMenuScene log
```

## Scenario: MainMenuScene Console Log

```gherkin
Scenario: Verify MainMenuScene logging
  Given PreloadScene has completed
  And MainMenuScene is starting
  When MainMenuScene's create method runs
  Then the console should display "MainMenuScene started"
  And the log should appear after PreloadScene log
  And the log should be the last transition message
```

## Scenario: Console Log Order

```gherkin
Scenario: Verify complete console log sequence
  Given I load the game with console open
  When all scene transitions complete
  Then the console should show logs in this order:
    | Order | Log Message              |
    | 1     | BootScene started        |
    | 2     | PreloadScene started     |
    | 3     | MainMenuScene started    |
  And there should be no error messages
  And there should be no warning messages
```

## Feature: MainMenu Display

```gherkin
Feature: MainMenu Scene Display
  As a player
  I want to see the game title and instructions
  So that I know the game is ready to start
```

## Scenario: Display Title Text

```gherkin
Scenario: Show game title on MainMenu
  Given MainMenuScene is active
  When the scene's create method runs
  Then text should be added to the scene
  And the text should read "Aurora's Letter Adventure"
  And the text should be positioned at (400, 200)
  And the text should have fontSize "40px"
  And the text should have color "#ffff00" (yellow)
  And the text should have fontStyle "bold"
  And the text should be centered (origin 0.5, 0.5)
```

## Scenario: Display Instruction Text

```gherkin
Scenario: Show start instructions on MainMenu
  Given MainMenuScene is active
  When the scene's create method runs
  Then text should be added to the scene
  And the text should read "Press to Start"
  And the text should be positioned at (400, 400)
  And the text should have fontSize "24px"
  And the text should have color "#ffffff" (white)
  And the text should be centered (origin 0.5, 0.5)
```

## Scenario: MainMenu Complete Display

```gherkin
Scenario: Verify complete MainMenu appearance
  Given I have waited for all transitions
  And MainMenuScene is active
  When I look at the game canvas
  Then I should see yellow title text at the top
  And I should see white instruction text in the middle-bottom
  And both text elements should be centered horizontally
  And the background should still be blue (#4488ff)
  And the layout should be visually balanced
```

## Feature: Scene Class Structure

```gherkin
Feature: Scene Class Implementation
  As a developer
  I want scenes to follow proper ES6 class structure
  So that the code is maintainable and extensible
```

## Scenario: BootScene Class Structure

```gherkin
Scenario: Verify BootScene class implementation
  Given I examine BootScene.js
  Then it should use ES6 class syntax
  And the class should extend Phaser.Scene
  And the constructor should call super with config object
  And the config object should have key: 'Boot'
  And the create method should be defined
  And the create method should use this.add.text
  And the create method should use this.time.delayedCall
  And the create method should use this.scene.start
```

## Scenario: Scene Key Consistency

```gherkin
Scenario: Verify scene keys are consistent
  Given all three scene files exist
  When I check the constructor keys
  Then BootScene should have key 'Boot'
  And PreloadScene should have key 'Preload'
  And MainMenuScene should have key 'MainMenu'
  When I check scene.start calls
  Then BootScene should transition to 'Preload'
  And PreloadScene should transition to 'MainMenu'
  And all keys should match exactly (case-sensitive)
```

## Feature: Timer Implementation

```gherkin
Feature: Delayed Scene Transitions
  As a developer
  I want scenes to transition after delays
  So that users can see each scene's content
```

## Scenario: BootScene Timer

```gherkin
Scenario: Verify BootScene uses 1-second delay
  Given BootScene is active
  When create method executes
  Then this.time.delayedCall should be called
  And the delay should be 1000 milliseconds
  And the callback should call this.scene.start('Preload')
  When 1000ms passes
  Then the callback should execute
  And PreloadScene should start
```

## Scenario: PreloadScene Timer

```gherkin
Scenario: Verify PreloadScene uses 2-second delay
  Given PreloadScene is active
  When create method executes
  Then this.time.delayedCall should be called
  And the delay should be 2000 milliseconds
  And the callback should call this.scene.start('MainMenu')
  When 2000ms passes
  Then the callback should execute
  And MainMenuScene should start
```

## Feature: Error Handling

```gherkin
Feature: Error-Free Execution
  As a developer
  I want the game to run without errors
  So that the foundation is stable
```

## Scenario: No JavaScript Errors

```gherkin
Scenario: Verify no console errors during transitions
  Given I open the game with console visible
  When all scene transitions occur
  Then there should be no error messages
  And there should be no "undefined" errors
  And there should be no "is not a function" errors
  And there should be no "Cannot read property" errors
  And all scene transitions should complete successfully
```

## Scenario: Scene Registration Errors

```gherkin
Scenario: Detect scene registration issues
  Given all scene files are created
  And index.html loads all scripts
  When config.js tries to register scenes
  Then all scene classes should be defined
  And no "class is not defined" errors should occur
  And the scene array should be valid
  And Phaser should accept all scene classes
```

## Scenario: Scene Key Errors

```gherkin
Scenario: Detect scene key mismatches
  Given scenes are registered in config
  When scene.start is called with a key
  Then the key should match an existing scene
  And no "Scene not found" errors should occur
  And transitions should work smoothly
```

## Feature: Browser Compatibility

```gherkin
Feature: Cross-Browser Scene Transitions
  As a developer
  I want scenes to work in multiple browsers
  So that all users can play the game
```

## Scenario Outline: Test in Multiple Browsers

```gherkin
Scenario Outline: Scene transitions in <browser>
  Given I open the game in <browser>
  And the console is visible
  When the game loads
  Then all three scenes should transition correctly
  And all console logs should appear
  And all text should be visible
  And there should be no browser-specific errors

  Examples:
    | browser          |
    | Chrome           |
    | Firefox          |
    | Edge             |
```

## Acceptance Criteria

### Scene Files Created
- [ ] BootScene.js exists in /src/scenes/
- [ ] PreloadScene.js exists in /src/scenes/
- [ ] MainMenuScene.js exists in /src/scenes/
- [ ] All files use correct ES6 class syntax
- [ ] All classes extend Phaser.Scene
- [ ] All constructors set unique scene keys

### Scene Implementation
- [ ] BootScene displays "Initializing..." text
- [ ] BootScene logs to console
- [ ] BootScene transitions to Preload after 1 second
- [ ] PreloadScene displays "Loading..." text
- [ ] PreloadScene logs to console
- [ ] PreloadScene transitions to MainMenu after 2 seconds
- [ ] MainMenuScene displays title text
- [ ] MainMenuScene displays instruction text
- [ ] MainMenuScene logs to console

### Configuration
- [ ] config.js updated to use scene array
- [ ] Scene array contains all three scenes
- [ ] Scene array is in correct order
- [ ] index.html loads all scene files
- [ ] Scripts load before config.js
- [ ] Script load order is correct

### Scene Transitions
- [ ] BootScene starts automatically
- [ ] Boot → Preload transition works
- [ ] Preload → MainMenu transition works
- [ ] Transitions are automatic (no user input)
- [ ] Timing is correct (1s, then 2s)
- [ ] No transition errors

### Console Logging
- [ ] "BootScene started" appears in console
- [ ] "PreloadScene started" appears in console
- [ ] "MainMenuScene started" appears in console
- [ ] Logs appear in correct order
- [ ] No error messages in console
- [ ] No warning messages in console

### Visual Display
- [ ] "Initializing..." visible during Boot
- [ ] "Loading..." visible during Preload
- [ ] Title text visible in MainMenu
- [ ] Title text is yellow and bold
- [ ] Instruction text visible in MainMenu
- [ ] Instruction text is white
- [ ] All text is centered
- [ ] All text is readable

### Code Quality
- [ ] No syntax errors
- [ ] No runtime errors
- [ ] Scene keys are consistent
- [ ] Code follows ES6 standards
- [ ] Comments explain key sections
- [ ] Code is formatted consistently

### Testing
- [ ] Tested in Chrome
- [ ] Tested in Firefox
- [ ] All transitions work smoothly
- [ ] Timing is accurate
- [ ] Text displays correctly in all browsers

## Manual Testing Checklist

### Setup Phase
1. [ ] Create /src/scenes/ directory
2. [ ] Create BootScene.js
3. [ ] Create PreloadScene.js
4. [ ] Create MainMenuScene.js
5. [ ] Update config.js
6. [ ] Update index.html
7. [ ] Save all files

### Testing Phase - Boot Scene
8. [ ] Open index.html in Chrome
9. [ ] Open browser console (F12)
10. [ ] Verify "Initializing..." appears
11. [ ] Verify "BootScene started" in console
12. [ ] Verify no errors in console
13. [ ] Wait 1 second

### Testing Phase - Preload Scene
14. [ ] Verify "Loading..." appears
15. [ ] Verify "PreloadScene started" in console
16. [ ] Verify previous scene text is gone
17. [ ] Verify no errors in console
18. [ ] Wait 2 seconds

### Testing Phase - MainMenu Scene
19. [ ] Verify "Aurora's Letter Adventure" appears
20. [ ] Verify title is yellow and bold
21. [ ] Verify "Press to Start" appears
22. [ ] Verify instruction is white
23. [ ] Verify "MainMenuScene started" in console
24. [ ] Verify both texts are centered
25. [ ] Verify no errors in console

### Cross-Browser Testing
26. [ ] Refresh and test timing again
27. [ ] Test in Firefox
28. [ ] Test in Edge (optional)
29. [ ] Verify consistent behavior
30. [ ] Take screenshots

### Code Review
31. [ ] Review BootScene.js for errors
32. [ ] Review PreloadScene.js for errors
33. [ ] Review MainMenuScene.js for errors
34. [ ] Review config.js changes
35. [ ] Review index.html changes
36. [ ] Verify scene key consistency

## Edge Cases to Test

```gherkin
Scenario: Fast Refresh During Transition
  Given a scene transition is in progress
  When I refresh the browser
  Then the game should restart from BootScene
  And all transitions should work normally
  And no lingering timers should cause errors

Scenario: Scene Key Typo
  Given I accidentally use wrong scene key
  When scene.start is called with incorrect key
  Then the console should show an error
  And the error should clearly indicate the problem
  And I can fix it easily

Scenario: Missing Scene File
  Given one scene file is not loaded
  When config.js tries to use the scene
  Then I should see "class is not defined" error
  And I can identify which scene is missing

Scenario: Scene Files Load After Config
  Given scene scripts load after config.js
  When Phaser tries to create the game
  Then scene classes are not defined yet
  And I see reference errors
  And I need to reorder script tags
```

## Success Criteria

**This phase is complete when:**

1. **All Files Created**
   - Three scene files exist
   - All files have correct class structure
   - All scenes extend Phaser.Scene

2. **Configuration Updated**
   - config.js uses scene array
   - index.html loads all scenes
   - Script order is correct

3. **Scene Transitions Work**
   - Boot → Preload → MainMenu
   - Timing is accurate
   - No transition errors

4. **Console Logging Works**
   - All three scenes log to console
   - Logs appear in correct order
   - No error messages

5. **Visual Display Works**
   - All text displays correctly
   - Colors are correct
   - Text is centered

6. **Cross-Browser Tested**
   - Works in Chrome
   - Works in Firefox
   - Consistent behavior

7. **No Errors**
   - Zero JavaScript errors
   - Zero console warnings
   - Smooth execution

8. **Ready for Phase 3**
   - Foundation is solid
   - Pattern is established
   - Can add input handling next

## Notes

**What We're Testing**
- Scene class structure
- Scene transitions
- Timer functionality
- Console logging
- Text display
- Scene lifecycle

**What We're NOT Testing Yet**
- User input (Phase 3)
- Asset loading (Phase 4)
- Game logic (later phases)
- Sound (later phases)
- Animations (later phases)

**Why Console Logs Matter**
- Prove scenes are starting
- Show transition order
- Help debug timing issues
- Confirm scene lifecycle

**Why Timers Matter**
- Users can see each scene
- Proves time system works
- Sets up for animations
- Foundation for game loop

This is the architectural foundation for the entire game. Every future scene will follow this pattern.
