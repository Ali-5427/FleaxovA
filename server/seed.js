const mongoose = require('mongoose');
const User = require('./src/models/User');
const Service = require('./src/models/Service');
require('dotenv').config();

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB for seeding...');

        // 1. Create a sample Student user
        let student = await User.findOne({ email: 'student@test.com' });
        if (!student) {
            student = await User.create({
                name: 'Test Student',
                email: 'student@test.com',
                password: 'password123',
                role: 'student'
            });
            console.log('Sample student created.');
        }

        // 2. Create sample services
        const services = [
            {
                freelancer: student._id,
                title: 'Professional Web Development',
                description: 'I will build a high-quality React application for your business or project with modern UI and backend integration.',
                category: 'Development',
                price: 5000,
                deliveryTime: 7
            },
            {
                freelancer: student._id,
                title: 'UI/UX Design for Mobile Apps',
                description: 'Stunning and user-friendly mobile app designs using Figma. Clean layouts and premium aesthetics guaranteed.',
                category: 'Design',
                price: 3000,
                deliveryTime: 4
            },
            {
                freelancer: student._id,
                title: 'Scientific Paper Writing',
                description: 'Professional academic and scientific writing services for students. High-quality research and citation included.',
                category: 'Writing',
                price: 1500,
                deliveryTime: 3
            }
        ];

        await Service.deleteMany({ freelancer: student._id });
        await Service.insertMany(services);
        console.log('Sample services added successfully!');

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedData();
