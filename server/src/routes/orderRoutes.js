const express = require('express');
const { createOrder, getOrders, updateOrderStatus } = require('../controllers/orderController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect); // All routes protected

router.post('/', createOrder);
router.get('/', getOrders);
router.put('/:id/status', updateOrderStatus);

module.exports = router;
