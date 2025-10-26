# START HERE - AI Development Entry Point

## Current Status
**Current Phase:** Phase 4 (Completed) → Ready for Phase 5
**Last Updated:** October 26, 2025
**Recent Work:** GHERKIN alignment + Testing framework (84/84 tests passing)

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
.ai/phases/phase-05/PLAN.md        # What to build
.ai/phases/phase-05/GHERKIN.md     # How to test (acceptance criteria)
.ai/phases/phase-05/UML.md         # Architecture diagrams
.ai/phases/phase-05/WIREFRAMES.md  # UI/UX designs (if applicable)
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

**Testing Infrastructure:**
- ✅ GHERKIN scenarios aligned with PLAN.md for all phases
- ✅ Automated test suite (tests/automated/phase-*.test.mjs)
- ✅ Manual test checklists (tests/manual/)
- ✅ Master test runner (tests/run-phase-tests.sh)
- ✅ All 84/84 tests passing

**Next:**
- 🔜 Phase 5: TBD (check phase-05 documentation)

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
