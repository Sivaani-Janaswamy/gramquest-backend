const jwt = require('jsonwebtoken');
const User = require('../models/User');  // Assuming the User model exists

const verifyToken = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');  // Assuming token is sent as a Bearer token

  if (!token) {
    return res.status(401).json({ message: 'Access denied, no token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);  // Use your secret key here
    req.user = await User.findById(decoded.userId);  // Attach user info to the request object
    if (!req.user) {
      return res.status(401).json({ message: 'User not found' });
    }
    next();
  } catch (err) {
    console.error('Error verifying token:', err);
    res.status(400).json({ message: 'Invalid token' });
  }
};

module.exports = {verifyToken};
