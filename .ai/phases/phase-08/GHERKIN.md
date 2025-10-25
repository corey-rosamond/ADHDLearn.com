# Phase 8: Child Dashboard with Categories

**Project:** ADHDLearn.com
**Phase:** 8 of 36
**Last Updated:** October 22, 2025

---


## Feature: Child Dashboard with Learning Categories
**As a** child
**I want to** see colorful learning categories
**So that** I can choose what to learn

### Scenario: Dashboard loads after login
```gherkin
Given Aurora is logged in
When she lands on the dashboard at "/dashboard"
Then she should see:
  - Large welcome message: "Hi Aurora! 🌈 Ready to learn?"
  - Her avatar (rainbow-unicorn.png) in the top-right corner
  - Her current points: "⭐ 450 points"
  - Her current streak: "🔥 5 days in a row!"
  - A grid of 6 large learning category cards
  - A "My Chores" button (if chores are assigned)
  - A "Log Out" button in the top-right

And the page should:
  - Use bright, engaging colors
  - Have smooth animations (cards gently float/pulse)
  - Play soft background music (optional, muted by default)
  - Load in <2 seconds
```

### Scenario: View learning category cards
```gherkin
Given Aurora is on the dashboard
Then she should see 6 category cards arranged in a 2x3 grid:
  | Category | Icon | Status | Color |
  | Reading | 📚 | 3 activities available | Blue |
  | Math | 🔢 | Coming soon | Gray |
  | Science | 🔬 | Coming soon | Gray |
  | Cooking | 🍳 | Coming soon | Gray |
  | Shopping | 🛒 | Coming soon | Gray |
  | 3D Printing | 🖨️ | Coming soon | Gray |

And each card should show:
  - Large icon (128x128px)
  - Category name (large text, 32px)
  - Status badge ("Available" or "Coming Soon")
  - Number of activities (if available)

And the "Reading" card should be:
  - Fully colored (bright blue gradient)
  - Clickable/tappable
  - Animated (gentle bounce on hover)

And the other cards should be:
  - Grayed out (desaturated)
  - Display "Coming Soon 🔒" badge
  - Not clickable (cursor: not-allowed)
```

### Scenario: Click on available category
```gherkin
Given the "Reading" category is unlocked
When Aurora taps the "Reading 📚" card
Then she should be redirected to "/categories/reading"
And she should see the Reading Adventures page with:
  - Header: "Reading Adventures 📚"
  - Subheader: "Learn letters, words, and sounds!"
  - Back button to return to dashboard
  - List of available reading activities
```

### Scenario: Click on locked category
```gherkin
Given the "Math" category is locked (coming soon)
When Aurora taps the "Math 🔢" card
Then she should see a modal:
  """
  🔒 Coming Soon!

  Math Adventures are coming soon!
  Keep playing Reading to earn stars and unlock new categories.

  [OK]
  """
And when she taps "OK", the modal should close
And she should remain on the dashboard
```

### Scenario: View points and streak
```gherkin
Given Aurora has earned 450 points
And she has played for 5 consecutive days
When she views her dashboard
Then she should see:
  - "⭐ 450 points" in large, colorful text (top-left)
  - "🔥 5 days in a row!" with a fire icon (animated flame)

When she taps on "⭐ 450 points"
Then she should see a points breakdown modal:
  | Source | Points Earned |
  | Letter Pop | 250 |
  | Word Builder | 120 |
  | Chores | 80 |
  | Total | 450 |
And she should see: "Great job! Keep earning points to unlock new activities!"
```

### Scenario: View recent activity
```gherkin
Given Aurora has played 3 activities recently:
  | Activity | Time | Score |
  | Letter Pop | 10 minutes ago | 140 |
  | Letter Pop | 2 hours ago | 160 |
  | Letter Pop | Yesterday | 120 |

When Aurora scrolls down on the dashboard
Then she should see a "Recent Activity" section with:
  - Heading: "What You've Been Learning 📖"
  - List of last 3 sessions:
    | Activity | Time | Score | Icon |
    | Letter Pop | 10 minutes ago | 140 | 📚 |
    | Letter Pop | 2 hours ago | 160 | 📚 |
    | Letter Pop | Yesterday | 120 | 📚 |

And each row should be clickable to replay the activity
```

### Scenario: View achievements preview
```gherkin
Given Aurora has unlocked 2 achievements:
  - 🌟 "5-Day Streak" (complete activities 5 days in a row)
  - 📖 "Reading Rookie" (play 10 reading activities)

And she is close to unlocking:
  - 🏆 "Letter Master" (play Letter Pop 50 times) - 45/50

When Aurora views her dashboard
Then she should see an "Achievements" section with:
  - Heading: "Your Achievements 🏆"
  - 2 unlocked badges displayed (colorful, shiny)
  - 1 progress badge showing "45/50 - Almost there!"

When she taps on the "Achievements" section
Then she should see a full achievements page (future phase)
```

### Scenario: Mobile responsiveness
```gherkin
Given Aurora is using a tablet in landscape mode (1920x1200)
When she views the dashboard
Then the category cards should be arranged in a 2x3 grid
And each card should be large enough to tap easily (min 300x300px)

Given Aurora is using a tablet in portrait mode (1200x1920)
When she views the dashboard
Then the category cards should be arranged in a 3x2 grid
And the layout should adjust automatically
```

### Scenario: Avatar and logout
```gherkin
Given Aurora is on the dashboard
When she sees her avatar in the top-right corner
Then the avatar should display her selected avatar image (rainbow-unicorn.png)

When she taps her avatar
Then she should see a dropdown menu with:
  - "My Profile" (future feature)
  - "Log Out"

When she taps "Log Out"
Then she should be logged out
And redirected to the child login screen
And her session cookie should be cleared
```

**Acceptance Criteria:**
- [ ] Dashboard loads in <2 seconds
- [ ] Large, colorful UI designed for children
- [ ] Category cards min 300x300px
- [ ] Only Reading category unlocked initially (others "Coming Soon")
- [ ] Points and streak displayed prominently
- [ ] Recent activity shows last 3 sessions
- [ ] Achievements preview shown
- [ ] Avatar displayed in top-right
- [ ] Logout button accessible
- [ ] Smooth animations and transitions
- [ ] Responsive design (portrait and landscape)
- [ ] All interactions have visual/audio feedback
- [ ] No ads or external links
- [ ] Safe, controlled environment
- [ ] API endpoint: GET /api/children/:childId/dashboard
  - Returns: points, streak, categories, recent activity, achievements

---

