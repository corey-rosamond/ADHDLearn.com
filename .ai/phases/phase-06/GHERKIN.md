# Phase 6: Family Management

**Project:** ADHDLearn.com
**Phase:** 6 of 36
**Last Updated:** October 22, 2025

---


## Feature: Add Child to Family
**As a** parent
**I want to** add my children to the account
**So that** they can access learning activities

### Scenario: Add first child
```gherkin
Given I am logged in as a parent
And I have no children in my family
When I click "Add Child" from the dashboard
Then I should see a modal with title "Add a Child"
And I should see a form with:
  | Field | Type | Required | Placeholder |
  | First Name | text | Yes | Aurora |
  | Last Name | text | No | (optional) |
  | Birth Date | date | Yes | MM/DD/YYYY |
  | Avatar | image picker | Yes | (grid of 20+ avatars) |
  | PIN Code | 4-digit number | Yes | Enter 4-digit PIN |
  | Confirm PIN | 4-digit number | Yes | Confirm PIN |

When I fill in:
  | Field | Value |
  | First Name | Aurora |
  | Birth Date | 05/15/2018 |
  | Avatar | rainbow-unicorn.png |
  | PIN Code | 1234 |
  | Confirm PIN | 1234 |
And I click "Add Child"
Then a POST request should be sent to "/api/children":
  """json
  {
    "familyId": 1,
    "firstName": "Aurora",
    "birthDate": "2018-05-15",
    "avatarUrl": "/assets/avatars/rainbow-unicorn.png",
    "pinCode": "1234"
  }
  """

And the API should:
  - Hash the PIN with bcrypt
  - Calculate age from birth_date (7 years old)
  - Insert record into `users` table with role='child'
  - Respond with 201 Created:
    ```json
    {
      "success": true,
      "child": {
        "userId": 2,
        "familyId": 1,
        "firstName": "Aurora",
        "birthDate": "2018-05-15",
        "age": 7,
        "avatarUrl": "/assets/avatars/rainbow-unicorn.png"
      }
    }
    ```

And the modal should close
And I should see: "✅ Aurora added successfully!"
And Aurora should appear in my children list on the dashboard
```

### Scenario: PIN validation - too short
```gherkin
Given I am adding a child
When I enter PIN "123" (only 3 digits)
Then I should see an error: "❌ PIN must be exactly 4 digits"
And the "Add Child" button should be disabled
```

### Scenario: PIN validation - not numeric
```gherkin
Given I am adding a child
When I enter PIN "abcd"
Then I should see an error: "❌ PIN must be numeric"
And the "Add Child" button should be disabled
```

### Scenario: PIN validation - too simple
```gherkin
Given I am adding a child
When I enter PIN "0000"
Then I should see a warning: "⚠️ PIN is too simple. Choose a different PIN for security."
And the "Add Child" button should remain disabled

When I enter PIN "1111"
Then I should see: "⚠️ PIN is too simple. Choose a different PIN for security."

When I enter PIN "1234"
Then no warning should appear (this is acceptable)
```

### Scenario: PIN confirmation mismatch
```gherkin
Given I entered PIN "1234"
When I enter confirm PIN "5678"
Then I should see: "❌ PINs do not match"
And the "Add Child" button should be disabled
```

### Scenario: Duplicate PIN prevention
```gherkin
Given I have a child "Aurora" with PIN "1234"
When I try to add another child "Emma" with PIN "1234"
And I click "Add Child"
Then the API should respond with 409 Conflict:
  """json
  {
    "success": false,
    "error": "This PIN is already used by another child. Choose a different PIN."
  }
  """
And I should see: "❌ This PIN is already used. Choose a different PIN."
And the child should not be created
```

### Scenario: Avatar selection
```gherkin
Given I am adding a child
When I click on the "Avatar" field
Then I should see a grid of 20+ avatar options:
  | Category | Avatars |
  | Animals | unicorn, butterfly, dragon, cat, dog, bunny, panda, lion |
  | Space | rocket, astronaut, planet, star, moon, alien |
  | Fantasy | wizard, fairy, superhero, princess, knight |
  | Objects | rainbow, robot, car, boat, flower, tree |

And each avatar should be a large, colorful image (128x128px)
And when I hover over an avatar, it should have a hover effect (scale up)

When I click on "rainbow-unicorn.png"
Then the avatar should be selected (highlighted border)
And the avatar preview should appear next to the form
```

### Scenario: View all children
```gherkin
Given I have added 3 children:
  | Name | Age | Avatar | Last Active | PIN |
  | Aurora | 7 | rainbow-unicorn.png | 10 minutes ago | 1234 |
  | Emma | 5 | butterfly.png | 2 hours ago | 5678 |
  | Liam | 9 | rocket.png | Yesterday | 9012 |

When I navigate to the "Family" section
Then I should see all 3 children
And each child card should show:
  - Avatar (large, centered)
  - Name
  - Age (calculated from birth_date)
  - Last active time (relative: "10 minutes ago")
  - "View Progress" button
  - "Edit" button
  - "Delete" button (⚠️ icon, danger color)
```

### Scenario: Edit child profile
```gherkin
Given I have a child "Aurora" in my family
When I click "Edit" on Aurora's card
Then I should see a modal with title "Edit Aurora's Profile"
And the form should be pre-filled with Aurora's current data:
  | Field | Current Value |
  | First Name | Aurora |
  | Birth Date | 05/15/2018 |
  | Avatar | rainbow-unicorn.png (selected) |
  | PIN Code | •••• (hidden for security) |

When I change the first name to "Aurora Rose"
And I change the avatar to "butterfly.png"
And I click "Save Changes"
Then the API should update Aurora's record
And I should see: "✅ Aurora's profile updated!"
And Aurora's card should reflect the new name and avatar
```

### Scenario: Change child's PIN
```gherkin
Given I am editing Aurora's profile
When I check "Change PIN"
Then I should see new fields:
  | Field | Type |
  | New PIN | 4-digit number |
  | Confirm New PIN | 4-digit number |

When I enter new PIN "4567"
And I confirm PIN "4567"
And I click "Save Changes"
Then the API should hash the new PIN
And the old PIN should no longer work for Aurora's login
And the new PIN should work for Aurora's login
```

### Scenario: Delete child (soft delete)
```gherkin
Given I have a child "Liam" in my family
When I click the "Delete" button on Liam's card
Then I should see a confirmation modal:
  """
  ⚠️ Delete Liam?

  Are you sure you want to remove Liam from your family?
  Their progress and data will be archived but not permanently deleted.

  [Cancel] [Yes, Delete]
  """

When I click "Yes, Delete"
Then the API should:
  - Set Liam's user record to `is_active = 0` (soft delete)
  - Keep all session data intact
  - Respond with 200 OK

And the modal should close
And I should see: "✅ Liam removed from family"
And Liam should disappear from my children list
And Liam should not be able to log in anymore
```

**Acceptance Criteria:**
- [ ] Unlimited children per family
- [ ] PIN must be unique within family (not globally)
- [ ] PIN stored as bcrypt hash (never plain text)
- [ ] Age calculated automatically from birth_date
- [ ] Avatar selection from predefined set (20+ options)
- [ ] Child profiles can be edited (name, avatar, PIN, birth date)
- [ ] Child deletion requires confirmation
- [ ] Soft delete: set is_active=0, keep all data
- [ ] Last active time updated on child login
- [ ] API endpoints:
  - POST /api/children (create)
  - GET /api/users/:userId/children (list)
  - PUT /api/children/:childId (update)
  - DELETE /api/children/:childId (soft delete)
- [ ] Client-side and server-side validation
- [ ] Form validation prevents submission of invalid data

---

