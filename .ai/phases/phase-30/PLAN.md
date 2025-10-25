# Phase 30: Android APK

**Project:** ADHDLearn.com
**Phase:** 30 of 36
**Last Updated:** October 22, 2025

---

 Android APK

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

