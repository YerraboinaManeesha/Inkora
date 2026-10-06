const express = require('express');
const Article = require('../models/Article');
const User = require('../models/User');
const Like = require('../models/Like');
const Comment = require('../models/Comment');
const Category = require('../models/Category');
const { protect, requireAdmin } = require('../middleware/auth');

const router = express.Router();

router.get('/overview', protect, requireAdmin, async (_req, res) => {
  try {
    const [
      totalArticles,
      publishedArticles,
      totalUsers,
      totalLikes,
      totalComments,
      totalCategories,
      recentArticles,
    ] = await Promise.all([
      Article.countDocuments(),
      Article.countDocuments({ status: 'published' }),
      User.countDocuments({ role: 'user' }),
      Like.countDocuments(),
      Comment.countDocuments(),
      Category.countDocuments(),
      Article.find().populate('category', 'name').sort({ createdAt: -1 }).limit(5),
    ]);

    res.json({
      stats: {
        totalArticles,
        publishedArticles,
        unpublishedArticles: totalArticles - publishedArticles,
        totalUsers,
        totalLikes,
        totalComments,
        totalCategories,
      },
      recentArticles,
    });
  } catch (err) {
    res.status(500).json({ message: 'Could not load overview.', error: err.message });
  }
});

module.exports = router;
