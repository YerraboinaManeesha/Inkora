const express = require('express');
const Like = require('../models/Like');
const Article = require('../models/Article');
const { protect, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Toggle like/unlike for the logged-in user. A user can like an
// article only once, enforced both here and by the unique DB index.
router.post('/:articleId', protect, async (req, res) => {
  try {
    const { articleId } = req.params;
    const article = await Article.findById(articleId);
    if (!article) return res.status(404).json({ message: 'Article not found.' });

    const existing = await Like.findOne({ article: articleId, user: req.user._id });

    if (existing) {
      await existing.deleteOne();
      article.likeCount = Math.max(0, article.likeCount - 1);
      await article.save();
      return res.json({ liked: false, likeCount: article.likeCount });
    }

    await Like.create({ article: articleId, user: req.user._id });
    article.likeCount += 1;
    await article.save();
    res.json({ liked: true, likeCount: article.likeCount });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: 'You already liked this article.' });
    }
    res.status(500).json({ message: 'Could not update like.', error: err.message });
  }
});

// Admin: see who liked a given article
router.get('/article/:articleId', protect, requireAdmin, async (req, res) => {
  try {
    const likes = await Like.find({ article: req.params.articleId })
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    res.json({ likes });
  } catch (err) {
    res.status(500).json({ message: 'Could not load likes.', error: err.message });
  }
});

// Admin: all likes across the platform (for the Likes dashboard tab)
router.get('/', protect, requireAdmin, async (_req, res) => {
  try {
    const likes = await Like.find()
      .populate('user', 'name email')
      .populate('article', 'title slug')
      .sort({ createdAt: -1 })
      .limit(200);
    res.json({ likes });
  } catch (err) {
    res.status(500).json({ message: 'Could not load likes.', error: err.message });
  }
});

module.exports = router;
