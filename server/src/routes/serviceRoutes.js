const express = require('express');
const {
    getServices,
    getService,
    createService,
    updateService,
    deleteService
} = require('../controllers/serviceController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/', getServices);
router.get('/:id', getService);
router.post('/', protect, authorize('student', 'admin'), createService);
router.put('/:id', protect, authorize('student', 'admin'), updateService);
router.delete('/:id', protect, authorize('student', 'admin'), deleteService);

module.exports = router;
