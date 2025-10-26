# Session Memory - Critical Information Only

**Last Updated:** October 26, 2025
**Current Status:** Phase 5 (Completed) → Ready for Phase 6
**Branch:** staging

---

## Current Phase Status

**Phase:** 3 (Database + Backend + Score Persistence)
**Status:** COMPLETED ✅
**Blockers:** None

**Phase 3 Accomplishments:**

- ✅ MySQL 8.0.43 installed and configured on 160.153.180.159
- ✅ Database `adhdlearn` created with user `adhdlearn`
- ✅ Table `game_sessions` created with proper indexes
- ✅ Express API server (backend/src/index.js) with 3 endpoints:
  - POST /api/sessions (McCabe: 4)
  - GET /api/sessions/high-scores (McCabe: 3)
  - GET /health (McCabe: 1)
- ✅ PM2 process manager running API on port 3000
- ✅ CORS configured for all child portal origins
- ✅ Frontend API service (child-portal/src/services/api.js)
- ✅ LetterPopScene.endRound() modified to save scores (McCabe: 2)
- ✅ ResultsScene modified to display high scores and badges (McCabe: 2/3)
- ✅ API graceful degradation (game works offline)
- ✅ All GHERKIN scenarios tested and passing
- ✅ All McCabe complexity ≤ 5
- ✅ Fixed MySQL reserved word issue ("rank" → `rank`)
- ✅ Fixed MySQL LIMIT placeholder issue (template literal)

**Phase 2 Accomplishments:**

- ✅ React 19.2.0 + Vite 7.1.12 configuration
- ✅ Phaser 3.90.0 integrated with React wrapper
- ✅ ES6 module conversion for all Phaser game code
- ✅ Bridge pattern implemented (ES6 modules → window.* globals for compatibility)
- ✅ All game assets copied to public/assets/ (audio, images, UI elements)
- ✅ Asset paths fixed with leading `/` for Vite
- ✅ ThemeConfig imports added to all components
- ✅ Playwright 1.56.1 installed for automated testing
- ✅ Smoke test created (tests/smoke.mjs)
- ✅ npm script `test:smoke` added to package.json
- ✅ Production build successful (1.73MB bundle, 412KB gzipped)
- ✅ Zero console errors in smoke test
- ✅ Game loads and renders correctly (screenshot verified)

**Phase 1 Accomplishments:**

- ✅ Monorepo directory structure created (backend/, child-portal/, parent-portal/, marketing-website/, shared/, tests/)
- ✅ npm workspaces configured and tested
- ✅ Root package.json with workspace configuration
- ✅ .gitignore updated (comprehensive)
- ✅ ESLint configured with McCabe complexity ≤ 5 rule
- ✅ Prettier configured for code formatting
- ✅ README files created in all major directories
- ✅ All workspace dependencies installable via `npm install`

**Phase 0 Accomplishments:**

- ✅ 8 Apache virtual hosts configured (production + staging)
- ✅ SSL certificates installed for all 8 domains (Let's Encrypt)
- ✅ Placeholder pages deployed and accessible via HTTPS
- ✅ PM2 process manager installed and configured
- ✅ Firewall configured (ufw: ports 22, 80, 443)
- ✅ Directory structure created with correct permissions

**Next Phase:** Phase 6 (TBD - check phase-06 documentation)

**Known Limitations:**

- MySQL database (160.153.180.159) not configured for remote connections
  - Localhost testing requires backend running on server
  - API endpoints coded correctly, will work when deployed
- Phase 5 testing deferred to deployment on server

---

## Active Technologies (Confirmed)

### Frontend

- **Child Portal:** React 19.2.0 + Vite 7.1.12 + Phaser 3.90.0
- **Parent Portal:** React 18 + Vite + Tailwind CSS (not yet built)
- **Marketing:** Static HTML/CSS/JS (placeholder)

### Backend

- **API:** Node.js 18+ + Express 4.18.2
- **Real-time:** Socket.io (not yet implemented)
- **Process Manager:** PM2 6.0.13

### Database

- **RDBMS:** MySQL 8.0
- **Host:** 160.153.180.159
- **Database:** adhdlearn

### Deployment

- **Web Server:** Apache 2.4+
- **SSL:** Let's Encrypt
- **Domains:** 8 vhosts (staging + prod × 4 subdomains)
- **Android:** Capacitor wrapper

---

## Critical Commands

### Child Portal (React + Vite + Phaser)

```bash
# Navigate to child-portal
cd /home/corey/Desktop/ADHDLearn.com/child-portal

# Install dependencies
npm install

# Development mode
npm run dev
# → http://localhost:5173

# Production build
npm run build

# Preview production build
npm run preview
# → http://localhost:4173

# Run smoke test (requires preview server running)
npm run test:smoke
```

### Development Server (Legacy Phaser)

```bash
# Start HTTPS server (required for audio/camera)
python3 https-server.py

# Access: https://localhost:8000
```

### Database

```bash
# Connect to MySQL
mysql -h 160.153.180.159 -u [user] -p adhdlearn

# Run migration
mysql -h 160.153.180.159 -u [user] -p adhdlearn < backend/migrations/phase-XX.sql
```

### Testing (Android Device)

```bash
# Set environment
export ANDROID_HOME=/home/corey/android-sdk

# List devices
$ANDROID_HOME/platform-tools/adb devices

# Use swipe for reliable touch (not tap)
$ANDROID_HOME/platform-tools/adb shell input swipe X Y X Y 100

# Screenshots
$ANDROID_HOME/platform-tools/adb shell screencap -p /sdcard/screen.png
$ANDROID_HOME/platform-tools/adb pull /sdcard/screen.png test/screenshots/

# Install APK
$ANDROID_HOME/platform-tools/adb install -r app.apk
```

### Git Workflow

```bash
# Check status
git status
git branch  # Should be on staging

# Commit phase completion
git add .
git commit -m "Complete Phase X: [Name]"
git push origin staging

# After testing on staging, merge to main
git checkout main
git merge staging
git push origin main
```

### Code Quality

```bash
# Lint
npm run lint

# Format
npm run format

# Check McCabe complexity (all functions ≤ 5)
npm install -g complexity-report
cr src/ --format json > .ai/reports/mccabe-phase-XX.json
```

### Backend (PM2)

```bash
# Start backend
pm2 start backend/server.js --name api-staging

# Restart
pm2 restart api-staging

# View logs
pm2 logs api-staging

# Stop
pm2 stop api-staging
```

---

## Recent Completed Phases

**None yet** - Phase 0 ready to begin

---

## Recent Critical Issues & Solutions

### Kotlin/libGDX Attempt (October 2025)

- **Problem:** GWT cannot compile Kotlin code for web deployment
- **Solution:** Abandoned libGDX approach, reverted to Phaser + React
- **Archived:** archive/kotlin-libgdx-attempt/
- **Lesson:** Always verify transpiler compatibility before choosing stack

### Touch Input (Phaser/Android)

- **Problem:** ADB tap commands unreliable
- **Solution:** Use `swipe X Y X Y 100` instead of `tap X Y`

---

## Environment

- **Target Device:** Samsung Galaxy Tab S7 FE (2560x1600)
- **Node.js:** 18+ LTS
- **npm:** 9+
- **MySQL:** 8.0 (remote: 160.153.180.159)
- **Branch:** staging
- **ANDROID_HOME:** `/home/corey/android-sdk`
- **Working Directory:** `/home/corey/Desktop/ADHDLearn.com`

---

## Database Structure (Evolving)

### Phase 3: Initial Schema

- `sessions` table - Game session tracking

### Phase 4: Authentication

- `parents` table - Parent accounts
- `sessions` renamed to `game_sessions`

### Phase 6: Family Management

- `families` table
- `children` table
- `family_members` table (junction)

### Phase 14: Chores

- `chores` table
- `chore_completions` table

**See phase PLAN.md files for detailed schema**

---

## API Endpoints (Evolving)

### Phase 3

- `POST /api/sessions` - Save game session

### Phase 4

- `POST /api/auth/register` - Parent registration
- `POST /api/auth/login` - Parent login

### Phase 7

- `POST /api/auth/child-login` - Child PIN login

**See phase PLAN.md files for complete API documentation**

---

## Phase Completion Checklist

Before marking any phase complete:

- [ ] All acceptance criteria from GHERKIN.md met
- [ ] All files created/modified per PLAN.md
- [ ] Database migrations run (if applicable)
- [ ] API endpoints tested (if applicable)
- [ ] Frontend components working (if applicable)
- [ ] Manual testing complete (all scenarios)
- [ ] McCabe complexity ≤ 5 for ALL functions (MANDATORY)
- [ ] ESLint passing (no errors)
- [ ] Prettier formatting applied
- [ ] Screenshots captured (if UI changes)
- [ ] Test results documented in test/results/phase-XX-results.md
- [ ] MEMORY.md updated (this file)
- [ ] START.md updated
- [ ] README.md updated
- [ ] Git commit created with detailed message
- [ ] Pushed to staging
- [ ] Deployed to staging environment
- [ ] Tested on staging domain
- [ ] User approval (if major changes)

---

## Important Reminders

### Code Quality (Non-Negotiable)

- **McCabe Complexity:** ALL functions ≤ 5
- **No hardcoded credentials** - Use environment variables
- **No console.log in production** - Use proper logging
- **Parameterized SQL queries only** - Prevent SQL injection
- **Consistent error handling** - Return proper HTTP status codes

### ADHD-Friendly Design (Always)

- Immediate feedback (< 50ms)
- High contrast colors (WCAG AAA)
- Large touch targets (≥ 44×44px)
- Non-punitive messages (never "wrong" or "failure")
- Clear progress indicators
- Minimal distractions

### Documentation (Required)

- Update START.md after every phase
- Update MEMORY.md (this file) with new commands/issues
- Update README.md when features change
- Document all errors and solutions in ERROR_SOLUTIONS.md

---

## Known Issues

**None currently** - Will be updated as development progresses

---

## Next Session: Phase 0

**To begin Phase 0:**

1. **Read documentation:**
   - `.ai/CONTEXT_SUMMARY.md` (load first)
   - `.ai/phases/phase-00/PLAN.md`
   - `.ai/phases/phase-00/GHERKIN.md`
   - `.ai/phases/phase-00/UML.md`
   - `.ai/phases/phase-00/WIREFRAMES.md`

2. **Prerequisites:**
   - SSH access to server (160.153.180.159)
   - sudo privileges
   - Apache installed
   - certbot installed

3. **Deliverables:**
   - 8 Apache virtual hosts configured
   - SSL certificates installed
   - Placeholder pages deployed
   - All domains accessible via HTTPS

**See `.ai/PHASE_WORKFLOW.md` for complete step-by-step process**

---

**Created:** October 25, 2025
**Maintained By:** Corey (developer) + Claude Code
**Purpose:** Track critical information, commands, and decisions across sessions
