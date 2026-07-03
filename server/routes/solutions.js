const router = require('express').Router();
const Solution = require('../models/Solution');
const { protect } = require('../middleware/auth');

router.get('/',    async (req, res) => { try { const data = await Solution.find({ active: true }).sort('order'); res.json({ success: true, data }); } catch (e) { res.status(500).json({ success: false, message: e.message }); } });
router.post('/',   protect, async (req, res) => { try { const doc = await Solution.create(req.body); res.status(201).json({ success: true, data: doc }); } catch (e) { res.status(400).json({ success: false, message: e.message }); } });
router.put('/:id', protect, async (req, res) => { try { const doc = await Solution.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }); if (!doc) return res.status(404).json({ success: false, message: 'Not found' }); res.json({ success: true, data: doc }); } catch (e) { res.status(400).json({ success: false, message: e.message }); } });
router.delete('/:id', protect, async (req, res) => { try { await Solution.findByIdAndDelete(req.params.id); res.json({ success: true, message: 'Deleted' }); } catch (e) { res.status(500).json({ success: false, message: e.message }); } });

module.exports = router;
