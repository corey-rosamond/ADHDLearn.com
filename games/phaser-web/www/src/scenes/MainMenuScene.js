class MainMenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainMenu' });
    }

    create() {
        // Initialize responsive utilities
        this.r = new ResponsiveUtils(this);

        // Initialize AudioManager
        this.audioManager = AudioManager.getInstance();
        this.audioManager.init(this);

        // Handle page visibility to prevent audio issues
        this.setupVisibilityHandling();

        // Create background using ONET asset
        this.createBackground();

        // Add decorative clouds (disabled for now with ONET background)
        // this.createClouds();

        // Add colorful title with 3D effect
        this.createColorfulTitle();

        // Add floating letters (disabled - using floating stars instead to match Results screen)
        // this.createFloatingLetters();

        // Create settings button (top-right corner)
        this.createSettingsButton();

        // Create debug button (top-left corner)
        this.createDebugButton();

        // Create game selection tiles
        this.createGameTiles();

        // Play welcome message when menu loads
        this.playWelcomeMessage();
    }

    setupVisibilityHandling() {
        // Handle both tab switching AND window focus loss
        this.visibilityChangeHandler = () => {
            if (document.hidden) {
                this.audioManager.pauseAll();
                // Only pause if this scene is actually running
                if (this.scene.isActive('MainMenu')) {
                    this.scene.pause('MainMenu');
                }
            } else {
                // Only resume if this scene is paused (not stopped)
                if (this.scene.isPaused('MainMenu')) {
                    this.scene.resume('MainMenu');
                    this.audioManager.resumeAll();
                }
            }
        };

        this.blurHandler = () => {
            this.audioManager.pauseAll();
            if (this.scene.isActive('MainMenu')) {
                this.scene.pause('MainMenu');
            }
        };

        this.focusHandler = () => {
            if (this.scene.isPaused('MainMenu')) {
                this.scene.resume('MainMenu');
                this.audioManager.resumeAll();
            }
        };

        document.addEventListener('visibilitychange', this.visibilityChangeHandler);
        window.addEventListener('blur', this.blurHandler);
        window.addEventListener('focus', this.focusHandler);
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
        // Play welcome message every time the menu loads using AudioManager
        // AudioManager will handle the volume settings and error checking
        this.audioManager.playVoice('welcome');
    }

    createColorfulTitle() {
        // Simple title - matches Results screen (3 text objects, NO shadows, NO layers)

        const line1Y = this.r.getY(18);
        const line2Y = this.r.getY(28);
        const line3Y = this.r.getY(38);

        // Line 1: "AURORA'S"
        const line1Text = this.add.text(this.r.centerX, line1Y, "AURORA'S", {
            fontSize: this.r.getFontSize(64) + 'px',
            fontFamily: 'Fredoka One, Arial',
            color: '#FFEB3B',
            fontStyle: 'bold',
            stroke: '#9C27B0',
            strokeThickness: this.r.scaleX(8)
        }).setOrigin(0.5);

        // Line 2: "READING"
        const line2Text = this.add.text(this.r.centerX, line2Y, 'READING', {
            fontSize: this.r.getFontSize(64) + 'px',
            fontFamily: 'Fredoka One, Arial',
            color: '#FFEB3B',
            fontStyle: 'bold',
            stroke: '#9C27B0',
            strokeThickness: this.r.scaleX(8)
        }).setOrigin(0.5);

        // Line 3: "ADVENTURE"
        const line3Text = this.add.text(this.r.centerX, line3Y, 'ADVENTURE', {
            fontSize: this.r.getFontSize(64) + 'px',
            fontFamily: 'Fredoka One, Arial',
            color: '#FFEB3B',
            fontStyle: 'bold',
            stroke: '#9C27B0',
            strokeThickness: this.r.scaleX(8)
        }).setOrigin(0.5);

        // Bounce-in animation
        [line1Text, line2Text, line3Text].forEach((text, index) => {
            text.setScale(0);
            this.tweens.add({
                targets: text,
                scaleX: 1,
                scaleY: 1,
                duration: 600,
                delay: index * 200,
                ease: 'Back.easeOut',
                onComplete: () => {
                    this.tweens.add({
                        targets: text,
                        scaleX: 1.05,
                        scaleY: 1.05,
                        duration: 1000,
                        ease: 'Sine.easeInOut',
                        yoyo: true,
                        repeat: -1
                    });
                }
            });
        });

        // Add floating stars decoration
        this.createFloatingStars();
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
        // Match Results screen gradient: Orange Pop → Bubble Pink → Purple Magic
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        // Check if gradient texture already exists (cached)
        if (!this.textures.exists('menuGradient')) {
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

            graphics.generateTexture('menuGradient', width, height);
            graphics.destroy();
        }

        this.add.image(0, 0, 'menuGradient').setOrigin(0, 0);
    }

    createSettingsButton() {
        // Position in top-right corner
        const btnX = this.r.getX(92);
        const btnY = this.r.getY(8);

        // Create button using settings button asset
        const button = this.add.image(btnX, btnY, 'btnSetting').setInteractive({ useHandCursor: true });

        // Scale button to appropriate size
        const targetSize = this.r.scaleX(80);
        const scale = targetSize / button.width;
        button.setScale(scale);

        // Idle bounce animation
        this.tweens.add({
            targets: button,
            y: btnY - this.r.scaleY(8),
            duration: 1200,
            ease: 'Sine.easeInOut',
            yoyo: true,
            repeat: -1
        });

        // Hover effect
        button.on('pointerover', () => {
            this.tweens.add({
                targets: button,
                scaleX: scale * 1.15,
                scaleY: scale * 1.15,
                duration: 200,
                ease: 'Back.easeOut'
            });
        });

        // Hover out
        button.on('pointerout', () => {
            this.tweens.add({
                targets: button,
                scaleX: scale,
                scaleY: scale,
                duration: 200,
                ease: 'Back.easeIn'
            });
        });

        // Click handler
        button.on('pointerdown', () => {
            // Change to pressed texture
            button.setTexture('btnSettingPressed');

            this.tweens.add({
                targets: button,
                scaleX: scale * 0.95,
                scaleY: scale * 0.95,
                duration: 100,
                yoyo: true,
                onComplete: () => {
                    button.setTexture('btnSetting');
                    this.scene.start('Settings');
                }
            });
        });
    }

    createDebugButton() {
        // Position in top-left corner
        const btnX = this.r.getX(8);
        const btnY = this.r.getY(8);

        // Create circular background for bug emoji
        const circle = this.add.graphics();
        circle.fillStyle(0xFF6B6B, 1); // Orange Pop color
        circle.fillCircle(btnX, btnY, this.r.scaleX(40));
        circle.setInteractive(
            new Phaser.Geom.Circle(btnX, btnY, this.r.scaleX(40)),
            Phaser.Geom.Circle.Contains
        );

        // Create bug emoji text
        const bugText = this.add.text(btnX, btnY, '🐛', {
            fontSize: this.r.getFontSize(48) + 'px',
            padding: { top: 20, bottom: 20, left: 10, right: 10 }
        }).setOrigin(0.5);

        // Idle bounce animation
        this.tweens.add({
            targets: [circle, bugText],
            y: btnY - this.r.scaleY(8),
            duration: 1200,
            ease: 'Sine.easeInOut',
            yoyo: true,
            repeat: -1
        });

        // No hover effect - keep button subtle/hidden

        // Click handler
        circle.on('pointerdown', () => {
            this.tweens.add({
                targets: [circle, bugText],
                scale: 0.9,
                duration: 100,
                yoyo: true,
                onComplete: () => {
                    this.scene.start('LetterTest');
                }
            });
        });
    }

    createGameTiles() {
        // Create a tile for Letter Pop game
        const tileX = this.r.centerX;
        const tileY = this.r.getY(60);

        this.createGameTile({
            x: tileX,
            y: tileY,
            title: 'Letter Pop',
            icon: '🎈',
            description: 'Pop bubbles and learn letters!',
            sceneKey: 'LetterPopMenu'
        });
    }

    createGameTile(config) {
        const { x, y, title, icon, description, sceneKey } = config;

        // Create square tile background using Box_Bg as frame
        const tile = this.add.image(x, y, 'boxBg').setInteractive({ useHandCursor: true });

        // Make it square - use smaller dimension
        const targetSize = this.r.scaleX(300);
        const scale = targetSize / tile.width;
        tile.setScale(scale);

        // Icon emoji - positioned to be fully visible within tile
        const iconText = this.add.text(x, y - this.r.scaleY(20), icon, {
            fontSize: this.r.getFontSize(64) + 'px',
            padding: { top: 20, bottom: 20, left: 10, right: 10 }
        }).setOrigin(0.5);

        // Game title - below the icon
        const titleText = this.add.text(x, y + this.r.scaleY(45), title, {
            fontSize: this.r.getFontSize(36) + 'px',
            fontFamily: 'Fredoka One, Arial',
            color: '#FFEB3B',
            fontStyle: 'bold',
            stroke: '#9C27B0',
            strokeThickness: this.r.scaleX(6)
        }).setOrigin(0.5);

        // Idle float animation
        this.tweens.add({
            targets: [tile, iconText, titleText],
            y: y - this.r.scaleY(10),
            duration: 1500,
            ease: 'Sine.easeInOut',
            yoyo: true,
            repeat: -1
        });

        // Hover effect
        tile.on('pointerover', () => {
            this.tweens.add({
                targets: tile,
                scaleX: scale * 1.1,
                scaleY: scale * 1.1,
                duration: 200,
                ease: 'Back.easeOut'
            });
            this.tweens.add({
                targets: [iconText, titleText],
                scale: 1.1,
                duration: 200,
                ease: 'Back.easeOut'
            });
        });

        // Hover out
        tile.on('pointerout', () => {
            this.tweens.add({
                targets: tile,
                scaleX: scale,
                scaleY: scale,
                duration: 200,
                ease: 'Back.easeIn'
            });
            this.tweens.add({
                targets: [iconText, titleText],
                scale: 1,
                duration: 200,
                ease: 'Back.easeIn'
            });
        });

        // Click handler
        tile.on('pointerdown', () => {
            this.tweens.add({
                targets: tile,
                scaleX: scale * 0.95,
                scaleY: scale * 0.95,
                duration: 100,
                yoyo: true
            });
            this.tweens.add({
                targets: [iconText, titleText],
                scale: 0.95,
                duration: 100,
                yoyo: true,
                onComplete: () => {
                    this.scene.start(sceneKey);
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

    createFloatingStars() {
        // Create floating stars decoration (matches Results screen)
        const starChars = ['⭐', '✨', '💫'];

        for (let i = 0; i < 10; i++) {
            const x = this.r.getX(10 + (i * 9));
            const y = this.r.getY(20 + ((i % 3) * 20));
            const starChar = Phaser.Utils.Array.GetRandom(starChars);

            const star = this.add.text(x, y, starChar, {
                fontSize: this.r.getFontSize(32 + (i % 3) * 8) + 'px',
                padding: { top: 20, bottom: 20, left: 10, right: 10 }
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
                ease: 'Linear',
                repeat: -1
            });
        }
    }
}
