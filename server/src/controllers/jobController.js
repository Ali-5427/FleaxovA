const supabase = require('../config/supabase');
const { getUserClient } = require('../config/supabase');

// @desc    Get all jobs
// @route   GET /api/jobs
// @access  Public
exports.getJobs = async (req, res, next) => {
    try {
        const mappedJobs = [
            {
                _id: 'job-demo-1',
                id: 'job-demo-1',
                title: 'React Developer for Fintech App',
                description: 'Looking for a skilled student to help build out our payment dashboard for a new Fintech startup. Must be proficient in state management and API integration.',
                category: 'Development',
                budget: 15000,
                deadline: '14',
                images: ['/images/samples/service-dashboard.png'],
                createdAt: new Date().toISOString(),
                client: { name: 'Sarah Chen' }
            },
            {
                _id: 'job-demo-2',
                id: 'job-demo-2',
                title: 'Mobile App UI/UX Design',
                description: 'Need a stunning design for a new fitness app. High-fidelity wireframes and prototype required in Figma.',
                category: 'Design',
                budget: 10000,
                deadline: '7',
                images: ['/images/samples/service-logo.png'],
                createdAt: new Date().toISOString(),
                client: { name: 'Alex Tech' }
            },
            {
                _id: 'job-demo-3',
                id: 'job-demo-3',
                title: 'Technical Documentation for AI API',
                description: 'Write professional-grade documentation for a new AI-native API. Must include clear examples and clean markdown structure.',
                category: 'AI Services',
                budget: 8500,
                deadline: '5',
                images: ['/images/samples/service-ai.png'],
                createdAt: new Date().toISOString(),
                client: { name: 'Sarah Chen' }
            }
        ];

        res.status(200).json({ success: true, count: mappedJobs.length, data: mappedJobs });
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
            .select('*, client:users(email), assigned_freelancer:users(email)')
            .eq('id', req.params.id)
            .single();

        if (error || !job) {
            // SMART FALLBACK: If job ID starts with 'job-demo-', return matching demo data
            if (req.params.id && req.params.id.startsWith('job-demo-')) {
                const demoJobs = {
                    'job-demo-1': {
                        id: 'job-demo-1',
                        title: 'React Developer for Fintech App',
                        description: 'Looking for a skilled student to help build out our payment dashboard for a new Fintech startup. Requirements: \n- Expertise in React and Redux\n- Experience with high-security API integration\n- Familiarity with Chart.js or D3.js',
                        category: 'Development',
                        budget: 15000,
                        deadline: '14 Days',
                        images: ['/images/samples/service-dashboard.png'],
                        createdAt: new Date().toISOString(),
                        client: { name: 'Sarah Chen', email: 'sarah@demo.com' }
                    },
                    'job-demo-2': {
                        id: 'job-demo-2',
                        title: 'Mobile App UI/UX Design',
                        description: 'We need a creative designer to build the interface for a modern fitness tracking application. Goals: \n- High-fidelity wireframes\n- Interactive prototype in Figma\n- Design system for future scaling',
                        category: 'Design',
                        budget: 10000,
                        deadline: '7 Days',
                        images: ['/images/samples/service-logo.png'],
                        createdAt: new Date().toISOString(),
                        client: { name: 'Alex Tech', email: 'alex@demo.com' }
                    },
                    'job-demo-3': {
                        id: 'job-demo-3',
                        title: 'Technical Documentation for AI API',
                        description: 'Write professional-grade documentation for a new AI-native API. Must include clear examples and clean markdown structure.',
                        category: 'AI Services',
                        budget: 8500,
                        deadline: '5',
                        images: ['/images/samples/service-ai.png'],
                        createdAt: new Date().toISOString(),
                        client: { name: 'Sarah Chen', email: 'sarah@demo.com' }
                    }
                };

                const demoData = demoJobs[req.params.id];
                if (demoData) {
                    return res.status(200).json({ success: true, data: demoData });
                }
            }
            return res.status(404).json({ success: false, message: 'Job not found' });
        }

        if (job && job.client) {
            job.client.name = job.client.email.split('@')[0];
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

        const userClient = getUserClient(req);
        const { data: job, error } = await userClient
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

        const userClient = getUserClient(req);
        const { data: updatedJob, error } = await userClient
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

        const userClient = getUserClient(req);
        const { error } = await userClient.from('jobs').delete().eq('id', req.params.id);

        if (error) throw error;

        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        next(err);
    }
};
