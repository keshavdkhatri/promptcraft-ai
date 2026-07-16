import { NavLink } from 'react-router-dom';
import '../styles/Navbar.css';

/**
 * Top navigation bar with brand logo and page links.
 */
function Navbar() {
  return (
    <nav className="navbar" role="navigation" aria-label="Main navigation">
      <div className="navbar-container">
        <div className="navbar-brand" aria-label="PromptCraft AI home">
          <span className="navbar-logo" aria-hidden="true">⚡</span>
          <span className="navbar-title">
            PromptCraft <span className="navbar-title-accent">AI</span>
          </span>
        </div>

        <div className="navbar-links">
          <NavLink
            to="/create"
            id="nav-create"
            className={({ isActive }) =>
              isActive ? 'nav-link nav-link--active' : 'nav-link'
            }
          >
            Create Prompt
          </NavLink>
          <NavLink
            to="/library"
            id="nav-library"
            className={({ isActive }) =>
              isActive ? 'nav-link nav-link--active' : 'nav-link'
            }
          >
            Prompt Library
          </NavLink>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
