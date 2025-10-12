class MainScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainScene' });
    }

    create() {
        console.log('MainScene started');

        // Display test image to verify it loaded
        const testImage = this.add.image(400, 300, 'testImage');
        testImage.setOrigin(0.5);

        // Add text label
        this.add.text(400, 500, 'Test Image Loaded Successfully!', {
            fontSize: '24px',
            color: '#ffffff'
        }).setOrigin(0.5);

        // Add click handler to play test sound
        testImage.setInteractive();
        testImage.on('pointerdown', () => {
            this.sound.play('testSound');
        });

        // Add instruction text
        this.add.text(400, 550, '(Click image to play test sound)', {
            fontSize: '16px',
            color: '#cccccc'
        }).setOrigin(0.5);
    }
}
