// server/controllers/projectController.js

const Project = require('../models/Project');
const User = require('../models/User');
const Skill = require('../models/Skill');

// @desc    Get all open projects
// @route   GET /api/projects
// @access  Public
exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ status: 'Open' })
      .populate('creator', 'name location avatar')
      .populate('skillsNeeded', 'name')
      .populate('volunteers', 'name')
      .sort({ createdAt: -1 });

    res.json(projects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching projects.' });
  }
};

// @desc    Get all projects created or joined by the logged-in user
// @route   GET /api/projects/me
// @access  Private
exports.getProjectsForUser = async (req, res) => { // <--- NEW FUNCTION
  try {
    const userId = req.user._id;

    const projects = await Project.find({
      $or: [
        { creator: userId },
        { volunteers: userId },
      ],
    })
      .populate('creator', 'name location avatar')
      .populate('skillsNeeded', 'name')
      .populate('volunteers', 'name')
      .sort({ createdAt: -1 });

    res.json(projects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching user projects.' });
  }
};

// @desc    Create a new community project
// @route   POST /api/projects
// @access  Private
exports.createProject = async (req, res) => {
  const { title, description, skills, volunteersNeeded, location } = req.body;

  try {
    // 1. Convert skill names (strings) to skill IDs
    const skillDocs = await Skill.find({ name: { $in: skills } });
    const skillIds = skillDocs.map(doc => doc._id);

    if (skillIds.length !== skills.length) {
      return res.status(400).json({ message: 'One or more specified skills were not found.' });
    }

    // 2. Create the project
    const project = await Project.create({
      title,
      description,
      skillsNeeded: skillIds,
      volunteersNeeded: parseInt(volunteersNeeded),
      location,
      creator: req.user._id,
      volunteers: [], // Starts empty
    });

    res.status(201).json(project);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error creating project.' });
  }
};

// @desc    User joins a project
// @route   POST /api/projects/:id/join
// @access  Private
exports.joinProject = async (req, res) => {
  try {
    const projectId = req.params.id;
    const userId = req.user._id;

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: 'Project not found.' });
    }
    if (project.status !== 'Open') {
      return res.status(400).json({ message: 'This project is no longer accepting volunteers.' });
    }
    if (project.creator.toString() === userId.toString()) {
      return res.status(400).json({ message: 'Cannot volunteer for a project you proposed.' });
    }
    if (project.volunteers.includes(userId)) {
      return res.status(400).json({ message: 'You have already joined this project.' });
    }
    if (project.volunteers.length >= project.volunteersNeeded) {
      return res.status(400).json({ message: 'The project is full.' });
    }

    // Add user to volunteers list
    project.volunteers.push(userId);
    await project.save();

    res.json({ message: 'Successfully joined the project as a volunteer!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error joining project.' });
  }
};