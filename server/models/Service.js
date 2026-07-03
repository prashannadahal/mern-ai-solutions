const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  title:    { type: String, required: true, trim: true },
  icon:     { type: String, default: 'fa-star' },
  tag:      { type: String, default: '' },
  tagType:  { type: String, default: 'tag-indigo' },
  desc:     { type: String, required: true },
  features: [[String]],  // [[label, icon], ...]
  order:    { type: Number, default: 0 },
  active:   { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Service', serviceSchema);
