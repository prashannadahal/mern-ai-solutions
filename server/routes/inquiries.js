const router  = require('express').Router();
const Inquiry  = require('../models/Inquiry');
const { protect } = require('../middleware/auth');
const nodemailer = require('nodemailer');

// Email helper
async function sendConfirmation(inquiry) {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: Number(process.env.EMAIL_PORT) || 587,
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'AI-Solutions <hello@ai-solutions.co.uk>',
      to: inquiry.email,
      subject: `Thanks for reaching out, ${inquiry.name.split(' ')[0]}! — AI-Solutions`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
          <h2 style="color:#3D3580">We've received your message!</h2>
          <p>Hi <strong>${inquiry.name}</strong>,</p>
          <p>Thank you for contacting AI-Solutions. We've received your enquiry about <em>${inquiry.interest || 'our services'}</em> and will get back to you within <strong>one business day</strong>.</p>
          <hr style="border:1px solid #EDE6D6;margin:24px 0">
          <p style="color:#6B7280;font-size:0.85rem">AI-Solutions Ltd · Sunderland, SR1 1PP · hello@ai-solutions.co.uk</p>
        </div>`,
    });
  } catch (err) {
    console.warn('Email send failed (non-fatal):', err.message);
  }
}

// Public: create inquiry
router.post('/', async (req, res) => {
  try {
    const doc = await Inquiry.create(req.body);
    sendConfirmation(doc); // fire-and-forget
    res.status(201).json({ success: true, data: doc });
  } catch (e) { res.status(400).json({ success: false, message: e.message }); }
});

// Admin only below
router.get('/', protect, async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const filter = status ? { status } : {};
    const total = await Inquiry.countDocuments(filter);
    const data  = await Inquiry.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    res.json({ success: true, data, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

router.put('/:id', protect, async (req, res) => {
  try {
    const doc = await Inquiry.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: doc });
  } catch (e) { res.status(400).json({ success: false, message: e.message }); }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    await Inquiry.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Deleted' });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

module.exports = router;
