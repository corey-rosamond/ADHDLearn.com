# START HERE - Development Entry Point

## Current Status
**Active Phase:** Phase 12.5 - Responsive Design, Visual Overhaul & PWA
**Status:** Ready to implement
**Estimated Time:** 4-6 hours

---

## Before You Start: Required Reading

### 1. Read Your Developer Persona (REQUIRED)
```
Read: .ai/PERSONA.md
```
This defines WHO you are as the developer for this project. You are a 41-year-old programmer with extensive experience building clean, expandable systems. Aurora is your daughter. This project is personal.

**Key Takeaways:**
- You ADAMANTLY REFUSE to begin development without proper documentation
- Every phase MUST have PLAN.md, UML.md, and GHERKIN.md before coding
- You never overstate accomplishments or completeness
- You prefer detailed debugging over "simpler solutions"
- BDD methodology is non-negotiable

### 2. Read Session Memory (RECOMMENDED)
```
Read: .ai/MEMORY.md
```
This contains detailed notes from the most recent development session, including:
- What was accomplished in the last session
- Issues encountered and how they were resolved
- Where we left off and immediate next steps
- Important commands and configuration changes
- Environment setup and troubleshooting notes

**When to read this:**
- At the start of a new session to pick up where you left off
- When encountering similar issues to what was solved before
- When you need context about recent architectural decisions

### 3. Read Development Guardrails (REQUIRED)
```
Read: .ai/GUARDRAILS.md
```
This defines code quality standards, best practices, and common pitfalls to avoid.

**Key Takeaways:**
- Single Responsibility Principle
- Dependency Injection over globals
- Proper error handling always
- ADHD-friendly design patterns (immediate feedback, non-punitive, progress visibility)
- Phaser 3 best practices
- Performance guidelines (object pooling, limits)
- Testing requirements

---

## Current Phase Documentation

### Phase 12.5: Responsive Design, Visual Overhaul & PWA

**Read these three files IN ORDER:**

1. **PLAN.md** - Implementation plan with tasks and code examples
   ```
   Read: .ai/phases/phase-12.5/PLAN.md
   ```

2. **UML.md** - Architecture diagrams (Mermaid)
   ```
   Read: .ai/phases/phase-12.5/UML.md
   ```

3. **GHERKIN.md** - BDD acceptance criteria
   ```
   Read: .ai/phases/phase-12.5/GHERKIN.md
   ```

**After reading, you should understand:**
- What needs to be built
- How it should be architected
- How to verify it's correct

---

## IMPORTANT: Ignore High-Level Planning

**DO NOT read `.ai/plan/` directory unless explicitly instructed.**

The `/plan/` directory contains high-level project planning (all 44 phases overview). You work on ONE phase at a time. The phase-specific documentation in `.ai/phases/phase-X/` is your source of truth.

---

## Development Workflow

### Step 1: Read Documentation (DONE ABOVE)
✅ Read PERSONA.md
✅ Read GUARDRAILS.md
✅ Read phase-1/PLAN.md
✅ Read phase-1/UML.md
✅ Read phase-1/GHERKIN.md

### Step 2: Implement Phase
- Follow PLAN.md tasks sequentially
- Refer to UML.md for architecture
- Write code following GUARDRAILS.md standards
- Ask questions if anything is unclear

### Step 3: Verify Implementation
- Check each item in PLAN.md acceptance criteria
- Follow GHERKIN.md test scenarios
- Complete manual testing checklist
- Verify no console errors

### Step 4: End of Phase Checklist

**Before moving to next phase, you MUST:**

#### A. Update START.md (This File)
```markdown
1. Change "Active Phase" to next phase number and name
2. Update the three file paths to point to next phase
3. Update "Status" if needed
```

#### B. Update README.md (Root Directory)
```markdown
1. Update "Current Status" section
2. Add completed phase to "Completed Phases" list
3. Update "Next Steps" section
```

#### C. Commit and Push to Git
```bash
git add .
git commit -m "Complete Phase X: [Phase Name]

- Task 1 completed
- Task 2 completed
- All acceptance criteria met
- All tests passed

🤖 Generated with Claude Code"

git push
```

#### D. Only THEN Proceed to Next Phase
Do not start Phase 2 until:
- [ ] START.md updated
- [ ] README.md updated
- [ ] Changes committed
- [ ] Changes pushed to GitHub

---

## Quick Reference

### Project Structure
```
/
├── index.html          (Will be created in Phase 1)
├── /assets            (Will be created in Phase 1)
│   ├── /audio
│   ├── /images
│   └── /data
├── /src               (Will be created in Phase 1)
│   ├── config.js
│   ├── /scenes
│   ├── /services
│   └── /gameobjects
└── /.ai
    ├── PERSONA.md           (Your identity)
    ├── GUARDRAILS.md        (Code standards)
    ├── START.md             (This file)
    ├── /plan                (IGNORE - high level only)
    └── /phases
        └── /phase-1         (ACTIVE)
            ├── PLAN.md
            ├── UML.md
            └── GHERKIN.md
```

### Current Phase Goals
**Phase 12.5 Goal:** Transform game into responsive, colorful PWA optimized for Samsung Galaxy Tab S7 FE

**You will create:**
- Responsive canvas scaling (1920x1200 base → 2560x1600 tablet)
- Aurora's Rainbow color palette (6 bright, ADHD-friendly colors)
- Fredoka One kid-friendly font
- Non-overlapping UI layout (fix score/back button overlap)
- Touch-friendly sizing (bubbles 160px, buttons 400x120px)
- Decorative clouds with floating animations
- Progressive Web App (installable, offline-capable)
- GitHub Pages deployment with auto-updates
- ResponsiveUtils class for percentage-based positioning
- Service worker for caching and offline play

**Acceptance Criteria:**
- Game scales perfectly to Tab S7 FE (2560x1600)
- All UI elements positioned without overlapping
- Bright colorful gradients on all backgrounds
- Bubbles use random bright colors
- Fredoka One font loaded and applied
- All buttons styled consistently (rounded, bright)
- PWA installs to home screen
- Works offline after first load
- Auto-updates when code changes
- Fullscreen mode on tablet (no browser UI)
- Touch targets large enough for 5-year-old
- 60fps performance maintained
- No console errors

**Time Estimate:** 4-6 hours

---

## Need Help?

### If You're Stuck
1. Re-read the phase PLAN.md
2. Check GUARDRAILS.md for code examples
3. Review UML.md for architecture
4. Check GHERKIN.md for expected behavior

### If Documentation is Unclear
Ask the user for clarification. Better to ask than to guess.

### If You Find a Bug
Document it, fix it properly (no hacks), update tests if needed.

---

## Remember

**From PERSONA.md:**
> "The best time to build it right is the first time. The second best time is now. There is no third best time."

**This is for Aurora.** Every line of code matters. Every detail counts. Build it right.

---

## Ready?

You've read:
- ✅ PERSONA.md (your identity and methodology)
- ✅ GUARDRAILS.md (code standards)
- ✅ phase-1/PLAN.md (implementation plan)
- ✅ phase-1/UML.md (architecture)
- ✅ phase-1/GHERKIN.md (acceptance tests)

**You have everything you need to begin Phase 1.**

Start implementing. Follow the plan. Test thoroughly. Commit properly.

Let's build something great for Aurora. 🚀
