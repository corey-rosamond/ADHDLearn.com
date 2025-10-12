# Phase 31: Letter Builder - Snap and Complete Logic - BDD Scenarios

## Feature: Snap and Complete Logic

```gherkin
Feature: Snap and Complete Logic
  As Aurora
  I want pieces to snap into place when I drag them correctly
  So that I can complete letters and feel successful

Background:
  Given LetterBuilderScene is loaded with letter "A"
  And there are 3 draggable pieces
  And snap zones are defined for all 3 pieces
```

## Scenario: Snap Zone Detection

```gherkin
Scenario: Piece snaps when released near correct zone
  Given I am dragging the left diagonal piece
  When I release the piece within 60px of its snap zone
  Then the piece should snap to the zone center
  And the snap animation should take 350ms
  And a snap sound should play
  And the piece should be locked (not draggable)

Scenario: Piece returns when released far from zone
  Given I am dragging the left diagonal piece
  When I release the piece 100px away from any snap zone
  Then the piece should return to its original position
  And the return animation should take 300ms
  And a release sound should play
```

## Scenario: Snap Animation

```gherkin
Scenario: Smooth magnetic snap with visual feedback
  Given a piece is within snap threshold
  When the snap is triggered
  Then the piece should animate to zone center
  And the animation should use "Back.easeOut" easing
  And the piece should pulse (scale 1.0 → 1.15 → 1.0)
  And snap particles should appear at zone position
  And the snap sound should play at 50% volume
```

## Scenario: Lock Snapped Piece

```gherkin
Scenario: Snapped piece cannot be dragged again
  Given a piece has snapped to its zone
  Then piece.isSnapped should be true
  And piece.snapZone should reference the zone
  And the piece should be non-interactive
  And the cursor should not change to pointer on hover
  And the piece should have full opacity (alpha 1.0)
```

## Scenario: Completion Detection

```gherkin
Scenario: Detect when all pieces are snapped
  Given letter "A" requires 3 pieces
  And 2 pieces are already snapped
  When I snap the 3rd and final piece
  Then checkLetterComplete() should return true
  And the celebration sequence should trigger immediately
```

## Scenario: Celebration Sequence

```gherkin
Scenario: Celebrate successful letter completion
  Given all pieces are snapped
  When the celebration starts
  Then a success sound should play at 60% volume
  And congratulations audio should play ("Great job! You built the letter A!")
  And celebration particles should explode from letter center (40 particles)
  And the letter outline should flash (alpha 1.0 ↔ 0.5, 3 times)
  And "★ Success! ★" text should appear
  And the score should increase by 50 points
  And after 2.5 seconds, the next letter should load
```

## Scenario: Progress Through Multiple Letters

```gherkin
Scenario: Complete 5 letters in a round
  Given I am on letter 1 of 5
  When I complete the first letter
  Then the progress should update to "2/5"
  And letter 2 should load

  When I complete letters 2, 3, and 4
  Then the progress should update to "5/5"
  And letter 5 should load

  When I complete letter 5
  Then the round complete screen should appear
```

## Scenario: Round Complete Screen

```gherkin
Scenario: Show completion screen after 5 letters
  Given I have completed all 5 letters
  And my total score is 250 points
  When the round complete screen appears
  Then "Round Complete!" text should display
  And "Score: 250" should display
  And a "Play Again" button should be present
  And a "Back to Menu" button should be present

  When I click "Play Again"
  Then the scene should restart with new letters

  When I click "Back to Menu"
  Then I should return to MainMenuScene
```

## Scenario: Zone Occupancy

```gherkin
Scenario: Only one piece per snap zone
  Given the left diagonal zone is already occupied
  When I try to drag another piece to that zone
  Then the zone should be skipped in snap detection
  And the piece should not snap to the occupied zone
```

## Acceptance Criteria

### Must Have
- [ ] Snap zones defined for all letters
- [ ] Snap detection works (distance < threshold)
- [ ] Pieces snap with smooth animation
- [ ] Snap sound plays
- [ ] Snapped pieces are locked
- [ ] Completion detection works
- [ ] Celebration sequence plays
- [ ] Next letter loads automatically
- [ ] 5-letter round progression works
- [ ] Round complete screen displays
- [ ] Play Again and Back to Menu work

## Success Criteria

**Complete when:**
1. Pieces snap correctly to zones
2. Completion detected and celebrated
3. 5-letter rounds work start to finish
4. All acceptance criteria met
5. Ready for Phase 32 (polish)
