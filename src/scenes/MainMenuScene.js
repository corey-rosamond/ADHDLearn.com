class MainMenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainMenu' });
    }

    // Static flag to track if welcome message has been played
    static welcomePlayed = false;

    create() {
        console.log('MainMenuScene started');

        // Create gradient background
        this.createGradientBackground();

        // Add game title
        this.add.text(400, 150, "Aurora's Letter Adventure", {
            fontSize: '48px',
            fontFamily: 'Arial',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 6
        }).setOrigin(0.5);

        // Create START button
        this.createStartButton();

        // Play welcome message (only first time)
        this.playWelcomeMessage();
    }

    playWelcomeMessage() {
        // Only play welcome message once per game session
        if (!MainMenuScene.welcomePlayed) {
            if (this.sound.get('welcome')) {
                console.log('[MainMenuScene] Playing welcome message');
                this.sound.play('welcome');
                MainMenuScene.welcomePlayed = true;
            } else {
                console.warn('[MainMenuScene] Welcome audio not loaded');
            }
        }
    }

    createGradientBackground() {
        const graphics = this.add.graphics();
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        // Create vertical gradient from purple to pink to orange
        const colorTop = Phaser.Display.Color.ValueToColor(0x6B46C1);    // Purple
        const colorMid = Phaser.Display.Color.ValueToColor(0xEC4899);    // Pink
        const colorBottom = Phaser.Display.Color.ValueToColor(0xF97316); // Orange

        // Draw gradient line by line
        for (let i = 0; i < height; i++) {
            const progress = i / height;
            let color;

            if (progress < 0.5) {
                // Purple to Pink (first half)
                color = Phaser.Display.Color.Interpolate.ColorWithColor(
                    colorTop,
                    colorMid,
                    100,
                    (progress / 0.5) * 100
                );
            } else {
                // Pink to Orange (second half)
                color = Phaser.Display.Color.Interpolate.ColorWithColor(
                    colorMid,
                    colorBottom,
                    100,
                    ((progress - 0.5) / 0.5) * 100
                );
            }

            graphics.fillStyle(Phaser.Display.Color.GetColor(color.r, color.g, color.b));
            graphics.fillRect(0, i, width, 1);
        }
    }

    createStartButton() {
        // Create button background (green rectangle)
        const buttonBg = this.add.rectangle(400, 400, 200, 80, 0x4CAF50);
        buttonBg.setStrokeStyle(4, 0xffffff);
        buttonBg.setInteractive({ useHandCursor: true });

        // Create button text
        const buttonText = this.add.text(400, 400, 'START', {
            fontSize: '36px',
            fontFamily: 'Arial',
            color: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);

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

        // Hover out - scale back to normal
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
            console.log('[MainMenuScene] START button clicked');

            // Play sound if available
            if (this.cache.audio.exists('testSound')) {
                this.sound.play('testSound');
            }

            // Scale down animation with yoyo
            this.tweens.add({
                targets: [buttonBg, buttonText],
                scaleX: 0.95,
                scaleY: 0.95,
                duration: 100,
                yoyo: true,
                onComplete: () => {
                    // Transition to LetterPopScene
                    this.scene.start('LetterPop');
                }
            });
        });
    }
}
