# Phase 1: Project Foundation

**Project:** ADHDLearn.com
**Phase:** 1 of 36
**Last Updated:** October 22, 2025

---

 Project Foundation

**Delivers:** Clean directory structure and git repository
**Aurora gets:** Nothing yet
**You get:** Organized development environment
**Deployed:** Nothing (local only)

### What This Phase Delivers

Local development environment with complete project structure:
- Monorepo directory layout
- Git repository initialized
- .gitignore configured
- README files in all major directories
- npm workspace configuration
- ESLint and Prettier configured

### Database Changes

None

### API Endpoints

None

### Frontend Changes

**New Directory Structure:**
```
/home/corey/Desktop/ADHDLearn.com/
├── .ai/                          # Planning documents
│   ├── plan/
│   │   ├── PLAN.md
│   │   ├── GHERKIN.md
│   │   ├── UML.md
│   │   ├── WIREFRAMES.md
│   │   └── PHASES_OVERVIEW.md
│   └── phases/                   # Per-phase docs
│       ├── phase-00/
│       ├── phase-01/
│       └── ...
├── backend/                      # Node.js API
│   ├── src/
│   │   ├── index.js
│   │   ├── config/
│   │   ├── models/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── middleware/
│   │   └── utils/
│   ├── tests/
│   ├── package.json
│   └── README.md
├── child-portal/                 # React + Phaser
│   ├── src/
│   │   ├── components/
│   │   ├── games/
│   │   ├── services/
│   │   ├── assets/
│   │   └── App.jsx
│   ├── public/
│   ├── package.json
│   └── vite.config.js
├── parent-portal/                # React
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.jsx
│   ├── public/
│   ├── package.json
│   └── vite.config.js
├── marketing-website/            # Static HTML
│   ├── index.html
│   ├── styles.css
│   └── script.js
├── shared/                       # Shared utilities
│   ├── constants.js
│   ├── validators.js
│   └── types.js
├── tests/                        # E2E tests
│   └── playwright/
├── scripts/                      # Deployment scripts
│   ├── deploy-staging.sh
│   └── deploy-production.sh
├── package.json                  # Root package.json (workspaces)
├── .gitignore
└── README.md
```

### Technical Specifications

#### Root package.json (Workspaces)

```json
{
  "name": "adhdlearn-platform",
  "version": "1.0.0",
  "private": true,
  "workspaces": [
    "backend",
    "child-portal",
    "parent-portal",
    "shared"
  ],
  "scripts": {
    "dev:backend": "npm run dev --workspace=backend",
    "dev:child": "npm run dev --workspace=child-portal",
    "dev:parent": "npm run dev --workspace=parent-portal",
    "build:all": "npm run build --workspaces",
    "test:all": "npm run test --workspaces",
    "lint": "eslint . --ext .js,.jsx",
    "format": "prettier --write \"**/*.{js,jsx,json,md}\""
  },
  "devDependencies": {
    "eslint": "^8.50.0",
    "prettier": "^3.0.3"
  }
}
```

#### .gitignore

```
# Dependencies
node_modules/
.pnp
.pnp.js

# Production builds
dist/
build/
*.log

# Environment
.env
.env.local
.env.production

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Logs
logs/
*.log
npm-debug.log*

# Testing
coverage/
.nyc_output/

# Temporary
.tmp/
temp/
```

#### ESLint Configuration (.eslintrc.json)

```json
{
  "env": {
    "browser": true,
    "es2021": true,
    "node": true
  },
  "extends": [
    "eslint:recommended",
    "plugin:react/recommended"
  ],
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module"
  },
  "rules": {
    "complexity": ["error", 5],
    "no-console": "warn",
    "no-unused-vars": "error"
  }
}
```

### Acceptance Criteria

- [ ] All directories created with README files
- [ ] Git repository initialized
- [ ] npm workspaces configured and working
- [ ] ESLint passes with McCabe ≤ 5 rule
- [ ] Prettier configured
- [ ] Can run `npm install` from root (installs all workspaces)
- [ ] README.md documents project structure

### McCabe Complexity

N/A (no code yet)

### Dependencies

- Phase 0 must be complete

---

