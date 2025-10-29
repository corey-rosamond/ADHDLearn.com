import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import startLetterPopGame from '../phaser-game/index.js';
import LoadingScreen from '../components/LoadingScreen.jsx';

/**
 * LetterPopGame Page
 *
 * Wrapper for the existing Phaser Letter Pop game
 * McCabe complexity: 2
 */
function LetterPopGame() {
  const gameRef = useRef(null);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if logged in
    const token = localStorage.getItem('childToken');
    if (!token) {
      navigate('/');
      return;
    }

    // Initialize Phaser game with callbacks
    const onReadyCallback = () => {
      console.log('[LetterPopGame] onReady fired - hiding loading screen');
      setIsLoading(false);
    };

    const onExitCallback = () => {
      console.log('[LetterPopGame] onExit fired - navigating to dashboard');
      navigate('/dashboard');
    };

    const game = startLetterPopGame({
      onExit: onExitCallback,
      onReady: onReadyCallback
    });

    gameRef.current = game;

    // Cleanup on unmount
    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, [navigate]);

  return (
    <>
      {isLoading && <LoadingScreen />}
      <div id="game-container" style={{
        width: '100vw',
        height: '100vh',
        margin: 0,
        padding: 0,
        overflow: 'hidden',
        display: 'flex', // Keep visible so Phaser can load assets
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#667eea',
        opacity: isLoading ? 0 : 1, // Hide visually but keep in DOM
        zIndex: isLoading ? -1 : 1, // Behind loading screen when loading
        transition: 'opacity 0.3s ease' // Smooth fade-in
      }} />
    </>
  );
}

export default LetterPopGame;
