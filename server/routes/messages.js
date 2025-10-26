// server/routes/messages.js
const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const { protect } = require('../middleware/auth');

// @route   GET /api/messages/:otherUserId
// @desc    Get 1:1 message history
// @access  Private
router.get('/:otherUserId', protect, messageController.getMessageHistory);

module.exports = router;