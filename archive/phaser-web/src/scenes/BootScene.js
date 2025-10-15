class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'Boot' });
    }

    create() {
        // Display boot message
        this.add.text(400, 300, 'Initializing...', {
            fontSize: '24px',
            color: '#ffffff'
        }).setOrigin(0.5);

        // Transition to Preload after 1 second
        this.time.delayedCall(1000, () => {
            this.scene.start('Preload');
        });
    }
}
