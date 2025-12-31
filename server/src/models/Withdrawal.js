const mongoose = require('mongoose');

const WithdrawalSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    amount: {
        type: Number,
        required: [true, 'Please add an amount'],
        min: [100, 'Minimum withdrawal is ₹100']
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    paymentMethod: {
        type: String,
        enum: ['UPI', 'Bank'],
        required: true
    },
    paymentDetails: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Withdrawal', WithdrawalSchema);
