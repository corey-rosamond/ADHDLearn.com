# Phase 14: Chore System - Backend

**Project:** ADHDLearn.com
**Phase:** 14 of 36
**Last Updated:** October 22, 2025

---

 Chore System - Backend

**Delivers:** Chore infrastructure ready (backend only)
**Aurora gets:** Nothing yet
**You get:** Nothing visible yet (infrastructure)
**Deployed:** Chore API endpoints ready

---

### What This Phase Delivers

Backend foundation for chore system:
- Database table for chores
- API endpoints: create, list, update, mark complete, approve
- Chore assignment to children
- Points reward system
- Photo proof upload capability (optional)
- Status tracking (pending, completed, approved)

---

### Database Changes

**New Table:** `chores`
```sql
CREATE TABLE chores (
    chore_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    family_id INT NOT NULL,
    assigned_to_user_id INT,              -- Child user_id
    created_by_user_id INT NOT NULL,      -- Parent user_id
    
    title VARCHAR(200) NOT NULL,
    description TEXT,
    points_value INT NOT NULL DEFAULT 10,
    
    status ENUM('pending', 'completed', 'approved', 'rejected') DEFAULT 'pending',
    
    -- Proof tracking
    photo_url VARCHAR(500),
    completed_at TIMESTAMP NULL,
    approved_at TIMESTAMP NULL,
    approved_by_user_id INT,
    
    -- Scheduling
    due_date DATE,
    is_recurring BOOLEAN DEFAULT FALSE,
    recurrence_pattern ENUM('daily', 'weekly', 'monthly') NULL,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (family_id) REFERENCES families(family_id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_to_user_id) REFERENCES users(user_id) ON DELETE SET NULL,
    FOREIGN KEY (created_by_user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (approved_by_user_id) REFERENCES users(user_id) ON DELETE SET NULL,
    
    INDEX idx_family (family_id),
    INDEX idx_assigned (assigned_to_user_id, status),
    INDEX idx_due_date (due_date),
    INDEX idx_status (status)
);
```

---

### API Endpoints

#### POST /api/chores
**Purpose:** Create new chore
**Headers:** `Authorization: Bearer {token}` (Parent role required)
**Body:**
```json
{
  "title": "Make your bed",
  "description": "Straighten sheets and fluff pillows",
  "assignedToUserId": 2,
  "pointsValue": 5,
  "dueDate": "2025-10-23",
  "isRecurring": true,
  "recurrencePattern": "daily"
}
```
**Response (201):**
```json
{
  "success": true,
  "chore": {
    "choreId": 1,
    "title": "Make your bed",
    "assignedToUserId": 2,
    "pointsValue": 5,
    "status": "pending",
    "dueDate": "2025-10-23",
    "createdAt": "2025-10-22T14:00:00Z"
  }
}
```

#### GET /api/chores?assignedTo={userId}&status={status}
**Purpose:** Get chores list (filtered)
**Headers:** `Authorization: Bearer {token}`
**Query Parameters:**
- `assignedTo` (optional): Filter by child user_id
- `status` (optional): Filter by status (pending, completed, approved)
**Response (200):**
```json
{
  "success": true,
  "chores": [
    {
      "choreId": 1,
      "title": "Make your bed",
      "description": "Straighten sheets and fluff pillows",
      "assignedToUserId": 2,
      "assignedToName": "Aurora",
      "pointsValue": 5,
      "status": "pending",
      "dueDate": "2025-10-23",
      "createdAt": "2025-10-22T14:00:00Z"
    }
  ]
}
```

#### PATCH /api/chores/:choreId/complete
**Purpose:** Mark chore as completed (child action)
**Headers:** `Authorization: Bearer {token}` (Child role)
**Body:**
```json
{
  "photoUrl": "https://s3.amazonaws.com/adhdlearn/chores/photo_123.jpg"
}
```
**Response (200):**
```json
{
  "success": true,
  "chore": {
    "choreId": 1,
    "status": "completed",
    "completedAt": "2025-10-23T08:30:00Z",
    "photoUrl": "https://s3.amazonaws.com/adhdlearn/chores/photo_123.jpg"
  }
}
```

#### PATCH /api/chores/:choreId/approve
**Purpose:** Approve completed chore (parent action)
**Headers:** `Authorization: Bearer {token}` (Parent role required)
**Body:**
```json
{
  "approved": true
}
```
**Response (200):**
```json
{
  "success": true,
  "chore": {
    "choreId": 1,
    "status": "approved",
    "approvedAt": "2025-10-23T18:00:00Z",
    "approvedByUserId": 1,
    "pointsAwarded": 5
  },
  "child": {
    "userId": 2,
    "totalPoints": 455
  }
}
```

**Note:** When approved, points are added to child's `total_points` in users table.

#### DELETE /api/chores/:choreId
**Purpose:** Delete chore
**Headers:** `Authorization: Bearer {token}` (Parent role required)
**Response (200):**
```json
{
  "success": true,
  "message": "Chore deleted"
}
```

---

### Frontend Changes

**None** - This phase is backend-only infrastructure.

---

### Technical Specifications

**Backend: `backend/src/controllers/choresController.js`:**
```javascript
const pool = require('../db/pool');

async function createChore(req, res) {
  const { title, description, assignedToUserId, pointsValue, dueDate, isRecurring, recurrencePattern } = req.body;
  const createdByUserId = req.user.userId;
  const familyId = req.user.familyId;
  
  // Validate parent role
  if (req.user.role !== 'parent') {
    return res.status(403).json({
      success: false,
      error: 'Only parents can create chores'
    });
  }
  
  if (!title || !pointsValue) {
    return res.status(400).json({
      success: false,
      error: 'Missing required fields'
    });
  }
  
  try {
    const [result] = await pool.execute(
      `INSERT INTO chores (family_id, assigned_to_user_id, created_by_user_id, title, description, points_value, due_date, is_recurring, recurrence_pattern)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [familyId, assignedToUserId || null, createdByUserId, title, description || null, pointsValue, dueDate || null, isRecurring || false, recurrencePattern || null]
    );
    
    const [chores] = await pool.execute(
      'SELECT * FROM chores WHERE chore_id = ?',
      [result.insertId]
    );
    
    res.status(201).json({
      success: true,
      chore: chores[0]
    });
  } catch (error) {
    console.error('Create chore error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
}

// McCabe complexity: 4 (within limit)

async function approveChore(req, res) {
  const { choreId } = req.params;
  const { approved } = req.body;
  const approvedByUserId = req.user.userId;
  
  // Validate parent role
  if (req.user.role !== 'parent') {
    return res.status(403).json({
      success: false,
      error: 'Only parents can approve chores'
    });
  }
  
  try {
    // Get chore details
    const [chores] = await pool.execute(
      'SELECT * FROM chores WHERE chore_id = ?',
      [choreId]
    );
    
    if (chores.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Chore not found'
      });
    }
    
    const chore = chores[0];
    const newStatus = approved ? 'approved' : 'rejected';
    
    // Update chore status
    await pool.execute(
      `UPDATE chores 
       SET status = ?, approved_at = CURRENT_TIMESTAMP, approved_by_user_id = ?
       WHERE chore_id = ?`,
      [newStatus, approvedByUserId, choreId]
    );
    
    // If approved, award points to child
    if (approved && chore.assigned_to_user_id) {
      await pool.execute(
        'UPDATE users SET total_points = total_points + ? WHERE user_id = ?',
        [chore.points_value, chore.assigned_to_user_id]
      );
    }
    
    // Fetch updated child info
    const [children] = await pool.execute(
      'SELECT user_id, total_points FROM users WHERE user_id = ?',
      [chore.assigned_to_user_id]
    );
    
    res.json({
      success: true,
      chore: {
        choreId,
        status: newStatus,
        approvedAt: new Date(),
        approvedByUserId,
        pointsAwarded: approved ? chore.points_value : 0
      },
      child: children[0]
    });
  } catch (error) {
    console.error('Approve chore error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
}

// McCabe complexity: 5 (at limit, acceptable)

module.exports = {
  createChore,
  approveChore,
  // ... other exports
};
```

---

### Acceptance Criteria

- [ ] Chores table created in database
- [ ] POST /api/chores creates new chore
- [ ] Only parents can create chores (403 for non-parents)
- [ ] GET /api/chores returns chores list
- [ ] Filtering by assignedTo works
- [ ] Filtering by status works
- [ ] PATCH /api/chores/:id/complete marks chore completed
- [ ] Photo URL saved with completion
- [ ] PATCH /api/chores/:id/approve approves chore
- [ ] Approving chore adds points to child's total_points
- [ ] Only parents can approve chores
- [ ] DELETE /api/chores/:id deletes chore
- [ ] Recurring chores supported in database
- [ ] All API endpoints return proper error codes
- [ ] API validates user roles correctly

---

### McCabe Complexity

All functions ≤ 5:
- `createChore()`: 4
- `approveChore()`: 5
- `getChores()`: 3
- `completeChore()`: 3

---

### Dependencies

- Phase 4: Parent Registration + Login (requires parent authentication)
- Phase 7: Child Login (requires child authentication for completion)


---

