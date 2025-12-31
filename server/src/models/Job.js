const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: [true, 'Please add a job title'],
        trim: true,
        maxlength: [100, 'Title cannot be more than 100 characters']
    },
    description: {
        type: String,
        required: [true, 'Please add a description'],
        maxlength: [2000, 'Description cannot be more than 2000 characters']
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
    budget: {
        type: Number,
        required: [true, 'Please add a budget']
    },
    deadline: {
        type: Number, // In days
        required: [true, 'Please add estimated deadline in days']
    },
    status: {
        type: String,
        enum: ['open', 'assigned', 'completed', 'cancelled'],
        default: 'open'
    },
    assignedFreelancer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Job', JobSchema);
