/**
 * ButtonComponent - Reusable button with text, sprites, and interactions
 *
 * Purpose: Creates consistent buttons across all scenes
 * Replaces: Duplicate button code in every scene (~80 lines per button)
 *
 * Features:
 * - Multiple style presets (blue, green, setting)
 * - Hover effects with scale animation
 * - Click effects with pressed texture
 * - Idle bounce animation
 * - Automatic text overlay
 */
class ButtonComponent {
    /**
     * Button style presets matching game assets
     */
    static STYLES = {
        blue: {
            texture: 'btnBlue',
            pressedTexture: 'btnBluePressed',
            textColor: ThemeConfig.COLORS.text.secondary,
            textStroke: ThemeConfig.COLORS.stroke.blue
        },
        green: {
            texture: 'btnGreen',
            pressedTexture: 'btnGreenPressed',
            textColor: ThemeConfig.COLORS.text.secondary,
            textStroke: ThemeConfig.COLORS.stroke.green
        },
        setting: {
            texture: 'btnSetting',
            pressedTexture: 'btnSettingPressed',
            textColor: null,  // No text for icon button
            textStroke: null
        }
    };

    /**
     * Creates a styled button with text and interactions
     *
     * @param {Phaser.Scene} scene - The scene
     * @param {object} config - Configuration object
     * @param {number} config.x - X position
     * @param {number} config.y - Y position
     * @param {string} config.text - Button text (optional)
     * @param {string} config.style - Style preset name (default: 'blue')
     * @param {number} config.targetWidth - Desired button width (default: 350)
     * @param {number} config.fontSize - Font size (default: 42)
     * @param {function} config.onClick - Click callback
     * @param {boolean} config.idleBounce - Enable idle bounce animation (default: false)
     * @param {boolean} config.hoverEffect - Enable hover effect (default: true)
     * @returns {object} { button, text } - Button sprite and text objects
     *
     * @example
     * // Simple button
     * ButtonComponent.create(this, {
     *     x: this.r.centerX,
     *     y: this.r.getY(85),
     *     text: 'START',
     *     style: 'green',
     *     onClick: () => this.scene.start('Game')
     * });
     *
     * @example
     * // Button with idle bounce
     * ButtonComponent.create(this, {
     *     x: this.r.centerX,
     *     y: this.r.getY(70),
     *     text: 'PLAY AGAIN',
     *     onClick: () => this.scene.start('LetterPop'),
     *     idleBounce: true
     * });
     */
    static create(scene, config) {
        const {
            x,
            y,
            text = '',
            style = 'blue',
            targetWidth = scene.r.scaleX(350),
            fontSize = scene.r.getFontSize(42),
            onClick,
            idleBounce = false,
            hoverEffect = true
        } = config;

        const styleConfig = this.STYLES[style];

        // Create button sprite
        const button = scene.add.image(x, y, styleConfig.texture)
            .setInteractive({ useHandCursor: true });

        const scale = targetWidth / button.width;
        button.setScale(scale);

        // Create button text if provided
        let buttonText = null;
        if (text && styleConfig.textColor) {
            buttonText = scene.add.text(x, y, text, {
                fontSize: fontSize + 'px',
                fontFamily: ThemeConfig.FONTS.primary,
                color: styleConfig.textColor,
                stroke: styleConfig.textStroke,
                strokeThickness: scene.r.scaleX(6),
                fontStyle: 'bold'
            }).setOrigin(0.5);
        }

        // Add idle bounce animation
        if (idleBounce) {
            this.addIdleBounce(scene, [button, buttonText].filter(o => o), y);
        }

        // Add hover effect
        if (hoverEffect) {
            this.addHoverEffect(scene, button, buttonText, scale);
        }

        // Add click handler
        if (onClick) {
            this.addClickHandler(scene, button, buttonText, styleConfig, scale, onClick);
        }

        return { button, text: buttonText };
    }

    /**
     * Adds idle bounce animation to button
     *
     * @param {Phaser.Scene} scene - The scene
     * @param {Array} targets - Objects to animate
     * @param {number} originalY - Original Y position
     * @private
     */
    static addIdleBounce(scene, targets, originalY) {
        scene.tweens.add({
            targets: targets,
            y: originalY - scene.r.scaleY(8),
            duration: ThemeConfig.ANIMATIONS.durations.bounce,
            ease: ThemeConfig.ANIMATIONS.easing.smooth,
            yoyo: true,
            repeat: -1
        });
    }

    /**
     * Adds hover effect to button
     *
     * @param {Phaser.Scene} scene - The scene
     * @param {Phaser.GameObjects.Image} button - Button sprite
     * @param {Phaser.GameObjects.Text} buttonText - Button text (optional)
     * @param {number} scale - Base scale
     * @private
     */
    static addHoverEffect(scene, button, buttonText, scale) {
        button.on('pointerover', () => {
            scene.tweens.add({
                targets: button,
                scaleX: scale * 1.1,
                scaleY: scale * 1.1,
                duration: ThemeConfig.ANIMATIONS.durations.normal,
                ease: ThemeConfig.ANIMATIONS.easing.bounceIn
            });
            if (buttonText) {
                scene.tweens.add({
                    targets: buttonText,
                    scale: 1.1,
                    duration: ThemeConfig.ANIMATIONS.durations.normal,
                    ease: ThemeConfig.ANIMATIONS.easing.bounceIn
                });
            }
        });

        button.on('pointerout', () => {
            scene.tweens.add({
                targets: button,
                scaleX: scale,
                scaleY: scale,
                duration: ThemeConfig.ANIMATIONS.durations.normal,
                ease: ThemeConfig.ANIMATIONS.easing.bounceOut
            });
            if (buttonText) {
                scene.tweens.add({
                    targets: buttonText,
                    scale: 1,
                    duration: ThemeConfig.ANIMATIONS.durations.normal,
                    ease: ThemeConfig.ANIMATIONS.easing.bounceOut
                });
            }
        });
    }

    /**
     * Adds click handler to button
     *
     * @param {Phaser.Scene} scene - The scene
     * @param {Phaser.GameObjects.Image} button - Button sprite
     * @param {Phaser.GameObjects.Text} buttonText - Button text (optional)
     * @param {object} styleConfig - Style configuration
     * @param {number} scale - Base scale
     * @param {function} onClick - Click callback
     * @private
     */
    static addClickHandler(scene, button, buttonText, styleConfig, scale, onClick) {
        button.on('pointerdown', () => {
            if (styleConfig.pressedTexture) {
                button.setTexture(styleConfig.pressedTexture);
            }

            const targets = [button, buttonText].filter(o => o);
            scene.tweens.add({
                targets: targets,
                scaleX: scale * 0.95,
                scaleY: scale * 0.95,
                duration: ThemeConfig.ANIMATIONS.durations.instant,
                yoyo: true,
                onComplete: () => {
                    if (styleConfig.pressedTexture) {
                        button.setTexture(styleConfig.texture);
                    }
                    onClick();
                }
            });
        });
    }

    /**
     * Creates a standard back button
     *
     * @param {Phaser.Scene} scene - The scene
     * @param {object} config - Configuration object
     * @param {number} config.x - X position (default: center)
     * @param {number} config.y - Y position (default: 85%)
     * @param {string} config.targetScene - Scene to navigate to (default: 'MainMenu')
     * @returns {object} { button, text }
     *
     * @example
     * ButtonComponent.createBackButton(this);
     *
     * @example
     * ButtonComponent.createBackButton(this, {
     *     targetScene: 'LetterPopMenu',
     *     idleBounce: false
     * });
     */
    static createBackButton(scene, config = {}) {
        const {
            x = scene.r.centerX,
            y = scene.r.getY(85),
            targetScene = 'MainMenu',
            ...otherConfig
        } = config;

        return this.create(scene, {
            x,
            y,
            text: 'BACK',
            style: 'blue',
            onClick: () => scene.scene.start(targetScene),
            idleBounce: true,
            ...otherConfig
        });
    }
}
