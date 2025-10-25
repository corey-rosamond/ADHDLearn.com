// ES6 Module
import ThemeConfig from '../config/ThemeConfig.js';
export default /**
 * BackgroundComponent - Reusable gradient background generator
 *
 * Purpose: Creates Aurora's Rainbow gradient backgrounds with texture caching
 * Replaces: Duplicate background code in 5+ scenes
 *
 * Usage:
 *   BackgroundComponent.createGradient(this);
 *   BackgroundComponent.createGradient(this, 'customGradientKey');
 */
class BackgroundComponent {
    /**
     * Creates a gradient background for scenes
     *
     * @param {Phaser.Scene} scene - The scene to add background to
     * @param {string} gradientKey - Optional cache key (default: 'defaultGradient')
     * @returns {Phaser.GameObjects.Image} The background image
     *
     * @example
     * // Simple usage
     * BackgroundComponent.createGradient(this);
     *
     * @example
     * // With custom cache key
     * BackgroundComponent.createGradient(this, 'menuBackground');
     */
    static createGradient(scene, gradientKey = 'defaultGradient') {
        const width = scene.cameras.main.width;
        const height = scene.cameras.main.height;

        // Check texture cache to avoid recreating same gradient
        if (!scene.textures.exists(gradientKey)) {
            const graphics = scene.add.graphics();

            // Use ThemeConfig for consistent colors
            const colorTop = Phaser.Display.Color.ValueToColor(ThemeConfig.GRADIENT.top);
            const colorMid = Phaser.Display.Color.ValueToColor(ThemeConfig.GRADIENT.middle);
            const colorBottom = Phaser.Display.Color.ValueToColor(ThemeConfig.GRADIENT.bottom);

            const bandHeight = ThemeConfig.GRADIENT.bandHeight;

            // Render gradient in bands for smooth appearance
            for (let i = 0; i < height; i += bandHeight) {
                const progress = i / height;
                let color;

                // Two-stage gradient: top→middle (0-50%), middle→bottom (50-100%)
                if (progress < 0.5) {
                    color = Phaser.Display.Color.Interpolate.ColorWithColor(
                        colorTop,
                        colorMid,
                        100,
                        (progress / 0.5) * 100
                    );
                } else {
                    color = Phaser.Display.Color.Interpolate.ColorWithColor(
                        colorMid,
                        colorBottom,
                        100,
                        ((progress - 0.5) / 0.5) * 100
                    );
                }

                graphics.fillStyle(Phaser.Display.Color.GetColor(color.r, color.g, color.b));
                graphics.fillRect(0, i, width, bandHeight);
            }

            // Generate texture and cache it
            graphics.generateTexture(gradientKey, width, height);
            graphics.destroy();
        }

        // Return the background image
        return scene.add.image(0, 0, gradientKey).setOrigin(0, 0);
    }

    /**
     * Clears a cached gradient texture
     *
     * @param {Phaser.Scene} scene - The scene
     * @param {string} gradientKey - The key to remove
     */
    static clearCache(scene, gradientKey) {
        if (scene.textures.exists(gradientKey)) {
            scene.textures.remove(gradientKey);
        }
    }
}
