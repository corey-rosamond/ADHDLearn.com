const config = {
    type: Phaser.WEBGL,  // Force WebGL for better performance
    scale: {
        mode: Phaser.Scale.FIT,  // Fit to screen, maintain aspect ratio
        parent: 'game-container',
        width: 1600,   // Base resolution (16:10 aspect) - balanced
        height: 1000,
        min: {
            width: 800,
            height: 500
        },
        max: {
            width: 2560,
            height: 1600
        },
        autoCenter: Phaser.Scale.CENTER_BOTH,
        resolution: window.devicePixelRatio || 1  // Use device pixel ratio for sharper rendering
    },
    render: {
        antialias: true,         // Enable anti-aliasing for smooth text
        roundPixels: false,      // Allow sub-pixel rendering for smoother text
        pixelArt: false,         // Not pixel art
        mipmapFilter: 'LINEAR_MIPMAP_LINEAR'  // High quality texture filtering
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },  // No gravity - bubbles float freely
            debug: false  // Set to true to see collision boundaries
        }
    },
    backgroundColor: '#00BCD4',  // Sky Blue from Aurora's Rainbow palette
    scene: [BootScene, PreloadScene, MainMenuScene, LetterPopScene, ResultsScene]
};

const game = new Phaser.Game(config);
