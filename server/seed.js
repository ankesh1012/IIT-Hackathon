// server/seed.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db'); // Adjust path to your db config
const Skill = require('./models/Skill');

dotenv.config();

// Your list of 100+ skills
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
  'Auth0', 'Firebase', 'Supabase', 'Webflow', 'WordPress', 'Shopify'
  // ... feel free to add more
];

const seedSkills = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    // Clear existing skills
    await Skill.deleteMany({});
    console.log('Skills cleared...');

    // Format skills for insertion (all lowercase)
    const skills = skillsToSeed.map(name => ({ name: name.toLowerCase() }));

    // Insert new skills
    await Skill.insertMany(skills);
    console.log(`Seeded ${skills.length} skills successfully!`);
    
  } catch (err) {
    console.error('Error seeding skills:', err.message);
  } finally {
    mongoose.connection.close();
    process.exit();
  }
};

seedSkills();