const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const authController = require('../controllers/userController');

const router = express.Router();

// ====== Ensure 'uploads' folder exists ======
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
    try {
        fs.mkdirSync(uploadDir);
    } catch (error) {
        console.error('Error creating uploads directory:', error);
    }
}

// ====== Multer Configuration ======
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    }
});

// File filter for validation (only images)
const fileFilter = (req, file, cb) => {
    const allowedFileTypes = /jpeg|jpg|png|gif/;
    const isValid = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
    
    if (isValid) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed!'), false);
    }
};

// Set file size limit (e.g., 5MB)
const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

// Routes
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/me', authController.authenticateUser, authController.getUserProfile);
router.post('/upload-profile-pic', authController.authenticateUser, upload.single('profilePic'), (req, res) => {
    res.status(200).json({
        message: 'Profile picture uploaded successfully!',
        file: req.file
    });
});

module.exports = router;
