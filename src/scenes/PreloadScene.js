class PreloadScene extends Phaser.Scene {
    constructor() {
        super({ key: 'Preload' });
    }

    create() {
        console.log('PreloadScene started');

        // Display loading message
        this.add.text(400, 300, 'Loading...', {
            fontSize: '32px',
            color: '#ffffff'
        }).setOrigin(0.5);

        // In future phases, assets will be loaded here
        // For now, just transition to MainMenu
        this.time.delayedCall(2000, () => {
            this.scene.start('MainMenu');
        });
    }
}
