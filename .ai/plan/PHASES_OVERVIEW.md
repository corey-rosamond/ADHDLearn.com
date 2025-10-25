# PHASES_OVERVIEW.md - Value-Driven Development Roadmap

**ADHDLearn.com - Vertical Slice Phases**

**Last Updated:** October 21, 2025

---

## Philosophy

Every phase delivers **working, deployable value** to either:
- **Aurora** (can play/use something new)
- **You** (can manage/see something new)

No phase is "just infrastructure" - each phase results in a new version of the site with visible improvements.

---

## Phase List (Value-Driven)

### **Phase 0: Server Infrastructure**
**Delivers:** Production and staging environments ready for deployment
- Configure 8 Apache vhosts (production + staging for each subdomain)
- Set up SSL certificates with Let's Encrypt
- Configure git with staging and main branches
- Create deployment scripts
- Test placeholder pages load via HTTPS

**Aurora gets:** Nothing yet
**You get:** Infrastructure to deploy to
**Deployed:** Placeholder pages at all 8 domains

---

### **Phase 1: Project Foundation**
**Delivers:** Clean directory structure and git repository
- Create all top-level directories
- Initialize git repository
- Set up .gitignore
- Create README files
- Configure monorepo with workspaces

**Aurora gets:** Nothing yet
**You get:** Organized development environment
**Deployed:** Nothing (local only)

---

### **Phase 2: Letter Pop Standalone Deployment**
**Delivers:** Aurora can play Letter Pop from her tablet
- Take existing Letter Pop from archive
- Deploy to child.adhdlearn.com
- Works standalone (no login, no backend yet)
- Saves scores to localStorage

**Aurora gets:** 🎮 **Can play Letter Pop from anywhere**
**You get:** See Aurora using the site
**Deployed:** child.adhdlearn.com has working Letter Pop

---

### **Phase 3: Database + Simple Backend**
**Delivers:** Scores persist in database
- Create MySQL database with minimal schema (just sessions table)
- Basic Node.js API with one endpoint: POST /api/sessions
- Letter Pop sends score after each game
- Display high scores from database

**Aurora gets:** 🏆 **Her high scores are saved and displayed**
**You get:** Backend infrastructure working
**Deployed:** Aurora's scores persist across devices

---

### **Phase 4: Parent Registration + Login**
**Delivers:** You can create an account and login
- Parent registration endpoint (backend)
- Parent login endpoint (backend)
- Simple registration form (React)
- Simple login form (React)
- Deploy to parent.adhdlearn.com

**Aurora gets:** Nothing new
**You get:** 🔐 **Can create account and login to parent portal**
**Deployed:** parent.adhdlearn.com has working auth

---

### **Phase 5: Parent Dashboard - View Aurora's Scores**
**Delivers:** You see Aurora's Letter Pop scores
- Expand database: add families, users tables
- Link sessions to user_id
- Parent dashboard shows children (just Aurora for now)
- Click Aurora's card → see her Letter Pop scores

**Aurora gets:** Nothing new
**You get:** 📊 **See Aurora's scores and play history**
**Deployed:** You can track Aurora's progress

---

### **Phase 6: Family Management**
**Delivers:** You can add Aurora as a child to your family
- Add child endpoint (backend)
- Add child form in parent portal
- Child has: name, birth date, avatar, 4-digit PIN
- List children in family

**Aurora gets:** Nothing new yet
**You get:** 👨‍👩‍👧 **Manage family (add/edit Aurora's profile)**
**Deployed:** Aurora now exists in the system as your child

---

### **Phase 7: Child Login with PIN**
**Delivers:** Aurora logs in as herself
- Child login endpoint (backend, PIN-based)
- Child selector (shows Aurora's avatar)
- PIN entry screen (number pad)
- After login: simple dashboard with "Play Letter Pop" button

**Aurora gets:** 🔢 **Logs in with her own PIN, sees personalized dashboard**
**You get:** Aurora has her own identity in the system
**Deployed:** Aurora logs in, plays Letter Pop under her account

---

### **Phase 8: Child Dashboard with Categories**
**Delivers:** Aurora sees learning categories (most locked)
- Colorful category cards: Reading, Math, Science, Life Skills
- Only Reading unlocked (has Letter Pop)
- Others show "Coming Soon"
- Display Aurora's points and streak

**Aurora gets:** 🎨 **Prettier dashboard, can see what's coming**
**You get:** Nothing new
**Deployed:** Better UX for Aurora

---

### **Phase 9: Add Word Builder Game**
**Delivers:** Aurora has a 2nd game to play
- Build Word Builder (drag letters to spell words)
- Add to Reading category
- Aurora sees 2 games in Reading: Letter Pop, Word Builder
- Scores save to database

**Aurora gets:** 🎮 **NEW GAME - Word Builder**
**You get:** See Aurora's Word Builder scores in parent dashboard
**Deployed:** 2 working games for Aurora

---

### **Phase 10: Add Sight Words Game**
**Delivers:** Aurora has a 3rd game
- Build Sight Words flash cards
- Add to Reading category
- Aurora now has 3 Reading games

**Aurora gets:** 🎮 **NEW GAME - Sight Words**
**You get:** See Aurora's Sight Words progress
**Deployed:** 3 working games for Aurora

---

### **Phase 11: Unlock Math Category - Counting Game**
**Delivers:** Math category opens with first game
- Build Counting Game
- Unlock Math category
- Aurora sees Math category now available

**Aurora gets:** 🎮 **NEW CATEGORY - Math, NEW GAME - Counting**
**You get:** See Aurora's math progress
**Deployed:** 4 total games across 2 categories

---

### **Phase 12: Add Shapes Recognition Game**
**Delivers:** 2nd Math game
- Build Shapes Recognition
- Add to Math category

**Aurora gets:** 🎮 **NEW GAME - Shapes**
**You get:** See shapes progress
**Deployed:** 5 total games

---

### **Phase 13: Add Simple Addition Game**
**Delivers:** 3rd Math game
- Build Addition Game (1-10)
- Add to Math category

**Aurora gets:** 🎮 **NEW GAME - Addition**
**You get:** See math skills developing
**Deployed:** 6 total games

---

### **Phase 14: Chore System - Backend**
**Delivers:** Chore infrastructure ready
- Chores table in database
- Chore API endpoints (create, list, update, approve)
- Nothing visible yet (backend only)

**Aurora gets:** Nothing yet
**You get:** Nothing yet (prep for next phase)
**Deployed:** Backend ready for chores

---

### **Phase 15: Chore System - Parent Side**
**Delivers:** You can create chores for Aurora
- Chore manager in parent portal
- Create chore form
- Assign to Aurora
- Set points value
- View chore status

**Aurora gets:** Nothing yet (can't see chores)
**You get:** 📝 **Create and manage chores for Aurora**
**Deployed:** You can assign chores

---

### **Phase 16: Chore System - Child Side**
**Delivers:** Aurora can complete chores
- Chore list in child portal
- Aurora sees assigned chores
- Mark as complete
- Optional: take photo proof
- Submit for your approval

**Aurora gets:** ✅ **See chores, complete them, earn points**
**You get:** Approve/reject Aurora's completed chores
**Deployed:** Full chore workflow working

---

### **Phase 17: Progress Charts**
**Delivers:** You see Aurora's progress visually
- Chart.js integration
- Progress over time (line chart)
- Activity breakdown (pie chart)
- Time spent per category

**Aurora gets:** Nothing new
**You get:** 📈 **Visual charts showing Aurora's progress**
**Deployed:** Better insights into Aurora's learning

---

### **Phase 18: Confusion Matrix (Letter Pop)**
**Delivers:** You see which letters Aurora confuses
- Track which letter clicked vs which was target
- Display confusion pairs (e.g., b vs d)
- Show most confused letters

**Aurora gets:** Nothing new
**You get:** 🔍 **See Aurora's specific learning struggles**
**Deployed:** Detailed Letter Pop analytics

---

### **Phase 19: Real-Time Updates**
**Delivers:** You see Aurora playing in real-time
- WebSocket connection
- When Aurora starts game → you see "Playing now"
- Score updates live
- Notification when she finishes

**Aurora gets:** Nothing new
**You get:** 📡 **Watch Aurora play in real-time**
**Deployed:** Live monitoring of Aurora's activity

---

### **Phase 20: Achievements & Badges**
**Delivers:** Aurora earns badges
- Achievement system (backend)
- Award badges for milestones:
  - "Played 10 games"
  - "5-day streak"
  - "100 points earned"
- Display badges on child dashboard

**Aurora gets:** 🏅 **Earn and collect badges**
**You get:** See Aurora's achievements
**Deployed:** Gamification increases motivation

---

### **Phase 21: Marketing Website**
**Delivers:** Public-facing site explaining the platform
- Static HTML/CSS site at adhdlearn.com
- Explains what ADHDLearn is
- Links to parent.adhdlearn.com/register

**Aurora gets:** Nothing
**You get:** 🌐 **Professional landing page**
**Deployed:** adhdlearn.com goes live

---

### **Phase 22: Age Norms Comparison**
**Delivers:** Compare Aurora to other kids her age
- Seed database with age norm data
- Calculate Aurora's percentile
- Display comparison chart

**Aurora gets:** Nothing
**You get:** 📊 **See how Aurora compares to peers**
**Deployed:** Context for Aurora's performance

---

### **Phase 23: Science Category - Experiments**
**Delivers:** Unlock Science category
- Create 3 simple science "games":
  - Color mixing simulator
  - Magnet game
  - Plant growth tracker
- Unlock Science category

**Aurora gets:** 🎮 **NEW CATEGORY - Science (3 games)**
**You get:** See Aurora exploring science
**Deployed:** 9 total games across 3 categories

---

### **Phase 24: Life Skills - Cooking Helper**
**Delivers:** Cooking recipes for Aurora
- Recipe browser
- Step-by-step instructions
- Measurement game (1 cup, 1/2 cup, etc.)
- Mark recipe as "cooked" (you verify)

**Aurora gets:** 🍳 **Cooking Helper unlocked**
**You get:** Help Aurora learn cooking
**Deployed:** 10+ activities total

---

### **Phase 25: Life Skills - 3D Printing Projects**
**Delivers:** 3D printing project library
- Browse STL files by category
- Select project to print
- You mark as "printed"
- Aurora marks as "completed"

**Aurora gets:** 🖨️ **3D Printing Projects unlocked**
**You get:** Track what Aurora prints
**Deployed:** 15+ activities total

---

### **Phase 26: Life Skills - Shopping Helper**
**Delivers:** Shopping list and budget simulator
- Grocery list game
- Budget simulator ($5, pick 3 items)
- Healthy vs treat categorization

**Aurora gets:** 🛒 **Shopping Helper unlocked**
**You get:** Teach budgeting and healthy choices
**Deployed:** 18+ activities total

---

### **Phase 27: Weekly Reports (Email)**
**Delivers:** Automated weekly progress email
- Email service setup
- Generate weekly summary
- Send to your email every Sunday
- Includes: games played, scores, time spent, badges earned

**Aurora gets:** Nothing
**You get:** 📧 **Weekly email summary**
**Deployed:** Automated parent updates

---

### **Phase 28: ML Pattern Detection**
**Delivers:** Automatic learning pattern detection
- Detect letter reversals (b/d, p/q)
- Detect time-of-day performance patterns
- Alert you to struggles

**Aurora gets:** Nothing
**You get:** 🤖 **Automatic insights into Aurora's learning**
**Deployed:** Proactive learning support

---

### **Phase 29: PDF Reports**
**Delivers:** Downloadable progress reports
- Generate PDF with charts
- Progress over time
- Activity breakdown
- Achievements
- Download button in parent portal

**Aurora gets:** Nothing
**You get:** 📄 **Download professional progress reports**
**Deployed:** Shareable reports (for teachers, specialists)

---

### **Phase 30: Android APK**
**Delivers:** Install as native app on Aurora's tablet
- Wrap with Capacitor
- Build APK
- Install on Galaxy Tab S7 FE
- Works offline (caches last session)

**Aurora gets:** 📱 **Native app icon on tablet**
**You get:** Easier access for Aurora
**Deployed:** Full native app experience

---

### **Phase 31: Multi-Parent Support**
**Delivers:** Add another parent to the family
- Invite parent endpoint
- Accept invitation flow
- Multiple parents see same data

**Aurora gets:** Nothing
**You get:** 👨‍👩‍👧 **Add your partner to the account**
**Deployed:** Shared family management

---

### **Phase 32: Multiple Children**
**Delivers:** Add siblings
- Support for multiple children per family
- Each child has own login, scores, chores
- Parent switches between children

**Aurora gets:** Siblings can play too
**You get:** 👨‍👩‍👧‍👦 **Manage multiple children**
**Deployed:** Full family platform

---

### **Phase 33: Parental Controls**
**Delivers:** Screen time limits and content controls
- Set daily time limits
- Enable/disable categories
- Require chores before games
- Schedule (e.g., no games before homework)

**Aurora gets:** Structure and limits
**You get:** 🕐 **Control Aurora's usage**
**Deployed:** Healthy screen time management

---

### **Phase 34: Advanced Testing Infrastructure**
**Delivers:** Comprehensive automated tests
- Playwright E2E tests for all features
- CI/CD pipeline
- Automated regression testing

**Aurora gets:** Nothing (more reliable app)
**You get:** 🧪 **Confidence in deployments**
**Deployed:** Automated quality assurance

---

### **Phase 35: Performance Optimization**
**Delivers:** Faster load times
- Code splitting
- Image optimization
- Lazy loading
- CDN for assets

**Aurora gets:** ⚡ **Faster app**
**You get:** Better experience
**Deployed:** Optimized performance

---

### **Phase 36: Accessibility Improvements**
**Delivers:** Better accessibility for ADHD
- High contrast mode
- Adjustable font sizes
- Screen reader support
- Keyboard navigation

**Aurora gets:** ♿ **Better accessibility**
**You get:** Inclusive platform
**Deployed:** WCAG 2.1 AA compliant

---

## Total Phases: 36

**Estimated Timeline:** 18-24 weeks (4-6 months)

**Aurora gets value starting:** Phase 2 (Week 1)

**Key Milestones:**
- **Week 1:** Aurora plays Letter Pop (Phase 2)
- **Week 2:** Aurora's scores save (Phase 3)
- **Week 3:** You can see her scores (Phase 5)
- **Week 4:** Aurora logs in as herself (Phase 7)
- **Week 6:** Aurora has 3 games (Phase 10)
- **Week 8:** Aurora has math games (Phase 13)
- **Week 10:** Chore system working (Phase 16)
- **Week 12:** Real-time monitoring (Phase 19)
- **Week 16:** 18+ activities across all categories (Phase 26)

---

## Deployment Strategy

**After each phase:**
1. Develop locally
2. Test manually (BDD scenarios)
3. Commit to git
4. Push to staging branch
5. Deploy to staging domains (test again)
6. Merge to main
7. Deploy to production
8. Aurora/You use the new feature

**Every phase = new production deployment**

---

**Created:** October 21, 2025
**Approach:** Vertical slices, value-driven development
**Goal:** Aurora gets value early and often
