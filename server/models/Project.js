// server/models/Project.js
const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a project title'],
    trim: true,
    maxlength: 150,
  },
  description: {
    type: String,
    required: [true, 'Please provide a project description'],
    maxlength: 2000,
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  status: {
    type: String,
    enum: ['Open', 'In Progress', 'Completed', 'Canceled'],
    default: 'Open',
  },
  skillsNeeded: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Skill',
    },
  ],
  volunteersNeeded: {
    type: Number,
    required: [true, 'Specify the number of volunteers needed'],
    min: 1,
  },
  volunteers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  location: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Project', projectSchema);