# Phase 28: Architecture Diagrams

**Project:** ADHDLearn.com
**Phase:** 28 of 36
**Last Updated:** October 22, 2025

---


## Machine Learning Pipeline

```mermaid
graph TB
    subgraph "Data Collection"
        LetterAttempts[letter_pop_attempts]
        GameSessions[game_sessions]
    end
    
    subgraph "ML Service (Python)"
        DataLoader[Load Data]
        FeatureExtraction[Extract Features<br/>- Time of day<br/>- Letter pairs<br/>- Accuracy trends]
        Model[Scikit-learn Model]
        Insights[Generate Insights]
    end
    
    subgraph "Parent Dashboard"
        Alerts[ML Insights:<br/>"Aurora struggles with b/d<br/>in afternoons"]
    end
    
    LetterAttempts --> DataLoader
    GameSessions --> DataLoader
    DataLoader --> FeatureExtraction
    FeatureExtraction --> Model
    Model --> Insights
    Insights --> Alerts
    
    style Model fill:#6C5CE7
    style Alerts fill:#FF6B9D
```

---

