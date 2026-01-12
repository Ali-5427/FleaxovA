const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
dotenv.config();

const url = (process.env.SUPABASE_URL || '').trim().replace(/['"]/g, '');
const anon = (process.env.SUPABASE_ANON_KEY || '').trim().replace(/['"]/g, '');
const service = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim().replace(/['"]/g, '');

async function test() {
    console.log('\n--- 🧪 SUPABASE KEY TEST ---');
    console.log('URL:', url);

    // Test 1: Service Role Key
    console.log('\n1. Testing SERVICE_ROLE key...');
    if (!service) {
        console.log('❌ Service Role Key is MISSING in .env');
    } else {
        const clientS = createClient(url, service);
        const { error } = await clientS.from('profiles').select('count', { count: 'exact', head: true });
        if (error) {
            console.log('❌ SERVICE_ROLE failed:', error.message);
        } else {
            console.log('✅ SERVICE_ROLE IS WORKING!');
        }
    }

    // Test 2: Anon Key
    console.log('\n2. Testing ANON key...');
    if (!anon) {
        console.log('❌ Anon Key is MISSING in .env');
    } else {
        const clientA = createClient(url, anon);
        const { error } = await clientA.from('profiles').select('count', { count: 'exact', head: true });
        if (error) {
            // Note: This might fail if RLS is on, but "Invalid API Key" is a different error
            if (error.message.includes('API key')) {
                console.log('❌ ANON key failed:', error.message);
            } else {
                console.log('✅ ANON key is at least VALID (Got error: ' + error.message + ')');
            }
        } else {
            console.log('✅ ANON KEY IS WORKING!');
        }
    }
}

test();
