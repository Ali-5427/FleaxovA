const supabase = require('../config/supabase');
const { createNotification } = require('./notificationController');

// @desc    Send a message
// @route   POST /api/messages
// @access  Private
exports.sendMessage = async (req, res, next) => {
    try {
        const { receiver, content } = req.body;

        const { data: message, error } = await supabase
            .from('messages')
            .insert({
                sender_id: req.user.id,
                receiver_id: receiver,
                content
            })
            .select()
            .single();

        if (error) throw error;

        await createNotification(
            receiver,
            req.user.id,
            'message',
            `New message from ${req.user.name}: "${content.substring(0, 30)}..."`,
            '/messages'
        );

        res.status(201).json({ success: true, data: message });
    } catch (err) {
        next(err);
    }
};

// @desc    Get messages for a conversation
// @route   GET /api/messages/:userId
// @access  Private
exports.getMessages = async (req, res, next) => {
    try {
        const { data: messages, error } = await supabase
            .from('messages')
            .select('*')
            .or(`and(sender_id.eq.${req.user.id},receiver_id.eq.${req.params.userId}),and(sender_id.eq.${req.params.userId},receiver_id.eq.${req.user.id})`)
            .order('created_at', { ascending: true });

        if (error) throw error;

        res.status(200).json({ success: true, count: messages.length, data: messages });
    } catch (err) {
        next(err);
    }
};

// @desc    Get all conversations for a user
exports.getConversations = async (req, res, next) => {
    try {
        const { data: messages, error } = await supabase
            .from('messages')
            .select('*, sender:users!messages_sender_id_fkey(name, email), receiver:users!messages_receiver_id_fkey(name, email)')
            .or(`sender_id.eq.${req.user.id},receiver_id.eq.${req.user.id}`)
            .order('created_at', { ascending: false });

        if (error) throw error;

        const conversations = {};
        messages.forEach(msg => {
            const otherUser = msg.sender_id === req.user.id ? msg.receiver : msg.sender;
            if (!otherUser) return;
            const otherUserId = otherUser.id || (msg.sender_id === req.user.id ? msg.receiver_id : msg.sender_id);

            if (!conversations[otherUserId]) {
                conversations[otherUserId] = {
                    user: otherUser,
                    lastMessage: msg
                };
            }
        });

        res.status(200).json({ success: true, data: Object.values(conversations) });
    } catch (err) {
        next(err);
    }
};
