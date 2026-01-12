const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(url, key);

async function testMetaUpdate() {
    console.log('--- Testing Metadata Trigger ---');

    // 1. Create a user
    const email = `test.meta.${Date.now()}@example.com`;
    const password = 'password123';

    const { data: auth, error: authErr } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: 'Trigger Test',
                role: 'client'
            }
        }
    });

    if (authErr) {
        console.error('Sign up failed:', authErr.message);
        return;
    }
    const id = auth.user.id;
    console.log(`User created: ${id}`);

    // Allow some time for potential trigger
    await new Promise(r => setTimeout(r, 2000));

    // Check if row exists in public.users
    const { data: userRow, error: checkErr } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .maybeSingle();

    if (userRow) {
        console.log('✅ SUCCESS! User row was auto-created by trigger!');
    } else {
        console.log('❌ No row found. Metadata trigger does not exist.');

        // Try updating metadata explicitly
        console.log('Attempting updateUser metadata update...');
        const { error: upErr } = await supabase.auth.signInWithPassword({ email, password });
        if (!upErr) {
            await supabase.auth.updateUser({ data: { updated: true } });
            await new Promise(r => setTimeout(r, 2000));

            const { data: userRow2 } = await supabase.from('users').select('*').eq('id', id).maybeSingle();
            if (userRow2) console.log('✅ SUCCESS! User row created after update!');
            else console.log('❌ Still no row.');
        }
    }
}

testMetaUpdate();
