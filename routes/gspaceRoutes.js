const express = require('express');
const router = express.Router();
const gspaceController = require('../controllers/gspaceController');
const { verifyToken } = require('../middleware/authMiddleware');

// Public
router.get('/', gspaceController.getAllGSpaces);
router.get('/:slug', gspaceController.getGSpaceBySlug);

// Auth required
router.post('/', verifyToken, gspaceController.createGSpace);
router.post('/:slug/join', verifyToken, gspaceController.joinGSpace);
router.post('/:slug/leave', verifyToken, gspaceController.leaveGSpace);
router.put('/:slug/like', verifyToken, gspaceController.toggleLikeGSpace);

module.exports = router;
