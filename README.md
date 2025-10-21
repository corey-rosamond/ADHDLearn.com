# Aurora's Reading Adventure - Phaser Web Version

This is the original web implementation using Phaser 3 game framework.

## Technology Stack
- **Framework:** Phaser 3.80.1
- **Language:** JavaScript (ES6+)
- **Build:** None (runs directly in browser)
- **Deployment:** Web (PWA), Capacitor (Android WebView)

## Running Locally

### Development Server
```bash
python3 https-server.py
# Opens at https://localhost:8000
```

### Production Build (Capacitor Android)
```bash
npm install
npx cap sync
cd android
./gradlew assembleDebug
```

## Project Structure
```
phaser-web/
├── index.html              # Entry point
├── src/
│   ├── scenes/            # Game scenes
│   ├── components/        # Reusable UI components
│   ├── config/            # Theme & config
│   ├── services/          # AudioManager, etc.
│   └── utils/             # ResponsiveUtils
├── assets/                # Images, audio, fonts
└── www/                   # Capacitor build output
```

## Components (Phase 2.6)
Refactored to use reusable components:
- `BackgroundComponent` - Gradient backgrounds with caching
- `TitleComponent` - Animated titles
- `ButtonComponent` - Interactive buttons
- `SliderComponent` - Volume/settings sliders
- `DecorationsComponent` - Floating stars
- `ThemeConfig` - Centralized styling

## Performance
- **Target:** 60 FPS
- **Platform:** Web browsers, Android WebView
- **Screen:** Optimized for 12.4" tablet (2560x1600)
