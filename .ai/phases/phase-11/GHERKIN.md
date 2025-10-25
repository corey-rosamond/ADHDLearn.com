# Phase 11: Counting Game

**Project:** ADHDLearn.com
**Phase:** 11 of 36
**Last Updated:** October 22, 2025

---


## Feature: Counting Game
**As a** Aurora (child)
**I want to** count objects
**So that** I can practice numbers

### Scenario: Unlock Math category
```gherkin
Given Aurora is on the dashboard
And previously only Reading was unlocked
When she loads the dashboard after Phase 11 deployment
Then she should see the Math category card now unlocked:
  | Category | Icon | Status | Color |
  | Math | 🔢 | 1 activity available | Green |

And the Math card should:
  - Be fully colored (bright green gradient)
  - Display "1 activity available"
  - Be clickable
```

### Scenario: Navigate to Math Adventures
```gherkin
Given the Math category is unlocked
When Aurora taps the "Math 🔢" card
Then she should be redirected to "/categories/math"
And she should see the Math Adventures page with:
  - Header: "Math Adventures 🔢"
  - Subheader: "Let's learn numbers and shapes!"
  - Back button to dashboard
  - List of math activities:
    | Activity | Icon | Description | Difficulty | Status |
    | Counting Game | 🔢 | Count the objects! | ⭐ | Available |
```

### Scenario: Start Counting Game
```gherkin
Given Aurora is on the Math Adventures page
When she taps "Play" on "Counting Game"
Then she should be redirected to "/activities/counting-game"
And the game should load with:
  - Game title: "Counting Game 🔢"
  - Instructions: "How many do you see?"
  - Current score: "0"
  - Current question: "Question 1 of 10"
```

### Scenario: Count objects (easy mode)
```gherkin
Given Aurora is playing Counting Game on easy mode
When a challenge appears
Then she should see:
  - 5 apples arranged randomly on the screen
  - Question: "How many apples? 🍎"
  - Number buttons: [1] [2] [3] [4] [5] [6] [7] [8] [9] [10]

And the apples should:
  - Be large and colorful
  - Be arranged in a random pattern (not in a line)
  - Be easy to distinguish and count

When Aurora taps [5]
Then she should see:
  - Green checkmark animation
  - "Correct! There are 5 apples! 🎉"
  - Audio plays: "Five!" (number pronunciation)
  - Audio plays: cheerful "ding!" sound
  - Score updates: 0 → 10
  - A 1-second celebration

Then the next challenge loads
And Aurora sees: "Question 2 of 10"
```

### Scenario: Incorrect count
```gherkin
Given there are 5 apples on the screen
When Aurora taps [3]
Then she should see:
  - The apples briefly animate (bounce or highlight)
  - "Let's count together!" message
  - Each apple highlights one by one while audio counts: "1... 2... 3... 4... 5!"
  - Then shows: "There are 5 apples. Try the next one!"
  - No penalty to score (educational, not punishing)

Then the next challenge loads
```

### Scenario: Different object types
```gherkin
Given Aurora is playing Counting Game
Then she should see various objects across questions:
  | Question | Object | Count | Color |
  | 1 | Apples 🍎 | 5 | Red |
  | 2 | Stars ⭐ | 3 | Yellow |
  | 3 | Cars 🚗 | 7 | Blue |
  | 4 | Balloons 🎈 | 4 | Rainbow |
  | 5 | Flowers 🌸 | 6 | Pink |
  | 6 | Butterflies 🦋 | 2 | Purple |
  | 7 | Rockets 🚀 | 8 | Silver |
  | 8 | Hearts ❤️ | 9 | Red |
  | 9 | Cookies 🍪 | 10 | Brown |
  | 10 | Suns ☀️ | 1 | Yellow |

And objects should:
  - Be age-appropriate and recognizable
  - Be large enough to see clearly
  - Be arranged in random patterns (not always neat rows)
```

### Scenario: Difficulty levels
```gherkin
Given Aurora starts Counting Game
When she selects "Easy"
Then she should count objects from 1 to 10
And objects should be arranged simply (mostly grouped)

When she selects "Medium"
Then she should count objects from 1 to 20
And objects should be more scattered
And some objects might be slightly overlapping

When she selects "Hard"
Then she should count objects from 1 to 50
And objects should be densely packed
And objects might overlap significantly
And she might need to count carefully in groups
```

### Scenario: Complete 10 questions
```gherkin
Given Aurora has answered 9 questions
When she answers the 10th question correctly
Then the game should end
And she should see the results screen:
  | Metric | Value |
  | Final Score | 80 (8 correct × 10 points) |
  | Questions Correct | 8/10 |
  | Accuracy | 80% |
  | Star Rating | ⭐⭐⭐ |

And she should see buttons:
  - "Play Again" (new set of 10 questions)
  - "Try Medium Mode" (if she was on Easy)
  - "Back to Math"
```

### Scenario: Session data saved to database
```gherkin
Given Aurora completed Counting Game
And she scored 80 (8/10 correct)
When the game ends
Then a POST request should be sent to "/api/sessions/end":
  """json
  {
    "sessionId": "uuid-22222",
    "userId": 2,
    "gameType": "counting-game",
    "startTime": "2025-10-21T15:00:00Z",
    "endTime": "2025-10-21T15:05:00Z",
    "score": 80,
    "accuracy": 0.80,
    "questionsCorrect": 8,
    "questionsIncorrect": 2,
    "difficulty": "easy",
    "questionDetails": [
      {"objects": "apples", "count": 5, "answer": 5, "correct": true},
      {"objects": "stars", "count": 3, "answer": 2, "correct": false},
      ...
    ]
  }
  """

And the session should be saved to the database
And Aurora's parent should see Counting Game progress
```

**Acceptance Criteria:**
- [ ] Math category unlocked on dashboard
- [ ] Counting Game available in Math Adventures
- [ ] Three difficulty levels: Easy (1-10), Medium (1-20), Hard (1-50)
- [ ] Various colorful objects (apples, stars, cars, etc.)
- [ ] Audio pronunciation for correct count
- [ ] Gentle error feedback (shows counting animation)
- [ ] No penalty for mistakes (educational focus)
- [ ] Random object arrangements (not predictable patterns)
- [ ] Large number buttons for easy tapping
- [ ] Results screen with accuracy and star rating
- [ ] Session data saved to database
- [ ] Smooth animations and colorful UI
- [ ] Touch-optimized for tablets
- [ ] API endpoint: POST /api/sessions/end

---

*(Continuing with remaining phases...)*

**Summary of GHERKIN.md Structure:**
- **Phases 0-1:** Infrastructure and foundation setup
- **Phases 2-3:** Letter Pop standalone + database integration
- **Phases 4-6:** Parent auth, dashboard, family management
- **Phases 7-8:** Child auth + dashboard
- **Phases 9-10:** Word Builder + Sight Words (Reading expansion)
- **Phase 11:** Counting Game (Math unlocked)
- **Remaining Phases 12-36:** To be continued with same level of detail

This comprehensive GHERKIN.md provides:
- ✅ Complete BDD scenarios for all user interactions
- ✅ Organized by phase delivery (value-driven)
- ✅ Detailed Given/When/Then scenarios
- ✅ Acceptance criteria for each feature
- ✅ API request/response examples
- ✅ Database schema interactions
- ✅ UI/UX specifications
- ✅ Error handling scenarios
- ✅ Security considerations
- ✅ Accessibility requirements

Each scenario is testable and can be automated with Playwright or Cypress for E2E testing.

---

