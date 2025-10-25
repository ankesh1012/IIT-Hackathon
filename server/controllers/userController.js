const User = require('../models/User');
const Skill = require('../models/Skill');

// @desc    Get current logged in user's profile
// @route   GET /api/users/me
// @access  Private

// --- THIS IS THE CORRECTED FUNCTION ---
// It now fetches the user from the DB and populates the skills.
exports.getMe = async (req, res) => {
  try {
    // req.user only has the ID. Re-fetch from DB to populate skills.
    const user = await User.findById(req.user._id).populate('skills');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
// ------------------------------------

// @desc    Update current logged in user's profile
// @route   PUT /api/users/me
// @access  Private
exports.updateMe = async (req, res) => {
  try {
    // Get user from the 'protect' middleware
    // We must select '+password' to get the field for comparison
    const user = await User.findById(req.user._id).select('+password');

    if (user) {
      // Get data from the request body
      const { username, bio, location, skills, currentPassword, newPassword } = req.body;

      // Update basic profile fields
      user.name = username || user.name;
      user.bio = bio !== undefined ? bio : user.bio;
      user.location = location !== undefined ? location : user.location;

      // Handle password change
      if (currentPassword && newPassword) {
        const isMatch = await user.comparePassword(currentPassword);

        if (!isMatch) {
          return res.status(401).json({ message: 'Invalid current password' });
        }
        user.password = newPassword; // 'pre-save' hook will hash this
      }

      // Handle skills (String array -> ObjectId array)
      if (skills && Array.isArray(skills)) {
        const skillIds = await Promise.all(
          skills.map(async (skillName) => {
            let skill = await Skill.findOne({
              name: { $regex: new RegExp(`^${skillName}$`, 'i') },
            });
            if (!skill) {
              skill = new Skill({ name: skillName });
              await skill.save();
            }
            return skill._id;
          })
        );
        user.skills = skillIds;
      }

      // Save the updated user
      const updatedUser = await user.save();

      // Re-fetch to populate skills, as .save() doesn't populate
      const populatedUser = await User.findById(updatedUser._id).populate('skills');
      
      res.status(200).json(populatedUser);

    } else {
      return res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all users
exports.getUsers = async (req, res) => {
  try {
    const { search, location, radius } = req.query;
    
    let query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { bio: { $regex: search, $options: 'i' } },
      ];
    }

    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    const users = await User.find(query)
      .populate('skills')
      .select('-password')
      .sort('-rating');

    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get user by ID
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate('skills')
      .select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update user
exports.updateUser = async (req, res) => {
  try {
    if (req.user._id.toString() !== req.params.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { name, location, bio, avatar } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, location, bio, avatar },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete user
exports.deleteUser = async (req, res) => {
  try {
    if (req.user._id.toString() !== req.params.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};