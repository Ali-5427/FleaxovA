const dotenv = require('dotenv');
const { createClient } = require('@supabase/supabase-js');

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkUser(email) {
    console.log(`\n🔍 Checking for user: ${email}\n`);

    // Check Auth
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();

    if (authError) {
        console.error('❌ Error listing auth users (needs service role key):', authError.message);
    } else {
        const user = authUsers.users.find(u => u.email === email);
        if (user) {
            console.log('✅ User found in Supabase Auth:');
            console.log(`   ID: ${user.id}`);
            console.log(`   Email Confirmed: ${user.email_confirmed_at ? 'Yes' : 'No'}`);
            console.log(`   Last Sign In: ${user.last_sign_in_at || 'Never'}`);
        } else {
            console.log('❌ User NOT found in Supabase Auth');
        }
    }

    // Check Public Users Table
    const { data: dbUser, error: dbError } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

    if (dbError) {
        console.log(`❌ User NOT found in public.users table: ${dbError.message}`);
    } else {
        console.log('✅ User found in public.users table:');
        console.log(dbUser);
    }

    // Check Profiles Table
    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', dbUser?.id || '00000000-0000-0000-0000-000000000000')
        .single();

    if (profileError) {
        console.log(`❌ Profile NOT found: ${profileError.message}`);
    } else {
        console.log('✅ Profile found:');
        console.log(profile);
    }
}

// Pass the email you tried to register with here
const testEmail = process.argv[2] || 'test@example.com';
checkUser(testEmail);
