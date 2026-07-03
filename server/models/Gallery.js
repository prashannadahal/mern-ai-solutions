const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
  title:    { type: String, required: true, trim: true },
  category: { type: String, required: true },
  img:      { type: String, default: '' },
  order:    { type: Number, default: 0 },
  active:   { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Gallery', gallerySchema);
