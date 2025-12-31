const supabase = require('../config/supabase');
const { createNotification } = require('./notificationController');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private (Client)
exports.createOrder = async (req, res, next) => {
    try {
        const { serviceId, requirements } = req.body;

        const { data: service, error: sError } = await supabase
            .from('services')
            .select('*')
            .eq('id', serviceId)
            .single();

        if (sError || !service) return res.status(404).json({ success: false, message: 'Service not found' });
        if (service.freelancer_id === req.user.id) return res.status(400).json({ success: false, message: 'Cannot order own service' });

        const { data: order, error: oError } = await supabase
            .from('orders')
            .insert({
                client_id: req.user.id,
                freelancer_id: service.freelancer_id,
                service_id: serviceId,
                amount: service.price,
                requirements,
                status: 'pending'
            })
            .select()
            .single();

        if (oError) throw oError;

        await createNotification(
            service.freelancer_id,
            req.user.id,
            'order',
            `${req.user.name} ordered: ${service.title}`,
            `/dashboard`
        );

        res.status(201).json({ success: true, data: order });
    } catch (err) {
        next(err);
    }
};

// @desc    Get my orders
// @route   GET /api/orders
exports.getOrders = async (req, res, next) => {
    try {
        const { data: orders, error } = await supabase
            .from('orders')
            .select('*, service:services(title), client:users(name, email), freelancer:users(name, email)')
            .or(`client_id.eq.${req.user.id},freelancer_id.eq.${req.user.id}`);

        if (error) throw error;
        res.status(200).json({ success: true, count: orders.length, data: orders });
    } catch (err) {
        next(err);
    }
};

// @desc    Update order status
exports.updateOrderStatus = async (req, res, next) => {
    try {
        const { status, paymentStatus } = req.body;

        const { data: order, error: fetchError } = await supabase
            .from('orders')
            .select('*, service:services(title)')
            .eq('id', req.params.id)
            .single();

        if (fetchError || !order) return res.status(404).json({ success: false, message: 'Order not found' });

        const { data: updatedOrder, error: updateError } = await supabase
            .from('orders')
            .update({ status: status || order.status, payment_status: paymentStatus || order.payment_status })
            .eq('id', req.params.id)
            .select()
            .single();

        if (updateError) throw updateError;

        if (status === 'completed') {
            const { data: freelancer } = await supabase.from('users').select('wallet_balance').eq('id', order.freelancer_id).single();
            if (freelancer) {
                await supabase
                    .from('users')
                    .update({ wallet_balance: freelancer.wallet_balance + order.amount })
                    .eq('id', order.freelancer_id);

                await createNotification(
                    order.freelancer_id,
                    null,
                    'payment',
                    `₹${order.amount} credited to your wallet.`,
                    '/wallet'
                );
            }
        }

        const recipientId = (req.user.id === order.client_id) ? order.freelancer_id : order.client_id;
        await createNotification(
            recipientId,
            req.user.id,
            'order',
            `Order status: ${status || order.status}`,
            '/dashboard'
        );

        res.status(200).json({ success: true, data: updatedOrder });
    } catch (err) {
        next(err);
    }
};
