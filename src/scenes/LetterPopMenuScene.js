class LetterPopMenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'LetterPopMenu' });
    }

    create() {
        console.log('LetterPopMenuScene started');

        // Initialize responsive utilities
        this.r = new ResponsiveUtils(this);

        // Create gradient background
        this.createBackground();

        // Create title
        this.createTitle();

        // Create game settings
        this.createGameSettings();

        // Create start and back buttons
        this.createButtons();

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
        const titleY = this.r.getY(12);

        // Icon
        const iconText = this.add.text(this.r.centerX, titleY, '🎈', {
            fontSize: this.r.getFontSize(64) + 'px'
        }).setOrigin(0.5);

        // Title
        const titleText = this.add.text(this.r.centerX, titleY + this.r.scaleY(60), 'LETTER POP', {
            fontSize: this.r.getFontSize(56) + 'px',
            fontFamily: 'Fredoka One, Arial',
            color: '#FFEB3B',
            fontStyle: 'bold',
            stroke: '#9C27B0',
            strokeThickness: this.r.scaleX(8)
        }).setOrigin(0.5);

        // Bounce-in animation
        [iconText, titleText].forEach((text, index) => {
            text.setScale(0);
            this.tweens.add({
                targets: text,
                scaleX: 1,
                scaleY: 1,
                duration: 600,
                delay: index * 100,
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
    }

    createGameSettings() {
        const startY = this.r.getY(32);
        const spacing = this.r.scaleY(85);

        // Load saved settings or use defaults
        const timePerLetter = localStorage.getItem('letterPop_timePerLetter') || '10';
        const enableChances = localStorage.getItem('letterPop_enableChances') || 'false';
        const letterCase = localStorage.getItem('letterPop_letterCase') || 'uppercase';

        // Time Per Letter Slider
        this.createTimeSlider(timePerLetter, startY);

        // Enable 3 Chances Toggle
        this.createChancesToggle(enableChances, startY + spacing);

        // Letter Case Mode Selector
        this.createCaseSelector(letterCase, startY + (spacing * 2));
    }

    createTimeSlider(initialValue, y) {
        // Label
        this.add.text(this.r.getX(20), y, 'Time Per Letter:', {
            fontSize: this.r.getFontSize(28) + 'px',
            fontFamily: 'Fredoka One, Arial',
            color: '#ffffff',
            fontStyle: 'bold',
            stroke: '#9C27B0',
            strokeThickness: this.r.scaleX(4)
        });

        // Value text
        const valueText = this.add.text(this.r.getX(80), y, initialValue + 's', {
            fontSize: this.r.getFontSize(28) + 'px',
            fontFamily: 'Fredoka One, Arial',
            color: '#FFEB3B',
            fontStyle: 'bold',
            stroke: '#9C27B0',
            strokeThickness: this.r.scaleX(4)
        }).setOrigin(1, 0);

        // Slider bar background
        const barY = y + this.r.scaleY(40);
        const barWidth = this.r.scaleX(700);
        const barHeight = this.r.scaleY(15);
        const barX = this.r.getX(20);

        const sliderBg = this.add.graphics();
        sliderBg.fillStyle(0x5A2E5A, 1);
        sliderBg.fillRoundedRect(barX, barY, barWidth, barHeight, 8);

        // Calculate position for value 5-15 seconds
        const minTime = 5;
        const maxTime = 15;
        const percentage = ((parseInt(initialValue) - minTime) / (maxTime - minTime)) * 100;

        // Slider bar foreground
        const sliderFg = this.add.graphics();
        const currentWidth = (barWidth * percentage) / 100;
        sliderFg.fillGradientStyle(0xFFEB3B, 0xFFEB3B, 0xFF9800, 0xFF9800, 1);
        sliderFg.fillRoundedRect(barX, barY, currentWidth, barHeight, 8);

        // Slider handle
        const handleX = barX + currentWidth;
        const handleY = barY + (barHeight / 2);
        const handle = this.add.circle(handleX, handleY, this.r.scaleX(15), 0xFFFFFF);
        handle.setStrokeStyle(this.r.scaleX(3), 0x9C27B0);
        handle.setInteractive({ draggable: true, useHandCursor: true });

        // Store references
        handle.sliderFg = sliderFg;
        handle.valueText = valueText;
        handle.barX = barX;
        handle.barY = barY;
        handle.barWidth = barWidth;
        handle.barHeight = barHeight;
        handle.minTime = minTime;
        handle.maxTime = maxTime;

        // Drag handling
        handle.on('drag', (pointer, dragX) => {
            const newX = Phaser.Math.Clamp(dragX, barX, barX + barWidth);
            handle.x = newX;

            const percentage = ((newX - barX) / barWidth) * 100;
            const timeValue = Math.round(minTime + ((maxTime - minTime) * percentage / 100));

            // Update foreground
            const width = (barWidth * percentage) / 100;
            sliderFg.clear();
            sliderFg.fillGradientStyle(0xFFEB3B, 0xFFEB3B, 0xFF9800, 0xFF9800, 1);
            sliderFg.fillRoundedRect(barX, barY, width, barHeight, 8);

            // Update value text
            valueText.setText(timeValue + 's');

            // Save to localStorage
            localStorage.setItem('letterPop_timePerLetter', timeValue.toString());
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

    createChancesToggle(initialValue, y) {
        const isEnabled = initialValue === 'true';

        // Label
        this.add.text(this.r.getX(20), y, 'Enable 3 Chances:', {
            fontSize: this.r.getFontSize(28) + 'px',
            fontFamily: 'Fredoka One, Arial',
            color: '#ffffff',
            fontStyle: 'bold',
            stroke: '#9C27B0',
            strokeThickness: this.r.scaleX(4)
        });

        // Toggle button background
        const btnX = this.r.getX(70);
        const btnY = y + this.r.scaleY(5);
        const toggleWidth = this.r.scaleX(100);
        const toggleHeight = this.r.scaleY(50);

        // Background
        const toggleBg = this.add.graphics();
        const bgColor = isEnabled ? 0x4CAF50 : 0x5A2E5A;
        toggleBg.fillStyle(bgColor, 1);
        toggleBg.fillRoundedRect(btnX, btnY, toggleWidth, toggleHeight, 25);
        toggleBg.setInteractive(new Phaser.Geom.Rectangle(btnX, btnY, toggleWidth, toggleHeight), Phaser.Geom.Rectangle.Contains);
        toggleBg.setData('useHandCursor', true);

        // Toggle circle
        const circleX = isEnabled ? btnX + toggleWidth - 30 : btnX + 30;
        const circleY = btnY + toggleHeight / 2;
        const toggleCircle = this.add.circle(circleX, circleY, this.r.scaleX(20), 0xFFFFFF);

        // Status text
        const statusText = this.add.text(this.r.getX(77), y, isEnabled ? 'ON' : 'OFF', {
            fontSize: this.r.getFontSize(24) + 'px',
            fontFamily: 'Fredoka One, Arial',
            color: '#FFEB3B',
            fontStyle: 'bold'
        });

        // Click handler
        toggleBg.on('pointerdown', () => {
            const newState = !isEnabled;

            // Update color
            toggleBg.clear();
            const newBgColor = newState ? 0x4CAF50 : 0x5A2E5A;
            toggleBg.fillStyle(newBgColor, 1);
            toggleBg.fillRoundedRect(btnX, btnY, toggleWidth, toggleHeight, 25);

            // Move circle
            const newCircleX = newState ? btnX + toggleWidth - 30 : btnX + 30;
            this.tweens.add({
                targets: toggleCircle,
                x: newCircleX,
                duration: 200,
                ease: 'Back.easeOut'
            });

            // Update text
            statusText.setText(newState ? 'ON' : 'OFF');

            // Save to localStorage
            localStorage.setItem('letterPop_enableChances', newState.toString());

            // Update local state
            isEnabled = newState;
        });
    }

    createCaseSelector(initialValue, y) {
        // Label
        this.add.text(this.r.getX(20), y, 'Letter Case:', {
            fontSize: this.r.getFontSize(28) + 'px',
            fontFamily: 'Fredoka One, Arial',
            color: '#ffffff',
            fontStyle: 'bold',
            stroke: '#9C27B0',
            strokeThickness: this.r.scaleX(4)
        });

        // Options
        const options = [
            { value: 'uppercase', label: 'ABC', description: 'Uppercase' },
            { value: 'lowercase', label: 'abc', description: 'Lowercase' },
            { value: 'mixed', label: 'Abc', description: 'Mixed' }
        ];

        const startX = this.r.getX(20);
        const btnY = y + this.r.scaleY(45);
        const btnWidth = this.r.scaleX(200);
        const btnSpacing = this.r.scaleX(20);

        options.forEach((option, index) => {
            const btnX = startX + (index * (btnWidth + btnSpacing));
            const isSelected = initialValue === option.value;

            // Button background
            const button = this.add.graphics();
            const btnColor = isSelected ? 0x4CAF50 : 0x5A2E5A;
            button.fillStyle(btnColor, 1);
            button.fillRoundedRect(btnX, btnY, btnWidth, this.r.scaleY(70), 10);
            button.setInteractive(new Phaser.Geom.Rectangle(btnX, btnY, btnWidth, this.r.scaleY(70)), Phaser.Geom.Rectangle.Contains);

            // Label
            const labelText = this.add.text(btnX + btnWidth/2, btnY + this.r.scaleY(25), option.label, {
                fontSize: this.r.getFontSize(32) + 'px',
                fontFamily: 'Fredoka One, Arial',
                color: '#FFEB3B',
                fontStyle: 'bold'
            }).setOrigin(0.5);

            // Description
            const descText = this.add.text(btnX + btnWidth/2, btnY + this.r.scaleY(50), option.description, {
                fontSize: this.r.getFontSize(18) + 'px',
                fontFamily: 'Fredoka One, Arial',
                color: '#ffffff'
            }).setOrigin(0.5);

            // Click handler
            button.on('pointerdown', () => {
                // Deselect all
                options.forEach((opt, idx) => {
                    const otherBtnX = startX + (idx * (btnWidth + btnSpacing));
                    button.clear();
                    button.fillStyle(0x5A2E5A, 1);
                    button.fillRoundedRect(otherBtnX, btnY, btnWidth, this.r.scaleY(70), 10);
                });

                // Select this one
                button.clear();
                button.fillStyle(0x4CAF50, 1);
                button.fillRoundedRect(btnX, btnY, btnWidth, this.r.scaleY(70), 10);

                // Save to localStorage
                localStorage.setItem('letterPop_letterCase', option.value);
            });

            // Hover effect
            button.on('pointerover', () => {
                this.tweens.add({
                    targets: [labelText, descText],
                    scale: 1.1,
                    duration: 150,
                    ease: 'Back.easeOut'
                });
            });

            button.on('pointerout', () => {
                this.tweens.add({
                    targets: [labelText, descText],
                    scale: 1,
                    duration: 150,
                    ease: 'Back.easeIn'
                });
            });
        });
    }

    createButtons() {
        // Start button
        const startBtnX = this.r.getX(30);
        const btnY = this.r.getY(88);

        const startButton = this.add.image(startBtnX, btnY, 'btnGreen').setInteractive({ useHandCursor: true });
        const startScale = this.r.scaleX(300) / startButton.width;
        startButton.setScale(startScale);

        const startText = this.add.text(startBtnX, btnY, 'START', {
            fontSize: this.r.getFontSize(38) + 'px',
            fontFamily: 'Fredoka One, Arial',
            color: '#ffffff',
            stroke: '#2C5F2D',
            strokeThickness: this.r.scaleX(6),
            fontStyle: 'bold'
        }).setOrigin(0.5);

        startButton.on('pointerover', () => {
            this.tweens.add({
                targets: [startButton],
                scaleX: startScale * 1.1,
                scaleY: startScale * 1.1,
                duration: 200,
                ease: 'Back.easeOut'
            });
            this.tweens.add({
                targets: [startText],
                scale: 1.1,
                duration: 200,
                ease: 'Back.easeOut'
            });
        });

        startButton.on('pointerout', () => {
            this.tweens.add({
                targets: [startButton],
                scaleX: startScale,
                scaleY: startScale,
                duration: 200,
                ease: 'Back.easeIn'
            });
            this.tweens.add({
                targets: [startText],
                scale: 1,
                duration: 200,
                ease: 'Back.easeIn'
            });
        });

        startButton.on('pointerdown', () => {
            startButton.setTexture('btnGreenPressed');
            this.tweens.add({
                targets: [startButton, startText],
                scale: startScale * 0.95,
                duration: 100,
                yoyo: true,
                onComplete: () => {
                    startButton.setTexture('btnGreen');
                    this.scene.start('LetterPop');
                }
            });
        });

        // Back button
        const backBtnX = this.r.getX(70);

        const backButton = this.add.image(backBtnX, btnY, 'btnBlue').setInteractive({ useHandCursor: true });
        const backScale = this.r.scaleX(300) / backButton.width;
        backButton.setScale(backScale);

        const backText = this.add.text(backBtnX, btnY, 'BACK', {
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
