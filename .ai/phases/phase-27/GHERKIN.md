# Phase 27: Sight Word Content - BDD Scenarios

## Feature: Sight Word Data Management

```gherkin
Feature: Sight Word Content Integration
  As a developer
  I want to load Dolch pre-primer sight words
  So that Aurora can learn real words in Word Catch

Background:
  Given I am in the project root directory
  And the Word Catch game is functional
  And the ContentProvider class exists
```

## Scenario: Create Sight Words JSON

```gherkin
Scenario: Create sight word data file
  When I create "/assets/data/sight-words.json"
  Then the file should contain valid JSON
  And it should have a "version" property
  And it should have a "source" property set to "Dolch Pre-Primer List"
  And it should have a "lastUpdated" property
  And it should have a "words" array
  And the "words" array should contain 40 items
  And each word object should have the following properties:
    | Property   | Type   | Required |
    | id         | Number | Yes      |
    | text       | String | Yes      |
    | difficulty | Number | Yes      |
    | category   | String | Yes      |
    | audioFile  | String | Yes      |
```

## Scenario: Validate Dolch Pre-Primer Word List

```gherkin
Scenario: Verify all 40 Dolch words are present
  Given the sight-words.json file is created
  When I parse the JSON file
  Then the words array should contain exactly 40 words
  And the following words should be present:
    | Word   |
    | a      |
    | and    |
    | away   |
    | big    |
    | blue   |
    | can    |
    | come   |
    | down   |
    | find   |
    | for    |
    | funny  |
    | go     |
    | help   |
    | here   |
    | i      |
    | in     |
    | is     |
    | it     |
    | jump   |
    | little |
    | look   |
    | make   |
    | me     |
    | my     |
    | not    |
    | one    |
    | play   |
    | red    |
    | run    |
    | said   |
    | see    |
    | the    |
    | three  |
    | to     |
    | two    |
    | up     |
    | we     |
    | where  |
    | yellow |
    | you    |
  And no duplicate words should exist
```

## Scenario: Generate Sight Word Audio Files

```gherkin
Scenario: Create audio files for all sight words
  Given I have a text-to-speech service available
  And I have the list of 40 Dolch words
  When I generate audio files for each word
  Then 40 MP3 files should be created
  And each file should be named "word-{word}.mp3"
  And all files should be saved to "/assets/audio/sight-words/"
  And each file should be playable
  And each file should have clear pronunciation
  And all files should have consistent volume levels
  And file sizes should be reasonable (< 100KB each)
```

## Scenario: Normalize Audio Levels

```gherkin
Scenario: Ensure consistent audio volume
  Given I have generated 40 audio files
  When I analyze the audio levels
  Then all files should have similar peak volumes
  And no file should clip or distort
  When I apply normalization to all files
  Then all files should be normalized to -1.0 dB
  And playback volume should be consistent across all words
```

## Scenario: ContentProvider Loads Sight Words

```gherkin
Scenario: Initialize ContentProvider with sight word data
  Given the sight-words.json file exists
  And the file contains valid data
  When I create a new ContentProvider instance
  And I call loadSightWords()
  Then the method should fetch the JSON file
  And the data should be parsed successfully
  And the sightWordsData property should be populated
  And the usedWords array should be initialized as empty
  And console should log "Loaded 40 sight words"
  And no errors should be thrown
```

## Scenario: Get Random Sight Word

```gherkin
Scenario: Retrieve a random sight word from ContentProvider
  Given ContentProvider is initialized
  And sight words are loaded
  When I call getRandomSightWord()
  Then a sight word object should be returned
  And the object should have properties:
    | Property   |
    | id         |
    | text       |
    | difficulty |
    | category   |
    | audioFile  |
  And the word should be added to usedWords array
  And calling getRandomSightWord() again should return a different word
```

## Scenario: Prevent Immediate Word Repetition

```gherkin
Scenario: Avoid showing the same word consecutively
  Given ContentProvider is initialized
  And sight words are loaded
  When I call getRandomSightWord() 10 times
  Then I should receive 10 different words
  And no word should appear twice in those 10 calls
  And the usedWords array should contain 10 word IDs
```

## Scenario: Reset Used Words After Exhaustion

```gherkin
Scenario: Allow word repetition after cycling through enough words
  Given ContentProvider is initialized
  And I have called getRandomSightWord() many times
  When the usedWords array has 10+ entries
  Then the oldest entry should be removed
  And the array size should remain at 10
  When all 40 words have been used
  Then the usedWords array should reset
  And words can be selected again from the full pool
```

## Scenario: Get Multiple Sight Words

```gherkin
Scenario: Request multiple sight words at once
  Given ContentProvider is initialized
  And sight words are loaded
  When I call getSightWords(5)
  Then an array of 5 sight word objects should be returned
  And all 5 words should be unique
  And each word should have all required properties
```

## Scenario: Filter Words by Difficulty

```gherkin
Scenario: Retrieve words of specific difficulty level
  Given ContentProvider is initialized
  And sight words are loaded
  When I call getSightWordsByDifficulty(1)
  Then only words with difficulty 1 should be returned
  And the array should contain multiple words
  When I call getSightWordsByDifficulty(2)
  Then only words with difficulty 2 should be returned
  When I call getSightWordsByDifficulty(3)
  Then only words with difficulty 3 should be returned
```

## Scenario: Handle Missing JSON File

```gherkin
Scenario: Gracefully handle missing sight words data
  Given the sight-words.json file does not exist
  When I call loadSightWords()
  Then a fetch error should be caught
  And an error should be logged to console
  And getFallbackWords() should be called
  And a minimal set of 5 fallback words should be loaded
  And the game should continue to function
  And a warning should be logged about limited words
```

## Scenario: Handle Malformed JSON

```gherkin
Scenario: Handle invalid JSON structure
  Given the sight-words.json file exists
  But the JSON is malformed
  When I call loadSightWords()
  Then a parse error should be caught
  And an error should be logged to console
  And getFallbackWords() should be called
  And the game should use fallback words
```

## Scenario: Handle Missing Words Array

```gherkin
Scenario: Handle JSON with missing or empty words array
  Given the sight-words.json file exists
  But the "words" array is empty
  When I call getRandomSightWord()
  Then null should be returned
  And a warning should be logged
  And the game should handle this gracefully
```

## Scenario: Integrate Sight Words into Word Catch

```gherkin
Scenario: Use real sight words in Word Catch game
  Given Word Catch scene is active
  And ContentProvider is initialized with sight words
  When the word spawn timer triggers
  Then getRandomSightWord() should be called
  And a sight word should be retrieved
  And a falling word sprite should be created with the word text
  And the word data should be attached to the sprite
  And the word should be visible on screen
```

## Scenario: Display Sight Word on Screen

```gherkin
Scenario: Render sight word in game
  Given a sight word has been retrieved
  When I create a falling word sprite
  Then the word text should be displayed
  And the text should be readable (appropriate font size)
  And the text should contrast with the background
  And the word should fall from top of screen
  And the word should be positioned randomly on x-axis
```

## Scenario: Play Audio When Word is Caught

```gherkin
Scenario: Pronunciation audio plays on word catch
  Given a sight word is falling
  And the word has associated audio file
  When Aurora clicks/taps the word
  Then the catch event should trigger
  And the word's audio file should be played
  And the pronunciation should be clear and audible
  And the audio should not overlap with background music harshly
```

## Scenario: Handle Missing Audio File

```gherkin
Scenario: Gracefully handle missing word audio
  Given a sight word is caught
  But the associated audio file is missing
  When the game attempts to play the audio
  Then an error should be caught
  And a warning should be logged
  And the game should continue without the audio
  And visual feedback should still be shown
  And the score should still update
```

## Scenario: Test All 40 Words in Game

```gherkin
Scenario: Verify all sight words can appear in game
  Given Word Catch is running
  When I play the game for an extended session
  Then over time, all 40 words should appear
  And each word should display correctly
  And each word's audio should play correctly
  And no word should cause errors
```

## Scenario: Preload Audio Files

```gherkin
Scenario: Load sight word audio in preload scene
  Given the preload scene is active
  When the scene loads assets
  Then the sight-words.json file should be loaded
  And all 40 audio files should be loaded
  And loading progress should be displayed
  And all audio files should be cached
  And no loading errors should occur
```

## Scenario: Verify Audio File Naming

```gherkin
Scenario: Check audio file naming convention
  Given I navigate to /assets/audio/sight-words/
  When I list all MP3 files
  Then each file should match the pattern "word-{word}.mp3"
  And the {word} should match a word from the JSON
  And there should be exactly 40 files
  And no files should have incorrect naming
```

## Scenario: Test Word Variety in Gameplay

```gherkin
Scenario: Ensure diverse word selection during play
  Given Word Catch is running
  When I catch 20 words in succession
  Then I should see at least 15 different words
  And no word should appear more than twice
  And word selection should feel random
  And the same word should not appear consecutively
```

## Scenario: Verify Performance with Real Words

```gherkin
Scenario: Check performance is not degraded
  Given Word Catch is using real sight words
  When I play the game
  Then the frame rate should remain at 60fps
  And word spawning should be smooth
  And there should be no lag when words appear
  And catching words should be instant (no delay)
  And audio playback should be responsive
```

## Scenario: Edge Case - Request More Words Than Available

```gherkin
Scenario: Handle requesting more words than exist
  Given ContentProvider has 40 words total
  When I call getSightWords(50)
  Then only 40 words should be returned
  And no errors should be thrown
  And no null values should be in the array
```

## Scenario: Edge Case - Rapid Word Spawning

```gherkin
Scenario: Handle spawning many words quickly
  Given Word Catch is running
  When the spawn rate is set very high
  And many words spawn in quick succession
  Then each word should get a unique sight word
  And usedWords tracking should work correctly
  And no duplicate words should appear simultaneously
  And performance should remain stable
```

## Scenario: Edge Case - Extended Play Session

```gherkin
Scenario: Verify stability over long gameplay
  Given Word Catch is running
  When I play for 10+ minutes
  And hundreds of words have spawned
  Then memory usage should remain stable
  And usedWords array should not grow unbounded
  And word selection should remain random
  And no performance degradation should occur
  And no console errors should appear
```

## Acceptance Criteria

### Data File Creation
- [ ] `/assets/data/sight-words.json` exists
- [ ] JSON is valid and parseable
- [ ] Contains all required metadata fields
- [ ] Contains exactly 40 Dolch pre-primer words
- [ ] Each word has all required properties
- [ ] No duplicate words exist
- [ ] File is properly formatted and readable

### Audio File Generation
- [ ] 40 audio files created
- [ ] All files in `/assets/audio/sight-words/` folder
- [ ] Naming convention followed: `word-{word}.mp3`
- [ ] All files are playable
- [ ] Pronunciation is clear and correct
- [ ] Volume levels are normalized
- [ ] File sizes are reasonable (< 100KB each)
- [ ] Audio quality is child-friendly

### ContentProvider Implementation
- [ ] `loadSightWords()` method implemented
- [ ] `getRandomSightWord()` method implemented
- [ ] `getSightWords(count)` method implemented
- [ ] `getSightWordsByDifficulty(difficulty)` method implemented
- [ ] `getFallbackWords()` method implemented
- [ ] UsedWords tracking prevents immediate repetition
- [ ] UsedWords array limited to 10 entries
- [ ] Reset mechanism works when all words used

### Word Catch Integration
- [ ] Word Catch uses ContentProvider for words
- [ ] Real sight words appear in game
- [ ] Words display correctly (readable, sized appropriately)
- [ ] Word data attached to sprites
- [ ] Audio plays when words caught
- [ ] Word variety is maintained
- [ ] No immediate repetition occurs

### Error Handling
- [ ] Missing JSON file handled gracefully
- [ ] Malformed JSON handled gracefully
- [ ] Missing audio files handled gracefully
- [ ] Empty words array handled gracefully
- [ ] Fallback words loaded on errors
- [ ] All errors logged to console
- [ ] Game continues functioning despite errors

### Performance & Quality
- [ ] Game maintains 60fps
- [ ] No lag when spawning words
- [ ] Audio playback is responsive
- [ ] Memory usage remains stable
- [ ] No memory leaks over extended play
- [ ] All 40 words tested and working
- [ ] No console errors during normal gameplay

### Testing Completed
- [ ] All 40 words displayed in game
- [ ] All 40 audio files played
- [ ] Word variety verified (no repetition)
- [ ] Edge cases tested
- [ ] Extended play session tested
- [ ] Error conditions tested
- [ ] Performance verified

## Manual Testing Checklist

### Pre-Testing Setup
1. [ ] Create `/assets/data/` folder if not exists
2. [ ] Create `/assets/audio/sight-words/` folder
3. [ ] Create `sight-words.json` with all 40 words
4. [ ] Validate JSON syntax
5. [ ] Generate all 40 audio files
6. [ ] Verify 40 files in audio folder
7. [ ] Spot-check 5 audio files for quality

### ContentProvider Testing
8. [ ] Launch game with console open
9. [ ] Verify "Loaded 40 sight words" message
10. [ ] Call `getRandomSightWord()` in console
11. [ ] Verify word object returned
12. [ ] Call method 10 times, verify 10 different words
13. [ ] Call `getSightWords(5)`, verify 5 words returned
14. [ ] Call `getSightWordsByDifficulty(1)`, verify filtering works

### Game Integration Testing
15. [ ] Start Word Catch game
16. [ ] Observe first falling word (should be real sight word)
17. [ ] Catch word, verify audio plays
18. [ ] Catch 10 words, verify variety
19. [ ] Verify no console errors
20. [ ] Check framerate (should be 60fps)

### Audio Testing
21. [ ] Catch multiple different words
22. [ ] Verify each audio plays correctly
23. [ ] Check volume consistency
24. [ ] Verify pronunciation is clear
25. [ ] Test audio doesn't overlap harshly

### Error Handling Testing
26. [ ] Rename JSON file, reload game
27. [ ] Verify fallback words load
28. [ ] Restore JSON file
29. [ ] Temporarily delete one audio file
30. [ ] Catch that word, verify graceful handling
31. [ ] Restore audio file

### Extended Testing
32. [ ] Play for 5 minutes
33. [ ] Count unique words seen (should be high)
34. [ ] Verify no immediate repetition
35. [ ] Check performance remains stable
36. [ ] Verify no memory issues
37. [ ] Check console for any warnings/errors

### Edge Case Testing
38. [ ] Test with empty words array (if safe to test)
39. [ ] Test requesting 100 words (should return 40)
40. [ ] Test rapid spawning
41. [ ] Verify usedWords array doesn't grow beyond 10

## Success Criteria

**This phase is complete when:**
1. All 40 Dolch pre-primer words in `sight-words.json`
2. All 40 audio files generated and normalized
3. ContentProvider successfully loads and serves words
4. Word Catch displays real sight words
5. Audio plays correctly when words are caught
6. No immediate word repetition occurs
7. Error handling works (fallback to 5 words)
8. Performance is smooth (60fps maintained)
9. All testing checklists completed
10. Zero console errors during normal gameplay
11. All acceptance criteria met
12. Ready to proceed to Phase 28 (Word Catch Polish)

## Notes

**Testing Philosophy**
- Test happy path first (everything works)
- Then test sad path (things fail gracefully)
- Then test edge cases (boundary conditions)
- Finally test extended scenarios (long-term stability)

**What We're Testing**
- Data integrity (JSON valid, complete)
- Audio quality (clear, consistent, pleasant)
- Code logic (ContentProvider works correctly)
- Integration (Word Catch uses real data)
- Error handling (graceful degradation)
- Performance (smooth, responsive)
- User experience (Aurora will enjoy it)

**What We're NOT Testing**
- Learning effectiveness (future phases)
- Progress tracking (not implemented yet)
- Multiple word lists (not in scope)
- Custom word lists (future feature)
- Advanced difficulty (not needed yet)

**Priority Focus Areas**
1. **Correctness**: All 40 words must be accurate
2. **Audio Quality**: Aurora will hear these repeatedly
3. **Variety**: Repetition is boring and frustrating
4. **Reliability**: Game must not break if file missing
5. **Performance**: Must stay smooth and responsive

This phase establishes the educational foundation of Word Catch. Get it right!
