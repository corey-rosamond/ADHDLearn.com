// ES6 Module
export default class MainScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainScene' });
    }

    create() {
        console.log('MainScene started');

        // Initialize AudioManager
        const audioManager = AudioManager.getInstance();
        audioManager.init(this);

        // Display test image to verify it loaded
        const testImage = this.add.image(400, 200, 'testImage');
        testImage.setOrigin(0.5);

        // Add text label
        this.add.text(400, 380, 'Test Image Loaded Successfully!', {
            fontSize: '24px',
            color: '#ffffff'
        }).setOrigin(0.5);

        // Create test button for AudioManager
        const testButton = this.add.text(400, 450, 'Test Sound (AudioManager)', {
            fontSize: '20px',
            color: '#ffffff',
            backgroundColor: '#4488ff',
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5).setInteractive();

        // Test AudioManager.playSound() on button click
        testButton.on('pointerdown', () => {
            console.log('[MainScene] Test button clicked');
            audioManager.playSound('testSound');
        });

        // Visual feedback for button
        testButton.on('pointerover', () => {
            testButton.setStyle({ backgroundColor: '#6699ff' });
        });

        testButton.on('pointerout', () => {
            testButton.setStyle({ backgroundColor: '#4488ff' });
        });

        // Add instruction text
        this.add.text(400, 520, '(Click button to test AudioManager)', {
            fontSize: '16px',
            color: '#cccccc'
        }).setOrigin(0.5);

        // Also keep image click for direct Phaser sound test
        testImage.setInteractive();
        testImage.on('pointerdown', () => {
            console.log('[MainScene] Image clicked - direct Phaser sound');
            this.sound.play('testSound');
        });

        this.add.text(400, 330, '(Click image for direct Phaser sound)', {
            fontSize: '14px',
            color: '#cccccc'
        }).setOrigin(0.5);
    }
}
