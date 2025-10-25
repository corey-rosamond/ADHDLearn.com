# Phase 20: Achievements & Badges

**Project:** ADHDLearn.com
**Phase:** 20 of 36
**Last Updated:** October 22, 2025

---

 Achievements & Badges

**Delivers:** Aurora earns badges for milestones
**Aurora gets:** 🏆 **Badges - "Played 10 games", "5-day streak", etc.**
**You get:** See Aurora's achievements in parent dashboard
**Deployed:** Achievement system working

---

### What This Phase Delivers

Achievement/badge system:
- Backend tracks milestones
- Awards badges automatically
- Badge display in child portal
- Achievement notifications
- Common achievements: games played, streaks, high scores, accuracy milestones

---

### Database Changes

**New Table:** `achievements`
```sql
CREATE TABLE achievements (
    achievement_id INT PRIMARY KEY AUTO_INCREMENT,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon_url VARCHAR(255),
    points_value INT DEFAULT 0,
    
    requirement_type ENUM('games_played', 'streak', 'high_score', 'accuracy', 'chores_completed') NOT NULL,
    requirement_value INT NOT NULL,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_type (requirement_type)
);
```

**New Table:** `user_achievements`
```sql
CREATE TABLE user_achievements (
    user_achievement_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    achievement_id INT NOT NULL,
    earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (achievement_id) REFERENCES achievements(achievement_id) ON DELETE CASCADE,
    
    UNIQUE KEY uk_user_achievement (user_id, achievement_id),
    INDEX idx_user (user_id),
    INDEX idx_earned (earned_at)
);
```

---

### API Endpoints

#### GET /api/achievements
**Purpose:** Get all available achievements
**Response (200):**
```json
{
  "success": true,
  "achievements": [
    {
      "achievementId": 1,
      "code": "games_10",
      "name": "Getting Started",
      "description": "Play 10 games",
      "icon": "🎮",
      "pointsValue": 50,
      "requirementType": "games_played",
      "requirementValue": 10
    }
  ]
}
```

#### GET /api/children/:childId/achievements
**Purpose:** Get child's earned achievements
**Response (200):**
```json
{
  "success": true,
  "achievements": [
    {
      "achievementId": 1,
      "code": "games_10",
      "name": "Getting Started",
      "earnedAt": "2025-10-20T10:00:00Z"
    }
  ],
  "progress": [
    {
      "achievementId": 2,
      "code": "games_50",
      "name": "Game Master",
      "current": 23,
      "required": 50,
      "percentComplete": 46
    }
  ]
}
```

---

### Acceptance Criteria

- [ ] achievements table populated with initial badges
- [ ] Backend automatically awards badges
- [ ] Child sees earned badges in dashboard
- [ ] Achievement notifications display
- [ ] Parent sees badges in parent dashboard
- [ ] Progress toward next badge shown
- [ ] Points awarded for earning badges

---

### Dependencies

- Phase 7: Child Login (tracks child activity)
- Phase 3: Game sessions (provides data for achievement tracking)

---

