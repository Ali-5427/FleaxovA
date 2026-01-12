const supabase = require('../config/supabase');
const { getUserClient } = require('../config/supabase');

// @desc    Get all services
// @route   GET /api/services
// @access  Public
exports.getServices = async (req, res, next) => {
    try {
        const mappedServices = [
            {
                _id: 'demo-1',
                id: 'demo-1',
                title: 'Modern React Dashboard Development',
                description: 'I will build a fully responsive, corporate-grade dashboard using React and Tailwind CSS. Perfect for startups and internal tools.',
                category: 'Development',
                price: 5000,
                delivery_time: 5,
                images: ['/images/samples/service-dashboard.png'],
                freelancer: { name: 'Alex Rivera', email: 'alex@demo.com' }
            },
            {
                _id: 'demo-2',
                id: 'demo-2',
                title: 'Professional Logo & Brand Identity',
                description: 'Get a unique, minimalist logo that represents your brand. Includes source files and multiple concepts.',
                category: 'Design',
                price: 2500,
                delivery_time: 3,
                images: ['/images/samples/service-logo.png'],
                freelancer: { name: 'Sarah Chen', email: 'sarah@demo.com' }
            },
            {
                _id: 'demo-3',
                id: 'demo-3',
                title: 'AI Chatbot Integration (OpenAI)',
                description: 'Integrate the power of GPT-4 into your application. I handle the API setup and front-end implementation.',
                category: 'AI Services',
                price: 8000,
                delivery_time: 7,
                images: ['/images/samples/service-ai.png'],
                freelancer: { name: 'Alex Rivera', email: 'alex@demo.com' }
            }
        ];

        res.status(200).json({ success: true, count: mappedServices.length, data: mappedServices });
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
            .select('*, freelancer:users(email)')
            .eq('id', req.params.id)
            .single();

        if (error || !service) {
            // SMART FALLBACK: If service ID starts with 'demo-', return matching demo data
            if (req.params.id && req.params.id.startsWith('demo-')) {
                const demoServices = {
                    'demo-1': {
                        id: 'demo-1',
                        title: 'Modern React Dashboard Development',
                        description: 'I will build a fully responsive, corporate-grade dashboard using React and Tailwind CSS. Perfect for startups and internal tools. Features include: \n- Custom Charts & Graphs\n- Dark/Light Mode\n- Responsive Sidebar\n- API Integration Ready',
                        category: 'Development',
                        price: 5000,
                        delivery_time: 5,
                        images: ['/images/samples/service-dashboard.png'],
                        freelancer: { name: 'Alex Rivera', email: 'alex@demo.com' }
                    },
                    'demo-2': {
                        id: 'demo-2',
                        title: 'Professional Logo & Brand Identity',
                        description: 'Get a unique, minimalist logo that represents your brand. Includes source files and multiple concepts. Package includes: \n- 3 Initial Concepts\n- Unlimited Revisions\n- High Resolution Vector Files\n- Social Media Kit',
                        category: 'Design',
                        price: 2500,
                        delivery_time: 3,
                        images: ['/images/samples/service-logo.png'],
                        freelancer: { name: 'Sarah Chen', email: 'sarah@demo.com' }
                    },
                    'demo-3': {
                        id: 'demo-3',
                        title: 'AI Chatbot Integration (OpenAI)',
                        description: 'Integrate the power of GPT-4 into your application. I handle the API setup and front-end implementation. We will cover: \n- Context setting\n- Streaming responses\n- Cost optimization\n- Custom UI components',
                        category: 'AI Services',
                        price: 8000,
                        delivery_time: 7,
                        images: ['/images/samples/service-ai.png'],
                        freelancer: { name: 'Alex Rivera', email: 'alex@demo.com' }
                    }
                };

                const demoData = demoServices[req.params.id];
                if (demoData) {
                    return res.status(200).json({ success: true, data: demoData });
                }
            }
            return res.status(404).json({ success: false, message: 'Service not found' });
        }

        if (service && service.freelancer) {
            service.freelancer.name = service.freelancer.email.split('@')[0];
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
        if (req.user.role !== 'student' && req.user.role !== 'freelancer') {
            return res.status(403).json({ success: false, message: 'Only students can create services' });
        }

        const { title, description, category, price, deliveryTime } = req.body;

        const userClient = getUserClient(req);
        const { data: service, error } = await userClient
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

        const userClient = getUserClient(req);
        const { data: updatedService, error } = await userClient
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

        const userClient = getUserClient(req);
        const { error } = await userClient.from('services').delete().eq('id', req.params.id);

        if (error) throw error;

        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        next(err);
    }
};
