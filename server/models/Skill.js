// server/models/Skill.js

const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a skill name'],
    trim: true,
    unique: true, // Ensures "React" can only be in the database once
    lowercase: true,
  },
});

module.exports = mongoose.model('Skill', skillSchema);