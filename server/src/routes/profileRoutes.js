const express = require('express');
const { getMyProfile, updateProfile, getProfiles } = require('../controllers/profileController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/', getProfiles);
router.get('/me', protect, getMyProfile);
router.post('/', protect, updateProfile);

module.exports = router;
