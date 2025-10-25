const Skill = require('../models/Skill');
const User = require('../models/User');

// @desc    Get all skills
exports.getSkills = async (req, res) => {
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

// @desc    Create new skill
exports.createSkill = async (req, res) => {
  try {
    const { name, category, description, level, availability } = req.body;

    const skill = await Skill.create({
      name,
      category,
      description,
      level,
      availability,
      user: req.user._id,
    });

    // Add skill to user's skills array
    await User.findByIdAndUpdate(
      req.user._id,
      { $push: { skills: skill._id } }
    );

    const populatedSkill = await Skill.findById(skill._id)
      .populate('user', 'name location rating reviewCount');

    res.status(201).json(populatedSkill);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update skill
exports.updateSkill = async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);

    if (!skill) {
      return res.status(404).json({ message: 'Skill not found' });
    }

    // Check if user owns the skill
    if (skill.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { name, category, description, level, availability } = req.body;

    const updatedSkill = await Skill.findByIdAndUpdate(
      req.params.id,
      { name, category, description, level, availability },
      { new: true, runValidators: true }
    ).populate('user', 'name location rating reviewCount');

    res.json(updatedSkill);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete skill
exports.deleteSkill = async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);

    if (!skill) {
      return res.status(404).json({ message: 'Skill not found' });
    }

    // Check if user owns the skill
    if (skill.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Skill.findByIdAndDelete(req.params.id);

    // Remove skill from user's skills array
    await User.findByIdAndUpdate(
      req.user._id,
      { $pull: { skills: req.params.id } }
    );

    res.json({ message: 'Skill deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};