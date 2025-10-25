# Phase 16: Chore System - Child Side

**Project:** ADHDLearn.com
**Phase:** 16 of 36
**Last Updated:** October 22, 2025

---


## Feature: Complete Chores (Child Portal)
**As a** Aurora (child)
**I want to** see and complete my chores
**So that** I can earn points

### Scenario: View assigned chores
```gherkin
Given I am logged in as Aurora
And my parent assigned me 2 chores:
  | Title | Points | Due Date |
  | Make your bed | 5 | 2025-10-23 |
  | Clean your room | 10 | 2025-10-25 |
When I navigate to "/chores"
Then I should see the "My Chores 📋" page
And I should see 2 chore cards:
  | Title | Points | Status |
  | Make your bed | +5 pts | Pending |
  | Clean your room | +10 pts | Pending |
```

### Scenario: Complete chore with photo
```gherkin
Given I am viewing chore "Make your bed"
When I tap "📷 Add Photo"
Then I should see a photo upload interface
When I upload a photo
And I tap "✅ Mark Complete"
Then I should see a confirmation: "Mark 'Make your bed' as complete?"
When I confirm
Then the chore should be marked complete
And the photo should be saved
And the chore should disappear from my pending list
And my parent should be notified
```

### Scenario: No chores available
```gherkin
Given I am logged in as Aurora
And no chores are assigned to me
When I navigate to "/chores"
Then I should see an empty state:
  - Message: "No chores right now!"
  - Suggestion: "Go play some games! 🎮"
```

**Acceptance Criteria:**
- [ ] Chores page accessible from child dashboard
- [ ] Child sees only chores assigned to them
- [ ] Only pending chores display
- [ ] Chore cards show title, description, points, due date
- [ ] Photo upload works (optional)
- [ ] Mark complete button works
- [ ] Completed chores disappear from list
- [ ] Dashboard widget shows pending chores count
- [ ] Empty state displays when no chores

---

