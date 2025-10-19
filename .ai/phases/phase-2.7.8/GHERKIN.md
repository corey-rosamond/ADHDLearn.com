# Phase 2.7.8: Letter Pop Game - BDD Acceptance Criteria

## Overview

This document contains Behavior-Driven Development (BDD) scenarios in Gherkin syntax for the Letter Pop game implementation. These scenarios define the expected behavior from Aurora's perspective.

---

## Feature 1: Game Screen Display

### Scenario 1.1: Initial screen render
```gherkin
Feature: Letter Pop Game Screen Display
  As Aurora
  I want to see a colorful game screen
  So that I can start learning letters

Scenario: Game screen loads successfully
  Given I am on the Main Menu
  When I navigate to Letter Pop Menu
  And I click "START GAME"
  Then I should see a purple-to-pink gradient background
  And I should see the title "LETTER POP" at the top
  And I should see a balloon icon above the title
  And I should see "SCORE" label with "0" value
  And I should see "ROUND 1" in the top-left
  And I should see a timer bar below the header
  And I should see a home button in the top-right
  And I should see 6 floating bubbles with letters
```

### Scenario 1.2: Title fade-out after game starts
```gherkin
Scenario: Title fades out after 1 second
  Given the game screen has just loaded
  And the title "LETTER POP" is visible
  When 1 second has passed
  Then the title should start fading out
  And the balloon icon should start fading out
  And after 0.8 seconds the title should be invisible
  And the gameplay area should be fully visible
```

---

## Feature 2: Bubble Display and Physics

### Scenario 2.1: Bubbles spawn correctly
```gherkin
Feature: Bubble Spawning and Display
  As Aurora
  I want to see bubbles with letters
  So that I can click on them

Scenario: Six bubbles spawn with different letters
  Given the game has started
  And a target letter has been selected
  When bubbles are spawned
  Then I should see exactly 6 bubbles
  And one bubble should contain the target letter
  And the other 5 bubbles should contain different letters
  And no two bubbles should have the same letter (case-insensitive)
  And all bubble letters should be clearly visible
```

### Scenario 2.2: Bubbles float with physics
```gherkin
Scenario: Bubbles move and bounce
  Given 6 bubbles are on screen
  When the game is running
  Then bubbles should float in different directions
  And bubbles should bounce off the left wall
  And bubbles should bounce off the right wall
  And bubbles should bounce off the top wall
  And bubbles should bounce off the bottom (header area)
  And bubbles should bounce off each other
  And bubble movement should be smooth and continuous
```

### Scenario 2.3: Bubble collision effects
```gherkin
Scenario: Bubbles show smoosh animation on collision
  Given two bubbles are floating toward each other
  When the bubbles collide
  Then both bubbles should show a smoosh animation
  And I should hear a gentle bubble sound
  And both bubbles should bounce apart
  And the smoosh animation should last approximately 120ms
```

---

## Feature 3: Target Letter and Audio

### Scenario 3.1: Target letter voice plays
```gherkin
Feature: Target Letter Audio Playback
  As Aurora
  I want to hear the target letter
  So that I know which letter to find

Scenario: Letter audio plays at start of each round
  Given a new letter round has started
  And the target letter is "B"
  When the bubbles spawn
  Then I should hear the voice say "B"
  And the audio should be clear and child-friendly
  And the audio volume should respect master and voice settings
```

### Scenario 3.2: Audio plays for each new letter
```gherkin
Scenario: Audio plays for all 10 letters
  Given I am playing a full round of Letter Pop
  When I advance through all 10 letters
  Then I should hear the target letter voice 10 times
  And each voice should match the current target letter
```

---

## Feature 4: Correct Answer Handling

### Scenario 4.1: Clicking correct bubble
```gherkin
Feature: Correct Answer Feedback
  As Aurora
  I want immediate feedback when I click the right letter
  So that I know I did well

Scenario: Click bubble with correct letter
  Given the target letter is "C"
  And I see a bubble with the letter "C"
  When I click on the "C" bubble
  Then I should hear a success sound immediately
  And the bubble should pop with animation
  And my score should increase from 0 to 1
  And the round counter should advance from "ROUND 1" to "ROUND 2"
  And new bubbles should spawn
  And the timer should reset to full
  And I should hear the next target letter
```

### Scenario 4.2: Score increments correctly
```gherkin
Scenario: Score increases with each correct answer
  Given I am on letter 1 with score 0
  When I click the correct bubble
  Then my score should show 1
  When I click the correct bubble on letter 2
  Then my score should show 2
  When I click the correct bubble on letter 3
  Then my score should show 3
```

### Scenario 4.3: Round progression
```gherkin
Scenario: Round advances through all 10 letters
  Given I am playing Letter Pop
  When I correctly answer letter 1
  Then I should see "ROUND 2"
  When I correctly answer letter 2
  Then I should see "ROUND 3"
  When I correctly answer all 10 letters
  Then the round should complete
  And I should see the results or return to menu
```

---

## Feature 5: Incorrect Answer Handling (Non-Punitive)

### Scenario 5.1: Clicking incorrect bubble
```gherkin
Feature: Gentle Incorrect Answer Feedback
  As Aurora
  I want gentle feedback when I click the wrong letter
  So that I can try again without feeling bad

Scenario: Click bubble with wrong letter
  Given the target letter is "D"
  And I see a bubble with the letter "M"
  When I click on the "M" bubble
  Then I should hear a gentle "try again" sound
  And the sound should be quiet (30% volume)
  And the bubble should wobble slightly
  And the bubble should NOT disappear
  And my score should NOT decrease
  And I should be able to click another bubble
  And the timer should continue counting down
```

### Scenario 5.2: Multiple incorrect attempts allowed
```gherkin
Scenario: Can try again after incorrect click
  Given the target letter is "E"
  When I click a bubble with "F" (incorrect)
  Then I should get gentle feedback
  When I click a bubble with "G" (incorrect)
  Then I should get gentle feedback again
  When I click the bubble with "E" (correct)
  Then I should hear success sound
  And the round should advance
```

---

## Feature 6: Timer Countdown

### Scenario 6.1: Timer displays and counts down
```gherkin
Feature: Timer Countdown Display
  As Aurora
  I want to see how much time I have left
  So that I can learn at a comfortable pace

Scenario: Timer bar shows time remaining
  Given a new letter round has started
  And the time limit is 10 seconds
  Then the timer bar should show 100% (full)
  And the timer bar should be green
  When 3 seconds pass
  Then the timer bar should show approximately 70%
  And the timer bar should still be green
  When 5 more seconds pass (8 total)
  Then the timer bar should show approximately 20%
  And the timer bar should be red
```

### Scenario 6.2: Timer color changes
```gherkin
Scenario: Timer bar changes color based on time
  Given the time limit is 10 seconds
  When time remaining is 7 seconds (70%)
  Then the timer bar should be green
  When time remaining is 5 seconds (50%)
  Then the timer bar should be yellow
  When time remaining is 2 seconds (20%)
  Then the timer bar should be red
```

### Scenario 6.3: Timer expiration (non-punitive)
```gherkin
Scenario: Time runs out without penalty
  Given the target letter is "F"
  And the timer is at 1 second
  When the timer reaches 0
  Then the game should NOT penalize me
  And my score should NOT decrease
  And the game should advance to the next letter
  And new bubbles should spawn
  And I should hear the next target letter voice
  And the timer should reset to full
```

---

## Feature 7: Home Button Navigation

### Scenario 7.1: Home button functionality
```gherkin
Feature: Home Button Navigation
  As Aurora (or parent)
  I want to be able to exit the game
  So that I can return to the main menu

Scenario: Click home button during game
  Given I am playing Letter Pop
  And I see the home button in the top-right
  When I click the home button
  Then I should hear a click sound
  And the screen should fade to black (0.3s)
  And I should return to the Main Menu
  And my game progress should be lost (expected behavior)
```

---

## Feature 8: Settings Integration

### Scenario 8.1: Time limit setting applied
```gherkin
Feature: Game Settings Integration
  As a parent
  I want the game to respect my time settings
  So that I can control the difficulty

Scenario: Game uses custom time limit
  Given I am on the Letter Pop Menu
  When I set the time limit to 5 seconds
  And I click "START GAME"
  Then each letter should have a 5-second timer
  And the timer bar should complete in 5 seconds

Scenario: Game uses extended time limit
  Given I am on the Letter Pop Menu
  When I set the time limit to 15 seconds
  And I click "START GAME"
  Then each letter should have a 15-second timer
  And the timer bar should complete in 15 seconds
```

### Scenario 8.2: Letter case setting applied
```gherkin
Scenario: Game uses uppercase letters
  Given I am on the Letter Pop Menu
  And letter case is set to "Uppercase"
  When I start the game
  Then all bubbles should show uppercase letters (A, B, C...)
  And the target letter should be uppercase

Scenario: Game uses lowercase letters
  Given I am on the Letter Pop Menu
  And letter case is set to "Lowercase"
  When I start the game
  Then all bubbles should show lowercase letters (a, b, c...)
  And the target letter should be lowercase

Scenario: Game uses mixed case letters
  Given I am on the Letter Pop Menu
  And letter case is set to "Mixed"
  When I start the game
  Then bubbles should show a mix of uppercase and lowercase
  And some letters may be uppercase (A, C, E...)
  And some letters may be lowercase (b, d, f...)
```

---

## Feature 9: Round Completion

### Scenario 9.1: Complete all 10 letters
```gherkin
Feature: Round Completion
  As Aurora
  I want to know when I finish all letters
  So that I can see how well I did

Scenario: Successfully complete all 10 letters
  Given I am playing Letter Pop
  When I correctly answer all 10 letters
  Then I should hear a celebration sound
  And I should see my final score (0-10)
  And the game should show results or return to menu
```

### Scenario 9.2: Partial completion
```gherkin
Scenario: Complete round with some timeouts
  Given I am playing Letter Pop
  When I correctly answer 7 letters
  And I let 3 letters time out
  Then the round should still complete after 10 letters
  And my final score should be 7
```

---

## Feature 10: Performance and Responsiveness

### Scenario 10.1: Smooth gameplay at 60 FPS
```gherkin
Feature: Performance Requirements
  As Aurora
  I want the game to run smoothly
  So that it's fun to play

Scenario: Game maintains 60 FPS
  Given I am playing Letter Pop
  And all 6 bubbles are bouncing
  And the timer is counting down
  When I monitor the frame rate
  Then the game should maintain 60 FPS
  And there should be no lag or stuttering
  And animations should be smooth
```

### Scenario 10.2: Touch responsiveness
```gherkin
Scenario: Bubbles respond immediately to touch
  Given I see a bubble on screen
  When I touch the bubble
  Then the game should register the click within 50ms
  And I should hear immediate audio feedback
  And the visual response should be instant
```

---

## Feature 11: Responsive Layout

### Scenario 11.1: Layout on Galaxy Tab S7 FE
```gherkin
Feature: Responsive Layout
  As Aurora using a tablet
  I want the game to look good on my screen
  So that everything is easy to see and touch

Scenario: Correct layout on 2560x1600 tablet
  Given I am using a Galaxy Tab S7 FE (2560x1600)
  When I load the Letter Pop game
  Then the header should occupy approximately 12% of screen height
  And bubbles should have readable letters (not too small)
  And the home button should be easily tappable (at least 100px)
  And the timer bar should span most of the screen width
  And no UI elements should overlap
  And all text should be crisp and clear
```

---

## Feature 12: Memory Management

### Scenario 12.1: No memory leaks during gameplay
```gherkin
Feature: Memory Management
  As a developer
  I want proper memory management
  So that the game runs reliably

Scenario: Bubbles properly disposed
  Given I complete letter 1
  When new bubbles spawn for letter 2
  Then old bubbles should be disposed
  And their resources should be freed
  And memory usage should remain stable

Scenario: Screen cleanup on exit
  Given I am playing Letter Pop
  When I click the home button
  Then all bubbles should be disposed
  And the ShapeRenderer should be disposed
  And no memory leaks should occur
```

---

## Manual Testing Checklist

### Pre-Testing Setup
- [ ] Build APK: `./gradlew android:assembleDebug`
- [ ] Copy APK: `cp android/build/outputs/apk/debug/android-debug.apk ReadingAdventure.apk`
- [ ] Start emulator: `$ANDROID_HOME/emulator/emulator -avd Galaxy_Tab_S7_FE -gpu swiftshader_indirect -no-snapshot-save &`
- [ ] Install APK: `$ANDROID_HOME/platform-tools/adb install -r ReadingAdventure.apk`
- [ ] Launch app: `$ANDROID_HOME/platform-tools/adb shell am start -n com.aurora.reading/com.aurora.reading.AndroidLauncher`

### Visual Testing

#### Test 1: Screen Rendering
- [ ] Navigate: Main Menu → Letter Pop Menu → START GAME
- [ ] Screenshot: `$ANDROID_HOME/platform-tools/adb shell screencap -p /sdcard/letterpop-game-initial.png`
- [ ] Pull: `$ANDROID_HOME/platform-tools/adb pull /sdcard/letterpop-game-initial.png test/screenshots/phase-2.7.8-initial.png`
- [ ] Verify: Purple-to-pink gradient background
- [ ] Verify: "LETTER POP" title at top (initially)
- [ ] Verify: Balloon icon at top
- [ ] Verify: Score showing "0"
- [ ] Verify: Round showing "ROUND 1"
- [ ] Verify: Timer bar at 100% (green)
- [ ] Verify: Home button visible
- [ ] Verify: 6 bubbles with letters
- [ ] Verify: All text is crisp and readable

#### Test 2: Title Fade-Out
- [ ] Wait 1 second after game starts
- [ ] Observe title beginning to fade
- [ ] Wait 0.8 seconds more
- [ ] Verify title is invisible
- [ ] Screenshot: `test/screenshots/phase-2.7.8-title-faded.png`

#### Test 3: Bubble Physics
- [ ] Observe bubbles floating
- [ ] Verify bubbles bounce off left wall
- [ ] Verify bubbles bounce off right wall
- [ ] Verify bubbles bounce off top
- [ ] Verify bubbles bounce off bottom (header area)
- [ ] Verify bubbles bounce off each other
- [ ] Verify smoosh animation on collision
- [ ] Listen for bubble collision sound
- [ ] Screenshot: `test/screenshots/phase-2.7.8-bubbles-bouncing.png`

### Interaction Testing

#### Test 4: Correct Answer
- [ ] Identify target letter (listen for voice)
- [ ] Tap bubble with target letter
- [ ] Verify: Success sound plays immediately
- [ ] Verify: Bubble pops with animation
- [ ] Verify: Score increments (0 → 1)
- [ ] Verify: Round advances (ROUND 1 → ROUND 2)
- [ ] Verify: New bubbles spawn
- [ ] Verify: Timer resets to 100%
- [ ] Verify: New target letter voice plays
- [ ] Screenshot: `test/screenshots/phase-2.7.8-correct-answer.png`

#### Test 5: Incorrect Answer
- [ ] Identify target letter
- [ ] Tap bubble with WRONG letter
- [ ] Verify: Gentle "try again" sound (quiet)
- [ ] Verify: Bubble wobbles slightly
- [ ] Verify: Bubble does NOT disappear
- [ ] Verify: Score does NOT change
- [ ] Verify: Timer continues counting down
- [ ] Tap correct bubble
- [ ] Verify: Success as in Test 4
- [ ] Screenshot: `test/screenshots/phase-2.7.8-incorrect-answer.png`

#### Test 6: Timer Countdown
- [ ] Observe timer bar at start (100%, green)
- [ ] Wait 3 seconds
- [ ] Verify: Timer at approximately 70%, still green
- [ ] Wait until approximately 5 seconds remaining
- [ ] Verify: Timer bar turns yellow
- [ ] Wait until approximately 2 seconds remaining
- [ ] Verify: Timer bar turns red
- [ ] Screenshot: `test/screenshots/phase-2.7.8-timer-countdown.png`

#### Test 7: Timer Expiration
- [ ] Wait for timer to reach 0 without clicking
- [ ] Verify: No penalty (score unchanged)
- [ ] Verify: Game advances to next letter
- [ ] Verify: New bubbles spawn
- [ ] Verify: Timer resets
- [ ] Verify: New target letter voice plays
- [ ] Screenshot: `test/screenshots/phase-2.7.8-timer-expired.png`

### Settings Integration Testing

#### Test 8: Time Limit Setting
- [ ] Navigate to Letter Pop Menu
- [ ] Set time limit to 5 seconds
- [ ] Start game
- [ ] Verify: Timer completes in 5 seconds
- [ ] Screenshot: `test/screenshots/phase-2.7.8-5sec-timer.png`
- [ ] Return to menu
- [ ] Set time limit to 15 seconds
- [ ] Start game
- [ ] Verify: Timer completes in 15 seconds
- [ ] Screenshot: `test/screenshots/phase-2.7.8-15sec-timer.png`

#### Test 9: Letter Case Setting
- [ ] Navigate to Letter Pop Menu
- [ ] Set letter case to "Uppercase"
- [ ] Start game
- [ ] Verify: All letters are uppercase (A, B, C...)
- [ ] Screenshot: `test/screenshots/phase-2.7.8-uppercase.png`
- [ ] Return to menu
- [ ] Set letter case to "Lowercase"
- [ ] Start game
- [ ] Verify: All letters are lowercase (a, b, c...)
- [ ] Screenshot: `test/screenshots/phase-2.7.8-lowercase.png`
- [ ] Return to menu
- [ ] Set letter case to "Mixed"
- [ ] Start game
- [ ] Verify: Mix of uppercase and lowercase
- [ ] Screenshot: `test/screenshots/phase-2.7.8-mixed-case.png`

### Full Round Testing

#### Test 10: Complete 10 Letters
- [ ] Start new game
- [ ] Correctly answer all 10 letters
- [ ] Verify: Score shows 10
- [ ] Verify: Round counter reaches "ROUND 10"
- [ ] Verify: Celebration sound plays
- [ ] Verify: Game completes (results or menu)
- [ ] Screenshot: `test/screenshots/phase-2.7.8-round-complete.png`

#### Test 11: Partial Completion
- [ ] Start new game
- [ ] Correctly answer 5 letters
- [ ] Let 5 letters time out
- [ ] Verify: Final score shows 5
- [ ] Verify: Game completes after 10 letters
- [ ] Screenshot: `test/screenshots/phase-2.7.8-partial-complete.png`

### Navigation Testing

#### Test 12: Home Button
- [ ] During gameplay, tap home button
- [ ] Verify: Click sound plays
- [ ] Verify: Screen fades to black (0.3s)
- [ ] Verify: Returns to Main Menu
- [ ] Screenshot before fade: `test/screenshots/phase-2.7.8-home-button.png`

### Performance Testing

#### Test 13: Frame Rate
- [ ] During gameplay, check logcat for FPS
- [ ] Command: `$ANDROID_HOME/platform-tools/adb logcat -d | grep FPS`
- [ ] Verify: Consistent 60 FPS
- [ ] Verify: No lag or stuttering
- [ ] Verify: Smooth bubble animations

#### Test 14: Memory Stability
- [ ] Play through multiple rounds
- [ ] Check memory usage in logcat
- [ ] Verify: No increasing memory trend
- [ ] Verify: Bubbles properly disposed between letters
- [ ] Verify: No crashes or freezes

### Audio Testing

#### Test 15: Audio Playback
- [ ] Verify: Target letter voice plays clearly
- [ ] Verify: Success sound plays on correct answer
- [ ] Verify: Gentle sound plays on incorrect answer
- [ ] Verify: Collision sounds play when bubbles bounce
- [ ] Verify: Celebration sound plays on round complete
- [ ] Verify: All audio respects volume settings (master, voice, sound)

### Edge Case Testing

#### Test 16: Rapid Clicking
- [ ] Rapidly tap bubbles
- [ ] Verify: No crashes
- [ ] Verify: Only one click registered per bubble
- [ ] Verify: No audio overlap issues

#### Test 17: Rapid Navigation
- [ ] Start game
- [ ] Immediately tap home button
- [ ] Verify: Clean exit
- [ ] Verify: No crashes

#### Test 18: Multiple Incorrect Attempts
- [ ] Click wrong bubble 5 times in a row
- [ ] Verify: Gentle feedback each time
- [ ] Verify: No cumulative penalty
- [ ] Verify: Can still click correct bubble

---

## Acceptance Criteria Summary

### Must Have (Phase 2.7.8 Complete)
- ✅ Game screen renders with gradient, UI, and 6 bubbles
- ✅ Bubbles float with physics (bouncing off walls and each other)
- ✅ Target letter voice plays at start of each letter
- ✅ Correct answer: success sound, pop animation, score +1, next letter
- ✅ Incorrect answer: gentle feedback, no penalty, bubble stays
- ✅ Timer counts down with color-coded visual bar
- ✅ Timer expiration: non-punitive, advance to next letter
- ✅ Round progression: 10 letters, score tracking
- ✅ Settings integration: time limit and letter case applied
- ✅ Home button: returns to Main Menu with fade-out
- ✅ Performance: 60 FPS, no lag, responsive touch
- ✅ Responsive layout for 2560x1600
- ✅ No memory leaks

### Nice to Have (Future Enhancements)
- ⏳ Particle effects on bubble pop
- ⏳ More elaborate celebration animation on round complete
- ⏳ Persistent high scores
- ⏳ Difficulty levels (bubble speed, count)
- ⏳ Power-ups or bonuses

### Out of Scope (Phase 2.7.9)
- Results screen with detailed stats
- Stars/achievements system
- Progress tracking across sessions

---

**Created:** Phase 2.7.8 Planning
**Testing Target:** Samsung Galaxy Tab S7 FE (2560x1600)
**Framework:** Kotlin + libGDX
