const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema({
  name:    { type: String, required: true, trim: true },
  role:    { type: String, default: '' },
  company: { type: String, default: '' },
  rating:  { type: Number, min: 1, max: 5, default: 5 },
  text:    { type: String, required: true },
  active:  { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Testimonial', testimonialSchema);
