const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(url, key);

async function discover() {
    console.log('--- Discovering Profile Columns ---');

    // 1. Get a valid user ID to use for insertion
    const { data: users, error: uErr } = await supabase.from('users').select('id').limit(1);
    if (uErr || !users || users.length === 0) {
        console.error('❌ Could not find a user to test with');
        return;
    }
    const testUserId = users[0].id;
    console.log('Using test User ID:', testUserId);

    // 2. Try to insert/upsert a minimal profile row
    const { data: inserted, error: iErr } = await supabase
        .from('profiles')
        .upsert({ user_id: testUserId }, { onConflict: 'user_id' })
        .select('*')
        .single();

    if (iErr) {
        console.error('❌ Error during minimal upsert:', iErr.message);
        return;
    }

    if (inserted) {
        console.log('✅ Success! Found columns in profile row:');
        console.log(JSON.stringify(Object.keys(inserted), null, 2));
        console.log('\nFull record contents:', JSON.stringify(inserted, null, 2));
    }
}

discover();
