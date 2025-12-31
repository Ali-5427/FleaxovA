const supabase = require('../config/supabase');
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

        if (dbError) console.error('Error syncing to public users:', dbError.message);

        res.status(200).json({
            success: true,
            message: 'Registration successful. Please check your email for verification link.',
            data: authData.user
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
