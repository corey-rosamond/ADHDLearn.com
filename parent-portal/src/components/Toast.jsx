// Toast notification component
// McCabe complexity: 2

import { useEffect } from 'react';

/**
 * Toast notification that auto-dismisses after 3 seconds
 * @param {string} message - Message to display
 * @param {string} type - 'success' | 'error' | 'info'
 * @param {function} onClose - Callback when toast is dismissed
 */
export default function Toast({ message, type = 'success', onClose }) {
  console.log('Toast component rendering with message:', message);

  useEffect(() => {
    console.log('Toast mounted');
    const timer = setTimeout(() => {
      console.log('Toast auto-closing');
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const backgroundColor = type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6';

  return (
    <div
      data-testid="toast-notification"
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        backgroundColor,
        color: 'white',
        padding: '16px 24px',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        zIndex: 10000,
        fontSize: '16px',
        fontWeight: '500',
        maxWidth: '400px'
      }}
    >
      {message}
    </div>
  );
}
