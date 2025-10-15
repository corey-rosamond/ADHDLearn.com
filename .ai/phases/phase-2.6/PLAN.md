# Phase 2.6: Component Refactoring for Reusability

## Goal
Extract duplicated code into reusable components to enable rapid development of future games while maintaining 100% behavioral compatibility with existing functionality.

## Context
After comprehensive code analysis, 12 major duplication patterns were identified across the codebase:
- Background gradients duplicated 5+ times (~200 lines)
- Title creation patterns in every scene (~100 lines each)
- Button logic duplicated across all scenes (~80 lines per button)
- Floating stars decoration duplicated 4 times (160+ lines)
- Visibility handling duplicated in multiple scenes (~50 lines each)
- Slider components with similar implementations (~140 lines each)

**Critical Requirement:** Aurora's games currently work perfectly. This refactoring MUST NOT change any visible behavior, animations, or user experience. All changes are internal code organization only.

## Prerequisites
- Phase 12.5 completed (responsive design and visual overhaul)
- All current games functioning correctly
- Git repository with clean working state

## Strategy

### Refactoring Philosophy
Following PERSONA.md principles:
1. **Test First** - Write BDD scenarios before code changes
2. **Incremental Migration** - One component, one scene at a time
3. **Verify at Each Step** - Test after every migration
4. **Rollback Ready** - Git commits after each successful migration
5. **No Behavioral Changes** - Identical output, cleaner code

### Risk Mitigation
- **Checkpoint Commits** - After each component implementation
- **Scene-by-Scene Testing** - Never migrate multiple scenes at once
- **Visual Regression Testing** - Manual verification of all animations and styling
- **Rollback Plan** - Each commit can be reverted independently

## Implementation Plan

### Phase 2.6.1: Create Component Infrastructure (1 hour)

#### Task 1.1: Create Directory Structure
```bash
mkdir -p src/components
mkdir -p src/mixins
mkdir -p src/config
```

**Files to create:**
```
src/
├── components/
│   ├── BackgroundComponent.js
│   ├── TitleComponent.js
│   ├── ButtonComponent.js
│   ├── DecorationsComponent.js
│   └── SliderComponent.js
├── mixins/
│   └── VisibilityHandlerMixin.js
├── config/
│   └── ThemeConfig.js
└── scenes/
    └── BaseScene.js
```

**Acceptance Criteria:**
- [ ] Directory structure created
- [ ] No existing functionality affected
- [ ] Clean git status

**Commit:** "Phase 2.6.1: Create component directory structure"

---

### Phase 2.6.2: Implement ThemeConfig (30 minutes)

#### Task 2.1: Create Theme Configuration

**File:** `src/config/ThemeConfig.js`

```javascript
/**
 * ThemeConfig - Centralized theme and styling constants
 *
 * Purpose: Single source of truth for all colors, fonts, and animation settings
 * Used by: All components and scenes
 */
class ThemeConfig {
    /**
     * Aurora's Rainbow - ADHD-friendly bright color palette
     */
    static COLORS = {
        // Primary Palette
        orangePop: 0xFF6B6B,
        bubblePink: 0xFF4081,
        purpleMagic: 0x9C27B0,
        sunshineYellow: 0xFFEB3B,
        skyBlue: 0x00BCD4,
        grassGreen: 0x00E676,

        // UI Colors
        white: 0xFFFFFF,
        black: 0x000000,
        darkPurple: 0x5A2E5A,

        // Text Colors (hex strings for Phaser text)
        text: {
            primary: '#FFEB3B',      // Sunshine Yellow
            secondary: '#ffffff',     // White
            accent: '#FF6B6B',       // Orange Pop
            success: '#00E676',      // Grass Green
            info: '#00BCD4'          // Sky Blue
        },

        // Stroke Colors (hex strings)
        stroke: {
            primary: '#9C27B0',      // Purple Magic
            secondary: '#FF6B6B',    // Orange Pop
            blue: '#1976D2',         // Dark Blue
            green: '#2C5F2D',        // Dark Green
            black: '#000000'         // Black
        }
    };

    /**
     * Typography settings
     */
    static FONTS = {
        primary: 'Fredoka One, Arial',
        fallback: 'Arial'
    };

    /**
     * Standard animation durations and easing functions
     */
    static ANIMATIONS = {
        durations: {
            instant: 100,
            fast: 150,
            normal: 200,
            medium: 400,
            slow: 600,
            bounce: 1000,
            pulse: 1200
        },
        easing: {
            bounceIn: 'Back.easeOut',
            bounceOut: 'Back.easeIn',
            smooth: 'Sine.easeInOut',
            linear: 'Linear'
        }
    };

    /**
     * Gradient configuration for backgrounds
     */
    static GRADIENT = {
        top: 0xFF6B6B,        // Orange Pop
        middle: 0xFF4081,     // Bubble Pink
        bottom: 0x9C27B0,     // Purple Magic
        bandHeight: 10        // For rendering optimization
    };
}
```

**Testing:**
- [ ] File loads without errors
- [ ] Constants accessible from test scene
- [ ] Values match existing hardcoded values

**Commit:** "Phase 2.6.2: Add ThemeConfig with centralized styling constants"

---

### Phase 2.6.3: Implement BackgroundComponent (1 hour)

#### Task 3.1: Create Background Component

**File:** `src/components/BackgroundComponent.js`

```javascript
/**
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
```

**Testing Checklist:**
- [ ] Component loads without errors
- [ ] Gradient matches existing background exactly (pixel-perfect)
- [ ] Texture caching works (verify in texture manager)
- [ ] Multiple calls don't recreate texture
- [ ] Memory usage acceptable

**Commit:** "Phase 2.6.3: Add BackgroundComponent for gradient backgrounds"

---

### Phase 2.6.4: Implement TitleComponent (1.5 hours)

#### Task 4.1: Create Title Component

**File:** `src/components/TitleComponent.js`

```javascript
/**
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
```

**Testing Checklist:**
- [ ] Component loads without errors
- [ ] Single-line title matches existing style exactly
- [ ] Multi-line title matches main menu exactly
- [ ] Bounce-in animation timing identical
- [ ] Pulse animation timing identical
- [ ] Theme switching works correctly

**Commit:** "Phase 2.6.4: Add TitleComponent for styled titles"

---

### Phase 2.6.5: Implement ButtonComponent (2 hours)

#### Task 5.1: Create Button Component

**File:** `src/components/ButtonComponent.js`

```javascript
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
```

**Testing Checklist:**
- [ ] Component loads without errors
- [ ] Blue button matches existing style
- [ ] Green button matches existing style
- [ ] Setting button matches existing style
- [ ] Hover animation timing matches exactly
- [ ] Click animation timing matches exactly
- [ ] Idle bounce matches existing buttons
- [ ] Pressed texture switches correctly

**Commit:** "Phase 2.6.5: Add ButtonComponent for reusable buttons"

---

### Phase 2.6.6: Implement DecorationsComponent (45 minutes)

#### Task 6.1: Create Decorations Component

**File:** `src/components/DecorationsComponent.js`

```javascript
/**
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
```

**Testing Checklist:**
- [ ] Component loads without errors
- [ ] Stars match existing decoration exactly
- [ ] Float animation timing identical
- [ ] Rotation animation timing identical
- [ ] Twinkle effect (Results scene) works correctly

**Commit:** "Phase 2.6.6: Add DecorationsComponent for floating stars"

---

### Phase 2.6.7: Implement VisibilityHandlerMixin (30 minutes)

#### Task 7.1: Create Visibility Handler Mixin

**File:** `src/mixins/VisibilityHandlerMixin.js`

```javascript
/**
 * VisibilityHandlerMixin - Page visibility and focus handling
 *
 * Purpose: Manages audio pause/resume when tab loses focus
 * Replaces: Duplicate visibility handling in multiple scenes (~50 lines each)
 */
class VisibilityHandlerMixin {
    /**
     * Sets up visibility handling for a scene
     *
     * @param {Phaser.Scene} scene - The scene to setup
     * @param {string} sceneKey - The scene's key for state checking
     *
     * @example
     * // In scene's create() method:
     * VisibilityHandlerMixin.setup(this, 'MainMenu');
     */
    static setup(scene, sceneKey) {
        scene.visibilityChangeHandler = () => {
            if (document.hidden) {
                scene.audioManager.pauseAll();
                if (scene.scene.isActive(sceneKey)) {
                    scene.scene.pause(sceneKey);
                }
            } else {
                if (scene.scene.isPaused(sceneKey)) {
                    scene.scene.resume(sceneKey);
                    scene.audioManager.resumeAll();
                }
            }
        };

        scene.blurHandler = () => {
            scene.audioManager.pauseAll();
            if (scene.scene.isActive(sceneKey)) {
                scene.scene.pause(sceneKey);
            }
        };

        scene.focusHandler = () => {
            if (scene.scene.isPaused(sceneKey)) {
                scene.scene.resume(sceneKey);
                scene.audioManager.resumeAll();
            }
        };

        document.addEventListener('visibilitychange', scene.visibilityChangeHandler);
        window.addEventListener('blur', scene.blurHandler);
        window.addEventListener('focus', scene.focusHandler);
    }

    /**
     * Cleans up visibility handlers
     *
     * @param {Phaser.Scene} scene - The scene to cleanup
     *
     * @example
     * // In scene's shutdown() method:
     * VisibilityHandlerMixin.cleanup(this);
     */
    static cleanup(scene) {
        if (scene.visibilityChangeHandler) {
            document.removeEventListener('visibilitychange', scene.visibilityChangeHandler);
        }
        if (scene.blurHandler) {
            window.removeEventListener('blur', scene.blurHandler);
        }
        if (scene.focusHandler) {
            window.removeEventListener('focus', scene.focusHandler);
        }
    }
}
```

**Testing Checklist:**
- [ ] Component loads without errors
- [ ] Tab switching pauses/resumes correctly
- [ ] Window blur/focus works correctly
- [ ] Audio pauses when tab hidden
- [ ] Audio resumes when tab visible
- [ ] No memory leaks (handlers cleaned up)

**Commit:** "Phase 2.6.7: Add VisibilityHandlerMixin for focus handling"

---

### Phase 2.6.8: Implement SliderComponent (1 hour)

#### Task 8.1: Create Slider Component

**File:** `src/components/SliderComponent.js`

```javascript
/**
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
            fontSize: scene.r.getFontSize(28) + 'px',
            fontFamily: ThemeConfig.FONTS.primary,
            color: ThemeConfig.COLORS.text.secondary,
            fontStyle: 'bold',
            stroke: ThemeConfig.COLORS.stroke.primary,
            strokeThickness: scene.r.scaleX(4)
        });

        // Value display
        const valueText = scene.add.text(scene.r.getX(80), y, initialValue + suffix, {
            fontSize: scene.r.getFontSize(28) + 'px',
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
```

**Testing Checklist:**
- [ ] Component loads without errors
- [ ] Slider matches existing style exactly
- [ ] Drag behavior identical to existing
- [ ] Value updates correctly
- [ ] Hover effect works
- [ ] getValue() returns correct value

**Commit:** "Phase 2.6.8: Add SliderComponent for reusable sliders"

---

### Phase 2.6.9: Update Index HTML (10 minutes)

#### Task 9.1: Add Component Script Tags

**File:** `index.html`

Add new script tags in the correct order (after ResponsiveUtils, before scenes):

```html
<!-- Configuration -->
<script src="src/config/ThemeConfig.js"></script>

<!-- Mixins -->
<script src="src/mixins/VisibilityHandlerMixin.js"></script>

<!-- Components -->
<script src="src/components/BackgroundComponent.js"></script>
<script src="src/components/TitleComponent.js"></script>
<script src="src/components/ButtonComponent.js"></script>
<script src="src/components/DecorationsComponent.js"></script>
<script src="src/components/SliderComponent.js"></script>
```

**Testing:**
- [ ] No console errors on page load
- [ ] All components accessible globally
- [ ] Game still loads correctly

**Commit:** "Phase 2.6.9: Add component script tags to index.html"

---

### Phase 2.6.10: Migrate SettingsScene (1 hour)

#### Task 10.1: Refactor SettingsScene to Use Components

**File:** `src/scenes/SettingsScene.js`

**Before Migration Checklist:**
- [ ] Create git commit of current working state
- [ ] Test Settings scene works perfectly
- [ ] Note exact behavior: animations, timings, layout

**Refactoring Steps:**

1. **Replace createBackground():**
```javascript
// BEFORE (lines 26-62):
createBackground() {
    // Match Results screen gradient: Orange Pop → Bubble Pink → Purple Magic
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    // ... 30+ lines ...
}

// AFTER:
createBackground() {
    BackgroundComponent.createGradient(this, 'settingsBg');
}
```

2. **Replace createTitle():**
```javascript
// BEFORE (lines 64-95):
createTitle() {
    const titleY = this.r.getY(15);
    const titleText = this.add.text(this.r.centerX, titleY, 'SETTINGS', {
        // ... styling ...
    }).setOrigin(0.5);

    // Bounce-in animation
    titleText.setScale(0);
    this.tweens.add({
        // ... animation ...
    });
}

// AFTER:
createTitle() {
    TitleComponent.create(this, { text: 'SETTINGS' });
}
```

3. **Replace createVolumeSetting() with SliderComponent:**
```javascript
// BEFORE (lines 116-212): ~100 lines of slider code

// AFTER:
createVolumeSetting(label, initialValue, y, settingKey) {
    SliderComponent.create(this, {
        y: y,
        label: label,
        initialValue: parseInt(initialValue),
        suffix: '%',
        onValueChange: (value) => {
            localStorage.setItem(settingKey, value.toString());
            this.applyVolumeSettings();
        }
    });
}
```

4. **Replace createBackButton():**
```javascript
// BEFORE (lines 220-311): ~90 lines

// AFTER:
createBackButton() {
    ButtonComponent.createBackButton(this);
}
```

5. **Replace createFloatingStars():**
```javascript
// BEFORE (lines 313-348): ~35 lines

// AFTER:
createFloatingStars() {
    DecorationsComponent.createFloatingStars(this);
}
```

6. **Replace setupVisibilityHandling() and shutdown():**
```javascript
// BEFORE: Lines 42-90 in MainMenuScene (if exists in SettingsScene)

// AFTER in create():
VisibilityHandlerMixin.setup(this, 'Settings');

// AFTER in shutdown():
shutdown() {
    VisibilityHandlerMixin.cleanup(this);
}
```

**After Migration Testing:**
- [ ] Settings scene loads without errors
- [ ] Title animation identical to before
- [ ] Sliders work exactly as before
- [ ] Back button works correctly
- [ ] Background gradient identical
- [ ] Floating stars identical
- [ ] Volume changes apply immediately
- [ ] localStorage saves correctly
- [ ] Tab switching pauses correctly

**Line Count Comparison:**
- Before: ~350 lines
- After: ~100 lines
- Reduction: ~70%

**Commit:** "Phase 2.6.10: Migrate SettingsScene to use components"

---

### Phase 2.6.11: Migrate MainMenuScene (1 hour)

**Similar refactoring steps as SettingsScene:**
1. Replace createBackground()
2. Replace createColorfulTitle() with TitleComponent.createMultiLine()
3. Replace createSettingsButton()
4. Replace createDebugButton()
5. Replace createGameTile() (may need GameTileComponent)
6. Replace createFloatingStars()
7. Add VisibilityHandlerMixin

**Expected reduction:** ~40% code reduction

**Commit:** "Phase 2.6.11: Migrate MainMenuScene to use components"

---

### Phase 2.6.12: Migrate Remaining Scenes (2 hours)

Migrate in this order:
1. **LetterPopMenuScene** (~45 min)
2. **LetterTestScene** (~30 min)
3. **ResultsScene** (~45 min)

Each migration follows same pattern:
- Background → BackgroundComponent
- Title → TitleComponent
- Buttons → ButtonComponent
- Stars → DecorationsComponent
- Visibility → VisibilityHandlerMixin

**Commit after each scene:** "Phase 2.6.12: Migrate [SceneName] to use components"

---

### Phase 2.6.13: Final Testing & Cleanup (1 hour)

#### Task 13.1: Comprehensive Testing

**Test Each Scene:**
- [ ] MainMenuScene - All buttons, animations, navigation
- [ ] SettingsScene - All sliders, back button, volume changes
- [ ] LetterPopMenuScene - Settings, start button, back button
- [ ] LetterTestScene - Letter buttons, sounds, navigation
- [ ] ResultsScene - Score display, play again, animations
- [ ] LetterPopScene - (Not migrated yet, should still work)

**Test User Flows:**
- [ ] Main Menu → Settings → Back to Main Menu
- [ ] Main Menu → Letter Pop Menu → Letter Pop Game → Results → Play Again
- [ ] Main Menu → Debug (Letter Test) → Back
- [ ] Volume changes persist across scenes
- [ ] Tab switching pauses all scenes correctly

**Performance Checks:**
- [ ] No console errors
- [ ] No console warnings
- [ ] 60 FPS maintained
- [ ] Memory usage acceptable
- [ ] Texture cache not growing unbounded

#### Task 13.2: Code Cleanup

- [ ] Remove commented-out old code
- [ ] Verify consistent formatting
- [ ] Check for unused imports
- [ ] Update any inline documentation

**Commit:** "Phase 2.6.13: Final testing and cleanup"

---

## Acceptance Criteria

### Functional Requirements
- [ ] All games work identically to before refactoring
- [ ] All animations have same timing and appearance
- [ ] All buttons respond identically
- [ ] All text styling matches exactly
- [ ] Background gradients pixel-perfect
- [ ] Audio pause/resume works correctly
- [ ] Local storage saves/loads correctly

### Code Quality Requirements
- [ ] 40-50% reduction in scene file line counts
- [ ] Zero duplicate background code
- [ ] Zero duplicate button code
- [ ] Zero duplicate title code
- [ ] Zero duplicate stars code
- [ ] All components properly documented
- [ ] Consistent naming conventions

### Performance Requirements
- [ ] Texture caching working correctly
- [ ] 60 FPS maintained across all scenes
- [ ] Memory usage not increased
- [ ] No memory leaks from event handlers

### Future Readiness
- [ ] New game scenes can be created in < 100 lines
- [ ] Theme changes require single file edit
- [ ] Component API clear and consistent
- [ ] Examples in documentation

## Rollback Plan

If any issues arise:
1. Each scene migration is a separate commit
2. Can revert specific scene: `git revert <commit-hash>`
3. Can revert entire phase: `git revert <first-commit>..<last-commit>`
4. Components can be removed without affecting non-migrated code

## Time Estimates

| Task | Time | Cumulative |
|------|------|------------|
| 2.6.1: Infrastructure | 1h | 1h |
| 2.6.2: ThemeConfig | 0.5h | 1.5h |
| 2.6.3: BackgroundComponent | 1h | 2.5h |
| 2.6.4: TitleComponent | 1.5h | 4h |
| 2.6.5: ButtonComponent | 2h | 6h |
| 2.6.6: DecorationsComponent | 0.75h | 6.75h |
| 2.6.7: VisibilityHandlerMixin | 0.5h | 7.25h |
| 2.6.8: SliderComponent | 1h | 8.25h |
| 2.6.9: Update index.html | 0.17h | 8.5h |
| 2.6.10: Migrate SettingsScene | 1h | 9.5h |
| 2.6.11: Migrate MainMenuScene | 1h | 10.5h |
| 2.6.12: Migrate Other Scenes | 2h | 12.5h |
| 2.6.13: Testing & Cleanup | 1h | 13.5h |

**Total Estimated Time:** 13.5 hours

**Recommended Schedule:** 2-3 development sessions

## Post-Phase Actions

After completing Phase 2.6:

1. **Update START.md:**
   - Change active phase to Phase 2.7 or next phase
   - Update documentation paths

2. **Update README.md:**
   - Add Phase 2.6 to completed phases
   - Document new component system

3. **Git Commit:**
```bash
git add .
git commit -m "Complete Phase 2.6: Component Refactoring for Reusability

- Created reusable component system (Background, Title, Button, Decorations, Slider)
- Migrated 5 scenes to use new components
- Reduced code by 40-50% through deduplication
- Zero behavioral changes - all games work identically
- Added ThemeConfig for consistent styling
- Added VisibilityHandlerMixin for tab focus handling
- Foundation laid for rapid future game development

🤖 Generated with Claude Code"
```

4. **Test on Target Device:**
   - Deploy to Samsung Galaxy Tab S7 FE
   - Verify all games work correctly
   - Check performance maintained

---

## Notes for Phase 2.7 (Kotlin Refactor)

The component architecture created in Phase 2.6 will make Kotlin migration easier:
- Components are self-contained
- Clear separation of concerns
- Well-documented APIs
- Each component can be ported independently

Consider keeping JavaScript components working during Kotlin migration for A/B testing.

---

**Remember:** This is for Aurora. Every refactoring must preserve the experience she knows and loves. Test thoroughly. No surprises.
