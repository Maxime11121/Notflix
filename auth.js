const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

// CRITICAL: Don't allow app to run without proper secret
if (!JWT_SECRET || JWT_SECRET === 'your-secret-key-change-in-production') {
    if (process.env.NODE_ENV === 'production') {
        console.error('❌ FATAL: JWT_SECRET must be set in production!');
        process.exit(1);
    } else {
        console.warn('⚠️ WARNING: Using default JWT_SECRET. Set JWT_SECRET env var for production!');
    }
}

const SECRET = JWT_SECRET || 'dev-secret-change-in-production-' + require('crypto').randomBytes(32).toString('hex');

const generateToken = (userId, expiresIn = '7d') => {
    return jwt.sign({ userId }, SECRET, { expiresIn });
};

const verifyToken = (token) => {
    try {
        return jwt.verify(token, SECRET);
    } catch (error) {
        return null;
    }
};

const decodeToken = (token) => {
    try {
        return jwt.decode(token);
    } catch (error) {
        return null;
    }
};

module.exports = {
    generateToken,
    verifyToken,
    decodeToken,
    JWT_SECRET: SECRET
};