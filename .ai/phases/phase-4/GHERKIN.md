# Phase 4: AudioManager Service - BDD Scenarios

## Feature: AudioManager Service

```gherkin
Feature: AudioManager Service
  As a developer
  I want a centralized audio management service
  So that I can play sounds and voices consistently across all scenes

Background:
  Given the Phaser game is running
  And MainMenu scene is loaded
  And AudioManager service exists
```

## Scenario: Create AudioManager Singleton

```gherkin
Scenario: AudioManager uses singleton pattern
  When I call AudioManager.getInstance() from MainMenu
  And I call AudioManager.getInstance() from another scene
  Then both calls should return the same instance
  And only one AudioManager instance should exist
  And the instance should have all required methods:
    | Method      |
    | getInstance |
    | init        |
    | playSound   |
    | playVoice   |
    | stopAll     |
    | setVolume   |
```

## Scenario: Initialize AudioManager

```gherkin
Scenario: Initialize AudioManager with scene
  Given AudioManager instance exists
  When I call AudioManager.init(scene) from MainMenu
  Then AudioManager should store the scene reference
  And console should log "[AudioManager] Initialized with scene: MainMenu"
  And AudioManager should be ready to play audio
```

## Scenario: Play Sound Effect

```gherkin
Scenario: Play a sound effect successfully
  Given AudioManager is initialized
  And "test-click" sound is loaded
  When I call AudioManager.playSound('test-click')
  Then the sound should play
  And console should log "[AudioManager] Playing sound: test-click"
  And the sound should be stored in sounds Map
  And the sound should play at default volume (0.7)
```

## Scenario: Play Sound with Custom Volume

```gherkin
Scenario: Play sound with custom configuration
  Given AudioManager is initialized
  And "test-click" sound is loaded
  When I call AudioManager.playSound('test-click', { volume: 0.5 })
  Then the sound should play at volume 0.5
  And console should log "[AudioManager] Playing sound: test-click"
```

## Scenario: Prevent Sound Overlap

```gherkin
Scenario: Prevent same sound from overlapping
  Given AudioManager is initialized
  And "test-click" sound is loaded
  When I call AudioManager.playSound('test-click')
  And the sound is currently playing
  And I call AudioManager.playSound('test-click') again
  Then the first instance should stop
  And the second instance should start playing
  And there should be no audio overlap
  And console should show both play events
```

## Scenario: Multiple Different Sounds

```gherkin
Scenario: Allow different sounds to play simultaneously
  Given AudioManager is initialized
  And "click" sound is loaded
  And "success" sound is loaded
  When I call AudioManager.playSound('click')
  And I call AudioManager.playSound('success')
  Then both sounds should play simultaneously
  And console should log both play events
  And sounds Map should contain both sounds
```

## Scenario: Play Voice Clip

```gherkin
Scenario: Play a voice clip successfully
  Given AudioManager is initialized
  And "letter-a" voice is loaded
  When I call AudioManager.playVoice('letter-a')
  Then the voice should play
  And console should log "[AudioManager] Playing voice: letter-a"
  And the voice should be stored in voices Map
  And currentVoice should reference this voice
  And the voice should play at default volume (1.0)
```

## Scenario: Voice Clip Interruption

```gherkin
Scenario: New voice stops previous voice
  Given AudioManager is initialized
  And "letter-a" voice is loaded
  And "letter-b" voice is loaded
  When I call AudioManager.playVoice('letter-a')
  And "letter-a" is currently playing
  And I call AudioManager.playVoice('letter-b')
  Then "letter-a" should stop immediately
  And "letter-b" should start playing
  And only one voice should play at a time
  And currentVoice should reference "letter-b"
  And console should log both voice events
```

## Scenario: Set Sound Volume

```gherkin
Scenario: Change sound effect volume
  Given AudioManager is initialized
  When I call AudioManager.setVolume('sound', 0.5)
  Then soundVolume should be set to 0.5
  And console should log "[AudioManager] Sound volume set to: 0.5"
  And future sounds should play at volume 0.5
```

## Scenario: Set Voice Volume

```gherkin
Scenario: Change voice clip volume
  Given AudioManager is initialized
  When I call AudioManager.setVolume('voice', 0.8)
  Then voiceVolume should be set to 0.8
  And console should log "[AudioManager] Voice volume set to: 0.8"
  And future voice clips should play at volume 0.8
```

## Scenario: Volume Clamping

```gherkin
Scenario Outline: Volume values are clamped to valid range
  Given AudioManager is initialized
  When I call AudioManager.setVolume('sound', <input>)
  Then the volume should be set to <clamped>
  And the volume should be between 0 and 1

  Examples:
    | input | clamped |
    | -0.5  | 0       |
    | 0     | 0       |
    | 0.5   | 0.5     |
    | 1.0   | 1.0     |
    | 1.5   | 1.0     |
    | 2.0   | 1.0     |
```

## Scenario: Stop All Audio

```gherkin
Scenario: Stop all playing audio
  Given AudioManager is initialized
  And "click" sound is playing
  And "success" sound is playing
  And "letter-a" voice is playing
  When I call AudioManager.stopAll()
  Then all sounds should stop playing
  And all voices should stop playing
  And sounds Map should be empty
  And voices Map should be empty
  And currentVoice should be null
  And console should log "[AudioManager] Stopping all audio"
```

## Scenario: Audio Cleanup on Completion

```gherkin
Scenario: Sound cleans up after completion
  Given AudioManager is initialized
  And "test-click" sound is loaded
  When I call AudioManager.playSound('test-click')
  And the sound plays to completion
  Then the sound should emit 'complete' event
  And the sound should be removed from sounds Map
  And memory should be freed
```

## Scenario: Handle Missing Audio File

```gherkin
Scenario: Gracefully handle missing audio
  Given AudioManager is initialized
  When I call AudioManager.playSound('nonexistent-sound')
  Then the game should not crash
  And console should show error: "[AudioManager] Error playing sound nonexistent-sound"
  And the method should return null
  And the game should continue running
```

## Scenario: Play Without Initialization

```gherkin
Scenario: Handle playSound before init
  Given AudioManager is created but not initialized
  When I call AudioManager.playSound('test-click')
  Then console should warn "[AudioManager] Cannot play sound - not initialized"
  And the method should return null
  And no audio should play
```

## Scenario: Play Voice Without Initialization

```gherkin
Scenario: Handle playVoice before init
  Given AudioManager is created but not initialized
  When I call AudioManager.playVoice('letter-a')
  Then console should warn "[AudioManager] Cannot play voice - not initialized"
  And the method should return null
  And no audio should play
```

## Scenario: MainMenu Integration

```gherkin
Scenario: Test button in MainMenu plays sound
  Given MainMenu scene is loaded
  And AudioManager is initialized in MainMenu
  And "test-click" sound is preloaded
  And a test button exists on screen
  When I click the test button
  Then console should log "[MainMenu] Test button clicked"
  And AudioManager.playSound('test-click') should be called
  And console should log "[AudioManager] Playing sound: test-click"
  And the test sound should play
  And the sound should be audible
```

## Scenario: Button Visual Feedback

```gherkin
Scenario: Test button shows hover effects
  Given MainMenu scene is loaded
  And a test button exists on screen
  When I move my mouse over the button
  Then the button background should change to lighter blue
  When I move my mouse away from the button
  Then the button background should return to original blue
```

## Scenario: Rapid Button Clicks

```gherkin
Scenario: Handle rapid button clicks without overlap
  Given MainMenu scene is loaded
  And AudioManager is initialized
  And "test-click" sound is loaded
  When I click the test button rapidly 5 times
  Then each click should trigger a new sound
  And previous sounds should stop before new ones start
  And there should be no audio overlap or echo
  And console should show 5 play events
```

## Scenario: Scene Change Persistence

```gherkin
Scenario: AudioManager persists across scenes
  Given MainMenu scene is loaded
  And AudioManager is initialized
  When I change to GameScene
  And I initialize AudioManager in GameScene
  Then the same AudioManager instance should be used
  And the volume settings should be preserved
  And the scene reference should be updated
```

## Scenario: Multiple Scene Audio

```gherkin
Scenario: Audio plays from different scenes
  Given AudioManager is initialized in MainMenu
  When I play a sound in MainMenu
  And I switch to GameScene
  And I initialize AudioManager in GameScene
  And I play a different sound in GameScene
  Then both sounds should work correctly
  And the AudioManager should handle both scenes
```

## Acceptance Criteria

### Must Have - Singleton Pattern
- [ ] AudioManager uses singleton pattern
- [ ] getInstance() returns same instance every time
- [ ] Only one AudioManager exists across all scenes
- [ ] Singleton can be imported and used from any scene

### Must Have - Initialization
- [ ] init(scene) stores scene reference correctly
- [ ] Initialization is required before playing audio
- [ ] Console logs initialization message
- [ ] Can be re-initialized with different scene

### Must Have - Sound Effects
- [ ] playSound(key) plays sound effects
- [ ] playSound(key, config) accepts volume config
- [ ] Same sound key doesn't overlap (stops previous)
- [ ] Different sounds can play simultaneously
- [ ] Sounds use default volume (0.7) if not specified
- [ ] Console logs each sound play event

### Must Have - Voice Clips
- [ ] playVoice(key) plays voice clips
- [ ] playVoice(key, config) accepts volume config
- [ ] Only one voice plays at a time
- [ ] New voice stops previous voice immediately
- [ ] Voices use default volume (1.0) if not specified
- [ ] Console logs each voice play event

### Must Have - Volume Control
- [ ] setVolume('sound', volume) sets sound volume
- [ ] setVolume('voice', volume) sets voice volume
- [ ] Volume is clamped to 0-1 range
- [ ] New audio uses updated volume settings
- [ ] Console logs volume changes

### Must Have - Stop Functionality
- [ ] stopAll() stops all playing sounds
- [ ] stopAll() stops all playing voices
- [ ] stopAll() clears all Maps
- [ ] stopAll() resets currentVoice to null
- [ ] Console logs stopAll action

### Must Have - Memory Management
- [ ] Sounds removed from Map on completion
- [ ] Voices removed from Map on completion
- [ ] No memory leaks from audio objects
- [ ] Proper cleanup of event handlers

### Must Have - Error Handling
- [ ] Gracefully handles missing audio files
- [ ] Warns when used before initialization
- [ ] Returns null on errors
- [ ] Game doesn't crash on audio errors
- [ ] Console shows clear error messages

### Must Have - MainMenu Integration
- [ ] AudioManager imported in MainMenu
- [ ] AudioManager initialized in create()
- [ ] Test button created and positioned
- [ ] Test button click triggers sound
- [ ] Console logs show button click and audio play

### Visual Verification
- [ ] Test button is visible and centered
- [ ] Test button has blue background
- [ ] Test button shows hover effects
- [ ] Test button text is readable
- [ ] Test button responds to clicks

### Technical Verification
- [ ] No console errors
- [ ] No console warnings (except for missing audio tests)
- [ ] Code is well-commented
- [ ] Singleton pattern implemented correctly
- [ ] Map data structure used correctly
- [ ] Event handlers set up properly

### Audio Quality
- [ ] Sound plays clearly
- [ ] Volume is consistent
- [ ] No distortion or clipping
- [ ] No overlap or echo effects
- [ ] Sound appropriate for children

## Edge Cases to Test

```gherkin
Scenario: Rapid Volume Changes
  Given AudioManager is initialized
  When I rapidly change volume 10 times
  Then each change should be applied
  And the final volume should be correct
  And no errors should occur

Scenario: Stop Before Play Completes
  Given AudioManager is initialized
  And a sound is playing
  When I call stopAll() before it completes
  Then the sound should stop immediately
  And cleanup should happen correctly

Scenario: Play Same Voice Rapidly
  Given AudioManager is initialized
  When I call playVoice('letter-a') 5 times rapidly
  Then each call should stop the previous
  And only the last one should be playing
  And no voices should overlap

Scenario: Large Number of Sounds
  Given AudioManager is initialized
  When I play 20 different sounds quickly
  Then all sounds should be tracked
  And memory should be managed properly
  And no performance issues should occur

Scenario: Scene Change During Playback
  Given a sound is playing in MainMenu
  When I switch scenes before sound completes
  Then the sound should continue or stop gracefully
  And no errors should occur
  And the new scene can play its own audio

Scenario: Invalid Volume Type
  Given AudioManager is initialized
  When I call setVolume('invalid', 0.5)
  Then nothing should happen
  And no errors should occur
  And sound/voice volumes remain unchanged

Scenario: Null or Undefined Audio Key
  Given AudioManager is initialized
  When I call playSound(null)
  Or I call playSound(undefined)
  Then console should show error
  And method should return null
  And game should not crash

Scenario: Re-initialization
  Given AudioManager is initialized with MainMenu
  When I call init() again with GameScene
  Then scene reference should update
  And previous scene's audio should be handled correctly
  And new scene should work normally
```

## Manual Testing Checklist

### Setup
1. [ ] Create src/services/ directory
2. [ ] Create AudioManager.js
3. [ ] Verify singleton pattern implementation
4. [ ] Add test sound to assets/audio/
5. [ ] Update MainMenu to import AudioManager

### Basic Functionality
6. [ ] Open game in browser
7. [ ] Open browser console (F12)
8. [ ] Verify MainMenu loads without errors
9. [ ] Verify initialization log appears
10. [ ] Locate test button on screen

### Sound Testing
11. [ ] Click test button once
12. [ ] Verify sound plays
13. [ ] Check console for play log
14. [ ] Click test button rapidly
15. [ ] Verify no overlap occurs

### Volume Testing
16. [ ] Test setVolume('sound', 0.3)
17. [ ] Play sound and verify quieter
18. [ ] Test setVolume('sound', 1.0)
19. [ ] Play sound and verify louder
20. [ ] Test volume clamping (negative/over 1.0)

### Error Testing
21. [ ] Test with nonexistent sound key
22. [ ] Verify graceful error handling
23. [ ] Verify console shows error message
24. [ ] Verify game continues running

### Visual Testing
25. [ ] Hover over test button
26. [ ] Verify background color changes
27. [ ] Move mouse away
28. [ ] Verify background resets

### Browser Testing
29. [ ] Test in Chrome
30. [ ] Test in Firefox
31. [ ] Document any browser differences

## Success Criteria

**This phase is complete when:**
1. AudioManager.js created with singleton pattern
2. All methods implemented and working
3. Test button integrated in MainMenu
4. Sound plays when button clicked
5. No overlap when clicked rapidly
6. Volume control works correctly
7. Error handling works gracefully
8. Console logs are clear and helpful
9. Tested in 2+ browsers
10. All acceptance criteria met
11. Code is well-commented
12. Ready to proceed to Phase 5

## Performance Criteria

```gherkin
Feature: Performance Requirements

Scenario: Fast Audio Response
  When user clicks button
  Then audio should start within 50ms
  And no noticeable delay should occur

Scenario: Memory Efficiency
  When 100 sounds play over 5 minutes
  Then memory usage should remain stable
  And no memory leaks should occur
  And cleanup should happen automatically

Scenario: CPU Usage
  When multiple sounds play
  Then CPU usage should remain low
  And game should maintain 60fps
  And no performance degradation should occur
```

## Notes

**Keep It Simple**
- This phase is about audio infrastructure
- Focus on core functionality
- Don't add features not in requirements
- Make it reliable and testable

**What We're Testing**
- Singleton pattern works
- Audio playback works
- Volume control works
- Overlap prevention works
- Error handling works
- Console logging helps debugging

**What We're NOT Testing**
- Music tracks (not added yet)
- Audio sprites (future enhancement)
- Accessibility features (later phases)
- Mobile-specific behavior (test later)
- User preference saving (future phase)

**ADHD-Friendly Audio**
- Clear, not overwhelming
- Consistent volume
- No sudden loud sounds
- Voice clips don't overlap (clarity)
- Test with actual target users later

This phase establishes reliable audio infrastructure that all future phases will build upon.
