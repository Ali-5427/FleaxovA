const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const supabase = require('./config/supabase');

// Load env vars
dotenv.config();

const app = express();

// Test Supabase Connection
(async () => {
    try {
        console.log('🧪 Testing Supabase connection...');
        const { data, error } = await supabase.from('users').select('id').limit(1);

        if (error) {
            if (error.code === 'PGRST116' || error.message?.includes('relation "users" does not exist')) {
                console.log('✅ Supabase connected (Note: "users" table not found, but API is reachable)');
            } else {
                console.error('❌ Supabase connection failed!');
                console.error('   Error Code:', error.code);
                console.error('   Error Message:', error.message || 'No message provided');
                console.error('   Details:', error.details || 'No details');
                if (error.hint) console.error('   Hint:', error.hint);
            }
        } else {
            console.log('✅ Supabase connected successfully! Database is ready.');
        }
    } catch (err) {
        console.error('❌ Unexpected error testing Supabase:', err.message);
    }
})();

// Middleware
app.use((req, res, next) => {
    console.log(`📩 ${req.method} ${req.url}`);
    next();
});
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// Swagger Configuration
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'FleaxovA API',
            version: '1.0.0',
            description: 'API documentation for FleaxovA - Premium Student Freelancing Platform',
        },
        servers: [
            {
                url: process.env.NODE_ENV === 'production'
                    ? 'https://last-final-fleaxova.vercel.app'
                    : `http://localhost:${process.env.PORT || 5000}`,
                description: process.env.NODE_ENV === 'production' ? 'Production server' : 'Development server',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis: ['./src/routes/*.js'], // Path to the API routes
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to FleaxovA API - Premium Student Freelancing Platform' });
});

// Import Routes
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const orderRoutes = require('./routes/orderRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const jobRoutes = require('./routes/jobRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const messageRoutes = require('./routes/messageRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const walletRoutes = require('./routes/walletRoutes');

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/profiles', profileRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/wallet', walletRoutes);


// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Server Error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

module.exports = app;
