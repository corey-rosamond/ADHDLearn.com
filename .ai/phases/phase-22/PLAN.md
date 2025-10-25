# Phase 22: Age Norms Comparison

**Project:** ADHDLearn.com
**Phase:** 22 of 36
**Last Updated:** October 22, 2025

---

 Age Norms Comparison

**Delivers:** Compare Aurora to other kids her age
**Aurora gets:** Nothing new
**You get:** 📊 **Percentile charts - "Aurora is in 85th percentile for her age"**
**Deployed:** Parent dashboard shows age comparison

---

### What This Phase Delivers

Age-norm benchmarking:
- Seed database with age norm data (4-10 year olds)
- Calculate Aurora's percentile for each skill
- Display comparison charts
- Show strengths and areas for growth

---

### Database Changes

**New Table:** `age_norms`
```sql
CREATE TABLE age_norms (
    norm_id INT PRIMARY KEY AUTO_INCREMENT,
    age_years INT NOT NULL,
    skill_type VARCHAR(50) NOT NULL,
    
    percentile_10 DECIMAL(5,2),
    percentile_25 DECIMAL(5,2),
    percentile_50 DECIMAL(5,2),
    percentile_75 DECIMAL(5,2),
    percentile_90 DECIMAL(5,2),
    
    INDEX idx_age_skill (age_years, skill_type)
);
```

Example data:
```sql
INSERT INTO age_norms VALUES
(1, 7, 'letter_recognition_accuracy', 65.0, 75.0, 85.0, 92.0, 97.0),
(2, 7, 'counting_accuracy', 70.0, 80.0, 90.0, 95.0, 98.0);
```

---

### API Endpoints

#### GET /api/analytics/age-comparison?childId={id}
**Purpose:** Get child's percentile compared to age norms
**Response (200):**
```json
{
  "success": true,
  "childAge": 7,
  "comparisons": [
    {
      "skill": "Letter Recognition",
      "childScore": 88.5,
      "percentile": 72,
      "interpretation": "Above average"
    },
    {
      "skill": "Counting",
      "childScore": 95.2,
      "percentile": 85,
      "interpretation": "Excellent"
    }
  ]
}
```

---

### Acceptance Criteria

- [ ] Age norms table populated with research data
- [ ] API calculates percentiles correctly
- [ ] Parent dashboard shows comparison chart
- [ ] Chart displays child's position vs peers
- [ ] Strengths highlighted
- [ ] Growth areas identified

---

### Dependencies

- Phase 5: Parent Dashboard (displays comparison)
- Phase 3: Game sessions (provides performance data)

---

