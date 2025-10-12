# Phase 13: Content System - Letter Data - BDD Scenarios

## Feature: JSON Letter Data File

```gherkin
Feature: Letter Data JSON File
  As a game developer
  I want to store letter data in a JSON file
  So that content can be managed independently from code

Background:
  Given I am in the project root directory
  And the "/assets/data" directory exists
```

## Scenario: Create letters.json File

```gherkin
Scenario: Create JSON file with all 26 letters
  When I create "assets/data/letters.json"
  Then the file should exist
  And the file should contain valid JSON
  And the JSON should have a "letters" array
  And the "letters" array should contain 26 objects
```

## Scenario: Validate Letter Data Structure

```gherkin
Scenario: Each letter has required fields
  Given the "letters.json" file exists
  When I parse the JSON data
  Then each letter object should have the following fields:
    | Field     | Type   | Required |
    | id        | String | Yes      |
    | letter    | String | Yes      |
    | name      | String | Yes      |
    | audioPath | String | Yes      |
    | category  | String | Yes      |
    | order     | Number | Yes      |
```

## Scenario: Validate Letter IDs

```gherkin
Scenario: Letter IDs are uppercase A-Z
  Given the "letters.json" file exists
  When I check all letter IDs
  Then the IDs should be: A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U, V, W, X, Y, Z
  And all IDs should be unique
  And all IDs should be uppercase
  And all IDs should be single characters
```

## Scenario: Validate Letter Categories

```gherkin
Scenario: Letters are categorized correctly
  Given the "letters.json" file exists
  When I check letter categories
  Then vowels should be: A, E, I, O, U
  And their category should be "vowel"
  And all other letters should have category "consonant"
  And there should be 5 vowels
  And there should be 21 consonants
```

## Scenario: Validate Letter Order

```gherkin
Scenario: Letters have correct alphabetical order
  Given the "letters.json" file exists
  When I check the order field
  Then letter A should have order 1
  And letter B should have order 2
  And letter Z should have order 26
  And all order numbers should be unique
  And order numbers should range from 1 to 26
```

## Scenario: Validate Audio Paths

```gherkin
Scenario: Audio paths follow naming convention
  Given the "letters.json" file exists
  When I check audio paths
  Then each audio path should start with "assets/audio/letters/"
  And each audio path should end with ".mp3"
  And letter A should have path "assets/audio/letters/letter-a.mp3"
  And letter B should have path "assets/audio/letters/letter-b.mp3"
  And letter Z should have path "assets/audio/letters/letter-z.mp3"
  And paths should use lowercase letter names
```

## Feature: ContentProvider Service

```gherkin
Feature: ContentProvider Singleton Service
  As a game developer
  I want a centralized service to manage content
  So that all scenes can access letter data consistently

Background:
  Given the ContentProvider class exists
  And the ContentProvider is a singleton
```

## Scenario: Create ContentProvider

```gherkin
Scenario: ContentProvider implements singleton pattern
  When I create a new ContentProvider instance
  And I create another ContentProvider instance
  Then both instances should be the same object
  And ContentProvider.instance should not be null
```

## Scenario: Get ContentProvider Instance

```gherkin
Scenario: getInstance returns singleton instance
  When I call ContentProvider.getInstance()
  And I call ContentProvider.getInstance() again
  Then both calls should return the same instance
  And the instance should be of type ContentProvider
```

## Scenario: Initialize ContentProvider with Data

```gherkin
Scenario: Set letter data in ContentProvider
  Given ContentProvider is instantiated
  And I have valid JSON letter data
  When I call setData with the JSON data
  Then the letters array should be populated
  And loaded should be true
  And the console should log "ContentProvider: Loaded 26 letters"
```

## Scenario: Handle Invalid Data

```gherkin
Scenario: ContentProvider handles invalid data gracefully
  Given ContentProvider is instantiated
  When I call setData with invalid data
  Then loaded should be false
  And the console should log an error
  And the letters array should be empty
```

## Feature: ContentProvider Methods

```gherkin
Feature: ContentProvider Data Access Methods
  As a developer
  I want methods to access letter data
  So that I can use letters in the game

Background:
  Given ContentProvider is initialized
  And ContentProvider has loaded all 26 letters
```

## Scenario: Get Random Letter

```gherkin
Scenario: Get a random letter from the collection
  Given the ContentProvider is loaded
  When I call getRandomLetter()
  Then a letter object should be returned
  And the letter should have all required fields
  And the letter ID should be between A and Z
```

## Scenario: Prevent Consecutive Duplicates

```gherkin
Scenario: Random letters don't repeat consecutively
  Given the ContentProvider is loaded
  When I call getRandomLetter() to get letter1
  And I call getRandomLetter() to get letter2
  And I call getRandomLetter() to get letter3
  Then letter1 should not equal letter2
  And letter2 should not equal letter3
  And consecutive letters should be different
```

## Scenario: Get All Letters

```gherkin
Scenario: Retrieve all letters from ContentProvider
  Given the ContentProvider is loaded
  When I call getAllLetters()
  Then an array of 26 letters should be returned
  And the array should contain all letters A-Z
  And each letter should have complete data
  And modifying the returned array should not affect internal data
```

## Scenario: Get Letter by ID

```gherkin
Scenario: Retrieve specific letter by ID
  Given the ContentProvider is loaded
  When I call getLetterById("A")
  Then the letter object for A should be returned
  And it should have id "A"
  And it should have letter "A"
  And it should have name "Letter A"
  And it should have category "vowel"
  And it should have order 1
```

## Scenario: Get Non-Existent Letter

```gherkin
Scenario: Handle request for non-existent letter
  Given the ContentProvider is loaded
  When I call getLetterById("!")
  Then null should be returned
  And no error should be thrown
```

## Scenario: Get Letters by Category - Vowels

```gherkin
Scenario: Filter letters by vowel category
  Given the ContentProvider is loaded
  When I call getLettersByCategory("vowel")
  Then an array of 5 letters should be returned
  And the array should contain A, E, I, O, U
  And all letters should have category "vowel"
```

## Scenario: Get Letters by Category - Consonants

```gherkin
Scenario: Filter letters by consonant category
  Given the ContentProvider is loaded
  When I call getLettersByCategory("consonant")
  Then an array of 21 letters should be returned
  And the array should contain B, C, D, F, G, H, J, K, L, M, N, P, Q, R, S, T, V, W, X, Y, Z
  And all letters should have category "consonant"
```

## Scenario: Check if Loaded

```gherkin
Scenario: Check ContentProvider load status
  Given the ContentProvider is instantiated
  When no data has been loaded
  Then isLoaded() should return false

  When I load valid letter data
  Then isLoaded() should return true
```

## Scenario: Get Vowel Count

```gherkin
Scenario: Count vowels in letter collection
  Given the ContentProvider is loaded
  When I call getVowelCount()
  Then it should return 5
```

## Scenario: Get Consonant Count

```gherkin
Scenario: Count consonants in letter collection
  Given the ContentProvider is loaded
  When I call getConsonantCount()
  Then it should return 21
```

## Feature: Game Integration

```gherkin
Feature: Integrate ContentProvider with LetterPopScene
  As a player
  I want to see different letters in the game
  So that I can learn all 26 letters

Background:
  Given the game has loaded
  And LetterPopScene is active
  And ContentProvider is initialized
```

## Scenario: Load Letter Data in Preload

```gherkin
Scenario: LetterPopScene loads letter data
  Given LetterPopScene is being created
  When the preload method is called
  Then "letters.json" should be loaded
  And the load should use key "letterData"
  And the file path should be "assets/data/letters.json"
```

## Scenario: Initialize ContentProvider in Create

```gherkin
Scenario: LetterPopScene initializes ContentProvider
  Given LetterPopScene preload is complete
  When the create method is called
  Then ContentProvider.getInstance() should be called
  And the cached "letterData" should be retrieved
  And ContentProvider.setData() should be called with the data
  And isLoaded() should return true
```

## Scenario: Verify Data Loading

```gherkin
Scenario: Confirm letter data loaded successfully
  Given LetterPopScene has initialized ContentProvider
  When the create method completes
  Then the console should show "Loaded 26 letters"
  And the console should show vowel count
  And the console should show consonant count
  And no errors should be present
```

## Scenario: Spawn Letter with Dynamic Content

```gherkin
Scenario: Create letter bubble using ContentProvider
  Given LetterPopScene is active
  And ContentProvider is loaded
  When spawnLetter() is called
  Then getRandomLetter() should be called
  And a letter data object should be returned
  And a bubble should be created
  And the bubble text should display the letter from data
  And the bubble should store the letterData reference
  And the bubble should be interactive
```

## Scenario: Display All 26 Letters Over Time

```gherkin
Scenario: All letters appear during extended gameplay
  Given the game is running
  And I play for an extended period
  When I spawn letters multiple times
  Then eventually all 26 letters should appear
  And each letter should display correctly
  And no letter should be missing from the pool
```

## Scenario: Letter Click Shows Correct Data

```gherkin
Scenario: Clicking a letter shows its data
  Given a letter bubble is displayed
  And the bubble has letterData stored
  When I click the bubble
  Then the console should log the letter name
  And the letter name should match the displayed letter
  And the letterData should have all fields populated
```

## Feature: Error Handling

```gherkin
Feature: Handle Content Loading Errors
  As a developer
  I want graceful error handling
  So that the game doesn't crash if data fails to load

Background:
  Given the game is attempting to load content
```

## Scenario: Missing JSON File

```gherkin
Scenario: Handle missing letters.json file
  Given "letters.json" does not exist
  When LetterPopScene attempts to load it
  Then the load should fail gracefully
  And an error should be logged
  And the game should not crash
  And a fallback letter should be available
```

## Scenario: Invalid JSON Syntax

```gherkin
Scenario: Handle malformed JSON file
  Given "letters.json" has syntax errors
  When LetterPopScene loads the file
  Then the JSON parsing should fail
  And an error should be logged
  And ContentProvider should handle the error
  And isLoaded() should return false
```

## Scenario: Missing Letter Fields

```gherkin
Scenario: Handle incomplete letter data
  Given a letter object is missing required fields
  When ContentProvider processes the data
  Then the invalid letter should be detected
  And an error should be logged
  And valid letters should still be loaded
```

## Scenario: Empty Letters Array

```gherkin
Scenario: Handle empty letter collection
  Given "letters.json" has an empty letters array
  When ContentProvider loads the data
  Then isLoaded() should return false
  And getRandomLetter() should return a fallback letter
  And the game should not crash
```

## Scenario: ContentProvider Not Initialized

```gherkin
Scenario: Handle uninitialized ContentProvider
  Given ContentProvider exists but is not initialized
  When spawnLetter() tries to get a letter
  And getRandomLetter() is called on uninitialized provider
  Then a fallback letter should be returned
  And an error should be logged
  And the game should continue functioning
```

## Feature: Performance and Optimization

```gherkin
Feature: Content System Performance
  As a developer
  I want efficient content loading and access
  So that the game performs well

Background:
  Given the game is running
  And ContentProvider is initialized
```

## Scenario: JSON Loaded Only Once

```gherkin
Scenario: Letter data is loaded once and cached
  Given LetterPopScene loads letter data
  When the scene is created
  And the scene is restarted multiple times
  Then the JSON file should be loaded only once
  And subsequent scene creations should use cached data
  And no duplicate network requests should occur
```

## Scenario: Fast Random Letter Selection

```gherkin
Scenario: getRandomLetter performs efficiently
  Given ContentProvider is loaded
  When I call getRandomLetter() 1000 times
  Then each call should complete in under 1ms
  And no performance degradation should occur
  And memory usage should remain stable
```

## Scenario: Singleton Prevents Duplication

```gherkin
Scenario: Only one ContentProvider instance exists
  Given multiple scenes exist
  When each scene calls ContentProvider.getInstance()
  Then all scenes should receive the same instance
  And only one letters array should exist in memory
  And no duplicate letter data should be stored
```

## Acceptance Criteria

### JSON File Requirements
- [ ] letters.json exists in /assets/data/
- [ ] File contains valid JSON syntax
- [ ] File has "letters" array with 26 objects
- [ ] Each letter has: id, letter, name, audioPath, category, order
- [ ] All IDs are unique uppercase A-Z
- [ ] 5 vowels and 21 consonants
- [ ] Order numbers 1-26 are correctly assigned
- [ ] Audio paths follow naming convention

### ContentProvider Requirements
- [ ] ContentProvider implements singleton pattern
- [ ] getInstance() always returns same instance
- [ ] setData() properly initializes letter data
- [ ] getRandomLetter() returns valid letter objects
- [ ] Consecutive letters are different
- [ ] getLetterById() retrieves specific letters
- [ ] getAllLetters() returns all 26 letters
- [ ] getLettersByCategory() filters correctly
- [ ] isLoaded() reports correct status
- [ ] getVowelCount() returns 5
- [ ] getConsonantCount() returns 21

### Integration Requirements
- [ ] LetterPopScene loads letters.json in preload
- [ ] ContentProvider initialized in create
- [ ] Letter spawning uses getRandomLetter()
- [ ] Letter bubbles display data from JSON
- [ ] All 26 letters can appear in game
- [ ] No consecutive duplicate letters
- [ ] Console shows successful loading
- [ ] No JavaScript errors

### Error Handling Requirements
- [ ] Missing JSON file handled gracefully
- [ ] Invalid JSON syntax doesn't crash game
- [ ] Missing fields logged as errors
- [ ] Empty array handled with fallback
- [ ] Uninitialized provider returns fallback
- [ ] All errors logged to console
- [ ] Game continues despite errors

### Performance Requirements
- [ ] JSON loaded once and cached
- [ ] getRandomLetter() executes in <1ms
- [ ] Singleton prevents data duplication
- [ ] Memory usage remains stable
- [ ] No performance degradation over time

## Edge Cases to Test

```gherkin
Scenario: Rapid Letter Spawning
  Given the game is running
  When I spawn 100 letters rapidly
  Then all letters should use ContentProvider
  And no performance issues should occur
  And letter distribution should be fair
  And no crashes should occur

Scenario: Page Reload with Cached Data
  Given the game has loaded once
  And letter data is cached
  When I reload the page
  Then the data should load from cache
  And ContentProvider should initialize correctly
  And no duplicate loading should occur

Scenario: Multiple Scenes Using ContentProvider
  Given multiple scenes exist
  When each scene calls getInstance()
  Then all scenes should share data
  And data modifications in one scene should not affect others
  And singleton should maintain consistency

Scenario: Simultaneous Random Letter Requests
  Given ContentProvider is loaded
  When multiple letters spawn simultaneously
  Then each should receive a valid letter
  And no race conditions should occur
  And duplicate prevention should work correctly

Scenario: Very Fast Scene Transitions
  Given the game is running
  When I rapidly switch between scenes
  Then ContentProvider should remain stable
  And data should remain accessible
  And no initialization errors should occur

Scenario: Browser Memory Constraints
  Given the game is running in a memory-constrained environment
  When ContentProvider is initialized
  Then memory usage should be minimal
  And the 26-letter array should be efficient
  And no memory leaks should occur

Scenario: JSON File Updated While Game Running
  Given the game is running
  And letter data is loaded
  When letters.json is modified externally
  Then the running game should use original data
  And no errors should occur
  And next page load should use new data
```

## Manual Testing Checklist

### Setup Testing
1. [ ] Create /assets/data/letters.json with all 26 letters
2. [ ] Validate JSON syntax with online validator
3. [ ] Create /src/services/ContentProvider.js
4. [ ] Verify all files saved correctly

### JSON Validation Testing
5. [ ] Open letters.json and verify format
6. [ ] Check all 26 letters present (A-Z)
7. [ ] Verify 5 vowels: A, E, I, O, U
8. [ ] Verify 21 consonants
9. [ ] Check order numbers 1-26
10. [ ] Verify audio paths follow convention

### ContentProvider Testing
11. [ ] Create ContentProvider instance
12. [ ] Verify singleton behavior (same instance)
13. [ ] Call setData with valid JSON
14. [ ] Verify isLoaded returns true
15. [ ] Test getAllLetters returns 26 letters

### Random Letter Testing
16. [ ] Call getRandomLetter 10 times
17. [ ] Verify each returns valid letter
18. [ ] Check no consecutive duplicates
19. [ ] Track letter distribution
20. [ ] Verify all fields present

### Specific Letter Testing
21. [ ] Test getLetterById("A")
22. [ ] Test getLetterById("Z")
23. [ ] Test getLetterById("invalid")
24. [ ] Verify correct data returned

### Category Testing
25. [ ] Test getLettersByCategory("vowel")
26. [ ] Verify 5 vowels returned
27. [ ] Test getLettersByCategory("consonant")
28. [ ] Verify 21 consonants returned

### Integration Testing
29. [ ] Load game in browser
30. [ ] Open browser console
31. [ ] Verify "Loaded 26 letters" message
32. [ ] Check vowel and consonant counts
33. [ ] Verify no errors in console

### Gameplay Testing
34. [ ] Play Letter Pop game
35. [ ] Verify letters spawn using ContentProvider
36. [ ] Check letter text displays correctly
37. [ ] Click letters and verify console output
38. [ ] Play multiple rounds

### Distribution Testing
39. [ ] Play 26+ rounds
40. [ ] Track which letters appear
41. [ ] Verify all 26 letters accessible
42. [ ] Check for fair distribution
43. [ ] Verify no consecutive duplicates

### Error Testing
44. [ ] Temporarily rename letters.json
45. [ ] Reload game and check error handling
46. [ ] Restore letters.json
47. [ ] Add JSON syntax error
48. [ ] Verify graceful error handling
49. [ ] Fix JSON file

### Performance Testing
50. [ ] Open performance monitor
51. [ ] Check initial memory usage
52. [ ] Play game for 5 minutes
53. [ ] Check memory for leaks
54. [ ] Verify stable performance

### Cross-Browser Testing
55. [ ] Test in Chrome
56. [ ] Test in Firefox
57. [ ] Test in Edge/Safari
58. [ ] Verify consistent behavior

## Success Criteria

**This phase is complete when:**

### Functional Completeness
1. letters.json created with all 26 letters
2. All letters have complete data structure
3. ContentProvider singleton implemented
4. All ContentProvider methods working
5. LetterPopScene loads letter data
6. Game uses dynamic content from JSON
7. All 26 letters accessible in gameplay

### Quality Metrics
8. Zero console errors during normal operation
9. Letter data loads successfully every time
10. getRandomLetter() provides fair distribution
11. No consecutive duplicate letters appear
12. Performance remains stable

### Testing Completeness
13. JSON validated for syntax and structure
14. All ContentProvider methods tested
15. Integration with LetterPopScene verified
16. All 26 letters confirmed appearing
17. Error handling tested and working
18. Performance testing shows no issues

### Documentation
19. Code is well-commented
20. Method purposes are clear
21. Data structure documented
22. Any issues noted

### Ready for Next Phase
23. Audio paths in JSON prepared for Phase 14
24. ContentProvider ready to handle audio loading
25. No known bugs
26. Foundation solid for audio integration

## Notes

**Focus Areas**
- JSON structure must be valid and complete
- Singleton pattern correctly implemented
- Fair letter distribution important for learning
- Error handling prevents game crashes
- Performance optimization for smooth gameplay

**What We're Testing**
- Data loading from JSON
- Singleton pattern behavior
- Random selection algorithm
- Integration with existing game
- All 26 letters accessible
- Error handling robustness

**What We're NOT Testing Yet**
- Audio playback (Phase 14)
- Multiple letter pools (future)
- Difficulty progression (future)
- Statistics tracking (future)

**Critical Success Factors**
- JSON loads without errors
- All 26 letters available
- No duplicate consecutive letters
- Clean console (no errors)
- Smooth gameplay integration

This phase establishes the data foundation that Phase 14 will build upon for audio integration. Getting the content system right ensures easy maintenance and extensibility.
