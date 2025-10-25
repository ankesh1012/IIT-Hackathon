// server/seed.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db'); // Adjust path if needed
const Skill = require('./models/Skill');
const User = require('./models/User');
const bcrypt = require('bcryptjs'); // Needed to hash password if User model doesn't handle it

dotenv.config();

// --- Data Sources ---
const firstNames = ['Aarav', 'Vivaan', 'Aditya', 'Vihaan', 'Arjun', 'Sai', 'Reyansh', 'Ayaan', 'Krishna', 'Ishaan', 'Shaurya', 'Atharv', 'Advik', 'Pranav', 'Ansh', 'Kian', 'Rudra', 'Parth', 'Shivansh', 'Veer', 'Dhruv', 'Kabir', 'Aryan', 'Aarush', 'Mohammed', 'Rian', 'Neel', 'Om', 'Vedant', 'Yash', 'Aanya', 'Saanvi', 'Aadya', 'Ananya', 'Diya', 'Pari', 'Myra', 'Anika', 'Dhriti', 'Kiara', 'Anvi', 'Siya', 'Ishita', 'Riya', 'Navya', 'Avni', 'Sara', 'Anushka', 'Advika', 'Mahi', 'Pihu', 'Khushi', 'Shanaya', 'Amaira', 'Zara', 'Samaira', 'Mishka', 'Prisha', 'Trisha'];
const lastNames = ['Sharma', 'Verma', 'Gupta', 'Singh', 'Kumar', 'Patel', 'Shah', 'Khan', 'Reddy', 'Yadav', 'Jain', 'Mehta', 'Das', 'Roy', 'Nair', 'Iyer', 'Menon', 'Rao', 'Pillai', 'Agarwal', 'Malhotra', 'Kapoor', 'Chopra', 'Bhatia', 'Joshi', 'Pandey', 'Mishra', 'Trivedi', 'Chatterjee', 'Banerjee'];
const locations = ['Bhubaneswar, Odisha', 'Cuttack, Odisha', 'Puri, Odisha', 'Rourkela, Odisha', 'Sambalpur, Odisha', 'Mumbai, Maharashtra', 'Delhi, Delhi', 'Bangalore, Karnataka', 'Hyderabad, Telangana', 'Chennai, Tamil Nadu', 'Kolkata, West Bengal', 'Pune, Maharashtra', 'Ahmedabad, Gujarat', 'Jaipur, Rajasthan', 'Lucknow, Uttar Pradesh'];

// Your list of skills (keep this updated)
const skillsToSeed = [
  'React', 'JavaScript', 'Node.js', 'Python', 'Java', 'HTML', 'CSS', 'Tailwind CSS',
  'MongoDB', 'SQL', 'MySQL', 'PostgreSQL', 'Express.js', 'TypeScript', 'Angular', 
  'Vue.js', 'C++', 'C#', 'Go', 'Ruby', 'PHP', 'Swift', 'Kotlin', 'Next.js', 'Gatsby', 
  'Svelte', 'GraphQL', 'REST APIs', 'Docker', 'Kubernetes', 'AWS', 'Azure', 
  'Google Cloud', 'Git', 'GitHub', 'CI/CD', 'Jenkins', 'Terraform', 'Agile', 'Scrum',
  'Jira', 'Figma', 'Adobe XD', 'Sketch', 'UI Design', 'UX Design',
  'Data Structures', 'Algorithms', 'Machine Learning', 'Data Science', 'TensorFlow',
  'PyTorch', 'Pandas', 'NumPy', 'Scikit-learn', 'R', 'DevOps', 'Linux',
  'Spring Boot', 'Django', 'Flask', 'Ruby on Rails', 'Laravel', 'ASP.NET',
  'Unity', 'Unreal Engine', 'Android Development', 'iOS Development',
  'React Native', 'Flutter', 'Elixir', 'Rust', 'Scala', 'Perl', 'Power BI',
  'Tableau', 'Data Visualization', 'SEO', 'Content Marketing', 'Digital Marketing',
  'Copywriting', 'Graphic Design', 'Illustration', 'Logo Design', 'Video Editing',
  'Photography', 'Project Management', 'Product Management', 'Cybersecurity',
  'Network Security', 'Penetration Testing', 'Blockchain', 'Solidity',
  'Auth0', 'Firebase', 'Supabase', 'Webflow', 'WordPress', 'Shopify',
  'Gardening', 'Plumbing', 'Math Tutor', 'Painting', 'Home Repair', 'Cooking',
  'Baking', 'Yoga Instructor', 'Personal Trainer', 'Electrician', 'Carpenter',
  'Writing', 'Editing', 'Translation', 'Music Teacher', 'Dance Instructor'
];

// Helper function to get random item from array
const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

// Helper function to get multiple random items (unique)
const getRandomMultiple = (arr, count) => {
  const shuffled = arr.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

const seedDatabase = async () => {
  try {
    await connectDB();
    console.log('MongoDB Connected for Seeding...');

    // --- 1. Seed Skills ---
    console.log('Clearing existing skills...');
    await Skill.deleteMany({});
    const skillDocsData = skillsToSeed.map(name => ({ name: name.toLowerCase() }));
    const seededSkills = await Skill.insertMany(skillDocsData);
    console.log(`Seeded ${seededSkills.length} skills.`);
    // Create a map for easy lookup
    const skillMap = new Map(seededSkills.map(skill => [skill.name, skill._id]));

    // --- 2. Seed Users ---
    console.log('Clearing existing users...');
    await User.deleteMany({});

    const dummyUsers = [];
    const numberOfUsers = 60; // Set how many users you want
    const defaultPassword = 'password123'; // Use a default password
    const hashedPassword = await bcrypt.hash(defaultPassword, 10); // Hash it once

    for (let i = 0; i < numberOfUsers; i++) {
      const firstName = getRandom(firstNames);
      const lastName = getRandom(lastNames);
      const name = `${firstName} ${lastName}`;
      const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@example.com`; // Unique email
      const location = getRandom(locations);
      
      // Select 3 to 8 random skills for the user
      const userSkillNames = getRandomMultiple(skillsToSeed, Math.floor(Math.random() * 6) + 3);
      const userSkillIds = userSkillNames.map(skillName => skillMap.get(skillName.toLowerCase())).filter(id => id); // Get ObjectIDs

      dummyUsers.push({
        name,
        email,
        password: hashedPassword, // Use the pre-hashed password
        location,
        bio: `Hi, I'm ${firstName}! Skilled in ${userSkillNames.slice(0, 2).join(' and ')}. Looking to connect and share knowledge in ${location.split(',')[0]}.`,
        skills: userSkillIds,
        rating: (Math.random() * 2 + 3).toFixed(1), // Rating between 3.0 and 5.0
        reviewCount: Math.floor(Math.random() * 50) + 5, // 5 to 54 reviews
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`, // Auto-generated avatar
      });
    }

    const seededUsers = await User.insertMany(dummyUsers);
    console.log(`Seeded ${seededUsers.length} users.`);

    console.log('Database seeded successfully!');

  } catch (err) {
    console.error('Error seeding database:', err);
  } finally {
    mongoose.connection.close();
    console.log('MongoDB Connection Closed.');
    process.exit();
  }
};

seedDatabase();