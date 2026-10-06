import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="container" style={{ padding: '96px 0', textAlign: 'center' }}>
      <span className="eyebrow">404</span>
      <h1 style={{ fontSize: '2.4rem', margin: '14px 0 20px' }}>Page not found</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '28px' }}>
        This page may have been moved, unpublished, or never existed.
      </p>
      <Link to="/" className="btn btn-primary">Back to Inkora</Link>
    </div>
  );
}
