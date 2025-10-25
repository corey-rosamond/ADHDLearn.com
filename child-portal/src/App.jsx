import { useEffect, useRef } from 'react';
import startLetterPopGame from './phaser-game/index.js';
import './App.css';

function App() {
  const gameRef = useRef(null);

  useEffect(() => {
    // Initialize Phaser game with existing working code
    const game = startLetterPopGame();
    gameRef.current = game;

    // Cleanup on unmount
    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, []);

  return (
    <div id="game-container" style={{
      width: '100vw',
      height: '100vh',
      margin: 0,
      padding: 0,
      overflow: 'hidden',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#00BCD4'
    }} />
  );
}

export default App;
