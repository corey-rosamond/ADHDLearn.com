# Phase 34: Memory Match - Card Flip Mechanic - BDD Scenarios

## Feature: Card Flip Animation

```gherkin
Feature: Interactive Card Flipping
  As a player
  I want to flip cards with a smooth animation
  So that I can see the letters and play the memory game

Background:
  Given the MemoryMatchScene is active
  And 12 cards are displayed face-down
  And Card.js class exists in src/objects/
  And flip sound effects are loaded
```

## Scenario: Create Card Class

```gherkin
Scenario: Initialize Card object
  Given a card position (x, y) is provided
  And card data { letter: "A", type: "letter", id: "A-1" } is provided
  And an index number is provided
  When a new Card(scene, x, y, cardData, index) is created
  Then the Card should extend Phaser.GameObjects.Container
  And the Card should be added to the scene
  And the Card should be positioned at (x, y)
  And the Card should have size 100x140
  And the Card should have depth 10
  And the Card should store the cardData
  And the Card should store the index
  And the Card should initialize flipped = false
  And the Card should initialize matched = false
  And the Card should initialize isFlipping = false
```

## Scenario: Create Card Sprites

```gherkin
Scenario: Card contains back and front sprites
  Given a Card object is created
  When createCardSprites() is called
  Then a back sprite should be created
  And the back sprite should use 'card-back' texture
  And the back sprite should be visible
  And the back sprite should be centered (origin 0.5)
  And a front sprite should be created
  And the front sprite should use 'card-front-bg' texture
  And the front sprite should be hidden initially
  And the front sprite should be centered (origin 0.5)
  And a letter text should be created
  And the letter text should display the card's letter (uppercase)
  And the letter text should be hidden initially
  And the letter text should have fontSize "64px"
  And the letter text should be bold
  And the letter text should have color "#2c3e50"
  And all children should be added to the container
```

## Scenario: Generate Card Front Texture

```gherkin
Scenario: Create card front background texture
  When the first Card is created
  And createFrontBackground() is called
  Then a Graphics object should be created
  And it should draw a rounded rectangle 100x140
  And the rectangle should have corner radius 10
  And the rectangle should be filled white (0xffffff)
  And the rectangle should have a blue border (0x2980b9)
  And the border width should be 4 pixels
  And a texture 'card-front-bg' should be generated
  And the texture should be 100x140 pixels
  And the graphics object should be destroyed
  When subsequent Cards are created
  Then the existing texture should be reused
  And no new texture should be generated
```

## Scenario: Setup Card Interaction

```gherkin
Scenario: Card is interactive with hover effects
  Given a Card object is created
  When setupInteraction() is called
  Then the card should be set as interactive
  And the interactive area should be 100x140 rectangle
  And the cursor should change to pointer on hover
  And hover event handlers should be registered
  And the card should scale to 1.05 on pointerover
  And the scale tween duration should be 100ms
  And the card should scale to 1.0 on pointerout
  And hover effects should be disabled if card is flipped
  And hover effects should be disabled if card is matched
  And hover effects should be disabled if card is flipping
```

## Scenario: Flip Card Face Up

```gherkin
Scenario: Player flips card to reveal letter
  Given a card is face-down
  And the card is not flipping
  And the card is not matched
  When flip(true, 300) is called
  Then isFlipping should be set to true
  And 'card-flip' sound should play at volume 0.4
  And a tween should animate scaleX from 1 to 0
  And the tween duration should be 150ms
  And the tween easing should be 'Sine.easeIn'
  When scaleX reaches 0 (midpoint)
  Then backSprite visibility should be set to false
  And frontSprite visibility should be set to true
  And letterText visibility should be set to true
  And a second tween should animate scaleX from 0 to 1
  And the second tween duration should be 150ms
  And the second tween easing should be 'Sine.easeOut'
  When scaleX reaches 1 (flip complete)
  Then flipped should be set to true
  And isFlipping should be set to false
  And a bounce tween should play (scaleY 1.0 → 1.05 → 1.0)
  And the bounce duration should be 100ms with yoyo
  And 'flipComplete' event should be emitted
```

## Scenario: Flip Animation Timing

```gherkin
Scenario: Flip animation completes in 300ms
  Given a card is face-down
  When flip(true, 300) is called at time T
  Then at time T+150ms the card should be at midpoint (scaleX: 0)
  And at time T+150ms sprites should swap visibility
  And at time T+300ms the card should be face-up (scaleX: 1)
  And at time T+300ms the flip should be complete
  And at time T+400ms the bounce effect should complete
  And the total animation time should be approximately 400ms
```

## Scenario: Flip Card Face Down

```gherkin
Scenario: Card flips back to face-down
  Given a card is face-up
  And the card is not matched
  When flip(false, 300) is called
  Then the same two-phase animation should play
  But in reverse (front → back)
  And backSprite should become visible at midpoint
  And frontSprite should become hidden at midpoint
  And letterText should become hidden at midpoint
  And flipped should be set to false
  And no bounce effect should play (only on face-up)
```

## Scenario: Prevent Double Flip

```gherkin
Scenario: Cannot flip card while already flipping
  Given a card is face-down
  When flip(true) is called
  And the animation is in progress (isFlipping = true)
  And flip(true) is called again during animation
  Then the second flip call should return immediately
  And no second animation should start
  And isFlipping should remain true until first flip completes
```

## Scenario: Cannot Flip Matched Card

```gherkin
Scenario: Matched cards cannot be flipped
  Given a card is face-up
  And the card has matched = true
  When flip(false) is called
  Then the flip call should return immediately
  And no animation should play
  And the card should remain face-up
```

## Scenario: Card Hover During Flip

```gherkin
Scenario: Hover effects disabled during flip
  Given a card is flipping (isFlipping = true)
  When the mouse hovers over the card
  Then no scale effect should occur
  And the card scale should remain as per flip animation
  When the mouse moves away
  Then no scale change should occur
```

## Scenario: Set Card as Matched

```gherkin
Scenario: Mark card as matched
  Given a card is face-up
  When setMatched() is called
  Then matched should be set to true
  And the card should be disabled (not interactive)
  And a fade tween should play
  And the card alpha should animate to 0.7
  And the fade duration should be 300ms
  And the easing should be 'Sine.easeOut'
```

## Scenario: Reset Card

```gherkin
Scenario: Reset card to initial state
  Given a card has been flipped or matched
  When reset() is called
  Then flipped should be set to false
  And matched should be set to false
  And isFlipping should be set to false
  And the card should be set as interactive
  And alpha should be set to 1
  And scale should be set to 1
  And backSprite should be visible
  And frontSprite should be hidden
  And letterText should be hidden
```

## Feature: Scene Integration

```gherkin
Feature: Memory Match Scene Uses Card Class
  As the game
  I want the scene to use Card objects
  So that cards have proper flip animations

Background:
  Given MemoryMatchScene is active
  And Card.js is imported
```

## Scenario: Create Card Grid with Card Objects

```gherkin
Scenario: Scene creates Card instances instead of sprites
  Given the scene has initialized card data
  And the grid layout is calculated
  When createCardGrid() is called
  Then 12 Card objects should be created
  And each Card should be positioned according to grid layout
  And each Card should receive correct cardData
  And each Card should receive correct index
  And each Card should have a click handler
  And all Cards should be stored in this.cards array
  And the console should log "Created 12 Card objects"
```

## Scenario: Click Card to Flip

```gherkin
Scenario: Player clicks card and it flips
  Given a card is face-down
  And canFlip is true
  And the card is not matched
  And fewer than 2 cards are flipped
  When the player clicks the card
  Then onCardClick(card) should be called
  And 'card-select' sound should play at volume 0.3
  And the card should flip face-up (call flip(true))
  And the card should be added to flippedCards array
  And flippedCards.length should increase by 1
  And the console should log "Flipped card: [index] [letter]"
```

## Scenario: Two Card Selection Limit

```gherkin
Scenario: Only 2 cards can be flipped at once
  Given no cards are flipped
  And canFlip is true
  When the player flips the first card
  Then flippedCards.length should be 1
  And canFlip should remain true
  When the player flips a second card
  Then flippedCards.length should be 2
  And canFlip should be set to false
  And the console should log "Two cards flipped"
  When the player tries to click a third card
  Then the click should be ignored
  And no flip animation should occur
  And flippedCards.length should remain 2
  And the console should log "Cannot flip - waiting for match check"
```

## Scenario: Placeholder Auto Flip-Back

```gherkin
Scenario: Cards flip back after 1 second (Phase 34 placeholder)
  Given 2 cards are flipped face-up
  And canFlip is false
  And flippedCards = [card1, card2]
  When 1000ms have elapsed
  Then card1 should flip face-down (call flip(false))
  And card2 should flip face-down (call flip(false))
  And flippedCards array should be cleared (length = 0)
  And canFlip should be set to true
  And the console should log "Flipping cards back (placeholder)"
  And players can click cards again
```

## Scenario: Ignore Click on Flipped Card

```gherkin
Scenario: Cannot click already flipped card
  Given a card is face-up (flipped = true)
  When the player clicks the card
  Then onCardClick should check card.flipped
  And the click should be ignored
  And no flip animation should occur
  And the console should log "Card already flipped"
```

## Scenario: Ignore Click on Matched Card

```gherkin
Scenario: Cannot click matched card
  Given a card has matched = true
  When the player clicks the card
  Then onCardClick should check card.matched
  And the click should be ignored
  And no flip animation should occur
  And the console should log "Card already matched"
```

## Scenario: Ignore Click When Input Disabled

```gherkin
Scenario: Cannot flip when canFlip is false
  Given canFlip is false (2 cards already flipped)
  And a face-down card is visible
  When the player clicks the card
  Then onCardClick should check canFlip
  And the click should be ignored
  And no flip animation should occur
  And the console should log "Cannot flip - waiting for match check"
```

## Feature: Sound Effects

```gherkin
Feature: Card Flip Sound Effects
  As a player
  I want to hear sounds when I interact with cards
  So that I get audio feedback for my actions

Background:
  Given the AudioManager is loaded
  And sound files are preloaded
```

## Scenario: Preload Flip Sounds

```gherkin
Scenario: Scene loads card sound effects
  Given MemoryMatchScene is loading
  When the preload() method runs
  Then 'card-flip.mp3' should be loaded
  And 'card-select.mp3' should be loaded
  And both sounds should be ready to play
```

## Scenario: Play Flip Sound

```gherkin
Scenario: Flip sound plays when card flips
  Given a card is face-down
  When flip(true) is called
  Then 'card-flip' sound should play
  And the volume should be 0.4
  And the sound should start immediately
  And the sound duration should be approximately 100-200ms
```

## Scenario: Play Select Sound

```gherkin
Scenario: Select sound plays when card is clicked
  Given a card is clickable
  When the player clicks the card
  Then 'card-select' sound should play
  And the volume should be 0.3
  And the sound should play before flip animation
```

## Scenario: No Sound Overlap Issues

```gherkin
Scenario: Multiple flips don't cause audio problems
  Given multiple cards can flip simultaneously
  When card 1 flips and plays flip sound
  And card 2 flips immediately after
  Then both flip sounds should play
  And sounds should not clip or distort
  And sounds should blend naturally
```

## Acceptance Criteria

### Card Class
- [ ] Card.js exists in src/objects/
- [ ] Card extends Phaser.GameObjects.Container
- [ ] Card constructor accepts (scene, x, y, cardData, index)
- [ ] Card initializes all required properties
- [ ] Card creates back sprite correctly
- [ ] Card creates front sprite correctly
- [ ] Card creates letter text correctly
- [ ] All sprites added to container

### Flip Animation
- [ ] flip(faceUp, duration) method exists
- [ ] Animation is two-phase (shrink then expand)
- [ ] Phase 1: scaleX 1 → 0, 150ms, Sine.easeIn
- [ ] Phase 2: scaleX 0 → 1, 150ms, Sine.easeOut
- [ ] Sprites swap at midpoint (scaleX = 0)
- [ ] Back visible when face-down
- [ ] Front and letter visible when face-up
- [ ] Total animation time is 300ms
- [ ] Bounce effect plays after flip-up
- [ ] No bounce on flip-down
- [ ] isFlipping flag prevents double-flip
- [ ] flipComplete event emitted

### Card Front Design
- [ ] White background (0xffffff)
- [ ] Rounded corners (10px radius)
- [ ] Blue border (0x2980b9, 4px)
- [ ] Letter displays in center
- [ ] Letter is uppercase
- [ ] Letter fontSize is 64px
- [ ] Letter is bold
- [ ] Letter color is dark (#2c3e50)
- [ ] Letter is readable and clear

### Interaction
- [ ] Card is interactive
- [ ] Cursor changes to pointer
- [ ] Hover scales to 1.05
- [ ] Hover disabled during flip
- [ ] Hover disabled on matched cards
- [ ] Click triggers onCardClick in scene
- [ ] Matched cards are non-interactive

### Scene Integration
- [ ] MemoryMatchScene imports Card class
- [ ] createCardGrid() creates Card objects
- [ ] 12 Card instances created
- [ ] Cards positioned correctly
- [ ] Click handlers attached
- [ ] Cards stored in this.cards array

### Two-Card Limit
- [ ] flippedCards array tracks selections
- [ ] Maximum 2 cards in flippedCards
- [ ] Third click is ignored
- [ ] canFlip flag disables input after 2 flips
- [ ] Validation checks work correctly

### Click Validation
- [ ] Cannot flip if canFlip is false
- [ ] Cannot flip if card.flipped is true
- [ ] Cannot flip if card.matched is true
- [ ] Cannot flip if 2 cards already flipped
- [ ] Cannot flip if card is flipping
- [ ] Invalid clicks logged to console
- [ ] Valid clicks proceed with flip

### Placeholder Logic
- [ ] After 2 cards flipped, wait 1000ms
- [ ] Both cards flip back face-down
- [ ] flippedCards array cleared
- [ ] canFlip set to true
- [ ] Players can click again
- [ ] Console logs placeholder message

### Sound Effects
- [ ] card-flip.mp3 preloaded
- [ ] card-select.mp3 preloaded
- [ ] Flip sound plays on flip animation
- [ ] Select sound plays on click
- [ ] Volumes are appropriate (0.3-0.4)
- [ ] No audio distortion or clipping

### State Management
- [ ] setMatched() works correctly
- [ ] Matched cards fade to alpha 0.7
- [ ] Matched cards become non-interactive
- [ ] reset() restores initial state
- [ ] All boolean flags managed correctly

### Visual Quality
- [ ] Flip animation is smooth at 60fps
- [ ] No stuttering or jank
- [ ] Sprites swap invisibly at midpoint
- [ ] Bounce effect is subtle and satisfying
- [ ] Letters are crisp and readable
- [ ] Rounded corners visible

### Performance
- [ ] 60fps maintained during flips
- [ ] Multiple simultaneous flips handled
- [ ] No memory leaks
- [ ] Tweens cleaned up properly
- [ ] No console errors or warnings

## Edge Cases to Test

```gherkin
Scenario: Rapid Clicking Same Card
  Given a card is face-down
  When the player rapidly clicks the same card 5 times
  Then only one flip should occur
  And isFlipping should prevent additional flips
  And the card should end up face-up

Scenario: Click During Midpoint
  Given a card is flipping
  When the animation is at midpoint (scaleX = 0)
  And the player clicks the card
  Then the click should be ignored
  And the animation should complete normally

Scenario: Hover During Flip Animation
  Given a card is flipping
  When the player hovers over the card mid-flip
  Then no scale change should occur
  And the flip animation should continue unaffected

Scenario: Scene Exit During Flip
  Given a card is flipping
  When the player clicks the back button
  And the scene transitions away
  Then the tween should be properly cleaned up
  And no errors should occur

Scenario: Very Fast Flipping
  Given two cards are face-down
  When the player clicks both cards rapidly (within 50ms)
  Then both cards should flip
  And both should be tracked in flippedCards
  And canFlip should be set to false
  And the placeholder flip-back should work correctly

Scenario: Matched Card Click Attempt
  Given a card is matched (alpha 0.7, non-interactive)
  When the player attempts to click the card
  Then the click should be ignored
  And no flip should occur
  And no error should occur

Scenario: Reset During Flip
  Given a card is flipping
  When reset() is called mid-animation
  Then the animation should stop
  And the card should return to initial state
  And no visual artifacts should remain
```

## Manual Testing Checklist

### Setup
1. [ ] Ensure Card.js in src/objects/
2. [ ] Ensure MemoryMatchScene imports Card
3. [ ] Ensure sound files in assets/audio/
4. [ ] Start game and enter MemoryMatchScene

### Visual Testing
5. [ ] Verify 12 cards displayed face-down
6. [ ] Click first card
7. [ ] Watch flip animation carefully
8. [ ] Verify smooth horizontal shrink
9. [ ] Verify card appears to rotate
10. [ ] Verify letter appears on white background
11. [ ] Verify rounded corners visible
12. [ ] Verify subtle bounce at end
13. [ ] Time animation (should be ~300ms)

### Interaction Testing
14. [ ] Hover over face-down card
15. [ ] Verify scale to 1.05
16. [ ] Click card
17. [ ] Verify flip animation
18. [ ] Hover over flipping card
19. [ ] Verify no scale effect during flip
20. [ ] Hover over face-up card
21. [ ] Verify no scale effect (flipped)

### Two-Card Testing
22. [ ] Flip first card
23. [ ] Verify it stays face-up
24. [ ] Flip second card
25. [ ] Verify both are face-up
26. [ ] Try to click third card
27. [ ] Verify click is ignored
28. [ ] Wait 1 second
29. [ ] Verify both flip back automatically
30. [ ] Verify can click cards again

### Sound Testing
31. [ ] Click card
32. [ ] Verify select sound plays
33. [ ] Verify flip sound plays
34. [ ] Click another card quickly
35. [ ] Verify both sounds play without issues
36. [ ] Check volume levels (not too loud)

### Edge Case Testing
37. [ ] Rapidly click same card 10 times
38. [ ] Verify only flips once
39. [ ] Click card mid-flip
40. [ ] Verify click ignored
41. [ ] Flip 2 cards very quickly
42. [ ] Verify both flip correctly
43. [ ] Verify flip-back works

### Console Testing
44. [ ] Open browser console
45. [ ] Click cards and observe logs
46. [ ] Verify "Flipped card" messages
47. [ ] Verify "Two cards flipped" message
48. [ ] Verify "Flipping cards back" message
49. [ ] Verify no error messages
50. [ ] Verify no warnings

### Performance Testing
51. [ ] Monitor frame rate (should be 60fps)
52. [ ] Flip multiple cards in sequence
53. [ ] Verify no lag or stuttering
54. [ ] Check memory usage (F12 Performance tab)
55. [ ] Play for 5 minutes
56. [ ] Verify no memory leaks

## Success Criteria

**This phase is complete when:**
1. Card class fully implemented
2. Flip animation smooth and satisfying
3. 3D rotation effect looks professional
4. Letters reveal clearly on card face
5. Two-card selection limit enforced
6. Sound effects play correctly
7. Hover effects work as expected
8. All validation checks prevent invalid actions
9. Placeholder flip-back works
10. No console errors or warnings
11. 60fps performance maintained
12. All acceptance criteria met
13. Ready for Phase 35 (match logic)

## Notes

**Phase 34 Scope**
- Focus: Flip animation and card interaction
- No match detection yet (Phase 35)
- Placeholder delay shows animation works
- Proving cards can flip and be controlled

**Testing Priority**
- Animation smoothness is critical
- Timing must feel right (300ms)
- Two-card limit must be solid
- Sound timing must be precise

**ADHD Considerations**
- 300ms flip feels responsive
- Immediate audio feedback
- Clear visual feedback
- Two-card limit prevents overwhelm
- Smooth animation maintains attention
- Bounce effect is rewarding
