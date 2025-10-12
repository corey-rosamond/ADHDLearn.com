# Phase 16: Encouragement Audio System - BDD Scenarios

## Feature: Encouragement Audio for Correct Answers

```gherkin
Feature: Verbal Positive Reinforcement System
  As Aurora (a 5-year-old with ADHD)
  I want to hear different encouraging words when I answer correctly
  So that I feel celebrated, motivated, and confident in my learning

Background:
  Given the game is loaded
  And 10 encouragement audio files exist in assets/audio/encouragement/
  And all encouragement files are loaded successfully
  And EncouragementQueue is initialized
  And LetterPopScene is active
```

## Scenario: Encouragement Audio Files Loaded

```gherkin
Scenario: All encouragement files load successfully
  Given I am in the PreloadScene
  When the preload() method executes
  Then audio file 'encouragement-1' should be loaded
  And audio file 'encouragement-2' should be loaded
  And audio file 'encouragement-3' should be loaded
  And audio file 'encouragement-4' should be loaded
  And audio file 'encouragement-5' should be loaded
  And audio file 'encouragement-6' should be loaded
  And audio file 'encouragement-7' should be loaded
  And audio file 'encouragement-8' should be loaded
  And audio file 'encouragement-9' should be loaded
  And audio file 'encouragement-10' should be loaded
  And all files should be cached in the audio system
  And no loading errors should appear in console
```

## Scenario: Queue Initialization

```gherkin
Scenario: EncouragementQueue initializes correctly
  Given LetterPopScene is created
  When new EncouragementQueue(this) is called
  Then the queue should contain 10 encouragement keys
  And the queue should be shuffled in random order
  And lastPlayed should be null initially
  And playHistory should be an empty array
  And the queue should be ready to provide encouragements
```

## Scenario: Play First Encouragement

```gherkin
Scenario: First correct answer plays encouragement
  Given I am on letter "A" with bubbles
  And no encouragements have been played yet
  When I click the correct bubble
  Then the correct sound should play immediately
  And after 400 milliseconds delay
  Then an encouragement should play
  And the encouragement should be one of the 10 loaded files
  And I should hear verbal praise (e.g., "Great job!")
```

## Scenario: Different Encouragement Each Time

```gherkin
Scenario: Sequential correct answers have varied encouragement
  Given I am playing a round of Letter Pop
  When I answer the first letter correctly
  Then encouragement A should play (e.g., "Great job!")
  When I answer the second letter correctly
  Then encouragement B should play (different from A)
  When I answer the third letter correctly
  Then encouragement C should play (different from A and B)
  And over 10 correct answers
  Then I should hear at least 8-10 different encouragements
```

## Scenario: Queue Refill

```gherkin
Scenario: Queue refills when empty
  Given I have answered 10 letters correctly
  And the encouragement queue is now empty
  When I start a new round and answer correctly
  Then the queue should automatically refill
  And the queue should be reshuffled with all 10 encouragements
  And the first encouragement of new queue should not match last played
  And variety should continue seamlessly into new round
```

## Scenario: Anti-Repetition Logic

```gherkin
Scenario: Same encouragement doesn't play twice in a row
  Given I have just heard encouragement "Awesome!" (encouragement-7)
  And encouragement-7 is stored as lastPlayed
  When the queue is refilled
  And the shuffled queue happens to have encouragement-7 first
  Then the queue should swap encouragement-7 to end of queue
  And the next encouragement played should be different
  And I should never hear the same encouragement consecutively
```

## Scenario: Audio Timing with Correct Sound

```gherkin
Scenario: Encouragement plays after correct sound
  Given I click the correct bubble at time T=0
  When the correct answer is registered
  Then at T=0ms the correct sound should start playing
  And the correct sound should play for approximately 200-300ms
  And at T=400ms the encouragement should start playing
  And the encouragement should play for approximately 1000-2000ms
  And the timing should feel natural and not rushed
  And there should be no audio overlap or cutting off
```

## Scenario: Audio Coordination with Visual Effects

```gherkin
Scenario: Encouragement coordinates with particle effects
  Given I click the correct bubble
  When the correct answer is registered
  Then particles should burst immediately at T=0ms
  And correct sound should play at T=0ms
  And encouragement should play at T=400ms
  And bubble should tween out from T=0 to T=300ms
  And next letter should appear at T=1000ms
  And particles should continue animating until T=1500ms
  And encouragement audio should not be blocked by visual effects
```

## Scenario: Multiple Rapid Correct Answers

```gherkin
Scenario: Rapid answers trigger multiple encouragements
  Given I answer 3 letters correctly in quick succession
  When first answer is correct at T=0ms
  Then first encouragement starts at T=400ms
  When second answer is correct at T=1200ms
  Then second encouragement starts at T=1600ms
  When third answer is correct at T=2400ms
  Then third encouragement starts at T=2800ms
  And all three encouragements should be different
  And all audio should play without glitches
```

## Scenario: No Encouragement on Incorrect Answer

```gherkin
Scenario: Incorrect answer does not trigger encouragement
  Given I am on a letter with bubbles
  When I click an incorrect bubble
  Then the incorrect sound should play
  And NO encouragement should play
  And the encouragement queue should not advance
  And verbal praise is reserved for correct answers only
```

## Scenario: Queue State Tracking

```gherkin
Scenario: Queue tracks state correctly through gameplay
  Given I start a new round
  And the queue is initialized with 10 items
  When I answer the first letter correctly
  Then queue.length should be 9
  And lastPlayed should equal the played encouragement key
  When I answer 9 more letters correctly
  Then queue.length should be 0
  And all 10 encouragements should have been played
  When I answer the 11th correct (new round)
  Then queue should automatically refill to 10 items
```

## Scenario: Play History Tracking

```gherkin
Scenario: System tracks play history for debugging
  Given I am playing the game
  When I answer 5 letters correctly
  Then playHistory should contain 5 entries
  And entries should be in chronological order
  And each entry should be an encouragement key (e.g., "encouragement-3")
  When I answer 20 more letters correctly
  Then playHistory should contain only the most recent 20 entries
  And older entries should be removed (max 20 limit)
```

## Scenario: Shuffle Randomness

```gherkin
Scenario: Queue shuffle creates varied order each time
  Given I complete round 1
  And the play order was [7, 2, 9, 1, 5, 3, 8, 4, 6, 10]
  When I start round 2
  And the queue is refilled and reshuffled
  Then the play order should be different from round 1
  And the order should appear random
  And all 10 encouragements should still be present
```

## Scenario: Specific Encouragement Content

```gherkin
Scenario Outline: Each encouragement file has correct content
  Given encouragement file <file_key> is loaded
  When I trigger that specific encouragement
  Then I should hear the phrase <phrase>
  And the audio should be clear and understandable
  And the duration should be 1-2 seconds
  And the tone should be positive and encouraging

  Examples:
    | file_key         | phrase                |
    | encouragement-1  | "Great job!"          |
    | encouragement-2  | "Awesome!"            |
    | encouragement-3  | "You're amazing!"     |
    | encouragement-4  | "Well done!"          |
    | encouragement-5  | "Fantastic!"          |
    | encouragement-6  | "You got it!"         |
    | encouragement-7  | "Wonderful!"          |
    | encouragement-8  | "Keep it up!"         |
    | encouragement-9  | "You're doing great!" |
    | encouragement-10 | "Perfect!"            |
```

## Scenario: Volume Balance

```gherkin
Scenario: Encouragement volume is balanced
  Given all audio files are loaded
  When I play different encouragements
  Then all encouragement files should have similar volume levels
  And encouragements should be louder than correct sound
  And encouragements should be clearly audible
  And no encouragement should be too quiet or too loud
  And volume should be normalized across all 10 files
```

## Scenario: Complete Round Experience

```gherkin
Scenario: Full round with encouragement system
  Given I start a new round of 10 letters
  When I answer all 10 letters correctly
  Then I should hear 10 encouragements total
  And I should hear at least 8-10 different phrases
  And each correct answer should feel celebrated
  And the variety should maintain my engagement
  And I should not hear any phrase twice in the round
```

## Scenario: Multiple Rounds Variety

```gherkin
Scenario: Variety maintained across multiple rounds
  Given I play 3 complete rounds (30 correct answers)
  When I track all encouragements played
  Then I should see a good distribution of all 10 phrases
  And no phrase should dominate or be rarely played
  And the system should feel fresh and varied throughout
  And I should not notice repetitive patterns
```

## Scenario: Queue getNext Method

```gherkin
Scenario: getNext method provides correct encouragement
  Given the queue is ["encouragement-5", "encouragement-2", "encouragement-8"]
  And lastPlayed is "encouragement-7"
  When getNext() is called
  Then the method should return "encouragement-5"
  And the queue should become ["encouragement-2", "encouragement-8"]
  And lastPlayed should be updated to "encouragement-5"
  And the key should be added to playHistory
```

## Scenario: Queue playNext Method

```gherkin
Scenario: playNext method plays audio correctly
  Given the queue has available encouragements
  When playNext() is called
  Then getNext() should be called internally
  And the returned key should be passed to this.scene.sound.play()
  And the audio should start playing
  And the method should return the key that was played
  And the queue state should be updated
```

## Scenario: Empty Queue Auto-Refill

```gherkin
Scenario: Empty queue refills before providing encouragement
  Given the queue is currently empty
  And lastPlayed is "encouragement-4"
  When getNext() is called
  Then refillQueue() should be called automatically
  And the queue should be repopulated with all 10 encouragements
  And the queue should be shuffled
  And the first item should not be "encouragement-4"
  And the method should return the first item from new queue
```

## Scenario: Immediate Repetition Check

```gherkin
Scenario: System detects if same encouragement plays consecutively
  Given I have playHistory: ["enc-3", "enc-7", "enc-7", "enc-2"]
  When checkForImmediateRepetition() is called
  Then the method should detect repetition at index 2 and 3
  And a console warning should be logged
  And the warning should indicate which encouragement repeated
```

## Scenario: Timing Feels Natural

```gherkin
Scenario: Audio timing creates natural feeling experience
  Given I am answering letters correctly
  When I hear the audio sequence
  Then the correct sound should feel immediate (no delay)
  And the pause before encouragement should feel brief but noticeable
  And the encouragement should feel like a natural follow-up
  And the timing should not feel robotic or mechanical
  And the overall experience should feel warm and supportive
```

## Scenario: Encouragement Enhances Confidence

```gherkin
Scenario: Verbal praise builds player confidence
  Given Aurora is playing the game
  When she answers correctly
  Then she should hear immediate verbal praise
  And the praise should make her feel good about her answer
  And repeated correct answers should continue to feel rewarding
  And the variety should prevent the praise from feeling stale
  And the overall effect should boost her confidence and motivation
```

## Scenario: Scene Cleanup

```gherkin
Scenario: Queue cleaned up when scene ends
  Given LetterPopScene is active with EncouragementQueue
  And I complete a round and transition to ResultsScene
  When LetterPopScene is shut down
  Then the EncouragementQueue should be cleaned up
  And no encouragement should play in ResultsScene
  And memory should be released appropriately
  When I return to LetterPopScene for a new round
  Then a fresh EncouragementQueue should be created
  And the queue should start fresh with all 10 encouragements
```

## Acceptance Criteria

### Audio Asset Management
- [ ] 10 encouragement audio files generated
- [ ] Files saved to /public/assets/audio/encouragement/
- [ ] Files named encouragement-1.mp3 through encouragement-10.mp3
- [ ] All files load successfully in PreloadScene
- [ ] No loading errors in console
- [ ] Audio files cached properly

### Queue Implementation
- [ ] EncouragementQueue class created
- [ ] Queue initializes with 10 shuffled encouragements
- [ ] getNext() returns encouragement keys
- [ ] playNext() plays audio and updates state
- [ ] Queue auto-refills when empty
- [ ] Refill reshuffles encouragements
- [ ] Anti-repetition logic prevents back-to-back same encouragement
- [ ] lastPlayed tracked correctly
- [ ] playHistory tracks up to 20 recent plays

### Audio Playback
- [ ] Encouragement plays on every correct answer
- [ ] Different encouragement each time (within round)
- [ ] 400ms delay after correct sound
- [ ] Audio timing feels natural
- [ ] No audio overlap or cutting off
- [ ] Volume levels balanced across files
- [ ] Audio plays clearly and completely

### Variety and Randomness
- [ ] 10 correct answers use 8-10 different encouragements
- [ ] No immediate repetition (same twice in a row)
- [ ] Queue shuffle creates varied order
- [ ] Distribution feels fair over multiple rounds
- [ ] All 10 encouragements used equally over time

### Integration
- [ ] Coordinates with correct sound effect
- [ ] Coordinates with particle effects
- [ ] Coordinates with bubble animation
- [ ] Doesn't block next letter appearing
- [ ] Works smoothly with rapid answers
- [ ] No encouragement on incorrect answers

### User Experience
- [ ] Encouragement feels rewarding
- [ ] Timing feels natural and supportive
- [ ] Variety maintains engagement
- [ ] No repetition fatigue
- [ ] Builds confidence and motivation
- [ ] ADHD-friendly: frequent, varied, positive

### Technical Quality
- [ ] No console errors
- [ ] Memory managed properly
- [ ] Queue logic tested and verified
- [ ] Play history debugging works
- [ ] Scene cleanup works correctly
- [ ] Works across multiple rounds

## Edge Cases to Test

```gherkin
Scenario: Rapid Fire Answers (Stress Test)
  Given I answer 10 letters in under 10 seconds
  When encouragements are triggered rapidly
  Then all 10 encouragements should queue properly
  And all 10 should play (even if overlapping)
  And audio system should handle the load
  And no encouragements should be skipped
  And no audio glitches should occur

Scenario: Very First Answer Ever
  Given I just loaded the game for the first time
  And no encouragements have ever been played
  When I answer my very first correct letter
  Then the encouragement system should work perfectly
  And the first encouragement should play normally
  And there should be no initialization errors

Scenario: Last Answer Before Round End
  Given I am on letter 10 of 10
  When I answer correctly
  Then the encouragement should play
  And the encouragement should complete playing
  And the scene should transition to results after delay
  And the encouragement should not be cut off by transition

Scenario: Queue Refill at Exactly Empty
  Given I have played exactly 10 encouragements
  And the queue is now empty (length === 0)
  When getNext() is called for the 11th time
  Then refillQueue should trigger automatically
  And no errors should occur
  And a valid encouragement should be returned

Scenario: Shuffle Results in Same Order (Rare)
  Given the queue is refilled and shuffled
  When by random chance the shuffle produces the same order
  Then the system should still work correctly
  And even if order is same, variety is maintained within round
  And this is acceptable (very rare probability)

Scenario: Missing Audio File
  Given encouragement-5.mp3 failed to load
  When the queue tries to play encouragement-5
  Then Phaser should handle gracefully (no crash)
  And an error may be logged to console
  And the game should continue functioning
  And other encouragements should still work

Scenario: Extremely Long Round
  Given I play 50 correct answers in one session
  When I track all encouragements
  Then the queue should refill multiple times (5 times)
  And variety should be maintained throughout
  And all 10 encouragements should be used fairly
  And playHistory should cap at 20 entries
```

## Manual Testing Checklist

### Initial Setup
1. [ ] Generate 10 encouragement audio files
2. [ ] Place files in /public/assets/audio/encouragement/
3. [ ] Name files correctly (encouragement-1.mp3 to encouragement-10.mp3)
4. [ ] Load game and check console for errors
5. [ ] Verify all 10 files loaded successfully

### First Playthrough
6. [ ] Start new round
7. [ ] Answer first letter correctly
8. [ ] Listen for encouragement after correct sound
9. [ ] Note which encouragement played (e.g., "Great job!")
10. [ ] Verify timing feels good (not too soon, not too late)

### Variety Test
11. [ ] Answer letters 2-10 correctly
12. [ ] Track each encouragement that plays
13. [ ] Write down the phrases you hear
14. [ ] Verify at least 8-10 different phrases in round
15. [ ] Verify no phrase repeated in same round

### Repetition Test
16. [ ] Note the last encouragement of round 1
17. [ ] Start round 2
18. [ ] Answer first letter correctly
19. [ ] Verify first encouragement of round 2 is different from last of round 1
20. [ ] Confirms anti-repetition logic works

### Timing Test
21. [ ] Answer a letter correctly
22. [ ] Listen to correct sound (immediate)
23. [ ] Count mentally: "one" (400ms delay)
24. [ ] Hear encouragement after the count
25. [ ] Verify timing feels natural

### Rapid Answer Test
26. [ ] Answer 3 letters very quickly (1-2 seconds apart)
27. [ ] Verify all 3 encouragements play
28. [ ] Verify they might overlap (OK)
29. [ ] Verify none are skipped
30. [ ] Verify audio system handles it

### Multiple Rounds Test
31. [ ] Play 3 complete rounds (30 correct answers)
32. [ ] Track all encouragements if possible
33. [ ] Verify good variety throughout
34. [ ] Verify system feels fresh, not repetitive
35. [ ] Check console for any errors

### Negative Test
36. [ ] Answer a letter incorrectly
37. [ ] Verify only incorrect sound plays
38. [ ] Verify NO encouragement plays
39. [ ] Verify queue doesn't advance

### Edge Case Tests
40. [ ] Test first answer of game (fresh start)
41. [ ] Test 11th answer (queue refill)
42. [ ] Test answer 21 (second queue refill)
43. [ ] Test final answer before results screen
44. [ ] Verify all edge cases work smoothly

### Volume Test
45. [ ] Listen to all 10 encouragements across rounds
46. [ ] Verify all are approximately same volume
47. [ ] Verify all are clear and audible
48. [ ] Verify none are too quiet or too loud

### User Experience Test
49. [ ] Play game as Aurora would
50. [ ] Notice how encouragements make you feel
51. [ ] Verify they feel rewarding and motivating
52. [ ] Verify variety keeps it interesting
53. [ ] Verify timing and coordination feel good
54. [ ] Confirm overall experience is positive

## Performance Benchmarks

```gherkin
Scenario: Memory Usage
  Given I play 5 complete rounds (50 correct answers)
  When I monitor browser memory usage
  Then memory should remain stable
  And playHistory should cap at 20 entries
  And no memory leaks should occur
  And performance should not degrade

Scenario: Audio Loading Time
  Given the game is starting
  When PreloadScene loads 10 encouragement files
  Then all files should load within 5 seconds
  And loading progress should be visible
  And game should start smoothly after loading
```

## Accessibility Considerations

```gherkin
Scenario: Audio Clarity for Young Learners
  Given Aurora is 5 years old
  When encouragements play
  Then speech should be clear and easy to understand
  And pacing should not be too fast
  And pronunciation should be correct
  And tone should be warm and friendly

Scenario: No Sensory Overload
  Given Aurora has ADHD
  When multiple audio elements play
  Then encouragement should not overlap with letter audio
  And timing should prevent audio soup
  And the experience should be exciting but not overwhelming
  And audio variety should maintain engagement without chaos
```

## Success Criteria

**This phase is complete when:**
1. 10 encouragement audio files exist and load correctly
2. EncouragementQueue class implemented and working
3. Queue shuffles and provides varied encouragements
4. Anti-repetition logic prevents consecutive same encouragement
5. Encouragement plays on every correct answer
6. 400ms delay after correct sound feels natural
7. No audio overlap or timing issues
8. Variety confirmed over 10+ correct answers
9. Queue auto-refills when empty
10. PlayHistory tracks recent plays for debugging
11. Volume levels balanced across all files
12. Integration with particle effects works smoothly
13. No console errors
14. Tested thoroughly over multiple rounds
15. User experience is positive and motivating
16. ADHD-friendly: frequent, varied, positive reinforcement
17. Timing feels natural and supportive
18. System builds confidence and engagement
19. Ready to proceed to Phase 17
20. Aurora feels celebrated and encouraged!

## Notes

**Focus on Emotional Impact**
- This isn't just audio - it's emotional support
- Every encouragement should make Aurora feel good
- Variety is critical to prevent habituation
- Timing must feel natural, not robotic
- The system builds confidence through consistent praise

**Testing Priority**
- Variety is the most critical feature
- Test over many answers (20+)
- Verify no immediate repetition
- Ensure timing feels good
- Confirm all 10 files work

**ADHD Design Validation**
- Frequent reinforcement (every correct answer)
- Varied reinforcement (prevents tuning out)
- Immediate reinforcement (quick feedback loop)
- Positive only (no punishment)
- Emotionally supportive (builds confidence)
- Maintains engagement (doesn't get boring)

**What Makes This Phase Critical**
- Transforms game into emotionally supportive experience
- Verbal praise is powerful for young learners
- Variety prevents the "tuning out" effect
- Builds intrinsic motivation through celebration
- Creates warm, safe learning environment
- Especially important for ADHD learners who need frequent positive feedback
