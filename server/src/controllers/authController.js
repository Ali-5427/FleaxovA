const supabase = require('../config/supabase');
// Simple in-memory OTP store for demo purposes
const otpStore = {};
const crypto = require('crypto');

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
    try {
        const { name, email, password, role } = req.body;

        // Register in Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    name,
                    role: role || 'client'
                }
            }
        });

        if (authError) return res.status(400).json({ success: false, message: authError.message });

        // Add to public.users table (Sync)
        const { error: dbError } = await supabase.from('users').insert({
            id: authData.user.id,
            name,
            email,
            role: role || 'client'
        });

        // Generate a mock OTP for demo purposes (6‑digit numeric)
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        // Store otp AND password explicitly for the verify step (Demo only!)
        otpStore[email] = { otp, password, userId: authData.user.id };
        console.log(`Generated OTP for ${email}: ${otp}`);

        if (dbError) console.error('Error syncing to public users:', dbError.message);

        res.status(200).json({
            success: true,
            message: 'Registration successful. Please check your email for verification link.',
            data: authData.user,
            otp_mock: otp // send mock OTP to frontend for demo
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) {
            return res.status(401).json({ success: false, message: error.message });
        }

        res.status(200).json({
            success: true,
            token: data.session.access_token,
            user: data.user
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Verify email OTP (demo)
// @route   POST /api/auth/verify-email
// @access  Public
exports.verifyEmail = async (req, res, next) => {
    try {
        const { email, otp } = req.body;
        const storedData = otpStore[email];

        if (!storedData) {
            return res.status(400).json({ success: false, message: 'No OTP found for this email (or it expired).' });
        }

        // Handle both simple string (old way) and object (new way)
        const storedOtp = typeof storedData === 'string' ? storedData : storedData.otp;

        if (storedOtp !== otp) {
            return res.status(400).json({ success: false, message: 'Invalid OTP.' });
        }

        // Try to confirm email using Admin API if available
        if (storedData.userId && supabase.auth.admin) {
            const { error: verifyError } = await supabase.auth.admin.updateUserById(
                storedData.userId,
                { email_confirm: true }
            );
            if (verifyError) {
                console.log('Admin verify failed (possibly due to key permissions):', verifyError.message);
            }
        }

        // Sign in to get token
        const passwordToUse = storedData.password;

        if (passwordToUse) {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password: passwordToUse
            });

            if (error) {
                return res.status(401).json({ success: false, message: error.message });
            }

            // Cleanup
            delete otpStore[email];

            return res.status(200).json({
                success: true,
                token: data.session.access_token,
                user: data.user
            });
        } else {
            // Fallback for old sessions or missing password
            return res.status(400).json({ success: false, message: 'Session expired, please login manually.' });
        }

    } catch (err) {
        next(err);
    }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
    try {
        const { data: user, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', req.user.id)
            .single();

        if (error) return res.status(404).json({ success: false, message: 'User not found' });

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (err) {
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
        const { name, companyName, companyWebsite, companyIndustry } = req.body;

        const { data: user, error } = await supabase
            .from('users')
            .update({
                name,
                company_name: companyName,
                company_website: companyWebsite,
                company_industry: companyIndustry
            })
            .eq('id', req.user.id)
            .select()
            .single();

        if (error) return res.status(400).json({ success: false, message: error.message });

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (err) {
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
