class PreloadScene extends Phaser.Scene {
    constructor() {
        super({ key: 'Preload' });
    }

    preload() {
        console.log('PreloadScene started');

        // Create progress bar graphics
        this.createProgressBar();

        // Load test assets
        this.load.image('testImage', 'assets/images/test-image.png');
        this.load.audio('testSound', 'assets/audio/test-sound.wav');

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

    createProgressBar() {
        // Progress bar dimensions and position
        const width = 400;
        const height = 30;
        const x = (this.cameras.main.width - width) / 2;
        const y = this.cameras.main.height / 2;

        // Graphics for progress bar
        this.progressBar = this.add.graphics();
        this.progressBox = this.add.graphics();

        // Draw progress box (border)
        this.progressBox.fillStyle(0x222222, 0.8);
        this.progressBox.fillRect(x, y, width, height);

        // Loading text
        this.loadingText = this.add.text(
            this.cameras.main.width / 2,
            y - 50,
            'Loading...',
            { fontSize: '24px', color: '#ffffff' }
        ).setOrigin(0.5);

        // Percentage text
        this.percentText = this.add.text(
            this.cameras.main.width / 2,
            y + 50,
            '0%',
            { fontSize: '18px', color: '#ffffff' }
        ).setOrigin(0.5);
    }

    updateProgressBar(value) {
        // Update progress bar fill
        const width = 400;
        const height = 30;
        const x = (this.cameras.main.width - width) / 2;
        const y = this.cameras.main.height / 2;

        this.progressBar.clear();
        this.progressBar.fillStyle(0x00ff00, 1);
        this.progressBar.fillRect(x, y, width * value, height);

        // Update percentage text
        this.percentText.setText(Math.floor(value * 100) + '%');
    }

    loadComplete() {
        this.loadingText.setText('Complete!');
        console.log('Assets loaded successfully');
    }
}
