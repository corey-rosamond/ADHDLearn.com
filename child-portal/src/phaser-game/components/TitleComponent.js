// ES6 Module
import ThemeConfig from '../config/ThemeConfig.js';
export default /**
 * TitleComponent - Reusable styled title text with animations
 *
 * Purpose: Creates consistent title text across all scenes
 * Replaces: Duplicate title creation code in all scenes
 *
 * Features:
 * - Themed styling (default, alternate)
 * - Bounce-in animation
 * - Continuous pulse animation
 * - Multi-line title support with staggered animation
 */
class TitleComponent {
    /**
     * Theme presets for title styling
     */
    static THEMES = {
        default: {
            color: ThemeConfig.COLORS.text.primary,
            stroke: ThemeConfig.COLORS.stroke.primary,
            fontFamily: ThemeConfig.FONTS.primary
        },
        alternate: {
            color: ThemeConfig.COLORS.text.secondary,
            stroke: ThemeConfig.COLORS.stroke.secondary,
            fontFamily: ThemeConfig.FONTS.primary
        }
    };

    /**
     * Creates a styled title with animation
     *
     * @param {Phaser.Scene} scene - The scene
     * @param {object} config - Configuration object
     * @param {number} config.x - X position (default: center)
     * @param {number} config.y - Y position (default: 15% from top)
     * @param {string} config.text - Title text
     * @param {number} config.fontSize - Font size (default: 64)
     * @param {string} config.theme - Theme name ('default' or 'alternate')
     * @param {boolean} config.animate - Enable bounce-in animation (default: true)
     * @param {boolean} config.pulseOnComplete - Enable continuous pulse (default: true)
     * @returns {Phaser.GameObjects.Text} The created text object
     *
     * @example
     * // Simple title
     * TitleComponent.create(this, { text: 'SETTINGS' });
     *
     * @example
     * // Custom positioned title without animation
     * TitleComponent.create(this, {
     *     x: this.r.getX(30),
     *     y: this.r.getY(10),
     *     text: 'GAME OVER',
     *     theme: 'alternate',
     *     animate: false
     * });
     */
    static create(scene, config = {}) {
        const {
            x = scene.r.centerX,
            y = scene.r.getY(15),
            text = 'TITLE',
            fontSize = scene.r.getFontSize(64),
            theme = 'default',
            animate = true,
            pulseOnComplete = true
        } = config;

        const themeStyle = this.THEMES[theme];

        const titleText = scene.add.text(x, y, text, {
            fontSize: fontSize + 'px',
            fontFamily: themeStyle.fontFamily,
            color: themeStyle.color,
            fontStyle: 'bold',
            stroke: themeStyle.stroke,
            strokeThickness: scene.r.scaleX(8)
        }).setOrigin(0.5);

        if (animate) {
            this.animateBounceIn(scene, titleText, pulseOnComplete);
        }

        return titleText;
    }

    /**
     * Creates multi-line title (like main menu)
     *
     * @param {Phaser.Scene} scene - The scene
     * @param {string[]} lines - Array of text lines
     * @param {object} config - Configuration object
     * @param {number} config.startY - Y position for first line (default: 18%)
     * @param {number} config.lineSpacing - Space between lines (default: 50px scaled)
     * @param {number} config.fontSize - Font size (default: 64)
     * @param {string} config.theme - Theme name (default: 'default')
     * @param {number} config.staggerDelay - Delay between line animations (default: 200ms)
     * @returns {Phaser.GameObjects.Text[]} Array of created text objects
     *
     * @example
     * TitleComponent.createMultiLine(this, ["AURORA'S", "READING", "ADVENTURE"]);
     *
     * @example
     * TitleComponent.createMultiLine(this, ["LINE 1", "LINE 2"], {
     *     startY: this.r.getY(20),
     *     lineSpacing: this.r.scaleY(60),
     *     staggerDelay: 150
     * });
     */
    static createMultiLine(scene, lines, config = {}) {
        const {
            startY = scene.r.getY(18),
            lineSpacing = scene.r.scaleY(50),
            fontSize = scene.r.getFontSize(64),
            theme = 'default',
            staggerDelay = 200
        } = config;

        const textObjects = [];

        lines.forEach((line, index) => {
            const y = startY + (index * lineSpacing);

            // Create text without animation (we'll animate manually)
            const text = this.create(scene, {
                y,
                text: line,
                fontSize,
                theme,
                animate: false
            });

            textObjects.push(text);

            // Staggered bounce-in animation
            text.setScale(0);
            scene.tweens.add({
                targets: text,
                scaleX: 1,
                scaleY: 1,
                duration: ThemeConfig.ANIMATIONS.durations.slow,
                delay: index * staggerDelay,
                ease: ThemeConfig.ANIMATIONS.easing.bounceIn,
                onComplete: () => {
                    // Continuous pulse after bounce-in
                    scene.tweens.add({
                        targets: text,
                        scaleX: 1.05,
                        scaleY: 1.05,
                        duration: ThemeConfig.ANIMATIONS.durations.bounce,
                        ease: ThemeConfig.ANIMATIONS.easing.smooth,
                        yoyo: true,
                        repeat: -1
                    });
                }
            });
        });

        return textObjects;
    }

    /**
     * Applies bounce-in animation to text
     *
     * @param {Phaser.Scene} scene - The scene
     * @param {Phaser.GameObjects.Text} text - Text to animate
     * @param {boolean} pulseOnComplete - Enable continuous pulse after bounce
     * @private
     */
    static animateBounceIn(scene, text, pulseOnComplete) {
        text.setScale(0);
        scene.tweens.add({
            targets: text,
            scaleX: 1,
            scaleY: 1,
            duration: ThemeConfig.ANIMATIONS.durations.slow,
            ease: ThemeConfig.ANIMATIONS.easing.bounceIn,
            onComplete: () => {
                if (pulseOnComplete) {
                    scene.tweens.add({
                        targets: text,
                        scaleX: 1.05,
                        scaleY: 1.05,
                        duration: ThemeConfig.ANIMATIONS.durations.bounce,
                        ease: ThemeConfig.ANIMATIONS.easing.smooth,
                        yoyo: true,
                        repeat: -1
                    });
                }
            }
        });
    }
}
