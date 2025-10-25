# Phase 4: Parent Registration + Login

**Project:** ADHDLearn.com
**Phase:** 4 of 36
**Last Updated:** October 22, 2025

---

 Parent Registration + Login

**Delivers:** You can create an account and login
**Aurora gets:** Nothing new
**You get:** 🔐 **Can create account and login to parent portal**
**Deployed:** parent.adhdlearn.com has working auth

### What This Phase Delivers

Parent portal with authentication:
- Registration form (email, password, family name)
- Login form (email, password)
- JWT token-based authentication
- Password hashing with bcrypt
- Session management

### Database Changes

**New Tables:**

#### families
```sql
CREATE TABLE families (
    family_id INT PRIMARY KEY AUTO_INCREMENT,
    family_name VARCHAR(100) NOT NULL,
    subscription_tier ENUM('free', 'premium') DEFAULT 'free',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_created (created_at)
);
```

#### users
```sql
CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    family_id INT NOT NULL,
    role ENUM('parent', 'child') NOT NULL,

    -- Parent fields
    email VARCHAR(255) UNIQUE,
    password_hash VARCHAR(255),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100),

    -- Child fields (NULL for parents)
    pin_code CHAR(60),              -- bcrypt hash
    avatar_url VARCHAR(255),
    birth_date DATE,

    -- Shared
    total_points INT DEFAULT 0,
    current_streak INT DEFAULT 0,
    longest_streak INT DEFAULT 0,

    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (family_id) REFERENCES families(family_id) ON DELETE CASCADE,
    INDEX idx_family_role (family_id, role),
    INDEX idx_email (email),
    UNIQUE KEY uk_family_pin (family_id, pin_code)
);
```

#### auth_sessions
```sql
CREATE TABLE auth_sessions (
    session_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    token VARCHAR(500) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    ip_address VARCHAR(45),
    user_agent VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_token (token(255)),
    INDEX idx_expires (expires_at),
    INDEX idx_user (user_id)
);
```

### API Endpoints

#### POST /api/auth/register
**Purpose:** Register new family + first parent
**Body:**
```json
{
  "firstName": "Corey",
  "lastName": "Smith",
  "email": "corey@example.com",
  "password": "SecurePass123!",
  "familyName": "Smith Family"
}
```
**Response (201):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "userId": 1,
    "familyId": 1,
    "role": "parent",
    "firstName": "Corey",
    "email": "corey@example.com"
  }
}
```

#### POST /api/auth/login/parent
**Purpose:** Parent email/password login
**Body:**
```json
{
  "email": "corey@example.com",
  "password": "SecurePass123!"
}
```
**Response (200):**
```json
{
  "success": true,
  "token": "eyJhbGci...",
  "user": {
    "userId": 1,
    "familyId": 1,
    "role": "parent",
    "firstName": "Corey",
    "email": "corey@example.com"
  }
}
```
**Errors:**
- 401: Invalid credentials
- 403: Account locked

### Frontend Changes

**New Files in `parent-portal/`:**
```
src/
├── pages/
│   ├── Login.jsx
│   ├── Register.jsx
│   └── Dashboard.jsx
├── services/
│   └── auth.js
├── context/
│   └── AuthContext.jsx
├── App.jsx
└── main.jsx
```

### Technical Specifications

*(Due to space, showing key implementation details)*

**Backend: `backend/src/controllers/authController.js`**
```javascript
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

async function register(req, res) {
  const { firstName, lastName, email, password, familyName } = req.body;

  // Validate input
  if (!firstName || !email || !password || !familyName) {
    return res.status(400).json({
      success: false,
      error: 'Missing required fields'
    });
  }

  // Password validation
  if (password.length < 8) {
    return res.status(400).json({
      success: false,
      error: 'Password must be at least 8 characters'
    });
  }

  try {
    // Check if email exists
    const [existing] = await pool.execute(
      'SELECT user_id FROM users WHERE email = ?',
      [email]
    );

    if (existing.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Email already registered'
      });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create family
    const [familyResult] = await pool.execute(
      'INSERT INTO families (family_name) VALUES (?)',
      [familyName]
    );

    const familyId = familyResult.insertId;

    // Create parent user
    const [userResult] = await pool.execute(
      `INSERT INTO users (family_id, role, email, password_hash, first_name, last_name)
       VALUES (?, 'parent', ?, ?, ?, ?)`,
      [familyId, email, passwordHash, firstName, lastName || null]
    );

    const userId = userResult.insertId;

    // Generate JWT token
    const token = jwt.sign(
      { userId, familyId, role: 'parent' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Save session
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await pool.execute(
      `INSERT INTO auth_sessions (user_id, token, expires_at, ip_address, user_agent)
       VALUES (?, ?, ?, ?, ?)`,
      [userId, token, expiresAt, req.ip, req.get('user-agent')]
    );

    res.status(201).json({
      success: true,
      token,
      user: {
        userId,
        familyId,
        role: 'parent',
        firstName,
        email
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
}

// McCabe complexity: 5 (within limit)
```

**Frontend: `parent-portal/src/pages/Register.jsx`**
```javascript
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../services/auth';

export default function Register() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    familyName: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const result = await register(formData);
      localStorage.setItem('token', result.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed');
    }
  };

  return (
    <div className="register-page">
      <h1>Create Your Family Account</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="First Name"
          value={formData.firstName}
          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Last Name"
          value={formData.lastName}
          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
        />
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Password (min 8 characters)"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Family Name"
          value={formData.familyName}
          onChange={(e) => setFormData({ ...formData, familyName: e.target.value })}
          required
        />
        {error && <p className="error">{error}</p>}
        <button type="submit">CREATE ACCOUNT</button>
      </form>
    </div>
  );
}
```

### Acceptance Criteria

- [ ] Parent can register with email/password
- [ ] Password is hashed with bcrypt before storage
- [ ] JWT token generated on successful registration
- [ ] Parent can login with email/password
- [ ] Invalid credentials return 401 error
- [ ] Duplicate email returns 400 error
- [ ] Token stored in localStorage
- [ ] Token included in Authorization header for API requests
- [ ] Token expires after 7 days
- [ ] Parent redirected to /dashboard after login

### McCabe Complexity

All functions ≤ 5:
- `register()` controller: 5
- `login()` controller: 4
- `handleSubmit()` (Register.jsx): 3

### Dependencies

- Phase 3: Database and backend infrastructure

---

