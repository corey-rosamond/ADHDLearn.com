# ADHDLearn.com Child Portal

React + Phaser 3 application for child-facing features and games.

## Technology Stack

- **Framework:** React 18+ with Vite
- **Game Engine:** Phaser 3.80.1+
- **UI Library:** Tailwind CSS
- **State Management:** React Context API
- **Build Tool:** Vite

## Directory Structure

```
child-portal/
├── src/
│   ├── main.jsx           # React entry point
│   ├── App.jsx            # Main app component
│   ├── components/        # React components
│   ├── games/             # Phaser game implementations
│   ├── services/          # API and utility services
│   ├── assets/            # Images, fonts, icons
│   └── styles/            # Global styles
├── public/                # Static assets
├── index.html             # HTML entry point
├── vite.config.js         # Vite configuration
├── package.json           # Dependencies
└── README.md              # This file
```

## Development

```bash
# Install dependencies
npm install

# Run development server (http://localhost:3000)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Games

Games will be added in subsequent phases:

- **Phase 2:** Letter Pop (deployed from archive)
- **Phase 9:** Word Builder
- **Phase 10:** Sight Words
- **Phase 11:** Counting Game
- **Phase 12:** Shapes Recognition
- **Phase 13:** Simple Addition

## ADHD-Friendly Design Principles

All UI elements must follow these guidelines:

- **Immediate feedback:** < 50ms response time
- **High contrast:** WCAG AAA contrast ratios
- **Large touch targets:** ≥ 44×44px minimum
- **Non-punitive:** Encouraging messages, never "wrong" or "failure"
- **Clear progress:** Always show where they are and what's next
- **Minimal distractions:** Clean UI, focused content
- **Predictable:** Consistent layouts and interactions

## Status

- Phase 1: Directory structure created ✅
- Phase 2: Letter Pop deployment (pending)
