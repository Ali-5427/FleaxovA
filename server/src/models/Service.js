const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema({
    freelancer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: [true, 'Please add a service title'],
        trim: true,
        maxlength: [100, 'Title cannot be more than 100 characters']
    },
    description: {
        type: String,
        required: [true, 'Please add a description'],
        maxlength: [1000, 'Description cannot be more than 1000 characters']
    },
    category: {
        type: String,
        required: [true, 'Please select a category'],
        enum: [
            'Development',
            'Design',
            'Writing',
            'Marketing',
            'Business',
            'Video & Animation',
            'AI Services',
            'Other'
        ]
    },
    price: {
        type: Number,
        required: [true, 'Please add a price']
        // Platform rule: Must be Paid. Validation > 0
    },
    deliveryTime: {
        type: Number, // In days
        required: [true, 'Please add estimated delivery time in days']
    },
    coverImage: {
        type: String,
        default: 'no-photo.jpg'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Service', ServiceSchema);
