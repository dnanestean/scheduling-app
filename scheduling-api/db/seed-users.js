const bcrypt = require('bcrypt');
const { User, PTO } = require('../models');

async function seedUsers() {
  try {
    
    await PTO.drop();
    await User.sync({ force: true });
    await User.bulkCreate([
      {
        username: 'admin',
        password: await bcrypt.hash('password123', 10),
        role: 'admin',
        name: 'Admin User',
        country: 'USA',
      },
      {
        username: 'testuser',
        password: await bcrypt.hash('password123', 10),
        role: 'user',
        name: 'Test User',
        country: 'Canada',
      },
    ]);
    console.log('Users seeded successfully');
  } catch (error) {
    console.error('Seed Users error:', error);
  }
}
seedUsers();