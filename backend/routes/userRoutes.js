const express = require('express');
const User = require('../models/User');
const { protect, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Logged-in user's own profile
router.put('/me', protect, async (req, res) => {
  try {
    const { name, bio, avatarColor } = req.body;
    if (name) req.user.name = name;
    if (bio !== undefined) req.user.bio = bio;
    if (avatarColor) req.user.avatarColor = avatarColor;
    await req.user.save();
    res.json({ user: req.user.toSafeObject() });
  } catch (err) {
    res.status(400).json({ message: 'Could not update profile.', error: err.message });
  }
});

router.put('/me/password', protect, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id).select('+password');
    const isMatch = await user.comparePassword(currentPassword || '');
    if (!isMatch) return res.status(400).json({ message: 'Current password is incorrect.' });
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters.' });
    }
    user.password = newPassword;
    await user.save();
    res.json({ message: 'Password updated.' });
  } catch (err) {
    res.status(400).json({ message: 'Could not update password.', error: err.message });
  }
});

// ---- Admin: manage users ----

router.get('/', protect, requireAdmin, async (_req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json({ users: users.map((u) => u.toSafeObject()) });
  } catch (err) {
    res.status(500).json({ message: 'Could not load users.', error: err.message });
  }
});

router.patch('/:id/toggle-active', protect, requireAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found.' });
    if (user.role === 'admin') {
      return res.status(400).json({ message: 'Admin accounts cannot be deactivated here.' });
    }
    user.isActive = !user.isActive;
    await user.save();
    res.json({ user: user.toSafeObject() });
  } catch (err) {
    res.status(500).json({ message: 'Could not update user.', error: err.message });
  }
});

router.delete('/:id', protect, requireAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found.' });
    if (user.role === 'admin') {
      return res.status(400).json({ message: 'Admin accounts cannot be deleted here.' });
    }
    await user.deleteOne();
    res.json({ message: 'User deleted.' });
  } catch (err) {
    res.status(500).json({ message: 'Could not delete user.', error: err.message });
  }
});

module.exports = router;
