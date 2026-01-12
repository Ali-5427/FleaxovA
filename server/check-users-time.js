const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(url, key);

async function checkUsersSchema() {
    console.log('--- Checking Users Table Schema ---');

    // Check updated_at existence
    const { error } = await supabase.from('users').select('updated_at').limit(1);

    if (error) {
        console.log('❌ updated_at column does NOT exist:', error.message);
    } else {
        console.log('✅ updated_at column exists.');
    }

    // Check created_at existence
    const { error: createdErr } = await supabase.from('users').select('created_at').limit(1);
    if (createdErr) console.log('❌ created_at column does NOT exist:', createdErr.message);
    else console.log('✅ created_at column exists.');
}

checkUsersSchema();
