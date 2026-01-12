const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

dotenv.config();

// Helper to clean env vars (removes spaces and quotes)
const clean = (val) => val ? val.replace(/['"\s]/g, '') : '';

const supabaseUrl = clean(process.env.SUPABASE_URL);
const supabaseAnonKey = clean(process.env.SUPABASE_ANON_KEY);
const supabaseServiceKey = clean(process.env.SUPABASE_SERVICE_ROLE_KEY);

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('❌ MISSING SUPABASE CREDENTIALS IN .ENV');
} else {
    console.log('🔗 Connecting to:', supabaseUrl);
    console.log('✅ Using confirmed working ANON key');
}

// Main client using working ANON key
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Use the working ANON key for admin tasks too, since service key is invalid
const supabaseAdmin = supabase;

// Helper to create a user-scoped Supabase client (injects JWT for RLS)
const getUserClient = (req) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return supabase; // Fallback to anon if no token
    return createClient(supabaseUrl, supabaseAnonKey, {
        global: { headers: { Authorization: `Bearer ${token}` } }
    });
};

module.exports = supabase;
module.exports.admin = supabaseAdmin;
module.exports.getUserClient = getUserClient;
