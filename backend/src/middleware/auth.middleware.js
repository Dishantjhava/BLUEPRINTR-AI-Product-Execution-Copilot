const jwt = require('jsonwebtoken');
const User = require('../models/User.model');

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_for_development';

const protect = async (req, res, next) => {
  try {
    const token = req.cookies.blueprintr_token;

    if (!token) {
      return res.status(401).json({ error: 'Not authorized, no token' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = await User.findById(decoded.userId).select('-password');
    
    if (!req.user) {
      return res.status(401).json({ error: 'User not found' });
    }

    next();
  } catch (error) {
    console.error('Auth Middleware Error:', error);
    res.status(401).json({ error: 'Not authorized, token failed' });
  }
};

module.exports = { protect };
