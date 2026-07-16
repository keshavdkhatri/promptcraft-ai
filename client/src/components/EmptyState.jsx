import { useNavigate } from 'react-router-dom';
import '../styles/EmptyState.css';

/**
 * Empty state displayed when the prompt library has no entries.
 * Provides a CTA to navigate to the Create Prompt page.
 */
function EmptyState() {
  const navigate = useNavigate();

  return (
    <div className="empty-state" role="status" aria-label="Empty library">
      <div className="empty-state-icon" aria-hidden="true">📭</div>
      <h2 className="empty-state-title">Your library is empty</h2>
      <p className="empty-state-text">
        Create and save your first prompt to start building your collection.
      </p>
      <button
        id="empty-state-create-btn"
        className="btn btn-primary"
        onClick={() => navigate('/create')}
      >
        Create Your First Prompt
      </button>
    </div>
  );
}

export default EmptyState;
