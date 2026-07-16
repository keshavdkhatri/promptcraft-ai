import '../styles/LoadingSpinner.css';

/**
 * Animated dual-ring loading spinner.
 *
 * @param {{ text?: string }} props
 */
function LoadingSpinner({ text = 'Loading...' }) {
  return (
    <div className="spinner-wrapper" role="status" aria-label={text}>
      <div className="spinner" aria-hidden="true" />
      {text && <p className="spinner-text">{text}</p>}
    </div>
  );
}

export default LoadingSpinner;
