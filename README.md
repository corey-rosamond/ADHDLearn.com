# Aurora's Reading Adventure - Kotlin Multiplatform

libGDX-based game written in Kotlin, compiling to multiple platforms from a single codebase.

## Project Structure

```
project/
├── core/                       # Shared Kotlin code (utilities, base framework)
│   └── src/main/kotlin/
│       └── com/aurora/reading/core/
│           └── ReadingGame.kt
├── games/
│   └── bubble-pop/             # Letter Pop game logic
│       └── src/main/kotlin/
│           └── com/aurora/reading/bubblepop/
│               └── BubblePopGame.kt
├── android/                    # Android launcher app
│   └── src/main/kotlin/
│       └── com/aurora/reading/
│           └── AndroidLauncher.kt
├── assets/                     # Shared game assets (TODO: migrate from Phaser)
└── archive/
    └── phaser-web/             # Original Phaser.js version (reference)
```

## Technology Stack

- **Language:** Kotlin 1.9.23
- **Framework:** libGDX 1.12.1
- **Physics:** Box2D (native C++ engine)
- **Build:** Gradle 8.4
- **Target Platforms:**
  - ✅ Android (native) - **WORKING**
  - ⏳ Web (Kotlin/JS) - TODO
  - ⏳ Desktop (JVM) - TODO

## Development

### Prerequisites

- **JDK 17+** (currently using 21)
- **Android SDK** (API 33)
- **Gradle 8.4** (included via wrapper)

### Building

```bash
# Build all modules
./gradlew build

# Build and assemble Android debug APK
./gradlew android:assembleDebug

# Output: android/build/outputs/apk/debug/android-debug.apk

# Install to connected device/emulator
adb install -r android/build/outputs/apk/debug/android-debug.apk
```

### Running on Device

```bash
# Start Android emulator (if you have one configured)
emulator -avd <your_avd_name>

# Or connect physical device via USB and enable USB debugging

# Install and run
./gradlew android:installDebug
```

## Project Modules

### core/
Shared utilities and base game framework
- `ReadingGame.kt` - Main game class accepting an initial Screen
- Platform-agnostic code
- No dependencies on specific games

### games/bubble-pop/
Letter Pop game implementation (in progress)
- `BubblePopGame.kt` - Demo screen with FPS counter
- Game screens (Main Menu, Settings, Letter Pop, Results) - TODO
- Bubble physics with Box2D - TODO
- Letter recognition gameplay - TODO
- Score tracking - TODO

### android/
Android launcher
- `AndroidLauncher.kt` - Android activity
- Android-specific configuration
- Native library packaging (automatic)

## Target Device

- **Primary:** Samsung Galaxy Tab S7 FE
- **Screen:** 12.4" (2560x1600)
- **Orientation:** Landscape
- **API Level:** 33 (Android 13)
- **Min SDK:** 24 (Android 7.0)

## Phase 2.7 Progress

### Completed ✅
1. ✅ Installed JDK, Gradle, Android SDK
2. ✅ Set up Kotlin + libGDX project structure
3. ✅ Created modular architecture (core, games/bubble-pop, android)
4. ✅ **First successful Android build**
5. ✅ Generated working APK (android-debug.apk)

### Next Steps ⏳
6. ⏳ Create Android emulator for Tab S7 FE
7. ⏳ Test APK on emulator
8. ⏳ Port Main Menu scene from Phaser
9. ⏳ Port Settings scene
10. ⏳ Port Letter Pop Menu scene
11. ⏳ Port Letter Pop game with Box2D physics
12. ⏳ Port Results scene
13. ⏳ Migrate assets from archive/phaser-web/assets/
14. ⏳ Build release APK

## Architecture Benefits

The game follows a modular architecture:
- **Core module:** Platform-agnostic game logic
- **Game modules:** Individual games (bubble-pop, future: sight-words, etc.)
- **Platform modules:** Platform-specific launchers (android, web, desktop)

This provides:
- ✅ Code reuse across platforms
- ✅ Easy addition of new games
- ✅ Separation of concerns
- ✅ Native performance on each platform
- ✅ Single codebase for all platforms

## Performance Goals

| Metric | Phaser (WebView) | Kotlin (Native Target) |
|--------|------------------|------------------------|
| FPS | 55-60 (drops to 45) | Locked 60 |
| Bubble Count | 10-12 max | 50+ |
| Touch Latency | 50-80ms | 10-20ms |
| Memory Usage | ~150MB | ~80MB |
| Physics Steps | 30/sec | 60/sec |
| APK Size | 30MB (WebView) | ~15MB (native) |

## Migration from Phaser

The original Phaser.js version is archived in `archive/phaser-web/` for reference.

**Porting strategy:**
1. Study Phaser scene structure
2. Recreate as libGDX Screen classes
3. Replace Phaser Arcade Physics with Box2D
4. Migrate assets to `assets/` directory
5. Port game logic to Kotlin

## Development Commands

```bash
# Clean build
./gradlew clean

# Build all
./gradlew build

# Android debug APK
./gradlew android:assembleDebug

# Android release APK (requires signing config)
./gradlew android:assembleRelease

# Run tests
./gradlew test

# List all tasks
./gradlew tasks
```

## Troubleshooting

**Build fails with "Unknown Kotlin JVM target"**
- Ensure Kotlin version matches JVM target in build.gradle.kts
- Current: Kotlin 1.9.23 with JVM target 17

**Android SDK not found**
- Set `ANDROID_HOME` environment variable: `export ANDROID_HOME=$HOME/android/sdk`
- Or create `local.properties` with: `sdk.dir=/path/to/android/sdk`

**Gradle daemon issues**
- Kill daemons: `./gradlew --stop`
- Clean build: `./gradlew clean build`

## License

Personal project for Aurora.

---

**Current Status:** Phase 2.7.1 complete - Project structure and first build successful ✅
**Last Updated:** October 16, 2025
