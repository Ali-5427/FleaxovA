const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema({
    job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
        required: true
    },
    freelancer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    coverLetter: {
        type: String,
        required: [true, 'Please add a cover letter'],
        maxlength: [3000, 'Cover letter cannot be more than 3000 characters']
    },
    bidAmount: {
        type: Number,
        required: [true, 'Please add a bid amount']
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected', 'withdrawn'],
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Prevent user from applying multiple times to the same job
ApplicationSchema.index({ job: 1, freelancer: 1 }, { unique: true });

module.exports = mongoose.model('Application', ApplicationSchema);
