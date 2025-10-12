class MainMenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainMenu' });
    }

    create() {
        console.log('MainMenuScene started');

        // Title
        this.add.text(400, 200, "Aurora's Letter Adventure", {
            fontSize: '40px',
            color: '#ffff00',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Instruction text
        this.add.text(400, 400, 'Press to Start', {
            fontSize: '24px',
            color: '#ffffff'
        }).setOrigin(0.5);

        // Note: Click handling will be added in Phase 3
    }
}
