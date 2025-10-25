// server/controllers/skillController.js
const Skill = require('../models/Skill');
const User = require('../models/User');

// --- ADD THIS NEW FUNCTION ---
// @desc    Get all skill tags for autocomplete
// @route   GET /api/skills/tags
// @access  Public
exports.getAllSkillTags = async (req, res) => {
  try {
    // We only want the 'name' field, sorted alphabetically
    const skills = await Skill.find().select('name').sort('name');
    res.json(skills);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
// ----------------------------


// @desc    Get all skills (for marketplace/search)
exports.getSkills = async (req, res) => {
  // ... (your existing getSkills function is fine)
  try {
    const { search, category, level } = req.query;
    
    let query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    if (category) {
      query.category = category;
    }

    if (level) {
      query.level = level;
    }

    const skills = await Skill.find(query)
      .populate('user', 'name location rating reviewCount')
      .sort('-createdAt');

    res.json(skills);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ... (your other functions: createSkill, updateSkill, deleteSkill)
exports.createSkill = async (req, res) => {
  // ...
};
exports.updateSkill = async (req, res) => {
  // ...
};
exports.deleteSkill = async (req, res) => {
  // ...
};