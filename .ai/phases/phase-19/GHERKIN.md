# Phase 19: Real-Time Updates

**Project:** ADHDLearn.com
**Phase:** 19 of 36
**Last Updated:** October 22, 2025

---


## Feature: Real-Time Activity Notifications
**As a** parent
**I want to** see when Aurora starts/finishes games
**So that** I can follow her progress in real-time

### Scenario: Child starts game (real-time notification)
```gherkin
Given I am logged in as a parent viewing the dashboard
And Aurora is logged in on her tablet
When Aurora starts playing "Letter Pop"
Then within 1 second I should see a live banner:
  - "🔴 Aurora is playing Letter Pop right now!"
  - Banner appears at top of dashboard
  - Banner styled with animation

And the banner should auto-hide after 5 seconds
```

### Scenario: Child finishes game (real-time notification)
```gherkin
Given I am viewing the parent dashboard
And Aurora is playing "Letter Pop"
When Aurora completes the game with score 180
Then within 1 second I should see a live banner:
  - "✅ Aurora finished Letter Pop! Score: 180"
  - Banner appears with celebration style

And the dashboard should update to show the new session
```

### Scenario: WebSocket connection resilience
```gherkin
Given I am connected to the real-time update service
When my internet connection drops temporarily
Then the WebSocket should attempt to reconnect
And when connection is restored
Then real-time updates should resume automatically
```

**Acceptance Criteria:**
- [ ] Socket.IO server running
- [ ] WebSocket connection from both portals
- [ ] Child portal emits game-start event
- [ ] Child portal emits game-end event
- [ ] Parent portal receives real-time updates
- [ ] Live banner displays correctly
- [ ] Banner shows child name and game name
- [ ] Banner auto-hides after 5 seconds
- [ ] Multiple children supported (family rooms)
- [ ] Connection resilient to network issues

---

