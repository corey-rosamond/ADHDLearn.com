# Phase 5: Parent Dashboard - View Scores

**Project:** ADHDLearn.com
**Phase:** 5 of 36
**Last Updated:** October 22, 2025

---

# Phase 5: Parent Dashboard - View Scores

## Feature: Parent Dashboard Overview
**As a** parent
**I want to** view my children's learning progress
**So that** I can track their development

### Scenario: View empty dashboard (no children yet)
```gherkin
Given I am logged in as a parent
And I have no children added to my family
When I navigate to "/dashboard"
Then I should see:
  """
  👋 Welcome, Sarah!

  🚀 Get Started
  Add your first child to start tracking their learning journey!

  [+ Add Child]
  """
And the "Add Child" button should be large and prominent
```

### Scenario: View dashboard with one child
```gherkin
Given I am logged in as a parent
And I have added my child Aurora (age 7)
And Aurora has played Letter Pop 5 times
When I navigate to "/dashboard"
Then I should see:
  - Header: "👋 Welcome back, Sarah!"
  - Section: "Your Children"
  - Aurora's card with:
    | Field | Value |
    | Name | Aurora |
    | Age | 7 years old |
    | Avatar | rainbow-unicorn.png |
    | Last Active | 10 minutes ago |
    | Total Sessions | 5 |
    | Total Time | 42 minutes |
    | Favorite Activity | Letter Pop |
And Aurora's card should have a "View Progress" button
```

### Scenario: View child's detailed progress
```gherkin
Given I am on the dashboard
And Aurora has completed:
  | Activity | Sessions | Total Time | Avg Score | Avg Accuracy |
  | Letter Pop | 5 | 42 min | 152 | 76% |
When I click "View Progress" on Aurora's card
Then I should be redirected to "/children/aurora/progress"
And I should see:
  - Page header: "Aurora's Progress 🌈"
  - Back button to return to dashboard
  - Summary cards:
    | Metric | Value |
    | Total Learning Time | 42 minutes |
    | Total Sessions | 5 |
    | Average Score | 152 |
    | Average Accuracy | 76% |
    | Current Streak | 2 days |
    | Favorite Activity | Letter Pop |

And I should see a section "Activity Breakdown"
And I should see a table:
  | Activity | Sessions | Time | Avg Score | Avg Accuracy | Last Played |
  | Letter Pop | 5 | 42 min | 152 | 76% | 10 min ago |
```

### Scenario: View Letter Pop detailed analytics
```gherkin
Given I am viewing Aurora's progress
And Aurora has played Letter Pop 5 times
When I click on "Letter Pop" in the activity table
Then I should be redirected to "/children/aurora/activities/letter-pop"
And I should see:
  - Page header: "Letter Pop Analytics 📚"
  - Summary section:
    | Metric | Value |
    | Total Sessions | 5 |
    | Total Time | 42 minutes |
    | Avg Session Length | 8 min 24 sec |
    | Average Score | 152 |
    | Average Accuracy | 76% |
    | Best Score | 180 (90% accuracy) |
    | Worst Score | 120 (60% accuracy) |

And I should see a section "Session History"
And I should see a table of all sessions:
  | Date | Score | Accuracy | Duration | Letters Correct | Letters Incorrect |
  | Oct 21, 10:30 AM | 140 | 70% | 60 sec | 14 | 6 |
  | Oct 20, 3:15 PM | 160 | 80% | 60 sec | 16 | 4 |
  | Oct 19, 11:00 AM | 120 | 60% | 60 sec | 12 | 8 |
  | Oct 18, 2:45 PM | 180 | 90% | 60 sec | 18 | 2 |
  | Oct 17, 4:20 PM | 150 | 75% | 60 sec | 15 | 5 |

And each row should be clickable to view session details
```

### Scenario: View specific session details
```gherkin
Given I am viewing Letter Pop analytics
When I click on the session from "Oct 21, 10:30 AM"
Then I should see a modal with:
  - Session ID: uuid-12345
  - Date & Time: October 21, 2025 at 10:30 AM
  - Score: 140
  - Accuracy: 70% (14 correct / 20 attempts)
  - Duration: 60 seconds
  - Settings:
    - Letter Case: Uppercase
    - Time Limit: 60 seconds
    - Difficulty: Easy
  - Letters Aurora found correctly: A, B, C, D, E, F, G, H, I, J, K, L, M, N
  - Letters Aurora struggled with: B (confused with D), P (confused with Q)
  - Confusion pairs:
    | Shown | Selected Instead | Count |
    | B | D | 2 times |
    | P | Q | 1 time |
    | M | N | 1 time |
```

### Scenario: View aggregate statistics
```gherkin
Given I am viewing Aurora's Letter Pop analytics
And Aurora has played 5 times with the following confusion pairs:
  | Session | Shown | Selected | Count |
  | 1 | B | D | 2 |
  | 1 | P | Q | 1 |
  | 2 | B | D | 1 |
  | 3 | B | D | 3 |
  | 3 | D | B | 1 |
  | 4 | P | Q | 1 |
  | 5 | M | N | 1 |

When I scroll to the "Most Common Mistakes" section
Then I should see a table:
  | Letter Pair | Total Confusions | Percentage of Mistakes |
  | B ↔ D | 7 times | 41% |
  | P ↔ Q | 2 times | 12% |
  | M ↔ N | 1 time | 6% |

And I should see a recommendation:
  """
  💡 Insight: Aurora frequently confuses B and D (7 times).
  This is common in early readers. Consider focused practice on these letters.
  """
```

**Acceptance Criteria:**
- [ ] Dashboard loads in <2 seconds
- [ ] Real-time data (updated when child completes activity)
- [ ] Child card shows avatar, name, age, last active, basic stats
- [ ] Progress page shows comprehensive statistics
- [ ] Activity analytics show session-by-session breakdown
- [ ] Session details modal shows full data for one session
- [ ] Confusion pairs aggregated across all sessions
- [ ] Insights and recommendations displayed
- [ ] All times displayed in parent's local timezone
- [ ] Responsive design (works on desktop, tablet, mobile)
- [ ] Data fetched from API endpoints:
  - GET /api/users/:userId/children
  - GET /api/children/:childId/sessions
  - GET /api/children/:childId/analytics
- [ ] Loading states for all data fetches
- [ ] Error handling for API failures

---

