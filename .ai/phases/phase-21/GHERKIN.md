# Phase 21: Responsive Design - BDD Scenarios

## Feature: Responsive Canvas Scaling

```gherkin
Feature: Game Canvas Scales to Different Screen Sizes
  As a player on any device
  I want the game canvas to fit my screen
  So that I can play comfortably on desktop, tablet, or phone

Background:
  Given the game uses Phaser Scale Manager in FIT mode
  And the base game size is 800x600 pixels
```

## Scenario: Desktop Display (Baseline)

```gherkin
Scenario: Game displays correctly on desktop
  Given the browser window is 1920x1080 pixels
  When the game loads
  Then the canvas should scale to fit the window
  And the canvas aspect ratio should be maintained
  And the canvas should be centered horizontally
  And the canvas should be centered vertically
  And no stretching or distortion should occur
```

## Scenario: iPad Portrait Mode

```gherkin
Scenario: Game scales for iPad portrait
  Given the device is an iPad in portrait orientation
  And the screen size is 768x1024 pixels
  When the game loads
  Then the canvas should scale to fit 768x1024
  And the aspect ratio should be preserved
  And letterboxing should be added if needed
  And the canvas should be centered
  And all UI elements should be visible
```

## Scenario: iPad Landscape Mode

```gherkin
Scenario: Game scales for iPad landscape
  Given the device is an iPad in landscape orientation
  And the screen size is 1024x768 pixels
  When the game loads
  Then the canvas should scale to fit 1024x768
  And the aspect ratio should be preserved
  And the canvas should fill most of the screen
  And the canvas should be centered
```

## Scenario: iPhone Portrait Mode

```gherkin
Scenario: Game scales for iPhone portrait
  Given the device is an iPhone SE
  And the screen size is 375x667 pixels
  When the game loads
  Then the canvas should scale to fit 375x667
  And the aspect ratio should be preserved
  And letterboxing should be added (top/bottom)
  And the canvas should be centered
  And all text should be readable
```

## Scenario: Android Phone Portrait

```gherkin
Scenario: Game scales for Android phone
  Given the device is an Android phone
  And the screen size is 360x640 pixels
  When the game loads
  Then the canvas should scale to fit 360x640
  And the aspect ratio should be preserved
  And the canvas should be centered
  And all UI should fit within viewport
```

## Feature: Orientation Change Handling

```gherkin
Feature: Smooth Orientation Changes
  As a tablet user
  I want the game to adapt when I rotate my device
  So that I can play in portrait or landscape

Background:
  Given the game is loaded on an iPad
  And orientation change detection is enabled
```

## Scenario: Rotate from Portrait to Landscape

```gherkin
Scenario: iPad rotation to landscape
  Given the game is running in portrait mode (768x1024)
  When the device is rotated to landscape orientation
  Then an orientationchange event should fire
  And the ScaleManager should detect the new dimensions (1024x768)
  And the canvas should resize smoothly
  And UI elements should reposition for landscape
  And the game should remain playable
  And no errors should occur
```

## Scenario: Rotate from Landscape to Portrait

```gherkin
Scenario: iPad rotation to portrait
  Given the game is running in landscape mode (1024x768)
  When the device is rotated to portrait orientation
  Then an orientationchange event should fire
  And the ScaleManager should detect the new dimensions (768x1024)
  And the canvas should resize smoothly
  And UI elements should reposition for portrait
  And the game should remain playable
```

## Scenario: Rapid Orientation Changes

```gherkin
Scenario: Multiple rapid rotations
  Given the game is running on a tablet
  When the user rotates the device multiple times rapidly
  Then each orientation change should be handled
  And the canvas should resize each time
  And no layout glitches should occur
  And the game should remain stable
  And no console errors should be logged
```

## Feature: Touch Input Support

```gherkin
Feature: Touch Input for Mobile Devices
  As a mobile player
  I want to interact with the game using touch
  So that I can play without a mouse

Background:
  Given the game is loaded on a touch-enabled device
  And touch input is enabled
```

## Scenario: Tap a Bubble

```gherkin
Scenario: Touch input on game bubble
  Given the Letter Pop game is running
  And bubbles are displayed on screen
  When the player taps a bubble with their finger
  Then a pointerdown event should fire
  And the bubble should register as clicked
  And the appropriate feedback should play (wobble or celebrate)
  And the tap should feel responsive (< 50ms delay)
```

## Scenario: Tap a Button

```gherkin
Scenario: Touch input on menu button
  Given the main menu is displayed
  And buttons are visible
  When the player taps the "Start Game" button
  Then the button should respond immediately
  And the game should navigate to the game scene
  And the tap should feel natural (no lag)
```

## Scenario: Drag a Slider

```gherkin
Scenario: Touch drag on settings slider
  Given the settings scene is open
  And volume sliders are displayed
  When the player drags the music slider with their finger
  Then the slider should follow the finger
  And the slider fill should update in real-time
  And the percentage should update continuously
  And the drag should feel smooth (60fps)
```

## Scenario: Accidental Double-Tap

```gherkin
Scenario: Prevent double-tap zoom
  Given the game is loaded on a mobile browser
  And the player double-taps the screen
  Then the browser should not zoom in
  And the default zoom behavior should be prevented
  And the game should remain at normal scale
```

## Scenario: Prevent Pull-to-Refresh

```gherkin
Scenario: Disable pull-to-refresh gesture
  Given the game is loaded on a mobile browser
  When the player drags down from the top of the screen
  Then the pull-to-refresh gesture should be disabled
  And the page should not reload
  And the game should continue running normally
```

## Feature: Touch Target Sizing

```gherkin
Feature: Finger-Friendly Touch Targets
  As a mobile player
  I want buttons and bubbles to be easy to tap
  So that I don't miss or misclick

Background:
  Given the game is loaded on a mobile device
  And touch targets are sized appropriately
```

## Scenario: Desktop Button Size

```gherkin
Scenario: Buttons on desktop are mouse-sized
  Given the game is loaded on a desktop browser
  When buttons are created
  Then button height should be 50 pixels
  And button width should be appropriate for text
  And buttons should be easy to click with mouse
```

## Scenario: Tablet Button Size

```gherkin
Scenario: Buttons on tablet are finger-sized
  Given the game is loaded on an iPad
  When buttons are created
  Then button height should be 60 pixels
  And button width should be appropriate for text
  And buttons should be easy to tap with finger
  And buttons should meet minimum touch target size (44x44px)
```

## Scenario: Phone Button Size

```gherkin
Scenario: Buttons on phone are larger for small screens
  Given the game is loaded on an iPhone
  When buttons are created
  Then button height should be 70 pixels
  And button width should be appropriate for text
  And buttons should be very easy to tap
  And buttons should exceed minimum touch target size
```

## Scenario: Bubble Size on Desktop

```gherkin
Scenario: Game bubbles are mouse-sized on desktop
  Given the Letter Pop game is running on desktop
  When bubbles are created
  Then bubble radius should be 40 pixels
  And bubbles should be easy to click with mouse
  And letter text inside should be readable
```

## Scenario: Bubble Size on Mobile

```gherkin
Scenario: Game bubbles are finger-sized on mobile
  Given the Letter Pop game is running on a phone
  When bubbles are created
  Then bubble radius should be 60 pixels
  And bubbles should be easy to tap with finger
  And letter text inside should be clearly readable
  And bubbles should not feel cramped
```

## Scenario: Slider Touch Area

```gherkin
Scenario: Sliders have adequate touch area
  Given the settings scene is open on a tablet
  When volume sliders are created
  Then slider height should be 15 pixels (taller than desktop)
  And the interactive area should be larger than visual area
  And the player should be able to drag easily with finger
  And the slider should not require precise touch
```

## Feature: Text Readability

```gherkin
Feature: Readable Text on All Devices
  As a player on any device
  I want text to be readable
  So that I can understand instructions and UI

Background:
  Given the game is loaded
  And text elements are displayed
```

## Scenario: Desktop Text Size

```gherkin
Scenario: Text is appropriate for desktop viewing
  Given the game is loaded on a desktop monitor
  When text elements are created
  Then title text should be 32-48 pixels
  And body text should be 18-24 pixels
  And all text should be clearly readable from ~60cm distance
```

## Scenario: Tablet Text Size

```gherkin
Scenario: Text is appropriate for tablet viewing
  Given the game is loaded on an iPad
  When text elements are created
  Then title text should be 36-52 pixels
  And body text should be 20-26 pixels
  And all text should be clearly readable from ~40cm distance
```

## Scenario: Phone Text Size

```gherkin
Scenario: Text is appropriate for phone viewing
  Given the game is loaded on an iPhone
  When text elements are created
  Then title text should be 28-40 pixels
  And body text should be 16-20 pixels
  And all text should be clearly readable from ~30cm distance
  And text should not overflow screen boundaries
```

## Scenario: Small Screen Text Overflow

```gherkin
Scenario: Prevent text overflow on small screens
  Given the game is loaded on a small phone (375px width)
  When text elements are created
  Then no text should extend beyond screen edges
  And long text should wrap or truncate appropriately
  And all text should remain within the canvas
```

## Feature: Device Detection

```gherkin
Feature: Accurate Device Type Detection
  As the game system
  I want to detect the device type correctly
  So that I can apply appropriate settings

Background:
  Given the game is loading
  And device detection is running
```

## Scenario: Detect Desktop Browser

```gherkin
Scenario: Identify desktop browser
  Given the game is loaded in Chrome on Windows
  When device detection runs
  Then isMobile() should return false
  And isTablet() should return false
  And isPhone() should return false
  And getDeviceType() should return "desktop"
```

## Scenario: Detect iPad

```gherkin
Scenario: Identify iPad tablet
  Given the game is loaded on an iPad
  When device detection runs
  Then isMobile() should return true
  And isTablet() should return true
  And isPhone() should return false
  And getDeviceType() should return "tablet"
```

## Scenario: Detect iPhone

```gherkin
Scenario: Identify iPhone
  Given the game is loaded on an iPhone
  When device detection runs
  Then isMobile() should return true
  And isTablet() should return false
  And isPhone() should return true
  And getDeviceType() should return "phone"
```

## Scenario: Detect Android Tablet

```gherkin
Scenario: Identify Android tablet
  Given the game is loaded on a Samsung Galaxy Tab
  When device detection runs
  Then isMobile() should return true
  And isTablet() should return true
  And isPhone() should return false
  And getDeviceType() should return "tablet"
```

## Scenario: Detect Android Phone

```gherkin
Scenario: Identify Android phone
  Given the game is loaded on a Pixel phone
  When device detection runs
  Then isMobile() should return true
  And isTablet() should return false
  And isPhone() should return true
  And getDeviceType() should return "phone"
```

## Feature: Viewport Configuration

```gherkin
Feature: Proper Viewport Meta Tag
  As a mobile player
  I want the game to display correctly on mobile browsers
  So that the UI is not zoomed or scrollable

Background:
  Given the game's index.html has a viewport meta tag
```

## Scenario: Viewport Meta Tag Exists

```gherkin
Scenario: Check for viewport meta tag
  Given the index.html file is loaded
  When the HTML head is inspected
  Then a viewport meta tag should exist
  And it should have name="viewport"
  And it should have content attributes
```

## Scenario: Viewport Initial Scale

```gherkin
Scenario: Initial scale is set correctly
  Given the viewport meta tag exists
  When the content attribute is inspected
  Then it should contain "initial-scale=1.0"
  And the game should load at 100% scale
  And no default zoom should be applied
```

## Scenario: Viewport Disable Zoom

```gherkin
Scenario: User zoom is disabled
  Given the viewport meta tag exists
  When the content attribute is inspected
  Then it should contain "user-scalable=no"
  And the player should not be able to pinch-zoom
  And double-tap zoom should be disabled
```

## Scenario: Viewport Maximum Scale

```gherkin
Scenario: Maximum scale is restricted
  Given the viewport meta tag exists
  When the content attribute is inspected
  Then it should contain "maximum-scale=1.0"
  And the browser should not allow zooming beyond 100%
```

## Feature: Cross-Device Consistency

```gherkin
Feature: Consistent Gameplay Across Devices
  As a player
  I want the same gameplay experience on any device
  So that the game feels familiar regardless of device type

Background:
  Given the game is fully loaded
```

## Scenario: Game Rules Are Identical

```gherkin
Scenario: Desktop and mobile have same rules
  Given the game is loaded on desktop
  When the player plays Letter Pop
  Then the target letter selection should work identically

  Given the game is loaded on mobile
  When the player plays Letter Pop
  Then the target letter selection should work identically
  And the difficulty should be the same
  And the scoring should be the same
```

## Scenario: UI Elements Are Equivalent

```gherkin
Scenario: Same UI elements on all devices
  Given the game is loaded on desktop
  Then the main menu should have: Start, Settings, Back buttons

  Given the game is loaded on tablet
  Then the main menu should have: Start, Settings, Back buttons
  And the buttons should just be larger

  Given the game is loaded on phone
  Then the main menu should have: Start, Settings, Back buttons
  And the buttons should be even larger
```

## Scenario: Audio Works on All Devices

```gherkin
Scenario: Audio playback on mobile
  Given the game is loaded on an iPhone
  When audio is triggered (e.g., "Find the letter B!")
  Then the audio should play successfully
  And the volume should respect settings
  And audio should not require additional user interaction
```

## Feature: Performance on Mobile

```gherkin
Feature: Smooth Performance on Mobile Devices
  As a mobile player
  I want the game to run smoothly
  So that gameplay is enjoyable

Background:
  Given the game is loaded on a mobile device
```

## Scenario: Frame Rate on Modern Tablet

```gherkin
Scenario: 60fps on iPad Air
  Given the game is running on an iPad Air 2 or newer
  When gameplay is active
  Then the frame rate should be 60fps
  And animations should be smooth
  And no lag should be noticeable
```

## Scenario: Frame Rate on Older Tablet

```gherkin
Scenario: Acceptable fps on older iPad
  Given the game is running on an iPad Mini 2
  When gameplay is active
  Then the frame rate should be at least 30fps
  And the game should remain playable
  And animations may be slightly less smooth
```

## Scenario: Frame Rate on Modern Phone

```gherkin
Scenario: 60fps on iPhone 8+
  Given the game is running on an iPhone 8 or newer
  When gameplay is active
  Then the frame rate should be 60fps
  And touch input should feel responsive
  And animations should be smooth
```

## Scenario: No Significant Lag

```gherkin
Scenario: Touch input responsiveness
  Given the game is running on a tablet
  When the player taps a bubble
  Then the response should occur within 50ms
  And the player should perceive instant feedback
  And no input lag should be noticeable
```

## Acceptance Criteria

### Canvas Scaling
- [ ] Canvas scales correctly on desktop (800x600 or larger)
- [ ] Canvas scales correctly on 10" tablet (1024x768 landscape)
- [ ] Canvas scales correctly on 10" tablet (768x1024 portrait)
- [ ] Canvas scales correctly on 7" tablet (~800x1280)
- [ ] Canvas scales correctly on iPhone SE (375x667)
- [ ] Canvas scales correctly on iPhone 12 (390x844)
- [ ] Canvas scales correctly on large Android phone (414x896)
- [ ] Aspect ratio is maintained on all devices
- [ ] Canvas is centered on all devices
- [ ] Letterboxing is added when needed

### Orientation Handling
- [ ] Orientation change is detected on tablets
- [ ] Canvas resizes smoothly on rotation
- [ ] UI elements reposition correctly
- [ ] Game remains playable after rotation
- [ ] No errors occur during orientation change
- [ ] Rapid rotations are handled gracefully

### Touch Input
- [ ] Touch input works on all interactive elements
- [ ] Bubbles respond to taps
- [ ] Buttons respond to taps
- [ ] Sliders respond to touch drag
- [ ] Multi-touch is handled (up to 3 pointers)
- [ ] Touch and mouse input work identically
- [ ] No unwanted zoom on double-tap
- [ ] No pull-to-refresh on drag-down

### Touch Targets
- [ ] Desktop buttons are 50px height
- [ ] Tablet buttons are 60px height
- [ ] Phone buttons are 70px height
- [ ] Desktop bubbles are 40px radius
- [ ] Mobile bubbles are 50-60px radius
- [ ] All touch targets meet 44x44px minimum
- [ ] Sliders have adequate touch area (15-20px height)
- [ ] Buttons are easy to tap with fingers

### Text Readability
- [ ] Title text is 32-48px on desktop
- [ ] Title text is 28-40px on phone
- [ ] Body text is 18-24px on desktop
- [ ] Body text is 16-20px on phone
- [ ] Text is readable at all device sizes
- [ ] Text does not overflow screen boundaries
- [ ] Text wraps or truncates appropriately

### Device Detection
- [ ] Desktop is detected correctly
- [ ] iPad is detected as tablet
- [ ] iPhone is detected as phone
- [ ] Android tablet is detected as tablet
- [ ] Android phone is detected as phone
- [ ] Device detection is accurate and reliable

### Viewport Configuration
- [ ] Viewport meta tag exists in index.html
- [ ] initial-scale=1.0 is set
- [ ] user-scalable=no is set
- [ ] maximum-scale=1.0 is set
- [ ] Zoom is disabled on mobile
- [ ] Scroll is disabled inside canvas
- [ ] Pull-to-refresh is disabled

### Cross-Device Consistency
- [ ] Game rules are identical on all devices
- [ ] UI elements are equivalent (just resized)
- [ ] Audio works on all devices
- [ ] Settings persist across devices
- [ ] Difficulty is consistent across devices

### Performance
- [ ] 60fps on modern tablets (iPad Air 2+, Galaxy Tab S)
- [ ] 60fps on modern phones (iPhone 8+, Pixel 3+)
- [ ] 30fps minimum on older devices
- [ ] Touch input feels responsive (<50ms)
- [ ] No noticeable lag or stuttering
- [ ] Animations are smooth
- [ ] No performance degradation over time

### Technical Requirements
- [ ] Phaser Scale Manager configured (FIT mode)
- [ ] Scale mode is Phaser.Scale.FIT
- [ ] Auto-center is Phaser.Scale.CENTER_BOTH
- [ ] Min dimensions set (375x300)
- [ ] Max dimensions set (1920x1080)
- [ ] Resize events handled correctly
- [ ] Orientation events handled correctly
- [ ] No console errors on any device
- [ ] Touch input events work (pointerdown, pointermove)

## Edge Cases to Test

```gherkin
Scenario: Very Small Phone Screen
  Given the game is loaded on an iPhone SE 1st gen (320x568)
  When the game renders
  Then all UI should fit within 320px width
  And text should remain readable
  And touch targets should still be adequate
  And the game should remain playable

Scenario: Very Large Desktop Monitor
  Given the game is loaded on a 4K monitor (3840x2160)
  When the game renders
  Then the canvas should scale up appropriately
  And the maximum size constraint should apply (1920x1080)
  And the game should be centered on screen
  And no pixelation should occur

Scenario: Browser Zoom at 150%
  Given the game is loaded in a browser
  And the browser zoom is set to 150%
  When the game renders
  Then the canvas should still fit the viewport
  And the game should remain playable
  And no layout issues should occur

Scenario: Browser Zoom at 75%
  Given the game is loaded in a browser
  And the browser zoom is set to 75%
  When the game renders
  Then the canvas should still scale correctly
  And the game should remain playable
  And UI elements should be proportional

Scenario: Tablet in Split-Screen Mode
  Given the game is loaded on an iPad
  And Safari is in split-screen mode (half screen)
  When the game renders
  Then the canvas should scale to the available space
  And the game should remain playable
  And no UI should be cut off

Scenario: Landscape on Phone
  Given the game is loaded on an iPhone in portrait
  When the user rotates to landscape (667x375)
  Then the canvas should scale to landscape
  And UI elements should fit (may be cramped)
  And the game should remain functional
  Or the game could lock to portrait (design choice)

Scenario: Stylus Input on Tablet
  Given the game is loaded on an iPad
  And the user uses an Apple Pencil
  When the user taps bubbles with the stylus
  Then the input should be detected as touch
  And bubbles should respond correctly
  And the stylus should work identically to finger

Scenario: Keyboard + Mouse on Tablet
  Given the game is loaded on an iPad with keyboard
  When the user attaches a mouse
  Then mouse input should work
  And touch input should still work
  And both input methods should coexist

Scenario: Orientation Locked by Device
  Given the game is on an iPhone
  And the device orientation lock is enabled
  When the user physically rotates the device
  Then the game should not rotate
  And the game should remain in portrait
  And no errors should occur

Scenario: Low Battery Mode
  Given the game is running on an iPhone
  And Low Power Mode is enabled
  When gameplay is active
  Then the frame rate may drop (30fps)
  And the game should remain playable
  And no crashes should occur

Scenario: Background Tab on Mobile
  Given the game is running in Safari on iPad
  When the user switches to another tab
  Then the game should pause (Phaser default)
  When the user returns to the game tab
  Then the game should resume
  And the state should be preserved

Scenario: iOS Safari Full-Screen
  Given the game is loaded in Safari on iPhone
  When the player scrolls down (hides address bar)
  Then the canvas should use full viewport height
  And the game should resize accordingly
  And no UI should be cut off by the notch

Scenario: Android Chrome Full-Screen
  Given the game is loaded in Chrome on Android
  When the address bar auto-hides
  Then the canvas should expand to full height
  And the game should resize smoothly
  And no layout glitches should occur
```

## Manual Testing Checklist

### Desktop Browser Testing
1. [ ] Load game in Chrome (1920x1080)
2. [ ] Verify canvas renders at appropriate size
3. [ ] Verify UI is centered
4. [ ] Open DevTools device toolbar (F12)
5. [ ] Test iPad dimensions (1024x768, 768x1024)
6. [ ] Test iPhone dimensions (375x667, 390x844)
7. [ ] Test Android phone (360x640, 414x896)
8. [ ] Verify canvas scales correctly for each size
9. [ ] Check for any UI overflow or clipping

### Physical Device Testing - iPad
10. [ ] Load game on iPad
11. [ ] Test in portrait orientation
12. [ ] Verify all UI elements fit
13. [ ] Tap bubbles (easy to tap?)
14. [ ] Drag settings sliders (easy to drag?)
15. [ ] Tap buttons (responsive?)
16. [ ] Rotate to landscape
17. [ ] Verify smooth transition
18. [ ] Verify UI repositions correctly
19. [ ] Play a full game round
20. [ ] Check for any performance issues

### Physical Device Testing - iPhone
21. [ ] Load game on iPhone
22. [ ] Test in portrait orientation
23. [ ] Verify text is readable
24. [ ] Verify buttons are easy to tap
25. [ ] Tap bubbles (adequate size?)
26. [ ] Test settings sliders (draggable?)
27. [ ] Try landscape orientation
28. [ ] Verify game adapts or stays portrait
29. [ ] Play a full game round
30. [ ] Check touch input responsiveness

### Physical Device Testing - Android Tablet
31. [ ] Load game on Android tablet
32. [ ] Test in portrait and landscape
33. [ ] Verify UI scales correctly
34. [ ] Test touch input (taps, drags)
35. [ ] Verify audio plays correctly
36. [ ] Check performance (fps)

### Physical Device Testing - Android Phone
37. [ ] Load game on Android phone
38. [ ] Test in portrait (primary orientation)
39. [ ] Verify text readability
40. [ ] Verify touch targets are adequate
41. [ ] Test gameplay
42. [ ] Check performance

### Viewport and Browser Behavior
43. [ ] Verify viewport meta tag in index.html
44. [ ] Attempt to zoom (should be disabled)
45. [ ] Attempt double-tap zoom (should be disabled)
46. [ ] Try pull-to-refresh (should be disabled)
47. [ ] Test in Safari (iOS)
48. [ ] Test in Chrome (Android)
49. [ ] Test in Firefox mobile

### Orientation Change Testing
50. [ ] Start game on iPad in portrait
51. [ ] Rotate to landscape while playing
52. [ ] Verify smooth transition
53. [ ] Verify game state preserved
54. [ ] Rotate back to portrait
55. [ ] Verify smooth transition again
56. [ ] Test rapid rotations (no crashes?)

### Performance Testing
57. [ ] Monitor fps in DevTools
58. [ ] Check fps on modern device (target 60)
59. [ ] Check fps on older device (min 30)
60. [ ] Test for 5+ minutes (sustained performance?)
61. [ ] Check for memory leaks (stable memory?)

### Text Readability Testing
62. [ ] Check title text on phone (readable?)
63. [ ] Check body text on phone (readable?)
64. [ ] Check text on tablet (readable?)
65. [ ] Verify no text overflow
66. [ ] Test with different font sizes (if adjustable)

### Touch Target Testing
67. [ ] Tap buttons with finger (easy?)
68. [ ] Tap small bubbles with finger (easy?)
69. [ ] Drag sliders with finger (smooth?)
70. [ ] Try rapid tapping (all register?)
71. [ ] Test with stylus (works?)

### Cross-Device Consistency
72. [ ] Play same level on desktop
73. [ ] Play same level on tablet
74. [ ] Play same level on phone
75. [ ] Verify difficulty is identical
76. [ ] Verify scoring is identical
77. [ ] Verify audio is identical

### Edge Cases
78. [ ] Test on smallest supported screen (320x568)
79. [ ] Test on largest screen (2560x1440+)
80. [ ] Test with browser zoom at 150%
81. [ ] Test with browser zoom at 75%
82. [ ] Test iPad in split-screen mode
83. [ ] Test landscape on phone (if supported)
84. [ ] Test stylus input
85. [ ] Test keyboard + mouse on tablet

### Error and Console Testing
86. [ ] Check console on desktop (no errors?)
87. [ ] Check console on tablet (no errors?)
88. [ ] Check console on phone (no errors?)
89. [ ] Check for orientation change errors
90. [ ] Check for resize event errors

## Success Criteria

**This phase is complete when:**

### Functional Completeness
1. Game scales correctly on desktop (800x600 or larger)
2. Game scales correctly on 7" tablets
3. Game scales correctly on 10" tablets (iPad)
4. Game scales correctly on phones (5-7 inch screens)
5. Portrait and landscape both supported on tablets
6. Orientation changes are handled smoothly
7. Touch input works on all interactive elements
8. All scenes work on mobile (menu, game, settings)

### Touch Target Quality
9. Buttons are finger-friendly (60-70px on mobile)
10. Bubbles are easy to tap (50-60px radius on mobile)
11. Sliders are draggable with fingers
12. All touch targets meet 44x44px minimum
13. No precision required for tapping

### Visual Quality
14. Text is readable on all devices
15. No text overflow on small screens
16. Aspect ratio is maintained (no stretching)
17. Canvas is centered on all devices
18. Letterboxing is added appropriately

### Device Support
19. Tested on iPad or equivalent tablet
20. Tested on iPhone or equivalent phone
21. Tested on Android tablet
22. Tested on Android phone
23. Works in Safari (iOS)
24. Works in Chrome (Android)

### Performance
25. 60fps on modern devices (iPad Air 2+, iPhone 8+)
26. 30fps minimum on older devices
27. Touch input feels responsive (<50ms)
28. No lag or stuttering during gameplay
29. Smooth orientation transitions

### Technical Quality
30. Phaser Scale Manager configured correctly
31. Viewport meta tag properly configured
32. No unwanted zoom or scroll
33. Pull-to-refresh disabled
34. No console errors on any device
35. Resize events handled correctly
36. Orientation events handled correctly

### Cross-Device Consistency
37. Game rules identical on all devices
38. UI elements equivalent (just resized)
39. Audio works on all devices
40. Settings persist on all devices
41. Gameplay experience is consistent

### Ready for Next Phase
42. All acceptance criteria met
43. All edge cases tested
44. No known bugs on mobile devices
45. Code is clean and organized
46. Ready to proceed to next phase

## Notes

**Core Functionality**
- Make Aurora's game playable on tablets and phones
- Adapt UI for touch input (larger targets)
- Scale canvas to fit any screen size
- Handle portrait and landscape orientations

**What We're Testing**
- Canvas scaling (desktop, tablet, phone)
- Touch input (taps, drags, gestures)
- Touch target sizing (buttons, bubbles, sliders)
- Text readability (various screen sizes)
- Orientation changes (portrait ↔ landscape)
- Device detection (desktop, tablet, phone)
- Performance (fps, responsiveness)
- Viewport configuration (no zoom/scroll)

**What We're NOT Testing Yet**
- Advanced gestures (swipe, pinch, long-press)
- Offline functionality (future)
- Progressive Web App features (future)
- Native app wrappers (Cordova, Capacitor)
- Bluetooth controller support
- Accessibility features (future enhancement)

**Critical Success Factors**
1. **Touch targets are finger-friendly**: 60-70px minimum on mobile
2. **Text is readable**: Appropriate sizes for each device
3. **Performance is smooth**: 60fps on modern, 30fps on older
4. **Input is responsive**: <50ms perceived delay for taps
5. **Orientation changes work**: Smooth transitions, no errors
6. **No unwanted behaviors**: Zoom, scroll, pull-to-refresh disabled

This phase makes Aurora's Letter Adventure truly mobile-ready. The game must feel as good on a tablet or phone as it does on desktop. Touch input must be reliable and responsive. UI must scale appropriately. Performance must be smooth. If these goals are met, players can enjoy the game on any device.
