# Session Memory - Critical Information Only

**Last Updated:** October 21, 2025
**Current Status:** Phase 2.7.10 Ready - All McCabe refactoring complete

---

## Critical Commands

### Build & Deploy
```bash
./gradlew clean assembleDebug
cp android/build/outputs/apk/debug/android-debug.apk ReadingAdventure.apk
$ANDROID_HOME/platform-tools/adb install -r ReadingAdventure.apk
$ANDROID_HOME/platform-tools/adb shell am start -n com.aurora.reading/com.aurora.reading.AndroidLauncher
```

### McCabe Analysis (Required before phase completion)
```bash
python3 /tmp/mccabe_kotlin.py core/src/main/kotlin/
# ALL functions must be ≤ 5 complexity
# Report saves to: .ai/reports/mccabe-phase-X.X.X.md
```

### Testing
```bash
# Use swipe for reliable touch (not tap)
$ANDROID_HOME/platform-tools/adb shell input swipe X Y X Y 100

# Screenshots
$ANDROID_HOME/platform-tools/adb shell screencap -p /sdcard/screenshot.png
$ANDROID_HOME/platform-tools/adb pull /sdcard/screenshot.png test/screenshots/name.png
```

---

## Recent Critical Issues & Solutions

### Touch Input (Phase 2.7.6)
- **Problem:** ADB tap commands unreliable
- **Solution:** Use `swipe X Y X Y 100` instead of `tap X Y`

### Slider Handle Interaction (Phase 2.7.6)
- **Problem:** Handle hard to grab
- **Solution:** 1.5x touch detection radius

### Component APIs (Phase 2.7.9)
- FloatingStars: Use `starCount`, not `count`
- BalloonIcon: No `update()` method
- Button: Requires `texturePath` parameter

---

## Environment

- **Target Device:** Samsung Galaxy Tab S7 FE (2560x1600)
- **World Size:** 2560x1600 (1:1 pixel mapping)
- **JDK:** 17
- **Kotlin:** 1.9.23
- **libGDX:** 1.12.1
- **Branch:** staging
- **ANDROID_HOME:** `/home/corey/android-sdk`

---

## Phase Completion Checklist

Before marking phase complete:
- [ ] All acceptance criteria met
- [ ] McCabe complexity ≤ 5 for ALL functions (MANDATORY)
- [ ] Build successful
- [ ] Manual testing complete
- [ ] Screenshots captured
- [ ] MEMORY.md updated (this file)
- [ ] START.md updated
- [ ] README.md updated
- [ ] Git commit created
- [ ] Pushed to staging

---

## Next Phase: 2.7.10 Web Version

**Documentation:** `.ai/phases/phase-2.7.10/` (PLAN.md, UML.md, GHERKIN.md)
**Ready:** Yes - All prereqs complete
