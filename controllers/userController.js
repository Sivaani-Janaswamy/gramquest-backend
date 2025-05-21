const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const path = require('path');

// ====== Load environment variables ======
const JWT_SECRET = process.env.JWT_SECRET || 'your_default_secret';
const UPLOAD_DIR = process.env.UPLOAD_DIR || './uploads';

// ====== Signup ======
const signup = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ error: 'User already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password: hashedPassword });
        await newUser.save();

        const token = jwt.sign(
            { userId: newUser._id, name: newUser.name, email: newUser.email },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(201).json({
            message: 'User created successfully',
            token,
            user: {
                _id: newUser._id,
                name: newUser.name,
                email: newUser.email
            }
        });
    } catch (err) {
        console.error('Signup Error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// ====== Login ======
const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ error: 'Invalid email or password' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: 'Invalid email or password' });

        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });

        res.json({
            message: 'Login successful',
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                profilePic: user.profilePic
            }
        });
    } catch (err) {
        console.error('Login Error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// ====== Upload Profile Picture ======
const uploadProfilePic = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    const allowedTypes = ['image/jpeg', 'image/png'];
    if (!allowedTypes.includes(req.file.mimetype)) {
        return res.status(400).json({ message: 'Only JPEG and PNG files are allowed.' });
    }

    const filePath = `${UPLOAD_DIR}/${req.file.filename}`;
    const fullUrl = `${req.protocol}://${req.get('host')}/${filePath}`;

    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.userId,
            { profilePic: fullUrl },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({
            message: 'Profile picture updated successfully',
            profilePic: updatedUser.profilePic
        });
    } catch (err) {
        console.error('Profile Pic Upload Error:', err);
        res.status(500).json({ message: 'Error updating profile picture' });
    }
};

// ====== JWT Auth Middleware ======
const authenticateUser = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ message: 'Authentication token required' });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.userId = decoded.userId;
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId); // Fetch user from database
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ user }); // Return user details
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
    signup,
    login,
    uploadProfilePic,
    authenticateUser,
    getUserProfile
};
