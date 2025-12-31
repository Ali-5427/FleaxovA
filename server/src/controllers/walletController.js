const supabase = require('../config/supabase');
const { createNotification } = require('./notificationController');

// @desc    Request withdrawal
// @route   POST /api/wallet/withdraw
// @access  Private (Student)
exports.requestWithdrawal = async (req, res, next) => {
    try {
        const { amount, paymentMethod, paymentDetails } = req.body;

        const { data: user, error: userError } = await supabase
            .from('users')
            .select('wallet_balance')
            .eq('id', req.user.id)
            .single();

        if (userError || !user) return res.status(404).json({ success: false, message: 'User not found' });
        if (user.wallet_balance < amount) return res.status(400).json({ success: false, message: 'Insufficient balance' });

        const { data: withdrawal, error: wError } = await supabase
            .from('withdrawals')
            .insert({
                user_id: req.user.id,
                amount,
                payment_method: paymentMethod,
                payment_details: paymentDetails
            })
            .select()
            .single();

        if (wError) throw wError;

        // Deduct from balance
        await supabase
            .from('users')
            .update({ wallet_balance: user.wallet_balance - amount })
            .eq('id', req.user.id);

        await createNotification(
            req.user.id,
            null,
            'payment',
            `Withdrawal request for ₹${amount} submitted.`,
            '/dashboard'
        );

        res.status(201).json({ success: true, data: withdrawal });
    } catch (err) {
        next(err);
    }
};

// @desc    Get user withdrawals
exports.getWithdrawals = async (req, res, next) => {
    try {
        const { data: withdrawals, error } = await supabase
            .from('withdrawals')
            .select('*')
            .eq('user_id', req.user.id)
            .order('created_at', { ascending: false });

        if (error) throw error;
        res.status(200).json({ success: true, count: withdrawals.length, data: withdrawals });
    } catch (err) {
        next(err);
    }
};

// @desc    Get wallet balance
exports.getBalance = async (req, res, next) => {
    try {
        const { data: user, error } = await supabase
            .from('users')
            .select('wallet_balance')
            .eq('id', req.user.id)
            .single();

        if (error) throw error;

        res.status(200).json({
            success: true,
            data: { balance: user.wallet_balance }
        });
    } catch (err) {
        next(err);
    }
};
