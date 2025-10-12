# Aurora's Letter Adventure

A browser-based educational game designed specifically for children with ADHD to learn letters and sight words through engaging, multi-sensory mini-games.

## Current Status

**Active Phase:** Phase 3 - Asset Loading Infrastructure
**Status:** Ready to implement
**Last Updated:** October 12, 2025

## Completed Phases

### Phase 1: Project Bootstrap ✅
- Created project folder structure
- Set up Phaser 3 integration via CDN
- Created basic HTML and config files
- Verified Phaser rendering works
- **Completed:** October 12, 2025

### Phase 2: Basic Scene System ✅
- Implemented BootScene, PreloadScene, and MainMenuScene
- Set up automatic scene transitions
- Added console logging for debugging
- Established scene architecture pattern
- **Completed:** October 12, 2025

## Next Steps

- Add test assets to verify loading system
- Implement progress bar in PreloadScene
- Add asset loading with visual feedback
- Verify assets display correctly

## Project Structure

```
/Alphabet & Sight Words Game
├── index.html              # Main HTML entry point
├── /assets                 # Game assets
│   ├── /audio              # Sound effects and voice files
│   ├── /images             # Sprites and backgrounds
│   └── /data               # JSON data files
├── /src                    # Source code
│   ├── config.js           # Phaser game configuration
│   └── /scenes             # Game scenes
└── /.ai                    # Development documentation
    ├── PERSONA.md          # Developer identity and methodology
    ├── GUARDRAILS.md       # Code quality standards
    ├── START.md            # Development entry point
    └── /phases             # Phase-by-phase implementation docs
```

## Technology Stack

- **Phaser 3.80.1** - Game framework
- **HTML5 Canvas** - Rendering
- **Web Audio API** - Sound (via Phaser)
- **LocalStorage** - Progress persistence

## Development Approach

This project follows a strict **Behavior-Driven Development (BDD)** methodology with 44 planned phases. Each phase includes:
- PLAN.md - Detailed implementation plan
- UML.md - Architecture diagrams
- GHERKIN.md - BDD acceptance criteria

## Getting Started

1. Open `index.html` in a modern web browser
2. No build process or server required
3. All assets load from local files

## For Developers

Start here: `.ai/START.md`

This file contains:
- Current phase information
- Required reading before development
- Development workflow
- End-of-phase checklist

## Target User

**Aurora** - A young learner with ADHD who needs:
- Immediate feedback on all interactions
- Short activity cycles (2-3 minutes)
- Non-punitive error handling
- Clear progress visibility
- Engaging multi-sensory experiences

## License

Personal project for Aurora.
