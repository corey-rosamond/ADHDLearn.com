# Phase 6: Architecture Diagrams

**Project:** ADHDLearn.com
**Phase:** 6 of 36
**Last Updated:** October 22, 2025

---


**Delivers:** Parents can add children with avatars and PINs
**Architecture Changes:** Child management endpoints

### Database Changes

No new tables, but `users` table now actively uses child fields:
- `pin_code` (bcrypt hashed 4-digit PIN)
- `avatar_url` (emoji or image URL)
- `birth_date` (for age calculation)

### Add Child Flow

```mermaid
sequenceDiagram
    actor Parent
    participant Web as Parent Portal
    participant API
    participant DB as MySQL

    Parent->>Web: Navigate to /family
    Web->>API: GET /api/families/:familyId/children
    API->>DB: SELECT * FROM users WHERE family_id=? AND role='child'
    DB->>API: Return children list
    API->>Web: Display children

    Parent->>Web: Click "Add Child"
    Web->>Parent: Display add child modal
    Parent->>Web: Fill form:<br/>Name: Aurora<br/>Birth date: 05/15/2018<br/>Avatar: 🌈<br/>PIN: 1234
    Web->>API: POST /api/families/:familyId/children<br/>{firstName, birthDate, avatar, pinCode}

    API->>API: Validate input
    API->>API: Hash PIN (bcrypt)
    API->>DB: INSERT INTO users (role='child', family_id, pin_code, ...)
    DB->>API: user_id
    API->>Web: 201 Created {child}
    Web->>Parent: "Aurora added! She can now log in with her PIN."
```

### API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/families/:id/children` | Add child to family |
| PUT | `/api/children/:id` | Update child info |
| DELETE | `/api/children/:id` | Archive child (soft delete) |

---

