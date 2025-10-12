# Phase 7: Letter Pop - Single Static Bubble

## Goal
Create a Bubble game object class and display one static bubble with the letter "A" centered in the LetterPopScene

## Context
This phase introduces the core game object for the Letter Pop mini-game. We need to:
1. Create a reusable Bubble class that can display letters
2. Render a visually appealing bubble with gradient fill
3. Center a letter inside the bubble for learning purposes
4. Establish the visual foundation for interactive bubble gameplay

This is the first step toward making the game functional - future phases will add multiple bubbles, movement, and interactivity.

## Prerequisites
- Phase 1-6 completed
- LetterPopScene exists and displays correctly
- Understanding of Phaser game objects
- Understanding of graphics rendering

## Tasks

### 1. Create Bubble.js Class
- Create new file: `src/gameobjects/Bubble.js`
- Extend Phaser.GameObjects.Container
- Accept parameters: scene, x, y, letter
- Initialize graphics and text components
- Make class reusable for any letter

### 2. Create Circular Gradient Bubble
- Use Phaser.GameObjects.Graphics for bubble shape
- Draw circle with radius ~60-80 pixels
- Apply gradient fill (light to darker shade)
- Add subtle stroke/outline for definition
- Use colors that contrast with blue background
- Make bubble appear glossy/shiny (kid-friendly)

### 3. Add Letter "A" Centered in Bubble
- Create text object with letter "A"
- Use large, bold font (48-60px)
- Center text perfectly in bubble
- Use dark color for readability
- Ensure letter is clearly visible against bubble gradient

### 4. Position Bubble in Center of Scene
- Add one Bubble instance to LetterPopScene
- Position at center of screen (400, 300)
- Ensure bubble doesn't overlap with title or button
- Verify bubble is fully visible within canvas bounds

### 5. Verify Visual Quality
- Bubble should look attractive and professional
- Gradient should be smooth and appealing
- Letter should be perfectly centered and readable
- Overall visual should be engaging for children
- Test on different screen sizes

## Implementation Details

### Bubble Class Structure
```javascript
// src/gameobjects/Bubble.js
class Bubble extends Phaser.GameObjects.Container {
    constructor(scene, x, y, letter) {
        super(scene, x, y);

        // Store properties
        this.scene = scene;
        this.letter = letter;
        this.radius = 70;

        // Create visual components
        this.createBubble();
        this.createLetter();

        // Add to scene
        scene.add.existing(this);
    }

    createBubble() {
        // Create graphics object for bubble
        const graphics = this.scene.add.graphics();

        // Create circular gradient effect
        // Outer glow/shadow
        graphics.fillStyle(0xcccccc, 0.3);
        graphics.fillCircle(0, 0, this.radius + 5);

        // Main bubble with gradient effect
        // Create multiple circles with decreasing alpha for gradient
        const colors = [
            { color: 0xffffff, alpha: 0.9, radius: this.radius },
            { color: 0xe0e0ff, alpha: 0.8, radius: this.radius - 10 },
            { color: 0xc0c0ff, alpha: 0.7, radius: this.radius - 20 }
        ];

        colors.forEach(({ color, alpha, radius }) => {
            graphics.fillStyle(color, alpha);
            graphics.fillCircle(0, 0, radius);
        });

        // Glossy highlight (top-left)
        graphics.fillStyle(0xffffff, 0.6);
        graphics.fillCircle(-15, -15, 20);

        // Border/outline
        graphics.lineStyle(3, 0xaaaaff, 0.8);
        graphics.strokeCircle(0, 0, this.radius);

        // Add graphics to container
        this.add(graphics);
    }

    createLetter() {
        // Create text for letter
        const letterText = this.scene.add.text(0, 0, this.letter, {
            fontSize: '56px',
            fontFamily: 'Arial',
            color: '#333333',
            fontStyle: 'bold'
        });

        // Center the text
        letterText.setOrigin(0.5, 0.5);

        // Add text to container
        this.add(letterText);
    }

    // Method for future interactivity
    pop() {
        // Will be implemented in future phases
        // For now, just a placeholder
        console.log(`Bubble ${this.letter} popped!`);
    }
}

// Make class available for import
export default Bubble;
```

### Alternative Gradient Approach (Using Canvas)
```javascript
createBubble() {
    // Create a texture using canvas for smooth gradient
    const texture = this.scene.textures.createCanvas('bubble', this.radius * 2, this.radius * 2);
    const ctx = texture.context;
    const centerX = this.radius;
    const centerY = this.radius;

    // Create radial gradient
    const gradient = ctx.createRadialGradient(
        centerX - 20, centerY - 20, 10,  // Inner circle (highlight)
        centerX, centerY, this.radius     // Outer circle
    );

    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');    // White center
    gradient.addColorStop(0.3, 'rgba(230, 230, 255, 1)');  // Light purple
    gradient.addColorStop(0.7, 'rgba(200, 200, 255, 1)');  // Medium purple
    gradient.addColorStop(1, 'rgba(170, 170, 255, 0.9)');  // Darker edge

    // Draw circle with gradient
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(centerX, centerY, this.radius, 0, Math.PI * 2);
    ctx.fill();

    // Add border
    ctx.strokeStyle = 'rgba(150, 150, 255, 0.8)';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Update texture
    texture.refresh();

    // Create sprite from texture
    const bubbleSprite = this.scene.add.sprite(0, 0, 'bubble');
    this.add(bubbleSprite);
}
```

### Using Bubble in LetterPopScene
```javascript
// In LetterPopScene.js
import Bubble from '../gameobjects/Bubble.js';

class LetterPopScene extends Phaser.Scene {
    // ... existing code ...

    create() {
        // Create background
        this.createBackground();

        // Create title
        this.createTitle();

        // Create back button
        this.createBackButton();

        // NEW: Create single bubble with letter A
        this.createBubble();
    }

    createBubble() {
        // Create bubble at center of screen
        const centerX = this.cameras.main.width / 2;
        const centerY = this.cameras.main.height / 2;

        // Instantiate bubble with letter "A"
        const bubble = new Bubble(this, centerX, centerY, 'A');

        // Store reference for future use
        this.bubble = bubble;
    }
}
```

### Simple Alternative (Without Separate Class)
```javascript
// If you want to keep it simple for Phase 7, can do inline:
createBubble() {
    const x = 400;
    const y = 300;
    const radius = 70;

    // Create graphics for bubble
    const graphics = this.add.graphics();

    // Shadow/glow
    graphics.fillStyle(0xcccccc, 0.3);
    graphics.fillCircle(x, y, radius + 5);

    // Main bubble
    graphics.fillStyle(0xe6e6ff, 1);
    graphics.fillCircle(x, y, radius);

    // Highlight
    graphics.fillStyle(0xffffff, 0.6);
    graphics.fillCircle(x - 15, y - 15, 20);

    // Border
    graphics.lineStyle(3, 0xaaaaff, 1);
    graphics.strokeCircle(x, y, radius);

    // Letter
    this.add.text(x, y, 'A', {
        fontSize: '56px',
        fontFamily: 'Arial',
        color: '#333333',
        fontStyle: 'bold'
    }).setOrigin(0.5);
}
```

## Acceptance Criteria
- [ ] Bubble.js file created in src/gameobjects/
- [ ] Bubble class extends Phaser.GameObjects.Container
- [ ] Bubble accepts scene, x, y, and letter parameters
- [ ] Bubble renders circular shape with gradient
- [ ] Gradient creates depth and glossy appearance
- [ ] Bubble has visible border/outline
- [ ] Letter "A" is displayed in center of bubble
- [ ] Letter is large (48-60px) and readable
- [ ] Letter is perfectly centered in bubble
- [ ] Bubble is positioned at center of LetterPopScene (400, 300)
- [ ] Bubble doesn't overlap title or back button
- [ ] Bubble is fully visible within canvas bounds
- [ ] Visual quality is professional and appealing
- [ ] Code is clean and well-commented
- [ ] No console errors when bubble is created

## Testing Steps
1. Open game and navigate to LetterPopScene
2. Verify one bubble appears in center of screen
3. Verify bubble has circular shape
4. Verify bubble has gradient fill (not flat color)
5. Verify bubble has visible border
6. Verify letter "A" is visible in bubble
7. Verify letter is centered in bubble
8. Verify letter is readable and appropriately sized
9. Check that bubble doesn't overlap UI elements
10. Verify visual quality on different zoom levels
11. Take screenshot for documentation
12. Check browser console for errors

## Estimated Time
1 hour

## Dependencies
- LetterPopScene from Phase 6
- Phaser 3 game instance
- Understanding of Phaser GameObjects
- Understanding of Graphics rendering

## Risks
- **Gradient complexity**: May need to simplify if performance issues arise
- **Text centering**: Ensure text origin is set correctly for perfect centering
- **Color choices**: Colors must contrast with background and be appealing
- **Container vs. Graphics**: Container adds flexibility but more complexity
- **Cross-browser rendering**: Test that gradients render consistently

## Design Considerations

### Bubble Appearance
**Goal**: Make bubbles appealing to children, similar to soap bubbles
- **Shape**: Perfect circle (not oval)
- **Colors**: Light, airy colors (white, light purple, light blue)
- **Gradient**: Light at top/center, darker at edges (spherical depth)
- **Highlight**: White glossy spot for shine effect
- **Border**: Subtle outline for definition

### Letter Display
**Goal**: Make letters clear and easy to read
- **Font**: Sans-serif, bold (Arial, Comic Sans, or similar)
- **Size**: Large enough to see clearly (48-60px)
- **Color**: Dark (black or dark gray) for maximum contrast
- **Position**: Perfectly centered in bubble
- **Case**: Uppercase for this phase (easier to recognize)

### Positioning
```
┌─────────────────────────────────┐
│  [< Menu]                       │
│                                 │
│         Letter Pop!             │
│   Pop the bubbles to learn!    │
│                                 │
│             ╭─────╮             │ ← Bubble at (400, 300)
│             │  A  │             │
│             ╰─────╯             │
│                                 │
│                                 │
└─────────────────────────────────┘
```

### ADHD-Friendly Elements
- **Visual clarity**: Bubble is clearly defined, not blurry
- **High contrast**: Letter stands out against bubble
- **Simple composition**: Only one bubble (not overwhelming)
- **Engaging visual**: Gradient and shine make it interesting
- **Clear purpose**: Letter is obviously the focus

## Notes
- This phase is purely visual - no interaction yet
- Bubble class will be extended in future phases for:
  - Animation (floating, bouncing)
  - Interactivity (click to pop)
  - Sound effects (pop sound)
  - Score tracking
  - Multiple bubbles
- Keep the class simple but extensible
- Focus on making it look good
- Perfect centering is critical for professional appearance
- Gradient can be adjusted based on feedback
- Consider performance: creating bubble should be fast

## Future Enhancements (Not in this phase)
- Floating animation
- Click interaction
- Pop animation
- Sound effects
- Multiple bubbles
- Different letters
- Different colors per bubble
- Difficulty levels

## Completion Checklist
- [ ] Bubble.js created and properly structured
- [ ] Bubble class tested and working
- [ ] Gradient rendering looks good
- [ ] Letter is perfectly centered
- [ ] Bubble displays in LetterPopScene
- [ ] Positioned correctly in center
- [ ] All acceptance criteria met
- [ ] Visual quality verified
- [ ] Code reviewed and commented
- [ ] No console errors
- [ ] Screenshot taken for documentation
- [ ] Ready to proceed to Phase 8 (add interaction/animation)
