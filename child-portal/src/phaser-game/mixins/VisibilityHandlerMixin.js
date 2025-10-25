// ES6 Module
export default /**
 * VisibilityHandlerMixin - Page visibility and focus handling
 *
 * Purpose: Manages audio pause/resume when tab loses focus
 * Replaces: Duplicate visibility handling in multiple scenes (~50 lines each)
 */
class VisibilityHandlerMixin {
    /**
     * Sets up visibility handling for a scene
     *
     * @param {Phaser.Scene} scene - The scene to setup
     * @param {string} sceneKey - The scene's key for state checking
     *
     * @example
     * // In scene's create() method:
     * VisibilityHandlerMixin.setup(this, 'MainMenu');
     */
    static setup(scene, sceneKey) {
        // Check if scene has custom pause/resume methods (like LetterPopScene)
        const hasCustomMethods = typeof scene.pauseGame === 'function' && typeof scene.resumeGame === 'function';

        scene.visibilityChangeHandler = () => {
            if (document.hidden) {
                if (hasCustomMethods) {
                    scene.pauseGame();
                } else {
                    scene.audioManager.pauseAll();
                    if (scene.scene.isActive(sceneKey)) {
                        scene.scene.pause(sceneKey);
                    }
                }
            } else {
                if (hasCustomMethods) {
                    scene.resumeGame();
                } else {
                    if (scene.scene.isPaused(sceneKey)) {
                        scene.scene.resume(sceneKey);
                        scene.audioManager.resumeAll();
                    }
                }
            }
        };

        scene.blurHandler = () => {
            if (hasCustomMethods) {
                scene.pauseGame();
            } else {
                scene.audioManager.pauseAll();
                if (scene.scene.isActive(sceneKey)) {
                    scene.scene.pause(sceneKey);
                }
            }
        };

        scene.focusHandler = () => {
            if (hasCustomMethods) {
                scene.resumeGame();
            } else {
                if (scene.scene.isPaused(sceneKey)) {
                    scene.scene.resume(sceneKey);
                    scene.audioManager.resumeAll();
                }
            }
        };

        document.addEventListener('visibilitychange', scene.visibilityChangeHandler);
        window.addEventListener('blur', scene.blurHandler);
        window.addEventListener('focus', scene.focusHandler);
    }

    /**
     * Cleans up visibility handlers
     *
     * @param {Phaser.Scene} scene - The scene to cleanup
     *
     * @example
     * // In scene's shutdown() method:
     * VisibilityHandlerMixin.cleanup(this);
     */
    static cleanup(scene) {
        if (scene.visibilityChangeHandler) {
            document.removeEventListener('visibilitychange', scene.visibilityChangeHandler);
        }
        if (scene.blurHandler) {
            window.removeEventListener('blur', scene.blurHandler);
        }
        if (scene.focusHandler) {
            window.removeEventListener('focus', scene.focusHandler);
        }
    }
}
