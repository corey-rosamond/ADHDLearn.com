# Phase 9: Word Builder Game

**Project:** ADHDLearn.com
**Phase:** 9 of 36
**Last Updated:** October 22, 2025

---


## Feature: Word Builder Game
**As a** Aurora (child)
**I want to** build words from letter tiles
**So that** I can practice spelling and phonics

### Scenario: Start Word Builder from dashboard
```gherkin
Given Aurora is on the dashboard
And the Reading category is unlocked
When she taps "Reading 📚"
Then she should see the Reading Adventures page with activities:
  | Activity | Icon | Description | Difficulty | Status |
  | Letter Pop | 🎈 | Pop the correct letters! | ⭐ | Available |
  | Word Builder | 🏗️ | Build words from letters! | ⭐⭐ | Available |

When she taps "Play" on "Word Builder"
Then she should be redirected to "/activities/word-builder"
And the game should load
```

### Scenario: Word Builder game loads
```gherkin
Given Aurora started Word Builder
When the game loads
Then she should see:
  - Game title: "Word Builder 🏗️"
  - Instructions: "Spell the word!"
  - Current score: "0"
  - Current word number: "Word 1 of 10"

And she should see the first word challenge:
  - An image of a simple object (e.g., a CAT)
  - Audio plays automatically: "CAT" (word pronunciation)
  - A row of letter tiles below: [C] [A] [T] [B] [E]
  - Empty slots for the word: _ _ _
  - A "Hint" button (plays audio again)
  - A "Skip" button (move to next word, no points)
```

### Scenario: Build word correctly
```gherkin
Given the target word is "CAT"
And Aurora sees letter tiles: [C] [A] [T] [B] [E]
And empty slots: _ _ _

When Aurora drags [C] to the first slot
Then she should see:
  - The [C] tile snaps into place in slot 1
  - Slot 1 filled: [C] _ _
  - The [C] tile removed from available tiles
  - Audio plays: "C" (letter sound)
  - Gentle animation (tile slides into place)

When Aurora drags [A] to the second slot
Then she should see:
  - Slots filled: [C] [A] _
  - Audio plays: "A" (letter sound)

When Aurora drags [T] to the third slot
Then she should see:
  - Word complete: [C] [A] [T]
  - Audio plays: "CAT" (full word pronunciation)
  - Celebration animation (confetti, sparkles)
  - "Great job! +20 points" message
  - Score updates: 0 → 20
  - A 2-second delay for celebration

Then the next word should load automatically
And Aurora should see: "Word 2 of 10"
```

### Scenario: Incorrect letter placement
```gherkin
Given the target word is "CAT"
And Aurora has placed [C] in slot 1: [C] _ _
When Aurora drags [B] to the second slot
Then she should see:
  - The slot shakes (error animation)
  - The [B] tile returns to the available tiles area
  - Audio plays: "Try a different letter!" (encouraging)
  - No penalty to score (mistakes are okay)
  - The slot remains empty: [C] _ _

And Aurora can try again with a different letter
```

### Scenario: Drag and drop mechanics
```gherkin
Given Aurora is playing Word Builder
When she presses and holds on the [C] tile
Then the tile should:
  - Enlarge slightly (scale to 1.2x)
  - Follow her finger/cursor
  - Have a drop shadow

When she drags over a valid drop zone (empty slot)
Then the slot should:
  - Highlight (glow effect)
  - Indicate it can accept the tile

When she releases the [C] tile over slot 1
Then the tile should:
  - Snap into the slot
  - Animate smoothly
  - Play letter sound

When she drags a tile over an invalid area (not a slot)
And she releases the tile
Then the tile should:
  - Return to the available tiles area (spring animation)
  - No sound plays
```

### Scenario: Use hint button
```gherkin
Given Aurora is on the word "CAT"
And she hasn't placed any letters yet
When she taps the "Hint" button
Then she should:
  - Hear the word pronounced again: "CAT"
  - See a brief animation on the image (pulse)
  - Be able to use hint unlimited times (no penalty)
```

### Scenario: Skip word
```gherkin
Given Aurora is on the word "CAT"
And she finds it too hard
When she taps the "Skip" button
Then she should see a confirmation modal:
  """
  Skip this word?
  You won't earn points for this word.
  [Cancel] [Skip]
  """

When she taps "Skip"
Then:
  - The modal closes
  - No points are awarded
  - The next word loads
  - Word counter updates: "Word 2 of 10"
```

### Scenario: Complete all 10 words
```gherkin
Given Aurora has completed 9 words correctly
And she is on word 10 of 10
When she completes the final word "DOG"
Then the game should end
And she should see the results screen:
  | Metric | Value |
  | Final Score | 180 (9 words × 20 points) |
  | Words Completed | 9/10 |
  | Words Skipped | 1 |
  | Accuracy | 90% |
  | Star Rating | ⭐⭐⭐⭐ |

And she should see buttons:
  - "Play Again" (restart with new words)
  - "Back to Reading" (return to Reading Adventures)
```

### Scenario: Progressive difficulty
```gherkin
Given Aurora is starting Word Builder
When she plays words 1-3
Then the words should be 3-letter words:
  | Word | Image |
  | CAT | Cat image |
  | DOG | Dog image |
  | SUN | Sun image |

When she completes words 4-7
Then the words should be 4-letter words:
  | Word | Image |
  | BIRD | Bird image |
  | TREE | Tree image |
  | FROG | Frog image |

When she completes words 8-10
Then the words should be 5-letter words:
  | Word | Image |
  | HOUSE | House image |
  | APPLE | Apple image |
  | TIGER | Tiger image |
```

### Scenario: Session data saved to database
```gherkin
Given Aurora completed Word Builder
And she scored 180 points (9/10 words correct)
When the game ends
Then a POST request should be sent to "/api/sessions/end":
  """json
  {
    "sessionId": "uuid-67890",
    "userId": 2,
    "gameType": "word-builder",
    "startTime": "2025-10-21T11:00:00Z",
    "endTime": "2025-10-21T11:10:00Z",
    "score": 180,
    "accuracy": 0.90,
    "wordsCompleted": 9,
    "wordsSkipped": 1,
    "totalWords": 10,
    "mistakesByWord": {
      "CAT": 0,
      "DOG": 2,
      "SUN": 0
    }
  }
  """

And the session should be saved to the database
And Aurora's parent should see the new session in the progress dashboard
```

**Acceptance Criteria:**
- [ ] Drag-and-drop letter tiles (touch and mouse support)
- [ ] Touch-friendly for tablets (large targets)
- [ ] Audio for each letter and complete word
- [ ] Progressive difficulty (3-letter → 4-letter → 5-letter)
- [ ] Word list curated for age-appropriateness
- [ ] Images clear and recognizable (professionally designed or stock photos)
- [ ] Hint button plays word audio (unlimited use, no penalty)
- [ ] Skip button allows skipping difficult words (no points)
- [ ] Mistakes don't penalize score (encouragement-focused)
- [ ] Smooth animations for engagement
- [ ] Game session saved to database
- [ ] Results screen shows score, accuracy, star rating
- [ ] Works on various screen sizes (responsive)
- [ ] No crashes or errors
- [ ] API endpoint: POST /api/sessions/end

---

