# Phase 24: Word Catch - Falling Words - BDD Scenarios

## Feature: Falling Words Implementation

```gherkin
Feature: Falling Word Mechanics
  As a developer
  I want words to fall from the top of the screen
  So that Aurora has objects to catch with her basket

Background:
  Given Phase 23 is completed
  And WordCatchScene is functional
  And basket controls are working
```

## Scenario: Create FallingWord Class

```gherkin
Scenario: Set up FallingWord.js file
  Given I am in the project src/gameobjects directory
  When I create FallingWord.js
  Then the file should export a FallingWord class
  And the class should extend Phaser.GameObjects.Container
  And the class should have a constructor(scene, x, y, word)
  And the class should have properties:
    | Property      | Type      | Initial Value |
    | scene         | Scene     | from param    |
    | word          | String    | from param    |
    | fallSpeed     | Number    | 60            |
    | isCaught      | Boolean   | false         |
    | isMissed      | Boolean   | false         |
    | background    | Graphics  | created       |
    | textObj       | Text      | created       |
```

## Scenario: FallingWord Visual Construction

```gherkin
Scenario: Create word with background and text
  Given FallingWord constructor is called with word "cat"
  When the word object is created
  Then a Graphics object should be created for background
  And the background should be a rounded rectangle
  And the background should be white (#FFFFFF)
  And the background should be 100 pixels wide
  And the background should be 40 pixels tall
  And the background should have a black border (#000000, 2px)
  And a Text object should be created
  And the text should display "cat"
  And the text should be 32px font size
  And the text should be black color (#000000)
  And the text should be bold
  And the text should be centered (origin 0.5, 0.5)
  And both background and text should be added to container
```

## Scenario: FallingWord Fall Method

```gherkin
Scenario: Word falls downward smoothly
  Given a FallingWord exists at position (400, 100)
  And fallSpeed is 60 pixels/second
  When fall(16) is called (16ms frame delta)
  Then the distance should be calculated as: 60 * 16 / 1000 = 0.96 pixels
  And the word's y position should increase by 0.96
  And the new y position should be 100.96
```

## Scenario: FallingWord Bottom Detection

```gherkin
Scenario: Detect when word reaches bottom
  Given a FallingWord exists at position (400, 550)
  When hasReachedBottom(560) is called
  Then it should return false

  Given the word is now at position (400, 561)
  When hasReachedBottom(560) is called
  Then it should return true
```

## Scenario: FallingWord Destruction

```gherkin
Scenario: Clean up word resources
  Given a FallingWord exists in the scene
  When destroy() is called
  Then textObj.destroy() should be called
  And background.destroy() should be called
  And Container.destroy() should be called
  And the word should be removed from the scene
  And memory should be freed
```

## Scenario: Initialize Word System in Scene

```gherkin
Scenario: Set up word spawning in WordCatchScene
  Given WordCatchScene.create() is called
  When the word system is initialized
  Then activeWords array should be created (empty)
  And maxActiveWords should be set to 3
  And sightWords array should be loaded with words
  And lastSpawnedWord should be set to null
  And a spawn timer should be created with:
    | Property  | Value           |
    | delay     | 2500            |
    | loop      | true            |
    | callback  | spawnWord       |
```

## Scenario: Spawn First Word

```gherkin
Scenario: First word spawns immediately
  Given WordCatchScene is created
  When the scene starts
  Then a delayed call should be created (500ms)
  And after 500ms, spawnWord() should be called
  And a FallingWord should be created
  And the word should appear at top of screen
  And activeWords array should contain 1 word
```

## Scenario: Spawn Word at Random Position

```gherkin
Scenario: Word spawns at random x position
  Given the spawn timer fires
  When spawnWord() is called
  Then a random x position should be generated between 100 and 700
  And a y position should be -50 (above screen)
  And a random word should be selected from sightWords
  And a new FallingWord should be created at (x, -50, word)
  And the word should be added to activeWords array
```

## Scenario: Enforce Max Active Words Limit

```gherkin
Scenario: Don't spawn when at max capacity
  Given 3 words are already in activeWords array
  And maxActiveWords is 3
  When the spawn timer fires
  And spawnWord() is called
  Then the method should check activeWords.length >= maxActiveWords
  And the method should return early (no spawn)
  And no new FallingWord should be created
  And activeWords array should still contain 3 words
```

## Scenario: Spawn After Word Removed

```gherkin
Scenario: Allow spawning after word reaches bottom
  Given 3 words are active (at max capacity)
  When one word reaches the bottom
  And the word is removed from activeWords
  Then activeWords.length should be 2
  And when spawn timer next fires
  Then a new word should spawn successfully
  And activeWords.length should be 3 again
```

## Scenario: Select Random Word

```gherkin
Scenario: Choose random sight word from list
  Given sightWords array contains ["I", "am", "the", "see", "can"]
  And lastSpawnedWord is null
  When getRandomWord() is called
  Then a random word should be selected from the array
  And the word should be one of the valid sight words
  And lastSpawnedWord should be updated to the selected word
```

## Scenario: Avoid Consecutive Duplicates

```gherkin
Scenario: Don't repeat the same word twice in a row
  Given sightWords array contains ["I", "am", "the", "see", "can"]
  And lastSpawnedWord is "the"
  When getRandomWord() is called
  Then the method should select a random word
  And if "the" is selected again, try again
  And continue until a different word is selected
  And the new word should not be "the"
  And lastSpawnedWord should be updated
```

## Scenario: Update Falling Words Each Frame

```gherkin
Scenario: Move all words in update loop
  Given 3 FallingWords are in activeWords array
  And the game is running at 60fps (delta ≈ 16ms)
  When update(time, delta) is called
  And updateFallingWords(delta) is called
  Then for each word in activeWords:
    | Action                        |
    | word.fall(delta) is called    |
    | word position is updated      |
    | word.hasReachedBottom() is checked |
  And all 3 words should move downward
  And movement should be smooth
```

## Scenario: Word Reaches Bottom

```gherkin
Scenario: Handle word that falls past threshold
  Given a FallingWord is at y=561
  And the word is in activeWords array at index 2
  When updateFallingWords() checks hasReachedBottom()
  Then hasReachedBottom(560) should return true
  And handleWordMissed(word, 2) should be called
  And the word should be removed from activeWords array
  And word.destroy() should be called
  And console should log "Word missed: [word]"
```

## Scenario: Multiple Words Fall Independently

```gherkin
Scenario: Each word updates without affecting others
  Given activeWords contains 3 words at positions:
    | Word  | X   | Y   |
    | "I"   | 150 | 100 |
    | "am"  | 400 | 250 |
    | "the" | 650 | 50  |
  When updateFallingWords(16) is called
  Then each word should move down independently
  And "I" should be at approximately y=101
  And "am" should be at approximately y=251
  And "the" should be at approximately y=51
  And no word should affect another's position
```

## Scenario: Remove Multiple Words in Same Frame

```gherkin
Scenario: Handle multiple words reaching bottom simultaneously
  Given 2 words are at y=561 and y=565
  When updateFallingWords() is called
  Then both words should be detected as past bottom
  And both should be removed from activeWords array
  And both should be destroyed
  And array should be 2 elements shorter
  And no errors should occur
```

## Scenario: Sight Words List Level 1

```gherkin
Scenario: Load kindergarten sight words
  Given the scene is initializing
  When sightWords array is populated
  Then it should contain words appropriate for 5-year-olds
  And words should include:
    | Word  |
    | I     |
    | a     |
    | am    |
    | an    |
    | and   |
    | at    |
    | can   |
    | go    |
    | he    |
    | in    |
    | is    |
    | it    |
    | like  |
    | me    |
    | my    |
    | see   |
    | the   |
    | to    |
    | we    |
  And the list should have at least 20 words
```

## Scenario: Word Text is Readable

```gherkin
Scenario: Verify text visibility while falling
  Given a FallingWord is created with text "see"
  When the word is rendered
  Then the text font size should be at least 32px
  And the text color should be black (#000000)
  And the background should be white (#FFFFFF)
  And the contrast ratio should be sufficient (WCAG AA)
  And the text should be readable while moving
  And the text should be bold for emphasis
```

## Scenario: Word Styling Consistency

```gherkin
Scenario: All words have same visual style
  Given multiple FallingWords are created
  When they are rendered in the scene
  Then all should have the same font size
  And all should have the same font family
  And all should have the same background color
  And all should have the same border style
  And all should have the same dimensions
  And styling should be consistent across all words
```

## Scenario: Spawn Timing is Consistent

```gherkin
Scenario: Words spawn at regular intervals
  Given the spawn timer is set to 2500ms
  And the scene has been running for 10 seconds
  When I observe word spawns
  Then approximately 4 words should have spawned
  And spawn intervals should be roughly 2.5 seconds apart
  And timing should not vary significantly
  And timer should loop continuously
```

## Scenario: No Performance Issues

```gherkin
Scenario: Game maintains 60fps with 3 falling words
  Given 3 FallingWords are active
  And the game has been running for 5 minutes
  When I check the frame rate
  Then FPS should be at or near 60
  And there should be no stuttering
  And there should be no frame drops
  And CPU usage should be reasonable
  And memory usage should be stable
```

## Scenario: Memory is Properly Managed

```gherkin
Scenario: No memory leaks from word creation/destruction
  Given the scene has been running for 10 minutes
  And 50+ words have been created and destroyed
  When I check memory usage in DevTools
  Then memory should be stable (not continuously increasing)
  And destroyed words should be garbage collected
  And no orphaned objects should remain
  And activeWords array should accurately reflect active words
```

## Acceptance Criteria - Class Implementation

```gherkin
Scenario: FallingWord class is complete
  Then FallingWord.js should exist in src/gameobjects/
  And the class should extend Container
  And it should have constructor(scene, x, y, word)
  And it should have fall(delta) method
  And it should have hasReachedBottom(threshold) method
  And it should have getWord() method
  And it should have destroy() method
  And it should create background graphics
  And it should create text object
  And both should be added to container
```

## Acceptance Criteria - Spawning System

```gherkin
Scenario: Word spawning works correctly
  Then words should spawn at top of screen
  And spawn position x should be random (100-700)
  And spawn position y should be -50
  And words should spawn every 2-3 seconds
  And first word should spawn within 1 second
  And max 3 words should be active at once
  And words should be added to activeWords array
```

## Acceptance Criteria - Falling Mechanics

```gherkin
Scenario: Words fall correctly
  Then words should fall at 60 pixels/second
  And falling should be smooth (delta-based)
  And falling should be consistent across frame rates
  And all active words should fall independently
  And words should despawn when y > 560
  And despawned words should be destroyed
  And despawned words should be removed from array
```

## Acceptance Criteria - Visual Quality

```gherkin
Scenario: Words are visually correct
  Then text should be 32px or larger
  And text should be bold
  And text should be black on white background
  And background should be rounded rectangle
  And background should have border
  And words should be readable while falling
  And styling should be consistent
```

## Acceptance Criteria - Content

```gherkin
Scenario: Sight word content is appropriate
  Then sight words should be kindergarten level
  And list should include common words (I, am, the, see, etc.)
  And words should be spelled correctly
  And same word should not repeat consecutively
  And words should be randomly selected
```

## Acceptance Criteria - Performance

```gherkin
Scenario: Performance is acceptable
  Then game should maintain 60fps
  And no stuttering should occur
  And no memory leaks should occur
  And CPU usage should be reasonable
  And game should run smoothly for 5+ minutes
```

## Edge Cases to Test

```gherkin
Scenario: Empty activeWords Array
  Given activeWords array is empty
  When updateFallingWords() is called
  Then no errors should occur
  And the loop should complete without issues

Scenario: Word Exactly at Threshold
  Given a word is at y=560 (exactly at threshold)
  When hasReachedBottom(560) is called
  Then it should return false (not yet past)

  Given the word is at y=560.01
  When hasReachedBottom(560) is called
  Then it should return true (past threshold)

Scenario: Very Low Frame Rate
  Given the game is running at 20fps
  And delta is approximately 50ms
  When fall(50) is called
  Then distance should be 60 * 50 / 1000 = 3 pixels
  And words should still fall smoothly (no skipping)
  And movement should compensate for low frame rate

Scenario: All Words Reach Bottom Simultaneously
  Given 3 words all reach y>560 in same frame
  When updateFallingWords() is called
  Then all 3 words should be removed
  And all 3 words should be destroyed
  And activeWords array should be empty
  And no errors should occur

Scenario: Spawn Timer Fires During Scene Shutdown
  Given the scene is shutting down
  When the spawn timer callback fires
  Then the spawn should be cancelled or handled gracefully
  And no errors should occur

Scenario: Word List Has Only One Word
  Given sightWords array contains only ["I"]
  When getRandomWord() is called
  Then "I" should be selected
  And lastSpawnedWord should be "I"
  And next call should still work (same word is okay if only one)
  And no infinite loop should occur

Scenario: Spawn Position at Edge
  Given random x is exactly 100 or 700 (edge values)
  When word is spawned
  Then it should appear correctly
  And it should be catchable
  And it should fall normally

Scenario: Rapid Scene Restart
  Given scene is started
  And words are spawned
  When scene is stopped and restarted quickly
  Then old words should be cleaned up
  And new words should spawn fresh
  And no duplicate objects should exist
  And activeWords array should be reset
```

## Manual Testing Checklist

### Setup
1. [ ] Create FallingWord.js in src/gameobjects/
2. [ ] Implement FallingWord class completely
3. [ ] Add word system to WordCatchScene.create()
4. [ ] Add updateFallingWords() to scene.update()
5. [ ] Load sight words list

### FallingWord Class Testing
6. [ ] Instantiate single FallingWord manually
7. [ ] Verify background graphics render
8. [ ] Verify text renders
9. [ ] Verify word appears at specified position
10. [ ] Call fall() manually and verify movement
11. [ ] Verify hasReachedBottom() logic
12. [ ] Call destroy() and verify cleanup

### Spawning Testing
13. [ ] Launch scene and wait for first word
14. [ ] Verify word spawns within 1 second
15. [ ] Verify word appears at top of screen
16. [ ] Verify word has random x position
17. [ ] Wait and verify second word spawns
18. [ ] Verify spawn timing (~2.5 seconds)
19. [ ] Wait for third word to spawn
20. [ ] Verify no fourth word spawns (max 3)

### Falling Testing
21. [ ] Watch single word fall
22. [ ] Verify smooth downward motion
23. [ ] Verify consistent fall speed
24. [ ] Watch multiple words fall
25. [ ] Verify all fall independently
26. [ ] Verify no collision between words
27. [ ] Time fall duration (should be ~9-10 seconds)

### Despawn Testing
28. [ ] Let word reach bottom of screen
29. [ ] Verify word disappears cleanly
30. [ ] Verify no visual glitches
31. [ ] Check console for "Word missed" log
32. [ ] Verify new word spawns after despawn
33. [ ] Verify activeWords count is correct

### Visual Testing
34. [ ] Verify text is large and readable
35. [ ] Verify text is bold
36. [ ] Verify high contrast (black on white)
37. [ ] Verify background has border
38. [ ] Verify rounded corners on background
39. [ ] Verify text is readable while moving
40. [ ] Test with different sight words

### Content Testing
41. [ ] Observe 10+ spawned words
42. [ ] Verify variety in words
43. [ ] Verify appropriate words for 5-year-old
44. [ ] Verify correct spelling
45. [ ] Verify no consecutive duplicates
46. [ ] Verify words from sight word list

### Performance Testing
47. [ ] Open DevTools Performance tab
48. [ ] Record for 30 seconds
49. [ ] Verify 60fps maintained
50. [ ] Open Memory tab
51. [ ] Take heap snapshot
52. [ ] Let game run 5 minutes
53. [ ] Take second heap snapshot
54. [ ] Compare - verify no significant memory growth
55. [ ] Check CPU usage is reasonable

### Edge Case Testing
56. [ ] Test with empty activeWords array
57. [ ] Test with exactly 3 words
58. [ ] Test word exactly at threshold (y=560)
59. [ ] Test rapid scene restart
60. [ ] Test scene exit during spawning
61. [ ] Test with single-word list
62. [ ] Let all 3 words reach bottom simultaneously

### Integration Testing
63. [ ] Start from main menu
64. [ ] Enter Word Catch scene
65. [ ] Verify words spawn and fall
66. [ ] Move basket with controls
67. [ ] Verify basket and words don't interfere
68. [ ] Exit to menu and re-enter
69. [ ] Verify clean restart

### Final Verification
70. [ ] Zero console errors
71. [ ] Zero console warnings
72. [ ] Smooth falling motion
73. [ ] Appropriate fall speed (readable)
74. [ ] Consistent spawn timing
75. [ ] Proper cleanup and despawn
76. [ ] Good visual quality
77. [ ] Appropriate sight word content
78. [ ] 60fps maintained
79. [ ] No memory leaks
80. [ ] Ready for Phase 25 (collision detection)

## Success Criteria

**This phase is complete when:**
1. FallingWord class implemented and working
2. Words spawn at top of screen at random x positions
3. Words fall smoothly at appropriate speed (60px/s)
4. Fall speed is slow enough to read words
5. 2-3 words appear on screen simultaneously
6. Max limit of 3 words enforced
7. Words despawn cleanly at bottom
8. Despawn triggers proper cleanup (no memory leaks)
9. Spawn timing works (every 2-3 seconds)
10. Sight word list integrated
11. Words randomly selected from list
12. No consecutive duplicate words
13. Text large and readable (32px+, bold, high contrast)
14. Visual styling consistent and professional
15. 60fps maintained with 3 active words
16. No console errors or warnings
17. Game stable over 5+ minutes of play
18. Aurora can read the words while they fall
19. Code structured to support collision detection (Phase 25)
20. All acceptance criteria met

## Notes

**Testing Priorities**
1. **Readability**: Most important - Aurora must be able to read words
2. **Performance**: Must maintain 60fps for smooth gameplay
3. **Stability**: No crashes or errors
4. **Content**: Words must be appropriate and correct

**What We're Testing**
- FallingWord class functionality
- Spawning system and timing
- Falling physics and motion
- Visual appearance and readability
- Performance and memory management
- Sight word content

**What We're NOT Testing Yet**
- Collision detection with basket (Phase 25)
- Catching words (Phase 25)
- Scoring (Phase 25)
- Lives/health system (Phase 25)
- Sound effects (later phases)

This phase is about getting words falling smoothly and readably. Interaction comes next.
