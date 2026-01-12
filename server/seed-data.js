const supabase = require('./src/config/supabase');
const { admin: supabaseAdmin } = require('./src/config/supabase');

async function seed() {
    console.log('🚀 Starting Robust AI Content Generation...');

    if (!supabaseAdmin) {
        console.error('❌ Service role key missing! Cannot bypass RLS.');
        process.exit(1);
    }

    const client = supabaseAdmin;

    // 1. Create Real Auth Users for Demo
    console.log('👥 Creating real demo users in Auth...');

    async function getOrCreateDemoUser(email, role, name) {
        // Try to find if user exists in public.users
        const { data: existingUser } = await client.from('users').select('id').eq('email', email).single();

        if (existingUser) {
            console.log(`✅ User ${email} already exists.`);
            return existingUser.id;
        }

        // Create in Auth
        const { data: authData, error: authError } = await client.auth.admin.createUser({
            email,
            password: 'demo_password_123',
            email_confirm: true,
            user_metadata: { name, role }
        });

        if (authError) {
            if (authError.message.includes('already registered')) {
                // If already in Auth but not in public.users (weird state), find them
                const { data: listData } = await client.auth.admin.listUsers();
                const user = listData.users.find(u => u.email === email);
                if (user) return user.id;
            }
            console.error(`❌ Error creating user ${email}:`, authError.message);
            return null;
        }

        console.log(`✅ Created demo user: ${email}`);
        return authData.user.id;
    }

    const freelancerId = await getOrCreateDemoUser('freelancer.demo@fleaxova.com', 'freelancer', 'Alex Rivera');
    const clientId = await getOrCreateDemoUser('client.demo@fleaxova.com', 'client', 'Sarah Chen');

    if (!freelancerId || !clientId) {
        console.error('❌ Failed to setup demo users. Aborting.');
        process.exit(1);
    }

    // 2. Sync to public.users (in case triggers didn't run or failed)
    console.log('🔄 Syncing demo users to public schema...');
    await client.from('users').upsert([
        { id: freelancerId, email: 'freelancer.demo@fleaxova.com', name: 'Alex Rivera', role: 'student', wallet_balance: 0 },
        { id: clientId, email: 'client.demo@fleaxova.com', name: 'Sarah Chen', role: 'client', wallet_balance: 0 }
    ]);

    // 3. Setup Profiles
    console.log('📝 Setting up profiles...');
    await client.from('profiles').upsert([
        {
            user_id: freelancerId,
            title: 'Senior Full Stack Developer',
            bio: 'Senior Full Stack Developer specializing in AI integrations and React. Student at IIT Bombay.',
            skills: ['React', 'Node.js', 'PyTorch', 'UI/UX Design'],
            portfolio: []
        },
        {
            user_id: clientId,
            title: 'Startup Founder',
            bio: 'Founder of Aura AI, looking for top-tier student engineers.'
        }
    ]);

    // 4. Generate Services
    console.log('🛠️ Generating services...');
    const sampleServices = [
        {
            freelancer_id: freelancerId,
            title: 'Modern React Dashboard Development',
            description: 'I will build a fully responsive, corporate-grade dashboard using React and Tailwind CSS. Perfect for startups and internal tools.',
            category: 'Development',
            price: 5000,
            delivery_time: 5,
            images: ['/images/samples/service-dashboard.png']
        },
        {
            freelancer_id: freelancerId,
            title: 'Professional Logo & Brand Identity',
            description: 'Get a unique, minimalist logo that represents your brand. Includes source files and multiple concepts.',
            category: 'Design',
            price: 2500,
            delivery_time: 3,
            images: ['/images/samples/service-logo.png']
        },
        {
            freelancer_id: freelancerId,
            title: 'AI Chatbot Integration (OpenAI)',
            description: 'Integrate the power of GPT-4 into your application. I handle the API setup and front-end implementation.',
            category: 'AI Services',
            price: 8000,
            delivery_time: 7,
            images: ['/images/samples/service-ai.png']
        }
    ];

    // Delete and re-insert to ensure fresh state
    await client.from('services').delete().eq('freelancer_id', freelancerId);
    const { error: srvError } = await client.from('services').insert(sampleServices);
    if (srvError) console.error('❌ Service Insert Error:', srvError.message);

    // 5. Generate Jobs
    console.log('💼 Generating jobs...');
    const sampleJobs = [
        {
            client_id: clientId,
            title: 'React Developer for Fintech App',
            description: 'Looking for a skilled student to help build out our payment dashboard. Must be proficient in State Management and API integration.',
            category: 'Development',
            budget: 15000,
            deadline: '14'
        },
        {
            client_id: clientId,
            title: 'Custom WordPress Theme Development',
            description: 'Need a customized theme for a portfolio website. Must be lightweight and fast-loading.',
            category: 'Development',
            budget: 9500,
            deadline: '10'
        }
    ];

    await client.from('jobs').delete().eq('client_id', clientId);
    const { error: jobError } = await client.from('jobs').insert(sampleJobs);
    if (jobError) console.error('❌ Job Insert Error:', jobError.message);

    console.log('✅ SEEDING COMPLETE! Services and Jobs are now live.');
    process.exit(0);
}

seed().catch(err => {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
});
