// ES6 Module
export default class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'Boot' });
    }

    preload() {
        // Load all assets here (skip PreloadScene)

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
            this.load.audio(`letter_${letter}`, `/assets/audio/letters/${letter}.mp3`);
            this.load.audio(`find_letter_${letter}`, `/assets/audio/find_letter_${letter}.mp3`);
        });

        // Load game background
        this.load.image('gameBackground', '/assets/images/game-background.png');

        // Load ONET UI assets
        this.load.image('mainMenuBg', '/assets/ui/MainMenu_Bg.png');
        this.load.image('btnGreen', '/assets/ui/Btn_Green.png');
        this.load.image('btnGreenPressed', '/assets/ui/Btn_Geen_Pressed.png');
        this.load.image('btnBlue', '/assets/ui/Btn_Blue.png');
        this.load.image('btnBluePressed', '/assets/ui/Btn_Blue_Pressed.png');
        this.load.image('popupResult', '/assets/ui/PopUp_Result.png');
        this.load.image('topBar', '/assets/ui/Top_Bar.png');
        this.load.image('headerBar', '/assets/ui/header-bar.png');
        this.load.image('bookmarkContainer', '/assets/ui/bookmark-container.png');
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
        this.load.image('timerBarBg', '/assets/ui/Load_Bar_Bg.png');
        this.load.image('timerBarFg', '/assets/ui/Load_Bar_Fg.png');
    }

    create() {
        // Go directly to Letter Pop Menu (skip PreloadScene)
        this.scene.start('LetterPopMenu');
    }
}
