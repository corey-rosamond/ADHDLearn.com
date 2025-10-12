# Phase 42: Session Timer & Breaks - BDD Scenarios

## Feature: Session Timer & Break Management

```gherkin
Feature: Session Timer & Break Reminders
  As a parent
  I want healthy play session management with timers and break reminders
  So that Aurora develops good gaming habits and takes regular breaks

  As Aurora playing the game
  I want gentle reminders without harsh interruptions
  So that I can enjoy playing while staying healthy

Background:
  Given the game is loaded
  And SessionTimerManager is implemented
  And BreakReminderScene is available
  And timer configuration is set to defaults
```

## Scenario: Initialize Session Timer

```gherkin
Scenario: Start timer when game session begins
  Given I am starting a new game session
  And timer is enabled in settings
  When GameSessionScene initializes
  Then a SessionTimerManager should be created
  And the timer should start tracking elapsed time
  And the timer display should appear in the corner
  And the start time should be recorded
  And elapsed time should be 0
```

## Scenario: Display Timer During Gameplay

```gherkin
Scenario: Show elapsed time in corner of screen
  Given the session timer is running
  And timer display is enabled
  When the game is being played
  Then a timer should be visible in the top-left corner
  And it should show elapsed time in format "M:SS"
  And it should update every second
  And the display should be:
    | Property         | Value        |
    | Font Size        | 18px         |
    | Color            | #888888      |
    | Background       | Semi-transparent |
    | Alpha            | 0.6          |
    | Position         | (16, 16)     |
  And the timer should not distract from gameplay
```

## Scenario: Timer Updates Every Second

```gherkin
Scenario: Accurate time tracking
  Given the timer started at 0:00
  When 1 second passes
  Then the timer should show "0:01"
  When 60 seconds pass
  Then the timer should show "1:00"
  When 5 minutes 23 seconds pass
  Then the timer should show "5:23"
  And the time should be accurate to the second
```

## Scenario: Show 2-Minute Warning

```gherkin
Scenario: Display gentle warning before break reminder
  Given the timer has been running for 8 minutes
  And the 2-minute warning has not been shown yet
  When the timer reaches 8:00
  Then a warning message should appear
  And the message should say "2 minutes until break time!"
  And the message should be displayed:
    | Property         | Value              |
    | Font Size        | 24px               |
    | Color            | #FFD700 (gold)     |
    | Position         | Top center         |
    | Background       | Semi-transparent   |
  And a gentle notification sound should play
  And the message should fade out after 3 seconds
  And the timer display should change color to orange
```

## Scenario: Trigger Break Reminder at 10 Minutes

```gherkin
Scenario: Show break screen when timer reaches limit
  Given the timer has been running for 10 minutes
  When the elapsed time reaches 10:00
  Then the timer should pause
  And the current game scene should pause
  And the BreakReminderScene should launch
  And Aurora character should appear with friendly animation
  And a break reminder message should display
```

## Scenario: Display Break Reminder Screen

```gherkin
Scenario: Show friendly break reminder with options
  Given the break reminder is triggered
  When the BreakReminderScene appears
  Then I should see:
    | Element              | Content                                    |
    | Semi-transparent overlay | 85% opacity                            |
    | Aurora character     | Waving animation                           |
    | Main message         | "You've been playing for 10 minutes!"     |
    | Suggestions          | "Time to stretch, get water, or rest..."  |
    | Keep Playing button  | Green, left side                          |
    | All Done button      | Orange, right side                        |
  And a gentle 'breakReminder' sound should play
  And the screen should feel supportive, not punishing
```

## Scenario: Choose "Keep Playing" Option

```gherkin
Scenario: Extend play time by 5 minutes
  Given the break reminder screen is showing
  And "Keep Playing" button is available
  When I click "Keep Playing"
  Then a button click sound should play
  And the timer should extend by 5 minutes
  And the new duration should be 15 minutes
  And the break reminder scene should close
  And the game scene should resume
  And the timer should continue from 10:00
  And extensionsUsed should increase by 1
  And the 2-minute warning should reset
```

## Scenario: Choose "All Done" Option

```gherkin
Scenario: End session gracefully
  Given the break reminder screen is showing
  When I click "All Done"
  Then a button click sound should play
  And the timer should stop
  And the break reminder scene should close
  And the session should end
  And the session results should be calculated
  And I should see the results screen or main menu
  And all progress should be saved
```

## Scenario: Multiple Timer Extensions

```gherkin
Scenario: Continue playing through multiple extensions
  Given I started playing at 0:00
  When the timer reaches 10:00
  Then I see the break reminder
  When I click "Keep Playing"
  Then the timer extends to 15:00

  When the timer reaches 15:00
  Then I see the break reminder again
  When I click "Keep Playing"
  Then the timer extends to 20:00

  When the timer reaches 20:00
  Then I see the break reminder again
  And extensionsUsed should be 2
  And I can continue extending if desired
```

## Scenario: Button Hover Effects

```gherkin
Scenario: Provide visual feedback on button hover
  Given the break reminder screen is showing
  When I hover over the "Keep Playing" button
  Then the button should scale up to 1.05
  And the animation should take 150ms
  When I move my mouse away
  Then the button should scale back to 1.0
  And the animation should take 150ms
```

## Scenario: Timer Persists Across Scenes

```gherkin
Scenario: Maintain timer through game transitions
  Given the timer is running in GameSessionScene
  And elapsed time is 5:30
  When the session transitions to a mini-game
  Then the timer should continue running
  And the timer display should remain visible
  When the mini-game completes
  And the session transitions back
  Then the elapsed time should still be accurate
  And no time should be lost during transitions
```

## Scenario: Pause Timer During Break Reminder

```gherkin
Scenario: Stop counting time while user decides
  Given the timer reaches 10:00
  And the break reminder appears
  When the user takes 2 minutes to decide
  Then the timer should remain at 10:00
  And no additional time should accumulate
  When the user clicks "Keep Playing"
  Then the timer should resume counting
  And should continue from 10:00
```

## Scenario: Parent Configuration - Disable Timer

```gherkin
Scenario: Respect parent setting to disable timer
  Given the parent has set timer.enabled = false
  When a game session starts
  Then the SessionTimerManager should not start
  And no timer display should appear
  And no break reminders should be shown
  And the game should play indefinitely
```

## Scenario: Parent Configuration - Custom Duration

```gherkin
Scenario Outline: Use parent-configured session length
  Given the parent has set timer.duration = <duration>
  When a game session starts
  Then the break reminder should appear at <duration>
  And the warning should appear at <warningTime>

  Examples:
    | duration    | warningTime |
    | 300000      | 180000      | # 5 minutes (3 min warning)
    | 600000      | 480000      | # 10 minutes (8 min warning)
    | 900000      | 720000      | # 15 minutes (12 min warning)
    | 1200000     | 960000      | # 20 minutes (16 min warning)
```

## Scenario: Parent Configuration - Enforce Breaks

```gherkin
Scenario: No "Keep Playing" option when breaks enforced
  Given the parent has set timer.enforceBreak = true
  When the break reminder appears
  Then I should only see the "All Done" button
  And the "Keep Playing" button should not be visible
  And the extension info should not appear
  And clicking "All Done" should be the only option
  And the session should end when clicked
```

## Scenario: Parent Configuration - Custom Extension Time

```gherkin
Scenario: Use custom extension duration
  Given the parent has set timer.extensionTime = 600000 (10 min)
  When I click "Keep Playing" at 10:00
  Then the timer should extend by 10 minutes
  And the new duration should be 20:00
  And the extension info should show "(10 more minutes)"
```

## Scenario: Timer Display Options - Elapsed Time

```gherkin
Scenario: Show time elapsed since start
  Given timer display mode is "elapsed"
  And I've been playing for 3 minutes 45 seconds
  Then the timer should show "3:45"
  And the format should be minutes:seconds
  And single-digit seconds should be zero-padded
```

## Scenario: Timer Display Options - Remaining Time

```gherkin
Scenario: Show time remaining until break
  Given timer display mode is "remaining"
  And the session duration is 10:00
  And I've been playing for 3:45
  Then the timer should show "-6:15"
  And it should count down toward 0:00
  When the remaining time is 2:00
  Then the color should change to yellow/orange
```

## Scenario: Timer Display Options - Minimal

```gherkin
Scenario: Show colored indicator instead of time
  Given timer display mode is "minimal"
  And I've been playing for 3 minutes
  Then the timer should show "●"
  And the color should be green (#4CAF50)
  When I've been playing for 7 minutes
  Then the color should change to yellow (#FFD700)
  When I've been playing for 9 minutes
  Then the color should change to orange (#FF9800)
```

## Scenario: Hide Timer Display

```gherkin
Scenario: Timer runs but display is hidden
  Given the parent has set timer.showTimer = false
  When a game session starts
  Then the timer should track time internally
  But no visual timer display should appear
  And the break reminder should still appear at 10:00
  And the warning should still appear at 8:00
```

## Scenario: Timer Color Changes

```gherkin
Scenario: Visual feedback as time progresses
  Given the timer display is visible
  When elapsed time is less than 8:00
  Then the timer color should be #888888 (gray)
  When elapsed time reaches 8:00
  Then the timer color should change to #CC8800 (orange)
  And the color change should be noticeable but gentle
```

## Scenario: Gentle Notification Sound

```gherkin
Scenario: Play non-alarming audio for notifications
  Given the 2-minute warning is triggered
  When the notification appears
  Then the 'gentleNotification' sound should play
  And the sound should be soft and pleasant
  And the sound should not be jarring or alarm-like
  And if the sound fails to load, it should fail silently
```

## Scenario: Break Reminder Audio

```gherkin
Scenario: Play friendly sound for break screen
  Given the break reminder screen appears
  When the scene is created
  Then the 'breakReminder' sound should play
  And the sound should be friendly and supportive
  And the sound should not sound like an alarm
  And the volume should be moderate
```

## Scenario: Aurora Character Animation

```gherkin
Scenario: Show welcoming character on break screen
  Given the break reminder appears
  When the scene loads
  Then an Aurora character sprite should appear
  And the sprite should play a 'wave' animation
  And the animation should be friendly and welcoming
  And the character should be prominently displayed
  And the character should feel supportive, not scolding
```

## Scenario: Break Suggestion Messages

```gherkin
Scenario: Provide helpful break activity suggestions
  Given the break reminder is showing
  Then I should see suggestions like:
    | Suggestion                        |
    | Time to stretch                   |
    | Get some water                    |
    | Rest your eyes for a moment       |
  And the suggestions should be positive
  And the tone should be caring, not bossy
  And multiple suggestions should be combined in one message
```

## Scenario: Extension Information Display

```gherkin
Scenario: Show extension details below button
  Given the break reminder shows "Keep Playing" button
  When I look below the button
  Then I should see "(5 more minutes)"
  And the text should be in smaller font (14px)
  And the text should be light gray (#CCCCCC)
  And it should clearly indicate how much time will be added
```

## Scenario: Total Play Time Tracking

```gherkin
Scenario: Track cumulative time including extensions
  Given I played for 10 minutes
  And extended for 5 minutes (15 total)
  And extended again for 5 minutes (20 total)
  When I click "All Done"
  Then the total play time should be 20 minutes
  And sessionResults.timeSpent should be 1200000ms
  And extensionsUsed should be 2
  And this data should be saved in session results
```

## Scenario: Timer State Management

```gherkin
Scenario: Properly manage timer lifecycle
  Given a timer is created for GameSessionScene
  When the timer is initialized
  Then the state should be:
    | Property       | Value    |
    | startTime      | Not null |
    | elapsedTime    | 0        |
    | isPaused       | false    |
    | hasShownWarning| false    |
    | extensionsUsed | 0        |
  When the timer is paused
  Then isPaused should be true
  When the timer is resumed
  Then isPaused should be false
  And startTime should be recalculated
```

## Scenario: Clean Up Timer on Scene Shutdown

```gherkin
Scenario: Remove timer when scene ends
  Given a timer is running in GameSessionScene
  When the scene shuts down
  Then the timer event should be removed
  And the timer display should be destroyed
  And no memory leaks should occur
  And the timer should stop tracking
```

## Scenario: Extension Limit (Optional)

```gherkin
Scenario: Limit maximum number of extensions
  Given the parent has set timer.maxExtensions = 3
  And I have used 3 extensions (30 minutes total)
  When the break reminder appears again
  Then the "Keep Playing" button should be disabled or hidden
  And a message should say "Great job! Time for a real break!"
  And only "All Done" should be available
```

## Scenario: Integration with GameSessionScene

```gherkin
Scenario: Timer works with session orchestrator
  Given GameSessionScene is managing a 3-game sequence
  And a timer is running
  When I complete game 1
  And transition to game 2
  Then the timer should continue running
  And the timer display should persist
  When the break reminder appears during game 2
  And I click "All Done"
  Then the session should end gracefully
  And partial session results should be saved
```

## Scenario: No Frustration from Interruption

```gherkin
Scenario: Aurora feels supported, not interrupted
  Given Aurora is playing a game
  When the break reminder appears
  Then the current game should pause (not end)
  And Aurora's progress in that game should be preserved
  When Aurora clicks "Keep Playing"
  Then the game should resume exactly where it left off
  And no progress should be lost
  And Aurora should not feel frustrated or punished
```

## Scenario: Friendly Messaging Tone

```gherkin
Scenario: All messages use positive, supportive language
  Given any timer-related message appears
  Then the language should be:
    | Quality           | Example                           |
    | Positive          | "Great job playing!"              |
    | Supportive        | "Time to take care of yourself"   |
    | Encouraging       | "You've been doing awesome!"      |
    | Not bossy         | Avoid "You must stop now"         |
    | Not guilt-inducing| Avoid "Too much screen time"      |
  And Aurora should feel cared for, not controlled
```

## Scenario: Button Accessibility

```gherkin
Scenario: Buttons are easy to click and understand
  Given the break reminder screen is showing
  Then both buttons should be:
    | Property        | Value            |
    | Width           | 200px            |
    | Height          | 60px             |
    | Font Size       | 24px             |
    | Border          | 3px white        |
    | Cursor          | Pointer/hand     |
  And button labels should be clear and simple
  And buttons should be spaced apart (not touching)
  And color coding should be intuitive (green=go, orange=stop)
```

## Scenario: Save Progress Before Ending

```gherkin
Scenario: Ensure no data loss when session ends
  Given I click "All Done" on break reminder
  When the session ends
  Then all game progress should be saved first
  And session results should be persisted
  And any achievements should be recorded
  Then the scene should transition
  And I should see confirmation that progress was saved
```

## Scenario: Timer Accuracy Across Longer Sessions

```gherkin
Scenario: Maintain accuracy over extended play
  Given I play for 30+ minutes with multiple extensions
  When I check the total time at the end
  Then the elapsed time should be accurate to the second
  And no time drift should have occurred
  And the timer should not skip or jump
  And the timestamp calculations should be precise
```

## Scenario: Handle Scene Pause/Resume

```gherkin
Scenario: Timer pauses when game scene pauses
  Given the timer is running
  When the game scene is paused (for break reminder)
  Then the timer should pause automatically
  And no time should accumulate while paused
  When the game scene resumes
  Then the timer should resume automatically
  And time tracking should continue accurately
```

## Scenario: Responsive Button Interactions

```gherkin
Scenario: Immediate visual feedback on interaction
  Given I interact with a button on break screen
  When I hover over the button
  Then visual feedback should appear within 150ms
  When I click the button
  Then the click sound should play immediately
  And the button action should execute without delay
  And the experience should feel responsive and snappy
```

## Scenario: Fade Animations

```gherkin
Scenario: Smooth visual transitions for timer elements
  Given the timer display is created
  When it first appears
  Then it should fade in from alpha 0 to 0.6
  And the fade should take 1000ms
  And the easing should be 'Power2'
  When the warning message fades out
  Then it should fade to alpha 0 over 1000ms
  And then be destroyed
```

## Scenario: No Console Errors

```gherkin
Scenario: Timer system runs without errors
  Given I start a game session with timer enabled
  When I play through multiple games and extensions
  And I check the browser console
  Then there should be no error messages
  And there should be no warning messages
  And all timer operations should complete successfully
```

## Acceptance Criteria Checklist

### Timer Functionality
- [ ] Timer starts when session begins
- [ ] Elapsed time tracks accurately (updates every second)
- [ ] Timer display appears and updates correctly
- [ ] 2-minute warning appears at 8 minutes
- [ ] Break reminder appears at 10 minutes
- [ ] Timer pauses during break reminder
- [ ] Timer resumes after "Keep Playing"
- [ ] Timer stops when session ends

### Break Reminder Screen
- [ ] Aurora character appears with animation
- [ ] Friendly message displays with play time
- [ ] Break suggestions are shown
- [ ] "Keep Playing" button works (adds 5 minutes)
- [ ] "All Done" button works (ends session)
- [ ] Button hover effects work smoothly
- [ ] Button clicks are responsive
- [ ] Gentle audio plays

### Visual Design
- [ ] Timer display is subtle and unobtrusive
- [ ] Colors are gentle (no alarming red)
- [ ] Animations are smooth (fade in/out)
- [ ] Break screen is friendly and supportive
- [ ] Aurora character is welcoming
- [ ] Button styling is clear and accessible

### Parent Configuration
- [ ] Timer can be enabled/disabled
- [ ] Session duration is configurable
- [ ] Extension time is configurable
- [ ] Enforce break mode works
- [ ] Show/hide timer display works
- [ ] Settings persist in localStorage

### Integration
- [ ] Works with GameSessionScene from Phase 41
- [ ] Timer persists across scene transitions
- [ ] Session ends gracefully from break reminder
- [ ] Progress is saved before ending
- [ ] No conflicts with existing systems

### User Experience
- [ ] Aurora is not frustrated by reminders
- [ ] Messages feel supportive, not restrictive
- [ ] "Keep Playing" option provides autonomy
- [ ] Break suggestions are helpful
- [ ] Timing feels appropriate (10 min, 5 min extension)
- [ ] Overall experience promotes healthy habits

## Edge Cases to Test

```gherkin
Scenario: Very Short Session (< 10 minutes)
  Given the session duration is set to 10 minutes
  When I play for 5 minutes and quit
  Then no break reminder should appear
  And the timer should be recorded in results

Scenario: Exactly 10 Minutes
  Given I start playing at 0:00:00
  When the time reaches 0:10:00.000
  Then the break reminder should appear immediately
  And the timer should show exactly 10:00

Scenario: Rapid Extension Clicks
  Given the break reminder appears
  When I quickly click "Keep Playing" multiple times
  Then only one extension should be added
  And the button should disable after first click
  And no duplicate extensions should occur

Scenario: Timer During Scene Transition
  Given the timer is at 9:58
  When a scene transition begins
  And 3 seconds pass during transition
  Then the break reminder should appear mid-transition or after
  And no timer events should be lost

Scenario: Audio Load Failure
  Given the notification sounds fail to load
  When the 2-minute warning triggers
  Then the visual warning should still appear
  And no error should be thrown
  And the timer should continue working

Scenario: Aurora Character Sprite Missing
  Given the Aurora sprite is not loaded
  When the break reminder appears
  Then the screen should still display with placeholder
  And the buttons should still work
  And the message should still appear

Scenario: LocalStorage Unavailable
  Given localStorage is blocked or unavailable
  When trying to save timer config
  Then the timer should use default settings
  And the game should continue functioning
  And an appropriate fallback should be used
```

## Manual Testing Checklist

### Setup
1. [ ] Verify SessionTimerManager.js exists
2. [ ] Verify BreakReminderScene.js exists
3. [ ] Verify audio assets are loaded
4. [ ] Verify Aurora sprite is loaded
5. [ ] Verify timer config is accessible

### Timer Testing
6. [ ] Start session and watch timer count up
7. [ ] Verify timer reaches 8:00 and shows warning
8. [ ] Wait for 10:00 and verify break reminder
9. [ ] Test "Keep Playing" extends correctly
10. [ ] Test "All Done" ends session
11. [ ] Test multiple extensions

### Configuration Testing
12. [ ] Set timer to 5 minutes and test
13. [ ] Set timer to disabled and verify no timer
14. [ ] Set enforce break and verify no "Keep Playing"
15. [ ] Test with showTimer = false

### Integration Testing
16. [ ] Start session with multiple games
17. [ ] Verify timer persists through transitions
18. [ ] Trigger break during a game
19. [ ] Resume and verify game state preserved
20. [ ] End session from break and verify results

### User Experience
21. [ ] Ask: Is the timer distracting?
22. [ ] Ask: Is the break reminder gentle?
23. [ ] Ask: Do messages feel supportive?
24. [ ] Ask: Is Aurora frustrated or supported?
25. [ ] Ask: Are timings appropriate?

## Success Criteria

**This phase is complete when:**
1. SessionTimerManager tracks time accurately
2. Timer display is subtle and non-distracting
3. 2-minute warning and 10-minute reminder work
4. Break reminder screen is friendly and welcoming
5. "Keep Playing" and "All Done" options work correctly
6. Multiple extensions are supported
7. Timer persists across scene transitions
8. Parent configuration system works
9. Aurora is NOT frustrated by interruptions
10. All messages use positive, supportive language
11. Audio is gentle and non-alarming
12. Visual design is soft and friendly
13. Integration with Phase 41 is seamless
14. Zero console errors
15. Tested with real user (Aurora) and confirmed helpful
16. Promotes healthy gaming habits without feeling restrictive

## Notes

**Psychology of ADHD-Friendly Timers**
- Visible timer reduces "time blindness" anxiety
- Warnings prepare for transitions (reduces shock)
- Choice ("Keep Playing") provides autonomy
- Gentle reminders feel supportive, not controlling
- Positive framing focuses on health, not restriction
- Flexible extensions respect hyperfocus moments

**Design Philosophy**
- Health tool, not punishment system
- Supports Aurora, doesn't frustrate her
- Parents can customize for their child's needs
- Default settings work well for most ADHD kids
- Can be disabled if not helpful

**Future Enhancements**
- Activity suggestions during break (stretch exercises)
- Progress tracking over time (builds healthy habits)
- Rewards for taking breaks (positive reinforcement)
- Visual break timer (5-minute countdown)
- Parent analytics (average session length, break compliance)

This phase works hand-in-hand with Phase 41 to create a complete, healthy gaming experience that balances engagement with wellness.
