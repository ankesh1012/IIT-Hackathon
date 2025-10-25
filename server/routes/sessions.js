// server/routes/sessions.js

const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/sessionController');
const { protect } = require('../middleware/auth');

// @route   GET /api/sessions/public
// @desc    Get all public sessions
// @access  Public
router.get('/public', sessionController.getAllPublicSessions); // <-- NEW PUBLIC ROUTE

// @route   POST /api/sessions
// @desc    Create a new session (Protected by auth)
// @access  Private
router.post('/', protect, sessionController.createSession);

// @route   GET /api/sessions/me
// @desc    Get sessions for the logged-in user
// @access  Private
router.get('/me', protect, sessionController.getSessionsForUser);

// @route   POST /api/sessions/:id/join
// @desc    Join a session
// @access  Private
router.post('/:id/join', protect, sessionController.joinSession);

module.exports = router;