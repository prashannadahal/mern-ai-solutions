const router = require('express').Router();
const Gallery = require('../models/Gallery');
const { protect } = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const filter = { active: true };
    if (req.query.category && req.query.category !== 'All') filter.category = req.query.category;
    const data = await Gallery.find(filter).sort('order');
    res.json({ success: true, data });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

router.get('/categories', async (req, res) => {
  try {
    const cats = await Gallery.distinct('category', { active: true });
    res.json({ success: true, data: ['All', ...cats] });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

router.post('/',      protect, async (req, res) => { try { const doc = await Gallery.create(req.body); res.status(201).json({ success: true, data: doc }); } catch (e) { res.status(400).json({ success: false, message: e.message }); } });
router.put('/:id',    protect, async (req, res) => { try { const doc = await Gallery.findByIdAndUpdate(req.params.id, req.body, { new: true }); res.json({ success: true, data: doc }); } catch (e) { res.status(400).json({ success: false, message: e.message }); } });
router.delete('/:id', protect, async (req, res) => { try { await Gallery.findByIdAndDelete(req.params.id); res.json({ success: true, message: 'Deleted' }); } catch (e) { res.status(500).json({ success: false, message: e.message }); } });

module.exports = router;
