const supabase = require('../config/supabase');

// @desc    Add a review
// @route   POST /api/reviews
// @access  Private (Client only)
exports.addReview = async (req, res, next) => {
    try {
        const { orderId, rating, comment } = req.body;

        const { data: order, error: oError } = await supabase
            .from('orders')
            .select('*')
            .eq('id', orderId)
            .single();

        if (oError || !order) return res.status(404).json({ success: false, message: 'Order not found' });
        if (order.client_id !== req.user.id) return res.status(401).json({ success: false, message: 'Not authorized' });

        const { data: review, error: rError } = await supabase
            .from('reviews')
            .insert({
                service_id: order.service_id,
                reviewer_id: req.user.id,
                rating,
                comment
            })
            .select()
            .single();

        if (rError) throw rError;

        // Update profile rating (Simplified)
        const { data: profile } = await supabase.from('profiles').select('*').eq('user_id', order.freelancer_id).single();
        if (profile) {
            const numReviews = (profile.num_reviews || 0) + 1;
            const newRating = ((profile.rating || 0) * (profile.num_reviews || 0) + rating) / numReviews;

            await supabase
                .from('profiles')
                .update({ rating: newRating, num_reviews: numReviews })
                .eq('user_id', order.freelancer_id);
        }

        res.status(201).json({ success: true, data: review });
    } catch (err) {
        next(err);
    }
};

// @desc    Get reviews for a service
exports.getServiceReviews = async (req, res, next) => {
    try {
        const { data: reviews, error } = await supabase
            .from('reviews')
            .select('*, reviewer:users(name)')
            .eq('service_id', req.params.serviceId)
            .order('created_at', { ascending: false });

        if (error) throw error;
        res.status(200).json({ success: true, count: reviews.length, data: reviews });
    } catch (err) {
        next(err);
    }
};
