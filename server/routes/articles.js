const router = require('express').Router();
const Article = require('../models/Article');
const { protect } = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const filter = { published: true };
    if (req.query.category && req.query.category !== 'All') filter.category = req.query.category;
    const data = await Article.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, data });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

router.get('/categories', async (req, res) => {
  try {
    const cats = await Article.distinct('category', { published: true });
    res.json({ success: true, data: ['All', ...cats] });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

router.get('/:id', async (req, res) => {
  try {
    const doc = await Article.findById(req.params.id);
    if (!doc) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: doc });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

router.post('/',      protect, async (req, res) => { try { const doc = await Article.create(req.body); res.status(201).json({ success: true, data: doc }); } catch (e) { res.status(400).json({ success: false, message: e.message }); } });
router.put('/:id',    protect, async (req, res) => { try { const doc = await Article.findByIdAndUpdate(req.params.id, req.body, { new: true }); res.json({ success: true, data: doc }); } catch (e) { res.status(400).json({ success: false, message: e.message }); } });
router.delete('/:id', protect, async (req, res) => { try { await Article.findByIdAndDelete(req.params.id); res.json({ success: true, message: 'Deleted' }); } catch (e) { res.status(500).json({ success: false, message: e.message }); } });

module.exports = router;
