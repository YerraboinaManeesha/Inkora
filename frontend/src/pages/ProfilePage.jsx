import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import './ProfilePage.css';

const SWATCHES = ['#7A2E4A', '#B85C73', '#3A1128', '#5C7285', '#6E8B3D', '#A2402F'];

export default function ProfilePage() {
  const { user, updateUser, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();

  const [profileForm, setProfileForm] = useState({ name: user.name, bio: user.bio || '' });
  const [avatarColor, setAvatarColor] = useState(user.avatarColor || SWATCHES[0]);
  const [profileMsg, setProfileMsg] = useState('');
  const [profileSaving, setProfileSaving] = useState(false);

  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '' });
  const [pwMsg, setPwMsg] = useState('');
  const [pwSaving, setPwSaving] = useState(false);

  const saveProfile = async (e) => {
    e.preventDefault();
    setProfileSaving(true);
    setProfileMsg('');
    try {
      const { data } = await api.put('/users/me', { ...profileForm, avatarColor });
      updateUser(data.user);
      setProfileMsg('Profile updated.');
    } catch (err) {
      setProfileMsg(err.response?.data?.message || 'Could not update profile.');
    } finally {
      setProfileSaving(false);
    }
  };

  const savePassword = async (e) => {
    e.preventDefault();
    setPwSaving(true);
    setPwMsg('');
    try {
      await api.put('/users/me/password', pwForm);
      setPwMsg('Password changed.');
      setPwForm({ currentPassword: '', newPassword: '' });
    } catch (err) {
      setPwMsg(err.response?.data?.message || 'Could not change password.');
    } finally {
      setPwSaving(false);
    }
  };

  return (
    <div className="container profile-page">
      <span className="eyebrow">Your account</span>
      <h1>Profile &amp; Settings</h1>

      <div className="profile-grid">
        <section className="profile-card">
          <h3>Profile</h3>
          <form onSubmit={saveProfile}>
            <div className="field">
              <label htmlFor="name">Name</label>
              <input
                id="name"
                value={profileForm.name}
                onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
              />
            </div>
            <div className="field">
              <label htmlFor="bio">Bio</label>
              <textarea
                id="bio"
                rows={3}
                maxLength={300}
                value={profileForm.bio}
                onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
              />
            </div>
            <div className="field">
              <label>Avatar color</label>
              <div className="swatches">
                {SWATCHES.map((c) => (
                  <button
                    type="button"
                    key={c}
                    className={`swatch ${avatarColor === c ? 'is-active' : ''}`}
                    style={{ background: c }}
                    onClick={() => setAvatarColor(c)}
                    aria-label={`Choose color ${c}`}
                  />
                ))}
              </div>
            </div>
            {profileMsg && <p className="profile-msg">{profileMsg}</p>}
            <button className="btn btn-primary btn-sm" disabled={profileSaving}>
              {profileSaving ? 'Saving…' : 'Save profile'}
            </button>
          </form>
        </section>

        <section className="profile-card">
          <h3>Appearance</h3>
          <p className="profile-card-hint">Choose how Inkora looks on this device.</p>
          <div className="appearance-options">
            <button
              className={`appearance-option ${theme === 'light' ? 'is-active' : ''}`}
              onClick={() => setTheme('light')}
            >
              ☀ Light
            </button>
            <button
              className={`appearance-option ${theme === 'dark' ? 'is-active' : ''}`}
              onClick={() => setTheme('dark')}
            >
              ☾ Dark
            </button>
          </div>
        </section>

        <section className="profile-card">
          <h3>Change password</h3>
          <form onSubmit={savePassword}>
            <div className="field">
              <label htmlFor="currentPassword">Current password</label>
              <input
                id="currentPassword"
                type="password"
                value={pwForm.currentPassword}
                onChange={(e) => setPwForm({ ...pwForm, currentPassword: e.target.value })}
                required
              />
            </div>
            <div className="field">
              <label htmlFor="newPassword">New password</label>
              <input
                id="newPassword"
                type="password"
                minLength={6}
                value={pwForm.newPassword}
                onChange={(e) => setPwForm({ ...pwForm, newPassword: e.target.value })}
                required
              />
            </div>
            {pwMsg && <p className="profile-msg">{pwMsg}</p>}
            <button className="btn btn-outline btn-sm" disabled={pwSaving}>
              {pwSaving ? 'Updating…' : 'Update password'}
            </button>
          </form>
        </section>

        <section className="profile-card">
          <h3>Session</h3>
          <p className="profile-card-hint">
            Signed in as {user.name} ({user.email}).
          </p>
          <button className="btn btn-danger btn-sm" onClick={() => { logout(); navigate('/'); }}>
            Log out
          </button>
        </section>
      </div>
    </div>
  );
}