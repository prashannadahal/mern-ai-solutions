const mongoose = require('mongoose');

const solutionSchema = new mongoose.Schema({
  title:    { type: String, required: true, trim: true },
  icon:     { type: String, default: '🤖' },
  category: { type: String, required: true },
  tags:     [String],
  desc:     { type: String, required: true },
  full:     { type: String, default: '' },
  features: [String],
  order:    { type: Number, default: 0 },
  active:   { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Solution', solutionSchema);
