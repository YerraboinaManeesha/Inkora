import { useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';
import Logo from './Logo';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const initials = user?.name
    ?.split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  // The avatar is a single toggle: one click takes you to your
  // destination (Profile & Settings, or the Admin dashboard); one more
  // click on that same avatar — while you're already there — takes you
  // back. No separate menu, no separate back button.
  const destination = user?.role === 'admin' ? '/admin' : '/profile';
  const isAtDestination = location.pathname === destination || location.pathname.startsWith('/admin');

  const handleAvatarClick = () => {
    if (isAtDestination) {
      if (window.history.state && window.history.state.idx > 0) {
        navigate(-1);
      } else {
        navigate('/');
      }
    } else {
      navigate(destination);
    }
  };

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="navbar-logo">
          <Logo size={30} showRing={false} />
          <span>Inkora</span>
        </Link>

        <nav className={`navbar-links ${mobileOpen ? 'is-open' : ''}`}>
          <NavLink to="/" end onClick={() => setMobileOpen(false)}>
            Home
          </NavLink>
          <NavLink to="/categories" onClick={() => setMobileOpen(false)}>
            Categories
          </NavLink>
          <NavLink to="/about" onClick={() => setMobileOpen(false)}>
            About
          </NavLink>

          <span className="navbar-mobile-only">
            {user ? (
              <button className="btn btn-outline btn-sm" onClick={handleLogout}>
                Logout
              </button>
            ) : (
              <Link to="/auth" className="btn btn-primary btn-sm" onClick={() => setMobileOpen(false)}>
                Get Started
              </Link>
            )}
          </span>
        </nav>

        <div className="navbar-actions">
          <ThemeToggle />

          {user ? (
            <button
              className="navbar-avatar"
              style={{ background: user.avatarColor || '#7A2E4A' }}
              onClick={handleAvatarClick}
              aria-label={isAtDestination ? 'Go back' : 'Open profile and settings'}
              title={isAtDestination ? 'Go back' : 'Profile & Settings'}
            >
              {isAtDestination ? '←' : initials}
            </button>
          ) : (
            <Link to="/auth" className="btn btn-primary btn-sm navbar-cta">
              Get Started
            </Link>
          )}

          <button
            className="navbar-burger"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>
    </header>
  );
}