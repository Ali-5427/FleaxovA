const express = require('express');
const { addReview, getServiceReviews } = require('../controllers/reviewController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.post('/', protect, authorize('client'), addReview);
router.get('/service/:serviceId', getServiceReviews);

module.exports = router;
