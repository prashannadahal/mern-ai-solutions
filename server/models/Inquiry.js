const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema({
  name:       { type: String, required: true, trim: true },
  email:      { type: String, required: true, trim: true, lowercase: true },
  phone:      { type: String, default: '' },
  company:    { type: String, required: true, trim: true },
  country:    { type: String, required: true },
  jobTitle:   { type: String, default: '' },
  jobDetails: { type: String, default: '' },
  interest:   { type: String, default: '' },
  message:    { type: String, required: true },
  joinEvents: { type: Boolean, default: false },
  status:     { type: String, enum: ['New', 'In Progress', 'Completed', 'Closed'], default: 'New' },
  notes:      { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Inquiry', inquirySchema);
