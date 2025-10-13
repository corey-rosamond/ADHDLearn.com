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
        // Initialize responsive utilities
        this.r = new ResponsiveUtils(this);

        // Handle page visibility to prevent audio issues
        this.setupVisibilityHandling();

        // Play game complete sound
        if (this.cache.audio.exists('gameComplete')) {
            this.sound.play('gameComplete', { volume: 0.5 });
        }

        // Background gradient
        this.createBackground();

        // Add popup result frame
        const popup = this.add.image(this.r.centerX, this.r.centerY, 'popupResult');
        const popupScale = Math.min(
            (this.cameras.main.width * 0.9) / popup.width,
            (this.cameras.main.height * 0.8) / popup.height
        );
        popup.setScale(popupScale);
        popup.setAlpha(0);

        // Popup bounce in animation
        this.tweens.add({
            targets: popup,
            alpha: 1,
            scaleX: popupScale,
            scaleY: popupScale,
            duration: 400,
            ease: 'Back.easeOut'
        });

        // Title with bounce animation
        const titleText = this.add.text(this.r.centerX, this.r.getY(20), 'Round Complete!', {
            fontSize: this.r.getFontSize(64) + 'px',
            fontFamily: 'Fredoka One, Arial',
            color: '#FFEB3B',
            fontStyle: 'bold',
            stroke: '#9C27B0',
            strokeThickness: this.r.scaleX(8)
        }).setOrigin(0.5);

        // Bounce in animation for title
        titleText.setScale(0);
        this.tweens.add({
            targets: titleText,
            scaleX: 1,
            scaleY: 1,
            duration: 600,
            ease: 'Back.easeOut',
            onComplete: () => {
                // Continuous gentle pulse
                this.tweens.add({
                    targets: titleText,
                    scaleX: 1.05,
                    scaleY: 1.05,
                    duration: 1000,
                    ease: 'Sine.easeInOut',
                    yoyo: true,
                    repeat: -1
                });
            }
        });

        // Crown icon for perfect score
        if (this.score === this.totalLetters) {
            const crown = this.add.image(this.r.centerX, this.r.getY(32), 'iconCrown');
            const crownScale = this.r.scaleX(100) / crown.width;
            crown.setScale(0);
            this.tweens.add({
                targets: crown,
                scaleX: crownScale,
                scaleY: crownScale,
                duration: 600,
                delay: 500,
                ease: 'Back.easeOut'
            });
        }

        // Score display with slide in
        const scoreText = this.add.text(this.r.centerX, this.r.getY(42), `Score: ${this.score} out of ${this.totalLetters}`, {
            fontSize: this.r.getFontSize(48) + 'px',
            fontFamily: 'Fredoka One, Arial',
            color: '#ffffff',
            stroke: '#FF6B6B',
            strokeThickness: this.r.scaleX(6)
        }).setOrigin(0.5);

        scoreText.setX(this.r.getX(-20));
        this.tweens.add({
            targets: scoreText,
            x: this.r.centerX,
            duration: 500,
            delay: 300,
            ease: 'Back.easeOut'
        });

        // Time display
        this.add.text(this.r.centerX, this.r.getY(52), `Time: ${this.timeSeconds} seconds`, {
            fontSize: this.r.getFontSize(40) + 'px',
            fontFamily: 'Fredoka One, Arial',
            color: '#ffffff',
            stroke: '#00E676',
            strokeThickness: this.r.scaleX(5)
        }).setOrigin(0.5);

        // Performance message
        this.displayPerformanceMessage();

        // Add floating stars decoration
        this.createFloatingStars();

        // Play Again button
        this.createPlayAgainButton();

        // Celebration for perfect score
        if (this.score === this.totalLetters) {
            this.showCelebration();
        }
    }

    setupVisibilityHandling() {
        // Handle both tab switching AND window focus loss
        this.visibilityChangeHandler = () => {
            if (document.hidden) {
                console.log('[ResultsScene] Tab hidden - pausing');
                this.sound.pauseAll();
                this.scene.pause('Results');
            } else {
                console.log('[ResultsScene] Tab visible - resuming');
                this.scene.resume('Results');
            }
        };

        this.blurHandler = () => {
            console.log('[ResultsScene] Window blur - pausing');
            this.sound.pauseAll();
            this.scene.pause('Results');
        };

        this.focusHandler = () => {
            console.log('[ResultsScene] Window focus - resuming');
            this.scene.resume('Results');
        };

        document.addEventListener('visibilitychange', this.visibilityChangeHandler);
        window.addEventListener('blur', this.blurHandler);
        window.addEventListener('focus', this.focusHandler);
        console.log('[ResultsScene] All pause handlers attached');
    }

    shutdown() {
        // Clean up all event handlers
        if (this.visibilityChangeHandler) {
            document.removeEventListener('visibilitychange', this.visibilityChangeHandler);
        }
        if (this.blurHandler) {
            window.removeEventListener('blur', this.blurHandler);
        }
        if (this.focusHandler) {
            window.removeEventListener('focus', this.focusHandler);
        }
    }

    createBackground() {
        // Aurora's Rainbow gradient: Orange Pop → Bubble Pink → Purple Magic
        const graphics = this.add.graphics();
        const height = this.cameras.main.height;
        const width = this.cameras.main.width;

        const colorTop = Phaser.Display.Color.ValueToColor(0xFF6B6B);    // Orange Pop
        const colorMid = Phaser.Display.Color.ValueToColor(0xFF4081);    // Bubble Pink
        const colorBottom = Phaser.Display.Color.ValueToColor(0x9C27B0); // Purple Magic

        for (let i = 0; i < height; i++) {
            const progress = i / height;
            let color;

            if (progress < 0.5) {
                // Orange Pop to Bubble Pink (first half)
                color = Phaser.Display.Color.Interpolate.ColorWithColor(
                    colorTop,
                    colorMid,
                    100,
                    (progress / 0.5) * 100
                );
            } else {
                // Bubble Pink to Purple Magic (second half)
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

        this.add.text(this.r.centerX, this.r.getY(50), message, {
            fontSize: this.r.getFontSize(36) + 'px',
            fontFamily: 'Fredoka One, Arial',
            color: '#FFEB3B',
            fontStyle: 'italic',
            stroke: '#00BCD4',
            strokeThickness: this.r.scaleX(4)
        }).setOrigin(0.5);
    }

    createPlayAgainButton() {
        const btnX = this.r.centerX;
        const btnY = this.r.getY(72);

        // Create button sprite
        const button = this.add.image(btnX, btnY, 'btnBlue').setInteractive({ useHandCursor: true });

        // Scale button to appropriate size
        const targetWidth = this.r.scaleX(400);
        const scale = targetWidth / button.width;
        button.setScale(scale);

        // Create button text
        const buttonText = this.add.text(btnX, btnY, 'PLAY AGAIN', {
            fontSize: this.r.getFontSize(40) + 'px',
            fontFamily: 'Fredoka One, Arial',
            color: '#ffffff',
            stroke: '#1E88E5',
            strokeThickness: this.r.scaleX(5),
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Fade in button
        button.setAlpha(0);
        buttonText.setAlpha(0);
        this.tweens.add({
            targets: [button, buttonText],
            alpha: 1,
            duration: 400,
            delay: 800
        });

        // Idle bounce animation
        this.time.delayedCall(1200, () => {
            this.tweens.add({
                targets: [button, buttonText],
                y: btnY - this.r.scaleY(8),
                duration: 700,
                ease: 'Sine.easeInOut',
                yoyo: true,
                repeat: -1
            });
        });

        // Hover effect
        button.on('pointerover', () => {
            this.tweens.add({
                targets: [button, buttonText],
                scaleX: scale * 1.1,
                scaleY: scale * 1.1,
                duration: 200,
                ease: 'Back.easeOut'
            });
        });

        // Hover out
        button.on('pointerout', () => {
            this.tweens.add({
                targets: [button, buttonText],
                scaleX: scale,
                scaleY: scale,
                duration: 200,
                ease: 'Back.easeIn'
            });
        });

        // Click handler
        button.on('pointerdown', () => {
            // Change to pressed texture
            button.setTexture('btnBluePressed');

            // Play sound if available
            if (this.cache.audio.exists('testSound')) {
                this.sound.play('testSound');
            }

            this.tweens.add({
                targets: [button, buttonText],
                scaleX: scale * 0.95,
                scaleY: scale * 0.95,
                duration: 100,
                yoyo: true,
                onComplete: () => {
                    button.setTexture('btnBlue');
                    // Return to LetterPopScene for new round
                    this.scene.start('LetterPop');
                }
            });
        });
    }

    createFloatingStars() {
        // Create 10 floating stars around the screen
        const starChars = ['⭐', '✨', '💫'];

        for (let i = 0; i < 10; i++) {
            const x = this.r.getX(10 + (i * 9));
            const y = this.r.getY(20 + ((i % 3) * 20));
            const starChar = Phaser.Utils.Array.GetRandom(starChars);

            const star = this.add.text(x, y, starChar, {
                fontSize: this.r.getFontSize(32 + (i % 3) * 8) + 'px'
            }).setOrigin(0.5);

            star.setAlpha(0.8);

            // Floating animation
            this.tweens.add({
                targets: star,
                y: y + this.r.scaleY(25),
                duration: 2500 + (i * 200),
                ease: 'Sine.easeInOut',
                yoyo: true,
                repeat: -1,
                delay: i * 100
            });

            // Rotation
            this.tweens.add({
                targets: star,
                angle: i % 2 === 0 ? 360 : -360,
                duration: 3000 + (i * 300),
                repeat: -1
            });

            // Twinkle
            this.tweens.add({
                targets: star,
                alpha: 0.3,
                duration: 1000 + (i * 150),
                ease: 'Sine.easeInOut',
                yoyo: true,
                repeat: -1
            });
        }
    }

    showCelebration() {
        // Star particle celebration for perfect score
        const stars = [];
        for (let i = 0; i < 20; i++) {
            const x = Phaser.Math.Between(this.r.getX(20), this.r.getX(80));
            const y = Phaser.Math.Between(this.r.getY(5), this.r.getY(20));
            const star = this.add.text(x, y, '⭐', { fontSize: this.r.getFontSize(32) + 'px' });
            stars.push(star);

            this.tweens.add({
                targets: star,
                y: y + this.r.scaleY(Phaser.Math.Between(80, 200)),
                alpha: 0,
                duration: 2000,
                ease: 'Power2',
                onComplete: () => star.destroy()
            });
        }

        console.log('[ResultsScene] Perfect score celebration!');
    }
}
