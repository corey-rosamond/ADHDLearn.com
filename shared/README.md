# ADHDLearn.com Shared Utilities

Shared constants, validators, and type definitions used across the platform.

## Structure

```
shared/
├── constants.js     # Platform-wide constants
├── validators.js    # Validation functions
├── types.js         # JSDoc type definitions
├── package.json     # Package configuration
└── README.md        # This file
```

## Usage

Import shared utilities in any workspace:

```javascript
// Import constants
import { API_BASE_URL, CATEGORIES } from 'adhdlearn-shared/constants.js';

// Import validators
import { isValidEmail, isValidPIN } from 'adhdlearn-shared/validators.js';
```

## Contents

### constants.js
- API URLs
- Category IDs and colors
- ADHD-friendly design constants

### validators.js
- Email validation
- Password validation
- PIN validation

### types.js
- JSDoc type definitions
- Shared interfaces

## Status

- Phase 1: Initial structure created ✅
- Will be expanded as features are added
