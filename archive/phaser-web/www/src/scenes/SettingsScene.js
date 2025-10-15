class SettingsScene extends Phaser.Scene {
    constructor() {
        super({ key: 'Settings' });
    }

    create() {
        // Initialize responsive utilities
        this.r = new ResponsiveUtils(this);

        // Create gradient background
        this.createBackground();

        // Create title
        this.createTitle();

        // Create audio settings
        this.createAudioSettings();

        // Create back button
        this.createBackButton();

        // Add floating stars decoration
        this.createFloatingStars();
    }

    createBackground() {
        // Match Results screen gradient: Orange Pop → Bubble Pink → Purple Magic
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
        const titleY = this.r.getY(15);
        const titleText = this.add.text(this.r.centerX, titleY, 'SETTINGS', {
            fontSize: this.r.getFontSize(64) + 'px',
            fontFamily: 'Fredoka One, Arial',
            color: '#FFEB3B',
            fontStyle: 'bold',
            stroke: '#9C27B0',
            strokeThickness: this.r.scaleX(8)
        }).setOrigin(0.5);

        // Bounce-in animation
        titleText.setScale(0);
        this.tweens.add({
            targets: titleText,
            scaleX: 1,
            scaleY: 1,
            duration: 600,
            ease: 'Back.easeOut',
            onComplete: () => {
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
    }

    createAudioSettings() {
        const startY = this.r.getY(35);
        const spacing = this.r.scaleY(80);

        // Load saved settings or use defaults
        const masterVolume = localStorage.getItem('masterVolume') || '100';
        const musicVolume = localStorage.getItem('musicVolume') || '100';
        const sfxVolume = localStorage.getItem('sfxVolume') || '100';

        // Master Volume
        this.createVolumeSetting('Master Volume', masterVolume, startY, 'masterVolume');

        // Music Volume
        this.createVolumeSetting('Music Volume', musicVolume, startY + spacing, 'musicVolume');

        // Sound Effects Volume
        this.createVolumeSetting('Sound Effects', sfxVolume, startY + (spacing * 2), 'sfxVolume');
    }

    createVolumeSetting(label, initialValue, y, settingKey) {
        // Label
        const labelText = this.add.text(this.r.getX(20), y, label + ':', {
            fontSize: this.r.getFontSize(32) + 'px',
            fontFamily: 'Fredoka One, Arial',
            color: '#ffffff',
            fontStyle: 'bold',
            stroke: '#9C27B0',
            strokeThickness: this.r.scaleX(4)
        });

        // Value text
        const valueText = this.add.text(this.r.getX(80), y, initialValue + '%', {
            fontSize: this.r.getFontSize(32) + 'px',
            fontFamily: 'Fredoka One, Arial',
            color: '#FFEB3B',
            fontStyle: 'bold',
            stroke: '#9C27B0',
            strokeThickness: this.r.scaleX(4)
        }).setOrigin(1, 0);

        // Slider bar background
        const barY = y + this.r.scaleY(45);
        const barWidth = this.r.scaleX(700);
        const barHeight = this.r.scaleY(15);
        const barX = this.r.getX(20);

        const sliderBg = this.add.graphics();
        sliderBg.fillStyle(0x5A2E5A, 1);
        sliderBg.fillRoundedRect(barX, barY, barWidth, barHeight, 8);

        // Slider bar foreground
        const sliderFg = this.add.graphics();
        const currentWidth = (barWidth * parseInt(initialValue)) / 100;
        sliderFg.fillGradientStyle(0xFFEB3B, 0xFFEB3B, 0xFF9800, 0xFF9800, 1);
        sliderFg.fillRoundedRect(barX, barY, currentWidth, barHeight, 8);

        // Slider handle
        const handleX = barX + currentWidth;
        const handleY = barY + (barHeight / 2);
        const handle = this.add.circle(handleX, handleY, this.r.scaleX(15), 0xFFFFFF);
        handle.setStrokeStyle(this.r.scaleX(3), 0x9C27B0);
        handle.setInteractive({ draggable: true, useHandCursor: true });

        // Store references
        handle.settingKey = settingKey;
        handle.sliderFg = sliderFg;
        handle.valueText = valueText;
        handle.barX = barX;
        handle.barY = barY;
        handle.barWidth = barWidth;
        handle.barHeight = barHeight;

        // Drag handling
        handle.on('drag', (pointer, dragX) => {
            // Constrain to slider bounds
            const newX = Phaser.Math.Clamp(dragX, barX, barX + barWidth);
            handle.x = newX;

            // Calculate percentage
            const percentage = Math.round(((newX - barX) / barWidth) * 100);

            // Update foreground
            const width = (barWidth * percentage) / 100;
            sliderFg.clear();
            sliderFg.fillGradientStyle(0xFFEB3B, 0xFFEB3B, 0xFF9800, 0xFF9800, 1);
            sliderFg.fillRoundedRect(barX, barY, width, barHeight, 8);

            // Update value text
            valueText.setText(percentage + '%');

            // Save to localStorage
            localStorage.setItem(settingKey, percentage.toString());

            // Apply volume change immediately
            this.applyVolumeSettings();
        });

        // Hover effect
        handle.on('pointerover', () => {
            this.tweens.add({
                targets: handle,
                scale: 1.2,
                duration: 150,
                ease: 'Back.easeOut'
            });
        });

        handle.on('pointerout', () => {
            this.tweens.add({
                targets: handle,
                scale: 1,
                duration: 150,
                ease: 'Back.easeIn'
            });
        });
    }

    applyVolumeSettings() {
        // Update AudioManager with new volume settings
        const audioManager = AudioManager.getInstance();
        audioManager.updateVolumes();
    }

    createBackButton() {
        const btnX = this.r.centerX;
        const btnY = this.r.getY(85);

        // Create button sprite
        const button = this.add.image(btnX, btnY, 'btnBlue').setInteractive({ useHandCursor: true });

        // Scale button to appropriate size
        const targetWidth = this.r.scaleX(350);
        const scale = targetWidth / button.width;
        button.setScale(scale);

        // Create button text
        const buttonText = this.add.text(btnX, btnY, 'BACK', {
            fontSize: this.r.getFontSize(42) + 'px',
            fontFamily: 'Fredoka One, Arial',
            color: '#ffffff',
            stroke: '#1976D2',
            strokeThickness: this.r.scaleX(6),
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Idle bounce animation
        this.tweens.add({
            targets: [button, buttonText],
            y: btnY - this.r.scaleY(12),
            duration: 1000,
            ease: 'Sine.easeInOut',
            yoyo: true,
            repeat: -1
        });

        // Hover effect
        button.on('pointerover', () => {
            this.tweens.add({
                targets: button,
                scaleX: scale * 1.1,
                scaleY: scale * 1.1,
                duration: 200,
                ease: 'Back.easeOut'
            });
            this.tweens.add({
                targets: buttonText,
                scaleX: 1.1,
                scaleY: 1.1,
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
            this.tweens.add({
                targets: buttonText,
                scaleX: 1,
                scaleY: 1,
                duration: 200,
                ease: 'Back.easeIn'
            });
        });

        // Click handler
        button.on('pointerdown', () => {
            button.setTexture('btnBluePressed');

            this.tweens.add({
                targets: button,
                scaleX: scale * 0.95,
                scaleY: scale * 0.95,
                duration: 100,
                yoyo: true,
                onComplete: () => {
                    button.setTexture('btnBlue');
                    this.scene.start('MainMenu');
                }
            });
            this.tweens.add({
                targets: buttonText,
                scaleX: 0.95,
                scaleY: 0.95,
                duration: 100,
                yoyo: true
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
                ease: 'Linear',
                repeat: -1
            });
        }
    }
}
