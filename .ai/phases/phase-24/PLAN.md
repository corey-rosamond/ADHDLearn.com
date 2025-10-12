# Phase 24: Word Catch - Falling Words

## Goal
Implement falling word mechanics - words spawn at top of screen and fall slowly toward the basket

## Context
Building on Phase 23's foundation (scene and player controls), Phase 24 adds the core gameplay mechanic: falling words. This phase focuses on word spawning, gravity-based falling, and managing multiple words on screen simultaneously. Aurora will see sight words falling from the top, preparing for Phase 25 where we'll add catching and collision detection. The falling speed and spawn rate must be carefully tuned for a 5-year-old with ADHD - not too fast (overwhelming), not too slow (boring).

## Prerequisites
- Phase 1-23 completed
- WordCatchScene fully functional
- Basket controls working smoothly
- Understanding of Phaser GameObjects and timers
- Sight word list available

## Tasks

### 1. Create FallingWord Class
- Create new file: src/gameobjects/FallingWord.js
- Extend Phaser.GameObjects.Container (or Sprite)
- Constructor takes: scene, x, y, word text
- Properties: word, text object, fall speed, is caught, is missed
- Methods: fall(), destroy(), getText(), getPosition()
- Add to scene's display list

### 2. Implement Gravity/Falling Physics
- Add vertical velocity to FallingWord
- Default fall speed: 50-80 pixels/second (slow enough to read)
- Update position in scene's update() loop
- Smooth, constant falling motion
- No erratic movement or acceleration (keep it simple)
- Consider using Phaser physics or manual delta-based movement

### 3. Word Spawning System
- Create spawnWord() method in WordCatchScene
- Spawn position: random x (100-700), y = 0 (top of screen)
- Select random sight word from word list
- Create new FallingWord instance
- Add word to active words array
- Track spawned words for management

### 4. Spawn Timing Management
- Implement timer-based spawning
- Initial spawn interval: 2-3 seconds
- Use Phaser.Time.TimerEvent for spawning
- Ensure consistent spawn rate
- Spawn next word only after delay
- Prevent spawning if too many words active

### 5. Multiple Words on Screen
- Maintain array of active falling words
- Support 2-3 words on screen simultaneously
- Maximum word limit: 3 (prevents overwhelming player)
- Track each word independently
- Update all words each frame
- Manage word lifecycle (spawn to despawn)

### 6. Word Despawn at Bottom
- Detect when word reaches bottom (y > 560)
- Remove word from scene
- Remove word from active words array
- Destroy word object to free memory
- No visual glitch when word disappears
- Eventually will deduct life (Phase 25)

### 7. Sight Word Content Integration
- Create sight word list for 5-year-old level
- Include common words: I, am, the, see, can, we, me, go, to, a
- Store words in array or JSON file
- Random selection from word list
- Ensure variety (don't repeat same word consecutively)
- Consider difficulty progression (later phases)

### 8. Word Visual Styling
- Large, readable font (48-64px)
- High contrast colors (dark text on light background, or vice versa)
- Rounded background behind text (pill shape)
- Slight padding around text for readability
- Consider shadow or outline for text
- Consistent styling across all words

## Implementation Details

### FallingWord Class Structure
```javascript
// src/gameobjects/FallingWord.js
class FallingWord extends Phaser.GameObjects.Container {
    constructor(scene, x, y, word) {
        super(scene, x, y);

        this.scene = scene;
        this.word = word;
        this.fallSpeed = 60; // pixels per second
        this.isCaught = false;
        this.isMissed = false;

        // Create background
        this.background = scene.add.graphics();
        this.background.fillStyle(0xFFFFFF, 1);
        this.background.fillRoundedRect(-50, -20, 100, 40, 10);
        this.background.lineStyle(2, 0x000000, 1);
        this.background.strokeRoundedRect(-50, -20, 100, 40, 10);

        // Create text
        this.textObj = scene.add.text(0, 0, word, {
            fontSize: '32px',
            color: '#000000',
            fontFamily: 'Arial, sans-serif',
            fontStyle: 'bold'
        });
        this.textObj.setOrigin(0.5);

        // Add to container
        this.add(this.background);
        this.add(this.textObj);

        // Add to scene
        scene.add.existing(this);
    }

    fall(delta) {
        // Move down based on time delta
        const distance = (this.fallSpeed * delta) / 1000;
        this.y += distance;
    }

    hasReachedBottom(threshold = 560) {
        return this.y > threshold;
    }

    getWord() {
        return this.word;
    }

    destroy() {
        // Clean up
        this.textObj.destroy();
        this.background.destroy();
        super.destroy();
    }
}

// Export if using modules
// export default FallingWord;
```

### Word Spawning in WordCatchScene
```javascript
// In WordCatchScene.js

create() {
    // ... existing code ...

    // Initialize word system
    this.activeWords = [];
    this.maxActiveWords = 3;
    this.sightWords = [
        'I', 'am', 'the', 'see', 'can',
        'we', 'me', 'go', 'to', 'a',
        'is', 'you', 'like', 'he', 'she',
        'my', 'it', 'in', 'on', 'at'
    ];
    this.lastSpawnedWord = null;

    // Start spawning timer
    this.spawnTimer = this.time.addEvent({
        delay: 2500, // 2.5 seconds between spawns
        callback: this.spawnWord,
        callbackScope: this,
        loop: true
    });

    // Spawn first word immediately
    this.time.delayedCall(500, () => {
        this.spawnWord();
    });
}

spawnWord() {
    // Don't spawn if at max capacity
    if (this.activeWords.length >= this.maxActiveWords) {
        return;
    }

    // Select random word (avoid repeating last word)
    let word;
    do {
        word = Phaser.Utils.Array.GetRandom(this.sightWords);
    } while (word === this.lastSpawnedWord && this.sightWords.length > 1);

    this.lastSpawnedWord = word;

    // Random x position (avoid edges)
    const x = Phaser.Math.Between(100, 700);
    const y = -50; // Start above screen

    // Create falling word
    const fallingWord = new FallingWord(this, x, y, word);
    this.activeWords.push(fallingWord);
}

update(time, delta) {
    // ... existing basket movement code ...

    // Update all falling words
    this.updateFallingWords(delta);
}

updateFallingWords(delta) {
    // Update each word
    for (let i = this.activeWords.length - 1; i >= 0; i--) {
        const word = this.activeWords[i];

        // Make word fall
        word.fall(delta);

        // Check if word reached bottom
        if (word.hasReachedBottom()) {
            this.handleWordMissed(word, i);
        }
    }
}

handleWordMissed(word, index) {
    // Remove from array
    this.activeWords.splice(index, 1);

    // Destroy word object
    word.destroy();

    // TODO Phase 25: Deduct life
    console.log('Word missed:', word.getWord());
}
```

### Sight Word List (Expandable)
```javascript
// Could be in separate file: src/data/sightWords.js
const SIGHT_WORDS_LEVEL_1 = [
    // Most common sight words for kindergarten
    'I', 'a', 'am', 'an', 'and', 'at',
    'can', 'do', 'go', 'he', 'in', 'is',
    'it', 'like', 'me', 'my', 'no', 'on',
    'see', 'she', 'the', 'to', 'up', 'we'
];

const SIGHT_WORDS_LEVEL_2 = [
    // Slightly more advanced
    'are', 'be', 'but', 'for', 'get', 'has',
    'have', 'here', 'look', 'not', 'now', 'of',
    'out', 'play', 'run', 'said', 'that', 'they',
    'this', 'too', 'was', 'went', 'what', 'will',
    'with', 'yes', 'you'
];

// Export based on level
function getSightWords(level = 1) {
    switch(level) {
        case 1:
            return SIGHT_WORDS_LEVEL_1;
        case 2:
            return [...SIGHT_WORDS_LEVEL_1, ...SIGHT_WORDS_LEVEL_2];
        default:
            return SIGHT_WORDS_LEVEL_1;
    }
}
```

## Acceptance Criteria
- [ ] FallingWord.js class created in src/gameobjects/
- [ ] FallingWord class properly extends Container or Sprite
- [ ] Words spawn at top of screen at random x positions
- [ ] Words fall smoothly downward at consistent speed
- [ ] Fall speed is appropriate for 5-year-old (readable while falling)
- [ ] 2-3 words can be on screen simultaneously
- [ ] No more than 3 words spawn at once (max limit enforced)
- [ ] Words despawn when reaching bottom of screen
- [ ] Despawned words are properly destroyed (no memory leaks)
- [ ] New words spawn at regular intervals (2-3 seconds)
- [ ] Sight word list integrated with appropriate words
- [ ] Words are randomly selected from list
- [ ] Same word doesn't repeat consecutively
- [ ] Word text is large and readable (48-64px font)
- [ ] Words have clear visual styling (background, contrast)
- [ ] No performance issues with multiple words falling
- [ ] Maintains 60fps with 3 words on screen
- [ ] No console errors or warnings
- [ ] Scene remains stable with continuous word spawning

## Testing Steps

### FallingWord Class Testing
1. Load WordCatchScene
2. Manually spawn a single FallingWord
3. Verify word appears at top of screen
4. Verify word has text visible
5. Verify word has background/styling
6. Watch word fall to bottom
7. Verify smooth falling motion (no jitter)
8. Verify word despawns at bottom
9. Check console for errors

### Spawning System Testing
1. Load WordCatchScene and wait
2. Verify first word spawns within 1 second
3. Wait and verify second word spawns after 2-3 seconds
4. Wait and verify third word spawns
5. Verify no 4th word spawns (max 3 limit)
6. Wait for first word to reach bottom
7. Verify new word spawns after first despawns
8. Test for 5+ minutes of continuous spawning

### Multiple Words Testing
1. Load scene and wait for 3 words to spawn
2. Verify all 3 words fall independently
3. Verify no collision between words
4. Verify each word has different text
5. Verify words don't overlap visually
6. Verify all words despawn correctly
7. Verify spawn system continues after despawns

### Visual Testing
1. Verify word text is large and readable
2. Verify word background is visible
3. Verify sufficient contrast for readability
4. Verify words readable while in motion
5. Verify styling is consistent across all words
6. Test with different sight words
7. Verify no visual glitches or artifacts

### Performance Testing
1. Let game run for 5 minutes
2. Monitor frame rate (should stay at 60fps)
3. Check memory usage in DevTools
4. Verify no memory leaks
5. Verify no performance degradation
6. Test CPU usage remains reasonable
7. Check for any stuttering or lag

### Content Testing
1. Observe 20+ spawned words
2. Verify variety in words spawned
3. Verify words are appropriate for 5-year-old
4. Verify no consecutive duplicate words
5. Verify all words in list can spawn
6. Check spelling of all words
7. Verify words are actual sight words

### Edge Case Testing
1. Start scene and immediately exit - no errors
2. Spawn many words by waiting - verify max limit
3. Test with very fast spawn rate - verify stability
4. Test with very slow fall speed - verify readability
5. Resize browser window - verify words still fall correctly

## Estimated Time
1 hour

## Dependencies
- Phase 23 completed (WordCatchScene and basket controls)
- Sight word list prepared
- Understanding of Phaser Container or Sprite GameObjects
- Timer and event system knowledge

## Risks
- **Fall speed too fast**: Words unreadable for Aurora
  - Mitigation: Make speed easily configurable, test with Aurora
- **Fall speed too slow**: Game becomes boring
  - Mitigation: Test and adjust, consider difficulty progression
- **Spawn rate too high**: Overwhelming for player
  - Mitigation: Enforce max word limit (3), adjust spawn interval
- **Spawn rate too low**: Game feels empty
  - Mitigation: Start spawning immediately, reduce initial interval
- **Text readability issues**: Hard to read while falling
  - Mitigation: Large font, high contrast, background styling
- **Performance problems**: Multiple words cause lag
  - Mitigation: Optimize word creation, limit max words, test performance
- **Memory leaks**: Words not properly destroyed
  - Mitigation: Careful cleanup in destroy(), test with DevTools

## Notes
- **No collision detection yet**: Phase 24 is just falling, catching comes in Phase 25
- **Keep it simple**: Linear falling motion, no fancy physics
- **Readability is key**: Words must be readable while moving
- **Test with Aurora**: Fall speed and spawn rate must feel right for her
- **Sight word selection**: Use kindergarten-appropriate words
- **Visual clarity**: Clear, simple styling for words
- **Performance matters**: Must maintain 60fps with 3 words
- **Prepare for next phase**: Code structure should support collision detection
- **Don't overcomplicate**: Basic falling mechanics first, polish later

## Completion Checklist
- [ ] FallingWord.js created and tested
- [ ] FallingWord class properly structured
- [ ] Gravity/falling physics implemented
- [ ] Words fall smoothly at appropriate speed
- [ ] Spawn system implemented in WordCatchScene
- [ ] Spawn timing works (2-3 seconds between spawns)
- [ ] Multiple words supported (2-3 on screen)
- [ ] Max word limit enforced (no more than 3)
- [ ] Words despawn at bottom correctly
- [ ] Despawn cleanup prevents memory leaks
- [ ] Sight word list integrated
- [ ] Random word selection working
- [ ] No consecutive duplicate words
- [ ] Word visual styling implemented
- [ ] Text large, readable, high contrast
- [ ] All acceptance criteria met
- [ ] All testing steps completed
- [ ] Performance verified (60fps maintained)
- [ ] No console errors
- [ ] Aurora tested and confirmed readability
- [ ] Ready for Phase 25 (collision detection)
