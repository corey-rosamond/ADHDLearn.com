const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game-container',
    backgroundColor: '#4488ff',
    scene: {
        create: function() {
            this.add.text(400, 300, "Aurora's Letter Adventure", {
                fontSize: '32px',
                color: '#ffffff'
            }).setOrigin(0.5);
        }
    }
};

const game = new Phaser.Game(config);
