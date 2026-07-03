const router = require('express').Router();
const Testimonial = require('../models/Testimonial');
const { protect } = require('../middleware/auth');

router.get('/',       async (req, res) => { try { const data = await Testimonial.find({ active: true }).sort({ createdAt: -1 }); res.json({ success: true, data }); } catch (e) { res.status(500).json({ success: false, message: e.message }); } });
router.post('/',      protect, async (req, res) => { try { const doc = await Testimonial.create(req.body); res.status(201).json({ success: true, data: doc }); } catch (e) { res.status(400).json({ success: false, message: e.message }); } });
router.put('/:id',    protect, async (req, res) => { try { const doc = await Testimonial.findByIdAndUpdate(req.params.id, req.body, { new: true }); res.json({ success: true, data: doc }); } catch (e) { res.status(400).json({ success: false, message: e.message }); } });
router.delete('/:id', protect, async (req, res) => { try { await Testimonial.findByIdAndDelete(req.params.id); res.json({ success: true, message: 'Deleted' }); } catch (e) { res.status(500).json({ success: false, message: e.message }); } });

module.exports = router;
