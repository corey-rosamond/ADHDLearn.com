# START HERE - AI Development Entry Point

## Current Status
**Current Phase:** Phase 6 - Family Management
**Last Updated:** October 26, 2025
**Recent Work:** Phase 5 Complete - Parent Dashboard fully deployed and tested

---

## MANDATORY: Read These Files FIRST

Before doing ANYTHING, you MUST read these files in order:

### 1. Development Philosophy & Rules
```
.ai/PERSONA.md              # Who you are, how you work
.ai/GUARDRAILS.md           # Code quality rules (McCabe ≤ 5, etc.)
.ai/MEMORY.md               # Recent decisions and context
.ai/RECOMMENDATIONS.md      # AI development best practices
```

### 2. Reference Documentation
```
.ai/TECHNOLOGY_STACK.md     # Tech stack reference
.ai/ASSET_LIBRARY.md        # Available assets for games
.ai/SERVER_CREDENTIALS.md   # Deployment credentials
```

### 3. Current Phase Documentation
```
.ai/phases/phase-06/PLAN.md        # What to build
.ai/phases/phase-06/GHERKIN.md     # How to test (acceptance criteria)
.ai/phases/phase-06/UML.md         # Architecture diagrams
.ai/phases/phase-06/WIREFRAMES.md  # UI/UX designs (if applicable)
```

### 4. Supporting Documentation (as needed)
```
.ai/PHASE_WORKFLOW.md       # Phase completion checklist
.ai/ERROR_SOLUTIONS.md      # Common issues & fixes
```

---

## Phase Completion Status

**Completed:**
- ✅ Phase 0: Server Infrastructure (8 Apache vhosts, SSL)
- ✅ Phase 1: Project Foundation (monorepo, npm workspaces, ESLint) - 13/13 tests ✅
- ✅ Phase 2: Letter Pop Standalone (React + Vite + Phaser) - 15/15 tests ✅
- ✅ Phase 3: Database + Backend (MySQL 8.0, Express API, PM2) - 20/20 tests ✅
- ✅ Phase 4: Parent Auth (bcrypt, JWT, React Router, protected routes) - 36/36 tests ✅
- ✅ Phase 5: Parent Dashboard - 100% PLAN.md Coverage ✅
  - View children with last active time
  - Session history with stats (score, accuracy, time)
  - Confusion pairs analysis (B↔D: 67%, P↔Q: 17%, M↔N: 17%)
  - Streak calculations (current & longest)
  - Session details modal
  - Game-specific analytics page
  - All components separated per PLAN.md
  - Deployed: https://parent-staging.adhdlearn.com
  - API: https://api.adhdlearn.com

**Next:**
- 🔜 Phase 6: Family Management (Add/Edit Children)

---

## Quick Reference

**Server:** 160.153.180.159 (Ubuntu 24.04.2 LTS)
**Technology:** React 19 + Vite + Phaser 3.90 + Node.js + MySQL
**Branch:** staging

**Live Domains (8):**
- Production: adhdlearn.com, child.adhdlearn.com, parent.adhdlearn.com, api.adhdlearn.com
- Staging: staging.adhdlearn.com, child-staging.adhdlearn.com, parent-staging.adhdlearn.com, api-staging.adhdlearn.com

---

## Core Rules

1. **NEVER start coding without reading PERSONA.md + GUARDRAILS.md**
2. **NEVER start a phase without reading all 4 phase documents**
3. **ALWAYS test GHERKIN scenarios before committing**
4. **ALWAYS maintain McCabe complexity ≤ 5**
5. **ALWAYS update MEMORY.md with decisions**

---

**Remember:** This is for Aurora. Focus on working features, not perfection.
