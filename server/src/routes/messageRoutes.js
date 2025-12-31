const express = require('express');
const {
    sendMessage,
    getMessages,
    getConversations
} = require('../controllers/messageController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.get('/conversations', getConversations);
router.post('/', sendMessage);
router.get('/:userId', getMessages);

module.exports = router;
