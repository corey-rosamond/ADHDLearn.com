# Technology Stack

**Last Updated:** October 25, 2025
**Status:** Current and Active

---

## Frontend

### Child Portal (child.adhdlearn.com)
- **Framework:** React 18+ with Vite
- **Game Engine:** Phaser 3.80.1+
- **UI Library:** Tailwind CSS
- **State Management:** React Context API
- **Build Tool:** Vite
- **Language:** JavaScript (ES6+)

### Parent Portal (parent.adhdlearn.com)
- **Framework:** React 18+ with Vite
- **UI Library:** Tailwind CSS
- **Charts:** Chart.js
- **State Management:** React Context API
- **Build Tool:** Vite
- **Language:** JavaScript (ES6+)

### Marketing Site (adhdlearn.com)
- **Technology:** Static HTML/CSS/JS
- **Framework:** None (vanilla)

---

## Backend

### API Server (api.adhdlearn.com)
- **Runtime:** Node.js 18+ LTS
- **Framework:** Express.js
- **Language:** JavaScript (ES6+) or TypeScript
- **Authentication:** JWT (jsonwebtoken)
- **Password Hashing:** bcrypt
- **Validation:** express-validator
- **CORS:** cors middleware
- **Process Manager:** PM2

### Real-Time (WebSocket)
- **Library:** Socket.io
- **Port:** 5001
- **Integration:** Runs alongside Express

### Background Jobs
- **Scheduler:** node-cron
- **Tasks:** Weekly reports, ML pattern detection, badge awards

---

## Database

### Primary Database
- **RDBMS:** MySQL 8.0+
- **Host:** 160.153.180.159
- **Database Name:** adhdlearn
- **Driver:** mysql2 (Node.js)
- **ORM:** None (raw SQL queries preferred for simplicity)

### Session/Cache
- **Technology:** Redis (optional, Phase 35+)
- **Purpose:** Session storage, real-time data caching

---

## Deployment

### Web Hosting
- **Server:** Apache 2.4+
- **OS:** Linux (Debian-based)
- **SSL:** Let's Encrypt (certbot)
- **Domains:** 8 virtual hosts (staging + prod for 4 subdomains)
- **Root Paths:**
  - Production: `/var/www/[subdomain].adhdlearn.com/production/`
  - Staging: `/var/www/[subdomain].adhdlearn.com/staging/`

### Subdomains
1. **adhdlearn.com** - Marketing website
2. **child.adhdlearn.com** - Child portal (games, learning)
3. **parent.adhdlearn.com** - Parent dashboard
4. **api.adhdlearn.com** - Backend API

### Android App
- **Wrapper:** Capacitor
- **Target:** Android 8+ (API 26+)
- **Build:** Capacitor CLI + Android Studio
- **Primary Device:** Samsung Galaxy Tab S7 FE (2560x1600)

### CI/CD
- **Platform:** GitHub Actions (Phase 34+)
- **Branches:**
  - `staging` - Development branch
  - `main` - Production branch
- **Deployment:** SSH to server, git pull, restart services

---

## External Services

### Email
- **Provider:** SendGrid or AWS SES (Phase 27)
- **Purpose:** Weekly reports, password resets

### File Storage
- **Provider:** AWS S3 or compatible (Phase 16+)
- **Purpose:** Chore photos, avatars

### ML/Analytics
- **Runtime:** Python 3.10+ (Phase 28)
- **Libraries:** scikit-learn, pandas
- **Integration:** REST API or scheduled jobs

---

## Development Tools

### Version Control
- **VCS:** Git
- **Host:** GitHub
- **Repository:** ADHDLearn.com
- **Branches:** staging (development), main (production)

### Code Quality
- **Linter:** ESLint (JavaScript/React)
- **Formatter:** Prettier
- **Complexity Analysis:** complexity-report or escomplex
- **Standard:** All functions ≤ 5 McCabe complexity

### Testing
- **Unit Tests:** Jest
- **E2E Tests:** Playwright (Phase 34)
- **BDD:** Manual testing with Gherkin scenarios
- **Test Framework:** Gherkin feature files in phase documentation

### Development Server
- **Local Web Server:** Python HTTPS server (https-server.py)
- **Port:** 8000
- **Protocol:** HTTPS (required for audio/camera features)

---

## Explicitly NOT Using

- ❌ **Kotlin** - GWT incompatibility, abandoned October 2025
- ❌ **libGDX** - Kotlin + Web doesn't work (GWT limitation)
- ❌ **Java** - No need without libGDX
- ❌ **Gradle** - Using npm/package.json instead
- ❌ **GWT (Google Web Toolkit)** - Deprecated approach, Kotlin incompatible

---

## Migration History

### From Kotlin/libGDX to Phaser (October 2025)
**Reason:** GWT (required for libGDX web deployment) cannot compile Kotlin code

**What was attempted:**
- Native Android + Web from single Kotlin codebase using libGDX
- 3,000+ lines of Kotlin game logic written
- Worked perfectly for Android/Desktop (JVM targets)
- Failed completely for web (GWT requires Java source)

**What was learned:**
- Always verify transpiler compatibility before choosing tech stack
- libGDX multi-platform works great **with Java**
- libGDX + Kotlin works for Android/Desktop only
- Phaser provides web deployment (critical requirement)
- Capacitor wraps web code for Android APK successfully
- Performance acceptable for Aurora's tablet

**Decision:** Reverted to Phaser 3 + JavaScript
- Restored working Phaser code from archive
- Prioritized web deployment over native performance
- Maintained Android support via Capacitor

---

## Package Management

### Frontend
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "phaser": "^3.80.1",
    "chart.js": "^4.4.0"
  },
  "devDependencies": {
    "vite": "^5.0.0",
    "@vitejs/plugin-react": "^4.2.0",
    "tailwindcss": "^3.4.0",
    "eslint": "^8.56.0",
    "prettier": "^3.2.0"
  }
}
```

### Backend
```json
{
  "dependencies": {
    "express": "^4.18.2",
    "mysql2": "^3.9.0",
    "jsonwebtoken": "^9.0.2",
    "bcrypt": "^5.1.1",
    "cors": "^2.8.5",
    "express-validator": "^7.0.1",
    "socket.io": "^4.7.0",
    "node-cron": "^3.0.3"
  },
  "devDependencies": {
    "nodemon": "^3.0.3",
    "jest": "^29.7.0"
  }
}
```

---

## Architecture Patterns

### Monorepo Structure
```
/home/corey/Desktop/ADHDLearn.com/
├── src/                    # Child portal (React + Phaser)
├── parent-portal/          # Parent dashboard (React)
├── backend/                # Node.js API
├── marketing/              # Static marketing site
├── android/                # Capacitor Android wrapper
├── assets/                 # Shared assets (fonts, images, audio)
├── scripts/                # Deployment and utility scripts
└── .ai/                    # All planning and documentation
```

### API Architecture
- **RESTful endpoints:** `/api/resource`
- **Authentication:** JWT tokens in Authorization header
- **Response format:** `{ success: boolean, data: any, message?: string }`
- **Error handling:** Consistent HTTP status codes and error objects

### Frontend Architecture
- **Component-based:** React functional components
- **Scene-based games:** Phaser scenes for game logic
- **Shared services:** AudioManager, SettingsManager, etc.
- **State management:** Context API for global state

---

## Performance Targets

### Web (Child Portal)
- **First Contentful Paint:** < 1.5s
- **Time to Interactive:** < 3s
- **Lighthouse Score:** > 90

### Games (Phaser)
- **Target FPS:** 60 (stable)
- **Touch Latency:** < 50ms
- **Memory Usage:** < 200MB
- **Audio Latency:** < 100ms

### API
- **Response Time:** < 100ms (database queries)
- **Throughput:** > 100 req/s
- **Uptime:** > 99.9%

---

## Browser Support

### Child Portal
- **Primary:** Chrome/Edge (latest)
- **Secondary:** Safari (latest)
- **Mobile:** Android WebView (API 26+)

### Parent Portal
- **Primary:** Chrome/Edge/Firefox/Safari (latest)
- **Mobile:** Responsive design for tablets/phones

---

## Security

### Authentication
- **JWT tokens:** 24-hour expiration
- **Password hashing:** bcrypt (12 rounds)
- **PIN for children:** 4-digit, bcrypt hashed

### API Security
- **CORS:** Whitelist specific domains
- **Rate limiting:** 100 requests/minute per IP
- **SQL injection:** Parameterized queries only
- **XSS protection:** Input sanitization, Content Security Policy

### HTTPS
- **Required:** All production domains
- **Certificates:** Let's Encrypt (auto-renewal)
- **HSTS:** Enabled

---

## Monitoring & Logging

### Backend Logging
- **Library:** winston or pino
- **Levels:** error, warn, info, debug
- **Storage:** Log files + optional external service

### Error Tracking
- **Service:** Sentry or similar (Phase 35+)
- **Coverage:** Backend API, frontend errors

### Analytics
- **Privacy-focused:** No Google Analytics
- **Custom:** Track learning progress, game completion, time spent

---

## Future Considerations

If native performance becomes critical in the future, consider:
- **React Native + Expo** - JavaScript, supports web + mobile
- **Flutter** - Dart, excellent performance, web support
- **Compose Multiplatform** - Kotlin, newer multi-platform stack with web support
- **NOT libGDX + Kotlin** - Web incompatible (confirmed failure)

---

**Created:** October 25, 2025
**Maintained By:** Corey (developer)
**Purpose:** Single source of truth for all technology decisions
