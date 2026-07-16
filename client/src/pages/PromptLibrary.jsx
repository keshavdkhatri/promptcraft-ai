import { useState, useEffect } from 'react';
import { getAllPrompts, deletePrompt } from '../api/promptsApi';
import PromptCard from '../components/PromptCard';
import CategoryFilter from '../components/CategoryFilter';
import EmptyState from '../components/EmptyState';
import LoadingSpinner from '../components/LoadingSpinner';
import '../styles/PromptLibrary.css';

function PromptLibrary({ showToast }) {
  const [prompts, setPrompts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchPrompts = async () => {
    setIsLoading(true);
    setError('');
    try {
      const data = await getAllPrompts();
      // Sort newest first
      data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setPrompts(data);
    } catch (err) {
      setError(err.message || 'Failed to load prompts.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPrompts();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deletePrompt(id);
      setPrompts((prev) => prev.filter((p) => p.id !== id));
      showToast('Prompt deleted successfully.', 'success');
    } catch (err) {
      showToast(err.message || 'Failed to delete prompt.', 'error');
      throw err; // Re-throw to inform PromptCard so it can reset loading state
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="library-error">
        <p>⚠ {error}</p>
        <button className="btn btn-secondary" onClick={fetchPrompts}>
          Try Again
        </button>
      </div>
    );
  }

  if (prompts.length === 0) {
    return <EmptyState />;
  }

  const filteredPrompts = selectedCategory === 'All' 
    ? prompts 
    : prompts.filter((p) => p.category === selectedCategory);

  return (
    <div className="prompt-library">
      <div className="page-header library-header-row">
        <div>
          <h1 className="page-title">Prompt Library</h1>
          <p className="page-subtitle">Browse, copy, and manage your saved prompts.</p>
        </div>
        <CategoryFilter 
          selected={selectedCategory} 
          onChange={setSelectedCategory} 
        />
      </div>

      {filteredPrompts.length === 0 ? (
        <div className="no-results">
          <p>No prompts found in the "{selectedCategory}" category.</p>
        </div>
      ) : (
        <div className="prompts-grid">
          {filteredPrompts.map((prompt) => (
            <PromptCard 
              key={prompt.id} 
              prompt={prompt} 
              onDelete={handleDelete} 
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default PromptLibrary;
