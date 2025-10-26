// server/controllers/sessionController.js

const Session = require('../models/Session');
const User = require('../models/User');
const Skill = require('../models/Skill');

// @desc    Get all future sessions for public viewing/joining
// @route   GET /api/sessions/public
// @access  Public
exports.getAllPublicSessions = async (req, res) => {
  try {
    const sessions = await Session.find({
      dateTime: { $gte: new Date() } // Only show future sessions
    })
      .populate('instructor', 'name avatar')
      .populate('skill', 'name')
      .populate('attendees', 'name')
      .sort({ dateTime: 1 });

    res.json(sessions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching public sessions.' });
  }
};

// @desc    Create a new session
// @route   POST /api/sessions
// @access  Private
exports.createSession = async (req, res) => {
  const { title, description, skillName, dateTime, durationMinutes, price, maxAttendees } = req.body;

  try {
    // 1. Find the skill ID (case-insensitive)
    const skillDoc = await Skill.findOne({ name: { $regex: new RegExp(`^${skillName}$`, 'i') } });
    if (!skillDoc) {
      return res.status(400).json({ message: 'Skill not found in the database.' });
    }

    // 2. Basic validation: Don't schedule sessions in the past
    if (new Date(dateTime) < new Date()) {
        return res.status(400).json({ message: 'Cannot schedule a session in the past.' });
    }

    // 3. Create the session
    const session = await Session.create({
      title,
      description,
      skill: skillDoc._id,
      instructor: req.user._id, // Set the logged-in user as instructor
      dateTime,
      durationMinutes,
      price,
      maxAttendees,
    });

    res.status(201).json(session);
  } catch (error) {
    console.error(error);
    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map(val => val.message);
        return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: 'Server error during session creation.' });
  }
};

// @desc    Get all sessions for the logged-in user (as instructor or attendee)
// @route   GET /api/sessions/me
// @access  Private
exports.getSessionsForUser = async (req, res) => {
  try {
    const userId = req.user._id;

    // Find sessions where the user is the instructor OR an attendee
    const sessions = await Session.find({
      $or: [
        { instructor: userId },
        { attendees: userId },
      ],
    })
      .populate('instructor', 'name avatar email')
      .populate('skill', 'name')
      .populate('attendees', 'name')
      .sort({ dateTime: 1 });

    res.json(sessions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching user sessions.' });
  }
};

// @desc    User joins a session
// @route   POST /api/sessions/:id/join
// @access  Private
exports.joinSession = async (req, res) => {
  try {
    const sessionId = req.params.id;
    const userId = req.user._id;

    const session = await Session.findById(sessionId);

    if (!session) {
      return res.status(404).json({ message: 'Session not found.' });
    }
    if (session.instructor.toString() === userId.toString()) {
      return res.status(400).json({ message: 'Cannot join your own session.' });
    }
    if (session.attendees.map(id => id.toString()).includes(userId.toString())) {
      return res.status(400).json({ message: 'You have already joined this session.' });
    }
    if (session.attendees.length >= session.maxAttendees) {
      return res.status(400).json({ message: 'This session is full.' });
    }
    if (session.dateTime < new Date()) {
        return res.status(400).json({ message: 'Cannot join a session that has already started.' });
    }

    // Add user to attendees list
    session.attendees.push(userId);
    await session.save();

    res.json({ message: 'Successfully joined session!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error joining session.' });
  }
};