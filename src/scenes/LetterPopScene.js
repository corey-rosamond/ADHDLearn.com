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

        // Load letter audio for A, B, C
        this.load.audio('letter-a', 'assets/audio/letters/A.mp3');
        this.load.audio('letter-b', 'assets/audio/letters/B.mp3');
        this.load.audio('letter-c', 'assets/audio/letters/C.mp3');
    }

    create() {
        console.log('LetterPopScene started');

        // Initialize bubbles array for tracking
        this.bubbles = [];

        // Create gradient background
        this.createBackground();

        // Add game title and subtitle
        this.createTitle();

        // Create back button
        this.createBackButton();

        // Create multiple bubbles with different letters
        this.createBubbles();
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

    createBubbles() {
        // Generate spawn positions for 3 bubbles with 150px minimum spacing
        const positions = this.generateSpawnPositions(3, 150);
        const letters = ['A', 'B', 'C'];

        // Create bubbles at different positions
        letters.forEach((letter, index) => {
            const bubble = new Bubble(
                this,
                positions[index].x,
                positions[index].y,
                letter
            );
            this.bubbles.push(bubble);
            console.log(`[LetterPopScene] Bubble ${letter} created at (${positions[index].x}, ${positions[index].y})`);
        });
    }

    generateSpawnPositions(count, minDistance = 150) {
        const positions = [];
        const minX = 100;
        const maxX = 700;
        const y = 400; // Middle height for better visibility

        for (let i = 0; i < count; i++) {
            let attempts = 0;
            let validPosition = false;
            let x;

            while (!validPosition && attempts < 50) {
                x = Phaser.Math.Between(minX, maxX);
                validPosition = true;

                // Check distance from existing positions
                for (let pos of positions) {
                    if (Math.abs(pos.x - x) < minDistance) {
                        validPosition = false;
                        break;
                    }
                }
                attempts++;
            }

            positions.push({ x, y });
        }

        return positions;
    }
}
