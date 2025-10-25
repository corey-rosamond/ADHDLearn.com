# Phase 10: Sight Words Game

**Project:** ADHDLearn.com
**Phase:** 10 of 36
**Last Updated:** October 22, 2025

---


## Feature: Sight Words Flash Cards
**As a** Aurora (child)
**I want to** practice common sight words
**So that** I can read faster

### Scenario: Access Sight Words game
```gherkin
Given Aurora is on the Reading Adventures page
Then she should see:
  | Activity | Icon | Description | Difficulty | Status |
  | Letter Pop | 🎈 | Pop the correct letters! | ⭐ | Available |
  | Word Builder | 🏗️ | Build words from letters! | ⭐⭐ | Available |
  | Sight Words | 👀 | Learn common words! | ⭐⭐⭐ | Available |

When she taps "Play" on "Sight Words"
Then she should be redirected to "/activities/sight-words"
And the game should load
```

### Scenario: Sight Words game loads
```gherkin
Given Aurora started Sight Words
When the game loads
Then she should see:
  - Game title: "Sight Words 👀"
  - Instructions: "Read the word and pick the right picture!"
  - Current score: "0"
  - Current word number: "Word 1 of 20"
  - A large sight word displayed: "THE"
  - Audio plays automatically: "THE" (word pronunciation)
  - 3 image choices below

And she should see a "Hear Again" button to replay audio
```

### Scenario: Correct answer selection
```gherkin
Given the sight word is "THE"
And Aurora sees 3 image choices:
  | Image | Description | Correct? |
  | Sentence: "THE cat sat" | Shows "the" in context | Yes |
  | Picture of a cat | Unrelated | No |
  | Picture of a ball | Unrelated | No |

When Aurora taps the first image (sentence with "the")
Then she should see:
  - Green checkmark animation on the selected image
  - "Correct! That's THE!" with celebration animation
  - Audio plays: "Correct!" + "THE"
  - Score updates: 0 → 10
  - A 1-second celebration delay

Then the next word should load automatically
And Aurora should see: "Word 2 of 20"
```

### Scenario: Incorrect answer selection
```gherkin
Given the sight word is "THE"
When Aurora taps the wrong image (cat picture)
Then she should see:
  - Red X animation on the selected image
  - The correct image highlighted in green
  - "Oops! The correct answer was this one. Let's try another!"
  - Audio plays: "Try again!" (gentle)
  - No penalty to score (mistakes are learning opportunities)
  - A 2-second delay showing the correct answer

Then the next word should load automatically
```

### Scenario: Dolch sight word list
```gherkin
Given Aurora is playing Sight Words
Then the game should use the Dolch sight word list:
  | Level | Word Count | Examples |
  | Pre-Primer | 40 words | a, and, away, big, blue, can, come, down |
  | Primer | 52 words | all, am, are, at, ate, be, black, brown |
  | First Grade | 41 words | after, again, an, any, as, ask, by, could |
  | Second Grade | 46 words | always, around, because, been, before, best |
  | Third Grade | 41 words | about, better, bring, carry, clean, cut, done |

And the game should:
  - Start with Pre-Primer words
  - Progress to harder levels as Aurora succeeds
  - Track which words Aurora knows vs struggles with
```

### Scenario: Adaptive difficulty (spaced repetition)
```gherkin
Given Aurora has played Sight Words 10 times
And she consistently gets "THE" correct (10/10 times)
And she struggles with "BECAUSE" (3/10 times correct)

When Aurora plays a new session
Then the game should:
  - Show "BECAUSE" more frequently (every 3-5 words)
  - Show "THE" less frequently (every 10-15 words)
  - Prioritize words Aurora needs to practice

And this should help Aurora master difficult words faster
```

### Scenario: Visual context for comprehension
```gherkin
Given the sight word is "RUN"
Then Aurora should see 3 image choices:
  | Image | Description |
  | Child running | Correct - shows action of running |
  | Child sitting | Incorrect - opposite action |
  | Child eating | Incorrect - unrelated action |

Given the sight word is "BLUE"
Then Aurora should see 3 image choices:
  | Image | Description |
  | Blue object (ball, sky, etc.) | Correct |
  | Red object | Incorrect |
  | Green object | Incorrect |

And all images should:
  - Be age-appropriate
  - Be clear and recognizable
  - Help Aurora understand word meaning (not just memorize)
```

### Scenario: Complete 20 words
```gherkin
Given Aurora has answered 19 sight words
When she answers the 20th word correctly
Then the game should end
And she should see the results screen:
  | Metric | Value |
  | Final Score | 170 (17 correct × 10 points) |
  | Words Correct | 17/20 |
  | Accuracy | 85% |
  | Star Rating | ⭐⭐⭐⭐ |
  | Words You Mastered | THE, AND, A, IS, TO, IN, IT, YOU, OF, FOR, ... |
  | Words To Practice | BECAUSE, WHICH, WOULD |

And she should see buttons:
  - "Play Again" (new set of 20 words)
  - "Practice Difficult Words" (focus on words she missed)
  - "Back to Reading"
```

### Scenario: Practice difficult words mode
```gherkin
Given Aurora completed a session
And she missed 3 words: BECAUSE, WHICH, WOULD
When she taps "Practice Difficult Words"
Then a new session should start with only:
  - The 3 words she missed
  - Repeated multiple times (e.g., 5 times each = 15 questions)
  - To help her master these specific words
```

### Scenario: Session data saved to database
```gherkin
Given Aurora completed Sight Words
And she scored 170 (17/20 correct)
When the game ends
Then a POST request should be sent to "/api/sessions/end":
  """json
  {
    "sessionId": "uuid-11111",
    "userId": 2,
    "gameType": "sight-words",
    "startTime": "2025-10-21T14:00:00Z",
    "endTime": "2025-10-21T14:08:00Z",
    "score": 170,
    "accuracy": 0.85,
    "wordsCorrect": 17,
    "wordsIncorrect": 3,
    "wordDetails": [
      {"word": "THE", "correct": true},
      {"word": "AND", "correct": true},
      {"word": "BECAUSE", "correct": false},
      ...
    ]
  }
  """

And the session should be saved to the database
And Aurora's parent should see Sight Words progress in the dashboard
```

**Acceptance Criteria:**
- [ ] Dolch sight word list (220 words total)
- [ ] Adaptive difficulty using spaced repetition algorithm
- [ ] Words Aurora struggles with appear more frequently
- [ ] Audio pronunciation for each word
- [ ] Visual context (images) to help comprehension
- [ ] Gentle error feedback (no harsh penalties)
- [ ] Results show which words to practice
- [ ] "Practice Difficult Words" mode for targeted learning
- [ ] Session data saved to database with word-by-word details
- [ ] Star rating based on accuracy (5 stars for 90%+, 4 stars for 80%+, etc.)
- [ ] Smooth animations and colorful UI
- [ ] Touch-optimized for tablets
- [ ] API endpoint: POST /api/sessions/end

---

