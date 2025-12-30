const Profile = require('../models/Profile');

// @desc    Get current user's profile
// @route   GET /api/profiles/me
// @access  Private
exports.getMyProfile = async (req, res, next) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id }).populate('user', ['name', 'email']);

        if (!profile) {
            return res.status(404).json({ success: false, message: 'There is no profile for this user' });
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
    const {
        title,
        bio,
        skills,
        portfolio,
        socials
    } = req.body;

    // Build profile object
    const profileFields = {};
    profileFields.user = req.user.id;
    if (title) profileFields.title = title;
    if (bio) profileFields.bio = bio;
    if (skills) {
        // Split into array if string comma separated, else assume array
        profileFields.skills = Array.isArray(skills) ? skills : skills.split(',').map(skill => skill.trim());
    }
    if (portfolio) profileFields.portfolio = portfolio;
    if (socials) profileFields.socials = socials;

    try {
        let profile = await Profile.findOne({ user: req.user.id });

        if (profile) {
            // Update
            profile = await Profile.findOneAndUpdate(
                { user: req.user.id },
                { $set: profileFields },
                { new: true }
            );
        } else {
            // Create
            profile = new Profile(profileFields);
            await profile.save();
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
        const profiles = await Profile.find().populate('user', ['name', 'email']);
        res.json({ success: true, count: profiles.length, data: profiles });
    } catch (err) {
        next(err);
    }
};
