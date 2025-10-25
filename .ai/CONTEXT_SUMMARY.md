# Context Summary - Quick Reference

**Load this file first in every session**

---

## Project Identity

**Name:** ADHDLearn.com
**Purpose:** Family learning platform for children with ADHD
**Primary User:** Aurora (age 4-10)
**Parent:** Corey (developer)
**Target Device:** Samsung Galaxy Tab S7 FE (2560x1600)

---

## Current Status

**Phase:** 0 (Not started)
**Last Completed:** None (project setup phase)
**Branch:** staging
**Deployment:** Planning complete, implementation pending

**Planning Status:**
- ✅ All 37 phases (00-36) fully documented
- ✅ Each phase has PLAN.md, GHERKIN.md, UML.md, WIREFRAMES.md
- ✅ Technology stack finalized (Phaser + React + Node.js + MySQL)
- 🔄 Ready to begin Phase 0 (Server Infrastructure)

---

## Technology Stack (Quick Reference)

- **Frontend Child Portal:** React + Vite, Phaser 3 (games)
- **Frontend Parent Portal:** React + Vite, Tailwind CSS
- **Backend API:** Node.js + Express
- **Database:** MySQL 8.0 (160.153.180.159)
- **Deployment:** Apache, Let's Encrypt SSL
- **Android:** Capacitor wrapper
- **Real-time:** Socket.io
- **Process Manager:** PM2

**See `.ai/TECHNOLOGY_STACK.md` for complete details**

---

## Critical Locations

```
/home/corey/Desktop/ADHDLearn.com/  # Project root
├── .ai/                             # All planning docs
│   ├── phases/phase-XX/            # Phase-specific docs
│   │   ├── PLAN.md                 # Implementation plan
│   │   ├── GHERKIN.md              # BDD acceptance criteria
│   │   ├── UML.md                  # Architecture diagrams
│   │   └── WIREFRAMES.md           # UI/UX designs
│   ├── plan/                        # Master planning docs
│   │   ├── PHASES_OVERVIEW.md      # All 37 phases overview
│   │   ├── PLAN.md                 # Master plan
│   │   ├── UML.md                  # System architecture
│   │   └── WIREFRAMES.md           # Design system
│   ├── START.md                     # Entry point
│   ├── GUARDRAILS.md                # Code quality rules
│   ├── PERSONA.md                   # Developer identity
│   ├── MEMORY.md                    # Session memory
│   ├── TECHNOLOGY_STACK.md          # Tech decisions
│   ├── CONTEXT_SUMMARY.md           # This file
│   ├── PHASE_WORKFLOW.md            # Phase completion guide
│   ├── ERROR_SOLUTIONS.md           # Common errors
│   └── RECOMMENDATIONS.md           # AI development tips
├── backend/                         # Node.js API (to be created)
├── src/                             # Child portal (existing Phaser)
├── parent-portal/                   # Parent dashboard (to be created)
├── marketing/                       # adhdlearn.com (to be created)
├── android/                         # Capacitor wrapper (exists)
└── assets/                          # Audio, images, fonts (exists)
```

---

## Essential Commands

### Development
```bash
# Start HTTPS development server (required for audio)
python3 https-server.py

# Access game (accept self-signed cert)
https://localhost:8000

# Start backend (once created)
cd backend && npm run dev

# Start parent portal (once created)
cd parent-portal && npm run dev
```

### Testing
```bash
# Run linter
npm run lint

# Format code
npm run format

# Check McCabe complexity
npm install -g complexity-report
cr src/ --format json
```

### Android Device
```bash
# ADB commands
export ANDROID_HOME=/home/corey/android-sdk
$ANDROID_HOME/platform-tools/adb devices
$ANDROID_HOME/platform-tools/adb shell input swipe X Y X Y 100
$ANDROID_HOME/platform-tools/adb shell screencap -p /sdcard/screen.png
$ANDROID_HOME/platform-tools/adb pull /sdcard/screen.png test/screenshots/
```

### Database
```bash
# Connect to MySQL
mysql -h 160.153.180.159 -u [user] -p adhdlearn

# Run migration
mysql -h 160.153.180.159 -u [user] -p adhdlearn < backend/migrations/phase-XX.sql
```

### Git Workflow
```bash
# Check status
git status

# Stage all changes
git add .

# Commit with detailed message
git commit -m "Complete Phase X: [Name]

- Implemented [feature 1]
- Implemented [feature 2]
- All acceptance criteria met
- Manual testing completed
- McCabe complexity ≤ 5

🤖 Generated with Claude Code

Co-Authored-By: Claude <noreply@anthropic.com>"

# Push to staging
git push origin staging

# After testing on staging, merge to main
git checkout main
git merge staging
git push origin main
```

---

## 4 Subdomains

**Production:**
1. **adhdlearn.com** - Marketing website (static HTML)
2. **child.adhdlearn.com** - Child portal (React + Phaser games)
3. **parent.adhdlearn.com** - Parent dashboard (React)
4. **api.adhdlearn.com** - Backend API (Node.js + Express)

**Staging (same structure):**
- staging.adhdlearn.com
- staging.child.adhdlearn.com
- staging.parent.adhdlearn.com
- staging.api.adhdlearn.com

**Total:** 8 Apache virtual hosts

---

## Core Principles

1. **Plan before code** - Always read phase docs first
2. **Test before commit** - Every GHERKIN scenario must pass
3. **Document before finish** - Update START, MEMORY, README
4. **Quality is mandatory** - McCabe ≤ 5, no exceptions
5. **Aurora-first** - ADHD-friendly design, always
6. **Value every phase** - Each phase delivers working features

---

## Non-Negotiables

- ❌ NO development without reading PLAN.md + GHERKIN.md + UML.md first
- ❌ NO commits with McCabe complexity > 5
- ❌ NO phase completion without passing all acceptance criteria
- ❌ NO shortcuts on code quality
- ❌ NO Kotlin/libGDX/Java (web incompatible, abandoned October 2025)

---

## ADHD-Friendly Design Rules

**Every UI element must be:**
- **Immediate feedback:** < 50ms response time
- **High contrast:** WCAG AAA contrast ratios
- **Large touch targets:** ≥ 44×44px minimum
- **Non-punitive:** Encouraging messages, never "wrong" or "failure"
- **Clear progress:** Always show where they are and what's next
- **Minimal distractions:** Clean UI, focused content
- **Predictable:** Consistent layouts and interactions

**Color System (from WIREFRAMES):**
- Primary: Bright, saturated colors
- Reading: Blue (#3B82F6)
- Math: Green (#10B981)
- Science: Purple (#8B5CF6)
- Life Skills: Orange (#F59E0B)
- Success: Green (#10B981)
- Warning: Yellow (#F59E0B)
- Error: Red (#EF4444) - use sparingly

---

## 37 Phases Overview

**Phase 0:** Server Infrastructure (Apache, SSL, deployment)
**Phase 1:** Project Foundation (directory structure, git)
**Phase 2:** Deploy existing Letter Pop game
**Phase 3:** Database + Basic Backend (scores persist)
**Phase 4:** Parent Registration + Login
**Phase 5:** Parent Dashboard - View Aurora's Scores
**Phase 6:** Family Management
**Phase 7:** Child Login with PIN
**Phase 8:** Child Dashboard with Categories
**Phase 9-10:** Add Word Builder + Sight Words games
**Phase 11-13:** Math Category (Counting, Shapes, Addition)
**Phase 14-16:** Chore System (backend, parent, child)
**Phase 17-18:** Progress Charts + Confusion Matrix
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

**See `.ai/plan/PHASES_OVERVIEW.md` for detailed phase descriptions**

---

## Phase Workflow (Quick)

**For each phase:**
1. Read `.ai/phases/phase-XX/PLAN.md`
2. Read `.ai/phases/phase-XX/GHERKIN.md`
3. Read `.ai/phases/phase-XX/UML.md`
4. Read `.ai/phases/phase-XX/WIREFRAMES.md`
5. Implement according to plan
6. Test all acceptance criteria
7. Check McCabe complexity ≤ 5
8. Update documentation (START, MEMORY, README)
9. Commit and push to staging
10. Deploy to staging, test again
11. Mark phase complete

**See `.ai/PHASE_WORKFLOW.md` for complete step-by-step guide**

---

## When Stuck

1. Read `.ai/GUARDRAILS.md` for code patterns
2. Read `.ai/PERSONA.md` for development philosophy
3. Read `.ai/MEMORY.md` for recent solutions
4. Read `.ai/ERROR_SOLUTIONS.md` for common errors
5. Read phase PLAN.md again
6. Ask user for clarification

---

## Key Files to Know

**Planning:**
- `.ai/START.md` - Development entry point
- `.ai/TECHNOLOGY_STACK.md` - Tech stack reference
- `.ai/CONTEXT_SUMMARY.md` - This file (load first)
- `.ai/plan/PHASES_OVERVIEW.md` - All phases overview

**Quality:**
- `.ai/GUARDRAILS.md` - Code quality rules
- `.ai/PERSONA.md` - Development philosophy
- `.ai/ERROR_SOLUTIONS.md` - Troubleshooting

**History:**
- `.ai/MEMORY.md` - Session memory, key decisions
- `.ai/RECOMMENDATIONS.md` - AI development recommendations

**Phase Docs (37 phases):**
- `.ai/phases/phase-XX/PLAN.md` - What to build
- `.ai/phases/phase-XX/GHERKIN.md` - How to test
- `.ai/phases/phase-XX/UML.md` - Architecture
- `.ai/phases/phase-XX/WIREFRAMES.md` - UI design

---

## Current Working Directory

```bash
/home/corey/Desktop/ADHDLearn.com/
```

**Always verify:** `pwd` before running commands

---

## Database Credentials

**Host:** 160.153.180.159
**Database:** adhdlearn
**User:** [Ask user for credentials]
**Port:** 3306 (MySQL default)

**Never commit credentials to git**

---

## Important Context

### Why Phaser?
- Previous Kotlin/libGDX attempt failed (GWT can't compile Kotlin)
- Phaser works for web (critical requirement)
- Capacitor wraps for Android
- Performance acceptable for Aurora's needs

### Why 37 Phases?
- Value-driven development
- Each phase delivers working features
- Aurora gets value starting Phase 2
- Incremental deployment reduces risk

### Why MySQL?
- Familiar, reliable, well-supported
- Good performance for this scale
- Easy to manage and backup
- Strong Node.js driver (mysql2)

---

## Success Metrics

**Phase completion requires:**
- ✅ All acceptance criteria from GHERKIN.md pass
- ✅ All code committed to git
- ✅ McCabe complexity ≤ 5 for all functions
- ✅ Documentation updated (START, MEMORY, README)
- ✅ Deployed to staging and tested
- ✅ No console errors or warnings
- ✅ User-facing features work on actual device

---

**This is for Aurora. Make it work. Make it right. Make it excellent.**

---

**Created:** October 25, 2025
**Last Updated:** October 25, 2025
**Maintained By:** Corey (developer)
**Purpose:** Quick reference for AI context loading
