/**
 * Responsive Utilities for Aurora's Letter Adventure
 *
 * Provides percentage-based positioning and scaling for responsive design
 * Base resolution: 1920x1200 (16:10 aspect ratio)
 * Scales to Samsung Galaxy Tab S7 FE: 2560x1600
 */
class ResponsiveUtils {
    /**
     * Create responsive utilities for a scene
     * @param {Phaser.Scene} scene - The scene to calculate dimensions for
     */
    constructor(scene) {
        this.scene = scene;
        this.width = scene.cameras.main.width;
        this.height = scene.cameras.main.height;
        this.centerX = this.width / 2;
        this.centerY = this.height / 2;
    }

    /**
     * Get X position from percentage (0-100)
     * @param {number} percent - Percentage of screen width (0-100)
     * @returns {number} X position in pixels
     * @example
     * getX(50) // Returns centerX (960 at 1920px width)
     * getX(10) // Returns 192 at 1920px width
     */
    getX(percent) {
        return (this.width * percent) / 100;
    }

    /**
     * Get Y position from percentage (0-100)
     * @param {number} percent - Percentage of screen height (0-100)
     * @returns {number} Y position in pixels
     * @example
     * getY(50) // Returns centerY (600 at 1200px height)
     * getY(10) // Returns 120 at 1200px height
     */
    getY(percent) {
        return (this.height * percent) / 100;
    }

    /**
     * Scale value based on screen width (relative to 1920px base)
     * @param {number} baseValue - Value at 1920px width
     * @returns {number} Scaled value for current width
     * @example
     * scaleX(100) // Returns 100 at 1920px, 133 at 2560px
     */
    scaleX(baseValue) {
        return (baseValue * this.width) / 1920;
    }

    /**
     * Scale value based on screen height (relative to 1200px base)
     * @param {number} baseValue - Value at 1200px height
     * @returns {number} Scaled value for current height
     * @example
     * scaleY(100) // Returns 100 at 1200px, 133 at 1600px
     */
    scaleY(baseValue) {
        return (baseValue * this.height) / 1200;
    }

    /**
     * Get scaled font size based on screen height
     * @param {number} baseSize - Font size at 1200px height
     * @returns {number} Scaled font size (rounded)
     * @example
     * getFontSize(48) // Returns 48 at 1200px, 64 at 1600px
     */
    getFontSize(baseSize) {
        return Math.round(this.scaleY(baseSize));
    }

    /**
     * Create consistent button styling for the game
     * Returns an object with scaled button dimensions and styles
     * @param {string} size - 'small', 'medium', or 'large'
     * @returns {object} Button configuration object
     */
    getButtonConfig(size = 'medium') {
        const configs = {
            small: {
                width: this.scaleX(180),
                height: this.scaleY(80),
                fontSize: this.getFontSize(24),
                cornerRadius: this.scaleX(15)
            },
            medium: {
                width: this.scaleX(400),
                height: this.scaleY(120),
                fontSize: this.getFontSize(48),
                cornerRadius: this.scaleX(20)
            },
            large: {
                width: this.scaleX(500),
                height: this.scaleY(200),
                fontSize: this.getFontSize(64),
                cornerRadius: this.scaleX(25)
            }
        };
        return configs[size] || configs.medium;
    }
}
