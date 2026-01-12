const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
dotenv.config();

const url = process.env.SUPABASE_URL.trim().replace(/['"]/g, '');
const key = process.env.SUPABASE_SERVICE_ROLE_KEY.trim().replace(/['"]/g, '');

console.log('Testing with URL:', url);
console.log('Key length:', key.length);

const client = createClient(url, key);

(async () => {
    const { data, error } = await client.from('users').select('*').limit(1);
    if (error) {
        console.error('❌ Admin Error:', error.message);
    } else {
        console.log('✅ Admin Success, found users:', data.length);
    }
})();
