const supabase = require('../config/supabase');
const { getUserClient } = require('../config/supabase');

// @desc    Get current user's profile
// @route   GET /api/profiles/me
// @access  Private
exports.getMyProfile = async (req, res, next) => {
    try {
        const { data: profile, error } = await supabase
            .from('profiles')
            .select('id, user_id, title, bio, skills, portfolio, social_links, user:users(email, name)')
            .eq('user_id', req.user.id)
            .maybeSingle();

        if (error || !profile) {
            return res.status(404).json({ success: false, message: 'Profile not found' });
        }

        // Map schema columns back to frontend expected format
        const mappedProfile = {
            ...profile,
            socials: profile.social_links || {},
            // Convert portfolio array of strings back to array of objects if frontend expects that
            portfolio: Array.isArray(profile.portfolio) ? profile.portfolio.map(url => ({ url, title: 'Project' })) : []
        };

        res.status(200).json({ success: true, data: mappedProfile });
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
        const userId = req.user.id;

        // Use a client scoped to the user's token to satisfy RLS while avoiding the broken service key
        const userClient = getUserClient(req);

        // Map frontend fields back to the correct schema columns (supabase_schema.sql)
        const profileFields = {
            user_id: userId,
            title,
            bio,
            skills: Array.isArray(skills) ? skills : (skills ? skills.split(',').map(s => s.trim()) : []),
            portfolio: Array.isArray(portfolio) ? portfolio.map(p => typeof p === 'string' ? p : p.url) : [],
            social_links: socials || {}
        };

        // --- HEALING LOGIC START ---
        // Ensure user exists in public.users to prevent Foreign Key violation
        const { data: userCheck } = await supabase.from('users').select('id').eq('id', userId).maybeSingle();
        if (!userCheck) {
            console.log(`🚑 Healing: User ${userId} missing in public.users. Re-inserting...`);
            // Use userClient so RLS policy (auth.uid() = id) allows the insert
            const { error: insertError } = await userClient.from('users').insert({
                id: userId,
                email: req.user.email,
                name: req.user.name || 'Recovered User',
                role: 'client',
                wallet_balance: 0
            });
            if (insertError) {
                console.error('❌ Healing failed:', insertError.message);
                // Return a clear error to the user if we can't fix their account
                return res.status(500).json({
                    success: false,
                    message: 'Account synchronization error. Your user record is missing and cannot be automatically recovered. Please create a new account.'
                });
            } else {
                console.log('✅ User healed successfully.');
            }
        }
        // --- HEALING LOGIC END ---

        // Check if profile exists
        const { data: existingProfile } = await userClient
            .from('profiles')
            .select('id')
            .eq('user_id', userId)
            .maybeSingle();

        let operation;
        if (existingProfile) {
            // Update
            operation = userClient
                .from('profiles')
                .update(profileFields)
                .eq('user_id', userId);
        } else {
            // Insert
            operation = userClient
                .from('profiles')
                .insert(profileFields);
        }

        const { data: profile, error } = await operation
            .select('id, user_id, title, bio, skills, portfolio, social_links')
            .maybeSingle();

        if (error) {
            console.error('❌ Profile save failed:', error.message);
            throw error;
        }

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
            .select('id, user_id, title, bio, skills, portfolio, social_links, user:users(email, name)');

        if (error) throw error;

        res.json({ success: true, count: profiles.length, data: profiles });
    } catch (err) {
        next(err);
    }
};
