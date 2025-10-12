# Phase 19: Difficulty Levels

## Goal
Implement three distinct difficulty levels (Easy, Medium, Hard) with adaptive challenge mechanics that adjust bubble count, letter case, and letter similarity to provide appropriate challenge and natural progression for learners.

## Context
This phase adds adaptive difficulty to Letter Pop:
1. Three difficulty levels with different gameplay parameters
2. Easy mode for beginners (3 bubbles, uppercase only)
3. Medium mode for developing skills (4 bubbles, mixed case)
4. Hard mode for advanced learners (5 bubbles, similar letters like b/d/p/q)
5. Difficulty selection in menu system
6. ProgressManager suggests appropriate difficulty based on performance
7. Smooth difficulty transitions that feel natural and encouraging

Children with ADHD benefit from appropriately challenging tasks - not too easy (boring) and not too hard (frustrating). Adaptive difficulty keeps learners in the optimal "flow state" where they're engaged and challenged without being overwhelmed.

## Prerequisites
- Phase 11 completed (LetterPopScene with bubble mechanics)
- Phase 13 completed (ProgressManager tracking performance)
- Phase 18 completed (ResultsScene with performance feedback)
- MainMenu scene exists for difficulty selection
- GameManager or configuration system in place

## Tasks

### 1. Create Difficulty Configuration System
**File**: `src/config/DifficultyConfig.js`

Define difficulty settings:
- Easy: 3 bubbles, uppercase letters only, common letters (A, B, C, D, E)
- Medium: 4 bubbles, mixed case (Aa, Bb), all 26 letters
- Hard: 5 bubbles, similar letters (b/d/p/q, m/n/w, u/v), mixed case

**Configuration Structure**:
```javascript
{
  easy: {
    name: 'Easy',
    bubbleCount: 3,
    letterCase: 'uppercase',
    letterPool: 'common', // A-Z, common letters
    similarLetters: false,
    timeLimit: null, // No time pressure
    description: 'Perfect for beginners!'
  },
  medium: {
    name: 'Medium',
    bubbleCount: 4,
    letterCase: 'mixed',
    letterPool: 'all', // All 26 letters
    similarLetters: false,
    timeLimit: null,
    description: 'Ready for more challenge?'
  },
  hard: {
    name: 'Hard',
    bubbleCount: 5,
    letterCase: 'mixed',
    letterPool: 'similar', // Includes confusing pairs
    similarLetters: true,
    timeLimit: null,
    description: 'For letter masters!'
  }
}
```

### 2. Update LetterPopScene for Difficulty
**File**: `src/scenes/LetterPopScene.js`

Modify to accept difficulty parameter:
- Receive difficulty setting in init() or constructor
- Load appropriate difficulty config
- Adjust bubble count based on difficulty
- Use correct letter pool based on difficulty
- Apply letter case rules (uppercase, lowercase, mixed)
- Increase distractor difficulty for hard mode

### 3. Implement Letter Pool Management
**File**: `src/utils/LetterPoolManager.js`

Create letter pool utility:
- `getCommonLetters()`: Returns frequently used letters (A-M)
- `getAllLetters()`: Returns full alphabet (A-Z)
- `getSimilarLetters()`: Returns confusing pairs (b/d/p/q, m/n/w, u/v)
- `getLetterCase(letter, caseType)`: Returns uppercase, lowercase, or random
- `generateDistractors(target, difficulty)`: Creates appropriate wrong answers

**Similar Letter Pairs**:
- b/d/p/q (circular shape variations)
- m/n/w (similar vertical strokes)
- u/v (similar curves)
- i/j/l (vertical strokes)
- c/e (open curves)
- o/a (circular with variations)

### 4. Add Difficulty Selection to MainMenu
**File**: `src/scenes/MainMenu.js`

Add difficulty selection UI:
- Three buttons: Easy, Medium, Hard
- Visual styling to indicate current difficulty
- Descriptions for each difficulty level
- Highlight recommended difficulty (from ProgressManager)
- Store selected difficulty in GameManager
- Pass difficulty to LetterPopScene on start

**UI Design**:
- Position difficulty buttons prominently
- Use color coding (green=easy, yellow=medium, red=hard)
- Show icon or visual indicator for each level
- Display brief description
- Optional: Show "Recommended for you" badge

### 5. Implement ProgressManager Difficulty Suggestion
**File**: `src/services/ProgressManager.js`

Add difficulty recommendation logic:
- Track performance metrics (accuracy, speed, consistency)
- Calculate recommended difficulty based on recent performance
- Easy: Recommended for <60% accuracy
- Medium: Recommended for 60-85% accuracy
- Hard: Recommended for >85% accuracy
- Consider streak data and mastery progress
- Allow manual override (player choice respected)

**Recommendation Algorithm**:
```javascript
calculateRecommendedDifficulty() {
  const recentAccuracy = this.getRecentAccuracy(last 5 rounds);
  const masteryCount = this.getMasteredLetterCount();
  const currentStreak = this.getCurrentStreak();

  if (recentAccuracy >= 85 && masteryCount >= 15) {
    return 'hard';
  } else if (recentAccuracy >= 60 && masteryCount >= 8) {
    return 'medium';
  } else {
    return 'easy';
  }
}
```

### 6. Create Difficulty Transition System
**Implementation**:
- Smooth transitions between difficulty levels
- Encouraging messages when difficulty increases
- Supportive messages when difficulty decreases
- No shame for choosing easier difficulty
- Celebrate when moving to harder difficulty

**Transition Messages**:
- Moving to Easy: "Let's practice the basics!"
- Moving to Medium: "You're ready for more challenge!"
- Moving to Hard: "Amazing! You're a letter expert!"
- Staying at current: "Perfect level for you!"

### 7. Adjust Bubble Generation Logic
**File**: `src/scenes/LetterPopScene.js`

Modify bubble creation:
- Create correct number of bubbles based on difficulty
- Position bubbles appropriately (more bubbles = tighter spacing)
- For Hard mode: Include similar-looking letters as distractors
- For Easy mode: Use visually distinct letters as distractors
- Ensure target letter is always included
- Randomize bubble positions

**Bubble Positioning**:
- 3 bubbles (Easy): Wider spacing, easier to see
- 4 bubbles (Medium): Standard spacing
- 5 bubbles (Hard): Slightly tighter spacing, more visual challenge

### 8. Implement Mixed Case Letter Display
**File**: `src/scenes/LetterPopScene.js`

Handle mixed case:
- For uppercase mode: Display 'A' (simple)
- For mixed case mode: Display 'Aa' or 'A/a' format
- Ensure both cases are taught together
- Audio should say "A - uppercase and lowercase a"
- Visual pairing helps recognition of both forms

**Display Format Options**:
- Side-by-side: "Aa"
- Stacked: "A" with smaller "a" below
- Separated: "A / a"

## Implementation Details

### DifficultyConfig.js Structure

```javascript
// src/config/DifficultyConfig.js

const DifficultyConfig = {
    easy: {
        key: 'easy',
        name: 'Easy',
        displayName: 'Easy',
        description: 'Perfect for beginners!',
        color: '#27ae60', // Green
        icon: '⭐',

        // Gameplay settings
        bubbleCount: 3,
        letterCase: 'uppercase', // 'uppercase', 'lowercase', 'mixed'
        letterPool: 'common', // 'common', 'all', 'similar'
        similarLetters: false,
        timeLimit: null, // No time pressure

        // Letter pools
        commonLetters: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M'],

        // Visual settings
        bubbleSize: 100, // Slightly larger for easy visibility
        bubbleSpacing: 150,

        // Audio settings
        slowAudio: false, // Normal speed
        repeatAudio: true, // Can repeat instructions
    },

    medium: {
        key: 'medium',
        name: 'Medium',
        displayName: 'Medium',
        description: 'Ready for more challenge?',
        color: '#f39c12', // Orange/Yellow
        icon: '⭐⭐',

        // Gameplay settings
        bubbleCount: 4,
        letterCase: 'mixed', // Shows both Aa
        letterPool: 'all',
        similarLetters: false,
        timeLimit: null,

        // Letter pools
        allLetters: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
                     'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],

        // Visual settings
        bubbleSize: 90,
        bubbleSpacing: 130,

        // Audio settings
        slowAudio: false,
        repeatAudio: true,
    },

    hard: {
        key: 'hard',
        name: 'Hard',
        displayName: 'Hard',
        description: 'For letter masters!',
        color: '#e74c3c', // Red
        icon: '⭐⭐⭐',

        // Gameplay settings
        bubbleCount: 5,
        letterCase: 'mixed',
        letterPool: 'similar', // Includes confusing pairs
        similarLetters: true,
        timeLimit: null, // Could add time pressure in future

        // Letter pools - includes similar pairs
        similarLetterPairs: {
            'b': ['d', 'p', 'q'],
            'd': ['b', 'p', 'q'],
            'p': ['b', 'd', 'q'],
            'q': ['b', 'd', 'p'],
            'm': ['n', 'w'],
            'n': ['m', 'w', 'u'],
            'w': ['m', 'n', 'v'],
            'u': ['v', 'n'],
            'v': ['u', 'w'],
            'c': ['e', 'o'],
            'e': ['c', 'a'],
            'i': ['j', 'l'],
            'j': ['i', 'l'],
            'l': ['i', 'j']
        },

        allLetters: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
                     'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],

        // Visual settings
        bubbleSize: 85,
        bubbleSpacing: 110,

        // Audio settings
        slowAudio: false,
        repeatAudio: false, // More challenging - listen carefully
    }
};

export default DifficultyConfig;

// Helper function to get difficulty config
export function getDifficultyConfig(difficultyKey) {
    return DifficultyConfig[difficultyKey] || DifficultyConfig.medium;
}

// Helper function to get all difficulties as array
export function getAllDifficulties() {
    return ['easy', 'medium', 'hard'];
}
```

### LetterPoolManager.js Implementation

```javascript
// src/utils/LetterPoolManager.js

import DifficultyConfig from '../config/DifficultyConfig.js';

class LetterPoolManager {
    constructor() {
        this.commonLetters = DifficultyConfig.easy.commonLetters;
        this.allLetters = DifficultyConfig.medium.allLetters;
        this.similarPairs = DifficultyConfig.hard.similarLetterPairs;
    }

    /**
     * Get letter pool based on difficulty
     */
    getLetterPool(difficulty) {
        const config = DifficultyConfig[difficulty];

        if (config.letterPool === 'common') {
            return this.commonLetters;
        } else if (config.letterPool === 'all') {
            return this.allLetters;
        } else if (config.letterPool === 'similar') {
            return this.allLetters; // Hard mode uses all letters
        }

        return this.allLetters; // Default
    }

    /**
     * Get random letter from pool
     */
    getRandomLetter(difficulty) {
        const pool = this.getLetterPool(difficulty);
        return Phaser.Math.RND.pick(pool);
    }

    /**
     * Get letter in specified case
     */
    getLetterInCase(letter, caseType) {
        if (caseType === 'uppercase') {
            return letter.toUpperCase();
        } else if (caseType === 'lowercase') {
            return letter.toLowerCase();
        } else if (caseType === 'mixed') {
            // Return both cases (display logic handles this)
            return {
                upper: letter.toUpperCase(),
                lower: letter.toLowerCase()
            };
        }
        return letter.toUpperCase();
    }

    /**
     * Generate distractor letters (wrong answers)
     */
    generateDistractors(targetLetter, difficulty, count) {
        const config = DifficultyConfig[difficulty];
        const distractors = [];
        const pool = this.getLetterPool(difficulty);

        if (config.similarLetters && this.similarPairs[targetLetter.toLowerCase()]) {
            // Hard mode: Use similar-looking letters as distractors
            const similarLetters = this.similarPairs[targetLetter.toLowerCase()];

            // Add similar letters first
            for (let similar of similarLetters) {
                if (distractors.length < count) {
                    distractors.push(similar.toUpperCase());
                }
            }

            // Fill remaining with random letters if needed
            while (distractors.length < count) {
                const random = Phaser.Math.RND.pick(pool);
                if (random !== targetLetter && !distractors.includes(random)) {
                    distractors.push(random);
                }
            }
        } else {
            // Easy/Medium mode: Random distinct letters
            while (distractors.length < count) {
                const random = Phaser.Math.RND.pick(pool);
                if (random !== targetLetter && !distractors.includes(random)) {
                    distractors.push(random);
                }
            }
        }

        return distractors.slice(0, count);
    }

    /**
     * Format letter for display based on case setting
     */
    formatLetterForDisplay(letter, caseType) {
        if (caseType === 'uppercase') {
            return letter.toUpperCase();
        } else if (caseType === 'lowercase') {
            return letter.toLowerCase();
        } else if (caseType === 'mixed') {
            // Format as "Aa" for mixed case
            return letter.toUpperCase() + letter.toLowerCase();
        }
        return letter.toUpperCase();
    }

    /**
     * Get audio text for letter based on case
     */
    getAudioText(letter, caseType) {
        const upper = letter.toUpperCase();
        const lower = letter.toLowerCase();

        if (caseType === 'uppercase') {
            return `Find the letter ${upper}`;
        } else if (caseType === 'lowercase') {
            return `Find the lowercase letter ${lower}`;
        } else if (caseType === 'mixed') {
            return `Find the letter ${upper} - uppercase ${upper} and lowercase ${lower}`;
        }
        return `Find the letter ${upper}`;
    }
}

export default new LetterPoolManager();
```

### Updated LetterPopScene with Difficulty

```javascript
// src/scenes/LetterPopScene.js (modified sections)

import DifficultyConfig, { getDifficultyConfig } from '../config/DifficultyConfig.js';
import LetterPoolManager from '../utils/LetterPoolManager.js';

export default class LetterPopScene extends Phaser.Scene {
    constructor() {
        super({ key: 'LetterPopScene' });
    }

    init(data) {
        // Get difficulty from data or default to medium
        this.difficulty = data.difficulty || 'medium';
        this.difficultyConfig = getDifficultyConfig(this.difficulty);

        console.log('[LetterPopScene] Starting with difficulty:', this.difficulty);
        console.log('[LetterPopScene] Bubble count:', this.difficultyConfig.bubbleCount);
        console.log('[LetterPopScene] Letter case:', this.difficultyConfig.letterCase);

        // Initialize round data
        this.currentLetterIndex = 0;
        this.totalLetters = 10;
        this.score = 0;
        this.masteredLetters = [];
    }

    create() {
        // Setup background, UI, etc.
        this.createBackground();
        this.createUI();

        // Start first letter
        this.displayCurrentLetter();
    }

    displayCurrentLetter() {
        // Get random target letter based on difficulty
        this.targetLetter = LetterPoolManager.getRandomLetter(this.difficulty);

        // Format letter for display
        const displayLetter = LetterPoolManager.formatLetterForDisplay(
            this.targetLetter,
            this.difficultyConfig.letterCase
        );

        // Display letter prompt
        this.letterText.setText(displayLetter);

        // Play audio instruction
        const audioText = LetterPoolManager.getAudioText(
            this.targetLetter,
            this.difficultyConfig.letterCase
        );
        this.playVoiceInstruction(audioText);

        // Create bubbles
        this.createBubbles();
    }

    createBubbles() {
        // Get number of bubbles for this difficulty
        const bubbleCount = this.difficultyConfig.bubbleCount;

        // Generate distractors (wrong answers)
        const distractorCount = bubbleCount - 1;
        const distractors = LetterPoolManager.generateDistractors(
            this.targetLetter,
            this.difficulty,
            distractorCount
        );

        // Create array of all letters (target + distractors)
        const allLetters = [this.targetLetter, ...distractors];

        // Shuffle array
        Phaser.Utils.Array.Shuffle(allLetters);

        // Calculate bubble positions based on count
        const positions = this.calculateBubblePositions(bubbleCount);

        // Create bubbles
        allLetters.forEach((letter, index) => {
            const pos = positions[index];
            const bubble = this.createBubble(
                pos.x,
                pos.y,
                letter,
                this.difficultyConfig
            );
            this.bubbleGroup.add(bubble);
        });
    }

    calculateBubblePositions(count) {
        const positions = [];
        const centerX = 400;
        const centerY = 400;
        const spacing = this.difficultyConfig.bubbleSpacing;

        if (count === 3) {
            // Triangle formation
            positions.push({ x: centerX, y: centerY - spacing });
            positions.push({ x: centerX - spacing, y: centerY + spacing / 2 });
            positions.push({ x: centerX + spacing, y: centerY + spacing / 2 });
        } else if (count === 4) {
            // Square formation
            positions.push({ x: centerX - spacing / 2, y: centerY - spacing / 2 });
            positions.push({ x: centerX + spacing / 2, y: centerY - spacing / 2 });
            positions.push({ x: centerX - spacing / 2, y: centerY + spacing / 2 });
            positions.push({ x: centerX + spacing / 2, y: centerY + spacing / 2 });
        } else if (count === 5) {
            // Pentagon formation (or cross with center)
            positions.push({ x: centerX, y: centerY - spacing });
            positions.push({ x: centerX - spacing, y: centerY });
            positions.push({ x: centerX + spacing, y: centerY });
            positions.push({ x: centerX - spacing / 2, y: centerY + spacing });
            positions.push({ x: centerX + spacing / 2, y: centerY + spacing });
        }

        return positions;
    }

    createBubble(x, y, letter, config) {
        // Create bubble container
        const bubble = this.add.container(x, y);

        // Bubble circle
        const circle = this.add.circle(0, 0, config.bubbleSize / 2, 0x4488ff);
        circle.setStrokeStyle(4, 0x2266dd);

        // Letter text
        const displayLetter = LetterPoolManager.formatLetterForDisplay(
            letter,
            config.letterCase
        );

        const text = this.add.text(0, 0, displayLetter, {
            fontSize: config.letterCase === 'mixed' ? '32px' : '48px',
            color: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        bubble.add([circle, text]);
        bubble.setData('letter', letter);
        bubble.setSize(config.bubbleSize, config.bubbleSize);
        bubble.setInteractive();

        // Click handler
        bubble.on('pointerdown', () => {
            this.onBubbleClick(bubble);
        });

        return bubble;
    }

    onBubbleClick(bubble) {
        const clickedLetter = bubble.getData('letter');

        if (clickedLetter.toUpperCase() === this.targetLetter.toUpperCase()) {
            this.onCorrectAnswer(bubble);
        } else {
            this.onIncorrectAnswer(bubble);
        }
    }

    onCorrectAnswer(bubble) {
        // Existing correct answer logic
        this.score++;
        // ... particle effects, sound, etc.

        this.advanceToNextLetter();
    }

    onIncorrectAnswer(bubble) {
        // Existing incorrect answer logic
        // ... shake animation, sound, etc.
    }

    advanceToNextLetter() {
        this.currentLetterIndex++;

        // Clean up current bubbles
        this.bubbleGroup.clear(true, true);

        if (this.currentLetterIndex >= this.totalLetters) {
            // Round complete - go to results
            this.endRound();
        } else {
            // Show next letter after brief delay
            this.time.delayedCall(800, () => {
                this.displayCurrentLetter();
            });
        }
    }

    endRound() {
        // Transition to results scene with difficulty info
        this.scene.start('ResultsScene', {
            score: this.score,
            total: this.totalLetters,
            masteredLetters: this.masteredLetters,
            difficulty: this.difficulty
        });
    }
}
```

### MainMenu Difficulty Selection

```javascript
// src/scenes/MainMenu.js (add difficulty selection)

import DifficultyConfig, { getAllDifficulties } from '../config/DifficultyConfig.js';
import ProgressManager from '../services/ProgressManager.js';

export default class MainMenu extends Phaser.Scene {
    create() {
        // Existing main menu elements...

        // Get recommended difficulty
        const recommended = ProgressManager.getRecommendedDifficulty();
        this.selectedDifficulty = recommended;

        // Create difficulty selection UI
        this.createDifficultySelection();

        // Create play button
        this.createPlayButton();
    }

    createDifficultySelection() {
        const titleText = this.add.text(400, 200, 'Choose Difficulty:', {
            fontSize: '32px',
            color: '#2c3e50',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        const difficulties = getAllDifficulties();
        const startX = 150;
        const spacing = 200;

        difficulties.forEach((diffKey, index) => {
            const config = DifficultyConfig[diffKey];
            const x = startX + index * spacing;
            const y = 300;

            // Difficulty button
            const button = this.add.container(x, y);

            // Background
            const bg = this.add.rectangle(0, 0, 180, 200, 0xffffff);
            bg.setStrokeStyle(4, Phaser.Display.Color.HexStringToColor(config.color).color);

            // Icon/Stars
            const icon = this.add.text(0, -60, config.icon, {
                fontSize: '48px'
            }).setOrigin(0.5);

            // Name
            const name = this.add.text(0, -20, config.displayName, {
                fontSize: '28px',
                color: config.color,
                fontStyle: 'bold'
            }).setOrigin(0.5);

            // Description
            const desc = this.add.text(0, 20, config.description, {
                fontSize: '16px',
                color: '#7f8c8d',
                align: 'center',
                wordWrap: { width: 160 }
            }).setOrigin(0.5);

            // Bubble count indicator
            const bubbleInfo = this.add.text(0, 70, `${config.bubbleCount} bubbles`, {
                fontSize: '14px',
                color: '#95a5a6'
            }).setOrigin(0.5);

            button.add([bg, icon, name, desc, bubbleInfo]);

            // Make interactive
            button.setSize(180, 200);
            button.setInteractive();

            button.on('pointerdown', () => {
                this.selectDifficulty(diffKey);
            });

            button.on('pointerover', () => {
                bg.setStrokeStyle(6, Phaser.Display.Color.HexStringToColor(config.color).color);
                this.sound.play('hover-sound');
            });

            button.on('pointerout', () => {
                const strokeWidth = this.selectedDifficulty === diffKey ? 6 : 4;
                bg.setStrokeStyle(strokeWidth, Phaser.Display.Color.HexStringToColor(config.color).color);
            });

            // Recommended badge
            if (diffKey === this.selectedDifficulty) {
                const badge = this.add.text(0, -90, 'Recommended', {
                    fontSize: '14px',
                    color: '#ffffff',
                    backgroundColor: '#27ae60',
                    padding: { x: 8, y: 4 }
                }).setOrigin(0.5);
                button.add(badge);
                bg.setStrokeStyle(6, Phaser.Display.Color.HexStringToColor(config.color).color);
            }

            this[`difficultyButton_${diffKey}`] = button;
        });
    }

    selectDifficulty(diffKey) {
        this.selectedDifficulty = diffKey;
        this.sound.play('click-sound');

        // Update button visuals
        getAllDifficulties().forEach(key => {
            const button = this[`difficultyButton_${key}`];
            const bg = button.list[0]; // First element is background
            const config = DifficultyConfig[key];
            const strokeWidth = key === diffKey ? 6 : 4;
            bg.setStrokeStyle(strokeWidth, Phaser.Display.Color.HexStringToColor(config.color).color);
        });

        console.log('[MainMenu] Difficulty selected:', diffKey);
    }

    createPlayButton() {
        const playButton = this.add.text(400, 500, 'Play Game', {
            fontSize: '36px',
            color: '#ffffff',
            backgroundColor: '#3498db',
            padding: { x: 40, y: 20 },
            fontStyle: 'bold'
        }).setOrigin(0.5).setInteractive();

        playButton.on('pointerover', () => {
            playButton.setScale(1.1);
            this.sound.play('hover-sound');
        });

        playButton.on('pointerout', () => {
            playButton.setScale(1);
        });

        playButton.on('pointerdown', () => {
            this.sound.play('click-sound');
            this.cameras.main.fade(300);
            this.time.delayedCall(300, () => {
                this.scene.start('LetterPopScene', {
                    difficulty: this.selectedDifficulty
                });
            });
        });
    }
}
```

### ProgressManager Difficulty Recommendation

```javascript
// src/services/ProgressManager.js (add difficulty recommendation)

class ProgressManager {
    // ... existing code ...

    getRecommendedDifficulty() {
        // Get recent performance data
        const recentAccuracy = this.getRecentAccuracy(5); // Last 5 rounds
        const masteredCount = this.getMasteredLetterCount();
        const currentStreak = this.getLongestStreak();

        // Calculate recommendation based on multiple factors
        let recommendedDifficulty = 'medium'; // Default

        // Check for hard difficulty
        if (recentAccuracy >= 85 && masteredCount >= 15 && currentStreak >= 5) {
            recommendedDifficulty = 'hard';
        }
        // Check for easy difficulty
        else if (recentAccuracy < 60 || masteredCount < 8) {
            recommendedDifficulty = 'easy';
        }
        // Otherwise stay at medium

        console.log('[ProgressManager] Recommended difficulty:', recommendedDifficulty);
        console.log('  Recent accuracy:', recentAccuracy.toFixed(1) + '%');
        console.log('  Mastered letters:', masteredCount);
        console.log('  Current streak:', currentStreak);

        return recommendedDifficulty;
    }

    getRecentAccuracy(roundCount = 5) {
        // Get accuracy from last N rounds
        const recentRounds = this.getRoundHistory(roundCount);

        if (recentRounds.length === 0) {
            return 0; // No history, start with easy
        }

        const totalCorrect = recentRounds.reduce((sum, round) => sum + round.correct, 0);
        const totalQuestions = recentRounds.reduce((sum, round) => sum + round.total, 0);

        if (totalQuestions === 0) return 0;

        return (totalCorrect / totalQuestions) * 100;
    }

    getMasteredLetterCount() {
        // Count letters that have achieved mastery
        const masteredLetters = this.getMasteredLetters();
        return masteredLetters.length;
    }

    getLongestStreak() {
        // Get longest correct answer streak
        return this.progressData.longestStreak || 0;
    }

    getRoundHistory(count) {
        // Get last N rounds from history
        return this.progressData.roundHistory?.slice(-count) || [];
    }
}
```

## Acceptance Criteria
- [ ] DifficultyConfig.js created with all three difficulty levels
- [ ] Easy mode: 3 bubbles, uppercase only, common letters
- [ ] Medium mode: 4 bubbles, mixed case, all letters
- [ ] Hard mode: 5 bubbles, mixed case, similar letters
- [ ] LetterPoolManager.js created and working
- [ ] Letter pool selection works for each difficulty
- [ ] Similar letter generation works for hard mode
- [ ] LetterPopScene accepts difficulty parameter
- [ ] Bubble count adjusts based on difficulty
- [ ] Letter case displays correctly for each mode
- [ ] Mixed case shows both uppercase and lowercase
- [ ] Distractor generation appropriate for difficulty
- [ ] MainMenu displays difficulty selection UI
- [ ] All three difficulty buttons visible and styled
- [ ] Difficulty selection is interactive
- [ ] Selected difficulty highlighted visually
- [ ] ProgressManager calculates recommended difficulty
- [ ] Recommended difficulty shown in menu
- [ ] Difficulty passes to LetterPopScene correctly
- [ ] Difficulty passes through to ResultsScene
- [ ] Play Again button preserves difficulty setting
- [ ] Bubble positioning adjusts for different counts
- [ ] Performance smooth with 5 bubbles (hard mode)
- [ ] Similar letters (b/d/p/q) appear in hard mode
- [ ] Audio instructions match letter case mode
- [ ] All difficulty transitions work smoothly

## Testing Steps
1. Open game and navigate to MainMenu
2. Verify three difficulty options visible
3. Check Easy button (green, ⭐, 3 bubbles)
4. Check Medium button (yellow, ⭐⭐, 4 bubbles)
5. Check Hard button (red, ⭐⭐⭐, 5 bubbles)
6. Verify one is marked "Recommended"
7. Click Easy - verify selection highlight
8. Click Play Game - verify LetterPopScene starts
9. Verify 3 bubbles appear
10. Verify all letters are uppercase
11. Verify letters are from common pool (A-M)
12. Complete round and return to menu
13. Select Medium difficulty
14. Verify 4 bubbles appear
15. Verify letters show mixed case (Aa format)
16. Verify all 26 letters can appear
17. Complete round and return to menu
18. Select Hard difficulty
19. Verify 5 bubbles appear
20. Verify similar letters appear as distractors (b near d, etc.)
21. Verify mixed case still works
22. Complete multiple rounds with varied performance
23. Check if recommended difficulty changes
24. Test difficulty recommendation algorithm:
    - Play 5 rounds with <60% accuracy
    - Verify Easy is recommended
    - Play 5 rounds with 70-85% accuracy
    - Verify Medium is recommended
    - Play 5 rounds with >85% accuracy
    - Verify Hard is recommended
25. Test Play Again button preserves difficulty
26. Test bubble positioning for 3, 4, and 5 bubbles
27. Verify no overlap or off-screen bubbles
28. Test audio instructions for each case mode
29. Verify smooth performance in all modes

## Estimated Time
1.5 hours

## Dependencies
- LetterPopScene (modify for difficulty support)
- MainMenu scene (add difficulty selection UI)
- ProgressManager (add recommendation logic)
- DifficultyConfig (new file)
- LetterPoolManager (new utility)

## Risks
- **Difficulty too subjective**: What's hard for one child is easy for another
  - Mitigation: Allow manual selection, recommendation is just a suggestion
- **Similar letters too hard**: b/d/p/q may be too confusing
  - Mitigation: Test with target age group, adjust if needed
- **Mixed case confusing**: Showing "Aa" may be unclear
  - Mitigation: Use clear visual format, audio clarifies
- **5 bubbles too crowded**: Screen may feel cluttered
  - Mitigation: Adjust bubble size and spacing, test on different screens
- **Recommendation algorithm inaccurate**: Wrong difficulty suggested
  - Mitigation: Use multiple factors, allow override, refine with testing

## ADHD-Friendly Design Considerations
- **Appropriate challenge**: Not too easy (boring) or too hard (frustrating)
- **Player agency**: Can choose their own difficulty
- **No shame**: Easy mode is presented positively
- **Clear progression**: Can see growth as they move up difficulties
- **Immediate adaptation**: Difficulty change takes effect right away
- **Positive framing**: All difficulties presented as valid choices
- **Visual clarity**: Even hard mode maintains clear letter display
- **Success achievable**: All difficulties designed to be completable

## Notes
- Start with conservative difficulty thresholds, adjust based on testing
- Similar letter pairs (b/d/p/q) are developmentally appropriate challenges
- Mixed case is important for reading readiness (see both forms)
- Consider adding "adaptive" mode in future that auto-adjusts
- Time limits not included in v1 (could add to hard mode later)
- Bubble size adjustment ensures readability at all difficulties
- Recommendation is a suggestion, not a restriction
- Future: Track difficulty history for progress reports
- Future: Unlock hard mode after mastering X letters
- Future: Add custom difficulty settings

## Completion Checklist
- [ ] DifficultyConfig.js created with all settings
- [ ] LetterPoolManager.js created with all methods
- [ ] LetterPopScene updated to use difficulty
- [ ] MainMenu updated with difficulty selection UI
- [ ] ProgressManager updated with recommendation logic
- [ ] All three difficulties tested thoroughly
- [ ] Bubble positioning works for 3, 4, and 5 bubbles
- [ ] Letter case modes work correctly
- [ ] Similar letter generation works in hard mode
- [ ] Recommendation algorithm tested with varied performance
- [ ] Difficulty selection UI is clear and attractive
- [ ] All acceptance criteria met
- [ ] Tested with multiple rounds at each difficulty
- [ ] No console errors or warnings
- [ ] Smooth 60fps performance at all difficulties
- [ ] Ready for playtesting with target age group

## What's Next (Phase 20 and beyond)
- Sight words integration (extend beyond single letters)
- Adaptive difficulty that auto-adjusts during play
- Progress reports showing difficulty progression
- Unlockable hard mode (achievement system)
- Custom difficulty settings for parents/teachers
- Time challenge mode (speed rounds)
