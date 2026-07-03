const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  title:    { type: String, required: true, trim: true },
  category: { type: String, required: true },
  author:   { type: String, required: true },
  thumb:    { type: String, default: '' },
  excerpt:  { type: String, required: true },
  full:     { type: String, default: '' },
  tags:     [String],
  published:{ type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Article', articleSchema);
