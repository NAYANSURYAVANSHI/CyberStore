const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

// Load env vars
dotenv.config();

// Admin user data
const adminData = {
  username: 'admin',
  email: 'admin@ecommerce.com',
  password: 'admin123',
  role: 'admin',
};

// Connect to MongoDB and create admin user
const createAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminData.email });
    if (existingAdmin) {
      console.log('Admin user already exists!');
      console.log('Email:', adminData.email);
      console.log('Password: admin123');
      process.exit(0);
    }

    // Create admin user
    const admin = await User.create(adminData);
    console.log('Admin user created successfully!');
    console.log('\nAdmin Credentials:');
    console.log('Email:', adminData.email);
    console.log('Password: admin123');
    console.log('\nPlease change the password after first login!');

    process.exit(0);
  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  }
};

createAdmin();
