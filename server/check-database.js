const dotenv = require('dotenv');
const { createClient } = require('@supabase/supabase-js');

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkDatabase() {
    console.log('\n📊 Checking existing database tables...\n');

    const tables = [
        'users',
        'profiles',
        'services',
        'orders',
        'reviews',
        'jobs',
        'applications',
        'messages',
        'notifications',
        'wallets'
    ];

    for (const table of tables) {
        const { data, error, count } = await supabase
            .from(table)
            .select('*', { count: 'exact', head: true });

        if (error) {
            if (error.code === 'PGRST116') {
                console.log(`❌ ${table.padEnd(20)} - Table does not exist`);
            } else {
                console.log(`⚠️  ${table.padEnd(20)} - Error: ${error.message}`);
            }
        } else {
            console.log(`✅ ${table.padEnd(20)} - Exists (${count || 0} rows)`);
        }
    }

    console.log('\n');
}

checkDatabase();
