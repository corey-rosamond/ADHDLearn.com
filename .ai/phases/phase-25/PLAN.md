# Phase 25: Word Catch - Collision Detection

## Goal
Implement reliable collision detection between character and falling words with satisfying visual and audio feedback

## Context
Phase 25 introduces the core mechanic of Word Catch - catching falling sight words with Aurora's character. This phase builds on the word spawning and character movement systems from Phase 24, adding the critical collision detection that makes the game interactive. When a word collides with the character, it should disappear with a satisfying particle effect, play the word's audio, and be tracked for scoring.

This is the foundation for Phase 26's target word logic. The collision system must be reliable, responsive, and provide clear feedback to maintain engagement for children with ADHD.

## Prerequisites
- Phase 1-24 completed
- Word Catch scene functional with spawning words
- Character movement implemented and responsive
- Word sprites falling at appropriate speed
- Audio system from Letter Pop integrated

## Tasks

### 1. Implement Phaser Collision Detection
Set up overlap detection between character and word sprites

**Approach:**
- Use Phaser's `overlap()` method for collision detection
- Alternative: Use `intersects()` for more precise detection
- Check collision in `update()` loop
- Consider character hitbox size for ADHD-friendly collision (slightly larger than visual)

**Implementation considerations:**
```javascript
// In WordCatchScene update() method
update() {
    // Check overlap between character and each word
    this.physics.overlap(
        this.character,
        this.wordsGroup,
        this.onWordCatch,
        null,
        this
    );
}

onWordCatch(character, word) {
    // Handle collision
    this.catchWord(word);
}
```

### 2. Create Word Catch Handler
Implement the core catch logic

**Steps:**
1. Detect collision between character and word
2. Extract word data from sprite
3. Trigger catch effect (particles, audio)
4. Remove word from screen
5. Update tracking/scoring
6. Log catch event for debugging

**Required functionality:**
- Validate collision is legitimate (not already caught)
- Prevent double-catching same word
- Handle rapid multiple catches
- Clean up word sprite properly

### 3. Implement Catch Particle Effect
Create satisfying visual feedback when word is caught

**Requirements:**
- Particle explosion at catch point
- Particles should match game theme (stars, sparkles)
- Color scheme should be positive and rewarding
- Effect should be brief (300-500ms)
- Should not obscure other falling words
- Must be performant (maintain 60fps)

**Particle configuration:**
```javascript
createCatchParticles(x, y) {
    const emitter = this.add.particles(x, y, 'particle', {
        speed: { min: 100, max: 200 },
        angle: { min: 0, max: 360 },
        scale: { start: 0.8, end: 0 },
        alpha: { start: 1, end: 0 },
        tint: [0xFFD700, 0xFFA500, 0xFFFF00], // Gold/yellow theme
        lifespan: 400,
        gravityY: 150,
        quantity: 12,
        blendMode: 'ADD'
    });

    emitter.explode();

    // Cleanup
    this.time.delayedCall(500, () => {
        emitter.destroy();
    });
}
```

### 4. Play Word Audio on Catch
Trigger audio pronunciation when word is caught

**Requirements:**
- Audio plays immediately on catch (< 50ms delay)
- Audio path loaded from word data
- Handle missing audio gracefully
- Don't overlap if multiple words caught rapidly
- Audio volume appropriate for target age
- Audio should be clear and encouraging

**Implementation:**
```javascript
playWordAudio(wordData) {
    if (wordData.audioPath && this.sound.get(wordData.audioKey)) {
        this.sound.play(wordData.audioKey, {
            volume: 0.8
        });
    } else {
        console.warn(`Audio not found for word: ${wordData.word}`);
    }
}
```

### 5. Track Caught Words
Maintain list of caught words for scoring and game logic

**Data to track:**
- Word text (string)
- Catch timestamp
- Whether it was the target word (Phase 26)
- Position where caught
- Current round number

**Implementation:**
```javascript
constructor() {
    super({ key: 'WordCatchScene' });
    this.caughtWords = [];
    this.currentRoundCatches = 0;
}

trackCaughtWord(wordData, wasTarget = false) {
    this.caughtWords.push({
        word: wordData.word,
        timestamp: Date.now(),
        wasTarget: wasTarget,
        position: { x: wordData.x, y: wordData.y },
        round: this.currentRound
    });

    this.currentRoundCatches++;

    console.log(`Caught: ${wordData.word} (Total: ${this.caughtWords.length})`);
}
```

### 6. Remove Caught Word from Screen
Clean up word sprite after catch

**Steps:**
1. Play catch animation (scale down, fade out)
2. Disable word physics/collision
3. Remove from active words group
4. Destroy sprite after animation
5. Clean up any references

**Animation example:**
```javascript
removeCaughtWord(word) {
    // Prevent double-catch
    word.setActive(false);
    word.disableBody(true, false);

    // Catch animation
    this.tweens.add({
        targets: word,
        scaleX: 1.3,
        scaleY: 1.3,
        alpha: 0,
        duration: 200,
        ease: 'Power2',
        onComplete: () => {
            word.destroy();
        }
    });
}
```

### 7. Test Collision Reliability
Verify collision detection works consistently

**Test scenarios:**
- Catch word with center of character
- Catch word with edge of character
- Catch multiple words in quick succession
- Character moving while catching
- Character stationary while catching
- Word caught at different fall speeds
- Rapid left-right movement during catch
- Words caught near screen edges

**Edge cases:**
- Two words overlapping when caught
- Word caught during spawn animation
- Word caught at very bottom of screen
- Collision during scene transition

### 8. Optimize Performance
Ensure collision detection doesn't impact framerate

**Optimization strategies:**
- Use physics groups for efficient collision
- Limit collision checks to active words only
- Disable collision on caught words immediately
- Pool and reuse particle emitters
- Limit max words on screen
- Profile performance during heavy gameplay

**Performance targets:**
- Maintain 60fps with 5+ words on screen
- No dropped frames during catch
- Smooth particle effects
- No audio stuttering

## Implementation Details

### Complete Collision System
```javascript
class WordCatchScene extends Phaser.Scene {
    constructor() {
        super({ key: 'WordCatchScene' });
        this.character = null;
        this.wordsGroup = null;
        this.caughtWords = [];
        this.currentRoundCatches = 0;
    }

    create() {
        // Create physics groups
        this.wordsGroup = this.physics.add.group();

        // Create character with physics
        this.character = this.physics.add.sprite(400, 500, 'character');
        this.character.setCollideWorldBounds(true);

        // Setup collision detection
        this.physics.add.overlap(
            this.character,
            this.wordsGroup,
            this.handleWordCatch,
            null,
            this
        );
    }

    spawnWord(wordData) {
        const x = Phaser.Math.Between(100, 700);
        const y = -50;

        const word = this.wordsGroup.create(x, y, 'wordBubble');
        word.wordData = wordData;
        word.setVelocityY(100); // Fall speed

        // Add word text
        const text = this.add.text(x, y, wordData.word, {
            fontSize: '32px',
            color: '#ffffff',
            fontFamily: 'Arial',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        word.textRef = text;

        return word;
    }

    handleWordCatch(character, word) {
        // Prevent double-catch
        if (!word.active) return;

        const wordData = word.wordData;

        // Visual feedback
        this.createCatchParticles(word.x, word.y);

        // Audio feedback
        this.playWordAudio(wordData);

        // Track catch
        this.trackCaughtWord(wordData);

        // Remove word
        this.removeCaughtWord(word);
    }

    createCatchParticles(x, y) {
        const emitter = this.add.particles(x, y, 'particle', {
            speed: { min: 100, max: 200 },
            angle: { min: 0, max: 360 },
            scale: { start: 0.8, end: 0 },
            alpha: { start: 1, end: 0 },
            tint: [0xFFD700, 0xFFA500, 0xFFFF00],
            lifespan: 400,
            gravityY: 150,
            quantity: 12,
            blendMode: 'ADD'
        });

        emitter.explode();

        this.time.delayedCall(500, () => {
            emitter.destroy();
        });
    }

    playWordAudio(wordData) {
        if (wordData.audioKey && this.sound.get(wordData.audioKey)) {
            this.sound.play(wordData.audioKey, {
                volume: 0.8
            });
        }
    }

    trackCaughtWord(wordData, wasTarget = false) {
        this.caughtWords.push({
            word: wordData.word,
            timestamp: Date.now(),
            wasTarget: wasTarget,
            position: { x: wordData.x, y: wordData.y }
        });

        this.currentRoundCatches++;
        console.log(`Caught: ${wordData.word}`);
    }

    removeCaughtWord(word) {
        // Disable physics
        word.setActive(false);
        word.disableBody(true, false);

        // Animate out
        this.tweens.add({
            targets: [word, word.textRef],
            scaleX: 1.3,
            scaleY: 1.3,
            alpha: 0,
            duration: 200,
            ease: 'Power2',
            onComplete: () => {
                word.textRef.destroy();
                word.destroy();
            }
        });
    }

    update() {
        // Collision is handled by physics.add.overlap in create()
        // Remove words that fell off screen
        this.wordsGroup.children.each((word) => {
            if (word.y > 650) {
                if (word.textRef) word.textRef.destroy();
                word.destroy();
            }
        });
    }
}
```

## Acceptance Criteria
- [ ] Collision detection reliably triggers when character touches word
- [ ] Collision uses ADHD-friendly hitbox (slightly generous)
- [ ] Caught word immediately disappears from screen
- [ ] Particle effect plays at catch location
- [ ] Particles are visually appealing and brief
- [ ] Word audio plays when caught
- [ ] Audio timing is immediate (< 50ms)
- [ ] Caught words are tracked in array
- [ ] Multiple rapid catches work correctly
- [ ] No double-catching of same word
- [ ] Word sprite and text cleaned up properly
- [ ] No memory leaks from particles or sprites
- [ ] Performance maintained at 60fps with 5+ words
- [ ] Collision works at screen edges
- [ ] Collision works during character movement
- [ ] Visual feedback is clear and satisfying
- [ ] Audio doesn't clip or overlap harshly
- [ ] Console logs successful catches for debugging
- [ ] All edge cases handled gracefully

## Testing Steps

### Basic Collision Testing
1. Launch Word Catch scene
2. Wait for word to spawn
3. Move character under falling word
4. Verify collision triggers when they touch
5. Confirm word disappears
6. Check particle effect appears
7. Listen for word audio
8. Verify console logs the catch

### Edge Case Testing
1. Catch word with left edge of character
2. Catch word with right edge of character
3. Catch word at bottom of screen
4. Catch multiple words rapidly (3+ in 2 seconds)
5. Catch word while moving left
6. Catch word while moving right
7. Catch two overlapping words
8. Let word fall without catching (verify no collision)

### Performance Testing
1. Spawn 5 words simultaneously
2. Catch all 5 rapidly
3. Monitor FPS counter (should stay 60fps)
4. Check memory usage (stable)
5. Play for 5 minutes continuously
6. Verify no performance degradation
7. Check particle cleanup (no lingering emitters)
8. Verify audio doesn't stutter

### Audio Testing
1. Catch word and verify audio plays
2. Catch 3 words rapidly, check audio doesn't clip
3. Test with missing audio file (should not crash)
4. Verify audio volume is appropriate
5. Test audio with headphones and speakers

## Estimated Time
1.5 hours

## Dependencies
- Phase 24 completed (word spawning, character movement)
- Phaser physics system configured
- Word data with audio paths
- Particle sprite/texture loaded
- Audio files loaded in preload

## Risks
- **Collision detection too strict**: Character must be perfectly aligned
  - Mitigation: Use slightly larger hitbox than visual sprite
- **Collision detection too loose**: Words caught from too far away
  - Mitigation: Test and tune hitbox size with Aurora
- **Performance issues**: Too many particles
  - Mitigation: Limit particle count, optimize emitters
- **Audio overlap**: Multiple catches create audio chaos
  - Mitigation: Implement audio queue or limit simultaneous sounds
- **Double-catching**: Same word caught multiple times
  - Mitigation: Disable word immediately on first catch
- **Memory leaks**: Particles not cleaned up
  - Mitigation: Set timers to destroy emitters, monitor memory

## Notes
- Collision hitbox should be ADHD-friendly (slightly generous)
- Visual feedback is critical for engagement
- Audio timing must be immediate for cause-effect clarity
- Particle effects should be rewarding but not overwhelming
- Performance is non-negotiable (60fps target)
- Track all catches for Phase 26 target word logic
- Consider haptic feedback for mobile (future phase)
- Log catches for debugging and analytics
- Test with target user (Aurora) to validate feel
- Collision detection sets the tone for entire game

## Completion Checklist
- [ ] Phaser overlap/collision detection implemented
- [ ] Collision triggers reliably in all scenarios
- [ ] Catch handler function complete
- [ ] Particle effect created and optimized
- [ ] Word audio plays on catch
- [ ] Audio timing is immediate
- [ ] Caught words tracked in array
- [ ] Word removal animation implemented
- [ ] Sprite cleanup working correctly
- [ ] No memory leaks detected
- [ ] Performance tested (60fps maintained)
- [ ] Edge cases tested and handled
- [ ] ADHD-friendly hitbox tuned
- [ ] Console logging for debugging
- [ ] Visual feedback clear and satisfying
- [ ] Audio feedback appropriate
- [ ] All acceptance criteria met
- [ ] Ready for Phase 26 (target word logic)
