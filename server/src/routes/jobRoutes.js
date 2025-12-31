const express = require('express');
const {
    getJobs,
    getJob,
    createJob,
    updateJob,
    deleteJob
} = require('../controllers/jobController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/', getJobs);
router.get('/:id', getJob);
router.post('/', protect, authorize('client', 'admin'), createJob);
router.put('/:id', protect, updateJob);
router.delete('/:id', protect, deleteJob);

module.exports = router;
