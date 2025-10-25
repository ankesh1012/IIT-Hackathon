// server/models/Session.js
const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a session title'],
    trim: true,
    maxlength: 100,
  },
  description: {
    type: String,
    maxlength: 500,
  },
  skill: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Skill',
    required: [true, 'Please specify the skill being taught'],
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  dateTime: {
    type: Date,
    required: [true, 'Please specify the session date and time'],
  },
  durationMinutes: {
    type: Number,
    required: [true, 'Please specify the duration in minutes'],
    min: 15,
    default: 60,
  },
  price: {
    type: Number,
    required: [true, 'Please specify the session price'],
    min: 0,
    default: 0,
  },
  maxAttendees: {
    type: Number,
    min: 1,
    default: 10,
  },
  attendees: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Session', sessionSchema);