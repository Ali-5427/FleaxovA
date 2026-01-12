const http = require('http');

const post = (url, data, token = null) => {
    return new Promise((resolve, reject) => {
        const u = new URL(url);
        const body = JSON.stringify(data);
        const options = {
            hostname: u.hostname,
            port: u.port,
            path: u.pathname,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(body)
            }
        };

        if (token) {
            options.headers['Authorization'] = `Bearer ${token}`;
        }

        const req = http.request(options, (res) => {
            let resData = '';
            res.on('data', (chunk) => resData += chunk);
            res.on('end', () => {
                let parsed = {};
                try {
                    parsed = JSON.parse(resData);
                } catch (e) {
                    return reject(new Error('Invalid JSON from server: ' + resData.substring(0, 100)));
                }

                if (res.statusCode >= 200 && res.statusCode < 300) {
                    resolve(parsed);
                } else {
                    reject(parsed);
                }
            });
        });

        req.on('error', (e) => reject(e));
        req.write(body);
        req.end();
    });
};

async function seed() {
    console.log('🚀 Starting Robust API-based Seeding...');
    const baseUrl = 'http://localhost:9091';

    async function getAuthToken(email, name, role) {
        try {
            console.log(`🔑 Getting token for ${email}...`);
            const res = await post(`${baseUrl}/api/auth/register`, {
                name, email, password: 'demo_password_123', role
            });
            return res.token;
        } catch (err) {
            if (err.message && err.message.includes('already registered')) {
                console.log(`ℹ️ User ${email} exists, logging in instead...`);
                const loginRes = await post(`${baseUrl}/api/auth/login`, {
                    email, password: 'demo_password_123'
                });
                return loginRes.token;
            }
            throw err;
        }
    }

    try {
        const freeToken = await getAuthToken('freelancer.demo@fleaxova.com', 'Alex Rivera', 'freelancer');
        const clientToken = await getAuthToken('client.demo@fleaxova.com', 'Sarah Chen', 'client');

        // 3. Add Services
        console.log('🛠️ Adding Services...');
        const services = [
            {
                title: 'Modern React Dashboard Development',
                description: 'I will build a fully responsive, corporate-grade dashboard using React and Tailwind CSS. Perfect for startups and internal tools.',
                category: 'Development',
                price: 5000,
                deliveryTime: 5,
                images: ['/images/samples/service-dashboard.png']
            },
            {
                title: 'Professional Logo & Brand Identity',
                description: 'Get a unique, minimalist logo that represents your brand. Includes source files and multiple concepts.',
                category: 'Design',
                price: 2500,
                deliveryTime: 3,
                images: ['/images/samples/service-logo.png']
            },
            {
                title: 'AI Chatbot Integration (OpenAI)',
                description: 'Integrate the power of GPT-4 into your application. I handle the API setup and front-end implementation.',
                category: 'AI Services',
                price: 8000,
                deliveryTime: 7,
                images: ['/images/samples/service-ai.png']
            }
        ];

        for (const s of services) {
            try {
                await post(`${baseUrl}/api/services`, s, freeToken);
                console.log(`✅ Added: ${s.title}`);
            } catch (srvErr) {
                console.warn(`⚠️ Failed to add service ${s.title}:`, srvErr.message || 'Error');
            }
        }

        // 4. Add Jobs
        console.log('💼 Adding Jobs...');
        const jobs = [
            {
                title: 'React Developer for Fintech App',
                description: 'Looking for a skilled student to help build out our payment dashboard. Must be proficient in State Management and API integration.',
                category: 'Development',
                budget: 15000,
                deadline: '14'
            },
            {
                title: 'Custom WordPress Theme Development',
                description: 'Need a customized theme for a portfolio website. Must be lightweight and fast-loading.',
                category: 'Development',
                budget: 9500,
                deadline: '10'
            }
        ];

        for (const j of jobs) {
            try {
                await post(`${baseUrl}/api/jobs`, j, clientToken);
                console.log(`✅ Added: ${j.title}`);
            } catch (jobErr) {
                console.warn(`⚠️ Failed to add job ${j.title}:`, jobErr.message || 'Error');
            }
        }

        console.log('🎉 SEEDING COMPLETED!');

    } catch (err) {
        console.error('❌ Seeding Critical Failure:', err.message || err);
    }
}

seed();
