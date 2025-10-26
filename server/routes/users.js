// server/routes/users.js

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect } = require('../middleware/auth');

// --- ADD THIS NEW ROUTE ---
// @route   GET /api/users/search
// @desc    Search for users
// @access  Public
router.get('/search', userController.searchUsers);
// --------------------------

// @route   GET /api/users/me
// @desc    Get current logged in user's profile
// @access  Private
router.get('/me', protect, userController.getMe);

// @route   PUT /api/users/me
// @desc    Update current logged in user's profile
// @access  Private
router.put('/me', protect, userController.updateMe);

// @route   GET /api/users
// @desc    Get all users
// @access  Public
router.get('/', userController.getUsers);

// @route   GET /api/users/:id
// @desc    Get user by ID
// @access  Public
router.get('/:id', userController.getUser);

// @route   PUT /api/users/:id
// @desc    Update user
// @access  Private
router.put('/:id', protect, userController.updateUser);

// @route   DELETE /api/users/:id
// @desc    Delete user
// @access  Private
router.delete('/:id', protect, userController.deleteUser);

module.exports = router;