import React from 'react';

// AvatarPicker component - Grid of emoji avatars
// McCabe complexity: 2
export default function AvatarPicker({ value, onChange }) {
  const avatars = [
    // Animals
    { emoji: '🦄', name: 'Unicorn' },
    { emoji: '🦋', name: 'Butterfly' },
    { emoji: '🐉', name: 'Dragon' },
    { emoji: '🐱', name: 'Cat' },
    { emoji: '🐶', name: 'Dog' },
    { emoji: '🐰', name: 'Bunny' },
    { emoji: '🐼', name: 'Panda' },
    { emoji: '🦁', name: 'Lion' },

    // Space
    { emoji: '🚀', name: 'Rocket' },
    { emoji: '👨‍🚀', name: 'Astronaut' },
    { emoji: '🪐', name: 'Planet' },
    { emoji: '⭐', name: 'Star' },
    { emoji: '🌙', name: 'Moon' },
    { emoji: '👽', name: 'Alien' },

    // Fantasy
    { emoji: '🧙', name: 'Wizard' },
    { emoji: '🧚', name: 'Fairy' },
    { emoji: '🦸', name: 'Superhero' },
    { emoji: '👸', name: 'Princess' },
    { emoji: '🤴', name: 'Knight' },

    // Objects
    { emoji: '🌈', name: 'Rainbow' },
    { emoji: '🤖', name: 'Robot' },
    { emoji: '🚗', name: 'Car' },
    { emoji: '⛵', name: 'Boat' },
    { emoji: '🌸', name: 'Flower' },
    { emoji: '🌳', name: 'Tree' }
  ];

  return (
    <div style={styles.grid} data-testid="avatar-picker">
      {avatars.map((avatar) => (
        <button
          key={avatar.emoji}
          type="button"
          onClick={() => onChange(avatar.emoji)}
          style={{
            ...styles.avatarButton,
            ...(value === avatar.emoji ? styles.selected : {})
          }}
          title={avatar.name}
        >
          <span style={styles.emoji}>{avatar.emoji}</span>
        </button>
      ))}
    </div>
  );
}

const styles = {
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(6, 1fr)',
    gap: '12px',
    maxWidth: '500px',
    margin: '0 auto'
  },
  avatarButton: {
    width: '70px',
    height: '70px',
    border: '2px solid #ddd',
    borderRadius: '12px',
    background: '#fff',
    cursor: 'pointer',
    transition: 'all 0.2s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  selected: {
    borderColor: '#667eea',
    background: '#f0f4ff',
    transform: 'scale(1.1)',
    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
  },
  emoji: {
    fontSize: '36px'
  }
};
