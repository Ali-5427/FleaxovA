const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(url, key);

async function test() {
    console.log('Testing Users table for "name" column...');
    const { error: e1 } = await supabase.from('users').select('name').limit(1);
    if (!e1) console.log('✅ "users.name" exists!');
    else console.log('❌ "users.name" does NOT exist:', e1.message);

    console.log('\nTesting Profiles table for "full_name" column...');
    const { error: e2 } = await supabase.from('profiles').select('full_name').limit(1);
    if (!e2) console.log('✅ "profiles.full_name" exists!');
    else console.log('❌ "profiles.full_name" does NOT exist:', e2.message);
}

test();
