# Session Memory - Critical Information Only

**Last Updated:** October 25, 2025
**Current Status:** Phase 0 (Completed) → Ready for Phase 1
**Branch:** staging

---

## Current Phase Status

**Phase:** 0 (Server Infrastructure)
**Status:** COMPLETED ✅
**Blockers:** None

**Phase 0 Accomplishments:**
- ✅ 8 Apache virtual hosts configured (production + staging)
- ✅ SSL certificates installed for all 8 domains (Let's Encrypt)
- ✅ Placeholder pages deployed and accessible via HTTPS
- ✅ PM2 process manager installed and configured
- ✅ Firewall configured (ufw: ports 22, 80, 443)
- ✅ Directory structure created with correct permissions

**Next Phase:** Phase 1 (Database Setup)

---

## Active Technologies (Confirmed)

### Frontend
- **Child Portal:** React 18 + Vite + Phaser 3.80.1
- **Parent Portal:** React 18 + Vite + Tailwind CSS
- **Marketing:** Static HTML/CSS/JS

### Backend
- **API:** Node.js 18+ + Express
- **Real-time:** Socket.io
- **Process Manager:** PM2

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

### Development Server
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
