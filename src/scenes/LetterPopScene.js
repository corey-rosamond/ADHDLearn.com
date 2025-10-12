class LetterPopScene extends Phaser.Scene {
    constructor() {
        super({ key: 'LetterPop' });
    }

    create() {
        console.log('LetterPopScene started');

        // Simple placeholder background
        this.cameras.main.setBackgroundColor('#4488ff');

        // Placeholder text
        this.add.text(400, 250, 'Letter Pop Game', {
            fontSize: '48px',
            fontFamily: 'Arial',
            color: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        this.add.text(400, 320, 'Coming Soon!', {
            fontSize: '32px',
            fontFamily: 'Arial',
            color: '#ffff00'
        }).setOrigin(0.5);

        // Back button for testing
        const backButton = this.add.text(400, 450, 'Back to Menu', {
            fontSize: '24px',
            fontFamily: 'Arial',
            color: '#ffffff',
            backgroundColor: '#666666',
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        // Hover effect for back button
        backButton.on('pointerover', () => {
            backButton.setStyle({ backgroundColor: '#888888' });
        });

        backButton.on('pointerout', () => {
            backButton.setStyle({ backgroundColor: '#666666' });
        });

        // Click handler to return to main menu
        backButton.on('pointerdown', () => {
            console.log('[LetterPopScene] Back button clicked');
            this.scene.start('MainMenu');
        });
    }
}
