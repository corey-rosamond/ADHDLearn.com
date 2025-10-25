# WIREFRAMES.md - Complete UI/UX Wireframes

**ADHDLearn.com - All Screen Designs (Organized by Phase)**

**Last Updated:** October 21, 2025
**Version:** 2.0
**Approach:** Value-driven vertical slices

---

## Table of Contents

### Design System
1. [Color Palette](#color-palette)
2. [Typography](#typography)
3. [Spacing & Layout](#spacing--layout)
4. [Accessibility Standards](#accessibility-standards)

### Phase-Organized Wireframes
5. [Phase 2: Letter Pop Standalone](#phase-2-letter-pop-standalone)
6. [Phase 3: Database + Simple Backend](#phase-3-database--simple-backend)
7. [Phase 4: Parent Registration + Login](#phase-4-parent-registration--login)
8. [Phase 5: Parent Dashboard - View Scores](#phase-5-parent-dashboard---view-scores)
9. [Phase 6: Family Management](#phase-6-family-management)
10. [Phase 7: Child Login with PIN](#phase-7-child-login-with-pin)
11. [Phase 8: Child Dashboard with Categories](#phase-8-child-dashboard-with-categories)
12. [Phase 9: Add Word Builder Game](#phase-9-add-word-builder-game)
13. [Phase 10: Add Sight Words Game](#phase-10-add-sight-words-game)
14. [Phase 11-13: Math Category Games](#phase-11-13-math-category-games)
15. [Phase 15-16: Chore System](#phase-15-16-chore-system)
16. [Phase 17: Progress Charts](#phase-17-progress-charts)
17. [Phase 18: Confusion Matrix](#phase-18-confusion-matrix)
18. [Phase 19: Real-Time Updates](#phase-19-real-time-updates)
19. [Phase 20: Achievements & Badges](#phase-20-achievements--badges)
20. [Phase 21: Marketing Website](#phase-21-marketing-website)
21. [Phase 22: Age Norms Comparison](#phase-22-age-norms-comparison)
22. [Phase 23-26: Science & Life Skills](#phase-23-26-science--life-skills)
23. [Phase 27: Weekly Email Reports](#phase-27-weekly-email-reports)
24. [Phase 30: Android APK](#phase-30-android-apk)
25. [Phase 33: Parental Controls](#phase-33-parental-controls)

---

## Design System

### Color Palette

```
PARENT PORTAL (Professional, Clean)
─────────────────────────────────────
Primary Colors:
  #4A90E2  - Primary Blue (buttons, links, highlights)
  #7ED321  - Success Green (approvals, positive actions)
  #F5A623  - Warning Yellow (alerts, pending items)
  #D0021B  - Error Red (errors, rejections)
  #BD10E0  - Info Purple (information, tips)

Neutral Colors:
  #2C3E50  - Dark Blue-Gray (headings, primary text)
  #4A4A4A  - Dark Gray (secondary text)
  #9B9B9B  - Medium Gray (tertiary text, placeholders)
  #E8E8E8  - Light Gray (borders, dividers)
  #F7F9FA  - Off-White (backgrounds, cards)
  #FFFFFF  - White (main background)

Charts & Data Visualization:
  #3498DB  - Chart Blue
  #2ECC71  - Chart Green
  #E74C3C  - Chart Red
  #F39C12  - Chart Orange
  #9B59B6  - Chart Purple


CHILD PORTAL (Bright, Playful, ADHD-Optimized)
─────────────────────────────────────
Category Colors (High Saturation, High Contrast):
  #FF6B6B  - Reading Red (warm, inviting)
  #4ECDC4  - Math Teal (calm, focused)
  #95E1D3  - Science Mint (curious, exploratory)
  #FFD93D  - Life Skills Yellow (practical, sunny)
  #6C5CE7  - Cooking Purple (creative, fun)
  #FD79A8  - Shopping Pink (engaging, playful)
  #74B9FF  - 3D Printing Blue (innovative, tech)

UI Colors (Extra Bright):
  #56CCF2  - Sky Blue (primary actions)
  #6FCF97  - Grass Green (success, completion)
  #F2C94C  - Sunshine Yellow (highlights, achievements)
  #EB5757  - Coral Red (important, urgent)
  #BB6BD9  - Lavender (secondary actions)

Backgrounds:
  #FFF9E6  - Warm Cream (main background)
  #FFFFFF  - White (cards, popups)
  #2D3436  - Very Dark Gray (text - max contrast)

Special Effects:
  Gradients: All category cards use subtle gradients
  Shadows: Soft, colored shadows matching card color
  Glow: Pulsing glow on interactive elements
  Sparkles: Animated sparkle effects on achievements
```

### Typography

```
PARENT PORTAL
─────────────
Font Family:
  Headings: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif
  Body: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif
  Monospace: 'JetBrains Mono', 'Courier New', monospace (for data, codes)

Font Sizes (Desktop):
  H1: 32px / 2rem (Line Height: 40px) - Page titles
  H2: 24px / 1.5rem (Line Height: 32px) - Section headings
  H3: 18px / 1.125rem (Line Height: 24px) - Card titles
  Body: 16px / 1rem (Line Height: 24px) - Paragraph text
  Small: 14px / 0.875rem (Line Height: 20px) - Captions, labels
  Tiny: 12px / 0.75rem (Line Height: 16px) - Metadata, timestamps

Font Weights:
  700 (Bold): Headings, important labels
  600 (Semibold): Buttons, navigation
  400 (Regular): Body text
  300 (Light): Subtle text, deemphasized


CHILD PORTAL
────────────
Font Family:
  Headings: 'Fredoka One', 'Comic Neue', cursive (rounded, friendly)
  Body: 'Quicksand', 'Varela Round', sans-serif (readable, warm)
  Game Text: 'Baloo 2', 'Bubblegum Sans', cursive (playful, large)

Font Sizes (Desktop) - 25% LARGER than parent portal:
  H1: 48px / 3rem (Line Height: 56px) - Main headings
  H2: 36px / 2.25rem (Line Height: 44px) - Category titles
  H3: 28px / 1.75rem (Line Height: 36px) - Card titles
  Body: 20px / 1.25rem (Line Height: 30px) - Instructions
  Button: 24px / 1.5rem (Line Height: 32px) - All buttons
  Game Display: 64px / 4rem (Line Height: 72px) - Letter Pop target

Font Weights:
  700 (Bold): All headings, buttons
  600 (Semibold): Important body text
  500 (Medium): Regular text (easier to read than 400)

Letter Spacing:
  Headings: 0.5px (slightly wider for readability)
  Body: 0.3px
  Game Text: 1px (maximum clarity)
```

### Spacing & Layout

```
BASE UNIT: 8px (0.5rem)

SPACING SCALE (Parent Portal):
  xs:  4px  (0.5u) - Tight spacing, inline elements
  sm:  8px  (1u)   - Default inline spacing
  md:  16px (2u)   - Card padding, element margins
  lg:  24px (3u)   - Section spacing
  xl:  32px (4u)   - Large section gaps
  2xl: 48px (6u)   - Page section dividers
  3xl: 64px (8u)   - Hero sections

SPACING SCALE (Child Portal) - 50% LARGER:
  xs:  6px  - Minimum spacing
  sm:  12px - Inline elements
  md:  24px - Card padding
  lg:  36px - Between cards
  xl:  48px - Section spacing
  2xl: 72px - Major sections

BORDER RADIUS:
  Parent Portal:
    Small: 4px   - Inputs, small buttons
    Medium: 8px  - Cards, large buttons
    Large: 16px  - Modals, major containers
    XL: 24px     - Hero sections

  Child Portal:
    Small: 12px  - Minimum (more friendly)
    Medium: 16px - Cards
    Large: 24px  - Major elements
    XL: 32px     - Full-screen modals
    Round: 50%   - Avatars, badges

CONTAINER WIDTHS:
  Parent Portal:
    Full Width: 100%
    Wide: 1400px (dashboards with charts)
    Standard: 1200px (most pages)
    Narrow: 800px (forms, settings)
    Reading: 640px (text-heavy content)

  Child Portal:
    Full Width: 100% (games)
    Standard: 1000px (dashboards)
    Cards: 90% max-width (breathing room)

GRID SYSTEMS:
  Parent Portal: 12-column CSS Grid
  Child Portal: Flexbox (simpler, more flexible)

TOUCH TARGETS (WCAG AAA):
  Parent Portal (Desktop): 40x40px minimum
  Parent Portal (Mobile): 44x44px minimum
  Child Portal (All): 60x60px minimum (150% larger)
  Child Portal Buttons: 80px minimum height
```

### Accessibility Standards

```
COLOR CONTRAST (WCAG 2.1 AA+):
─────────────────────────────
Parent Portal:
  Text (16px+): 4.5:1 minimum (actual: 7:1+ for body text)
  Large Text (24px+): 3:1 minimum (actual: 4.5:1+)
  UI Components: 3:1 minimum (actual: 4:1+ for buttons, borders)

Child Portal (Enhanced for ADHD):
  Text (20px+): 7:1 minimum (maximum readability)
  Large Text (36px+): 4.5:1 minimum
  UI Components: 4.5:1 minimum (extra clear boundaries)
  No pure black (#000) - use #2D3436 (softer on eyes)
  No pure white backgrounds with dark text - use #FFF9E6 cream

SCREEN READER SUPPORT:
─────────────────────
- All images: Descriptive alt text (not "image" or "photo")
- All buttons: aria-label when icon-only
- All forms: Proper <label> associations
- Navigation: <nav> landmarks with aria-label
- Main content: <main> landmark
- Complementary content: <aside> with aria-label
- Live regions: aria-live for real-time updates (Phase 19)
- Skip links: "Skip to main content" first focusable element

KEYBOARD NAVIGATION:
───────────────────
- Tab order: Logical, follows visual flow
- Focus indicators: 3px solid outline, high contrast color
- All interactive elements: keyboard accessible (no mouse-only)
- Modal traps: Focus locked within modal when open
- Escape key: Closes modals, cancels actions
- Enter/Space: Activates buttons, links
- Arrow keys: Navigate within lists, grids

ADHD-SPECIFIC OPTIMIZATIONS:
───────────────────────────
- Response time: <50ms for all interactions (perceived as instant)
- Animations: Purposeful only (feedback, transitions)
- No auto-play: User controls all media
- Distractions: Minimal - focus on current task
- Progress: Always visible - prevent anxiety
- Time pressure: Optional - child chooses difficulty
- Sounds: Positive reinforcement only, never negative
- Colors: High saturation for focus, low saturation for rest
- Layout: Consistent - same things in same places
- Choices: Limited - 3-4 options maximum at once

MOTION & ANIMATION:
──────────────────
- Respect prefers-reduced-motion
- Default animations: <300ms duration
- Feedback animations: <150ms (instant feel)
- Transitions: Ease-out (feels responsive)
- Loading indicators: Appear after 200ms delay
- Skeleton screens: Preferred over spinners
```

---

## Phase 2: Letter Pop Standalone

**Delivers:** Aurora can play Letter Pop from her tablet (no login, localStorage only)
**URL:** child.adhdlearn.com
**Screens:** 4 (Landing, Setup, Gameplay, Results)

### 2.1 Landing Screen

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              Viewport: 100vw x 100vh                    │
│                            Background: Gradient #FFD93D → #FF6B6B       │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│                                                                         │
│                                                                         │
│                          ┌─────────────┐                                │
│                          │     🎈      │                                │
│                          │   LETTER    │ ← Bounce animation (1.5s loop)│
│                          │     POP     │                                │
│                          └─────────────┘                                │
│                                                                         │
│                                                                         │
│                      Learn Your Letters!                               │
│                                                                         │
│                                                                         │
│                    ┌───────────────────────┐                           │
│                    │                       │                           │
│                    │    START PLAYING!     │ ← 80px tall, rounded      │
│                    │                       │   Hover: scale 1.1        │
│                    └───────────────────────┘                           │
│                                                                         │
│                                                                         │
│                     [ How to Play ]  [ 🔊 Sound: ON ]                  │
│                                                                         │
│                                                                         │
│                                                                         │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘

FONTS:
  "LETTER POP": 64px Fredoka One, white, text-shadow: 0 4px 8px rgba(0,0,0,0.3)
  "Learn Your Letters!": 28px Quicksand, white
  START PLAYING: 24px Fredoka One, white
  How to Play: 18px Quicksand

COLORS:
  Background: Linear gradient 135deg from #FFD93D to #FF6B6B
  START button: #6FCF97 (grass green)
  START button hover: #52B788 (darker green)
  "How to Play" link: white, underline on hover
  Sound toggle: white text, #56CCF2 background

INTERACTIONS:
  - START PLAYING: Navigate to Setup Screen
  - How to Play: Show modal with instructions
  - Sound toggle: Click to toggle ON/OFF, persist to localStorage
  - Page load: Play cheerful sound (if sound enabled)

RESPONSIVE:
  Mobile (< 768px):
    - "LETTER POP": 48px
    - START button: Full width - 32px margin
    - Stack buttons vertically
```

### 2.2 Setup Screen

```
┌─────────────────────────────────────────────────────────────────────────┐
│  ← Back                                                    🔊 Sound: ON  │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│                      🎈 Get Ready to Pop!                               │
│                                                                         │
│                Choose what letters you want to practice                │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│                        Pick Your Letters                               │
│                                                                         │
│    ┌──────────────┐  ┌──────────────┐  ┌──────────────┐               │
│    │              │  │              │  │              │               │
│    │   A B C      │  │   a b c      │  │  A b C d     │               │
│    │              │  │              │  │              │               │
│    │  UPPERCASE   │  │  lowercase   │  │    Mixed     │               │
│    │              │  │              │  │              │               │
│    └──────────────┘  └──────────────┘  └──────────────┘               │
│           ✓                                                            │
│      (Selected)                                                        │
│                                                                         │
│  Each card: 240px wide, 180px tall, border-radius: 24px                │
│  Selected: Box-shadow: 0 8px 24px rgba(108, 92, 231, 0.4)              │
│            Border: 4px solid #6C5CE7                                   │
│  Not selected: Opacity: 0.7, grayscale filter                          │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│                        Pick Your Time                                  │
│                                                                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐              │
│  │          │  │          │  │          │  │          │              │
│  │  ⏱️ 30    │  │  ⏱️ 60    │  │  ⏱️ 90    │  │  ∞ No    │              │
│  │          │  │          │  │          │  │          │              │
│  │  Quick!  │  │  Normal  │  │  Long    │  │  Limit   │              │
│  │          │  │          │  │          │  │          │              │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘              │
│                      ✓                                                 │
│                  (Selected)                                            │
│                                                                         │
│  Each card: 150px wide, 140px tall                                     │
│  Colors: #56CCF2 (blue) when selected                                  │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│                                                                         │
│                    ┌───────────────────────┐                           │
│                    │                       │                           │
│                    │    LET'S GO! 🎈       │ ← Pulse animation         │
│                    │                       │                           │
│                    └───────────────────────┘                           │
│                                                                         │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘

FONTS:
  "Get Ready to Pop!": 36px Fredoka One, #2D3436
  Subheading: 20px Quicksand, #4A4A4A
  Section titles: 28px Fredoka One, #2D3436
  Card labels: 20px Quicksand, #2D3436
  LET'S GO button: 24px Fredoka One, white

COLORS:
  Background: #FFF9E6 (warm cream)
  Letter type cards: White background
  Time cards: White background
  LET'S GO button: Gradient #6FCF97 → #52B788
  Selected border: #6C5CE7 (purple)

INTERACTIONS:
  - Click card: Select option (only one per category)
  - LET'S GO: Disabled until both selections made
  - LET'S GO: Navigate to Gameplay, pass selections
  - Back arrow: Return to Landing
  - Auto-save selections to localStorage

RESPONSIVE:
  Mobile (< 768px):
    - Stack cards vertically
    - Full width - 16px margins
    - LET'S GO: Full width
```

### 2.3 Gameplay Screen (Phaser Canvas)

```
┌─────────────────────────────────────────────────────────────────────────┐
│  ⏸️                    LETTER POP                      Score: 120  ⏱️ 42 │
└─────────────────────────────────────────────────────────────────────────┘
  HUD: Fixed position, 64px height, white background, shadow

┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│                        Find the letter:                                │
│                                                                         │
│                             A                                          │
│                                                                         │
│                         (15/20 found)                                  │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
  Instruction panel: 160px height, gradient #FF6B6B → #FFD93D
  Target letter: 64px Fredoka One, white, pulsing glow
  Progress: 20px Quicksand, white

┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│                         [GAME CANVAS]                                  │
│                                                                         │
│         ┌───────┐                        ┌───────┐                     │
│         │   B   │                        │   M   │                     │
│         │       │ ← Float upward         │       │                     │
│         └───────┘   Rotate slightly      └───────┘                     │
│                                                                         │
│                  ┌───────┐                                             │
│                  │   A   │ ← TARGET (glowing border)                   │
│                  │       │   Scale pulse 1.0 → 1.1                     │
│                  └───────┘                                             │
│    ┌───────┐                                                           │
│    │   F   │                     ┌───────┐                             │
│    │       │                     │   T   │                             │
│    └───────┘                     │       │                             │
│                                  └───────┘                             │
│                                        ┌───────┐                       │
│         ┌───────┐                      │   K   │                       │
│         │   D   │                      │       │                       │
│         │       │                      └───────┘                       │
│         └───────┘                                                       │
│                   ┌───────┐                                            │
│                   │   R   │                                            │
│                   │       │                                            │
│                   └───────┘                                            │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
  Canvas: Phaser 3, 100% width, calc(100vh - 224px) height
  Background: Gradient #56CCF2 → #74B9FF (sky blue)

BUBBLE SPECIFICATIONS:
  Size: 100px × 100px (scaled for mobile)
  Font: 48px Fredoka One
  Colors:
    - Random pastel backgrounds (different each bubble)
    - Letter color: #2D3436 (dark gray, max contrast)
  Border: 3px solid white
  Shadow: 0 4px 12px rgba(0,0,0,0.2)

  Target bubble:
    - Border: 4px solid #FFD93D (yellow glow)
    - Box-shadow: 0 0 20px #FFD93D (pulsing)
    - Scale animation: 1.0 → 1.1 → 1.0 (1s loop)

PHYSICS:
  - Spawn rate: 1 bubble per 2 seconds
  - Float speed: 50px/second upward
  - Rotation: Random -15° to +15°
  - Bounce: Off left/right walls
  - Despawn: When reaches top (no penalty)
  - Max bubbles on screen: 8

INTERACTIONS:
  Tap/Click correct letter:
    - Play success sound (letter name audio)
    - Bubble pops: Particle explosion (8 sparkles)
    - +10 points
    - Score counter animates (scale 1.0 → 1.2 → 1.0)
    - Found counter increments (15/20 → 16/20)
    - Vibration: 50ms (mobile only)
    - Next target letter appears after 500ms

  Tap/Click wrong letter:
    - Play error sound (gentle "oops" tone)
    - Bubble shakes (left-right, 100ms)
    - Red flash border (200ms)
    - No score change
    - No vibration

  Pause button (⏸️):
    - Freeze all physics
    - Show pause modal overlay
    - Options: Resume, Restart, Quit

  Timer reaches 0:
    - Freeze game
    - Play completion sound
    - Transition to Results (1s delay)

RESPONSIVE:
  Mobile (< 768px):
    - Bubbles: 80px × 80px
    - Letter font: 36px
    - HUD: Stack score/timer vertically if needed
```

### 2.4 Results Screen

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│                                                                         │
│                           🎉 🎉 🎉                                       │
│                                                                         │
│                       Great Job Playing!                               │
│                                                                         │
│                                                                         │
│                ┌──────────────────────────────┐                        │
│                │                              │                        │
│                │        ⭐ ⭐ ⭐ ⭐            │ ← Appear one-by-one    │
│                │                              │   with sound           │
│                │       Score: 180             │                        │
│                │                              │                        │
│                └──────────────────────────────┘                        │
│                                                                         │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│                      📊 How You Did                                     │
│                                                                         │
│    ┌─────────────────────────────────────────────────────────┐         │
│    │                                                         │         │
│    │  ⏱️  Time                                60 seconds     │         │
│    │                                                         │         │
│    │  🎯 Letters Found                       18 out of 21   │         │
│    │                                                         │         │
│    │  ✨ Accuracy                            85%            │         │
│    │     ████████████████████████░░░░░░                      │         │
│    │                                                         │         │
│    │  🏆 Your Best Score                     190            │         │
│    │                                                         │         │
│    └─────────────────────────────────────────────────────────┘         │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│                    ✅ You Mastered These                                │
│                                                                         │
│            A  B  C  D  E  F  G  H  I  J  K  L  M                       │
│            N  O  P  Q  R                                               │
│                                                                         │
│                  Each letter: Green badge, 40px tall                   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│                    ⚠️  Keep Practicing                                  │
│                                                                         │
│                      S  T  U                                           │
│                                                                         │
│                  Each letter: Yellow badge, 40px tall                  │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│                                                                         │
│            ┌────────────────┐      ┌────────────────┐                  │
│            │                │      │                │                  │
│            │  PLAY AGAIN!   │      │  BACK TO MENU  │                  │
│            │                │      │                │                  │
│            └────────────────┘      └────────────────┘                  │
│                                                                         │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘

FONTS:
  "Great Job Playing!": 36px Fredoka One, #2D3436
  Score: 48px Fredoka One, #6C5CE7 (purple)
  Stars: 64px emoji (native)
  Section headers: 28px Fredoka One
  Stats labels: 20px Quicksand
  Stats values: 24px Quicksand Bold
  Letter badges: 28px Fredoka One
  Buttons: 24px Fredoka One

COLORS:
  Background: #FFF9E6 (cream)
  Stats card: White, shadow: 0 4px 16px rgba(0,0,0,0.1)
  Accuracy bar: #6FCF97 (green)
  Mastered badges: #6FCF97 background, white text
  Practice badges: #F2C94C background, #2D3436 text
  PLAY AGAIN: #6FCF97 (green)
  BACK TO MENU: #56CCF2 (blue)

ANIMATIONS:
  - Stars appear: Fade in + scale, staggered 300ms each
  - Score counts up: From 0 to actual over 1s
  - Accuracy bar: Fills from 0% to 85% over 1s
  - Letter badges: Fade in, staggered 50ms each
  - Confetti: Falls from top on page load

INTERACTIONS:
  - PLAY AGAIN: Reset game, return to Setup
  - BACK TO MENU: Return to Landing
  - Data saved to localStorage:
    - High score (if new high)
    - Letter accuracy (which letters found/missed)
    - Session count
    - Total time played

RESPONSIVE:
  Mobile (< 768px):
    - Stack buttons vertically
    - Letter badges: 32px font, wrap to multiple lines
    - Stats: Larger touch targets
```

---

## Phase 3: Database + Simple Backend

**Delivers:** Scores persist to MySQL database, high scores display
**New Screens:** High Scores list on results screen
**Changes:** Results screen now shows "All-Time High Scores"

### 3.1 Updated Results Screen (Bottom Section)

```
┌─────────────────────────────────────────────────────────────────────────┐
│            [Previous results content above...]                          │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│                    🏆 All-Time High Scores                              │
│                                                                         │
│    ┌─────────────────────────────────────────────────────────┐         │
│    │                                                         │         │
│    │  #1  190 points        Today at 9:15 AM      ⭐⭐⭐⭐    │         │
│    │                                                         │         │
│    │  #2  180 points        Today at 8:42 AM      ⭐⭐⭐⭐    │ ← Current│
│    │      YOU!  (Just now)                                  │   session│
│    │                                                         │         │
│    │  #3  175 points        Yesterday             ⭐⭐⭐      │         │
│    │                                                         │         │
│    │  #4  160 points        2 days ago            ⭐⭐⭐      │         │
│    │                                                         │         │
│    │  #5  155 points        Oct 19               ⭐⭐⭐      │         │
│    │                                                         │         │
│    └─────────────────────────────────────────────────────────┘         │
│                                                                         │
│    Shows top 5 scores from localStorage OR database (Phase 3+)         │
│    Current session highlighted with yellow background                  │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘

FONTS:
  "All-Time High Scores": 28px Fredoka One, #2D3436
  Rank (#1, #2): 20px Quicksand Bold, #9B59B6
  Score: 24px Quicksand Bold, #2D3436
  Date: 18px Quicksand, #4A4A4A
  "YOU!": 18px Fredoka One, #6FCF97

COLORS:
  Card background: White
  Current session row: #FFF9E6 (cream highlight)
  #1 rank: Gold gradient background
  YOU! badge: #6FCF97 background, white text

INTERACTIONS:
  - Scores fetch from: POST /api/sessions/high-scores
  - Auto-scroll to current session if in list
  - Refresh every time results screen loads

DATA FLOW (Phase 3):
  On game end:
    1. POST /api/sessions/create
       Body: {
         score: 180,
         duration: 60,
         letters_found: 18,
         letters_total: 21,
         mode: 'uppercase',
         accuracy: 0.85,
         letter_stats: {A: {shown: 3, found: 3}, B: {shown: 2, found: 1}, ...}
       }
    2. Response: {session_id: 123, is_high_score: true, rank: 2}
    3. If is_high_score: Animate "NEW HIGH SCORE!" banner
    4. Fetch high scores: GET /api/sessions/high-scores?limit=5
    5. Display in table
```

---

## Phase 4: Parent Registration + Login

**Delivers:** Parents can create accounts and login
**URL:** parent.adhdlearn.com
**Screens:** 3 (Login, Registration, Forgot Password)

### 4.1 Parent Login Screen

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│                                                                         │
│                       ┌──────────────┐                                  │
│                       │  📚 ADHD     │                                  │
│                       │    Learn     │  ← Logo, 48px Fredoka One       │
│                       └──────────────┘                                  │
│                                                                         │
│                                                                         │
│                      Welcome Back, Parent!                             │
│                                                                         │
│                                                                         │
│         ┌──────────────────────────────────────────────────┐           │
│         │                                                  │           │
│         │  Email Address                                   │           │
│         │  ┌────────────────────────────────────────────┐  │           │
│         │  │ sarah@example.com                          │  │           │
│         │  └────────────────────────────────────────────┘  │           │
│         │                                                  │           │
│         │  Password                                        │           │
│         │  ┌────────────────────────────────────────────┐  │           │
│         │  │ ••••••••••••                    👁️ [Show]  │  │           │
│         │  └────────────────────────────────────────────┘  │           │
│         │                                                  │           │
│         │  ☑️ Remember me on this device                   │           │
│         │                                                  │           │
│         │                                                  │           │
│         │               ┌────────────────┐                 │           │
│         │               │   LOG IN       │                 │           │
│         │               └────────────────┘                 │           │
│         │                                                  │           │
│         │                                                  │           │
│         │         [Forgot your password?]                  │           │
│         │                                                  │           │
│         │  ─────────────────────────────────────────────  │           │
│         │                                                  │           │
│         │         Don't have an account yet?               │           │
│         │               [Create Account]                   │           │
│         │                                                  │           │
│         └──────────────────────────────────────────────────┘           │
│                                                                         │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘

LAYOUT:
  Viewport: 100vw × 100vh
  Card: 480px wide, centered, white background
  Padding: 48px
  Border-radius: 16px
  Shadow: 0 8px 32px rgba(0,0,0,0.1)

FONTS:
  Logo: 48px Fredoka One, #4A90E2
  "Welcome Back": 24px Inter Bold, #2C3E50
  Labels: 14px Inter, #4A4A4A
  Input text: 16px Inter, #2C3E50
  Links: 14px Inter, #4A90E2
  Button: 16px Inter Semibold, white

COLORS:
  Background: Linear gradient 135deg #E8F4F8 → #FFFFFF
  Card: #FFFFFF
  Inputs: #F7F9FA background, #E8E8E8 border
  Input focus: #4A90E2 border (2px)
  LOG IN button: #4A90E2
  LOG IN hover: #3A7BC8
  Links: #4A90E2, underline on hover
  Checkbox: #4A90E2 when checked

FORM VALIDATION:
  Real-time validation on blur:
    Email:
      - Empty: "Email is required"
      - Invalid: "Please enter a valid email address"
      - Border color: #D0021B (red)

    Password:
      - Empty: "Password is required"
      - Border color: #D0021B (red)

  Submit validation:
    - Disable LOG IN button if validation errors
    - Show error message below button if API returns error:
      "Invalid email or password. Please try again."
    - Shake animation on card if error

INTERACTIONS:
  - Email input: type="email", autocomplete="email"
  - Password input: type="password", autocomplete="current-password"
  - Show/Hide: Toggle password visibility
  - Remember me: Persist JWT token to localStorage (7 days)
  - LOG IN: POST /api/auth/login
    Body: {email, password}
    Success: Redirect to /dashboard
    Error: Show error message
  - Create Account: Navigate to /register
  - Forgot password: Navigate to /forgot-password

RESPONSIVE:
  Mobile (< 768px):
    - Card: 100% width, 16px margin
    - Padding: 24px
    - Full-screen height
```

### 4.2 Parent Registration Screen

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│                       ┌──────────────┐                                  │
│                       │  📚 ADHD     │                                  │
│                       │    Learn     │                                  │
│                       └──────────────┘                                  │
│                                                                         │
│                    Create Your Family Account                          │
│                                                                         │
│         ┌──────────────────────────────────────────────────┐           │
│         │                                                  │           │
│         │  First Name *                                    │           │
│         │  ┌────────────────────────────────────────────┐  │           │
│         │  │ Sarah                                      │  │           │
│         │  └────────────────────────────────────────────┘  │           │
│         │                                                  │           │
│         │  Last Name *                                     │           │
│         │  ┌────────────────────────────────────────────┐  │           │
│         │  │ Johnson                                    │  │           │
│         │  └────────────────────────────────────────────┘  │           │
│         │                                                  │           │
│         │  Email Address *                                 │           │
│         │  ┌────────────────────────────────────────────┐  │           │
│         │  │ sarah@example.com                          │  │           │
│         │  └────────────────────────────────────────────┘  │           │
│         │                                                  │           │
│         │  Password *                                      │           │
│         │  ┌────────────────────────────────────────────┐  │           │
│         │  │ ••••••••••••                    👁️ [Show]  │  │           │
│         │  └────────────────────────────────────────────┘  │           │
│         │                                                  │           │
│         │  Password Strength:                              │           │
│         │  ✓ At least 8 characters                         │           │
│         │  ✓ Contains uppercase letter (A-Z)               │           │
│         │  ✓ Contains lowercase letter (a-z)               │           │
│         │  ✓ Contains number (0-9)                         │           │
│         │  ✗ Contains special character (!@#$%...)         │           │
│         │                                                  │           │
│         │  Confirm Password *                              │           │
│         │  ┌────────────────────────────────────────────┐  │           │
│         │  │ ••••••••••••                    👁️ [Show]  │  │           │
│         │  └────────────────────────────────────────────┘  │           │
│         │                                                  │           │
│         │  ☑️ I agree to the [Terms of Service] and        │           │
│         │     [Privacy Policy]                             │           │
│         │                                                  │           │
│         │               ┌────────────────┐                 │           │
│         │               │ CREATE ACCOUNT │                 │           │
│         │               └────────────────┘                 │           │
│         │                                                  │           │
│         │  ─────────────────────────────────────────────  │           │
│         │                                                  │           │
│         │         Already have an account?                 │           │
│         │                  [Log In]                        │           │
│         │                                                  │           │
│         └──────────────────────────────────────────────────┘           │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘

LAYOUT:
  Same as login, 480px card

PASSWORD STRENGTH INDICATOR:
  Updates in real-time as user types:
    - Each requirement: ✓ (green) or ✗ (gray)
    - All met: Change CREATE ACCOUNT button to green
    - < 4 requirements: Button disabled (gray, not clickable)

  Colors:
    ✓ Met: #7ED321 (green check), #2C3E50 text
    ✗ Not met: #E8E8E8 (gray X), #9B9B9B text

FORM VALIDATION:
  First/Last Name:
    - Min 2 characters
    - Max 50 characters
    - Letters, spaces, hyphens only

  Email:
    - Valid email format
    - Max 255 characters
    - Check availability: GET /api/auth/check-email?email=
      - If exists: "This email is already registered. [Log in instead?]"

  Password:
    - Min 8 characters
    - All 5 requirements (see above)

  Confirm Password:
    - Must match Password exactly
    - Show error if doesn't match: "Passwords do not match"

  Terms checkbox:
    - Must be checked to enable CREATE ACCOUNT button

INTERACTIONS:
  - CREATE ACCOUNT: POST /api/auth/register
    Body: {first_name, last_name, email, password}
    Success:
      - Store JWT token
      - Redirect to /dashboard with welcome modal
    Error:
      - Email exists: "Email already registered"
      - Validation: Show specific field errors

  - Terms/Privacy: Open in modal (Phase 21)
  - Log In: Navigate to /login

RESPONSIVE:
  Mobile (< 768px):
    - Full width
    - Scroll if needed
    - Fixed CREATE ACCOUNT button at bottom
```

### 4.3 Forgot Password Screen

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│                       ┌──────────────┐                                  │
│                       │  📚 ADHD     │                                  │
│                       │    Learn     │                                  │
│                       └──────────────┘                                  │
│                                                                         │
│                      Reset Your Password                               │
│                                                                         │
│                  Enter your email address and we'll                    │
│                   send you a link to reset it.                         │
│                                                                         │
│         ┌──────────────────────────────────────────────────┐           │
│         │                                                  │           │
│         │  Email Address                                   │           │
│         │  ┌────────────────────────────────────────────┐  │           │
│         │  │ sarah@example.com                          │  │           │
│         │  └────────────────────────────────────────────┘  │           │
│         │                                                  │           │
│         │                                                  │           │
│         │               ┌────────────────┐                 │           │
│         │               │  SEND LINK     │                 │           │
│         │               └────────────────┘                 │           │
│         │                                                  │           │
│         │                                                  │           │
│         │           [← Back to Login]                      │           │
│         │                                                  │           │
│         └──────────────────────────────────────────────────┘           │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘

Success state (after clicking SEND LINK):

┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│                       ┌──────────────┐                                  │
│                       │  📚 ADHD     │                                  │
│                       │    Learn     │                                  │
│                       └──────────────┘                                  │
│                                                                         │
│                        Check Your Email                                │
│                                                                         │
│         ┌──────────────────────────────────────────────────┐           │
│         │                                                  │           │
│         │                    ✉️                            │           │
│         │                                                  │           │
│         │  We've sent a password reset link to:            │           │
│         │                                                  │           │
│         │          sarah@example.com                       │           │
│         │                                                  │           │
│         │  Please check your email and click the link      │           │
│         │  to reset your password. The link expires        │           │
│         │  in 1 hour.                                      │           │
│         │                                                  │           │
│         │  Didn't receive it? [Resend email]               │           │
│         │                                                  │           │
│         │                                                  │           │
│         │           [← Back to Login]                      │           │
│         │                                                  │           │
│         └──────────────────────────────────────────────────┘           │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘

INTERACTIONS:
  - SEND LINK: POST /api/auth/forgot-password
    Body: {email}
    Success: Show success state (ALWAYS, even if email doesn't exist - security)
    Error: Network error only

  - Resend: Same POST, show toast "Email sent again"

  - Email contains link: parent.adhdlearn.com/reset-password?token=xxx
    Opens new screen with password reset form

SECURITY:
  - Never reveal if email exists or not (always show success)
  - Token expires after 1 hour
  - One-time use token (invalidated after reset)
```

---

## Phase 5: Parent Dashboard - View Scores

**Delivers:** Parents see their children's Letter Pop scores and history
**New Screens:** Parent Dashboard, Child Progress View
**Database:** Families, users tables linked to sessions

### 5.1 Parent Dashboard (First Time - No Children)

```
┌─────────────────────────────────────────────────────────────────────────┐
│  📚 ADHDLearn    [Dashboard] [Family] [Reports]      👤 Sarah ▾  [🔔 0] │
└─────────────────────────────────────────────────────────────────────────┘
  Navigation: Fixed top, 64px height, white, shadow

┌─────────────────────────────────────────────────────────────────────────┐
│  Welcome, Sarah! 👋                                                     │
│  Let's get started by adding your first child.                         │
└─────────────────────────────────────────────────────────────────────────┘
  Welcome banner: 120px height, gradient #4A90E2 → #6C5CE7, white text

┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│                    👨‍👩‍👧‍👦 Your Children                                  │
│                                                                         │
│                                                                         │
│                   ┌────────────────────────────┐                        │
│                   │                            │                        │
│                   │           👶              │                        │
│                   │                            │                        │
│                   │    No children added yet   │                        │
│                   │                            │                        │
│                   │      [ + Add Child ]       │                        │
│                   │                            │                        │
│                   └────────────────────────────┘                        │
│                                                                         │
│                                                                         │
│  Empty state card: 400px wide, centered, dashed border #E8E8E8         │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘

USER MENU DROPDOWN (Click "👤 Sarah ▾"):
┌──────────────────────┐
│  Sarah Johnson       │ ← Name, bold
│  sarah@example.com   │ ← Email, small, gray
│  ────────────────────│
│  Account Settings    │
│  Subscription        │
│  Help & Support      │
│  ────────────────────│
│  Log Out             │
└──────────────────────┘
  Dropdown: 240px wide, right-aligned, shadow

INTERACTIONS:
  - Add Child: Open Add Child modal (see Phase 6)
  - User menu: Toggle dropdown
  - Notifications: Show notification panel (Phase 19)
```

### 5.2 Parent Dashboard (With Children)

```
┌─────────────────────────────────────────────────────────────────────────┐
│  📚 ADHDLearn    [Dashboard] [Family] [Reports]      👤 Sarah ▾  [🔔 3] │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│  Welcome back, Sarah! 👋                                                │
│  Last login: Today at 9:45 AM                                           │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                        📊 Family Overview                               │
│                                                                         │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐           │
│  │                │  │                │  │                │           │
│  │      📚        │  │      🔥        │  │      ⏱️         │           │
│  │  Total         │  │  Active        │  │  Learning      │           │
│  │  Sessions      │  │  Streak        │  │  Time Today    │           │
│  │                │  │                │  │                │           │
│  │     156        │  │   7 days       │  │   2h 15m       │           │
│  │                │  │                │  │                │           │
│  └────────────────┘  └────────────────┘  └────────────────┘           │
│                                                                         │
│  Each card: 280px wide, white background, centered stats               │
│  Icons: 48px, colored                                                  │
│  Numbers: 36px Inter Bold, #2C3E50                                     │
│  Labels: 14px Inter, #4A4A4A                                           │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                          👨‍👩‍👧‍👦 Your Children                              │
│                                                                         │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                                                                  │  │
│  │  ┌─────┐  🌈 Aurora Johnson              🟢 Offline             │  │
│  │  │     │  Age: 7 years old                                      │  │
│  │  │ 🌈  │  Last active: 12 minutes ago                           │  │
│  │  │     │                                                         │  │
│  │  └─────┘  Recent Activity:                                      │  │
│  │  Avatar    • Letter Pop - 12 min ago - Score: 180 (85%)         │  │
│  │  80x80px   • Word Builder - 2 hours ago - Score: 95 (72%)       │  │
│  │                                                                  │  │
│  │           Quick Stats This Week:                                │  │
│  │           📚 12 sessions  |  ⏱️ 3h 45m  |  📈 Avg: 88%          │  │
│  │                                                                  │  │
│  │           ⚠️ Pattern Detected:                                   │  │
│  │           Confuses 'b' and 'd' frequently (confuse rate: 42%)   │  │
│  │                                                                  │  │
│  │           [ View Full Progress ]  [ View Live Activity ]        │  │
│  │                                                                  │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                         │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                                                                  │  │
│  │  ┌─────┐  🦋 Emma Johnson                ⚪ Offline              │  │
│  │  │     │  Age: 5 years old                                      │  │
│  │  │ 🦋  │  Last active: 1 day ago                                │  │
│  │  │     │                                                         │  │
│  │  └─────┘  Recent Activity:                                      │  │
│  │            • Counting Game - Yesterday - Score: 120 (95%)       │  │
│  │                                                                  │  │
│  │           Quick Stats This Week:                                │  │
│  │           📚 5 sessions  |  ⏱️ 1h 20m  |  📈 Avg: 91%           │  │
│  │                                                                  │  │
│  │           [ View Full Progress ]  [ View Live Activity ]        │  │
│  │                                                                  │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                         │
│  [ + Add Another Child ]                                               │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘

CHILD CARD STATUS INDICATORS:
  🟢 Playing Now: Green dot + "Playing [game name]" + Elapsed time
  🟡 Idle: Yellow dot + "Last active: [time ago]"
  ⚪ Offline: Gray dot + "Last active: [time/date]"

INTERACTIONS:
  - View Full Progress: Navigate to /children/:id/progress
  - View Live Activity: Navigate to /children/:id/live (Phase 19)
  - Add Another Child: Open Add Child modal
  - Click child card: Navigate to progress page
  - Hover card: Subtle lift effect (translateY -4px)

DATA REFRESH:
  - Auto-refresh: Every 30 seconds (polls API)
  - Manual refresh: Button in top nav
  - WebSocket updates: Phase 19+

RESPONSIVE:
  Tablet (< 1200px):
    - Stats cards: 2 columns
    - Child cards: Full width

  Mobile (< 768px):
    - Stats cards: 1 column, stacked
    - Child cards: Simplified layout
    - Buttons: Full width
```

### 5.3 Child Progress Page (Aurora)

```
┌─────────────────────────────────────────────────────────────────────────┐
│  📚 ADHDLearn    [Dashboard] [Family] [Reports]      👤 Sarah ▾  [🔔 3] │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│  ← Back to Dashboard                                [ Generate PDF ]     │
│                                                                         │
│  🌈 Aurora's Progress                                                   │
│  Age 7 • Member since Jan 15, 2025                                      │
│                                                                         │
│  [ Last 7 days ▾ ]  [ All Activities ▾ ]  [ Export Data ▾ ]            │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                        📊 Overview Stats                                │
│                                                                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐ │
│  │          │  │          │  │          │  │          │  │          │ │
│  │ 📚 Total │  │ ⏱️ Total  │  │ 📈 Avg   │  │ 🔥 Streak│  │ ⭐ Points│ │
│  │ Sessions │  │ Time     │  │ Score    │  │          │  │          │ │
│  │          │  │          │  │          │  │          │  │          │ │
│  │   65     │  │ 10h 25m  │  │   83%    │  │  5 days  │  │   450    │ │
│  │          │  │          │  │          │  │          │  │          │ │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘  └──────────┘ │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                    📈 Progress Over Time (Last 7 Days)                  │
│                                                                         │
│  Average Score (%)                                                      │
│  100 ┤                                                                  │
│   90 ┤                                   ●────●                         │
│   80 ┤               ●───────●                                          │
│   70 ┤       ●───────●                                                  │
│   60 ┤                                                                  │
│   50 ┤                                                                  │
│      └────┬────┬────┬────┬────┬────┬────┬────                          │
│         Mon  Tue  Wed  Thu  Fri  Sat  Sun                              │
│                                                                         │
│  Sessions per day:                                                      │
│   10 ┤                                                                  │
│    8 ┤                                                                  │
│    6 ┤       ▆                   ▆    ▆                                 │
│    4 ┤   ▆   ▆   ▆   ▆       ▆   ▆    ▆                                 │
│    2 ┤   ▆   ▆   ▆   ▆   ▆   ▆   ▆    ▆                                 │
│      └────┬────┬────┬────┬────┬────┬────┬────                          │
│         Mon  Tue  Wed  Thu  Fri  Sat  Sun                              │
│                                                                         │
│  Charts: Chart.js, responsive, tooltips on hover                        │
│  Colors: #4A90E2 (line), #7ED321 (bars)                                │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                      🎯 Activity Breakdown                              │
│                                                                         │
│  ┌────────────────────────────────────────────────────────────┐        │
│  │                                                            │        │
│  │  📚 Letter Pop                                  45 sessions│        │
│  │  ████████████████████████████████████░░░░░░░░░░░░  69%     │        │
│  │  6h 30m  •  Avg Score: 87%  •  Last played: 12 min ago    │        │
│  │                                                            │        │
│  │  [ View Detailed Analytics ]                              │        │
│  │                                                            │        │
│  └────────────────────────────────────────────────────────────┘        │
│                                                                         │
│  ┌────────────────────────────────────────────────────────────┐        │
│  │                                                            │        │
│  │  🏗️ Word Builder                                 12 sessions│        │
│  │  ████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  18%     │        │
│  │  2h 15m  •  Avg Score: 72%  •  Last played: 2 hours ago   │        │
│  │                                                            │        │
│  │  [ View Detailed Analytics ]                              │        │
│  │                                                            │        │
│  └────────────────────────────────────────────────────────────┘        │
│                                                                         │
│  ┌────────────────────────────────────────────────────────────┐        │
│  │                                                            │        │
│  │  🔢 Counting Game                                 8 sessions│        │
│  │  ████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  13%     │        │
│  │  1h 40m  •  Avg Score: 91%  •  Last played: Yesterday     │        │
│  │                                                            │        │
│  │  [ View Detailed Analytics ]                              │        │
│  │                                                            │        │
│  └────────────────────────────────────────────────────────────┘        │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                    📅 Recent Sessions                                   │
│                                                                         │
│  Date & Time      │ Activity      │ Duration │ Score │ Accuracy        │
│  ────────────────┼───────────────┼──────────┼───────┼─────────         │
│  Today, 9:15 AM   │ Letter Pop    │  8m 34s  │  180  │ 85% (18/21)     │
│  Today, 8:42 AM   │ Word Builder  │  6m 12s  │   95  │ 72% (8/11)      │
│  Yesterday, 2:30p │ Letter Pop    │  7m 45s  │  160  │ 82% (16/20)     │
│  Yesterday, 10:05a│ Counting Game │  5m 20s  │  120  │ 95% (19/20)     │
│  Oct 19, 9:22 AM  │ Letter Pop    │  8m 52s  │  190  │ 88% (19/22)     │
│                                                                         │
│  [ Load More Sessions ]                                                │
│                                                                         │
│  Table: Striped rows, hover highlight                                  │
│  Click row: Expand to show detailed session data                       │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘

INTERACTIONS:
  - Time range selector: Refresh all charts/stats
  - Activity filter: Show only selected activities
  - View Detailed Analytics: Navigate to /children/:id/activities/:activity_id
  - Generate PDF: Download PDF report (Phase 29)
  - Export Data: Download CSV of all sessions
  - Click session row: Expand inline details

API CALLS:
  - GET /api/children/:id/stats?range=7d
  - GET /api/children/:id/sessions?limit=50&offset=0
  - GET /api/children/:id/activities

RESPONSIVE:
  Tablet (< 1200px):
    - Stats: 3 columns, wrap to 2 rows
    - Charts: Stack vertically

  Mobile (< 768px):
    - Stats: 2 columns
    - Charts: Full width, scrollable
    - Table: Card layout instead of table
```

---

## Phase 6: Family Management

**Delivers:** Parents can add children with names, avatars, birth dates, and PINs
**New Screens:** Family Settings, Add/Edit Child Modals
**Database:** Children stored in users table with role='child'

### 6.1 Family Settings Page

```
┌─────────────────────────────────────────────────────────────────────────┐
│  📚 ADHDLearn    [Dashboard] [Family] [Reports]      👤 Sarah ▾  [🔔 0] │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│  ← Back to Dashboard                                                    │
│                                                                         │
│  👨‍👩‍👧‍👦 Family Management                                                  │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│  👨‍👩‍👧 Parents (2)                                        [ + Invite Parent]│
│                                                                         │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                                                                  │  │
│  │  Sarah Johnson                              👑 Primary Account   │  │
│  │  sarah@example.com                                               │  │
│  │  Joined: Jan 15, 2025                                            │  │
│  │                                                                  │  │
│  │  [ Edit Profile ]                                                │  │
│  │                                                                  │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                         │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                                                                  │  │
│  │  John Johnson                               👤 Parent            │  │
│  │  john@example.com                                                │  │
│  │  Joined: Jan 20, 2025                                            │  │
│  │                                                                  │  │
│  │  [ Edit Profile ]  [ Remove ]                                    │  │
│  │                                                                  │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│  👶 Children (2)                                          [ + Add Child ]│
│                                                                         │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                                                                  │  │
│  │  ┌─────┐                                                         │  │
│  │  │     │  🌈 Aurora Johnson                                      │  │
│  │  │ 🌈  │  Age: 7 years old  •  Born: May 15, 2018                │  │
│  │  │     │  PIN: ••••                                              │  │
│  │  └─────┘  Member since: Jan 15, 2025                             │  │
│  │  80x80                                                           │  │
│  │            Total Sessions: 65  •  Total Points: 450              │  │
│  │                                                                  │  │
│  │            [ Edit ]  [ View Progress ]  [ Reset PIN ]            │  │
│  │                                                                  │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                         │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                                                                  │  │
│  │  ┌─────┐                                                         │  │
│  │  │     │  🦋 Emma Johnson                                        │  │
│  │  │ 🦋  │  Age: 5 years old  •  Born: Aug 3, 2020                 │  │
│  │  │     │  PIN: ••••                                              │  │
│  │  └─────┘  Member since: Jan 15, 2025                             │  │
│  │                                                                  │  │
│  │            Total Sessions: 28  •  Total Points: 180              │  │
│  │                                                                  │  │
│  │            [ Edit ]  [ View Progress ]  [ Reset PIN ]            │  │
│  │                                                                  │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘

INTERACTIONS:
  - Add Child: Open Add Child modal
  - Edit: Open Edit Child modal (pre-filled)
  - View Progress: Navigate to child progress page
  - Reset PIN: Open Reset PIN modal
  - Remove (parent): Confirm dialog, then DELETE /api/families/:id/parents/:parent_id
  - Invite Parent: Open Invite Parent modal (Phase 31)

DELETE CHILD PROTECTION:
  - Can't delete child with sessions
  - Must "Archive" instead (keeps data, hides from UI)
  - Requires confirmation + password re-entry
```

### 6.2 Add Child Modal

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        [BACKDROP - Dark overlay 80%]                    │
│                                                                         │
│   ┌─────────────────────────────────────────────────────────────────┐  │
│   │                                                                 │  │
│   │                 Add a Child                                 ✕   │  │
│   │                                                                 │  │
│   ├─────────────────────────────────────────────────────────────────┤  │
│   │                                                                 │  │
│   │  First Name *                                                   │  │
│   │  ┌───────────────────────────────────────────────────────────┐ │  │
│   │  │ Aurora                                                    │ │  │
│   │  └───────────────────────────────────────────────────────────┘ │  │
│   │                                                                 │  │
│   │  Last Name (optional)                                           │  │
│   │  ┌───────────────────────────────────────────────────────────┐ │  │
│   │  │ Johnson                                                   │ │  │
│   │  └───────────────────────────────────────────────────────────┘ │  │
│   │                                                                 │  │
│   │  Birth Date *                                                   │  │
│   │  ┌───────────────────────────────────────────────────────────┐ │  │
│   │  │ 05/15/2018                                      📅        │ │  │
│   │  └───────────────────────────────────────────────────────────┘ │  │
│   │  Age: 7 years old                                               │  │
│   │                                                                 │  │
│   │  Choose an Avatar *                                             │  │
│   │  ┌──────────────────────────────────────────────────────────┐  │  │
│   │  │                                                          │  │  │
│   │  │  🌈  🦋  🚀  🐱  🐶  🐼  🦁  🐘  🐠  🌟  🎨  ⚽  🎸  🌺    │  │  │
│   │  │                                                          │  │  │
│   │  │  (🌈 selected - highlighted border)                     │  │  │
│   │  │                                                          │  │  │
│   │  └──────────────────────────────────────────────────────────┘  │  │
│   │                                                                 │  │
│   │  Create a 4-digit PIN *                                         │  │
│   │  ┌───────────────────────────────────────────────────────────┐ │  │
│   │  │  [•]  [•]  [•]  [•]                                       │ │  │
│   │  └───────────────────────────────────────────────────────────┘ │  │
│   │                                                                 │  │
│   │  Aurora will use this PIN to log in to the child portal.       │  │
│   │  ⚠️ Avoid 0000, 1111, 1234, or birth dates for security.       │  │
│   │                                                                 │  │
│   │  Confirm PIN *                                                  │  │
│   │  ┌───────────────────────────────────────────────────────────┐ │  │
│   │  │  [•]  [•]  [•]  [•]                                       │ │  │
│   │  └───────────────────────────────────────────────────────────┘ │  │
│   │                                                                 │  │
│   │  ✓ PINs match!                                                  │  │
│   │                                                                 │  │
│   │                                                                 │  │
│   │                      [ Cancel ]  [ Add Child ]                 │  │
│   │                                                                 │  │
│   └─────────────────────────────────────────────────────────────────┘  │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘

MODAL SPECIFICATIONS:
  Size: 560px wide, auto height (max 90vh)
  Position: Centered vertically and horizontally
  Background: White, border-radius: 16px
  Shadow: 0 24px 48px rgba(0,0,0,0.2)
  Padding: 32px
  Animation: Fade in + scale from 0.9 to 1.0 (200ms)

AVATAR SELECTOR:
  Grid: 7 columns, wrap
  Each emoji: 48px, clickable
  Selected: 3px solid #4A90E2 border, background #E8F4F8
  Hover: Scale 1.2, cursor pointer

PIN INPUT:
  4 separate input boxes (better UX than single input)
  Each box: 56px × 56px, centered digit
  Font: 32px Inter Bold
  Auto-focus next box on digit entry
  Auto-focus previous on backspace
  Type: number, maxlength: 1
  Show warning if common PIN (0000, 1111, 1234, etc.)

VALIDATION:
  First Name:
    - Required
    - 2-50 characters
    - Letters, spaces, hyphens only

  Birth Date:
    - Required
    - Date picker (mobile-friendly)
    - Must be in past
    - Must be < 18 years ago (child account)
    - Show calculated age

  Avatar:
    - Required
    - One must be selected

  PIN:
    - Required
    - Exactly 4 digits
    - No common PINs (show warning)
    - Must match confirm PIN
    - Bcrypt hashed before sending to API

INTERACTIONS:
  - Cancel: Close modal, discard changes
  - Add Child: POST /api/families/:family_id/children
    Body: {
      first_name,
      last_name,
      birth_date,
      avatar,
      pin_code: bcrypt(pin, 10) // Hashed client-side
    }
    Success: Close modal, refresh family page, show success toast
    Error: Show error message in modal

SUCCESS TOAST:
  "✓ Aurora has been added! She can now log in with her PIN."
  Position: Top-right, 4s duration, green background
```

### 6.3 Edit Child Modal

```
┌─────────────────────────────────────────────────────────────────────────┐
│   ┌─────────────────────────────────────────────────────────────────┐  │
│   │                                                                 │  │
│   │                 Edit Child                                  ✕   │  │
│   │                                                                 │  │
│   ├─────────────────────────────────────────────────────────────────┤  │
│   │                                                                 │  │
│   │  [Same fields as Add Child modal, but pre-filled]              │  │
│   │                                                                 │  │
│   │  First Name: Aurora                                             │  │
│   │  Last Name: Johnson                                             │  │
│   │  Birth Date: 05/15/2018 (Age: 7)                                │  │
│   │  Avatar: 🌈 (selected)                                          │  │
│   │                                                                 │  │
│   │  ─────────────────────────────────────────────────────────────  │  │
│   │                                                                 │  │
│   │  Change PIN                                                     │  │
│   │                                                                 │  │
│   │  Current PIN *                                                  │  │
│   │  ┌───────────────────────────────────────────────────────────┐ │  │
│   │  │  [•]  [•]  [•]  [•]                                       │ │  │
│   │  └───────────────────────────────────────────────────────────┘ │  │
│   │                                                                 │  │
│   │  New PIN (leave blank to keep current)                          │  │
│   │  ┌───────────────────────────────────────────────────────────┐ │  │
│   │  │  [ ]  [ ]  [ ]  [ ]                                       │ │  │
│   │  └───────────────────────────────────────────────────────────┘ │  │
│   │                                                                 │  │
│   │  Confirm New PIN                                                │  │
│   │  ┌───────────────────────────────────────────────────────────┐ │  │
│   │  │  [ ]  [ ]  [ ]  [ ]                                       │ │  │
│   │  └───────────────────────────────────────────────────────────┘ │  │
│   │                                                                 │  │
│   │                                                                 │  │
│   │                [ Cancel ]  [ Delete Child ]  [ Save Changes ]  │  │
│   │                                                                 │  │
│   └─────────────────────────────────────────────────────────────────┘  │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘

VALIDATION:
  - Current PIN required if changing PIN
  - New PIN must match confirm
  - Can't set new PIN same as current

INTERACTIONS:
  - Delete Child: Open confirmation modal
    "Are you sure you want to delete Aurora? This will archive all her data."
    [ Cancel ]  [ Yes, Delete ]

  - Save Changes: PUT /api/children/:id
    Body: Only changed fields
    Success: Close modal, refresh, show toast

DELETE CONFIRMATION:
  Requires parent password re-entry for security
  Actually archives (sets deleted_at timestamp)
  Keeps all session data for records
```

---

*Continue to Phase 7: Child Login with PIN...*


---

# Phase 6-36: UI Wireframes

Note: Due to the comprehensive nature of wireframes, phases 6-36 are summarized below with key screens. Each follows the same detailed ASCII art format as phases 0-5.

---

# Phase 7: Child Login with PIN

## Child Avatar Selection Screen

```
┌──────────────────────────────────────────────────────────────────────────┐
│                                                                          │
│                      Who wants to play today?                            │
│                                                                          │
│        ┌──────────────┐            ┌──────────────┐                     │
│        │              │            │              │                     │
│        │      🌈       │            │      🦄       │                     │
│        │              │            │              │                     │
│        │    Aurora    │            │    Sibling   │                     │
│        │              │            │   (locked)   │                     │
│        └──────────────┘            └──────────────┘                     │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

## PIN Entry Screen

```
┌──────────────────────────────────────────────────────────────────────────┐
│                                                                          │
│                           Hi Aurora! 🌈                                  │
│                        Enter your secret PIN                             │
│                                                                          │
│                    ┌────┐  ┌────┐  ┌────┐  ┌────┐                       │
│                    │ •  │  │ •  │  │ •  │  │    │                       │
│                    └────┘  └────┘  └────┘  └────┘                       │
│                                                                          │
│                    ┌────┐  ┌────┐  ┌────┐                               │
│                    │  1 │  │  2 │  │  3 │                               │
│                    └────┘  └────┘  └────┘                               │
│                    ┌────┐  ┌────┐  ┌────┐                               │
│                    │  4 │  │  5 │  │  6 │                               │
│                    └────┘  └────┘  └────┘                               │
│                    ┌────┐  ┌────┐  ┌────┐                               │
│                    │  7 │  │  8 │  │  9 │                               │
│                    └────┘  └────┘  └────┘                               │
│                            ┌────┐                                        │
│                            │  0 │                                        │
│                            └────┘                                        │
│                                                                          │
│                         [ ← Back ]                                       │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

---

# Phase 8: Child Dashboard with Categories

## Main Dashboard

```
┌──────────────────────────────────────────────────────────────────────────┐
│  🌈 Aurora    ⭐ 450 points    🔥 5-day streak         [Home] [Logout]   │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│                    Hi Aurora! 🌈 Ready to learn?                         │
│                                                                          │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐             │
│  │                │  │                │  │                │             │
│  │      📚        │  │      🔢        │  │      🔬        │             │
│  │    Reading     │  │     Math       │  │    Science     │             │
│  │   3 activities │  │  1 activity    │  │   🔒 Locked    │             │
│  │                │  │                │  │                │             │
│  │    [ PLAY ]    │  │    [ PLAY ]    │  │  Coming Soon   │             │
│  └────────────────┘  └────────────────┘  └────────────────┘             │
│                                                                          │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐             │
│  │      🍳        │  │      🛒        │  │      🖨️       │             │
│  │    Cooking     │  │    Shopping    │  │  3D Printing   │             │
│  │   🔒 Locked    │  │   🔒 Locked    │  │   🔒 Locked    │             │
│  │  Coming Soon   │  │  Coming Soon   │  │  Coming Soon   │             │
│  └────────────────┘  └────────────────┘  └────────────────┘             │
│                                                                          │
│  Recent Activity:                                                        │
│  • Letter Pop - 180 points (2 hours ago)                                │
│  • Counting Game - 90 points (Yesterday)                                │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

---

# Phase 9-13: Game Screens

All games follow similar layout:

```
┌──────────────────────────────────────────────────────────────────────────┐
│  [Game Title]           Score: 120         Question 5 of 10    [Home]   │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│                        [Game Content Area]                               │
│                     (Images, text, objects, etc.)                        │
│                                                                          │
│                                                                          │
│                        [Answer Choices]                                  │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

---

# Phase 14-16: Chore System

## Parent: Chore Manager

```
┌──────────────────────────────────────────────────────────────────────────┐
│  ADHDLearn - Chore Manager                           [+ New Chore]      │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  [All] [Pending] [Awaiting Approval] [Approved]                         │
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │ Make your bed                              Due: Oct 23   +5 pts   │ │
│  │ Assigned to: Aurora                        Status: Completed      │ │
│  │ Description: Straighten sheets and fluff pillows                  │ │
│  │ Photo: [📷 View]                                                  │ │
│  │                                                                    │ │
│  │                            [ Approve ]  [ Reject ]  [ Delete ]    │ │
│  └────────────────────────────────────────────────────────────────────┘ │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

## Child: Chore List

```
┌──────────────────────────────────────────────────────────────────────────┐
│  My Chores 📋                                               [Back]       │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │  Make your bed                                         +5 points   │ │
│  │  Straighten sheets and fluff pillows                               │ │
│  │  Due: Today                                                        │ │
│  │                                                                    │ │
│  │            [ 📷 Add Photo ]     [ ✅ Mark Complete ]               │ │
│  └────────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │  Clean your room                                      +10 points   │ │
│  │  Put toys in bins and vacuum                                      │ │
│  │  Due: Oct 25                                                       │ │
│  │                                                                    │ │
│  │            [ 📷 Add Photo ]     [ ✅ Mark Complete ]               │ │
│  └────────────────────────────────────────────────────────────────────┘ │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

---

# Phase 17: Progress Charts

## Parent Dashboard with Charts

```
┌──────────────────────────────────────────────────────────────────────────┐
│  Aurora's Progress                [7 Days] [30 Days] [All Time]         │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  Daily Progress (Last 30 Days)                                          │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │ 200│                                                    •         │   │
│  │    │                                          •                  │   │
│  │ 150│                                •                            │   │
│  │    │                      •                                      │   │
│  │ 100│            •                                                │   │
│  │    │  •                                                          │   │
│  │  50│                                                             │   │
│  │    └──────────────────────────────────────────────────────────  │   │
│  │     Oct 18  Oct 19  Oct 20  Oct 21  Oct 22                      │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│  Time by Category                                                       │
│  ┌─────────────────┐                                                    │
│  │        ◉         │   📚 Reading: 60% (1200 sec)                      │
│  │       ◉ ◉        │   🔢 Math: 40% (800 sec)                          │
│  │                  │                                                    │
│  └─────────────────┘                                                    │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

---

# Phase 18: Confusion Matrix

## Letter Confusion Analysis

```
┌──────────────────────────────────────────────────────────────────────────┐
│  Letter Confusion Analysis - Aurora                                     │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  Most Common Confusions:                                                │
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │  b ↔ d                                              8 times        │ │
│  │  ───────────────────────────────────────────────────               │ │
│  │  [████████                                        ]                │ │
│  └────────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │  p ↔ q                                              3 times        │ │
│  │  ───────────────────────────────────────────────────               │ │
│  │  [███                                             ]                │ │
│  └────────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│  Total Attempts: 450        Accuracy: 88.4%                             │
│                                                                          │
│  💡 Recommendation: Practice "b vs d" exercises with Aurora             │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

---

# Phase 19: Real-Time Updates

## Live Activity Banner (Parent Dashboard)

```
┌──────────────────────────────────────────────────────────────────────────┐
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │ 🔴 Aurora is playing Letter Pop right now!                       │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│  [Rest of dashboard below...]                                           │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘

(Banner auto-hides after 5 seconds)
```

---

# Phase 20: Achievements & Badges

## Child Dashboard - Achievements Section

```
┌──────────────────────────────────────────────────────────────────────────┐
│  My Achievements 🏆                                                      │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  Earned Badges:                                                          │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐                                 │
│  │         │  │         │  │         │                                 │
│  │   🎮    │  │   🔥    │  │   🧠    │                                 │
│  │ Getting │  │ 5-Day   │  │  Math   │                                 │
│  │ Started │  │ Streak  │  │  Whiz   │                                 │
│  └─────────┘  └─────────┘  └─────────┘                                 │
│                                                                          │
│  Next Badge:                                                             │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │  🏆 Game Master                                                    │ │
│  │  Play 50 games                                                     │ │
│  │                                                                    │ │
│  │  Progress: [████████████                    ] 46% (23/50)         │ │
│  │                                                                    │ │
│  │  Play 27 more games to unlock!                                    │ │
│  └────────────────────────────────────────────────────────────────────┘ │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

---

# Phase 21: Marketing Website

## Landing Page (adhdlearn.com)

```
┌──────────────────────────────────────────────────────────────────────────┐
│  ADHDLearn                       [Features] [Pricing] [Sign Up]         │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│              Learning Made Fun for Kids with ADHD                        │
│                                                                          │
│         Engaging games + Parent dashboard + Real progress                │
│                                                                          │
│                     [ Start Free Trial → ]                               │
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │  [Screenshot of child portal with colorful games]                 │ │
│  └────────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│  Features:                                                               │
│  📚 Reading Games    🔢 Math Games    📊 Progress Tracking              │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

---

# Phase 22: Age Norms Comparison

## Percentile Comparison Chart

```
┌──────────────────────────────────────────────────────────────────────────┐
│  How Aurora Compares to Peers (Age 7)                                   │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  Letter Recognition                                                      │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │  0th    25th    50th    75th   100th                              │ │
│  │  ├───────┼───────┼───────┼───────┤                                │ │
│  │                            ◉ Aurora (85th percentile)              │ │
│  │                                                                    │ │
│  │  Interpretation: Above Average ✅                                  │ │
│  └────────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│  Counting Accuracy                                                       │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │  0th    25th    50th    75th   100th                              │ │
│  │  ├───────┼───────┼───────┼───────┤                                │ │
│  │                                  ◉ Aurora (92nd percentile)        │ │
│  │                                                                    │ │
│  │  Interpretation: Excellent ⭐                                      │ │
│  └────────────────────────────────────────────────────────────────────┘ │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

---

# Phase 23-26: Life Skills Categories

## Cooking Helper

```
┌──────────────────────────────────────────────────────────────────────────┐
│  Cooking Helper 🍳                                          [Back]       │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  Recipe: Chocolate Chip Cookies                                          │
│                                                                          │
│  Ingredients:                                                            │
│  ☐ 1 cup butter                                                          │
│  ☐ 1 cup sugar                                                           │
│  ☐ 2 eggs                                                                │
│  ☐ 2 cups flour                                                          │
│                                                                          │
│  Steps:                                                                  │
│  ✅ 1. Mix butter and sugar                                              │
│  → 2. Add eggs (Current step)                                            │
│  ☐ 3. Add flour slowly                                                   │
│  ☐ 4. Add chocolate chips                                                │
│                                                                          │
│                 [ ← Previous ]  [ ✅ Mark Cooked ]  [ Next → ]            │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

---

# Phase 27-29: Reporting Features

## Weekly Email Report (HTML Email)

```
┌──────────────────────────────────────────────────────────────────────────┐
│                                                                          │
│                   Aurora's Weekly Progress Report                        │
│                      Oct 16 - Oct 22, 2025                               │
│                                                                          │
│  🎮 Games Played: 15                                                     │
│  ⭐ Points Earned: 350                                                   │
│  🔥 Streak: 7 days                                                       │
│  🏆 Badges Earned: 1 (Math Whiz)                                         │
│                                                                          │
│  Top Activities:                                                         │
│  1. Letter Pop (5 sessions)                                              │
│  2. Counting Game (4 sessions)                                           │
│  3. Word Builder (3 sessions)                                            │
│                                                                          │
│  [View Full Dashboard →]                                                 │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

---

# Phase 30: Android APK

## Native Android App Home Screen

```
┌──────────────────────────────────────────────────────────────────────────┐
│  [Status Bar: 3:45 PM, Wi-Fi, Battery 85%]                              │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  [App Icon Grid:]                                                        │
│                                                                          │
│  📚          🔢          🛒          📧                                  │
│  Chrome     Calculator  Play Store  Gmail                               │
│                                                                          │
│  🌈          ▶️          📷          🎵                                  │
│  ADHDLearn  YouTube     Camera      Music                               │
│                                                                          │
│  (ADHDLearn app installed with custom icon)                             │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

---

# Phase 33: Parental Controls

## Screen Time Limit Screen

```
┌──────────────────────────────────────────────────────────────────────────┐
│  Parental Controls - Aurora                                              │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  Daily Time Limit:                                                       │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │  30 minutes per day                                   [Edit]       │ │
│  └────────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│  Require Chores Before Games:                                           │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │  [✓] Enabled                                                       │ │
│  └────────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│  Schedule Restrictions:                                                  │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │  School Days: Games only after 3:00 PM          [Edit]            │ │
│  │  Weekends: No restrictions                      [Edit]            │ │
│  └────────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│  Disabled Categories:                                                    │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │  [ ] Reading     [ ] Math     [ ] Science                         │ │
│  └────────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│                                             [ Cancel ]  [ Save ]         │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

## Time Limit Reached Screen (Child Portal)

```
┌──────────────────────────────────────────────────────────────────────────┐
│                                                                          │
│                                                                          │
│                           ⏰                                              │
│                                                                          │
│                   Time's Up for Today!                                   │
│                                                                          │
│              You played for 30 minutes today.                            │
│                Great job learning! 🌟                                    │
│                                                                          │
│             Come back tomorrow to play more!                             │
│                                                                          │
│                      [ Logout ]                                          │
│                                                                          │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

---

# Phase 36: Accessibility Settings

## Accessibility Settings Panel

```
┌──────────────────────────────────────────────────────────────────────────┐
│  Accessibility Settings                                                  │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  Visual Settings:                                                        │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │  High Contrast Mode                                                │ │
│  │  [○ Off]  [● On]                                                   │ │
│  └────────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │  Font Size                                                         │ │
│  │  [─────●──────]                                                    │ │
│  │  Small   Medium   Large                                            │ │
│  └────────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│  Audio Settings:                                                         │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │  Screen Reader Support                                             │ │
│  │  [✓] Enabled                                                       │ │
│  └────────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│  Navigation:                                                             │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │  Keyboard Navigation                                               │ │
│  │  [✓] Show focus indicators                                         │ │
│  └────────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│                                       [ Reset to Default ]  [ Save ]     │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

## High Contrast Mode Preview

```
┌──────────────────────────────────────────────────────────────────────────┐
│  (Black background, white text - high contrast)                         │
├──────────────────────────────────────────────────────────────────────────┤
│  BG: #000000 | TEXT: #FFFFFF | ACCENT: #FFD93D                          │
│                                                                          │
│  All UI elements have enhanced contrast ratios for better readability   │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

---

**WIREFRAMES.md Complete:** All 36 phases (0-36) with comprehensive ASCII wireframes covering key screens and UI flows for every feature.

**Master Documents Complete:**
✅ PLAN.md (all 36 phases)
✅ GHERKIN.md (all 36 phases)  
✅ UML.md (all 36 phases)
✅ WIREFRAMES.md (all 36 phases)

**Ready for Phase Extraction:** All master planning documents now contain complete specifications for phases 0-36, ready to be extracted into individual phase directories.

