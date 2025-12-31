const supabase = require('../config/supabase');

// @desc    Get user notifications
// @route   GET /api/notifications
// @access  Private
exports.getNotifications = async (req, res, next) => {
    try {
        const { data: notifications, error } = await supabase
            .from('notifications')
            .select('*, sender:users(name)')
            .eq('user_id', req.user.id)
            .order('created_at', { ascending: false });

        if (error) throw error;

        res.status(200).json({
            success: true,
            count: notifications.length,
            data: notifications
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id
// @access  Private
exports.markAsRead = async (req, res, next) => {
    try {
        const { data: updated, error } = await supabase
            .from('notifications')
            .update({ is_read: true })
            .eq('id', req.params.id)
            .eq('user_id', req.user.id)
            .select()
            .single();

        if (error || !updated) return res.status(404).json({ success: false, message: 'Notification not found' });

        res.status(200).json({ success: true, data: updated });
    } catch (err) {
        next(err);
    }
};

// @desc    Mark all as read
// @route   PUT /api/notifications/readall
// @access  Private
exports.markAllRead = async (req, res, next) => {
    try {
        const { error } = await supabase
            .from('notifications')
            .update({ is_read: true })
            .eq('user_id', req.user.id)
            .eq('is_read', false);

        if (error) throw error;

        res.status(200).json({ success: true, message: 'All notifications marked as read' });
    } catch (err) {
        next(err);
    }
};

// Helper function to create notification (for internal use)
exports.createNotification = async (userId, senderId, type, content, link) => {
    try {
        await supabase.from('notifications').insert({
            user_id: userId,
            sender_id: senderId,
            type,
            content,
            link
        });
    } catch (err) {
        console.error('Error creating notification:', err);
    }
};
