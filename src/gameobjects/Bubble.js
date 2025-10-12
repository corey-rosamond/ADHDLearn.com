/**
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
        this.radius = 70;

        // Create visual components
        this.createBubble();
        this.createLetter();

        // Add this container to the scene
        scene.add.existing(this);
    }

    /**
     * Create the bubble graphics with gradient effect
     * Uses multiple layered circles to simulate a 3D gradient
     */
    createBubble() {
        // Create graphics object for bubble
        const graphics = this.scene.add.graphics();

        // Layer 1: Shadow (outer glow for depth)
        graphics.fillStyle(0xcccccc, 0.3);
        graphics.fillCircle(0, 0, this.radius + 5);

        // Layer 2: Outer gradient (lightest)
        graphics.fillStyle(0xffffff, 0.9);
        graphics.fillCircle(0, 0, this.radius);

        // Layer 3: Middle gradient (light purple)
        graphics.fillStyle(0xe0e0ff, 0.8);
        graphics.fillCircle(0, 0, this.radius - 10);

        // Layer 4: Inner gradient (darker purple)
        graphics.fillStyle(0xc0c0ff, 0.7);
        graphics.fillCircle(0, 0, this.radius - 20);

        // Layer 5: Glossy highlight (top-left for shine effect)
        graphics.fillStyle(0xffffff, 0.6);
        graphics.fillCircle(-15, -15, 20);

        // Layer 6: Border/outline for definition
        graphics.lineStyle(3, 0xaaaaff, 0.8);
        graphics.strokeCircle(0, 0, this.radius);

        // Add graphics to this container
        this.add(graphics);
    }

    /**
     * Create the letter text centered in the bubble
     */
    createLetter() {
        // Create text for letter
        const letterText = this.scene.add.text(0, 0, this.letter, {
            fontSize: '56px',
            fontFamily: 'Arial',
            color: '#333333',
            fontStyle: 'bold'
        });

        // Center the text (origin 0.5, 0.5 = center)
        letterText.setOrigin(0.5, 0.5);

        // Add text to this container
        this.add(letterText);
    }

    /**
     * Pop the bubble
     * Placeholder for future phases (animation, sound, etc.)
     */
    pop() {
        console.log(`Bubble ${this.letter} popped!`);
        // Will be implemented in future phases with:
        // - Pop animation (scale down, fade out)
        // - Pop sound effect
        // - Score increment
        // - Particle effects
    }
}
