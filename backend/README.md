# ADHDLearn.com Backend API

Node.js + Express API server for ADHDLearn.com

## Technology Stack

- **Runtime:** Node.js 18+ LTS
- **Framework:** Express.js
- **Database:** MySQL 8.0 (160.153.180.159)
- **Authentication:** JWT (jsonwebtoken)
- **Password Hashing:** bcrypt
- **Validation:** express-validator
- **Real-time:** Socket.io

## Directory Structure

```
backend/
├── src/
│   ├── index.js           # Main entry point
│   ├── config/            # Configuration files
│   ├── models/            # Database models
│   ├── controllers/       # Business logic
│   ├── routes/            # Express routes
│   ├── middleware/        # Express middleware
│   └── utils/             # Utility functions
├── tests/                 # Test files
├── package.json           # Dependencies
└── README.md              # This file
```

## Development

```bash
# Install dependencies
npm install

# Run in development mode (with auto-reload)
npm run dev

# Run in production mode
npm start

# Run tests
npm test
```

## API Endpoints

Will be documented as they are implemented in subsequent phases.

## Environment Variables

Create a `.env` file in this directory with:

```
DB_HOST=160.153.180.159
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=adhdlearn
JWT_SECRET=your_secret_key
PORT=5000
```

**Never commit `.env` to git**

## Status

- Phase 1: Directory structure created ✅
- Phase 3: Database + Simple Backend (pending)
- Phase 4: Parent Registration + Login (pending)
