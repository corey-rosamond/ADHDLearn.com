// Letter Pop Game - Main Entry Point
// Refactored for React + Vite integration
import Phaser from 'phaser';

// Import utilities and services
import ResponsiveUtils from './utils/ResponsiveUtils.js';
import AudioManager from './services/AudioManager.js';

// Import game objects
import Bubble from './gameobjects/Bubble.js';

// Import config
import ThemeConfig from './config/ThemeConfig.js';

// Import components
import BackgroundComponent from './components/BackgroundComponent.js';
import ButtonComponent from './components/ButtonComponent.js';
import DecorationsComponent from './components/DecorationsComponent.js';
import SliderComponent from './components/SliderComponent.js';
import TitleComponent from './components/TitleComponent.js';

// Import mixins
import VisibilityHandlerMixin from './mixins/VisibilityHandlerMixin.js';

// Import scenes
import BootScene from './scenes/BootScene.js';
import PreloadScene from './scenes/PreloadScene.js';
import MainMenuScene from './scenes/MainMenuScene.js';
import LetterPopMenuScene from './scenes/LetterPopMenuScene.js';
import LetterPopScene from './scenes/LetterPopScene.js';
import ResultsScene from './scenes/ResultsScene.js';
import SettingsScene from './scenes/SettingsScene.js';
import LetterTestScene from './scenes/LetterTestScene.js';

// Make classes globally available for scenes (temporary bridge solution)
// This allows existing scene code to work without massive refactoring
window.ResponsiveUtils = ResponsiveUtils;
window.AudioManager = AudioManager;
window.Bubble = Bubble;
window.ThemeConfig = ThemeConfig;
window.BackgroundComponent = BackgroundComponent;
window.ButtonComponent = ButtonComponent;
window.DecorationsComponent = DecorationsComponent;
window.SliderComponent = SliderComponent;
window.TitleComponent = TitleComponent;
window.VisibilityHandlerMixin = VisibilityHandlerMixin;

const config = {
  type: Phaser.WEBGL,
  scale: {
    mode: Phaser.Scale.FIT,
    parent: 'game-container',
    width: 1600,
    height: 1000,
    min: { width: 800, height: 500 },
    max: { width: 2560, height: 1600 },
    autoCenter: Phaser.Scale.CENTER_BOTH,
    resolution: window.devicePixelRatio || 1
  },
  render: {
    antialias: true,
    roundPixels: false,
    pixelArt: false,
    mipmapFilter: 'LINEAR_MIPMAP_LINEAR'
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false
    }
  },
  backgroundColor: '#00BCD4',
  scene: [
    BootScene,
    PreloadScene,
    MainMenuScene,
    LetterPopMenuScene,
    LetterPopScene,
    ResultsScene,
    SettingsScene,
    LetterTestScene
  ]
};

export default function startLetterPopGame() {
  console.log('[Letter Pop] Initializing game...');
  console.log('[Letter Pop] Config:', config);
  console.log('[Letter Pop] Scenes:', config.scene);

  const game = new Phaser.Game(config);

  game.events.once('ready', () => {
    console.log('[Letter Pop] Game ready! Current scene:', game.scene.keys);
  });

  // Log any errors
  game.events.on('error', (error) => {
    console.error('[Letter Pop] ERROR:', error);
  });

  return game;
}
