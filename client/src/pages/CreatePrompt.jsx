import { useState } from 'react';
import { optimizePrompt, savePrompt, evaluatePrompt, testPrompt } from '../api/promptsApi';
import '../styles/CreatePrompt.css';

/** Fixed categories matching the PRD (FR-23). */
const CATEGORIES = ['General', 'Writing', 'Coding', 'Study', 'Marketing', 'Other'];

const STARTER_TEMPLATES = [
  {
    name: 'Text Summarizer',
    title: 'Text Summarizer',
    category: 'Writing',
    prompt: 'Summarize the following text in 3 clear bullet points:\n\n[Insert text here]'
  },
  {
    name: 'Code Explainer',
    title: 'Code Explainer',
    category: 'Coding',
    prompt: 'Explain what this code does step-by-step in plain language:\n\n[Insert code here]'
  },
  {
    name: 'Email Rewriter',
    title: 'Email Professionalizer',
    category: 'Writing',
    prompt: 'Rewrite the following email draft to make it professional, polite, and clear:\n\nDraft: [Insert draft email here]'
  }
];

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
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [isTesting, setIsTesting] = useState(false);

  // Error states (separate so both can show independently)
  const [optimizeError, setOptimizeError] = useState('');
  const [saveError, setSaveError] = useState('');
  const [evaluateError, setEvaluateError] = useState('');
  const [testError, setTestError] = useState('');

  // Evaluation & Testing state
  const [evaluation, setEvaluation] = useState(null);
  const [testInput, setTestInput] = useState('');
  const [testResponse, setTestResponse] = useState('');
  const [testPromptSource, setTestPromptSource] = useState('original');

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

  /** Evaluate the original prompt quality. */
  const handleEvaluate = async () => {
    setEvaluateError('');
    setEvaluation(null);

    if (!originalPrompt.trim()) {
      setEvaluateError('Please enter a prompt before evaluating.');
      return;
    }

    setIsEvaluating(true);

    try {
      const result = await evaluatePrompt(originalPrompt);
      setEvaluation(result);
    } catch (err) {
      setEvaluateError(err.message);
    } finally {
      setIsEvaluating(false);
    }
  };

  /** Test the prompt against Gemini with test input. */
  const handleTest = async () => {
    setTestError('');
    setTestResponse('');

    const promptToTest = testPromptSource === 'optimized' ? optimizedPrompt : originalPrompt;

    if (!promptToTest.trim()) {
      setTestError(`Please write or generate a ${testPromptSource} prompt first.`);
      return;
    }

    setIsTesting(true);

    try {
      const result = await testPrompt(promptToTest, testInput);
      setTestResponse(result);
    } catch (err) {
      setTestError(err.message);
    } finally {
      setIsTesting(false);
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
      setEvaluation(null);
      setTestResponse('');
      setTestInput('');
    } catch (err) {
      setSaveError(err.message);
      showToast(err.message, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLoadTemplate = (tpl) => {
    setTitle(tpl.title);
    setCategory(tpl.category);
    setOriginalPrompt(tpl.prompt);
    setOptimizedPrompt('');
    setEvaluation(null);
    setTestResponse('');
    setOptimizeError('');
    setEvaluateError('');
    setTestError('');
    setSaveError('');
  };

  const isBusy = isOptimizing || isSaving || isEvaluating || isTesting;

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
          {/* Starter Templates */}
          <div className="templates-section">
            <span className="templates-label">Quick Start Templates:</span>
            <div className="templates-pills">
              {STARTER_TEMPLATES.map((tpl) => (
                <button
                  key={tpl.name}
                  type="button"
                  className="template-pill-btn"
                  onClick={() => handleLoadTemplate(tpl)}
                  disabled={isBusy}
                >
                  {tpl.name}
                </button>
              ))}
            </div>
          </div>

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
          {evaluateError && (
            <div className="error-message" role="alert" id="evaluate-error">
              ⚠ {evaluateError}
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
              id="evaluate-btn"
              className="btn btn-info"
              onClick={handleEvaluate}
              disabled={isBusy || !originalPrompt.trim()}
            >
              {isEvaluating ? 'Evaluating…' : '📊 Evaluate Quality'}
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

          {/* Evaluating indicator */}
          {isEvaluating && (
            <div className="evaluating-indicator" role="status" aria-label="Evaluating">
              <div className="pulse-dots" aria-hidden="true">
                <span />
                <span />
                <span />
              </div>
              <p>Analyzing prompt quality...</p>
            </div>
          )}

          {/* Evaluation Scorecard */}
          {evaluation && !isEvaluating && (
            <div className="evaluation-card" id="evaluation-scorecard">
              <h3 className="evaluation-card-title">Prompt Quality Report</h3>
              <div className="evaluation-score-row">
                <div className="overall-score-circle">
                  <span className="overall-score-num">{evaluation.score}</span>
                  <span className="overall-score-label">Score</span>
                </div>
                <div className="criteria-scores">
                  <div className="criteria-item">
                    <span className="criteria-name">Clarity:</span>
                    <div className="criteria-bar-container">
                      <div 
                        className="criteria-bar clarity" 
                        style={{ width: `${(evaluation.clarity_score / 5) * 100}%` }} 
                      />
                    </div>
                    <span className="criteria-val">{evaluation.clarity_score}/5</span>
                  </div>
                  <div className="criteria-item">
                    <span className="criteria-name">Specificity:</span>
                    <div className="criteria-bar-container">
                      <div 
                        className="criteria-bar specificity" 
                        style={{ width: `${(evaluation.specificity_score / 5) * 100}%` }} 
                      />
                    </div>
                    <span className="criteria-val">{evaluation.specificity_score}/5</span>
                  </div>
                  <div className="criteria-item">
                    <span className="criteria-name">Context:</span>
                    <div className="criteria-bar-container">
                      <div 
                        className="criteria-bar context" 
                        style={{ width: `${(evaluation.context_score / 5) * 100}%` }} 
                      />
                    </div>
                    <span className="criteria-val">{evaluation.context_score}/5</span>
                  </div>
                </div>
              </div>
              <div className="evaluation-suggestions">
                <h4>Suggestions for Improvement:</h4>
                <ul>
                  {evaluation.suggestions.map((suggestion, idx) => (
                    <li key={idx}>{suggestion}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* ---- Right: Preview & Testing ---- */}
        <div className="preview-panel-container">
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

          {/* ---- Testing Section ---- */}
          <div className="testing-panel" aria-label="Prompt testing">
            <h2 className="testing-title">⚡ Test Prompt Output</h2>
            <p className="testing-subtitle">
              Run this prompt against Gemini to observe its actual generated results.
            </p>

            <div className="testing-options">
              <span className="testing-option-label">Choose version:</span>
              <div className="testing-radio-group">
                <label className="radio-label">
                  <input
                    type="radio"
                    name="testPromptSource"
                    value="original"
                    checked={testPromptSource === 'original'}
                    onChange={() => setTestPromptSource('original')}
                    disabled={isBusy}
                  />
                  Original
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="testPromptSource"
                    value="optimized"
                    checked={testPromptSource === 'optimized'}
                    onChange={() => setTestPromptSource('optimized')}
                    disabled={isBusy || !optimizedPrompt}
                  />
                  Optimized {!optimizedPrompt && '(Optimize first)'}
                </label>
              </div>
            </div>

            {/* Test Input Textarea */}
            <div className="form-group testing-input-group">
              <label htmlFor="test-input" className="form-label testing-label">
                Test Input / Arguments <span className="testing-label-hint">(optional)</span>
              </label>
              <textarea
                id="test-input"
                className="form-textarea testing-textarea"
                placeholder={
                  testPromptSource === 'original' && originalPrompt.includes('[') 
                    ? "Example:\n[Insert text here]: Enter text content..."
                    : "Enter any test values or arguments..."
                }
                value={testInput}
                onChange={(e) => setTestInput(e.target.value)}
                disabled={isBusy}
                rows={3}
              />
            </div>

            {/* Test Action */}
            <div className="testing-actions">
              <button
                id="run-test-btn"
                className="btn btn-secondary testing-btn"
                onClick={handleTest}
                disabled={isBusy || (testPromptSource === 'optimized' ? !optimizedPrompt : !originalPrompt.trim())}
              >
                {isTesting ? 'Running Test…' : '🚀 Run Test'}
              </button>
            </div>

            {testError && (
              <div className="error-message testing-error" role="alert" id="test-error">
                ⚠ {testError}
              </div>
            )}

            {/* Test Result Output */}
            {isTesting && (
              <div className="testing-indicator" role="status" aria-label="Testing">
                <div className="pulse-dots" aria-hidden="true">
                  <span />
                  <span />
                  <span />
                </div>
                <p>Generating response from Gemini...</p>
              </div>
            )}

            {testResponse && !isTesting && (
              <div className="test-result-section">
                <span className="test-result-label">AI Response:</span>
                <div className="test-result-text">{testResponse}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreatePrompt;
