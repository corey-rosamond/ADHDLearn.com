# Phase 7: Child Login with PIN

**Project:** ADHDLearn.com
**Phase:** 7 of 36
**Last Updated:** October 22, 2025

---

 Child Login with PIN

**Delivers:** Aurora logs in as herself
**Aurora gets:** 🔢 **Logs in with her own PIN, sees personalized dashboard**
**You get:** Aurora has her own identity in the system
**Deployed:** Aurora logs in, plays Letter Pop under her account

### What This Phase Delivers

Child authentication system:
- Child selector screen (shows Aurora's avatar)
- 4-digit PIN entry with number pad
- JWT token for child session (2-hour expiry)
- Child dashboard with personalized greeting

### Database Changes

None (uses existing users and auth_sessions tables)

### API Endpoints

#### POST /api/auth/login/child
**Purpose:** Child login with PIN
**Body:**
```json
{
  "userId": 2,
  "pinCode": "1234"
}
```
**Response (200):**
```json
{
  "success": true,
  "token": "eyJhbGci...",
  "child": {
    "userId": 2,
    "firstName": "Aurora",
    "avatar": "🌈"
  }
}
```

#### GET /api/families/:familyId/children
**Purpose:** Get all children for child selector
**Response (200):**
```json
{
  "success": true,
  "children": [
    {
      "userId": 2,
      "firstName": "Aurora",
      "avatar": "🌈"
    }
  ]
}
```

### Frontend Changes

**New Files in `child-portal/`:**
```
src/
├── pages/
│   ├── ChildSelector.jsx
│   ├── PinEntry.jsx
│   └── ChildDashboard.jsx
└── components/
    └── NumberPad.jsx
```

### Acceptance Criteria

- [ ] Child selector shows all children in family
- [ ] Each child shown with large avatar and name
- [ ] Tap child avatar → PIN entry screen
- [ ] Number pad is large (60px+ touch targets)
- [ ] PIN entry shows circles that fill as digits entered
- [ ] Incorrect PIN shows gentle error, clears input
- [ ] Correct PIN → generates JWT token (2-hour expiry)
- [ ] Token stored in localStorage
- [ ] Redirects to child dashboard
- [ ] Dashboard shows "Welcome back, Aurora!"

### McCabe Complexity

All functions ≤ 5:
- `POST /api/auth/login/child` handler: 4
- `PinEntry.handleDigit()`: 3

### Dependencies

- Phase 6: Children exist in database

---

