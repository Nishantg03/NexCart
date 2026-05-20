import jwt from 'jsonwebtoken';

// Middleware to verify token

const verifyToken = (req, res, next) => {
    try {
        console.log('=== Auth Middleware ===');
        console.log('Authorization header:', req.headers.authorization ? 'Present' : 'Missing');
        
        const token = req.headers.authorization?.split(' ')[1];
        console.log('Token extracted:', token ? `${token.substring(0, 20)}...` : 'No token');
        
        if (!token) {
            console.error('❌ No token provided');
            return res.status(401).json({ success: false, message: 'Access denied. No token provided.' });
        }

        console.log('JWT_SECRET available:', process.env.JWT_SECRET ? 'Yes' : 'No');
        console.log('Verifying token with JWT_SECRET:', process.env.JWT_SECRET);
        
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log('✅ Token verified successfully');
            console.log('Decoded user ID:', decoded.id);
            req.user = decoded;
            next();
        } catch (verifyError) {
            console.error('❌ Token verification failed');
            console.error('Error name:', verifyError.name);
            console.error('Error message:', verifyError.message);
            return res.status(401).json({ success: false, message: 'Invalid or expired token', error: verifyError.message });
        }
    } catch (error) {
        console.error('❌ Error in auth middleware:', error.message);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

export default verifyToken;