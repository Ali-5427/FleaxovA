const dotenv = require('dotenv');
const { createClient } = require('@supabase/supabase-js');

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

console.log('\n🔍 Testing Supabase Connection...\n');

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase credentials!');
    console.log('SUPABASE_URL:', supabaseUrl ? '✓ Set' : '✗ Missing');
    console.log('SUPABASE_KEY:', supabaseKey ? '✓ Set' : '✗ Missing');
    process.exit(1);
}

console.log('✅ Environment variables found:');
console.log('   SUPABASE_URL:', supabaseUrl);
console.log('   SUPABASE_KEY:', supabaseKey.substring(0, 20) + '...');

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
    try {
        console.log('\n🔌 Attempting to connect to Supabase...');

        // Test 1: Try to list tables
        const { data: tables, error: tablesError } = await supabase
            .from('users')
            .select('*', { count: 'exact', head: true });

        if (tablesError) {
            if (tablesError.code === 'PGRST116') {
                console.log('⚠️  Users table does not exist yet (this is normal for new projects)');
                console.log('✅ Supabase connection is WORKING!');
            } else {
                console.error('❌ Error querying users table:', tablesError.message);
                console.error('   Error Code:', tablesError.code);
            }
        } else {
            console.log('✅ Supabase connection is WORKING!');
            console.log('✅ Users table exists and is accessible');
        }

        // Test 2: Check Supabase Auth
        console.log('\n🔐 Testing Supabase Auth...');
        const { data: authData, error: authError } = await supabase.auth.getSession();

        if (authError) {
            console.error('❌ Auth error:', authError.message);
        } else {
            console.log('✅ Supabase Auth is accessible');
        }

        console.log('\n✨ Connection test complete!\n');

    } catch (error) {
        console.error('\n❌ Connection test failed:', error.message);
        console.error('Full error:', error);
    }
}

testConnection();
