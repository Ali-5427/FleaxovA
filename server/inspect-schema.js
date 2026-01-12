const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(url, key);

async function checkSchema() {
    console.log('--- Deep Schema Inspection ---');

    // Attempt to select multiple common columns at once
    const candidates = ['full_name', 'fullName', 'fullname', 'name', 'display_name', 'first_name', 'last_name', 'username', 'user_name'];

    for (const col of candidates) {
        const { error } = await supabase.from('profiles').select(col).limit(1);
        if (!error) {
            console.log(`✅ [FOUND] Column: ${col}`);
        } else {
            // Log the error to see if it gives us hints
            // console.log(`❌ [FAIL] Column ${col}: ${error.message}`);
        }
    }

    // List all columns by trying to select a known bad one and parsing the error
    const { error: hintError } = await supabase.from('profiles').select('non_existent_column_for_hints').limit(1);
    if (hintError) {
        console.log('\n--- Hint from Database Error ---');
        console.log(hintError.message);
    }
}

checkSchema();
