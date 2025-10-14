class LetterTestScene extends Phaser.Scene {
    constructor() {
        super({ key: 'LetterTest' });
    }

    create() {
        console.log('LetterTestScene started');

        // Initialize responsive utilities
        this.r = new ResponsiveUtils(this);

        // Create gradient background
        this.createBackground();

        // Create title
        this.createTitle();

        // Create letter buttons in a grid
        this.createLetterButtons();

        // Create back button
        this.createBackButton();
    }

    createBackground() {
        // Match game gradient: Orange Pop → Bubble Pink → Purple Magic
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        const graphics = this.add.graphics();

        const colorTop = Phaser.Display.Color.ValueToColor(0xFF6B6B);    // Orange Pop
        const colorMid = Phaser.Display.Color.ValueToColor(0xFF4081);    // Bubble Pink
        const colorBottom = Phaser.Display.Color.ValueToColor(0x9C27B0); // Purple Magic

        const bandHeight = 10;

        for (let i = 0; i < height; i += bandHeight) {
            const progress = i / height;
            let color;

            if (progress < 0.5) {
                color = Phaser.Display.Color.Interpolate.ColorWithColor(
                    colorTop,
                    colorMid,
                    100,
                    (progress / 0.5) * 100
                );
            } else {
                color = Phaser.Display.Color.Interpolate.ColorWithColor(
                    colorMid,
                    colorBottom,
                    100,
                    ((progress - 0.5) / 0.5) * 100
                );
            }

            graphics.fillStyle(Phaser.Display.Color.GetColor(color.r, color.g, color.b));
            graphics.fillRect(0, i, width, bandHeight);
        }
    }

    createTitle() {
        const titleY = this.r.getY(8);

        const titleText = this.add.text(this.r.centerX, titleY, 'LETTER SOUND TEST', {
            fontSize: this.r.getFontSize(56) + 'px',
            fontFamily: 'Fredoka One, Arial',
            color: '#FFEB3B',
            fontStyle: 'bold',
            stroke: '#9C27B0',
            strokeThickness: this.r.scaleX(8)
        }).setOrigin(0.5);

        const subtitleText = this.add.text(this.r.centerX, titleY + this.r.scaleY(50), 'Click any letter to hear its sound', {
            fontSize: this.r.getFontSize(24) + 'px',
            fontFamily: 'Fredoka One, Arial',
            color: '#ffffff',
            stroke: '#FF6B6B',
            strokeThickness: this.r.scaleX(3)
        }).setOrigin(0.5);
    }

    createLetterButtons() {
        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

        // Grid layout: 13 letters per row, 2 rows
        const lettersPerRow = 13;
        const buttonSize = this.r.scaleX(60);
        const buttonSpacing = this.r.scaleX(10);
        const totalRowWidth = (buttonSize * lettersPerRow) + (buttonSpacing * (lettersPerRow - 1));
        const startX = this.r.centerX - (totalRowWidth / 2) + (buttonSize / 2);
        const startY = this.r.getY(30);

        letters.forEach((letter, index) => {
            const row = Math.floor(index / lettersPerRow);
            const col = index % lettersPerRow;

            const x = startX + (col * (buttonSize + buttonSpacing));
            const y = startY + (row * (buttonSize + buttonSpacing + this.r.scaleY(20)));

            this.createLetterButton(letter, x, y, buttonSize);
        });
    }

    createLetterButton(letter, x, y, size) {
        // Button background circle
        const button = this.add.graphics();
        button.fillStyle(0x00E676, 1); // Grass Green
        button.fillCircle(x, y, size / 2);
        button.setInteractive(
            new Phaser.Geom.Circle(x, y, size / 2),
            Phaser.Geom.Circle.Contains
        );

        // Letter text
        const letterText = this.add.text(x, y, letter, {
            fontSize: this.r.getFontSize(36) + 'px',
            fontFamily: 'Fredoka One, Arial',
            color: '#ffffff',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(0.5);

        // Hover effect
        button.on('pointerover', () => {
            button.clear();
            button.fillStyle(0xFFEB3B, 1); // Sunshine Yellow on hover
            button.fillCircle(x, y, size / 2);

            this.tweens.add({
                targets: [letterText],
                scale: 1.2,
                duration: 150,
                ease: 'Back.easeOut'
            });
        });

        button.on('pointerout', () => {
            button.clear();
            button.fillStyle(0x00E676, 1); // Back to Grass Green
            button.fillCircle(x, y, size / 2);

            this.tweens.add({
                targets: [letterText],
                scale: 1,
                duration: 150,
                ease: 'Back.easeIn'
            });
        });

        // Click handler - play letter sound
        button.on('pointerdown', () => {
            console.log(`[LetterTestScene] Playing letter: ${letter}`);

            // Play the letter audio
            const audioKey = `letter_${letter}`;
            if (this.cache.audio.exists(audioKey)) {
                this.sound.play(audioKey, { volume: 0.8 });
            } else {
                console.warn(`[LetterTestScene] Audio not found: ${audioKey}`);
            }

            // Visual feedback - pulse animation
            this.tweens.add({
                targets: [letterText],
                scale: 1.5,
                duration: 100,
                yoyo: true,
                ease: 'Quad.easeOut'
            });
        });
    }

    createBackButton() {
        const btnY = this.r.getY(90);

        const backButton = this.add.image(this.r.centerX, btnY, 'btnBlue').setInteractive({ useHandCursor: true });
        const backScale = this.r.scaleX(300) / backButton.width;
        backButton.setScale(backScale);

        const backText = this.add.text(this.r.centerX, btnY, 'BACK', {
            fontSize: this.r.getFontSize(38) + 'px',
            fontFamily: 'Fredoka One, Arial',
            color: '#ffffff',
            stroke: '#1976D2',
            strokeThickness: this.r.scaleX(6),
            fontStyle: 'bold'
        }).setOrigin(0.5);

        backButton.on('pointerover', () => {
            this.tweens.add({
                targets: [backButton],
                scaleX: backScale * 1.1,
                scaleY: backScale * 1.1,
                duration: 200,
                ease: 'Back.easeOut'
            });
            this.tweens.add({
                targets: [backText],
                scale: 1.1,
                duration: 200,
                ease: 'Back.easeOut'
            });
        });

        backButton.on('pointerout', () => {
            this.tweens.add({
                targets: [backButton],
                scaleX: backScale,
                scaleY: backScale,
                duration: 200,
                ease: 'Back.easeIn'
            });
            this.tweens.add({
                targets: [backText],
                scale: 1,
                duration: 200,
                ease: 'Back.easeIn'
            });
        });

        backButton.on('pointerdown', () => {
            backButton.setTexture('btnBluePressed');
            this.tweens.add({
                targets: [backButton, backText],
                scale: backScale * 0.95,
                duration: 100,
                yoyo: true,
                onComplete: () => {
                    backButton.setTexture('btnBlue');
                    this.scene.start('MainMenu');
                }
            });
        });
    }
}
