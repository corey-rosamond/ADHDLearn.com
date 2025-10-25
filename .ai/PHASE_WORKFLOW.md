# Phase Workflow - Complete Process

**Purpose:** Detailed workflow for AI to complete any phase from start to finish

**Last Updated:** October 25, 2025

---

## Pre-Phase Checklist

Before starting a phase, verify:

- [ ] PLAN.md exists in `.ai/phases/phase-XX/`
- [ ] GHERKIN.md exists with acceptance criteria
- [ ] UML.md exists with architecture diagrams
- [ ] WIREFRAMES.md exists (if UI changes)
- [ ] Previous phase is 100% complete (or Phase 0 if first phase)
- [ ] Git working directory is clean (no uncommitted changes)
- [ ] Current branch is `staging`

---

## Phase Workflow

### Step 1: Read Phase Documentation (15-30 minutes)

**Critical:** Do not skip this step. Read everything before writing any code.

1. Read `.ai/phases/phase-XX/PLAN.md` completely
   - Note all files to create/modify
   - Note all database changes
   - Note all API endpoints
   - Note all dependencies
2. Read `.ai/phases/phase-XX/GHERKIN.md` completely
   - List all acceptance criteria
   - Understand all test scenarios
   - Note all Given/When/Then conditions
3. Read `.ai/phases/phase-XX/UML.md` completely
   - Understand system architecture
   - Note all components and interactions
   - Review database schema changes
4. Read `.ai/phases/phase-XX/WIREFRAMES.md` (if exists)
   - Review UI mockups
   - Note color schemes
   - Note component hierarchy
   - Note responsive behavior

**Output:** Create mental/written checklist of everything to build

---

### Step 2: Verify Prerequisites

**Before writing any code:**

1. **Check current working directory:**

   ```bash
   pwd  # Should be /home/corey/Desktop/ADHDLearn.com
   ```

2. **If backend phase, verify database connection:**

   ```bash
   mysql -h 160.153.180.159 -u [user] -p
   ```

   - Test connection works
   - Verify database `adhdlearn` exists
   - Check user has proper permissions

3. **Verify Node.js version:**

   ```bash
   node --version  # Should be 18+
   npm --version   # Should be 9+
   ```

4. **Check git status:**

   ```bash
   git status
   git branch  # Should show staging
   ```

5. **Install dependencies if needed:**
   ```bash
   npm install  # In project root
   ```

---

### Step 3: Create Database Changes (if applicable)

**Only for phases with database changes**

1. **Create migration file:**
   - Path: `backend/migrations/phase-XX-description.sql`
   - Format: `phase-03-sessions-table.sql`

2. **Migration file must include:**

   ```sql
   -- Phase X: [Description]
   -- Created: [Date]

   -- Create tables
   CREATE TABLE IF NOT EXISTS table_name (
     id INT PRIMARY KEY AUTO_INCREMENT,
     field VARCHAR(255) NOT NULL,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

   -- Create indexes
   CREATE INDEX idx_field ON table_name(field);

   -- Sample data (if needed for testing)
   INSERT INTO table_name (field) VALUES ('test');
   ```

3. **Document rollback SQL (in comments):**

   ```sql
   -- ROLLBACK:
   -- DROP TABLE IF EXISTS table_name;
   ```

4. **Execute migration:**

   ```bash
   mysql -h 160.153.180.159 -u [user] -p adhdlearn < backend/migrations/phase-XX-description.sql
   ```

5. **Verify tables created:**
   ```sql
   SHOW TABLES;
   DESCRIBE table_name;
   SELECT * FROM table_name;  -- Test sample data
   ```

---

### Step 4: Implement Backend (if applicable)

**Only for phases with API endpoints**

1. **Create route file:**
   - Path: `backend/routes/[feature].js`
   - Example: `backend/routes/sessions.js`

2. **Follow REST conventions:**
   - `GET /api/resource` - List/retrieve
   - `GET /api/resource/:id` - Get single item
   - `POST /api/resource` - Create
   - `PUT /api/resource/:id` - Update
   - `DELETE /api/resource/:id` - Delete

3. **Each endpoint must:**
   - Validate all inputs (express-validator)
   - Use parameterized queries (prevent SQL injection)
   - Handle errors properly
   - Return consistent JSON format
   - Log important events

4. **Response format (MUST follow this):**

   ```javascript
   // Success
   res.json({
     success: true,
     data: {
       /* actual data */
     },
     message: 'Optional success message',
   });

   // Error
   res.status(400).json({
     success: false,
     error: 'User-friendly error message',
     details: 'Optional technical details',
   });
   ```

5. **Register routes in main app:**

   ```javascript
   // backend/server.js or backend/app.js
   const featureRoutes = require('./routes/feature');
   app.use('/api/feature', featureRoutes);
   ```

6. **Test each endpoint manually:**

   ```bash
   # GET request
   curl -X GET https://api.adhdlearn.com/api/resource

   # POST request
   curl -X POST https://api.adhdlearn.com/api/resource \
     -H "Content-Type: application/json" \
     -d '{"field": "value"}'

   # Authenticated request
   curl -X GET https://api.adhdlearn.com/api/resource \
     -H "Authorization: Bearer [token]"
   ```

---

### Step 5: Implement Frontend (if applicable)

**For React components (parent/child portals)**

1. **Create component files according to PLAN.md:**
   - Path: `src/components/[ComponentName].jsx`
   - Example: `src/components/Dashboard.jsx`

2. **Follow React best practices:**

   ```javascript
   import React, { useState, useEffect } from 'react';

   function ComponentName({ prop1, prop2 }) {
     const [state, setState] = useState(initialValue);

     useEffect(() => {
       // Side effects
       return () => {
         // Cleanup
       };
     }, [dependencies]);

     return <div className="tailwind-classes">{/* Component JSX */}</div>;
   }

   export default ComponentName;
   ```

3. **Styling with Tailwind CSS:**
   - Use utility classes
   - Follow WIREFRAMES.md color scheme
   - Ensure ADHD-friendly design:
     - Large touch targets (min 44×44px)
     - High contrast colors
     - Clear visual hierarchy
     - Immediate feedback

4. **Implement UI according to WIREFRAMES.md:**
   - Match layout exactly
   - Use specified colors
   - Follow responsive breakpoints
   - Test on target device (Galaxy Tab S7 FE)

5. **API integration:**
   ```javascript
   const fetchData = async () => {
     try {
       const response = await fetch('https://api.adhdlearn.com/api/resource', {
         method: 'GET',
         headers: {
           'Content-Type': 'application/json',
           Authorization: `Bearer ${token}`,
         },
       });
       const data = await response.json();
       if (data.success) {
         setState(data.data);
       } else {
         console.error(data.error);
       }
     } catch (error) {
       console.error('Network error:', error);
     }
   };
   ```

---

### Step 6: Implement Game Logic (if Phaser game)

**For new games or game modifications**

1. **Create scene files:**
   - Path: `src/games/[category]/[game]/scenes/`
   - Example: `src/games/reading/word-builder/scenes/GameScene.js`

2. **Follow Phaser 3 best practices:**

   ```javascript
   class GameScene extends Phaser.Scene {
     constructor() {
       super({ key: 'GameScene' });
     }

     preload() {
       // Load assets (images, audio, etc.)
       this.load.image('key', 'path/to/image.png');
     }

     create() {
       // Set up game objects
       // Use this.add.* for game objects
       // Use this.tweens.add for animations
     }

     update(time, delta) {
       // Game loop (use sparingly, prefer tweens)
     }

     shutdown() {
       // Clean up (remove listeners, stop sounds)
     }
   }
   ```

3. **Performance considerations:**
   - Preload ALL assets in PreloadScene
   - Use containers for complex objects
   - Use tweens for animations (NOT manual update)
   - Limit physics bodies
   - Pool objects that spawn frequently
   - Clean up in shutdown() method

4. **Audio management:**

   ```javascript
   // Use AudioManager service
   import AudioManager from '../../../services/AudioManager';

   // Play sound
   AudioManager.playSound('pop');

   // Play letter audio
   AudioManager.playLetter('A');
   ```

5. **Score tracking:**

   ```javascript
   // Send score to backend
   const saveScore = async score => {
     await fetch('https://api.adhdlearn.com/api/sessions', {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({
         game_id: 1,
         score: score,
         duration: timeSpent,
       }),
     });
   };
   ```

6. **Test on actual device:**
   - Build and deploy to Android via Capacitor
   - Test on Galaxy Tab S7 FE
   - Verify touch works correctly
   - Check FPS (should be stable 60)
   - Verify audio latency < 100ms

---

### Step 7: Manual Testing (CRITICAL)

**Do not skip this step. Phase is not complete without testing.**

1. **Create test checklist from GHERKIN.md:**
   - List every scenario
   - List every Given/When/Then
   - Create checkboxes

2. **Test every acceptance criterion:**
   - Execute each test scenario exactly as written
   - Test happy path (expected behavior)
   - Test error cases (invalid input, network errors)
   - Test edge cases (empty data, max limits)

3. **Test on actual device (not just browser):**
   - For child portal: Test on Galaxy Tab S7 FE
   - For parent portal: Test on desktop and tablet
   - Verify touch interactions
   - Verify performance

4. **Document results:**
   - Create file: `test/results/phase-XX-results.md`
   - List each test and result (PASS/FAIL)
   - Include screenshots for UI changes
   - Note any issues found and fixed

5. **Take screenshots:**

   ```bash
   # Android device
   $ANDROID_HOME/platform-tools/adb shell screencap -p /sdcard/screen.png
   $ANDROID_HOME/platform-tools/adb pull /sdcard/screen.png test/screenshots/phase-XX-feature.png
   ```

6. **Check browser console:**
   - No errors (red messages)
   - No warnings (yellow messages) unless unavoidable
   - Verify network requests succeed

**Do not proceed until all tests pass**

---

### Step 8: Code Quality Check

**Mandatory before committing**

1. **Run ESLint:**

   ```bash
   npm run lint
   ```

   - Fix ALL errors
   - Fix all warnings (or document why ignored)

2. **Run Prettier:**

   ```bash
   npm run format
   ```

   - Formats all code consistently

3. **Check McCabe complexity (≤ 5 for ALL functions):**

   ```bash
   # Install if not already installed
   npm install -g complexity-report

   # Check complexity
   cr src/ --format json > .ai/reports/mccabe-phase-XX.json

   # Review output
   cat .ai/reports/mccabe-phase-XX.json | grep -A5 cyclomatic
   ```

4. **If any function > 5 complexity:**
   - Refactor immediately
   - Extract helper functions
   - Use early returns
   - Simplify conditionals
   - Re-run analysis until all ≤ 5

5. **Code review checklist:**
   - [ ] No hardcoded credentials
   - [ ] No console.log in production code (use logger)
   - [ ] No commented-out code
   - [ ] All TODO comments tracked
   - [ ] Consistent naming conventions
   - [ ] Proper error handling

---

### Step 9: Documentation Updates

**Update before committing**

1. **Update START.md:**

   ```markdown
   **Last Updated:** [Today's date]
   **Current Phase:** Phase X Complete
   **Next Phase:** Phase X+1

   ## What's Working

   - ✅ Feature from Phase X
   - ✅ ... (add new features)
   ```

2. **Update MEMORY.md:**

   ```markdown
   **Last Updated:** [Today's date]
   **Current Status:** Phase X Complete - Ready for Phase X+1

   ## Recent Changes

   - Phase X: [Description] - [Date] - ✅ Complete

   ## Critical Commands Used

   - [Any new commands discovered]

   ## Issues Encountered

   - [Problem]: [Solution]
   ```

3. **Update README.md:**
   - Add new features to feature list
   - Update installation steps if changed
   - Update screenshots if UI changed

4. **Update package.json version (if applicable):**
   ```json
   {
     "version": "0.X.0"
   }
   ```

---

### Step 10: Git Commit

**Commit with detailed message**

1. **Review all changes:**

   ```bash
   git status
   git diff
   ```

2. **Stage changes:**

   ```bash
   git add .
   ```

3. **Verify what's staged:**

   ```bash
   git status
   ```

4. **Commit with structured message:**

   ```bash
   git commit -m "Complete Phase X: [Phase Name]

   ## What Changed
   - Implemented [feature 1]
   - Implemented [feature 2]
   - Implemented [feature 3]

   ## Database Changes
   - Created [table_name] table
   - Added [columns] to [table]

   ## API Endpoints
   - POST /api/[resource] - [description]
   - GET /api/[resource] - [description]

   ## Frontend Changes
   - Created [ComponentName] component
   - Updated [ExistingComponent] to [change]

   ## Testing
   - ✅ All acceptance criteria met
   - ✅ Manual testing completed
   - ✅ Tested on Galaxy Tab S7 FE

   ## Quality
   - ✅ McCabe complexity ≤ 5 (all functions)
   - ✅ ESLint passing
   - ✅ Prettier formatted

   Ready for Phase X+1

   🤖 Generated with Claude Code

   Co-Authored-By: Claude <noreply@anthropic.com>"
   ```

5. **Push to staging:**
   ```bash
   git push origin staging
   ```

---

### Step 11: Deployment to Staging

**Deploy and test on staging environment**

1. **SSH to server:**

   ```bash
   ssh corey@160.153.180.159
   ```

2. **Navigate to staging directory:**

   ```bash
   # For child portal
   cd /var/www/child.adhdlearn.com/staging

   # For parent portal
   cd /var/www/parent.adhdlearn.com/staging

   # For API
   cd /var/www/api.adhdlearn.com/staging
   ```

3. **Pull latest changes:**

   ```bash
   git pull origin staging
   ```

4. **Install dependencies if needed:**

   ```bash
   npm install
   ```

5. **Build frontend if needed:**

   ```bash
   npm run build
   ```

6. **Restart backend if needed:**

   ```bash
   pm2 restart api-staging
   pm2 logs api-staging  # Check logs
   ```

7. **Test on staging domain:**

   ```bash
   # Test API
   curl https://staging.api.adhdlearn.com/api/health

   # Test frontend (in browser)
   # https://staging.child.adhdlearn.com
   # https://staging.parent.adhdlearn.com
   ```

---

### Step 12: Final Verification

**Test everything again on staging**

1. **Test on staging domain:**
   - Open https://staging.child.adhdlearn.com
   - Open https://staging.parent.adhdlearn.com
   - Test all features from this phase

2. **Verify all acceptance criteria still pass:**
   - Re-run GHERKIN test scenarios
   - Check on staging environment

3. **Check browser console for errors:**
   - Open DevTools
   - Verify no errors in console
   - Check Network tab for failed requests

4. **Test on actual device if possible:**
   - Deploy APK to Galaxy Tab S7 FE (if child portal changes)
   - Test actual usage

5. **Confirm with user if needed:**
   - Ask user to review if major UI changes
   - Get approval before merging to production

---

### Step 13: Mark Phase Complete

**Only after all above steps complete**

1. **Update MEMORY.md with completion:**

   ```markdown
   **Last Updated:** [Date]
   **Current Status:** Phase X Complete - Ready for Phase X+1

   ## Completed Phases

   - Phase X: [Name] - [Date] - ✅ All tests passed, deployed to staging
   ```

2. **Update START.md:**

   ```markdown
   **Last Updated:** [Date]
   **Current Phase:** Phase X+1 (ready to begin)
   **Last Completed:** Phase X
   ```

3. **Create phase completion summary:**

   ```markdown
   # Phase X Completion Summary

   **Completed:** [Date]
   **Duration:** [X hours/days]

   ## Deliverables

   - ✅ [Feature 1]
   - ✅ [Feature 2]

   ## Testing Results

   - ✅ All GHERKIN scenarios passed
   - ✅ McCabe complexity ≤ 5
   - ✅ Deployed to staging
   - ✅ Tested on device

   ## Known Issues

   - None (or list any minor issues to fix later)

   ## Next Phase

   Phase X+1: [Name]
   ```

4. **Notify user:**

   ```
   Phase X is complete! 🎉

   ✅ All acceptance criteria met
   ✅ Manual testing completed
   ✅ Code committed and pushed
   ✅ Deployed to staging: https://staging.[subdomain].adhdlearn.com
   ✅ McCabe complexity ≤ 5

   Ready to begin Phase X+1 when you are.
   ```

---

## Common Pitfalls

### ❌ Starting without reading docs

**Problem:** Coding before understanding requirements
**Fix:** Always read PLAN, GHERKIN, UML, WIREFRAMES first

### ❌ Skipping manual testing

**Problem:** Committing broken code
**Fix:** Test every scenario in GHERKIN.md before committing

### ❌ Committing with complexity > 5

**Problem:** Code is hard to maintain
**Fix:** Refactor immediately, re-run analysis

### ❌ Forgetting documentation updates

**Problem:** START.md, MEMORY.md become outdated
**Fix:** Update before committing (add to checklist)

### ❌ Not testing on actual device

**Problem:** Touch issues, performance problems missed
**Fix:** Always test on Galaxy Tab S7 FE for game/UI changes

### ❌ Ignoring console errors

**Problem:** Silent failures, poor UX
**Fix:** Fix ALL errors before committing

### ❌ Hardcoding credentials

**Problem:** Security vulnerability
**Fix:** Use environment variables

### ❌ Skipping git push

**Problem:** Work not backed up
**Fix:** Push to staging after every commit

---

## Time Estimates

- **Phase reading & planning:** 15-30 minutes
- **Database changes:** 10-20 minutes
- **Backend implementation:** 1-4 hours
- **Frontend implementation:** 2-6 hours
- **Game implementation:** 4-8 hours
- **Manual testing:** 1-2 hours
- **Code quality check:** 15-30 minutes
- **Documentation updates:** 15-30 minutes
- **Git commit & push:** 5-10 minutes
- **Deployment to staging:** 10-20 minutes
- **Final verification:** 30-60 minutes

**Total per phase:** 4-12 hours of AI work

**Factors that increase time:**

- New technology (first time using a library)
- Complex game logic
- Extensive UI work
- Integration with external services

---

## Success Criteria

**A phase is complete when:**

- ✅ All acceptance criteria from GHERKIN.md pass
- ✅ All code committed to git
- ✅ McCabe complexity ≤ 5 for all functions
- ✅ ESLint passing (no errors)
- ✅ Prettier formatting applied
- ✅ Documentation updated (START, MEMORY, README)
- ✅ Deployed to staging and tested
- ✅ No console errors or warnings
- ✅ User-facing features work on actual device (if applicable)
- ✅ All API endpoints tested
- ✅ Database migrations successful

**Never mark a phase complete if any criterion is not met**

---

## Emergency Procedures

### If tests fail after deployment

1. Revert deployment: `git reset --hard HEAD~1`
2. Fix issues locally
3. Re-test
4. Re-deploy

### If database migration fails

1. Run rollback SQL
2. Fix migration script
3. Re-run migration
4. Verify with `SHOW TABLES` and `DESCRIBE`

### If production breaks

1. Immediately revert to previous version
2. Notify user
3. Fix in staging
4. Re-test thoroughly
5. Re-deploy

---

**Created:** October 25, 2025
**Last Updated:** October 25, 2025
**Maintained By:** Corey (developer)
**Purpose:** Step-by-step guide for completing each phase correctly
