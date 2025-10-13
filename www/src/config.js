const config = {
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.FIT,  // Fit to screen, maintain aspect ratio
        parent: 'game-container',
        width: 1920,   // Base resolution (16:10 aspect)
        height: 1200,
        min: {
            width: 800,
            height: 500
        },
        max: {
            width: 2560,
            height: 1600
        },
        autoCenter: Phaser.Scale.CENTER_BOTH
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
