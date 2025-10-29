import { useState } from 'react';
import PropTypes from 'prop-types';
import './NumberPad.css';

/**
 * NumberPad Component
 *
 * Large, colorful number pad for child PIN entry
 * ADHD-friendly: Large buttons (min 100x100px), immediate feedback, audio cues
 *
 * McCabe complexity: 2
 */
function NumberPad({ onDigit, onClear, onBack }) {
  const [pressedButton, setPressedButton] = useState(null);

  // Handle button press with visual and audio feedback
  // McCabe complexity: 1
  const handleButtonPress = (value) => {
    setPressedButton(value);

    // Visual feedback duration
    setTimeout(() => {
      setPressedButton(null);
    }, 150);

    // Audio feedback (optional - soft beep)
    if (window.Audio) {
      const beep = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuCzPLTgjMGHm7A7+OZUQ0QVq3o7qZUGAhCmdjzvmwiB S9+xu/aizkJElSr6OypVhYKQJjY5bNcLwcxgcXv24xCDhFLp+Xu');
      beep.volume = 0.3;
      beep.play().catch(() => {});
    }

    // Call the appropriate handler
    if (value === 'back') {
      onBack?.();
    } else if (value === 'clear') {
      onClear?.();
    } else {
      onDigit?.(value);
    }
  };

  const numbers = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
  ];

  return (
    <div className="number-pad">
      {/* Number grid: 1-9 */}
      {numbers.map((row, rowIndex) => (
        <div key={rowIndex} className="number-pad-row">
          {row.map((num) => (
            <button
              key={num}
              className={`number-pad-button ${pressedButton === num ? 'pressed' : ''}`}
              onClick={() => handleButtonPress(num)}
              aria-label={`Number ${num}`}
            >
              {num}
            </button>
          ))}
        </div>
      ))}

      {/* Bottom row: Back, 0, Clear */}
      <div className="number-pad-row">
        <button
          className={`number-pad-button special ${pressedButton === 'back' ? 'pressed' : ''}`}
          onClick={() => handleButtonPress('back')}
          aria-label="Go back"
        >
          ←
        </button>
        <button
          className={`number-pad-button ${pressedButton === 0 ? 'pressed' : ''}`}
          onClick={() => handleButtonPress(0)}
          aria-label="Number 0"
        >
          0
        </button>
        <button
          className={`number-pad-button special ${pressedButton === 'clear' ? 'pressed' : ''}`}
          onClick={() => handleButtonPress('clear')}
          aria-label="Clear PIN"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

NumberPad.propTypes = {
  onDigit: PropTypes.func,
  onClear: PropTypes.func,
  onBack: PropTypes.func,
};

export default NumberPad;
