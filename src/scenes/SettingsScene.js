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
        BackgroundComponent.createGradient(this, 'settingsBg');
    }

    createTitle() {
        TitleComponent.create(this, { text: 'SETTINGS' });
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
        // Update AudioManager with new volume settings
        const audioManager = AudioManager.getInstance();
        audioManager.updateVolumes();
    }

    createBackButton() {
        ButtonComponent.createBackButton(this);
    }

    createFloatingStars() {
        DecorationsComponent.createFloatingStars(this);
    }
}
