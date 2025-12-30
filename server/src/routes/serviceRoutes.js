const express = require('express');
const { getServices, createService } = require('../controllers/serviceController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/', getServices);
router.post('/', protect, authorize('student', 'admin'), createService);

module.exports = router;
