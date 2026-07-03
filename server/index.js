const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env.example') });

const app = express();

// ─── Middleware ────────────────────────────────────────────
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:3000', credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ─── Routes ───────────────────────────────────────────────
app.use('/api/auth',         require('./routes/auth'));
app.use('/api/solutions',    require('./routes/solutions'));
app.use('/api/services',     require('./routes/services'));
app.use('/api/articles',     require('./routes/articles'));
app.use('/api/gallery',      require('./routes/gallery'));
app.use('/api/testimonials', require('./routes/testimonials'));
app.use('/api/inquiries',    require('./routes/inquiries'));
app.use('/api/ai',           require('./routes/ai'));
app.use('/api/analytics',    require('./routes/analytics'));

// ─── Health check ─────────────────────────────────────────
app.get('/api/health', (req, res) => res.json({ status: 'ok', time: new Date() }));

// ─── Serve React in production ────────────────────────────
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
  app.get('*', (req, res) =>
    res.sendFile(path.join(__dirname, '../client/build/index.html'))
  );
}

// ─── MongoDB + Start ──────────────────────────────────────
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ai-solutions')
  .then(async () => {
    console.log('✅ MongoDB connected');
    // Seed initial data if DB is empty
    await require('./utils/seed')();
    app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    console.log('📌 Starting server without DB for demo purposes...');
    app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT} (no DB)`));
  });

module.exports = app;
