// server/seed.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db'); // Adjust path if needed
const Skill = require('./models/Skill');
const User = require('./models/User');
const Session = require('./models/Session'); 
const bcrypt = require('bcryptjs'); 

dotenv.config();

// --- Data Sources ---
const firstNames = ['Aarav', 'Vivaan', 'Aditya', 'Vihaan', 'Arjun', 'Sai', 'Reyansh', 'Ayaan', 'Krishna', 'Ishaan', 'Shaurya', 'Atharv', 'Advik', 'Pranav', 'Ansh', 'Kian', 'Rudra', 'Parth', 'Shivansh', 'Veer', 'Dhruv', 'Kabir', 'Aryan', 'Aarush', 'Mohammed', 'Rian', 'Neel', 'Om', 'Vedant', 'Yash', 'Aanya', 'Saanvi', 'Aadya', 'Ananya', 'Diya', 'Pari', 'Myra', 'Anika', 'Dhriti', 'Kiara', 'Anvi', 'Siya', 'Ishita', 'Riya', 'Navya', 'Avni', 'Sara', 'Anushka', 'Advika', 'Mahi', 'Pihu', 'Khushi', 'Shanaya', 'Amaira', 'Zara', 'Samaira', 'Mishka', 'Prisha', 'Trisha'];
const lastNames = ['Sharma', 'Verma', 'Gupta', 'Singh', 'Kumar', 'Patel', 'Shah', 'Khan', 'Reddy', 'Yadav', 'Jain', 'Mehta', 'Das', 'Roy', 'Nair', 'Iyer', 'Menon', 'Rao', 'Pillai', 'Agarwal', 'Malhotra', 'Kapoor', 'Chopra', 'Bhatia', 'Joshi', 'Pandey', 'Mishra', 'Trivedi', 'Chatterjee', 'Banerjee'];
const locations = ['Bhubaneswar, Odisha', 'Cuttack, Odisha', 'Puri, Odisha', 'Rourkela, Odisha', 'Sambalpur, Odisha', 'Mumbai, Maharashtra', 'Delhi, Delhi', 'Bangalore, Karnataka', 'Hyderabad, Telangana', 'Chennai, Tamil Nadu', 'Kolkata, West Bengal', 'Pune, Maharashtra', 'Ahmedabad, Gujarat', 'Jaipur, Rajasthan', 'Lucknow, Uttar Pradesh'];
const sessionTitles = [
    'Beginner\'s Guide to React', 'Mastering MongoDB Queries', 'Python Data Analysis with Pandas',
    'Introduction to Figma for UI/UX', 'Advanced Tailwind CSS Techniques', 'Node.js Express API Workshop',
    'Intro to Guitar Chords', 'Sourdough Baking Fundamentals', 'Home Plumbing for Beginners', 'Effective Digital Marketing'
];

// List of skills (must be kept consistent)
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

// Helper functions
const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];
const getRandomMultiple = (arr, count) => {
  const shuffled = arr.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected for Seeding...');

    // --- CLEAR ALL DATA ---
    await Session.deleteMany({});
    await User.deleteMany({});
    await Skill.deleteMany({});
    console.log('All existing data cleared.');

    // --- 1. Seed Skills ---
    const skillDocsData = skillsToSeed.map(name => ({ name: name.toLowerCase() }));
    const seededSkills = await Skill.insertMany(skillDocsData);
    const skillMap = new Map(seededSkills.map(skill => [skill.name, skill._id]));
    console.log(`Seeded ${seededSkills.length} skills.`);

    // --- 2. Seed Users ---
    const dummyUsers = [];
    const numberOfUsers = 60;
    const defaultPassword = 'password123';
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);
    
    let userDocs = [];

    for (let i = 0; i < numberOfUsers; i++) {
      const firstName = getRandom(firstNames);
      const lastName = getRandom(lastNames);
      const name = `${firstName} ${lastName}`;
      const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@example.com`;
      const location = getRandom(locations);
      
      const userSkillNames = getRandomMultiple(skillsToSeed, Math.floor(Math.random() * 6) + 3);
      const userSkillIds = userSkillNames.map(skillName => skillMap.get(skillName.toLowerCase())).filter(id => id);

      dummyUsers.push({
        name,
        email,
        password: hashedPassword,
        location,
        bio: `Hi, I'm ${firstName}! Skilled in ${userSkillNames.slice(0, 2).join(' and ')}. Looking to connect and share knowledge in ${location.split(',')[0]}.`,
        skills: userSkillIds,
        rating: (Math.random() * 2 + 3).toFixed(1),
        reviewCount: Math.floor(Math.random() * 50) + 5,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`,
      });
    }

    userDocs = await User.insertMany(dummyUsers);
    console.log(`Seeded ${userDocs.length} users.`);
    
    // --- 3. Seed Sessions ---
    console.log('Seeding 10 dummy sessions...');
    const now = new Date();
    const sessionsData = [];
    const availableSkillNames = ['react', 'mongodb', 'python', 'figma', 'tailwind css', 'guitar lessons', 'baking', 'plumbing', 'digital marketing', 'writing'];
    
    // Ensure all 10 instructors are valid users
    const instructors = getRandomMultiple(userDocs, 10);
    
    for (let i = 0; i < 10; i++) {
        const instructor = instructors[i];
        const skillName = availableSkillNames[i % availableSkillNames.length];
        const skillId = skillMap.get(skillName);
        
        // --- FIX: Schedule sessions AT LEAST 3 days in the future to avoid time zone/clock drift issues ---
        const futureDate = new Date(now.getTime() + (3 * 24 * 60 * 60 * 1000)); 
        futureDate.setHours(10 + (i * 3) % 6, 0, 0, 0); // Base time starting 3 days from now
        futureDate.setDate(futureDate.getDate() + Math.floor(i / 6)); // Spread sessions over next couple of days

        
        // Randomly select 2-4 attendees (excluding the instructor)
        const potentialAttendees = userDocs.filter(u => u._id.toString() !== instructor._id.toString());
        const attendeeDocs = getRandomMultiple(potentialAttendees, Math.floor(Math.random() * 3) + 2);
        const attendeeIds = attendeeDocs.map(a => a._id);
        
        sessionsData.push({
            title: sessionTitles[i % sessionTitles.length],
            description: `Learn the fundamentals of ${skillName} in this interactive session.`,
            skill: skillId,
            instructor: instructor._id,
            dateTime: futureDate, // Use the safe future date
            durationMinutes: [60, 90, 120][i % 3],
            price: [10, 25, 40][i % 3],
            maxAttendees: 10,
            attendees: attendeeIds,
        });
    }

    await Session.insertMany(sessionsData);
    console.log('Seeded 10 sessions.');

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