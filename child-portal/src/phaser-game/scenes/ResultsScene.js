// ES6 Module
import { getHighScores } from '../../services/api.js';

export default class ResultsScene extends Phaser.Scene {
    constructor() {
        super({ key: 'Results' });
    }

    init(data) {
        // Receive data from LetterPopScene
        this.score = data.score || 0;
        this.totalLetters = data.totalLetters || 10;
        this.timeSeconds = data.timeSeconds || 0;
        this.isHighScore = data.isHighScore || false;
        this.rank = data.rank || 0;
    }

    async create() {
        // Initialize responsive utilities
        this.r = new ResponsiveUtils(this);

        // Initialize AudioManager
        this.audioManager = AudioManager.getInstance();
        this.audioManager.init(this);

        // Handle page visibility to prevent audio issues
        this.setupVisibilityHandling();

        // Play game complete sound via AudioManager
        this.audioManager.playSound('gameComplete', { volume: 0.5 });

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

        // New high score badge
        if (this.isHighScore && this.rank > 0) {
            const badge = this.add.text(
                this.r.centerX,
                this.r.getY(36),
                `🏆 NEW HIGH SCORE! #${this.rank}`,
                {
                    fontSize: this.r.getFontSize(38) + 'px',
                    fontFamily: 'Fredoka One, Arial',
                    color: '#FFD700',
                    fontStyle: 'bold',
                    stroke: '#FF6B00',
                    strokeThickness: this.r.scaleX(6)
                }
            ).setOrigin(0.5);

            badge.setScale(0);
            this.tweens.add({
                targets: badge,
                scaleX: 1,
                scaleY: 1,
                duration: 600,
                delay: 600,
                ease: 'Back.easeOut'
            });

            // Pulsing animation
            this.time.delayedCall(1200, () => {
                this.tweens.add({
                    targets: badge,
                    scaleX: 1.08,
                    scaleY: 1.08,
                    duration: 800,
                    ease: 'Sine.easeInOut',
                    yoyo: true,
                    repeat: -1
                });
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

        // High scores display
        await this.displayHighScores();

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
        VisibilityHandlerMixin.setup(this, 'Results');
    }

    shutdown() {
        VisibilityHandlerMixin.cleanup(this);
    }

    // McCabe complexity: 3
    async displayHighScores() {
        try {
            const result = await getHighScores('Letter Pop', 5);

            if (result.success && result.scores.length > 0) {
                // Title
                this.add.text(this.r.centerX, this.r.getY(60), 'Top Scores', {
                    fontSize: this.r.getFontSize(32) + 'px',
                    fontFamily: 'Fredoka One, Arial',
                    color: '#FFD700',
                    stroke: '#9C27B0',
                    strokeThickness: this.r.scaleX(4)
                }).setOrigin(0.5);

                // Display scores
                result.scores.forEach((scoreData, index) => {
                    const yPos = this.r.getY(65 + (index * 3));
                    const date = new Date(scoreData.playedAt);
                    const formattedDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                    const accuracy = scoreData.accuracyPercentage ? `${Math.round(scoreData.accuracyPercentage)}%` : '';

                    const scoreText = `${index + 1}. ${scoreData.score} points ${accuracy ? `(${accuracy})` : ''} - ${formattedDate}`;

                    this.add.text(this.r.centerX, yPos, scoreText, {
                        fontSize: this.r.getFontSize(24) + 'px',
                        fontFamily: 'Fredoka One, Arial',
                        color: '#ffffff',
                        stroke: '#00BCD4',
                        strokeThickness: this.r.scaleX(3)
                    }).setOrigin(0.5);
                });
            }
        } catch (error) {
            console.error('Failed to fetch high scores:', error);
            // Fail gracefully - game still works without high scores display
        }
    }

    createBackground() {
        BackgroundComponent.createGradient(this, 'resultsBg');
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

            // Play sound via AudioManager
            this.audioManager.playSound('testSound');

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
        DecorationsComponent.createTwinklingStars(this);
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
    }
}
