const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const Habit = require('./models/Habit');

async function seedData() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  await User.deleteMany();
  await Habit.deleteMany();

  const salt = await bcrypt.genSalt(10);
  const password = await bcrypt.hash('password123', salt);

  const demoUser = new User({
    email: 'demo@example.com',
    password
  });
  await demoUser.save();
  console.log('Created Demo User: demo@example.com / password123');

  const habits = ['Morning Jog', 'Read 20 Pages', 'Meditate 10 Mins', 'Code 1 hour'];
  
  const currentDate = new Date();
  const yearMonth = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}`;

  for (const name of habits) {
    const entries = [];
    const maxDays = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    
    // Randomize completions
    for (let day = 1; day <= maxDays; day++) {
      if (Math.random() > 0.3) {
        entries.push({ day, completed: true });
      }
    }

    const h = new Habit({
      userId: demoUser._id,
      name,
      entries: new Map([[yearMonth, entries]])
    });
    
    await h.save();
  }

  console.log('Created Habits and example dataset.');
  process.exit();
}

seedData();
