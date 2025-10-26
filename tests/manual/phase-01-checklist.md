# Phase 1: Manual Test Checklist

**Test Date:** __________
**Tester:** __________
**Environment:** Local Development

---

## Pre-Test Setup

- [ ] Navigate to project root: `/home/corey/Desktop/ADHDLearn.com`
- [ ] Ensure git is initialized: `git status`

---

## Directory Structure

### Test 1: Root directories exist
- [ ] `.ai/` exists
- [ ] `backend/` exists
- [ ] `child-portal/` exists
- [ ] `parent-portal/` exists
- [ ] `marketing-website/` exists
- [ ] `shared/` exists
- [ ] `tests/` exists
- [ ] `scripts/` exists

### Test 2: Backend structure
- [ ] `backend/src/` exists
- [ ] `backend/src/index.js` exists
- [ ] `backend/package.json` exists
- [ ] `backend/README.md` exists

### Test 3: Child portal structure
- [ ] `child-portal/src/` exists
- [ ] `child-portal/public/` exists
- [ ] `child-portal/package.json` exists
- [ ] `child-portal/vite.config.js` exists
- [ ] `child-portal/README.md` exists

### Test 4: Parent portal structure
- [ ] `parent-portal/src/` exists
- [ ] `parent-portal/public/` exists
- [ ] `parent-portal/package.json` exists
- [ ] `parent-portal/vite.config.js` exists
- [ ] `parent-portal/README.md` exists

---

## Git Configuration

### Test 5: Git initialized
```bash
git status
```
- [ ] Shows "On branch staging"
- [ ] No fatal errors

### Test 6: Gitignore configured
```bash
cat .gitignore
```
- [ ] Contains `node_modules/`
- [ ] Contains `dist/`
- [ ] Contains `build/`
- [ ] Contains `.env`
- [ ] Contains `.env.local`
- [ ] Contains `*.log`
- [ ] Contains `.DS_Store`
- [ ] Contains `coverage/`

---

## npm Workspaces

### Test 7: Workspaces configured
```bash
cat package.json
```
- [ ] `workspaces` field includes `backend`
- [ ] `workspaces` field includes `child-portal`
- [ ] `workspaces` field includes `parent-portal`
- [ ] `workspaces` field includes `shared`

### Test 8: npm scripts exist
- [ ] `dev:backend` script exists
- [ ] `dev:child` script exists
- [ ] `dev:parent` script exists
- [ ] `build:all` script exists
- [ ] `test:all` script exists
- [ ] `lint` script exists
- [ ] `format` script exists

### Test 9: npm install works
```bash
npm install
```
- [ ] No errors during installation
- [ ] `node_modules/` created in root
- [ ] `backend/node_modules/` exists
- [ ] `child-portal/node_modules/` exists
- [ ] `parent-portal/node_modules/` exists

---

## Code Quality

### Test 10: ESLint configured
```bash
cat .eslintrc.json
```
- [ ] Has `complexity` rule set to `["error", 5]`
- [ ] Includes `browser` environment
- [ ] Includes `es2021` environment
- [ ] Includes `node` environment

### Test 11: ESLint passes
```bash
npm run lint
```
- [ ] 0 errors
- [ ] Completes successfully

### Test 12: Prettier configured
```bash
cat .prettierrc || cat .prettierrc.json || grep prettier package.json
```
- [ ] Prettier configuration exists

### Test 13: Prettier runs
```bash
npm run format
```
- [ ] No errors
- [ ] Formats files successfully

---

## Documentation

### Test 14: README files exist
- [ ] Root `README.md` exists
- [ ] `backend/README.md` exists
- [ ] `child-portal/README.md` exists
- [ ] `parent-portal/README.md` exists
- [ ] `marketing-website/README.md` exists
- [ ] `shared/README.md` exists
- [ ] `tests/README.md` exists

### Test 15: Root README content
```bash
cat README.md
```
- [ ] Explains project overview
- [ ] Documents directory structure
- [ ] Provides setup instructions
- [ ] Describes development workflow

---

## Final Verification

### Acceptance Criteria
- [ ] All directories created with README files
- [ ] Git repository initialized
- [ ] npm workspaces configured and working
- [ ] ESLint passes with McCabe ≤ 5 rule
- [ ] Prettier configured
- [ ] Can run `npm install` from root (installs all workspaces)
- [ ] README.md documents project structure

---

## Test Results

**PASS:** _____ / 15 tests
**Status:** [ ] PASSED  [ ] FAILED

**Notes:**
_______________________________________________________________
_______________________________________________________________
_______________________________________________________________

**Tester Signature:** _______________  **Date:** ___________
