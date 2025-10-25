# Phase 24: Life Skills - Cooking Helper

**Project:** ADHDLearn.com
**Phase:** 24 of 36
**Last Updated:** October 22, 2025

---

 Life Skills - Cooking Helper

**Delivers:** Cooking recipes and measurement game
**Aurora gets:** 🍳 **Cooking Helper - Recipes + measurement practice**
**You get:** Aurora practices real-life cooking skills
**Deployed:** Cooking Helper in Life Skills category

---

### What This Phase Delivers

Cooking Helper features:
- Recipe browser (10 kid-friendly recipes)
- Step-by-step instructions with images
- Measurement conversion game (1 cup = 16 tablespoons)
- Mark recipe as "cooked" (you verify)
- Safety tips

---

### Database Changes

**New Table:** `cooking_recipes`
```sql
CREATE TABLE cooking_recipes (
    recipe_id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    difficulty ENUM('easy', 'medium', 'hard') DEFAULT 'easy',
    prep_time_minutes INT,
    
    ingredients JSON,
    instructions JSON,
    image_url VARCHAR(255),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**New Table:** `recipe_completions`
```sql
CREATE TABLE recipe_completions (
    completion_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    recipe_id INT NOT NULL,
    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    approved_by_user_id INT,
    approved_at TIMESTAMP NULL,
    
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (recipe_id) REFERENCES cooking_recipes(recipe_id) ON DELETE CASCADE,
    
    INDEX idx_user (user_id),
    INDEX idx_recipe (recipe_id)
);
```

---

### Acceptance Criteria

- [ ] Cooking Helper accessible from Life Skills category
- [ ] Recipe browser displays 10 recipes
- [ ] Recipe detail page shows ingredients and steps
- [ ] Measurement game works
- [ ] Child can mark recipe as cooked
- [ ] Parent approves completion

---

### Dependencies

- Phase 8: Child Dashboard (Life Skills category)

---

