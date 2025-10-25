# Phase 5: UI Wireframes

**Project:** ADHDLearn.com
**Phase:** 5 of 36
**Last Updated:** October 22, 2025

---


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

