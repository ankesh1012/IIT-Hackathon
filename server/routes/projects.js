// server/routes/projects.js

const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const { protect } = require('../middleware/auth');

// @route   GET /api/projects/me 
// @desc    Get all projects created or joined by the logged-in user
// @access  Private
router.get('/me', protect, projectController.getProjectsForUser); // <--- NEW ROUTE

// @route   GET /api/projects
// @desc    Get all open projects (Marketplace view)
// @access  Public
router.get('/', projectController.getProjects);

// @route   POST /api/projects
// @desc    Create a new community project
// @access  Private
router.post('/', protect, projectController.createProject);

// @route   POST /api/projects/:id/join
// @desc    User joins a project
// @access  Private
router.post('/:id/join', protect, projectController.joinProject);

module.exports = router;