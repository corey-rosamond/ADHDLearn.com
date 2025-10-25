# Phase 7: Child Login with PIN

**Project:** ADHDLearn.com
**Phase:** 7 of 36
**Last Updated:** October 22, 2025

---


## Feature: Child Login with PIN
**As a** child
**I want to** log in with my PIN and avatar
**So that** I can access my learning activities

### Scenario: Child login screen loads
```gherkin
Given I navigate to "https://child.adhdlearn.com"
Then I should see a colorful login screen with:
  - Large heading: "Who's learning today? 🌈"
  - Subheading: "Tap your avatar to get started!"
  - Avatar cards for all children in the family

And the page should:
  - Have a colorful, gradient background
  - Use child-friendly fonts (Comic Neue, Quicksand)
  - Have animations (avatars gently float/bounce)
  - Play soft background music (optional, muted by default)
```

### Scenario: Select child avatar
```gherkin
Given my family has 3 children:
  | Name | Avatar |
  | Aurora | rainbow-unicorn.png |
  | Emma | butterfly.png |
  | Liam | rocket.png |

When I view the child login screen
Then I should see 3 large avatar cards arranged in a grid
And each card should show:
  - Avatar image (200x200px)
  - Child's name below (large text, 32px)
  - Colorful border
  - Hover/tap animation (scale up to 1.1x)

And each avatar card should be a large touch target (min 250x250px)
```

### Scenario: Successful PIN entry
```gherkin
Given I am Aurora with PIN "1234"
When I tap on the rainbow-unicorn avatar
Then I should be redirected to "/pin-entry"
And I should see:
  - Large greeting: "Hi Aurora! 🌈"
  - Instruction: "Enter your PIN"
  - 4 empty PIN dots: ○ ○ ○ ○
  - Large number pad (0-9) in 3x4 grid
  - Back button (arrow) to return to avatar selection

When I tap numbers: 1, 2, 3, 4
Then each dot should fill in sequentially: ● ● ● ●
And I should hear a soft "beep" sound on each tap
And after the 4th digit, the PIN should auto-submit

Then a POST request should be sent to "/api/auth/login/child":
  """json
  {
    "childId": 2,
    "pinCode": "1234"
  }
  """

And the API should:
  - Verify the PIN with bcrypt.compare()
  - Generate a JWT token with claims:
    ```json
    {
      "userId": 2,
      "familyId": 1,
      "role": "child",
      "firstName": "Aurora",
      "exp": 1730000000
    }
    ```
  - Set JWT in httpOnly cookie
  - Update Aurora's last_login timestamp
  - Respond with 200 OK

And I should be redirected to "/dashboard"
And I should see: "Welcome back, Aurora! 🌈"
```

### Scenario: Incorrect PIN entry
```gherkin
Given I am Aurora with PIN "1234"
When I tap the rainbow-unicorn avatar
And I enter PIN "5678"
Then I should see:
  - A gentle shake animation on the PIN dots
  - Dots turn red briefly, then clear
  - Friendly error message: "Oops! That's not the right PIN. Try again! 🤔"
  - Audio plays: gentle "uh-oh" sound (not harsh)

And the PIN dots should clear: ○ ○ ○ ○
And I should be able to try again immediately
And no account lockout should occur (children can try unlimited times)
And the failed attempt should be logged for parent visibility
```

### Scenario: PIN entry visual feedback
```gherkin
Given I am entering my PIN
When I tap the number "1"
Then I should see:
  - The number button animates (press down, scale to 0.95x)
  - The first PIN dot fills in: ● ○ ○ ○
  - A soft beep sound plays
  - The button returns to normal state

When I tap "2"
Then the second dot fills in: ● ● ○ ○

When I tap "3"
Then the third dot fills in: ● ● ● ○

When I tap "4"
Then the fourth dot fills in: ● ● ● ●
And the PIN auto-submits (no need to tap a "submit" button)
And a loading spinner appears briefly
```

### Scenario: Back button navigation
```gherkin
Given I am on the PIN entry screen for Aurora
And I have entered 2 digits: ● ● ○ ○
When I tap the "Back" button (arrow icon)
Then I should be redirected back to the avatar selection screen
And the partially entered PIN should be cleared
```

### Scenario: Clear PIN button
```gherkin
Given I am on the PIN entry screen
And I have entered 3 digits: ● ● ● ○
When I tap the "Clear" button (X icon next to the number pad)
Then all PIN dots should clear: ○ ○ ○ ○
And I can start entering the PIN again from the beginning
```

### Scenario: Number pad layout
```gherkin
Given I am on the PIN entry screen
Then I should see a number pad with buttons arranged:
  """
  [1] [2] [3]
  [4] [5] [6]
  [7] [8] [9]
  [←] [0] [X]
  """
Where:
  - [←] is the Back button (return to avatar selection)
  - [X] is the Clear button (clear entered digits)
  - Each button is large (min 100x100px) for easy tapping
  - Buttons have rounded corners and colorful backgrounds
  - Buttons respond to touch with visual feedback
```

### Scenario: Session expiration
```gherkin
Given Aurora is logged in
And she has been inactive for 2 hours
When she tries to interact with the child portal
Then her session should expire
And she should be redirected to "/login"
And she should see: "Your session expired. Please log in again!"
And she should be able to log in again with her PIN
```

### Scenario: Auto-logout on browser close
```gherkin
Given Aurora is logged in
When she closes the browser tab
Then her session cookie should be cleared (not persistent)
And when she reopens the child portal
Then she should see the login screen again
```

**Acceptance Criteria:**
- [ ] Large, colorful UI designed for children ages 4-10
- [ ] Avatar cards min 250x250px (easy to tap)
- [ ] Number pad buttons min 100x100px
- [ ] PIN entry visual (dots fill in, no plain text)
- [ ] Friendly error messages (no "authentication failed")
- [ ] No account lockout (unlimited attempts for children)
- [ ] Audio feedback on button taps
- [ ] Animations for engagement (shake on error, bounce on success)
- [ ] Back button to return to avatar selection
- [ ] Clear button to reset entered digits
- [ ] PIN auto-submits after 4 digits
- [ ] Session expires after 2 hours of inactivity
- [ ] Session cleared on browser close (non-persistent cookie)
- [ ] JWT token with child_id, family_id, role='child' claims
- [ ] All text at 3rd-grade reading level or below
- [ ] Responsive design (tablet-optimized, especially landscape)
- [ ] API endpoint: POST /api/auth/login/child
- [ ] Failed login attempts logged (parent can view in future phase)

---

