const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect } = require('../middleware/auth');

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