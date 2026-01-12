const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(url, key);

async function checkNotifications() {
    console.log('--- Checking Notifications Schema ---');

    // Test select *
    const { data, error } = await supabase.from('notifications').select('*').limit(1);

    if (error) {
        console.log('❌ Select * failed:', error.message);
    } else {
        console.log('✅ Select * succeeded.');
        if (data && data.length > 0) {
            console.log('Columns:', Object.keys(data[0]));
        } else {
            console.log('Table is empty. Checking specific columns...');
        }
    }

    // Check sender_id existence
    const { error: senderErr } = await supabase.from('notifications').select('sender_id').limit(1);
    if (senderErr) console.log('❌ sender_id column does NOT exist:', senderErr.message);
    else console.log('✅ sender_id column exists.');

    // Check content vs message/title
    const { error: contentErr } = await supabase.from('notifications').select('content').limit(1);
    if (contentErr) console.log('❌ content column does NOT exist.');
    else console.log('✅ content column exists.');

    const { error: msgErr } = await supabase.from('notifications').select('message, title').limit(1);
    if (msgErr) console.log('❌ message/title columns do NOT exist.');
    else console.log('✅ message/title columns exist.');
}

checkNotifications();
