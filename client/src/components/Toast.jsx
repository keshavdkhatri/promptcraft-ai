import { useEffect } from 'react';
import '../styles/Toast.css';

/**
 * Toast notification component.
 * Auto-dismisses after 3s; also has a manual close button.
 *
 * @param {{ message: string, type: 'success'|'error'|'info', onClose: () => void }} props
 */
function Toast({ message, type = 'success', onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const icons = {
    success: '✓',
    error: '✕',
    info: 'i',
  };

  return (
    <div
      className={`toast toast--${type}`}
      role="alert"
      aria-live="polite"
      id={`toast-${type}`}
    >
      <span className="toast-icon" aria-hidden="true">
        {icons[type] ?? icons.info}
      </span>
      <span className="toast-message">{message}</span>
      <button
        className="toast-close"
        onClick={onClose}
        aria-label="Dismiss notification"
      >
        ×
      </button>
    </div>
  );
}

export default Toast;
