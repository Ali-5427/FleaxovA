const Order = require('../models/Order');
const Service = require('../models/Service');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private (Client)
exports.createOrder = async (req, res, next) => {
    try {
        const { serviceId, requirements } = req.body;

        const service = await Service.findById(serviceId);

        if (!service) {
            return res.status(404).json({ success: false, message: 'Service not found' });
        }

        if (service.freelancer.toString() === req.user.id) {
            return res.status(400).json({ success: false, message: 'You cannot order your own service' });
        }

        const order = await Order.create({
            client: req.user.id,
            freelancer: service.freelancer,
            service: serviceId,
            amount: service.price,
            requirements,
            status: 'pending'
        });

        res.status(201).json({
            success: true,
            data: order
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get my orders (as client or freelancer)
// @route   GET /api/orders
// @access  Private
exports.getOrders = async (req, res, next) => {
    try {
        // Find orders where user is client OR freelancer
        const orders = await Order.find({
            $or: [{ client: req.user.id }, { freelancer: req.user.id }]
        })
            .populate('service', 'title')
            .populate('client', 'name email')
            .populate('freelancer', 'name email');

        res.status(200).json({
            success: true,
            count: orders.length,
            data: orders
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Update order status (Mock Payment / Delivery)
// @route   PUT /api/orders/:id/status
// @access  Private
exports.updateOrderStatus = async (req, res, next) => {
    try {
        const { status, paymentStatus } = req.body;

        let order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        // Authorization check could be added here depending on specific transition rules
        // For MVP/Demo:
        if (status) order.status = status;
        if (paymentStatus) order.paymentStatus = paymentStatus;

        await order.save();

        res.status(200).json({ success: true, data: order });
    } catch (err) {
        next(err);
    }
};
