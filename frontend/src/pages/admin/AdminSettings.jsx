import { useState } from 'react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export default function AdminSettings() {
  const { user, updateUser } = useAuth();
  const { theme, setTheme } = useTheme();

  const [profileForm, setProfileForm] = useState({ name: user.name });
  const [profileMsg, setProfileMsg] = useState(null);

  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '' });
  const [pwMsg, setPwMsg] = useState(null);

  const saveProfile = async (e) => {
    e.preventDefault();
    setProfileMsg(null);
    try {
      const { data } = await api.put('/users/me', profileForm);
      updateUser(data.user);
      setProfileMsg({ type: 'success', text: 'Profile updated.' });
    } catch (err) {
      setProfileMsg({ type: 'error', text: err.response?.data?.message || 'Could not update.' });
    }
  };

  const savePassword = async (e) => {
    e.preventDefault();
    setPwMsg(null);
    try {
      await api.put('/users/me/password', pwForm);
      setPwMsg({ type: 'success', text: 'Password changed.' });
      setPwForm({ currentPassword: '', newPassword: '' });
    } catch (err) {
      setPwMsg({ type: 'error', text: err.response?.data?.message || 'Could not change password.' });
    }
  };

  return (
    <div>
      <div className="admin-header">
        <div>
          <span className="eyebrow">Account</span>
          <h1>Settings</h1>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 520 }}>
        <form className="admin-form-card" onSubmit={saveProfile}>
          <h3 style={{ marginBottom: 18 }}>Admin profile</h3>
          <div className="field">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              value={profileForm.name}
              onChange={(e) => setProfileForm({ name: e.target.value })}
            />
          </div>
          <div className="field">
            <label>Email</label>
            <input value={user.email} disabled />
          </div>
          {profileMsg && <p className={`admin-inline-msg ${profileMsg.type}`}>{profileMsg.text}</p>}
          <button className="btn btn-primary btn-sm">Save</button>
        </form>

        <div className="admin-form-card">
          <h3 style={{ marginBottom: 18 }}>Appearance</h3>
          <div className="appearance-options">
            <button
              type="button"
              className={`appearance-option ${theme === 'light' ? 'is-active' : ''}`}
              onClick={() => setTheme('light')}
            >
              ☀ Light
            </button>
            <button
              type="button"
              className={`appearance-option ${theme === 'dark' ? 'is-active' : ''}`}
              onClick={() => setTheme('dark')}
            >
              ☾ Dark
            </button>
          </div>
        </div>

        <form className="admin-form-card" onSubmit={savePassword}>
          <h3 style={{ marginBottom: 18 }}>Change password</h3>
          <div className="field">
            <label htmlFor="currentPassword">Current password</label>
            <input
              id="currentPassword"
              type="password"
              required
              value={pwForm.currentPassword}
              onChange={(e) => setPwForm({ ...pwForm, currentPassword: e.target.value })}
            />
          </div>
          <div className="field">
            <label htmlFor="newPassword">New password</label>
            <input
              id="newPassword"
              type="password"
              minLength={6}
              required
              value={pwForm.newPassword}
              onChange={(e) => setPwForm({ ...pwForm, newPassword: e.target.value })}
            />
          </div>
          {pwMsg && <p className={`admin-inline-msg ${pwMsg.type}`}>{pwMsg.text}</p>}
          <button className="btn btn-outline btn-sm">Update password</button>
        </form>
      </div>
    </div>
  );
}
