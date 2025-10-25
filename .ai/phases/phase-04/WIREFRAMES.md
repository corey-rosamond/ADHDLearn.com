# Phase 4: UI Wireframes

**Project:** ADHDLearn.com
**Phase:** 4 of 36
**Last Updated:** October 22, 2025

---


**Delivers:** Parents can create accounts and login
**URL:** parent.adhdlearn.com
**Screens:** 3 (Login, Registration, Forgot Password)

### 4.1 Parent Login Screen

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│                                                                         │
│                       ┌──────────────┐                                  │
│                       │  📚 ADHD     │                                  │
│                       │    Learn     │  ← Logo, 48px Fredoka One       │
│                       └──────────────┘                                  │
│                                                                         │
│                                                                         │
│                      Welcome Back, Parent!                             │
│                                                                         │
│                                                                         │
│         ┌──────────────────────────────────────────────────┐           │
│         │                                                  │           │
│         │  Email Address                                   │           │
│         │  ┌────────────────────────────────────────────┐  │           │
│         │  │ sarah@example.com                          │  │           │
│         │  └────────────────────────────────────────────┘  │           │
│         │                                                  │           │
│         │  Password                                        │           │
│         │  ┌────────────────────────────────────────────┐  │           │
│         │  │ ••••••••••••                    👁️ [Show]  │  │           │
│         │  └────────────────────────────────────────────┘  │           │
│         │                                                  │           │
│         │  ☑️ Remember me on this device                   │           │
│         │                                                  │           │
│         │                                                  │           │
│         │               ┌────────────────┐                 │           │
│         │               │   LOG IN       │                 │           │
│         │               └────────────────┘                 │           │
│         │                                                  │           │
│         │                                                  │           │
│         │         [Forgot your password?]                  │           │
│         │                                                  │           │
│         │  ─────────────────────────────────────────────  │           │
│         │                                                  │           │
│         │         Don't have an account yet?               │           │
│         │               [Create Account]                   │           │
│         │                                                  │           │
│         └──────────────────────────────────────────────────┘           │
│                                                                         │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘

LAYOUT:
  Viewport: 100vw × 100vh
  Card: 480px wide, centered, white background
  Padding: 48px
  Border-radius: 16px
  Shadow: 0 8px 32px rgba(0,0,0,0.1)

FONTS:
  Logo: 48px Fredoka One, #4A90E2
  "Welcome Back": 24px Inter Bold, #2C3E50
  Labels: 14px Inter, #4A4A4A
  Input text: 16px Inter, #2C3E50
  Links: 14px Inter, #4A90E2
  Button: 16px Inter Semibold, white

COLORS:
  Background: Linear gradient 135deg #E8F4F8 → #FFFFFF
  Card: #FFFFFF
  Inputs: #F7F9FA background, #E8E8E8 border
  Input focus: #4A90E2 border (2px)
  LOG IN button: #4A90E2
  LOG IN hover: #3A7BC8
  Links: #4A90E2, underline on hover
  Checkbox: #4A90E2 when checked

FORM VALIDATION:
  Real-time validation on blur:
    Email:
      - Empty: "Email is required"
      - Invalid: "Please enter a valid email address"
      - Border color: #D0021B (red)

    Password:
      - Empty: "Password is required"
      - Border color: #D0021B (red)

  Submit validation:
    - Disable LOG IN button if validation errors
    - Show error message below button if API returns error:
      "Invalid email or password. Please try again."
    - Shake animation on card if error

INTERACTIONS:
  - Email input: type="email", autocomplete="email"
  - Password input: type="password", autocomplete="current-password"
  - Show/Hide: Toggle password visibility
  - Remember me: Persist JWT token to localStorage (7 days)
  - LOG IN: POST /api/auth/login
    Body: {email, password}
    Success: Redirect to /dashboard
    Error: Show error message
  - Create Account: Navigate to /register
  - Forgot password: Navigate to /forgot-password

RESPONSIVE:
  Mobile (< 768px):
    - Card: 100% width, 16px margin
    - Padding: 24px
    - Full-screen height
```

### 4.2 Parent Registration Screen

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│                       ┌──────────────┐                                  │
│                       │  📚 ADHD     │                                  │
│                       │    Learn     │                                  │
│                       └──────────────┘                                  │
│                                                                         │
│                    Create Your Family Account                          │
│                                                                         │
│         ┌──────────────────────────────────────────────────┐           │
│         │                                                  │           │
│         │  First Name *                                    │           │
│         │  ┌────────────────────────────────────────────┐  │           │
│         │  │ Sarah                                      │  │           │
│         │  └────────────────────────────────────────────┘  │           │
│         │                                                  │           │
│         │  Last Name *                                     │           │
│         │  ┌────────────────────────────────────────────┐  │           │
│         │  │ Johnson                                    │  │           │
│         │  └────────────────────────────────────────────┘  │           │
│         │                                                  │           │
│         │  Email Address *                                 │           │
│         │  ┌────────────────────────────────────────────┐  │           │
│         │  │ sarah@example.com                          │  │           │
│         │  └────────────────────────────────────────────┘  │           │
│         │                                                  │           │
│         │  Password *                                      │           │
│         │  ┌────────────────────────────────────────────┐  │           │
│         │  │ ••••••••••••                    👁️ [Show]  │  │           │
│         │  └────────────────────────────────────────────┘  │           │
│         │                                                  │           │
│         │  Password Strength:                              │           │
│         │  ✓ At least 8 characters                         │           │
│         │  ✓ Contains uppercase letter (A-Z)               │           │
│         │  ✓ Contains lowercase letter (a-z)               │           │
│         │  ✓ Contains number (0-9)                         │           │
│         │  ✗ Contains special character (!@#$%...)         │           │
│         │                                                  │           │
│         │  Confirm Password *                              │           │
│         │  ┌────────────────────────────────────────────┐  │           │
│         │  │ ••••••••••••                    👁️ [Show]  │  │           │
│         │  └────────────────────────────────────────────┘  │           │
│         │                                                  │           │
│         │  ☑️ I agree to the [Terms of Service] and        │           │
│         │     [Privacy Policy]                             │           │
│         │                                                  │           │
│         │               ┌────────────────┐                 │           │
│         │               │ CREATE ACCOUNT │                 │           │
│         │               └────────────────┘                 │           │
│         │                                                  │           │
│         │  ─────────────────────────────────────────────  │           │
│         │                                                  │           │
│         │         Already have an account?                 │           │
│         │                  [Log In]                        │           │
│         │                                                  │           │
│         └──────────────────────────────────────────────────┘           │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘

LAYOUT:
  Same as login, 480px card

PASSWORD STRENGTH INDICATOR:
  Updates in real-time as user types:
    - Each requirement: ✓ (green) or ✗ (gray)
    - All met: Change CREATE ACCOUNT button to green
    - < 4 requirements: Button disabled (gray, not clickable)

  Colors:
    ✓ Met: #7ED321 (green check), #2C3E50 text
    ✗ Not met: #E8E8E8 (gray X), #9B9B9B text

FORM VALIDATION:
  First/Last Name:
    - Min 2 characters
    - Max 50 characters
    - Letters, spaces, hyphens only

  Email:
    - Valid email format
    - Max 255 characters
    - Check availability: GET /api/auth/check-email?email=
      - If exists: "This email is already registered. [Log in instead?]"

  Password:
    - Min 8 characters
    - All 5 requirements (see above)

  Confirm Password:
    - Must match Password exactly
    - Show error if doesn't match: "Passwords do not match"

  Terms checkbox:
    - Must be checked to enable CREATE ACCOUNT button

INTERACTIONS:
  - CREATE ACCOUNT: POST /api/auth/register
    Body: {first_name, last_name, email, password}
    Success:
      - Store JWT token
      - Redirect to /dashboard with welcome modal
    Error:
      - Email exists: "Email already registered"
      - Validation: Show specific field errors

  - Terms/Privacy: Open in modal (Phase 21)
  - Log In: Navigate to /login

RESPONSIVE:
  Mobile (< 768px):
    - Full width
    - Scroll if needed
    - Fixed CREATE ACCOUNT button at bottom
```

### 4.3 Forgot Password Screen

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│                       ┌──────────────┐                                  │
│                       │  📚 ADHD     │                                  │
│                       │    Learn     │                                  │
│                       └──────────────┘                                  │
│                                                                         │
│                      Reset Your Password                               │
│                                                                         │
│                  Enter your email address and we'll                    │
│                   send you a link to reset it.                         │
│                                                                         │
│         ┌──────────────────────────────────────────────────┐           │
│         │                                                  │           │
│         │  Email Address                                   │           │
│         │  ┌────────────────────────────────────────────┐  │           │
│         │  │ sarah@example.com                          │  │           │
│         │  └────────────────────────────────────────────┘  │           │
│         │                                                  │           │
│         │                                                  │           │
│         │               ┌────────────────┐                 │           │
│         │               │  SEND LINK     │                 │           │
│         │               └────────────────┘                 │           │
│         │                                                  │           │
│         │                                                  │           │
│         │           [← Back to Login]                      │           │
│         │                                                  │           │
│         └──────────────────────────────────────────────────┘           │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘

Success state (after clicking SEND LINK):

┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│                       ┌──────────────┐                                  │
│                       │  📚 ADHD     │                                  │
│                       │    Learn     │                                  │
│                       └──────────────┘                                  │
│                                                                         │
│                        Check Your Email                                │
│                                                                         │
│         ┌──────────────────────────────────────────────────┐           │
│         │                                                  │           │
│         │                    ✉️                            │           │
│         │                                                  │           │
│         │  We've sent a password reset link to:            │           │
│         │                                                  │           │
│         │          sarah@example.com                       │           │
│         │                                                  │           │
│         │  Please check your email and click the link      │           │
│         │  to reset your password. The link expires        │           │
│         │  in 1 hour.                                      │           │
│         │                                                  │           │
│         │  Didn't receive it? [Resend email]               │           │
│         │                                                  │           │
│         │                                                  │           │
│         │           [← Back to Login]                      │           │
│         │                                                  │           │
│         └──────────────────────────────────────────────────┘           │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘

INTERACTIONS:
  - SEND LINK: POST /api/auth/forgot-password
    Body: {email}
    Success: Show success state (ALWAYS, even if email doesn't exist - security)
    Error: Network error only

  - Resend: Same POST, show toast "Email sent again"

  - Email contains link: parent.adhdlearn.com/reset-password?token=xxx
    Opens new screen with password reset form

SECURITY:
  - Never reveal if email exists or not (always show success)
  - Token expires after 1 hour
  - One-time use token (invalidated after reset)
```

---

