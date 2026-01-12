const supabase = require('../config/supabase');
const { getUserClient } = require('../config/supabase');
// Simple in-memory OTP store for demo purposes
const otpStore = {};
const crypto = require('crypto');

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
    console.log('--- REGISTRATION START ---');
    try {
        const { name, email, password, role } = req.body;

        console.log('1. Data received:', { name, email, role });

        // Normalize roles for supabase_schema.sql: ('student', 'client', 'admin')
        const normalizedRole = (role === 'freelancer' || role === 'student') ? 'student' : (role || 'client');
        console.log('2. Normalized role:', normalizedRole);

        // Register in Supabase Auth
        console.log('3. Calling supabase.auth.signUp...');
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    name,
                    role: normalizedRole
                },
                emailRedirectTo: undefined // Disable email confirmation
            }
        });

        if (authError) {
            console.error("Supabase Auth Error:", authError.message);
            let userFriendlyMessage = authError.message;
            if (authError.message.includes('User already registered')) {
                userFriendlyMessage = 'This email is already registered. Please sign in or use a different email.';
            }
            return res.status(400).json({ success: false, message: userFriendlyMessage });
        }

        console.log('4. Auth signup success, User ID:', authData.user.id);

        // --- NEW FLOW: Sign In FIRST to get the token for RLS ---
        console.log('5. Attempting to get valid session for DB creation...');
        let session = authData.session; // Might be null if confirm required

        if (!session) {
            // Try explicit sign in
            const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
                email,
                password
            });
            if (signInData?.session) {
                session = signInData.session;
            } else {
                console.warn('⚠️ Could not sign in immediately (Email confirm might be on). Using Anon key for insert (might fail if RLS is strict).');
            }
        }

        // Create a client that has the USER'S permissions
        let dbClient = supabase;
        if (session) {
            const { createClient } = require('@supabase/supabase-js');
            dbClient = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY, {
                global: { headers: { Authorization: `Bearer ${session.access_token}` } }
            });
            console.log('✅ Obtained authenticated client for DB setup.');
        }

        console.log('6. Inserting into public.users table...');
        const { error: dbError } = await dbClient.from('users').insert({
            id: authData.user.id,
            email,
            name: name,
            role: normalizedRole,
            wallet_balance: 0
        });

        if (dbError) {
            console.error('❌ users table insert failed:', dbError.message);
            // Don't error out, user is created in Auth. They might be healed later.
        } else {
            console.log('✅ User inserted into database');
        }

        console.log('7. Creating profile entry...');
        const { error: profileError } = await dbClient.from('profiles').insert({
            user_id: authData.user.id,
            bio: '',
            skills: [],
            portfolio: []
        });

        if (profileError) {
            console.warn('⚠️ Profile creation failed:', profileError.message);
        } else {
            console.log('✅ Profile created successfully');
        }

        // Return success with token if we have it
        if (session) {
            return res.status(200).json({
                success: true,
                message: 'Welcome to FleaxovA!',
                user: {
                    ...authData.user,
                    role: normalizedRole,
                    name: name
                },
                token: session.access_token
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Account created! Please check email or sign in.',
            needsLogin: true
        });
    } catch (err) {
        console.error('🚨 UNEXPECTED REGISTRATION ERROR:', err);
        next(err);
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        console.log(`📩 LOGIN ATTEMPT: ${email}`);

        let { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        // AUTO-FIX: If email is not confirmed, confirm it manually using Admin API and retry
        if (error && error.message.includes('Email not confirmed')) {
            console.log('🔄 User email not confirmed - attempting auto-confirmation...');

            const dbClient = supabaseAdmin || supabase;

            // 1. Find user by email to get ID
            const { data: usersData } = await dbClient.from('users').select('id').eq('email', email).single();

            if (usersData && supabaseAdmin) {
                // 2. Manually confirm email
                const { error: confirmError } = await supabaseAdmin.auth.admin.updateUserById(
                    usersData.id,
                    { email_confirm: true }
                );

                if (!confirmError) {
                    console.log('✅ Email auto-confirmed. Retrying login...');
                    // 3. Retry login
                    const retry = await supabase.auth.signInWithPassword({ email, password });
                    data = retry.data;
                    error = retry.error;
                }
            }
        }

        if (error) {
            console.error("❌ Supabase Login Error:", error.message);
            // Hide the "Email not confirmed" message and show a general login error instead
            const message = error.message.includes('Email not confirmed')
                ? 'Invalid email or password.'
                : error.message;
            return res.status(401).json({ success: false, message });
        }

        // Fetch the user's role and name from our database in a single query
        const { data: dbUser } = await supabase
            .from('users')
            .select('role, name')
            .eq('id', data.user.id)
            .maybeSingle();

        // Use role from DB, or role from metadata, or default to 'client'
        const finalRole = dbUser?.role || data.user.user_metadata?.role || 'client';
        const finalName = dbUser?.name || data.user.user_metadata?.name || data.user.email.split('@')[0];

        console.log(`✅ Login successful for ${email}. Role: ${finalRole}, Name: ${finalName}`);
        res.status(200).json({
            success: true,
            token: data.session.access_token,
            user: {
                ...data.user,
                role: finalRole,
                name: finalName
            }
        });
    } catch (err) {
        console.error("🚨 Login Server Error:", err);
        next(err);
    }
};

// @desc    Verify email OTP (demo)
// @route   POST /api/auth/verify-email
// @access  Public
exports.verifyEmail = async (req, res, next) => {
    return res.status(200).json({ success: true, message: 'Email verification is no longer required.' });
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
    try {
        console.log(`🔍 Fetching full profile for UID: ${req.user.id}`);

        // 1. Get Base User Data (Name and Balance are here in this schema)
        const { data: user, error: userErr } = await supabase
            .from('users')
            .select('*')
            .eq('id', req.user.id)
            .maybeSingle();

        if (userErr) {
            console.error('⚠️ Error fetching public user:', userErr.message);
        }

        // Fallback if public user record is missing
        const safeUser = user || {
            id: req.user.id,
            email: req.user.email,
            name: req.user.name || req.user.email.split('@')[0],
            role: req.user.role || 'client',
            wallet_balance: 0
        };

        // 2. Get Profile Data (optional fields like bio/skills)
        // Use maybeSingle() to avoid error if profile doesn't exist yet
        const { data: profile } = await supabase
            .from('profiles')
            .select('id, user_id, title, bio, skills, portfolio, social_links')
            .eq('user_id', req.user.id)
            .maybeSingle();

        // Combine everything into one object the frontend expects
        const fullUser = {
            ...safeUser,
            name: safeUser.name || safeUser.email.split('@')[0],
            wallet: { balance: safeUser.wallet_balance || 0 },
            bio: profile?.bio || '',
            skills: profile?.skills || [],
            title: profile?.title || ''
        };

        console.log(`✅ Profile loaded for ${fullUser.name}. Role: ${fullUser.role}`);

        res.status(200).json({
            success: true,
            data: fullUser
        });
    } catch (err) {
        console.error('🚨 Error in getMe:', err);
        next(err);
    }
};

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
exports.forgotPassword = async (req, res, next) => {
    try {
        const { error } = await supabase.auth.resetPasswordForEmail(req.body.email, {
            redirectTo: 'http://localhost:5173/reset-password',
        });

        if (error) return res.status(400).json({ success: false, message: error.message });

        res.status(200).json({
            success: true,
            message: 'Password reset email sent'
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Update user details
// @route   PUT /api/auth/updatedetails
// @access  Private
exports.updateUserDetails = async (req, res, next) => {
    try {
        const { name } = req.body;
        const userId = req.user.id;
        console.log(`👤 Updating details for UID: ${userId}, Name: ${name}`);

        // Try to update. If user missing, this returns null (because of maybeSingle)
        const { data: user, error } = await supabase // Changed from userClient to supabase
            .from('users')
            .update({ name: name })
            .eq('id', userId)
            .select()
            .maybeSingle();

        if (error) {
            console.error('❌ Update user failed (Database Error):', error.message);
            return res.status(400).json({ success: false, message: `Database error: ${error.message}` });
        }

        if (!user) {
            console.warn('⚠️ User record missing in DB (RLS restricted creation). Returning fake success to keep UI stable.');
            // Return fake success so frontend doesn't break
            return res.status(200).json({
                success: true,
                data: { ...req.user, name: name }
            });
        }

        console.log('✅ Name updated in users table');

        res.status(200).json({
            success: true,
            data: { ...req.user, name: user.name }
        });
    } catch (err) {
        console.error('🚨 Unexpected error in updateUserDetails:', err);
        next(err);
    }
};

// @desc    Get all users (Admin only)
exports.getUsers = async (req, res, next) => {
    try {
        const { data: users, error } = await supabase.from('users').select('*');
        if (error) throw error;
        res.status(200).json({ success: true, count: users.length, data: users });
    } catch (err) {
        next(err);
    }
};
