const router   = require('express').Router();
const Inquiry   = require('../models/Inquiry');
const Article   = require('../models/Article');
const Gallery   = require('../models/Gallery');
const Testimonial = require('../models/Testimonial');
const Solution  = require('../models/Solution');
const { protect } = require('../middleware/auth');

router.get('/overview', protect, async (req, res) => {
  try {
    const [inquiries, articles, gallery, testimonials, solutions] = await Promise.all([
      Inquiry.countDocuments(),
      Article.countDocuments({ published: true }),
      Gallery.countDocuments({ active: true }),
      Testimonial.countDocuments({ active: true }),
      Solution.countDocuments({ active: true }),
    ]);

    const statusBreakdown = await Inquiry.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    const monthlyInquiries = await Inquiry.aggregate([
      {
        $group: {
          _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
      { $limit: 7 },
    ]);

    const countryBreakdown = await Inquiry.aggregate([
      { $group: { _id: '$country', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 6 },
    ]);

    const interestBreakdown = await Inquiry.aggregate([
      { $match: { interest: { $ne: '' } } },
      { $group: { _id: '$interest', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 6 },
    ]);

    res.json({
      success: true,
      data: {
        counts: { inquiries, articles, gallery, testimonials, solutions },
        statusBreakdown,
        monthlyInquiries,
        countryBreakdown,
        interestBreakdown,
      },
    });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});

module.exports = router;
