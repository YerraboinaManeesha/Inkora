const mongoose = require('mongoose');

const LikeSchema = new mongoose.Schema(
  {
    article: { type: mongoose.Schema.Types.ObjectId, ref: 'Article', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

// A user may like a given article only once.
LikeSchema.index({ article: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('Like', LikeSchema);
