// ES6 Module
export default /**
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
