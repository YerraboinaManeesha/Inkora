const mongoose = require('mongoose');
const slugify = require('slugify');

const ArticleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 160 },
    slug: { type: String, unique: true },
    shortDescription: { type: String, required: true, maxlength: 280 },
    content: { type: String, required: true },
    coverImage: { type: String, default: '' },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    // Author is a free-text name, since articles can be attributed to
    // people who are not registered Inkora users.
    authorName: { type: String, required: true, trim: true },
    tags: [{ type: String, trim: true }],
    status: {
      type: String,
      enum: ['published', 'unpublished'],
      default: 'unpublished',
    },
    publishedAt: { type: Date, default: null },
    likeCount: { type: Number, default: 0 },
    commentCount: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

ArticleSchema.pre('validate', function setSlug(next) {
  if (this.isModified('title') || !this.slug) {
    this.slug =
      slugify(this.title || '', { lower: true, strict: true }) +
      '-' +
      Math.random().toString(36).slice(2, 7);
  }
  next();
});

ArticleSchema.index({ title: 'text', shortDescription: 'text', tags: 'text' });

module.exports = mongoose.model('Article', ArticleSchema);
