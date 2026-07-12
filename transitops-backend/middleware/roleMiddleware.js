const checkRole = (allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !req.user.role_id) {
            return res.status(401).json({ message: 'Not authorized, no role assigned' });
        }
        
        if (!allowedRoles.includes(req.user.role_id)) {
            return res.status(403).json({ message: 'You do not have permission to perform this action' });
        }
        
        next();
    };
};

module.exports = { checkRole };
