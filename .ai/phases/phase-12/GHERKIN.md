# Phase 12: Shapes Recognition Game

**Project:** ADHDLearn.com
**Phase:** 12 of 36
**Last Updated:** October 22, 2025

---


## Feature: Shapes Recognition Game
**As a** Aurora (child)
**I want to** identify different shapes
**So that** I can learn geometry basics

### Scenario: Access Shapes game
```gherkin
Given Aurora is on the Math Adventures page
Then she should see:
  | Activity | Icon | Description | Difficulty | Status |
  | Counting Game | 🔢 | Count the objects! | ⭐ | Available |
  | Shapes | 🔷 | Learn shapes! | ⭐⭐ | Available |

When she taps "Play" on "Shapes"
Then she should be redirected to "/activities/shapes"
And the game should load
```

### Scenario: Shapes game loads and plays
```gherkin
Given Aurora started Shapes game
When the game loads
Then she should see:
  - Game title: "Shapes 🔷"
  - Instructions: "Find the shape!"
  - Current score: "0"
  - Current question: "Question 1 of 10"
  - A large shape displayed (e.g., Circle)
  - Audio plays: "Circle" (shape name pronunciation)
  - 4 shape name choices below

When the target shape is "Circle"
And Aurora sees 4 choices: [Circle, Square, Triangle, Rectangle]
And Aurora taps "Circle"
Then she should see:
  - Green checkmark animation
  - "✅ Correct!" message
  - Target shape spins and grows (celebration)
  - Audio plays: "Circle" (repeat)
  - Score updates: 0 → 10

Then the next question loads automatically
And Aurora sees: "Question 2 of 10"
```

### Scenario: Incorrect shape selection
```gherkin
Given the target shape is "Triangle"
When Aurora taps "Square"
Then she should see:
  - "That's a Triangle! Try again!" message
  - Camera shake effect
  - No penalty to score
  - 2-second delay showing correct answer

Then the next question loads
```

**Acceptance Criteria:**
- [ ] Shapes game available in Math category
- [ ] 8 shapes supported: Circle, Square, Triangle, Rectangle, Star, Heart, Hexagon, Oval
- [ ] Each shape has unique color
- [ ] Audio pronunciation for each shape
- [ ] 4 multiple-choice answers per question
- [ ] Hover effects on answer buttons
- [ ] Celebration animation for correct answers
- [ ] Friendly feedback for wrong answers
- [ ] 10 questions per session
- [ ] Session saves to database
- [ ] Results screen displays

---

