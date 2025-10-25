# Phase 6: Family Management

**Project:** ADHDLearn.com
**Phase:** 6 of 36
**Last Updated:** October 22, 2025

---

 Family Management

**Delivers:** You can add Aurora as a child to your family
**Aurora gets:** Nothing new yet
**You get:** 👨‍👩‍👧 **Manage family (add/edit Aurora's profile)**
**Deployed:** Aurora now exists in the system as your child

### What This Phase Delivers

Family management functionality:
- Add child form in parent portal
- Child profile: name, birth date, avatar, 4-digit PIN
- Edit child information
- List all children in family

### Database Changes

None (users table already supports children)

### API Endpoints

#### POST /api/children
**Purpose:** Add a new child to the family
**Headers:** `Authorization: Bearer {token}`
**Body:**
```json
{
  "firstName": "Aurora",
  "birthDate": "2018-03-15",
  "avatar": "🌈",
  "pinCode": "1234"
}
```
**Response (201):**
```json
{
  "success": true,
  "child": {
    "userId": 2,
    "firstName": "Aurora",
    "birthDate": "2018-03-15",
    "avatar": "🌈",
    "age": 7
  }
}
```

#### PUT /api/children/:childId
**Purpose:** Update child information
**Body:**
```json
{
  "firstName": "Aurora",
  "birthDate": "2018-03-15",
  "avatar": "🦄",
  "pinCode": "5678"
}
```

### Frontend Changes

**New Files:**
- `parent-portal/src/pages/AddChild.jsx`
- `parent-portal/src/components/AvatarPicker.jsx`
- `parent-portal/src/components/PinInput.jsx`

### Acceptance Criteria

- [ ] Parent can add new child with name, birth date, avatar, PIN
- [ ] PIN must be exactly 4 digits
- [ ] PIN is hashed with bcrypt before storage
- [ ] Birth date validates as valid date
- [ ] Avatar picker shows 20+ emoji options
- [ ] Child appears in dashboard after creation
- [ ] Parent can edit child information
- [ ] Cannot delete child if they have activity data

### McCabe Complexity

All functions ≤ 5:
- `POST /api/children` handler: 4
- `AddChild.handleSubmit()`: 3

### Dependencies

- Phase 4: Parent authentication
- Phase 5: Dashboard to display children

---

