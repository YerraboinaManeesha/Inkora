import { Link } from 'react-router-dom';
import Logo from './Logo';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <div className="footer-logo">
            <Logo size={26} showRing={false} />
            <span>Inkora</span>
          </div>
          <p className="footer-tagline">Ideas worth reading. Conversations worth joining.</p>
        </div>

        <div className="footer-cols">
          <div className="footer-col">
            <h4>Explore</h4>
            <Link to="/">Home</Link>
            <Link to="/categories">Categories</Link>
            <Link to="/about">About</Link>
          </div>
          <div className="footer-col">
            <h4>Account</h4>
            <Link to="/auth">Sign in</Link>
            <Link to="/auth">Create an account</Link>
          </div>
        </div>
      </div>
      <div className="container">
        <hr className="hairline" />
        <p className="footer-copy">© {new Date().getFullYear()} Inkora. All essays belong to their authors.</p>
      </div>
    </footer>
  );
}