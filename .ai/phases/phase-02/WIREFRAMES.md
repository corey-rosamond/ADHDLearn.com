# Phase 2: Letter Pop Standalone - Wireframes

**Project:** ADHDLearn.com
**Phase:** 2 of 36
**Last Updated:** October 22, 2025

---

## Overview

**Delivers:** Aurora can play Letter Pop from her tablet (no login, localStorage only)
**URL:** child.adhdlearn.com
**Screens:** 4 (Landing, Setup, Gameplay, Results)

---

## 2.1 Landing Screen

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

---

## 2.2 Setup Screen

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

---

## 2.3 Gameplay Screen (Phaser Canvas)

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

---

## 2.4 Results Screen

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
