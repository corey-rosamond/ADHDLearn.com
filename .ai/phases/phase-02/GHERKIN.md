# Phase 2: Letter Pop Standalone Deployment - Test Scenarios

**Project:** ADHDLearn.com
**Phase:** 2 of 36
**Last Updated:** October 26, 2025

---

## Feature: Letter Pop Game Deployment
**As** Aurora
**I want to** play Letter Pop from my tablet
**So that** I can practice letter recognition

### Scenario: Load child portal on tablet
```gherkin
Given I have a tablet with internet connection
When I navigate to "https://child.adhdlearn.com"
Then the page should load successfully
And I should see the Letter Pop game interface
And the page should load in under 5 seconds
```

### Scenario: Play Letter Pop without login
```gherkin
Given I am on child.adhdlearn.com
When the page loads
Then I should see the game immediately
And I should NOT see a login screen
And I should be able to start playing
```

### Scenario: Game runs smoothly
```gherkin
Given the Letter Pop game is loaded
When I play the game
Then the framerate should be at least 30fps
And the framerate should target 60fps
And there should be no lag or stuttering
And bubble animations should be smooth
And touch interactions should be responsive
```

### Scenario: High scores saved to localStorage
```gherkin
Given I complete a round of Letter Pop with score 180
When the game saves my score
Then my score should be saved to localStorage
And I should see my score on the results screen
When I close the browser and reopen child.adhdlearn.com
Then my previous high scores should still be visible
```

### Scenario: Results screen shows stats
```gherkin
Given I complete a round with:
  | Metric | Value |
  | Score | 180 |
  | Correct | 18 |
  | Total | 20 |
  | Accuracy | 90% |

Then the results screen should display:
  - My score (180)
  - Number correct (18 out of 20)
  - Accuracy percentage (90%)
  - Encouragement message
  - "Play Again" button
```

### Scenario: Touch targets are large enough
```gherkin
Given I am playing Letter Pop on a tablet
When I look at clickable elements
Then all buttons should be at least 44×44 pixels
And bubbles should be large enough to tap easily
And there should be spacing between interactive elements
```

### Scenario: High contrast for ADHD accessibility
```gherkin
Given the Letter Pop game is loaded
When I view the game interface
Then text should have high contrast against backgrounds
And interactive elements should be clearly visible
And colors should follow ADHD-friendly design principles
```

### Scenario: Non-punitive feedback
```gherkin
Given I click the wrong letter bubble
When the game provides feedback
Then it should NOT say "wrong" or "incorrect"
And it should NOT use red X marks or failure indicators
And it should encourage me to try again
And it should pronounce the letter I clicked
```

### Scenario: Immediate feedback on actions
```gherkin
Given I tap a letter bubble
When the tap registers
Then visual feedback should appear within 50ms
And audio feedback should play within 100ms
And the bubble should respond immediately
```

### Scenario: Production build works
```gherkin
Given the child-portal is built for production
When I run "npm run build"
Then the build should complete successfully
And the dist/ directory should contain:
  - index.html
  - JavaScript bundles
  - CSS files
  - Assets (images, audio)
And there should be no build errors
```

### Scenario: React + Vite + Phaser integration
```gherkin
Given the child-portal uses React 19 + Vite 7 + Phaser 3.90
When the application loads
Then React should render the Phaser game container
And Phaser should initialize within the React component
And there should be no console errors
And the integration should work seamlessly
```

### Scenario: ES6 modules working
```gherkin
Given the game code uses ES6 modules
When the game loads
Then all imports should resolve correctly
And all exports should be accessible
And there should be no module loading errors
```

### Scenario: McCabe complexity ≤ 5
```gherkin
Given all game code is written
When I check the McCabe complexity
Then every function should have complexity ≤ 5
And ESLint should pass with complexity rule enabled
```

### Scenario: ESLint passes
```gherkin
Given the child-portal code is complete
When I run "npm run lint"
Then there should be 0 errors
And all code should follow style guidelines
```

### Scenario: Smoke test passes
```gherkin
Given I have the smoke test script (test-game.mjs)
When I run "npm run test:smoke"
Then the test should pass
And a screenshot should be saved
And there should be no console errors logged
```

### Scenario: Documentation updated
```gherkin
Given Phase 2 is complete
Then START.md should be updated with Phase 2 status
And MEMORY.md should document Phase 2 accomplishments
And child-portal/README.md should document the game
```

### Scenario: Code committed
```gherkin
Given all Phase 2 code is complete and tested
When I check git status
Then all changes should be committed
And the commit message should reference "Phase 2"
And the code should be pushed to the staging branch
```

### Scenario: Deployed to staging
```gherkin
Given the code is pushed to staging branch
When I navigate to "https://child-staging.adhdlearn.com"
Then the Letter Pop game should be live
And it should work exactly like the production version
```

### Scenario: Deployed to production
```gherkin
Given staging has been tested and verified
When the code is deployed to production
And I navigate to "https://child.adhdlearn.com"
Then the Letter Pop game should be live
And Aurora should be able to play it from her tablet
```

---

## Acceptance Criteria

From PLAN.md - Phase 2 is complete when:

- [ ] Aurora can load child.adhdlearn.com on her tablet
- [ ] She can play Letter Pop without any login
- [ ] The game runs smoothly (60fps) on her device
- [ ] All her scores are saved and visible
- [ ] All GHERKIN scenarios above pass manual testing
- [ ] All code meets quality standards (McCabe ≤ 5, ESLint passing)
- [ ] Documentation is updated (START.md, MEMORY.md, README.md)
- [ ] Code is committed and deployed to both staging and production

---
