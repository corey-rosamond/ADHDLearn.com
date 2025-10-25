// ES6 Module
import ThemeConfig from '../config/ThemeConfig.js';
export default /**
 * DecorationsComponent - Reusable decorative elements
 *
 * Purpose: Creates floating stars and other decorative animations
 * Replaces: Duplicate floating stars code in 4 scenes (160+ lines)
 */
class DecorationsComponent {
    /**
     * Creates floating stars decoration
     *
     * @param {Phaser.Scene} scene - The scene
     * @param {object} config - Configuration object
     * @param {number} config.count - Number of stars (default: 10)
     * @param {string[]} config.starChars - Star emoji array (default: ['⭐', '✨', '💫'])
     * @param {number} config.startX - Starting X percentage (default: 10)
     * @param {number} config.spacing - Horizontal spacing percentage (default: 9)
     * @param {number} config.baseY - Base Y percentage (default: 20)
     * @param {number} config.yVariation - Y variation percentage (default: 20)
     * @param {number} config.baseFontSize - Base font size (default: 32)
     * @param {number} config.fontSizeVariation - Font size variation (default: 8)
     * @param {number} config.alpha - Base alpha (default: 0.8)
     * @returns {Phaser.GameObjects.Text[]} Array of star text objects
     *
     * @example
     * // Standard floating stars
     * DecorationsComponent.createFloatingStars(this);
     *
     * @example
     * // Custom stars
     * DecorationsComponent.createFloatingStars(this, {
     *     count: 15,
     *     baseFontSize: 40,
     *     alpha: 0.6
     * });
     */
    static createFloatingStars(scene, config = {}) {
        const {
            count = 10,
            starChars = ['⭐', '✨', '💫'],
            startX = 10,
            spacing = 9,
            baseY = 20,
            yVariation = 20,
            baseFontSize = 32,
            fontSizeVariation = 8,
            alpha = 0.8
        } = config;

        const stars = [];

        for (let i = 0; i < count; i++) {
            const x = scene.r.getX(startX + (i * spacing));
            const y = scene.r.getY(baseY + ((i % 3) * yVariation));
            const starChar = Phaser.Utils.Array.GetRandom(starChars);

            const star = scene.add.text(x, y, starChar, {
                fontSize: scene.r.getFontSize(baseFontSize + (i % 3) * fontSizeVariation) + 'px',
                padding: { top: 20, bottom: 20, left: 10, right: 10 }
            }).setOrigin(0.5);

            star.setAlpha(alpha);

            // Floating animation
            scene.tweens.add({
                targets: star,
                y: y + scene.r.scaleY(25),
                duration: 2500 + (i * 200),
                ease: ThemeConfig.ANIMATIONS.easing.smooth,
                yoyo: true,
                repeat: -1,
                delay: i * 100
            });

            // Rotation animation
            scene.tweens.add({
                targets: star,
                angle: i % 2 === 0 ? 360 : -360,
                duration: 3000 + (i * 300),
                ease: ThemeConfig.ANIMATIONS.easing.linear,
                repeat: -1
            });

            stars.push(star);
        }

        return stars;
    }

    /**
     * Creates floating stars with twinkle effect (for Results scene)
     *
     * @param {Phaser.Scene} scene - The scene
     * @param {object} config - Configuration (same as createFloatingStars)
     * @returns {Phaser.GameObjects.Text[]} Array of star text objects
     */
    static createTwinklingStars(scene, config = {}) {
        const stars = this.createFloatingStars(scene, config);

        // Add twinkle effect to each star
        stars.forEach((star, i) => {
            scene.tweens.add({
                targets: star,
                alpha: 0.3,
                duration: 1000 + (i * 150),
                ease: ThemeConfig.ANIMATIONS.easing.smooth,
                yoyo: true,
                repeat: -1
            });
        });

        return stars;
    }
}
