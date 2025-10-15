class LetterPopMenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'LetterPopMenu' });
    }

    create() {
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
        BackgroundComponent.createGradient(this, 'letterPopMenuBg');
    }

    createTitle() {
        const titleY = this.r.getY(10);

        // Icon - with padding to prevent emoji clipping
        const iconText = this.add.text(this.r.centerX, titleY, '🎈', {
            fontSize: this.r.getFontSize(64) + 'px',
            padding: { top: 20, bottom: 20, left: 10, right: 10 }
        }).setOrigin(0.5);

        // Animate icon
        iconText.setScale(0);
        this.tweens.add({
            targets: iconText,
            scaleX: 1,
            scaleY: 1,
            duration: 600,
            ease: 'Back.easeOut',
            onComplete: () => {
                this.tweens.add({
                    targets: iconText,
                    scaleX: 1.05,
                    scaleY: 1.05,
                    duration: 1000,
                    ease: 'Sine.easeInOut',
                    yoyo: true,
                    repeat: -1
                });
            }
        });

        // Title using TitleComponent
        TitleComponent.create(this, {
            y: titleY + this.r.scaleY(60),
            text: 'LETTER POP',
            fontSize: 56
        });
    }

    createGameSettings() {
        const startY = this.r.getY(32);
        const spacing = this.r.scaleY(85);

        // Load saved settings or use defaults
        const timePerRound = localStorage.getItem('letterPop_timePerRound') || '10';
        const letterCase = localStorage.getItem('letterPop_letterCase') || 'uppercase';

        // Time Per Round Slider
        this.createTimeSlider(timePerRound, startY);

        // Letter Case Mode Selector
        this.createCaseSelector(letterCase, startY + spacing);
    }

    createTimeSlider(initialValue, y) {
        // Label
        this.add.text(this.r.getX(20), y, 'Time Per Round:', {
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
            localStorage.setItem('letterPop_timePerRound', timeValue.toString());
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

    // REMOVED: 3 Chances mode toggle
    // This feature has been disabled for now
    /*
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
    */

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
        const btnHeight = this.r.scaleY(70);
        const btnSpacing = this.r.scaleX(20);

        // Store button references for radio button behavior
        const buttons = [];

        options.forEach((option, index) => {
            const btnX = startX + (index * (btnWidth + btnSpacing));
            const isSelected = initialValue === option.value;

            // Button background
            const button = this.add.graphics();
            const btnColor = isSelected ? 0x4CAF50 : 0x5A2E5A;
            button.fillStyle(btnColor, 1);
            button.fillRoundedRect(btnX, btnY, btnWidth, btnHeight, 10);
            button.setInteractive(new Phaser.Geom.Rectangle(btnX, btnY, btnWidth, btnHeight), Phaser.Geom.Rectangle.Contains);

            // Store button data for later access
            button.setData('btnX', btnX);
            button.setData('btnY', btnY);
            button.setData('btnWidth', btnWidth);
            button.setData('btnHeight', btnHeight);
            button.setData('value', option.value);
            buttons.push(button);

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
                // Deselect all buttons
                buttons.forEach((btn) => {
                    btn.clear();
                    btn.fillStyle(0x5A2E5A, 1);
                    btn.fillRoundedRect(
                        btn.getData('btnX'),
                        btn.getData('btnY'),
                        btn.getData('btnWidth'),
                        btn.getData('btnHeight'),
                        10
                    );
                });

                // Select this button
                button.clear();
                button.fillStyle(0x4CAF50, 1);
                button.fillRoundedRect(btnX, btnY, btnWidth, btnHeight, 10);

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
        DecorationsComponent.createFloatingStars(this);
    }
}
