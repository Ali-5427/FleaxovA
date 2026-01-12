const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

// Try to load env from current directory
console.log('Current workspace:', process.cwd());
const envPath = path.join(process.cwd(), '.env');

if (fs.existsSync(envPath)) {
    console.log('✅ .env file found at:', envPath);
    dotenv.config({ path: envPath });
} else {
    console.log('❌ .env file NOT found at:', envPath);
}

const url = process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const anonKey = process.env.SUPABASE_ANON_KEY;

console.log('\n--- Environment Variable Check ---');
console.log('SUPABASE_URL:', url ? '✓ Extracted' : '✗ MISSING');
if (url) console.log('   Value starts with:', url.substring(0, 15) + '...');

console.log('SUPABASE_SERVICE_ROLE_KEY:', serviceKey ? '✓ Extracted' : '✗ MISSING');
if (serviceKey) {
    console.log('   Length:', serviceKey.length, 'characters');
    if (serviceKey.startsWith('eyJ')) {
        console.log('   ✅ Key format: JWT (Starts with eyJ) - This looks correct!');
    } else {
        console.log('   ❌ Key format: INVALID (Should start with eyJ for Supabase API)');
    }
}

console.log('SUPABASE_ANON_KEY:', anonKey ? '✓ Extracted' : '✗ MISSING');
if (anonKey) {
    console.log('   Length:', anonKey.length, 'characters');
    if (anonKey.startsWith('eyJ')) {
        console.log('   ✅ Key format: JWT (Starts with eyJ) - This looks correct!');
    }
}

if (!url || (!serviceKey && !anonKey)) {
    console.log('\n🛑 ERROR: Your .env file is missing critical information.');
    console.log('Ensure your .env file looks like this (no spaces around =):');
    console.log('SUPABASE_URL=https://your-id.supabase.co');
    console.log('SUPABASE_SERVICE_ROLE_KEY=your-secret-key');
} else {
    console.log('\n✨ Keys look present. If connection still fails, the keys themselves might be copied incorrectly from Supabase.');
}
