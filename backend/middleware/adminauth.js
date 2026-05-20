import jwt from 'jsonwebtoken';

const adminauth = (req, res, next) => {
    try { 
        const token = req.headers.authorization?.split(' ')[1] || req.headers.authorization;
          if (!token) {
            
            return res.status(401).json({ success: false, message: 'Access denied. No token provided.' });
        }

        const decoded=jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.id !== 'admin_' + process.env.ADMIN_EMAIL) {
            return res.status(403).json({ success: false, message: 'Access denied. Not an admin.' });
        }
        req.admin = decoded;
        next();
    } catch (error) {
        console.error('❌ Error in admin auth middleware:', error.message);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }   
};

export default adminauth;