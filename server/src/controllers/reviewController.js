const Review = require('../models/Review');
const Order = require('../models/Order');
const Service = require('../models/Service');
const Profile = require('../models/Profile');

// @desc    Add a review
// @route   POST /api/reviews
// @access  Private (Client only)
exports.addReview = async (req, res, next) => {
    try {
        const { orderId, rating, comment } = req.body;

        // 1. Validate Order exists and belongs to user
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        if (order.client.toString() !== req.user.id) {
            return res.status(401).json({ success: false, message: 'Not authorized to review this order' });
        }

        if (order.status !== 'completed' && order.status !== 'delivered') {
            // Depending on logic, maybe only 'completed' orders can be reviewed
            // For MVP we allow delivered
        }

        // 2. Create Review
        const review = await Review.create({
            order: orderId,
            service: order.service,
            reviewer: req.user.id,
            freelancer: order.freelancer,
            rating,
            comment
        });

        // 3. Update Service average rating (Aggregation) (Simplified for MVP)
        // In production, use MongoDB Aggregation pipeline. 
        // Here we will just quick-patch the profile stats.

        // Find Freelancer Profile
        const profile = await Profile.findOne({ user: order.freelancer });
        if (profile) {
            const totalRating = (profile.rating * profile.numReviews) + rating;
            const newNumReviews = profile.numReviews + 1;
            profile.rating = totalRating / newNumReviews;
            profile.numReviews = newNumReviews;
            await profile.save();
        }

        res.status(201).json({
            success: true,
            data: review
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get reviews for a service
// @route   GET /api/reviews/service/:serviceId
// @access  Public
exports.getServiceReviews = async (req, res, next) => {
    try {
        const reviews = await Review.find({ service: req.params.serviceId })
            .populate('reviewer', 'name')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: reviews.length,
            data: reviews
        });
    } catch (err) {
        next(err);
    }
};
