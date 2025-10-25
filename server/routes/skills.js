// server/routes/skills.js
const express = require('express');
const router = express.Router();
const skillController = require('../controllers/skillController');
const { protect } = require('../middleware/auth');

// --- ADD THIS NEW ROUTE ---
// @route   GET /api/skills/tags
// @desc    Get all skill names for autocomplete
// @access  Public
router.get('/tags', skillController.getAllSkillTags);
// --------------------------

// @route   GET /api/skills
// @desc    Get all skills (for marketplace/search)
// @access  Public
router.get('/', skillController.getSkills);

// @route   POST /api/skills
// @desc    Create a new skill
// @access  Private
router.post('/', protect, skillController.createSkill);

// @route   PUT /api/skills/:id
// @desc    Update skill
// @access  Private
router.put('/:id', protect, skillController.updateSkill);

// @route   DELETE /api/skills/:id
// @desc    Delete skill
// @access  Private
router.delete('/:id', protect, skillController.deleteSkill);

module.exports = router;