# Phase 14: Chore System - Backend

**Project:** ADHDLearn.com
**Phase:** 14 of 36
**Last Updated:** October 22, 2025

---


## Feature: Chore System API
**As a** backend system
**I want to** manage chores for families
**So that** parents can assign tasks and children can complete them

### Scenario: Create chore (API)
```gherkin
Given I am authenticated as a parent
When I send POST /api/chores with:
  """json
  {
    "title": "Make your bed",
    "description": "Straighten sheets and fluff pillows",
    "assignedToUserId": 2,
    "pointsValue": 5,
    "dueDate": "2025-10-23"
  }
  """
Then the response status should be 201
And the response should include:
  """json
  {
    "success": true,
    "chore": {
      "choreId": 1,
      "title": "Make your bed",
      "status": "pending"
    }
  }
  """
And the chore should be saved to the database
```

### Scenario: Child completes chore (API)
```gherkin
Given chore ID 1 exists with status "pending"
And I am authenticated as child with user_id 2
When I send PATCH /api/chores/1/complete with:
  """json
  {
    "photoUrl": "https://s3.amazonaws.com/proof.jpg"
  }
  """
Then the response status should be 200
And the chore status should be "completed"
And the completed_at timestamp should be set
And the photo_url should be saved
```

### Scenario: Parent approves chore (API)
```gherkin
Given chore ID 1 has status "completed"
And the chore has points_value of 5
And child user_id 2 has total_points of 100
And I am authenticated as a parent
When I send PATCH /api/chores/1/approve with:
  """json
  {
    "approved": true
  }
  """
Then the response status should be 200
And the chore status should be "approved"
And the child's total_points should be 105
And approved_at timestamp should be set
```

**Acceptance Criteria:**
- [ ] Chores table created in database
- [ ] POST /api/chores creates chore (parent only)
- [ ] GET /api/chores lists chores with filters
- [ ] PATCH /api/chores/:id/complete marks completed (child)
- [ ] PATCH /api/chores/:id/approve approves/rejects (parent only)
- [ ] DELETE /api/chores/:id deletes chore (parent only)
- [ ] Points awarded on approval
- [ ] Role-based access control enforced
- [ ] Photo URL saved with completion

---

