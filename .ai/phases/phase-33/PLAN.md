# Phase 33: Parental Controls

**Project:** ADHDLearn.com
**Phase:** 33 of 36
**Last Updated:** October 22, 2025

---

 Parental Controls

**Delivers:** Screen time limits and content controls
**Aurora gets:** ⏱️ **Daily time limits**
**You get:** Control screen time and content access
**Deployed:** Parental controls working

---

### What This Phase Delivers

Parental control features:
- Set daily time limits (e.g., 30 minutes)
- Enable/disable categories
- Require chores before games
- Schedule (no games before 3pm on school days)
- Lock out after time limit reached

---

### Database Changes

**New Table:** `parental_controls`
```sql
CREATE TABLE parental_controls (
    control_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    
    daily_time_limit_minutes INT DEFAULT 60,
    require_chores_first BOOLEAN DEFAULT FALSE,
    
    blocked_days JSON,
    blocked_hours JSON,
    disabled_categories JSON,
    
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    UNIQUE KEY uk_user (user_id)
);
```

---

### Acceptance Criteria

- [ ] Parent can set time limits
- [ ] Time limit enforced in child portal
- [ ] Category restrictions work
- [ ] Chore requirements enforced
- [ ] Schedule restrictions work

---

### Dependencies

- Phase 7: Child Login

---

