# Phase 19: Difficulty Levels - BDD Scenarios

## Feature: Three Difficulty Levels

```gherkin
Feature: Three Difficulty Levels
  As a young learner
  I want to play at a difficulty level that matches my skills
  So that I'm appropriately challenged without being frustrated or bored

Background:
  Given the game is running
  And DifficultyConfig is loaded
  And LetterPoolManager is initialized
```

## Scenario: Easy Difficulty Configuration

```gherkin
Scenario: Easy mode has beginner-friendly settings
  When I examine the Easy difficulty configuration
  Then it should have the following settings:
    | Setting          | Value                |
    | key              | "easy"               |
    | name             | "Easy"               |
    | bubbleCount      | 3                    |
    | letterCase       | "uppercase"          |
    | letterPool       | "common"             |
    | similarLetters   | false                |
    | bubbleSize       | 100                  |
    | bubbleSpacing    | 150                  |
    | color            | "#27ae60" (green)    |
    | icon             | "⭐"                 |
    | description      | "Perfect for beginners!" |
  And the common letters pool should contain letters A through M
  And the letter pool should have 13 letters total
```

## Scenario: Medium Difficulty Configuration

```gherkin
Scenario: Medium mode has standard settings
  When I examine the Medium difficulty configuration
  Then it should have the following settings:
    | Setting          | Value                     |
    | key              | "medium"                  |
    | name             | "Medium"                  |
    | bubbleCount      | 4                         |
    | letterCase       | "mixed"                   |
    | letterPool       | "all"                     |
    | similarLetters   | false                     |
    | bubbleSize       | 90                        |
    | bubbleSpacing    | 130                       |
    | color            | "#f39c12" (orange/yellow) |
    | icon             | "⭐⭐"                    |
    | description      | "Ready for more challenge?" |
  And the all letters pool should contain letters A through Z
  And the letter pool should have 26 letters total
```

## Scenario: Hard Difficulty Configuration

```gherkin
Scenario: Hard mode has advanced settings
  When I examine the Hard difficulty configuration
  Then it should have the following settings:
    | Setting          | Value                  |
    | key              | "hard"                 |
    | name             | "Hard"                 |
    | bubbleCount      | 5                      |
    | letterCase       | "mixed"                |
    | letterPool       | "similar"              |
    | similarLetters   | true                   |
    | bubbleSize       | 85                     |
    | bubbleSpacing    | 110                    |
    | color            | "#e74c3c" (red)        |
    | icon             | "⭐⭐⭐"               |
    | description      | "For letter masters!"  |
  And the similar letter pairs should include:
    | Letter | Similar To    |
    | b      | d, p, q       |
    | d      | b, p, q       |
    | p      | b, d, q       |
    | q      | b, d, p       |
    | m      | n, w          |
    | n      | m, w, u       |
    | w      | m, n, v       |
    | u      | v, n          |
    | v      | u, w          |
```

## Scenario: Display Difficulty Selection in Main Menu

```gherkin
Scenario: Main menu shows all three difficulty options
  Given MainMenu scene is loaded
  And ProgressManager has calculated recommended difficulty
  When the difficulty selection UI is created
  Then I should see 3 difficulty buttons
  And the Easy button should be:
    | Property    | Value                      |
    | Position    | Left (x: 150)              |
    | Color       | Green (#27ae60)            |
    | Icon        | ⭐                        |
    | Description | "Perfect for beginners!"   |
    | Bubble info | "3 bubbles"                |
  And the Medium button should be:
    | Property    | Value                      |
    | Position    | Center (x: 350)            |
    | Color       | Orange (#f39c12)           |
    | Icon        | ⭐⭐                       |
    | Description | "Ready for more challenge?" |
    | Bubble info | "4 bubbles"                |
  And the Hard button should be:
    | Property    | Value                   |
    | Position    | Right (x: 550)          |
    | Color       | Red (#e74c3c)           |
    | Icon        | ⭐⭐⭐                  |
    | Description | "For letter masters!"   |
    | Bubble info | "5 bubbles"             |
  And one button should show a "Recommended" badge
  And all buttons should be interactive
```

## Scenario: Select Difficulty in Main Menu

```gherkin
Scenario Outline: Player selects a difficulty level
  Given MainMenu scene is loaded
  And difficulty selection UI is displayed
  When the player clicks the <difficulty> button
  Then the <difficulty> button should be highlighted with a thicker border
  And a click sound should play
  And the selected difficulty should be stored as <difficulty>
  And the other difficulty buttons should have normal borders

  Examples:
    | difficulty |
    | Easy       |
    | Medium     |
    | Hard       |
```

## Scenario: Start Game with Selected Difficulty

```gherkin
Scenario Outline: Launch LetterPopScene with chosen difficulty
  Given MainMenu scene is loaded
  And the player has selected <difficulty> mode
  When the player clicks the "Play Game" button
  Then LetterPopScene should start
  And LetterPopScene should receive difficulty parameter: <difficulty_key>
  And the difficulty config should be loaded for <difficulty_key>

  Examples:
    | difficulty | difficulty_key |
    | Easy       | "easy"         |
    | Medium     | "medium"       |
    | Hard       | "hard"         |
```

## Scenario: Easy Mode Gameplay

```gherkin
Scenario: Play a round in Easy mode
  Given LetterPopScene is started with difficulty "easy"
  When the scene is created
  Then 3 bubbles should appear on screen
  And all letters should be uppercase only
  And the target letter should be from the common pool (A-M)
  And distractor letters should also be from the common pool
  And distractor letters should be visually distinct from target
  And bubbles should be positioned in a triangle formation
  And bubble size should be 100 pixels (diameter)
  And bubble spacing should be 150 pixels
  And the letter display should show uppercase only (e.g., "A")
  And the audio should say "Find the letter A"
```

## Scenario: Medium Mode Gameplay

```gherkin
Scenario: Play a round in Medium mode
  Given LetterPopScene is started with difficulty "medium"
  When the scene is created
  Then 4 bubbles should appear on screen
  And letters should be in mixed case format
  And the target letter should be from the full alphabet (A-Z)
  And distractor letters should also be from the full alphabet
  And distractors should not be similar-looking letters
  And bubbles should be positioned in a square formation
  And bubble size should be 90 pixels (diameter)
  And bubble spacing should be 130 pixels
  And the letter display should show mixed case (e.g., "Aa")
  And the audio should say "Find the letter A - uppercase A and lowercase a"
```

## Scenario: Hard Mode Gameplay

```gherkin
Scenario: Play a round in Hard mode with similar letters
  Given LetterPopScene is started with difficulty "hard"
  And the target letter is "b"
  When the scene is created
  Then 5 bubbles should appear on screen
  And letters should be in mixed case format
  And the target letter should be from the full alphabet
  And distractor letters should include similar letters: d, p, q
  And distractors may include: "d", "p", "q", and one random letter
  And bubbles should be positioned in a pentagon/cross formation
  And bubble size should be 85 pixels (diameter)
  And bubble spacing should be 110 pixels
  And the letter display should show mixed case (e.g., "Bb")
  And the audio should say "Find the letter B - uppercase B and lowercase b"
```

## Scenario: Letter Pool Management

```gherkin
Scenario Outline: Get letter pool based on difficulty
  Given LetterPoolManager is initialized
  When I call getLetterPool(<difficulty>)
  Then the returned pool should be <pool_type>
  And the pool should contain <count> letters
  And the pool should include <sample_letters>

  Examples:
    | difficulty | pool_type | count | sample_letters   |
    | "easy"     | common    | 13    | A, B, C... M     |
    | "medium"   | all       | 26    | A, B, C... Z     |
    | "hard"     | all       | 26    | A, B, C... Z     |
```

## Scenario: Generate Distractors for Easy Mode

```gherkin
Scenario: Generate simple distractors in Easy mode
  Given LetterPoolManager is initialized
  And the target letter is "A"
  And the difficulty is "easy"
  When I call generateDistractors("A", "easy", 2)
  Then I should receive 2 distractor letters
  And the distractors should be from the common pool (A-M)
  And the distractors should not include "A"
  And the distractors should be distinct from each other
  And the distractors should not be similar-looking letters
  And possible distractors include: B, C, D, E, F, G, H, I, J, K, L, M
```

## Scenario: Generate Distractors for Hard Mode with Similar Letters

```gherkin
Scenario: Generate challenging distractors in Hard mode
  Given LetterPoolManager is initialized
  And the target letter is "b"
  And the difficulty is "hard"
  When I call generateDistractors("b", "hard", 4)
  Then I should receive 4 distractor letters
  And the distractors should include similar letters: d, p, q
  And the similar letters should be prioritized
  And if more distractors needed, random letters should be added
  And the distractors should not include "b"
  And the distractors should be distinct from each other
  And likely distractors are: d, p, q, m (or another random)
```

## Scenario: Format Letter for Display

```gherkin
Scenario Outline: Format letters based on case setting
  Given LetterPoolManager is initialized
  When I call formatLetterForDisplay(<letter>, <case_type>)
  Then the result should be <formatted>

  Examples:
    | letter | case_type  | formatted |
    | "A"    | "uppercase"| "A"       |
    | "a"    | "uppercase"| "A"       |
    | "A"    | "lowercase"| "a"       |
    | "a"    | "lowercase"| "a"       |
    | "A"    | "mixed"    | "Aa"      |
    | "b"    | "mixed"    | "Bb"      |
```

## Scenario: Position Bubbles for Easy Mode (3 bubbles)

```gherkin
Scenario: Calculate bubble positions for Easy mode
  Given LetterPopScene is initialized with difficulty "easy"
  When I call calculateBubblePositions(3)
  Then I should receive 3 position objects
  And the positions should form a triangle:
    | Bubble | Position              |
    | 1      | Center top            |
    | 2      | Bottom left           |
    | 3      | Bottom right          |
  And the vertical spacing should be approximately 150 pixels
  And the horizontal spacing should be approximately 150 pixels
  And all positions should be within screen bounds
```

## Scenario: Position Bubbles for Medium Mode (4 bubbles)

```gherkin
Scenario: Calculate bubble positions for Medium mode
  Given LetterPopScene is initialized with difficulty "medium"
  When I call calculateBubblePositions(4)
  Then I should receive 4 position objects
  And the positions should form a square:
    | Bubble | Position       |
    | 1      | Top left       |
    | 2      | Top right      |
    | 3      | Bottom left    |
    | 4      | Bottom right   |
  And the spacing should be approximately 130 pixels
  And all positions should be within screen bounds
  And the layout should be centered on screen
```

## Scenario: Position Bubbles for Hard Mode (5 bubbles)

```gherkin
Scenario: Calculate bubble positions for Hard mode
  Given LetterPopScene is initialized with difficulty "hard"
  When I call calculateBubblePositions(5)
  Then I should receive 5 position objects
  And the positions should form a pentagon or cross pattern:
    | Bubble | Position          |
    | 1      | Top center        |
    | 2      | Middle left       |
    | 3      | Middle right      |
    | 4      | Bottom left       |
    | 5      | Bottom right      |
  And the spacing should be approximately 110 pixels
  And all positions should be within screen bounds
  And no bubbles should overlap
```

## Scenario: ProgressManager Recommends Difficulty

```gherkin
Scenario Outline: Recommend difficulty based on performance
  Given ProgressManager has tracked player performance
  And recent accuracy (last 5 rounds) is <accuracy>%
  And mastered letter count is <mastered>
  And longest streak is <streak>
  When I call getRecommendedDifficulty()
  Then the recommended difficulty should be <recommended>

  Examples:
    | accuracy | mastered | streak | recommended |
    | 95       | 20       | 8      | "hard"      |
    | 85       | 15       | 5      | "hard"      |
    | 80       | 12       | 4      | "medium"    |
    | 70       | 8        | 3      | "medium"    |
    | 60       | 10       | 2      | "medium"    |
    | 55       | 5        | 1      | "easy"      |
    | 45       | 3        | 0      | "easy"      |
```

## Scenario: Recommendation for New Player

```gherkin
Scenario: Recommend Easy for new players with no history
  Given ProgressManager has no performance history
  And the player has not completed any rounds
  When I call getRecommendedDifficulty()
  Then the recommended difficulty should be "easy"
  And the recommendation should be based on default values
```

## Scenario: Recommendation Updates After Performance

```gherkin
Scenario: Recommendation changes as player improves
  Given ProgressManager initially recommends "easy"
  And the player is playing in Easy mode
  When the player completes 5 rounds with 90% average accuracy
  And masters 12 letters
  And achieves a streak of 5
  Then the next time getRecommendedDifficulty() is called
  The recommended difficulty should update to "medium"
  And the recommendation should be shown in Main Menu
```

## Scenario: Pass Difficulty to ResultsScene

```gherkin
Scenario: ResultsScene receives difficulty information
  Given a round was played in Hard mode
  And the round is complete
  When LetterPopScene transitions to ResultsScene
  Then ResultsScene should receive:
    | Data Field  | Value   |
    | difficulty  | "hard"  |
    | score       | 8       |
    | total       | 10      |
  And ResultsScene should store the difficulty
  And the difficulty should be preserved for Play Again
```

## Scenario: Play Again Preserves Difficulty

```gherkin
Scenario: Replay with same difficulty level
  Given ResultsScene is displayed after a Hard mode round
  And the difficulty was "hard"
  When the player clicks "Play Again"
  Then LetterPopScene should start with difficulty "hard"
  And the game should use Hard mode settings (5 bubbles, etc.)
  And the player should not need to reselect difficulty
```

## Scenario: Return to Menu Allows Difficulty Change

```gherkin
Scenario: Change difficulty after viewing results
  Given ResultsScene is displayed after a Medium mode round
  When the player clicks "Main Menu"
  Then MainMenu should load
  And the difficulty selection UI should be displayed
  And the player can select a different difficulty
  And the recommended difficulty may have updated based on performance
```

## Scenario: Audio Instructions Match Case Mode

```gherkin
Scenario Outline: Audio text matches the letter case setting
  Given LetterPoolManager is initialized
  When I call getAudioText(<letter>, <case_type>)
  Then the audio text should be <expected_text>

  Examples:
    | letter | case_type   | expected_text                                                |
    | "A"    | "uppercase" | "Find the letter A"                                          |
    | "a"    | "lowercase" | "Find the lowercase letter a"                                |
    | "A"    | "mixed"     | "Find the letter A - uppercase A and lowercase a"            |
    | "B"    | "mixed"     | "Find the letter B - uppercase B and lowercase b"            |
```

## Scenario: Similar Letter Pairs in Hard Mode

```gherkin
Scenario: Hard mode uses confusable letter pairs
  Given LetterPoolManager is initialized
  And the similar letter pairs are defined
  When I check the similar pairs for letter "b"
  Then the similar letters should be: ["d", "p", "q"]
  When I check the similar pairs for letter "m"
  Then the similar letters should be: ["n", "w"]
  When I check the similar pairs for letter "u"
  Then the similar letters should be: ["v", "n"]
```

## Scenario: Difficulty Affects Bubble Size

```gherkin
Scenario Outline: Bubble size varies by difficulty
  Given LetterPopScene is initialized with difficulty <difficulty>
  When bubbles are created
  Then each bubble should have diameter <size> pixels

  Examples:
    | difficulty | size |
    | "easy"     | 100  |
    | "medium"   | 90   |
    | "hard"     | 85   |
```

## Scenario: Difficulty Affects Bubble Spacing

```gherkin
Scenario Outline: Bubble spacing varies by difficulty
  Given LetterPopScene is initialized with difficulty <difficulty>
  When bubble positions are calculated
  Then the spacing between bubbles should be <spacing> pixels

  Examples:
    | difficulty | spacing |
    | "easy"     | 150     |
    | "medium"   | 130     |
    | "hard"     | 110     |
```

## Scenario: Complete Round in Each Difficulty

```gherkin
Scenario Outline: Successfully complete rounds at all difficulties
  Given LetterPopScene is started with difficulty <difficulty>
  When the player completes all 10 letters
  Then ResultsScene should load
  And the difficulty should be preserved in results
  And the player should see appropriate feedback
  And the performance should be tracked for that difficulty

  Examples:
    | difficulty |
    | "easy"     |
    | "medium"   |
    | "hard"     |
```

## Scenario: Recommended Difficulty Badge

```gherkin
Scenario: Display recommended badge on appropriate difficulty
  Given MainMenu scene is loaded
  And ProgressManager recommends "medium" difficulty
  When the difficulty selection UI is created
  Then the Medium button should display a "Recommended" badge
  And the badge should be positioned above the button
  And the badge should have green background (#27ae60)
  And the badge text should be white
  And other difficulty buttons should not have a badge
```

## Scenario: Manual Override of Recommendation

```gherkin
Scenario: Player can choose different difficulty than recommended
  Given MainMenu scene is loaded
  And ProgressManager recommends "medium" difficulty
  And Medium button shows "Recommended" badge
  When the player clicks the "hard" button
  Then Hard difficulty should be selected
  And the selection should be stored
  And the player can play in Hard mode
  And the recommendation is respected but not enforced
```

## Scenario: Hover Effects on Difficulty Buttons

```gherkin
Scenario: Difficulty buttons respond to hover
  Given MainMenu difficulty selection is displayed
  When the player hovers over a difficulty button
  Then the button border should thicken
  And a hover sound should play
  When the player moves the mouse away
  Then the button border should return to normal thickness
  Unless that difficulty is currently selected
  Then the border should remain thick
```

## Scenario: Mixed Case Display Format

```gherkin
Scenario: Mixed case shows both letter forms
  Given LetterPopScene is in mixed case mode (Medium or Hard)
  And the target letter is "B"
  When the letter prompt is displayed
  Then the display should show "Bb"
  And both letters should be clearly visible
  And the uppercase "B" should be first
  And the lowercase "b" should be second
  And the font size should accommodate both letters
```

## Scenario: Difficulty Transition Messages

```gherkin
Scenario Outline: Encouraging messages when changing difficulty
  Given the player was playing at <old_difficulty>
  When the player selects <new_difficulty>
  Then an encouraging message should be shown or considered:
    | Message                               |
    | <transition_message>                  |

  Examples:
    | old_difficulty | new_difficulty | transition_message                |
    | "easy"         | "medium"       | "You're ready for more challenge!" |
    | "medium"       | "hard"         | "Amazing! You're a letter expert!" |
    | "hard"         | "medium"       | "Perfect level for you!"          |
    | "medium"       | "easy"         | "Let's practice the basics!"      |
```

## Scenario: Edge Cases - Empty Performance History

```gherkin
Scenario: Handle recommendation with minimal data
  Given ProgressManager has only 1 completed round
  And the accuracy was 100%
  When I call getRecommendedDifficulty()
  Then a recommendation should still be provided
  And the recommendation should be conservative
  And likely recommended difficulty is "easy" or "medium"
  And the system should not crash or error
```

## Scenario: Edge Cases - All Letters Mastered

```gherkin
Scenario: Recommendation when all letters mastered
  Given ProgressManager shows 26 letters mastered
  And recent accuracy is 95%
  And longest streak is 10+
  When I call getRecommendedDifficulty()
  Then the recommended difficulty should be "hard"
  And the player is recognized as advanced
```

## Scenario: Edge Cases - Very Low Performance

```gherkin
Scenario: Recommendation for struggling player
  Given ProgressManager shows recent accuracy of 20%
  And only 2 letters mastered
  And no significant streak
  When I call getRecommendedDifficulty()
  Then the recommended difficulty should be "easy"
  And the recommendation should be encouraging
  And there should be no negative messaging
```

## Acceptance Criteria

### Must Have - Configuration
- [ ] DifficultyConfig.js created with all three levels
- [ ] Easy: 3 bubbles, uppercase, common letters (A-M)
- [ ] Medium: 4 bubbles, mixed case, all letters (A-Z)
- [ ] Hard: 5 bubbles, mixed case, similar letter pairs
- [ ] Each config has all required properties
- [ ] Color coding: green (easy), orange (medium), red (hard)

### Must Have - Letter Pool Manager
- [ ] LetterPoolManager.js created
- [ ] getLetterPool() returns correct pool for difficulty
- [ ] getRandomLetter() works for each difficulty
- [ ] generateDistractors() creates appropriate wrong answers
- [ ] Hard mode uses similar letter pairs (b/d/p/q, etc.)
- [ ] formatLetterForDisplay() handles all case types
- [ ] getAudioText() generates correct instructions

### Must Have - Main Menu Integration
- [ ] MainMenu displays 3 difficulty buttons
- [ ] Each button shows icon, name, description
- [ ] Difficulty selection is interactive
- [ ] Selected difficulty is highlighted
- [ ] Recommended difficulty shows badge
- [ ] Play button passes difficulty to LetterPopScene

### Must Have - LetterPopScene Integration
- [ ] LetterPopScene accepts difficulty parameter
- [ ] Bubble count adjusts (3, 4, or 5)
- [ ] Letter case displays correctly (uppercase or mixed)
- [ ] Letter pool selection works
- [ ] Distractor generation appropriate for difficulty
- [ ] Bubble positioning works for all counts
- [ ] Bubble size and spacing adjust by difficulty

### Must Have - Progress Manager Recommendation
- [ ] ProgressManager.getRecommendedDifficulty() implemented
- [ ] Algorithm uses accuracy, mastery count, and streak
- [ ] Recommendation thresholds: <60% = easy, 60-85% = medium, >85% = hard
- [ ] New players default to "easy"
- [ ] Recommendation updates based on performance
- [ ] Recommendation is a suggestion, not enforced

### Must Have - Difficulty Persistence
- [ ] Difficulty passes from MainMenu to LetterPopScene
- [ ] Difficulty passes from LetterPopScene to ResultsScene
- [ ] Play Again preserves current difficulty
- [ ] Main Menu allows difficulty change

### Must Have - Similar Letters (Hard Mode)
- [ ] Similar letter pairs defined (b/d/p/q, m/n/w, u/v, etc.)
- [ ] Hard mode prioritizes similar letters as distractors
- [ ] Similar letters actually appear in Hard mode gameplay
- [ ] Visual confusion creates appropriate challenge

### Must Have - Mixed Case Display
- [ ] Mixed case shows both uppercase and lowercase
- [ ] Format: "Aa" (side-by-side)
- [ ] Both letters clearly visible and readable
- [ ] Audio instruction clarifies both forms
- [ ] Works in both Medium and Hard modes

### Must Have - Bubble Positioning
- [ ] 3 bubbles: triangle formation, 150px spacing
- [ ] 4 bubbles: square formation, 130px spacing
- [ ] 5 bubbles: pentagon formation, 110px spacing
- [ ] All bubbles visible on screen
- [ ] No overlap or off-screen placement

### Visual Verification
- [ ] Difficulty buttons attractive and clear
- [ ] Color coding consistent (green/orange/red)
- [ ] Icons display correctly (⭐, ⭐⭐, ⭐⭐⭐)
- [ ] "Recommended" badge visible and styled
- [ ] Hover effects work smoothly
- [ ] Mixed case letters ("Aa") readable
- [ ] All bubble counts display correctly

### Performance
- [ ] Smooth 60fps with 5 bubbles (Hard mode)
- [ ] No lag during difficulty selection
- [ ] Quick loading when switching difficulties
- [ ] No memory leaks across difficulty changes

### User Experience
- [ ] Difficulty selection is intuitive
- [ ] Recommendation is helpful not restrictive
- [ ] Can easily change difficulty
- [ ] All difficulties feel appropriately challenging
- [ ] No shame for choosing easier difficulty
- [ ] Progress feels natural and encouraging

### Technical
- [ ] No console errors
- [ ] No console warnings
- [ ] Code is well-commented
- [ ] Follows project architecture
- [ ] All imports/exports correct

## Manual Testing Checklist

### Setup
1. [ ] Create DifficultyConfig.js with all three configs
2. [ ] Create LetterPoolManager.js with all methods
3. [ ] Update LetterPopScene to accept difficulty
4. [ ] Update MainMenu with difficulty selection UI
5. [ ] Update ProgressManager with recommendation logic
6. [ ] Verify all files compile without errors

### Test Easy Mode
7. [ ] Open game, go to Main Menu
8. [ ] Verify Easy button visible (green, ⭐)
9. [ ] Click Easy button
10. [ ] Click Play Game
11. [ ] Verify 3 bubbles appear
12. [ ] Verify all letters are uppercase only
13. [ ] Verify letters are from A-M range
14. [ ] Verify distractors are visually distinct
15. [ ] Verify triangle bubble formation
16. [ ] Verify bubbles are large (100px)
17. [ ] Complete a full round
18. [ ] Verify gameplay is appropriate for beginners

### Test Medium Mode
19. [ ] Return to Main Menu
20. [ ] Verify Medium button visible (orange, ⭐⭐)
21. [ ] Click Medium button
22. [ ] Click Play Game
23. [ ] Verify 4 bubbles appear
24. [ ] Verify letters show mixed case (Aa format)
25. [ ] Verify letters can be from A-Z
26. [ ] Verify square bubble formation
27. [ ] Verify medium bubble size (90px)
28. [ ] Verify audio says "uppercase A and lowercase a"
29. [ ] Complete a full round
30. [ ] Verify gameplay is moderately challenging

### Test Hard Mode
31. [ ] Return to Main Menu
32. [ ] Verify Hard button visible (red, ⭐⭐⭐)
33. [ ] Click Hard button
34. [ ] Click Play Game
35. [ ] Verify 5 bubbles appear
36. [ ] Verify letters show mixed case (Aa format)
37. [ ] Play until target letter is 'b', 'd', 'p', or 'q'
38. [ ] Verify distractors include similar letters
39. [ ] Example: if target is 'b', distractors should have 'd', 'p', or 'q'
40. [ ] Verify pentagon/cross bubble formation
41. [ ] Verify smaller bubbles (85px)
42. [ ] Verify tighter spacing (110px)
43. [ ] Complete a full round
44. [ ] Verify gameplay is appropriately challenging

### Test Letter Pool Manager
45. [ ] Test getLetterPool("easy") - verify 13 letters (A-M)
46. [ ] Test getLetterPool("medium") - verify 26 letters (A-Z)
47. [ ] Test getLetterPool("hard") - verify 26 letters
48. [ ] Test generateDistractors for "b" in hard mode
49. [ ] Verify distractors include d, p, q
50. [ ] Test formatLetterForDisplay("A", "uppercase") - verify "A"
51. [ ] Test formatLetterForDisplay("A", "mixed") - verify "Aa"
52. [ ] Test getAudioText with different case modes

### Test Recommendation System
53. [ ] Start new game (no history)
54. [ ] Verify Easy is recommended
55. [ ] Play 5 rounds with 50% accuracy
56. [ ] Check recommendation - should still be Easy
57. [ ] Play 5 rounds with 75% accuracy
58. [ ] Check recommendation - should update to Medium
59. [ ] Play 5 rounds with 90% accuracy
60. [ ] Master 15+ letters
61. [ ] Check recommendation - should update to Hard
62. [ ] Verify recommendation updates dynamically

### Test UI Interactions
63. [ ] Hover over Easy button - verify border thickens
64. [ ] Hover over Medium button - verify border thickens
65. [ ] Hover over Hard button - verify border thickens
66. [ ] Click each difficulty - verify selection highlight
67. [ ] Verify only one difficulty selected at a time
68. [ ] Verify "Recommended" badge appears on correct button

### Test Difficulty Persistence
69. [ ] Select Medium difficulty
70. [ ] Play a round
71. [ ] Complete round, see ResultsScene
72. [ ] Click "Play Again"
73. [ ] Verify new round is still Medium (4 bubbles)
74. [ ] Click "Main Menu"
75. [ ] Verify can change difficulty
76. [ ] Select different difficulty and verify it changes

### Test Bubble Positioning
77. [ ] Play Easy mode - verify 3 bubbles in triangle
78. [ ] Measure spacing - approximately 150px
79. [ ] Play Medium mode - verify 4 bubbles in square
80. [ ] Measure spacing - approximately 130px
81. [ ] Play Hard mode - verify 5 bubbles in pentagon
82. [ ] Measure spacing - approximately 110px
83. [ ] Verify no bubbles overlap
84. [ ] Verify all bubbles on screen

### Test Mixed Case Display
85. [ ] Play Medium or Hard mode
86. [ ] Verify target letter shows both cases (Aa)
87. [ ] Verify bubbles show both cases
88. [ ] Verify font size accommodates both letters
89. [ ] Verify both letters are readable
90. [ ] Listen to audio - verify mentions both cases

### Test Similar Letters
91. [ ] Play multiple rounds in Hard mode
92. [ ] Track when target is b, d, p, or q
93. [ ] Verify distractors include similar shapes
94. [ ] Verify challenge is appropriate
95. [ ] Test other similar pairs (m/n, u/v)

### Test Edge Cases
96. [ ] Test with brand new player (no history)
97. [ ] Test with all 26 letters mastered
98. [ ] Test with very low performance (20%)
99. [ ] Test rapid difficulty switching
100. [ ] Test completing rounds at all three difficulties

### Performance Testing
101. [ ] Monitor FPS in Easy mode (should be 60fps)
102. [ ] Monitor FPS in Medium mode (should be 60fps)
103. [ ] Monitor FPS in Hard mode (should be 60fps)
104. [ ] Check memory usage across difficulty changes
105. [ ] Verify no memory leaks

### Cross-Browser Testing
106. [ ] Test in Chrome
107. [ ] Test in Firefox
108. [ ] Test in Safari (if available)
109. [ ] Verify consistent behavior

## Success Criteria

**This phase is complete when:**
1. All three difficulty levels are fully implemented
2. DifficultyConfig and LetterPoolManager created and working
3. MainMenu displays difficulty selection UI correctly
4. Players can select any difficulty level
5. Recommended difficulty is calculated and displayed
6. Bubble count adjusts correctly (3, 4, 5)
7. Letter case modes work (uppercase, mixed)
8. Letter pools work (common, all, similar)
9. Similar letters appear in Hard mode as distractors
10. Bubble positioning works for all counts
11. Bubble size and spacing adjust by difficulty
12. Difficulty persists correctly (Play Again)
13. Difficulty can be changed (Main Menu)
14. Performance is smooth at all difficulty levels
15. All acceptance criteria are met
16. Manual testing checklist is complete
17. No console errors or warnings
18. Ready for playtesting with target age group

## Notes

**Testing with Target Users**
- If possible, observe children playing at different difficulties
- Watch for frustration (difficulty too high)
- Watch for boredom (difficulty too low)
- Note which difficulties they gravitate toward
- Adjust thresholds based on actual behavior

**Similar Letter Pairs**
- b/d/p/q is classic confusion for young readers
- These pairs are developmentally appropriate
- May need to adjust if too challenging in testing
- Consider age ranges (5-6 vs 6-7)

**Recommendation Algorithm**
- Current thresholds are estimates
- Refine based on actual player data
- Consider weighted scoring in future
- May need different thresholds for different age groups

**Future Enhancements**
- Adaptive difficulty (auto-adjusts during play)
- Custom difficulty settings
- Time challenges for advanced players
- Unlock system (earn Hard mode)
- Difficulty-based achievements
- Parent/teacher difficulty override

This difficulty system should provide an appropriate challenge for every child while maintaining engagement and building confidence.
