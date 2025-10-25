// ES6 Module
export default class PreloadScene extends Phaser.Scene {
    constructor() {
        super({ key: 'Preload' });
    }

    preload() {
        // Initialize responsive utilities
        this.r = new ResponsiveUtils(this);

        // Create gradient background
        this.createBackground();

        // Create progress bar graphics
        this.createProgressBar();

        // Load welcome audio
        this.load.audio('welcome', '/assets/audio/welcome.mp3');

        // Load game sound effects
        this.load.audio('bubblePop', '/assets/audio/bubble-pop.mp3');
        this.load.audio('wrongAnswer', '/assets/audio/wrong-answer.mp3');
        this.load.audio('correctAnswer', '/assets/audio/correct-answer.mp3');
        this.load.audio('gameComplete', '/assets/audio/game-complete.mp3');

        // Load all letter audio (A-Z)
        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
        letters.forEach(letter => {
            // Load individual letter sounds
            this.load.audio(`letter_${letter}`, `/assets/audio/letters/${letter}.mp3`);

            // Load "Find the letter X!" instructions
            this.load.audio(`find_letter_${letter}`, `/assets/audio/find_letter_${letter}.mp3`);
        });

        // Load ONET UI assets
        this.load.image('mainMenuBg', '/assets/ui/MainMenu_Bg.png');
        this.load.image('btnGreen', '/assets/ui/Btn_Green.png');
        this.load.image('btnGreenPressed', '/assets/ui/Btn_Geen_Pressed.png');
        this.load.image('btnBlue', '/assets/ui/Btn_Blue.png');
        this.load.image('btnBluePressed', '/assets/ui/Btn_Blue_Pressed.png');
        this.load.image('popupResult', '/assets/ui/PopUp_Result.png');
        this.load.image('topBar', '/assets/ui/Top_Bar.png');
        this.load.image('headerBar', '/assets/ui/header-bar.png');  // New peach/purple header
        this.load.image('bookmarkContainer', '/assets/ui/bookmark-container.png');  // Orange bookmark for round indicator
        this.load.image('bottomBar', '/assets/ui/Bottom_Bar.png');
        this.load.image('iconCrown', '/assets/ui/Icon_Crown.png');
        this.load.image('iconTime', '/assets/ui/Icon_Time.png');
        this.load.image('clockIcon', '/assets/ui/Clock_Icon.png');
        this.load.image('btnHome', '/assets/ui/Btn_Home.png');
        this.load.image('btnPause', '/assets/ui/Btn_Pause.png');
        this.load.image('scoreBox', '/assets/ui/Score_Box.png');
        this.load.image('boxBg', '/assets/ui/Box_Bg.png');
        this.load.image('highScoreBox', '/assets/ui/HighScore_Box.png');
        this.load.image('btnBrown', '/assets/ui/Btn_Brown.png');
        this.load.image('btnSetting', '/assets/ui/Btn_Setting.png');
        this.load.image('btnSettingPressed', '/assets/ui/Btn_Setting_Pressed.png');
        this.load.image('btnMusic', '/assets/ui/Btn_Music.png');
        this.load.image('btnMusicDisable', '/assets/ui/Btn_Music_Disable.png');
        this.load.image('btnSound', '/assets/ui/Btn_Sound.png');
        this.load.image('btnSoundDisable', '/assets/ui/Btn_Sound_Disable.png');
        this.load.image('timerBarBg', '/assets/ui/Load_Bar_Bg.png');  // Timer bar background
        this.load.image('timerBarFg', '/assets/ui/Load_Bar_Fg.png');  // Timer bar foreground

        // Progress event listeners
        this.load.on('progress', this.updateProgressBar, this);
        this.load.on('complete', this.loadComplete, this);
    }

    create() {
        // Transition to MainMenu after brief delay
        this.time.delayedCall(500, () => {
            this.scene.start('MainMenu');
        });
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

    createProgressBar() {
        // Title text
        const titleY = this.r.getY(35);
        this.loadingTitle = this.add.text(this.r.centerX, titleY, "AURORA'S READING ADVENTURE", {
            fontSize: this.r.getFontSize(48) + 'px',
            fontFamily: 'Fredoka One, Arial',
            color: '#FFEB3B',
            fontStyle: 'bold',
            stroke: '#9C27B0',
            strokeThickness: this.r.scaleX(6)
        }).setOrigin(0.5);

        // Loading text
        const loadingY = this.r.getY(55);
        this.loadingText = this.add.text(this.r.centerX, loadingY, 'Loading...', {
            fontSize: this.r.getFontSize(32) + 'px',
            fontFamily: 'Fredoka One, Arial',
            color: '#ffffff',
            stroke: '#FF6B6B',
            strokeThickness: this.r.scaleX(4)
        }).setOrigin(0.5);

        // Progress bar background (dark purple)
        const barY = this.r.getY(65);
        const barWidth = this.r.scaleX(600);
        const barHeight = this.r.scaleY(20);
        const barX = this.r.centerX - (barWidth / 2);

        this.progressBarBg = this.add.graphics();
        this.progressBarBg.fillStyle(0x5A2E5A, 1);
        this.progressBarBg.fillRoundedRect(barX, barY, barWidth, barHeight, 10);

        // Progress bar foreground (yellow/orange gradient)
        this.progressBarFg = this.add.graphics();
        this.progressBarX = barX;
        this.progressBarY = barY;
        this.progressBarWidth = barWidth;
        this.progressBarHeight = barHeight;

        // Percentage text
        const percentY = this.r.getY(72);
        this.percentText = this.add.text(this.r.centerX, percentY, '0%', {
            fontSize: this.r.getFontSize(24) + 'px',
            fontFamily: 'Fredoka One, Arial',
            color: '#ffffff',
            stroke: '#9C27B0',
            strokeThickness: this.r.scaleX(3)
        }).setOrigin(0.5);

        // Add floating stars
        this.createLoadingStars();
    }

    updateProgressBar(value) {
        // Redraw the yellow/orange gradient bar
        this.progressBarFg.clear();

        const currentWidth = this.progressBarWidth * value;

        if (currentWidth > 0) {
            // Draw gradient from yellow to orange
            this.progressBarFg.fillGradientStyle(0xFFEB3B, 0xFFEB3B, 0xFF9800, 0xFF9800, 1);
            this.progressBarFg.fillRoundedRect(
                this.progressBarX,
                this.progressBarY,
                currentWidth,
                this.progressBarHeight,
                10
            );
        }

        // Update percentage text
        this.percentText.setText(Math.floor(value * 100) + '%');
    }

    loadComplete() {
        this.loadingText.setText('Ready!');
    }

    createLoadingStars() {
        // Create floating stars decoration (matches other screens)
        const starChars = ['⭐', '✨', '💫'];

        for (let i = 0; i < 8; i++) {
            const x = this.r.getX(15 + (i * 10));
            const y = this.r.getY(15 + ((i % 3) * 15));
            const starChar = Phaser.Utils.Array.GetRandom(starChars);

            const star = this.add.text(x, y, starChar, {
                fontSize: this.r.getFontSize(28 + (i % 3) * 6) + 'px'
            }).setOrigin(0.5);

            star.setAlpha(0.7);

            // Floating animation
            this.tweens.add({
                targets: star,
                y: y + this.r.scaleY(20),
                duration: 2000 + (i * 200),
                ease: 'Sine.easeInOut',
                yoyo: true,
                repeat: -1,
                delay: i * 100
            });

            // Rotation
            this.tweens.add({
                targets: star,
                angle: i % 2 === 0 ? 360 : -360,
                duration: 3000 + (i * 250),
                ease: 'Linear',
                repeat: -1
            });
        }
    }
}
