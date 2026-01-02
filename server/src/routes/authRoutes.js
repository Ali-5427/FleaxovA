const express = require('express');
const {
    register,
    login,
    verifyEmail,
    getMe,
    forgotPassword,
    getUsers,
    updateUserDetails
} = require('../controllers/authController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.post('/register', register);
router.post('/verify-email', verifyEmail);
router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/updatedetails', protect, updateUserDetails);
router.get('/users', protect, authorize('admin'), getUsers);
router.post('/forgot-password', forgotPassword);

module.exports = router;
