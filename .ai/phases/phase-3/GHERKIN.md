# Phase 3: Asset Loading Infrastructure - BDD Scenarios

## Feature: Asset Loading with Progress Feedback

```gherkin
Feature: Asset Loading System
  As a developer
  I want to load game assets with visual progress feedback
  So that players know the game is loading and see when it's ready

Background:
  Given Phase 1 is complete (Phaser running)
  And Phase 2 is complete (Scene management working)
  And I am in the project root directory
```

## Scenario: Add Test Assets to Project

```gherkin
Scenario: Create test image asset
  Given the assets folder structure exists
  When I add a test image to "/assets/images/test-image.png"
  Then the file should exist at the correct path
  And the file should be a valid PNG image
  And the file size should be reasonable (< 100KB)
  And the image should be approximately 200x200 pixels

Scenario: Create test audio asset
  Given the assets folder structure exists
  When I add a test sound to "/assets/audio/test-sound.mp3"
  Then the file should exist at the correct path
  And the file should be a valid MP3 audio file
  And the file size should be reasonable (< 100KB)
  And the audio should be a short sound (< 3 seconds)
```

## Scenario: Create PreloadScene

```gherkin
Scenario: Create PreloadScene class file
  Given the src/scenes folder exists
  When I create "src/scenes/PreloadScene.js"
  Then the file should exist
  And it should define a PreloadScene class
  And the class should extend Phaser.Scene
  And the constructor should set key to "PreloadScene"
  And it should have a preload() method
  And it should have a create() method
  And it should have a createProgressBar() method
  And it should have an updateProgressBar() method
  And it should have a loadComplete() method
```

## Scenario: Implement Progress Bar Graphics

```gherkin
Scenario: Create progress bar UI elements
  Given PreloadScene exists
  And the scene has been initialized
  When createProgressBar() is called
  Then a progress box should be created with Graphics
  And the box should be 400 pixels wide
  And the box should be 30 pixels tall
  And the box should be centered horizontally
  And the box should be centered vertically
  And the box should have color #222222
  And a progress bar Graphics object should be created
  And a "Loading..." text should be created
  And the loading text should be 24px font size
  And the loading text should be white (#ffffff)
  And a percentage text should be created
  And the percentage text should show "0%"
  And the percentage text should be 18px font size
```

## Scenario: Load Test Assets

```gherkin
Scenario: Register assets for loading
  Given PreloadScene exists
  And test-image.png exists in assets/images
  And test-sound.mp3 exists in assets/audio
  When the preload() method is called
  Then the loader should register 'testImage' from 'assets/images/test-image.png'
  And the loader should register 'testSound' from 'assets/audio/test-sound.mp3'
  And the loader should have 2 files in queue
  And progress event listener should be registered
  And complete event listener should be registered
```

## Scenario: Progress Bar Animation

```gherkin
Scenario: Progress bar updates from 0% to 100%
  Given PreloadScene is active
  And assets are loading
  When the loader fires progress events
  Then updateProgressBar() should be called
  And the progress bar should start at 0% width
  And the progress bar should be green (#00ff00)
  And the progress bar width should increase
  And the percentage text should update from "0%" to "100%"
  And the progress should be smooth and continuous
  And the progress should reach 100% when complete

Scenario: Progress bar visual feedback
  Given the progress bar is at 50%
  When I observe the UI
  Then the progress bar should fill 200 pixels (half of 400)
  And the percentage text should show "50%"
  And the loading text should still say "Loading..."
  And all elements should be visible on screen
```

## Scenario: Loading Complete

```gherkin
Scenario: Handle loading completion
  Given all assets are loaded
  When the loader fires the complete event
  Then loadComplete() should be called
  And the loading text should change to "Complete!"
  And a console message should log "Assets loaded successfully"
  And the progress bar should show 100%
  And the percentage text should show "100%"
```

## Scenario: Transition to MainScene

```gherkin
Scenario: Automatic scene transition after loading
  Given PreloadScene.create() is called
  And all assets are loaded
  When 500 milliseconds pass
  Then the scene should start 'MainScene'
  And PreloadScene should be stopped
  And MainScene should become active
  And the progress bar should no longer be visible
```

## Scenario: Display Loaded Assets

```gherkin
Scenario: Display test image in MainScene
  Given MainScene is active
  And 'testImage' was loaded in PreloadScene
  When MainScene.create() is called
  Then the test image should be retrieved from cache
  And the image should be displayed at position (400, 300)
  And the image should be centered (origin 0.5, 0.5)
  And the image should be visible on screen
  And a success text should display saying "Test Image Loaded Successfully!"
  And the success text should be at position (400, 500)
  And the success text should be white and 24px

Scenario: Make test image interactive
  Given the test image is displayed
  When I make the image interactive
  Then the image should respond to pointer events
  And a click handler should be registered
  And instruction text should display "(Click image to play test sound)"
  And the instruction text should be gray (#cccccc) and 16px
```

## Scenario: Play Test Audio

```gherkin
Scenario: Click image to play sound
  Given MainScene is active
  And the test image is displayed and interactive
  And 'testSound' is loaded in cache
  When I click on the test image
  Then the sound manager should play 'testSound'
  And the audio should play successfully
  And the sound should be audible
  And no errors should occur
```

## Scenario: Update Game Configuration

```gherkin
Scenario: Configure scene array
  Given config.js exists
  When I update the scene configuration
  Then the scene property should be an array
  And the array should contain [PreloadScene, MainScene]
  And PreloadScene should be first (index 0)
  And MainScene should be second (index 1)
  And the game should start with PreloadScene

Scenario: Update HTML script tags
  Given index.html exists
  When I add script tags for new scenes
  Then PreloadScene.js should be loaded before MainScene.js
  And MainScene.js should be loaded before config.js
  And all scripts should load after Phaser CDN
  And all script paths should be correct
```

## Scenario: End-to-End Loading Flow

```gherkin
Scenario: Complete asset loading workflow
  Given the game is started
  When the browser loads index.html
  Then Phaser should initialize
  And PreloadScene should start first
  And the progress bar should appear
  And "Loading..." should display
  And assets should begin loading
  And the progress bar should animate from 0% to 100%
  And the percentage should update continuously
  And "Complete!" should display when finished
  And the scene should transition to MainScene after 500ms
  And the test image should display in MainScene
  And the success message should display
  And clicking the image should play the sound
  And no errors should appear in console
```

## Scenario: Error Handling

```gherkin
Scenario: Handle missing image file
  Given PreloadScene attempts to load 'testImage'
  But the file 'assets/images/test-image.png' does not exist
  When the loader tries to load the asset
  Then a loaderror event should fire
  And an error should be logged to console
  And the error should indicate which file failed
  And the error should show the attempted path
  And loading should continue with remaining assets

Scenario: Handle missing audio file
  Given PreloadScene attempts to load 'testSound'
  But the file 'assets/audio/test-sound.mp3' does not exist
  When the loader tries to load the asset
  Then a loaderror event should fire
  And an error should be logged to console
  And the progress bar should still reach 100%
  And the scene should still transition to MainScene
  And the image should still display
  But clicking the image should not play sound

Scenario: Handle incorrect asset path
  Given PreloadScene loads an asset
  But the path is incorrect (typo or wrong directory)
  When the loader tries to load the asset
  Then a 404 error should appear in Network tab
  And a loaderror event should fire
  And the console should show which asset failed
  And loading should not hang or freeze
```

## Scenario: Network Throttling Test

```gherkin
Scenario: Test with slow network connection
  Given Chrome DevTools is open
  And Network tab is selected
  And throttling is set to "Slow 3G"
  When I reload the page
  Then the progress bar should be clearly visible
  And the progress should animate slowly
  And I should see the bar gradually fill
  And the percentage should increment smoothly
  And each percentage value should be readable
  And the loading should complete successfully

Scenario: Test with fast network connection
  Given I have a fast internet connection
  When I load the game normally
  Then the progress bar should still appear briefly
  And the progress should animate smoothly
  And the minimum display time should be honored
  And the loading should complete successfully
  And the transition should be smooth
```

## Scenario: Asset Cache Verification

```gherkin
Scenario: Verify assets are cached
  Given PreloadScene has loaded all assets
  And the scene has transitioned to MainScene
  When MainScene requests 'testImage' from cache
  Then the image should be immediately available
  And no network request should be made
  And the image data should be in memory
  And the image should render without delay

Scenario: Access audio from cache
  Given 'testSound' was loaded in PreloadScene
  When MainScene calls sound.play('testSound')
  Then the audio should play immediately
  And no loading delay should occur
  And the audio data should be from cache
  And no network request should be made
```

## Scenario: Browser Compatibility

```gherkin
Scenario Outline: Asset loading across browsers
  Given I open the game in <browser>
  When the game loads
  Then PreloadScene should start
  And the progress bar should display correctly
  And assets should load successfully
  And the progress should reach 100%
  And MainScene should display the test image
  And clicking should play audio
  And no errors should occur

  Examples:
    | browser          |
    | Chrome           |
    | Firefox          |
    | Edge             |
    | Safari           |
```

## Scenario: Progress Bar Visual Verification

```gherkin
Scenario: Verify progress bar appearance
  Given PreloadScene is active
  And the progress bar is at 0%
  When I inspect the progress bar
  Then the progress box should have dimensions 400x30
  And the box should have a dark background (#222222)
  And the box should have 0.8 alpha transparency
  And the progress bar fill should be 0 pixels wide
  And the progress bar should be green (#00ff00)

Scenario: Verify progress bar at 50%
  Given the loading is 50% complete
  When I inspect the progress bar
  Then the progress bar fill should be 200 pixels wide
  And the fill should be green
  And the percentage text should read "50%"
  And the loading text should read "Loading..."

Scenario: Verify progress bar at 100%
  Given the loading is 100% complete
  When I inspect the progress bar
  Then the progress bar fill should be 400 pixels wide
  And the fill should completely cover the box
  And the percentage text should read "100%"
  And the loading text should read "Complete!"
```

## Scenario: Scene Cleanup

```gherkin
Scenario: PreloadScene cleanup after transition
  Given PreloadScene has transitioned to MainScene
  When I inspect the active scenes
  Then PreloadScene should not be active
  And MainScene should be the only active scene
  And PreloadScene objects should be destroyed
  And progress bar graphics should be cleaned up
  And memory should be freed appropriately
```

## Acceptance Criteria

### Must Have
- [ ] test-image.png exists in /assets/images
- [ ] test-sound.mp3 exists in /assets/audio
- [ ] PreloadScene.js exists in /src/scenes
- [ ] PreloadScene extends Phaser.Scene correctly
- [ ] Progress bar displays on screen
- [ ] Progress bar animates from 0% to 100%
- [ ] Percentage text updates during loading
- [ ] "Loading..." text displays
- [ ] "Complete!" displays when finished
- [ ] Scene transitions to MainScene automatically
- [ ] Test image displays in MainScene
- [ ] Test image is centered at (400, 300)
- [ ] Success message displays
- [ ] Clicking image plays audio
- [ ] No console errors during loading
- [ ] No 404 errors for assets
- [ ] config.js updated with scene array
- [ ] index.html updated with script tags

### Visual Verification
- [ ] Progress bar is 400x30 pixels
- [ ] Progress bar is centered on screen
- [ ] Progress box has dark background (#222222)
- [ ] Progress fill is green (#00ff00)
- [ ] Loading text is white, 24px
- [ ] Percentage text is white, 18px
- [ ] Progress animates smoothly
- [ ] All text is readable
- [ ] Test image displays correctly in MainScene
- [ ] Success text is white, 24px
- [ ] Instruction text is gray, 16px

### Technical Verification
- [ ] Assets load from correct paths
- [ ] Progress events fire correctly
- [ ] Complete event fires when done
- [ ] Assets are cached properly
- [ ] Assets accessible in MainScene
- [ ] Audio plays without errors
- [ ] Scene transition works smoothly
- [ ] Interactive click handler works
- [ ] No memory leaks
- [ ] Console shows success message

### Error Handling
- [ ] Missing image logs error
- [ ] Missing audio logs error
- [ ] Wrong path logs error
- [ ] Loading doesn't hang on error
- [ ] Error messages are clear
- [ ] Game continues despite errors

### Performance
- [ ] Loading completes in reasonable time
- [ ] Progress updates smoothly
- [ ] No frame drops during loading
- [ ] Scene transition is smooth
- [ ] Asset rendering is immediate

## Manual Testing Checklist

### Setup Phase
1. [ ] Verify test-image.png exists and is valid
2. [ ] Verify test-sound.mp3 exists and is valid
3. [ ] Verify PreloadScene.js is created
4. [ ] Verify MainScene.js is updated
5. [ ] Verify config.js has scene array
6. [ ] Verify index.html has all script tags
7. [ ] Clear browser cache

### Loading Phase
8. [ ] Open index.html in browser
9. [ ] Observe PreloadScene starts
10. [ ] Verify progress bar appears
11. [ ] Verify "Loading..." text displays
12. [ ] Verify percentage starts at 0%
13. [ ] Watch progress animate to 100%
14. [ ] Verify each percentage increment
15. [ ] Verify "Complete!" displays
16. [ ] Verify smooth transition to MainScene

### Display Phase
17. [ ] Verify test image displays
18. [ ] Verify image is centered
19. [ ] Verify success message displays
20. [ ] Verify instruction text displays
21. [ ] Hover over image (should be interactive)
22. [ ] Click image
23. [ ] Verify audio plays
24. [ ] Check audio completes without errors

### Console Verification
25. [ ] Open browser DevTools (F12)
26. [ ] Check Console tab for errors
27. [ ] Verify "Assets loaded successfully" message
28. [ ] Check Network tab for 404 errors
29. [ ] Verify all assets loaded (200 status)
30. [ ] Verify correct file sizes

### Network Throttling
31. [ ] Set Network to "Slow 3G"
32. [ ] Reload page
33. [ ] Observe slow progress animation
34. [ ] Verify progress increments smoothly
35. [ ] Verify loading completes
36. [ ] Reset network to "No throttling"

### Error Testing
37. [ ] Rename test-image.png temporarily
38. [ ] Reload page
39. [ ] Verify error logged to console
40. [ ] Verify error message is clear
41. [ ] Restore test-image.png
42. [ ] Repeat for test-sound.mp3

### Cross-Browser Testing
43. [ ] Test in Chrome
44. [ ] Test in Firefox
45. [ ] Test in Edge
46. [ ] Document any browser-specific issues

### Final Verification
47. [ ] All acceptance criteria met
48. [ ] No console errors
49. [ ] No visual glitches
50. [ ] Ready for Phase 4

## Success Criteria

**This phase is complete when:**
1. Test assets exist and are valid
2. PreloadScene displays progress bar correctly
3. Progress animates from 0% to 100%
4. Assets load without errors
5. Scene transitions to MainScene smoothly
6. Test image displays in MainScene
7. Audio plays when clicking image
8. No console errors
9. Tested with network throttling
10. Tested error scenarios
11. Verified in multiple browsers
12. All acceptance criteria met

## Edge Cases to Test

```gherkin
Scenario: Very small assets load instantly
  Given test assets are very small (< 10KB)
  When the game loads
  Then the progress bar should still be visible briefly
  And the user should see the loading feedback
  And the transition should not feel jarring

Scenario: Large assets take time to load
  Given test assets are larger (> 500KB)
  When the game loads with slow network
  Then the progress bar should clearly show progress
  And the percentage should increment gradually
  And the user should see meaningful feedback

Scenario: Audio codec not supported
  Given the browser doesn't support MP3
  When the audio loads
  Then a loaderror should fire
  And the error should indicate codec issue
  And the game should continue functioning
  And a console message should suggest alternatives

Scenario: Image format not supported
  Given an unsupported image format is used
  When the image loads
  Then a loaderror should fire
  And the error should indicate format issue
  And the game should continue functioning

Scenario: CORS policy blocks asset
  Given assets are on a different domain
  And CORS headers are not set
  When assets attempt to load
  Then CORS errors should appear in console
  And loader errors should fire
  And the issue should be clearly identifiable

Scenario: Offline mode
  Given the browser is offline
  And assets are not cached
  When the game loads
  Then network errors should occur
  And errors should be logged
  And the game should handle gracefully
```

## Notes

**Focus of Phase 3**
- Prove asset loading works
- Provide visual feedback
- Handle success and error cases
- Establish loading pattern for future phases

**What We're Testing**
- Asset loading system
- Progress tracking and display
- Asset caching
- Scene transitions
- Interactive elements
- Audio playback
- Error handling

**What We're NOT Testing Yet**
- Game mechanics (no gameplay yet)
- Multiple assets (just 2 test files)
- Asset optimization (comes later)
- Loading screens design (basic UI only)
- Performance optimization (premature)

**Testing Philosophy**
- Test the happy path first
- Test error cases second
- Test edge cases third
- Document all findings
- Verify in multiple browsers

This phase establishes the foundation for loading all game assets in future phases.
