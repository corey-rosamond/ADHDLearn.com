const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game-container',
    backgroundColor: '#4488ff',
    scene: [BootScene, PreloadScene, MainMenuScene, LetterPopScene, ResultsScene]
};

const game = new Phaser.Game(config);
