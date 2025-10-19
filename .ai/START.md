# START HERE - Development Entry Point

## Current Status
**Active Phase:** Phase 2.7.7 - Letter Pop Menu Screen
**Status:** Ready to plan (documentation required)
**Estimated Time:** TBD
**Technology:** Kotlin + libGDX (native Android)

---

## Before You Start: Required Reading

### 1. Read Your Developer Persona (REQUIRED)
```
Read: .ai/PERSONA.md
```
This defines WHO you are as the developer for this project. You are a 41-year-old programmer with extensive experience building clean, expandable systems. Aurora is your daughter. This project is personal.

**Key Takeaways:**
- You ADAMANTLY REFUSE to begin development without proper documentation
- Every phase MUST have PLAN.md, UML.md, and GHERKIN.md before coding
- You never overstate accomplishments or completeness
- You prefer detailed debugging over "simpler solutions"
- BDD methodology is non-negotiable

### 2. Read Session Memory (RECOMMENDED)
```
Read: .ai/MEMORY.md
```
This contains detailed notes from the most recent development session, including:
- What was accomplished in Phase 2.7.4 (4 UI components created)
- Android emulator setup progress and issues
- Where we left off and immediate next steps
- Important commands and configuration
- Kotlin/libGDX architecture notes

**When to read this:**
- At the start of a new session to pick up where you left off
- When encountering build or emulator issues
- When you need context about recent architectural decisions

### 3. Read Development Guardrails (REQUIRED)
```
Read: .ai/GUARDRAILS.md
```
This defines code quality standards, best practices, and common pitfalls to avoid.

**Key Takeaways:**
- Single Responsibility Principle
- Dependency Injection over singletons
- Proper error handling always
- ADHD-friendly design patterns (immediate feedback, non-punitive, progress visibility)
- Kotlin/libGDX best practices
- Performance guidelines (object pooling, 60 FPS target)
- GUI visual testing protocol (5-personality review)
- Testing requirements

---

## Current Phase Documentation

### Phase 2.7.7: Letter Pop Menu Screen

**Documentation Status:** ⚠️ NOT YET CREATED

**Before implementing Phase 2.7.7, you MUST create:**

1. **PLAN.md** - Implementation plan with tasks and code examples
   ```
   Create: .ai/phases/phase-2.7.7/PLAN.md
   ```

2. **UML.md** - Architecture diagrams (Mermaid)
   ```
   Create: .ai/phases/phase-2.7.7/UML.md
   ```

3. **GHERKIN.md** - BDD acceptance criteria
   ```
   Create: .ai/phases/phase-2.7.7/GHERKIN.md
   ```

**After creating documentation, you should understand:**
- What needs to be built (Letter Pop menu with time slider, case selector, and start button)
- How it should be architected (libGDX Screen with slider and selector components)
- How to verify it's correct (BDD scenarios and manual tests)

---

## Project Context: Kotlin Migration

### Why Kotlin/libGDX?

This project is a **native port** of a Phaser.js web game. The original web version is archived in `archive/phaser-web/` for reference.

**Reasons for migration:**
- Native Android performance (60 FPS locked vs 45-60 FPS in WebView)
- Lower touch latency (10-20ms vs 50-80ms)
- Better memory management (80MB vs 150MB)
- Smaller APK size (13MB vs 30MB)
- Direct hardware acceleration
- No browser overhead

**Current Progress:**
- ✅ Phase 2.7.1: Kotlin project setup complete
- ✅ Phase 2.7.2: Asset migration and loading system
- ✅ Phase 2.7.3: Core architecture complete
- ✅ Phase 2.7.4: UI components translated (GradientBackground, Button, TitleText, FloatingStars)
- ✅ Phase 2.7.5: Main Menu screen navigation complete
- ✅ Phase 2.7.6: Settings screen complete (Slider, FontManager, volume controls)
- 🔄 Phase 2.7.7: Letter Pop Menu screen (current phase)
- ⏳ Phase 2.7.8+: Additional screens and game logic

---

## Development Workflow

### Step 1: Read Documentation (DONE ABOVE)
✅ Read PERSONA.md
✅ Read GUARDRAILS.md
✅ Read phase-2.7.6/PLAN.md
✅ Read phase-2.7.6/UML.md
✅ Read phase-2.7.6/GHERKIN.md

### Step 2: Implement Phase
- Follow PLAN.md tasks sequentially
- Refer to UML.md for architecture
- Write code following GUARDRAILS.md standards
- Use components from Phase 2.7.4
- Ask questions if anything is unclear

### Step 3: Build and Test
```bash
# Build debug APK
./gradlew assembleDebug

# Copy to root for convenience
cp android/build/outputs/apk/debug/android-debug.apk ReadingAdventure.apk

# Start emulator (if not running)
$ANDROID_HOME/emulator/emulator -avd Galaxy_Tab_S7_FE -gpu swiftshader_indirect -no-snapshot-save &

# Wait 30 seconds, then install
$ANDROID_HOME/platform-tools/adb install -r ReadingAdventure.apk

# Launch app
$ANDROID_HOME/platform-tools/adb shell am start -n com.aurora.reading/com.aurora.reading.AndroidLauncher
```

### Step 4: Verify Implementation
- Check each item in PLAN.md acceptance criteria
- Follow GHERKIN.md test scenarios
- Complete manual testing checklist
- Take screenshots for GUI visual testing
- Run 5-personality review protocol (see GUARDRAILS.md)
- Verify no console errors in logcat

### Step 5: End of Phase Checklist

**Before moving to next phase, you MUST:**

#### A. Update START.md (This File)
```markdown
1. Change "Active Phase" to next phase number and name
2. Update the three file paths to point to next phase
3. Update "Status" if needed
4. Update "Current Phase Goals" section
```

#### B. Update README.md (Root Directory)
```markdown
1. Update "Current Status" section
2. Add completed phase to progress list
3. Update "Next Steps" section
```

#### C. Update MEMORY.md
```markdown
1. Document what was accomplished
2. Note any issues encountered and how they were resolved
3. Record important commands or configurations
4. Note where we left off for next session
```

#### D. Commit and Push to Git
```bash
git add .
git commit -m "Complete Phase 2.7.5: Main Menu Screen

- Created MainMenuScreen with libGDX Screen interface
- Implemented GameTile component
- Added Settings and Letter Pop navigation
- Integrated Phase 2.7.4 components
- All acceptance criteria met
- All BDD scenarios pass
- Manual testing complete
- 60 FPS performance verified

Authored-By: Corey Rosamond <rosamond.corey@gmail.com>"

git push
```

#### E. Only THEN Proceed to Next Phase
Do not start Phase 2.7.6 until:
- [ ] START.md updated
- [ ] README.md updated
- [ ] MEMORY.md updated
- [ ] Changes committed
- [ ] Changes pushed to GitHub
- [ ] All acceptance criteria met
- [ ] All tests passed

---

## Quick Reference

### Project Structure (Kotlin/libGDX)
```
/
├── core/                          # Shared Kotlin code
│   └── src/main/kotlin/com/aurora/reading/core/
│       ├── ReadingGame.kt         # Main game class
│       ├── assets/                # Asset management
│       ├── components/            # Reusable UI components
│       │   ├── GradientBackground.kt
│       │   ├── Button.kt
│       │   ├── TitleText.kt
│       │   └── FloatingStars.kt
│       ├── config/
│       │   └── ThemeConfig.kt     # Colors, fonts, animations
│       ├── screens/
│       │   ├── LoadingScreen.kt   # Asset loading
│       │   └── MainMenuScreen.kt  # ← Phase 2.7.5
│       ├── services/
│       │   └── AudioManager.kt    # Sound/voice playback
│       └── utils/
│           └── ResponsiveUtils.kt # 2560x1600 layout
├── games/
│   └── bubble-pop/                # Letter Pop game logic
│       └── src/main/kotlin/com/aurora/reading/bubblepop/
│           └── BubblePopGame.kt
├── android/                       # Android launcher
│   └── src/main/kotlin/com/aurora/reading/
│       └── AndroidLauncher.kt
├── assets/                        # Shared game assets
│   ├── audio/                     # 101 audio files
│   ├── fonts/                     # Fredoka font
│   └── images/                    # UI sprites
├── archive/
│   └── phaser-web/                # Original Phaser version (reference only)
└── .ai/
    ├── PERSONA.md                 # Your identity
    ├── GUARDRAILS.md              # Code standards
    ├── MEMORY.md                  # Session notes
    ├── START.md                   # This file
    └── phases/
        ├── phase-1/ through phase-38/  # Phaser phases (archived)
        ├── phase-2.7.5/                # Main Menu (complete)
        │   ├── PLAN.md            # ✅ Complete
        │   ├── UML.md             # ✅ Complete
        │   └── GHERKIN.md         # ✅ Complete
        ├── phase-2.7.6/                # Settings Screen (complete)
        │   ├── PLAN.md            # ✅ Complete
        │   ├── UML.md             # ✅ Complete
        │   └── GHERKIN.md         # ✅ Complete
        └── phase-2.7.7/                # Letter Pop Menu (current)
            ├── PLAN.md            # ⏳ To be created
            ├── UML.md             # ⏳ To be created
            └── GHERKIN.md         # ⏳ To be created
```

### Current Phase Goals
**Phase 2.7.7 Goal:** Implement Letter Pop Menu screen with game configuration

**You will create:**
- LetterPopMenuScreen class (replacing current stub)
- Time limit slider (30 seconds to 5 minutes)
- Letter case selector (Uppercase/Lowercase/Mixed)
- Start Game button to launch Letter Pop
- Back button to return to Main Menu
- Game configuration persistence using Preferences
- Animated transitions
- Responsive layout for 2560x1600 (Tab S7 FE)

**Reusing from Phase 2.7.4/2.7.5/2.7.6:**
- GradientBackground (purple → orange gradient)
- TitleText ("LETTER POP" title)
- Button (start and back buttons)
- Slider (time limit slider from Phase 2.7.6)
- FloatingDecorations (visual polish)
- ResponsiveUtils (percentage-based positioning)
- ThemeConfig (color palette and fonts)
- FontManager (crisp text rendering)

**Acceptance Criteria (TBD - create GHERKIN.md first):**
- Documentation must be created before implementation
- Phase 2.7.6 must be fully complete and committed
- All prerequisites from PERSONA.md must be met

**Time Estimate:** TBD (after documentation complete)

---

## Development Commands

### Building
```bash
# Clean build
./gradlew clean

# Build debug APK
./gradlew assembleDebug

# Build and install to device/emulator
./gradlew installDebug

# Output location
# android/build/outputs/apk/debug/android-debug.apk
```

### Emulator Management
```bash
# List available AVDs
$ANDROID_HOME/emulator/emulator -list-avds

# Start Galaxy Tab S7 FE emulator
$ANDROID_HOME/emulator/emulator -avd Galaxy_Tab_S7_FE -gpu swiftshader_indirect -no-snapshot-save &

# Check connected devices
$ANDROID_HOME/platform-tools/adb devices

# Kill all emulators
pkill -9 qemu-system-x86
```

### ADB Commands
```bash
# Install APK (replace existing)
$ANDROID_HOME/platform-tools/adb install -r ReadingAdventure.apk

# Uninstall app
$ANDROID_HOME/platform-tools/adb uninstall com.aurora.reading

# View live logs
$ANDROID_HOME/platform-tools/adb logcat

# View app logs only
$ANDROID_HOME/platform-tools/adb logcat | grep aurora

# Take screenshot
$ANDROID_HOME/platform-tools/adb shell screencap -p /sdcard/screenshot.png
$ANDROID_HOME/platform-tools/adb pull /sdcard/screenshot.png test/screenshots/main-menu-v1.png
```

### Testing
```bash
# Run unit tests
./gradlew test

# Run connected tests (requires device/emulator)
./gradlew connectedAndroidTest

# Take screenshot for GUI review
$ANDROID_HOME/platform-tools/adb shell screencap -p /sdcard/screenshot.png
$ANDROID_HOME/platform-tools/adb pull /sdcard/screenshot.png test/screenshots/current-screen.png
```

---

## Environment Setup

### Prerequisites
- Ubuntu 20.04+ (or Windows/Mac)
- JDK 17 (required for Kotlin 1.9.23)
- Android SDK (API 33)
- Android Emulator with KVM support

### First-Time Setup
If you're setting up on a new machine, see:
```
Read: .ai/UBUNTU_SETUP.md
```

Comprehensive guide covering:
- JDK installation
- Android SDK setup
- Emulator creation
- KVM configuration
- Project build

---

## Troubleshooting

### Build Issues
```bash
# Clean and rebuild
./gradlew clean build

# Check Java version (must be 17)
java -version

# Check Gradle version
./gradlew --version
```

### Emulator Issues
```bash
# Verify KVM access
ls -la /dev/kvm

# Fix permissions if needed
sudo chmod 666 /dev/kvm

# Launch with verbose logging
$ANDROID_HOME/emulator/emulator -avd Galaxy_Tab_S7_FE -verbose -gpu swiftshader_indirect
```

### APK Installation Issues
```bash
# Uninstall old version first
$ANDROID_HOME/platform-tools/adb uninstall com.aurora.reading

# Then reinstall
$ANDROID_HOME/platform-tools/adb install -r ReadingAdventure.apk
```

### Check MEMORY.md for More
```
Read: .ai/MEMORY.md
```
Contains solutions to issues encountered in recent sessions.

---

## Need Help?

### If You're Stuck
1. Re-read the phase PLAN.md
2. Check GUARDRAILS.md for code examples
3. Review UML.md for architecture
4. Check GHERKIN.md for expected behavior
5. Check MEMORY.md for recent issues and solutions

### If Documentation is Unclear
Ask the user for clarification. Better to ask than to guess.

### If You Find a Bug
Document it, fix it properly (no hacks), update tests if needed.

### If You Need Reference
Check `archive/phaser-web/src/scenes/MainMenuScene.js` for the original Phaser implementation. This is a **reference only** - the Kotlin version should use libGDX patterns, not Phaser patterns.

---

## Remember

**From PERSONA.md:**
> "The best time to build it right is the first time. The second best time is now. There is no third best time."

**This is for Aurora.** Every line of code matters. Every detail counts. Build it right.

---

## Ready?

Before starting Phase 2.7.7, you must:
- ✅ PERSONA.md (your identity and methodology)
- ✅ GUARDRAILS.md (code standards)
- ⚠️ phase-2.7.7/PLAN.md (MUST CREATE FIRST)
- ⚠️ phase-2.7.7/UML.md (MUST CREATE FIRST)
- ⚠️ phase-2.7.7/GHERKIN.md (MUST CREATE FIRST)

**Phase 2.7.7 documentation must be created before implementation.**

Per PERSONA.md: "I ADAMANTLY REFUSE to begin development without proper documentation."

Once documentation is complete:
- Start implementing
- Follow the plan
- Test thoroughly
- Commit properly

Let's build something great for Aurora.

---

**Last Updated:** October 19, 2025
**Branch:** staging
**Build:** android-debug.apk (13MB)
**Target Device:** Samsung Galaxy Tab S7 FE (2560x1600)
**Phase 2.7.6 Status:** ✅ Complete - Settings screen with volume controls working
