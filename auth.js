const { verifyToken } = require('../config/auth');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }

        const decoded = verifyToken(token);
        
        if (!decoded) {
            return res.status(401).json({ error: 'Invalid token' });
        }

        const user = await User.findById(decoded.userId).select('-password');
        
        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Authentication failed' });
    }
};

module.exports = authMiddleware;