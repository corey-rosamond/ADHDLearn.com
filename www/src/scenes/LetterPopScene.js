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

        // Countdown timer (per letter)
        this.letterTimeLimit = 10;     // 10 seconds per letter
        this.letterTimeRemaining = 10;
        this.countdownText = null;
        this.countdownTimer = null;

        // Physics collider for bubbles
        this.bubbleCollider = null;
    }

    preload() {
        // NOTE: Letter audio is now loaded globally in PreloadScene
        // Load success sound
        this.load.audio('success', 'assets/audio/success.mp3');

        // Load bubble pop sound
        this.load.audio('pop', 'assets/audio/pop.mp3');

        console.log('[LetterPopScene] Scene-specific audio preloaded');
    }

    create() {
        console.log('LetterPopScene started');

        // Initialize responsive utilities
        this.r = new ResponsiveUtils(this);

        // Load game settings from localStorage
        const timePerRound = parseInt(localStorage.getItem('letterPop_timePerRound') || '10');
        this.letterTimeLimit = timePerRound;
        this.letterTimeRemaining = timePerRound;
        console.log(`[LetterPopScene] Time per round set to: ${timePerRound} seconds`);

        // Enable physics for this scene
        if (!this.physics.world) {
            console.error('[LetterPopScene] Physics not available! Check game config.');
        }

        // RESET all round state (fixes Play Again bug)
        this.bubbles = [];
        this.score = 0;
        this.roundLetters = [];
        this.currentLetterIndex = 0;
        this.roundStartTime = 0;
        this.startTime = 0;
        this.isPaused = false;

        // Handle page visibility to prevent audio queuing
        this.setupVisibilityHandling();

        // Create gradient background
        this.createBackground();

        // Create top menu bar with all info
        this.createMenuBar();

        // Add game title and subtitle
        this.createTitle();

        // Start first round
        this.startRound();
    }

    setupVisibilityHandling() {
        // Handle both tab switching AND window focus loss

        // Tab visibility change (switching tabs)
        this.visibilityChangeHandler = () => {
            if (document.hidden) {
                console.log('[LetterPopScene] ========== TAB HIDDEN - PAUSING EVERYTHING ==========');
                console.log('[LetterPopScene] Countdown before pause:', this.letterTimeRemaining);
                this.pauseGame();
            } else {
                console.log('[LetterPopScene] ========== TAB VISIBLE - RESUMING ==========');
                console.log('[LetterPopScene] Countdown after resume:', this.letterTimeRemaining);
                this.resumeGame();
            }
        };

        // Window focus loss (clicking outside, switching windows)
        this.blurHandler = () => {
            console.log('[LetterPopScene] ========== WINDOW BLUR - PAUSING EVERYTHING ==========');
            console.log('[LetterPopScene] Countdown before pause:', this.letterTimeRemaining);
            this.pauseGame();
        };

        this.focusHandler = () => {
            console.log('[LetterPopScene] ========== WINDOW FOCUS - RESUMING ==========');
            console.log('[LetterPopScene] Countdown after resume:', this.letterTimeRemaining);
            this.resumeGame();
        };

        // Attach all event listeners
        document.addEventListener('visibilitychange', this.visibilityChangeHandler);
        window.addEventListener('blur', this.blurHandler);
        window.addEventListener('focus', this.focusHandler);

        console.log('[LetterPopScene] All pause handlers attached (visibility + focus/blur)');
    }

    pauseGame() {
        // Prevent duplicate pauses
        if (this.isPaused) return;
        this.isPaused = true;

        // Pause all sounds
        this.sound.pauseAll();

        // Pause the scene (stops physics, timers, animations)
        this.scene.pause('LetterPop');

        console.log('[LetterPopScene] Game paused');
    }

    resumeGame() {
        // Prevent duplicate resumes
        if (!this.isPaused) return;
        this.isPaused = false;

        // Resume the scene
        this.scene.resume('LetterPop');

        console.log('[LetterPopScene] Game resumed');
    }

    shutdown() {
        // Clean up all event handlers when scene is destroyed
        if (this.visibilityChangeHandler) {
            document.removeEventListener('visibilitychange', this.visibilityChangeHandler);
        }
        if (this.blurHandler) {
            window.removeEventListener('blur', this.blurHandler);
        }
        if (this.focusHandler) {
            window.removeEventListener('focus', this.focusHandler);
        }
        console.log('[LetterPopScene] All pause handlers removed');
    }


    smooshBubbles(bubbleA, bubbleB) {
        // Physics handles the actual bounce - this is just visual squish
        // Prevent rapid-fire effects
        if (bubbleA.isSmooshing || bubbleB.isSmooshing) return;

        bubbleA.isSmooshing = true;
        bubbleB.isSmooshing = true;

        // Play bubble pop sound
        if (this.cache.audio.exists('bubblePop')) {
            this.sound.play('bubblePop', { volume: 0.3 });
        }

        // Quick squish effect on both bubbles
        this.tweens.add({
            targets: bubbleA,
            scaleX: 0.8,  // Compress
            scaleY: 1.2,  // Expand vertically
            duration: 60,
            ease: 'Quad.easeOut',
            yoyo: true,
            onComplete: () => {
                this.time.delayedCall(200, () => {
                    bubbleA.isSmooshing = false;
                });
            }
        });

        this.tweens.add({
            targets: bubbleB,
            scaleX: 0.8,  // Compress
            scaleY: 1.2,  // Expand vertically
            duration: 60,
            ease: 'Quad.easeOut',
            yoyo: true,
            onComplete: () => {
                this.time.delayedCall(200, () => {
                    bubbleB.isSmooshing = false;
                });
            }
        });

        console.log(`[LetterPopScene] Smoosh! ${bubbleA.letter} <-> ${bubbleB.letter}`);
    }

    squeezeBubbleOnWall(bubble) {
        // Visual squish when bubble hits wall/header
        if (bubble.isSmooshing) return;

        bubble.isSmooshing = true;

        // Play bubble pop sound
        if (this.cache.audio.exists('bubblePop')) {
            this.sound.play('bubblePop', { volume: 0.3 });
        }

        // Quick squish effect
        this.tweens.add({
            targets: bubble,
            scaleX: 0.8,  // Compress
            scaleY: 1.2,  // Expand vertically
            duration: 60,
            ease: 'Quad.easeOut',
            yoyo: true,
            onComplete: () => {
                this.time.delayedCall(200, () => {
                    bubble.isSmooshing = false;
                });
            }
        });

        console.log(`[LetterPopScene] Squeeze! ${bubble.letter} hit wall`);
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

        // Fade out title on first letter only
        if (this.currentLetterIndex === 0) {
            this.time.delayedCall(1000, () => {
                this.fadeOutTitle();
            });
        }

        // Reset countdown timer for this letter
        this.letterTimeRemaining = this.letterTimeLimit;

        // Reset timer bar to full
        if (this.timerBarFg) {
            this.updateTimerBarGraphics(1.0);
        }

        // Clear any existing countdown timer
        if (this.countdownTimer) {
            this.countdownTimer.remove();
        }

        // Start countdown timer (1 second intervals)
        this.countdownTimer = this.time.addEvent({
            delay: 1000,
            callback: this.updateCountdown,
            callbackScope: this,
            loop: true
        });

        // Update progress display
        this.updateProgressDisplay();

        // Create/update countdown display (if you want to keep the number display)
        // this.createCountdownDisplay();

        // Play audio instruction (if available)
        this.playTargetLetterAudio();

        // Create multiple bubbles with different letters
        this.createBubbles();
    }

    applyLetterCase(letter) {
        // Load letter case setting from localStorage
        const letterCase = localStorage.getItem('letterPop_letterCase') || 'uppercase';

        switch (letterCase) {
            case 'uppercase':
                return letter.toUpperCase();
            case 'lowercase':
                return letter.toLowerCase();
            case 'mixed':
                // 50% chance of uppercase or lowercase
                return Math.random() < 0.5 ? letter.toUpperCase() : letter.toLowerCase();
            default:
                return letter.toUpperCase();
        }
    }

    generateLetterSequence() {
        // Generate 10 random letters for the round
        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
        const letters = [];
        for (let i = 0; i < 10; i++) {
            const randomLetter = Phaser.Utils.Array.GetRandom(alphabet);
            // Apply letter case setting
            letters.push(this.applyLetterCase(randomLetter));
        }
        return letters;
    }

    updateProgressDisplay() {
        // Update bookmark to show current round progress
        if (this.roundText) {
            // Format the round number on single line
            this.roundText.setText(`ROUND ${this.currentLetterIndex + 1}`);
        }
    }

    createCountdownDisplay() {
        // Destroy previous countdown display
        if (this.countdownText) {
            this.countdownText.destroy();
        }

        // Create countdown text (in header bar, bottom row)
        this.countdownText = this.add.text(this.r.centerX, this.countdownY, `${this.letterTimeRemaining}`, {
            fontSize: this.r.getFontSize(48) + 'px',
            fontFamily: 'Fredoka One, Arial',
            color: this.getCountdownColor(),
            stroke: '#000000',
            strokeThickness: this.r.scaleX(4),
            fontStyle: 'bold'
        }).setOrigin(0.5);
        this.countdownText.setDepth(1000);
    }

    getCountdownColor() {
        // Color code based on time remaining (green → yellow → red)
        if (this.letterTimeRemaining > 6) {
            return '#00E676'; // Grass Green - plenty of time
        } else if (this.letterTimeRemaining > 3) {
            return '#FFEB3B'; // Sunshine Yellow - getting close
        } else {
            return '#FF6B6B'; // Orange Pop - hurry up!
        }
    }

    updateCountdown() {
        this.letterTimeRemaining--;

        // Update timer bar (shrink from right to left as time decreases)
        if (this.timerBarFg) {
            const progress = this.letterTimeRemaining / this.letterTimeLimit;
            this.updateTimerBarGraphics(progress);
        }

        // Update countdown number display (if exists)
        if (this.countdownText) {
            this.countdownText.setText(`${this.letterTimeRemaining}`);
            this.countdownText.setColor(this.getCountdownColor());
        }

        // Check for timeout
        if (this.letterTimeRemaining <= 0) {
            this.handleLetterTimeout();
        }
    }

    playTargetLetterAudio() {
        // Play audio instruction like "Find the letter B!"
        // Always use uppercase for audio key since files are named A.mp3, B.mp3, etc.
        const audioKey = `find_letter_${this.targetLetter.toUpperCase()}`;
        if (this.cache.audio.exists(audioKey)) {
            console.log(`[LetterPopScene] Playing: ${audioKey}`);
            this.sound.play(audioKey);
        } else {
            console.warn(`[LetterPopScene] Audio not available: ${audioKey}`);
        }
    }

    createBackground() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        // Add underwater background image
        const bg = this.add.image(0, 0, 'gameBackground').setOrigin(0, 0);

        // Scale to cover entire screen
        const scaleX = width / bg.width;
        const scaleY = height / bg.height;
        const scale = Math.max(scaleX, scaleY);
        bg.setScale(scale);

        // Center if needed
        bg.x = (width - bg.width * scale) / 2;
        bg.y = (height - bg.height * scale) / 2;

        bg.setDepth(0); // Make sure it's behind everything
    }

    createMenuBar() {
        const menuBarHeight = this.r.scaleY(150); // Taller to fit timer bar
        const topRowY = this.r.getY(4);

        // Create header bar background using ONET Top_Bar (has bookmark built-in)
        const headerBar = this.add.image(0, 0, 'topBar').setOrigin(0, 0);

        // Scale to fit screen width and desired height
        const scaleX = this.cameras.main.width / headerBar.width;
        const scaleY = menuBarHeight / headerBar.height;
        headerBar.setScale(scaleX, scaleY);
        headerBar.setDepth(998);

        // Store header height for physics bounds
        this.headerBarHeight = menuBarHeight;

        // LEFT: Round text inside the built-in orange bookmark
        const bookmarkX = this.r.getX(13.2);  // Centered inside orange bookmark
        const bookmarkY = this.r.getY(4.5);    // Vertically centered in bookmark

        // Round text inside bookmark (Top_Bar has bookmark built-in)
        this.roundText = this.add.text(bookmarkX, bookmarkY, 'ROUND 1', {
            fontSize: this.r.getFontSize(24) + 'px',  // Larger for better readability
            fontFamily: 'Fredoka One, Arial',
            color: '#ffffff',
            fontStyle: 'bold',
            stroke: '#5D3A1A',  // Darker brown for better contrast
            strokeThickness: 5,  // Thicker for clarity
            align: 'center'
        }).setOrigin(0.5);
        this.roundText.setDepth(1001);

        // CENTER: Score display with Score_Box background
        const scoreX = this.r.centerX;
        const scoreY = this.r.getY(4);

        // Score box background
        const scoreBox = this.add.image(scoreX, scoreY, 'scoreBox').setOrigin(0.5);
        const scoreBoxScale = this.r.scaleX(0.35);
        scoreBox.setScale(scoreBoxScale);
        scoreBox.setDepth(999);

        // "SCORE" label
        const scoreLabel = this.add.text(scoreX, scoreY - this.r.scaleY(22), 'SCORE', {
            fontSize: this.r.getFontSize(24) + 'px',
            fontFamily: 'Fredoka One, Arial',
            color: '#FFEB3B',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 4  // Fixed thickness
        }).setOrigin(0.5);
        scoreLabel.setDepth(1000);

        // Score number
        this.scoreText = this.add.text(scoreX, scoreY + this.r.scaleY(12), '0', {
            fontSize: this.r.getFontSize(52) + 'px',
            fontFamily: 'Fredoka One, Arial',
            color: '#ffffff',
            fontStyle: 'bold',
            stroke: '#9C27B0',
            strokeThickness: 6  // Fixed thickness
        }).setOrigin(0.5);
        this.scoreText.setDepth(1000);

        // RIGHT: Home button (pause button position)
        this.createHomeButton();

        // BOTTOM: Timer progress bar
        this.createTimerBar();

        // Set physics world bounds to keep bubbles in play area
        this.physics.world.setBounds(
            0,
            this.headerBarHeight,
            this.cameras.main.width,
            this.cameras.main.height - this.headerBarHeight
        );

        console.log('[LetterPopScene] Menu bar created with Gameplay_1 layout');
    }

    createHomeButton() {
        const btnX = this.r.getX(95);   // Right side, inside top bar
        const btnY = this.r.getY(5.6);    // Centered in the peach area

        // Create home button sprite (using btnHome instead of btnPause)
        const button = this.add.image(btnX, btnY, 'btnHome').setInteractive({ useHandCursor: true });

        // Scale button to appropriate size
        const targetSize = this.r.scaleX(55);
        const scale = targetSize / button.width;
        button.setScale(scale);
        button.setDepth(1000);

        // Hover effect
        button.on('pointerover', () => {
            this.tweens.add({
                targets: button,
                scaleX: scale * 1.1,
                scaleY: scale * 1.1,
                duration: 150,
                ease: 'Back.easeOut'
            });
        });

        button.on('pointerout', () => {
            this.tweens.add({
                targets: button,
                scaleX: scale,
                scaleY: scale,
                duration: 150,
                ease: 'Back.easeIn'
            });
        });

        // Click handler - goes back to main menu
        button.on('pointerdown', () => {
            this.tweens.add({
                targets: button,
                scaleX: scale * 0.9,
                scaleY: scale * 0.9,
                duration: 80,
                yoyo: true,
                onComplete: () => {
                    this.scene.start('MainMenu');
                }
            });
        });
    }

    createTimerBar() {
        // Position inside the dark purple bar area at the bottom of Top_Bar
        const barY = this.r.getY(9.8);  // Adjusted to be inside dark purple section

        // Clock icon on the left (already has white background in the image)
        const clockIcon = this.add.image(this.r.getX(7), barY, 'clockIcon').setOrigin(0.5);
        const clockIconSize = this.r.scaleY(25);  // Target size in pixels
        const clockScale = clockIconSize / 64;     // Clock_Icon.png is 64x64
        clockIcon.setScale(clockScale);
        clockIcon.setDepth(1002);  // Above everything else

        // Calculate bar position and size (leaving room for clock icon on left)
        const barStartX = this.r.getX(7.5);  // Moved 75px to the right
        const barEndX = this.r.getX(93.35);  // 5px longer
        const barWidth = barEndX - barStartX;
        const barHeight = this.r.scaleY(12);  // Bar height in pixels (1/4 of original)

        // Timer bar background (dark purple) - using graphics
        this.timerBarBg = this.add.graphics();
        this.timerBarBg.fillStyle(0x5A2E5A, 1);  // Dark purple
        this.timerBarBg.fillRoundedRect(barStartX, barY - (barHeight / 2), barWidth, barHeight, 8);
        this.timerBarBg.setDepth(999);

        // Timer bar foreground (yellow/orange gradient) - using graphics
        this.timerBarFg = this.add.graphics();
        this.timerBarFg.setDepth(1000);

        // Store initial values
        this.timerBarStartX = barStartX;
        this.timerBarStartY = barY - (barHeight / 2);
        this.timerBarMaxWidth = barWidth;
        this.timerBarHeight = barHeight;

        // Draw initial full bar
        this.updateTimerBarGraphics(1.0);
    }


    updateTimerBarGraphics(progress) {
        // Redraw the yellow/orange gradient bar
        this.timerBarFg.clear();

        const currentWidth = this.timerBarMaxWidth * progress;

        if (currentWidth > 0) {
            // Draw gradient from yellow to orange
            this.timerBarFg.fillGradientStyle(0xFFEB3B, 0xFFEB3B, 0xFF9800, 0xFF9800, 1);
            this.timerBarFg.fillRoundedRect(
                this.timerBarStartX,
                this.timerBarStartY,
                currentWidth,
                this.timerBarHeight,
                8
            );
        }
    }

    createTitle() {
        // Main title - centered on screen
        this.titleText = this.add.text(this.r.centerX, this.r.centerY - this.r.scaleY(50), 'Letter Pop!', {
            fontSize: this.r.getFontSize(72) + 'px',
            fontFamily: 'Fredoka One, Arial',
            color: '#ffffff',
            fontStyle: 'bold',
            stroke: '#9C27B0',
            strokeThickness: this.r.scaleX(10)
        }).setOrigin(0.5);
        this.titleText.setDepth(2000); // Above everything

        // Subtitle - centered below title
        this.subtitleText = this.add.text(this.r.centerX, this.r.centerY + this.r.scaleY(50), 'Pop the bubbles to learn letters!', {
            fontSize: this.r.getFontSize(32) + 'px',
            fontFamily: 'Fredoka One, Arial',
            color: '#ffffff',
            stroke: '#FF6B6B',
            strokeThickness: this.r.scaleX(5)
        }).setOrigin(0.5);
        this.subtitleText.setDepth(2000); // Above everything
    }

    fadeOutTitle() {
        // Fade out and destroy the title and subtitle
        if (this.titleText) {
            this.tweens.add({
                targets: this.titleText,
                alpha: 0,
                duration: 800,
                ease: 'Power2',
                onComplete: () => {
                    this.titleText.destroy();
                }
            });
        }

        if (this.subtitleText) {
            this.tweens.add({
                targets: this.subtitleText,
                alpha: 0,
                duration: 800,
                ease: 'Power2',
                onComplete: () => {
                    this.subtitleText.destroy();
                }
            });
        }
    }

    createBubbles() {
        // Clean up any existing bubbles and collider first
        if (this.bubbleCollider) {
            this.bubbleCollider.destroy();
            this.bubbleCollider = null;
        }

        // Clear existing bubbles array
        if (this.bubbles && this.bubbles.length > 0) {
            console.log(`[LetterPopScene] WARNING: Cleaning up ${this.bubbles.length} existing bubbles`);
            this.bubbles.forEach(bubble => {
                if (bubble && bubble.active) {
                    this.tweens.killTweensOf(bubble);
                    bubble.destroy();
                }
            });
            this.bubbles = [];
        }

        // Generate spawn positions for 6 bubbles with 180px minimum spacing
        const bubbleCount = 6;
        const positions = this.generateSpawnPositions(bubbleCount, 180);

        // Generate random letters for bubbles
        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
        const letters = [];

        // Add target letter first (guaranteed to be present)
        letters.push(this.targetLetter);

        // Add random different letters for the rest
        while (letters.length < bubbleCount) {
            const randomLetter = Phaser.Utils.Array.GetRandom(alphabet);
            const casedLetter = this.applyLetterCase(randomLetter);
            // Avoid duplicates (check both cases since we might have A and a in mixed mode)
            const uppercaseCheck = casedLetter.toUpperCase();
            const hasUppercase = letters.some(l => l.toUpperCase() === uppercaseCheck);

            if (!hasUppercase) {
                letters.push(casedLetter);
            }
        }

        // Shuffle letters so target isn't always first
        Phaser.Utils.Array.Shuffle(letters);

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

            // Enable physics body for collision detection and bouncing
            this.physics.add.existing(bubble);
            if (bubble.body) {
                // For Containers, we need to offset the circle to center it properly
                // The offset is relative to the container's position
                bubble.body.setCircle(bubble.radius, -bubble.radius, -bubble.radius);
                bubble.body.setBounce(1.0); // Perfect bounce
                bubble.body.setCollideWorldBounds(true);
                bubble.body.setDamping(false);
                bubble.body.setMass(1);

                // Enable world bounds collision events
                bubble.body.onWorldBounds = true;

                // Set random velocity
                const velocityX = Phaser.Math.Between(-120, 120);
                const velocityY = Phaser.Math.Between(-120, 120);
                bubble.body.setVelocity(velocityX, velocityY);
            }

            this.bubbles.push(bubble);

            // Add world bounds collision listener for squeeze effect
            bubble.body.world.on('worldbounds', (body) => {
                if (body.gameObject === bubble && !bubble.isSmooshing) {
                    this.squeezeBubbleOnWall(bubble);
                }
            }, this);
        });

        // Enable collision between all bubbles with physics
        // Store the collider reference so we can destroy it later
        this.bubbleCollider = this.physics.add.collider(this.bubbles, this.bubbles, (bubbleA, bubbleB) => {
            // Visual squish effect only - physics handles the actual bounce
            this.smooshBubbles(bubbleA, bubbleB);
        });

        console.log(`[LetterPopScene] Created ${this.bubbles.length} bubbles for letter: ${this.targetLetter}`);
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

        // Stop countdown timer
        if (this.countdownTimer) {
            this.countdownTimer.remove();
            this.countdownTimer = null;
        }

        // Play correct answer sound
        if (this.cache.audio.exists('correctAnswer')) {
            this.sound.play('correctAnswer', { volume: 0.6 });
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

    handleLetterTimeout() {
        console.log('[LetterPopScene] Time ran out for this letter - no score');

        // Stop countdown timer
        if (this.countdownTimer) {
            this.countdownTimer.remove();
            this.countdownTimer = null;
        }

        // Play gentle encouragement audio
        const encouragements = ['next-time', 'keep-trying', 'nice-try', 'almost'];
        const randomEncouragement = Phaser.Utils.Array.GetRandom(encouragements);
        if (this.sound.get(randomEncouragement)) {
            this.sound.play(randomEncouragement);
        }

        // Flash countdown red briefly
        if (this.countdownText) {
            this.tweens.add({
                targets: this.countdownText,
                alpha: 0.3,
                duration: 200,
                yoyo: true,
                repeat: 2
            });
        }

        // Wait a moment, then advance to next letter (NO score increment)
        this.time.delayedCall(1500, () => {
            // Check if round is complete
            if (this.currentLetterIndex >= 9) {
                // Round complete!
                this.endRound();
            } else {
                // Advance to next letter
                this.currentLetterIndex++;
                this.advanceToNextLetter();
            }
        });
    }

    advanceToNextLetter() {
        // Clear all remaining bubbles and their tweens
        this.bubbles.forEach(bubble => {
            // Stop all tweens on this bubble
            this.tweens.killTweensOf(bubble);
            bubble.destroy();
        });
        this.bubbles = [];

        // Destroy the physics collider for the previous round
        if (this.bubbleCollider) {
            this.bubbleCollider.destroy();
            this.bubbleCollider = null;
        }

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

        // Play the letter's audio (e.g., "B", "C", "D") instead of wrong answer sound
        // Always use uppercase for audio key since files are named A.mp3, B.mp3, etc.
        const letterAudioKey = `letter_${bubble.letter.toUpperCase()}`;
        if (this.cache.audio.exists(letterAudioKey)) {
            this.sound.play(letterAudioKey, { volume: 0.6 });
            console.log(`[LetterPopScene] Playing letter audio: ${letterAudioKey}`);
        } else {
            console.warn(`[LetterPopScene] Letter audio not found: ${letterAudioKey}`);
        }

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
        this.scoreText.setText(`${this.score}`);
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

    generateSpawnPositions(count, minDistance = null) {
        const positions = [];

        // Use responsive dimensions
        const minX = this.r.getX(10);  // 10% from left
        const maxX = this.r.getX(90);  // 10% from right
        const minY = this.r.getY(40);  // Play area starts at 40%
        const maxY = this.r.getY(80);  // Play area ends at 80%

        // Scale minimum distance if not provided
        const scaledMinDistance = minDistance ? this.r.scaleX(minDistance) : this.r.scaleX(180);

        for (let i = 0; i < count; i++) {
            let attempts = 0;
            let validPosition = false;
            let x, y;

            while (!validPosition && attempts < 50) {
                x = Phaser.Math.Between(minX, maxX);
                y = Phaser.Math.Between(minY, maxY);
                validPosition = true;

                // Check distance from existing positions
                for (let pos of positions) {
                    const distance = Phaser.Math.Distance.Between(x, y, pos.x, pos.y);
                    if (distance < scaledMinDistance) {
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
