# Phase 26: Word Catch - Target Word Logic

## Goal
Implement target word system with audio callout, correct/incorrect feedback, and 10-word round completion logic

## Context
Phase 26 transforms Word Catch from a simple catching game into an educational sight word recognition game. The game will call out a target word ("Catch the word 'cat'!"), and Aurora must catch the correct word while avoiding incorrect words. This phase implements the core learning mechanic of Word Catch, similar to Letter Pop's target letter system but adapted for sight words.

Critical design consideration: ADHD-friendly feedback means celebrating correct catches enthusiastically while handling incorrect catches with gentle, non-punitive "oops" feedback. No harsh sounds, no red X marks, no negative reinforcement - just gentle redirection.

## Prerequisites
- Phase 1-25 completed
- Collision detection working reliably
- Word catching with particles and audio functional
- Sight word data loaded from JSON
- Audio files for target callouts prepared

## Tasks

### 1. Implement Target Word Selection
Choose a random sight word as the target for each round

**Requirements:**
- Select target word from loaded sight word list
- Avoid repeating same target twice in a row
- Track which words have been targets (for variety)
- Store target word for validation
- Reset target after successful catch

**Implementation:**
```javascript
selectTargetWord() {
    const contentProvider = ContentProvider.getInstance();
    let targetWord;

    do {
        targetWord = contentProvider.getRandomWord();
    } while (targetWord.id === this.lastTargetId && contentProvider.getWordCount() > 1);

    this.lastTargetId = targetWord.id;
    this.currentTarget = targetWord;

    console.log(`New target: ${targetWord.word}`);
    return targetWord;
}
```

### 2. Play Target Word Callout Audio
Audio announces "Catch the word [target]!"

**Requirements:**
- Play callout at start of each target
- Clear, child-friendly voice
- Appropriate volume (not startling)
- Wait for callout to complete before spawning words
- Visual indicator shows target word during callout

**Callout timing:**
1. Target selected
2. Audio plays: "Catch the word 'cat'!"
3. Visual text displays target word
4. Brief pause (500ms) after audio
5. Words begin spawning

**Implementation:**
```javascript
announceTargetWord(targetWord) {
    // Show visual target
    this.targetText.setText(`Catch: ${targetWord.word}`);
    this.targetText.setVisible(true);

    // Play callout audio
    const calloutKey = `callout_${targetWord.id}`;
    if (this.sound.get(calloutKey)) {
        const callout = this.sound.play(calloutKey, { volume: 0.9 });

        // Start spawning after callout finishes
        callout.once('complete', () => {
            this.time.delayedCall(500, () => {
                this.startSpawningWords();
            });
        });
    } else {
        // Fallback: start immediately
        console.warn(`Callout audio not found: ${calloutKey}`);
        this.startSpawningWords();
    }
}
```

### 3. Spawn Mix of Target and Distractor Words
Generate word pool with target + incorrect words

**Requirements:**
- Each round includes target word (can appear multiple times)
- Include 5-8 distractor words (incorrect words)
- Balance: ~30-40% of spawned words are target
- Distractors should be visually similar or from same category
- Fair distribution ensures target appears regularly

**Word pool generation:**
```javascript
generateWordPool(targetWord, poolSize = 10) {
    const contentProvider = ContentProvider.getInstance();
    const pool = [];

    // Add target word 3-4 times
    const targetCount = Math.floor(poolSize * 0.35);
    for (let i = 0; i < targetCount; i++) {
        pool.push(targetWord);
    }

    // Add distractor words
    const distractorCount = poolSize - targetCount;
    const distractors = contentProvider.getRandomWords(distractorCount, [targetWord.id]);
    pool.push(...distractors);

    // Shuffle pool
    return Phaser.Utils.Array.Shuffle(pool);
}
```

### 4. Validate Catch Against Target Word
Check if caught word matches target

**Requirements:**
- Compare caught word ID to target word ID
- Case-insensitive comparison
- Handle null/undefined gracefully
- Return boolean: correct or incorrect
- Log validation for debugging

**Implementation:**
```javascript
validateCatch(caughtWord) {
    if (!this.currentTarget) {
        console.warn('No target word set');
        return false;
    }

    const isCorrect = caughtWord.id === this.currentTarget.id;
    console.log(`Catch validation: ${caughtWord.word} vs ${this.currentTarget.word} = ${isCorrect}`);

    return isCorrect;
}
```

### 5. Implement Correct Catch Celebration
Enthusiastic positive feedback for catching target word

**Requirements:**
- Special particle effect (more particles, brighter colors)
- Celebration sound effect (cheer, chime, success sound)
- Visual text: "Great job!" or "You got it!"
- Brief animation (scale pulse, star burst)
- Score increment
- Move to next target word

**Celebration effect:**
```javascript
celebrateCorrectCatch(word) {
    // Enhanced particles
    this.createCelebrationParticles(word.x, word.y);

    // Play celebration sound
    const celebrations = ['cheer1', 'cheer2', 'success1'];
    const randomCheer = Phaser.Math.RND.pick(celebrations);
    this.sound.play(randomCheer, { volume: 0.8 });

    // Show encouragement text
    this.showFeedbackText('Great job!', word.x, word.y, 0x00FF00);

    // Increment score
    this.score += 10;
    this.updateScoreDisplay();

    // Track correct catch
    this.correctCatches++;
    this.trackCaughtWord(word.wordData, true);

    // Check if round complete
    if (this.correctCatches >= this.wordsPerRound) {
        this.completeRound();
    } else {
        // Next target after brief delay
        this.time.delayedCall(1500, () => {
            this.selectAndAnnounceNextTarget();
        });
    }
}
```

### 6. Implement Incorrect Catch Feedback
Gentle, non-punitive feedback for catching wrong word

**ADHD-Friendly Requirements:**
- NO harsh sounds (no buzzers, error sounds, negative tones)
- NO red X marks or visual punishment
- Gentle "oops" or "try again" audio in friendly voice
- Neutral particle effect (subtle, not alarming)
- Encourage trying again: "That was [word]. Let's find [target]!"
- No score penalty (non-punitive)
- Keep playing - no interruption to flow

**Implementation:**
```javascript
handleIncorrectCatch(word) {
    // Gentle neutral particles
    this.createNeutralParticles(word.x, word.y);

    // Gentle "oops" sound (friendly, not harsh)
    const oopsSounds = ['oops1', 'tryagain1', 'almostthere1'];
    const randomOops = Phaser.Math.RND.pick(oopsSounds);
    this.sound.play(randomOops, { volume: 0.6 }); // Lower volume

    // Educational feedback (optional, not overwhelming)
    // "That was [word]. Let's find [target]!"
    // Can implement in future phase if desired

    // Show gentle feedback text
    this.showFeedbackText('Try again!', word.x, word.y, 0xFFAA00); // Orange, not red

    // Track incorrect catch (for analytics, not scoring)
    this.trackCaughtWord(word.wordData, false);

    // NO score penalty
    // NO game interruption
    // Target word stays the same - keep looking!
}
```

### 7. Implement 10-Word Round Completion
Complete round after catching 10 target words

**Requirements:**
- Track correct catches: increment on each target catch
- Round completes when correctCatches >= 10
- Celebrate round completion (big celebration)
- Show round summary (optional: words caught, time taken)
- Transition to next round or end game

**Round completion:**
```javascript
completeRound() {
    console.log('Round complete!');

    // Stop spawning new words
    this.stopSpawning();

    // Clear remaining words from screen
    this.clearAllWords();

    // Big celebration
    this.playRoundCompleteAnimation();

    // Play celebration audio
    this.sound.play('roundComplete', { volume: 0.9 });

    // Show round complete screen
    this.showRoundSummary();

    // After delay, start next round or end game
    this.time.delayedCall(3000, () => {
        this.currentRound++;

        if (this.currentRound <= this.maxRounds) {
            this.startNewRound();
        } else {
            this.endGame();
        }
    });
}
```

### 8. Display Target Word Indicator
Show current target word on screen

**Requirements:**
- Persistent UI element showing target word
- Clear, large text (readable from gameplay distance)
- Positioned at top of screen (doesn't obscure gameplay)
- Updates when target changes
- Optional: icon or visual representation

**Visual design:**
```javascript
createTargetDisplay() {
    // Background panel
    this.targetPanel = this.add.rectangle(400, 50, 300, 80, 0x2244AA, 0.9);
    this.targetPanel.setStrokeStyle(4, 0xFFFFFF);

    // Label text
    this.targetLabel = this.add.text(400, 35, 'Catch:', {
        fontSize: '24px',
        color: '#FFFFFF',
        fontFamily: 'Arial',
        fontStyle: 'bold'
    }).setOrigin(0.5);

    // Target word text (larger)
    this.targetText = this.add.text(400, 65, '', {
        fontSize: '36px',
        color: '#FFFF00',
        fontFamily: 'Arial',
        fontStyle: 'bold'
    }).setOrigin(0.5);
}

updateTargetDisplay(targetWord) {
    this.targetText.setText(targetWord.word);

    // Pulse animation to draw attention
    this.tweens.add({
        targets: this.targetText,
        scaleX: 1.2,
        scaleY: 1.2,
        duration: 200,
        yoyo: true,
        ease: 'Sine.easeInOut'
    });
}
```

### 9. Track Round Progress
Display progress toward 10-word goal

**Requirements:**
- Show correct catches: "5 / 10"
- Visual progress bar (optional)
- Updates immediately on correct catch
- Clear and motivating
- Positioned near target display

**Implementation:**
```javascript
createProgressDisplay() {
    this.progressText = this.add.text(700, 50, '0 / 10', {
        fontSize: '28px',
        color: '#FFFFFF',
        fontFamily: 'Arial',
        fontStyle: 'bold'
    }).setOrigin(0.5);
}

updateProgressDisplay() {
    this.progressText.setText(`${this.correctCatches} / ${this.wordsPerRound}`);

    // Animate on update
    this.tweens.add({
        targets: this.progressText,
        scaleX: 1.3,
        scaleY: 1.3,
        duration: 150,
        yoyo: true,
        ease: 'Back.easeOut'
    });
}
```

## Implementation Details

### Complete Target Word System
```javascript
class WordCatchScene extends Phaser.Scene {
    constructor() {
        super({ key: 'WordCatchScene' });

        // Target word tracking
        this.currentTarget = null;
        this.lastTargetId = null;
        this.targetPool = [];

        // Round tracking
        this.currentRound = 1;
        this.maxRounds = 3;
        this.wordsPerRound = 10;
        this.correctCatches = 0;
        this.incorrectCatches = 0;

        // UI elements
        this.targetText = null;
        this.progressText = null;
    }

    create() {
        // Create UI
        this.createTargetDisplay();
        this.createProgressDisplay();

        // Start first round
        this.startNewRound();
    }

    startNewRound() {
        console.log(`Starting round ${this.currentRound}`);

        // Reset tracking
        this.correctCatches = 0;
        this.incorrectCatches = 0;

        // Select first target
        this.selectAndAnnounceNextTarget();
    }

    selectAndAnnounceNextTarget() {
        // Select target word
        const targetWord = this.selectTargetWord();

        // Update display
        this.updateTargetDisplay(targetWord);

        // Announce target
        this.announceTargetWord(targetWord);

        // Generate word pool
        this.targetPool = this.generateWordPool(targetWord, 20);
    }

    handleWordCatch(character, word) {
        if (!word.active) return;

        const wordData = word.wordData;
        const isCorrect = this.validateCatch(wordData);

        if (isCorrect) {
            this.celebrateCorrectCatch(word);
        } else {
            this.handleIncorrectCatch(word);
        }

        // Common catch handling
        this.removeCaughtWord(word);
    }

    // ... other methods from previous sections
}
```

## Acceptance Criteria
- [ ] Target word selected randomly at start of each target
- [ ] Target word callout audio plays clearly
- [ ] Visual display shows current target word
- [ ] Words spawn with mix of target and distractors (~35% target)
- [ ] Caught word validated against target correctly
- [ ] Correct catch triggers celebration effect
- [ ] Correct catch plays enthusiastic cheer sound
- [ ] Correct catch increments score and progress
- [ ] Incorrect catch triggers gentle "oops" feedback
- [ ] Incorrect catch is non-punitive (no score penalty, no harsh sounds)
- [ ] Incorrect catch feedback is ADHD-friendly
- [ ] Target display updates when new target selected
- [ ] Progress display shows "X / 10" correctly
- [ ] Round completes after 10 correct catches
- [ ] Round completion celebration plays
- [ ] Multiple rounds work correctly (3 rounds)
- [ ] Game logic is correct (no bugs)
- [ ] Console logs validation for debugging
- [ ] All edge cases handled gracefully

## Testing Steps

### Target Word Selection
1. Start game and observe first target word
2. Complete target and verify new target selected
3. Play multiple rounds, verify no immediate repeats
4. Check console for target selection logs

### Audio Callout
1. Start game and listen for "Catch the word [target]"
2. Verify audio is clear and appropriate volume
3. Verify words don't spawn during callout
4. Test with missing audio (should not crash)

### Correct Catch Testing
1. Catch the target word
2. Verify celebration particles (bright, more particles)
3. Verify cheer sound plays
4. Verify "Great job!" text appears
5. Verify score increments
6. Verify progress updates (1/10, 2/10, etc.)
7. Verify new target selected after delay

### Incorrect Catch Testing
1. Catch a non-target word
2. Verify gentle "oops" sound (not harsh)
3. Verify neutral particles (subtle)
4. Verify "Try again!" text (orange, not red)
5. Verify NO score penalty
6. Verify target stays the same
7. Verify no harsh visual feedback

### Round Completion Testing
1. Catch 10 target words in one round
2. Verify round complete celebration
3. Verify summary screen (optional)
4. Verify next round starts
5. Verify progress resets to 0/10
6. Verify round counter increments

### ADHD-Friendly Validation
1. Verify incorrect feedback is gentle
2. Verify no harsh sounds
3. Verify no red X or negative visuals
4. Verify no game interruption on incorrect catch
5. Verify encouragement, not punishment
6. Test with Aurora - get feedback on feel

### Edge Cases
1. Catch target word multiple times rapidly
2. Catch incorrect word multiple times rapidly
3. Catch last word of round (10th)
4. Test with only 1 word in database
5. Test with missing callout audio
6. Test with missing celebration audio

## Estimated Time
1.5 hours

## Dependencies
- Phase 25 completed (collision detection)
- Sight word data loaded from JSON
- Target word callout audio files
- Celebration sound effects
- Gentle "oops" sound effects
- Round complete audio

## Risks
- **Audio files missing**: Callouts or feedback sounds not loaded
  - Mitigation: Graceful fallback, visual-only mode
- **Feedback too harsh**: Aurora finds incorrect catch discouraging
  - Mitigation: Test with Aurora, soften feedback as needed
- **Target too hard**: Distractors are confusing
  - Mitigation: Adjust distractor selection, make visually distinct
- **Round too long**: 10 words feels tedious
  - Mitigation: Consider reducing to 8 words based on playtesting
- **Audio overlap**: Callouts and catch audio conflict
  - Mitigation: Priority system, duck background audio

## ADHD-Friendly Design Notes

**Why Non-Punitive Feedback?**
- Children with ADHD often have rejection sensitivity
- Harsh negative feedback can trigger frustration and disengagement
- Gentle redirection maintains motivation
- Focus on celebrating success, not punishing failure
- "Try again" is encouraging, not discouraging

**Audio Design:**
- Callout is clear and friendly
- Celebration is enthusiastic (reward dopamine)
- "Oops" is gentle and brief
- Lower volume on incorrect feedback
- Never use harsh buzzer or error sounds

**Visual Design:**
- Orange (neutral) instead of red (negative) for incorrect
- Celebration particles are bright and exciting
- Neutral particles are subtle, not alarming
- Target display is always visible (reduces memory load)
- Progress display is motivating

**Gameplay Flow:**
- Incorrect catch doesn't interrupt flow
- Target stays same - keep trying
- No time pressure (ADHD-friendly pacing)
- Celebration moments provide dopamine hits
- Round length appropriate for attention span

## Notes
- Similar to Letter Pop's target letter system
- Adapted for sight words instead of single letters
- More complex validation (whole words vs single letters)
- ADHD-friendly feedback is critical for target age
- Test extensively with Aurora to validate feel
- Audio quality and timing are critical for learning
- Balance target frequency (not too easy, not too hard)
- Consider adaptive difficulty in future phases
- Round completion is major motivation milestone
- Celebrate Aurora's success!

## Completion Checklist
- [ ] Target word selection implemented
- [ ] Target word callout audio plays
- [ ] Visual target display created
- [ ] Word pool generation with target + distractors
- [ ] Catch validation working correctly
- [ ] Correct catch celebration implemented
- [ ] Incorrect catch gentle feedback implemented
- [ ] Progress tracking (X / 10) working
- [ ] Round completion logic working
- [ ] Round celebration animation complete
- [ ] Multiple rounds working (3 rounds)
- [ ] All UI elements positioned correctly
- [ ] All audio working (callout, cheer, oops)
- [ ] ADHD-friendly feedback validated
- [ ] Edge cases tested and handled
- [ ] Console logging for debugging
- [ ] Performance stable (60fps)
- [ ] No bugs in game logic
- [ ] Ready for Phase 27 (polish and refinement)
