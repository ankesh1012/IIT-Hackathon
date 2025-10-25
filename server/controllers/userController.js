// server/controllers/userController.js

const User = require('../models/User');
const Skill = require('../models/Skill');

// @desc    Get current logged in user's profile
// @route   GET /api/users/me
// @access  Private
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


// @desc    Search for users by name, location, skills, OR find users with matching skills
// @route   GET /api/users/search
// @access  Public
exports.searchUsers = async (req, res) => {
  try {
    const { name, location, skill, userId } = req.query; // Added userId

    // Build the query object
    let query = {};
    let performSkillMatch = false; // Flag for default skill matching

    // --- Check for standard search criteria ---
    if (name || location || skill) {
      // 1. Add name/bio search
      if (name) {
        query.$or = [
          { name: { $regex: name, $options: 'i' } },
          { bio: { $regex: name, $options: 'i' } }
        ];
      }

      // 2. Add location search
      if (location) {
        if (query.$or) {
          query = {
            $and: [ { $or: query.$or }, { location: { $regex: location, $options: 'i' } } ]
          };
        } else {
          query.location = { $regex: location, $options: 'i' };
        }
      }

      // 3. Add specific skill search
      if (skill) {
        const skillDoc = await Skill.findOne({ name: { $regex: `^${skill}$`, $options: 'i' } });
        if (skillDoc) {
          // If other queries exist, use $and, otherwise just set skills
           if (query.$and || query.$or || query.location) {
             // Need to combine skill query with existing query structure
             if (query.$and) {
               query.$and.push({ skills: skillDoc._id });
             } else if (query.$or){
                 query = {$and: [ {$or: query.$or}, {skills: skillDoc._id} ]};
             } else { // Only location was present before
                 query = {$and: [ {location: query.location}, {skills: skillDoc._id} ]};
             }
           } else {
               query.skills = skillDoc._id; // First/only query term
           }
        } else {
          return res.json([]); // Skill doesn't exist, no matches
        }
      }
    }
    // --- Default Skill Matching Logic ---
    else if (userId) {
      // Only run if NO name, location, or skill query is provided
      const currentUser = await User.findById(userId).select('skills');
      if (currentUser && currentUser.skills && currentUser.skills.length > 0) {
        query.skills = { $in: currentUser.skills }; // Find users with any matching skill ID
        query._id = { $ne: userId }; // Exclude the logged-in user themselves
        performSkillMatch = true; // Indicate we performed the default match
      } else {
         // If logged-in user has no skills, or user not found, show all users (or [])
         // Keep query = {} to fetch all, or return res.json([]) if you prefer empty
      }
    }
    // --- Fallback: No search, not logged in, or logged-in user has no skills ---
    // If query is still {}, it means fetch all users. Add exclusion if userId was provided.
    if (Object.keys(query).length === 0 && userId) {
        query._id = { $ne: userId };
    }

    // Execute the query
    const users = await User.find(query)
      .populate('skills', 'name')
      .select('name bio location skills avatar rating reviewCount')
      .limit(50);

    res.json(users);

  } catch (error) {
    console.error('Error in searchUsers:', error);
    res.status(500).json({ message: 'Server error during user search' });
  }
};