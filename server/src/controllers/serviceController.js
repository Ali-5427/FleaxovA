const Service = require('../models/Service');

// @desc    Get all services
// @route   GET /api/services
// @access  Public
exports.getServices = async (req, res, next) => {
    try {
        let query;

        // Copy req.query
        const reqQuery = { ...req.query };

        // Fields to exclude
        const removeFields = ['select', 'sort', 'page', 'limit'];
        removeFields.forEach(param => delete reqQuery[param]);

        // Create query string
        let queryStr = JSON.stringify(reqQuery);

        // Create operators ($gt, $gte, etc)
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

        // Finding resource
        query = Service.find(JSON.parse(queryStr)).populate('freelancer', 'name email');

        // Executing query
        const services = await query;

        res.status(200).json({ success: true, count: services.length, data: services });
    } catch (err) {
        next(err);
    }
};

// @desc    Create new service
// @route   POST /api/services
// @access  Private (Student only)
exports.createService = async (req, res, next) => {
    try {
        // Add user to req.body
        req.body.freelancer = req.user.id;

        // Check for existing services (optional limit)

        const service = await Service.create(req.body);

        res.status(201).json({
            success: true,
            data: service
        });
    } catch (err) {
        next(err);
    }
};
