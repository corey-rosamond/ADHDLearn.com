# Phase 28: Word Catch Polish - BDD Scenarios

## Feature: Word Catch Production Polish

```gherkin
Feature: Word Catch Polish and Professional Quality
  As a player (Aurora)
  I want Word Catch to be polished and enjoyable
  So that learning sight words is fun and engaging

Background:
  Given Word Catch game is functional
  And real sight words are loaded
  And ContentProvider is working
  And I am in the Word Catch scene
```

## Scenario: Particle Effects on Word Catch

```gherkin
Scenario: Display satisfying particle effect when catching a word
  Given a sight word is falling on screen
  And the word is at position (400, 300)
  When I click on the word
  Then a particle burst should emit from position (400, 300)
  And the burst should contain 20+ particles
  And particles should explode in all directions (0-360°)
  And particles should have vibrant colors (gold, white, orange, pink)
  And particles should have realistic physics (velocity + gravity)
  And particles should fade out over ~1 second
  And star particles should also spawn (10 stars)
  And the effect should feel satisfying and rewarding
  And particle emitters should be destroyed after 1.2 seconds
```

## Scenario: Particle Performance

```gherkin
Scenario: Ensure particles don't impact performance
  Given Word Catch is running
  When I catch 10 words rapidly in succession
  Then 10 particle effects should spawn
  And the frame rate should remain at 60fps
  And there should be no visual lag or stutter
  And all particle emitters should be destroyed after use
  And memory usage should remain stable
```

## Scenario: Background Music Integration

```gherkin
Scenario: Play background music during Word Catch
  Given I start the Word Catch game
  When the scene is created
  Then background music should begin playing
  And the music should fade in over 2 seconds
  And the music volume should be set to 25%
  And the music should loop seamlessly (no gap or pop)
  And the music should be child-friendly and calming
  And the music should continue playing throughout the game
```

## Scenario: Music Fade Out on Exit

```gherkin
Scenario: Smoothly fade out music when exiting game
  Given Word Catch is running
  And background music is playing
  When I exit the game scene
  Then the music should fade out over 1 second
  And the music should stop after fade completes
  And no audio errors should occur
```

## Scenario: Music Toggle

```gherkin
Scenario: Turn background music on and off
  Given Word Catch is running with music on
  When I toggle the music off
  Then the music should stop playing
  When I toggle the music on again
  Then the music should resume playing
  And the volume should be 25%
```

## Scenario: Audio Ducking for Word Pronunciation

```gherkin
Scenario: Lower music when sight word audio plays
  Given Word Catch is running
  And background music is playing at 25% volume
  When I catch a sight word
  Then the background music volume should lower to 10%
  And the music should lower over 100ms (smooth transition)
  And the sight word pronunciation should play
  And the catch sound effect should play
  And the sight word audio should be clearly audible
  When the sight word audio completes
  Then the background music should return to 25% volume
  And the music should restore over 300ms (smooth transition)
```

## Scenario: Rapid Word Catch Audio Handling

```gherkin
Scenario: Handle audio ducking with rapid catches
  Given Word Catch is running
  When I catch 3 words rapidly (within 2 seconds)
  Then each word's audio should play
  And audio ducking should work for each catch
  And audio should not overlap harshly
  And the music should restore properly
  And no audio glitches should occur
```

## Scenario: Character Basket Display

```gherkin
Scenario: Display character or basket at bottom of screen
  Given Word Catch is running
  When the scene is created
  Then a basket or character sprite should be visible
  And it should be positioned at the bottom center of screen
  And it should be positioned at y coordinate ~520
  And it should be positioned at x coordinate 400 (centered)
  And the sprite should be clearly visible
  And the sprite should not obscure falling words
```

## Scenario: Character Idle Animation

```gherkin
Scenario: Basket/character has subtle idle animation
  Given the character is displayed at bottom of screen
  When no words are being caught
  Then the character should have a gentle bobbing animation
  And the bob should move up and down 5 pixels
  And the animation should take 1 second per cycle
  And the animation should loop continuously
  And the animation should use smooth easing (Sine)
  And the animation should be subtle (not distracting)
```

## Scenario: Character Catch Animation

```gherkin
Scenario: Character reacts when word is caught
  Given the character is at rest
  When I catch a word
  Then the character should perform a catch animation
  And the character should jump up briefly (~30 pixels)
  And the character should squash/stretch (scale effect)
  And the animation should complete in 150ms
  And the animation should yoyo (up then down)
  And the character should return to idle animation
  And the animation should feel responsive and satisfying
```

## Scenario: Character Miss Animation

```gherkin
Scenario: Character reacts when word is missed
  Given the character is at rest
  When a word reaches the bottom and is missed
  Then the character should perform a miss animation
  And the character should shake left and right
  And the shake should be subtle (5 pixels each way)
  And the shake should repeat 3 times
  And the animation should complete in 150ms total
  And the character should return to center position
  And the animation should return to idle animation
  And the animation should be gentle (not punishing)
```

## Scenario: Word Spawn Animation

```gherkin
Scenario: Words appear with smooth spawn animation
  Given Word Catch is running
  When a new word spawns
  Then the word should start at alpha 0 (invisible)
  And the word should start at scale 0 (tiny)
  And the word should fade in to alpha 1 over 300ms
  And the word should scale in to scale 1 over 300ms
  And the animation should use elastic/bounce easing (Back.easeOut)
  And the spawn animation should complete before falling
  And there should be no pop-in or visual glitches
```

## Scenario: Word Falling Animation

```gherkin
Scenario: Words fall with smooth motion and subtle effects
  Given a word has spawned and is visible
  When the word begins falling
  Then the word should move from top (y: -50) to bottom (y: 600)
  And the fall duration should be between 4-6 seconds (random)
  And the fall motion should use linear easing
  And the word should have a gentle left-right sway
  And the sway should move ±30 pixels horizontally
  And the sway should loop continuously (yoyo)
  And the word should have subtle rotation (±10 degrees)
  And the rotation should loop continuously
  And all animations should be smooth (no jitter)
```

## Scenario: Catch Sound Effect

```gherkin
Scenario: Play satisfying sound when word is caught
  Given Word Catch is running
  When I catch a word
  Then a catch sound effect should play
  And the sound should be a pleasant chime or ding
  And the sound should have volume of ~50%
  And the sound should be clearly audible
  And the sound should be child-appropriate
  And the sound should feel rewarding
```

## Scenario: Miss Sound Effect

```gherkin
Scenario: Play gentle sound when word is missed
  Given Word Catch is running
  When a word reaches the bottom and is missed
  Then a miss sound effect should play (optional)
  And if played, the sound should be gentle and non-punishing
  And the sound should be low volume
  And the sound should not discourage the player
  And the sound should be child-appropriate
```

## Scenario: Visual Cohesion with Letter Pop

```gherkin
Scenario: Word Catch visual style matches Letter Pop
  Given I have played Letter Pop
  And I start Word Catch
  When I compare the visual styles
  Then the color schemes should be harmonious
  And the fonts should be the same family
  And the UI elements should have similar styling
  And the backgrounds should have similar aesthetic
  And the particle effects should feel consistent
  And both games should feel like part of the same product
```

## Scenario: Text Readability

```gherkin
Scenario: Sight words are easy to read
  Given Word Catch is running
  When sight words appear on screen
  Then the text should be large (48px font size)
  And the text should have high contrast (white on dark background)
  And the text should have a dark stroke/outline (4px)
  And the text should be clearly readable from a distance
  And the font should be simple and sans-serif
  And there should be no visual elements obscuring the text
```

## Scenario: Gameplay Pacing - Spawn Rate

```gherkin
Scenario: Words spawn at appropriate rate
  Given Word Catch is running
  When I play the game for 2 minutes
  Then new words should spawn every 2 seconds
  And the spawn rate should feel comfortable (not overwhelming)
  And the spawn rate should feel engaging (not too slow)
  And there should typically be 3-5 words on screen at once
  And the screen should never feel too crowded
  And the screen should never feel too empty
```

## Scenario: Gameplay Pacing - Fall Speed

```gherkin
Scenario: Words fall at appropriate speed
  Given a word has spawned
  When the word is falling
  Then the fall duration should be 4-6 seconds
  And the speed should give Aurora enough time to read the word
  And the speed should give Aurora enough time to click
  And the speed should feel challenging but fair
  And Aurora should successfully catch ~70-80% of words
```

## Scenario: Extended Play Session

```gherkin
Scenario: Game remains engaging over extended play
  Given Word Catch is running
  When I play for 10 minutes
  Then the game should remain fun and engaging
  And word variety should be maintained (no immediate repeats)
  And the difficulty should remain consistent
  And performance should remain smooth (60fps)
  And memory usage should remain stable
  And no console errors should appear
  And I should want to continue playing
```

## Scenario: Performance Maintenance

```gherkin
Scenario: Game maintains 60fps throughout
  Given Word Catch is running with all polish features enabled
  When I catch multiple words with particle effects
  And background music is playing
  And character animations are active
  And multiple words are falling with animations
  Then the frame rate should remain at 60fps
  And there should be no frame drops or stuttering
  And the game should feel smooth and responsive
```

## Scenario: Edge Case - Rapid Clicking

```gherkin
Scenario: Handle rapid clicking without issues
  Given Word Catch is running
  When I click rapidly on the screen (10+ clicks/second)
  Then the game should handle all clicks without errors
  And only valid word catches should trigger
  And particle effects should not cause lag
  And audio should not glitch or overlap harshly
  And the game should remain stable
```

## Scenario: Edge Case - Overlapping Words

```gherkin
Scenario: Handle clicking on overlapping words
  Given two words are overlapping on screen
  When I click on the overlapped area
  Then only one word should be caught (the top one)
  And only one catch event should fire
  And only one particle effect should spawn
  And only one audio should play
  And the caught word should be destroyed
  And the other word should continue falling
```

## Scenario: Edge Case - Screen Resize

```gherkin
Scenario: Handle browser window resize gracefully
  Given Word Catch is running
  When I resize the browser window
  Then the game should adapt to the new size
  And character position should remain appropriate
  And falling words should remain visible
  And no visual elements should be cut off
  And the game should continue functioning normally
```

## Scenario: Scene Transitions

```gherkin
Scenario: Clean scene transitions without memory leaks
  Given Word Catch is running
  And multiple words are falling
  And particle effects are active
  And background music is playing
  When I exit to menu or restart the game
  Then all tweens should be stopped
  And all particle emitters should be destroyed
  And background music should fade out and stop
  And all word sprites should be destroyed
  And no memory should be leaked
  And the next scene should load cleanly
```

## Scenario: User Acceptance - Aurora Playtesting

```gherkin
Scenario: Aurora enjoys playing Word Catch
  Given Aurora (age 4-6) plays Word Catch for 5-10 minutes
  Then she should understand the objective (catch falling words)
  And she should be able to catch words successfully (~70-80%)
  And she should enjoy the visual effects (particles, animations)
  And she should enjoy the audio (music, sounds, word pronunciations)
  And she should not feel frustrated or confused
  And she should want to play again
  And she should feel proud of catching words
  And she should be learning sight words through play
```

## Scenario: Quality Comparison to Letter Pop

```gherkin
Scenario: Word Catch matches Letter Pop quality
  Given Letter Pop is the quality benchmark (Milestone 1)
  When I compare Word Catch to Letter Pop
  Then Word Catch should have equal animation smoothness
  And Word Catch should have equal particle effect quality
  And Word Catch should have equal audio quality
  And Word Catch should have equal visual polish
  And Word Catch should have equal gameplay feel
  And Word Catch should have equal bug-free stability
  And Word Catch should feel like the same product family
  And both games should be demo/share-ready quality
```

## Acceptance Criteria

### Particle Effects
- [ ] Particle effects spawn on word catch
- [ ] Burst particles (20+) with vibrant colors
- [ ] Star particles (10) for extra sparkle
- [ ] Particles have realistic physics (velocity, gravity, fade)
- [ ] Particles cleanup properly (no memory leak)
- [ ] Performance remains 60fps with particles

### Background Music
- [ ] Music plays on game start
- [ ] Music loops seamlessly (no gap)
- [ ] Music volume is 25% (non-intrusive)
- [ ] Music can be toggled on/off
- [ ] Music fades in (2s) and out (1s) smoothly
- [ ] Music style is child-friendly and calming

### Audio Ducking
- [ ] Music lowers to 10% when word audio plays
- [ ] Music restores to 25% after word audio completes
- [ ] Transitions are smooth (100ms duck, 300ms restore)
- [ ] Sight word audio is always clearly audible
- [ ] Rapid catches handled without audio glitches

### Character/Basket Animations
- [ ] Character/basket displayed at bottom center
- [ ] Idle animation is subtle and continuous
- [ ] Catch animation is responsive and satisfying
- [ ] Miss animation is gentle and non-punishing
- [ ] All animations are smooth (no jitter)
- [ ] Character doesn't obscure falling words

### Word Spawn Animations
- [ ] Words fade in from alpha 0 to 1
- [ ] Words scale in from scale 0 to 1
- [ ] Spawn animation takes 300ms
- [ ] Spawn uses elastic/bounce easing
- [ ] No pop-in or visual glitches

### Word Falling Animations
- [ ] Words fall from top to bottom (4-6 seconds)
- [ ] Words have gentle left-right sway (±30px)
- [ ] Words have subtle rotation (±10 degrees)
- [ ] All animations are smooth and continuous
- [ ] Fall speed is appropriate for target age

### Sound Effects
- [ ] Catch sound effect is satisfying
- [ ] Miss sound effect is gentle (if used)
- [ ] All sound effects are balanced volume
- [ ] All sounds are child-appropriate
- [ ] Sound timing is responsive (< 100ms)

### Visual Cohesion
- [ ] Color scheme harmonizes with Letter Pop
- [ ] Fonts match Letter Pop
- [ ] UI styling is consistent
- [ ] Text is highly readable (contrast, size, stroke)
- [ ] Both games feel like same product

### Gameplay Pacing
- [ ] Spawn rate is appropriate (every 2 seconds)
- [ ] Fall speed is appropriate (4-6 seconds)
- [ ] Success rate is ~70-80% for target age
- [ ] Game doesn't feel rushed or too slow
- [ ] Extended play remains engaging

### Performance & Stability
- [ ] Game maintains 60fps consistently
- [ ] No memory leaks over extended play
- [ ] No console errors or warnings
- [ ] Edge cases handled gracefully
- [ ] Scene transitions are clean

### User Experience
- [ ] Aurora enjoys playing
- [ ] Aurora understands the objective
- [ ] Aurora can catch words successfully
- [ ] Aurora wants to play again
- [ ] Game feels polished and professional
- [ ] Quality matches Letter Pop

### MILESTONE 2
- [ ] Word Catch is production quality
- [ ] Word Catch matches Letter Pop quality
- [ ] Two complete, polished mini-games exist
- [ ] Both games are ready to demo/share
- [ ] Milestone 2 achieved

## Manual Testing Checklist

### Particle Testing
1. [ ] Launch Word Catch
2. [ ] Catch a word
3. [ ] Observe particle burst (should be vibrant, substantial)
4. [ ] Observe star particles
5. [ ] Verify particles have realistic physics
6. [ ] Catch 10 words rapidly
7. [ ] Verify 60fps maintained
8. [ ] Check console for memory warnings

### Music Testing
9. [ ] Start game, verify music plays
10. [ ] Verify music loops seamlessly
11. [ ] Check volume is non-intrusive
12. [ ] Toggle music off, verify stops
13. [ ] Toggle music on, verify resumes
14. [ ] Exit game, verify fade out
15. [ ] Test in headphones and speakers

### Audio Ducking Testing
16. [ ] Catch a word with music playing
17. [ ] Verify music lowers when word audio plays
18. [ ] Verify word audio is clear
19. [ ] Verify music restores after word audio
20. [ ] Catch 3 words rapidly
21. [ ] Verify audio ducking works for all
22. [ ] Verify no harsh overlaps

### Character Animation Testing
23. [ ] Observe character at bottom of screen
24. [ ] Verify idle bob animation
25. [ ] Catch a word, observe catch animation
26. [ ] Miss a word, observe miss animation
27. [ ] Verify animations are smooth
28. [ ] Verify character doesn't block words

### Word Animation Testing
29. [ ] Observe new word spawning
30. [ ] Verify fade in animation
31. [ ] Verify scale in animation
32. [ ] Observe word falling
33. [ ] Verify sway motion
34. [ ] Verify rotation
35. [ ] Check for any visual glitches

### Sound Effect Testing
36. [ ] Catch a word, verify catch sound
37. [ ] Miss a word, verify miss sound (if used)
38. [ ] Verify sounds are pleasant
39. [ ] Verify sounds are appropriate volume
40. [ ] Test rapid catches (multiple sounds)

### Visual Cohesion Testing
41. [ ] Play Letter Pop for 2 minutes
42. [ ] Play Word Catch for 2 minutes
43. [ ] Compare color schemes
44. [ ] Compare fonts and UI
45. [ ] Verify consistent visual feel

### Gameplay Pacing Testing
46. [ ] Play for 5 minutes
47. [ ] Count words spawned per minute (~30)
48. [ ] Note fall speed (should be catchable)
49. [ ] Calculate success rate (aim for 70-80%)
50. [ ] Verify game feels appropriately paced

### Performance Testing
51. [ ] Play for 10 minutes
52. [ ] Monitor frame rate (should stay 60fps)
53. [ ] Check memory usage (should be stable)
54. [ ] Verify no lag or stutter
55. [ ] Check console for errors

### Edge Case Testing
56. [ ] Rapidly click empty areas
57. [ ] Click on overlapping words
58. [ ] Resize browser window
59. [ ] Let screen fill with words
60. [ ] Pause and resume game
61. [ ] Exit and re-enter scene
62. [ ] Verify all handled gracefully

### Aurora Playtesting
63. [ ] Set up Aurora with game
64. [ ] Explain objective briefly
65. [ ] Observe initial reaction
66. [ ] Watch full 5-10 minute session
67. [ ] Note successes and struggles
68. [ ] Note facial expressions and engagement
69. [ ] Ask: "Was it fun?"
70. [ ] Ask: "Was it too hard or too easy?"
71. [ ] Ask: "Did you like the sounds and colors?"
72. [ ] Ask: "Would you play again?"
73. [ ] Document all feedback
74. [ ] Prioritize feedback items
75. [ ] Implement critical changes
76. [ ] Conduct follow-up test if needed

### Final Validation
77. [ ] All polish checklist items completed
78. [ ] All acceptance criteria met
79. [ ] Zero console errors
80. [ ] Aurora feedback is positive
81. [ ] Quality matches Letter Pop
82. [ ] Ready to demo/share
83. [ ] **MILESTONE 2 ACHIEVED**

## Success Criteria

**This phase is complete when:**
1. All particle effects implemented and satisfying
2. Background music integrated and looping seamlessly
3. Audio ducking works smoothly
4. Character/basket animations implemented and polished
5. Word spawn and fall animations are smooth
6. All sound effects added and balanced
7. Visual cohesion with Letter Pop verified
8. Gameplay pacing feels appropriate
9. Performance is 60fps consistently
10. All edge cases handled gracefully
11. Aurora playtested with positive feedback
12. All bugs fixed
13. All acceptance criteria met
14. Quality matches Letter Pop
15. **MILESTONE 2: Two Complete Mini-Games achieved**

## Notes

**Testing Philosophy for Polish Phase**
- **Feel is paramount**: Numbers matter, but feel matters more
- **Aurora is the judge**: Her enjoyment is the ultimate metric
- **Compare to Letter Pop**: That's our quality bar
- **Small details matter**: Polish is in the subtle touches
- **Iterate based on feedback**: Don't be precious, adjust as needed

**What Makes a Game "Polished"?**
- Animations are smooth and satisfying
- Audio is balanced and pleasant
- Visual effects are impactful but not overwhelming
- Gameplay pacing feels just right
- No bugs or rough edges
- Attention to detail in every interaction
- Everything feels intentional and crafted
- The experience is cohesive and professional

**Priority Focus Areas**
1. **Particle effects**: Most visible polish element, must feel rewarding
2. **Audio ducking**: Educational audio must always be clear
3. **Gameplay pacing**: Aurora must succeed enough to stay motivated
4. **Visual cohesion**: Both games must feel like one product
5. **Performance**: Must maintain 60fps, no exceptions

**Warning Signs During Testing**
- Aurora looks confused (objective not clear)
- Aurora looks frustrated (too difficult)
- Aurora looks bored (too easy or repetitive)
- Aurora stops playing early (not engaging)
- Aurora complains about sounds (audio issues)
- Aurora squints at screen (readability issues)

**Signs of Success**
- Aurora smiles and laughs
- Aurora asks to play again
- Aurora successfully catches most words
- Aurora learns and recognizes sight words
- Aurora stays engaged for full session
- Aurora talks about the game later

**MILESTONE 2 Significance**
This is a **major achievement**. You've gone from concept to **two complete, polished, educational games**. Letter Pop teaches letters, Word Catch teaches sight words. Both are production quality. Both are fun. Both are educational. Aurora now has a real learning tool. This is something to be proud of!

Next steps after Milestone 2:
- Game selection menu
- Progress tracking
- Third mini-game
- Parent dashboard
- Expanded content

But for now: **celebrate this milestone**! Two games down, many more to come!
