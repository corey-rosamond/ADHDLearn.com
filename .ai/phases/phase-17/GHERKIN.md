# Phase 17: Progress Charts

**Project:** ADHDLearn.com
**Phase:** 17 of 36
**Last Updated:** October 22, 2025

---


## Feature: Visual Progress Tracking
**As a** parent
**I want to** see Aurora's progress in charts
**So that** I can understand her learning trends

### Scenario: View daily progress chart
```gherkin
Given I am logged in as a parent
And Aurora played games on 5 days this week:
  | Date | Total Score | Sessions |
  | 2025-10-18 | 120 | 3 |
  | 2025-10-19 | 150 | 4 |
  | 2025-10-20 | 130 | 3 |
  | 2025-10-21 | 180 | 5 |
  | 2025-10-22 | 200 | 6 |
When I view the parent dashboard
Then I should see a line chart showing:
  - X-axis: Dates (2025-10-18 to 2025-10-22)
  - Y-axis: Total Score
  - Data points connected with smooth line
  - Upward trend visible
```

### Scenario: Filter charts by date range
```gherkin
Given I am viewing the dashboard charts
When I click "Last 7 Days" button
Then the charts should update to show data from the last 7 days
When I click "Last 30 Days" button
Then the charts should update to show data from the last 30 days
When I click "All Time" button
Then the charts should show all historical data
```

### Scenario: View category breakdown pie chart
```gherkin
Given Aurora spent time in multiple categories:
  | Category | Time (seconds) |
  | Reading | 1200 |
  | Math | 800 |
When I view the dashboard
Then I should see a pie chart with:
  - "Reading": 60% (larger slice)
  - "Math": 40% (smaller slice)
  - Each slice colored distinctly
```

**Acceptance Criteria:**
- [ ] Chart.js integrated in parent portal
- [ ] Line chart displays daily progress
- [ ] Pie chart shows category breakdown
- [ ] Bar chart shows games played frequency
- [ ] Accuracy trend chart visible
- [ ] Filter buttons work (7, 30, 90 days, all time)
- [ ] Charts responsive (mobile-friendly)
- [ ] Empty state when no data
- [ ] API endpoint returns analytics data

---

