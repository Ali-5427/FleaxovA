const express = require('express');
const {
    getNotifications,
    markAsRead,
    markAllRead
} = require('../controllers/notificationController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.get('/', getNotifications);
router.put('/readall', markAllRead);
router.put('/:id', markAsRead);

module.exports = router;
