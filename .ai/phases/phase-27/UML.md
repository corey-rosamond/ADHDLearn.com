# Phase 27: Architecture Diagrams

**Project:** ADHDLearn.com
**Phase:** 27 of 36
**Last Updated:** October 22, 2025

---


## Email Service Flow

```mermaid
sequenceDiagram
    participant Cron as Cron Job<br/>(Every Sunday 8AM)
    participant Backend as Report Generator
    participant DB as Database
    participant Email as SendGrid
    participant Parent as Parent Email
    
    Cron->>Backend: Trigger weekly report
    Backend->>DB: Fetch family data
    Backend->>DB: Fetch game sessions (last 7 days)
    Backend->>DB: Fetch achievements earned
    Backend->>Backend: Generate HTML email
    Backend->>Email: Send email
    Email->>Parent: Weekly Progress Report
```

---

