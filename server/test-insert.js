const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(url, key);

async function testInsert() {
    console.log('--- Testing User Insert Policy ---');

    // 1. Create a throwaway user
    const email = `test.insert.${Date.now()}@example.com`;
    const password = 'checklimit123';

    console.log(`1. Creating auth user: ${email}`);
    const { data: auth, error: authErr } = await supabase.auth.signUp({ email, password });

    if (authErr) {
        console.error('❌ Auth SignUp failed:', authErr.message);
        return;
    }

    const id = auth.user.id;
    console.log(`✅ Auth user created: ${id}`);

    // 2. Sign In to get token
    console.log('2. Signing In...');
    const { data: session, error: signErr } = await supabase.auth.signInWithPassword({ email, password });

    if (signErr || !session.session) {
        console.error('❌ SignIn failed:', signErr?.message);
        return;
    }

    const token = session.session.access_token;
    console.log('✅ Signed In. Token obtained.');

    // 3. Create scoped client
    const userClient = createClient(url, key, {
        global: { headers: { Authorization: `Bearer ${token}` } }
    });

    // 4. Try Insert into public.users
    console.log('3. Attempting Insert into public.users...');
    const { error: insErr } = await userClient.from('users').insert({
        id: id,
        email: email,
        name: 'Test Insert User',
        role: 'client',
        wallet_balance: 0
    });

    if (insErr) {
        console.error('❌ Insert FAILED:', insErr.message);
        console.error('   Code:', insErr.code);
        console.error('   Hint:', insErr.hint);
        if (insErr.message.includes('row-level security')) {
            console.log('\n🚨 DIAGNOSIS: The database is missing an INSERT policy for the "users" table.');
            console.log('   Users cannot create their own records.');
        }
    } else {
        console.log('✅ Insert SUCCEEDED! RLS allows insert.');
    }
}

testInsert();
