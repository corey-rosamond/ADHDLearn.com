# Phase 4: Parent Registration + Login

**Project:** ADHDLearn.com
**Phase:** 4 of 36
**Last Updated:** October 22, 2025

---


## Feature: Parent Registration
**As a** new parent
**I want to** create a family account
**So that** I can manage my children's learning

### Scenario: Successful parent registration
```gherkin
Given I navigate to "https://parent.adhdlearn.com/register"
When I see the registration form
Then I should see input fields:
  | Field | Type | Required | Placeholder |
  | First Name | text | Yes | Sarah |
  | Last Name | text | Yes | Johnson |
  | Email | email | Yes | sarah@example.com |
  | Password | password | Yes | ••••••••••••• |
  | Confirm Password | password | Yes | ••••••••••••• |

And I should see a checkbox: "I agree to Terms of Service and Privacy Policy"
And I should see a "Create Account" button (initially disabled)

When I fill in:
  | Field | Value |
  | First Name | Sarah |
  | Last Name | Johnson |
  | Email | sarah@example.com |
  | Password | SecurePass123! |
  | Confirm Password | SecurePass123! |
And I check "I agree to Terms of Service"
Then the "Create Account" button should become enabled

When I click "Create Account"
Then I should see a loading spinner
And a POST request should be sent to "/api/auth/register":
  """json
  {
    "firstName": "Sarah",
    "lastName": "Johnson",
    "email": "sarah@example.com",
    "password": "SecurePass123!"
  }
  """

And the API should:
  - Create a family record in the `families` table
  - Hash the password with bcrypt (cost factor 12)
  - Create a user record in the `users` table with role='parent'
  - Send a verification email to sarah@example.com

And the API should respond with 201 Created:
  """json
  {
    "success": true,
    "message": "Registration successful! Please check your email to verify your account.",
    "userId": 1,
    "familyId": 1
  }
  """

And I should be redirected to "/verify-email"
And I should see:
  """
  📧 Check Your Email
  We sent a verification link to sarah@example.com
  Please click the link to verify your account.
  """
```

### Scenario: Registration with existing email
```gherkin
Given a parent account exists with email "sarah@example.com"
When I try to register with email "sarah@example.com"
And I click "Create Account"
Then the API should respond with 409 Conflict:
  """json
  {
    "success": false,
    "error": "This email is already registered"
  }
  """

And I should see an error message:
  """
  ❌ This email is already registered.
  Already have an account? Log in
  """
And the "Log in" text should be a link to "/login"
```

### Scenario: Password validation - too short
```gherkin
Given I am on the registration page
When I enter password "short"
Then I should see an error below the password field:
  "❌ Password must be at least 8 characters"
And the "Create Account" button should remain disabled
```

### Scenario: Password validation - missing requirements
```gherkin
Given I am on the registration page
When I enter password "alllowercase"
Then I should see: "❌ Password must contain uppercase, lowercase, and number"

When I enter password "NoNumberHere!"
Then I should see: "❌ Password must contain at least one number"

When I enter password "NoSpecialChar123"
Then I should see: "❌ Password must contain a special character (!@#$%^&*)"
```

### Scenario: Password confirmation mismatch
```gherkin
Given I filled in password "SecurePass123!"
When I fill in confirm password "DifferentPassword456!"
Then I should see: "❌ Passwords do not match"
And the "Create Account" button should remain disabled
```

### Scenario: Email verification link
```gherkin
Given I registered with email "sarah@example.com"
And a verification email was sent
When I check my email inbox
Then I should see an email from "noreply@adhdlearn.com" with:
  | Field | Value |
  | Subject | Verify your ADHDLearn.com account |
  | From | ADHDLearn.com <noreply@adhdlearn.com> |

And the email body should contain:
  """
  Hi Sarah,

  Welcome to ADHDLearn.com! Please click the link below to verify your email:

  https://parent.adhdlearn.com/verify?token={unique_verification_token}

  This link expires in 24 hours.

  If you didn't create an account, please ignore this email.

  —The ADHDLearn.com Team
  """

When I click the verification link
Then I should be redirected to "/verify?token={token}"
And the API should verify the token
And my account should be marked as verified in the database
And I should be redirected to "/login"
And I should see: "✅ Email verified! You can now log in."
```

### Scenario: Expired verification token
```gherkin
Given I registered 25 hours ago (token expired after 24 hours)
When I click the verification link
Then I should see:
  """
  ❌ Verification link expired
  Please request a new verification email.
  """
And I should see a button "Resend Verification Email"

When I click "Resend Verification Email"
Then a new verification email should be sent
And I should see: "✅ Verification email sent!"
```

**Acceptance Criteria:**
- [ ] Registration form validates all fields client-side
- [ ] API validates all fields server-side (Joi/Zod schema)
- [ ] Password hashed with bcrypt cost factor 12 (never stored plain text)
- [ ] Password requirements: min 8 chars, uppercase, lowercase, number, special char
- [ ] Email format validated (RFC 5322)
- [ ] Family record created first, then user record with family_id foreign key
- [ ] Verification email sent using NodeMailer or SendGrid
- [ ] Verification tokens expire after 24 hours
- [ ] Tokens stored in `email_verifications` table or as JWT
- [ ] Rate limiting: max 5 registration attempts per IP per hour
- [ ] CSRF protection on form
- [ ] No sensitive data logged (passwords, tokens)
- [ ] HTTPS enforced (redirect HTTP to HTTPS)

---

## Feature: Parent Login
**As a** registered parent
**I want to** log into my account
**So that** I can manage my family

### Scenario: Successful login
```gherkin
Given I have a verified parent account:
  | Email | sarah@example.com |
  | Password | SecurePass123! |
When I navigate to "https://parent.adhdlearn.com/login"
Then I should see a login form with:
  | Field | Type | Placeholder |
  | Email | email | Email address |
  | Password | password | Password |
And I should see a "Log In" button
And I should see a "Forgot Password?" link

When I enter email "sarah@example.com"
And I enter password "SecurePass123!"
And I click "Log In"
Then a POST request should be sent to "/api/auth/login/parent":
  """json
  {
    "email": "sarah@example.com",
    "password": "SecurePass123!"
  }
  """

And the API should:
  - Verify the email exists
  - Compare password with bcrypt hash
  - Generate a JWT token with claims:
    ```json
    {
      "userId": 1,
      "familyId": 1,
      "role": "parent",
      "exp": 1730000000
    }
    ```
  - Set JWT in httpOnly cookie with:
    - name: "auth_token"
    - httpOnly: true
    - secure: true
    - sameSite: "strict"
    - maxAge: 7 days

And the API should respond with 200 OK:
  """json
  {
    "success": true,
    "user": {
      "userId": 1,
      "firstName": "Sarah",
      "lastName": "Johnson",
      "email": "sarah@example.com",
      "role": "parent"
    }
  }
  """

And I should be redirected to "/dashboard"
And I should see: "Welcome back, Sarah!"
```

### Scenario: Failed login - incorrect password
```gherkin
Given I have an account with email "sarah@example.com"
When I enter email "sarah@example.com"
And I enter password "WrongPassword123!"
And I click "Log In"
Then the API should respond with 401 Unauthorized:
  """json
  {
    "success": false,
    "error": "Incorrect email or password"
  }
  """

And I should see an error message:
  "❌ Incorrect email or password"
And I should remain on the login page
And a failed login attempt should be logged with:
  | Field | Value |
  | email | sarah@example.com |
  | ip_address | 192.168.1.1 |
  | timestamp | 2025-10-21 10:30:00 |
  | success | false |
```

### Scenario: Failed login - unverified email
```gherkin
Given I registered but have not verified my email
When I try to log in
Then the API should respond with 403 Forbidden:
  """json
  {
    "success": false,
    "error": "Please verify your email before logging in"
  }
  """

And I should see:
  """
  ❌ Please verify your email before logging in
  Didn't receive the email? Resend verification email
  """
```

### Scenario: Account lockout after multiple failed attempts
```gherkin
Given I have an account with email "sarah@example.com"
When I enter incorrect password 5 times consecutively
Then the API should:
  - Lock the account for 15 minutes
  - Update the `users` table: locked_until = NOW() + INTERVAL 15 MINUTE
  - Send an email notification to sarah@example.com:
    """
    Subject: Security Alert: Account Locked

    Your account was locked due to 5 failed login attempts.
    Your account will be unlocked in 15 minutes.

    If this wasn't you, please reset your password immediately.
    """

And I should see:
  """
  🔒 Account temporarily locked
  Too many failed login attempts. Please try again in 15 minutes.
  """

And when I try to log in with the correct password
Then I should see:
  "🔒 Account locked. Try again in 14 minutes."
```

### Scenario: Forgot password flow
```gherkin
Given I am on the login page
When I click "Forgot Password?"
Then I should be redirected to "/forgot-password"
And I should see a form with:
  | Field | Type | Placeholder |
  | Email | email | Enter your email address |

When I enter email "sarah@example.com"
And I click "Send Reset Link"
Then the API should:
  - Generate a password reset token (JWT or UUID)
  - Store token in `password_resets` table with expiration (1 hour)
  - Send password reset email to sarah@example.com

And the API should respond with 200 OK (even if email doesn't exist, for security)
And I should see:
  """
  ✅ Password reset link sent!
  If an account exists with sarah@example.com, you will receive a password reset email.
  """

When I check my email
Then I should see an email with:
  | Subject | Reset your ADHDLearn.com password |
  | From | ADHDLearn.com <noreply@adhdlearn.com> |

And the email should contain:
  """
  Hi Sarah,

  We received a request to reset your password. Click the link below:

  https://parent.adhdlearn.com/reset-password?token={unique_reset_token}

  This link expires in 1 hour.

  If you didn't request this, please ignore this email.
  """

When I click the reset link
Then I should be redirected to "/reset-password?token={token}"
And I should see a form with:
  | Field | Type |
  | New Password | password |
  | Confirm New Password | password |

When I enter a valid new password
And I click "Reset Password"
Then the API should:
  - Verify the token
  - Hash the new password
  - Update the `users` table with new password_hash
  - Invalidate the reset token

And I should be redirected to "/login"
And I should see: "✅ Password reset successfully! Please log in."
```

**Acceptance Criteria:**
- [ ] Login form validates email and password
- [ ] JWT tokens stored in httpOnly, secure cookies
- [ ] JWT expires after 7 days
- [ ] Refresh token mechanism (optional, future enhancement)
- [ ] Account lockout: 5 failed attempts = 15 min lockout
- [ ] Failed login attempts logged for security audit
- [ ] Password reset tokens expire in 1 hour
- [ ] Password reset tokens single-use (invalidated after use)
- [ ] Email verification required before login
- [ ] Rate limiting on login endpoint: max 10 attempts per IP per minute
- [ ] No user enumeration (same response whether email exists or not)
- [ ] CSRF protection on login form
- [ ] Secure session management

---

