// ES6 Module
export default /**
 * Bubble Game Object
 *
 * A reusable bubble container that displays a letter.
 * Used in the Letter Pop mini-game.
 *
 * Extends Phaser.GameObjects.Container to hold both graphics (bubble shape)
 * and text (letter display) as child components.
 */
class Bubble extends Phaser.GameObjects.Container {
    /**
     * Create a bubble
     * @param {Phaser.Scene} scene - The scene this bubble belongs to
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {string} letter - Letter to display in the bubble
     */
    constructor(scene, x, y, letter) {
        super(scene, x, y);

        // Store properties
        this.scene = scene;
        this.letter = letter;

        // Use responsive sizing (80px at 1920x1200 base)
        this.r = new ResponsiveUtils(scene);
        this.radius = this.r.scaleX(80);

        // Select random bright color from Aurora's Rainbow
        const rainbowColors = [
            0x00BCD4, // Sky Blue
            0xFFEB3B, // Sunshine Yellow
            0xFF4081, // Bubble Pink
            0x00E676, // Grass Green
            0xFF6B6B, // Orange Pop
            0x9C27B0  // Purple Magic
        ];
        this.bubbleColor = Phaser.Utils.Array.GetRandom(rainbowColors);

        // Create visual components
        this.createBubble();
        this.createLetter();

        // Add this container to the scene
        scene.add.existing(this);

        // Make bubble interactive
        this.setInteractive(
            new Phaser.Geom.Circle(0, 0, this.radius),
            Phaser.Geom.Circle.Contains
        );
        this.on('pointerdown', () => this.onPop());
    }

    /**
     * Create the bubble graphics with gradient effect
     * Uses multiple layered circles to simulate a 3D gradient
     * Color is randomly selected from Aurora's Rainbow palette
     */
    createBubble() {
        // Create graphics object for bubble
        const graphics = this.scene.add.graphics();

        // Simplified rendering - just 3 layers for better performance
        // Layer 1: Main bubble (base color)
        graphics.fillStyle(this.bubbleColor, 0.9);
        graphics.fillCircle(0, 0, this.radius);

        // Layer 2: Glossy highlight (top-left for shine effect)
        graphics.fillStyle(0xffffff, 0.5);
        graphics.fillCircle(-this.r.scaleX(12), -this.r.scaleY(12), this.r.scaleX(18));

        // Layer 3: Border/outline for definition
        graphics.lineStyle(this.r.scaleX(3), 0xffffff, 0.8);
        graphics.strokeCircle(0, 0, this.radius);

        // Add graphics to this container
        this.add(graphics);
    }

    /**
     * Create the letter text centered in the bubble
     */
    createLetter() {
        // Create text for letter with Fredoka One font
        const letterText = this.scene.add.text(0, 0, this.letter, {
            fontSize: this.r.getFontSize(64) + 'px',
            fontFamily: 'Fredoka One, Arial',
            color: '#ffffff',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 4  // Fixed thickness instead of responsive
        });

        // Center the text horizontally and vertically
        letterText.setOrigin(0.5, 0.5);

        // Force text bounds to be larger to prevent clipping
        // This ensures letters with descenders or wide glyphs aren't cut off
        letterText.setPadding(10, 10, 10, 10);

        // Add text to this container
        this.add(letterText);
    }

    /**
     * Handle bubble click - delegates to scene for correct/incorrect logic
     */
    onPop() {
        console.log(`[Bubble] ${this.letter} clicked!`);

        // Delegate to scene's handleBubbleClick method
        // Scene will determine if this is correct or incorrect
        if (this.scene.handleBubbleClick) {
            this.scene.handleBubbleClick(this, this.letter);
        }
    }
}
