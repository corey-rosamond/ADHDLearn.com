# Phase 15: Chore System - Parent Side

**Project:** ADHDLearn.com
**Phase:** 15 of 36
**Last Updated:** October 22, 2025

---

 Chore System - Parent Side

**Delivers:** You can create and manage chores for Aurora
**Aurora gets:** Nothing new (sees chores in Phase 16)
**You get:** 📝 **Chore Manager - Create chores, assign to Aurora**
**Deployed:** Parent portal has working chore management

---

### What This Phase Delivers

Chore management UI for parents:
- Chore Manager page in parent portal
- Create new chore form
- Assign chore to Aurora
- Set points value and due date
- View all chores (pending, completed, approved)
- Approve/reject completed chores
- View photo proof from Aurora
- Delete chores

---

### Database Changes

**No new tables** - Uses `chores` table from Phase 14.

---

### API Endpoints

**No new endpoints** - Uses endpoints from Phase 14:
- POST /api/chores
- GET /api/chores
- PATCH /api/chores/:id/approve
- DELETE /api/chores/:id

---

### Frontend Changes

**New Files in `parent-portal/src/pages/`:**
```
pages/
├── ChoreManager.jsx         (Main chore management page)
├── CreateChoreForm.jsx      (Form to create new chore)
└── ChoreCard.jsx            (Individual chore display)
```

**Add route in `parent-portal/src/App.jsx`:**
```javascript
import ChoreManager from './pages/ChoreManager';

<Route path="/chores" element={<ChoreManager />} />
```

**Update navigation in `parent-portal/src/components/Navigation.jsx`:**
```javascript
<nav>
  <Link to="/dashboard">Dashboard</Link>
  <Link to="/children">Children</Link>
  <Link to="/chores">Chores</Link>  {/* New */}
  <Link to="/settings">Settings</Link>
</nav>
```

---

### Technical Specifications

**ChoreManager.jsx:**
```javascript
import React, { useState, useEffect } from 'react';
import api from '../services/api';
import CreateChoreForm from './CreateChoreForm';
import ChoreCard from './ChoreCard';
import './ChoreManager.css';

export default function ChoreManager() {
  const [chores, setChores] = useState([]);
  const [children, setChildren] = useState([]);
  const [filter, setFilter] = useState('all');
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    fetchChores();
    fetchChildren();
  }, [filter]);

  async function fetchChores() {
    try {
      const query = filter !== 'all' ? `?status=${filter}` : '';
      const response = await api.get(`/api/chores${query}`);
      setChores(response.chores);
    } catch (error) {
      console.error('Failed to fetch chores:', error);
    }
  }

  async function fetchChildren() {
    try {
      const response = await api.get('/api/children');
      setChildren(response.children);
    } catch (error) {
      console.error('Failed to fetch children:', error);
    }
  }

  async function handleApprove(choreId, approved) {
    try {
      await api.patch(`/api/chores/${choreId}/approve`, { approved });
      fetchChores(); // Refresh list
    } catch (error) {
      console.error('Failed to approve chore:', error);
    }
  }

  async function handleDelete(choreId) {
    if (!confirm('Are you sure you want to delete this chore?')) return;
    
    try {
      await api.delete(`/api/chores/${choreId}`);
      fetchChores(); // Refresh list
    } catch (error) {
      console.error('Failed to delete chore:', error);
    }
  }

  return (
    <div className="chore-manager">
      <div className="header">
        <h1>Chore Manager</h1>
        <button onClick={() => setShowCreateForm(true)} className="create-btn">
          + New Chore
        </button>
      </div>

      <div className="filters">
        <button 
          className={filter === 'all' ? 'active' : ''}
          onClick={() => setFilter('all')}
        >
          All
        </button>
        <button 
          className={filter === 'pending' ? 'active' : ''}
          onClick={() => setFilter('pending')}
        >
          Pending
        </button>
        <button 
          className={filter === 'completed' ? 'active' : ''}
          onClick={() => setFilter('completed')}
        >
          Awaiting Approval
        </button>
        <button 
          className={filter === 'approved' ? 'active' : ''}
          onClick={() => setFilter('approved')}
        >
          Approved
        </button>
      </div>

      <div className="chores-list">
        {chores.length === 0 ? (
          <p className="empty-state">No chores found. Create one to get started!</p>
        ) : (
          chores.map(chore => (
            <ChoreCard
              key={chore.choreId}
              chore={chore}
              onApprove={handleApprove}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>

      {showCreateForm && (
        <CreateChoreForm
          children={children}
          onClose={() => setShowCreateForm(false)}
          onCreated={fetchChores}
        />
      )}
    </div>
  );
}

// McCabe complexity: 3 (within limit)
```

**CreateChoreForm.jsx:**
```javascript
import React, { useState } from 'react';
import api from '../services/api';
import './CreateChoreForm.css';

export default function CreateChoreForm({ children, onClose, onCreated }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assignedToUserId: '',
    pointsValue: 5,
    dueDate: '',
    isRecurring: false,
    recurrencePattern: 'daily'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await api.post('/api/chores', formData);
      onCreated(); // Refresh parent list
      onClose(); // Close form
    } catch (err) {
      setError(err.message || 'Failed to create chore');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Create New Chore</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              placeholder="Make your bed"
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Straighten sheets and fluff pillows"
            />
          </div>

          <div className="form-group">
            <label>Assign to</label>
            <select
              value={formData.assignedToUserId}
              onChange={(e) => setFormData({ ...formData, assignedToUserId: e.target.value })}
            >
              <option value="">Unassigned</option>
              {children.map(child => (
                <option key={child.userId} value={child.userId}>
                  {child.firstName}
                </option>
              ))}
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Points Value *</label>
              <input
                type="number"
                value={formData.pointsValue}
                onChange={(e) => setFormData({ ...formData, pointsValue: parseInt(e.target.value) })}
                min="1"
                required
              />
            </div>

            <div className="form-group">
              <label>Due Date</label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label>
              <input
                type="checkbox"
                checked={formData.isRecurring}
                onChange={(e) => setFormData({ ...formData, isRecurring: e.target.checked })}
              />
              Recurring Chore
            </label>
          </div>

          {formData.isRecurring && (
            <div className="form-group">
              <label>Recurrence</label>
              <select
                value={formData.recurrencePattern}
                onChange={(e) => setFormData({ ...formData, recurrencePattern: e.target.value })}
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
          )}

          {error && <p className="error">{error}</p>}

          <div className="form-actions">
            <button type="button" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Chore'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// McCabe complexity: 3 (within limit)
```

---

### Acceptance Criteria

- [ ] Chore Manager page accessible from parent navigation
- [ ] "New Chore" button opens create form
- [ ] Create form validates required fields
- [ ] Parent can assign chore to Aurora
- [ ] Parent can set points value (1-100)
- [ ] Parent can set due date
- [ ] Parent can make chore recurring
- [ ] Chore saves to database successfully
- [ ] Chores list displays all family chores
- [ ] Filter buttons work (All, Pending, Awaiting Approval, Approved)
- [ ] Completed chores show photo proof
- [ ] Parent can approve completed chores
- [ ] Parent can reject completed chores
- [ ] Approving adds points to Aurora's total
- [ ] Parent can delete chores
- [ ] Empty state shows when no chores exist
- [ ] Error handling displays user-friendly messages

---

### McCabe Complexity

All functions ≤ 5:
- ChoreManager component: 3
- CreateChoreForm component: 3
- `handleApprove()`: 2
- `handleDelete()`: 2
- `handleSubmit()`: 2

---

### Dependencies

- Phase 4: Parent Registration + Login (requires parent authentication)
- Phase 14: Chore System - Backend (requires chore API endpoints)

---

