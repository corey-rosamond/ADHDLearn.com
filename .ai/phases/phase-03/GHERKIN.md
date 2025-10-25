# Phase 3: Database + Simple Backend - BDD Scenarios

**Project:** ADHDLearn.com
**Phase:** 3 of 36
**Last Updated:** October 22, 2025

---

## Feature: Game Session Persistence
**As a** developer
**I want to** save game sessions to a database
**So that** scores persist across devices and browser sessions

### Scenario: Save game session to database
```gherkin
Given the MySQL database is running
And the API server is running on port 3000
When Aurora completes a Letter Pop game with:
  | Score | 180 |
  | Accuracy | 85% |
  | Correct | 18 |
  | Total | 21 |
  | Duration | 60 seconds |
  | Mode | uppercase |
Then the frontend should POST to "/api/sessions" with JSON:
  """json
  {
    "gameName": "Letter Pop",
    "score": 180,
    "accuracyPercentage": 85.0,
    "correctAttempts": 18,
    "totalAttempts": 21,
    "durationSeconds": 60,
    "mode": "uppercase"
  }
  """
And the API should return 201 Created with:
  """json
  {
    "success": true,
    "sessionId": 1,
    "isHighScore": true,
    "rank": 1
  }
  """
And the database should contain a new row in game_sessions:
  | session_id | game_name | score | accuracy_percentage |
  | 1 | Letter Pop | 180 | 85.0 |
```

### Scenario: Fetch high scores from database
```gherkin
Given the database contains game sessions:
  | session_id | game_name | score | accuracy_percentage | played_at |
  | 1 | Letter Pop | 190 | 88.0 | 2025-10-21 14:00:00 |
  | 2 | Letter Pop | 180 | 85.0 | 2025-10-21 14:15:00 |
  | 3 | Letter Pop | 170 | 82.0 | 2025-10-21 14:30:00 |
When the frontend requests GET "/api/sessions/high-scores?game=Letter%20Pop&limit=10"
Then the API should return 200 OK with:
  """json
  {
    "success": true,
    "scores": [
      {
        "sessionId": 1,
        "score": 190,
        "accuracyPercentage": 88.0,
        "playedAt": "2025-10-21T14:00:00Z"
      },
      {
        "sessionId": 2,
        "score": 180,
        "accuracyPercentage": 85.0,
        "playedAt": "2025-10-21T14:15:00Z"
      },
      {
        "sessionId": 3,
        "score": 170,
        "accuracyPercentage": 82.0,
        "playedAt": "2025-10-21T14:30:00Z"
      }
    ]
  }
  """
```

### Scenario: Display high scores on results screen
```gherkin
Given Aurora just completed a game with score 180
And the API returned isHighScore: true, rank: 2
When the Results scene loads
Then Aurora should see:
  - "🏆 NEW HIGH SCORE! #2" (displayed prominently)
  - "All-Time High Scores:" heading
  - A list showing top 5 scores from the database
And each score should display:
  - Rank number (1-5)
  - Score value
  - Accuracy percentage
  - Date played
```

### Scenario: API graceful degradation
```gherkin
Given the API server is offline
When Aurora completes a Letter Pop game
Then the frontend should attempt to POST to "/api/sessions"
And the request should timeout or fail
And the game should log the error to console
And the Results scene should still display
And the Results scene should show localStorage scores as fallback
And Aurora should see: "Scores saved locally (online sync pending)"
```

### Scenario: Database connection failure
```gherkin
Given the API server is running
But the MySQL database is offline
When a POST request is made to "/api/sessions"
Then the API should catch the database error
And return 500 Internal Server Error with:
  """json
  {
    "success": false,
    "error": "Internal server error"
  }
  """
And the error should be logged to the server console
```

### Scenario: Input validation
```gherkin
Given the API server is running
When a POST request is made to "/api/sessions" with invalid data:
  """json
  {
    "score": 180
  }
  """
Then the API should return 400 Bad Request with:
  """json
  {
    "success": false,
    "error": "Missing required fields"
  }
  """
```

---

## Acceptance Criteria

- [ ] Database saves all game session fields correctly
- [ ] API validates required fields (gameName, score)
- [ ] High scores ordered by score DESC
- [ ] isHighScore calculated correctly (top 10)
- [ ] rank calculated correctly based on score
- [ ] Frontend gracefully handles API failures
- [ ] localStorage used as fallback when API unavailable
- [ ] CORS allows child portal origins
- [ ] Database indexes improve query performance
- [ ] PM2 keeps API running after server restart
