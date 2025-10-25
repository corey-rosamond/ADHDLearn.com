# ADHDLearn.com

Family learning platform for children with ADHD

## Overview

ADHDLearn.com is a comprehensive learning platform designed specifically for children with ADHD. It features educational games, progress tracking, chore management, and parent dashboards.

**Primary User:** Aurora (age 4-10)
**Target Device:** Samsung Galaxy Tab S7 FE (2560x1600)

## Technology Stack

- **Frontend:** React 18 + Vite + Tailwind CSS + Phaser 3
- **Backend:** Node.js 18+ + Express + MySQL 8.0
- **Real-time:** Socket.io
- **Deployment:** Apache + Let's Encrypt SSL
- **Android:** Capacitor wrapper

See `.ai/TECHNOLOGY_STACK.md` for complete details.

## Project Structure

```
ADHDLearn.com/
├── .ai/                    # Planning and documentation
├── backend/                # Node.js API server
├── child-portal/           # React + Phaser games (child-facing)
├── parent-portal/          # React dashboard (parent-facing)
├── marketing-website/      # Static HTML marketing site
├── shared/                 # Shared utilities and constants
├── tests/                  # E2E tests (Playwright)
├── scripts/                # Deployment and utility scripts
├── android/                # Capacitor Android wrapper
├── assets/                 # Shared assets
├── package.json            # Root workspace configuration
└── README.md               # This file
```

## Development

### Prerequisites

- Node.js 18+ LTS
- npm 9+
- MySQL 8.0 (remote: 160.153.180.159)
- Git

### Installation

```bash
# Install all workspace dependencies
npm install

# Run development servers
npm run dev:backend    # Backend API (port 5000)
npm run dev:child      # Child portal (port 3000)
npm run dev:parent     # Parent portal (port 3001)
```

### Building

```bash
# Build all workspaces
npm run build:all

# Run tests across all workspaces
npm run test:all
```

### Code Quality

```bash
# Lint all code
npm run lint

# Format all code
npm run format
```

## Domains

### Production
- **adhdlearn.com** - Marketing website
- **child.adhdlearn.com** - Child portal
- **parent.adhdlearn.com** - Parent dashboard
- **api.adhdlearn.com** - Backend API

### Staging
- **staging.adhdlearn.com** - Marketing (staging)
- **child-staging.adhdlearn.com** - Child portal (staging)
- **parent-staging.adhdlearn.com** - Parent dashboard (staging)
- **api-staging.adhdlearn.com** - Backend API (staging)

## Development Phases

37 phases planned, each delivering working, deployable features.

- **Phase 0:** ✅ Server Infrastructure (Complete)
- **Phase 1:** ✅ Project Foundation (In Progress)
- **Phase 2:** Deploy Letter Pop game (pending)
- **Phase 3:** Database + Backend (pending)
- ...36 total phases

See `.ai/plan/PHASES_OVERVIEW.md` for complete roadmap.

## ADHD-Friendly Design Principles

All UI elements follow strict guidelines:

- **Immediate feedback:** < 50ms response time
- **High contrast:** WCAG AAA contrast ratios
- **Large touch targets:** ≥ 44×44px minimum
- **Non-punitive:** Encouraging messages, never "wrong" or "failure"
- **Clear progress:** Always show where they are and what's next
- **Minimal distractions:** Clean UI, focused content

See `.ai/GUARDRAILS.md` for complete design rules.

## Code Quality Standards

- **McCabe Complexity:** ALL functions ≤ 5 (enforced by ESLint)
- **Single Responsibility:** Each function does one thing
- **BDD Testing:** Manual testing with Gherkin scenarios
- **Documentation:** Inline comments for complex logic

No exceptions. Quality is mandatory.

## Contributing

This is a personal project for Aurora. Not accepting external contributions.

## License

UNLICENSED - Private project

---

**Created:** October 2025
**Developer:** Corey
**Purpose:** Building a learning platform that Aurora deserves
