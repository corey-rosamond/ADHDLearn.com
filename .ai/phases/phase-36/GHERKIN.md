# Phase 36: Memory Match - Polish - BDD Scenarios

## Feature: Enhanced Card Animations

```gherkin
Feature: Polished Card Interactions
  As a player
  I want cards to have impressive animations
  So that the game feels professional and engaging

Background:
  Given MemoryMatchScene is active
  And enhanced card animations are enabled
```

## Scenario: Enhanced Hover Effect

```gherkin
Scenario: Card responds to hover with rotation and glow
  Given a card is face-down
  And the card is not flipping
  And the card is not matched
  When the mouse hovers over the card
  Then the card should tween scale to 1.1
  And the card should tween angle to 5 degrees
  And the duration should be 200ms
  And the easing should be 'Back.easeOut'
  And a glow circle should be created
  And the glow should expand from scale 1.0 to 1.2
  And the glow alpha should fade from 0.3 to 0
  And the glow duration should be 400ms
  And the glow should be destroyed after animation
```

## Scenario: Hover Effect Cleanup

```gherkin
Scenario: Card returns to normal when mouse leaves
  Given a card is being hovered
  And the card scale is 1.1
  And the card angle is 5 degrees
  When the mouse moves away from the card
  Then the card should tween scale back to 1.0
  And the card should tween angle back to 0
  And the duration should be 200ms
  And the glow animation should complete and destroy itself
```

## Scenario: Enhanced Flip Animation

```gherkin
Scenario: Card lifts and flips with depth
  Given a card is face-down at y position 200
  When flip(true) is called
  Then a random flip sound should play
  And the card should tween y to 190 (lift up 10px)
  And the lift duration should be 150ms
  And the flip animation should proceed normally
  When the flip completes
  Then the card should tween y back to 200 (lower down)
  And the lower duration should be 100ms
  And a subtle bounce (scaleY 1.05) should occur
```

## Scenario: Match Pop Effect

```gherkin
Scenario: Matched cards pop with elastic animation
  Given two cards match
  When handleMatch() is called
  Then both cards should tween scale
  And the scale sequence should be: 1.0 → 1.3 → 1.0
  And the duration should be 400ms
  And the easing should be 'Elastic.easeOut'
  And the effect should be satisfying and bouncy
```

## Feature: Letter-Object Content

```gherkin
Feature: Educational Letter-Object Pairs
  As a player
  I want to see images paired with letters
  So that I can learn letter-object associations

Background:
  Given LETTER_OBJECT_PAIRS data structure is defined
  And all 26 letters have corresponding objects
```

## Scenario: Letter-Object Data Structure

```gherkin
Scenario: All letters mapped to objects
  Given the LETTER_OBJECT_PAIRS constant exists
  Then it should contain entries for all 26 letters A-Z
  And each entry should have:
    | Property | Type   | Example                |
    | name     | String | "Apple"                |
    | image    | String | "apple.png"            |
    | color    | String | "#ff4444"              |

  Examples:
    | Letter | Name       | Image           | Color     |
    | A      | Apple      | apple.png       | #ff4444   |
    | B      | Ball       | ball.png        | #4444ff   |
    | C      | Cat        | cat.png         | #ff8844   |
    | M      | Moon       | moon.png        | #cccccc   |
    | Z      | Zebra      | zebra.png       | #444444   |
```

## Scenario: Load Object Images

```gherkin
Scenario: Preload all letter-object images
  Given the MemoryMatchScene preload() is called
  When loading assets
  Then each image from LETTER_OBJECT_PAIRS should be loaded
  And the images should be loaded from 'assets/images/objects/' folder
  And all 26 images should be ready before scene starts
  And a placeholder image should exist for missing assets
```

## Scenario: Display Image on Card Face

```gherkin
Scenario: Card front shows letter and object
  Given a card has cardData { letter: "A", name: "Apple", image: "apple.png" }
  And the card is face-down
  When the card flips face-up
  Then the object image should be visible
  And the image should be positioned at y: -25 (top of card)
  And the image should be scaled to 0.5
  And the letter "A" should be visible
  And the letter should be positioned at y: 35 (center)
  And the letter fontSize should be "48px"
  And the object name "Apple" should be visible
  And the name should be positioned at y: 60 (bottom)
  And the name fontSize should be "14px"
  And the name should be italic
```

## Scenario: Image Visibility During Flip

```gherkin
Scenario: Image appears at flip midpoint
  Given a card is flipping from face-down to face-up
  When the flip reaches midpoint (scaleX = 0)
  Then the back sprite should be hidden
  And the front sprite should be visible
  And the object image should become visible
  And the letter text should become visible
  And the object name should become visible
  And all elements should remain visible as card expands
```

## Feature: Background Music

```gherkin
Feature: Immersive Background Audio
  As a player
  I want calm background music
  So that I can focus and enjoy the game

Background:
  Given MemoryMatchScene is loading
  And 'bg-music-memory' audio file exists
```

## Scenario: Start Background Music

```gherkin
Scenario: Music plays when scene starts
  Given the scene create() method is called
  When the scene is ready
  Then 'bg-music-memory' sound should be added
  And the music volume should be set to 0.3
  And the music loop should be set to true
  And the music should start playing
  And the music should fade in from volume 0 to 0.3
  And the fade duration should be 2000ms
  And the easing should be 'Sine.easeIn'
```

## Scenario: Music Loops Seamlessly

```gherkin
Scenario: Music continues without gaps
  Given background music is playing
  When the music track reaches its end
  Then the music should loop back to the beginning
  And there should be no silence gap
  And there should be no audio pop or click
  And the loop should be seamless
```

## Scenario: Stop Music on Scene Exit

```gherkin
Scenario: Music fades out when leaving scene
  Given background music is playing at volume 0.3
  And the player clicks "Main Menu" button
  When the scene shutdown() is called
  Then the music should fade out
  And the volume should tween from 0.3 to 0
  And the fade duration should be 1000ms
  And the music should stop after fade completes
  And no music should play in next scene
```

## Feature: Difficulty Variations

```gherkin
Feature: Multiple Difficulty Levels
  As a player
  I want to choose my challenge level
  So that the game matches my skill

Background:
  Given the game supports Easy, Medium, and Hard difficulties
```

## Scenario: Easy Mode Configuration

```gherkin
Scenario: Easy mode is accessible and forgiving
  Given I select "Easy" difficulty
  When MemoryMatchScene init() is called with { difficulty: 'easy' }
  Then gridConfig should be set to:
    | rows | cols | cardWidth | cardHeight | paddingX | paddingY |
    | 3    | 4    | 100       | 140        | 20       | 20       |
  And totalPairs should be 6
  And mismatchDelay should be 1500ms
  And letterPool should be "ABCDEF" (6 letters only)
  And showPreview should be true
  And 12 cards should be created (6 pairs)
```

## Scenario: Medium Mode Configuration

```gherkin
Scenario: Medium mode is the standard experience
  Given I select "Medium" difficulty
  When MemoryMatchScene init() is called with { difficulty: 'medium' }
  Then gridConfig should be set to:
    | rows | cols | cardWidth | cardHeight | paddingX | paddingY |
    | 3    | 4    | 100       | 140        | 20       | 20       |
  And totalPairs should be 6
  And mismatchDelay should be 1000ms
  And letterPool should be "ABCDEFGHIJKL" (12 letters)
  And showPreview should be false
  And 12 cards should be created (6 pairs)
```

## Scenario: Hard Mode Configuration

```gherkin
Scenario: Hard mode is challenging
  Given I select "Hard" difficulty
  When MemoryMatchScene init() is called with { difficulty: 'hard' }
  Then gridConfig should be set to:
    | rows | cols | cardWidth | cardHeight | paddingX | paddingY |
    | 4    | 4    | 90        | 130        | 15       | 15       |
  And totalPairs should be 8
  And mismatchDelay should be 800ms
  And letterPool should be "ABCDEFGHIJKLMNOPQRSTUVWXYZ" (all 26)
  And showPreview should be false
  And 16 cards should be created (8 pairs)
```

## Scenario: Difficulty Selection UI

```gherkin
Scenario: Player can choose difficulty before starting
  Given I am on a difficulty selection screen
  Then I should see three buttons:
    | Button Text | Background Color | Position |
    | Easy        | #27ae60 (green)  | 280      |
    | Medium      | #f39c12 (orange) | 350      |
    | Hard        | #e74c3c (red)    | 420      |
  And all buttons should have fontSize "32px"
  And buttons should scale to 1.1 on hover
  When I click "Easy"
  Then the scene should start with difficulty: 'easy'
  When I click "Medium"
  Then the scene should start with difficulty: 'medium'
  When I click "Hard"
  Then the scene should start with difficulty: 'hard'
```

## Scenario: Mismatch Delay Varies by Difficulty

```gherkin
Scenario Outline: Mismatch timing changes with difficulty
  Given I am playing on <difficulty> mode
  And the mismatchDelay is <delay>ms
  When two cards mismatch
  Then the game should wait <delay>ms before flipping back

  Examples:
    | difficulty | delay |
    | easy       | 1500  |
    | medium     | 1000  |
    | hard       | 800   |
```

## Scenario: Preview Mode (Easy Only)

```gherkin
Scenario: Easy mode shows all cards briefly
  Given I am playing on "Easy" difficulty
  And showPreview is true
  And 12 cards are face-down
  When the scene create() completes
  Then all cards should flip face-up
  And the flip duration should be 200ms each
  And all card contents should be visible
  And the game should wait 3000ms
  When 3 seconds have elapsed
  Then all cards should flip back face-down
  And the flip duration should be 200ms each
  And the game should wait an additional 500ms
  When the wait completes
  Then canFlip should be set to true
  And the player can start playing
```

## Feature: Visual Polish

```gherkin
Feature: Professional Visual Quality
  As a player
  I want beautiful visuals
  So that the game looks and feels premium

Background:
  Given MemoryMatchScene is active
```

## Scenario: Card Shadows

```gherkin
Scenario: Cards have depth with shadows
  Given a card is created
  Then a shadow ellipse should be added
  And the shadow should be 110x30 pixels
  And the shadow color should be black (0x000000)
  And the shadow alpha should be 0.3 (30% opacity)
  And the shadow should be positioned at y: +5 (below card)
  And the shadow depth should be -2 (behind card)
```

## Scenario: Match Trail Effect

```gherkin
Scenario: Visual connection between matched cards
  Given card1 is at position (220, 150)
  And card2 is at position (340, 150)
  When the cards match
  Then addMatchTrail(220, 150, 340, 150) should be called
  And a graphics object should be created
  And a line should be drawn from (220, 150) to (340, 150)
  And the line color should be gold (0xFFD700)
  And the line width should be 4 pixels
  And the line alpha should start at 0.8
  And the line should fade to alpha 0
  And the fade duration should be 800ms
  And the graphics should be destroyed after fade
```

## Scenario: Scene Entry Animation

```gherkin
Scenario: Cards fly in smoothly when scene starts
  Given the scene is starting
  And 12 cards are created
  When create() is called
  Then the camera should fade in (500ms)
  And each card should start with alpha 0
  And each card should start with y position -100 (above screen)
  And cards should animate in sequentially
  And card 0 should start animating at 0ms
  And card 1 should start animating at 50ms
  And card 2 should start animating at 100ms
  And each card should tween:
    | Property | From | To  | Duration | Easing        |
    | y        | -100 | 0   | 600ms    | Back.easeOut  |
    | alpha    | 0    | 1   | 600ms    | -             |
  And the last card should finish at approximately 1150ms
```

## Feature: Enhanced Sound Design

```gherkin
Feature: Rich Audio Feedback
  As a player
  I want varied and clear sounds
  So that audio feedback is engaging

Background:
  Given sound effects are loaded
```

## Scenario: Multiple Flip Sound Variations

```gherkin
Scenario: Flip sounds vary to prevent repetition
  Given three flip sounds are loaded:
    | Sound File     |
    | card-flip-1.mp3 |
    | card-flip-2.mp3 |
    | card-flip-3.mp3 |
  When a card flips
  Then one sound should be randomly selected
  And the selected sound should play
  And the volume should be 0.4
  When another card flips
  Then a random sound should be selected again
  And it may be the same or different from previous
```

## Scenario: Letter Pronunciation on Flip

```gherkin
Scenario: Letter name is spoken when card reveals
  Given a card has letter "M"
  And letter pronunciation audio is enabled
  When the card flips face-up
  And the flip animation completes
  Then 'letter-m' sound should play
  And the volume should be 0.5
  And the sound should play 200ms after flip
  And the pronunciation should be clear
```

## Scenario: Letter Sound Files

```gherkin
Scenario: All letter sounds are available
  Given the preload() method loads letter sounds
  Then sounds for all 26 letters should be loaded:
    | Letter | Sound File    |
    | A      | letter-a.mp3  |
    | B      | letter-b.mp3  |
    | ...    | ...           |
    | Z      | letter-z.mp3  |
  And each sound should be clear pronunciation
  And each sound should be child-friendly voice
```

## Feature: Performance Optimization

```gherkin
Feature: Smooth Performance
  As a player
  I want the game to run smoothly
  So that I don't experience lag

Background:
  Given MemoryMatchScene is active
  And performance optimizations are enabled
```

## Scenario: Texture Atlas Loading

```gherkin
Scenario: Images loaded efficiently via atlas
  Given multiple object images are needed
  When preload() is called
  Then a texture atlas should be loaded
  And the atlas should contain all 26 object images
  And the atlas file should be 'objects.png'
  And the atlas data should be 'objects.json'
  And loading should be faster than individual files
  And rendering should use fewer draw calls
```

## Scenario: Particle Object Pooling

```gherkin
Scenario: Particle emitter is reused
  Given a particle emitter is created in create()
  When the first match occurs
  Then the emitter should be positioned and triggered
  When the second match occurs
  Then the same emitter should be repositioned
  And the same emitter should be triggered again
  And no new emitter should be created
  And memory usage should remain constant
```

## Scenario: Tween Cleanup on Scene Exit

```gherkin
Scenario: No memory leaks from animations
  Given the scene has active tweens
  And background music is playing
  When the scene shutdown() is called
  Then this.tweens.killAll() should be called
  And all active tweens should be stopped
  And all tween targets should be released
  And the background music should stop
  And no animations should continue in memory
```

## Scenario: Performance Metrics

```gherkin
Scenario: Game maintains 60 FPS
  Given the scene is fully loaded
  And all cards are interactive
  And background music is playing
  And particles may trigger occasionally
  When the game is running
  Then the frame rate should be 60 FPS
  And the frame rate should not drop below 55 FPS
  And no stuttering should occur during animations
  And card flips should be smooth
  And particles should animate smoothly
```

## Acceptance Criteria

### Enhanced Animations
- [ ] Hover rotates card 5 degrees
- [ ] Hover scales card to 1.1
- [ ] Glow effect on hover
- [ ] Glow expands and fades
- [ ] Cards lift during flip
- [ ] Match pop effect with Elastic easing
- [ ] Smooth transitions throughout

### Letter-Object Content
- [ ] All 26 letters mapped to objects
- [ ] Data structure includes name, image, color
- [ ] Images preloaded correctly
- [ ] Image displays on card face (top)
- [ ] Letter displays on card face (center)
- [ ] Object name displays on card face (bottom)
- [ ] All elements visible when face-up
- [ ] All elements hidden when face-down

### Background Music
- [ ] Music loads and plays on scene start
- [ ] Music loops seamlessly
- [ ] Music fades in over 2 seconds
- [ ] Volume is 0.3 (not too loud)
- [ ] Music fades out on scene exit
- [ ] Music stops completely after fade

### Difficulty Levels
- [ ] Three difficulties available: Easy, Medium, Hard
- [ ] Easy: 6 pairs, 1500ms delay, A-F letters, preview
- [ ] Medium: 6 pairs, 1000ms delay, A-L letters, no preview
- [ ] Hard: 8 pairs (4x4), 800ms delay, A-Z letters, no preview
- [ ] Difficulty selection UI functional
- [ ] Settings apply correctly per difficulty
- [ ] Preview mode works in Easy
- [ ] Mismatch delays vary correctly

### Visual Polish
- [ ] Card shadows visible and subtle
- [ ] Match trail effect connects cards
- [ ] Scene entry animation smooth
- [ ] Cards fly in sequentially
- [ ] Camera fades in
- [ ] All animations feel professional

### Sound Design
- [ ] Three flip sound variations
- [ ] Random selection works
- [ ] Letter pronunciation plays (optional)
- [ ] All 26 letter sounds available
- [ ] Sounds are clear and child-friendly

### Performance
- [ ] Texture atlas used for efficiency
- [ ] Particle emitter reused
- [ ] Tweens cleaned up on exit
- [ ] No memory leaks
- [ ] 60 FPS maintained
- [ ] No lag during gameplay
- [ ] Smooth throughout

## Edge Cases to Test

```gherkin
Scenario: Rapid Hovering
  Given multiple cards are displayed
  When the player rapidly moves mouse across all cards
  Then each hover effect should trigger correctly
  And glow effects should not accumulate
  And old glows should be destroyed
  And performance should remain smooth

Scenario: Music Interruption
  Given background music is playing
  When the browser tab loses focus
  Then the music should continue or pause gracefully
  When the tab regains focus
  Then the music should resume if it was playing

Scenario: Missing Image Asset
  Given a card requires image "apple.png"
  But the image file is missing
  When the card loads
  Then a placeholder image should be used
  And no errors should appear in console
  And the game should still be playable

Scenario: Hard Mode with Many Cards
  Given Hard mode is selected
  And 16 cards are created (4x4 grid)
  When all cards are flipping and animating
  Then performance should remain at 60 FPS
  And no lag should occur
  And animations should be smooth

Scenario: Scene Rapid Exit
  Given the scene entry animation is playing
  And cards are flying in
  When the player immediately clicks "Back"
  Then the scene should exit cleanly
  And animations should be killed
  And no errors should occur
```

## Manual Testing Checklist

### Animation Testing
1. [ ] Hover over multiple cards
2. [ ] Verify rotation and scale
3. [ ] Verify glow appears and fades
4. [ ] Flip cards and verify lift effect
5. [ ] Match cards and verify pop effect
6. [ ] Test scene entry animation

### Content Testing
7. [ ] Flip cards with different letters
8. [ ] Verify images appear (A=Apple, B=Ball, etc.)
9. [ ] Verify letter displays correctly
10. [ ] Verify object name displays
11. [ ] Check all 26 letters have images

### Music Testing
12. [ ] Start scene - verify music plays
13. [ ] Listen for 2 minutes - verify loops
14. [ ] Exit scene - verify fade out
15. [ ] Check volume is not too loud/soft

### Difficulty Testing
16. [ ] Select Easy - verify 6 pairs, preview
17. [ ] Time mismatch delay (should be 1.5s)
18. [ ] Select Medium - verify 6 pairs, no preview
19. [ ] Time mismatch delay (should be 1.0s)
20. [ ] Select Hard - verify 8 pairs, 4x4 grid
21. [ ] Time mismatch delay (should be 0.8s)

### Visual Polish Testing
22. [ ] Check card shadows visible
23. [ ] Match two cards - verify trail line
24. [ ] Restart scene - verify cards fly in
25. [ ] Verify camera fade in

### Sound Testing
26. [ ] Flip multiple cards rapidly
27. [ ] Verify different flip sounds
28. [ ] If enabled, verify letter pronunciation
29. [ ] Listen to all sounds for quality

### Performance Testing
30. [ ] Monitor FPS (should be 60)
31. [ ] Play full game on Hard mode
32. [ ] Trigger many particles
33. [ ] Verify no slowdown
34. [ ] Check memory usage stable

## Success Criteria

**This phase is complete when:**
1. All animations enhanced and smooth
2. All 26 letter-object pairs working
3. Images display correctly on cards
4. Background music plays and loops
5. Three difficulty levels functional
6. Visual polish implemented
7. Sound design enhanced
8. Performance optimized to 60 FPS
9. All acceptance criteria met
10. No console errors
11. Ready for production release

## Notes

**Phase 36 Focus**
- Polish and refinement
- Educational content integration
- Accessibility and options
- Professional presentation

**Quality Checklist**
- Does it look professional? ✓
- Does it sound good? ✓
- Is it educational? ✓
- Is it accessible? ✓
- Is it performant? ✓
- Is it fun? ✓

**ADHD Optimizations**
- Multiple difficulty levels
- Preview mode for Easy
- Clear visual feedback
- Engaging animations
- Calm background music
- Varied audio (not repetitive)

**Production Ready**
- All systems polished
- Content complete
- Performance optimized
- Accessibility considered
- Ready for Aurora and others
