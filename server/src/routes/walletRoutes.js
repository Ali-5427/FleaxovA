const express = require('express');
const {
    requestWithdrawal,
    getWithdrawals,
    getBalance
} = require('../controllers/walletController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.get('/balance', getBalance);
router.post('/withdraw', requestWithdrawal);
router.get('/withdrawals', getWithdrawals);

module.exports = router;
