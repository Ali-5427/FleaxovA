const mongoose = require('mongoose');
require('dotenv').config();

console.log('Attempting to connect to MongoDB...');
console.log('URI:', process.env.MONGO_URI);

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('SUCCESS: MongoDB Connected successfully!');
        process.exit(0);
    })
    .catch(err => {
        console.error('FAILURE: Could not connect to MongoDB.');
        console.error('Error details:', err.message);
        process.exit(1);
    });
