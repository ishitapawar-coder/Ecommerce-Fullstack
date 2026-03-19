// middleware/auth.js
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }
    
    const user = await User.findOne({ 
      authToken: token,
      tokenExpires: { $gt: new Date() }
    });
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid or expired token.' });
    }
    
    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({ message: 'Token verification failed' });
  }
};

module.exports = auth;