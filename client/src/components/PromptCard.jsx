import { useState } from 'react';
import '../styles/PromptCard.css';

/**
 * Copies text to clipboard.
 * @param {string} text
 */
async function copyToClipboard(text) {
  await navigator.clipboard.writeText(text);
}

/**
 * Formats an ISO8601 date string to a readable locale date.
 * @param {string} iso
 */
function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Individual prompt card displaying both prompt versions with
 * copy and delete actions.
 *
 * @param {{ prompt: object, onDelete: (id: string) => Promise<void> }} props
 */
function PromptCard({ prompt, onDelete }) {
  const [copiedField, setCopiedField] = useState(null); // 'original' | 'optimized' | null
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const hasOptimized = Boolean(
    prompt.optimizedPrompt && prompt.optimizedPrompt.trim()
  );

  const handleCopy = async (text, field) => {
    try {
      await copyToClipboard(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch {
      // Silently ignore — browser may block clipboard access
    }
  };

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    try {
      await onDelete(prompt.id);
      // Parent removes the card from state on success
    } catch {
      // onDelete already shows a toast — just reset local state
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <article className="prompt-card" aria-label={`Prompt: ${prompt.title}`}>
      {/* ---- Header ---- */}
      <div className="prompt-card-header">
        <div className="prompt-card-meta">
          <h3 className="prompt-card-title">{prompt.title}</h3>
          <div className="prompt-card-badges">
            <span className="badge badge-category">{prompt.category}</span>
            <span className="prompt-card-date">{formatDate(prompt.createdAt)}</span>
          </div>
        </div>

        <button
          className="btn-delete"
          id={`delete-btn-${prompt.id}`}
          onClick={() => setShowDeleteConfirm(true)}
          disabled={isDeleting}
          aria-label={`Delete prompt "${prompt.title}"`}
        >
          🗑
        </button>
      </div>

      {/* ---- Body ---- */}
      <div className="prompt-card-body">
        {/* Original prompt */}
        <div className="prompt-section">
          <div className="prompt-section-header">
            <span className="prompt-section-label">Original</span>
            <button
              id={`copy-original-${prompt.id}`}
              className={`btn-copy ${copiedField === 'original' ? 'btn-copy--copied' : ''}`}
              onClick={() => handleCopy(prompt.originalPrompt, 'original')}
              aria-label="Copy original prompt"
            >
              {copiedField === 'original' ? '✓ Copied!' : 'Copy'}
            </button>
          </div>
          <p className="prompt-text">{prompt.originalPrompt}</p>
        </div>

        {/* Optimized prompt — only rendered when present */}
        {hasOptimized && (
          <div className="prompt-section prompt-section--optimized">
            <div className="prompt-section-header">
              <span className="prompt-section-label prompt-section-label--optimized">
                ✨ Optimized
              </span>
              <button
                id={`copy-optimized-${prompt.id}`}
                className={`btn-copy btn-copy--optimized ${
                  copiedField === 'optimized' ? 'btn-copy--copied' : ''
                }`}
                onClick={() => handleCopy(prompt.optimizedPrompt, 'optimized')}
                aria-label="Copy optimized prompt"
              >
                {copiedField === 'optimized' ? '✓ Copied!' : 'Copy'}
              </button>
            </div>
            <p className="prompt-text">{prompt.optimizedPrompt}</p>
          </div>
        )}
      </div>

      {/* ---- Delete Confirmation Overlay ---- */}
      {showDeleteConfirm && (
        <div
          className="delete-confirm-overlay"
          role="dialog"
          aria-modal="true"
          aria-label="Confirm deletion"
        >
          <div className="delete-confirm">
            <p>Delete &ldquo;{prompt.title}&rdquo;?</p>
            <div className="delete-confirm-actions">
              <button
                id={`confirm-delete-${prompt.id}`}
                className="btn btn-danger"
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting…' : 'Yes, Delete'}
              </button>
              <button
                id={`cancel-delete-${prompt.id}`}
                className="btn btn-secondary"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </article>
  );
}

export default PromptCard;
