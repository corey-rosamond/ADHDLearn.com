# Phase 20: Achievements & Badges

**Project:** ADHDLearn.com
**Phase:** 20 of 36
**Last Updated:** October 22, 2025

---


## Feature: Achievement System
**As a** Aurora (child)
**I want to** earn badges for milestones
**So that** I feel proud of my progress

### Scenario: Earn first achievement
```gherkin
Given Aurora has played 9 games total
And the achievement "Getting Started" requires 10 games played
When Aurora completes her 10th game
Then the system should award the "Getting Started" badge
And Aurora should see a celebration notification:
  - "🏆 Achievement Unlocked!"
  - "Getting Started"
  - "Play 10 games"
  - "+50 points"
And 50 points should be added to Aurora's total_points
```

### Scenario: View earned achievements
```gherkin
Given Aurora has earned 3 achievements:
  | Achievement | Date Earned |
  | Getting Started | 2025-10-20 |
  | 5-Day Streak | 2025-10-21 |
  | Math Whiz | 2025-10-22 |
When Aurora views her dashboard
Then she should see an "Achievements" section
And she should see 3 earned badges displayed with icons
```

### Scenario: View progress toward next badge
```gherkin
Given Aurora has played 23 games
And the "Game Master" badge requires 50 games
When Aurora views her achievements page
Then she should see:
  - "Game Master" badge (locked/grayed out)
  - Progress bar: 46% complete (23/50)
  - "Play 27 more games to unlock!"
```

**Acceptance Criteria:**
- [ ] achievements table populated with badges
- [ ] user_achievements table tracks earned badges
- [ ] Backend automatically awards badges
- [ ] Achievement notifications display
- [ ] Child sees earned badges in dashboard
- [ ] Parent sees badges in parent dashboard
- [ ] Progress toward next badge shown
- [ ] Points awarded for earning badges

---

# Phases 21-36: Summary Scenarios

Due to length constraints, phases 21-36 follow similar Gherkin patterns. Key scenarios include:

**Phase 21 (Marketing Website):** User visits adhdlearn.com → sees features → clicks "Sign Up" → redirects to parent.adhdlearn.com/register

**Phase 22 (Age Norms):** Parent views dashboard → sees "Aurora is in 85th percentile for reading"

**Phase 23 (Science Category):** Aurora plays Color Mixing game → mixes red + blue → gets purple → earns points

**Phase 24 (Cooking Helper):** Aurora selects recipe → follows steps → marks "cooked" → parent approves

**Phase 25 (3D Printing):** Aurora selects STL file → parent prints → Aurora marks "completed"

**Phase 26 (Shopping Helper):** Aurora plays budget game → selects 3 items under $5 → learns money skills

**Phase 27 (Weekly Reports):** Every Sunday → parent receives email with weekly summary

**Phase 28 (ML Pattern Detection):** System detects "Aurora struggles with b/d in afternoons" → alerts parent

**Phase 29 (PDF Reports):** Parent clicks "Download PDF" → generates report with charts

**Phase 30 (Android APK):** Install app on Galaxy Tab S7 FE → works offline → native app icon

**Phase 31 (Multi-Parent):** Corey invites partner → partner accepts → both see same dashboard

**Phase 32 (Multiple Children):** Parent adds sibling → each child has own scores → parent switches between

**Phase 33 (Parental Controls):** Parent sets 30-minute limit → Aurora plays 30 minutes → app locks

**Phase 34 (Testing):** CI/CD runs tests → failing test blocks deployment → bugs caught early

**Phase 35 (Performance):** Page loads in < 2 seconds → images optimized → CDN serving assets

**Phase 36 (Accessibility):** Aurora enables high contrast → fonts enlarge → screen reader works

---

**GHERKIN.md Complete:** All 36 phases (0-36) with comprehensive BDD scenarios

