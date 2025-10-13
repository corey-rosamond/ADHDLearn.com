class MainMenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainMenu' });
    }

    create() {
        console.log('MainMenuScene started');

        // Initialize responsive utilities
        this.r = new ResponsiveUtils(this);

        // Handle page visibility to prevent audio issues
        this.setupVisibilityHandling();

        // Create background using ONET asset
        this.createBackground();

        // Add decorative clouds (disabled for now with ONET background)
        // this.createClouds();

        // Add colorful title with 3D effect
        this.createColorfulTitle();

        // Add floating letters
        this.createFloatingLetters();

        // Create START button
        this.createStartButton();

        // Play welcome message when menu loads
        this.playWelcomeMessage();
    }

    setupVisibilityHandling() {
        // Handle both tab switching AND window focus loss
        this.visibilityChangeHandler = () => {
            if (document.hidden) {
                console.log('[MainMenuScene] Tab hidden - pausing');
                this.sound.pauseAll();
                this.scene.pause('MainMenu');
            } else {
                console.log('[MainMenuScene] Tab visible - resuming');
                this.scene.resume('MainMenu');
            }
        };

        this.blurHandler = () => {
            console.log('[MainMenuScene] Window blur - pausing');
            this.sound.pauseAll();
            this.scene.pause('MainMenu');
        };

        this.focusHandler = () => {
            console.log('[MainMenuScene] Window focus - resuming');
            this.scene.resume('MainMenu');
        };

        document.addEventListener('visibilitychange', this.visibilityChangeHandler);
        window.addEventListener('blur', this.blurHandler);
        window.addEventListener('focus', this.focusHandler);
        console.log('[MainMenuScene] All pause handlers attached');
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

    playWelcomeMessage() {
        // Play welcome message every time the menu loads
        if (this.cache.audio.exists('welcome')) {
            console.log('[MainMenuScene] Playing welcome message: "Welcome to Aurora\'s Reading Adventure"');
            this.sound.play('welcome');
        } else {
            console.error('[MainMenuScene] Welcome audio not found in cache!');
            console.log('[MainMenuScene] Available audio keys:', this.cache.audio.getKeys());
        }
    }

    createColorfulTitle() {
        // Create bold, colorful title similar to ONET CLASSIC style
        // "Aurora's" on line 1, "Reading Adventure" on line 2

        const line1Y = this.r.getY(18);
        const line2Y = this.r.getY(30);

        // Define colors for each letter (vibrant, bold colors)
        const colors = [
            '#FF6B35', // Orange
            '#FF3D68', // Pink
            '#FFD23F', // Yellow
            '#4ECDC4', // Teal
            '#95E1D3', // Light Teal
            '#F38181', // Coral
            '#AA96DA'  // Purple
        ];

        // Line 1: "AURORA'S"
        const line1Text = "AURORA'S";
        const line1Container = this.createStyledWord(line1Text, this.r.centerX, line1Y, colors, this.r.getFontSize(80));

        // Line 2: "READING"
        const line2Text = "READING";
        const line2Container = this.createStyledWord(line2Text, this.r.centerX, line2Y, colors, this.r.getFontSize(70));

        // Line 3: "ADVENTURE" in a banner style
        const line3Y = this.r.getY(40);
        const line3Text = "ADVENTURE";
        const line3Container = this.createStyledWord(line3Text, this.r.centerX, line3Y, ['#4ECDC4'], this.r.getFontSize(55));

        // Pulsing animation for all titles
        [line1Container, line2Container, line3Container].forEach((container, index) => {
            this.tweens.add({
                targets: container,
                scaleX: 1.03,
                scaleY: 1.03,
                duration: 1500 + (index * 200),
                ease: 'Sine.easeInOut',
                yoyo: true,
                repeat: -1
            });
        });
    }

    createStyledWord(text, centerX, y, colors, fontSize) {
        // Create container for the word
        const container = this.add.container(centerX, y);

        // Calculate total width to center properly
        const letterSpacing = fontSize * 0.8;
        const totalWidth = (text.length - 1) * letterSpacing;
        const startX = -totalWidth / 2;

        // Create each letter with different colors
        text.split('').forEach((letter, i) => {
            const x = startX + (i * letterSpacing);
            const color = colors[i % colors.length];

            // Create 3D effect with shadow layers
            // Shadow layer 1 (darkest)
            const shadow1 = this.add.text(x + this.r.scaleX(8), this.r.scaleY(8), letter, {
                fontSize: fontSize + 'px',
                fontFamily: 'Fredoka One, Arial',
                color: '#000000',
                fontStyle: 'bold'
            }).setOrigin(0.5).setAlpha(0.3);

            // Shadow layer 2
            const shadow2 = this.add.text(x + this.r.scaleX(6), this.r.scaleY(6), letter, {
                fontSize: fontSize + 'px',
                fontFamily: 'Fredoka One, Arial',
                color: '#000000',
                fontStyle: 'bold'
            }).setOrigin(0.5).setAlpha(0.4);

            // Dark outline
            const outline = this.add.text(x, 0, letter, {
                fontSize: fontSize + 'px',
                fontFamily: 'Fredoka One, Arial',
                color: '#2C3E50',
                stroke: '#000000',
                strokeThickness: this.r.scaleX(12),
                fontStyle: 'bold'
            }).setOrigin(0.5);

            // Main letter (colored)
            const mainLetter = this.add.text(x, 0, letter, {
                fontSize: fontSize + 'px',
                fontFamily: 'Fredoka One, Arial',
                color: color,
                stroke: '#ffffff',
                strokeThickness: this.r.scaleX(8),
                fontStyle: 'bold'
            }).setOrigin(0.5);

            // Inner highlight for 3D effect
            const highlight = this.add.text(x, -this.r.scaleY(3), letter, {
                fontSize: fontSize + 'px',
                fontFamily: 'Fredoka One, Arial',
                color: '#ffffff',
                fontStyle: 'bold'
            }).setOrigin(0.5).setAlpha(0.3);

            // Add all layers to container
            container.add([shadow1, shadow2, outline, mainLetter, highlight]);
        });

        return container;
    }

    createBackground() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        // Add background image and scale to fit screen
        const bg = this.add.image(0, 0, 'mainMenuBg').setOrigin(0, 0);

        // Scale to cover entire screen
        const scaleX = width / bg.width;
        const scaleY = height / bg.height;
        const scale = Math.max(scaleX, scaleY);
        bg.setScale(scale);

        // Center if needed
        bg.x = (width - bg.width * scale) / 2;
        bg.y = (height - bg.height * scale) / 2;
    }

    createStartButton() {
        const btnX = this.r.centerX;
        const btnY = this.r.getY(70);

        // Create button sprite
        const button = this.add.image(btnX, btnY, 'btnGreen').setInteractive({ useHandCursor: true });

        // Scale button to appropriate size
        const targetWidth = this.r.scaleX(450);
        const scale = targetWidth / button.width;
        button.setScale(scale);

        // Create button text
        const buttonText = this.add.text(btnX, btnY, 'PLAY GAME', {
            fontSize: this.r.getFontSize(48) + 'px',
            fontFamily: 'Fredoka One, Arial',
            color: '#ffffff',
            stroke: '#2C5F2D',
            strokeThickness: this.r.scaleX(6),
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Idle bounce animation
        this.tweens.add({
            targets: [button, buttonText],
            y: btnY - this.r.scaleY(15),
            duration: 1000,
            ease: 'Sine.easeInOut',
            yoyo: true,
            repeat: -1
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
            console.log('[MainMenuScene] START button clicked');

            // Change to pressed texture
            button.setTexture('btnGreenPressed');

            // Play sound if available
            if (this.cache.audio.exists('testSound')) {
                this.sound.play('testSound');
            }

            // Scale down animation with yoyo
            this.tweens.add({
                targets: [button, buttonText],
                scaleX: scale * 0.95,
                scaleY: scale * 0.95,
                duration: 100,
                yoyo: true,
                onComplete: () => {
                    button.setTexture('btnGreen');
                    // Transition to LetterPopScene
                    this.scene.start('LetterPop');
                }
            });
        });
    }

    createClouds() {
        // Create 5 decorative clouds at different positions
        const cloudData = [
            { x: 15, y: 20, scale: 0.8 },
            { x: 75, y: 15, scale: 0.6 },
            { x: 40, y: 35, scale: 1.0 },
            { x: 85, y: 30, scale: 0.7 },
            { x: 10, y: 50, scale: 0.9 }
        ];

        cloudData.forEach((data, index) => {
            const cloud = this.createSingleCloud(
                this.r.getX(data.x),
                this.r.getY(data.y),
                data.scale
            );

            // Add floating animation with random duration and delay
            this.tweens.add({
                targets: cloud,
                y: cloud.y + this.r.scaleY(20),
                duration: 3000 + (index * 500),
                ease: 'Sine.easeInOut',
                yoyo: true,
                repeat: -1,
                delay: index * 300
            });

            // Add horizontal drift
            this.tweens.add({
                targets: cloud,
                x: cloud.x + this.r.scaleX(30),
                duration: 4000 + (index * 400),
                ease: 'Sine.easeInOut',
                yoyo: true,
                repeat: -1,
                delay: index * 200
            });
        });
    }

    createSingleCloud(x, y, scale = 1.0) {
        // Create cloud shape using graphics with multiple circles
        const graphics = this.add.graphics();
        graphics.fillStyle(0xffffff, 0.6); // Semi-transparent white

        const baseSize = this.r.scaleX(60) * scale;

        // Cloud is made of overlapping circles
        graphics.fillCircle(x, y, baseSize * 0.6);
        graphics.fillCircle(x - baseSize * 0.5, y + baseSize * 0.1, baseSize * 0.5);
        graphics.fillCircle(x + baseSize * 0.5, y + baseSize * 0.1, baseSize * 0.5);
        graphics.fillCircle(x - baseSize * 0.3, y - baseSize * 0.2, baseSize * 0.4);
        graphics.fillCircle(x + baseSize * 0.3, y - baseSize * 0.2, baseSize * 0.4);

        return graphics;
    }

    createFloatingLetters() {
        // Create 8 colorful floating letters around the screen
        const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
        const colors = [0x00BCD4, 0xFFEB3B, 0xFF4081, 0x00E676, 0xFF6B6B, 0x9C27B0];

        letters.forEach((letter, index) => {
            // Random position around edges
            const x = index < 4
                ? this.r.getX(10 + (index * 20))
                : this.r.getX(10 + ((index - 4) * 20));
            const y = index < 4
                ? this.r.getY(35 + (index * 5))
                : this.r.getY(85 + ((index - 4) * 5));

            const letterText = this.add.text(x, y, letter, {
                fontSize: this.r.getFontSize(48) + 'px',
                fontFamily: 'Fredoka One, Arial',
                color: '#ffffff',
                stroke: '#' + colors[index % colors.length].toString(16).padStart(6, '0'),
                strokeThickness: this.r.scaleX(4),
                fontStyle: 'bold'
            }).setOrigin(0.5);

            letterText.setAlpha(0.7);

            // Floating animation
            this.tweens.add({
                targets: letterText,
                y: y + this.r.scaleY(30),
                duration: 2000 + (index * 300),
                ease: 'Sine.easeInOut',
                yoyo: true,
                repeat: -1
            });

            // Rotation animation
            this.tweens.add({
                targets: letterText,
                angle: index % 2 === 0 ? 15 : -15,
                duration: 1500 + (index * 200),
                ease: 'Sine.easeInOut',
                yoyo: true,
                repeat: -1
            });

            // Scale pulse
            this.tweens.add({
                targets: letterText,
                scaleX: 1.2,
                scaleY: 1.2,
                duration: 1800 + (index * 250),
                ease: 'Sine.easeInOut',
                yoyo: true,
                repeat: -1
            });
        });
    }
}
