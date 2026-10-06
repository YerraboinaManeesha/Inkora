const express = require('express');
const Comment = require('../models/Comment');
const Reply = require('../models/Reply');
const Article = require('../models/Article');
const { protect, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Public: list comments for an article, each with its admin reply (if any)
router.get('/article/:articleId', async (req, res) => {
  try {
    const comments = await Comment.find({ article: req.params.articleId })
      .populate('user', 'name avatarColor')
      .sort({ createdAt: 1 });

    const commentIds = comments.map((c) => c._id);
    const replies = await Reply.find({ comment: { $in: commentIds } }).populate('admin', 'name');

    const repliesByComment = {};
    replies.forEach((r) => {
      repliesByComment[r.comment.toString()] = r;
    });

    const withReplies = comments.map((c) => ({
      ...c.toObject(),
      reply: repliesByComment[c._id.toString()] || null,
    }));

    res.json({ comments: withReplies });
  } catch (err) {
    res.status(500).json({ message: 'Could not load comments.', error: err.message });
  }
});

router.post('/article/:articleId', protect, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ message: 'Comment cannot be empty.' });
    }

    const article = await Article.findById(req.params.articleId);
    if (!article) return res.status(404).json({ message: 'Article not found.' });

    const comment = await Comment.create({
      article: article._id,
      user: req.user._id,
      text: text.trim(),
    });

    article.commentCount += 1;
    await article.save();

    const populated = await comment.populate('user', 'name avatarColor');
    res.status(201).json({ comment: { ...populated.toObject(), reply: null } });
  } catch (err) {
    res.status(500).json({ message: 'Could not post comment.', error: err.message });
  }
});

// Users may delete only their own comment. Admins may delete any comment.
router.delete('/:id', protect, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: 'Comment not found.' });

    const isOwner = comment.user.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'You can only delete your own comments.' });
    }

    await Reply.deleteMany({ comment: comment._id });
    await comment.deleteOne();

    await Article.findByIdAndUpdate(comment.article, { $inc: { commentCount: -1 } });

    res.json({ message: 'Comment deleted.' });
  } catch (err) {
    res.status(500).json({ message: 'Could not delete comment.', error: err.message });
  }
});

// Admin: reply to a comment
router.post('/:id/reply', protect, requireAdmin, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ message: 'Reply cannot be empty.' });
    }

    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: 'Comment not found.' });

    let reply = await Reply.findOne({ comment: comment._id });
    if (reply) {
      reply.text = text.trim();
      reply.admin = req.user._id;
      await reply.save();
    } else {
      reply = await Reply.create({ comment: comment._id, admin: req.user._id, text: text.trim() });
    }

    const populated = await reply.populate('admin', 'name');
    res.status(201).json({ reply: populated });
  } catch (err) {
    res.status(500).json({ message: 'Could not post reply.', error: err.message });
  }
});

router.delete('/:id/reply', protect, requireAdmin, async (req, res) => {
  try {
    await Reply.findOneAndDelete({ comment: req.params.id });
    res.json({ message: 'Reply deleted.' });
  } catch (err) {
    res.status(500).json({ message: 'Could not delete reply.', error: err.message });
  }
});

// Admin: full comment moderation list
router.get('/', protect, requireAdmin, async (_req, res) => {
  try {
    const comments = await Comment.find()
      .populate('user', 'name email')
      .populate('article', 'title slug')
      .sort({ createdAt: -1 })
      .limit(200);

    const commentIds = comments.map((c) => c._id);
    const replies = await Reply.find({ comment: { $in: commentIds } });
    const repliesByComment = {};
    replies.forEach((r) => {
      repliesByComment[r.comment.toString()] = r;
    });

    const withReplies = comments.map((c) => ({
      ...c.toObject(),
      reply: repliesByComment[c._id.toString()] || null,
    }));

    res.json({ comments: withReplies });
  } catch (err) {
    res.status(500).json({ message: 'Could not load comments.', error: err.message });
  }
});

module.exports = router;
