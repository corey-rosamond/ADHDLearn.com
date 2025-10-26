# Phase 4: Parent Registration + Login - Test Scenarios

**Project:** ADHDLearn.com
**Phase:** 4 of 36
**Last Updated:** October 26, 2025

---

## Feature: Parent Registration
**As a** parent
**I want to** create an account
**So that** I can manage my family's learning

### Scenario: Successful registration
```gherkin
Given I navigate to parent.adhdlearn.com/register
When I fill in the registration form:
  | Field | Value |
  | First Name | Sarah |
  | Last Name | Johnson |
  | Email | sarah@example.com |
  | Password | SecurePass123! |
  | Family Name | Johnson Family |

And I click "Create Account"
Then a POST request should be sent to "/api/auth/register"
And the API should create a family record
And the API should hash the password with bcrypt
And the API should create a parent user record
And the API should return 201 Created with:
  - success: true
  - token: (JWT token)
  - user object with userId, familyId, role, firstName, email

And I should be redirected to "/dashboard"
And my token should be stored in localStorage
```

### Scenario: Registration with existing email
```gherkin
Given a parent exists with email "sarah@example.com"
When I try to register with email "sarah@example.com"
And I click "Create Account"
Then the API should return 400 Bad Request
And I should see error: "Email already registered"
```

### Scenario: Registration validation - missing fields
```gherkin
Given I am on the registration page
When I submit the form without filling required fields
Then the API should return 400 Bad Request
And I should see error: "Missing required fields"
```

### Scenario: Password too short
```gherkin
Given I enter password "short"
When I submit the registration form
Then the API should return 400 Bad Request
And I should see error: "Password must be at least 8 characters"
```

---

## Feature: Parent Login
**As a** registered parent
**I want to** log into my account
**So that** I can access the dashboard

### Scenario: Successful login
```gherkin
Given I have a registered account:
  | Email | sarah@example.com |
  | Password | SecurePass123! |

When I navigate to parent.adhdlearn.com/login
And I enter email "sarah@example.com"
And I enter password "SecurePass123!"
And I click "Log In"
Then a POST request should be sent to "/api/auth/login/parent"
And the API should verify my credentials with bcrypt
And the API should generate a JWT token
And the API should return 200 OK with:
  - success: true
  - token: (JWT token)
  - user object

And I should be redirected to "/dashboard"
And my token should be stored in localStorage
```

### Scenario: Login with incorrect password
```gherkin
Given I have an account with email "sarah@example.com"
When I enter email "sarah@example.com"
And I enter password "WrongPassword123!"
And I click "Log In"
Then the API should return 401 Unauthorized
And I should see error: "Invalid credentials"
```

### Scenario: Login with non-existent email
```gherkin
Given no account exists with email "nonexistent@example.com"
When I try to login with that email
Then the API should return 401 Unauthorized
And I should see error: "Invalid credentials"
```

---

## Feature: Protected Routes
**As a** parent
**I want** protected routes to require authentication
**So that** my data is secure

### Scenario: Access dashboard without login
```gherkin
Given I am not logged in
When I navigate to "/dashboard"
Then I should be redirected to "/login"
```

### Scenario: Access dashboard with valid token
```gherkin
Given I am logged in with a valid token
When I navigate to "/dashboard"
Then I should see the dashboard
And I should see "Welcome back, [FirstName]!"
```

### Scenario: Token persists across page reloads
```gherkin
Given I am logged in
When I refresh the page
Then I should still be logged in
And I should not be redirected to login
```

### Scenario: Logout functionality
```gherkin
Given I am logged in and on the dashboard
When I click "Log Out"
Then my token should be removed from localStorage
And I should be redirected to "/login"
```

---

## Feature: Database Integration
**As a** developer
**I want** authentication data stored securely
**So that** user accounts are safe

### Scenario: Database tables exist
```gherkin
Given the Phase 4 migration has run
Then the database should have tables:
  | Table | Exists |
  | families | Yes |
  | users | Yes |
  | auth_sessions | Yes |
```

### Scenario: Family created on registration
```gherkin
Given a new user registers with family_name "Johnson Family"
Then a new record should be created in families table
And family_name should be "Johnson Family"
And subscription_tier should default to "free"
```

### Scenario: User created on registration
```gherkin
Given a new parent registers
Then a new record should be created in users table
And role should be "parent"
And password_hash should be bcrypt hashed
And email should be unique
And family_id should reference the families table
```

### Scenario: Auth session created on login
```gherkin
Given a parent logs in successfully
Then a new record should be created in auth_sessions table
And it should contain:
  - user_id
  - token (JWT)
  - expires_at (7 days from now)
  - ip_address
  - user_agent
```

---

## Feature: Frontend Components
**As a** developer
**I want** all frontend components working
**So that** parents can use the portal

### Scenario: Register page renders
```gherkin
Given I navigate to "/register"
Then I should see:
  - Page title "Create Your Family Account"
  - Input for First Name
  - Input for Last Name
  - Input for Email
  - Input for Password
  - Input for Family Name
  - "Create Account" button
  - Link to "/login"
```

### Scenario: Login page renders
```gherkin
Given I navigate to "/login"
Then I should see:
  - Page title "Welcome Back!"
  - Input for Email
  - Input for Password
  - "Log In" button
  - Link to "/register"
```

### Scenario: Dashboard page renders after login
```gherkin
Given I am logged in as "Sarah"
When I view the dashboard
Then I should see:
  - "Welcome back, Sarah!"
  - My account information
  - "Log Out" button
```

---

## Acceptance Criteria

From PLAN.md - All must pass:

- [ ] Parent can register with email/password
- [ ] Password is hashed with bcrypt before storage
- [ ] JWT token generated on successful registration
- [ ] Parent can login with email/password
- [ ] Invalid credentials return 401 error
- [ ] Duplicate email returns 400 error
- [ ] Token stored in localStorage
- [ ] Token included in Authorization header for API requests
- [ ] Token expires after 7 days
- [ ] Parent redirected to /dashboard after login
- [ ] All McCabe complexity ≤ 5
- [ ] Database tables created (families, users, auth_sessions)
- [ ] Frontend pages work (Register, Login, Dashboard)

---
