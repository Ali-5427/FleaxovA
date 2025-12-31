const supabase = require('../config/supabase');
const { createNotification } = require('./notificationController');

// @desc    Apply to a job
// @route   POST /api/applications
// @access  Private (Student)
exports.applyToJob = async (req, res, next) => {
    try {
        if (req.user.role !== 'student' && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Only students can apply' });
        }

        const { job: jobId, coverLetter, bidAmount } = req.body;

        const { data: job, error: jobError } = await supabase
            .from('jobs')
            .select('*')
            .eq('id', jobId)
            .single();

        if (jobError || !job) return res.status(404).json({ success: false, message: 'Job not found' });
        if (job.status !== 'open') return res.status(400).json({ success: false, message: 'Job closed' });

        const { data: application, error: appError } = await supabase
            .from('applications')
            .insert({
                job_id: jobId,
                freelancer_id: req.user.id,
                cover_letter: coverLetter,
                bid_amount: bidAmount
            })
            .select()
            .single();

        if (appError) {
            if (appError.code === '23505') return res.status(400).json({ success: false, message: 'Already applied' });
            throw appError;
        }

        await createNotification(
            job.client_id,
            req.user.id,
            'application',
            `${req.user.name} applied for: ${job.title}`,
            `/job-admin/${job.id}`
        );

        res.status(201).json({ success: true, data: application });
    } catch (err) {
        next(err);
    }
};

// @desc    Get all applications
// @route   GET /api/applications
exports.getApplications = async (req, res, next) => {
    try {
        let query = supabase.from('applications').select('*, job:jobs(title, status), freelancer:users(name, email)');

        if (req.user.role === 'student') {
            query = query.eq('freelancer_id', req.user.id);
        } else if (req.user.role === 'client') {
            const { data: jobs } = await supabase.from('jobs').select('id').eq('client_id', req.user.id);
            const jobIds = jobs.map(j => j.id);
            query = query.in('job_id', jobIds);
        }

        const { data: applications, error } = await query;
        if (error) throw error;

        res.status(200).json({ success: true, count: applications.length, data: applications });
    } catch (err) {
        next(err);
    }
};

// @desc    Get applications for a specific job
exports.getJobApplications = async (req, res, next) => {
    try {
        const { data: job } = await supabase.from('jobs').select('client_id').eq('id', req.params.jobId).single();
        if (!job) return res.status(404).json({ success: false, message: 'Job not found' });

        if (job.client_id !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ success: false, message: 'Not authorized' });
        }

        const { data: applications, error } = await supabase
            .from('applications')
            .select('*, freelancer:users(name, email)')
            .eq('job_id', req.params.jobId);

        if (error) throw error;
        res.status(200).json({ success: true, count: applications.length, data: applications });
    } catch (err) {
        next(err);
    }
};

// @desc    Update application status
exports.updateApplicationStatus = async (req, res, next) => {
    try {
        const { data: application, error: fetchError } = await supabase
            .from('applications')
            .select('*, job:jobs(*)')
            .eq('id', req.params.id)
            .single();

        if (fetchError || !application) return res.status(404).json({ success: false, message: 'Not found' });

        if (application.job.client_id !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ success: false, message: 'Not authorized' });
        }

        const { status } = req.body;
        const { data: updatedApp, error } = await supabase
            .from('applications')
            .update({ status })
            .eq('id', req.params.id)
            .select()
            .single();

        if (error) throw error;

        await createNotification(
            application.freelancer_id,
            req.user.id,
            'application',
            `Your application for "${application.job.title}" has been ${status}.`,
            '/dashboard'
        );

        if (status === 'accepted') {
            await supabase
                .from('jobs')
                .update({ status: 'assigned', assigned_freelancer_id: application.freelancer_id })
                .eq('id', application.job_id);
        }

        res.status(200).json({ success: true, data: updatedApp });
    } catch (err) {
        next(err);
    }
};
