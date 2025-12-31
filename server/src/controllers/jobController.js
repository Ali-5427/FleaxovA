const supabase = require('../config/supabase');

// @desc    Get all jobs
// @route   GET /api/jobs
// @access  Public
exports.getJobs = async (req, res, next) => {
    try {
        let query = supabase.from('jobs').select('*, client:users(name, email)');

        if (req.query.keyword) {
            query = query.ilike('title', `%${req.query.keyword}%`);
        }

        if (req.query.category) {
            query = query.eq('category', req.query.category);
        }

        // Only show open jobs by default
        if (!req.query.status) {
            query = query.eq('status', 'open');
        } else {
            query = query.eq('status', req.query.status);
        }

        const { data: jobs, error } = await query;

        if (error) throw error;

        res.status(200).json({ success: true, count: jobs.length, data: jobs });
    } catch (err) {
        next(err);
    }
};

// @desc    Get single job
// @route   GET /api/jobs/:id
// @access  Public
exports.getJob = async (req, res, next) => {
    try {
        const { data: job, error } = await supabase
            .from('jobs')
            .select('*, client:users(name, email), assigned_freelancer:users(name, email)')
            .eq('id', req.params.id)
            .single();

        if (error || !job) {
            return res.status(404).json({ success: false, message: 'Job not found' });
        }

        res.status(200).json({ success: true, data: job });
    } catch (err) {
        next(err);
    }
};

// @desc    Create new job
// @route   POST /api/jobs
// @access  Private (Client)
exports.createJob = async (req, res, next) => {
    try {
        if (req.user.role !== 'client' && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Only clients can post jobs' });
        }

        const { title, description, category, budget, deadline } = req.body;

        const { data: job, error } = await supabase
            .from('jobs')
            .insert({
                title,
                description,
                category,
                budget,
                deadline,
                client_id: req.user.id
            })
            .select()
            .single();

        if (error) throw error;

        res.status(201).json({ success: true, data: job });
    } catch (err) {
        next(err);
    }
};

// @desc    Update job
// @route   PUT /api/jobs/:id
// @access  Private (Owner)
exports.updateJob = async (req, res, next) => {
    try {
        const { data: job, error: fetchError } = await supabase
            .from('jobs')
            .select('client_id')
            .eq('id', req.params.id)
            .single();

        if (fetchError || !job) {
            return res.status(404).json({ success: false, message: 'Job not found' });
        }

        if (job.client_id !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ success: false, message: 'Not authorized' });
        }

        const { data: updatedJob, error } = await supabase
            .from('jobs')
            .update(req.body)
            .eq('id', req.params.id)
            .select()
            .single();

        if (error) throw error;

        res.status(200).json({ success: true, data: updatedJob });
    } catch (err) {
        next(err);
    }
};

// @desc    Delete job
// @route   DELETE /api/jobs/:id
// @access  Private (Owner)
exports.deleteJob = async (req, res, next) => {
    try {
        const { data: job, error: fetchError } = await supabase
            .from('jobs')
            .select('client_id')
            .eq('id', req.params.id)
            .single();

        if (fetchError || !job) {
            return res.status(404).json({ success: false, message: 'Job not found' });
        }

        if (job.client_id !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ success: false, message: 'Not authorized' });
        }

        const { error } = await supabase.from('jobs').delete().eq('id', req.params.id);

        if (error) throw error;

        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        next(err);
    }
};
