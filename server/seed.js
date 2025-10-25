const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Skill = require('./models/Skill');

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    // Clear existing data
    await User.deleteMany({});
    await Skill.deleteMany({});
    
    // Create sample users
    const users = await User.create([
      {
        name: 'Sarah Johnson',
        email: 'sarah@example.com',
        password: 'password123',
        location: 'Brooklyn, NY',
        bio: 'Passionate designer helping local businesses grow',
        rating: 4.9,
        reviewCount: 28
      },
      {
        name: 'Mike Chen',
        email: 'mike@example.com',
        password: 'password123',
        location: 'Brooklyn, NY',
        bio: 'Music teacher with 10 years experience',
        rating: 4.8,
        reviewCount: 45
      }
    ]);
    
    // Create sample skills
    await Skill.create([
      {
        name: 'Web Design',
        category: 'Technology',
        description: 'Professional web design for modern websites',
        user: users[0]._id,
        level: 'Expert'
      },
      {
        name: 'Guitar Lessons',
        category: 'Music',
        description: 'Beginner to advanced guitar instruction',
        user: users[1]._id,
        level: 'Advanced'
      }
    ]);
    
    console.log('Database seeded successfully!');
    process.exit();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedData();