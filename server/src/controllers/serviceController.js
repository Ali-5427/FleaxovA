const supabase = require('../config/supabase');

// @desc    Get all services
// @route   GET /api/services
// @access  Public
exports.getServices = async (req, res, next) => {
    try {
        let query = supabase.from('services').select('*, freelancer:users(name, email)');

        if (req.query.keyword) {
            query = query.ilike('title', `%${req.query.keyword}%`);
        }

        if (req.query.category) {
            query = query.eq('category', req.query.category);
        }

        const { data: services, error } = await query;

        if (error) throw error;

        res.status(200).json({ success: true, count: services.length, data: services });
    } catch (err) {
        next(err);
    }
};

// @desc    Get single service
// @route   GET /api/services/:id
// @access  Public
exports.getService = async (req, res, next) => {
    try {
        const { data: service, error } = await supabase
            .from('services')
            .select('*, freelancer:users(name, email)')
            .eq('id', req.params.id)
            .single();

        if (error || !service) {
            return res.status(404).json({ success: false, message: 'Service not found' });
        }

        res.status(200).json({ success: true, data: service });
    } catch (err) {
        next(err);
    }
};

// @desc    Create new service
// @route   POST /api/services
// @access  Private (Student only)
exports.createService = async (req, res, next) => {
    try {
        if (req.user.role !== 'student') {
            return res.status(403).json({ success: false, message: 'Only students can create services' });
        }

        const { title, description, category, price, deliveryTime } = req.body;

        const { data: service, error } = await supabase
            .from('services')
            .insert({
                title,
                description,
                category,
                price,
                delivery_time: deliveryTime,
                freelancer_id: req.user.id
            })
            .select()
            .single();

        if (error) throw error;

        res.status(201).json({ success: true, data: service });
    } catch (err) {
        next(err);
    }
};

// @desc    Update service
// @route   PUT /api/services/:id
// @access  Private (Student only - owner)
exports.updateService = async (req, res, next) => {
    try {
        const { data: service, error: fetchError } = await supabase
            .from('services')
            .select('freelancer_id')
            .eq('id', req.params.id)
            .single();

        if (fetchError || !service) {
            return res.status(404).json({ success: false, message: 'Service not found' });
        }

        if (service.freelancer_id !== req.user.id) {
            return res.status(401).json({ success: false, message: 'Not authorized' });
        }

        const { data: updatedService, error } = await supabase
            .from('services')
            .update(req.body)
            .eq('id', req.params.id)
            .select()
            .single();

        if (error) throw error;

        res.status(200).json({ success: true, data: updatedService });
    } catch (err) {
        next(err);
    }
};

// @desc    Delete service
// @route   DELETE /api/services/:id
// @access  Private (Student only - owner)
exports.deleteService = async (req, res, next) => {
    try {
        const { data: service, error: fetchError } = await supabase
            .from('services')
            .select('freelancer_id')
            .eq('id', req.params.id)
            .single();

        if (fetchError || !service) {
            return res.status(404).json({ success: false, message: 'Service not found' });
        }

        if (service.freelancer_id !== req.user.id) {
            return res.status(401).json({ success: false, message: 'Not authorized' });
        }

        const { error } = await supabase.from('services').delete().eq('id', req.params.id);

        if (error) throw error;

        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        next(err);
    }
};
