# START HERE - Development Entry Point

## Current Status
**Technology:** Phaser 3 (JavaScript/Web)
**Status:** Restored from archive after Kotlin/libGDX attempt failed
**Last Updated:** October 21, 2025

---

## What Happened - Important Context

### Kotlin/libGDX Attempt (October 2025)
**Attempted:** Native Android + Web from single Kotlin codebase using libGDX
**Result:** FAILED - Technical incompatibility discovered
**Duration:** ~5 days of development
**Outcome:** Archived to `archive/kotlin-libgdx-attempt/`

**Why it failed:**
- libGDX's HTML5 backend requires GWT (Google Web Toolkit)
- GWT compiles **Java source → JavaScript** only
- GWT **cannot** compile Kotlin code
- All 3,000+ lines of core game logic were written in Kotlin
- No workaround exists without rewriting everything in Java

**What was learned:**
- libGDX multi-platform works great **with Java**
- libGDX + Kotlin works for Android/Desktop (JVM targets)
- libGDX + Kotlin + Web **does not work** (GWT limitation)
- Always verify transpiler compatibility before choosing tech stack

### Current State: Back to Phaser
**Restored from:** `archive/phaser-web/`
**Technology:** Phaser 3 + JavaScript
**Deployment:** PWA (Progressive Web App)
**Status:** Working, functional game

---

## Project Structure (Phaser)

```
/
├── index.html              # Main entry point
├── src/
│   ├── scenes/             # Phaser game scenes
│   │   ├── BootScene.js
│   │   ├── PreloadScene.js
│   │   ├── MainMenuScene.js
│   │   ├── SettingsScene.js
│   │   ├── LetterPopScene.js
│   │   └── ResultsScene.js
│   ├── components/         # Reusable UI components
│   ├── gameobjects/        # Game objects (Bubble, etc.)
│   ├── services/           # Audio, settings management
│   └── utils/              # Utility functions
├── assets/                 # Audio, images, fonts
├── android/                # Capacitor Android wrapper
└── .ai/                    # Development documentation
    ├── PERSONA.md
    ├── GUARDRAILS.md
    ├── MEMORY.md
    └── phases/             # Phaser phase documentation
```

---

## Development Commands

### Web Development
```bash
# Start HTTPS server (required for audio)
python3 https-server.py

# Access game
https://localhost:8000
```

### Android (Capacitor)
```bash
# Build web assets
# (No build step needed - plain JavaScript)

# Sync to Android
npx cap sync android

# Open in Android Studio
npx cap open android

# Or build APK
cd android
./gradlew assembleDebug
```

---

## Phaser Architecture

### Game Flow
1. **BootScene** - Initialize Phaser, load configuration
2. **PreloadScene** - Load all assets (audio, images)
3. **MainMenuScene** - Main menu with game selection
4. **LetterPopScene** - Letter Pop mini-game
5. **ResultsScene** - Score and celebration

### Key Files
- `src/config.js` - Game configuration (resolution, colors)
- `src/scenes/LetterPopScene.js` - Main game logic
- `src/gameobjects/Bubble.js` - Bubble physics and rendering
- `src/services/AudioManager.js` - Sound and voice playback
- `src/services/SettingsManager.js` - Volume, preferences

---

## What's Working (Phaser Version)

✅ Main Menu with game tiles
✅ Settings screen (volume controls)
✅ Letter Pop game
  - Uppercase/lowercase selection
  - Time limits (30s, 60s, 90s, unlimited)
  - Bubble physics (floating, bouncing)
  - Letter audio playback
  - Score tracking
✅ Results screen with star rating
✅ PWA support (installable on mobile)
✅ Android APK via Capacitor

---

## Performance (Phaser on WebView)

Current metrics on Samsung Galaxy Tab S7 FE:
- FPS: 55-60 (occasional drops to 45)
- Touch Latency: 50-80ms
- Memory Usage: ~150MB
- APK Size: 30MB
- Audio Latency: ~100ms

**Note:** These were the metrics that prompted the Kotlin/libGDX attempt. The native version achieved 60 FPS locked, 10-20ms touch latency, 80MB memory - but couldn't compile to web.

---

## Next Steps

1. Continue with Phaser development
2. Add more games/activities
3. Improve performance where possible
4. Deploy as PWA + Android app

---

## Archived Attempts

### Kotlin/libGDX (October 2025)
**Location:** `archive/kotlin-libgdx-attempt/`
**Status:** Abandoned - GWT cannot compile Kotlin
**Phases Completed:** 2.7.1 through 2.7.11
**Code Quality:** 100% functions ≤5 McCabe complexity
**Reason for Archive:** Technical impossibility (GWT + Kotlin incompatibility)

---

## Important Notes

- **Phaser is the working solution**
- Performance is good enough for Aurora's needs
- Native performance would be better, but web deployment is essential
- If native is ever needed in the future, consider:
  - React Native + Expo
  - Flutter
  - Compose Multiplatform (Kotlin, but newer multi-platform stack)
  - **NOT** libGDX + Kotlin (web doesn't work)

---

**Remember:** This is for Aurora. It doesn't need to be perfect. It needs to work and help her learn.

---

**Last Updated:** October 21, 2025
**Current Technology:** Phaser 3 + JavaScript
**Deployment:** Web (PWA) + Android (Capacitor)
