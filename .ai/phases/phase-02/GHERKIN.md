# Phase 2: Letter Pop Standalone - BDD Scenarios

**Project:** ADHDLearn.com
**Phase:** 2 of 36
**Last Updated:** October 22, 2025

---

## Feature: Letter Pop Standalone Deployment

**As a** Aurora (child user)
**I want to** play Letter Pop from my tablet
**So that** I can practice letter recognition

### Scenario: Access Letter Pop directly

```gherkin
Given Aurora's tablet is connected to the internet
When Aurora navigates to "https://child.adhdlearn.com"
Then she should see the Letter Pop game loading
And the game should load in <3 seconds
And no login screen should appear (standalone mode)
```

### Scenario: Configure Letter Pop settings

```gherkin
Given Aurora is on the Letter Pop start screen
When she sees the configuration options
Then she should see:
  | Option | Choices | Default |
  | Letter Case | Uppercase / Lowercase / Mixed | Uppercase |
  | Time Limit | 30 sec / 60 sec / 90 sec / No Limit | 60 sec |
  | Difficulty | Easy / Medium / Hard | Easy |

And all options should have large, colorful buttons
And each option should have an icon showing what it means

When Aurora taps "Lowercase"
Then the button should highlight with a bright color
And she should see a preview: "a b c d e..."

When Aurora taps "Start Game!"
Then the game should start immediately
And her settings should be saved to localStorage for next time
```

### Scenario: Play Letter Pop game

```gherkin
Given Aurora configured the game with:
  | Letter Case | Uppercase |
  | Time Limit | 60 seconds |
  | Difficulty | Easy |
When the game starts
Then Aurora should see:
  - A colorful game area with floating bubbles
  - Each bubble contains a letter (A-Z)
  - A target letter displayed large at the top: "Find the letter: A"
  - A countdown timer: "60"
  - Current score: "0"
  - A progress indicator: "0/5 letters found"

And the bubbles should:
  - Float upward smoothly
  - Bounce off the edges
  - Rotate slowly
  - Have different sizes (small, medium, large)
  - Have different colors (rainbow colors)

When Aurora taps a bubble with the letter "A"
Then she should see:
  - The bubble pops with sparkles and particles
  - A celebration animation
  - Score increases: 0 → 10
  - Progress updates: 0/5 → 1/5
  - Audio plays: "A!" (letter name pronunciation)
  - New target letter appears: "Find the letter: B"
  - A new bubble spawns to replace the popped one
```

### Scenario: Incorrect letter selection

```gherkin
Given the target letter is "A"
And Aurora taps a bubble with letter "B"
Then she should see:
  - The bubble shakes (gentle shake animation)
  - A subtle red flash on the bubble
  - Score remains unchanged
  - A gentle audio cue: "Try again!" (encouraging, not harsh)
  - The target remains "A"
  - The bubble remains in play
And no penalty should be applied to score
And the mistake should be tracked for analytics (stored locally)
```

### Scenario: Time running out warning

```gherkin
Given Aurora is playing Letter Pop
And 10 seconds remain on the timer
When the timer reaches 10
Then she should see:
  - Timer changes color to red
  - Timer pulses/blinks
  - Optional: gentle background music tempo increase
And this should alert her to hurry without causing stress
```

### Scenario: Game completion - time expires

```gherkin
Given Aurora has been playing for 60 seconds
And she has:
  | Score | 140 |
  | Letters Found | 14/20 attempted |
  | Correct | 14 |
  | Incorrect | 6 |
When the timer reaches 0
Then the game should end smoothly (fade out)
And Aurora should see the results screen with:
  | Metric | Value |
  | Final Score | 140 |
  | Accuracy | 70% (14 correct / 20 total) |
  | Time | 60 seconds |
  | Letters You Found | A, B, C, D, E, F, G, H, I, J, K, L, M, N |
  | Star Rating | ⭐⭐ (2 stars for 70% accuracy) |
  | Encouraging message | "Great job! You're getting better!" |

And she should see buttons:
  - "Play Again" (large, primary button)
  - "Change Settings" (secondary button)
```

### Scenario: Game completion - all letters found

```gherkin
Given Aurora is playing Letter Pop
And she successfully finds all 26 letters
And 15 seconds remain on the timer
When she taps the last letter
Then the game should end immediately
And she should see:
  - "Perfect! You found them all! 🎉"
  - Bonus confetti animation (screen fills with colorful confetti)
  - Bonus points added: +50 for perfect game
  - Results screen with 5 stars ⭐⭐⭐⭐⭐
  - Special achievement badge: "Letter Master!"
```

### Scenario: Scores saved to localStorage

```gherkin
Given Aurora completed a Letter Pop game
And she scored 140 points with 70% accuracy
When the game saves her score
Then a record should be stored in localStorage:
  """json
  {
    "sessionId": "uuid-12345",
    "timestamp": "2025-10-21T10:30:00Z",
    "score": 140,
    "accuracy": 0.70,
    "lettersCorrect": 14,
    "lettersIncorrect": 6,
    "duration": 60,
    "settings": {
      "letterCase": "uppercase",
      "timeLimit": 60,
      "difficulty": "easy"
    },
    "confusionPairs": [
      {"shown": "B", "selected": "D"},
      {"shown": "P", "selected": "Q"}
    ]
  }
  """

And this data should persist across browser refreshes
And Aurora should see her high score displayed on the start screen
```

### Scenario: View high scores

```gherkin
Given Aurora has played Letter Pop 5 times with scores:
  | Score | Accuracy | Date |
  | 140 | 70% | Today |
  | 160 | 80% | Yesterday |
  | 120 | 60% | 2 days ago |
  | 180 | 90% | 3 days ago |
  | 150 | 75% | 4 days ago |

When Aurora is on the start screen
Then she should see:
  - "Your High Score: 180 ⭐"
  - "Your Best Accuracy: 90% ⭐"
  - A "View All Scores" button

When Aurora taps "View All Scores"
Then she should see a list of her last 10 games:
  | Date | Score | Accuracy | Stars |
  | 3 days ago | 180 | 90% | ⭐⭐⭐⭐ |
  | Yesterday | 160 | 80% | ⭐⭐⭐ |
  | 4 days ago | 150 | 75% | ⭐⭐⭐ |
  | Today | 140 | 70% | ⭐⭐ |
  | 2 days ago | 120 | 60% | ⭐⭐ |
```

### Scenario: Responsive design on tablet

```gherkin
Given Aurora is using a Samsung Galaxy Tab S7 FE (12.4" screen)
When she loads Letter Pop
Then the game should:
  - Fill the entire screen (fullscreen mode)
  - Use landscape orientation
  - Have bubbles sized appropriately (not too small)
  - Have large touch targets (min 100px diameter)
  - Display text in large, readable font (min 24px)
  - Work smoothly at 60fps
  - Respond instantly to touch (<50ms latency)
```

### Scenario: Accessibility features

```gherkin
Given Aurora is playing Letter Pop
Then the game should provide:
  - Audio pronunciation for each letter
  - High contrast colors for visibility
  - No flashing lights (epilepsy safety)
  - Simple, clear instructions
  - Encouragement rather than criticism for mistakes
  - Option to pause the game
  - No time pressure in "No Limit" mode
```

---

## Acceptance Criteria

- [ ] Game loads in <3 seconds on tablet
- [ ] No login required (standalone mode)
- [ ] Settings saved to localStorage
- [ ] Scores saved to localStorage (max 100 sessions)
- [ ] Audio plays for each letter (MP3 files)
- [ ] Smooth animations at 60fps
- [ ] Touch-optimized for tablet (large targets)
- [ ] Responsive design (works on various screen sizes)
- [ ] No crashes or errors
- [ ] Encourages learning (positive feedback only)
- [ ] Works offline (after initial load)
- [ ] No external tracking or ads
- [ ] ADHD-friendly: fast feedback, colorful, engaging
