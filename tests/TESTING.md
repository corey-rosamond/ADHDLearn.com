# ADHDLearn.com Testing Documentation

**Last Updated:** October 26, 2025

---

## Testing Strategy

ADHDLearn.com uses a **hybrid testing approach**:

1. **GHERKIN Scenarios** - Define what to test (acceptance criteria)
2. **Manual Testing** - Structured checklists for each phase
3. **Automated Testing** - Node.js scripts to verify acceptance criteria

---

## Testing Structure

```
tests/
├── TESTING.md                    # This file
├── README.md                     # Overview
├── run-phase-tests.sh            # Automated test runner
├── manual/                       # Manual test checklists
│   ├── phase-01-checklist.md
│   ├── phase-02-checklist.md
│   ├── phase-03-checklist.md
│   └── phase-04-checklist.md
├── automated/                    # Automated test scripts
│   ├── phase-01.test.mjs
│   ├── phase-02.test.mjs
│   ├── phase-03.test.mjs
│   └── phase-04.test.mjs
└── playwright/                   # E2E tests (Phase 34+)
```

---

## Running Tests

### Run All Automated Tests

```bash
cd /home/corey/Desktop/ADHDLearn.com
./tests/run-phase-tests.sh
```

### Run Single Phase Test

```bash
node tests/automated/phase-01.test.mjs
node tests/automated/phase-02.test.mjs
node tests/automated/phase-03.test.mjs
node tests/automated/phase-04.test.mjs
```

### Manual Testing

```bash
# Print checklist for a phase
cat tests/manual/phase-01-checklist.md

# Or open in your editor to fill out
code tests/manual/phase-01-checklist.md
```

---

## Testing Workflow

### For Each Phase:

1. **Development**
   - Write code according to PLAN.md
   - Keep GHERKIN.md scenarios in mind

2. **Code Complete**
   - Run automated tests: `node tests/automated/phase-XX.test.mjs`
   - Fix any failures

3. **Manual Verification**
   - Open `tests/manual/phase-XX-checklist.md`
   - Check off each item
   - Test on actual devices if applicable

4. **Sign Off**
   - All automated tests pass ✅
   - All manual checklist items checked ✅
   - All GHERKIN scenarios verified ✅
   - Phase is complete!

---

## Phase Test Coverage

### Phase 1: Project Foundation
- ✅ **Automated:** Directory structure, git, npm workspaces, ESLint
- ✅ **Manual:** README content, workspace functionality

### Phase 2: Letter Pop Deployment
- ⏳ **Automated:** Build process, React/Vite/Phaser integration
- ⏳ **Manual:** Game playability, tablet testing, performance

### Phase 3: Database + Backend
- ⏳ **Automated:** Database tables, API endpoints, score persistence
- ⏳ **Manual:** End-to-end score saving, high scores display

### Phase 4: Parent Authentication
- ⏳ **Automated:** API endpoints, JWT tokens, database records
- ⏳ **Manual:** Registration flow, login flow, protected routes

---

## Writing New Tests

### Automated Test Template

```javascript
#!/usr/bin/env node
import { existsSync, readFileSync } from 'fs';
import { resolve } from 'path';

const PROJECT_ROOT = resolve(process.cwd());
let passed = 0, failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`✅ ${name}`);
    passed++;
  } catch (error) {
    console.log(`❌ ${name}: ${error.message}`);
    failed++;
  }
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

// Your tests here
test('Example test', () => {
  assert(true === true, 'Math is broken');
});

// Summary
console.log(`\n✅ Passed: ${passed}  ❌ Failed: ${failed}`);
process.exit(failed > 0 ? 1 : 0);
```

### Manual Checklist Template

```markdown
# Phase X: Manual Test Checklist

**Test Date:** __________
**Tester:** __________

## Test 1: Feature Name
- [ ] Step 1
- [ ] Step 2
- [ ] Expected result verified

## Test Results
**PASS:** _____ / _____ tests
**Status:** [ ] PASSED  [ ] FAILED
```

---

## Test Categories

### Unit Tests
- Individual functions
- McCabe complexity ≤ 5
- Pure logic testing

### Integration Tests
- API endpoints
- Database operations
- Frontend + Backend communication

### E2E Tests (Phase 34+)
- Full user journeys
- Playwright automation
- Cross-browser testing

### Manual Tests
- Visual design
- User experience
- Device-specific features
- Performance

---

## Continuous Integration

Currently: **Manual CI** (run tests before commit)

Future (Phase 34+):
- GitHub Actions for automated testing
- Pre-commit hooks
- Deployment gates

---

## Testing Best Practices

### Do's ✅
- Run tests before every commit
- Update tests when requirements change
- Test on target devices (Aurora's tablet)
- Document test failures

### Don'ts ❌
- Don't skip tests "just this once"
- Don't commit failing tests
- Don't test in production first
- Don't ignore manual testing

---

## Troubleshooting

### Tests fail locally
```bash
# Make sure you're in project root
cd /home/corey/Desktop/ADHDLearn.com

# Install dependencies
npm install

# Check Node version (need 18+)
node --version

# Try running single test for details
node tests/automated/phase-01.test.mjs
```

### Permission denied
```bash
chmod +x tests/run-phase-tests.sh
chmod +x tests/automated/*.mjs
```

### Module not found
```bash
# Tests use ES modules (.mjs)
# Make sure Node.js 18+ is installed
```

---

## Test Results Archive

Test results should be documented in commits:

```
Complete Phase X: [Feature Name]

Test Results:
- Automated tests: PASSED (15/15)
- Manual checklist: PASSED (12/12)
- GHERKIN scenarios: ALL VERIFIED
```

---

## Questions?

See `.ai/PHASE_WORKFLOW.md` for the complete phase completion process.

---

**Created:** October 26, 2025
**Purpose:** Comprehensive testing documentation for ADHDLearn.com
