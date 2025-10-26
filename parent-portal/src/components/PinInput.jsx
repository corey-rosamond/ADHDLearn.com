import React, { useRef } from 'react';

// PinInput component - 4-digit PIN input with auto-advance
// McCabe complexity: 5
export default function PinInput({ value, onChange, error, testId = 'pin-input' }) {
  const inputRefs = useRef([]);

  // Handle digit input
  const handleChange = (index, digit) => {
    // Only allow numeric input
    if (digit && !/^\d$/.test(digit)) {
      return;
    }

    // Build new PIN value
    const pinArray = (value || '').padEnd(4, ' ').split('');
    pinArray[index] = digit || ' ';
    const newPin = pinArray.join('').trimEnd();

    onChange(newPin);

    // Auto-advance to next input
    if (digit && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle backspace
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !value[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const digits = (value || '').padEnd(4, ' ').split('');

  return (
    <div>
      <div style={styles.container} data-testid={testId}>
        {[0, 1, 2, 3].map((index) => (
          <input
            key={index}
            ref={(el) => (inputRefs.current[index] = el)}
            type="text"
            maxLength="1"
            value={digits[index] === ' ' ? '' : digits[index]}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            style={{
              ...styles.input,
              ...(error ? styles.inputError : {})
            }}
            inputMode="numeric"
            pattern="\d*"
          />
        ))}
      </div>
      {error && <div style={styles.error}>{error}</div>}
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'center'
  },
  input: {
    width: '60px',
    height: '60px',
    fontSize: '28px',
    fontWeight: 'bold',
    textAlign: 'center',
    border: '2px solid #ddd',
    borderRadius: '8px',
    outline: 'none',
    transition: 'border-color 0.2s'
  },
  inputError: {
    borderColor: '#ff4444'
  },
  error: {
    color: '#ff4444',
    fontSize: '14px',
    marginTop: '8px',
    textAlign: 'center'
  }
};
