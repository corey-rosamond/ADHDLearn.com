# Phase 20: Settings Scene - BDD Scenarios

## Feature: Settings Scene Access

```gherkin
Feature: Navigate to Settings Scene
  As a player or parent
  I want to access game settings
  So that I can customize the game experience

Background:
  Given the game is loaded
  And the main menu is displayed
```

## Scenario: Open Settings from Main Menu

```gherkin
Scenario: Navigate to settings
  Given the player is on the main menu
  When the player clicks the "Settings" button
  Then the SettingsScene should load
  And the settings title should display "Settings"
  And all settings UI elements should be visible
  And current settings should be loaded from localStorage
```

## Feature: Volume Controls

```gherkin
Feature: Music Volume Control
  As a player or parent
  I want to adjust music volume
  So that background music is at a comfortable level

Background:
  Given the SettingsScene is open
  And the music volume slider is displayed
```

## Scenario: Adjust Music Volume with Slider

```gherkin
Scenario: Drag music volume slider
  Given the current music volume is 75%
  When the player drags the music slider to the right
  Then the slider fill should increase visually
  And the percentage text should update in real-time
  And the music volume should change immediately
  And the new value should be saved to localStorage
```

## Scenario: Set Music Volume to Minimum

```gherkin
Scenario: Mute music
  Given the music volume slider is displayed
  When the player drags the slider to the far left
  Then the percentage should display "0%"
  And the slider fill should be empty (width: 0)
  And the music should be silent
  And the setting should be saved as musicVolume: 0
```

## Scenario: Set Music Volume to Maximum

```gherkin
Scenario: Max music volume
  Given the music volume slider is displayed
  When the player drags the slider to the far right
  Then the percentage should display "100%"
  And the slider fill should be full (width: 300px)
  And the music should play at maximum volume
  And the setting should be saved as musicVolume: 100
```

## Scenario: Music Volume Persists After Reload

```gherkin
Scenario: Music volume persistence
  Given the player sets music volume to 60%
  When the page is reloaded
  And the player returns to settings
  Then the music slider should display 60%
  And the music should play at 60% volume
  And the slider fill should reflect 60%
```

## Feature: Sound Effects Volume Control

```gherkin
Feature: SFX Volume Control
  As a player or parent
  I want to adjust sound effects volume
  So that game sounds are at an appropriate level

Background:
  Given the SettingsScene is open
  And the SFX volume slider is displayed
```

## Scenario: Adjust SFX Volume

```gherkin
Scenario: Change sound effects volume
  Given the current SFX volume is 80%
  When the player drags the SFX slider to 50%
  Then the percentage text should display "50%"
  And the slider fill should reflect 50%
  And sound effects should play at 50% volume
  And the setting should save to localStorage immediately
```

## Scenario: Test SFX Volume Change

```gherkin
Scenario: Verify SFX volume in game
  Given the player sets SFX volume to 30%
  When the player returns to a game scene
  And a sound effect plays (e.g., button click)
  Then the sound effect should play at 30% volume
  And the volume setting should persist
```

## Feature: Voice Volume Control

```gherkin
Feature: Voice Volume Control
  As a player or parent
  I want to adjust instruction voice volume
  So that audio instructions are clear but not too loud

Background:
  Given the SettingsScene is open
  And the voice volume slider is displayed
```

## Scenario: Adjust Voice Volume

```gherkin
Scenario: Change voice instruction volume
  Given the current voice volume is 90%
  When the player drags the voice slider to 70%
  Then the percentage text should display "70%"
  And the slider fill should reflect 70%
  And the setting should save to localStorage
```

## Scenario: Voice Volume in Game

```gherkin
Scenario: Apply voice volume to instructions
  Given the player sets voice volume to 85%
  When the player starts a Letter Pop game
  And the game plays "Find the letter B!"
  Then the instruction audio should play at 85% volume
  And the voice should be clear and audible
```

## Feature: Difficulty Selection

```gherkin
Feature: Difficulty Level Selection
  As a player or parent
  I want to select a difficulty level
  So that the game matches the player's skill level

Background:
  Given the SettingsScene is open
  And three difficulty buttons are displayed (Easy, Medium, Hard)
```

## Scenario: Select Easy Difficulty

```gherkin
Scenario: Change difficulty to Easy
  Given the current difficulty is "Medium"
  When the player clicks the "Easy" button
  Then the Easy button should be highlighted
  And the Medium button should be unhighlighted
  And the difficulty should save as "easy" in localStorage
  And the UI should refresh to show the selection
```

## Scenario: Select Medium Difficulty

```gherkin
Scenario: Change difficulty to Medium
  Given the current difficulty is "Hard"
  When the player clicks the "Medium" button
  Then the Medium button should be highlighted (green)
  And the Hard button should be unhighlighted (gray)
  And the difficulty should save as "medium" in localStorage
```

## Scenario: Select Hard Difficulty

```gherkin
Scenario: Change difficulty to Hard
  Given the current difficulty is "Medium"
  When the player clicks the "Hard" button
  Then the Hard button should be highlighted
  And the Medium button should be unhighlighted
  And the difficulty should save as "hard" in localStorage
```

## Scenario: Difficulty Affects Gameplay

```gherkin
Scenario: Easy difficulty in game
  Given the player selects "Easy" difficulty
  When the player starts a game scene
  Then the game should load with easy parameters:
    | Parameter        | Value          |
    | Letters shown    | Fewer (A-M)    |
    | Bubble size      | Larger         |
    | Time pressure    | None           |
    | Target count     | 5 bubbles      |
```

## Scenario: Difficulty Persists Across Sessions

```gherkin
Scenario: Difficulty persistence
  Given the player sets difficulty to "Hard"
  When the page is reloaded
  And the player returns to settings
  Then the Hard button should be highlighted
  And the difficulty should be "hard"
  And new games should use hard difficulty
```

## Feature: Reset Progress

```gherkin
Feature: Reset Game Progress
  As a player or parent
  I want to reset all game progress
  So that the player can start fresh

Background:
  Given the SettingsScene is open
  And the "Reset Progress" button is displayed
  And the player has existing progress data
```

## Scenario: Click Reset Progress Button

```gherkin
Scenario: Initiate progress reset
  Given the player has completed some levels
  When the player clicks "Reset Progress"
  Then a confirmation modal should appear
  And the modal should display "Reset all progress?"
  And the modal should display "This cannot be undone."
  And two buttons should be visible: "Yes, Reset" and "Cancel"
  And the modal should overlay the settings screen
```

## Scenario: Cancel Progress Reset

```gherkin
Scenario: Cancel reset operation
  Given the reset confirmation modal is displayed
  When the player clicks "Cancel"
  Then the modal should close
  And no data should be deleted
  And the player should return to settings
  And progress data should remain intact
  And localStorage should still contain progress
```

## Scenario: Confirm Progress Reset

```gherkin
Scenario: Confirm and reset progress
  Given the reset confirmation modal is displayed
  When the player clicks "Yes, Reset"
  Then the following data should be removed from localStorage:
    | Key              |
    | auroraProgress   |
    | auroraScores     |
  And the following data should be preserved:
    | Key              |
    | auroraSettings   |
  And the modal should close
  And the game should navigate to the main menu
  And a success message may be displayed
```

## Scenario: Verify Progress Reset

```gherkin
Scenario: Check data after reset
  Given the player has reset their progress
  When localStorage is inspected
  Then 'auroraProgress' should not exist
  And 'auroraScores' should not exist
  And 'auroraSettings' should still exist
  And settings should contain:
    | Setting      | Value    |
    | musicVolume  | (saved)  |
    | sfxVolume    | (saved)  |
    | voiceVolume  | (saved)  |
    | difficulty   | (saved)  |
```

## Scenario: Settings Preserved After Reset

```gherkin
Scenario: Settings survive progress reset
  Given the player has set music volume to 60%
  And the player has set difficulty to "Easy"
  When the player resets progress
  And the player returns to settings
  Then the music volume should still be 60%
  And the difficulty should still be "Easy"
  And all volume sliders should show original values
```

## Feature: Settings Persistence

```gherkin
Feature: Settings Data Persistence
  As a player
  I want my settings to be saved automatically
  So that I don't lose my preferences

Background:
  Given the SettingsScene is open
  And localStorage is available
```

## Scenario: Auto-Save Settings

```gherkin
Scenario: Settings save on every change
  Given the player adjusts music volume to 65%
  Then the setting should save to localStorage immediately
  And localStorage key 'auroraSettings' should exist
  And the value should be valid JSON
  And musicVolume should equal 65
```

## Scenario: Load Settings on Scene Start

```gherkin
Scenario: Load saved settings
  Given the player previously saved settings:
    | Setting      | Value  |
    | musicVolume  | 55     |
    | sfxVolume    | 70     |
    | voiceVolume  | 85     |
    | difficulty   | hard   |
  When the SettingsScene opens
  Then all sliders should reflect saved values
  And the difficulty selector should show "Hard" highlighted
  And the UI should match localStorage data
```

## Scenario: Use Default Settings if None Exist

```gherkin
Scenario: First-time settings load
  Given no settings exist in localStorage
  When the SettingsScene opens
  Then default settings should be used:
    | Setting      | Default |
    | musicVolume  | 75      |
    | sfxVolume    | 80      |
    | voiceVolume  | 90      |
    | difficulty   | medium  |
  And the UI should display default values
```

## Scenario: Handle Missing localStorage

```gherkin
Scenario: localStorage unavailable (private mode)
  Given localStorage is blocked or unavailable
  When the player changes a setting
  Then the setting should apply to the current session
  And the game should not crash
  And a warning may be logged to console
  And settings will not persist after reload
```

## Feature: Back Button Navigation

```gherkin
Feature: Return to Main Menu
  As a player
  I want to return to the main menu
  So that I can continue using the game

Background:
  Given the SettingsScene is open
  And the "Back" button is displayed
```

## Scenario: Click Back Button

```gherkin
Scenario: Navigate back to menu
  Given the player has made changes to settings
  When the player clicks the "Back" button
  Then the game should navigate to MainMenuScene
  And all settings changes should be saved
  And the main menu should display
```

## Scenario: Settings Applied After Returning

```gherkin
Scenario: Settings take effect in game
  Given the player sets music volume to 40%
  And the player clicks Back
  When the player starts a game
  Then the music should play at 40% volume
  And the setting should be active globally
```

## Feature: UI Visual Feedback

```gherkin
Feature: Visual Feedback for Interactions
  As a player
  I want clear visual feedback
  So that I know my interactions are registered

Background:
  Given the SettingsScene is open
```

## Scenario: Slider Drag Visual Feedback

```gherkin
Scenario: Real-time slider updates
  Given the player is dragging a volume slider
  When the pointer moves
  Then the slider fill should update instantly
  And the percentage text should update instantly
  And the update rate should feel smooth (60fps)
  And the player should see immediate visual response
```

## Scenario: Button Hover Effect

```gherkin
Scenario: Buttons show hover state
  Given a button is displayed (Back, difficulty, reset)
  When the player hovers over the button
  Then the button should show a hover effect (optional)
  And the cursor should change to pointer
  And the button should feel interactive
```

## Scenario: Difficulty Button Highlight

```gherkin
Scenario: Selected difficulty is clearly visible
  Given the difficulty is set to "Medium"
  When the settings UI is displayed
  Then the Medium button should have a distinct color (green)
  And the Easy and Hard buttons should be gray
  And the selected button should be obvious at a glance
```

## Feature: Confirmation Modal Behavior

```gherkin
Feature: Reset Confirmation Modal
  As a player
  I want clear confirmation prompts
  So that I don't accidentally delete my progress

Background:
  Given the SettingsScene is open
  And the reset confirmation modal is triggered
```

## Scenario: Modal Overlay Appears

```gherkin
Scenario: Modal darkens background
  When the confirmation modal is displayed
  Then a dark overlay should cover the settings screen
  And the overlay should have alpha transparency (0.7)
  And the overlay should be 800x600 pixels (full screen)
  And the settings UI should be dimmed but visible
```

## Scenario: Modal Box Appears

```gherkin
Scenario: Modal content is centered
  When the confirmation modal is displayed
  Then a modal box should appear in the center
  And the box should be 400x200 pixels
  And the box should have a darker background than overlay
  And the box should contain the message and buttons
```

## Scenario: Modal Message is Clear

```gherkin
Scenario: Confirmation message is explicit
  When the confirmation modal is displayed
  Then the message should read "Reset all progress?"
  And the second line should read "This cannot be undone."
  And the text should be white and easily readable
  And the message should be center-aligned
```

## Scenario: Modal Buttons are Distinct

```gherkin
Scenario: Yes and Cancel buttons are clear
  When the confirmation modal is displayed
  Then the "Yes, Reset" button should be red (#ff4444)
  And the "Cancel" button should be gray (#666666)
  And both buttons should be clearly labeled
  And both buttons should show pointer cursor on hover
```

## Acceptance Criteria

### Settings Scene Creation
- [ ] SettingsScene.js file exists in src/scenes/
- [ ] Scene is registered with key 'SettingsScene'
- [ ] Scene can be navigated to from main menu
- [ ] Scene displays "Settings" title clearly
- [ ] Background is consistent with game theme

### Volume Controls
- [ ] Three sliders displayed (Music, SFX, Voice)
- [ ] Each slider shows a label (e.g., "Music")
- [ ] Each slider shows current percentage (e.g., "75%")
- [ ] Sliders can be dragged with mouse
- [ ] Sliders can be dragged with touch
- [ ] Slider fill updates in real-time during drag
- [ ] Percentage text updates in real-time during drag
- [ ] Volume changes apply immediately (no delay)
- [ ] Volume changes save to localStorage on every update
- [ ] Slider values range from 0% to 100%
- [ ] Sliders clamp values (no overflow)

### Difficulty Selection
- [ ] Three difficulty buttons displayed (Easy, Medium, Hard)
- [ ] Current difficulty is highlighted visually
- [ ] Clicking a difficulty changes the selection
- [ ] Only one difficulty is selected at a time
- [ ] Selected button has distinct color (green/bright)
- [ ] Unselected buttons are gray/dim
- [ ] Difficulty saves to localStorage on selection
- [ ] UI refreshes after selection to show change

### Reset Progress
- [ ] "Reset Progress" button displayed with warning color
- [ ] Button text is clear: "Reset Progress"
- [ ] Clicking button shows confirmation modal
- [ ] Modal has dark overlay (alpha 0.7)
- [ ] Modal box is centered (400x200)
- [ ] Modal message: "Reset all progress? This cannot be undone."
- [ ] Modal has "Yes, Reset" button (red)
- [ ] Modal has "Cancel" button (gray)
- [ ] Cancel button closes modal without action
- [ ] Yes button clears 'auroraProgress' from localStorage
- [ ] Yes button clears 'auroraScores' from localStorage
- [ ] Yes button preserves 'auroraSettings' in localStorage
- [ ] After reset, game navigates to main menu

### Settings Persistence
- [ ] All settings save to localStorage automatically
- [ ] Settings load on scene start
- [ ] Default settings used if localStorage is empty
- [ ] Settings survive page reload
- [ ] Settings survive browser close/reopen
- [ ] localStorage key is 'auroraSettings'
- [ ] Data is stored as valid JSON
- [ ] Missing localStorage is handled gracefully (no crash)

### System-Wide Application
- [ ] Music volume affects background music globally
- [ ] SFX volume affects all sound effects globally
- [ ] Voice volume affects instruction audio globally
- [ ] Difficulty setting is accessible to game scenes
- [ ] Settings apply immediately (no restart needed)

### Navigation
- [ ] Back button displayed clearly
- [ ] Back button returns to MainMenuScene
- [ ] Settings changes persist after navigating away
- [ ] No data loss when leaving settings

### Visual Quality
- [ ] All text is readable (good contrast)
- [ ] Sliders are smooth and responsive
- [ ] Buttons show hover effect (cursor change minimum)
- [ ] UI layout is clean and organized
- [ ] Spacing between elements is appropriate
- [ ] Colors are consistent with game theme

### Technical Requirements
- [ ] No console errors during normal use
- [ ] No console errors when localStorage is unavailable
- [ ] Slider drag is smooth (60fps)
- [ ] Modal animations are smooth (if applicable)
- [ ] Memory is freed when modal closes
- [ ] Touch input works identically to mouse
- [ ] Settings object structure is correct

## Edge Cases to Test

```gherkin
Scenario: Rapid Slider Adjustments
  Given the player is dragging a slider rapidly
  When the slider updates multiple times per second
  Then all updates should process smoothly
  And localStorage writes should not cause lag
  And the slider should remain responsive
  And no errors should occur

Scenario: localStorage Full or Quota Exceeded
  Given localStorage has reached quota limit
  When the player changes a setting
  Then the game should handle the error gracefully
  And the setting should apply to current session
  And a warning may be logged
  And the game should not crash

Scenario: Invalid Data in localStorage
  Given localStorage contains corrupt settings data
  When the SettingsScene loads
  Then the game should use default settings
  And invalid data should be overwritten
  And no errors should be thrown
  And the player can use settings normally

Scenario: Click Reset During Modal Display
  Given the reset confirmation modal is open
  When the player clicks outside the modal
  Then nothing should happen (optional: close modal)
  And the modal should remain visible
  Or the modal should close (design choice)

Scenario: Navigate Away During Slider Drag
  Given the player is dragging a slider
  When the player clicks Back without releasing
  Then the current slider value should save
  And navigation should complete
  And no errors should occur

Scenario: Difficulty Change During Active Game
  Given a game scene is running in background
  When the player changes difficulty in settings
  Then the change should apply to the next game
  And the current game should not be affected
  Or the current game should update (design choice)

Scenario: Multiple Slider Drags Simultaneously (Touch)
  Given the device supports multi-touch
  When the player drags multiple sliders at once
  Then each slider should update independently
  And no conflicts should occur
  And all values should save correctly

Scenario: Reset Progress with No Progress Data
  Given no progress data exists in localStorage
  When the player clicks Reset Progress and confirms
  Then no errors should occur
  And the game should navigate to menu
  And the operation should complete successfully

Scenario: localStorage Disabled After Settings Saved
  Given settings were saved to localStorage
  But localStorage is now disabled (privacy mode)
  When the player opens settings
  Then saved settings should still be loaded
  And changes should apply to current session
  And a warning may be logged

Scenario: Extreme Volume Values (0% and 100%)
  Given the player sets a volume to 0%
  When audio plays
  Then the audio should be completely silent
  And no audio errors should occur

  Given the player sets a volume to 100%
  When audio plays
  Then the audio should be at maximum volume
  And no clipping or distortion should occur
```

## Manual Testing Checklist

### Setup Phase
1. [ ] Load game in browser
2. [ ] Navigate to Settings from main menu
3. [ ] Verify settings UI loads without errors
4. [ ] Check browser console (should be clean)

### Volume Slider Testing
5. [ ] Drag music slider left (decreases)
6. [ ] Drag music slider right (increases)
7. [ ] Verify percentage updates in real-time
8. [ ] Verify slider fill updates visually
9. [ ] Play music (verify volume changes immediately)
10. [ ] Repeat for SFX slider
11. [ ] Repeat for Voice slider
12. [ ] Test dragging to 0% (silent)
13. [ ] Test dragging to 100% (max volume)

### Difficulty Selection Testing
14. [ ] Click Easy button (highlights)
15. [ ] Verify other buttons unhighlight
16. [ ] Click Medium button (highlights)
17. [ ] Click Hard button (highlights)
18. [ ] Verify only one selected at a time

### Persistence Testing
19. [ ] Change all settings (volumes + difficulty)
20. [ ] Click Back to return to menu
21. [ ] Return to Settings
22. [ ] Verify all settings retained
23. [ ] Reload page (F5)
24. [ ] Navigate to Settings
25. [ ] Verify all settings still retained
26. [ ] Open browser DevTools → Application → localStorage
27. [ ] Verify 'auroraSettings' key exists
28. [ ] Verify data is valid JSON

### Reset Progress Testing
29. [ ] Click "Reset Progress" button
30. [ ] Verify confirmation modal appears
31. [ ] Verify overlay darkens screen
32. [ ] Verify message is clear
33. [ ] Click "Cancel"
34. [ ] Verify modal closes
35. [ ] Verify progress data intact (check localStorage)
36. [ ] Click "Reset Progress" again
37. [ ] Click "Yes, Reset"
38. [ ] Verify modal closes
39. [ ] Verify navigation to main menu
40. [ ] Check localStorage
41. [ ] Verify 'auroraProgress' removed
42. [ ] Verify 'auroraScores' removed
43. [ ] Verify 'auroraSettings' still exists

### Settings Application Testing
44. [ ] Set music to 50%
45. [ ] Start a game scene
46. [ ] Verify music plays at 50%
47. [ ] Return to settings, set SFX to 30%
48. [ ] Trigger a sound effect in game
49. [ ] Verify SFX plays at 30%
50. [ ] Set difficulty to Easy
51. [ ] Start a game
52. [ ] Verify game uses easy parameters

### Visual Feedback Testing
53. [ ] Drag sliders (should be smooth, no jank)
54. [ ] Hover over buttons (cursor should change)
55. [ ] Check difficulty highlighting (clear contrast)
56. [ ] Check modal overlay (should darken background)
57. [ ] Check all text is readable

### Touch Device Testing
58. [ ] Test on tablet or phone
59. [ ] Tap and drag sliders (should work)
60. [ ] Tap difficulty buttons (should work)
61. [ ] Tap Reset button (should work)
62. [ ] Tap modal buttons (should work)
63. [ ] Verify touch input identical to mouse

### Edge Case Testing
64. [ ] Rapidly drag slider back and forth
65. [ ] Change settings and immediately navigate away
66. [ ] Test with no localStorage (privacy mode)
67. [ ] Test with corrupt localStorage data
68. [ ] Set volumes to 0% and 100%
69. [ ] Click outside modal (does it close?)

### Error Testing
70. [ ] Check console throughout all tests
71. [ ] Verify no errors logged
72. [ ] Verify no warnings (except localStorage if unavailable)

## Success Criteria

**This phase is complete when:**

### Functional Completeness
1. Settings scene accessible from main menu
2. Three volume sliders functional (Music, SFX, Voice)
3. Volume changes apply immediately
4. Difficulty selector functional (Easy, Medium, Hard)
5. Reset Progress with confirmation modal works
6. Progress data clears, settings data preserved
7. All settings persist in localStorage
8. Settings load correctly on scene start
9. Back button returns to main menu

### Data Persistence
10. Settings survive page reload
11. Settings survive browser close/reopen
12. Default settings used if none exist
13. localStorage corruption handled gracefully
14. Reset clears only progress, not settings

### System Integration
15. Music volume affects background music globally
16. SFX volume affects sound effects globally
17. Voice volume affects instruction audio globally
18. Difficulty setting accessible to game scenes

### Quality Metrics
19. Zero console errors during normal use
20. Slider drag is smooth (60fps)
21. All text is readable (good contrast)
22. Touch and mouse input both work
23. Modal overlay and buttons are clear
24. Confirmation modal prevents accidents

### Testing Completeness
25. All volume sliders tested (0%, 50%, 100%)
26. All difficulty levels tested
27. Reset progress tested (cancel and confirm)
28. Persistence tested (reload, revisit)
29. Settings application tested in game
30. Edge cases tested (rapid changes, no localStorage)

### Ready for Phase 21
31. UI is functional and stable
32. Code is clean and organized
33. No known bugs
34. Ready for responsive design adjustments

## Notes

**Core Functionality**
- Settings provide control over audio and difficulty
- All changes save automatically (no Apply button)
- Changes take effect immediately
- Settings persist between sessions

**What We're Testing**
- Volume slider interactions (drag, update, save)
- Difficulty selection (button clicks, highlighting)
- Reset progress with confirmation
- localStorage persistence (save, load, reset)
- System-wide settings application
- UI responsiveness and visual feedback

**What We're NOT Testing Yet**
- Responsive design for mobile (Phase 21)
- Advanced UI animations (nice-to-have)
- Settings export/import (future feature)
- Detailed difficulty parameter tuning
- Accessibility features (future enhancement)

**Critical Success Factors**
1. **Immediate feedback**: Volume changes heard instantly
2. **Auto-save**: No "Apply" button needed, saves automatically
3. **Confirmation**: Reset has clear confirmation to prevent accidents
4. **Persistence**: Settings survive reload and close
5. **Separation**: Reset clears progress but preserves settings
6. **Clarity**: UI is clear, labels are explicit, feedback is obvious

This phase establishes player control over their experience. Parents can adjust volumes for their environment, players can choose appropriate difficulty, and progress can be reset when needed. The settings system must be reliable and intuitive - players should never lose their preferences unexpectedly.
