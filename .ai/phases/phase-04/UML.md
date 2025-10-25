# Phase 4: Architecture Diagrams

**Project:** ADHDLearn.com
**Phase:** 4 of 36
**Last Updated:** October 22, 2025

---


**Delivers:** You can create an account and login
**Architecture Changes:** User authentication system added

### Phase 4 Architecture

```mermaid
graph TB
    subgraph "Phase 4 - Parent Portal Added"
        ParentWeb[Parent Portal<br/>parent.adhdlearn.com<br/>Registration + Login]
        ChildWeb[Child Portal<br/>child.adhdlearn.com<br/>Letter Pop]
        API[REST API<br/>api.adhdlearn.com<br/>Auth + Sessions]
    end

    subgraph "Data Layer"
        MySQL[(MySQL Database<br/>families, users,<br/>auth_sessions,<br/>game_sessions)]
    end

    ParentWeb -->|POST /api/auth/register| API
    ParentWeb -->|POST /api/auth/login/parent| API
    ChildWeb -->|POST /api/sessions| API
    API --> MySQL

    style ParentWeb fill:#fff4e1
    style ChildWeb fill:#ffe1f5
    style API fill:#e8f5e8
```

### Database ERD (Phase 4)

```mermaid
erDiagram
    FAMILIES ||--o{ USERS : "contains"
    USERS ||--o{ AUTH_SESSIONS : "has"

    FAMILIES {
        INT family_id PK "Auto-increment"
        VARCHAR family_name
        ENUM subscription_tier "free, premium"
        TIMESTAMP created_at
        TIMESTAMP updated_at
    }

    USERS {
        INT user_id PK "Auto-increment"
        INT family_id FK
        ENUM role "parent, child"
        VARCHAR email "NULL for children"
        VARCHAR password_hash "bcrypt"
        VARCHAR first_name
        VARCHAR last_name "Optional"
        VARCHAR pin_code "NULL for parents"
        VARCHAR avatar_url "NULL for parents"
        DATE birth_date "NULL for parents"
        INT total_points "Default 0"
        INT current_streak "Default 0"
        BOOLEAN is_active "Default TRUE"
        TIMESTAMP created_at
        TIMESTAMP updated_at
    }

    AUTH_SESSIONS {
        INT session_id PK "Auto-increment"
        INT user_id FK
        VARCHAR token "JWT token"
        TIMESTAMP expires_at
        VARCHAR ip_address
        VARCHAR user_agent
        TIMESTAMP created_at
    }
```

### Parent Registration Flow

```mermaid
sequenceDiagram
    actor Parent
    participant Web as Parent Portal
    participant API
    participant DB as MySQL

    Parent->>Web: Navigate to /register
    Web->>Parent: Display registration form
    Parent->>Web: Fill form (name, email, password, family name)
    Web->>API: POST /api/auth/register

    API->>API: Validate input
    API->>DB: Check if email exists

    alt Email exists
        DB->>API: User found
        API->>Web: 409 Conflict
        Web->>Parent: "Email already registered"
    else New email
        API->>API: Hash password (bcrypt cost=10)
        API->>DB: BEGIN TRANSACTION
        API->>DB: INSERT INTO families
        DB->>API: family_id
        API->>DB: INSERT INTO users (role='parent')
        DB->>API: user_id
        API->>API: Generate JWT token
        API->>DB: INSERT INTO auth_sessions
        API->>DB: COMMIT
        API->>Web: 201 Created {token, user}
        Web->>Web: Store token in localStorage
        Web->>Parent: Redirect to /dashboard
    end
```

### Parent Login Flow

```mermaid
sequenceDiagram
    actor Parent
    participant Web as Parent Portal
    participant API
    participant DB as MySQL

    Parent->>Web: Navigate to /login
    Web->>Parent: Display login form
    Parent->>Web: Enter email + password
    Web->>API: POST /api/auth/login/parent<br/>{email, password}

    API->>DB: SELECT * FROM users WHERE email=? AND role='parent'

    alt User not found
        API->>Web: 401 Unauthorized
        Web->>Parent: "Invalid credentials"
    else User found
        DB->>API: Return user record
        API->>API: bcrypt.compare(password, password_hash)

        alt Password incorrect
            API->>Web: 401 Unauthorized
            Web->>Parent: "Invalid credentials"
        else Password correct
            API->>API: Generate JWT token
            API->>DB: INSERT INTO auth_sessions
            API->>DB: UPDATE users SET last_login=NOW()
            API->>Web: 200 OK {token, user}
            Web->>Web: Store token
            Web->>Parent: Redirect to /dashboard
        end
    end
```

### JWT Token Structure

```mermaid
graph LR
    JWT[JWT Token]

    JWT --> Header["Header:<br/>{alg: 'HS256', typ: 'JWT'}"]
    JWT --> Payload["Payload:<br/>{userId, familyId, role, exp}"]
    JWT --> Signature["Signature:<br/>HMACSHA256(header+payload, secret)"]

    style JWT fill:#e8f5e8
```

### Database Changes

**New Tables:**
- `families` - Family/account information
- `users` - Parent and child users
- `auth_sessions` - JWT token sessions

### API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/auth/register` | Register new family + parent |
| POST | `/api/auth/login/parent` | Parent email/password login |
| POST | `/api/auth/logout` | Invalidate token |
| GET | `/api/auth/me` | Get current user info |

---

