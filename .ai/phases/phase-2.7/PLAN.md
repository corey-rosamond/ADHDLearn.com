# Phase 2.7: Kotlin Native Port

## Overview
Port Aurora's Reading Adventure to Kotlin using libGDX for native Android performance while maintaining the web version with Phaser.

## Objectives
1. Create Kotlin/libGDX version with native performance
2. Set up Android emulator for Samsung Galaxy Tab S7 FE (12.4" landscape)
3. Maintain feature parity with Phaser version
4. Achieve 3-5x physics performance improvement
5. Keep web version intact (Phaser remains primary for web)

## Architecture Decision

### Platform Strategy
```
Web/PWA     → Phaser.js (current codebase - keep as-is)
Android     → Kotlin + libGDX (new native port)
iOS         → Future (Kotlin Multiplatform)
```

### Code Organization
```
project/
├── web/                    # Current Phaser implementation
│   ├── index.html
│   ├── src/
│   └── assets/
├── android-native/         # New Kotlin libGDX implementation
│   ├── core/              # Game logic (platform-agnostic)
│   ├── android/           # Android-specific
│   └── assets/
└── shared/                # Shared assets (fonts, images, audio)
```

## Technical Stack

### libGDX Framework
- **Version:** 1.12.1 (latest stable)
- **Physics:** Box2D (native C++ physics engine)
- **Rendering:** OpenGL ES 2.0/3.0
- **Audio:** OpenAL
- **Build:** Gradle

### Development Tools
1. **Android Studio** - Latest stable
2. **Android Emulator** - API 33 (Android 13)
3. **Device Profile:** Samsung Galaxy Tab S7 FE
   - Screen: 12.4" (2560 x 1600)
   - Orientation: Landscape
   - DPI: 266

## Implementation Phases

### Phase 2.7.1: Environment Setup (2 hours)
- [ ] Install Android Studio
- [ ] Create libGDX project using gdx-setup
- [ ] Configure Android emulator with Tab S7 FE specs
- [ ] Set up Gradle build configuration
- [ ] Test "Hello World" on emulator

### Phase 2.7.2: Asset Migration (3 hours)
- [ ] Convert/copy all image assets
- [ ] Convert/copy all audio files
- [ ] Set up libGDX TextureAtlas for sprites
- [ ] Configure font rendering (FreeType)
- [ ] Test asset loading

### Phase 2.7.3: Core Architecture (4 hours)
- [ ] Create Screen classes (MainMenu, LetterPop, Settings, Results)
- [ ] Implement ResponsiveUtils for Tab S7 FE
- [ ] Create ThemeConfig (colors, fonts, animations)
- [ ] Set up AudioManager
- [ ] Implement state management

### Phase 2.7.4: Component Translation (6 hours)
- [ ] BackgroundComponent → GradientBackground Actor
- [ ] TitleComponent → TitleActor with animations
- [ ] ButtonComponent → ButtonActor with touch handling
- [ ] DecorationsComponent → ParticleSystem for stars
- [ ] SliderComponent → SliderActor

### Phase 2.7.5: Main Menu Scene (3 hours)
- [ ] Port MainMenuScene to MainMenuScreen
- [ ] Implement title animations
- [ ] Create game tile buttons
- [ ] Add settings button
- [ ] Test navigation

### Phase 2.7.6: Settings Scene (2 hours)
- [ ] Port SettingsScene to SettingsScreen
- [ ] Implement volume sliders
- [ ] Connect to AudioManager
- [ ] Add back button

### Phase 2.7.7: Letter Pop Menu (3 hours)
- [ ] Port LetterPopMenuScene to LetterPopMenuScreen
- [ ] Implement time slider
- [ ] Implement letter case selector
- [ ] Add play button

### Phase 2.7.8: Letter Pop Game (8 hours)
- [ ] Set up Box2D physics world
- [ ] Create Bubble class with Box2D bodies
- [ ] Implement collision detection
- [ ] Port bubble spawning logic
- [ ] Implement touch input
- [ ] Add score tracking
- [ ] Create countdown timer
- [ ] Test physics performance

### Phase 2.7.9: Results Scene (2 hours)
- [ ] Port ResultsScene to ResultsScreen
- [ ] Display score statistics
- [ ] Add celebration effects
- [ ] Implement Play Again button

### Phase 2.7.10: Testing & Optimization (4 hours)
- [ ] Test all scenes on emulator
- [ ] Profile performance (FPS, memory)
- [ ] Optimize texture memory
- [ ] Test landscape orientation lock
- [ ] Fix any bugs

### Phase 2.7.11: APK Build (1 hour)
- [ ] Configure signing key
- [ ] Build release APK
- [ ] Test APK installation
- [ ] Compare performance vs Capacitor WebView

## Expected Performance Gains

| Metric | Phaser (WebView) | Kotlin (Native) | Improvement |
|--------|------------------|-----------------|-------------|
| FPS | 55-60 (drops to 45) | Locked 60 | 10-15% smoother |
| Bubble Count | 10-12 max | 50+ | 4-5x |
| Touch Latency | 50-80ms | 10-20ms | 3-4x faster |
| Memory Usage | ~150MB | ~80MB | 47% reduction |
| Physics Steps | 30/sec | 60/sec | 2x |
| Battery Life | Baseline | +40% | Significant |

## Success Criteria
1. ✅ Emulator running with Tab S7 FE specs
2. ✅ All scenes ported and functional
3. ✅ Locked 60 FPS with 12+ bubbles
4. ✅ Touch latency < 20ms
5. ✅ Feature parity with Phaser version
6. ✅ Clean APK build under 20MB

## Estimated Timeline
- **Total Time:** 38 hours
- **Timeline:** 1-2 weeks (with breaks)
- **Priority:** Medium (web version works, this is optimization)

## Risks & Mitigation

### Risk 1: Learning Curve
- **Mitigation:** Start with simple screens, iterate
- **Fallback:** Keep Phaser version as primary

### Risk 2: Asset Compatibility
- **Mitigation:** Use same PNG/OGG assets, test early
- **Fallback:** Re-export assets if needed

### Risk 3: Physics Behavior Differences
- **Mitigation:** Match Box2D settings to Arcade Physics
- **Fallback:** Adjust game feel iteratively

## Next Steps After Phase 2.7
1. **Phase 2.8:** iOS port using Kotlin Multiplatform
2. **Phase 2.9:** Shared game logic layer
3. **Phase 3.0:** New game modes (Sight Words, etc.)

---

**Status:** PLANNED
**Created:** 2025-10-16
**Estimated Start:** After Phase 2.6 complete
**Dependencies:** Phase 2.6 (component refactor) ✅
