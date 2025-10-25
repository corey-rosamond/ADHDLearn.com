# START HERE - Development Entry Point

## Current Status
**Technology:** React + Phaser 3 + Node.js + MySQL (Full-Stack Platform)
**Current Phase:** Phase 0 (Completed) → Ready for Phase 1
**Planning Status:** All 37 phases fully documented
**Status:** Server infrastructure deployed and operational
**Last Updated:** October 25, 2025

**Quick Context:**
- Existing Phaser game (Letter Pop) working and archived
- 37 phases planned for full platform development
- Each phase has PLAN.md, GHERKIN.md, UML.md, WIREFRAMES.md
- Technology stack finalized and documented

---

## What Happened - Important Context

### Kotlin/libGDX Attempt (October 2025)
**Attempted:** Native Android + Web from single Kotlin codebase using libGDX
**Result:** FAILED - Technical incompatibility discovered
**Duration:** ~5 days of development
**Outcome:** Archived to `archive/kotlin-libgdx-attempt/`

**Why it failed:**
- libGDX's HTML5 backend requires GWT (Google Web Toolkit)
- GWT compiles **Java source → JavaScript** only
- GWT **cannot** compile Kotlin code
- All 3,000+ lines of core game logic were written in Kotlin
- No workaround exists without rewriting everything in Java

**What was learned:**
- libGDX multi-platform works great **with Java**
- libGDX + Kotlin works for Android/Desktop (JVM targets)
- libGDX + Kotlin + Web **does not work** (GWT limitation)
- Always verify transpiler compatibility before choosing tech stack

### Current State: Back to Phaser
**Restored from:** `archive/phaser-web/`
**Technology:** Phaser 3 + JavaScript
**Deployment:** PWA (Progressive Web App)
**Status:** Working, functional game

---

## Architecture Overview

### 4 Subdomains (Production + Staging)
1. **adhdlearn.com** - Marketing website (static HTML)
2. **child.adhdlearn.com** - Child portal (React + Phaser games)
3. **parent.adhdlearn.com** - Parent dashboard (React + Tailwind)
4. **api.adhdlearn.com** - Backend API (Node.js + Express)

**Total:** 8 Apache virtual hosts (staging + production for each)

### Technology Stack
- **Frontend:** React 18 + Vite + Tailwind CSS
- **Games:** Phaser 3.80.1+
- **Backend:** Node.js 18+ + Express
- **Database:** MySQL 8.0 (160.153.180.159)
- **Real-time:** Socket.io
- **Deployment:** Apache + Let's Encrypt SSL
- **Android:** Capacitor wrapper

**See `.ai/TECHNOLOGY_STACK.md` for complete details**

---

## Project Structure (Full Platform)

```
/home/corey/Desktop/ADHDLearn.com/
├── .ai/                           # All planning and documentation
│   ├── START.md                   # This file - entry point
│   ├── TECHNOLOGY_STACK.md        # Tech stack reference
│   ├── CONTEXT_SUMMARY.md         # Quick reference (load first)
│   ├── PHASE_WORKFLOW.md          # Phase completion guide
│   ├── ERROR_SOLUTIONS.md         # Common errors & fixes
│   ├── GUARDRAILS.md              # Code quality rules
│   ├── PERSONA.md                 # Developer philosophy
│   ├── MEMORY.md                  # Session memory
│   ├── RECOMMENDATIONS.md         # AI development tips
│   ├── phases/                    # 37 phase directories
│   │   └── phase-XX/
│   │       ├── PLAN.md            # Implementation plan
│   │       ├── GHERKIN.md         # Acceptance criteria
│   │       ├── UML.md             # Architecture diagrams
│   │       └── WIREFRAMES.md      # UI/UX designs
│   └── plan/                      # Master planning docs
│       ├── PHASES_OVERVIEW.md     # All phases overview
│       ├── PLAN.md                # Master plan
│       ├── UML.md                 # System architecture
│       └── WIREFRAMES.md          # Design system
├── backend/                       # Node.js API (to be created)
│   ├── server.js
│   ├── routes/
│   ├── middleware/
│   └── migrations/
├── src/                           # Child portal (existing Phaser)
│   ├── scenes/                    # Phaser game scenes
│   ├── games/                     # Game implementations
│   ├── components/                # React components
│   ├── services/                  # AudioManager, etc.
│   └── utils/
├── parent-portal/                 # Parent dashboard (to be created)
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── services/
│   └── package.json
├── marketing/                     # Marketing site (to be created)
├── android/                       # Capacitor wrapper (exists)
├── assets/                        # Shared assets (exists)
├── scripts/                       # Deployment scripts
└── test/                          # Test results and screenshots
```

---

## Development Commands

### Web Development
```bash
# Start HTTPS server (required for audio)
python3 https-server.py

# Access game
https://localhost:8000
```

### Android (Capacitor)
```bash
# Build web assets
# (No build step needed - plain JavaScript)

# Sync to Android
npx cap sync android

# Open in Android Studio
npx cap open android

# Or build APK
cd android
./gradlew assembleDebug
```

---

## Phaser Architecture

### Game Flow
1. **BootScene** - Initialize Phaser, load configuration
2. **PreloadScene** - Load all assets (audio, images)
3. **MainMenuScene** - Main menu with game selection
4. **LetterPopScene** - Letter Pop mini-game
5. **ResultsScene** - Score and celebration

### Key Files
- `src/config.js` - Game configuration (resolution, colors)
- `src/scenes/LetterPopScene.js` - Main game logic
- `src/gameobjects/Bubble.js` - Bubble physics and rendering
- `src/services/AudioManager.js` - Sound and voice playback
- `src/services/SettingsManager.js` - Volume, preferences

---

## What's Working (Phaser Version)

✅ Main Menu with game tiles
✅ Settings screen (volume controls)
✅ Letter Pop game
  - Uppercase/lowercase selection
  - Time limits (30s, 60s, 90s, unlimited)
  - Bubble physics (floating, bouncing)
  - Letter audio playback
  - Score tracking
✅ Results screen with star rating
✅ PWA support (installable on mobile)
✅ Android APK via Capacitor

---

## Performance (Phaser on WebView)

Current metrics on Samsung Galaxy Tab S7 FE:
- FPS: 55-60 (occasional drops to 45)
- Touch Latency: 50-80ms
- Memory Usage: ~150MB
- APK Size: 30MB
- Audio Latency: ~100ms

**Note:** These were the metrics that prompted the Kotlin/libGDX attempt. The native version achieved 60 FPS locked, 10-20ms touch latency, 80MB memory - but couldn't compile to web.

---

## Phase 0 Completion Summary ✅

**Status:** COMPLETED (October 25, 2025)
**Branch:** staging (commit 20b3242)

### What Was Deployed

**8 Live Domains (All HTTPS):**
- ✅ https://adhdlearn.com (200 OK - placeholder page)
- ✅ https://child.adhdlearn.com (200 OK - placeholder page)
- ✅ https://parent.adhdlearn.com (200 OK - placeholder page)
- ✅ https://api.adhdlearn.com (503 - awaiting backend)
- ✅ https://staging.adhdlearn.com (200 OK - placeholder page)
- ✅ https://child-staging.adhdlearn.com (200 OK - placeholder page)
- ✅ https://parent-staging.adhdlearn.com (200 OK - placeholder page)
- ✅ https://api-staging.adhdlearn.com (503 - awaiting backend)

**Infrastructure:**
- Apache 2.4+ with 8 virtual hosts configured
- Let's Encrypt SSL certificates (auto-renewal enabled)
- HTTP → HTTPS redirects on all domains
- Security headers (X-Frame-Options, X-Content-Type-Options, etc.)
- PM2 v6.0.13 installed and ready
- Firewall (ufw) active - ports 22, 80, 443 only
- Directory structure: `/var/www/adhdlearn.com/{production,staging}/{www,child,parent,api}`

**Server:** 160.153.180.159 (Ubuntu 24.04.2 LTS)

### Acceptance Criteria Met
- ✅ All 8 domains resolve to server IP
- ✅ All domains redirect HTTP → HTTPS
- ✅ SSL certificates valid (no browser warnings)
- ✅ Placeholder pages load successfully
- ✅ Security headers present in responses
- ✅ Firewall active (only ports 22, 80, 443 open)
- ✅ PM2 installed and configured

### Next: Phase 1 - Project Foundation

**To begin Phase 1, read these files in order:**

1. `.ai/phases/phase-01/PLAN.md` - Implementation plan
2. `.ai/phases/phase-01/GHERKIN.md` - Acceptance criteria & testing scenarios
3. `.ai/phases/phase-01/UML.md` - Architecture diagrams
4. `.ai/phases/phase-01/WIREFRAMES.md` - Design specifications

**Phase 1 delivers:**
- Local development environment setup
- Project directory structure
- Git repository configuration
- Build scripts and tooling
- Development server setup

---

## Development Roadmap

### 37 Phases (Value-Driven Development)

**Each phase delivers working, deployable features**

**Phase 0:** ✅ **COMPLETED** - Server Infrastructure (Apache, SSL, 8 vhosts)
**Phase 1:** Project Foundation (directory structure, git)
**Phase 2:** Deploy Letter Pop (Aurora can play)
**Phase 3:** Database + Backend (scores persist)
**Phase 4:** Parent Auth (registration, login)
**Phase 5:** Parent Dashboard (view Aurora's scores)
**Phase 6:** Family Management (add children)
**Phase 7:** Child Login (PIN-based)
**Phase 8:** Child Dashboard (categories)
**Phase 9-10:** More Reading Games (Word Builder, Sight Words)
**Phase 11-13:** Math Category (Counting, Shapes, Addition)
**Phase 14-16:** Chore System (full workflow)
**Phase 17-18:** Analytics (charts, confusion matrix)
**Phase 19:** Real-Time Updates (WebSocket)
**Phase 20:** Achievements & Badges
**Phase 21:** Marketing Website
**Phase 22:** Age Norms Comparison
**Phase 23:** Science Category
**Phase 24-26:** Life Skills (Cooking, 3D Printing, Shopping)
**Phase 27:** Weekly Email Reports
**Phase 28:** ML Pattern Detection
**Phase 29:** PDF Reports
**Phase 30:** Android APK
**Phase 31:** Multi-Parent Support
**Phase 32:** Multiple Children
**Phase 33:** Parental Controls
**Phase 34:** Advanced Testing (Playwright, CI/CD)
**Phase 35:** Performance Optimization
**Phase 36:** Accessibility Improvements

**See `.ai/plan/PHASES_OVERVIEW.md` for detailed descriptions**

---

## Quick Start for AI Development

**Before starting ANY phase:**

1. **Read context files:**
   - `.ai/CONTEXT_SUMMARY.md` - Load this FIRST every session
   - `.ai/TECHNOLOGY_STACK.md` - Verify tech stack
   - `.ai/PHASE_WORKFLOW.md` - Phase completion process

2. **Read phase documentation:**
   - `.ai/phases/phase-XX/PLAN.md` - What to build
   - `.ai/phases/phase-XX/GHERKIN.md` - How to test
   - `.ai/phases/phase-XX/UML.md` - Architecture
   - `.ai/phases/phase-XX/WIREFRAMES.md` - UI design

3. **Follow workflow:**
   - Never start coding before reading all docs
   - Test all GHERKIN scenarios before committing
   - Ensure McCabe complexity ≤ 5 for all functions
   - Update documentation before finishing

**Never start coding without completing steps 1-2 above.**

---

## Archived Attempts

### Kotlin/libGDX (October 2025)
**Location:** `archive/kotlin-libgdx-attempt/`
**Status:** Abandoned - GWT cannot compile Kotlin
**Phases Completed:** 2.7.1 through 2.7.11
**Code Quality:** 100% functions ≤5 McCabe complexity
**Reason for Archive:** Technical impossibility (GWT + Kotlin incompatibility)

---

## Important Notes

- **Phaser is the working solution**
- Performance is good enough for Aurora's needs
- Native performance would be better, but web deployment is essential
- If native is ever needed in the future, consider:
  - React Native + Expo
  - Flutter
  - Compose Multiplatform (Kotlin, but newer multi-platform stack)
  - **NOT** libGDX + Kotlin (web doesn't work)

---

**Remember:** This is for Aurora. It doesn't need to be perfect. It needs to work and help her learn.

---

---

## Core Principles

1. **Plan before code** - Always read phase docs first
2. **Test before commit** - Every GHERKIN scenario must pass
3. **Document before finish** - Update START, MEMORY, README
4. **Quality is mandatory** - McCabe ≤ 5, no exceptions
5. **Aurora-first** - ADHD-friendly design, always
6. **Value every phase** - Each phase delivers working features

---

## Key Files Reference

**Load First:**
- `.ai/CONTEXT_SUMMARY.md` - Quick reference (START HERE each session)

**Planning:**
- `.ai/START.md` - This file (development entry point)
- `.ai/TECHNOLOGY_STACK.md` - Tech stack decisions
- `.ai/plan/PHASES_OVERVIEW.md` - All 37 phases overview

**Workflow:**
- `.ai/PHASE_WORKFLOW.md` - Step-by-step phase completion
- `.ai/ERROR_SOLUTIONS.md` - Common errors and fixes
- `.ai/GUARDRAILS.md` - Code quality rules
- `.ai/PERSONA.md` - Development philosophy

**History:**
- `.ai/MEMORY.md` - Session memory, decisions
- `.ai/RECOMMENDATIONS.md` - AI development recommendations

---

**Last Updated:** October 25, 2025
**Current Technology:** React + Phaser 3 + Node.js + MySQL (Full-Stack)
**Current Phase:** Phase 0 (Completed) → Ready for Phase 1
**Deployment:** 8 Apache vhosts LIVE (staging + production × 4 subdomains)
