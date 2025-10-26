// server/controllers/userController.js

const User = require('../models/User');
const Skill = require('../models/Skill');

// Function to attach coordinates (for map visualization)
const GEOLOCATIONS = {
    'bhubaneswar, odisha': { lat: 20.2961, lng: 85.8245 }, 'cuttack, odisha': { lat: 20.4625, lng: 85.8829 },
    'puri, odisha': { lat: 19.8138, lng: 85.8315 }, 'rourkela, odisha': { lat: 22.2574, lng: 84.8698 },
    'sambalpur, odisha': { lat: 21.4667, lng: 83.9833 }, 'mumbai, maharashtra': { lat: 19.0760, lng: 72.8777 },
    'delhi, delhi': { lat: 28.7041, lng: 77.1025 }, 'bangalore, karnataka': { lat: 12.9716, lng: 77.5946 },
    'hyderabad, telangana': { lat: 17.3850, lng: 78.4867 }, 'chennai, tamil nadu': { lat: 13.0827, lng: 80.2707 },
    'kolkata, west bengal': { lat: 22.5726, lng: 88.3639 }, 'pune, maharashtra': { lat: 18.5204, lng: 73.8567 },
    'ahmedabad, gujarat': { lat: 23.0225, lng: 72.5714 }, 'jaipur, rajasthan': { lat: 26.9124, lng: 75.7873 },
    'lucknow, uttar pradesh': { lat: 26.8467, lng: 80.9462 },
};
const attachCoordinates = (user) => {
    const locationKey = user.location ? user.location.toLowerCase() : '';
    const coords = GEOLOCATIONS[locationKey] || { lat: 0, lng: 0 };
    return { ...user.toObject(), coords: coords, };
};


// @desc    Get current logged in user's profile
// @route   GET /api/users/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate(['skills', 'learningSkills']);
    if (!user) { return res.status(404).json({ message: 'User not found' }); }
    res.status(200).json(attachCoordinates(user));
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
    const user = await User.findById(req.user._id).select('+password');

    if (user) {
      const { username, bio, location, skills, learningSkills, currentPassword, newPassword } = req.body;
      user.name = username || user.name;
      user.bio = bio !== undefined ? bio : user.bio;
      user.location = location !== undefined ? location : user.location;

      if (currentPassword && newPassword) {
        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) { return res.status(401).json({ message: 'Invalid current password' }); }
        user.password = newPassword;
      }

      // Handle offered skills
      if (skills && Array.isArray(skills)) {
        const skillIds = await Promise.all(
          skills.map(async (skillName) => {
            let skill = await Skill.findOne({ name: { $regex: new RegExp(`^${skillName}$`, 'i') } });
            if (!skill) { skill = new Skill({ name: skillName }); await skill.save(); }
            return skill._id;
          })
        );
        user.skills = skillIds;
      }

      // Handle learningSkills
      if (learningSkills && Array.isArray(learningSkills)) {
        const learningSkillIds = await Promise.all(
          learningSkills.map(async (skillName) => {
            let skill = await Skill.findOne({ name: { $regex: new RegExp(`^${skillName}$`, 'i') } });
            if (!skill) { skill = new Skill({ name: skillName }); await skill.save(); }
            return skill._id;
          })
        );
        user.learningSkills = learningSkillIds;
      }

      const updatedUser = await user.save();
      const populatedUser = await User.findById(updatedUser._id).populate(['skills', 'learningSkills']);
      res.status(200).json(attachCoordinates(populatedUser));

    } else {
      return res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all users (Used by GET /api/users)
exports.getUsers = async (req, res) => {
  try {
    const { search, location, radius } = req.query;
    let query = {};
    if (search) { query.$or = [ { name: { $regex: search, $options: 'i' } }, { bio: { $regex: search, $options: 'i' } }, ]; }
    if (location) { query.location = { $regex: location, $options: 'i' }; }

    const users = await User.find(query)
      .populate('skills')
      .select('-password')
      .sort('-rating');
      
    const usersWithCoords = users.map(attachCoordinates);
    res.json(usersWithCoords);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get user by ID (Used by GET /api/users/:id)
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate(['skills', 'learningSkills'])
      .select('-password');

    if (!user) { return res.status(404).json({ message: 'User not found' }); }
    res.json(attachCoordinates(user));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update user (Used by PUT /api/users/:id)
// *** THIS IS THE FUNCTION YOUR ROUTER CRASHED ON ***
exports.updateUser = async (req, res) => {
  try {
    // Check if user is updating their own profile
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
// **********************************************

// @desc    Delete user (Used by DELETE /api/users/:id)
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


// @desc    Search for users
// @route   GET /api/users/search
// @access  Public
exports.searchUsers = async (req, res) => {
  try {
    const { name, location, skill, userId } = req.query; 
    let query = {};
    if (name || location || skill) {
      if (name) { query.$or = [ { name: { $regex: name, $options: 'i' } }, { bio: { $regex: name, $options: 'i' } } ]; }
      if (location) {
        if (query.$or) { query = { $and: [ { $or: query.$or }, { location: { $regex: location, $options: 'i' } } ] }; } 
        else { query.location = { $regex: location, $options: 'i' }; }
      }
      if (skill) {
        const skillDoc = await Skill.findOne({ name: { $regex: `^${skill}$`, $options: 'i' } });
        if (skillDoc) {
           if (query.$and || query.$or || query.location) {
             if (query.$and) { query.$and.push({ skills: skillDoc._id }); } 
             else if (query.$or){ query = {$and: [ {$or: query.$or}, {skills: skillDoc._id} ]}; } 
             else { query = {$and: [ {location: query.location}, {skills: skillDoc._id} ]}; }
           } else { query.skills = skillDoc._id; }
        } else { return res.json([]); }
      }
    }
    else if (userId) { 
      const currentUser = await User.findById(userId).select('learningSkills skills');
      if (currentUser) {
        let matchingSkillIds = [];
        if (currentUser.learningSkills && currentUser.learningSkills.length > 0) {
            matchingSkillIds = currentUser.learningSkills;
            query.skills = { $in: matchingSkillIds };
        } else if (currentUser.skills && currentUser.skills.length > 0) {
            matchingSkillIds = currentUser.skills;
            query.learningSkills = { $in: matchingSkillIds };
        }
        if (matchingSkillIds.length > 0) { query._id = { $ne: userId }; }
      }
    } 
    if (Object.keys(query).length === 0 && userId) { query._id = { $ne: userId }; }

    const users = await User.find(query)
      .populate('skills', 'name') 
      .populate('learningSkills', 'name')
      .select('name bio location skills learningSkills avatar rating reviewCount') 
      .limit(50); 
      
    const usersWithCoords = users.map(attachCoordinates);
    res.json(usersWithCoords);

  } catch (error) {
    console.error('Error in searchUsers:', error);
    res.status(500).json({ message: 'Server error during user search' });
  }
};