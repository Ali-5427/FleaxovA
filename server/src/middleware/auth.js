const supabase = require('../config/supabase');

// Protect routes
exports.protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    try {
        // Get user from Supabase Auth
        const { data: { user }, error } = await supabase.auth.getUser(token);

        if (error || !user) {
            console.error('🔓 Auth Failure:', error?.message || 'No user found');
            return res.status(401).json({ success: false, message: 'Invalid token' });
        }

        // Fetch additional details from public.users
        const { data: dbUser } = await supabase
            .from('users')
            .select('*')
            .eq('id', user.id)
            .maybeSingle();

        req.user = dbUser || {
            id: user.id,
            email: user.email,
            role: user.user_metadata?.role || 'client',
            name: user.user_metadata?.name || user.email.split('@')[0],
            wallet_balance: 0
        };
        next();
    } catch (err) {
        return res.status(401).json({ success: false, message: 'Not authorized' });
    }
};

// Grant access to specific roles
exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `User role ${req.user.role} is not authorized to access this route`
            });
        }
        next();
    };
};
