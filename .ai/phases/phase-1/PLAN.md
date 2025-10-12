# Phase 1: Project Bootstrap

## Goal
Get Phaser 3 running in browser with basic display

## Context
This is the absolute foundation. We need to verify that:
1. We can load Phaser 3
2. We can create a game instance
3. We can render to the screen
4. The development environment works

## Prerequisites
- None (this is phase 1)

## Tasks

### 1. Create Project Structure
```
/Alphabet & Sight Words Game
├── index.html
├── /assets
│   ├── /audio
│   ├── /images
│   └── /data
└── /src
    ├── config.js
    └── /scenes
```

### 2. Create index.html
- Basic HTML5 document structure
- Link to Phaser 3 via CDN (v3.80.1 or latest stable)
- Create container div for game canvas
- Link to src/config.js

### 3. Create src/config.js
- Define Phaser game configuration
- Set canvas size (800x600 for development)
- Set background color
- Configure physics (arcade, simple)
- Add simple scene that displays text

### 4. Test in Browser
- Open index.html in Chrome/Firefox
- Verify Phaser canvas renders
- Verify welcome text displays
- Check browser console for errors

## Implementation Details

### index.html Structure
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Aurora's Letter Adventure</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            background: #2d2d2d;
        }
        #game-container {
            box-shadow: 0 0 20px rgba(0,0,0,0.5);
        }
    </style>
</head>
<body>
    <div id="game-container"></div>
    <script src="https://cdn.jsdelivr.net/npm/phaser@3.80.1/dist/phaser.js"></script>
    <script src="src/config.js"></script>
</body>
</html>
```

### config.js Structure
```javascript
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game-container',
    backgroundColor: '#4488ff',
    scene: {
        create: function() {
            this.add.text(400, 300, "Aurora's Letter Adventure", {
                fontSize: '32px',
                color: '#ffffff'
            }).setOrigin(0.5);
        }
    }
};

const game = new Phaser.Game(config);
```

## Acceptance Criteria
- [ ] Folder structure created correctly
- [ ] index.html opens in browser without errors
- [ ] Phaser canvas displays with blue background
- [ ] Text "Aurora's Letter Adventure" is centered on screen
- [ ] Browser console shows no errors
- [ ] Canvas is 800x600 pixels
- [ ] Text is white and readable

## Testing Steps
1. Open index.html in browser
2. Verify canvas renders
3. Verify text displays centered
4. Open browser console (F12)
5. Verify no error messages
6. Take screenshot for documentation

## Estimated Time
30 minutes

## Dependencies
- None

## Risks
- **Phaser CDN unavailable**: Use local copy as fallback
- **Browser incompatibility**: Test in Chrome first, Firefox second

## Notes
- Keep it simple - just prove Phaser works
- Don't add any game logic yet
- This is foundation for everything else
- If this doesn't work, nothing else will

## Completion Checklist
- [ ] All tasks completed
- [ ] All acceptance criteria met
- [ ] Tested in at least 2 browsers
- [ ] Screenshot taken
- [ ] No console errors
- [ ] Ready to proceed to Phase 2
