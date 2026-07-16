import { useState } from 'react';
import { optimizePrompt, savePrompt } from '../api/promptsApi';
import '../styles/CreatePrompt.css';

/** Fixed categories matching the PRD (FR-23). */
const CATEGORIES = ['General', 'Writing', 'Coding', 'Study', 'Marketing', 'Other'];

/**
 * Create Prompt page.
 * Allows users to write, optimize, and save prompts.
 *
 * @param {{ showToast: (message: string, type?: string) => void }} props
 */
function CreatePrompt({ showToast }) {
  // Form fields
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [originalPrompt, setOriginalPrompt] = useState('');

  // Derived output
  const [optimizedPrompt, setOptimizedPrompt] = useState('');

  // Loading states
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Error states (separate so both can show independently)
  const [optimizeError, setOptimizeError] = useState('');
  const [saveError, setSaveError] = useState('');

  /** Validate all required fields for save. Returns an error string or null. */
  const validateForSave = () => {
    if (!title.trim()) return 'Title is required.';
    if (!category) return 'Please select a category.';
    if (!originalPrompt.trim()) return 'Original prompt is required.';
    return null;
  };

  /** Send the original prompt to Gemini via Flask. */
  const handleOptimize = async () => {
    setOptimizeError('');

    if (!originalPrompt.trim()) {
      setOptimizeError('Please enter a prompt before optimizing.');
      return;
    }

    setIsOptimizing(true);
    setOptimizedPrompt(''); // Clear previous result

    try {
      const result = await optimizePrompt(originalPrompt);
      setOptimizedPrompt(result);
    } catch (err) {
      setOptimizeError(err.message);
    } finally {
      setIsOptimizing(false);
    }
  };

  /** Save the prompt (with or without optimized version) to the library. */
  const handleSave = async () => {
    setSaveError('');

    const validationError = validateForSave();
    if (validationError) {
      setSaveError(validationError);
      return;
    }

    setIsSaving(true);

    try {
      await savePrompt({
        title: title.trim(),
        category,
        originalPrompt: originalPrompt.trim(),
        optimizedPrompt: optimizedPrompt.trim(),
      });

      showToast('Prompt saved to your library!', 'success');

      // Reset form after successful save
      setTitle('');
      setCategory('');
      setOriginalPrompt('');
      setOptimizedPrompt('');
    } catch (err) {
      setSaveError(err.message);
      showToast(err.message, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const isBusy = isOptimizing || isSaving;

  return (
    <div className="create-prompt">
      {/* Page Header */}
      <div className="page-header">
        <h1 className="page-title">Create Prompt</h1>
        <p className="page-subtitle">
          Write a prompt, optimize it with Gemini AI, and save both versions to your library.
        </p>
      </div>

      <div className="create-layout">
        {/* ---- Left: Form ---- */}
        <div className="create-form-panel">
          {/* Title */}
          <div className="form-group">
            <label htmlFor="prompt-title" className="form-label">
              Title <span className="required">*</span>
            </label>
            <input
              id="prompt-title"
              type="text"
              className="form-input"
              placeholder="e.g. Blog post introduction writer"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isBusy}
              maxLength={120}
            />
          </div>

          {/* Category */}
          <div className="form-group">
            <label htmlFor="prompt-category" className="form-label">
              Category <span className="required">*</span>
            </label>
            <select
              id="prompt-category"
              className="form-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              disabled={isBusy}
            >
              <option value="">Select a category…</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Original Prompt */}
          <div className="form-group">
            <label htmlFor="original-prompt" className="form-label">
              Original Prompt <span className="required">*</span>
            </label>
            <textarea
              id="original-prompt"
              className="form-textarea"
              placeholder="Write your prompt here…"
              value={originalPrompt}
              onChange={(e) => setOriginalPrompt(e.target.value)}
              disabled={isBusy}
              rows={7}
            />
          </div>

          {/* Error messages */}
          {optimizeError && (
            <div className="error-message" role="alert" id="optimize-error">
              ⚠ {optimizeError}
            </div>
          )}
          {saveError && (
            <div className="error-message" role="alert" id="save-error">
              ⚠ {saveError}
            </div>
          )}

          {/* Actions */}
          <div className="form-actions">
            <button
              id="optimize-btn"
              className="btn btn-secondary"
              onClick={handleOptimize}
              disabled={isBusy}
            >
              {isOptimizing ? 'Optimizing…' : '✨ Optimize with AI'}
            </button>
            <button
              id="save-btn"
              className="btn btn-primary"
              onClick={handleSave}
              disabled={isBusy}
            >
              {isSaving ? 'Saving…' : '💾 Save Prompt'}
            </button>
          </div>
        </div>

        {/* ---- Right: Preview ---- */}
        <div className="preview-panel" aria-label="Prompt preview">
          <h2 className="preview-title">Live Preview</h2>

          {/* Original preview */}
          <div className="preview-section">
            <span className="preview-section-label">Original</span>
            <div className="preview-text">
              {originalPrompt || (
                <span className="preview-placeholder">
                  Your prompt will appear here as you type…
                </span>
              )}
            </div>
          </div>

          {/* Optimizing animation */}
          {isOptimizing && (
            <div className="optimizing-indicator" role="status" aria-label="Optimizing">
              <div className="pulse-dots" aria-hidden="true">
                <span />
                <span />
                <span />
              </div>
              <p>Gemini is improving your prompt…</p>
            </div>
          )}

          {/* Optimized result */}
          {optimizedPrompt && !isOptimizing && (
            <div className="preview-section preview-section--optimized">
              <span className="preview-section-label preview-section-label--optimized">
                ✨ Optimized
              </span>
              <div className="preview-text">{optimizedPrompt}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CreatePrompt;
