# Phase 33: Architecture Diagrams

**Project:** ADHDLearn.com
**Phase:** 33 of 36
**Last Updated:** October 22, 2025

---


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

