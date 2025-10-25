// ES6 Module
export default class SettingsScene extends Phaser.Scene {
    constructor() {
        super({ key: 'Settings' });
    }

    create() {
        console.log('SettingsScene started');

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
        BackgroundComponent.createGradient(this, 'settingsBg');
    }

    createTitle() {
        TitleComponent.create(this, {
            y: this.r.getY(15),
            text: 'SETTINGS'
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
        SliderComponent.create(this, {
            y: y,
            label: label,
            initialValue: parseInt(initialValue),
            suffix: '%',
            onValueChange: (value) => {
                localStorage.setItem(settingKey, value.toString());
                this.applyVolumeSettings();
            }
        });
    }

    applyVolumeSettings() {
        // Get volume settings
        const masterVolume = parseInt(localStorage.getItem('masterVolume') || '100') / 100;
        const musicVolume = parseInt(localStorage.getItem('musicVolume') || '100') / 100;
        const sfxVolume = parseInt(localStorage.getItem('sfxVolume') || '100') / 100;

        // Apply master volume to all sounds
        this.sound.volume = masterVolume;

        // Store individual volumes for later use by game scenes
        this.game.registry.set('musicVolume', musicVolume);
        this.game.registry.set('sfxVolume', sfxVolume);
    }

    createBackButton() {
        ButtonComponent.createBackButton(this, {
            y: this.r.getY(85),
            onClick: () => {
                this.scene.start('MainMenu');
            }
        });
    }

    createFloatingStars() {
        DecorationsComponent.createFloatingStars(this);
    }
}
