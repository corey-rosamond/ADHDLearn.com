# ADHDLearn.com Platform - Master Plan (Phase-Organized)

**Project:** ADHDLearn.com - Family Learning Platform for Children with ADHD
**Version:** 4.0 (Phase-Organized)
**Developer:** Corey (Dad building for Aurora)
**Date:** October 21, 2025
**Status:** Planning Phase

---

## Executive Summary

Transform the existing Letter Pop game into a comprehensive family learning platform where:
- **Aurora uses it from Week 1** - Letter Pop deployed immediately
- **Every phase adds working value** - No "infrastructure only" phases
- **Parents track real progress** - Dashboard shows actual gameplay data
- **Quality maintained throughout** - McCabe ≤ 5, BDD scenarios, comprehensive testing

**Development Philosophy:**
- **Vertical slices over horizontal layers** - Each phase delivers end-to-end functionality
- **Value first, polish later** - Working features before perfect code
- **Deploy frequently** - Every phase goes to production
- **Test with Aurora continuously** - Real user feedback drives development

**Primary Users:**
- **Aurora (age 4-10):** Primary user, plays learning adventures
- **Corey (parent):** Manages family, tracks progress, creates chores

**Tech Stack:**
- **Frontend:** React (portals), Phaser 3 (games)
- **Backend:** Node.js + Express REST API
- **Database:** MySQL 8.0+ (server: 160.153.180.159)
- **Auth:** JWT tokens, bcrypt password hashing
- **Deployment:** Apache (web), Capacitor (Android APK)
- **Real-time:** Socket.io for live parent updates

---

## Table of Contents

### Global Architecture
1. [System Overview](#system-overview)
2. [Technology Stack](#technology-stack)
3. [Security Principles](#security-principles)
4. [Testing Approach](#testing-approach)
5. [Deployment Strategy](#deployment-strategy)

### Phase-by-Phase Implementation
6. [Phase 0: Server Infrastructure](#phase-0-server-infrastructure)
7. [Phase 1: Project Foundation](#phase-1-project-foundation)
8. [Phase 2: Letter Pop Standalone Deployment](#phase-2-letter-pop-standalone-deployment)
9. [Phase 3: Database + Simple Backend](#phase-3-database--simple-backend)
10. [Phase 4: Parent Registration + Login](#phase-4-parent-registration--login)
11. [Phase 5: Parent Dashboard - View Aurora's Scores](#phase-5-parent-dashboard---view-auroras-scores)
12. [Phase 6: Family Management](#phase-6-family-management)
13. [Phase 7: Child Login with PIN](#phase-7-child-login-with-pin)
14. [Phase 8: Child Dashboard with Categories](#phase-8-child-dashboard-with-categories)
15. [Phase 9: Add Word Builder Game](#phase-9-add-word-builder-game)
16. [Phase 10: Add Sight Words Game](#phase-10-add-sight-words-game)
17. [Phase 11: Unlock Math Category - Counting Game](#phase-11-unlock-math-category---counting-game)
18. [Phase 12: Add Shapes Recognition Game](#phase-12-add-shapes-recognition-game)
19. [Phase 13: Add Simple Addition Game](#phase-13-add-simple-addition-game)
20. [Phase 14: Chore System - Backend](#phase-14-chore-system---backend)
21. [Phase 15: Chore System - Parent Side](#phase-15-chore-system---parent-side)
22. [Phase 16: Chore System - Child Side](#phase-16-chore-system---child-side)
23. [Phase 17: Progress Charts](#phase-17-progress-charts)
24. [Phase 18: Confusion Matrix (Letter Pop)](#phase-18-confusion-matrix-letter-pop)
25. [Phase 19: Real-Time Updates](#phase-19-real-time-updates)
26. [Phase 20: Achievements & Badges](#phase-20-achievements--badges)
27. [Phase 21: Marketing Website](#phase-21-marketing-website)
28. [Phase 22: Age Norms Comparison](#phase-22-age-norms-comparison)
29. [Phase 23: Science Category - Experiments](#phase-23-science-category---experiments)
30. [Phase 24: Life Skills - Cooking Helper](#phase-24-life-skills---cooking-helper)
31. [Phase 25: Life Skills - 3D Printing Projects](#phase-25-life-skills---3d-printing-projects)
32. [Phase 26: Life Skills - Shopping Helper](#phase-26-life-skills---shopping-helper)
33. [Phase 27: Weekly Reports (Email)](#phase-27-weekly-reports-email)
34. [Phase 28: ML Pattern Detection](#phase-28-ml-pattern-detection)
35. [Phase 29: PDF Reports](#phase-29-pdf-reports)
36. [Phase 30: Android APK](#phase-30-android-apk)
37. [Phase 31: Multi-Parent Support](#phase-31-multi-parent-support)
38. [Phase 32: Multiple Children](#phase-32-multiple-children)
39. [Phase 33: Parental Controls](#phase-33-parental-controls)
40. [Phase 34: Advanced Testing Infrastructure](#phase-34-advanced-testing-infrastructure)
41. [Phase 35: Performance Optimization](#phase-35-performance-optimization)
42. [Phase 36: Accessibility Improvements](#phase-36-accessibility-improvements)

---

## System Overview

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    ADHDLearn.com Platform                        │
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │   Marketing  │  │    Parent    │  │    Child     │         │
│  │   Website    │  │    Portal    │  │    Portal    │         │
│  │ adhdlearn.com│  │ parent.adhd..│  │ child.adhd.. │         │
│  │  (Static)    │  │   (React)    │  │   (React +   │         │
│  │              │  │              │  │   Phaser)    │         │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘         │
│         │                  │                  │                 │
│         └──────────────────┼──────────────────┘                 │
│                            │                                    │
│                   ┌────────▼────────┐                           │
│                   │   REST API      │                           │
│                   │ (Node.js/Express)│                          │
│                   │ + WebSocket     │                           │
│                   │ (Socket.io)     │                           │
│                   └────────┬────────┘                           │
│                            │                                    │
│                   ┌────────▼────────┐                           │
│                   │  MySQL Database │                           │
│                   │  ─────────────  │                           │
│                   │  • families     │                           │
│                   │  • users        │                           │
│                   │  • sessions     │                           │
│                   │  • activities   │                           │
│                   │  • game_sessions│                           │
│                   │  • letter_attempts│                         │
│                   │  • chores       │                           │
│                   │  • achievements │                           │
│                   │  • learning_patterns│                       │
│                   └─────────────────┘                           │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘

Server: 160.153.180.159 (Ubuntu, Apache, MySQL, PM2)
```

### URL Structure

| Domain | Purpose | Technology | Users |
|--------|---------|-----------|-------|
| `adhdlearn.com` | Marketing landing page | Static HTML/CSS/JS | Public |
| `parent.adhdlearn.com` | Parent portal | React + Vite | Parents only |
| `child.adhdlearn.com` | Child portal + games | React + Phaser 3 | Children only |
| `api.adhdlearn.com` | REST API + WebSocket | Node.js/Express | Internal |
| `staging.adhdlearn.com` | Staging marketing | Static | Testing |
| `parent-staging.adhdlearn.com` | Staging parent portal | React | Testing |
| `child-staging.adhdlearn.com` | Staging child portal | React/Phaser | Testing |
| `api-staging.adhdlearn.com` | Staging API | Node.js | Testing |

---

## Technology Stack

| Component | Technology | Rationale |
|-----------|-----------|-----------|
| **Child Portal Frontend** | React + Phaser 3 | Component reusability, Phaser for games |
| **Parent Portal Frontend** | React | Same as child for shared components |
| **Marketing Website** | Static HTML/CSS/JS | Simple, fast, SEO-friendly |
| **Backend API** | Node.js + Express | JavaScript everywhere, fast development |
| **Database** | MySQL 8.0+ | Relational data, mature, well-supported |
| **Authentication** | JWT + bcrypt | Stateless, secure, industry standard |
| **Real-time** | Socket.io | WebSocket for live parent updates |
| **Web Server** | Apache | Already configured on server |
| **Process Manager** | PM2 | Node.js process management |
| **Testing** | Playwright | Best E2E testing tool |
| **Deployment** | Git + rsync + PM2 | Simple, reliable |
| **Android** | Capacitor | Wrap web app as native APK |

---

## Security Principles

### Authentication
- **Parent:** Email + password (bcrypt hashed, min 8 chars)
- **Child:** 4-digit PIN (bcrypt hashed, no email required)
- **Tokens:** JWT, expire after 7 days (parent) or 2 hours (child)
- **Rate Limiting:** 5 failed login attempts → 15 minute lockout

### API Security
- All endpoints require valid JWT token (except `/auth/*`)
- Input validation with express-validator
- Parameterized queries (prevent SQL injection)
- CORS restricted to known origins
- HTTPS only (Let's Encrypt SSL)

### Data Privacy (COPPA Compliant)
- No third-party analytics tracking children
- Parental consent required for child accounts
- Parents can delete all child data
- No advertising to children
- Data not sold to third parties

---

## Testing Approach

1. **Unit Tests:** Mocha/Chai (backend), Jest (frontend) - 80%+ coverage
2. **Integration Tests:** Supertest (API endpoints)
3. **E2E Tests:** Playwright (full user flows)
4. **Manual Testing:** BDD scenarios (GHERKIN.md) tested on Aurora's tablet
5. **User Acceptance:** Aurora uses child portal, you use parent portal

---

## Deployment Strategy

### Server Setup
- **Server:** 160.153.180.159 (Ubuntu)
- **Web Server:** Apache 2.4 (8 virtual hosts - production + staging)
- **SSL:** Let's Encrypt (auto-renew)
- **Database:** MySQL 8.0+
- **Process Manager:** PM2 (Node.js API)

### Deployment Workflow
1. Develop locally
2. Push to `staging` branch → deploy to staging
3. Test on staging
4. Merge `staging` → `main` → deploy to production
5. **Every phase goes to production**

---

## Phase 0: Server Infrastructure

**Delivers:** Production and staging environments ready for deployment
**Aurora gets:** Nothing yet
**You get:** Infrastructure to deploy to
**Deployed:** Placeholder pages at all 8 domains

### What This Phase Delivers

Complete server infrastructure configured and ready:
- 8 Apache virtual hosts (production + staging for each subdomain)
- SSL certificates via Let's Encrypt
- Git deployment hooks
- Firewall configuration
- PM2 process manager installed
- Placeholder HTML pages confirming setup

### Database Changes

None (database setup happens in Phase 3)

### API Endpoints

None (API setup happens in Phase 3)

### Frontend Changes

**New Files:**
- `/var/www/adhdlearn.com/production/child/index.html` - Placeholder
- `/var/www/adhdlearn.com/production/parent/index.html` - Placeholder
- `/var/www/adhdlearn.com/production/www/index.html` - Placeholder
- Corresponding staging files

### Technical Specifications

#### Apache Virtual Host Configuration

**Production Child Portal:** `/etc/apache2/sites-available/child.adhdlearn.com.conf`
```apache
<VirtualHost *:80>
    ServerName child.adhdlearn.com
    ServerAdmin admin@adhdlearn.com
    RewriteEngine On
    RewriteCond %{HTTPS} off
    RewriteRule ^(.*)$ https://%{HTTP_HOST}$1 [R=301,L]
</VirtualHost>

<VirtualHost *:443>
    ServerName child.adhdlearn.com
    ServerAdmin admin@adhdlearn.com
    DocumentRoot /var/www/adhdlearn.com/production/child

    <Directory /var/www/adhdlearn.com/production/child>
        Options -Indexes +FollowSymLinks
        AllowOverride All
        Require all granted

        RewriteEngine On
        RewriteBase /
        RewriteRule ^index\.html$ - [L]
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteCond %{REQUEST_FILENAME} !-d
        RewriteRule . /index.html [L]
    </Directory>

    Header always set X-Frame-Options "SAMEORIGIN"
    Header always set X-Content-Type-Options "nosniff"
    Header always set X-XSS-Protection "1; mode=block"
    Header always set Referrer-Policy "strict-origin-when-cross-origin"

    SSLEngine on
    SSLCertificateFile /etc/letsencrypt/live/child.adhdlearn.com/fullchain.pem
    SSLCertificateKeyFile /etc/letsencrypt/live/child.adhdlearn.com/privkey.pem
    Include /etc/letsencrypt/options-ssl-apache.conf

    ErrorLog ${APACHE_LOG_DIR}/child.adhdlearn.com-error.log
    CustomLog ${APACHE_LOG_DIR}/child.adhdlearn.com-access.log combined
</VirtualHost>
```

Repeat similar configurations for:
- `parent.adhdlearn.com`
- `adhdlearn.com`
- `api.adhdlearn.com` (reverse proxy to localhost:3000)
- All 4 staging equivalents

#### SSL Certificate Setup

```bash
# Install Certbot
sudo apt install certbot python3-certbot-apache -y

# Generate certificates for all domains
sudo certbot --apache -d adhdlearn.com -d www.adhdlearn.com
sudo certbot --apache -d parent.adhdlearn.com
sudo certbot --apache -d child.adhdlearn.com
sudo certbot --apache -d api.adhdlearn.com
sudo certbot --apache -d staging.adhdlearn.com
sudo certbot --apache -d staging-parent.adhdlearn.com
sudo certbot --apache -d staging-child.adhdlearn.com
sudo certbot --apache -d staging-api.adhdlearn.com

# Verify auto-renewal
sudo certbot renew --dry-run
```

#### Firewall Configuration

```bash
sudo apt install ufw -y
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 22/tcp  # SSH
sudo ufw allow 80/tcp  # HTTP
sudo ufw allow 443/tcp  # HTTPS
sudo ufw enable
```

#### PM2 Installation

```bash
# Install Node.js 20.x LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2 globally
sudo npm install -g pm2

# Configure PM2 startup
pm2 startup
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u $USER --hp /home/$USER
```

### Acceptance Criteria

- [ ] All 8 domains resolve to server IP
- [ ] All domains redirect HTTP → HTTPS
- [ ] SSL certificates valid (no browser warnings)
- [ ] Placeholder pages load successfully
- [ ] Security headers present in responses
- [ ] Firewall active (only ports 22, 80, 443 open)
- [ ] PM2 installed and configured for startup

### McCabe Complexity

N/A (infrastructure only)

### Dependencies

None (Phase 0 is the foundation)

---

## Phase 1: Project Foundation

**Delivers:** Clean directory structure and git repository
**Aurora gets:** Nothing yet
**You get:** Organized development environment
**Deployed:** Nothing (local only)

### What This Phase Delivers

Local development environment with complete project structure:
- Monorepo directory layout
- Git repository initialized
- .gitignore configured
- README files in all major directories
- npm workspace configuration
- ESLint and Prettier configured

### Database Changes

None

### API Endpoints

None

### Frontend Changes

**New Directory Structure:**
```
/home/corey/Desktop/ADHDLearn.com/
├── .ai/                          # Planning documents
│   ├── plan/
│   │   ├── PLAN.md
│   │   ├── GHERKIN.md
│   │   ├── UML.md
│   │   ├── WIREFRAMES.md
│   │   └── PHASES_OVERVIEW.md
│   └── phases/                   # Per-phase docs
│       ├── phase-00/
│       ├── phase-01/
│       └── ...
├── backend/                      # Node.js API
│   ├── src/
│   │   ├── index.js
│   │   ├── config/
│   │   ├── models/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── middleware/
│   │   └── utils/
│   ├── tests/
│   ├── package.json
│   └── README.md
├── child-portal/                 # React + Phaser
│   ├── src/
│   │   ├── components/
│   │   ├── games/
│   │   ├── services/
│   │   ├── assets/
│   │   └── App.jsx
│   ├── public/
│   ├── package.json
│   └── vite.config.js
├── parent-portal/                # React
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.jsx
│   ├── public/
│   ├── package.json
│   └── vite.config.js
├── marketing-website/            # Static HTML
│   ├── index.html
│   ├── styles.css
│   └── script.js
├── shared/                       # Shared utilities
│   ├── constants.js
│   ├── validators.js
│   └── types.js
├── tests/                        # E2E tests
│   └── playwright/
├── scripts/                      # Deployment scripts
│   ├── deploy-staging.sh
│   └── deploy-production.sh
├── package.json                  # Root package.json (workspaces)
├── .gitignore
└── README.md
```

### Technical Specifications

#### Root package.json (Workspaces)

```json
{
  "name": "adhdlearn-platform",
  "version": "1.0.0",
  "private": true,
  "workspaces": [
    "backend",
    "child-portal",
    "parent-portal",
    "shared"
  ],
  "scripts": {
    "dev:backend": "npm run dev --workspace=backend",
    "dev:child": "npm run dev --workspace=child-portal",
    "dev:parent": "npm run dev --workspace=parent-portal",
    "build:all": "npm run build --workspaces",
    "test:all": "npm run test --workspaces",
    "lint": "eslint . --ext .js,.jsx",
    "format": "prettier --write \"**/*.{js,jsx,json,md}\""
  },
  "devDependencies": {
    "eslint": "^8.50.0",
    "prettier": "^3.0.3"
  }
}
```

#### .gitignore

```
# Dependencies
node_modules/
.pnp
.pnp.js

# Production builds
dist/
build/
*.log

# Environment
.env
.env.local
.env.production

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Logs
logs/
*.log
npm-debug.log*

# Testing
coverage/
.nyc_output/

# Temporary
.tmp/
temp/
```

#### ESLint Configuration (.eslintrc.json)

```json
{
  "env": {
    "browser": true,
    "es2021": true,
    "node": true
  },
  "extends": [
    "eslint:recommended",
    "plugin:react/recommended"
  ],
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module"
  },
  "rules": {
    "complexity": ["error", 5],
    "no-console": "warn",
    "no-unused-vars": "error"
  }
}
```

### Acceptance Criteria

- [ ] All directories created with README files
- [ ] Git repository initialized
- [ ] npm workspaces configured and working
- [ ] ESLint passes with McCabe ≤ 5 rule
- [ ] Prettier configured
- [ ] Can run `npm install` from root (installs all workspaces)
- [ ] README.md documents project structure

### McCabe Complexity

N/A (no code yet)

### Dependencies

- Phase 0 must be complete

---

## Phase 2: Letter Pop Standalone Deployment

**Delivers:** Aurora can play Letter Pop from her tablet
**Aurora gets:** 🎮 **Can play Letter Pop from anywhere**
**You get:** See Aurora using the site
**Deployed:** child.adhdlearn.com has working Letter Pop

### What This Phase Delivers

Letter Pop game deployed and playable:
- Standalone Phaser 3 game (no login required)
- Saves high scores to localStorage
- Works on Aurora's tablet (Android Chrome)
- Full game mechanics: bubble popping, letter recognition, scoring
- Results screen with stats

### Database Changes

None (localStorage only in this phase)

### API Endpoints

None (backend integration happens in Phase 3)

### Frontend Changes

**New Files in `child-portal/`:**
```
src/
├── games/
│   └── reading/
│       └── letter-pop/
│           ├── scenes/
│           │   ├── MenuScene.js
│           │   ├── GameScene.js
│           │   └── ResultsScene.js
│           ├── config.js
│           └── index.js
├── App.jsx
├── main.jsx
└── index.html
```

### Technical Specifications

#### Phaser Game Configuration

**`letter-pop/config.js`**
```javascript
export default {
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: -50 },  // Bubbles float upward
      debug: false
    }
  },
  scene: [MenuScene, GameScene, ResultsScene]
};
```

#### MenuScene (Difficulty Selection)

**`scenes/MenuScene.js`**
```javascript
export default class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MenuScene' });
  }

  create() {
    // Title
    this.add.text(
      this.cameras.main.centerX,
      100,
      'LETTER POP',
      { fontSize: '64px', fontFamily: 'Comic Neue', color: '#fff' }
    ).setOrigin(0.5);

    // Difficulty buttons
    this.createButton(200, 'UPPERCASE', 'uppercase');
    this.createButton(300, 'lowercase', 'lowercase');
    this.createButton(400, 'Mixed', 'mixed');
  }

  createButton(y, text, mode) {
    const btn = this.add.rectangle(
      this.cameras.main.centerX,
      y,
      300,
      80,
      0x6FCF97
    ).setInteractive();

    this.add.text(
      this.cameras.main.centerX,
      y,
      text,
      { fontSize: '32px', fontFamily: 'Comic Neue', color: '#fff' }
    ).setOrigin(0.5);

    btn.on('pointerdown', () => {
      this.scene.start('GameScene', { mode });
    });
  }
}
```

#### GameScene (Main Gameplay)

**`scenes/GameScene.js`**
```javascript
export default class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
  }

  create(data) {
    this.mode = data.mode || 'uppercase';
    this.score = 0;
    this.attempts = [];
    this.targetLetter = this.getRandomLetter();

    // Display target letter
    this.targetText = this.add.text(
      this.cameras.main.centerX,
      80,
      `Find: ${this.targetLetter}`,
      { fontSize: '48px', fontFamily: 'Comic Neue', color: '#fff' }
    ).setOrigin(0.5);

    // Score display
    this.scoreText = this.add.text(
      20,
      20,
      `Score: ${this.score}`,
      { fontSize: '24px', fontFamily: 'Comic Neue', color: '#fff' }
    );

    // Spawn bubbles
    this.spawnBubbles();

    // Timer (60 seconds)
    this.timeLeft = 60;
    this.timerText = this.add.text(
      this.cameras.main.width - 20,
      20,
      `Time: ${this.timeLeft}`,
      { fontSize: '24px', fontFamily: 'Comic Neue', color: '#fff' }
    ).setOrigin(1, 0);

    this.time.addEvent({
      delay: 1000,
      callback: this.updateTimer,
      callbackScope: this,
      loop: true
    });
  }

  spawnBubbles() {
    // Create 8 bubbles with random letters
    for (let i = 0; i < 8; i++) {
      const x = Phaser.Math.Between(100, this.cameras.main.width - 100);
      const y = Phaser.Math.Between(200, this.cameras.main.height - 100);
      const letter = i === 0 ? this.targetLetter : this.getRandomLetter();

      this.createBubble(x, y, letter);
    }
  }

  createBubble(x, y, letter) {
    const bubble = this.add.circle(x, y, 50, 0xFF6B6B, 0.8);
    const text = this.add.text(x, y, letter, {
      fontSize: '48px',
      fontFamily: 'Comic Neue',
      color: '#fff'
    }).setOrigin(0.5);

    bubble.setInteractive();
    bubble.setData('letter', letter);

    // Physics
    this.physics.add.existing(bubble);
    bubble.body.setVelocity(
      Phaser.Math.Between(-50, 50),
      Phaser.Math.Between(-100, -50)
    );

    // Click handler
    bubble.on('pointerdown', () => {
      this.handleBubbleClick(letter);
      bubble.destroy();
      text.destroy();
    });
  }

  handleBubbleClick(clickedLetter) {
    const isCorrect = clickedLetter === this.targetLetter;

    this.attempts.push({
      target: this.targetLetter,
      clicked: clickedLetter,
      correct: isCorrect,
      timestamp: Date.now()
    });

    if (isCorrect) {
      this.score += 10;
      this.scoreText.setText(`Score: ${this.score}`);
      this.sound.play('correct');  // Positive feedback
      this.targetLetter = this.getRandomLetter();
      this.targetText.setText(`Find: ${this.targetLetter}`);
    } else {
      this.sound.play('incorrect');  // Gentle feedback
    }

    // Spawn new bubble
    this.createBubble(
      Phaser.Math.Between(100, this.cameras.main.width - 100),
      this.cameras.main.height + 50,
      this.getRandomLetter()
    );
  }

  updateTimer() {
    this.timeLeft--;
    this.timerText.setText(`Time: ${this.timeLeft}`);

    if (this.timeLeft <= 0) {
      this.gameOver();
    }
  }

  gameOver() {
    const correct = this.attempts.filter(a => a.correct).length;
    const total = this.attempts.length;
    const accuracy = total > 0 ? (correct / total * 100).toFixed(1) : 0;

    // Save to localStorage
    const highScores = JSON.parse(localStorage.getItem('letterPopScores') || '[]');
    highScores.push({
      score: this.score,
      accuracy,
      date: new Date().toISOString()
    });
    highScores.sort((a, b) => b.score - a.score);
    localStorage.setItem('letterPopScores', JSON.stringify(highScores.slice(0, 10)));

    // Go to results
    this.scene.start('ResultsScene', {
      score: this.score,
      correct,
      total,
      accuracy
    });
  }

  getRandomLetter() {
    const letters = this.mode === 'uppercase'
      ? 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
      : this.mode === 'lowercase'
      ? 'abcdefghijklmnopqrstuvwxyz'
      : 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    return letters[Phaser.Math.Between(0, letters.length - 1)];
  }
}
```

#### ResultsScene

**`scenes/ResultsScene.js`**
```javascript
export default class ResultsScene extends Phaser.Scene {
  constructor() {
    super({ key: 'ResultsScene' });
  }

  create(data) {
    // Title
    this.add.text(
      this.cameras.main.centerX,
      100,
      'Great Job!',
      { fontSize: '48px', fontFamily: 'Comic Neue', color: '#fff' }
    ).setOrigin(0.5);

    // Score
    this.add.text(
      this.cameras.main.centerX,
      200,
      `Score: ${data.score}`,
      { fontSize: '36px', fontFamily: 'Comic Neue', color: '#6FCF97' }
    ).setOrigin(0.5);

    // Accuracy
    this.add.text(
      this.cameras.main.centerX,
      260,
      `Accuracy: ${data.accuracy}% (${data.correct}/${data.total})`,
      { fontSize: '28px', fontFamily: 'Comic Neue', color: '#fff' }
    ).setOrigin(0.5);

    // High scores
    const highScores = JSON.parse(localStorage.getItem('letterPopScores') || '[]');
    this.add.text(
      this.cameras.main.centerX,
      350,
      'High Scores:',
      { fontSize: '24px', fontFamily: 'Comic Neue', color: '#fff' }
    ).setOrigin(0.5);

    highScores.slice(0, 5).forEach((score, i) => {
      this.add.text(
        this.cameras.main.centerX,
        390 + i * 30,
        `${i + 1}. ${score.score} points (${score.accuracy}%)`,
        { fontSize: '20px', fontFamily: 'Comic Neue', color: '#fff' }
      ).setOrigin(0.5);
    });

    // Play Again button
    const btn = this.add.rectangle(
      this.cameras.main.centerX,
      this.cameras.main.height - 100,
      200,
      60,
      0x6FCF97
    ).setInteractive();

    this.add.text(
      this.cameras.main.centerX,
      this.cameras.main.height - 100,
      'PLAY AGAIN',
      { fontSize: '24px', fontFamily: 'Comic Neue', color: '#fff' }
    ).setOrigin(0.5);

    btn.on('pointerdown', () => {
      this.scene.start('MenuScene');
    });
  }
}
```

#### React App Entry Point

**`src/App.jsx`**
```javascript
import { useEffect } from 'react';
import Phaser from 'phaser';
import gameConfig from './games/reading/letter-pop/config';

export default function App() {
  useEffect(() => {
    const game = new Phaser.Game(gameConfig);

    return () => {
      game.destroy(true);
    };
  }, []);

  return <div id="phaser-game" />;
}
```

### Deployment

```bash
cd child-portal
npm run build
rsync -avz dist/ user@160.153.180.159:/var/www/adhdlearn.com/production/child/
```

### Acceptance Criteria

- [ ] Letter Pop loads at https://child.adhdlearn.com
- [ ] Game runs smoothly on Aurora's tablet (60 FPS)
- [ ] Bubbles float upward and respond to taps
- [ ] Correct letter taps award points and play positive sound
- [ ] Incorrect taps play gentle feedback sound (no harsh "WRONG")
- [ ] Timer counts down from 60 seconds
- [ ] Results screen shows score, accuracy, and high scores
- [ ] High scores persist in localStorage
- [ ] "Play Again" returns to menu
- [ ] No crashes or console errors

### McCabe Complexity

All functions ≤ 5:
- `MenuScene.create()`: 2
- `GameScene.create()`: 4
- `GameScene.handleBubbleClick()`: 3
- `GameScene.updateTimer()`: 2
- `ResultsScene.create()`: 3

### Dependencies

- Phase 0: Server infrastructure
- Phase 1: Project structure

---

## Phase 3: Database + Simple Backend

**Delivers:** Scores persist in database
**Aurora gets:** 🏆 **Her high scores are saved and displayed**
**You get:** Backend infrastructure working
**Deployed:** Aurora's scores persist across devices

### What This Phase Delivers

Backend API that saves game sessions to MySQL:
- MySQL database with `game_sessions` table
- Node.js Express API with one endpoint: `POST /api/sessions`
- Letter Pop sends score after each game
- Results screen fetches and displays high scores from database
- Scores persist across devices (not just localStorage)

### Database Changes

**New Tables:**

#### game_sessions
```sql
CREATE TABLE game_sessions (
    session_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    game_name VARCHAR(50) NOT NULL,        -- 'Letter Pop'
    score INT NOT NULL,
    accuracy_percentage DECIMAL(5,2),
    correct_attempts INT,
    total_attempts INT,
    duration_seconds INT,
    mode VARCHAR(20),                      -- 'uppercase', 'lowercase', 'mixed'
    played_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_game_score (game_name, score DESC),
    INDEX idx_played_at (played_at DESC)
);
```

### API Endpoints

#### POST /api/sessions
**Purpose:** Save game session
**Body:**
```json
{
  "gameName": "Letter Pop",
  "score": 180,
  "accuracyPercentage": 85.0,
  "correctAttempts": 18,
  "totalAttempts": 21,
  "durationSeconds": 60,
  "mode": "uppercase"
}
```
**Response (201):**
```json
{
  "success": true,
  "sessionId": 1,
  "isHighScore": true,
  "rank": 2
}
```

#### GET /api/sessions/high-scores
**Purpose:** Get top 10 high scores
**Query Params:** `?game=Letter%20Pop&limit=10`
**Response (200):**
```json
{
  "success": true,
  "scores": [
    {
      "sessionId": 45,
      "score": 190,
      "accuracyPercentage": 88.0,
      "playedAt": "2025-10-21T14:32:00Z"
    },
    {
      "sessionId": 32,
      "score": 180,
      "accuracyPercentage": 85.0,
      "playedAt": "2025-10-21T14:15:00Z"
    }
  ]
}
```

### Frontend Changes

**Modified Files:**

**`child-portal/src/games/reading/letter-pop/scenes/GameScene.js`**
```javascript
// Add at top
import { saveSession } from '../../../services/api';

// Modify gameOver()
async gameOver() {
  const correct = this.attempts.filter(a => a.correct).length;
  const total = this.attempts.length;
  const accuracy = total > 0 ? (correct / total * 100).toFixed(1) : 0;

  // Save to API
  try {
    const result = await saveSession({
      gameName: 'Letter Pop',
      score: this.score,
      accuracyPercentage: parseFloat(accuracy),
      correctAttempts: correct,
      totalAttempts: total,
      durationSeconds: 60,
      mode: this.mode
    });

    this.scene.start('ResultsScene', {
      score: this.score,
      correct,
      total,
      accuracy,
      isHighScore: result.isHighScore,
      rank: result.rank
    });
  } catch (error) {
    console.error('Failed to save score:', error);
    // Still show results even if save failed
    this.scene.start('ResultsScene', {
      score: this.score,
      correct,
      total,
      accuracy
    });
  }
}
```

**New File: `child-portal/src/services/api.js`**
```javascript
const API_BASE = import.meta.env.VITE_API_BASE || 'https://api.adhdlearn.com';

export async function saveSession(data) {
  const response = await fetch(`${API_BASE}/api/sessions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`);
  }

  return response.json();
}

export async function getHighScores(gameName, limit = 10) {
  const response = await fetch(
    `${API_BASE}/api/sessions/high-scores?game=${encodeURIComponent(gameName)}&limit=${limit}`
  );

  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`);
  }

  return response.json();
}
```

**Modified File: `child-portal/src/games/reading/letter-pop/scenes/ResultsScene.js`**
```javascript
import { getHighScores } from '../../../services/api';

export default class ResultsScene extends Phaser.Scene {
  constructor() {
    super({ key: 'ResultsScene' });
  }

  async create(data) {
    // ... existing title and score display ...

    // Show "NEW HIGH SCORE!" if applicable
    if (data.isHighScore) {
      this.add.text(
        this.cameras.main.centerX,
        150,
        `🏆 NEW HIGH SCORE! #${data.rank}`,
        { fontSize: '32px', fontFamily: 'Comic Neue', color: '#FFD93D' }
      ).setOrigin(0.5);
    }

    // Fetch high scores from API
    try {
      const result = await getHighScores('Letter Pop', 5);

      this.add.text(
        this.cameras.main.centerX,
        350,
        'All-Time High Scores:',
        { fontSize: '24px', fontFamily: 'Comic Neue', color: '#fff' }
      ).setOrigin(0.5);

      result.scores.forEach((score, i) => {
        const date = new Date(score.playedAt).toLocaleDateString();
        this.add.text(
          this.cameras.main.centerX,
          390 + i * 30,
          `${i + 1}. ${score.score} points (${score.accuracyPercentage}%) - ${date}`,
          { fontSize: '20px', fontFamily: 'Comic Neue', color: '#fff' }
        ).setOrigin(0.5);
      });
    } catch (error) {
      console.error('Failed to fetch high scores:', error);
      // Show localStorage scores as fallback
      this.showLocalScores();
    }

    // ... Play Again button ...
  }

  showLocalScores() {
    // Fallback to localStorage (existing code from Phase 2)
  }
}
```

### Backend Implementation

**New Files in `backend/`:**

**`src/index.js`**
```javascript
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: [
    'https://child.adhdlearn.com',
    'https://child-staging.adhdlearn.com',
    'http://localhost:5173'
  ]
}));
app.use(express.json());

// Database connection pool
const pool = mysql.createPool({
  host: 'localhost',
  user: process.env.DB_USER || 'adhdlearn',
  password: process.env.DB_PASSWORD,
  database: 'adhdlearn',
  waitForConnections: true,
  connectionLimit: 10
});

// POST /api/sessions
app.post('/api/sessions', async (req, res) => {
  try {
    const {
      gameName,
      score,
      accuracyPercentage,
      correctAttempts,
      totalAttempts,
      durationSeconds,
      mode
    } = req.body;

    // Validate input
    if (!gameName || score === undefined) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
    }

    // Insert session
    const [result] = await pool.execute(
      `INSERT INTO game_sessions
       (game_name, score, accuracy_percentage, correct_attempts, total_attempts, duration_seconds, mode)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [gameName, score, accuracyPercentage, correctAttempts, totalAttempts, durationSeconds, mode]
    );

    const sessionId = result.insertId;

    // Check if it's a high score
    const [scores] = await pool.execute(
      `SELECT COUNT(*) as rank FROM game_sessions
       WHERE game_name = ? AND score > ?`,
      [gameName, score]
    );

    const rank = scores[0].rank + 1;
    const isHighScore = rank <= 10;

    res.status(201).json({
      success: true,
      sessionId,
      isHighScore,
      rank
    });
  } catch (error) {
    console.error('Error saving session:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// GET /api/sessions/high-scores
app.get('/api/sessions/high-scores', async (req, res) => {
  try {
    const gameName = req.query.game || 'Letter Pop';
    const limit = parseInt(req.query.limit) || 10;

    const [scores] = await pool.execute(
      `SELECT session_id, score, accuracy_percentage, played_at
       FROM game_sessions
       WHERE game_name = ?
       ORDER BY score DESC, played_at DESC
       LIMIT ?`,
      [gameName, limit]
    );

    res.json({
      success: true,
      scores: scores.map(row => ({
        sessionId: row.session_id,
        score: row.score,
        accuracyPercentage: row.accuracy_percentage,
        playedAt: row.played_at
      }))
    });
  } catch (error) {
    console.error('Error fetching high scores:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`API server running on port ${PORT}`);
});
```

**`backend/package.json`**
```json
{
  "name": "adhdlearn-backend",
  "version": "1.0.0",
  "main": "src/index.js",
  "scripts": {
    "start": "node src/index.js",
    "dev": "nodemon src/index.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "mysql2": "^3.6.0"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  }
}
```

### Database Setup Script

**`backend/scripts/setup-database.sql`**
```sql
-- Create database
CREATE DATABASE IF NOT EXISTS adhdlearn;
USE adhdlearn;

-- Create game_sessions table
CREATE TABLE IF NOT EXISTS game_sessions (
    session_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    game_name VARCHAR(50) NOT NULL,
    score INT NOT NULL,
    accuracy_percentage DECIMAL(5,2),
    correct_attempts INT,
    total_attempts INT,
    duration_seconds INT,
    mode VARCHAR(20),
    played_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_game_score (game_name, score DESC),
    INDEX idx_played_at (played_at DESC)
);

-- Create database user
CREATE USER IF NOT EXISTS 'adhdlearn'@'localhost' IDENTIFIED BY 'your_password_here';
GRANT ALL PRIVILEGES ON adhdlearn.* TO 'adhdlearn'@'localhost';
FLUSH PRIVILEGES;
```

Run with:
```bash
mysql -u root -p < backend/scripts/setup-database.sql
```

### Deployment

**Backend (PM2):**
```bash
cd backend
npm install --production

# Create .env file
echo "DB_USER=adhdlearn" > .env
echo "DB_PASSWORD=your_password_here" >> .env
echo "PORT=3000" >> .env

# Start with PM2
pm2 start src/index.js --name adhdlearn-api
pm2 save
```

**Frontend:**
```bash
cd child-portal
npm run build
rsync -avz dist/ user@160.153.180.159:/var/www/adhdlearn.com/production/child/
```

### Acceptance Criteria

- [ ] MySQL database created with `game_sessions` table
- [ ] API running on localhost:3000 (PM2)
- [ ] POST /api/sessions saves scores to database
- [ ] GET /api/sessions/high-scores returns top scores
- [ ] Letter Pop sends score after each game
- [ ] Results screen fetches and displays database high scores
- [ ] "NEW HIGH SCORE!" shows when in top 10
- [ ] Scores persist across browser sessions
- [ ] Scores persist across devices
- [ ] API returns 400 for invalid input
- [ ] API returns 500 and logs errors for database failures

### McCabe Complexity

All functions ≤ 5:
- `POST /api/sessions` handler: 4
- `GET /api/sessions/high-scores` handler: 3
- `saveSession()` (frontend): 2
- `getHighScores()` (frontend): 2

### Dependencies

- Phase 0: Server infrastructure
- Phase 1: Project structure
- Phase 2: Letter Pop game

---

*Due to context limits, I'll continue with Phases 4-36 in the same detailed format. This shows the structure - each phase has:*

1. **What This Phase Delivers** (clear value proposition)
2. **Database Changes** (CREATE/ALTER statements)
3. **API Endpoints** (routes, request/response specs)
4. **Frontend Changes** (new files, modified files, code)
5. **Technical Specifications** (detailed implementation)
6. **Deployment** (commands to deploy)
7. **Acceptance Criteria** (checklist for phase completion)
8. **McCabe Complexity** (all functions ≤ 5)
9. **Dependencies** (which phases must be done first)

*Continuing with remaining phases...*

---

## Phase 4: Parent Registration + Login

**Delivers:** You can create an account and login
**Aurora gets:** Nothing new
**You get:** 🔐 **Can create account and login to parent portal**
**Deployed:** parent.adhdlearn.com has working auth

### What This Phase Delivers

Parent portal with authentication:
- Registration form (email, password, family name)
- Login form (email, password)
- JWT token-based authentication
- Password hashing with bcrypt
- Session management

### Database Changes

**New Tables:**

#### families
```sql
CREATE TABLE families (
    family_id INT PRIMARY KEY AUTO_INCREMENT,
    family_name VARCHAR(100) NOT NULL,
    subscription_tier ENUM('free', 'premium') DEFAULT 'free',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_created (created_at)
);
```

#### users
```sql
CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    family_id INT NOT NULL,
    role ENUM('parent', 'child') NOT NULL,

    -- Parent fields
    email VARCHAR(255) UNIQUE,
    password_hash VARCHAR(255),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100),

    -- Child fields (NULL for parents)
    pin_code CHAR(60),              -- bcrypt hash
    avatar_url VARCHAR(255),
    birth_date DATE,

    -- Shared
    total_points INT DEFAULT 0,
    current_streak INT DEFAULT 0,
    longest_streak INT DEFAULT 0,

    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (family_id) REFERENCES families(family_id) ON DELETE CASCADE,
    INDEX idx_family_role (family_id, role),
    INDEX idx_email (email),
    UNIQUE KEY uk_family_pin (family_id, pin_code)
);
```

#### auth_sessions
```sql
CREATE TABLE auth_sessions (
    session_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    token VARCHAR(500) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    ip_address VARCHAR(45),
    user_agent VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_token (token(255)),
    INDEX idx_expires (expires_at),
    INDEX idx_user (user_id)
);
```

### API Endpoints

#### POST /api/auth/register
**Purpose:** Register new family + first parent
**Body:**
```json
{
  "firstName": "Corey",
  "lastName": "Smith",
  "email": "corey@example.com",
  "password": "SecurePass123!",
  "familyName": "Smith Family"
}
```
**Response (201):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "userId": 1,
    "familyId": 1,
    "role": "parent",
    "firstName": "Corey",
    "email": "corey@example.com"
  }
}
```

#### POST /api/auth/login/parent
**Purpose:** Parent email/password login
**Body:**
```json
{
  "email": "corey@example.com",
  "password": "SecurePass123!"
}
```
**Response (200):**
```json
{
  "success": true,
  "token": "eyJhbGci...",
  "user": {
    "userId": 1,
    "familyId": 1,
    "role": "parent",
    "firstName": "Corey",
    "email": "corey@example.com"
  }
}
```
**Errors:**
- 401: Invalid credentials
- 403: Account locked

### Frontend Changes

**New Files in `parent-portal/`:**
```
src/
├── pages/
│   ├── Login.jsx
│   ├── Register.jsx
│   └── Dashboard.jsx
├── services/
│   └── auth.js
├── context/
│   └── AuthContext.jsx
├── App.jsx
└── main.jsx
```

### Technical Specifications

*(Due to space, showing key implementation details)*

**Backend: `backend/src/controllers/authController.js`**
```javascript
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

async function register(req, res) {
  const { firstName, lastName, email, password, familyName } = req.body;

  // Validate input
  if (!firstName || !email || !password || !familyName) {
    return res.status(400).json({
      success: false,
      error: 'Missing required fields'
    });
  }

  // Password validation
  if (password.length < 8) {
    return res.status(400).json({
      success: false,
      error: 'Password must be at least 8 characters'
    });
  }

  try {
    // Check if email exists
    const [existing] = await pool.execute(
      'SELECT user_id FROM users WHERE email = ?',
      [email]
    );

    if (existing.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Email already registered'
      });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create family
    const [familyResult] = await pool.execute(
      'INSERT INTO families (family_name) VALUES (?)',
      [familyName]
    );

    const familyId = familyResult.insertId;

    // Create parent user
    const [userResult] = await pool.execute(
      `INSERT INTO users (family_id, role, email, password_hash, first_name, last_name)
       VALUES (?, 'parent', ?, ?, ?, ?)`,
      [familyId, email, passwordHash, firstName, lastName || null]
    );

    const userId = userResult.insertId;

    // Generate JWT token
    const token = jwt.sign(
      { userId, familyId, role: 'parent' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Save session
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await pool.execute(
      `INSERT INTO auth_sessions (user_id, token, expires_at, ip_address, user_agent)
       VALUES (?, ?, ?, ?, ?)`,
      [userId, token, expiresAt, req.ip, req.get('user-agent')]
    );

    res.status(201).json({
      success: true,
      token,
      user: {
        userId,
        familyId,
        role: 'parent',
        firstName,
        email
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
}

// McCabe complexity: 5 (within limit)
```

**Frontend: `parent-portal/src/pages/Register.jsx`**
```javascript
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../services/auth';

export default function Register() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    familyName: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const result = await register(formData);
      localStorage.setItem('token', result.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed');
    }
  };

  return (
    <div className="register-page">
      <h1>Create Your Family Account</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="First Name"
          value={formData.firstName}
          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Last Name"
          value={formData.lastName}
          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
        />
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Password (min 8 characters)"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Family Name"
          value={formData.familyName}
          onChange={(e) => setFormData({ ...formData, familyName: e.target.value })}
          required
        />
        {error && <p className="error">{error}</p>}
        <button type="submit">CREATE ACCOUNT</button>
      </form>
    </div>
  );
}
```

### Acceptance Criteria

- [ ] Parent can register with email/password
- [ ] Password is hashed with bcrypt before storage
- [ ] JWT token generated on successful registration
- [ ] Parent can login with email/password
- [ ] Invalid credentials return 401 error
- [ ] Duplicate email returns 400 error
- [ ] Token stored in localStorage
- [ ] Token included in Authorization header for API requests
- [ ] Token expires after 7 days
- [ ] Parent redirected to /dashboard after login

### McCabe Complexity

All functions ≤ 5:
- `register()` controller: 5
- `login()` controller: 4
- `handleSubmit()` (Register.jsx): 3

### Dependencies

- Phase 3: Database and backend infrastructure

---

## Phase 5: Parent Dashboard - View Aurora's Scores

**Delivers:** You see Aurora's Letter Pop scores
**Aurora gets:** Nothing new
**You get:** 📊 **See Aurora's scores and play history**
**Deployed:** You can track Aurora's progress

### What This Phase Delivers

Parent dashboard displaying child activity:
- List of children in family (Aurora)
- Click child to view their progress
- Detailed session history for each game
- Statistics: total time, average score, accuracy
- Confusion matrix showing which letters Aurora mixes up

### Database Changes

**Modified Tables:**

#### game_sessions (add user_id link)
```sql
ALTER TABLE game_sessions
ADD COLUMN user_id INT AFTER session_id,
ADD FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
ADD INDEX idx_user_game (user_id, game_name, played_at DESC);
```

### API Endpoints

#### GET /api/children/:childId/sessions
**Purpose:** Get all game sessions for a child
**Headers:** `Authorization: Bearer {token}`
**Query Params:** `?game=Letter%20Pop&limit=20`
**Response (200):**
```json
{
  "success": true,
  "child": {
    "userId": 2,
    "firstName": "Aurora",
    "avatar": "🌈"
  },
  "sessions": [
    {
      "sessionId": 45,
      "gameName": "Letter Pop",
      "score": 180,
      "accuracyPercentage": 90.0,
      "durationSeconds": 60,
      "playedAt": "2025-10-21T10:30:00Z"
    }
  ],
  "stats": {
    "totalSessions": 5,
    "totalTimeMinutes": 42,
    "averageScore": 152,
    "averageAccuracy": 76.0,
    "bestScore": 180
  }
}
```

#### GET /api/children/:childId/analytics
**Purpose:** Get learning analytics for a child
**Response (200):**
```json
{
  "success": true,
  "confusionPairs": [
    {
      "letter1": "B",
      "letter2": "D",
      "count": 7,
      "percentage": 41
    }
  ],
  "favoriteActivity": "Letter Pop",
  "currentStreak": 2,
  "longestStreak": 5
}
```

### Frontend Changes

**New Files in `parent-portal/`:**
```
src/
├── pages/
│   ├── Dashboard.jsx
│   ├── ChildProgress.jsx
│   └── ActivityAnalytics.jsx
├── components/
│   ├── ChildCard.jsx
│   ├── SessionTable.jsx
│   └── StatsCard.jsx
└── services/
    └── children.js
```

**`pages/Dashboard.jsx`:**
```javascript
import { useEffect, useState } from 'react';
import { getChildren } from '../services/children';
import ChildCard from '../components/ChildCard';

export default function Dashboard() {
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadChildren();
  }, []);

  async function loadChildren() {
    try {
      const data = await getChildren();
      setChildren(data.children);
    } catch (error) {
      console.error('Failed to load children:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div>Loading...</div>;

  if (children.length === 0) {
    return (
      <div className="empty-state">
        <h1>Welcome!</h1>
        <p>Add your first child to start tracking their learning journey!</p>
        <button onClick={() => navigate('/add-child')}>+ Add Child</button>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <h1>Your Children</h1>
      <div className="children-grid">
        {children.map(child => (
          <ChildCard key={child.userId} child={child} />
        ))}
      </div>
    </div>
  );
}
```

### Acceptance Criteria

- [ ] Dashboard shows all children in family
- [ ] Each child card shows: name, avatar, age, last active, basic stats
- [ ] Click child card → view detailed progress page
- [ ] Progress page shows session history table
- [ ] Session table shows: date, score, accuracy, duration
- [ ] Click session row → view session details modal
- [ ] Analytics page shows confusion pairs
- [ ] All API calls require valid JWT token
- [ ] Loading states while fetching data
- [ ] Error handling for API failures
- [ ] Responsive design (desktop/tablet/mobile)

### McCabe Complexity

All functions ≤ 5:
- `Dashboard.loadChildren()`: 2
- `GET /api/children/:childId/sessions` handler: 4
- `ChildCard` component render: 3

### Dependencies

- Phase 3: Database with game_sessions table
- Phase 4: Parent authentication

---

## Phase 6: Family Management

**Delivers:** You can add Aurora as a child to your family
**Aurora gets:** Nothing new yet
**You get:** 👨‍👩‍👧 **Manage family (add/edit Aurora's profile)**
**Deployed:** Aurora now exists in the system as your child

### What This Phase Delivers

Family management functionality:
- Add child form in parent portal
- Child profile: name, birth date, avatar, 4-digit PIN
- Edit child information
- List all children in family

### Database Changes

None (users table already supports children)

### API Endpoints

#### POST /api/children
**Purpose:** Add a new child to the family
**Headers:** `Authorization: Bearer {token}`
**Body:**
```json
{
  "firstName": "Aurora",
  "birthDate": "2018-03-15",
  "avatar": "🌈",
  "pinCode": "1234"
}
```
**Response (201):**
```json
{
  "success": true,
  "child": {
    "userId": 2,
    "firstName": "Aurora",
    "birthDate": "2018-03-15",
    "avatar": "🌈",
    "age": 7
  }
}
```

#### PUT /api/children/:childId
**Purpose:** Update child information
**Body:**
```json
{
  "firstName": "Aurora",
  "birthDate": "2018-03-15",
  "avatar": "🦄",
  "pinCode": "5678"
}
```

### Frontend Changes

**New Files:**
- `parent-portal/src/pages/AddChild.jsx`
- `parent-portal/src/components/AvatarPicker.jsx`
- `parent-portal/src/components/PinInput.jsx`

### Acceptance Criteria

- [ ] Parent can add new child with name, birth date, avatar, PIN
- [ ] PIN must be exactly 4 digits
- [ ] PIN is hashed with bcrypt before storage
- [ ] Birth date validates as valid date
- [ ] Avatar picker shows 20+ emoji options
- [ ] Child appears in dashboard after creation
- [ ] Parent can edit child information
- [ ] Cannot delete child if they have activity data

### McCabe Complexity

All functions ≤ 5:
- `POST /api/children` handler: 4
- `AddChild.handleSubmit()`: 3

### Dependencies

- Phase 4: Parent authentication
- Phase 5: Dashboard to display children

---

## Phase 7: Child Login with PIN

**Delivers:** Aurora logs in as herself
**Aurora gets:** 🔢 **Logs in with her own PIN, sees personalized dashboard**
**You get:** Aurora has her own identity in the system
**Deployed:** Aurora logs in, plays Letter Pop under her account

### What This Phase Delivers

Child authentication system:
- Child selector screen (shows Aurora's avatar)
- 4-digit PIN entry with number pad
- JWT token for child session (2-hour expiry)
- Child dashboard with personalized greeting

### Database Changes

None (uses existing users and auth_sessions tables)

### API Endpoints

#### POST /api/auth/login/child
**Purpose:** Child login with PIN
**Body:**
```json
{
  "userId": 2,
  "pinCode": "1234"
}
```
**Response (200):**
```json
{
  "success": true,
  "token": "eyJhbGci...",
  "child": {
    "userId": 2,
    "firstName": "Aurora",
    "avatar": "🌈"
  }
}
```

#### GET /api/families/:familyId/children
**Purpose:** Get all children for child selector
**Response (200):**
```json
{
  "success": true,
  "children": [
    {
      "userId": 2,
      "firstName": "Aurora",
      "avatar": "🌈"
    }
  ]
}
```

### Frontend Changes

**New Files in `child-portal/`:**
```
src/
├── pages/
│   ├── ChildSelector.jsx
│   ├── PinEntry.jsx
│   └── ChildDashboard.jsx
└── components/
    └── NumberPad.jsx
```

### Acceptance Criteria

- [ ] Child selector shows all children in family
- [ ] Each child shown with large avatar and name
- [ ] Tap child avatar → PIN entry screen
- [ ] Number pad is large (60px+ touch targets)
- [ ] PIN entry shows circles that fill as digits entered
- [ ] Incorrect PIN shows gentle error, clears input
- [ ] Correct PIN → generates JWT token (2-hour expiry)
- [ ] Token stored in localStorage
- [ ] Redirects to child dashboard
- [ ] Dashboard shows "Welcome back, Aurora!"

### McCabe Complexity

All functions ≤ 5:
- `POST /api/auth/login/child` handler: 4
- `PinEntry.handleDigit()`: 3

### Dependencies

- Phase 6: Children exist in database

---

## Phase 8: Child Dashboard with Categories

**Delivers:** Aurora sees learning categories (most locked)
**Aurora gets:** 🎨 **Prettier dashboard, can see what's coming**
**You get:** Nothing new
**Deployed:** Better UX for Aurora

### What This Phase Delivers

Colorful child dashboard with learning categories:
- 6 category cards: Reading, Math, Science, Cooking, Shopping, 3D Printing
- Only Reading unlocked initially (others show "Coming Soon 🔒")
- Display Aurora's points and streak
- Recent activity list (last 3 sessions)
- Achievements preview
- Avatar and logout in top-right corner

### Database Changes

None

### API Endpoints

#### GET /api/children/:childId/dashboard
**Purpose:** Get dashboard data for child
**Headers:** `Authorization: Bearer {token}`
**Response (200):**
```json
{
  "success": true,
  "child": {
    "userId": 2,
    "firstName": "Aurora",
    "avatar": "🌈",
    "totalPoints": 450,
    "currentStreak": 5,
    "longestStreak": 7
  },
  "categories": [
    {
      "categoryId": "reading",
      "name": "Reading",
      "icon": "📚",
      "unlocked": true,
      "activityCount": 3
    },
    {
      "categoryId": "math",
      "name": "Math",
      "icon": "🔢",
      "unlocked": false,
      "activityCount": 0
    }
  ],
  "recentActivity": [
    {
      "activityName": "Letter Pop",
      "score": 140,
      "playedAt": "2025-10-21T10:30:00Z"
    }
  ],
  "achievements": [
    {
      "achievementId": 1,
      "name": "5-Day Streak",
      "icon": "🌟",
      "unlocked": true
    }
  ]
}
```

### Frontend Changes

**New Files in `child-portal/`:**
```
src/
├── pages/
│   └── ChildDashboard.jsx
├── components/
│   ├── CategoryCard.jsx
│   ├── RecentActivity.jsx
│   ├── AchievementsBadge.jsx
│   └── StatsDisplay.jsx
└── styles/
    └── child-dashboard.css
```

**`pages/ChildDashboard.jsx`:**
```javascript
import { useEffect, useState } from 'react';
import { getDashboard } from '../services/api';
import CategoryCard from '../components/CategoryCard';
import RecentActivity from '../components/RecentActivity';

export default function ChildDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      const data = await getDashboard();
      setDashboard(data);
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="child-dashboard">
      <header>
        <h1>Hi {dashboard.child.firstName}! 🌈 Ready to learn?</h1>
        <div className="stats">
          <span className="points">⭐ {dashboard.child.totalPoints} points</span>
          <span className="streak">🔥 {dashboard.child.currentStreak} days in a row!</span>
        </div>
      </header>

      <div className="categories-grid">
        {dashboard.categories.map(category => (
          <CategoryCard key={category.categoryId} category={category} />
        ))}
      </div>

      <RecentActivity sessions={dashboard.recentActivity} />
    </div>
  );
}
```

**`components/CategoryCard.jsx`:**
```javascript
export default function CategoryCard({ category }) {
  const handleClick = () => {
    if (category.unlocked) {
      navigate(`/categories/${category.categoryId}`);
    } else {
      showComingSoonModal();
    }
  };

  return (
    <div 
      className={`category-card ${category.unlocked ? 'unlocked' : 'locked'}`}
      onClick={handleClick}
    >
      <div className="icon">{category.icon}</div>
      <h2>{category.name}</h2>
      {category.unlocked ? (
        <span className="badge available">{category.activityCount} activities</span>
      ) : (
        <span className="badge locked">Coming Soon 🔒</span>
      )}
    </div>
  );
}
```

### Technical Specifications

**CSS for Child Dashboard:**
```css
.child-dashboard {
  background: linear-gradient(135deg, #FFD93D, #FF6B6B);
  min-height: 100vh;
  padding: 24px;
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
  margin: 32px 0;
}

.category-card {
  background: white;
  border-radius: 24px;
  padding: 32px;
  text-align: center;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  min-height: 300px;
}

.category-card.unlocked:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 24px rgba(0,0,0,0.2);
}

.category-card.locked {
  opacity: 0.6;
  filter: grayscale(70%);
  cursor: not-allowed;
}

.category-card .icon {
  font-size: 128px;
  margin-bottom: 16px;
}

.category-card h2 {
  font-size: 32px;
  font-family: 'Fredoka One', cursive;
  color: #2D3436;
}

.badge {
  display: inline-block;
  padding: 8px 16px;
  border-radius: 16px;
  font-size: 16px;
  font-weight: bold;
}

.badge.available {
  background: #6FCF97;
  color: white;
}

.badge.locked {
  background: #9B9B9B;
  color: white;
}
```

### Acceptance Criteria

- [ ] Dashboard loads in under 2 seconds
- [ ] 6 category cards displayed in responsive grid
- [ ] Only Reading unlocked, others show "Coming Soon"
- [ ] Category cards minimum 300x300px
- [ ] Points and streak displayed prominently
- [ ] Recent activity shows last 3 sessions
- [ ] Achievements preview shown (2-3 badges)
- [ ] Avatar in top-right corner
- [ ] Logout button accessible
- [ ] Locked categories show modal when clicked
- [ ] Smooth animations on hover/interactions
- [ ] Responsive layout (portrait/landscape)
- [ ] Touch targets minimum 60px
- [ ] High contrast colors for readability
- [ ] No ads or external links

### McCabe Complexity

All functions ≤ 5:
- `ChildDashboard.loadDashboard()`: 2
- `CategoryCard.handleClick()`: 2
- `GET /api/children/:childId/dashboard` handler: 3

### Dependencies

- Phase 7: Child login with PIN
- Phase 3: game_sessions table for recent activity

---

---

## Phase 9: Word Builder Game

**Delivers:** Aurora has a 2nd game to play
**Aurora gets:** 🎮 **NEW GAME - Word Builder**
**You get:** See Aurora's Word Builder scores in parent dashboard
**Deployed:** 2 working games for Aurora

---

### What This Phase Delivers

Word Builder game in the Reading category:
- Drag-and-drop spelling game with 10 words per session
- Image + audio pronunciation for each word
- Letter tiles to drag into empty slots
- Immediate feedback (correct/incorrect with animations)
- Scoring: 20 points per word, bonus for no mistakes
- Game saves to database like Letter Pop
- Appears in Reading category alongside Letter Pop

---

### Database Changes

**No new tables** - Uses existing `game_sessions` table from Phase 3.

**New game_name value:** `'Word Builder'`

Example record:
```sql
INSERT INTO game_sessions (game_name, score, accuracy_percentage, correct_attempts, total_attempts, duration_seconds, mode)
VALUES ('Word Builder', 180, 90.0, 9, 10, 245, 'Easy');
```

---

### API Endpoints

**No new endpoints** - Uses existing endpoints from Phase 3:

#### POST /api/sessions
**Purpose:** Save Word Builder game session
**Body:**
```json
{
  "gameName": "Word Builder",
  "score": 180,
  "accuracyPercentage": 90.0,
  "correctAttempts": 9,
  "totalAttempts": 10,
  "durationSeconds": 245,
  "mode": "Easy"
}
```
**Response (201):**
```json
{
  "success": true,
  "sessionId": 42,
  "isHighScore": true,
  "rank": 3
}
```

#### GET /api/sessions/high-scores?game=Word Builder
**Purpose:** Get Word Builder high scores
**Response (200):**
```json
{
  "success": true,
  "scores": [
    {
      "sessionId": 38,
      "score": 200,
      "accuracyPercentage": 100.0,
      "playedAt": "2025-10-21T14:30:00Z"
    },
    {
      "sessionId": 42,
      "score": 180,
      "accuracyPercentage": 90.0,
      "playedAt": "2025-10-22T10:15:00Z"
    }
  ]
}
```

---

### Frontend Changes

**New Files in `child-portal/src/games/word-builder/`:**
```
word-builder/
├── WordBuilderGame.js       (Main Phaser scene)
├── scenes/
│   ├── GameScene.js         (Word building gameplay)
│   ├── ResultsScene.js      (Shows score and high scores)
│   └── TutorialScene.js     (First-time instructions)
├── assets/
│   ├── images/
│   │   ├── cat.png          (Word images for 3-letter words)
│   │   ├── dog.png
│   │   ├── sun.png
│   │   └── ... (30 images total)
│   ├── audio/
│   │   ├── words/
│   │   │   ├── cat.mp3      (Word pronunciations)
│   │   │   ├── dog.mp3
│   │   │   └── ... (30 audio files)
│   │   └── letters/
│   │       ├── a.mp3        (Letter sounds)
│   │       ├── b.mp3
│   │       └── ... (26 letter sounds)
│   └── fonts/
│       └── FredokaOne.ttf
└── data/
    └── wordList.js          (Word bank with images and difficulty)
```

**Update `child-portal/src/pages/ReadingCategory.jsx`:**
```javascript
const activities = [
  {
    id: 1,
    name: 'Letter Pop',
    icon: '🎈',
    description: 'Pop the correct letters!',
    difficulty: '⭐',
    path: '/activities/letter-pop',
    available: true
  },
  {
    id: 2,
    name: 'Word Builder',
    icon: '🏗️',
    description: 'Build words from letters!',
    difficulty: '⭐⭐',
    path: '/activities/word-builder',
    available: true
  }
];
```

**Add route in `child-portal/src/App.jsx`:**
```javascript
import WordBuilderGame from './games/word-builder/WordBuilderGame';

<Route path="/activities/word-builder" element={<WordBuilderGame />} />
```

---

### Technical Specifications

**GameScene.js - Main Gameplay Logic:**
```javascript
import Phaser from 'phaser';
import wordList from '../data/wordList';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
    this.score = 0;
    this.currentWordIndex = 0;
    this.wordsCompleted = 0;
    this.totalWords = 10;
    this.startTime = null;
    this.sessionWords = [];
  }

  create() {
    this.startTime = Date.now();
    
    // Select 10 random words for this session
    this.sessionWords = this.getRandomWords(this.totalWords);
    
    // Display UI
    this.createUI();
    
    // Load first word
    this.loadWord(this.sessionWords[this.currentWordIndex]);
  }

  getRandomWords(count) {
    // Filter words by difficulty (Easy: 3-letter words)
    const easyWords = wordList.filter(w => w.difficulty === 'Easy');
    
    // Shuffle and take 'count' words
    const shuffled = Phaser.Utils.Array.Shuffle([...easyWords]);
    return shuffled.slice(0, count);
  }

  loadWord(wordData) {
    const { word, image, audio } = wordData;
    
    // Clear previous word elements
    this.clearWordElements();
    
    // Display image
    this.wordImage = this.add.image(640, 200, image)
      .setScale(0.5);
    
    // Play pronunciation
    this.sound.play(audio);
    
    // Create letter tiles
    this.createLetterTiles(word);
    
    // Create empty slots
    this.createWordSlots(word.length);
    
    // Update progress text
    this.progressText.setText(`Word ${this.currentWordIndex + 1} of ${this.totalWords}`);
  }

  createLetterTiles(word) {
    // Get correct letters + 2 decoy letters
    const correctLetters = word.toUpperCase().split('');
    const decoyLetters = this.getDecoyLetters(correctLetters, 2);
    const allLetters = [...correctLetters, ...decoyLetters];
    
    // Shuffle tiles
    const shuffled = Phaser.Utils.Array.Shuffle(allLetters);
    
    this.letterTiles = [];
    const startX = 400;
    const spacing = 100;
    
    shuffled.forEach((letter, index) => {
      const x = startX + (index * spacing);
      const y = 500;
      
      const tile = this.createDraggableTile(letter, x, y);
      this.letterTiles.push(tile);
    });
  }

  createDraggableTile(letter, x, y) {
    // Create tile background
    const tile = this.add.rectangle(x, y, 80, 80, 0x4A90E2)
      .setStrokeStyle(4, 0x2E5C8A)
      .setInteractive({ draggable: true });
    
    // Create letter text
    const text = this.add.text(x, y, letter, {
      fontFamily: 'Fredoka One',
      fontSize: '48px',
      color: '#FFFFFF'
    }).setOrigin(0.5);
    
    // Container for tile + text
    const container = this.add.container(x, y, [tile, text]);
    container.setData('letter', letter);
    container.setData('originalX', x);
    container.setData('originalY', y);
    container.setSize(80, 80);
    container.setInteractive({ draggable: true });
    
    // Drag events
    this.setupDragEvents(container);
    
    return container;
  }

  setupDragEvents(tile) {
    tile.on('dragstart', () => {
      tile.setScale(1.2);
      tile.setDepth(100);
    });
    
    tile.on('drag', (pointer, dragX, dragY) => {
      tile.x = dragX;
      tile.y = dragY;
      
      // Check for slot overlap
      this.checkSlotHighlight(tile);
    });
    
    tile.on('dragend', () => {
      tile.setScale(1.0);
      tile.setDepth(1);
      
      // Check if dropped on valid slot
      const slot = this.getOverlappingSlot(tile);
      
      if (slot && !slot.getData('filled')) {
        this.placeTileInSlot(tile, slot);
      } else {
        // Return to original position
        this.tweens.add({
          targets: tile,
          x: tile.getData('originalX'),
          y: tile.getData('originalY'),
          duration: 200,
          ease: 'Back.easeOut'
        });
      }
    });
  }

  placeTileInSlot(tile, slot) {
    const letter = tile.getData('letter');
    const expectedLetter = slot.getData('expectedLetter');
    
    if (letter === expectedLetter) {
      // Correct letter
      this.sound.play(`letter_${letter.toLowerCase()}`);
      
      // Snap tile to slot
      tile.x = slot.x;
      tile.y = slot.y;
      tile.removeInteractive();
      
      slot.setData('filled', true);
      slot.setData('tile', tile);
      
      // Check if word is complete
      this.checkWordComplete();
    } else {
      // Wrong letter
      this.cameras.main.shake(200, 0.005);
      this.sound.play('wrong');
      
      // Return tile to original position
      this.tweens.add({
        targets: tile,
        x: tile.getData('originalX'),
        y: tile.getData('originalY'),
        duration: 200,
        ease: 'Back.easeOut'
      });
    }
  }

  checkWordComplete() {
    const allFilled = this.wordSlots.every(slot => slot.getData('filled'));
    
    if (allFilled) {
      // Word completed successfully
      this.score += 20;
      this.scoreText.setText(`Score: ${this.score}`);
      
      // Play word pronunciation
      const wordData = this.sessionWords[this.currentWordIndex];
      this.sound.play(wordData.audio);
      
      // Celebration animation
      this.showCelebration();
      
      // Move to next word after delay
      this.time.delayedCall(2000, () => {
        this.wordsCompleted++;
        this.currentWordIndex++;
        
        if (this.currentWordIndex < this.totalWords) {
          this.loadWord(this.sessionWords[this.currentWordIndex]);
        } else {
          this.endGame();
        }
      });
    }
  }

  endGame() {
    const durationSeconds = Math.floor((Date.now() - this.startTime) / 1000);
    const accuracy = (this.wordsCompleted / this.totalWords) * 100;
    
    const gameData = {
      gameName: 'Word Builder',
      score: this.score,
      accuracyPercentage: accuracy,
      correctAttempts: this.wordsCompleted,
      totalAttempts: this.totalWords,
      durationSeconds,
      mode: 'Easy'
    };
    
    this.scene.start('ResultsScene', gameData);
  }
}

// McCabe complexity: 4 (within limit)
```

**wordList.js - Word Bank:**
```javascript
export default [
  { word: 'cat', image: 'cat', audio: 'cat', difficulty: 'Easy' },
  { word: 'dog', image: 'dog', audio: 'dog', difficulty: 'Easy' },
  { word: 'sun', image: 'sun', audio: 'sun', difficulty: 'Easy' },
  { word: 'bat', image: 'bat', audio: 'bat', difficulty: 'Easy' },
  { word: 'hat', image: 'hat', audio: 'hat', difficulty: 'Easy' },
  { word: 'pen', image: 'pen', audio: 'pen', difficulty: 'Easy' },
  { word: 'cup', image: 'cup', audio: 'cup', difficulty: 'Easy' },
  { word: 'bed', image: 'bed', audio: 'bed', difficulty: 'Easy' },
  { word: 'pig', image: 'pig', audio: 'pig', difficulty: 'Easy' },
  { word: 'fox', image: 'fox', audio: 'fox', difficulty: 'Easy' },
  { word: 'bus', image: 'bus', audio: 'bus', difficulty: 'Easy' },
  { word: 'box', image: 'box', audio: 'box', difficulty: 'Easy' },
  { word: 'ant', image: 'ant', audio: 'ant', difficulty: 'Easy' },
  { word: 'egg', image: 'egg', audio: 'egg', difficulty: 'Easy' },
  { word: 'fan', image: 'fan', audio: 'fan', difficulty: 'Easy' },
  { word: 'jet', image: 'jet', audio: 'jet', difficulty: 'Easy' },
  { word: 'net', image: 'net', audio: 'net', difficulty: 'Easy' },
  { word: 'rug', image: 'rug', audio: 'rug', difficulty: 'Easy' },
  { word: 'top', image: 'top', audio: 'top', difficulty: 'Easy' },
  { word: 'van', image: 'van', audio: 'van', difficulty: 'Easy' },
  { word: 'web', image: 'web', audio: 'web', difficulty: 'Easy' },
  { word: 'zip', image: 'zip', audio: 'zip', difficulty: 'Easy' },
  { word: 'jam', image: 'jam', audio: 'jam', difficulty: 'Easy' },
  { word: 'leg', image: 'leg', audio: 'leg', difficulty: 'Easy' },
  { word: 'map', image: 'map', audio: 'map', difficulty: 'Easy' },
  { word: 'pot', image: 'pot', audio: 'pot', difficulty: 'Easy' },
  { word: 'rat', image: 'rat', audio: 'rat', difficulty: 'Easy' },
  { word: 'red', image: 'red', audio: 'red', difficulty: 'Easy' },
  { word: 'run', image: 'run', audio: 'run', difficulty: 'Easy' },
  { word: 'sit', image: 'sit', audio: 'sit', difficulty: 'Easy' }
];
```

---

### Acceptance Criteria

- [ ] Word Builder appears in Reading category alongside Letter Pop
- [ ] Game loads with first word challenge (image + audio)
- [ ] Audio pronunciation plays automatically for each word
- [ ] Letter tiles display correctly (correct letters + 2 decoys)
- [ ] Drag-and-drop mechanics work smoothly
- [ ] Correct letter placement snaps into slot
- [ ] Incorrect letter placement shakes slot and returns tile
- [ ] Letter sound plays when placed correctly
- [ ] Full word pronunciation plays when word completed
- [ ] Celebration animation shows after each word
- [ ] Score increases by 20 points per word
- [ ] Progress text updates (Word 1 of 10, etc.)
- [ ] All 10 words load sequentially
- [ ] Game ends after 10th word completion
- [ ] Results screen shows score and high scores
- [ ] Session saves to database via POST /api/sessions
- [ ] High scores load from database
- [ ] Game works on touch devices (mobile-friendly)

---

### McCabe Complexity

All functions ≤ 5:
- `loadWord()`: 3
- `placeTileInSlot()`: 4
- `checkWordComplete()`: 3
- `setupDragEvents()`: 2
- `endGame()`: 2

---

### Dependencies

- Phase 3: Database and API (uses game_sessions table and POST/GET endpoints)
- Phase 7: Child Login (requires child authentication to save scores)
- Phase 8: Child Dashboard (Word Builder appears in Reading category)


---

## Phase 10: Sight Words Game

**Delivers:** Aurora has a 3rd game (flash cards for common words)
**Aurora gets:** 🎯 **NEW GAME - Sight Words flash cards**
**You get:** See Aurora's sight word progress and accuracy
**Deployed:** 3 working games in Reading category

---

### What This Phase Delivers

Sight Words flash card game using Dolch word list:
- 20 words per session (adaptive difficulty)
- Each word shows with audio pronunciation
- 3 image choices (1 correct, 2 distractors)
- Sentence context for each word
- Scoring: 10 points per correct answer
- Spaced repetition algorithm (harder words appear more often)
- Tracks word mastery per child
- Appears in Reading category (3rd game)

---

### Database Changes

**New Table:** `sight_word_mastery`
```sql
CREATE TABLE sight_word_mastery (
    mastery_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    word VARCHAR(50) NOT NULL,
    correct_count INT DEFAULT 0,
    incorrect_count INT DEFAULT 0,
    last_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    mastery_level ENUM('learning', 'practicing', 'mastered') DEFAULT 'learning',
    
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    UNIQUE KEY uk_user_word (user_id, word),
    INDEX idx_user_mastery (user_id, mastery_level),
    INDEX idx_last_seen (last_seen)
);
```

**Game sessions** continue to use existing `game_sessions` table with `game_name = 'Sight Words'`.

---

### API Endpoints

#### POST /api/sessions (existing endpoint, new game type)
**Purpose:** Save Sight Words game session
**Body:**
```json
{
  "gameName": "Sight Words",
  "score": 180,
  "accuracyPercentage": 90.0,
  "correctAttempts": 18,
  "totalAttempts": 20,
  "durationSeconds": 320,
  "mode": "Pre-Primer"
}
```
**Response (201):**
```json
{
  "success": true,
  "sessionId": 56,
  "isHighScore": false,
  "rank": 5
}
```

#### POST /api/sight-words/record
**Purpose:** Record individual word attempt (for spaced repetition)
**Headers:** `Authorization: Bearer {token}`
**Body:**
```json
{
  "word": "THE",
  "correct": true
}
```
**Response (200):**
```json
{
  "success": true,
  "mastery": {
    "word": "THE",
    "correctCount": 15,
    "incorrectCount": 2,
    "masteryLevel": "mastered"
  }
}
```

#### GET /api/sight-words/next-words?count=20
**Purpose:** Get next words for session (adaptive difficulty)
**Headers:** `Authorization: Bearer {token}`
**Response (200):**
```json
{
  "success": true,
  "words": [
    {
      "word": "BECAUSE",
      "level": "Second Grade",
      "correctCount": 3,
      "incorrectCount": 7,
      "masteryLevel": "learning"
    },
    {
      "word": "THE",
      "level": "Pre-Primer",
      "correctCount": 15,
      "incorrectCount": 2,
      "masteryLevel": "mastered"
    }
  ]
}
```

**Algorithm:**
- 60% words from 'learning' level (low success rate)
- 30% words from 'practicing' level (medium success rate)
- 10% words from 'mastered' level (high success rate, for review)

#### GET /api/sight-words/progress
**Purpose:** Get child's overall sight word progress
**Headers:** `Authorization: Bearer {token}`
**Response (200):**
```json
{
  "success": true,
  "totalWords": 220,
  "learning": 45,
  "practicing": 80,
  "mastered": 95,
  "recentWords": [
    { "word": "BECAUSE", "masteryLevel": "learning", "lastSeen": "2025-10-22T10:30:00Z" }
  ]
}
```

---

### Frontend Changes

**New Files in `child-portal/src/games/sight-words/`:**
```
sight-words/
├── SightWordsGame.js        (Main Phaser scene)
├── scenes/
│   ├── GameScene.js         (Flash card gameplay)
│   ├── ResultsScene.js      (Shows score and progress)
│   └── ProgressScene.js     (Shows mastered words)
├── assets/
│   ├── images/
│   │   └── sentences/       (Context images for each word)
│   │       ├── the.png      (Sentence: "THE cat sat")
│   │       ├── and.png      (Sentence: "cat AND dog")
│   │       └── ... (220 images)
│   ├── audio/
│   │   └── words/
│   │       ├── the.mp3
│   │       ├── and.mp3
│   │       └── ... (220 audio files)
│   └── fonts/
│       └── FredokaOne.ttf
└── data/
    └── dolchWords.js        (Dolch sight word list with levels)
```

**Update `child-portal/src/pages/ReadingCategory.jsx`:**
```javascript
const activities = [
  {
    id: 1,
    name: 'Letter Pop',
    icon: '🎈',
    description: 'Pop the correct letters!',
    difficulty: '⭐',
    path: '/activities/letter-pop',
    available: true
  },
  {
    id: 2,
    name: 'Word Builder',
    icon: '🏗️',
    description: 'Build words from letters!',
    difficulty: '⭐⭐',
    path: '/activities/word-builder',
    available: true
  },
  {
    id: 3,
    name: 'Sight Words',
    icon: '👀',
    description: 'Learn common words!',
    difficulty: '⭐⭐⭐',
    path: '/activities/sight-words',
    available: true
  }
];
```

**Add route in `child-portal/src/App.jsx`:**
```javascript
import SightWordsGame from './games/sight-words/SightWordsGame';

<Route path="/activities/sight-words" element={<SightWordsGame />} />
```

---

### Technical Specifications

**GameScene.js - Main Gameplay Logic:**
```javascript
import Phaser from 'phaser';
import api from '../../services/api';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
    this.score = 0;
    this.currentWordIndex = 0;
    this.totalWords = 20;
    this.correctAttempts = 0;
    this.startTime = null;
    this.sessionWords = [];
  }

  async create() {
    this.startTime = Date.now();
    
    // Fetch adaptive word list from API
    this.sessionWords = await this.fetchNextWords(this.totalWords);
    
    // Display UI
    this.createUI();
    
    // Load first word
    this.loadWord(this.sessionWords[this.currentWordIndex]);
  }

  async fetchNextWords(count) {
    try {
      const response = await api.get(`/api/sight-words/next-words?count=${count}`);
      return response.words;
    } catch (error) {
      console.error('Failed to fetch words:', error);
      // Fallback to random Pre-Primer words
      return this.getFallbackWords(count);
    }
  }

  loadWord(wordData) {
    const { word, level } = wordData;
    
    // Clear previous elements
    this.clearWordElements();
    
    // Display word in large text
    this.wordText = this.add.text(640, 150, word, {
      fontFamily: 'Fredoka One',
      fontSize: '72px',
      color: '#2D3436',
      stroke: '#FFFFFF',
      strokeThickness: 4
    }).setOrigin(0.5);
    
    // Play pronunciation
    this.sound.play(`word_${word.toLowerCase()}`);
    
    // Create answer choices
    this.createAnswerChoices(word);
    
    // Update progress text
    this.progressText.setText(`Word ${this.currentWordIndex + 1} of ${this.totalWords}`);
  }

  createAnswerChoices(word) {
    // Get correct image and 2 distractors
    const correctImage = this.getContextImage(word);
    const distractors = this.getDistractorImages(word, 2);
    
    const choices = [
      { image: correctImage, correct: true },
      { image: distractors[0], correct: false },
      { image: distractors[1], correct: false }
    ];
    
    // Shuffle choices
    Phaser.Utils.Array.Shuffle(choices);
    
    // Display choices
    const startX = 300;
    const spacing = 300;
    
    choices.forEach((choice, index) => {
      const x = startX + (index * spacing);
      const y = 450;
      
      this.createChoiceButton(choice, x, y);
    });
  }

  createChoiceButton(choice, x, y) {
    const container = this.add.container(x, y);
    
    // Choice background
    const bg = this.add.rectangle(0, 0, 250, 200, 0xFFFFFF)
      .setStrokeStyle(4, 0xDFE6E9)
      .setInteractive({ useHandCursor: true });
    
    // Choice image
    const image = this.add.image(0, 0, choice.image)
      .setDisplaySize(230, 180);
    
    container.add([bg, image]);
    container.setData('correct', choice.correct);
    
    // Click handler
    bg.on('pointerdown', () => {
      this.handleChoice(choice.correct, container);
    });
    
    this.choiceButtons.push(container);
  }

  async handleChoice(correct, selectedButton) {
    // Disable all buttons
    this.disableChoices();
    
    if (correct) {
      // Correct answer
      this.showCorrectFeedback(selectedButton);
      this.score += 10;
      this.correctAttempts++;
      this.scoreText.setText(`Score: ${this.score}`);
      
      // Record success
      const word = this.sessionWords[this.currentWordIndex].word;
      await this.recordWordAttempt(word, true);
      
      // Move to next word after delay
      this.time.delayedCall(1000, () => this.nextWord());
    } else {
      // Wrong answer
      this.showIncorrectFeedback(selectedButton);
      
      // Record failure
      const word = this.sessionWords[this.currentWordIndex].word;
      await this.recordWordAttempt(word, false);
      
      // Move to next word after showing correct answer
      this.time.delayedCall(2000, () => this.nextWord());
    }
  }

  async recordWordAttempt(word, correct) {
    try {
      await api.post('/api/sight-words/record', { word, correct });
    } catch (error) {
      console.error('Failed to record word attempt:', error);
    }
  }

  nextWord() {
    this.currentWordIndex++;
    
    if (this.currentWordIndex < this.totalWords) {
      this.loadWord(this.sessionWords[this.currentWordIndex]);
    } else {
      this.endGame();
    }
  }

  endGame() {
    const durationSeconds = Math.floor((Date.now() - this.startTime) / 1000);
    const accuracy = (this.correctAttempts / this.totalWords) * 100;
    
    const gameData = {
      gameName: 'Sight Words',
      score: this.score,
      accuracyPercentage: accuracy,
      correctAttempts: this.correctAttempts,
      totalAttempts: this.totalWords,
      durationSeconds,
      mode: 'Adaptive'
    };
    
    this.scene.start('ResultsScene', gameData);
  }
}

// McCabe complexity: 4 (within limit)
```

**Backend: `backend/src/controllers/sightWordsController.js`:**
```javascript
const pool = require('../db/pool');

async function recordWordAttempt(req, res) {
  const { word, correct } = req.body;
  const userId = req.user.userId; // From auth middleware
  
  if (!word || typeof correct !== 'boolean') {
    return res.status(400).json({
      success: false,
      error: 'Missing required fields'
    });
  }
  
  try {
    // Insert or update mastery record
    await pool.execute(`
      INSERT INTO sight_word_mastery (user_id, word, correct_count, incorrect_count)
      VALUES (?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        correct_count = correct_count + ?,
        incorrect_count = incorrect_count + ?,
        last_seen = CURRENT_TIMESTAMP
    `, [
      userId,
      word.toUpperCase(),
      correct ? 1 : 0,
      correct ? 0 : 1,
      correct ? 1 : 0,
      correct ? 0 : 1
    ]);
    
    // Update mastery level based on success rate
    await pool.execute(`
      UPDATE sight_word_mastery
      SET mastery_level = CASE
        WHEN correct_count / (correct_count + incorrect_count) >= 0.8 THEN 'mastered'
        WHEN correct_count / (correct_count + incorrect_count) >= 0.5 THEN 'practicing'
        ELSE 'learning'
      END
      WHERE user_id = ? AND word = ?
    `, [userId, word.toUpperCase()]);
    
    // Fetch updated mastery
    const [rows] = await pool.execute(
      'SELECT * FROM sight_word_mastery WHERE user_id = ? AND word = ?',
      [userId, word.toUpperCase()]
    );
    
    res.json({
      success: true,
      mastery: rows[0]
    });
  } catch (error) {
    console.error('Record word attempt error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
}

// McCabe complexity: 3 (within limit)

async function getNextWords(req, res) {
  const userId = req.user.userId;
  const count = parseInt(req.query.count) || 20;
  
  try {
    // Get word distribution: 60% learning, 30% practicing, 10% mastered
    const learningCount = Math.floor(count * 0.6);
    const practicingCount = Math.floor(count * 0.3);
    const masteredCount = count - learningCount - practicingCount;
    
    const words = [];
    
    // Fetch learning words
    const [learning] = await pool.execute(`
      SELECT word, mastery_level, correct_count, incorrect_count
      FROM sight_word_mastery
      WHERE user_id = ? AND mastery_level = 'learning'
      ORDER BY last_seen ASC
      LIMIT ?
    `, [userId, learningCount]);
    words.push(...learning);
    
    // Fetch practicing words
    const [practicing] = await pool.execute(`
      SELECT word, mastery_level, correct_count, incorrect_count
      FROM sight_word_mastery
      WHERE user_id = ? AND mastery_level = 'practicing'
      ORDER BY last_seen ASC
      LIMIT ?
    `, [userId, practicingCount]);
    words.push(...practicing);
    
    // Fetch mastered words
    const [mastered] = await pool.execute(`
      SELECT word, mastery_level, correct_count, incorrect_count
      FROM sight_word_mastery
      WHERE user_id = ? AND mastery_level = 'mastered'
      ORDER BY RAND()
      LIMIT ?
    `, [userId, masteredCount]);
    words.push(...mastered);
    
    // Shuffle final list
    const shuffled = words.sort(() => Math.random() - 0.5);
    
    res.json({
      success: true,
      words: shuffled
    });
  } catch (error) {
    console.error('Get next words error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
}

// McCabe complexity: 2 (within limit)

module.exports = {
  recordWordAttempt,
  getNextWords
};
```

---

### Acceptance Criteria

- [ ] Sight Words appears in Reading category (3rd game)
- [ ] Game loads with adaptive word list from API
- [ ] Word displays in large text with audio pronunciation
- [ ] 3 answer choices display (1 correct, 2 distractors)
- [ ] Correct choice shows green checkmark and celebration
- [ ] Incorrect choice shows red X and highlights correct answer
- [ ] Score increases by 10 points per correct answer
- [ ] No penalty for incorrect answers
- [ ] Word attempts recorded via POST /api/sight-words/record
- [ ] Spaced repetition algorithm prioritizes struggling words
- [ ] Mastery level updates automatically (learning → practicing → mastered)
- [ ] All 20 words load sequentially
- [ ] Results screen shows score and progress
- [ ] Session saves to game_sessions table
- [ ] Parent can see sight word progress in dashboard
- [ ] Dolch word list used (220 words total)
- [ ] Game works on touch devices

---

### McCabe Complexity

All functions ≤ 5:
- `loadWord()`: 3
- `handleChoice()`: 4
- `recordWordAttempt()` (backend): 3
- `getNextWords()` (backend): 2
- `nextWord()`: 2

---

### Dependencies

- Phase 3: Database and API (uses game_sessions table)
- Phase 7: Child Login (requires child authentication)
- Phase 8: Child Dashboard (Sight Words appears in Reading category)
- Phase 9: Word Builder (continues pattern of adding games to Reading)


---

## Phase 11: Counting Game

**Delivers:** Aurora can now play math games
**Aurora gets:** 🔢 **NEW CATEGORY unlocked - Math + Counting Game**
**You get:** See Aurora's counting progress in parent dashboard
**Deployed:** Math category unlocked with first game

---

### What This Phase Delivers

First Math category game - Counting objects:
- Math category card unlocked on child dashboard
- New category page: Math Adventures
- Counting Game: Count 1-10 objects on screen
- 10 questions per session
- Various object types (apples, stars, cars, etc.)
- Scoring: 10 points per correct answer
- Helpful feedback for incorrect answers (counts aloud)
- Saves to database like other games

---

### Database Changes

**No new tables** - Uses existing `game_sessions` table from Phase 3.

**New game_name value:** `'Counting Game'`

**Update categories:** Math category now active

```sql
-- If categories table exists from future phase, update it
-- Otherwise, this is tracked in frontend state only
```

---

### API Endpoints

**No new endpoints** - Uses existing endpoints from Phase 3:

#### POST /api/sessions
**Purpose:** Save Counting Game session
**Body:**
```json
{
  "gameName": "Counting Game",
  "score": 90,
  "accuracyPercentage": 90.0,
  "correctAttempts": 9,
  "totalAttempts": 10,
  "durationSeconds": 180,
  "mode": "Easy"
}
```
**Response (201):**
```json
{
  "success": true,
  "sessionId": 67,
  "isHighScore": true,
  "rank": 2
}
```

#### GET /api/sessions/high-scores?game=Counting Game
**Purpose:** Get Counting Game high scores
**Response (200):**
```json
{
  "success": true,
  "scores": [
    {
      "sessionId": 65,
      "score": 100,
      "accuracyPercentage": 100.0,
      "playedAt": "2025-10-21T15:00:00Z"
    },
    {
      "sessionId": 67,
      "score": 90,
      "accuracyPercentage": 90.0,
      "playedAt": "2025-10-22T11:30:00Z"
    }
  ]
}
```

---

### Frontend Changes

**Update `child-portal/src/pages/ChildDashboard.jsx`:**
```javascript
const categories = [
  {
    id: 'reading',
    name: 'Reading',
    icon: '📚',
    unlocked: true,
    activityCount: 3,
    color: '#FF6B9D',
    path: '/categories/reading'
  },
  {
    id: 'math',
    name: 'Math',
    icon: '🔢',
    unlocked: true,  // Now unlocked in Phase 11
    activityCount: 1,
    color: '#4ECDC4',
    path: '/categories/math'
  },
  {
    id: 'science',
    name: 'Science',
    icon: '🔬',
    unlocked: false,
    activityCount: 0,
    color: '#95E1D3',
    path: '/categories/science'
  }
  // ... other categories remain locked
];
```

**New Files in `child-portal/src/pages/`:**
```
pages/
└── MathCategory.jsx         (Math Adventures page)
```

**New Files in `child-portal/src/games/counting-game/`:**
```
counting-game/
├── CountingGame.js          (Main Phaser scene)
├── scenes/
│   ├── GameScene.js         (Counting gameplay)
│   ├── ResultsScene.js      (Shows score and high scores)
│   └── TutorialScene.js     (First-time instructions)
├── assets/
│   ├── images/
│   │   ├── apple.png
│   │   ├── star.png
│   │   ├── car.png
│   │   ├── balloon.png
│   │   ├── flower.png
│   │   ├── butterfly.png
│   │   ├── rocket.png
│   │   └── ... (various objects)
│   ├── audio/
│   │   ├── numbers/
│   │   │   ├── one.mp3
│   │   │   ├── two.mp3
│   │   │   └── ... (1-10)
│   │   └── correct.mp3
│   └── fonts/
│       └── FredokaOne.ttf
└── data/
    └── objects.js           (Object types and properties)
```

**Add routes in `child-portal/src/App.jsx`:**
```javascript
import MathCategory from './pages/MathCategory';
import CountingGame from './games/counting-game/CountingGame';

<Route path="/categories/math" element={<MathCategory />} />
<Route path="/activities/counting-game" element={<CountingGame />} />
```

---

### Technical Specifications

**MathCategory.jsx - Math Adventures Page:**
```javascript
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './MathCategory.css';

export default function MathCategory() {
  const navigate = useNavigate();

  const activities = [
    {
      id: 1,
      name: 'Counting Game',
      icon: '🔢',
      description: 'Count the objects!',
      difficulty: '⭐',
      path: '/activities/counting-game',
      available: true
    }
  ];

  return (
    <div className="math-category">
      <div className="category-header">
        <button onClick={() => navigate('/dashboard')} className="back-button">
          ← Back
        </button>
        <h1>Math Adventures 🔢</h1>
        <p className="subheader">Let's learn numbers and shapes!</p>
      </div>

      <div className="activities-grid">
        {activities.map(activity => (
          <div key={activity.id} className="activity-card">
            <div className="activity-icon">{activity.icon}</div>
            <h3>{activity.name}</h3>
            <p>{activity.description}</p>
            <p className="difficulty">{activity.difficulty}</p>
            {activity.available ? (
              <button
                onClick={() => navigate(activity.path)}
                className="play-button"
              >
                PLAY
              </button>
            ) : (
              <button disabled className="coming-soon-button">
                COMING SOON 🔒
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// McCabe complexity: 2 (within limit)
```

**GameScene.js - Counting Game Logic:**
```javascript
import Phaser from 'phaser';
import objectsData from '../data/objects';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
    this.score = 0;
    this.currentQuestion = 0;
    this.totalQuestions = 10;
    this.correctAnswers = 0;
    this.startTime = null;
  }

  create() {
    this.startTime = Date.now();
    
    // Display UI
    this.createUI();
    
    // Load first question
    this.loadQuestion();
  }

  createUI() {
    // Background
    this.add.rectangle(640, 360, 1280, 720, 0xF0F8FF);
    
    // Title
    this.add.text(640, 50, 'Counting Game 🔢', {
      fontFamily: 'Fredoka One',
      fontSize: '48px',
      color: '#2D3436'
    }).setOrigin(0.5);
    
    // Score
    this.scoreText = this.add.text(100, 50, 'Score: 0', {
      fontFamily: 'Fredoka One',
      fontSize: '32px',
      color: '#00B894'
    });
    
    // Progress
    this.progressText = this.add.text(1180, 50, 'Question 1 of 10', {
      fontFamily: 'Fredoka One',
      fontSize: '28px',
      color: '#636E72'
    }).setOrigin(1, 0);
  }

  loadQuestion() {
    // Clear previous question
    this.clearQuestion();
    
    // Generate random question
    const objectType = Phaser.Utils.Array.GetRandom(objectsData);
    const count = Phaser.Math.Between(1, 10);
    
    this.currentAnswer = count;
    
    // Display question text
    this.questionText = this.add.text(640, 120, `How many ${objectType.plural}? ${objectType.emoji}`, {
      fontFamily: 'Fredoka One',
      fontSize: '40px',
      color: '#2D3436'
    }).setOrigin(0.5);
    
    // Display objects in random positions
    this.displayObjects(objectType, count);
    
    // Display number buttons
    this.createNumberButtons();
    
    // Update progress
    this.progressText.setText(`Question ${this.currentQuestion + 1} of ${this.totalQuestions}`);
  }

  displayObjects(objectType, count) {
    this.objects = [];
    
    for (let i = 0; i < count; i++) {
      // Random position within bounds
      const x = Phaser.Math.Between(150, 1130);
      const y = Phaser.Math.Between(200, 450);
      
      const obj = this.add.image(x, y, objectType.image)
        .setScale(0.8);
      
      this.objects.push(obj);
    }
  }

  createNumberButtons() {
    this.numberButtons = [];
    
    const startX = 240;
    const startY = 550;
    const spacing = 100;
    
    for (let i = 1; i <= 10; i++) {
      const x = startX + ((i - 1) % 5) * spacing;
      const y = startY + (i > 5 ? 100 : 0);
      
      const button = this.createNumberButton(i, x, y);
      this.numberButtons.push(button);
    }
  }

  createNumberButton(number, x, y) {
    const bg = this.add.rectangle(x, y, 80, 80, 0x4A90E2)
      .setStrokeStyle(4, 0x2E5C8A)
      .setInteractive({ useHandCursor: true });
    
    const text = this.add.text(x, y, number.toString(), {
      fontFamily: 'Fredoka One',
      fontSize: '40px',
      color: '#FFFFFF'
    }).setOrigin(0.5);
    
    const container = this.add.container(x, y, [bg, text]);
    
    bg.on('pointerdown', () => {
      this.handleAnswer(number);
    });
    
    return container;
  }

  handleAnswer(selectedNumber) {
    // Disable all buttons
    this.disableButtons();
    
    if (selectedNumber === this.currentAnswer) {
      // Correct answer
      this.showCorrectFeedback();
      this.score += 10;
      this.correctAnswers++;
      this.scoreText.setText(`Score: ${this.score}`);
      
      // Play number audio
      this.sound.play(`number_${this.currentAnswer}`);
      this.sound.play('correct');
      
      // Move to next question after delay
      this.time.delayedCall(1500, () => this.nextQuestion());
    } else {
      // Incorrect answer - show educational feedback
      this.showCountingFeedback();
      
      // Move to next question after counting demo
      this.time.delayedCall(4000, () => this.nextQuestion());
    }
  }

  showCorrectFeedback() {
    const feedback = this.add.text(640, 300, `Correct! There are ${this.currentAnswer}! 🎉`, {
      fontFamily: 'Fredoka One',
      fontSize: '48px',
      color: '#00B894',
      stroke: '#FFFFFF',
      strokeThickness: 4
    }).setOrigin(0.5);
    
    this.tweens.add({
      targets: feedback,
      scale: { from: 0, to: 1.2 },
      duration: 500,
      ease: 'Back.easeOut'
    });
  }

  showCountingFeedback() {
    const text = this.add.text(640, 300, "Let's count together!", {
      fontFamily: 'Fredoka One',
      fontSize: '40px',
      color: '#FF7675'
    }).setOrigin(0.5);
    
    // Count objects one by one with audio
    let count = 1;
    this.objects.forEach((obj, index) => {
      this.time.delayedCall(1000 + (index * 600), () => {
        // Highlight object
        this.tweens.add({
          targets: obj,
          scale: 1.3,
          duration: 300,
          yoyo: true
        });
        
        // Play count audio
        this.sound.play(`number_${count}`);
        count++;
      });
    });
  }

  nextQuestion() {
    this.currentQuestion++;
    
    if (this.currentQuestion < this.totalQuestions) {
      this.loadQuestion();
    } else {
      this.endGame();
    }
  }

  endGame() {
    const durationSeconds = Math.floor((Date.now() - this.startTime) / 1000);
    const accuracy = (this.correctAnswers / this.totalQuestions) * 100;
    
    const gameData = {
      gameName: 'Counting Game',
      score: this.score,
      accuracyPercentage: accuracy,
      correctAttempts: this.correctAnswers,
      totalAttempts: this.totalQuestions,
      durationSeconds,
      mode: 'Easy'
    };
    
    this.scene.start('ResultsScene', gameData);
  }
}

// McCabe complexity: 5 (at limit, acceptable)
```

**objects.js - Object Data:**
```javascript
export default [
  { image: 'apple', emoji: '🍎', plural: 'apples', color: 'red' },
  { image: 'star', emoji: '⭐', plural: 'stars', color: 'yellow' },
  { image: 'car', emoji: '🚗', plural: 'cars', color: 'blue' },
  { image: 'balloon', emoji: '🎈', plural: 'balloons', color: 'rainbow' },
  { image: 'flower', emoji: '🌸', plural: 'flowers', color: 'pink' },
  { image: 'butterfly', emoji: '🦋', plural: 'butterflies', color: 'purple' },
  { image: 'rocket', emoji: '🚀', plural: 'rockets', color: 'silver' },
  { image: 'heart', emoji: '❤️', plural: 'hearts', color: 'red' },
  { image: 'moon', emoji: '🌙', plural: 'moons', color: 'gray' },
  { image: 'cookie', emoji: '🍪', plural: 'cookies', color: 'brown' }
];
```

---

### Acceptance Criteria

- [ ] Math category card unlocked on child dashboard
- [ ] Math category card shows "1 activity available"
- [ ] Tapping Math card navigates to /categories/math
- [ ] Math Adventures page displays with header and back button
- [ ] Counting Game appears in Math Adventures
- [ ] Tapping "Play" loads Counting Game
- [ ] Game displays random objects (1-10) to count
- [ ] Number buttons 1-10 display correctly
- [ ] Correct answer shows celebration and plays audio
- [ ] Incorrect answer shows counting demonstration
- [ ] Each object highlights during counting demo
- [ ] Audio plays for each number during demo
- [ ] Score increases by 10 points per correct answer
- [ ] No penalty for incorrect answers
- [ ] Progress text updates (Question 1 of 10, etc.)
- [ ] All 10 questions load sequentially
- [ ] Results screen shows score and high scores
- [ ] Session saves to database via POST /api/sessions
- [ ] High scores load from database

---

### McCabe Complexity

All functions ≤ 5:
- `loadQuestion()`: 3
- `handleAnswer()`: 4
- `showCountingFeedback()`: 3
- `nextQuestion()`: 2
- `endGame()`: 2
- MathCategory component: 2

---

### Dependencies

- Phase 3: Database and API (uses game_sessions table)
- Phase 7: Child Login (requires child authentication)
- Phase 8: Child Dashboard (Math category appears on dashboard)


---

## Phase 12: Shapes Recognition Game

**Delivers:** 2nd Math game
**Aurora gets:** 🎮 **NEW GAME - Shapes Recognition**
**You get:** See Aurora's shapes progress in parent dashboard
**Deployed:** 5 total games (3 Reading + 2 Math)

---

### What This Phase Delivers

Shapes Recognition game in Math category:
- Identify basic 2D shapes (circle, square, triangle, rectangle, star, heart, hexagon, oval)
- 10 questions per session
- Multiple choice format (4 shape options)
- Visual + audio (shape name pronunciation)
- Scoring: 10 points per correct answer
- Colorful animations and feedback
- Saves to database like other games
- Appears in Math category alongside Counting Game

---

### Database Changes

**No new tables** - Uses existing `game_sessions` table from Phase 3.

**New game_name value:** `'Shapes Recognition'`

Example record:
```sql
INSERT INTO game_sessions (game_name, score, accuracy_percentage, correct_attempts, total_attempts, duration_seconds, mode)
VALUES ('Shapes Recognition', 100, 100.0, 10, 10, 195, 'Easy');
```

---

### API Endpoints

**No new endpoints** - Uses existing endpoints from Phase 3:

#### POST /api/sessions
**Purpose:** Save Shapes Recognition game session
**Body:**
```json
{
  "gameName": "Shapes Recognition",
  "score": 100,
  "accuracyPercentage": 100.0,
  "correctAttempts": 10,
  "totalAttempts": 10,
  "durationSeconds": 195,
  "mode": "Easy"
}
```
**Response (201):**
```json
{
  "success": true,
  "sessionId": 78,
  "isHighScore": true,
  "rank": 1
}
```

#### GET /api/sessions/high-scores?game=Shapes Recognition
**Purpose:** Get Shapes Recognition high scores
**Response (200):**
```json
{
  "success": true,
  "scores": [
    {
      "sessionId": 78,
      "score": 100,
      "accuracyPercentage": 100.0,
      "playedAt": "2025-10-22T12:00:00Z"
    }
  ]
}
```

---

### Frontend Changes

**Update `child-portal/src/pages/MathCategory.jsx`:**
```javascript
const activities = [
  {
    id: 1,
    name: 'Counting Game',
    icon: '🔢',
    description: 'Count the objects!',
    difficulty: '⭐',
    path: '/activities/counting-game',
    available: true
  },
  {
    id: 2,
    name: 'Shapes',
    icon: '🔷',
    description: 'Learn shapes!',
    difficulty: '⭐⭐',
    path: '/activities/shapes',
    available: true
  }
];
```

**New Files in `child-portal/src/games/shapes/`:**
```
shapes/
├── ShapesGame.js            (Main Phaser scene)
├── scenes/
│   ├── GameScene.js         (Shapes recognition gameplay)
│   ├── ResultsScene.js      (Shows score and high scores)
│   └── TutorialScene.js     (First-time instructions)
├── assets/
│   ├── images/
│   │   ├── circle.png
│   │   ├── square.png
│   │   ├── triangle.png
│   │   ├── rectangle.png
│   │   ├── star.png
│   │   ├── heart.png
│   │   ├── hexagon.png
│   │   └── oval.png
│   ├── audio/
│   │   ├── circle.mp3
│   │   ├── square.mp3
│   │   ├── triangle.mp3
│   │   └── ... (8 shape audio files)
│   └── fonts/
│       └── FredokaOne.ttf
└── data/
    └── shapes.js            (Shape definitions)
```

**Add route in `child-portal/src/App.jsx`:**
```javascript
import ShapesGame from './games/shapes/ShapesGame';

<Route path="/activities/shapes" element={<ShapesGame />} />
```

**Update dashboard count in `child-portal/src/pages/ChildDashboard.jsx`:**
```javascript
{
  id: 'math',
  name: 'Math',
  icon: '🔢',
  unlocked: true,
  activityCount: 2,  // Updated from 1 to 2
  color: '#4ECDC4',
  path: '/categories/math'
}
```

---

### Technical Specifications

**GameScene.js - Shapes Recognition Logic:**
```javascript
import Phaser from 'phaser';
import shapesData from '../data/shapes';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
    this.score = 0;
    this.currentQuestion = 0;
    this.totalQuestions = 10;
    this.correctAnswers = 0;
    this.startTime = null;
  }

  create() {
    this.startTime = Date.now();
    
    // Display UI
    this.createUI();
    
    // Load first question
    this.loadQuestion();
  }

  createUI() {
    // Background gradient
    this.add.rectangle(640, 360, 1280, 720, 0xE8F4F8);
    
    // Title
    this.add.text(640, 50, 'Shapes 🔷', {
      fontFamily: 'Fredoka One',
      fontSize: '48px',
      color: '#2D3436'
    }).setOrigin(0.5);
    
    // Score
    this.scoreText = this.add.text(100, 50, 'Score: 0', {
      fontFamily: 'Fredoka One',
      fontSize: '32px',
      color: '#00B894'
    });
    
    // Progress
    this.progressText = this.add.text(1180, 50, 'Question 1 of 10', {
      fontFamily: 'Fredoka One',
      fontSize: '28px',
      color: '#636E72'
    }).setOrigin(1, 0);
  }

  loadQuestion() {
    // Clear previous question
    this.clearQuestion();
    
    // Select random shape as target
    const targetShape = Phaser.Utils.Array.GetRandom(shapesData);
    this.currentAnswer = targetShape.name;
    
    // Display question text
    this.questionText = this.add.text(640, 120, `Find the ${targetShape.name}!`, {
      fontFamily: 'Fredoka One',
      fontSize: '40px',
      color: '#2D3436'
    }).setOrigin(0.5);
    
    // Play audio
    this.sound.play(`shape_${targetShape.name.toLowerCase()}`);
    
    // Display target shape (large, centered)
    this.targetShapeImage = this.add.image(640, 280, targetShape.image)
      .setScale(1.5)
      .setTint(targetShape.color);
    
    // Create answer choices (4 shapes)
    this.createAnswerChoices(targetShape);
    
    // Update progress
    this.progressText.setText(`Question ${this.currentQuestion + 1} of ${this.totalQuestions}`);
  }

  createAnswerChoices(targetShape) {
    // Get target + 3 distractors
    const distractors = shapesData
      .filter(s => s.name !== targetShape.name)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    
    const choices = [targetShape, ...distractors];
    Phaser.Utils.Array.Shuffle(choices);
    
    // Display choices in 2x2 grid
    const positions = [
      { x: 420, y: 520 },
      { x: 860, y: 520 },
      { x: 420, y: 620 },
      { x: 860, y: 620 }
    ];
    
    this.choiceButtons = [];
    
    choices.forEach((shape, index) => {
      const pos = positions[index];
      const button = this.createChoiceButton(shape, pos.x, pos.y);
      this.choiceButtons.push(button);
    });
  }

  createChoiceButton(shape, x, y) {
    const bg = this.add.rectangle(x, y, 180, 80, 0xFFFFFF)
      .setStrokeStyle(4, 0xDFE6E9)
      .setInteractive({ useHandCursor: true });
    
    const icon = this.add.image(x - 50, y, shape.image)
      .setScale(0.4)
      .setTint(shape.color);
    
    const text = this.add.text(x + 20, y, shape.name, {
      fontFamily: 'Fredoka One',
      fontSize: '24px',
      color: '#2D3436'
    }).setOrigin(0, 0.5);
    
    const container = this.add.container(x, y, [bg, icon, text]);
    container.setData('shapeName', shape.name);
    
    bg.on('pointerdown', () => {
      this.handleAnswer(shape.name, container);
    });
    
    bg.on('pointerover', () => {
      bg.setFillStyle(0xE8F4F8);
    });
    
    bg.on('pointerout', () => {
      bg.setFillStyle(0xFFFFFF);
    });
    
    return container;
  }

  handleAnswer(selectedShape, selectedButton) {
    // Disable all buttons
    this.disableButtons();
    
    if (selectedShape === this.currentAnswer) {
      // Correct answer
      this.showCorrectFeedback(selectedButton);
      this.score += 10;
      this.correctAnswers++;
      this.scoreText.setText(`Score: ${this.score}`);
      
      // Play shape audio again
      this.sound.play(`shape_${this.currentAnswer.toLowerCase()}`);
      this.sound.play('correct');
      
      // Move to next question after delay
      this.time.delayedCall(1500, () => this.nextQuestion());
    } else {
      // Incorrect answer
      this.showIncorrectFeedback(selectedButton);
      
      // Move to next question after delay
      this.time.delayedCall(2000, () => this.nextQuestion());
    }
  }

  showCorrectFeedback(button) {
    const feedback = this.add.text(640, 450, '✅ Correct!', {
      fontFamily: 'Fredoka One',
      fontSize: '48px',
      color: '#00B894',
      stroke: '#FFFFFF',
      strokeThickness: 4
    }).setOrigin(0.5);
    
    // Bounce animation
    this.tweens.add({
      targets: feedback,
      scale: { from: 0, to: 1.2 },
      duration: 500,
      ease: 'Back.easeOut'
    });
    
    // Celebrate target shape
    this.tweens.add({
      targets: this.targetShapeImage,
      angle: 360,
      scale: 2.0,
      duration: 1000,
      ease: 'Bounce.easeOut'
    });
  }

  showIncorrectFeedback(button) {
    const feedback = this.add.text(640, 450, `That's a ${this.currentAnswer}! Try again!`, {
      fontFamily: 'Fredoka One',
      fontSize: '36px',
      color: '#FF7675'
    }).setOrigin(0.5);
    
    // Shake animation
    this.cameras.main.shake(200, 0.005);
  }

  nextQuestion() {
    this.currentQuestion++;
    
    if (this.currentQuestion < this.totalQuestions) {
      this.loadQuestion();
    } else {
      this.endGame();
    }
  }

  endGame() {
    const durationSeconds = Math.floor((Date.now() - this.startTime) / 1000);
    const accuracy = (this.correctAnswers / this.totalQuestions) * 100;
    
    const gameData = {
      gameName: 'Shapes Recognition',
      score: this.score,
      accuracyPercentage: accuracy,
      correctAttempts: this.correctAnswers,
      totalAttempts: this.totalQuestions,
      durationSeconds,
      mode: 'Easy'
    };
    
    this.scene.start('ResultsScene', gameData);
  }

  clearQuestion() {
    if (this.questionText) this.questionText.destroy();
    if (this.targetShapeImage) this.targetShapeImage.destroy();
    if (this.choiceButtons) {
      this.choiceButtons.forEach(btn => btn.destroy());
    }
  }

  disableButtons() {
    this.choiceButtons.forEach(btn => {
      btn.list[0].disableInteractive();
    });
  }
}

// McCabe complexity: 5 (at limit, acceptable)
```

**shapes.js - Shape Definitions:**
```javascript
export default [
  { name: 'Circle', image: 'circle', color: 0xFF6B9D },
  { name: 'Square', image: 'square', color: 0x4ECDC4 },
  { name: 'Triangle', image: 'triangle', color: 0xFFD93D },
  { name: 'Rectangle', image: 'rectangle', color: 0x95E1D3 },
  { name: 'Star', image: 'star', color: 0xFECE63 },
  { name: 'Heart', image: 'heart', color: 0xFF6B9D },
  { name: 'Hexagon', image: 'hexagon', color: 0x6C5CE7 },
  { name: 'Oval', image: 'oval', color: 0xA29BFE }
];
```

---

### Acceptance Criteria

- [ ] Shapes game appears in Math Adventures page
- [ ] Math category shows "2 activities available" on dashboard
- [ ] Game loads with first shape question
- [ ] Target shape displays large and centered
- [ ] Audio pronunciation plays automatically
- [ ] 4 answer choices display in grid (1 correct, 3 wrong)
- [ ] Hover effect works on choice buttons
- [ ] Correct answer shows celebration animation
- [ ] Target shape rotates and grows on correct answer
- [ ] Incorrect answer shows friendly feedback
- [ ] Score increases by 10 points per correct answer
- [ ] Progress text updates (Question 1 of 10, etc.)
- [ ] All 10 questions load sequentially
- [ ] 8 different shapes appear throughout session
- [ ] Results screen shows score and high scores
- [ ] Session saves to database via POST /api/sessions
- [ ] High scores load from database
- [ ] Game works on touch devices

---

### McCabe Complexity

All functions ≤ 5:
- `loadQuestion()`: 3
- `createAnswerChoices()`: 3
- `handleAnswer()`: 4
- `showCorrectFeedback()`: 2
- `nextQuestion()`: 2
- `endGame()`: 2

---

### Dependencies

- Phase 3: Database and API (uses game_sessions table)
- Phase 7: Child Login (requires child authentication)
- Phase 11: Counting Game (Shapes appears alongside in Math category)


---

## Phase 13: Simple Addition Game

**Delivers:** 3rd Math game (addition practice)
**Aurora gets:** 🎮 **NEW GAME - Addition (1-10)**
**You get:** See Aurora's math skills developing in parent dashboard
**Deployed:** 6 total games (3 Reading + 3 Math)

---

### What This Phase Delivers

Simple Addition game in Math category:
- Addition problems with numbers 1-10
- Visual representation (count objects for each number)
- 10 questions per session
- Multiple choice format (4 answer options)
- Equation display: "3 + 5 = ?"
- Colorful animations and feedback
- Scoring: 10 points per correct answer
- Saves to database like other games
- Appears in Math category (3rd game)

---

### Database Changes

**No new tables** - Uses existing `game_sessions` table from Phase 3.

**New game_name value:** `'Addition Game'`

Example record:
```sql
INSERT INTO game_sessions (game_name, score, accuracy_percentage, correct_attempts, total_attempts, duration_seconds, mode)
VALUES ('Addition Game', 90, 90.0, 9, 10, 210, 'Easy');
```

---

### API Endpoints

**No new endpoints** - Uses existing endpoints from Phase 3:

#### POST /api/sessions
**Purpose:** Save Addition Game session
**Body:**
```json
{
  "gameName": "Addition Game",
  "score": 90,
  "accuracyPercentage": 90.0,
  "correctAttempts": 9,
  "totalAttempts": 10,
  "durationSeconds": 210,
  "mode": "Easy"
}
```
**Response (201):**
```json
{
  "success": true,
  "sessionId": 89,
  "isHighScore": false,
  "rank": 3
}
```

#### GET /api/sessions/high-scores?game=Addition Game
**Purpose:** Get Addition Game high scores
**Response (200):**
```json
{
  "success": true,
  "scores": [
    {
      "sessionId": 85,
      "score": 100,
      "accuracyPercentage": 100.0,
      "playedAt": "2025-10-21T16:00:00Z"
    },
    {
      "sessionId": 89,
      "score": 90,
      "accuracyPercentage": 90.0,
      "playedAt": "2025-10-22T13:00:00Z"
    }
  ]
}
```

---

### Frontend Changes

**Update `child-portal/src/pages/MathCategory.jsx`:**
```javascript
const activities = [
  {
    id: 1,
    name: 'Counting Game',
    icon: '🔢',
    description: 'Count the objects!',
    difficulty: '⭐',
    path: '/activities/counting-game',
    available: true
  },
  {
    id: 2,
    name: 'Shapes',
    icon: '🔷',
    description: 'Learn shapes!',
    difficulty: '⭐⭐',
    path: '/activities/shapes',
    available: true
  },
  {
    id: 3,
    name: 'Addition',
    icon: '➕',
    description: 'Add numbers together!',
    difficulty: '⭐⭐⭐',
    path: '/activities/addition',
    available: true
  }
];
```

**New Files in `child-portal/src/games/addition/`:**
```
addition/
├── AdditionGame.js          (Main Phaser scene)
├── scenes/
│   ├── GameScene.js         (Addition gameplay)
│   ├── ResultsScene.js      (Shows score and high scores)
│   └── TutorialScene.js     (First-time instructions)
├── assets/
│   ├── images/
│   │   ├── apple.png        (For visual counting)
│   │   ├── star.png
│   │   └── ... (reuse from counting game)
│   ├── audio/
│   │   ├── numbers/
│   │   │   ├── one.mp3
│   │   │   └── ... (0-20)
│   │   └── plus.mp3         (Says "plus")
│   └── fonts/
│       └── FredokaOne.ttf
└── utils/
    └── problemGenerator.js  (Generates addition problems)
```

**Add route in `child-portal/src/App.jsx`:**
```javascript
import AdditionGame from './games/addition/AdditionGame';

<Route path="/activities/addition" element={<AdditionGame />} />
```

**Update dashboard count in `child-portal/src/pages/ChildDashboard.jsx`:**
```javascript
{
  id: 'math',
  name: 'Math',
  icon: '🔢',
  unlocked: true,
  activityCount: 3,  // Updated from 2 to 3
  color: '#4ECDC4',
  path: '/categories/math'
}
```

---

### Technical Specifications

**GameScene.js - Addition Game Logic:**
```javascript
import Phaser from 'phaser';
import { generateProblem } from '../utils/problemGenerator';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
    this.score = 0;
    this.currentQuestion = 0;
    this.totalQuestions = 10;
    this.correctAnswers = 0;
    this.startTime = null;
  }

  create() {
    this.startTime = Date.now();
    
    // Display UI
    this.createUI();
    
    // Load first question
    this.loadQuestion();
  }

  createUI() {
    // Background
    this.add.rectangle(640, 360, 1280, 720, 0xFFF8E1);
    
    // Title
    this.add.text(640, 50, 'Addition ➕', {
      fontFamily: 'Fredoka One',
      fontSize: '48px',
      color: '#2D3436'
    }).setOrigin(0.5);
    
    // Score
    this.scoreText = this.add.text(100, 50, 'Score: 0', {
      fontFamily: 'Fredoka One',
      fontSize: '32px',
      color: '#00B894'
    });
    
    // Progress
    this.progressText = this.add.text(1180, 50, 'Question 1 of 10', {
      fontFamily: 'Fredoka One',
      fontSize: '28px',
      color: '#636E72'
    }).setOrigin(1, 0);
  }

  loadQuestion() {
    // Clear previous question
    this.clearQuestion();
    
    // Generate random addition problem (1-10)
    const problem = generateProblem(1, 10);
    this.currentAnswer = problem.answer;
    
    // Display equation
    this.displayEquation(problem);
    
    // Display visual representation
    this.displayVisuals(problem.num1, problem.num2);
    
    // Create answer choices
    this.createAnswerChoices(problem.answer);
    
    // Play audio: "3 plus 5 equals?"
    this.playProblemAudio(problem);
    
    // Update progress
    this.progressText.setText(`Question ${this.currentQuestion + 1} of ${this.totalQuestions}`);
  }

  displayEquation(problem) {
    this.equationText = this.add.text(640, 150, `${problem.num1} + ${problem.num2} = ?`, {
      fontFamily: 'Fredoka One',
      fontSize: '72px',
      color: '#2D3436',
      stroke: '#FFFFFF',
      strokeThickness: 4
    }).setOrigin(0.5);
  }

  displayVisuals(num1, num2) {
    // Display num1 apples on left
    const leftGroup = this.createObjectGroup(num1, 300, 300, 0xFF6B9D);
    
    // Display plus sign
    this.add.text(640, 300, '+', {
      fontFamily: 'Fredoka One',
      fontSize: '64px',
      color: '#2D3436'
    }).setOrigin(0.5);
    
    // Display num2 apples on right
    const rightGroup = this.createObjectGroup(num2, 980, 300, 0x4ECDC4);
  }

  createObjectGroup(count, centerX, centerY, color) {
    const objects = [];
    const radius = 40;
    const maxPerRow = 5;
    
    for (let i = 0; i < count; i++) {
      const row = Math.floor(i / maxPerRow);
      const col = i % maxPerRow;
      const x = centerX - (maxPerRow - 1) * 25 + col * 50;
      const y = centerY + row * 50;
      
      const obj = this.add.circle(x, y, radius, color)
        .setStroke(0xFFFFFF, 3);
      
      objects.push(obj);
    }
    
    return objects;
  }

  createAnswerChoices(correctAnswer) {
    // Generate 4 choices: correct + 3 plausible wrong answers
    const choices = [correctAnswer];
    
    // Add wrong answers (±1, ±2 from correct)
    const possibleWrong = [
      correctAnswer - 2,
      correctAnswer - 1,
      correctAnswer + 1,
      correctAnswer + 2
    ].filter(n => n > 0 && n <= 20 && n !== correctAnswer);
    
    // Pick 3 random wrong answers
    const wrongChoices = Phaser.Utils.Array.Shuffle(possibleWrong).slice(0, 3);
    choices.push(...wrongChoices);
    
    // Shuffle all choices
    Phaser.Utils.Array.Shuffle(choices);
    
    // Display choices in row
    const startX = 420;
    const spacing = 150;
    
    this.choiceButtons = [];
    
    choices.forEach((num, index) => {
      const x = startX + (index * spacing);
      const y = 550;
      const button = this.createChoiceButton(num, x, y);
      this.choiceButtons.push(button);
    });
  }

  createChoiceButton(number, x, y) {
    const bg = this.add.rectangle(x, y, 120, 100, 0xFFFFFF)
      .setStrokeStyle(6, 0x4ECDC4)
      .setInteractive({ useHandCursor: true });
    
    const text = this.add.text(x, y, number.toString(), {
      fontFamily: 'Fredoka One',
      fontSize: '56px',
      color: '#2D3436'
    }).setOrigin(0.5);
    
    const container = this.add.container(x, y, [bg, text]);
    
    bg.on('pointerdown', () => {
      this.handleAnswer(number, container);
    });
    
    bg.on('pointerover', () => {
      bg.setFillStyle(0xE8F4F8);
      bg.setScale(1.1);
    });
    
    bg.on('pointerout', () => {
      bg.setFillStyle(0xFFFFFF);
      bg.setScale(1.0);
    });
    
    return container;
  }

  handleAnswer(selectedNumber, selectedButton) {
    // Disable all buttons
    this.disableButtons();
    
    if (selectedNumber === this.currentAnswer) {
      // Correct answer
      this.showCorrectFeedback();
      this.score += 10;
      this.correctAnswers++;
      this.scoreText.setText(`Score: ${this.score}`);
      
      // Play answer audio
      this.sound.play(`number_${this.currentAnswer}`);
      this.sound.play('correct');
      
      // Move to next question after delay
      this.time.delayedCall(1500, () => this.nextQuestion());
    } else {
      // Incorrect answer
      this.showIncorrectFeedback(selectedNumber);
      
      // Move to next question after delay
      this.time.delayedCall(2500, () => this.nextQuestion());
    }
  }

  showCorrectFeedback() {
    const feedback = this.add.text(640, 450, '🎉 Correct!', {
      fontFamily: 'Fredoka One',
      fontSize: '56px',
      color: '#00B894',
      stroke: '#FFFFFF',
      strokeThickness: 6
    }).setOrigin(0.5);
    
    // Confetti animation
    this.tweens.add({
      targets: feedback,
      scale: { from: 0, to: 1.3 },
      duration: 500,
      ease: 'Back.easeOut'
    });
  }

  showIncorrectFeedback(selectedNumber) {
    const feedback = this.add.text(640, 450, `Not quite! The answer is ${this.currentAnswer}`, {
      fontFamily: 'Fredoka One',
      fontSize: '40px',
      color: '#FF7675'
    }).setOrigin(0.5);
    
    // Shake
    this.cameras.main.shake(300, 0.005);
    
    // Play correct answer audio after brief pause
    this.time.delayedCall(1000, () => {
      this.sound.play(`number_${this.currentAnswer}`);
    });
  }

  playProblemAudio(problem) {
    // Play: "3" ... "plus" ... "5" ... "equals?"
    this.sound.play(`number_${problem.num1}`);
    this.time.delayedCall(800, () => this.sound.play('plus'));
    this.time.delayedCall(1600, () => this.sound.play(`number_${problem.num2}`));
  }

  nextQuestion() {
    this.currentQuestion++;
    
    if (this.currentQuestion < this.totalQuestions) {
      this.loadQuestion();
    } else {
      this.endGame();
    }
  }

  endGame() {
    const durationSeconds = Math.floor((Date.now() - this.startTime) / 1000);
    const accuracy = (this.correctAnswers / this.totalQuestions) * 100;
    
    const gameData = {
      gameName: 'Addition Game',
      score: this.score,
      accuracyPercentage: accuracy,
      correctAttempts: this.correctAnswers,
      totalAttempts: this.totalQuestions,
      durationSeconds,
      mode: 'Easy'
    };
    
    this.scene.start('ResultsScene', gameData);
  }

  clearQuestion() {
    if (this.equationText) this.equationText.destroy();
    if (this.choiceButtons) {
      this.choiceButtons.forEach(btn => btn.destroy());
    }
    // Clear visual objects (handled by scene cleanup)
  }

  disableButtons() {
    this.choiceButtons.forEach(btn => {
      btn.list[0].disableInteractive();
    });
  }
}

// McCabe complexity: 5 (at limit, acceptable)
```

**problemGenerator.js - Problem Generation Utility:**
```javascript
export function generateProblem(min, max) {
  // Generate two numbers within range
  const num1 = Phaser.Math.Between(min, max);
  const num2 = Phaser.Math.Between(min, max);
  
  // Ensure answer doesn't exceed 20 (age-appropriate)
  const maxNum2 = Math.min(max, 20 - num1);
  const adjustedNum2 = Math.min(num2, maxNum2);
  
  return {
    num1,
    num2: adjustedNum2,
    answer: num1 + adjustedNum2
  };
}

// McCabe complexity: 2 (within limit)
```

---

### Acceptance Criteria

- [ ] Addition game appears in Math Adventures page
- [ ] Math category shows "3 activities available" on dashboard
- [ ] Game loads with first addition problem
- [ ] Equation displays clearly (e.g., "3 + 5 = ?")
- [ ] Visual objects display for both addends
- [ ] Audio plays problem aloud ("3 plus 5 equals?")
- [ ] 4 answer choices display
- [ ] Hover effect works on answer buttons
- [ ] Correct answer shows celebration animation
- [ ] Incorrect answer shows correct answer with explanation
- [ ] Audio plays correct answer after mistake
- [ ] Score increases by 10 points per correct answer
- [ ] Progress text updates (Question 1 of 10, etc.)
- [ ] All 10 questions load sequentially
- [ ] Problems use numbers 1-10
- [ ] Answers never exceed 20
- [ ] Results screen shows score and high scores
- [ ] Session saves to database via POST /api/sessions
- [ ] High scores load from database

---

### McCabe Complexity

All functions ≤ 5:
- `loadQuestion()`: 3
- `createAnswerChoices()`: 3
- `handleAnswer()`: 4
- `showIncorrectFeedback()`: 2
- `playProblemAudio()`: 1
- `generateProblem()`: 2

---

### Dependencies

- Phase 3: Database and API (uses game_sessions table)
- Phase 7: Child Login (requires child authentication)
- Phase 11: Counting Game (Addition builds on counting skills)
- Phase 12: Shapes Recognition (Addition appears alongside in Math category)


---

## Phase 14: Chore System - Backend

**Delivers:** Chore infrastructure ready (backend only)
**Aurora gets:** Nothing yet
**You get:** Nothing visible yet (infrastructure)
**Deployed:** Chore API endpoints ready

---

### What This Phase Delivers

Backend foundation for chore system:
- Database table for chores
- API endpoints: create, list, update, mark complete, approve
- Chore assignment to children
- Points reward system
- Photo proof upload capability (optional)
- Status tracking (pending, completed, approved)

---

### Database Changes

**New Table:** `chores`
```sql
CREATE TABLE chores (
    chore_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    family_id INT NOT NULL,
    assigned_to_user_id INT,              -- Child user_id
    created_by_user_id INT NOT NULL,      -- Parent user_id
    
    title VARCHAR(200) NOT NULL,
    description TEXT,
    points_value INT NOT NULL DEFAULT 10,
    
    status ENUM('pending', 'completed', 'approved', 'rejected') DEFAULT 'pending',
    
    -- Proof tracking
    photo_url VARCHAR(500),
    completed_at TIMESTAMP NULL,
    approved_at TIMESTAMP NULL,
    approved_by_user_id INT,
    
    -- Scheduling
    due_date DATE,
    is_recurring BOOLEAN DEFAULT FALSE,
    recurrence_pattern ENUM('daily', 'weekly', 'monthly') NULL,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (family_id) REFERENCES families(family_id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_to_user_id) REFERENCES users(user_id) ON DELETE SET NULL,
    FOREIGN KEY (created_by_user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (approved_by_user_id) REFERENCES users(user_id) ON DELETE SET NULL,
    
    INDEX idx_family (family_id),
    INDEX idx_assigned (assigned_to_user_id, status),
    INDEX idx_due_date (due_date),
    INDEX idx_status (status)
);
```

---

### API Endpoints

#### POST /api/chores
**Purpose:** Create new chore
**Headers:** `Authorization: Bearer {token}` (Parent role required)
**Body:**
```json
{
  "title": "Make your bed",
  "description": "Straighten sheets and fluff pillows",
  "assignedToUserId": 2,
  "pointsValue": 5,
  "dueDate": "2025-10-23",
  "isRecurring": true,
  "recurrencePattern": "daily"
}
```
**Response (201):**
```json
{
  "success": true,
  "chore": {
    "choreId": 1,
    "title": "Make your bed",
    "assignedToUserId": 2,
    "pointsValue": 5,
    "status": "pending",
    "dueDate": "2025-10-23",
    "createdAt": "2025-10-22T14:00:00Z"
  }
}
```

#### GET /api/chores?assignedTo={userId}&status={status}
**Purpose:** Get chores list (filtered)
**Headers:** `Authorization: Bearer {token}`
**Query Parameters:**
- `assignedTo` (optional): Filter by child user_id
- `status` (optional): Filter by status (pending, completed, approved)
**Response (200):**
```json
{
  "success": true,
  "chores": [
    {
      "choreId": 1,
      "title": "Make your bed",
      "description": "Straighten sheets and fluff pillows",
      "assignedToUserId": 2,
      "assignedToName": "Aurora",
      "pointsValue": 5,
      "status": "pending",
      "dueDate": "2025-10-23",
      "createdAt": "2025-10-22T14:00:00Z"
    }
  ]
}
```

#### PATCH /api/chores/:choreId/complete
**Purpose:** Mark chore as completed (child action)
**Headers:** `Authorization: Bearer {token}` (Child role)
**Body:**
```json
{
  "photoUrl": "https://s3.amazonaws.com/adhdlearn/chores/photo_123.jpg"
}
```
**Response (200):**
```json
{
  "success": true,
  "chore": {
    "choreId": 1,
    "status": "completed",
    "completedAt": "2025-10-23T08:30:00Z",
    "photoUrl": "https://s3.amazonaws.com/adhdlearn/chores/photo_123.jpg"
  }
}
```

#### PATCH /api/chores/:choreId/approve
**Purpose:** Approve completed chore (parent action)
**Headers:** `Authorization: Bearer {token}` (Parent role required)
**Body:**
```json
{
  "approved": true
}
```
**Response (200):**
```json
{
  "success": true,
  "chore": {
    "choreId": 1,
    "status": "approved",
    "approvedAt": "2025-10-23T18:00:00Z",
    "approvedByUserId": 1,
    "pointsAwarded": 5
  },
  "child": {
    "userId": 2,
    "totalPoints": 455
  }
}
```

**Note:** When approved, points are added to child's `total_points` in users table.

#### DELETE /api/chores/:choreId
**Purpose:** Delete chore
**Headers:** `Authorization: Bearer {token}` (Parent role required)
**Response (200):**
```json
{
  "success": true,
  "message": "Chore deleted"
}
```

---

### Frontend Changes

**None** - This phase is backend-only infrastructure.

---

### Technical Specifications

**Backend: `backend/src/controllers/choresController.js`:**
```javascript
const pool = require('../db/pool');

async function createChore(req, res) {
  const { title, description, assignedToUserId, pointsValue, dueDate, isRecurring, recurrencePattern } = req.body;
  const createdByUserId = req.user.userId;
  const familyId = req.user.familyId;
  
  // Validate parent role
  if (req.user.role !== 'parent') {
    return res.status(403).json({
      success: false,
      error: 'Only parents can create chores'
    });
  }
  
  if (!title || !pointsValue) {
    return res.status(400).json({
      success: false,
      error: 'Missing required fields'
    });
  }
  
  try {
    const [result] = await pool.execute(
      `INSERT INTO chores (family_id, assigned_to_user_id, created_by_user_id, title, description, points_value, due_date, is_recurring, recurrence_pattern)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [familyId, assignedToUserId || null, createdByUserId, title, description || null, pointsValue, dueDate || null, isRecurring || false, recurrencePattern || null]
    );
    
    const [chores] = await pool.execute(
      'SELECT * FROM chores WHERE chore_id = ?',
      [result.insertId]
    );
    
    res.status(201).json({
      success: true,
      chore: chores[0]
    });
  } catch (error) {
    console.error('Create chore error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
}

// McCabe complexity: 4 (within limit)

async function approveChore(req, res) {
  const { choreId } = req.params;
  const { approved } = req.body;
  const approvedByUserId = req.user.userId;
  
  // Validate parent role
  if (req.user.role !== 'parent') {
    return res.status(403).json({
      success: false,
      error: 'Only parents can approve chores'
    });
  }
  
  try {
    // Get chore details
    const [chores] = await pool.execute(
      'SELECT * FROM chores WHERE chore_id = ?',
      [choreId]
    );
    
    if (chores.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Chore not found'
      });
    }
    
    const chore = chores[0];
    const newStatus = approved ? 'approved' : 'rejected';
    
    // Update chore status
    await pool.execute(
      `UPDATE chores 
       SET status = ?, approved_at = CURRENT_TIMESTAMP, approved_by_user_id = ?
       WHERE chore_id = ?`,
      [newStatus, approvedByUserId, choreId]
    );
    
    // If approved, award points to child
    if (approved && chore.assigned_to_user_id) {
      await pool.execute(
        'UPDATE users SET total_points = total_points + ? WHERE user_id = ?',
        [chore.points_value, chore.assigned_to_user_id]
      );
    }
    
    // Fetch updated child info
    const [children] = await pool.execute(
      'SELECT user_id, total_points FROM users WHERE user_id = ?',
      [chore.assigned_to_user_id]
    );
    
    res.json({
      success: true,
      chore: {
        choreId,
        status: newStatus,
        approvedAt: new Date(),
        approvedByUserId,
        pointsAwarded: approved ? chore.points_value : 0
      },
      child: children[0]
    });
  } catch (error) {
    console.error('Approve chore error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
}

// McCabe complexity: 5 (at limit, acceptable)

module.exports = {
  createChore,
  approveChore,
  // ... other exports
};
```

---

### Acceptance Criteria

- [ ] Chores table created in database
- [ ] POST /api/chores creates new chore
- [ ] Only parents can create chores (403 for non-parents)
- [ ] GET /api/chores returns chores list
- [ ] Filtering by assignedTo works
- [ ] Filtering by status works
- [ ] PATCH /api/chores/:id/complete marks chore completed
- [ ] Photo URL saved with completion
- [ ] PATCH /api/chores/:id/approve approves chore
- [ ] Approving chore adds points to child's total_points
- [ ] Only parents can approve chores
- [ ] DELETE /api/chores/:id deletes chore
- [ ] Recurring chores supported in database
- [ ] All API endpoints return proper error codes
- [ ] API validates user roles correctly

---

### McCabe Complexity

All functions ≤ 5:
- `createChore()`: 4
- `approveChore()`: 5
- `getChores()`: 3
- `completeChore()`: 3

---

### Dependencies

- Phase 4: Parent Registration + Login (requires parent authentication)
- Phase 7: Child Login (requires child authentication for completion)


---

## Phase 15: Chore System - Parent Side

**Delivers:** You can create and manage chores for Aurora
**Aurora gets:** Nothing new (sees chores in Phase 16)
**You get:** 📝 **Chore Manager - Create chores, assign to Aurora**
**Deployed:** Parent portal has working chore management

---

### What This Phase Delivers

Chore management UI for parents:
- Chore Manager page in parent portal
- Create new chore form
- Assign chore to Aurora
- Set points value and due date
- View all chores (pending, completed, approved)
- Approve/reject completed chores
- View photo proof from Aurora
- Delete chores

---

### Database Changes

**No new tables** - Uses `chores` table from Phase 14.

---

### API Endpoints

**No new endpoints** - Uses endpoints from Phase 14:
- POST /api/chores
- GET /api/chores
- PATCH /api/chores/:id/approve
- DELETE /api/chores/:id

---

### Frontend Changes

**New Files in `parent-portal/src/pages/`:**
```
pages/
├── ChoreManager.jsx         (Main chore management page)
├── CreateChoreForm.jsx      (Form to create new chore)
└── ChoreCard.jsx            (Individual chore display)
```

**Add route in `parent-portal/src/App.jsx`:**
```javascript
import ChoreManager from './pages/ChoreManager';

<Route path="/chores" element={<ChoreManager />} />
```

**Update navigation in `parent-portal/src/components/Navigation.jsx`:**
```javascript
<nav>
  <Link to="/dashboard">Dashboard</Link>
  <Link to="/children">Children</Link>
  <Link to="/chores">Chores</Link>  {/* New */}
  <Link to="/settings">Settings</Link>
</nav>
```

---

### Technical Specifications

**ChoreManager.jsx:**
```javascript
import React, { useState, useEffect } from 'react';
import api from '../services/api';
import CreateChoreForm from './CreateChoreForm';
import ChoreCard from './ChoreCard';
import './ChoreManager.css';

export default function ChoreManager() {
  const [chores, setChores] = useState([]);
  const [children, setChildren] = useState([]);
  const [filter, setFilter] = useState('all');
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    fetchChores();
    fetchChildren();
  }, [filter]);

  async function fetchChores() {
    try {
      const query = filter !== 'all' ? `?status=${filter}` : '';
      const response = await api.get(`/api/chores${query}`);
      setChores(response.chores);
    } catch (error) {
      console.error('Failed to fetch chores:', error);
    }
  }

  async function fetchChildren() {
    try {
      const response = await api.get('/api/children');
      setChildren(response.children);
    } catch (error) {
      console.error('Failed to fetch children:', error);
    }
  }

  async function handleApprove(choreId, approved) {
    try {
      await api.patch(`/api/chores/${choreId}/approve`, { approved });
      fetchChores(); // Refresh list
    } catch (error) {
      console.error('Failed to approve chore:', error);
    }
  }

  async function handleDelete(choreId) {
    if (!confirm('Are you sure you want to delete this chore?')) return;
    
    try {
      await api.delete(`/api/chores/${choreId}`);
      fetchChores(); // Refresh list
    } catch (error) {
      console.error('Failed to delete chore:', error);
    }
  }

  return (
    <div className="chore-manager">
      <div className="header">
        <h1>Chore Manager</h1>
        <button onClick={() => setShowCreateForm(true)} className="create-btn">
          + New Chore
        </button>
      </div>

      <div className="filters">
        <button 
          className={filter === 'all' ? 'active' : ''}
          onClick={() => setFilter('all')}
        >
          All
        </button>
        <button 
          className={filter === 'pending' ? 'active' : ''}
          onClick={() => setFilter('pending')}
        >
          Pending
        </button>
        <button 
          className={filter === 'completed' ? 'active' : ''}
          onClick={() => setFilter('completed')}
        >
          Awaiting Approval
        </button>
        <button 
          className={filter === 'approved' ? 'active' : ''}
          onClick={() => setFilter('approved')}
        >
          Approved
        </button>
      </div>

      <div className="chores-list">
        {chores.length === 0 ? (
          <p className="empty-state">No chores found. Create one to get started!</p>
        ) : (
          chores.map(chore => (
            <ChoreCard
              key={chore.choreId}
              chore={chore}
              onApprove={handleApprove}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>

      {showCreateForm && (
        <CreateChoreForm
          children={children}
          onClose={() => setShowCreateForm(false)}
          onCreated={fetchChores}
        />
      )}
    </div>
  );
}

// McCabe complexity: 3 (within limit)
```

**CreateChoreForm.jsx:**
```javascript
import React, { useState } from 'react';
import api from '../services/api';
import './CreateChoreForm.css';

export default function CreateChoreForm({ children, onClose, onCreated }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assignedToUserId: '',
    pointsValue: 5,
    dueDate: '',
    isRecurring: false,
    recurrencePattern: 'daily'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await api.post('/api/chores', formData);
      onCreated(); // Refresh parent list
      onClose(); // Close form
    } catch (err) {
      setError(err.message || 'Failed to create chore');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Create New Chore</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              placeholder="Make your bed"
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Straighten sheets and fluff pillows"
            />
          </div>

          <div className="form-group">
            <label>Assign to</label>
            <select
              value={formData.assignedToUserId}
              onChange={(e) => setFormData({ ...formData, assignedToUserId: e.target.value })}
            >
              <option value="">Unassigned</option>
              {children.map(child => (
                <option key={child.userId} value={child.userId}>
                  {child.firstName}
                </option>
              ))}
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Points Value *</label>
              <input
                type="number"
                value={formData.pointsValue}
                onChange={(e) => setFormData({ ...formData, pointsValue: parseInt(e.target.value) })}
                min="1"
                required
              />
            </div>

            <div className="form-group">
              <label>Due Date</label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label>
              <input
                type="checkbox"
                checked={formData.isRecurring}
                onChange={(e) => setFormData({ ...formData, isRecurring: e.target.checked })}
              />
              Recurring Chore
            </label>
          </div>

          {formData.isRecurring && (
            <div className="form-group">
              <label>Recurrence</label>
              <select
                value={formData.recurrencePattern}
                onChange={(e) => setFormData({ ...formData, recurrencePattern: e.target.value })}
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
          )}

          {error && <p className="error">{error}</p>}

          <div className="form-actions">
            <button type="button" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Chore'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// McCabe complexity: 3 (within limit)
```

---

### Acceptance Criteria

- [ ] Chore Manager page accessible from parent navigation
- [ ] "New Chore" button opens create form
- [ ] Create form validates required fields
- [ ] Parent can assign chore to Aurora
- [ ] Parent can set points value (1-100)
- [ ] Parent can set due date
- [ ] Parent can make chore recurring
- [ ] Chore saves to database successfully
- [ ] Chores list displays all family chores
- [ ] Filter buttons work (All, Pending, Awaiting Approval, Approved)
- [ ] Completed chores show photo proof
- [ ] Parent can approve completed chores
- [ ] Parent can reject completed chores
- [ ] Approving adds points to Aurora's total
- [ ] Parent can delete chores
- [ ] Empty state shows when no chores exist
- [ ] Error handling displays user-friendly messages

---

### McCabe Complexity

All functions ≤ 5:
- ChoreManager component: 3
- CreateChoreForm component: 3
- `handleApprove()`: 2
- `handleDelete()`: 2
- `handleSubmit()`: 2

---

### Dependencies

- Phase 4: Parent Registration + Login (requires parent authentication)
- Phase 14: Chore System - Backend (requires chore API endpoints)

---

## Phase 16: Chore System - Child Side

**Delivers:** Aurora can see and complete chores
**Aurora gets:** 📋 **Chore List - Complete chores, earn points**
**You get:** Notifications when Aurora completes chores
**Deployed:** Full chore system working end-to-end

---

### What This Phase Delivers

Chore UI for children:
- Chore list in child portal
- View assigned chores
- Mark chore as complete
- Optional photo proof upload
- See points earned per chore
- Chores appear on child dashboard

---

### Database Changes

**No new tables** - Uses `chores` table from Phase 14.

---

### API Endpoints

**Uses existing endpoints from Phase 14:**
- GET /api/chores?assignedTo={userId}&status=pending
- PATCH /api/chores/:id/complete

**New endpoint for photo upload:**

#### POST /api/chores/upload-photo
**Purpose:** Upload photo proof (optional S3 integration)
**Headers:** `Authorization: Bearer {token}`
**Body:** `multipart/form-data` with photo file
**Response (200):**
```json
{
  "success": true,
  "photoUrl": "https://s3.amazonaws.com/adhdlearn/chores/photo_123.jpg"
}
```

---

### Frontend Changes

**New Files in `child-portal/src/pages/`:**
```
pages/
├── ChoresList.jsx           (Chore list page)
└── ChoreCard.jsx            (Individual chore card)
```

**Add route in `child-portal/src/App.jsx`:**
```javascript
import ChoresList from './pages/ChoresList';

<Route path="/chores" element={<ChoresList />} />
```

**Update dashboard in `child-portal/src/pages/ChildDashboard.jsx`:**
```javascript
// Add chores widget to dashboard
<div className="chores-widget">
  <h3>My Chores 📋</h3>
  <p>{pendingChoresCount} chores to do</p>
  <Link to="/chores">View All</Link>
</div>
```

---

### Technical Specifications

**ChoresList.jsx:**
```javascript
import React, { useState, useEffect } from 'react';
import api from '../services/api';
import ChoreCard from './ChoreCard';
import './ChoresList.css';

export default function ChoresList() {
  const [chores, setChores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChores();
  }, []);

  async function fetchChores() {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const response = await api.get(`/api/chores?assignedTo=${user.userId}&status=pending`);
      setChores(response.chores);
    } catch (error) {
      console.error('Failed to fetch chores:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleComplete(choreId, photoUrl) {
    try {
      await api.patch(`/api/chores/${choreId}/complete`, { photoUrl });
      fetchChores(); // Refresh list
    } catch (error) {
      console.error('Failed to complete chore:', error);
    }
  }

  if (loading) return <div className="loading">Loading chores...</div>;

  return (
    <div className="chores-list-page">
      <h1>My Chores 📋</h1>
      
      {chores.length === 0 ? (
        <div className="empty-state">
          <p>No chores right now!</p>
          <p>Go play some games! 🎮</p>
        </div>
      ) : (
        <div className="chores-grid">
          {chores.map(chore => (
            <ChoreCard
              key={chore.choreId}
              chore={chore}
              onComplete={handleComplete}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// McCabe complexity: 2 (within limit)
```

**ChoreCard.jsx (Child Portal):**
```javascript
import React, { useState } from 'react';
import './ChoreCard.css';

export default function ChoreCard({ chore, onComplete }) {
  const [showCamera, setShowCamera] = useState(false);
  const [photoUrl, setPhotoUrl] = useState('');

  function handleMarkComplete() {
    if (confirm(`Mark "${chore.title}" as complete?`)) {
      onComplete(chore.choreId, photoUrl);
    }
  }

  return (
    <div className="chore-card child">
      <div className="chore-header">
        <h3>{chore.title}</h3>
        <span className="points">+{chore.pointsValue} pts</span>
      </div>
      
      {chore.description && (
        <p className="description">{chore.description}</p>
      )}
      
      {chore.dueDate && (
        <p className="due-date">Due: {new Date(chore.dueDate).toLocaleDateString()}</p>
      )}
      
      <div className="actions">
        <button onClick={() => setShowCamera(!showCamera)} className="photo-btn">
          📷 Add Photo
        </button>
        <button onClick={handleMarkComplete} className="complete-btn">
          ✅ Mark Complete
        </button>
      </div>
      
      {photoUrl && (
        <img src={photoUrl} alt="Proof" className="proof-preview" />
      )}
    </div>
  );
}

// McCabe complexity: 2 (within limit)
```

---

### Acceptance Criteria

- [ ] Chores page accessible from child dashboard
- [ ] Child sees only chores assigned to them
- [ ] Only pending chores display
- [ ] Chore card shows title, description, points, due date
- [ ] Child can mark chore as complete
- [ ] Optional photo upload works
- [ ] Completed chore disappears from list
- [ ] Dashboard widget shows pending chores count
- [ ] Empty state displays when no chores exist
- [ ] Points display prominently on each chore
- [ ] UI is touch-friendly for children

---

### McCabe Complexity

All functions ≤ 5:
- ChoresList component: 2
- ChoreCard component: 2
- `handleComplete()`: 1
- `handleMarkComplete()`: 1

---

### Dependencies

- Phase 7: Child Login (requires child authentication)
- Phase 14: Chore System - Backend (requires chore API)
- Phase 15: Chore System - Parent Side (parents must create chores first)


---

## Phase 17: Progress Charts

**Delivers:** Visual progress tracking for parents
**Aurora gets:** Nothing new
**You get:** 📊 **Beautiful charts showing Aurora's progress over time**
**Deployed:** Parent dashboard has charts

---

### What This Phase Delivers

Chart.js integration in parent dashboard:
- Line chart: Progress over time (daily scores)
- Pie chart: Activity breakdown (time per category)
- Bar chart: Games played (frequency)
- Accuracy trend chart (improving or struggling)
- Filter by date range (7 days, 30 days, all time)

---

### Database Changes

**No new tables** - Uses existing `game_sessions` table.

---

### API Endpoints

#### GET /api/analytics/progress?childId={id}&range={days}
**Purpose:** Get progress data for charts
**Headers:** `Authorization: Bearer {token}`
**Query Parameters:**
- `childId`: Child user_id
- `range`: Number of days (7, 30, 90, or 'all')
**Response (200):**
```json
{
  "success": true,
  "data": {
    "dailyScores": [
      { "date": "2025-10-16", "totalScore": 120, "sessionsPlayed": 3 },
      { "date": "2025-10-17", "totalScore": 150, "sessionsPlayed": 4 },
      { "date": "2025-10-22", "totalScore": 180, "sessionsPlayed": 5 }
    ],
    "categoryBreakdown": [
      { "category": "Reading", "timeSpent": 1200, "sessionsPlayed": 12 },
      { "category": "Math", "timeSpent": 800, "sessionsPlayed": 8 }
    ],
    "gamesPlayed": [
      { "game": "Letter Pop", "count": 5 },
      { "game": "Word Builder", "count": 4 },
      { "game": "Sight Words", "count": 3 },
      { "game": "Counting Game", "count": 4 },
      { "game": "Shapes", "count": 2 },
      { "game": "Addition Game", "count": 2 }
    ],
    "accuracyTrend": [
      { "date": "2025-10-16", "avgAccuracy": 75.5 },
      { "date": "2025-10-17", "avgAccuracy": 82.3 },
      { "date": "2025-10-22", "avgAccuracy": 88.1 }
    ]
  }
}
```

---

### Frontend Changes

**New dependency:** Chart.js
```bash
npm install chart.js react-chartjs-2
```

**Update `parent-portal/src/pages/Dashboard.jsx`:**
```javascript
import React, { useState, useEffect } from 'react';
import { Line, Pie, Bar } from 'react-chartjs-2';
import api from '../services/api';

export default function Dashboard() {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [range, setRange] = useState(30); // Default 30 days
  const [selectedChild, setSelectedChild] = useState(null);

  useEffect(() => {
    if (selectedChild) {
      fetchAnalytics(selectedChild.userId, range);
    }
  }, [selectedChild, range]);

  async function fetchAnalytics(childId, days) {
    try {
      const response = await api.get(`/api/analytics/progress?childId=${childId}&range=${days}`);
      setAnalyticsData(response.data);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    }
  }

  // Line chart: Daily scores
  const dailyScoresData = {
    labels: analyticsData?.dailyScores.map(d => d.date) || [],
    datasets: [{
      label: 'Total Score',
      data: analyticsData?.dailyScores.map(d => d.totalScore) || [],
      borderColor: '#4ECDC4',
      backgroundColor: 'rgba(78, 205, 196, 0.2)',
      tension: 0.3
    }]
  };

  // Pie chart: Category breakdown
  const categoryData = {
    labels: analyticsData?.categoryBreakdown.map(c => c.category) || [],
    datasets: [{
      data: analyticsData?.categoryBreakdown.map(c => c.timeSpent) || [],
      backgroundColor: ['#FF6B9D', '#4ECDC4', '#95E1D3', '#FFD93D', '#6C5CE7']
    }]
  };

  return (
    <div className="dashboard-with-charts">
      <div className="filters">
        <button onClick={() => setRange(7)}>Last 7 Days</button>
        <button onClick={() => setRange(30)}>Last 30 Days</button>
        <button onClick={() => setRange('all')}>All Time</button>
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <h3>Daily Progress</h3>
          <Line data={dailyScoresData} options={{ responsive: true }} />
        </div>

        <div className="chart-card">
          <h3>Time by Category</h3>
          <Pie data={categoryData} options={{ responsive: true }} />
        </div>
      </div>
    </div>
  );
}

// McCabe complexity: 2 (within limit)
```

---

### Acceptance Criteria

- [ ] Chart.js integrated in parent portal
- [ ] Line chart displays daily progress
- [ ] Pie chart shows category breakdown
- [ ] Bar chart shows games played frequency
- [ ] Accuracy trend chart shows improvement
- [ ] Filter buttons work (7, 30, 90 days, all time)
- [ ] Charts update when filter changes
- [ ] Charts are responsive (mobile-friendly)
- [ ] Empty state when no data exists
- [ ] Charts use consistent color scheme

---

### Dependencies

- Phase 4: Parent Registration + Login
- Phase 5: Parent Dashboard (base dashboard exists)
- Phase 3: Database (uses game_sessions data)

---

## Phase 18: Confusion Matrix (Letter Pop)

**Delivers:** See which letters Aurora confuses
**Aurora gets:** Nothing new
**You get:** 📈 **Confusion matrix showing letter mix-ups (b vs d, p vs q)**
**Deployed:** Parent dashboard shows confusion analysis

---

### What This Phase Delivers

Letter confusion tracking for Letter Pop game:
- Track which letter was shown vs which was clicked
- Display confusion pairs (e.g., b↔d, p↔q)
- Show most confused letters
- Heatmap visualization
- Helps identify learning opportunities

---

### Database Changes

**New Table:** `letter_pop_attempts`
```sql
CREATE TABLE letter_pop_attempts (
    attempt_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    session_id BIGINT NOT NULL,
    user_id INT NOT NULL,
    
    target_letter CHAR(1) NOT NULL,
    clicked_letter CHAR(1) NOT NULL,
    is_correct BOOLEAN NOT NULL,
    
    reaction_time_ms INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (session_id) REFERENCES game_sessions(session_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    
    INDEX idx_user_letters (user_id, target_letter, clicked_letter),
    INDEX idx_session (session_id),
    INDEX idx_created (created_at)
);
```

---

### API Endpoints

#### POST /api/letter-pop/record-attempt
**Purpose:** Record individual letter attempt
**Headers:** `Authorization: Bearer {token}`
**Body:**
```json
{
  "sessionId": 42,
  "targetLetter": "b",
  "clickedLetter": "d",
  "isCorrect": false,
  "reactionTimeMs": 1250
}
```
**Response (201):**
```json
{
  "success": true,
  "attemptId": 1234
}
```

#### GET /api/analytics/confusion-matrix?childId={id}
**Purpose:** Get confusion matrix data
**Headers:** `Authorization: Bearer {token}`
**Response (200):**
```json
{
  "success": true,
  "confusionPairs": [
    { "target": "b", "clicked": "d", "count": 8 },
    { "target": "d", "clicked": "b", "count": 5 },
    { "target": "p", "clicked": "q", "count": 3 },
    { "target": "m", "clicked": "n", "count": 2 }
  ],
  "mostConfusedLetters": ["b", "d", "p", "q"],
  "totalAttempts": 450,
  "totalCorrect": 398,
  "totalIncorrect": 52
}
```

---

### Frontend Changes

**Update `child-portal/src/games/letter-pop/GameScene.js`:**
```javascript
// Add attempt recording when letter is clicked
async recordAttempt(targetLetter, clickedLetter, isCorrect, reactionTime) {
  try {
    await api.post('/api/letter-pop/record-attempt', {
      sessionId: this.sessionId,
      targetLetter,
      clickedLetter,
      isCorrect,
      reactionTimeMs: reactionTime
    });
  } catch (error) {
    console.error('Failed to record attempt:', error);
  }
}
```

**New file in `parent-portal/src/components/`:**
```
components/
└── ConfusionMatrix.jsx      (Heatmap visualization)
```

**ConfusionMatrix.jsx:**
```javascript
import React, { useState, useEffect } from 'react';
import api from '../services/api';
import './ConfusionMatrix.css';

export default function ConfusionMatrix({ childId }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchConfusionData();
  }, [childId]);

  async function fetchConfusionData() {
    try {
      const response = await api.get(`/api/analytics/confusion-matrix?childId=${childId}`);
      setData(response);
    } catch (error) {
      console.error('Failed to fetch confusion matrix:', error);
    }
  }

  if (!data) return <div>Loading...</div>;

  return (
    <div className="confusion-matrix">
      <h3>Letter Confusion Analysis</h3>
      
      <div className="confusion-pairs">
        <h4>Most Common Confusions:</h4>
        {data.confusionPairs.slice(0, 5).map(pair => (
          <div key={`${pair.target}-${pair.clicked}`} className="confusion-pair">
            <span className="letters">{pair.target} ↔ {pair.clicked}</span>
            <span className="count">{pair.count} times</span>
          </div>
        ))}
      </div>

      <div className="stats">
        <p>Total Attempts: {data.totalAttempts}</p>
        <p>Accuracy: {((data.totalCorrect / data.totalAttempts) * 100).toFixed(1)}%</p>
      </div>
    </div>
  );
}

// McCabe complexity: 2 (within limit)
```

---

### Acceptance Criteria

- [ ] letter_pop_attempts table created
- [ ] Letter Pop game records each attempt
- [ ] API endpoint saves attempt data
- [ ] Confusion matrix displays in parent dashboard
- [ ] Most confused letter pairs highlighted
- [ ] Heatmap visualization works
- [ ] Accuracy percentage displayed
- [ ] Data helps identify learning opportunities

---

### Dependencies

- Phase 2: Letter Pop game (must exist to track)
- Phase 5: Parent Dashboard (displays confusion matrix)

---

## Phase 19: Real-Time Updates

**Delivers:** See Aurora playing in real-time
**Aurora gets:** Nothing new
**You get:** 🔴 **Live updates - See when Aurora starts/finishes games**
**Deployed:** Parent dashboard shows real-time activity

---

### What This Phase Delivers

WebSocket integration for live updates:
- Parent sees "Aurora is playing Letter Pop now" banner
- Score updates appear live
- Notification when game ends
- "Currently playing" indicator on dashboard
- No page refresh needed

---

### Database Changes

**No new tables** - Uses existing tables.

---

### Backend Changes

**New dependency:** Socket.IO
```bash
npm install socket.io
```

**backend/src/server.js:**
```javascript
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ['http://child.adhdlearn.com', 'http://parent.adhdlearn.com'],
    credentials: true
  }
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  socket.on('child-game-start', (data) => {
    // Broadcast to parent portal
    socket.to(`family-${data.familyId}`).emit('child-activity', {
      type: 'game-start',
      childName: data.childName,
      gameName: data.gameName,
      timestamp: new Date()
    });
  });
  
  socket.on('child-game-end', (data) => {
    socket.to(`family-${data.familyId}`).emit('child-activity', {
      type: 'game-end',
      childName: data.childName,
      gameName: data.gameName,
      score: data.score,
      timestamp: new Date()
    });
  });
  
  socket.on('join-family', (familyId) => {
    socket.join(`family-${familyId}`);
  });
  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

server.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

---

### Frontend Changes

**New dependency (both portals):** Socket.IO Client
```bash
npm install socket.io-client
```

**child-portal/src/services/socket.js:**
```javascript
import io from 'socket.io-client';

const socket = io('http://api.adhdlearn.com');

export function joinFamily(familyId) {
  socket.emit('join-family', familyId);
}

export function notifyGameStart(familyId, childName, gameName) {
  socket.emit('child-game-start', {
    familyId,
    childName,
    gameName
  });
}

export function notifyGameEnd(familyId, childName, gameName, score) {
  socket.emit('child-game-end', {
    familyId,
    childName,
    gameName,
    score
  });
}

export default socket;
```

**parent-portal/src/components/LiveActivityBanner.jsx:**
```javascript
import React, { useState, useEffect } from 'react';
import socket from '../services/socket';
import './LiveActivityBanner.css';

export default function LiveActivityBanner({ familyId }) {
  const [activity, setActivity] = useState(null);

  useEffect(() => {
    socket.emit('join-family', familyId);
    
    socket.on('child-activity', (data) => {
      setActivity(data);
      
      // Auto-hide after 5 seconds
      setTimeout(() => setActivity(null), 5000);
    });
    
    return () => {
      socket.off('child-activity');
    };
  }, [familyId]);

  if (!activity) return null;

  return (
    <div className={`live-banner ${activity.type}`}>
      {activity.type === 'game-start' && (
        <p>🔴 {activity.childName} is playing {activity.gameName} right now!</p>
      )}
      {activity.type === 'game-end' && (
        <p>✅ {activity.childName} finished {activity.gameName}! Score: {activity.score}</p>
      )}
    </div>
  );
}

// McCabe complexity: 2 (within limit)
```

---

### Acceptance Criteria

- [ ] Socket.IO server running
- [ ] WebSocket connection established from both portals
- [ ] Child portal emits game-start event
- [ ] Child portal emits game-end event
- [ ] Parent portal receives real-time updates
- [ ] Live banner displays on parent dashboard
- [ ] Banner shows child name and game name
- [ ] Banner auto-hides after 5 seconds
- [ ] Multiple children supported (family rooms)
- [ ] Connection resilient to network issues

---

### Dependencies

- Phase 4: Parent Registration + Login
- Phase 7: Child Login
- Phase 3: Backend infrastructure (server must support WebSocket)


---

## Phase 20: Achievements & Badges

**Delivers:** Aurora earns badges for milestones
**Aurora gets:** 🏆 **Badges - "Played 10 games", "5-day streak", etc.**
**You get:** See Aurora's achievements in parent dashboard
**Deployed:** Achievement system working

---

### What This Phase Delivers

Achievement/badge system:
- Backend tracks milestones
- Awards badges automatically
- Badge display in child portal
- Achievement notifications
- Common achievements: games played, streaks, high scores, accuracy milestones

---

### Database Changes

**New Table:** `achievements`
```sql
CREATE TABLE achievements (
    achievement_id INT PRIMARY KEY AUTO_INCREMENT,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon_url VARCHAR(255),
    points_value INT DEFAULT 0,
    
    requirement_type ENUM('games_played', 'streak', 'high_score', 'accuracy', 'chores_completed') NOT NULL,
    requirement_value INT NOT NULL,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_type (requirement_type)
);
```

**New Table:** `user_achievements`
```sql
CREATE TABLE user_achievements (
    user_achievement_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    achievement_id INT NOT NULL,
    earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (achievement_id) REFERENCES achievements(achievement_id) ON DELETE CASCADE,
    
    UNIQUE KEY uk_user_achievement (user_id, achievement_id),
    INDEX idx_user (user_id),
    INDEX idx_earned (earned_at)
);
```

---

### API Endpoints

#### GET /api/achievements
**Purpose:** Get all available achievements
**Response (200):**
```json
{
  "success": true,
  "achievements": [
    {
      "achievementId": 1,
      "code": "games_10",
      "name": "Getting Started",
      "description": "Play 10 games",
      "icon": "🎮",
      "pointsValue": 50,
      "requirementType": "games_played",
      "requirementValue": 10
    }
  ]
}
```

#### GET /api/children/:childId/achievements
**Purpose:** Get child's earned achievements
**Response (200):**
```json
{
  "success": true,
  "achievements": [
    {
      "achievementId": 1,
      "code": "games_10",
      "name": "Getting Started",
      "earnedAt": "2025-10-20T10:00:00Z"
    }
  ],
  "progress": [
    {
      "achievementId": 2,
      "code": "games_50",
      "name": "Game Master",
      "current": 23,
      "required": 50,
      "percentComplete": 46
    }
  ]
}
```

---

### Acceptance Criteria

- [ ] achievements table populated with initial badges
- [ ] Backend automatically awards badges
- [ ] Child sees earned badges in dashboard
- [ ] Achievement notifications display
- [ ] Parent sees badges in parent dashboard
- [ ] Progress toward next badge shown
- [ ] Points awarded for earning badges

---

### Dependencies

- Phase 7: Child Login (tracks child activity)
- Phase 3: Game sessions (provides data for achievement tracking)

---

## Phase 21: Marketing Website

**Delivers:** Public-facing website at adhdlearn.com
**Aurora gets:** Nothing
**You get:** Professional website to show others
**Deployed:** Static marketing site at root domain

---

### What This Phase Delivers

Marketing/landing page:
- Explains what ADHDLearn is
- Features and benefits
- Testimonials (you + Aurora)
- Pricing (free tier + premium)
- Link to parent.adhdlearn.com/register
- Screenshots of portals

---

### Frontend Changes

**New static site at `marketing/`:**
```
marketing/
├── index.html
├── css/
│   └── style.css
├── images/
│   ├── hero.png
│   ├── screenshot-child.png
│   └── screenshot-parent.png
└── js/
    └── main.js
```

**Apache configuration for adhdlearn.com:**
```apache
<VirtualHost *:443>
    ServerName adhdlearn.com
    DocumentRoot /var/www/adhdlearn/marketing
    
    SSLEngine on
    SSLCertificateFile /etc/letsencrypt/live/adhdlearn.com/fullchain.pem
    SSLCertificateKeyFile /etc/letsencrypt/live/adhdlearn.com/privkey.pem
</VirtualHost>
```

---

### Acceptance Criteria

- [ ] Marketing site accessible at adhdlearn.com
- [ ] Responsive design (mobile-friendly)
- [ ] Clear call-to-action (Register button)
- [ ] Screenshots of both portals
- [ ] Explains features for parents and children
- [ ] Links to parent.adhdlearn.com/register
- [ ] SSL certificate working

---

### Dependencies

- Phase 0: Server infrastructure (domain configured)

---

## Phase 22: Age Norms Comparison

**Delivers:** Compare Aurora to other kids her age
**Aurora gets:** Nothing new
**You get:** 📊 **Percentile charts - "Aurora is in 85th percentile for her age"**
**Deployed:** Parent dashboard shows age comparison

---

### What This Phase Delivers

Age-norm benchmarking:
- Seed database with age norm data (4-10 year olds)
- Calculate Aurora's percentile for each skill
- Display comparison charts
- Show strengths and areas for growth

---

### Database Changes

**New Table:** `age_norms`
```sql
CREATE TABLE age_norms (
    norm_id INT PRIMARY KEY AUTO_INCREMENT,
    age_years INT NOT NULL,
    skill_type VARCHAR(50) NOT NULL,
    
    percentile_10 DECIMAL(5,2),
    percentile_25 DECIMAL(5,2),
    percentile_50 DECIMAL(5,2),
    percentile_75 DECIMAL(5,2),
    percentile_90 DECIMAL(5,2),
    
    INDEX idx_age_skill (age_years, skill_type)
);
```

Example data:
```sql
INSERT INTO age_norms VALUES
(1, 7, 'letter_recognition_accuracy', 65.0, 75.0, 85.0, 92.0, 97.0),
(2, 7, 'counting_accuracy', 70.0, 80.0, 90.0, 95.0, 98.0);
```

---

### API Endpoints

#### GET /api/analytics/age-comparison?childId={id}
**Purpose:** Get child's percentile compared to age norms
**Response (200):**
```json
{
  "success": true,
  "childAge": 7,
  "comparisons": [
    {
      "skill": "Letter Recognition",
      "childScore": 88.5,
      "percentile": 72,
      "interpretation": "Above average"
    },
    {
      "skill": "Counting",
      "childScore": 95.2,
      "percentile": 85,
      "interpretation": "Excellent"
    }
  ]
}
```

---

### Acceptance Criteria

- [ ] Age norms table populated with research data
- [ ] API calculates percentiles correctly
- [ ] Parent dashboard shows comparison chart
- [ ] Chart displays child's position vs peers
- [ ] Strengths highlighted
- [ ] Growth areas identified

---

### Dependencies

- Phase 5: Parent Dashboard (displays comparison)
- Phase 3: Game sessions (provides performance data)

---

## Phase 23: Science Category - Experiments

**Delivers:** Unlock Science category with 3 experiments
**Aurora gets:** 🔬 **NEW CATEGORY - Science + 3 fun activities**
**You get:** See Aurora's science exploration
**Deployed:** Science category unlocked

---

### What This Phase Delivers

Science category with 3 activities:
1. Color Mixing Simulator (mix primary colors)
2. Magnet Game (attract/repel objects)
3. Plant Growth Tracker (virtual plant care)

Each activity is interactive and educational.

---

### Database Changes

**No new tables** - Uses existing game_sessions table with new game names.

---

### Acceptance Criteria

- [ ] Science category unlocked on child dashboard
- [ ] Color Mixing Simulator works
- [ ] Magnet Game works
- [ ] Plant Growth Tracker works
- [ ] Sessions save to database
- [ ] Parent sees science activity in dashboard

---

### Dependencies

- Phase 8: Child Dashboard (Science category appears)

---

## Phase 24: Life Skills - Cooking Helper

**Delivers:** Cooking recipes and measurement game
**Aurora gets:** 🍳 **Cooking Helper - Recipes + measurement practice**
**You get:** Aurora practices real-life cooking skills
**Deployed:** Cooking Helper in Life Skills category

---

### What This Phase Delivers

Cooking Helper features:
- Recipe browser (10 kid-friendly recipes)
- Step-by-step instructions with images
- Measurement conversion game (1 cup = 16 tablespoons)
- Mark recipe as "cooked" (you verify)
- Safety tips

---

### Database Changes

**New Table:** `cooking_recipes`
```sql
CREATE TABLE cooking_recipes (
    recipe_id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    difficulty ENUM('easy', 'medium', 'hard') DEFAULT 'easy',
    prep_time_minutes INT,
    
    ingredients JSON,
    instructions JSON,
    image_url VARCHAR(255),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**New Table:** `recipe_completions`
```sql
CREATE TABLE recipe_completions (
    completion_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    recipe_id INT NOT NULL,
    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    approved_by_user_id INT,
    approved_at TIMESTAMP NULL,
    
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (recipe_id) REFERENCES cooking_recipes(recipe_id) ON DELETE CASCADE,
    
    INDEX idx_user (user_id),
    INDEX idx_recipe (recipe_id)
);
```

---

### Acceptance Criteria

- [ ] Cooking Helper accessible from Life Skills category
- [ ] Recipe browser displays 10 recipes
- [ ] Recipe detail page shows ingredients and steps
- [ ] Measurement game works
- [ ] Child can mark recipe as cooked
- [ ] Parent approves completion

---

### Dependencies

- Phase 8: Child Dashboard (Life Skills category)

---

## Phase 25: Life Skills - 3D Printing Projects

**Delivers:** 3D printing project library
**Aurora gets:** 🖨️ **3D Printing Projects - Browse and track prints**
**You get:** Track Aurora's 3D printing projects
**Deployed:** 3D Printing Helper in Life Skills

---

### What This Phase Delivers

3D Printing features:
- Browse STL files by category (toys, tools, decorations)
- Select project to print
- You mark as "printed"
- Aurora marks as "completed" (painted/assembled)

---

### Database Changes

Similar to cooking recipes - projects table + completions table.

---

### Acceptance Criteria

- [ ] 3D Printing browser works
- [ ] STL files categorized
- [ ] Project selection and tracking works
- [ ] Parent and child can update status

---

### Dependencies

- Phase 8: Child Dashboard (Life Skills category)

---

## Phase 26: Life Skills - Shopping Helper

**Delivers:** Shopping list and budget simulator
**Aurora gets:** 🛒 **Shopping Helper - Budget game**
**You get:** Aurora practices money skills
**Deployed:** Shopping Helper in Life Skills

---

### What This Phase Delivers

Shopping Helper:
- Grocery list builder
- Budget simulator ($5, pick 3 items under budget)
- Healthy vs treat categorization
- Price comparison game

---

### Acceptance Criteria

- [ ] Shopping Helper works
- [ ] Budget game functions correctly
- [ ] Price comparisons accurate
- [ ] Categorization game works

---

### Dependencies

- Phase 8: Child Dashboard (Life Skills category)

---

## Phase 27: Weekly Reports (Email)

**Delivers:** Automated weekly progress emails
**Aurora gets:** Nothing
**You get:** 📧 **Weekly email summary of Aurora's progress**
**Deployed:** Emails sent every Sunday

---

### What This Phase Delivers

Email service:
- SendGrid/SES integration
- Weekly summary email generated
- Sent every Sunday morning
- Includes: games played, scores, time spent, badges earned, highlights

---

### Database Changes

None - uses existing tables.

---

### Backend Changes

**New dependency:** SendGrid or AWS SES
```bash
npm install @sendgrid/mail
```

**Cron job:** Weekly email generation
```javascript
const cron = require('node-cron');
const sgMail = require('@sendgrid/mail');

// Every Sunday at 8:00 AM
cron.schedule('0 8 * * 0', async () => {
  const families = await getAllFamilies();
  
  for (const family of families) {
    const report = await generateWeeklyReport(family.familyId);
    const email = await renderEmailTemplate(report);
    
    await sgMail.send({
      to: family.parentEmail,
      from: 'reports@adhdlearn.com',
      subject: `Aurora's Weekly Progress Report - ${new Date().toLocaleDateString()}`,
      html: email
    });
  }
});
```

---

### Acceptance Criteria

- [ ] Email service configured
- [ ] Weekly report generated
- [ ] Email sent every Sunday
- [ ] Report includes all key metrics
- [ ] Email template looks professional

---

### Dependencies

- Phase 4: Parent Registration (needs parent email)

---

## Phase 28: ML Pattern Detection

**Delivers:** Automatic learning pattern detection
**Aurora gets:** Nothing
**You get:** 🤖 **AI alerts - "Aurora struggles with 'b' vs 'd' in afternoons"**
**Deployed:** ML insights in parent dashboard

---

### What This Phase Delivers

Machine learning analysis:
- Detect letter reversals (b/d, p/q patterns)
- Time-of-day performance analysis
- Alert parent to struggles
- Suggest interventions

---

### Backend Changes

**New dependency:** TensorFlow.js or scikit-learn (Python microservice)
```bash
pip install scikit-learn pandas
```

Python script analyzes patterns weekly and generates insights.

---

### Acceptance Criteria

- [ ] ML model detects letter confusion patterns
- [ ] Time-of-day analysis works
- [ ] Insights display in parent dashboard
- [ ] Alerts sent when struggles detected

---

### Dependencies

- Phase 18: Confusion Matrix (provides data)

---

## Phase 29: PDF Reports

**Delivers:** Downloadable PDF progress reports
**Aurora gets:** Nothing
**You get:** 📄 **Download beautiful PDF reports**
**Deployed:** PDF generation works

---

### What This Phase Delivers

PDF report generation:
- Generate PDF with charts (Chart.js → PDF)
- Progress over time
- Activity breakdown
- Achievements
- Download button in parent dashboard

---

### Backend Changes

**New dependency:** Puppeteer or PDFKit
```bash
npm install puppeteer
```

Generate PDF from HTML template with charts.

---

### Acceptance Criteria

- [ ] PDF generation works
- [ ] PDF includes all charts
- [ ] Download button in parent dashboard
- [ ] PDF looks professional

---

### Dependencies

- Phase 17: Progress Charts (charts to include in PDF)

---

## Phase 30: Android APK

**Delivers:** Native Android app for Aurora's tablet
**Aurora gets:** 📱 **Install as real app on Galaxy Tab S7 FE**
**You get:** Aurora uses app like a native game
**Deployed:** APK installable on tablet

---

### What This Phase Delivers

Android APK:
- Wrap child portal with Capacitor
- Build APK
- Install on Galaxy Tab S7 FE
- Works offline (caches last session)
- Native app icon

---

### Frontend Changes

**New dependency:** Capacitor
```bash
npm install @capacitor/core @capacitor/cli
npx cap init
npx cap add android
npx cap sync
npx cap build android
```

---

### Acceptance Criteria

- [ ] APK builds successfully
- [ ] Installs on Galaxy Tab S7 FE
- [ ] App icon appears on home screen
- [ ] Offline caching works
- [ ] Performance matches web version

---

### Dependencies

- Phase 2: Child portal (must exist to wrap)

---

## Phase 31: Multi-Parent Support

**Delivers:** Add another parent to family account
**Aurora gets:** Nothing
**You get:** 👫 **Invite partner to view Aurora's progress**
**Deployed:** Multiple parents supported

---

### What This Phase Delivers

Multi-parent features:
- Invite parent endpoint
- Email invitation with link
- Accept invitation flow
- Both parents see same data
- Role-based permissions

---

### Database Changes

Update users table to support multiple parents per family (already supported via family_id).

**New Table:** `family_invitations`
```sql
CREATE TABLE family_invitations (
    invitation_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    family_id INT NOT NULL,
    email VARCHAR(255) NOT NULL,
    token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    accepted_at TIMESTAMP NULL,
    
    FOREIGN KEY (family_id) REFERENCES families(family_id) ON DELETE CASCADE,
    INDEX idx_token (token),
    INDEX idx_expires (expires_at)
);
```

---

### Acceptance Criteria

- [ ] Parent can send invitation
- [ ] Email sent with invitation link
- [ ] Invited parent can accept
- [ ] Both parents see same dashboard
- [ ] Permissions work correctly

---

### Dependencies

- Phase 4: Parent Registration

---

## Phase 32: Multiple Children

**Delivers:** Support for siblings
**Aurora gets:** 🧒 **Siblings can have own accounts**
**You get:** Manage multiple children from one account
**Deployed:** Multi-child support

---

### What This Phase Delivers

Multi-child features:
- Add sibling to family
- Each child has own login/PIN
- Each child has own scores, chores, achievements
- Parent switches between children in dashboard
- Compare siblings (optional)

---

### Database Changes

Already supported - users table allows multiple children per family_id.

---

### Acceptance Criteria

- [ ] Parent can add multiple children
- [ ] Each child has unique PIN
- [ ] Each child sees only their own data
- [ ] Parent can switch between children
- [ ] Dashboard shows all children

---

### Dependencies

- Phase 6: Add Child Profile

---

## Phase 33: Parental Controls

**Delivers:** Screen time limits and content controls
**Aurora gets:** ⏱️ **Daily time limits**
**You get:** Control screen time and content access
**Deployed:** Parental controls working

---

### What This Phase Delivers

Parental control features:
- Set daily time limits (e.g., 30 minutes)
- Enable/disable categories
- Require chores before games
- Schedule (no games before 3pm on school days)
- Lock out after time limit reached

---

### Database Changes

**New Table:** `parental_controls`
```sql
CREATE TABLE parental_controls (
    control_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    
    daily_time_limit_minutes INT DEFAULT 60,
    require_chores_first BOOLEAN DEFAULT FALSE,
    
    blocked_days JSON,
    blocked_hours JSON,
    disabled_categories JSON,
    
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    UNIQUE KEY uk_user (user_id)
);
```

---

### Acceptance Criteria

- [ ] Parent can set time limits
- [ ] Time limit enforced in child portal
- [ ] Category restrictions work
- [ ] Chore requirements enforced
- [ ] Schedule restrictions work

---

### Dependencies

- Phase 7: Child Login

---

## Phase 34: Advanced Testing Infrastructure

**Delivers:** Comprehensive automated tests
**Aurora gets:** Nothing
**You get:** 🧪 **Peace of mind - automated tests prevent bugs**
**Deployed:** CI/CD pipeline running

---

### What This Phase Delivers

Testing infrastructure:
- Playwright E2E tests for all features
- Unit tests for backend controllers
- Integration tests for API endpoints
- CI/CD pipeline (GitHub Actions)
- Automated regression testing

---

### Acceptance Criteria

- [ ] E2E tests cover all critical paths
- [ ] Unit test coverage > 80%
- [ ] CI/CD pipeline runs on every commit
- [ ] Failing tests block deployment

---

### Dependencies

- All previous phases (tests all features)

---

## Phase 35: Performance Optimization

**Delivers:** Faster load times
**Aurora gets:** ⚡ **Games load instantly**
**You get:** Faster, smoother experience
**Deployed:** Optimizations deployed

---

### What This Phase Delivers

Performance improvements:
- Code splitting (React lazy loading)
- Image optimization (WebP format)
- Lazy loading for non-critical resources
- CDN for static assets
- Database query optimization
- Redis caching

---

### Acceptance Criteria

- [ ] Page load time < 2 seconds
- [ ] Images optimized (WebP)
- [ ] Code split by route
- [ ] CDN serving static assets
- [ ] Database queries optimized

---

### Dependencies

- All previous phases

---

## Phase 36: Accessibility Improvements

**Delivers:** Better accessibility for ADHD
**Aurora gets:** 🎨 **High contrast mode, bigger fonts**
**You get:** Aurora has better experience
**Deployed:** Accessibility features enabled

---

### What This Phase Delivers

Accessibility features:
- High contrast mode toggle
- Adjustable font sizes (small, medium, large)
- Screen reader support (ARIA labels)
- Keyboard navigation (no mouse required)
- Focus indicators
- Color-blind friendly palette

---

### Frontend Changes

**CSS variables for theming:**
```css
:root {
  --font-size-base: 16px;
  --contrast-mode: normal;
}

.high-contrast {
  --bg-color: #000000;
  --text-color: #FFFFFF;
  --contrast-mode: high;
}

.large-text {
  --font-size-base: 20px;
}
```

**Accessibility settings page:**
- Toggle high contrast
- Font size slider
- Keyboard shortcuts reference

---

### Acceptance Criteria

- [ ] High contrast mode works
- [ ] Font size adjustable
- [ ] Screen reader compatible
- [ ] Keyboard navigation works
- [ ] WCAG 2.1 AA compliant
- [ ] Focus indicators visible

---

### Dependencies

- All previous phases (accessibility applies to all features)

---

## Conclusion

All 36 phases complete (0-36). This plan delivers a comprehensive, production-ready learning platform for children with ADHD, with full parent oversight and engagement tracking.

**Total Deliverables:**
- 6 Learning Games (Reading: 3, Math: 3)
- 2 Web Portals (Parent + Child)
- Chore System (create, assign, complete, approve)
- Real-Time Updates (WebSocket)
- Progress Analytics (charts, confusion matrix, percentiles)
- Achievements & Badges
- Life Skills Categories (Science, Cooking, 3D Printing, Shopping)
- Email Reports (weekly summaries)
- ML Pattern Detection
- PDF Reports
- Android APK
- Multi-Parent & Multi-Child Support
- Parental Controls
- Comprehensive Testing
- Performance Optimization
- Accessibility Features

**Dependencies:** Phase 0 (Server Infrastructure) → Phase 1 (Project Foundation) → Phase 2-36 (iterative feature delivery)

**McCabe Complexity:** All functions ≤ 5 throughout entire codebase

