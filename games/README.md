# Aurora's Reading Adventure - Games

This directory contains different implementations of Aurora's Reading Adventure optimized for different platforms.

## Directory Structure

### `phaser-web/`
Original web implementation using Phaser 3.
- **Platform:** Web browsers, PWA, Android WebView
- **Language:** JavaScript
- **Performance:** 55-60 FPS with 10-12 bubbles
- **Status:** ✅ Production-ready

### `kotlin-android/`
Native Android implementation using libGDX.
- **Platform:** Android native
- **Language:** Kotlin
- **Performance:** Locked 60 FPS with 50+ bubbles
- **Status:** 🚧 In Development (Phase 2.7)

## Platform Comparison

| Feature | Phaser Web | Kotlin Android |
|---------|-----------|----------------|
| FPS | 55-60 | Locked 60 |
| Max Bubbles | 10-12 | 50+ |
| Touch Latency | 50-80ms | 10-20ms |
| Memory | ~150MB | ~80MB |
| APK Size | 30MB (WebView) | 15MB (native) |
| Offline | Limited | Full |

## Development Strategy

1. **Web/PWA** → Use `phaser-web/` (primary)
2. **Android Performance** → Use `kotlin-android/` (native)
3. **iOS (Future)** → Kotlin Multiplatform

## Shared Assets

Assets are shared between implementations via symlinks/copies:
- Images: PNG format
- Audio: OGG format (web), MP3 (Android)
- Fonts: TTF format
