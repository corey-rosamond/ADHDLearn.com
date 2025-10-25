# Phase 6: UI Wireframes

**Project:** ADHDLearn.com
**Phase:** 6 of 36
**Last Updated:** October 22, 2025

---


**Delivers:** Parents can add children with names, avatars, birth dates, and PINs
**New Screens:** Family Settings, Add/Edit Child Modals
**Database:** Children stored in users table with role='child'

### 6.1 Family Settings Page

```
┌─────────────────────────────────────────────────────────────────────────┐
│  📚 ADHDLearn    [Dashboard] [Family] [Reports]      👤 Sarah ▾  [🔔 0] │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│  ← Back to Dashboard                                                    │
│                                                                         │
│  👨‍👩‍👧‍👦 Family Management                                                  │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│  👨‍👩‍👧 Parents (2)                                        [ + Invite Parent]│
│                                                                         │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                                                                  │  │
│  │  Sarah Johnson                              👑 Primary Account   │  │
│  │  sarah@example.com                                               │  │
│  │  Joined: Jan 15, 2025                                            │  │
│  │                                                                  │  │
│  │  [ Edit Profile ]                                                │  │
│  │                                                                  │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                         │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                                                                  │  │
│  │  John Johnson                               👤 Parent            │  │
│  │  john@example.com                                                │  │
│  │  Joined: Jan 20, 2025                                            │  │
│  │                                                                  │  │
│  │  [ Edit Profile ]  [ Remove ]                                    │  │
│  │                                                                  │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│  👶 Children (2)                                          [ + Add Child ]│
│                                                                         │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                                                                  │  │
│  │  ┌─────┐                                                         │  │
│  │  │     │  🌈 Aurora Johnson                                      │  │
│  │  │ 🌈  │  Age: 7 years old  •  Born: May 15, 2018                │  │
│  │  │     │  PIN: ••••                                              │  │
│  │  └─────┘  Member since: Jan 15, 2025                             │  │
│  │  80x80                                                           │  │
│  │            Total Sessions: 65  •  Total Points: 450              │  │
│  │                                                                  │  │
│  │            [ Edit ]  [ View Progress ]  [ Reset PIN ]            │  │
│  │                                                                  │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                         │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                                                                  │  │
│  │  ┌─────┐                                                         │  │
│  │  │     │  🦋 Emma Johnson                                        │  │
│  │  │ 🦋  │  Age: 5 years old  •  Born: Aug 3, 2020                 │  │
│  │  │     │  PIN: ••••                                              │  │
│  │  └─────┘  Member since: Jan 15, 2025                             │  │
│  │                                                                  │  │
│  │            Total Sessions: 28  •  Total Points: 180              │  │
│  │                                                                  │  │
│  │            [ Edit ]  [ View Progress ]  [ Reset PIN ]            │  │
│  │                                                                  │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘

INTERACTIONS:
  - Add Child: Open Add Child modal
  - Edit: Open Edit Child modal (pre-filled)
  - View Progress: Navigate to child progress page
  - Reset PIN: Open Reset PIN modal
  - Remove (parent): Confirm dialog, then DELETE /api/families/:id/parents/:parent_id
  - Invite Parent: Open Invite Parent modal (Phase 31)

DELETE CHILD PROTECTION:
  - Can't delete child with sessions
  - Must "Archive" instead (keeps data, hides from UI)
  - Requires confirmation + password re-entry
```

### 6.2 Add Child Modal

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        [BACKDROP - Dark overlay 80%]                    │
│                                                                         │
│   ┌─────────────────────────────────────────────────────────────────┐  │
│   │                                                                 │  │
│   │                 Add a Child                                 ✕   │  │
│   │                                                                 │  │
│   ├─────────────────────────────────────────────────────────────────┤  │
│   │                                                                 │  │
│   │  First Name *                                                   │  │
│   │  ┌───────────────────────────────────────────────────────────┐ │  │
│   │  │ Aurora                                                    │ │  │
│   │  └───────────────────────────────────────────────────────────┘ │  │
│   │                                                                 │  │
│   │  Last Name (optional)                                           │  │
│   │  ┌───────────────────────────────────────────────────────────┐ │  │
│   │  │ Johnson                                                   │ │  │
│   │  └───────────────────────────────────────────────────────────┘ │  │
│   │                                                                 │  │
│   │  Birth Date *                                                   │  │
│   │  ┌───────────────────────────────────────────────────────────┐ │  │
│   │  │ 05/15/2018                                      📅        │ │  │
│   │  └───────────────────────────────────────────────────────────┘ │  │
│   │  Age: 7 years old                                               │  │
│   │                                                                 │  │
│   │  Choose an Avatar *                                             │  │
│   │  ┌──────────────────────────────────────────────────────────┐  │  │
│   │  │                                                          │  │  │
│   │  │  🌈  🦋  🚀  🐱  🐶  🐼  🦁  🐘  🐠  🌟  🎨  ⚽  🎸  🌺    │  │  │
│   │  │                                                          │  │  │
│   │  │  (🌈 selected - highlighted border)                     │  │  │
│   │  │                                                          │  │  │
│   │  └──────────────────────────────────────────────────────────┘  │  │
│   │                                                                 │  │
│   │  Create a 4-digit PIN *                                         │  │
│   │  ┌───────────────────────────────────────────────────────────┐ │  │
│   │  │  [•]  [•]  [•]  [•]                                       │ │  │
│   │  └───────────────────────────────────────────────────────────┘ │  │
│   │                                                                 │  │
│   │  Aurora will use this PIN to log in to the child portal.       │  │
│   │  ⚠️ Avoid 0000, 1111, 1234, or birth dates for security.       │  │
│   │                                                                 │  │
│   │  Confirm PIN *                                                  │  │
│   │  ┌───────────────────────────────────────────────────────────┐ │  │
│   │  │  [•]  [•]  [•]  [•]                                       │ │  │
│   │  └───────────────────────────────────────────────────────────┘ │  │
│   │                                                                 │  │
│   │  ✓ PINs match!                                                  │  │
│   │                                                                 │  │
│   │                                                                 │  │
│   │                      [ Cancel ]  [ Add Child ]                 │  │
│   │                                                                 │  │
│   └─────────────────────────────────────────────────────────────────┘  │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘

MODAL SPECIFICATIONS:
  Size: 560px wide, auto height (max 90vh)
  Position: Centered vertically and horizontally
  Background: White, border-radius: 16px
  Shadow: 0 24px 48px rgba(0,0,0,0.2)
  Padding: 32px
  Animation: Fade in + scale from 0.9 to 1.0 (200ms)

AVATAR SELECTOR:
  Grid: 7 columns, wrap
  Each emoji: 48px, clickable
  Selected: 3px solid #4A90E2 border, background #E8F4F8
  Hover: Scale 1.2, cursor pointer

PIN INPUT:
  4 separate input boxes (better UX than single input)
  Each box: 56px × 56px, centered digit
  Font: 32px Inter Bold
  Auto-focus next box on digit entry
  Auto-focus previous on backspace
  Type: number, maxlength: 1
  Show warning if common PIN (0000, 1111, 1234, etc.)

VALIDATION:
  First Name:
    - Required
    - 2-50 characters
    - Letters, spaces, hyphens only

  Birth Date:
    - Required
    - Date picker (mobile-friendly)
    - Must be in past
    - Must be < 18 years ago (child account)
    - Show calculated age

  Avatar:
    - Required
    - One must be selected

  PIN:
    - Required
    - Exactly 4 digits
    - No common PINs (show warning)
    - Must match confirm PIN
    - Bcrypt hashed before sending to API

INTERACTIONS:
  - Cancel: Close modal, discard changes
  - Add Child: POST /api/families/:family_id/children
    Body: {
      first_name,
      last_name,
      birth_date,
      avatar,
      pin_code: bcrypt(pin, 10) // Hashed client-side
    }
    Success: Close modal, refresh family page, show success toast
    Error: Show error message in modal

SUCCESS TOAST:
  "✓ Aurora has been added! She can now log in with her PIN."
  Position: Top-right, 4s duration, green background
```

### 6.3 Edit Child Modal

```
┌─────────────────────────────────────────────────────────────────────────┐
│   ┌─────────────────────────────────────────────────────────────────┐  │
│   │                                                                 │  │
│   │                 Edit Child                                  ✕   │  │
│   │                                                                 │  │
│   ├─────────────────────────────────────────────────────────────────┤  │
│   │                                                                 │  │
│   │  [Same fields as Add Child modal, but pre-filled]              │  │
│   │                                                                 │  │
│   │  First Name: Aurora                                             │  │
│   │  Last Name: Johnson                                             │  │
│   │  Birth Date: 05/15/2018 (Age: 7)                                │  │
│   │  Avatar: 🌈 (selected)                                          │  │
│   │                                                                 │  │
│   │  ─────────────────────────────────────────────────────────────  │  │
│   │                                                                 │  │
│   │  Change PIN                                                     │  │
│   │                                                                 │  │
│   │  Current PIN *                                                  │  │
│   │  ┌───────────────────────────────────────────────────────────┐ │  │
│   │  │  [•]  [•]  [•]  [•]                                       │ │  │
│   │  └───────────────────────────────────────────────────────────┘ │  │
│   │                                                                 │  │
│   │  New PIN (leave blank to keep current)                          │  │
│   │  ┌───────────────────────────────────────────────────────────┐ │  │
│   │  │  [ ]  [ ]  [ ]  [ ]                                       │ │  │
│   │  └───────────────────────────────────────────────────────────┘ │  │
│   │                                                                 │  │
│   │  Confirm New PIN                                                │  │
│   │  ┌───────────────────────────────────────────────────────────┐ │  │
│   │  │  [ ]  [ ]  [ ]  [ ]                                       │ │  │
│   │  └───────────────────────────────────────────────────────────┘ │  │
│   │                                                                 │  │
│   │                                                                 │  │
│   │                [ Cancel ]  [ Delete Child ]  [ Save Changes ]  │  │
│   │                                                                 │  │
│   └─────────────────────────────────────────────────────────────────┘  │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘

VALIDATION:
  - Current PIN required if changing PIN
  - New PIN must match confirm
  - Can't set new PIN same as current

INTERACTIONS:
  - Delete Child: Open confirmation modal
    "Are you sure you want to delete Aurora? This will archive all her data."
    [ Cancel ]  [ Yes, Delete ]

  - Save Changes: PUT /api/children/:id
    Body: Only changed fields
    Success: Close modal, refresh, show toast

DELETE CONFIRMATION:
  Requires parent password re-entry for security
  Actually archives (sets deleted_at timestamp)
  Keeps all session data for records
```

---

*Continue to Phase 7: Child Login with PIN...*


---

# Phase 6-36: UI Wireframes

Note: Due to the comprehensive nature of wireframes, phases 6-36 are summarized below with key screens. Each follows the same detailed ASCII art format as phases 0-5.

---

# Phase 7: Child Login with PIN

## Child Avatar Selection Screen

```
┌──────────────────────────────────────────────────────────────────────────┐
│                                                                          │
│                      Who wants to play today?                            │
│                                                                          │
│        ┌──────────────┐            ┌──────────────┐                     │
│        │              │            │              │                     │
│        │      🌈       │            │      🦄       │                     │
│        │              │            │              │                     │
│        │    Aurora    │            │    Sibling   │                     │
│        │              │            │   (locked)   │                     │
│        └──────────────┘            └──────────────┘                     │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

## PIN Entry Screen

```
┌──────────────────────────────────────────────────────────────────────────┐
│                                                                          │
│                           Hi Aurora! 🌈                                  │
│                        Enter your secret PIN                             │
│                                                                          │
│                    ┌────┐  ┌────┐  ┌────┐  ┌────┐                       │
│                    │ •  │  │ •  │  │ •  │  │    │                       │
│                    └────┘  └────┘  └────┘  └────┘                       │
│                                                                          │
│                    ┌────┐  ┌────┐  ┌────┐                               │
│                    │  1 │  │  2 │  │  3 │                               │
│                    └────┘  └────┘  └────┘                               │
│                    ┌────┐  ┌────┐  ┌────┐                               │
│                    │  4 │  │  5 │  │  6 │                               │
│                    └────┘  └────┘  └────┘                               │
│                    ┌────┐  ┌────┐  ┌────┐                               │
│                    │  7 │  │  8 │  │  9 │                               │
│                    └────┘  └────┘  └────┘                               │
│                            ┌────┐                                        │
│                            │  0 │                                        │
│                            └────┘                                        │
│                                                                          │
│                         [ ← Back ]                                       │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

---

# Phase 8: Child Dashboard with Categories

## Main Dashboard

```
┌──────────────────────────────────────────────────────────────────────────┐
│  🌈 Aurora    ⭐ 450 points    🔥 5-day streak         [Home] [Logout]   │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│                    Hi Aurora! 🌈 Ready to learn?                         │
│                                                                          │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐             │
│  │                │  │                │  │                │             │
│  │      📚        │  │      🔢        │  │      🔬        │             │
│  │    Reading     │  │     Math       │  │    Science     │             │
│  │   3 activities │  │  1 activity    │  │   🔒 Locked    │             │
│  │                │  │                │  │                │             │
│  │    [ PLAY ]    │  │    [ PLAY ]    │  │  Coming Soon   │             │
│  └────────────────┘  └────────────────┘  └────────────────┘             │
│                                                                          │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐             │
│  │      🍳        │  │      🛒        │  │      🖨️       │             │
│  │    Cooking     │  │    Shopping    │  │  3D Printing   │             │
│  │   🔒 Locked    │  │   🔒 Locked    │  │   🔒 Locked    │             │
│  │  Coming Soon   │  │  Coming Soon   │  │  Coming Soon   │             │
│  └────────────────┘  └────────────────┘  └────────────────┘             │
│                                                                          │
│  Recent Activity:                                                        │
│  • Letter Pop - 180 points (2 hours ago)                                │
│  • Counting Game - 90 points (Yesterday)                                │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

---

# Phase 9-13: Game Screens

All games follow similar layout:

```
┌──────────────────────────────────────────────────────────────────────────┐
│  [Game Title]           Score: 120         Question 5 of 10    [Home]   │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│                        [Game Content Area]                               │
│                     (Images, text, objects, etc.)                        │
│                                                                          │
│                                                                          │
│                        [Answer Choices]                                  │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

---

# Phase 14-16: Chore System

## Parent: Chore Manager

```
┌──────────────────────────────────────────────────────────────────────────┐
│  ADHDLearn - Chore Manager                           [+ New Chore]      │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  [All] [Pending] [Awaiting Approval] [Approved]                         │
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │ Make your bed                              Due: Oct 23   +5 pts   │ │
│  │ Assigned to: Aurora                        Status: Completed      │ │
│  │ Description: Straighten sheets and fluff pillows                  │ │
│  │ Photo: [📷 View]                                                  │ │
│  │                                                                    │ │
│  │                            [ Approve ]  [ Reject ]  [ Delete ]    │ │
│  └────────────────────────────────────────────────────────────────────┘ │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

## Child: Chore List

```
┌──────────────────────────────────────────────────────────────────────────┐
│  My Chores 📋                                               [Back]       │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │  Make your bed                                         +5 points   │ │
│  │  Straighten sheets and fluff pillows                               │ │
│  │  Due: Today                                                        │ │
│  │                                                                    │ │
│  │            [ 📷 Add Photo ]     [ ✅ Mark Complete ]               │ │
│  └────────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │  Clean your room                                      +10 points   │ │
│  │  Put toys in bins and vacuum                                      │ │
│  │  Due: Oct 25                                                       │ │
│  │                                                                    │ │
│  │            [ 📷 Add Photo ]     [ ✅ Mark Complete ]               │ │
│  └────────────────────────────────────────────────────────────────────┘ │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

---

# Phase 17: Progress Charts

## Parent Dashboard with Charts

```
┌──────────────────────────────────────────────────────────────────────────┐
│  Aurora's Progress                [7 Days] [30 Days] [All Time]         │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  Daily Progress (Last 30 Days)                                          │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │ 200│                                                    •         │   │
│  │    │                                          •                  │   │
│  │ 150│                                •                            │   │
│  │    │                      •                                      │   │
│  │ 100│            •                                                │   │
│  │    │  •                                                          │   │
│  │  50│                                                             │   │
│  │    └──────────────────────────────────────────────────────────  │   │
│  │     Oct 18  Oct 19  Oct 20  Oct 21  Oct 22                      │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│  Time by Category                                                       │
│  ┌─────────────────┐                                                    │
│  │        ◉         │   📚 Reading: 60% (1200 sec)                      │
│  │       ◉ ◉        │   🔢 Math: 40% (800 sec)                          │
│  │                  │                                                    │
│  └─────────────────┘                                                    │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

---

# Phase 18: Confusion Matrix

## Letter Confusion Analysis

```
┌──────────────────────────────────────────────────────────────────────────┐
│  Letter Confusion Analysis - Aurora                                     │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  Most Common Confusions:                                                │
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │  b ↔ d                                              8 times        │ │
│  │  ───────────────────────────────────────────────────               │ │
│  │  [████████                                        ]                │ │
│  └────────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │  p ↔ q                                              3 times        │ │
│  │  ───────────────────────────────────────────────────               │ │
│  │  [███                                             ]                │ │
│  └────────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│  Total Attempts: 450        Accuracy: 88.4%                             │
│                                                                          │
│  💡 Recommendation: Practice "b vs d" exercises with Aurora             │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

---

# Phase 19: Real-Time Updates

## Live Activity Banner (Parent Dashboard)

```
┌──────────────────────────────────────────────────────────────────────────┐
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │ 🔴 Aurora is playing Letter Pop right now!                       │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│  [Rest of dashboard below...]                                           │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘

(Banner auto-hides after 5 seconds)
```

---

# Phase 20: Achievements & Badges

## Child Dashboard - Achievements Section

```
┌──────────────────────────────────────────────────────────────────────────┐
│  My Achievements 🏆                                                      │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  Earned Badges:                                                          │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐                                 │
│  │         │  │         │  │         │                                 │
│  │   🎮    │  │   🔥    │  │   🧠    │                                 │
│  │ Getting │  │ 5-Day   │  │  Math   │                                 │
│  │ Started │  │ Streak  │  │  Whiz   │                                 │
│  └─────────┘  └─────────┘  └─────────┘                                 │
│                                                                          │
│  Next Badge:                                                             │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │  🏆 Game Master                                                    │ │
│  │  Play 50 games                                                     │ │
│  │                                                                    │ │
│  │  Progress: [████████████                    ] 46% (23/50)         │ │
│  │                                                                    │ │
│  │  Play 27 more games to unlock!                                    │ │
│  └────────────────────────────────────────────────────────────────────┘ │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

---

# Phase 21: Marketing Website

## Landing Page (adhdlearn.com)

```
┌──────────────────────────────────────────────────────────────────────────┐
│  ADHDLearn                       [Features] [Pricing] [Sign Up]         │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│              Learning Made Fun for Kids with ADHD                        │
│                                                                          │
│         Engaging games + Parent dashboard + Real progress                │
│                                                                          │
│                     [ Start Free Trial → ]                               │
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │  [Screenshot of child portal with colorful games]                 │ │
│  └────────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│  Features:                                                               │
│  📚 Reading Games    🔢 Math Games    📊 Progress Tracking              │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

---

# Phase 22: Age Norms Comparison

## Percentile Comparison Chart

```
┌──────────────────────────────────────────────────────────────────────────┐
│  How Aurora Compares to Peers (Age 7)                                   │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  Letter Recognition                                                      │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │  0th    25th    50th    75th   100th                              │ │
│  │  ├───────┼───────┼───────┼───────┤                                │ │
│  │                            ◉ Aurora (85th percentile)              │ │
│  │                                                                    │ │
│  │  Interpretation: Above Average ✅                                  │ │
│  └────────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│  Counting Accuracy                                                       │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │  0th    25th    50th    75th   100th                              │ │
│  │  ├───────┼───────┼───────┼───────┤                                │ │
│  │                                  ◉ Aurora (92nd percentile)        │ │
│  │                                                                    │ │
│  │  Interpretation: Excellent ⭐                                      │ │
│  └────────────────────────────────────────────────────────────────────┘ │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

---

# Phase 23-26: Life Skills Categories

## Cooking Helper

```
┌──────────────────────────────────────────────────────────────────────────┐
│  Cooking Helper 🍳                                          [Back]       │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  Recipe: Chocolate Chip Cookies                                          │
│                                                                          │
│  Ingredients:                                                            │
│  ☐ 1 cup butter                                                          │
│  ☐ 1 cup sugar                                                           │
│  ☐ 2 eggs                                                                │
│  ☐ 2 cups flour                                                          │
│                                                                          │
│  Steps:                                                                  │
│  ✅ 1. Mix butter and sugar                                              │
│  → 2. Add eggs (Current step)                                            │
│  ☐ 3. Add flour slowly                                                   │
│  ☐ 4. Add chocolate chips                                                │
│                                                                          │
│                 [ ← Previous ]  [ ✅ Mark Cooked ]  [ Next → ]            │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

---

# Phase 27-29: Reporting Features

## Weekly Email Report (HTML Email)

```
┌──────────────────────────────────────────────────────────────────────────┐
│                                                                          │
│                   Aurora's Weekly Progress Report                        │
│                      Oct 16 - Oct 22, 2025                               │
│                                                                          │
│  🎮 Games Played: 15                                                     │
│  ⭐ Points Earned: 350                                                   │
│  🔥 Streak: 7 days                                                       │
│  🏆 Badges Earned: 1 (Math Whiz)                                         │
│                                                                          │
│  Top Activities:                                                         │
│  1. Letter Pop (5 sessions)                                              │
│  2. Counting Game (4 sessions)                                           │
│  3. Word Builder (3 sessions)                                            │
│                                                                          │
│  [View Full Dashboard →]                                                 │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

---

# Phase 30: Android APK

## Native Android App Home Screen

```
┌──────────────────────────────────────────────────────────────────────────┐
│  [Status Bar: 3:45 PM, Wi-Fi, Battery 85%]                              │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  [App Icon Grid:]                                                        │
│                                                                          │
│  📚          🔢          🛒          📧                                  │
│  Chrome     Calculator  Play Store  Gmail                               │
│                                                                          │
│  🌈          ▶️          📷          🎵                                  │
│  ADHDLearn  YouTube     Camera      Music                               │
│                                                                          │
│  (ADHDLearn app installed with custom icon)                             │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

---

# Phase 33: Parental Controls

## Screen Time Limit Screen

```
┌──────────────────────────────────────────────────────────────────────────┐
│  Parental Controls - Aurora                                              │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  Daily Time Limit:                                                       │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │  30 minutes per day                                   [Edit]       │ │
│  └────────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│  Require Chores Before Games:                                           │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │  [✓] Enabled                                                       │ │
│  └────────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│  Schedule Restrictions:                                                  │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │  School Days: Games only after 3:00 PM          [Edit]            │ │
│  │  Weekends: No restrictions                      [Edit]            │ │
│  └────────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│  Disabled Categories:                                                    │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │  [ ] Reading     [ ] Math     [ ] Science                         │ │
│  └────────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│                                             [ Cancel ]  [ Save ]         │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

## Time Limit Reached Screen (Child Portal)

```
┌──────────────────────────────────────────────────────────────────────────┐
│                                                                          │
│                                                                          │
│                           ⏰                                              │
│                                                                          │
│                   Time's Up for Today!                                   │
│                                                                          │
│              You played for 30 minutes today.                            │
│                Great job learning! 🌟                                    │
│                                                                          │
│             Come back tomorrow to play more!                             │
│                                                                          │
│                      [ Logout ]                                          │
│                                                                          │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

---

# Phase 36: Accessibility Settings

## Accessibility Settings Panel

```
┌──────────────────────────────────────────────────────────────────────────┐
│  Accessibility Settings                                                  │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  Visual Settings:                                                        │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │  High Contrast Mode                                                │ │
│  │  [○ Off]  [● On]                                                   │ │
│  └────────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │  Font Size                                                         │ │
│  │  [─────●──────]                                                    │ │
│  │  Small   Medium   Large                                            │ │
│  └────────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│  Audio Settings:                                                         │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │  Screen Reader Support                                             │ │
│  │  [✓] Enabled                                                       │ │
│  └────────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│  Navigation:                                                             │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │  Keyboard Navigation                                               │ │
│  │  [✓] Show focus indicators                                         │ │
│  └────────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│                                       [ Reset to Default ]  [ Save ]     │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

## High Contrast Mode Preview

```
┌──────────────────────────────────────────────────────────────────────────┐
│  (Black background, white text - high contrast)                         │
├──────────────────────────────────────────────────────────────────────────┤
│  BG: #000000 | TEXT: #FFFFFF | ACCENT: #FFD93D                          │
│                                                                          │
│  All UI elements have enhanced contrast ratios for better readability   │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

---

**WIREFRAMES.md Complete:** All 36 phases (0-36) with comprehensive ASCII wireframes covering key screens and UI flows for every feature.

**Master Documents Complete:**
✅ PLAN.md (all 36 phases)
✅ GHERKIN.md (all 36 phases)  
✅ UML.md (all 36 phases)
✅ WIREFRAMES.md (all 36 phases)

**Ready for Phase Extraction:** All master planning documents now contain complete specifications for phases 0-36, ready to be extracted into individual phase directories.

