const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { protect } = require('../middleware/auth');

// Hardcoded admin for demo — replace with DB users in production
const ADMIN = {
  email: process.env.ADMIN_EMAIL || 'admin@ai-solutions.co.uk',
  password: process.env.ADMIN_PASSWORD || 'admin123',
  name: 'Admin User',
  role: 'admin',
};

const sign = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET || 'fallback_secret', {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ success: false, message: 'Email and password required' });

  if (
    email.toLowerCase() !== ADMIN.email.toLowerCase() ||
    password !== ADMIN.password
  ) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }

  const token = sign({ email: ADMIN.email, role: 'admin', name: ADMIN.name });
  res.json({ success: true, token, user: { email: ADMIN.email, name: ADMIN.name, role: 'admin' } });
});

// GET /api/auth/me  (protected)
router.get('/me', protect, (req, res) => {
  res.json({ success: true, user: req.user });
});

module.exports = router;
