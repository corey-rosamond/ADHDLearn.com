# Phase 18: Confusion Matrix (Letter Pop)

**Project:** ADHDLearn.com
**Phase:** 18 of 36
**Last Updated:** October 22, 2025

---


## Feature: Letter Confusion Analysis
**As a** parent
**I want to** see which letters Aurora confuses
**So that** I can help her practice specific letters

### Scenario: Track letter confusion
```gherkin
Given Aurora is playing Letter Pop
When the target letter is "b"
And Aurora clicks "d" balloon (incorrect)
Then the system should record:
  - Target letter: "b"
  - Clicked letter: "d"
  - Is correct: false
  - Reaction time: 1250ms
And this attempt should be saved to letter_pop_attempts table
```

### Scenario: View confusion matrix
```gherkin
Given Aurora has played Letter Pop 20 times
And she confused "b" with "d" 8 times
And she confused "p" with "q" 3 times
When I view the parent dashboard confusion matrix
Then I should see:
  - "Most Common Confusions" section
  - Top confusion: "b ↔ d" (8 times)
  - Second confusion: "p ↔ q" (3 times)
  - Total attempts: 450
  - Accuracy: 88.4%
```

### Scenario: Identify learning opportunities
```gherkin
Given the confusion matrix shows:
  | Target | Clicked | Count |
  | b | d | 8 |
  | d | b | 5 |
When I review the analysis
Then I should see these letters highlighted as "needs practice"
And I can focus on "b vs d" exercises with Aurora
```

**Acceptance Criteria:**
- [ ] letter_pop_attempts table created
- [ ] Each Letter Pop attempt recorded
- [ ] API endpoint returns confusion matrix data
- [ ] Confusion matrix displays in parent dashboard
- [ ] Most confused letter pairs highlighted
- [ ] Accuracy percentage calculated
- [ ] Helps identify learning opportunities

---

