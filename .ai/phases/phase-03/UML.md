# Phase 3: Database + Simple Backend - Architecture Diagrams

**Project:** ADHDLearn.com
**Phase:** 3 of 36
**Last Updated:** October 22, 2025

---

## Overview

**Delivers:** Scores persist in database
**Architecture Changes:** MySQL database + Express API added

---

## Phase 3 Architecture

```mermaid
graph TB
    subgraph "Phase 3 - Database Integration"
        ChildWeb[Child Portal<br/>child.adhdlearn.com<br/>Letter Pop + API calls]
        API[REST API<br/>api.adhdlearn.com<br/>Express on port 3000]
    end

    subgraph "Data Layer"
        MySQL[(MySQL Database<br/>game_sessions table)]
    end

    ChildWeb -->|POST /api/sessions| API
    ChildWeb -->|GET /api/sessions/high-scores| API
    API --> MySQL

    style ChildWeb fill:#ffe1f5
    style API fill:#e8f5e8
    style MySQL fill:#f0f0f0
```

---

## API Request/Response Flow

```mermaid
sequenceDiagram
    actor Aurora
    participant Game as Letter Pop Game
    participant API as Express API
    participant DB as MySQL

    Aurora->>Game: Completes game
    Game->>Game: Calculate score, accuracy
    Game->>API: POST /api/sessions<br/>{gameName, score, accuracy, ...}

    API->>API: Validate request body
    API->>DB: INSERT INTO game_sessions
    DB->>API: session_id: 1

    API->>DB: SELECT COUNT(*) WHERE score > ?
    DB->>API: rank: 2

    API->>Game: 201 Created<br/>{sessionId: 1, isHighScore: true, rank: 2}

    Game->>API: GET /api/sessions/high-scores?game=Letter Pop
    API->>DB: SELECT * ORDER BY score DESC LIMIT 10
    DB->>API: Top 10 scores
    API->>Game: 200 OK {scores: [...]}

    Game->>Aurora: Show results with high scores
```

---

## Database Schema

```mermaid
erDiagram
    game_sessions {
        BIGINT session_id PK
        VARCHAR game_name
        INT score
        DECIMAL accuracy_percentage
        INT correct_attempts
        INT total_attempts
        INT duration_seconds
        VARCHAR mode
        TIMESTAMP played_at
    }
```

---

## Component Structure

```mermaid
graph LR
    subgraph "Frontend (child-portal)"
        GameScene[GameScene.js]
        ResultsScene[ResultsScene.js]
        APIService[services/api.js]
    end

    subgraph "Backend (Node.js)"
        ExpressApp[Express App]
        SessionsRoute[POST /api/sessions]
        HighScoresRoute[GET /api/sessions/high-scores]
        DBPool[MySQL Pool]
    end

    GameScene --> APIService
    ResultsScene --> APIService
    APIService -->|fetch| SessionsRoute
    APIService -->|fetch| HighScoresRoute
    SessionsRoute --> DBPool
    HighScoresRoute --> DBPool
```

---

## Database Changes

**New Table:** `game_sessions`
- Stores all game session data
- Indexed on (game_name, score) for high score queries
- Indexed on played_at for chronological queries

---

## API Endpoints

**POST /api/sessions**
- Creates new game session record
- Returns isHighScore and rank

**GET /api/sessions/high-scores**
- Returns top N scores for a game
- Ordered by score DESC
