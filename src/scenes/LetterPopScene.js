class LetterPopScene extends Phaser.Scene {
    constructor() {
        super({ key: 'LetterPop' });

        // Score tracking
        this.score = 0;
        this.scoreText = null;

        // Time tracking
        this.startTime = 0;
        this.timeText = null;

        // Round state
        this.roundLetters = [];        // Array of 10 target letters for this round
        this.currentLetterIndex = 0;   // Which letter (0-9) we're on
        this.roundStartTime = 0;       // When round started
        this.progressText = null;      // "Letter X of 10" display
    }

    preload() {
        // Load success sound
        this.load.audio('success', 'assets/audio/success.mp3');

        // Load bubble pop sound
        this.load.audio('pop', 'assets/audio/pop.mp3');

        // Load all letter audio (A-Z)
        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
        letters.forEach(letter => {
            // Load individual letter sounds
            this.load.audio(`letter_${letter}`, `assets/audio/letters/${letter}.mp3`);

            // Load "Find the letter X!" instructions
            this.load.audio(`find_letter_${letter}`, `assets/audio/find_letter_${letter}.mp3`);
        });

        console.log('[LetterPopScene] Preloading audio for all 26 letters');
    }

    create() {
        console.log('LetterPopScene started');

        // Initialize bubbles array for tracking
        this.bubbles = [];

        // Initialize score
        this.score = 0;

        // Create gradient background
        this.createBackground();

        // Create UI (score and time displays)
        this.createUI();

        // Add game title and subtitle
        this.createTitle();

        // Create back button
        this.createBackButton();

        // Start first round
        this.startRound();
    }

    startRound() {
        // Generate 10 random letters for this round (or reset index if continuing)
        if (this.roundLetters.length === 0 || this.currentLetterIndex === 0) {
            this.roundLetters = this.generateLetterSequence();
            this.currentLetterIndex = 0;
            this.roundStartTime = Date.now();
            this.score = 0; // Reset score for new round
            console.log(`[LetterPopScene] New round started with letters: ${this.roundLetters.join(', ')}`);
        }

        // Select current target letter from sequence
        this.targetLetter = this.roundLetters[this.currentLetterIndex];
        console.log(`[LetterPopScene] Letter ${this.currentLetterIndex + 1}/10: ${this.targetLetter}`);

        // Update progress display
        this.updateProgressDisplay();

        // Play audio instruction (if available)
        this.playTargetLetterAudio();

        // Create multiple bubbles with different letters
        this.createBubbles();
    }

    generateLetterSequence() {
        // Generate 10 random letters for the round
        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
        const letters = [];
        for (let i = 0; i < 10; i++) {
            const randomLetter = Phaser.Utils.Array.GetRandom(alphabet);
            letters.push(randomLetter);
        }
        return letters;
    }

    updateProgressDisplay() {
        // Destroy previous progress text
        if (this.progressText) {
            this.progressText.destroy();
        }

        // Create new progress text
        this.progressText = this.add.text(400, 200, `Letter ${this.currentLetterIndex + 1} of 10`, {
            fontSize: '24px',
            fontFamily: 'Arial',
            color: '#ffffff',
            stroke: '#0066cc',
            strokeThickness: 4
        }).setOrigin(0.5);
        this.progressText.setDepth(1000); // Always on top
    }

    playTargetLetterAudio() {
        // Play audio instruction like "Find the letter B!"
        const audioKey = `find_letter_${this.targetLetter}`;
        if (this.sound.get(audioKey)) {
            this.sound.play(audioKey);
        } else {
            console.log(`[LetterPopScene] Audio not available: ${audioKey}`);
        }
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

    createUI() {
        // Create score display (top-left)
        this.scoreText = this.add.text(20, 20, 'Correct: 0', {
            fontSize: '28px',
            fontFamily: 'Arial',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4,
            fontStyle: 'bold'
        });
        this.scoreText.setDepth(1000); // Always on top

        // Create time display (top-right)
        this.timeText = this.add.text(780, 20, 'Time: 0:00', {
            fontSize: '24px',
            fontFamily: 'Arial',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(1, 0); // Right-aligned
        this.timeText.setDepth(1000); // Always on top

        // Start time tracking
        this.startTime = this.time.now;

        // Create timer event to update time every second
        this.time.addEvent({
            delay: 1000, // 1 second
            callback: this.updateTimeDisplay,
            callbackScope: this,
            loop: true
        });

        console.log('[LetterPopScene] UI created - Score and Time displays initialized');
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

        // Ensure target letter is included
        const letters = ['A', 'B', 'C'];

        // Replace one random letter with target letter to ensure it's present
        if (!letters.includes(this.targetLetter)) {
            const randomIndex = Phaser.Math.Between(0, letters.length - 1);
            letters[randomIndex] = this.targetLetter;
        }

        // Create bubbles at different positions
        letters.forEach((letter, index) => {
            const bubble = new Bubble(
                this,
                positions[index].x,
                positions[index].y,
                letter
            );

            // Store reference to scene for bubble to access targetLetter
            bubble.scene = this;

            this.bubbles.push(bubble);
            console.log(`[LetterPopScene] Bubble ${letter} created at (${positions[index].x}, ${positions[index].y})`);
        });
    }

    handleBubbleClick(bubble, clickedLetter) {
        console.log(`[LetterPopScene] Bubble clicked: ${clickedLetter}, Target: ${this.targetLetter}`);

        if (clickedLetter === this.targetLetter) {
            // CORRECT!
            this.handleCorrectClick(bubble);
        } else {
            // INCORRECT - but non-punitive
            this.handleIncorrectClick(bubble);
        }
    }

    handleCorrectClick(bubble) {
        console.log('[LetterPopScene] Correct click!');

        // Play success sound if available
        if (this.sound.get('success')) {
            this.sound.play('success');
        }

        // Create celebration particles
        this.createCelebrationEffect(bubble.x, bubble.y);

        // Disable further interaction
        bubble.disableInteractive();

        // Pop animation: scale up and fade out
        this.tweens.add({
            targets: bubble,
            scaleX: 1.5,
            scaleY: 1.5,
            alpha: 0,
            duration: 300,
            ease: 'Power2',
            onComplete: () => {
                bubble.destroy();
                this.incrementScore();

                // Check if round is complete
                if (this.currentLetterIndex >= 9) {
                    // Round complete! (finished 10th letter)
                    this.endRound();
                } else {
                    // Advance to next letter
                    this.currentLetterIndex++;
                    this.advanceToNextLetter();
                }
            }
        });
    }

    advanceToNextLetter() {
        // Clear all remaining bubbles
        this.bubbles.forEach(bubble => bubble.destroy());
        this.bubbles = [];

        // Wait a moment, then start next letter
        this.time.delayedCall(1000, () => {
            this.startRound(); // This will select the next target letter
        });
    }

    endRound() {
        console.log('[LetterPopScene] Round complete!');

        // Calculate round time
        const roundEndTime = Date.now();
        const totalTimeSeconds = Math.round((roundEndTime - this.roundStartTime) / 1000);

        // Prepare data for results scene
        const resultsData = {
            score: this.score,
            totalLetters: 10,
            timeSeconds: totalTimeSeconds
        };

        // Transition to results screen
        this.time.delayedCall(1000, () => {
            this.scene.start('Results', resultsData);
        });
    }

    handleIncorrectClick(bubble) {
        console.log('[LetterPopScene] Incorrect click - wobble');

        // Wobble animation - gentle side-to-side
        this.tweens.add({
            targets: bubble,
            x: bubble.x - 10,
            duration: 50,
            yoyo: true,
            repeat: 2,
            ease: 'Power1'
        });

        // Bubble stays on screen - player can try again
    }

    createCelebrationEffect(x, y) {
        // Simple star burst effect
        const colors = [0xFFD700, 0xFF69B4, 0x00CED1, 0x90EE90];

        for (let i = 0; i < 8; i++) {
            const angle = (Math.PI * 2 * i) / 8;
            const star = this.add.circle(x, y, 5, colors[i % colors.length]);

            const targetX = x + Math.cos(angle) * 100;
            const targetY = y + Math.sin(angle) * 100;

            this.tweens.add({
                targets: star,
                x: targetX,
                y: targetY,
                alpha: 0,
                duration: 400,
                ease: 'Power2',
                onComplete: () => star.destroy()
            });
        }
    }

    incrementScore() {
        this.score++;
        console.log(`[LetterPopScene] Score: ${this.score}`);

        // Update display
        this.updateScoreDisplay();

        // Animate score text (pulse effect)
        this.tweens.add({
            targets: this.scoreText,
            scaleX: 1.2,
            scaleY: 1.2,
            duration: 100,
            yoyo: true,
            ease: 'Power2'
        });
    }

    updateScoreDisplay() {
        this.scoreText.setText(`Correct: ${this.score}`);
    }

    updateTimeDisplay() {
        // Calculate elapsed time
        const elapsed = Math.floor((this.time.now - this.startTime) / 1000);
        const minutes = Math.floor(elapsed / 60);
        const seconds = elapsed % 60;

        // Format seconds with leading zero
        const secondsStr = seconds < 10 ? `0${seconds}` : `${seconds}`;

        // Update time display
        this.timeText.setText(`Time: ${minutes}:${secondsStr}`);
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
