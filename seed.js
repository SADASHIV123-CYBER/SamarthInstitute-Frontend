require('dotenv').config({ path: './server/.env' });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./server/src/models/User');

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB');

    // Clear existing
    await User.deleteMany({});

    // Create admin
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@coaching.com',
      password: 'admin123',
      role: 'admin',
    });

    // Create student
    const student = await User.create({
      name: 'Student Demo',
      email: 'student@coaching.com',
      password: 'student123',
      role: 'student',
      class: '12',
      targetExam: 'NEET',
      mobile: '9876543210',
      feesPaid: true,
    });

    console.log('Seed completed');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seed();