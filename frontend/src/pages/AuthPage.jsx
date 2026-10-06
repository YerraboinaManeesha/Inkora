import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';
import './AuthPage.css';

const IconPerson = () => (
  <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6">
    <circle cx="10" cy="6.5" r="3.4" />
    <path d="M3.5 17c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6" strokeLinecap="round" />
  </svg>
);
const IconMail = () => (
  <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6">
    <rect x="2.5" y="4.5" width="15" height="11" rx="1.6" />
    <path d="M3 5.5l7 5.5 7-5.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const IconLock = () => (
  <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6">
    <rect x="4" y="9" width="12" height="8" rx="1.6" />
    <path d="M6.5 9V6.5a3.5 3.5 0 0 1 7 0V9" strokeLinecap="round" />
  </svg>
);
const IconEye = ({ off }) => (
  <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6">
    <path d="M2 10s3-5.5 8-5.5S18 10 18 10s-3 5.5-8 5.5S2 10 2 10z" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="10" cy="10" r="2.2" />
    {off && <path d="M3 3l14 14" strokeLinecap="round" />}
  </svg>
);

export default function AuthPage() {
  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { login, signup } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const switchMode = (next) => {
    setMode(next);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const user =
        mode === 'login'
          ? await login(form.email, form.password)
          : await signup(form.name, form.email, form.password);

      // Backend determines the role; the frontend just routes accordingly.
      if (user.role === 'admin') {
        navigate('/admin', { replace: true });
      } else {
        navigate(from && from !== '/auth' ? from : '/articles', { replace: true });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-scene">
      <span className="auth-dot d1" />
      <span className="auth-dot d2" />
      <span className="auth-dot d3" />
      <span className="auth-dot d4" />
      <span className="auth-dot d5" />

      <div className="auth-card">
        <div className="auth-card-header">
          <Link to="/" aria-label="Inkora home">
            <Logo size={54} />
          </Link>
          <h1 className="auth-card-brand">Inkora</h1>
          <p className="auth-card-welcome">{mode === 'login' ? 'Welcome back' : 'Welcome'}</p>
          <svg className="auth-card-wave" viewBox="0 0 400 44" preserveAspectRatio="none">
            <path d="M0,0 C120,44 280,44 400,0 L400,44 L0,44 Z" />
          </svg>
        </div>

        <div className="auth-card-body">
          <form onSubmit={handleSubmit}>
            {mode === 'signup' && (
              <div className="auth-input-group">
                <span className="auth-input-icon"><IconPerson /></span>
                <div className="auth-input-text">
                  <label htmlFor="name">Name</label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Ada Lovelace"
                  />
                </div>
              </div>
            )}

            <div className="auth-input-group">
              <span className="auth-input-icon"><IconMail /></span>
              <div className="auth-input-text">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div className="auth-input-group">
              <span className="auth-input-icon"><IconLock /></span>
              <div className="auth-input-text">
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  value={form.password}
                  onChange={handleChange}
                  placeholder="At least 6 characters"
                />
              </div>
              <button
                type="button"
                className="auth-input-toggle"
                onClick={() => setShowPassword((s) => !s)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                <IconEye off={showPassword} />
              </button>
            </div>

            {mode === 'login' && (
              <div className="auth-forgot-row">
                <span className="auth-forgot">Forgot password?</span>
              </div>
            )}

            {error && <p className="auth-error">{error}</p>}

            <button className="auth-submit" disabled={submitting}>
              {submitting ? 'Please wait…' : mode === 'login' ? 'Log in' : 'Register'}
            </button>
          </form>

          <p className="auth-switch">
            {mode === 'login' ? (
              <>Don't have an account? <button type="button" onClick={() => switchMode('signup')}>Sign up</button></>
            ) : (
              <>Already have an account? <button type="button" onClick={() => switchMode('login')}>Sign in</button></>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
