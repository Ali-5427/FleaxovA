const dotenv = require('dotenv');
dotenv.config();

const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
const url = process.env.SUPABASE_URL;

console.log('--- JWT Diagnostic ---');
if (!key || !key.includes('.')) {
    console.log('❌ Invalid Key format');
} else {
    try {
        const parts = key.split('.');
        const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());

        console.log('✅ Key decoded successfully');
        console.log('🔑 Key Audience:', payload.aud);
        console.log('🔑 Key Role:', payload.role);

        // Check for project reference - this is often in the issuer or specific fields
        const projectIdFromUrl = url.match(/https:\/\/(.*?)\.supabase/)?.[1];
        console.log('🌍 URL Project ID:', projectIdFromUrl);

        if (payload.iss && payload.iss.includes(projectIdFromUrl)) {
            console.log('✅ Key matches Project URL');
        } else {
            console.log('❌ KEY PROJECT MISMATCH!');
            console.log('   Key Issuer contains:', payload.iss);
        }
    } catch (e) {
        console.log('❌ Could not decode JWT payload:', e.message);
    }
}
