// ES6 Module
import ThemeConfig from '../config/ThemeConfig.js';
export default /**
 * SliderComponent - Reusable slider control
 *
 * Purpose: Creates consistent sliders for volume and settings
 * Replaces: Duplicate slider code in SettingsScene and LetterPopMenuScene (~140 lines each)
 */
class SliderComponent {
    /**
     * Creates a slider with label and value display
     *
     * @param {Phaser.Scene} scene - The scene
     * @param {object} config - Configuration object
     * @param {number} config.x - X position (default: 20% from left)
     * @param {number} config.y - Y position
     * @param {string} config.label - Slider label text
     * @param {number} config.minValue - Minimum value (default: 0)
     * @param {number} config.maxValue - Maximum value (default: 100)
     * @param {number} config.initialValue - Initial value (default: 50)
     * @param {string} config.suffix - Value suffix like '%' or 's' (default: '')
     * @param {number} config.barWidth - Slider bar width (default: 700 scaled)
     * @param {number} config.barHeight - Slider bar height (default: 15 scaled)
     * @param {number} config.labelFontSize - Label font size (default: 32 scaled)
     * @param {number} config.valueFontSize - Value font size (default: 32 scaled)
     * @param {function} config.onValueChange - Callback(value) when value changes
     * @returns {object} Slider components and getValue() method
     *
     * @example
     * SliderComponent.create(this, {
     *     y: this.r.getY(35),
     *     label: 'Master Volume',
     *     initialValue: 75,
     *     suffix: '%',
     *     onValueChange: (value) => {
     *         localStorage.setItem('masterVolume', value);
     *     }
     * });
     */
    static create(scene, config) {
        const {
            x = scene.r.getX(20),
            y,
            label,
            minValue = 0,
            maxValue = 100,
            initialValue = 50,
            suffix = '',
            barWidth = scene.r.scaleX(700),
            barHeight = scene.r.scaleY(15),
            onValueChange
        } = config;

        // Label text
        const labelText = scene.add.text(x, y, label + ':', {
            fontSize: scene.r.getFontSize(32) + 'px',
            fontFamily: ThemeConfig.FONTS.primary,
            color: ThemeConfig.COLORS.text.secondary,
            fontStyle: 'bold',
            stroke: ThemeConfig.COLORS.stroke.primary,
            strokeThickness: scene.r.scaleX(4)
        });

        // Value display
        const valueText = scene.add.text(scene.r.getX(80), y, initialValue + suffix, {
            fontSize: scene.r.getFontSize(32) + 'px',
            fontFamily: ThemeConfig.FONTS.primary,
            color: ThemeConfig.COLORS.text.primary,
            fontStyle: 'bold',
            stroke: ThemeConfig.COLORS.stroke.primary,
            strokeThickness: scene.r.scaleX(4)
        }).setOrigin(1, 0);

        // Slider bar background
        const barY = y + scene.r.scaleY(40);
        const barX = x;

        const sliderBg = scene.add.graphics();
        sliderBg.fillStyle(ThemeConfig.COLORS.darkPurple, 1);
        sliderBg.fillRoundedRect(barX, barY, barWidth, barHeight, 8);

        // Calculate initial handle position
        const percentage = ((initialValue - minValue) / (maxValue - minValue)) * 100;

        // Slider bar foreground (filled portion)
        const sliderFg = scene.add.graphics();
        const currentWidth = (barWidth * percentage) / 100;
        sliderFg.fillGradientStyle(
            ThemeConfig.COLORS.sunshineYellow,
            ThemeConfig.COLORS.sunshineYellow,
            0xFF9800,
            0xFF9800,
            1
        );
        sliderFg.fillRoundedRect(barX, barY, currentWidth, barHeight, 8);

        // Slider handle (draggable circle)
        const handleX = barX + currentWidth;
        const handleY = barY + (barHeight / 2);
        const handle = scene.add.circle(handleX, handleY, scene.r.scaleX(15), ThemeConfig.COLORS.white);
        handle.setStrokeStyle(scene.r.scaleX(3), ThemeConfig.COLORS.purpleMagic);
        handle.setInteractive({ draggable: true, useHandCursor: true });

        // Drag handler
        handle.on('drag', (pointer, dragX) => {
            // Constrain to bar bounds
            const newX = Phaser.Math.Clamp(dragX, barX, barX + barWidth);
            handle.x = newX;

            // Calculate new value
            const percentage = ((newX - barX) / barWidth) * 100;
            const value = Math.round(minValue + ((maxValue - minValue) * percentage / 100));

            // Update foreground graphics
            const width = (barWidth * percentage) / 100;
            sliderFg.clear();
            sliderFg.fillGradientStyle(
                ThemeConfig.COLORS.sunshineYellow,
                ThemeConfig.COLORS.sunshineYellow,
                0xFF9800,
                0xFF9800,
                1
            );
            sliderFg.fillRoundedRect(barX, barY, width, barHeight, 8);

            // Update value text
            valueText.setText(value + suffix);

            // Trigger callback
            if (onValueChange) {
                onValueChange(value);
            }
        });

        // Hover effect on handle
        handle.on('pointerover', () => {
            scene.tweens.add({
                targets: handle,
                scale: 1.2,
                duration: ThemeConfig.ANIMATIONS.durations.fast,
                ease: ThemeConfig.ANIMATIONS.easing.bounceIn
            });
        });

        handle.on('pointerout', () => {
            scene.tweens.add({
                targets: handle,
                scale: 1,
                duration: ThemeConfig.ANIMATIONS.durations.fast,
                ease: ThemeConfig.ANIMATIONS.easing.bounceOut
            });
        });

        return {
            labelText,
            valueText,
            sliderBg,
            sliderFg,
            handle,
            getValue: () => {
                const percentage = ((handle.x - barX) / barWidth) * 100;
                return Math.round(minValue + ((maxValue - minValue) * percentage / 100));
            }
        };
    }
}
