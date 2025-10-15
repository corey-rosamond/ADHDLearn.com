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
    scene: [BootScene, PreloadScene, MainMenuScene, LetterPopMenuScene, LetterPopScene, ResultsScene, SettingsScene, LetterTestScene]
};

const game = new Phaser.Game(config);

// Debug canvas rendering to diagnose blurriness
game.events.once('ready', () => {
    const canvas = game.canvas;
    const canvasStyle = window.getComputedStyle(canvas);
    console.log('=== CANVAS DEBUG INFO ===');
    console.log('devicePixelRatio:', window.devicePixelRatio);
    console.log('Canvas actual size:', canvas.width, 'x', canvas.height);
    console.log('Canvas CSS size:', canvasStyle.width, 'x', canvasStyle.height);
    console.log('Canvas CSS size (parsed):', parseInt(canvasStyle.width), 'x', parseInt(canvasStyle.height));
    console.log('Resolution config:', config.scale.resolution);
    console.log('Game scale:', game.scale.displayScale.x, 'x', game.scale.displayScale.y);
    console.log('========================');
});
