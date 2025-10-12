# Aurora's Letter Adventure - Project Plan

## Executive Summary

A browser-based educational game designed specifically for children with ADHD to learn letters and sight words through engaging, multi-sensory mini-games. Built with clean architecture principles for maintainability and expandability without unnecessary complexity.

**Target User**: Aurora (and similar young learners with ADHD)
**Platform**: Modern web browsers (Chrome, Firefox, Safari, Edge)
**Deployment**: Static files - no server required
**Development Approach**: Behavior-Driven Development with incremental phases

---

## Project Goals

### Primary Objectives
1. **Teach letter recognition** (uppercase and lowercase A-Z)
2. **Teach letter sounds** (phonics)
3. **Teach basic sight words** (Dolch pre-primer and primer lists)
4. **Maintain engagement** through ADHD-friendly design patterns

### Success Criteria
- Aurora can play independently without constant parental guidance
- Sessions last 5-10 minutes without loss of focus
- Clear progress visible to parents
- Positive reinforcement drives continued engagement
- Easy to add new content (letters, words, mini-games)

### Non-Goals (v1.0)
- Multi-player functionality
- Backend server or user accounts
- Writing/typing practice (future phase)
- Curriculum management system
- Advanced analytics dashboard

---

## Core Design Principles

### ADHD-Specific Design Patterns
1. **Instant Feedback** - Every action produces immediate visual/audio response
2. **Short Activity Cycles** - Mini-games last 2-3 minutes max
3. **Variety and Rotation** - Multiple game types prevent monotony
4. **Progressive Difficulty** - Success builds confidence, failure is gentle
5. **Movement Integration** - Physical interaction (drag, tap, swipe)
6. **Sensory Richness** - Colorful visuals, satisfying sounds, celebrations

### Technical Principles
1. **Single Responsibility** - Each module has one clear purpose
2. **Open/Closed** - Easy to add mini-games without modifying core
3. **Composition over Inheritance** - Flexible game component assembly
4. **Dependency Injection** - Testable, loosely coupled modules
5. **Event-Driven Architecture** - Decoupled communication between systems

---

## Technical Architecture

### Technology Stack

**Core**
- **Phaser 3** - Professional game framework with built-in best practices
  - Handles game loop, rendering, input, physics, tweens
  - Scene-based architecture aligns with our state management needs
  - Asset loading and caching built-in
  - Active community and well-documented
  - No build tooling required for development

**Audio**
- **Phaser Audio System** - Cross-browser audio handling
- **Pre-generated ElevenLabs files** - High-quality voice for letters/words/encouragement

**Storage**
- **LocalStorage** - Progress persistence (with JSON serialization)

**Styling**
- **CSS3** - UI chrome and loading screens
- **Canvas rendering** - Game graphics via Phaser

### Why Phaser 3?

After 20+ years of development, I know when a framework adds value vs. complexity. Phaser 3 provides:
- **Scene management** = State pattern implementation out of the box
- **Asset management** = Reliable preloading and caching
- **Input abstraction** = Mouse, touch, keyboard unified
- **Animation system** = Tweens and timelines for smooth motion
- **Sound management** = Web Audio complexity hidden

We get professional game architecture without reinventing wheels. The framework is stable, maintained, and well-tested by thousands of developers.

### System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     Game Container                       │
│                    (Phaser.Game)                         │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐        │
│  │  Boot      │→ │  Preload   │→ │  MainMenu  │        │
│  │  Scene     │  │  Scene     │  │  Scene     │        │
│  └────────────┘  └────────────┘  └────────────┘        │
│                                          │               │
│                                          ↓               │
│                      ┌────────────────────────────┐     │
│                      │   GameSession Scene        │     │
│                      │  (orchestrates mini-games) │     │
│                      └────────────────────────────┘     │
│                                   │                      │
│         ┌─────────────────────────┼──────────────┐     │
│         ↓                         ↓              ↓     │
│  ┌────────────┐          ┌────────────┐  ┌────────────┐│
│  │ Letter Pop │          │ Word Catch │  │Letter Build││
│  │   Scene    │   ...    │   Scene    │  │   Scene    ││
│  └────────────┘          └────────────┘  └────────────┘│
│                                                          │
└──────────────────────────────────────────────────────────┘

         Supporting Systems (Global Services)
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ProgressMgr  │ │  AudioMgr    │ │  ConfigMgr   │
│ (singleton)  │ │ (singleton)  │ │ (singleton)  │
└──────────────┘ └──────────────┘ └──────────────┘
```

### Core Components

#### 1. Scene Hierarchy (State Pattern)
Each scene represents a distinct game state:
- **BootScene** - Initialize global services
- **PreloadScene** - Load all assets with progress bar
- **MainMenuScene** - Welcome screen, start game, settings
- **GameSessionScene** - Orchestrates mini-game rotation, tracks session progress
- **MiniGameScene (Abstract)** - Base class for all mini-games
  - LetterPopScene
  - WordCatchScene
  - LetterBuilderScene
  - MemoryMatchScene
  - DanceTraceScene
- **ResultsScene** - End-of-session celebration and stats
- **SettingsScene** - Volume, difficulty, content selection

#### 2. Global Services (Singleton Pattern)

**ProgressManager**
- Tracks which letters/words mastered
- Saves/loads from LocalStorage
- Calculates appropriate difficulty
- Records session history

**AudioManager**
- Plays sound effects
- Plays background music (looping, fade in/out)
- Plays voice clips (letters, words, encouragement)
- Volume control
- Prevents audio overlap issues

**ConfigManager**
- Loads game configuration (which letters enabled, difficulty settings)
- Manages content packs (letter sets, sight word lists)
- Parent-configurable options

#### 3. Mini-Game Framework

**IMiniGame Interface** (implemented by each mini-game)
```javascript
interface IMiniGame {
  init(config)       // Setup with current letter/word set
  start()            // Begin gameplay
  update(delta)      // Game loop tick
  handleInput(input) // Process player interaction
  end()              // Cleanup and return results
  getResults()       // Score, correct answers, time played
}
```

**MiniGameScene (Abstract Base Class)**
- Implements common mini-game patterns
- Timer display
- Score/star display
- Encouragement audio triggers
- Results calculation
- Pause/resume functionality

Each specific mini-game extends this base and implements game-specific logic.

#### 4. Content System

**ContentProvider**
- Loads letter/word lists from JSON
- Filters based on progress (adaptive difficulty)
- Randomizes selection
- Ensures variety (no same letter twice in a row)

**Letter Content Structure**
```json
{
  "letter": "A",
  "uppercase": "A",
  "lowercase": "a",
  "sound": "ah",
  "audioFiles": {
    "name": "audio/letters/letter_a.mp3",
    "sound": "audio/sounds/sound_a.mp3"
  },
  "difficulty": 1
}
```

**Sight Word Content Structure**
```json
{
  "word": "the",
  "difficulty": 1,
  "category": "dolch-preprimer",
  "audioFile": "audio/words/the.mp3"
}
```

#### 5. Feedback System (Observer Pattern)

**FeedbackManager**
- Observes game events
- Triggers appropriate responses:
  - Correct answer → particle effects, chime, encouragement
  - Wrong answer → gentle animation, try again sound
  - Combo streak → escalating celebration
  - Milestone → special animation, star earned

**Event Types**
- `CORRECT_ANSWER`
- `INCORRECT_ANSWER`
- `COMBO_STREAK`
- `MINI_GAME_COMPLETE`
- `SESSION_COMPLETE`
- `MILESTONE_REACHED`

---

## Mini-Game Specifications

### 1. Letter Pop (Bubble Tap)

**Learning Objective**: Letter recognition and name recall

**Gameplay**:
1. Colorful bubbles float upward from bottom of screen
2. Each bubble contains a letter (uppercase or lowercase)
3. Audio plays: "Find the letter B!"
4. Child taps correct bubble
5. Bubble bursts with particle explosion and celebration
6. Next letter is called

**Mechanics**:
- 3-5 bubbles on screen at once
- Floating speed increases slightly with progress
- Wrong bubble tap causes gentle wobble (not pop)
- 10 letters per round (2-3 minutes)

**Variations by Difficulty**:
- Easy: Only uppercase, 3 bubbles max
- Medium: Mixed case, 5 bubbles max
- Hard: Similar letters (b/d, p/q), faster speed

### 2. Word Catch (Falling Words)

**Learning Objective**: Sight word recognition

**Gameplay**:
1. Words gently fall from top like leaves
2. Aurora moves a character (basket/net) left/right
3. Audio plays: "Catch the word 'see'!"
4. Character catches correct word
5. Confetti explosion, encouraging audio
6. Next word is called

**Mechanics**:
- Character moves via arrow keys, touch drag, or mouse
- 2-4 words falling at once
- Wrong word caught → gentle "oops" and word disappears
- Missed words float away (no penalty, just don't score)
- 10 words per round

### 3. Letter Builder (Drag and Assemble)

**Learning Objective**: Letter shape recognition and motor practice

**Gameplay**:
1. Large outline of a letter shown
2. Letter pieces (strokes) scattered around screen
3. Child drags pieces to build the letter
4. Pieces snap into place when close
5. Completed letter animates and plays sound
6. "You built the letter A!"

**Mechanics**:
- 2-4 pieces per letter depending on complexity
- Magnetic snap zones (forgiving hitboxes)
- Pieces glow when dragged
- Trail effect follows drag
- 5 letters per round (more complex, takes longer)

### 4. Memory Match (Letter Pairs)

**Learning Objective**: Letter/object association and memory

**Gameplay**:
1. Grid of face-down cards (4x3 or 3x3)
2. Cards have letters and matching images
3. Flip two cards at a time
4. Match letter to object that starts with it
5. Matched pairs stay revealed with celebration
6. Continue until all matched

**Mechanics**:
- Click/tap to flip
- Smooth flip animation
- Mismatched cards flip back after 1 second
- Audio plays both letter name and object name
- 6-8 pairs depending on difficulty

### 5. Dance & Trace (Letter Tracing)

**Learning Objective**: Letter formation and motor control

**Gameplay**:
1. Large letter appears with dotted path
2. Starting point indicated with pulsing circle
3. Child traces with finger/mouse
4. Path lights up with rainbow trail as traced
5. Successful trace triggers celebration
6. Audio: letter name and sound

**Mechanics**:
- Forgiving path detection (ADHD-friendly)
- Can retry immediately if off path
- Path must be followed directionally
- Speed doesn't matter, only path completion
- Firework effect on completion
- 5 letters per round

---

## Development Phases

**Note**: Each phase is small, independently verifiable, and builds incrementally. No phase should take more than a few hours to complete.

---

### Phase 1: Project Bootstrap
**Goal**: Get Phaser 3 running in browser

**Tasks**:
- Create folder structure (`/assets`, `/src`, `/src/scenes`)
- Create `index.html` with Phaser 3 CDN link
- Create `src/config.js` with basic Phaser config
- Display "Aurora's Letter Adventure" text on screen

**Acceptance Criteria**:
- Open index.html in browser
- See Phaser canvas with welcome text
- No console errors

**Estimated Time**: 30 minutes

---

### Phase 2: Basic Scene System
**Goal**: Implement scene transitions

**Tasks**:
- Create `src/scenes/BootScene.js` - initializes game
- Create `src/scenes/PreloadScene.js` - empty for now
- Create `src/scenes/MainMenuScene.js` - shows title
- Wire up scene transitions: Boot → Preload → MainMenu

**Acceptance Criteria**:
- Scenes transition automatically
- Each scene logs to console when entered
- MainMenu displays "Press to Start" text

**Estimated Time**: 1 hour

---

### Phase 3: Asset Loading Infrastructure
**Goal**: Load assets with progress feedback

**Tasks**:
- Add one test image to `/assets/images/test.png`
- Add one test audio file to `/assets/audio/test.mp3`
- Implement PreloadScene progress bar
- Display loaded test image in MainMenu

**Acceptance Criteria**:
- Progress bar animates from 0-100%
- Test image displays correctly
- No loading errors in console

**Estimated Time**: 1 hour

---

### Phase 4: AudioManager Service
**Goal**: Centralized audio management

**Tasks**:
- Create `src/services/AudioManager.js` singleton
- Implement `playSound(key)` method
- Implement `playVoice(key)` method
- Load and play test sound in MainMenu

**Acceptance Criteria**:
- Click anywhere triggers test sound
- Volume is consistent
- No audio overlap issues
- Console logs audio playback

**Estimated Time**: 1.5 hours

---

### Phase 5: Main Menu UI
**Goal**: Interactive start screen

**Tasks**:
- Add colorful gradient background
- Create "START" button sprite/shape
- Button responds to hover (scale up)
- Button click plays sound and transitions to game

**Acceptance Criteria**:
- Button visually indicates interactivity
- Click sound plays
- Transitions to LetterPopScene (placeholder)

**Estimated Time**: 1 hour

---

### Phase 6: Letter Pop - Scene Setup
**Goal**: Basic Letter Pop visual structure

**Tasks**:
- Create `src/scenes/LetterPopScene.js`
- Add colorful background
- Display scene title "Letter Pop!"
- Add "Back to Menu" button

**Acceptance Criteria**:
- Scene displays after clicking START
- Back button returns to MainMenu
- Background is colorful and appealing

**Estimated Time**: 45 minutes

---

### Phase 7: Letter Pop - Single Static Bubble
**Goal**: Display one bubble with letter

**Tasks**:
- Create `src/gameobjects/Bubble.js` class
- Bubble is circular with gradient fill
- Display letter "A" in center of bubble
- Position bubble in center of screen

**Acceptance Criteria**:
- Bubble displays correctly
- Letter is readable and centered
- Visual quality meets standards

**Estimated Time**: 1 hour

---

### Phase 8: Letter Pop - Bubble Interaction
**Goal**: Make bubble clickable

**Tasks**:
- Add click/tap event to bubble
- Play "pop" sound on click
- Play "letter A" audio on click
- Bubble animates (scale up, fade out) and destroys

**Acceptance Criteria**:
- Click triggers all effects
- Audio plays correctly
- Animation is smooth
- Bubble removes from scene

**Estimated Time**: 1 hour

---

### Phase 9: Letter Pop - Multiple Bubbles
**Goal**: Spawn several bubbles

**Tasks**:
- Create 3 bubbles with letters A, B, C
- Randomize bubble positions
- Bubbles float upward slowly
- Each bubble independently clickable

**Acceptance Criteria**:
- All 3 bubbles visible and moving
- Each plays its own letter audio
- No overlap or collision issues

**Estimated Time**: 1 hour

---

### Phase 10: Letter Pop - Target Letter Game Logic
**Goal**: Implement correct/incorrect logic

**Tasks**:
- Choose one letter as target (e.g., "B")
- Audio plays: "Find the letter B!"
- Correct bubble click: celebration effect
- Wrong bubble click: gentle wobble, stays on screen

**Acceptance Criteria**:
- Target letter audio plays at start
- Only correct bubble triggers success
- Wrong clicks are non-punitive
- Visual/audio feedback is clear

**Estimated Time**: 1.5 hours

---

### Phase 11: Letter Pop - Score System
**Goal**: Track correct answers

**Tasks**:
- Create UI text displaying score
- Increment score on correct click
- Display "Correct: X / Y" counter
- Track time spent in round

**Acceptance Criteria**:
- Score updates immediately
- Counter displays correctly
- UI doesn't overlap game area

**Estimated Time**: 45 minutes

---

### Phase 12: Letter Pop - Complete Round Flow
**Goal**: Start to finish gameplay loop

**Tasks**:
- Show 10 letters in sequence
- After 10 correct answers, end round
- Display simple results screen
- "Play Again" button returns to Letter Pop

**Acceptance Criteria**:
- Full round playable start to finish
- Results show score and time
- Can replay immediately

**Estimated Time**: 1.5 hours

---

### Phase 13: Content System - Letter Data
**Goal**: Load letters from JSON

**Tasks**:
- Create `/assets/data/letters.json` with A-Z data
- Create `src/services/ContentProvider.js`
- Load letter data including audio file paths
- Use real letter data in Letter Pop

**Acceptance Criteria**:
- JSON loads successfully
- ContentProvider returns random letters
- Letter Pop uses dynamic content
- All 26 letters accessible

**Estimated Time**: 1 hour

---

### Phase 14: Audio Content - Letter Recordings
**Goal**: Integrate ElevenLabs audio files

**Tasks**:
- User generates 26 letter audio files (A-Z)
- Place files in `/assets/audio/letters/`
- Update letters.json with file paths
- Letter Pop plays real letter audio

**Acceptance Criteria**:
- All 26 letter audios play correctly
- Audio quality is high and clear
- No missing file errors

**Estimated Time**: 30 minutes (integration only)

---

### Phase 15: Particle Effects - Celebration
**Goal**: Visual feedback for correct answers

**Tasks**:
- Implement particle emitter for confetti
- Trigger on correct bubble click
- Colorful particles burst outward
- Particles fade and destroy

**Acceptance Criteria**:
- Particle effect is satisfying
- Performance remains smooth
- Effect doesn't obstruct gameplay

**Estimated Time**: 1.5 hours

---

### Phase 16: Encouragement Audio System
**Goal**: Positive verbal reinforcement

**Tasks**:
- User generates 10 encouragement audio files
- Create encouragement audio queue system
- Play random encouragement on correct answers
- Vary audio to prevent repetition

**Acceptance Criteria**:
- Different encouragement each time
- Audio doesn't overlap with letter audio
- Timing feels natural

**Estimated Time**: 1 hour

---

### Phase 17: ProgressManager Service
**Goal**: Track learning progress

**Tasks**:
- Create `src/services/ProgressManager.js`
- Track which letters seen and success rate
- Save to LocalStorage after each round
- Load progress on game start

**Acceptance Criteria**:
- Progress persists across sessions
- Data structure is logical
- Can view progress in console

**Estimated Time**: 2 hours

---

### Phase 18: Results Screen Enhancement
**Goal**: Comprehensive end-of-round feedback

**Tasks**:
- Create `src/scenes/ResultsScene.js`
- Display stars earned (1-3 based on score)
- Show which letters were mastered
- Animated celebration
- "Main Menu" and "Play Again" buttons

**Acceptance Criteria**:
- Results are clear and encouraging
- Stars animate in
- Buttons work correctly

**Estimated Time**: 2 hours

---

### Phase 19: Difficulty Levels
**Goal**: Adaptive challenge

**Tasks**:
- Easy: 3 bubbles, only uppercase
- Medium: 4 bubbles, mixed case
- Hard: 5 bubbles, similar letters (b/d)
- ProgressManager suggests difficulty

**Acceptance Criteria**:
- Can select difficulty in menu
- Difficulty affects gameplay correctly
- Progression feels natural

**Estimated Time**: 1.5 hours

---

### Phase 20: Settings Scene
**Goal**: Configurable options

**Tasks**:
- Create `src/scenes/SettingsScene.js`
- Volume sliders (music, sound effects, voice)
- Difficulty selection
- "Reset Progress" button
- Settings persist to LocalStorage

**Acceptance Criteria**:
- All settings function correctly
- Changes take effect immediately
- Settings survive page reload

**Estimated Time**: 2 hours

---

### Phase 21: Responsive Design
**Goal**: Works on tablets and phones

**Tasks**:
- Test on iPad/tablet browsers
- Adjust touch targets (larger buttons)
- Scale game canvas appropriately
- Portrait and landscape support

**Acceptance Criteria**:
- Game playable on 7" and 10" tablets
- Touch input is reliable
- UI is readable at all sizes

**Estimated Time**: 2 hours

---

### Phase 22: Letter Pop Polish
**Goal**: Production quality

**Tasks**:
- Smooth bubble spawn animations
- Better particle effects
- Background music (looping, subtle)
- Refined timing and pacing
- Edge case testing

**Acceptance Criteria**:
- Game feels professional
- No bugs or rough edges
- Aurora enjoys playing it

**Estimated Time**: 2-3 hours

---

### **MILESTONE 1: Letter Pop MVP Complete**
At this point, we have one fully functional, polished mini-game that teaches letter recognition with progress tracking, audio feedback, and responsive design.

**Decision Point**: Test extensively with Aurora before proceeding to additional mini-games.

---

### Phase 23: Word Catch - Scene Setup
**Goal**: Second mini-game foundation

**Tasks**:
- Create `src/scenes/WordCatchScene.js`
- Design background (different from Letter Pop)
- Create player character sprite/shape
- Character moves left/right via input

**Acceptance Criteria**:
- Scene accessible from menu
- Character moves smoothly
- Controls work on touch and keyboard

**Estimated Time**: 1.5 hours

---

### Phase 24: Word Catch - Falling Words
**Goal**: Words drop from top

**Tasks**:
- Create `src/gameobjects/FallingWord.js`
- Words spawn at top, fall slowly
- 2-3 words on screen at once
- Words despawn at bottom

**Acceptance Criteria**:
- Words are readable while falling
- Fall speed is appropriate
- No performance issues

**Estimated Time**: 1 hour

---

### Phase 25: Word Catch - Collision Detection
**Goal**: Catch words with character

**Tasks**:
- Implement collision between character and words
- Caught word disappears with effect
- Play word audio when caught
- Track caught words

**Acceptance Criteria**:
- Collision is reliable
- Visual feedback is clear
- Audio timing is correct

**Estimated Time**: 1.5 hours

---

### Phase 26: Word Catch - Target Word Logic
**Goal**: Catch specific word

**Tasks**:
- Audio calls out target word
- Correct word catch: celebration
- Wrong word catch: gentle "oops"
- 10 words per round

**Acceptance Criteria**:
- Game logic is correct
- Feedback is ADHD-friendly
- Round completes properly

**Estimated Time**: 1.5 hours

---

### Phase 27: Sight Word Content
**Goal**: Load sight word data

**Tasks**:
- Create `/assets/data/sight-words.json`
- User generates Dolch pre-primer audio files
- Update ContentProvider for words
- Word Catch uses real sight words

**Acceptance Criteria**:
- All sight words available
- Audio files play correctly
- Words are age-appropriate

**Estimated Time**: 1 hour

---

### Phase 28: Word Catch Polish
**Goal**: Production quality

**Tasks**:
- Particle effects for catches
- Background music
- Character animations
- Refined gameplay pacing

**Acceptance Criteria**:
- Game is fun and engaging
- Quality matches Letter Pop
- No bugs

**Estimated Time**: 2 hours

---

### **MILESTONE 2: Two Complete Mini-Games**
Letter Pop (letters) and Word Catch (sight words) both playable and polished.

**Decision Point**: Test both games with Aurora. Assess engagement and retention.

---

### Phase 29-40: Additional Mini-Games
Following the same incremental pattern:
- Letter Builder (drag and assemble)
- Memory Match (flip cards)
- Dance & Trace (letter tracing)

Each mini-game broken into 6-8 phases:
1. Scene setup
2. Core mechanic
3. Interaction
4. Game logic
5. Content integration
6. Polish

**Estimated Time**: 3-4 hours per mini-game

---

### Phase 41: Game Session Orchestrator
**Goal**: Rotate between mini-games

**Tasks**:
- Create `src/scenes/GameSessionScene.js`
- Manages sequence of 3 mini-games
- Transitions between games
- Tracks overall session progress

**Acceptance Criteria**:
- Session flows smoothly
- Variety maintains engagement
- Session results aggregate correctly

**Estimated Time**: 2 hours

---

### Phase 42: Session Timer & Breaks
**Goal**: Healthy play sessions

**Tasks**:
- 10-minute session timer
- "Take a break!" reminder
- Gentle end-of-session transition
- Option to continue or stop

**Acceptance Criteria**:
- Timer is unobtrusive
- Break reminder is gentle
- Aurora isn't frustrated by interruption

**Estimated Time**: 1 hour

---

### Phase 43: Parent Dashboard
**Goal**: Progress visibility

**Tasks**:
- Create `src/scenes/DashboardScene.js`
- Display letters mastered
- Display sight words learned
- Session history (dates, duration, scores)
- Charts/visualizations

**Acceptance Criteria**:
- Parents can review progress
- Data is accurate
- UI is clear and informative

**Estimated Time**: 3 hours

---

### Phase 44: Deployment Preparation
**Goal**: Ready for production

**Tasks**:
- Optimize asset loading
- Minify code (optional)
- Create deployment instructions
- Test on all target devices
- Create backup/restore feature

**Acceptance Criteria**:
- Game loads in < 3 seconds
- Works on all target browsers/devices
- Instructions are clear

**Estimated Time**: 2 hours

---

### **MILESTONE 3: MVP Complete**
Full game with 5 mini-games, progress tracking, parent dashboard, and production quality.

---

## Phase Execution Rules

1. **No skipping phases** - Each builds on the previous
2. **Complete acceptance criteria** - Don't move forward until verified
3. **Document as you go** - Update GHERKIN.md with actual results
4. **Test with Aurora early** - Get feedback at milestones
5. **Refactor when needed** - Don't accumulate technical debt

---

## Asset Requirements

### Audio Files (ElevenLabs Generation)

**Letters** (52 files)
- `audio/letters/uppercase_a.mp3` through `uppercase_z.mp3`
- `audio/letters/lowercase_a.mp3` through `lowercase_z.mp3`

**Letter Sounds** (26 files)
- `audio/sounds/sound_a.mp3` through `sound_z.mp3`

**Sight Words** (40+ files)
- `audio/words/[word].mp3` for each word

**Encouragement** (20 files)
- `audio/encouragement/great_job.mp3`
- `audio/encouragement/amazing.mp3`
- `audio/encouragement/you_did_it.mp3`
- `audio/encouragement/fantastic.mp3`
- `audio/encouragement/keep_going.mp3`
- `audio/encouragement/youre_awesome.mp3`
- `audio/encouragement/wonderful.mp3`
- `audio/encouragement/excellent.mp3`
- `audio/encouragement/superstar.mp3`
- `audio/encouragement/brilliant.mp3`
- etc.

**Instructions** (per mini-game, ~10 files)
- `audio/instructions/find_the_letter.mp3`
- `audio/instructions/catch_the_word.mp3`
- `audio/instructions/build_the_letter.mp3`
- `audio/instructions/match_the_pairs.mp3`
- `audio/instructions/trace_the_letter.mp3`

**Sound Effects**
- Can be royalty-free from Freesound.org or generated:
  - Bubble pop
  - Correct chime
  - Gentle wrong sound
  - Star collect
  - Celebration
  - Card flip
  - UI button click

### Visual Assets (Free Game Art)

**Backgrounds**
- Colorful, non-distracting gradient or simple patterns
- Different themes per mini-game

**UI Elements**
- Buttons (play, pause, settings, back)
- Stars (empty, filled, animated)
- Progress bars
- Score displays

**Game Objects**
- Bubbles (round, colorful, semi-transparent)
- Character sprite for Word Catch (simple, friendly)
- Letter pieces for Letter Builder
- Cards for Memory Match (back design, border)
- Trace path effects

**Particle Effects**
- Confetti
- Stars
- Sparkles
- Bursts

**Recommended Sources**:
- Kenney.nl (huge free asset packs)
- OpenGameArt.org
- itch.io free assets
- Can also use Phaser's built-in shape drawing for simple objects

---

## Technical Decisions & Rationale

### Why No Complex State Management (Redux/MobX)?
Phaser scenes ARE our state management. Each scene is a state. Scene data objects pass information between scenes. Adding Redux would be architecture astronautics for a game of this scope.

### Why Singletons for Managers?
In a game engine context, we need exactly one audio manager, one progress tracker, one config loader. Singletons are appropriate here. We'll implement them as ES6 modules, not classical singleton patterns.

### Why Not TypeScript?
Consideration: TypeScript adds safety and tooling.
Decision: Start with JavaScript ES6+. Add TypeScript in Phase 6 if needed.
Rationale: Faster iteration, no build tooling required, easier for potential collaborators. The BDD tests and clear interfaces provide safety nets.

### Why LocalStorage vs. Backend?
Aurora's data stays on her device. No accounts, no servers, no privacy concerns. Parents can export/backup if desired (future feature).

### Why Phaser 3 vs. Custom Engine?
I've built game engines from scratch. It's educational but not pragmatic. Phaser 3 gives us:
- 10+ years of production testing
- Cross-browser quirks handled
- Performance optimizations built-in
- Active community for support
- Well-documented APIs

Building custom would take 2-3 weeks just for infrastructure. That's 2-3 weeks Aurora isn't learning.

---

## Testing Strategy

### Behavior-Driven Development
Each feature defined in GHERKIN.md before implementation.

### Testing Layers

**Unit Tests** (Jest)
- Service logic (ProgressManager, AudioManager, ConfigManager)
- Content providers
- Utility functions
- Score calculations

**Integration Tests**
- Scene transitions
- Service interactions
- Asset loading
- Progress persistence

**Manual Testing** (Most Critical)
- Play each mini-game completely
- Verify audio plays correctly
- Check visual feedback quality
- Ensure ADHD-friendly design principles met
- Test on target devices (iPad, Android tablet)

**User Testing**
- Aurora plays supervised sessions
- Observe engagement and confusion points
- Iterate quickly based on feedback

---

## Risks & Mitigations

### Risk: Asset Loading Fails
**Impact**: Game unplayable
**Mitigation**: Comprehensive error handling in PreloadScene, fallback assets, clear error messages

### Risk: Audio Doesn't Play (Browser Restrictions)
**Impact**: Major engagement loss
**Mitigation**: User interaction required before audio (click to start), visual-only fallback mode

### Risk: Aurora Loses Interest Quickly
**Impact**: Project goal failure
**Mitigation**: Early prototype testing, rapid iteration based on feedback, variety in mini-games

### Risk: Performance Issues on Older Devices
**Impact**: Choppy experience, frustration
**Mitigation**: Performance budget, test on target devices early, optimize assets, frame rate monitoring

### Risk: Scope Creep
**Impact**: Never-ending development
**Mitigation**: Strict phase boundaries, Phase 1-3 are MVP, Phase 4-5 are enhancements, Phase 6+ are future

---

## Success Metrics

### Engagement Metrics
- Session duration: Target 5-10 minutes
- Return rate: Aurora asks to play again
- Completion rate: Finishes mini-games vs. quits early

### Learning Metrics
- Letter mastery: Consistent correct identification
- Sight word mastery: Recognition speed improvement
- Progress over time: Unlocking harder difficulties

### Technical Metrics
- Load time: < 3 seconds
- Frame rate: Stable 60fps
- Crash rate: Zero (comprehensive error handling)
- Browser compatibility: 100% on modern browsers

---

## Future Considerations (Post-MVP)

### Phase 6+
- Multiplayer mode (sibling or parent participation)
- Custom word lists (names, family-specific words)
- Writing practice mini-game (draw letters with feedback)
- Story mode (narrative wrapper around mini-games)
- Parent dashboard with detailed analytics
- Rewards/achievement system (unlock themes, characters)
- Offline PWA (installable app)
- Accessibility features (colorblind mode, audio-only mode)

---

## Conclusion

This plan balances professional software engineering practices with pragmatic scope for a personal project. The architecture is clean and maintainable without unnecessary abstraction. Phaser 3 provides proven infrastructure. BDD ensures we build the right thing.

Most importantly: This is for Aurora. Every decision prioritizes her learning experience and engagement. No feature ships until it's tested with her feedback.

We build it right the first time, or we don't build it at all.
