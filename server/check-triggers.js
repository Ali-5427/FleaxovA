const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(url, key);

async function checkTriggers() {
    console.log('--- Checking for Triggers that might mention full_name ---');

    // We can't query pg_trigger directly with anon key usually, 
    // but we can try to find triggers that might be causing the error by performing a test operation 
    // and catching the VERY specific error details.

    console.log('\n🧪 Testing a minimal insert into profiles...');
    const { error } = await supabase.from('profiles').insert({ user_id: '00000000-0000-0000-0000-000000000000' });

    if (error) {
        console.log('❌ Insert Failed!');
        console.log('Message:', error.message);
        console.log('Details:', error.details);
        console.log('Hint:', error.hint);
    } else {
        console.log('✅ Minimal insert worked! (This means simple inserts are fine)');
    }
}

checkTriggers();
