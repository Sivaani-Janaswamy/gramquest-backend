const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');

// Set up file storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Folder where the images will be saved
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
    }
});
const upload = multer({ storage: storage });
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
      },
      email: {
        type: String,
        required: true,
        unique: true
      },
      password: {
        type: String,
        required: true
      },
      profilePic: {
        type: String,
        default: '' 
    },
     createdAt: {
      type: Date,
     default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema);
