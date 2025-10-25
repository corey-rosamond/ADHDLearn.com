# Phase 3: Database + Simple Backend - Wireframes

**Project:** ADHDLearn.com
**Phase:** 3 of 36
**Last Updated:** October 22, 2025

---

## Overview

Phase 3 adds backend integration but doesn't change the user interface. The wireframes remain the same as Phase 2, with one addition to the Results screen.

---

## Changes to Results Screen

The only visual change is the addition of "NEW HIGH SCORE!" badge when applicable.

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│                           🎉 🎉 🎉                                       │
│                                                                         │
│                  🏆 NEW HIGH SCORE! #2 🏆                               │
│                                                                         │
│                       Great Job Playing!                               │
│                                                                         │
│                ┌──────────────────────────────────┐                    │
│                │        ⭐ ⭐ ⭐ ⭐            │                        │
│                │       Score: 180             │                        │
│                └──────────────────────────────────┘                    │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│                 All-Time High Scores (From Database)                   │
│                                                                         │
│    1. 190 points (88%) - Oct 21                                        │
│    2. 180 points (85%) - Oct 21  ← YOUR SCORE                          │
│    3. 170 points (82%) - Oct 20                                        │
│    4. 165 points (80%) - Oct 20                                        │
│    5. 160 points (78%) - Oct 19                                        │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘

FONTS:
  "NEW HIGH SCORE!": 32px Fredoka One, #FFD93D (gold)
  Trophy emoji: 48px
  Rank number (#2): 32px Fredoka One, #FFD93D

COLORS:
  NEW HIGH SCORE badge:
    - Background: Gradient #FFD93D → #F2C94C
    - Text: #2D3436 (dark gray for contrast)
    - Border: 3px solid #FFD93D
    - Box-shadow: 0 8px 24px rgba(242, 201, 76, 0.5) (glowing effect)

ANIMATIONS:
  - Badge appears: Scale from 0 → 1.2 → 1.0 (bounce effect)
  - Trophy emoji: Rotate slightly -5° → +5° (wobble)
  - Appears 500ms after score display

DATA SOURCE CHANGE:
  - Phase 2: High scores from localStorage
  - Phase 3: High scores from database API
  - Fallback: If API fails, show localStorage scores with note:
    "Scores saved locally (online sync pending)"
```

---

## Technical Notes

**API Integration Points:**
1. When game ends → POST score to API
2. Results screen loads → GET high scores from API
3. Both operations have error handling with localStorage fallback

**No other UI changes** - All Phase 2 screens (Landing, Setup, Gameplay) remain identical.

---

## Backend Changes (Not User-Visible)

- MySQL database stores sessions
- Express API handles requests
- PM2 manages Node.js process
- CORS configured for child portal

These changes are infrastructure-only and don't affect Aurora's experience, except that her scores now persist forever and work across devices.
