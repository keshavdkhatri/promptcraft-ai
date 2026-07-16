import '../styles/CategoryFilter.css';

/** Fixed category options matching the PRD and backend validators. */
const CATEGORIES = ['All', 'General', 'Writing', 'Coding', 'Study', 'Marketing', 'Other'];

/**
 * Horizontal pill-button category filter bar.
 *
 * @param {{ selected: string, onChange: (category: string) => void }} props
 */
function CategoryFilter({ selected, onChange }) {
  return (
    <div
      className="category-filter"
      role="group"
      aria-label="Filter prompts by category"
    >
      {CATEGORIES.map((cat) => (
        <button
          key={cat}
          id={`category-filter-${cat.toLowerCase()}`}
          className={`category-btn ${selected === cat ? 'category-btn--active' : ''}`}
          onClick={() => onChange(cat)}
          aria-pressed={selected === cat}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}

export default CategoryFilter;
