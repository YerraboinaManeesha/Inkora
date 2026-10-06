const express = require('express');
const Article = require('../models/Article');
const Like = require('../models/Like');
const Comment = require('../models/Comment');
const { protect, requireAdmin, attachUserIfPresent } = require('../middleware/auth');

const router = express.Router();

// GET /api/articles — public list with search + category filter.
// Non-admins only ever see published articles.
router.get('/', attachUserIfPresent, async (req, res) => {
  try {
    const { search, category, status, page = 1, limit = 9 } = req.query;
    const query = {};

    const isAdminViewing = req.user && req.user.role === 'admin';
    if (isAdminViewing && status) {
      query.status = status;
    } else if (!isAdminViewing) {
      query.status = 'published';
    }

    if (category) query.category = category;
    if (search) query.$text = { $search: search };

    const skip = (Number(page) - 1) * Number(limit);

    const [articles, total] = await Promise.all([
      Article.find(query)
        .populate('category', 'name slug')
        .sort({ publishedAt: -1, createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Article.countDocuments(query),
    ]);

    res.json({ articles, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: 'Could not load articles.', error: err.message });
  }
});

// GET /api/articles/featured — most-liked published article
router.get('/featured', async (_req, res) => {
  try {
    const featured = await Article.findOne({ status: 'published' })
      .populate('category', 'name slug')
      .sort({ likeCount: -1, publishedAt: -1 });
    res.json({ article: featured });
  } catch (err) {
    res.status(500).json({ message: 'Could not load featured article.', error: err.message });
  }
});

// GET /api/articles/slug/:slug — full article + whether current user liked it
router.get('/slug/:slug', attachUserIfPresent, async (req, res) => {
  try {
    const article = await Article.findOne({ slug: req.params.slug }).populate('category', 'name slug');
    if (!article) return res.status(404).json({ message: 'Article not found.' });

    const isAdminViewing = req.user && req.user.role === 'admin';
    if (article.status !== 'published' && !isAdminViewing) {
      return res.status(404).json({ message: 'Article not found.' });
    }

    if (!isAdminViewing) {
      article.views += 1;
      await article.save();
    }

    let likedByMe = false;
    if (req.user) {
      likedByMe = !!(await Like.findOne({ article: article._id, user: req.user._id }));
    }

    res.json({ article, likedByMe });
  } catch (err) {
    res.status(500).json({ message: 'Could not load article.', error: err.message });
  }
});

// ---- Admin-only article management ----

router.post('/', protect, requireAdmin, async (req, res) => {
  try {
    const {
      title,
      shortDescription,
      content,
      coverImage,
      category,
      authorName,
      tags,
      status,
    } = req.body;

    const article = await Article.create({
      title,
      shortDescription,
      content,
      coverImage,
      category,
      authorName,
      tags: Array.isArray(tags) ? tags : String(tags || '').split(',').map((t) => t.trim()).filter(Boolean),
      status: status === 'published' ? 'published' : 'unpublished',
      publishedAt: status === 'published' ? new Date() : null,
      createdBy: req.user._id,
    });

    res.status(201).json({ article });
  } catch (err) {
    res.status(400).json({ message: 'Could not create article.', error: err.message });
  }
});

router.put('/:id', protect, requireAdmin, async (req, res) => {
  try {
    const updates = { ...req.body };
    if (Array.isArray(updates.tags) === false && updates.tags !== undefined) {
      updates.tags = String(updates.tags).split(',').map((t) => t.trim()).filter(Boolean);
    }

    const existing = await Article.findById(req.params.id);
    if (!existing) return res.status(404).json({ message: 'Article not found.' });

    if (updates.status === 'published' && existing.status !== 'published') {
      updates.publishedAt = new Date();
    }

    Object.assign(existing, updates);
    await existing.save();

    res.json({ article: existing });
  } catch (err) {
    res.status(400).json({ message: 'Could not update article.', error: err.message });
  }
});

router.patch('/:id/publish', protect, requireAdmin, async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ message: 'Article not found.' });

    article.status = article.status === 'published' ? 'unpublished' : 'published';
    if (article.status === 'published' && !article.publishedAt) {
      article.publishedAt = new Date();
    }
    await article.save();

    res.json({ article });
  } catch (err) {
    res.status(400).json({ message: 'Could not update publish status.', error: err.message });
  }
});

router.delete('/:id', protect, requireAdmin, async (req, res) => {
  try {
    const article = await Article.findByIdAndDelete(req.params.id);
    if (!article) return res.status(404).json({ message: 'Article not found.' });

    await Promise.all([
      Like.deleteMany({ article: article._id }),
      Comment.deleteMany({ article: article._id }),
    ]);

    res.json({ message: 'Article deleted.' });
  } catch (err) {
    res.status(500).json({ message: 'Could not delete article.', error: err.message });
  }
});

module.exports = router;
