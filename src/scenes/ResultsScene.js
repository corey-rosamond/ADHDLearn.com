class ResultsScene extends Phaser.Scene {
    constructor() {
        super({ key: 'Results' });
    }

    init(data) {
        // Receive data from LetterPopScene
        this.score = data.score || 0;
        this.totalLetters = data.totalLetters || 10;
        this.timeSeconds = data.timeSeconds || 0;

        console.log(`[ResultsScene] Received data - Score: ${this.score}/${this.totalLetters}, Time: ${this.timeSeconds}s`);
    }

    create() {
        // Background gradient (similar to LetterPopScene)
        this.createBackground();

        // Title
        this.add.text(400, 100, 'Round Complete!', {
            fontSize: '48px',
            fontFamily: 'Arial',
            color: '#ffff00',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 6
        }).setOrigin(0.5);

        // Score display
        this.add.text(400, 220, `Score: ${this.score} out of ${this.totalLetters}`, {
            fontSize: '36px',
            fontFamily: 'Arial',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5);

        // Time display
        this.add.text(400, 290, `Time: ${this.timeSeconds} seconds`, {
            fontSize: '32px',
            fontFamily: 'Arial',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5);

        // Performance message
        this.displayPerformanceMessage();

        // Play Again button
        this.createPlayAgainButton();

        // Celebration for perfect score
        if (this.score === this.totalLetters) {
            this.showCelebration();
        }
    }

    createBackground() {
        // Sky blue to turquoise gradient (same as LetterPopScene)
        const graphics = this.add.graphics();
        const colors = [0x87CEEB, 0x00CED1];
        const height = this.cameras.main.height;
        const width = this.cameras.main.width;

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

    displayPerformanceMessage() {
        let message = '';
        const percentage = (this.score / this.totalLetters) * 100;

        if (percentage === 100) {
            message = 'Perfect! Amazing work!';
        } else if (percentage >= 80) {
            message = 'Great job!';
        } else if (percentage >= 60) {
            message = 'Good effort!';
        } else {
            message = 'Keep practicing!';
        }

        this.add.text(400, 360, message, {
            fontSize: '28px',
            fontFamily: 'Arial',
            color: '#ffff00',
            fontStyle: 'italic',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(0.5);
    }

    createPlayAgainButton() {
        // Button background
        const buttonBg = this.add.rectangle(400, 480, 240, 80, 0x4CAF50);
        buttonBg.setStrokeStyle(4, 0xffffff);

        // Button text
        const buttonText = this.add.text(400, 480, 'Play Again', {
            fontSize: '32px',
            fontFamily: 'Arial',
            color: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Make interactive
        buttonBg.setInteractive({ useHandCursor: true });

        // Hover effects
        buttonBg.on('pointerover', () => {
            this.tweens.add({
                targets: [buttonBg, buttonText],
                scaleX: 1.1,
                scaleY: 1.1,
                duration: 200,
                ease: 'Power2'
            });
        });

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
            // Play sound if available
            if (this.sound.get('testSound')) {
                this.sound.play('testSound');
            }

            this.tweens.add({
                targets: [buttonBg, buttonText],
                scaleX: 0.95,
                scaleY: 0.95,
                duration: 100,
                yoyo: true,
                onComplete: () => {
                    // Return to LetterPopScene for new round
                    this.scene.start('LetterPop');
                }
            });
        });
    }

    showCelebration() {
        // Star particle celebration for perfect score
        const stars = [];
        for (let i = 0; i < 20; i++) {
            const x = Phaser.Math.Between(200, 600);
            const y = Phaser.Math.Between(50, 150);
            const star = this.add.text(x, y, '⭐', { fontSize: '24px' });
            stars.push(star);

            this.tweens.add({
                targets: star,
                y: y + Phaser.Math.Between(50, 150),
                alpha: 0,
                duration: 2000,
                ease: 'Power2',
                onComplete: () => star.destroy()
            });
        }

        console.log('[ResultsScene] Perfect score celebration!');
    }
}
