# Phase 13: Simple Addition Game

**Project:** ADHDLearn.com
**Phase:** 13 of 36
**Last Updated:** October 22, 2025

---


## Feature: Simple Addition Game
**As a** Aurora (child)
**I want to** practice adding numbers
**So that** I can learn basic math

### Scenario: Addition game loads
```gherkin
Given Aurora is on the Math Adventures page
When she taps "Play" on "Addition ➕"
Then she should be redirected to "/activities/addition"
And the game should load with:
  - Game title: "Addition ➕"
  - Instructions: "Add the numbers!"
  - Current score: "0"
  - Current question: "Question 1 of 10"
```

### Scenario: Solve addition problem
```gherkin
Given Aurora is playing Addition game
When a problem appears: "3 + 5 = ?"
Then she should see:
  - The equation displayed large: "3 + 5 = ?"
  - Visual representation: 3 apples on left, 5 apples on right
  - Audio plays: "3 plus 5 equals?" (spoken)
  - 4 answer choices: [6, 7, 8, 9]

When Aurora taps [8]
Then she should see:
  - "🎉 Correct!" message
  - Confetti animation
  - Score updates: 0 → 10
  - Audio plays: "Eight!"

Then the next problem loads
```

### Scenario: Incorrect answer with helpful feedback
```gherkin
Given the problem is "4 + 3 = ?"
When Aurora taps [8] (incorrect)
Then she should see:
  - "Not quite! The answer is 7" message
  - The visual objects briefly highlight and count
  - Audio plays: "Four... plus three... equals seven!"
  - No penalty to score (learning focused)

Then the next problem loads after 2.5 seconds
```

**Acceptance Criteria:**
- [ ] Addition game available in Math category (3rd game)
- [ ] Problems use numbers 1-10
- [ ] Answers never exceed 20
- [ ] Visual representation (count objects)
- [ ] Audio plays problem aloud
- [ ] 4 answer choices per problem
- [ ] Correct answers celebrate with animation
- [ ] Wrong answers show educational feedback
- [ ] 10 problems per session
- [ ] Session saves to database

---

