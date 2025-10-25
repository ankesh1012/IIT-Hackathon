const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a skill name'],
    trim: true,
  },
  category: {
    type: String,
    required: [true, 'Please provide a category'],
    enum: [
      'Arts & Crafts',
      'Music',
      'Technology',
      'Languages',
      'Sports & Fitness',
      'Cooking',
      'Gardening',
      'Other',
    ],
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
    maxlength: 1000,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  level: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
    default: 'Intermediate',
  },
  availability: {
    type: [String],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Skill', skillSchema);