const express = require('express');
const {
    applyToJob,
    getApplications,
    getJobApplications,
    updateApplicationStatus
} = require('../controllers/applicationController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.post('/', authorize('student', 'admin'), applyToJob);
router.get('/', getApplications);
router.get('/job/:jobId', getJobApplications);
router.put('/:id', updateApplicationStatus);

module.exports = router;
