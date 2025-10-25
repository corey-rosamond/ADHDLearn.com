# Phase 30: Architecture Diagrams

**Project:** ADHDLearn.com
**Phase:** 30 of 36
**Last Updated:** October 22, 2025

---


## Capacitor Wrapper

```mermaid
graph TB
    subgraph "Child Portal (Web)"
        React[React App]
        Phaser[Phaser Games]
    end
    
    subgraph "Capacitor"
        CapacitorCore[Capacitor Core]
        AndroidPlatform[Android Platform]
    end
    
    subgraph "Android APK"
        WebView[Android WebView]
        NativeFeatures[Native Features<br/>- Offline storage<br/>- Camera<br/>- Push notifications]
    end
    
    React --> CapacitorCore
    Phaser --> CapacitorCore
    CapacitorCore --> AndroidPlatform
    AndroidPlatform --> WebView
    AndroidPlatform --> NativeFeatures
    
    style AndroidPlatform fill:#3DDC84
```

---

# Phase 31-32: Multi-User Support - Architecture

## Family Structure

```mermaid
erDiagram
    families ||--o{ users : contains
    users ||--o{ children : parent_of
    users ||--o{ game_sessions : plays
    users ||--o{ chores : completes
    
    families {
        INT family_id PK
        VARCHAR family_name
        ENUM subscription_tier
    }
    
    users {
        INT user_id PK
        INT family_id FK
        ENUM role
        VARCHAR email
        VARCHAR first_name
    }
```

## Multi-Parent Flow

```mermaid
sequenceDiagram
    participant Parent1 as Corey (Parent)
    participant API as Backend
    participant Email as Email Service
    participant Parent2 as Partner
    
    Parent1->>API: POST /api/family/invite<br/>{email: "partner@example.com"}
    API->>Email: Send invitation email
    Email->>Parent2: Invitation link
    Parent2->>API: GET /api/family/accept/:token
    API->>API: Add parent to family
    API->>Parent2: Redirect to dashboard
    Parent2->>API: View Aurora's data
```

---

# Phase 33: Parental Controls - Architecture

## Screen Time Enforcement

```mermaid
graph TB
    ChildLogin[Child Logs In] --> CheckControls[Check parental_controls]
    CheckControls --> TimeLimit[Daily time limit?]
    TimeLimit -->|30 min limit| StartTimer[Start session timer]
    
    StartTimer --> PlayGame[Aurora plays games]
    PlayGame --> CheckTimer{Time remaining?}
    CheckTimer -->|Time left| PlayGame
    CheckTimer -->|Time expired| Lockout[Lock portal:<br/>"Time's up for today!"]
    
    style Lockout fill:#FF6B9D
```

---

# Phase 34: Testing Infrastructure - Architecture

## CI/CD Pipeline

```mermaid
graph LR
    Commit[Git Commit] --> CI[GitHub Actions]
    CI --> UnitTests[Unit Tests<br/>Jest]
    CI --> E2ETests[E2E Tests<br/>Playwright]
    CI --> Lint[ESLint]
    
    UnitTests -->|Pass| Deploy[Deploy]
    E2ETests -->|Pass| Deploy
    Lint -->|Pass| Deploy
    
    UnitTests -->|Fail| Block[Block Deployment]
    E2ETests -->|Fail| Block
    Lint -->|Fail| Block
    
    style Deploy fill:#00B894
    style Block fill:#FF6B9D
```

---

# Phase 35: Performance Optimization - Architecture

## Optimization Layers

```mermaid
graph TB
    subgraph "Frontend Optimizations"
        CodeSplit[Code Splitting<br/>React.lazy()]
        ImageOpt[Image Optimization<br/>WebP format]
        LazyLoad[Lazy Loading<br/>Non-critical resources]
    end
    
    subgraph "Backend Optimizations"
        QueryOpt[Database Query Optimization<br/>Indexes, joins]
        Cache[Redis Caching<br/>Session data, high scores]
    end
    
    subgraph "Infrastructure"
        CDN[CloudFlare CDN<br/>Static assets]
    end
    
    Browser[Browser] --> CDN
    CDN --> CodeSplit
    CodeSplit --> ImageOpt
    ImageOpt --> LazyLoad
    
    LazyLoad --> Cache
    Cache --> QueryOpt
    
    style CDN fill:#4ECDC4
    style Cache fill:#FF6B9D
```

---

# Phase 36: Accessibility - Architecture

## Accessibility Features

```mermaid
graph TB
    Settings[Accessibility Settings] --> HighContrast[High Contrast Mode<br/>Black bg, white text]
    Settings --> FontSize[Adjustable Font Size<br/>Small, Medium, Large]
    Settings --> ScreenReader[Screen Reader Support<br/>ARIA labels]
    Settings --> Keyboard[Keyboard Navigation<br/>Tab index, focus indicators]
    
    style HighContrast fill:#000000,color:#FFFFFF
    style FontSize fill:#4ECDC4
    style ScreenReader fill:#6C5CE7
    style Keyboard fill:#FFD93D
```

---

**UML.md Complete:** All 36 phases (0-36) with comprehensive architecture diagrams, ERDs, sequence diagrams, and technical visualizations

