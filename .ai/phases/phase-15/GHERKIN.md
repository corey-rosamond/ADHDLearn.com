# Phase 15: Chore System - Parent Side

**Project:** ADHDLearn.com
**Phase:** 15 of 36
**Last Updated:** October 22, 2025

---


## Feature: Chore Management (Parent Portal)
**As a** parent
**I want to** create and manage chores for Aurora
**So that** I can teach responsibility and reward completion

### Scenario: Create new chore
```gherkin
Given I am logged in as a parent
And I am on the Chore Manager page
When I click "New Chore" button
Then I should see a create chore form with fields:
  - Title (required)
  - Description
  - Assign to (dropdown with Aurora)
  - Points Value (required, default 5)
  - Due Date
  - Recurring (checkbox)
  - Recurrence Pattern (if recurring checked)

When I fill in:
  - Title: "Clean your room"
  - Assign to: "Aurora"
  - Points Value: 10
  - Due Date: "2025-10-25"
And I click "Create Chore"
Then the chore should be created
And I should see "Clean your room" in the chores list
And the form should close
```

### Scenario: Approve completed chore
```gherkin
Given Aurora has completed chore "Make your bed"
And the chore has status "completed"
And Aurora uploaded a photo proof
When I view the chore card
Then I should see:
  - Title: "Make your bed"
  - Status: "Awaiting Approval"
  - Photo proof thumbnail
  - "Approve" button
  - "Reject" button

When I click "Approve"
Then the chore status should change to "approved"
And Aurora should receive 5 points
And the chore should move to "Approved" filter
```

**Acceptance Criteria:**
- [ ] Chore Manager page accessible from navigation
- [ ] Create chore form validates required fields
- [ ] Parent can assign chore to Aurora
- [ ] Parent can set points value and due date
- [ ] Recurring chores supported
- [ ] Chores list displays with filters (All, Pending, Awaiting Approval, Approved)
- [ ] Photo proof displays when available
- [ ] Approve/Reject buttons work
- [ ] Points awarded on approval
- [ ] Delete chore works

---

