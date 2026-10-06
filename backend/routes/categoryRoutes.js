const express = require('express');
const Category = require('../models/Category');
const Article = require('../models/Article');
const { protect, requireAdmin } = require('../middleware/auth');

const router = express.Router();

router.get('/', async (_req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.json({ categories });
  } catch (err) {
    res.status(500).json({ message: 'Could not load categories.', error: err.message });
  }
});

router.post('/', protect, requireAdmin, async (req, res) => {
  try {
    const category = await Category.create({
      name: req.body.name,
      description: req.body.description || '',
    });
    res.status(201).json({ category });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: 'A category with this name already exists.' });
    }
    res.status(400).json({ message: 'Could not create category.', error: err.message });
  }
});

router.put('/:id', protect, requireAdmin, async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { name: req.body.name, description: req.body.description },
      { new: true, runValidators: true }
    );
    if (!category) return res.status(404).json({ message: 'Category not found.' });
    res.json({ category });
  } catch (err) {
    res.status(400).json({ message: 'Could not update category.', error: err.message });
  }
});

router.delete('/:id', protect, requireAdmin, async (req, res) => {
  try {
    const inUse = await Article.countDocuments({ category: req.params.id });
    if (inUse > 0) {
      return res.status(400).json({
        message: `Cannot delete — ${inUse} article(s) still use this category.`,
      });
    }
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found.' });
    res.json({ message: 'Category deleted.' });
  } catch (err) {
    res.status(500).json({ message: 'Could not delete category.', error: err.message });
  }
});

module.exports = router;
