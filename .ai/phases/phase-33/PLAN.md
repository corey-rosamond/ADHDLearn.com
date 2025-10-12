# Phase 33: Memory Match - Scene Setup

## Goal
Create the foundational Memory Match mini-game scene with card grid layout and basic visual structure.

## Context
This phase introduces a new mini-game variant to Aurora's Letter Adventure. Memory Match is a classic concentration game where players flip cards to find matching pairs of letters and objects. This game type:
1. Reinforces letter-object associations through memory
2. Develops visual memory and concentration skills
3. Provides variety in gameplay to maintain engagement
4. Works particularly well for ADHD learners (quick turns, visual focus)

The Memory Match scene will feature a grid of face-down cards that players flip to reveal letters or images, searching for matching pairs. This phase focuses on the visual setup and layout.

## Prerequisites
- Phase 10 completed (Scene management system)
- Phase 15 completed (Particle effects for celebrations)
- Phase 16 completed (AudioManager for sound effects)
- MainMenu scene working (for game selection)
- Asset pipeline ready for card graphics

## Tasks

### 1. Create MemoryMatchScene Class
**File**: `src/scenes/MemoryMatchScene.js`

Create a new scene with:
- Scene initialization (key: 'MemoryMatchScene')
- Scene lifecycle methods (init, preload, create, update)
- Configuration for grid size (3x4 or 4x3)
- Data structure for card positions
- Scene cleanup on shutdown
- Proper scene management integration

### 2. Design Unique Background
**Visual Identity**: Distinct from other mini-games

Background elements:
- Base color: Soft purple gradient (#9b59b6 to #8e44ad)
- Decorative border or frame around play area
- Subtle pattern or texture (not distracting)
- Title text: "Memory Match" at top
- Score display area (matches found counter)
- Calm, focused aesthetic appropriate for concentration

Implementation:
- Use camera.setBackgroundColor() for base
- Add decorative graphics via this.add.image()
- Create title text with clear, bold font
- Position UI elements outside grid area
- Ensure adequate contrast for readability

### 3. Create Card Grid Layout
**Grid Configuration**:
- 3 rows x 4 columns = 12 cards (6 pairs)
- OR 4 rows x 3 columns = 12 cards (6 pairs)
- Choose orientation based on screen space (800x600)
- Cards evenly spaced with padding
- Centered on screen

**Layout Algorithm**:
```javascript
// Calculate grid layout
const gridConfig = {
    rows: 3,
    cols: 4,
    cardWidth: 100,
    cardHeight: 140,
    paddingX: 20,
    paddingY: 20
};

// Calculate total grid dimensions
const totalWidth = (gridConfig.cols * gridConfig.cardWidth) +
                   ((gridConfig.cols - 1) * gridConfig.paddingX);
const totalHeight = (gridConfig.rows * gridConfig.cardHeight) +
                    ((gridConfig.rows - 1) * gridConfig.paddingY);

// Starting position (center grid)
const startX = (800 - totalWidth) / 2 + (gridConfig.cardWidth / 2);
const startY = 150; // Leave space for title

// Calculate each card position
for (let row = 0; row < gridConfig.rows; row++) {
    for (let col = 0; col < gridConfig.cols; col++) {
        const x = startX + col * (gridConfig.cardWidth + gridConfig.paddingX);
        const y = startY + row * (gridConfig.cardHeight + gridConfig.paddingY);

        // Create card at position (x, y)
    }
}
```

**Grid Storage**:
- Array of card objects: `this.cards = []`
- Each card stores: position, content, state (faceUp/faceDown)
- Indexed for easy access

### 4. Design Card Back
**Visual Design**:
- Rounded rectangle shape (10px radius)
- Primary color: Cheerful blue (#3498db)
- Border: Darker blue outline (4px, #2980b9)
- Pattern: Simple star or question mark icon
- Size: 100x140 pixels (portrait orientation)
- Shadow or depth effect (subtle 3D look)

**Implementation**:
- Create card back as a Phaser Graphics object
- Or use a single sprite texture (more efficient)
- Design should be:
  - Visually appealing and inviting
  - Not too busy (solid color with simple icon)
  - Consistent across all cards
  - Clear indication that card is face-down

**Graphics Code**:
```javascript
createCardBackGraphic() {
    const graphics = this.add.graphics();

    // Card rectangle
    graphics.fillStyle(0x3498db, 1);
    graphics.fillRoundedRect(0, 0, 100, 140, 10);

    // Border
    graphics.lineStyle(4, 0x2980b9, 1);
    graphics.strokeRoundedRect(0, 0, 100, 140, 10);

    // Optional: Add icon or pattern
    // (star, question mark, or geometric pattern)

    // Generate texture from graphics
    graphics.generateTexture('card-back', 100, 140);
    graphics.destroy();
}
```

### 5. Create Flip Animation Placeholder
**Placeholder Setup**:
- Method stub: `flipCard(cardIndex)`
- Click handler on each card
- Console log flip event (for testing)
- No actual flip animation yet (Phase 34)
- Card interaction enabled/disabled state

**Implementation**:
```javascript
createCard(x, y, index) {
    const card = this.add.sprite(x, y, 'card-back');
    card.setInteractive();

    card.on('pointerdown', () => {
        this.onCardClick(index);
    });

    return card;
}

onCardClick(index) {
    console.log(`Card ${index} clicked - flip animation coming in Phase 34`);

    // Placeholder: Just log the event
    // Phase 34 will implement actual flip
}
```

### 6. Create Data Model for Cards
**Card Pair Generation**:
- Select 6 letters (A-Z)
- Create pairs: each letter has 2 cards
- Shuffle cards randomly
- Assign to grid positions

**Data Structure**:
```javascript
initializeCards() {
    // Select 6 random letters
    const availableLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    const selectedLetters = Phaser.Utils.Array.Shuffle(availableLetters).slice(0, 6);

    // Create pairs
    const cardData = [];
    selectedLetters.forEach(letter => {
        cardData.push({ letter: letter, type: 'letter' });
        cardData.push({ letter: letter, type: 'letter' }); // Duplicate for pair
    });

    // Shuffle cards
    this.cardData = Phaser.Utils.Array.Shuffle(cardData);

    // Store in array for easy access
    this.cards = [];
    this.flippedCards = [];
    this.matchedCards = [];
}
```

### 7. Add Scene Header and UI
**Header Elements**:
- Title: "Memory Match" (48px, bold, centered)
- Matches counter: "Matches: 0/6"
- Timer (optional for Phase 33, can add later)
- Back button (return to MainMenu)

**Layout**:
```
+------------------------------------------+
|              Memory Match                | <- Title
|         Matches: 0/6    [Back]          | <- UI Bar
|                                          |
|   [Card] [Card] [Card] [Card]           | <- Grid
|   [Card] [Card] [Card] [Card]           |    3 rows
|   [Card] [Card] [Card] [Card]           |    4 cols
|                                          |
+------------------------------------------+
```

## Implementation Details

### Scene Structure
```javascript
// src/scenes/MemoryMatchScene.js

export default class MemoryMatchScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MemoryMatchScene' });
    }

    init(data) {
        // Configuration
        this.gridConfig = {
            rows: 3,
            cols: 4,
            cardWidth: 100,
            cardHeight: 140,
            paddingX: 20,
            paddingY: 20
        };

        // Game state
        this.cards = [];
        this.cardData = [];
        this.flippedCards = [];
        this.matchedCards = [];
        this.matchCount = 0;
        this.totalPairs = 6;
        this.canFlip = true; // Control input

        console.log('[MemoryMatchScene] Initialized');
    }

    preload() {
        // Load any necessary assets
        // (most card content will be generated or added in Phase 34)
    }

    create() {
        console.log('[MemoryMatchScene] Creating scene...');

        this.createBackground();
        this.createHeader();
        this.createCardBackGraphic();
        this.initializeCards();
        this.createCardGrid();
        this.createUIElements();

        console.log('[MemoryMatchScene] Scene ready');
    }

    createBackground() {
        // Gradient background
        this.cameras.main.setBackgroundColor('#9b59b6');

        // Optional: Add decorative elements
        const decorativeBorder = this.add.rectangle(400, 300, 760, 560);
        decorativeBorder.setStrokeStyle(6, 0x8e44ad);
        decorativeBorder.setDepth(0);
    }

    createHeader() {
        // Title
        this.titleText = this.add.text(400, 40, 'Memory Match', {
            fontSize: '48px',
            fontFamily: 'Arial, sans-serif',
            color: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5).setDepth(100);

        // Subtitle (instructions)
        this.instructionText = this.add.text(400, 90, 'Find matching pairs!', {
            fontSize: '24px',
            fontFamily: 'Arial, sans-serif',
            color: '#ecf0f1',
            fontStyle: 'italic'
        }).setOrigin(0.5).setDepth(100);
    }

    createCardBackGraphic() {
        const graphics = this.add.graphics();

        // Card background
        graphics.fillStyle(0x3498db, 1);
        graphics.fillRoundedRect(0, 0, 100, 140, 10);

        // Border
        graphics.lineStyle(4, 0x2980b9, 1);
        graphics.strokeRoundedRect(0, 0, 100, 140, 10);

        // Star icon (optional decoration)
        graphics.fillStyle(0xf39c12, 1);
        graphics.fillStar(50, 70, 5, 15, 25);

        // Generate texture
        graphics.generateTexture('card-back', 100, 140);
        graphics.destroy();
    }

    initializeCards() {
        // Select 6 random letters
        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
        const selectedLetters = Phaser.Utils.Array.Shuffle(alphabet).slice(0, 6);

        console.log('[MemoryMatchScene] Selected letters:', selectedLetters);

        // Create pairs
        const cardData = [];
        selectedLetters.forEach(letter => {
            cardData.push({ letter: letter, type: 'letter', id: `${letter}-1` });
            cardData.push({ letter: letter, type: 'letter', id: `${letter}-2` });
        });

        // Shuffle
        this.cardData = Phaser.Utils.Array.Shuffle(cardData);
    }

    createCardGrid() {
        const config = this.gridConfig;

        // Calculate grid centering
        const totalWidth = (config.cols * config.cardWidth) +
                          ((config.cols - 1) * config.paddingX);
        const startX = (800 - totalWidth) / 2 + (config.cardWidth / 2);
        const startY = 150;

        // Create each card
        let cardIndex = 0;
        for (let row = 0; row < config.rows; row++) {
            for (let col = 0; col < config.cols; col++) {
                const x = startX + col * (config.cardWidth + config.paddingX);
                const y = startY + row * (config.cardHeight + config.paddingY);

                const card = this.createCard(x, y, cardIndex);
                this.cards.push(card);

                cardIndex++;
            }
        }

        console.log(`[MemoryMatchScene] Created ${this.cards.length} cards`);
    }

    createCard(x, y, index) {
        // Create card sprite (back side)
        const card = this.add.sprite(x, y, 'card-back');
        card.setInteractive({ useHandCursor: true });
        card.setData('index', index);
        card.setData('flipped', false);
        card.setData('matched', false);
        card.setDepth(10);

        // Hover effect
        card.on('pointerover', () => {
            if (!card.getData('flipped') && !card.getData('matched')) {
                card.setScale(1.05);
            }
        });

        card.on('pointerout', () => {
            card.setScale(1.0);
        });

        // Click handler (placeholder)
        card.on('pointerdown', () => {
            this.onCardClick(index);
        });

        return card;
    }

    onCardClick(index) {
        const card = this.cards[index];

        if (!this.canFlip || card.getData('flipped') || card.getData('matched')) {
            return; // Ignore click
        }

        console.log(`[MemoryMatchScene] Card ${index} clicked (${this.cardData[index].letter})`);
        console.log('  -> Flip animation coming in Phase 34');

        // Placeholder: Log the event only
        // Phase 34 will implement actual flip animation
    }

    createUIElements() {
        // Matches counter
        this.matchesText = this.add.text(60, 90, `Matches: ${this.matchCount}/${this.totalPairs}`, {
            fontSize: '24px',
            fontFamily: 'Arial, sans-serif',
            color: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0, 0.5).setDepth(100);

        // Back button
        this.backButton = this.add.text(740, 90, 'Back', {
            fontSize: '24px',
            fontFamily: 'Arial, sans-serif',
            color: '#ffffff',
            backgroundColor: '#e74c3c',
            padding: { x: 20, y: 10 },
            fontStyle: 'bold'
        }).setOrigin(1, 0.5).setInteractive({ useHandCursor: true }).setDepth(100);

        this.backButton.on('pointerover', () => {
            this.backButton.setScale(1.1);
        });

        this.backButton.on('pointerout', () => {
            this.backButton.setScale(1.0);
        });

        this.backButton.on('pointerdown', () => {
            console.log('[MemoryMatchScene] Back button clicked');
            this.scene.start('MainMenu');
        });
    }

    updateMatchesDisplay() {
        this.matchesText.setText(`Matches: ${this.matchCount}/${this.totalPairs}`);
    }
}
```

## Acceptance Criteria
- [ ] MemoryMatchScene.js created in src/scenes/
- [ ] Scene loads without errors
- [ ] Purple gradient background displays
- [ ] "Memory Match" title appears at top
- [ ] Grid layout calculates correctly (3x4 or 4x3)
- [ ] 12 cards display in grid formation
- [ ] Cards are evenly spaced and centered
- [ ] Card back design is appealing and clear
- [ ] All cards use the same back design
- [ ] Cards have rounded corners
- [ ] Card hover effect works (scale 1.05)
- [ ] Cards are clickable (cursor changes to pointer)
- [ ] Click logs to console (placeholder)
- [ ] Matches counter displays "Matches: 0/6"
- [ ] Back button visible and functional
- [ ] Back button returns to MainMenu
- [ ] Scene is visually distinct from other mini-games
- [ ] Layout is not cluttered or overwhelming
- [ ] All text is readable and properly sized
- [ ] No console errors on scene load
- [ ] Scene cleanup works (can exit and re-enter)

## Testing Steps
1. Start game and navigate to MemoryMatchScene
   - Verify scene loads successfully
   - Verify no console errors
2. Check background
   - Verify purple gradient displays
   - Verify decorative elements appear
3. Check header
   - Verify "Memory Match" title centered at top
   - Verify "Find matching pairs!" subtitle
4. Check card grid
   - Count cards: should be exactly 12
   - Verify 3 rows and 4 columns (or 4x3)
   - Verify cards are evenly spaced
   - Verify grid is centered on screen
5. Check card appearance
   - Verify all cards show blue back design
   - Verify rounded corners visible
   - Verify border around each card
   - Verify star or decorative icon on back
6. Test card interaction
   - Hover over each card
   - Verify scale effect (1.05)
   - Verify cursor changes to pointer
   - Click each card
   - Verify console log appears
7. Check UI elements
   - Verify matches counter shows "Matches: 0/6"
   - Verify counter is readable and well-positioned
8. Test back button
   - Hover over button - verify scale effect
   - Click button - verify returns to MainMenu
   - Re-enter scene - verify everything resets
9. Test scene lifecycle
   - Enter and exit scene multiple times
   - Verify no memory leaks
   - Verify scene always loads correctly
10. Visual verification
    - Check overall aesthetic
    - Verify colors are calming and appropriate
    - Verify layout is clear and organized

## Estimated Time
1 hour

## Dependencies
- Phaser 3 scene system
- Phaser Graphics API for card back
- Phaser Array utilities (shuffle)
- MainMenu scene (for back button transition)

## Risks
- **Grid layout calculation errors**: Cards overlap or misaligned
  - Mitigation: Test with different grid configurations, verify math
- **Card back texture quality**: Pixelated or unclear
  - Mitigation: Use appropriate resolution, test visual quality
- **Too many/few cards**: 12 cards might be too easy/hard
  - Mitigation: 6 pairs (12 cards) is standard for beginners, can adjust later
- **Performance with 12 sprites**: Possible lag
  - Mitigation: Use texture atlas, test on target device
- **Confusing with other scenes**: Looks too similar to other games
  - Mitigation: Unique purple color scheme, distinct layout

## ADHD-Friendly Design Considerations
- **Clear visual structure**: Grid layout is organized and predictable
- **Not overwhelming**: 12 cards is manageable (not too many)
- **Immediate feedback**: Hover effects provide instant response
- **Calm colors**: Purple is calming and helps focus
- **Simple card design**: Not too busy or distracting
- **Clear goal**: "Find matching pairs" is simple to understand
- **Progress visible**: Matches counter shows advancement
- **Easy exit**: Back button always available

## Notes
- Grid size (3x4) chosen for 800x600 canvas - good use of space
- 6 pairs (12 cards) is appropriate difficulty for young children
- Card back texture generated programmatically (can replace with image)
- Phase 34 will add flip animations and actual card fronts
- Consider adding timer in future phases (optional challenge mode)
- Color scheme (purple) intentionally different from other mini-games
- All cards start face-down for proper memory game experience
- Card data shuffled each round for replayability

## Completion Checklist
- [ ] MemoryMatchScene.js created and fully implemented
- [ ] Scene properly registered in game config
- [ ] Background and visual design complete
- [ ] Card grid layout algorithm working
- [ ] All 12 cards displaying correctly
- [ ] Card back design finalized
- [ ] Hover effects working
- [ ] Click handlers logging events
- [ ] UI elements (title, counter, back button) functional
- [ ] All acceptance criteria met
- [ ] Tested scene lifecycle (enter/exit)
- [ ] No console errors or warnings
- [ ] Smooth 60fps performance
- [ ] Ready to proceed to Phase 34

## What's Next (Phase 34)
- Create Card.js class for card objects
- Implement 3D flip animation
- Show letter/image on card face
- Enforce two-card selection limit
- Add flip sound effects
