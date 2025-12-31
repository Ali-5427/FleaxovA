const supabase = require('../config/supabase');

// @desc    Get current user's profile
// @route   GET /api/profiles/me
// @access  Private
exports.getMyProfile = async (req, res, next) => {
    try {
        const { data: profile, error } = await supabase
            .from('profiles')
            .select('*, user:users(name, email)')
            .eq('user_id', req.user.id)
            .single();

        if (error || !profile) {
            return res.status(404).json({ success: false, message: 'Profile not found' });
        }

        res.status(200).json({ success: true, data: profile });
    } catch (err) {
        next(err);
    }
};

// @desc    Create or update profile
// @route   POST /api/profiles
// @access  Private
exports.updateProfile = async (req, res, next) => {
    try {
        const { title, bio, skills, portfolio, socials } = req.body;

        const profileFields = {
            user_id: req.user.id,
            title,
            bio,
            skills: Array.isArray(skills) ? skills : (skills ? skills.split(',').map(s => s.trim()) : []),
            portfolio,
            social_links: socials || {}
        };

        const { data: profile, error } = await supabase
            .from('profiles')
            .upsert(profileFields, { onConflict: 'user_id' })
            .select()
            .single();

        if (error) throw error;

        res.json({ success: true, data: profile });
    } catch (err) {
        next(err);
    }
};

// @desc    Get all profiles
// @route   GET /api/profiles
// @access  Public
exports.getProfiles = async (req, res, next) => {
    try {
        const { data: profiles, error } = await supabase
            .from('profiles')
            .select('*, user:users(name, email)');

        if (error) throw error;

        res.json({ success: true, count: profiles.length, data: profiles });
    } catch (err) {
        next(err);
    }
};
