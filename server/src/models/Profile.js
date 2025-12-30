const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    bio: {
        type: String,
        required: true
    },
    skills: {
        type: [String],
        required: true
    },
    portfolio: [
        {
            title: String,
            url: String, // Project link or image URL
            description: String
        }
    ],
    rating: {
        type: Number,
        min: 0,
        max: 5,
        default: 0
    },
    numReviews: {
        type: Number,
        default: 0
    },
    hourlyRate: {
        type: Number
        // Optional if services are fixed price
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    socials: {
        linkedin: String,
        github: String,
        website: String
    }
});

module.exports = mongoose.model('Profile', ProfileSchema);
