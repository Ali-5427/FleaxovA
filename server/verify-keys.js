const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const url = process.env.SUPABASE_URL;
const anon = process.env.SUPABASE_ANON_KEY;
const service = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function test() {
    console.log('Testing Anon Key...');
    const sAnon = createClient(url, anon);
    const { data: d1, error: e1 } = await sAnon.from('users').select('count').limit(1);
    if (e1) console.log('❌ Anon Key Error:', e1.message);
    else console.log('✅ Anon Key Works!');

    console.log('\nTesting Service Role Key...');
    const sService = createClient(url, service);
    const { data: d2, error: e2 } = await sService.from('users').select('count').limit(1);
    if (e2) console.log('❌ Service Role Key Error:', e2.message);
    else console.log('✅ Service Role Key Works!');
}

test();
