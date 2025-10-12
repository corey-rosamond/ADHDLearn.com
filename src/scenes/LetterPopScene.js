class LetterPopScene extends Phaser.Scene {
    constructor() {
        super({ key: 'LetterPop' });
    }

    preload() {
        // Audio is already loaded from MainMenuScene, but check if needed
        if (!this.sound.get('buttonClick')) {
            this.load.audio('buttonClick', 'assets/audio/button-click.mp3');
        }

        // Load bubble pop sound
        this.load.audio('pop', 'assets/audio/pop.mp3');

        // Load letter audio for A
        this.load.audio('letter-a', 'assets/audio/letters/A.mp3');
    }

    create() {
        console.log('LetterPopScene started');

        // Create gradient background
        this.createBackground();

        // Add game title and subtitle
        this.createTitle();

        // Create back button
        this.createBackButton();

        // Create bubble with letter A
        this.createBubble();
    }

    createBackground() {
        // Sky blue to turquoise gradient
        const graphics = this.add.graphics();
        const colors = [0x87CEEB, 0x00CED1]; // Sky blue to turquoise
        const height = this.cameras.main.height;
        const width = this.cameras.main.width;

        // Draw gradient line by line
        for (let i = 0; i < height; i++) {
            const progress = i / height;
            const color = Phaser.Display.Color.Interpolate.ColorWithColor(
                Phaser.Display.Color.ValueToColor(colors[0]),
                Phaser.Display.Color.ValueToColor(colors[1]),
                100,
                progress * 100
            );
            graphics.fillStyle(Phaser.Display.Color.GetColor(color.r, color.g, color.b));
            graphics.fillRect(0, i, width, 1);
        }
    }

    createTitle() {
        // Main title
        this.add.text(400, 80, 'Letter Pop!', {
            fontSize: '64px',
            fontFamily: 'Arial',
            color: '#ffffff',
            fontStyle: 'bold',
            stroke: '#0066cc',
            strokeThickness: 8
        }).setOrigin(0.5);

        // Subtitle
        this.add.text(400, 140, 'Pop the bubbles to learn letters!', {
            fontSize: '24px',
            fontFamily: 'Arial',
            color: '#ffffff',
            stroke: '#0066cc',
            strokeThickness: 4
        }).setOrigin(0.5);
    }

    createBackButton() {
        // Create button background (red/coral color)
        const buttonBg = this.add.rectangle(100, 50, 150, 60, 0xff6b6b);
        buttonBg.setStrokeStyle(3, 0xffffff);

        // Create button text
        const buttonText = this.add.text(100, 50, '< Menu', {
            fontSize: '24px',
            fontFamily: 'Arial',
            color: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Make button interactive
        buttonBg.setInteractive({ useHandCursor: true });

        // Hover effect - scale up
        buttonBg.on('pointerover', () => {
            this.tweens.add({
                targets: [buttonBg, buttonText],
                scaleX: 1.1,
                scaleY: 1.1,
                duration: 200,
                ease: 'Power2'
            });
        });

        // Mouse out - scale back to normal
        buttonBg.on('pointerout', () => {
            this.tweens.add({
                targets: [buttonBg, buttonText],
                scaleX: 1.0,
                scaleY: 1.0,
                duration: 200,
                ease: 'Power2'
            });
        });

        // Click handler
        buttonBg.on('pointerdown', () => {
            console.log('[LetterPopScene] Back button clicked');

            // Play sound if available
            if (this.sound.get('buttonClick')) {
                this.sound.play('buttonClick');
            }

            // Scale down animation with yoyo
            this.tweens.add({
                targets: [buttonBg, buttonText],
                scaleX: 0.95,
                scaleY: 0.95,
                duration: 100,
                yoyo: true,
                onComplete: () => {
                    // Return to main menu
                    this.scene.start('MainMenu');
                }
            });
        });
    }

    createBubble() {
        // Create bubble at center of screen
        const centerX = this.cameras.main.width / 2;  // 800 / 2 = 400
        const centerY = this.cameras.main.height / 2; // 600 / 2 = 300

        // Instantiate bubble with letter "A"
        this.bubble = new Bubble(this, centerX, centerY, 'A');

        console.log('[LetterPopScene] Bubble created at', centerX, centerY);
    }
}
