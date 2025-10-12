class MainMenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainMenu' });
    }

    create() {
        console.log('MainMenuScene started');

        // Initialize AudioManager (Phase 4)
        const audioManager = AudioManager.getInstance();
        audioManager.init(this);

        // Title (Phase 2)
        this.add.text(400, 150, "Aurora's Letter Adventure", {
            fontSize: '40px',
            color: '#ffff00',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Phase 3: Display test image to verify asset loading
        const testImage = this.add.image(400, 250, 'testImage');
        testImage.setOrigin(0.5);

        // Phase 3: Test asset loaded message
        this.add.text(400, 360, 'Test Image Loaded Successfully!', {
            fontSize: '20px',
            color: '#ffffff'
        }).setOrigin(0.5);

        // Phase 4: Test button for AudioManager
        const testButton = this.add.text(400, 420, 'Test Sound (AudioManager)', {
            fontSize: '18px',
            color: '#ffffff',
            backgroundColor: '#4488ff',
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5).setInteractive();

        // Test AudioManager.playSound() on button click
        testButton.on('pointerdown', () => {
            console.log('[MainMenuScene] Test button clicked');
            audioManager.playSound('testSound');
        });

        // Visual feedback for button
        testButton.on('pointerover', () => {
            testButton.setStyle({ backgroundColor: '#6699ff' });
        });

        testButton.on('pointerout', () => {
            testButton.setStyle({ backgroundColor: '#4488ff' });
        });

        // Instruction text (Phase 2 + Phase 3/4 testing info)
        this.add.text(400, 490, '(Click button to test AudioManager)', {
            fontSize: '14px',
            color: '#cccccc'
        }).setOrigin(0.5);

        // Also keep image click for direct Phaser sound test (Phase 3)
        testImage.setInteractive();
        testImage.on('pointerdown', () => {
            console.log('[MainMenuScene] Image clicked - direct Phaser sound');
            this.sound.play('testSound');
        });

        this.add.text(400, 310, '(Click image for direct Phaser sound)', {
            fontSize: '12px',
            color: '#cccccc'
        }).setOrigin(0.5);

        // Note: Full menu implementation will be in Phase 5
    }
}
